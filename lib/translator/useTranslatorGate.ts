'use client';

/**
 * The workbench gate (MM53 decision 2, design §2.8).
 *
 * TRANSLATOR DEPLOYMENTS ONLY (loaded inside the workbench chunk).
 *
 * The panel mounts only when `GET /api/translator/me` says `allowed: true` for the
 * signed-in Firebase user AND names this deployment's locale. `unverified` gets the
 * "Verify your email" notice. Everything else (signed out, `not_allowlisted`,
 * `wrong_locale`, 401, a route that does not exist yet, network errors) is the
 * plain site: `denied` renders nothing, `signed_out` only the small sign-in entry.
 *
 * Re-checks when the user changes, when the server's view of `email_verified`
 * changes, and on `recheck()` (the notice's "I've verified").
 *
 * MM56 (dry-run defect 2): a client navigation between the German page and the
 * English view remounts the whole `[lang]` layout, AuthProvider included, so the
 * gate used to start from `loading` and wait for `/me` (about a second without a
 * panel). An `allowed` answer is now cached for the tab session
 * (`sessionStorage`, key `mm-translator-gate:<locale>`, value `{uid, email, at}`,
 * TTL `GATE_CACHE_TTL_MS`). A fresh entry for the same uid and locale shows the
 * panel at once, and `/me` is ALWAYS asked again: any answer other than
 * `allowed` clears the entry and hides the panel. While Firebase is still
 * restoring the user on a remount, the entry stands in for the user it names;
 * once the user is known a different uid (or none) never matches it. Only
 * `allowed` is ever written, so a refusal is never served from the cache.
 */
import { useCallback, useEffect, useState } from 'react';

import type { TranslatorApi } from './api';

export type GateState =
  | { kind: 'loading' }
  | { kind: 'signed_out' }
  | { kind: 'unverified' }
  | { kind: 'allowed'; email: string; locale: string }
  | { kind: 'denied'; reason: string };

/** The slice of `useAuth()` the gate reads (kept narrow so tests can fake it). */
export interface GateAuth {
  loading: boolean;
  user: { uid: string } | null;
  emailVerified: boolean | null;
}

/** How long an `allowed` answer may be shown before `/me` has answered again. */
export const GATE_CACHE_TTL_MS = 5 * 60_000;
export const GATE_CACHE_PREFIX = 'mm-translator-gate:';

export interface GateCacheEntry {
  uid: string;
  email: string;
  at: number;
}

/** The `/me` cache seam (`sessionGateCache()` in the deployment). */
export interface GateCache {
  /** The entry for `locale`, if fresh and (when `uid` is given) for that uid. */
  read(locale: string, uid: string | null, now: number): GateCacheEntry | null;
  write(locale: string, entry: GateCacheEntry): void;
  clear(locale: string): void;
}

function storage(): Storage | null {
  try {
    return typeof window === 'undefined' ? null : window.sessionStorage;
  } catch {
    return null;
  }
}

/** `sessionStorage`-backed cache; every access is try/catch (private windows). */
export function sessionGateCache(ttlMs: number = GATE_CACHE_TTL_MS): GateCache {
  return {
    read(locale, uid, now) {
      try {
        const raw = storage()?.getItem(GATE_CACHE_PREFIX + locale);
        if (!raw) return null;
        const e = JSON.parse(raw) as Partial<GateCacheEntry>;
        if (typeof e.uid !== 'string' || typeof e.email !== 'string' || typeof e.at !== 'number') return null;
        if (now - e.at > ttlMs || e.at > now) return null;
        if (uid !== null && e.uid !== uid) return null;
        return { uid: e.uid, email: e.email, at: e.at };
      } catch {
        return null;
      }
    },
    write(locale, entry) {
      try {
        storage()?.setItem(GATE_CACHE_PREFIX + locale, JSON.stringify(entry));
      } catch {
        // Per-tab convenience only.
      }
    },
    clear(locale) {
      try {
        storage()?.removeItem(GATE_CACHE_PREFIX + locale);
      } catch {
        // ignore
      }
    },
  };
}

