'use client';

import * as React from 'react';
import { Brush, Eraser, Loader2, Trash2 } from 'lucide-react';

import { useLocalization } from '@/i18n/useLocalization';
import { renderMaskCPU } from '@/lib/photo/colorMath';
import {
  MASK_KINDS,
  addComponent,
  addLocalAdjustment,
  brushBudget,
  clearLayerMask,
  defaultComponent,
  maskOfLayer,
  removeComponent,
  setMaskProps,
  shareLayerMask,
  updateComponent,
  type ComponentKind,
} from '@/lib/photo/maskOps';
import { cachedMaskAssets, loadSubjectAlpha, registerSubjectMask } from '@/lib/photo/maskAssets';
import { requestSubjectMask, requestSubjectMaskStateless, fetchProjectFile } from '@/lib/photo/aiApi';
import { BRUSH_SIZE_MAX, BRUSH_SIZE_MIN } from '@/lib/photo/brushEngine';
import { usePhotoStore } from '@/lib/photo/photoStore';
import { addColorTarget } from '@/lib/photo/maskOps';
import { LAYER_TYPES, type MaskComponent } from '@/lib/photo/photoTypes';
import { onAiMaskCompleted, onAiMaskFailed, onAiMaskRequested, onMaskAdded } from '@/lib/photo/seams';
import { useToolStore } from '@/lib/photo/toolStore';
import { cn } from '@/lib/utils';
import { AdjustSlider, PanelSection, ToggleChip } from '../controls';
import { usePhotoSession } from '../session-context';

const LOCAL_TYPES = ['localBasic', 'exposure', 'tone', 'vibranceSaturation', 'hsl', 'whiteBalance', 'curves', 'colorBalance', 'brightnessContrast'] as const;
const mutate = (label: string, fn: Parameters<ReturnType<typeof usePhotoStore.getState>['mutate']>[1], sel?: string | null) => usePhotoStore.getState().mutate(label, fn, sel);

