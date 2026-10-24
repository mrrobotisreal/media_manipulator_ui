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
import { getSessionId } from '@/lib/analytics/session';
import { getVisitorId } from '@/lib/analytics/identity';

/**
 * Mirrors internal/tiers.Tier.
 *
 * `operator` is the site's own people. It is not a plan: it never appears in
 * /api/tiers, so /pricing never renders it, and the server derives it per
 * request from a verified Firebase token — nothing in this client can ask for
 * it. The UI only has to know the value exists so the meter, the account page
 * and the upsell surfaces render it honestly (no allowance, no upgrade prompts).
 */
export type Tier = 'anonymous' | 'free' | 'premium' | 'operator';

const TIERS: readonly Tier[] = ['anonymous', 'free', 'premium', 'operator'];

/** Narrows an unknown string to a Tier. */
export function isTier(value: unknown): value is Tier {
  return typeof value === 'string' && (TIERS as readonly string[]).includes(value);
}

/**
 * Whether a tier has nothing left to upgrade to. Premium is the top of the
 * public ladder; operator is above it. Every upsell surface keys off this
 * rather than comparing against 'premium' directly, so adding a tier above
 * Premium cannot resurface a "buy Premium" prompt to someone who already
 * outranks it.
 */
export function isTopTier(tier: Tier): boolean {
  return tier === 'premium' || tier === 'operator';
}

/**
 * The server's sentinel for "no cap" (internal/tiers.Unlimited). Applies to
 * studioProjects on every tier and to opsPerDay / aiOpsPerDay on the operator
 * tier.
 */
export const UNLIMITED = -1;

export function isUnlimited(value: number): boolean {
  return value < 0;
}

/** Mirrors internal/tiers.Limits. Field names are its JSON tags. */
export interface TierLimits {
  /** -1 means unlimited (operator). */
  opsPerDay: number;
  /** -1 means unlimited (operator). */
  aiOpsPerDay: number;
  /** Studio exports per day (MM18). -1 means unlimited. */
  exportsPerDay: number;
  maxFileBytes: number;
  maxVideoSeconds: number;
  maxOutputHeight: number;
  maxLadderHeight: number;
  /** -1 means unlimited. */
  studioProjects: number;
  priorityGpu: boolean;
  resultRetentionHours: number;
  adsRemoved: boolean;
  /** Operator only: the per-route hourly abuse buckets are skipped. */
  rateLimitExempt?: boolean;
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
/**
 * Where the signed-in address stands with the server's operator allowlist.
 * 'unverified' is the one that matters: listed, but the Firebase email is not
 * verified, so the server (correctly) refuses the tier until it is.
 */
export type OperatorEligibility = 'none' | 'unverified' | 'granted';

export interface AccountSnapshot {
  tier: Tier;
  limits: TierLimits;
  usage: Partial<Record<UsageMetric, number>>;
  resetsAt: string;
  user?: AccountUser;
  anonymous: boolean;
  /** The verified ID token's own email_verified claim. */
  emailVerified?: boolean;
  /** Present for signed-in callers only. */
  operatorEligibility?: OperatorEligibility;
}

export interface TierDescriptor {
  tier: Tier;
  limits: TierLimits;
}

export interface TiersResponse {
  tiers: TierDescriptor[];
  premiumPurchasable: boolean;
  premiumPriceUSD: number;
  /** Yearly price in USD (MM17). Absent on older APIs. */
  premiumPriceYearlyUSD?: number;
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
  if (isTier(tier)) state.tier = tier;
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
  /**
   * Which cached metadata reports exist (additive; absent on older APIs). Stays true after
   * the media itself has expired: the metadata routes read the cached JSON, not the file.
   */
  metadataAvailable?: { original: boolean; result: boolean };
  /**
   * MM23/MM25 (account.go historyEntry): the ledger row governing this result. Omitted for
   * jobs created before the ledger existed (no row means no keep-longer, no "Deletes on").
   */
  retainedObjectId?: string;
  /** RFC 3339: when the sweeper deletes the result (ledger expires_at). */
  deletesOn?: string;
  /** True when a "keep longer" pin pushed the deadline past the account's window. */
  keptLonger?: boolean;
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

/**
 * How many of `metric`'s daily allowance this tier gets. 0 means uncounted,
 * and a negative value (UNLIMITED) means counted nowhere and capped nowhere —
 * callers that render a gauge must treat both as "no bar to fill".
 */
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


// --- Billing (MM17 wire shapes: internal/handlers/billing.go) -----------------------------

export type BillingInterval = 'monthly' | 'yearly';

/** GET /api/billing/status. 200 with purchasable:false when billing is off. */
export interface BillingStatus {
  purchasable: boolean;
  interval: BillingInterval | null;
  /** Stripe subscription status mirror: active, trialing, past_due, canceled, ... */
  status: string | null;
  renewsAt: string | null;
  cancelAtPeriodEnd: boolean;
  portalAvailable: boolean;
  /** Present only while a team-granted Premium is live; expiresAt null = no end date. */
  manualGrant: { expiresAt: string | null } | null;
  /**
   * Consecutive paid billing periods on the current subscription. Additive and NOT sent by the
   * API today (MM33 feature-detects it): the yearly nudge shows only when this is a number.
   */
  periodsPaid?: number;
}

/** GET /api/billing/session/:id. */
export interface CheckoutSessionVerdict {
  belongsToUser: boolean;
  paid: boolean;
  tierApplied: boolean;
}

export type BillingRefusalReason =
  | 'already_subscribed'
  | 'manual_grant_active'
  | 'billing_unavailable'
  | 'operator_account'
  | 'account_not_synced'
  | 'no_billing_account'
  | 'billing_provider_error'
  | 'unauthorized'
  | 'unknown';

/** A structured refusal from a billing route; `reason` is the server's code. */
export class BillingRefusal extends Error {
  readonly reason: BillingRefusalReason;
  readonly status: number;
  /** already_subscribed: whether the Portal can be opened instead. */
  readonly portalAvailable?: boolean;
  /** manual_grant_active: when the grant ends (null = never). */
  readonly expiresAt?: string | null;

