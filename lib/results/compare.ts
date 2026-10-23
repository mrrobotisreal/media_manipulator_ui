/** Pure math for the wipe slider (CompareSlider, video wipe). All values are percentages 0-100. */

export function clampWipe(value: number): number {
  if (Number.isNaN(value)) return 50;
  if (value < 0) return 0;
  if (value > 100) return 100;
  return value;
}

/** Keyboard step for the wipe handle. Unhandled keys return the (clamped) value unchanged. */
export function stepWipe(value: number, key: string, shift = false): number {
  const current = clampWipe(value);
  const small = shift ? 10 : 1;
  switch (key) {
    case 'ArrowRight':
    case 'ArrowUp':
      return clampWipe(current + small);
    case 'ArrowLeft':
    case 'ArrowDown':
      return clampWipe(current - small);
    case 'PageUp':
      return clampWipe(current + 10);
    case 'PageDown':
      return clampWipe(current - 10);
    case 'Home':
      return 0;
    case 'End':
      return 100;
    default:
      return current;
  }
}

/** Handled by `stepWipe` (the component prevents default for exactly these). */
export const WIPE_KEYS: ReadonlySet<string> = new Set([
  'ArrowRight', 'ArrowUp', 'ArrowLeft', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End',
]);

/** Pointer x within a rect as a percentage. A zero-width (or non-finite) rect yields 50. */
export function wipeFromPointer(clientX: number, rect: { left: number; width: number }): number {
  if (!Number.isFinite(clientX) || !Number.isFinite(rect.width) || rect.width <= 0) return 50;
  return clampWipe(((clientX - rect.left) / rect.width) * 100);
}

/**
 * Clip for the TOP layer: its left `pct`% stays visible and the rest shows the layer
 * beneath. CompareSlider puts `before` (Original) on top, so the handle at `pct`% has
 * Original on its left and Result on its right.
 */
export function clipPathForWipe(pct: number, direction: 'ltr' = 'ltr'): string {
  void direction;
  const p = clampWipe(pct);
  return `inset(0 ${100 - p}% 0 0)`;
}

/**
 * Signed percent change from `from` to `to` for the size stats ("−62%", "+12%", "0%").
 * Null when it is undefined (missing or zero baseline, non-finite input).
 */
export function formatDelta(from: number | undefined, to: number | undefined): string | null {
  if (from === undefined || to === undefined || !Number.isFinite(from) || !Number.isFinite(to) || from <= 0) return null;
  const pct = Math.round(((to - from) / from) * 100);
  if (pct === 0) return '0%';
  return `${pct < 0 ? '−' : '+'}${Math.abs(pct)}%`;
}
