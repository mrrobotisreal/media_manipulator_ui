'use client';

import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useLocalization } from '@/i18n/useLocalization';

/** 409: the project changed elsewhere. Both choices are always offered. */
export function ConflictDialog({ open, onKeepMine, onLoadTheirs }: { open: boolean; onKeepMine: () => void; onLoadTheirs: () => void }) {
  const { t } = useLocalization('interface');
  return (
    <Dialog open={open}>
      <DialogContent showCloseButton={false} data-testid="conflict-dialog">
        <DialogHeader>
          <DialogTitle>{t('photo.conflict.title')}</DialogTitle>
          <DialogDescription>{t('photo.conflict.body')}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onLoadTheirs}>
            {t('photo.conflict.loadTheirs')}
          </Button>
          <Button onClick={onKeepMine}>{t('photo.conflict.keepMine')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/** Opening a second photo as a guest replaces the single browser-local project. */
export function ReplaceLocalDialog({ open, onConfirm, onCancel }: { open: boolean; onConfirm: () => void; onCancel: () => void }) {
  const { t } = useLocalization('interface');
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onCancel()}>
      <DialogContent data-testid="replace-dialog">
        <DialogHeader>
          <DialogTitle>{t('photo.open.replace.title')}</DialogTitle>
          <DialogDescription>{t('photo.open.replace.body')}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            {t('photo.open.replace.cancel')}
          </Button>
          <Button onClick={onConfirm}>{t('photo.open.replace.confirm')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/** Crash recovery: restore unsaved edits found in the draft buffer. */
export function DraftDialog({ open, when, onRestore, onDiscard }: { open: boolean; when: string; onRestore: () => void; onDiscard: () => void }) {
  const { t } = useLocalization('interface');
  return (
    <Dialog open={open}>
      <DialogContent showCloseButton={false} data-testid="draft-dialog">
        <DialogHeader>
          <DialogTitle>{t('photo.draft.title')}</DialogTitle>
          <DialogDescription>{t('photo.draft.body', { when })}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onDiscard}>
            {t('photo.draft.discard')}
          </Button>
          <Button onClick={onRestore}>{t('photo.draft.restore')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/** Guest banner: neutral, no purchase link. `count` is the free tier's project cap. */
export function LocalBanner({ count, cta, onShown }: { count: number; cta?: React.ReactNode; onShown?: () => void }) {
  const { t } = useLocalization('interface');
  React.useEffect(() => onShown?.(), [onShown]);
  return (
    <p className="border-b border-edge bg-surface-2 px-3 py-1.5 text-xs text-muted-foreground" data-testid="local-banner">
      {t('photo.banner.local', { count })} {cta}
    </p>
  );
}

/** After sign-in: offer to keep the browser-local project on the account. */
export function UploadOffer({ canUpload, busy, error, onAccept, onDismiss, cta, onShown }: { canUpload: boolean; busy: boolean; error: boolean; onAccept: () => void; onDismiss: () => void; cta?: React.ReactNode; onShown?: () => void }) {
  const { t } = useLocalization('interface');
  React.useEffect(() => onShown?.(), [onShown]);
  return (
    <div className="flex flex-wrap items-center gap-3 border-b border-edge bg-primary/10 px-3 py-2 text-sm" role="status" data-testid="upload-offer">
      <div className="min-w-0 flex-1">
        <p className="font-medium">{t('photo.banner.offerTitle')}</p>
        <p className="text-xs text-muted-foreground">{canUpload ? t('photo.banner.offerBody') : t('photo.banner.offerFull')} {cta}</p>
        {error ? <p className="text-xs text-destructive">{t('photo.banner.uploadFailed')}</p> : null}
      </div>
      {canUpload ? (
        <Button size="sm" disabled={busy} onClick={onAccept}>
          {t('photo.banner.offerAccept')}
        </Button>
      ) : null}
      <Button size="sm" variant="outline" onClick={onDismiss}>
        {t('photo.banner.offerDismiss')}
      </Button>
    </div>
  );
}

