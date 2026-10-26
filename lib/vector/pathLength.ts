/**
 * Pure path measurement for Motion (ticket MM45 decision 2): arc length,
 * flattening and arc-length sampling of SVG path data, for the draw-on
 * animator, the motion-path preview and tests / SSR where
 * `SVGGeometryElement.getTotalLength()` is not available (the editor uses the
 * browser's measurement when it has a mounted element; both agree within
 * 0.5 % on the fixtures in `pathLength.test.ts`).
 *
 * Every segment is first converted to absolute cubic béziers
 * (`toCubicSubpaths`, shared with the morph normaliser): lines and the
 * closing `Z` become straight cubics, quadratics are degree-elevated
 * (exact), arcs are split into ≤ 45° pieces with the standard
 * `4/3·tan(δ/4)` approximation (radial error < 5e-6 · r). Cubics are then
 * flattened by recursive subdivision until every control point lies within
 * `FLATTEN_TOLERANCE` (0.1 px, proposed in the ticket) of the chord; each
 * flat piece's length is integrated with 5-point Gauss–Legendre on the
 * original curve, so the total is accurate far beyond the flattening
 * tolerance.
 *
 * Motion-path semantics (shared by the preview, the CSS `offset-path`
 * exporter and the anime runtime): distance runs over the drawing segments
 * only (a move between subpaths has no length); a path that is ONE closed
 * subpath wraps (distance modulo length, like CSS `offset-distance` on a
 * closed path); any other path clamps to [0, length].
 */
import { arcToCenter, parsePath, type PathSegment } from '@/lib/vector/pathData';

/** Flattening tolerance in user units (ticket decision 2, proposed). */
export const FLATTEN_TOLERANCE = 0.1;

/** `[x0, y0, x1, y1, x2, y2, x3, y3]`. */
export type Cubic = [number, number, number, number, number, number, number, number];

export interface CubicSubpath {
  x: number;
  y: number;
  cubics: Cubic[];
  /** Ended with `Z` (the closing segment, when not zero-length, is the last cubic). */
  closed: boolean;
}

/** Largest arc piece per cubic: 45°, radial error < 5e-6 · r. */
const ARC_PIECE = Math.PI / 4;

const line = (x0: number, y0: number, x1: number, y1: number): Cubic => [
  x0,
  y0,
  x0 + (x1 - x0) / 3,
  y0 + (y1 - y0) / 3,
  x0 + ((x1 - x0) * 2) / 3,
  y0 + ((y1 - y0) * 2) / 3,
  x1,
  y1,
];

function arcCubics(x0: number, y0: number, seg: Extract<PathSegment, { cmd: 'A' }>): Cubic[] {
  if (x0 === seg.x && y0 === seg.y) return [];
  if (seg.rx === 0 || seg.ry === 0) return [line(x0, y0, seg.x, seg.y)];
  const c = arcToCenter(x0, y0, seg);
  if (!Number.isFinite(c.cx) || !Number.isFinite(c.cy) || !Number.isFinite(c.dtheta)) return [line(x0, y0, seg.x, seg.y)];
  const n = Math.max(1, Math.ceil(Math.abs(c.dtheta) / ARC_PIECE - 1e-9));
  const d = c.dtheta / n;
  const k = (4 / 3) * Math.tan(d / 4);
  const cos = Math.cos(c.phi);
  const sin = Math.sin(c.phi);
  const pt = (a: number) => {
    const ex = c.rx * Math.cos(a);
    const ey = c.ry * Math.sin(a);
    return [c.cx + cos * ex - sin * ey, c.cy + sin * ex + cos * ey];
  };
  const tan = (a: number) => {
    const ex = -c.rx * Math.sin(a);
    const ey = c.ry * Math.cos(a);
    return [cos * ex - sin * ey, sin * ex + cos * ey];
  };
  const out: Cubic[] = [];
  let px = x0;
  let py = y0;
  for (let i = 0; i < n; i++) {
    const a0 = c.theta1 + d * i;
    const a1 = a0 + d;
    const [tx0, ty0] = tan(a0);
    const [tx1, ty1] = tan(a1);
    // The last piece ends exactly on the segment's endpoint.
    const [qx, qy] = i === n - 1 ? [seg.x, seg.y] : pt(a1);
    out.push([px, py, px + k * tx0, py + k * ty0, qx - k * tx1, qy - k * ty1, qx, qy]);
    px = qx;
    py = qy;
  }
  return out;
}

