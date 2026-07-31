/**
 * The priority queue and its durable outbox.
 *
 * THE PROBLEM THIS SOLVES. The most valuable events in this product happen at the
 * worst possible moment to make a network request: `download_completed` fires as the
 * user is leaving, `job_completed` fires on a page they close a second later, and a
 * mid-conversion tab crash takes everything in flight with it. An in-memory-only
 * queue loses precisely the events that matter most.
 *
 * So the queue is mirrored to localStorage on every mutation, and on init the SDK
 * scans for outboxes belonging to tabs that are no longer alive and adopts them.
 *
 * WHY DOUBLE-ADOPTION IS SAFE. Two tabs can decide the same orphaned outbox is theirs
 * and both deliver it. That is fine and is the reason `insert_id` is minted at
 * enqueue time rather than at send time: the server dedupes on it (Redis SET NX, plus
 * a per-partition unique index as a backstop), so the second delivery is discarded.
 * Designing a lock to prevent it would be real complexity to avoid a case the
 * pipeline already handles for free.
 *
 * ORDERING is (priority, enqueue time). Priority 0 events are flushed immediately and
 * are never evicted; priority 3 is the first thing shed under pressure. That is the
 * roadmap's prioritized-collection principle made mechanical: collect as much as
 * possible, but never at the expense of the most valuable data.
 */

import { getTabId } from './identity';
import type { EventProperties, Priority } from './events';

/** Wire shape of the per-event context block. */
export interface WireContext {
  url?: string;
  pathname?: string;
  page_type?: string;
  referrer?: string;
  utm?: {
    source?: string;
    medium?: string;
    campaign?: string;
    term?: string;
    content?: string;
  };
  device_type?: string;
  browser?: string;
  browser_version?: string;
  os?: string;
  viewport_width?: number;
  viewport_height?: number;
  locale?: string;
  timezone?: string;
  connection_type?: string;
  tier?: string;
  tool_slug?: string;
  media_kind?: string;
  job_id?: string;
  feature?: string;
}

/** One queued event. Fields prefixed `_` are local bookkeeping, stripped before send. */
export interface QueuedEvent {
  insert_id: string;
  event_name: string;
  event_ts: string;
  visitor_id: string;
  session_id: string;
  person_hint?: { firebase_uid: string; tier?: string };
  context?: WireContext;
  properties?: EventProperties;

  /** Not sent. Used for flush ordering and staleness. */
  _priority: Priority;
  _enqueuedAt: number;
}

const OUTBOX_PREFIX = 'mm.a.outbox.v1.';
const TAB_REGISTRY_KEY = 'mm.a.tabs';

/** Caps. 500 events is far more than any realistic backlog; 800 KB keeps us well
 *  clear of the ~5 MB localStorage budget shared with the rest of the app. */
export const MAX_QUEUED_EVENTS = 500;
export const MAX_OUTBOX_BYTES = 800 * 1024;

/** A tab that has not written a heartbeat in 30s is presumed gone. Heartbeat is 5s,
 *  so this tolerates five missed beats — enough to survive a long GC pause or a
 *  backgrounded tab being throttled, without waiting so long that a crashed tab's
 *  events sit undelivered for minutes. */
const HEARTBEAT_INTERVAL_MS = 5_000;
const TAB_STALE_MS = 30_000;

/** Events older than this are dropped on adoption. Stale analytics is noise: a
 *  page_view from three days ago tells us nothing we want in a funnel. */
const MAX_EVENT_AGE_MS = 24 * 60 * 60 * 1000;

function canStore(): boolean {
  try {
    return typeof window !== 'undefined' && !!window.localStorage;
  } catch {
    return false;
  }
}

export interface QueueStats {
  evicted: number;
  adopted: number;
  droppedStale: number;
}

export class EventQueue {
  private events: QueuedEvent[] = [];
  private persistenceEnabled = true;
  private heartbeatTimer: ReturnType<typeof setInterval> | null = null;
  readonly stats: QueueStats = { evicted: 0, adopted: 0, droppedStale: 0 };

