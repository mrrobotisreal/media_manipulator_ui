import type { Metadata } from 'next';
import ChangelogPage from '@/views/changelog';
import { resolveLangParam } from '@/lib/i18n/routeLocale';
import { localeIndexing } from '@/lib/metadata';
import { getServerMetadataT } from '@/lib/i18n/server';
import { localizeHref } from '@/i18n/locales';
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_ORIGIN } from '@/lib/seo';

// Metadata is written here (like /pricing) because lib/seo.ts is not extended:
// getSeoForPath() falls back to the noindex 404 entry for unknown paths.
// The changelog is original content, so it is indexable (translated locales
// only); it is listed in the sitemap only under NEXT_PUBLIC_SEO_FULL_INDEX.
type PageParams = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { lang } = await params;
  const locale = resolveLangParam(lang);
  const t = getServerMetadataT('interface', locale);
  const title = t('changelog.metaTitle');
  const description = t('changelog.metaDesc');
  const path = localizeHref('/changelog', locale);
  const canonical = `${SITE_ORIGIN}${path}`;
  // MM86: public (translated + reviewed) locales only; others are noindex with no hreflang.
  const indexing = localeIndexing('/changelog', locale);
  return {
    title,
    description,
    alternates: {
      canonical,
      languages: indexing.languages,
      types: { 'application/rss+xml': `${SITE_ORIGIN}/changelog.xml` },
    },
    robots: indexing.robots,
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE_NAME,
      type: 'website',
      images: [{ url: DEFAULT_OG_IMAGE }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [DEFAULT_OG_IMAGE] },
  };
}

export default async function Changelog({ params }: PageParams) {
  const { lang } = await params;
  return <ChangelogPage locale={resolveLangParam(lang)} />;
}
