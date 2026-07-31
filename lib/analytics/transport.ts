/**
 * Batching, flushing, and retry.
 *
 * FLUSH TRIGGERS, and what each one is for:
 *
 *   priority 0 enqueued  → immediate. A job_completed or download_completed must not
 *                          wait five seconds for a tick that a page close will beat.
 *   priority 1 enqueued  → 2s debounce. Coalesces a burst (tool_viewed +
 *                          file_selected + upload_started arrive within a second of
 *                          each other) into one request.
 *   interval             → 5s, or as soon as 20 events are queued.
 *   visibilitychange     → the tab is being hidden. On mobile this is very often the
 *     / pagehide           last moment we get; `freeze` covers bfcache eviction.
 *   online               → the network came back; drain whatever accumulated.
 *
 * TRANSPORT CHOICE. Normal flushes use `fetch(..., { keepalive: true })`, which
 * survives the document being torn down mid-request. Teardown flushes use
 * `navigator.sendBeacon` with a `text/plain` Blob — text/plain is a CORS-safelisted
 * content type, so the request needs NO preflight. That matters enormously at
 * teardown: a preflight is a second round trip the browser will very likely cancel,
 * and the server accepts text/plain bodies specifically to make this path work.
 *
 * RETRY. 429 (honouring Retry-After), 5xx, and network errors back off exponentially
 * with full jitter from 1s to 60s, up to 5 attempts, after which the batch goes back
 * to the outbox for the next natural flush. 4xx other than 429 is NOT retried: a 400
 * or 401 will fail identically forever, and retrying it would burn the outbox on a
 * batch that can never land.
 */

import { toWireEvent, type QueuedEvent } from './queue';

/** Must not exceed the server's MAX_BATCH_EVENTS. */
export const MAX_BATCH_EVENTS = 100;

/**
 * Body byte ceiling. `keepalive: true` has a ~64 KB quota per Fetch spec, shared
 * across all in-flight keepalive requests; exceeding it rejects the request outright.
 * 60 KB leaves headroom for the envelope and for a second concurrent flush.
 */
export const MAX_BATCH_BYTES = 60 * 1024;

export const FLUSH_INTERVAL_MS = 5_000;
export const HIGH_PRIORITY_DEBOUNCE_MS = 2_000;
export const FLUSH_AT_QUEUE_SIZE = 20;

const MAX_ATTEMPTS = 5;
const BASE_BACKOFF_MS = 1_000;
const MAX_BACKOFF_MS = 60_000;

export interface TransportConfig {
  baseUrl: string;
  writeKey: string;
  sdkVersion: string;
  appVersion: string;
}

export interface BatchEnvelope {
  write_key: string;
  sent_at: string;
  sdk: { name: string; version: string };
  app_version: string;
  events: Record<string, unknown>[];
}

export type SendOutcome = 'delivered' | 'retry' | 'dropped';

/**
 * Build the request envelope.
 *
 * The write key goes in the BODY, not only in a header, because `sendBeacon` cannot
 * set headers. It is a public site key, not a secret — it identifies and rate-buckets
 * a known client and is cheaply rotatable — so carrying it in a body that is already
 * going to our own origin costs nothing.
 */
export function buildEnvelope(config: TransportConfig, events: QueuedEvent[]): BatchEnvelope {
  return {
    write_key: config.writeKey,
    sent_at: new Date().toISOString(),
    sdk: { name: 'mm-web', version: config.sdkVersion },
    app_version: config.appVersion,
    events: events.map(toWireEvent),
  };
}

/** Full-jitter exponential backoff: random in [0, min(max, base * 2^attempt)]. */
export function backoffDelay(attempt: number): number {
  const ceiling = Math.min(MAX_BACKOFF_MS, BASE_BACKOFF_MS * Math.pow(2, Math.max(0, attempt)));
  return Math.floor(Math.random() * ceiling);
}

/** Whether a response status is worth retrying. */
export function isRetryableStatus(status: number): boolean {
  if (status === 429) return true;
  if (status >= 500) return true;
  // 0 is what a network failure surfaces as in some environments.
  if (status === 0) return true;
  return false;
}

/** Parse Retry-After, which may be seconds or an HTTP date. */
export function parseRetryAfter(value: string | null): number | null {
  if (!value) return null;
  const seconds = Number(value);
  if (Number.isFinite(seconds) && seconds >= 0) return Math.min(seconds * 1000, MAX_BACKOFF_MS);
  const date = Date.parse(value);
  if (!Number.isNaN(date)) {
    const delta = date - Date.now();
    if (delta > 0) return Math.min(delta, MAX_BACKOFF_MS);
  }
  return null;
}

