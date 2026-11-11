'use client';

import { useEffect } from 'react';
import type { User } from 'firebase/auth';

import { LAB_COOKIE_REFRESH_MS, syncLabCookie } from './session';

/**
 * Keeps the Lab cookie in step with the signed-in operator (MM138). Only a user whose server
 * verdict is `granted` ever gets a cookie; sign-out or any other verdict clears it. Re-runs when
 * the user or verdict changes and every ~45 minutes (the ID token is refreshed by Firebase).
 */
export function useLabSessionCookie(user: User | null, operatorEligibility: string | null): void {
  const granted = user !== null && operatorEligibility === 'granted';
  useEffect(() => {
    const getToken = () => (user ? user.getIdToken() : Promise.resolve(null));
    void syncLabCookie(granted, getToken);
    if (!granted) return;
    const id = setInterval(() => void syncLabCookie(true, getToken), LAB_COOKIE_REFRESH_MS);
    return () => clearInterval(id);
  }, [user, granted]);
}
