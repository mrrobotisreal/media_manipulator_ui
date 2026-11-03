'use client';

import * as React from 'react';

import { useLocalization } from '@/i18n/useLocalization';
import { AdjustSlider, PanelSection } from '../controls';
import { useAdjustment } from '../use-adjustment';

/** One slider row bound to a numeric key of a layer's params. */
function Row<P extends Record<string, unknown>>({
  type,
  param,
  label,
  min,
  max,
  step = 1,
  def,
  value,
  set,
}: {
  type: string;
  param: keyof P & string;
  label: string;
  min: number;
  max: number;
  step?: number;
  def: number;
  value: number;
  set: (param: string, label: string, v: number) => void;
}) {
  return (
    <AdjustSlider
      label={label}
      value={value}
      min={min}
      max={max}
      step={step}
      defaultValue={def}
      gestureLabel={`${type}.${param}`}
      onChange={(v) => set(param, label, v)}
    />
  );
}

/** Basic: exposure, light, tone, white balance, vibrance/saturation. Each group is one layer of its type. */
export function BasicPanel() {
  const { t } = useLocalization('interface');
  const ex = useAdjustment('exposure');
  const bc = useAdjustment('brightnessContrast');
  const tone = useAdjustment('tone');
  const wb = useAdjustment('whiteBalance');
  const vs = useAdjustment('vibranceSaturation');

  return (
    <div data-testid="panel-basic">
      <PanelSection title={t('photo.params.exposure.title')}>
        <Row type="exposure" param="ev" label={t('photo.params.exposure.ev')} min={-5} max={5} step={0.05} def={0} value={ex.params.ev} set={(p, l, v) => ex.update(l, p, (x) => ({ ...x, [p]: v }))} />
        <Row type="exposure" param="offset" label={t('photo.params.exposure.offset')} min={-0.5} max={0.5} step={0.005} def={0} value={ex.params.offset} set={(p, l, v) => ex.update(l, p, (x) => ({ ...x, [p]: v }))} />
        <Row type="exposure" param="gamma" label={t('photo.params.exposure.gamma')} min={0.1} max={10} step={0.01} def={1} value={ex.params.gamma} set={(p, l, v) => ex.update(l, p, (x) => ({ ...x, [p]: v }))} />
      </PanelSection>
      <PanelSection title={t('photo.params.brightnessContrast.title')}>
        <Row type="brightnessContrast" param="brightness" label={t('photo.params.brightnessContrast.brightness')} min={-100} max={100} def={0} value={bc.params.brightness} set={(p, l, v) => bc.update(l, p, (x) => ({ ...x, [p]: v }))} />
        <Row type="brightnessContrast" param="contrast" label={t('photo.params.brightnessContrast.contrast')} min={-100} max={100} def={0} value={bc.params.contrast} set={(p, l, v) => bc.update(l, p, (x) => ({ ...x, [p]: v }))} />
      </PanelSection>
      <PanelSection title={t('photo.params.tone.title')}>
        {(['highlights', 'shadows', 'whites', 'blacks'] as const).map((k) => (
          <Row key={k} type="tone" param={k} label={t(`photo.params.tone.${k}`)} min={-100} max={100} def={0} value={tone.params[k]} set={(p, l, v) => tone.update(l, p, (x) => ({ ...x, [p]: v }))} />
        ))}
      </PanelSection>
      <PanelSection title={t('photo.params.whiteBalance.title')}>
        <Row type="whiteBalance" param="temperature" label={t('photo.params.whiteBalance.temperature')} min={-100} max={100} def={0} value={wb.params.temperature} set={(p, l, v) => wb.update(l, p, (x) => ({ ...x, [p]: v }))} />
        <Row type="whiteBalance" param="tint" label={t('photo.params.whiteBalance.tint')} min={-100} max={100} def={0} value={wb.params.tint} set={(p, l, v) => wb.update(l, p, (x) => ({ ...x, [p]: v }))} />
      </PanelSection>
      <PanelSection title={t('photo.params.vibranceSaturation.title')}>
        <Row type="vibranceSaturation" param="vibrance" label={t('photo.params.vibranceSaturation.vibrance')} min={-100} max={100} def={0} value={vs.params.vibrance} set={(p, l, v) => vs.update(l, p, (x) => ({ ...x, [p]: v }))} />
        <Row type="vibranceSaturation" param="saturation" label={t('photo.params.vibranceSaturation.saturation')} min={-100} max={100} def={0} value={vs.params.saturation} set={(p, l, v) => vs.update(l, p, (x) => ({ ...x, [p]: v }))} />
      </PanelSection>
    </div>
  );
}
