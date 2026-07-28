// Typed client for the account and tier endpoints.
//
// This module deliberately does NOT import lib/firebase: lib/firebase calls
// syncAccount after a sign-in, and an import back the other way would be a
// cycle. Every function here takes the ID token as an argument instead.
//
// Every number the product promises lives on the server (internal/tiers, fed by
// TIER_* config) and reaches the UI through here. Nothing in the UI may
// hard-code a limit — see the tier matrix in the v14 brief.

import { getBaseURL } from '@/lib/utils';

export type Tier = 'anonymous' | 'free' | 'premium';

/** Mirrors internal/tiers.Limits. Field names are its JSON tags. */
export interface TierLimits {
  opsPerDay: number;
  aiOpsPerDay: number;
  maxFileBytes: number;
  maxVideoSeconds: number;
  maxOutputHeight: number;
  maxLadderHeight: number;
  /** -1 means unlimited. */
  studioProjects: number;
  batchEnabled: boolean;
  priorityGpu: boolean;
  resultRetentionHours: number;
  adsRemoved: boolean;
}

/** The countable metrics, matching internal/models' Metric* constants. */
export type UsageMetric = 'ops' | 'ai_ops' | 'export';

export interface AccountUser {
  id: string;
  firebaseUid: string;
  email?: string;
  emailVerified: boolean;
  tier: string;
  tierSource: string;
  tierExpiresAt?: string;
  displayName?: string;
  createdAt: string;
}

/** The shared shape of /api/account/me, /sync and /usage. */
export interface AccountSnapshot {
  tier: Tier;
  limits: TierLimits;
  usage: Partial<Record<UsageMetric, number>>;
  resetsAt: string;
  user?: AccountUser;
  anonymous: boolean;
}

export interface TierDescriptor {
  tier: Tier;
  limits: TierLimits;
}

export interface TiersResponse {
  tiers: TierDescriptor[];
  premiumPurchasable: boolean;
  premiumPriceUSD: number;
}

/** The body of a 429 from the quota middleware. */
export interface QuotaExceeded {
  error: 'quota_exceeded';
  tier: Tier;
  metric: UsageMetric;
  limit: number;
  used: number;
  resetsAt: string;
  /** 'signup' asks an anonymous visitor for a free account; 'premium' upsells. */
  upgradePath: 'signup' | 'premium';
}

/** Response headers the quota middleware sets on every gated request. */
export const QUOTA_HEADERS = {
  limit: 'X-MM-Quota-Limit',
  remaining: 'X-MM-Quota-Remaining',
  reset: 'X-MM-Quota-Reset',
  tier: 'X-MM-Tier',
} as const;

export interface QuotaHeaderState {
  tier?: Tier;
  limit?: number;
  remaining?: number;
  resetsAt?: string;
}

/**
 * Reads the four X-MM-* quota headers off a response.
 *
 * They are only visible cross-origin because the API lists them in the CORS
 * ExposeHeaders set; if that ever regresses this silently returns nothing and
 * the meter falls back to polling, rather than breaking the request.
 */
export function readQuotaHeaders(response: Response): QuotaHeaderState | null {
  const tier = response.headers.get(QUOTA_HEADERS.tier);
  const limit = response.headers.get(QUOTA_HEADERS.limit);
  const remaining = response.headers.get(QUOTA_HEADERS.remaining);
  const resetsAt = response.headers.get(QUOTA_HEADERS.reset);
  if (!tier && !limit && !remaining && !resetsAt) return null;

  const state: QuotaHeaderState = {};
  if (tier === 'anonymous' || tier === 'free' || tier === 'premium') state.tier = tier;
  if (limit !== null && Number.isFinite(Number(limit))) state.limit = Number(limit);
  if (remaining !== null && Number.isFinite(Number(remaining))) state.remaining = Number(remaining);
  if (resetsAt) state.resetsAt = resetsAt;
  return state;
}

/** Narrows an unknown error body to the quota 429 shape. */
export function isQuotaExceeded(body: unknown): body is QuotaExceeded {
  return (
    typeof body === 'object' &&
    body !== null &&
    (body as { error?: unknown }).error === 'quota_exceeded'
  );
}

function authHeaders(idToken?: string | null): Record<string, string> {
  return idToken ? { Authorization: `Bearer ${idToken}` } : {};
}

/**
 * Creates or refreshes the mm_users row for a verified caller.
 *
 * Idempotent, and never changes a tier — sign-in is an identity event, not an
 * entitlement one. Safe to call on every session restore.
 */
