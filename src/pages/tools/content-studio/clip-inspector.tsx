import React from 'react';
import { Sparkles, Plus, Trash2, Type } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useLocalization } from '@/i18n/useLocalization';
import { useStudioStore } from '@/lib/studioStore';
import type { StudioClip, StudioTrack } from '@/lib/studioTypes';

const DEFAULT_ADJUSTMENTS = { brightness: 0, contrast: 1, saturation: 1 };

/**
 * Clip inspector — Phase 5 effects for the single selected clip: cross-dissolve
 * duration, color adjustments, and text/location overlays. Hidden unless
 * exactly one clip is selected.
 */
const ClipInspector: React.FC = () => {
  const { t } = useLocalization('interface');
  const project = useStudioStore((s) => s.project);
  const selectedClipIds = useStudioStore((s) => s.selectedClipIds);
  const setClipTransition = useStudioStore((s) => s.setClipTransition);
  const setClipAdjustments = useStudioStore((s) => s.setClipAdjustments);
  const addTextOverlay = useStudioStore((s) => s.addTextOverlay);
  const updateTextOverlay = useStudioStore((s) => s.updateTextOverlay);
  const removeTextOverlay = useStudioStore((s) => s.removeTextOverlay);

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
  const hasPrev = track.clips.some((c) => c.id !== clip.id && c.timelineStart < clip.timelineStart);

  return (
    <div className="bg-card sci-fi-frame-inner p-4 h-full overflow-y-auto">
      <h2 className="text-sm font-semibold text-card-foreground mb-3 flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-blue-500" />
        {t('contentStudio.inspector.title')}
      </h2>

      {/* Cross-dissolve */}
      <section className="mb-4">
        <Label className="text-xs">
          {t('contentStudio.inspector.transition')} · {(clip.transitionInSeconds ?? 0).toFixed(1)}s
        </Label>
        <Slider
          className="mt-2"
          min={0}
          max={4}
          step={0.1}
          disabled={!hasPrev}
          value={[clip.transitionInSeconds ?? 0]}
          onValueChange={(v) => setClipTransition(clip.id, v[0] ?? 0)}
        />
        {!hasPrev && <p className="text-[11px] text-muted-foreground mt-1">{t('contentStudio.inspector.transitionNoPrev')}</p>}
      </section>

      {isVideo && (
        <>
          {/* Color */}
          <section className="mb-4">
            <div className="flex items-center justify-between">
              <Label className="text-xs">{t('contentStudio.inspector.color')}</Label>
              {clip.adjustments ? (
                <Button size="sm" variant="ghost" className="h-6 text-xs" onClick={() => setClipAdjustments(clip.id, undefined)}>
                  {t('contentStudio.inspector.removeColor')}
                </Button>
              ) : (
                <Button size="sm" variant="ghost" className="h-6 text-xs" onClick={() => setClipAdjustments(clip.id, { ...DEFAULT_ADJUSTMENTS })}>
                  <Plus className="w-3 h-3 mr-1" />
                  {t('contentStudio.inspector.addColor')}
                </Button>
              )}
            </div>
            {clip.adjustments && (
              <div className="mt-2 space-y-3">
                <ColorSlider
                  label={t('contentStudio.inspector.brightness')}
                  min={-1}
                  max={1}
                  step={0.05}
                  value={clip.adjustments.brightness}
                  onChange={(brightness) => setClipAdjustments(clip.id, { ...clip.adjustments!, brightness })}
                />
                <ColorSlider
                  label={t('contentStudio.inspector.contrast')}
                  min={0}
                  max={2}
                  step={0.05}
                  value={clip.adjustments.contrast}
                  onChange={(contrast) => setClipAdjustments(clip.id, { ...clip.adjustments!, contrast })}
                />
                <ColorSlider
                  label={t('contentStudio.inspector.saturation')}
                  min={0}
                  max={2}
                  step={0.05}
                  value={clip.adjustments.saturation}
                  onChange={(saturation) => setClipAdjustments(clip.id, { ...clip.adjustments!, saturation })}
                />
              </div>
            )}
          </section>

          {/* Text overlays */}
          <section>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-xs flex items-center gap-1">
                <Type className="w-3 h-3" />
                {t('contentStudio.inspector.text')}
              </Label>
              <Button size="sm" variant="ghost" className="h-6 text-xs" onClick={() => addTextOverlay(clip.id)}>
                <Plus className="w-3 h-3 mr-1" />
                {t('contentStudio.inspector.addText')}
              </Button>
            </div>
            <div className="space-y-3">
              {(clip.textOverlays ?? []).map((ov) => (
                <div key={ov.id} className="rounded-md border border-border p-2 space-y-2">
                  <div className="flex items-center gap-2">
                    <Input
                      className="h-7 text-xs"
                      value={ov.text}
                      placeholder={t('contentStudio.inspector.textPlaceholder')}
                      onChange={(e) => updateTextOverlay(clip.id, ov.id, { text: e.target.value })}
                    />
                    <input
                      type="color"
                      className="h-7 w-7 shrink-0 rounded border border-border bg-transparent"
                      value={ov.color}
                      onChange={(e) => updateTextOverlay(clip.id, ov.id, { color: e.target.value })}
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 shrink-0 text-destructive"
                      onClick={() => removeTextOverlay(clip.id, ov.id)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <MiniSlider label={t('contentStudio.inspector.posX')} min={0} max={1} step={0.01} value={ov.x} onChange={(x) => updateTextOverlay(clip.id, ov.id, { x })} />
                    <MiniSlider label={t('contentStudio.inspector.posY')} min={0} max={1} step={0.01} value={ov.y} onChange={(y) => updateTextOverlay(clip.id, ov.id, { y })} />
                    <MiniSlider label={t('contentStudio.inspector.size')} min={8} max={200} step={1} value={ov.fontSize} onChange={(fontSize) => updateTextOverlay(clip.id, ov.id, { fontSize })} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
};

const ColorSlider: React.FC<{ label: string; min: number; max: number; step: number; value: number; onChange: (v: number) => void }> = ({
  label,
  min,
  max,
  step,
  value,
  onChange,
}) => (
  <div>
    <Label className="text-[11px] text-muted-foreground flex justify-between">
      <span>{label}</span>
      <span className="tabular-nums">{value.toFixed(2)}</span>
    </Label>
    <Slider className="mt-1" min={min} max={max} step={step} value={[value]} onValueChange={(v) => onChange(v[0] ?? value)} />
  </div>
);

const MiniSlider: React.FC<{ label: string; min: number; max: number; step: number; value: number; onChange: (v: number) => void }> = ({
  label,
  min,
  max,
  step,
  value,
  onChange,
}) => (
  <div>
    <Label className="text-[10px] text-muted-foreground">{label}</Label>
    <Slider className="mt-1" min={min} max={max} step={step} value={[value]} onValueChange={(v) => onChange(v[0] ?? value)} />
  </div>
);

export default ClipInspector;
