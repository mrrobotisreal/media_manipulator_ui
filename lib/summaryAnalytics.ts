import { useEffect } from 'react';
import { EVENTS, useToolAnalytics } from '@/lib/analytics';
import { timelineDurationBucket } from '@/lib/analytics/buckets';
import type { SummaryGeneratedProps } from '@/lib/analytics/events';
import type { ConversionJob } from '@/lib/useGetJobStatus';
import type { TranscodeJobStage } from '@/lib/transcodeTypes';

/**
 * Facts about a finished summary job, read from what GET /job/:id already reports (no extra
 * request): the stage messages the MM74 pipeline writes and the job's recorded options.
 *
 *   frames stage completed  -> message "<n> frames"
 *   audio stage completed   -> "<n> segments", or "No speech detected"
 *   audio stage skipped     -> "No audio track" (no speech)
 */

/** Frames the pipeline sampled (0 when the frame stage was skipped, failed or unreported). */
export function framesFromStages(stages: TranscodeJobStage[] | undefined): number {
  const frames = stages?.find((s) => s.key === 'frames');
  if (!frames || frames.status !== 'completed') return 0;
  const m = /(\d+)\s*frames?/i.exec(frames.message ?? '');
  return m ? Number(m[1]) : 0;
}

/** Whether Whisper found speech: the audio stage completed without "No speech detected". */
export function hasSpeechFromStages(stages: TranscodeJobStage[] | undefined): boolean {
  const audio = stages?.find((s) => s.key === 'audio');
  if (!audio || audio.status !== 'completed') return false;
  return !/no speech/i.test(audio.message ?? '');
}

/* ------------------------------------------------------------------------- */
/* summary_generated (MM75)                                                   */
/* ------------------------------------------------------------------------- */

const LOCALE_RE = /^[a-z]{2}-[A-Z]{2}$/;

/**
 * The five props of `summary_generated`, all read from the completed job the panel already
 * polled. `durationBucket` uses the shared timelineDurationBucket (one definition per bucket),
 * `depth` and `outputLanguage` are the server's recorded EFFECTIVE options.
 */
export function summaryGeneratedProps(
  job: Pick<ConversionJob, 'stages' | 'options' | 'sourceDurationSeconds'>,
): SummaryGeneratedProps {
  const opts = job.options ?? {};
  const lang = typeof opts.outputLanguage === 'string' ? opts.outputLanguage : 'auto';
  const duration = job.sourceDurationSeconds;
  return {
    durationBucket: typeof duration === 'number' && duration > 0 ? timelineDurationBucket(duration) : '0',
    frames: framesFromStages(job.stages),
    hasSpeech: hasSpeechFromStages(job.stages),
    depth: opts.depth === 'deep' ? 'deep' : 'standard',
    outputLanguage: LOCALE_RE.test(lang) ? lang : 'auto',
  };
}

/** Jobs already reported this page load: a remount or a re-poll never counts twice. */
const reported = new Set<string>();
export function resetSummaryAnalyticsForTests(): void {
  reported.clear();
}

/** Emits `summary_generated` exactly once for a job, the first time it is seen completed. */
export function useSummaryGenerated(job: ConversionJob | null): void {
  const { track } = useToolAnalytics();
  const completed = job?.status === 'completed';
  useEffect(() => {
    if (!job || !completed || reported.has(job.id)) return;
    reported.add(job.id);
    track(EVENTS.SUMMARY_GENERATED, summaryGeneratedProps(job), { job_id: job.id, feature: 'video_summary' });
  }, [job, completed, track]);
}
