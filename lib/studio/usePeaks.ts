'use client';

import { useQuery } from '@tanstack/react-query';
import { studioPeaksUrl } from '@/lib/studio/previewEngine';
import { useStudioBackend } from '@/lib/studio/studioBackendProvider';

/**
 * Audio waveform peaks for a Content Studio asset. The API returns
 * { version, bucketsPerSecond, length, peaks: [min0,max0,min1,max1,…] } (int8).
 * We decode the flat number array into an Int8Array once and memoize it in a
 * module-level cache so re-mounting clips (or many clips of the same asset)
 * share the decode. The /peaks route backfills on first request, so a 404 here
 * means generation failed (no audio / unsupported) — surfaced as a query error.
 */
export interface DecodedPeaks {
  bucketsPerSecond: number;
  /** number of min/max buckets (peaks.length === length * 2) */
  length: number;
  peaks: Int8Array;
}

const cache = new Map<string, DecodedPeaks>();

async function fetchPeaks(assetId: string): Promise<DecodedPeaks> {
  const cached = cache.get(assetId);
  if (cached) return cached;
  const res = await fetch(studioPeaksUrl(assetId));
  if (!res.ok) throw new Error(`peaks ${res.status}`);
  const json = (await res.json()) as { bucketsPerSecond?: number; length?: number; peaks?: number[] };
  const decoded: DecodedPeaks = {
    bucketsPerSecond: json.bucketsPerSecond && json.bucketsPerSecond > 0 ? json.bucketsPerSecond : 50,
    length: json.length ?? 0,
    peaks: Int8Array.from(json.peaks ?? []),
  };
  cache.set(assetId, decoded);
  return decoded;
}

export function usePeaks(assetId: string | null, enabled = true) {
  // Skip entirely when the active backend doesn't serve /peaks (e.g. CreaTV
  // Darkroom today) — the waveform UI degrades gracefully to no peaks.
  const peaksSupported = useStudioBackend().capabilities.peaks;
  return useQuery({
    queryKey: ['studio', 'peaks', assetId],
    enabled: !!assetId && enabled && peaksSupported,
    staleTime: Infinity,
    gcTime: Infinity,
    retry: 1,
    queryFn: () => fetchPeaks(assetId as string),
  });
}
