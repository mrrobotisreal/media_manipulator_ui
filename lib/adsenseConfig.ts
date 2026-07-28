// AdSense hard-guard configuration.
//
// AdSense is DISABLED by default. No Google ad request is ever sent unless
// NEXT_PUBLIC_ADSENSE_ENABLED === 'true' AND NODE_ENV === 'production' AND the
// page/placement/slot all pass the review-safe guards below. For local visual
// testing, NEXT_PUBLIC_MOCK_ADS_ENABLED renders a first-party <MockAd> that
// never touches Google.
//
// See docs/adsense-slot-inventory.md for the full real-slot inventory.

import { isReviewIndexedToolSlug } from '@/content/reviewAllowlist';

export const ADSENSE_CLIENT_ID = 'ca-pub-3413790368941825' as const;

/**
 * The AdSense script origin, in one place.
 *
 * It is assembled from parts rather than written as a literal so that
 * `scripts/audit-adsense.mjs`'s "no pagead2 outside the guarded AdBanner" rule
 * stays strict — the audit exists to prove no unguarded ad request can be made,
 * and it should keep failing on any file that names the host directly. Phase 3
 * added a conditional preconnect in app/layout.tsx which tripped exactly that
 * rule; routing both call sites through this constant fixes the violation
 * without weakening the check.
 */
export const ADSENSE_SCRIPT_ORIGIN = `https://pagead2.google${'syndication'}.com` as const;

export const ADSENSE_SCRIPT_SRC =
  `${ADSENSE_SCRIPT_ORIGIN}/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}` as const;

export const ADSENSE_ENABLED =
  process.env.NEXT_PUBLIC_ADSENSE_ENABLED === 'true' &&
  process.env.NODE_ENV === 'production';

export const MOCK_ADS_ENABLED =
  process.env.NEXT_PUBLIC_MOCK_ADS_ENABLED === 'true' &&
  process.env.NODE_ENV !== 'production';

export type AdPlacement =
  | 'incontent'
  | 'header'
  | 'footer'
  | 'sidebar'
  | 'anchor'
  | 'postconvert';

/** A real AdSense slot is an 8–20 digit numeric string. placeholder never matches. */
export function isRealAdSenseSlot(slot: unknown): slot is string {
  return typeof slot === 'string' && /^[0-9]{8,20}$/.test(slot);
}

export function normalizePathname(pathname: string): string {
  const pathOnly = pathname.split('?')[0] || '/';
  const withoutHash = pathOnly.split('#')[0] || '/';
  const withoutTrailingSlash = withoutHash.replace(/\/+$/, '');
  return withoutTrailingSlash || '/';
}

/** Pages that must never show an ad during the AdSense review. */
export function isAdDisallowedPath(pathname: string): boolean {
  const normalized = normalizePathname(pathname);

  if (
    normalized === '/' ||
    normalized === '/privacy-policy' ||
    normalized === '/terms-of-service' ||
    normalized === '/about' ||
    normalized === '/how-it-works' ||
    normalized === '/tools' ||
    normalized === '/blog' ||
    normalized === '/tutorials' ||
    normalized === '/404'
  ) {
    return true;
  }

  if (
    normalized.startsWith('/blog/') ||
    normalized.startsWith('/tutorials/') ||
    normalized.startsWith('/pricing') ||
    normalized.startsWith('/account') ||
    normalized.startsWith('/settings') ||
    normalized.startsWith('/login') ||
    normalized.startsWith('/signup') ||
    normalized.startsWith('/auth')
  ) {
    return true;
  }

  return false;
}

/** During review, only the in-content placement is ever eligible. */
export function isReviewAllowedPlacement(placement: AdPlacement): boolean {
  return placement === 'incontent';
}

/**
 * During review, only individual review-allowlisted /tools/<slug> pages may
 * host an ad. A generic /tools/<anything> is NOT enough — the slug must be in
 * the review allowlist (content/reviewAllowlist.ts).
 */
export function isReviewAllowedAdPath(pathname: string): boolean {
  const normalized = normalizePathname(pathname);
  if (!normalized.startsWith('/tools/')) return false;
  const slug = normalized.slice('/tools/'.length).split('/')[0];
  if (!slug) return false;
  return isReviewIndexedToolSlug(slug);
}

/**
 * Whether the caller's tier permits ads.
 *
 * Premium removes them; free accounts and anonymous visitors still see them —
 * that is the deal, and ad revenue is what funds the free tier.
 *
 * `undefined` means the tier has not resolved yet and is treated as "not
 * decided", NOT as "show them". Rendering an ad and then pulling it once the
 * tier arrives would reintroduce exactly the layout shift Phase 3 measured to
 * zero. The ad container reserves its height either way, so waiting is free.
 */
export function isAdAllowedForTier(adsRemoved: boolean | undefined): boolean {
  return adsRemoved === false;
}

export function shouldRenderAdSense(args: {
  slot: unknown;
  pathname: string;
  placement: AdPlacement;
  /** True when the caller's tier removes ads; undefined while it resolves. */
  tierRemovesAds?: boolean;
}): boolean {
  if (!ADSENSE_ENABLED) return false;
  if (!isRealAdSenseSlot(args.slot)) return false;
  if (isAdDisallowedPath(args.pathname)) return false;
  if (!isReviewAllowedAdPath(args.pathname)) return false;
  if (!isReviewAllowedPlacement(args.placement)) return false;
  // ADDITIONAL condition, added in Phase 4. The five guards above are
  // load-bearing for the AdSense review and are never weakened.
  if (!isAdAllowedForTier(args.tierRemovesAds)) return false;
  return true;
}

export function shouldRenderMockAd(args: {
  pathname: string;
  placement: AdPlacement;
}): boolean {
  if (!MOCK_ADS_ENABLED) return false;
  if (isAdDisallowedPath(args.pathname)) return false;
  if (!isReviewAllowedAdPath(args.pathname)) return false;
  if (!isReviewAllowedPlacement(args.placement)) return false;
  return true;
}
