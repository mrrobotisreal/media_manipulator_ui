/**
 * Pieces shared by the Lottie writer (`export/lottie.ts`) and reader
 * (`import/lottie.ts`), ticket MM46: the JSON shapes we write, path data ⇄
 * Lottie bezier conversion, colours, keyframe easing handles, and the outline
 * order lottie-web uses for rectangles and ellipses (it matters for trim
 * paths, which start at the shape's first vertex).
 *
 * Conventions (Lottie 1.0.1, `export/lottieSupport.ts` `LOTTIE_SPEC`; where
 * the spec is silent, lottie-web 5.x is the reference player):
 *
 *   - times are frames (`fr` per second); Motion keys are milliseconds;
 *   - rotation is clockwise degrees in y-down space, the same as SVG
 *     `rotate()`; scale and opacity are percentages;
 *   - a layer or group matrix is `translate(p) · rotate(r) ·
 *     [rotate(-sa) · skewX(-sk) · rotate(sa)] · scale(s/100) · translate(-a)`
 *     (lottie-web `TransformProperty`), so Motion's
 *     `translate(x+ax, y+ay) · rotate · skewX · skewY · scale · translate(-a)`
 *     maps field by field (skewX k → sk = -k, sa = 0; skewY k → sk = k, sa = 90);
 *   - a bezier `{c, v, i, o}` holds vertices and tangents RELATIVE to each
 *     vertex; `o[k]` leaves vertex k, `i[k+1]` enters vertex k+1, and a closed
 *     shape joins the last vertex to the first with `o[n-1]`, `i[0]`.
 */
import { parseColor, type Rgba } from '@/lib/vector/color';
import { formatNumber, roundNum } from '@/lib/vector/num';
import { parsePath } from '@/lib/vector/pathData';
import { toCubicSubpaths, type Cubic } from '@/lib/vector/pathLength';

// ---------------------------------------------------------------------------
// JSON shapes (the subset we write; the reader validates its own input)
// ---------------------------------------------------------------------------

export type Vec = number[];

/** `o` / `i` easing handle: one value for every dimension, or one per dimension. */
export interface EaseHandle {
  x: number | number[];
  y: number | number[];
}

export interface LottieKeyframe<V = Vec> {
  t: number;
  s: V;
  h?: 1;
  o?: EaseHandle;
  i?: EaseHandle;
}

export type LottieProp<V = Vec | number> = { a: 0; k: V } | { a: 1; k: LottieKeyframe<V extends number ? Vec : V>[] };

export interface LottieBezier {
  c: boolean;
  v: Vec[];
  i: Vec[];
  o: Vec[];
}

export type LottieShape = Record<string, unknown> & { ty: string };
export type LottieLayer = Record<string, unknown> & { ty: number };

// ---------------------------------------------------------------------------
// numbers
// ---------------------------------------------------------------------------

/** Coordinates and values: Motion's 3-decimal canon. */
export const r3 = roundNum;
/** Times (frames) and easing handles: 4 decimals (an integer ms at an integer fps has at most 3 frame decimals). */
export function r4(n: number): number {
  if (!Number.isFinite(n)) return 0;
  const r = Math.round(n * 10000) / 10000;
  return Object.is(r, -0) ? 0 : r;
}

// ---------------------------------------------------------------------------
// colours
// ---------------------------------------------------------------------------

/** `[r, g, b]` in 0..1 (4 decimals) and the alpha, or null for a paint that is not a plain colour. */
export function lottieColor(value: string | undefined): { rgb: Vec; alpha: number } | null {
  const c = value === undefined ? null : parseColor(value);
  if (!c) return null;
  return { rgb: [r4(c.r / 255), r4(c.g / 255), r4(c.b / 255)], alpha: c.a };
}

const hex2 = (v: number) =>
  Math.round(Math.min(1, Math.max(0, v)) * 255)
    .toString(16)
    .padStart(2, '0');

