/**
 * Consent Mode v2 state observer.
 *
 * The page sets all consent signals to "denied" in index.html before any
 * tracking script runs. Google Funding Choices (loaded via adsbygoogle.js)
 * later calls `gtag('consent', 'update', { ... })` when the user
 * accepts/rejects the banner. We wrap `window.gtag` so we can observe those
 * update calls and notify analytics modules — Mixpanel, GA event helpers,
 * etc. — whether they're allowed to fire.
 *
 * First-party analytics (firstPartyAnalytics.ts) is intentionally NOT gated
 * here. It posts to our own analytics endpoint and is "strictly necessary"
 * for product operation (abuse prevention, conversion job correlation).
 * Strictly-necessary first-party telemetry doesn't require consent under
 * GDPR's legitimate-interest basis; the privacy policy documents this.
 */

type ConsentSignal = 'granted' | 'denied';

export interface ConsentState {
  ad_storage: ConsentSignal;
  ad_user_data: ConsentSignal;
  ad_personalization: ConsentSignal;
  analytics_storage: ConsentSignal;
}

type ConsentListener = (state: ConsentState) => void;

const listeners = new Set<ConsentListener>();

let cachedState: ConsentState = {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
};

let initialized = false;

const isConsentSignal = (value: unknown): value is ConsentSignal =>
  value === 'granted' || value === 'denied';

/**
 * Wrap window.gtag to intercept consent update calls. Idempotent — calling
 * more than once is a no-op.
 */
export function initConsentListener(): void {
  if (initialized) return;
  if (typeof window === 'undefined') return;
  const originalGtag = window.gtag;
  if (typeof originalGtag !== 'function') return;
  initialized = true;

  const wrapped = function (...args: unknown[]) {
    if (args[0] === 'consent' && args[1] === 'update' && args[2] && typeof args[2] === 'object') {
      const update = args[2] as Record<string, unknown>;
      const next: ConsentState = { ...cachedState };
      let changed = false;
      for (const key of Object.keys(next) as Array<keyof ConsentState>) {
        const incoming = update[key];
        if (isConsentSignal(incoming) && next[key] !== incoming) {
          next[key] = incoming;
          changed = true;
        }
      }
      if (changed) {
        cachedState = next;
        listeners.forEach((listener) => {
          try {
            listener(cachedState);
          } catch {
            // Listener errors must never block consent propagation.
          }
        });
      }
    }
    return originalGtag.apply(window, args as Parameters<typeof originalGtag>);
  } as typeof window.gtag;

  window.gtag = wrapped;
}

export function getConsentState(): ConsentState {
  return cachedState;
}

export function hasAnalyticsConsent(): boolean {
  return cachedState.analytics_storage === 'granted';
}

export function hasAdStorageConsent(): boolean {
  return cachedState.ad_storage === 'granted';
}

export function onConsentChange(listener: ConsentListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
