/**
 * Client for MM103's preset routes (`internal/handlers/photo_presets.go`).
 *
 *   GET    /photo/presets?full=1          {presets:[{id,name,category,revision,hasThumbnail,layers?,...}], limit, used}
 *   POST   /photo/presets                 {name, category?, layers} → 201; 403 photo_presets_limit {limit, used, upgradePath}
 *   PUT    /photo/presets/:id             If-Match: <revision>; {name?, category?, layers?}
 *   DELETE /photo/presets/:id
 *   POST   /photo/presets/:id/thumbnail   multipart `file` (PNG ≤ 64 KB)
 *
 * Signed-in only (anonymous → 401): guests keep the IndexedDB store
 * (`presets/userStore.ts`). Identity is attached by `authedFetch`; tests inject a fetch.
 */
import { authedFetch } from '@/lib/auth/authedFetch';
import { getBaseURL } from '@/lib/utils';
import { layerSchema } from '@/lib/photo/photoTypes';
import { PhotoApiError, type FetchLike } from '@/lib/photo/projectsApi';
import { USER_PRESET_CATEGORIES, USER_PRESET_NAME_MAX, type UserPreset, type UserPresetCategoryId, listUserPresets, deleteUserPreset } from '@/lib/photo/presets/userStore';
import type { AdjustmentLayer } from '@/lib/photo/photoTypes';

export interface ServerPreset {
  id: string;
  name: string;
  category: UserPresetCategoryId | null;
  revision: number;
  hasThumbnail: boolean;
  layers: AdjustmentLayer[];
  updatedAt: string;
  createdAt: string;
}
export interface ServerPresetList {
  presets: ServerPreset[];
  /** The tier cap: -1 unlimited, 0 none. */
  limit: number;
  used: number;
}

const base = () => `${getBaseURL()}/photo/presets`;
const s = (v: unknown, d = '') => (typeof v === 'string' ? v : d);
const n = (v: unknown, d = 0) => (typeof v === 'number' && Number.isFinite(v) ? v : d);

async function call(fetchImpl: FetchLike, url: string, init: RequestInit = {}): Promise<Record<string, unknown>> {
  let res: Response;
  try {
    res = await fetchImpl(url, init);
  } catch {
    throw new PhotoApiError(0, 'network');
  }
  const body = (await res.json().catch(() => null)) as Record<string, unknown> | null;
  if (!res.ok) throw new PhotoApiError(res.status, s(body?.error), body);
  return body ?? {};
}

/** True when the error is the per-tier cap (403 photo_presets_limit). */
export const isPresetLimit = (e: unknown): e is PhotoApiError => e instanceof PhotoApiError && e.status === 403 && e.code === 'photo_presets_limit';

export function presetOf(raw: Record<string, unknown>): ServerPreset | null {
  const cat = raw.category;
  const category = (USER_PRESET_CATEGORIES as readonly unknown[]).includes(cat) ? (cat as UserPresetCategoryId) : null;
  const layers: AdjustmentLayer[] = [];
  if (Array.isArray(raw.layers)) {
    for (const l of raw.layers) {
      const p = layerSchema.safeParse(l);
      if (p.success) layers.push(p.data);
    }
  }
  const id = s(raw.id);
  if (!id) return null;
  return { id, name: s(raw.name), category, revision: n(raw.revision, 1), hasThumbnail: raw.hasThumbnail === true, layers, updatedAt: s(raw.updatedAt), createdAt: s(raw.createdAt) };
}

export async function listServerPresets(fetchImpl: FetchLike = authedFetch, full = true): Promise<ServerPresetList> {
  const body = await call(fetchImpl, `${base()}${full ? '?full=1' : ''}`, { method: 'GET' });
  const presets = Array.isArray(body.presets) ? (body.presets as Record<string, unknown>[]).map(presetOf).filter((p): p is ServerPreset => p !== null) : [];
  return { presets, limit: n(body.limit, -1), used: n(body.used, presets.length) };
}

