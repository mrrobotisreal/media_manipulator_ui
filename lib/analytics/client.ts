/**
 * AnalyticsClient — the orchestrator.
 *
 * Owns the queue, the transport, the flush schedule, identity, context, and the consent
 * gate. Everything else in `lib/analytics/*` is a component this wires together.
 *
 * THE ONE INVARIANT THAT OVERRIDES EVERYTHING ELSE: **analytics must never throw into
 * React.** A throw inside an effect propagates past React's reconciler and unmounts the
 * tree — the page goes blank. That is not hypothetical here: the old code did exactly
 * that when `mixpanel.track()` was called before `init()`, from the conversion-complete
 * handler, and it blanked the app mid-conversion. So every public method on this class
 * is wrapped, and every promise is `.catch()`-ed. The cost is that a genuine SDK bug is
 * invisible in production; the alternative is a broken product.
 */

import {
  EVENT_PRIORITY,
  EVENTS,
  type EventName,
  type PropsFor,
  type Tier,
  type TrackOptions,
  type EventProperties,
  type PropertyValue,
} from './events';
import {
  buildBatchContext,
  buildEventContext,
  getContextOverrides,
  invalidateDeviceCache,
  setContext,
  type ContextPatch,
} from './context';
import {
  analyticsConsent,
  bufferPreConsent,
  canCapture,
  canPersist,
  initConsentGate,
  sendAnonymousCount,
} from './consent-bridge';
import { getVisitorId, isSelfExcluded, uuid } from './identity';
import { EventQueue, type QueuedEvent, type WireContext } from './queue';
import { getSessionId, onSessionStart, touchSession } from './session';
import {
  FLUSH_AT_QUEUE_SIZE,
  FLUSH_INTERVAL_MS,
  HIGH_PRIORITY_DEBOUNCE_MS,
  MAX_BATCH_BYTES,
  MAX_BATCH_EVENTS,
  Transport,
} from './transport';
import { analyticsBaseUrl, analyticsWriteKey } from './baseUrl';

/** Bumped when the wire shape or the flush semantics change. */
export const SDK_VERSION = '1.0.0';

/**
 * App build identity.
 *
 * Vercel exposes the deployment's git SHA as `NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA`, which
 * makes "did this error start with the deploy at 14:20?" answerable directly from the
 * data. Falls back to 'dev' locally.
 */
function appVersion(): string {
  const sha = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA;
  if (sha) return sha.slice(0, 12);
  return process.env.NODE_ENV === 'production' ? 'production' : 'dev';
}

export interface IdentifyTraits {
  tier?: Tier;
}

export class AnalyticsClient {
  private queue = new EventQueue();
  private transport: Transport;
  private started = false;
  private teardown: Array<() => void> = [];

  private intervalTimer: ReturnType<typeof setInterval> | null = null;
  private debounceTimer: ReturnType<typeof setTimeout> | null = null;

  private personHint: { firebase_uid: string; tier?: string } | null = null;

  constructor() {
    this.transport = new Transport(
      {
        baseUrl: analyticsBaseUrl(),
        writeKey: analyticsWriteKey(),
        sdkVersion: SDK_VERSION,
        appVersion: appVersion(),
      },
      {
        onRetry: (events) => this.queue.requeue(events),
        onDropped: () => {
          // Nothing to do. A non-retryable rejection means the batch could never land;
          // retrying it would starve everything behind it. The server has already
          // counted it, which is where the visibility lives.
        },
      },
    );
  }

