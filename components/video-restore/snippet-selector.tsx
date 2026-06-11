'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Play, Pause, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLocalization } from '@/i18n/useLocalization';

export interface SnippetSelection {
  start: number;
  end: number;
}

interface SnippetSelectorProps {
  file: File;
  maxClipSeconds: number;
  recommendedClipSeconds: number;
  maxFrames: number;
  selection: SnippetSelection;
  onSelectionChange: (selection: SnippetSelection) => void;
  /** Sum of estSecondsPerFrame across the currently selected models. */
  estSecondsPerFrameTotal: number;
  disabled?: boolean;
}

// We can't cheaply measure the real fps in the browser, so the readout
// assumes 30fps and says so. The server re-validates with the probed fps.
const ASSUMED_FPS = 30;
const MIN_WINDOW_SECONDS = 0.5;

const formatClock = (seconds: number): string => {
  const safe = Math.max(0, seconds);
  const mins = Math.floor(safe / 60);
  const secs = safe - mins * 60;
  return `${mins}:${secs.toFixed(1).padStart(4, '0')}`;
};

const parseClock = (raw: string): number | null => {
  const text = raw.trim();
  if (!text) return null;
  const parts = text.split(':');
  if (parts.length > 2) return null;
  let seconds = 0;
  if (parts.length === 2) {
    const mins = Number(parts[0]);
    const secs = Number(parts[1]);
    if (!Number.isFinite(mins) || !Number.isFinite(secs) || mins < 0 || secs < 0) return null;
    seconds = mins * 60 + secs;
  } else {
    const secs = Number(parts[0]);
    if (!Number.isFinite(secs) || secs < 0) return null;
    seconds = secs;
  }
  return seconds;
};

const formatEstimate = (totalSeconds: number): string => {
  if (totalSeconds < 90) return `~${Math.max(1, Math.round(totalSeconds))} sec`;
  if (totalSeconds < 90 * 60) return `~${Math.round(totalSeconds / 60)} min`;
  return `~${(totalSeconds / 3600).toFixed(1)} hr`;
};

type DragMode = 'start' | 'end' | 'window';

