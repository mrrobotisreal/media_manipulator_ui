'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { MockAd } from '@/components/mock-ad';
import { useAuth, type AuthContextValue } from '@/lib/auth/AuthProvider';
import {
  ADSENSE_CLIENT_ID,
  type AdPlacement,
  shouldRenderAdSense,
  shouldRenderMockAd,
  toAdPathname,
} from '@/lib/adsenseConfig';

// Backward-compatible format names from the Vite implementation, retained so
// older call sites keep compiling. They only influence the inferred placement.
type LegacyAdFormat =
  | 'leaderboard'
  | 'rectangle'
  | 'banner'
  | 'halfpage'
  | 'mobile_rectangle';

type AdBannerProps = {
  slot?: string | null;
  adSlot?: string | null;
  placement?: AdPlacement;
  adFormat?: LegacyAdFormat;
  adPosition?: string;
  sticky?: boolean;
  className?: string;
  label?: string;
  // Accepted-but-ignored legacy props so old call sites still type-check.
  utmMedium?: string;
  utmCampaign?: string;
  creativeAssetSrc?: string;
  creativeAssetAlt?: string;
  linkURL?: string;
};

function inferPlacement(args: {
  placement?: AdPlacement;
  adPosition?: string;
  adFormat?: LegacyAdFormat;
  sticky?: boolean;
}): AdPlacement {
  if (args.placement) return args.placement;

  const position = (args.adPosition || '').toLowerCase();

  if (position.includes('anchor')) return 'anchor';
  if (position.includes('postconvert') || position.includes('post_convert')) {
    return 'postconvert';
  }
  if (position.includes('sidebar') || args.sticky || args.adFormat === 'halfpage') {
    return 'sidebar';
  }
  if (position.includes('header')) return 'header';
  if (position.includes('footer')) return 'footer';

  return 'incontent';
}

/**
 * Whether the caller's tier removes ads (MM82 decision 3).
 *
 *   - outside the provider (/embed, /dr): undefined — no tier, no ad;
 *   - while auth is loading: undefined — not decided yet;
 *   - anonymous (no user): false — anonymous visitors see ads, as before;
 *   - signed in with no limits (the account snapshot failed or is absent):
 *     undefined — a Pro user whose /me call errors must never be shown an ad;
 *   - otherwise the snapshot's `adsRemoved`.
 *
 * `undefined` keeps the reserved container empty (`isAdAllowedForTier`).
 */
export function resolveTierRemovesAds(
  auth: Pick<AuthContextValue, 'loading' | 'user' | 'limits'> | null,
): boolean | undefined {
  if (!auth || auth.loading) return undefined;
  if (!auth.user) return Boolean(auth.limits?.adsRemoved);
  if (auth.limits == null) return undefined;
  return Boolean(auth.limits.adsRemoved);
}

/**
 * Hard-guarded ad slot. It renders a real AdSense <ins> ONLY when
 * shouldRenderAdSense() passes (real numeric slot + review-allowed
 * page/placement + AdSense explicitly enabled in production). Otherwise it
 * renders a first-party MockAd in local preview, or nothing. A placeholder
 * value can never reach data-ad-slot because isRealAdSenseSlot rejects it.
 */
export default function AdBanner({
  slot,
  adSlot,
  placement,
  adFormat,
  adPosition,
  sticky,
  className,
  label = 'Advertisement',
}: AdBannerProps) {
  // English pages are served through the internal /en rewrite, so the router
  // can report /en/tools/x for the public /tools/x; decide on the public path.
  const pathname = toAdPathname(usePathname() || '/');
  const resolvedSlot = slot ?? adSlot ?? null;
  const resolvedPlacement = inferPlacement({
    placement,
    adPosition,
    adFormat,
    sticky,
  });

  // Premium and Pro remove ads. `undefined` while the tier resolves (or when a
  // signed-in visitor's snapshot is missing) means "not decided", so nothing
  // renders into the reserved container until the answer is known — deciding
  // early and correcting later is a layout shift.
  const tierRemovesAds = resolveTierRemovesAds(useAuth());

  // MM82 (ADR-0016): the unit's EXISTENCE is gated on tier, path, placement
  // and slot only. Consent affects personalisation through Consent Mode (the
  // layout's denied defaults + lib/consent/consentModeBridge.ts), never whether
  // the unit exists. Google's script itself is loaded once per eligible page by
  // components/ads/adsense-loader.tsx in the layout.
  const canRenderAdSense = shouldRenderAdSense({
    slot: resolvedSlot,
    pathname,
    placement: resolvedPlacement,
    tierRemovesAds,
  });

  const canRenderMockAd =
    tierRemovesAds === false &&
    shouldRenderMockAd({
      pathname,
      placement: resolvedPlacement,
    });

  useEffect(() => {
    if (!canRenderAdSense) return;

    try {
      const adsWindow = window as typeof window & {
        adsbygoogle?: Array<Record<string, unknown>>;
      };

      adsWindow.adsbygoogle = adsWindow.adsbygoogle || [];
      adsWindow.adsbygoogle.push({});
    } catch (error) {
      // Duplicate-fill / already-filled errors are expected and harmless.
      if (process.env.NODE_ENV !== 'production') {
        console.debug('AdSense push ignored', error);
      }
    }
  }, [canRenderAdSense, resolvedSlot]);

  if (canRenderAdSense && resolvedSlot) {
    return (
      <div className={className} aria-label={label}>
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client={ADSENSE_CLIENT_ID}
          data-ad-slot={resolvedSlot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    );
  }

  if (canRenderMockAd) {
    return (
      <MockAd placement={resolvedPlacement} className={className} label={label} />
    );
  }

  return null;
}
