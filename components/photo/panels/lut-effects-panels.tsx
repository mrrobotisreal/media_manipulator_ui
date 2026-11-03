'use client';

import * as React from 'react';

import { useLocalization } from '@/i18n/useLocalization';
import { readCubeFile } from '@/lib/photo/lutFile';
import { AdjustSlider, PanelSection, ToggleChip } from '../controls';
import { useAdjustment } from '../use-adjustment';
import { usePhotoStore } from '@/lib/photo/photoStore';
import { newLayer } from '@/lib/photo/layerOps';
import type { LayerType } from '@/lib/photo/photoTypes';

export function LutPanel() {
  const { t } = useLocalization('interface');
  const { params, update } = useAdjustment('lut');
  const [error, setError] = React.useState<'tooBig' | 'invalid' | null>(null);
  const input = React.useRef<HTMLInputElement>(null);

  const take = async (file: File | undefined) => {
    if (!file) return;
    const r = await readCubeFile(file);
    if (!r.ok) {
      setError(r.reason);
      return;
    }
    setError(null);
    update('LUT', 'cube', (p) => ({ ...p, cube: r.text }));
  };

  return (
    <div data-testid="panel-lut">
      <PanelSection title={t('photo.lut.title')}>
        <div
          className="rounded border border-dashed border-edge p-4 text-center text-xs text-muted-foreground"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            void take(e.dataTransfer.files[0]);
          }}
        >
          <p>{t('photo.lut.drop')}</p>
          <button type="button" className="mt-2 text-primary hover:underline" onClick={() => input.current?.click()}>
            {t('photo.lut.choose')}
          </button>
          <input ref={input} type="file" accept=".cube" className="sr-only" data-testid="lut-input" aria-label={t('photo.lut.choose')} onChange={(e) => void take(e.target.files?.[0])} />
        </div>
        {error ? <p role="alert" className="text-xs text-destructive">{t(error === 'tooBig' ? 'photo.lut.tooBig' : 'photo.lut.invalid')}</p> : null}
        {params.cube ? <p className="text-xs text-muted-foreground">{t('photo.lut.loaded')}</p> : null}
        <AdjustSlider label={t('photo.lut.intensity')} value={params.intensity} min={0} max={1} step={0.01} defaultValue={1} gestureLabel="lut.intensity" onChange={(v) => update('LUT', 'intensity', (p) => ({ ...p, intensity: v }))} />
        {params.cube ? (
          <button type="button" className="text-xs text-muted-foreground hover:text-foreground" onClick={() => update('Remove LUT', 'cube', (p) => ({ ...p, cube: '' }))}>
            {t('photo.lut.clear')}
          </button>
        ) : null}
      </PanelSection>
    </div>
  );
}

/** Effects add/remove their own layer: invert, posterize, threshold, gamma. */
export function EffectsPanel() {
  const { t } = useLocalization('interface');
  const layers = usePhotoStore((s) => s.doc?.layers ?? []);
  const has = (type: LayerType) => layers.some((l) => l.type === type);
  const toggle = (type: LayerType) =>
    usePhotoStore.getState().mutate(type, (d) => {
      const existing = d.layers.find((l) => l.type === type);
      if (existing) return { ...d, layers: d.layers.filter((l) => l !== existing) };
      return { ...d, layers: [...d.layers, newLayer(d, type)] };
    });
  const post = useAdjustment('posterize');
  const thr = useAdjustment('threshold');
  const gam = useAdjustment('gamma');
  return (
    <div data-testid="panel-effects">
      <PanelSection title={t('photo.effects.invert')} actions={<ToggleChip pressed={has('invert')} onClick={() => toggle('invert')}>{has('invert') ? t('photo.effects.remove') : t('photo.effects.add')}</ToggleChip>}>
        <span />
      </PanelSection>
      <PanelSection title={t('photo.effects.posterize')} actions={<ToggleChip pressed={has('posterize')} onClick={() => toggle('posterize')}>{has('posterize') ? t('photo.effects.remove') : t('photo.effects.add')}</ToggleChip>}>
        {has('posterize') ? <AdjustSlider label={t('photo.effects.levels')} value={post.params.levels} min={2} max={255} defaultValue={4} gestureLabel="posterize.levels" onChange={(v) => post.update('Posterize', 'levels', (p) => ({ ...p, levels: v }))} /> : null}
      </PanelSection>
      <PanelSection title={t('photo.effects.threshold')} actions={<ToggleChip pressed={has('threshold')} onClick={() => toggle('threshold')}>{has('threshold') ? t('photo.effects.remove') : t('photo.effects.add')}</ToggleChip>}>
        {has('threshold') ? <AdjustSlider label={t('photo.effects.level')} value={thr.params.level} min={0} max={1} step={0.005} defaultValue={0.5} gestureLabel="threshold.level" onChange={(v) => thr.update('Threshold', 'level', (p) => ({ ...p, level: v }))} /> : null}
      </PanelSection>
      <PanelSection title={t('photo.effects.gamma')} actions={<ToggleChip pressed={has('gamma')} onClick={() => toggle('gamma')}>{has('gamma') ? t('photo.effects.remove') : t('photo.effects.add')}</ToggleChip>}>
        {has('gamma') ? <AdjustSlider label={t('photo.effects.gamma')} value={gam.params.gamma} min={0.1} max={10} step={0.01} defaultValue={1} gestureLabel="gamma.gamma" onChange={(v) => gam.update('Gamma', 'gamma', (p) => ({ ...p, gamma: v }))} /> : null}
      </PanelSection>
    </div>
  );
}
