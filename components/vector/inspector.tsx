'use client';

import * as React from 'react';
import { Diamond, Plus, Scissors, Trash2, VenetianMask } from 'lucide-react';

import { Panel } from '@/components/darkroom/panel';
import { Segmented } from '@/components/darkroom/segmented';
import { Stat } from '@/components/darkroom/stat';
import { useLocalization } from '@/i18n/useLocalization';
import { resolveTransform } from '@/lib/vector/geometry';
import { findTrack, removeKeyframes } from '@/lib/vector/keyframes';
import { findLayer, updateLayer } from '@/lib/vector/layerTree';
import type { EditableProperty } from '@/lib/vector/properties';
import { sampleDoc } from '@/lib/vector/sampleTrack';
import {
  addStop,
  applyGradient,
  applySolid,
  linearAngle,
  makeMask,
  paintGradient,
  releaseMask,
  removeStop,
  setGradientAngle,
  setRadial,
  setStop,
  solidOf,
  type PaintKey,
} from '@/lib/vector/paintOps';
import { selectionBounds, setLayerTransform } from '@/lib/vector/transformOps';
import { useVectorStore } from '@/lib/vector/vectorStore';
import type { Gradient, Layer, VectorDoc, VectorTransform } from '@/lib/vector/vectorTypes';
import { cn } from '@/lib/utils';
import { propertyLabel } from './timeline';

/**
 * Inspector: position/size/rotation/anchor, fill/stroke/stroke width/opacity,
 * text properties, rect corner radius and per-type geometry, the gradient
 * editor (S8) and mask/clip creation from a two-layer selection. Built from
 * the Instrument components (`components/darkroom/*`).
 *
 * Every field edits the model through the store. Text-like inputs commit on
 * change inside a focus gesture, so one focus session is one undo step.
 *
 * MM44: fields show the value AT THE PLAYHEAD. Animatable fields (transform,
 * opacity, fill, stroke, stroke width) carry a keyed-state diamond: filled =
 * a keyframe at the playhead, hollow = animated but between keys, faint = not
 * animated (click to start a track). Their edits go through `mutateAt`, so an
 * edit of an animated field writes a keyframe at the playhead.
 */
export function Inspector() {
  const { t } = useLocalization('interface');
  const stored = useVectorStore((s) => s.doc);
  const time = useVectorStore((s) => s.time);
  const selection = useVectorStore((s) => s.selection);
  const doc = React.useMemo(() => (stored ? sampleDoc(stored, time) : null), [stored, time]);
  if (!doc) return null;

  const layers = selection.map((id) => findLayer(doc.layers, id)).filter((l): l is Layer => Boolean(l));

  return (
    <Panel level="1" padding={false} className="flex min-h-0 flex-col" aria-label={t('vector.inspector.title')}>
      <div className="border-b border-edge px-3 py-2">
        <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{t('vector.inspector.title')}</h2>
      </div>
      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-3">
        {layers.length === 0 && <DocumentSection doc={doc} />}
        {layers.length === 1 && <LayerSections doc={doc} layer={layers[0]} />}
        {layers.length > 1 && (
          <>
            <Stat label={t('vector.inspector.selection')} value={t('vector.inspector.layersSelected', { count: layers.length })} orientation="inline" />
            <MultiSection doc={doc} ids={selection} />
          </>
        )}
      </div>
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// fields
// ---------------------------------------------------------------------------

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-2">
      <h3 className="text-[11px] font-medium uppercase tracking-wider text-text-subtle">{title}</h3>
      {children}
    </section>
  );
}

const fieldClass =
  'h-7 w-full min-w-0 rounded-md border border-edge bg-surface-2 px-2 font-mono text-xs tabular-nums text-foreground outline-none focus-visible:border-data';

