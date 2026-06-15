'use client';

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
  StudioTransform,
  StudioCrop,
  StudioBlendMode,
  StudioEffect,
  StudioEffectType,
  StudioVolumeKeyframe,
  StudioCaptionCue,
  StudioCaptionStyle,
  StudioAudioConfig,
} from '@/lib/studioTypes';
import {
  STUDIO_SCHEMA_VERSION,
  DEFAULT_CAPTION_STYLE,
  normalizeProject,
} from '@/lib/studioTypes';
import { makeDefaultEffect } from '@/lib/studio/effectRegistry';
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
const MAX_VOLUME = 2; // +6dB ceiling (Premiere-style boost), matches Zod + Go clamp
const MIN_CAPTION_SECONDS = 0.3;

const clampRange = (v: number, lo: number, hi: number): number => Math.max(lo, Math.min(hi, v));

const DEFAULT_AUDIO_CONFIG: StudioAudioConfig = {
  duckingEnabled: false,
  duckAmountDb: 9,
  duckAttackMs: 120,
  duckReleaseMs: 400,
};

interface StudioState {
  project: StudioProject | null;
  assets: Record<string, StudioAssetEntry>;
  selectedClipIds: string[];
  selectedCaptionId: string | null;
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
  selectCaption: (id: string | null) => void;

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

  // --- EDL v2: motion / crop / blend / effect stack ---
  setClipTransform: (clipId: string, transform: StudioTransform | undefined) => void;
  setClipCrop: (clipId: string, crop: StudioCrop | undefined) => void;
  setClipBlendMode: (clipId: string, mode: StudioBlendMode | undefined) => void;
  addEffect: (clipId: string, type: StudioEffectType) => void;
  // patch is a loose record (the inspector sends one field at a time, often via
  // a computed key) merged onto the discriminated-union effect.
  updateEffect: (clipId: string, effectId: string, patch: Record<string, number | string | boolean>) => void;
  removeEffect: (clipId: string, effectId: string) => void;
  reorderEffect: (clipId: string, fromIndex: number, toIndex: number) => void;
  toggleEffect: (clipId: string, effectId: string) => void;

  // --- EDL v2: audio (keyframes / pan / ducking) ---
  setClipPan: (clipId: string, pan: number) => void;
  setVolumeKeyframes: (clipId: string, kfs: StudioVolumeKeyframe[]) => void;
  addVolumeKeyframe: (clipId: string, t: number, gain: number) => void;
  removeVolumeKeyframe: (clipId: string, index: number) => void;
  setAudioDucking: (patch: Partial<StudioAudioConfig>) => void;

  // --- EDL v2: captions ---
  setCaptions: (cues: StudioCaptionCue[]) => void;
  addCaption: (startSeconds: number, endSeconds: number, text?: string) => void;
  updateCaption: (id: string, patch: Partial<StudioCaptionCue>) => void;
  removeCaption: (id: string) => void;
  splitCaption: (id: string, atSeconds: number) => void;
  mergeCaptionWithNext: (id: string) => void;
  setCaptionStyle: (patch: Partial<StudioCaptionStyle>) => void;
  setCaptionsEnabled: (enabled: boolean) => void;

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

// normalizeKeyframes sorts volume automation by time, clamps gain to 0..2 and
// t to >= 0, and dedupes points at the same time (last wins). The export
// compiler relies on a sorted, sane list.
function normalizeKeyframes(kfs: StudioVolumeKeyframe[]): StudioVolumeKeyframe[] {
  const sorted = [...kfs]
    .map((k) => ({ t: Math.max(0, k.t), gain: clampRange(k.gain, 0, MAX_VOLUME) }))
    .sort((a, b) => a.t - b.t);
  const out: StudioVolumeKeyframe[] = [];
  for (const k of sorted) {
    if (out.length > 0 && Math.abs(out[out.length - 1].t - k.t) < 1e-4) {
      out[out.length - 1] = k; // same time → last wins
    } else {
      out.push(k);
    }
  }
  return out;
}

// splitTextProportional splits caption text at the nearest word boundary to
// `ratio` (0..1) of the word count, keeping at least one word on each side.
function splitTextProportional(text: string, ratio: number): { left: string; right: string } {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length <= 1) return { left: text, right: '' };
  const n = Math.max(1, Math.min(words.length - 1, Math.round(ratio * words.length)));
  return { left: words.slice(0, n).join(' '), right: words.slice(n).join(' ') };
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
  selectedCaptionId: null,
  playhead: 0,
  isPlaying: false,
  zoom: DEFAULT_ZOOM,
  dirty: false,

