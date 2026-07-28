import type { Metadata } from 'next';

import PricingView, { PricingUnavailable } from '@/views/pricing';
import type { TiersResponse } from '@/lib/auth/accountApi';
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_ORIGIN } from '@/lib/seo';

// Metadata is written here rather than through buildMetadata(): lib/seo.ts is
// byte-unchanged since main by design, and getSeoForPath() falls back to the
// noindex 404 entry for any path it does not know — which would quietly
// de-index the pricing page.
const CANONICAL = `${SITE_ORIGIN}/pricing`;
const TITLE = 'Pricing — Media Manipulator';
const DESCRIPTION =
  'Compare the free, account and Premium plans: daily operation limits, file size and video length caps, output resolution, retention and ads.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: CANONICAL },
  robots: { index: true, follow: true },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: CANONICAL,
    siteName: SITE_NAME,
    type: 'website',
    images: [{ url: DEFAULT_OG_IMAGE }],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
};

// The matrix is configuration that changes on deploy, and the API already
// serves it with a 5-minute cache header. Matching that here keeps the page
// prerendered — real numbers in the HTML for crawlers, zero client JS — while
// still picking up a retuned limit without a rebuild.
export const revalidate = 300;

const API_BASE = (
  process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.media-manipulator.com/api'
).replace(/\/$/, '');

/**
 * Loads the tier matrix for the build.
 *
 * Returns null instead of throwing: the API being unreachable during a build or
 * a revalidation must degrade this one page, never fail the deploy. Every tool
 * on the site keeps working without it.
 */
async function loadTiers(): Promise<TiersResponse | null> {
  try {
    const response = await fetch(`${API_BASE}/tiers`, { next: { revalidate } });
    if (!response.ok) return null;
    return (await response.json()) as TiersResponse;
  } catch {
    return null;
  }
}

export default async function Pricing() {
  const data = await loadTiers();
  if (!data || !data.tiers?.length) {
    return (
      <div className="container mx-auto px-4 py-16">
        <PricingUnavailable />
      </div>
    );
  }
  return <PricingView data={data} />;
}
