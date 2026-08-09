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
// - hreflang alternates list only the locales whose content is actually
//   translated (`translated: true` — en + ru today), with x-default on the
//   English URL. Locales still serving copied-English files are excluded AND
//   rendered noindex, so crawlers never see mislabeled duplicate content
//   while AdSense review is pending. Flipping `translated` in i18n/locales.ts
//   promotes a locale into the alternates automatically.
// - Titles/descriptions come from lib/seo.ts (English source of truth) with
//   sparse per-locale overrides from lib/seoOverrides.ts.

import type { Metadata } from 'next';
import { getSeoForPath, SITE_NAME, SITE_ORIGIN } from '@/lib/seo';
import { getSeoOverride } from '@/lib/seoOverrides';
import { defaultLocale, getLocaleDef, localizeHref, translatedLocales } from '@/i18n/locales';

const localizedUrl = (path: string, locale: string): string => {
  const localizedPath = localizeHref(path, locale);
  if (localizedPath === '/' || localizedPath === '') return `${SITE_ORIGIN}/`;
  return `${SITE_ORIGIN}${localizedPath}`;
};

/**
 * hreflang alternates for an indexable path: every translated locale plus
 * x-default pointing at the English URL.
 */
export function languageAlternates(path: string): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const def of translatedLocales) {
    languages[def.code] = localizedUrl(path, def.code);
  }
  languages['x-default'] = localizedUrl(path, defaultLocale);
  return languages;
}

export function buildMetadata(path: string, locale: string = defaultLocale): Metadata {
  const seo = getSeoForPath(path);
  const override = getSeoOverride(path, locale);
  const def = getLocaleDef(locale);
  const isTranslated = def?.translated ?? false;
  const canonicalUrl = localizedUrl(path, locale);

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
      languages: seo.noindex ? undefined : languageAlternates(path),
    },
    robots:
      seo.noindex || !isTranslated
        ? { index: false, follow: true }
        : { index: true, follow: true },
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

export { SITE_ORIGIN, SITE_NAME };
