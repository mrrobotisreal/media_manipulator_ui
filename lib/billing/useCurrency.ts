'use client';

// useCurrency (MM69, design PRO_TIER.md §7.6): the billing currency every price surface
// renders in and every Checkout is opened in.
//
//   { currency, setCurrency, locked, source: 'lock' | 'setting' | 'cookie' | 'geo', supported }
//
// Precedence lock > setting > cookie > geo (lib/billing/currency.ts). Its inputs:
//   - geo:     the browser's own GET /api/tiers `defaultCurrency` (the API reads the
//              visitor's country; a server-rendered copy would name the server's)
//   - cookie:  `mm-currency` / its localStorage mirror, restored after mount
//   - setting: GET /api/account/settings `currency` for a signed-in account
//   - lock:    GET /api/billing/status `currency` when `currencyLocked`
// None of these use react-query: the upgrade surfaces also render in the chromeless /embed
// and /dr trees, which mount no QueryClientProvider. Each is fetched once per page load.
//
// Translator deployments (MM52) never fetch the account inputs: billing is hidden there.

import * as React from 'react';

import { analytics, EVENTS } from '@/lib/analytics';
import { useAuth } from '@/lib/auth/AuthProvider';
import {
  fetchBillingStatus,
  fetchSettings,
  fetchTiers,
  patchSettings,
  type BillingCurrency,
  type TiersResponse,
} from '@/lib/auth/accountApi';
import { getCurrentIdToken } from '@/lib/firebase';
import { isIrreversibleActionHidden } from '@/lib/translator/mode';
import {
  SERVER_CURRENCY,
  adoptSettingCurrency,
  currentCurrency,
  noteLock,
  noteTiers,
  pickCurrency,
  pickedCurrency,
  restoreStoredCurrency,
  subscribeCurrency,
  type CurrencySource,
  type ResolvedCurrency,
} from './currency';

export interface UseCurrency extends ResolvedCurrency {
  /** Switch currency (no-op while locked). Persists to cookie + localStorage, and to the
   *  account setting when signed in; fires `billing_currency_changed`. */
  setCurrency: (next: BillingCurrency, placement: string) => void;
}

let tiersLoad: Promise<TiersResponse | null> | null = null;
const accountLoads = new Map<string, Promise<void>>();

/** The browser's own /api/tiers answer, once per page (shared with every island). */
function loadClientTiers(): Promise<TiersResponse | null> {
  if (!tiersLoad) {
    tiersLoad = fetchTiers()
      .then((t) => {
        noteTiers(t, { geo: true });
        return t;
      })
      .catch(() => {
        tiersLoad = null;
        return null;
      });
  }
  return tiersLoad;
}

/** The signed-in account's setting and lock, once per uid per page. */
function loadAccountCurrency(uid: string): Promise<void> {
  let load = accountLoads.get(uid);
  if (!load) {
    load = (async () => {
      const token = await getCurrentIdToken();
      if (!token) return;
      const [settings, status] = await Promise.allSettled([fetchSettings(token), fetchBillingStatus(token)]);
      if (settings.status === 'fulfilled' && settings.value.currency) adoptSettingCurrency(settings.value.currency);
      if (status.status === 'fulfilled') applyLock(status.value.currencyLocked ? status.value.currency ?? null : null, uid);
    })().catch(() => undefined);
    accountLoads.set(uid, load);
  }
  return load;
}

/**
 * A subscription's currency is the truth (Stripe locks it). When it differs from what the
 * visitor had picked, the stored pick follows it, once, with `source: lock`.
 */
function applyLock(lock: BillingCurrency | null, uid: string | null): void {
  noteLock(lock);
  if (!lock) return;
  const before = pickedCurrency();
  if (before && before !== lock) {
    pickCurrency(lock, !!uid);
    analytics.track(EVENTS.BILLING_CURRENCY_CHANGED, { from: before, to: lock, source: 'lock', placement: 'billing_status' });
  }
}

/** Test seam: forget the per-page loads. */
export function resetCurrencyLoadsForTests(): void {
  tiersLoad = null;
  accountLoads.clear();
}

/** Feed a billing status the caller already has (the Billing panel) into the lock. */
export function useCurrencyLockFrom(status: { currency?: BillingCurrency | null; currencyLocked?: boolean } | undefined): void {
  const auth = useAuth();
  const uid = auth?.user?.uid ?? null;
  const lock = status?.currencyLocked ? status.currency ?? null : null;
  const known = status !== undefined;
  React.useEffect(() => {
    if (known) applyLock(lock, uid);
  }, [known, lock, uid]);
}

export function useCurrency(): UseCurrency {
  const auth = useAuth();
  const uid = auth?.user?.uid ?? null;
  const resolved = React.useSyncExternalStore(subscribeCurrency, currentCurrency, () => SERVER_CURRENCY);

  React.useEffect(() => {
    restoreStoredCurrency();
    void loadClientTiers();
  }, []);
  React.useEffect(() => {
    if (uid && auth?.tier !== 'operator' && !isIrreversibleActionHidden()) void loadAccountCurrency(uid);
  }, [uid, auth?.tier]);

  const setCurrency = React.useCallback(
    (next: BillingCurrency, placement: string) => {
      const now = currentCurrency();
      if (now.locked || next === now.currency) return;
      pickCurrency(next, !!uid);
      analytics.track(EVENTS.BILLING_CURRENCY_CHANGED, { from: now.currency, to: next, source: 'toggle', placement });
      if (uid && !isIrreversibleActionHidden()) {
        // Best effort: the cookie already remembers it; the account copy follows the user.
        void getCurrentIdToken()
          .then((token) => (token ? patchSettings(token, { currency: next }) : null))
          .catch(() => undefined);
      }
    },
    [uid],
  );

  return { ...resolved, setCurrency };
}

export type { CurrencySource };
