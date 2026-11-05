'use client';

import * as React from 'react';
import { Bookmark, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useLocalization } from '@/i18n/useLocalization';
import { MEDI_BRAND, MEDI_MARK_SRC } from '@/lib/assistant/brand';
import { historySteps, resolveLabel, useSnapshotStore } from '@/lib/photo/history';
import { usePhotoStore } from '@/lib/photo/photoStore';
import { presetById } from '@/lib/photo/presets';
import { cn } from '@/lib/utils';
import { PanelSection } from '../controls';

/** Readable label for a history entry (translated; never the raw English string). */
export function useStepLabel() {
  const { t } = useLocalization('interface');
  return React.useCallback(
    (label: string): string => {
      const r = resolveLabel(label);
      if ('medi' in r) return t('photo.history.labels.medi', { brand: MEDI_BRAND, summary: r.medi });
      if ('layerType' in r) return t(`photo.layers.type.${r.layerType}`);
      if ('presetBuiltin' in r) {
        const p = presetById(r.presetBuiltin);
        return t('photo.history.labels.preset', { name: p ? t(p.nameKey) : r.presetBuiltin });
      }
      if ('presetUser' in r) return t('photo.history.labels.preset', { name: r.presetUser });
      return t(r.key);
    },
    [t],
  );
}

/** History (design §5.5, MM99 decision 7): the undo stack as a list, jump, snapshots, clear. */
export function HistoryPanel() {
  const { t } = useLocalization('interface');
  const label = useStepLabel();
  const past = usePhotoStore((s) => s.past);
  const future = usePhotoStore((s) => s.future);
  const snapshots = useSnapshotStore((s) => s.snapshots);
  const steps = React.useMemo(() => historySteps(past, future), [past, future]);
  const [naming, setNaming] = React.useState(false);
  const [name, setName] = React.useState('');
  const current = past.length;

  const addSnapshot = () => {
    const doc = usePhotoStore.getState().doc;
    if (!doc) return;
    useSnapshotStore.getState().add(name || t('photo.history.snapshotDefault', { n: snapshots.length + 1 }), doc);
    setNaming(false);
    setName('');
  };
  const jumpToSnapshot = (id: string) => {
    const snap = snapshots.find((s) => s.id === id);
    if (!snap) return;
    // A jump to a snapshot is itself an undoable step.
    usePhotoStore.getState().mutate('Snapshot', () => snap.doc);
  };

  return (
    <div data-testid="panel-history">
      <PanelSection
        title={t('photo.history.title')}
        actions={
          <Button size="sm" variant="ghost" className="h-7 gap-1 px-2 text-xs" disabled={past.length + future.length === 0} onClick={() => usePhotoStore.getState().clearHistory()} data-testid="history-clear">
            <Trash2 className="size-3.5" aria-hidden="true" />
            {t('photo.history.clear')}
          </Button>
        }
      >
        <ol className="space-y-0.5" data-testid="history-list">
          <li>
            <button
              type="button"
              aria-current={current === 0 ? 'step' : undefined}
              onClick={() => usePhotoStore.getState().jumpTo(0)}
              className={cn('w-full rounded px-2 py-1 text-start text-xs', current === 0 ? 'bg-primary/15' : 'hover:bg-surface-2')}
              data-testid="history-step-0"
            >
              {t('photo.history.original')}
            </button>
          </li>
          {steps.map((s) => (
            <li key={`${s.index}-${s.label}`}>
              <button
                type="button"
                aria-current={s.current ? 'step' : undefined}
                onClick={() => usePhotoStore.getState().jumpTo(s.index)}
                className={cn('w-full rounded px-2 py-1 text-start text-xs', s.current ? 'bg-primary/15' : 'hover:bg-surface-2', !s.applied && 'text-muted-foreground')}
                data-testid={`history-step-${s.index}`}
              >
                {s.label.startsWith('Medi|') ? <img src={MEDI_MARK_SRC} alt="" width={12} height={12} className="me-1.5 inline-block align-[-1px]" data-testid="history-medi-mark" /> : null}
                {label(s.label)}
              </button>
            </li>
          ))}
        </ol>
        {steps.length === 0 ? <p className="text-xs text-muted-foreground">{t('photo.history.empty')}</p> : null}
      </PanelSection>

      <PanelSection
        title={t('photo.history.snapshots')}
        actions={
          <Button size="sm" variant="ghost" className="h-7 gap-1 px-2 text-xs" onClick={() => setNaming(true)} data-testid="snapshot-open">
            <Bookmark className="size-3.5" aria-hidden="true" />
            {t('photo.history.snapshot')}
          </Button>
        }
      >
        {naming ? (
          <div className="flex gap-2">
            <input
              autoFocus
              aria-label={t('photo.history.snapshotName')}
              value={name}
              maxLength={60}
              placeholder={t('photo.history.snapshotDefault', { n: snapshots.length + 1 })}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addSnapshot()}
              className="min-w-0 flex-1 rounded border border-edge bg-background px-2 py-1 text-sm"
            />
            <Button size="sm" onClick={addSnapshot} data-testid="snapshot-confirm">
              {t('photo.history.snapshotSave')}
            </Button>
          </div>
        ) : null}
        {snapshots.length === 0 && !naming ? <p className="text-xs text-muted-foreground">{t('photo.history.snapshotsEmpty')}</p> : null}
        <ul className="space-y-0.5" data-testid="snapshot-list">
          {snapshots.map((s) => (
            <li key={s.id} className="flex items-center gap-1">
              <button type="button" className="min-w-0 flex-1 truncate rounded px-2 py-1 text-start text-xs hover:bg-surface-2" onClick={() => jumpToSnapshot(s.id)} data-testid={`snapshot-${s.id}`}>
                {s.name}
              </button>
              <button type="button" aria-label={t('photo.history.snapshotDelete')} className="text-muted-foreground hover:text-destructive" onClick={() => useSnapshotStore.getState().remove(s.id)}>
                <Trash2 className="size-3.5" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
        <p className="text-xs text-muted-foreground">{t('photo.history.sessionNote')}</p>
      </PanelSection>
    </div>
  );
}
