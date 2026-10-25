/**
 * MM44 acceptance 2 + 3: the keyframe sampler and the cubic-bezier solver
 * against the value table `lib/vector/fixtures/sample.fixtures.json`
 * (UI-only; regenerate with an independent reference, never from this code).
 */
import { describe, expect, it } from 'vitest';

import { BEZIER_EPSILON, CSS_EASE, bezierToCss, normalizeBezier, solveCubicBezier } from './bezier';
import { formatColor, lerpColor, parseColor } from './color';
import table from './fixtures/sample.fixtures.json';
import { normalizeKeyframes } from './keyframes';
import { sampleDoc, sampleTrack } from './sampleTrack';
import { parseVectorDoc, type Keyframe, type VectorDoc } from './vectorTypes';

type Case = { name: string; keyframes: Keyframe[]; samples: Array<{ t: number; expected: number | string }> };

describe('sample.fixtures.json: sampleTrack', () => {
  it.each((table.cases as Case[]).map((c) => [c.name, c] as const))('%s', (_name, c) => {
    const keyframes = normalizeKeyframes(c.keyframes);
    expect(keyframes).not.toBeNull();
    for (const s of c.samples) {
      const v = sampleTrack({ keyframes: keyframes! }, s.t);
      // Values span up to 200 units; the solver's 1e-6 x tolerance allows ~1e-6 of progress.
      if (typeof s.expected === 'number') expect(Math.abs((v as number) - s.expected), `t=${s.t}`).toBeLessThan(1e-3);
      else expect(v, `t=${s.t}`).toBe(s.expected);
    }
  });

  it.each(table.rejected.map((c) => [c.name, c.keyframes as Keyframe[]] as const))('coincident times are rejected on write (%s)', (_name, keys) => {
    expect(normalizeKeyframes(keys)).toBeNull();
  });

  it('covers every acceptance-2 row', () => {
    const names = table.cases.map((c) => c.name).join('\n');
    for (const needle of ['preset linear', 'preset easeIn', 'preset easeOut', 'preset easeBoth', 'hold', 'cubic-bezier css ease', 'colour lerp', 'before first', 'single keyframe']) {
      expect(names).toContain(needle);
    }
    expect(table.cases.filter((c) => c.name.startsWith('cubic-bezier')).length).toBeGreaterThanOrEqual(3);
  });

  it('an empty track samples to undefined', () => {
    expect(sampleTrack({ keyframes: [] }, 0)).toBeUndefined();
  });
});

describe('sample.fixtures.json: cubic-bezier solver', () => {
  it.each(table.bezier.map((b) => [b.name, b] as const))('%s matches the reference within 1e-4', (_name, b) => {
    for (const s of b.samples) expect(Math.abs(solveCubicBezier(b.curve, s.x) - s.y), `x=${s.x}`).toBeLessThan(1e-4);
  });

  it('is monotone in x for valid curves', () => {
    const curves = [CSS_EASE, [0.42, 0, 0.58, 1], [0, 0, 1, 1], [0.9, 0.1, 0.1, 0.9], [0, 1, 0, 1], [1, 0, 1, 0]];
    for (const c of curves) {
      let prev = -Infinity;
      for (let i = 0; i <= 1000; i++) {
        const y = solveCubicBezier(c, i / 1000);
        expect(y).toBeGreaterThanOrEqual(prev - BEZIER_EPSILON);
        prev = y;
      }
    }
  });

  it('pins the end points and clamps x (CSS rule)', () => {
    expect(solveCubicBezier(CSS_EASE, 0)).toBe(0);
    expect(solveCubicBezier(CSS_EASE, 1)).toBe(1);
    expect(solveCubicBezier(CSS_EASE, -2)).toBe(0);
    expect(normalizeBezier([1.5, 2, -1, -3])).toEqual([1, 2, 0, -3]);
    expect(bezierToCss([0.25, 0.1, 0.25, 1])).toBe('cubic-bezier(0.25,0.1,0.25,1)');
    expect(bezierToCss([2, 0.123456, -1, 1])).toBe('cubic-bezier(1,0.1235,0,1)');
  });
});

describe('colours', () => {
  it('parses hex, short hex, named, rgb() and hsl()', () => {
    expect(parseColor('#f00')).toEqual({ r: 255, g: 0, b: 0, a: 1 });
    expect(parseColor('#ff000080')?.a).toBeCloseTo(0.502, 3);
    expect(parseColor('RebeccaPurple')).toEqual({ r: 0x66, g: 0x33, b: 0x99, a: 1 });
    expect(parseColor('rgb(10, 20, 30)')).toEqual({ r: 10, g: 20, b: 30, a: 1 });
    expect(parseColor('rgb(100% 0% 0% / 50%)')).toEqual({ r: 255, g: 0, b: 0, a: 0.5 });
    expect(formatColor(parseColor('hsl(120, 100%, 50%)')!)).toBe('#00ff00');
  });

  it('refuses paints that are not plain colours', () => {
    for (const v of ['none', 'currentColor', 'url(#g)', 'url(#g) red', 'color-mix(in srgb, red, blue)', 'notacolour', '#ggg', 3]) {
      expect(parseColor(v as string), String(v)).toBeNull();
    }
  });

  it('lerps premultiplied and clamps overshoot', () => {
    const black = parseColor('#000')!;
    const white = parseColor('#fff')!;
    expect(formatColor(lerpColor(black, white, 1.5))).toBe('#ffffff');
    expect(formatColor(lerpColor(black, white, -0.5))).toBe('#000000');
  });
});

describe('sampleDoc (preview render tree)', () => {
  const doc = (() => {
    const r = parseVectorDoc({
      version: 1,
      duration: 1000,
      layers: [
        { type: 'group', id: 'g', children: [{ type: 'rect', id: 'r', x: 0, y: 0, width: 10, height: 10 }] },
        { type: 'rect', id: 'still', x: 0, y: 0, width: 5, height: 5 },
      ],
      animations: [
        { layerId: 'r', property: 'transform.x', keyframes: [{ t: 0, value: 0, easing: 'linear' }, { t: 1000, value: 100, easing: 'linear' }] },
        { layerId: 'r', property: 'fill', keyframes: [{ t: 0, value: '#000000', easing: 'linear' }, { t: 1000, value: '#ffffff', easing: 'linear' }] },
        { layerId: 'r', property: 'strokeDashoffset', keyframes: [{ t: 0, value: 0, easing: 'linear' }, { t: 1000, value: 9, easing: 'linear' }] },
      ],
    });
    if (!r.ok) throw new Error(r.error);
    return r.doc as VectorDoc;
  })();

  it('samples nested layers, shares untouched ones and ignores MM45 properties', () => {
    const at = sampleDoc(doc, 500);
    const g = at.layers[0] as Extract<VectorDoc['layers'][number], { type: 'group' }>;
    const r = g.children[0] as Extract<VectorDoc['layers'][number], { type: 'rect' }>;
    expect(r.transform?.x).toBe(50);
    expect(r.fill).toBe('#808080');
    expect(r.strokeDashoffset).toBeUndefined();
    expect(at.layers[1]).toBe(doc.layers[1]);
    expect(doc.layers[0]).not.toBe(at.layers[0]);
  });

  it('caps t to [0, duration]', () => {
    const late = sampleDoc(doc, 5000).layers[0] as Extract<VectorDoc['layers'][number], { type: 'group' }>;
    expect((late.children[0] as { transform?: { x: number } }).transform?.x).toBe(100);
  });

  it('returns the document itself when nothing is animated', () => {
    const still = { ...doc, animations: [] };
    expect(sampleDoc(still, 300)).toBe(still);
  });
});
