import { describe, expect, it } from 'vitest';

import { apply, resolveTransform } from './geometry';
import { findLayer, groupLayers, localToDocMatrix, moveLayer, orderedIds, ungroupLayer } from './layerTree';
import type { Layer } from './vectorTypes';

const rect = (id: string, x = 0): Layer => ({ type: 'rect', id, x, y: 0, width: 10, height: 10 });

describe('layerTree', () => {
  it('orders ids by paint order and drops children of selected groups', () => {
    const layers: Layer[] = [rect('a'), { type: 'group', id: 'g', children: [rect('b'), rect('c')] }, rect('d')];
    expect(orderedIds(layers, ['d', 'c', 'a'])).toEqual(['a', 'c', 'd']);
    expect(orderedIds(layers, ['b', 'g'])).toEqual(['g']);
  });

  it('moves a layer within and across parents', () => {
    const layers: Layer[] = [rect('a'), rect('b'), { type: 'group', id: 'g', children: [rect('c')] }];
    expect(moveLayer(layers, 'a', null, 2).map((l) => l.id)).toEqual(['b', 'a', 'g']);
    const into = moveLayer(layers, 'a', 'g', 0);
    expect(into.map((l) => l.id)).toEqual(['b', 'g']);
    expect((findLayer(into, 'g') as Extract<Layer, { type: 'group' }>).children.map((l) => l.id)).toEqual(['a', 'c']);
  });

  it('groups members from different parents without moving them on canvas', () => {
    const layers: Layer[] = [
      rect('a', 5),
      {
        type: 'group',
        id: 'g',
        transform: { x: 100, y: 0, scaleX: 2, scaleY: 2, rotation: 0, skewX: 0, skewY: 0, anchorX: 0, anchorY: 0 },
        children: [rect('b', 1)],
      },
    ];
    const before = apply(localToDocMatrix(layers, 'b'), { x: 1, y: 0 });
    const out = groupLayers(layers, ['a', 'b'], 'group-1');
    const after = apply(localToDocMatrix(out, 'b'), { x: 1, y: 0 });
    expect(after.x).toBeCloseTo(before.x, 3);
    expect(after.y).toBeCloseTo(before.y, 3);
  });

  it('ungroups folding the group transform and opacity into the children', () => {
    const layers: Layer[] = [
      {
        type: 'group',
        id: 'g',
        opacity: 0.5,
        transform: { x: 10, y: 20, scaleX: 1, scaleY: 1, rotation: 90, skewX: 0, skewY: 0, anchorX: 0, anchorY: 0 },
        children: [rect('a', 3)],
      },
    ];
    const before = apply(localToDocMatrix(layers, 'a'), { x: 3, y: 0 });
    const out = ungroupLayer(layers, 'g');
    expect(out.map((l) => l.id)).toEqual(['a']);
    const a = out[0] as Extract<Layer, { type: 'rect' }>;
    expect(a.opacity).toBe(0.5);
    expect(resolveTransform(a.transform).rotation).toBe(90);
    const after = apply(localToDocMatrix(out, 'a'), { x: 3, y: 0 });
    expect(after.x).toBeCloseTo(before.x, 3);
    expect(after.y).toBeCloseTo(before.y, 3);
  });
});
