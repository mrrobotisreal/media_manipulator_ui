'use client';

import { clampCanvas } from '@/lib/studio/exportOptions';
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
  StudioKeyframe,
  StudioKeyframeEase,
  StudioCaptionCue,
  StudioCaptionStyle,
  StudioAudioConfig,
  StudioTransition,
  StudioTitle,
  StudioTitleLayer,
  StudioTitleTextLayer,
  StudioMarker,
  StudioTrackEffects,
} from '@/lib/studioTypes';
import {
  STUDIO_SCHEMA_VERSION,
  DEFAULT_CAPTION_STYLE,
  normalizeProject,
} from '@/lib/studioTypes';
import { makeDefaultEffect, STUDIO_V3_RANGES } from '@/lib/studio/effectRegistry';
import { clipDuration, clipEnd, timelineDuration } from '@/lib/studio/previewEngine';
import { valueAt } from '@/lib/studio/ease';
import {
  planSpeed,
  planDuration,
  planFreezeDuration,
  planFreezeInsert,
  splitSourcePoint,
  type SpeedPlan,
} from '@/lib/studio/speed';
import {
  isEffectKeyframeProperty,
  keyframeLane,
  keyframeValueRange,
  pruneClipKeyframes,
  KEYFRAME_TIME_EPSILON,
  type NamedKeyframeProperty,
} from '@/lib/studio/keyframes';
import {
  planRoll,
  planSlip,
  planSlide,
  planRippleTrim,
  planRippleToPlayhead,
  type TrimBound,
} from '@/lib/studio/proTrim';
import { clipTrimBound } from '@/lib/studio/clipTrimBound';
import { normalizeTrackEffects } from '@/lib/studio/audioPresets';
import { DEFAULT_TITLE_FONT_FAMILY } from '@/lib/studio/titleFonts';
import { titleFromTextOverlays } from '@/lib/studio/titleConvert';

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
  /**
   * Reversed preview proxy lifecycle (part 17). Absent = never requested.
   * 'ready' also holds when the asset row already carries s3KeyProxyReversed.
   */
  reversed?: 'processing' | 'ready' | 'failed';
  /** reverse_proxy job id while `reversed === 'processing'` */
  reverseJobId?: string;
}

const uid = (): string => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return `id-${Date.now()}-${Math.floor(Math.random() * 1e9).toString(16)}`;
};

const HISTORY_CAP = 100; // undo depth (ADR ui/0001); oldest snapshot dropped beyond this
const DEFAULT_ZOOM = 80; // pixels per second
const MIN_ZOOM = 10;
const MAX_ZOOM = 400;
const MIN_CLIP_SECONDS = 0.1;
/** Default hold for a freshly placed still image (ADR-0008). */
export const DEFAULT_IMAGE_SECONDS = 5;
const MAX_VOLUME = 2; // +6dB ceiling (Premiere-style boost), matches Zod + Go clamp
const MIN_CAPTION_SECONDS = 0.3;

const clampRange = (v: number, lo: number, hi: number): number => Math.max(lo, Math.min(hi, v));

const DEFAULT_AUDIO_CONFIG: StudioAudioConfig = {
  duckingEnabled: false,
  duckAmountDb: 9,
  duckAttackMs: 120,
  duckReleaseMs: 400,
};

/** Timeline tool (part 18). Ephemeral UI state: NOT in the document and NOT in undo history. */
export type StudioToolMode = 'select' | 'razor' | 'slip' | 'slide' | 'hand';

/** Last "this track is locked" rejection; the timeline toasts + shakes on a new `seq`. */
export interface LockNotice {
  seq: number;
  trackId: string;
}

/** Default ruler-marker color (mirrors the Go sanitizer's studioMarkerDefaultColor). */
export const DEFAULT_MARKER_COLOR = '#22C55E';
const MAX_MARKERS = 500;

interface StudioState {
  project: StudioProject | null;
  assets: Record<string, StudioAssetEntry>;
  /** true once the bin was seeded from the server (guards the offline-clip check). */
  assetsLoaded: boolean;
  selectedClipIds: string[];
  selectedCaptionId: string | null;
  playhead: number;
  isPlaying: boolean;
  zoom: number;
  /**
   * Cached `timelineDuration(project.tracks)`.
   *
   * Derived, never set by an action: the `set` wrapper in the store factory
   * recomputes it whenever the tracks array identity changes. Read this instead
   * of calling `timelineDuration()` in a hot path — it used to be recomputed on
   * every `setPlayhead`, i.e. an O(tracks × clips) scan 60 times a second
   * during playback.
   */
  duration: number;
  /** true when the EDL changed since the last successful save */
  dirty: boolean;
  /**
   * Server revision the loaded document is based on (part 07 save safety).
   * Server metadata, NOT part of the document slice: undo/redo must never
   * rewind it, so it lives outside `project` and the history stacks. null when
   * the backend doesn't echo revisions (CreaTV legacy) → saves omit
   * expectedRevision and stay last-write-wins.
   */
  revision: number | null;

  // --- undo history (ADR ui/0001: snapshots of the document slice only) ---
  /** Undo stack: pre-mutation snapshots of `project`, oldest first. */
  past: StudioProject[];
  /** Redo stack: snapshots displaced by undo; the redo target is the last element. */
  future: StudioProject[];
  // --- pro timeline tools (part 18): ephemeral, never part of the document/undo slice ---
  toolMode: StudioToolMode;
  /** Snapping on/off (S). Consumed by the clip-drag snap logic. */
  snapping: boolean;
  selectedMarkerId: string | null;
  markersPanelOpen: boolean;
  /** Mixer drawer (part 19). Ephemeral UI state. */
  mixerOpen: boolean;
  cheatSheetOpen: boolean;
  /** Set when a mutation was rejected because it touched a locked track. */
  lockNotice: LockNotice | null;

  /** >0 while a continuous gesture (clip drag, trim, slider scrub) is in flight. */
  gestureDepth: number;
  /** The pre-gesture document; committed as one history entry by endGesture(). */
  gestureBase: StudioProject | null;

  // --- project lifecycle ---
  loadProject: (project: StudioProject) => void;
  markSaved: (project: StudioProject) => void;
  /**
   * Part 08 crash recovery: replace the working document with a recovered
   * IndexedDB draft. Marks the store dirty (so the autosave pipeline persists
   * it) and resets undo history; the server-metadata fields (`revision`) and
   * the media bin are deliberately untouched — the project itself didn't
   * change, only its document.
   */
  restoreDraft: (document: StudioProject) => void;
  closeProject: () => void;

  // --- history ---
  undo: () => void;
  redo: () => void;
  /**
   * Batch every document mutation until the matching endGesture() into a single
   * history entry. Re-entrant: nested begin/end pairs collapse into the
   * outermost gesture.
   */
  beginGesture: () => void;
  endGesture: () => void;

  // --- media bin ---
  setAssets: (assets: StudioAsset[]) => void;
  upsertAsset: (entry: StudioAssetEntry) => void;
  setAssetStatus: (assetId: string, status: AssetIngestStatus, error?: string) => void;
  setUploadProgress: (assetId: string, progress: number) => void;
  /** Reversed-proxy lifecycle (part 17); not undoable (server state). */
  setAssetReversed: (assetId: string, state: 'processing' | 'ready' | 'failed', jobId?: string) => void;
  /** Part 21: apply server-side bin organization (rename/folder/label). Not undoable, not in the EDL. */
  patchAssetMeta: (assetId: string, patch: Pick<Partial<StudioAsset>, 'displayName' | 'folder' | 'label'>) => void;
  /** Part 21: drop assets from the bin after a successful server delete. Not undoable. */
  removeAssetEntries: (assetIds: string[]) => void;
  /**
   * Part 21 usage-protected delete: remove every clip referencing these assets
   * as ONE undo entry (no ripple; neighbours stay put). Returns the removed clip count.
   */
  removeClipsForAssets: (assetIds: string[]) => number;
  /**
   * Part 21 voiceover: place an asset at the playhead on the first track of the
   * right kind with room, creating a track when none has room. `at` overrides
   * the playhead (voiceover passes where recording began).
   */
  placeAssetAtPlayhead: (assetId: string, at?: number) => void;

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

  // --- pro timeline tools (part 18) ---
  // Lock enforcement is STORE-LEVEL: any mutation that would change the clips
  // of a locked track (or delete it) is dropped whole and raises `lockNotice`.
  setToolMode: (mode: StudioToolMode) => void;
  /** Raise the "track is locked" notice for a UI path that refuses to start a gesture. */
  notifyLocked: (trackId: string) => void;
  toggleSnapping: () => void;
  setMarkersPanelOpen: (open: boolean) => void;
  setCheatSheetOpen: (open: boolean) => void;
  /** Rename a lane; blank clears it back to the "V1"/"A1" default. */
  setTrackName: (trackId: string, name: string) => void;
  toggleTrackLock: (trackId: string) => void;
  /** Video tracks only. */
  toggleTrackHidden: (trackId: string) => void;
  /** Audio tracks only. Solo wins over mute; several tracks may solo. */
  toggleTrackSolo: (trackId: string) => void;
  /** Roll the shared edit point at `editTime` by `delta` timeline seconds; returns the applied delta. */
  rollEdit: (trackId: string, editTime: number, delta: number) => number;
  /** Slip: shift the source window by `delta` SOURCE seconds (position/duration fixed); returns the applied delta. */
  slipClip: (clipId: string, delta: number) => number;
  /** Slide: move the clip by `delta` timeline seconds, touching neighbors absorb; returns the applied delta. */
  slideClip: (clipId: string, delta: number) => number;
  /** Ripple-trim one clip edge by `delta` timeline seconds; returns the applied delta. */
  rippleTrimClip: (clipId: string, side: 'l' | 'r', delta: number) => number;
  /** Q/W: ripple-trim the previous/next edit to the playhead on the selected tracks (all tracks if none). Returns tracks changed. */
  rippleTrimToPlayhead: (direction: 'prev' | 'next') => number;
  /** Razor tool: cut the clip (and its group) at timeline time `t`. */
  razorAt: (clipId: string, t: number) => boolean;
  addMarker: (t?: number) => string | null;
  updateMarker: (id: string, patch: Partial<Pick<StudioMarker, 't' | 'name' | 'color' | 'comment'>>) => void;
  removeMarker: (id: string) => void;
  selectMarker: (id: string | null) => void;
  /** Share one new groupId across the clips (and any groups they already belong to). Needs >= 2 clips. */
  groupClips: (ids: string[]) => boolean;
  /** Clear groupId from the clips' whole groups. */
  ungroupClips: (ids: string[]) => boolean;
  /** Move every member of a group by `delta` seconds, clamped at 0 and by non-member neighbors; returns applied delta. */
  moveGroupBy: (groupId: string, delta: number) => number;
  /** Detach embedded audio into an independent audio clip (see implementation for the mute mechanism). */
  detachAudio: (clipId: string) => string | null;

