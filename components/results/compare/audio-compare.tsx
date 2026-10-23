'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import { Segmented } from '@/components/darkroom/segmented';
import { useLocalization } from '@/i18n/useLocalization';
import { decodePeaks, drawPeaks } from '@/lib/results/peaks';
import { cn } from '@/lib/utils';
import type { CompareViewProps } from './types';

const BUCKETS = 240;

/** Peaks canvas for one side; decorative, any failure leaves it blank. */
function Peaks({ src, label, className }: { src: string; label: string; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    let cancelled = false;
    void decodePeaks(src, BUCKETS).then((peaks) => {
      const canvas = ref.current;
      if (cancelled || !peaks || !canvas) return;
      drawPeaks(canvas, peaks, getComputedStyle(canvas).color || '#8aa');
    });
    return () => {
      cancelled = true;
    };
  }, [src]);
  return <canvas ref={ref} width={960} height={96} role="img" aria-label={label} className={cn('w-full text-data', className)} />;
}

const fmt = (s: number) => {
  const t = Number.isFinite(s) && s > 0 ? Math.floor(s) : 0;
  return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`;
};

/**
 * Audio A/B. Two hidden `<audio>` elements play together; the `A | B` control only changes
 * which one is unmuted, so the switch is gapless and both always share one position.
 */
export function AudioCompare({ original, result }: CompareViewProps) {
  const { t } = useLocalization('interface');
  const name = useId();
  const refA = useRef<HTMLAudioElement>(null);
  const refB = useRef<HTMLAudioElement>(null);
  const [active, setActive] = useState<'a' | 'b'>('b');
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Mute the inactive side, never pause it.
  useEffect(() => {
    if (refA.current) refA.current.muted = active !== 'a';
    if (refB.current) refB.current.muted = active !== 'b';
  }, [active]);

  const safe = (fn: () => unknown) => {
    try {
      const r = fn();
      if (r instanceof Promise) r.catch(() => undefined);
    } catch {
      // autoplay policy or jsdom; the next gesture retries
    }
  };

  const toggle = useCallback(() => {
    const a = refA.current;
    const b = refB.current;
    if (!a || !b) return;
    if (playing) {
      safe(() => a.pause());
      safe(() => b.pause());
      setPlaying(false);
    } else {
      b.currentTime = a.currentTime;
      safe(() => a.play());
      safe(() => b.play());
      setPlaying(true);
    }
  }, [playing]);

  const seek = (value: number) => {
    if (!Number.isFinite(value)) return;
    if (refA.current) refA.current.currentTime = value;
    if (refB.current) refB.current.currentTime = value;
    setTime(value);
  };

  // The audible element is the clock; the other is nudged when it drifts past 80 ms.
  const onTimeUpdate = (which: 'a' | 'b') => {
    if (which !== active) return;
    const clock = which === 'a' ? refA.current : refB.current;
    const other = which === 'a' ? refB.current : refA.current;
    if (!clock) return;
    setTime(clock.currentTime);
    if (other && Math.abs(other.currentTime - clock.currentTime) > 0.08) other.currentTime = clock.currentTime;
  };
  const onEnded = () => {
    safe(() => refA.current?.pause());
    safe(() => refB.current?.pause());
    setPlaying(false);
  };
  const onMeta = () => {
    const d = [refA.current?.duration, refB.current?.duration].find((v) => v !== undefined && Number.isFinite(v) && v > 0);
    setDuration(d ?? 0);
  };

  const activeSide = active === 'a' ? original : result;
  const otherSide = active === 'a' ? result : original;
  const sideLabel = (k: 'a' | 'b') => (k === 'a' ? t('resultPanel.original') : t('resultPanel.result'));

  return (
    <div className="w-full max-w-3xl space-y-4 rounded-lg border border-edge bg-surface-2 p-4 sm:p-6" data-compare-mode="ab">
      <audio ref={refA} src={original.src} muted={active !== 'a'} preload="auto" onTimeUpdate={() => onTimeUpdate('a')} onLoadedMetadata={onMeta} onEnded={() => active === 'a' && onEnded()} />
      <audio ref={refB} src={result.src} muted={active !== 'b'} preload="auto" onTimeUpdate={() => onTimeUpdate('b')} onLoadedMetadata={onMeta} onEnded={() => active === 'b' && onEnded()} />
      <div className="flex flex-wrap items-center gap-3">
        <Segmented
          name={`${name}-ab`}
          label={t('resultPanel.compareModes.audibleLabel')}
          value={active}
          onValueChange={setActive}
          options={[
            { value: 'a', label: `${t('resultPanel.compareModes.a')} · ${sideLabel('a')}` },
            { value: 'b', label: `${t('resultPanel.compareModes.b')} · ${sideLabel('b')}` },
          ]}
          className="w-72"
        />
      </div>
      <div data-testid="peaks-active">
        <Peaks
          src={activeSide.src}
          label={active === 'a' ? t('resultPanel.compareModes.audioOriginal') : t('resultPanel.compareModes.audioResult')}
          className="h-24"
        />
      </div>
      <div data-testid="peaks-other">
        <Peaks src={otherSide.src} label={t('resultPanel.compareModes.otherPeaks')} className="h-8 opacity-50" />
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? t('resultPanel.compareModes.pause') : t('resultPanel.compareModes.play')}
          className="inline-flex size-11 items-center justify-center rounded-md border border-edge text-foreground transition-colors hover:bg-surface-3 focus-visible:outline-2 focus-visible:outline-primary"
        >
          {playing ? <Pause aria-hidden="true" className="size-4" /> : <Play aria-hidden="true" className="size-4" />}
        </button>
        <input
          type="range"
          min={0}
          max={duration || 0}
          step="any"
          value={Math.min(time, duration || 0)}
          onChange={(e) => seek(Number(e.currentTarget.value))}
          disabled={!duration}
          aria-label={t('resultPanel.compareModes.seek')}
          aria-valuetext={`${fmt(time)} / ${fmt(duration)}`}
          className="min-w-32 flex-1"
        />
        <span className="num text-sm text-muted-foreground">
          {fmt(time)} / {fmt(duration)}
        </span>
      </div>
    </div>
  );
}

export default AudioCompare;
