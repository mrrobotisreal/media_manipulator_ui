// Persistence and eligibility rules for the new-account tour (MM35). No React, no network.
//
// SERVER PERSISTENCE DEFERRED. GET /api/account/settings (MM22 settingsResponse) carries no
// `onboardingCompletedAt`, and the ticket forbids inventing an endpoint, so completion is kept
// in localStorage under `mm.onboarding.v1:<uid>` (per account, so two people on one browser do
// not share it). The cost: a new browser or cleared storage can show the tour once more to an
// account still inside the "new" window below. When the API grows the field, only
// readOnboardingDone / markOnboardingDone change.

export const ONBOARDING_KEY_PREFIX = 'mm.onboarding.v1:';
/** Accounts older than this never get the tour on their own (they can still replay it). */
export const NEW_ACCOUNT_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;

/** Fallback when localStorage is blocked: dedupes within this page load only. */
const memoryDone = new Set<string>();

export const onboardingKey = (uid: string): string => `${ONBOARDING_KEY_PREFIX}${uid}`;

export function readOnboardingDone(uid: string): boolean {
  if (memoryDone.has(uid)) return true;
  try {
    return window.localStorage.getItem(onboardingKey(uid)) !== null;
  } catch {
    return false;
  }
}

export function markOnboardingDone(uid: string, now: number = Date.now()): void {
  memoryDone.add(uid);
  try {
    window.localStorage.setItem(onboardingKey(uid), new Date(now).toISOString());
  } catch {
    // Private mode: the in-memory set still stops a second showing this page load.
  }
}

/** For tests. */
export function resetOnboardingForTests(): void {
  memoryDone.clear();
}

/** True when Firebase reports the account as created inside the new-account window. */
export function isNewAccount(creationTime: string | null | undefined, now: number = Date.now()): boolean {
  const created = Date.parse(creationTime ?? '');
  if (!Number.isFinite(created)) return false;
  return now - created <= NEW_ACCOUNT_WINDOW_MS && created <= now + 60_000;
}

/** The pathname without a locale prefix is /account or below it. */
export function isAccountPath(pathname: string | null | undefined): boolean {
  if (!pathname) return false;
  const stripped = pathname.replace(/^\/(ru|uk|he|de|es)(?=\/|$)/, '');
  return stripped === '/account' || stripped.startsWith('/account/');
}

export interface TourContext {
  signedIn: boolean;
  uid: string | null;
  creationTime: string | null | undefined;
  pathname: string | null | undefined;
  /** A conversion/upload is running (see hasActiveJobs). */
  busy: boolean;
  /** The sign-in / sign-up panel is open. */
  authOpen: boolean;
  now?: number;
}

/**
 * Whether the tour may open on its own right now. Replay bypasses this entirely.
 * Never for guests, never twice, never on /account, never over a running job or the auth panel.
 */
export function shouldAutoShowTour(ctx: TourContext): boolean {
  if (!ctx.signedIn || !ctx.uid) return false;
  if (ctx.busy || ctx.authOpen) return false;
  if (isAccountPath(ctx.pathname)) return false;
  if (!isNewAccount(ctx.creationTime, ctx.now)) return false;
  return !readOnboardingDone(ctx.uid);
}

export const TOUR_REPLAY_EVENT = 'mm:onboarding-replay';

/** Account > Profile "Replay tour": asks the mounted tour host to open. Does nothing if none is mounted. */
export function requestTourReplay(): void {
  try {
    window.dispatchEvent(new CustomEvent(TOUR_REPLAY_EVENT));
  } catch {
    /* no window: nothing to replay */
  }
}
