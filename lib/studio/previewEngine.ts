import { getBaseURL } from '@/lib/utils';
import type { StudioClip, StudioTrack, StudioTrackKind } from '@/lib/studioTypes';

/**
 * Preview engine — the isolated "what is active at time T" logic for the
 * Content Studio timeline. This module is intentionally pure (no DOM, no React):
 * the Phase 1 preview drives a single <video>, but Phase 3 will reuse the SAME
 * resolver to position a pool of <video> elements + a Web Audio graph. Keeping
 * the resolver here means the rendering layer can be swapped (Option A pooled
 * elements → canvas/WebCodecs) without touching the timeline math.
 */

/** Effective on-timeline duration of a clip. */
export function clipDuration(c: StudioClip): number {
  return Math.max(0, c.sourceOut - c.sourceIn);
}

/** On-timeline end position (seconds) of a clip. */
export function clipEnd(c: StudioClip): number {
  return c.timelineStart + clipDuration(c);
}

/** Total timeline length = end of the last clip across all tracks. */
export function timelineDuration(tracks: StudioTrack[]): number {
  let end = 0;
  for (const t of tracks) {
    for (const c of t.clips) {
      const e = clipEnd(c);
      if (e > end) end = e;
    }
  }
  return end;
}

/** A clip that is playing at time T, with its computed source position. */
export interface ActiveClip {
  clip: StudioClip;
  trackId: string;
  trackKind: StudioTrackKind;
  trackIndex: number;
  trackMuted: boolean;
  /** Where in the source media the playhead currently maps to. */
  sourceTime: number;
}

/**
 * resolveActiveClips returns at most one active clip per track at time `t`
 * (clips never overlap on a single track). The result is the complete picture
 * the renderer needs: which video clip to show, which audio clips to mix.
 */
export function resolveActiveClips(tracks: StudioTrack[], t: number): ActiveClip[] {
  const out: ActiveClip[] = [];
  for (const track of tracks) {
    for (const clip of track.clips) {
      const start = clip.timelineStart;
      const end = clipEnd(clip);
      if (t >= start && t < end) {
        out.push({
          clip,
          trackId: track.id,
          trackKind: track.kind,
          trackIndex: track.index,
          trackMuted: track.muted,
          sourceTime: clip.sourceIn + (t - start),
        });
        // No break: clips on a track may overlap during a cross-dissolve, so a
        // track can have two active clips. The renderer composites them.
      }
    }
  }
  return out;
}

/**
 * transitionRamp returns a clip's cross-dissolve opacity multiplier at time t:
 * ramps 0→1 across its transitionInSeconds window, then stays 1.
 */
export function transitionRamp(clip: StudioClip, t: number): number {
  const d = clip.transitionInSeconds ?? 0;
  if (d <= 0) return 1;
  const into = t - clip.timelineStart;
  if (into <= 0) return 0;
  if (into >= d) return 1;
  return into / d;
}

/**
 * cssFilterForAdjustments builds the CSS `filter` string that fakes the export's
 * `eq` color adjustments in preview. Our model: brightness -1..1 (additive,
 * mapped to CSS 1+b), contrast/saturation 0..2 (1 = none, used directly).
 */
export function cssFilterForAdjustments(a?: {
  brightness: number;
  contrast: number;
  saturation: number;
}): string {
  if (!a) return 'none';
  const b = 1 + (a.brightness ?? 0);
  const c = a.contrast ?? 1;
  const s = a.saturation ?? 1;
  return `brightness(${b}) contrast(${c}) saturate(${s})`;
}

/**
 * topVideoClip picks the video clip that should be visible at time T: the one on
 * the highest-indexed (top-most) video track among the active clips. Phase 1
 * only ever has one video track, so this returns that clip; Phase 3 uses the
 * index to composite overlays.
 */
export function topVideoClip(active: ActiveClip[]): ActiveClip | undefined {
  let top: ActiveClip | undefined;
  for (const a of active) {
    if (a.trackKind !== 'video') continue;
    if (!top || a.trackIndex > top.trackIndex) top = a;
  }
  return top;
}

// --- Browser-facing URLs for ingested derivatives -------------------------
// These are stable per-asset passthrough routes (not presigned), so they don't
// expire mid-session and play back through the API's CORS headers.

export function studioProxyUrl(assetId: string): string {
  return `${getBaseURL()}/studio/assets/${assetId}/proxy`;
}

export function studioSpriteUrl(assetId: string): string {
  return `${getBaseURL()}/studio/assets/${assetId}/sprite`;
}

export function studioPeaksUrl(assetId: string): string {
  return `${getBaseURL()}/studio/assets/${assetId}/peaks`;
}

/** Raw original-file passthrough (used to fetch .cube LUT assets for the compositor). */
export function studioAssetFileUrl(assetId: string): string {
  return `${getBaseURL()}/studio/assets/${assetId}/file`;
}

/**
 * volumeAtClipTime evaluates a clip's effective gain at `clipLocalSeconds`
 * (seconds from the clip's timeline start). With no keyframes it returns the
 * flat volume (default 1). With keyframes it does piecewise-linear interpolation,
 * holding the first/last value beyond the ends — matching the export's
 * `volume='…':eval=frame` expression and the timeline rubber band. Keyframes are
 * assumed sorted (the store normalizes on write).
 */
export function volumeAtClipTime(clip: StudioClip, clipLocalSeconds: number): number {
  const kfs = clip.volumeKeyframes;
  if (!kfs || kfs.length === 0) return clip.volume ?? 1;
  if (clipLocalSeconds <= kfs[0].t) return kfs[0].gain;
  const last = kfs[kfs.length - 1];
  if (clipLocalSeconds >= last.t) return last.gain;
  for (let i = 1; i < kfs.length; i += 1) {
    const b = kfs[i];
    if (clipLocalSeconds <= b.t) {
      const a = kfs[i - 1];
      const span = b.t - a.t;
      if (span <= 0) return b.gain;
      const f = (clipLocalSeconds - a.t) / span;
      return a.gain + (b.gain - a.gain) * f;
    }
  }
  return last.gain;
}