  /**
   * Start the client. Idempotent.
   *
   * Called once from AnalyticsProvider. Returns a stop function so the provider's effect
   * cleanup can tear listeners down in development, where StrictMode mounts twice.
   */
  start(): () => void {
    if (this.started) return () => undefined;
    if (typeof window === 'undefined') return () => undefined;
    this.started = true;

    try {
      // ORDER MATTERS, twice over.
      //
      // Recovery runs FIRST, before the consent gate is wired and before the heartbeat
      // starts. Before the heartbeat, because our own fresh heartbeat would make this
      // tab's key look alive to our own orphan scan. Before the gate, because the gate
      // fires its callbacks synchronously for an already-decided state — so a denial must
      // be able to discard what recovery just loaded, and a grant must be able to flush it.
      this.queue.adoptOrphans();
      this.queue.restoreOwn();
      this.queue.setPersistenceEnabled(canPersist());
      this.teardown.push(this.queue.startHeartbeat());

      this.teardown.push(
        initConsentGate({
          onGrant: (buffered) => {
            // Persistence becomes legal, and the pre-consent buffer drains through the
            // normal pipeline WITH ITS ORIGINAL TIMESTAMPS — so the visitor's first page
            // view is dated when it happened, not when they clicked Accept.
            this.queue.setPersistenceEnabled(true);
            if (buffered.length > 0) this.queue.enqueueMany(buffered);
            if (this.queue.size() > 0) this.scheduleFlush(0);
          },
          onDeny: () => {
            // Everything goes: the in-memory queue, and the persisted outbox that a
            // previous page load may have left behind. A visitor who has just declined
            // must not have pre-decision events sent afterwards.
            this.queue.setPersistenceEnabled(false);
            this.queue.discardAll();
          },
        }),
      );

      // `session_start` is emitted only by the tab that actually rotated the session,
      // which is what keeps it to one event per session across many tabs.
      this.teardown.push(
        onSessionStart((session) => {
          this.track(EVENTS.SESSION_START, {
            entry_pathname: session.entryPathname || undefined,
          });
        }),
      );

      this.wireFlushTriggers();
      // Drain anything adopted from a crashed tab straight away — those events are
      // already older than they should be.
      if (this.queue.size() > 0) this.scheduleFlush(0);
    } catch {
      // A failure to start must leave a client whose track() calls are harmless no-ops
      // rather than a half-initialized one that throws on first use.
    }

    return () => this.stop();
  }

  private stop(): void {
    this.teardown.forEach((fn) => {
      try {
        fn();
      } catch {
        // ignore
      }
    });
    this.teardown = [];
    if (this.intervalTimer) clearInterval(this.intervalTimer);
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
    this.intervalTimer = null;
    this.debounceTimer = null;
    this.started = false;
  }

  private wireFlushTriggers(): void {
    this.intervalTimer = setInterval(() => this.flush(), FLUSH_INTERVAL_MS);

    const onHidden = () => {
      if (document.visibilityState === 'hidden') this.flushSync();
    };
    const onPageHide = () => this.flushSync();
    const onFreeze = () => this.flushSync();
    const onOnline = () => this.scheduleFlush(0);

    document.addEventListener('visibilitychange', onHidden);
    window.addEventListener('pagehide', onPageHide);
    // bfcache eviction. Non-standard but present in Chromium, and it is the only
    // notification a page gets before being frozen in some navigation paths.
    document.addEventListener('freeze', onFreeze);
    window.addEventListener('online', onOnline);

    const onResize = () => invalidateDeviceCache();
    window.addEventListener('resize', onResize, { passive: true });

    this.teardown.push(() => {
      document.removeEventListener('visibilitychange', onHidden);
      window.removeEventListener('pagehide', onPageHide);
      document.removeEventListener('freeze', onFreeze);
      window.removeEventListener('online', onOnline);
      window.removeEventListener('resize', onResize);
    });
  }

  /* -------------------------------------------------------------------------
   * Public API
   * ---------------------------------------------------------------------- */

  /**
   * Record an event.
   *
   * Typed: the props type is derived from the event name, so a `job_completed` without a
   * `job_id` is a compile error rather than a hole in the data discovered three months
   * later.
   */
  track<E extends EventName>(name: E, props?: PropsFor<E>, options?: TrackOptions): void {
    try {
      this.trackUnsafe(name, props as EventProperties | undefined, options);
    } catch {
      // See the class comment. Never throw into React.
    }
  }