  constructor(
    reason: BillingRefusalReason,
    status: number,
    extra: { portalAvailable?: boolean; expiresAt?: string | null } = {},
  ) {
    super(`Billing request refused (${status}): ${reason}`);
    this.name = 'BillingRefusal';
    this.reason = reason;
    this.status = status;
    this.portalAvailable = extra.portalAvailable;
    this.expiresAt = extra.expiresAt;
  }
}

const KNOWN_REASONS: readonly BillingRefusalReason[] = [
  'already_subscribed',
  'manual_grant_active',
  'billing_unavailable',
  'operator_account',
  'account_not_synced',
  'no_billing_account',
  'billing_provider_error',
];

async function billingRefusal(response: Response): Promise<BillingRefusal> {
  const body = (await response.json().catch(() => null)) as {
    error?: string;
    reason?: string;
    portalAvailable?: boolean;
    expiresAt?: string | null;
  } | null;
  const code = body?.reason ?? body?.error ?? '';
  const reason: BillingRefusalReason =
    response.status === 401
      ? 'unauthorized'
      : (KNOWN_REASONS as readonly string[]).includes(code)
        ? (code as BillingRefusalReason)
        : 'unknown';
  return new BillingRefusal(reason, response.status, {
    portalAvailable: body?.portalAvailable,
    expiresAt: body?.expiresAt,
  });
}

/**
 * Billing requests carry the browser's visitor and session ids: Checkout stamps them onto the
 * subscription so the server-side events join the funnel (internal/handlers/billing.go).
 */
function billingHeaders(idToken: string): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    ...authHeaders(idToken),
    'X-MM-Session-ID': getSessionId(),
    'X-MM-Visitor-ID': getVisitorId(),
  };
}

