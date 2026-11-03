'use client';

import * as React from 'react';

import { useLocalization } from '@/i18n/useLocalization';
import { addCustomRange, greyExcept } from '@/lib/photo/layerOps';
import { defaultHslRanges, HSL_RANGE_IDS, type HslRange } from '@/lib/photo/photoTypes';
import { rgbToHsl } from '@/lib/photo/colorMath';
import { AdjustSlider, PanelSection, ToggleChip } from '../controls';
import { useAdjustment } from '../use-adjustment';

const SWATCH: Record<string, string> = { reds: '#ef4444', yellows: '#eab308', greens: '#22c55e', cyans: '#06b6d4', blues: '#3b82f6', magentas: '#d946ef' };

export function HslPanel({ pickedValue, onRequestPick }: { pickedValue?: { r: number; g: number; b: number } | null; onRequestPick?: () => void }) {
  const { t } = useLocalization('interface');
  const { params, update, layer } = useAdjustment('hsl');
  const [sel, setSel] = React.useState<string>('master');
  const ranges: HslRange[] = params.ranges;
  const rangeName = (r: HslRange, i: number) =>
    (HSL_RANGE_IDS as readonly string[]).includes(r.id) ? t(`photo.hsl.range.${r.id}`) : r.name || t('photo.hsl.custom', { index: i - 5 });

  // Eyedropper hand-off: a custom range centred on the picked hue (handled once per pick).
  const [seenPick, setSeenPick] = React.useState<unknown>(null);
  if (pickedValue && pickedValue !== seenPick) {
    setSeenPick(pickedValue);
    const [h, sat] = rgbToHsl([pickedValue.r / 255, pickedValue.g / 255, pickedValue.b / 255]);
    if (sat >= 0.05) {
      const added = addCustomRange(ranges, h);
      queueMicrotask(() => update('Add colour range', 'ranges', (p) => ({ ...p, ranges: added.ranges })));
      setSel(added.id);
    }
  }

  const current = sel === 'master' ? null : ranges.find((r) => r.id === sel) ?? null;
  const target = current ?? params.master;
  const setField = (field: 'hue' | 'saturation' | 'lightness' | 'width' | 'feather', value: number) => {
    update('Colour', `${sel}.${field}`, (p) => {
      if (!current) return { ...p, master: { ...p.master, [field]: value } };
      return { ...p, ranges: ranges.map((r) => (r.id === sel ? { ...r, [field]: value } : r)) };
    });
  };
  const ensureRanges = (): HslRange[] => (ranges.length ? ranges : defaultHslRanges());

  return (
    <div data-testid="panel-hsl">
      <PanelSection title={t('photo.panels.hsl')}>
        <div className="flex flex-wrap gap-1.5" role="group" aria-label={t('photo.hsl.selected')}>
          <ToggleChip pressed={sel === 'master'} onClick={() => setSel('master')}>
            {t('photo.hsl.master')}
          </ToggleChip>
          {ranges.map((r, i) => (
            <ToggleChip key={r.id} pressed={sel === r.id} onClick={() => setSel(r.id)} className="inline-flex items-center gap-1.5">
              <span aria-hidden="true" className="size-2.5 rounded-full" style={{ background: SWATCH[r.id] ?? `hsl(${r.center} 80% 55%)` }} />
              {rangeName(r, i)}
            </ToggleChip>
          ))}
        </div>

        {current ? (
          <button
            type="button"
            data-testid="grey-except-this"
            className="w-full rounded-md border border-primary/50 bg-primary/10 px-3 py-2 text-sm font-medium text-foreground hover:bg-primary/20"
            onClick={() => {
              const base = ensureRanges();
              update('Grey except', current.id, (p) => ({ ...p, ranges: greyExcept(p.ranges.length ? p.ranges : base, current.id) }));
            }}
          >
            {t('photo.hsl.greyExceptNamed', { name: rangeName(current, ranges.indexOf(current)) })}
          </button>
        ) : null}

        <AdjustSlider label={t('photo.hsl.hue')} value={target.hue} min={-180} max={180} defaultValue={0} gestureLabel="hsl.hue" onChange={(v) => setField('hue', v)} />
        <AdjustSlider label={t('photo.hsl.saturation')} value={target.saturation} min={-100} max={100} defaultValue={0} gestureLabel="hsl.saturation" onChange={(v) => setField('saturation', v)} />
        <AdjustSlider label={t('photo.hsl.lightness')} value={target.lightness} min={-100} max={100} defaultValue={0} gestureLabel="hsl.lightness" onChange={(v) => setField('lightness', v)} />
        {current && !(HSL_RANGE_IDS as readonly string[]).includes(current.id) ? (
          <>
            <AdjustSlider label={t('photo.hsl.width')} value={current.width} min={10} max={120} defaultValue={20} gestureLabel="hsl.width" onChange={(v) => setField('width', v)} />
            <AdjustSlider label={t('photo.hsl.feather')} value={current.feather} min={0} max={90} defaultValue={20} gestureLabel="hsl.feather" onChange={(v) => setField('feather', v)} />
            <button
              type="button"
              className="text-xs text-muted-foreground hover:text-foreground"
              onClick={() => {
                update('Remove colour range', current.id, (p) => ({ ...p, ranges: p.ranges.filter((r) => r.id !== current.id) }));
                setSel('master');
              }}
            >
              {t('photo.hsl.removeRange')}
            </button>
          </>
        ) : null}
        <div className="flex items-center justify-between">
          {onRequestPick ? (
            <button type="button" className="text-xs text-primary hover:underline" onClick={onRequestPick}>
              {t('photo.hsl.pickRange')}
            </button>
          ) : <span />}
          <button
            type="button"
            className="text-xs text-muted-foreground hover:text-foreground disabled:opacity-40"
            disabled={!layer}
            onClick={() => update('Reset colours', 'ranges', (p) => ({ ...p, master: { hue: 0, saturation: 0, lightness: 0 }, ranges: defaultHslRanges() }))}
          >
            {t('photo.hsl.resetRanges')}
          </button>
        </div>
      </PanelSection>
    </div>
  );
}
