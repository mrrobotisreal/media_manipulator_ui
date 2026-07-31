'use client';

import * as React from 'react';

import { analytics } from './client';
import { reportError } from './errors';
import type { EventName, PropsFor, TrackOptions } from './events';
import type { ContextPatch } from './context';

/**
 * The React entry point.
 *
 * Every member is stable across renders (the singleton is module-level, so there is
 * nothing to memoize against), which means it is safe in a `useEffect` dependency array
 * without triggering a re-run — a small thing that avoids a very common class of
 * accidental effect loop.
 */
export interface UseAnalytics {
  track: <E extends EventName>(name: E, props?: PropsFor<E>, options?: TrackOptions) => void;
  identify: (firebaseUid: string, traits?: { tier?: 'anonymous' | 'free' | 'premium' }) => void;
  reset: () => void;
  setContext: (patch: ContextPatch) => void;
  /** Force a flush. Rarely needed — priority 0 already flushes immediately. */
  flush: () => void;
  /** Report a caught error as a `client_error` event. */
  reportError: (error: unknown, context?: { stage?: string; toolSlug?: string | null }) => void;
}

const api: UseAnalytics = {
  track: (name, props, options) => analytics.track(name, props, options),
  identify: (firebaseUid, traits) => analytics.identify(firebaseUid, traits),
  reset: () => analytics.reset(),
  setContext: (patch) => analytics.setContext(patch),
  flush: () => analytics.scheduleFlush(0),
  reportError: (error, context) =>
    reportError(analytics, error, { source: 'react', stage: context?.stage, toolSlug: context?.toolSlug }),
};

export function useAnalytics(): UseAnalytics {
  // A constant object, so this is a stable reference by construction. useMemo is here for
  // the reader's benefit — it documents the intent — rather than because it does work.
  return React.useMemo(() => api, []);
}

export default useAnalytics;