  /**
   * Persistence is disabled while consent is `unset`.
   *
   * Not a performance switch — a legal one. In an opt-in region, writing event data
   * to localStorage before the visitor has answered IS processing, whatever we
   * intend to do with it afterwards. The pre-consent buffer in consent-bridge.ts is
   * memory-only for the same reason.
   */
  setPersistenceEnabled(enabled: boolean): void {
    this.persistenceEnabled = enabled;
    if (enabled) this.persist();
    // NOTE: disabling does NOT erase what is already on disk. That distinction is
    // load-bearing. The SDK starts before consent has resolved, so at that moment the
    // state is `unset` and persistence is off — if disabling also cleared storage, a
    // returning visitor who granted consent last week would have the outbox from their
    // previous page load destroyed on every single load, before we had even read their
    // stored decision. Erasing is a separate, explicit act: see discardAll(), which the
    // consent gate calls only on an actual DENIAL.
  }

  /**
   * Drop everything, in memory and on disk. Called when consent is denied.
   *
   * This is the only path that destroys queued events, and it is the correct one: a
   * visitor who has just declined analytics should not have events from before their
   * decision sent afterwards.
   */
  discardAll(): void {
    this.events = [];
    this.clearPersisted();
  }

  size(): number {
    return this.events.length;
  }

  /** Highest priority (lowest number) currently queued, or null when empty. */
  topPriority(): Priority | null {
    if (this.events.length === 0) return null;
    let top: Priority = 3;
    for (const event of this.events) {
      if (event._priority < top) top = event._priority;
    }
    return top;
  }

  enqueue(event: QueuedEvent): void {
    this.events.push(event);
    this.sort();
    this.evictIfNeeded();
    this.persist();
  }

  enqueueMany(events: QueuedEvent[]): void {
    if (events.length === 0) return;
    this.events.push(...events);
    this.sort();
    this.evictIfNeeded();
    this.persist();
  }

  /**
   * Remove and return up to `maxEvents` events, bounded by `maxBytes` of serialized
   * payload.
   *
   * The byte bound exists because `fetch(..., { keepalive: true })` has a ~64 KB body
   * quota in Chromium and Safari, and exceeding it makes the request fail outright
   * rather than degrade. We take the highest-priority events first, so a batch that
   * hits the byte ceiling leaves the least important events behind.
   */
  take(maxEvents: number, maxBytes: number): QueuedEvent[] {
    if (this.events.length === 0) return [];
    const batch: QueuedEvent[] = [];
    let bytes = 0;
    let index = 0;

    while (index < this.events.length && batch.length < maxEvents) {
      const candidate = this.events[index];
      const size = approximateSize(candidate);
      // Always allow at least one event through, even an oversized one: the server
      // will strip its properties and keep the skeleton, which beats an event that
      // can never leave the queue and blocks everything behind it forever.
      if (batch.length > 0 && bytes + size > maxBytes) break;
      batch.push(candidate);
      bytes += size;
      index += 1;
    }

    this.events = this.events.slice(batch.length);
    this.persist();
    return batch;
  }

  /** Return a failed batch to the queue, preserving priority ordering. */
  requeue(events: QueuedEvent[]): void {
    if (events.length === 0) return;
    this.events.push(...events);
    this.sort();
    this.evictIfNeeded();
    this.persist();
  }

  /** Drop events past MAX_EVENT_AGE_MS. Called before each flush attempt. */
  dropStale(now = Date.now()): number {
    const before = this.events.length;
    this.events = this.events.filter((event) => now - event._enqueuedAt <= MAX_EVENT_AGE_MS);
    const dropped = before - this.events.length;
    if (dropped > 0) {
      this.stats.droppedStale += dropped;
      this.persist();
    }
    return dropped;
  }

  /** Sort by (priority asc, enqueue time asc). */
  private sort(): void {
    this.events.sort((a, b) => {
      if (a._priority !== b._priority) return a._priority - b._priority;
      return a._enqueuedAt - b._enqueuedAt;
    });
  }

