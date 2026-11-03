/**
 * The plan table on the public `/tools/aperture` page (MM100 decision 3). A pure
 * model over the public `GET /api/tiers` body: every number comes from the served
 * `photo*` fields, never from a literal here. Columns are the public tiers that
 * carry those fields (APIs before MM95 do not, so the table is hidden, not wrong).
 */
import type { TierLimits, TiersResponse } from '@/lib/auth/accountApi';

export const PHOTO_PLAN_TIERS = ['anonymous', 'free', 'premium', 'pro'] as const;
export type PhotoPlanTier = (typeof PHOTO_PLAN_TIERS)[number];

export interface PhotoPlanColumn {
  tier: PhotoPlanTier;
  limits: TierLimits;
}

export interface PhotoPlanTable {
  columns: PhotoPlanColumn[];
  /** Per column. -1 = unlimited; 0 on anonymous = browser-only (one project). */
  projects: number[];
  /** Per column, megapixels. */
  maxMegapixels: number[];
  /** Per column. 0 = not available. */
  batch: number[];
}

const servesPhoto = (l: TierLimits | undefined): l is TierLimits =>
  !!l && typeof l.photoProjects === 'number' && typeof l.photoMaxMegapixels === 'number' && typeof l.photoBatch === 'number';

/** The table, or null when the API is unreachable or predates Aperture's fields. */
export function buildPhotoPlanTable(data: TiersResponse | null | undefined): PhotoPlanTable | null {
  if (!data || !Array.isArray(data.tiers)) return null;
  const byTier = new Map(data.tiers.map((d) => [d.tier as string, d.limits]));
  const columns: PhotoPlanColumn[] = [];
  for (const tier of PHOTO_PLAN_TIERS) {
    const limits = byTier.get(tier);
    if (servesPhoto(limits)) columns.push({ tier, limits });
  }
  if (columns.length === 0) return null;
  return {
    columns,
    projects: columns.map((c) => c.limits.photoProjects ?? 0),
    maxMegapixels: columns.map((c) => c.limits.photoMaxMegapixels ?? 0),
    batch: columns.map((c) => c.limits.photoBatch ?? 0),
  };
}
