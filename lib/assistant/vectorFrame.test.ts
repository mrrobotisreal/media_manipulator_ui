/**
 * MM110 decision 4: Motion's verify frame goes through the MM47 raster renderer (schema +
 * raster-safety checks) at ≤ 1024 px, over the canvas background, within the byte limit, and
 * a document the raster path refuses yields no frame (null) instead of throwing.
 */
import { describe, expect, it, vi } from 'vitest';

import { fakeFrameEnv } from '@/lib/vector/raster/testFakes.testutil';
import { parseVectorDoc, type VectorDoc } from '@/lib/vector/vectorTypes';

import type { FrameEncoder } from './frame';
import { captureVectorFrame, vectorFrameUnderlay } from './vectorFrame';

const doc = (canvas: Record<string, unknown>): VectorDoc => {
  const r = parseVectorDoc({ version: 1, canvas, layers: [{ type: 'rect', id: 'a', x: 0, y: 0, width: 10, height: 10, fill: '#ff0000' }] });
  if (!r.ok) throw new Error(r.error);
  return r.doc;
};
const encoder = (bytes: number): FrameEncoder & { sizes: [number, number][] } => {
  const sizes: [number, number][] = [];
  return { sizes, encode: vi.fn(async (_s, w, h) => (sizes.push([w, h]), new Blob([new Uint8Array(bytes)], { type: 'image/jpeg' }))) };
};

describe('Motion verify frame', () => {
  it('renders at ≤ 1024 px on the long side through the raster renderer', async () => {
    const env = fakeFrameEnv();
    const enc = encoder(1000);
    const blob = await captureVectorFrame(doc({ width: 1920, height: 1080 }), 500, 307_200, env, enc);
    expect(blob?.size).toBe(1000);
    expect(env.log.canvas?.width).toBe(1024);
    expect(env.log.canvas?.height).toBe(576);
    expect(enc.sizes[0]).toEqual([1024, 576]);
    expect(env.log.revoked).toEqual(env.log.created); // the SVG blob URL never outlives the frame
  });

  it('stays within the byte limit or returns null', async () => {
    expect(await captureVectorFrame(doc({ width: 512, height: 512 }), 0, 307_200, fakeFrameEnv(), encoder(400_000))).toBeNull();
  });

  it('draws over the canvas background, or dark grey when the canvas is transparent', () => {
    expect(vectorFrameUnderlay(doc({ width: 10, height: 10, background: '#ffffff' }))).toBe('#ffffff');
    expect(vectorFrameUnderlay(doc({ width: 10, height: 10 }))).toBe('#1f2023');
  });

  it('a document the raster safety check refuses gives no frame', async () => {
    const bad = { ...doc({ width: 10, height: 10 }), layers: [{ type: 'raw', id: 'r', markup: '<script>alert(1)</script>' }] } as unknown as VectorDoc;
    expect(await captureVectorFrame(bad, 0, 307_200, fakeFrameEnv(), encoder(10))).toBeNull();
  });
});
