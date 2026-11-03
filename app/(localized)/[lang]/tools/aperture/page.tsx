import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { buildToolMetadata } from '@/lib/metadata';
import { ToolJsonLd } from '@/components/seo/tool-json-ld';
import ToolLandingPage from '@/components/tools/tool-landing-page';
import PhotoLauncher from '@/components/photo/landing/photo-launcher';
import { ApertureGuide, AperturePlans } from '@/components/photo/landing/aperture-landing';
import { getLocalizedToolBySlug } from '@/i18n/toolPageContent';
import { getLocaleDef } from '@/i18n/locales';
import { loadPublicTiers } from '@/lib/auth/loadTiers';
import { resolveLangParam } from '@/lib/i18n/routeLocale';
import { getServerT } from '@/lib/i18n/server';
import { photoLauncherLabels } from '@/components/photo/landing/labels';

// MM100: Aperture's public landing page. The editor itself is the chromeless /photo/[projectId]
// route (no ads, noindex); this page is a normal localized, indexable tool page
// (`/tools/aperture`) with original copy, a guide, the plan table, recent projects and an
// FAQ. It carries no ad slot (no REVIEW_TOOL_AD_SLOTS entry, like Motion). The plan table
// comes from GET /api/tiers, revalidated like /pricing.
export const revalidate = 300;

type PageParams = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { lang } = await params;
  return buildToolMetadata('aperture', resolveLangParam(lang));
}

export default async function ApertureToolRoute({ params }: PageParams) {
  const { lang } = await params;
  const locale = resolveLangParam(lang);
  const tool = getLocalizedToolBySlug('aperture', locale);
  if (!tool) notFound();
  const t = getServerT('interface', locale);
  const tiers = await loadPublicTiers(revalidate);

  return (
    <div dir={getLocaleDef(locale)?.dir ?? 'ltr'} data-testid="photo-page">
      <ToolJsonLd tool={tool} locale={locale} />
      <ToolLandingPage
        tool={tool}
        locale={locale}
        beforeIntroExtra={<ApertureGuide locale={locale} />}
        panel={<PhotoLauncher locale={locale} panel="basic" labels={photoLauncherLabels(t, tool.embed.title, tool.embed.description)} />}
        afterPanelExtra={<AperturePlans data={tiers} locale={locale} />}
      />
    </div>
  );
}
