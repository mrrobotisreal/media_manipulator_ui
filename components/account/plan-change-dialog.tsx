'use client';

import * as React from 'react';

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import type { BillingCurrency, BillingInterval } from '@/lib/auth/accountApi';
import { formatPrice } from '@/lib/billing/price';
import { useLocalization } from '@/i18n/useLocalization';

/**
 * The confirmation in front of a plan change (MM40 decision 4). It states the money before
 * the click: an upgrade charges the prorated difference now and keeps the renewal date; a
 * downgrade applies at the end of the paid period with no refund. Prices are the served
 * numerals for the subscriber's own interval, rendered through formatPrice in the
 * subscription's currency (MM69: a plan change never changes it).
 *
 * Not the shared ConfirmDialog: that one is for destructive actions (red confirm button).
 */
export const PlanChangeDialog: React.FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  target: 'pro' | 'premium';
  /** The subscriber's interval (the change keeps it); null when unknown. */
  interval: BillingInterval | null | undefined;
  /** The target plan's served price for that interval; undefined when unknown. */
  price: number | undefined;
  /** The subscription's currency (MM69). */
  currency: BillingCurrency;
  /** RFC 3339: the current period end (the renewal date, and when a downgrade applies). */
  periodEnd: string | null | undefined;
  busy: boolean;
  onConfirm: () => void;
}> = ({ open, onOpenChange, target, interval, price, currency, periodEnd, busy, onConfirm }) => {
  const { t, formatDate, language } = useLocalization(['interface']);
  const base = target === 'pro' ? 'interface:billing.planChange.upgrade' : 'interface:billing.planChange.downgrade';
  const unit = t(interval === 'yearly' ? 'interface:billing.offer.unitYear' : 'interface:billing.offer.unitMonth');
  const date = periodEnd ? formatDate(periodEnd) : '';
  const values = { date, price: typeof price === 'number' ? formatPrice(price, currency, language?.code) : '', unit };
  const known = typeof price === 'number' && !!interval;
  const body = date && known ? `${base}.body` : date ? `${base}.bodyNoPrice` : `${base}.bodyNoDate`;
  return (
    <AlertDialog open={open} onOpenChange={(next) => (busy ? undefined : onOpenChange(next))}>
      <AlertDialogContent data-testid="plan-change-dialog" data-target={target}>
        <AlertDialogHeader>
          <AlertDialogTitle>{t(`${base}.title`)}</AlertDialogTitle>
          <AlertDialogDescription>{t(body, values)}</AlertDialogDescription>
        </AlertDialogHeader>
        <p className="text-sm text-muted-foreground">{t(`${base}.fineprint`)}</p>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={busy} className="min-h-11">
            {t('interface:billing.planChange.cancel')}
          </AlertDialogCancel>
          <Button type="button" className="min-h-11" disabled={busy} aria-busy={busy} onClick={onConfirm}>
            {busy ? t('interface:billing.offer.working') : t(`${base}.confirm`)}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default PlanChangeDialog;
