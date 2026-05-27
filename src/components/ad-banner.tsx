import React, { useEffect, useRef, useState } from 'react';
import { trackAdInteraction } from '@/lib/analytics';
import { useLocalization } from '@/i18n/useLocalization';

export type AdFormat =
  | 'leaderboard'
  | 'rectangle'
  | 'banner'
  | 'halfpage'
  | 'mobile_rectangle';

interface AdBannerProps {
  /** AdSense slot ID, e.g. "6671038874". */
  adSlot: string;
  /** IAB format. Drives reserved size and the matching CreaTV fallback. */
  adFormat: AdFormat;
  /** Context label for analytics. */
  adPosition: string;
  /** Sticky behaviour at lg+ for sidebar units. */
  sticky?: boolean;
  /** Override CreaTV creative URL. */
  creativeAssetSrc?: string;
  /** Override CreaTV creative alt text. */
  creativeAssetAlt?: string;
  /** Override CreaTV destination URL. Defaults to https://www.creatv.io/auth. */
  linkURL?: string;
  /** UTM medium for CreaTV link tracking. */
  utmMedium?: string;
  /** UTM campaign for CreaTV link tracking. */
  utmCampaign?: string;
  className?: string;
}

interface CreaTvCreative {
  src: string;
  width: number;
  height: number;
  minHeight: number;
  label: string;
}

// CreaTV in-house creatives, hosted on the R2 bucket. These render as a
// visually-layered fallback behind the AdSense unit until AdSense actually
// fills the slot (or in lieu of a fill that never comes). There is no gray
// placeholder anywhere.
const CREATV_CREATIVES: Record<AdFormat, CreaTvCreative> = {
  leaderboard: {
    src: 'https://pub-5e3f5f69f6bd4f2fb6bc741e03f34851.r2.dev/CreaTV_VideoAd_Leaderboard.gif',
    width: 728,
    height: 90,
    minHeight: 90,
    label: '728x90',
  },
  rectangle: {
    src: 'https://pub-13a4fdf185fa488299e681e08dd9f856.r2.dev/CreaTV_VideoAd_Rectangle.gif',
    width: 336,
    height: 280,
    minHeight: 280,
    label: '336x280',
  },
  banner: {
    src: 'https://pub-13a4fdf185fa488299e681e08dd9f856.r2.dev/CreaTV_VideoAd_Banner.gif',
    width: 468,
    height: 60,
    minHeight: 60,
    label: '468x60',
  },
  halfpage: {
    src: 'https://pub-13a4fdf185fa488299e681e08dd9f856.r2.dev/CreaTV_VideoAd_HalfPage.gif',
    width: 300,
    height: 600,
    minHeight: 600,
    label: '300x600',
  },
  mobile_rectangle: {
    src: 'https://pub-5e3f5f69f6bd4f2fb6bc741e03f34851.r2.dev/CreaTV_VideoAd_MobileRectangle.gif',
    width: 300,
    height: 250,
    minHeight: 250,
    label: '300x250',
  },
};

// AdSense policy requires ad units to be labeled "Advertisement" or
// "Sponsored Links" — no other wording. The label must sit outside the ad
// iframe. See: https://support.google.com/adsense/answer/9335564
const AdLabel: React.FC = () => {
  const { t } = useLocalization('accessibility');
  return (
    <div
      className="flex items-center justify-end mb-1 select-none"
      aria-label={t('ad.label')}
    >
      <span className="text-[10px] leading-none uppercase tracking-[0.12em] font-medium text-muted-foreground/80 bg-background/60 backdrop-blur-sm rounded px-1.5 py-0.5 border border-border/40">
        {t('ad.label')}
      </span>
    </div>
  );
};

const buildCreaTvUrl = (
  linkURL: string | undefined,
  utmMedium: string | undefined,
  utmCampaign: string | undefined,
): string => {
  const base = linkURL || 'https://www.creatv.io/auth';
  const params = new URLSearchParams({
    referral_code: 'mwintrow33',
    utm_source: 'media-manipulator.com',
    utm_medium: utmMedium || 'media_manipulator_house_ad',
    utm_campaign: utmCampaign || 'creatv_launch_promo',
  });
  return `${base}?${params.toString()}`;
};

