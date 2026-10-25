'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';

import { BillingPanel } from '@/components/account/billing-panel';
import { PlanLadder } from '@/components/account/plan-summary';
import { useAuth } from '@/lib/auth/AuthProvider';
import { fetchTiers } from '@/lib/auth/accountApi';

/**
 * Billing slot. MM19's panel owns all billing logic (status, checkout, portal, and since MM40
 * plan changes); this tab gives it a place to live, with the four-rung plan ladder below it
 * (MM40 decision 6). The ladder shares the panel's ['tiers'] query, so it costs no request.
 */
export const BillingTab: React.FC = () => {
  const auth = useAuth();
  const tiersQuery = useQuery({
    queryKey: ['tiers'],
    queryFn: ({ signal }) => fetchTiers(signal),
    staleTime: 5 * 60_000,
    retry: 1,
  });
  return (
    <div className="grid gap-6">
      <BillingPanel />
      <PlanLadder tiers={tiersQuery.data} currentTier={auth?.tier} />
    </div>
  );
};

export default BillingTab;