/** `#rrggbb` from Lottie 0..1 components (alpha is carried separately, as an opacity). */
export function hexFromLottie(rgb: readonly number[]): string {
  return `#${hex2(rgb[0] ?? 0)}${hex2(rgb[1] ?? 0)}${hex2(rgb[2] ?? 0)}`;
}

export const rgbaOf = (rgb: readonly number[], a = 1): Rgba => ({ r: (rgb[0] ?? 0) * 255, g: (rgb[1] ?? 0) * 255, b: (rgb[2] ?? 0) * 255, a });

// ---------------------------------------------------------------------------
// path data ⇄ bezier
// ---------------------------------------------------------------------------

/** A straight cubic (control points on the chord at 1/3 and 2/3), as `pathLength` builds for L / Z. */
function isLineCubic(c: Cubic): boolean {
  const near = (a: number, b: number) => Math.abs(a - b) <= 1e-6 * (1 + Math.abs(a) + Math.abs(b));
  return (
    near(c[2], c[0] + (c[6] - c[0]) / 3) &&
    near(c[3], c[1] + (c[7] - c[1]) / 3) &&
    near(c[4], c[0] + ((c[6] - c[0]) * 2) / 3) &&
    near(c[5], c[1] + ((c[7] - c[1]) * 2) / 3)
  );
}

/**
 * Path data → one Lottie bezier per subpath (arcs and quadratics become
 * cubics; straight segments get zero tangents). Null when it does not parse.
 * A closed subpath whose last segment returns to its start has that segment
 * as its closing edge (`c: true`), so it is not repeated as a vertex.
 */
export function pathToBeziers(d: string, opts: { exact?: boolean } = {}): LottieBezier[] | null {
  let subs;
  try {
    subs = toCubicSubpaths(parsePath(d));
  } catch {
    return null;
  }
  const out: LottieBezier[] = [];
  for (const sp of subs) {
    const n = sp.cubics.length;
    if (n === 0) continue;
    const v: Vec[] = [];
    const i: Vec[] = [];
    const o: Vec[] = [];
    const vertices = sp.closed ? n : n + 1;
    for (let k = 0; k < vertices; k++) {
      const c = sp.cubics[Math.min(k, n - 1)];
      const px = k < n ? c[0] : c[6];
      const py = k < n ? c[1] : c[7];
      v.push([r3(px), r3(py)]);
      i.push([0, 0]);
      o.push([0, 0]);
    }
    for (let k = 0; k < n; k++) {
      const c = sp.cubics[k];
      // Morph keys keep every tangent: Lottie interpolates tangents, so a zeroed one would bend the in-betweens.
      if (!opts.exact && isLineCubic(c)) continue;
      const end = sp.closed ? (k + 1) % n : k + 1;
      o[k] = [r3(c[2] - c[0]), r3(c[3] - c[1])];
      i[end] = [r3(c[4] - c[6]), r3(c[5] - c[7])];
    }
    out.push({ c: sp.closed, v, i, o });
  }
  return out;
}

const isZero = (p: Vec | undefined) => !p || ((p[0] ?? 0) === 0 && (p[1] ?? 0) === 0);

/** Lottie bezier → canonical absolute path data (`L` for straight edges, `C` otherwise). */
export function bezierToPath(b: LottieBezier): string {
  const f = formatNumber;
  const n = b.v.length;
  if (n === 0) return '';
  const pt = (k: number) => [b.v[k]?.[0] ?? 0, b.v[k]?.[1] ?? 0];
  let d = `M${f(pt(0)[0])} ${f(pt(0)[1])}`;
  const edge = (from: number, to: number) => {
    const [x0, y0] = pt(from);
    const [x1, y1] = pt(to);
    const o = b.o[from];
    const i = b.i[to];
    if (isZero(o) && isZero(i)) {
      d += `L${f(x1)} ${f(y1)}`;
      return;
    }
    d += `C${f(x0 + (o?.[0] ?? 0))} ${f(y0 + (o?.[1] ?? 0))} ${f(x1 + (i?.[0] ?? 0))} ${f(y1 + (i?.[1] ?? 0))} ${f(x1)} ${f(y1)}`;
  };
  for (let k = 0; k + 1 < n; k++) edge(k, k + 1);
  if (b.c) {
    if (n > 1 && !(isZero(b.o[n - 1]) && isZero(b.i[0]))) edge(n - 1, 0);
    d += 'Z';
  }
  return d;
}

