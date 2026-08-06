'use client';

import React from 'react';
import { History, Loader2, RotateCcw, Trash2, Upload } from 'lucide-react';
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
import type { DraftChangeSummary } from '@/lib/studio/draftRecovery';
import { DraftDetail } from './draft-recovery-dialog';

/**
 * SaveConflictDialog — shown when a save came back 409: the project was changed
 * in another tab or device (ADR ws/0001: single-writer, never merge). The user
 * must pick one of two resolutions; the dialog is deliberately not dismissable
 * (no ✕, Esc and outside clicks ignored) because autosaving is blocked until
 * the conflict resolves and silently closing it would strand the session.
 *
 * - Reload latest: refetch the project, replace the local document, reset
 *   undo history.
 * - Take over: re-save the local document with expectedRevision set to the
 *   server's current revision, overwriting the other writer's save.
 *
 * Part 08 adds `mode="draft"` — the same conflict shape reached from crash
 * recovery: a local draft exists but the project was saved elsewhere *after*
 * the draft was taken (its base revision is older than the server's). The two
 * resolutions become "recover and take over" (restore the draft and save it
 * over the newer server copy) and "discard draft"; `savedAt`/`summary`
 * describe the draft.
 */
const SaveConflictDialog: React.FC<{
  open: boolean;
  mode?: 'save' | 'draft';
  /** draft mode: when the draft was written + what it changes. */
  savedAt?: number;
  summary?: DraftChangeSummary;
  /** Which resolution is in flight, if any (disables both buttons). */
  busy: 'reload' | 'takeOver' | null;
  /** save mode: reload latest · draft mode: discard the draft. */
  onReload: () => void;
  /** save mode: take over · draft mode: recover and take over. */
  onTakeOver: () => void;
}> = ({ open, mode = 'save', savedAt, summary, busy, onReload, onTakeOver }) => {
  const { t } = useLocalization('interface');
  const draft = mode === 'draft';
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
          <DialogTitle>
            {draft ? t('contentStudio.draftRecovery.conflict.title') : t('contentStudio.saveConflict.title')}
          </DialogTitle>
          <DialogDescription>
            {draft
              ? t('contentStudio.draftRecovery.conflict.description')
              : t('contentStudio.saveConflict.description')}
          </DialogDescription>
        </DialogHeader>
        {draft && savedAt !== undefined && summary ? (
          <DraftDetail savedAt={savedAt} summary={summary} />
        ) : null}
        <DialogFooter className="flex-col gap-2 sm:flex-row sm:justify-end">
          <Button variant="outline" disabled={busy !== null} onClick={onReload}>
            {busy === 'reload' ? (
              <Loader2 className="w-4 h-4 mr-1 animate-spin" />
            ) : draft ? (
              <Trash2 className="w-4 h-4 mr-1" />
            ) : (
              <RotateCcw className="w-4 h-4 mr-1" />
            )}
            {draft
              ? t('contentStudio.draftRecovery.conflict.discard')
              : t('contentStudio.saveConflict.reload')}
          </Button>
          <Button disabled={busy !== null} onClick={onTakeOver}>
            {busy === 'takeOver' ? (
              <Loader2 className="w-4 h-4 mr-1 animate-spin" />
            ) : draft ? (
              <History className="w-4 h-4 mr-1" />
            ) : (
              <Upload className="w-4 h-4 mr-1" />
            )}
            {draft
              ? t('contentStudio.draftRecovery.conflict.recover')
              : t('contentStudio.saveConflict.takeOver')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SaveConflictDialog;
