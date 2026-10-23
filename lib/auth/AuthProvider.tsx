'use client';

// The single source of truth in the UI for who is signed in and what they are
// allowed to do.
//
// It holds no policy of its own. Tier, limits and usage all come from the API
// (`/api/account/me` when signed in, `/api/account/usage` when not), because
// Postgres behind the Go API is the only place entitlement is decided. A number
// hard-coded here would be a second source of truth that silently drifts.

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import dynamic from 'next/dynamic';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { User } from 'firebase/auth';

import {
  onAuthStateChange,
  signInWithEmail,
  signInWithGoogle as firebaseSignInWithGoogle,
  signOut as firebaseSignOut,
  signUpWithEmail,
  getCurrentIdToken,
  refreshIdentity,
  sendVerificationEmail,
} from '@/lib/firebase';
import { analytics, EVENTS, getSessionId } from '@/lib/analytics';
import {
  allowanceFor,
  fetchAccount,
  fetchUsage,
  type AccountSnapshot,
  type OperatorEligibility,
  type Tier,
  type TierLimits,
  type UsageMetric,
} from './accountApi';
import {
  lastQuotaState,
  resetQuotaState,
  subscribeLimitRefusal,
  subscribeQuotaExceeded,
  subscribeQuotaState,
} from './quotaBus';
import type { InterstitialDetail } from '@/components/account/upgrade-interstitial';
import { formatResetsIn } from './formatLimits';
import { useLocalization } from '@/i18n/useLocalization';

/** How the account panel should be opened when something asks for it. */
export type AuthIntent = 'signin' | 'signup' | 'upgrade';

export interface OpenAuthOptions {
  intent?: AuthIntent;
  /** Replaces the panel's default headline — used for the contextual 429 copy. */
  headline?: string;
  /** Replaces the default supporting line. */
  body?: string;
  /** Tags the analytics events so we can tell which surface converted. */
  source?: string;
}

/** What the account panel is currently showing, if anything. */
export interface AuthPromptState extends OpenAuthOptions {
  open: boolean;
  intent: AuthIntent;
}

export interface AuthContextValue {
  /** The Firebase user, or null when signed out. */
  user: User | null;
  tier: Tier;
  limits: TierLimits | null;
  /** Today's counts, keyed by metric. */
  usage: Partial<Record<UsageMetric, number>>;
  /** ISO timestamp of the next UTC midnight rollover. */
  resetsAt: string | null;
  /** True until the first identity resolution completes. */
  loading: boolean;
  /** True while the account/usage snapshot is in flight. */
  refreshing: boolean;

  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  /** Re-reads the snapshot from the API. */
  refresh: () => void;

  /**
   * The server's verdict on the signed-in address and the operator allowlist.
   * 'unverified' means the only thing missing is email verification.
   */
  operatorEligibility: OperatorEligibility | null;
  /** The ID token's email_verified claim, as the server last saw it. */
  emailVerified: boolean | null;
  /** Sends Firebase's verification link to the signed-in address. */
  sendVerificationEmail: () => Promise<void>;
  /**
   * Forces a fresh user record + ID token (so a just-clicked verification link
   * takes effect now rather than when the cached token expires), then refetches
   * the snapshot. Resolves to the new emailVerified value.
   */
  refreshIdentity: () => Promise<boolean | null>;

  /** How much of `metric` remains today. Null when the metric is uncounted or unlimited. */
  remainingFor: (metric: UsageMetric) => number | null;
  /** The daily allowance; 0 when uncounted, negative when unlimited (operator). */
  allowanceOf: (metric: UsageMetric) => number;