const AdBanner: React.FC<AdBannerProps> = ({
  adSlot,
  adFormat,
  adPosition,
  sticky = false,
  creativeAssetSrc,
  creativeAssetAlt,
  linkURL,
  utmMedium,
  utmCampaign,
  className = '',
}) => {
  const { t } = useLocalization('interface');
  const adRef = useRef<HTMLModElement>(null);
  const hasPushedRef = useRef(false);
  const [showFallback, setShowFallback] = useState(true);
  const creative = CREATV_CREATIVES[adFormat];

  useEffect(() => {
    if (hasPushedRef.current) return;
    hasPushedRef.current = true;

    trackAdInteraction('adsense_banner', adPosition, 'view');

    try {
      if (typeof window !== 'undefined' && adRef.current) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (error) {
      // AdSense errors must never block the page.
      if (typeof console !== 'undefined') {
        console.error('AdSense push error:', error);
      }
    }

    // Per Google's unfilled-ad detection guidance, give the SDK ~2s to settle
    // and then read data-ad-status. If "filled", hide the CreaTV fallback so
    // the AdSense unit shows alone. If "unfilled", keep the fallback visible.
    // https://support.google.com/adsense/answer/10762946
    const timeoutId = window.setTimeout(() => {
      const status = adRef.current?.getAttribute('data-ad-status');
      if (status === 'filled') {
        setShowFallback(false);
      } else if (status === 'unfilled') {
        trackAdInteraction('adsense_unfilled', adPosition, 'view');
      }
    }, 2000);

    return () => window.clearTimeout(timeoutId);
  }, [adPosition]);

  const creatvUrl = buildCreaTvUrl(linkURL, utmMedium, utmCampaign);
  const dataAdFormat = adFormat === 'halfpage' ? 'vertical' : 'horizontal';

  const inner = (
    <div className={`w-full flex justify-center ${className}`}>
      <div className="mx-auto" style={{ width: creative.width, maxWidth: '100%' }}>
        <AdLabel />
        <div
          className="relative mx-auto"
          style={{
            width: creative.width,
            height: creative.minHeight,
            maxWidth: '100%',
          }}
        >
          {/* CreaTV fallback layered underneath the AdSense unit. Stays
              visible until AdSense reports `data-ad-status="filled"`. */}
          {showFallback && (
            <a
              href={creatvUrl}
              target="_blank"
              rel="noopener sponsored"
              onClick={() =>
                trackAdInteraction('creatv_fallback', adPosition, 'click')
              }
              className="absolute inset-0 flex items-center justify-center overflow-hidden"
              aria-label={t('adBanner.creatvAriaLabel')}
            >
              <img
                src={creativeAssetSrc || creative.src}
                alt={creativeAssetAlt || t('adBanner.creatvCreativeAlt')}
                width={creative.width}
                height={creative.height}
                loading="lazy"
                decoding="async"
                className="block max-w-full h-auto"
                style={{ width: creative.width, height: creative.height }}
              />
            </a>
          )}

          {/* AdSense unit layered above the CreaTV creative.
              While the fallback is still rendering — i.e. AdSense hasn't
              reported `data-ad-status="filled"` yet — this <ins> is an empty
              absolute-positioned sibling sitting on top of the <a> in DOM
              order, so without pointer-events:none it would swallow every
              click and leave the CreaTV link visible-but-dead. Once an ad
              actually fills, `showFallback` flips to false (the <a>
              unmounts) and we restore pointer-events so the AdSense iframe
              handles its own clicks normally. */}
          <ins
            ref={adRef}
            className="adsbygoogle absolute inset-0"
            style={{
              display: 'block',
              width: creative.width,
              height: creative.minHeight,
              backgroundColor: 'transparent',
              pointerEvents: showFallback ? 'none' : undefined,
            }}
            data-ad-client="ca-pub-3413790368941825"
            data-ad-slot={adSlot}
            data-ad-format={dataAdFormat}
            data-full-width-responsive="false"
          />
        </div>
      </div>
    </div>
  );

  if (sticky) {
    return <div className="lg:sticky lg:top-24">{inner}</div>;
  }
  return inner;
};

export default AdBanner;
