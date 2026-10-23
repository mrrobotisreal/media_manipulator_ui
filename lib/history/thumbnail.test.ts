import { afterEach, describe, expect, it, vi } from 'vitest';
import { makeThumbnail, thumbSize, thumbnailable } from './thumbnail';

afterEach(() => vi.unstubAllGlobals());

describe('thumbSize', () => {
  it('scales the longest edge to 160 and never upscales', () => {
    expect(thumbSize(1600, 800)).toEqual({ width: 160, height: 80 });
    expect(thumbSize(300, 1200)).toEqual({ width: 40, height: 160 });
    expect(thumbSize(100, 50)).toEqual({ width: 100, height: 50 });
  });
});

describe('makeThumbnail', () => {
  it('draws an image with a 160 px longest edge as JPEG q0.7', async () => {
    const close = vi.fn();
    vi.stubGlobal('createImageBitmap', vi.fn(async () => ({ width: 1600, height: 900, close })));
    const drawImage = vi.fn();
    const sizes: number[][] = [];
    const out = new Blob(['jpg'], { type: 'image/jpeg' });
    const convertToBlob = vi.fn(async () => out);
    class FakeCanvas {
      constructor(w: number, h: number) {
        sizes.push([w, h]);
      }
      getContext() {
        return { drawImage };
      }
      convertToBlob = convertToBlob;
    }
    vi.stubGlobal('OffscreenCanvas', FakeCanvas);
    const result = await makeThumbnail(new Blob(['x']), 'image');
    expect(result).toBe(out);
    expect(sizes).toEqual([[160, 90]]);
    expect(Math.max(...sizes[0])).toBe(160);
    expect(convertToBlob).toHaveBeenCalledWith({ type: 'image/jpeg', quality: 0.7 });
    expect(close).toHaveBeenCalled();
  });

  it('returns null for audio and other kinds without decoding', async () => {
    const decode = vi.fn();
    vi.stubGlobal('createImageBitmap', decode);
    expect(thumbnailable('audio')).toBe(false);
    expect(await makeThumbnail(new Blob(['x']), 'audio')).toBeNull();
    expect(await makeThumbnail(new Blob(['x']), 'pdf')).toBeNull();
    expect(decode).not.toHaveBeenCalled();
  });

  it('returns null when decoding fails or is unavailable', async () => {
    vi.stubGlobal('createImageBitmap', vi.fn(async () => { throw new Error('bad'); }));
    expect(await makeThumbnail(new Blob(['x']), 'gif')).toBeNull();
    vi.stubGlobal('createImageBitmap', undefined);
    expect(await makeThumbnail(new Blob(['x']), 'image')).toBeNull();
  });
});
