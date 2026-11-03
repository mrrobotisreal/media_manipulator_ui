import { describe, expect, it } from 'vitest';

import {
  applyGeometryCPU,
  autoCropRect,
  blurMask,
  colorRangeValue,
  featherSigma,
  finishMask,
  foldMask,
  gaussianTaps,
  geometryOutputSize,
  geometrySourcePoint,
  gradientValue,
  luminosityValue,
  planGeometry,
  radialValue,
  renderDocCPU,
  renderMaskCPU,
  resolveLayerMask,
  rgbToLab,
  sampleAlpha,
  unitSquareToQuad,
  type FloatImage,
} from './colorMath';
import { canonicalPhotoDoc, geometrySchema, maskSchema, newPhotoDoc, parsePhotoDoc, type MaskComponent } from './photoTypes';

const comp = <K extends MaskComponent['kind']>(c: Record<string, unknown> & { kind: K }) => maskSchema.parse({ components: [c] }).components[0] as Extract<MaskComponent, { kind: K }>;
const geo = (g: Record<string, unknown>) => geometrySchema.parse(g);

/** An image whose pixel (x, y) has r = x/255, g = y/255, b = 0, a = 1. */
function ramp(w: number, h: number): FloatImage {
  const data = new Float32Array(w * h * 4);
  for (let y = 0; y < h; y += 1) for (let x = 0; x < w; x += 1) data.set([x / 255, y / 255, 0, 1], (y * w + x) * 4);
  return { width: w, height: h, data };
}
const px = (img: FloatImage, x: number, y: number) => Array.from(img.data.slice((y * img.width + x) * 4, (y * img.width + x) * 4 + 4));

describe('mask fold', () => {
  it('add = max, subtract = min(m, 1-c), intersect = min, left to right', () => {
    expect(foldMask([{ mode: 'add', value: 0.4 }, { mode: 'add', value: 0.7 }])).toBe(0.7);
    expect(foldMask([{ mode: 'add', value: 1 }, { mode: 'subtract', value: 0.25 }])).toBe(0.75);
    expect(foldMask([{ mode: 'add', value: 0.9 }, { mode: 'intersect', value: 0.3 }])).toBe(0.3);
    expect(foldMask([{ mode: 'subtract', value: 0 }])).toBe(0); // starts at 0
    expect(foldMask([{ mode: 'add', value: 0.8 }, { mode: 'subtract', value: 0.5 }, { mode: 'add', value: 0.6 }])).toBe(0.6);
  });
  it('invert then opacity', () => {
    expect(finishMask(0.25, true, 0.5)).toBeCloseTo(0.375, 9);
    expect(finishMask(1, false, 0)).toBe(0);
  });
});

