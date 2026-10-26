// Tools that are polished enough to be indexed and listed during the AdSense
// review. /tools prominently lists only these, and app/sitemap.ts includes
// only these (plus core pages). Non-allowlisted tool pages still work but are
// noindex,nofollow when visited directly.
//
// MM34: when NEXT_PUBLIC_SEO_FULL_INDEX is on (post-approval), every tool page
// is indexable; see isReviewIndexedToolSlug below and lib/seoFlags.ts.

import { isSeoFullIndex } from '@/lib/seoFlags';

export const REVIEW_INDEXED_TOOL_SLUGS = [
  'content-studio',
  // MM48: Motion's landing page (long original copy, guide, plan table, FAQ; no ad slot).
  'motion',
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
  'ai-document-scan',
] as const;

/**
 * PENDING_ALLOWLIST (MM28 -> MM34). These seven pages exist, are fully written
 * in all six locales, and are deliberately NOT in REVIEW_INDEXED_TOOL_SLUGS, so
 * they stay noindex,nofollow and out of the sitemap and /tools grid. MM34 flips
 * them into the allowlist after the AdSense content pass. Do not add them here
 * before then. Honoured at runtime only under NEXT_PUBLIC_SEO_FULL_INDEX
 * (MM34): with the flag on, isReviewIndexedToolSlug accepts these too (and
 * every other tool page).
 */
export const PENDING_ALLOWLIST = [
  'ai-image-upscaler',
  'blur-faces-in-photo',
  'redact-text-in-image',
  'remove-object-from-photo',
  'clean-voice-audio',
  'remove-background-noise',
  'remove-vocals-from-song',
] as const;

export type ReviewIndexedToolSlug = (typeof REVIEW_INDEXED_TOOL_SLUGS)[number];

/**
 * Flag off (default): true only for the 17 allowlisted slugs. Flag on: true for
 * every tool slug, including PENDING_ALLOWLIST. Unknown slugs never reach a
 * rendered page (the route 404s first), so the flag-on branch does not import
 * the large toolPages catalog into client bundles just to re-check membership.
 */
export function isReviewIndexedToolSlug(slug: string): boolean {
  if ((REVIEW_INDEXED_TOOL_SLUGS as readonly string[]).includes(slug)) return true;
  return isSeoFullIndex() && slug.length > 0;
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
  if (href === '/voices') return true;
  if (href === '/licenses') return true;

  if (href.startsWith('/tutorials/')) return true;
  if (href.startsWith('/blog/')) return true;
  if (href.startsWith('/tools/')) return isReviewAllowedToolHref(href);

  return false;
}
