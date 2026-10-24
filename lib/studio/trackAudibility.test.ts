import { describe, expect, it } from 'vitest';
import type { StudioTrack } from '@/lib/studioTypes';
import { anySolo, isTrackAudible } from './trackAudibility';

const tr = (kind: 'video' | 'audio', extra: Partial<StudioTrack> = {}): StudioTrack => ({
  id: 'x', kind, index: 0, muted: false, clips: [], ...extra,
});

describe('track audibility (solo semantics)', () => {
  it('no solo: audible unless muted', () => {
    expect(isTrackAudible(tr('audio'), false)).toBe(true);
    expect(isTrackAudible(tr('audio', { muted: true }), false)).toBe(false);
    expect(isTrackAudible(tr('video'), false)).toBe(true);
  });
  it('solo wins over mute', () => {
    expect(isTrackAudible(tr('audio', { solo: true, muted: true }), true)).toBe(true);
  });
  it('with a solo active only soloed audio tracks are heard (video embedded audio included)', () => {
    expect(isTrackAudible(tr('audio'), true)).toBe(false);
    expect(isTrackAudible(tr('video'), true)).toBe(false);
  });
  it('multiple solos are all audible', () => {
    const a = tr('audio', { solo: true });
    const b = tr('audio', { solo: true });
    expect(anySolo([a, b, tr('audio')])).toBe(true);
    expect(isTrackAudible(a, true) && isTrackAudible(b, true)).toBe(true);
  });
  it('a solo flag on a video track is ignored', () => {
    expect(anySolo([tr('video', { solo: true })])).toBe(false);
  });
});
