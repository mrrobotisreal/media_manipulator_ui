'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';

import {
  ADSENSE_ENABLED,
  ADSENSE_SCRIPT_SRC,
  isAdEligiblePath,
} from '@/lib/adsenseConfig';

/**
 * Google's ad script, once per page that may host an ad unit (MM82, ADR-0016).
 *
 * Rendered by `LayoutBootstrap` (a server component) in both root layouts, so
 * the eligibility decision needs the pathname and lives here. It runs AFTER the
 * Consent Mode v2 defaults (`GTAG_CONSENT_BOOTSTRAP`, inline in the server HTML,
 * every ad signal denied) and does not wait for the first-party advertising
 * category: Google serves limited / non-personalised ads under denied consent,
 * and personalisation follows the consent update. In the EEA/UK/CH Google's own
 * consent message ships inside this script.
 *
 * Renders nothing when ads are off, on an ineligible path, or on a translator
 * deployment. Whether a UNIT renders (tier, slot) is `components/ad-banner.tsx`'s
 * job; a loader on a page whose unit is withheld (Premium) requests nothing.
 */
export function AdsenseLoader() {
  const pathname = usePathname() || '/';
  if (process.env.NEXT_PUBLIC_DEPLOY_ROLE === 'translator') return null;
  if (!ADSENSE_ENABLED) return null;
  if (!isAdEligiblePath(pathname)) return null;
  return (
    <Script
      id="adsense-loader"
      src={ADSENSE_SCRIPT_SRC}
      strategy="afterInteractive"
      crossOrigin="anonymous"
    />
  );
}

export default AdsenseLoader;
