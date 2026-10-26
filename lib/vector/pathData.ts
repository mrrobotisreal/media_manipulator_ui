/**
 * SVG path-data parsing, serialisation, geometry and node editing for the
 * Motion document (code name `vector`).
 *
 * Paths are held as ABSOLUTE segments (M L C Q A Z only). H/V become L, S
 * becomes C, T becomes Q, relative becomes absolute. Every stored number goes
 * through `roundNum`, so parse → serialize → parse is a fixed point.
 */
import { formatNumber, roundNum } from '@/lib/vector/num';

export type Point = { x: number; y: number };

export type PathSegment =
  | { cmd: 'M'; x: number; y: number }
  | { cmd: 'L'; x: number; y: number }
  | { cmd: 'C'; x1: number; y1: number; x2: number; y2: number; x: number; y: number }
  | { cmd: 'Q'; x1: number; y1: number; x: number; y: number }
  | {
      cmd: 'A';
      rx: number;
      ry: number;
      rotation: number;
      largeArc: boolean;
      sweep: boolean;
      x: number;
      y: number;
    }
  | { cmd: 'Z' };

export class PathParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PathParseError';
  }
}

// ---------------------------------------------------------------------------
// Parsing
// ---------------------------------------------------------------------------

const ARG_COUNT: Record<string, number> = {
  m: 2,
  l: 2,
  h: 1,
  v: 1,
  c: 6,
  s: 4,
  q: 4,
  t: 2,
  a: 7,
  z: 0,
};

