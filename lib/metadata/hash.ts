/**
 * URL-hash state: `#meta=gps,camera&mf=location,identity`.
 * `meta` is the list of open category ids; `mf` the active privacy filters.
 * Only these two keys are read or written; any other hash content is preserved
 * by `serializeHash`.
 */
import { PRIVACY_CLASSES, type PrivacyClass } from './types';

export interface HashState {
  /** `null` when the hash carries no `meta` key (use defaults). */
  open: string[] | null;
  filters: PrivacyClass[];
}

const ID_RE = /^[a-z0-9_-]+$/i;

export function parseHash(hash: string): HashState {
  const params = new URLSearchParams(hash.replace(/^#/, ''));
  const metaRaw = params.get('meta');
  const open =
    metaRaw === null ? null : metaRaw.split(',').filter((s) => s && ID_RE.test(s));
  const filters = (params.get('mf') ?? '')
    .split(',')
    .filter((s): s is PrivacyClass => (PRIVACY_CLASSES as readonly string[]).includes(s));
  return { open, filters };
}

/** Writes state into an existing hash string, keeping unrelated keys. Returns '' when empty. */
export function serializeHash(state: HashState, existing = ''): string {
  const params = new URLSearchParams(existing.replace(/^#/, ''));
  params.delete('meta');
  params.delete('mf');
  if (state.open) params.set('meta', state.open.join(','));
  if (state.filters.length) params.set('mf', state.filters.join(','));
  // URLSearchParams encodes commas; keep the hash readable.
  const s = params.toString().replace(/%2C/gi, ',');
  return s ? `#${s}` : '';
}
