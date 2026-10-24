/**
 * Voiceover helpers (part 21): MediaRecorder format choice, mic-failure
 * classification and file naming. Pure so they can be unit-tested without a
 * browser; the recorder component owns the getUserMedia/MediaRecorder I/O.
 */

/** Preferred first. Chrome/Firefox give webm/opus; Safari gives mp4/aac. */
export const VOICEOVER_MIME_CANDIDATES = [
  'audio/webm;codecs=opus',
  'audio/webm',
  'audio/ogg;codecs=opus',
  'audio/mp4',
] as const;

/** First candidate the browser can record, or '' to let it choose its default. */
export function pickVoiceoverMime(isTypeSupported: ((t: string) => boolean) | undefined): string {
  if (!isTypeSupported) return '';
  for (const mime of VOICEOVER_MIME_CANDIDATES) {
    try {
      if (isTypeSupported(mime)) return mime;
    } catch {
      // keep looking
    }
  }
  return '';
}

/** File extension the server allowlist accepts for a recorder MIME type. */
export function voiceoverExtension(mime: string): string {
  const m = mime.toLowerCase();
  if (m.includes('mp4') || m.includes('aac')) return 'm4a';
  if (m.includes('ogg')) return 'ogg';
  return 'webm';
}

/** The base MIME (no codecs parameter) used as the upload Content-Type. */
export function voiceoverContentType(mime: string): string {
  const base = mime.split(';')[0].trim().toLowerCase();
  return base.startsWith('audio/') ? base : 'audio/webm';
}

export type MicFailure = 'denied' | 'host_blocked' | 'unavailable';

/**
 * Classify a getUserMedia rejection. Inside an iframe whose host did not grant
 * `allow="microphone"`, browsers reject with NotAllowedError exactly like a user
 * denial, so the embed flag is what tells the two apart.
 */
export function classifyMicError(err: unknown, embedded: boolean): MicFailure {
  const name = (err as { name?: string } | null)?.name ?? '';
  if (name === 'NotAllowedError' || name === 'SecurityError' || name === 'PermissionDeniedError') {
    return embedded ? 'host_blocked' : 'denied';
  }
  return 'unavailable';
}

/** True when this window is inside an iframe (cross-origin access throws, which also means framed). */
export function isEmbeddedFrame(win: { self: unknown; top: unknown } | undefined): boolean {
  if (!win) return false;
  try {
    return win.self !== win.top;
  } catch {
    return true;
  }
}

/** mm:ss for the elapsed-time readout. */
export function formatElapsed(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

/** RMS level 0..1 from an AnalyserNode's time-domain bytes (128 = silence). */
export function levelFromTimeDomain(data: ArrayLike<number>): number {
  if (data.length === 0) return 0;
  let sum = 0;
  for (let i = 0; i < data.length; i++) {
    const v = (data[i] - 128) / 128;
    sum += v * v;
  }
  return Math.min(1, Math.sqrt(sum / data.length) * 2.5);
}
