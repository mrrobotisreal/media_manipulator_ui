/**
 * MM45 S2 + acceptance 8: the animators as document operations, their
 * preview (`sampleDoc`), the time-aware fold of edits on animated advanced
 * properties, and undo through the store.
 */
import { describe, expect, it } from 'vitest';

import { motionPathData, withMotion, withoutMotion } from './advanced';
import {
  applyBlur,
  applyDrawOn,
  applyGradientStops,
  applyMaskClip,
  applyMorph,
  applyMotionPath,
  canDrawOn,
  defaultSpan,
  motionGuides,
  morphTargets,
  renormalizeMorphTrack,
} from './animators';
import { resolveTransform, transformToMatrix, apply } from './geometry';
import { findTrack } from './keyframes';
import { findLayer } from './layerTree';
import { morphCompatible } from './morph';
import { applySolid, makeMask } from './paintOps';
import { pathLength } from './pathLength';
import { sampleDoc, sampledLayer } from './sampleTrack';
import { translateLayers } from './transformOps';
import { createVectorStore } from './vectorStore';
import { parseVectorDoc, type Layer, type PathLayer, type VectorDoc } from './vectorTypes';

const make = (layers: unknown[], extra: Record<string, unknown> = {}): VectorDoc => {
  const r = parseVectorDoc({ version: 1, duration: 2000, layers, ...extra });
  if (!r.ok) throw new Error(r.error);
  return r.doc;
};
const valid = (doc: VectorDoc) => {
  const r = parseVectorDoc(JSON.parse(JSON.stringify(doc)));
  if (!r.ok) throw new Error(r.error);
  return r.doc;
};
const layer = <T extends Layer = Layer>(doc: VectorDoc, id: string) => sampledLayer(doc, id, 0) as T;
const span = { start: 0, end: 1000 };

const PATH = { type: 'path', id: 'p', d: 'M0 0L100 0', stroke: '#fff', strokeWidth: 2 };
const SQUARE = { type: 'rect', id: 'sq', x: 0, y: 0, width: 50, height: 50, fill: '#f00' };
const DOT = { type: 'ellipse', id: 'dot', cx: 0, cy: 0, rx: 5, ry: 5, fill: '#0f0' };

describe('Draw on', () => {
  it('sets dasharray = L and keys dashoffset L → 0', () => {
    const doc = applyDrawOn(make([PATH]), 'p', span);
    const p = findLayer(doc.layers, 'p') as PathLayer;
    expect(p.strokeDasharray).toEqual([100]);
    expect(p.strokeDashoffset).toBe(100);
    const tr = findTrack(doc, 'p', 'strokeDashoffset')!;
    expect(tr.keyframes.map((k) => [k.t, k.value])).toEqual([[0, 100], [1000, 0]]);
    expect((sampledLayer(doc, 'p', 500) as PathLayer).strokeDashoffset).toBeCloseTo(25, 6); // easeOut
    expect((sampledLayer(doc, 'p', 1000) as PathLayer).strokeDashoffset).toBe(0);
    valid(doc);
  });

  it('prefers a measured length (getTotalLength) and works on a rect outline', () => {
    expect(findTrack(applyDrawOn(make([PATH]), 'p', span, 99.5), 'p', 'strokeDashoffset')!.keyframes[0].value).toBe(99.5);
    const doc = applyDrawOn(make([SQUARE]), 'sq', span);
    expect((findLayer(doc.layers, 'sq') as { strokeDasharray?: number[] }).strokeDasharray).toEqual([200]);
    // A layer with no stroke gets one so the draw shows.
    expect((findLayer(doc.layers, 'sq') as { stroke?: string }).stroke).toBe('currentColor');
  });

  it('holds before a late start; refuses text and empty spans', () => {
    const doc = applyDrawOn(make([PATH]), 'p', { start: 500, end: 1500 });
    expect(findTrack(doc, 'p', 'strokeDashoffset')!.keyframes.map((k) => [k.t, k.easing])).toEqual([
      [0, 'hold'],
      [500, 'easeOut'],
      [1500, 'linear'],
    ]);
    const text = make([{ type: 'text', id: 't', x: 0, y: 0, text: 'hi' }]);
    expect(canDrawOn(text, 't')).toBe(false);
    expect(applyDrawOn(text, 't', span)).toBe(text);
    const base = make([PATH]);
    expect(applyDrawOn(base, 'p', { start: 800, end: 800 })).toBe(base);
  });
});

