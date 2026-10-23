'use client';

import { useCallback, useEffect, useState } from 'react';
import useDownloadFile from '@/lib/useDownloadFile';
import type { ResultDescriptor } from './describe';
import { inlineResultUrl } from './inline';

/**
 * One fetch per job, one object URL per job, revoked when the last viewer lets go.
 *
 * Every surface mounts a ResultPanel, and the panel, its compare views and (later) the
 * transcript viewer all want the same bytes. A module-level map keyed by jobId, ref-counted
 * by mounted hooks, makes that a single download and a single `URL.createObjectURL`, and
 * guarantees `URL.revokeObjectURL` runs exactly once when the last consumer unmounts.
 */

interface Entry {
  refs: number;
  blob?: Blob;
  url?: string;
  error?: Error;
  promise?: Promise<void>;
  listeners: Set<() => void>;
}

const entries = new Map<string, Entry>();

const notify = (entry: Entry) => entry.listeners.forEach((listener) => listener());

function drop(jobId: string, entry: Entry) {
  if (entries.get(jobId) === entry) entries.delete(jobId);
  if (entry.url) URL.revokeObjectURL(entry.url);
  entry.url = undefined;
  entry.blob = undefined;
}

function acquire(
  jobId: string,
  fetchBlob: (jobId: string) => Promise<Blob>,
  seed?: Blob | null,
): Entry {
  let entry = entries.get(jobId);
  if (!entry) {
    entry = { refs: 0, listeners: new Set() };
    entries.set(jobId, entry);
  }
  entry.refs += 1;
  const current = entry;
  if (seed && !current.blob && !current.promise) {
    current.blob = seed;
    current.url = URL.createObjectURL(seed);
  } else if (!current.blob && !current.promise) {
    current.error = undefined;
    current.promise = fetchBlob(jobId)
      .then((blob) => {
        current.promise = undefined;
        // Everyone left while the bytes were in flight: do not mint a URL nobody will revoke.
        if (current.refs === 0) {
          drop(jobId, current);
          return;
        }
        current.blob = blob;
        current.url = URL.createObjectURL(blob);
        notify(current);
      })
      .catch((error: unknown) => {
        current.promise = undefined;
        current.error = error instanceof Error ? error : new Error(String(error));
        if (current.refs === 0) drop(jobId, current);
        notify(current);
      });
  }
  return current;
}

function release(jobId: string, entry: Entry) {
  entry.refs = Math.max(0, entry.refs - 1);
  // While a fetch is in flight the entry stays so a re-acquire (React Strict Mode's
  // mount/unmount/mount) reuses it; the fetch's own completion cleans up if nobody came back.
  if (entry.refs === 0 && !entry.promise) drop(jobId, entry);
}

/** The cached blob for a job, if some consumer has already loaded it. Never fetches. */
export function peekResultBlob(jobId: string): Blob | null {
  return entries.get(jobId)?.blob ?? null;
}

/** Test seam: forget every entry (revoking URLs) without needing the hooks to unmount. */
export function resetResultBlobCache(): void {
  for (const [jobId, entry] of [...entries]) drop(jobId, entry);
}

export type ResultBlobStatus = 'idle' | 'loading' | 'ready' | 'error';

export interface ResultBlobState {
  status: ResultBlobStatus;
  blob: Blob | null;
  /** What viewers put in `src`: the inline URL when the API streams it, else the blob URL. */
  url: string | null;
  source: 'blob' | 'inline' | null;
  error: Error | null;
  retry: () => void;
}

export interface UseResultBlobOptions {
  /** Viewers that need no bytes (file cards, archives) pass false so nothing is fetched. */
  enabled?: boolean;
  /**
   * Bytes the caller already has (home keeps the blob per history entry). Used instead of a
   * fetch the first time the job is acquired.
   */
  seedBlob?: Blob | null;
  /** Override the fetcher (tests). Defaults to `useDownloadFile().downloadFile`. */
  fetchBlob?: (jobId: string) => Promise<Blob>;
}

export function useResultBlob(
  descriptor: Pick<ResultDescriptor, 'jobId' | 'kind' | 'mimeFromServer'> | null,
  options: UseResultBlobOptions = {},
): ResultBlobState {
  const { downloadFile } = useDownloadFile();
  const fetchBlob = options.fetchBlob ?? downloadFile;
  const jobId = descriptor?.jobId ?? null;
  const inlineUrl = descriptor ? inlineResultUrl(descriptor) : null;
  // The inline route needs no blob for playback; Download still fetches on click.
  const enabled = !!jobId && (options.enabled ?? true) && !inlineUrl;
  const [, setTick] = useState(0);
  const [attempt, setAttempt] = useState(0);

  // The entry is tracked in state-free form: the effect subscribes, and any change bumps a
  // tick so render re-reads the module map.
  useEffect(() => {
    if (!enabled || !jobId) return;
    const entry = acquire(jobId, fetchBlob, options.seedBlob);
    const onChange = () => setTick((n) => n + 1);
    entry.listeners.add(onChange);
    onChange();
    return () => {
      entry.listeners.delete(onChange);
      release(jobId, entry);
    };
    // fetchBlob is deliberately not a dependency: the first fetch for a job wins.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, jobId, attempt]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  if (inlineUrl) {
    return { status: 'ready', blob: null, url: inlineUrl, source: 'inline', error: null, retry };
  }
  const entry = enabled && jobId ? entries.get(jobId) : undefined;
  if (!enabled || !entry) {
    return { status: enabled ? 'loading' : 'idle', blob: null, url: null, source: null, error: null, retry };
  }
  if (entry.blob && entry.url) {
    return { status: 'ready', blob: entry.blob, url: entry.url, source: 'blob', error: null, retry };
  }
  if (entry.error) {
    return { status: 'error', blob: null, url: null, source: null, error: entry.error, retry };
  }
  return { status: 'loading', blob: null, url: null, source: null, error: null, retry };
}
