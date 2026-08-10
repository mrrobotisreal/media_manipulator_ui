/**
 * Session continuity, shared across tabs.
 *
 * WHY THE CLIENT OWNS THIS. Only the browser can see that a visitor has three tabs
 * open on the site and is actively using one of them. A server-side sessionizer
 * looking at request timing would split that into three sessions, or merge two
 * genuinely separate visits. So the client mints `session_id` and decides when a
 * session rotates; the SERVER decides when a session ENDS (a closed browser never
 * tells us anything again — see `internal/sessionizer` in the analytics repo).
 *
 * CROSS-TAB COHERENCE has three mechanisms, and each covers a case the others miss:
 *
 *   1. localStorage is the shared source of truth. Every tab reads the same record.
 *   2. `BroadcastChannel('mm-analytics')` announces a rotation immediately, so only
 *      the rotating tab emits `session_start` and the others adopt the new ID
 *      silently. Without this, five idle tabs waking up together would emit five
 *      session_start events for one session.
 *   3. The `storage` event is the fallback for browsers without BroadcastChannel and
 *      for the case where a tab was suspended through a rotation.
 *
 * THE RACE, and why last-writer-wins is acceptable: two tabs can decide to rotate at
 * the same instant and write different UUIDs. The loser's write is overwritten and
 * both tabs converge on the winner's ID within one storage event. The cost is at
 * most one extra `session_start` event for a session that then behaves correctly —
 * versus the cost of a lock, which would be real complexity for a cosmetic gain.
 * The server's dedupe cannot help here (the IDs genuinely differ), so this is a
 * deliberate accepted imprecision rather than an oversight.
 */

import { stripLocalePrefix } from '@/i18n/locales';

import { uuid } from './identity';

const SESSION_KEY = 'mm.a.session';
const CHANNEL_NAME = 'mm-analytics';

/**
 * Legacy sessionStorage key, still mirrored.
 *
 * `lib/auth/authedFetch.ts`, the presign bodies, and `lib/studio/studioBackend.ts`
 * all read the session ID through this module now, so nothing depends on the raw key
 * any more. It is written anyway for one release so that a mid-deploy page (old
 * bundle in one tab, new bundle in another) does not produce two different session
 * IDs against the same API quota bucket.
 *
 * TODO(Part 2): remove this mirror once the authedFetch/presign migration has been
 * stable in production for a release.
 */
const LEGACY_SESSION_KEY = 'mm_session_id';

/** 30 minutes of inactivity ends a session. Matches SESSION_IDLE_MINUTES server-side. */
export const SESSION_IDLE_MS = 30 * 60 * 1000;

/** Activity writes are throttled to one per 5s — a scroll must not hammer localStorage. */
const ACTIVITY_THROTTLE_MS = 5_000;

export interface SessionUTM {
  source?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
}

export interface SessionRecord {
  id: string;
  startedAt: number;
  lastActivityAt: number;
  entryPathname: string;
  referrer: string;
  utm: SessionUTM;
}

type SessionStartListener = (session: SessionRecord) => void;

const startListeners = new Set<SessionStartListener>();

let cached: SessionRecord | null = null;
let lastPersistedActivity = 0;
let channel: BroadcastChannel | null = null;
let channelWired = false;

function canStore(): boolean {
  try {
    return typeof window !== 'undefined' && !!window.localStorage;
  } catch {
    return false;
  }
}

function readStored(): SessionRecord | null {
  if (!canStore()) return null;
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<SessionRecord>;
    if (!parsed || typeof parsed.id !== 'string' || !parsed.id) return null;
    if (typeof parsed.startedAt !== 'number' || typeof parsed.lastActivityAt !== 'number') {
      return null;
    }
    return {
      id: parsed.id,
      startedAt: parsed.startedAt,
      lastActivityAt: parsed.lastActivityAt,
      entryPathname: typeof parsed.entryPathname === 'string' ? parsed.entryPathname : '',
      referrer: typeof parsed.referrer === 'string' ? parsed.referrer : '',
      utm: (parsed.utm as SessionUTM) || {},
    };
  } catch {
    return null;
  }
}

function persist(record: SessionRecord): void {
  cached = record;
  if (!canStore()) return;
  try {
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(record));
    // Mirror for the mid-deploy case. See LEGACY_SESSION_KEY.
    window.sessionStorage.setItem(LEGACY_SESSION_KEY, record.id);
  } catch {
    // Blocked storage: the in-memory record still serves this page load.
  }
}

/** Read UTM parameters from the current URL. */
function currentUTM(): SessionUTM {
  if (typeof window === 'undefined') return {};
  try {
    const params = new URLSearchParams(window.location.search);
    const utm: SessionUTM = {};
    const source = params.get('utm_source');
    const medium = params.get('utm_medium');
    const campaign = params.get('utm_campaign');
    const term = params.get('utm_term');
    const content = params.get('utm_content');
    if (source) utm.source = source;
    if (medium) utm.medium = medium;
    if (campaign) utm.campaign = campaign;
    if (term) utm.term = term;
    if (content) utm.content = content;
    return utm;
  } catch {
    return {};
  }
}

