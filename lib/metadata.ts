// Server-side bridge between the existing SEO route map (lib/seo.ts) and the
// Next.js Metadata API. Each App Router page calls buildMetadata(path, locale)
// from a Server Component so the per-route <title>, description, canonical,
// Open Graph, Twitter, robots and hreflang tags are emitted into the
// prerendered HTML head at build time — the SSG/SEO win this migration is
// about.
//
// Locale rules (see i18n/locales.ts):
// - `path` is always the locale-NEUTRAL path ('/about'); the locale's URL
//   prefix is applied here. English keeps the unprefixed canonical.
// - hreflang alternates list only the public locales (MM86: `translated &&
//   reviewed`, see `reviewedLocales`), with x-default on the English URL. A
//   page in any other locale (copied English, or text no human has reviewed)
//   is `noindex, follow` and advertises no alternates, so crawlers never see
//   mislabeled or unreviewed content. Flipping `reviewed` in i18n/locales.ts
//   promotes a locale into the alternates automatically.
// - Tool pages add a second rule (MM86): a locale whose override does not
//   cover the page's whole body is left out too (`buildToolMetadata`).
// - Titles/descriptions come from lib/seo.ts (English source of truth) with
//   sparse per-locale overrides from lib/seoOverrides.ts.

import type { Metadata } from 'next';
import { getSeoForPath, SITE_NAME, SITE_ORIGIN } from '@/lib/seo';
import { getSeoOverride } from '@/lib/seoOverrides';
import { defaultLocale, isIndexableLocale, localizeHref, reviewedLocales } from '@/i18n/locales';
import { TRANSLATOR_ROBOTS, translatorRobots } from '@/lib/translator/mode';
import { fullyCoveredLocaleCodes, getLocalizedToolBySlug, localeBodyCoverage, toolOverrideOg } from '@/i18n/toolPageContent';
import { isReviewIndexedToolSlug } from '@/content/reviewAllowlist';
import { TOOL_PAGES } from '@/content/toolPages';

const localizedUrl = (path: string, locale: string): string => {
  const localizedPath = localizeHref(path, locale);
  if (localizedPath === '/' || localizedPath === '') return `${SITE_ORIGIN}/`;
  return `${SITE_ORIGIN}${localizedPath}`;
};

/**
 * hreflang alternates for an indexable path: every public (translated and
 * reviewed) locale, or the subset `codes` when given, plus x-default pointing
 * at the English URL.
 */
export function languageAlternates(path: string, codes?: readonly string[]): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const def of reviewedLocales) {
    if (codes && !codes.includes(def.code)) continue;
    languages[def.code] = localizedUrl(path, def.code);
  }
  languages['x-default'] = localizedUrl(path, defaultLocale);
  return languages;
}

export type RobotsRule = { index: boolean; follow: boolean };

/**
 * MM86: the robots rule and hreflang alternates for a normal (indexable in
 * English) page in `locale`. A public locale gets `index, follow` and the
 * alternates; any other locale gets `noindex, follow` and no alternates.
 * Translator deployments override robots (`translatorRobots`).
 */
export function localeIndexing(
  path: string,
  locale: string,
): { robots: RobotsRule | typeof TRANSLATOR_ROBOTS; languages: Record<string, string> | undefined } {
  const indexable = isIndexableLocale(locale);
  return {
    robots: translatorRobots(indexable ? { index: true, follow: true } : { index: false, follow: true }),
    languages: indexable ? languageAlternates(path) : undefined,
  };
}

