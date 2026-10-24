'use client';

import { useQuery } from '@tanstack/react-query';

import { useAuth } from '@/lib/auth/AuthProvider';
import { endsAtOf, fetchBillingStatus } from '@/lib/auth/accountApi';
import { getCurrentIdToken } from '@/lib/firebase';

/** Query key shared by every surface that reads GET /api/billing/status. */
export const billingStatusKey = (uid: string | undefined) => ['billing-status', uid ?? 'none'] as const;

/**
 * The server's billing mirror. `enabled` is the caller's extra condition (e.g. "premium only"
 * for the lightweight plan chips); operators never query.
 */
export function useBillingStatus(enabled = true) {
  const auth = useAuth();
  const uid = auth?.user?.uid;
  return useQuery({
    queryKey: billingStatusKey(uid),
    enabled: !!uid && auth?.tier !== 'operator' && enabled,
    staleTime: 30_000,
    retry: 1,
    queryFn: async () => {
      const token = await getCurrentIdToken();
      if (!token) throw new Error('no token');
      return fetchBillingStatus(token);
    },
  });
}

/**
 * When a cancelled-but-active Premium plan ends, or null (not premium, not cancelled, or the
 * status has not loaded). Lets the plan summary and the header chip say "ends {date}" without
 * repeating the billing-panel logic. Only premium accounts query.
 */
export function useCancelledEndsAt(): string | null {
  const auth = useAuth();
  const query = useBillingStatus(auth?.tier === 'premium');
  const status = query.data;
  if (auth?.tier !== 'premium' || !status || status.manualGrant) return null;
  if (status.status && !['active', 'trialing'].includes(status.status)) return null;
  return endsAtOf(status);
}
