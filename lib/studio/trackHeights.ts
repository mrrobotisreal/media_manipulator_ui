/**
 * Per-project timeline lane heights (part 18). A view preference, not document
 * state: persisted in localStorage only, never in the EDL or the undo history.
 */
export const DEFAULT_TRACK_HEIGHT = 56;
export const MIN_TRACK_HEIGHT = 40;
export const MAX_TRACK_HEIGHT = 160;

const KEY_PREFIX = 'darkroom.trackHeights.';

export function clampTrackHeight(h: number): number {
  if (!Number.isFinite(h)) return DEFAULT_TRACK_HEIGHT;
  return Math.round(Math.max(MIN_TRACK_HEIGHT, Math.min(MAX_TRACK_HEIGHT, h)));
}

/** Parses the stored JSON defensively; anything malformed degrades to {}. */
export function parseTrackHeights(raw: string | null): Record<string, number> {
  if (!raw) return {};
  try {
    const v: unknown = JSON.parse(raw);
    if (!v || typeof v !== 'object' || Array.isArray(v)) return {};
    const out: Record<string, number> = {};
    for (const [k, h] of Object.entries(v as Record<string, unknown>)) {
      if (typeof h === 'number' && Number.isFinite(h)) out[k] = clampTrackHeight(h);
    }
    return out;
  } catch {
    return {};
  }
}

export function loadTrackHeights(projectId: string): Record<string, number> {
  try {
    return parseTrackHeights(localStorage.getItem(KEY_PREFIX + projectId));
  } catch {
    return {};
  }
}

export function saveTrackHeights(projectId: string, heights: Record<string, number>): void {
  try {
    localStorage.setItem(KEY_PREFIX + projectId, JSON.stringify(heights));
  } catch {
    // private window / blocked storage: heights simply don't persist
  }
}
