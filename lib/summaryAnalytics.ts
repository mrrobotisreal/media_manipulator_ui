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