/** Absolute cubic subpaths of parsed segments. Subpaths with no drawing segment are dropped. */
export function toCubicSubpaths(segs: PathSegment[]): CubicSubpath[] {
  const out: CubicSubpath[] = [];
  let cur: CubicSubpath | null = null;
  let cx = 0;
  let cy = 0;
  let sx = 0;
  let sy = 0;
  const flush = () => {
    if (cur && cur.cubics.length > 0) out.push(cur);
    cur = null;
  };
  const open = (): CubicSubpath => {
    if (!cur) cur = { x: sx, y: sy, cubics: [], closed: false };
    return cur;
  };
  for (const s of segs) {
    switch (s.cmd) {
      case 'M':
        flush();
        cx = sx = s.x;
        cy = sy = s.y;
        break;
      case 'L':
        open().cubics.push(line(cx, cy, s.x, s.y));
        cx = s.x;
        cy = s.y;
        break;
      case 'C':
        open().cubics.push([cx, cy, s.x1, s.y1, s.x2, s.y2, s.x, s.y]);
        cx = s.x;
        cy = s.y;
        break;
      case 'Q':
        open().cubics.push([
          cx,
          cy,
          cx + ((s.x1 - cx) * 2) / 3,
          cy + ((s.y1 - cy) * 2) / 3,
          s.x + ((s.x1 - s.x) * 2) / 3,
          s.y + ((s.y1 - s.y) * 2) / 3,
          s.x,
          s.y,
        ]);
        cx = s.x;
        cy = s.y;
        break;
      case 'A':
        open().cubics.push(...arcCubics(cx, cy, s));
        cx = s.x;
        cy = s.y;
        break;
      case 'Z': {
        const sp = open();
        if (cx !== sx || cy !== sy) sp.cubics.push(line(cx, cy, sx, sy));
        sp.closed = true;
        flush();
        cx = sx;
        cy = sy;
        break;
      }
    }
  }
  flush();
  return out;
}

// ---------------------------------------------------------------------------
// cubic maths
// ---------------------------------------------------------------------------

export function cubicPoint(c: Cubic, t: number): [number, number] {
  const u = 1 - t;
  const a = u * u * u;
  const b = 3 * u * u * t;
  const d = 3 * u * t * t;
  const e = t * t * t;
  return [a * c[0] + b * c[2] + d * c[4] + e * c[6], a * c[1] + b * c[3] + d * c[5] + e * c[7]];
}

export function cubicDerivative(c: Cubic, t: number): [number, number] {
  const u = 1 - t;
  const a = 3 * u * u;
  const b = 6 * u * t;
  const d = 3 * t * t;
  return [a * (c[2] - c[0]) + b * (c[4] - c[2]) + d * (c[6] - c[4]), a * (c[3] - c[1]) + b * (c[5] - c[3]) + d * (c[7] - c[5])];
}

/** de Casteljau split at t. */
export function splitCubic(c: Cubic, t: number): [Cubic, Cubic] {
  const lerp = (a: number, b: number) => a + (b - a) * t;
  const [x0, y0, x1, y1, x2, y2, x3, y3] = c;
  const x01 = lerp(x0, x1);
  const y01 = lerp(y0, y1);
  const x12 = lerp(x1, x2);
  const y12 = lerp(y1, y2);
  const x23 = lerp(x2, x3);
  const y23 = lerp(y2, y3);
  const xa = lerp(x01, x12);
  const ya = lerp(y01, y12);
  const xb = lerp(x12, x23);
  const yb = lerp(y12, y23);
  const xm = lerp(xa, xb);
  const ym = lerp(ya, yb);
  return [
    [x0, y0, x01, y01, xa, ya, xm, ym],
    [xm, ym, xb, yb, x23, y23, x3, y3],
  ];
}

