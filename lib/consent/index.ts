/**
 * The public consent API.
 *
 * This module replaces `lib/consent.ts` and deliberately keeps the names that were
 * already used across the app (`hasAnalyticsConsent`, `onConsentChange`,
 * `initConsentListener`, `requestConsentReview`, `onConsentReviewRequest`) so the
 * migration was a change of implementation rather than a change of every call site.
 *
 * WHAT CHANGED UNDERNEATH:
 *
 *   - State is three-valued (`granted` / `denied` / `unset`) instead of two. See
 *     state.ts for why that is the load-bearing difference.
 *   - Consent Mode is a MIRROR of our own state, not the source of truth. The old
 *     module wrapped `window.gtag` and inferred consent from whatever called it, which
 *     meant our source of truth was a Google API we do not control and which never
 *     fires at all on the review build (no AdSense script → no Funding Choices → the
 *     wrapper never sees an update → everything stayed denied forever).
 *   - Region-aware defaults: US gets notice-and-opt-out, everywhere else gets opt-in.
 *   - Every decision is recorded server-side for evidence.
 */

import { getVisitorId } from '@/lib/analytics/identity';

import { deriveAction, recordConsent, type ConsentMechanism } from './audit';
import { pushConsentMode } from './consentModeBridge';
import { detectGPC } from './gpc';
import { resolveRegion } from './regions';
import {
  BANNER_VERSION,
  POLICY_VERSION,
  applyConsent,
  defaultsForRegion,
  getConsentDetails,
  migrateLegacyConsent,
  needsPrompt,
  onConsentDetailsChange,
  readStoredConsent,
  updateConsent,
  type ConsentDetails,
  type ConsentValue,
  type RegionGroup,
} from './state';

export type { ConsentDetails, ConsentValue, RegionGroup } from './state';
export type { ConsentMechanism } from './audit';
export { BANNER_VERSION, POLICY_VERSION, needsPrompt } from './state';
export { detectGPC } from './gpc';
export { requiresOptIn } from './regions';

/* ---------------------------------------------------------------------------
 * Legacy-compatible surface
 *
 * `ConsentState` is the four-signal Consent Mode shape the old module exposed. It is
 * kept because it is a genuinely useful summary for anything that thinks in Google's
 * vocabulary (the future ad components), not for backwards compatibility alone.
 * ------------------------------------------------------------------------- */

export interface ConsentState {
  ad_storage: 'granted' | 'denied';
  ad_user_data: 'granted' | 'denied';
  ad_personalization: 'granted' | 'denied';
  analytics_storage: 'granted' | 'denied';
}

export function getConsentState(): ConsentState {
  const details = getConsentDetails();
  const ads = details.advertising === 'granted' ? 'granted' : 'denied';
  return {
    ad_storage: ads,
    ad_user_data: ads,
    ad_personalization: ads,
    analytics_storage: details.analytics === 'granted' ? 'granted' : 'denied',
  };
}

export function hasAnalyticsConsent(): boolean {
  return getConsentDetails().analytics === 'granted';
}

export function hasAdStorageConsent(): boolean {
  return getConsentDetails().advertising === 'granted';
}

/** Subscribe in the legacy four-signal shape. */
export function onConsentChange(listener: (state: ConsentState) => void): () => void {
  return onConsentDetailsChange(() => {
    listener(getConsentState());
  });
}

/** Subscribe to the full details. Preferred for new code. */
export { onConsentDetailsChange, getConsentDetails };

/* ---------------------------------------------------------------------------
 * Initialization
 * ------------------------------------------------------------------------- */

let initialized = false;
let initPromise: Promise<ConsentDetails> | null = null;

