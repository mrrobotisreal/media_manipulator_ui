'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchDrDoc, drQueryRetry } from './docsApi';

// A single DR document including its content block array. `enabled` guards
// against firing with an empty slug during the first render of the viewer.
export function useDrDoc(slug: string) {
  return useQuery({
    queryKey: ['dr', 'docs', slug],
    queryFn: () => fetchDrDoc(slug),
    enabled: !!slug,
    retry: drQueryRetry,
  });
}
