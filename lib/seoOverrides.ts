/**
 * Per-locale <title>/description overrides for the SEO map.
 *
 * `lib/seo.ts` (English) stays the single source of truth for every route's
 * metadata; this module holds sparse, per-locale overrides following the same
 * partial-override pattern as `i18n/toolPageContent.ts`. A path/locale pair
 * with no entry falls back to the English copy.
 *
 * Scope decision (2026-08-08): real Russian titles/descriptions exist for the
 * static core pages and the long-form articles. The ~65 `/tools/[slug]` pages
 * deliberately keep English metadata until their body copy is translated —
 * a Russian title on a fully English page is a worse signal than consistent
 * English. Add tool-page entries here together with their body translations.
 */

export interface SeoOverride {
  title?: string;
  description?: string;
}

type LocaleOverrides = Record<string, SeoOverride>;

const RU_SEO_OVERRIDES: LocaleOverrides = {
  // Filled in with the Russian metadata pass (Phase 4) — keys are the
  // locale-neutral paths handed to buildMetadata().
};

const OVERRIDES: Record<string, LocaleOverrides> = {
  'ru-RU': RU_SEO_OVERRIDES,
};

export function getSeoOverride(path: string, locale: string): SeoOverride | undefined {
  return OVERRIDES[locale]?.[path];
}
