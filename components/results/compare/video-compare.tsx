'use client';

import { useId, useState, type ReactNode } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { Segmented } from '@/components/darkroom/segmented';
import { Stat } from '@/components/darkroom/stat';
import { useLocalization } from '@/i18n/useLocalization';
import { PLAYBACK_RATES, useSyncedVideos } from '@/lib/results/useSyncedVideos';
import { cn } from '@/lib/utils';
import { CompareSlider } from './compare-slider';
import type { CompareMode } from './types';

export interface VideoCompareProps {
  /** `side_by_side` (default), `wipe` or `toggle`. */
  mode?: Extract<CompareMode, 'side_by_side' | 'wipe' | 'toggle'>;
  /** A: the original / "before" video. Blob, object or inline URL. */
  originalSrc: string;
  /** B: the result / "after" video. Blob, object or inline URL. */
  resultSrc: string;
  /** Known target fps of B (frame interpolation); shown as "target" until B is measured. */
  targetFps?: number | null;
  /** Override the A/B labels (default Original / Result). MM04 passes e.g. Original / Restored. */
  originalLabel?: string;
  resultLabel?: string;
  className?: string;
}

const NOTICE_WIDTH = 3840;
const fmtTime = (s: number) => {
  const t = Number.isFinite(s) && s > 0 ? Math.floor(s) : 0;
  return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`;
};

/**
 * Synced A/B video: two muted `<video>`s, one transport. A is the clock (see
 * `useSyncedVideos`). Takes plain URLs so it works the same for blob and inline-server src.
 */
export function VideoCompare({
  mode = 'side_by_side',
  originalSrc,
  resultSrc,
  targetFps,
  originalLabel,
  resultLabel,
  className,
}: VideoCompareProps) {
  const { t } = useLocalization('interface');
  const name = useId();
  const sync = useSyncedVideos();
  const { state } = sync;
  const [side, setSide] = useState<'original' | 'result'>('result');
  const labelA = originalLabel ?? t('resultPanel.original');
  const labelB = resultLabel ?? t('resultPanel.result');

  const video = (which: 'a' | 'b', extra?: string, hidden?: boolean): ReactNode => (
    <video
      key={which}
      ref={which === 'a' ? sync.refA : sync.refB}
      src={which === 'a' ? originalSrc : resultSrc}
      muted
      playsInline
      preload="auto"
      aria-label={which === 'a' ? t('resultPanel.compareModes.videoOriginal') : t('resultPanel.compareModes.videoResult')}
      className={cn('block max-h-[calc(100dvh-26rem)] w-full bg-surface-0 object-contain', extra)}
      style={hidden ? { visibility: 'hidden' } : undefined}
      data-role={which}
    />
  );

  let stage: ReactNode;
  if (mode === 'wipe') {
    stage = (
      <CompareSlider
        before={video('a', 'h-full')}
        after={video('b', 'h-full')}
        beforeLabel={labelA}
        afterLabel={labelB}
        aspectRatio="16 / 9"
        className="max-h-[calc(100dvh-26rem)]"
      />
    );
  } else if (mode === 'toggle') {
    stage = (
      <div className="space-y-3">
        <Segmented
          name={`${name}-side`}
          label={t('resultPanel.compareModes.label')}
          value={side}
          onValueChange={setSide}
          options={[
            { value: 'original', label: labelA },
            { value: 'result', label: labelB },
          ]}
          className="w-56"
        />
        {/* Both keep playing; the hidden one just is not painted, so position is preserved. */}
        <div className="relative grid">
          <div style={{ gridArea: '1 / 1' }}>{video('a', undefined, side !== 'original')}</div>
          <div style={{ gridArea: '1 / 1' }}>{video('b', undefined, side !== 'result')}</div>
        </div>
      </div>
    );
  } else {
    stage = (
      <div className="grid gap-3 min-[640px]:grid-cols-2">
        <figure className="space-y-1">
          <figcaption className="text-xs text-muted-foreground">{labelA}</figcaption>
          {video('a')}
        </figure>
        <figure className="space-y-1">
          <figcaption className="text-xs text-muted-foreground">{labelB}</figcaption>
          {video('b')}
        </figure>
      </div>
    );
  }

  const fpsA = state.fpsA;
  const fpsB = state.fpsB ?? null;
  const showFps = fpsA !== null || fpsB !== null || !!targetFps;
  const fpsLabel = (v: number) => t('resultPanel.compareModes.fpsValue', { fps: String(v) });
  const iconBtn =
    'inline-flex size-11 items-center justify-center rounded-md border border-edge text-foreground transition-colors hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-primary';

  return (
    <div className={cn('flex w-full flex-col gap-3', className)} data-compare-mode={mode}>
      {showFps && (
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2" data-testid="fps-readout">
          <Stat
            label={`${labelA} · ${t('resultPanel.compareModes.a')}`}
            value={fpsA !== null ? fpsLabel(fpsA) : '—'}
          />
          <span aria-hidden="true" className="text-muted-foreground">&rarr;</span>
          <Stat
            label={`${labelB} · ${t('resultPanel.compareModes.b')}`}
            value={
              fpsB !== null
                ? fpsLabel(fpsB)
                : targetFps
                  ? t('resultPanel.compareModes.fpsTarget', { fps: String(targetFps) })
                  : '—'
            }
            accent={fpsB === null && targetFps ? 'primary' : 'data'}
          />
        </div>
      )}
      {state.maxVideoWidth > NOTICE_WIDTH && (
        <p role="note" className="text-sm text-muted-foreground">
          {t('resultPanel.compareModes.largeNotice')}
        </p>
      )}
      {stage}
      <div
        role="group"
        aria-label={t('resultPanel.compareModes.transport')}
        className="flex flex-wrap items-center gap-2"
        data-testid="video-transport"
      >
        <button
          type="button"
          onClick={sync.toggle}
          aria-label={state.playing ? t('resultPanel.compareModes.pause') : t('resultPanel.compareModes.play')}
          className={iconBtn}
        >
          {state.playing ? <Pause aria-hidden="true" className="size-4" /> : <Play aria-hidden="true" className="size-4" />}
        </button>
        <button type="button" onClick={() => sync.stepFrame(-1)} aria-label={t('resultPanel.compareModes.prevFrame')} className={iconBtn}>
          <ChevronLeft aria-hidden="true" className="size-4" />
        </button>
        <button type="button" onClick={() => sync.stepFrame(1)} aria-label={t('resultPanel.compareModes.nextFrame')} className={iconBtn}>
          <ChevronRight aria-hidden="true" className="size-4" />
        </button>
        <input
          type="range"
          min={0}
          max={state.duration || 0}
          step="any"
          value={Math.min(state.currentTime, state.duration || 0)}
          onChange={(e) => sync.seek(Number(e.currentTarget.value))}
          aria-label={t('resultPanel.compareModes.seek')}
          aria-valuetext={`${fmtTime(state.currentTime)} / ${fmtTime(state.duration)}`}
          disabled={!state.duration}
          className="min-w-32 flex-1 accent-[var(--accent-primary,currentColor)]"
        />
        <span className="num text-sm text-muted-foreground">
          {fmtTime(state.currentTime)} / {fmtTime(state.duration)}
        </span>
        <Segmented
          name={`${name}-rate`}
          label={t('resultPanel.compareModes.rate')}
          value={String(state.rate)}
          onValueChange={(v) => sync.setRate(Number(v))}
          options={PLAYBACK_RATES.map((r) => ({ value: String(r), label: `${r}×` }))}
          className="w-52"
        />
        <button
          type="button"
          aria-pressed={state.soundOn}
          aria-label={state.soundOn ? t('resultPanel.compareModes.mute') : t('resultPanel.compareModes.unmute')}
          onClick={sync.toggleSound}
          className={iconBtn}
        >
          {state.soundOn ? <Volume2 aria-hidden="true" className="size-4" /> : <VolumeX aria-hidden="true" className="size-4" />}
        </button>
      </div>
    </div>
  );
}

export default VideoCompare;
