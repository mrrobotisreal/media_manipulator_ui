// Firebase client integration — LAZILY initialized.
//
// Nothing initializes Firebase at module-evaluation time, so importing this
// module (directly or transitively) during Next static generation never throws
// `auth/invalid-api-key`, even with blank NEXT_PUBLIC_FB_* env values. The app,
// auth, firestore, and analytics SDKs are created on demand inside async
// getters, and only in the browser where relevant. When the config is missing,
// the getters return null and auth actions fail with a clear message rather
// than crashing public pages.

import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import type { Auth, User } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';
import type { Analytics } from 'firebase/analytics';
import mixpanel from 'mixpanel-browser';

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

export async function getFirebaseDb(): Promise<Firestore | null> {
  const app = getFirebaseApp();
  if (!app) return null;
  const { getFirestore } = await import('firebase/firestore');
  return getFirestore(app);
}

export async function getFirebaseAnalytics(): Promise<Analytics | null> {
  if (typeof window === 'undefined') return null;
  const app = getFirebaseApp();
  if (!app) return null;
  const { isSupported, getAnalytics } = await import('firebase/analytics');
  const supported = await isSupported().catch(() => false);
  if (!supported) return null;
  const analytics = getAnalytics(app);

  // Defer Firebase Performance to idle time so it never blocks the main thread.
  const initPerformance = () => {
    void import('firebase/performance')
      .then((mod) => mod.getPerformance(app))
      .catch(() => {
        // Performance monitoring is best-effort.
      });
  };
  const ric = (
    window as typeof window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
    }
  ).requestIdleCallback;
  if (typeof ric === 'function') ric(initPerformance, { timeout: 4000 });
  else window.setTimeout(initPerformance, 2500);

  return analytics;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  tier: 'free' | 'starter' | 'pro' | 'business';
  subscriptionId?: string;
  subscriptionStatus?: 'active' | 'cancelled' | 'trial';
  monthlyUsage: {
    conversions: number;
    lastResetDate: string;
  };
  totalUsage: {
    conversions: number;
    filesProcessed: number;
  };
  createdAt: string;
  lastLoginAt: string;
  signupSource?: string;
}

export const TIER_LIMITS = {
  free: { conversions: 5, maxFileSizeMB: 50 },
  starter: { conversions: 100, maxFileSizeMB: 500 },
  pro: { conversions: -1, maxFileSizeMB: 2000 }, // -1 = unlimited
  business: { conversions: -1, maxFileSizeMB: 5000 },
};

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
    await createOrUpdateUserProfile(result.user, 'google');
    mixpanel.track('User Signed In', { method: 'google', user_id: result.user.uid });
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
    await updateUserProfile(result.user.uid, { lastLoginAt: new Date().toISOString() });
    mixpanel.track('User Signed In', { method: 'email', user_id: result.user.uid });
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
    await createOrUpdateUserProfile(result.user, 'email', displayName);
    mixpanel.track('User Signed Up', { method: 'email', user_id: result.user.uid });
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
    mixpanel.track('User Signed Out');
  } catch (error) {
    console.error('Sign-out error:', error);
    throw error;
  }
};

const createOrUpdateUserProfile = async (
  user: User,
  signupMethod: string,
  displayName?: string,
) => {
  const db = await getFirebaseDb();
  if (!db) return firebaseUnavailable();
  const { doc, setDoc, getDoc, updateDoc } = await import('firebase/firestore');
  const userRef = doc(db, 'users', user.uid);
  const userDoc = await getDoc(userRef);

  const now = new Date().toISOString();
  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM

  if (!userDoc.exists()) {
    const userProfile: UserProfile = {
      uid: user.uid,
      email: user.email!,
      displayName: displayName || user.displayName || 'User',
      photoURL: user.photoURL || undefined,
      tier: 'free',
      monthlyUsage: { conversions: 0, lastResetDate: currentMonth },
      totalUsage: { conversions: 0, filesProcessed: 0 },
      createdAt: now,
      lastLoginAt: now,
      signupSource: signupMethod,
    };

    await setDoc(userRef, userProfile);

    mixpanel.people.set({
      $email: user.email,
      $name: userProfile.displayName,
      'User Tier': 'free',
      'Signup Date': now,
      'Signup Method': signupMethod,
      'Total Conversions': 0,
    });

    return userProfile;
  } else {
    const updates = {
      lastLoginAt: now,
      ...(displayName && { displayName }),
    };
    await updateDoc(userRef, updates);
    return { ...userDoc.data(), ...updates } as UserProfile;
  }
};

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    const db = await getFirebaseDb();
    if (!db) return null;
    const { doc, getDoc } = await import('firebase/firestore');
    const userRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userRef);
    return userDoc.exists() ? (userDoc.data() as UserProfile) : null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
};

export const updateUserProfile = async (
  uid: string,
  updates: Partial<UserProfile>,
) => {
  try {
    const db = await getFirebaseDb();
    if (!db) return;
    const { doc, updateDoc } = await import('firebase/firestore');
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, updates);
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

export const incrementUsage = async (
  uid: string,
  type: 'conversions' | 'filesProcessed',
) => {
  try {
    const db = await getFirebaseDb();
    if (!db) return;
    const { doc, updateDoc, increment } = await import('firebase/firestore');
    const userRef = doc(db, 'users', uid);
    const currentMonth = new Date().toISOString().slice(0, 7);

    await updateDoc(userRef, {
      [`monthlyUsage.${type}`]: increment(1),
      [`totalUsage.${type}`]: increment(1),
      'monthlyUsage.lastResetDate': currentMonth,
    });

    mixpanel.people.increment({
      'Total Conversions': type === 'conversions' ? 1 : 0,
      'Files Processed': type === 'filesProcessed' ? 1 : 0,
    });
  } catch (error) {
    console.error('Error incrementing usage:', error);
    throw error;
  }
};

export const checkUsageLimits = (
  userProfile: UserProfile,
  fileSize: number,
): {
  canConvert: boolean;
  reason?: string;
  conversionsRemaining?: number;
} => {
  const limits = TIER_LIMITS[userProfile.tier];
  const fileSizeMB = fileSize / 1024 / 1024;

  if (fileSizeMB > limits.maxFileSizeMB) {
    return {
      canConvert: false,
      reason: `File size (${fileSizeMB.toFixed(1)}MB) exceeds limit of ${limits.maxFileSizeMB}MB for ${userProfile.tier} tier`,
    };
  }

  if (
    limits.conversions !== -1 &&
    userProfile.monthlyUsage.conversions >= limits.conversions
  ) {
    return {
      canConvert: false,
      reason: `Monthly conversion limit reached (${limits.conversions} conversions)`,
    };
  }

  const conversionsRemaining =
    limits.conversions === -1
      ? -1
      : limits.conversions - userProfile.monthlyUsage.conversions;

  return { canConvert: true, conversionsRemaining };
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
