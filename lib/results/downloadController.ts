'use client';

import { useSyncExternalStore } from 'react';
import { analytics, EVENTS, safeFileExtension, takeJobDuration } from '@/lib/analytics';
import type { EventName, PropsFor, TrackOptions } from '@/lib/analytics/events';
import { authedFetch } from '@/lib/auth/authedFetch';
import { absoluteApiUrl } from '@/lib/share/apiUrl';
import { getBaseURL } from '@/lib/utils';
import { saveBlobToDisk } from './save';

/**
 * MM80: result downloads go through the browser's own download manager.
 *
 * The old path fetched `/download/:jobId` with identity headers and `await response.blob()`,
 * so an 880 MB WAV had to sit entirely in page memory before anything reached the
 * downloads list; it never did, and the button only showed a small spinner. Now:
 *
 *   - bytes the viewer ALREADY holds (and that are small) are saved from memory, as before;
 *   - everything else asks the API for a short-lived signed link
 *     (`POST /api/download/:jobId/link`, owner headers) and hands that URL to a plain anchor
 *     click. The browser streams it to disk with its own progress, pause and resume.
 *
 * Status lives in a module-level store keyed by job id, so every surface that shows the same
 * job (the result panel, the home button, a history row) agrees, and a remount cannot start a
 * second parallel download.
 *
 * Analytics: `download_started` fires on click for a link download. The browser owns completion
 * now, so NO client `download_completed` is emitted for it; the API's `server_download_served`
 * is the truth. The from-memory path keeps emitting `download_completed` (the save is genuinely
 * done when it returns), exactly as before. A failed link request emits `download_failed`.
 */

/** Bytes already in memory are saved directly only up to this size. */
export const CACHED_SAVE_MAX_BYTES = 100 * 1024 * 1024;
/** A repeat click this soon after a download started is ignored. */
export const REPEAT_GUARD_MS = 5000;

export type DownloadPhase = 'idle' | 'preparing' | 'started' | 'failed';

export interface DownloadStatus {
  phase: DownloadPhase;
  /** When the phase was entered (ms epoch). */
  at: number;
  /** Size of the file being downloaded, when known (descriptor or the link response). */
  sizeBytes?: number;
  /** How the bytes were delivered. */
  via?: 'link' | 'cache';
  /** HTTP status of a failed link request. */
  errorStatus?: number;
}

const IDLE: DownloadStatus = { phase: 'idle', at: 0 };
const statuses = new Map<string, DownloadStatus>();
const listeners = new Set<() => void>();

function setStatus(jobId: string, next: DownloadStatus) {
  statuses.set(jobId, next);
  listeners.forEach((listener) => listener());
}

export function getDownloadStatus(jobId: string | null | undefined): DownloadStatus {
  return (jobId && statuses.get(jobId)) || IDLE;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** The live download status of one job (shared by every surface showing it). */
export function useDownloadStatus(jobId: string | null | undefined): DownloadStatus {
  return useSyncExternalStore(
    subscribe,
    () => getDownloadStatus(jobId),
    () => IDLE,
  );
}

/** Test seam. */
export function resetDownloadStatusesForTests(): void {
  statuses.clear();
  listeners.forEach((listener) => listener());
}

export interface DownloadLink {
  url: string;
  expiresAt?: string;
  sizeBytes?: number;
  fileName?: string;
}

/** `POST /api/download/:jobId/link`: the owner's identity headers buy a 5-minute signed URL. */
export async function requestDownloadLink(jobId: string, fileName?: string): Promise<DownloadLink> {
  const response = await authedFetch(`${getBaseURL()}/download/${encodeURIComponent(jobId)}/link`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(fileName ? { fileName } : {}),
  });
  if (!response.ok) {
    throw Object.assign(new Error(`Download link failed: ${response.status}`), { status: response.status });
  }
  const body = (await response.json()) as Partial<DownloadLink>;
  if (!body.url || typeof body.url !== 'string') throw new Error('Download link missing');
  return {
    url: absoluteApiUrl(body.url),
    expiresAt: body.expiresAt,
    sizeBytes: typeof body.sizeBytes === 'number' && body.sizeBytes >= 0 ? body.sizeBytes : undefined,
    fileName: body.fileName,
  };
}

/**
 * Hand a URL to the browser's download manager. The API answers with
 * `Content-Disposition: attachment`, so the page does not navigate; the anchor's `download`
 * attribute is only a hint (ignored cross-origin, where the header decides the name).
 */
