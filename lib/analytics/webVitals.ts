/**
 * Core Web Vitals → `web_vital` events.
 *
 * Uses the `web-vitals/attribution` build rather than the plain one. A bare LCP number
 * tells you the page was slow; `debug_target` tells you WHICH ELEMENT was slow and
 * `lcp_resource_load_duration` tells you why. Same for INP: the input/processing/
 * presentation split plus the longest script's subpart is the difference between "an
 * interaction was janky" and a line of code to fix.
 *
 * Priority 3 (low), because these are high-volume and never urgent — they piggyback on
 * whatever flush happens next and are the first thing evicted under pressure. But they
 * are USAGE-WEIGHTED BY ROUTE, which is the entire point of measuring in the field rather
 * than in a lab: a route nobody visits being slow does not matter, and Lighthouse cannot
 * tell you which routes those are.
 *
 * The attribution objects carry live `PerformanceEntry` instances. Those are flattened to
 * scalars here and the entry arrays are dropped — they are not JSON-serializable and
 * would bloat the beacon past the keepalive quota.
 */

import type { AnalyticsClient } from './client';
import { EVENTS, type PropertyValue, type WebVitalProps } from './events';

let initialized = false;

function round(value: number): number {
  // CLS is a unitless float; everything else is milliseconds. Two decimals is plenty for
  // either, and it keeps the payload small.
  return Math.round(value * 100) / 100;
}

function navigationType(): string {
  try {
    const entries = performance.getEntriesByType?.('navigation') as
      | PerformanceNavigationTiming[]
      | undefined;
    return entries?.[0]?.type || 'unknown';
  } catch {
    return 'unknown';
  }
}

/**
 * Flatten the per-metric attribution block into scalar fields.
 *
 * Kept from the previous implementation because the field selection was right — it is the
 * set that makes a field number actionable. `entries`, `navigationEntry`, and the
 * `*Entry`/`*Entries` members are deliberately excluded.
 */
function attributionFields(
  metric: import('web-vitals/attribution').MetricWithAttribution,
): Record<string, PropertyValue> {
  const attribution = metric.attribution;
  switch (metric.name) {
    case 'LCP': {
      const lcp = attribution as import('web-vitals/attribution').LCPMetricWithAttribution['attribution'];
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
      const inp = attribution as import('web-vitals/attribution').INPMetricWithAttribution['attribution'];
      return {
        debug_target: inp.interactionTarget || '(not set)',
        inp_interaction_type: inp.interactionType,
        inp_input_delay: round(inp.inputDelay),
        inp_processing_duration: round(inp.processingDuration),
        inp_presentation_delay: round(inp.presentationDelay),
        inp_load_state: inp.loadState,
        // Which of the three INP subparts the single longest script ran in, and for how
        // long — the fastest route from "INP is bad" to a call stack.
        inp_longest_script_subpart: inp.longestScript?.subpart ?? '',
        inp_longest_script_duration: round(inp.longestScript?.intersectingDuration ?? 0),
      };
    }
    case 'CLS': {
      const cls = attribution as import('web-vitals/attribution').CLSMetricWithAttribution['attribution'];
      return {
        debug_target: cls.largestShiftTarget || '(not set)',
        cls_largest_shift_value: round(cls.largestShiftValue ?? 0),
        cls_largest_shift_time: round(cls.largestShiftTime ?? 0),
        cls_load_state: cls.loadState ?? '',
      };
    }
    case 'FCP': {
      const fcp = attribution as import('web-vitals/attribution').FCPMetricWithAttribution['attribution'];
      return {
        fcp_time_to_first_byte: round(fcp.timeToFirstByte),
        fcp_first_byte_to_fcp: round(fcp.firstByteToFCP),
        fcp_load_state: fcp.loadState,
      };
    }
    case 'TTFB': {
      const ttfb = attribution as import('web-vitals/attribution').TTFBMetricWithAttribution['attribution'];
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
}

/**
 * Start reporting. Idempotent, never throws.
 *
 * The `web-vitals` import is DYNAMIC so its ~5 KB and its observer setup land in their own
 * chunk fetched during idle time, rather than in whatever chunk imports the provider.
 * Called from an idle callback by AnalyticsProvider.
 */
export function initWebVitals(client: AnalyticsClient): void {
  if (initialized) return;
  if (typeof window === 'undefined') return;
  initialized = true;

  void import('web-vitals/attribution')
    .then(({ onCLS, onFCP, onINP, onLCP, onTTFB }) => {
      const send = (metric: import('web-vitals/attribution').MetricWithAttribution) => {
        const props: WebVitalProps = {
          metric: metric.name as WebVitalProps['metric'],
          value: round(metric.value),
          rating: metric.rating,
          navigation_type: navigationType(),
          metric_id: metric.id,
          metric_delta: round(metric.delta),
          ...attributionFields(metric),
        };
        client.track(EVENTS.WEB_VITAL, props);
      };

      onCLS(send);
      onINP(send);
      onLCP(send);
      onFCP(send);
      onTTFB(send);
    })
    .catch(() => {
      // A blocked chunk fetch leaves vitals off. Nothing else is affected.
      initialized = false;
    });
}

/** For tests. */
export function resetWebVitalsForTests(): void {
  initialized = false;
}
