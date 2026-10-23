'use client';

import * as React from 'react';
import { toast } from 'sonner';

import { ConfirmDialog } from '@/components/account/confirm-dialog';
import type { AccountCopy } from '@/components/account/account-copy';
import { Panel } from '@/components/darkroom/panel';
import { Stat } from '@/components/darkroom/stat';
import { Button } from '@/components/ui/button';
import { retentionEvents } from '@/lib/analytics/retentionEvents';
import { useAuth } from '@/lib/auth/AuthProvider';
import { revokeSessions } from '@/lib/auth/accountApi';
import { requireToken } from '@/lib/account/requireToken';

type VerifyStatus = 'idle' | 'sending' | 'sent' | 'sendFailed' | 'checking' | 'stillUnverified';

export const ProfileTab: React.FC<{ copy: AccountCopy }> = ({ copy }) => {
  const c = copy.profile;
  const auth = useAuth();
  const [status, setStatus] = React.useState<VerifyStatus>('idle');
  const [revokeOpen, setRevokeOpen] = React.useState(false);
  const [revoking, setRevoking] = React.useState(false);
  const [revokeNote, setRevokeNote] = React.useState('');
  if (!auth || !auth.user) return null;

  const user = auth.user;
  const verified = auth.emailVerified ?? user.emailVerified;

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
    const result = await auth.refreshIdentity().catch(() => null);
    setStatus(result ? 'idle' : 'stillUnverified');
  };
  const signOutEverywhere = async () => {
    setRevoking(true);
    try {
      await revokeSessions(await requireToken());
      setRevokeOpen(false);
      await auth.signOut();
    } catch {
      setRevokeNote(c.revokeFailed);
      toast.error(c.revokeFailed);
    } finally {
      setRevoking(false);
    }
  };

  const note =
    status === 'sent' ? c.verificationSent : status === 'sendFailed' ? c.verificationFailed : status === 'stillUnverified' ? c.stillUnverified : '';

  return (
    <div className="grid max-w-2xl gap-6">
      <Panel title={c.title} titleAs="h2">
        <div className="grid gap-3">
          <Stat orientation="inline" label={c.displayName} value={user.displayName || c.noName} />
          <p className="text-xs text-muted-foreground">{c.nameReadOnly}</p>
          <Stat orientation="inline" label={c.email} value={user.email ?? '—'} />
          <Stat orientation="inline" label="" value={verified ? c.verified : c.unverified} accent={verified ? 'data' : 'premium'} />
        </div>
        {verified ? null : (
          <div className="mt-4 flex flex-wrap gap-2">
            <Button type="button" className="min-h-11 sm:min-h-9" disabled={status === 'sending' || status === 'checking'} onClick={() => void send()}>
              {c.sendVerification}
            </Button>
            <Button type="button" variant="outline" className="min-h-11 sm:min-h-9" disabled={status === 'sending' || status === 'checking'} onClick={() => void check()}>
              {c.checkVerification}
            </Button>
          </div>
        )}
        <p role="status" aria-live="polite" className="mt-3 min-h-4 text-xs text-muted-foreground">
          {note}
        </p>
      </Panel>

      <Panel title={c.sessionsTitle} titleAs="h2">
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" className="min-h-11 sm:min-h-9" onClick={() => void auth.signOut()}>
            {c.signOut}
          </Button>
          <Button type="button" variant="outline" className="min-h-11 sm:min-h-9" onClick={() => { setRevokeNote(''); setRevokeOpen(true); }}>
            {c.signOutEverywhere}
          </Button>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">{c.signOutEverywhereBody}</p>
      </Panel>

      <ConfirmDialog
        open={revokeOpen}
        onOpenChange={setRevokeOpen}
        title={c.signOutEverywhere}
        description={c.signOutEverywhereBody}
        confirmLabel={c.signOutEverywhere}
        cancelLabel={copy.history.cancel}
        busy={revoking}
        onConfirm={() => void signOutEverywhere()}
      >
        {revokeNote ? (
          <p role="alert" className="text-sm text-destructive">
            {revokeNote}
          </p>
        ) : null}
      </ConfirmDialog>
    </div>
  );
};

export default ProfileTab;