export function startNativeDownload(url: string, fileName: string): void {
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.rel = 'noopener';
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  link.remove();
}

type Track = <E extends EventName>(name: E, props?: PropsFor<E>, options?: TrackOptions) => void;

export interface DownloadResultOptions {
  jobId: string;
  /** Save-as name (also sent to the API so the attachment carries it). */
  fileName: string;
  /** Bytes the caller already holds; used when small enough. */
  cachedBlob?: Blob | null;
  /** Known result size (descriptor), for the status line before the link answers. */
  sizeBytes?: number;
  /** Analytics sink (a tool's `track`); defaults to the global client. */
  track?: Track;
  /** Extra context for every event (home passes its media kind). */
  trackOptions?: TrackOptions;
  /** Delivered format for the events; defaults to the save-as name's extension. */
  outputFormat?: string;
  /** Home's legacy: the from-memory `download_completed` carries the job's duration. */
  includeJobDuration?: boolean;
  /** After a download was handed to the browser (the upgrade nudge). */
  onDownloaded?: () => void;
}

export type DownloadOutcome =
  | { outcome: 'cache' | 'link' }
  | { outcome: 'skipped' }
  | { outcome: 'failed'; error: unknown };

/** One click on a result's Download action. Never throws. */
export async function downloadResult(options: DownloadResultOptions): Promise<DownloadOutcome> {
  const { jobId, fileName, cachedBlob, onDownloaded } = options;
  const track: Track = options.track ?? ((name, props, opts) => analytics.track(name, props, opts));
  const trackOptions: TrackOptions = { job_id: jobId, ...options.trackOptions };
  const outputFormat = options.outputFormat || safeFileExtension(fileName);

  const current = getDownloadStatus(jobId);
  const now = Date.now();
  if (current.phase === 'preparing') return { outcome: 'skipped' };
  if (current.phase === 'started' && now - current.at < REPEAT_GUARD_MS) return { outcome: 'skipped' };

  if (cachedBlob && cachedBlob.size <= CACHED_SAVE_MAX_BYTES) {
    try {
      saveBlobToDisk(cachedBlob, fileName);
    } catch (error) {
      setStatus(jobId, { phase: 'failed', at: Date.now(), sizeBytes: cachedBlob.size, via: 'cache' });
      track(
        EVENTS.DOWNLOAD_FAILED,
        { job_id: jobId, reason: error instanceof Error ? error.message : 'unknown' },
        trackOptions,
      );
      return { outcome: 'failed', error };
    }
    setStatus(jobId, { phase: 'started', at: Date.now(), sizeBytes: cachedBlob.size, via: 'cache' });
    track(
      EVENTS.DOWNLOAD_COMPLETED,
      {
        job_id: jobId,
        output_format: outputFormat,
        size_bytes: cachedBlob.size,
        ...(options.includeJobDuration ? { duration_ms: takeJobDuration(jobId) } : {}),
      },
      trackOptions,
    );
    onDownloaded?.();
    return { outcome: 'cache' };
  }

  const knownSize = options.sizeBytes ?? cachedBlob?.size;
  setStatus(jobId, { phase: 'preparing', at: now, sizeBytes: knownSize, via: 'link' });
  track(
    EVENTS.DOWNLOAD_STARTED,
    { job_id: jobId, output_format: outputFormat, ...(knownSize !== undefined ? { size_bytes: knownSize } : {}) },
    trackOptions,
  );
  try {
    const link = await requestDownloadLink(jobId, fileName);
    startNativeDownload(link.url, link.fileName || fileName);
    setStatus(jobId, { phase: 'started', at: Date.now(), sizeBytes: link.sizeBytes ?? knownSize, via: 'link' });
    // The job's life in the UI ends here (the old fetch path consumed it on completion).
    takeJobDuration(jobId);
    onDownloaded?.();
    return { outcome: 'link' };
  } catch (error) {
    const status = (error as { status?: number } | null)?.status;
    setStatus(jobId, { phase: 'failed', at: Date.now(), sizeBytes: knownSize, via: 'link', errorStatus: status });
    track(
      EVENTS.DOWNLOAD_FAILED,
      {
        job_id: jobId,
        reason: error instanceof Error ? error.message : 'network error',
        ...(typeof status === 'number' ? { status } : {}),
      },
      trackOptions,
    );
    return { outcome: 'failed', error };
  }
}
