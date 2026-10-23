'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { ConfirmDialog } from '@/components/account/confirm-dialog';
import { RetentionPicker } from '@/components/account/tabs/retention-picker';
import type { AccountCopy } from '@/components/account/account-copy';
import { Panel } from '@/components/darkroom/panel';
import { PanelLoading } from '@/components/darkroom/panel-loading';
import { Segmented } from '@/components/darkroom/segmented';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/lib/auth/AuthProvider';
import { useLocalizedHref } from '@/i18n/useLocalizedHref';
import { retentionEvents } from '@/lib/analytics/retentionEvents';
import {
  AccountApiError,
  deleteAccount,
  deleteAllData,
  exportData,
  fetchHistory,
  fetchSettings,
  fetchStudioProjects,
  patchSettings,
  previewRetention,
  type AccountSettings,
  type HistoryVisibility,
} from '@/lib/auth/accountApi';
import { getFreshIdToken, getSignInProviders, reauthenticate } from '@/lib/firebase';
import { requireToken } from '@/lib/account/requireToken';
import { fmt } from '@/lib/account/retention';
import { saveBlobToDisk } from '@/lib/results/save';

export const DELETE_ALL_PHRASE = 'DELETE';
export const DELETE_ACCOUNT_PHRASE = 'DELETE MY ACCOUNT';

type ReauthState = 'none' | 'needed';

const StorageMeter: React.FC<{ copy: AccountCopy; uid: string }> = ({ copy, uid }) => {
  const s = copy.privacy.storage;
  // No endpoint reports storage size (MM22/MM23 expose none), so the meter counts what the
  // account's own history and project list already return.
  const history = useQuery({
    queryKey: ['account-history', uid, 50],
    staleTime: 60_000,
    retry: 1,
    queryFn: async ({ signal }) => fetchHistory(await requireToken(), { limit: 50 }, signal),
  });
  const projects = useQuery({
    queryKey: ['account-projects', uid],
    staleTime: 30_000,
    retry: 1,
    queryFn: async () => fetchStudioProjects(await requireToken()),
  });
  if (history.isPending || projects.isPending) return <PanelLoading variant="inline" label={copy.privacy.loading} />;
  const live = (history.data?.entries ?? []).filter((e) => !e.expired && e.status === 'completed');
  const byKind = new Map<string, number>();
  for (const entry of live) byKind.set(entry.mediaKind || 'other', (byKind.get(entry.mediaKind || 'other') ?? 0) + 1);
  const projectCount = projects.data?.length ?? 0;
  if (live.length === 0 && projectCount === 0) return <p className="text-sm text-muted-foreground">{s.empty}</p>;
  return (
    <div className="grid gap-2" data-testid="storage-meter">
      <dl className="grid gap-1 text-sm">
        <div className="flex justify-between gap-3">
          <dt className="text-muted-foreground">{s.results}</dt>
          <dd className="num text-foreground">{live.length}</dd>
        </div>
        {[...byKind.entries()].map(([kind, count]) => (
          <div key={kind} className="flex justify-between gap-3 ps-4 text-xs">
            <dt className="text-muted-foreground">{(copy.history.kinds as Record<string, string>)[kind] ?? kind}</dt>
            <dd className="num text-foreground">{count}</dd>
          </div>
        ))}
        <div className="flex justify-between gap-3">
          <dt className="text-muted-foreground">{s.projects}</dt>
          <dd className="num text-foreground">{projectCount}</dd>
        </div>
      </dl>
      <p className="text-xs text-muted-foreground">{s.note}</p>
    </div>
  );
};

export interface PrivacyTabProps {
  copy: AccountCopy;
  uid: string;
}

