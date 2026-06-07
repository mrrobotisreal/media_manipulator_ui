'use client';

import React from 'react';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import { ZoomIn, ZoomOut, Scissors, Volume2, VolumeX, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useLocalization } from '@/i18n/useLocalization';
import { useStudioStore, clipDuration, timelineDuration } from '@/lib/studioStore';
import { studioSpriteUrl } from '@/lib/studio/previewEngine';
import type { StudioClip, StudioTrack } from '@/lib/studioTypes';

const RULER_HEIGHT = 28;
const TRACK_HEIGHT = 56;
const LABEL_WIDTH = 64;
const MIN_CLIP = 0.1;

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
  const playhead = useStudioStore((s) => s.playhead);
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

  const contentRef = React.useRef<HTMLDivElement>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const trimRef = React.useRef<
    null | { side: 'l' | 'r'; clipId: string; startX: number; orig: StudioClip; assetDur: number }
  >(null);
  const scrubRef = React.useRef(false);
  const scrubClientXRef = React.useRef(0);
  const autoScrollRaf = React.useRef<number | null>(null);

  // Follow the playhead during playback: keep the marker on-screen by paging the
  // scroll container when it nears either edge.
  React.useEffect(() => {
    if (!isPlaying) return;
    const sc = scrollRef.current;
    if (!sc) return;
    const x = playhead * zoom;
    const margin = 48;
    const viewLeft = sc.scrollLeft;
    const viewRight = viewLeft + sc.clientWidth;
    if (x > viewRight - margin || x < viewLeft + margin) {
      sc.scrollLeft = Math.max(0, x - margin);
    }
  }, [playhead, isPlaying, zoom]);

  // Stop any edge auto-scroll loop on unmount.
  React.useEffect(
    () => () => {
      if (autoScrollRaf.current) cancelAnimationFrame(autoScrollRaf.current);
    },
    [],
  );

  if (!project) return null;
  const tracks = orderTracks(project.tracks);
  const duration = timelineDuration(tracks);
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

  const timeFromClientX = (clientX: number): number => {
    const rect = contentRef.current?.getBoundingClientRect();
    if (!rect) return 0;
    return Math.max(0, (clientX - rect.left) / zoom);
  };

  // --- ruler scrubbing (with edge auto-scroll) ---
  const stopAutoScroll = () => {
    if (autoScrollRaf.current) cancelAnimationFrame(autoScrollRaf.current);
    autoScrollRaf.current = null;
  };
  // While scrubbing near a viewport edge, keep scrolling that way and re-derive
  // the playhead from the held pointer position so the marker can be dragged
  // past the visible window all the way to the start/end.
  const autoScrollStep = () => {
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
    autoScrollRaf.current = requestAnimationFrame(autoScrollStep);
  };
  const maybeAutoScroll = () => {
    const sc = scrollRef.current;
    if (!sc) return;
    const rect = sc.getBoundingClientRect();
    const edge = 48;
    const x = scrubClientXRef.current;
    const nearEdge = x < rect.left + edge || x > rect.right - edge;
    if (nearEdge && autoScrollRaf.current == null) {
      autoScrollRaf.current = requestAnimationFrame(autoScrollStep);
    } else if (!nearEdge) {
      stopAutoScroll();
    }
  };
  const onRulerDown = (e: React.PointerEvent) => {
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
    scrubRef.current = true;
    scrubClientXRef.current = e.clientX;
    pause();
    setPlayhead(timeFromClientX(e.clientX));
  };
  const onRulerMove = (e: React.PointerEvent) => {
    if (!scrubRef.current) return;
    scrubClientXRef.current = e.clientX;
    setPlayhead(timeFromClientX(e.clientX));
    maybeAutoScroll();
  };
  const onRulerUp = (e: React.PointerEvent) => {
    scrubRef.current = false;
    stopAutoScroll();
    (e.currentTarget as Element).releasePointerCapture?.(e.pointerId);
  };

  // --- clip trim ---
  const onTrimDown = (e: React.PointerEvent, side: 'l' | 'r', clip: StudioClip, assetDur: number) => {
    e.stopPropagation();
    e.preventDefault();
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
    trimRef.current = { side, clipId: clip.id, startX: e.clientX, orig: { ...clip }, assetDur };
    selectClip(clip.id);
  };
  const onTrimMove = (e: React.PointerEvent) => {
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
  };
  const onTrimUp = (e: React.PointerEvent) => {
    if (!trimRef.current) return;
    trimRef.current = null;
    (e.currentTarget as Element).releasePointerCapture?.(e.pointerId);
  };

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
                onValueChange={(v) => setClipVolume(selected!.clip.id, v[0] ?? 1)}
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
              <RulerTicks duration={duration} zoom={zoom} />
            </div>

            {/* tracks */}
            {tracks.map((track) => (
              <TrackRow
                key={track.id}
                track={track}
                zoom={zoom}
                selectedClipIds={selectedClipIds}
                assets={assets}
                onSelect={selectClip}
                onTrimDown={onTrimDown}
                onTrimMove={onTrimMove}
                onTrimUp={onTrimUp}
              />
            ))}

            {/* playhead */}
            <div
              className="absolute top-0 bottom-0 w-px bg-blue-500 pointer-events-none"
              style={{ left: playhead * zoom, height: RULER_HEIGHT + tracks.length * TRACK_HEIGHT }}
            >
              <div className="w-2 h-2 -ml-1 rounded-full bg-blue-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const RulerTicks: React.FC<{ duration: number; zoom: number }> = ({ duration, zoom }) => {
  const targetPx = 64;
  const rawStep = targetPx / zoom;
  const steps = [0.5, 1, 2, 5, 10, 15, 30, 60, 120, 300];
  const step = steps.find((s) => s >= rawStep) ?? 600;
  const count = Math.ceil((duration + 4) / step) + 1;
  const ticks = [];
  for (let i = 0; i < count; i += 1) {
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

interface TrackRowProps {
  track: StudioTrack;
  zoom: number;
  selectedClipIds: string[];
  assets: ReturnType<typeof useStudioStore.getState>['assets'];
  onSelect: (id: string | null, additive?: boolean) => void;
  onTrimDown: (e: React.PointerEvent, side: 'l' | 'r', clip: StudioClip, assetDur: number) => void;
  onTrimMove: (e: React.PointerEvent) => void;
  onTrimUp: (e: React.PointerEvent) => void;
}

const TrackRow: React.FC<TrackRowProps> = (props) => {
  const { setNodeRef, isOver, active } = useDroppable({ id: props.track.id, data: { kind: props.track.kind } });
  const activeKind = (active?.data.current as { kind?: string } | undefined)?.kind;
  const compatible = !!active && activeKind === props.track.kind;
  const incompatible = !!active && activeKind !== props.track.kind;
  return (
    <div
      ref={setNodeRef}
      className={`relative border-b border-border ${props.track.muted ? 'opacity-60' : ''} ${
        isOver && compatible ? 'bg-blue-500/10 ring-1 ring-inset ring-blue-500/60' : ''
      } ${isOver && incompatible ? 'bg-destructive/10 ring-1 ring-inset ring-destructive/50' : ''}`}
      style={{ height: TRACK_HEIGHT }}
      onClick={(e) => {
        // Clicking empty lane space clears the selection.
        if (e.target === e.currentTarget) props.onSelect(null);
      }}
    >
      {props.track.clips.map((clip) => (
        <ClipBlock key={clip.id} clip={clip} {...props} />
      ))}
    </div>
  );
};

const ClipBlock: React.FC<{ clip: StudioClip } & TrackRowProps> = ({
  clip,
  track,
  zoom,
  selectedClipIds,
  assets,
  onSelect,
  onTrimDown,
  onTrimMove,
  onTrimUp,
}) => {
  const entry = assets[clip.assetId];
  const label = entry?.asset.originalFileName ?? clip.assetId;
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: clip.id,
    data: { type: 'clip', kind: track.kind, label },
  });
  const assetDur = entry?.asset.durationSeconds ?? 0;
  const spriteReady = entry?.status === 'ready' && !!entry.asset.thumbnailSpriteUrl && track.kind === 'video';
  const left = clip.timelineStart * zoom;
  const width = Math.max(8, clipDuration(clip) * zoom);
  const selected = selectedClipIds.includes(clip.id);

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(clip.id, e.metaKey || e.ctrlKey || e.shiftKey);
      }}
      className={`absolute top-1 bottom-1 rounded-md overflow-hidden border touch-none cursor-grab active:cursor-grabbing ${
        selected ? 'border-blue-500 ring-1 ring-blue-500' : 'border-border'
      } ${track.kind === 'video' ? 'bg-blue-900/40' : 'bg-emerald-900/40'} ${isDragging ? 'opacity-40' : ''}`}
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
      <div className="absolute inset-x-0 top-0 px-1.5 py-0.5 text-[10px] text-white/90 truncate bg-black/30 pointer-events-none">
        {entry?.asset.originalFileName ?? clip.assetId}
      </div>
      <div
        className="absolute left-0 top-0 bottom-0 w-2 cursor-ew-resize bg-white/20 hover:bg-white/50 touch-none"
        onPointerDown={(e) => onTrimDown(e, 'l', clip, assetDur)}
        onPointerMove={onTrimMove}
        onPointerUp={onTrimUp}
      />
      <div
        className="absolute right-0 top-0 bottom-0 w-2 cursor-ew-resize bg-white/20 hover:bg-white/50 touch-none"
        onPointerDown={(e) => onTrimDown(e, 'r', clip, assetDur)}
        onPointerMove={onTrimMove}
        onPointerUp={onTrimUp}
      />
    </div>
  );
};

export default Timeline;
