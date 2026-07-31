/**
 * Visitor and session identity.
 *
 * LOAD-BEARING BEYOND ANALYTICS. `getVisitorId()` and `getSessionId()` are not only
 * used by the SDK — they are read by `lib/auth/authedFetch.ts` (the X-MM-Session-ID
 * header on every API call), by `lib/auth/AuthProvider.tsx` (`fetchUsage`), by
 * `lib/studio/studioBackend.ts`, and by the presign bodies in the upload hooks. Both
 * must therefore stay SYNCHRONOUS and must always return a usable string.
 *
 * That is why this module replaced `lib/indexedIdentity.ts` rather than wrapping it:
 * the old module's "sync" getters kicked off an async IndexedDB write on every call
 * and could return an ID that a concurrent IndexedDB read would later disagree with.
 * localStorage is synchronous, has no such race, and is the right store for a single
 * UUID.
 *
 * CONSENT DOES NOT GATE ID EXISTENCE. These IDs are minted regardless of analytics
 * consent because the main API needs them for quota and abuse prevention — a
 * strictly-necessary basis, documented in the privacy policy. What consent gates is
 * whether we CAPTURE EVENTS about them (see consent-bridge.ts). Conflating the two
 * would break rate limiting and free-tier quotas for anyone who declined.
 */

const VISITOR_KEY = 'mm.a.visitor';
const TAB_KEY = 'mm.a.tab';
const OPTOUT_KEY = 'mm.a.optout';

/**
 * Legacy keys, read once and adopted.
 *
 * Continuity of the visitor population is not cosmetic: retention and
 * returning-visitor math are computed per visitor_id, and minting fresh IDs for
 * everyone would make every returning visitor look brand new for the following 13
 * months. So the first load after this deploy inherits the existing UUID.
 */
const LEGACY_USER_KEY = 'mm_user_id';
const LEGACY_VISITOR_KEY = 'mm_visitor_id';
const LEGACY_IDENTITY_DB = 'media-manipulator-identity';

export interface VisitorRecord {
  id: string;
  firstSeenAt: string;
}

/** UUID v4, with a non-crypto fallback for very old browsers. */
export function uuid(): string {
  try {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
    if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
      const bytes = crypto.getRandomValues(new Uint8Array(16));
      bytes[6] = (bytes[6] & 0x0f) | 0x40;
      bytes[8] = (bytes[8] & 0x3f) | 0x80;
      const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
      return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
    }
  } catch {
    // Fall through.
  }
  // Last resort. NOT a valid v4 UUID shape in every case, and the server will
  // reject it per-event — which is the correct outcome for a browser this old,
  // because everything else here is going to fail too.
  return `${Date.now().toString(16)}-${Math.random().toString(16).slice(2, 10)}`;
}

/** True in a browser with usable localStorage. */
function canStore(): boolean {
  try {
    return typeof window !== 'undefined' && !!window.localStorage;
  } catch {
    // Accessing localStorage throws outright in some privacy modes.
    return false;
  }
}

function readJSON<T>(key: string): T | null {
  if (!canStore()) return null;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function writeJSON(key: string, value: unknown): void {
  if (!canStore()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Quota exceeded or storage blocked. The in-memory value below still serves
    // this page load, which is the most we can do.
  }
}

/**
 * In-memory mirror.
 *
 * Two jobs: it makes repeated calls free (authedFetch calls getSessionId on every
 * request), and it keeps identity working for the rest of the page load when
 * localStorage is blocked entirely — a private-mode visitor still gets consistent
 * IDs within their visit.
 */
let cachedVisitor: VisitorRecord | null = null;
let migrated = false;

/**
 * One-time adoption of the legacy identity.
 *
 * Also deletes the old IndexedDB database, best-effort. Not for tidiness: leaving
 * a `media-manipulator-identity` store behind means a persistent identifier we no
 * longer read, which is exactly the kind of thing a privacy review flags and which
 * we could not honestly account for in the data inventory.
 */
function migrateLegacyIdentity(): string | null {
  if (migrated) return null;
  migrated = true;
  if (!canStore()) return null;

  let adopted: string | null = null;
  try {
    adopted =
      window.localStorage.getItem(LEGACY_USER_KEY) ||
      window.localStorage.getItem(LEGACY_VISITOR_KEY);
  } catch {
    adopted = null;
  }

  try {
    if (typeof indexedDB !== 'undefined' && typeof indexedDB.deleteDatabase === 'function') {
      indexedDB.deleteDatabase(LEGACY_IDENTITY_DB);
    }
  } catch {
    // Deletion is best-effort; a blocked delete is not worth surfacing.
  }

  return adopted;
}

/**
 * The visitor's stable ID. Synchronous, always returns a string.
 */
export function getVisitorId(): string {
  if (cachedVisitor) return cachedVisitor.id;

  const stored = readJSON<VisitorRecord>(VISITOR_KEY);
  if (stored && typeof stored.id === 'string' && stored.id) {
    cachedVisitor = { id: stored.id, firstSeenAt: stored.firstSeenAt || new Date().toISOString() };
    // Still run the migration on the first call so the legacy IndexedDB store is
    // cleaned up even for visitors who already have the new key.
    migrateLegacyIdentity();
    return cachedVisitor.id;
  }

  const adopted = migrateLegacyIdentity();
  cachedVisitor = {
    id: adopted || uuid(),
    firstSeenAt: new Date().toISOString(),
  };
  writeJSON(VISITOR_KEY, cachedVisitor);
  return cachedVisitor.id;
}

/** The visitor record, including when we first saw them. */
export function getVisitorRecord(): VisitorRecord {
  getVisitorId();
  return cachedVisitor as VisitorRecord;
}

/**
 * A per-tab ID, used to namespace this tab's durable outbox.
 *
 * sessionStorage rather than localStorage, precisely because sessionStorage is
 * per-tab: that is what makes "whose outbox is this?" answerable, and what lets a
 * surviving tab recognise a crashed tab's leftovers as orphaned (see queue.ts).
 */
let cachedTabId: string | null = null;

export function getTabId(): string {
  if (cachedTabId) return cachedTabId;
  if (typeof window === 'undefined') return 'ssr';
  try {
    const existing = window.sessionStorage.getItem(TAB_KEY);
    if (existing) {
      cachedTabId = existing;
      return existing;
    }
    const fresh = uuid();
    window.sessionStorage.setItem(TAB_KEY, fresh);
    cachedTabId = fresh;
    return fresh;
  } catch {
    // No sessionStorage: an in-memory ID still works for this page load, it just
    // will not be recognised as orphaned later. Acceptable — storage is blocked,
    // so there is no outbox to orphan.
    cachedTabId = uuid();
    return cachedTabId;
  }
}

/**
 * Self-exclusion flag. Set `localStorage['mm.a.optout'] = '1'` in a browser console
 * to keep your own traffic out of aggregates.
 *
 * The events are still sent and stored, flagged `is_self=true` server-side, rather
 * than dropped. That way "is my instrumentation working?" stays answerable from the
 * database — which is the question you are asking while you have this flag set.
 */
export function isSelfExcluded(): boolean {
  if (!canStore()) return false;
  try {
    return window.localStorage.getItem(OPTOUT_KEY) === '1';
  } catch {
    return false;
  }
}

/** For tests and for a hard reset from the preferences centre. */
export function resetIdentityCacheForTests(): void {
  cachedVisitor = null;
  cachedTabId = null;
  migrated = false;
}
