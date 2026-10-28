// A tiny pub/sub for quota state observed on API responses.
//
// Why a module-level bus rather than context: authedFetch is called from plain
// async functions inside React Query mutations, well outside any component that
// could hold a ref to the auth context. The bus lets the fetch layer publish
// what the server just told it, and lets AuthProvider subscribe — without
// either importing the other, and without a refetch after every conversion.

import type { LimitRefusal, QuotaExceeded, QuotaHeaderState } from './accountApi';

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

type LimitListener = (detail: LimitRefusal) => void;
const limitListeners = new Set<LimitListener>();

/**
 * Announces a 403 `output_height_limited` / `project_limit_reached` so the shared upgrade
 * interstitial can open, wherever in the app the request was made.
 */
export function publishLimitRefusal(detail: LimitRefusal): void {
  limitListeners.forEach((listener) => {
    try {
      listener(detail);
    } catch {
      // A broken subscriber must never break the request that triggered it.
    }
  });
}

export function subscribeLimitRefusal(listener: LimitListener): () => void {
  limitListeners.add(listener);
  return () => {
    limitListeners.delete(listener);
  };
}

type RefundListener = () => void;
const refundListeners = new Set<RefundListener>();

/**
 * Announces that the server gave an allowance unit back: a request it refused
 * after the quota middleware ran (oversized file, over-limit source, unsupported
 * type) or a job that failed. The quota headers on such a response were written
 * BEFORE the refund and are stale, so they are not published; subscribers drop
 * what they observed and re-read /api/account/usage instead.
 */
export function publishQuotaRefund(): void {
  latest = null;
  refundListeners.forEach((listener) => {
    try {
      listener();
    } catch {
      // A broken subscriber must never break the request that triggered it.
    }
  });
}

export function subscribeQuotaRefund(listener: RefundListener): () => void {
  refundListeners.add(listener);
  return () => {
    refundListeners.delete(listener);
  };
}
