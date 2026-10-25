/**
 * MM44 S2: keyframe actions, autokey, playback state, range and loop in the
 * Motion store. Acceptance 8: undo/redo covers keyframe add / move / delete
 * and easing changes; a scrub creates no history entry.
 */
import { describe, expect, it } from 'vitest';

import { resolveTransform } from './geometry';
import { findTrack, keyframeAt } from './keyframes';
import { findLayer } from './layerTree';
import { sampleDoc } from './sampleTrack';
import { translateLayers } from './transformOps';
import { createVectorStore } from './vectorStore';
import { parseVectorDoc, type VectorDoc } from './vectorTypes';

const docWith = (extra: Record<string, unknown> = {}): VectorDoc => {
  const r = parseVectorDoc({
    version: 1,
    duration: 2000,
    layers: [
      { type: 'rect', id: 'a', x: 0, y: 0, width: 10, height: 10, fill: '#ff0000' },
      { type: 'rect', id: 'b', x: 20, y: 0, width: 10, height: 10 },
    ],
    ...extra,
  });
  if (!r.ok) throw new Error(r.error);
  return r.doc;
};
const setup = (extra?: Record<string, unknown>) => {
  const store = createVectorStore();
  store.getState().load('p1', docWith(extra));
  return store;
};
const xOf = (doc: VectorDoc | null, id: string) => {
  const l = findLayer(doc!.layers, id);
  return resolveTransform(l && l.type !== 'raw' ? l.transform : undefined).x;
};

describe('playback state', () => {
  it('starts at 0, paused, no range, autokey off (proposed default)', () => {
    const s = setup().getState();
    expect(s).toMatchObject({ time: 0, playing: false, range: null, autokey: false, keySelection: [] });
  });

  it('a scrub never creates a history entry', () => {
    const s = setup();
    for (const t of [0, 100, 999.6, 1500, 5000, -3]) s.getState().setTime(t);
    expect(s.getState().past).toHaveLength(0);
    expect(s.getState().time).toBe(0);
    s.getState().setTime(999.6);
    expect(s.getState().time).toBe(1000);
    s.getState().setTime(99999);
    expect(s.getState().time).toBe(2000);
    s.getState().setPlaying(true);
    s.getState().setRange({ start: 200, end: 800 });
    expect(s.getState().past).toHaveLength(0);
    expect(s.getState().revision).toBe(1);
  });

  it('normalises the play range', () => {
    const s = setup();
    s.getState().setRange({ start: 900, end: 100 });
    expect(s.getState().range).toEqual({ start: 100, end: 900 });
    s.getState().setRange({ start: 0, end: 2000 });
    expect(s.getState().range).toBeNull();
    s.getState().setRange({ start: 500, end: 500 });
    expect(s.getState().range).toBeNull();
  });

  it('loop and duration are undoable document edits', () => {
    const s = setup();
    expect(s.getState().doc!.loop).toBeUndefined();
    s.getState().setLoop(false);
    expect(s.getState().doc!.loop).toBe(false);
    s.getState().setLoop(true);
    expect('loop' in s.getState().doc!).toBe(false);
    s.getState().undo();
    expect(s.getState().doc!.loop).toBe(false);
    s.getState().setDuration(1500.4);
    expect(s.getState().doc!.duration).toBe(1500);
    s.getState().undo();
    expect(s.getState().doc!.duration).toBe(2000);
  });
});

