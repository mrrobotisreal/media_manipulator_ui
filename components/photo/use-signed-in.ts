'use client';

import * as React from 'react';

import { onAuthStateChange } from '@/lib/firebase';

/**
 * Signed-in state for the chromeless Aperture editor. `/photo/*` mounts no
 * AuthProvider (no account listener, no quota polling, no analytics), so it
 * listens to Firebase directly. `null` until Firebase answers.
 */
export function useSignedIn(): boolean | null {
  const [signedIn, setSignedIn] = React.useState<boolean | null>(null);
  React.useEffect(() => onAuthStateChange((user) => setSignedIn(!!user)), []);
  return signedIn;
}
