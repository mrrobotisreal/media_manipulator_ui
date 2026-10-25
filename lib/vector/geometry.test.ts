import { describe, expect, it } from 'vitest';

import {
  apply,
  decomposeMatrix,
  handleScaleFactors,
  rotateAboutAnchor,
  rotateAboutPoint,
  scaleAboutLocalPoint,
  setAnchor,
  snapMove,
  transformFromAttr,
  transformToAttr,
  transformToMatrix,
} from './geometry';
import { anchorDocPoint, rotateLayers, scaleLayersDoc, setLayerAnchorDoc } from './transformOps';
import { parseVectorDoc, type VectorDoc, type VectorTransform } from './vectorTypes';

const T = (over: Partial<VectorTransform> = {}): VectorTransform => ({
  x: 0, y: 0, scaleX: 1, scaleY: 1, rotation: 0, skewX: 0, skewY: 0, anchorX: 0, anchorY: 0, ...over,
});
const close = (p: { x: number; y: number }, q: { x: number; y: number }) => {
  expect(p.x).toBeCloseTo(q.x, 6);
  expect(p.y).toBeCloseTo(q.y, 6);
};

describe('transform maths', () => {
  it('rotates about the anchor: the anchor stays put', () => {
    const t = T({ anchorX: 5, anchorY: 5 });
    const r = rotateAboutAnchor(t, 90);
    close(apply(transformToMatrix(r), { x: 5, y: 5 }), { x: 5, y: 5 });
    close(apply(transformToMatrix(r), { x: 10, y: 5 }), { x: 5, y: 10 });
  });

  it('rotates about an arbitrary point', () => {
    const r = rotateAboutPoint(T(), 180, { x: 10, y: 0 });
    close(apply(transformToMatrix(r), { x: 0, y: 0 }), { x: 20, y: 0 });
    expect(r.rotation).toBe(180);
  });

  it('moves the anchor without moving the layer', () => {
    const t = T({ x: 3, y: 4, rotation: 30, scaleX: 2 });
    const m0 = transformToMatrix(t);
    const m1 = transformToMatrix(setAnchor(t, { x: 7, y: -2 }));
    for (const p of [{ x: 0, y: 0 }, { x: 10, y: 3 }]) close(apply(m1, p), apply(m0, p));
  });

  it('scales uniformly with shift and keeps the fixed corner', () => {
    const box = { x: 0, y: 0, width: 10, height: 20 };
    const { fx, fy, fixed } = handleScaleFactors(box, 'se', { x: 30, y: 25 }, true);
    expect(fx).toBe(3);
    expect(fy).toBe(3);
    expect(fixed).toEqual({ x: 0, y: 0 });
    const r = scaleAboutLocalPoint(T({ rotation: 45 }), fx, fy, fixed);
    close(apply(transformToMatrix(r), fixed), apply(transformToMatrix(T({ rotation: 45 })), fixed));
    expect(r.scaleX).toBe(3);
    expect(r.scaleY).toBe(3);
  });

  it('non-uniform edge handles drive one axis about the opposite edge', () => {
    const box = { x: 0, y: 0, width: 10, height: 10 };
    const e = handleScaleFactors(box, 'e', { x: 20, y: 99 }, false);
    expect(e).toMatchObject({ fx: 2, fy: 1, fixed: { x: 0, y: 5 } });
    const n = handleScaleFactors(box, 'n', { x: 0, y: -10 }, true);
    expect(n).toMatchObject({ fx: 2, fy: 2 });
  });

  it('decomposes and recomposes arbitrary matrices', () => {
    const m = [1.2, 0.5, -0.3, 0.9, 10, -4] as const;
    const back = transformToMatrix(decomposeMatrix(m));
    for (let i = 0; i < 6; i++) expect(back[i]).toBeCloseTo(m[i], 2);
  });

  it('writes and reads the canonical transform form exactly', () => {
    const t = T({ x: 5, y: -2, rotation: 30, scaleX: 2, scaleY: 0.5, skewX: 10, anchorX: 8, anchorY: 4 });
    const text = transformToAttr(t)!;
    expect(text).toBe('translate(13 2) rotate(30) skewX(10) scale(2 0.5) translate(-8 -4)');
    expect(transformFromAttr(text)).toEqual(t);
    expect(transformToAttr(T())).toBeNull();
    expect(transformToAttr(T({ x: 1 }))).toBe('translate(1 0)');
  });

  it('snaps to the canvas edges and centre within the threshold', () => {
    const box = { x: 0, y: 0, width: 10, height: 10 };
    const r = snapMove(box, 250, 3, { width: 512, height: 512 }, 6);
    expect(r.dx).toBe(251); // centre 5+251 = 256
    expect(r.dy).toBe(0); // top edge onto 0
    expect(r.guides).toEqual({ x: 256, y: 0 });
    expect(snapMove(box, 100, 100, { width: 512, height: 512 }, 6).guides).toEqual({ x: undefined, y: undefined });
  });
});

describe('document transform ops', () => {
  const doc = (): VectorDoc => {
    const r = parseVectorDoc({
      version: 1,
      layers: [
        { type: 'rect', id: 'a', x: 0, y: 0, width: 10, height: 10 },
        { type: 'rect', id: 'b', x: 20, y: 0, width: 10, height: 10 },
      ],
    });
    if (!r.ok) throw new Error(r.error);
    return r.doc;
  };

  it('rotates a single layer about its centre', () => {
    const d = rotateLayers(doc(), ['a'], 90);
    close(anchorDocPoint(d, 'a')!, { x: 5, y: 5 });
  });

  it('rotates a multi-selection about the shared centre', () => {
    const d = rotateLayers(doc(), ['a', 'b'], 180);
    // a's centre (5,5) orbits the selection centre (15,5) to (25,5).
    const a = d.layers[0];
    const m = transformToMatrix(a.type === 'rect' ? a.transform : undefined);
    close(apply(m, { x: 5, y: 5 }), { x: 25, y: 5 });
  });

  it('scales a multi-selection about a document pivot', () => {
    const d = scaleLayersDoc(doc(), ['a', 'b'], 2, 2, { x: 0, y: 0 });
    const b = d.layers[1];
    const m = transformToMatrix(b.type === 'rect' ? b.transform : undefined);
    close(apply(m, { x: 20, y: 0 }), { x: 40, y: 0 });
  });

  it('sets the anchor from a document point', () => {
    const d = setLayerAnchorDoc(doc(), 'b', { x: 30, y: 10 });
    close(anchorDocPoint(d, 'b')!, { x: 30, y: 10 });
  });
});
