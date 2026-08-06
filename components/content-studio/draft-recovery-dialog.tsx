'use client';

import React from 'react';
import { History, Loader2, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useLocalization } from '@/i18n/useLocalization';
import { formatRelativeTime, type DraftChangeSummary } from '@/lib/studio/draftRecovery';

/**
 * "Unsaved edits from 5 minutes ago — 2 clips added · 1 track removed".
 * Shared by this dialog and the draft mode of `save-conflict-dialog.tsx` so
 * both recovery prompts describe the draft the same way.
 */
export const DraftDetail: React.FC<{ savedAt: number; summary: DraftChangeSummary }> = ({
  savedAt,
  summary,
}) => {
  const { t } = useLocalization('interface');
  const parts: string[] = [];
  if (summary.clipsAdded > 0)
    parts.push(t('contentStudio.draftRecovery.summary.clipsAdded', { count: summary.clipsAdded }));
  if (summary.clipsRemoved > 0)
    parts.push(t('contentStudio.draftRecovery.summary.clipsRemoved', { count: summary.clipsRemoved }));
  if (summary.clipsChanged > 0)
    parts.push(t('contentStudio.draftRecovery.summary.clipsChanged', { count: summary.clipsChanged }));
  if (summary.tracksAdded > 0)
    parts.push(t('contentStudio.draftRecovery.summary.tracksAdded', { count: summary.tracksAdded }));
  if (summary.tracksRemoved > 0)
    parts.push(t('contentStudio.draftRecovery.summary.tracksRemoved', { count: summary.tracksRemoved }));
  if (summary.captionsChanged) parts.push(t('contentStudio.draftRecovery.summary.captions'));
  if (parts.length === 0) parts.push(t('contentStudio.draftRecovery.summary.other'));
  return (
    <div className="rounded-md border border-edge bg-surface-2 px-3 py-2 text-sm">
      <span className="font-medium text-card-foreground">
        {t('contentStudio.draftRecovery.from', { time: formatRelativeTime(savedAt) })}
      </span>
      <span className="block text-xs text-muted-foreground mt-0.5">{parts.join(' · ')}</span>
    </div>
  );
};

/**
 * DraftRecoveryDialog — the clean crash-recovery prompt (part 08): a local
 * draft exists, it is newer than the server copy, and it is based on exactly
 * the revision we just loaded. Not dismissable (like the conflict dialog):
 * discarding is destructive, so the user must make the choice explicitly
 * rather than lose the draft to a stray Esc.
 */
const DraftRecoveryDialog: React.FC<{
  open: boolean;
  savedAt: number;
  summary: DraftChangeSummary;
  busy: 'recover' | 'discard' | null;
  onRecover: () => void;
  onDiscard: () => void;
}> = ({ open, savedAt, summary, busy, onRecover, onDiscard }) => {
  const { t } = useLocalization('interface');
  return (
    <Dialog open={open} onOpenChange={() => undefined}>
      <DialogContent
        className="sm:max-w-md"
        showCloseButton={false}
        onEscapeKeyDown={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>{t('contentStudio.draftRecovery.title')}</DialogTitle>
          <DialogDescription>{t('contentStudio.draftRecovery.description')}</DialogDescription>
        </DialogHeader>
        <DraftDetail savedAt={savedAt} summary={summary} />
        <DialogFooter className="flex-col gap-2 sm:flex-row sm:justify-end">
          <Button variant="outline" disabled={busy !== null} onClick={onDiscard}>
            {busy === 'discard' ? (
              <Loader2 className="w-4 h-4 mr-1 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4 mr-1" />
            )}
            {t('contentStudio.draftRecovery.discard')}
          </Button>
          <Button disabled={busy !== null} onClick={onRecover}>
            {busy === 'recover' ? (
              <Loader2 className="w-4 h-4 mr-1 animate-spin" />
            ) : (
              <History className="w-4 h-4 mr-1" />
            )}
            {t('contentStudio.draftRecovery.recover')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DraftRecoveryDialog;