describe('Motion path', () => {
  const base = () => make([{ type: 'path', id: 'guide', d: 'M0 0L100 0L100 100', fill: 'none', stroke: '#888' }, DOT]);

  it('rides the guide by arc length with the centre on the path', () => {
    const doc = applyMotionPath(base(), 'dot', span, { pathId: 'guide' });
    expect(findTrack(doc, 'dot', 'motionPath')!.extras).toEqual({ pathId: 'guide', autoOrient: false });
    const at = (t: number) => {
      const l = sampledLayer(doc, 'dot', t)!;
      return apply(transformToMatrix(l.type === 'raw' ? undefined : l.transform), { x: 0, y: 0 });
    };
    expect(at(0).x).toBeCloseTo(0, 6);
    expect(at(1000).x).toBeCloseTo(100, 6);
    expect(at(1000).y).toBeCloseTo(100, 6);
    // easeBoth at the midpoint = half the length = the corner.
    expect(at(500).x).toBeCloseTo(100, 4);
    expect(at(500).y).toBeCloseTo(0, 4);
    valid(doc);
  });

  it('autoOrient rotates with the direction of travel', () => {
    const doc = applyMotionPath(base(), 'dot', span, { pathId: 'guide', autoOrient: true });
    const rot = (t: number) => resolveTransform((sampledLayer(doc, 'dot', t) as { transform?: never }).transform).rotation;
    expect(rot(100)).toBeCloseTo(0, 6);
    expect(rot(900)).toBeCloseTo(90, 6);
  });

  it('inline d works too; guides exclude the layer itself', () => {
    const doc = applyMotionPath(make([DOT]), 'dot', span, { d: 'M10 10L20 10' });
    expect(motionPathData(doc, findTrack(doc, 'dot', 'motionPath')!)).toBe('M10 10L20 10');
    expect(motionGuides(base(), 'dot').map((l) => l.id)).toEqual(['guide']);
    const none = base();
    expect(applyMotionPath(none, 'dot', span, { pathId: 'dot' })).toBe(none);
  });

  it('withMotion / withoutMotion are inverse (canvas edits fold back through them)', () => {
    const t = { x: 3, y: -4, scaleX: 2, scaleY: 1, rotation: 15, skewX: 0, skewY: 0, anchorX: 5, anchorY: 7 };
    const p = { x: 40, y: 10, angle: 33 };
    const back = withoutMotion(withMotion(t, p, true), p, true);
    for (const k of Object.keys(t) as Array<keyof typeof t>) expect(back[k]).toBeCloseTo(t[k], 9);
  });

  it('a canvas drag of a moving layer shifts its own offset, not a static jump', () => {
    const store = createVectorStore();
    store.getState().load('m', applyMotionPath(base(), 'dot', span, { pathId: 'guide' }));
    store.getState().setTime(500);
    const before = resolveTransform((findLayer(store.getState().doc!.layers, 'dot') as { transform?: never }).transform);
    store.getState().mutateAt('Move', (d) => translateLayers(d, ['dot'], 10, 0));
    const after = resolveTransform((findLayer(store.getState().doc!.layers, 'dot') as { transform?: never }).transform);
    expect(after.x - before.x).toBeCloseTo(10, 6);
    expect(after.y).toBeCloseTo(before.y, 6);
  });
});

