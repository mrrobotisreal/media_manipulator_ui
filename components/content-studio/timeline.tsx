'use client';

import React from 'react';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import { toast } from 'sonner';
import {
  ZoomIn,
  ZoomOut,
  Scissors,
  Volume2,
  VolumeX,
  Plus,
  Trash2,
  Diamond,
  ImageIcon,
  AlertTriangle,
  Lock,
  LockOpen,
  Eye,
  EyeOff,
  Headphones,
  Magnet,
  Flag,
  Keyboard,
  Link as LinkIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { trackAcceptsAsset } from '@/lib/studio/trackRules';
import { assetDisplayName, isClipOffline } from '@/lib/studio/mediaBin';
import { clipTrimBound } from '@/lib/studio/clipTrimBound';
import { analytics, EVENTS, imageHoldBucket } from '@/lib/analytics';
import { Slider } from '@/components/ui/slider';
import { useLocalization } from '@/i18n/useLocalization';
import { useStudioStore, clipDuration, clipEnd, type StudioToolMode } from '@/lib/studioStore';
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
import { editSummary, studioHost } from '@/lib/studio/telemetry';
import { trimPatch, clipSpeed, isReversed, isFreezeClip } from '@/lib/studio/speed';
import { findEditPair, canSlip, EDIT_EPS } from '@/lib/studio/proTrim';
import { runCommand } from '@/lib/studio/commands';
import {
  DEFAULT_TRACK_HEIGHT,
  MAX_TRACK_HEIGHT,
  MIN_TRACK_HEIGHT,
  clampTrackHeight,
  loadTrackHeights,
  saveTrackHeights,
} from '@/lib/studio/trackHeights';
import ToolPalette from './tool-palette';
import { MarkersPanel, RulerMarkers } from './markers-panel';
import { speedDialog } from '@/lib/studio/speedDialog';
import ClipWaveform from './clip-waveform';
import { useUndoGesture } from './useUndoGesture';
import { CaptionControls, CaptionLaneContent, CAPTION_LANE_HEIGHT } from './caption-lane';
import type { StudioClip, StudioMediaKind, StudioTrack, StudioTransitionType } from '@/lib/studioTypes';

const RULER_HEIGHT = 28;
const LABEL_WIDTH = 112;
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
  const setClipVolume = useStudioStore((s) => s.setClipVolume);
  const volumeGesture = useUndoGesture();
  const toolMode = useStudioStore((s) => s.toolMode);
  const snapping = useStudioStore((s) => s.snapping);
  const markersPanelOpen = useStudioStore((s) => s.markersPanelOpen);
  const lockNotice = useStudioStore((s) => s.lockNotice);
  const projectId = useStudioStore((s) => s.project?.id);

  // Lane heights are a view preference (localStorage per project), not
  // document state — they never touch the EDL or undo history.
  const [heightState, setHeightState] = React.useState<{ pid?: string; map: Record<string, number> }>({ map: {} });
  // Lazily (re)load when the project changes — derived during render, not in an effect.
  if (projectId && heightState.pid !== projectId) {
    setHeightState({ pid: projectId, map: loadTrackHeights(projectId) });
  }
  const heights = heightState.map;
  const setHeights = React.useCallback(
    (fn: (prev: Record<string, number>) => Record<string, number>) =>
      setHeightState((st) => ({ ...st, map: fn(st.map) })),
    [],
  );
  const heightOf = React.useCallback((id: string) => heights[id] ?? DEFAULT_TRACK_HEIGHT, [heights]);

  // Locked-track rejection (store-level) -> subtle shake + toast. The store
  // bumps `seq` on every rejection; a ref makes the effect fire once per bump.
  const [shakeTrackId, setShakeTrackId] = React.useState<string | null>(null);
  const lastNoticeSeq = React.useRef(0);
  React.useEffect(() => {
    if (!lockNotice || lockNotice.seq === lastNoticeSeq.current) return;
    lastNoticeSeq.current = lockNotice.seq;
    setShakeTrackId(lockNotice.trackId);
    toast.message(t('contentStudio.timeline.trackLockedToast'), { id: 'darkroom-track-locked' });
    const h = setTimeout(() => setShakeTrackId(null), 450);
    return () => clearTimeout(h);
  }, [lockNotice, t]);

  const contentRef = React.useRef<HTMLDivElement>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  // One edge-drag gesture. `mode` is picked on pointer-down from the modifiers
  // and the neighbourhood: a plain trim, a ROLL (the handle sits on a shared
  // edit point, so both clips move with it), or a RIPPLE trim (Shift held).
  const trimRef = React.useRef<
    null | {
      mode: 'trim' | 'roll' | 'ripple';
      side: 'l' | 'r';
      clipId: string;
      trackId: string;
      startX: number;
      orig: StudioClip;
      assetDur: number;
      /** timeline time of the shared edit point (roll only); follows the edit as it moves */
      editTime: number;
      /** timeline seconds applied so far (roll / ripple) */
      applied: number;
    }
  >(null);
  const handRef = React.useRef<null | { startX: number; startScroll: number }>(null);
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
      e.stopPropagation(); // the hand tool's pan listener lives on the parent
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
      const st = useStudioStore.getState();
      const track = st.project?.tracks.find((tr) => tr.clips.some((c) => c.id === clip.id));
      if (!track) return;
      if (track.locked) {
        st.notifyLocked(track.id);
        return;
      }
      (e.currentTarget as Element).setPointerCapture(e.pointerId);
      // Roll applies when this edge is shared with a touching neighbour and the
      // user did not hold Alt (Alt = trim this clip only); Shift = ripple.
      const sorted = [...track.clips].sort((a, b) => a.timelineStart - b.timelineStart);
      const idx = sorted.findIndex((c) => c.id === clip.id);
      const partner = side === 'r' ? sorted[idx + 1] : sorted[idx - 1];
      const edgeTime = side === 'r' ? clipEnd(clip) : clip.timelineStart;
      const shared =
        !!partner &&
        !!findEditPair(track.clips, edgeTime) &&
        Math.abs((side === 'r' ? partner.timelineStart : clipEnd(partner)) - edgeTime) <= EDIT_EPS;
      const mode: 'trim' | 'roll' | 'ripple' = e.shiftKey ? 'ripple' : shared && !e.altKey ? 'roll' : 'trim';
      trimRef.current = {
        mode,
        side,
        clipId: clip.id,
        trackId: track.id,
        startX: e.clientX,
        orig: { ...clip },
        assetDur,
        editTime: edgeTime,
        applied: 0,
      };
      st.selectClip(clip.id);
      // The whole trim drag collapses to one undo entry (closed in onTrimUp).
      st.beginGesture();
    },
    [],
  );

  const onTrimMove = React.useCallback(
    (e: React.PointerEvent) => {
      const d = trimRef.current;
      if (!d) return;
      const deltaSec = (e.clientX - d.startX) / zoom;
      const st = useStudioStore.getState();
      if (d.mode === 'roll') {
        d.applied += st.rollEdit(d.trackId, d.editTime, deltaSec - d.applied);
        d.editTime = (d.side === 'r' ? clipEnd(d.orig) : d.orig.timelineStart) + d.applied;
        return;
      }
      if (d.mode === 'ripple') {
        d.applied += st.rippleTrimClip(d.clipId, d.side, deltaSec - d.applied);
        return;
      }
      // Speed-aware (part 17): the drag is in TIMELINE seconds; trimPatch maps
      // it through the clip's speed/direction (identical to the classic
      // sourceIn/sourceOut arithmetic at 1x forward).
      const patch = trimPatch(d.orig, d.side, deltaSec, { assetDuration: d.assetDur });
      if (d.side === 'l') {
        updateClip(d.clipId, { sourceIn: patch.sourceIn, sourceOut: patch.sourceOut, timelineStart: patch.timelineStart });
      } else {
        updateClip(d.clipId, { sourceIn: patch.sourceIn, sourceOut: patch.sourceOut });
      }
    },
    [updateClip, zoom],
  );

  const onTrimUp = React.useCallback((e: React.PointerEvent) => {
    if (!trimRef.current) return;
    const trim = trimRef.current;
    trimRef.current = null;
    (e.currentTarget as Element).releasePointerCapture?.(e.pointerId);
    useStudioStore.getState().endGesture();
    // Part 18: trims by mode (one count per gesture that actually moved something).
    if (trim.mode === 'roll' && trim.applied !== 0) {
      editSummary.increment('trimsRoll');
      editSummary.increment('uiInvocations');
    } else if (trim.mode === 'ripple' && trim.applied !== 0) {
      editSummary.increment('trimsRipple');
      editSummary.increment('uiInvocations');
    }
    // Still images: report how long the hold ended up when the right edge grew
    // (once per gesture, bucketed — no ids).
    if (trim && trim.side === 'r' && trim.assetDur === Number.POSITIVE_INFINITY && !trim.orig.title) {
      const st = useStudioStore.getState();
      let now: StudioClip | undefined;
      for (const tr of st.project?.tracks ?? []) {
        now = tr.clips.find((c) => c.id === trim.clipId) ?? now;
      }
      if (now && now.sourceOut > trim.orig.sourceOut) {
        analytics.track(
          EVENTS.STUDIO_IMAGE_CLIP_EXTENDED,
          { durationBucket: imageHoldBucket(now.sourceOut - now.sourceIn), host: studioHost() },
          { feature: 'studio' },
        );
      }
    }
  }, []);

  // Hand tool: dragging anywhere on the lanes pans the scroll container.
  const onHandDown = (e: React.PointerEvent) => {
    if (toolMode !== 'hand') return;
    const sc = scrollRef.current;
    if (!sc) return;
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
    handRef.current = { startX: e.clientX, startScroll: sc.scrollLeft };
  };
  const onHandMove = (e: React.PointerEvent) => {
    const h = handRef.current;
    const sc = scrollRef.current;
    if (!h || !sc) return;
    sc.scrollLeft = Math.max(0, h.startScroll - (e.clientX - h.startX));
  };
  const onHandUp = (e: React.PointerEvent) => {
    if (!handRef.current) return;
    handRef.current = null;
    (e.currentTarget as Element).releasePointerCapture?.(e.pointerId);
  };

  // Track-header height resize (view preference; persisted per project).
  const resizeRef = React.useRef<null | { id: string; startY: number; h0: number }>(null);
  const onResizeDown = (e: React.PointerEvent, id: string) => {
    e.stopPropagation();
    e.preventDefault();
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
    resizeRef.current = { id, startY: e.clientY, h0: heightOf(id) };
  };
  const onResizeMove = (e: React.PointerEvent) => {
    const r = resizeRef.current;
    if (!r) return;
    const h = clampTrackHeight(r.h0 + (e.clientY - r.startY));
    setHeights((prev) => (prev[r.id] === h ? prev : { ...prev, [r.id]: h }));
  };
  const onResizeUp = (e: React.PointerEvent) => {
    if (!resizeRef.current) return;
    resizeRef.current = null;
    (e.currentTarget as Element).releasePointerCapture?.(e.pointerId);
    if (projectId) saveTrackHeights(projectId, heights);
    editSummary.increment('trackControlChanges');
    editSummary.increment('uiInvocations');
  };

  if (!project) return null;
  const contentWidth = Math.max(800, (duration + 4) * zoom);
  const lanesHeight = tracks.reduce((sum, tr) => sum + heightOf(tr.id), 0);
  const anySoloTrack = tracks.some((tr) => tr.kind === 'audio' && tr.solo);

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
          <Button
            size="icon"
            variant="ghost"
            className={`h-7 w-7 ${snapping ? 'text-primary' : 'text-muted-foreground'}`}
            aria-pressed={snapping}
            onClick={() => runCommand('edit.toggleSnapping', 'ui')}
            title={`${t('contentStudio.timeline.snapping')} (S)`}
            aria-label={t('contentStudio.timeline.snapping')}
          >
            <Magnet className="w-4 h-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className={`h-7 w-7 ${markersPanelOpen ? 'text-primary' : 'text-muted-foreground'}`}
            aria-pressed={markersPanelOpen}
            onClick={() => runCommand('view.toggleMarkersPanel', 'ui')}
            title={`${t('contentStudio.timeline.markersPanel')} (Shift+M)`}
            aria-label={t('contentStudio.timeline.markersPanel')}
          >
            <Flag className="w-4 h-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7 text-muted-foreground"
            onClick={() => runCommand('view.cheatSheet', 'ui')}
            title={`${t('contentStudio.keymap.title')} (?)`}
            aria-label={t('contentStudio.keymap.title')}
          >
            <Keyboard className="w-4 h-4" />
          </Button>
          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => zoomBy(1 / 1.25)} title={t('contentStudio.timeline.zoomOut')}>
            <ZoomOut className="w-4 h-4" />
          </Button>
          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => zoomBy(1.25)} title={t('contentStudio.timeline.zoomIn')}>
            <ZoomIn className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {markersPanelOpen && <MarkersPanel />}

      <div className="flex">
        <ToolPalette />
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
            <TrackHeader
              key={track.id}
              track={track}
              height={heightOf(track.id)}
              soloActive={anySoloTrack}
              onResizeDown={onResizeDown}
              onResizeMove={onResizeMove}
              onResizeUp={onResizeUp}
            />
          ))}
        </div>

        {/* scrollable timeline */}
        <div ref={scrollRef} className="flex-1 overflow-x-auto">
          <div
            ref={contentRef}
            className={`relative ${toolMode === 'hand' ? 'cursor-grab active:cursor-grabbing' : ''}`}
            style={{ width: contentWidth }}
            onPointerDown={onHandDown}
            onPointerMove={onHandMove}
            onPointerUp={onHandUp}
            onPointerCancel={onHandUp}
          >
            {/* ruler */}
            <div
              className="relative bg-muted/40 cursor-pointer select-none touch-none border-b border-border"
              style={{ height: RULER_HEIGHT }}
              onPointerDown={onRulerDown}
              onPointerMove={onRulerMove}
              onPointerUp={onRulerUp}
            >
              <RulerTicks duration={duration} zoom={zoom} startSec={win.startSec} endSec={win.endSec} />
              <RulerMarkers zoom={zoom} startSec={win.startSec} endSec={win.endSec} />
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
                height={heightOf(track.id)}
                shaking={shakeTrackId === track.id}
                toolMode={toolMode}
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
              height={RULER_HEIGHT + CAPTION_LANE_HEIGHT + lanesHeight}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * One lane's header: inline-renamable name, lock, hide (video) / solo + mute
 * (audio), delete-when-empty, and a bottom drag handle that resizes the lane.
 * Every toggle is a store action (one undo entry) counted into the edit
 * summary as a 'ui' track-control change.
 */
