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

// Statically generate the review-allowed tool pages (content-studio has its own
// dedicated route). dynamicParams stays true so any other valid tool slug still
// renders on demand — but as noindex (see generateMetadata).
export function generateStaticParams() {
  return REVIEW_INDEXED_TOOL_SLUGS.filter((s) => s !== 'content-studio').map(
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
  if (!tool || slug === 'content-studio') return {};

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
  // content-studio is served by app/tools/content-studio/page.tsx.
  if (slug === 'content-studio') notFound();

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
