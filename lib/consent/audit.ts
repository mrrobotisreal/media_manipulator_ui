/**
 * The server-side consent audit record.
 *
 * WHY THIS EXISTS. GDPR Art. 7(1) requires the controller to be able to DEMONSTRATE
 * that consent was given. A choice stored only in the visitor's own localStorage proves
 * nothing: they can clear it, and we cannot produce it on request. CPRA expects a
 * comparable record that an opt-out was honoured. So every decision, change, withdrawal
 * and automatic GPC opt-out is posted to `POST /v1/consent` and stored server-side for
 * five years.
 *
 * IT GOES TO /v1/consent, NEVER /v1/capture. Two reasons, both structural: the record
 * is a legal-obligation record rather than analytics (so it is accepted regardless of
 * consent state — refusing to log "this person declined" because they declined would
 * make the decline unprovable), and it is retained on a completely different clock
 * (5 years vs 13 months).
 *
 * FIRE-AND-FORGET. The visitor's choice is already applied locally before this runs, so
 * a failed request must not block, retry-loop, or surface anything. It is logged
 * loudly on the SERVER when the write fails, which is where someone can act on it.
 */

import type { ConsentDetails } from './state';
import { analyticsBaseUrl } from '@/lib/analytics/baseUrl';

export type ConsentMechanism = 'banner' | 'preferences' | 'gpc' | 'implied_notice';
export type ConsentAction = 'granted' | 'denied' | 'updated' | 'withdrawn';

export interface ConsentAuditInput {
  details: ConsentDetails;
  mechanism: ConsentMechanism;
  action: ConsentAction;
  visitorId?: string;
  countryCode?: string;
}

/**
 * Post the record. Never throws, never rejects.
 *
 * `keepalive: true` because a consent decision is frequently the last thing a page does
 * before the visitor navigates away from the banner — without it, the request dies with
 * the document and the record we are legally required to hold never arrives.
 */
export function recordConsent(input: ConsentAuditInput): void {
  if (typeof window === 'undefined') return;

  const body = {
    visitor_id: input.visitorId || undefined,
    occurred_at: new Date().toISOString(),
    region_group: input.details.regionGroup,
    country_code: input.countryCode || undefined,
    mechanism: input.mechanism,
    action: input.action,
    analytics: input.details.analytics === 'granted',
    // Sent as an explicit boolean ONLY when the advertising category was actually part
    // of the decision. While it is `unset` we send null, because the column
    // distinguishes "not asked" from "declined" — and claiming an ad opt-in we never
    // asked for would be exactly the kind of thing this record exists to disprove.
    advertising: input.details.advertising === 'unset' ? null : input.details.advertising === 'granted',
    gpc_present: input.details.gpc,
    banner_version: input.details.bannerVersion,
    policy_version: input.details.policyVersion,
  };

  try {
    void fetch(`${analyticsBaseUrl()}/v1/consent`, {
      method: 'POST',
      keepalive: true,
      credentials: 'omit',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).catch(() => {
      // Nothing useful to do client-side. The server logs a failed write at ERROR.
    });
  } catch {
    // ignore
  }
}

/**
 * Derive the audit `action` from a state transition.
 *
 * `withdrawn` is distinct from `denied` and the distinction is legally meaningful:
 * `denied` is a first-time refusal, `withdrawn` is the exercise of the Art. 7(3) right
 * to withdraw consent previously given. A regulator asking "do people withdraw?" wants
 * the second number, not the first.
 */
export function deriveAction(previous: ConsentDetails, next: ConsentDetails): ConsentAction {
  const wasDecided = previous.decidedAt !== null;
  const hadAnalytics = previous.analytics === 'granted';
  const hasAnalytics = next.analytics === 'granted';

  if (!wasDecided) return hasAnalytics ? 'granted' : 'denied';
  if (hadAnalytics && !hasAnalytics) return 'withdrawn';
  if (!hadAnalytics && hasAnalytics) return 'granted';
  return 'updated';
}
