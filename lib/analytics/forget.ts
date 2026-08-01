/**
 * `forgetIdentity()` — the browser-side half of a DSR deletion (Phase 10).
 *
 * WHY THIS EXISTS. `POST /v1/dsr/delete` erases the server-side data, but the
 * browser still holds the old visitor UUID in localStorage. Left alone, the very
 * next event would carry that UUID back to the server and re-create the visitor
 * row the user just erased — an erasure that silently un-erases itself. This
 * function is what makes the erasure stick: everything that references the old
 * identity is discarded, and a FRESH visitor id is minted through the normal
 * identity path.
 *
 * WHAT IS DELIBERATELY KEPT:
 *
 *   - `mm.a.optout` (the self-exclusion flag): it is an instruction about future
 *     traffic, not data about past traffic.
 *   - The consent decision (`mm-consent-v2`): deleting your data is NOT consenting
 *     to new collection — and it is not withdrawing consent either. Their choice,
 *     whatever it was, persists; if analytics consent is granted, events under the
 *     NEW visitor id are fresh collection, which is legal and correct (the
 *     confirmation copy in the preferences centre says so plainly).
 *
 * KNOWN IMPRECISION, accepted: another tab open at this moment still holds the old
 * ids in memory and could deliver an event under them before it reloads (there is
 * no identity-rotation broadcast the way there is for sessions). The recreated
 * rows would be an empty shell a repeat deletion removes; building a cross-tab
 * identity flush to prevent a shell row would be real machinery for a case the
 * repeatable, idempotent delete endpoint already covers.
 */

import { analytics } from './client';
import { getVisitorId, resetIdentityCacheForTests } from './identity';
import { getSessionId, resetSessionCacheForTests } from './session';

/** Everything in localStorage that references the OLD identity. */
const IDENTITY_KEYS = ['mm.a.visitor', 'mm.a.session'];
/** Part 1's legacy mirrors — still written for the mid-deploy case, so a forget
 *  must clear them too or authedFetch's legacy readers could resurrect the id. */
const LEGACY_LOCAL_KEYS = ['mm_user_id', 'mm_visitor_id'];
const LEGACY_SESSION_KEYS = ['mm_session_id'];
/** Outbox keys are per-tab (`mm.a.outbox.v1.<tabId>`); ALL of them go — an
 *  orphaned outbox from a crashed tab holds events under the old visitor id, and
 *  adopting those after a deletion would deliver them. */
const OUTBOX_PREFIX = 'mm.a.outbox.v1.';

export function forgetIdentity(): void {
  try {
    // 1. Nothing queued under the old id may ever be sent.
    analytics.discardQueuedEvents();

    if (typeof window !== 'undefined') {
      // 2. Every persisted outbox, ours and orphans alike.
      try {
        for (const key of Object.keys(window.localStorage)) {
          if (key.startsWith(OUTBOX_PREFIX)) window.localStorage.removeItem(key);
        }
      } catch {
        // Storage blocked; the in-memory discard above still holds.
      }

      // 3. The identity keys and their legacy mirrors. NOT touched:
      //    mm.a.optout and the consent decision — see the module comment.
      try {
        for (const key of [...IDENTITY_KEYS, ...LEGACY_LOCAL_KEYS]) {
          window.localStorage.removeItem(key);
        }
      } catch {
        // ignore
      }
      try {
        for (const key of LEGACY_SESSION_KEYS) {
          window.sessionStorage.removeItem(key);
        }
      } catch {
        // ignore
      }
    }

    // 4. Drop the in-memory caches, then mint fresh ids through the normal
    //    path. (The reset functions' comments already anticipate this caller:
    //    "for tests and for a hard reset from the preferences centre".)
    resetIdentityCacheForTests();
    resetSessionCacheForTests();
    getVisitorId();
    getSessionId();
  } catch {
    // Analytics never throws — a failed forget must not break the dialog that
    // called it. The worst case is the old id lingering until the next manual
    // attempt, which the idempotent delete endpoint tolerates.
  }
}
