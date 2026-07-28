import { hasAnalyticsConsent } from './consent';

/**
 * The only module in the app that touches `mixpanel-browser`.
 *
 * The SDK is ~60 KB and used by nothing on first paint, but a static import in
 * `app/providers.tsx` (or transitively via `lib/analytics.ts` → `lib/firebase.ts`)
 * put it in the root client chunk of every route. Here it is loaded with a
 * dynamic `import()` from inside the already-deferred init path, so it lands in
 * its own chunk that is fetched during idle time — and only after the visitor
 * has granted analytics consent.
 *
 * Every export is fire-and-forget and cannot throw: analytics must never break
 * the product. Calls made before init resolves are dropped, which is the same
 * behavior the direct SDK calls had (`mixpanel.track()` before `init()` throws
 * `Cannot read properties of undefined (reading 'before_track')`, and that
 * throw inside a React effect can unmount the whole app).
 */

type Mixpanel = typeof import('mixpanel-browser').default;

let sdk: Mixpanel | null = null;
let loading: Promise<Mixpanel | null> | null = null;
let initialized = false;

function loadSdk(): Promise<Mixpanel | null> {
  if (!loading) {
    loading = import('mixpanel-browser')
      .then((mod) => mod.default)
      .catch(() => {
        // A blocked or failed chunk fetch leaves analytics off, nothing more.
        loading = null;
        return null;
      });
  }
  return loading;
}

/**
 * Load and initialize Mixpanel, if consent allows and a token is configured.
 * Safe to call repeatedly — later calls are no-ops once initialized, which is
 * what makes it usable as the `onConsentChange` handler.
 */
export function initMixpanel(): void {
  if (initialized) return;
  if (typeof window === 'undefined') return;
  const token = process.env.NEXT_PUBLIC_MP_TOKEN;
  if (!token) return;
  if (!hasAnalyticsConsent()) return;

  void loadSdk().then((mixpanel) => {
    if (!mixpanel || initialized) return;
    try {
      mixpanel.init(token, {
        debug: false,
        // Page-view tracking is owned by RouteAnalytics in providers.tsx.
        // Letting the SDK auto-track here would double-fire.
        track_pageview: false,
        persistence: 'localStorage',
      });
      sdk = mixpanel;
      initialized = true;
    } catch {
      // Mixpanel must never block the editing flow.
    }
  });
}

/** True once `init()` has run, for callers that want to skip building props. */
export function isMixpanelReady(): boolean {
  return initialized;
}

export function trackMixpanel(event: string, properties?: Record<string, unknown>): void {
  if (!initialized || !sdk) return;
  if (!hasAnalyticsConsent()) return;
  try {
    sdk.track(event, properties);
  } catch {
    // Never block the UI.
  }
}

export function mixpanelPeopleSet(properties: Record<string, unknown>): void {
  if (!initialized || !sdk) return;
  if (!hasAnalyticsConsent()) return;
  try {
    sdk.people.set(properties);
  } catch {
    // Never block the UI.
  }
}

export function mixpanelPeopleIncrement(properties: Record<string, number>): void {
  if (!initialized || !sdk) return;
  if (!hasAnalyticsConsent()) return;
  try {
    sdk.people.increment(properties);
  } catch {
    // Never block the UI.
  }
}
