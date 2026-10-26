/**
 * MM47 acceptance 4: `clampRasterOptions` table over the MM43 tier ladder.
 * The limits below mirror what `GET /api/tiers` returns today (MM43 defaults,
 * `internal/config/config.go`): no raster format below premium; premium GIF
 * 720p / no fps cap / 15 s; pro mirrors premium until MM49; operator has every
 * format at the deployment ceiling (4320 px / 240 fps / MAX_VIDEO_DURATION_SECONDS).
 */
import { describe, expect, it } from 'vitest';

import type { TierLimits } from '@/lib/auth/accountApi';

import { capsFromLimits, clampRasterOptions, estimateBytes, outputSize, type RasterFormat, type RasterOptions } from './caps';

type VectorLimits = Pick<TierLimits, 'vectorFormats' | 'vectorVideo' | 'vectorMaxDurationMs'>;
const ANON: VectorLimits = { vectorFormats: ['svg_animated'], vectorMaxDurationMs: 10000, vectorVideo: { maxHeight: 0, maxFps: 0, maxSeconds: 0 } };
const FREE: VectorLimits = { vectorFormats: ['svg_animated', 'lottie', 'import_lottie', 'import_svg_vectorize'], vectorMaxDurationMs: 0, vectorVideo: { maxHeight: 0, maxFps: 0, maxSeconds: 0 } };
const PREMIUM: VectorLimits = {
  vectorFormats: ['svg_animated', 'lottie', 'react_tsx', 'js_ts', 'flutter', 'gif', 'import_lottie', 'import_svg_vectorize'],
  vectorMaxDurationMs: 0,
  vectorVideo: { maxHeight: 720, maxFps: 0, maxSeconds: 15 },
};
const OPERATOR: VectorLimits = {
  vectorFormats: ['svg_animated', 'lottie', 'react_tsx', 'js_ts', 'flutter', 'gif', 'png_sequence', 'mp4', 'webm', 'import_lottie', 'import_svg_vectorize'],
  vectorMaxDurationMs: 0,
  vectorVideo: { maxHeight: 4320, maxFps: 240, maxSeconds: 600 },
};
/** What MM49 is expected to set for pro (design §3.4): 2160p / 60 fps / 60 s. */
const PRO_MM49: VectorLimits = { ...OPERATOR, vectorVideo: { maxHeight: 2160, maxFps: 60, maxSeconds: 60 } };

const opts = (format: RasterFormat, height: number, fps: number, endMs: number, startMs = 0): RasterOptions => ({ format, height, fps, startMs, endMs });

