import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, renderHook } from '@testing-library/react';
import { entryKindOf, resetResultAnalyticsForTests, rungBucket, useResultAnalytics } from './result-analytics';

const track = vi.fn();
vi.mock('@/lib/analytics', async () => {
  const actual = await vi.importActual<typeof import('@/lib/analytics')>('@/lib/analytics');
  return { ...actual, useToolAnalytics: () => ({ track, toolSlug: 'x', setMediaKind: () => undefined }) };
});

const args: Parameters<typeof useResultAnalytics>[0] = { jobId: 'j1', kind: 'video', surface: 'tool_page', hasOriginal: true };
const names = () => track.mock.calls.map((c) => c[0]);

describe('useResultAnalytics', () => {
  beforeEach(() => {
    track.mockClear();
    resetResultAnalyticsForTests();
    vi.useFakeTimers();
  });
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it('result_viewed fires once per job across re-renders and a modal reopen', () => {
    const first = renderHook(() => useResultAnalytics(args));
    act(() => first.result.current.onViewed());
    first.rerender();
    act(() => first.result.current.onViewed());
    first.unmount();
    const reopened = renderHook(() => useResultAnalytics(args));
    act(() => reopened.result.current.onViewed());
    expect(names()).toEqual(['result_viewed']);
    expect(track).toHaveBeenCalledWith(
      'result_viewed',
      { job_id: 'j1', kind: 'video', surface: 'tool_page', has_original: true },
      { job_id: 'j1' },
    );
  });

  it('keeps callbacks stable across renders', () => {
    const { result, rerender } = renderHook((p: Parameters<typeof useResultAnalytics>[0]) => useResultAnalytics(p), { initialProps: args });
    const before = result.current;
    rerender({ ...args, surface: 'home' });
    expect(result.current).toBe(before);
  });

  it('viewed_first is true after a view and false when download is clicked first', () => {
    const a = renderHook(() => useResultAnalytics({ ...args, jobId: 'a' })).result.current;
    act(() => a.onDownload());
    const b = renderHook(() => useResultAnalytics({ ...args, jobId: 'b' })).result.current;
    act(() => b.onViewed());
    act(() => b.onDownload());
    expect(track.mock.calls[0][1]).toMatchObject({ job_id: 'a', viewed_first: false });
    expect(track.mock.calls[2][1]).toMatchObject({ job_id: 'b', viewed_first: true });
  });

  it('compare fires once per (job, mode)', () => {
    const { result } = renderHook(() => useResultAnalytics(args));
    act(() => {
      result.current.onCompare('wipe');
      result.current.onCompare('wipe');
      result.current.onCompare('toggle');
    });
    expect(track.mock.calls.map((c) => c[1].mode)).toEqual(['wipe', 'toggle']);
  });

  it('cue seeks are throttled to one per 2 s per job', () => {
    const { result } = renderHook(() => useResultAnalytics(args));
    act(() => result.current.onSeek());
    vi.advanceTimersByTime(1500);
    act(() => result.current.onSeek());
    expect(names()).toEqual(['transcript_cue_seeked']);
    vi.advanceTimersByTime(600);
    act(() => result.current.onSeek());
    expect(names()).toEqual(['transcript_cue_seeked', 'transcript_cue_seeked']);
  });

  it('buckets entry kinds and rungs, never raw values', () => {
    const { result } = renderHook(() => useResultAnalytics(args));
    act(() => {
      result.current.onArchiveEntry('gif');
      result.current.onArchiveEntry('pdf');
      result.current.onRung('720p');
      result.current.onRung('854p');
      result.current.onRung('auto');
    });
    expect(track.mock.calls.map((c) => c[1].entry_kind ?? c[1].rung)).toEqual(['image', 'other', '720p', 'other', 'auto']);
    expect(entryKindOf('captions')).toBe('text');
    expect(rungBucket('2160p')).toBe('2160p');
  });
});
