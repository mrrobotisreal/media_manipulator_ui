/**
 * Saved caption looks (MM122 decision 4): the client of /api/studio/caption-looks
 * (`internal/handlers/studio_caption_looks.go`).
 *
 *   GET    /studio/caption-looks       {looks:[{id,name,style,revision,createdAt,updatedAt}], limit, used}
 *   POST   /studio/caption-looks       {name, style} → 201 (+ used); 403 caption_looks_limit {limit, used, upgradePath}
 *   PUT    /studio/caption-looks/:id   If-Match: <revision>; {name?, style?} → 409 revision_conflict
 *   DELETE /studio/caption-looks/:id
 *
 * Signed-in only (anonymous → 401); the cap is Premium 10, Pro unlimited, none for free. Reads
 * go through TanStack Query (useSavedCaptionLooks); the 403 also reaches the upgrade
 * interstitial through authedFetch's limit bus, which routes Premium → Pro.
 */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { authedFetch } from '@/lib/auth/authedFetch';
import { getBaseURL } from '@/lib/utils';
import { studioCaptionStyleSchema, type StudioCaptionStyle } from '@/lib/studioTypes';
import { sanitizeCaptionStyle } from './sanitize';

export const CAPTION_LOOK_NAME_MAX = 60;

export interface SavedCaptionLook {
  id: string;
  name: string;
  style: StudioCaptionStyle;
  revision: number;
  updatedAt: string;
}
export interface SavedCaptionLookList {
  looks: SavedCaptionLook[];
  /** The tier cap: -1 unlimited, 0 none. */
  limit: number;
  used: number;
}

export type FetchLike = (input: string, init?: RequestInit) => Promise<Response>;

export class CaptionLookApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly body: Record<string, unknown> | null;
  constructor(status: number, code: string, body: Record<string, unknown> | null = null) {
    super(`caption look request failed (${status}${code ? `: ${code}` : ''})`);
    this.name = 'CaptionLookApiError';
    this.status = status;
    this.code = code;
    this.body = body;
  }
}

/** True for the per-tier cap (403 caption_looks_limit). */
export const isCaptionLookLimit = (e: unknown): e is CaptionLookApiError => e instanceof CaptionLookApiError && e.status === 403 && e.code === 'caption_looks_limit';

const base = () => `${getBaseURL()}/studio/caption-looks`;
const str = (v: unknown) => (typeof v === 'string' ? v : '');
const num = (v: unknown, d: number) => (typeof v === 'number' && Number.isFinite(v) ? v : d);

async function call(fetchImpl: FetchLike, url: string, init: RequestInit = {}): Promise<Record<string, unknown>> {
  let res: Response;
  try {
    res = await fetchImpl(url, init);
  } catch {
    throw new CaptionLookApiError(0, 'network');
  }
  const body = (await res.json().catch(() => null)) as Record<string, unknown> | null;
  if (!res.ok) throw new CaptionLookApiError(res.status, str(body?.error), body);
  return body ?? {};
}

/** A server row, or null when unreadable. The style is re-validated and sanitized (Go's rules). */
export function savedLookOf(raw: Record<string, unknown>): SavedCaptionLook | null {
  const id = str(raw.id);
  const parsed = studioCaptionStyleSchema.safeParse(raw.style);
  if (!id || !parsed.success) return null;
  const style = sanitizeCaptionStyle(parsed.data);
  if (!style) return null;
  return { id, name: str(raw.name), style, revision: num(raw.revision, 1), updatedAt: str(raw.updatedAt) };
}

export async function listSavedCaptionLooks(fetchImpl: FetchLike = authedFetch): Promise<SavedCaptionLookList> {
  const body = await call(fetchImpl, base(), { method: 'GET' });
  const looks = Array.isArray(body.looks) ? (body.looks as Record<string, unknown>[]).map(savedLookOf).filter((l): l is SavedCaptionLook => l !== null) : [];
  return { looks, limit: num(body.limit, -1), used: num(body.used, looks.length) };
}

/** The style saved for a look: the editor's style without its catalog lookId. */
export function styleForSaving(style: StudioCaptionStyle): StudioCaptionStyle {
  const { lookId: _l, ...rest } = style;
  void _l;
  return rest;
}

export async function createSavedCaptionLook(input: { name: string; style: StudioCaptionStyle }, fetchImpl: FetchLike = authedFetch): Promise<{ look: SavedCaptionLook; used: number }> {
  const body = await call(fetchImpl, base(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: input.name.trim().slice(0, CAPTION_LOOK_NAME_MAX), style: styleForSaving(input.style) }),
  });
  const look = savedLookOf(body);
  if (!look) throw new CaptionLookApiError(200, 'caption_look_unreadable');
  return { look, used: num(body.used, 1) };
}

export async function updateSavedCaptionLook(id: string, revision: number, patch: { name?: string; style?: StudioCaptionStyle }, fetchImpl: FetchLike = authedFetch): Promise<SavedCaptionLook> {
  const body = await call(fetchImpl, `${base()}/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { 'If-Match': String(revision), 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...(patch.name !== undefined ? { name: patch.name.trim().slice(0, CAPTION_LOOK_NAME_MAX) } : {}),
      ...(patch.style ? { style: styleForSaving(patch.style) } : {}),
    }),
  });
  const look = savedLookOf(body);
  if (!look) throw new CaptionLookApiError(200, 'caption_look_unreadable');
  return look;
}

export async function deleteSavedCaptionLook(id: string, fetchImpl: FetchLike = authedFetch): Promise<void> {
  await call(fetchImpl, `${base()}/${encodeURIComponent(id)}`, { method: 'DELETE' });
}

export const savedCaptionLooksKey = ['studio', 'caption-looks'] as const;

/** The signed-in caller's saved looks (disabled for guests and the CreaTV embed). */
export function useSavedCaptionLooks(enabled: boolean) {
  return useQuery({ queryKey: savedCaptionLooksKey, enabled, staleTime: 60_000, queryFn: () => listSavedCaptionLooks() });
}

export function useCreateSavedCaptionLook() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: { name: string; style: StudioCaptionStyle }) => createSavedCaptionLook(input),
    onSuccess: () => void qc.invalidateQueries({ queryKey: savedCaptionLooksKey }),
  });
}

export function useUpdateSavedCaptionLook() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (v: { id: string; revision: number; name?: string; style?: StudioCaptionStyle }) => updateSavedCaptionLook(v.id, v.revision, { name: v.name, style: v.style }),
    onSettled: () => void qc.invalidateQueries({ queryKey: savedCaptionLooksKey }),
  });
}

export function useDeleteSavedCaptionLook() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteSavedCaptionLook(id),
    onSuccess: () => void qc.invalidateQueries({ queryKey: savedCaptionLooksKey }),
  });
}
