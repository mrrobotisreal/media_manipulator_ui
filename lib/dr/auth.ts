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

/** drChangePassword reauthenticates with the CURRENT password and then updates
 *  to the new one — entirely client-side Firebase, the DR API is untouched.
 *  Reauthenticating first satisfies Firebase's recent-login requirement
 *  deterministically, so `auth/requires-recent-login` should never surface.
 *  Throws the raw Firebase error — callers map it with drAuthErrorMessage. */
export async function drChangePassword(currentPassword: string, newPassword: string): Promise<void> {
  const auth = await getFirebaseAuth();
  const user = auth?.currentUser;
  if (!auth || !user?.email) {
    throw new Error('Your session has expired — sign in again to change your password.');
  }
  const { EmailAuthProvider, reauthenticateWithCredential, updatePassword } = await import('firebase/auth');
  const credential = EmailAuthProvider.credential(user.email, currentPassword);
  await reauthenticateWithCredential(user, credential);
  await updatePassword(user, newPassword);
  trackMixpanelEvent('DR Password Changed');
}

/** drAuthErrorMessage maps a Firebase auth error to a friendly message for the
 *  change-password dialog. Raw Firebase error codes are never surfaced. Pure. */
export function drAuthErrorMessage(err: unknown): string {
  const code =
    typeof err === 'object' && err !== null && 'code' in err && typeof (err as { code: unknown }).code === 'string'
      ? (err as { code: string }).code
      : '';
  switch (code) {
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Current password is incorrect.';
    case 'auth/weak-password':
      return 'New password is too weak — use at least 10 characters.';
    case 'auth/too-many-requests':
      return 'Too many attempts — wait a few minutes and try again.';
    case 'auth/network-request-failed':
      return 'Network error — check your connection.';
    default:
      return "Couldn't update the password. Please try again.";
  }
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
