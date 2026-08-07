import { STUDIO_V3_RANGES } from '@/lib/studio/effectRegistry';
import type { StudioTrackKind } from '@/lib/studioTypes';

/**
 * Editor preferences (part 14) — typed, localStorage-persisted per browser.
 * Consciously NOT part of the project document: preferences describe how THIS
 * user works (default durations applied on insert), not the edit itself, so
 * they never travel through saves, undo history, or the embed protocol.
 */

export interface StudioPreferences {
  /** Applied when a transition is added to a video-track clip (seconds). */
  defaultVideoTransitionSeconds: number;
  /** Applied when a transition is added to an audio-track clip (seconds). */
  defaultAudioCrossfadeSeconds: number;
}

export const STUDIO_PREFERENCES_KEY = 'mm_studio_preferences';

export const DEFAULT_STUDIO_PREFERENCES: StudioPreferences = {
  defaultVideoTransitionSeconds: 1,
  defaultAudioCrossfadeSeconds: 0.5,
};

const RANGE = STUDIO_V3_RANGES.transitionDurationSeconds;

const clampDuration = (v: unknown, fallback: number): number => {
  const n = typeof v === 'number' && Number.isFinite(v) ? v : fallback;
  return Math.min(RANGE.max, Math.max(RANGE.min, n));
};

/**
 * Reads the persisted preferences, clamping every value into the registry
 * range so a hand-edited or stale payload can never produce an out-of-contract
 * duration. Storage failures fall back to the defaults.
 */
export function loadStudioPreferences(): StudioPreferences {
  try {
    const raw = window.localStorage.getItem(STUDIO_PREFERENCES_KEY);
    if (!raw) return { ...DEFAULT_STUDIO_PREFERENCES };
    const parsed = JSON.parse(raw) as Partial<StudioPreferences>;
    return {
      defaultVideoTransitionSeconds: clampDuration(
        parsed.defaultVideoTransitionSeconds,
        DEFAULT_STUDIO_PREFERENCES.defaultVideoTransitionSeconds,
      ),
      defaultAudioCrossfadeSeconds: clampDuration(
        parsed.defaultAudioCrossfadeSeconds,
        DEFAULT_STUDIO_PREFERENCES.defaultAudioCrossfadeSeconds,
      ),
    };
  } catch {
    return { ...DEFAULT_STUDIO_PREFERENCES };
  }
}

/** Merges + persists a partial update; returns the resulting preferences. */
export function saveStudioPreferences(patch: Partial<StudioPreferences>): StudioPreferences {
  const merged: StudioPreferences = {
    ...loadStudioPreferences(),
    ...patch,
  };
  merged.defaultVideoTransitionSeconds = clampDuration(
    merged.defaultVideoTransitionSeconds,
    DEFAULT_STUDIO_PREFERENCES.defaultVideoTransitionSeconds,
  );
  merged.defaultAudioCrossfadeSeconds = clampDuration(
    merged.defaultAudioCrossfadeSeconds,
    DEFAULT_STUDIO_PREFERENCES.defaultAudioCrossfadeSeconds,
  );
  try {
    window.localStorage.setItem(STUDIO_PREFERENCES_KEY, JSON.stringify(merged));
  } catch {
    // storage unavailable — the merged value still applies for this session's caller
  }
  return merged;
}

/** The default transition duration for a clip on a track of `kind`. */
export function defaultTransitionSeconds(kind: StudioTrackKind): number {
  const prefs = loadStudioPreferences();
  return kind === 'audio' ? prefs.defaultAudioCrossfadeSeconds : prefs.defaultVideoTransitionSeconds;
}
