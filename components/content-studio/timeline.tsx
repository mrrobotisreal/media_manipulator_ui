'use client';

import React from 'react';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import { ZoomIn, ZoomOut, Scissors, Volume2, VolumeX, Plus, Trash2, Diamond } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useLocalization } from '@/i18n/useLocalization';
import { useStudioStore } from '@/lib/studioStore';
import { studioSpriteUrl } from '@/lib/studio/previewEngine';
import {
  quantizeScrollLeft,
  visibleWindow,
  windowClips,
  windowTickRange,
} from '@/lib/studio/timelineWindow';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { TRANSITION_TYPE_GROUPS } from '@/lib/studio/effectRegistry';
import { clipKeyframeLanes, type KeyframePropertyGroup } from '@/lib/studio/keyframes';
import { defaultTransitionSeconds } from '@/lib/studio/preferences';
import { editSummary } from '@/lib/studio/telemetry';
import ClipWaveform from './clip-waveform';
import { useUndoGesture } from './useUndoGesture';
import { CaptionControls, CaptionLaneContent, CAPTION_LANE_HEIGHT } from './caption-lane';
import type { StudioClip, StudioTrack, StudioTransitionType } from '@/lib/studioTypes';

const RULER_HEIGHT = 28;
const TRACK_HEIGHT = 56;
const LABEL_WIDTH = 64;
const MIN_CLIP = 0.1;
const KEYFRAME_STRIP_HEIGHT = 20;

// Keyframe strip diamond styling per property group (part 15): color + a small
// vertical offset so coincident keyframes of different groups stay visible.
const KF_GROUP_COLOR: Record<KeyframePropertyGroup, string> = {
  motion: 'bg-data',
  opacity: 'bg-premium',
  audio: 'bg-primary',
  effects: 'bg-foreground',
};
const KF_GROUP_TOP: Record<KeyframePropertyGroup, number> = {
  motion: 0,
  opacity: 4,
  audio: 8,
  effects: 12,
};

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

// Display order: video tracks (index asc) on top, audio tracks (index asc) below.
function orderTracks(tracks: StudioTrack[]): StudioTrack[] {
  return [...tracks].sort((a, b) => {
    if (a.kind !== b.kind) return a.kind === 'video' ? -1 : 1;
    return a.index - b.index;
  });
}

/**
 * Timeline — ruler + multiple V/A tracks. Clips can be dragged to reposition
 * within a track or moved to another track of the same kind; assets can be
 * dropped here from the media bin. The shared DndContext lives in the editor;
 * tracks register as drop targets and clips as draggables.
 */