describe('mask component values at known points', () => {
  it('gradient is 0 at from, 1 at to, 0.5 midway (smoothstep), feather widens', () => {
    const g = comp({ kind: 'gradient', from: { x: 0, y: 0.2 }, to: { x: 0, y: 0.8 } });
    expect(gradientValue(g, 50, 20, 100, 100)).toBe(0);
    expect(gradientValue(g, 50, 80, 100, 100)).toBe(1);
    expect(gradientValue(g, 7, 50, 100, 100)).toBeCloseTo(0.5, 9);
    const f = comp({ kind: 'gradient', from: { x: 0, y: 0.2 }, to: { x: 0, y: 0.8 }, feather: 0.5 });
    // t = 0, smoothstep(-0.5, 1.5, 0) = x = 0.25 -> 0.25^2 (3 - 2*0.25)
    expect(gradientValue(f, 0, 20, 100, 100)).toBeCloseTo(0.0625 * 2.5, 9);
  });
  it('degenerate gradient is 0', () => {
    expect(gradientValue(comp({ kind: 'gradient', from: { x: 0.5, y: 0.5 }, to: { x: 0.5, y: 0.5 } }), 3, 3, 10, 10)).toBe(0);
  });
  it('radial: 1 inside 1-feather, 0.5 midway, 0 at the rim; rotate maps axes', () => {
    const r = comp({ kind: 'radial', center: { x: 0.5, y: 0.5 }, rx: 0.25, ry: 0.25, feather: 0.5 });
    expect(radialValue(r, 50, 50, 100, 100)).toBe(1);
    expect(radialValue(r, 50 + 25 * 0.5, 50, 100, 100)).toBe(1);
    expect(radialValue(r, 50 + 25 * 0.75, 50, 100, 100)).toBeCloseTo(0.5, 9);
    expect(radialValue(r, 75, 50, 100, 100)).toBe(0);
    const e = comp({ kind: 'radial', center: { x: 0.5, y: 0.5 }, rx: 0.4, ry: 0.1, feather: 0, rotate: 90 });
    expect(radialValue(e, 50, 50 + 39, 100, 100)).toBe(1); // long axis now vertical (clockwise 90)
    expect(radialValue(e, 50 + 39, 50, 100, 100)).toBe(0);
  });
  it('luminosity window', () => {
    const l = comp({ kind: 'luminosity', lo: 0.4, hi: 0.8, feather: 0.2 });
    expect(luminosityValue(l, 0.5)).toBe(1);
    expect(luminosityValue(l, 0.3)).toBeCloseTo(0.5, 9);
    expect(luminosityValue(l, 0.9)).toBeCloseTo(0.5, 9);
    expect(luminosityValue(l, 0.1)).toBe(0);
    expect(luminosityValue(l, 1)).toBe(0);
  });
  it('colour range ΔE: identical colour = 1, 0.75·R away = 0.5, beyond R = 0, max over targets, none = 0', () => {
    const src: [number, number, number] = [0.8, 0.2, 0.2];
    const a = rgbToLab(src);
    const b = rgbToLab([51 / 255, 102 / 255, 230 / 255]);
    const de = Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
    expect(colorRangeValue(comp({ kind: 'colorRange', colors: [{ r: 204, g: 51, b: 51 }], fuzziness: 40 }), src)).toBe(1);
    const fuzz = (de / 0.75 / 60) * 100;
    const mid = comp({ kind: 'colorRange', colors: [{ r: 51, g: 102, b: 230 }], fuzziness: fuzz });
    expect(colorRangeValue({ ...mid, fuzziness: fuzz }, src)).toBeCloseTo(0.5, 6);
    expect(colorRangeValue(comp({ kind: 'colorRange', colors: [{ r: 51, g: 102, b: 230 }], fuzziness: 5 }), src)).toBe(0);
    const two = comp({ kind: 'colorRange', colors: [{ r: 51, g: 102, b: 230 }, { r: 204, g: 51, b: 51 }], fuzziness: 5 });
    expect(colorRangeValue(two, src)).toBe(1);
    expect(colorRangeValue(comp({ kind: 'colorRange', colors: [], fuzziness: 100 }), src)).toBe(0);
  });
  it('alpha sampler is bilinear with centred texels and edge clamp', () => {
    const img = { width: 2, height: 1, alpha: [0, 255] };
    expect(sampleAlpha(img, 0.25, 0.5)).toBe(0);
    expect(sampleAlpha(img, 0.75, 0.5)).toBe(1);
    expect(sampleAlpha(img, 0.5, 0.5)).toBeCloseTo(0.5, 9);
    expect(sampleAlpha(img, 0, 0.5)).toBe(0);
  });
});

describe('feather', () => {
  it('σ = feather/100 · 0.05 · longSide', () => {
    expect(featherSigma(100, 200, 100)).toBeCloseTo(10, 9);
    expect(featherSigma(20, 100, 400)).toBeCloseTo(4, 9);
    expect(featherSigma(0, 100, 100)).toBe(0);
  });
  it('taps are normalised and symmetric; a step blurs to 0.5 at the edge; constants survive', () => {
    const t = gaussianTaps(2);
    expect(t.length).toBe(13);
    expect(Array.from(t).reduce((a, b) => a + b, 0)).toBeCloseTo(1, 6);
    expect(t[0]).toBeCloseTo(t[12], 9);
    const w = 41;
    const step = new Float32Array(w);
    step.fill(1, 20);
    const b = blurMask(step, w, 1, 2);
    expect(b[19] + b[20]).toBeCloseTo(1, 4);
    expect(b[0]).toBeCloseTo(0, 4);
    expect(b[40]).toBeCloseTo(1, 4);
    expect(blurMask(new Float32Array(25).fill(0.3), 5, 5, 3).every((v) => Math.abs(v - 0.3) < 1e-6)).toBe(true);
  });
});

