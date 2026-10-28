'use client';

import React from 'react';
import { Download } from 'lucide-react';
import useGetJobStatus, { type ConversionJob } from '@/lib/useGetJobStatus';
import { describe as describeResult } from '@/lib/results/describe';
import { ResultPanel } from '@/components/results/result-panel';
import { saveBlobToDisk } from '@/lib/results/save';
import useDownloadFile from '@/lib/useDownloadFile';
import { useLocalization } from '@/i18n/useLocalization';
import { blobToWav, wavFileName } from '@/lib/voices/wav';
import { useVoiceGenerated } from '@/lib/voices/analytics';
import { BUTTON_SECONDARY, Spinner, VoiceNote } from './shared';

/**
 * A voice job's progress and result (MM78 decision 5). The job id from the 202 answer
 * goes through the existing `useGetJobStatus` poller and the shared `ResultPanel`: no
 * second poller. The result is audio (`describe()` maps the voice tasks to `audio`).
 *
 * - Every result: the audio viewer, "Download MP3" (the served file) and "Download WAV".
 *   The API serves only speech.mp3 (MM77 §10.8), so the WAV is decoded from it in the
 *   browser (Web Audio) and written as 16-bit PCM.
 * - Convert and shift pass the `original` file, which turns on the MM02 audio A/B compare.
 */
export const VoiceJobResult: React.FC<{
  job: ConversionJob;
  setJob: (job: ConversionJob | null) => void;
  /** voice_tts | voice_convert | voice_shift: the describe() task. */
  task: 'voice_tts' | 'voice_convert' | 'voice_shift';
  /** The recording that was changed; enables A/B compare. */
  original?: File | null;
  fallbackFileName: string;
  onRunAnother?: () => void;
  /**
   * MM79 voice_generated: the requested language code (TTS, convert to a preset), or
   * undefined (`none`: shift, convert to a saved voice).
   */
  language?: string;
}> = ({ job, setJob, task, original, fallbackFileName, onRunAnother, language }) => {
  const { t } = useLocalization('interface');
  const { data } = useGetJobStatus(job);
  // MM79: one voice_generated per completed job (source tool_page; Darkroom emits its own).
  useVoiceGenerated(job, { tool: task, language, source: 'tool_page' });
  const { downloadFile } = useDownloadFile();
  // The panel streams audio inline (resultMime audio/mpeg), so it may never hold the
  // bytes; the WAV button reuses them when it does and fetches the MP3 otherwise.
  const [blob, setBlob] = React.useState<Blob | null>(null);
  const [wavState, setWavState] = React.useState<'idle' | 'working' | 'failed'>('idle');

  React.useEffect(() => {
    if (data && (data.status !== job.status || data.progress !== job.progress)) setJob({ ...job, ...data });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  if (job.status === 'failed') {
    return (
      <p role="alert" className="rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
        {job.error || t('voiceTools.result.failed')}
      </p>
    );
  }
  if (job.status !== 'completed') {
    const progress = job.progress ?? 0;
    return (
      <div className="text-center" aria-live="polite">
        <p className="mb-2 text-sm text-muted-foreground">
          {t('voiceTools.result.working')} {progress ? `· ${progress}%` : ''}
        </p>
        <div className="h-2 w-full rounded-full bg-muted">
          <div className="h-2 rounded-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>
    );
  }

  const descriptor = describeResult({ job, originalFile: original ?? null, task, fallbackFileName });
  const downloadWav = async () => {
    setWavState('working');
    try {
      const mp3 = blob ?? (await downloadFile(job.id));
      saveBlobToDisk(await blobToWav(mp3), wavFileName(descriptor.fileName));
      setWavState('idle');
    } catch {
      setWavState('failed');
    }
  };

  return (
    <div className="space-y-3" data-testid="voice-result">
      <ResultPanel
        descriptor={descriptor}
        downloadLabel={t('voiceTools.result.downloadMp3')}
        onBlobLoaded={setBlob}
        onRunAnother={onRunAnother}
      />
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" className={BUTTON_SECONDARY} disabled={wavState === 'working'} onClick={() => void downloadWav()}>
          {wavState === 'working' ? <Spinner /> : <Download aria-hidden="true" className="size-4" />}
          {wavState === 'working' ? t('voiceTools.result.wavPreparing') : t('voiceTools.result.downloadWav')}
        </button>
        <VoiceNote>{t('voiceTools.result.wavNote')}</VoiceNote>
      </div>
      {wavState === 'failed' ? (
        <p role="alert" className="text-sm text-destructive">
          {t('voiceTools.result.wavFailed')}
        </p>
      ) : null}
    </div>
  );
};

/** The ConversionJob a 202 voices answer starts. */
export function jobFromStart(jobId: string, original?: File | null): ConversionJob {
  return { id: jobId, status: 'processing', originalFile: original ?? new File([], 'speech'), progress: 0 };
}

export default VoiceJobResult;