const Timeline: React.FC = () => {
  const { t } = useLocalization('interface');
  const project = useStudioStore((s) => s.project);
  const assets = useStudioStore((s) => s.assets);
  // Deliberately NOT subscribed to `playhead`. During playback it changes 60
  // times a second, and reading it here re-rendered the whole timeline subtree
  // — every track, every clip, every waveform — on each frame (B9). The marker
  // and the follow-scroll read it through transient store subscriptions
  // instead, writing straight to the DOM.
  const duration = useStudioStore((s) => s.duration);
  const isPlaying = useStudioStore((s) => s.isPlaying);
  const zoom = useStudioStore((s) => s.zoom);
  const zoomBy = useStudioStore((s) => s.zoomBy);
  const setPlayhead = useStudioStore((s) => s.setPlayhead);
  const pause = useStudioStore((s) => s.pause);
  const selectedClipIds = useStudioStore((s) => s.selectedClipIds);
  const selectClip = useStudioStore((s) => s.selectClip);
  const updateClip = useStudioStore((s) => s.updateClip);
  const deleteSelected = useStudioStore((s) => s.deleteSelected);
  const addTrack = useStudioStore((s) => s.addTrack);
  const removeTrack = useStudioStore((s) => s.removeTrack);
  const toggleTrackMute = useStudioStore((s) => s.toggleTrackMute);
  const setClipVolume = useStudioStore((s) => s.setClipVolume);
  const volumeGesture = useUndoGesture();

  const contentRef = React.useRef<HTMLDivElement>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const trimRef = React.useRef<
    null | { side: 'l' | 'r'; clipId: string; startX: number; orig: StudioClip; assetDur: number }
  >(null);
  const scrubRef = React.useRef(false);
  const scrubClientXRef = React.useRef(0);
  const autoScrollRaf = React.useRef<number | null>(null);
  const rulerRaf = React.useRef<number | null>(null);
  const viewportRaf = React.useRef<number | null>(null);

  // Virtualization (part 11): track the scroll window so lanes mount only the
  // clips near it. `left` is quantized to half-viewport steps — the timeline
  // re-renders every half viewport of scrolling, not every scroll event, and
  // the one-viewport overscan absorbs the quantization slack.
  const [viewport, setViewport] = React.useState({ left: 0, width: 0 });
  const hasProject = !!project;
  React.useEffect(() => {
    if (!hasProject) return;
    const sc = scrollRef.current;
    if (!sc) return;
    const measure = () => {
      setViewport((prev) => {
        const width = sc.clientWidth;
        const left = quantizeScrollLeft(sc.scrollLeft, width);
        return prev.left === left && prev.width === width ? prev : { left, width };
      });
    };
    measure();
    const onScroll = () => {
      if (viewportRaf.current != null) return;
      viewportRaf.current = requestAnimationFrame(() => {
        viewportRaf.current = null;
        measure();
      });
    };
    sc.addEventListener('scroll', onScroll, { passive: true });
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null;
    ro?.observe(sc);
    return () => {
      sc.removeEventListener('scroll', onScroll);
      ro?.disconnect();
      if (viewportRaf.current != null) {
        cancelAnimationFrame(viewportRaf.current);
        viewportRaf.current = null;
      }
    };
  }, [hasProject]);

  // Follow the playhead during playback: keep the marker on-screen by paging the
  // scroll container when it nears either edge. A transient subscription, not a
  // render dependency — this only ever touches scrollLeft.
  React.useEffect(() => {
    if (!isPlaying) return;
    return useStudioStore.subscribe((s, prev) => {
      if (s.playhead === prev.playhead) return;
      const sc = scrollRef.current;
      if (!sc) return;
      const x = s.playhead * zoom;
      const margin = 48;
      const viewLeft = sc.scrollLeft;
      const viewRight = viewLeft + sc.clientWidth;
      if (x > viewRight - margin || x < viewLeft + margin) {
        sc.scrollLeft = Math.max(0, x - margin);
      }
    });
  }, [isPlaying, zoom]);

  // Stop any edge auto-scroll loop on unmount.
  React.useEffect(
    () => () => {
      if (autoScrollRaf.current) cancelAnimationFrame(autoScrollRaf.current);
      if (rulerRaf.current) cancelAnimationFrame(rulerRaf.current);
    },
    [],
  );

  const tracks = React.useMemo(() => orderTracks(project?.tracks ?? []), [project?.tracks]);

  // Visible time range (with overscan). Before the first measurement the
  // window is unbounded, which is correct — just not yet virtualized.
  const win = React.useMemo(
    () => visibleWindow(viewport.left, viewport.width, zoom),
    [viewport, zoom],
  );

  const timeFromClientX = React.useCallback(
    (clientX: number): number => {
      const rect = contentRef.current?.getBoundingClientRect();
      if (!rect) return 0;
      return Math.max(0, (clientX - rect.left) / zoom);
    },
    [zoom],
  );

  // --- ruler scrubbing (with edge auto-scroll) ---
  const stopAutoScroll = React.useCallback(() => {
    if (autoScrollRaf.current) cancelAnimationFrame(autoScrollRaf.current);
    autoScrollRaf.current = null;
  }, []);

  // While scrubbing near a viewport edge, keep scrolling that way and re-derive
  // the playhead from the held pointer position so the marker can be dragged
  // past the visible window all the way to the start/end. The loop body is a
  // local so it can schedule itself without the callback referencing its own
  // binding.
  const startAutoScroll = React.useCallback(() => {
    const step = () => {
      const sc = scrollRef.current;
      if (!sc || !scrubRef.current) {
        stopAutoScroll();
        return;
      }
      const rect = sc.getBoundingClientRect();
      const edge = 48;
      const x = scrubClientXRef.current;
      let dir = 0;
      if (x < rect.left + edge) dir = -1;
      else if (x > rect.right - edge) dir = 1;
      if (dir === 0) {
        stopAutoScroll();
        return;
      }
      sc.scrollLeft = Math.max(0, sc.scrollLeft + dir * 14);
      setPlayhead(timeFromClientX(x));
      autoScrollRaf.current = requestAnimationFrame(step);
    };
    autoScrollRaf.current = requestAnimationFrame(step);
  }, [setPlayhead, stopAutoScroll, timeFromClientX]);

  const maybeAutoScroll = React.useCallback(() => {
    const sc = scrollRef.current;
    if (!sc) return;
    const rect = sc.getBoundingClientRect();
    const edge = 48;
    const x = scrubClientXRef.current;
    const nearEdge = x < rect.left + edge || x > rect.right - edge;
    if (nearEdge && autoScrollRaf.current == null) {
      startAutoScroll();
    } else if (!nearEdge) {
      stopAutoScroll();
    }
  }, [startAutoScroll, stopAutoScroll]);

  const onRulerDown = React.useCallback(
    (e: React.PointerEvent) => {
      (e.currentTarget as Element).setPointerCapture(e.pointerId);
      scrubRef.current = true;
      scrubClientXRef.current = e.clientX;
      pause();
      setPlayhead(timeFromClientX(e.clientX));
    },
    [pause, setPlayhead, timeFromClientX],
  );

  // Pointer events fire faster than the display refreshes. Coalescing to one
  // rAF means a fast scrub commits one playhead update per frame instead of
  // three or four, each of which is a store write plus a preview repaint.
  const onRulerMove = React.useCallback(
    (e: React.PointerEvent) => {
      if (!scrubRef.current) return;
      scrubClientXRef.current = e.clientX;
      if (rulerRaf.current != null) return;
      rulerRaf.current = requestAnimationFrame(() => {
        rulerRaf.current = null;
        if (!scrubRef.current) return;
        setPlayhead(timeFromClientX(scrubClientXRef.current));
        maybeAutoScroll();
      });
    },
    [maybeAutoScroll, setPlayhead, timeFromClientX],
  );

  const onRulerUp = React.useCallback(
    (e: React.PointerEvent) => {
      scrubRef.current = false;
      if (rulerRaf.current != null) {
        cancelAnimationFrame(rulerRaf.current);
        rulerRaf.current = null;
      }
      // Commit the exact pointer position; the pending frame may have been
      // dropped, and the playhead must land where the user let go.
      setPlayhead(timeFromClientX(scrubClientXRef.current));
      stopAutoScroll();
      (e.currentTarget as Element).releasePointerCapture?.(e.pointerId);
    },
    [setPlayhead, stopAutoScroll, timeFromClientX],
  );

  // --- clip trim ---
  const onTrimDown = React.useCallback(
    (e: React.PointerEvent, side: 'l' | 'r', clip: StudioClip, assetDur: number) => {
      e.stopPropagation();
      e.preventDefault();
      (e.currentTarget as Element).setPointerCapture(e.pointerId);
      trimRef.current = { side, clipId: clip.id, startX: e.clientX, orig: { ...clip }, assetDur };
      selectClip(clip.id);
      // The whole trim drag collapses to one undo entry (closed in onTrimUp).
      useStudioStore.getState().beginGesture();
    },
    [selectClip],
  );

  const onTrimMove = React.useCallback(
    (e: React.PointerEvent) => {
      const d = trimRef.current;
      if (!d) return;
      const deltaSec = (e.clientX - d.startX) / zoom;
      if (d.side === 'l') {
        const maxDelta = d.orig.sourceOut - MIN_CLIP - d.orig.sourceIn;
        const minDelta = Math.max(-d.orig.sourceIn, -d.orig.timelineStart);
        const delta = clamp(deltaSec, minDelta, maxDelta);
        updateClip(d.clipId, { sourceIn: d.orig.sourceIn + delta, timelineStart: d.orig.timelineStart + delta });
      } else {
        const minDelta = d.orig.sourceIn + MIN_CLIP - d.orig.sourceOut;
        const maxDelta = (d.assetDur > 0 ? d.assetDur : d.orig.sourceOut) - d.orig.sourceOut;
        const delta = clamp(deltaSec, minDelta, maxDelta);
        updateClip(d.clipId, { sourceOut: d.orig.sourceOut + delta });
      }
    },
    [updateClip, zoom],
  );

  const onTrimUp = React.useCallback((e: React.PointerEvent) => {
    if (!trimRef.current) return;
    trimRef.current = null;
    (e.currentTarget as Element).releasePointerCapture?.(e.pointerId);
    useStudioStore.getState().endGesture();
  }, []);

  if (!project) return null;
  const contentWidth = Math.max(800, (duration + 4) * zoom);

  // The per-clip volume control targets a single selected clip that carries audio.
  const primaryId = selectedClipIds.length === 1 ? selectedClipIds[0] : null;
  let selected: { clip: StudioClip; track: StudioTrack } | null = null;
  if (primaryId) {
    for (const tr of tracks) {
      const c = tr.clips.find((cc) => cc.id === primaryId);
      if (c) {
        selected = { clip: c, track: tr };
        break;
      }
    }
  }
  const selectedAudible = !!selected && !!assets[selected.clip.assetId]?.asset.hasAudio;

  return (
    <div className="border border-border rounded-lg bg-background/40">
      {/* toolbar */}
      <div className="flex items-center justify-between gap-2 px-3 py-2 border-b border-border flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-card-foreground">{t('contentStudio.slots.timeline.title')}</span>
          <Button size="sm" variant="ghost" className="h-7" onClick={() => addTrack('video')} title={t('contentStudio.timeline.addVideoTrack')}>
            <Plus className="w-3.5 h-3.5 mr-1" />V
          </Button>
          <Button size="sm" variant="ghost" className="h-7" onClick={() => addTrack('audio')} title={t('contentStudio.timeline.addAudioTrack')}>
            <Plus className="w-3.5 h-3.5 mr-1" />A
          </Button>
          <CaptionControls projectId={project.id} />
        </div>
        <div className="flex items-center gap-2">
          {selected && selectedAudible && (
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-muted-foreground" />
              <Slider
                className="w-28"
                min={0}
                max={1}
                step={0.05}
                value={[selected.clip.volume ?? 1]}
                onValueChange={(v) => {
                  volumeGesture.begin();
                  setClipVolume(selected!.clip.id, v[0] ?? 1);
                }}
                onValueCommit={volumeGesture.end}
              />
            </div>
          )}
          {selectedClipIds.length > 0 && (
            <Button
              size="sm"
              variant="ghost"
              className="h-7 text-destructive"
              onClick={() => deleteSelected()}
              title={t('contentStudio.timeline.rippleHint')}
            >
              <Scissors className="w-4 h-4 mr-1" />
              {t('contentStudio.timeline.rippleDelete')}
            </Button>
          )}
          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => zoomBy(1 / 1.25)} title={t('contentStudio.timeline.zoomOut')}>
            <ZoomOut className="w-4 h-4" />
          </Button>
          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => zoomBy(1.25)} title={t('contentStudio.timeline.zoomIn')}>
            <ZoomIn className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex">
        {/* fixed track labels + mute */}
        <div className="shrink-0 border-r border-border" style={{ width: LABEL_WIDTH }}>
          <div style={{ height: RULER_HEIGHT }} className="border-b border-border" />
          <div
            style={{ height: CAPTION_LANE_HEIGHT }}
            className="border-b border-border flex items-center justify-center text-[10px] font-medium text-premium"
          >
            CC
          </div>
          {tracks.map((track) => (
            <div
              key={track.id}
              style={{ height: TRACK_HEIGHT }}
              className="flex flex-col items-center justify-center gap-1 text-xs font-medium text-muted-foreground border-b border-border"
            >
              <span>
                {track.kind === 'video' ? 'V' : 'A'}
                {track.index + 1}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => toggleTrackMute(track.id)}
                  className={`p-0.5 rounded hover:bg-muted ${track.muted ? 'text-destructive' : 'text-muted-foreground'}`}
                  title={track.muted ? t('contentStudio.timeline.unmute') : t('contentStudio.timeline.mute')}
                >
                  {track.muted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                </button>
                {track.clips.length === 0 && (
                  <button
                    type="button"
                    onClick={() => removeTrack(track.id)}
                    className="p-0.5 rounded hover:bg-muted text-muted-foreground hover:text-destructive"
                    title={t('contentStudio.timeline.deleteTrack')}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* scrollable timeline */}
        <div ref={scrollRef} className="flex-1 overflow-x-auto">
          <div ref={contentRef} className="relative" style={{ width: contentWidth }}>
            {/* ruler */}
            <div
              className="relative bg-muted/40 cursor-pointer select-none touch-none border-b border-border"
              style={{ height: RULER_HEIGHT }}
              onPointerDown={onRulerDown}
              onPointerMove={onRulerMove}
              onPointerUp={onRulerUp}
            >
              <RulerTicks duration={duration} zoom={zoom} startSec={win.startSec} endSec={win.endSec} />
            </div>

            {/* caption lane (pinned between ruler and tracks) */}
            <CaptionLaneContent zoom={zoom} />

            {/* tracks */}
            {tracks.map((track) => (
              <TrackRow
                key={track.id}
                track={track}
                zoom={zoom}
                windowStartSec={win.startSec}
                windowEndSec={win.endSec}
                selectedClipIds={selectedClipIds}
                assets={assets}
                onSelect={selectClip}
                onTrimDown={onTrimDown}
                onTrimMove={onTrimMove}
                onTrimUp={onTrimUp}
              />
            ))}

            <PlayheadMarker
              zoom={zoom}
              height={RULER_HEIGHT + CAPTION_LANE_HEIGHT + tracks.length * TRACK_HEIGHT}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * The playhead line. It is the one thing on screen that genuinely has to move
 * at 60fps, so it reads the store through a transient subscription and writes
 * `transform` straight to the DOM — no React render per frame, and the movement
 * stays on the compositor (the old version animated `left`, which lays out).
 */
const PlayheadMarker: React.FC<{ zoom: number; height: number }> = ({ zoom, height }) => {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const apply = (seconds: number) => {
      const el = ref.current;
      if (el) el.style.transform = `translate3d(${seconds * zoom}px, 0, 0)`;
    };
    apply(useStudioStore.getState().playhead);
    return useStudioStore.subscribe((s, prev) => {
      if (s.playhead !== prev.playhead) apply(s.playhead);
    });
  }, [zoom]);

  return (
    <div
      ref={ref}
      className="absolute top-0 bottom-0 left-0 w-px bg-primary pointer-events-none will-change-transform"
      style={{ height }}
    >
      <div className="w-2 h-2 -ml-1 rounded-full bg-primary" />
    </div>
  );
};

const RulerTicksImpl: React.FC<{ duration: number; zoom: number; startSec: number; endSec: number }> = ({
  duration,
  zoom,
  startSec,
  endSec,
}) => {
  const targetPx = 64;
  const rawStep = targetPx / zoom;
  const steps = [0.5, 1, 2, 5, 10, 15, 30, 60, 120, 300];
  const step = steps.find((s) => s >= rawStep) ?? 600;
  const count = Math.ceil((duration + 4) / step) + 1;
  // Virtualized like the clips: a 60-minute ruler at 0.5s steps is 7,200
  // ticks — only the ones inside the scroll window are worth mounting.
  const { first, last } = windowTickRange({ startSec, endSec }, step, count);
  const ticks = [];
  for (let i = first; i <= last; i += 1) {
    const sec = i * step;
    const mm = Math.floor(sec / 60);
    const ss = Math.floor(sec % 60);
    ticks.push(
      <div key={i} className="absolute top-0 bottom-0 flex items-center" style={{ left: sec * zoom }}>
        <span className="text-[10px] text-muted-foreground pl-1 tabular-nums border-l border-border/60 h-full flex items-center">
          {mm}:{ss.toString().padStart(2, '0')}
        </span>
      </div>,
    );
  }
  return <>{ticks}</>;
};

// Tick labels only change with the zoom level, the timeline length, or the
// scroll window — never with the playhead or the selection.
const RulerTicks = React.memo(RulerTicksImpl);
RulerTicks.displayName = 'RulerTicks';

interface TrackRowProps {
  track: StudioTrack;
  zoom: number;
  windowStartSec: number;
  windowEndSec: number;
  selectedClipIds: string[];
  assets: ReturnType<typeof useStudioStore.getState>['assets'];
  onSelect: (id: string | null, additive?: boolean) => void;
  onTrimDown: (e: React.PointerEvent, side: 'l' | 'r', clip: StudioClip, assetDur: number) => void;
  onTrimMove: (e: React.PointerEvent) => void;
  onTrimUp: (e: React.PointerEvent) => void;
}

const TrackRowImpl: React.FC<TrackRowProps> = (props) => {
  const { setNodeRef, isOver, active } = useDroppable({ id: props.track.id, data: { kind: props.track.kind } });
  const activeKind = (active?.data.current as { kind?: string } | undefined)?.kind;
  const compatible = !!active && activeKind === props.track.kind;
  const incompatible = !!active && activeKind !== props.track.kind;

  // Only the clips near the scroll window are mounted. Selected clips and the
  // one being dragged are always kept: dnd-kit must never lose its active node
  // mid-drag near the window edge, and trim/volume gestures target the
  // selection.
  const activeClipId = typeof active?.id === 'string' ? active.id : null;
  const keepIds = React.useMemo(() => {
    const ids = new Set(props.selectedClipIds);
    if (activeClipId) ids.add(activeClipId);
    return ids;
  }, [props.selectedClipIds, activeClipId]);
  const visibleClips = React.useMemo(
    () =>
      windowClips(
        props.track.clips,
        { startSec: props.windowStartSec, endSec: props.windowEndSec },
        props.zoom,
        keepIds,
      ),
    [props.track.clips, props.windowStartSec, props.windowEndSec, props.zoom, keepIds],
  );
  return (
    <div
      ref={setNodeRef}
      className={`relative border-b border-border ${props.track.muted ? 'opacity-60' : ''} ${
        isOver && compatible ? 'bg-primary/10 ring-1 ring-inset ring-primary/60' : ''
      } ${isOver && incompatible ? 'bg-destructive/10 ring-1 ring-inset ring-destructive/50' : ''}`}
      style={{ height: TRACK_HEIGHT }}
      onClick={(e) => {
        // Clicking empty lane space clears the selection.
        if (e.target === e.currentTarget) props.onSelect(null);
      }}
    >
      {visibleClips.map(({ clip, left, width }) => (
        // `selected` is passed as a boolean rather than the whole selection
        // array: spreading the array made every clip on every track re-render
        // each time the selection changed.
        <ClipBlock
          key={clip.id}
          clip={clip}
          track={props.track}
          zoom={props.zoom}
          left={left}
          width={width}
          selected={props.selectedClipIds.includes(clip.id)}
          assets={props.assets}
          onSelect={props.onSelect}
          onTrimDown={props.onTrimDown}
          onTrimMove={props.onTrimMove}
          onTrimUp={props.onTrimUp}
        />
      ))}
    </div>
  );
};

// Memoized because the timeline re-renders on selection, zoom, asset ingest and
// every edit; a track whose own clips did not change has nothing new to draw.
// All the callbacks it receives are `useCallback`-stable in Timeline.
const TrackRow = React.memo(TrackRowImpl);
TrackRow.displayName = 'TrackRow';

type ClipBlockProps = Omit<TrackRowProps, 'selectedClipIds' | 'windowStartSec' | 'windowEndSec'> & {
  clip: StudioClip;
  selected: boolean;
  /** Geometry resolved by the windowing pass (lib/studio/timelineWindow.ts). */
  left: number;
  width: number;
};

const ClipBlockImpl: React.FC<ClipBlockProps> = ({
  clip,
  track,
  zoom,
  left,
  width,
  selected,
  assets,
  onSelect,
  onTrimDown,
  onTrimMove,
  onTrimUp,
}) => {
  const { t } = useLocalization('interface');
  const entry = assets[clip.assetId];
  // Title clips (part 16) are assetless: labelled by their first text run,
  // drawn as a dark chip with a "T" glyph, and trimmable without a source
  // bound (their content is time-independent).
  const isTitle = !!clip.title;
  const titleText =
    (clip.title?.layers.find((l) => l.type === 'text' && l.text.trim() !== '') as
      | { text: string }
      | undefined)?.text ?? '';
  const label = isTitle
    ? titleText || t('contentStudio.timeline.titleClip')
    : entry?.asset.originalFileName ?? clip.assetId;
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: clip.id,
    data: { type: 'clip', kind: track.kind, label },
  });
  const assetDur = isTitle ? Number.POSITIVE_INFINITY : entry?.asset.durationSeconds ?? 0;
  const ready = entry?.status === 'ready';
  const spriteReady = ready && !!entry?.asset.thumbnailSpriteUrl && track.kind === 'video';
  // Waveform: full block on audio tracks, a bottom strip (~35%) under the
  // filmstrip on video-track clips that carry audio. Rubber-band editing only on
  // audio tracks (video strips are too thin); the inspector handles the rest.
  const isAudioTrack = track.kind === 'audio';
  const contentH = TRACK_HEIGHT - 8; // matches the top-1/bottom-1 insets
  const showWaveform = ready && !!entry?.asset.hasAudio;
  const waveH = isAudioTrack ? contentH : Math.round(contentH * 0.35);

  // --- typed transition (part 14): overlap region + drag-to-retime -----------
  const transition = clip.transition;
  const clipDur = Math.max(0, clip.sourceOut - clip.sourceIn);
  const transW = transition ? Math.min(transition.durationSeconds, clipDur) * zoom : 0;
  const hasPrev = track.clips.some((c) => c.id !== clip.id && c.timelineStart < clip.timelineStart);
  const retimeRef = React.useRef<null | { startX: number; d0: number }>(null);

  // The whole retime drag is ONE undo entry (gesture API); the store re-clamps
  // and re-pulls on every move, so the region + clip position track the pointer.
  const onRetimeDown = (e: React.PointerEvent) => {
    if (!transition) return;
    e.stopPropagation();
    e.preventDefault();
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
    retimeRef.current = { startX: e.clientX, d0: transition.durationSeconds };
    editSummary.increment('uiInvocations');
    useStudioStore.getState().beginGesture();
  };
  const onRetimeMove = (e: React.PointerEvent) => {
    const d = retimeRef.current;
    if (!d || !transition) return;
    // The region is pinned to the predecessor's end and grows LEFTWARD, so
    // dragging the inner edge away from it (left) lengthens the transition.
    const next = d.d0 - (e.clientX - d.startX) / zoom;
    useStudioStore.getState().setClipTransition(clip.id, { ...transition, durationSeconds: next });
  };
  const onRetimeUp = (e: React.PointerEvent) => {
    if (!retimeRef.current) return;
    retimeRef.current = null;
    (e.currentTarget as Element).releasePointerCapture?.(e.pointerId);
    useStudioStore.getState().endGesture();
  };

  // --- keyframe strip (part 15): expandable diamond lane on selected clips ---
  const kfLanes = clipKeyframeLanes(clip);
  const hasKeyframes = kfLanes.length > 0;
  const [kfOpen, setKfOpen] = React.useState(false);
  const kfDragRef = React.useRef<null | { property: string; t: number; startX: number }>(null);

  const onKfDown = (e: React.PointerEvent, property: string, t: number) => {
    e.stopPropagation();
    e.preventDefault();
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
    kfDragRef.current = { property, t, startX: e.clientX };
    editSummary.increment('uiInvocations');
    // The whole retime drag is ONE undo entry.
    useStudioStore.getState().beginGesture();
  };
  const onKfMove = (e: React.PointerEvent) => {
    const d = kfDragRef.current;
    if (!d) return;
    const nt = Math.max(0, d.t + (e.clientX - d.startX) / zoom);
    useStudioStore.getState().moveKeyframe(clip.id, d.property, d.t, nt);
    d.t = nt;
    d.startX = e.clientX;
  };
  const onKfUp = (e: React.PointerEvent) => {
    if (!kfDragRef.current) return;
    kfDragRef.current = null;
    (e.currentTarget as Element).releasePointerCapture?.(e.pointerId);
    useStudioStore.getState().endGesture();
  };

  const applyTransition = (type: StudioTransitionType) => {
    editSummary.increment('transitionsAdded', type);
    editSummary.increment('uiInvocations');
    useStudioStore.getState().setClipTransition(clip.id, {
      type,
      durationSeconds: clip.transition?.durationSeconds ?? defaultTransitionSeconds(track.kind),
    });
  };
  const removeTransition = () => {
    editSummary.increment('uiInvocations');
    useStudioStore.getState().setClipTransition(clip.id, null);
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(clip.id, e.metaKey || e.ctrlKey || e.shiftKey);
      }}
      className={`absolute top-1 bottom-1 rounded-md overflow-hidden border touch-none cursor-grab active:cursor-grabbing ${
        selected ? 'border-primary ring-1 ring-primary' : 'border-border'
      } ${isTitle ? 'bg-surface-0' : track.kind === 'video' ? 'bg-data/20' : 'bg-data/10'} ${isDragging ? 'opacity-40' : ''}`}
      style={{ left, width }}
      title={label}
    >
      {spriteReady && assetDur > 0 && (
        <div
          className="absolute inset-0 opacity-40 bg-no-repeat pointer-events-none"
          style={{
            backgroundImage: `url(${studioSpriteUrl(clip.assetId)})`,
            backgroundSize: `${assetDur * zoom}px 100%`,
            backgroundPositionX: `${-clip.sourceIn * zoom}px`,
          }}
        />
      )}
      {showWaveform && (
        <div
          className="absolute inset-x-0"
          style={isAudioTrack ? { top: 0, height: contentH } : { bottom: 0, height: waveH }}
        >
          <ClipWaveform
            clip={clip}
            assetId={clip.assetId}
            width={width}
            height={waveH}
            selected={selected}
            editable={selected && isAudioTrack}
          />
        </div>
      )}
      {/* Title chip body: a "T" glyph + the first text run, centered. */}
      {isTitle && (
        <div className="absolute inset-0 flex items-center justify-center gap-1.5 px-2 pointer-events-none">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-premium/20 text-[11px] font-bold text-premium">
            T
          </span>
          <span className="truncate text-[11px] text-foreground/90">{label}</span>
        </div>
      )}
      {!isTitle && (
        <div className="absolute inset-x-0 top-0 px-1.5 py-0.5 text-[10px] text-foreground truncate bg-surface-0/30 pointer-events-none">
          {label}
        </div>
      )}
      {/* Trim handles. The visual bar stays 8px so the timeline reads
          precisely, but below `lg` a transparent ::before widens the hit area
          inward to 24px — 8px is well under a fingertip. Extending inward
          rather than outward keeps it from stealing the neighbouring clip's
          handle. */}
      <div
        className="absolute left-0 top-0 bottom-0 w-2 cursor-ew-resize bg-white/20 hover:bg-white/50 touch-none before:absolute before:inset-y-0 before:left-0 before:w-6 before:content-[''] lg:before:hidden"
        onPointerDown={(e) => onTrimDown(e, 'l', clip, assetDur)}
        onPointerMove={onTrimMove}
        onPointerUp={onTrimUp}
        onPointerCancel={onTrimUp}
      />
      <div
        className="absolute right-0 top-0 bottom-0 w-2 cursor-ew-resize bg-white/20 hover:bg-white/50 touch-none before:absolute before:inset-y-0 before:right-0 before:w-6 before:content-[''] lg:before:hidden"
        onPointerDown={(e) => onTrimDown(e, 'r', clip, assetDur)}
        onPointerMove={onTrimMove}
        onPointerUp={onTrimUp}
        onPointerCancel={onTrimUp}
      />
      {/* Transition overlap region (part 14): diagonal hatch in the Darkroom
          Instrument premium accent over [clip start, clip start + duration] —
          exactly the span shared with the predecessor under the pull model. */}
      {transition && transW > 1 && (
        <div
          className="absolute top-0 bottom-0 left-0 pointer-events-none border-r border-premium/70"
          style={{
            width: transW,
            backgroundImage:
              'repeating-linear-gradient(135deg, color-mix(in srgb, var(--accent-premium) 35%, transparent) 0 3px, transparent 3px 7px)',
          }}
          title={t('contentStudio.timeline.transitionRegion')}
        />
      )}
      {/* Retime handle on the region's inner edge; drag left = longer. */}
      {transition && transW > 1 && (
        <div
          className="absolute top-0 bottom-0 w-1.5 -ml-0.5 cursor-ew-resize bg-premium/50 hover:bg-premium/80 touch-none"
          style={{ left: transW }}
          onPointerDown={onRetimeDown}
          onPointerMove={onRetimeMove}
          onPointerUp={onRetimeUp}
          onPointerCancel={onRetimeUp}
          title={t('contentStudio.timeline.transitionRetime')}
        />
      )}
      {/* Keyframe strip disclosure (part 15): selected clips with keyframes. */}
      {selected && hasKeyframes && (
        <button
          type="button"
          className={`absolute right-0.5 top-0.5 z-10 p-0.5 rounded hover:bg-muted ${kfOpen ? 'text-premium' : 'text-muted-foreground'}`}
          onClick={(e) => {
            e.stopPropagation();
            setKfOpen((o) => !o);
            editSummary.increment('uiInvocations');
          }}
          onPointerDown={(e) => e.stopPropagation()}
          title={t('contentStudio.timeline.keyframeToggle')}
        >
          <Diamond className="w-3 h-3" fill={kfOpen ? 'currentColor' : 'none'} />
        </button>
      )}
      {/* Expanded strip: diamonds per property group; drag retimes (one undo
          entry per drag), double-click removes. Times are clip-local, so
          left = t × zoom from the block's own left edge. */}
      {selected && hasKeyframes && kfOpen && (
        <div
          className="absolute inset-x-0 bottom-0 bg-surface-0/80 border-t border-border touch-none"
          style={{ height: KEYFRAME_STRIP_HEIGHT }}
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          {kfLanes.map((lane) =>
            lane.keyframes.map((k) => (
              <div
                key={`${lane.property}@${k.t}`}
                className={`absolute w-2 h-2 rotate-45 cursor-ew-resize border border-surface-0 ${KF_GROUP_COLOR[lane.group]}`}
                style={{ left: k.t * zoom - 4, top: KF_GROUP_TOP[lane.group] }}
                onPointerDown={(e) => onKfDown(e, lane.property, k.t)}
                onPointerMove={onKfMove}
                onPointerUp={onKfUp}
                onPointerCancel={onKfUp}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  useStudioStore.getState().removeKeyframe(clip.id, lane.property, k.t);
                  editSummary.increment('uiInvocations');
                }}
                title={`${lane.property} · ${t('contentStudio.timeline.keyframeDiamond')}`}
              />
            )),
          )}
        </div>
      )}
    </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        <ContextMenuSub>
          <ContextMenuSubTrigger disabled={!hasPrev} className="text-xs">
            {t('contentStudio.timeline.contextTransition')}
          </ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-44">
            {TRANSITION_TYPE_GROUPS.map((group) => (
              <ContextMenuSub key={group.key}>
                <ContextMenuSubTrigger className="text-xs">
                  {t(`contentStudio.inspector.transitionGroups.${group.key}`)}
                </ContextMenuSubTrigger>
                <ContextMenuSubContent className="w-40">
                  {group.types.map((type) => (
                    <ContextMenuItem key={type} className="text-xs" onSelect={() => applyTransition(type)}>
                      {t(`contentStudio.inspector.transitionTypes.${type}`)}
                    </ContextMenuItem>
                  ))}
                </ContextMenuSubContent>
              </ContextMenuSub>
            ))}
          </ContextMenuSubContent>
        </ContextMenuSub>
        {transition && (
          <>
            <ContextMenuSeparator />
            <ContextMenuItem className="text-xs" onSelect={removeTransition}>
              {t('contentStudio.timeline.contextRemoveTransition')}
            </ContextMenuItem>
          </>
        )}
        {/* Legacy convert (part 16): clips bearing textOverlays offer a
            one-click upgrade to a first-class title clip (one undo entry). */}
        {(clip.textOverlays?.length ?? 0) > 0 && (
          <>
            <ContextMenuSeparator />
            <ContextMenuItem
              className="text-xs"
              onSelect={() => {
                editSummary.increment('titlesAdded');
                editSummary.increment('uiInvocations');
                useStudioStore.getState().convertOverlaysToTitle(clip.id);
              }}
            >
              {t('contentStudio.timeline.contextConvertToTitle')}
            </ContextMenuItem>
          </>
        )}
      </ContextMenuContent>
    </ContextMenu>
  );
};

// Memoized: with `selected` reduced to a boolean, a clip only re-renders when
// its own geometry, selection, or asset actually changes — not on every
// timeline render.
const ClipBlock = React.memo(ClipBlockImpl);
ClipBlock.displayName = 'ClipBlock';

export default Timeline;
