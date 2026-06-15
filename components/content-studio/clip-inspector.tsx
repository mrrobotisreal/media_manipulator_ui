'use client';

import React from 'react';
import {
  Sparkles, Plus, Trash2, Type, ChevronDown, Move, Crop, Blend, Layers,
  Volume2, Pipette, ArrowUp, ArrowDown, RotateCcw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { useLocalization } from '@/i18n/useLocalization';
import { useStudioStore, clipDuration, type StudioAssetEntry } from '@/lib/studioStore';
import {
  TRANSFORM_PARAMS, CROP_PARAMS, effectParams, EFFECT_TYPES, EFFECT_LABEL_KEYS,
  IDENTITY_TRANSFORM, ZERO_CROP, type EffectParam,
} from '@/lib/studio/effectRegistry';
import { requestEyedrop } from '@/lib/studio/eyedropper';
import { trackStudioEffectAdded } from '@/lib/studio/telemetry';
import type {
  StudioClip, StudioTrack, StudioEffect, StudioBlendMode, StudioTransform, StudioCrop,
} from '@/lib/studioTypes';

const DEFAULT_ADJUSTMENTS = { brightness: 0, contrast: 1, saturation: 1 };
const BLEND_MODES: StudioBlendMode[] = ['normal', 'multiply', 'screen', 'overlay', 'lighten', 'darken', 'addition', 'difference'];

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
      <div className="bg-card sci-fi-frame-inner p-4 h-full">
        <h2 className="text-sm font-semibold text-card-foreground mb-2 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-500" />
          {t('contentStudio.inspector.title')}
        </h2>
        <p className="text-xs text-muted-foreground">{t('contentStudio.inspector.none')}</p>
      </div>
    );
  }

  const { clip, track } = found;
  const isVideo = track.kind === 'video';
  const hasAudio = !!assets[clip.assetId]?.asset.hasAudio;
  const lutAssets = Object.values(assets).filter((a) => a.asset.mediaKind === 'lut');

  return (
    <div className="bg-card sci-fi-frame-inner p-4 h-full overflow-y-auto">
      <h2 className="text-sm font-semibold text-card-foreground mb-3 flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-blue-500" />
        {t('contentStudio.inspector.title')}
      </h2>

      {isVideo && (
        <>
          <MotionSection clip={clip} />
          <CropSection clip={clip} />
          <OpacityBlendSection clip={clip} />
          <ColorSection clip={clip} />
          <EffectsSection clip={clip} lutAssets={lutAssets} />
        </>
      )}

      {hasAudio && <AudioSection clip={clip} />}

      <TransitionSection clip={clip} track={track} />

      {isVideo && <TextSection clip={clip} />}
    </div>
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
        <CollapsibleTrigger className="flex items-center gap-1.5 text-xs font-semibold text-card-foreground hover:text-blue-400">
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
}> = ({ param, value, onChange }) => {
  const { t } = useLocalization('interface');
  return (
    <div className="mb-2">
      <div className="flex items-center justify-between gap-2">
        <Label className="text-[11px] text-muted-foreground">{t(param.labelKey)}</Label>
        <Input
          type="number"
          className="h-6 w-16 text-[11px] px-1 text-right"
          min={param.min}
          max={param.max}
          step={param.step}
          value={Number.isFinite(value) ? value : param.default}
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
        onValueChange={(v) => onChange(v[0] ?? value)}
      />
    </div>
  );
};

// --- Motion ------------------------------------------------------------------

