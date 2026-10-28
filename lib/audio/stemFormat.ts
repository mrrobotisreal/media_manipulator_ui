/**
 * MM81: vocal stems (isolate / remove vocals) follow the input's format.
 *
 * The API owns the rule (`services.ResolveStemFormat`); this module mirrors it only so the
 * form can say what "Same as input" will produce, estimate sizes and predict the result's
 * file name. The UI sends `format: "auto"` for the recommended choice and the API resolves
 * it (probing ambiguous containers like .m4a, which may be lossless ALAC).
 *
 *   - lossy input (mp3, m4a/aac, ogg, opus, ac3) -> the same format (MP3/AAC stems at 320k);
 *   - lossless input (wav, flac, aiff, alac)     -> FLAC;
 *   - video input or anything unknown             -> MP3 320k.
 *
 * Pure: no React, no DOM, so the math is unit-tested (stemFormat.test.ts).
 */

export type StemOperation = 'isolate_vocals' | 'remove_vocals';
/** What the visitor picks in the "Output format" select. */
export type StemFormatChoice = 'auto' | 'mp3' | 'flac' | 'wav';
/** A concrete stem container the API can write. */
export type StemFormat = 'mp3' | 'm4a' | 'aac' | 'ogg' | 'opus' | 'ac3' | 'flac' | 'wav';

export const STEM_FORMAT_CHOICES: readonly StemFormatChoice[] = ['auto', 'mp3', 'flac', 'wav'];

/** The WAV hint appears above this estimate. */
export const WAV_HINT_BYTES = 500 * 1024 * 1024;

export function isStemFormatChoice(v: unknown): v is StemFormatChoice {
  return v === 'auto' || v === 'mp3' || v === 'flac' || v === 'wav';
}

export function isStemOperation(op: string | null | undefined): op is StemOperation {
  return op === 'isolate_vocals' || op === 'remove_vocals';
}

const VIDEO_EXT = new Set(['mp4', 'mov', 'm4v', 'webm', 'mkv', 'avi', 'flv', 'wmv', 'mpeg', 'mpg', '3gp', 'ts']);
const LOSSLESS_EXT = new Set(['wav', 'wave', 'flac', 'aif', 'aiff', 'aifc', 'alac', 'caf']);

function extOf(name: string | null | undefined): string {
  const n = (name ?? '').trim().toLowerCase();
  const dot = n.lastIndexOf('.');
  return dot >= 0 ? n.slice(dot + 1) : '';
}

/**
 * What "Same as input" resolves to for a file (by extension, then MIME). An .m4a is shown as
 * M4A; the API may still pick FLAC when its probe finds ALAC inside.
 */
export function resolveStemFormat(fileName: string | null | undefined, mime?: string | null): StemFormat {
  const ext = extOf(fileName);
  const type = (mime ?? '').toLowerCase().split(';')[0].trim();
  if (type.startsWith('video/') || VIDEO_EXT.has(ext)) return 'mp3';
  switch (ext) {
    case 'mp3':
      return 'mp3';
    case 'aac':
      return 'aac';
    case 'm4a':
      return 'm4a';
    case 'ogg':
    case 'oga':
      return 'ogg';
    case 'opus':
      return 'opus';
    case 'ac3':
      return 'ac3';
  }
  if (LOSSLESS_EXT.has(ext)) return 'flac';
  switch (type) {
    case 'audio/mpeg':
    case 'audio/mp3':
      return 'mp3';
    case 'audio/aac':
      return 'aac';
    case 'audio/mp4':
    case 'audio/x-m4a':
      return 'm4a';
    case 'audio/ogg':
      return 'ogg';
    case 'audio/opus':
      return 'opus';
    case 'audio/flac':
    case 'audio/x-flac':
    case 'audio/wav':
    case 'audio/wave':
    case 'audio/x-wav':
    case 'audio/aiff':
    case 'audio/x-aiff':
      return 'flac';
  }
  return 'mp3';
}

/** The concrete format a choice produces for a file. */
export function effectiveStemFormat(choice: StemFormatChoice, fileName?: string | null, mime?: string | null): StemFormat {
  return choice === 'auto' ? resolveStemFormat(fileName, mime) : choice;
}

/**
 * Demucs (htdemucs) always writes 44.1 kHz stereo stems, whatever the input's rate or
 * channel count, so that is the shape of every stem the API encodes. (The 87-minute MP3 of
 * the MM80 incident came back as 922,710,094 bytes of WAV: 44,100 x 2 x 2 x 5,231 s.)
 */
export const STEM_SAMPLE_RATE = 44_100;
export const STEM_CHANNELS = 2;
const PCM_BYTES_PER_SECOND = STEM_SAMPLE_RATE * STEM_CHANNELS * 2;

/** Constant bitrate of the lossy stem encoders (bits/s); see the API's StemEncoderArgs. */
const LOSSY_BPS: Record<Exclude<StemFormat, 'flac' | 'wav'>, number> = {
  mp3: 320_000,
  m4a: 320_000,
  aac: 320_000,
  ogg: 192_000,
  ac3: 192_000,
  opus: 128_000,
};

/** FLAC is about 55 % of the PCM size for music. */
export const FLAC_RATIO = 0.55;

/**
 * Estimated stem size in bytes for an input of `durationSeconds`. WAV = 44.1 kHz x 2 ch x
 * 16-bit; FLAC ~55 % of that; lossy formats = their constant bitrate. `null` when the
 * duration is unknown.
 */
export function estimateStemBytes(format: StemFormat, durationSeconds: number | null | undefined): number | null {
  if (typeof durationSeconds !== 'number' || !Number.isFinite(durationSeconds) || durationSeconds <= 0) return null;
  if (format === 'wav') return Math.round(PCM_BYTES_PER_SECOND * durationSeconds);
  if (format === 'flac') return Math.round(PCM_BYTES_PER_SECOND * durationSeconds * FLAC_RATIO);
  return Math.round((LOSSY_BPS[format] / 8) * durationSeconds);
}

/** True when the WAV hint should show for this estimate. */
export function wavNeedsHint(bytes: number | null | undefined): boolean {
  return typeof bytes === 'number' && bytes > WAV_HINT_BYTES;
}

/**
 * The real output format of a stem job: what the API resolved (the job's `options.format`
 * after /upload rewrote "auto"), else what the choice predicts for the file.
 */
export function stemOutputFormat(
  requested: string | null | undefined,
  fileName: string | null | undefined,
  mime?: string | null,
  jobOptions?: Record<string, unknown> | null,
): string {
  const resolved = typeof jobOptions?.format === 'string' ? jobOptions.format.trim().toLowerCase() : '';
  if (resolved && resolved !== 'auto') return resolved;
  if (!requested || requested === 'auto') return resolveStemFormat(fileName, mime);
  return requested;
}
