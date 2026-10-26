/**
 * The format-and-allowance table on the public `/tools/motion` page (ticket
 * MM48 decisions 1 and 10). A pure model over the public `GET /api/tiers`
 * body: every number, every lock and the Pro column come from the served
 * table, never from a literal here, so the page follows a retuned allowance
 * (and MM49's Pro row) with no code change.
 *
 *   - Columns are the public tiers the API returns, in ladder order, and only
 *     those that carry the `vector*` fields (APIs before MM43 do not). The Pro
 *     column exists only when the API returns a `pro` row.
 *   - A format row is "included" for a tier when that tier's `vectorFormats`
 *     lists it. A format that NO served tier lists is shown as "not on any
 *     plan yet" (MP4, WebM and PNG sequence until MM49 adds them to a tier),
 *     which is the same rule the export dialog uses (MM47 decision 7).
 *   - Static SVG is free and never counted (`svg_static` is not a countable
 *     format), so it is not in `PLAN_TABLE_FORMATS`; the view shows it as one
 *     fixed "free on every plan" row.
 */
import type { TierLimits, TiersResponse } from '@/lib/auth/accountApi';
import type { VectorExportFormat } from '@/lib/vector/exportsApi';

/** Ladder order, left to right. Operator is never public (`/api/tiers` omits it). */
export const PLAN_TABLE_TIERS = ['anonymous', 'free', 'premium', 'pro'] as const;
export type PlanTableTier = (typeof PLAN_TABLE_TIERS)[number];

/**
 * Format rows in display order: the counted exports the editor ships
 * (MM44–MM47), then the counted Lottie import (MM46). `import_svg_vectorize`
 * is left out: the API counts it but the editor has no vectorize UI yet.
 */
export const PLAN_TABLE_FORMATS = [
  'svg_animated',
  'lottie',
  'react_tsx',
  'js_ts',
  'flutter',
  'gif',
  'png_sequence',
  'mp4',
  'webm',
  'import_lottie',
] as const satisfies readonly VectorExportFormat[];
export type PlanTableFormat = (typeof PLAN_TABLE_FORMATS)[number];

/** Formats whose size and length follow `vectorVideo` (MM47 caps). */
const RASTER: ReadonlySet<string> = new Set(['gif', 'png_sequence', 'mp4', 'webm']);

export const MS_PER_SECOND = 1000;

export interface PlanTableColumn {
  tier: PlanTableTier;
  limits: TierLimits;
}

export interface PlanTableFormatRow {
  format: PlanTableFormat;
  /** One entry per column, in column order. */
  included: boolean[];
  /** True when no served tier offers the format. */
  onNoPlan: boolean;
}

/** `null` = the tier has no raster format, so the cap does not apply. A 0 field = no cap on that axis. */
export type RasterCap = { maxHeight: number; maxFps: number; maxSeconds: number } | null;

export interface PlanTable {
  columns: PlanTableColumn[];
  hasPro: boolean;
  formats: PlanTableFormatRow[];
  /** Per column. -1 = unlimited. */
  exportsPerDay: number[];
  /** Per column. -1 = unlimited; the anonymous allowance is browser-only. */
  projects: number[];
  /** Per column, in seconds; 0 = no cap. */
  maxDurationSeconds: number[];
  rasterCap: RasterCap[];
}

const servesVector = (l: TierLimits | undefined): l is TierLimits =>
  !!l && Array.isArray(l.vectorFormats) && typeof l.vectorExportsPerDay === 'number';

/** The table, or null when the API is unreachable or predates Motion's fields. */
export function buildPlanTable(data: TiersResponse | null | undefined): PlanTable | null {
  if (!data || !Array.isArray(data.tiers)) return null;
  const byTier = new Map(data.tiers.map((d) => [d.tier as string, d.limits]));
  const columns: PlanTableColumn[] = [];
  for (const tier of PLAN_TABLE_TIERS) {
    const limits = byTier.get(tier);
    if (servesVector(limits)) columns.push({ tier, limits });
  }
  if (columns.length === 0) return null;

  const formatsOf = columns.map((c) => new Set(c.limits.vectorFormats ?? []));
  const formats = PLAN_TABLE_FORMATS.map((format) => {
    const included = formatsOf.map((set) => set.has(format));
    return { format, included, onNoPlan: !included.some(Boolean) };
  });

  return {
    columns,
    hasPro: columns.some((c) => c.tier === 'pro'),
    formats,
    exportsPerDay: columns.map((c) => c.limits.vectorExportsPerDay ?? 0),
    projects: columns.map((c) => c.limits.vectorProjects ?? 0),
    maxDurationSeconds: columns.map((c) => Math.round((c.limits.vectorMaxDurationMs ?? 0) / MS_PER_SECOND)),
    rasterCap: columns.map((c, i) =>
      [...formatsOf[i]].some((f) => RASTER.has(f)) ? (c.limits.vectorVideo ?? { maxHeight: 0, maxFps: 0, maxSeconds: 0 }) : null,
    ),
  };
}