export async function createCheckoutSession(
  idToken: string,
  body: { interval: BillingInterval; locale?: string },
): Promise<{ url: string }> {
  const response = await fetch(`${getBaseURL()}/billing/checkout`, {
    method: 'POST',
    headers: billingHeaders(idToken),
    body: JSON.stringify(body),
  });
  if (!response.ok) throw await billingRefusal(response);
  return response.json() as Promise<{ url: string }>;
}

export async function createPortalSession(
  idToken: string,
  body: { locale?: string } = {},
): Promise<{ url: string }> {
  const response = await fetch(`${getBaseURL()}/billing/portal`, {
    method: 'POST',
    headers: billingHeaders(idToken),
    body: JSON.stringify(body),
  });
  if (!response.ok) throw await billingRefusal(response);
  return response.json() as Promise<{ url: string }>;
}

export async function fetchBillingStatus(idToken: string): Promise<BillingStatus> {
  const response = await fetch(`${getBaseURL()}/billing/status`, {
    headers: authHeaders(idToken),
  });
  if (!response.ok) throw await billingRefusal(response);
  return response.json() as Promise<BillingStatus>;
}

export async function verifyCheckoutSession(
  idToken: string,
  sessionId: string,
): Promise<CheckoutSessionVerdict> {
  const response = await fetch(
    `${getBaseURL()}/billing/session/${encodeURIComponent(sessionId)}`,
    { headers: authHeaders(idToken) },
  );
  if (!response.ok) throw await billingRefusal(response);
  return response.json() as Promise<CheckoutSessionVerdict>;
}

// --- 403 output_height_limited / project_limit_reached (MM18, studio.go) ----------------

/** The body of a 403 from the output-height or saved-project checks. */
export interface LimitRefusal {
  error: 'output_height_limited' | 'project_limit_reached' | 'file_too_large';
  message?: string;
  limit: number;
  requested?: number;
  used?: number;
  /** Absent for premium and operator (nothing higher to buy). */
  upgradePath?: 'signup' | 'premium';
}

/** Narrows an unknown 403 body to a plan-limit refusal. */
export function isLimitRefusal(body: unknown): body is LimitRefusal {
  if (typeof body !== 'object' || body === null) return false;
  const error = (body as { error?: unknown }).error;
  return error === 'output_height_limited' || error === 'project_limit_reached';
}

/**
 * A 413 from an upload route carries no structured body, so the refusal is synthesized
 * client-side. `limit` is 0 here ("unknown to the fetch layer"); the interstitial fills the
 * caller's real cap from the account snapshot, and the upgrade path from the tier.
 */
export function fileTooLargeRefusal(): LimitRefusal {
  return { error: 'file_too_large', limit: 0 };
}


// --- Retention, deletion and export (MM22 account_settings.go, MM24 data.go / ownership) ------

/**
 * A non-2xx answer from the MM22/MM24 routes. `code` is the handler's `error` string when it
 * sent one (`reauth_required`, `export_rate_limited`, `nothing_to_keep`, `sign_in_required`,
 * `confirm_required`, ...), else ''. `retryAfterSeconds` rides on a 429 export; `retryable`
 * and `report` on a 502 from DELETE /api/account.
 */
export class AccountApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly retryAfterSeconds?: number;
  readonly retryable?: boolean;
  readonly report?: AccountDeleteReport;

  constructor(
    status: number,
    code: string,
    extra: { message?: string; retryAfterSeconds?: number; retryable?: boolean; report?: AccountDeleteReport } = {},
  ) {
    super(extra.message || `Account request failed (${status})${code ? `: ${code}` : ''}`);
    this.name = 'AccountApiError';
    this.status = status;
    this.code = code;
    this.retryAfterSeconds = extra.retryAfterSeconds;
    this.retryable = extra.retryable;
    this.report = extra.report;
  }
}

