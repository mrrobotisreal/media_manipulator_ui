import { describe, it, expect } from 'vitest';
import {
  PathParseError,
  deleteNode,
  moveHandle,
  moveNode,
  normalizePath,
  parsePath,
  pathBounds,
  pathNodes,
  serializePath,
  transformPath,
  translatePath,
  type PathSegment,
} from '@/lib/vector/pathData';

const close = (a: number, b: number, eps = 1e-3) => expect(Math.abs(a - b)).toBeLessThan(eps);

describe('parsePath commands', () => {
  it('parses absolute commands', () => {
    expect(parsePath('M1 2L3 4H5V6C1 2 3 4 5 6S7 8 9 10Q1 2 3 4T5 6A1 2 3 1 0 7 8Z')).toEqual([
      { cmd: 'M', x: 1, y: 2 },
      { cmd: 'L', x: 3, y: 4 },
      { cmd: 'L', x: 5, y: 4 },
      { cmd: 'L', x: 5, y: 6 },
      { cmd: 'C', x1: 1, y1: 2, x2: 3, y2: 4, x: 5, y: 6 },
      { cmd: 'C', x1: 7, y1: 8, x2: 7, y2: 8, x: 9, y: 10 },
      { cmd: 'Q', x1: 1, y1: 2, x: 3, y: 4 },
      { cmd: 'Q', x1: 5, y1: 6, x: 5, y: 6 },
      { cmd: 'A', rx: 1, ry: 2, rotation: 3, largeArc: true, sweep: false, x: 7, y: 8 },
      { cmd: 'Z' },
    ]);
  });

  it('parses relative commands', () => {
    const segs = parsePath('m10 10l5 5h5v5c1 1 2 2 3 3s1 1 2 2q1 1 2 2t1 1a2 2 0 0 1 3 3z');
    expect(segs[0]).toEqual({ cmd: 'M', x: 10, y: 10 });
    expect(segs[1]).toEqual({ cmd: 'L', x: 15, y: 15 });
    expect(segs[2]).toEqual({ cmd: 'L', x: 20, y: 15 });
    expect(segs[3]).toEqual({ cmd: 'L', x: 20, y: 20 });
    expect(segs[4]).toEqual({ cmd: 'C', x1: 21, y1: 21, x2: 22, y2: 22, x: 23, y: 23 });
    // S reflects (22,22) through (23,23) -> (24,24)
    expect(segs[5]).toEqual({ cmd: 'C', x1: 24, y1: 24, x2: 24, y2: 24, x: 25, y: 25 });
    expect(segs[6]).toEqual({ cmd: 'Q', x1: 26, y1: 26, x: 27, y: 27 });
    // T reflects (26,26) through (27,27) -> (28,28)
    expect(segs[7]).toEqual({ cmd: 'Q', x1: 28, y1: 28, x: 28, y: 28 });
    expect(segs[8]).toEqual({
      cmd: 'A', rx: 2, ry: 2, rotation: 0, largeArc: false, sweep: true, x: 31, y: 31,
    });
    expect(segs[9]).toEqual({ cmd: 'Z' });
  });

  it('turns implicit repeats after M into L', () => {
    expect(parsePath('M0 0 1 1 2 2')).toEqual([
      { cmd: 'M', x: 0, y: 0 },
      { cmd: 'L', x: 1, y: 1 },
      { cmd: 'L', x: 2, y: 2 },
    ]);
    expect(parsePath('m1 1 1 1 1 1')).toEqual([
      { cmd: 'M', x: 1, y: 1 },
      { cmd: 'L', x: 2, y: 2 },
      { cmd: 'L', x: 3, y: 3 },
    ]);
  });

  it('repeats other commands implicitly', () => {
    expect(normalizePath('M0 0h1 2 3v1 1')).toBe('M0 0L1 0L3 0L6 0L6 1L6 2');
    expect(normalizePath('M0 0c1 1 2 2 3 3 1 1 2 2 3 3')).toBe(
      'M0 0C1 1 2 2 3 3C4 4 5 5 6 6',
    );
  });

  it('handles compact number forms', () => {
    expect(normalizePath('M1-2.5.5.5')).toBe('M1 -2.5L0.5 0.5');
    expect(normalizePath('M1e2,2E1')).toBe('M100 20');
    expect(normalizePath('M0 0l1e-1 -2e+0')).toBe('M0 0L0.1 -2');
  });

  it('handles arc flags without separators', () => {
    const segs = parsePath('M0 0a1 1 0 011 1');
    expect(segs[1]).toEqual({
      cmd: 'A', rx: 1, ry: 1, rotation: 0, largeArc: false, sweep: true, x: 1, y: 1,
    });
    const segs2 = parsePath('M0 0a1 1 0 1,0 1 1 1 1 0 0 1 2 2');
    expect(segs2).toHaveLength(3);
    expect(segs2[1]).toMatchObject({ largeArc: true, sweep: false, x: 1, y: 1 });
    expect(segs2[2]).toMatchObject({ largeArc: false, sweep: true, x: 3, y: 3 });
  });

  it('reflects S/T as the current point after a non-curve', () => {
    const s = parsePath('M0 0L10 10S20 20 30 30');
    expect(s[2]).toEqual({ cmd: 'C', x1: 10, y1: 10, x2: 20, y2: 20, x: 30, y: 30 });
    const t = parsePath('M0 0C1 1 2 2 3 3T6 6');
    expect(t[2]).toEqual({ cmd: 'Q', x1: 3, y1: 3, x: 6, y: 6 });
    const t2 = parsePath('M0 0Q1 1 2 2T4 4T6 6');
    expect(t2[2]).toEqual({ cmd: 'Q', x1: 3, y1: 3, x: 4, y: 4 });
    expect(t2[3]).toEqual({ cmd: 'Q', x1: 5, y1: 5, x: 6, y: 6 });
  });

  it('starts relative commands from the subpath start after Z', () => {
    const segs = parsePath('M10 10L20 10L20 20Zl5 5');
    expect(segs[4]).toEqual({ cmd: 'L', x: 15, y: 15 });
    const reflect = parsePath('M0 0C1 1 2 2 3 3ZS5 5 6 6');
    expect(reflect[3]).toEqual({ cmd: 'C', x1: 0, y1: 0, x2: 5, y2: 5, x: 6, y: 6 });
  });

  it('rounds to 3 decimals', () => {
    expect(normalizePath('M0.12345 0.9999')).toBe('M0.123 1');
  });

  it('returns [] for empty input', () => {
    expect(parsePath('')).toEqual([]);
    expect(parsePath('  \n\t ')).toEqual([]);
  });

  it('throws on malformed input', () => {
    for (const bad of [
      'L1 2',
      '10 20',
      'M1',
      'M1 2 3',
      'M1 2X',
      'M1,,2',
      'M1 2,',
      'M0 0a1 1 0 2 0 1 1',
      'M0 0C1 2 3 4 5',
      'M.',
      'M0 0e',
    ]) {
      expect(() => parsePath(bad), bad).toThrow(PathParseError);
    }
  });
});

