import { describe, expect, it } from 'vitest';

import { BrushRaster, bakeBrush, brushRasterSize } from './brushEngine';
import {
  addColorTarget,
  addComponent,
  addLocalAdjustment,
  addRedEye,
  brushBudget,
  clearLayerMask,
  defaultComponent,
  editLayerMask,
  maskOfLayer,
  remapAlpha,
  remapParametricMasks,
  removeComponent,
  setBrushComponent,
  setMaskProps,
  shareLayerMask,
  updateComponent,
} from './maskOps';
import { canonicalPhotoDoc, parsePhotoDoc, type PhotoDoc } from './photoTypes';
import { ASPECT_PRESETS, aspectValue, dragCrop, fitAspectRect, movePerspectiveCorner, straightenAngle, straightenDelta, withAutoCrop } from './toolMath';
import { geometrySchema } from './photoTypes';
import { makeBrushPng } from './goldens';

const doc = (over: Record<string, unknown> = {}): PhotoDoc => {
  const r = parsePhotoDoc({ version: 1, source: { width: 400, height: 300 }, layers: [{ id: 'a', type: 'exposure', params: { ev: 1 } }], ...over });
  if (!r.ok) throw new Error(r.error);
  return r.doc;
};

describe('mask edits', () => {
  it('adds, updates, removes components and edits mask props; stays canonical-parseable', () => {
    let d = addComponent(doc(), 'a', defaultComponent('radial'));
    d = addComponent(d, 'a', defaultComponent('gradient'));
    expect(maskOfLayer(d, 'a')!.components.map((c) => c.kind)).toEqual(['radial', 'gradient']);
    d = updateComponent(d, 'a', 1, { mode: 'subtract' });
    expect(maskOfLayer(d, 'a')!.components[1].mode).toBe('subtract');
    d = setMaskProps(d, 'a', { feather: 12, invert: true, opacity: 0.5 });
    expect(maskOfLayer(d, 'a')).toMatchObject({ feather: 12, invert: true, opacity: 0.5 });
    d = removeComponent(d, 'a', 0);
    expect(maskOfLayer(d, 'a')!.components).toHaveLength(1);
    expect(parsePhotoDoc(canonicalPhotoDoc(d)).ok).toBe(true);
  });
  it('caps components at 16', () => {
    let d = doc();
    for (let i = 0; i < 20; i += 1) d = addComponent(d, 'a', defaultComponent('radial'));
    expect(maskOfLayer(d, 'a')!.components).toHaveLength(16);
  });
  it('colour targets: plain click replaces, shift adds, 8 max', () => {
    let d = addComponent(doc(), 'a', defaultComponent('colorRange'));
    d = addColorTarget(d, 'a', 0, { r: 1, g: 2, b: 3 }, false);
    for (let i = 0; i < 10; i += 1) d = addColorTarget(d, 'a', 0, { r: i, g: 0, b: 0 }, true);
    const c = maskOfLayer(d, 'a')!.components[0];
    expect(c.kind === 'colorRange' && c.colors.length).toBe(8);
    d = addColorTarget(d, 'a', 0, { r: 9, g: 9, b: 9 }, false);
    const c2 = maskOfLayer(d, 'a')!.components[0];
    expect(c2.kind === 'colorRange' && c2.colors).toEqual([{ r: 9, g: 9, b: 9 }]);
  });
  it('local adjustment: localBasic makes three layers sharing one named mask; edits go through the ref', () => {
    const { doc: d0, layerIds } = addLocalAdjustment(doc(), 'localBasic');
    expect(layerIds).toHaveLength(3);
    const refs = d0.layers.filter((l) => layerIds.includes(l.id)).map((l) => (l.mask as { ref: string }).ref);
    expect(new Set(refs).size).toBe(1);
    expect(Object.keys(d0.masks ?? {})).toEqual([refs[0]]);
    const d1 = addComponent(d0, layerIds[1], defaultComponent('radial'));
    expect(d1.masks![refs[0]].components).toHaveLength(1);
    expect(maskOfLayer(d1, layerIds[2])!.components).toHaveLength(1);
    expect(parsePhotoDoc(canonicalPhotoDoc(d1)).ok).toBe(true);
    // clearing one layer's mask keeps the named mask while others use it; clearing all prunes it
    let d2 = clearLayerMask(d1, layerIds[0]);
    expect(d2.masks).toBeDefined();
    d2 = clearLayerMask(clearLayerMask(d2, layerIds[1]), layerIds[2]);
    expect(d2.masks).toBeUndefined();
  });
  it('shareLayerMask moves an inline mask into doc.masks', () => {
    const d = addComponent(doc(), 'a', defaultComponent('radial'));
    const r = shareLayerMask(d, 'a');
    expect(r.ref).toBeTruthy();
    expect(r.doc.layers[0].mask).toEqual({ ref: r.ref });
    expect(r.doc.masks![r.ref as string].components).toHaveLength(1);
  });
  it('red-eye click: a redEye layer with a radial mask at the click, radius from the slider (default 2% of the long side)', () => {
    const { doc: d, layerId } = addRedEye(doc(), 0.25, 0.4, 0.02, 400, 300);
    const l = d.layers.find((x) => x.id === layerId)!;
    expect(l.type).toBe('redEye');
    const c = maskOfLayer(d, layerId)!.components[0];
    expect(c.kind === 'radial' && [c.center, c.rx, c.ry]).toEqual([{ x: 0.25, y: 0.4 }, 0.02, (0.02 * 400) / 300]);
  });
  it('editLayerMask returns the same doc when nothing changes', () => {
    const d = doc();
    expect(editLayerMask(d, 'zzz', (m) => m)).toBe(d);
  });
});