  private trackUnsafe(
    name: EventName,
    props: EventProperties | undefined,
    options?: TrackOptions,
  ): void {
    if (typeof window === 'undefined') return;

    const consent = analyticsConsent();

    // DENIED: no event at all, only the identifier-free page count. Deliberately restricted
    // to page views — a count of "someone ran a job" with no identifiers is not a useful
    // number, and sending one per event would be a lot of requests for nothing.
    if (consent === 'denied') {
      if (name === 'page_view') sendAnonymousCount(window.location.pathname);
      return;
    }

    // Activity for the session idle timer. Cheap (throttled to one write per 5s) and it
    // has to happen on real interaction rather than on a timer, or a visitor reading a
    // long tutorial would be idled out mid-read.
    touchSession();

    const priority = EVENT_PRIORITY[name] ?? 2;
    const event: QueuedEvent = {
      insert_id: uuid(),
      event_name: name,
      event_ts: new Date().toISOString(),
      visitor_id: getVisitorId(),
      session_id: getSessionId(),
      properties: sanitizeProps(props),
      _priority: priority,
      _enqueuedAt: Date.now(),
    };

    if (this.personHint) event.person_hint = this.personHint;

    const context = buildEventContext({
      tool_slug: options?.tool_slug ?? undefined,
      media_kind: options?.media_kind,
      job_id: options?.job_id,
      feature: options?.feature,
      page_type: options?.page_type,
    });
    if (context) event.context = context;

    // UNSET: the visitor has not answered yet. Hold the event in MEMORY ONLY — no queue,
    // because the queue persists, and writing event data to localStorage before a decision
    // is itself processing. On grant the buffer drains with these original timestamps; on
    // denial it is discarded. This is what saves the first page view and the first tool
    // interaction of every visitor who goes on to accept, which a naive gate throws away.
    if (consent === 'unset') {
      bufferPreConsent(event);
      return;
    }

    this.queue.enqueue(event);
    this.notifySubscribers(name, event);

    // Priority 0 goes now; priority 1 gets a short debounce so a burst coalesces; the
    // rest ride the interval or the queue-size trigger.
    if (priority === 0) {
      this.scheduleFlush(0);
    } else if (priority === 1) {
      this.scheduleFlush(HIGH_PRIORITY_DEBOUNCE_MS);
    } else if (this.queue.size() >= FLUSH_AT_QUEUE_SIZE) {
      this.scheduleFlush(0);
    }
  }

  /** Associate the current visitor with a signed-in person. */
  identify(firebaseUid: string, traits?: IdentifyTraits): void {
    try {
      if (!firebaseUid) return;
      this.personHint = { firebase_uid: firebaseUid, tier: traits?.tier };
      if (traits?.tier) setContext({ tier: traits.tier });
    } catch {
      // ignore
    }
  }

  /**
   * Clear the person association on sign-out.
   *
   * The VISITOR persists. Rotating the visitor id here would make a sign-out look like a
   * brand-new device and destroy the return-visitor signal for anyone who signs out. The
   * server-side person↔visitor link also persists, which is what makes "what did this
   * person do before and after" answerable.
   */
  reset(): void {
    try {
      this.personHint = null;
      setContext({ tier: 'anonymous' });
    } catch {
      // ignore
    }
  }

  setContext(patch: ContextPatch): void {
    try {
      setContext(patch);
    } catch {
      // ignore
    }
  }

  getContext(): ContextPatch {
    try {
      return getContextOverrides();
    } catch {
      return {};
    }
  }

  /** Schedule a flush. `delay === 0` means "as soon as the current task yields". */
  scheduleFlush(delay: number): void {
    try {
      if (delay <= 0) {
        if (this.debounceTimer) {
          clearTimeout(this.debounceTimer);
          this.debounceTimer = null;
        }
        // A microtask rather than a synchronous call: track() is frequently invoked from
        // a React event handler, and starting a fetch inside that call stack delays the
        // handler's own work.
        queueMicrotask(() => void this.flush());
        return;
      }
      if (this.debounceTimer) return;
      this.debounceTimer = setTimeout(() => {
        this.debounceTimer = null;
        void this.flush();
      }, delay);
    } catch {
      // ignore
    }
  }

