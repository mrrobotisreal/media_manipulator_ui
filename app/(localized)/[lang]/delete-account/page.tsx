import type { Metadata } from 'next';
import DeleteAccountPage from '@/views/delete-account';
import { resolveLangParam } from '@/lib/i18n/routeLocale';
import { localeIndexing } from '@/lib/metadata';
import { getServerMetadataT } from '@/lib/i18n/server';
import { localizeHref } from '@/i18n/locales';
import { SITE_NAME, SITE_ORIGIN } from '@/lib/seo';

type PageParams = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { lang } = await params;
  const locale = resolveLangParam(lang);
  const t = getServerMetadataT('interface', locale);
  const title = t('deleteAccount.metaTitle');
  const description = t('deleteAccount.metaDesc');
  const canonical = `${SITE_ORIGIN}${localizeHref('/delete-account', locale)}`;
  // MM86: public (translated + reviewed) locales only; others are noindex with no hreflang.
  const indexing = localeIndexing('/delete-account', locale);
  return {
    title,
    description,
    alternates: { canonical, languages: indexing.languages },
    robots: indexing.robots,
    openGraph: { title, description, url: canonical, siteName: SITE_NAME, type: 'website' },
  };
}

export default async function DeleteAccount({ params }: PageParams) {
  const { lang } = await params;
  return <DeleteAccountPage locale={resolveLangParam(lang)} />;
}