async function accountError(response: Response): Promise<AccountApiError> {
  const body = (await response.json().catch(() => null)) as {
    error?: string;
    message?: string;
    retryAfterSeconds?: number;
    retryable?: boolean;
    status?: string;
    steps?: unknown;
  } | null;
  const header = Number(response.headers.get('Retry-After'));
  const retryAfterSeconds =
    typeof body?.retryAfterSeconds === 'number'
      ? body.retryAfterSeconds
      : Number.isFinite(header) && header > 0
        ? header
        : undefined;
  const isReport = !!body && typeof body.status === 'string' && Array.isArray(body.steps);
  return new AccountApiError(response.status, typeof body?.error === 'string' ? body.error : '', {
    message: body?.message,
    retryAfterSeconds,
    retryable: body?.retryable,
    report: isReport ? (body as unknown as AccountDeleteReport) : undefined,
  });
}

async function accountJson<T>(path: string, idToken: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${getBaseURL()}${path}`, {
    ...init,
    headers: {
      ...(init.body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...authHeaders(idToken),
    },
  });
  if (!response.ok) throw await accountError(response);
  return response.json() as Promise<T>;
}

export type HistoryVisibility = 'full' | 'names_only';

/** GET/PATCH /api/account/settings. Mirrors settingsResponse (account_settings.go). */
export interface AccountSettings {
  retentionHours: number;
  /** Always "all" today. */
  retentionScope: 'all';
  deleteMetadataReports: boolean;
  historyVisibility: HistoryVisibility;
  updatedAt: string;
  limits: { minHours: number; maxHours: number; defaultHours: number };
  /** PATCH only: live items whose expiry moved. */
  restamped?: number;
}

/** The PATCH body (settingsPatchBody). Any non-empty subset. */
export interface SettingsPatch {
  retentionHours?: number;
  deleteMetadataReports?: boolean;
  historyVisibility?: HistoryVisibility;
}

/** GET /api/account/settings/preview. Mirrors previewResponse (account_settings.go). */
export interface RetentionPreview {
  wouldDelete: { results: number; projects: number; other: number; bytes: number };
  earliestDeletionAt: string | null;
}

/** GET /api/account/settings. */
export function fetchSettings(idToken: string): Promise<AccountSettings> {
  return accountJson<AccountSettings>('/account/settings', idToken);
}

/** PATCH /api/account/settings (SettingsHandler.Patch). Re-stamps live items server-side. */
export function patchSettings(idToken: string, patch: SettingsPatch): Promise<AccountSettings> {
  return accountJson<AccountSettings>('/account/settings', idToken, {
    method: 'PATCH',
    body: JSON.stringify(patch),
  });
}

/** GET /api/account/settings/preview?retentionHours=N (SettingsHandler.Preview). Read-only. */
export function previewRetention(idToken: string, hours: number): Promise<RetentionPreview> {
  return accountJson<RetentionPreview>(
    `/account/settings/preview?retentionHours=${encodeURIComponent(String(hours))}`,
    idToken,
  );
}

/** Response of DELETE /api/jobs/:jobId and DELETE /api/studio/projects/:id (newDeletedBody, data.go). */
export interface DeletedBody {
  deleted: { objects: number; bytes: number };
  /** >0: something could not be deleted yet; the sweeper finishes it. */
  pending: number;
}

/** DELETE /api/jobs/:jobId (DataHandler.DeleteJob). Strangers get 404. */
export function deleteJob(idToken: string, jobId: string): Promise<DeletedBody> {
  return accountJson<DeletedBody>(`/jobs/${encodeURIComponent(jobId)}`, idToken, { method: 'DELETE' });
}

/** DELETE /api/studio/projects/:id (StudioHandler.DeleteProject, studio_delete.go). */
export function deleteProject(idToken: string, id: string): Promise<DeletedBody> {
  return accountJson<DeletedBody>(`/studio/projects/${encodeURIComponent(id)}`, idToken, {
    method: 'DELETE',
  });
}

/** Response of PATCH /api/jobs/:jobId/retention (DataHandler.KeepJobLonger, data.go). */
export interface KeepLongerResult {
  keepForHours: number;
  expiresAt: string;
  keptLonger: boolean;
  updated: number;
}

/**
 * PATCH /api/jobs/:jobId/retention. 1 to 17,520 hours; extends, never shortens. Errors:
 * 400 `sign_in_required`, 409 `nothing_to_keep`.
 */
export function keepJobLonger(idToken: string, jobId: string, hours: number): Promise<KeepLongerResult> {
  return accountJson<KeepLongerResult>(`/jobs/${encodeURIComponent(jobId)}/retention`, idToken, {
    method: 'PATCH',
    body: JSON.stringify({ keepForHours: hours }),
  });
}

/** Response of POST /api/account/data/delete-all (deleteAllBody, account_data.go). */
export interface DeleteAllResult {
  deleted: { objects: number; bytes: number; projects: number; jobs: number };
  pending: number;
}

/** POST /api/account/data/delete-all. The handler requires the exact string "DELETE". */
export function deleteAllData(idToken: string, confirm: string): Promise<DeleteAllResult> {
  return accountJson<DeleteAllResult>('/account/data/delete-all', idToken, {
    method: 'POST',
    body: JSON.stringify({ confirm }),
  });
}

/**
 * GET /api/account/data/export (AccountDataHandler.Export): a streamed zip. 429
 * `export_rate_limited` carries `retryAfterSeconds` (3 per hour per user).
 */
export async function exportData(idToken: string): Promise<{ blob: Blob; fileName: string }> {
  const response = await fetch(`${getBaseURL()}/account/data/export`, { headers: authHeaders(idToken) });
  if (!response.ok) throw await accountError(response);
  const disposition = response.headers.get('Content-Disposition') ?? '';
  const match = /filename="?([^";]+)"?/i.exec(disposition);
  return { blob: await response.blob(), fileName: match?.[1] ?? 'mm-data-export.zip' };
}

/** One step of the DELETE /api/account report (StepReport, account_delete.go). */
export interface AccountDeleteStep {
  step: string;
  status: string;
  detail?: string;
}

/** Mirrors AccountDeleteReport (account_delete.go). 200 when completed, 502 when incomplete. */
export interface AccountDeleteReport {
  status: 'completed' | 'incomplete';
  steps: AccountDeleteStep[];
  deleted: {
    objects: number;
    bytes: number;
    projects: number;
    jobs: number;
    settings: number;
    grants: number;
  };
  stripe: string;
  analytics: string;
  retryable: boolean;
  message?: string;
}

/**
 * DELETE /api/account (AccountDataHandler.DeleteAccount). The handler requires the exact
 * string "DELETE MY ACCOUNT" and a Firebase token whose auth_time is under 5 minutes; else
 * 401 `reauth_required` (an AccountApiError with that code). A 502 carries the report and
 * `retryable`; calling again resumes.
 */
export function deleteAccount(idToken: string, confirm: string): Promise<AccountDeleteReport> {
  return accountJson<AccountDeleteReport>('/account', idToken, {
    method: 'DELETE',
    body: JSON.stringify({ confirm }),
  });
}

/** POST /api/account/sessions/revoke (RevokeSessions, account_data.go). */
export function revokeSessions(idToken: string): Promise<{ revokedAt: string }> {
  return accountJson<{ revokedAt: string }>('/account/sessions/revoke', idToken, { method: 'POST' });
}

/**
 * One Darkroom project row of GET /api/studio/projects (StudioHandler.ListRecentProjects,
 * models.StudioProject). Only the fields the list needs; the full EDL is ignored. The API sends
 * no thumbnail and no expiry for projects.
 */
export interface StudioProjectSummary {
  id: string;
  name: string;
  durationSeconds: number;
  width?: number;
  height?: number;
  createdAt: string;
  updatedAt: string;
}

/** GET /api/studio/projects (newest 25, account-scoped when a token is sent). */
export async function fetchStudioProjects(idToken: string): Promise<StudioProjectSummary[]> {
  const body = await accountJson<{ projects?: StudioProjectSummary[] }>('/studio/projects', idToken);
  return Array.isArray(body.projects) ? body.projects : [];
}
