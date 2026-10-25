import { describe, expect, it } from 'vitest';

import { resolveTransform } from './geometry';
import { findLayer } from './layerTree';
import { rotateLayers, scaleLayerLocal, translateLayers } from './transformOps';
import { VECTOR_HISTORY_CAP, createVectorStore } from './vectorStore';
import { parseVectorDoc, type Layer, type VectorDoc } from './vectorTypes';

const docWith = (layers: unknown[]): VectorDoc => {
  const r = parseVectorDoc({ version: 1, layers });
  if (!r.ok) throw new Error(r.error);
  return r.doc;
};
const rect = (id: string, x = 0, extra: Record<string, unknown> = {}) => ({ type: 'rect', id, x, y: 0, width: 10, height: 10, ...extra });

const setup = (layers: unknown[] = [rect('a'), rect('b', 20), rect('c', 40)]) => {
  const store = createVectorStore();
  store.getState().load('p1', docWith(layers));
  return store;
};
const ids = (layers: Layer[]) => layers.map((l) => l.id);
const tf = (doc: VectorDoc | null, id: string) => {
  const l = findLayer(doc!.layers, id);
  return resolveTransform(l && l.type !== 'raw' ? l.transform : undefined);
};

describe('vectorStore history', () => {
  it('undoes and redoes a move', () => {
    const s = setup();
    s.getState().setSelection(['a']);
    s.getState().mutate('Move', (d) => translateLayers(d, ['a'], 5, 7));
    expect(tf(s.getState().doc, 'a')).toMatchObject({ x: 5, y: 7 });
    s.getState().undo();
    expect(tf(s.getState().doc, 'a')).toMatchObject({ x: 0, y: 0 });
    s.getState().redo();
    expect(tf(s.getState().doc, 'a')).toMatchObject({ x: 5, y: 7 });
  });

  it('undoes scale and rotate', () => {
    const s = setup();
    s.getState().mutate('Scale', (d) => scaleLayerLocal(d, 'a', 2, 2, { x: 0, y: 0 }));
    s.getState().mutate('Rotate', (d) => rotateLayers(d, ['a'], 90));
    expect(tf(s.getState().doc, 'a')).toMatchObject({ scaleX: 2, rotation: 90 });
    s.getState().undo();
    expect(tf(s.getState().doc, 'a')).toMatchObject({ scaleX: 2, rotation: 0 });
    s.getState().undo();
    expect(tf(s.getState().doc, 'a')).toMatchObject({ scaleX: 1 });
    expect(s.getState().past).toHaveLength(0);
    expect(s.getState().future.map((e) => e.label)).toEqual(['Rotate', 'Scale']);
  });

  it('undoes group, ungroup, reorder and delete', () => {
    const s = setup();
    const before = s.getState().doc;
    s.getState().setSelection(['a', 'b']);
    s.getState().groupSelection();
    const grouped = s.getState().doc!;
    expect(ids(grouped.layers)).toEqual(['group-1', 'c']);
    expect(s.getState().selection).toEqual(['group-1']);
    s.getState().ungroupSelection();
    expect(ids(s.getState().doc!.layers)).toEqual(['a', 'b', 'c']);
    s.getState().reorderLayer('c', null, 0);
    expect(ids(s.getState().doc!.layers)).toEqual(['c', 'a', 'b']);
    s.getState().setSelection(['a']);
    s.getState().deleteSelection();
    expect(ids(s.getState().doc!.layers)).toEqual(['c', 'b']);
    s.getState().undo(); // delete
    expect(ids(s.getState().doc!.layers)).toEqual(['c', 'a', 'b']);
    s.getState().undo(); // reorder
    s.getState().undo(); // ungroup
    expect(s.getState().doc).toBe(grouped);
    s.getState().undo(); // group
    expect(s.getState().doc).toBe(before);
  });

  it('coalesces a drag into one undo step', () => {
    const s = setup();
    s.getState().beginGesture('Move');
    for (let i = 1; i <= 20; i++) s.getState().mutate('Move', (d) => translateLayers(d, ['a'], 1, 0));
    s.getState().endGesture();
    expect(tf(s.getState().doc, 'a').x).toBe(20);
    expect(s.getState().past).toHaveLength(1);
    expect(s.getState().past[0].label).toBe('Move');
    s.getState().undo();
    expect(tf(s.getState().doc, 'a').x).toBe(0);
  });

  it('records nothing for a gesture that changed nothing, and cancel restores', () => {
    const s = setup();
    s.getState().beginGesture('Move');
    s.getState().endGesture();
    expect(s.getState().past).toHaveLength(0);
    const before = s.getState().doc;
    s.getState().beginGesture('Move');
    s.getState().mutate('Move', (d) => translateLayers(d, ['a'], 9, 9));
    s.getState().cancelGesture();
    expect(s.getState().doc).toBe(before);
    expect(s.getState().past).toHaveLength(0);
  });

  it('ignores undo while a gesture is open', () => {
    const s = setup();
    s.getState().mutate('Move', (d) => translateLayers(d, ['a'], 1, 0));
    s.getState().beginGesture('Move');
    s.getState().undo();
    expect(tf(s.getState().doc, 'a').x).toBe(1);
    s.getState().endGesture();
  });

  it('drops the redo stack on a new mutation after undo', () => {
    const s = setup();
    s.getState().mutate('Move', (d) => translateLayers(d, ['a'], 1, 0));
    s.getState().undo();
    expect(s.getState().future).toHaveLength(1);
    s.getState().mutate('Move', (d) => translateLayers(d, ['b'], 1, 0));
    expect(s.getState().future).toHaveLength(0);
    s.getState().redo();
    expect(tf(s.getState().doc, 'a').x).toBe(0);
  });

  it('caps history at 100 entries', () => {
    expect(VECTOR_HISTORY_CAP).toBe(100);
    const s = setup();
    for (let i = 0; i < 130; i++) s.getState().mutate('Move', (d) => translateLayers(d, ['a'], 1, 0));
    expect(s.getState().past).toHaveLength(100);
  });

  it('does not record a no-op mutation', () => {
    const s = setup();
    s.getState().mutate('Nothing', (d) => d);
    s.getState().nudgeSelection(1, 0); // empty selection
    expect(s.getState().past).toHaveLength(0);
  });

  it('shares structure between snapshots', () => {
    const s = setup();
    const before = s.getState().doc!;
    s.getState().mutate('Move', (d) => translateLayers(d, ['a'], 1, 0));
    const after = s.getState().doc!;
    expect(after.layers[1]).toBe(before.layers[1]);
    expect(after.defs).toBe(before.defs);
  });

  it('prunes the selection on undo', () => {
    const s = setup();
    s.getState().addLayers([rect('d') as Layer], 'Draw rect');
    expect(s.getState().selection).toEqual(['d']);
    s.getState().undo();
    expect(s.getState().selection).toEqual([]);
  });
});

