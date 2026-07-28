import {
  onCLS,
  onINP,
  onLCP,
  onFCP,
  onTTFB,
  type MetricWithAttribution,
} from 'web-vitals/attribution';
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

/**
 * Flatten the per-metric attribution block into scalar analytics fields.
 *
 * A bare LCP number tells you the page was slow; `debug_target` tells you which
 * element was slow and `lcp_resource_load_duration` tells you why. Same for
 * INP: `debug_target` plus the input/processing/presentation split is the
 * difference between "an interaction was janky" and a line of code to fix.
 *
 * `entries`, `navigationEntry` and the `*Entry`/`*Entries` fields are dropped —
 * they are live PerformanceEntry objects, not JSON, and would bloat the beacon.
 */
const attributionFields = (metric: MetricWithAttribution): Record<string, string | number> => {
  const a = metric.attribution;
  switch (metric.name) {
    case 'LCP': {
      const lcp = a as import('web-vitals/attribution').LCPMetricWithAttribution['attribution'];
      return {
        debug_target: lcp.target || '(not set)',
        lcp_url: lcp.url || '',
        lcp_time_to_first_byte: round(lcp.timeToFirstByte),
        lcp_resource_load_delay: round(lcp.resourceLoadDelay),
        lcp_resource_load_duration: round(lcp.resourceLoadDuration),
        lcp_element_render_delay: round(lcp.elementRenderDelay),
      };
    }
    case 'INP': {
      const inp = a as import('web-vitals/attribution').INPMetricWithAttribution['attribution'];
      return {
        debug_target: inp.interactionTarget || '(not set)',
        inp_interaction_type: inp.interactionType,
        inp_input_delay: round(inp.inputDelay),
        inp_processing_duration: round(inp.processingDuration),
        inp_presentation_delay: round(inp.presentationDelay),
        inp_load_state: inp.loadState,
        // Which of the three INP subparts the single longest script ran in, and
        // for how long — the fastest route from "INP is bad" to a call stack.
        inp_longest_script_subpart: inp.longestScript?.subpart ?? '',
        inp_longest_script_duration: round(inp.longestScript?.intersectingDuration ?? 0),
      };
    }
    case 'CLS': {
      const cls = a as import('web-vitals/attribution').CLSMetricWithAttribution['attribution'];
      return {
        debug_target: cls.largestShiftTarget || '(not set)',
        cls_largest_shift_value: round(cls.largestShiftValue ?? 0),
        cls_largest_shift_time: round(cls.largestShiftTime ?? 0),
        cls_load_state: cls.loadState ?? '',
      };
    }
    case 'FCP': {
      const fcp = a as import('web-vitals/attribution').FCPMetricWithAttribution['attribution'];
      return {
        fcp_time_to_first_byte: round(fcp.timeToFirstByte),
        fcp_first_byte_to_fcp: round(fcp.firstByteToFCP),
        fcp_load_state: fcp.loadState,
      };
    }
    case 'TTFB': {
      const ttfb = a as import('web-vitals/attribution').TTFBMetricWithAttribution['attribution'];
      return {
        ttfb_waiting_duration: round(ttfb.waitingDuration),
        ttfb_cache_duration: round(ttfb.cacheDuration),
        ttfb_dns_duration: round(ttfb.dnsDuration),
        ttfb_connection_duration: round(ttfb.connectionDuration),
        ttfb_request_duration: round(ttfb.requestDuration),
      };
    }
    default:
      return {};
  }
};

const sendMetric = (metric: MetricWithAttribution): void => {
  const payload = {
    metric_name: metric.name,
    metric_value: round(metric.value),
    metric_rating: metric.rating,
    metric_id: metric.id,
    metric_delta: round(metric.delta),
    page_path: typeof window !== 'undefined' ? window.location.pathname : '',
    navigation_type: navigationType(),
    ...attributionFields(metric),
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
 *
 * Uses the `web-vitals/attribution` build: same metrics, plus the debug context
 * that turns a field number into something actionable.
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
