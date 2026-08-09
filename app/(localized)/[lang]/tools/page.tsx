import type { Metadata } from 'next';
import Link from 'next/link';
import { Clapperboard, Shield, Sparkles, ArrowRight } from 'lucide-react';
import { buildMetadata } from '@/lib/metadata';
import { JsonLd } from '@/components/seo/json-ld';
import { TOOL_PAGES, type ToolPageContent } from '@/content/toolPages';
import { REVIEW_INDEXED_TOOL_SLUGS } from '@/content/reviewAllowlist';
import { Panel } from '@/components/darkroom/panel';
import { resolveLangParam } from '@/lib/i18n/routeLocale';
import { localizeHref } from '@/i18n/locales';
import { getServerT } from '@/lib/i18n/server';

type PageParams = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { lang } = await params;
  return buildMetadata('/tools', resolveLangParam(lang));
}

const CATEGORY_ORDER: ToolPageContent['category'][] = [
  'image',
  'video',
  'audio',
  'ai',
  'metadata',
];

// Only the review-allowed tools are surfaced here.
const allowedTools = REVIEW_INDEXED_TOOL_SLUGS.map((slug) =>
  TOOL_PAGES.find((t) => t.slug === slug),
).filter((t): t is ToolPageContent => Boolean(t));

const contentStudio = allowedTools.find((t) => t.slug === 'content-studio');

function toolsByCategory(category: ToolPageContent['category']) {
  return allowedTools.filter(
    (t) => t.category === category && t.slug !== 'content-studio',
  );
}

export default async function ToolsIndexPage({ params }: PageParams) {
  const { lang } = await params;
  const locale = resolveLangParam(lang);
  const t = getServerT('interface', locale);
  const CATEGORY_LABELS: Record<ToolPageContent['category'], string> = {
    image: t('toolsIndex.categories.image'),
    video: t('toolsIndex.categories.video'),
    audio: t('toolsIndex.categories.audio'),
    ai: t('toolsIndex.categories.ai'),
    metadata: t('toolsIndex.categories.metadata'),
    contentStudio: t('toolsIndex.categories.contentStudio'),
  };
  return (
    <>
      <JsonLd path="/tools" />
      <div className="max-w-6xl mx-auto my-2 px-4">
        <Panel level="1">
            <header className="mb-6">
              <h1 className="text-3xl md:text-4xl font-bold text-card-foreground">
                {t('toolsIndex.title')}
              </h1>
              <p className="text-lg text-muted-foreground mt-3 max-w-3xl">
                {t('toolsIndex.intro')}
              </p>
            </header>

            {/* Featured: Content Studio */}
            {contentStudio && (
              <Link
                href={localizeHref('/tools/content-studio', locale)}
                className="group mb-8 block rounded-lg border border-edge border-l-2 border-l-data bg-surface-1 p-4 shadow-[inset_0_1px_0_var(--edge-highlight)] transition-shadow duration-[var(--dur-base)] ease-[var(--ease-instrument)] hover:shadow-[var(--glow-data)] sm:p-6"
              >
                <div className="flex items-center gap-4">
                  <div className="shrink-0 rounded-lg bg-data/10 p-3">
                    <Clapperboard className="w-7 h-7 text-data" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="text-lg font-semibold text-card-foreground">
                        {contentStudio.name}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-md bg-data px-2 py-0.5 text-xs font-medium text-data-foreground">
                        <Sparkles className="w-3 h-3" />
                        {t('toolsIndex.multiTrackEditor')}
                      </span>
                    </span>
                    <p className="mt-1 text-sm text-muted-foreground">{contentStudio.tagline}</p>
                  </div>
                  <span className="hidden shrink-0 items-center gap-1 text-sm font-medium text-data group-hover:translate-x-0.5 transition-transform sm:inline-flex">
                    {t('toolsIndex.open')} <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            )}

            {/* Categorised tool grid */}
            {CATEGORY_ORDER.map((category) => {
              const tools = toolsByCategory(category);
              if (tools.length === 0) return null;
              return (
                <section key={category} className="my-8" aria-label={CATEGORY_LABELS[category]}>
                  <h2 className="text-2xl font-semibold text-card-foreground mb-3">
                    {CATEGORY_LABELS[category]}
                  </h2>
                  <div className="grid gap-3 md:grid-cols-2">
                    {tools.map((tool) => (
                      <Link
                        key={tool.slug}
                        href={localizeHref(`/tools/${tool.slug}`, locale)}
                        className="block rounded-lg border border-border bg-background/40 p-4 hover:bg-muted/40 transition-colors"
                      >
                        <span className="font-medium text-card-foreground">{tool.name}</span>
                        <span className="mt-1 block text-sm text-muted-foreground">
                          {tool.tagline}
                        </span>
                      </Link>
                    ))}
                  </div>
                </section>
              );
            })}

            {/* Privacy / file-handling */}
            <section
              className="my-8 flex items-start gap-3 rounded-lg border border-primary/30 bg-primary/10 p-4"
              aria-label={t('toolsIndex.privacyAriaLabel')}
            >
              <Shield className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <div>
                <h2 className="text-base font-semibold text-card-foreground">
                  {t('toolsIndex.privacyTitle')}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t('toolsIndex.privacyBody')}
                </p>
              </div>
            </section>

            {/* Learn more */}
            <section className="my-8" aria-label={t('toolsIndex.learnMoreAriaLabel')}>
              <h2 className="text-2xl font-semibold text-card-foreground mb-3">{t('toolsIndex.newHereTitle')}</h2>
              <p className="text-sm text-muted-foreground mb-3">
                {t('toolsIndex.newHereBody')}
              </p>
              <div className="flex flex-wrap gap-2 text-sm">
                <Link href={localizeHref('/tutorials', locale)} className="rounded-lg bg-primary px-3 py-2 text-primary-foreground transition-colors hover:bg-[var(--accent-primary-hover)]">
                  {t('toolsIndex.browseAllTutorials')}
                </Link>
                <Link href={localizeHref('/tutorials/content-studio', locale)} className="rounded-lg border border-border bg-card px-3 py-2 text-card-foreground transition-colors hover:bg-muted">
                  {t('toolsIndex.darkroomTutorial')}
                </Link>
                <Link href={localizeHref('/how-it-works', locale)} className="rounded-lg border border-border bg-card px-3 py-2 text-card-foreground transition-colors hover:bg-muted">
                  {t('toolsIndex.howItWorks')}
                </Link>
              </div>
            </section>

        </Panel>
      </div>
    </>
  );
}
