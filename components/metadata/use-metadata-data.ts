'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  fetchJobMetadata,
  fetchJobMetadataDiff,
  fetchMetadataBinary,
  inspectFile,
  metadataBinaryUrl,
  type DiffResult,
  type MetadataSide,
} from '@/lib/metadata/api';
import type { MetadataDocument, MetadataEntry } from '@/lib/metadata/types';

export type MetadataQueryStatus = 'loading' | 'error' | 'ready';

interface Result<T> {
  data: T | undefined;
  status: MetadataQueryStatus;
  error: Error | null;
}

const STALE = 5 * 60_000;

const toStatus = (q: { isPending: boolean; isError: boolean }): MetadataQueryStatus =>
  q.isError ? 'error' : q.isPending ? 'loading' : 'ready';

/** Inspect a local file on the server (POST /metadata/inspect). Keyed by name+size+lastModified. */
export function useMetadataInspect(file: File | null, { enabled = true }: { enabled?: boolean } = {}): Result<MetadataDocument> {
  const q = useQuery({
    queryKey: ['metadata-inspect', file?.name, file?.size, file?.lastModified],
    queryFn: ({ signal }) => inspectFile(file!, signal),
    enabled: enabled && !!file,
    staleTime: STALE,
    retry: false,
  });
  return { data: q.data, status: toStatus(q), error: q.error };
}

export function useJobMetadata(jobId: string | null | undefined, side: MetadataSide, { enabled = true }: { enabled?: boolean } = {}): Result<MetadataDocument> {
  const q = useQuery({
    queryKey: ['job-metadata', jobId, side],
    queryFn: ({ signal }) => fetchJobMetadata(jobId!, side, signal),
    enabled: enabled && !!jobId,
    staleTime: STALE,
    retry: false,
  });
  return { data: q.data, status: toStatus(q), error: q.error };
}

export function useJobMetadataDiff(jobId: string | null | undefined, { enabled = true }: { enabled?: boolean } = {}): Result<DiffResult> {
  const q = useQuery({
    queryKey: ['job-metadata-diff', jobId],
    queryFn: ({ signal }) => fetchJobMetadataDiff(jobId!, signal),
    enabled: enabled && !!jobId,
    staleTime: STALE,
    retry: false,
  });
  return { data: q.data, status: toStatus(q), error: q.error };
}

/**
 * Blob URLs for a job's binary entries (thumbnails). The route needs identity headers, so a
 * plain <img src> cannot work; each URL is fetched with authedFetch on first ask and revoked
 * on unmount / job change. Returns `resolve(entry)` for the inspector's `resolveBinaryUrl`.
 */
export function useJobBinaryUrls(jobId: string | null | undefined, side: MetadataSide): (entry: MetadataEntry) => string | null {
  const [urls, setUrls] = useState<Record<string, string>>({});
  const requested = useRef(new Set<string>());
  const made = useRef(new Set<string>());

  useEffect(() => {
    const requestedSet = requested.current;
    const madeSet = made.current;
    return () => {
      madeSet.forEach((u) => URL.revokeObjectURL(u));
      madeSet.clear();
      requestedSet.clear();
      setUrls({});
    };
  }, [jobId, side]);

  const ask = useCallback(
    (entry: MetadataEntry) => {
      if (!jobId || requested.current.has(entry.id) || entry.id.includes('#')) return;
      requested.current.add(entry.id);
      fetchMetadataBinary(metadataBinaryUrl(jobId, entry.id, side, true))
        .then((blob) => {
          if (!requested.current.has(entry.id)) return;
          const url = URL.createObjectURL(blob);
          made.current.add(url);
          setUrls((u) => ({ ...u, [entry.id]: url }));
        })
        .catch(() => undefined);
    },
    [jobId, side],
  );

  return useCallback(
    (entry: MetadataEntry) => {
      if (!jobId) return null;
      const url = urls[entry.id];
      if (url) return url;
      // Resolve is called during render; defer the fetch out of it.
      queueMicrotask(() => ask(entry));
      return null;
    },
    [jobId, urls, ask],
  );
}