function newSession(now: number): SessionRecord {
  return {
    id: uuid(),
    startedAt: now,
    lastActivityAt: now,
    // Locale-neutral, matching buildBatchContext's `pathname`: which page a
    // session entered on should not depend on which locale it entered in.
    entryPathname:
      typeof window !== 'undefined' ? stripLocalePrefix(window.location.pathname) : '',
    referrer: typeof document !== 'undefined' ? document.referrer || '' : '',
    utm: currentUTM(),
  };
}

/** Set up cross-tab listeners. Idempotent; called lazily on first session access. */
function wireCrossTab(): void {
  if (channelWired || typeof window === 'undefined') return;
  channelWired = true;

  try {
    if (typeof BroadcastChannel === 'function') {
      channel = new BroadcastChannel(CHANNEL_NAME);
      channel.onmessage = (event: MessageEvent) => {
        const data = event.data as { type?: string; session?: SessionRecord } | null;
        if (!data || data.type !== 'session_rotated' || !data.session) return;
        // Adopt SILENTLY. The rotating tab already emitted session_start; a second
        // emission here would double-count the session.
        cached = data.session;
      };
    }
  } catch {
    // BroadcastChannel unavailable or blocked; the storage listener below covers it.
  }

  try {
    window.addEventListener('storage', (event) => {
      if (event.key !== SESSION_KEY) return;
      const fresh = readStored();
      if (fresh) cached = fresh;
    });
  } catch {
    // Nothing more to try.
  }
}

function announceRotation(record: SessionRecord): void {
  try {
    channel?.postMessage({ type: 'session_rotated', session: record });
  } catch {
    // A closed channel throws; harmless.
  }
}

/**
 * Return the current session, rotating it when idle for longer than SESSION_IDLE_MS.
 *
 * `emitStart` is invoked ONLY by the tab that performs the rotation, and only when a
 * listener is registered — which is what keeps `session_start` to exactly one event
 * per session.
 */
function resolveSession(now: number): { session: SessionRecord; rotated: boolean } {
  wireCrossTab();

  const stored = cached && cached.id ? cached : readStored();
  if (!stored) {
    const created = newSession(now);
    persist(created);
    announceRotation(created);
    return { session: created, rotated: true };
  }

  if (now - stored.lastActivityAt > SESSION_IDLE_MS) {
    const rotated = newSession(now);
    persist(rotated);
    announceRotation(rotated);
    return { session: rotated, rotated: true };
  }

  cached = stored;
  return { session: stored, rotated: false };
}

/**
 * The current session ID. Synchronous and cheap enough to call per API request.
 *
 * Notifies session-start listeners on rotation, in a microtask so that a caller in
 * the middle of a render (authedFetch during a React event handler, say) never has
 * an event dispatched synchronously inside its own call stack.
 */
export function getSessionId(): string {
  if (typeof window === 'undefined') {
    // SSR: return a throwaway. Nothing server-rendered should be attributing an
    // event to a session, and returning "" would put an empty header on a request.
    return '00000000-0000-4000-8000-000000000000';
  }
  const now = Date.now();
  const { session, rotated } = resolveSession(now);
  if (rotated && startListeners.size > 0) {
    const snapshot = session;
    queueMicrotask(() => {
      startListeners.forEach((listener) => {
        try {
          listener(snapshot);
        } catch {
          // A listener must never break identity resolution.
        }
      });
    });
  }
  return session.id;
}

/** The full session record. */
export function getSessionRecord(): SessionRecord {
  if (typeof window === 'undefined') {
    const now = Date.now();
    return {
      id: '00000000-0000-4000-8000-000000000000',
      startedAt: now,
      lastActivityAt: now,
      entryPathname: '',
      referrer: '',
      utm: {},
    };
  }
  getSessionId();
  return cached as SessionRecord;
}

/**
 * Mark activity. Throttled to one localStorage write per ACTIVITY_THROTTLE_MS.
 *
 * The throttle is what makes it safe to call from a scroll handler or a 1-second
 * engagement tick: the in-memory record is always current, and only the persisted
 * copy lags by up to five seconds — which is irrelevant against a 30-minute timeout.
 */
export function touchSession(): void {
  if (typeof window === 'undefined') return;
  const now = Date.now();
  const { session } = resolveSession(now);
  session.lastActivityAt = now;
  cached = session;
  if (now - lastPersistedActivity < ACTIVITY_THROTTLE_MS) return;
  lastPersistedActivity = now;
  persist(session);
}

/**
 * Subscribe to session rotation. The callback fires only in the tab that rotated.
 * Returns an unsubscribe function.
 */
export function onSessionStart(listener: SessionStartListener): () => void {
  startListeners.add(listener);
  return () => {
    startListeners.delete(listener);
  };
}

/** For tests. */
export function resetSessionCacheForTests(): void {
  cached = null;
  lastPersistedActivity = 0;
  channelWired = false;
  try {
    channel?.close();
  } catch {
    // ignore
  }
  channel = null;
  startListeners.clear();
}