describe('Morph', () => {
  const doc0 = () =>
    make([
      { type: 'path', id: 'p', d: 'M0 0L100 0L100 100Z', fill: '#f00' },
      { type: 'polygon', id: 'hex', points: [50, 0, 93, 25, 93, 75, 50, 100, 7, 75, 7, 25], fill: '#00f' },
    ]);

  it('unequal command counts yield normalised, compatible keys; frame 0 is unchanged', () => {
    const before = doc0();
    const res = applyMorph(before, 'p', 'hex', span);
    if (!res.ok) throw new Error(res.reason);
    const tr = findTrack(res.doc, 'p', 'd')!;
    const [a, b] = tr.keyframes.map((k) => k.value as string);
    expect(morphCompatible(a, b)).toBe(true);
    expect(a.match(/C/g)!.length).toBe(b.match(/C/g)!.length);
    expect((findLayer(res.doc.layers, 'p') as PathLayer).d).toBe(a);
    expect(pathLength(a)).toBeCloseTo(pathLength('M0 0L100 0L100 100Z'), 2);
    // Midway is a real in-between path (it interpolates, it does not hold).
    const mid = (sampledLayer(res.doc, 'p', 500) as PathLayer).d;
    expect(mid).not.toBe(a);
    expect(mid).not.toBe(b);
    valid(res.doc);
  });

  it('the target outline maps into the path’s local space', () => {
    const d = make([
      { type: 'path', id: 'p', d: 'M0 0L10 0L10 10Z', transform: { x: 100, y: 0, scaleX: 1, scaleY: 1, rotation: 0, skewX: 0, skewY: 0, anchorX: 0, anchorY: 0 } },
      { type: 'rect', id: 'r', x: 100, y: 0, width: 10, height: 10 },
    ]);
    const res = applyMorph(d, 'p', 'r', span);
    if (!res.ok) throw new Error(res.reason);
    const end = findTrack(res.doc, 'p', 'd')!.keyframes[1].value as string;
    // The rect at x = 100 lands at local 0..10 (the path is translated by 100).
    expect(end).toBe('M0 0C3.333 0 6.667 0 10 0C10 3.333 10 6.667 10 10C6.667 10 3.333 10 0 10C0 6.667 0 3.333 0 0Z');
  });

  it('refuses a non-path layer or a missing target', () => {
    expect(applyMorph(doc0(), 'hex', 'p', span)).toEqual({ ok: false, reason: 'not_path' });
    expect(applyMorph(doc0(), 'p', 'nope', span)).toEqual({ ok: false, reason: 'no_target' });
    expect(morphTargets(doc0(), 'p').map((l) => l.id)).toEqual(['hex']);
  });

  it('a third key added later is re-normalised into the set', () => {
    const res = applyMorph(doc0(), 'p', 'hex', span);
    if (!res.ok) throw new Error(res.reason);
    const withThird = {
      ...res.doc,
      animations: res.doc.animations.map((tr) =>
        tr.property === 'd' ? { ...tr, keyframes: [...tr.keyframes, { t: 2000, value: 'M0 0L1 1', easing: 'linear' as const }] } : tr,
      ),
    };
    const fixed = renormalizeMorphTrack(withThird, 'p');
    const keys = findTrack(fixed, 'p', 'd')!.keyframes.map((k) => k.value as string);
    expect(morphCompatible(keys[0], keys[2])).toBe(true);
    expect(morphCompatible(keys[1], keys[2])).toBe(true);
  });
});

describe('Gradient stops', () => {
  it('creates a gradient when needed and keys every stop colour at the playhead', () => {
    const doc = applyGradientStops(make([SQUARE]), 'sq', 0);
    const tracks = doc.animations.filter((tr) => tr.layerId === 'sq').map((tr) => tr.property);
    expect(tracks).toEqual(['gradientStop[0].color', 'gradientStop[1].color']);
    valid(doc);
  });

  it('preview animates the stop colour and offset in defs', () => {
    let doc = applyGradientStops(make([SQUARE]), 'sq', 0);
    doc = {
      ...doc,
      animations: [
        ...doc.animations.filter((tr) => tr.property !== 'gradientStop[0].color'),
        { layerId: 'sq', property: 'gradientStop[0].color', keyframes: [{ t: 0, value: '#000000', easing: 'linear' }, { t: 1000, value: '#ffffff', easing: 'linear' }] },
        { layerId: 'sq', property: 'gradientStop[1].offset', keyframes: [{ t: 0, value: 1, easing: 'linear' }, { t: 1000, value: 0.5, easing: 'linear' }] },
      ],
    };
    const at = sampleDoc(doc, 500);
    expect(at.defs.gradients[0].stops[0].color).toBe('#808080');
    expect(at.defs.gradients[0].stops[1].offset).toBeCloseTo(0.75, 9);
    // The stored document is untouched.
    expect(doc.defs.gradients[0].stops[0].color).not.toBe('#808080');
  });

  it('an inspector edit of an animated stop colour becomes a keyframe at the playhead', () => {
    const store = createVectorStore();
    store.getState().load('g', applyGradientStops(make([SQUARE]), 'sq', 0));
    store.getState().setTime(800);
    const gid = store.getState().doc!.defs.gradients[0].id;
    const orig = store.getState().doc!.defs.gradients[0].stops[0].color;
    store.getState().mutateAt('Stop colour', (d) => ({
      ...d,
      defs: { ...d.defs, gradients: d.defs.gradients.map((g) => (g.id === gid ? { ...g, stops: g.stops.map((s, i) => (i === 0 ? { ...s, color: '#123456' } : s)) } : g)) },
    }));
    const doc = store.getState().doc!;
    expect(findTrack(doc, 'sq', 'gradientStop[0].color')!.keyframes.map((k) => [k.t, k.value])).toEqual([
      [0, orig],
      [800, '#123456'],
    ]);
    expect(doc.defs.gradients[0].stops[0].color).toBe(orig);
  });
});

