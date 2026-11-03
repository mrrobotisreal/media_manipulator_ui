'use client';

import * as React from 'react';

import { useLocalization } from '@/i18n/useLocalization';
import { AdjustSlider, PanelSection } from '../controls';
import { useOptionalPhotoSession } from '../session-context';
import { useAdjustment } from '../use-adjustment';

/**
 * Detail (design §5.4, MM99): sharpen, blur, noise reduction, clarity, texture,
 * dehaze, vignette, grain. Each section edits one layer of its type (created on
 * first touch, like the Basic panel); masks apply to detail layers through the
 * layers panel like any other layer.
 */
export function DetailPanel() {
  const { t } = useLocalization('interface');
  const session = useOptionalPhotoSession();
  const sh = useAdjustment('sharpen');
  const bl = useAdjustment('blur');
  const nr = useAdjustment('noiseReduction');
  const cl = useAdjustment('clarity');
  const tx = useAdjustment('texture');
  const dh = useAdjustment('dehaze');
  const vg = useAdjustment('vignette');
  const gr = useAdjustment('grain');

  return (
    <div data-testid="panel-detail">
      <PanelSection
        title={t('photo.detail.sharpen.title')}
        actions={
          <button type="button" data-testid="detail-zoom100" className="text-xs text-primary hover:underline" onClick={() => session?.zoom100?.()} title={t('photo.detail.judgeHint')}>
            {t('photo.detail.judge')}
          </button>
        }
      >
        <p className="text-xs text-muted-foreground">{t('photo.detail.judgeHint')}</p>
        <AdjustSlider label={t('photo.detail.sharpen.amount')} value={sh.params.amount} min={0} max={500} defaultValue={100} gestureLabel="sharpen.amount" onChange={(v) => sh.update('Sharpen', 'amount', (p) => ({ ...p, amount: v }))} />
        <AdjustSlider label={t('photo.detail.sharpen.radius')} value={sh.params.radius} min={0.1} max={50} step={0.1} defaultValue={1} gestureLabel="sharpen.radius" onChange={(v) => sh.update('Sharpen', 'radius', (p) => ({ ...p, radius: v }))} />
        <AdjustSlider label={t('photo.detail.sharpen.threshold')} value={sh.params.threshold} min={0} max={255} defaultValue={0} gestureLabel="sharpen.threshold" onChange={(v) => sh.update('Sharpen', 'threshold', (p) => ({ ...p, threshold: v }))} />
      </PanelSection>
      <PanelSection title={t('photo.detail.noise.title')}>
        <AdjustSlider label={t('photo.detail.noise.luminance')} value={nr.params.luminance} min={0} max={100} defaultValue={0} gestureLabel="noiseReduction.luminance" onChange={(v) => nr.update('Noise reduction', 'luminance', (p) => ({ ...p, luminance: v }))} />
        <AdjustSlider label={t('photo.detail.noise.color')} value={nr.params.color} min={0} max={100} defaultValue={0} gestureLabel="noiseReduction.color" onChange={(v) => nr.update('Noise reduction', 'color', (p) => ({ ...p, color: v }))} />
      </PanelSection>
      <PanelSection title={t('photo.detail.blur.title')}>
        <AdjustSlider label={t('photo.detail.blur.radius')} value={bl.params.radius} min={0} max={100} step={0.5} defaultValue={0} gestureLabel="blur.radius" onChange={(v) => bl.update('Blur', 'radius', (p) => ({ ...p, radius: v }))} />
      </PanelSection>
      <PanelSection title={t('photo.detail.presence.title')}>
        <AdjustSlider label={t('photo.detail.presence.clarity')} value={cl.params.amount} min={-100} max={100} defaultValue={0} gestureLabel="clarity.amount" onChange={(v) => cl.update('Clarity', 'amount', (p) => ({ ...p, amount: v }))} />
        <AdjustSlider label={t('photo.detail.presence.texture')} value={tx.params.amount} min={-100} max={100} defaultValue={0} gestureLabel="texture.amount" onChange={(v) => tx.update('Texture', 'amount', (p) => ({ ...p, amount: v }))} />
        <AdjustSlider label={t('photo.detail.presence.dehaze')} value={dh.params.amount} min={-100} max={100} defaultValue={0} gestureLabel="dehaze.amount" onChange={(v) => dh.update('Dehaze', 'amount', (p) => ({ ...p, amount: v }))} />
      </PanelSection>
      <PanelSection title={t('photo.detail.vignette.title')}>
        <AdjustSlider label={t('photo.detail.vignette.amount')} value={vg.params.amount} min={-100} max={100} defaultValue={0} gestureLabel="vignette.amount" onChange={(v) => vg.update('Vignette', 'amount', (p) => ({ ...p, amount: v }))} />
        <AdjustSlider label={t('photo.detail.vignette.midpoint')} value={vg.params.midpoint} min={0} max={100} defaultValue={50} gestureLabel="vignette.midpoint" onChange={(v) => vg.update('Vignette', 'midpoint', (p) => ({ ...p, midpoint: v }))} />
        <AdjustSlider label={t('photo.detail.vignette.roundness')} value={vg.params.roundness} min={-100} max={100} defaultValue={0} gestureLabel="vignette.roundness" onChange={(v) => vg.update('Vignette', 'roundness', (p) => ({ ...p, roundness: v }))} />
        <AdjustSlider label={t('photo.detail.vignette.feather')} value={vg.params.feather} min={0} max={100} defaultValue={50} gestureLabel="vignette.feather" onChange={(v) => vg.update('Vignette', 'feather', (p) => ({ ...p, feather: v }))} />
        <AdjustSlider label={t('photo.detail.vignette.highlights')} value={vg.params.highlights} min={0} max={100} defaultValue={0} gestureLabel="vignette.highlights" onChange={(v) => vg.update('Vignette', 'highlights', (p) => ({ ...p, highlights: v }))} />
      </PanelSection>
      <PanelSection title={t('photo.detail.grain.title')}>
        <AdjustSlider label={t('photo.detail.grain.amount')} value={gr.params.amount} min={0} max={100} defaultValue={0} gestureLabel="grain.amount" onChange={(v) => gr.update('Grain', 'amount', (p) => ({ ...p, amount: v }))} />
        <AdjustSlider label={t('photo.detail.grain.size')} value={gr.params.size} min={1} max={3} defaultValue={1} gestureLabel="grain.size" onChange={(v) => gr.update('Grain', 'size', (p) => ({ ...p, size: v }))} />
        <AdjustSlider label={t('photo.detail.grain.roughness')} value={gr.params.roughness} min={0} max={100} defaultValue={50} gestureLabel="grain.roughness" onChange={(v) => gr.update('Grain', 'roughness', (p) => ({ ...p, roughness: v }))} />
      </PanelSection>
    </div>
  );
}