  // --- effects (Phase 5; typed transitions since part 14) ---
  setClipTransition: (clipId: string, transition: StudioTransition | null) => void;
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

  // --- EDL v3: audio mixer (part 19) ---
  // Continuous controls (faders/knobs/sliders) wrap drags in a gesture
  // (useUndoGesture) so one drag is one undo entry. Neutral values are stored
  // as ABSENT so untouched tracks/projects stay byte-stable.
  /** Track fader, linear 0..2 (1 clears the field). */
  setTrackGain: (trackId: string, gain: number) => void;
  /** Track pan -1..1 (0 clears the field). */
  setTrackPan: (trackId: string, pan: number) => void;
  /** Replace the track's insert effects (flat EQ + no compressor clears them). */
  setTrackEffects: (trackId: string, effects: StudioTrackEffects | undefined) => void;
  /** Project master fader, linear 0..2 (1 clears the field). */
  setMasterGain: (gain: number) => void;
  setMixerOpen: (open: boolean) => void;

  // --- Export depth (part 20) ---
  /**
   * Change the project canvas. Undoable (a normal history entry). Clips keep
   * their transforms untouched — the compositor letterboxes — and nothing is
   * auto-reframed. Width/height are clamped to the server range and made even.
   * No-op when the size is unchanged.
   */
  setCanvas: (width: number, height: number) => void;

  // --- EDL v3: title clips (part 16) ---
  /** Adds a 5s title clip on the topmost (composite-top) video track at the playhead. */
  addTitleClip: () => void;
  addTitleLayer: (clipId: string, type: StudioTitleLayer['type']) => void;
  /** Merges `patch` onto the layer at `index` (the inspector sends one field at a time). */
  updateTitleLayer: (clipId: string, index: number, patch: Record<string, unknown>) => void;
  moveTitleLayer: (clipId: string, fromIndex: number, toIndex: number) => void;
  removeTitleLayer: (clipId: string, index: number) => void;
  /** Legacy convert: textOverlays → an equivalent title clip on the track above (one undo entry). */
  convertOverlaysToTitle: (clipId: string) => void;

  // --- EDL v3: speed controls (part 17) ---
  // No ripple: the clip keeps its start; slow-downs clamp against the next clip.
  // Each is one undo entry. They no-op (returning null) for image/title clips.
  /** Set constant speed (clamped to 0.1x–10x and the neighbour); returns the applied plan. */
  setClipSpeed: (clipId: string, speed: number) => SpeedPlan | null;
  /** Back-solve speed from a desired timeline duration (Premiere-style). Freeze clips just resize. */
  setClipDuration: (clipId: string, seconds: number) => SpeedPlan | { duration: number; clamped: boolean; maxDuration: number } | null;
  /** Flip the clip's play direction (a no-op for freeze/image/title clips). */
  setClipReverse: (clipId: string, reverse: boolean) => void;
  /** The "Maintain audio pitch" toggle (default on; stored only when off). */
  setClipMaintainPitch: (clipId: string, maintain: boolean) => void;
  /**
   * Insert a freeze clip of the frame at the playhead right after the clip
   * (default 2 s, bounded by the neighbour). Returns the new clip id, or null
   * when there is no room / the clip can't be frozen. `bounded` says the
   * length was shortened by the neighbour.
   */
  addFreezeFrame: (clipId: string) => { clipId: string; bounded: boolean } | null;

