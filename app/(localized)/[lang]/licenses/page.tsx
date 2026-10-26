import type { Metadata } from 'next';
import LicensesPage from '@/views/licenses';
import { resolveLangParam } from '@/lib/i18n/routeLocale';
import { languageAlternates } from '@/lib/metadata';
import { getServerMetadataT } from '@/lib/i18n/server';
import { getLocaleDef, localizeHref } from '@/i18n/locales';
import { SITE_NAME, SITE_ORIGIN } from '@/lib/seo';
import { translatorRobots } from '@/lib/translator/mode';

// MM47: open-source licences (mediabunny MPL-2.0 attribution, design §4).
// Metadata is written here like /changelog (lib/seo.ts is not extended).
// Normal content: indexable in translated locales (decision 8, proposed:
// confirmed); the sitemap entry and the footer link are MM48's.
type PageParams = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { lang } = await params;
  const locale = resolveLangParam(lang);
  const t = getServerMetadataT('interface', locale);
  const title = t('licenses.metaTitle');
  const description = t('licenses.metaDesc');
  const canonical = `${SITE_ORIGIN}${localizeHref('/licenses', locale)}`;
  const isTranslated = getLocaleDef(locale)?.translated ?? false;
  return {
    title,
    description,
    alternates: { canonical, languages: languageAlternates('/licenses') },
    robots: translatorRobots(isTranslated ? { index: true, follow: true } : { index: false, follow: true }),
    openGraph: { title, description, url: canonical, siteName: SITE_NAME, type: 'website' },
  };
}

export default async function Licenses({ params }: PageParams) {
  const { lang } = await params;
  return <LicensesPage locale={resolveLangParam(lang)} />;
}
