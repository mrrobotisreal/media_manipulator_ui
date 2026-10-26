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

export interface UseTranslatorGateOptions {
  api: TranslatorApi;
  /** `useAuth()`; null outside the AuthProvider (chromeless routes): no panel. */
  auth: GateAuth | null;
  /** The deployment's locale (`translatorLocale()`); null = not armed, no panel. */
  locale: string | null;
  /** Firebase ID token of the signed-in user. */
  getIdToken: () => Promise<string | null>;
}

export function useTranslatorGate({ api, auth, locale, getIdToken }: UseTranslatorGateOptions): {
  state: GateState;
  recheck: () => void;
} {
  const [state, setState] = useState<GateState>({ kind: 'loading' });
  const [nonce, setNonce] = useState(0);
  const uid = auth?.user?.uid ?? null;
  const authLoading = auth ? auth.loading : false;
  const hasAuth = auth !== null;
  const emailVerified = auth?.emailVerified ?? null;

  useEffect(() => {
    let cancelled = false;
    const settle = (next: GateState) => {
      if (!cancelled) setState(next);
    };
    if (!hasAuth || !locale) {
      settle({ kind: 'denied', reason: !hasAuth ? 'no_auth' : 'not_armed' });
    } else if (authLoading) {
      settle({ kind: 'loading' });
    } else if (!uid) {
      settle({ kind: 'signed_out' });
    } else {
      void (async () => {
        const token = await getIdToken().catch(() => null);
        if (!token) return settle({ kind: 'signed_out' });
        const me = await api.me(token);
        switch (me.status) {
          case 'allowed':
            return settle(
              me.locale.toLowerCase() === locale.toLowerCase()
                ? { kind: 'allowed', email: me.email, locale: me.locale }
                : { kind: 'denied', reason: 'wrong_locale' },
            );
          case 'unverified':
            return settle({ kind: 'unverified' });
          case 'error':
            return settle({ kind: 'denied', reason: 'error' });
          default:
            return settle({ kind: 'denied', reason: me.status });
        }
      })();
    }
    return () => {
      cancelled = true;
    };
  }, [api, getIdToken, hasAuth, authLoading, uid, emailVerified, locale, nonce]);

  const recheck = useCallback(() => setNonce((n) => n + 1), []);
  return { state, recheck };
}
