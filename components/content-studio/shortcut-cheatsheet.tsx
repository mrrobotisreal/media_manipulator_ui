'use client';

import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useLocalization } from '@/i18n/useLocalization';
import { useStudioStore } from '@/lib/studioStore';
import { cheatSheetSections } from '@/lib/studio/keymap';

/**
 * The `?` shortcut cheat sheet. Rows are generated from lib/studio/keymap.ts
 * (the same table the keydown handler reads), so the sheet can never drift from
 * the real bindings. Descriptions come straight from the table; only the
 * chrome and category headings are localized.
 */
const ShortcutCheatSheet: React.FC = () => {
  const { t } = useLocalization('interface');
  const open = useStudioStore((s) => s.cheatSheetOpen);
  const setOpen = useStudioStore((s) => s.setCheatSheetOpen);
  const sections = React.useMemo(() => cheatSheetSections(), []);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{t('contentStudio.keymap.title')}</DialogTitle>
          <DialogDescription>{t('contentStudio.keymap.description')}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-5 sm:grid-cols-2">
          {sections.map((section) => (
            <section key={section.category} aria-labelledby={`km-${section.category}`}>
              <h3
                id={`km-${section.category}`}
                className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground"
              >
                {t(`contentStudio.keymap.category.${section.category}`)}
              </h3>
              <ul className="space-y-1">
                {section.rows.map((row) => (
                  <li key={row.command} className="flex items-start justify-between gap-3 text-xs">
                    <span className="text-foreground/90">{row.description}</span>
                    <span className="flex shrink-0 flex-wrap justify-end gap-1">
                      {row.keys.map((k) => (
                        <kbd
                          key={k}
                          className="rounded border border-border bg-surface-0 px-1.5 py-0.5 font-mono text-[10px] text-foreground"
                        >
                          {k}
                        </kbd>
                      ))}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShortcutCheatSheet;
