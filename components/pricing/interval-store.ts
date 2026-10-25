'use client';

// One billing interval for the whole /pricing page (MM40): the toggle and both paid columns
// are separate client islands inside a server component, so they share this tiny store
// instead of a React context the server tree cannot provide. SSR always renders monthly; the
// visitor's last pick is restored after mount by the toggle.

import * as React from 'react';

import type { BillingInterval } from '@/lib/auth/accountApi';
import { DEFAULT_INTERVAL, rememberInterval } from '@/lib/billing/checkout';

let current: BillingInterval = DEFAULT_INTERVAL;
const listeners = new Set<() => void>();

export function setPricingInterval(next: BillingInterval): void {
  if (next === current) return;
  current = next;
  rememberInterval(next);
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function usePricingInterval(): BillingInterval {
  return React.useSyncExternalStore(
    subscribe,
    () => current,
    () => DEFAULT_INTERVAL,
  );
}

/** Test seam. */
export function resetPricingIntervalForTests(): void {
  current = DEFAULT_INTERVAL;
  for (const listener of listeners) listener();
}
