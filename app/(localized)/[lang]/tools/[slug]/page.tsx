import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { buildToolMetadata } from '@/lib/metadata';
import { ToolJsonLd } from '@/components/seo/tool-json-ld';
import ToolLandingPage from '@/components/tools/tool-landing-page';
import { TOOL_PAGES } from '@/content/toolPages';
import { isSeoFullIndex } from '@/lib/seoFlags';
import { REVIEW_INDEXED_TOOL_SLUGS } from '@/content/reviewAllowlist';
import { PHOTO_ADJUSTMENT_SLUGS } from '@/content/photo/slugs';
import { resolveLangParam } from '@/lib/i18n/routeLocale';
import { getLocalizedToolBySlug } from '@/i18n/toolPageContent';
import PhotoDropzone from '@/components/photo/landing/photo-dropzone';
import { photoDropzoneLabels } from '@/components/photo/landing/labels';
import { getServerT } from '@/lib/i18n/server';

// Slugs served by dedicated static routes (custom interactive panels) instead
// of this dynamic one. Exclude them here AND in generateMetadata AND in the
// page body so the static sibling owns the URL.
const STATIC_ROUTE_SLUGS = new Set(['content-studio', 'motion', 'aperture', 'medi', 'ai-video-restoration', 'ai-image-restoration', 'ai-document-scan']);

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
    : [...REVIEW_INDEXED_TOOL_SLUGS, ...aliasSlugs, ...PHOTO_ADJUSTMENT_SLUGS]; // MM100: the Aperture pages are prerendered (noindex until approved) so their HTML is auditable
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

  // MM84 aliases (canonical to the primary, `noindex, follow`), MM34's
  // non-allowlisted `noindex, nofollow`, and MM86's English-fallback rule
  // (a locale that does not cover the whole body is `noindex, follow` with no
  // hreflang) all live in buildToolMetadata.
  return buildToolMetadata(slug, locale);
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

  // MM86: the localized entry (English where the locale has no override).
  const tool = getLocalizedToolBySlug(slug, locale);
  if (!tool) notFound();

  return (
    <>
      {/* Structured data only where this page is indexable in this locale. */}
      <ToolJsonLd tool={tool} locale={locale} />
      {tool.embed.preset?.kind === 'photo' ? (
        // MM100: an Aperture adjustment page. The drop zone hands the photo to the editor with
        // this page's panel (and look) in front; the copy around it is the ordinary tool body.
        <ToolLandingPage
          tool={tool}
          locale={locale}
          panel={
            <PhotoDropzone
              panel={tool.embed.preset.panel}
              preset={tool.embed.preset.preset}
              slug={tool.slug}
              title={tool.embed.title}
              description={tool.embed.description}
              labels={photoDropzoneLabels(getServerT('interface', locale))}
            />
          }
        />
      ) : (
        <ToolLandingPage tool={tool} locale={locale} />
      )}
    </>
  );
}