  loadProject: (project) => {
    // Upgrade v1 → v2 in memory (additive defaults) before hydrating the store.
    const normalized = normalizeProject(project);
    set({
      project: { ...normalized, tracks: ensureBaseTracks(normalized.tracks ?? []) },
      selectedClipIds: [],
      selectedCaptionId: null,
      playhead: 0,
      isPlaying: false,
      dirty: false,
    });
  },

  markSaved: (project) =>
    set((s) => ({
      // Keep the live tracks (the user may have edited mid-save); only adopt
      // server-authoritative metadata + clear the dirty flag.
      project: s.project
        ? { ...s.project, updatedAt: project.updatedAt, durationSeconds: project.durationSeconds }
        : project,
      dirty: false,
    })),

  closeProject: () => set({ project: null, assets: {}, selectedClipIds: [], selectedCaptionId: null, playhead: 0, isPlaying: false, dirty: false }),

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
      if (!entry || entry.asset.mediaKind === 'lut') return {}; // LUTs are graded, not placed
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
      if (!entry || entry.asset.mediaKind === 'lut') return {};
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
      if (clipId === null) return { selectedClipIds: [], selectedCaptionId: null };
      if (additive) {
        const next = new Set(s.selectedClipIds);
        if (next.has(clipId)) next.delete(clipId);
        else next.add(clipId);
        return { selectedClipIds: Array.from(next), selectedCaptionId: null };
      }
      return { selectedClipIds: [clipId], selectedCaptionId: null };
    }),

  selectCaption: (id) => set({ selectedCaptionId: id, selectedClipIds: [] }),

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
    get().updateClip(clipId, { volume: clampRange(volume, 0, MAX_VOLUME) });
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

  // --- EDL v2: motion / crop / blend / effect stack -----------------------

  setClipTransform: (clipId, transform) =>
    set((s) => {
      if (!s.project) return {};
      const tracks = updateClipInTracks(s.project.tracks, clipId, (c) => ({ ...c, transform }));
      return { project: { ...s.project, tracks }, dirty: true };
    }),

  setClipCrop: (clipId, crop) =>
    set((s) => {
      if (!s.project) return {};
      const tracks = updateClipInTracks(s.project.tracks, clipId, (c) => ({ ...c, crop }));
      return { project: { ...s.project, tracks }, dirty: true };
    }),

  setClipBlendMode: (clipId, mode) =>
    set((s) => {
      if (!s.project) return {};
      // 'normal' (and undefined) both mean the default source-over; store undefined
      // so v1 clips stay byte-identical.
      const value = mode && mode !== 'normal' ? mode : undefined;
      const tracks = updateClipInTracks(s.project.tracks, clipId, (c) => ({ ...c, blendMode: value }));
      return { project: { ...s.project, tracks }, dirty: true };
    }),

  addEffect: (clipId, type) =>
    set((s) => {
      if (!s.project) return {};
      const effect = makeDefaultEffect(type, uid());
      const tracks = updateClipInTracks(s.project.tracks, clipId, (c) => ({
        ...c,
        effects: [...(c.effects ?? []), effect],
      }));
      return { project: { ...s.project, tracks }, dirty: true };
    }),

  updateEffect: (clipId, effectId, patch) =>
    set((s) => {
      if (!s.project) return {};
      const tracks = updateClipInTracks(s.project.tracks, clipId, (c) => ({
        ...c,
        effects: (c.effects ?? []).map((e) =>
          e.id === effectId ? ({ ...e, ...patch } as StudioEffect) : e,
        ),
      }));
      return { project: { ...s.project, tracks }, dirty: true };
    }),

  removeEffect: (clipId, effectId) =>
    set((s) => {
      if (!s.project) return {};
      const tracks = updateClipInTracks(s.project.tracks, clipId, (c) => ({
        ...c,
        effects: (c.effects ?? []).filter((e) => e.id !== effectId),
      }));
      return { project: { ...s.project, tracks }, dirty: true };
    }),

  reorderEffect: (clipId, fromIndex, toIndex) =>
    set((s) => {
      if (!s.project) return {};
      const tracks = updateClipInTracks(s.project.tracks, clipId, (c) => {
        const effects = [...(c.effects ?? [])];
        if (fromIndex < 0 || fromIndex >= effects.length || toIndex < 0 || toIndex >= effects.length) {
          return c;
        }
        const [moved] = effects.splice(fromIndex, 1);
        effects.splice(toIndex, 0, moved);
        return { ...c, effects };
      });
      return { project: { ...s.project, tracks }, dirty: true };
    }),

  toggleEffect: (clipId, effectId) =>
    set((s) => {
      if (!s.project) return {};
      const tracks = updateClipInTracks(s.project.tracks, clipId, (c) => ({
        ...c,
        effects: (c.effects ?? []).map((e) =>
          e.id === effectId ? ({ ...e, enabled: !e.enabled } as StudioEffect) : e,
        ),
      }));
      return { project: { ...s.project, tracks }, dirty: true };
    }),

  // --- EDL v2: audio (keyframes / pan / ducking) --------------------------

  setClipPan: (clipId, pan) =>
    set((s) => {
      if (!s.project) return {};
      const value = clampRange(pan, -1, 1);
      const tracks = updateClipInTracks(s.project.tracks, clipId, (c) => ({
        ...c,
        pan: value === 0 ? undefined : value,
      }));
      return { project: { ...s.project, tracks }, dirty: true };
    }),

  setVolumeKeyframes: (clipId, kfs) =>
    set((s) => {
      if (!s.project) return {};
      const normalized = normalizeKeyframes(kfs);
      const tracks = updateClipInTracks(s.project.tracks, clipId, (c) => ({
        ...c,
        volumeKeyframes: normalized.length > 0 ? normalized : undefined,
      }));
      return { project: { ...s.project, tracks }, dirty: true };
    }),

  addVolumeKeyframe: (clipId, t, gain) =>
    set((s) => {
      if (!s.project) return {};
      const tracks = updateClipInTracks(s.project.tracks, clipId, (c) => {
        const next = normalizeKeyframes([...(c.volumeKeyframes ?? []), { t, gain }]);
        return { ...c, volumeKeyframes: next };
      });
      return { project: { ...s.project, tracks }, dirty: true };
    }),

  removeVolumeKeyframe: (clipId, index) =>
    set((s) => {
      if (!s.project) return {};
      const tracks = updateClipInTracks(s.project.tracks, clipId, (c) => {
        const kfs = (c.volumeKeyframes ?? []).filter((_, i) => i !== index);
        return { ...c, volumeKeyframes: kfs.length > 0 ? kfs : undefined };
      });
      return { project: { ...s.project, tracks }, dirty: true };
    }),

  setAudioDucking: (patch) =>
    set((s) => {
      if (!s.project) return {};
      const audio: StudioAudioConfig = { ...DEFAULT_AUDIO_CONFIG, ...s.project.audio, ...patch };
      return { project: { ...s.project, audio }, dirty: true };
    }),

  // --- EDL v2: captions ---------------------------------------------------

  setCaptions: (cues) =>
    set((s) => {
      if (!s.project) return {};
      const sorted = [...cues].sort((a, b) => a.startSeconds - b.startSeconds);
      return { project: { ...s.project, captions: sorted }, dirty: true };
    }),

  addCaption: (startSeconds, endSeconds, text = '') =>
    set((s) => {
      if (!s.project) return {};
      const start = Math.max(0, startSeconds);
      const end = Math.max(start + MIN_CAPTION_SECONDS, endSeconds);
      const cue: StudioCaptionCue = { id: uid(), startSeconds: start, endSeconds: end, text };
      const captions = [...s.project.captions, cue].sort((a, b) => a.startSeconds - b.startSeconds);
      return { project: { ...s.project, captions }, dirty: true };
    }),

  updateCaption: (id, patch) =>
    set((s) => {
      if (!s.project) return {};
      const captions = s.project.captions
        .map((c) => {
          if (c.id !== id) return c;
          const merged = { ...c, ...patch };
          if (merged.startSeconds < 0) merged.startSeconds = 0;
          if (merged.endSeconds < merged.startSeconds + MIN_CAPTION_SECONDS) {
            merged.endSeconds = merged.startSeconds + MIN_CAPTION_SECONDS;
          }
          if (merged.text.length > 500) merged.text = merged.text.slice(0, 500);
          return merged;
        })
        .sort((a, b) => a.startSeconds - b.startSeconds);
      return { project: { ...s.project, captions }, dirty: true };
    }),

  removeCaption: (id) =>
    set((s) => {
      if (!s.project) return {};
      return { project: { ...s.project, captions: s.project.captions.filter((c) => c.id !== id) }, dirty: true };
    }),

  splitCaption: (id, atSeconds) =>
    set((s) => {
      if (!s.project) return {};
      const cue = s.project.captions.find((c) => c.id === id);
      if (!cue) return {};
      if (atSeconds <= cue.startSeconds + MIN_CAPTION_SECONDS || atSeconds >= cue.endSeconds - MIN_CAPTION_SECONDS) {
        return {};
      }
      // Split the text on the nearest word boundary proportional to the time split.
      const ratio = (atSeconds - cue.startSeconds) / (cue.endSeconds - cue.startSeconds);
      const cut = splitTextProportional(cue.text, ratio);
      const left: StudioCaptionCue = { ...cue, endSeconds: atSeconds, text: cut.left };
      const right: StudioCaptionCue = { id: uid(), startSeconds: atSeconds, endSeconds: cue.endSeconds, text: cut.right };
      const captions = s.project.captions
        .flatMap((c) => (c.id === id ? [left, right] : [c]))
        .sort((a, b) => a.startSeconds - b.startSeconds);
      return { project: { ...s.project, captions }, dirty: true };
    }),

  mergeCaptionWithNext: (id) =>
    set((s) => {
      if (!s.project) return {};
      const sorted = [...s.project.captions].sort((a, b) => a.startSeconds - b.startSeconds);
      const idx = sorted.findIndex((c) => c.id === id);
      if (idx < 0 || idx + 1 >= sorted.length) return {};
      const a = sorted[idx];
      const b = sorted[idx + 1];
      const merged: StudioCaptionCue = {
        ...a,
        endSeconds: Math.max(a.endSeconds, b.endSeconds),
        text: `${a.text} ${b.text}`.trim().slice(0, 500),
      };
      const captions = sorted.filter((c) => c.id !== a.id && c.id !== b.id).concat(merged).sort((x, y) => x.startSeconds - y.startSeconds);
      return { project: { ...s.project, captions }, dirty: true };
    }),

  setCaptionStyle: (patch) =>
    set((s) => {
      if (!s.project) return {};
      const captionStyle: StudioCaptionStyle = { ...DEFAULT_CAPTION_STYLE, ...s.project.captionStyle, ...patch };
      return { project: { ...s.project, captionStyle }, dirty: true };
    }),

  setCaptionsEnabled: (enabled) =>
    set((s) => {
      if (!s.project) return {};
      return { project: { ...s.project, captionsEnabled: enabled }, dirty: true };
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
    return {
      name: p.name,
      schemaVersion: STUDIO_SCHEMA_VERSION,
      fps: p.fps,
      width: p.width,
      height: p.height,
      tracks: p.tracks,
      captions: p.captions,
      captionStyle: p.captionStyle,
      captionsEnabled: p.captionsEnabled,
      audio: p.audio,
    };
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
