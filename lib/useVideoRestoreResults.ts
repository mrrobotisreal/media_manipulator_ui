'use client';

import { useQuery } from '@tanstack/react-query';
import { getBaseURL } from '@/lib/utils';
import { authedFetch } from '@/lib/auth/authedFetch';
import type { RestoreResultsResponse } from './restoreTypes';

/**
 * The manifest, or null when the API has no per-model routes (404, an older API, or a job
 * whose kept files are gone). Null is the signal to fall back to the tarball and the archive
 * viewer; any other failure throws and is treated the same way by the caller.
 */
export const fetchVideoRestoreResults = async (jobId: string): Promise<RestoreResultsResponse | null> => {
  const response = await authedFetch(`${getBaseURL()}/video-restore/${encodeURIComponent(jobId)}/results`);
  if (response.status === 404) return null;
  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(body || `Failed to load results: ${response.statusText}`);
  }
  return (await response.json()) as RestoreResultsResponse;
};

// Mirrors useImageRestoreResults: enabled once the shared job status reports completed.
const useVideoRestoreResults = (jobId: string | null, enabled: boolean) =>
  useQuery({
    queryKey: ['video-restore', 'results', jobId],
    queryFn: () => fetchVideoRestoreResults(jobId as string),
    enabled: enabled && !!jobId,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    retry: false,
  });

export default useVideoRestoreResults;
