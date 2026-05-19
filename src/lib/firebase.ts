import { initializeApp } from 'firebase/app';
import { getAnalytics, type Analytics } from 'firebase/analytics';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  increment,
} from 'firebase/firestore';
import mixpanel from 'mixpanel-browser';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FB_API_KEY,
  authDomain: import.meta.env.VITE_FB_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FB_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FB_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FB_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FB_APP_ID,
  measurementId: import.meta.env.VITE_FB_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

interface UserProfile {
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

const TIER_LIMITS = {
  free: { conversions: 5, maxFileSizeMB: 50 },
  starter: { conversions: 100, maxFileSizeMB: 500 },
  pro: { conversions: -1, maxFileSizeMB: 2000 }, // -1 = unlimited
  business: { conversions: -1, maxFileSizeMB: 5000 }
};

const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    await createOrUpdateUserProfile(result.user, 'google');

    mixpanel.track('User Signed In', {
      method: 'google',
      user_id: result.user.uid
    });

    return result.user;
  } catch (error) {
    console.error('Google sign-in error:', error);
    throw error;
  }
};

const signInWithEmail = async (email: string, password: string) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    await updateUserProfile(result.user.uid, { lastLoginAt: new Date().toISOString() });

    mixpanel.track('User Signed In', {
      method: 'email',
      user_id: result.user.uid
    });

    return result.user;
  } catch (error) {
    console.error('Email sign-in error:', error);
    throw error;
  }
};

const signUpWithEmail = async (email: string, password: string, displayName: string) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await createOrUpdateUserProfile(result.user, 'email', displayName);

    mixpanel.track('User Signed Up', {
      method: 'email',
      user_id: result.user.uid
    });

    return result.user;
  } catch (error) {
    console.error('Email sign-up error:', error);
    throw error;
  }
};

const signOut = async () => {
  try {
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
  displayName?: string
) => {
  const userRef = doc(db, 'users', user.uid);
  const userDoc = await getDoc(userRef);

  const now = new Date().toISOString();
  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM

  if (!userDoc.exists()) {
    // New user
    const userProfile: UserProfile = {
      uid: user.uid,
      email: user.email!,
      displayName: displayName || user.displayName || 'User',
      photoURL: user.photoURL || undefined,
      tier: 'free',
      monthlyUsage: {
        conversions: 0,
        lastResetDate: currentMonth
      },
      totalUsage: {
        conversions: 0,
        filesProcessed: 0
      },
      createdAt: now,
      lastLoginAt: now,
      signupSource: signupMethod
    };

    await setDoc(userRef, userProfile);

    // Set Mixpanel user properties
    mixpanel.people.set({
      '$email': user.email,
      '$name': userProfile.displayName,
      'User Tier': 'free',
      'Signup Date': now,
      'Signup Method': signupMethod,
      'Total Conversions': 0
    });

    return userProfile;
  } else {
    // Existing user
    const updates = {
      lastLoginAt: now,
      ...(displayName && { displayName })
    };
    await updateDoc(userRef, updates);
    return { ...userDoc.data(), ...updates } as UserProfile;
  }
};

const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    const userRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userRef);
    return userDoc.exists() ? userDoc.data() as UserProfile : null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
};

const updateUserProfile = async (uid: string, updates: Partial<UserProfile>) => {
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, updates);
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

const incrementUsage = async (uid: string, type: 'conversions' | 'filesProcessed') => {
  try {
    const userRef = doc(db, 'users', uid);
    const currentMonth = new Date().toISOString().slice(0, 7);

    await updateDoc(userRef, {
      [`monthlyUsage.${type}`]: increment(1),
      [`totalUsage.${type}`]: increment(1),
      'monthlyUsage.lastResetDate': currentMonth
    });

    // Update Mixpanel
    mixpanel.people.increment({
      'Total Conversions': type === 'conversions' ? 1 : 0,
      'Files Processed': type === 'filesProcessed' ? 1 : 0
    });

  } catch (error) {
    console.error('Error incrementing usage:', error);
    throw error;
  }
};

const checkUsageLimits = (userProfile: UserProfile, fileSize: number): {
  canConvert: boolean;
  reason?: string;
  conversionsRemaining?: number;
} => {
  const limits = TIER_LIMITS[userProfile.tier];
  const fileSizeMB = fileSize / 1024 / 1024;

  // Check file size limit
  if (fileSizeMB > limits.maxFileSizeMB) {
    return {
      canConvert: false,
      reason: `File size (${fileSizeMB.toFixed(1)}MB) exceeds limit of ${limits.maxFileSizeMB}MB for ${userProfile.tier} tier`
    };
  }

  // Check conversion limit (unlimited = -1)
  if (limits.conversions !== -1 && userProfile.monthlyUsage.conversions >= limits.conversions) {
    return {
      canConvert: false,
      reason: `Monthly conversion limit reached (${limits.conversions} conversions)`
    };
  }

  const conversionsRemaining = limits.conversions === -1
    ? -1
    : limits.conversions - userProfile.monthlyUsage.conversions;

  return {
    canConvert: true,
    conversionsRemaining
  };
};

// Auth state observer
const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

let analytics: Analytics | null = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);

  // Defer Firebase Performance to idle time so it never blocks the main
  // thread on first load. Imported dynamically so the firebase/performance
  // bundle stays out of the initial chunk.
  const initPerformance = () => {
    void import('firebase/performance')
      .then((mod) => mod.getPerformance(app))
      .catch(() => {
        // Performance monitoring is best-effort; ignore failures.
      });
  };
  const ric = (
    window as typeof window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
    }
  ).requestIdleCallback;
  if (typeof ric === 'function') {
    ric(initPerformance, { timeout: 4000 });
  } else {
    window.setTimeout(initPerformance, 2500);
  }
}

export {
  // Firebase inits
  analytics,
  auth,
  db,
  // Auth
  signInWithGoogle,
  signInWithEmail,
  signUpWithEmail,
  signOut,
  // User Profile
  TIER_LIMITS,
  type UserProfile,
  getUserProfile,
  updateUserProfile,
  incrementUsage,
  checkUsageLimits,
  onAuthStateChange,
};
export default app;