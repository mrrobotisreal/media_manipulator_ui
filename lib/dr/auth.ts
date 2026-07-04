'use client';

// Double Raven portal auth — a deliberately THIN module, separate from the
// public site's account system (lib/firebase.ts signIn/signUp + auth-modal).
// It intentionally does NOT: create accounts, write Firestore user profiles,
// set Mixpanel people-profiles, offer Google/OAuth, or expose password reset.
// Accounts are provisioned by hand in the Firebase console — the portal is for
// exactly two people. The real security boundary is the API (Firebase ID-token
// verification + email allowlist on /api/dr/*); this is just the sign-in seam.

import { useEffect, useState } from 'react';
import type { User } from 'firebase/auth';
import { getFirebaseAuth, onAuthStateChange } from '@/lib/firebase';
import { trackMixpanelEvent } from '@/lib/analytics';

// One generic message for every failed sign-in, so we never reveal whether an
// account exists (auth/invalid-credential, auth/user-not-found,
// auth/wrong-password, auth/too-many-requests, auth/invalid-email all map here).
const GENERIC_SIGN_IN_ERROR = 'Invalid email or password.';

/** drSignIn authenticates with email + password only. Throws an Error whose
 *  message is safe to surface directly in the UI. */
export async function drSignIn(email: string, password: string): Promise<User> {
  const auth = await getFirebaseAuth();
  if (!auth) {
    // Missing NEXT_PUBLIC_FB_* config — a deployment problem, not a credential
    // one. Distinct message so it isn't mistaken for a bad password.
    throw new Error('Authentication is unavailable. Please try again later.');
  }
  try {
    const { signInWithEmailAndPassword } = await import('firebase/auth');
    const { user } = await signInWithEmailAndPassword(auth, email.trim(), password);
    trackMixpanelEvent('DR Signed In');
    return user;
  } catch {
    // Swallow the Firebase error code — always return the same generic message.
    throw new Error(GENERIC_SIGN_IN_ERROR);
  }
}

/** drSignOut is a plain Firebase sign-out (no profile bookkeeping). */
export async function drSignOut(): Promise<void> {
  const auth = await getFirebaseAuth();
  if (!auth) return;
  const { signOut } = await import('firebase/auth');
  await signOut(auth);
  trackMixpanelEvent('DR Signed Out');
}

export type DrAuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

export interface DrAuthState {
  user: User | null;
  status: DrAuthStatus;
}

/** useDrAuthState subscribes to Firebase auth state. Starts in 'loading' until
 *  the first callback resolves (browser + configured), then reflects presence
 *  of a signed-in user. Used by the gate and the shell. */
export function useDrAuthState(): DrAuthState {
  const [state, setState] = useState<DrAuthState>({ user: null, status: 'loading' });

  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      setState({ user, status: user ? 'authenticated' : 'unauthenticated' });
    });
    return unsubscribe;
  }, []);

  return state;
}