  // --- EDL v3: per-property keyframes (part 15) ---
  // `property` is a named lane ('positionX'…'pan') or "<effectId>.<param>".
  // All times are clip-local seconds. All actions route through the part-06
  // history capture (gesture-batched by the calling UI where continuous).
  /** Insert/update the keyframe at ≈t. Omitted ease keeps the existing point's ease (or 'linear'). */
  setKeyframe: (clipId: string, property: string, t: number, value: number, ease?: StudioKeyframeEase) => void;
  /** Remove the keyframe at ≈t; removing the last point disarms the lane. */
  removeKeyframe: (clipId: string, property: string, t: number) => void;
  /** Retime the keyframe at ≈fromT to toT (value/ease kept; last-wins on collision). */
  moveKeyframe: (clipId: string, property: string, fromT: number, toT: number) => void;
  /** Arm keyframing: seed keyframe[0] at `atT` from the current static value. */
  armProperty: (clipId: string, property: string, atT: number) => void;
  /** Disarm (UI confirms first): collapse the lane to its value at `atT` as the static field. */
  disarmProperty: (clipId: string, property: string, atT: number) => void;

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

// findSpeedTarget locates the clip + its track for a speed action, refusing
// clips that cannot be retimed: image clips (no time axis; MM15) and title
// clips (generated). `allowFreeze` lets duration edits through for freeze clips.
function findSpeedTarget(
  s: StudioState,
  clipId: string,
  allowFreeze = false,
): { clip: StudioClip; track: StudioTrack } | null {
  if (!s.project) return null;
  for (const track of s.project.tracks) {
    const clip = track.clips.find((c) => c.id === clipId);
    if (!clip) continue;
    if (clip.title) return null;
    if (s.assets[clip.assetId]?.asset.mediaKind === 'image') return null;
    if (clip.freeze && !allowFreeze) return null;
    return { clip, track };
  }
  return null;
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

// --- EDL v3 keyframe lane helpers (part 15) --------------------------------

// normalizeLane mirrors the Go sanitizer: t ≥ 0, value clamped to the
// property's range, sorted by t, deduped (same time → last wins), capped at 64.
function normalizeLane(kfs: StudioKeyframe[], min: number, max: number): StudioKeyframe[] {
  const sorted = [...kfs]
    .map((k) => ({ t: Math.max(0, k.t), value: clampRange(k.value, min, max), ease: k.ease }))
    .sort((a, b) => a.t - b.t);
  const out: StudioKeyframe[] = [];
  for (const k of sorted) {
    if (out.length > 0 && Math.abs(out[out.length - 1].t - k.t) < KEYFRAME_TIME_EPSILON) {
      out[out.length - 1] = k;
    } else {
      out.push(k);
    }
  }
  return out.slice(0, STUDIO_V3_RANGES.keyframesPerProperty);
}

// staticKeyframeValue reads the value an arming stopwatch seeds from — the
// clip's current static field (or the effect param / registry default).
function staticKeyframeValue(clip: StudioClip, property: string): number {
  if (isEffectKeyframeProperty(property)) {
    const dot = property.lastIndexOf('.');
    const effectId = property.slice(0, dot);
    const param = property.slice(dot + 1);
    const effect = (clip.effects ?? []).find((e) => e.id === effectId);
    if (effect) {
      const v = (effect as unknown as Record<string, unknown>)[param];
      if (typeof v === 'number') return v;
    }
    return keyframeValueRange(property).min <= 0 && keyframeValueRange(property).max >= 0 ? 0 : keyframeValueRange(property).min;
  }
  switch (property as NamedKeyframeProperty) {
    case 'positionX':
      return clip.transform?.x ?? 0;
    case 'positionY':
      return clip.transform?.y ?? 0;
    case 'scale':
      return clip.transform?.scale ?? 1;
    case 'rotation':
      return clip.transform?.rotationDeg ?? 0;
    case 'opacity':
      return clip.opacity ?? 1;
    case 'volume':
      return clip.volume ?? 1;
    case 'pan':
      return clip.pan ?? 0;
    default:
      return 0;
  }
}

// writeKeyframeLane returns the clip with `property`'s lane replaced (undefined
// removes it). The v3 'volume' lane keeps the legacy `volumeKeyframes` mirror
// in sync (linear points, gain = value) so the timeline rubber band, pre-v3
// readers, and the export's legacy path all see the same automation — the same
// dual-write convention as transition/transitionInSeconds.
function writeKeyframeLane(clip: StudioClip, property: string, lane: StudioKeyframe[] | undefined): StudioClip {
  const next = { ...(clip.keyframes ?? {}) };
  if (isEffectKeyframeProperty(property)) {
    const effects = { ...(next.effects ?? {}) };
    if (lane && lane.length > 0) effects[property] = lane;
    else delete effects[property];
    next.effects = effects;
  } else if (lane && lane.length > 0) {
    next[property as NamedKeyframeProperty] = lane;
  } else {
    delete next[property as NamedKeyframeProperty];
  }
  const out: StudioClip = { ...clip, keyframes: pruneClipKeyframes(next) };
  if (property === 'volume') {
    out.volumeKeyframes =
      lane && lane.length > 0 ? lane.map((k) => ({ t: k.t, gain: k.value })) : undefined;
  }
  return out;
}

// mirrorLegacyVolume rebuilds the v3 volume lane from a freshly edited legacy
// list (rubber-band edits are linear; eases of points that kept their time are
// preserved). Keeping the lanes mirrored matters because `keyframes.volume`
// wins everywhere since part 15.
function mirrorLegacyVolume(clip: StudioClip, legacy: StudioVolumeKeyframe[]): StudioClip {
  if (legacy.length === 0) {
    return writeKeyframeLane({ ...clip, volumeKeyframes: undefined }, 'volume', undefined);
  }
  const prior = clip.keyframes?.volume ?? [];
  const lane: StudioKeyframe[] = legacy.map((k) => ({
    t: k.t,
    value: k.gain,
    ease: prior.find((p) => Math.abs(p.t - k.t) < KEYFRAME_TIME_EPSILON)?.ease ?? 'linear',
  }));
  const out = writeKeyframeLane(clip, 'volume', lane);
  out.volumeKeyframes = legacy;
  return out;
}

// writeStaticKeyframeValue collapses a disarmed lane's value back onto the
// clip's static field.
function writeStaticKeyframeValue(clip: StudioClip, property: string, value: number): StudioClip {
  if (isEffectKeyframeProperty(property)) {
    const dot = property.lastIndexOf('.');
    const effectId = property.slice(0, dot);
    const param = property.slice(dot + 1);
    return {
      ...clip,
      effects: (clip.effects ?? []).map((e) =>
        e.id === effectId ? ({ ...e, [param]: value } as StudioEffect) : e,
      ),
    };
  }
  const tf: StudioTransform = clip.transform ?? { x: 0, y: 0, scale: 1, rotationDeg: 0 };
  switch (property as NamedKeyframeProperty) {
    case 'positionX':
      return { ...clip, transform: { ...tf, x: value } };
    case 'positionY':
      return { ...clip, transform: { ...tf, y: value } };
    case 'scale':
      return { ...clip, transform: { ...tf, scale: value } };
    case 'rotation':
      return { ...clip, transform: { ...tf, rotationDeg: value } };
    case 'opacity':
      return { ...clip, opacity: value };
    case 'volume':
      return { ...clip, volume: value };
    case 'pan':
      return { ...clip, pan: value === 0 ? undefined : value };
    default:
      return clip;
  }
}

// --- Title clip factories (part 16) ----------------------------------------

// Defaults mirror STUDIO_V3_RANGES.title in effectRegistry.ts.
function makeDefaultTextLayer(): StudioTitleTextLayer {
  return {
    type: 'text',
    text: 'Title',
    fontFamily: DEFAULT_TITLE_FONT_FAMILY,
    fontSizePx: 64,
    fontWeight: 700,
    fillColor: '#FFFFFF',
    align: 'center',
    x: 0.5,
    y: 0.5,
  };
}

function makeDefaultTitleLayer(type: StudioTitleLayer['type']): StudioTitleLayer {
  switch (type) {
    case 'rect':
      // A lower-third-ish bar so the new layer is immediately visible.
      return { type: 'rect', x: 0.1, y: 0.75, w: 0.8, h: 0.08, color: '#FFFFFF', opacity: 0.9 };
    case 'line':
      return { type: 'line', x1: 0.1, y1: 0.7, x2: 0.9, y2: 0.7, color: '#FFFFFF', thicknessPx: 4 };
    default:
      return makeDefaultTextLayer();
  }
}

function makeDefaultTitle(): StudioTitle {
  return { layers: [makeDefaultTextLayer()] };
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
    return clips.map((c) =>
      c.id === draggedId
        ? { ...c, timelineStart: placed, transition: undefined, transitionInSeconds: undefined }
        : c,
    );
  }

  // Reorder — re-pack contiguously from the block's earliest start. Positions
  // change, so any transitions (which depend on overlap) are cleared.
  const base = Math.max(0, Math.min(...clips.map((c) => c.timelineStart)));
  const byId = new Map(clips.map((c) => [c.id, c]));
  let cursor = base;
  return newOrder.map((id) => {
    const c = byId.get(id)!;
    const next = { ...c, timelineStart: cursor, transition: undefined, transitionInSeconds: undefined };
    cursor += clipDuration(c);
    return next;
  });
}

// --- Pro timeline tools helpers (part 18) -----------------------------------

/**
 * The first locked track whose clips differ between two documents (a locked
 * track is also "violated" by being removed). Used by the store-level lock
 * guard in `mutate`: reference-compares the clip arrays first and falls back
 * to an element-wise identity check, because several recipes rebuild the clips
 * array of untouched tracks without changing a single clip.
 */
export function lockedViolation(before: StudioProject, after: StudioProject): string | null {
  if (before.tracks === after.tracks) return null;
  for (const tr of before.tracks) {
    if (!tr.locked) continue;
    const next = after.tracks.find((t) => t.id === tr.id);
    if (!next) return tr.id;
    if (next.clips === tr.clips) continue;
    if (next.clips.length !== tr.clips.length || next.clips.some((c, i) => c !== tr.clips[i])) return tr.id;
  }
  return null;
}

function locate(project: StudioProject, clipId: string): { clip: StudioClip; track: StudioTrack } | null {
  for (const track of project.tracks) {
    const clip = track.clips.find((c) => c.id === clipId);
    if (clip) return { clip, track };
  }
  return null;
}

function withTrackClips(project: StudioProject, trackId: string, clips: StudioClip[]): StudioProject {
  return { ...project, tracks: project.tracks.map((t) => (t.id === trackId ? { ...t, clips } : t)) };
}

/** Per-clip right-trim bound from the bin (clipTrimBound: Infinity for stills + titles, MM14). */
function boundFor(s: { assets: Record<string, StudioAssetEntry> }): TrimBound {
  return (clip) => clipTrimBound(s.assets[clip.assetId]?.asset, !!clip.title);
}

const lockNoticeFor = (s: { lockNotice: LockNotice | null }, trackId: string): LockNotice => ({
  seq: (s.lockNotice?.seq ?? 0) + 1,
  trackId,
});

/** Every clip id sharing a groupId with any of `ids`, plus `ids` themselves. */
export function expandToGroups(ids: readonly string[], project: StudioProject | null): string[] {
  if (!project || ids.length === 0) return [...ids];
  const want = new Set(ids);
  const groups = new Set<string>();
  for (const tr of project.tracks) {
    for (const c of tr.clips) if (want.has(c.id) && c.groupId) groups.add(c.groupId);
  }
  if (groups.size === 0) return [...ids];
  const out = new Set(ids);
  for (const tr of project.tracks) {
    for (const c of tr.clips) if (c.groupId && groups.has(c.groupId)) out.add(c.id);
  }
  return Array.from(out);
}

const MARKER_HEX = /^#[0-9a-fA-F]{6}$/;

function nextMarkerName(markers: readonly StudioMarker[]): string {
  let max = 0;
  for (const m of markers) {
    const hit = /^Marker (\d+)$/.exec(m.name);
    if (hit) max = Math.max(max, Number(hit[1]));
  }
  return `Marker ${Math.max(max, markers.length) + 1}`;
}

const sortMarkers = (ms: StudioMarker[]): StudioMarker[] => [...ms].sort((a, b) => a.t - b.t);

/**
 * Cut every eligible clip crossing `t` in two. The left half keeps the id; the
 * right half gets a fresh id, no entrance transition, and (when the original
 * was grouped) a NEW groupId shared by all right halves of that group — so a
 * grouped cut yields two groups. Non-crossing members of a split group that
 * start at/after `t` join the right-hand group. Speed-aware via
 * splitSourcePoint (part 17).
 */
function cutTracksAt(
  tracks: StudioTrack[],
  t: number,
  eligible: (clip: StudioClip, track: StudioTrack) => boolean,
): { tracks: StudioTrack[]; cutIds: string[]; changed: boolean } {
  const cutIds: string[] = [];
  const newGroupOf = new Map<string, string>();
  let changed = false;
  const cutTracks = tracks.map((track) => {
    let trackChanged = false;
    const clips: StudioClip[] = [];
    for (const c of track.clips) {
      const crosses = t > c.timelineStart + MIN_CLIP_SECONDS && t < clipEnd(c) - MIN_CLIP_SECONDS;
      if (!(crosses && eligible(c, track))) {
        clips.push(c);
        continue;
      }
      trackChanged = true;
      const splitSource = splitSourcePoint(c, t);
      const reversed = c.reverse === true && !c.freeze;
      const left: StudioClip = reversed ? { ...c, sourceIn: splitSource } : { ...c, sourceOut: splitSource };
      let rightGroup = c.groupId;
      if (c.groupId) {
        if (!newGroupOf.has(c.groupId)) newGroupOf.set(c.groupId, uid());
        rightGroup = newGroupOf.get(c.groupId);
      }
      // The right piece starts flush against the left one — no overlap, so it
      // must not inherit the entrance transition.
      const right: StudioClip = {
        ...c,
        id: uid(),
        timelineStart: t,
        ...(reversed ? { sourceOut: splitSource } : { sourceIn: splitSource }),
        transition: undefined,
        transitionInSeconds: undefined,
        groupId: rightGroup,
      };
      clips.push(left, right);
      cutIds.push(left.id, right.id);
    }
    if (trackChanged) changed = true;
    return trackChanged ? { ...track, clips } : track;
  });
  if (!changed) return { tracks, cutIds, changed: false };
  if (newGroupOf.size === 0) return { tracks: cutTracks, cutIds, changed };
  // Pull the not-crossing members that sit after the cut into the right group.
  const cutSet = new Set(cutIds);
  const regrouped = cutTracks.map((track) => {
    let touched = false;
    const clips = track.clips.map((c) => {
      const ng = c.groupId ? newGroupOf.get(c.groupId) : undefined;
      if (ng && !cutSet.has(c.id) && c.timelineStart >= t - 1e-6) {
        touched = true;
        return { ...c, groupId: ng };
      }
      return c;
    });
    return touched ? { ...track, clips } : track;
  });
  return { tracks: regrouped, cutIds, changed };
}

// pruneSelection keeps only the selection ids that still exist in the restored
// document. Undo/redo never snapshot selection (ADR ui/0001) — they just drop
// ids that point at clips the restored EDL doesn't contain.
function pruneSelection(ids: string[], project: StudioProject): string[] {
  if (ids.length === 0) return ids;
  const alive = new Set<string>();
  for (const track of project.tracks) for (const c of track.clips) alive.add(c.id);
  const kept = ids.filter((id) => alive.has(id));
  return kept.length === ids.length ? ids : kept;
}

function pruneCaptionId(id: string | null, project: StudioProject): string | null {
  return id !== null && project.captions.some((c) => c.id === id) ? id : null;
}

function pruneMarkerId(id: string | null, project: StudioProject): string | null {
  return id !== null && (project.markers ?? []).some((m) => m.id === id) ? id : null;
}

type StudioPatch = Partial<StudioState> | ((s: StudioState) => Partial<StudioState>);

export const useStudioStore = create<StudioState>((rawSet, get) => {
  /**
   * Every action writes through here rather than through zustand's `set`.
   *
   * The only extra work is keeping the derived `duration` in sync: it is
   * recomputed exactly when `project.tracks` gets a new identity, which is
   * precisely when an editing action produced new tracks. That replaces the old
   * arrangement where `setPlayhead` recomputed the whole timeline duration
   * inside the setter on every animation frame (B9).
   *
   * No action uses `replace: true`, so the wrapper does not need that overload.
   */
  const set = (partial: StudioPatch) =>
    rawSet((state) => {
      const patch = typeof partial === 'function' ? partial(state) : partial;
      const nextTracks = ('project' in patch ? patch.project : state.project)?.tracks;
      if (nextTracks === state.project?.tracks) return patch;
      return { ...patch, duration: timelineDuration(nextTracks ?? []) };
    });

  /**
   * History capture point (ADR ui/0001): every document-mutating action routes
   * through here instead of `set`. When the recipe produced a new `project`,
   * the pre-mutation snapshot is pushed onto `past` (capped, oldest dropped)
   * and the redo stack is cleared. Inside a gesture the recipe just applies —
   * endGesture() commits the single pre-gesture snapshot. Recipes that bail
   * out (`{}`) or return the same `project` reference record nothing.
   */
  const mutate = (recipe: (s: StudioState) => Partial<StudioState>) =>
    set((state) => {
      const patch = recipe(state);
      if (!state.project || !patch.project || patch.project === state.project) return patch;
      // Part 18 lock enforcement, store-level: a recipe that would change a
      // locked track's clips (or remove it) is dropped whole, whichever UI
      // surface (drag, keyboard, inspector, context menu) it came from.
      const blocked = lockedViolation(state.project, patch.project);
      if (blocked) return { lockNotice: lockNoticeFor(state, blocked) };
      if (state.gestureDepth > 0) return patch;
      return { ...patch, past: [...state.past, state.project].slice(-HISTORY_CAP), future: [] };
    });

  return {
  project: null,
  assets: {},
  assetsLoaded: false,
  selectedClipIds: [],
  selectedCaptionId: null,
  playhead: 0,
  isPlaying: false,
  zoom: DEFAULT_ZOOM,
  duration: 0,
  dirty: false,
  revision: null,
  toolMode: 'select',
  snapping: true,
  selectedMarkerId: null,
  markersPanelOpen: false,
  mixerOpen: false,
  cheatSheetOpen: false,
  lockNotice: null,
  past: [],
  future: [],
  gestureDepth: 0,
  gestureBase: null,

  loadProject: (project) => {
    // Upgrade v1 → v2 in memory (additive defaults) before hydrating the store.
    const normalized = normalizeProject(project);
    // History is session-only and per-document: switching projects starts fresh.
    set({
      project: { ...normalized, tracks: ensureBaseTracks(normalized.tracks ?? []) },
      selectedClipIds: [],
      selectedCaptionId: null,
      selectedMarkerId: null,
      lockNotice: null,
      playhead: 0,
      isPlaying: false,
      dirty: false,
      revision: project.revision ?? null,
      past: [],
      future: [],
      gestureDepth: 0,
      gestureBase: null,
    });
  },

  markSaved: (project) =>
    set((s) => ({
      // Keep the live tracks (the user may have edited mid-save); only adopt
      // server-authoritative metadata + clear the dirty flag.
      project: s.project
        ? { ...s.project, updatedAt: project.updatedAt, durationSeconds: project.durationSeconds }
        : project,
      // Adopt the incremented server revision so the next save's CAS passes.
      // A backend that doesn't echo one keeps whatever we had (legacy mode).
      revision: project.revision ?? s.revision,
      dirty: false,
    })),

  restoreDraft: (document) =>
    set((s) => {
      if (!s.project) return {};
      const normalized = normalizeProject(document);
      return {
        project: { ...normalized, tracks: ensureBaseTracks(normalized.tracks ?? []) },
        selectedClipIds: [],
        selectedCaptionId: null,
        dirty: true,
        past: [],
        future: [],
        gestureDepth: 0,
        gestureBase: null,
      };
    }),

  closeProject: () =>
    set({
      project: null,
      assets: {},
      assetsLoaded: false,
      selectedClipIds: [],
      selectedCaptionId: null,
      selectedMarkerId: null,
      toolMode: 'select',
      markersPanelOpen: false,
      mixerOpen: false,
      cheatSheetOpen: false,
      lockNotice: null,
      playhead: 0,
      isPlaying: false,
      dirty: false,
      revision: null,
      past: [],
      future: [],
      gestureDepth: 0,
      gestureBase: null,
    }),

  // --- history (ADR ui/0001: session-only snapshot stacks over `project`) ---

  // Undo/redo swap the document with the top of past/future and mark it dirty
  // so the autosave effect persists the restored state like any other edit.
  // Playhead/zoom/transport are deliberately untouched; selection is only
  // pruned of ids the restored document no longer contains. Ignored while a
  // gesture is open — the half-applied gesture would corrupt the stacks.
  undo: () =>
    set((s) => {
      if (s.gestureDepth > 0 || !s.project || s.past.length === 0) return {};
      const restored = s.past[s.past.length - 1];
      return {
        project: restored,
        past: s.past.slice(0, -1),
        future: [...s.future, s.project],
        selectedClipIds: pruneSelection(s.selectedClipIds, restored),
        selectedCaptionId: pruneCaptionId(s.selectedCaptionId, restored),
        selectedMarkerId: pruneMarkerId(s.selectedMarkerId, restored),
        dirty: true,
      };
    }),

  redo: () =>
    set((s) => {
      if (s.gestureDepth > 0 || !s.project || s.future.length === 0) return {};
      const restored = s.future[s.future.length - 1];
      return {
        project: restored,
        past: [...s.past, s.project].slice(-HISTORY_CAP),
        future: s.future.slice(0, -1),
        selectedClipIds: pruneSelection(s.selectedClipIds, restored),
        selectedCaptionId: pruneCaptionId(s.selectedCaptionId, restored),
        selectedMarkerId: pruneMarkerId(s.selectedMarkerId, restored),
        dirty: true,
      };
    }),

  beginGesture: () =>
    set((s) =>
      s.gestureDepth === 0
        ? { gestureDepth: 1, gestureBase: s.project }
        : { gestureDepth: s.gestureDepth + 1 },
    ),

  endGesture: () =>
    set((s) => {
      if (s.gestureDepth === 0) return {}; // unbalanced end — tolerate
      if (s.gestureDepth > 1) return { gestureDepth: s.gestureDepth - 1 };
      // Outermost end: one entry for the whole gesture, and only if the
      // document actually changed (reference compare — actions are immutable).
      const changed = s.gestureBase !== null && s.project !== null && s.gestureBase !== s.project;
      if (!changed) return { gestureDepth: 0, gestureBase: null };
      return {
        gestureDepth: 0,
        gestureBase: null,
        past: [...s.past, s.gestureBase!].slice(-HISTORY_CAP),
        future: [],
      };
    }),

  setAssets: (assets) =>
    set(() => {
      const map: Record<string, StudioAssetEntry> = {};
      for (const a of assets) {
        map[a.id] = {
          asset: a,
          status: a.s3KeyProxy ? 'ready' : 'processing',
          uploadProgress: 100,
          ...(a.s3KeyProxyReversed ? { reversed: 'ready' as const } : {}),
        };
      }
      return { assets: map, assetsLoaded: true };
    }),

  upsertAsset: (entry) =>
    set((s) => ({ assets: { ...s.assets, [entry.asset.id]: entry } })),

  setAssetStatus: (assetId, status, error) =>
    set((s) => {
      const existing = s.assets[assetId];
      if (!existing) return {};
      return { assets: { ...s.assets, [assetId]: { ...existing, status, error } } };
    }),

  setAssetReversed: (assetId, state, jobId) =>
    set((s) => {
      const existing = s.assets[assetId];
      if (!existing) return {};
      return {
        assets: {
          ...s.assets,
          [assetId]: { ...existing, reversed: state, reverseJobId: state === 'processing' ? jobId : undefined },
        },
      };
    }),

  setUploadProgress: (assetId, progress) =>
    set((s) => {
      const existing = s.assets[assetId];
      if (!existing) return {};
      return { assets: { ...s.assets, [assetId]: { ...existing, uploadProgress: progress } } };
    }),

  patchAssetMeta: (assetId, patch) =>
    set((s) => {
      const existing = s.assets[assetId];
      if (!existing) return {};
      const asset = { ...existing.asset };
      for (const key of ['displayName', 'folder', 'label'] as const) {
        if (key in patch) asset[key] = patch[key] || undefined;
      }
      return { assets: { ...s.assets, [assetId]: { ...existing, asset } } };
    }),

  removeAssetEntries: (assetIds) =>
    set((s) => {
      const drop = new Set(assetIds);
      const next: Record<string, StudioAssetEntry> = {};
      for (const [id, entry] of Object.entries(s.assets)) if (!drop.has(id)) next[id] = entry;
      return { assets: next };
    }),

  removeClipsForAssets: (assetIds) => {
    const drop = new Set(assetIds);
    let removed = 0;
    mutate((s) => {
      if (!s.project) return {};
      const gone = new Set<string>();
      const tracks = mapTracks(s.project.tracks, (track) => {
        // Locked tracks keep their clips (they surface as "Media offline").
        if (track.locked) return track;
        const hit = track.clips.filter((c) => c.assetId && drop.has(c.assetId));
        if (hit.length === 0) return track;
        for (const c of hit) gone.add(c.id);
        return { ...track, clips: track.clips.filter((c) => !gone.has(c.id)) };
      });
      removed = gone.size;
      if (removed === 0) return {};
      return {
        project: { ...s.project, tracks },
        selectedClipIds: s.selectedClipIds.filter((id) => !gone.has(id)),
        dirty: true,
      };
    });
    return removed;
  },

  placeAssetAtPlayhead: (assetId, at) =>
    mutate((s) => {
      if (!s.project) return {};
      const entry = s.assets[assetId];
      if (!entry || entry.asset.mediaKind === 'lut') return {};
      const kind: StudioTrackKind = entry.asset.mediaKind === 'audio' ? 'audio' : 'video';
      const isImage = entry.asset.mediaKind === 'image';
      const duration = isImage
        ? DEFAULT_IMAGE_SECONDS
        : entry.asset.durationSeconds > 0
          ? entry.asset.durationSeconds
          : 5;
      const start = Math.max(0, at ?? s.playhead);
      const end = start + duration;
      const hasRoom = (t: StudioTrack) =>
        t.kind === kind && !t.locked && !t.clips.some((c) => c.timelineStart < end && clipEnd(c) > start);
      let tracks = ensureBaseTracks(s.project.tracks);
      let target = tracks.find(hasRoom);
      if (!target) {
        const maxIndex = tracks.filter((t) => t.kind === kind).reduce((m, t) => Math.max(m, t.index), -1);
        target = { id: uid(), kind, index: maxIndex + 1, muted: false, clips: [] };
        tracks = [...tracks, target];
      }
      const targetId = target.id;
      const newClipId = uid();
      const clip: StudioClip = {
        id: newClipId,
        assetId,
        streamIndex: 0,
        timelineStart: start,
        sourceIn: 0,
        sourceOut: duration,
        volume: !isImage && entry.asset.hasAudio ? 1 : undefined,
      };
      const next = tracks.map((t) => (t.id === targetId ? { ...t, clips: [...t.clips, clip] } : t));
      return { project: { ...s.project, tracks: next }, selectedClipIds: [newClipId], dirty: true };
    }),

  // addClipFromAsset routes by media kind: video assets land on the first video
  // track, audio assets on the first audio track (both guaranteed to exist),
  // appended after that track's existing content.
  addClipFromAsset: (assetId) =>
    mutate((s) => {
      if (!s.project) return {};
      const entry = s.assets[assetId];
      if (!entry || entry.asset.mediaKind === 'lut') return {}; // LUTs are graded, not placed
      const kind: StudioTrackKind = entry.asset.mediaKind === 'audio' ? 'audio' : 'video';
      const isImage = entry.asset.mediaKind === 'image';
      const duration = isImage
        ? DEFAULT_IMAGE_SECONDS
        : entry.asset.durationSeconds > 0
          ? entry.asset.durationSeconds
          : 5;
      const tracks = ensureBaseTracks(s.project.tracks);
      const newClipId = uid();
      let placed = false;
      const next = tracks.map((track) => {
        if (placed || track.kind !== kind || track.locked) return track;
        placed = true;
        const startAt = isImage
          ? fitInGaps(track.clips.map((c) => ({ start: c.timelineStart, end: clipEnd(c) })), duration, 0)
          : track.clips.reduce((max, c) => Math.max(max, clipEnd(c)), 0);
        const clip: StudioClip = {
          id: newClipId,
          assetId,
          streamIndex: 0,
          timelineStart: startAt,
          sourceIn: 0,
          sourceOut: duration,
          volume: !isImage && entry.asset.hasAudio ? 1 : undefined,
        };
        return { ...track, clips: [...track.clips, clip] };
      });
      return { project: { ...s.project, tracks: next }, selectedClipIds: [newClipId], dirty: true };
    }),

  // addClipFromAssetToTrack appends a clip for the asset onto a specific track
  // (used when an asset is dragged from the media bin onto a chosen lane). The
  // caller validates that the asset kind matches the track kind.
  addClipFromAssetToTrack: (assetId, trackId) =>
    mutate((s) => {
      if (!s.project) return {};
      const entry = s.assets[assetId];
      if (!entry || entry.asset.mediaKind === 'lut') return {};
      const isImage = entry.asset.mediaKind === 'image';
      const duration = isImage
        ? DEFAULT_IMAGE_SECONDS
        : entry.asset.durationSeconds > 0
          ? entry.asset.durationSeconds
          : 5;
      const newClipId = uid();
      let placed = false;
      const next = s.project.tracks.map((track) => {
        if (track.id !== trackId) return track;
        placed = true;
        const startAt = isImage
          ? fitInGaps(track.clips.map((c) => ({ start: c.timelineStart, end: clipEnd(c) })), duration, 0)
          : track.clips.reduce((max, c) => Math.max(max, clipEnd(c)), 0);
        const clip: StudioClip = {
          id: newClipId,
          assetId,
          streamIndex: 0,
          timelineStart: startAt,
          sourceIn: 0,
          sourceOut: duration,
          volume: !isImage && entry.asset.hasAudio ? 1 : undefined,
        };
        return { ...track, clips: [...track.clips, clip] };
      });
      if (!placed) return {};
      return { project: { ...s.project, tracks: next }, selectedClipIds: [newClipId], dirty: true };
    }),

  updateClip: (clipId, patch) =>
    mutate((s) => {
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
    mutate((s) => {
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
    mutate((s) => {
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

  // splitAtPlayhead cuts every clip the playhead strictly crosses into two
  // (left keeps the original id + selection, right gets a new id). When clips
  // are selected only those (plus their groups) are cut; otherwise all
  // crossing clips. Locked tracks are skipped (and raise the lock notice).
  splitAtPlayhead: () =>
    mutate((s) => {
      if (!s.project) return {};
      const t = s.playhead;
      const restrictTo = new Set(expandToGroups(s.selectedClipIds, s.project));
      const restrict = restrictTo.size > 0;
      let lockedHit: string | null = null;
      const res = cutTracksAt(s.project.tracks, t, (c, track) => {
        if (restrict && !restrictTo.has(c.id)) return false;
        if (track.locked) {
          lockedHit = lockedHit ?? track.id;
          return false;
        }
        return true;
      });
      if (!res.changed) return lockedHit ? { lockNotice: lockNoticeFor(s, lockedHit) } : {};
      const nextSelected = new Set(s.selectedClipIds);
      for (const id of res.cutIds) nextSelected.add(id);
      return {
        project: { ...s.project, tracks: res.tracks },
        selectedClipIds: Array.from(nextSelected),
        dirty: true,
        ...(lockedHit ? { lockNotice: lockNoticeFor(s, lockedHit) } : {}),
      };
    }),

  // razorAt is the Razor tool: cut the clicked clip (and any group members
  // that cross the same instant) at timeline time `t`. Selection is untouched.
  razorAt: (clipId, t) => {
    let did = false;
    mutate((s) => {
      if (!s.project) return {};
      const found = locate(s.project, clipId);
      if (!found) return {};
      if (found.track.locked) return { lockNotice: lockNoticeFor(s, found.track.id) };
      const members = new Set(expandToGroups([clipId], s.project));
      const res = cutTracksAt(s.project.tracks, t, (c, track) => members.has(c.id) && !track.locked);
      if (!res.changed) return {};
      did = true;
      return { project: { ...s.project, tracks: res.tracks }, dirty: true };
    });
    return did;
  },

  // deleteSelected ripple-deletes every selected clip: each kept clip shifts
  // left by the total duration of selected clips that started before it,
  // closing gaps across one or many deletions.
  deleteSelected: () =>
    mutate((s) => {
      if (!s.project || s.selectedClipIds.length === 0) return {};
      const sel = new Set(s.selectedClipIds);
      let lockedHit: string | null = null;
      const removedIds = new Set<string>();
      const tracks = mapTracks(s.project.tracks, (track) => {
        const removed = track.clips.filter((c) => sel.has(c.id));
        if (removed.length === 0) return track;
        if (track.locked) {
          lockedHit = lockedHit ?? track.id;
          return track;
        }
        for (const r of removed) removedIds.add(r.id);
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
      const notice = lockedHit ? { lockNotice: lockNoticeFor(s, lockedHit) } : {};
      if (removedIds.size === 0) return notice;
      return {
        project: { ...s.project, tracks },
        selectedClipIds: s.selectedClipIds.filter((id) => !removedIds.has(id)),
        dirty: true,
        ...notice,
      };
    }),

  // Selecting a grouped clip selects its whole group (part 18); an additive
  // click toggles the whole group in or out.
  selectClip: (clipId, additive = false) =>
    set((s) => {
      if (clipId === null) return { selectedClipIds: [], selectedCaptionId: null, selectedMarkerId: null };
      const members = expandToGroups([clipId], s.project);
      if (additive) {
        const next = new Set(s.selectedClipIds);
        if (next.has(clipId)) for (const id of members) next.delete(id);
        else for (const id of members) next.add(id);
        return { selectedClipIds: Array.from(next), selectedCaptionId: null, selectedMarkerId: null };
      }
      return {
        selectedClipIds: [clipId, ...members.filter((m) => m !== clipId)],
        selectedCaptionId: null,
        selectedMarkerId: null,
      };
    }),

  selectCaption: (id) => set({ selectedCaptionId: id, selectedClipIds: [] }),

  addTrack: (kind) =>
    mutate((s) => {
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
    mutate((s) => {
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
    mutate((s) => {
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

  // --- pro timeline tools (part 18) ---------------------------------------

  setToolMode: (mode) => set((s) => (s.toolMode === mode ? {} : { toolMode: mode })),
  notifyLocked: (trackId) => set((s) => ({ lockNotice: lockNoticeFor(s, trackId) })),
  toggleSnapping: () => set((s) => ({ snapping: !s.snapping })),
  setMarkersPanelOpen: (open) => set({ markersPanelOpen: open }),
  setCheatSheetOpen: (open) => set({ cheatSheetOpen: open }),

  setTrackName: (trackId, name) =>
    mutate((s) => {
      if (!s.project) return {};
      const clean = name.trim().slice(0, 80);
      const tracks = s.project.tracks.map((t) =>
        t.id === trackId && (t.name ?? '') !== clean ? { ...t, name: clean === '' ? undefined : clean } : t,
      );
      if (tracks.every((t, i) => t === s.project!.tracks[i])) return {};
      return { project: { ...s.project, tracks }, dirty: true };
    }),

  // Locking/unlocking is itself a document edit (so it undoes), but it never
  // touches the track's clips — which is what the lock guard compares.
  toggleTrackLock: (trackId) =>
    mutate((s) => {
      if (!s.project) return {};
      return {
        project: {
          ...s.project,
          tracks: s.project.tracks.map((t) => (t.id === trackId ? { ...t, locked: t.locked ? undefined : true } : t)),
        },
        dirty: true,
      };
    }),

  toggleTrackHidden: (trackId) =>
    mutate((s) => {
      if (!s.project) return {};
      const target = s.project.tracks.find((t) => t.id === trackId);
      if (!target || target.kind !== 'video') return {};
      return {
        project: {
          ...s.project,
          tracks: s.project.tracks.map((t) => (t.id === trackId ? { ...t, hidden: t.hidden ? undefined : true } : t)),
        },
        dirty: true,
      };
    }),

  toggleTrackSolo: (trackId) =>
    mutate((s) => {
      if (!s.project) return {};
      const target = s.project.tracks.find((t) => t.id === trackId);
      if (!target || target.kind !== 'audio') return {};
      return {
        project: {
          ...s.project,
          tracks: s.project.tracks.map((t) => (t.id === trackId ? { ...t, solo: t.solo ? undefined : true } : t)),
        },
        dirty: true,
      };
    }),

  rollEdit: (trackId, editTime, delta) => {
    let applied = 0;
    mutate((s) => {
      if (!s.project) return {};
      const track = s.project.tracks.find((t) => t.id === trackId);
      if (!track) return {};
      if (track.locked) return { lockNotice: lockNoticeFor(s, track.id) };
      const plan = planRoll(track.clips, editTime, delta, boundFor(s));
      if (!plan || plan.applied === 0) return {};
      applied = plan.applied;
      return { project: withTrackClips(s.project, trackId, plan.clips), dirty: true };
    });
    return applied;
  },

  slipClip: (clipId, delta) => {
    let applied = 0;
    mutate((s) => {
      if (!s.project) return {};
      const found = locate(s.project, clipId);
      if (!found) return {};
      if (found.track.locked) return { lockNotice: lockNoticeFor(s, found.track.id) };
      const plan = planSlip(found.clip, delta, boundFor(s)(found.clip));
      if (!plan || plan.applied === 0) return {};
      applied = plan.applied;
      return {
        project: withTrackClips(s.project, found.track.id, found.track.clips.map((c) => (c.id === clipId ? plan.clip : c))),
        dirty: true,
      };
    });
    return applied;
  },

  slideClip: (clipId, delta) => {
    let applied = 0;
    mutate((s) => {
      if (!s.project) return {};
      const found = locate(s.project, clipId);
      if (!found) return {};
      if (found.track.locked) return { lockNotice: lockNoticeFor(s, found.track.id) };
      const plan = planSlide(found.track.clips, clipId, delta, boundFor(s));
      if (!plan || plan.applied === 0) return {};
      applied = plan.applied;
      return { project: withTrackClips(s.project, found.track.id, plan.clips), dirty: true };
    });
    return applied;
  },

  rippleTrimClip: (clipId, side, delta) => {
    let applied = 0;
    mutate((s) => {
      if (!s.project) return {};
      const found = locate(s.project, clipId);
      if (!found) return {};
      if (found.track.locked) return { lockNotice: lockNoticeFor(s, found.track.id) };
      const plan = planRippleTrim(found.track.clips, clipId, side, delta, boundFor(s));
      if (!plan || plan.applied === 0) return {};
      applied = plan.applied;
      return { project: withTrackClips(s.project, found.track.id, plan.clips), dirty: true };
    });
    return applied;
  },

  rippleTrimToPlayhead: (direction) => {
    let changedTracks = 0;
    mutate((s) => {
      if (!s.project) return {};
      const sel = new Set(s.selectedClipIds);
      const scoped = sel.size > 0;
      let lockedHit: string | null = null;
      const bound = boundFor(s);
      const tracks = s.project.tracks.map((track) => {
        if (scoped && !track.clips.some((c) => sel.has(c.id))) return track;
        if (track.clips.length === 0) return track;
        const plan = planRippleToPlayhead(track.clips, s.playhead, direction, bound);
        if (!plan || plan.applied === 0) return track;
        if (track.locked) {
          lockedHit = lockedHit ?? track.id;
          return track;
        }
        changedTracks += 1;
        return { ...track, clips: plan.clips };
      });
      const notice = lockedHit ? { lockNotice: lockNoticeFor(s, lockedHit) } : {};
      if (changedTracks === 0) return notice;
      return { project: { ...s.project, tracks }, dirty: true, ...notice };
    });
    return changedTracks;
  },

  addMarker: (t) => {
    let id: string | null = null;
    mutate((s) => {
      if (!s.project) return {};
      const markers = s.project.markers ?? [];
      if (markers.length >= MAX_MARKERS) return {};
      const at = Math.max(0, t ?? s.playhead);
      id = uid();
      const marker: StudioMarker = { id, t: at, name: nextMarkerName(markers), color: DEFAULT_MARKER_COLOR };
      return {
        project: { ...s.project, markers: sortMarkers([...markers, marker]) },
        selectedMarkerId: id,
        dirty: true,
      };
    });
    return id;
  },

  updateMarker: (id, patch) =>
    mutate((s) => {
      if (!s.project) return {};
      const markers = s.project.markers ?? [];
      if (!markers.some((m) => m.id === id)) return {};
      const next = markers.map((m) => {
        if (m.id !== id) return m;
        const merged: StudioMarker = { ...m, ...patch };
        merged.t = Math.max(0, Number.isFinite(merged.t) ? merged.t : m.t);
        merged.name = merged.name.slice(0, 80);
        if (!MARKER_HEX.test(merged.color)) merged.color = m.color;
        if (merged.comment !== undefined) merged.comment = merged.comment === '' ? undefined : merged.comment.slice(0, 500);
        return merged;
      });
      return { project: { ...s.project, markers: sortMarkers(next) }, dirty: true };
    }),

  removeMarker: (id) =>
    mutate((s) => {
      if (!s.project) return {};
      const markers = s.project.markers ?? [];
      if (!markers.some((m) => m.id === id)) return {};
      const rest = markers.filter((m) => m.id !== id);
      return {
        project: { ...s.project, markers: rest.length > 0 ? rest : undefined },
        selectedMarkerId: s.selectedMarkerId === id ? null : s.selectedMarkerId,
        dirty: true,
      };
    }),

  selectMarker: (id) => set({ selectedMarkerId: id, ...(id ? { selectedClipIds: [], selectedCaptionId: null } : {}) }),

  groupClips: (ids) => {
    let did = false;
    mutate((s) => {
      if (!s.project) return {};
      const members = new Set(expandToGroups(ids, s.project));
      if (members.size < 2) return {};
      const groupId = uid();
      const tracks = s.project.tracks.map((track) => {
        if (!track.clips.some((c) => members.has(c.id))) return track;
        return { ...track, clips: track.clips.map((c) => (members.has(c.id) ? { ...c, groupId } : c)) };
      });
      did = true;
      return { project: { ...s.project, tracks }, selectedClipIds: Array.from(members), dirty: true };
    });
    return did;
  },

  ungroupClips: (ids) => {
    let did = false;
    mutate((s) => {
      if (!s.project) return {};
      const members = new Set(expandToGroups(ids, s.project));
      const tracks = s.project.tracks.map((track) => {
        if (!track.clips.some((c) => members.has(c.id) && c.groupId)) return track;
        return {
          ...track,
          clips: track.clips.map((c) => (members.has(c.id) && c.groupId ? { ...c, groupId: undefined } : c)),
        };
      });
      if (tracks.every((t, i) => t === s.project!.tracks[i])) return {};
      did = true;
      return { project: { ...s.project, tracks }, dirty: true };
    });
    return did;
  },

  // moveGroupBy shifts every member of a group by the same delta (one pure
  // step; the drag route calls it inside the drag's gesture). Members keep
  // their relative offsets and tracks. The delta is clamped so no member goes
  // below 0 and none collides with a NON-member clip on its track.
  moveGroupBy: (groupId, delta) => {
    let applied = 0;
    mutate((s) => {
      if (!s.project) return {};
      const lockedTrack = s.project.tracks.find((t) => t.locked && t.clips.some((c) => c.groupId === groupId));
      if (lockedTrack) return { lockNotice: lockNoticeFor(s, lockedTrack.id) };
      let lo = -Infinity;
      let hi = Infinity;
      for (const track of s.project.tracks) {
        const mine = track.clips.filter((c) => c.groupId === groupId);
        if (mine.length === 0) continue;
        const others = track.clips.filter((c) => c.groupId !== groupId);
        for (const m of mine) {
          lo = Math.max(lo, -m.timelineStart);
          for (const o of others) {
            if (clipEnd(o) <= m.timelineStart + 1e-6) lo = Math.max(lo, clipEnd(o) - m.timelineStart);
            else if (o.timelineStart >= clipEnd(m) - 1e-6) hi = Math.min(hi, o.timelineStart - clipEnd(m));
            else return {}; // already overlapping a non-member: refuse to move
          }
        }
      }
      if (lo > hi) return {};
      const d = clampRange(delta, lo, hi);
      if (d === 0) return {};
      applied = d;
      const tracks = s.project.tracks.map((track) =>
        track.clips.some((c) => c.groupId === groupId)
          ? {
              ...track,
              clips: track.clips.map((c) =>
                c.groupId === groupId
                  ? { ...c, timelineStart: Math.max(0, c.timelineStart + d), transition: undefined, transitionInSeconds: undefined }
                  : c,
              ),
            }
          : track,
      );
      return { project: { ...s.project, tracks }, dirty: true };
    });
    return applied;
  },

  // detachAudio: the embedded-audio model stays implicit (a video clip carries
  // its own sound). Detach creates an independent audio clip with the same
  // asset/trim/position/speed/pitch (volume, pan and their lanes move with it)
  // and silences the video clip with `volume: 0` and no volume automation — no
  // dedicated flag exists, and the export already skips a volume-0 clip's audio
  // (studio_export_plan.go: contributesAudio), so preview and export agree
  // with no schema change. The pair is grouped so they still move/select/split
  // together (Premiere's "linked" feel); ungroup frees them.
  detachAudio: (clipId) => {
    let newId: string | null = null;
    mutate((s) => {
      if (!s.project) return {};
      const found = locate(s.project, clipId);
      if (!found) return {};
      const { clip, track } = found;
      const entry = s.assets[clip.assetId];
      if (track.kind !== 'video' || clip.title || clip.freeze || !entry?.asset.hasAudio) return {};
      if (entry.asset.mediaKind !== 'video') return {};
      if ((clip.volume ?? 1) === 0 && !clip.volumeKeyframes?.length && !clip.keyframes?.volume?.length) return {}; // already silent
      if (track.locked) return { lockNotice: lockNoticeFor(s, track.id) };
      const start = clip.timelineStart;
      const end = clipEnd(clip);
      const room = (t: StudioTrack) =>
        t.kind === 'audio' && !t.locked && !t.clips.some((c) => c.timelineStart < end - 1e-6 && clipEnd(c) > start + 1e-6);
      let tracks = s.project.tracks;
      let target = tracks.find(room);
      if (!target) {
        const maxIndex = tracks.filter((t) => t.kind === 'audio').reduce((m, t) => Math.max(m, t.index), -1);
        target = { id: uid(), kind: 'audio', index: maxIndex + 1, muted: false, clips: [] };
        tracks = [...tracks, target];
      }
      const targetId = target.id;
      const groupId = clip.groupId ?? uid();
      const created = uid();
      newId = created;
      const audioLanes: StudioClip['keyframes'] =
        clip.keyframes?.volume || clip.keyframes?.pan
          ? {
              ...(clip.keyframes.volume ? { volume: clip.keyframes.volume } : {}),
              ...(clip.keyframes.pan ? { pan: clip.keyframes.pan } : {}),
            }
          : undefined;
      const audioClip: StudioClip = {
        id: created,
        assetId: clip.assetId,
        streamIndex: clip.streamIndex,
        timelineStart: start,
        sourceIn: clip.sourceIn,
        sourceOut: clip.sourceOut,
        speed: clip.speed,
        reverse: clip.reverse,
        maintainPitch: clip.maintainPitch,
        volume: clip.volume ?? 1,
        pan: clip.pan,
        volumeKeyframes: clip.volumeKeyframes,
        keyframes: audioLanes,
        groupId,
      };
      let silenced: StudioClip = { ...clip, volume: 0, volumeKeyframes: undefined, pan: undefined, groupId };
      silenced = writeKeyframeLane(silenced, 'volume', undefined);
      if (silenced.keyframes?.pan) silenced = writeKeyframeLane(silenced, 'pan', undefined);
      const next = tracks.map((t) => {
        if (t.id === targetId) return { ...t, clips: [...t.clips, audioClip] };
        if (t.id === track.id) return { ...t, clips: t.clips.map((c) => (c.id === clipId ? silenced : c)) };
        return t;
      });
      return { project: { ...s.project, tracks: next }, selectedClipIds: [clipId, created], dirty: true };
    });
    return newId;
  },

  // setClipTransition sets/updates the clip's typed entrance transition from
  // the nearest preceding clip on the same track. The v2 overlap model is kept:
  // the clip is pulled left to overlap its predecessor by the transition
  // duration (clamped to both clips' durations + the registry range), and the
  // legacy transitionInSeconds mirror stays in sync (the Go sanitizer does the
  // same). `null` removes the transition and restores the un-pulled position
  // (clip start snaps back to the predecessor's end).
  // --- EDL v3: speed controls (part 17) ---

  setClipSpeed: (clipId, speed) => {
    const found = findSpeedTarget(get(), clipId);
    if (!found) return null;
    const plan = planSpeed(found.track.clips, found.clip, speed);
    get().updateClip(clipId, { speed: plan.speed === 1 ? undefined : plan.speed });
    return plan;
  },

  setClipDuration: (clipId, seconds) => {
    const found = findSpeedTarget(get(), clipId, true);
    if (!found) return null;
    if (found.clip.freeze) {
      const fp = planFreezeDuration(found.track.clips, found.clip, seconds);
      get().updateClip(clipId, { sourceOut: found.clip.sourceIn + fp.duration });
      return fp;
    }
    const plan = planDuration(found.track.clips, found.clip, seconds);
    get().updateClip(clipId, { speed: plan.speed === 1 ? undefined : plan.speed });
    return plan;
  },

  setClipReverse: (clipId, reverse) => {
    const found = findSpeedTarget(get(), clipId);
    if (!found || found.clip.freeze) return;
    get().updateClip(clipId, { reverse: reverse ? true : undefined });
  },

  setClipMaintainPitch: (clipId, maintain) => {
    const found = findSpeedTarget(get(), clipId);
    if (!found) return;
    get().updateClip(clipId, { maintainPitch: maintain ? undefined : false });
  },

  addFreezeFrame: (clipId) => {
    const st = get();
    const found = findSpeedTarget(st, clipId, true);
    if (!found || found.clip.freeze || found.track.kind !== 'video') return null;
    const asset = st.assets[found.clip.assetId]?.asset;
    if (!asset || asset.mediaKind !== 'video') return null;
    const plan = planFreezeInsert(found.track.clips, found.clip, st.playhead);
    if (!plan) return null;
    const src = found.clip;
    const frame: StudioClip = {
      id: uid(),
      assetId: src.assetId,
      streamIndex: src.streamIndex,
      timelineStart: plan.timelineStart,
      sourceIn: plan.sourceTime,
      sourceOut: plan.sourceTime + plan.duration,
      freeze: { sourceTime: plan.sourceTime },
      // A held frame keeps the clip's LOOK (static grade/placement); it has no
      // sound, no entrance transition and no animation lanes.
      opacity: src.opacity,
      adjustments: src.adjustments,
      transform: src.transform,
      crop: src.crop,
      blendMode: src.blendMode,
      effects: src.effects,
    };
    mutate((s) => {
      if (!s.project) return {};
      const tracks = mapTracks(s.project.tracks, (track) =>
        track.id === found.track.id ? { ...track, clips: [...track.clips, frame] } : track,
      );
      return { project: { ...s.project, tracks }, selectedClipIds: [frame.id], dirty: true };
    });
    return { clipId: frame.id, bounded: plan.bounded };
  },

  setClipTransition: (clipId, transition) =>
    mutate((s) => {
      if (!s.project) return {};
      const range = STUDIO_V3_RANGES.transitionDurationSeconds;
      const tracks = mapTracks(s.project.tracks, (track) => {
        const clip = track.clips.find((c) => c.id === clipId);
        if (!clip) return track;
        const prev = track.clips
          .filter((c) => c.id !== clipId && c.timelineStart < clip.timelineStart)
          .sort((a, b) => b.timelineStart - a.timelineStart)[0];
        if (!prev) return track; // nothing before it to transition from
        const prevEnd = clipEnd(prev);
        const maxD = Math.min(clipDuration(prev), clipDuration(clip), range.max);
        return {
          ...track,
          clips: track.clips.map((c) => {
            if (c.id !== clipId) return c;
            if (!transition) {
              return { ...c, timelineStart: prevEnd, transition: undefined, transitionInSeconds: undefined };
            }
            const d = clampRange(transition.durationSeconds, range.min, maxD);
            return {
              ...c,
              timelineStart: Math.max(0, prevEnd - d),
              transition: { ...transition, durationSeconds: d },
              transitionInSeconds: d,
            };
          }),
        };
      });
      return { project: { ...s.project, tracks }, dirty: true };
    }),

  setClipAdjustments: (clipId, adjustments) =>
    mutate((s) => {
      if (!s.project) return {};
      const tracks = updateClipInTracks(s.project.tracks, clipId, (c) => ({ ...c, adjustments }));
      return { project: { ...s.project, tracks }, dirty: true };
    }),

  addTextOverlay: (clipId) =>
    mutate((s) => {
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
    mutate((s) => {
      if (!s.project) return {};
      const tracks = updateClipInTracks(s.project.tracks, clipId, (c) => ({
        ...c,
        textOverlays: (c.textOverlays ?? []).map((o) => (o.id === overlayId ? { ...o, ...patch } : o)),
      }));
      return { project: { ...s.project, tracks }, dirty: true };
    }),

  removeTextOverlay: (clipId, overlayId) =>
    mutate((s) => {
      if (!s.project) return {};
      const tracks = updateClipInTracks(s.project.tracks, clipId, (c) => ({
        ...c,
        textOverlays: (c.textOverlays ?? []).filter((o) => o.id !== overlayId),
      }));
      return { project: { ...s.project, tracks }, dirty: true };
    }),

  // --- EDL v2: motion / crop / blend / effect stack -----------------------

  setClipTransform: (clipId, transform) =>
    mutate((s) => {
      if (!s.project) return {};
      const tracks = updateClipInTracks(s.project.tracks, clipId, (c) => ({ ...c, transform }));
      return { project: { ...s.project, tracks }, dirty: true };
    }),

  setClipCrop: (clipId, crop) =>
    mutate((s) => {
      if (!s.project) return {};
      const tracks = updateClipInTracks(s.project.tracks, clipId, (c) => ({ ...c, crop }));
      return { project: { ...s.project, tracks }, dirty: true };
    }),

  setClipBlendMode: (clipId, mode) =>
    mutate((s) => {
      if (!s.project) return {};
      // 'normal' (and undefined) both mean the default source-over; store undefined
      // so v1 clips stay byte-identical.
      const value = mode && mode !== 'normal' ? mode : undefined;
      const tracks = updateClipInTracks(s.project.tracks, clipId, (c) => ({ ...c, blendMode: value }));
      return { project: { ...s.project, tracks }, dirty: true };
    }),

  addEffect: (clipId, type) =>
    mutate((s) => {
      if (!s.project) return {};
      const effect = makeDefaultEffect(type, uid());
      const tracks = updateClipInTracks(s.project.tracks, clipId, (c) => ({
        ...c,
        effects: [...(c.effects ?? []), effect],
      }));
      return { project: { ...s.project, tracks }, dirty: true };
    }),

  updateEffect: (clipId, effectId, patch) =>
    mutate((s) => {
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
    mutate((s) => {
      if (!s.project) return {};
      const tracks = updateClipInTracks(s.project.tracks, clipId, (c) => ({
        ...c,
        effects: (c.effects ?? []).filter((e) => e.id !== effectId),
      }));
      return { project: { ...s.project, tracks }, dirty: true };
    }),

  reorderEffect: (clipId, fromIndex, toIndex) =>
    mutate((s) => {
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
    mutate((s) => {
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
    mutate((s) => {
      if (!s.project) return {};
      const value = clampRange(pan, -1, 1);
      const tracks = updateClipInTracks(s.project.tracks, clipId, (c) => ({
        ...c,
        pan: value === 0 ? undefined : value,
      }));
      return { project: { ...s.project, tracks }, dirty: true };
    }),

  // The legacy volume-keyframe actions (rubber band + old UI) now keep the v3
  // `keyframes.volume` lane mirrored — since part 15 that lane wins in the
  // resolver and export, so an unmirrored legacy edit would be invisible.
  setVolumeKeyframes: (clipId, kfs) =>
    mutate((s) => {
      if (!s.project) return {};
      const normalized = normalizeKeyframes(kfs);
      const tracks = updateClipInTracks(s.project.tracks, clipId, (c) =>
        mirrorLegacyVolume(c, normalized),
      );
      return { project: { ...s.project, tracks }, dirty: true };
    }),

  addVolumeKeyframe: (clipId, t, gain) =>
    mutate((s) => {
      if (!s.project) return {};
      const tracks = updateClipInTracks(s.project.tracks, clipId, (c) => {
        const next = normalizeKeyframes([...(c.volumeKeyframes ?? []), { t, gain }]);
        return mirrorLegacyVolume(c, next);
      });
      return { project: { ...s.project, tracks }, dirty: true };
    }),

  removeVolumeKeyframe: (clipId, index) =>
    mutate((s) => {
      if (!s.project) return {};
      const tracks = updateClipInTracks(s.project.tracks, clipId, (c) => {
        const kfs = (c.volumeKeyframes ?? []).filter((_, i) => i !== index);
        return mirrorLegacyVolume(c, kfs);
      });
      return { project: { ...s.project, tracks }, dirty: true };
    }),

  setAudioDucking: (patch) =>
    mutate((s) => {
      if (!s.project) return {};
      const audio: StudioAudioConfig = { ...DEFAULT_AUDIO_CONFIG, ...s.project.audio, ...patch };
      return { project: { ...s.project, audio }, dirty: true };
    }),

  // --- EDL v3: audio mixer (part 19) ----------------------------------------
  setTrackGain: (trackId, gain) =>
    mutate((s) => {
      if (!s.project) return {};
      const g = clampRange(Number.isFinite(gain) ? gain : 1, 0, MAX_VOLUME);
      const next = g === 1 ? undefined : g;
      let changed = false;
      const tracks = s.project.tracks.map((t) => {
        if (t.id !== trackId || t.gain === next) return t;
        changed = true;
        return { ...t, gain: next };
      });
      return changed ? { project: { ...s.project, tracks }, dirty: true } : {};
    }),

  setTrackPan: (trackId, pan) =>
    mutate((s) => {
      if (!s.project) return {};
      const p = clampRange(Number.isFinite(pan) ? pan : 0, -1, 1);
      const next = p === 0 ? undefined : p;
      let changed = false;
      const tracks = s.project.tracks.map((t) => {
        if (t.id !== trackId || t.pan === next) return t;
        changed = true;
        return { ...t, pan: next };
      });
      return changed ? { project: { ...s.project, tracks }, dirty: true } : {};
    }),

  setTrackEffects: (trackId, effects) =>
    mutate((s) => {
      if (!s.project) return {};
      const next = normalizeTrackEffects(effects);
      let changed = false;
      const tracks = s.project.tracks.map((t) => {
        if (t.id !== trackId || JSON.stringify(t.effects) === JSON.stringify(next)) return t;
        changed = true;
        return { ...t, effects: next };
      });
      return changed ? { project: { ...s.project, tracks }, dirty: true } : {};
    }),

  setMasterGain: (gain) =>
    mutate((s) => {
      if (!s.project) return {};
      const g = clampRange(Number.isFinite(gain) ? gain : 1, 0, MAX_VOLUME);
      const next = g === 1 ? undefined : g;
      if (s.project.audio?.masterGain === next) return {};
      if (!s.project.audio && next === undefined) return {};
      const audio: StudioAudioConfig = { ...DEFAULT_AUDIO_CONFIG, ...s.project.audio, masterGain: next };
      return { project: { ...s.project, audio }, dirty: true };
    }),

  setMixerOpen: (open) => set({ mixerOpen: open }),

  setCanvas: (width, height) =>
    mutate((s) => {
      if (!s.project) return {};
      const next = clampCanvas(width, height);
      if (next.width === s.project.width && next.height === s.project.height) return {};
      return { project: { ...s.project, width: next.width, height: next.height }, dirty: true };
    }),

  // --- EDL v3: title clips (part 16) ---------------------------------------

  // addTitleClip follows addClipFromAsset's placement conventions but needs no
  // asset: the clip lands on the COMPOSITE-topmost video track (highest index)
  // at the nearest free position to the playhead, 5s long, with one centered
  // default text layer.
  addTitleClip: () =>
    mutate((s) => {
      if (!s.project) return {};
      const tracks = ensureBaseTracks(s.project.tracks);
      let target: StudioTrack | undefined;
      for (const tr of tracks) {
        if (tr.kind === 'video' && !tr.locked && (!target || tr.index > target.index)) target = tr;
      }
      if (!target) return {};
      const dur = 5;
      const start = fitInGaps(
        target.clips.map((c) => ({ start: c.timelineStart, end: clipEnd(c) })),
        dur,
        Math.max(0, s.playhead),
      );
      const newClipId = uid();
      const clip: StudioClip = {
        id: newClipId,
        assetId: '',
        streamIndex: 0,
        timelineStart: start,
        sourceIn: 0,
        sourceOut: dur,
        title: makeDefaultTitle(),
      };
      const next = tracks.map((tr) =>
        tr.id === target!.id ? { ...tr, clips: [...tr.clips, clip] } : tr,
      );
      return { project: { ...s.project, tracks: next }, selectedClipIds: [newClipId], dirty: true };
    }),

  addTitleLayer: (clipId, type) =>
    mutate((s) => {
      if (!s.project) return {};
      const tracks = updateClipInTracks(s.project.tracks, clipId, (c) => {
        if (!c.title || c.title.layers.length >= 8) return c;
        return { ...c, title: { layers: [...c.title.layers, makeDefaultTitleLayer(type)] } };
      });
      return { project: { ...s.project, tracks }, dirty: true };
    }),

  updateTitleLayer: (clipId, index, patch) =>
    mutate((s) => {
      if (!s.project) return {};
      const tracks = updateClipInTracks(s.project.tracks, clipId, (c) => {
        const layer = c.title?.layers[index];
        if (!c.title || !layer) return c;
        const merged = { ...layer, ...patch } as StudioTitleLayer;
        return { ...c, title: { layers: c.title.layers.map((l, i) => (i === index ? merged : l)) } };
      });
      return { project: { ...s.project, tracks }, dirty: true };
    }),

  moveTitleLayer: (clipId, fromIndex, toIndex) =>
    mutate((s) => {
      if (!s.project) return {};
      const tracks = updateClipInTracks(s.project.tracks, clipId, (c) => {
        const layers = [...(c.title?.layers ?? [])];
        if (!c.title || fromIndex < 0 || fromIndex >= layers.length || toIndex < 0 || toIndex >= layers.length) {
          return c;
        }
        const [moved] = layers.splice(fromIndex, 1);
        layers.splice(toIndex, 0, moved);
        return { ...c, title: { layers } };
      });
      return { project: { ...s.project, tracks }, dirty: true };
    }),

  removeTitleLayer: (clipId, index) =>
    mutate((s) => {
      if (!s.project) return {};
      const tracks = updateClipInTracks(s.project.tracks, clipId, (c) => {
        if (!c.title || !c.title.layers[index] || c.title.layers.length <= 1) return c; // keep ≥1 layer
        return { ...c, title: { layers: c.title.layers.filter((_, i) => i !== index) } };
      });
      return { project: { ...s.project, tracks }, dirty: true };
    }),

  // convertOverlaysToTitle builds the equivalent title clip on the video track
  // ABOVE the source clip's track (created when none exists), spanning the same
  // timeline interval, and clears the legacy overlays — all in ONE mutate call,
  // i.e. one undo entry.
  convertOverlaysToTitle: (clipId) =>
    mutate((s) => {
      if (!s.project) return {};
      let source: { clip: StudioClip; track: StudioTrack } | null = null;
      for (const tr of s.project.tracks) {
        const c = tr.clips.find((cc) => cc.id === clipId);
        if (c) {
          source = { clip: c, track: tr };
          break;
        }
      }
      if (!source || source.track.kind !== 'video' || !(source.clip.textOverlays ?? []).length) return {};
      const title = titleFromTextOverlays(source.clip.textOverlays ?? []);
      if (title.layers.length === 0) return {};

      let tracks = [...s.project.tracks];
      let above = tracks.find(
        (tr) => tr.kind === 'video' && tr.index === source!.track.index + 1,
      );
      if (!above) {
        above = { id: uid(), kind: 'video', index: source.track.index + 1, muted: false, clips: [] };
        tracks = [...tracks, above];
      }
      const dur = clipDuration(source.clip);
      const start = fitInGaps(
        above.clips.map((c) => ({ start: c.timelineStart, end: clipEnd(c) })),
        dur,
        source.clip.timelineStart,
      );
      const newClipId = uid();
      const titleClip: StudioClip = {
        id: newClipId,
        assetId: '',
        streamIndex: 0,
        timelineStart: start,
        sourceIn: 0,
        sourceOut: dur,
        title,
      };
      const aboveId = above.id;
      tracks = tracks.map((tr) => {
        if (tr.id === aboveId) return { ...tr, clips: [...tr.clips, titleClip] };
        if (tr.id === source!.track.id) {
          return {
            ...tr,
            clips: tr.clips.map((c) => (c.id === clipId ? { ...c, textOverlays: undefined } : c)),
          };
        }
        return tr;
      });
      return { project: { ...s.project, tracks }, selectedClipIds: [newClipId], dirty: true };
    }),

  // --- EDL v3: per-property keyframes (part 15) ---------------------------

  setKeyframe: (clipId, property, t, value, ease) =>
    mutate((s) => {
      if (!s.project) return {};
      const { min, max } = keyframeValueRange(property);
      const tracks = updateClipInTracks(s.project.tracks, clipId, (c) => {
        const lane = keyframeLane(c, property) ?? [];
        const existing = lane.find((k) => Math.abs(k.t - t) < KEYFRAME_TIME_EPSILON);
        const point: StudioKeyframe = {
          t: Math.max(0, t),
          value,
          ease: ease ?? existing?.ease ?? 'linear',
        };
        return writeKeyframeLane(c, property, normalizeLane([...lane, point], min, max));
      });
      return { project: { ...s.project, tracks }, dirty: true };
    }),

  removeKeyframe: (clipId, property, t) =>
    mutate((s) => {
      if (!s.project) return {};
      const { min, max } = keyframeValueRange(property);
      const tracks = updateClipInTracks(s.project.tracks, clipId, (c) => {
        const lane = keyframeLane(c, property);
        if (!lane) return c;
        const kept = lane.filter((k) => Math.abs(k.t - t) >= KEYFRAME_TIME_EPSILON);
        if (kept.length === lane.length) return c;
        return writeKeyframeLane(c, property, kept.length > 0 ? normalizeLane(kept, min, max) : undefined);
      });
      return { project: { ...s.project, tracks }, dirty: true };
    }),

  moveKeyframe: (clipId, property, fromT, toT) =>
    mutate((s) => {
      if (!s.project) return {};
      const { min, max } = keyframeValueRange(property);
      const tracks = updateClipInTracks(s.project.tracks, clipId, (c) => {
        const lane = keyframeLane(c, property);
        if (!lane) return c;
        let moved = false;
        const next = lane.map((k) => {
          if (!moved && Math.abs(k.t - fromT) < KEYFRAME_TIME_EPSILON) {
            moved = true;
            return { ...k, t: Math.max(0, toT) };
          }
          return k;
        });
        if (!moved) return c;
        return writeKeyframeLane(c, property, normalizeLane(next, min, max));
      });
      return { project: { ...s.project, tracks }, dirty: true };
    }),

  armProperty: (clipId, property, atT) =>
    mutate((s) => {
      if (!s.project) return {};
      // Already armed → true no-op (no rebuilt tree, no history entry).
      for (const tr of s.project.tracks) {
        const c = tr.clips.find((cc) => cc.id === clipId);
        if (c && keyframeLane(c, property)?.length) return {};
      }
      const { min, max } = keyframeValueRange(property);
      const tracks = updateClipInTracks(s.project.tracks, clipId, (c) => {
        // Arming volume adopts an existing rubber-band curve instead of
        // collapsing it to a single point.
        if (property === 'volume' && c.volumeKeyframes && c.volumeKeyframes.length > 0) {
          const lane = c.volumeKeyframes.map((k) => ({ t: k.t, value: k.gain, ease: 'linear' as const }));
          return writeKeyframeLane(c, property, normalizeLane(lane, min, max));
        }
        const seed: StudioKeyframe = {
          t: Math.max(0, atT),
          value: clampRange(staticKeyframeValue(c, property), min, max),
          ease: 'linear',
        };
        return writeKeyframeLane(c, property, [seed]);
      });
      return { project: { ...s.project, tracks }, dirty: true };
    }),

  disarmProperty: (clipId, property, atT) =>
    mutate((s) => {
      if (!s.project) return {};
      const tracks = updateClipInTracks(s.project.tracks, clipId, (c) => {
        const lane = keyframeLane(c, property);
        if (!lane || lane.length === 0) return c;
        const settled = valueAt(lane, Math.max(0, atT));
        return writeStaticKeyframeValue(writeKeyframeLane(c, property, undefined), property, settled);
      });
      return { project: { ...s.project, tracks }, dirty: true };
    }),

  // --- EDL v2: captions ---------------------------------------------------

  setCaptions: (cues) =>
    mutate((s) => {
      if (!s.project) return {};
      const sorted = [...cues].sort((a, b) => a.startSeconds - b.startSeconds);
      return { project: { ...s.project, captions: sorted }, dirty: true };
    }),

  addCaption: (startSeconds, endSeconds, text = '') =>
    mutate((s) => {
      if (!s.project) return {};
      const start = Math.max(0, startSeconds);
      const end = Math.max(start + MIN_CAPTION_SECONDS, endSeconds);
      const cue: StudioCaptionCue = { id: uid(), startSeconds: start, endSeconds: end, text };
      const captions = [...s.project.captions, cue].sort((a, b) => a.startSeconds - b.startSeconds);
      return { project: { ...s.project, captions }, dirty: true };
    }),

  updateCaption: (id, patch) =>
    mutate((s) => {
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
    mutate((s) => {
      if (!s.project) return {};
      return { project: { ...s.project, captions: s.project.captions.filter((c) => c.id !== id) }, dirty: true };
    }),

  splitCaption: (id, atSeconds) =>
    mutate((s) => {
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
    mutate((s) => {
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
    mutate((s) => {
      if (!s.project) return {};
      const captionStyle: StudioCaptionStyle = { ...DEFAULT_CAPTION_STYLE, ...s.project.captionStyle, ...patch };
      return { project: { ...s.project, captionStyle }, dirty: true };
    }),

  setCaptionsEnabled: (enabled) =>
    mutate((s) => {
      if (!s.project) return {};
      return { project: { ...s.project, captionsEnabled: enabled }, dirty: true };
    }),

  // Hot path: called once per animation frame during playback. Reads the cached
  // `duration` instead of rescanning every clip on every track.
  setPlayhead: (t) => set((s) => ({ playhead: Math.max(0, Math.min(t, s.duration || t)) })),
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
      // v3: no marker UI yet — echo loaded markers so a save never drops them.
      markers: p.markers,
      // Part 07: compare-and-set token. Omitted (legacy last-write-wins) when
      // the backend never gave us a revision.
      expectedRevision: get().revision ?? undefined,
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
  };
});

// Re-export geometry helpers used by the UI so components import from one place.
export { clipDuration, clipEnd, timelineDuration };
