// A tiny pub/sub for quota state observed on API responses.
//
// Why a module-level bus rather than context: authedFetch is called from plain
// async functions inside React Query mutations, well outside any component that
// could hold a ref to the auth context. The bus lets the fetch layer publish
// what the server just told it, and lets AuthProvider subscribe — without
// either importing the other, and without a refetch after every conversion.

import type { QuotaExceeded, QuotaHeaderState } from './accountApi';

type Listener = (state: QuotaHeaderState) => void;
type ExceededListener = (detail: QuotaExceeded) => void;

const listeners = new Set<Listener>();
const exceededListeners = new Set<ExceededListener>();
let latest: QuotaHeaderState | null = null;

/** Publishes quota state read from a response. No-op for an empty state. */
export function publishQuotaState(state: QuotaHeaderState | null): void {
  if (!state || Object.keys(state).length === 0) return;
  latest = state;
  listeners.forEach((listener) => {
    try {
      listener(state);
    } catch {
      // A broken subscriber must never break the request that triggered it.
    }
  });
}

/** Subscribes to quota updates. Returns an unsubscribe function. */
export function subscribeQuotaState(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** The most recent quota state seen, for a subscriber that mounts late. */
export function lastQuotaState(): QuotaHeaderState | null {
  return latest;
}

/** Clears the cached state. Called on sign-in and sign-out, where the
 *  allowance belongs to a different subject entirely. */
export function resetQuotaState(): void {
  latest = null;
}

/**
 * Announces a 429 so the account panel can open with the right explanation.
 *
 * Published centrally by authedFetch rather than handled per hook: the upgrade
 * moment is the one thing that must never be missed because a call site forgot
 * to check for it.
 */
export function publishQuotaExceeded(detail: QuotaExceeded): void {
  exceededListeners.forEach((listener) => {
    try {
      listener(detail);
    } catch {
      // A broken subscriber must never break the request that triggered it.
    }
  });
}

export function subscribeQuotaExceeded(listener: ExceededListener): () => void {
  exceededListeners.add(listener);
  return () => {
    exceededListeners.delete(listener);
  };
}
