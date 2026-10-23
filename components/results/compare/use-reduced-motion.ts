'use client';

import { useSyncExternalStore } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

function subscribe(onChange: () => void): () => void {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return () => undefined;
  const mql = window.matchMedia(QUERY);
  mql.addEventListener?.('change', onChange);
  return () => mql.removeEventListener?.('change', onChange);
}

const snapshot = (): boolean =>
  typeof window !== 'undefined' && typeof window.matchMedia === 'function' && !!window.matchMedia(QUERY).matches;

/** True when the visitor prefers reduced motion (and during SSR, the safe default). */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, snapshot, () => true);
}