describe('renderMaskCPU / renderDocCPU with masks', () => {
  it('order is fold, feather, invert, opacity; a missing asset component is skipped', () => {
    const img = ramp(8, 8);
    const m = maskSchema.parse({
      invert: true,
      opacity: 0.5,
      components: [{ kind: 'radial', center: { x: 0.5, y: 0.5 }, rx: 5, ry: 5, feather: 0 }, { kind: 'brush', mode: 'subtract', png: 'data:image/png;base64,AAAA', width: 1, height: 1 }],
    });
    const out = renderMaskCPU(m, img);
    expect(out.every((v) => v === 0)).toBe(true); // 1 -> invert 0 -> * 0.5
    expect(renderMaskCPU({ ...m, invert: false }, img).every((v) => v === 0.5)).toBe(true);
  });
  it('a masked exposure only changes where the mask is 1 (lerp), and a named ref resolves', () => {
    const doc = parsePhotoDoc({
      version: 1,
      source: { width: 8, height: 8 },
      masks: { right: { components: [{ kind: 'gradient', from: { x: 0.5, y: 0 }, to: { x: 0.5001, y: 0 } }] } },
      layers: [{ id: 'e', type: 'exposure', params: { ev: 1 }, mask: { ref: 'right' } }],
    });
    expect(doc.ok).toBe(true);
    if (!doc.ok) return;
    expect(resolveLayerMask(doc.doc, doc.doc.layers[0])).not.toBeNull();
    const img = ramp(8, 8);
    const out = renderDocCPU(doc.doc, img);
    expect(px(out, 0, 3)).toEqual(px(img, 0, 3)); // left: mask 0
    expect(px(out, 7, 3)[0]).toBeGreaterThan(px(img, 7, 3)[0]); // right: brightened
  });
  it('red-eye: inside the mask r = min(r, (g+b)/2); outside untouched', () => {
    const data = new Float32Array([0.9, 0.2, 0.1, 1, 0.9, 0.2, 0.1, 1]);
    const parsed = parsePhotoDoc({
      version: 1,
      source: { width: 2, height: 1 },
      layers: [{ id: 'r', type: 'redEye', mask: { components: [{ kind: 'gradient', from: { x: 0.49, y: 0 }, to: { x: 0.5, y: 0 } }] } }],
    });
    if (!parsed.ok) throw new Error(parsed.error);
    const out = renderDocCPU(parsed.doc, { width: 2, height: 1, data });
    expect(px(out, 0, 0)[0]).toBeCloseTo(0.9, 6);
    expect(px(out, 1, 0)[0]).toBeCloseTo(0.15, 6);
  });
});

