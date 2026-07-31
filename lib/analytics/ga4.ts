/**
 * The slim GA4 bridge.
 *
 * FIRST-PARTY IS THE SOURCE OF TRUTH. GA4 stays for exactly one reason: a cross-check. If
 * our own numbers and GA4's diverge by more than a sampling-and-blocking band, one of the
 * two is broken and we want to know. That is worth three events; it is not worth
 * mirroring the whole taxonomy into a system we do not control and cannot query
 * precisely.
 *
 * SO THIS FORWARDS THREE NAMES AND NOTHING ELSE:
 *
 *   page_view        → the traffic cross-check
 *   signup_completed → GA4 `sign_up` (a recommended event, so it appears in GA4's own
 *                      conversion reporting without configuration)
 *   job_completed    → the "did the product work" cross-check
 *
 * Everything else is deliberately dropped. Mixpanel and Firebase Analytics are removed
 * entirely — three overlapping third-party analytics products was a cost with no
 * corresponding answer, and each one was another processor to disclose and defend.
 *
 * PROPERTIES ARE MINIMAL. GA4 gets the shape of the event, never our full property
 * payload: the payload is the thing our own store is for, and forwarding it wholesale
 * would send data to Google that the visitor consented to us collecting, not to us
 * sharing.
 */

import type { AnalyticsClient } from './client';
import { EVENTS, type EventName } from './events';
import type { QueuedEvent } from './queue';

export const GA_MEASUREMENT_ID: string =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-6J910CMHRY';

/** Our name → GA4 name. GA4's own recommended names are used where one exists. */
const FORWARDED: Partial<Record<EventName, string>> = {
  [EVENTS.PAGE_VIEW]: 'page_view',
  [EVENTS.SIGNUP_COMPLETED]: 'sign_up',
  [EVENTS.JOB_COMPLETED]: 'job_completed',
};

function gtagFn(): ((...args: unknown[]) => void) | null {
  if (typeof window === 'undefined') return null;
  const fn = (window as typeof window & { gtag?: (...args: unknown[]) => void }).gtag;
  return typeof fn === 'function' ? fn : null;
}

/**
 * Build the GA4 parameter set for a forwarded event.
 *
 * Consciously small. `page_view` gets its location and path (GA4 needs them because the
 * bootstrap sets `send_page_view: false`); the other two get the tool and tier dimensions
 * that make the cross-check meaningful, and nothing more.
 */
function paramsFor(name: EventName, event: QueuedEvent): Record<string, unknown> {
  const context = event.context || {};
  switch (name) {
    case EVENTS.PAGE_VIEW: {
      const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
      return {
        page_location: typeof window !== 'undefined' ? `${window.location.origin}${pathname}` : '',
        page_path: pathname,
        page_title: typeof document !== 'undefined' ? document.title : '',
      };
    }
    case EVENTS.SIGNUP_COMPLETED:
      return { method: (event.properties?.method as string) || 'unknown' };
    case EVENTS.JOB_COMPLETED:
      return {
        tool_slug: context.tool_slug || '',
        media_kind: context.media_kind || '',
      };
    default:
      return {};
  }
}

/**
 * Subscribe the bridge to the SDK. Returns an unsubscribe function.
 *
 * No consent check here, deliberately: this only ever runs for events that already passed
 * the SDK's consent gate, and GA4 is independently gated by Consent Mode — which
 * `lib/consent/consentModeBridge.ts` keeps in sync with the same decision. Two gates on
 * one decision is enough; a third would just be another place for them to disagree.
 */
export function initGA4Bridge(client: AnalyticsClient): () => void {
  if (typeof window === 'undefined') return () => undefined;

  return client.subscribe((name, event) => {
    const ga4Name = FORWARDED[name];
    if (!ga4Name) return;
    const gtag = gtagFn();
    if (!gtag) return;
    try {
      gtag('event', ga4Name, { send_to: GA_MEASUREMENT_ID, ...paramsFor(name, event) });
    } catch {
      // GA4 must never affect the app or first-party capture.
    }
  });
}