export function buildMetadata(path: string, locale: string = defaultLocale): Metadata {
  const seo = getSeoForPath(path);
  const override = getSeoOverride(path, locale);
  const indexable = !seo.noindex && isIndexableLocale(locale);
  // MM84: an alias tool page canonicalises to its primary (seo.canonicalPath).
  const canonicalUrl = localizedUrl(seo.canonicalPath ?? path, locale);

  const title = override?.title ?? seo.title;
  const description = override?.description ?? seo.description;
  // OG mirrors the visible title/description when overridden, exactly as the
  // English entries mirror each other in lib/seo.ts.
  const ogTitle = override?.title ?? seo.ogTitle;
  const ogDescription = override?.description ?? seo.ogDescription;

  return {
    title,
    description,
    keywords: seo.keywords.length ? seo.keywords : undefined,
    alternates: {
      canonical: canonicalUrl,
      // Alternates only on indexable pages; noindex pages advertise nothing.
      languages: indexable ? languageAlternates(path) : undefined,
    },
    robots: translatorRobots(indexable ? { index: true, follow: true } : { index: false, follow: true }),
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: canonicalUrl,
      siteName: SITE_NAME,
      type: seo.ogType,
      images: [{ url: seo.ogImage }],
    },
    twitter: {
      card: seo.twitterCard,
      title: ogTitle,
      description: ogDescription,
      images: [seo.ogImage],
    },
  };
}

/**
 * MM86: may `/tools/<slug>` be indexed in `locale`? English follows the review
 * allowlist (or the full-index flag); any other locale must also be public
 * (translated and reviewed) and fully cover the page body
 * (`localeBodyCoverage`), so no indexable URL renders English prose under a
 * translated address. Alias pages are never indexable.
 */
export function isToolPageIndexable(slug: string, locale: string): boolean {
  const tool = TOOL_PAGES.find((t) => t.slug === slug);
  if (!tool || tool.aliasOf || !isReviewIndexedToolSlug(slug)) return false;
  if (locale === defaultLocale) return true;
  return isIndexableLocale(locale) && localeBodyCoverage(slug, locale).complete;
}

/**
 * MM86 Decision 3: metadata for a tool landing page.
 *
 * - hreflang lists only English plus the public locales that fully cover the
 *   body (`fullyCoveredLocaleCodes`), with x-default; a page that is not
 *   indexable in `locale` advertises nothing.
 * - A non-English page whose body falls back to English is `noindex, follow`,
 *   even in a reviewed locale.
 * - Titles: a fully covered, public locale uses its own translated
 *   metaTitle/metaDescription (the body is translated, so the head may be
 *   too); everything else keeps buildMetadata's English-or-seoOverride title,
 *   the rule in lib/seoOverrides.ts.
 * - Alias pages keep their canonical to the primary and are `noindex, follow`.
 * - Slugs outside the review allowlist stay `noindex, nofollow` (MM34).
 */
export function buildToolMetadata(slug: string, locale: string = defaultLocale): Metadata {
  const path = `/tools/${slug}`;
  const meta = buildMetadata(path, locale);
  const tool = TOOL_PAGES.find((t) => t.slug === slug);
  if (!tool) return meta;
  if (tool.aliasOf) {
    meta.robots = translatorRobots({ index: false, follow: true });
    if (meta.alternates) meta.alternates.languages = undefined;
    return meta;
  }
  if (!isReviewIndexedToolSlug(slug)) {
    meta.robots = translatorRobots({ index: false, follow: false });
    if (meta.alternates) meta.alternates.languages = undefined;
    return meta;
  }
  const indexable = isToolPageIndexable(slug, locale);
  meta.robots = translatorRobots(indexable ? { index: true, follow: true } : { index: false, follow: true });
  if (meta.alternates) {
    meta.alternates.languages = indexable ? languageAlternates(path, fullyCoveredLocaleCodes(slug)) : undefined;
  }
  if (indexable && locale !== defaultLocale) {
    const localized = getLocalizedToolBySlug(slug, locale)!;
    const og = toolOverrideOg(slug, locale);
    const ogTitle = og.ogTitle ?? localized.metaTitle;
    const ogDescription = og.ogDescription ?? localized.metaDescription;
    meta.title = localized.metaTitle;
    meta.description = localized.metaDescription;
    meta.openGraph = { ...meta.openGraph, title: ogTitle, description: ogDescription };
    meta.twitter = { ...meta.twitter, title: ogTitle, description: ogDescription };
  }
  return meta;
}

export { SITE_ORIGIN, SITE_NAME };