describe('serializePath', () => {
  it('emits the canonical format', () => {
    const segs: PathSegment[] = [
      { cmd: 'M', x: 10, y: 20 },
      { cmd: 'L', x: 30, y: 40 },
      { cmd: 'C', x1: 1, y1: 2, x2: 3, y2: 4, x: 5, y: 6 },
      { cmd: 'Q', x1: 1, y1: 2, x: 3, y: 4 },
      { cmd: 'A', rx: 5, ry: 5, rotation: 0, largeArc: false, sweep: true, x: 10, y: 10 },
      { cmd: 'Z' },
    ];
    expect(serializePath(segs)).toBe('M10 20L30 40C1 2 3 4 5 6Q1 2 3 4A5 5 0 0 1 10 10Z');
    expect(serializePath([])).toBe('');
  });

  it('round-trips through parsePath', () => {
    const d = 'M1.5 2.25C1 2 3 4 5 6Q1 2 3 4A5 3 30 1 0 10 10ZM0 0L1 1';
    const segs = parsePath(d);
    expect(parsePath(serializePath(segs))).toEqual(segs);
  });
});

describe('normalizePath idempotence', () => {
  const inputs = [
    'M0 0',
    'm1,2 3,4 5,6',
    'M10 10 H 20 V 30 h-5 v-5 z',
    'M0 0 C 10 0, 10 10, 0 10 S -10 20 0 20',
    'M0 0Q5 5 10 0T20 0t10 0',
    'M0 0a5 5 0 1 1 10 0a5 5 0 1 1-10 0z',
    'M1-2.5.5 1e2',
    'M0 0L10 0 10 10zm5 5l1 1',
    '  M 0.0004 0.0006  L 1.23456 7.89012  ',
    'M0 0A10 20 45 0 1 30 40',
    'M-0 -0L-0.0001 0',
  ];
  for (const d of inputs) {
    it(`is idempotent for ${JSON.stringify(d)}`, () => {
      const once = normalizePath(d);
      expect(normalizePath(once)).toBe(once);
    });
  }
  it('never emits -0', () => {
    expect(normalizePath('M-0 -0')).toBe('M0 0');
  });
});