const GL_X = [-0.906179845938664, -0.5384693101056831, 0, 0.5384693101056831, 0.906179845938664];
const GL_W = [0.2369268850561891, 0.4786286704993665, 0.5688888888888889, 0.4786286704993665, 0.2369268850561891];

/** Arc length of `c` over [t0, t1] (5-point Gauss–Legendre). */
function glLength(c: Cubic, t0: number, t1: number): number {
  const h = (t1 - t0) / 2;
  const m = (t1 + t0) / 2;
  let sum = 0;
  for (let i = 0; i < 5; i++) {
    const [dx, dy] = cubicDerivative(c, m + h * GL_X[i]);
    sum += GL_W[i] * Math.hypot(dx, dy);
  }
  return sum * h;
}

function distToChord(px: number, py: number, x0: number, y0: number, x1: number, y1: number): number {
  const dx = x1 - x0;
  const dy = y1 - y0;
  const len2 = dx * dx + dy * dy;
  if (len2 === 0) return Math.hypot(px - x0, py - y0);
  const u = Math.max(0, Math.min(1, ((px - x0) * dx + (py - y0) * dy) / len2));
  return Math.hypot(px - (x0 + u * dx), py - (y0 + u * dy));
}

/**
 * Flat within `tol`: both control points within `tol` of the chord AND the
 * control polygon no more than `tol` longer than the chord (the second test
 * catches cusps, where the curve doubles back along its own chord).
 */
function isFlat(c: Cubic, tol: number): boolean {
  if (distToChord(c[2], c[3], c[0], c[1], c[6], c[7]) > tol || distToChord(c[4], c[5], c[0], c[1], c[6], c[7]) > tol) return false;
  const poly = Math.hypot(c[2] - c[0], c[3] - c[1]) + Math.hypot(c[4] - c[2], c[5] - c[3]) + Math.hypot(c[6] - c[4], c[7] - c[5]);
  return poly - Math.hypot(c[6] - c[0], c[7] - c[1]) <= tol;
}

/** Parameter ranges of `c` whose sub-curves are flat within `tol`. */
function flatRanges(c: Cubic, tol: number, out: Array<[number, number]>, t0 = 0, t1 = 1, sub: Cubic = c, depth = 0): void {
  if (depth >= 18 || isFlat(sub, tol)) {
    out.push([t0, t1]);
    return;
  }
  const [a, b] = splitCubic(sub, 0.5);
  const tm = (t0 + t1) / 2;
  flatRanges(c, tol, out, t0, tm, a, depth + 1);
  flatRanges(c, tol, out, tm, t1, b, depth + 1);
}

/** Arc length of one cubic (flattened at the tolerance, each piece integrated). */
export function cubicLength(c: Cubic, tol = FLATTEN_TOLERANCE): number {
  const ranges: Array<[number, number]> = [];
  flatRanges(c, tol, ranges);
  let len = 0;
  for (const [a, b] of ranges) len += glLength(c, a, b);
  return len;
}

