'use client';

import { useQuery } from '@tanstack/react-query';
import { getBaseURL } from '@/lib/utils';
import { getCurrentIdToken } from '@/lib/firebase';
import type { ImageRestoreResultsResponse } from './imageRestoreTypes';

const fetchImageRestoreResults = async (jobId: string): Promise<ImageRestoreResultsResponse> => {
  const idToken = await getCurrentIdToken();
  const response = await fetch(`${getBaseURL()}/image-restore/${jobId}/results`, {
    headers: idToken ? { Authorization: `Bearer ${idToken}` } : undefined,
  });
  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(body || `Failed to load results: ${response.statusText}`);
  }
  return (await response.json()) as ImageRestoreResultsResponse;
};

// useImageRestoreResults fetches the manifest-derived results listing once the
// shared job status reports completed (the caller passes enabled). The grid's
// preview <img> tags point at /image-restore/:jobId/result/:id directly — note
// that on the Firebase-gated deployment those <img> requests carry no auth
// header, so the grid must fall back gracefully if a preview 403s (show the
// entry as "included in download" rather than a broken image). We do NOT invent
// token-in-query auth.
const useImageRestoreResults = (jobId: string | null, enabled: boolean) => {
  return useQuery({
    queryKey: ['image-restore', 'results', jobId],
    queryFn: () => fetchImageRestoreResults(jobId as string),
    enabled: enabled && !!jobId,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
};

export default useImageRestoreResults;
