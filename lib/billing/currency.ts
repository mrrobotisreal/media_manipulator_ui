// The visitor's billing currency (MM69, design PRO_TIER.md §7.3-7.4). Pure, framework-free
// pieces: the precedence rule, the cookie + localStorage persistence, and one tiny external
// store so every island on a page (the /pricing toggle and both paid columns, the Billing
// panel, the interstitial, the auth modal) shows the same currency without a React context.
//
// Precedence: lock (the subscription's Stripe currency) > setting (the signed-in account) >
// cookie (this browser's earlier pick) > geo (the API's /api/tiers defaultCurrency) > usd.
// The client never guesses a country itself; with no API answer the default is usd.

import { isBillingCurrency, type BillingCurrency } from '@/lib/auth/accountApi';

export type CurrencySource = 'lock' | 'setting' | 'cookie' | 'geo';

export const CURRENCY_COOKIE = 'mm-currency';
const STORAGE_KEY = 'mm-currency';
const ONE_YEAR_SECONDS = 365 * 24 * 60 * 60;

export interface CurrencyInputs {
  /** The subscription's currency, only when the API says it is locked. */
  lock?: BillingCurrency | null;
  /** The signed-in account's saved choice. */
  setting?: BillingCurrency | null;
  /** This browser's stored pick (cookie, else localStorage). */
  cookie?: BillingCurrency | null;
  /** /api/tiers defaultCurrency. */
  geo?: BillingCurrency | null;
}

/** lock > setting > cookie > geo > usd. `source` is 'geo' for the bare usd fallback too. */
export function resolveCurrency(inputs: CurrencyInputs): { currency: BillingCurrency; source: CurrencySource } {
  if (inputs.lock) return { currency: inputs.lock, source: 'lock' };
  if (inputs.setting) return { currency: inputs.setting, source: 'setting' };
  if (inputs.cookie) return { currency: inputs.cookie, source: 'cookie' };
  return { currency: inputs.geo ?? 'usd', source: 'geo' };
}

/** The stored pick: the `mm-currency` cookie, else its localStorage mirror; null if none. */
export function readStoredCurrency(): BillingCurrency | null {
  try {
    const match = document.cookie.match(/(?:^|;\s*)mm-currency=([^;]*)/);
    const value = match ? decodeURIComponent(match[1]) : null;
    if (isBillingCurrency(value)) return value;
  } catch {
    /* no document (SSR) or blocked cookies */
  }
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    if (isBillingCurrency(value)) return value;
  } catch {
    /* blocked storage is normal */
  }
  return null;
}

/** Remembers a pick for a year: cookie (SameSite=Lax, not HttpOnly) plus localStorage. */
export function writeStoredCurrency(currency: BillingCurrency): void {
  try {
    const secure = window.location.protocol === 'https:' ? '; Secure' : '';
    document.cookie = `${CURRENCY_COOKIE}=${currency}; Max-Age=${ONE_YEAR_SECONDS}; Path=/; SameSite=Lax${secure}`;
  } catch {
    /* nothing to do */
  }
  try {
    window.localStorage.setItem(STORAGE_KEY, currency);
  } catch {
    /* nothing to do */
  }
}

// --- The page-wide state ----------------------------------------------------------------
// One tiny external store (no React context: the /pricing islands live under a server
// component). It starts empty so the server render and the first client render agree (USD);
// the browser's stored pick, the account setting, the API's geo default and the
// subscription lock arrive after mount.
//
// `supported` is false until an /api/tiers answer carries EUR prices. Until then (and
// against a pre-MM69 API that never sends them) the currency is USD whatever was stored:
// such an API opens Checkout without a currency, so showing euros could not be honoured.

interface CurrencyState {
  supported: boolean;
  lock: BillingCurrency | null;
  geo: BillingCurrency | null;
  picked: { currency: BillingCurrency; source: 'setting' | 'cookie' } | null;
}

export interface ResolvedCurrency {
  currency: BillingCurrency;
  source: CurrencySource;
  locked: boolean;
  /** Whether the API sells EUR at all (the toggle is hidden otherwise). */
  supported: boolean;
}

/** What the server render and the first client render show: USD, no toggle. */
export const SERVER_CURRENCY: ResolvedCurrency = { currency: 'usd', source: 'geo', locked: false, supported: false };

let state: CurrencyState = { supported: false, lock: null, geo: null, picked: null };
let resolved: ResolvedCurrency = compute(state);
const listeners = new Set<() => void>();

function compute(s: CurrencyState): ResolvedCurrency {
  if (!s.supported) {
    return { currency: s.lock ?? 'usd', source: s.lock ? 'lock' : 'geo', locked: !!s.lock, supported: false };
  }
  const r = resolveCurrency({
    lock: s.lock,
    setting: s.picked?.source === 'setting' ? s.picked.currency : null,
    cookie: s.picked?.source === 'cookie' ? s.picked.currency : null,
    geo: s.geo,
  });
  return { ...r, locked: !!s.lock, supported: true };
}

function update(next: Partial<CurrencyState>): void {
  state = { ...state, ...next };
  const r = compute(state);
  if (r.currency === resolved.currency && r.source === resolved.source && r.locked === resolved.locked && r.supported === resolved.supported) return;
  resolved = r;
  for (const listener of listeners) listener();
}

export function subscribeCurrency(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** The currency right now, for non-React callers (startCheckout, the plan-change event). */
export function currentCurrency(): ResolvedCurrency {
  return resolved;
}

/** An /api/tiers answer: whether EUR is sold and the API's geo default for this browser. */
export function noteTiers(tiers: { prices?: Partial<Record<BillingCurrency, unknown>>; defaultCurrency?: unknown } | null | undefined, opts: { geo: boolean }): void {
  if (!tiers) return;
  const next: Partial<CurrencyState> = { supported: state.supported || !!tiers.prices?.eur };
  // Only a browser-side fetch knows the visitor's country: a server-rendered copy was
  // fetched by the web server, so its default says where the server is.
  if (opts.geo && isBillingCurrency(tiers.defaultCurrency)) next.geo = tiers.defaultCurrency;
  update(next);
}

/** The subscription's currency once the API says it is locked; null clears it. */
export function noteLock(lock: BillingCurrency | null): void {
  update({ lock });
}

/** After mount: adopt the browser's stored pick if the tab has none yet. */
export function restoreStoredCurrency(): void {
  if (state.picked) return;
  const stored = readStoredCurrency();
  if (stored) update({ picked: { currency: stored, source: 'cookie' } });
}

/** The signed-in account's saved currency outranks the browser's cookie. */
export function adoptSettingCurrency(currency: BillingCurrency): void {
  writeStoredCurrency(currency);
  update({ picked: { currency, source: 'setting' } });
}

/** The visitor chose a currency (toggle), or a lock replaced their stored pick. */
export function pickCurrency(currency: BillingCurrency, signedIn: boolean): void {
  writeStoredCurrency(currency);
  update({ picked: { currency, source: signedIn ? 'setting' : 'cookie' } });
}

/** The stored pick as the page holds it (null = none). */
export function pickedCurrency(): BillingCurrency | null {
  return state.picked?.currency ?? null;
}

/** Test seam. */
export function resetCurrencyForTests(): void {
  state = { supported: false, lock: null, geo: null, picked: null };
  resolved = compute(state);
  for (const listener of listeners) listener();
}