/**
 * Same as `bezierToPath` but every edge is a cubic whose controls are exactly
 * vertex + tangent (a zero tangent puts the control on the vertex, which still
 * draws a straight edge). Morph keys need this: Lottie interpolates vertices
 * and tangents, which is exactly the number-by-number interpolation of these
 * absolute controls, so the preview and the Lottie player agree in-between.
 */
export function bezierToCubicPath(b: LottieBezier): string {
  const f = formatNumber;
  const n = b.v.length;
  if (n === 0) return '';
  const pt = (k: number) => [b.v[k]?.[0] ?? 0, b.v[k]?.[1] ?? 0];
  let d = `M${f(pt(0)[0])} ${f(pt(0)[1])}`;
  const edge = (from: number, to: number) => {
    const [x0, y0] = pt(from);
    const [x1, y1] = pt(to);
    const o = b.o[from] ?? [0, 0];
    const i = b.i[to] ?? [0, 0];
    d += `C${f(x0 + (o[0] ?? 0))} ${f(y0 + (o[1] ?? 0))} ${f(x1 + (i[0] ?? 0))} ${f(y1 + (i[1] ?? 0))} ${f(x1)} ${f(y1)}`;
  };
  for (let k = 0; k + 1 < n; k++) edge(k, k + 1);
  if (b.c) {
    if (n > 1) edge(n - 1, 0);
    d += 'Z';
  }
  return d;
}

// ---------------------------------------------------------------------------
// lottie-web outline order for rc / el (trim paths start at vertex 0)
// ---------------------------------------------------------------------------

/** Bezier circle constant lottie-web uses for ellipses and rounded corners. */
export const ROUND_CORNER = 0.5519;

/**
 * `rc` as lottie-web draws it: from the top-right corner, clockwise when
 * `d` is 1 or 2, counter-clockwise otherwise (lottie-web `convertRectToPath`;
 * a missing `d` is counter-clockwise for rectangles but clockwise for
 * ellipses, so the writer always writes `d: 1`).
 */
