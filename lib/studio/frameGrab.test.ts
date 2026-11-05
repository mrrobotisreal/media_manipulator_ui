import { describe, expect, it, vi } from 'vitest';

import { captureJpeg, FRAME_MAX_BYTES, type FrameEncoder } from '@/lib/assistant/frame';

import { grabPreviewCanvas, registerFrameGrab } from './frameGrab';

describe('Darkroom frame grab (MM109 decision 4)', () => {
  it('returns null with no preview mounted (no frame is sent)', () => {
    registerFrameGrab(null);
    expect(grabPreviewCanvas()).toBeNull();
    registerFrameGrab(() => null);
    expect(grabPreviewCanvas()).toBeNull();
  });

  it('reads the compositor size; the JPEG step keeps it ≤ 1024 px and ≤ the byte limit', async () => {
    const putImageData = vi.fn();
    const createImageData = (w: number, h: number) => ({ data: new Uint8ClampedArray(w * h * 4), width: w, height: h });
    const getContext = vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({ putImageData, createImageData } as never);
    registerFrameGrab(() => ({ width: 3840, height: 2160, data: new Uint8ClampedArray(3840 * 2160 * 4) }));
    const c = grabPreviewCanvas();
    expect([c?.width, c?.height]).toEqual([3840, 2160]);
    expect(putImageData).toHaveBeenCalledTimes(1);
    const calls: number[][] = [];
    const enc: FrameEncoder = { encode: async (_s, w, h, q) => (calls.push([w, h, q]), new Blob([new Uint8Array(1000)])) };
    const blob = await captureJpeg(c!, FRAME_MAX_BYTES, enc);
    expect(blob!.size).toBeLessThanOrEqual(FRAME_MAX_BYTES);
    expect(calls[0].slice(0, 2)).toEqual([1024, 576]);
    getContext.mockRestore();
    registerFrameGrab(null);
  });
});
