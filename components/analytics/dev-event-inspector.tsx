'use client';

/**
 * Dev event inspector — the visible half of the analytics QA harness.
 *
 * DEVELOPMENT ONLY, ZERO PRODUCTION BYTES. This component is only reachable
 * through the `React.lazy(() => import(...))` in AnalyticsProvider, which sits
 * behind a literal `process.env.NODE_ENV !== 'production'` check that bundlers
 * dead-code-eliminate. If this file ever shows up in a production build's
 * output, the guard in AnalyticsProvider is broken — that is the invariant to
 * fix, not this file.
 *
 * Activation: `localStorage['mm.a.devtools'] = '1'` or Ctrl+Shift+A (both
 * handled by lib/analytics/devTools). Until then this renders a small badge's
 * worth of nothing — the controller keeps the event subscription detached
 * while hidden, so a closed inspector costs nothing per event.
 *
 * Styling: darkroom palette (near-black surface, amber accent) with plain
 * Tailwind utilities and native <details> for row expansion — no dialog/portal
 * machinery, no state per row, which is also what keeps it trivially clean
 * under the React Compiler lint (a conditionally-rendered lazy component
 * beside {children} rather than a portal: same visual result, fewer moving
 * parts, and the chromeless branches never mount AnalyticsProvider at all so
 * /embed and /dr stay clean structurally).
 */

import * as React from 'react';

import { analytics } from '@/lib/analytics/client';
import {
  clearDevToolsEntries,
  getDevToolsState,
  subscribeDevTools,
  toggleDevTools,
  type DevEventEntry,
  type DevToolsState,
} from '@/lib/analytics/devTools';
import { getTabId, getVisitorId, isSelfExcluded } from '@/lib/analytics/identity';
import { getSessionId } from '@/lib/analytics/session';
import { getConsentDetails } from '@/lib/consent';

/** Stable server snapshot. This component never server-renders (lazy, mounted
 *  post-idle), but useSyncExternalStore requires the getter to exist. */
const EMPTY_STATE: DevToolsState = { enabled: false, entries: [] };
const getServerSnapshot = () => EMPTY_STATE;

const PRIORITY_LABELS = ['P0', 'P1', 'P2', 'P3'] as const;

export function DevEventInspector() {
  const state = React.useSyncExternalStore(subscribeDevTools, getDevToolsState, getServerSnapshot);

  if (!state.enabled) return null;
  return <InspectorPanel entries={state.entries} />;
}