  /**
   * Enforce the caps by evicting from the END of the sorted array — which, given the
   * sort order, is exactly "lowest priority, and among equals the newest".
   *
   * Priority 0 is never evicted while anything else remains. If the queue somehow
   * consists entirely of priority-0 events and is still over the cap, we do evict —
   * an unbounded queue would eventually break localStorage for the whole app, which
   * would lose everything rather than the tail.
   */
  private evictIfNeeded(): void {
    while (this.events.length > MAX_QUEUED_EVENTS) {
      const removed = this.removeLeastValuable();
      if (!removed) break;
    }

    // Byte cap. Recomputing the total on every eviction is O(n²) in the worst case,
    // but n is bounded at 500 and the loop only runs when we are actually over
    // budget, which is rare.
    let guard = 0;
    while (this.serializedSize() > MAX_OUTBOX_BYTES && this.events.length > 1 && guard < MAX_QUEUED_EVENTS) {
      guard += 1;
      const removed = this.removeLeastValuable();
      if (!removed) break;
    }
  }

  private removeLeastValuable(): boolean {
    if (this.events.length === 0) return false;
    // The array is sorted, so the last element is the least valuable.
    this.events.pop();
    this.stats.evicted += 1;
    return true;
  }

  private serializedSize(): number {
    try {
      return JSON.stringify(this.events).length;
    } catch {
      return 0;
    }
  }

  private outboxKey(): string {
    return OUTBOX_PREFIX + getTabId();
  }

  private persist(): void {
    if (!this.persistenceEnabled || !canStore()) return;
    try {
      if (this.events.length === 0) {
        window.localStorage.removeItem(this.outboxKey());
        return;
      }
      window.localStorage.setItem(this.outboxKey(), JSON.stringify(this.events));
    } catch {
      // Quota exceeded. Shed the least valuable half and try once more rather than
      // silently running without a durable outbox.
      const target = Math.max(1, Math.floor(this.events.length / 2));
      while (this.events.length > target) {
        this.events.pop();
        this.stats.evicted += 1;
      }
      try {
        window.localStorage.setItem(this.outboxKey(), JSON.stringify(this.events));
      } catch {
        // Give up on persistence for this mutation; the in-memory queue still works.
      }
    }
  }

  clearPersisted(): void {
    if (!canStore()) return;
    try {
      window.localStorage.removeItem(this.outboxKey());
    } catch {
      // ignore
    }
  }

  /** Load this tab's own outbox — the page-refresh recovery path. */
  restoreOwn(): number {
    if (!canStore()) return 0;
    try {
      const raw = window.localStorage.getItem(this.outboxKey());
      if (!raw) return 0;
      const parsed = parseOutbox(raw);
      if (parsed.length === 0) return 0;
      this.events.push(...parsed);
      this.sort();
      this.evictIfNeeded();
      return parsed.length;
    } catch {
      return 0;
    }
  }

  /**
   * Adopt outboxes belonging to tabs that are no longer alive.
   *
   * "No longer alive" = absent from the tab registry, or last seen more than
   * TAB_STALE_MS ago. Our own key is skipped (restoreOwn handles it).
   */
  adoptOrphans(now = Date.now()): number {
    if (!canStore()) return 0;
    const registry = readTabRegistry();
    const ownKey = this.outboxKey();
    let adopted = 0;

    let keys: string[] = [];
    try {
      keys = Object.keys(window.localStorage);
    } catch {
      return 0;
    }

    for (const key of keys) {
      if (!key.startsWith(OUTBOX_PREFIX) || key === ownKey) continue;
      const tabId = key.slice(OUTBOX_PREFIX.length);
      const lastSeen = registry[tabId];
      if (typeof lastSeen === 'number' && now - lastSeen < TAB_STALE_MS) {
        // That tab is alive and will deliver its own events.
        continue;
      }

      let raw: string | null = null;
      try {
        raw = window.localStorage.getItem(key);
      } catch {
        continue;
      }
      if (!raw) {
        removeKey(key);
        continue;
      }

      const parsed = parseOutbox(raw);
      const fresh = parsed.filter((event) => now - event._enqueuedAt <= MAX_EVENT_AGE_MS);
      this.stats.droppedStale += parsed.length - fresh.length;

      if (fresh.length > 0) {
        this.events.push(...fresh);
        adopted += fresh.length;
      }
      // Remove the orphan key even when everything in it was stale, so we do not
      // re-scan it forever.
      removeKey(key);
      delete registry[tabId];
    }

    if (adopted > 0) {
      this.sort();
      this.evictIfNeeded();
      this.persist();
      this.stats.adopted += adopted;
    }
    writeTabRegistry(registry);
    return adopted;
  }

