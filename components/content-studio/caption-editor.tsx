import React from 'react';
import { Captions, Scissors, Merge, Trash2, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLocalization } from '@/i18n/useLocalization';
import { analytics, EVENTS, type StudioCaptionStyleField } from '@/lib/analytics';
import { useAuth } from '@/lib/auth/AuthProvider';
import { cuesHaveWords } from '@/lib/studio/captions/analytics';
import { applyCaptionLook, CAPTION_LOOKS, captionAnimationLocked, captionLookLocked, captionLookModified, type CaptionLook } from '@/lib/studio/captions/captionLooks';
import { CAPTION_FONTS } from '@/lib/studio/captions/units';
import catalog from '@/lib/studio/captions/captionsCatalog.json';
import { studioHost } from '@/lib/studio/telemetry';
import { useStudioStore } from '@/lib/studioStore';
import { DEFAULT_CAPTION_STYLE, STUDIO_CAPTION_ANIMATIONS, type StudioCaptionStyle } from '@/lib/studioTypes';
import { Panel } from '@/components/darkroom/panel';
import { cn } from '@/lib/utils';
import { useUndoGesture } from './useUndoGesture';
import CaptionLookPreview from './caption-look-preview';

const D = catalog.defaults;
const FONT_GROUPS = ['sans', 'display', 'serif', 'mono', 'script', 'fallback'] as const;

