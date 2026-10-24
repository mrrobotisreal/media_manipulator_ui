'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Clapperboard, History, ShieldCheck, type LucideIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useLocalization } from '@/i18n/useLocalization';
import { useLocalizedHref } from '@/i18n/useLocalizedHref';
import type { OnboardingAction } from '@/lib/analytics/events';
import { onboardingEvents, type OnboardingStepNumber } from '@/lib/analytics/onboardingEvents';
import { RETENTION_BANNER_KEY } from '@/lib/account/retention';
import { markOnboardingDone } from '@/lib/onboarding/state';

/** MM25 tab key for Privacy & data. */
export const TOUR_CTA_PATH = '/account?tab=privacy';

interface StepDef {
  id: 'keepResults' | 'darkroomProjects' | 'retention';
  Icon: LucideIcon;
}
const STEPS: readonly StepDef[] = [
  { id: 'keepResults', Icon: History },
  { id: 'darkroomProjects', Icon: Clapperboard },
  { id: 'retention', Icon: ShieldCheck },
];

/**
 * The one-time three-card tour (MM35): Keep your results, Darkroom projects, Choose your
 * retention. Mounted only when the host has decided it may open; closing in any way (Skip, Esc,
 * overlay, X, Not now, the CTA) persists completion for this account.
 *
 * "Set retention" goes to the Privacy & data tab. The Overview tab has its own dismissible
 * retention banner; using the CTA marks that banner dismissed so the same question is never
 * asked twice. Skipping leaves the banner as the gentle fallback on /account.
 */
export const AccountTour: React.FC<{ uid: string; onClose: () => void }> = ({ uid, onClose }) => {
  const { t } = useLocalization(['interface']);
  const localized = useLocalizedHref();
  const router = useRouter();
  const [index, setIndex] = React.useState(0);
  const finished = React.useRef(false);
  const viewed = React.useRef(0);

  const step = (index + 1) as OnboardingStepNumber;
  const def = STEPS[index];
  const last = index === STEPS.length - 1;

  React.useEffect(() => {
    if (viewed.current === step) return;
    viewed.current = step;
    onboardingEvents.stepViewed(step);
  }, [step]);

  const finish = (action: OnboardingAction) => {
    if (finished.current) return;
    finished.current = true;
    onboardingEvents.stepCompleted(step, action);
    markOnboardingDone(uid);
    if (action === 'cta') {
      try {
        window.localStorage.setItem(RETENTION_BANNER_KEY, '1');
      } catch {
        /* the banner may reappear; harmless */
      }
      router.push(localized(TOUR_CTA_PATH));
    }
    onClose();
  };

  const next = () => {
    onboardingEvents.stepCompleted(step, 'next');
    setIndex((i) => i + 1);
  };

  const Icon = def.Icon;
  const title = t(`interface:accountTour.${def.id}.title`);
  const progress = t('interface:accountTour.step', { current: step, total: STEPS.length });

  return (
    <Dialog open onOpenChange={(open) => (open ? undefined : finish('dismiss'))}>
      <DialogContent
        data-testid="account-tour"
        className="motion-reduce:animate-none motion-reduce:duration-0 sm:max-w-md"
      >
        <DialogHeader>
          <span
            aria-hidden="true"
            className="mb-1 inline-flex size-10 items-center justify-center rounded-md border border-edge-strong text-data"
          >
            <Icon className="size-5" />
          </span>
          <p className="num text-xs uppercase tracking-wide text-muted-foreground">{progress}</p>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{t(`interface:accountTour.${def.id}.body`)}</DialogDescription>
        </DialogHeader>

        <div aria-hidden="true" className="flex gap-1.5">
          {STEPS.map((s, i) => (
            <span key={s.id} className={`h-1 flex-1 rounded-full ${i <= index ? 'bg-data' : 'bg-edge-strong'}`} />
          ))}
        </div>
        {/* Step changes are announced without moving focus off the buttons. */}
        <p className="sr-only" role="status" aria-live="polite">
          {`${progress}. ${title}`}
        </p>

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
          <Button type="button" variant="ghost" className="min-h-11 sm:min-h-9" onClick={() => finish('skip')}>
            {last ? t('interface:accountTour.notNow') : t('interface:accountTour.skip')}
          </Button>
          <div className="flex flex-col-reverse gap-2 sm:flex-row">
            {index > 0 ? (
              <Button type="button" variant="outline" className="min-h-11 sm:min-h-9" onClick={() => setIndex((i) => i - 1)}>
                {t('interface:accountTour.back')}
              </Button>
            ) : null}
            {last ? (
              <Button type="button" className="min-h-11 sm:min-h-9" autoFocus onClick={() => finish('cta')}>
                {t('interface:accountTour.setRetention')}
              </Button>
            ) : (
              <Button type="button" className="min-h-11 sm:min-h-9" autoFocus onClick={next}>
                {t('interface:accountTour.next')}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AccountTour;
