import { Suspense } from 'react';
import type { Metadata } from 'next';

import type { AccountCopy } from '@/components/account/account-copy';

import { getServerT } from '@/lib/i18n/server';
import { resolveLangParam } from '@/lib/i18n/routeLocale';
import AccountDashboard, {
  type AccountLabels,
} from '@/components/account/account-dashboard';
import { SITE_ORIGIN } from '@/lib/seo';

// A private dashboard: indexable content would be a bug, and there is nothing
// here for a crawler. Metadata is written inline rather than through
// buildMetadata() because lib/seo.ts is byte-unchanged since main by design.
export const metadata: Metadata = {
  title: 'Your account — Media Manipulator',
  description: 'Your plan, your daily usage, and your saved Darkroom projects.',
  alternates: { canonical: `${SITE_ORIGIN}/account` },
  robots: { index: false, follow: false },
};

/**
 * The page shell is a server component so every label is prerendered and
 * `pages.json` (79 KB) stays out of the client bundle. The dashboard island
 * receives the strings it needs as props and fetches only the numbers — which is
 * why the history panel's tool and status maps are read here, with
 * `returnObjects`, rather than in the island.
 */
type PageParams = { params: Promise<{ lang: string }> };

export default async function Account({ params }: PageParams) {
  const { lang } = await params;
  const locale = resolveLangParam(lang);
  const t = getServerT('interface', locale);

  const labels: AccountLabels = {
    // Read as one object so the client island gets every tab string without importing pages.json.
    copy: t('interface:account', { returnObjects: true }) as unknown as AccountCopy,
    unlimited: t('interface:pricing.values.unlimited'),
    tierNames: {
      anonymous: t('interface:pricing.tier.anonymous'),
      free: t('interface:pricing.tier.free'),
      premium: t('interface:pricing.tier.premium'),
      pro: t('interface:pricing.tier.pro'),
      operator: t('interface:pricing.tier.operator'),
    },
    planRows: [
      { label: t('interface:pricing.rows.opsPerDay'), value: 'ops' },
      { label: t('interface:pricing.rows.maxFileBytes'), value: 'file' },
      { label: t('interface:pricing.rows.maxVideoSeconds'), value: 'video' },
      { label: t('interface:pricing.rows.maxOutputHeight'), value: 'output' },
      { label: t('interface:pricing.rows.studioProjects'), value: 'projects' },
    ],
  };

  return (
    <div className="container mx-auto max-w-[1100px] px-4 py-12 md:py-16">
      <header className="mb-8 max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-[-0.03em] text-foreground md:text-4xl">
          {t('interface:account.title')}
        </h1>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">
          {t('interface:account.subtitle')}
        </p>
      </header>
      {/* useSearchParams (the ?tab= routing) needs a Suspense boundary on a static page. */}
      <Suspense fallback={null}>
        <AccountDashboard labels={labels} />
      </Suspense>
    </div>
  );
}
