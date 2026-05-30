import React from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  pointerWithin,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core';
import { ArrowLeft, Loader2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocalization } from '@/i18n/useLocalization';
import { useStudioStore, clipDuration, clipEnd } from '@/lib/studioStore';
import { useProjectQuery, useProjectAssetsQuery, useSaveProject } from '@/lib/useStudioProject';
import MediaBin from './media-bin';
import PreviewSurface from './preview-surface';
import Timeline from './timeline';
import ExportDialog from './export-dialog';
import ClipInspector from './clip-inspector';

const AUTOSAVE_DEBOUNCE_MS = 1200;
const SNAP_PX = 8;

// snapValue nudges a dragged clip's start so its leading/trailing edge clicks
// onto a nearby snap point (neighbour edges on the destination track, the
// playhead, or 0).
function snapValue(desired: number, dur: number, points: number[], thresholdSec: number): number {
  for (const p of points) {
    if (Math.abs(desired - p) <= thresholdSec) return Math.max(0, p);
  }
  for (const p of points) {
    if (Math.abs(desired + dur - p) <= thresholdSec) return Math.max(0, p - dur);
  }
  return desired;
}

/**
 * Editor — hydrates the Zustand store from the loaded project + assets, runs a
 * debounced autosave (Phase 4 expands this), and lays out the media bin /
 * preview / timeline. Server I/O stays in the query hooks; the store is the
 * single source of editing truth.
 */
