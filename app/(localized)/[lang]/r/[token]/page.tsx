import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SharedResultView } from '@/components/share/shared-result-view';
import { localizeHref } from '@/i18n/locales';
import { resolveLangParam } from '@/lib/i18n/routeLocale';
import { getServerMetadataT } from '@/lib/i18n/server';
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_ORIGIN } from '@/lib/seo';
import { absoluteApiUrl } from '@/lib/share/apiUrl';
import { lookupShareCached, shareToResultDescriptor, toolPathFor } from '@/lib/share/sharedResult';

// MM32: per-token, never prerendered. Reading the token from `params` plus a `no-store`
// fetch makes this route dynamic; there is no generateStaticParams. Never indexable.
type PageParams = { params: Promise<{ lang: string; token: string }> };

const NOINDEX = { index: false, follow: false } as const;

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { lang, token } = await params;
  const locale = resolveLangParam(lang);
  const t = getServerMetadataT('interface', locale);
  const lookup = await lookupShareCached(token).catch(() => null);
  if (lookup?.status !== 'ok') {
    const title = t('sharedResult.goneTitle') as string;
    return { title, robots: NOINDEX, openGraph: { title, siteName: SITE_NAME } };
  }
  const { share } = lookup;
  const title = t('sharedResult.ogTitle', { values: { fileName: share.fileName } }) as string;
  const description = t('sharedResult.metaDescription') as string;
  const image = share.thumbnailUrl ? absoluteApiUrl(share.thumbnailUrl) : DEFAULT_OG_IMAGE;
  return {
    title: t('sharedResult.metaTitle') as string,
    description,
    robots: NOINDEX,
    alternates: { canonical: `${SITE_ORIGIN}${localizeHref(`/r/${token}`, locale)}` },
    referrer: 'no-referrer',
    openGraph: { title, description, siteName: SITE_NAME, images: [image] },
    twitter: { card: share.thumbnailUrl ? 'summary_large_image' : 'summary', title, description, images: [image] },
  };
}

export default async function SharedResultPage({ params }: PageParams) {
  const { lang, token } = await params;
  resolveLangParam(lang);
  const lookup = await lookupShareCached(token);
  // The segment's not-found.tsx renders the friendly page (HTTP 404 where not streamed, noindex either way).
  if (lookup.status !== 'ok') notFound();
  return (
    <SharedResultView
      descriptor={shareToResultDescriptor(lookup.share)}
      toolPath={toolPathFor(lookup.share.tool)}
    />
  );
}