describe('brush engine', () => {
  it('stamps with hardness falloff, strokes interpolate, erase removes', () => {
    const r = new BrushRaster(40, 20);
    r.stamp(20, 10, 10, { hardness: 100, flow: 100, erase: false });
    expect(r.alpha[10 * 40 + 20]).toBeCloseTo(1, 5);
    expect(r.alpha[10 * 40 + 30]).toBe(0);
    const soft = new BrushRaster(40, 20);
    soft.stamp(20, 10, 20, { hardness: 0, flow: 100, erase: false });
    expect(soft.alpha[10 * 40 + 24]).toBeLessThan(soft.alpha[10 * 40 + 20]);
    const s = new BrushRaster(60, 10);
    s.stroke({ x: 5, y: 5 }, { x: 55, y: 5 }, 6, { hardness: 100, flow: 100, erase: false });
    expect(s.alpha[5 * 60 + 30]).toBe(1);
    s.stroke({ x: 25, y: 5 }, { x: 35, y: 5 }, 6, { hardness: 100, flow: 100, erase: true });
    expect(s.alpha[5 * 60 + 30]).toBeCloseTo(0, 5);
    const flow = new BrushRaster(10, 10);
    flow.stamp(5, 5, 8, { hardness: 100, flow: 25, erase: false });
    expect(flow.alpha[5 * 10 + 5]).toBeCloseTo(0.25, 5);
  });
  it('raster size caps the long side at 1024 and keeps aspect', () => {
    expect(brushRasterSize(4000, 3000)).toMatchObject({ width: 1024, height: 768 });
    expect(brushRasterSize(300, 200)).toMatchObject({ width: 300, height: 200 });
  });
  it('a brush stroke bakes a PNG <= 1024 px long side into the doc (fake encoder halves when too big)', async () => {
    const size = brushRasterSize(4000, 3000);
    const r = new BrushRaster(size.width, size.height);
    r.stroke({ x: 100, y: 100 }, { x: 600, y: 400 }, 40, { hardness: 50, flow: 100, erase: false });
    const sizes: number[] = [];
    const baked = await bakeBrush(r, async (_rgba, w, h) => {
      sizes.push(w);
      return `data:image/png;base64,${'A'.repeat(sizes.length === 1 ? 800_000 : 100)}`;
    });
    expect(sizes).toEqual([1024, 512]);
    expect(Math.max(baked.width, baked.height)).toBeLessThanOrEqual(1024);
    const d = setBrushComponent(doc(), 'a', makeBrushPng(4, 4, () => 1), 4, 4);
    expect(maskOfLayer(d, 'a')!.components[0].kind).toBe('brush');
    const d2 = setBrushComponent(d, 'a', makeBrushPng(4, 4, () => 0.5), 4, 4);
    expect(maskOfLayer(d2, 'a')!.components).toHaveLength(1); // replaced in place
    expect(brushBudget(d2).warn).toBe(false);
    expect(parsePhotoDoc(canonicalPhotoDoc(d2)).ok).toBe(true);
  });
});

