'use client';

import * as React from 'react';
import { Blend, Droplets, PenLine, Route, Shapes, VenetianMask } from 'lucide-react';

import { Panel } from '@/components/darkroom/panel';
import { useLocalization } from '@/i18n/useLocalization';
import { layerOutline } from '@/lib/vector/advanced';
import {
  ANIMATOR_IDS,
  DEFAULT_BLUR,
  applyBlur,
  applyDrawOn,
  applyGradientStops,
  applyMaskClip,
  applyMorph,
  applyMotionPath,
  canDrawOn,
  defaultSpan,
  maskContentLayer,
  morphTargets,
  motionGuides,
  setMotionAutoOrient,
  type AnimatorId,
} from '@/lib/vector/animators';
import { findTrack } from '@/lib/vector/keyframes';
import { findLayer, layerLabel } from '@/lib/vector/layerTree';
import { useVectorStore } from '@/lib/vector/vectorStore';
import type { Layer, VectorDoc } from '@/lib/vector/vectorTypes';
import { cn } from '@/lib/utils';

/**
 * The animator panel (ticket MM45 decision 11): Draw on · Motion path · Morph
 * · Gradient · Mask/Clip · Blur for the ONE selected layer. Each button is one
 * undo step (`applyAnimator` → `lib/vector/animators.ts`), spanning the
 * playhead to the end of the composition; the tracks it creates show in the
 * timeline like any other, where their keys can be moved and re-eased.
 *
 * Motion path and Morph need a second shape: the panel lists the document's
 * other outline layers to pick from, and offers the pen tool to draw a new
 * one (the pen is the authoring tool for guides and morph targets; draw, then
 * pick it here).
 *
 * `onAnimatorUsed(animator)` is the analytics seam (MM49 emits
 * `vector_animator_used`); nothing is emitted here.
 */
export interface AnimatorPanelProps {
  onAnimatorUsed?: (animator: AnimatorId) => void;
  /** Measured outline length of a layer (`getTotalLength()` on the canvas element); the pure fallback is used when absent. */
  measureLength?: (layerId: string) => number | undefined;
}

const ICONS: Record<AnimatorId, React.ComponentType<{ className?: string }>> = {
  drawOn: PenLine,
  motionPath: Route,
  morph: Shapes,
  gradient: Blend,
  maskClip: VenetianMask,
  blur: Droplets,
};

/** The canvas renders layers with the `v-` id prefix (`canvas.tsx`); measure there when mounted. */
export function canvasLength(layerId: string): number | undefined {
  if (typeof document === 'undefined') return undefined;
  const el = document.getElementById(`v-${layerId}`) as unknown as { getTotalLength?: () => number } | null;
  try {
    const n = el?.getTotalLength?.();
    return typeof n === 'number' && Number.isFinite(n) && n > 0 ? n : undefined;
  } catch {
    return undefined;
  }
}

type Picker = { kind: 'motionPath' | 'morph' } | null;

export function AnimatorPanel(props: AnimatorPanelProps) {
  const doc = useVectorStore((s) => s.doc);
  const selection = useVectorStore((s) => s.selection);
  const layer = doc && selection.length === 1 ? findLayer(doc.layers, selection[0]) : undefined;
  if (!doc) return null;
  // Keyed by the layer: a new selection starts with a closed picker and no message.
  return <AnimatorPanelBody key={layer?.id ?? ''} {...props} doc={doc} layer={layer} />;
}

