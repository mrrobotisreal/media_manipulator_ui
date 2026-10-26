// Server-side read of the public tier matrix (GET /api/tiers) for pages that
// render it into their prerendered HTML: /pricing and /tools/motion (MM48).
//
// Returns null instead of throwing: the API being unreachable during a build
// or a revalidation must degrade the one page, never fail the deploy.

import type { TiersResponse } from '@/lib/auth/accountApi';

const API_BASE = (
  process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.media-manipulator.com/api'
).replace(/\/$/, '');

/** `revalidate` is the caller's route-segment interval (the API caches for 5 minutes). */
export async function loadPublicTiers(revalidate: number): Promise<TiersResponse | null> {
  try {
    const response = await fetch(`${API_BASE}/tiers`, { next: { revalidate } });
    if (!response.ok) return null;
    const body = (await response.json()) as TiersResponse;
    return Array.isArray(body?.tiers) && body.tiers.length > 0 ? body : null;
  } catch {
    return null;
  }
}
