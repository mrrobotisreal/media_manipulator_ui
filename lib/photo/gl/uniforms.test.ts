import { describe, expect, it } from 'vitest';

import { LAYER_PARAMS, newPhotoDoc, type AdjustmentLayer, type LayerType } from '@/lib/photo/photoTypes';
import { fitTextureSize, defineFor, isGpuLayer, packCurveTexture, packLayerUniforms, planGpuLayers, GPU_LAYER_TYPES } from './uniforms';
import { FRAG_SRC } from './shaders/adjustSource';
import { computeHistogram } from './histogram';
import { cpuPreviewSize, renderCpuPreview } from './cpuPreview';
import { GOLDEN_IMAGES, goldenDocs, goldenPath, readImage } from '@/lib/photo/goldens';
import { readFileSync } from 'node:fs';
import { PNG } from 'pngjs';
import { renderDocCPU, toBytes } from '@/lib/photo/colorMath';

const layer = (type: LayerType, params: Record<string, unknown> = {}, extra: Record<string, unknown> = {}) =>
  ({ id: type, enabled: true, opacity: 1, blend: 'normal', mask: null, type, params: (LAYER_PARAMS[type] as { parse(v: unknown): unknown }).parse(params), ...extra }) as AdjustmentLayer;

describe('program / define selection', () => {
  it('maps every GPU layer type to a #define the shader source uses', () => {
    for (const t of GPU_LAYER_TYPES) {
      expect(defineFor(t)).toBe(`T_${t.toUpperCase()}`);
      expect(FRAG_SRC).toContain(`#ifdef ${defineFor(t)}`);
    }
    expect(FRAG_SRC).toContain('#ifdef T_COPY');
  });
  it('skips disabled and transparent layers; detail layers are planned too (MM99)', () => {
    const layers = [layer('invert'), layer('exposure', {}, { enabled: false }), layer('gamma', {}, { opacity: 0 }), layer('sharpen')];
    expect(planGpuLayers(layers).map((l) => l.type)).toEqual(['invert', 'sharpen']);
    expect(isGpuLayer('sharpen')).toBe(true);
    expect(isGpuLayer('lens')).toBe(false);
  });
});

describe('uniform packing', () => {
  it('packs hsl: master slot 0, six ranges in slots 1..12, count in n', () => {
    const l = layer('hsl', {
      master: { hue: 7, saturation: -8, lightness: 9 },
      ranges: [
        { id: 'reds', center: 0, saturation: 0 },
        { id: 'blues', center: 240, width: 40, feather: 20, hue: 15, saturation: -100, lightness: 30 },
      ],
    });
    const p = packLayerUniforms(l);
    expect(p.define).toBe('T_HSL');
    expect(p.n).toBe(2);
    expect(Array.from(p.slots.slice(0, 3))).toEqual([7, -8, 9]);
    expect(Array.from(p.slots.slice(4 * 3, 4 * 3 + 4))).toEqual([240, 40, 20, 15]); // range 1, slot 3
    expect(Array.from(p.slots.slice(4 * 4, 4 * 4 + 2))).toEqual([-100, 30]);
  });
  it('packs hsl with a custom 7th range (six defaults + eyedropper)', () => {
    const base = LAYER_PARAMS.hsl.parse({}) as { ranges: unknown[] };
    const l = layer('hsl', { ranges: [...base.ranges, { id: 'eye', center: 210, width: 20, feather: 20, hue: -12, saturation: 5, lightness: -8 }] });
    const p = packLayerUniforms(l);
    expect(p.n).toBe(7);
    expect(Array.from(p.slots.slice(4 * 13, 4 * 13 + 4))).toEqual([210, 20, 20, -12]);
  });
  it('packs levels as (inBlack,inWhite,gamma | outBlack,outWhite) per channel, master first', () => {
    const p = packLayerUniforms(layer('levels', { r: { inBlack: 0.1, gamma: 2 }, master: { outWhite: 0.9 } }));
    expect(Array.from(p.slots.slice(0, 3))).toEqual([0, 1, 1]);
    expect(p.slots[4 + 1]).toBeCloseTo(0.9, 6);
    expect(p.slots[2 * 4]).toBeCloseTo(0.1, 6);
    expect(p.slots[2 * 4 + 2]).toBe(2);
  });
  it('packs blend and opacity', () => {
    const p = packLayerUniforms(layer('invert', {}, { blend: 'color', opacity: 0.25 }));
    expect([p.blend, p.opacity]).toEqual([2, 0.25]);
  });
  it('packs the curve LUT texture as r,g,b,master texels', () => {
    const l = layer('curves', { master: { points: [{ x: 0, y: 0.5 }, { x: 1, y: 1 }] } }) as Extract<AdjustmentLayer, { type: 'curves' }>;
    const t = packCurveTexture(l.params);
    expect(t).toHaveLength(256 * 4);
    expect(t[0 * 4 + 3]).toBeCloseTo(0.5, 6); // master at x=0
    expect(t[255 * 4 + 3]).toBeCloseTo(1, 6);
    expect(t[128 * 4]).toBeCloseTo(128 / 255, 5); // identity red
  });
  it('caps texture size at 24 MP and keeps aspect', () => {
    expect(fitTextureSize(4000, 3000)).toEqual({ width: 4000, height: 3000, scale: 1 });
    const f = fitTextureSize(8000, 6000);
    expect(f.width * f.height).toBeLessThanOrEqual(24_000_000);
    expect(f.width / f.height).toBeCloseTo(8000 / 6000, 2);
  });
});

describe('histogram', () => {
  it('counts channels and skips transparent pixels', () => {
    const h = computeHistogram(new Uint8Array([255, 0, 0, 255, 0, 255, 0, 255, 9, 9, 9, 0]));
    expect(h.r[255]).toBe(1);
    expect(h.g[255]).toBe(1);
    expect(h.r[9]).toBe(0);
    expect(h.luma[Math.round(0.2126 * 255)]).toBe(1);
  });
});

describe('CPU fallback', () => {
  it('downsizes above 1 MP', () => {
    const s = cpuPreviewSize(4000, 3000);
    expect(s.width * s.height).toBeLessThanOrEqual(1_000_000);
  });
  it('renders the fixture docs to the same bytes as renderDocCPU / the goldens', () => {
    const { name, doc } = goldenDocs().find((d) => d.name === 'rung1-all-layers')!;
    const img = GOLDEN_IMAGES[0];
    const src = readImage(img);
    const bytes = PNG.sync.read(readFileSync(`${__dirname}/../fixtures/images/${img}.png`)).data;
    const out = renderCpuPreview(doc, src.width, src.height, bytes);
    expect(Buffer.compare(Buffer.from(out), Buffer.from(toBytes(renderDocCPU(doc, src))))).toBe(0);
    const golden = PNG.sync.read(readFileSync(goldenPath(name, img)));
    expect(Buffer.compare(Buffer.from(out), golden.data)).toBe(0);
  });
  it('empty doc is the identity', () => {
    const doc = newPhotoDoc(1, 1);
    expect(Array.from(renderCpuPreview(doc, 1, 1, [10, 20, 30, 255]))).toEqual([10, 20, 30, 255]);
  });
});
