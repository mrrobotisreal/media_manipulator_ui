/**
 * Consent state: the store, the versioning, and the defaults per region.
 *
 * THREE-VALUED, and that is the whole design. `unset` is not `denied`:
 *
 *   granted — capture fully.
 *   denied  — capture nothing; only the id-free /v1/count ping.
 *   unset   — the visitor has NOT been asked yet, or the question has changed.
 *             No persistence, no transmission, events buffered in memory only.
 *
 * A two-valued model has to pick a side for "not asked", and either choice is wrong:
 * default-granted processes data without consent in an opt-in region, and
 * default-denied silently discards the first page view of every visitor who is about
 * to accept. The old `mm-consent-v1` store was two-valued for exactly this reason and
 * lost the session's first real page view on every accept — the banner had to fire a
 * compensating page_view by hand.
 *
 * VERSIONING. `policyVersion` is part of the stored record and is compared on read.
 * Bumping it invalidates every stored choice and re-prompts everyone, which is what
 * GDPR requires when what you are asking for materially changes. `bannerVersion`
 * tracks the wording so a consent record can evidence what was actually shown.
 */

export type ConsentValue = 'granted' | 'denied' | 'unset';
export type RegionGroup = 'gdpr' | 'us' | 'other' | 'unknown';
export type ConsentCategory = 'analytics' | 'advertising';

/**
 * BUMP THIS to re-prompt every visitor.
 *
 * Bump it when: a new category is added, a new processor is introduced, the retention
 * period materially lengthens, or the purpose of processing changes. Do NOT bump it
 * for copy tweaks — that is what bannerVersion is for.
 */
export const POLICY_VERSION = '2026-07-30';

/** Wording version. Recorded on every consent record; does not re-prompt. */
export const BANNER_VERSION = '2';

export const CONSENT_STORAGE_KEY = 'mm-consent-v2';
/** The two-valued predecessor. Read once and migrated; never written again. */
export const LEGACY_CONSENT_STORAGE_KEY = 'mm-consent-v1';

export interface ConsentDetails {
  v: 2;
  policyVersion: string;
  bannerVersion: string;
  regionGroup: RegionGroup;
  analytics: ConsentValue;
  /** Dormant until ads go live (Phase 12). Never `granted` in this release. */
  advertising: ConsentValue;
  /** Whether Global Privacy Control was asserted when this state was decided. */
  gpc: boolean;
  /** ISO timestamp of the decision, or null when nothing has been decided. */
  decidedAt: string | null;
}

type Listener = (details: ConsentDetails) => void;

const listeners = new Set<Listener>();

/**
 * The live state. Starts at the CONSERVATIVE default — `unset` for both categories,
 * region `unknown` — so nothing is captured between module load and the point where
 * the stored choice and the region have both resolved. Getting this wrong in the
 * other direction would mean capturing before we knew whether we were allowed to.
 */
let current: ConsentDetails = {
  v: 2,
  policyVersion: POLICY_VERSION,
  bannerVersion: BANNER_VERSION,
  regionGroup: 'unknown',
  analytics: 'unset',
  advertising: 'unset',
  gpc: false,
  decidedAt: null,
};

function canStore(): boolean {
  try {
    return typeof window !== 'undefined' && !!window.localStorage;
  } catch {
    return false;
  }
}

function isConsentValue(value: unknown): value is ConsentValue {
  return value === 'granted' || value === 'denied' || value === 'unset';
}

function isRegionGroup(value: unknown): value is RegionGroup {
  return value === 'gdpr' || value === 'us' || value === 'other' || value === 'unknown';
}

/**
 * Read the stored record.
 *
 * Returns null when nothing is stored, when the record is unreadable, or when its
 * `policyVersion` no longer matches — all three mean "ask", which is the safe
 * direction. Asking twice is a small annoyance; assuming consent is not.
 */
export function readStoredConsent(): ConsentDetails | null {
  if (!canStore()) return null;
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<ConsentDetails>;
    if (!parsed || parsed.v !== 2) return null;
    if (parsed.policyVersion !== POLICY_VERSION) return null;
    if (!isConsentValue(parsed.analytics) || !isConsentValue(parsed.advertising)) return null;
    return {
      v: 2,
      policyVersion: POLICY_VERSION,
      bannerVersion: typeof parsed.bannerVersion === 'string' ? parsed.bannerVersion : BANNER_VERSION,
      regionGroup: isRegionGroup(parsed.regionGroup) ? parsed.regionGroup : 'unknown',
      analytics: parsed.analytics,
      advertising: parsed.advertising,
      gpc: parsed.gpc === true,
      decidedAt: typeof parsed.decidedAt === 'string' ? parsed.decidedAt : null,
    };
  } catch {
    return null;
  }
}

