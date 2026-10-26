/**
 * MM45 acceptance 2: morph normaliser property tests (≥ 200 seeded random
 * path pairs) plus the winding-alignment case with a reversed square.
 *
 * Properties, for every pair:
 *   - both normalised strings have the SAME command sequence (equal command
 *     counts, letter by letter) and the same number of numbers;
 *   - no `NaN` / `Infinity` anywhere, and every interpolated frame parses;
 *   - t = 0 and t = 1 reproduce the inputs: the normalised path draws the
 *     same geometry as its input (equal length within 0.5 %, and equal
 *     points at matching arc-length fractions within 0.5 px per subpath);
 *   - re-normalising the output is a fixed point.
 */
import { describe, expect, it } from 'vitest';

import { interpolatePath, morphCompatible, normalizeMorph, normalizeMorphSet } from './morph';
import { parsePath, serializePath, type PathSegment } from './pathData';
import { measurePath, pathLength, toCubicSubpaths } from './pathLength';

/** mulberry32: small seeded PRNG (deterministic test input). */
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function randomPath(r: () => number): string {
  const n = (k: number) => Math.round(r() * k * 1000) / 1000;
  const subpaths = 1 + Math.floor(r() * 3);
  const segs: PathSegment[] = [];
  for (let s = 0; s < subpaths; s++) {
    segs.push({ cmd: 'M', x: n(400), y: n(400) });
    const count = 1 + Math.floor(r() * 7);
    for (let i = 0; i < count; i++) {
      const kind = r();
      if (kind < 0.3) segs.push({ cmd: 'L', x: n(400), y: n(400) });
      else if (kind < 0.6) segs.push({ cmd: 'C', x1: n(400), y1: n(400), x2: n(400), y2: n(400), x: n(400), y: n(400) });
      else if (kind < 0.8) segs.push({ cmd: 'Q', x1: n(400), y1: n(400), x: n(400), y: n(400) });
      else segs.push({ cmd: 'A', rx: 5 + n(150), ry: 5 + n(150), rotation: n(360), largeArc: r() < 0.5, sweep: r() < 0.5, x: n(400), y: n(400) });
    }
    if (r() < 0.5) segs.push({ cmd: 'Z' });
  }
  return serializePath(segs);
}

const commands = (d: string) => (d.match(/[MLCQAZ]/gi) ?? []).join('');
const numbers = (d: string) => (d.match(/[+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?/gi) ?? []).map(Number);

/**
 * Same geometry: equal total length (0.5 %), and subpath by subpath the same
 * drawing. Open subpaths keep their direction and start, so their points
 * match at every 5 % of length (0.5 px). Closed subpaths may be re-wound or
 * start elsewhere (alignment), so they are compared as curves: two-way
 * Hausdorff distance between the flattened outlines < 0.5 px. The input's
 * drawing subpaths come first in the output, in order; any extra output
 * subpath (collapsed to a point) has zero length.
 */
function sameGeometry(input: string, output: string) {
  const li = pathLength(input);
  const lo = pathLength(output);
  if (li === 0) return expect(lo).toBeLessThan(1e-6);
  expect(Math.abs(li - lo) / li).toBeLessThan(0.005);
  const si = toCubicSubpaths(parsePath(input));
  const so = toCubicSubpaths(parsePath(output));
  si.forEach((sp, j) => {
    const mi = measurePath(serializeSub(sp))!;
    const mo = measurePath(serializeSub(so[j]))!;
    if (!sp.closed) {
      for (let f = 0; f <= 1.0001; f += 0.05) {
        const p = mi.at(Math.min(f, 1) * mi.length);
        const q = mo.at(Math.min(f, 1) * mo.length);
        if (Math.hypot(p.x - q.x, p.y - q.y) >= 0.5) throw new Error(`open subpath ${j} f=${f}: ${serializeSub(sp)} vs ${serializeSub(so[j])} (${input} → ${output})`);
      }
      return;
    }
    const a = mi.polylines()[0];
    const b = mo.polylines()[0];
    expect(oneWay(a, b)).toBeLessThan(0.5);
    expect(oneWay(b, a)).toBeLessThan(0.5);
  });
  for (const extra of so.slice(si.length)) expect(pathLength(serializeSub(extra))).toBeLessThan(1e-6);
}

type P = { x: number; y: number };
function segDist(p: P, a: P, b: P): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const l2 = dx * dx + dy * dy;
  const u = l2 === 0 ? 0 : Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / l2));
  return Math.hypot(p.x - (a.x + u * dx), p.y - (a.y + u * dy));
}
/** Largest distance from a vertex of `a` to the polyline `b`. */
function oneWay(a: P[], b: P[]): number {
  let worst = 0;
  for (const p of a) {
    let best = Infinity;
    for (let i = 0; i + 1 < b.length; i++) best = Math.min(best, segDist(p, b[i], b[i + 1]));
    worst = Math.max(worst, best);
  }
  return worst;
}

const serializeSub = (sp: ReturnType<typeof toCubicSubpaths>[number]) =>
  `M${sp.x} ${sp.y}` + sp.cubics.map((c) => `C${c.slice(2).join(' ')}`).join('') + (sp.closed ? 'Z' : '');

const PAIRS = 240;