function InspectorPanel({ entries }: { entries: DevEventEntry[] }) {
  const [collapsed, setCollapsed] = React.useState(true);
  const [queueSize, setQueueSize] = React.useState(() => analytics.queueSize());
  const [selfExcluded, setSelfExcluded] = React.useState(() => isSelfExcluded());

  // Live queue readout, polled while the panel is open. One second matches the
  // cadence a human actually watches at; there is no push signal for queue
  // depth and adding one to the SDK for a dev panel would be backwards.
  React.useEffect(() => {
    if (collapsed) return;
    const timer = window.setInterval(() => setQueueSize(analytics.queueSize()), 1000);
    return () => window.clearInterval(timer);
  }, [collapsed]);

  const warnings = entries.reduce((n, e) => n + (e.issues.length > 0 ? 1 : 0), 0);

  if (collapsed) {
    return (
      <button
        type="button"
        onClick={() => setCollapsed(false)}
        className="fixed bottom-3 right-3 z-[9999] rounded-full border border-amber-500/40 bg-zinc-950/95 px-3 py-1.5 font-mono text-xs text-amber-300 shadow-lg hover:bg-zinc-900"
        title="MM Analytics dev inspector (Ctrl+Shift+A toggles)"
      >
        MM·{entries.length}
        {warnings > 0 ? <span className="ml-1 text-red-400">⚠{warnings}</span> : null}
      </button>
    );
  }

  const toggleSelfExclusion = () => {
    // The documented manual flow (`localStorage['mm.a.optout'] = '1'`, see
    // lib/analytics/identity.ts), now one click. Events keep flowing either
    // way — the flag makes the server mark them is_self so aggregates skip
    // them, which is exactly what you want while poking at the inspector.
    try {
      const next = !selfExcluded;
      if (next) window.localStorage.setItem('mm.a.optout', '1');
      else window.localStorage.removeItem('mm.a.optout');
      setSelfExcluded(next);
    } catch {
      // Storage blocked; nothing to do.
    }
  };

  const consent = safeConsent();
  const context = analytics.debugContext();

  return (
    <div className="fixed bottom-3 right-3 z-[9999] flex max-h-[70vh] w-[26rem] max-w-[calc(100vw-1.5rem)] flex-col overflow-hidden rounded-lg border border-amber-500/30 bg-zinc-950/95 font-mono text-xs text-zinc-300 shadow-2xl backdrop-blur">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-zinc-800 px-3 py-2">
        <span className="font-semibold text-amber-300">MM Analytics</span>
        <span className="text-zinc-500">queue {queueSize}</span>
        {warnings > 0 ? <span className="text-red-400">⚠ {warnings}</span> : null}
        <span className="grow" />
        <button
          type="button"
          onClick={() => analytics.scheduleFlush(0)}
          className="rounded border border-zinc-700 px-2 py-0.5 hover:bg-zinc-800"
          title="Flush the queue now"
        >
          flush
        </button>
        <button
          type="button"
          onClick={() => clearDevToolsEntries()}
          className="rounded border border-zinc-700 px-2 py-0.5 hover:bg-zinc-800"
          title="Clear the captured buffer"
        >
          clear
        </button>
        <button
          type="button"
          onClick={() => setCollapsed(true)}
          className="rounded border border-zinc-700 px-2 py-0.5 hover:bg-zinc-800"
          title="Collapse to badge"
        >
          _
        </button>
        <button
          type="button"
          onClick={() => toggleDevTools()}
          className="rounded border border-zinc-700 px-2 py-0.5 hover:bg-zinc-800"
          title="Close (Ctrl+Shift+A reopens)"
        >
          ×
        </button>
      </div>

      {/* Identity / consent / context */}
      <div className="space-y-1 border-b border-zinc-800 px-3 py-2 text-[11px] leading-4">
        <div className="truncate text-zinc-500">
          visitor <span className="text-zinc-300">{safeID(getVisitorId)}</span>
        </div>
        <div className="truncate text-zinc-500">
          session <span className="text-zinc-300">{safeID(getSessionId)}</span> · tab{' '}
          <span className="text-zinc-300">{safeID(getTabId).slice(0, 8)}</span>
        </div>
        <div className="text-zinc-500">
          consent{' '}
          <span className="text-zinc-300">
            {consent
              ? `analytics=${consent.analytics} ads=${consent.advertising} region=${consent.regionGroup}${consent.gpc ? ' gpc' : ''}`
              : 'unavailable'}
          </span>
        </div>
        <label className="flex cursor-pointer items-center gap-2 text-zinc-500">
          <input type="checkbox" checked={selfExcluded} onChange={toggleSelfExclusion} />
          self-exclude my traffic (mm.a.optout → is_self)
        </label>
        <details>
          <summary className="cursor-pointer text-zinc-500 hover:text-zinc-300">
            batch context
          </summary>
          <pre className="mt-1 max-h-40 overflow-auto rounded bg-zinc-900 p-2 text-[10px] leading-4 text-zinc-400">
            {safeJSON(context)}
          </pre>
        </details>
      </div>

      {/* Event buffer, newest first */}
      <div className="grow overflow-y-auto">
        {entries.length === 0 ? (
          <div className="px-3 py-4 text-zinc-600">
            No events yet — interact with the page. (Buffer fills only while the inspector is
            enabled.)
          </div>
        ) : (
          [...entries].reverse().map((entry) => <EventRow key={entry.id} entry={entry} />)
        )}
      </div>
    </div>
  );
}

function EventRow({ entry }: { entry: DevEventEntry }) {
  const hasIssues = entry.issues.length > 0;
  return (
    <details className="border-b border-zinc-900 px-3 py-1.5">
      <summary className="flex cursor-pointer list-none items-center gap-2">
        <span className={hasIssues ? 'text-red-400' : 'text-emerald-400'}>
          {hasIssues ? '⚠' : '·'}
        </span>
        <span className="truncate text-zinc-200">{entry.name}</span>
        <span className="text-zinc-600">{PRIORITY_LABELS[entry.priority]}</span>
        {entry.toolSlug ? <span className="truncate text-amber-300/80">{entry.toolSlug}</span> : null}
        <span className="grow" />
        <span className="text-zinc-600">{entry.bytes}B</span>
        <span className="text-zinc-600">{entry.ts.slice(11, 19)}</span>
      </summary>
      {hasIssues ? (
        <ul className="mt-1 space-y-0.5 text-[10px] leading-4 text-red-400">
          {entry.issues.map((issue, i) => (
            <li key={i}>{issue}</li>
          ))}
        </ul>
      ) : null}
      <pre className="mt-1 max-h-48 overflow-auto rounded bg-zinc-900 p-2 text-[10px] leading-4 text-zinc-400">
        {safeJSON({ properties: entry.properties ?? {}, context: entry.context ?? {} })}
      </pre>
    </details>
  );
}

/* --- tiny throw-proof helpers (house rule: the harness never throws) ------- */

function safeID(getter: () => string): string {
  try {
    return getter();
  } catch {
    return 'unavailable';
  }
}

function safeConsent() {
  try {
    return getConsentDetails();
  } catch {
    return null;
  }
}

function safeJSON(value: unknown): string {
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return '(unserializable)';
  }
}

export default DevEventInspector;
