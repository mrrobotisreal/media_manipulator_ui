'use client';

import { useEffect } from 'react';
import { analytics, EVENTS, voiceSecondsBucket } from '@/lib/analytics';
import type {
  VoiceCreatedKindProp,
  VoiceCreatedProps,
  VoiceGeneratedKindProp,
  VoiceGeneratedProps,
  VoiceSourceProp,
} from '@/lib/analytics/events';

/**
 * Voices analytics (MM79), the one place the two voices events are built. Names come
 * from EVENTS (lib/analytics/events.ts ⇄ the analytics catalog.go ⇄ EVENT_CATALOG.md);
 * props are closed vocabularies only: never a voice name, a description, the text or
 * audio. A language code that is not a bare two-letter code is reported as `none`.
 */

const LANG_RE = /^[a-z]{2}$/;
const lang = (code: string | undefined | null) => (code && LANG_RE.test(code) ? code : 'none');

export function voiceCreatedProps(kind: VoiceCreatedKindProp, languageHint: string | undefined): VoiceCreatedProps {
  return { kind, languageHint: lang(languageHint) === 'none' ? 'en' : (languageHint as string) };
}

/** voice_created, once the API answered 201. */
export function trackVoiceCreated(kind: VoiceCreatedKindProp, languageHint: string | undefined): void {
  analytics.track(EVENTS.VOICE_CREATED, voiceCreatedProps(kind, languageHint), { feature: 'voices' });
}

/** The job tool (API) → the event's kind. */
export function voiceKindForTool(tool: string): VoiceGeneratedKindProp {
  if (tool === 'voice_convert') return 'convert';
  if (tool === 'voice_shift') return 'shift';
  return 'tts';
}

export function voiceGeneratedProps(input: {
  tool: string;
  resultSeconds: number | undefined;
  language: string | undefined;
  source: VoiceSourceProp;
}): VoiceGeneratedProps {
  const kind = voiceKindForTool(input.tool);
  return {
    kind,
    secondsBucket: voiceSecondsBucket(typeof input.resultSeconds === 'number' ? input.resultSeconds : 0),
    language: kind === 'shift' ? 'none' : lang(input.language),
    source: input.source,
  };
}

/** Jobs already reported this page load: a remount or a re-poll never counts twice. */
const reported = new Set<string>();
export function resetVoiceAnalyticsForTests(): void {
  reported.clear();
}

/** voice_generated, exactly once per completed job id. Returns whether it fired. */
export function trackVoiceGenerated(
  jobId: string,
  input: { tool: string; resultSeconds: number | undefined; language: string | undefined; source: VoiceSourceProp },
): boolean {
  if (!jobId || reported.has(jobId)) return false;
  reported.add(jobId);
  analytics.track(EVENTS.VOICE_GENERATED, voiceGeneratedProps(input), { job_id: jobId, feature: 'voices' });
  return true;
}

/** Hook form for the tool pages: fires when the polled job first reads completed. */
export function useVoiceGenerated(
  job: { id: string; status: string; resultSeconds?: number } | null,
  meta: { tool: string; language: string | undefined; source: VoiceSourceProp },
): void {
  const completed = job?.status === 'completed';
  useEffect(() => {
    if (!job || !completed) return;
    trackVoiceGenerated(job.id, { tool: meta.tool, resultSeconds: job.resultSeconds, language: meta.language, source: meta.source });
  }, [job, completed, meta.tool, meta.language, meta.source]);
}
