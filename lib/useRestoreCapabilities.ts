'use client';

import { useQuery } from '@tanstack/react-query';
import { getBaseURL } from '@/lib/utils';
import { authedFetch } from '@/lib/auth/authedFetch';
import type { RestoreCapabilities } from './restoreTypes';

const fetchRestoreCapabilities = async (): Promise<RestoreCapabilities> => {
  // authedFetch attaches the Firebase ID token when a user is signed in —
  // required by the auth-gated deployment, harmless on the public one.
  const response = await authedFetch(`${getBaseURL()}/video-restore/capabilities`);
  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(body || `Failed to load capabilities: ${response.statusText}`);
  }
  return (await response.json()) as RestoreCapabilities;
};

// useRestoreCapabilities reports feature flags, limits, and per-model
// availability. The server stats its script/venv paths on every call, so a
// short staleTime keeps the picker honest without hammering the API.
const useRestoreCapabilities = () => {
  return useQuery({
    queryKey: ['video-restore', 'capabilities'],
    queryFn: fetchRestoreCapabilities,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export default useRestoreCapabilities;