describe('pathBounds', () => {
  it('returns null for empty', () => {
    expect(pathBounds([])).toBeNull();
  });

  it('computes a line', () => {
    expect(pathBounds(parsePath('M10 20L-5 40'))).toEqual({ x: -5, y: 20, width: 15, height: 20 });
  });

  it('finds the interior cubic extremum', () => {
    // y(t) = 3(1-t)^2 t*10 + 3(1-t)t^2*10 peaks at t=.5 -> 7.5
    const b = pathBounds(parsePath('M0 0C0 10 10 10 10 0'))!;
    expect(b.x).toBe(0);
    expect(b.width).toBe(10);
    expect(b.y).toBe(0);
    close(b.height, 7.5);
  });

  it('finds the cubic extremum in x', () => {
    // x(t) = 3(1-t)^2 t*10 + 3(1-t)t^2*(-10)... use a loop to the right
    const b = pathBounds(parsePath('M0 0C20 0 20 10 0 10'))!;
    close(b.width, 15);
    close(b.height, 10);
  });

  it('computes a quadratic', () => {
    const b = pathBounds(parsePath('M0 0Q10 20 20 0'))!;
    expect(b).toEqual({ x: 0, y: 0, width: 20, height: 10 });
  });

  it('computes a full circle from two arcs', () => {
    const b = pathBounds(parsePath('M0 50A50 50 0 1 1 100 50A50 50 0 1 1 0 50'))!;
    close(b.x, 0);
    close(b.y, 0);
    close(b.width, 100);
    close(b.height, 100);
  });

  it('computes a small-sweep arc, not the full circle', () => {
    // Quarter arc from (50,0) to (100,50), centre (50,50): bounds 50..100 x 0..50
    const b = pathBounds(parsePath('M50 0A50 50 0 0 1 100 50'))!;
    close(b.x, 50);
    close(b.y, 0);
    close(b.width, 50);
    close(b.height, 50);
  });

  it('handles a rotated ellipse arc', () => {
    // Full ellipse rx=20 ry=10 rotated 90deg -> box 20 wide, 40 tall, centred on (0,0)
    const b = pathBounds(parsePath('M0 20A20 10 90 1 1 0 -20A20 10 90 1 1 0 20'))!;
    close(b.width, 20);
    close(b.height, 40);
    close(b.x, -10);
    close(b.y, -20);
    // 45deg: half-extent = sqrt(rx^2 cos^2 + ry^2 sin^2) = sqrt((400+100)/2)
    const h = Math.sqrt(250);
    const c = Math.SQRT1_2;
    const sx = 20 * c;
    const sy = 20 * c;
    const b2 = pathBounds([
      { cmd: 'M', x: sx, y: sy },
      { cmd: 'A', rx: 20, ry: 10, rotation: 45, largeArc: true, sweep: true, x: -sx, y: -sy },
      { cmd: 'A', rx: 20, ry: 10, rotation: 45, largeArc: true, sweep: true, x: sx, y: sy },
    ])!;
    close(b2.width, 2 * h);
    close(b2.height, 2 * h);
  });

  it('treats a degenerate arc as a line', () => {
    expect(pathBounds(parsePath('M0 0A0 5 0 0 1 10 10'))).toEqual({
      x: 0, y: 0, width: 10, height: 10,
    });
  });

  it('scales up too-small radii', () => {
    // radii 1 for a 10-wide chord -> semicircle radius 5
    const b = pathBounds(parsePath('M0 0A1 1 0 0 1 10 0'))!;
    close(b.width, 10);
    close(b.height, 5);
  });

  it('uses the subpath start after Z', () => {
    const b = pathBounds(parsePath('M0 0L10 0L10 10ZL-5 -5'))!;
    expect(b).toEqual({ x: -5, y: -5, width: 15, height: 15 });
  });
});