/**
 * Resolve the visitor's consent state and apply it.
 *
 * ORDER MATTERS, and each step is here for a specific failure it prevents:
 *
 *  1. Migrate the legacy v1 record, so a visitor who already answered is not asked
 *     again just because we improved the data model.
 *  2. Read the stored v2 record. A `policyVersion` mismatch discards it, which is what
 *     re-prompts everyone after a material change.
 *  3. Detect GPC. Re-evaluated on EVERY load, not just the first, because CPRA treats
 *     the signal as a valid opt-out at all times — it must be able to override a grant
 *     given last week.
 *  4. Resolve the region. Only needed when there is no stored decision, so a returning
 *     visitor with a choice on file makes no request at all.
 *  5. Apply. A stored decision wins; otherwise the region's defaults apply.
 *
 * Never rejects. Every failure path lands on the conservative default (`unset`, which
 * captures nothing) rather than on an exception a caller would have to handle.
 */
export function initConsent(): Promise<ConsentDetails> {
  if (initPromise) return initPromise;

  initPromise = (async (): Promise<ConsentDetails> => {
    if (typeof window === 'undefined') return getConsentDetails();

    const gpc = detectGPC();
    const stored = readStoredConsent() || migrateLegacyConsent();

    if (stored) {
      const next: ConsentDetails = {
        ...stored,
        gpc,
        // GPC overrides a prior advertising grant. See gpc.ts for the legal reasoning.
        advertising: gpc ? 'denied' : stored.advertising,
      };
      applyConsent(next);
      pushConsentMode(next);

      // Record the automatic override so we can evidence that the signal was honoured
      // — and only when it actually changed something, so a GPC user does not generate
      // an identical record on every page load.
      if (gpc && stored.advertising === 'granted') {
        recordConsent({
          details: next,
          mechanism: 'gpc',
          action: 'updated',
          visitorId: safeVisitorId(),
        });
      }
      initialized = true;
      return next;
    }

    // No decision on file: the region decides the default.
    const region = await resolveRegion();
    const defaults = defaultsForRegion(region.regionGroup, gpc);
    const next: ConsentDetails = {
      v: 2,
      policyVersion: POLICY_VERSION,
      bannerVersion: BANNER_VERSION,
      regionGroup: region.regionGroup,
      analytics: defaults.analytics,
      advertising: defaults.advertising,
      gpc,
      decidedAt: null,
    };
    // Persist ONLY when the default is itself a decision. In the US, notice-and-opt-out
    // means analytics is granted from the first load and that IS the operative state,
    // so it is written and recorded. Elsewhere the state is `unset` and nothing is
    // stored — an unset state carries no decision worth remembering, and writing one
    // would create a record whose only content is "this browser visited us".
    const isDecision = defaults.analytics !== 'unset';
    applyConsent(next, isDecision);
    pushConsentMode(next);

    if (isDecision) {
      recordConsent({
        details: next,
        mechanism: 'implied_notice',
        action: 'granted',
        visitorId: safeVisitorId(),
        countryCode: region.countryCode,
      });
    }

    initialized = true;
    return next;
  })();

  return initPromise;
}

/**
 * Legacy entry point, kept so `app/providers.tsx` reads the same as before.
 *
 * The old `initConsentListener` wrapped `window.gtag` to OBSERVE consent updates. That
 * inversion is gone — we are the source of truth and Consent Mode is the mirror — so
 * this is now simply "resolve and apply", fire-and-forget.
 */
export function initConsentListener(): void {
  void initConsent();
}

export function isConsentInitialized(): boolean {
  return initialized;
}

/* ---------------------------------------------------------------------------
 * Making a decision
 * ------------------------------------------------------------------------- */

export interface SetConsentInput {
  analytics: boolean;
  /** Omitted leaves the advertising category untouched (it is dormant until Phase 12). */
  advertising?: boolean;
  mechanism: ConsentMechanism;
}

/**
 * Record an explicit choice: persist it, mirror it to Consent Mode, notify the SDK, and
 * write the server-side audit record.
 *
 * GPC still wins over an advertising grant here. Someone can send GPC and click
 * "accept advertising" in the same session — the signal is the binding one, and letting
 * a click override it would make our "we honour GPC" claim false.
 */