export const PrivacyTab: React.FC<PrivacyTabProps> = ({ copy, uid }) => {
  const p = copy.privacy;
  const d = p.data;
  const auth = useAuth();
  const router = useRouter();
  const localized = useLocalizedHref();
  const queryClient = useQueryClient();

  const settingsQuery = useQuery({
    queryKey: ['account-settings', uid],
    staleTime: 30_000,
    retry: 1,
    queryFn: async () => fetchSettings(await requireToken()),
  });

  const [exporting, setExporting] = React.useState(false);
  const [exportNote, setExportNote] = React.useState('');
  const [settingNote, setSettingNote] = React.useState('');
  const [deleteAllOpen, setDeleteAllOpen] = React.useState(false);
  const [deleteAllBusy, setDeleteAllBusy] = React.useState(false);
  const [accountOpen, setAccountOpen] = React.useState(false);
  const [accountBusy, setAccountBusy] = React.useState(false);
  const [accountNote, setAccountNote] = React.useState('');
  const [reauth, setReauth] = React.useState<ReauthState>('none');
  const [providers, setProviders] = React.useState<string[]>([]);
  const [password, setPassword] = React.useState('');
  const [incomplete, setIncomplete] = React.useState(false);

  const setSettings = (next: AccountSettings) => queryClient.setQueryData(['account-settings', uid], next);

  const patchSetting = async (patch: Parameters<typeof patchSettings>[1]) => {
    const key = ['account-settings', uid];
    const before = queryClient.getQueryData<AccountSettings>(key);
    if (before) queryClient.setQueryData(key, { ...before, ...patch });
    try {
      const saved = await patchSettings(await requireToken(), patch);
      setSettings(saved);
      setSettingNote(p.store.settingSaved);
    } catch {
      if (before) queryClient.setQueryData(key, before);
      setSettingNote(p.store.settingFailed);
      toast.error(p.store.settingFailed);
    }
  };

  const doExport = async () => {
    setExporting(true);
    setExportNote(d.exportPending);
    try {
      const { blob, fileName } = await exportData(await requireToken());
      saveBlobToDisk(blob, fileName);
      retentionEvents.exportRequested('started');
      setExportNote(d.exportDone);
    } catch (error) {
      if (error instanceof AccountApiError && error.status === 429) {
        retentionEvents.exportRequested('rate_limited');
        setExportNote(
          error.retryAfterSeconds
            ? fmt(d.exportLimited, { minutes: Math.max(1, Math.ceil(error.retryAfterSeconds / 60)) })
            : d.exportLimitedGeneric,
        );
      } else {
        retentionEvents.exportRequested('failed');
        setExportNote(d.exportFailed);
      }
    } finally {
      setExporting(false);
    }
  };

  const doDeleteAll = async () => {
    setDeleteAllBusy(true);
    try {
      const result = await deleteAllData(await requireToken(), DELETE_ALL_PHRASE);
      retentionEvents.deleteAllConfirmed();
      const message = result.pending > 0 ? d.deleteAllPending : d.deleteAllDone;
      setExportNote(message);
      toast.success(message);
      setDeleteAllOpen(false);
    } catch {
      toast.error(d.deleteAllFailed);
      setExportNote(d.deleteAllFailed);
    } finally {
      setDeleteAllBusy(false);
      // Whatever happened, the lists on the other tabs are now stale.
      void queryClient.invalidateQueries({ queryKey: ['account-history', uid] });
      void queryClient.invalidateQueries({ queryKey: ['account-projects', uid] });
    }
  };

  const finishAccountDeletion = async () => {
    retentionEvents.accountDeleteConfirmed('completed');
    toast.success(d.accountDone);
    setAccountOpen(false);
    // The Firebase user is gone server-side; signing out clears the local session.
    await auth?.signOut().catch(() => undefined);
    queryClient.clear();
    router.push(`${localized('/')}?accountDeleted=1`);
  };

  const attemptAccountDeletion = async (token: string) => {
    setAccountBusy(true);
    setAccountNote('');
    try {
      await deleteAccount(token, DELETE_ACCOUNT_PHRASE);
      await finishAccountDeletion();
    } catch (error) {
      if (error instanceof AccountApiError && error.status === 401 && error.code === 'reauth_required') {
        retentionEvents.accountDeleteConfirmed('reauth_required');
        setProviders(await getSignInProviders());
        setReauth('needed');
      } else if (error instanceof AccountApiError && error.status === 502) {
        retentionEvents.accountDeleteConfirmed('incomplete');
        setIncomplete(true);
        setAccountNote(d.accountIncomplete);
      } else {
        retentionEvents.accountDeleteConfirmed('failed');
        setAccountNote(d.accountFailed);
      }
    } finally {
      setAccountBusy(false);
    }
  };

  const startAccountDeletion = async () => {
    const fresh = (await getFreshIdToken()) ?? (await requireToken().catch(() => null));
    if (!fresh) {
      setAccountNote(d.accountFailed);
      return;
    }
    await attemptAccountDeletion(fresh);
  };

  const doReauth = async (method: { kind: 'password'; password: string } | { kind: 'google' }) => {
    setAccountBusy(true);
    setAccountNote('');
    let token: string;
    try {
      token = await reauthenticate(method);
    } catch (error) {
      const code = (error as { code?: string } | null)?.code ?? '';
      setAccountNote(code === 'auth/popup-blocked' ? d.reauthBlocked : d.reauthFailed);
      setAccountBusy(false);
      return;
    }
    setPassword('');
    setReauth('none');
    setAccountBusy(false);
    await attemptAccountDeletion(token);
  };

  if (settingsQuery.isPending) {
    return (
      <Panel title={copy.tabs.privacy} titleAs="h2">
        <PanelLoading variant="inline" label={p.loading} />
      </Panel>
    );
  }
  if (settingsQuery.isError) {
    return (
      <Panel title={copy.tabs.privacy} titleAs="h2">
        <p className="text-sm text-muted-foreground">{p.loadFailed}</p>
      </Panel>
    );
  }
  const settings = settingsQuery.data;
  const canPassword = providers.includes('password');
  const canGoogle = providers.includes('google.com');

  return (
    <div className="grid gap-6">
      <Panel title={p.retention.title} titleAs="h2">
        <p className="mb-4 text-sm leading-relaxed text-muted-foreground">{p.retention.body}</p>
        <RetentionPicker
          copy={copy}
          settings={settings}
          preview={async (hours) => previewRetention(await requireToken(), hours)}
          save={async (hours) => patchSettings(await requireToken(), { retentionHours: hours })}
          onSaved={(saved) => {
            setSettings(saved);
            void queryClient.invalidateQueries({ queryKey: ['account-history', uid] });
            void queryClient.invalidateQueries({ queryKey: ['account-projects', uid] });
          }}
        />
      </Panel>

      <Panel title={p.why.title} titleAs="h2">
        <ul className="grid list-disc gap-1.5 ps-5 text-sm text-muted-foreground">
          <li>{p.why.revisit}</li>
          <li>{p.why.reopen}</li>
          <li>{p.why.metadata}</li>
        </ul>
        <p className="mt-3 text-sm text-foreground">{p.why.tradeoff}</p>
      </Panel>

      <Panel title={p.store.title} titleAs="h2">
        <p className="text-sm leading-relaxed text-muted-foreground">{p.store.body}</p>
        <div className="mt-5 grid gap-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-sm font-medium text-foreground">{p.store.metadataTitle}</h3>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{p.store.metadataBody}</p>
            </div>
            <div className="flex min-h-11 items-center gap-2">
              <Switch
                id="delete-metadata-reports"
                checked={settings.deleteMetadataReports}
                onCheckedChange={(checked) => void patchSetting({ deleteMetadataReports: checked })}
                aria-label={p.store.metadataToggle}
              />
            </div>
          </div>
          <Label htmlFor="delete-metadata-reports" className="-mt-3 text-xs text-muted-foreground">
            {p.store.metadataToggle}
          </Label>
          <div>
            <h3 className="mb-2 text-sm font-medium text-foreground">{p.store.visibilityTitle}</h3>
            <Segmented<HistoryVisibility>
              name="history-visibility"
              label={p.store.visibilityLabel}
              value={settings.historyVisibility}
              onValueChange={(value) => void patchSetting({ historyVisibility: value })}
              options={[
                { value: 'full', label: p.store.full },
                { value: 'names_only', label: p.store.namesOnly },
              ]}
            />
          </div>
          <p role="status" aria-live="polite" className="min-h-4 text-xs text-muted-foreground">
            {settingNote}
          </p>
        </div>
      </Panel>

      <Panel title={p.storage.title} titleAs="h2">
        <StorageMeter copy={copy} uid={uid} />
      </Panel>

      <Panel title={d.title} titleAs="h2">
        <div className="grid gap-6">
          <div>
            <h3 className="text-sm font-medium text-foreground">{d.exportTitle}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{d.exportBody}</p>
            <Button type="button" variant="outline" className="mt-3 min-h-11 sm:min-h-9" disabled={exporting} onClick={() => void doExport()}>
              {exporting ? d.exportPending : d.exportCta}
            </Button>
            <p role="status" aria-live="polite" className="mt-2 min-h-4 text-xs text-muted-foreground">
              {exportNote}
            </p>
          </div>

          <div className="border-t border-edge pt-6">
            <h3 className="text-sm font-medium text-destructive">{d.deleteAllTitle}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{d.deleteAllBody}</p>
            <Button type="button" variant="destructive" className="mt-3 min-h-11 sm:min-h-9" onClick={() => setDeleteAllOpen(true)}>
              {d.deleteAllCta}
            </Button>
          </div>

          <div className="border-t border-edge pt-6">
            <h3 className="text-sm font-medium text-destructive">{d.accountTitle}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{d.accountBody}</p>
            <Button type="button" variant="destructive" className="mt-3 min-h-11 sm:min-h-9" onClick={() => { setAccountNote(''); setReauth('none'); setIncomplete(false); setAccountOpen(true); }}>
              {d.accountCta}
            </Button>
          </div>
        </div>
      </Panel>

      <ConfirmDialog
        open={deleteAllOpen}
        onOpenChange={setDeleteAllOpen}
        title={d.deleteAllDialogTitle}
        description={d.deleteAllDialogBody}
        confirmLabel={d.deleteAllConfirm}
        cancelLabel={d.cancel}
        busy={deleteAllBusy}
        requireText={DELETE_ALL_PHRASE}
        requireLabel={d.confirmInput}
        requireHint={fmt(d.typeToConfirm, { word: DELETE_ALL_PHRASE })}
        onConfirm={() => void doDeleteAll()}
      />

      <ConfirmDialog
        open={accountOpen}
        onOpenChange={setAccountOpen}
        title={reauth === 'needed' ? d.reauthTitle : d.accountDialogTitle}
        description={reauth === 'needed' ? d.reauthBody : d.accountDialogBody}
        confirmLabel={incomplete ? d.accountRetry : d.accountConfirm}
        cancelLabel={d.cancel}
        busy={accountBusy}
        requireText={reauth === 'needed' ? undefined : DELETE_ACCOUNT_PHRASE}
        requireLabel={d.confirmInput}
        requireHint={fmt(d.typeToConfirm, { word: DELETE_ACCOUNT_PHRASE })}
        hideConfirm={reauth === 'needed'}
        onConfirm={() => void startAccountDeletion()}
      >
        {reauth === 'needed' ? (
          <div className="grid gap-3">
            {canPassword ? (
              <div className="grid gap-2">
                <Label htmlFor="reauth-password" className="text-xs text-muted-foreground">
                  {d.reauthPassword}
                </Label>
                <Input
                  id="reauth-password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="min-h-11"
                />
                <Button type="button" variant="destructive" className="min-h-11" disabled={!password || accountBusy} onClick={() => void doReauth({ kind: 'password', password })}>
                  {d.reauthPasswordCta}
                </Button>
              </div>
            ) : null}
            {canGoogle ? (
              <Button type="button" variant="outline" className="min-h-11" disabled={accountBusy} onClick={() => void doReauth({ kind: 'google' })}>
                {d.reauthGoogle}
              </Button>
            ) : null}
          </div>
        ) : null}
        {accountNote ? (
          <p role="alert" className="text-sm text-destructive">
            {accountNote}
          </p>
        ) : null}
      </ConfirmDialog>
    </div>
  );
};

export default PrivacyTab;
