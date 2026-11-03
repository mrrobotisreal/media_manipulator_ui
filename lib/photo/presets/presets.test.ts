import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

import { fromBytes, renderDocCPU, toBytes } from '@/lib/photo/colorMath';
import { readImage } from '@/lib/photo/goldens';
import enPanels from '@/i18n/locales/en-us/interface/panels.json';
import { newPhotoDoc } from '@/lib/photo/photoTypes';
import { AUTO_HIGH_PERCENTILE, AUTO_LOW_PERCENTILE, computeAutoPreset, histogramPercentile } from './autoPreset';
import { PRESET_CATEGORIES, appendPreset, parsePresetLayers, presetById } from './index';
import { ThumbCache, downscaleBytes, renderPresetThumb } from './thumbs';
import { computeHistogram } from '@/lib/photo/gl/histogram';

const dir = join(__dirname, 'builtin');
const files = readdirSync(dir).filter((f) => f.endsWith('.json'));
const get = (o: unknown, path: string) => path.split('.').reduce<unknown>((n, k) => (n as Record<string, unknown>)?.[k], o);

describe('built-in presets', () => {
  it('ships the ticket list (18 JSON files + computed auto)', () => {
    expect(files).toHaveLength(18);
    for (const id of ['color-pop-red', 'color-pop-yellow', 'color-pop-green', 'color-pop-cyan', 'color-pop-blue', 'color-pop-magenta', 'bw-film', 'bw-high-contrast', 'warm', 'cool', 'matte', 'fade', 'vivid', 'punch', 'cross-process', 'vintage', 'portrait-soften', 'landscape', 'auto']) {
      expect(presetById(id), id).toBeDefined();
    }
  });

  it.each(files.map((f) => [f]))('%s parses through photoTypes, prefixes ids and names a translated preset', (f) => {
    const json = JSON.parse(readFileSync(join(dir, f), 'utf8'));
    expect(f).toBe(`${json.id}.json`);
    expect(PRESET_CATEGORIES).toContain(json.category);
    expect(json.nameKey).toBe(`photo.presets.name.${json.id}`);
    expect(typeof get(enPanels, json.nameKey.replace(/^/, ''))).toBe('string');
    const layers = parsePresetLayers(json.layers);
    expect(layers, 'every layer parses').not.toBeNull();
    expect((layers ?? []).length).toBeGreaterThan(0);
    for (const l of json.layers) expect(l.id.startsWith(`preset-${json.id}-`)).toBe(true);
    // the whole preset also passes as a document
    const doc = appendPreset(newPhotoDoc(10, 10), json.id, layers ?? [], 'Preset: x');
    expect(doc.layers).toHaveLength(json.layers.length);
  });

  it('colour pop: the other five ranges are -100 saturation and the kept one +10', () => {
    const l = parsePresetLayers(presetById('color-pop-blue')!.layers)![0];
    if (l.type !== 'hsl') throw new Error('hsl');
    const by = Object.fromEntries(l.params.ranges.map((r) => [r.id, r.saturation]));
    expect(by).toEqual({ reds: -100, yellows: -100, greens: -100, cyans: -100, blues: 10, magentas: -100 });
  });

  it('color-pop-red on the chart fixture: a pure red pixel stays red, a green pixel goes grey', () => {
    const layers = parsePresetLayers(presetById('color-pop-red')!.layers)!;
    const px = (r: number, g: number, b: number) => ({ width: 1, height: 1, data: new Float32Array([r, g, b, 1]) });
    const red = toBytes(renderDocCPU({ layers }, px(1, 0, 0)));
    expect(red[0]).toBeGreaterThan(240);
    expect(red[1]).toBeLessThan(10);
    const green = toBytes(renderDocCPU({ layers }, px(0, 0.8, 0)));
    expect(Math.abs(green[0] - green[1])).toBeLessThanOrEqual(2);
    expect(Math.abs(green[1] - green[2])).toBeLessThanOrEqual(2);
    // and on the real chart fixture the output stays well-formed
    const chart = readImage('chart');
    const out = renderDocCPU({ layers }, chart);
    expect(out.width).toBe(chart.width);
  });

  it('applying appends under one group: the stack grows by the preset layer count, ids unique', () => {
    const base = appendPreset(newPhotoDoc(10, 10), 'warm', parsePresetLayers(presetById('warm')!.layers)!, 'Preset: Warm');
    const twice = appendPreset(base, 'warm', parsePresetLayers(presetById('warm')!.layers)!, 'Preset: Warm');
    expect(base.layers).toHaveLength(2);
    expect(twice.layers).toHaveLength(4);
    expect(new Set(twice.layers.map((l) => l.id)).size).toBe(4);
    expect(twice.layers.every((l) => l.group === 'Preset: Warm')).toBe(true);
    expect(appendPreset(base, 'x', [], 'g')).toBe(base);
  });
});

