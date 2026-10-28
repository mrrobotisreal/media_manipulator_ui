'use client';

import { useSyncExternalStore } from 'react';
import { analytics, EVENTS } from '@/lib/analytics';
import type { EventName, PropsFor, TrackOptions } from '@/lib/analytics/events';
import { authedFetch } from '@/lib/auth/authedFetch';
import { absoluteApiUrl } from '@/lib/share/apiUrl';
import { getBaseURL } from '@/lib/utils';
import { startNativeDownload } from './downloadController';

/**
 * MM81: "Download as MP3" for an existing WAV result (the 880 MB vocal stems made before
 * stems followed the input format).
 *
 *   POST /api/download/:jobId/mp3 (owner headers)
 *     202 {status:"processing"} -> the server is encoding the finished WAV once (ffmpeg,
 *         MP3 320k, cached next to the result); poll GET until ready
 *     200 {status:"ready", url, sizeBytes, fileName} -> a MM80 signed link: hand it to the
 *         browser's download manager, exactly like Download (never buffered in JS)
 *
 * Free: no quota, never an AI operation. Status lives in a per-job store so a remount or a
 * second surface showing the job agrees and a double click cannot start two conversions.
 *
 * Analytics, through the existing catalog only: `download_started` (output_format "mp3") on
 * click, `download_failed` on failure. The API's `server_download_served` reports the served
 * MP3 with output_format "mp3".
 */

export type Mp3Phase = 'idle' | 'converting' | 'started' | 'failed';

export interface Mp3Status {
  phase: Mp3Phase;
  at: number;
  sizeBytes?: number;
  errorStatus?: number;
}

/** Poll cadence while the server encodes. */
export const MP3_POLL_MS = 2000;
/** Give up waiting after this long (the encode keeps going; a later click picks it up). */
export const MP3_POLL_TIMEOUT_MS = 20 * 60 * 1000;

const IDLE: Mp3Status = { phase: 'idle', at: 0 };
const statuses = new Map<string, Mp3Status>();
const listeners = new Set<() => void>();

function setStatus(jobId: string, next: Mp3Status) {
  statuses.set(jobId, next);
  listeners.forEach((l) => l());
}

export function getMp3Status(jobId: string | null | undefined): Mp3Status {
  return (jobId && statuses.get(jobId)) || IDLE;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useMp3Status(jobId: string | null | undefined): Mp3Status {
  return useSyncExternalStore(subscribe, () => getMp3Status(jobId), () => IDLE);
}

/** Test seam. */
export function resetMp3StatusesForTests(): void {
  statuses.clear();
  listeners.forEach((l) => l());
}

/**
 * Whether a job is a vocal stem, from whatever the surface knows: the AI operation, the API's
 * tool id (`ai_remove_vocals`, account history) or the tool-page slug (recent strip).
 */
export function isVocalStemJob(hint: string | null | undefined): boolean {
  const h = (hint ?? '').trim().toLowerCase();
  return (
    h === 'isolate_vocals' ||
    h === 'remove_vocals' ||
    h === 'ai_isolate_vocals' ||
    h === 'ai_remove_vocals' ||
    h === 'isolate-vocals-from-song' ||
    h === 'remove-vocals-from-song'
  );
}

/** True for a result the API can convert (a WAV). */
export function canDownloadAsMp3(fileName: string | null | undefined): boolean {
  return /\.wav$/i.test((fileName ?? '').trim());
}

/** `My Song_converted.wav` -> `My Song_converted.mp3`. */
export function mp3NameFor(fileName: string): string {
  const base = fileName.replace(/\.[^.]*$/, '') || 'converted';
  return `${base}.mp3`;
}

interface Mp3Response {
  status?: 'none' | 'processing' | 'ready' | 'failed';
  url?: string;
  sizeBytes?: number;
  fileName?: string;
  error?: string;
}

async function call(jobId: string, method: 'POST' | 'GET'): Promise<Mp3Response> {
  const response = await authedFetch(`${getBaseURL()}/download/${encodeURIComponent(jobId)}/mp3`, {
    method,
    ...(method === 'POST' ? { headers: { 'Content-Type': 'application/json' }, body: '{}' } : {}),
  });
  if (!response.ok && response.status !== 202) {
    throw Object.assign(new Error(`MP3 download failed: ${response.status}`), { status: response.status });
  }
  return (await response.json()) as Mp3Response;
}

type Track = <E extends EventName>(name: E, props?: PropsFor<E>, options?: TrackOptions) => void;

export interface DownloadAsMp3Options {
  jobId: string;
  /** The WAV's save-as name; the MP3 is saved as the same name with .mp3. */
  fileName: string;
  track?: Track;
  trackOptions?: TrackOptions;
  /** Test seams. */
  sleep?: (ms: number) => Promise<void>;
  now?: () => number;
}

const defaultSleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/** One click on "Download as MP3". Never throws. */
export async function downloadResultAsMp3(options: DownloadAsMp3Options): Promise<'started' | 'skipped' | 'failed'> {
  const { jobId } = options;
  const track: Track = options.track ?? ((name, props, opts) => analytics.track(name, props, opts));
  const trackOptions: TrackOptions = { job_id: jobId, ...options.trackOptions };
  const sleep = options.sleep ?? defaultSleep;
  const now = options.now ?? Date.now;
  const saveAs = mp3NameFor(options.fileName);

  if (getMp3Status(jobId).phase === 'converting') return 'skipped';
  setStatus(jobId, { phase: 'converting', at: now() });
  track(EVENTS.DOWNLOAD_STARTED, { job_id: jobId, output_format: 'mp3' }, trackOptions);

  const fail = (error: unknown, reason?: string) => {
    const status = (error as { status?: number } | null)?.status;
    setStatus(jobId, { phase: 'failed', at: now(), errorStatus: status });
    track(
      EVENTS.DOWNLOAD_FAILED,
      {
        job_id: jobId,
        reason: reason ?? (error instanceof Error ? error.message : 'mp3 conversion failed'),
        ...(typeof status === 'number' ? { status } : {}),
      },
      trackOptions,
    );
    return 'failed' as const;
  };

  try {
    let res = await call(jobId, 'POST');
    const deadline = now() + MP3_POLL_TIMEOUT_MS;
    while (res.status === 'processing') {
      if (now() > deadline) return fail(null, 'mp3 conversion timed out');
      await sleep(MP3_POLL_MS);
      res = await call(jobId, 'GET');
    }
    if (res.status !== 'ready' || !res.url) {
      return fail(null, res.error || `mp3 status ${res.status ?? 'unknown'}`);
    }
    startNativeDownload(absoluteApiUrl(res.url), res.fileName || saveAs);
    setStatus(jobId, {
      phase: 'started',
      at: now(),
      sizeBytes: typeof res.sizeBytes === 'number' && res.sizeBytes >= 0 ? res.sizeBytes : undefined,
    });
    return 'started';
  } catch (error) {
    return fail(error);
  }
}
