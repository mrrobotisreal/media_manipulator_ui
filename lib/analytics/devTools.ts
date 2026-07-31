/**
 * Dev tools controller — the always-on (in dev) half of the QA harness.
 *
 * DEVELOPMENT ONLY, ZERO PRODUCTION BYTES. Loaded exclusively through the
 * dynamic `import('./devTools')` in AnalyticsProvider, which sits behind a
 * literal `process.env.NODE_ENV !== 'production'` check that bundlers
 * dead-code-eliminate. Nothing in production code may import this statically.
 *
 * SPLIT OF RESPONSIBILITIES. This module is deliberately tiny and headless:
 * it owns the console validation warner (always active in dev), the
 * activation flag + Ctrl+Shift+A toggle, and — only while the inspector is
 * enabled — the event subscription that fills a rolling buffer with validated
 * entries. The heavy React panel (components/analytics/dev-event-inspector)
 * consumes this module's state. Detached-when-hidden: with the inspector off,
 * the only live listener is the keydown toggle and the console warner, so an
 * idle dev session costs nothing.
 */

import type { AnalyticsClient } from './client';
import type { QueuedEvent, WireContext } from './queue';
import type { EventProperties, Priority } from './events';
import { initDevValidation, validateDevEvent } from './devValidation';

/** localStorage flag that keeps the inspector open across reloads. The
 *  documented manual activation is `localStorage['mm.a.devtools'] = '1'`. */
const DEVTOOLS_KEY = 'mm.a.devtools';

/** Rolling buffer size. 100 is enough to cover a full tool funnel plus the
 *  page chrome around it without ever being a memory concern. */
const MAX_ENTRIES = 100;

export interface DevEventEntry {
  id: number;
  name: string;
  /** ISO timestamp the event was tracked at (the event's own event_ts). */
  ts: string;
  priority: Priority;
  toolSlug?: string;
  /** Serialized size — a rough "how much am I sending" signal per event. */
  bytes: number;
  properties?: EventProperties;
  context?: WireContext;
  /** Validation findings from devValidation; empty = clean. */
  issues: string[];
}

export interface DevToolsState {
  enabled: boolean;
  entries: DevEventEntry[];
}

let client: AnalyticsClient | null = null;
let enabled = false;
let entries: DevEventEntry[] = [];
let nextID = 1;
let detachSubscription: (() => void) | null = null;
const listeners = new Set<() => void>();

/**
 * Cached immutable snapshot, rebuilt only when something changes. Required by
 * useSyncExternalStore in the inspector: a getter that allocates a fresh
 * object per call would fail its Object.is check and loop the render.
 */
let snapshot: DevToolsState = { enabled: false, entries: [] };

function notify(): void {
  snapshot = { enabled, entries };
  listeners.forEach((listener) => {
    try {
      listener();
    } catch {
      // A broken listener must not affect the controller.
    }
  });
}

function readFlag(): boolean {
  try {
    return window.localStorage.getItem(DEVTOOLS_KEY) === '1';
  } catch {
    return false;
  }
}

function writeFlag(on: boolean): void {
  try {
    if (on) window.localStorage.setItem(DEVTOOLS_KEY, '1');
    else window.localStorage.removeItem(DEVTOOLS_KEY);
  } catch {
    // Storage blocked — the toggle still works for this page's lifetime.
  }
}

function attach(): void {
  if (!client || detachSubscription) return;
  const c = client;
  detachSubscription = c.subscribe((name, event) => {
    try {
      const batchContext = c.debugContext();
      const entry: DevEventEntry = {
        id: nextID++,
        name,
        ts: event.event_ts,
        priority: event._priority,
        toolSlug: event.context?.tool_slug ?? batchContext.tool_slug,
        bytes: safeByteSize(event),
        properties: event.properties,
        context: event.context,
        issues: validateDevEvent(name, event, batchContext),
      };
      entries = [...entries.slice(-(MAX_ENTRIES - 1)), entry];
      notify();
    } catch {
      // Never let the harness affect capture.
    }
  });
}

function detach(): void {
  if (detachSubscription) {
    detachSubscription();
    detachSubscription = null;
  }
}

function safeByteSize(event: QueuedEvent): number {
  try {
    // Bookkeeping fields are not on the wire; close enough for a dev readout.
    const { _priority, _enqueuedAt, ...wire } = event;
    void _priority;
    void _enqueuedAt;
    return JSON.stringify(wire).length;
  } catch {
    return 0;
  }
}

/* ---------------------------------------------------------------------------
 * Public API (consumed by the inspector component)
 * ------------------------------------------------------------------------- */

export function getDevToolsState(): DevToolsState {
  return snapshot;
}

export function subscribeDevTools(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function toggleDevTools(): void {
  enabled = !enabled;
  writeFlag(enabled);
  if (enabled) attach();
  else detach();
  notify();
}

export function clearDevToolsEntries(): void {
  entries = [];
  notify();
}

/**
 * Wire the whole dev harness: the console validation warner (always), the
 * keyboard toggle, and — if the flag was already set — the buffer
 * subscription. Returns one detach that undoes everything; called from
 * AnalyticsProvider's effect cleanup.
 */
export function initDevTools(analyticsClient: AnalyticsClient): () => void {
  client = analyticsClient;

  // The console warner runs regardless of whether the panel is open — a
  // malformed event should be loud in dev even for someone who never opens
  // the inspector.
  const detachValidation = initDevValidation(analyticsClient);

  enabled = readFlag();
  if (enabled) attach();

  const onKeyDown = (e: KeyboardEvent) => {
    // Ctrl+Shift+A. The listener itself is dev-only by construction (this
    // whole module never ships to production).
    if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
      e.preventDefault();
      toggleDevTools();
    }
  };
  window.addEventListener('keydown', onKeyDown);

  notify();

  return () => {
    window.removeEventListener('keydown', onKeyDown);
    detach();
    detachValidation();
    client = null;
    listeners.clear();
  };
}