/** One studio_caption_style_changed per field per gesture (closed vocabulary, never text). */
function useStyleChangeEvent() {
  const sent = React.useRef<Set<string>>(new Set());
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  React.useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);
  return React.useCallback((field: StudioCaptionStyleField) => {
    if (sent.current.has(field)) return;
    sent.current.add(field);
    // The gesture window: a slider drag or a colour sweep reports once.
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => sent.current.clear(), 1500);
    const p = useStudioStore.getState().project;
    const st = p?.captionStyle;
    analytics.track(
      EVENTS.STUDIO_CAPTION_STYLE_CHANGED,
      { field, animation: st?.animation ?? 'none', lookId: st?.lookId ?? 'none', hasWords: cuesHaveWords(p?.captions), host: studioHost() },
      { feature: 'studio' },
    );
  }, []);
}

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
  const auth = useAuth();
  const signedIn = !!auth && auth.tier !== 'anonymous';
  const reportField = useStyleChangeEvent();
  const setField = React.useCallback(
    (field: StudioCaptionStyleField, patch: Partial<StudioCaptionStyle>) => {
      setCaptionStyle(patch);
      reportField(field);
    },
    [setCaptionStyle, reportField],
  );
  const pickLook = (look: CaptionLook) => {
    if (captionLookLocked(look, signedIn)) {
      auth?.openAuth({ intent: 'signup', source: 'studio_caption_look' });
      return;
    }
    setCaptionStyle(applyCaptionLook(look));
    analytics.track(EVENTS.STUDIO_CAPTION_LOOK_APPLIED, { lookId: look.id, source: 'ui', host: studioHost() }, { feature: 'studio' });
  };
  const pickAnimation = (animation: (typeof STUDIO_CAPTION_ANIMATIONS)[number]) => {
    if (captionAnimationLocked(animation, signedIn)) {
      auth?.openAuth({ intent: 'signup', source: 'studio_caption_animation' });
      return;
    }
    setField('animation', { animation });
  };
  const modified = captionLookModified(style);
  const fontFamily = style.fontFamily ?? D.fontFamily;
  const fontEntry = CAPTION_FONTS.find((f) => f.family === fontFamily);
  // Text/number/color edits batch per focus session into one undo entry; only
  // one field is focused at a time, so a single gesture covers them all.
  const gesture = useUndoGesture();

  if (!cue) return null;

  return (
    <Panel level="2" padding={false} className="p-4 h-full overflow-y-auto">
      <h2 className="text-sm font-semibold text-card-foreground mb-3 flex items-center gap-2">
        <Captions className="w-4 h-4 text-premium" />
        {t('contentStudio.captions.editorTitle')}
      </h2>

      <section className="mb-4 space-y-2">
        <Label className="text-xs">{t('contentStudio.captions.text')}</Label>
        <textarea
          className="w-full min-h-[64px] rounded-md border border-border bg-background/60 p-2 text-xs"
          value={cue.text}
          maxLength={500}
          onFocus={gesture.begin}
          onBlur={gesture.end}
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
              onFocus={gesture.begin}
              onBlur={gesture.end}
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
              onFocus={gesture.begin}
              onBlur={gesture.end}
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

      <section className="space-y-2 border-t border-border pt-3 mb-3" aria-labelledby="caption-looks-label">
        <div className="flex items-center justify-between">
          <Label id="caption-looks-label" className="text-xs font-semibold">{t('contentStudio.captions.looks')}</Label>
          {style.lookId && (
            <span className="text-[10px] text-muted-foreground">
              {t(`contentStudio.captions.look.${style.lookId}`)}{modified ? ` · ${t('contentStudio.captions.lookModified')}` : ''}
            </span>
          )}
        </div>
        <div className="grid grid-cols-3 gap-2" role="group" aria-labelledby="caption-looks-label">
          {CAPTION_LOOKS.map((look) => {
            const locked = captionLookLocked(look, signedIn);
            const name = t(`contentStudio.captions.look.${look.id}`);
            return (
              <button
                key={look.id}
                type="button"
                onClick={() => pickLook(look)}
                className={cn(
                  'relative text-left rounded-md border p-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  style.lookId === look.id ? 'border-premium' : 'border-border hover:border-muted-foreground',
                )}
                aria-pressed={style.lookId === look.id}
                aria-label={locked ? `${name} (${t('contentStudio.captions.signUpToUse')})` : name}
                data-testid={`caption-look-${look.id}`}
              >
                <CaptionLookPreview look={look} label={name} />
                <span className="mt-1 flex items-center gap-1 text-[10px] leading-tight">
                  {locked && <Lock className="w-3 h-3 shrink-0" aria-hidden />}
                  <span className="truncate">{name}</span>
                </span>
              </button>
            );
          })}
        </div>
        {!signedIn && <p className="text-[10px] text-muted-foreground">{t('contentStudio.captions.looksLockedHint')}</p>}
      </section>

      <section className="space-y-3 border-t border-border pt-3">
        <Label className="text-xs font-semibold">{t('contentStudio.captions.style')}</Label>

        <div>
          <Label className="text-[11px] text-muted-foreground">{t('contentStudio.captions.font')}</Label>
          <Select value={fontFamily} onValueChange={(v) => setField('fontFamily', { fontFamily: v })}>
            <SelectTrigger className="h-7 mt-1 text-xs" style={{ fontFamily }}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FONT_GROUPS.map((g) => (
                <SelectGroup key={g}>
                  <SelectLabel className="text-[10px]">{t(`contentStudio.captions.fontGroup.${g}`)}</SelectLabel>
                  {CAPTION_FONTS.filter((f) => f.category === g).map((f) => (
                    <SelectItem key={f.family} value={f.family} className="text-xs">{f.family}</SelectItem>
                  ))}
                </SelectGroup>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-[11px] text-muted-foreground">
            <Switch
              checked={(style.bold ?? D.bold) && !!fontEntry?.bold}
              disabled={!fontEntry?.bold}
              onCheckedChange={(bold) => setField('bold', { bold })}
              aria-label={t('contentStudio.captions.bold')}
            />
            {t('contentStudio.captions.bold')}
          </label>
          <label className="flex items-center gap-2 text-[11px] text-muted-foreground">
            <Switch checked={style.uppercase === true} onCheckedChange={(uppercase) => setField('uppercase', { uppercase })} aria-label={t('contentStudio.captions.uppercase')} />
            {t('contentStudio.captions.uppercase')}
          </label>
        </div>

        <StyleSlider
          label={t('contentStudio.captions.fontSize')}
          readout={`${style.fontSizePct.toFixed(1)}%`}
          min={1}
          max={15}
          step={0.1}
          value={style.fontSizePct}
          onChange={(fontSizePct) => setField('fontSizePct', { fontSizePct })}
        />

        <div>
          <Label className="text-[11px] text-muted-foreground">{t('contentStudio.captions.animation')}</Label>
          <Select value={style.animation ?? 'none'} onValueChange={(v) => pickAnimation(v as (typeof STUDIO_CAPTION_ANIMATIONS)[number])}>
            <SelectTrigger className="h-7 mt-1 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STUDIO_CAPTION_ANIMATIONS.map((a) => (
                <SelectItem key={a} value={a} className="text-xs">
                  <span className="flex items-center gap-1">
                    {captionAnimationLocked(a, signedIn) && <Lock className="w-3 h-3" aria-hidden />}
                    {t(`contentStudio.captions.anim.${a}`)}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {(style.animation ?? 'none') === 'pop' && (
          <StyleSlider
            label={t('contentStudio.captions.animationStrength')}
            readout={`${Math.round((style.animationStrength ?? D.animationStrength) * 100)}%`}
            min={0}
            max={1}
            step={0.05}
            value={style.animationStrength ?? D.animationStrength}
            onChange={(animationStrength) => setField('animationStrength', { animationStrength })}
          />
        )}

        <div>
          <Label className="text-[11px] text-muted-foreground flex justify-between">
            <span>{t('contentStudio.captions.wordsPerGroup')}</span>
            <span className="tabular-nums">{style.wordsPerGroup ?? t('contentStudio.captions.wholeLine')}</span>
          </Label>
          <Select value={String(style.wordsPerGroup ?? 0)} onValueChange={(v) => setField('wordsPerGroup', { wordsPerGroup: v === '0' ? undefined : Number(v) })}>
            <SelectTrigger className="h-7 mt-1 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0" className="text-xs">{t('contentStudio.captions.wholeLine')}</SelectItem>
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <SelectItem key={n} value={String(n)} className="text-xs">{n}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <ColorField label={t('contentStudio.captions.color')} value={style.color} onChange={(color) => setField('color', { color })} gesture={gesture} />
          <ColorField label={t('contentStudio.captions.highlight')} value={style.highlightColor ?? D.highlightColor} onChange={(highlightColor) => setField('highlightColor', { highlightColor })} gesture={gesture} />
          <ColorField label={t('contentStudio.captions.outline')} value={style.outlineColor ?? D.outlineColor} onChange={(outlineColor) => setField('outlineColor', { outlineColor })} gesture={gesture} />
        </div>

        <StyleSlider
          label={t('contentStudio.captions.outlineWidth')}
          readout={`${(style.outlineWidth ?? D.outlineWidth).toFixed(1)} px`}
          min={0}
          max={12}
          step={0.5}
          value={style.outlineWidth ?? D.outlineWidth}
          onChange={(outlineWidth) => setField('outlineWidth', { outlineWidth })}
        />
        <StyleSlider
          label={t('contentStudio.captions.shadow')}
          readout={`${Math.round((style.shadow ?? D.shadow) * 100)}%`}
          min={0}
          max={1}
          step={0.05}
          value={style.shadow ?? D.shadow}
          onChange={(shadow) => setField('shadow', { shadow })}
        />

        <div>
          <Label className="text-[11px] text-muted-foreground">{t('contentStudio.captions.backgroundMode')}</Label>
          <Select value={style.backgroundMode ?? D.backgroundMode} onValueChange={(v) => setField('backgroundMode', { backgroundMode: v as 'box' | 'none' | 'word_box' })}>
            <SelectTrigger className="h-7 mt-1 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="box" className="text-xs">{t('contentStudio.captions.bgBox')}</SelectItem>
              <SelectItem value="word_box" className="text-xs">{t('contentStudio.captions.bgWordBox')}</SelectItem>
              <SelectItem value="none" className="text-xs">{t('contentStudio.captions.bgNone')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {(style.backgroundMode ?? D.backgroundMode) === 'box' && (
          <>
            <ColorField label={t('contentStudio.captions.background')} value={style.backgroundColor} onChange={(backgroundColor) => setField('backgroundColor', { backgroundColor })} gesture={gesture} />
            <StyleSlider
              label={t('contentStudio.captions.bgOpacity')}
              readout={`${Math.round(style.backgroundOpacity * 100)}%`}
              min={0}
              max={1}
              step={0.01}
              value={style.backgroundOpacity}
              onChange={(backgroundOpacity) => setField('backgroundOpacity', { backgroundOpacity })}
            />
          </>
        )}

        <div>
          <Label className="text-[11px] text-muted-foreground">{t('contentStudio.captions.position')}</Label>
          <Select value={style.position} onValueChange={(v) => setField('position', { position: v as 'bottom' | 'middle' | 'top' })}>
            <SelectTrigger className="h-7 mt-1 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bottom" className="text-xs">{t('contentStudio.captions.positionBottom')}</SelectItem>
              <SelectItem value="middle" className="text-xs">{t('contentStudio.captions.positionMiddle')}</SelectItem>
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
          onChange={(maxWidthPct) => setField('maxWidthPct', { maxWidthPct })}
        />
        <p className="text-[10px] text-muted-foreground">{t('contentStudio.captions.burnInOnly')}</p>
      </section>
    </Panel>
  );
};

const ColorField: React.FC<{ label: string; value: string; onChange: (v: string) => void; gesture: ReturnType<typeof useUndoGesture> }> = ({ label, value, onChange, gesture }) => (
  <label className="flex flex-col gap-1 text-[11px] text-muted-foreground">
    {label}
    <input type="color" className="h-7 w-full rounded border border-border bg-transparent" value={value} onFocus={gesture.begin} onBlur={gesture.end} onChange={(e) => onChange(e.target.value.toUpperCase())} />
  </label>
);

const StyleSlider: React.FC<{ label: string; readout: string; min: number; max: number; step: number; value: number; onChange: (v: number) => void }> = ({
  label, readout, min, max, step, value, onChange,
}) => {
  const gesture = useUndoGesture();
  return (
    <div>
      <Label className="text-[11px] text-muted-foreground flex justify-between">
        <span>{label}</span>
        <span className="tabular-nums">{readout}</span>
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

export default CaptionEditor;
