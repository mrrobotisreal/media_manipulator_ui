'use client';

import React from 'react';
import {
  Sparkles, Plus, Trash2, Type, ChevronDown, ChevronLeft, ChevronRight, Move, Crop, Blend, Layers,
  Volume2, Pipette, ArrowUp, ArrowDown, RotateCcw, Timer, Diamond,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import {
  Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { useLocalization } from '@/i18n/useLocalization';
import { useStudioStore, clipDuration, type StudioAssetEntry } from '@/lib/studioStore';
import {
  TRANSFORM_PARAMS, CROP_PARAMS, effectParams, EFFECT_TYPES, EFFECT_LABEL_KEYS,
  IDENTITY_TRANSFORM, ZERO_CROP, STUDIO_V3_RANGES, TRANSITION_TYPE_GROUPS, type EffectParam,
} from '@/lib/studio/effectRegistry';
import { defaultTransitionSeconds } from '@/lib/studio/preferences';
import { requestEyedrop } from '@/lib/studio/eyedropper';
import { valueAt } from '@/lib/studio/ease';
import {
  keyframeLane,
  keyframeAt,
  keyframeAnalyticsSubkey,
  KEYFRAME_HIT_EPSILON,
} from '@/lib/studio/keyframes';
import { useUndoGesture } from './useUndoGesture';
import { editSummary } from '@/lib/studio/telemetry';
import { Panel } from '@/components/darkroom/panel';
import { STUDIO_TITLE_FONTS, titleFontByFamily } from '@/lib/studio/titleFonts';
import type {
  StudioClip, StudioTrack, StudioEffect, StudioBlendMode, StudioTransform, StudioCrop,
  StudioTransitionType, StudioKeyframeEase, StudioTitleLayer, StudioTitleTextLayer,
  StudioTitleRectLayer, StudioTitleLineLayer,
} from '@/lib/studioTypes';

const DEFAULT_ADJUSTMENTS = { brightness: 0, contrast: 1, saturation: 1 };
const BLEND_MODES: StudioBlendMode[] = ['normal', 'multiply', 'screen', 'overlay', 'lighten', 'darken', 'addition', 'difference'];
const KEYFRAME_EASES: StudioKeyframeEase[] = ['linear', 'hold', 'easeIn', 'easeOut', 'easeBoth'];

// --- keyframe helpers (part 15) ----------------------------------------------

/** Clip-local playhead seconds, clamped into the clip. Subscribes only while `enabled`. */
function useClipLocalPlayhead(clip: StudioClip, enabled: boolean): number {
  return useStudioStore((s) => {
    if (!enabled) return 0;
    const local = s.playhead - clip.timelineStart;
    return Math.max(0, Math.min(clipDuration(clip), local));
  });
}

/** Clip-local playhead read imperatively (for write paths — no subscription). */
function clipLocalPlayheadNow(clip: StudioClip): number {
  const local = useStudioStore.getState().playhead - clip.timelineStart;
  return Math.max(0, Math.min(clipDuration(clip), local));
}

/**
 * Premiere stopwatch semantics: adjusting an ARMED property writes/updates a
 * keyframe at the playhead; an unarmed one writes the static field.
 */
function writeKeyframable(clip: StudioClip, property: string, v: number, writeStatic: (v: number) => void): void {
  const lane = keyframeLane(clip, property);
  if (lane && lane.length > 0) {
    const t = clipLocalPlayheadNow(clip);
    if (!keyframeAt(lane, t)) editSummary.increment('keyframesAdded', keyframeAnalyticsSubkey(property));
    useStudioStore.getState().setKeyframe(clip.id, property, t, v);
  } else {
    writeStatic(v);
  }
}

/** The value a keyframable row displays: animated at the playhead when armed, else the static. */
function keyframableDisplayValue(clip: StudioClip, property: string, localT: number, fallback: number): number {
  const lane = keyframeLane(clip, property);
  return lane && lane.length > 0 ? valueAt(lane, localT, fallback) : fallback;
}

/**
 * Stopwatch + ◀ ✦ ▶ + ease controls for one keyframable row. `effectiveValue`
 * is what ✦ writes when adding a keyframe at the playhead.
 */
const KeyframeButtons: React.FC<{ clip: StudioClip; property: string; effectiveValue: number }> = ({
  clip,
  property,
  effectiveValue,
}) => {
  const { t } = useLocalization('interface');
  const lane = keyframeLane(clip, property);
  const armed = !!lane && lane.length > 0;
  const localT = useClipLocalPlayhead(clip, armed);
  const atPlayhead = armed ? keyframeAt(lane, localT) : undefined;
  const subkey = keyframeAnalyticsSubkey(property);

  const toggleArm = () => {
    const st = useStudioStore.getState();
    if (armed) {
      if (!window.confirm(t('contentStudio.inspector.keyframes.confirmDisarm'))) return;
      st.disarmProperty(clip.id, property, clipLocalPlayheadNow(clip));
    } else {
      st.armProperty(clip.id, property, clipLocalPlayheadNow(clip));
      editSummary.increment('keyframesAdded', subkey);
    }
    editSummary.increment('uiInvocations');
  };

  const seek = (kfT: number) => {
    useStudioStore.getState().setPlayhead(clip.timelineStart + kfT);
  };

  const toggleAtPlayhead = () => {
    const st = useStudioStore.getState();
    const now = clipLocalPlayheadNow(clip);
    const existing = keyframeAt(lane, now);
    if (existing) {
      st.removeKeyframe(clip.id, property, existing.t);
    } else {
      st.setKeyframe(clip.id, property, now, effectiveValue);
      editSummary.increment('keyframesAdded', subkey);
    }
    editSummary.increment('uiInvocations');
  };

  const prevKf = armed ? [...lane].reverse().find((k) => k.t < localT - KEYFRAME_HIT_EPSILON) : undefined;
  const nextKf = armed ? lane.find((k) => k.t > localT + KEYFRAME_HIT_EPSILON) : undefined;

  return (
    <span className="inline-flex items-center gap-0.5">
      <button
        type="button"
        onClick={toggleArm}
        className={`p-0.5 rounded hover:bg-muted ${armed ? 'text-premium' : 'text-muted-foreground/60'}`}
        title={t('contentStudio.inspector.keyframes.toggle')}
        aria-pressed={armed}
      >
        <Timer className="w-3 h-3" />
      </button>
      {armed && (
        <>
          <button
            type="button"
            disabled={!prevKf}
            onClick={() => prevKf && seek(prevKf.t)}
            className="p-0.5 rounded hover:bg-muted text-muted-foreground disabled:opacity-30"
            title={t('contentStudio.inspector.keyframes.prev')}
          >
            <ChevronLeft className="w-3 h-3" />
          </button>
          <button
            type="button"
            onClick={toggleAtPlayhead}
            className={`p-0.5 rounded hover:bg-muted ${atPlayhead ? 'text-premium' : 'text-muted-foreground'}`}
            title={t('contentStudio.inspector.keyframes.addRemove')}
          >
            <Diamond className="w-3 h-3" fill={atPlayhead ? 'currentColor' : 'none'} />
          </button>
          <button
            type="button"
            disabled={!nextKf}
            onClick={() => nextKf && seek(nextKf.t)}
            className="p-0.5 rounded hover:bg-muted text-muted-foreground disabled:opacity-30"
            title={t('contentStudio.inspector.keyframes.next')}
          >
            <ChevronRight className="w-3 h-3" />
          </button>
          {atPlayhead && (
            <Select
              value={atPlayhead.ease}
              onValueChange={(ease) => {
                useStudioStore
                  .getState()
                  .setKeyframe(clip.id, property, atPlayhead.t, atPlayhead.value, ease as StudioKeyframeEase);
                editSummary.increment('uiInvocations');
              }}
            >
              <SelectTrigger
                className="h-5 w-auto gap-0.5 px-1 text-[10px]"
                title={t('contentStudio.inspector.keyframes.ease')}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {KEYFRAME_EASES.map((e) => (
                  <SelectItem key={e} value={e} className="text-xs">
                    {t(`contentStudio.inspector.keyframes.eases.${e}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </>
      )}
    </span>
  );
};

const ClipInspector: React.FC = () => {
  const { t } = useLocalization('interface');
  const project = useStudioStore((s) => s.project);
  const assets = useStudioStore((s) => s.assets);
  const selectedClipIds = useStudioStore((s) => s.selectedClipIds);

  const id = selectedClipIds.length === 1 ? selectedClipIds[0] : null;
  let found: { clip: StudioClip; track: StudioTrack } | null = null;
  if (id && project) {
    for (const tr of project.tracks) {
      const c = tr.clips.find((cc) => cc.id === id);
      if (c) {
        found = { clip: c, track: tr };
        break;
      }
    }
  }

  if (!found) {
    return (
      <Panel level="2" padding={false} className="p-4 h-full">
        <h2 className="text-sm font-semibold text-card-foreground mb-2 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          {t('contentStudio.inspector.title')}
        </h2>
        <p className="text-xs text-muted-foreground">{t('contentStudio.inspector.none')}</p>
      </Panel>
    );
  }

  const { clip, track } = found;
  const isVideo = track.kind === 'video';
  const hasAudio = !!assets[clip.assetId]?.asset.hasAudio;
  const lutAssets = Object.values(assets).filter((a) => a.asset.mediaKind === 'lut');

  return (
    <Panel level="2" padding={false} className="p-4 h-full overflow-y-auto">
      <h2 className="text-sm font-semibold text-card-foreground mb-3 flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-primary" />
        {t('contentStudio.inspector.title')}
      </h2>

      {isVideo && clip.title && <TitleSection clip={clip} />}

      {isVideo && (
        <>
          <MotionSection clip={clip} />
          <CropSection clip={clip} />
          <OpacityBlendSection clip={clip} />
          {/* Color/effects are hidden on title clips: ffmpeg's eq/colorbalance
              stages are alpha-destroying, so the export could not match the
              preview for a graded transparent title (part 16 scope note). */}
          {!clip.title && <ColorSection clip={clip} />}
          {!clip.title && <EffectsSection clip={clip} lutAssets={lutAssets} />}
        </>
      )}

      {hasAudio && <AudioSection clip={clip} />}

      <TransitionSection clip={clip} track={track} />

      {isVideo && !clip.title && <TextSection clip={clip} />}
    </Panel>
  );
};

// --- section shell -----------------------------------------------------------

const Section: React.FC<{
  title: string;
  icon: React.ReactNode;
  defaultOpen?: boolean;
  action?: React.ReactNode;
  children: React.ReactNode;
}> = ({ title, icon, defaultOpen = true, action, children }) => {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <Collapsible open={open} onOpenChange={setOpen} className="border-b border-border py-2">
      <div className="flex items-center justify-between">
        <CollapsibleTrigger className="flex items-center gap-1.5 text-xs font-semibold text-card-foreground hover:text-primary">
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? '' : '-rotate-90'}`} />
          {icon}
          {title}
        </CollapsibleTrigger>
        {action}
      </div>
      <CollapsibleContent className="pt-2">{children}</CollapsibleContent>
    </Collapsible>
  );
};

// --- registry-driven slider --------------------------------------------------

const ParamSlider: React.FC<{
  param: EffectParam;
  value: number;
  onChange: (v: number) => void;
  /** Part 15: renders the stopwatch/◀✦▶ controls next to the label. */
  keyframes?: { clip: StudioClip; property: string };
}> = ({ param, value, onChange, keyframes }) => {
  const { t } = useLocalization('interface');
  // One undo entry per scrub (slider) or focus session (number field).
  const gesture = useUndoGesture();
  return (
    <div className="mb-2">
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-1 min-w-0">
          <Label className="text-[11px] text-muted-foreground">{t(param.labelKey)}</Label>
          {keyframes && (
            <KeyframeButtons clip={keyframes.clip} property={keyframes.property} effectiveValue={value} />
          )}
        </span>
        <Input
          type="number"
          className="h-6 w-16 text-[11px] px-1 text-right"
          min={param.min}
          max={param.max}
          step={param.step}
          value={Number.isFinite(value) ? value : param.default}
          onFocus={gesture.begin}
          onBlur={gesture.end}
          onChange={(e) => {
            const v = parseFloat(e.target.value);
            if (Number.isFinite(v)) onChange(Math.max(param.min, Math.min(param.max, v)));
          }}
        />
      </div>
      <Slider
        className="mt-1"
        min={param.min}
        max={param.max}
        step={param.step}
        value={[value]}
        onValueChange={(v) => {
          gesture.begin();
          onChange(v[0] ?? value);
        }}
        onValueCommit={gesture.end}
      />
    </div>
  );
};

// --- Motion ------------------------------------------------------------------

// Transform field → keyframe lane name (the part-05 contract's lane vocabulary).
const MOTION_PROPERTY: Record<string, string> = {
  x: 'positionX',
  y: 'positionY',
  scale: 'scale',
  rotationDeg: 'rotation',
};

const MotionSection: React.FC<{ clip: StudioClip }> = ({ clip }) => {
  const { t } = useLocalization('interface');
  const setClipTransform = useStudioStore((s) => s.setClipTransform);
  const tf: StudioTransform = clip.transform ?? { ...IDENTITY_TRANSFORM };
  const anyArmed = TRANSFORM_PARAMS.some((p) => keyframeLane(clip, MOTION_PROPERTY[p.key])?.length);
  const localT = useClipLocalPlayhead(clip, anyArmed);
  const update = (key: keyof StudioTransform, v: number) =>
    writeKeyframable(clip, MOTION_PROPERTY[key], v, (sv) => setClipTransform(clip.id, { ...tf, [key]: sv }));
  return (
    <Section
      title={t('contentStudio.inspector.sectionMotion')}
      icon={<Move className="w-3.5 h-3.5" />}
      action={
        clip.transform ? (
          <Button size="sm" variant="ghost" className="h-6 text-[11px]" onClick={() => setClipTransform(clip.id, undefined)}>
            <RotateCcw className="w-3 h-3 mr-1" />
            {t('contentStudio.inspector.reset')}
          </Button>
        ) : undefined
      }
    >
      {TRANSFORM_PARAMS.map((p) => (
        <ParamSlider
          key={p.key}
          param={p}
          value={keyframableDisplayValue(clip, MOTION_PROPERTY[p.key], localT, (tf as Record<string, number>)[p.key])}
          onChange={(v) => update(p.key as keyof StudioTransform, v)}
          keyframes={{ clip, property: MOTION_PROPERTY[p.key] }}
        />
      ))}
    </Section>
  );
};

// --- Crop --------------------------------------------------------------------

const CropSection: React.FC<{ clip: StudioClip }> = ({ clip }) => {
  const { t } = useLocalization('interface');
  const setClipCrop = useStudioStore((s) => s.setClipCrop);
  const cr: StudioCrop = clip.crop ?? { ...ZERO_CROP };
  const update = (key: keyof StudioCrop, v: number) => {
    const next = { ...cr, [key]: v };
    const empty = next.left === 0 && next.top === 0 && next.right === 0 && next.bottom === 0;
    setClipCrop(clip.id, empty ? undefined : next);
  };
  return (
    <Section title={t('contentStudio.inspector.sectionCrop')} icon={<Crop className="w-3.5 h-3.5" />} defaultOpen={false}>
      {CROP_PARAMS.map((p) => (
        <ParamSlider key={p.key} param={p} value={(cr as Record<string, number>)[p.key]} onChange={(v) => update(p.key as keyof StudioCrop, v)} />
      ))}
    </Section>
  );
};

// --- Opacity & Blend ---------------------------------------------------------

const OpacityBlendSection: React.FC<{ clip: StudioClip }> = ({ clip }) => {
  const { t } = useLocalization('interface');
  const updateClip = useStudioStore((s) => s.updateClip);
  const setClipBlendMode = useStudioStore((s) => s.setClipBlendMode);
  const gesture = useUndoGesture();
  const armed = !!keyframeLane(clip, 'opacity')?.length;
  const localT = useClipLocalPlayhead(clip, armed);
  const opacity = keyframableDisplayValue(clip, 'opacity', localT, clip.opacity ?? 1);
  return (
    <Section title={t('contentStudio.inspector.sectionOpacityBlend')} icon={<Blend className="w-3.5 h-3.5" />} defaultOpen={false}>
      <div className="mb-3">
        <Label className="text-[11px] text-muted-foreground flex justify-between">
          <span className="flex items-center gap-1">
            {t('contentStudio.inspector.opacity')}
            <KeyframeButtons clip={clip} property="opacity" effectiveValue={opacity} />
          </span>
          <span className="tabular-nums">{Math.round(opacity * 100)}%</span>
        </Label>
        <Slider
          className="mt-1"
          min={0}
          max={1}
          step={0.01}
          value={[opacity]}
          onValueChange={(v) => {
            gesture.begin();
            writeKeyframable(clip, 'opacity', v[0] ?? 1, (sv) => updateClip(clip.id, { opacity: sv }));
          }}
          onValueCommit={gesture.end}
        />
      </div>
      <Label className="text-[11px] text-muted-foreground">{t('contentStudio.inspector.blendMode')}</Label>
      <Select value={clip.blendMode ?? 'normal'} onValueChange={(v) => setClipBlendMode(clip.id, v as StudioBlendMode)}>
        <SelectTrigger className="h-7 mt-1 text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {BLEND_MODES.map((m) => (
            <SelectItem key={m} value={m} className="text-xs">
              {t(`contentStudio.inspector.blendModes.${m}`)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Section>
  );
};

// --- Color (simple adjustments) ---------------------------------------------

const ColorSection: React.FC<{ clip: StudioClip }> = ({ clip }) => {
  const { t } = useLocalization('interface');
  const setClipAdjustments = useStudioStore((s) => s.setClipAdjustments);
  const adj = clip.adjustments;
  return (
    <Section
      title={t('contentStudio.inspector.sectionColor')}
      icon={<Sparkles className="w-3.5 h-3.5" />}
      defaultOpen={false}
      action={
        adj ? (
          <Button size="sm" variant="ghost" className="h-6 text-[11px]" onClick={() => setClipAdjustments(clip.id, undefined)}>
            {t('contentStudio.inspector.removeColor')}
          </Button>
        ) : (
          <Button size="sm" variant="ghost" className="h-6 text-[11px]" onClick={() => setClipAdjustments(clip.id, { ...DEFAULT_ADJUSTMENTS })}>
            <Plus className="w-3 h-3 mr-1" />
            {t('contentStudio.inspector.addColor')}
          </Button>
        )
      }
    >
      {adj && (
        <div className="space-y-1">
          <MiniNumber label={t('contentStudio.inspector.brightness')} min={-1} max={1} step={0.05} value={adj.brightness} onChange={(brightness) => setClipAdjustments(clip.id, { ...adj, brightness })} />
          <MiniNumber label={t('contentStudio.inspector.contrast')} min={0} max={2} step={0.05} value={adj.contrast} onChange={(contrast) => setClipAdjustments(clip.id, { ...adj, contrast })} />
          <MiniNumber label={t('contentStudio.inspector.saturation')} min={0} max={2} step={0.05} value={adj.saturation} onChange={(saturation) => setClipAdjustments(clip.id, { ...adj, saturation })} />
        </div>
      )}
    </Section>
  );
};

// --- Effects (lumetri / lut / chromakey) ------------------------------------

const EffectsSection: React.FC<{ clip: StudioClip; lutAssets: StudioAssetEntry[] }> = ({ clip, lutAssets }) => {
  const { t } = useLocalization('interface');
  const addEffect = useStudioStore((s) => s.addEffect);
  const removeEffect = useStudioStore((s) => s.removeEffect);
  const toggleEffect = useStudioStore((s) => s.toggleEffect);
  const reorderEffect = useStudioStore((s) => s.reorderEffect);
  const effects = clip.effects ?? [];

  return (
    <Section
      title={t('contentStudio.inspector.sectionEffects')}
      icon={<Layers className="w-3.5 h-3.5" />}
      defaultOpen={false}
      action={
        <Select
          value=""
          onValueChange={(v) => {
            addEffect(clip.id, v as 'lumetri' | 'lut' | 'chromakey');
            // Edit actions aggregate (part 10, ADR ws/0003): counted into the session's
            // studio_edit_summary instead of a discrete event per click. The effect TYPE
            // only — a closed vocabulary, carrying nothing about the media.
            editSummary.increment('effectsAdded', v);
            editSummary.increment('uiInvocations');
          }}
        >
          <SelectTrigger className="h-6 w-auto text-[11px] gap-1 px-2">
            <Plus className="w-3 h-3" />
            {t('contentStudio.inspector.effects.add')}
          </SelectTrigger>
          <SelectContent>
            {EFFECT_TYPES.map((type) => (
              <SelectItem key={type} value={type} className="text-xs">
                {t(EFFECT_LABEL_KEYS[type])}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      }
    >
      {effects.length === 0 ? (
        <p className="text-[11px] text-muted-foreground">{t('contentStudio.inspector.effects.empty')}</p>
      ) : (
        <div className="space-y-2">
          {effects.map((effect, i) => (
            <EffectCard
              key={effect.id}
              clip={clip}
              clipId={clip.id}
              effect={effect}
              index={i}
              count={effects.length}
              lutAssets={lutAssets}
              onRemove={() => removeEffect(clip.id, effect.id)}
              onToggle={() => toggleEffect(clip.id, effect.id)}
              onMoveUp={() => reorderEffect(clip.id, i, i - 1)}
              onMoveDown={() => reorderEffect(clip.id, i, i + 1)}
            />
          ))}
        </div>
      )}
    </Section>
  );
};

const EffectCard: React.FC<{
  clip: StudioClip;
  clipId: string;
  effect: StudioEffect;
  index: number;
  count: number;
  lutAssets: StudioAssetEntry[];
  onRemove: () => void;
  onToggle: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}> = ({ clip, clipId, effect, index, count, lutAssets, onRemove, onToggle, onMoveUp, onMoveDown }) => {
  const { t } = useLocalization('interface');
  const updateEffect = useStudioStore((s) => s.updateEffect);
  // Part 15: Lumetri params are keyframable ("<effectId>.<param>" lanes).
  const anyArmed =
    effect.type === 'lumetri' &&
    effectParams('lumetri').some((p) => keyframeLane(clip, `${effect.id}.${p.key}`)?.length);
  const localT = useClipLocalPlayhead(clip, anyArmed);

  return (
    <div className={`rounded-md border border-border p-2 ${effect.enabled ? '' : 'opacity-50'}`}>
      <div className="flex items-center gap-1.5 mb-1">
        <Switch checked={effect.enabled} onCheckedChange={onToggle} aria-label={t('contentStudio.inspector.effects.enable')} />
        <span className="text-[11px] font-medium text-card-foreground flex-1">{t(EFFECT_LABEL_KEYS[effect.type])}</span>
        <Button size="icon" variant="ghost" className="h-6 w-6" disabled={index === 0} onClick={onMoveUp} title={t('contentStudio.inspector.effects.moveUp')}>
          <ArrowUp className="w-3 h-3" />
        </Button>
        <Button size="icon" variant="ghost" className="h-6 w-6" disabled={index === count - 1} onClick={onMoveDown} title={t('contentStudio.inspector.effects.moveDown')}>
          <ArrowDown className="w-3 h-3" />
        </Button>
        <Button size="icon" variant="ghost" className="h-6 w-6 text-destructive" onClick={onRemove}>
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>

      {effect.type === 'lumetri' &&
        effectParams('lumetri').map((p) => {
          const property = `${effect.id}.${p.key}`;
          return (
            <ParamSlider
              key={p.key}
              param={p}
              value={keyframableDisplayValue(clip, property, localT, (effect as unknown as Record<string, number>)[p.key])}
              onChange={(v) =>
                writeKeyframable(clip, property, v, (sv) => updateEffect(clipId, effect.id, { [p.key]: sv }))
              }
              keyframes={{ clip, property }}
            />
          );
        })}

      {effect.type === 'lut' && (
        <div className="space-y-2">
          {lutAssets.length === 0 ? (
            <p className="text-[11px] text-muted-foreground">{t('contentStudio.inspector.lut.noLuts')}</p>
          ) : (
            <Select value={effect.lutAssetId || ''} onValueChange={(v) => updateEffect(clipId, effect.id, { lutAssetId: v })}>
              <SelectTrigger className="h-7 text-xs">
                <SelectValue placeholder={t('contentStudio.inspector.lut.none')} />
              </SelectTrigger>
              <SelectContent>
                {lutAssets.map((a) => (
                  <SelectItem key={a.asset.id} value={a.asset.id} className="text-xs">
                    {a.asset.originalFileName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {effectParams('lut').map((p) => (
            <ParamSlider key={p.key} param={p} value={(effect as unknown as Record<string, number>)[p.key]} onChange={(v) => updateEffect(clipId, effect.id, { [p.key]: v })} />
          ))}
        </div>
      )}

      {effect.type === 'chromakey' && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label className="text-[11px] text-muted-foreground flex-1">{t('contentStudio.inspector.chromakey.keyColor')}</Label>
            <input
              type="color"
              className="h-7 w-9 rounded border border-border bg-transparent"
              value={effect.keyColor}
              onChange={(e) => updateEffect(clipId, effect.id, { keyColor: e.target.value })}
            />
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7"
              title={t('contentStudio.inspector.chromakey.eyedropper')}
              onClick={() => requestEyedrop((hex) => updateEffect(clipId, effect.id, { keyColor: hex }))}
            >
              <Pipette className="w-3.5 h-3.5" />
            </Button>
          </div>
          {effectParams('chromakey').map((p) => (
            <ParamSlider key={p.key} param={p} value={(effect as unknown as Record<string, number>)[p.key]} onChange={(v) => updateEffect(clipId, effect.id, { [p.key]: v })} />
          ))}
        </div>
      )}
    </div>
  );
};

// --- Audio (volume / pan / keyframes) ---------------------------------------

const AudioSection: React.FC<{ clip: StudioClip }> = ({ clip }) => {
  const { t } = useLocalization('interface');
  const setClipVolume = useStudioStore((s) => s.setClipVolume);
  const setClipPan = useStudioStore((s) => s.setClipPan);
  const gesture = useUndoGesture();
  // Part 15: volume/pan adopt the stopwatch UI. Arming volume adopts an
  // existing rubber-band curve (store keeps the legacy lane mirrored).
  const volumeArmed = !!keyframeLane(clip, 'volume')?.length;
  const panArmed = !!keyframeLane(clip, 'pan')?.length;
  const localT = useClipLocalPlayhead(clip, volumeArmed || panArmed);
  const volume = keyframableDisplayValue(clip, 'volume', localT, clip.volume ?? 1);
  const pan = keyframableDisplayValue(clip, 'pan', localT, clip.pan ?? 0);
  const db = volume <= 0 ? '−∞' : (20 * Math.log10(volume)).toFixed(1);

  return (
    <Section title={t('contentStudio.inspector.sectionAudio')} icon={<Volume2 className="w-3.5 h-3.5" />} defaultOpen={false}>
      <div className="mb-3">
        <Label className="text-[11px] text-muted-foreground flex justify-between">
          <span className="flex items-center gap-1">
            {t('contentStudio.inspector.audio.volume')}
            <KeyframeButtons clip={clip} property="volume" effectiveValue={volume} />
          </span>
          <span className="tabular-nums">{db} dB</span>
        </Label>
        <Slider
          className="mt-1"
          min={0}
          max={2}
          step={0.01}
          value={[volume]}
          onValueChange={(v) => {
            gesture.begin();
            writeKeyframable(clip, 'volume', v[0] ?? 1, (sv) => setClipVolume(clip.id, sv));
          }}
          onValueCommit={gesture.end}
        />
      </div>
      <div className="mb-3">
        <Label className="text-[11px] text-muted-foreground flex justify-between">
          <span className="flex items-center gap-1">
            {t('contentStudio.inspector.audio.pan')}
            <KeyframeButtons clip={clip} property="pan" effectiveValue={pan} />
          </span>
          <span className="tabular-nums">
            {pan === 0 ? 'C' : `${pan < 0 ? t('contentStudio.inspector.audio.panLeft') : t('contentStudio.inspector.audio.panRight')} ${Math.round(Math.abs(pan) * 100)}`}
          </span>
        </Label>
        <Slider
          className="mt-1"
          min={-1}
          max={1}
          step={0.01}
          value={[pan]}
          onValueChange={(v) => {
            gesture.begin();
            writeKeyframable(clip, 'pan', v[0] ?? 0, (sv) => setClipPan(clip.id, sv));
          }}
          onValueCommit={gesture.end}
        />
      </div>
      {volumeArmed && <p className="text-[11px] text-muted-foreground mt-1">{t('contentStudio.inspector.audio.keyframeNote')}</p>}
    </Section>
  );
};

// --- Transition (typed, part 14) ---------------------------------------------

const TransitionSection: React.FC<{ clip: StudioClip; track: StudioTrack }> = ({ clip, track }) => {
  const { t } = useLocalization('interface');
  const setClipTransition = useStudioStore((s) => s.setClipTransition);
  const gesture = useUndoGesture();
  const hasPrev = track.clips.some((c) => c.id !== clip.id && c.timelineStart < clip.timelineStart);
  const range = STUDIO_V3_RANGES.transitionDurationSeconds;
  const transition = clip.transition;
  const duration = transition?.durationSeconds ?? defaultTransitionSeconds(track.kind);

  const applyType = (value: string) => {
    if (value === 'none') {
      if (transition) {
        setClipTransition(clip.id, null);
        editSummary.increment('uiInvocations');
      }
      return;
    }
    const type = value as StudioTransitionType;
    // Counted as an add (with its type) whether fresh or a type change — the
    // taxonomy asks "which transitions get used", picker-attributed via
    // uiInvocations (the Cmd/Ctrl+D path counts shortcutInvocations instead).
    editSummary.increment('transitionsAdded', type);
    editSummary.increment('uiInvocations');
    setClipTransition(clip.id, { type, durationSeconds: duration });
  };

  return (
    <Section title={t('contentStudio.inspector.sectionTransition')} icon={<Blend className="w-3.5 h-3.5" />} defaultOpen={false}>
      <Label className="text-[11px] text-muted-foreground">{t('contentStudio.inspector.transitionType')}</Label>
      <Select value={transition?.type ?? 'none'} onValueChange={applyType} disabled={!hasPrev}>
        <SelectTrigger className="h-7 mt-1 text-xs w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none" className="text-xs">
            {t('contentStudio.inspector.transitionNone')}
          </SelectItem>
          {TRANSITION_TYPE_GROUPS.map((group) => (
            <SelectGroup key={group.key}>
              <SelectLabel className="text-[10px] uppercase tracking-wide text-muted-foreground">
                {t(`contentStudio.inspector.transitionGroups.${group.key}`)}
              </SelectLabel>
              {group.types.map((type) => (
                <SelectItem key={type} value={type} className="text-xs">
                  {t(`contentStudio.inspector.transitionTypes.${type}`)}
                </SelectItem>
              ))}
            </SelectGroup>
          ))}
        </SelectContent>
      </Select>
      {transition && (
        <div className="mt-3">
          <Label className="text-[11px] text-muted-foreground flex justify-between">
            <span>{t('contentStudio.inspector.transitionDuration')}</span>
            <span className="tabular-nums">{transition.durationSeconds.toFixed(2)}s</span>
          </Label>
          <Slider
            className="mt-1"
            min={range.min}
            max={range.max}
            step={range.step}
            value={[transition.durationSeconds]}
            onValueChange={(v) => {
              gesture.begin();
              setClipTransition(clip.id, { ...transition, durationSeconds: v[0] ?? transition.durationSeconds });
            }}
            onValueCommit={gesture.end}
          />
        </div>
      )}
      {!hasPrev && <p className="text-[11px] text-muted-foreground mt-1">{t('contentStudio.inspector.transitionNoPrev')}</p>}
    </Section>
  );
};

// --- Title clips (part 16) ---------------------------------------------------

const TITLE = STUDIO_V3_RANGES.title;
const FONT_CATEGORIES = ['sans', 'serif', 'display', 'mono', 'script'] as const;

/** Compact labelled color swatch, with the shared eyedropper. */
const TitleColorField: React.FC<{
  label: string;
  value: string;
  onChange: (hex: string) => void;
  eyedrop?: boolean;
}> = ({ label, value, onChange, eyedrop = true }) => {
  const { t } = useLocalization('interface');
  const gesture = useUndoGesture();
  return (
    <div className="flex items-center gap-2">
      <Label className="text-[11px] text-muted-foreground flex-1">{label}</Label>
      <input
        type="color"
        className="h-7 w-9 rounded border border-border bg-transparent"
        value={value}
        onFocus={gesture.begin}
        onBlur={gesture.end}
        onChange={(e) => onChange(e.target.value)}
      />
      {eyedrop && (
        <Button
          size="icon"
          variant="ghost"
          className="h-7 w-7"
          title={t('contentStudio.inspector.chromakey.eyedropper')}
          onClick={() => requestEyedrop(onChange)}
        >
          <Pipette className="w-3.5 h-3.5" />
        </Button>
      )}
    </div>
  );
};

const TitleTextLayerControls: React.FC<{
  clip: StudioClip;
  index: number;
  layer: StudioTitleTextLayer;
}> = ({ clip, index, layer }) => {
  const { t } = useLocalization('interface');
  const updateTitleLayer = useStudioStore((s) => s.updateTitleLayer);
  const gesture = useUndoGesture();
  const patch = (p: Record<string, unknown>) => updateTitleLayer(clip.id, index, p);
  const font = titleFontByFamily(layer.fontFamily);
  const tk = (k: string) => t(`contentStudio.inspector.titleUi.${k}`);

  return (
    <div className="space-y-2">
      <textarea
        className="w-full min-h-14 rounded-md border border-border bg-transparent px-2 py-1 text-xs text-foreground resize-y"
        value={layer.text}
        placeholder={tk('textPlaceholder')}
        onFocus={gesture.begin}
        onBlur={gesture.end}
        onChange={(e) => patch({ text: e.target.value.slice(0, TITLE.maxTextLength) })}
      />
      <div className="flex items-center gap-2">
        <Label className="text-[11px] text-muted-foreground w-12 shrink-0">{tk('font')}</Label>
        <Select
          value={layer.fontFamily}
          onValueChange={(family) => {
            const next = titleFontByFamily(family);
            patch({
              fontFamily: family,
              // 400-only families clamp bold away (no synthetic canvas bold).
              ...(next && !next.supportsBold && layer.fontWeight === 700 ? { fontWeight: 400 } : {}),
            });
            editSummary.increment('uiInvocations');
          }}
        >
          <SelectTrigger className="h-7 flex-1 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {FONT_CATEGORIES.map((cat) => (
              <SelectGroup key={cat}>
                <SelectLabel className="text-[10px] uppercase tracking-wide text-muted-foreground">
                  {tk(`fontCategories.${cat}`)}
                </SelectLabel>
                {STUDIO_TITLE_FONTS.filter((f) => f.category === cat).map((f) => (
                  <SelectItem
                    key={f.family}
                    value={f.family}
                    className="text-sm"
                    style={{ fontFamily: `"${f.family}", sans-serif` }}
                  >
                    {f.family}
                  </SelectItem>
                ))}
              </SelectGroup>
            ))}
          </SelectContent>
        </Select>
        <Button
          size="sm"
          variant={layer.fontWeight === 700 ? 'default' : 'outline'}
          className="h-7 w-8 px-0 font-bold"
          disabled={!!font && !font.supportsBold}
          title={tk('bold')}
          aria-pressed={layer.fontWeight === 700}
          onClick={() => patch({ fontWeight: layer.fontWeight === 700 ? 400 : 700 })}
        >
          B
        </Button>
      </div>
      <MiniNumber label={tk('size')} min={TITLE.fontSizePx.min} max={TITLE.fontSizePx.max} step={TITLE.fontSizePx.step} value={layer.fontSizePx} onChange={(fontSizePx) => patch({ fontSizePx })} />
      <div className="grid grid-cols-2 gap-2">
        <MiniNumber label={tk('posX')} min={0} max={1} step={0.005} value={layer.x} onChange={(x) => patch({ x })} />
        <MiniNumber label={tk('posY')} min={0} max={1} step={0.005} value={layer.y} onChange={(y) => patch({ y })} />
      </div>
      <div className="flex items-center gap-2">
        <Label className="text-[11px] text-muted-foreground w-12 shrink-0">{tk('align')}</Label>
        <Select value={layer.align} onValueChange={(align) => patch({ align })}>
          <SelectTrigger className="h-7 flex-1 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(['left', 'center', 'right'] as const).map((a) => (
              <SelectItem key={a} value={a} className="text-xs">
                {tk(`align${a[0].toUpperCase()}${a.slice(1)}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <TitleColorField label={tk('fill')} value={layer.fillColor} onChange={(fillColor) => patch({ fillColor })} />
      <div className="grid grid-cols-2 gap-2">
        <MiniNumber label={tk('letterSpacing')} min={TITLE.letterSpacingPx.min} max={TITLE.letterSpacingPx.max} step={TITLE.letterSpacingPx.step} value={layer.letterSpacingPx ?? TITLE.letterSpacingPx.default} onChange={(letterSpacingPx) => patch({ letterSpacingPx })} />
        <MiniNumber label={tk('lineHeight')} min={TITLE.lineHeight.min} max={TITLE.lineHeight.max} step={TITLE.lineHeight.step} value={layer.lineHeight ?? TITLE.lineHeight.default} onChange={(lineHeight) => patch({ lineHeight })} />
      </div>

      {/* Stroke */}
      <div className="flex items-center justify-between">
        <Label className="text-[11px] text-muted-foreground">{tk('stroke')}</Label>
        <Switch
          checked={layer.strokeColor !== undefined}
          onCheckedChange={(on) =>
            patch(on ? { strokeColor: '#000000', strokeWidthPx: 2 } : { strokeColor: undefined, strokeWidthPx: undefined })
          }
          aria-label={tk('stroke')}
        />
      </div>
      {layer.strokeColor !== undefined && (
        <div className="space-y-2 pl-2 border-l border-border">
          <TitleColorField label={tk('fill')} value={layer.strokeColor} onChange={(strokeColor) => patch({ strokeColor })} />
          <MiniNumber label={tk('strokeWidth')} min={TITLE.strokeWidthPx.min} max={TITLE.strokeWidthPx.max} step={TITLE.strokeWidthPx.step} value={layer.strokeWidthPx ?? 0} onChange={(strokeWidthPx) => patch({ strokeWidthPx })} />
        </div>
      )}

      {/* Shadow */}
      <div className="flex items-center justify-between">
        <Label className="text-[11px] text-muted-foreground">{tk('shadow')}</Label>
        <Switch
          checked={layer.shadow !== undefined}
          onCheckedChange={(on) =>
            patch({ shadow: on ? { xPx: 2, yPx: 2, blurPx: TITLE.shadowBlurPx.default, color: '#000000' } : undefined })
          }
          aria-label={tk('shadow')}
        />
      </div>
      {layer.shadow && (
        <div className="space-y-2 pl-2 border-l border-border">
          <div className="grid grid-cols-2 gap-2">
            <MiniNumber label={tk('shadowX')} min={TITLE.shadowOffsetPx.min} max={TITLE.shadowOffsetPx.max} step={1} value={layer.shadow.xPx} onChange={(xPx) => patch({ shadow: { ...layer.shadow!, xPx } })} />
            <MiniNumber label={tk('shadowY')} min={TITLE.shadowOffsetPx.min} max={TITLE.shadowOffsetPx.max} step={1} value={layer.shadow.yPx} onChange={(yPx) => patch({ shadow: { ...layer.shadow!, yPx } })} />
          </div>
          <MiniNumber label={tk('shadowBlur')} min={TITLE.shadowBlurPx.min} max={TITLE.shadowBlurPx.max} step={1} value={layer.shadow.blurPx} onChange={(blurPx) => patch({ shadow: { ...layer.shadow!, blurPx } })} />
          <TitleColorField label={tk('fill')} value={layer.shadow.color} onChange={(color) => patch({ shadow: { ...layer.shadow!, color } })} />
        </div>
      )}

      {/* Background box */}
      <div className="flex items-center justify-between">
        <Label className="text-[11px] text-muted-foreground">{tk('background')}</Label>
        <Switch
          checked={layer.background !== undefined}
          onCheckedChange={(on) =>
            patch({
              background: on
                ? { color: '#000000', opacity: 0.6, paddingXPx: TITLE.backgroundPaddingPx.default, paddingYPx: TITLE.backgroundPaddingPx.default, radiusPx: TITLE.cornerRadiusPx.default }
                : undefined,
            })
          }
          aria-label={tk('background')}
        />
      </div>
      {layer.background && (
        <div className="space-y-2 pl-2 border-l border-border">
          <TitleColorField label={tk('fill')} value={layer.background.color} onChange={(color) => patch({ background: { ...layer.background!, color } })} />
          <MiniNumber label={tk('bgOpacity')} min={0} max={1} step={0.01} value={layer.background.opacity} onChange={(opacity) => patch({ background: { ...layer.background!, opacity } })} />
          <div className="grid grid-cols-2 gap-2">
            <MiniNumber label={tk('paddingX')} min={TITLE.backgroundPaddingPx.min} max={TITLE.backgroundPaddingPx.max} step={1} value={layer.background.paddingXPx} onChange={(paddingXPx) => patch({ background: { ...layer.background!, paddingXPx } })} />
            <MiniNumber label={tk('paddingY')} min={TITLE.backgroundPaddingPx.min} max={TITLE.backgroundPaddingPx.max} step={1} value={layer.background.paddingYPx} onChange={(paddingYPx) => patch({ background: { ...layer.background!, paddingYPx } })} />
          </div>
          <MiniNumber label={tk('radius')} min={TITLE.cornerRadiusPx.min} max={TITLE.cornerRadiusPx.max} step={1} value={layer.background.radiusPx} onChange={(radiusPx) => patch({ background: { ...layer.background!, radiusPx } })} />
        </div>
      )}
    </div>
  );
};

const TitleRectLayerControls: React.FC<{
  clip: StudioClip;
  index: number;
  layer: StudioTitleRectLayer;
}> = ({ clip, index, layer }) => {
  const { t } = useLocalization('interface');
  const updateTitleLayer = useStudioStore((s) => s.updateTitleLayer);
  const patch = (p: Record<string, unknown>) => updateTitleLayer(clip.id, index, p);
  const tk = (k: string) => t(`contentStudio.inspector.titleUi.${k}`);
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <MiniNumber label={tk('posX')} min={0} max={1} step={0.005} value={layer.x} onChange={(x) => patch({ x })} />
        <MiniNumber label={tk('posY')} min={0} max={1} step={0.005} value={layer.y} onChange={(y) => patch({ y })} />
        <MiniNumber label={tk('width')} min={0} max={1} step={0.005} value={layer.w} onChange={(w) => patch({ w })} />
        <MiniNumber label={tk('height')} min={0} max={1} step={0.005} value={layer.h} onChange={(h) => patch({ h })} />
      </div>
      <TitleColorField label={tk('fill')} value={layer.color} onChange={(color) => patch({ color })} />
      <MiniNumber label={tk('bgOpacity')} min={0} max={1} step={0.01} value={layer.opacity ?? 1} onChange={(opacity) => patch({ opacity })} />
      <MiniNumber label={tk('radius')} min={TITLE.cornerRadiusPx.min} max={TITLE.cornerRadiusPx.max} step={1} value={layer.radiusPx ?? 0} onChange={(radiusPx) => patch({ radiusPx })} />
    </div>
  );
};

const TitleLineLayerControls: React.FC<{
  clip: StudioClip;
  index: number;
  layer: StudioTitleLineLayer;
}> = ({ clip, index, layer }) => {
  const { t } = useLocalization('interface');
  const updateTitleLayer = useStudioStore((s) => s.updateTitleLayer);
  const patch = (p: Record<string, unknown>) => updateTitleLayer(clip.id, index, p);
  const tk = (k: string) => t(`contentStudio.inspector.titleUi.${k}`);
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <MiniNumber label={tk('x1')} min={0} max={1} step={0.005} value={layer.x1} onChange={(x1) => patch({ x1 })} />
        <MiniNumber label={tk('y1')} min={0} max={1} step={0.005} value={layer.y1} onChange={(y1) => patch({ y1 })} />
        <MiniNumber label={tk('x2')} min={0} max={1} step={0.005} value={layer.x2} onChange={(x2) => patch({ x2 })} />
        <MiniNumber label={tk('y2')} min={0} max={1} step={0.005} value={layer.y2} onChange={(y2) => patch({ y2 })} />
      </div>
      <TitleColorField label={tk('fill')} value={layer.color} onChange={(color) => patch({ color })} />
      <MiniNumber label={tk('thickness')} min={TITLE.lineThicknessPx.min} max={TITLE.lineThicknessPx.max} step={1} value={layer.thicknessPx} onChange={(thicknessPx) => patch({ thicknessPx })} />
    </div>
  );
};

/**
 * Title section (part 16): layer list (add/reorder/delete, ≤8) + per-layer
 * controls for every StudioTitle contract field. Array order = draw order
 * (bottom first), matching the raster and the export chain.
 */
const TitleSection: React.FC<{ clip: StudioClip }> = ({ clip }) => {
  const { t } = useLocalization('interface');
  const addTitleLayer = useStudioStore((s) => s.addTitleLayer);
  const removeTitleLayer = useStudioStore((s) => s.removeTitleLayer);
  const moveTitleLayer = useStudioStore((s) => s.moveTitleLayer);
  const layers = clip.title?.layers ?? [];
  const tk = (k: string) => t(`contentStudio.inspector.titleUi.${k}`);
  const layerLabel = (l: StudioTitleLayer) =>
    l.type === 'text' ? tk('layerText') : l.type === 'rect' ? tk('layerRect') : tk('layerLine');

  return (
    <Section
      title={t('contentStudio.inspector.sectionTitle')}
      icon={<Type className="w-3.5 h-3.5" />}
      action={
        <Select
          value=""
          onValueChange={(v) => {
            addTitleLayer(clip.id, v as StudioTitleLayer['type']);
            editSummary.increment('uiInvocations');
          }}
        >
          <SelectTrigger className="h-6 w-auto text-[11px] gap-1 px-2" disabled={layers.length >= TITLE.maxLayers}>
            <Plus className="w-3 h-3" />
            {tk('addLayer')}
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="text" className="text-xs">{tk('layerText')}</SelectItem>
            <SelectItem value="rect" className="text-xs">{tk('layerRect')}</SelectItem>
            <SelectItem value="line" className="text-xs">{tk('layerLine')}</SelectItem>
          </SelectContent>
        </Select>
      }
    >
      <div className="space-y-2">
        {layers.map((layer, i) => (
          <div key={i} className="rounded-md border border-border p-2">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-[11px] font-medium text-card-foreground flex-1">
                {layerLabel(layer)}
              </span>
              <Button size="icon" variant="ghost" className="h-6 w-6" disabled={i === 0} onClick={() => moveTitleLayer(clip.id, i, i - 1)} title={tk('moveUp')}>
                <ArrowUp className="w-3 h-3" />
              </Button>
              <Button size="icon" variant="ghost" className="h-6 w-6" disabled={i === layers.length - 1} onClick={() => moveTitleLayer(clip.id, i, i + 1)} title={tk('moveDown')}>
                <ArrowDown className="w-3 h-3" />
              </Button>
              <Button size="icon" variant="ghost" className="h-6 w-6 text-destructive" disabled={layers.length <= 1} onClick={() => removeTitleLayer(clip.id, i)} title={tk('remove')}>
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
            {layer.type === 'text' && <TitleTextLayerControls clip={clip} index={i} layer={layer} />}
            {layer.type === 'rect' && <TitleRectLayerControls clip={clip} index={i} layer={layer} />}
            {layer.type === 'line' && <TitleLineLayerControls clip={clip} index={i} layer={layer} />}
          </div>
        ))}
      </div>
    </Section>
  );
};

// --- Text overlays (existing) ------------------------------------------------

const TextSection: React.FC<{ clip: StudioClip }> = ({ clip }) => {
  const { t } = useLocalization('interface');
  const addTextOverlay = useStudioStore((s) => s.addTextOverlay);
  const updateTextOverlay = useStudioStore((s) => s.updateTextOverlay);
  const removeTextOverlay = useStudioStore((s) => s.removeTextOverlay);
  // Text/color edits batch per focus session — one undo entry, not one per
  // keystroke. Only one field is focused at a time, so one gesture suffices.
  const gesture = useUndoGesture();
  return (
    <Section
      title={t('contentStudio.inspector.sectionText')}
      icon={<Type className="w-3.5 h-3.5" />}
      defaultOpen={false}
      action={
        <Button size="sm" variant="ghost" className="h-6 text-[11px]" onClick={() => addTextOverlay(clip.id)}>
          <Plus className="w-3 h-3 mr-1" />
          {t('contentStudio.inspector.addText')}
        </Button>
      }
    >
      <div className="space-y-3">
        {(clip.textOverlays ?? []).map((ov) => (
          <div key={ov.id} className="rounded-md border border-border p-2 space-y-2">
            <div className="flex items-center gap-2">
              <Input className="h-7 text-xs" value={ov.text} placeholder={t('contentStudio.inspector.textPlaceholder')} onFocus={gesture.begin} onBlur={gesture.end} onChange={(e) => updateTextOverlay(clip.id, ov.id, { text: e.target.value })} />
              <input type="color" className="h-7 w-7 shrink-0 rounded border border-border bg-transparent" value={ov.color} onFocus={gesture.begin} onBlur={gesture.end} onChange={(e) => updateTextOverlay(clip.id, ov.id, { color: e.target.value })} />
              <Button size="icon" variant="ghost" className="h-7 w-7 shrink-0 text-destructive" onClick={() => removeTextOverlay(clip.id, ov.id)}>
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <MiniNumber label={t('contentStudio.inspector.posX')} min={0} max={1} step={0.01} value={ov.x} onChange={(x) => updateTextOverlay(clip.id, ov.id, { x })} />
              <MiniNumber label={t('contentStudio.inspector.posY')} min={0} max={1} step={0.01} value={ov.y} onChange={(y) => updateTextOverlay(clip.id, ov.id, { y })} />
              <MiniNumber label={t('contentStudio.inspector.size')} min={8} max={200} step={1} value={ov.fontSize} onChange={(fontSize) => updateTextOverlay(clip.id, ov.id, { fontSize })} />
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
};

const MiniNumber: React.FC<{ label: string; min: number; max: number; step: number; value: number; onChange: (v: number) => void }> = ({
  label, min, max, step, value, onChange,
}) => {
  const gesture = useUndoGesture();
  return (
    <div>
      <Label className="text-[10px] text-muted-foreground flex justify-between">
        <span>{label}</span>
        <span className="tabular-nums">{value.toFixed(2)}</span>
      </Label>
      <Slider
        className="mt-1"
        min={min}
        max={max}
        step={step}
        value={[value]}
        onValueChange={(v) => {
          gesture.begin();
          onChange(v[0] ?? value);
        }}
        onValueCommit={gesture.end}
      />
    </div>
  );
};

export default ClipInspector;