export interface TransportCallbacks {
  /** Called with events that could not be delivered and should return to the queue. */
  onRetry: (events: QueuedEvent[]) => void;
  /** Called after a successful delivery, with how many events landed. */
  onDelivered?: (count: number) => void;
  /** Called when a batch is permanently dropped (non-retryable response). */
  onDropped?: (events: QueuedEvent[], reason: string) => void;
}

export class Transport {
  private config: TransportConfig;
  private callbacks: TransportCallbacks;
  private inFlight = 0;

  constructor(config: TransportConfig, callbacks: TransportCallbacks) {
    this.config = config;
    this.callbacks = callbacks;
  }

  updateConfig(patch: Partial<TransportConfig>): void {
    this.config = { ...this.config, ...patch };
  }

  get captureUrl(): string {
    return `${this.config.baseUrl.replace(/\/$/, '')}/v1/capture`;
  }

  get busy(): boolean {
    return this.inFlight > 0;
  }

  /**
   * Send a batch, retrying with backoff. Never throws and never rejects — a rejected
   * promise from an analytics call inside a React effect is exactly what blanks the
   * app, and this module is called from effects.
   */
  async send(events: QueuedEvent[]): Promise<SendOutcome> {
    if (events.length === 0) return 'delivered';
    this.inFlight += 1;
    try {
      return await this.attempt(events, 0);
    } catch {
      // Defence in depth: attempt() already catches everything.
      this.callbacks.onRetry(events);
      return 'retry';
    } finally {
      this.inFlight -= 1;
    }
  }

  private async attempt(events: QueuedEvent[], attempt: number): Promise<SendOutcome> {
    const body = JSON.stringify(buildEnvelope(this.config, events));

    let status = 0;
    let retryAfterMs: number | null = null;
    try {
      const response = await fetch(this.captureUrl, {
        method: 'POST',
        keepalive: true,
        credentials: 'omit',
        headers: {
          'Content-Type': 'application/json',
          'X-MM-Write-Key': this.config.writeKey,
        },
        body,
      });
      status = response.status;
      if (status === 429) retryAfterMs = parseRetryAfter(response.headers.get('Retry-After'));
    } catch {
      // Network error, offline, or the request was cancelled by page teardown.
      status = 0;
    }

    if (status >= 200 && status < 300) {
      this.callbacks.onDelivered?.(events.length);
      return 'delivered';
    }

    if (!isRetryableStatus(status)) {
      // 400 / 401 / 413 will fail identically forever. Retrying would burn the
      // outbox on a batch that can never land, and starve the events behind it.
      this.callbacks.onDropped?.(events, `non-retryable status ${status}`);
      return 'dropped';
    }

    if (attempt + 1 >= MAX_ATTEMPTS) {
      // Out of attempts for this cycle — hand back to the queue so the events ride
      // along with the next natural flush rather than being lost.
      this.callbacks.onRetry(events);
      return 'retry';
    }

    const delay = retryAfterMs ?? backoffDelay(attempt);
    await sleep(delay);
    return this.attempt(events, attempt + 1);
  }

  /**
   * Fire-and-forget teardown send. Synchronous by design: at `pagehide` there is no
   * opportunity to await anything.
   *
   * Returns whether the beacon was accepted for delivery. A `false` return means the
   * body exceeded the beacon quota or the API is unavailable, and the caller falls
   * back to a keepalive fetch.
   */
  sendBeacon(events: QueuedEvent[]): boolean {
    if (events.length === 0) return true;
    if (typeof navigator === 'undefined' || typeof navigator.sendBeacon !== 'function') {
      return false;
    }
    try {
      const body = JSON.stringify(buildEnvelope(this.config, events));
      // text/plain keeps the request CORS-safelisted, so no preflight. At teardown a
      // preflight is a round trip the browser will very likely cancel, taking the
      // real request with it. The server parses the body as JSON regardless of
      // content type for exactly this reason.
      const blob = new Blob([body], { type: 'text/plain;charset=UTF-8' });
      return navigator.sendBeacon(this.captureUrl, blob);
    } catch {
      return false;
    }
  }

  /**
   * Best-effort keepalive fetch with no awaiting and no retry. The fallback when
   * sendBeacon refuses the payload.
   */
  sendKeepalive(events: QueuedEvent[]): void {
    if (events.length === 0) return;
    try {
      void fetch(this.captureUrl, {
        method: 'POST',
        keepalive: true,
        credentials: 'omit',
        headers: {
          'Content-Type': 'application/json',
          'X-MM-Write-Key': this.config.writeKey,
        },
        body: JSON.stringify(buildEnvelope(this.config, events)),
      }).catch(() => {
        // Teardown: nothing left to do about it, and the outbox mirror is still on
        // disk for the next page load to adopt.
      });
    } catch {
      // ignore
    }
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, Math.max(0, ms));
  });
}
