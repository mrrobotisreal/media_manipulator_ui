/**
 * MM109: Darkroom's pure op engine for Medi (design MEDI_ASSISTANT.md §8.3).
 *
 * `applyStudioOps(project, ops, ctx)` validates the list against the op schema, runs each op as
 * a pure function over a copy of the project with the same helpers the store's actions use
 * (`lib/studio/timelineOps.ts`, `speed.ts`, `looks.ts`, `audioPresets.ts`), then checks the
 * result with `studioProjectSchema` and the locked-track rule. All or nothing: any failing op,
 * an unknown id, a locked track or an invalid result returns the reasons and no project. The
 * store's `applyAssistantOps` records the returned project as ONE labelled undo entry.
 */
import type {
  StudioAudioConfig,
  StudioCaptionStyle,
  StudioClip,
  StudioMarker,
  StudioProject,
  StudioTitleLayer,
  StudioTitleTextLayer,
  StudioTrack,
  StudioLumetriEffect,
} from '@/lib/studioTypes';
import { DEFAULT_CAPTION_STYLE, studioProjectSchema } from '@/lib/studioTypes';
import { CANVAS_PRESETS } from '@/lib/studio/exportOptions';
import { makeDefaultEffect, STUDIO_V3_RANGES } from '@/lib/studio/effectRegistry';
import { clipDuration, clipEnd } from '@/lib/studio/previewEngine';
import { planFreezeInsert, planSpeed } from '@/lib/studio/speed';
import { keyframeValueRange, isEffectKeyframeProperty } from '@/lib/studio/keyframes';
import { presetById, presetEffects } from '@/lib/studio/audioPresets';
import { lookById, withLook, isLookEffectId } from '@/lib/studio/looks';
import { DEFAULT_TITLE_FONT_FAMILY } from '@/lib/studio/titleFonts';
import {
  MIN_CLIP_SECONDS,
  clampRange,
  cutTracksAt,
  ensureBaseTracks,
  fitInGaps,
  normalizeLane,
  placeInTrack,
  uid,
  writeKeyframeLane,
} from '@/lib/studio/timelineOps';

import type { CopilotRejectReason } from '@/lib/assistant/copilot/types';
import { studioOpsProblems, type StudioOp, type StudioTitleStyle, type TitleTemplate } from './studio';

/** Locked-track rule shared with the store (a locked track's clips may not change). */
export type LockedCheck = (before: StudioProject, after: StudioProject) => string | null;

export interface StudioOpsContext {
  /** Kind of each asset in the bin (image clips cannot be retimed or frozen). */
  assetKind: (assetId: string) => 'video' | 'audio' | 'image' | 'lut' | undefined;
  /** Source length of an asset in seconds (trim bound), undefined when unknown. */
  assetDuration: (assetId: string) => number | undefined;
  lockedViolation: LockedCheck;
  /** Id factory (tests pass a deterministic one). */
  newId?: () => string;
}

export type StudioApplyResult =
  | { ok: true; project: StudioProject; touched: string[] }
  | { ok: false; reason: CopilotRejectReason; errors: string[] };

class OpError extends Error {
  constructor(
    readonly reason: CopilotRejectReason,
    message: string,
  ) {
    super(message);
  }
}

const MAX_VOLUME = 2;
const dbToGain = (db: number) => (db <= -60 ? 0 : clampRange(Math.pow(10, db / 20), 0, MAX_VOLUME));
const round = (v: number) => Math.round(v * 1e4) / 1e4;

/** Digest label of a track: V1, V2… / A1, A2… (index + 1), the timeline header's default name. */
export const trackLabel = (t: Pick<StudioTrack, 'kind' | 'index'>): string => `${t.kind === 'video' ? 'V' : 'A'}${t.index + 1}`;

const DEFAULT_AUDIO: StudioAudioConfig = { duckingEnabled: false, duckAmountDb: 9, duckAttackMs: 120, duckReleaseMs: 400 };

/**
 * Apply `ops` to `project` all-or-nothing. Never mutates its inputs.
 */