export function setConsent(input: SetConsentInput): ConsentDetails {
  const previous = getConsentDetails();
  const gpc = detectGPC();

  let advertising: ConsentValue = previous.advertising;
  if (input.advertising !== undefined) {
    advertising = input.advertising ? 'granted' : 'denied';
  }
  if (gpc) advertising = 'denied';

  const next = updateConsent({
    analytics: input.analytics ? 'granted' : 'denied',
    advertising,
    gpc,
    decidedAt: new Date().toISOString(),
  });

  pushConsentMode(next);
  recordConsent({
    details: next,
    mechanism: input.mechanism,
    action: deriveAction(previous, next),
    visitorId: safeVisitorId(),
  });
  return next;
}

/**
 * Apply consent decided OUTSIDE this app: the CreaTV host forwarding its own
 * visitor's state into the embedded editor via the `cs:consent` protocol
 * message (part 10, ADR ws/0003).
 *
 * Deliberately different from setConsent in three ways:
 *   - NOT persisted (persist=false). The host owns the durable record and
 *     re-sends on every handshake; writing it to our (partitioned) iframe
 *     storage would create a second record that could drift from the real one.
 *   - NOT audited. recordConsent evidences a choice made in OUR banner; a
 *     forwarded state is the host's evidence, not ours.
 *   - NOT mirrored to Consent Mode. The embed surface loads no Google scripts.
 *
 * The three-valued shape passes through unchanged, so a host that has not
 * asked yet ('unset') leaves the embed buffering in memory — the same safe
 * behaviour the standalone site has before its banner is answered.
 */
export function applyHostConsent(
  analyticsValue: ConsentValue,
  advertisingValue?: ConsentValue,
): void {
  updateConsent(
    {
      analytics: analyticsValue,
      ...(advertisingValue !== undefined ? { advertising: advertisingValue } : {}),
      decidedAt: analyticsValue === 'unset' ? null : new Date().toISOString(),
    },
    false,
  );
}

/**
 * The CPRA "Do Not Sell or Share My Personal Information" action.
 *
 * Opts out of the advertising category and nothing else. First-party analytics on our
 * own domain is not a sale or a share, so it is untouched — the two are genuinely
 * different requests, and bundling them would either under-deliver on the legal one or
 * over-deliver and quietly cost us data the visitor did not ask us to stop collecting.
 */
export function optOutOfSale(): ConsentDetails {
  const previous = getConsentDetails();
  const next = updateConsent({
    advertising: 'denied',
    decidedAt: previous.decidedAt || new Date().toISOString(),
  });
  pushConsentMode(next);
  recordConsent({
    details: next,
    mechanism: 'preferences',
    action: 'updated',
    visitorId: safeVisitorId(),
  });
  return next;
}

/**
 * Read the visitor ID without creating one as a side effect of a DENIAL.
 *
 * Subtle but it matters: the ID exists on a strictly-necessary basis for quota and
 * abuse, and by the time anyone is clicking a consent button the app has already minted
 * one. But if storage is blocked, `getVisitorId()` would mint a throwaway that appears
 * on exactly one audit record and never again — so a failure here yields undefined and
 * the record is stored with a NULL visitor_id, which the schema explicitly allows.
 */
function safeVisitorId(): string | undefined {
  try {
    return getVisitorId() || undefined;
  } catch {
    return undefined;
  }
}

/* ---------------------------------------------------------------------------
 * Reopening the preferences UI
 *
 * Module-level pub/sub rather than context, mirroring `lib/auth/quotaBus.ts`: the footer
 * link and the consent UI sit in different subtrees, and threading state through the
 * provider tree for one button would be the larger change.
 * ------------------------------------------------------------------------- */

const reviewListeners = new Set<() => void>();

/** Ask whoever owns the consent UI to open the preferences centre. */
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
