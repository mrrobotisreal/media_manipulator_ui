'use client';

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
import {
  ArrowLeft,
  Loader2,
  Check,
  Maximize2,
  Minimize2,
  Expand,
  Shrink,
  Undo2,
  Redo2,
  WifiOff,
  AlertTriangle,
  Type,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/lib/useMediaQuery';
import { useLocalization } from '@/i18n/useLocalization';
import { useStudioStore, clipDuration, clipEnd } from '@/lib/studioStore';
import {
  useProjectQuery,
  useProjectAssetsQuery,
  useSaveProject,
  StudioSaveConflictError,
  StudioSaveHttpError,
} from '@/lib/useStudioProject';
import {
  createSaveStateMachine,
  type SaveState,
  type SaveStateEvent,
  type SaveStateMachine,
  type SaveStateSnapshot,
} from '@/lib/studio/saveState';
import {
  createDraftWriter,
  deleteDraft,
  getDraft,
  pruneDrafts,
  putDraft,
  type StudioDraft,
} from '@/lib/studio/draftStore';
import {
  evaluateDraft,
  summarizeDraftChanges,
  type DraftChangeSummary,
} from '@/lib/studio/draftRecovery';
import { useCreateVersion } from '@/lib/useStudioVersions';
import { createCheckpointScheduler } from '@/lib/studio/versionCheckpoint';
import { defaultTransitionSeconds } from '@/lib/studio/preferences';
import { analytics, EVENTS, countBucket, timelineDurationBucket } from '@/lib/analytics';
import {
  editSummary,
  markTti,
  perf,
  startStudioTelemetrySession,
  studioHost,
} from '@/lib/studio/telemetry';
import SaveConflictDialog from './save-conflict-dialog';
import DraftRecoveryDialog from './draft-recovery-dialog';
import VersionsPanel from './versions-panel';
import PreferencesDialog from './preferences-dialog';
import MediaBin from './media-bin';
import PreviewSurface from './preview-surface';
import Timeline from './timeline';
import ExportDialog from './export-dialog';
import ClipInspector from './clip-inspector';
import CaptionEditor from './caption-editor';
import AudioDuckingPopover from './audio-ducking';
import type { FocusModeApi } from './useFocusMode';
import { Panel } from '@/components/darkroom/panel';
// Title-clip fonts (part 16): loading these faces here scopes them to the
// editor routes — the marketing pages never fetch them.
import './studio-fonts.css';

const AUTOSAVE_DEBOUNCE_MS = 1200;
const SNAP_PX = 8;

// Sub-lg tab trigger. The active segment recesses onto surface-0 and takes the
// same 2px coral rule the top nav uses for its active route, so "where am I"
// reads the same way everywhere in the product. 40px tall inside a 44px strip.
const MOBILE_TAB =
  'rounded-[4px] text-sm data-[state=active]:bg-surface-0 data-[state=active]:text-foreground ' +
  "data-[state=active]:shadow-[inset_0_-2px_0_var(--accent-primary)]";

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
const Editor: React.FC<{ projectId: string; onClose: () => void; focusMode?: FocusModeApi }> = ({
  projectId,
  onClose,
  focusMode,
}) => {
  const { t } = useLocalization('interface');
  const focused = !!focusMode?.focused;
  // Below `lg` the three panels become tab panels instead of grid cells. This
  // has to be a JS breakpoint rather than a CSS one: the two layouts need
  // different trees, and rendering both would mount two preview surfaces —
  // two canvases and two Web Audio graphs playing at once. Safe here because
  // the whole editor is inside an `ssr:false` island, so there is no
  // server/client hydration to disagree about.
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const projectQuery = useProjectQuery(projectId);
  const assetsQuery = useProjectAssetsQuery(projectId);
  const saveMutation = useSaveProject();

  const loadProject = useStudioStore((s) => s.loadProject);
  const restoreDraft = useStudioStore((s) => s.restoreDraft);
  const setAssets = useStudioStore((s) => s.setAssets);
  const closeProject = useStudioStore((s) => s.closeProject);
  const markSaved = useStudioStore((s) => s.markSaved);
  const project = useStudioStore((s) => s.project);
  const dirty = useStudioStore((s) => s.dirty);
  const selectedCaptionId = useStudioStore((s) => s.selectedCaptionId);
  // The id of the project currently hydrated in the store. We gate hydration on
  // this (not a ref) so it stays correct under React StrictMode's
  // mount→unmount→remount cycle, where the simulated unmount runs the
  // closeProject cleanup below and clears the store.
  const storeProjectId = useStudioStore((s) => s.project?.id ?? null);

  const saveTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const saveRef = React.useRef(saveMutation);
  saveRef.current = saveMutation;

  // --- Save safety (part 07) -----------------------------------------------
  // The save-state machine (lib/studio/saveState.ts) wraps the debounced
  // autosave: it owns retry/backoff/offline transitions and feeds the header
  // indicator + beforeunload guard. Created per mount in an effect (StrictMode
  // runs mount→cleanup→mount, so a ref-cached instance would stay disposed).
  const machineRef = React.useRef<SaveStateMachine | null>(null);
  const [saveSnap, setSaveSnap] = React.useState<SaveStateSnapshot>({
    state: 'saved',
    attempt: 0,
    nextRetryDelayMs: null,
  });
  const dispatchSave = React.useCallback((event: SaveStateEvent) => {
    machineRef.current?.dispatch(event);
  }, []);
  // 409 details while the conflict dialog is open; autosaving is blocked then.
  const [conflict, setConflict] = React.useState<{ currentRevision: number | null } | null>(null);
  const [conflictBusy, setConflictBusy] = React.useState<'reload' | 'takeOver' | null>(null);

  // --- Crash recovery (part 08) --------------------------------------------
  // A pending IndexedDB draft offered on project open: 'recover' (based on the
  // loaded server revision) shows the recovery dialog, 'conflict' (the project
  // was saved elsewhere after the draft) shows the conflict dialog's draft
  // mode.
  const [draftOffer, setDraftOffer] = React.useState<{
    kind: 'recover' | 'conflict';
    draft: StudioDraft;
    summary: DraftChangeSummary;
  } | null>(null);
  const [draftBusy, setDraftBusy] = React.useState<'recover' | 'discard' | null>(null);
  // The document reference of the last draft write that reached IndexedDB.
  // When it matches the store's current document, unsaved work is locally safe
  // and the beforeunload guard stays quiet (ADR ws/0001 item 4, narrowed).
  const lastDraftedDocRef = React.useRef<object | null>(null);
  // One recovery check per opened project (a conflict-reload refetch must not
  // re-offer a draft that reload just invalidated).
  const draftCheckedRef = React.useRef<string | null>(null);

  /**
   * The one save path (autosave debounce, machine retries, and take-over all
   * land here). `expectedRevisionOverride`: undefined → send the store's
   * revision (normal CAS); a number → take over at that revision; null →
   * legacy last-write-wins (take-over fallback when the 409 body carried no
   * revision). Returns whether the save landed.
   */
  const runSaveRef = React.useRef<(expectedRevisionOverride?: number | null) => Promise<boolean>>(
    async () => false,
  );
  runSaveRef.current = async (expectedRevisionOverride) => {
    const st = useStudioStore.getState();
    if (st.project?.id !== projectId) return false;
    const req = st.toSaveRequest();
    if (!req) return false;
    if (expectedRevisionOverride === null) delete req.expectedRevision;
    else if (expectedRevisionOverride !== undefined) req.expectedRevision = expectedRevisionOverride;
    dispatchSave({ type: 'saveStart' });
    const saveStartedAt = performance.now();
    try {
      const saved = await saveRef.current.mutateAsync({ id: projectId, req });
      // Save round-trip feeds the perf sampler (part 10) — successful saves
      // only, so an offline retry storm can't masquerade as server latency.
      perf.sample({ saveRttMs: performance.now() - saveStartedAt });
      markSaved(saved);
      dispatchSave({ type: 'saveOk' });
      // The server now holds these edits — the crash-recovery draft is stale.
      lastDraftedDocRef.current = null;
      void deleteDraft(projectId);
      return true;
    } catch (err) {
      if (err instanceof StudioSaveConflictError) {
        analytics.track(EVENTS.STUDIO_SAVE_CONFLICT, { host: studioHost() }, { feature: 'studio' });
        setConflict({ currentRevision: err.currentRevision ?? null });
        dispatchSave({ type: 'save409' });
      } else if (err instanceof StudioSaveHttpError && err.status < 500) {
        // Non-retryable client error (409 handled above): park in `failed`
        // rather than hammering the server with a request it keeps rejecting.
        dispatchSave({ type: 'saveHardError' });
      } else {
        // Network failure or 5xx — the machine schedules a backoff retry.
        dispatchSave({ type: 'saveNetworkError' });
      }
      return false;
    }
  };

  React.useEffect(() => {
    const machine = createSaveStateMachine({
      onRetry: () => {
        void runSaveRef.current();
      },
    });
    machineRef.current = machine;
    setSaveSnap(machine.getSnapshot());
    const unsubscribe = machine.subscribe(() => setSaveSnap(machine.getSnapshot()));
    return () => {
      unsubscribe();
      machine.dispose();
      machineRef.current = null;
    };
  }, [projectId]);

  // Browser connectivity feeds the machine (offline = wait for 'online'
  // instead of burning backoff retries into a dead network).
  React.useEffect(() => {
    const onOnline = () => dispatchSave({ type: 'online' });
    const onOffline = () => dispatchSave({ type: 'offline' });
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, [dispatchSave]);

  // Warn before closing the tab whenever work has reached neither the server
  // nor the local draft buffer (ADR ws/0001 item 4). Part 08 narrowed this:
  // when the latest draft write landed after the last edit, the changes are
  // locally safe and closing costs nothing, so the prompt stays quiet.
  React.useEffect(() => {
    if (saveSnap.state === 'saved') return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      const doc = useStudioStore.getState().project;
      if (doc !== null && lastDraftedDocRef.current === doc) return;
      e.preventDefault();
      e.returnValue = ''; // legacy Chromium requires a truthy-ish returnValue
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [saveSnap.state]);

  // Draft write path (part 08): every document mutation while dirty schedules
  // a trailing ~3s throttled write of the full EDL to IndexedDB — independent
  // of (and slower than) the autosave debounce, so a dead network still leaves
  // a fresh local copy without a write per keystroke. pagehide / tab-hidden
  // flush immediately (fire-and-forget: IndexedDB can't be sync — acceptable).
  React.useEffect(() => {
    const writer = createDraftWriter(() => {
      const st = useStudioStore.getState();
      if (!st.dirty || !st.project || st.project.id !== projectId) return;
      const doc = st.project;
      void putDraft({
        projectId,
        baseRevision: st.revision,
        savedAt: Date.now(),
        document: doc,
      }).then((ok) => {
        // Only a confirmed write makes the work "locally safe". If an edit
        // replaced the document while the write was in flight, the recorded
        // reference simply won't match the live one and the guard still fires.
        if (ok) lastDraftedDocRef.current = doc;
      });
    });
    const unsubscribe = useStudioStore.subscribe((state, prev) => {
      if (
        state.project &&
        state.project !== prev.project &&
        state.dirty &&
        state.project.id === projectId
      ) {
        writer.notifyChange();
      }
    });
    const flush = () => writer.flush();
    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') writer.flush();
    };
    window.addEventListener('pagehide', flush);
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => {
      unsubscribe();
      window.removeEventListener('pagehide', flush);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      writer.dispose();
    };
  }, [projectId]);

  // Housekeeping: cap the draft buffer once per editor session.
  React.useEffect(() => {
    void pruneDrafts();
  }, []);

  // --- Version history (part 09): client-driven auto-checkpoints -----------
  // One checkpoint when the project hydrates (the "on editor open" trigger),
  // then one per ~5-minute tick, gated on "document changed since the last
  // landed checkpoint" (lib/studio/versionCheckpoint.ts). Fire-and-forget with
  // a single silent retry — checkpoints are a safety net and must never block
  // or nag while editing. The server prunes autos to the newest N, so a
  // misbehaving client can't grow the table.
  // mutateAsync is referentially stable in TanStack Query v5, so it can sit in
  // the effect deps without re-creating the scheduler every render.
  const { mutateAsync: createVersionAsync } = useCreateVersion(projectId);
  React.useEffect(() => {
    // Gate on hydration so the open-checkpoint snapshots this project, not a
    // 404 or a previous document still in the store.
    if (storeProjectId !== projectId) return;
    const scheduler = createCheckpointScheduler({
      getDocument: () => {
        const st = useStudioStore.getState();
        return st.project && st.project.id === projectId ? st.project : null;
      },
      checkpoint: async () => {
        try {
          await createVersionAsync({ kind: 'auto' });
          return true;
        } catch {
          return false;
        }
      },
    });
    scheduler.start();
    return () => scheduler.dispose();
  }, [projectId, storeProjectId, createVersionAsync]);

  // Recovery path (part 08): after the server project loads, look for a local
  // draft. Newer than the server copy and actually different → offer recovery;
  // based on an older revision than the server's → the conflict-dialog draft
  // mode; anything else → silently delete. Runs once per opened project (see
  // draftCheckedRef); StrictMode's remount re-runs it harmlessly.
  React.useEffect(() => {
    const server = projectQuery.data;
    if (!server || draftCheckedRef.current === server.id) return;
    draftCheckedRef.current = server.id;
    let cancelled = false;
    void (async () => {
      const draft = await getDraft(server.id);
      if (cancelled || !draft) return;
      const decision = evaluateDraft(draft, server);
      if (decision === 'discard') {
        void deleteDraft(server.id);
        return;
      }
      analytics.track(EVENTS.STUDIO_RECOVERY_OFFERED, { host: studioHost() }, { feature: 'studio' });
      setDraftOffer({
        kind: decision,
        draft,
        summary: summarizeDraftChanges(server, draft.document),
      });
    })();
    return () => {
      cancelled = true;
    };
  }, [projectQuery.data]);

  /** Recovery dialog: adopt the draft as the working document. Dirty → the
   * autosave pipeline persists it (in the conflict variant the store's freshly
   * loaded server revision makes that save the take-over the user asked for). */
  const handleDraftRecover = () => {
    if (!draftOffer) return;
    analytics.track(EVENTS.STUDIO_RECOVERY_ACCEPTED, { host: studioHost() }, { feature: 'studio' });
    restoreDraft(draftOffer.draft.document);
    setDraftOffer(null);
  };

  /** Recovery dialog: keep the saved version and drop the draft. */
  const handleDraftDiscard = async () => {
    if (!draftOffer) return;
    setDraftBusy('discard');
    try {
      await deleteDraft(projectId);
      setDraftOffer(null);
    } finally {
      setDraftBusy(null);
    }
  };

  /** Conflict dialog: replace the local document with the server's latest. */
  const handleConflictReload = async () => {
    setConflictBusy('reload');
    try {
      const res = await projectQuery.refetch();
      if (res.data) {
        // Same project id, so the hydrate effect below won't re-run —
        // replace the document explicitly. loadProject also resets undo
        // history and adopts the fresh revision.
        loadProject(res.data);
        setConflict(null);
        dispatchSave({ type: 'conflictResolved' });
        // "Reload latest" discards the local edits — the draft holding them
        // must go too, or the next open would offer to resurrect them.
        lastDraftedDocRef.current = null;
        void deleteDraft(projectId);
      }
      // On refetch failure the dialog stays open for another attempt.
    } finally {
      setConflictBusy(null);
    }
  };

  /** Conflict dialog: force-save our copy at the server's current revision. */
  const handleConflictTakeOver = async () => {
    setConflictBusy('takeOver');
    try {
      const ok = await runSaveRef.current(conflict?.currentRevision ?? null);
      if (ok) setConflict(null);
      // A fresh 409 (someone saved again mid-dialog) re-populates `conflict`
      // via runSave; any other failure keeps the dialog open to retry.
    } finally {
      setConflictBusy(null);
    }
  };

  // Shared drag-and-drop: clips (reposition / move between tracks) and media-bin
  // assets (drop onto a track) are all dragged within this one DndContext.
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));
  const [activeDragLabel, setActiveDragLabel] = React.useState<string | null>(null);

  const onDragStart = (e: DragStartEvent) => {
    const data = e.active.data.current as { label?: string } | undefined;
    setActiveDragLabel(data?.label ?? null);
    // One history entry per drag, however many store writes it produces.
    useStudioStore.getState().beginGesture();
  };

  const onDragCancel = () => {
    setActiveDragLabel(null);
    useStudioStore.getState().endGesture();
  };

  const onDragEnd = (e: DragEndEvent) => {
    setActiveDragLabel(null);
    const st = useStudioStore.getState();
    try {
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
    } finally {
      st.endGesture(); // every early-out above still closes the gesture
    }
  };

  // --- Session telemetry (part 10, ADR ws/0003) ----------------------------
  // One aggregator session per mounted editor: the edit-summary counters and
  // perf window flush on the 2-minute interval, on pagehide, and on this
  // effect's cleanup (unmount), so closing the editor never drops the tail.
  // The mount timestamp anchors TTI (mount → first successful hydration);
  // markTti keeps only the first call per session, so StrictMode's remount is
  // harmless. Stamped in the effect, not a useRef initializer — render must
  // stay pure (react-hooks/purity).
  const mountedAtRef = React.useRef<number>(0);
  React.useEffect(() => {
    if (mountedAtRef.current === 0) mountedAtRef.current = performance.now();
    return startStudioTelemetrySession();
  }, []);

  // Hydrate the store from the loaded project whenever the store isn't already
  // showing it. Self-heals if the store was cleared (StrictMode / navigation).
  React.useEffect(() => {
    if (projectQuery.data && storeProjectId !== projectQuery.data.id) {
      loadProject(projectQuery.data);
      markTti(performance.now() - mountedAtRef.current);
    }
  }, [projectQuery.data, storeProjectId, loadProject]);

  // Seed the media bin once the matching project is in the store; re-seeds if
  // the store is cleared and reloaded.
  React.useEffect(() => {
    if (assetsQuery.data && storeProjectId === projectId) {
      setAssets(assetsQuery.data);
    }
  }, [assetsQuery.data, storeProjectId, projectId, setAssets]);

  // Clear the store when leaving the editor. The closed event reads the store
  // in the SAME cleanup, before closeProject wipes it — a sibling effect's
  // cleanup order would not be guaranteed to run first.
  React.useEffect(
    () => () => {
      const st = useStudioStore.getState();
      if (st.project && st.project.id === projectId) {
        analytics.track(
          EVENTS.STUDIO_PROJECT_CLOSED,
          {
            durationBucket: timelineDurationBucket(st.project.durationSeconds ?? 0),
            clipCountBucket: countBucket(
              st.project.tracks.reduce((n, tr) => n + tr.clips.length, 0),
            ),
            trackCountBucket: countBucket(st.project.tracks.length),
            host: studioHost(),
          },
          { feature: 'studio' },
        );
      }
      closeProject();
    },
    [closeProject, projectId],
  );

  // Debounced autosave whenever the EDL is dirty. Uses a ref for the mutation
  // so edits settle for AUTOSAVE_DEBOUNCE_MS instead of restarting the timer on
  // every render. Suspended while the conflict dialog is open — the user must
  // pick reload/take-over first (part 07).
  React.useEffect(() => {
    if (!dirty || storeProjectId !== projectId || conflict) return;
    dispatchSave({ type: 'edit' });
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      void runSaveRef.current();
    }, AUTOSAVE_DEBOUNCE_MS);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [dirty, projectId, storeProjectId, conflict, dispatchSave]);

  // Flush a pending edit when leaving the editor so a debounced save in flight
  // isn't lost on unmount/close.
  React.useEffect(
    () => () => {
      const st = useStudioStore.getState();
      if (st.dirty) {
        const req = st.toSaveRequest();
        if (req)
          saveRef.current.mutate(
            { id: projectId, req },
            // Part 08: a landed flush supersedes the crash-recovery draft.
            { onSuccess: () => void deleteDraft(projectId) },
          );
      }
    },
    [projectId],
  );

  // Keyboard shortcuts: space=play/pause, ←/→=frame step, S=split,
  // Del/Backspace=ripple delete, +/-=zoom, Cmd/Ctrl+Z=undo,
  // Cmd/Ctrl+Shift+Z / Ctrl+Y=redo. Ignored while typing in a field or when a
  // dialog is open.
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = document.activeElement as HTMLElement | null;
      if (el) {
        const tag = el.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || tag === 'BUTTON' || el.isContentEditable) return;
        if (el.closest('[role="dialog"]')) return;
      }
      const st = useStudioStore.getState();
      // Part 10 (roadmap rule 11): every user action counts into the session
      // edit summary. Undo/redo only count when the stack had something to do.
      if ((e.metaKey || e.ctrlKey) && (e.key === 'z' || e.key === 'Z')) {
        e.preventDefault();
        if (e.shiftKey) {
          if (st.future.length > 0) {
            editSummary.increment('redoCount');
            editSummary.increment('shortcutInvocations');
          }
          st.redo();
        } else {
          if (st.past.length > 0) {
            editSummary.increment('undoCount');
            editSummary.increment('shortcutInvocations');
          }
          st.undo();
        }
        return;
      }
      if (e.ctrlKey && (e.key === 'y' || e.key === 'Y')) {
        e.preventDefault();
        if (st.future.length > 0) {
          editSummary.increment('redoCount');
          editSummary.increment('shortcutInvocations');
        }
        st.redo();
        return;
      }
      // Cmd/Ctrl+D — apply the default transition to the selected clip
      // (Premiere's "apply default transition"). Cross-dissolve at the
      // preference default for the clip's track kind; no-op without a
      // predecessor (the store bails, so nothing is counted).
      if ((e.metaKey || e.ctrlKey) && (e.key === 'd' || e.key === 'D')) {
        e.preventDefault();
        const clipId = st.selectedClipIds.length === 1 ? st.selectedClipIds[0] : null;
        const found = clipId ? st.findClip(clipId) : null;
        if (found) {
          const hasPrev = found.track.clips.some(
            (c) => c.id !== found.clip.id && c.timelineStart < found.clip.timelineStart,
          );
          if (hasPrev) {
            editSummary.increment('transitionsAdded', 'crossDissolve');
            editSummary.increment('shortcutInvocations');
            st.setClipTransition(found.clip.id, {
              type: 'crossDissolve',
              durationSeconds: defaultTransitionSeconds(found.track.kind),
            });
          }
        }
        return;
      }
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
          editSummary.increment('splits');
          editSummary.increment('shortcutInvocations');
          st.splitAtPlayhead();
          break;
        // T — add a title clip at the playhead (part 16). Free of collisions
        // with the part-18 keymap plan (V/C/Y/U/H/S/M/Q/W).
        case 't':
        case 'T':
          if (e.metaKey || e.ctrlKey) break; // never shadow the browser's Cmd/Ctrl+T
          e.preventDefault();
          editSummary.increment('titlesAdded');
          editSummary.increment('shortcutInvocations');
          st.addTitleClip();
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
      <div className="flex items-center justify-center p-8 text-muted-foreground sm:p-12">
        <Loader2 className="w-5 h-5 animate-spin mr-2" />
        {t('contentStudio.editor.loading')}
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col gap-4', focused && 'relative min-h-full p-3')}>
      {/* toolbar */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <Button variant="ghost" size="sm" onClick={onClose}>
            <ArrowLeft className="w-4 h-4 mr-1" />
            {t('contentStudio.editor.back')}
          </Button>
          <span className="font-semibold text-card-foreground truncate">{project.name}</span>
          <SaveStatus state={saveSnap.state} />
        </div>
        <div className="flex items-center gap-2">
          <UndoRedoButtons />
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              editSummary.increment('titlesAdded');
              editSummary.increment('uiInvocations');
              useStudioStore.getState().addTitleClip();
            }}
            title={t('contentStudio.editor.addTitleHint')}
          >
            <Type className="w-4 h-4 mr-1" />
            {t('contentStudio.editor.addTitle')}
          </Button>
          <VersionsPanel projectId={projectId} />
          <AudioDuckingPopover />
          <PreferencesDialog />
          <ExportDialog projectId={projectId} disabled={!project.tracks.some((tr) => tr.clips.length > 0)} />
          {focusMode ? <FocusControls api={focusMode} /> : null}
        </div>
      </div>

      {/* Timeline editing is pointer-heavy; nudge small screens toward desktop. */}
      <p className="lg:hidden text-xs text-premium/90 -mt-1">{t('contentStudio.editor.mobileHint')}</p>

      {/* Media bin + timeline share one DndContext so assets can be dragged from
          the bin onto a track and clips can be moved between tracks. */}
      <DndContext
        sensors={sensors}
        collisionDetection={pointerWithin}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragCancel={onDragCancel}
      >
        {isDesktop ? (
          /* media bin + preview + inspector. In focus mode this row flexes to
             fill the viewport (the timeline keeps a fixed-ish height below). */
          <div
            className={cn(
              'grid gap-4 lg:grid-cols-[280px_1fr] xl:grid-cols-[280px_1fr_320px]',
              focused && 'flex-1 min-h-0',
            )}
          >
            <Panel level="2" padding={false} className={cn('p-4', focused ? 'h-full min-h-0 overflow-auto' : 'h-[360px]')}>
              <MediaBin projectId={projectId} />
            </Panel>
            <div className={cn('bg-card p-4 rounded-lg border border-border', focused && 'h-full min-h-0')}>
              <PreviewSurface focused={focused} />
            </div>
            <div
              className={cn(
                'lg:col-span-2 xl:col-span-1',
                focused ? 'h-full min-h-0 overflow-auto' : 'xl:h-[360px]',
              )}
            >
              {selectedCaptionId ? <CaptionEditor /> : <ClipInspector />}
            </div>
          </div>
        ) : (
          /* Below lg the same three surfaces stack into one column each, so a
             phone shows one full-width panel at a time instead of a ~1,200px
             scroll with nothing to navigate by. The timeline stays pinned
             below, outside the tabs — it is the spine of the edit. */
          <Tabs defaultValue="media" className={cn('gap-3', focused && 'flex-1 min-h-0')}>
            <TabsList className="grid h-10 w-full grid-cols-3 rounded-md border border-edge bg-surface-2 p-1">
              <TabsTrigger value="media" className={MOBILE_TAB}>
                {t('contentStudio.editor.tabs.media')}
              </TabsTrigger>
              <TabsTrigger value="preview" className={MOBILE_TAB}>
                {t('contentStudio.editor.tabs.preview')}
              </TabsTrigger>
              <TabsTrigger value="inspector" className={MOBILE_TAB}>
                {t('contentStudio.editor.tabs.inspector')}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="media">
              <Panel level="2" padding={false} className="h-[360px] p-4">
                <MediaBin projectId={projectId} />
              </Panel>
            </TabsContent>
            <TabsContent value="preview">
              <div className="rounded-lg border border-border bg-card p-4">
                <PreviewSurface focused={focused} />
              </div>
            </TabsContent>
            <TabsContent value="inspector">
              {selectedCaptionId ? <CaptionEditor /> : <ClipInspector />}
            </TabsContent>
          </Tabs>
        )}

        {/* timeline — does not flex-grow in focus mode so the preview row gets
            the extra space; keeps a comfortable minimum height. */}
        <div className={cn('mt-4', !isDesktop && 'min-h-[180px]', focused && 'shrink-0 min-h-[220px]')}>
          <Timeline />
        </div>

        <DragOverlay dropAnimation={null}>
          {activeDragLabel ? (
            <div className="rounded-md border border-primary bg-surface-2 px-2 py-1 text-[11px] text-foreground shadow-lg max-w-[200px] truncate">
              {activeDragLabel}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <p className="hidden md:block text-[11px] text-muted-foreground/70">{t('contentStudio.editor.shortcuts')}</p>

      {/* Escape hint while focused. Auto-fades via CSS (cs-focus-hint) so users
          aren't trapped. Rendered inside the editor subtree so it also shows in
          true browser fullscreen; re-mounts (and replays) each time focus is
          re-entered. */}
      {focused ? (
        <div className="cs-focus-hint pointer-events-none fixed bottom-6 left-1/2 z-[60] -translate-x-1/2 rounded-full bg-surface-0/80 px-4 py-2 text-xs font-medium text-foreground shadow-lg">
          {t('contentStudio.focus.hint')}
        </div>
      ) : null}

      <SaveConflictDialog
        open={conflict !== null}
        busy={conflictBusy}
        onReload={() => void handleConflictReload()}
        onTakeOver={() => void handleConflictTakeOver()}
      />

      {/* Part 08 crash recovery. Clean case: the draft is based on the loaded
          server revision. Conflict case: the project was saved elsewhere after
          the draft — same dialog as a live 409, in its draft mode. */}
      <DraftRecoveryDialog
        open={draftOffer?.kind === 'recover'}
        savedAt={draftOffer?.draft.savedAt ?? 0}
        summary={draftOffer?.summary ?? EMPTY_DRAFT_SUMMARY}
        busy={draftBusy}
        onRecover={handleDraftRecover}
        onDiscard={() => void handleDraftDiscard()}
      />
      <SaveConflictDialog
        open={draftOffer?.kind === 'conflict'}
        mode="draft"
        savedAt={draftOffer?.draft.savedAt}
        summary={draftOffer?.summary}
        busy={draftBusy === 'discard' ? 'reload' : draftBusy === 'recover' ? 'takeOver' : null}
        onReload={() => void handleDraftDiscard()}
        onTakeOver={handleDraftRecover}
      />
    </div>
  );
};