function AnimatorPanelBody({
  onAnimatorUsed,
  measureLength = canvasLength,
  doc,
  layer,
}: AnimatorPanelProps & { doc: VectorDoc; layer: Layer | undefined }) {
  const { t } = useLocalization('interface');
  const [picker, setPicker] = React.useState<Picker>(null);
  const [blur, setBlur] = React.useState(DEFAULT_BLUR);
  const [message, setMessage] = React.useState<string | null>(null);
  const id = layer?.id;

  const store = useVectorStore.getState;
  const editable = !!layer && layer.type !== 'raw' && !layer.locked;

  const run = (animator: AnimatorId, label: string, fn: (d: VectorDoc, time: number) => VectorDoc) => {
    const changed = store().applyAnimator(label, fn);
    if (changed) {
      setMessage(null);
      onAnimatorUsed?.(animator);
    } else setMessage(t('vector.animators.notApplied'));
    return changed;
  };

  const enabled: Record<AnimatorId, boolean> = {
    drawOn: editable && canDrawOn(doc, id!),
    motionPath: editable,
    morph: editable && layer!.type === 'path',
    gradient: editable && layer!.type !== 'group' && layer!.type !== 'image' && layer!.type !== 'use',
    maskClip: editable && maskContentLayer(doc, id!) !== null,
    blur: editable,
  };

  const onClick = (animator: AnimatorId) => {
    if (!id) return;
    switch (animator) {
      case 'drawOn':
        run('drawOn', 'Draw on', (d, time) => applyDrawOn(d, id, defaultSpan(d, time), measureLength(id)));
        break;
      case 'motionPath':
      case 'morph':
        setPicker(picker?.kind === animator ? null : { kind: animator });
        break;
      case 'gradient':
        run('gradient', 'Animate gradient', (d, time) => applyGradientStops(d, id, time));
        break;
      case 'maskClip':
        run('maskClip', 'Animate mask', (d, time) => applyMaskClip(d, id, time).doc);
        break;
      case 'blur':
        run('blur', 'Blur', (d, time) => applyBlur(d, id, defaultSpan(d, time), blur));
        break;
    }
  };

  const pick = (target: Layer) => {
    if (!id || !picker) return;
    if (picker.kind === 'motionPath') {
      if (run('motionPath', 'Path animation', (d, time) => applyMotionPath(d, id, defaultSpan(d, time), { pathId: target.id }))) setPicker(null);
      return;
    }
    let reason: string | null = null;
    const ok = run('morph', 'Morph', (d, time) => {
      const res = applyMorph(d, id, target.id, defaultSpan(d, time));
      if (!res.ok) reason = res.reason;
      return res.ok ? res.doc : d;
    });
    if (ok) setPicker(null);
    else if (reason) setMessage(t('vector.animators.morphFailed'));
  };

  const candidates = picker && id ? (picker.kind === 'motionPath' ? motionGuides(doc, id) : morphTargets(doc, id)).filter((l) => layerOutline(l)) : [];
  const motion = id ? findTrack(doc, id, 'motionPath') : undefined;

  return (
    <Panel level="1" padding={false} className="flex flex-col" aria-label={t('vector.animators.title')} data-testid="animator-panel">
      <div className="border-b border-edge px-3 py-2">
        <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{t('vector.animators.title')}</h2>
      </div>
      <div className="space-y-2 p-3">
        {!layer && <p className="text-xs text-muted-foreground">{t('vector.animators.selectOne')}</p>}
        {layer && (
          <>
            <div className="grid grid-cols-3 gap-1.5" role="group" aria-label={t('vector.animators.title')}>
              {ANIMATOR_IDS.map((a) => {
                const Icon = ICONS[a];
                return (
                  <button
                    key={a}
                    type="button"
                    data-animator={a}
                    disabled={!enabled[a]}
                    aria-pressed={picker?.kind === a}
                    title={t(`vector.animators.${a}Hint`)}
                    onClick={() => onClick(a)}
                    className={cn(
                      'flex h-14 flex-col items-center justify-center gap-1 rounded-md border border-edge text-[11px] text-muted-foreground transition-colors',
                      'hover:bg-surface-2 hover:text-foreground disabled:pointer-events-none disabled:opacity-40',
                      picker?.kind === a && 'border-edge-strong bg-surface-3 text-foreground',
                    )}
                  >
                    <Icon className="size-4" />
                    {t(`vector.animators.${a}`)}
                  </button>
                );
              })}
            </div>

            {picker && (
              <div className="space-y-1.5 rounded-md border border-edge bg-surface-2/60 p-2" data-testid="animator-picker">
                <p className="text-xs text-muted-foreground">
                  {t(picker.kind === 'motionPath' ? 'vector.animators.pickGuide' : 'vector.animators.pickTarget')}
                </p>
                {candidates.length > 0 ? (
                  <ul className="max-h-32 space-y-0.5 overflow-y-auto">
                    {candidates.map((c) => (
                      <li key={c.id}>
                        <button
                          type="button"
                          data-target={c.id}
                          onClick={() => pick(c)}
                          className="w-full truncate rounded-sm px-2 py-1 text-start text-xs hover:bg-surface-3"
                        >
                          {layerLabel(c)}
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-text-subtle">{t('vector.animators.noShapes')}</p>
                )}
                <button
                  type="button"
                  onClick={() => store().setTool('pen')}
                  className="h-7 w-full rounded-md border border-edge text-xs hover:bg-surface-3"
                >
                  {t('vector.animators.drawWithPen')}
                </button>
              </div>
            )}

            {motion && id && (
              <label className="flex items-center gap-2 text-xs text-muted-foreground">
                <input
                  type="checkbox"
                  checked={motion.extras?.autoOrient === true}
                  onChange={(e) => store().applyAnimator('Orient to path', (d) => setMotionAutoOrient(d, id, e.target.checked))}
                />
                {t('vector.animators.autoOrient')}
              </label>
            )}

            <label className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="shrink-0">{t('vector.animators.blurAmount')}</span>
              <input
                type="range"
                min={1}
                max={40}
                step={1}
                value={blur}
                aria-label={t('vector.animators.blurAmount')}
                onChange={(e) => setBlur(Number(e.target.value))}
                className="min-w-0 flex-1"
              />
              <span className="w-8 text-end font-mono tabular-nums">{blur}</span>
            </label>

            <p className="text-[11px] text-text-subtle">{t('vector.animators.spanHint')}</p>
            {message && (
              <p role="status" className="text-xs text-destructive">
                {message}
              </p>
            )}
          </>
        )}
      </div>
    </Panel>
  );
}