describe('geometry', () => {
  it('rotate 90 maps pixels exactly (clockwise) and swaps the canvas', () => {
    const img = ramp(4, 2);
    const out = applyGeometryCPU(img, geo({ rotate: 90 }));
    expect([out.width, out.height]).toEqual([2, 4]);
    for (let j = 0; j < 4; j += 1) for (let i = 0; i < 2; i += 1) expect(px(out, i, j)).toEqual(px(img, j, 1 - i));
    const r180 = applyGeometryCPU(img, geo({ rotate: 180 }));
    expect(px(r180, 0, 0)).toEqual(px(img, 3, 1));
    const r270 = applyGeometryCPU(img, geo({ rotate: -90 }));
    expect(px(r270, 0, 0)).toEqual(px(img, 3, 0));
  });
  it('flips mirror about the centre; flipH then rotate 90 differs from rotate then flip order only as specified', () => {
    const img = ramp(4, 2);
    expect(px(applyGeometryCPU(img, geo({ flipH: true })), 0, 0)).toEqual(px(img, 3, 0));
    expect(px(applyGeometryCPU(img, geo({ flipV: true })), 0, 0)).toEqual(px(img, 0, 1));
    expect(px(applyGeometryCPU(img, geo({ flipH: true, flipV: true })), 0, 0)).toEqual(px(img, 3, 1));
  });
  it('identity geometry returns the same image; a zero-offset perspective is the identity resample', () => {
    const img = ramp(5, 3);
    expect(applyGeometryCPU(img, geo({}))).toBe(img);
    const p = applyGeometryCPU(img, geo({ perspective: {} }));
    expect(p.width).toBe(5);
    for (let i = 0; i < img.data.length; i += 1) expect(p.data[i]).toBeCloseTo(img.data[i], 5);
    expect(unitSquareToQuad([[0, 0], [1, 0], [1, 1], [0, 1]])).toEqual([1, 0, 0, 0, 1, 0, 0, 0]);
  });
  it('crop: offsets and size round, and the crop is in post-rotate space', () => {
    const img = ramp(10, 8);
    const out = applyGeometryCPU(img, geo({ crop: { x: 0.2, y: 0.25, width: 0.5, height: 0.5 } }));
    expect([out.width, out.height]).toEqual([5, 4]);
    expect(px(out, 0, 0)).toEqual(px(img, 2, 2));
    expect(geometryOutputSize(geo({ rotate: 90, crop: { x: 0, y: 0, width: 0.5, height: 1 } }), 10, 8)).toEqual({ width: 4, height: 10 });
  });
  it('arbitrary rotation grows the canvas and fills outside: transparent, colour, edge', () => {
    const img = ramp(20, 10);
    const t = applyGeometryCPU(img, geo({ rotate: 45 }));
    expect(t.width).toBe(Math.round((20 + 10) / Math.SQRT2));
    expect(px(t, 0, 0)).toEqual([0, 0, 0, 0]);
    const c = applyGeometryCPU(img, geo({ rotate: 45, fill: '#ff0000' }));
    expect(px(c, 0, 0)).toEqual([1, 0, 0, 1]);
    const e = applyGeometryCPU(img, geo({ rotate: 45, fill: 'edge' }));
    expect(px(e, 0, 0)[3]).toBe(1);
  });
  it('rotate maps the centre to the centre; plan reports sizes', () => {
    const p = planGeometry(geo({ rotate: 30 }), 100, 60);
    const [sx, sy] = geometrySourcePoint(p, p.wo / 2 - 0.5, p.ho / 2 - 0.5);
    expect(sx).toBeCloseTo(50, 6);
    expect(sy).toBeCloseTo(30, 6);
  });
  it('auto-crop gives a rectangle fully inside the rotated source; none needed at 0', () => {
    const g = geo({ rotate: 10 });
    const r = autoCropRect(g, 200, 100);
    expect(r.width).toBeLessThan(1);
    const p = planGeometry({ ...g, crop: r }, 200, 100);
    for (const [i, j] of [[0, 0], [p.wo - 1, 0], [0, p.ho - 1], [p.wo - 1, p.ho - 1]]) {
      const [sx, sy] = geometrySourcePoint(p, i, j);
      expect(sx).toBeGreaterThanOrEqual(-0.5);
      expect(sx).toBeLessThanOrEqual(200.5);
      expect(sy).toBeGreaterThanOrEqual(-0.5);
      expect(sy).toBeLessThanOrEqual(100.5);
    }
    expect(autoCropRect(geo({}), 200, 100)).toEqual({ x: 0, y: 0, width: 1, height: 1 });
  });
});

describe('doc canonical form with masks / heals', () => {
  it('empty masks canonicalise to absent; unknown refs are refused; heals need maskRef or baseRef', () => {
    const base = { version: 1, source: { width: 4, height: 4 } };
    const r = parsePhotoDoc({ ...base, masks: {} });
    expect(r.ok && canonicalPhotoDoc(r.doc).includes('"masks"')).toBe(false);
    expect(parsePhotoDoc({ ...base, layers: [{ id: 'a', type: 'invert', mask: { ref: 'nope' } }] }).ok).toBe(false);
    expect(parsePhotoDoc({ ...base, heals: [{ id: 'h' }] }).ok).toBe(false);
    expect(parsePhotoDoc({ ...base, heals: [{ id: 'h', baseRef: 'local:abc' }] }).ok).toBe(true);
    expect(parsePhotoDoc({ ...base, heals: [{ id: 'h', baseRef: 'elsewhere/x.png' }] }).ok).toBe(false);
    expect(newPhotoDoc(4, 4).masks).toBeUndefined();
  });
});