// Placeholder while no draft is offered (the dialog is closed then anyway).
const EMPTY_DRAFT_SUMMARY: DraftChangeSummary = {
  tracksAdded: 0,
  tracksRemoved: 0,
  clipsAdded: 0,
  clipsRemoved: 0,
  clipsChanged: 0,
  captionsChanged: false,
  otherChanges: false,
};

/**
 * Undo/redo chrome buttons. Enabled state tracks the history stacks; the
 * snapshots and gesture batching live in the store (ADR ui/0001). Same
 * outline-icon treatment (with native title/aria-label tooltips) as the
 * focus/fullscreen controls beside them.
 */
const UndoRedoButtons: React.FC = () => {
  const { t } = useLocalization('interface');
  const canUndo = useStudioStore((s) => s.past.length > 0);
  const canRedo = useStudioStore((s) => s.future.length > 0);
  const undo = useStudioStore((s) => s.undo);
  const redo = useStudioStore((s) => s.redo);
  return (
    <div className="flex items-center gap-1">
      <Button
        variant="outline"
        size="icon"
        disabled={!canUndo}
        onClick={() => {
          // Disabled buttons never fire, so every click here is a real undo.
          editSummary.increment('undoCount');
          editSummary.increment('uiInvocations');
          undo();
        }}
        title={t('contentStudio.editor.undo')}
        aria-label={t('contentStudio.editor.undo')}
      >
        <Undo2 className="w-4 h-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        disabled={!canRedo}
        onClick={() => {
          editSummary.increment('redoCount');
          editSummary.increment('uiInvocations');
          redo();
        }}
        title={t('contentStudio.editor.redo')}
        aria-label={t('contentStudio.editor.redo')}
      >
        <Redo2 className="w-4 h-4" />
      </Button>
    </div>
  );
};