describe('vectorStore editing actions', () => {
  it('nudges and rotates the selection', () => {
    const s = setup();
    s.getState().setSelection(['b']);
    s.getState().nudgeSelection(0, 10);
    s.getState().rotateSelection(15);
    expect(tf(s.getState().doc, 'b')).toMatchObject({ y: 10, rotation: 15 });
  });

  it('never transforms or deletes locked layers', () => {
    const s = setup([rect('a', 0, { locked: true }), { type: 'group', id: 'g', locked: true, children: [rect('k')] }]);
    s.getState().setSelection(['a', 'k']);
    s.getState().nudgeSelection(5, 5);
    s.getState().deleteSelection();
    expect(s.getState().past).toHaveLength(0);
    expect(tf(s.getState().doc, 'a').x).toBe(0);
  });

  it('duplicates above the source with fresh ids and an offset', () => {
    const s = setup();
    s.getState().setSelection(['a']);
    s.getState().duplicateSelection();
    const doc = s.getState().doc!;
    expect(ids(doc.layers)).toEqual(['a', 'rect-1', 'b', 'c']);
    expect(s.getState().selection).toEqual(['rect-1']);
    expect(tf(doc, 'rect-1')).toMatchObject({ x: 10, y: 10 });
  });

  it('restacks one layer', () => {
    const s = setup();
    s.getState().setSelection(['a']);
    s.getState().restack('up');
    expect(ids(s.getState().doc!.layers)).toEqual(['b', 'a', 'c']);
    s.getState().restack('up', true);
    expect(ids(s.getState().doc!.layers)).toEqual(['b', 'c', 'a']);
    s.getState().restack('down', true);
    expect(ids(s.getState().doc!.layers)).toEqual(['a', 'b', 'c']);
  });

  it('patches a layer and refuses to move a group into itself', () => {
    const s = setup([{ type: 'group', id: 'g', children: [{ type: 'group', id: 'h', children: [] }] }]);
    s.getState().patchLayer('g', 'Rename', { name: 'Logo' });
    expect(findLayer(s.getState().doc!.layers, 'g')?.name).toBe('Logo');
    const before = s.getState().doc;
    s.getState().reorderLayer('g', 'h', 0);
    expect(s.getState().doc).toBe(before);
  });

  it('selects every visible unlocked root layer', () => {
    const s = setup([rect('a'), rect('b', 0, { hidden: true }), rect('c', 0, { locked: true })]);
    s.getState().selectAll();
    expect(s.getState().selection).toEqual(['a']);
  });
});
