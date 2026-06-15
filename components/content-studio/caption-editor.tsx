'use client';

import React from 'react';
import { Captions, Scissors, Merge, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLocalization } from '@/i18n/useLocalization';
import { useStudioStore } from '@/lib/studioStore';
import { DEFAULT_CAPTION_STYLE, type StudioCaptionStyle } from '@/lib/studioTypes';

/**
 * Caption editor — replaces the clip inspector when a caption cue is selected.
 * Edits the cue (text/timing, split/merge/delete) and the project-level caption
 * style.
 */
const CaptionEditor: React.FC = () => {
  const { t } = useLocalization('interface');
  const project = useStudioStore((s) => s.project);
  const selectedCaptionId = useStudioStore((s) => s.selectedCaptionId);
  const playhead = useStudioStore((s) => s.playhead);
  const updateCaption = useStudioStore((s) => s.updateCaption);
  const removeCaption = useStudioStore((s) => s.removeCaption);
  const splitCaption = useStudioStore((s) => s.splitCaption);
  const mergeCaptionWithNext = useStudioStore((s) => s.mergeCaptionWithNext);
  const selectCaption = useStudioStore((s) => s.selectCaption);
  const setCaptionStyle = useStudioStore((s) => s.setCaptionStyle);

  const cue = project?.captions.find((c) => c.id === selectedCaptionId) ?? null;
  const style: StudioCaptionStyle = project?.captionStyle ?? { ...DEFAULT_CAPTION_STYLE };

  if (!cue) return null;

  return (
    <div className="bg-card sci-fi-frame-inner p-4 h-full overflow-y-auto">
      <h2 className="text-sm font-semibold text-card-foreground mb-3 flex items-center gap-2">
        <Captions className="w-4 h-4 text-purple-400" />
        {t('contentStudio.captions.editorTitle')}
      </h2>

      <section className="mb-4 space-y-2">
        <Label className="text-xs">{t('contentStudio.captions.text')}</Label>
        <textarea
          className="w-full min-h-[64px] rounded-md border border-border bg-background/60 p-2 text-xs"
          value={cue.text}
          maxLength={500}
          onChange={(e) => updateCaption(cue.id, { text: e.target.value })}
        />
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-[11px] text-muted-foreground">{t('contentStudio.captions.start')}</Label>
            <Input
              type="number"
              step={0.1}
              min={0}
              className="h-7 text-xs"
              value={cue.startSeconds.toFixed(2)}
              onChange={(e) => updateCaption(cue.id, { startSeconds: parseFloat(e.target.value) || 0 })}
            />
          </div>
          <div>
            <Label className="text-[11px] text-muted-foreground">{t('contentStudio.captions.end')}</Label>
            <Input
              type="number"
              step={0.1}
              min={0}
              className="h-7 text-xs"
              value={cue.endSeconds.toFixed(2)}
              onChange={(e) => updateCaption(cue.id, { endSeconds: parseFloat(e.target.value) || 0 })}
            />
          </div>
        </div>
        <div className="flex items-center gap-2 pt-1">
          <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => splitCaption(cue.id, playhead)}>
            <Scissors className="w-3.5 h-3.5 mr-1" />
            {t('contentStudio.captions.split')}
          </Button>
          <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => mergeCaptionWithNext(cue.id)}>
            <Merge className="w-3.5 h-3.5 mr-1" />
            {t('contentStudio.captions.merge')}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-7 text-xs text-destructive ml-auto"
            onClick={() => {
              removeCaption(cue.id);
              selectCaption(null);
            }}
          >
            <Trash2 className="w-3.5 h-3.5 mr-1" />
            {t('contentStudio.captions.delete')}
          </Button>
        </div>
      </section>

      <section className="space-y-3 border-t border-border pt-3">
        <Label className="text-xs font-semibold">{t('contentStudio.captions.style')}</Label>

        <StyleSlider
          label={t('contentStudio.captions.fontSize')}
          readout={`${style.fontSizePct.toFixed(1)}%`}
          min={1}
          max={15}
          step={0.1}
          value={style.fontSizePct}
          onChange={(fontSizePct) => setCaptionStyle({ fontSizePct })}
        />

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Label className="text-[11px] text-muted-foreground">{t('contentStudio.captions.color')}</Label>
            <input type="color" className="h-7 w-9 rounded border border-border bg-transparent" value={style.color} onChange={(e) => setCaptionStyle({ color: e.target.value })} />
          </div>
          <div className="flex items-center gap-2">
            <Label className="text-[11px] text-muted-foreground">{t('contentStudio.captions.background')}</Label>
            <input type="color" className="h-7 w-9 rounded border border-border bg-transparent" value={style.backgroundColor} onChange={(e) => setCaptionStyle({ backgroundColor: e.target.value })} />
          </div>
        </div>

        <StyleSlider
          label={t('contentStudio.captions.bgOpacity')}
          readout={`${Math.round(style.backgroundOpacity * 100)}%`}
          min={0}
          max={1}
          step={0.01}
          value={style.backgroundOpacity}
          onChange={(backgroundOpacity) => setCaptionStyle({ backgroundOpacity })}
        />

        <div>
          <Label className="text-[11px] text-muted-foreground">{t('contentStudio.captions.position')}</Label>
          <Select value={style.position} onValueChange={(v) => setCaptionStyle({ position: v as 'bottom' | 'top' })}>
            <SelectTrigger className="h-7 mt-1 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bottom" className="text-xs">{t('contentStudio.captions.positionBottom')}</SelectItem>
              <SelectItem value="top" className="text-xs">{t('contentStudio.captions.positionTop')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <StyleSlider
          label={t('contentStudio.captions.maxWidth')}
          readout={`${Math.round(style.maxWidthPct)}%`}
          min={40}
          max={100}
          step={1}
          value={style.maxWidthPct}
          onChange={(maxWidthPct) => setCaptionStyle({ maxWidthPct })}
        />
      </section>
    </div>
  );
};

const StyleSlider: React.FC<{ label: string; readout: string; min: number; max: number; step: number; value: number; onChange: (v: number) => void }> = ({
  label, readout, min, max, step, value, onChange,
}) => (
  <div>
    <Label className="text-[11px] text-muted-foreground flex justify-between">
      <span>{label}</span>
      <span className="tabular-nums">{readout}</span>
    </Label>
    <Slider className="mt-1" min={min} max={max} step={step} value={[value]} onValueChange={(v) => onChange(v[0] ?? value)} />
  </div>
);

export default CaptionEditor;