describe('keyframe actions + undo (acceptance 8)', () => {
  it('add / move / delete / easing are each one undo step', () => {
    const s = setup();
    s.getState().setTime(500);
    s.getState().addKeyframe('a', 'transform.x');
    expect(keyframeAt(s.getState().doc!, 'a', 'transform.x', 500)).toMatchObject({ value: 0, easing: 'linear' });
    expect(s.getState().keySelection).toEqual([{ layerId: 'a', property: 'transform.x', t: 500 }]);
    expect(s.getState().past.map((e) => e.label)).toEqual(['Add keyframe']);

    s.getState().moveSelectedKeys(250);
    expect(keyframeAt(s.getState().doc!, 'a', 'transform.x', 750)).toBeDefined();
    expect(s.getState().keySelection[0].t).toBe(750);

    s.getState().setSelectedEasing({ cubicBezier: [0.25, 0.1, 0.25, 1] });
    expect(keyframeAt(s.getState().doc!, 'a', 'transform.x', 750)?.easing).toEqual({ cubicBezier: [0.25, 0.1, 0.25, 1] });

    s.getState().deleteSelectedKeys();
    expect(findTrack(s.getState().doc!, 'a', 'transform.x')).toBeUndefined();
    expect(s.getState().past.map((e) => e.label)).toEqual(['Add keyframe', 'Move keyframes', 'Easing', 'Delete keyframe']);

    s.getState().undo();
    expect(keyframeAt(s.getState().doc!, 'a', 'transform.x', 750)?.easing).toEqual({ cubicBezier: [0.25, 0.1, 0.25, 1] });
    s.getState().undo();
    expect(keyframeAt(s.getState().doc!, 'a', 'transform.x', 750)?.easing).toBe('linear');
    s.getState().undo();
    expect(keyframeAt(s.getState().doc!, 'a', 'transform.x', 500)).toBeDefined();
    s.getState().undo();
    expect(s.getState().doc!.animations).toHaveLength(0);
    s.getState().redo();
    s.getState().redo();
    expect(keyframeAt(s.getState().doc!, 'a', 'transform.x', 750)).toBeDefined();
  });

  it('a move that would collide with a still key is refused', () => {
    const s = setup();
    s.getState().setTime(0);
    s.getState().addKeyframe('a', 'opacity');
    s.getState().setTime(1000);
    s.getState().addKeyframe('a', 'opacity');
    s.getState().setKeySelection([{ layerId: 'a', property: 'opacity', t: 0 }]);
    const before = s.getState().doc;
    s.getState().moveSelectedKeys(1000);
    expect(s.getState().doc).toBe(before);
    s.getState().moveSelectedKeys(5000); // clamped so the key lands on the end (2000), past the still key
    expect(keyframeAt(s.getState().doc!, 'a', 'opacity', 2000)).toBeDefined();
    expect(s.getState().keySelection).toEqual([{ layerId: 'a', property: 'opacity', t: 2000 }]);
  });

  it('copy / paste at the playhead onto another layer', () => {
    const s = setup();
    s.getState().setTime(0);
    s.getState().addKeyframe('a', 'fill');
    s.getState().setTime(400);
    s.getState().mutateAt('Fill', (d) => ({ ...d, layers: d.layers.map((l) => (l.id === 'a' ? { ...l, fill: '#0000ff' } : l)) as VectorDoc['layers'] }));
    s.getState().setKeySelection([
      { layerId: 'a', property: 'fill', t: 0 },
      { layerId: 'a', property: 'fill', t: 400 },
    ]);
    s.getState().copySelectedKeys();
    s.getState().setSelection(['b']);
    s.getState().setTime(1000);
    s.getState().pasteKeys();
    const tr = findTrack(s.getState().doc!, 'b', 'fill')!;
    expect(tr.keyframes.map((k) => [k.t, k.value])).toEqual([
      [1000, '#ff0000'],
      [1400, '#0000ff'],
    ]);
    expect(s.getState().past.at(-1)?.label).toBe('Paste keyframes');
  });

  it('deleting a layer removes its tracks and prunes the key selection', () => {
    const s = setup();
    s.getState().addKeyframe('a', 'transform.x');
    s.getState().setSelection(['a']);
    s.getState().deleteSelection();
    expect(s.getState().doc!.animations).toHaveLength(0);
    expect(s.getState().keySelection).toEqual([]);
  });

  it('duration shrink drops keys after the end and clamps the playhead', () => {
    const s = setup();
    s.getState().setTime(1800);
    s.getState().addKeyframe('a', 'opacity');
    s.getState().setDuration(1000);
    expect(s.getState().doc!.animations).toHaveLength(0);
    expect(s.getState().time).toBe(1000);
  });
});

describe('time-aware edits (mutateAt)', () => {
  it('on an animated property, an edit at the playhead keys it and keeps the base', () => {
    const s = setup();
    s.getState().setTime(0);
    s.getState().addKeyframe('a', 'transform.x');
    s.getState().setTime(1000);
    s.getState().mutateAt('Move', (d) => translateLayers(d, ['a'], 50, 0));
    const doc = s.getState().doc!;
    expect(findTrack(doc, 'a', 'transform.x')!.keyframes.map((k) => [k.t, k.value])).toEqual([
      [0, 0],
      [1000, 50],
    ]);
    // Base layer unchanged (x not keyed into the static transform)…
    expect(xOf(doc, 'a')).toBe(0);
    // …and y, not animated, stayed static: no y track.
    expect(findTrack(doc, 'a', 'transform.y')).toBeUndefined();
    expect(xOf(sampleDoc(doc, 500), 'a')).toBe(25);
  });

  it('with autokey off, un-animated properties are static edits', () => {
    const s = setup();
    s.getState().setTime(700);
    s.getState().mutateAt('Move', (d) => translateLayers(d, ['b'], 5, 0));
    expect(xOf(s.getState().doc, 'b')).toBe(5);
    expect(s.getState().doc!.animations).toHaveLength(0);
  });

  it('with autokey on, an un-animated property starts a track at the playhead', () => {
    const s = setup();
    s.getState().setAutokey(true);
    s.getState().setTime(700);
    s.getState().mutateAt('Move', (d) => translateLayers(d, ['b'], 5, 0));
    const doc = s.getState().doc!;
    expect(findTrack(doc, 'b', 'transform.x')!.keyframes).toEqual([{ t: 700, value: 5, easing: 'linear' }]);
    expect(xOf(doc, 'b')).toBe(0);
    expect(findTrack(doc, 'b', 'transform.y')).toBeUndefined();
    expect(s.getState().past).toHaveLength(1);
  });

  it('an edit that changes nothing records nothing', () => {
    const s = setup();
    s.getState().addKeyframe('a', 'transform.x');
    const n = s.getState().past.length;
    s.getState().mutateAt('Move', (d) => translateLayers(d, ['a'], 0, 0));
    expect(s.getState().past).toHaveLength(n);
  });

  it('a drag gesture of time-aware edits is one undo step', () => {
    const s = setup();
    s.getState().addKeyframe('a', 'transform.x');
    s.getState().setTime(1000);
    const root = s.getState().doc!;
    const sampled = sampleDoc(root, 1000);
    s.getState().beginGesture('Move');
    for (const dx of [10, 20, 30]) s.getState().mutate('Move', () => s.getState().foldAt(root, sampled, translateLayers(sampled, ['a'], dx, 0)));
    s.getState().endGesture();
    expect(keyframeAt(s.getState().doc!, 'a', 'transform.x', 1000)?.value).toBe(30);
    expect(s.getState().past.map((e) => e.label)).toEqual(['Add keyframe', 'Move']);
    s.getState().undo();
    expect(keyframeAt(s.getState().doc!, 'a', 'transform.x', 1000)).toBeUndefined();
  });
});
