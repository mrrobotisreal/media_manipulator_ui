import { describe, expect, it, vi } from 'vitest';

import { blobToBase64, captureJpeg, frameSize, FRAME_MAX_BYTES, type FrameEncoder } from './frame';

const fakeEncoder = (sizeOf: (w: number, h: number, q: number) => number): FrameEncoder & { calls: [number, number, number][] } => {
  const calls: [number, number, number][] = [];
  return {
    calls,
    encode: vi.fn(async (_s, w, h, q) => {
      calls.push([w, h, q]);
      return new Blob([new Uint8Array(sizeOf(w, h, q))], { type: 'image/jpeg' });
    }),
  };
};
const src = (width: number, height: number) => ({ width, height }) as unknown as HTMLCanvasElement;

describe('preview frames', () => {
  it('downscales to ≤ 1024 px on the long side, never upscales', () => {
    expect(frameSize(4000, 3000)).toEqual({ width: 1024, height: 768 });
    expect(frameSize(800, 1600)).toEqual({ width: 512, height: 1024 });
    expect(frameSize(300, 200)).toEqual({ width: 300, height: 200 });
  });

  it('starts at q 0.8 and steps down until it fits the limit', async () => {
    const enc = fakeEncoder((w, h, q) => (q > 0.6 ? FRAME_MAX_BYTES + 1 : 1000));
    const b = await captureJpeg(src(4000, 3000), FRAME_MAX_BYTES, enc);
    expect(b?.size).toBe(1000);
    expect(enc.calls.map((c) => c[2])).toEqual([0.8, 0.7, 0.6]);
    expect(enc.calls[0].slice(0, 2)).toEqual([1024, 768]);
  });

  it('shrinks further when no quality fits, and gives up (null) rather than exceed the limit', async () => {
    const enc = fakeEncoder(() => FRAME_MAX_BYTES + 1);
    expect(await captureJpeg(src(2000, 1000), FRAME_MAX_BYTES, enc)).toBeNull();
    expect(Math.max(...enc.calls.map((c) => Math.max(c[0], c[1])))).toBeLessThanOrEqual(1024);
    expect(enc.calls.at(-1)?.[0]).toBeLessThan(1024);
  });

  it('base64 without a data: prefix', async () => {
    expect(await blobToBase64(new Blob([new Uint8Array([0xff, 0xd8, 0xff])]))).toBe('/9j/');
  });
});
