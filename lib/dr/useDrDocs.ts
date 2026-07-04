'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchDrDocs, drQueryRetry } from './docsApi';

// List of published DR documents (metadata only — the API omits content here).
// Short staleTime: the portal has two users, so refetching occasionally is fine
// and keeps "Last updated" fresh without hammering the API.
export function useDrDocs() {
  return useQuery({
    queryKey: ['dr', 'docs'],
    queryFn: fetchDrDocs,
    staleTime: 30_000,
    retry: drQueryRetry,
  });
}
