import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { analytics, EVENTS } from '@/lib/analytics';
import {
  TELEMETRY_FLUSH_INTERVAL_MS,
  editSummary,
  endStudioTelemetrySession,
  exportDurationRatioBucket,
  flushStudioTelemetry,
  markTti,
  perf,
  resetStudioTelemetryForTests,
  startStudioTelemetrySession,
  studioHost,
} from './telemetry';

type TrackCall = { name: string; props: Record<string, unknown> };

let tracked: TrackCall[];

beforeEach(() => {
  vi.useFakeTimers();
  tracked = [];
  vi.spyOn(analytics, 'track').mockImplementation(((name: string, props: unknown) => {
    tracked.push({ name, props: (props ?? {}) as Record<string, unknown> });
  }) as typeof analytics.track);
  vi.spyOn(analytics, 'flushSync').mockImplementation(() => {});
});

afterEach(() => {
  resetStudioTelemetryForTests();
  vi.restoreAllMocks();
  vi.useRealTimers();
});

function summaries(): TrackCall[] {
  return tracked.filter((c) => c.name === EVENTS.STUDIO_EDIT_SUMMARY);
}

function perfSamples(): TrackCall[] {
  return tracked.filter((c) => c.name === EVENTS.STUDIO_PERF_SAMPLE);
}

describe('editSummary aggregator', () => {
  it('buckets counters and resets after an explicit flush', () => {
    editSummary.increment('splits');
    editSummary.increment('splits');
    editSummary.increment('undoCount');
    flushStudioTelemetry();

    expect(summaries()).toHaveLength(1);
    const props = summaries()[0].props;
    expect(props.splits).toBe('1-10');
    expect(props.undoCount).toBe('1-10');
    expect(props.trimsRoll).toBeUndefined(); // zero counters are absent, not '0'
    expect(props.sessionSecondsBucket).toBe('<1m');
    expect(props.host).toBe('mm');

    // Counters were consumed: nothing further to flush.
    flushStudioTelemetry();
    expect(summaries()).toHaveLength(1);
  });

  it('flushes on the 120s interval with fake timers', () => {
    editSummary.increment('toolSwitches');
    vi.advanceTimersByTime(TELEMETRY_FLUSH_INTERVAL_MS);
    expect(summaries()).toHaveLength(1);

    // An empty interval emits nothing.
    vi.advanceTimersByTime(TELEMETRY_FLUSH_INTERVAL_MS);
    expect(summaries()).toHaveLength(1);
  });

  it('keeps per-subkey breakdown maps with bucketed values', () => {
    editSummary.increment('effectsAdded', 'lumetri');
    editSummary.increment('effectsAdded', 'lumetri');
    editSummary.increment('effectsAdded', 'chromakey');
    flushStudioTelemetry();

    const props = summaries()[0].props;
    expect(props.effectsAdded).toBe('1-10');
    expect(props.effectsByType).toEqual({ lumetri: '1-10', chromakey: '1-10' });
  });

  it('sanitizes subkeys and caps map cardinality into "other"', () => {
    editSummary.increment('transitionsAdded', 'Cross Fade!');
    for (let i = 0; i < 15; i += 1) editSummary.increment('transitionsAdded', `type${i}`);
    flushStudioTelemetry();

    const byType = summaries()[0].props.transitionsByType as Record<string, string>;
    expect(byType.crossfade).toBe('1-10');
    expect(byType.other).toBeDefined();
    expect(Object.keys(byType).length).toBeLessThanOrEqual(13); // 12 + 'other'
  });

  it('flushes on pagehide and pushes the queue out synchronously', () => {
    editSummary.increment('splits');
    window.dispatchEvent(new Event('pagehide'));
    expect(summaries()).toHaveLength(1);
    expect(analytics.flushSync).toHaveBeenCalled();
  });

  it('flushes on session end (editor unmount) and stops the timer', () => {
    const stop = startStudioTelemetrySession();
    editSummary.increment('redoCount');
    stop();
    expect(summaries()).toHaveLength(1);

    // The interval is gone: nothing more fires.
    vi.advanceTimersByTime(10 * TELEMETRY_FLUSH_INTERVAL_MS);
    expect(summaries()).toHaveLength(1);
  });

  it('buckets session duration from the session start', () => {
    editSummary.increment('splits');
    vi.advanceTimersByTime(TELEMETRY_FLUSH_INTERVAL_MS); // flush #1 at 2m
    editSummary.increment('splits');
    vi.advanceTimersByTime(TELEMETRY_FLUSH_INTERVAL_MS); // flush #2 at 4m
    expect(summaries()[0].props.sessionSecondsBucket).toBe('1-5m');
    expect(summaries()[1].props.sessionSecondsBucket).toBe('1-5m');
  });

  it('never throws when incrementing outside a browser session', () => {
    expect(() => editSummary.increment('mixerAdjustments')).not.toThrow();
  });
});

describe('perf sampler', () => {
  it('reports representative buckets over the window and resets', () => {
    perf.sample({ fps: 58, droppedFrameRatio: 0 });
    perf.sample({ fps: 59, droppedFrameRatio: 0.002 });
    perf.sample({ seekLatencyMs: 40 });
    perf.sample({ seekLatencyMs: 450 });
    perf.sample({ saveRttMs: 120 });
    flushStudioTelemetry();

    expect(perfSamples()).toHaveLength(1);
    const props = perfSamples()[0].props;
    expect(props.fpsBucket).toBe('55+');
    expect(props.droppedFrameRatioBucket).toBe('0');
    expect(props.seekLatencyP95Bucket).toBe('200-500ms'); // p95 tracks the slow seek
    expect(props.saveRttBucket).toBe('50-200ms');
    expect(props.webglFallback).toBeUndefined();

    flushStudioTelemetry();
    expect(perfSamples()).toHaveLength(1); // window consumed
  });

  it('latches the WebGL fallback flag', () => {
    perf.sample({ webglFallback: true });
    flushStudioTelemetry();
    expect(perfSamples()[0].props.webglFallback).toBe(true);
  });

  it('sends TTI exactly once per session', () => {
    markTti(1800);
    markTti(9000); // ignored: first call wins
    flushStudioTelemetry();
    expect(perfSamples()[0].props.ttiMsBucket).toBe('1-2.5s');

    perf.sample({ fps: 30 });
    flushStudioTelemetry();
    expect(perfSamples()[1].props.ttiMsBucket).toBeUndefined();
  });

  it('emits nothing when the window is empty', () => {
    flushStudioTelemetry();
    expect(perfSamples()).toHaveLength(0);
  });
});

describe('helpers', () => {
  it('studioHost defaults to mm on the standalone site', () => {
    expect(studioHost()).toBe('mm');
  });

  it('exportDurationRatioBucket guards unusable inputs', () => {
    expect(exportDurationRatioBucket(30_000, 60)).toBe('0.5-1x');
    expect(exportDurationRatioBucket(60_000, 60)).toBe('1-2x'); // exactly realtime
    expect(exportDurationRatioBucket(180_000, 60)).toBe('2-4x');
    expect(exportDurationRatioBucket(undefined, 60)).toBeUndefined();
    expect(exportDurationRatioBucket(60_000, 0)).toBeUndefined();
    expect(exportDurationRatioBucket(-5, 60)).toBeUndefined();
  });

  it('endStudioTelemetrySession is idempotent', () => {
    startStudioTelemetrySession();
    endStudioTelemetrySession();
    expect(() => endStudioTelemetrySession()).not.toThrow();
  });
});
