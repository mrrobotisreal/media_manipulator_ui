'use client';

import * as React from 'react';
import { FlipHorizontal2, FlipVertical2, RotateCcw, RotateCw } from 'lucide-react';

import { useLocalization } from '@/i18n/useLocalization';
import { applyCropRemap, patchGeometry, rotateBy } from '@/lib/photo/geometryOps';
import { geometryOutputSize } from '@/lib/photo/colorMath';
import { usePhotoStore } from '@/lib/photo/photoStore';
import { useToolStore } from '@/lib/photo/toolStore';
import { ASPECT_PRESETS, aspectValue, fitAspectRect, isZeroPerspective, withAutoCrop, type AspectPreset } from '@/lib/photo/toolMath';
import { AdjustSlider, PanelSection, ToggleChip } from '../controls';
import { usePhotoSession } from '../session-context';

const FILL_COLOR = /^#[0-9a-f]{6}$/;
const mutate = (label: string, fn: Parameters<ReturnType<typeof usePhotoStore.getState>['mutate']>[1]) => usePhotoStore.getState().mutate(label, fn);

/** Geometry (MM98): crop with aspect presets, straighten, rotate 90, flip, perspective with auto-crop, fill. */
export function GeometryPanel() {
  const { t } = useLocalization('interface');
  const { source } = usePhotoSession();
  const geo = usePhotoStore((s) => s.doc?.geometry);
  const tool = useToolStore((s) => s.tool);
  const aspect = useToolStore((s) => s.aspect);
  const autoCrop = useToolStore((s) => s.autoCrop);
  if (!geo || !source) return null;
  const w0 = source.width;
  const h0 = source.height;
  const canvas = geometryOutputSize({ ...geo, crop: null }, w0, h0);
  const fillKind = geo.fill === 'transparent' || geo.fill === 'edge' ? geo.fill : 'colour';
  const refit = () => {
    if (useToolStore.getState().autoCrop) mutate('Auto-crop', (d) => patchGeometry(d, withAutoCrop(d.geometry, w0, h0, undefined)));
  };

  const pickAspect = async (p: AspectPreset) => {
    useToolStore.getState().setAspect(p);
    useToolStore.getState().setTool('crop');
    const a = aspectValue(p, w0, h0);
    if (!a) return;
    const rect = fitAspectRect(a, canvas.width, canvas.height);
    const next = await applyCropRemap(usePhotoStore.getState().doc!, rect);
    mutate('Crop', () => next);
  };

  return (
    <div data-testid="panel-geometry">
      <PanelSection title={t('photo.geometry.crop')}>
        <div className="flex flex-wrap gap-1.5" role="group" aria-label={t('photo.geometry.aspect')}>
          {ASPECT_PRESETS.map((p) => (
            <ToggleChip key={p} pressed={aspect === p && !!geo.crop} onClick={() => void pickAspect(p)}>
              {p === 'free' ? t('photo.geometry.free') : p === 'original' ? t('photo.geometry.original') : p}
            </ToggleChip>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5">
          <ToggleChip pressed={tool === 'crop'} onClick={() => useToolStore.getState().toggleTool('crop')}>
            {t('photo.geometry.cropTool')}
          </ToggleChip>
          <button
            type="button"
            className="min-h-8 rounded-full border border-edge px-3 text-xs disabled:opacity-50"
            disabled={!geo.crop}
            onClick={async () => {
              const next = await applyCropRemap(usePhotoStore.getState().doc!, null);
              mutate('Reset crop', () => next);
            }}
          >
            {t('photo.geometry.resetCrop')}
          </button>
        </div>
      </PanelSection>

      <PanelSection title={t('photo.geometry.straighten')}>
        <div
          onPointerDown={() => useToolStore.getState().setGrid(true)}
          onPointerUp={() => useToolStore.getState().setGrid(false)}
          onPointerCancel={() => useToolStore.getState().setGrid(false)}
        >
          <AdjustSlider
            label={t('photo.geometry.angle')}
            value={Math.max(-45, Math.min(45, geo.rotate % 90 === 0 ? 0 : ((((geo.rotate + 45) % 90) + 90) % 90) - 45))}
            min={-45}
            max={45}
            step={0.1}
            defaultValue={0}
            gestureLabel="geometry.straighten"
            onChange={(v) => {
              mutate('Straighten', (d) => {
                const base = Math.round(d.geometry.rotate / 90) * 90;
                return patchGeometry(d, { rotate: Math.round((base + v) * 100) / 100 });
              });
              refit();
            }}
          />
        </div>
        <ToggleChip pressed={tool === 'straighten'} onClick={() => useToolStore.getState().toggleTool('straighten')}>
          {t('photo.geometry.drawLine')}
        </ToggleChip>
        <p className="text-xs text-muted-foreground">{t('photo.geometry.drawLineHint')}</p>
      </PanelSection>

      <PanelSection title={t('photo.geometry.orientation')}>
        <div className="flex flex-wrap gap-1.5">
          <button type="button" aria-label={t('photo.geometry.rotateLeft')} className="min-h-8 rounded-md border border-edge px-3" onClick={() => mutate('Rotate', (d) => rotateBy(d, -90))}>
            <RotateCcw className="size-4" aria-hidden="true" />
          </button>
          <button type="button" aria-label={t('photo.geometry.rotateRight')} className="min-h-8 rounded-md border border-edge px-3" onClick={() => mutate('Rotate', (d) => rotateBy(d, 90))}>
            <RotateCw className="size-4" aria-hidden="true" />
          </button>
          <button type="button" aria-label={t('photo.geometry.rotate180')} className="min-h-8 rounded-md border border-edge px-3 text-xs" onClick={() => mutate('Rotate', (d) => rotateBy(d, 180))}>
            180°
          </button>
          <ToggleChip pressed={geo.flipH} onClick={() => mutate('Flip', (d) => patchGeometry(d, { flipH: !d.geometry.flipH }))}>
            <FlipHorizontal2 className="me-1 inline size-3" aria-hidden="true" />
            {t('photo.geometry.flipH')}
          </ToggleChip>
          <ToggleChip pressed={geo.flipV} onClick={() => mutate('Flip', (d) => patchGeometry(d, { flipV: !d.geometry.flipV }))}>
            <FlipVertical2 className="me-1 inline size-3" aria-hidden="true" />
            {t('photo.geometry.flipV')}
          </ToggleChip>
        </div>
      </PanelSection>

      <PanelSection title={t('photo.geometry.perspective')}>
        <div className="flex flex-wrap gap-1.5">
          <ToggleChip pressed={tool === 'perspective'} onClick={() => useToolStore.getState().toggleTool('perspective')}>
            {t('photo.geometry.perspectiveTool')}
          </ToggleChip>
          <button type="button" className="min-h-8 rounded-full border border-edge px-3 text-xs disabled:opacity-50" disabled={isZeroPerspective(geo.perspective)} onClick={() => mutate('Reset perspective', (d) => patchGeometry(d, { perspective: null }))}>
            {t('photo.geometry.resetPerspective')}
          </button>
        </div>
        <ToggleChip
          pressed={autoCrop}
          onClick={() => {
            const on = !autoCrop;
            useToolStore.getState().setAutoCrop(on);
            if (on) mutate('Auto-crop', (d) => patchGeometry(d, withAutoCrop(d.geometry, w0, h0, undefined)));
          }}
        >
          {t('photo.geometry.autoCrop')}
        </ToggleChip>
      </PanelSection>

      <PanelSection title={t('photo.geometry.fill')}>
        <div className="flex flex-wrap items-center gap-1.5">
          <ToggleChip pressed={fillKind === 'transparent'} onClick={() => mutate('Fill', (d) => patchGeometry(d, { fill: 'transparent' }))}>
            {t('photo.geometry.fillTransparent')}
          </ToggleChip>
          <ToggleChip pressed={fillKind === 'edge'} onClick={() => mutate('Fill', (d) => patchGeometry(d, { fill: 'edge' }))}>
            {t('photo.geometry.fillEdge')}
          </ToggleChip>
          <ToggleChip pressed={fillKind === 'colour'} onClick={() => mutate('Fill', (d) => patchGeometry(d, { fill: FILL_COLOR.test(d.geometry.fill) ? d.geometry.fill : '#000000' }))}>
            {t('photo.geometry.fillColor')}
          </ToggleChip>
          {fillKind === 'colour' ? (
            <input type="color" aria-label={t('photo.geometry.fillColor')} value={geo.fill} className="h-8 w-10 rounded border border-edge bg-transparent" onChange={(e) => mutate('Fill', (d) => patchGeometry(d, { fill: e.target.value.toLowerCase() }))} />
          ) : null}
        </div>
      </PanelSection>
    </div>
  );
}
