import { create } from 'zustand';
import type {
  StudioProject,
  StudioTrack,
  StudioTrackKind,
  StudioClip,
  StudioAsset,
  StudioAdjustments,
  StudioTextOverlay,
  StudioSaveProjectRequest,
} from '@/lib/studioTypes';
import { clipDuration, clipEnd, timelineDuration } from '@/lib/studio/previewEngine';

/**
 * Zustand store for the Content Studio editor. This holds the live editing
 * state (project, media bin, playhead, transport, selection, zoom) and exposes
 * pure actions that mutate the track/clip tree immutably. It deliberately
 * contains NO server calls — TanStack Query hooks (useStudioProject /
 * useStudioAsset) own all I/O and feed results into the store via loadProject /
 * setAssets / upsertAsset.
 */

export type AssetIngestStatus = 'uploading' | 'processing' | 'ready' | 'failed';

/** A media-bin entry: the asset row plus its client-side ingest lifecycle. */
export interface StudioAssetEntry {
  asset: StudioAsset;
  status: AssetIngestStatus;
  /** ingest job id (proxy + filmstrip), for SSE/poll progress */
  jobId?: string;
  /** 0..100 during the S3 upload phase */
  uploadProgress: number;
  error?: string;
}

const uid = (): string => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return `id-${Date.now()}-${Math.floor(Math.random() * 1e9).toString(16)}`;
};

const DEFAULT_ZOOM = 80; // pixels per second
const MIN_ZOOM = 10;
const MAX_ZOOM = 400;
const MIN_CLIP_SECONDS = 0.1;
const MAX_TRANSITION_SECONDS = 4;

interface StudioState {
  project: StudioProject | null;
  assets: Record<string, StudioAssetEntry>;
  selectedClipIds: string[];
  playhead: number;
  isPlaying: boolean;
  zoom: number;
  /** true when the EDL changed since the last successful save */
  dirty: boolean;

  // --- project lifecycle ---
  loadProject: (project: StudioProject) => void;
  markSaved: (project: StudioProject) => void;
  closeProject: () => void;

  // --- media bin ---
  setAssets: (assets: StudioAsset[]) => void;
  upsertAsset: (entry: StudioAssetEntry) => void;
  setAssetStatus: (assetId: string, status: AssetIngestStatus, error?: string) => void;
  setUploadProgress: (assetId: string, progress: number) => void;

  // --- timeline editing ---
  addClipFromAsset: (assetId: string) => void;
  addClipFromAssetToTrack: (assetId: string, trackId: string) => void;
  updateClip: (clipId: string, patch: Partial<StudioClip>) => void;
  moveClip: (clipId: string, desiredStart: number) => void;
  moveClipToTrack: (clipId: string, targetTrackId: string, desiredStart: number) => void;
  splitAtPlayhead: () => void;
  deleteSelected: () => void;
  selectClip: (clipId: string | null, additive?: boolean) => void;

  // --- tracks ---
  addTrack: (kind: StudioTrackKind) => void;
  removeTrack: (trackId: string) => void;
  toggleTrackMute: (trackId: string) => void;
  setClipVolume: (clipId: string, volume: number) => void;

  // --- effects (Phase 5) ---
  setClipTransition: (clipId: string, seconds: number) => void;
  setClipAdjustments: (clipId: string, adjustments: StudioAdjustments | undefined) => void;
  addTextOverlay: (clipId: string) => void;
  updateTextOverlay: (clipId: string, overlayId: string, patch: Partial<StudioTextOverlay>) => void;
  removeTextOverlay: (clipId: string, overlayId: string) => void;

  // --- transport ---
  setPlayhead: (t: number) => void;
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  setZoom: (z: number) => void;
  zoomBy: (factor: number) => void;

  // --- derived/helpers ---
  toSaveRequest: () => StudioSaveProjectRequest | null;
  findClip: (clipId: string) => { clip: StudioClip; track: StudioTrack } | null;
}

