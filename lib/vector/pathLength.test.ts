/**
 * MM45 acceptance 3: `pathLength` matches `getTotalLength` reference values
 * within 0.5 %. The references are HARD-CODED and come from an independent
 * computation (closed form where one exists, else 2,000,000-step dense
 * sampling of the curve's own equation; script recorded in the MM45 log),
 * not from this module. Browsers' `getTotalLength()` agree with these to far
 * better than 0.5 %.
 */
import { describe, expect, it } from 'vitest';

import { measurePath, pathLength, toCubicSubpaths } from './pathLength';
import { parsePath } from './pathData';

const REFERENCE: Array<[name: string, d: string, length: number]> = [
  ['line', 'M0 0L300 400', 500],
  ['closed square (Z adds the last side)', 'M0 0L100 0L100 100L0 100Z', 400],
  ['circle from two arcs, r 50', 'M100 50A50 50 0 1 1 0 50A50 50 0 1 1 100 50', 314.1592653589793],
  ['half ellipse 80 × 40', 'M-80 0A80 40 0 0 1 80 0', 193.76896441093268],
  ['cubic S-curve', 'M10 90C40 10 65 10 95 90', 153.37610004386633],
  ['self-intersecting cubic loop', 'M0 0C200 200 -100 200 100 0', 369.6110914778908],
  ['quadratic', 'M10 80Q95 10 180 80', 187.62094009397748],
  ['animated.json trail', 'M40 150C120 40 280 40 360 150', 373.88636456373854],
  ['two subpaths (the move has no length)', 'M0 0L100 0M0 50C30 0 70 0 100 50', 230.6195946397744],
  ['relative + H/V shorthand', 'm0 0h100v100h-100z', 400],
];

describe('pathLength vs getTotalLength references (within 0.5 %)', () => {
  it.each(REFERENCE)('%s', (_name, d, ref) => {
    const got = pathLength(d);
    expect(Math.abs(got - ref) / ref).toBeLessThan(0.005);
  });

  it('is in fact far tighter than 0.5 % (1e-4) on every fixture', () => {
    for (const [, d, ref] of REFERENCE) expect(Math.abs(pathLength(d) - ref) / ref).toBeLessThan(1e-4);
  });
});

describe('measurePath', () => {
  it('returns 0 / null for unparsable or empty data', () => {
    expect(pathLength('')).toBe(0);
    expect(pathLength('M0 0')).toBe(0);
    expect(pathLength('not a path')).toBe(0);
    expect(measurePath('X1 2')).toBeNull();
  });

  it('samples by arc length: the midpoint of a line is its centre, with its direction', () => {
    const m = measurePath('M0 0L300 400')!;
    const p = m.at(250);
    expect(p.x).toBeCloseTo(150, 6);
    expect(p.y).toBeCloseTo(200, 6);
    expect(p.angle).toBeCloseTo((Math.atan2(400, 300) * 180) / Math.PI, 6);
  });

  it('a single closed subpath wraps; an open path clamps', () => {
    const sq = measurePath('M0 0L100 0L100 100L0 100Z')!;
    expect(sq.closed).toBe(true);
    expect(sq.at(450).x).toBeCloseTo(50, 6);
    // -50 wraps to 350: halfway up the closing side, at (0, 50).
    expect(sq.at(-50).x).toBeCloseTo(0, 6);
    expect(sq.at(-50).y).toBeCloseTo(50, 6);
    const open = measurePath('M0 0L100 0')!;
    expect(open.closed).toBe(false);
    expect(open.at(500).x).toBe(100);
    expect(open.at(-5).x).toBe(0);
  });

  it('turning around a square corner changes the angle by 90°', () => {
    const sq = measurePath('M0 0L100 0L100 100L0 100Z')!;
    expect(sq.at(50).angle).toBeCloseTo(0, 6);
    expect(sq.at(150).angle).toBeCloseTo(90, 6);
  });

  it('converts every command to cubics, Z adding the closing segment', () => {
    const sps = toCubicSubpaths(parsePath('M0 0L10 0Q20 0 20 10A10 10 0 0 1 10 20Z'));
    expect(sps).toHaveLength(1);
    expect(sps[0].closed).toBe(true);
    expect(sps[0].cubics.length).toBe(5); // L, Q, a 90° arc as two 45° pieces, the Z side
    for (const c of sps[0].cubics) for (const v of c) expect(Number.isFinite(v)).toBe(true);
  });
});
