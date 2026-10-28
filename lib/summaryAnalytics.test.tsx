import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import type { ConversionJob } from '@/lib/useGetJobStatus';
import { EVENTS, EVENT_PRIORITY } from '@/lib/analytics/events';

const track = vi.hoisted(() => vi.fn());
vi.mock('@/lib/analytics', async (orig) => ({
  ...(await orig<typeof import('@/lib/analytics')>()),
  useToolAnalytics: () => ({ track, toolSlug: 'summarize-video', mediaKind: 'video', setMediaKind: () => undefined }),
}));

import {
  framesFromStages,
  hasSpeechFromStages,
  resetSummaryAnalyticsForTests,
  summaryGeneratedProps,
  useSummaryGenerated,
} from './summaryAnalytics';

const STAGES = [
  { key: 'probe', label: '', status: 'completed' as const, progress: 5 },
  { key: 'audio', label: '', status: 'completed' as const, progress: 25, message: '84 segments' },
  { key: 'frames', label: '', status: 'completed' as const, progress: 40, message: '24 frames' },
  { key: 'vision', label: '', status: 'completed' as const, progress: 70, message: '6 batches' },
  { key: 'synthesis', label: '', status: 'completed' as const, progress: 95 },
  { key: 'render', label: '', status: 'completed' as const, progress: 100 },
];

const job = (over: Partial<ConversionJob> = {}): ConversionJob => ({
  id: 'job-s1',
  status: 'completed',
  originalFile: new File([], 'temp'),
  stages: STAGES,
  options: { mode: 'summarize', outputLanguage: 'de-DE', depth: 'standard', maxFrames: 24 },
  sourceDurationSeconds: 400,
  ...over,
});

function Probe({ j }: { j: ConversionJob | null }) {
  useSummaryGenerated(j);
  return null;
}

beforeEach(() => resetSummaryAnalyticsForTests());
afterEach(() => {
  cleanup();
  track.mockClear();
});

describe('summary_generated props', () => {
  it('reads the five props from the polled job', () => {
    expect(summaryGeneratedProps(job())).toEqual({
      durationBucket: '2m-10m',
      frames: 24,
      hasSpeech: true,
      depth: 'standard',
      outputLanguage: 'de-DE',
    });
  });

  it('audio-only, silent, deep and unknown values', () => {
    const silentAudio = job({
      stages: [
        { key: 'audio', label: '', status: 'completed', progress: 25, message: 'No speech detected' },
        { key: 'frames', label: '', status: 'skipped', progress: 40, message: 'Audio only' },
      ],
      options: { depth: 'deep', outputLanguage: 'auto' },
      sourceDurationSeconds: undefined,
    });
    expect(summaryGeneratedProps(silentAudio)).toEqual({
      durationBucket: '0', frames: 0, hasSpeech: false, depth: 'deep', outputLanguage: 'auto',
    });
    expect(summaryGeneratedProps(job({ options: { outputLanguage: 'klingon', depth: 'huge' } }))).toMatchObject({
      outputLanguage: 'auto', depth: 'standard',
    });
    expect(framesFromStages(undefined)).toBe(0);
    expect(hasSpeechFromStages([{ key: 'audio', label: '', status: 'skipped', progress: 0, message: 'No audio track' }])).toBe(false);
  });

  it('is a HIGH-priority catalog event', () => {
    expect(EVENTS.SUMMARY_GENERATED).toBe('summary_generated');
    expect(EVENT_PRIORITY.summary_generated).toBe(1);
  });
});

describe('useSummaryGenerated', () => {
  it('emits exactly once per completed summary, with the five props', () => {
    const { rerender } = render(<Probe j={job({ status: 'processing' })} />);
    expect(track).not.toHaveBeenCalled();
    rerender(<Probe j={job()} />);
    rerender(<Probe j={{ ...job(), progress: 100 }} />);
    render(<Probe j={job()} />);
    expect(track).toHaveBeenCalledTimes(1);
    expect(track).toHaveBeenCalledWith(
      'summary_generated',
      { durationBucket: '2m-10m', frames: 24, hasSpeech: true, depth: 'standard', outputLanguage: 'de-DE' },
      { job_id: 'job-s1', feature: 'video_summary' },
    );
  });

  it('never emits for a failed job', () => {
    render(<Probe j={job({ status: 'failed' })} />);
    expect(track).not.toHaveBeenCalled();
  });
});
