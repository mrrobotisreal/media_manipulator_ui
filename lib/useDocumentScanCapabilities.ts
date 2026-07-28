'use client';

import { useQuery } from '@tanstack/react-query';
import { getBaseURL } from '@/lib/utils';
import { authedFetch } from '@/lib/auth/authedFetch';
import type { DocumentScanCapabilities } from './documentScanTypes';

const fetchDocumentScanCapabilities = async (): Promise<DocumentScanCapabilities> => {
  // authedFetch attaches the Firebase ID token when a user is signed in —
  // harmless on this public tool, kept for parity with the other AI tools.
  const response = await authedFetch(`${getBaseURL()}/document-scan/capabilities`);
  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(body || `Failed to load capabilities: ${response.statusText}`);
  }
  return (await response.json()) as DocumentScanCapabilities;
};

// useDocumentScanCapabilities reports feature flags, limits and per-engine
// availability. The server stats its script/venv/binary paths and probes
// Ollama / PaddleOCR-VL on every call, so a short staleTime keeps the toggles
// honest without hammering the API.
const useDocumentScanCapabilities = () => {
  return useQuery({
    queryKey: ['document-scan', 'capabilities'],
    queryFn: fetchDocumentScanCapabilities,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export default useDocumentScanCapabilities;
