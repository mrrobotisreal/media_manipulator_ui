import type { Metadata } from 'next';
import StatusView from '@/components/status/status-view';
import { resolveLangParam } from '@/lib/i18n/routeLocale';
import { getServerT } from '@/lib/i18n/server';
import { localizeHref } from '@/i18n/locales';
import { SITE_NAME, SITE_ORIGIN } from '@/lib/seo';

// MM34: live service status. Never indexable (it is a changing widget, not
// content), never in the sitemap, and robots-noindex in every locale.
type PageParams = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { lang } = await params;
  const locale = resolveLangParam(lang);
  const title = getServerT('interface', locale)('status.metaTitle');
  return {
    title,
    robots: { index: false, follow: false },
    alternates: { canonical: `${SITE_ORIGIN}${localizeHref('/status', locale)}` },
    openGraph: { title, siteName: SITE_NAME },
  };
}

export default async function Status({ params }: PageParams) {
  const { lang } = await params;
  resolveLangParam(lang);
  return <StatusView />;
}