// ensureBaseTracks guarantees at least one video track (V1) and one audio track
// (A1) so the editor always has a video lane and a place to drop music/voiceover.
function ensureBaseTracks(tracks: StudioTrack[]): StudioTrack[] {
  const out = [...tracks];
  if (!out.some((t) => t.kind === 'video')) {
    out.unshift({ id: uid(), kind: 'video', index: 0, muted: false, clips: [] });
  }
  if (!out.some((t) => t.kind === 'audio')) {
    out.push({ id: uid(), kind: 'audio', index: 0, muted: false, clips: [] });
  }
  return out;
}

function mapTracks(
  tracks: StudioTrack[],
  fn: (track: StudioTrack) => StudioTrack,
): StudioTrack[] {
  return tracks.map(fn);
}

// updateClipInTracks applies fn to the matching clip, leaving other tracks/clips
// untouched (immutably).
function updateClipInTracks(
  tracks: StudioTrack[],
  clipId: string,
  fn: (c: StudioClip) => StudioClip,
): StudioTrack[] {
  return tracks.map((track) =>
    track.clips.some((c) => c.id === clipId)
      ? { ...track, clips: track.clips.map((c) => (c.id === clipId ? fn(c) : c)) }
      : track,
  );
}

// fitInGaps returns the start position nearest `desired` where a clip of length
// `dur` fits without overlapping any of `intervals` (the other clips on the
// track). It walks the free gaps (including the open-ended tail) and clamps
// `desired` into whichever gap minimizes the distance moved.
function fitInGaps(
  intervals: { start: number; end: number }[],
  dur: number,
  desired: number,
): number {
  const sorted = [...intervals].sort((a, b) => a.start - b.start);
  const gaps: { start: number; end: number }[] = [];
  let cursor = 0;
  for (const iv of sorted) {
    if (iv.start > cursor) gaps.push({ start: cursor, end: iv.start });
    cursor = Math.max(cursor, iv.end);
  }
  gaps.push({ start: cursor, end: Infinity });

  let best = cursor;
  let bestDist = Infinity;
  for (const g of gaps) {
    const maxStart = g.end === Infinity ? Infinity : g.end - dur;
    if (maxStart < g.start) continue; // gap too small
    const placed =
      maxStart === Infinity ? Math.max(desired, g.start) : Math.min(Math.max(desired, g.start), maxStart);
    const dist = Math.abs(placed - desired);
    if (dist < bestDist) {
      bestDist = dist;
      best = placed;
    }
  }
  return Math.max(0, best);
}

// placeInTrack positions the dragged clip within its track, reorder-aware.
// If the drop keeps the existing left-to-right order, the clip is placed at the
// nearest non-overlapping slot (gaps preserved). If the drop crosses a
// neighbour (the user wants a new order), the track is re-packed contiguously
// in the new order from the block's earliest start — so two clips can be freely
// swapped. Returns the new clips array for the track.
function placeInTrack(clips: StudioClip[], draggedId: string, desiredStart: number): StudioClip[] {
  const dragged = clips.find((c) => c.id === draggedId);
  if (!dragged) return clips;
  const dur = clipDuration(dragged);
  const others = clips.filter((c) => c.id !== draggedId).sort((a, b) => a.timelineStart - b.timelineStart);

  const currentOrder = [...clips].sort((a, b) => a.timelineStart - b.timelineStart).map((c) => c.id);

  // Insertion index among the other clips, by the dragged clip's center.
  const center = Math.max(0, desiredStart) + dur / 2;
  let insertIdx = 0;
  for (const o of others) {
    if (o.timelineStart + clipDuration(o) / 2 < center) insertIdx += 1;
    else break;
  }
  const newOrder = [
    ...others.slice(0, insertIdx).map((c) => c.id),
    draggedId,
    ...others.slice(insertIdx).map((c) => c.id),
  ];

  if (newOrder.join() === currentOrder.join()) {
    // No reorder — reposition the dragged clip, preserving gaps.
    const placed = fitInGaps(
      others.map((c) => ({ start: c.timelineStart, end: clipEnd(c) })),
      dur,
      Math.max(0, desiredStart),
    );
    return clips.map((c) => (c.id === draggedId ? { ...c, timelineStart: placed, transitionInSeconds: undefined } : c));
  }

  // Reorder — re-pack contiguously from the block's earliest start. Positions
  // change, so any cross-dissolves (which depend on overlap) are cleared.
  const base = Math.max(0, Math.min(...clips.map((c) => c.timelineStart)));
  const byId = new Map(clips.map((c) => [c.id, c]));
  let cursor = base;
  return newOrder.map((id) => {
    const c = byId.get(id)!;
    const next = { ...c, timelineStart: cursor, transitionInSeconds: undefined };
    cursor += clipDuration(c);
    return next;
  });
}

