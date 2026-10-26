/**
 * Shape-morph normalisation (ticket MM45 decision 4). In-house, no
 * dependency (`flubber` 0.4.2 was the named fallback; decision logged in the
 * ticket): the parsing / absolutising half is MM42's `pathData.ts`, the cubic
 * conversion is `pathLength.ts`'s `toCubicSubpaths`.
 *
 * `normalizeMorphSet(paths)` rewrites a list of path-data strings (the `d`
 * keyframes of one track, in time order) so that every one has the SAME
 * command sequence: per subpath one `M`, the same number of `C`s, and a `Z`
 * when that subpath is closed in every key. Then a morph is a plain
 * number-by-number interpolation (`interpolatePath`), which is what the
 * preview, the anime.js runtime and CSS `d: path()` all do. Steps:
 *
 *   1. every segment becomes an absolute cubic bézier (lines, quadratics,
 *      arcs, the closing segment of a `Z`);
 *   2. subpaths are matched BY ORDER; a key with fewer subpaths gets the
 *      extras as a subpath collapsed to a point (the centre of the nearest
 *      key's matching subpath), so it grows out of / shrinks into a point;
 *   3. inside a subpath, the key with fewer segments has its LONGEST segment
 *      (by arc length) split at its arc-length midpoint until the counts are
 *      equal (every key reaches the maximum count of that subpath);
 *   4. closed subpaths are aligned to the previous key, winding direction and
 *      start point together: every rotation of the segment list, forwards
 *      and reversed, keeping the one with the smallest summed squared
 *      distance between corresponding nodes. Open subpaths keep their
 *      direction and start.
 *
 * Output numbers go through `formatNumber` (3 decimals, like the rest of the
 * model), so the normalised strings are canonical and re-normalising an
 * already-normalised set returns the same strings. Morph tracks store these
 * strings at each key, so exporters never recompute them.
 */
import { formatNumber } from '@/lib/vector/num';
import { parsePath } from '@/lib/vector/pathData';
import { cubicLength, cubicParamAtFraction, splitCubic, toCubicSubpaths, type Cubic, type CubicSubpath } from '@/lib/vector/pathLength';

interface Shape {
  subpaths: Array<CubicSubpath | null>;
}

const parseShape = (d: string): CubicSubpath[] | null => {
  try {
    return toCubicSubpaths(parsePath(d));
  } catch {
    return null;
  }
};

function centre(sp: CubicSubpath): [number, number] {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const c of sp.cubics) {
    for (let i = 0; i < 8; i += 2) {
      minX = Math.min(minX, c[i]);
      maxX = Math.max(maxX, c[i]);
      minY = Math.min(minY, c[i + 1]);
      maxY = Math.max(maxY, c[i + 1]);
    }
  }
  return [(minX + maxX) / 2, (minY + maxY) / 2];
}

const pointSubpath = (x: number, y: number, n: number, closed: boolean): CubicSubpath => ({
  x,
  y,
  cubics: Array.from({ length: n }, () => [x, y, x, y, x, y, x, y] as Cubic),
  closed,
});

/** Split the longest segments until the subpath has `n` cubics. */
function splitTo(sp: CubicSubpath, n: number): CubicSubpath {
  if (sp.cubics.length >= n) return sp;
  const cubics = [...sp.cubics];
  const lens = cubics.map((c) => cubicLength(c));
  while (cubics.length < n) {
    let at = 0;
    for (let i = 1; i < lens.length; i++) if (lens[i] > lens[at]) at = i;
    const t = lens[at] > 0 ? cubicParamAtFraction(cubics[at], 0.5) : 0.5;
    const [a, b] = splitCubic(cubics[at], t);
    cubics.splice(at, 1, a, b);
    lens.splice(at, 1, lens[at] / 2, lens[at] / 2);
  }
  return { ...sp, cubics };
}

function reverseSubpath(sp: CubicSubpath): CubicSubpath {
  const cubics = [...sp.cubics].reverse().map((c) => [c[6], c[7], c[4], c[5], c[2], c[3], c[0], c[1]] as Cubic);
  return { x: cubics[0][0], y: cubics[0][1], cubics, closed: sp.closed };
}

function rotateSubpath(sp: CubicSubpath, k: number): CubicSubpath {
  if (k === 0) return sp;
  const cubics = [...sp.cubics.slice(k), ...sp.cubics.slice(0, k)];
  return { x: cubics[0][0], y: cubics[0][1], cubics, closed: sp.closed };
}

/** Summed squared distance between corresponding nodes (segment end points). */
function nodeDistance(a: CubicSubpath, b: CubicSubpath): number {
  let sum = 0;
  for (let i = 0; i < a.cubics.length; i++) {
    const p = a.cubics[i];
    const q = b.cubics[i];
    sum += (p[6] - q[6]) ** 2 + (p[7] - q[7]) ** 2;
  }
  return sum;
}

/**
 * Align a closed subpath `b` to `a` (same cubic count): every rotation of `b`
 * in both directions, keeping the smallest summed squared node distance.
 * `b` as it is wins ties (within rounding), so re-normalising is stable.
 */
function alignClosed(a: CubicSubpath, b: CubicSubpath): CubicSubpath {
  let best = b;
  let bestD = nodeDistance(a, b);
  const better = (d: number) => d < bestD - 1e-6 * (1 + bestD);
  for (const cand of [b, reverseSubpath(b)]) {
    for (let k = 0; k < cand.cubics.length; k++) {
      if (cand === b && k === 0) continue;
      const r = rotateSubpath(cand, k);
      const d = nodeDistance(a, r);
      if (better(d)) {
        best = r;
        bestD = d;
      }
    }
  }
  return best;
}

