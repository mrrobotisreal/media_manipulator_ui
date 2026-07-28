'use client';

import { useQuery } from '@tanstack/react-query';
import { getBaseURL } from '@/lib/utils';
import { authedFetch } from '@/lib/auth/authedFetch';
import type { DocumentScanResultsResponse } from './documentScanTypes';

const fetchDocumentScanResult = async (jobId: string): Promise<DocumentScanResultsResponse> => {
  const response = await authedFetch(`${getBaseURL()}/document-scan/${jobId}/results`);
  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(body || `Failed to load results: ${response.statusText}`);
  }
  return (await response.json()) as DocumentScanResultsResponse;
};

// useDocumentScanResult fetches the manifest-derived results listing once the
// shared job status reports completed (the caller passes enabled). It feeds the
// result viewer's per-page confidence note + download buttons.
const useDocumentScanResult = (jobId: string | null, enabled: boolean) => {
  return useQuery({
    queryKey: ['document-scan', 'results', jobId],
    queryFn: () => fetchDocumentScanResult(jobId as string),
    enabled: enabled && !!jobId,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
};

export default useDocumentScanResult;