export function applyStudioOps(project: StudioProject, ops: unknown, ctx: StudioOpsContext): StudioApplyResult {
  const problems = studioOpsProblems(ops);
  if (problems.length) return { ok: false, reason: 'validation', errors: problems };
  const list = ops as StudioOp[];
  const newId = ctx.newId ?? uid;
  let p: StudioProject = { ...project, tracks: ensureBaseTracks(project.tracks) };
  const touched: string[] = [];
  try {
    list.forEach((o, i) => {
      try {
        const r = runOp(p, o, ctx, newId);
        p = r.project;
        touched.push(...r.touched);
      } catch (e) {
        if (e instanceof OpError) throw new OpError(e.reason, `ops[${i}] ${o.op}: ${e.message}`);
        throw e;
      }
    });
  } catch (e) {
    if (e instanceof OpError) return { ok: false, reason: e.reason, errors: [e.message] };
    throw e;
  }
  const locked = ctx.lockedViolation(project, p);
  if (locked) {
    const t = project.tracks.find((x) => x.id === locked);
    return { ok: false, reason: 'locked', errors: [`track ${t ? trackLabel(t) : locked} is locked; unlock it first or leave it alone`] };
  }
  const parsed = studioProjectSchema.safeParse(p);
  if (!parsed.success) {
    return { ok: false, reason: 'validation', errors: parsed.error.issues.slice(0, 8).map((x) => `result ${x.path.join('.')}: ${x.message}`) };
  }
  return { ok: true, project: p, touched };
}

// --- lookups ---------------------------------------------------------------------------------

function locate(p: StudioProject, id: string): { clip: StudioClip; track: StudioTrack } {
  for (const track of p.tracks) {
    const clip = track.clips.find((c) => c.id === id);
    if (clip) return { clip, track };
  }
  throw new OpError('unknown_id', `no clip ${JSON.stringify(id)} in the timeline`);
}

function findTrack(p: StudioProject, ref: string): StudioTrack {
  const t = p.tracks.find((x) => x.id === ref || trackLabel(x) === ref.toUpperCase());
  if (!t) throw new OpError('unknown_id', `no track ${JSON.stringify(ref)} (use V1, A1… from the digest)`);
  return t;
}

const withClip = (p: StudioProject, id: string, fn: (c: StudioClip) => StudioClip): StudioProject => ({
  ...p,
  tracks: p.tracks.map((t) => (t.clips.some((c) => c.id === id) ? { ...t, clips: t.clips.map((c) => (c.id === id ? fn(c) : c)) } : t)),
});

const withTrack = (p: StudioProject, id: string, fn: (t: StudioTrack) => StudioTrack): StudioProject => ({
  ...p,
  tracks: p.tracks.map((t) => (t.id === id ? fn(t) : t)),
});

/** Visual clips an `"all"` grade/look targets: every clip with picture (video, image, freeze), never titles. */
function gradeTargets(p: StudioProject, ref: 'all' | string[], ctx: StudioOpsContext): string[] {
  if (ref !== 'all') {
    for (const id of ref) {
      const { clip, track } = locate(p, id);
      if (track.kind !== 'video' || clip.title) throw new OpError('validation', `clip ${id} has no picture to grade`);
    }
    return ref;
  }
  const out: string[] = [];
  for (const t of p.tracks) {
    if (t.kind !== 'video' || t.locked) continue;
    for (const c of t.clips) if (!c.title && ctx.assetKind(c.assetId) !== 'audio') out.push(c.id);
  }
  if (!out.length) throw new OpError('validation', 'there are no video or image clips to grade');
  return out;
}

// --- ops -------------------------------------------------------------------------------------

