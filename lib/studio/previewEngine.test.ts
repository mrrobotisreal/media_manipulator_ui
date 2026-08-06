import { describe, expect, it, vi } from 'vitest';

// The URL builders in previewEngine read the active StudioBackend, whose module
// pulls in the auth/analytics stack. The timeline math under test never touches
// it — stub the boundary so the suite stays pure.
vi.mock('@/lib/studio/studioBackend', () => ({
  getActiveStudioBackend: () => {
    throw new Error('studioBackend must not be reached from previewEngine unit tests');
  },
}));

import {
  clipDuration,
  clipEnd,
  timelineDuration,
  resolveActiveClips,
  transitionRamp,
  topVideoClip,
  volumeAtClipTime,
  type ActiveClip,
} from '@/lib/studio/previewEngine';
import type { StudioClip, StudioTrack, StudioTrackKind } from '@/lib/studioTypes';

const clip = (id: string, timelineStart: number, dur: number, extra: Partial<StudioClip> = {}): StudioClip => ({
  id,
  assetId: 'asset-1',
  streamIndex: 0,
  timelineStart,
  sourceIn: 0,
  sourceOut: dur,
  ...extra,
});

const track = (id: string, kind: StudioTrackKind, index: number, clips: StudioClip[]): StudioTrack => ({
  id,
  kind,
  index,
  muted: false,
  clips,
});

describe('clip geometry', () => {
  it('clipDuration is sourceOut - sourceIn, floored at 0', () => {
    expect(clipDuration(clip('c', 0, 0, { sourceIn: 2, sourceOut: 7 }))).toBe(5);
    expect(clipDuration(clip('c', 0, 0, { sourceIn: 7, sourceOut: 2 }))).toBe(0);
  });

  it('clipEnd is timelineStart + duration', () => {
    expect(clipEnd(clip('c', 3, 0, { sourceIn: 1, sourceOut: 4 }))).toBe(6);
  });

  it('timelineDuration is the latest clip end across all tracks', () => {
    const tracks = [
      track('v1', 'video', 0, [clip('a', 0, 5)]),
      track('a1', 'audio', 0, [clip('b', 2, 10)]),
    ];
    expect(timelineDuration(tracks)).toBe(12);
    expect(timelineDuration([])).toBe(0);
  });
});

describe('resolveActiveClips', () => {
  const tracks = [
    // a: 0..5, b: 4..9 — overlapping during b's 1s cross-dissolve.
    track('v1', 'video', 0, [clip('a', 0, 5), clip('b', 4, 5, { transitionInSeconds: 1 })]),
    track('a1', 'audio', 0, [clip('m', 0, 20)]),
  ];

  it('returns both overlapping clips of a cross-dissolve with mapped source times', () => {
    const active = resolveActiveClips(tracks, 4.5);
    const videoActive = active.filter((a) => a.trackKind === 'video');
    expect(videoActive.map((a) => a.clip.id)).toEqual(['a', 'b']);
    expect(videoActive[0].sourceTime).toBe(4.5); // a: sourceIn 0 + (4.5 - 0)
    expect(videoActive[1].sourceTime).toBe(0.5); // b: sourceIn 0 + (4.5 - 4)
  });

  it('includes audio clips with the track metadata the mixer needs', () => {
    const active = resolveActiveClips(tracks, 4.5);
    const audio = active.find((a) => a.clip.id === 'm');
    expect(audio).toMatchObject({ trackId: 'a1', trackKind: 'audio', trackIndex: 0, trackMuted: false, sourceTime: 4.5 });
  });

  it('treats clip spans as half-open: active at start, inactive at end', () => {
    const solo = [track('v1', 'video', 0, [clip('a', 1, 4)])];
    expect(resolveActiveClips(solo, 1).map((a) => a.clip.id)).toEqual(['a']);
    expect(resolveActiveClips(solo, 5)).toEqual([]);
    expect(resolveActiveClips(solo, 0.5)).toEqual([]);
  });

  it('maps source time through a trimmed in-point', () => {
    const trimmed = [track('v1', 'video', 0, [clip('a', 2, 0, { sourceIn: 10, sourceOut: 18 })])];
    expect(resolveActiveClips(trimmed, 5)[0].sourceTime).toBe(13);
  });
});

