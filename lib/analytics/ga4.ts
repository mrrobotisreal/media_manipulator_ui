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

import { getConsentDetails, onConsentDetailsChange } from '@/lib/consent';
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

export const GA4_SCRIPT_ID = 'ga4';
export const GA4_SCRIPT_SRC = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;

type GtagFn = (...args: unknown[]) => void;
type GtagWindow = typeof window & { gtag?: GtagFn; dataLayer?: unknown[] } & Record<string, unknown>;

function gtagFn(): GtagFn | null {
  if (typeof window === 'undefined') return null;
  const fn = (window as GtagWindow).gtag;
  return typeof fn === 'function' ? fn : null;
}

function analyticsGranted(): boolean {
  return getConsentDetails().analytics === 'granted';
}

/**
 * Load Google's gtag.js. Called ONLY once analytics consent is granted; idempotent.
 *
 * Nothing about Google is fetched or contacted before this runs: the layout carries no
 * <script src> and no resource hint for googletagmanager.com. The inline bootstrap only
 * defines a local `gtag` stub and the Consent Mode defaults (all denied), which touch no
 * network. A loaded script cannot be unloaded, so withdrawal is handled by Consent Mode
 * plus the bridge refusing to call gtag (see initGA4Bridge).
 */
export function loadGa4(): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  // MM52: never on a translator deployment. GA_MEASUREMENT_ID falls back to a
  // hard-coded id, so an empty NEXT_PUBLIC_GA_MEASUREMENT_ID does NOT disable
  // GA4; the role check has to live at the loader.
  if (process.env.NEXT_PUBLIC_DEPLOY_ROLE === 'translator') return;
  const w = window as GtagWindow;
  // Re-grant after a withdrawal: re-enable the property-level kill switch we set.
  w[`ga-disable-${GA_MEASUREMENT_ID}`] = false;

  const gtag = gtagFn();
  if (gtag) gtag('consent', 'update', { analytics_storage: 'granted' });

  if (document.getElementById(GA4_SCRIPT_ID)) return;

  w.dataLayer = w.dataLayer || [];
  if (!gtagFn()) {
    w.gtag = function gtagStub() {
      // gtag.js requires the real `arguments` object, not a rest array.
      // eslint-disable-next-line prefer-rest-params
      (w.dataLayer as unknown[]).push(arguments);
    };
  }
  const g = gtagFn();
  g?.('js', new Date());
  g?.('config', GA_MEASUREMENT_ID, { send_page_view: false });

  const el = document.createElement('script');
  el.id = GA4_SCRIPT_ID;
  el.async = true;
  el.src = GA4_SCRIPT_SRC;
  document.head.appendChild(el);
}

/** Withdrawal: tell Google to stop and make sure we never call it again. */
function suspendGa4(): void {
  if (typeof window === 'undefined') return;
  (window as GtagWindow)[`ga-disable-${GA_MEASUREMENT_ID}`] = true;
  const gtag = gtagFn();
  if (gtag) {
    try {
      gtag('consent', 'update', { analytics_storage: 'denied' });
    } catch {
      // never affects the app
    }
  }
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
 * CONSENT GATES GOOGLE ENTIRELY. gtag.js is injected only when analytics consent is
 * `granted` (at init if already granted, or the moment a grant arrives later). Events are
 * forwarded only while consent is granted AND the script was loaded; events that occur
 * before consent are never queued or replayed to Google (the SDK buffers them for first
 * party only and drains that buffer without notifying subscribers). On withdrawal
 * Consent Mode is set to denied and no further gtag calls are made.
 */
export function initGA4Bridge(client: AnalyticsClient): () => void {
  if (typeof window === 'undefined') return () => undefined;
  if (process.env.NEXT_PUBLIC_DEPLOY_ROLE === 'translator') return () => undefined;

  let wasGranted = false;
  const sync = () => {
    const granted = analyticsGranted();
    if (granted && !wasGranted) loadGa4();
    else if (!granted && wasGranted) suspendGa4();
    wasGranted = granted;
  };
  sync();
  const offConsent = onConsentDetailsChange(sync);

  const offEvents = client.subscribe((name, event) => {
    const ga4Name = FORWARDED[name];
    if (!ga4Name) return;
    if (!analyticsGranted()) return;
    const gtag = gtagFn();
    if (!gtag || !document.getElementById(GA4_SCRIPT_ID)) return;
    try {
      gtag('event', ga4Name, { send_to: GA_MEASUREMENT_ID, ...paramsFor(name, event) });
    } catch {
      // GA4 must never affect the app or first-party capture.
    }
  });

  return () => {
    offConsent();
    offEvents();
  };
}
