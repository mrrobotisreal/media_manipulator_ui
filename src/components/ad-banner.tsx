import React, { useEffect, useRef } from 'react';
import { trackAdInteraction } from '@/lib/analytics';

interface AdBannerProps {
  adSlot: string;
  adFormat?: 'auto' | 'rectangle' | 'leaderboard' | 'banner';
  className?: string;
  adPosition: string; // For analytics tracking
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
  adPosition
}) => {
  const adRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    try {
      // Initialize AdSense ad
      if (typeof window !== 'undefined' && window.adsbygoogle) {
        window.adsbygoogle.push({});

        // Track ad view
        trackAdInteraction('adsense_banner', adPosition, 'view');
      }
    } catch (error) {
      console.error('AdSense error:', error);
    }
  }, [adPosition]);

  // Don't render ads in development mode
  if (process.env.NODE_ENV === 'development') {
    return (
      <div className={`bg-gray-200 border-2 border-dashed border-gray-400 p-4 text-center text-gray-600 ${className}`}>
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
        style={{ display: 'block' }}
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