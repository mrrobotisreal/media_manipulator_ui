import { beforeEach, describe, expect, it } from 'vitest';
import {
  DEFAULT_STUDIO_PREFERENCES,
  STUDIO_PREFERENCES_KEY,
  defaultTransitionSeconds,
  loadStudioPreferences,
  saveStudioPreferences,
} from '@/lib/studio/preferences';

describe('studio preferences (part 14)', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('ships the decided defaults: 1.0s video / 0.5s audio', () => {
    expect(loadStudioPreferences()).toEqual({
      defaultVideoTransitionSeconds: 1,
      defaultAudioCrossfadeSeconds: 0.5,
    });
    expect(defaultTransitionSeconds('video')).toBe(1);
    expect(defaultTransitionSeconds('audio')).toBe(0.5);
  });

  it('persists a partial update and reads it back', () => {
    const saved = saveStudioPreferences({ defaultVideoTransitionSeconds: 2.5 });
    expect(saved.defaultVideoTransitionSeconds).toBe(2.5);
    expect(saved.defaultAudioCrossfadeSeconds).toBe(0.5); // untouched half survives
    expect(loadStudioPreferences()).toEqual(saved);
    expect(defaultTransitionSeconds('video')).toBe(2.5);
  });

  it('clamps into the registry range on save and on load', () => {
    expect(saveStudioPreferences({ defaultVideoTransitionSeconds: 99 }).defaultVideoTransitionSeconds).toBe(5);
    expect(saveStudioPreferences({ defaultAudioCrossfadeSeconds: 0 }).defaultAudioCrossfadeSeconds).toBe(0.1);
    // A hand-edited/stale payload can never escape the contract range.
    window.localStorage.setItem(
      STUDIO_PREFERENCES_KEY,
      JSON.stringify({ defaultVideoTransitionSeconds: -3, defaultAudioCrossfadeSeconds: 'bogus' }),
    );
    expect(loadStudioPreferences()).toEqual({
      defaultVideoTransitionSeconds: 0.1,
      defaultAudioCrossfadeSeconds: DEFAULT_STUDIO_PREFERENCES.defaultAudioCrossfadeSeconds,
    });
  });

  it('falls back to defaults on unparseable storage', () => {
    window.localStorage.setItem(STUDIO_PREFERENCES_KEY, '{not json');
    expect(loadStudioPreferences()).toEqual(DEFAULT_STUDIO_PREFERENCES);
  });
});