describe('transitionRamp', () => {
  it('is 1 for clips with no transition', () => {
    expect(transitionRamp(clip('a', 2, 5), 2)).toBe(1);
    expect(transitionRamp(clip('a', 2, 5, { transitionInSeconds: 0 }), 2)).toBe(1);
  });

  it('is 0 at the clip start and before it', () => {
    const c = clip('a', 2, 5, { transitionInSeconds: 1 });
    expect(transitionRamp(c, 2)).toBe(0);
    expect(transitionRamp(c, 1)).toBe(0);
  });

  it('ramps linearly across the transition window', () => {
    const c = clip('a', 2, 5, { transitionInSeconds: 2 });
    expect(transitionRamp(c, 2.5)).toBeCloseTo(0.25);
    expect(transitionRamp(c, 3)).toBeCloseTo(0.5);
    expect(transitionRamp(c, 3.5)).toBeCloseTo(0.75);
  });

  it('is 1 from the end of the ramp onward', () => {
    const c = clip('a', 2, 5, { transitionInSeconds: 1 });
    expect(transitionRamp(c, 3)).toBe(1);
    expect(transitionRamp(c, 6)).toBe(1);
  });
});

describe('topVideoClip', () => {
  const active = (id: string, kind: StudioTrackKind, trackIndex: number): ActiveClip => ({
    clip: clip(id, 0, 5),
    trackId: `t-${id}`,
    trackKind: kind,
    trackIndex,
    trackMuted: false,
    sourceTime: 0,
  });

  it('picks the video clip on the highest-indexed track', () => {
    const result = topVideoClip([active('base', 'video', 0), active('overlay', 'video', 2), active('mid', 'video', 1)]);
    expect(result?.clip.id).toBe('overlay');
  });

  it('ignores audio clips and handles an empty list', () => {
    expect(topVideoClip([active('m', 'audio', 3)])).toBeUndefined();
    expect(topVideoClip([])).toBeUndefined();
  });
});

describe('volumeAtClipTime', () => {
  it('returns the flat volume (default 1) when there are no keyframes', () => {
    expect(volumeAtClipTime(clip('a', 0, 5), 2)).toBe(1);
    expect(volumeAtClipTime(clip('a', 0, 5, { volume: 0.4 }), 2)).toBe(0.4);
    expect(volumeAtClipTime(clip('a', 0, 5, { volume: 0.4, volumeKeyframes: [] }), 2)).toBe(0.4);
  });

  it('holds the first keyframe value before it and the last after it', () => {
    const c = clip('a', 0, 10, { volumeKeyframes: [{ t: 2, gain: 0.2 }, { t: 6, gain: 1.8 }] });
    expect(volumeAtClipTime(c, 0)).toBe(0.2);
    expect(volumeAtClipTime(c, 2)).toBe(0.2);
    expect(volumeAtClipTime(c, 6)).toBe(1.8);
    expect(volumeAtClipTime(c, 9)).toBe(1.8);
  });

  it('interpolates linearly between keyframes', () => {
    const c = clip('a', 0, 10, { volumeKeyframes: [{ t: 2, gain: 0 }, { t: 6, gain: 1 }] });
    expect(volumeAtClipTime(c, 3)).toBeCloseTo(0.25);
    expect(volumeAtClipTime(c, 4)).toBeCloseTo(0.5);
    expect(volumeAtClipTime(c, 5)).toBeCloseTo(0.75);
  });

  it('interpolates across multiple segments', () => {
    const c = clip('a', 0, 10, {
      volumeKeyframes: [
        { t: 0, gain: 1 },
        { t: 4, gain: 0 },
        { t: 8, gain: 2 },
      ],
    });
    expect(volumeAtClipTime(c, 2)).toBeCloseTo(0.5);
    expect(volumeAtClipTime(c, 6)).toBeCloseTo(1);
  });

  it('keyframes override the flat volume', () => {
    const c = clip('a', 0, 10, { volume: 0.1, volumeKeyframes: [{ t: 0, gain: 1.5 }] });
    expect(volumeAtClipTime(c, 5)).toBe(1.5);
  });
});
