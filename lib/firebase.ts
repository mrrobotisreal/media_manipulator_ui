// Firebase client integration — LAZILY initialized. AUTH ONLY.
//
// Nothing initializes Firebase at module-evaluation time, so importing this module
// (directly or transitively) during Next static generation never throws
// `auth/invalid-api-key`, even with blank NEXT_PUBLIC_FB_* env values. The app and auth
// SDKs are created on demand inside async getters, and only in the browser. When the
// config is missing, the getters return null and auth actions fail with a clear message
// rather than crashing public pages.
//
// FIREBASE ANALYTICS AND PERFORMANCE ARE REMOVED, and so are the Mixpanel calls that used
// to live in the sign-in/sign-up/sign-out helpers. Firebase is for authentication and
// nothing else now.
//
// Three reasons, in order of weight:
//   1. Product events belong to the SDK. Emitting "User Signed In" from a Firebase helper
//      meant the auth funnel was split across two systems with two vocabularies, and the
//      first-party pipeline never saw it. `signin_completed` / `signup_completed` /
//      `signout` are emitted by AuthProvider and auth-modal, which are the components that
//      actually know the method and the entry point.
//   2. Firebase Analytics sets its own `_ga`-style identifiers and reports to Google — a
//      second processor to disclose and defend, for data we already collect ourselves.
//   3. Firebase Performance duplicated Core Web Vitals, which lib/analytics/webVitals.ts
//      collects with full attribution.

import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import type { Auth, User } from 'firebase/auth';
import { syncAccount } from './auth/accountApi';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FB_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FB_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FB_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FB_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FB_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FB_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FB_MEASUREMENT_ID,
};

/** True only when every required Firebase config value is present. */
export function hasFirebaseConfig(): boolean {
  return (
    [
      firebaseConfig.apiKey,
      firebaseConfig.authDomain,
      firebaseConfig.projectId,
      firebaseConfig.appId,
    ] as const
  ).every((value) => typeof value === 'string' && value.trim().length > 0);
}

/** Returns the Firebase app, initializing it on first use. Null if unconfigured. */
export function getFirebaseApp(): FirebaseApp | null {
  if (!hasFirebaseConfig()) return null;
  return getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
}

export async function getFirebaseAuth(): Promise<Auth | null> {
  if (typeof window === 'undefined') return null;
  const app = getFirebaseApp();
  if (!app) return null;
  const { getAuth } = await import('firebase/auth');
  return getAuth(app);
}

/**
 * Returns the current user's Firebase ID token, or null when nobody is
 * signed in (or Firebase isn't configured). Used to attach Authorization
 * headers to API calls that MAY be auth-gated server-side (e.g. the
 * video-restore endpoints behind RESTORE_REQUIRE_FIREBASE_AUTH) — harmless
 * when the server flag is off.
 */
export async function getCurrentIdToken(): Promise<string | null> {
  try {
    const auth = await getFirebaseAuth();
    const user = auth?.currentUser;
    if (!user) return null;
    return await user.getIdToken();
  } catch {
    return null;
  }
}

/**
 * Registers a verified sign-in with the API.
 *
 * Tiers, quotas and usage live in Postgres behind the Go API — never in
 * Firestore. This call is idempotent and never changes a tier: it upserts the
 * mm_users row so the account exists, and the server decides everything else.
 *
 * Failures are swallowed on purpose. A sync that cannot reach the API must not
 * turn a successful sign-in into an error the user sees; the AuthProvider
 * retries on its next load, and every tier check is server-side anyway.
 */
async function registerSignIn(user: User, signupSource: string, displayName?: string) {
  try {
    const idToken = await user.getIdToken();
    await syncAccount(idToken, {
      displayName: displayName || user.displayName || undefined,
      signupSource,
    });
  } catch (error) {
    console.warn('Account sync failed; continuing signed in.', error);
  }
}

/** Throw a clear error when an auth action is attempted without Firebase config. */
function firebaseUnavailable(): never {
  const message =
    'Firebase is not configured — set the NEXT_PUBLIC_FB_* environment variables to enable accounts. Authentication is unavailable.';
  if (process.env.NODE_ENV !== 'production') {
    console.warn(message);
  }
  throw new Error(message);
}

export const signInWithGoogle = async () => {
  const auth = await getFirebaseAuth();
  if (!auth) return firebaseUnavailable();
  try {
    const { GoogleAuthProvider, signInWithPopup } = await import('firebase/auth');
    const result = await signInWithPopup(auth, new GoogleAuthProvider());
    await registerSignIn(result.user, 'google');
    // No analytics here. `signin_completed` is emitted by the caller (auth-modal), which
    // knows the entry point that produced the attempt.
    return result.user;
  } catch (error) {
    console.error('Google sign-in error:', error);
    throw error;
  }
};

export const signInWithEmail = async (email: string, password: string) => {
  const auth = await getFirebaseAuth();
  if (!auth) return firebaseUnavailable();
  try {
    const { signInWithEmailAndPassword } = await import('firebase/auth');
    const result = await signInWithEmailAndPassword(auth, email, password);
    await registerSignIn(result.user, 'email');
    return result.user;
  } catch (error) {
    console.error('Email sign-in error:', error);
    throw error;
  }
};

export const signUpWithEmail = async (
  email: string,
  password: string,
  displayName: string,
) => {
  const auth = await getFirebaseAuth();
  if (!auth) return firebaseUnavailable();
  try {
    const { createUserWithEmailAndPassword } = await import('firebase/auth');
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await registerSignIn(result.user, 'email', displayName);
    return result.user;
  } catch (error) {
    console.error('Email sign-up error:', error);
    throw error;
  }
};

export const signOut = async () => {
  const auth = await getFirebaseAuth();
  if (!auth) return;
  try {
    const { signOut: firebaseSignOut } = await import('firebase/auth');
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Sign-out error:', error);
    throw error;
  }
};

// Auth state observer. Returns an unsubscribe function synchronously; the real
// listener attaches once Firebase resolves (browser + configured).
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  let unsubscribe = () => {};
  void getFirebaseAuth().then(async (auth) => {
    if (!auth) {
      callback(null);
      return;
    }
    const { onAuthStateChanged } = await import('firebase/auth');
    unsubscribe = onAuthStateChanged(auth, callback);
  });
  return () => unsubscribe();
};
