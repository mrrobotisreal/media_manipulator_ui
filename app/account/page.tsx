import type { Metadata } from 'next';

import { getServerT } from '@/lib/i18n/server';
import AccountDashboard, {
  type AccountLabels,
} from '@/components/account/account-dashboard';
import { SITE_ORIGIN } from '@/lib/seo';

// A private dashboard: indexable content would be a bug, and there is nothing
// here for a crawler. Metadata is written inline rather than through
// buildMetadata() because lib/seo.ts is byte-unchanged since main by design.
export const metadata: Metadata = {
  title: 'Your account — Media Manipulator',
  description: 'Your plan, your daily usage, and your saved Content Studio projects.',
  alternates: { canonical: `${SITE_ORIGIN}/account` },
  robots: { index: false, follow: false },
};

/**
 * The page shell is a server component so every label is prerendered and
 * `pages.json` (79 KB) stays out of the client bundle. The dashboard island
 * receives the strings it needs as props and fetches only the numbers.
 *
 * Deliberately not here: a conversion-history list. The API has no endpoint
 * that can serve one — mm_conversion_jobs has no writer at all today, and the
 * in-memory JobManager is addressable only by job id. An empty panel that can
 * never fill would be worse than its absence.
 */
export default function Account() {
  const t = getServerT();

  const labels: AccountLabels = {
    signedOutTitle: t('interface:account.signedOutTitle'),
    signedOutBody: t('interface:account.signedOutBody'),
    signInCta: t('interface:account.signInCta'),
    usageTitle: t('interface:account.usageTitle'),
    planTitle: t('interface:account.planTitle'),
    projectsTitle: t('interface:account.projectsTitle'),
    resets: t('interface:account.resets'),
    metric: {
      ops: t('interface:account.metric.ops'),
      ai_ops: t('interface:account.metric.ai_ops'),
      export: t('interface:account.metric.export'),
    },
    emptyProjects: t('interface:account.emptyProjects'),
    openStudio: t('interface:account.openStudio'),
    comparePlans: t('interface:account.comparePlans'),
    signOut: t('interface:account.signOut'),
    loadFailed: t('interface:account.loadFailed'),
    unlimited: t('interface:pricing.values.unlimited'),
    tierNames: {
      anonymous: t('interface:pricing.tier.anonymous'),
      free: t('interface:pricing.tier.free'),
      premium: t('interface:pricing.tier.premium'),
    },
    planRows: [
      { label: t('interface:pricing.rows.opsPerDay'), value: 'ops' },
      { label: t('interface:pricing.rows.maxFileBytes'), value: 'file' },
      { label: t('interface:pricing.rows.maxVideoSeconds'), value: 'video' },
      { label: t('interface:pricing.rows.maxOutputHeight'), value: 'output' },
      { label: t('interface:pricing.rows.studioProjects'), value: 'projects' },
      { label: t('interface:pricing.rows.resultRetentionHours'), value: 'retention' },
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
      <AccountDashboard labels={labels} />
    </div>
  );
}
