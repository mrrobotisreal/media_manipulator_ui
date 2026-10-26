/**
 * The dialog's raster runtime: dispatch per format, the pre-count checks, and
 * the plan reader (`/api/tiers` + `/api/account/usage`).
 */
import { describe, expect, it, vi } from 'vitest';

import { readFixture } from '@/lib/vector/fixtures/fixtures';
import { parseVectorDoc, type VectorDoc } from '@/lib/vector/vectorTypes';

import { inProcessGifPort } from './gif';
import { planFrom } from './plan';
import { createRasterRuntime } from './run';
import { fakeFrameEnv } from './testFakes.testutil';

const animated = (() => {
  const r = parseVectorDoc(readFixture('animated.json'));
  if (!r.ok) throw new Error(r.error);
  return r.doc;
})();

describe('raster runtime', () => {
  const base = { doc: animated, size: { width: 8, height: 6 }, fps: 10, startMs: 0, endMs: 300 };

  it('GIF and PNG run through the frame renderer; GIF settings reach the encoder', async () => {
    const rt = createRasterRuntime({ env: fakeFrameEnv(), gifPort: inProcessGifPort });
    const gif = await rt.run({ ...base, format: 'gif', gif: { transparent: false, dither: true, plays: 2 } });
    expect(gif.blob.type).toBe('image/gif');
    const png = await rt.run({ ...base, format: 'png_sequence' });
    expect(png.blob.type).toBe('application/zip');
  });

  it('canEncode: raster formats always; video only with WebCodecs and a supported codec', async () => {
    const none = createRasterRuntime({ video: null });
    expect(await none.canEncode('gif', base.size, 30)).toBe(true);
    expect(await none.canEncode('mp4', base.size, 30)).toBe(false);
    const VideoEncoder = Object.assign(function () {}, { isConfigSupported: vi.fn(async (c: { codec: string }) => ({ supported: c.codec.startsWith('vp09') })) });
    const some = createRasterRuntime({ video: { VideoEncoder: VideoEncoder as never, VideoFrame: function () {} as never, createMuxer: vi.fn() } });
    expect(await some.canEncode('webm', base.size, 30)).toBe(true);
    expect(await some.canEncode('mp4', base.size, 30)).toBe(false);
  });

  it('check: a document with an external href is reported before anything is counted', () => {
    const rt = createRasterRuntime();
    expect(rt.check(animated)).toEqual([]);
    const bad = { ...animated, layers: [...animated.layers, { type: 'image', id: 'x', x: 0, y: 0, width: 1, height: 1, href: 'https://evil.example/a.png' }] } as unknown as VectorDoc;
    expect(rt.check(bad).length).toBeGreaterThan(0);
  });
});

describe('planFrom', () => {
  const tiers = {
    tiers: [
      { tier: 'anonymous', limits: { vectorFormats: ['svg_animated'] } },
      { tier: 'premium', limits: { vectorFormats: ['svg_animated', 'gif'] } },
    ],
  } as never;

  it('caps come from the caller own limits; publicFormats from the tier matrix', () => {
    const p = planFrom(tiers, { tier: 'free', limits: { vectorFormats: ['svg_animated', 'lottie'], vectorMaxDurationMs: 0, vectorVideo: { maxHeight: 0, maxFps: 0, maxSeconds: 0 } } as never });
    expect(p?.tier).toBe('free');
    expect(p?.caps?.formats).toEqual(['svg_animated', 'lottie']);
    expect([...p!.publicFormats!].sort()).toEqual(['gif', 'svg_animated']);
  });

  it('no limits → null (nothing clamped client-side); no tier matrix → publicFormats unknown', () => {
    expect(planFrom(tiers, null)).toBeNull();
    expect(planFrom(null, { tier: 'premium', limits: { vectorFormats: ['gif'] } as never })?.publicFormats).toBeNull();
  });
});