const MotionSection: React.FC<{ clip: StudioClip }> = ({ clip }) => {
  const { t } = useLocalization('interface');
  const setClipTransform = useStudioStore((s) => s.setClipTransform);
  const tf: StudioTransform = clip.transform ?? { ...IDENTITY_TRANSFORM };
  const update = (key: keyof StudioTransform, v: number) => setClipTransform(clip.id, { ...tf, [key]: v });
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
        <ParamSlider key={p.key} param={p} value={(tf as Record<string, number>)[p.key]} onChange={(v) => update(p.key as keyof StudioTransform, v)} />
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
  const opacity = clip.opacity ?? 1;
  return (
    <Section title={t('contentStudio.inspector.sectionOpacityBlend')} icon={<Blend className="w-3.5 h-3.5" />} defaultOpen={false}>
      <div className="mb-3">
        <Label className="text-[11px] text-muted-foreground flex justify-between">
          <span>{t('contentStudio.inspector.opacity')}</span>
          <span className="tabular-nums">{Math.round(opacity * 100)}%</span>
        </Label>
        <Slider className="mt-1" min={0} max={1} step={0.01} value={[opacity]} onValueChange={(v) => updateClip(clip.id, { opacity: v[0] ?? 1 })} />
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
            trackStudioEffectAdded(v);
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
  clipId: string;
  effect: StudioEffect;
  index: number;
  count: number;
  lutAssets: StudioAssetEntry[];
  onRemove: () => void;
  onToggle: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}> = ({ clipId, effect, index, count, lutAssets, onRemove, onToggle, onMoveUp, onMoveDown }) => {
  const { t } = useLocalization('interface');
  const updateEffect = useStudioStore((s) => s.updateEffect);

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
        effectParams('lumetri').map((p) => (
          <ParamSlider
            key={p.key}
            param={p}
            value={(effect as unknown as Record<string, number>)[p.key]}
            onChange={(v) => updateEffect(clipId, effect.id, { [p.key]: v })}
          />
        ))}

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
  const setVolumeKeyframes = useStudioStore((s) => s.setVolumeKeyframes);
  const volume = clip.volume ?? 1;
  const pan = clip.pan ?? 0;
  const usingKeyframes = (clip.volumeKeyframes?.length ?? 0) > 0;
  const dur = clipDuration(clip);
  const db = volume <= 0 ? '−∞' : (20 * Math.log10(volume)).toFixed(1);

  return (
    <Section title={t('contentStudio.inspector.sectionAudio')} icon={<Volume2 className="w-3.5 h-3.5" />} defaultOpen={false}>
      <div className="mb-3">
        <Label className="text-[11px] text-muted-foreground flex justify-between">
          <span>{t('contentStudio.inspector.audio.volume')}</span>
          <span className="tabular-nums">{db} dB</span>
        </Label>
        <Slider className="mt-1" min={0} max={2} step={0.01} value={[volume]} onValueChange={(v) => setClipVolume(clip.id, v[0] ?? 1)} disabled={usingKeyframes} />
      </div>
      <div className="mb-3">
        <Label className="text-[11px] text-muted-foreground flex justify-between">
          <span>{t('contentStudio.inspector.audio.pan')}</span>
          <span className="tabular-nums">
            {pan === 0 ? 'C' : `${pan < 0 ? t('contentStudio.inspector.audio.panLeft') : t('contentStudio.inspector.audio.panRight')} ${Math.round(Math.abs(pan) * 100)}`}
          </span>
        </Label>
        <Slider className="mt-1" min={-1} max={1} step={0.01} value={[pan]} onValueChange={(v) => setClipPan(clip.id, v[0] ?? 0)} />
      </div>
      <div className="flex items-center justify-between gap-2">
        <Label className="text-[11px] text-muted-foreground">{t('contentStudio.inspector.audio.useKeyframes')}</Label>
        <Switch
          checked={usingKeyframes}
          onCheckedChange={(on) => {
            if (on) {
              setVolumeKeyframes(clip.id, [
                { t: 0, gain: volume },
                { t: Math.max(0.1, dur), gain: volume },
              ]);
            } else {
              setVolumeKeyframes(clip.id, []);
            }
          }}
        />
      </div>
      {usingKeyframes && <p className="text-[11px] text-muted-foreground mt-1">{t('contentStudio.inspector.audio.keyframeNote')}</p>}
    </Section>
  );
};

// --- Transition (existing) ---------------------------------------------------

const TransitionSection: React.FC<{ clip: StudioClip; track: StudioTrack }> = ({ clip, track }) => {
  const { t } = useLocalization('interface');
  const setClipTransition = useStudioStore((s) => s.setClipTransition);
  const hasPrev = track.clips.some((c) => c.id !== clip.id && c.timelineStart < clip.timelineStart);
  return (
    <Section title={t('contentStudio.inspector.sectionTransition')} icon={<Blend className="w-3.5 h-3.5" />} defaultOpen={false}>
      <Label className="text-[11px] text-muted-foreground">
        {t('contentStudio.inspector.transition')} · {(clip.transitionInSeconds ?? 0).toFixed(1)}s
      </Label>
      <Slider className="mt-2" min={0} max={4} step={0.1} disabled={!hasPrev} value={[clip.transitionInSeconds ?? 0]} onValueChange={(v) => setClipTransition(clip.id, v[0] ?? 0)} />
      {!hasPrev && <p className="text-[11px] text-muted-foreground mt-1">{t('contentStudio.inspector.transitionNoPrev')}</p>}
    </Section>
  );
};

// --- Text overlays (existing) ------------------------------------------------

const TextSection: React.FC<{ clip: StudioClip }> = ({ clip }) => {
  const { t } = useLocalization('interface');
  const addTextOverlay = useStudioStore((s) => s.addTextOverlay);
  const updateTextOverlay = useStudioStore((s) => s.updateTextOverlay);
  const removeTextOverlay = useStudioStore((s) => s.removeTextOverlay);
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
              <Input className="h-7 text-xs" value={ov.text} placeholder={t('contentStudio.inspector.textPlaceholder')} onChange={(e) => updateTextOverlay(clip.id, ov.id, { text: e.target.value })} />
              <input type="color" className="h-7 w-7 shrink-0 rounded border border-border bg-transparent" value={ov.color} onChange={(e) => updateTextOverlay(clip.id, ov.id, { color: e.target.value })} />
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
}) => (
  <div>
    <Label className="text-[10px] text-muted-foreground flex justify-between">
      <span>{label}</span>
      <span className="tabular-nums">{value.toFixed(2)}</span>
    </Label>
    <Slider className="mt-1" min={min} max={max} step={step} value={[value]} onValueChange={(v) => onChange(v[0] ?? value)} />
  </div>
);

export default ClipInspector;
