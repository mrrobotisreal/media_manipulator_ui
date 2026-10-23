'use client';

import { useMemo, useRef } from 'react';
import { EVENTS, useToolAnalytics } from '@/lib/analytics';
import type { ResultCompareMode, ResultEntryKind, ResultRung, ResultSurface } from '@/lib/analytics/events';
import type { ResultKind } from '@/lib/results/describe';

export type { ResultSurface };

/** `transcript_cue_seeked` is throttled to one per job per window. */
export const CUE_SEEK_THROTTLE_MS = 2000;

/**
 * Once-per-page-lifetime memory, module level so a modal reopen or a remount of the panel
 * for the same job does not count a second view (the same rule `result_previewed` follows).
 */
const viewedJobs = new Set<string>();
const comparedJobModes = new Set<string>();
const lastSeekAt = new Map<string, number>();

export function resetResultAnalyticsForTests(): void {
  viewedJobs.clear();
  comparedJobModes.clear();
  lastSeekAt.clear();
}

/** Coarse bucket for an archive entry; never the file name. */
export function entryKindOf(kind: ResultKind): ResultEntryKind {
  switch (kind) {
    case 'image':
    case 'gif':
      return 'image';
    case 'video':
      return 'video';
    case 'audio':
      return 'audio';
    case 'transcript':
    case 'captions':
    case 'metadata':
      return 'text';
    default:
      return 'other';
  }
}

const RUNGS: ReadonlySet<string> = new Set(['240p', '360p', '480p', '720p', '1080p', '1440p', '2160p']);

/** Bucket a rung label ('auto', '720p', ...) to the enum; anything else is 'other'. */
export function rungBucket(rung: string): ResultRung {
  if (rung === 'auto') return 'auto';
  return RUNGS.has(rung) ? (rung as ResultRung) : 'other';
}

export interface ResultAnalyticsArgs {
  jobId: string;
  kind: ResultKind;
  surface: ResultSurface;
  hasOriginal: boolean;
}

export interface ResultAnalytics {
  onViewed: () => void;
  onCompare: (mode: ResultCompareMode) => void;
  onDownload: () => void;
  onArchiveEntry: (entryKind: ResultKind) => void;
  onRung: (rung: string) => void;
  onSeek: () => void;
}

/**
 * The result viewers' event emitters. Callbacks are stable; they read the latest args
 * through a ref, so a panel re-render never re-fires or re-creates them.
 */
export function useResultAnalytics(args: ResultAnalyticsArgs): ResultAnalytics {
  const { track } = useToolAnalytics();
  const latest = useRef({ args, track });
  latest.current = { args, track };

  return useMemo<ResultAnalytics>(() => {
    const cur = () => latest.current;
    return {
      onViewed: () => {
        const { args: a, track: t } = cur();
        if (viewedJobs.has(a.jobId)) return;
        viewedJobs.add(a.jobId);
        t(
          EVENTS.RESULT_VIEWED,
          { job_id: a.jobId, kind: a.kind, surface: a.surface, has_original: a.hasOriginal },
          { job_id: a.jobId },
        );
      },
      onCompare: (mode) => {
        const { args: a, track: t } = cur();
        const key = `${a.jobId}:${mode}`;
        if (comparedJobModes.has(key)) return;
        comparedJobModes.add(key);
        t(EVENTS.RESULT_COMPARE_USED, { job_id: a.jobId, kind: a.kind, mode }, { job_id: a.jobId });
      },
      onDownload: () => {
        const { args: a, track: t } = cur();
        t(
          EVENTS.RESULT_DOWNLOAD_CLICKED,
          { job_id: a.jobId, kind: a.kind, surface: a.surface, viewed_first: viewedJobs.has(a.jobId) },
          { job_id: a.jobId },
        );
      },
      onArchiveEntry: (entryKind) => {
        const { args: a, track: t } = cur();
        t(
          EVENTS.RESULT_ARCHIVE_ENTRY_OPENED,
          { job_id: a.jobId, entry_kind: entryKindOf(entryKind) },
          { job_id: a.jobId },
        );
      },
      onRung: (rung) => {
        const { args: a, track: t } = cur();
        t(EVENTS.RESULT_STREAM_RUNG_SELECTED, { job_id: a.jobId, rung: rungBucket(rung) }, { job_id: a.jobId });
      },
      onSeek: () => {
        const { args: a, track: t } = cur();
        const now = Date.now();
        const last = lastSeekAt.get(a.jobId);
        if (last !== undefined && now - last < CUE_SEEK_THROTTLE_MS) return;
        lastSeekAt.set(a.jobId, now);
        t(EVENTS.TRANSCRIPT_CUE_SEEKED, { job_id: a.jobId }, { job_id: a.jobId });
      },
    };
  }, []);
}
