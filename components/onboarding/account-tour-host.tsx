'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';

import { useAuth } from '@/lib/auth/AuthProvider';
import { hasActiveJobs } from '@/lib/analytics/jobTimings';
import { TOUR_REPLAY_EVENT, shouldAutoShowTour } from '@/lib/onboarding/state';

/** Lazy: guests and everyone past the new-account window never download the tour. */
const AccountTour = dynamic(() => import('@/components/onboarding/account-tour'), { ssr: false });

/** How often to re-check an otherwise eligible account whose job was still running. */
const RECHECK_MS = 5000;

/**
 * Decides when the MM35 tour may open and mounts it. Renders nothing for guests. Auto-show rules
 * live in lib/onboarding/state.ts (signed in, new account, not finished, not on /account, no job
 * running, auth panel closed); "Replay tour" in Account > Profile bypasses them via an event.
 */
export const AccountTourHost: React.FC = () => {
  const auth = useAuth();
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  const uid = auth?.user?.uid ?? null;
  const creationTime = auth?.user?.metadata?.creationTime ?? null;
  const authOpen = auth?.prompt.open ?? false;

  React.useEffect(() => {
    if (open || !uid) return;
    const evaluate = () =>
      shouldAutoShowTour({
        signedIn: true,
        uid,
        creationTime,
        pathname,
        busy: hasActiveJobs(),
        authOpen,
      });
    if (evaluate()) {
      setOpen(true);
      return;
    }
    const timer = window.setInterval(() => {
      if (evaluate()) {
        setOpen(true);
        window.clearInterval(timer);
      }
    }, RECHECK_MS);
    return () => window.clearInterval(timer);
  }, [open, uid, creationTime, pathname, authOpen]);

  React.useEffect(() => {
    if (!uid) return;
    const replay = () => setOpen(true);
    window.addEventListener(TOUR_REPLAY_EVENT, replay);
    return () => window.removeEventListener(TOUR_REPLAY_EVENT, replay);
  }, [uid]);

  // Signing out closes it; the next account starts from its own state.
  React.useEffect(() => {
    if (!uid) setOpen(false);
  }, [uid]);

  if (!open || !uid) return null;
  return <AccountTour uid={uid} onClose={() => setOpen(false)} />;
};

export default AccountTourHost;
