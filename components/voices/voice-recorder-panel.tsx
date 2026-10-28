'use client';

import React from 'react';
import { FileAudio, Upload, X } from 'lucide-react';
import { AudioRecorder, canRecordAudio, type MicFailure, type RecordedTake } from '@/components/audio-recorder';
import { useLocalization } from '@/i18n/useLocalization';
import { formatElapsed, voiceoverExtension } from '@/lib/studio/voiceover';
import { referenceLengthVerdict, VOICE_REFERENCE_MAX_SECONDS, type ReferenceLengthVerdict } from '@/lib/voices/consent';
import { BUTTON_SECONDARY, VoiceNote } from './shared';

/**
 * Record or upload the audio a voices tool works on (MM78 decision 3).
 *
 * `gate="reference"` (clone): the take must be 5 to 60 s; the recorder stops itself at
 * 60 s and a file whose length the browser can read is checked the same way, so the
 * caller can keep Create disabled with the right message. `gate="none"` (voice changer):
 * any length; the server applies the plan's limit.
 *
 * A recorded take becomes a File named `recording.<ext>`; an upload is used as is.
 */
export interface VoiceClip {
  file: File;
  /** Seconds, when known (always for a recording; for an upload when the browser can read it). */
  seconds: number | null;
  source: 'recorded' | 'uploaded';
  verdict: ReferenceLengthVerdict | 'unknown';
}

/** Reads a media file's duration through an <audio> element; null when it cannot. */
export function readAudioDuration(file: File, timeoutMs = 8000): Promise<number | null> {
  if (typeof document === 'undefined' || typeof URL.createObjectURL !== 'function') return Promise.resolve(null);
  return new Promise((resolve) => {
    const audio = document.createElement('audio');
    const src = URL.createObjectURL(file);
    let done = false;
    const finish = (value: number | null) => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      URL.revokeObjectURL(src);
      resolve(value);
    };
    const timer = setTimeout(() => finish(null), timeoutMs);
    audio.preload = 'metadata';
    audio.onloadedmetadata = () => finish(Number.isFinite(audio.duration) && audio.duration > 0 ? audio.duration : null);
    audio.onerror = () => finish(null);
    audio.src = src;
  });
}

export function clipFromTake(take: RecordedTake): VoiceClip {
  const ext = voiceoverExtension(take.blob.type);
  const file = new File([take.blob], `recording.${ext}`, { type: take.blob.type.split(';')[0] || 'audio/webm' });
  const seconds = take.durationMs / 1000;
  return { file, seconds, source: 'recorded', verdict: referenceLengthVerdict(seconds) };
}

export const VoiceRecorderPanel: React.FC<{
  gate: 'reference' | 'none';
  clip: VoiceClip | null;
  onClip: (clip: VoiceClip | null) => void;
  disabled?: boolean;
  /** Test seam: duration reader for uploads. */
  readDuration?: (file: File) => Promise<number | null>;
}> = ({ gate, clip, onClip, disabled, readDuration = readAudioDuration }) => {
  const { t } = useLocalization('interface');
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [measuring, setMeasuring] = React.useState(false);
  const [micError, setMicError] = React.useState<MicFailure | null>(null);
  const recordable = React.useMemo(() => canRecordAudio(), []);

  const onFile = async (file: File) => {
    setMicError(null);
    setMeasuring(true);
    const seconds = await readDuration(file).catch(() => null);
    setMeasuring(false);
    onClip({
      file,
      seconds,
      source: 'uploaded',
      verdict: seconds === null ? 'unknown' : referenceLengthVerdict(seconds),
    });
  };

  const lengthMessage =
    clip && gate === 'reference'
      ? clip.verdict === 'too_short'
        ? t('voiceTools.recorder.tooShort', { seconds: (clip.seconds ?? 0).toFixed(1) })
        : clip.verdict === 'too_long'
          ? t('voiceTools.recorder.tooLong', { seconds: (clip.seconds ?? 0).toFixed(1) })
          : clip.verdict === 'unknown'
            ? t('voiceTools.recorder.unknownLength')
            : null
      : null;

  const micMessage =
    micError === 'denied'
      ? t('voiceTools.recorder.micDenied')
      : micError === 'host_blocked'
        ? t('voiceTools.recorder.micHostBlocked')
        : micError
          ? t('voiceTools.recorder.micUnavailable')
          : null;

  return (
    <div className="space-y-3">
      <VoiceNote>{gate === 'reference' ? t('voiceTools.recorder.referenceHint') : t('voiceTools.recorder.inputHint')}</VoiceNote>
      {clip ? (
        <div className="flex items-center justify-between gap-3 rounded-lg bg-muted/50 p-3">
          <div className="flex min-w-0 items-center gap-3">
            <FileAudio aria-hidden="true" className="size-5 shrink-0 text-primary" />
            <p className="truncate text-sm text-foreground" data-testid="voice-clip">
              {clip.source === 'recorded'
                ? t('voiceTools.recorder.recorded', { duration: formatElapsed((clip.seconds ?? 0) * 1000) })
                : t('voiceTools.recorder.uploaded', {
                    name: clip.file.name,
                    duration: clip.seconds === null ? '?' : formatElapsed(clip.seconds * 1000),
                  })}
            </p>
          </div>
          <button
            type="button"
            disabled={disabled}
            onClick={() => onClip(null)}
            aria-label={t('voiceTools.recorder.remove')}
            className="text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
          >
            <X aria-hidden="true" className="size-5" />
          </button>
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-3">
          {recordable ? (
            <>
              <AudioRecorder
                disabled={disabled}
                maxMs={gate === 'reference' ? VOICE_REFERENCE_MAX_SECONDS * 1000 : undefined}
                labels={{
                  record: t('voiceTools.recorder.record'),
                  recording: t('voiceTools.recorder.recording'),
                  stop: t('voiceTools.recorder.stop'),
                  cancel: t('voiceTools.recorder.cancel'),
                  level: t('voiceTools.recorder.level'),
                }}
                onRecorded={(take) => {
                  setMicError(null);
                  onClip(clipFromTake(take));
                }}
                onError={setMicError}
              />
              <span className="text-sm text-muted-foreground">{t('voiceTools.recorder.or')}</span>
            </>
          ) : null}
          <button type="button" disabled={disabled} className={BUTTON_SECONDARY} onClick={() => inputRef.current?.click()}>
            <Upload aria-hidden="true" className="size-4" />
            {t('voiceTools.recorder.upload')}
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="audio/*,video/*"
            className="hidden"
            aria-label={t('voiceTools.recorder.upload')}
            data-testid="voice-file-input"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void onFile(f);
              e.target.value = '';
            }}
          />
        </div>
      )}
      <div aria-live="polite">
        {measuring ? <p className="text-sm text-muted-foreground">{t('voiceTools.recorder.measuring')}</p> : null}
        {lengthMessage ? (
          <p className={clip?.verdict === 'unknown' ? 'text-sm text-muted-foreground' : 'text-sm text-destructive'} data-testid="voice-length-message">
            {lengthMessage}
          </p>
        ) : null}
        {micMessage ? <p className="text-sm text-destructive">{micMessage}</p> : null}
      </div>
    </div>
  );
};

/** Whether a clip may be sent as a voice reference (5 to 60 s, or unknown and left to the server). */
export function clipPassesGate(clip: VoiceClip | null): boolean {
  return !!clip && (clip.verdict === 'ok' || clip.verdict === 'unknown');
}

export default VoiceRecorderPanel;
