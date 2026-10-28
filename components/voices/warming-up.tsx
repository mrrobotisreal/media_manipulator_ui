'use client';

import React from 'react';
import Link from 'next/link';
import { Flame, PowerOff } from 'lucide-react';
import { useLocalization } from '@/i18n/useLocalization';
import { useLocalizedHref } from '@/i18n/useLocalizedHref';
import { useAuth } from '@/lib/auth/AuthProvider';
import { BUTTON_SECONDARY } from './shared';

/**
 * "Warming up the voice engine…" (MM78 decision 3): shown while a request is in flight
 * and capabilities says the engine is cold (`warm: false`), because the first request
 * after an idle unload pays a 10 to 20 s model load.
 */
export const WarmingUp: React.FC<{ warm: boolean | undefined; inFlight: boolean }> = ({ warm, inFlight }) => {
  const { t } = useLocalization('interface');
  const show = inFlight && warm === false;
  return (
    <div aria-live="polite" className="min-h-0">
      {show ? (
        <p className="flex items-center gap-2 rounded-lg border border-premium/40 bg-premium/10 p-3 text-sm text-foreground" data-testid="voices-warming-up">
          <Flame aria-hidden="true" className="size-4 shrink-0 text-premium" />
          {t('voiceTools.warmingUp')}
        </p>
      ) : null}
    </div>
  );
};

/**
 * The honest "Voices is not available right now" state (MM78 decision 9): rendered when
 * capabilities says `enabled: false` (feature off, service down) or cannot be read,
 * instead of a form that would only fail.
 */
export const VoicesUnavailable: React.FC<{ shiftStillWorks?: boolean }> = ({ shiftStillWorks }) => {
  const { t } = useLocalization('interface');
  return (
    <div role="status" className="rounded-lg border border-edge bg-surface-2/60 p-4" data-testid="voices-unavailable">
      <p className="flex items-center gap-2 font-medium text-foreground">
        <PowerOff aria-hidden="true" className="size-4 text-muted-foreground" />
        {t('voiceTools.unavailable.title')}
      </p>
      <p className="mt-1 text-sm text-muted-foreground">{t('voiceTools.unavailable.body')}</p>
      {shiftStillWorks ? <p className="mt-2 text-sm text-muted-foreground">{t('voiceTools.unavailable.shiftStillWorks')}</p> : null}
    </div>
  );
};

/**
 * The sign-in prompt for the saved-voice actions (MM78 decision 6). It opens the existing
 * auth modal; nothing is uploaded and nothing is charged before the visitor signs in.
 */
export const VoicesSignInPrompt: React.FC<{ source: string }> = ({ source }) => {
  const { t } = useLocalization('interface');
  const auth = useAuth();
  return (
    <div className="rounded-lg border border-primary/30 bg-primary/5 p-4" data-testid="voices-sign-in">
      <p className="font-medium text-foreground">{t('voiceTools.signIn.title')}</p>
      <p className="mt-1 text-sm text-muted-foreground">{t('voiceTools.signIn.body')}</p>
      <button type="button" className={`${BUTTON_SECONDARY} mt-3`} onClick={() => auth?.openAuth({ intent: 'signin', source })}>
        {t('voiceTools.signIn.cta')}
      </button>
    </div>
  );
};

/** The upgrade hint shown where the plan lacks a voices feature (convert). */
export const VoicesUpgradeHint: React.FC<{ message: string }> = ({ message }) => {
  const { t } = useLocalization('interface');
  const localized = useLocalizedHref();
  return (
    <p className="rounded-lg border border-premium/40 bg-premium/10 p-3 text-sm text-foreground" data-testid="voices-upgrade">
      {message}{' '}
      <Link href={localized('/pricing')} className="text-primary underline decoration-primary/40 underline-offset-2">
        {t('voiceTools.changer.upgrade')}
      </Link>
    </p>
  );
};
