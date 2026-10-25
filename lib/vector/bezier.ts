/**
 * CSS `cubic-bezier(x1, y1, x2, y2)` timing curves for Motion keyframes
 * (ticket MM44 decision 2, design §3.3.2).
 *
 * The curve runs from (0,0) to (1,1) with control points P1 = (x1,y1) and
 * P2 = (x2,y2). x1 and x2 are clamped to [0,1] (the CSS rule that keeps x(s)
 * monotone, so every progress value x has exactly one y). y is free, which
 * allows overshoot ("back" eases).
 *
 * `solveCubicBezier(curve, x)` finds the curve parameter s with x(s) = x by
 * Newton's method (8 iterations, 1e-6 tolerance) and falls back to bisection
 * when the derivative is too flat or Newton leaves [0,1], then returns y(s).
 * This is the same strategy browsers use (WebKit `UnitBezier`), so preview and
 * the CSS export agree to well under a pixel.
 */

export type CubicBezier = readonly [x1: number, y1: number, x2: number, y2: number];

/** Proposed (decision 2): solver tolerance on x. */
export const BEZIER_EPSILON = 1e-6;
const NEWTON_ITERATIONS = 8;
const BISECTION_ITERATIONS = 64;

/** CSS named curves, as cubic-bezier control points. */
export const CSS_EASE: CubicBezier = [0.25, 0.1, 0.25, 1];
export const CSS_EASE_IN: CubicBezier = [0.42, 0, 1, 1];
export const CSS_EASE_OUT: CubicBezier = [0, 0, 0.58, 1];
export const CSS_EASE_IN_OUT: CubicBezier = [0.42, 0, 0.58, 1];

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

/** Clamp x1/x2 to [0,1] (CSS) and replace non-finite values with linear ones. */
export function normalizeBezier(curve: readonly number[]): CubicBezier {
  const [x1, y1, x2, y2] = curve.map((v) => (Number.isFinite(v) ? v : 0));
  return [clamp01(x1), y1, clamp01(x2), y2];
}

/** One coordinate of the cubic at parameter s, for control values a (P1) and b (P2). */
function coord(a: number, b: number, s: number): number {
  // B(s) = 3(1-s)²s·a + 3(1-s)s²·b + s³, written in Horner form.
  const c = 3 * a;
  const bb = 3 * (b - a) - c;
  const aa = 1 - c - bb;
  return ((aa * s + bb) * s + c) * s;
}

function coordDerivative(a: number, b: number, s: number): number {
  const c = 3 * a;
  const bb = 3 * (b - a) - c;
  const aa = 1 - c - bb;
  return (3 * aa * s + 2 * bb) * s + c;
}

/** The curve parameter s in [0,1] with x(s) = x. */
export function solveParameter(curve: CubicBezier, x: number): number {
  const [x1, , x2] = curve;
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  // Newton from s = x (a good guess: x(s) ≈ s for gentle curves).
  let s = x;
  for (let i = 0; i < NEWTON_ITERATIONS; i++) {
    const err = coord(x1, x2, s) - x;
    if (Math.abs(err) < BEZIER_EPSILON) return s;
    const d = coordDerivative(x1, x2, s);
    if (Math.abs(d) < 1e-6) break;
    const next = s - err / d;
    if (next < 0 || next > 1) break;
    s = next;
  }
  // Bisection: x(s) is monotone on [0,1] because x1, x2 ∈ [0,1].
  let lo = 0;
  let hi = 1;
  s = x;
  for (let i = 0; i < BISECTION_ITERATIONS; i++) {
    const v = coord(x1, x2, s);
    if (Math.abs(v - x) < BEZIER_EPSILON) return s;
    if (v < x) lo = s;
    else hi = s;
    s = (lo + hi) / 2;
  }
  return s;
}

/** Eased progress y for linear progress x (clamped to [0,1]) through `curve`. */
export function solveCubicBezier(curve: readonly number[], x: number): number {
  const c = normalizeBezier(curve);
  const p = clamp01(x);
  if (p === 0) return 0;
  if (p === 1) return 1;
  // Linear curve shortcut (both control points on the diagonal).
  if (c[0] === c[1] && c[2] === c[3]) return p;
  return coord(c[1], c[3], solveParameter(c, p));
}

/** `cubic-bezier(a, b, c, d)` CSS text with 4-decimal precision, x clamped. */
export function bezierToCss(curve: readonly number[]): string {
  const f = (n: number) => {
    const r = Math.round(n * 10000) / 10000;
    return String(Object.is(r, -0) ? 0 : r);
  };
  return `cubic-bezier(${normalizeBezier(curve).map(f).join(',')})`;
}