describe('transformPath', () => {
  it('translates', () => {
    expect(serializePath(translatePath(parsePath('M0 0L1 1C1 2 3 4 5 6Z'), 10, -1))).toBe(
      'M10 -1L11 0C11 1 13 3 15 5Z',
    );
  });

  it('scales and keeps arcs round', () => {
    const t = transformPath(parsePath('M0 0A5 5 0 0 1 10 0'), [2, 0, 0, 2, 0, 0]);
    expect(t[1]).toEqual({
      cmd: 'A', rx: 10, ry: 10, rotation: 0, largeArc: false, sweep: true, x: 20, y: 0,
    });
  });

  it('non-uniform scale changes radii', () => {
    const t = transformPath(parsePath('M0 0A5 5 0 0 1 10 0'), [2, 0, 0, 3, 0, 0]);
    expect(t[1]).toMatchObject({ rx: 10, ry: 15, rotation: 0, sweep: true });
  });

  it('mirror flips sweep', () => {
    const t = transformPath(parsePath('M0 0A5 5 0 0 1 10 0'), [-1, 0, 0, 1, 0, 0]);
    expect(t[1]).toMatchObject({ sweep: false, x: -10, y: 0 });
    const t2 = transformPath(parsePath('M0 0A5 5 0 0 0 10 0'), [1, 0, 0, -1, 0, 0]);
    expect(t2[1]).toMatchObject({ sweep: true });
  });

  it('rotates an arc ellipse', () => {
    const t = transformPath(parsePath('M0 0A20 10 0 0 1 10 0'), [0, 1, -1, 0, 0, 0]); // 90deg
    expect(t[1]).toMatchObject({ rx: 20, ry: 10, rotation: 90, sweep: true, x: 0, y: 10 });
    const c = Math.cos(Math.PI / 6);
    const s = Math.sin(Math.PI / 6);
    const t2 = transformPath(parsePath('M0 0A20 10 0 0 1 10 0'), [c, s, -s, c, 0, 0]);
    expect(t2[1]).toMatchObject({ rx: 20, ry: 10, rotation: 30 });
  });

  it('keeps transformed arc bounds consistent with transformed geometry', () => {
    const d = 'M0 10A20 10 0 1 1 0 -10A20 10 0 1 1 0 10';
    const m = [1, 0.5, 0, 1, 3, 4] as const; // shear
    const b = pathBounds(transformPath(parsePath(d), m))!;
    // ellipse x=20cos, y=10sin; x' = x, y' = .5x + y -> half-height sqrt(100+100)
    close(b.width, 40);
    close(b.height, 2 * Math.sqrt(200));
  });
});

