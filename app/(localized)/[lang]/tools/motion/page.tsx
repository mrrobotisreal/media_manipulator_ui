import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { buildMetadata } from '@/lib/metadata';
import { JsonLd } from '@/components/seo/json-ld';
import ToolLandingPage from '@/components/tools/tool-landing-page';
import MotionLauncher from '@/components/vector/landing/recent-projects';
import { MotionGuide, MotionPlans } from '@/components/vector/landing/motion-landing';
import { getLocalizedToolBySlug } from '@/i18n/toolPageContent';
import { getLocaleDef } from '@/i18n/locales';
import { loadPublicTiers } from '@/lib/auth/loadTiers';
import { resolveLangParam } from '@/lib/i18n/routeLocale';
import { getServerT } from '@/lib/i18n/server';
import { MOTION_BRAND } from '@/lib/vector/brand';

// MM48: Motion's public landing page. The editor itself is the chromeless
// /motion/[projectId] route (no ads, noindex); this page is a normal localized,
// indexable tool page with original copy, a guide, the plan table and a FAQ.
const PATH = '/tools/motion';

// The plan table comes from GET /api/tiers, revalidated like /pricing.
export const revalidate = 300;

type PageParams = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { lang } = await params;
  return buildMetadata(PATH, resolveLangParam(lang));
}

export default async function MotionToolRoute({ params }: PageParams) {
  const { lang } = await params;
  const locale = resolveLangParam(lang);
  const tool = getLocalizedToolBySlug('motion', locale);
  if (!tool) notFound();
  const t = getServerT('interface', locale);
  const tiers = await loadPublicTiers(revalidate);
  const k = 'motionPage.launcher';
  const brand = { values: { brand: MOTION_BRAND } };

  return (
    <div dir={getLocaleDef(locale)?.dir ?? 'ltr'} data-testid="motion-page">
      <JsonLd path={PATH} />
      <ToolLandingPage
        tool={tool}
        locale={locale}
        beforeIntroExtra={<MotionGuide locale={locale} />}
        panel={
          <MotionLauncher
            locale={locale}
            labels={{
              open: t(`${k}.open`, brand),
              openHint: t(`${k}.openHint`),
              recentTitle: t(`${k}.recentTitle`),
              sourceAccount: t(`${k}.sourceAccount`),
              sourceBrowser: t(`${k}.sourceBrowser`),
              loading: t(`${k}.loading`),
              empty: t(`${k}.empty`),
              error: t(`${k}.error`),
              untitled: t('vector.untitled'),
              edited: t(`${k}.edited`),
            }}
          />
        }
        afterPanelExtra={<MotionPlans data={tiers} locale={locale} />}
      />
    </div>
  );
}
