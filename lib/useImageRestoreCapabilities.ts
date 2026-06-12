'use client';

import { useQuery } from '@tanstack/react-query';
import { getBaseURL } from '@/lib/utils';
import { getCurrentIdToken } from '@/lib/firebase';
import type { ImageRestoreCapabilities } from './imageRestoreTypes';

const fetchImageRestoreCapabilities = async (): Promise<ImageRestoreCapabilities> => {
  // Attach the Firebase ID token when a user is signed in — required by the
  // auth-gated deployment, harmless on the public one.
  const idToken = await getCurrentIdToken();
  const response = await fetch(`${getBaseURL()}/image-restore/capabilities`, {
    headers: idToken ? { Authorization: `Bearer ${idToken}` } : undefined,
  });
  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(body || `Failed to load capabilities: ${response.statusText}`);
  }
  return (await response.json()) as ImageRestoreCapabilities;
};

// useImageRestoreCapabilities reports feature flags, limits, and per-model
// availability. The server stats its script/venv/weights paths on every call,
// so a short staleTime keeps the picker honest without hammering the API.
const useImageRestoreCapabilities = () => {
  return useQuery({
    queryKey: ['image-restore', 'capabilities'],
    queryFn: fetchImageRestoreCapabilities,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export default useImageRestoreCapabilities;