/** Parameter t where the arc length from 0 reaches `fraction` of the cubic's length. */
export function cubicParamAtFraction(c: Cubic, fraction: number): number {
  const total = cubicLength(c);
  if (total === 0) return fraction;
  const target = total * fraction;
  let lo = 0;
  let hi = 1;
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2;
    if (cubicLength(splitCubic(c, mid)[0]) < target) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

// ---------------------------------------------------------------------------
// measure
// ---------------------------------------------------------------------------

interface Piece {
  c: Cubic;
  t0: number;
  t1: number;
  /** Cumulative distance at the start of the piece. */
  s0: number;
  len: number;
}

export interface PathPoint {
  x: number;
  y: number;
  /** Direction of travel in degrees (atan2 of the tangent), what CSS `offset-rotate: auto` uses. */
  angle: number;
}

export interface PathMeasure {
  length: number;
  /** One closed subpath: distances wrap. */
  closed: boolean;
  /** Point at a distance along the path (wrapped or clamped, see the module comment). */
  at(distance: number): PathPoint;
  /** Flattened polylines, one per subpath (for tests and hit areas). */
  polylines(): Array<Array<{ x: number; y: number }>>;
}

function buildMeasure(subpaths: CubicSubpath[]): PathMeasure | null {
  const pieces: Piece[] = [];
  let s = 0;
  for (const sp of subpaths) {
    for (const c of sp.cubics) {
      const ranges: Array<[number, number]> = [];
      flatRanges(c, FLATTEN_TOLERANCE, ranges);
      for (const [t0, t1] of ranges) {
        const len = glLength(c, t0, t1);
        pieces.push({ c, t0, t1, s0: s, len });
        s += len;
      }
    }
  }
  if (pieces.length === 0) return null;
  const length = s;
  const closed = subpaths.length === 1 && subpaths[0].closed;

  const angleAt = (p: Piece, t: number) => {
    let [dx, dy] = cubicDerivative(p.c, t);
    if (Math.hypot(dx, dy) < 1e-9) {
      const a = cubicPoint(p.c, p.t0);
      const b = cubicPoint(p.c, p.t1);
      dx = b[0] - a[0];
      dy = b[1] - a[1];
    }
    return (Math.atan2(dy, dx) * 180) / Math.PI;
  };

  return {
    length,
    closed,
    at(distance: number): PathPoint {
      let d = Number.isFinite(distance) ? distance : 0;
      if (closed && length > 0) d = ((d % length) + length) % length;
      else d = Math.min(Math.max(0, d), length);
      let lo = 0;
      let hi = pieces.length - 1;
      while (lo < hi) {
        const mid = (lo + hi + 1) >> 1;
        if (pieces[mid].s0 <= d) lo = mid;
        else hi = mid - 1;
      }
      const p = pieces[lo];
      // Invert arc length inside the piece (speed is not uniform in t).
      const want = Math.min(p.len, Math.max(0, d - p.s0));
      let a = p.t0;
      let b = p.t1;
      if (want <= 0) b = p.t0;
      else if (want >= p.len) a = p.t1;
      else {
        for (let i = 0; i < 30; i++) {
          const mid = (a + b) / 2;
          if (glLength(p.c, p.t0, mid) < want) a = mid;
          else b = mid;
        }
      }
      const t = (a + b) / 2;
      const [x, y] = cubicPoint(p.c, t);
      return { x, y, angle: angleAt(p, t) };
    },
    polylines() {
      const out: Array<Array<{ x: number; y: number }>> = [];
      for (const sp of subpaths) {
        const pts = [{ x: sp.x, y: sp.y }];
        for (const c of sp.cubics) {
          const ranges: Array<[number, number]> = [];
          flatRanges(c, FLATTEN_TOLERANCE, ranges);
          for (const [, t1] of ranges) {
            const [x, y] = cubicPoint(c, t1);
            pts.push({ x, y });
          }
        }
        out.push(pts);
      }
      return out;
    },
  };
}

const CACHE_MAX = 64;
const cache = new Map<string, PathMeasure | null>();

/** Measure path data (cached by string). Null when it does not parse or draws nothing. */
export function measurePath(d: string): PathMeasure | null {
  const hit = cache.get(d);
  if (hit !== undefined) return hit;
  let m: PathMeasure | null;
  try {
    m = buildMeasure(toCubicSubpaths(parsePath(d)));
  } catch {
    m = null;
  }
  if (cache.size >= CACHE_MAX) cache.delete(cache.keys().next().value as string);
  cache.set(d, m);
  return m;
}

/** Total length of path data; 0 when it does not parse or draws nothing. */
export function pathLength(d: string): number {
  return measurePath(d)?.length ?? 0;
}
