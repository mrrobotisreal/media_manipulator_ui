'use client';

import { useEffect } from 'react';
import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { MockAd } from '@/components/mock-ad';
import {
  ADSENSE_CLIENT_ID,
  type AdPlacement,
  shouldRenderAdSense,
  shouldRenderMockAd,
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
  const pathname = usePathname() || '/';
  const resolvedSlot = slot ?? adSlot ?? null;
  const resolvedPlacement = inferPlacement({
    placement,
    adPosition,
    adFormat,
    sticky,
  });

  const canRenderAdSense = shouldRenderAdSense({
    slot: resolvedSlot,
    pathname,
    placement: resolvedPlacement,
  });

  const canRenderMockAd = shouldRenderMockAd({
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
        <Script
          id="adsense-script"
          src={
            'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' +
            ADSENSE_CLIENT_ID
          }
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />
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
