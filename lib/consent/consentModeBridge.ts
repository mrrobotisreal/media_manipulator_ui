/**
 * Google Consent Mode v2 bridge.
 *
 * `app/layout.tsx` sets all four signals to `denied` before any tag runs. This module
 * pushes our first-party decision into that state so GA4 — and, once ads go live, the
 * AdSense stack — behaves consistently with what the visitor actually chose.
 *
 * THE MAPPING, and why it is not one-to-one:
 *
 *   analytics   → analytics_storage
 *   advertising → ad_storage + ad_user_data + ad_personalization
 *
 * Three ad signals for one category because we ask one advertising question, and
 * splitting it into three would be a consent dialogue nobody can answer meaningfully.
 * `functionality_storage` and `security_storage` stay granted throughout: they cover
 * the strictly-necessary storage (theme preference, the quota/abuse identifiers) that
 * consent does not gate.
 *
 * `unset` MAPS TO `denied`. Consent Mode has no third value, and "we have not asked
 * yet" must behave as "not allowed" — which is exactly what the layout's defaults
 * already do, so an unset state simply leaves them alone.
 *
 * PHASE 12 HANDOVER. Once AdSense Privacy & Messaging (the certified TCF v2.2 CMP) is
 * live, IT owns consent state for ads in the EEA/UK and writes Consent Mode itself. At
 * that point this bridge must stop writing the ad signals or the two will fight. The
 * `ADSENSE_ENABLED` flag is the switch, and the call site — not this module — makes
 * that decision, so this stays a pure mapper.
 */

import type { ConsentDetails } from './state';

type ConsentSignal = 'granted' | 'denied';

export interface ConsentModeUpdate {
  analytics_storage: ConsentSignal;
  ad_storage: ConsentSignal;
  ad_user_data: ConsentSignal;
  ad_personalization: ConsentSignal;
}

/** Map our three-valued state onto Consent Mode's two. */
export function toConsentModeUpdate(details: ConsentDetails): ConsentModeUpdate {
  const analytics: ConsentSignal = details.analytics === 'granted' ? 'granted' : 'denied';
  const advertising: ConsentSignal = details.advertising === 'granted' ? 'granted' : 'denied';
  return {
    analytics_storage: analytics,
    ad_storage: advertising,
    ad_user_data: advertising,
    ad_personalization: advertising,
  };
}

/**
 * Push the state into Consent Mode.
 *
 * Called for a DECLINE as well as an accept. A tag that never hears "denied" cannot
 * distinguish a decline from an unanswered question, and Consent Mode's own
 * `wait_for_update: 500` in the bootstrap means an explicit update is what releases the
 * tag from waiting.
 *
 * `includeAdSignals` is false once a certified CMP owns them.
 */
export function pushConsentMode(details: ConsentDetails, includeAdSignals = true): void {
  if (typeof window === 'undefined') return;
  const gtag = (window as typeof window & { gtag?: (...args: unknown[]) => void }).gtag;
  if (typeof gtag !== 'function') return;

  const update = toConsentModeUpdate(details);
  const payload: Record<string, ConsentSignal> = {
    analytics_storage: update.analytics_storage,
  };
  if (includeAdSignals) {
    payload.ad_storage = update.ad_storage;
    payload.ad_user_data = update.ad_user_data;
    payload.ad_personalization = update.ad_personalization;
  }

  try {
    gtag('consent', 'update', payload);
  } catch {
    // A missing or wrapped gtag must never break a consent decision — the
    // first-party state is the source of truth, and this is a mirror of it.
  }
}