describe('morph normaliser properties (seeded, ' + PAIRS + ' random pairs)', () => {
  const r = rng(0x4d4d45);
  const cases = Array.from({ length: PAIRS }, () => [randomPath(r), randomPath(r)] as const);

  it('equal command sequences and number counts, no NaN / Infinity', () => {
    for (const [a, b] of cases) {
      const res = normalizeMorph(a, b);
      if (!res.ok) throw new Error(`${a} | ${b}: ${res.error}`);
      const [na, nb] = res.paths;
      expect(commands(na)).toBe(commands(nb));
      expect(numbers(na).length).toBe(numbers(nb).length);
      for (const v of [...numbers(na), ...numbers(nb)]) expect(Number.isFinite(v)).toBe(true);
      expect(`${na}${nb}`).not.toMatch(/NaN|Infinity/);
      expect(morphCompatible(na, nb)).toBe(true);
    }
  });

  it('endpoints: the normalised t=0 / t=1 paths draw the inputs (and interpolation hits them exactly)', () => {
    for (const [a, b] of cases) {
      const res = normalizeMorph(a, b);
      if (!res.ok) throw new Error(res.error);
      const [na, nb] = res.paths;
      expect(interpolatePath(na, nb, 0)).toBe(na);
      expect(interpolatePath(na, nb, 1)).toBe(nb);
      // Subpaths are matched by order; extras collapsed to a point add no length.
      sameGeometry(a, na);
      sameGeometry(b, nb);
    }
  });

  it('every in-between frame parses and is finite', () => {
    for (const [a, b] of cases.slice(0, 60)) {
      const res = normalizeMorph(a, b);
      if (!res.ok) throw new Error(res.error);
      for (const p of [0.25, 0.5, 0.75, 1.2, -0.2]) {
        const mid = interpolatePath(res.paths[0], res.paths[1], p);
        expect(() => parsePath(mid)).not.toThrow();
        expect(mid).not.toMatch(/NaN|Infinity/);
      }
    }
  });

  it('is a fixed point: normalising the output again returns it unchanged', () => {
    for (const [a, b] of cases.slice(0, 80)) {
      const res = normalizeMorph(a, b);
      if (!res.ok) throw new Error(res.error);
      const again = normalizeMorphSet(res.paths);
      expect(again).toEqual(res);
    }
  });
});

describe('morph alignment', () => {
  it('a reversed square is re-wound to the original direction and start point', () => {
    const square = 'M0 0L100 0L100 100L0 100Z';
    // Same square, opposite winding, starting at a different corner.
    const reversed = 'M100 100L100 0L0 0L0 100Z';
    const res = normalizeMorph(square, reversed);
    if (!res.ok) throw new Error(res.error);
    // After alignment the target's nodes coincide with the source's: no twist.
    const ma = measurePath(res.paths[0])!;
    const mb = measurePath(res.paths[1])!;
    for (let f = 0; f <= 1; f += 0.05) {
      const p = ma.at(f * ma.length);
      const q = mb.at(f * mb.length);
      expect(Math.hypot(p.x - q.x, p.y - q.y)).toBeLessThan(1e-6);
    }
    // And the halfway frame is the square itself (nothing collapses).
    const mid = interpolatePath(res.paths[0], res.paths[1], 0.5);
    expect(pathLength(mid)).toBeCloseTo(400, 3);
  });

  it('without alignment the same pair would twist (control: reversed order collapses at t=0.5)', () => {
    // Pure count matching with no winding fix pairs (0,0)↔(100,100) etc.
    const a = 'M0 0C0 0 100 0 100 0C100 0 100 100 100 100C100 100 0 100 0 100C0 100 0 0 0 0Z';
    const b = 'M100 100C100 100 100 0 100 0C100 0 0 0 0 0C0 0 0 100 0 100C0 100 100 100 100 100Z';
    expect(pathLength(interpolatePath(a, b, 0.5))).toBeLessThan(300);
  });

  it('unequal counts: a triangle and a hexagon get the same command sequence', () => {
    const tri = 'M50 0L100 100L0 100Z';
    const hex = 'M50 0L93.3 25L93.3 75L50 100L6.7 75L6.7 25Z';
    const res = normalizeMorph(tri, hex);
    if (!res.ok) throw new Error(res.error);
    expect(commands(res.paths[0])).toBe('MCCCCCCZ');
    expect(commands(res.paths[1])).toBe('MCCCCCCZ');
  });

  it('unequal subpath counts: the extra subpath collapses to a point in the other key', () => {
    const one = 'M0 0L10 0L10 10Z';
    const two = 'M0 0L10 0L10 10ZM50 50L60 50L60 60Z';
    const res = normalizeMorph(one, two);
    if (!res.ok) throw new Error(res.error);
    expect(commands(res.paths[0])).toBe(commands(res.paths[1]));
    expect(commands(res.paths[0])).toBe('MCCCZMCCCZ');
    expect(pathLength(res.paths[0])).toBeCloseTo(pathLength(one), 3);
  });

  it('a set of three keys shares one command sequence', () => {
    const res = normalizeMorphSet(['M0 0L10 10', 'M0 0Q5 5 10 0L20 0L30 10', 'M0 0A5 5 0 0 1 10 0']);
    if (!res.ok) throw new Error(res.error);
    expect(new Set(res.paths.map(commands)).size).toBe(1);
  });

  it('refuses unparsable or empty input', () => {
    expect(normalizeMorph('M0 0L1 1', 'nope')).toEqual({ ok: false, error: 'unparsable' });
    expect(normalizeMorph('M0 0', 'M5 5')).toEqual({ ok: false, error: 'empty' });
  });

  it('morphCompatible refuses different command sequences', () => {
    expect(morphCompatible('M0 0L1 1', 'M0 0C1 1 2 2 3 3')).toBe(false);
    expect(morphCompatible('M0 0L1 1', 'M5 5L6 6')).toBe(true);
  });
});
