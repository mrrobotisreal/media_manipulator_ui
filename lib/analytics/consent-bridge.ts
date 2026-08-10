/**
 * The consent gate in front of the SDK.
 *
 * THREE STATES, THREE BEHAVIOURS:
 *
 *   granted → full capture.
 *
 *   unset   → the visitor has not answered. NO persistence and NO transmission, but up
 *             to 50 events held in memory. On grant they are flushed through the normal
 *             pipeline with their ORIGINAL timestamps; on deny the buffer is discarded.
 *
 *             The legal reasoning for the buffer, stated plainly: processing begins at
 *             consent. Holding an event in a variable for four seconds and then either
 *             sending it (because they said yes) or dropping it (because they said no)
 *             is not processing personal data without a basis — nothing is stored,
 *             nothing is transmitted, and nothing leaves the tab. What it buys is the
 *             visitor's first page view and their first tool interaction, which are the
 *             two most valuable events in any session and which a naive gate throws
 *             away for every single visitor who accepts.
 *
 *   denied  → no capture at all. Only the identifier-free `/v1/count` page ping, so
 *             declining traffic still has a floor count and a change in consent rate
 *             cannot masquerade as a change in traffic.
 *
 * THE BUFFER IS CAPPED AT 50 AND MEMORY-ONLY. Capped because an unanswered banner can
 * sit there for the whole visit and an unbounded buffer would grow with it; memory-only
 * because writing to localStorage before the visitor answers IS processing, whatever we
 * intend to do with it afterwards.
 */

import { getConsentDetails, onConsentDetailsChange, type ConsentValue } from '@/lib/consent';
import { stripLocalePrefix } from '@/i18n/locales';

import { pageTypeFromPathname } from './events';
import type { QueuedEvent } from './queue';
import { analyticsBaseUrl } from './baseUrl';

export const MAX_PRECONSENT_BUFFER = 50;

type FlushHandler = (events: QueuedEvent[]) => void;

export interface ConsentGateHandlers {
  /** Consent became `granted`. Receives the buffered events, oldest first. */
  onGrant: FlushHandler;
  /** Consent became `denied`. The buffer has already been discarded. */
  onDeny: () => void;
}

let buffer: QueuedEvent[] = [];
let unsubscribe: (() => void) | null = null;
let handlers: ConsentGateHandlers | null = null;
let lastState: ConsentValue | null = null;

/** Current analytics consent value. */
export function analyticsConsent(): ConsentValue {
  try {
    return getConsentDetails().analytics;
  } catch {
    // Conservative: if we cannot read the state, behave as though we have not asked.
    return 'unset';
  }
}

export function canCapture(): boolean {
  return analyticsConsent() === 'granted';
}

export function canPersist(): boolean {
  return analyticsConsent() === 'granted';
}

/**
 * Hold an event until consent resolves. Returns false when the buffer is full, so the
 * caller can count the drop rather than silently losing it.
 */
export function bufferPreConsent(event: QueuedEvent): boolean {
  if (buffer.length >= MAX_PRECONSENT_BUFFER) return false;
  buffer.push(event);
  return true;
}

export function preConsentBufferSize(): number {
  return buffer.length;
}

/**
 * Wire the gate.
 *
 * Idempotent — safe to call from a React effect that may run twice in development
 * (StrictMode double-invokes effects, and a second subscription would flush the buffer
 * twice).
 *
 * Both callbacks fire IMMEDIATELY when the state is already decided at wiring time. That
 * matters: a returning visitor's stored consent resolves synchronously, so there may be no
 * state CHANGE to subscribe to and a change-only gate would never enable persistence for
 * the visitors who already said yes.
 */
export function initConsentGate(next: ConsentGateHandlers): () => void {
  handlers = next;
  if (unsubscribe) return unsubscribe;

  lastState = analyticsConsent();
  if (lastState === 'granted') flushBuffer();
  if (lastState === 'denied') discardBuffer();

  unsubscribe = onConsentDetailsChange((details) => {
    const value = details.analytics;
    if (value === lastState) return;
    lastState = value;
    if (value === 'granted') {
      flushBuffer();
    } else if (value === 'denied') {
      discardBuffer();
    }
  });

  return () => {
    unsubscribe?.();
    unsubscribe = null;
    handlers = null;
  };
}

function flushBuffer(): void {
  const pending = buffer;
  buffer = [];
  try {
    handlers?.onGrant(pending);
  } catch {
    // A failure here must not leave the SDK in a broken state. The events are lost, which
    // is the same outcome as a denial and strictly better than a throw inside a consent
    // listener.
  }
}

function discardBuffer(): void {
  buffer = [];
  try {
    handlers?.onDeny();
  } catch {
    // ignore
  }
}

/* ---------------------------------------------------------------------------
 * The denied-consent floor: /v1/count
 * ------------------------------------------------------------------------- */

let lastCountedPath: string | null = null;

/**
 * Send an anonymous page ping. Used ONLY when analytics consent is denied.
 *
 * The payload is the pathname and the route family. That is all. No visitor id, no
 * session id, no referrer, no user agent, no UTM, no timestamp beyond what the server
 * derives, no properties, no cookie. Nothing in it can identify or re-identify anyone,
 * individually or in combination — which is precisely what lets it stand on legitimate
 * interest where a full event cannot.
 *
 * `sendBeacon` with a text/plain Blob: CORS-safelisted, so no preflight, so a page that
 * is already navigating away still gets counted.
 *
 * Deduped per path so a re-render or a shallow route change cannot inflate the count.
 * The query string is deliberately stripped BEFORE it reaches this function — see the
 * pathname regex on the server, which rejects anything with a query.
 */
export function sendAnonymousCount(rawPathname: string): void {
  if (typeof window === 'undefined') return;
  // Locale-neutral, matching buildBatchContext: daily_anonymous_counts keys on
  // (day, pathname, country) and a page's count should not fragment per locale.
  const pathname = rawPathname ? stripLocalePrefix(rawPathname) : rawPathname;
  if (!pathname || pathname === lastCountedPath) return;
  lastCountedPath = pathname;

  const body = JSON.stringify({
    kind: 'page_view',
    pathname,
    page_type: pageTypeFromPathname(pathname),
  });

  try {
    if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
      const blob = new Blob([body], { type: 'text/plain;charset=UTF-8' });
      if (navigator.sendBeacon(`${analyticsBaseUrl()}/v1/count`, blob)) return;
    }
    void fetch(`${analyticsBaseUrl()}/v1/count`, {
      method: 'POST',
      keepalive: true,
      credentials: 'omit',
      headers: { 'Content-Type': 'application/json' },
      body,
    }).catch(() => {
      // A lost anonymous ping is the least consequential data loss in this system.
    });
  } catch {
    // ignore
  }
}

/** For tests. */
export function resetConsentGateForTests(): void {
  buffer = [];
  lastCountedPath = null;
  lastState = null;
  unsubscribe?.();
  unsubscribe = null;
  handlers = null;
}