  /** The account panel's current state. */
  prompt: AuthPromptState;
  openAuth: (options?: OpenAuthOptions) => void;
  closeAuth: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * Reads the auth context.
 *
 * Returns null outside the provider rather than throwing: the chromeless
 * /embed and /dr trees deliberately do not mount it, and a shared component
 * rendered in both places must degrade rather than crash.
 */
export function useAuth(): AuthContextValue | null {
  return useContext(AuthContext);
}

/** The signed-out defaults, used until the first snapshot lands. */
const ANONYMOUS_TIER: Tier = 'anonymous';

const CLOSED_PROMPT: AuthPromptState = { open: false, intent: 'signup' };

/**
 * The account panel is a modal that most visitors never open, so it is not in
 * anyone's first load. `ssr: false` because it is behind a user gesture and has
 * nothing to contribute to the prerendered HTML — and because prerendering a
 * closed dialog is pure bytes.
 */
const AuthModal = dynamic(() => import('@/components/auth-modal'), { ssr: false });

/** Same reasoning: the plan-limit dialog only exists after a refusal. */
const UpgradeInterstitial = dynamic(() => import('@/components/account/upgrade-interstitial'), {
  ssr: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const { t } = useLocalization(['interface']);
  const [user, setUser] = useState<User | null>(null);
  const [identityResolved, setIdentityResolved] = useState(false);
  // Quota state observed on ordinary API responses, which is fresher than the
  // last snapshot fetch and costs no extra request.
  const [observed, setObserved] = useState(lastQuotaState);
  const [prompt, setPrompt] = useState<AuthPromptState>(CLOSED_PROMPT);
  const [interstitial, setInterstitial] = useState<InterstitialDetail | null>(null);
  const syncedUidRef = useRef<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChange((next) => {
      setUser(next);
      setIdentityResolved(true);
      // The allowance belongs to a different subject now; drop what we cached
      // for the previous one so the meter never shows a stale number.
      if (next?.uid !== syncedUidRef.current) {
        syncedUidRef.current = next?.uid ?? null;
        resetQuotaState();
        setObserved(null);
      }
    });
    return unsubscribe;
  }, []);

  useEffect(() => subscribeQuotaState(setObserved), []);

  // A 429 from anywhere in the app opens the panel already explaining what
  // happened. The headline is driven by the server's `upgradePath`, never
  // guessed here: telling someone to buy Premium when a free account would
  // have solved it is both wrong and a worse conversation.
  useEffect(
    () =>
      subscribeQuotaExceeded((detail) => {
        const key = detail.upgradePath === 'signup' ? 'signup' : 'premium';
        const resets = formatResetsIn(detail.resetsAt);
        // THE exact instant of monetization friction, and priority 0 for that reason: the
        // visitor wanted to do something and was told no. This is the one subscriber that
        // sees every 429 in the app regardless of which tool produced it, which is why the
        // event lives here rather than in each hook's error path.
        //
        // The API emits `server_quota_rejected` for the same moment. Both are wanted: this
        // one says the visitor SAW the block, that one says it HAPPENED, and the gap between
        // the counts is how often a 429 lands somewhere the UI never surfaced.
        analytics.track(EVENTS.QUOTA_EXCEEDED_SHOWN, {
          limit: detail.limit,
          scope: detail.metric,
        });
        // A free account at its cap has already signed up: sending it to a sign-up modal is
        // wrong, so 'premium' goes to the plan-limit dialog (Checkout) instead.
        if (detail.upgradePath === 'premium') {
          setInterstitial({ kind: 'quota', detail });
          return;
        }
        setPrompt({
          open: true,
          intent: 'signup',
          source: `quota_${detail.metric}`,
          headline: t(`interface:authModal.contextual.${key}Title`, { limit: detail.limit }),
          body: [
            t(`interface:authModal.contextual.${key}Body`),
            resets ? t('interface:authModal.contextual.resets', { when: resets }) : '',
          ]
            .filter(Boolean)
            .join(' '),
        });
      }),
    [t],
  );

  // 403 output_height_limited / project_limit_reached, published by authedFetch. The caller
  // keeps its own error path; this adds the upgrade moment on top of it.
  useEffect(
    () =>
      subscribeLimitRefusal((detail) => {
        analytics.track(EVENTS.QUOTA_EXCEEDED_SHOWN, { limit: detail.limit, scope: detail.error });
        setInterstitial({ kind: 'limit', detail });
      }),
    [],
  );

  const signedIn = user !== null;

  const snapshotQuery = useQuery<AccountSnapshot>({
    // The uid is part of the key so signing in or out swaps caches rather than
    // briefly showing the previous person's allowance.
    queryKey: ['account-snapshot', user?.uid ?? 'anonymous'],
    enabled: identityResolved,
    staleTime: 60_000,
    // Nothing here is worth retrying hard; the meter is not load-bearing.
    retry: 1,
    queryFn: async () => {
      if (signedIn) {
        const idToken = await getCurrentIdToken();
        if (idToken) return fetchAccount(idToken);
      }
      return fetchUsage(getSessionId());
    },
  });

  const snapshot = snapshotQuery.data;

  // The observed headers only win when they describe the same tier the
  // snapshot does — otherwise a header left over from before a sign-in could
  // pin the meter to the wrong allowance.
  const tier: Tier = observed?.tier ?? snapshot?.tier ?? ANONYMOUS_TIER;
  const limits = snapshot?.limits ?? null;