export function rectBezier(p: Vec, s: Vec, roundness: number, direction: number | undefined): LottieBezier {
  const [p0, p1] = [p[0] ?? 0, p[1] ?? 0];
  const v0 = (s[0] ?? 0) / 2;
  const v1 = (s[1] ?? 0) / 2;
  const round = Math.max(0, Math.min(v0, v1, roundness));
  const c = round * (1 - ROUND_CORNER);
  // Rows are lottie-web's `setTripleAt(vX, vY, oX, oY, iX, iY)`: vertex, out control, in control (absolute).
  type Row = [number, number, number, number, number, number];
  let rows: Row[];
  if (direction === 1 || direction === 2) {
    rows = [
      [p0 + v0, p1 - v1 + round, p0 + v0, p1 - v1 + round, p0 + v0, p1 - v1 + c],
      [p0 + v0, p1 + v1 - round, p0 + v0, p1 + v1 - c, p0 + v0, p1 + v1 - round],
    ];
    if (round !== 0) {
      rows.push(
        [p0 + v0 - round, p1 + v1, p0 + v0 - round, p1 + v1, p0 + v0 - c, p1 + v1],
        [p0 - v0 + round, p1 + v1, p0 - v0 + c, p1 + v1, p0 - v0 + round, p1 + v1],
        [p0 - v0, p1 + v1 - round, p0 - v0, p1 + v1 - round, p0 - v0, p1 + v1 - c],
        [p0 - v0, p1 - v1 + round, p0 - v0, p1 - v1 + c, p0 - v0, p1 - v1 + round],
        [p0 - v0 + round, p1 - v1, p0 - v0 + round, p1 - v1, p0 - v0 + c, p1 - v1],
        [p0 + v0 - round, p1 - v1, p0 + v0 - c, p1 - v1, p0 + v0 - round, p1 - v1],
      );
    } else {
      rows.push([p0 - v0, p1 + v1, p0 - v0 + c, p1 + v1, p0 - v0, p1 + v1], [p0 - v0, p1 - v1, p0 - v0, p1 - v1 + c, p0 - v0, p1 - v1]);
    }
  } else {
    rows = [[p0 + v0, p1 - v1 + round, p0 + v0, p1 - v1 + c, p0 + v0, p1 - v1 + round]];
    if (round !== 0) {
      rows.push(
        [p0 + v0 - round, p1 - v1, p0 + v0 - round, p1 - v1, p0 + v0 - c, p1 - v1],
        [p0 - v0 + round, p1 - v1, p0 - v0 + c, p1 - v1, p0 - v0 + round, p1 - v1],
        [p0 - v0, p1 - v1 + round, p0 - v0, p1 - v1 + round, p0 - v0, p1 - v1 + c],
        [p0 - v0, p1 + v1 - round, p0 - v0, p1 + v1 - c, p0 - v0, p1 + v1 - round],
        [p0 - v0 + round, p1 + v1, p0 - v0 + round, p1 + v1, p0 - v0 + c, p1 + v1],
        [p0 + v0 - round, p1 + v1, p0 + v0 - c, p1 + v1, p0 + v0 - round, p1 + v1],
        [p0 + v0, p1 + v1 - round, p0 + v0, p1 + v1 - round, p0 + v0, p1 + v1 - c],
      );
    } else {
      rows.push(
        [p0 - v0, p1 - v1, p0 - v0 + c, p1 - v1, p0 - v0, p1 - v1],
        [p0 - v0, p1 + v1, p0 - v0, p1 + v1 - c, p0 - v0, p1 + v1],
        [p0 + v0, p1 + v1, p0 + v0 - c, p1 + v1, p0 + v0, p1 + v1],
      );
    }
  }
  return {
    c: true,
    v: rows.map(([vx, vy]) => [r3(vx), r3(vy)]),
    o: rows.map(([vx, vy, ox, oy]) => [r3(ox - vx), r3(oy - vy)]),
    i: rows.map(([vx, vy, , , ix, iy]) => [r3(ix - vx), r3(iy - vy)]),
  };
}

/** `el` as lottie-web draws it: from the top, clockwise unless `d` = 3. */
export function ellipseBezier(p: Vec, s: Vec, direction: number | undefined): LottieBezier {
  const [px, py] = [p[0] ?? 0, p[1] ?? 0];
  const rx = (s[0] ?? 0) / 2;
  const ry = (s[1] ?? 0) / 2;
  const cx = rx * ROUND_CORNER;
  const cy = ry * ROUND_CORNER;
  const cw = direction !== 3;
  const side = cw ? 1 : -1;
  const v: Vec[] = [
    [px, py - ry],
    [px + side * rx, py],
    [px, py + ry],
    [px - side * rx, py],
  ];
  const o: Vec[] = [
    [side * cx, 0],
    [0, cy],
    [-side * cx, 0],
    [0, -cy],
  ];
  const i: Vec[] = o.map(([x, y]) => [-x, -y]);
  return { c: true, v: v.map((q) => q.map(r3)), i: i.map((q) => q.map(r3)), o: o.map((q) => q.map(r3)) };
}

// ---------------------------------------------------------------------------
// easing handles
// ---------------------------------------------------------------------------

export const LINEAR_OUT: EaseHandle = { x: 0, y: 0 };
export const LINEAR_IN: EaseHandle = { x: 1, y: 1 };

/** First component of a handle value (a per-dimension array uses `index`, falling back to its first entry). */
export function handleAt(v: number | number[] | undefined, index: number, fallback: number): number {
  if (typeof v === 'number') return Number.isFinite(v) ? v : fallback;
  if (Array.isArray(v)) {
    const x = v[index] ?? v[0];
    return typeof x === 'number' && Number.isFinite(x) ? x : fallback;
  }
  return fallback;
}
