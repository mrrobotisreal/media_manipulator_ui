import type { Metadata } from 'next';
import Link from 'next/link';
import { Clapperboard, Shield, Sparkles, Spline, ArrowRight } from 'lucide-react';
import { buildMetadata } from '@/lib/metadata';
import { JsonLd } from '@/components/seo/json-ld';
import type { ToolPageContent } from '@/content/toolPages';
import { getLocalizedToolPages } from '@/i18n/toolPageContent';
import { REVIEW_CATALOG_SLUGS, REVIEW_INDEXED_TOOL_SLUGS } from '@/content/reviewAllowlist';
import { isSeoFullIndex } from '@/lib/seoFlags';
import { Panel } from '@/components/darkroom/panel';
import ToolCatalog, { type ToolCatalogLabels } from '@/components/tools/tool-catalog';
import { buildCatalogTools } from '@/components/tools/tool-catalog-data';
import { resolveLangParam } from '@/lib/i18n/routeLocale';
import { defaultLocale, localizeHref } from '@/i18n/locales';
import { getServerMetadataT, getServerT } from '@/lib/i18n/server';
import { SITE_NAME } from '@/lib/seo';
import { getSeoOverride } from '@/lib/seoOverrides';

type PageParams = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { lang } = await params;
  const locale = resolveLangParam(lang);
  const meta = buildMetadata('/tools', locale);
  // MM92: a locale with no hand-written SEO override used to fall back to the
  // English <title>/description. Reuse the page's own localized heading and
  // intro instead, mirroring what /voices does. The six override locales and
  // English are unchanged.
  if (locale === defaultLocale || getSeoOverride('/tools', locale)) return meta;
  const t = getServerMetadataT('interface', locale);
  const title = `${t('interface:toolsIndex.title')} | ${SITE_NAME}`;
  const description = t('interface:toolsIndex.intro');
  return {
    ...meta,
    title,
    description,
    openGraph: { ...meta.openGraph, title, description },
    twitter: { ...meta.twitter, title, description },
  };
}

export default async function ToolsIndexPage({ params }: PageParams) {
  const { lang } = await params;
  const locale = resolveLangParam(lang);
  const t = getServerT('interface', locale);
  // EVERY tool page is listed here: /tools is the catalog. Derived per-request
  // from the LOCALIZED tool pages (names/taglines come from TOOL_PAGE_OVERRIDES,
  // like the home-page grid) — a module-scope list built from TOOL_PAGES would
  // bake English into every locale's prerender.
  //
  // The review allowlist no longer decides what is LISTED, only what is
  // indexed: allowlisted tools are starred and sorted first in their group, and
  // the rest render exactly like them. (Until 2026-10-28 this page filtered to
  // the 17 allowlisted slugs, which hid the whole Audio category and ~60 tools
  // that the home-page converter offered with no page to find them from.)
  //
  // MM84 review mode (flag off): the 24 copy-bar tools are full cards; every
  // other non-alias tool is in a collapsed, server-rendered "All tools" list per
  // category with rel="nofollow"; alias pages are not listed at all (search
  // finds their primary). With NEXT_PUBLIC_SEO_FULL_INDEX on, all full cards.
  const localizedPages: ToolPageContent[] = getLocalizedToolPages(locale);
  const contentStudio = localizedPages.find((tool) => tool.slug === 'content-studio');
  // MM48: Motion is featured beside Darkroom, never in the category grid.
  const motion = localizedPages.find((tool) => tool.slug === 'motion');
  const catalogTools = buildCatalogTools(localizedPages, {
    featuredSlugs: new Set<string>(REVIEW_INDEXED_TOOL_SLUGS),
    listedSlugs: new Set<string>(REVIEW_CATALOG_SLUGS),
    fullIndex: isSeoFullIndex(),
    // The "Also: …" alias line is part of the tagline, so it is localized here
    // with the rest of the server-only `toolsIndex.*` strings.
    alsoLine: t('toolsIndex.alsoLine'),
  });
  // Resolved here because `toolsIndex.*` lives in the server-only `pages`
  // shard; the client catalog cannot translate them itself. The two templated
  // strings are passed with their placeholders intact (the server `t` leaves
  // a `{{name}}` alone when no value is supplied), and the catalog fills them.
  const raw = (key: string) => t(key);
  const catalogLabels: ToolCatalogLabels = {
    categories: {
      image: t('toolsIndex.categories.image'),
      video: t('toolsIndex.categories.video'),
      audio: t('toolsIndex.categories.audio'),
      ai: t('toolsIndex.categories.ai'),
      metadata: t('toolsIndex.categories.metadata'),
    },
    groups: {
      edit: t('toolsIndex.groups.edit'),
      convert: t('toolsIndex.groups.convert'),
      ai: t('toolsIndex.groups.ai'),
      privacy: t('toolsIndex.groups.privacy'),
      editor: t('toolsIndex.groups.editor'),
    },
    searchPlaceholder: t('toolsIndex.searchPlaceholder'),
    searchAriaLabel: t('toolsIndex.searchAriaLabel'),
    showingCount: raw('toolsIndex.showingCount'),
    categoriesAriaLabel: t('toolsIndex.categoriesAriaLabel'),
    allCategories: t('toolsIndex.allCategories'),
    noResults: raw('toolsIndex.noResults'),
    popular: t('toolsIndex.popular'),
    moreTools: raw('toolsIndex.moreTools'),
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

            {/* Featured: Motion (MM48) */}
            {motion && (
              <Link
                href={localizeHref('/tools/motion', locale)}
                data-testid="tools-featured-motion"
                className="group mb-8 block rounded-lg border border-edge border-l-2 border-l-data bg-surface-1 p-4 shadow-[inset_0_1px_0_var(--edge-highlight)] transition-shadow duration-[var(--dur-base)] ease-[var(--ease-instrument)] hover:shadow-[var(--glow-data)] sm:p-6"
              >
                <div className="flex items-center gap-4">
                  <div className="shrink-0 rounded-lg bg-data/10 p-3">
                    <Spline className="w-7 h-7 text-data" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="text-lg font-semibold text-card-foreground">
                        {motion.name}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-md bg-data px-2 py-0.5 text-xs font-medium text-data-foreground">
                        <Sparkles className="w-3 h-3" />
                        {t('toolsIndex.svgAnimationEditor')}
                      </span>
                    </span>
                    <p className="mt-1 text-sm text-muted-foreground">{motion.tagline}</p>
                  </div>
                  <span className="hidden shrink-0 items-center gap-1 text-sm font-medium text-data group-hover:translate-x-0.5 transition-transform sm:inline-flex">
                    {t('toolsIndex.open')} <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            )}

            {/* The catalog: search, category tabs, every tool grouped. */}
            <ToolCatalog tools={catalogTools} labels={catalogLabels} />

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
                <Link href={localizeHref('/tutorials/motion', locale)} className="rounded-lg border border-border bg-card px-3 py-2 text-card-foreground transition-colors hover:bg-muted">
                  {t('toolsIndex.motionTutorial')}
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