describe('Auto preset', () => {
  it('percentile finder', () => {
    const bins = new Uint32Array(256);
    bins[10] = 100; // 1% of 10000 is 100 -> low percentile (0.5%) lands on 10
    bins[200] = 9850; // cumulative 9950 = 99.5%
    bins[250] = 50;
    expect(histogramPercentile(bins, AUTO_LOW_PERCENTILE)).toBe(10);
    expect(histogramPercentile(bins, AUTO_HIGH_PERCENTILE)).toBe(200);
  });

  it('writes the expected percentiles for the chart fixture and a neutral white balance for a neutral image', () => {
    const chart = readImage('chart');
    const h = computeHistogram(toBytes(chart));
    const r = computeAutoPreset(h);
    const expectLo = histogramPercentile(h.r, AUTO_LOW_PERCENTILE) / 255;
    const expectHi = histogramPercentile(h.r, AUTO_HIGH_PERCENTILE) / 255;
    expect(r.levels.r[0]).toBeCloseTo(expectLo, 12);
    expect(r.levels.r[1]).toBeCloseTo(expectHi, 12);
    const levels = r.layers[0];
    if (levels.type !== 'levels') throw new Error('levels first');
    expect(levels.params.r.inBlack).toBeCloseTo(expectLo, 12);
    expect(levels.params.r.inWhite).toBeCloseTo(expectHi, 12);
    expect(r.layers[1].type).toBe('whiteBalance');

    // a neutral grey ramp needs no white balance
    const ramp = new Uint8ClampedArray(256 * 4);
    for (let i = 0; i < 256; i += 1) ramp.set([i, i, i, 255], i * 4);
    const g = computeAutoPreset(computeHistogram(ramp));
    expect(g.whiteBalance).toEqual({ temperature: 0, tint: 0 });
  });

  it('a warm cast is cooled (negative temperature)', () => {
    // black and white anchor the percentiles; the mid tones carry a warm cast
    const warm = new Uint8ClampedArray(1000 * 4);
    for (let i = 0; i < 1000; i += 1) warm.set(i < 100 ? [0, 0, 0, 255] : i < 200 ? [255, 255, 255, 255] : [200, 128, 60, 255], i * 4);
    const r = computeAutoPreset(computeHistogram(warm));
    expect(r.whiteBalance.temperature).toBeLessThan(0);
  });
});

describe('preset thumbnails', () => {
  it('96 px render of the current image, cached per (source, preset)', () => {
    const photo = readImage('photo');
    const small = downscaleBytes(toBytes(photo), photo.width, photo.height);
    expect(Math.max(small.width, small.height)).toBe(96);
    const cache = new ThumbCache();
    const layers = parsePresetLayers(presetById('vivid')!.layers)!;
    const a = cache.get('src1', 'vivid', small, () => layers);
    const b = cache.get('src1', 'vivid', small, () => layers);
    expect(b).toBe(a);
    expect(cache.renders).toBe(1);
    cache.get('src2', 'vivid', small, () => layers);
    expect(cache.renders).toBe(2);
    expect(renderPresetThumb(fromBytes(1, 1, [10, 20, 30, 255]), layers).data).toHaveLength(4);
  });
});
