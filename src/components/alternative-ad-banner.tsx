/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useCallback } from 'react';
import { trackAdInteraction } from '@/lib/analytics';

interface AlternativeAdBannerProps {
  network: 'propellerads' | 'adsense' | 'infolinks' | 'carbon';
  adSlot: string;
  adFormat?: 'auto' | 'banner' | 'rectangle' | 'leaderboard';
  className?: string;
  adPosition: string; // For analytics tracking
  style?: React.CSSProperties;
}

declare global {
  interface Window {
    adsbygoogle: Record<string, unknown>[];
    _mNHandle: any;
    _mNDetails: any;
    infolinks_pid: number;
    infolinks_wsid: number;
  }
}

const AlternativeAdBanner: React.FC<AlternativeAdBannerProps> = ({
  network,
  adSlot,
  adFormat = 'auto',
  className = '',
  adPosition,
  style = {}
}) => {
  const adRef = useRef<HTMLDivElement>(null);
  const insRef = useRef<HTMLModElement>(null);

  const loadPropellerAd = useCallback(() => {
    // PropellerAds implementation
    const script = document.createElement('script');
    script.innerHTML = `
      (function(d,z,s){
        s.src='https://'+d+'/ads/'+z+'.js';
        (document.head||document.documentElement).appendChild(s);
      })('propellerads.com','${adSlot}',document.createElement('script'));
    `;
    document.head.appendChild(script);
  }, [adSlot]);

  const loadCarbonAd = useCallback(() => {
    // Carbon Ads implementation
    if (adRef.current) {
      const carbonAd = document.createElement('div');
      carbonAd.id = 'carbonads';
      carbonAd.innerHTML = `
        <script async type="text/javascript" src="//cdn.carbonads.com/carbon.js?serve=${adSlot}&placement=yoursite" id="_carbonads_js"></script>
      `;
      adRef.current.appendChild(carbonAd);
    }
  }, [adSlot]);

  // const loadBuySellAd = () => {
  //   // BuySellAds implementation
  //   const script = document.createElement('script');
  //   script.src = `https://s3.buysellads.com/ac/bsa.js?zone=${adSlot}`;
  //   script.async = true;
  //   document.head.appendChild(script);
  // };
  const loadGoogleAdSense = useCallback(() => {
    try {
      // Load AdSense script if not already loaded
      if (!document.querySelector('script[src*="adsbygoogle.js"]')) {
        const script = document.createElement('script');
        script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3413790368941825';
        script.async = true;
        script.crossOrigin = 'anonymous';
        document.head.appendChild(script);
      }

      // Initialize AdSense ad
      if (typeof window !== 'undefined' && insRef.current) {
        setTimeout(() => {
          try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
          } catch (error) {
            console.error('AdSense error:', error);
          }
        }, 100);
      }
    } catch (error) {
      console.error('AdSense loading error:', error);
    }
  }, []);

  const loadInfoLinks = useCallback(() => {
    try {
      // Set InfoLinks configuration
      if (typeof window !== 'undefined') {
        window.infolinks_pid = 3437302;
        window.infolinks_wsid = 0;
      }

      // Load InfoLinks script if not already loaded
      if (!document.querySelector('script[src*="infolinks_main.js"]')) {
        const script = document.createElement('script');
        script.src = '//resources.infolinks.com/js/infolinks_main.js';
        script.async = true;
        document.head.appendChild(script);
      }
    } catch (error) {
      console.error('InfoLinks loading error:', error);
    }
  }, []);

  useEffect(() => {
    const loadAd = () => {
      switch (network) {
        // case 'media.net':
        //   loadMediaNetAd();
        //   break;
        case 'propellerads':
          loadPropellerAd();
          break;
        case 'carbon':
          loadCarbonAd();
          break;
        // case 'buysellads':
        //   loadBuySellAd();
        //   break;
        case 'adsense':
          loadGoogleAdSense();
          break;
        case 'infolinks':
          loadInfoLinks();
          break;
      }

      // Track ad view
      trackAdInteraction(`${network}_banner`, adPosition, 'view');
    };

    loadAd();
  }, [network, adSlot, adPosition, loadPropellerAd, loadCarbonAd, loadGoogleAdSense, loadInfoLinks]);

  // Don't render ads in development mode OR if using placeholder ad slots
  if (process.env.NODE_ENV === 'development' || adSlot.startsWith('123456')) {
    return (
      <div className={`bg-gray-200 border-2 border-dashed border-gray-400 p-4 text-center text-gray-600 rounded-lg ${className}`}>
        <p className="text-sm">{network.toUpperCase()} Ad Placeholder - {adPosition}</p>
        <p className="text-xs">Format: {adFormat} | Slot: {adSlot}</p>
        <p className="text-xs">{network} ads will appear here in production</p>
      </div>
    );
  }

  // Render based on network type
  if (network === 'adsense') {
    return (
      <div className={`ad-container ${className}`}>
        <ins
          ref={insRef}
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
  }

  if (network === 'infolinks') {
    return (
      <div
        ref={adRef}
        className={`ad-container ${className}`}
        style={{ minHeight: '50px', backgroundColor: 'transparent', ...style }}
        onClick={() => trackAdInteraction('infolinks_banner', adPosition, 'click')}
      />
    );
  }

  // Default container for other networks
  return (
    <div
      ref={adRef}
      className={`ad-container ${className}`}
      style={{ minHeight: '50px', backgroundColor: 'transparent', ...style }}
      onClick={() => trackAdInteraction(`${network}_banner`, adPosition, 'click')}
    />
  );
};

export default AlternativeAdBanner;
