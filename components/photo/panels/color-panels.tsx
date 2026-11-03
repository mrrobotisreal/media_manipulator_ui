'use client';

import * as React from 'react';

import { useLocalization } from '@/i18n/useLocalization';
import { AdjustSlider, PanelSection, ToggleChip } from '../controls';
import { useAdjustment } from '../use-adjustment';
import { cn } from '@/lib/utils';

const ZONES = ['shadows', 'midtones', 'highlights'] as const;
const RGB = ['r', 'g', 'b'] as const;

export function ColorBalancePanel() {
  const { t } = useLocalization('interface');
  const { params, update } = useAdjustment('colorBalance');
  return (
    <div data-testid="panel-colorBalance">
      {ZONES.map((z) => (
        <PanelSection key={z} title={t(`photo.colorBalance.${z}`)}>
          {RGB.map((c) => (
            <AdjustSlider
              key={c}
              label={t(`photo.colorBalance.${c}`)}
              value={params[z][c]}
              min={-100}
              max={100}
              defaultValue={0}
              gestureLabel={`colorBalance.${z}.${c}`}
              onChange={(v) => update('Colour balance', `${z}.${c}`, (p) => ({ ...p, [z]: { ...p[z], [c]: v } }))}
            />
          ))}
        </PanelSection>
      ))}
      <PanelSection title={t('photo.colorBalance.title')}>
        <ToggleChip pressed={params.preserveLuminosity} onClick={() => update('Colour balance', 'preserveLuminosity', (p) => ({ ...p, preserveLuminosity: !p.preserveLuminosity }))}>
          {t('photo.colorBalance.preserveLuminosity')}
        </ToggleChip>
      </PanelSection>
    </div>
  );
}

const BW = ['reds', 'yellows', 'greens', 'cyans', 'blues', 'magentas'] as const;
export function BlackWhitePanel() {
  const { t } = useLocalization('interface');
  const { params, update, layer } = useAdjustment('blackWhite');
  return (
    <div data-testid="panel-blackWhite">
      <PanelSection
        title={t('photo.blackWhite.title')}
        actions={
          !layer ? (
            <button type="button" className="text-xs text-primary hover:underline" onClick={() => update('Black & white', 'apply', (p) => ({ ...p }))}>
              {t('photo.blackWhite.apply')}
            </button>
          ) : null
        }
      >
        {BW.map((k) => (
          <AdjustSlider
            key={k}
            label={t(`photo.blackWhite.${k}`)}
            value={params[k]}
            min={-200}
            max={300}
            defaultValue={{ reds: 40, yellows: 60, greens: 40, cyans: 60, blues: 20, magentas: 80 }[k]}
            gestureLabel={`blackWhite.${k}`}
            onChange={(v) => update('Black & white', k, (p) => ({ ...p, [k]: v }))}
          />
        ))}
      </PanelSection>
      <PanelSection title={t('photo.blackWhite.tint')}>
        <ToggleChip pressed={!!params.tint} onClick={() => update('Black & white', 'tint', (p) => ({ ...p, tint: p.tint ? null : { hue: 40, saturation: 20 } }))}>
          {t('photo.blackWhite.tint')}
        </ToggleChip>
        {params.tint ? (
          <>
            <AdjustSlider label={t('photo.blackWhite.tintHue')} value={params.tint.hue} min={0} max={360} defaultValue={40} gestureLabel="blackWhite.tintHue" onChange={(v) => update('Black & white', 'tintHue', (p) => ({ ...p, tint: { hue: v, saturation: p.tint?.saturation ?? 0 } }))} />
            <AdjustSlider label={t('photo.blackWhite.tintSaturation')} value={params.tint.saturation} min={0} max={100} defaultValue={20} gestureLabel="blackWhite.tintSaturation" onChange={(v) => update('Black & white', 'tintSaturation', (p) => ({ ...p, tint: { hue: p.tint?.hue ?? 0, saturation: v } }))} />
          </>
        ) : null}
      </PanelSection>
    </div>
  );
}