/** Tiny thumbnail of a component's contribution (CPU mask over the source thumbnail). */
function Thumb({ comp, mask }: { comp: MaskComponent; mask: NonNullable<ReturnType<typeof maskOfLayer>> }) {
  const { thumb } = usePhotoSession();
  const ref = React.useRef<HTMLCanvasElement>(null);
  React.useEffect(() => {
    const c = ref.current;
    const ctx = c?.getContext?.('2d');
    if (!c || !ctx || !thumb) return;
    const one = { ...mask, components: [{ ...comp, mode: 'add' as const }], feather: 0, invert: false, opacity: 1 };
    const m = renderMaskCPU(one, thumb, cachedMaskAssets);
    c.width = thumb.width;
    c.height = thumb.height;
    const img = ctx.createImageData(thumb.width, thumb.height);
    for (let i = 0; i < m.length; i += 1) {
      const v = Math.round(m[i] * 255);
      img.data[i * 4] = v;
      img.data[i * 4 + 1] = v;
      img.data[i * 4 + 2] = v;
      img.data[i * 4 + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
  }, [comp, mask, thumb]);
  return <canvas ref={ref} className="h-8 w-10 shrink-0 rounded border border-edge bg-black" aria-hidden="true" data-testid="mask-thumb" />;
}

function LuminosityBackdrop() {
  const { histogram } = usePhotoSession();
  const ref = React.useRef<HTMLCanvasElement>(null);
  React.useEffect(() => {
    const c = ref.current;
    const ctx = c?.getContext?.('2d');
    if (!c || !ctx) return;
    ctx.clearRect(0, 0, c.width, c.height);
    if (!histogram || histogram.max === 0) return;
    ctx.fillStyle = 'rgba(156,163,175,.45)';
    for (let i = 0; i < 256; i += 1) {
      const h = (histogram.luma[i] / histogram.max) * c.height;
      ctx.fillRect(i, c.height - h, 1, h);
    }
  }, [histogram]);
  return <canvas ref={ref} width={256} height={40} className="h-10 w-full rounded bg-surface-2" dir="ltr" aria-hidden="true" />;
}

function SubjectControls({ layerId, index, comp }: { layerId: string; index: number; comp: Extract<MaskComponent, { kind: 'subject' }> }) {
  const { t } = useLocalization('interface');
  return (
    <ToggleChip pressed={comp.invert} onClick={() => mutate('Mask', (d) => updateComponent(d, layerId, index, { invert: !comp.invert }))}>
      {t('photo.masks.subject.invertBackground')}
    </ToggleChip>
  );
}

function ComponentRow({ layerId, index, comp, mask }: { layerId: string; index: number; comp: MaskComponent; mask: NonNullable<ReturnType<typeof maskOfLayer>> }) {
  const { t } = useLocalization('interface');
  const sel = useToolStore((s) => s.component);
  const brush = useToolStore((s) => s.brush);
  const tool = useToolStore((s) => s.tool);
  const session = usePhotoSession();
  const set = (patch: Partial<MaskComponent>, label = 'Mask') => mutate(label, (d) => updateComponent(d, layerId, index, patch));
  const selected = sel === index;
  const slider = (key: string, label: string, value: number, min: number, max: number, step: number, def: number) => (
    <AdjustSlider label={label} value={value} min={min} max={max} step={step} defaultValue={def} gestureLabel={`mask.${comp.kind}.${key}`} onChange={(v) => set({ [key]: v } as Partial<MaskComponent>, `mask.${comp.kind}.${key}`)} />
  );
  return (
    <li className={cn('space-y-2 rounded-md border px-2 py-2', selected ? 'border-primary bg-primary/10' : 'border-edge bg-surface-2')} data-testid={`mask-component-${index}`}>
      <div className="flex items-center gap-2">
        <Thumb comp={comp} mask={mask} />
        <button type="button" className="min-w-0 flex-1 truncate text-start text-sm" onClick={() => useToolStore.getState().setComponent(selected ? -1 : index)} aria-expanded={selected}>
          {t(`photo.masks.kind.${comp.kind}`)}
        </button>
        <select aria-label={t('photo.masks.mode')} value={comp.mode} className="rounded border border-edge bg-surface-1 px-1 py-0.5 text-xs" onChange={(e) => set({ mode: e.target.value as MaskComponent['mode'] }, 'Mask mode')}>
          {(['add', 'subtract', 'intersect'] as const).map((m) => (
            <option key={m} value={m}>
              {t(`photo.masks.mode_${m}`)}
            </option>
          ))}
        </select>
        <button type="button" aria-label={t('photo.masks.removeComponent')} className="text-muted-foreground hover:text-destructive" onClick={() => mutate('Remove mask component', (d) => removeComponent(d, layerId, index))}>
          <Trash2 className="size-4" aria-hidden="true" />
        </button>
      </div>
      {selected ? (
        <div className="space-y-2">
          {comp.kind === 'gradient' ? (
            <>
              {slider('feather', t('photo.masks.feather'), comp.feather, 0, 1, 0.01, 0)}
              <ToggleChip pressed={tool === 'gradient'} onClick={() => useToolStore.getState().toggleTool('gradient')}>
                {t('photo.masks.draw')}
              </ToggleChip>
            </>
          ) : null}
          {comp.kind === 'radial' ? (
            <>
              {slider('feather', t('photo.masks.feather'), comp.feather, 0, 1, 0.01, 0.5)}
              {slider('rotate', t('photo.masks.rotate'), comp.rotate, -180, 180, 1, 0)}
              <ToggleChip pressed={tool === 'radial'} onClick={() => useToolStore.getState().toggleTool('radial')}>
                {t('photo.masks.draw')}
              </ToggleChip>
            </>
          ) : null}
          {comp.kind === 'brush' ? (
            <>
              <div className="flex gap-1.5">
                <ToggleChip pressed={tool === 'brush' && !brush.erase} onClick={() => { useToolStore.getState().setBrush({ erase: false }); useToolStore.getState().setTool('brush'); }}>
                  <Brush className="me-1 inline size-3" aria-hidden="true" />
                  {t('photo.masks.brush.paint')}
                </ToggleChip>
                <ToggleChip pressed={tool === 'brush' && brush.erase} onClick={() => { useToolStore.getState().setBrush({ erase: true }); useToolStore.getState().setTool('brush'); }}>
                  <Eraser className="me-1 inline size-3" aria-hidden="true" />
                  {t('photo.masks.brush.erase')}
                </ToggleChip>
              </div>
            </>
          ) : null}
          {comp.kind === 'luminosity' ? (
            <>
              <LuminosityBackdrop />
              {slider('lo', t('photo.masks.luminosity.lo'), comp.lo, 0, 1, 0.01, 0)}
              {slider('hi', t('photo.masks.luminosity.hi'), comp.hi, 0, 1, 0.01, 1)}
              {slider('feather', t('photo.masks.feather'), comp.feather, 0, 1, 0.01, 0.1)}
            </>
          ) : null}
          {comp.kind === 'colorRange' ? (
            <>
              <div className="flex flex-wrap items-center gap-1.5">
                <ToggleChip pressed={false} onClick={() => { useToolStore.getState().setComponent(index); session.requestPick(); }}>
                  {t('photo.masks.colorRange.pick')}
                </ToggleChip>
                <span className="text-xs text-muted-foreground">{t('photo.masks.colorRange.shiftHint')}</span>
              </div>
              <ul className="flex flex-wrap gap-1.5" aria-label={t('photo.masks.colorRange.targets')}>
                {comp.colors.map((c, i) => (
                  <li key={i}>
                    <button
                      type="button"
                      title={t('photo.masks.colorRange.removeTarget')}
                      aria-label={t('photo.masks.colorRange.removeTarget')}
                      className="size-6 rounded-full border border-edge"
                      style={{ background: `rgb(${c.r},${c.g},${c.b})` }}
                      onClick={() => set({ colors: comp.colors.filter((_, k) => k !== i) } as Partial<MaskComponent>, 'Colour target')}
                    />
                  </li>
                ))}
              </ul>
              {slider('fuzziness', t('photo.masks.colorRange.fuzziness'), comp.fuzziness, 0, 100, 1, 40)}
            </>
          ) : null}
          {comp.kind === 'subject' ? <SubjectControls layerId={layerId} index={index} comp={comp} /> : null}
        </div>
      ) : null}
    </li>
  );
}

/** Masks (MM98): per layer, add a component (six kinds), fold modes, feather/invert/opacity, views and local adjustments. */
export function MasksPanel() {
  const { t } = useLocalization('interface');
  const session = usePhotoSession();
  const doc = usePhotoStore((s) => s.doc);
  const selection = usePhotoStore((s) => s.selection);
  const maskLayer = useToolStore((s) => s.maskLayerId);
  const maskView = useToolStore((s) => s.maskView);
  const layerId = maskLayer && doc?.layers.some((l) => l.id === maskLayer) ? maskLayer : selection;
  const [localType, setLocalType] = React.useState<(typeof LOCAL_TYPES)[number]>('localBasic');
  const [menu, setMenu] = React.useState(false);
  const [subject, setSubject] = React.useState<'idle' | 'busy' | 'failed'>('idle');
  const [seenPick, setSeenPick] = React.useState<number | null>(null);
  if (!doc) return null;
  const layer = doc.layers.find((l) => l.id === layerId) ?? null;
  const mask = layer ? maskOfLayer(doc, layer.id) : null;
  const budget = brushBudget(doc);
  const caps = session.capabilities;
  const aiMasks = caps?.aiMasks !== false;
  void LAYER_TYPES;

  const addKind = async (kind: ComponentKind) => {
    if (!layer) return;
    setMenu(false);
    if (kind === 'brush') {
      if (budget.full) return;
      useToolStore.getState().setTool('brush');
      useToolStore.getState().setMaskLayer(layer.id);
      useToolStore.getState().setComponent(-1);
      onMaskAdded('brush');
      return;
    }
    if (kind === 'subject') {
      await selectSubject();
      return;
    }
    mutate('Add mask', (d) => addComponent(d, layer.id, defaultComponent(kind)));
    const n = (maskOfLayer(usePhotoStore.getState().doc!, layer.id)?.components.length ?? 1) - 1;
    useToolStore.getState().setComponent(n);
    if (kind === 'gradient' || kind === 'radial') useToolStore.getState().setTool(kind);
    onMaskAdded(kind);
  };

  const selectSubject = async () => {
    if (!layer) return;
    setSubject('busy');
    onAiMaskRequested();
    try {
      let maskRef: string;
      if (session.projectId && session.signedIn) {
        const r = await requestSubjectMask(session.projectId);
        maskRef = r.maskRef;
        void loadSubjectAlpha(maskRef, (ref) => fetchProjectFile(session.projectId as string, ref));
      } else {
        const f = session.currentFile();
        if (!f) throw new Error('no file');
        const id = `${Date.now().toString(36)}${Math.floor(performance.now()).toString(36)}`;
        const r = await requestSubjectMaskStateless(f.blob, f.name, () => id);
        maskRef = r.maskRef;
        if (r.blob) {
          registerSubjectMask(maskRef, r.blob);
          session.keepLocalMask(maskRef, r.blob);
          await loadSubjectAlpha(maskRef);
        }
      }
      mutate('Select subject', (d) => addComponent(d, layer.id, { kind: 'subject', mode: 'add', maskRef, invert: false } as MaskComponent));
      const n = (maskOfLayer(usePhotoStore.getState().doc!, layer.id)?.components.length ?? 1) - 1;
      useToolStore.getState().setComponent(n);
      onMaskAdded('subject');
      onAiMaskCompleted();
      setSubject('idle');
    } catch (e) {
      // A 429 is raised to the existing quota sheet by authedFetch; everything else shows the inline message.
      onAiMaskFailed(e instanceof Error ? e.name : 'failed');
      setSubject(e instanceof Error && e.name === 'QuotaExceededError' ? 'idle' : 'failed');
    }
  };

  // Eyedropper results land in the selected colour-range component.
  const picked = session.picked;
  if (picked && picked.n !== seenPick) {
    setSeenPick(picked.n);
    const idx = useToolStore.getState().component;
    if (layer && mask && mask.components[idx]?.kind === 'colorRange') {
      queueMicrotask(() => mutate('Colour target', (d) => addColorTarget(d, layer.id, idx, { r: picked.r, g: picked.g, b: picked.b }, picked.shift)));
    }
  }

  return (
    <div data-testid="panel-masks">
      <PanelSection title={t('photo.masks.localTitle')}>
        <div className="flex flex-wrap items-center gap-2">
          <select aria-label={t('photo.masks.localType')} className="rounded border border-edge bg-surface-2 px-1 py-1 text-xs" value={localType} onChange={(e) => setLocalType(e.target.value as (typeof LOCAL_TYPES)[number])}>
            {LOCAL_TYPES.map((x) => (
              <option key={x} value={x}>
                {x === 'localBasic' ? t('photo.masks.localBasic') : t(`photo.layers.type.${x}`)}
              </option>
            ))}
          </select>
          <button
            type="button"
            data-testid="add-local"
            className="min-h-8 rounded-md border border-primary bg-primary/15 px-3 text-xs"
            onClick={() => {
              const r = addLocalAdjustment(usePhotoStore.getState().doc!, localType);
              mutate('Add local adjustment', () => r.doc, r.layerId);
              useToolStore.getState().setMaskLayer(r.layerId);
              useToolStore.getState().setTool('brush');
              onMaskAdded('local');
            }}
          >
            {t('photo.masks.addLocal')}
          </button>
        </div>
        <p className="text-xs text-muted-foreground">{t('photo.masks.localHint')}</p>
      </PanelSection>

      <PanelSection
        title={t('photo.masks.title')}
        actions={
          <div className="flex gap-1" role="group" aria-label={t('photo.masks.view')}>
            {(['off', 'overlay', 'alpha'] as const).map((v) => (
              <ToggleChip key={v} pressed={maskView === v} onClick={() => useToolStore.getState().setMaskView(v)} className="min-h-6 px-2">
                {t(`photo.masks.view_${v}`)}
              </ToggleChip>
            ))}
          </div>
        }
      >
        {!layer ? (
          <p className="text-xs text-muted-foreground">{t('photo.masks.selectLayer')}</p>
        ) : (
          <>
            <label className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
              {t('photo.masks.layer')}
              <select
                className="max-w-44 rounded border border-edge bg-surface-2 px-1 py-0.5 text-foreground"
                value={layer.id}
                onChange={(e) => {
                  useToolStore.getState().setMaskLayer(e.target.value);
                  usePhotoStore.getState().setSelection(e.target.value);
                }}
              >
                {doc.layers.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name || t(`photo.layers.type.${l.type}`)}
                  </option>
                ))}
              </select>
            </label>

            <div className="relative">
              <button type="button" data-testid="add-mask" aria-haspopup="menu" aria-expanded={menu} className="min-h-8 w-full rounded-md border border-edge bg-surface-2 px-3 text-sm" onClick={() => setMenu((m) => !m)}>
                {t('photo.masks.add')}
              </button>
              {menu ? (
                <ul role="menu" className="absolute z-20 mt-1 w-full rounded-md border border-edge bg-surface-1 p-1 shadow-lg">
                  {MASK_KINDS.map((k) => (
                    <li key={k} role="none">
                      <button
                        type="button"
                        role="menuitem"
                        disabled={(k === 'subject' && (!aiMasks || subject === 'busy')) || (k === 'brush' && budget.full)}
                        className="min-h-8 w-full rounded px-2 text-start text-sm hover:bg-primary/10 disabled:opacity-50"
                        onClick={() => void addKind(k)}
                      >
                        {t(`photo.masks.kind.${k}`)}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
            {subject === 'busy' ? (
              <p role="status" className="flex items-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="size-3 animate-spin" aria-hidden="true" />
                {t('photo.masks.subject.working')}
              </p>
            ) : null}
            {subject === 'failed' ? <p role="alert" className="text-xs text-destructive">{t('photo.masks.subject.failed')}</p> : null}
            {budget.warn ? <p role="status" className="text-xs text-premium">{t(budget.full ? 'photo.masks.brush.full' : 'photo.masks.brush.warn')}</p> : null}

            {mask ? (
              <>
                {mask.components.length === 0 ? <p className="text-xs text-muted-foreground">{t('photo.masks.empty')}</p> : null}
                <ul className="space-y-1.5">
                  {mask.components.map((c, i) => (
                    <ComponentRow key={i} layerId={layer.id} index={i} comp={c} mask={mask} />
                  ))}
                </ul>
                <AdjustSlider label={t('photo.masks.maskFeather')} value={mask.feather} min={0} max={100} step={1} defaultValue={0} gestureLabel="mask.feather" onChange={(v) => mutate('Mask feather', (d) => setMaskProps(d, layer.id, { feather: v }))} />
                <AdjustSlider label={t('photo.masks.maskOpacity')} value={Math.round(mask.opacity * 100)} min={0} max={100} step={1} defaultValue={100} gestureLabel="mask.opacity" onChange={(v) => mutate('Mask opacity', (d) => setMaskProps(d, layer.id, { opacity: v / 100 }))} />
                <div className="flex flex-wrap gap-1.5">
                  <ToggleChip pressed={mask.invert} onClick={() => mutate('Invert mask', (d) => setMaskProps(d, layer.id, { invert: !mask.invert }))}>
                    {t('photo.masks.invert')}
                  </ToggleChip>
                  <button type="button" className="min-h-8 rounded-full border border-edge px-3 text-xs" onClick={() => mutate('Share mask', (d) => shareLayerMask(d, layer.id).doc)} disabled={!layer.mask || 'ref' in (layer.mask as object)}>
                    {t('photo.masks.share')}
                  </button>
                  <button type="button" className="min-h-8 rounded-full border border-edge px-3 text-xs text-destructive" onClick={() => mutate('Remove mask', (d) => clearLayerMask(d, layer.id))}>
                    {t('photo.masks.remove')}
                  </button>
                </div>
              </>
            ) : null}
          </>
        )}
      </PanelSection>

      <BrushSettingsSection />
    </div>
  );
}

function BrushSettingsSection() {
  const { t } = useLocalization('interface');
  const brush = useToolStore((s) => s.brush);
  const tool = useToolStore((s) => s.tool);
  if (tool !== 'brush') return null;
  const set = useToolStore.getState().setBrush;
  const noGesture = (fn: () => void) => fn();
  return (
    <PanelSection title={t('photo.masks.brush.title')}>
      <AdjustSlider label={t('photo.masks.brush.size')} value={brush.size} min={BRUSH_SIZE_MIN} max={BRUSH_SIZE_MAX} step={1} defaultValue={60} gestureLabel="brush.size" onChange={(v) => noGesture(() => set({ size: v }))} />
      <AdjustSlider label={t('photo.masks.brush.hardness')} value={brush.hardness} min={0} max={100} step={1} defaultValue={50} gestureLabel="brush.hardness" onChange={(v) => set({ hardness: v })} />
      <AdjustSlider label={t('photo.masks.brush.flow')} value={brush.flow} min={0} max={100} step={1} defaultValue={100} gestureLabel="brush.flow" onChange={(v) => set({ flow: v })} />
      <p className="text-xs text-muted-foreground">{t('photo.masks.brush.keys')}</p>
    </PanelSection>
  );
}
