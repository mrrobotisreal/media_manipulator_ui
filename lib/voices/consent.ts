/**
 * The consent record for a cloned voice (design VOICES.md §4.4, MM78 decision 3).
 *
 * VOICE_CONSENT_TEXT_VERSION names the consent sentence the UI shows. It equals the
 * API's VOICES_CONSENT_TEXT_VERSION default (internal/config/voices.go, `2026-10-28`),
 * which the server stores with every cloned voice, and the version the Terms of Service
 * "Voices" section names. If the sentence changes: bump this constant, the Terms in
 * every locale, and VOICES_CONSENT_TEXT_VERSION on the server, together.
 */
export const VOICE_CONSENT_TEXT_VERSION = '2026-10-28';

/** The English sentence the checkbox shows (the copy itself is in panels.json `voices.consent.label`). */
export const VOICE_CONSENT_TEXT_EN =
  'This is my voice, or I have the explicit permission of the person whose voice this is.';

/** Reference clip bounds (voices.go voiceReferenceMinSeconds / MaxSeconds), inclusive. */
export const VOICE_REFERENCE_MIN_SECONDS = 5;
export const VOICE_REFERENCE_MAX_SECONDS = 60;

/** Saved-voice name length (validVoiceName). */
export const VOICE_NAME_MAX_CHARS = 60;

/** Design description cap (voiceDescriptionMaxChars). */
export const VOICE_DESCRIPTION_MAX_CHARS = 1000;

/** Design previews per description per hour (VOICES_DESIGN_PREVIEWS_PER_HOUR default). */
export const VOICE_DESIGN_PREVIEWS_PER_DESCRIPTION = 3;

/** Exaggeration bounds and default (voiceExaggerationMin / Max; Chatterbox default 0.5). */
export const VOICE_EXAGGERATION_MIN = 0.25;
export const VOICE_EXAGGERATION_MAX = 2;
export const VOICE_EXAGGERATION_DEFAULT = 0.5;

export type ReferenceLengthVerdict = 'ok' | 'too_short' | 'too_long';

/** The recorder / upload length gate: 5 to 60 s inclusive, like the server. */
export function referenceLengthVerdict(seconds: number): ReferenceLengthVerdict {
  if (!Number.isFinite(seconds) || seconds < VOICE_REFERENCE_MIN_SECONDS) return 'too_short';
  if (seconds > VOICE_REFERENCE_MAX_SECONDS) return 'too_long';
  return 'ok';
}