describe('Blur', () => {
  it('adds a blur filter and keys stdDeviation 0 → amount', () => {
    const doc = applyBlur(make([SQUARE]), 'sq', span, 8);
    const sq = findLayer(doc.layers, 'sq') as { filter?: string };
    expect(sq.filter).toBe(doc.defs.filters[0].id);
    expect(sampleDoc(doc, 500).defs.filters[0].stdDeviation).toBeCloseTo(6, 6); // easeOut
    expect(sampleDoc(doc, 1000).defs.filters[0].stdDeviation).toBe(8);
    valid(doc);
  });

  it('reuses the layer’s existing blur filter', () => {
    const d = make([{ ...SQUARE, filter: 'soft' }], { defs: { filters: [{ type: 'blur', id: 'soft', stdDeviation: 3 }] } });
    const doc = applyBlur(d, 'sq', span);
    expect(doc.defs.filters).toHaveLength(1);
  });
});

describe('Mask / clip', () => {
  it('keys the mask content layer’s own opacity; the preview animates it inside defs', () => {
    let d = make([SQUARE, { type: 'ellipse', id: 'm', cx: 25, cy: 25, rx: 20, ry: 20, fill: '#fff' }]);
    d = makeMask(d, 'm', 'sq', 'mask');
    const r = applyMaskClip(d, 'sq', 0);
    expect(r.contentId).toBe('m');
    let doc = r.doc;
    doc = { ...doc, animations: doc.animations.map((tr) => ({ ...tr, keyframes: [...tr.keyframes, { t: 1000, value: 0, easing: 'linear' as const }] })) };
    expect((sampleDoc(doc, 500).defs.masks[0].layers[0] as { opacity?: number }).opacity).toBeCloseTo(0.5, 9);
    valid(doc);
  });

  it('a clip content layer gets a transform.x track', () => {
    let d = make([SQUARE, { type: 'rect', id: 'c', x: 0, y: 0, width: 25, height: 50 }]);
    d = makeMask(d, 'c', 'sq', 'clip');
    const r = applyMaskClip(d, 'sq', 0);
    expect(findTrack(r.doc, 'c', 'transform.x')).toBeDefined();
  });
});

describe('store: animators are one undo step each', () => {
  it('Draw on, then undo restores the exact document', () => {
    const store = createVectorStore();
    const before = make([PATH]);
    store.getState().load('u', before);
    expect(store.getState().applyAnimator('Draw on', (d, t) => applyDrawOn(d, 'p', defaultSpan(d, t)))).toBe(true);
    expect(findTrack(store.getState().doc!, 'p', 'strokeDashoffset')).toBeDefined();
    expect(store.getState().past).toHaveLength(1);
    store.getState().undo();
    expect(store.getState().doc).toBe(before);
    store.getState().redo();
    expect((findLayer(store.getState().doc!.layers, 'p') as PathLayer).strokeDasharray).toEqual([100]);
  });

  it('Morph, then undo restores the original d', () => {
    const store = createVectorStore();
    const before = make([
      { type: 'path', id: 'p', d: 'M0 0L100 0L100 100Z' },
      { type: 'rect', id: 'r', x: 0, y: 0, width: 80, height: 80 },
    ]);
    store.getState().load('u', before);
    store.getState().applyAnimator('Morph', (d, t) => {
      const res = applyMorph(d, 'p', 'r', defaultSpan(d, t));
      return res.ok ? res.doc : d;
    });
    expect((findLayer(store.getState().doc!.layers, 'p') as PathLayer).d).not.toBe('M0 0L100 0L100 100Z');
    store.getState().undo();
    expect(store.getState().doc).toBe(before);
  });

  it('a refused animator records nothing', () => {
    const store = createVectorStore();
    store.getState().load('u', make([{ type: 'text', id: 't', x: 0, y: 0, text: 'x' }]));
    expect(store.getState().applyAnimator('Draw on', (d, t) => applyDrawOn(d, 't', defaultSpan(d, t)))).toBe(false);
    expect(store.getState().past).toHaveLength(0);
  });

  it('defaultSpan runs from the playhead to the end', () => {
    const d = make([PATH]);
    expect(defaultSpan(d, 500)).toEqual({ start: 500, end: 2000 });
    expect(defaultSpan(d, 2000)).toEqual({ start: 0, end: 2000 });
  });
});

describe('MM44 behaviour is unchanged for static paints', () => {
  it('solid paint ops still work on a layer with a stop track', () => {
    const doc = applyGradientStops(make([SQUARE]), 'sq', 0);
    const solid = applySolid(doc, 'sq', 'fill', '#00ff00');
    expect(layer(solid, 'sq').type).toBe('rect');
  });
});
