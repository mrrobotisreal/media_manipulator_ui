'use client';

import * as React from 'react';

import { Panel } from '@/components/darkroom/panel';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth/AuthProvider';

/** The notice's copy: the account page passes `pages.json` `account.verify`, the translator workbench its English chrome. */
export interface VerifyNoticeLabels {
  title: string;
  body: string;
  send: string;
  sent: string;
  sendFailed: string;
  check: string;
  stillUnverified: string;
}

type Status = 'idle' | 'sending' | 'sent' | 'sendFailed' | 'checking' | 'stillUnverified';

/**
 * "Verify your email" notice with a send button and an "I've verified" re-check. Shared by
 * the operator tier on /account and the translator workbench gate (MM53, design §2.8): both
 * are blocked only by Firebase's `email_verified` claim.
 */
export const VerifyNotice: React.FC<{
  labels: VerifyNoticeLabels;
  /** Called after the re-check finds the address verified (the caller re-reads its gate). */
  onVerified?: () => void;
  className?: string;
}> = ({ labels, onVerified, className }) => {
  const auth = useAuth();
  const [status, setStatus] = React.useState<Status>('idle');
  if (!auth) return null;

  const send = async () => {
    setStatus('sending');
    try {
      await auth.sendVerificationEmail();
      setStatus('sent');
    } catch {
      setStatus('sendFailed');
    }
  };
  const check = async () => {
    setStatus('checking');
    const verified = await auth.refreshIdentity().catch(() => null);
    setStatus(verified ? 'idle' : 'stillUnverified');
    if (verified) onVerified?.();
  };
  const note =
    status === 'sent' ? labels.sent : status === 'sendFailed' ? labels.sendFailed : status === 'stillUnverified' ? labels.stillUnverified : null;
  const busy = status === 'sending' || status === 'checking';

  return (
    <Panel className={className ?? 'border-premium/40'}>
      <h2 className="text-base font-semibold text-foreground">{labels.title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{labels.body}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button onClick={() => void send()} disabled={busy}>
          {labels.send}
        </Button>
        <Button variant="outline" onClick={() => void check()} disabled={busy}>
          {labels.check}
        </Button>
      </div>
      {note ? (
        <p className="mt-3 text-xs text-muted-foreground" role="status">
          {note}
        </p>
      ) : null}
    </Panel>
  );
};

export default VerifyNotice;
