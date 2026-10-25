/**
 * Number canonicalisation for the Motion document (code name `vector`).
 *
 * Every number the SVG importer stores and every number the exporter writes
 * goes through `roundNum` / `formatNumber`, so SVG → doc → SVG is a fixed
 * point: rounding an already-rounded value is the identity.
 *
 * Precision is 3 decimal places in user units (1/1000 px at 1:1 is far below
 * anything a renderer can show) — the svgo default for path data is similar.
 */

export const NUM_DECIMALS = 3;
const FACTOR = 10 ** NUM_DECIMALS;

/** Round to NUM_DECIMALS places; never returns -0 or a non-finite value. */
export function roundNum(n: number): number {
  if (!Number.isFinite(n)) return 0;
  const r = Math.round(n * FACTOR) / FACTOR;
  return Object.is(r, -0) || r === 0 ? 0 : r;
}

/**
 * Canonical text form: rounded, no exponent, no trailing zeros, no leading
 * `+`, `0.5` (not `.5`), `0` (never `-0`).
 */
export function formatNumber(n: number): string {
  const r = roundNum(n);
  if (Number.isInteger(r)) return String(r);
  // toFixed avoids exponent notation for small magnitudes (1e-3 → "0.001").
  return r.toFixed(NUM_DECIMALS).replace(/0+$/, '').replace(/\.$/, '');
}

/** Parse an SVG number token (accepts `.5`, `1e3`, `-0`); NaN when invalid. */
export function parseNumber(s: string | null | undefined): number {
  if (s === null || s === undefined) return Number.NaN;
  const t = s.trim();
  if (!/^[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?$/.test(t)) return Number.NaN;
  return Number(t);
}
