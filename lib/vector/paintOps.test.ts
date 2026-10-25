import { describe, expect, it } from 'vitest';

import { serializeSvg } from './exportSvg';
import { apply, transformToMatrix } from './geometry';
import { parseSvg } from './importSvg';
import { findLayer, localToDocMatrix } from './layerTree';
import {
  addStop,
  applyGradient,
  applySolid,
  linearAngle,
  makeMask,
  releaseMask,
  removeStop,
  setGradientAngle,
  setStop,
  solidOf,
} from './paintOps';
import { parseVectorDoc, serializeVectorDoc, type LinearGradient, type VectorDoc } from './vectorTypes';

const doc = (layers: unknown[]): VectorDoc => {
  const r = parseVectorDoc({ version: 1, layers });
  if (!r.ok) throw new Error(r.error);
  return r.doc;
};
const valid = (d: VectorDoc) => {
  const r = parseVectorDoc(JSON.parse(serializeVectorDoc(d)));
  if (!r.ok) throw new Error(r.error);
  return r.doc;
};
const two = () =>
  doc([
    { type: 'rect', id: 'a', x: 0, y: 0, width: 100, height: 100, fill: '#ff0000' },
    { type: 'ellipse', id: 'b', cx: 50, cy: 50, rx: 30, ry: 30, fill: '#ffffff', transform: { x: 10, y: 0, scaleX: 1, scaleY: 1, rotation: 0, skewX: 0, skewY: 0, anchorX: 0, anchorY: 0 } },
  ]);

describe('gradients', () => {
  it('applies a linear gradient seeded from the solid fill and writes defs.gradients', () => {
    const d = valid(applyGradient(two(), 'a', 'fill', 'linear'));
    expect(d.defs.gradients).toHaveLength(1);
    const g = d.defs.gradients[0] as LinearGradient;
    expect(g).toMatchObject({ type: 'linear', id: 'gradient-1', x1: 0, y1: 0.5, x2: 1, y2: 0.5 });
    expect(g.stops[0].color).toBe('#ff0000');
    expect(findLayer(d.layers, 'a')).toMatchObject({ fill: 'url(#gradient-1)' });
  });

  it('switches linear → radial in place and back to solid drops the gradient', () => {
    let d = applyGradient(two(), 'a', 'fill', 'linear');
    d = valid(applyGradient(d, 'a', 'fill', 'radial'));
    expect(d.defs.gradients).toEqual([expect.objectContaining({ type: 'radial', id: 'gradient-1', cx: 0.5, cy: 0.5, r: 0.5 })]);
    d = valid(applySolid(d, 'a', 'fill', '#00ff00'));
    expect(d.defs.gradients).toEqual([]);
    expect(findLayer(d.layers, 'a')).toMatchObject({ fill: '#00ff00' });
  });

  it('keeps a gradient another layer still uses', () => {
    let d = applyGradient(two(), 'a', 'fill', 'linear');
    d = { ...d, layers: d.layers.map((l) => (l.id === 'b' ? { ...l, stroke: 'url(#gradient-1)' } : l)) };
    d = applySolid(d, 'a', 'fill', '#000');
    expect(d.defs.gradients).toHaveLength(1);
  });

  it('adds, moves (re-sorting), recolours and removes stops', () => {
    let d = applyGradient(two(), 'a', 'fill', 'linear');
    d = addStop(d, 'gradient-1', 0.25);
    expect(d.defs.gradients[0].stops.map((s) => s.offset)).toEqual([0, 0.25, 1]);
    d = setStop(d, 'gradient-1', 1, { offset: 0.9, color: '#123456' });
    expect(d.defs.gradients[0].stops.map((s) => [s.offset, s.color])).toEqual([
      [0, '#ff0000'],
      [0.9, '#123456'],
      [1, '#0a0b0d'],
    ]);
    d = removeStop(d, 'gradient-1', 1);
    expect(d.defs.gradients[0].stops).toHaveLength(2);
    expect(removeStop(d, 'gradient-1', 0)).toBe(d); // never fewer than two
  });

  it('sets the angle through the endpoints', () => {
    const d = setGradientAngle(applyGradient(two(), 'a', 'fill', 'linear'), 'gradient-1', 90);
    const g = d.defs.gradients[0] as LinearGradient;
    expect(linearAngle(g)).toBe(90);
    expect(g).toMatchObject({ x1: 0.5, y1: 0, x2: 0.5, y2: 1 });
  });

  it('round-trips an edited gradient through SVG', () => {
    const d = valid(addStop(applyGradient(two(), 'a', 'fill', 'radial'), 'gradient-1', 0.5));
    const svg = serializeSvg(d);
    expect(serializeSvg(parseSvg(svg).doc)).toBe(svg);
  });

  it('reads the solid colour behind a paint', () => {
    expect(solidOf('#fff')).toBe('#fff');
    expect(solidOf('url(#g) red')).toBe('red');
    expect(solidOf('url(#g)')).toBeUndefined();
  });
});

describe('masks and clip paths', () => {
  it('makes the upper layer the mask of the lower one, in the target space', () => {
    const before = apply(localToDocMatrix(two().layers, 'b'), { x: 50, y: 50 });
    const d = valid(makeMask(two(), 'b', 'a', 'mask'));
    expect(d.layers.map((l) => l.id)).toEqual(['a']);
    expect(findLayer(d.layers, 'a')).toMatchObject({ mask: 'mask-1' });
    expect(d.defs.masks).toHaveLength(1);
    const moved = d.defs.masks[0].layers[0];
    expect(moved.id).toBe('b');
    // a has no transform, so mask content stays where it was on canvas.
    const after = apply(transformToMatrix(moved.type !== 'raw' ? moved.transform : undefined), { x: 50, y: 50 });
    expect(after).toEqual(before);
  });

  it('makes a clip path and releases it back into the tree', () => {
    let d = valid(makeMask(two(), 'b', 'a', 'clip'));
    expect(findLayer(d.layers, 'a')).toMatchObject({ clipPath: 'clip-1' });
    expect(d.defs.clipPaths[0].layers[0].id).toBe('b');
    d = valid(releaseMask(d, 'a', 'clip'));
    expect(d.defs.clipPaths).toEqual([]);
    expect(d.layers.map((l) => l.id)).toEqual(['a', 'b']);
    expect(findLayer(d.layers, 'a')).not.toHaveProperty('clipPath');
  });

  it('refuses a group as a clip path and self-masking', () => {
    const g = doc([
      { type: 'rect', id: 'a', x: 0, y: 0, width: 1, height: 1 },
      { type: 'group', id: 'g', children: [] },
    ]);
    expect(makeMask(g, 'g', 'a', 'clip')).toBe(g);
    expect(makeMask(g, 'a', 'a', 'mask')).toBe(g);
  });

  it('round-trips a created mask through SVG', () => {
    const d = valid(makeMask(two(), 'b', 'a', 'mask'));
    const svg = serializeSvg(d);
    expect(svg).toContain('<mask id="mask-1">');
    expect(svg).toContain('mask="url(#mask-1)"');
    expect(serializeSvg(parseSvg(svg).doc)).toBe(svg);
  });
});
