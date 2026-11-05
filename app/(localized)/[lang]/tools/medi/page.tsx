import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { buildToolMetadata } from '@/lib/metadata';
import { ToolJsonLd } from '@/components/seo/tool-json-ld';
import ToolLandingPage from '@/components/tools/tool-landing-page';
import { MediGuide, MediPlans, MediTryPanel } from '@/components/assistant/landing/medi-landing';
import { getLocalizedToolBySlug } from '@/i18n/toolPageContent';
import { getLocaleDef } from '@/i18n/locales';
import { loadPublicTiers } from '@/lib/auth/loadTiers';
import { resolveLangParam } from '@/lib/i18n/routeLocale';

// MM111: Medi's public launch page. Like /tools/aperture it is a normal localized tool page with original copy,
// a four-step guide, the plan table (from GET /api/tiers, revalidated like /pricing) and an FAQ; no ad slot
// (no REVIEW_TOOL_AD_SLOTS entry). The guide button itself lives in the corner of every public page.
export const revalidate = 300;

type PageParams = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { lang } = await params;
  return buildToolMetadata('medi', resolveLangParam(lang));
}

export default async function MediToolRoute({ params }: PageParams) {
  const { lang } = await params;
  const locale = resolveLangParam(lang);
  const tool = getLocalizedToolBySlug('medi', locale);
  if (!tool) notFound();
  const tiers = await loadPublicTiers(revalidate);

  return (
    <div dir={getLocaleDef(locale)?.dir ?? 'ltr'} data-testid="medi-page">
      <ToolJsonLd tool={tool} locale={locale} />
      <ToolLandingPage
        tool={tool}
        locale={locale}
        beforeIntroExtra={<MediGuide locale={locale} />}
        panel={<MediTryPanel locale={locale} />}
        afterPanelExtra={<MediPlans data={tiers} locale={locale} />}
      />
    </div>
  );
}