function runOp(p: StudioProject, o: StudioOp, ctx: StudioOpsContext, newId: () => string): { project: StudioProject; touched: string[] } {
  switch (o.op) {
    case 'split': {
      const { clip } = locate(p, o.clipId);
      if (!(o.at > clip.timelineStart + MIN_CLIP_SECONDS && o.at < clipEnd(clip) - MIN_CLIP_SECONDS)) {
        throw new OpError('validation', `at=${o.at} is not inside the clip (${round(clip.timelineStart)}–${round(clipEnd(clip))} s)`);
      }
      const res = cutTracksAt(p.tracks, o.at, (c) => c.id === o.clipId);
      return { project: { ...p, tracks: res.tracks }, touched: res.cutIds };
    }
    case 'trim': {
      const { clip } = locate(p, o.clipId);
      if (clip.title || clip.freeze) throw new OpError('validation', 'titles and held frames are resized with their duration, not trimmed');
      const sourceIn = o.sourceIn ?? clip.sourceIn;
      const sourceOut = o.sourceOut ?? clip.sourceOut;
      const len = ctx.assetDuration(clip.assetId);
      if (len !== undefined && ctx.assetKind(clip.assetId) !== 'image' && sourceOut > len + 1e-3) {
        throw new OpError('validation', `sourceOut=${sourceOut} is past the end of the source (${round(len)} s)`);
      }
      if (sourceOut < sourceIn + MIN_CLIP_SECONDS) throw new OpError('validation', 'sourceOut must be after sourceIn');
      return { project: withClip(p, clip.id, (c) => ({ ...c, sourceIn, sourceOut })), touched: [clip.id] };
    }
    case 'move_clip': {
      const { clip, track } = locate(p, o.clipId);
      const dest = o.track ? findTrack(p, o.track) : track;
      if (dest.kind !== track.kind) throw new OpError('validation', `cannot move a ${track.kind} clip onto ${dest.kind} track ${trackLabel(dest)}`);
      if (dest.id === track.id) {
        return { project: withTrack(p, track.id, (t) => ({ ...t, clips: placeInTrack(t.clips, clip.id, o.timelineStart) })), touched: [clip.id] };
      }
      const tracks = p.tracks.map((t) => {
        if (t.id === track.id) return { ...t, clips: t.clips.filter((c) => c.id !== clip.id) };
        if (t.id === dest.id) return { ...t, clips: placeInTrack([...t.clips, { ...clip, timelineStart: o.timelineStart }], clip.id, o.timelineStart) };
        return t;
      });
      return { project: { ...p, tracks }, touched: [clip.id] };
    }
    case 'delete_clip': {
      const { clip, track } = locate(p, o.clipId);
      const dur = clipDuration(clip);
      const tracks = p.tracks.map((t) => {
        if (t.id !== track.id) return t;
        const kept = t.clips.filter((c) => c.id !== clip.id);
        return { ...t, clips: o.ripple ? kept.map((c) => (c.timelineStart > clip.timelineStart ? { ...c, timelineStart: Math.max(0, c.timelineStart - dur) } : c)) : kept };
      });
      return { project: { ...p, tracks }, touched: [] };
    }
    case 'set_transition': {
      const { clip, track } = locate(p, o.clipId);
      const prev = track.clips.filter((c) => c.id !== clip.id && c.timelineStart < clip.timelineStart).sort((a, b) => b.timelineStart - a.timelineStart)[0];
      if (!prev) throw new OpError('validation', `clip ${clip.id} has no clip before it on ${trackLabel(track)} to transition from`);
      const range = STUDIO_V3_RANGES.transitionDurationSeconds;
      const d = clampRange(o.durationSeconds, range.min, Math.min(clipDuration(prev), clipDuration(clip), range.max));
      const prevEnd = clipEnd(prev);
      return {
        project: withClip(p, clip.id, (c) => ({
          ...c,
          timelineStart: Math.max(0, prevEnd - d),
          transition: { type: o.type as NonNullable<StudioClip['transition']>['type'], durationSeconds: d },
          transitionInSeconds: d,
        })),
        touched: [clip.id],
      };
    }
    case 'grade': {
      const ids = gradeTargets(p, o.clipIds, ctx);
      let next = p;
      for (const id of ids) {
        next = withClip(next, id, (c) => {
          const effects = c.effects ?? [];
          // The clip's own grade (the first non-look Lumetri effect), else a new one at the end.
          const at = effects.findIndex((e) => e.type === 'lumetri' && !isLookEffectId(e.id));
          const base = at >= 0 ? (effects[at] as StudioLumetriEffect) : (makeDefaultEffect('lumetri', newId()) as StudioLumetriEffect);
          const merged: StudioLumetriEffect = { ...base, ...o.lumetri, enabled: true };
          return { ...c, effects: at >= 0 ? effects.map((e, i) => (i === at ? merged : e)) : [...effects, merged] };
        });
      }
      return { project: next, touched: ids };
    }
    case 'apply_look': {
      const lk = lookById(o.lookId);
      if (!lk) throw new OpError('validation', `unknown look ${o.lookId}`);
      const ids = gradeTargets(p, o.clipIds, ctx);
      let next = p;
      for (const id of ids) next = withClip(next, id, (c) => withLook(c, lk, o.intensity ?? 1));
      return { project: next, touched: ids };
    }
    case 'set_transform': {
      const { clip, track } = locate(p, o.clipId);
      if (track.kind !== 'video') throw new OpError('validation', 'only clips with picture can be moved or scaled');
      const tf = { x: 0, y: 0, scale: 1, rotationDeg: 0, ...clip.transform };
      for (const k of ['x', 'y', 'scale', 'rotationDeg'] as const) if (o[k] !== undefined) tf[k] = o[k]!;
      return { project: withClip(p, clip.id, (c) => ({ ...c, transform: tf })), touched: [clip.id] };
    }
    case 'set_keyframes': {
      const { clip, track } = locate(p, o.clipId);
      const visual = ['positionX', 'positionY', 'scale', 'rotation', 'opacity'];
      if (track.kind === 'audio' && (visual.includes(o.property) || isEffectKeyframeProperty(o.property))) {
        throw new OpError('validation', `${o.property} animates picture; ${clip.id} is an audio clip`);
      }
      if (isEffectKeyframeProperty(o.property)) {
        const effectId = o.property.slice(0, o.property.lastIndexOf('.'));
        if (!(clip.effects ?? []).some((e) => e.id === effectId)) throw new OpError('unknown_id', `clip ${clip.id} has no effect ${effectId}`);
      }
      const { min, max } = keyframeValueRange(o.property);
      for (const k of o.keyframes) {
        if (k.value < min || k.value > max) throw new OpError('validation', `${o.property} value ${k.value} is outside ${min}..${max}`);
      }
      const len = clipDuration(clip);
      const lane = normalizeLane(
        o.keyframes.map((k) => ({ t: clampRange(k.t, 0, len), value: k.value, ease: k.ease })),
        min,
        max,
      );
      return { project: withClip(p, clip.id, (c) => writeKeyframeLane(c, o.property, lane)), touched: [clip.id] };
    }
    case 'add_title': {
      const tracks = ensureBaseTracks(p.tracks);
      let target: StudioTrack | undefined;
      for (const t of tracks) if (t.kind === 'video' && !t.locked && (!target || t.index > target.index)) target = t;
      let next: StudioProject = { ...p, tracks };
      // A title sits above the picture: when the top video track is busy at that time, a new track goes on top.
      const busy = (t: StudioTrack) => t.clips.some((c) => c.timelineStart < o.start + o.duration - 1e-6 && clipEnd(c) > o.start + 1e-6);
      if (!target || busy(target) || target.clips.some((c) => !c.title)) {
        const maxIndex = tracks.filter((t) => t.kind === 'video').reduce((m, t) => Math.max(m, t.index), -1);
        target = { id: newId(), kind: 'video', index: maxIndex + 1, muted: false, clips: [] };
        next = { ...next, tracks: [...next.tracks, target] };
      }
      const start = fitInGaps(target.clips.map((c) => ({ start: c.timelineStart, end: clipEnd(c) })), o.duration, o.start);
      const clip: StudioClip = {
        id: newId(),
        assetId: '',
        streamIndex: 0,
        timelineStart: start,
        sourceIn: 0,
        sourceOut: o.duration,
        title: { layers: buildTitleLayers(o.template, o.lines, o.style ?? {}, p.width, p.height) },
        ...titleAnimation(o.animateIn ?? 'none', o.animateOut ?? 'none', o.duration),
      };
      const tid = target.id;
      next = { ...next, tracks: next.tracks.map((t) => (t.id === tid ? { ...t, clips: [...t.clips, clip] } : t)) };
      return { project: next, touched: [clip.id] };
    }
    case 'set_speed': {
      const { clip, track } = locate(p, o.clipId);
      if (clip.title || clip.freeze || ctx.assetKind(clip.assetId) === 'image') throw new OpError('validation', 'titles, stills and held frames have no speed');
      const plan = planSpeed(track.clips, clip, o.speed);
      return {
        project: withClip(p, clip.id, (c) => ({
          ...c,
          speed: plan.speed === 1 ? undefined : plan.speed,
          ...(o.maintainPitch === undefined ? {} : { maintainPitch: o.maintainPitch ? undefined : false }),
        })),
        touched: [clip.id],
      };
    }
    case 'freeze_frame': {
      const { clip, track } = locate(p, o.clipId);
      if (track.kind !== 'video' || clip.title || clip.freeze || ctx.assetKind(clip.assetId) !== 'video') throw new OpError('validation', 'only video clips can be frozen');
      if (o.at < clip.timelineStart || o.at > clipEnd(clip)) throw new OpError('validation', `at=${o.at} is not inside the clip`);
      const plan = planFreezeInsert(track.clips, clip, o.at, o.duration);
      if (!plan) throw new OpError('validation', 'there is no room after the clip for a held frame; move the next clip first');
      const frame: StudioClip = {
        id: newId(),
        assetId: clip.assetId,
        streamIndex: clip.streamIndex,
        timelineStart: plan.timelineStart,
        sourceIn: plan.sourceTime,
        sourceOut: plan.sourceTime + plan.duration,
        freeze: { sourceTime: plan.sourceTime },
        opacity: clip.opacity,
        adjustments: clip.adjustments,
        transform: clip.transform,
        crop: clip.crop,
        blendMode: clip.blendMode,
        effects: clip.effects,
      };
      return { project: withTrack(p, track.id, (t) => ({ ...t, clips: [...t.clips, frame] })), touched: [frame.id] };
    }
    case 'audio_preset': {
      const t = findTrack(p, o.track);
      if (t.kind !== 'audio') throw new OpError('validation', `${trackLabel(t)} is a video track; presets go on audio tracks`);
      const preset = presetById(o.preset);
      if (!preset) throw new OpError('validation', `unknown preset ${o.preset}`);
      return { project: withTrack(p, t.id, (x) => ({ ...x, effects: presetEffects(preset) })), touched: [] };
    }
    case 'set_ducking': {
      let voiceId = p.audio?.duckVoiceTrackId;
      if (o.voiceTrack) {
        const t = findTrack(p, o.voiceTrack);
        if (t.kind !== 'audio') throw new OpError('validation', 'the voice track must be an audio track');
        voiceId = t.id;
      }
      const audio: StudioAudioConfig = {
        ...DEFAULT_AUDIO,
        ...p.audio,
        duckingEnabled: o.enabled,
        ...(voiceId ? { duckVoiceTrackId: voiceId } : {}),
        ...(o.amountDb !== undefined ? { duckAmountDb: o.amountDb } : {}),
        ...(o.attackMs !== undefined ? { duckAttackMs: o.attackMs } : {}),
        ...(o.releaseMs !== undefined ? { duckReleaseMs: o.releaseMs } : {}),
      };
      return { project: { ...p, audio }, touched: [] };
    }
    case 'set_volume': {
      const gain = round(dbToGain(o.gainDb));
      if (o.clipId) {
        const { clip } = locate(p, o.clipId);
        if (clip.title) throw new OpError('validation', 'titles have no sound');
        return { project: withClip(p, clip.id, (c) => ({ ...c, volume: gain })), touched: [clip.id] };
      }
      const t = findTrack(p, o.track!);
      return { project: withTrack(p, t.id, (x) => ({ ...x, gain: gain === 1 ? undefined : gain })), touched: [] };
    }
    case 'add_marker': {
      const markers = p.markers ?? [];
      if (markers.length >= STUDIO_V3_RANGES.markers.max) throw new OpError('validation', 'the timeline already has the maximum number of markers');
      const m: StudioMarker = { id: newId(), t: o.at, name: o.label, color: STUDIO_V3_RANGES.markers.defaultColor };
      return { project: { ...p, markers: [...markers, m].sort((a, b) => a.t - b.t) }, touched: [] };
    }
    case 'set_caption_style': {
      if (!p.captions.length) throw new OpError('validation', 'there are no captions yet; offer generate_captions with suggest_action first');
      const { op: _op, ...patch } = o;
      void _op;
      const captionStyle: StudioCaptionStyle = { ...DEFAULT_CAPTION_STYLE, ...p.captionStyle, ...patch };
      return { project: { ...p, captionStyle, captionsEnabled: true }, touched: [] };
    }
    case 'set_canvas': {
      const preset = CANVAS_PRESETS.find((c) => c.key === o.aspect)!;
      if (p.width === preset.width && p.height === preset.height) throw new OpError('validation', `the canvas is already ${o.aspect}`);
      return { project: { ...p, width: preset.width, height: preset.height }, touched: [] };
    }
  }
}