const isPoint = (sp: CubicSubpath) => sp.cubics.every((c) => c.every((v, i) => v === sp.cubics[0][i % 2]));

function serialize(subpaths: CubicSubpath[], closed: boolean[]): string {
  const f = formatNumber;
  let out = '';
  subpaths.forEach((sp, j) => {
    out += `M${f(sp.x)} ${f(sp.y)}`;
    for (const c of sp.cubics) out += `C${f(c[2])} ${f(c[3])} ${f(c[4])} ${f(c[5])} ${f(c[6])} ${f(c[7])}`;
    if (closed[j]) out += 'Z';
  });
  return out;
}

export type MorphSetResult = { ok: true; paths: string[] } | { ok: false; error: 'unparsable' | 'empty' };

/**
 * Normalise every key of a morph track to one command sequence (module
 * comment). `paths` in time order; the result has the same length and order.
 */
export function normalizeMorphSet(paths: readonly string[]): MorphSetResult {
  const parsed = paths.map(parseShape);
  if (parsed.some((p) => p === null)) return { ok: false, error: 'unparsable' };
  const shapes = parsed as CubicSubpath[][];
  const nSub = Math.max(0, ...shapes.map((s) => s.length));
  if (nSub === 0) return { ok: false, error: 'empty' };

  // 2. subpath slots; missing ones are filled after the counts are known.
  const slots: Shape[] = shapes.map((s) => ({ subpaths: Array.from({ length: nSub }, (_, j) => s[j] ?? null) }));
  const counts = Array.from({ length: nSub }, (_, j) => Math.max(1, ...slots.map((s) => s.subpaths[j]?.cubics.length ?? 0)));
  // A subpath is closed in the output when every key that has it closes it.
  const closed = Array.from({ length: nSub }, (_, j) => slots.every((s) => s.subpaths[j] === null || s.subpaths[j]!.closed));

  for (let j = 0; j < nSub; j++) {
    for (let i = 0; i < slots.length; i++) {
      if (slots[i].subpaths[j]) continue;
      // Collapse to the centre of the nearest key that has this subpath.
      let near: CubicSubpath | null = null;
      for (let dist = 1; dist < slots.length && !near; dist++) {
        near = slots[i - dist]?.subpaths[j] ?? slots[i + dist]?.subpaths[j] ?? null;
      }
      const [x, y] = near ? centre(near) : [0, 0];
      slots[i].subpaths[j] = pointSubpath(x, y, counts[j], closed[j]);
    }
  }

  // 3. equal counts, 4. alignment to the previous key.
  const out: CubicSubpath[][] = [];
  for (let i = 0; i < slots.length; i++) {
    const row: CubicSubpath[] = [];
    for (let j = 0; j < nSub; j++) {
      let sp = splitTo(slots[i].subpaths[j]!, counts[j]);
      const prev = out[i - 1]?.[j];
      if (prev && closed[j] && !isPoint(sp) && !isPoint(prev)) sp = alignClosed(prev, sp);
      row.push(sp);
    }
    out.push(row);
  }
  return { ok: true, paths: out.map((row) => serialize(row, closed)) };
}

/** Normalise a pair (one morph segment). */
export function normalizeMorph(from: string, to: string): MorphSetResult {
  return normalizeMorphSet([from, to]);
}

// ---------------------------------------------------------------------------
// interpolation
// ---------------------------------------------------------------------------

const PATH_START = /^\s*[Mm]\s*[-+.\d]/;
const NUM = /[+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?/g;

interface PathTemplate {
  /** The text between numbers (command letters and separators). */
  parts: string[];
  nums: number[];
}

const templateCache = new Map<string, PathTemplate>();

function template(d: string): PathTemplate {
  const hit = templateCache.get(d);
  if (hit) return hit;
  const nums: number[] = [];
  const parts = d.split(NUM);
  for (const m of d.matchAll(NUM)) nums.push(Number(m[0]));
  const t = { parts, nums };
  if (templateCache.size > 256) templateCache.clear();
  templateCache.set(d, t);
  return t;
}

/** Same command letters and separators, same number count: interpolable number by number. */
export function morphCompatible(a: string, b: string): boolean {
  if (a === b) return true;
  // Path data starts with a move AND a number ("maroon" is a colour, not a path).
  if (!PATH_START.test(a) || !PATH_START.test(b)) return false;
  const ta = template(a);
  const tb = template(b);
  if (ta.nums.length !== tb.nums.length || ta.parts.length !== tb.parts.length) return false;
  for (let i = 0; i < ta.parts.length; i++) if (ta.parts[i].trim() !== tb.parts[i].trim()) return false;
  return true;
}

/** Number-by-number interpolation of two compatible path strings at progress p (unclamped). */
export function interpolatePath(a: string, b: string, p: number): string {
  if (p === 0 || a === b) return a;
  if (p === 1) return b;
  const ta = template(a);
  const tb = template(b);
  let out = ta.parts[0];
  for (let i = 0; i < ta.nums.length; i++) out += formatNumber(ta.nums[i] + (tb.nums[i] - ta.nums[i]) * p) + ta.parts[i + 1];
  return out;
}