export async function syncAccount(
  idToken: string,
  body: { displayName?: string; signupSource?: string } = {},
): Promise<AccountSnapshot> {
  const response = await fetch(`${getBaseURL()}/account/sync`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders(idToken) },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error(`Account sync failed (${response.status})`);
  }
  return response.json() as Promise<AccountSnapshot>;
}

export async function fetchAccount(idToken: string): Promise<AccountSnapshot> {
  const response = await fetch(`${getBaseURL()}/account/me`, {
    headers: authHeaders(idToken),
  });
  if (!response.ok) {
    throw new Error(`Could not load your account (${response.status})`);
  }
  return response.json() as Promise<AccountSnapshot>;
}

/**
 * Today's usage for whoever is asking. Works signed out — that is the point:
 * the meter has to show "3 of 5 used today" before a visitor has any reason to
 * create an account.
 */
export async function fetchUsage(
  sessionId: string,
  idToken?: string | null,
): Promise<AccountSnapshot> {
  const response = await fetch(`${getBaseURL()}/account/usage`, {
    headers: { 'X-MM-Session-ID': sessionId, ...authHeaders(idToken) },
  });
  if (!response.ok) {
    throw new Error(`Could not load usage (${response.status})`);
  }
  return response.json() as Promise<AccountSnapshot>;
}

/** The lifecycle states a job row can be in, mirroring models.JobStatus. */
export type HistoryStatus =
  | 'pending'
  | 'queued'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'cancelled';

/** One row of GET /api/account/history. Mirrors the handler's historyEntry. */
export interface HistoryEntry {
  jobId: string;
  /** Stable tool id, e.g. `convert`, `extract_audio`, `video_transcode`. */
  tool?: string;
  mode?: string;
  mediaKind?: string;
  /** Extensions only — the API never stores a source filename. */
  sourceFormat?: string;
  targetFormat?: string;
  status: HistoryStatus;
  createdAt: string;
  completedAt?: string;
  durationMs?: number;
  resultFileName?: string;
  resultExpiresAt?: string;
  /** Computed server-side, so the UI never needs to know the retention matrix. */
  expired: boolean;
  /** Absolute, short-lived presigned GET for a result stored in S3. */
  downloadUrl?: string;
  /** API-relative path for a result still served off the box's local disk. */
  downloadPath?: string;
}

export interface HistoryResponse {
  entries: HistoryEntry[];
  total: number;
  limit: number;
  offset: number;
}

/**
 * One page of the signed-in caller's own conversions, newest first.
 *
 * Signed-in only by design: the server keys history on the account, not on a
 * session id, so it follows the person rather than the browser.
 */
export async function fetchHistory(
  idToken: string,
  page: { limit?: number; offset?: number } = {},
  signal?: AbortSignal,
): Promise<HistoryResponse> {
  const params = new URLSearchParams();
  if (page.limit !== undefined) params.set('limit', String(page.limit));
  if (page.offset !== undefined) params.set('offset', String(page.offset));
  const query = params.toString();

  const response = await fetch(`${getBaseURL()}/account/history${query ? `?${query}` : ''}`, {
    headers: authHeaders(idToken),
    signal,
  });
  if (!response.ok) {
    throw new Error(`Could not load your history (${response.status})`);
  }
  return response.json() as Promise<HistoryResponse>;
}

/**
 * The URL that actually serves a history row's result, or null when there is
 * none to offer. Local results arrive as an API-relative path so the server
 * never has to guess its own public origin.
 */
export function historyDownloadHref(entry: HistoryEntry): string | null {
  if (entry.expired) return null;
  if (entry.downloadUrl) return entry.downloadUrl;
  if (entry.downloadPath) return `${getBaseURL()}${entry.downloadPath}`;
  return null;
}

/** The public tier matrix. Cacheable configuration, identical for everyone. */
export async function fetchTiers(signal?: AbortSignal): Promise<TiersResponse> {
  const response = await fetch(`${getBaseURL()}/tiers`, { signal });
  if (!response.ok) {
    throw new Error(`Could not load plans (${response.status})`);
  }
  return response.json() as Promise<TiersResponse>;
}

/** How many of `metric`'s daily allowance this tier gets. 0 means uncounted. */
export function allowanceFor(limits: TierLimits | undefined, metric: UsageMetric): number {
  if (!limits) return 0;
  switch (metric) {
    case 'ops':
    case 'export':
      return limits.opsPerDay;
    case 'ai_ops':
      return limits.aiOpsPerDay;
    default:
      return 0;
  }
}