export interface UseTranslatorGateOptions {
  api: TranslatorApi;
  /** `useAuth()`; null outside the AuthProvider (chromeless routes): no panel. */
  auth: GateAuth | null;
  /** The deployment's locale (`translatorLocale()`); null = not armed, no panel. */
  locale: string | null;
  /** Firebase ID token of the signed-in user. */
  getIdToken: () => Promise<string | null>;
  /** MM56: the `/me` cache (default `sessionGateCache()`); `null` disables it. */
  cache?: GateCache | null;
  now?: () => number;
}

function sameGateState(a: GateState, b: GateState): boolean {
  if (a.kind !== b.kind) return false;
  if (a.kind === 'allowed' && b.kind === 'allowed') return a.email === b.email && a.locale === b.locale;
  if (a.kind === 'denied' && b.kind === 'denied') return a.reason === b.reason;
  return true;
}

/** What the gate can show before `/me` answers (pure; also the initial state). */
function immediateState(
  auth: GateAuth | null,
  locale: string | null,
  cache: GateCache | null,
  now: number,
): GateState | null {
  if (!auth || !locale) return { kind: 'denied', reason: !auth ? 'no_auth' : 'not_armed' };
  if (auth.loading || auth.user) {
    // While auth restores, the cached entry stands in for the user it names.
    // A known uid must match; only while Firebase has not restored the user yet
    // does any entry of this tab count (it was written for this tab's user).
    const hit = cache?.read(locale, auth.user?.uid ?? null, now);
    if (hit) return { kind: 'allowed', email: hit.email, locale };
    return auth.loading ? { kind: 'loading' } : null;
  }
  return { kind: 'signed_out' };
}

export function useTranslatorGate({
  api,
  auth,
  locale,
  getIdToken,
  cache: cacheOption,
  now: nowOption,
}: UseTranslatorGateOptions): {
  state: GateState;
  recheck: () => void;
} {
  const [defaultCache] = useState(() => sessionGateCache());
  const cache = cacheOption === undefined ? defaultCache : cacheOption;
  const now = nowOption ?? Date.now;
  const [state, setState] = useState<GateState>(() => immediateState(auth, locale, cache, now()) ?? { kind: 'loading' });
  const [nonce, setNonce] = useState(0);
  const uid = auth?.user?.uid ?? null;
  const authLoading = auth ? auth.loading : false;
  const hasAuth = auth !== null;
  const emailVerified = auth?.emailVerified ?? null;

  useEffect(() => {
    let cancelled = false;
    // Equal states keep the previous object, so a re-run never re-renders for nothing.
    const settle = (next: GateState) => {
      if (!cancelled) setState((prev) => (sameGateState(prev, next) ? prev : next));
    };
    const authNow = hasAuth ? { loading: authLoading, user: uid ? { uid } : null, emailVerified } : null;
    const immediate = immediateState(authNow, locale, cache, now());
    // No cached answer for this user: hide until /me answers (never the previous user's state).
    settle(immediate ?? { kind: 'loading' });
    if (!hasAuth || !locale || authLoading) {
      // Nothing to ask yet (or ever).
    } else if (!uid) {
      cache?.clear(locale);
    } else {
      const refuse = (next: GateState) => {
        cache?.clear(locale);
        settle(next);
      };
      void (async () => {
        const token = await getIdToken().catch(() => null);
        if (!token) return refuse({ kind: 'signed_out' });
        const me = await api.me(token);
        if (cancelled) return;
        switch (me.status) {
          case 'allowed':
            if (me.locale.toLowerCase() !== locale.toLowerCase()) return refuse({ kind: 'denied', reason: 'wrong_locale' });
            cache?.write(locale, { uid, email: me.email, at: now() });
            return settle({ kind: 'allowed', email: me.email, locale: me.locale });
          case 'unverified':
            return refuse({ kind: 'unverified' });
          case 'error':
            return refuse({ kind: 'denied', reason: 'error' });
          default:
            return refuse({ kind: 'denied', reason: me.status });
        }
      })();
    }
    return () => {
      cancelled = true;
    };
    // `now` is a test seam read at call time; a new function identity must not re-ask /me.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [api, getIdToken, hasAuth, authLoading, uid, emailVerified, locale, nonce, cache]);

  const recheck = useCallback(() => setNonce((n) => n + 1), []);
  return { state, recheck };
}
