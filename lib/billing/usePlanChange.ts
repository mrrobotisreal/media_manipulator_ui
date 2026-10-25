'use client';

// One client for every Premium <-> Pro action (MM40 decision 4): the /pricing columns, the
// Billing panel and the limit interstitial call the same three functions, so the analytics,
// the error copy and the cache invalidation cannot drift between surfaces.

import * as React from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { useAuth } from '@/lib/auth/AuthProvider';
import type { PaidPlan, PlanChangeResult } from '@/lib/auth/accountApi';
import { changePlan, keepPlan, planChangeErrorKey, type PlanChangeOutcome } from '@/lib/billing/checkout';
import { billingStatusKey } from '@/lib/billing/useBillingStatus';
import { useLocalization } from '@/i18n/useLocalization';

export type PlanChangeAction = 'upgrade' | 'downgrade' | 'keep';

export interface PlanChange {
  busy: boolean;
  /** Runs the action once (re-entry is ignored while one is in flight). */
  run: (action: PlanChangeAction) => Promise<PlanChangeOutcome | null>;
}

export function usePlanChange(): PlanChange {
  const auth = useAuth();
  const queryClient = useQueryClient();
  const { t, formatDate } = useLocalization(['interface']);
  const [busy, setBusy] = React.useState(false);
  const inFlight = React.useRef(false);
  const uid = auth?.user?.uid;
  const refresh = auth?.refresh;

  const run = React.useCallback(
    async (action: PlanChangeAction): Promise<PlanChangeOutcome | null> => {
      if (inFlight.current) return null;
      inFlight.current = true;
      setBusy(true);
      // upgrade: premium -> pro now; downgrade: pro -> premium at period end; keep: stay on pro.
      const from: PaidPlan = action === 'upgrade' ? 'premium' : 'pro';
      try {
        const outcome =
          action === 'keep' ? await keepPlan('pro', 'premium') : await changePlan(from, action === 'upgrade' ? 'pro' : 'premium');
        // Success changed the status (plan, pendingPlan) and, on an upgrade, the tier and its
        // limits; a refusal (same_plan, change_not_available) means what we showed was stale.
        if (outcome.ok || outcome.reason !== 'network') {
          await queryClient.invalidateQueries({ queryKey: billingStatusKey(uid) });
        }
        if (outcome.ok) {
          refresh?.();
          toast.success(successMessage(action, outcome.result, t, formatDate));
        } else {
          toast.error(t(planChangeErrorKey(outcome.reason)));
        }
        return outcome;
      } finally {
        inFlight.current = false;
        setBusy(false);
      }
    },
    [formatDate, queryClient, refresh, t, uid],
  );

  return { busy, run };
}

function successMessage(
  action: PlanChangeAction,
  result: PlanChangeResult,
  t: (key: string, options?: Record<string, unknown>) => string,
  formatDate: (iso: string) => string,
): string {
  if (action === 'upgrade') return t('interface:billing.planChange.upgraded');
  if (action === 'keep') return t('interface:billing.planChange.kept');
  const at = result.pendingPlan?.at;
  return at
    ? t('interface:billing.planChange.scheduled', { date: formatDate(at) })
    : t('interface:billing.planChange.scheduledNoDate');
}
