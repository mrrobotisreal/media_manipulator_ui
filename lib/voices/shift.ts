/**
 * The shifter presets, mirrored from media_manipulator_api
 * internal/services/voices_shift.go `VoiceShiftPresets` (MM77 decision 12: "one Go table
 * that the UI mirrors"). shift.test.ts pins every row, so a change on either side is a
 * failing test. The server resolves a preset id itself and it wins over the explicit
 * pair, but the UI sends the pair too so the request says exactly what the chip promised.
 *
 * "shifted" moves the vocal-tract resonances with the pitch (a smaller or larger
 * speaker); "preserved" keeps the speaker and changes only the pitch. Telephone adds a
 * 300 to 3400 Hz band-pass on the server.
 */
export type Formant = 'preserved' | 'shifted';

export interface ShiftPreset {
  id: 'deeper' | 'higher' | 'child' | 'elder' | 'telephone';
  semitones: number;
  formant: Formant;
}

export const VOICE_SHIFT_PRESETS: readonly ShiftPreset[] = [
  { id: 'deeper', semitones: -4, formant: 'shifted' },
  { id: 'higher', semitones: 4, formant: 'shifted' },
  { id: 'child', semitones: 7, formant: 'shifted' },
  { id: 'elder', semitones: -2, formant: 'preserved' },
  { id: 'telephone', semitones: 0, formant: 'preserved' },
];

/** services.VoiceShiftMaxSemitones. */
export const VOICE_SHIFT_MAX_SEMITONES = 12;

/** Clamp like ResolveVoiceShift; NaN becomes 0. */
export function clampSemitones(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(-VOICE_SHIFT_MAX_SEMITONES, Math.min(VOICE_SHIFT_MAX_SEMITONES, value));
}

/** The pitch ratio rubberband gets, 2^(semitones/12), for display ("×1.19"). */
export function pitchRatio(semitones: number): number {
  return Math.pow(2, clampSemitones(semitones) / 12);
}
