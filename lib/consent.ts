/**
 * Consent Mode v2 state observer.
 *
 * `app/layout.tsx` sets all four consent signals to "denied" before any tracking
 * script runs. Something later calls `gtag('consent', 'update', { ... })` with
 * the visitor's answer: the first-party banner in `components/consent/` today,
 * and Google Funding Choices (loaded via adsbygoogle.js) once AdSense is
 * approved. We wrap `window.gtag` so we can observe those update calls whatever
 * their source and notify analytics modules — Mixpanel, GA event helpers, etc. —
 * whether they're allowed to fire.
 *
 * Every analytics sink in the app now checks `hasAnalyticsConsent()`: GA4,
 * Mixpanel (lib/mixpanel.ts), Firebase Analytics (lib/analytics.ts) and the
 * first-party endpoint (lib/firstPartyAnalytics.ts).
 *
 * The first-party sink used to be exempt on a legitimate-interest argument —
 * it posts to our own host, so the reasoning went, it counts as strictly
 * necessary. That argument does not survive looking at the payload: a
 * persistent visitor id, a session id, the full URL, the referrer, the user
 * agent, screen dimensions, the timezone and UTM parameters. It is gated now.
 * A consent-free baseline, if one is ever wanted, should be a separate
 * pathname-only, id-free page count rather than an exemption for that event.
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

/* ---------------------------------------------------------------------------
 * The first-party choice
 *
 * The review build ships no AdSense script, so Funding Choices never loads and
 * nothing ever calls `gtag('consent', 'update')` — consent stays at its denied
 * defaults forever and every sink above stays dark. These helpers back the
 * first-party banner that asks instead (components/consent/*).
 *
 * Two rules hold this together:
 *
 *   - A stored choice must be REPLAYED on every load. Consent Mode state lives
 *     in the page, not in a cookie we control, so without a replay a visitor who
 *     accepted last week arrives with everything denied again.
 *   - When ADSENSE_ENABLED becomes true, Funding Choices is the CMP and owns
 *     TCF state. The banner is not rendered and the stored choice is not
 *     replayed over it. That gate lives at the call sites (app/providers.tsx,
 *     components/consent/consent-gate.tsx), so this module stays a pure store.
 * ------------------------------------------------------------------------- */

/** Versioned: a change to what we ask for has to re-ask rather than assume. */
export const CONSENT_STORAGE_KEY = 'mm-consent-v1';
const CONSENT_CHOICE_VERSION = 1;

export interface StoredConsentChoice {
  version: number;
  /** ISO timestamp of the decision, so "when did I agree" has an answer. */
  decidedAt: string;
  state: ConsentState;
}

const SIGNAL_KEYS: Array<keyof ConsentState> = [
  'ad_storage',
  'ad_user_data',
  'ad_personalization',
  'analytics_storage',
];

/** All four signals set the same way. We ask one question, so we store one answer. */
export function consentStateFor(granted: boolean): ConsentState {
  const signal: ConsentSignal = granted ? 'granted' : 'denied';
  return {
    ad_storage: signal,
    ad_user_data: signal,
    ad_personalization: signal,
    analytics_storage: signal,
  };
}

function isStoredChoice(value: unknown): value is StoredConsentChoice {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Partial<StoredConsentChoice>;
  if (candidate.version !== CONSENT_CHOICE_VERSION) return false;
  if (typeof candidate.decidedAt !== 'string') return false;
  const state = candidate.state as Record<string, unknown> | undefined;
  if (typeof state !== 'object' || state === null) return false;
  return SIGNAL_KEYS.every((key) => isConsentSignal(state[key]));
}

/**
 * The visitor's stored answer, or null when they have not been asked, the
 * question has changed version, or storage is unreadable.
 *
 * Private-browsing and blocked-storage failures return null, which means "ask" —
 * the safe direction: asking twice is a small annoyance, assuming consent is not.
 */
export function getStoredConsentChoice(): StoredConsentChoice | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return isStoredChoice(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

/**
 * Pushes a consent state into Consent Mode.
 *
 * Always called for a decline as well as an accept: the update is what makes
 * `initConsentListener`'s wrapper fire, and a sink that never hears "denied"
 * cannot tell a decline from an unanswered question.
 */
export function applyConsentChoice(state: ConsentState): void {
  if (typeof window === 'undefined') return;
  if (typeof window.gtag !== 'function') return;
  window.gtag('consent', 'update', { ...state });
}

/** Records a decision and applies it. Returns the state that was applied. */
export function storeConsentChoice(granted: boolean): ConsentState {
  const state = consentStateFor(granted);
  const choice: StoredConsentChoice = {
    version: CONSENT_CHOICE_VERSION,
    decidedAt: new Date().toISOString(),
    state,
  };
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(choice));
  } catch {
    // Storage blocked: the choice still applies to this page view, we simply
    // have to ask again next time.
  }
  applyConsentChoice(state);
  return state;
}

/**
 * Re-applies a previously stored choice. Call once per load, immediately after
 * `initConsentListener()` so the wrapper is in place to observe it.
 *
 * Returns whether there was a choice to replay, which is also the answer to
 * "should the banner stay hidden".
 */
export function replayStoredConsent(): boolean {
  const stored = getStoredConsentChoice();
  if (!stored) return false;
  applyConsentChoice(stored.state);
  return true;
}

/* --- reopening the banner -------------------------------------------------- */

const reviewListeners = new Set<() => void>();

/**
 * Asks whoever owns the banner to show it again — the footer's "Cookie
 * settings" fallback.
 *
 * Module-level rather than context, like lib/auth/quotaBus.ts: the footer and
 * the banner sit in different subtrees, and threading state through the provider
 * tree for one button would be the larger change.
 */
export function requestConsentReview(): void {
  reviewListeners.forEach((listener) => {
    try {
      listener();
    } catch {
      // A broken listener must not swallow the click.
    }
  });
}

export function onConsentReviewRequest(listener: () => void): () => void {
  reviewListeners.add(listener);
  return () => {
    reviewListeners.delete(listener);
  };
}