export const useStudioStore = create<StudioState>((set, get) => ({
  project: null,
  assets: {},
  selectedClipIds: [],
  playhead: 0,
  isPlaying: false,
  zoom: DEFAULT_ZOOM,
  dirty: false,

  loadProject: (project) =>
    set({
      project: { ...project, tracks: ensureBaseTracks(project.tracks ?? []) },
      selectedClipIds: [],
      playhead: 0,
      isPlaying: false,
      dirty: false,
    }),

  markSaved: (project) =>
    set((s) => ({
      // Keep the live tracks (the user may have edited mid-save); only adopt
      // server-authoritative metadata + clear the dirty flag.
      project: s.project
        ? { ...s.project, updatedAt: project.updatedAt, durationSeconds: project.durationSeconds }
        : project,
      dirty: false,
    })),

  closeProject: () => set({ project: null, assets: {}, selectedClipIds: [], playhead: 0, isPlaying: false, dirty: false }),

  setAssets: (assets) =>
    set(() => {
      const map: Record<string, StudioAssetEntry> = {};
      for (const a of assets) {
        map[a.id] = {
          asset: a,
          status: a.s3KeyProxy ? 'ready' : 'processing',
          uploadProgress: 100,
        };
      }
      return { assets: map };
    }),

  upsertAsset: (entry) =>
    set((s) => ({ assets: { ...s.assets, [entry.asset.id]: entry } })),

  setAssetStatus: (assetId, status, error) =>
    set((s) => {
      const existing = s.assets[assetId];
      if (!existing) return {};
      return { assets: { ...s.assets, [assetId]: { ...existing, status, error } } };
    }),

  setUploadProgress: (assetId, progress) =>
    set((s) => {
      const existing = s.assets[assetId];
      if (!existing) return {};
      return { assets: { ...s.assets, [assetId]: { ...existing, uploadProgress: progress } } };
    }),

  // addClipFromAsset routes by media kind: video assets land on the first video
  // track, audio assets on the first audio track (both guaranteed to exist),
  // appended after that track's existing content.
  addClipFromAsset: (assetId) =>
    set((s) => {
      if (!s.project) return {};
      const entry = s.assets[assetId];
      if (!entry) return {};
      const kind: StudioTrackKind = entry.asset.mediaKind === 'audio' ? 'audio' : 'video';
      const duration = entry.asset.durationSeconds > 0 ? entry.asset.durationSeconds : 5;
      const tracks = ensureBaseTracks(s.project.tracks);
      const newClipId = uid();
      let placed = false;
      const next = tracks.map((track) => {
        if (placed || track.kind !== kind) return track;
        placed = true;
        const startAt = track.clips.reduce((max, c) => Math.max(max, clipEnd(c)), 0);
        const clip: StudioClip = {
          id: newClipId,
          assetId,
          streamIndex: 0,
          timelineStart: startAt,
          sourceIn: 0,
          sourceOut: duration,
          volume: entry.asset.hasAudio ? 1 : undefined,
        };
        return { ...track, clips: [...track.clips, clip] };
      });
      return { project: { ...s.project, tracks: next }, selectedClipIds: [newClipId], dirty: true };
    }),

  // addClipFromAssetToTrack appends a clip for the asset onto a specific track
  // (used when an asset is dragged from the media bin onto a chosen lane). The
  // caller validates that the asset kind matches the track kind.
  addClipFromAssetToTrack: (assetId, trackId) =>
    set((s) => {
      if (!s.project) return {};
      const entry = s.assets[assetId];
      if (!entry) return {};
      const duration = entry.asset.durationSeconds > 0 ? entry.asset.durationSeconds : 5;
      const newClipId = uid();
      let placed = false;
      const next = s.project.tracks.map((track) => {
        if (track.id !== trackId) return track;
        placed = true;
        const startAt = track.clips.reduce((max, c) => Math.max(max, clipEnd(c)), 0);
        const clip: StudioClip = {
          id: newClipId,
          assetId,
          streamIndex: 0,
          timelineStart: startAt,
          sourceIn: 0,
          sourceOut: duration,
          volume: entry.asset.hasAudio ? 1 : undefined,
        };
        return { ...track, clips: [...track.clips, clip] };
      });
      if (!placed) return {};
      return { project: { ...s.project, tracks: next }, selectedClipIds: [newClipId], dirty: true };
    }),

  updateClip: (clipId, patch) =>
    set((s) => {
      if (!s.project) return {};
      const next = mapTracks(s.project.tracks, (track) => {
        if (!track.clips.some((c) => c.id === clipId)) return track;
        return {
          ...track,
          clips: track.clips.map((c) => {
            if (c.id !== clipId) return c;
            const merged = { ...c, ...patch };
            // Keep the clip valid: in/out within bounds, min length enforced.
            if (merged.sourceIn < 0) merged.sourceIn = 0;
            if (merged.timelineStart < 0) merged.timelineStart = 0;
            if (merged.sourceOut < merged.sourceIn + MIN_CLIP_SECONDS) {
              merged.sourceOut = merged.sourceIn + MIN_CLIP_SECONDS;
            }
            return merged;
          }),
        };
      });
      return { project: { ...s.project, tracks: next }, dirty: true };
    }),

  // moveClip repositions a clip to the nearest non-overlapping start at/after
  // desiredStart (gaps allowed, overlap prevented). Snapping is applied by the
  // caller before this runs.
  moveClip: (clipId, desiredStart) =>
    set((s) => {
      if (!s.project) return {};
      const next = mapTracks(s.project.tracks, (track) =>
        track.clips.some((c) => c.id === clipId)
          ? { ...track, clips: placeInTrack(track.clips, clipId, desiredStart) }
          : track,
      );
      return { project: { ...s.project, tracks: next }, dirty: true };
    }),

  // moveClipToTrack moves a clip onto a different track at the nearest
  // non-overlapping position to desiredStart. The caller validates that the
  // target track is the same kind (video↔video / audio↔audio).
  moveClipToTrack: (clipId, targetTrackId, desiredStart) =>
    set((s) => {
      if (!s.project) return {};
      let moving: StudioClip | undefined;
      for (const tr of s.project.tracks) {
        const c = tr.clips.find((cc) => cc.id === clipId);
        if (c) {
          moving = c;
          break;
        }
      }
      if (!moving) return {};
      const tracks = s.project.tracks.map((track) => {
        // Strip the clip from its current track.
        if (track.id !== targetTrackId) {
          return track.clips.some((c) => c.id === clipId)
            ? { ...track, clips: track.clips.filter((c) => c.id !== clipId) }
            : track;
        }
        // Drop onto the target track at the desired position (reorder-aware).
        const withDragged = [
          ...track.clips.filter((c) => c.id !== clipId),
          { ...moving!, timelineStart: Math.max(0, desiredStart) },
        ];
        return { ...track, clips: placeInTrack(withDragged, clipId, desiredStart) };
      });
      return { project: { ...s.project, tracks }, selectedClipIds: [clipId], dirty: true };
    }),

  // splitAtPlayhead is the razor: every clip the playhead strictly crosses is
  // cut into two (left keeps the original id + selection, right gets a new id).
  // When clips are selected, only those are cut; otherwise all crossing clips.
  splitAtPlayhead: () =>
    set((s) => {
      if (!s.project) return {};
      const t = s.playhead;
      const restrictTo = new Set(s.selectedClipIds);
      const restrict = restrictTo.size > 0;
      let changed = false;
      const nextSelected = new Set(s.selectedClipIds);
      const tracks = mapTracks(s.project.tracks, (track) => {
        const clips: StudioClip[] = [];
        for (const c of track.clips) {
          const crosses = t > c.timelineStart + MIN_CLIP_SECONDS && t < clipEnd(c) - MIN_CLIP_SECONDS;
          if (crosses && (!restrict || restrictTo.has(c.id))) {
            changed = true;
            const splitSource = c.sourceIn + (t - c.timelineStart);
            const left: StudioClip = { ...c, sourceOut: splitSource };
            const right: StudioClip = { ...c, id: uid(), timelineStart: t, sourceIn: splitSource };
            clips.push(left, right);
            nextSelected.add(left.id);
            nextSelected.add(right.id);
          } else {
            clips.push(c);
          }
        }
        return { ...track, clips };
      });
      if (!changed) return {};
      return { project: { ...s.project, tracks }, selectedClipIds: Array.from(nextSelected), dirty: true };
    }),

  // deleteSelected ripple-deletes every selected clip: each kept clip shifts
  // left by the total duration of selected clips that started before it,
  // closing gaps across one or many deletions.
  deleteSelected: () =>
    set((s) => {
      if (!s.project || s.selectedClipIds.length === 0) return {};
      const sel = new Set(s.selectedClipIds);
      const tracks = mapTracks(s.project.tracks, (track) => {
        const removed = track.clips.filter((c) => sel.has(c.id));
        if (removed.length === 0) return track;
        const kept = track.clips
          .filter((c) => !sel.has(c.id))
          .map((c) => {
            const shift = removed.reduce(
              (acc, r) => (r.timelineStart < c.timelineStart ? acc + clipDuration(r) : acc),
              0,
            );
            return shift > 0 ? { ...c, timelineStart: Math.max(0, c.timelineStart - shift) } : c;
          });
        return { ...track, clips: kept };
      });
      return { project: { ...s.project, tracks }, selectedClipIds: [], dirty: true };
    }),

  selectClip: (clipId, additive = false) =>
    set((s) => {
      if (clipId === null) return { selectedClipIds: [] };
      if (additive) {
        const next = new Set(s.selectedClipIds);
        if (next.has(clipId)) next.delete(clipId);
        else next.add(clipId);
        return { selectedClipIds: Array.from(next) };
      }
      return { selectedClipIds: [clipId] };
    }),

  addTrack: (kind) =>
    set((s) => {
      if (!s.project) return {};
      const maxIndex = s.project.tracks
        .filter((t) => t.kind === kind)
        .reduce((m, t) => Math.max(m, t.index), -1);
      const track: StudioTrack = { id: uid(), kind, index: maxIndex + 1, muted: false, clips: [] };
      return { project: { ...s.project, tracks: [...s.project.tracks, track] }, dirty: true };
    }),

  // removeTrack deletes an empty track and renumbers the remaining tracks of
  // each kind so labels stay contiguous (V1, V2, … / A1, A2, …).
  removeTrack: (trackId) =>
    set((s) => {
      if (!s.project) return {};
      const target = s.project.tracks.find((t) => t.id === trackId);
      if (!target || target.clips.length > 0) return {}; // only empty tracks
      const counter = { video: 0, audio: 0 };
      const reindexed = s.project.tracks
        .filter((t) => t.id !== trackId)
        .sort((a, b) => (a.kind === b.kind ? a.index - b.index : a.kind === 'video' ? -1 : 1))
        .map((t) => ({ ...t, index: t.kind === 'video' ? counter.video++ : counter.audio++ }));
      return { project: { ...s.project, tracks: reindexed }, dirty: true };
    }),

  toggleTrackMute: (trackId) =>
    set((s) => {
      if (!s.project) return {};
      return {
        project: {
          ...s.project,
          tracks: s.project.tracks.map((t) => (t.id === trackId ? { ...t, muted: !t.muted } : t)),
        },
        dirty: true,
      };
    }),

  setClipVolume: (clipId, volume) => {
    get().updateClip(clipId, { volume: Math.max(0, Math.min(1, volume)) });
  },

  // setClipTransition adds/updates a cross-dissolve from the nearest preceding
  // clip on the same track: the clip is pulled left to overlap that predecessor
  // by `seconds` (capped to both clips' durations). seconds <= 0 clears it.
  setClipTransition: (clipId, seconds) =>
    set((s) => {
      if (!s.project) return {};
      const tracks = mapTracks(s.project.tracks, (track) => {
        const clip = track.clips.find((c) => c.id === clipId);
        if (!clip) return track;
        const prev = track.clips
          .filter((c) => c.id !== clipId && c.timelineStart < clip.timelineStart)
          .sort((a, b) => b.timelineStart - a.timelineStart)[0];
        if (!prev) return track; // nothing before it to dissolve from
        const prevEnd = clipEnd(prev);
        const maxD = Math.min(clipDuration(prev), clipDuration(clip), MAX_TRANSITION_SECONDS);
        const d = Math.max(0, Math.min(seconds, maxD));
        return {
          ...track,
          clips: track.clips.map((c) => {
            if (c.id !== clipId) return c;
            if (d <= 0) {
              return { ...c, timelineStart: prevEnd, transitionInSeconds: undefined };
            }
            return { ...c, timelineStart: Math.max(0, prevEnd - d), transitionInSeconds: d };
          }),
        };
      });
      return { project: { ...s.project, tracks }, dirty: true };
    }),

  setClipAdjustments: (clipId, adjustments) =>
    set((s) => {
      if (!s.project) return {};
      const tracks = updateClipInTracks(s.project.tracks, clipId, (c) => ({ ...c, adjustments }));
      return { project: { ...s.project, tracks }, dirty: true };
    }),

  addTextOverlay: (clipId) =>
    set((s) => {
      if (!s.project) return {};
      const fontSize = Math.max(16, Math.round((s.project.height || 1080) * 0.05));
      const overlay: StudioTextOverlay = { id: uid(), text: 'Text', x: 0.05, y: 0.85, fontSize, color: '#FFFFFF' };
      const tracks = updateClipInTracks(s.project.tracks, clipId, (c) => ({
        ...c,
        textOverlays: [...(c.textOverlays ?? []), overlay],
      }));
      return { project: { ...s.project, tracks }, dirty: true };
    }),

  updateTextOverlay: (clipId, overlayId, patch) =>
    set((s) => {
      if (!s.project) return {};
      const tracks = updateClipInTracks(s.project.tracks, clipId, (c) => ({
        ...c,
        textOverlays: (c.textOverlays ?? []).map((o) => (o.id === overlayId ? { ...o, ...patch } : o)),
      }));
      return { project: { ...s.project, tracks }, dirty: true };
    }),

  removeTextOverlay: (clipId, overlayId) =>
    set((s) => {
      if (!s.project) return {};
      const tracks = updateClipInTracks(s.project.tracks, clipId, (c) => ({
        ...c,
        textOverlays: (c.textOverlays ?? []).filter((o) => o.id !== overlayId),
      }));
      return { project: { ...s.project, tracks }, dirty: true };
    }),

  setPlayhead: (t) => set((s) => ({ playhead: Math.max(0, Math.min(t, timelineDuration(s.project?.tracks ?? []) || t)) })),
  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),
  togglePlay: () => set((s) => ({ isPlaying: !s.isPlaying })),

  setZoom: (z) => set({ zoom: Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, z)) }),
  zoomBy: (factor) => set((s) => ({ zoom: Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, s.zoom * factor)) })),

  toSaveRequest: () => {
    const p = get().project;
    if (!p) return null;
    return { name: p.name, fps: p.fps, width: p.width, height: p.height, tracks: p.tracks };
  },

  findClip: (clipId) => {
    const p = get().project;
    if (!p) return null;
    for (const track of p.tracks) {
      const clip = track.clips.find((c) => c.id === clipId);
      if (clip) return { clip, track };
    }
    return null;
  },
}));

// Re-export geometry helpers used by the UI so components import from one place.
export { clipDuration, clipEnd, timelineDuration };
