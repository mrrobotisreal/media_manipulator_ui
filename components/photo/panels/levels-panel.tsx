'use client';

import * as React from 'react';

import { useLocalization } from '@/i18n/useLocalization';
import { LEVELS_DEFAULT, gammaToPos, isIdentityLevels, posToGamma, setLevelsField, type LevelsField, type LevelsValues } from '@/lib/photo/levelsEdit';
import type { Histogram } from '@/lib/photo/gl/histogram';
import { PanelSection, ToggleChip } from '../controls';
import { AdjustSlider } from '../controls';
import { useAdjustment } from '../use-adjustment';
import { HistogramPlot } from '../histogram-plot';

type Channel = 'master' | 'r' | 'g' | 'b';
const CHANNELS: Channel[] = ['master', 'r', 'g', 'b'];

export function LevelsPanel({ histogram }: { histogram: Histogram | null }) {
  const { t } = useLocalization('interface');
  const { params, update, layer } = useAdjustment('levels');
  const [channel, setChannel] = React.useState<Channel>('master');
  const v = params[channel] as LevelsValues;

  const set = (field: LevelsField, value: number) => {
    update('Levels', channel, (p) => {
      const cur = p[channel] as LevelsValues;
      const next = setLevelsField(cur, field, value);
      return next === cur ? p : { ...p, [channel]: next };
    });
  };

  return (
    <div data-testid="panel-levels">
      <PanelSection
        title={t('photo.panels.levels')}
        actions={
          <button
            type="button"
            className="text-xs text-muted-foreground hover:text-foreground disabled:opacity-40"
            disabled={!layer || isIdentityLevels(v)}
            onClick={() => update('Reset levels', channel, (p) => ({ ...p, [channel]: { ...LEVELS_DEFAULT } }))}
          >
            {t('photo.levels.reset')}
          </button>
        }
      >
        <div className="flex flex-wrap gap-1.5" role="group" aria-label={t('photo.panels.levels')}>
          {CHANNELS.map((c) => (
            <ToggleChip key={c} pressed={channel === c} onClick={() => setChannel(c)}>
              {t(`photo.levels.channel.${c}`)}
            </ToggleChip>
          ))}
        </div>
        <div dir="ltr" className="relative">
          <HistogramPlot histogram={histogram} channel={channel === 'master' ? 'luma' : channel} className="h-20 w-full" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2" aria-hidden="true">
            <span className="absolute size-2 -translate-x-1/2 bg-foreground" style={{ left: `${v.inBlack * 100}%` }} />
            <span className="absolute size-2 -translate-x-1/2 bg-muted-foreground" style={{ left: `${(v.inBlack + (v.inWhite - v.inBlack) * 0.5 ** (1 / v.gamma)) * 100}%` }} />
            <span className="absolute size-2 -translate-x-1/2 border border-foreground bg-background" style={{ left: `${v.inWhite * 100}%` }} />
          </div>
        </div>
        <AdjustSlider label={t('photo.levels.inBlack')} value={v.inBlack} min={0} max={1} step={0.005} defaultValue={0} gestureLabel="levels.inBlack" onChange={(x) => set('inBlack', x)} />
        <AdjustSlider
          label={t('photo.levels.gamma')}
          value={gammaToPos(v.gamma)}
          min={0}
          max={1}
          step={0.005}
          decimals={3}
          defaultValue={gammaToPos(1)}
          gestureLabel="levels.gamma"
          onChange={(x) => set('gamma', posToGamma(x))}
        />
        <AdjustSlider label={t('photo.levels.inWhite')} value={v.inWhite} min={0} max={1} step={0.005} defaultValue={1} gestureLabel="levels.inWhite" onChange={(x) => set('inWhite', x)} />
        <AdjustSlider label={t('photo.levels.outBlack')} value={v.outBlack} min={0} max={1} step={0.005} defaultValue={0} gestureLabel="levels.outBlack" onChange={(x) => set('outBlack', x)} />
        <AdjustSlider label={t('photo.levels.outWhite')} value={v.outWhite} min={0} max={1} step={0.005} defaultValue={1} gestureLabel="levels.outWhite" onChange={(x) => set('outWhite', x)} />
      </PanelSection>
    </div>
  );
}
