import type { Metadata } from 'next';

import PricingView, { PricingUnavailable } from '@/views/pricing';
import { resolveLangParam } from '@/lib/i18n/routeLocale';
import { localeIndexing } from '@/lib/metadata';
import { defaultLocale, localizeHref } from '@/i18n/locales';
import { getServerMetadataT } from '@/lib/i18n/server';
import { loadPublicTiers } from '@/lib/auth/loadTiers';
import { getSeoOverride } from '@/lib/seoOverrides';
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_ORIGIN, pricingProductLd } from '@/lib/seo';
import { JsonLdBlocks } from '@/components/seo/json-ld';
import { planPrices } from '@/lib/billing/price';

// Metadata is written here rather than through buildMetadata(): lib/seo.ts is
// byte-unchanged since main by design, and getSeoForPath() falls back to the
// noindex 404 entry for any path it does not know — which would quietly
// de-index the pricing page.
const TITLE = 'Pricing — Media Manipulator';
const DESCRIPTION =
  'Compare the free, account and Premium plans: daily operation limits, file size and video length caps, output resolution, retention and ads.';

type PageParams = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { lang } = await params;
  const locale = resolveLangParam(lang);
  const localizedPath = localizeHref('/pricing', locale);
  const canonical = localizedPath === '/' ? `${SITE_ORIGIN}/` : `${SITE_ORIGIN}${localizedPath}`;
  // MM86: public (translated + reviewed) locales only; others are noindex with no hreflang.
  const indexing = localeIndexing('/pricing', locale);
  const override = getSeoOverride('/pricing', locale);
  // MM92: a locale with no hand-written override still gets a title and
  // description in its own language (the nav label and the page's subtitle)
  // rather than the English pair.
  const t = getServerMetadataT('interface', locale);
  const title = override?.title ?? (locale === defaultLocale ? TITLE : `${t('interface:topNav.pricing')} — ${SITE_NAME}`);
  const description = override?.description ?? (locale === defaultLocale ? DESCRIPTION : t('interface:pricing.subtitle'));

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: indexing.languages,
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
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [DEFAULT_OG_IMAGE],
    },
  };
}

// The matrix is configuration that changes on deploy, and the API already
// serves it with a 5-minute cache header. The tier fetch below caches on this
// interval, so a retuned limit is picked up without a rebuild and the API is
// hit at most every 5 minutes. Locale now comes from the URL rather than a
// cookie read, so the page returns to ISR (no request-time API reads forcing
// dynamic rendering).
export const revalidate = 300;

export default async function Pricing({ params }: PageParams) {
  const { lang } = await params;
  const locale = resolveLangParam(lang);
  const data = await loadPublicTiers(revalidate);
  if (!data || !data.tiers?.length) {
    return (
      <div className="container mx-auto px-4 py-16">
        <PricingUnavailable locale={locale} />
      </div>
    );
  }
  // MM85: Product + one Offer per rung, priced from the served tiers.
  const product = pricingProductLd({ premium: planPrices(data, 'premium', 'usd'), pro: planPrices(data, 'pro', 'usd') });
  return (
    <>
      <JsonLdBlocks blocks={[product]} />
      <PricingView data={data} locale={locale} />
    </>
  );
}