/**
 * One-time migration from the two-valued `mm-consent-v1` record.
 *
 * A visitor who already answered must not be asked again just because we improved our
 * data model — re-prompting an existing yes reads as either a bug or a dark pattern.
 * The old record stored the four Consent Mode signals; `analytics_storage` maps to our
 * analytics category, and the ad signals map to advertising. `decidedAt` is carried
 * over so "when did I agree" keeps its answer.
 *
 * Advertising is deliberately NOT carried over as `granted`. The v1 banner asked one
 * combined question, so an old accept cannot evidence informed consent to ad
 * personalization specifically — and ads are not live anyway.
 */
export function migrateLegacyConsent(): ConsentDetails | null {
  if (!canStore()) return null;
  try {
    const raw = window.localStorage.getItem(LEGACY_CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as {
      version?: number;
      decidedAt?: string;
      state?: Record<string, string>;
    };
    const analyticsSignal = parsed?.state?.analytics_storage;
    if (analyticsSignal !== 'granted' && analyticsSignal !== 'denied') return null;

    const migrated: ConsentDetails = {
      v: 2,
      policyVersion: POLICY_VERSION,
      bannerVersion: BANNER_VERSION,
      regionGroup: 'unknown',
      analytics: analyticsSignal,
      advertising: 'unset',
      gpc: false,
      decidedAt: typeof parsed.decidedAt === 'string' ? parsed.decidedAt : new Date().toISOString(),
    };
    writeStoredConsent(migrated);
    // Remove the old key so the migration runs exactly once.
    window.localStorage.removeItem(LEGACY_CONSENT_STORAGE_KEY);
    return migrated;
  } catch {
    return null;
  }
}

function writeStoredConsent(details: ConsentDetails): void {
  if (!canStore()) return;
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(details));
  } catch {
    // Private mode or a full quota. The choice applies to this page load; we simply
    // have to ask again next time.
  }
}

/** The current state. Always returns a value. */
export function getConsentDetails(): ConsentDetails {
  return { ...current };
}

/**
 * Replace the state and notify. Persists only a DECIDED state.
 *
 * An `unset` state is never written to disk: it carries no decision worth
 * remembering, and writing it would create a stored record whose only content is
 * "this browser visited us", which is the thing we are trying not to do before
 * consent.
 */
export function applyConsent(next: ConsentDetails, persist = true): void {
  current = { ...next };
  if (persist && (next.analytics !== 'unset' || next.advertising !== 'unset')) {
    writeStoredConsent(current);
  }
  const snapshot = getConsentDetails();
  listeners.forEach((listener) => {
    try {
      listener(snapshot);
    } catch {
      // A broken listener must never block consent propagation to the others — the
      // SDK's gate is one of these listeners.
    }
  });
}

/** Patch the state. Used by the banner, the preferences centre, GPC, and region resolution. */
export function updateConsent(patch: Partial<ConsentDetails>, persist = true): ConsentDetails {
  applyConsent({ ...current, ...patch }, persist);
  return getConsentDetails();
}

export function onConsentDetailsChange(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/**
 * Default state for a region, before any explicit choice.
 *
 *   gdpr / other / unknown → analytics `unset`. Nothing is captured, nothing is
 *     persisted, and the banner blocks analytics rather than blocking the site. `other`
 *     and `unknown` are treated as gdpr deliberately: a jurisdiction we have not
 *     specifically modelled is more likely to require consent than not, and the cost
 *     of asking unnecessarily is a banner while the cost of not asking is a violation.
 *
 *   us → analytics `granted` under notice-and-opt-out, which is what CPRA and the
 *     other state laws actually require. The visitor still gets a dismissible notice
 *     and a permanent opt-out path, and GPC is honoured automatically.
 *
 * Advertising is `unset` everywhere. Ads are not live (Phase 12), and defaulting a
 * category we have not asked about to anything else would be indefensible.
 */
export function defaultsForRegion(region: RegionGroup, gpc: boolean): Pick<ConsentDetails, 'analytics' | 'advertising'> {
  if (region === 'us') {
    return { analytics: 'granted', advertising: gpc ? 'denied' : 'unset' };
  }
  return { analytics: 'unset', advertising: gpc ? 'denied' : 'unset' };
}

/** Whether a banner or notice still needs to be shown. */
export function needsPrompt(details: ConsentDetails): boolean {
  return details.analytics === 'unset';
}

/** For tests. */
export function resetConsentStateForTests(): void {
  current = {
    v: 2,
    policyVersion: POLICY_VERSION,
    bannerVersion: BANNER_VERSION,
    regionGroup: 'unknown',
    analytics: 'unset',
    advertising: 'unset',
    gpc: false,
    decidedAt: null,
  };
  listeners.clear();
}
