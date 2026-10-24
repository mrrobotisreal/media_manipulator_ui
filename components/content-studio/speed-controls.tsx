'use client';

import React from 'react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import { useLocalization } from '@/i18n/useLocalization';
import { useStudioStore } from '@/lib/studioStore';
import { STUDIO_V3_RANGES } from '@/lib/studio/effectRegistry';
import { clipSpeed, clipTimelineDuration, isFreezeClip, isReversed, maintainsPitch } from '@/lib/studio/speed';
import { speedDialog } from '@/lib/studio/speedDialog';
import { editSummary } from '@/lib/studio/telemetry';
import { useReverseProxy } from '@/lib/useStudioAsset';
import type { StudioClip } from '@/lib/studioTypes';
import { useUndoGesture } from './useUndoGesture';

/** Slider position <-> speed: logarithmic so 10%–1000% reads evenly around 100%. */
const SLIDER_MAX = 1000;
const LOG_MIN = Math.log(STUDIO_V3_RANGES.speed.min);
const LOG_MAX = Math.log(STUDIO_V3_RANGES.speed.max);
export const speedToSlider = (speed: number): number =>
  Math.round(((Math.log(Math.max(STUDIO_V3_RANGES.speed.min, speed)) - LOG_MIN) / (LOG_MAX - LOG_MIN)) * SLIDER_MAX);
export const sliderToSpeed = (pos: number): number =>
  Math.exp(LOG_MIN + (pos / SLIDER_MAX) * (LOG_MAX - LOG_MIN));

/** Speed actions with the cross-cutting concerns attached: telemetry + clamp feedback. */
export function useSpeedActions(clip: StudioClip) {
  const { t } = useLocalization('interface');
  const reverseProxy = useReverseProxy();

  const surfaceClamp = React.useCallback(
    (plan: { clamped: boolean; reason?: string } | null) => {
      if (!plan?.clamped) return;
      toast.message(t(`contentStudio.speed.clamp.${plan.reason ?? 'range'}`));
    },
    [t],
  );

  const setSpeed = React.useCallback(
    (speed: number) => {
      editSummary.increment('speedChanges');
      editSummary.increment('uiInvocations');
      const plan = useStudioStore.getState().setClipSpeed(clip.id, speed);
      surfaceClamp(plan);
    },
    [clip.id, surfaceClamp],
  );

  const setDuration = React.useCallback(
    (seconds: number) => {
      editSummary.increment('speedChanges');
      editSummary.increment('uiInvocations');
      const plan = useStudioStore.getState().setClipDuration(clip.id, seconds);
      if (plan && 'clamped' in plan && plan.clamped) {
        toast.message(t(`contentStudio.speed.clamp.${'reason' in plan && plan.reason ? plan.reason : 'neighbor'}`));
      }
    },
    [clip.id, t],
  );

  const setReverse = React.useCallback(
    (on: boolean) => {
      editSummary.increment('speedChanges');
      editSummary.increment('uiInvocations');
      useStudioStore.getState().setClipReverse(clip.id, on);
      if (on) void reverseProxy.request(clip.assetId);
    },
    [clip.id, clip.assetId, reverseProxy],
  );

  const setPitch = React.useCallback(
    (maintain: boolean) => {
      editSummary.increment('speedChanges');
      editSummary.increment('uiInvocations');
      useStudioStore.getState().setClipMaintainPitch(clip.id, maintain);
    },
    [clip.id],
  );

  return { setSpeed, setDuration, setReverse, setPitch, reverseAvailable: reverseProxy.available };
}

const round = (v: number, dp: number): number => {
  const f = 10 ** dp;
  return Math.round(v * f) / f;
};

/**
 * The speed form shared by the inspector section and the Speed/Duration
 * dialog: speed % (slider + field), computed duration (editing it back-solves
 * speed), Reverse, Maintain audio pitch. Freeze clips get only a duration.
 */
