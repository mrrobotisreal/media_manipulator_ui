'use client';

import React from 'react';
import { Mic, Square, X } from 'lucide-react';
import {
  classifyMicError,
  formatElapsed,
  isEmbeddedFrame,
  levelFromTimeDomain,
  pickVoiceoverMime,
  type MicFailure,
} from '@/lib/studio/voiceover';

/**
 * The shared browser microphone recorder (MM78, factored out of Darkroom's voiceover
 * recorder). One hook owns the MediaRecorder I/O: permission, start/stop/cancel, the
 * level meter (an AnalyserNode written straight into a DOM node, no re-render per frame),
 * the elapsed clock and an optional automatic stop. It hands the caller a `Blob` and the
 * recorded length; what happens to the take (upload to the Darkroom bin, a voice
 * reference) is the caller's business.
 *
 * Codec: the first of `VOICEOVER_MIME_CANDIDATES` the browser can record (webm/opus in
 * Chrome and Firefox, mp4/aac in Safari); the server transcodes either. When the browser
 * has no MediaRecorder the hook reports `unavailable` and callers fall back to upload.
 */

export type { MicFailure } from '@/lib/studio/voiceover';

export interface RecordedTake {
  blob: Blob;
  /** Wall-clock length of the take in milliseconds. */
  durationMs: number;
}

export interface UseAudioRecorderOptions {
  /** A finished, non-empty take. Not called after `cancel()` or an unmount. */
  onRecorded: (take: RecordedTake) => void;
  /** The microphone could not be opened, or the browser cannot record. */
  onError: (failure: MicFailure) => void;
  /** Recording actually began (permission granted, recorder running). */
  onStart?: () => void;
  /** Stop automatically after this many milliseconds (the voices 60 s ceiling). */
  maxMs?: number;
}

export interface AudioRecorderControls {
  recording: boolean;
  elapsedMs: number;
  /** Attach to the level bar's inner element; its width tracks the input level. */
  levelRef: React.RefObject<HTMLDivElement | null>;
  start: () => Promise<void>;
  stop: () => void;
  cancel: () => void;
}

/** True when this browser can record from a microphone at all. */
export function canRecordAudio(): boolean {
  return typeof navigator !== 'undefined' && !!navigator.mediaDevices?.getUserMedia && typeof MediaRecorder !== 'undefined';
}

export function useAudioRecorder({ onRecorded, onError, onStart, maxMs }: UseAudioRecorderOptions): AudioRecorderControls {
  const [recording, setRecording] = React.useState(false);
  const [elapsedMs, setElapsedMs] = React.useState(0);
  const levelRef = React.useRef<HTMLDivElement>(null);

  const recRef = React.useRef<MediaRecorder | null>(null);
  const streamRef = React.useRef<MediaStream | null>(null);
  const chunksRef = React.useRef<Blob[]>([]);
  const cancelledRef = React.useRef(false);
  const startedAtRef = React.useRef(0);
  const rafRef = React.useRef<number | null>(null);
  const ctxRef = React.useRef<AudioContext | null>(null);
  const timerRef = React.useRef<ReturnType<typeof setInterval> | null>(null);
  // Latest callbacks without re-creating start/stop on every render.
  const cbRef = React.useRef({ onRecorded, onError, onStart, maxMs });
  React.useLayoutEffect(() => {
    cbRef.current = { onRecorded, onError, onStart, maxMs };
  });

  const teardown = React.useCallback(() => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    streamRef.current?.getTracks().forEach((tr) => tr.stop());
    streamRef.current = null;
    void ctxRef.current?.close().catch(() => undefined);
    ctxRef.current = null;
    recRef.current = null;
    setRecording(false);
    setElapsedMs(0);
  }, []);

  // Unmount mid-recording: discard and release the mic.
  React.useEffect(
    () => () => {
      cancelledRef.current = true;
      const rec = recRef.current;
      if (rec && rec.state !== 'inactive') {
        try {
          rec.stop();
        } catch {
          // already stopped
        }
      }
      teardown();
    },
    [teardown],
  );

  const finish = React.useCallback(
    (mime: string) => {
      const chunks = chunksRef.current;
      chunksRef.current = [];
      const durationMs = Date.now() - startedAtRef.current;
      teardown();
      if (cancelledRef.current || chunks.length === 0) return;
      const blob = new Blob(chunks, { type: mime || chunks[0].type || 'audio/webm' });
      if (blob.size === 0) return;
      cbRef.current.onRecorded({ blob, durationMs });
    },
    [teardown],
  );

  const stop = React.useCallback(() => {
    const rec = recRef.current;
    if (rec && rec.state !== 'inactive') rec.stop();
  }, []);

  const cancel = React.useCallback(() => {
    cancelledRef.current = true;
    const rec = recRef.current;
    if (rec && rec.state !== 'inactive') rec.stop();
    else teardown();
  }, [teardown]);

  const start = React.useCallback(async () => {
    if (recRef.current) return;
    if (!canRecordAudio()) {
      cbRef.current.onError('unavailable');
      return;
    }
    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (err) {
      cbRef.current.onError(classifyMicError(err, isEmbeddedFrame(typeof window === 'undefined' ? undefined : window)));
      return;
    }
    streamRef.current = stream;
    cancelledRef.current = false;
    chunksRef.current = [];

    const mime = pickVoiceoverMime(MediaRecorder.isTypeSupported?.bind(MediaRecorder));
    let rec: MediaRecorder;
    try {
      rec = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream);
    } catch {
      stream.getTracks().forEach((tr) => tr.stop());
      streamRef.current = null;
      cbRef.current.onError('unavailable');
      return;
    }
    recRef.current = rec;
    rec.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
    };
    rec.onstop = () => finish(rec.mimeType || mime);
    rec.start(1000);

    // Level meter: cosmetic, so any failure is ignored.
    try {
      const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (AC) {
        const ctx = new AC();
        ctxRef.current = ctx;
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 512;
        ctx.createMediaStreamSource(stream).connect(analyser);
        const data = new Uint8Array(analyser.fftSize);
        const tick = () => {
          analyser.getByteTimeDomainData(data);
          if (levelRef.current) levelRef.current.style.width = `${Math.round(levelFromTimeDomain(data) * 100)}%`;
          rafRef.current = requestAnimationFrame(tick);
        };
        tick();
      }
    } catch {
      // Meter is cosmetic.
    }

    startedAtRef.current = Date.now();
    setElapsedMs(0);
    setRecording(true);
    cbRef.current.onStart?.();
    timerRef.current = setInterval(() => {
      const ms = Date.now() - startedAtRef.current;
      setElapsedMs(ms);
      const max = cbRef.current.maxMs;
      if (max && ms >= max) stop();
    }, 250);
  }, [finish, stop]);

  return { recording, elapsedMs, levelRef, start, stop, cancel };
}