// --- titles ------------------------------------------------------------------------------------

/** The main line's size (px at 1080p) per template. */
const BIG: Record<TitleTemplate, number> = { lowerThird: 56, caption: 44, endCard: 96, title: 120 };

/**
 * The layers of a templated title (≤ 8, normalized 0..1 coordinates; pixel sizes scale with the
 * project height so a 1080p and a 2160p project look the same). Lower-thirds sit in the lower
 * 30 % of the frame, left-aligned, with a bar behind the text.
 */
export function buildTitleLayers(template: TitleTemplate, lines: string[], style: StudioTitleStyle, _width: number, height: number): StudioTitleLayer[] {
  const k = (height || 1080) / 1080;
  const px = (v: number) => Math.round(v * k);
  const font = style.fontFamily ?? DEFAULT_TITLE_FONT_FAMILY;
  const fill = style.fillColor ?? '#FFFFFF';
  // `style.fontSizePx` sizes the main (first) line; secondary lines keep their proportion to it.
  const main = BIG[template];
  const scale = style.fontSizePx ? style.fontSizePx / px(main) : 1;
  const text = (t: string, y: number, size: number, weight: 400 | 700, x: number, align: 'left' | 'center' | 'right'): StudioTitleTextLayer => ({
    type: 'text',
    text: t,
    fontFamily: font,
    fontSizePx: clampRange(Math.round(px(size) * scale), STUDIO_V3_RANGES.title.fontSizePx.min, STUDIO_V3_RANGES.title.fontSizePx.max),
    fontWeight: weight === 700 ? (style.fontWeight ?? 700) : 400,
    fillColor: fill,
    align: style.align ?? align,
    x,
    y,
    ...(style.strokeColor ? { strokeColor: style.strokeColor, strokeWidthPx: style.strokeWidthPx ?? px(2) } : {}),
    ...(style.letterSpacingPx !== undefined ? { letterSpacingPx: style.letterSpacingPx } : {}),
    ...(style.lineHeight !== undefined ? { lineHeight: style.lineHeight } : {}),
  });
  const bar = (x: number, y: number, w: number, h: number): StudioTitleLayer => ({
    type: 'rect',
    x,
    y,
    w,
    h,
    color: style.backgroundColor ?? '#111111',
    opacity: style.backgroundOpacity ?? 0.6,
    radiusPx: px(6),
  });
  const [first, ...rest] = lines;
  switch (template) {
    case 'lowerThird': {
      const out: StudioTitleLayer[] = [bar(0.05, 0.76, 0.42, rest.length ? 0.14 : 0.09)];
      out.push(text(first, rest.length ? 0.8 : 0.805, 56, 700, 0.075, 'left'));
      rest.slice(0, 2).forEach((l, i) => out.push(text(l, 0.86 + i * 0.045, 34, 400, 0.075, 'left')));
      return out;
    }
    case 'caption': {
      const out: StudioTitleLayer[] = [];
      if (style.backgroundColor || style.backgroundOpacity !== undefined) out.push(bar(0.1, 0.82, 0.8, 0.1));
      out.push(text(lines.join(' '), 0.87, 44, 700, 0.5, 'center'));
      return out;
    }
    case 'endCard': {
      const out: StudioTitleLayer[] = [];
      if (style.backgroundColor) out.push(bar(0, 0, 1, 1));
      out.push(text(first, 0.42, 96, 700, 0.5, 'center'));
      rest.slice(0, 3).forEach((l, i) => out.push(text(l, 0.56 + i * 0.07, 44, 400, 0.5, 'center')));
      return out;
    }
    case 'title': {
      const out: StudioTitleLayer[] = [];
      if (style.backgroundColor) out.push(bar(0.15, 0.36, 0.7, 0.28));
      out.push(text(first, rest.length ? 0.46 : 0.5, 120, 700, 0.5, 'center'));
      rest.slice(0, 3).forEach((l, i) => out.push(text(l, 0.58 + i * 0.07, 44, 400, 0.5, 'center')));
      return out;
    }
  }
}

