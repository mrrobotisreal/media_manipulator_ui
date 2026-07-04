import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { buildMetadata } from '@/lib/metadata';
import { JsonLd } from '@/components/seo/json-ld';
import ToolLandingPage from '@/components/tools/tool-landing-page';
import { TOOL_PAGES } from '@/content/toolPages';
import {
  REVIEW_INDEXED_TOOL_SLUGS,
  isReviewIndexedToolSlug,
} from '@/content/reviewAllowlist';

// Slugs served by dedicated static routes (custom interactive panels) instead
// of this dynamic one. Exclude them here AND in generateMetadata AND in the
// page body so the static sibling owns the URL.
const STATIC_ROUTE_SLUGS = new Set(['content-studio', 'ai-video-restoration', 'ai-image-restoration', 'ai-document-scan']);

// Statically generate the review-allowed tool pages (static-route slugs have
// their own dedicated routes). dynamicParams stays true so any other valid
// tool slug still renders on demand — but as noindex (see generateMetadata).
export function generateStaticParams() {
  return REVIEW_INDEXED_TOOL_SLUGS.filter((s) => !STATIC_ROUTE_SLUGS.has(s)).map(
    (slug) => ({ slug }),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tool = TOOL_PAGES.find((t) => t.slug === slug);
  if (!tool || STATIC_ROUTE_SLUGS.has(slug)) return {};

  const meta = buildMetadata(`/tools/${slug}`);
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
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  // Static-route slugs are served by their dedicated page.tsx siblings.
  if (STATIC_ROUTE_SLUGS.has(slug)) notFound();

  const tool = TOOL_PAGES.find((t) => t.slug === slug);
  if (!tool) notFound();

  return (
    <>
      {/* Only emit rich structured data for indexed (review-allowed) tools. */}
      {isReviewIndexedToolSlug(slug) ? <JsonLd path={`/tools/${slug}`} /> : null}
      <ToolLandingPage tool={tool} />
    </>
  );
}