// SnippetSelector is the constrained range picker: draggable start/end
// handles (pointer events, so touch works), a grabbable middle that drags the
// whole window, click-to-seek, loop-playback of the selection, ±0.1s nudges,
// and numeric m:ss.t inputs. The window is hard-clamped so
// end − start ≤ maxClipSeconds: dragging one handle past the cap slides the
// opposite handle along instead of stopping dead.
const SnippetSelector: React.FC<SnippetSelectorProps> = ({
  file,
  maxClipSeconds,
  recommendedClipSeconds,
  maxFrames,
  selection,
  onSelectionChange,
  estSecondsPerFrameTotal,
  disabled = false,
}) => {
  const { t } = useLocalization('interface');
  const videoRef = useRef<HTMLVideoElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ mode: DragMode; grabOffset: number } | null>(null);
  const initializedRef = useRef(false);

  const [mediaUrl, setMediaUrl] = useState('');
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setMediaUrl(url);
    initializedRef.current = false;
    setDuration(0);
    setCurrentTime(0);
    setIsPlaying(false);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const clampSelection = useCallback(
    (start: number, end: number): SnippetSelection => {
      const total = duration > 0 ? duration : Number.MAX_SAFE_INTEGER;
      let s = Math.max(0, Math.min(start, total));
      let e = Math.max(0, Math.min(end, total));
      if (e - s < MIN_WINDOW_SECONDS) e = Math.min(total, s + MIN_WINDOW_SECONDS);
      if (e - s < MIN_WINDOW_SECONDS) s = Math.max(0, e - MIN_WINDOW_SECONDS);
      if (e - s > maxClipSeconds) e = s + maxClipSeconds;
      return { start: s, end: e };
    },
    [duration, maxClipSeconds],
  );

  const handleLoadedMetadata = () => {
    const media = videoRef.current;
    if (!media || !Number.isFinite(media.duration)) return;
    setDuration(media.duration);
    if (!initializedRef.current) {
      initializedRef.current = true;
      const end = Math.min(media.duration, recommendedClipSeconds);
      onSelectionChange({ start: 0, end: Math.max(MIN_WINDOW_SECONDS, end) });
    }
  };

  // Loop playback inside the selection.
  const handleTimeUpdate = () => {
    const media = videoRef.current;
    if (!media) return;
    setCurrentTime(media.currentTime);
    if (!media.paused && media.currentTime >= selection.end - 0.05) {
      media.currentTime = selection.start;
    }
  };

  const handlePlayPause = () => {
    const media = videoRef.current;
    if (!media) return;
    if (isPlaying) {
      media.pause();
      return;
    }
    if (media.currentTime < selection.start || media.currentTime >= selection.end - 0.05) {
      media.currentTime = selection.start;
    }
    void media.play();
  };

  const timeFromPointer = (clientX: number): number => {
    const track = timelineRef.current;
    if (!track || duration <= 0) return 0;
    const rect = track.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    return ratio * duration;
  };

  const beginDrag = (e: React.PointerEvent, mode: DragMode) => {
    if (disabled || duration <= 0) return;
    e.stopPropagation();
    e.preventDefault();
    timelineRef.current?.setPointerCapture(e.pointerId);
    const t0 = timeFromPointer(e.clientX);
    dragRef.current = { mode, grabOffset: mode === 'window' ? t0 - selection.start : 0 };
  };

  const handleTrackPointerDown = (e: React.PointerEvent) => {
    if (disabled || duration <= 0) return;
    // Plain press on the track (handles/window stopPropagation): seek.
    const media = videoRef.current;
    if (media) {
      media.currentTime = timeFromPointer(e.clientX);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const drag = dragRef.current;
    if (!drag || duration <= 0) return;
    e.preventDefault();
    const t = timeFromPointer(e.clientX);
    const win = selection.end - selection.start;
    if (drag.mode === 'start') {
      const start = Math.max(0, Math.min(t, selection.end - MIN_WINDOW_SECONDS));
      let end = selection.end;
      // Growing past the cap slides the end handle along (window-drag feel).
      if (end - start > maxClipSeconds) end = Math.min(duration, start + maxClipSeconds);
      onSelectionChange(clampSelection(start, end));
    } else if (drag.mode === 'end') {
      const end = Math.min(duration, Math.max(t, selection.start + MIN_WINDOW_SECONDS));
      let start = selection.start;
      if (end - start > maxClipSeconds) start = Math.max(0, end - maxClipSeconds);
      onSelectionChange(clampSelection(start, end));
    } else {
      const start = Math.max(0, Math.min(t - drag.grabOffset, duration - win));
      onSelectionChange(clampSelection(start, start + win));
    }
  };

  const endDrag = (e: React.PointerEvent) => {
    if (dragRef.current) {
      dragRef.current = null;
      try {
        timelineRef.current?.releasePointerCapture(e.pointerId);
      } catch {
        // pointer capture may already be gone — fine
      }
    }
  };

  const nudge = (which: 'start' | 'end', delta: number) => {
    if (disabled) return;
    if (which === 'start') {
      const start = Math.max(0, Math.min(selection.start + delta, selection.end - MIN_WINDOW_SECONDS));
      let end = selection.end;
      if (end - start > maxClipSeconds) end = start + maxClipSeconds;
      onSelectionChange(clampSelection(start, end));
    } else {
      const end = Math.min(duration || selection.end + delta, Math.max(selection.end + delta, selection.start + MIN_WINDOW_SECONDS));
      let start = selection.start;
      if (end - start > maxClipSeconds) start = Math.max(0, end - maxClipSeconds);
      onSelectionChange(clampSelection(start, end));
    }
  };

  const commitClockInput = (which: 'start' | 'end', raw: string) => {
    const parsed = parseClock(raw);
    if (parsed === null) return;
    if (which === 'start') {
      const start = Math.max(0, Math.min(parsed, selection.end - MIN_WINDOW_SECONDS));
      let end = selection.end;
      if (end - start > maxClipSeconds) end = start + maxClipSeconds;
      onSelectionChange(clampSelection(start, end));
    } else {
      const end = Math.min(duration || parsed, Math.max(parsed, selection.start + MIN_WINDOW_SECONDS));
      let start = selection.start;
      if (end - start > maxClipSeconds) start = Math.max(0, end - maxClipSeconds);
      onSelectionChange(clampSelection(start, end));
    }
  };

  const windowSeconds = Math.max(0, selection.end - selection.start);
  const estFrames = Math.round(windowSeconds * ASSUMED_FPS);
  const estProcessSeconds = estFrames * Math.max(0, estSecondsPerFrameTotal);
  const overRecommended = windowSeconds > recommendedClipSeconds + 0.001;
  const overFrameBudget = estFrames > maxFrames;

  const startPercent = duration > 0 ? (selection.start / duration) * 100 : 0;
  const endPercent = duration > 0 ? (selection.end / duration) * 100 : 100;
  const currentPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="space-y-3">
      <video
        ref={videoRef}
        src={mediaUrl}
        className="w-full max-h-72 rounded-lg bg-black"
        preload="metadata"
        playsInline
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* Timeline. touch-none is required for pointer-event dragging on mobile. */}
      <div
        ref={timelineRef}
        className="relative h-12 bg-muted rounded-lg cursor-pointer touch-none select-none"
        onPointerDown={handleTrackPointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        role="group"
        aria-label={t('videoRestore.selector.timelineLabel')}
      >
        {/* Dimmed regions outside the selection */}
        <div className="absolute top-0 left-0 h-full bg-black/30 rounded-l-lg" style={{ width: `${startPercent}%` }} />
        <div className="absolute top-0 right-0 h-full bg-black/30 rounded-r-lg" style={{ width: `${Math.max(0, 100 - endPercent)}%` }} />
        {/* Selected window — grab the middle to drag the whole window */}
        <div
          className="absolute top-0 h-full bg-blue-500/30 border-y-2 border-blue-500 cursor-grab active:cursor-grabbing"
          style={{ left: `${startPercent}%`, width: `${Math.max(0, endPercent - startPercent)}%` }}
          onPointerDown={(e) => beginDrag(e, 'window')}
          aria-hidden="true"
        />
        {/* Handles */}
        <div
          className="absolute top-0 h-full w-3 -ml-1.5 bg-blue-600 rounded-sm cursor-ew-resize z-10"
          style={{ left: `${startPercent}%` }}
          onPointerDown={(e) => beginDrag(e, 'start')}
          role="slider"
          aria-label={t('videoRestore.selector.startHandle')}
          aria-valuemin={0}
          aria-valuemax={duration}
          aria-valuenow={selection.start}
          tabIndex={0}
        />
        <div
          className="absolute top-0 h-full w-3 -ml-1.5 bg-blue-600 rounded-sm cursor-ew-resize z-10"
          style={{ left: `${endPercent}%` }}
          onPointerDown={(e) => beginDrag(e, 'end')}
          role="slider"
          aria-label={t('videoRestore.selector.endHandle')}
          aria-valuemin={0}
          aria-valuemax={duration}
          aria-valuenow={selection.end}
          tabIndex={0}
        />
        {/* Playhead */}
        <div className="absolute top-0 w-0.5 h-full bg-red-500 pointer-events-none" style={{ left: `${currentPercent}%` }} />
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
        <button
          type="button"
          onClick={handlePlayPause}
          disabled={disabled || duration <= 0}
          className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-1.5 text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors motion-reduce:transition-none"
          aria-label={isPlaying ? t('videoRestore.selector.pause') : t('videoRestore.selector.playSelection')}
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {isPlaying ? t('videoRestore.selector.pause') : t('videoRestore.selector.playSelection')}
        </button>

        {(['start', 'end'] as const).map((which) => (
          <div key={`${which}-${(which === 'start' ? selection.start : selection.end).toFixed(1)}`} className="flex items-center gap-1">
            <span className="text-muted-foreground">
              {which === 'start' ? t('videoRestore.selector.start') : t('videoRestore.selector.end')}
            </span>
            <button
              type="button"
              className="rounded border border-input px-1 py-0.5 hover:bg-muted disabled:opacity-50"
              onClick={() => nudge(which, -0.1)}
              disabled={disabled}
              aria-label={t('videoRestore.selector.nudgeBack')}
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <input
              type="text"
              inputMode="decimal"
              defaultValue={formatClock(which === 'start' ? selection.start : selection.end)}
              onBlur={(e) => commitClockInput(which, e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
              }}
              disabled={disabled}
              className="w-20 rounded border border-input bg-background px-2 py-1 text-center font-mono text-xs"
              aria-label={which === 'start' ? t('videoRestore.selector.startTime') : t('videoRestore.selector.endTime')}
            />
            <button
              type="button"
              className="rounded border border-input px-1 py-0.5 hover:bg-muted disabled:opacity-50"
              onClick={() => nudge(which, 0.1)}
              disabled={disabled}
              aria-label={t('videoRestore.selector.nudgeForward')}
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Live readout */}
      <p className="text-sm text-muted-foreground">
        <span className="font-medium text-foreground">{windowSeconds.toFixed(1)}s</span>{' '}
        {t('videoRestore.selector.selected')} · ~{estFrames} {t('videoRestore.selector.frames')}
        {estProcessSeconds > 0 && <> · {formatEstimate(estProcessSeconds)} {t('videoRestore.selector.estimate')}</>}{' '}
        <span className="text-xs">({t('videoRestore.selector.fpsAssumption')})</span>
      </p>

      {overRecommended && (
        <p className="text-sm rounded-md border border-amber-400/50 bg-amber-500/10 text-amber-600 dark:text-amber-400 px-3 py-2">
          {t('videoRestore.selector.overRecommended', { seconds: recommendedClipSeconds })}
        </p>
      )}
      {overFrameBudget && (
        <p className="text-sm rounded-md border border-amber-400/50 bg-amber-500/10 text-amber-600 dark:text-amber-400 px-3 py-2">
          {t('videoRestore.selector.overFrameBudget', { maxFrames })}
        </p>
      )}
    </div>
  );
};

export default SnippetSelector;
