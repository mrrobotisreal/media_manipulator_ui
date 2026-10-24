'use client';

import * as React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { ConfirmDialog } from '@/components/account/confirm-dialog';
import type { AccountCopy } from '@/components/account/account-copy';
import { Panel } from '@/components/darkroom/panel';
import { Stat } from '@/components/darkroom/stat';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useLocalization } from '@/i18n/useLocalization';
import { retentionEvents } from '@/lib/analytics/retentionEvents';
import { useAuth } from '@/lib/auth/AuthProvider';
import { fetchSettings, patchSettings, revokeSessions, type AccountSettings, type SettingsPatch } from '@/lib/auth/accountApi';
import { requestTourReplay } from '@/lib/onboarding/state';
import { requireToken } from '@/lib/account/requireToken';

type VerifyStatus = 'idle' | 'sending' | 'sent' | 'sendFailed' | 'checking' | 'stillUnverified';

export const ProfileTab: React.FC<{ copy: AccountCopy }> = ({ copy }) => {
  const c = copy.profile;
  const { t } = useLocalization(['interface']);
  const auth = useAuth();
  const [status, setStatus] = React.useState<VerifyStatus>('idle');
  const [revokeOpen, setRevokeOpen] = React.useState(false);
  const [revoking, setRevoking] = React.useState(false);
  const [revokeNote, setRevokeNote] = React.useState('');
  const queryClient = useQueryClient();
  const uid = auth?.user?.uid ?? '';
  const settingsKey = ['account-settings', uid];
  const settingsQuery = useQuery({
    queryKey: settingsKey,
    enabled: Boolean(uid),
    staleTime: 30_000,
    retry: 1,
    queryFn: async () => fetchSettings(await requireToken()),
  });
  if (!auth || !auth.user) return null;

  // MM31: optimistic flip, rolled back if the PATCH fails (same shape as the Privacy tab).
  const patchEmail = async (patch: Pick<SettingsPatch, 'emailAiJobFinished' | 'emailExpiryDigest'>) => {
    const before = queryClient.getQueryData<AccountSettings>(settingsKey);
    if (before) queryClient.setQueryData(settingsKey, { ...before, ...patch });
    try {
      queryClient.setQueryData(settingsKey, await patchSettings(await requireToken(), patch));
    } catch {
      if (before) queryClient.setQueryData(settingsKey, before);
      toast.error(c.emailSaveFailed);
    }
  };
  const prefs = settingsQuery.data;

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
          <Stat orientation="inline" label={c.displayName} value={user.displayName || c.noName} wrap />
          <p className="text-xs text-muted-foreground">{c.nameReadOnly}</p>
          <Stat orientation="inline" label={c.email} value={user.email ?? '—'} wrap />
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

      <Panel title={c.emailTitle} titleAs="h2">
        <div className="grid gap-3">
          <div className="flex min-h-11 items-center justify-between gap-4">
            <Label htmlFor="email-ai-job-finished" className="text-sm text-foreground">
              {c.emailAiJob}
            </Label>
            <Switch
              id="email-ai-job-finished"
              checked={prefs?.emailAiJobFinished ?? false}
              disabled={!prefs}
              onCheckedChange={(checked) => void patchEmail({ emailAiJobFinished: checked })}
            />
          </div>
          <div className="flex min-h-11 items-center justify-between gap-4">
            <Label htmlFor="email-expiry-digest" className="text-sm text-foreground">
              {c.emailExpiry}
            </Label>
            <Switch
              id="email-expiry-digest"
              checked={prefs?.emailExpiryDigest ?? true}
              disabled={!prefs}
              onCheckedChange={(checked) => void patchEmail({ emailExpiryDigest: checked })}
            />
          </div>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">{c.emailAlways}</p>
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

      <p className="text-xs text-muted-foreground">
        <button
          type="button"
          className="min-h-11 text-start underline underline-offset-4 hover:text-foreground sm:min-h-0"
          onClick={requestTourReplay}
          aria-describedby="replay-tour-hint"
        >
          {t('interface:accountTour.replay')}
        </button>
        <span id="replay-tour-hint" className="ms-2">
          {t('interface:accountTour.replayHint')}
        </span>
      </p>

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
