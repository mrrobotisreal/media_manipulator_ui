/**
 * Lightweight wrapper around Google Analytics 4 (gtag.js).
 *
 * The base gtag snippet is loaded in index.html with `send_page_view: false`,
 * so SPA route changes are responsible for sending page_view events explicitly.
 * Both helpers early-return when analytics consent has not been granted.
 */

import { hasAnalyticsConsent } from './consent';

type GtagParams = Record<string, string | number | boolean | null | undefined>;

export const GA_MEASUREMENT_ID: string =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-6J910CMHRY';

const hasGtag = (): boolean => {
  return typeof window !== 'undefined' && typeof window.gtag === 'function';
};

/**
 * Send a GA4 page_view event for the current route.
 */
export const trackGooglePageView = (pageTitle: string, path?: string): void => {
  if (!hasAnalyticsConsent()) return;
  if (!hasGtag()) return;
  const pagePath = path ?? `${window.location.pathname}${window.location.search}`;
  const pageLocation = `${window.location.origin}${pagePath}`;
  try {
    window.gtag('event', 'page_view', {
      page_title: pageTitle,
      page_location: pageLocation,
      page_path: pagePath,
      send_to: GA_MEASUREMENT_ID,
    });
  } catch {
    // Never let analytics break the app.
  }
};

/**
 * Send an arbitrary GA4 event.
 */
export const trackGoogleEvent = (
  eventName: string,
  params: GtagParams = {},
): void => {
  if (!hasAnalyticsConsent()) return;
  if (!hasGtag()) return;
  try {
    window.gtag('event', eventName, {
      send_to: GA_MEASUREMENT_ID,
      ...params,
    });
  } catch {
    // ignore
  }
};
