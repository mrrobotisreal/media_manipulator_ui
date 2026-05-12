import React, { useEffect, useRef } from 'react';
import { trackAdInteraction } from '@/lib/analytics';

interface AdBannerProps {
  adSlot: string;
  adFormat?: 'auto' | 'rectangle' | 'leaderboard' | 'banner';
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

  useEffect(() => {
    if (isFlashMock) return;

    try {
      // Initialize AdSense ad
      if (typeof window !== 'undefined' && window.adsbygoogle) {
        // Clear any existing ads in this slot
        if (adRef.current) {
          // Push the ad configuration
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        }

        // Track ad view
        trackAdInteraction('adsense_banner', adPosition, 'view');
      }
    } catch (error) {
      console.error('AdSense error:', error);
    }
  }, [adPosition, adSlot, isFlashMock]);

  if (isFlashMock) {
    return (
      <div
          className="flex justify-center items-center w-full max-w-full"
          style={{
            ...style,
          }}
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
            className="justify-center cursor-pointer"
          />
        </div>
    );
  }

  // Don't render ads in development mode OR if using placeholder ad slots
  if (!isFlashMock || process.env.NODE_ENV === 'development' || adSlot.startsWith('123456')) {
    return (
      <div className={`bg-gray-200 border-2 border-dashed border-gray-400 p-4 text-center text-gray-600 rounded-lg ${className}`}>
        <p className="text-sm">Ad Placeholder - {adPosition}</p>
        <p className="text-xs">AdSense ads will appear here in production</p>
      </div>
    );
  }

  return (
    <div className={`ad-container ${className}`}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block', minHeight: '50px', backgroundColor: 'transparent', ...style }}
        data-ad-client="ca-pub-3413790368941825"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive="true"
        onClick={() => trackAdInteraction('adsense_banner', adPosition, 'click')}
      />
    </div>
  );
};

export default AdBanner;