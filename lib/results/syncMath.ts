/** Pure drift and frame-step math for the synced A/B video compare. */

/** B is corrected when it drifts from A by more than this. */
export const DRIFT_THRESHOLD_MS = 80;

/** True when the two positions (seconds) differ by MORE than `thresholdMs` (exactly equal: no). */
export function needsCorrection(a: number, b: number, thresholdMs: number = DRIFT_THRESHOLD_MS): boolean {
  if (!Number.isFinite(a) || !Number.isFinite(b)) return false;
  // Round to whole microseconds so 0.08 s vs 0.0 s compares as exactly 80 ms.
  const driftMs = Math.round(Math.abs(a - b) * 1e6) / 1e3;
  return driftMs > thresholdMs;
}

/**
 * Time after stepping one frame. Clamped to [0, duration]; unknown fps falls back to 30.
 * `duration` may be NaN/Infinity (not loaded): then only the lower bound applies.
 */
export function frameStep(fps: number, current: number, dir: 1 | -1, duration = Infinity): number {
  const rate = Number.isFinite(fps) && fps > 0 ? fps : 30;
  const base = Number.isFinite(current) ? current : 0;
  const next = base + dir / rate;
  const max = Number.isFinite(duration) && duration >= 0 ? duration : Infinity;
  return Math.min(max, Math.max(0, next));
}
