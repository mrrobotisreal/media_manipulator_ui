'use client';

import * as React from 'react';

import { onAuthStateChange } from '@/lib/firebase';

/**
 * Signed-in state for the chromeless Motion editor. `/motion/*` mounts no
 * AuthProvider (MM42: no account listener, no quota polling, no analytics),
 * so it listens to Firebase directly. `null` until Firebase answers; `false`
 * when Firebase is not configured.
 */
export function useSignedIn(): boolean | null {
  const [signedIn, setSignedIn] = React.useState<boolean | null>(null);
  React.useEffect(() => onAuthStateChange((user) => setSignedIn(!!user)), []);
  return signedIn;
}