const TrackHeader: React.FC<{
  track: StudioTrack;
  height: number;
  soloActive: boolean;
  onResizeDown: (e: React.PointerEvent, id: string) => void;
  onResizeMove: (e: React.PointerEvent) => void;
  onResizeUp: (e: React.PointerEvent) => void;
}> = ({ track, height, soloActive, onResizeDown, onResizeMove, onResizeUp }) => {
  const { t } = useLocalization('interface');
  const toggleTrackMute = useStudioStore((s) => s.toggleTrackMute);
  const toggleTrackLock = useStudioStore((s) => s.toggleTrackLock);
  const toggleTrackHidden = useStudioStore((s) => s.toggleTrackHidden);
  const toggleTrackSolo = useStudioStore((s) => s.toggleTrackSolo);
  const setTrackName = useStudioStore((s) => s.setTrackName);
  const removeTrack = useStudioStore((s) => s.removeTrack);
  const defaultName = `${track.kind === 'video' ? 'V' : 'A'}${track.index + 1}`;
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState('');
  const counted = (fn: () => void) => () => {
    fn();
    editSummary.increment('trackControlChanges');
    editSummary.increment('uiInvocations');
  };
  const commitName = () => {
    setEditing(false);
    if (draft.trim() !== (track.name ?? '')) {
      setTrackName(track.id, draft);
      editSummary.increment('trackControlChanges');
      editSummary.increment('uiInvocations');
    }
  };
  const btn = (on: boolean, tone: string) =>
    `p-0.5 rounded hover:bg-muted ${on ? tone : 'text-muted-foreground'}`;
  const isAudio = track.kind === 'audio';
  // Solo wins over mute: while any track solos, a non-soloed track reads as dimmed.
  const dimmed = soloActive && !(isAudio && track.solo);
  return (
    <div
      style={{ height }}
      className={`relative flex flex-col items-center justify-center gap-1 border-b border-border px-1 text-xs font-medium text-muted-foreground ${
        dimmed ? 'opacity-50' : ''
      }`}
      data-track-header={track.id}
    >
      {editing ? (
        <input
          autoFocus
          value={draft}
          maxLength={80}
          aria-label={t('contentStudio.timeline.renameTrack')}
          className="h-5 w-full rounded border border-input bg-background px-1 text-center text-[11px] text-foreground outline-none focus-visible:ring-1 focus-visible:ring-ring"
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commitName}
          onKeyDown={(e) => {
            if (e.key === 'Enter') (e.currentTarget as HTMLInputElement).blur();
            if (e.key === 'Escape') {
              setDraft(track.name ?? '');
              setEditing(false);
            }
          }}
        />
      ) : (
        <button
          type="button"
          className="max-w-full truncate rounded px-1 hover:bg-muted hover:text-foreground"
          title={t('contentStudio.timeline.renameTrackHint')}
          onDoubleClick={() => {
            setDraft(track.name ?? '');
            setEditing(true);
          }}
        >
          {track.name || defaultName}
        </button>
      )}
      <div className="flex flex-wrap items-center justify-center gap-0.5">
        <button
          type="button"
          onClick={counted(() => toggleTrackLock(track.id))}
          aria-pressed={!!track.locked}
          className={btn(!!track.locked, 'text-premium')}
          title={track.locked ? t('contentStudio.timeline.unlock') : t('contentStudio.timeline.lock')}
        >
          {track.locked ? <Lock className="h-3.5 w-3.5" /> : <LockOpen className="h-3.5 w-3.5" />}
        </button>
        {isAudio ? (
          <button
            type="button"
            onClick={counted(() => toggleTrackSolo(track.id))}
            aria-pressed={!!track.solo}
            className={btn(!!track.solo, 'text-primary')}
            title={track.solo ? t('contentStudio.timeline.unsolo') : t('contentStudio.timeline.solo')}
          >
            <Headphones className="h-3.5 w-3.5" />
          </button>
        ) : (
          <button
            type="button"
            onClick={counted(() => toggleTrackHidden(track.id))}
            aria-pressed={!!track.hidden}
            className={btn(!!track.hidden, 'text-destructive')}
            title={track.hidden ? t('contentStudio.timeline.show') : t('contentStudio.timeline.hide')}
          >
            {track.hidden ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
          </button>
        )}
        <button
          type="button"
          onClick={counted(() => toggleTrackMute(track.id))}
          aria-pressed={track.muted}
          className={btn(track.muted, 'text-destructive')}
          title={track.muted ? t('contentStudio.timeline.unmute') : t('contentStudio.timeline.mute')}
        >
          {track.muted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
        </button>
        {track.clips.length === 0 && !track.locked && (
          <button
            type="button"
            onClick={() => removeTrack(track.id)}
            className="rounded p-0.5 text-muted-foreground hover:bg-muted hover:text-destructive"
            title={t('contentStudio.timeline.deleteTrack')}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
      {/* Height resize handle (view preference; persisted per project). */}
      <div
        role="separator"
        aria-orientation="horizontal"
        aria-label={t('contentStudio.timeline.resizeTrack')}
        className="absolute inset-x-0 bottom-0 h-1.5 cursor-row-resize touch-none hover:bg-primary/40"
        onPointerDown={(e) => onResizeDown(e, track.id)}
        onPointerMove={onResizeMove}
        onPointerUp={onResizeUp}
        onPointerCancel={onResizeUp}
        data-min={MIN_TRACK_HEIGHT}
        data-max={MAX_TRACK_HEIGHT}
      />
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
  height: number;
  shaking: boolean;
  toolMode: StudioToolMode;
  selectedClipIds: string[];
  assets: ReturnType<typeof useStudioStore.getState>['assets'];
  onSelect: (id: string | null, additive?: boolean) => void;
  onTrimDown: (e: React.PointerEvent, side: 'l' | 'r', clip: StudioClip, assetDur: number) => void;
  onTrimMove: (e: React.PointerEvent) => void;
  onTrimUp: (e: React.PointerEvent) => void;
}

const TrackRowImpl: React.FC<TrackRowProps> = (props) => {
  const { setNodeRef, isOver, active } = useDroppable({ id: props.track.id, data: { kind: props.track.kind } });
  const activeData = active?.data.current as { type?: string; kind?: string } | undefined;
  const activeKind = activeData?.kind;
  const accepts =
    activeData?.type === 'asset'
      ? trackAcceptsAsset(props.track.kind, activeKind as StudioMediaKind)
      : activeKind === props.track.kind;
  const compatible = !!active && accepts;
  const incompatible = !!active && !accepts;

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
      data-track-id={props.track.id}
      data-locked={props.track.locked || undefined}
      className={`relative border-b border-border ${props.track.muted ? 'opacity-60' : ''} ${props.track.hidden ? 'opacity-40' : ''} ${props.shaking ? 'cs-lock-shake' : ''} ${
        isOver && compatible ? 'bg-primary/10 ring-1 ring-inset ring-primary/60' : ''
      } ${isOver && incompatible ? 'bg-destructive/10 ring-1 ring-inset ring-destructive/50' : ''}`}
      style={{
        height: props.height,
        ...(props.track.locked
          ? { backgroundImage: 'repeating-linear-gradient(135deg, color-mix(in srgb, var(--muted-foreground) 14%, transparent) 0 2px, transparent 2px 9px)' }
          : {}),
      }}
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
          height={props.height}
          toolMode={props.toolMode}
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

type ClipBlockProps = Omit<
  TrackRowProps,
  'selectedClipIds' | 'windowStartSec' | 'windowEndSec' | 'height' | 'shaking'
> & {
  clip: StudioClip;
  selected: boolean;
  height: number;
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
  height,
  toolMode,
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
    : entry
      ? assetDisplayName(entry.asset)
      : clip.assetId;
  // Part 21: an undone usage-protected delete leaves clips pointing at a dead
  // asset. Render them as an offline chip instead of crashing or looking empty.
  const assetsLoaded = useStudioStore((s) => s.assetsLoaded);
  const offline = isClipOffline(clip, assets, assetsLoaded);
  // Dragging only exists in the Selection tool, and never on a locked lane
  // (the store would reject the move anyway; this keeps the cursor honest).
  const locked = !!track.locked;
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: clip.id,
    data: { type: 'clip', kind: track.kind, label },
    disabled: toolMode !== 'select' || locked,
  });
  const isImage = entry?.asset.mediaKind === 'image';
  const assetDur = clipTrimBound(entry?.asset, isTitle);
  const ready = entry?.status === 'ready';
  // Speed controls (part 17): the filmstrip scales with the rate, mirrors for
  // reverse, and is replaced by a held-frame chip for freeze clips.
  const speedRate = clipSpeed(clip);
  const reversedClip = isReversed(clip);
  const freezeClip = isFreezeClip(clip);
  const speedBadge = freezeClip
    ? t('contentStudio.speed.badgeFreeze')
    : `${reversedClip ? '◀ ' : ''}${speedRate !== 1 ? `${Math.round(speedRate * 1000) / 10}%` : ''}`.trim();
  const spriteReady =
    ready && !!entry?.asset.thumbnailSpriteUrl && track.kind === 'video' && !isImage && !freezeClip;
  const imageThumb = isImage && !!entry?.asset.thumbnailSpriteUrl;
  // Waveform: full block on audio tracks, a bottom strip (~35%) under the
  // filmstrip on video-track clips that carry audio. Rubber-band editing only on
  // audio tracks (video strips are too thin); the inspector handles the rest.
  const isAudioTrack = track.kind === 'audio';
  const contentH = height - 8; // matches the top-1/bottom-1 insets
  const showWaveform = ready && !!entry?.asset.hasAudio;
  const waveH = isAudioTrack ? contentH : Math.round(contentH * 0.35);

  // --- typed transition (part 14): overlap region + drag-to-retime -----------
  const transition = clip.transition;
  const clipDur = clipDuration(clip);
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

  // --- pro tools (part 18): razor click, slip / slide drags, roll affordance ---
  const proRef = React.useRef<null | { mode: 'slip' | 'slide'; startX: number; applied: number }>(null);
  const [slipReadout, setSlipReadout] = React.useState<number | null>(null);
  const slipOk = canSlip(clip, assetDur);
  const prevTouches = track.clips.some((c) => c.id !== clip.id && Math.abs(clipEnd(c) - clip.timelineStart) <= EDIT_EPS);
  const nextTouches = track.clips.some((c) => c.id !== clip.id && Math.abs(c.timelineStart - clipEnd(clip)) <= EDIT_EPS);

  const onProDown = (e: React.PointerEvent) => {
    if (toolMode !== 'slip' && toolMode !== 'slide') return;
    e.stopPropagation();
    e.preventDefault();
    const st = useStudioStore.getState();
    if (locked) {
      st.notifyLocked(track.id);
      return;
    }
    if (toolMode === 'slip' && !slipOk) {
      toast.message(t('contentStudio.timeline.slipUnavailable'), { id: 'darkroom-slip-unavailable' });
      return;
    }
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
    proRef.current = { mode: toolMode, startX: e.clientX, applied: 0 };
    st.selectClip(clip.id);
    st.beginGesture(); // the whole drag is ONE undo entry
  };
  const onProMove = (e: React.PointerEvent) => {
    const d = proRef.current;
    if (!d) return;
    const dxSec = (e.clientX - d.startX) / zoom;
    const st = useStudioStore.getState();
    if (d.mode === 'slide') {
      d.applied += st.slideClip(clip.id, dxSec - d.applied);
    } else {
      // Dragging right drags the picture right: the window moves EARLIER in the
      // source. dx is timeline seconds; the window moves `speed` source s per s.
      const wantSource = -dxSec * clipSpeed(clip);
      d.applied += st.slipClip(clip.id, wantSource - d.applied);
      setSlipReadout(d.applied);
    }
  };
  const onProUp = (e: React.PointerEvent) => {
    const d = proRef.current;
    if (!d) return;
    proRef.current = null;
    setSlipReadout(null);
    (e.currentTarget as Element).releasePointerCapture?.(e.pointerId);
    useStudioStore.getState().endGesture();
    if (d.applied !== 0) {
      editSummary.increment(d.mode === 'slip' ? 'trimsSlip' : 'trimsSlide');
      editSummary.increment('uiInvocations');
    }
  };
  const onRazorClick = (e: React.MouseEvent) => {
    const st = useStudioStore.getState();
    const rect = e.currentTarget.getBoundingClientRect();
    let at = clip.timelineStart + (e.clientX - rect.left) / zoom;
    if (st.snapping && Math.abs(at - st.playhead) <= 8 / zoom) at = st.playhead; // snap the cut to the playhead
    if (st.razorAt(clip.id, at)) {
      editSummary.increment('splits');
      editSummary.increment('uiInvocations');
    } else if (!track.locked) {
      toast.message(t('contentStudio.timeline.razorMiss'), { id: 'darkroom-razor-miss' });
    }
  };
  const canDetach =
    track.kind === 'video' &&
    !isTitle &&
    !freezeClip &&
    entry?.asset.mediaKind === 'video' &&
    !!entry.asset.hasAudio &&
    !((clip.volume ?? 1) === 0 && !clip.volumeKeyframes?.length && !clip.keyframes?.volume?.length);
  const selectedCount = useStudioStore((s) => s.selectedClipIds.length);
  const canGroup = selected && selectedCount >= 2;

  const applyTransition = (type: StudioTransitionType) => {
    editSummary.increment('transitionsAdded', type);
    editSummary.increment('uiInvocations');
    useStudioStore.getState().setClipTransition(clip.id, {
      type,
      durationSeconds: clip.transition?.durationSeconds ?? defaultTransitionSeconds(track.kind),
    });
  };
  // Speed controls (part 17): not offered for stills or generated titles.
  const canRetime = !isTitle && !isImage && !!entry;
  const canFreeze = canRetime && track.kind === 'video' && !freezeClip && entry?.asset.mediaKind === 'video';
  const openSpeedDialog = () => {
    editSummary.increment('uiInvocations');
    speedDialog.open(clip.id);
  };
  const addFreezeFrame = () => {
    editSummary.increment('speedChanges');
    editSummary.increment('uiInvocations');
    const res = useStudioStore.getState().addFreezeFrame(clip.id);
    if (!res) toast.message(t('contentStudio.speed.freezeNoRoom'));
    else if (res.bounded) toast.message(t('contentStudio.speed.freezeBounded'));
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
      onClick={(e) => {
        e.stopPropagation();
        if (toolMode === 'razor') {
          onRazorClick(e);
          return;
        }
        onSelect(clip.id, e.metaKey || e.ctrlKey || e.shiftKey);
      }}
      onPointerDown={(e) => {
        // dnd-kit's own pointerdown (select tool) and the pro tools' gesture are
        // mutually exclusive by `toolMode`; compose rather than override.
        if (toolMode === 'select' && !locked) (listeners as { onPointerDown?: (ev: React.PointerEvent) => void } | undefined)?.onPointerDown?.(e);
        else onProDown(e);
      }}
      onPointerMove={toolMode === 'slip' || toolMode === 'slide' ? onProMove : undefined}
      onPointerUp={toolMode === 'slip' || toolMode === 'slide' ? onProUp : undefined}
      onPointerCancel={toolMode === 'slip' || toolMode === 'slide' ? onProUp : undefined}
      data-group-id={clip.groupId || undefined}
      className={`absolute top-1 bottom-1 rounded-md overflow-hidden border touch-none ${
        toolMode === 'razor'
          ? 'cursor-crosshair'
          : toolMode === 'slip'
            ? slipOk
              ? 'cursor-ew-resize'
              : 'cursor-not-allowed'
            : toolMode === 'slide'
              ? 'cursor-ew-resize'
              : toolMode === 'hand'
                ? 'cursor-grab'
                : locked
                  ? 'cursor-not-allowed'
                  : 'cursor-grab active:cursor-grabbing'
      } ${
        selected ? 'border-primary ring-1 ring-primary' : 'border-border'
      } ${isTitle || offline ? 'bg-surface-0' : track.kind === 'video' ? 'bg-data/20' : 'bg-data/10'} ${offline ? 'border-destructive/70 border-dashed' : ''} ${isDragging ? 'opacity-40' : ''}`}
      style={{ left, width }}
      title={offline ? t('contentStudio.mediaBin.offline') : label}
      data-offline={offline || undefined}
    >
      {offline && (
        <div className="absolute inset-0 flex items-center gap-1 px-1.5 pointer-events-none">
          <AlertTriangle className="h-3 w-3 shrink-0 text-destructive" aria-hidden />
          <span className="truncate text-[10px] text-destructive">{t('contentStudio.mediaBin.offline')}</span>
        </div>
      )}
      {spriteReady && assetDur > 0 && (
        <div
          className="absolute inset-0 opacity-40 bg-no-repeat pointer-events-none"
          style={{
            backgroundImage: `url(${studioSpriteUrl(clip.assetId)})`,
            backgroundSize: `${(assetDur * zoom) / speedRate}px 100%`,
            backgroundPositionX: `${(-clip.sourceIn * zoom) / speedRate}px`,
            // A reversed clip plays its source tail-first: mirror the strip.
            transform: reversedClip ? 'scaleX(-1)' : undefined,
          }}
        />
      )}
      {imageThumb && (
        <div
          className="absolute inset-0 opacity-50 pointer-events-none"
          style={{
            backgroundImage: `url(${studioSpriteUrl(clip.assetId)})`,
            backgroundSize: 'auto 100%',
            backgroundRepeat: 'repeat-x',
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
        <div className="absolute inset-x-0 top-0 px-1.5 py-0.5 text-[10px] text-foreground truncate bg-surface-0/30 pointer-events-none flex items-center gap-1">
          {isImage && <ImageIcon className="h-3 w-3 shrink-0 text-primary" aria-hidden />}
          <span className="truncate">{label}</span>
          {speedBadge && (
            <span
              className="ml-auto shrink-0 rounded bg-premium/25 px-1 text-[9px] font-semibold tabular-nums text-premium"
              title={t('contentStudio.speed.badgeTitle')}
            >
              {speedBadge}
            </span>
          )}
        </div>
      )}
      {/* Slip readout (part 18): the live source window while dragging. */}
      {slipReadout !== null && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex justify-center">
          <span className="rounded-t bg-surface-0/90 px-1.5 py-0.5 font-mono text-[10px] tabular-nums text-premium">
            {clip.sourceIn.toFixed(2)}s – {clip.sourceOut.toFixed(2)}s · {slipReadout >= 0 ? '+' : ''}
            {slipReadout.toFixed(2)}s
          </span>
        </div>
      )}
      {/* Group badge (part 18). */}
      {clip.groupId && (
        <LinkIcon
          className="pointer-events-none absolute bottom-0.5 right-1 z-10 h-3 w-3 text-premium"
          aria-label={t('contentStudio.timeline.grouped')}
        />
      )}
      {/* Trim handles. The visual bar stays 8px so the timeline reads
          precisely, but below `lg` a transparent ::before widens the hit area
          inward to 24px — 8px is well under a fingertip. Extending inward
          rather than outward keeps it from stealing the neighbouring clip's
          handle. */}
      <div
        data-roll={prevTouches || undefined}
        title={prevTouches ? t('contentStudio.timeline.rollHint') : undefined}
        className={`absolute left-0 top-0 bottom-0 w-2 ${prevTouches ? 'cursor-col-resize bg-primary/40 hover:bg-primary/70' : 'cursor-ew-resize bg-white/20 hover:bg-white/50'} touch-none before:absolute before:inset-y-0 before:left-0 before:w-6 before:content-[''] lg:before:hidden`}
        onPointerDown={(e) => onTrimDown(e, 'l', clip, assetDur)}
        onPointerMove={onTrimMove}
        onPointerUp={onTrimUp}
        onPointerCancel={onTrimUp}
      />
      <div
        data-roll={nextTouches || undefined}
        title={nextTouches ? t('contentStudio.timeline.rollHint') : undefined}
        className={`absolute right-0 top-0 bottom-0 w-2 ${nextTouches ? 'cursor-col-resize bg-primary/40 hover:bg-primary/70' : 'cursor-ew-resize bg-white/20 hover:bg-white/50'} touch-none before:absolute before:inset-y-0 before:right-0 before:w-6 before:content-[''] lg:before:hidden`}
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
        {canRetime && (
          <>
            <ContextMenuSeparator />
            <ContextMenuItem className="text-xs" onSelect={openSpeedDialog}>
              {t('contentStudio.speed.contextSpeedDuration')}
            </ContextMenuItem>
          </>
        )}
        {canFreeze && (
          <ContextMenuItem className="text-xs" onSelect={addFreezeFrame}>
            {t('contentStudio.speed.contextAddFreeze')}
          </ContextMenuItem>
        )}
        {(canGroup || clip.groupId || canDetach) && <ContextMenuSeparator />}
        {canGroup && (
          <ContextMenuItem className="text-xs" onSelect={() => runCommand('edit.group', 'ui')}>
            {t('contentStudio.timeline.contextGroup')}
          </ContextMenuItem>
        )}
        {clip.groupId && (
          <ContextMenuItem
            className="text-xs"
            onSelect={() => {
              if (!selected) useStudioStore.getState().selectClip(clip.id);
              runCommand('edit.ungroup', 'ui');
            }}
          >
            {t('contentStudio.timeline.contextUngroup')}
          </ContextMenuItem>
        )}
        {canDetach && (
          <ContextMenuItem
            className="text-xs"
            onSelect={() => {
              useStudioStore.getState().selectClip(clip.id);
              runCommand('edit.detachAudio', 'ui');
            }}
          >
            {t('contentStudio.timeline.contextDetachAudio')}
          </ContextMenuItem>
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
