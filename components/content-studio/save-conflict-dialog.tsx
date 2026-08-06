'use client';

import React from 'react';
import { Loader2, RotateCcw, Upload } from 'lucide-react';
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
 */
const SaveConflictDialog: React.FC<{
  open: boolean;
  /** Which resolution is in flight, if any (disables both buttons). */
  busy: 'reload' | 'takeOver' | null;
  onReload: () => void;
  onTakeOver: () => void;
}> = ({ open, busy, onReload, onTakeOver }) => {
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
          <DialogTitle>{t('contentStudio.saveConflict.title')}</DialogTitle>
          <DialogDescription>{t('contentStudio.saveConflict.description')}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col gap-2 sm:flex-row sm:justify-end">
          <Button variant="outline" disabled={busy !== null} onClick={onReload}>
            {busy === 'reload' ? (
              <Loader2 className="w-4 h-4 mr-1 animate-spin" />
            ) : (
              <RotateCcw className="w-4 h-4 mr-1" />
            )}
            {t('contentStudio.saveConflict.reload')}
          </Button>
          <Button disabled={busy !== null} onClick={onTakeOver}>
            {busy === 'takeOver' ? (
              <Loader2 className="w-4 h-4 mr-1 animate-spin" />
            ) : (
              <Upload className="w-4 h-4 mr-1" />
            )}
            {t('contentStudio.saveConflict.takeOver')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SaveConflictDialog;