describe('crop change re-maps masks', () => {
  it('a gradient/radial follows the picture content when the crop moves; a brush raster re-samples', () => {
    let d = addComponent(doc(), 'a', { ...defaultComponent('radial'), kind: 'radial', center: { x: 0.5, y: 0.5 }, rx: 0.2, ry: 0.2 } as never);
    const to = { x: 0.25, y: 0, width: 0.5, height: 1 };
    d = remapParametricMasks(d, null, to);
    const c = maskOfLayer(d, 'a')!.components[0];
    expect(c.kind === 'radial' && [c.center.x, c.center.y, c.rx, c.ry]).toEqual([0.5, 0.5, 0.4, 0.2]);
    // brush: a block at the old x 0.5..1 lands at the new x 0.5..1.5 -> only its left half remains
    const img = { width: 4, height: 1, alpha: [0, 0, 255, 255] };
    const out = remapAlpha(img, null, to, 4, 1);
    expect(Array.from(out.alpha)).toEqual([0, 64, 191, 255]); // bilinear re-sample of the zoomed-in half
    expect(out.alpha[0]).toBe(0);
    expect(out.alpha[3]).toBe(255);
    expect(remapParametricMasks(d, to, to)).toBe(d);
  });
});

describe('crop tool maths', () => {
  it('aspect presets give pixel aspects and the fitted rect has that aspect', () => {
    expect(ASPECT_PRESETS).toHaveLength(9);
    expect(aspectValue('16:9', 100, 100)).toBeCloseTo(16 / 9, 9);
    expect(aspectValue('original', 300, 200)).toBe(1.5);
    expect(aspectValue('free', 1, 1)).toBeNull();
    const r = fitAspectRect(16 / 9, 400, 300);
    expect((r.width * 400) / (r.height * 300)).toBeCloseTo(16 / 9, 9);
    expect(r.x).toBeCloseTo(0, 9);
  });
  it('dragging a corner with a locked aspect keeps the aspect and stays in the canvas; free moves edges', () => {
    const r0 = { x: 0.2, y: 0.2, width: 0.4, height: 0.3 };
    const out = dragCrop(r0, 'se', 0.2, 0.01, 400, 300, 1);
    expect((out.width * 400) / (out.height * 300)).toBeCloseTo(1, 6);
    expect(out.x).toBeCloseTo(0.2, 9);
    expect(out.x + out.width).toBeLessThanOrEqual(1 + 1e-9);
    const free = dragCrop(r0, 'e', 0.1, 0, 400, 300, null);
    expect(free).toEqual({ x: 0.2, y: 0.2, width: 0.5, height: 0.3 });
    const edge = dragCrop({ x: 0.1, y: 0.1, width: 0.5, height: 0.5 }, 's', 0, 0.2, 400, 400, 1);
    expect(edge.width).toBeCloseTo(edge.height, 6);
    const clamped = dragCrop(r0, 'move', 5, 5, 400, 300, null);
    expect(clamped.x + clamped.width).toBeCloseTo(1, 9);
  });
  it('straighten line -> angle: a line tilted 5 degrees clockwise rotates -5 counter-clockwise', () => {
    const a = (5 * Math.PI) / 180;
    expect(straightenDelta({ x: 0, y: 0 }, { x: Math.cos(a), y: Math.sin(a) })).toBeCloseTo(-5, 6);
    expect(straightenDelta({ x: 0, y: 0 }, { x: Math.cos(-a), y: Math.sin(-a) })).toBeCloseTo(5, 6);
    expect(straightenDelta({ x: 0, y: 0 }, { x: Math.sin(a), y: Math.cos(a) })).toBeCloseTo(5, 6); // a near-vertical line straightens too
    expect(straightenAngle(2, { x: 0, y: 0 }, { x: 1, y: 0 })).toBe(2);
  });
  it('perspective corners move and clamp; auto-crop toggles a crop inside the warp', () => {
    const p = movePerspectiveCorner(null, 'tl', 0.7, -0.7);
    expect(p.tl).toEqual({ x: 0.5, y: -0.5 });
    const g = geometrySchema.parse({ rotate: 8 });
    const c = withAutoCrop(g, 400, 300);
    expect(c.crop).not.toBeNull();
    expect(c.crop!.width).toBeLessThan(1);
    expect(withAutoCrop(geometrySchema.parse({}), 400, 300).crop).toBeNull();
  });
});