  /**
   * Start the tab heartbeat. Returns a stop function.
   *
   * The heartbeat is what makes orphan detection possible: a tab that is running
   * writes its timestamp every 5 seconds, so any outbox whose tab has stopped writing
   * is by definition unattended.
   */
  startHeartbeat(): () => void {
    if (typeof window === 'undefined') return () => undefined;
    const beat = () => {
      const registry = readTabRegistry();
      registry[getTabId()] = Date.now();
      // Opportunistically garbage-collect long-dead tabs so the registry cannot grow
      // without bound across months of use.
      const cutoff = Date.now() - 10 * TAB_STALE_MS;
      for (const [tabId, seen] of Object.entries(registry)) {
        if (typeof seen !== 'number' || seen < cutoff) delete registry[tabId];
      }
      writeTabRegistry(registry);
    };
    beat();
    this.heartbeatTimer = setInterval(beat, HEARTBEAT_INTERVAL_MS);

    const onUnload = () => {
      // Deregister immediately so a surviving tab can adopt our outbox without
      // waiting out TAB_STALE_MS. Best-effort: a hard crash skips this, which is
      // exactly what the staleness window is for.
      const registry = readTabRegistry();
      delete registry[getTabId()];
      writeTabRegistry(registry);
    };
    window.addEventListener('pagehide', onUnload);

    return () => {
      if (this.heartbeatTimer) clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
      window.removeEventListener('pagehide', onUnload);
    };
  }
}

/** Strip local bookkeeping fields for the wire. */
export function toWireEvent(event: QueuedEvent): Record<string, unknown> {
  const { _priority, _enqueuedAt, ...wire } = event;
  void _priority;
  void _enqueuedAt;
  return wire;
}

/**
 * Cheap size estimate. `JSON.stringify().length` per event is accurate enough for
 * batching decisions and much cheaper than serializing the whole batch repeatedly.
 * Falls back to a generous constant so a non-serializable event cannot make the
 * batching loop spin.
 */
function approximateSize(event: QueuedEvent): number {
  try {
    return JSON.stringify(event).length;
  } catch {
    return 2048;
  }
}

function parseOutbox(raw: string): QueuedEvent[] {
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isQueuedEvent);
  } catch {
    return [];
  }
}

/**
 * Validate a recovered event.
 *
 * Recovered data is untrusted: it may have been written by an older bundle with a
 * different shape, or corrupted by a partial write. An event missing its insert_id
 * cannot be deduped and one missing its timestamp cannot be placed in time, so both
 * are dropped rather than sent and rejected.
 */
function isQueuedEvent(value: unknown): value is QueuedEvent {
  if (typeof value !== 'object' || value === null) return false;
  const event = value as Partial<QueuedEvent>;
  return (
    typeof event.insert_id === 'string' &&
    !!event.insert_id &&
    typeof event.event_name === 'string' &&
    !!event.event_name &&
    typeof event.event_ts === 'string' &&
    typeof event.visitor_id === 'string' &&
    typeof event.session_id === 'string' &&
    typeof event._priority === 'number' &&
    typeof event._enqueuedAt === 'number'
  );
}

function readTabRegistry(): Record<string, number> {
  if (!canStore()) return {};
  try {
    const raw = window.localStorage.getItem(TAB_REGISTRY_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) return {};
    return parsed as Record<string, number>;
  } catch {
    return {};
  }
}

function writeTabRegistry(registry: Record<string, number>): void {
  if (!canStore()) return;
  try {
    window.localStorage.setItem(TAB_REGISTRY_KEY, JSON.stringify(registry));
  } catch {
    // ignore
  }
}

function removeKey(key: string): void {
  try {
    window.localStorage.removeItem(key);
  } catch {
    // ignore
  }
}
