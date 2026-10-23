// Activation and return events (MM30).
//
//   activation_first_job_completed  once per signed-in person, and once per guest browser
//   return_visit                    emitted by the analytics client itself (client.ts) when a session
//                                   rotates over an earlier one; see onSessionStart in session.ts
//
// Properties are enums and buckets only: no ids, no file names, no timestamps.
//
// THE FLAG. `mm.activated` (localStorage) lists who has already been counted on this browser:
// `guest` and/or `u:<firebase uid>`. It never leaves the browser. A guest who activates and
// later signs up fires once more as a person, which matches the rollup's COALESCE(person_id,
// visitor_id) key. The server rollup (daily_activation_stats) is authoritative; this event is the
// convenience marker, so a cleared localStorage can fire it again and nothing downstream relies
// on it being unique.

import { analytics } from './client';
import { hoursSinceSignupBucket } from './buckets';
import { getContextOverrides } from './context';
import { EVENTS, type MediaKind } from './events';

const FLAG_KEY = 'mm.activated';

interface ActivationIdentity {
  uid: string | null;
  /** Account creation time (ms since epoch), when Firebase reports one. */
  createdAtMs: number | null;
}

let identity: ActivationIdentity = { uid: null, createdAtMs: null };
/** Fallback when localStorage is blocked: dedupes within this page load only. */
const memoryFlag = new Set<string>();

/** Called by AnalyticsProvider on every auth change. */
export function setActivationIdentity(next: ActivationIdentity): void {
  identity = next;
}

function readFlag(): string[] {
  try {
    const raw = window.localStorage.getItem(FLAG_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === 'string') : [];
  } catch {
    return [...memoryFlag];
  }
}

function writeFlag(keys: string[]): void {
  keys.forEach((k) => memoryFlag.add(k));
  try {
    window.localStorage.setItem(FLAG_KEY, JSON.stringify(keys));
  } catch {
    /* blocked storage: the in-memory set still dedupes this page load */
  }
}

function safely(fn: () => void): void {
  try {
    fn();
  } catch {
    /* analytics must never break the flow it observes */
  }
}

export const activationEvents = {
  /**
   * Call next to `job_completed`. Fires `activation_first_job_completed` when this browser has
   * not yet counted this person (or this guest). Tool slug and media kind come from the
   * persistent analytics context, the same source `job_completed` itself uses.
   */
  jobCompleted(now: number = Date.now()): void {
    safely(() => {
      if (typeof window === 'undefined') return;
      const key = identity.uid ? `u:${identity.uid}` : 'guest';
      const seen = readFlag();
      if (seen.includes(key)) return;
      writeFlag([...seen, key]);

      const ctx = getContextOverrides();
      const guest = !identity.uid;
      const mediaKind: MediaKind = ctx.media_kind ?? 'unknown';
      analytics.track(EVENTS.ACTIVATION_FIRST_JOB_COMPLETED, {
        tool_slug: ctx.tool_slug ?? null,
        media_kind: mediaKind,
        hours_since_signup:
          guest || identity.createdAtMs === null
            ? null
            : hoursSinceSignupBucket(now - identity.createdAtMs),
        guest,
      });
    });
  },
};

/** For tests. */
export function resetActivationForTests(): void {
  identity = { uid: null, createdAtMs: null };
  memoryFlag.clear();
}
