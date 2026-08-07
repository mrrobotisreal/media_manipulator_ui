'use client';

import React from 'react';
import { History, Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
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
import { Input } from '@/components/ui/input';
import { useLocalization } from '@/i18n/useLocalization';
import { useStudioStore } from '@/lib/studioStore';
import { deleteDraft } from '@/lib/studio/draftStore';
import { formatRelativeTime } from '@/lib/studio/draftRecovery';
import { analytics, EVENTS } from '@/lib/analytics';
import { studioHost } from '@/lib/studio/telemetry';
import {
  useCreateVersion,
  useRestoreVersion,
  useVersionsQuery,
  VERSIONS_UNAVAILABLE,
} from '@/lib/useStudioVersions';
import type { StudioProjectVersion } from '@/lib/studioTypes';

/**
 * VersionsPanel — part 09 version history (ADR ws/0001 item 3). A History
 * button in the editor header opens a sheet listing the project's versions,
 * grouped Manual / Automatic, with "Save version…" (named manual checkpoint)
 * and per-row Restore behind a confirm.
 *
 * Restore is server-composed: the API checkpoints the current state first
 * ("Before restore"), so restoring can never lose work. The response is the
 * full updated project, fed through the store's loadProject — the same path a
 * conflict reload uses — which replaces the document + revision and resets
 * undo history. The now-stale IndexedDB draft is dropped like a reload does.
 *
 * On a backend without the endpoints (a CreaTV Darkroom API that predates
 * them) the list query resolves to VERSIONS_UNAVAILABLE and the panel shows a
 * quiet "not available" note instead of erroring — never break embed.
 */
const VersionsPanel: React.FC<{ projectId: string }> = ({ projectId }) => {
  const { t } = useLocalization('interface');
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState('');
  const [confirming, setConfirming] = React.useState<StudioProjectVersion | null>(null);
  const loadProject = useStudioStore((s) => s.loadProject);

  // Fetch only while the sheet is open; refetch on reopen so the list shows
  // checkpoints minted since (autosave-adjacent traffic is cheap metadata).
  const versionsQuery = useVersionsQuery(projectId, open);
  const createMutation = useCreateVersion(projectId);
  const restoreMutation = useRestoreVersion(projectId);

  const unavailable = versionsQuery.data === VERSIONS_UNAVAILABLE;
  const versions = Array.isArray(versionsQuery.data) ? versionsQuery.data : [];
  const manuals = versions.filter((v) => v.kind === 'manual');
  const autos = versions.filter((v) => v.kind === 'auto');

  const handleSaveVersion = async () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    try {
      await createMutation.mutateAsync({ kind: 'manual', name: trimmed.slice(0, 80) });
      setName('');
      toast.success(t('contentStudio.versions.saved'));
    } catch (err) {
      toast.error(t('contentStudio.versions.saveFailed'), {
        description: err instanceof Error ? err.message : undefined,
      });
    }
  };

  const handleRestore = async () => {
    if (!confirming) return;
    try {
      const project = await restoreMutation.mutateAsync(confirming.id);
      // Part 10 (ADR ws/0003): restores are a first-class lifecycle event.
      analytics.track(EVENTS.STUDIO_VERSION_RESTORED, { host: studioHost() }, { feature: 'studio' });
      // Same precedent as the conflict reload: replace the document +
      // revision, reset undo history, and drop the now-stale local draft.
      loadProject(project);
      void deleteDraft(projectId);
      setConfirming(null);
      setOpen(false);
      toast.success(t('contentStudio.versions.restored'));
    } catch (err) {
      toast.error(t('contentStudio.versions.restoreFailed'), {
        description: err instanceof Error ? err.message : undefined,
      });
      setConfirming(null);
    }
  };

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            title={t('contentStudio.versions.open')}
            aria-label={t('contentStudio.versions.open')}
          >
            <History className="w-4 h-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="flex w-full flex-col gap-0 sm:max-w-md">
          <SheetHeader>
            <SheetTitle>{t('contentStudio.versions.title')}</SheetTitle>
            <SheetDescription>{t('contentStudio.versions.description')}</SheetDescription>
          </SheetHeader>

          {unavailable ? (
            <p className="px-4 text-sm text-muted-foreground">
              {t('contentStudio.versions.unavailable')}
            </p>
          ) : (
            <>
              {/* Save version… — a named manual checkpoint, kept indefinitely. */}
              <form
                className="flex items-center gap-2 px-4 pb-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  void handleSaveVersion();
                }}
              >
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={80}
                  placeholder={t('contentStudio.versions.namePlaceholder')}
                  aria-label={t('contentStudio.versions.namePlaceholder')}
                  className="h-9"
                />
                <Button
                  type="submit"
                  size="sm"
                  disabled={!name.trim() || createMutation.isPending}
                >
                  {createMutation.isPending ? (
                    <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-1" />
                  )}
                  {t('contentStudio.versions.save')}
                </Button>
              </form>

              <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4">
                {versionsQuery.isLoading ? (
                  <p className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {t('contentStudio.versions.loading')}
                  </p>
                ) : versionsQuery.isError ? (
                  <p className="text-sm text-destructive">
                    {t('contentStudio.versions.loadError')}
                  </p>
                ) : versions.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    {t('contentStudio.versions.empty')}
                  </p>
                ) : (
                  <div className="flex flex-col gap-4">
                    <VersionGroup
                      label={t('contentStudio.versions.manual')}
                      versions={manuals}
                      onRestore={setConfirming}
                    />
                    <VersionGroup
                      label={t('contentStudio.versions.auto')}
                      versions={autos}
                      onRestore={setConfirming}
                    />
                  </div>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Restore confirm. Kept outside the sheet so closing one doesn't
          unmount the other mid-mutation. */}
      <AlertDialog
        open={confirming !== null}
        onOpenChange={(next) => {
          if (!next && !restoreMutation.isPending) setConfirming(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('contentStudio.versions.restoreTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('contentStudio.versions.restoreDescription')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={restoreMutation.isPending}>
              {t('contentStudio.versions.restoreCancel')}
            </AlertDialogCancel>
            <Button disabled={restoreMutation.isPending} onClick={() => void handleRestore()}>
              {restoreMutation.isPending ? (
                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
              ) : (
                <History className="w-4 h-4 mr-1" />
              )}
              {t('contentStudio.versions.restoreConfirm')}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

/** One grouped section (Manual / Automatic); hidden when it has no rows. */
const VersionGroup: React.FC<{
  label: string;
  versions: StudioProjectVersion[];
  onRestore: (v: StudioProjectVersion) => void;
}> = ({ label, versions, onRestore }) => {
  const { t } = useLocalization('interface');
  if (versions.length === 0) return null;
  return (
    <div>
      <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </h3>
      <ul className="flex flex-col gap-1">
        {versions.map((v) => (
          <li
            key={v.id}
            className="flex items-center justify-between gap-3 rounded-md border border-edge bg-surface-2 px-3 py-2"
          >
            <div className="min-w-0">
              <p className="truncate text-sm text-foreground">
                {v.name || t('contentStudio.versions.checkpoint')}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatRelativeTime(Date.parse(v.createdAt))}
                {typeof v.revision === 'number'
                  ? ` · ${t('contentStudio.versions.revision', { revision: v.revision })}`
                  : null}
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={() => onRestore(v)}>
              {t('contentStudio.versions.restore')}
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VersionsPanel;
