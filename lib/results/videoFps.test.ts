import { describe, expect, it } from 'vitest';
import { estimateFps, fpsHint } from './videoFps';

const series = (n: number, step: number) => Array.from({ length: n }, (_, i) => i * step);

describe('estimateFps', () => {
  it('30 samples at 1/30 -> 30', () => expect(estimateFps(series(30, 1 / 30))).toBe(30));
  it('at 1/59.94 -> 59.94', () => expect(estimateFps(series(30, 1 / 59.94))).toBe(59.94));
  it('fewer than 5 samples -> null', () => {
    expect(estimateFps(series(4, 1 / 30))).toBeNull();
    expect(estimateFps([])).toBeNull();
  });
  it('a dropped frame does not move the median', () => {
    const s = series(30, 1 / 30);
    s.splice(10, 1);
    expect(estimateFps(s)).toBe(30);
  });
  it('ignores repeated and non-finite samples', () => {
    expect(estimateFps([0, 0, 1 / 30, 1 / 30, 2 / 30, 3 / 30, 4 / 30, 5 / 30, Number.NaN])).toBe(30);
    expect(estimateFps([1, 1, 1, 1, 1, 1])).toBeNull();
  });
});

describe('fpsHint', () => {
  it('reads the interpolation target', () => {
    expect(fpsHint('ai_frame_interpolation', { temporal: { frameRate: { target: 60 } } })).toBe(60);
    expect(fpsHint('ai_frame_interpolation', { ai: { frameInterpolation: { targetFps: 48 } } })).toBe(48);
    expect(fpsHint('ai_frame_interpolation', { temporal: { frameRate: { target: '30' } } })).toBe(30);
  });
  it('is null for other tools and missing data', () => {
    expect(fpsHint('compress_video', { temporal: { frameRate: { target: 60 } } })).toBeNull();
    expect(fpsHint('ai_frame_interpolation', undefined)).toBeNull();
    expect(fpsHint(undefined, {})).toBeNull();
  });
});

describe('fpsHint wiring (embedded tool panel)', () => {
  it('reads the target the AI form writes into the submitted options, for the interpolation task only', () => {
    const submitted = { format: 'mp4', ai: { frameInterpolation: { targetFps: 120 } } };
    expect(fpsHint('ai_frame_interpolation', submitted)).toBe(120);
    expect(fpsHint('compress_video', submitted)).toBeNull();
    // Before a job is submitted the panel passes null options
    expect(fpsHint('ai_frame_interpolation', null)).toBeNull();
  });
});
