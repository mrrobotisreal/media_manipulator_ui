/**
 * Lightweight wrapper around Google Analytics 4 (gtag.js).
 *
 * The base gtag snippet is loaded in index.html with `send_page_view: false`,
 * so SPA route changes are responsible for sending page_view events explicitly.
 */

type GtagParams = Record<string, string | number | boolean | null | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export const GA_MEASUREMENT_ID: string =
  (import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined) ||
  'G-6J910CMHRY';

const hasGtag = (): boolean => {
  return typeof window !== 'undefined' && typeof window.gtag === 'function';
};

/**
 * Send a GA4 page_view event for the current route.
 */
export const trackGooglePageView = (pageTitle: string, path?: string): void => {
  if (!hasGtag()) return;
  const pagePath = path ?? `${window.location.pathname}${window.location.search}`;
  const pageLocation = `${window.location.origin}${pagePath}`;
  try {
    window.gtag!('event', 'page_view', {
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
  if (!hasGtag()) return;
  try {
    window.gtag!('event', eventName, {
      send_to: GA_MEASUREMENT_ID,
      ...params,
    });
  } catch {
    // ignore
  }
};
