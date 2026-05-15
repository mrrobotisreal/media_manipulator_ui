import React, { useEffect, useRef } from 'react';
import { trackAdInteraction } from '@/lib/analytics';

type AdFormat = 'auto' | 'rectangle' | 'leaderboard' | 'banner';

interface AdBannerProps {
  adSlot: string;
  adFormat?: AdFormat;
  className?: string;
  adPosition: string; // For analytics tracking
  style?: React.CSSProperties;
  isFlashMock?: boolean;
  utmMedium?: string;
  utmCampaign?: string;
  linkURL?: string;
}

declare global {
  interface Window {
    adsbygoogle: Record<string, unknown>[];
  }
}

// IAB-standard sizes. Keeping these as the canonical dimensions for each
// supported format so the container reserves the correct space (no CLS) and
// the "Advertisement" label sits directly above the rendered ad, not at the
// edge of the full-width page wrapper.
const AD_FORMAT_DIMENSIONS: Record<AdFormat, { maxWidth: number; minHeight: number; label: string }> = {
  leaderboard: { maxWidth: 728, minHeight: 90, label: '728x90' },     // IAB Leaderboard
  rectangle:   { maxWidth: 336, minHeight: 280, label: '336x280' },   // Large Rectangle (MPU upper bound)
  banner:      { maxWidth: 468, minHeight: 60, label: '468x60' },     // IAB Full Banner
  auto:        { maxWidth: 970, minHeight: 90, label: 'auto' },       // Responsive, capped near Billboard width
};

// AdSense policy requires ad units to be labeled with either "Advertisement" or
// "Sponsored Links" — no other wording is permitted. The label must sit outside
// the ad iframe, be clearly distinguishable from content, and must not imply
// user benefit or hide the ad's nature. See:
// https://support.google.com/adsense/answer/9335564
const AdLabel: React.FC = () => (
  <div
    className="flex items-center justify-end mb-1 select-none"
    aria-label="Advertisement"
  >
    <span className="text-[10px] leading-none uppercase tracking-[0.12em] font-medium text-muted-foreground/80 bg-background/60 backdrop-blur-sm rounded px-1.5 py-0.5 border border-border/40">
      Advertisement
    </span>
  </div>
);

const AdBanner: React.FC<AdBannerProps> = ({
  adSlot,
  adFormat = 'auto',
  className = '',
  adPosition,
  style = {},
  isFlashMock = false,
  utmMedium = "homepage_leaderboard_banner",
  utmCampaign = "creatv_launch_promo",
  linkURL,
}) => {
  const adRef = useRef<HTMLModElement>(null);
  const dims = AD_FORMAT_DIMENSIONS[adFormat] ?? AD_FORMAT_DIMENSIONS.auto;

  useEffect(() => {
    if (isFlashMock) return;

    try {
      // Initialize AdSense ad
      if (typeof window !== 'undefined' && window.adsbygoogle) {
        if (adRef.current) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        }
        trackAdInteraction('adsense_banner', adPosition, 'view');
      }
    } catch (error) {
      console.error('AdSense error:', error);
    }
  }, [adPosition, adSlot, isFlashMock]);

  const renderAdContent = () => {
    if (isFlashMock) {
      return (
        <div
          className="w-full flex justify-center items-center overflow-hidden cursor-pointer"
          style={{ minHeight: dims.minHeight, ...style }}
          onClick={() => {
            trackAdInteraction("creatv_launch_promo_banner", adPosition, "click");
            window.open(
              `${linkURL ? linkURL : "https://www.creatv.io/auth"}?referral_code=mwintrow33&utm_source=media-manipulator.com&utm_medium=${utmMedium}&utm_campaign=${utmCampaign}`,
              "_blank"
            );
          }}
        >
          <img
            src="https://pub-5e3f5f69f6bd4f2fb6bc741e03f34851.r2.dev/CreaTV_VideoAd_Leaderboard.gif"
            alt="Come check out CreaTV! Where ideas are brought to life."
            width={728}
            height={90}
            className="block w-full max-w-full h-auto"
          />
        </div>
      );
    }

    // Don't render real ads in development or when using placeholder ad slots.
    // NOTE: The placeholder is currently used as the fallback for every
    // non-flash-mock unit while we test layouts. When AdSense is live, flip
    // this condition to `process.env.NODE_ENV === 'development' || adSlot.startsWith('123456')`.
    if (!isFlashMock || process.env.NODE_ENV === 'development' || adSlot.startsWith('123456')) {
      return (
        <div
          className="w-full bg-gray-200 border-2 border-dashed border-gray-400 p-4 text-center text-gray-600 rounded-lg flex flex-col items-center justify-center"
          style={{ minHeight: dims.minHeight }}
        >
          <p className="text-sm">Ad Placeholder - {adPosition}</p>
          <p className="text-xs">AdSense {dims.label} ad slot — live in production</p>
        </div>
      );
    }

    return (
      <div className="ad-container w-full">
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{
            display: 'block',
            width: '100%',
            minHeight: dims.minHeight,
            backgroundColor: 'transparent',
            ...style,
          }}
          data-ad-client="ca-pub-3413790368941825"
          data-ad-slot={adSlot}
          data-ad-format={adFormat}
          data-full-width-responsive="true"
          onClick={() => trackAdInteraction('adsense_banner', adPosition, 'click')}
        />
      </div>
    );
  };

  return (
    <div className={`w-full flex justify-center ${className}`}>
      <div
        className="w-full mx-auto"
        style={{ maxWidth: dims.maxWidth }}
      >
        <AdLabel />
        {renderAdContent()}
      </div>
    </div>
  );
};

export default AdBanner;
