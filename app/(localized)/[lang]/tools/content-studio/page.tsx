import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Info } from 'lucide-react';
import { buildMetadata } from '@/lib/metadata';
import { JsonLd } from '@/components/seo/json-ld';
import ToolLandingPage from '@/components/tools/tool-landing-page';
import StudioHostClient from '@/components/content-studio/studio-host-client';
import { TOOL_PAGES } from '@/content/toolPages';
import { resolveLangParam } from '@/lib/i18n/routeLocale';
import { getServerT } from '@/lib/i18n/server';

type PageParams = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { lang } = await params;
  return buildMetadata('/tools/content-studio', resolveLangParam(lang));
}

/**
 * Server-rendered quick-start guide that sits right under the title. It uses a
 * native <details> element so the full guide copy is present in the prerendered
 * HTML (crawlable in view-source) and is not lazy-loaded only after a click.
 */
function StudioGuide({ locale }: { locale: string }) {
  const t = getServerT('interface', locale);
  return (
    <details className="my-4 rounded-lg border border-primary/30 bg-primary/8" open>
      {/* The summary label is a real <h2>: the guide's own sub-sections are
          <h3>, and the page <h1> is ToolLandingPage's title, so without this
          the outline jumps h1 → h3. Styled to render exactly as before. */}
      <summary className="flex cursor-pointer items-center gap-2 px-4 py-3 font-semibold text-card-foreground">
        <Info className="h-4 w-4 text-primary" aria-hidden="true" />
        <h2 className="text-base font-semibold">{t('contentStudioGuide.summaryTitle')}</h2>
      </summary>
      <div className="space-y-4 px-4 pb-4 text-sm text-muted-foreground">
        <div>
          <h3 className="font-medium text-card-foreground">{t('contentStudioGuide.whatItIsTitle')}</h3>
          <p>{t('contentStudioGuide.whatItIsBody')}</p>
        </div>
        <div>
          <h3 className="font-medium text-card-foreground">{t('contentStudioGuide.whenToUseTitle')}</h3>
          <p>{t('contentStudioGuide.whenToUseBody')}</p>
        </div>
        <div>
          <h3 className="font-medium text-card-foreground">{t('contentStudioGuide.supportedMediaTitle')}</h3>
          <p>{t('contentStudioGuide.supportedMediaBody')}</p>
        </div>
        <div>
          <h3 className="font-medium text-card-foreground">{t('contentStudioGuide.stepByStepTitle')}</h3>
          <ol className="mt-1 list-decimal space-y-1 pl-5">
            <li>{t('contentStudioGuide.step1')}</li>
            <li>{t('contentStudioGuide.step2')}</li>
            <li>{t('contentStudioGuide.step3')}</li>
            <li>{t('contentStudioGuide.step4')}</li>
            <li>{t('contentStudioGuide.step5')}</li>
          </ol>
        </div>
        <div>
          <h3 className="font-medium text-card-foreground">{t('contentStudioGuide.timelineTitle')}</h3>
          <p>{t('contentStudioGuide.timelineBody')}</p>
        </div>
        <div>
          <h3 className="font-medium text-card-foreground">{t('contentStudioGuide.exportTitle')}</h3>
          <p>{t('contentStudioGuide.exportBody')}</p>
        </div>
        <div>
          <h3 className="font-medium text-card-foreground">{t('contentStudioGuide.limitationsTitle')}</h3>
          <p>{t('contentStudioGuide.limitationsBody')}</p>
        </div>
        <div>
          <h3 className="font-medium text-card-foreground">{t('contentStudioGuide.privacyTitle')}</h3>
          <p>{t('contentStudioGuide.privacyBody')}</p>
        </div>
      </div>
    </details>
  );
}

export default async function ContentStudioRoute({ params }: PageParams) {
  const { lang } = await params;
  const locale = resolveLangParam(lang);
  const tool = TOOL_PAGES.find((t) => t.slug === 'content-studio');
  if (!tool) notFound();

  return (
    <>
      <JsonLd path="/tools/content-studio" />
      <ToolLandingPage
        tool={tool}
        panel={<StudioHostClient />}
        beforeIntroExtra={<StudioGuide locale={locale} />}
        locale={locale}
      />
    </>
  );
}