export interface AudioRecorderLabels {
  record: string;
  recording: string;
  stop: string;
  cancel: string;
  level: string;
}

/**
 * A full-size recorder control for forms (the voices pages): a Record button, then the
 * elapsed clock, the level meter, Stop and Cancel. Darkroom keeps its own compact
 * toolbar rendering on top of the same hook.
 */
export const AudioRecorder: React.FC<{
  labels: AudioRecorderLabels;
  onRecorded: (take: RecordedTake) => void;
  onError: (failure: MicFailure) => void;
  maxMs?: number;
  disabled?: boolean;
}> = ({ labels, onRecorded, onError, maxMs, disabled }) => {
  const { recording, elapsedMs, levelRef, start, stop, cancel } = useAudioRecorder({ onRecorded, onError, maxMs });
  if (!recording) {
    return (
      <button
        type="button"
        disabled={disabled}
        onClick={() => void start()}
        className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-edge px-4 py-2 text-sm text-foreground transition-colors hover:bg-surface-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Mic aria-hidden="true" className="size-4" />
        {labels.record}
      </button>
    );
  }
  return (
    <div
      role="status"
      aria-label={labels.recording}
      className="flex flex-wrap items-center gap-3 rounded-lg border border-destructive/60 bg-destructive/10 px-3 py-2"
    >
      <span className="size-2 rounded-full bg-destructive animate-pulse motion-reduce:animate-none" aria-hidden />
      <span className="num text-sm tabular-nums text-foreground" data-testid="recorder-elapsed">
        {formatElapsed(elapsedMs)}
        {maxMs ? ` / ${formatElapsed(maxMs)}` : ''}
      </span>
      <div className="h-1.5 w-24 overflow-hidden rounded bg-muted" title={labels.level} aria-hidden>
        <div ref={levelRef} className="h-full bg-primary" style={{ width: '0%' }} />
      </div>
      <button
        type="button"
        onClick={stop}
        className="inline-flex min-h-9 items-center gap-1.5 rounded-md px-2 text-sm text-foreground hover:bg-surface-2"
      >
        <Square aria-hidden="true" className="size-3.5 fill-current" />
        {labels.stop}
      </button>
      <button
        type="button"
        onClick={cancel}
        aria-label={labels.cancel}
        className="inline-flex min-h-9 items-center rounded-md px-2 text-muted-foreground hover:bg-surface-2"
      >
        <X aria-hidden="true" className="size-4" />
      </button>
    </div>
  );
};

export default AudioRecorder;