  const allowanceOf = useCallback(
    (metric: UsageMetric) => {
      if (observed?.tier === tier && observed.limit !== undefined && metric === 'ops') {
        return observed.limit;
      }
      return allowanceFor(limits ?? undefined, metric);
    },
    [limits, observed, tier],
  );

  const usage = useMemo<Partial<Record<UsageMetric, number>>>(() => {
    const base = { ...(snapshot?.usage ?? {}) };
    // A remaining count from the last gated response is newer than the
    // snapshot, so derive `ops` used from it when the tiers agree.
    if (observed?.tier === tier && observed.remaining !== undefined && observed.limit !== undefined) {
      base.ops = Math.max(0, observed.limit - observed.remaining);
    }
    return base;
  }, [observed, snapshot, tier]);

  const remainingFor = useCallback(
    (metric: UsageMetric): number | null => {
      const allowance = allowanceOf(metric);
      // 0 is uncounted and a negative value is unlimited (operator): neither
      // has a remaining count to report.
      if (allowance <= 0) return null;
      return Math.max(0, allowance - (usage[metric] ?? 0));
    },
    [allowanceOf, usage],
  );

  const refresh = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: ['account-snapshot'] });
  }, [queryClient]);

  const refreshIdentityAndSnapshot = useCallback(async () => {
    const verified = await refreshIdentity();
    // The tier may have changed with the claim; the snapshot is the only thing
    // that knows, so it must be refetched with the new token, not read from cache.
    await queryClient.invalidateQueries({ queryKey: ['account-snapshot'] });
    return verified;
  }, [queryClient]);

  const openAuth = useCallback((options: OpenAuthOptions = {}) => {
    setPrompt({ open: true, intent: options.intent ?? 'signup', ...options });
  }, []);

  const closeAuth = useCallback(() => {
    // Keep the copy while the exit transition plays; only `open` flips, so the
    // headline does not blink back to the default on the way out.
    setPrompt((current) => ({ ...current, open: false }));
  }, []);

  const signIn = useCallback(
    async (email: string, password: string) => {
      await signInWithEmail(email, password);
      setPrompt(CLOSED_PROMPT);
      refresh();
    },
    [refresh],
  );

  const signUp = useCallback(
    async (email: string, password: string, displayName: string) => {
      await signUpWithEmail(email, password, displayName);
      setPrompt(CLOSED_PROMPT);
      refresh();
    },
    [refresh],
  );

  const signInWithGoogle = useCallback(async () => {
    await firebaseSignInWithGoogle();
    setPrompt(CLOSED_PROMPT);
    refresh();
  }, [refresh]);

  const signOut = useCallback(async () => {
    await firebaseSignOut();
    // `signout` is emitted HERE rather than in lib/firebase.ts, because this is the layer
    // that owns the product meaning of signing out (quota state, the observed snapshot).
    // The visitor id deliberately persists — rotating it would make every sign-out look
    // like a brand-new device and destroy the return-visitor signal.
    analytics.track(EVENTS.SIGNOUT);
    analytics.reset();
    resetQuotaState();
    setObserved(null);
    refresh();
  }, [refresh]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      tier,
      limits,
      usage,
      resetsAt: observed?.resetsAt ?? snapshot?.resetsAt ?? null,
      loading: !identityResolved || (snapshotQuery.isLoading && !snapshot),
      refreshing: snapshotQuery.isFetching,
      signIn,
      signUp,
      signInWithGoogle,
      signOut,
      refresh,
      remainingFor,
      allowanceOf,
      operatorEligibility: snapshot?.operatorEligibility ?? null,
      emailVerified: snapshot?.emailVerified ?? null,
      sendVerificationEmail,
      refreshIdentity: refreshIdentityAndSnapshot,
      prompt,
      openAuth,
      closeAuth,
    }),
    [
      allowanceOf,
      closeAuth,
      openAuth,
      prompt,
      identityResolved,
      limits,
      observed,
      refresh,
      refreshIdentityAndSnapshot,
      remainingFor,
      signIn,
      signInWithGoogle,
      signOut,
      signUp,
      snapshot,
      snapshotQuery.isFetching,
      snapshotQuery.isLoading,
      tier,
      usage,
      user,
    ],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
      {prompt.open ? <AuthModal /> : null}
      {interstitial ? (
        <UpgradeInterstitial input={interstitial} onClose={() => setInterstitial(null)} />
      ) : null}
    </AuthContext.Provider>
  );
}
