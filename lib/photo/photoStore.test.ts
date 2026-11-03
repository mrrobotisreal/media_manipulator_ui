import { describe, expect, it } from 'vitest';

import { createPhotoStore, PHOTO_HISTORY_CAP } from './photoStore';
import { newPhotoDoc } from './photoTypes';
import { duplicateLayer, greyExcept, moveLayer, newLayer, patchLayer, removeLayer, upsertAdjustment, addCustomRange } from './layerOps';
import { defaultHslRanges } from './photoTypes';

const fresh = () => {
  const s = createPhotoStore();
  s.getState().load('p1', newPhotoDoc(100, 80), 'Test');
  return s;
};
const setEv = (ev: number) => (d: ReturnType<typeof newPhotoDoc>) =>
  upsertAdjustment(d, 'exposure', (p) => ({ ...p, ev })).doc;

describe('photoStore', () => {
  it('mutate / undo / redo', () => {
    const s = fresh();
    s.getState().mutate('Exposure', setEv(1));
    s.getState().mutate('Exposure', setEv(2));
    expect(s.getState().doc?.layers).toHaveLength(1);
    expect(s.getState().past).toHaveLength(2);
    s.getState().undo();
    expect((s.getState().doc?.layers[0].params as { ev: number }).ev).toBe(1);
    s.getState().undo();
    expect(s.getState().doc?.layers).toHaveLength(0);
    s.getState().redo();
    s.getState().redo();
    expect((s.getState().doc?.layers[0].params as { ev: number }).ev).toBe(2);
    expect(s.getState().future).toHaveLength(0);
  });

  it('a new edit clears the redo stack', () => {
    const s = fresh();
    s.getState().mutate('a', setEv(1));
    s.getState().undo();
    s.getState().mutate('b', setEv(3));
    expect(s.getState().future).toHaveLength(0);
  });

  it('coalesces a slider drag into one history entry', () => {
    const s = fresh();
    s.getState().beginGesture('Exposure');
    for (let i = 1; i <= 25; i += 1) s.getState().mutate('Exposure', setEv(i / 10));
    expect(s.getState().past).toHaveLength(0);
    s.getState().endGesture();
    expect(s.getState().past).toHaveLength(1);
    s.getState().undo();
    expect(s.getState().doc?.layers).toHaveLength(0);
  });

  it('an empty gesture adds no entry; cancelGesture restores the start', () => {
    const s = fresh();
    s.getState().beginGesture('x');
    s.getState().endGesture();
    expect(s.getState().past).toHaveLength(0);
    s.getState().beginGesture('y');
    s.getState().mutate('y', setEv(2));
    s.getState().cancelGesture();
    expect(s.getState().doc?.layers).toHaveLength(0);
    expect(s.getState().past).toHaveLength(0);
  });

  it('caps history at 200, dropping the oldest', () => {
    const s = fresh();
    for (let i = 0; i < PHOTO_HISTORY_CAP + 15; i += 1) s.getState().mutate('e', setEv(((i % 40) - 20) / 10 + 0.01 * i));
    expect(s.getState().past).toHaveLength(PHOTO_HISTORY_CAP);
  });

  it('tracks dirty and revision; markSaved clears dirty', () => {
    const s = fresh();
    const r0 = s.getState().revision;
    expect(s.getState().dirty).toBe(false);
    s.getState().mutate('e', setEv(1));
    expect(s.getState().dirty).toBe(true);
    expect(s.getState().revision).toBe(r0 + 1);
    s.getState().markSaved(4);
    expect(s.getState().dirty).toBe(false);
    expect(s.getState().serverRevision).toBe(4);
    s.getState().undo();
    expect(s.getState().dirty).toBe(true);
  });

  it('a no-op mutation changes nothing', () => {
    const s = fresh();
    const r = s.getState().revision;
    s.getState().mutate('noop', (d) => d);
    expect(s.getState().revision).toBe(r);
    expect(s.getState().past).toHaveLength(0);
  });

  it('replaceDoc clears history without marking dirty', () => {
    const s = fresh();
    s.getState().mutate('e', setEv(1));
    s.getState().replaceDoc(newPhotoDoc(5, 5), 9);
    expect(s.getState().past).toHaveLength(0);
    expect(s.getState().dirty).toBe(false);
    expect(s.getState().serverRevision).toBe(9);
  });

  it('selection falls away when its layer disappears', () => {
    const s = fresh();
    s.getState().mutate('e', setEv(1), 'exposure');
    expect(s.getState().selection).toBe('exposure');
    s.getState().undo();
    expect(s.getState().selection).toBeNull();
  });
});

describe('layerOps', () => {
  const doc = newPhotoDoc(10, 10);
  it('upsertAdjustment creates once and edits in place afterwards', () => {
    const a = upsertAdjustment(doc, 'tone', (p) => ({ ...p, shadows: 40 }));
    const b = upsertAdjustment(a.doc, 'tone', (p) => ({ ...p, highlights: -20 }));
    expect(b.doc.layers).toHaveLength(1);
    expect(b.doc.layers[0].params).toMatchObject({ shadows: 40, highlights: -20 });
    expect(b.id).toBe(a.id);
  });
  it('returns the same doc when the edit changes nothing', () => {
    const a = upsertAdjustment(doc, 'tone', (p) => ({ ...p, shadows: 40 }));
    expect(upsertAdjustment(a.doc, 'tone', (p) => p).doc).toBe(a.doc);
  });
  it('duplicate / move / remove / rename', () => {
    let d = upsertAdjustment(doc, 'invert', (p) => p).doc;
    d = { ...d, layers: [...d.layers, newLayer(d, 'gamma')] };
    const dup = duplicateLayer(d, 'invert');
    expect(dup.doc.layers.map((l) => l.id)).toEqual(['invert', 'invert-2', 'gamma']);
    expect(moveLayer(dup.doc, 'gamma', 0).layers[0].id).toBe('gamma');
    expect(removeLayer(dup.doc, 'invert-2').layers).toHaveLength(2);
    expect(patchLayer(d, 'invert', { name: 'Flip' }).layers[0].name).toBe('Flip');
    expect(patchLayer(d, 'invert', { enabled: true })).toBe(d);
  });
  it('greyExcept sets -100 on the others and 0 on the chosen range', () => {
    const r = greyExcept(defaultHslRanges(), 'reds');
    expect(r.find((x) => x.id === 'reds')?.saturation).toBe(0);
    expect(r.filter((x) => x.id !== 'reds').every((x) => x.saturation === -100)).toBe(true);
    const c = addCustomRange(r, 210);
    expect(greyExcept(c.ranges, c.id).filter((x) => x.saturation === -100)).toHaveLength(6);
  });
});