/** Number input: edits stream into the model inside one focus gesture. */
function NumField({
  label,
  value,
  onChange,
  step = 1,
  min,
  max,
  suffix,
  disabled,
  keyed,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  step?: number;
  min?: number;
  max?: number;
  suffix?: string;
  disabled?: boolean;
  /** MM44: the keyed-state diamond of an animatable field. */
  keyed?: React.ReactNode;
}) {
  const [draft, setDraft] = React.useState<string | null>(null);
  const gesture = useFocusGesture(label);
  const shown = draft ?? formatShown(value);
  const id = React.useId();
  // The keyed diamond sits OUTSIDE the <label> so it never joins the input's accessible name.
  return (
    <div className="flex min-w-0 flex-col gap-0.5">
      <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
        {keyed}
        <label htmlFor={id}>{label}</label>
      </span>
      <span className="relative">
        <input
          id={id}
          type="number"
          inputMode="decimal"
          className={fieldClass}
          value={shown}
          step={step}
          min={min}
          max={max}
          disabled={disabled}
          onFocus={gesture.begin}
          onBlur={() => {
            setDraft(null);
            gesture.end();
          }}
          onChange={(e) => {
            setDraft(e.target.value);
            const n = Number(e.target.value);
            if (e.target.value.trim() !== '' && Number.isFinite(n)) {
              onChange(clamp(n, min, max));
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
          }}
        />
        {suffix && <span className="pointer-events-none absolute end-2 top-1/2 -translate-y-1/2 text-[10px] text-text-subtle">{suffix}</span>}
      </span>
    </div>
  );
}

const formatShown = (n: number) => String(Math.round(n * 1000) / 1000);
const clamp = (n: number, min?: number, max?: number) => Math.min(max ?? Infinity, Math.max(min ?? -Infinity, n));

function useFocusGesture(label: string) {
  const active = React.useRef(false);
  const begin = React.useCallback(() => {
    if (active.current) return;
    active.current = true;
    useVectorStore.getState().beginGesture(label);
  }, [label]);
  const end = React.useCallback(() => {
    if (!active.current) return;
    active.current = false;
    useVectorStore.getState().endGesture();
  }, []);
  React.useEffect(() => end, [end]);
  return { begin, end };
}

/** Colour swatch + hex text. `allowNone` adds a "none" toggle. */
function ColorField({
  label,
  value,
  onChange,
  allowNone,
  keyed,
}: {
  label: string;
  value: string | undefined;
  onChange: (v: string) => void;
  allowNone?: boolean;
  keyed?: React.ReactNode;
}) {
  const { t } = useLocalization('interface');
  const gesture = useFocusGesture(label);
  const hex = toHex(value);
  const none = !value || value === 'none';
  return (
    <div className="flex min-w-0 flex-col gap-0.5">
      <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
        {keyed}
        {label}
      </span>
      <div className="flex items-center gap-1.5">
        <input
          type="color"
          aria-label={label}
          value={hex ?? '#000000'}
          onFocus={gesture.begin}
          onBlur={gesture.end}
          onChange={(e) => onChange(e.target.value)}
          className="h-7 w-8 shrink-0 cursor-pointer rounded-md border border-edge bg-surface-2 p-0.5"
        />
        <input
          className={fieldClass}
          aria-label={t('vector.inspector.colorValue', { label })}
          value={value ?? ''}
          placeholder={t('vector.inspector.none')}
          onFocus={gesture.begin}
          onBlur={gesture.end}
          onChange={(e) => e.target.value.trim() && onChange(e.target.value.trim())}
        />
        {allowNone && (
          <button
            type="button"
            aria-pressed={none}
            onClick={() => onChange(none ? '#000000' : 'none')}
            className="h-7 shrink-0 rounded-md border border-edge px-2 text-[11px] text-muted-foreground hover:bg-surface-2 aria-pressed:border-edge-strong aria-pressed:text-foreground"
          >
            {t('vector.inspector.none')}
          </button>
        )}
      </div>
    </div>
  );
}

function toHex(v: string | undefined): string | null {
  if (!v) return null;
  const s = v.trim();
  if (/^#[0-9a-f]{6}$/i.test(s)) return s.toLowerCase();
  if (/^#[0-9a-f]{3}$/i.test(s)) return `#${s[1]}${s[1]}${s[2]}${s[2]}${s[3]}${s[3]}`.toLowerCase();
  return null;
}

/**
 * Keyed-state diamond (decision 4): filled = keyframe at the playhead,
 * hollow = animated, faint = not animated. Click: add a keyframe at the
 * playhead, or remove the one that is there.
 */
export function KeyToggle({ layerId, property }: { layerId: string; property: EditableProperty }) {
  const { t } = useLocalization('interface');
  const track = useVectorStore((s) => (s.doc ? findTrack(s.doc, layerId, property) : undefined));
  const time = useVectorStore((s) => s.time);
  const keyedNow = !!track?.keyframes.some((k) => k.t === time);
  const state = keyedNow ? 'key' : track ? 'animated' : 'static';
  const label = propertyLabel(t, property);
  const action = keyedNow ? t('vector.timeline.removeKeyHere', { property: label }) : t('vector.timeline.addKeyHere', { property: label });
  return (
    <button
      type="button"
      data-testid={`key-toggle-${property}`}
      data-state={state}
      aria-label={action}
      title={action}
      aria-pressed={keyedNow}
      onClick={(e) => {
        e.preventDefault();
        const s = useVectorStore.getState();
        if (keyedNow) s.mutate('Delete keyframe', (d) => removeKeyframes(d, [{ layerId, property, t: s.time }]));
        else s.addKeyframe(layerId, property);
      }}
      className={cn(
        'grid size-3.5 shrink-0 place-items-center rounded-sm',
        state === 'static' ? 'text-text-subtle/60 hover:text-muted-foreground' : 'text-data',
      )}
    >
      <Diamond className={cn('size-2.5', keyedNow && 'fill-current')} />
    </button>
  );
}

// ---------------------------------------------------------------------------
// sections
// ---------------------------------------------------------------------------

function DocumentSection({ doc }: { doc: VectorDoc }) {
  const { t } = useLocalization('interface');
  const s = useVectorStore.getState;
  const setCanvas = (patch: Partial<VectorDoc['canvas']>, label: string) =>
    s().mutate(label, (d) => {
      const canvas = { ...d.canvas, ...patch };
      // Keep the viewBox in step with the size when it was the default one.
      const vb = d.canvas.viewBox;
      if ((patch.width !== undefined || patch.height !== undefined) && vb.x === 0 && vb.y === 0 && vb.width === d.canvas.width && vb.height === d.canvas.height) {
        canvas.viewBox = { x: 0, y: 0, width: canvas.width, height: canvas.height };
      }
      return { ...d, canvas };
    });
  return (
    <>
      <Section title={t('vector.inspector.canvas')}>
        <div className="grid grid-cols-2 gap-2">
          <NumField label={t('vector.inspector.width')} value={doc.canvas.width} min={1} max={16384} onChange={(v) => setCanvas({ width: v }, 'Canvas size')} />
          <NumField label={t('vector.inspector.height')} value={doc.canvas.height} min={1} max={16384} onChange={(v) => setCanvas({ height: v }, 'Canvas size')} />
        </div>
        <ColorField
          label={t('vector.inspector.background')}
          value={doc.canvas.background === 'transparent' ? 'none' : doc.canvas.background}
          allowNone
          onChange={(v) => setCanvas({ background: v === 'none' ? 'transparent' : v }, 'Background')}
        />
      </Section>
      <p className="text-xs text-muted-foreground">{t('vector.inspector.emptyHint')}</p>
    </>
  );
}

function MultiSection({ doc, ids }: { doc: VectorDoc; ids: string[] }) {
  const { t } = useLocalization('interface');
  const b = selectionBounds(doc, ids);
  const s = useVectorStore.getState;
  const editable = ids.map((id) => findLayer(doc.layers, id)).filter((l): l is Exclude<Layer, { type: 'raw' }> => !!l && l.type !== 'raw');
  return (
    <>
      {b && (
        <div className="grid grid-cols-2 gap-2">
          <Stat label="X" value={formatShown(b.x)} orientation="inline" />
          <Stat label="Y" value={formatShown(b.y)} orientation="inline" />
          <Stat label={t('vector.inspector.width')} value={formatShown(b.width)} orientation="inline" />
          <Stat label={t('vector.inspector.height')} value={formatShown(b.height)} orientation="inline" />
        </div>
      )}
      {editable.length === 2 && <MaskActions doc={doc} source={editable[1]} target={editable[0]} />}
      <button type="button" onClick={() => s().groupSelection()} className="h-7 w-full rounded-md border border-edge text-xs hover:bg-surface-2">
        {t('vector.layers.group')}
      </button>
    </>
  );
}

/** "Use top layer as mask / clip of the one below" (selection in paint order: [below, top]). */
function MaskActions({ doc, source, target }: { doc: VectorDoc; source: Layer; target: Layer }) {
  const { t } = useLocalization('interface');
  const s = useVectorStore.getState;
  const ordered = doc.layers.findIndex((l) => l.id === source.id) > doc.layers.findIndex((l) => l.id === target.id);
  const [top, below] = ordered ? [source, target] : [target, source];
  return (
    <Section title={t('vector.inspector.maskSection')}>
      <p className="text-xs text-muted-foreground">{t('vector.inspector.maskHint')}</p>
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => s().mutate('Create mask', (d) => makeMask(d, top.id, below.id, 'mask'), [below.id])}
          className="flex h-7 items-center justify-center gap-1.5 rounded-md border border-edge text-xs hover:bg-surface-2"
        >
          <VenetianMask className="size-3.5" />
          {t('vector.inspector.useAsMask')}
        </button>
        <button
          type="button"
          disabled={top.type === 'group'}
          onClick={() => s().mutate('Create clip', (d) => makeMask(d, top.id, below.id, 'clip'), [below.id])}
          className="flex h-7 items-center justify-center gap-1.5 rounded-md border border-edge text-xs hover:bg-surface-2 disabled:opacity-40"
        >
          <Scissors className="size-3.5" />
          {t('vector.inspector.useAsClip')}
        </button>
      </div>
    </Section>
  );
}

function LayerSections({ doc, layer }: { doc: VectorDoc; layer: Layer }) {
  const { t } = useLocalization('interface');
  if (layer.type === 'raw') {
    return (
      <Section title={t('vector.layers.raw')}>
        <p className="text-xs text-muted-foreground">{t('vector.inspector.rawHint')}</p>
        <Stat label={t('vector.inspector.markupSize')} value={`${layer.markup.length} B`} orientation="inline" />
      </Section>
    );
  }
  return (
    <>
      <TransformSection doc={doc} layer={layer} />
      <GeometrySection layer={layer} />
      {layer.type === 'text' && <TextSection layer={layer} />}
      <StyleSection doc={doc} layer={layer} />
      {(layer.mask || layer.clipPath) && <ReleaseSection layer={layer} />}
    </>
  );
}

function TransformSection({ doc, layer }: { doc: VectorDoc; layer: Exclude<Layer, { type: 'raw' }> }) {
  const { t } = useLocalization('interface');
  const tf = resolveTransform(layer.transform);
  // Time-aware: an animated field gets a keyframe at the playhead.
  const set = (patch: Partial<VectorTransform>) =>
    useVectorStore.getState().mutateAt('Transform', (d) => setLayerTransform(d, layer.id, { ...tf, ...patch }));
  const locked = layer.locked === true;
  const k = (field: keyof VectorTransform) => <KeyToggle layerId={layer.id} property={`transform.${field}` as EditableProperty} />;
  void doc;
  return (
    <Section title={t('vector.inspector.transform')}>
      <div className="grid grid-cols-2 gap-2">
        <NumField label="X" keyed={k('x')} value={tf.x} onChange={(x) => set({ x })} disabled={locked} />
        <NumField label="Y" keyed={k('y')} value={tf.y} onChange={(y) => set({ y })} disabled={locked} />
        <NumField label={t('vector.inspector.scaleX')} keyed={k('scaleX')} value={tf.scaleX} step={0.05} onChange={(scaleX) => set({ scaleX })} disabled={locked} />
        <NumField label={t('vector.inspector.scaleY')} keyed={k('scaleY')} value={tf.scaleY} step={0.05} onChange={(scaleY) => set({ scaleY })} disabled={locked} />
        <NumField label={t('vector.inspector.rotation')} keyed={k('rotation')} value={tf.rotation} min={-360} max={360} suffix="°" onChange={(rotation) => set({ rotation })} disabled={locked} />
        <NumField label={t('vector.inspector.skewX')} keyed={k('skewX')} value={tf.skewX} min={-89} max={89} suffix="°" onChange={(skewX) => set({ skewX })} disabled={locked} />
        <NumField label={t('vector.inspector.skewY')} keyed={k('skewY')} value={tf.skewY} min={-89} max={89} suffix="°" onChange={(skewY) => set({ skewY })} disabled={locked} />
        <span aria-hidden />
        <NumField label={t('vector.inspector.anchorX')} keyed={k('anchorX')} value={tf.anchorX} onChange={(anchorX) => set({ anchorX })} disabled={locked} />
        <NumField label={t('vector.inspector.anchorY')} keyed={k('anchorY')} value={tf.anchorY} onChange={(anchorY) => set({ anchorY })} disabled={locked} />
      </div>
    </Section>
  );
}

function GeometrySection({ layer }: { layer: Exclude<Layer, { type: 'raw' }> }) {
  const { t } = useLocalization('interface');
  const patch = (p: Record<string, number | undefined>) =>
    useVectorStore.getState().patchLayer(layer.id, 'Geometry', (l) => ({ ...l, ...p }) as Layer);
  const W = t('vector.inspector.width');
  const H = t('vector.inspector.height');
  switch (layer.type) {
    case 'rect':
    case 'image':
      return (
        <Section title={t('vector.inspector.geometry')}>
          <div className="grid grid-cols-2 gap-2">
            <NumField label="x" value={layer.x} onChange={(x) => patch({ x })} />
            <NumField label="y" value={layer.y} onChange={(y) => patch({ y })} />
            <NumField label={W} value={layer.width} min={0} onChange={(width) => patch({ width })} />
            <NumField label={H} value={layer.height} min={0} onChange={(height) => patch({ height })} />
            {layer.type === 'rect' && (
              <NumField label={t('vector.inspector.cornerRadius')} value={layer.rx ?? 0} min={0} onChange={(rx) => patch({ rx: rx || undefined, ry: undefined })} />
            )}
          </div>
        </Section>
      );
    case 'ellipse':
      return (
        <Section title={t('vector.inspector.geometry')}>
          <div className="grid grid-cols-2 gap-2">
            <NumField label="cx" value={layer.cx} onChange={(cx) => patch({ cx })} />
            <NumField label="cy" value={layer.cy} onChange={(cy) => patch({ cy })} />
            <NumField label="rx" value={layer.rx} min={0} onChange={(rx) => patch({ rx })} />
            <NumField label="ry" value={layer.ry} min={0} onChange={(ry) => patch({ ry })} />
          </div>
        </Section>
      );
    case 'line':
      return (
        <Section title={t('vector.inspector.geometry')}>
          <div className="grid grid-cols-2 gap-2">
            <NumField label="x1" value={layer.x1} onChange={(x1) => patch({ x1 })} />
            <NumField label="y1" value={layer.y1} onChange={(y1) => patch({ y1 })} />
            <NumField label="x2" value={layer.x2} onChange={(x2) => patch({ x2 })} />
            <NumField label="y2" value={layer.y2} onChange={(y2) => patch({ y2 })} />
          </div>
        </Section>
      );
    case 'use':
      return (
        <Section title={t('vector.inspector.geometry')}>
          <Stat label={t('vector.inspector.reference')} value={`#${layer.ref}`} orientation="inline" />
        </Section>
      );
    case 'path':
      return (
        <Section title={t('vector.inspector.geometry')}>
          <p className="text-xs text-muted-foreground">{t('vector.inspector.pathHint')}</p>
        </Section>
      );
    default:
      return null;
  }
}

function TextSection({ layer }: { layer: Extract<Layer, { type: 'text' }> }) {
  const { t } = useLocalization('interface');
  const gesture = useFocusGesture('Text');
  const patch = (p: Partial<Extract<Layer, { type: 'text' }>>) =>
    useVectorStore.getState().patchLayer(layer.id, 'Text', (l) => ({ ...l, ...p }) as Layer);
  return (
    <Section title={t('vector.inspector.text')}>
      <input
        className={`${fieldClass} font-sans`}
        aria-label={t('vector.inspector.text')}
        value={layer.text}
        onFocus={gesture.begin}
        onBlur={gesture.end}
        onChange={(e) => patch({ text: e.target.value })}
      />
      <div className="grid grid-cols-2 gap-2">
        <NumField label="x" value={layer.x} onChange={(x) => patch({ x })} />
        <NumField label="y" value={layer.y} onChange={(y) => patch({ y })} />
        <NumField label={t('vector.inspector.fontSize')} value={layer.fontSize ?? 16} min={1} onChange={(fontSize) => patch({ fontSize })} />
        <NumField label={t('vector.inspector.letterSpacing')} value={layer.letterSpacing ?? 0} step={0.5} onChange={(v) => patch({ letterSpacing: v || undefined })} />
      </div>
      <label className="flex flex-col gap-0.5">
        <span className="text-[11px] text-muted-foreground">{t('vector.inspector.fontFamily')}</span>
        <input className={`${fieldClass} font-sans`} value={layer.fontFamily ?? ''} onFocus={gesture.begin} onBlur={gesture.end} onChange={(e) => patch({ fontFamily: e.target.value || undefined })} />
      </label>
      <Segmented
        name={`anchor-${layer.id}`}
        label={t('vector.inspector.textAnchor')}
        value={layer.textAnchor ?? 'start'}
        onValueChange={(v) => patch({ textAnchor: v === 'start' ? undefined : v })}
        options={[
          { value: 'start', label: t('vector.inspector.alignStart') },
          { value: 'middle', label: t('vector.inspector.alignMiddle') },
          { value: 'end', label: t('vector.inspector.alignEnd') },
        ]}
      />
      <Segmented
        name={`weight-${layer.id}`}
        label={t('vector.inspector.fontWeight')}
        value={layer.fontWeight === '700' || layer.fontWeight === 'bold' ? 'bold' : 'normal'}
        onValueChange={(v) => patch({ fontWeight: v === 'bold' ? '700' : undefined })}
        options={[
          { value: 'normal', label: t('vector.inspector.regular') },
          { value: 'bold', label: t('vector.inspector.bold') },
        ]}
      />
    </Section>
  );
}

function StyleSection({ doc, layer }: { doc: VectorDoc; layer: Exclude<Layer, { type: 'raw' }> }) {
  const { t } = useLocalization('interface');
  // Time-aware (opacity / stroke width are animatable).
  const patch = (p: Record<string, unknown>, label = 'Style') =>
    useVectorStore.getState().mutateAt(label, (d) => ({ ...d, layers: updateLayer(d.layers, layer.id, (l) => ({ ...l, ...p }) as Layer) }));
  return (
    <Section title={t('vector.inspector.appearance')}>
      {layer.type !== 'line' && <PaintEditor doc={doc} layer={layer} paintKey="fill" />}
      <PaintEditor doc={doc} layer={layer} paintKey="stroke" />
      <div className="grid grid-cols-2 gap-2">
        <NumField
          label={t('vector.inspector.strokeWidth')}
          keyed={<KeyToggle layerId={layer.id} property="strokeWidth" />}
          value={layer.strokeWidth ?? 1}
          min={0}
          step={0.5}
          onChange={(strokeWidth) => patch({ strokeWidth })}
        />
        <NumField
          keyed={<KeyToggle layerId={layer.id} property="opacity" />}
          label={t('vector.inspector.opacity')}
          value={Math.round((layer.opacity ?? 1) * 100)}
          min={0}
          max={100}
          suffix="%"
          onChange={(v) => patch({ opacity: v >= 100 ? undefined : v / 100 })}
        />
      </div>
    </Section>
  );
}

function PaintEditor({ doc, layer, paintKey }: { doc: VectorDoc; layer: Exclude<Layer, { type: 'raw' }>; paintKey: PaintKey }) {
  const { t } = useLocalization('interface');
  const s = useVectorStore.getState;
  const gradient = paintGradient(doc, layer[paintKey]);
  const mode = gradient ? gradient.type : 'solid';
  const label = paintKey === 'fill' ? t('vector.inspector.fill') : t('vector.inspector.stroke');
  return (
    <div className="space-y-2 rounded-md border border-edge p-2">
      <Segmented
        name={`${paintKey}-mode-${layer.id}`}
        label={label}
        value={mode}
        onValueChange={(v) => {
          if (v === 'solid') s().mutate('Solid paint', (d) => applySolid(d, layer.id, paintKey, gradient?.stops[0]?.color ?? '#000000'));
          else s().mutate('Gradient', (d) => applyGradient(d, layer.id, paintKey, v));
        }}
        options={[
          { value: 'solid', label: t('vector.inspector.solid') },
          { value: 'linear', label: t('vector.inspector.linear') },
          { value: 'radial', label: t('vector.inspector.radial') },
        ]}
      />
      {gradient ? (
        <GradientEditor gradient={gradient} />
      ) : (
        <ColorField
          label={label}
          keyed={<KeyToggle layerId={layer.id} property={paintKey} />}
          value={solidOf(layer[paintKey])}
          allowNone
          onChange={(v) => s().mutateAt(label, (d) => ({ ...d, layers: updateLayer(d.layers, layer.id, (l) => ({ ...l, [paintKey]: v }) as Layer) }))}
        />
      )}
    </div>
  );
}

/**
 * Gradient editor: a stop bar (click to add, drag to move, select to recolour,
 * remove), plus an angle (linear) or centre/radius (radial).
 */
function GradientEditor({ gradient }: { gradient: Gradient }) {
  const { t } = useLocalization('interface');
  const s = useVectorStore.getState;
  const [active, setActive] = React.useState(0);
  const barRef = React.useRef<HTMLDivElement>(null);
  const idx = Math.min(active, gradient.stops.length - 1);
  const stop = gradient.stops[idx];
  const css = `linear-gradient(to right, ${gradient.stops.map((st) => `${st.color} ${st.offset * 100}%`).join(', ')})`;

  const offsetAt = (clientX: number) => {
    const r = barRef.current?.getBoundingClientRect();
    if (!r || r.width === 0) return 0;
    return Math.min(1, Math.max(0, (clientX - r.left) / r.width));
  };

  const dragStop = (i: number) => (e: React.PointerEvent) => {
    e.stopPropagation();
    setActive(i);
    (e.target as Element).setPointerCapture?.(e.pointerId);
    s().beginGesture('Move stop');
    let index = i;
    const move = (ev: PointerEvent) => {
      const g = s().doc?.defs.gradients.find((x) => x.id === gradient.id);
      const offset = offsetAt(ev.clientX);
      s().mutate('Move stop', (d) => setStop(d, gradient.id, index, { offset }));
      // Stops re-sort; follow ours by offset.
      const after = s().doc?.defs.gradients.find((x) => x.id === gradient.id);
      if (g && after) index = Math.max(0, after.stops.findIndex((st) => st.offset === Math.round(offset * 1000) / 1000));
      setActive(index);
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      s().endGesture();
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };

  return (
    <div className="space-y-2">
      {/* The stop bar is a colour picker strip, LTR in every locale (0 % is left). */}
      <div
        ref={barRef}
        dir="ltr"
        role="group"
        aria-label={t('vector.gradient.stops')}
        className="relative h-6 cursor-copy rounded-md border border-edge"
        style={{ background: css }}
        onPointerDown={(e) => s().mutate('Add stop', (d) => addStop(d, gradient.id, offsetAt(e.clientX)))}
      >
        {gradient.stops.map((st, i) => (
          <button
            key={i}
            type="button"
            aria-label={t('vector.gradient.stop', { index: i + 1, offset: Math.round(st.offset * 100) })}
            aria-pressed={i === idx}
            onPointerDown={dragStop(i)}
            className="absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 shadow aria-pressed:border-data"
            style={{ left: `${st.offset * 100}%`, background: st.color, borderColor: i === idx ? undefined : 'var(--surface-0)' }}
          />
        ))}
      </div>
      {stop && (
        <div className="grid grid-cols-[1fr_auto] items-end gap-2">
          <ColorField label={t('vector.gradient.stopColor')} value={stop.color} onChange={(color) => s().mutate('Stop colour', (d) => setStop(d, gradient.id, idx, { color }))} />
          <button
            type="button"
            aria-label={t('vector.gradient.removeStop')}
            title={t('vector.gradient.removeStop')}
            disabled={gradient.stops.length <= 2}
            onClick={() => s().mutate('Remove stop', (d) => removeStop(d, gradient.id, idx))}
            className="grid size-7 place-items-center rounded-md border border-edge hover:bg-surface-2 disabled:opacity-40"
          >
            <Trash2 className="size-3.5" />
          </button>
        </div>
      )}
      <div className="grid grid-cols-2 gap-2">
        {stop && (
          <NumField
            label={t('vector.gradient.offset')}
            value={Math.round(stop.offset * 100)}
            min={0}
            max={100}
            suffix="%"
            onChange={(v) => s().mutate('Move stop', (d) => setStop(d, gradient.id, idx, { offset: v / 100 }))}
          />
        )}
        {gradient.type === 'linear' ? (
          <NumField
            label={t('vector.gradient.angle')}
            value={linearAngle(gradient)}
            min={-360}
            max={360}
            suffix="°"
            onChange={(a) => s().mutate('Gradient angle', (d) => setGradientAngle(d, gradient.id, a))}
          />
        ) : (
          <NumField label={t('vector.gradient.radius')} value={Math.round(gradient.r * 100)} min={0} suffix="%" onChange={(r) => s().mutate('Gradient radius', (d) => setRadial(d, gradient.id, { r: r / 100 }))} />
        )}
      </div>
      {gradient.type === 'linear' && <AngleDial angle={linearAngle(gradient)} onChange={(a) => s().mutate('Gradient angle', (d) => setGradientAngle(d, gradient.id, a))} />}
      {gradient.type === 'radial' && (
        <div className="grid grid-cols-2 gap-2">
          <NumField label={t('vector.gradient.centreX')} value={Math.round(gradient.cx * 100)} suffix="%" onChange={(cx) => s().mutate('Gradient centre', (d) => setRadial(d, gradient.id, { cx: cx / 100 }))} />
          <NumField label={t('vector.gradient.centreY')} value={Math.round(gradient.cy * 100)} suffix="%" onChange={(cy) => s().mutate('Gradient centre', (d) => setRadial(d, gradient.id, { cy: cy / 100 }))} />
        </div>
      )}
      <button
        type="button"
        onClick={() => s().mutate('Add stop', (d) => addStop(d, gradient.id, 0.5))}
        className="flex h-7 w-full items-center justify-center gap-1.5 rounded-md border border-edge text-xs hover:bg-surface-2"
      >
        <Plus className="size-3.5" />
        {t('vector.gradient.addStop')}
      </button>
    </div>
  );
}

/** Drag the handle round the dial to set the gradient angle (shift = 15° steps). */
function AngleDial({ angle, onChange }: { angle: number; onChange: (a: number) => void }) {
  const { t } = useLocalization('interface');
  const ref = React.useRef<SVGSVGElement>(null);
  const r = (angle * Math.PI) / 180;
  const set = (e: { clientX: number; clientY: number; shiftKey: boolean }) => {
    const b = ref.current?.getBoundingClientRect();
    if (!b) return;
    let a = (Math.atan2(e.clientY - (b.top + b.height / 2), e.clientX - (b.left + b.width / 2)) * 180) / Math.PI;
    if (e.shiftKey) a = Math.round(a / 15) * 15;
    onChange(Math.round(a));
  };
  return (
    <svg
      ref={ref}
      viewBox="-24 -24 48 48"
      className="mx-auto block size-14 cursor-pointer touch-none"
      role="slider"
      aria-label={t('vector.gradient.angle')}
      aria-valuenow={angle}
      aria-valuemin={-180}
      aria-valuemax={180}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') onChange(angle - (e.shiftKey ? 15 : 1));
        if (e.key === 'ArrowRight' || e.key === 'ArrowUp') onChange(angle + (e.shiftKey ? 15 : 1));
      }}
      onPointerDown={(e) => {
        (e.target as Element).setPointerCapture?.(e.pointerId);
        useVectorStore.getState().beginGesture('Gradient angle');
        set(e);
      }}
      onPointerMove={(e) => e.buttons === 1 && set(e)}
      onPointerUp={() => useVectorStore.getState().endGesture()}
    >
      <circle r="20" fill="var(--surface-2)" stroke="var(--edge)" />
      <line x1={-Math.cos(r) * 16} y1={-Math.sin(r) * 16} x2={Math.cos(r) * 16} y2={Math.sin(r) * 16} stroke="var(--edge-control)" />
      <circle cx={Math.cos(r) * 16} cy={Math.sin(r) * 16} r="4" fill="var(--accent-data)" />
    </svg>
  );
}

function ReleaseSection({ layer }: { layer: Exclude<Layer, { type: 'raw' }> }) {
  const { t } = useLocalization('interface');
  const s = useVectorStore.getState;
  return (
    <Section title={t('vector.inspector.maskSection')}>
      {layer.mask && (
        <button type="button" onClick={() => s().mutate('Release mask', (d) => releaseMask(d, layer.id, 'mask'))} className="flex h-7 w-full items-center justify-center gap-1.5 rounded-md border border-edge text-xs hover:bg-surface-2">
          <VenetianMask className="size-3.5" />
          {t('vector.inspector.releaseMask')}
        </button>
      )}
      {layer.clipPath && (
        <button type="button" onClick={() => s().mutate('Release clip', (d) => releaseMask(d, layer.id, 'clip'))} className="flex h-7 w-full items-center justify-center gap-1.5 rounded-md border border-edge text-xs hover:bg-surface-2">
          <Scissors className="size-3.5" />
          {t('vector.inspector.releaseClip')}
        </button>
      )}
    </Section>
  );
}
