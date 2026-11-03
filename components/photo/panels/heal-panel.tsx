'use client';

import * as React from 'react';
import { Loader2 } from 'lucide-react';

import QuotaChip from '@/components/quota-chip';
import { useLocalization } from '@/i18n/useLocalization';
import { PhotoApiError } from '@/lib/photo/projectsApi';
import { runHeal, REAL_HEAL_DEPS, type HealDeps } from '@/lib/photo/healFlow';
import { appendHeal, baseHashOf, currentBaseRef } from '@/lib/photo/healOps';
import { usePhotoStore } from '@/lib/photo/photoStore';
import { onHealCompleted, onHealFailed, onHealRequested } from '@/lib/photo/seams';
import { useToolStore } from '@/lib/photo/toolStore';
import { BRUSH_SIZE_MAX, BRUSH_SIZE_MIN } from '@/lib/photo/brushEngine';
import { AdjustSlider, PanelSection, ToggleChip } from '../controls';
import { getHealStrokes, setHealStrokes } from '../heal-session';
import { usePhotoSession } from '../session-context';

async function toPngBlob(m: { width: number; height: number; data: Uint8ClampedArray }): Promise<Blob> {
  const c = document.createElement('canvas');
  c.width = m.width;
  c.height = m.height;
  const ctx = c.getContext('2d');
  if (!ctx) throw new Error('2d canvas unavailable');
  ctx.putImageData(new ImageData(m.data as unknown as Uint8ClampedArray<ArrayBuffer>, m.width, m.height), 0, 0);
  return new Promise<Blob>((res, rej) => c.toBlob((b) => (b ? res(b) : rej(new Error('encode failed'))), 'image/png'));
}

export interface HealPanelProps {
  /** Test seam: replace the network layer and the mask encoder. */
  deps?: HealDeps;
  encodeMask?: (m: { width: number; height: number; data: Uint8ClampedArray }) => Promise<Blob>;
  /** Test seam: strokes count (the overlay normally drives it). */
  strokes?: number;
}

/** Heal / spot removal (MM98 decision 5): paint spots, press Heal (one `ai_ops`). */
export function HealPanel({ deps = REAL_HEAL_DEPS, encodeMask = toPngBlob, strokes: strokesProp }: HealPanelProps) {
  const { t } = useLocalization('interface');
  const session = usePhotoSession();
  const brush = useToolStore((s) => s.brush);
  const tool = useToolStore((s) => s.tool);
  const heals = usePhotoStore((s) => s.doc?.heals.length ?? 0);
  const [phase, setPhase] = React.useState<'idle' | 'running' | 'failed' | 'quota'>('idle');
  const [progress, setProgress] = React.useState(0);
  const [count, setCount] = React.useState(0);
  const strokes = strokesProp ?? count;
  React.useEffect(() => {
    const id = setInterval(() => setCount(getHealStrokes()?.count ?? 0), 250);
    return () => clearInterval(id);
  }, []);
  const caps = session.capabilities;
  if (caps && caps.heal === false) return <div className="p-3 text-xs text-muted-foreground" data-testid="panel-heal-off">{t('photo.heal.unavailable')}</div>;

  const press = async () => {
    const sess = getHealStrokes();
    const doc = usePhotoStore.getState().doc;
    if (!sess || sess.count === 0 || !doc) return;
    setPhase('running');
    setProgress(0);
    onHealRequested(sess.count);
    try {
      const mask = await encodeMask(sess.maskRgba());
      const file = session.currentFile();
      const base = currentBaseRef(doc);
      const outcome = await runHeal(
        { projectId: session.signedIn ? session.projectId : null, mask, baseHash: baseHashOf(base), file: file?.blob, fileName: file?.name, onProgress: setProgress },
        deps,
      );
      // Install the new base first (so a decode failure leaves the doc untouched), then record it.
      await session.onHealed(outcome);
      usePhotoStore.getState().mutate('Heal', (d) => appendHeal(d, { baseRef: outcome.baseRef, maskRef: outcome.maskRef }));
      sess.clear();
      setHealStrokes(null);
      setCount(0);
      setPhase('idle');
      onHealCompleted();
    } catch (e) {
      const quota = e instanceof Error && e.name === 'QuotaExceededError';
      onHealFailed(quota ? 'quota' : e instanceof PhotoApiError ? e.code || String(e.status) : 'failed');
      setPhase(quota ? 'quota' : 'failed');
    }
  };

  return (
    <div data-testid="panel-heal">
      <PanelSection title={t('photo.heal.title')}>
        <p className="text-xs text-muted-foreground">{t('photo.heal.hint')}</p>
        <div className="flex flex-wrap items-center gap-2">
          <ToggleChip pressed={tool === 'heal'} onClick={() => useToolStore.getState().toggleTool('heal')}>
            {t('photo.heal.brush')}
          </ToggleChip>
          <button
            type="button"
            data-testid="heal-press"
            disabled={phase === 'running' || strokes === 0}
            className="min-h-8 rounded-md border border-primary bg-primary/15 px-3 text-sm disabled:opacity-50"
            onClick={() => void press()}
          >
            {phase === 'running' ? <Loader2 className="me-1 inline size-3 animate-spin" aria-hidden="true" /> : null}
            {t('photo.heal.press')}
          </button>
          <button
            type="button"
            className="min-h-8 rounded-md border border-edge px-3 text-xs disabled:opacity-50"
            disabled={phase === 'running' || strokes === 0}
            onClick={() => {
              getHealStrokes()?.clear();
              setHealStrokes(null);
              setCount(0);
            }}
          >
            {t('photo.heal.clear')}
          </button>
        </div>
        <AdjustSlider label={t('photo.masks.brush.size')} value={brush.size} min={BRUSH_SIZE_MIN} max={BRUSH_SIZE_MAX} step={1} defaultValue={60} gestureLabel="brush.size" onChange={(v) => useToolStore.getState().setBrush({ size: v })} />
        <p className="text-xs text-muted-foreground" aria-live="polite">
          {t('photo.heal.strokes', { count: strokes })}
          {heals > 0 ? ` · ${t('photo.heal.done', { count: heals })}` : ''}
        </p>
        {phase === 'running' ? (
          <p role="status" className="text-xs text-muted-foreground" data-testid="heal-progress">
            {t('photo.heal.running')} {progress > 0 ? `${Math.round(progress)}%` : ''}
          </p>
        ) : null}
        {phase === 'failed' ? <p role="alert" className="text-xs text-destructive">{t('photo.heal.failed')}</p> : null}
        <QuotaChip metric="ai_ops" />
      </PanelSection>
    </div>
  );
}
