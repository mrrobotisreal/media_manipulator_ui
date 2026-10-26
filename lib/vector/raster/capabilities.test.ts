/**
 * MM47 acceptance 3: `probeRaster` with fake globals (design §5 "capability
 * probe fakes"). The dialog half (Chrome/Edge message, MP4 disabled) is in
 * `components/vector/export-dialog.raster.test.tsx`.
 */
import { describe, expect, it, vi } from 'vitest';

import { av1CodecString, avcCodecString, pickCodec, probeConfig, probeRaster, videoBitrate, vp9CodecString, type RasterGlobals } from './capabilities';

const encoder = (ok: (codec: string) => boolean) => ({
  isConfigSupported: vi.fn(async (c: { codec: string }) => ({ supported: ok(c.codec) })),
});

describe('probeRaster (fakes)', () => {
  it('no VideoEncoder → webcodecs:false, every video codec false, GIF and PNG still true', async () => {
    const p = await probeRaster({ isSecureContext: true, OffscreenCanvas: class {} });
    expect(p).toEqual({ gif: true, png: true, webcodecs: false, h264: false, vp9: false, av1: false, offscreen: true, secureContext: true });
  });

  it('H.264 unsupported but VP9 supported → MP4 disabled, WebM enabled', async () => {
    const g: RasterGlobals = { isSecureContext: true, VideoEncoder: encoder((c) => c.startsWith('vp09')) };
    const p = await probeRaster(g);
    expect(p).toMatchObject({ webcodecs: true, h264: false, vp9: true, av1: false });
    expect(pickCodec(p, 'mp4')).toBeNull();
    expect(pickCodec(p, 'webm')).toBe('vp9');
  });

  it('H.264 unsupported, AV1 supported → MP4 uses AV1', async () => {
    const p = await probeRaster({ isSecureContext: true, VideoEncoder: encoder((c) => c.startsWith('av01')) });
    expect(pickCodec(p, 'mp4')).toBe('av1');
    expect(pickCodec(p, 'webm')).toBe('av1');
  });

  it('insecure context → secureContext:false and webcodecs:false even with a VideoEncoder', async () => {
    const enc = encoder(() => true);
    const p = await probeRaster({ isSecureContext: false, VideoEncoder: enc });
    expect(p).toMatchObject({ secureContext: false, webcodecs: false, h264: false, vp9: false, av1: false });
    expect(enc.isConfigSupported).not.toHaveBeenCalled();
  });

  it('a throwing or malformed isConfigSupported counts as unsupported (never throws)', async () => {
    const p = await probeRaster({
      isSecureContext: true,
      VideoEncoder: {
        isConfigSupported: async (c) => {
          if (c.codec.startsWith('avc1')) throw new TypeError('bad config');
          return c.codec.startsWith('vp09') ? ({} as { supported?: boolean }) : { supported: true };
        },
      },
    });
    expect(p).toMatchObject({ webcodecs: true, h264: false, vp9: false, av1: true });
  });

  it('all supported + OffscreenCanvas present', async () => {
    const p = await probeRaster({ isSecureContext: true, OffscreenCanvas: class {}, VideoEncoder: encoder(() => true) });
    expect(p).toEqual({ gif: true, png: true, webcodecs: true, h264: true, vp9: true, av1: true, offscreen: true, secureContext: true });
    expect(pickCodec(p, 'mp4')).toBe('h264');
    expect(pickCodec(p, 'webm')).toBe('vp9');
  });

  it('probes each codec with the export size, rate and bitrate', async () => {
    const enc = encoder(() => true);
    await probeRaster({ isSecureContext: true, VideoEncoder: enc }, { width: 1280, height: 720, fps: 60 });
    expect(enc.isConfigSupported.mock.calls.map(([c]) => c)).toEqual([
      { codec: 'avc1.640020', width: 1280, height: 720, bitrate: videoBitrate(1280, 720, 60), framerate: 60 },
      { codec: 'vp09.00.40.08', width: 1280, height: 720, bitrate: videoBitrate(1280, 720, 60), framerate: 60 },
      { codec: 'av01.0.08M.08', width: 1280, height: 720, bitrate: videoBitrate(1280, 720, 60), framerate: 60 },
    ]);
  });
});

describe('codec strings and bitrate', () => {
  it.each([
    [640, 480, 30, 'avc1.64001e'],
    [1280, 720, 30, 'avc1.64001f'],
    [1920, 1080, 30, 'avc1.640028'],
    [1920, 1080, 60, 'avc1.64002a'],
    [2560, 1440, 30, 'avc1.640032'],
    [3840, 2160, 30, 'avc1.640033'],
    [3840, 2160, 60, 'avc1.640034'],
  ])('H.264 %ix%i@%i → %s', (w, h, fps, s) => expect(avcCodecString(w, h, fps)).toBe(s));

  it('VP9 and AV1 levels grow with size and rate', () => {
    expect(vp9CodecString(1920, 1080, 30)).toBe('vp09.00.40.08');
    expect(vp9CodecString(3840, 2160, 60)).toBe('vp09.00.51.08');
    expect(av1CodecString(1920, 1080, 30)).toBe('av01.0.08M.08');
    expect(av1CodecString(3840, 2160, 60)).toBe('av01.0.13M.08');
  });

  it('bitrate: 1080p30 = 8 Mbps, scaled by pixels × fps, clamped', () => {
    expect(videoBitrate(1920, 1080, 30)).toBe(8_000_000);
    expect(videoBitrate(1920, 1080, 60)).toBe(16_000_000);
    expect(videoBitrate(1280, 720, 30)).toBe(Math.round(8_000_000 * (1280 * 720) / (1920 * 1080)));
    expect(videoBitrate(64, 64, 12)).toBe(500_000);
    expect(videoBitrate(7680, 4320, 240)).toBe(80_000_000);
    expect(probeConfig('vp9', { width: 1920, height: 1080, fps: 30 }).bitrate).toBe(8_000_000);
  });
});
