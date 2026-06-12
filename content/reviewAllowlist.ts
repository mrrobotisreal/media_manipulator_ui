// Tools that are polished enough to be indexed and listed during the AdSense
// review. /tools prominently lists only these, and app/sitemap.ts includes
// only these (plus core pages). Non-allowlisted tool pages still work but are
// noindex,nofollow when visited directly.

export const REVIEW_INDEXED_TOOL_SLUGS = [
  'content-studio',
  'remove-exif-metadata',
  'compress-image',
  'image-resizer',
  'remove-background-from-image',
  'image-to-pdf',
  'pdf-to-jpg',
  'compress-video',
  'video-trimmer',
  'extract-audio-from-video',
  'convert-video-to-animated-gif',
  'transcribe-video',
  'transcode-to-hls',
  'ai-video-restoration',
  'ai-image-restoration',
] as const;

export type ReviewIndexedToolSlug = (typeof REVIEW_INDEXED_TOOL_SLUGS)[number];

export function isReviewIndexedToolSlug(
  slug: string,
): slug is ReviewIndexedToolSlug {
  return (REVIEW_INDEXED_TOOL_SLUGS as readonly string[]).includes(slug);
}

/** Extract the tool slug from a /tools/<slug> href, or null. */
export function getToolSlugFromHref(href: string): string | null {
  if (!href.startsWith('/tools/')) return null;
  const withoutQuery = href.split('?')[0] || href;
  const withoutHash = withoutQuery.split('#')[0] || withoutQuery;
  const slug = withoutHash.replace(/^\/tools\//, '').replace(/\/+$/, '');
  return slug.length > 0 ? slug : null;
}

/** True when an href points to a review-allowlisted tool page. */
export function isReviewAllowedToolHref(href: string): boolean {
  const slug = getToolSlugFromHref(href);
  return slug !== null && isReviewIndexedToolSlug(slug);
}

/**
 * True when an internal href is safe to surface on review-visible pages. Core
 * pages, blog, and tutorials are always allowed; /tools/<slug> links are only
 * allowed when the slug is in the review allowlist.
 */
export function isReviewSafeInternalHref(href: string): boolean {
  if (!href.startsWith('/')) return false;

  if (href === '/') return true;
  if (href === '/tools') return true;
  if (href === '/about') return true;
  if (href === '/how-it-works') return true;
  if (href === '/tutorials') return true;
  if (href === '/blog') return true;
  if (href === '/privacy-policy') return true;
  if (href === '/terms-of-service') return true;

  if (href.startsWith('/tutorials/')) return true;
  if (href.startsWith('/blog/')) return true;
  if (href.startsWith('/tools/')) return isReviewAllowedToolHref(href);

  return false;
}
