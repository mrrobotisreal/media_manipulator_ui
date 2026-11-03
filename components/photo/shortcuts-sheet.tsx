'use client';

import * as React from 'react';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useLocalization } from '@/i18n/useLocalization';
import { SHORTCUTS, SHORTCUT_GROUPS, formatKey } from '@/lib/photo/shortcuts';

/** The `?` sheet (MM99 decision 8): lists every shortcut in the registry the editor's key handler reads. */
export function ShortcutsSheet({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const { t } = useLocalization('interface');
  const mac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent || '');
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[88dvh] overflow-y-auto sm:max-w-[560px]" data-testid="shortcuts-sheet">
        <DialogHeader>
          <DialogTitle>{t('photo.shortcuts.title')}</DialogTitle>
          <DialogDescription>{t('photo.shortcuts.description')}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          {SHORTCUT_GROUPS.map((g) => (
            <section key={g} aria-label={t(`photo.shortcuts.group.${g}`)}>
              <h3 className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t(`photo.shortcuts.group.${g}`)}</h3>
              <dl className="space-y-1">
                {SHORTCUTS.filter((s) => s.group === g).map((s) => (
                  <div key={s.id} className="flex items-center justify-between gap-3 text-sm" data-testid={`shortcut-${s.id}`}>
                    <dt>{t(`photo.shortcuts.action.${s.id}`)}</dt>
                    <dd className="flex gap-1" dir="ltr">
                      {s.keys.map((k) => (
                        <kbd key={k} className="rounded border border-edge bg-surface-2 px-1.5 py-0.5 font-mono text-xs">
                          {formatKey(k, mac)}
                        </kbd>
                      ))}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
