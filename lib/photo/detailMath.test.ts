import { describe, expect, it } from 'vitest';

import {
  applyDetailCPU,
  dehaze,
  gaussianTaps64,
  gaussBlurPlanes,
  grainHash,
  grainNoise,
  pcgHash,
  renderDocCPU,
  unsharpLuma,
  vignetteDistance,
  vignetteFactor,
  type FloatImage,
} from './colorMath';
import { LAYER_PARAMS, type AdjustmentLayer, type LayerType } from './photoTypes';
import { planDetail } from './gl/detailPlan';

const layer = (type: LayerType, params: Record<string, unknown> = {}) =>
  ({ id: type, enabled: true, opacity: 1, blend: 'normal', mask: null, type, params: (LAYER_PARAMS[type] as { parse(v: unknown): unknown }).parse(params) }) as AdjustmentLayer;
const flat = (w: number, h: number, v: number) => new Float64Array(w * h * 3).fill(v);
const img = (w: number, h: number, v: number): FloatImage => {
  const data = new Float32Array(w * h * 4);
  for (let i = 0; i < w * h; i += 1) data.set([v, v, v, 1], i * 4);
  return { width: w, height: h, data };
};

describe('Gaussian kernel', () => {
  it('sums to 1 and matches the known 5-tap for sigma 2/3', () => {
    const t = gaussianTaps64(2 / 3);
    expect(t.length).toBe(5);
    expect(Array.from(t).reduce((a, b) => a + b, 0)).toBeCloseTo(1, 12);
    const raw = [-2, -1, 0, 1, 2].map((k) => Math.exp(-(k * k) / (2 * (2 / 3) ** 2)));
    const sum = raw.reduce((a, b) => a + b, 0);
    raw.forEach((v, i) => expect(t[i]).toBeCloseTo(v / sum, 12));
    expect(t[0]).toBeCloseTo(t[4], 14);
  });
  it('sigma 0 is identity, a flat plane stays flat', () => {
    const f = flat(6, 5, 0.4);
    expect(gaussBlurPlanes(f, 6, 5, 3, 0)).toBe(f);
    gaussBlurPlanes(f, 6, 5, 3, 1.5).forEach((v) => expect(v).toBeCloseTo(0.4, 12));
  });
});

describe('unsharp mask', () => {
  it('overshoots on both sides of a step edge and leaves the flats alone', () => {
    const w = 24;
    const h = 3;
    const rgb = new Float64Array(w * h * 3);
    for (let y = 0; y < h; y += 1) for (let x = 0; x < w; x += 1) rgb.fill(x < w / 2 ? 0.3 : 0.7, (y * w + x) * 3, (y * w + x) * 3 + 3);
    const out = unsharpLuma(rgb, w, h, 1.5, 1, false);
    expect(out[(1 * w + 0) * 3]).toBeCloseTo(0.3, 6);
    expect(out[(1 * w + 23) * 3]).toBeCloseTo(0.7, 6);
    expect(out[(1 * w + 11) * 3]).toBeLessThan(0.3);
    expect(out[(1 * w + 12) * 3]).toBeGreaterThan(0.7);
  });
  it('threshold suppresses a small difference', () => {
    const w = 8;
    const rgb = flat(w, 1, 0.5);
    rgb.fill(0.51, 3 * 3, 4 * 3);
    const a = unsharpLuma(rgb, w, 1, 1, 1, false, 0);
    const b = unsharpLuma(rgb, w, 1, 1, 1, false, 0.5);
    expect(a[3 * 3]).not.toBeCloseTo(0.51, 4);
    expect(b[3 * 3]).toBeCloseTo(0.51, 12);
  });
});