export const SpeedControls: React.FC<{ clip: StudioClip; hasAudio: boolean }> = ({ clip, hasAudio }) => {
  const { t } = useLocalization('interface');
  const actions = useSpeedActions(clip);
  const gesture = useUndoGesture();
  const frozen = isFreezeClip(clip);
  const speed = clipSpeed(clip);
  const duration = clipTimelineDuration(clip);
  const range = STUDIO_V3_RANGES.speed;

  // Draft text so partially typed numbers don't fight the controlled value.
  const [speedText, setSpeedText] = React.useState<string | null>(null);
  const [durText, setDurText] = React.useState<string | null>(null);

  const commitSpeed = (text: string) => {
    const v = parseFloat(text);
    if (Number.isFinite(v) && v > 0) actions.setSpeed(v / 100);
    setSpeedText(null);
  };
  const commitDuration = (text: string) => {
    const v = parseFloat(text);
    if (Number.isFinite(v) && v > 0) actions.setDuration(v);
    setDurText(null);
  };

  return (
    <div data-testid="speed-controls">
      {!frozen && (
        <div className="mb-3">
          <Label className="text-[11px] text-muted-foreground flex items-center justify-between gap-2">
            <span>{t('contentStudio.speed.speed')}</span>
            <span className="flex items-center gap-1">
              <Input
                type="number"
                aria-label={t('contentStudio.speed.speedPercent')}
                className="h-6 w-20 text-[11px] px-1 text-right"
                min={range.min * 100}
                max={range.max * 100}
                step={5}
                value={speedText ?? String(round(speed * 100, 1))}
                onFocus={gesture.begin}
                onChange={(e) => setSpeedText(e.target.value)}
                onBlur={(e) => {
                  commitSpeed(e.target.value);
                  gesture.end();
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
                }}
              />
              <span className="text-[11px]">%</span>
            </span>
          </Label>
          <Slider
            className="mt-2"
            aria-label={t('contentStudio.speed.speed')}
            min={0}
            max={SLIDER_MAX}
            step={1}
            value={[speedToSlider(speed)]}
            onValueChange={(v) => {
              gesture.begin();
              const raw = sliderToSpeed(v[0] ?? 0);
              // Snap to tidy values near 100% so 1x is easy to land on.
              const snapped = Math.abs(raw - 1) < 0.03 ? 1 : round(raw, 2);
              actions.setSpeed(snapped);
            }}
            onValueCommit={gesture.end}
          />
          <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
            <span>{range.min * 100}%</span>
            <span>100%</span>
            <span>{range.max * 100}%</span>
          </div>
        </div>
      )}

      <div className="mb-3">
        <Label className="text-[11px] text-muted-foreground flex items-center justify-between gap-2">
          <span>{t('contentStudio.speed.duration')}</span>
          <span className="flex items-center gap-1">
            <Input
              type="number"
              aria-label={t('contentStudio.speed.durationSeconds')}
              className="h-6 w-20 text-[11px] px-1 text-right"
              min={0.1}
              step={0.1}
              value={durText ?? String(round(duration, 2))}
              onFocus={gesture.begin}
              onChange={(e) => setDurText(e.target.value)}
              onBlur={(e) => {
                commitDuration(e.target.value);
                gesture.end();
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
              }}
            />
            <span className="text-[11px]">{t('contentStudio.speed.secondsUnit')}</span>
          </span>
        </Label>
        <p className="mt-1 text-[10px] text-muted-foreground">
          {frozen ? t('contentStudio.speed.freezeHint') : t('contentStudio.speed.noRippleHint')}
        </p>
      </div>

      {!frozen && (
        <>
          <div className="mb-2 flex items-center justify-between gap-2">
            <Label htmlFor={`rev-${clip.id}`} className="text-[11px] text-muted-foreground">
              {t('contentStudio.speed.reverse')}
            </Label>
            <Switch
              id={`rev-${clip.id}`}
              checked={isReversed(clip)}
              disabled={!actions.reverseAvailable}
              onCheckedChange={actions.setReverse}
            />
          </div>
          {!actions.reverseAvailable && (
            <p className="mb-2 text-[10px] text-muted-foreground">{t('contentStudio.speed.reverseUnavailable')}</p>
          )}
          {hasAudio && (
            <div className="mb-1 flex items-center justify-between gap-2">
              <Label htmlFor={`pitch-${clip.id}`} className="text-[11px] text-muted-foreground">
                {t('contentStudio.speed.maintainPitch')}
              </Label>
              <Switch
                id={`pitch-${clip.id}`}
                checked={maintainsPitch(clip)}
                onCheckedChange={actions.setPitch}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

/** The "Speed/Duration…" dialog, mounted once by the editor. */
export const SpeedDialog: React.FC = () => {
  const { t } = useLocalization('interface');
  const clipId = React.useSyncExternalStore(speedDialog.subscribe, speedDialog.getSnapshot, speedDialog.getSnapshot);
  const project = useStudioStore((s) => s.project);
  const assets = useStudioStore((s) => s.assets);

  let clip: StudioClip | undefined;
  if (clipId && project) {
    for (const tr of project.tracks) {
      clip = tr.clips.find((c) => c.id === clipId) ?? clip;
    }
  }
  const eligible = !!clip && !clip.title && assets[clip.assetId]?.asset.mediaKind !== 'image';
  const hasAudio = !!clip && !!assets[clip.assetId]?.asset.hasAudio && !isFreezeClip(clip);

  return (
    <Dialog open={!!clipId && eligible} onOpenChange={(o) => (o ? undefined : speedDialog.close())}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{t('contentStudio.speed.dialogTitle')}</DialogTitle>
          <DialogDescription>{t('contentStudio.speed.dialogDescription')}</DialogDescription>
        </DialogHeader>
        {clip && eligible && <SpeedControls clip={clip} hasAudio={hasAudio} />}
      </DialogContent>
    </Dialog>
  );
};