const NUMBER_RE = /[+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?/y;

function isWs(ch: string): boolean {
  return ch === ' ' || ch === '\t' || ch === '\n' || ch === '\r' || ch === '\f';
}

function isNumberStart(ch: string | undefined): boolean {
  return ch !== undefined && /[0-9+\-.]/.test(ch);
}

/**
 * Parse any valid SVG path data into absolute segments (see module doc).
 * Throws `PathParseError` on malformed input; blank input yields [].
 */
export function parsePath(d: string): PathSegment[] {
  const n = d.length;
  const segs: PathSegment[] = [];
  let i = 0;

  // Current point / subpath start stay unrounded to avoid drift.
  let cx = 0;
  let cy = 0;
  let sx = 0;
  let sy = 0;
  // Last cubic / quadratic control point (absolute), for S / T reflection.
  let prevC: Point | null = null;
  let prevQ: Point | null = null;

  const skipWs = (): void => {
    while (i < n && isWs(d[i])) i++;
  };
  const fail = (msg: string): never => {
    throw new PathParseError(`${msg} at position ${i}`);
  };
  const readNumber = (): number => {
    NUMBER_RE.lastIndex = i;
    const m = NUMBER_RE.exec(d);
    if (!m) return fail('Expected number');
    i += m[0].length;
    const v = Number(m[0]);
    if (!Number.isFinite(v)) return fail('Number out of range');
    return v;
  };
  const readFlag = (): number => {
    const ch = d[i];
    if (ch !== '0' && ch !== '1') return fail('Expected arc flag (0 or 1)');
    i++;
    return ch === '1' ? 1 : 0;
  };
  /** Optional whitespace, optional single comma, optional whitespace. */
  const sep = (): void => {
    skipWs();
    if (d[i] === ',') {
      i++;
      skipWs();
    }
  };

  let cmd = '';
  while (true) {
    skipWs();
    if (i >= n) break;
    const ch = d[i];
    if (/[A-Za-z]/.test(ch)) {
      if (!'MmLlHhVvCcSsQqTtAaZz'.includes(ch)) fail(`Unknown command '${ch}'`);
      cmd = ch;
      i++;
      if (segs.length === 0 && cmd !== 'M' && cmd !== 'm') fail('Path must start with M');
    } else if (isNumberStart(ch)) {
      // Implicit repeat is handled below; reaching here means stray numbers.
      fail(cmd === '' ? 'Path must start with a command' : 'Unexpected number');
    } else {
      fail(`Unexpected character '${ch}'`);
    }

    const lower = cmd.toLowerCase();
    if (lower === 'z') {
      segs.push({ cmd: 'Z' });
      cx = sx;
      cy = sy;
      prevC = null;
      prevQ = null;
      continue;
    }

    const rel = cmd === lower;
    const count = ARG_COUNT[lower];
    let group = cmd;
    // One argument group, then implicit repeats while numbers follow.
    while (true) {
      const a: number[] = [];
      for (let k = 0; k < count; k++) {
        if (k > 0) sep();
        else skipWs();
        a.push(lower === 'a' && (k === 3 || k === 4) ? readFlag() : readNumber());
      }
      const gl = group.toLowerCase();
      const ox = rel ? cx : 0;
      const oy = rel ? cy : 0;
      let nextC: Point | null = null;
      let nextQ: Point | null = null;
      switch (gl) {
        case 'm': {
          const x = ox + a[0];
          const y = oy + a[1];
          segs.push({ cmd: 'M', x: roundNum(x), y: roundNum(y) });
          cx = x;
          cy = y;
          sx = x;
          sy = y;
          break;
        }
        case 'l': {
          const x = ox + a[0];
          const y = oy + a[1];
          segs.push({ cmd: 'L', x: roundNum(x), y: roundNum(y) });
          cx = x;
          cy = y;
          break;
        }
        case 'h': {
          const x = ox + a[0];
          segs.push({ cmd: 'L', x: roundNum(x), y: roundNum(cy) });
          cx = x;
          break;
        }
        case 'v': {
          const y = oy + a[0];
          segs.push({ cmd: 'L', x: roundNum(cx), y: roundNum(y) });
          cy = y;
          break;
        }
        case 'c': {
          const x1 = ox + a[0];
          const y1 = oy + a[1];
          const x2 = ox + a[2];
          const y2 = oy + a[3];
          const x = ox + a[4];
          const y = oy + a[5];
          segs.push({
            cmd: 'C',
            x1: roundNum(x1),
            y1: roundNum(y1),
            x2: roundNum(x2),
            y2: roundNum(y2),
            x: roundNum(x),
            y: roundNum(y),
          });
          nextC = { x: x2, y: y2 };
          cx = x;
          cy = y;
          break;
        }
        case 's': {
          // First control point is the reflection of the previous cubic's
          // second control point through the current point (or the current
          // point itself when the previous segment was not a cubic).
          const x1: number = prevC ? 2 * cx - prevC.x : cx;
          const y1: number = prevC ? 2 * cy - prevC.y : cy;
          const x2 = ox + a[0];
          const y2 = oy + a[1];
          const x = ox + a[2];
          const y = oy + a[3];
          segs.push({
            cmd: 'C',
            x1: roundNum(x1),
            y1: roundNum(y1),
            x2: roundNum(x2),
            y2: roundNum(y2),
            x: roundNum(x),
            y: roundNum(y),
          });
          nextC = { x: x2, y: y2 };
          cx = x;
          cy = y;
          break;
        }
        case 'q': {
          const x1 = ox + a[0];
          const y1 = oy + a[1];
          const x = ox + a[2];
          const y = oy + a[3];
          segs.push({
            cmd: 'Q',
            x1: roundNum(x1),
            y1: roundNum(y1),
            x: roundNum(x),
            y: roundNum(y),
          });
          nextQ = { x: x1, y: y1 };
          cx = x;
          cy = y;
          break;
        }
        case 't': {
          const x1: number = prevQ ? 2 * cx - prevQ.x : cx;
          const y1: number = prevQ ? 2 * cy - prevQ.y : cy;
          const x = ox + a[0];
          const y = oy + a[1];
          segs.push({
            cmd: 'Q',
            x1: roundNum(x1),
            y1: roundNum(y1),
            x: roundNum(x),
            y: roundNum(y),
          });
          nextQ = { x: x1, y: y1 };
          cx = x;
          cy = y;
          break;
        }
        default: {
          // 'a'
          const x = ox + a[5];
          const y = oy + a[6];
          segs.push({
            cmd: 'A',
            rx: roundNum(Math.abs(a[0])),
            ry: roundNum(Math.abs(a[1])),
            rotation: roundNum(a[2]),
            largeArc: a[3] === 1,
            sweep: a[4] === 1,
            x: roundNum(x),
            y: roundNum(y),
          });
          cx = x;
          cy = y;
        }
      }
      prevC = nextC;
      prevQ = nextQ;

      skipWs();
      let comma = false;
      if (d[i] === ',') {
        comma = true;
        i++;
        skipWs();
      }
      if (isNumberStart(d[i])) {
        // Implicit repeat; extra pairs after M / m are lineto.
        if (gl === 'm') group = rel ? 'l' : 'L';
        continue;
      }
      if (comma) fail('Unexpected comma');
      break;
    }
  }
  return segs;
}

// ---------------------------------------------------------------------------
// Serialisation
// ---------------------------------------------------------------------------

function f(n: number): string {
  return formatNumber(n);
}

/** Canonical absolute serialisation, e.g. `M10 20L30 40Z`. */
export function serializePath(segs: PathSegment[]): string {
  let out = '';
  for (const s of segs) {
    switch (s.cmd) {
      case 'M':
      case 'L':
        out += `${s.cmd}${f(s.x)} ${f(s.y)}`;
        break;
      case 'C':
        out += `C${f(s.x1)} ${f(s.y1)} ${f(s.x2)} ${f(s.y2)} ${f(s.x)} ${f(s.y)}`;
        break;
      case 'Q':
        out += `Q${f(s.x1)} ${f(s.y1)} ${f(s.x)} ${f(s.y)}`;
        break;
      case 'A':
        out +=
          `A${f(s.rx)} ${f(s.ry)} ${f(s.rotation)} ${s.largeArc ? 1 : 0} ${s.sweep ? 1 : 0} ` +
          `${f(s.x)} ${f(s.y)}`;
        break;
      case 'Z':
        out += 'Z';
        break;
    }
  }
  return out;
}

/** serializePath(parsePath(d)); idempotent. */
export function normalizePath(d: string): string {
  return serializePath(parsePath(d));
}

// ---------------------------------------------------------------------------
// Bounds
// ---------------------------------------------------------------------------

const TAU = Math.PI * 2;

/** Roots in (0,1) of the derivative of a 1-D cubic Bezier. */
function cubicExtremaT(p0: number, p1: number, p2: number, p3: number): number[] {
  // B'(t)/3 = a t^2 + b t + c
  const a = -p0 + 3 * p1 - 3 * p2 + p3;
  const b = 2 * (p0 - 2 * p1 + p2);
  const c = p1 - p0;
  const ts: number[] = [];
  if (Math.abs(a) < 1e-12) {
    if (Math.abs(b) > 1e-12) ts.push(-c / b);
  } else {
    const disc = b * b - 4 * a * c;
    if (disc >= 0) {
      const sq = Math.sqrt(disc);
      ts.push((-b + sq) / (2 * a), (-b - sq) / (2 * a));
    }
  }
  return ts.filter((t) => t > 0 && t < 1);
}

function cubicAt(p0: number, p1: number, p2: number, p3: number, t: number): number {
  const u = 1 - t;
  return u * u * u * p0 + 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t * p3;
}

function quadAt(p0: number, p1: number, p2: number, t: number): number {
  const u = 1 - t;
  return u * u * p0 + 2 * u * t * p1 + t * t * p2;
}

export interface ArcCenter {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  phi: number;
  theta1: number;
  dtheta: number;
}

/** SVG spec F.6.5 endpoint → center parameterisation (with F.6.6 radii scaling). */
export function arcToCenter(
  x1: number,
  y1: number,
  seg: Extract<PathSegment, { cmd: 'A' }>,
): ArcCenter {
  const phi = (seg.rotation * Math.PI) / 180;
  const cosP = Math.cos(phi);
  const sinP = Math.sin(phi);
  const dx = (x1 - seg.x) / 2;
  const dy = (y1 - seg.y) / 2;
  const x1p = cosP * dx + sinP * dy;
  const y1p = -sinP * dx + cosP * dy;
  let rx = Math.abs(seg.rx);
  let ry = Math.abs(seg.ry);
  const lam = (x1p * x1p) / (rx * rx) + (y1p * y1p) / (ry * ry);
  if (lam > 1) {
    const s = Math.sqrt(lam);
    rx *= s;
    ry *= s;
  }
  const rx2 = rx * rx;
  const ry2 = ry * ry;
  const den = rx2 * y1p * y1p + ry2 * x1p * x1p;
  const num = rx2 * ry2 - den;
  const coef = (seg.largeArc === seg.sweep ? -1 : 1) * Math.sqrt(Math.max(0, num / den));
  const cxp = (coef * rx * y1p) / ry;
  const cyp = (-coef * ry * x1p) / rx;
  const cx = cosP * cxp - sinP * cyp + (x1 + seg.x) / 2;
  const cy = sinP * cxp + cosP * cyp + (y1 + seg.y) / 2;
  const theta1 = Math.atan2((y1p - cyp) / ry, (x1p - cxp) / rx);
  const theta2 = Math.atan2((-y1p - cyp) / ry, (-x1p - cxp) / rx);
  let dtheta = theta2 - theta1;
  if (!seg.sweep && dtheta > 0) dtheta -= TAU;
  else if (seg.sweep && dtheta < 0) dtheta += TAU;
  return { cx, cy, rx, ry, phi, theta1, dtheta };
}

/** Tight axis-aligned bounds of the path geometry; null when empty. */
export function pathBounds(
  segs: PathSegment[],
): { x: number; y: number; width: number; height: number } | null {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  const add = (x: number, y: number): void => {
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  };
  let cx = 0;
  let cy = 0;
  let sx = 0;
  let sy = 0;
  for (const s of segs) {
    switch (s.cmd) {
      case 'M':
        cx = sx = s.x;
        cy = sy = s.y;
        add(cx, cy);
        break;
      case 'L':
        add(cx, cy);
        add(s.x, s.y);
        cx = s.x;
        cy = s.y;
        break;
      case 'C': {
        add(cx, cy);
        add(s.x, s.y);
        for (const t of cubicExtremaT(cx, s.x1, s.x2, s.x)) {
          add(cubicAt(cx, s.x1, s.x2, s.x, t), cubicAt(cy, s.y1, s.y2, s.y, t));
        }
        for (const t of cubicExtremaT(cy, s.y1, s.y2, s.y)) {
          add(cubicAt(cx, s.x1, s.x2, s.x, t), cubicAt(cy, s.y1, s.y2, s.y, t));
        }
        cx = s.x;
        cy = s.y;
        break;
      }
      case 'Q': {
        add(cx, cy);
        add(s.x, s.y);
        // B'(t) = 0 at t = (p0 - p1) / (p0 - 2 p1 + p2)
        const tx = cx - 2 * s.x1 + s.x;
        const ty = cy - 2 * s.y1 + s.y;
        const ts: number[] = [];
        if (Math.abs(tx) > 1e-12) ts.push((cx - s.x1) / tx);
        if (Math.abs(ty) > 1e-12) ts.push((cy - s.y1) / ty);
        for (const t of ts) {
          if (t > 0 && t < 1) add(quadAt(cx, s.x1, s.x, t), quadAt(cy, s.y1, s.y, t));
        }
        cx = s.x;
        cy = s.y;
        break;
      }
      case 'A': {
        add(cx, cy);
        add(s.x, s.y);
        const degenerate = s.rx === 0 || s.ry === 0;
        const same = cx === s.x && cy === s.y;
        if (!degenerate && !same) {
          const c = arcToCenter(cx, cy, s);
          const cosP = Math.cos(c.phi);
          const sinP = Math.sin(c.phi);
          // x(θ) = cx + rx cosφ cosθ − ry sinφ sinθ, y(θ) = cy + rx sinφ cosθ + ry cosφ sinθ
          // Extrema where dx/dθ = 0 or dy/dθ = 0, each giving θ and θ + π.
          const tx = Math.atan2(-c.ry * sinP, c.rx * cosP);
          const ty = Math.atan2(c.ry * cosP, c.rx * sinP);
          for (const base of [tx, ty]) {
            for (const th of [base, base + Math.PI]) {
              const delta =
                c.dtheta >= 0
                  ? mod(th - c.theta1, TAU)
                  : mod(c.theta1 - th, TAU);
              if (delta <= Math.abs(c.dtheta)) {
                add(
                  c.cx + c.rx * cosP * Math.cos(th) - c.ry * sinP * Math.sin(th),
                  c.cy + c.rx * sinP * Math.cos(th) + c.ry * cosP * Math.sin(th),
                );
              }
            }
          }
        }
        cx = s.x;
        cy = s.y;
        break;
      }
      case 'Z':
        cx = sx;
        cy = sy;
        break;
    }
  }
  if (minX === Infinity) return null;
  return {
    x: roundNum(minX),
    y: roundNum(minY),
    width: roundNum(maxX - minX),
    height: roundNum(maxY - minY),
  };
}

function mod(a: number, m: number): number {
  return ((a % m) + m) % m;
}

// ---------------------------------------------------------------------------
// Transforms
// ---------------------------------------------------------------------------

type Matrix = readonly [number, number, number, number, number, number];

/** Normalise an angle in degrees into (-90, 90] (ellipse axes repeat every 180°). */
function normAxisDeg(deg: number): number {
  let r = mod(deg, 180);
  if (r > 90) r -= 180;
  return r;
}

/** Angular distance between two axis angles in degrees, modulo 180. */
function axisDist(a: number, b: number): number {
  const d = mod(a - b, 180);
  return Math.min(d, 180 - d);
}

/** Apply an affine matrix [a,b,c,d,e,f] to every coordinate. */
export function transformPath(segs: PathSegment[], m: Matrix): PathSegment[] {
  const [a, b, c, d, e, f0] = m;
  const px = (x: number, y: number): number => roundNum(a * x + c * y + e);
  const py = (x: number, y: number): number => roundNum(b * x + d * y + f0);
  const det = a * d - b * c;
  const linearIdentity = a === 1 && b === 0 && c === 0 && d === 1;

  return segs.map((s): PathSegment => {
    switch (s.cmd) {
      case 'M':
      case 'L':
        return { cmd: s.cmd, x: px(s.x, s.y), y: py(s.x, s.y) };
      case 'C':
        return {
          cmd: 'C',
          x1: px(s.x1, s.y1),
          y1: py(s.x1, s.y1),
          x2: px(s.x2, s.y2),
          y2: py(s.x2, s.y2),
          x: px(s.x, s.y),
          y: py(s.x, s.y),
        };
      case 'Q':
        return {
          cmd: 'Q',
          x1: px(s.x1, s.y1),
          y1: py(s.x1, s.y1),
          x: px(s.x, s.y),
          y: py(s.x, s.y),
        };
      case 'Z':
        return { cmd: 'Z' };
      case 'A': {
        const x = px(s.x, s.y);
        const y = py(s.x, s.y);
        if (linearIdentity) return { ...s, x, y };
        // Ellipse as a linear map M = L · R(φ) · diag(rx, ry); the image
        // ellipse has axes given by the SVD of M. S = M Mᵀ is symmetric with
        // eigenvalues = squared semi-axes and eigenvectors = axis directions.
        const phi = (s.rotation * Math.PI) / 180;
        const cp = Math.cos(phi);
        const sp = Math.sin(phi);
        const m00 = (a * cp + c * sp) * s.rx;
        const m10 = (b * cp + d * sp) * s.rx;
        const m01 = (-a * sp + c * cp) * s.ry;
        const m11 = (-b * sp + d * cp) * s.ry;
        const p = m00 * m00 + m01 * m01;
        const q = m00 * m10 + m01 * m11;
        const r = m10 * m10 + m11 * m11;
        const half = (p + r) / 2;
        const root = Math.sqrt(((p - r) / 2) ** 2 + q * q);
        const major = Math.sqrt(Math.max(0, half + root));
        const minor = Math.sqrt(Math.max(0, half - root));
        // Direction of the major axis; either axis may serve as "rx", so pick
        // the one nearest the original orientation to keep output natural.
        const majorDeg = (0.5 * Math.atan2(2 * q, p - r) * 180) / Math.PI;
        const refDeg = s.rotation + (Math.atan2(b, a) * 180) / Math.PI;
        let rxN: number;
        let ryN: number;
        let rot: number;
        if (root < 1e-9 * Math.max(1, half)) {
          rxN = ryN = major;
          rot = normAxisDeg(refDeg);
        } else if (axisDist(majorDeg, refDeg) <= axisDist(majorDeg + 90, refDeg)) {
          rxN = major;
          ryN = minor;
          rot = normAxisDeg(majorDeg);
        } else {
          rxN = minor;
          ryN = major;
          rot = normAxisDeg(majorDeg + 90);
        }
        return {
          cmd: 'A',
          rx: roundNum(rxN),
          ry: roundNum(ryN),
          rotation: roundNum(rot),
          largeArc: s.largeArc,
          sweep: det < 0 ? !s.sweep : s.sweep,
          x,
          y,
        };
      }
    }
  });
}

/** Translate shortcut. */
export function translatePath(segs: PathSegment[], dx: number, dy: number): PathSegment[] {
  return transformPath(segs, [1, 0, 0, 1, dx, dy]);
}

// ---------------------------------------------------------------------------
// Node editing
// ---------------------------------------------------------------------------

export interface PathNode {
  /** index of the segment whose endpoint this node is */
  segIndex: number;
  x: number;
  y: number;
  /** incoming control point: (x2,y2) of this segment when it is a C, (x1,y1) when Q */
  in?: Point;
  /** outgoing control point: (x1,y1) of the NEXT segment when that is a C */
  out?: Point;
  /** true when this node closes a subpath (followed by Z) */
  closesSubpath?: boolean;
}

/** One node per endpoint-bearing segment (M, L, C, Q, A), in order. */
export function pathNodes(segs: PathSegment[]): PathNode[] {
  const nodes: PathNode[] = [];
  segs.forEach((s, i) => {
    if (s.cmd === 'Z') return;
    const node: PathNode = { segIndex: i, x: s.x, y: s.y };
    if (s.cmd === 'C') node.in = { x: s.x2, y: s.y2 };
    else if (s.cmd === 'Q') node.in = { x: s.x1, y: s.y1 };
    const next = segs[i + 1];
    if (next && next.cmd === 'C') node.out = { x: next.x1, y: next.y1 };
    if (next && next.cmd === 'Z') node.closesSubpath = true;
    nodes.push(node);
  });
  return nodes;
}

function cloneSegs(segs: PathSegment[]): PathSegment[] {
  return segs.map((s) => ({ ...s }));
}

/** Shift a segment's endpoint and incoming control point in place. */
function shiftSegmentIn(s: PathSegment, dx: number, dy: number): void {
  if (s.cmd === 'Z') return;
  s.x = roundNum(s.x + dx);
  s.y = roundNum(s.y + dy);
  if (s.cmd === 'C') {
    s.x2 = roundNum(s.x2 + dx);
    s.y2 = roundNum(s.y2 + dy);
  } else if (s.cmd === 'Q') {
    s.x1 = roundNum(s.x1 + dx);
    s.y1 = roundNum(s.y1 + dy);
  }
}

/**
 * Move a node by (dx,dy), carrying its handles. For the M of a closed subpath
 * whose last segment ends on the same point, that end point moves too.
 */
export function moveNode(
  segs: PathSegment[],
  segIndex: number,
  dx: number,
  dy: number,
): PathSegment[] {
  const out = cloneSegs(segs);
  const seg = out[segIndex];
  if (!seg || seg.cmd === 'Z') return out;

  // Detect the coincident closing end point before mutating the M.
  let coincident = -1;
  if (seg.cmd === 'M') {
    let k = segIndex + 1;
    while (k < out.length && out[k].cmd !== 'M' && out[k].cmd !== 'Z') k++;
    const last = out[k - 1];
    if (k - 1 > segIndex && out[k]?.cmd === 'Z' && last.cmd !== 'Z' && last.cmd !== 'M') {
      if (last.x === seg.x && last.y === seg.y) coincident = k - 1;
    }
  }

  shiftSegmentIn(seg, dx, dy);
  const next = out[segIndex + 1];
  if (next && next.cmd === 'C') {
    next.x1 = roundNum(next.x1 + dx);
    next.y1 = roundNum(next.y1 + dy);
  }
  if (coincident >= 0) shiftSegmentIn(out[coincident], dx, dy);
  return out;
}

/**
 * Set a control handle absolutely. `mirror === true` reflects the opposite
 * handle exactly through the node; `'angle'` keeps its original length.
 * No-op (copy) when the handle does not exist.
 */
export function moveHandle(
  segs: PathSegment[],
  segIndex: number,
  which: 'in' | 'out',
  p: Point,
  mirror?: boolean | 'angle',
): PathSegment[] {
  const out = cloneSegs(segs);
  const seg = out[segIndex];
  if (!seg || seg.cmd === 'Z') return out;
  const next = out[segIndex + 1];
  const nextC = next && next.cmd === 'C' ? next : null;

  let setThis: ((x: number, y: number) => void) | null = null;
  let getThis: (() => Point) | null = null;
  if (seg.cmd === 'C') {
    setThis = (x, y) => {
      seg.x2 = roundNum(x);
      seg.y2 = roundNum(y);
    };
    getThis = () => ({ x: seg.x2, y: seg.y2 });
  } else if (seg.cmd === 'Q') {
    setThis = (x, y) => {
      seg.x1 = roundNum(x);
      seg.y1 = roundNum(y);
    };
    getThis = () => ({ x: seg.x1, y: seg.y1 });
  }
  const setNext = nextC
    ? (x: number, y: number): void => {
        nextC.x1 = roundNum(x);
        nextC.y1 = roundNum(y);
      }
    : null;
  const getNext = nextC ? (): Point => ({ x: nextC.x1, y: nextC.y1 }) : null;

  const [setMain, setOpp, getOpp] =
    which === 'in' ? [setThis, setNext, getNext] : [setNext, setThis, getThis];
  if (!setMain) return out;

  setMain(p.x, p.y);
  if (mirror && setOpp && getOpp) {
    const vx = seg.x - p.x;
    const vy = seg.y - p.y;
    if (mirror === 'angle') {
      const len = Math.hypot(vx, vy);
      if (len > 0) {
        const o = getOpp();
        const oLen = Math.hypot(o.x - seg.x, o.y - seg.y);
        setOpp(seg.x + (vx / len) * oLen, seg.y + (vy / len) * oLen);
      }
    } else {
      setOpp(seg.x + vx, seg.y + vy);
    }
  }
  return out;
}

/** Keep only subpaths that draw something, and start at an M. */
function cleanup(segs: PathSegment[]): PathSegment[] {
  const groups: PathSegment[][] = [];
  for (const s of segs) {
    if (s.cmd === 'M') groups.push([s]);
    else if (groups.length > 0) groups[groups.length - 1].push(s);
    // Leading non-M segments are dropped (a path must start with M).
  }
  return groups
    .filter((g) => g.some((s) => s.cmd !== 'M' && s.cmd !== 'Z'))
    .flat();
}

/**
 * Delete a node's segment. Deleting an M promotes the following segment's
 * endpoint to the new M. Returns [] when nothing drawable remains.
 */
export function deleteNode(segs: PathSegment[], segIndex: number): PathSegment[] {
  const out = cloneSegs(segs);
  const seg = out[segIndex];
  if (!seg || seg.cmd === 'Z') return cleanup(out);
  if (seg.cmd === 'M') {
    const next = out[segIndex + 1];
    if (next && next.cmd !== 'M' && next.cmd !== 'Z') {
      out.splice(segIndex, 2, { cmd: 'M', x: next.x, y: next.y });
    } else {
      out.splice(segIndex, 1);
    }
  } else {
    out.splice(segIndex, 1);
  }
  return cleanup(out);
}
