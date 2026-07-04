'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DrApiError } from './docsApi';

// Centralized handling for a stale/expired session surfaced by a DR query: a
// 401 means the Firebase token is gone or invalid, so send the user back to
// sign in. 403 (not allowlisted) and 404 (missing doc) are NOT redirected —
// those are rendered inline by the views. Implemented once here so pages don't
// each re-derive it.
export function useDrQueryErrorRedirect(error: unknown): void {
  const router = useRouter();
  useEffect(() => {
    if (error instanceof DrApiError && error.status === 401) {
      router.replace('/dr/auth');
    }
  }, [error, router]);
}
