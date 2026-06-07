import { onCLS, onINP, onLCP, onFCP, onTTFB, type Metric } from 'web-vitals';
import { trackFirstPartyEvent } from './firstPartyAnalytics';
import { trackGoogleEvent } from './gtag';

const navigationType = (): string => {
  try {
    const entries = performance.getEntriesByType?.(
      'navigation',
    ) as PerformanceNavigationTiming[] | undefined;
    return entries?.[0]?.type || 'unknown';
  } catch {
    return 'unknown';
  }
};

const round = (value: number): number => {
  // CLS is reported as a float; everything else is ms. Two decimals is plenty.
  return Math.round(value * 100) / 100;
};

const sendMetric = (metric: Metric): void => {
  const payload = {
    metric_name: metric.name,
    metric_value: round(metric.value),
    metric_rating: metric.rating,
    metric_id: metric.id,
    metric_delta: round(metric.delta),
    page_path: typeof window !== 'undefined' ? window.location.pathname : '',
    navigation_type: navigationType(),
  };

  try {
    trackFirstPartyEvent('web_vitals', payload);
  } catch {
    // analytics must not break the page
  }
  try {
    trackGoogleEvent('web_vitals', payload);
  } catch {
    // ignore
  }
};

let initialized = false;

/**
 * Initialize Core Web Vitals reporting. Idempotent — safe to call multiple
 * times. Never throws if analytics or the web-vitals API is unavailable.
 */
export const initWebVitals = (): void => {
  if (initialized) return;
  if (typeof window === 'undefined') return;
  initialized = true;

  try {
    onCLS(sendMetric);
    onINP(sendMetric);
    onLCP(sendMetric);
    onFCP(sendMetric);
    onTTFB(sendMetric);
  } catch {
    // If web-vitals fails to attach for any reason, we silently degrade.
  }
};
