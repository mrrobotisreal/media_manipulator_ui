import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { type User } from 'firebase/auth';
import {
  onAuthStateChange,
  getUserProfile,
  type UserProfile,
  incrementUsage,
  checkUsageLimits
} from '@/lib/firebase';
import mixpanel from 'mixpanel-browser';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  canUserConvert: (fileSize: number) => {
    canConvert: boolean;
    reason?: string;
    conversionsRemaining?: number;
  };
  incrementUserUsage: (type: 'conversions' | 'filesProcessed') => Promise<void>;
  refreshUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (user) => {
      setUser(user);

      if (user) {
        // User signed in, get their profile
        const profile = await getUserProfile(user.uid);
        setUserProfile(profile);

        // Set up Mixpanel identify
        mixpanel.identify(user.uid);
        mixpanel.people.set({
          '$email': user.email,
          '$name': profile?.displayName || user.displayName,
          'User Tier': profile?.tier || 'free'
        });

        // Track login
        mixpanel.track('User Session Started', {
          user_id: user.uid,
          user_tier: profile?.tier || 'free',
          returning_user: true
        });
      } else {
        // User signed out
        setUserProfile(null);
        mixpanel.reset();
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const canUserConvert = (fileSize: number) => {
    if (!userProfile) {
      return { canConvert: false, reason: 'Please sign in to convert files' };
    }

    return checkUsageLimits(userProfile, fileSize);
  };

  const incrementUserUsage = async (type: 'conversions' | 'filesProcessed') => {
    if (!user || !userProfile) return;

    await incrementUsage(user.uid, type);

    // Update local state
    setUserProfile(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        monthlyUsage: {
          ...prev.monthlyUsage,
          // @ts-expect-error - type is either 'conversions' or 'filesProcessed'
          [type]: prev.monthlyUsage[type] + 1
        },
        totalUsage: {
          ...prev.totalUsage,
          [type]: prev.totalUsage[type] + 1
        }
      };
    });
  };

  const refreshUserProfile = async () => {
    if (!user) return;
    const profile = await getUserProfile(user.uid);
    setUserProfile(profile);
  };

  const value: AuthContextType = {
    user,
    userProfile,
    loading,
    canUserConvert,
    incrementUserUsage,
    refreshUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
