// Tools that are polished enough to be indexed and listed during the AdSense
// review. /tools prominently lists only these, and app/sitemap.ts includes
// only these (plus core pages). Non-allowlisted tool pages still work but are
// noindex,nofollow when visited directly.
//
// MM34: when NEXT_PUBLIC_SEO_FULL_INDEX is on (post-approval), every tool page
// is indexable; see isReviewIndexedToolSlug below and lib/seoFlags.ts.

import { isSeoFullIndex } from '@/lib/seoFlags';
import { isToolAliasSlug } from '@/content/toolAliases';
import { PHOTO_ADJUSTMENT_SLUGS } from '@/content/photo/slugs';

export const REVIEW_INDEXED_TOOL_SLUGS = [
  'content-studio',
  // MM48: Motion's landing page (long original copy, guide, plan table, FAQ; no ad slot).
  'motion',
  // MM100: Aperture's landing page (long original copy, guide, plan table, FAQ; no ad slot).
  'aperture',
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
  // MM84: an alias page is noindex in every mode, flag or not.
  if (isToolAliasSlug(slug)) return false;
  return isSeoFullIndex() && slug.length > 0;
}

/**
 * MM84 decision 4: the 24 tools that get full cards on /tools in review mode
 * (the allowlist plus the pending set that meets the copy bar).
 */
/**
 * MM100: the 24 Aperture adjustment pages (content/photo). They meet the copy bar and are
 * listed and linked like the pending set, but stay `noindex` until Mitch reads them (a follow-up
 * moves the approved ones into REVIEW_INDEXED_TOOL_SLUGS). Kept apart from PENDING_ALLOWLIST so
 * the MM28 operation map that test pins is unchanged.
 */
export const PHOTO_PENDING_SLUGS: readonly string[] = PHOTO_ADJUSTMENT_SLUGS;

export const REVIEW_CATALOG_SLUGS: readonly string[] = [...REVIEW_INDEXED_TOOL_SLUGS, ...PENDING_ALLOWLIST, ...PHOTO_PENDING_SLUGS];

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
 * MM84: true when a tool slug may be linked from review-visible pages without
 * rel="nofollow": the allowlist plus the pending set (all 24 meet the copy
 * bar), or any non-alias slug once the full-index flag is on. Indexing is still
 * decided by isReviewIndexedToolSlug; pending pages stay noindex until flipped.
 */
export function isReviewListedToolSlug(slug: string): boolean {
  if (isToolAliasSlug(slug)) return false;
  return REVIEW_CATALOG_SLUGS.includes(slug) || isReviewIndexedToolSlug(slug);
}

/**
 * True when an internal href is safe to surface on review-visible pages. Core
 * pages, blog, and tutorials are always allowed; /tools/<slug> links are only
 * allowed when the slug is in the review allowlist or the pending set (MM84),
 * and never when it is an alias.
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
  if (href.startsWith('/tools/')) {
    const slug = getToolSlugFromHref(href);
    return slug !== null && isReviewListedToolSlug(slug);
  }

  return false;
}