/**
 * Focus / fullscreen toolbar controls. Focus mode is the always-available
 * in-page overlay; the Fullscreen button is shown only where the Fullscreen API
 * is usable (hidden on iOS Safari etc., where Focus mode already covers the
 * need). Native `title`/`aria-label` tooltips match the transport buttons and
 * avoid a portal layer that would fight the overlay's stacking.
 */
const FocusControls: React.FC<{ api: FocusModeApi }> = ({ api }) => {
  const { t } = useLocalization('interface');
  return (
    <div className="flex items-center gap-1">
      <Button
        variant="outline"
        size="icon"
        onClick={api.toggleFocus}
        title={api.focused ? t('contentStudio.focus.exit') : t('contentStudio.focus.enter')}
        aria-label={api.focused ? t('contentStudio.focus.exit') : t('contentStudio.focus.enter')}
        aria-pressed={api.focused}
      >
        {api.focused ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
      </Button>
      {api.fullscreenSupported ? (
        <Button
          variant="outline"
          size="icon"
          onClick={api.isBrowserFullscreen ? api.exitBrowserFullscreen : api.enterBrowserFullscreen}
          title={api.isBrowserFullscreen ? t('contentStudio.focus.exitFullscreen') : t('contentStudio.focus.fullscreen')}
          aria-label={api.isBrowserFullscreen ? t('contentStudio.focus.exitFullscreen') : t('contentStudio.focus.fullscreen')}
          aria-pressed={api.isBrowserFullscreen}
        >
          {api.isBrowserFullscreen ? <Shrink className="w-4 h-4" /> : <Expand className="w-4 h-4" />}
        </Button>
      ) : null}
    </div>
  );
};

/**
 * Always-visible save-state indicator (part 07). Renders the machine state
 * directly: Saved ✓ / Saving… / Offline — will retry / Save failed — retrying /
 * Save failed / Save conflict. Subtle by design — it lives in the header next
 * to the project name.
 */
const SaveStatus: React.FC<{ state: SaveState }> = ({ state }) => {
  const { t } = useLocalization('interface');
  switch (state) {
    case 'saving':
      return (
        <span className="text-xs text-muted-foreground inline-flex items-center gap-1">
          <Loader2 className="w-3 h-3 animate-spin" />
          {t('contentStudio.editor.saving')}
        </span>
      );
    case 'retrying':
      return (
        <span className="text-xs text-premium inline-flex items-center gap-1">
          <Loader2 className="w-3 h-3 animate-spin" />
          {t('contentStudio.editor.retrying')}
        </span>
      );
    case 'offline':
      return (
        <span className="text-xs text-premium inline-flex items-center gap-1">
          <WifiOff className="w-3 h-3" />
          {t('contentStudio.editor.offline')}
        </span>
      );
    case 'conflict':
      return (
        <span className="text-xs text-destructive inline-flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" />
          {t('contentStudio.editor.conflict')}
        </span>
      );
    case 'failed':
      return (
        <span className="text-xs text-destructive inline-flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" />
          {t('contentStudio.editor.saveFailed')}
        </span>
      );
    case 'saved':
      return (
        <span className="text-xs text-muted-foreground inline-flex items-center gap-1">
          <Check className="w-3 h-3 text-success" />
          {t('contentStudio.editor.saved')}
        </span>
      );
  }
};

export default Editor;