describe('clampRasterOptions table', () => {
  it.each<[string, VectorLimits | null, RasterOptions, number, unknown]>([
    // name, limits, requested, doc duration, expected
    ['anonymous: no raster format (video formats absent)', ANON, opts('gif', 720, 30, 5000), 5000, { available: false, reason: 'locked' }],
    ['anonymous: MP4 locked', ANON, opts('mp4', 720, 30, 5000), 5000, { available: false, reason: 'locked' }],
    ['free: GIF locked', FREE, opts('gif', 480, 15, 3000), 3000, { available: false, reason: 'locked' }],
    ['free: WebM locked', FREE, opts('webm', 480, 15, 3000), 3000, { available: false, reason: 'locked' }],
    ['premium: PNG sequence locked (no tier has it before MM49)', PREMIUM, opts('png_sequence', 720, 30, 3000), 3000, { available: false, reason: 'locked' }],
    ['premium: MP4 locked', PREMIUM, opts('mp4', 720, 30, 3000), 3000, { available: false, reason: 'locked' }],
    [
      'premium GIF 720p/15 s: 1080p→720p and 30 s→15 s',
      PREMIUM,
      opts('gif', 1080, 30, 30000),
      30000,
      { available: true, options: opts('gif', 720, 30, 15000), heights: [480, 720], fpsChoices: [12, 15, 24, 25, 30, 50], maxDurationMs: 15000, clamped: ['height', 'duration'] },
    ],
    [
      'premium GIF already within caps is untouched',
      PREMIUM,
      opts('gif', 480, 24, 2000, 500),
      3000,
      { available: true, options: opts('gif', 480, 24, 2000, 500), heights: [480, 720], fpsChoices: [12, 15, 24, 25, 30, 50], maxDurationMs: 15000, clamped: [] },
    ],
    [
      'premium GIF 60 fps → 50 (GIF centisecond delays)',
      PREMIUM,
      opts('gif', 720, 60, 1000),
      1000,
      { available: true, options: opts('gif', 720, 50, 1000), heights: [480, 720], fpsChoices: [12, 15, 24, 25, 30, 50], maxDurationMs: 15000, clamped: ['fps'] },
    ],
    [
      'no-cap deployment ceiling (operator): 2160p60 for 90 s untouched',
      OPERATOR,
      opts('mp4', 2160, 60, 90000),
      90000,
      { available: true, options: opts('mp4', 2160, 60, 90000), heights: [480, 720, 1080, 1440, 2160], fpsChoices: [12, 15, 24, 25, 30, 50, 60], maxDurationMs: 600000, clamped: [] },
    ],
    [
      'pro after MM49 (2160p/60/60 s): 120 s WebM → 60 s',
      PRO_MM49,
      opts('webm', 2160, 60, 120000, 1000),
      200000,
      { available: true, options: opts('webm', 2160, 60, 61000, 1000), heights: [480, 720, 1080, 1440, 2160], fpsChoices: [12, 15, 24, 25, 30, 50, 60], maxDurationMs: 60000, clamped: ['duration'] },
    ],
    [
      'unknown caps (limits not loaded): nothing locked, nothing clamped but the document length',
      null,
      opts('png_sequence', 1440, 30, 9000),
      4000,
      { available: true, options: opts('png_sequence', 1440, 30, 4000), heights: [480, 720, 1080, 1440, 2160], fpsChoices: [12, 15, 24, 25, 30, 50, 60], maxDurationMs: 0, clamped: [] },
    ],
  ])('%s', (_name, limits, requested, docMs, expected) => {
    expect(clampRasterOptions(requested, limits ? capsFromLimits(limits) : null, docMs)).toEqual(expected);
  });

  it('a cap below every preset becomes the only choice (even height)', () => {
    const r = clampRasterOptions(opts('gif', 720, 30, 1000), capsFromLimits({ ...PREMIUM, vectorVideo: { maxHeight: 361, maxFps: 10, maxSeconds: 0 } }), 1000);
    expect(r).toMatchObject({ available: true, heights: [360], fpsChoices: [10], options: { height: 360, fps: 10 } });
  });

  it('a non-preset request snaps down to the nearest offered value', () => {
    const r = clampRasterOptions(opts('mp4', 900, 29, 1000), capsFromLimits(OPERATOR), 1000);
    expect(r).toMatchObject({ options: { height: 720, fps: 25 } });
  });

  it('the anonymous 10 s document cap also applies (min of both duration caps)', () => {
    expect(capsFromLimits({ ...OPERATOR, vectorMaxDurationMs: 10000 })!.maxDurationMs).toBe(10000);
  });

  it('a limits row without vectorFormats (API before MM43) is unknown caps', () => {
    expect(capsFromLimits({ vectorVideo: { maxHeight: 720, maxFps: 0, maxSeconds: 15 } })).toBeNull();
  });
});

describe('outputSize and estimates', () => {
  it('keeps the aspect ratio; video sizes are even', () => {
    expect(outputSize({ width: 400, height: 300 }, 720, false)).toEqual({ width: 960, height: 720 });
    expect(outputSize({ width: 333, height: 250 }, 480, true)).toEqual({ width: 638, height: 480 });
    expect(outputSize({ width: 333, height: 250 }, 481, true)).toEqual({ width: 640, height: 480 });
  });

  it('video estimate is bitrate × duration', () => {
    expect(estimateBytes('mp4', { width: 1920, height: 1080 }, 300, 8_000_000, 10000)).toBe(10_000_000);
    expect(estimateBytes('gif', { width: 100, height: 100 }, 10, 0, 1000)).toBeGreaterThan(0);
  });
});