const Editor: React.FC<{ projectId: string; onClose: () => void }> = ({ projectId, onClose }) => {
  const { t } = useLocalization('interface');
  const projectQuery = useProjectQuery(projectId);
  const assetsQuery = useProjectAssetsQuery(projectId);
  const saveMutation = useSaveProject();

  const loadProject = useStudioStore((s) => s.loadProject);
  const setAssets = useStudioStore((s) => s.setAssets);
  const closeProject = useStudioStore((s) => s.closeProject);
  const markSaved = useStudioStore((s) => s.markSaved);
  const toSaveRequest = useStudioStore((s) => s.toSaveRequest);
  const project = useStudioStore((s) => s.project);
  const dirty = useStudioStore((s) => s.dirty);
  // The id of the project currently hydrated in the store. We gate hydration on
  // this (not a ref) so it stays correct under React StrictMode's
  // mount→unmount→remount cycle, where the simulated unmount runs the
  // closeProject cleanup below and clears the store.
  const storeProjectId = useStudioStore((s) => s.project?.id ?? null);

  const saveTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const saveRef = React.useRef(saveMutation);
  saveRef.current = saveMutation;

  // Shared drag-and-drop: clips (reposition / move between tracks) and media-bin
  // assets (drop onto a track) are all dragged within this one DndContext.
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));
  const [activeDragLabel, setActiveDragLabel] = React.useState<string | null>(null);

  const onDragStart = (e: DragStartEvent) => {
    const data = e.active.data.current as { label?: string } | undefined;
    setActiveDragLabel(data?.label ?? null);
  };

  const onDragEnd = (e: DragEndEvent) => {
    setActiveDragLabel(null);
    const st = useStudioStore.getState();
    const data = e.active.data.current as { type?: string; assetId?: string; kind?: string } | undefined;
    const overId = e.over ? String(e.over.id) : null;
    const targetTrack = overId ? st.project?.tracks.find((tr) => tr.id === overId) : null;

    // Asset dropped from the media bin onto a track (kind must match).
    if (data?.type === 'asset' && data.assetId) {
      if (!targetTrack || data.kind !== targetTrack.kind) return;
      st.addClipFromAssetToTrack(data.assetId, targetTrack.id);
      return;
    }

    // Clip moved: reposition within its track, or move to another track of the
    // same kind. Horizontal delta sets the new start; the destination track's
    // neighbours + playhead provide snap points.
    const clipId = String(e.active.id);
    const found = st.findClip(clipId);
    if (!found) return;
    const dest = targetTrack ?? found.track;
    const dur = clipDuration(found.clip);
    const desired = Math.max(0, found.clip.timelineStart + e.delta.x / st.zoom);
    const points: number[] = [0, st.playhead];
    for (const c of dest.clips) {
      if (c.id !== clipId) points.push(c.timelineStart, clipEnd(c));
    }
    const snapped = snapValue(desired, dur, points, SNAP_PX / st.zoom);
    if (dest.id !== found.track.id) {
      if (dest.kind !== found.track.kind) return; // never mix video/audio
      st.moveClipToTrack(clipId, dest.id, snapped);
    } else {
      st.moveClip(clipId, snapped);
    }
  };

  // Hydrate the store from the loaded project whenever the store isn't already
  // showing it. Self-heals if the store was cleared (StrictMode / navigation).
  React.useEffect(() => {
    if (projectQuery.data && storeProjectId !== projectQuery.data.id) {
      loadProject(projectQuery.data);
    }
  }, [projectQuery.data, storeProjectId, loadProject]);

  // Seed the media bin once the matching project is in the store; re-seeds if
  // the store is cleared and reloaded.
  React.useEffect(() => {
    if (assetsQuery.data && storeProjectId === projectId) {
      setAssets(assetsQuery.data);
    }
  }, [assetsQuery.data, storeProjectId, projectId, setAssets]);

  // Clear the store when leaving the editor.
  React.useEffect(() => () => closeProject(), [closeProject]);

  // Debounced autosave whenever the EDL is dirty. Uses a ref for the mutation
  // so edits settle for AUTOSAVE_DEBOUNCE_MS instead of restarting the timer on
  // every render.
  React.useEffect(() => {
    if (!dirty || storeProjectId !== projectId) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      const req = toSaveRequest();
      if (!req) return;
      saveRef.current
        .mutateAsync({ id: projectId, req })
        .then((saved) => markSaved(saved))
        .catch(() => {
          /* surfaced by the mutation; will retry on next edit */
        });
    }, AUTOSAVE_DEBOUNCE_MS);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [dirty, projectId, storeProjectId, toSaveRequest, markSaved]);

  // Flush a pending edit when leaving the editor so a debounced save in flight
  // isn't lost on unmount/close.
  React.useEffect(
    () => () => {
      const st = useStudioStore.getState();
      if (st.dirty) {
        const req = st.toSaveRequest();
        if (req) saveRef.current.mutate({ id: projectId, req });
      }
    },
    [projectId],
  );

  // Keyboard shortcuts: space=play/pause, ←/→=frame step, S=split,
  // Del/Backspace=ripple delete, +/-=zoom. Ignored while typing in a field or
  // when a dialog is open.
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = document.activeElement as HTMLElement | null;
      if (el) {
        const tag = el.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || tag === 'BUTTON' || el.isContentEditable) return;
        if (el.closest('[role="dialog"]')) return;
      }
      const st = useStudioStore.getState();
      const fps = Math.max(1, st.project?.fps ?? 30);
      switch (e.key) {
        case ' ':
          e.preventDefault();
          st.togglePlay();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          st.pause();
          st.setPlayhead(st.playhead - 1 / fps);
          break;
        case 'ArrowRight':
          e.preventDefault();
          st.pause();
          st.setPlayhead(st.playhead + 1 / fps);
          break;
        case 's':
        case 'S':
          e.preventDefault();
          st.splitAtPlayhead();
          break;
        case 'Delete':
        case 'Backspace':
          e.preventDefault();
          st.deleteSelected();
          break;
        case '+':
        case '=':
          e.preventDefault();
          st.zoomBy(1.25);
          break;
        case '-':
        case '_':
          e.preventDefault();
          st.zoomBy(1 / 1.25);
          break;
        default:
          break;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  if (projectQuery.isError) {
    return (
      <div className="p-8 text-center">
        <p className="text-destructive mb-4">{t('contentStudio.editor.loadError')}</p>
        <Button variant="outline" onClick={onClose}>
          {t('contentStudio.editor.back')}
        </Button>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-12 flex items-center justify-center text-muted-foreground">
        <Loader2 className="w-5 h-5 animate-spin mr-2" />
        {t('contentStudio.editor.loading')}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* toolbar */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <Button variant="ghost" size="sm" onClick={onClose}>
            <ArrowLeft className="w-4 h-4 mr-1" />
            {t('contentStudio.editor.back')}
          </Button>
          <span className="font-semibold text-card-foreground truncate">{project.name}</span>
          <SaveStatus saving={saveMutation.isPending} dirty={dirty} />
        </div>
        <ExportDialog projectId={projectId} disabled={!project.tracks.some((tr) => tr.clips.length > 0)} />
      </div>

      {/* Timeline editing is pointer-heavy; nudge small screens toward desktop. */}
      <p className="lg:hidden text-xs text-amber-500/90 -mt-1">{t('contentStudio.editor.mobileHint')}</p>

      {/* Media bin + timeline share one DndContext so assets can be dragged from
          the bin onto a track and clips can be moved between tracks. */}
      <DndContext sensors={sensors} collisionDetection={pointerWithin} onDragStart={onDragStart} onDragEnd={onDragEnd}>
        {/* media bin + preview + inspector */}
        <div className="grid gap-4 lg:grid-cols-[280px_1fr] xl:grid-cols-[280px_1fr_320px]">
          <div className="bg-card sci-fi-frame-inner p-4 h-[360px]">
            <MediaBin projectId={projectId} />
          </div>
          <div className="bg-card p-4 rounded-lg border border-border">
            <PreviewSurface />
          </div>
          <div className="lg:col-span-2 xl:col-span-1 xl:h-[360px]">
            <ClipInspector />
          </div>
        </div>

        {/* timeline */}
        <div className="mt-4">
          <Timeline />
        </div>

        <DragOverlay dropAnimation={null}>
          {activeDragLabel ? (
            <div className="rounded-md border border-blue-500 bg-blue-900/80 px-2 py-1 text-[11px] text-white shadow-lg max-w-[200px] truncate">
              {activeDragLabel}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <p className="hidden md:block text-[11px] text-muted-foreground/70">{t('contentStudio.editor.shortcuts')}</p>
    </div>
  );
};

const SaveStatus: React.FC<{ saving: boolean; dirty: boolean }> = ({ saving, dirty }) => {
  const { t } = useLocalization('interface');
  if (saving) {
    return (
      <span className="text-xs text-muted-foreground inline-flex items-center gap-1">
        <Loader2 className="w-3 h-3 animate-spin" />
        {t('contentStudio.editor.saving')}
      </span>
    );
  }
  if (dirty) {
    return <span className="text-xs text-amber-500">{t('contentStudio.editor.unsaved')}</span>;
  }
  return (
    <span className="text-xs text-muted-foreground inline-flex items-center gap-1">
      <Check className="w-3 h-3 text-emerald-500" />
      {t('contentStudio.editor.saved')}
    </span>
  );
};

export default Editor;