  /** Flush the queue. Never throws; the promise never rejects. */
  async flush(): Promise<void> {
    try {
      if (!canCapture()) return;
      this.queue.dropStale();
      if (this.queue.size() === 0) return;
      const batch = this.queue.take(MAX_BATCH_EVENTS, MAX_BATCH_BYTES);
      if (batch.length === 0) return;
      await this.transport.send(batch);
      // More may have accumulated (or been returned by a retry) while that was in
      // flight; keep going until the queue is drained or a send fails.
      if (this.queue.size() > 0) this.scheduleFlush(0);
    } catch {
      // ignore
    }
  }

  /**
   * Synchronous best-effort flush for page teardown.
   *
   * No awaiting, no retry: at `pagehide` there is no opportunity for either. Everything
   * queued goes out in beacon-sized chunks, and anything the beacon refuses falls back
   * to a keepalive fetch. Whatever fails is still in the persisted outbox, and the next
   * page load adopts it.
   */
  flushSync(): void {
    try {
      if (!canCapture()) return;
      this.queue.dropStale();
      while (this.queue.size() > 0) {
        const batch = this.queue.take(MAX_BATCH_EVENTS, MAX_BATCH_BYTES);
        if (batch.length === 0) break;
        if (!this.transport.sendBeacon(batch)) {
          this.transport.sendKeepalive(batch);
        }
      }
    } catch {
      // ignore
    }
  }

  /** Queue depth, for the dev-mode inspector. */
  queueSize(): number {
    return this.queue.size();
  }

  /**
   * Drop everything queued, in memory and in this tab's persisted outbox.
   *
   * Exists for exactly one caller: `forgetIdentity()` (lib/analytics/forget.ts),
   * after a successful DSR deletion. Events queued under the old visitor id must
   * not be delivered afterwards — the server would re-create the visitor row the
   * user just erased.
   */
  discardQueuedEvents(): void {
    try {
      this.queue.discardAll();
    } catch {
      // Never throw into React.
    }
  }

  /** Whether this visitor has excluded themselves from aggregates. */
  isSelfExcluded(): boolean {
    try {
      return isSelfExcluded();
    } catch {
      return false;
    }
  }

  /** The batch-level context, exposed for the dev inspector. */
  debugContext(): WireContext {
    try {
      return buildBatchContext();
    } catch {
      return {};
    }
  }

  /* -------------------------------------------------------------------------
   * Subscribers
   *
   * The GA4 bridge is the only consumer: it forwards three event names and ignores the
   * rest. A subscription rather than a direct call from track() keeps GA4 entirely out
   * of the core, so deleting it later is deleting one file.
   * ---------------------------------------------------------------------- */

  private subscribers = new Set<(name: EventName, event: QueuedEvent) => void>();

  subscribe(listener: (name: EventName, event: QueuedEvent) => void): () => void {
    this.subscribers.add(listener);
    return () => {
      this.subscribers.delete(listener);
    };
  }

  private notifySubscribers(name: EventName, event: QueuedEvent): void {
    this.subscribers.forEach((listener) => {
      try {
        listener(name, event);
      } catch {
        // A broken subscriber must not affect first-party capture.
      }
    });
  }
}

/**
 * Drop `undefined` values so they do not serialize as explicit nulls.
 *
 * `{ duration_ms: undefined }` becomes `{}` rather than `{"duration_ms":null}`. That
 * matters on the server: a null in jsonb is a stored value that a query has to account
 * for, whereas an absent key is simply absent.
 */
function sanitizeProps(props: EventProperties | undefined): EventProperties | undefined {
  if (!props) return undefined;
  const out: EventProperties = {};
  let count = 0;
  for (const [key, value] of Object.entries(props)) {
    if (value === undefined) continue;
    out[key] = value as PropertyValue;
    count += 1;
  }
  return count > 0 ? out : undefined;
}

/** The process-wide singleton. */
export const analytics = new AnalyticsClient();
