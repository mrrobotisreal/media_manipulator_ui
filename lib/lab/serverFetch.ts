import { getBaseURL } from '@/lib/utils';
import type { LabModelsResponse } from './types';

/**
 * Server-side gate call. Returns the models on a 200 and null on EVERYTHING else (no token,
 * network error, any non-200, bad JSON): the page fails closed into notFound().
 */
export async function fetchLabModelsServer(token: string | undefined): Promise<LabModelsResponse | null> {
  if (!token) return null;
  try {
    const res = await fetch(`${getBaseURL()}/lab/models`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });
    if (res.status !== 200) return null;
    const body = (await res.json()) as LabModelsResponse;
    if (!body || !Array.isArray(body.models)) return null;
    return body;
  } catch {
    return null;
  }
}