describe('node editing', () => {
  const open = 'M0 0C1 1 2 2 10 0C12 2 14 2 20 0L30 0';

  it('lists nodes with handles', () => {
    const nodes = pathNodes(parsePath(open));
    expect(nodes).toHaveLength(4);
    expect(nodes[0]).toEqual({ segIndex: 0, x: 0, y: 0, out: { x: 1, y: 1 } });
    expect(nodes[1]).toEqual({
      segIndex: 1, x: 10, y: 0, in: { x: 2, y: 2 }, out: { x: 12, y: 2 },
    });
    expect(nodes[3]).toEqual({ segIndex: 3, x: 30, y: 0 });
  });

  it('marks closing nodes and skips Z', () => {
    const nodes = pathNodes(parsePath('M0 0L10 0L10 10Z'));
    expect(nodes).toHaveLength(3);
    expect(nodes[2].closesSubpath).toBe(true);
    expect(nodes[0].closesSubpath).toBeUndefined();
  });

  it('reports Q control as in', () => {
    expect(pathNodes(parsePath('M0 0Q5 5 10 0'))[1].in).toEqual({ x: 5, y: 5 });
  });

  it('does not set out when next segment is M or L', () => {
    const nodes = pathNodes(parsePath('M0 0C1 1 2 2 3 3M5 5L6 6'));
    expect(nodes[1].out).toBeUndefined();
  });

  it('moves a node with its handles, immutably', () => {
    const segs = parsePath(open);
    const snapshot = JSON.stringify(segs);
    const moved = moveNode(segs, 1, 5, 3);
    expect(JSON.stringify(segs)).toBe(snapshot);
    expect(serializePath(moved)).toBe('M0 0C1 1 7 5 15 3C17 5 14 2 20 0L30 0');
  });

  it('moves the first node with its out handle', () => {
    expect(serializePath(moveNode(parsePath(open), 0, 1, 1))).toBe(
      'M1 1C2 2 2 2 10 0C12 2 14 2 20 0L30 0',
    );
  });

  it('moves the coincident closing point with the M of a closed subpath', () => {
    const segs = parsePath('M0 0L10 0L10 10L0 0Z');
    expect(serializePath(moveNode(segs, 0, 2, 3))).toBe('M2 3L10 0L10 10L2 3Z');
    // a non-coincident closed path only moves the M
    const segs2 = parsePath('M0 0L10 0L10 10Z');
    expect(serializePath(moveNode(segs2, 0, 2, 3))).toBe('M2 3L10 0L10 10Z');
  });

  it('moves a coincident closing cubic including its in handle', () => {
    const segs = parsePath('M0 0L10 0C10 5 5 5 0 0Z');
    expect(serializePath(moveNode(segs, 0, 1, 1))).toBe('M1 1L10 0C10 5 6 6 1 1Z');
  });

  it('moves handles without mirroring', () => {
    const out = moveHandle(parsePath(open), 1, 'in', { x: 8, y: 4 });
    expect(serializePath(out)).toBe('M0 0C1 1 8 4 10 0C12 2 14 2 20 0L30 0');
    const out2 = moveHandle(parsePath(open), 1, 'out', { x: 13, y: 3 });
    expect(serializePath(out2)).toBe('M0 0C1 1 2 2 10 0C13 3 14 2 20 0L30 0');
  });

  it('mirrors exactly with mirror=true', () => {
    // node (10,0); new in handle (8,4) -> out is reflection (12,-4)
    const out = moveHandle(parsePath(open), 1, 'in', { x: 8, y: 4 }, true);
    expect(serializePath(out)).toBe('M0 0C1 1 8 4 10 0C12 -4 14 2 20 0L30 0');
    const out2 = moveHandle(parsePath(open), 1, 'out', { x: 13, y: 3 }, true);
    expect(serializePath(out2)).toBe('M0 0C1 1 7 -3 10 0C13 3 14 2 20 0L30 0');
  });

  it('keeps the opposite handle length with mirror="angle"', () => {
    // out handle length is sqrt(8) from (10,0); new in (7,-4) -> direction (3,4)/5
    const segs = parsePath('M0 0C1 1 2 2 10 0C12 2 14 2 20 0');
    const out = moveHandle(segs, 1, 'in', { x: 7, y: -4 }, 'angle');
    const c = out[2] as Extract<PathSegment, { cmd: 'C' }>;
    const len = Math.hypot(c.x1 - 10, c.y1 - 0);
    close(len, Math.sqrt(8));
    // opposite direction of (7-10, -4-0) = (-3,-4) -> (+3,+4)/5
    close((c.x1 - 10) / len, 0.6);
    close((c.y1 - 0) / len, 0.8);
  });

  it('is a no-op when the handle does not exist', () => {
    const segs = parsePath(open);
    expect(moveHandle(segs, 3, 'out', { x: 1, y: 1 })).toEqual(segs);
    expect(moveHandle(segs, 0, 'in', { x: 1, y: 1 })).toEqual(segs);
    expect(moveHandle(segs, 3, 'in', { x: 1, y: 1 })).toEqual(segs);
  });

  it('moves a Q handle', () => {
    const out = moveHandle(parsePath('M0 0Q5 5 10 0'), 1, 'in', { x: 6, y: 7 });
    expect(serializePath(out)).toBe('M0 0Q6 7 10 0');
  });

  it('deletes a middle node', () => {
    expect(serializePath(deleteNode(parsePath('M0 0L10 0L10 10L0 10'), 2))).toBe(
      'M0 0L10 0L0 10',
    );
  });

  it('deleting an M promotes the next endpoint', () => {
    expect(serializePath(deleteNode(parsePath('M0 0L10 0L10 10'), 0))).toBe('M10 0L10 10');
    expect(serializePath(deleteNode(parsePath('M0 0C1 1 2 2 5 5L9 9'), 0))).toBe('M5 5L9 9');
  });

  it('returns [] when nothing drawable remains', () => {
    expect(deleteNode(parsePath('M0 0L10 0'), 1)).toEqual([]);
    expect(deleteNode(parsePath('M0 0L10 0'), 0)).toEqual([]);
    expect(deleteNode(parsePath('M0 0'), 0)).toEqual([]);
  });

  it('keeps closed subpaths valid and drops emptied ones', () => {
    expect(serializePath(deleteNode(parsePath('M0 0L10 0L10 10Z'), 2))).toBe('M0 0L10 0Z');
    expect(serializePath(deleteNode(parsePath('M0 0L10 0ZM5 5L6 6'), 1))).toBe('M5 5L6 6');
  });

  it('ignores out-of-range or Z indices', () => {
    const segs = parsePath('M0 0L10 0Z');
    expect(deleteNode(segs, 2)).toEqual(segs);
    expect(deleteNode(segs, 9)).toEqual(segs);
    expect(moveNode(segs, 2, 1, 1)).toEqual(segs);
  });
});
