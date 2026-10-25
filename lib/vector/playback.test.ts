import { describe, expect, it } from 'vitest';

import { formatTimecode, snapToFrame, stepPlayback } from './playback';

const base = { originTime: 0, duration: 1000, fps: 10, range: null, loop: true };

describe('stepPlayback', () => {
  it('advances in whole preview frames', () => {
    expect(stepPlayback({ ...base, elapsed: 0 }).time).toBe(0);
    expect(stepPlayback({ ...base, elapsed: 99 }).time).toBe(0);
    expect(stepPlayback({ ...base, elapsed: 100 }).time).toBe(100);
    expect(stepPlayback({ ...base, elapsed: 455 }).time).toBe(400);
  });

  it('loops inside the composition', () => {
    expect(stepPlayback({ ...base, elapsed: 1000 })).toEqual({ time: 0, stop: false });
    expect(stepPlayback({ ...base, elapsed: 1250 })).toEqual({ time: 200, stop: false });
  });

  it('stops on the end without loop', () => {
    expect(stepPlayback({ ...base, loop: false, elapsed: 1500 })).toEqual({ time: 1000, stop: true });
  });

  it('plays the in/out range and starts from its in point when outside it', () => {
    const r = { ...base, range: { start: 200, end: 600 } };
    expect(stepPlayback({ ...r, originTime: 900, elapsed: 0 }).time).toBe(200);
    expect(stepPlayback({ ...r, originTime: 300, elapsed: 100 }).time).toBe(400);
    expect(stepPlayback({ ...r, originTime: 200, elapsed: 450 }).time).toBe(200 + 50 * 0 + 0);
    expect(stepPlayback({ ...r, loop: false, originTime: 200, elapsed: 450 })).toEqual({ time: 600, stop: true });
  });

  it('24 fps frames are integer ms', () => {
    const t = stepPlayback({ ...base, fps: 24, elapsed: 130 }).time;
    expect(Number.isInteger(t)).toBe(true);
    expect(t).toBe(125);
    expect(snapToFrame(130, 24)).toBe(125);
  });

  it('formats timecode', () => {
    expect(formatTimecode(0)).toBe('0:00.000');
    expect(formatTimecode(61_250)).toBe('1:01.250');
  });
});
