/** MM115: the browser meters match the API's analyze package names/units and obey the 4 KB limit. */
import { describe, expect, it } from 'vitest';

import { AssistantMetricsSchema } from '@/schemas/assistant';

import { metricsForBody, metricsFromHistogram, metricsFromRgba } from './metrics';

function solid(w: number, h: number, rgb: [number, number, number], alpha = 255): Uint8ClampedArray {
  const d = new Uint8ClampedArray(w * h * 4);
  for (let i = 0; i < d.length; i += 4) d.set([rgb[0], rgb[1], rgb[2], alpha], i);
  return d;
}

describe('metricsFromRgba', () => {
  it('reads a clipped picture: 25 % black, 25 % white, rest mid grey', () => {
    const d = solid(8, 8, [128, 128, 128]);
    for (let i = 0; i < 16; i += 1) d.set([0, 0, 0, 255], i * 4); // 16 of 64 px black
    for (let i = 48; i < 64; i += 1) d.set([255, 255, 255, 255], i * 4);
    const m = metricsFromRgba(d)!;
    expect(m.shadowsClipped).toBeCloseTo(0.25, 3);
    expect(m.highlightsClipped).toBeCloseTo(0.25, 3);
    expect(m.meanLuma).toBeCloseTo(0.5, 1);
    expect(m.warmth).toBe(0);
    expect(m.tint).toBe(0);
  });

  it('reads warmth from the red/blue balance and ignores transparent pixels', () => {
    const warm = metricsFromRgba(solid(4, 4, [200, 120, 60]))!;
    expect(warm.warmth).toBeGreaterThan(0.3);
    expect(metricsFromRgba(solid(4, 4, [10, 10, 10], 0))).toBeNull();
  });

  it('is accepted by the body schema and stays far below 4 KB', () => {
    const m = metricsFromRgba(solid(4, 4, [90, 90, 90]))!;
    expect(AssistantMetricsSchema.safeParse(m).success).toBe(true);
    expect(JSON.stringify(m).length).toBeLessThan(300);
  });
});

describe('metricsFromHistogram (Aperture reuses its histogram)', () => {
  it('agrees with the pixel path on the same picture', () => {
    const luma = new Uint32Array(256);
    luma[0] = 25;
    luma[128] = 50;
    luma[255] = 25;
    const gray = luma;
    const m = metricsFromHistogram({ r: gray, g: gray, b: gray, luma })!;
    expect(m.shadowsClipped).toBe(0.25);
    expect(m.highlightsClipped).toBe(0.25);
    expect(m.meanLuma).toBeCloseTo(0.5, 2);
    expect(m.medianLuma).toBeCloseTo(0.502, 2);
    expect(metricsFromHistogram({ r: new Uint32Array(256), g: new Uint32Array(256), b: new Uint32Array(256), luma: new Uint32Array(256) })).toBeNull();
  });
});

describe('body limits (acceptance 3)', () => {
  it('rejects a bad name, a non-finite value, too many keys and more than 4 KB', () => {
    expect(AssistantMetricsSchema.safeParse({ 'bad name': 1 }).success).toBe(false);
    expect(AssistantMetricsSchema.safeParse({ x: Number.POSITIVE_INFINITY }).success).toBe(false);
    expect(AssistantMetricsSchema.safeParse({ x: 1e9 }).success).toBe(false);
    const many = Object.fromEntries(Array.from({ length: 129 }, (_, i) => [`m${i}`, 1]));
    expect(AssistantMetricsSchema.safeParse(many).success).toBe(false);
    const wide = Object.fromEntries(Array.from({ length: 100 }, (_, i) => [`${'k'.repeat(29)}${String(i).padStart(2, '0')}`, 1234.5678]));
    expect(JSON.stringify(wide).length).toBeGreaterThan(4096);
    expect(AssistantMetricsSchema.safeParse(wide).success).toBe(false);
    expect(metricsForBody({ meanLuma: 0.4 })).toEqual({ meanLuma: 0.4 });
    expect(metricsForBody({})).toBeUndefined();
    expect(metricsForBody({ x: 'a' })).toBeUndefined();
  });
});
