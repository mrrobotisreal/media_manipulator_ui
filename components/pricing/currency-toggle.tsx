'use client';

import * as React from 'react';
import { Lock } from 'lucide-react';

import { Segmented } from '@/components/darkroom/segmented';
import type { BillingCurrency } from '@/lib/auth/accountApi';
import { useCurrency } from '@/lib/billing/useCurrency';
import { useLocalization } from '@/i18n/useLocalization';
import { isIrreversibleActionHidden } from '@/lib/translator/mode';
import { cn } from '@/lib/utils';

/**
 * The USD · EUR switch (MM69, design PRO_TIER.md §7.6), an Instrument Segmented beside the
 * interval toggle on /pricing, in the Billing panel and in the upgrade prompts.
 *
 * - Hidden while the API does not sell EUR (an older API, or /api/tiers not loaded yet) and
 *   on translator deployments (MM52: billing is hidden there).
 * - Locked (a subscription exists or a past one was billed): a chip naming the currency with
 *   the explanation as its title and as screen-reader text, never a disabled control.
 */
export const CurrencyToggle: React.FC<{ placement: string; className?: string }> = ({ placement, className }) => {
  const { t } = useLocalization(['interface']);
  const { currency, setCurrency, locked, supported } = useCurrency();
  if (!supported || isIrreversibleActionHidden()) return null;
  const code = currency.toUpperCase();
  if (locked) {
    const note = t('interface:billing.currency.lockedNote', { currency: code });
    return (
      <span
        className={cn('inline-flex w-fit items-center gap-1.5 rounded-full border border-edge px-2.5 py-1 text-xs font-medium text-foreground', className)}
        title={note}
        data-testid="currency-locked"
        data-currency={currency}
      >
        <Lock aria-hidden="true" className="size-3 text-muted-foreground" />
        {code}
        <span className="sr-only">{note}</span>
      </span>
    );
  }
  return (
    <Segmented<BillingCurrency>
      name={`currency-${placement}`}
      label={t('interface:billing.currency.label')}
      value={currency}
      onValueChange={(next) => setCurrency(next, placement)}
      options={[
        { value: 'usd', label: 'USD' },
        { value: 'eur', label: 'EUR' },
      ]}
      className={cn('w-full max-w-[160px]', className)}
    />
  );
};

export default CurrencyToggle;