export async function createServerPreset(input: { name: string; category?: UserPresetCategoryId | null; layers: AdjustmentLayer[] }, fetchImpl: FetchLike = authedFetch): Promise<ServerPreset> {
  const body = await call(fetchImpl, base(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: input.name.trim().slice(0, USER_PRESET_NAME_MAX), category: input.category ?? 'custom', layers: input.layers }),
  });
  const p = presetOf(body);
  if (!p) throw new PhotoApiError(200, 'photo_preset_unreadable');
  return p;
}

export async function renameServerPreset(id: string, revision: number, name: string, fetchImpl: FetchLike = authedFetch): Promise<ServerPreset> {
  const body = await call(fetchImpl, `${base()}/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { 'If-Match': String(revision), 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: name.trim().slice(0, USER_PRESET_NAME_MAX) }),
  });
  const p = presetOf(body);
  if (!p) throw new PhotoApiError(200, 'photo_preset_unreadable');
  return p;
}

export async function deleteServerPreset(id: string, fetchImpl: FetchLike = authedFetch): Promise<void> {
  await call(fetchImpl, `${base()}/${encodeURIComponent(id)}`, { method: 'DELETE' });
}

/** Best effort: a failed thumbnail never fails a save. */
export async function uploadPresetThumbnail(id: string, png: Blob, fetchImpl: FetchLike = authedFetch): Promise<boolean> {
  try {
    const form = new FormData();
    form.append('file', png, 'thumbnail.png');
    await call(fetchImpl, `${base()}/${encodeURIComponent(id)}/thumbnail`, { method: 'POST', body: form });
    return true;
  } catch {
    return false;
  }
}

/** Fetch a preset thumbnail's bytes with identity (the route is owner-only). */
export async function fetchPresetThumbnail(id: string, fetchImpl: FetchLike = authedFetch): Promise<Blob | null> {
  try {
    const res = await fetchImpl(`${base()}/${encodeURIComponent(id)}/thumbnail`);
    return res.ok ? await res.blob() : null;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// the one-time migration of browser presets
// ---------------------------------------------------------------------------

/** localStorage flag: the visitor said "no" to the prompt; never asked again on this browser. */
export const PRESET_MIGRATION_FLAG = 'mm-photo-presets-migration';
export function migrationDeclined(): boolean {
  try {
    return localStorage.getItem(PRESET_MIGRATION_FLAG) === 'declined';
  } catch {
    return false;
  }
}
export function setMigrationDeclined(): void {
  try {
    localStorage.setItem(PRESET_MIGRATION_FLAG, 'declined');
  } catch {
    // private mode: the prompt may reappear next session
  }
}

/**
 * Whether to offer the prompt: signed in, the account has no presets, this browser
 * has some and the visitor has not declined. `serverCount` is the list length.
 */
export function shouldOfferMigration(serverCount: number, local: UserPreset[]): boolean {
  return serverCount === 0 && local.length > 0 && !migrationDeclined();
}

export interface MigrationResult {
  /** Uploaded (and removed from the browser). */
  uploaded: number;
  /** Still in the browser: over the cap, or refused. */
  remaining: number;
  /** The cap stopped the upload. */
  capped: boolean;
}

/** Upload the browser presets oldest first until the cap; delete each local copy once it is on the account. */
export async function migrateLocalPresets(local: UserPreset[], fetchImpl: FetchLike = authedFetch): Promise<MigrationResult> {
  let uploaded = 0;
  let capped = false;
  for (const p of [...local].reverse()) {
    try {
      await createServerPreset({ name: p.name, category: p.category, layers: p.layers }, fetchImpl);
      await deleteUserPreset(p.id);
      uploaded += 1;
    } catch (e) {
      if (isPresetLimit(e)) {
        capped = true;
        break;
      }
      // a preset the server refuses (invalid) or a network failure: keep it local, try the rest
      if (e instanceof PhotoApiError && e.retryable) break;
    }
  }
  const remaining = (await listUserPresets()).length;
  return { uploaded, remaining, capped };
}