const ENTER = 0.5;
const EXIT = 0.4;

/** Entrance/exit keyframes (clip-local seconds) on position/opacity/scale for a title clip. */
export function titleAnimation(inKind: string, outKind: string, duration: number): Pick<StudioClip, 'keyframes'> {
  const lanes: Record<string, { t: number; value: number; ease: 'linear' | 'hold' | 'easeIn' | 'easeOut' | 'easeBoth' }[]> = {};
  const add = (prop: string, kfs: { t: number; value: number; ease: 'linear' | 'hold' | 'easeIn' | 'easeOut' | 'easeBoth' }[]) => {
    lanes[prop] = [...(lanes[prop] ?? []), ...kfs];
  };
  const inEnd = Math.min(ENTER, duration / 3);
  const outStart = Math.max(inEnd, duration - EXIT);
  switch (inKind) {
    case 'fade':
      add('opacity', [{ t: 0, value: 0, ease: 'easeOut' }, { t: inEnd, value: 1, ease: 'linear' }]);
      break;
    case 'slideLeft':
      add('positionX', [{ t: 0, value: -0.6, ease: 'easeOut' }, { t: inEnd, value: 0, ease: 'linear' }]);
      add('opacity', [{ t: 0, value: 0, ease: 'easeOut' }, { t: inEnd, value: 1, ease: 'linear' }]);
      break;
    case 'slideRight':
      add('positionX', [{ t: 0, value: 0.6, ease: 'easeOut' }, { t: inEnd, value: 0, ease: 'linear' }]);
      add('opacity', [{ t: 0, value: 0, ease: 'easeOut' }, { t: inEnd, value: 1, ease: 'linear' }]);
      break;
    case 'slideUp':
      add('positionY', [{ t: 0, value: 0.15, ease: 'easeOut' }, { t: inEnd, value: 0, ease: 'linear' }]);
      add('opacity', [{ t: 0, value: 0, ease: 'easeOut' }, { t: inEnd, value: 1, ease: 'linear' }]);
      break;
    case 'pop':
      add('scale', [{ t: 0, value: 0.8, ease: 'easeOut' }, { t: inEnd, value: 1, ease: 'linear' }]);
      add('opacity', [{ t: 0, value: 0, ease: 'easeOut' }, { t: inEnd * 0.6, value: 1, ease: 'linear' }]);
      break;
  }
  if (outKind !== 'none') {
    // Hold the settled value until the exit starts, then leave.
    const hold = (prop: string, settled: number, gone: number) => {
      const lane = lanes[prop] ?? [{ t: 0, value: settled, ease: 'linear' as const }];
      lanes[prop] = [...lane, { t: outStart, value: settled, ease: 'easeIn' }, { t: duration, value: gone, ease: 'linear' }];
    };
    if (outKind === 'fade') hold('opacity', 1, 0);
    if (outKind === 'slideLeft') hold('positionX', 0, -0.6);
    if (outKind === 'slideRight') hold('positionX', 0, 0.6);
    if (outKind === 'slideDown') hold('positionY', 0, 0.15);
    if (outKind.startsWith('slide')) hold('opacity', 1, 0);
  }
  const entries = Object.entries(lanes);
  if (!entries.length) return {};
  const keyframes: NonNullable<StudioClip['keyframes']> = {};
  for (const [prop, kfs] of entries) {
    const { min, max } = keyframeValueRange(prop);
    (keyframes as Record<string, unknown>)[prop] = normalizeLane(kfs, min, max);
  }
  return { keyframes };
}
