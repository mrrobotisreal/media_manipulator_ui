import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { buildMetadata } from '@/lib/metadata';
import { JsonLd } from '@/components/seo/json-ld';
import ToolLandingPage from '@/components/tools/tool-landing-page';
import { TOOL_PAGES } from '@/content/toolPages';
import { isSeoFullIndex } from '@/lib/seoFlags';
import {
  REVIEW_INDEXED_TOOL_SLUGS,
  isReviewIndexedToolSlug,
} from '@/content/reviewAllowlist';
import { resolveLangParam } from '@/lib/i18n/routeLocale';
import { translatorRobots } from '@/lib/translator/mode';

// Slugs served by dedicated static routes (custom interactive panels) instead
// of this dynamic one. Exclude them here AND in generateMetadata AND in the
// page body so the static sibling owns the URL.
const STATIC_ROUTE_SLUGS = new Set(['content-studio', 'motion', 'ai-video-restoration', 'ai-image-restoration', 'ai-document-scan']);

// Statically generate the review-allowed tool pages (static-route slugs have
// their own dedicated routes). dynamicParams stays true so any other valid
// tool slug still renders on demand — but as noindex (see generateMetadata).
export function generateStaticParams() {
  // MM34: with the full-index flag on, prerender every tool page.
  // MM84: alias pages are prerendered in both modes (they are small), so their
  // canonical and `noindex, follow` are in static HTML that the audit checks.
  const aliasSlugs = TOOL_PAGES.filter((t) => t.aliasOf).map((t) => t.slug);
  const slugs: readonly string[] = isSeoFullIndex()
    ? TOOL_PAGES.map((t) => t.slug)
    : [...REVIEW_INDEXED_TOOL_SLUGS, ...aliasSlugs];
  return slugs.filter((s) => !STATIC_ROUTE_SLUGS.has(s)).map(
    (slug) => ({ slug }),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  const locale = resolveLangParam(lang);
  const tool = TOOL_PAGES.find((t) => t.slug === slug);
  if (!tool || STATIC_ROUTE_SLUGS.has(slug)) return {};

  const meta = buildMetadata(`/tools/${slug}`, locale);
  // MM84: an alias page canonicalises to its primary (buildMetadata reads it
  // from lib/seo.ts) and is `noindex, follow` in every mode, so link equity
  // flows to the primary; it advertises no hreflang alternates.
  if (tool.aliasOf) {
    meta.robots = translatorRobots({ index: false, follow: true });
    if (meta.alternates) meta.alternates.languages = undefined;
    return meta;
  }
  // Non-allowlisted tools remain usable but are kept out of the index/serp
  // during the review.
  if (!isReviewIndexedToolSlug(slug)) {
    meta.robots = { index: false, follow: false };
  }
  return meta;
}

export default async function ToolSlugPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  const locale = resolveLangParam(lang);
  // Static-route slugs are served by their dedicated page.tsx siblings.
  if (STATIC_ROUTE_SLUGS.has(slug)) notFound();

  const tool = TOOL_PAGES.find((t) => t.slug === slug);
  if (!tool) notFound();

  return (
    <>
      {/* Only emit rich structured data for indexed (review-allowed) tools. */}
      {isReviewIndexedToolSlug(slug) && !tool.aliasOf ? <JsonLd path={`/tools/${slug}`} /> : null}
      <ToolLandingPage tool={tool} locale={locale} />
    </>
  );
}