export function ChannelMixerPanel() {
  const { t } = useLocalization('interface');
  const { params, update } = useAdjustment('channelMixer');
  return (
    <div data-testid="panel-channelMixer">
      {RGB.map((out) => (
        <PanelSection key={out} title={t(`photo.channelMixer.out.${out}`)}>
          {([...RGB, 'constant'] as const).map((src) => (
            <AdjustSlider
              key={src}
              label={t(`photo.channelMixer.${src}`)}
              value={params[out][src]}
              min={-200}
              max={200}
              defaultValue={src === out ? 100 : 0}
              gestureLabel={`channelMixer.${out}.${src}`}
              onChange={(v) => update('Channel mixer', `${out}.${src}`, (p) => ({ ...p, [out]: { ...p[out], [src]: v } }))}
            />
          ))}
        </PanelSection>
      ))}
      <PanelSection title={t('photo.channelMixer.title')}>
        <ToggleChip pressed={params.monochrome} onClick={() => update('Channel mixer', 'monochrome', (p) => ({ ...p, monochrome: !p.monochrome }))}>
          {t('photo.channelMixer.monochrome')}
        </ToggleChip>
      </PanelSection>
    </div>
  );
}

const FILTERS: Array<{ key: 'warming' | 'cooling' | 'sepia' | 'red' | 'green' | 'blue'; color: string }> = [
  { key: 'warming', color: '#ec8a00' },
  { key: 'cooling', color: '#0a5dc8' },
  { key: 'sepia', color: '#ac7a33' },
  { key: 'red', color: '#e81c1c' },
  { key: 'green', color: '#1fb52f' },
  { key: 'blue', color: '#1c3ee8' },
];
export function PhotoFilterPanel() {
  const { t } = useLocalization('interface');
  const { params, update } = useAdjustment('photoFilter');
  return (
    <div data-testid="panel-photoFilter">
      <PanelSection title={t('photo.photoFilter.title')}>
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label={t('photo.photoFilter.color')}>
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              title={t(`photo.photoFilter.${f.key}`)}
              aria-label={t(`photo.photoFilter.${f.key}`)}
              aria-pressed={params.color === f.color}
              onClick={() => update('Photo filter', 'color', (p) => ({ ...p, color: f.color }))}
              className={cn('size-8 rounded-full border-2', params.color === f.color ? 'border-primary' : 'border-edge')}
              style={{ background: f.color }}
            />
          ))}
          <label className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <input
              type="color"
              aria-label={t('photo.photoFilter.custom')}
              value={params.color}
              onChange={(e) => update('Photo filter', 'color', (p) => ({ ...p, color: e.target.value.toLowerCase() }))}
              className="size-8 cursor-pointer rounded border border-edge bg-transparent p-0"
            />
            {t('photo.photoFilter.custom')}
          </label>
        </div>
        <AdjustSlider label={t('photo.photoFilter.density')} value={params.density} min={0} max={100} defaultValue={25} gestureLabel="photoFilter.density" onChange={(v) => update('Photo filter', 'density', (p) => ({ ...p, density: v }))} />
        <ToggleChip pressed={params.preserveLuminosity} onClick={() => update('Photo filter', 'preserveLuminosity', (p) => ({ ...p, preserveLuminosity: !p.preserveLuminosity }))}>
          {t('photo.photoFilter.preserveLuminosity')}
        </ToggleChip>
      </PanelSection>
    </div>
  );
}

export function SplitTonePanel() {
  const { t } = useLocalization('interface');
  const { params, update } = useAdjustment('splitTone');
  return (
    <div data-testid="panel-splitTone">
      {(['shadows', 'highlights'] as const).map((z) => (
        <PanelSection key={z} title={t(`photo.splitTone.${z}`)}>
          <AdjustSlider label={t('photo.splitTone.hue')} value={params[z].hue} min={0} max={360} defaultValue={0} gestureLabel={`splitTone.${z}.hue`} onChange={(v) => update('Split toning', `${z}.hue`, (p) => ({ ...p, [z]: { ...p[z], hue: v } }))} />
          <AdjustSlider label={t('photo.splitTone.saturation')} value={params[z].saturation} min={0} max={100} defaultValue={0} gestureLabel={`splitTone.${z}.saturation`} onChange={(v) => update('Split toning', `${z}.saturation`, (p) => ({ ...p, [z]: { ...p[z], saturation: v } }))} />
        </PanelSection>
      ))}
      <PanelSection title={t('photo.splitTone.title')}>
        <AdjustSlider label={t('photo.splitTone.balance')} value={params.balance} min={-100} max={100} defaultValue={0} gestureLabel="splitTone.balance" onChange={(v) => update('Split toning', 'balance', (p) => ({ ...p, balance: v }))} />
      </PanelSection>
    </div>
  );
}