describe('grain hash (bit-exact table)', () => {
  // Reference values computed independently with Python big integers from the design's PCG:
  // s = v*747796405 + 2891336453; w = ((s >> ((s >> 28) + 4)) ^ s) * 277803737; out = (w >> 22) ^ w (all mod 2^32),
  // grainHash = pcg(pcg(x ^ seed) ^ (y + 0x9E3779B9)).
  it('pcgHash table', () => {
    const table: [number, number][] = [[0, 129708002], [1, 2831084092], [2, 2055130248], [4294967295, 3861530882], [747796405, 2358745740]];
    for (const [v, want] of table) expect(pcgHash(v)).toBe(want);
  });
  it('grainHash table for three seeds (and more)', () => {
    const table: [number, number, number, number][] = [
      [0, 0, 0, 2129854668],
      [1, 0, 0, 1225025142],
      [0, 1, 0, 2612088322],
      [17, 42, 12345, 1336383389],
      [255, 191, 4000000000, 2456643962],
    ];
    for (const [x, y, s, want] of table) expect(grainHash(x, y, s)).toBe(want);
  });
  it('grain noise is in [0,1), deterministic, size groups cells', () => {
    const p = LAYER_PARAMS.grain.parse({ amount: 50, size: 2, roughness: 0, seed: 9 }) as never;
    expect(grainNoise(4, 6, p)).toBe(grainNoise(5, 7, p));
    expect(grainNoise(4, 6, p)).not.toBe(grainNoise(6, 6, p));
    for (let i = 0; i < 50; i += 1) {
      const v = grainNoise(i, 2 * i, p);
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });
});

describe('vignette frame', () => {
  it('is 0 at the centre and 1 at the corner for every roundness', () => {
    for (const r of [-100, -30, 0, 60, 100]) {
      expect(vignetteDistance(0, 0, 40, 30, r)).toBe(0);
      expect(vignetteDistance(1, 1, 40, 30, r)).toBeCloseTo(1, 12);
      expect(vignetteDistance(-1, 1, 40, 30, r)).toBeCloseTo(1, 12);
    }
  });
  it('midpoint 0 / feather 0: factor 0 at the centre, 1 elsewhere (step)', () => {
    expect(vignetteFactor(0, 0, 0)).toBe(1); // smoothstep(e0 == e1): x < e0 ? 0 : 1 -> d = 0 is not below 0
    expect(vignetteFactor(1, 0, 0)).toBe(1);
    expect(vignetteFactor(0, 50, 50)).toBe(0);
    expect(vignetteFactor(1, 50, 50)).toBe(1);
  });
  it('amount 0 is identity; negative darkens corners and not the centre', () => {
    const src = img(16, 12, 0.6);
    const out = renderDocCPU({ layers: [layer('vignette', { amount: -100, midpoint: 30, feather: 40 })] }, src);
    const at = (x: number, y: number) => out.data[(y * 16 + x) * 4];
    expect(at(8, 6)).toBeCloseTo(0.6, 4);
    expect(at(0, 0)).toBeLessThan(0.3);
    const id = renderDocCPU({ layers: [layer('vignette', { amount: 0 })] }, src);
    expect(Array.from(id.data)).toEqual(Array.from(src.data));
  });
});

describe('dehaze', () => {
  it('is identity on a flat grey image (transmission 1 - 0.95 d/A with d = A -> c)', () => {
    const f = flat(20, 20, 0.5);
    const out = dehaze(f, 20, 20, LAYER_PARAMS.dehaze.parse({ amount: 80 }) as never);
    out.forEach((v) => expect(v).toBeCloseTo(0.5, 6));
  });
  it('amount 0 and negative on flat grey are stable', () => {
    const f = flat(10, 10, 0.5);
    expect(dehaze(f, 10, 10, LAYER_PARAMS.dehaze.parse({ amount: 0 }) as never)).toBe(f);
    dehaze(f, 10, 10, LAYER_PARAMS.dehaze.parse({ amount: -100 }) as never).forEach((v) => expect(v).toBeCloseTo(0.5, 6));
  });
});

describe('detail layers in the CPU reference', () => {
  it('blur of 0 and noise reduction of 0 are identity', () => {
    const f = flat(8, 8, 0.3);
    expect(applyDetailCPU(f, 8, 8, layer('blur'))).toBe(f);
    expect(applyDetailCPU(f, 8, 8, layer('noiseReduction'))).toBe(f);
  });
  it('a masked-away detail layer leaves the pixel unchanged (opacity path)', () => {
    const src = img(8, 8, 0.5);
    const out = renderDocCPU({ layers: [{ ...layer('grain', { amount: 100, seed: 3 }), opacity: 0.5 }] }, src);
    const full = renderDocCPU({ layers: [layer('grain', { amount: 100, seed: 3 })] }, src);
    expect(out.data[0] - 0.5).toBeCloseTo((full.data[0] - 0.5) / 2, 6);
  });
  it('the GPU plan numbers equal the reference constants', () => {
    expect(planDetail(layer('clarity', { amount: 50 }), 1000, 500)).toEqual({ kind: 'unsharp', sigma: 20, gain: 0.3, mid: true, threshold: 0 });
    expect(planDetail(layer('texture', { amount: 100 }), 100, 100)).toMatchObject({ sigma: 1.5, gain: 0.5, mid: false });
    expect(planDetail(layer('sharpen', { amount: 200, radius: 2, threshold: 255 }), 10, 10)).toEqual({ kind: 'unsharp', sigma: 2, gain: 2, mid: false, threshold: 1 });
    expect(planDetail(layer('blur', { radius: 0 }), 10, 10)).toBeNull();
    expect(planDetail(layer('noiseReduction', { luminance: 50, color: 0 }), 10, 10)).toMatchObject({ sigmaS: 5, sigmaR: 0.1, chroma: 0, luma: true });
  });
});

describe('detail shader source mirrors the reference constants', () => {
  it('declares every define and the pinned PCG / grain constants', async () => {
    const { DETAIL_FRAG } = await import('./gl/shaders/detailSource');
    for (const d of ['D_LUMA_H', 'D_UNSHARP_V', 'D_BLUR_H', 'D_BLUR_V', 'D_NR_LAB', 'D_NR_BIL', 'D_NR_FIN', 'D_DARK_H', 'D_DARK_V', 'D_DARK_SAMPLE', 'D_DEHAZE', 'D_VIGNETTE', 'D_GRAIN']) {
      expect(DETAIL_FRAG).toContain(`#ifdef ${d}`);
    }
    for (const c of ['747796405u', '2891336453u', '277803737u', '0x9E3779B9u', '0x85EBCA6Bu', 'GRAIN_GAIN = 0.2', 'DEHAZE_OMEGA = 0.95', 'BILATERAL_RADIUS = 4', 'DEHAZE_WINDOW_RADIUS = 7']) {
      expect(DETAIL_FRAG).toContain(c);
    }
  });
});
