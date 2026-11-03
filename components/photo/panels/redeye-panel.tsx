'use client';

import * as React from 'react';

import { useLocalization } from '@/i18n/useLocalization';
import { useToolStore } from '@/lib/photo/toolStore';
import { AdjustSlider, PanelSection, ToggleChip } from '../controls';

/** Red-eye (MM98 decision 6): click an eye; a radial mask of the chosen radius (default 2 % of the long side). */
export function RedEyePanel() {
  const { t } = useLocalization('interface');
  const tool = useToolStore((s) => s.tool);
  const r = useToolStore((s) => s.redEyeRadius);
  return (
    <div data-testid="panel-redEye">
      <PanelSection title={t('photo.redEye.title')}>
        <p className="text-xs text-muted-foreground">{t('photo.redEye.hint')}</p>
        <AdjustSlider label={t('photo.redEye.radius')} value={Math.round(r * 1000) / 10} min={0.2} max={20} step={0.1} defaultValue={2} gestureLabel="redEye.radius" onChange={(v) => useToolStore.getState().setRedEyeRadius(v / 100)} />
        <ToggleChip pressed={tool === 'redEye'} onClick={() => useToolStore.getState().toggleTool('redEye')}>
          {t('photo.redEye.clickEye')}
        </ToggleChip>
      </PanelSection>
    </div>
  );
}
