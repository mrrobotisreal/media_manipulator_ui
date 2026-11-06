/**
 * MM109: the Darkroom copilot adapter (design MEDI_ASSISTANT.md §8.3, ticket decisions 1, 4, 5).
 *
 * Binds Medi to the Darkroom store: `apply` hands the op list to the store's public
 * `applyAssistantOps` (validate + apply all-or-nothing on a copy, ONE history entry labelled
 * "Medi|<summary>", locked tracks honoured; never loadProject/restoreDraft, which clear history).
 * The undo token only acts while that edit is still the latest step, so it never undoes the
 * user's own later work. The digest is `studioDigest`; the frame is the compositor at the
 * playhead. Suggested actions (captions, voice cleanup and stem splits, voiceover, export)
 * spend allowance only when the user clicks them.
 */
import type { StoreApi, UseBoundStore } from 'zustand';

import type { StudioProject } from '@/lib/studioTypes';
import type { CopilotAdapter, CopilotApplyResult, CopilotChangeLine, CopilotDiffLine, CopilotEditToken, CopilotPreviewResult } from '@/lib/assistant/copilot/types';
import { labelOr, leafChanges } from '@/lib/assistant/copilot/diff';
import { perOpLines } from '@/lib/assistant/copilot/lines';
import { studioRevealBridge, type StudioRevealTarget } from '@/lib/assistant/copilot/revealBridges';
import { applyStudioOps } from '@/lib/assistant/ops/applyStudio';
import { lockedViolation } from '@/lib/studioStore';
import { studioDigest, type StudioDigestAsset } from '@/lib/assistant/digest/studio';
import { CANVAS_ASPECTS, type StudioOp } from '@/lib/assistant/ops/studio';
import { trackLabel } from '@/lib/assistant/ops/applyStudio';
import { STUDIO_LOOKS } from '@/lib/studio/looks';

/** The slice of the Darkroom store the adapter needs (the real store satisfies it). */
export interface StudioCopilotState {
  project: StudioProject | null;
  assets: Record<string, { asset: { originalFileName: string; displayName?: string; mediaKind: StudioDigestAsset['kind']; durationSeconds: number } } | undefined>;
  playhead: number;
  selectedClipIds: string[];
  past: StudioProject[];
  gestureDepth: number;
  applyAssistantOps: (summary: string, ops: unknown, opts?: { signedIn?: boolean }) => { ok: true; project: StudioProject; touched: string[] } | { ok: false; reason: 'validation' | 'unknown_id' | 'locked'; errors: string[] };
  undo: () => void;
}

type Translate = (key: string, vars?: Record<string, unknown>) => string;

export type StudioDeriveKind = 'voice_clean' | 'split_vocals' | 'split_instrumental';

export interface StudioAdapterDeps {
  store: UseBoundStore<StoreApi<StudioCopilotState>>;
  t: Translate;
  captureFrame: () => Promise<Blob | null>;
  projectId: () => string | null;
  /** Suggested actions: each runs only on the user's click. */
  onGenerateCaptions: (language: string | null) => void | Promise<void>;
  onDeriveAudio: (clipId: string | null, operation: StudioDeriveKind) => void | Promise<void>;
  onVoiceover: (text: string | null) => void;
  /** MM118: the server-validated export params (preset or container/codecs, resolution, captionsMode, upgrade). */
  onExport: (params: Record<string, unknown>) => void;
  onOpenTool: (params: Record<string, unknown>) => void;
  /** MM121: false for an anonymous editor (locked caption looks/animations are refused). */
  signedIn?: () => boolean;
  /** MM121: a caption look Medi applied (studio_caption_look_applied {source: medi}). */
  onCaptionLookApplied?: (lookId: string) => void;
}

/** Ops whose result is visible in the preview (the verify loop sends a frame after these). */
export const STUDIO_VISUAL_OPS: ReadonlySet<string> = new Set(['grade', 'apply_look', 'add_title', 'set_transform', 'set_canvas', 'set_keyframes', 'set_transition', 'freeze_frame']);

/** The plain-words "what I changed" lines of an applied op list (templated keys, never model text). */
export function describeStudioOps(ops: StudioOp[], before: StudioProject, t: Translate): string[] {
  return ops.flatMap((o) => describeStudioOp(o, before, t));
}

/** One op's lines (the change card shows them per op). */
export function describeStudioOp(o: StudioOp, before: StudioProject, t: Translate): string[] {
  const clipName = (id: string) => {
    for (const tr of before.tracks) {
      const c = tr.clips.find((x) => x.id === id);
      if (c) return c.title ? t('assistant.copilot.studio.titleClip') : `${trackLabel(tr)} ${Math.round(c.timelineStart * 10) / 10}s`;
    }
    return id;
  };
  const clips = (ref: 'all' | string[]) => (ref === 'all' ? t('assistant.copilot.studio.allClips') : ref.map(clipName).join(', '));
  const out: string[] = [];
  {
    const k = (key: string, vars: Record<string, unknown> = {}) => out.push(t(`assistant.copilot.studio.change.${key}`, vars));
    switch (o.op) {
      case 'split':
        k('split', { clip: clipName(o.clipId), at: o.at });
        break;
      case 'trim':
        k('trim', { clip: clipName(o.clipId) });
        break;
      case 'move_clip':
        k('move', { clip: clipName(o.clipId), at: o.timelineStart });
        break;
      case 'delete_clip':
        k(o.ripple ? 'deleteRipple' : 'delete', { clip: clipName(o.clipId) });
        break;
      case 'set_transition':
        k('transition', { clip: clipName(o.clipId), seconds: o.durationSeconds });
        break;
      case 'grade':
        k('grade', { clips: clips(o.clipIds) });
        break;
      case 'apply_look': {
        const look = STUDIO_LOOKS.find((l) => l.id === o.lookId);
        k('look', { look: look ? t(look.labelKey) : o.lookId, clips: clips(o.clipIds) });
        break;
      }
      case 'set_transform':
        k('transform', { clip: clipName(o.clipId) });
        break;
      case 'set_keyframes':
        k('keyframes', { clip: clipName(o.clipId), count: o.keyframes.length });
        break;
      case 'add_title':
        k(`title.${o.template}`, { at: o.start });
        break;
      case 'set_speed':
        k('speed', { clip: clipName(o.clipId), speed: o.speed });
        break;
      case 'freeze_frame':
        k('freeze', { clip: clipName(o.clipId), seconds: o.duration });
        break;
      case 'audio_preset':
        k('audioPreset', { preset: t(`contentStudio.mixer.preset.${o.preset}`), track: o.track.toUpperCase() });
        break;
      case 'set_ducking':
        k(o.enabled ? 'duckingOn' : 'duckingOff');
        break;
      case 'set_volume':
        k('volume', { target: o.clipId ? clipName(o.clipId) : (o.track ?? '').toUpperCase(), db: o.gainDb });
        break;
      case 'add_marker':
        k('marker', { at: o.at });
        break;
      case 'set_caption_style':
        k('captionStyle');
        break;
      case 'set_canvas':
        k('canvas', { aspect: (CANVAS_ASPECTS as readonly string[]).includes(o.aspect) ? o.aspect : '' });
        break;
    }
  }
  return out;
}


/** Per-op lines of the change card (MM114). */
export function studioChangeLines(ops: StudioOp[], before: StudioProject, t: Translate): CopilotChangeLine[] {
  return perOpLines(ops, (o) => describeStudioOp(o, before, t));
}

/** The user-facing numbers of a clip that an op can change (the diff card compares these). */
function pickClip(c: StudioProject['tracks'][number]['clips'][number]) {
  const effects = c.effects ?? [];
  const grade = effects.find((e) => e.type === 'lumetri' && !e.id.startsWith('look-')) as Record<string, unknown> | undefined;
  const look = effects.filter((e) => e.id.startsWith('look-')).map((e) => e.id).join(',');
  const lut = effects.find((e) => e.type === 'lut') as { intensity?: number } | undefined;
  const gradeParams = Object.fromEntries(Object.entries(grade ?? {}).filter(([k]) => k !== 'id' && k !== 'type' && k !== 'enabled'));
  return {
    transform: c.transform ? { x: c.transform.x, y: c.transform.y, scale: c.transform.scale, rotationDeg: c.transform.rotationDeg } : undefined,
    opacity: c.opacity,
    speed: c.speed,
    volume: c.volume,
    lumetri: grade ? gradeParams : undefined,
    look: look || undefined,
    lut: lut?.intensity,
    transition: c.transition ? c.transition.durationSeconds : undefined,
  };
}

const MOTION_LABEL: Record<string, string> = { x: 'x', y: 'y', scale: 'scale', rotationDeg: 'rotation' };

/** `before → after` values of the clips and project settings one op touched (MM114 diff card). */
export function studioValueChanges(prev: StudioProject, next: StudioProject, t: Translate) {
  const out: CopilotDiffLine['values'] = [];
  const clipsOf = (p: StudioProject) => new Map(p.tracks.flatMap((tr) => tr.clips.map((c) => [c.id, c] as const)));
  const was = clipsOf(prev);
  for (const [id, c] of clipsOf(next)) {
    const old = was.get(id);
    if (!old) continue;
    const name = c.title ? t('assistant.copilot.studio.titleClip') : `${trackLabel(next.tracks.find((tr) => tr.clips.some((x) => x.id === id))!)} ${Math.round(c.timelineStart * 10) / 10}s`;
    for (const v of leafChanges(pickClip(old), pickClip(c), t, (path) => {
      const [group, key] = path.split('.');
      const label =
        group === 'lumetri' ? labelOr(t, `contentStudio.inspector.lumetri.${key}`, key ?? group)
        : group === 'transform' ? labelOr(t, `contentStudio.inspector.motion.${MOTION_LABEL[key ?? ''] ?? key}`, key ?? group)
        : labelOr(t, `assistant.copilot.studio.field.${group}`, group);
      return `${name}: ${label}`;
    })) out.push(v);
  }
  if (prev.width !== next.width || prev.height !== next.height) out.push(...leafChanges({ size: `${prev.width}×${prev.height}` }, { size: `${next.width}×${next.height}` }, t, () => t('assistant.copilot.studio.field.canvas')));
  if (JSON.stringify(prev.audio) !== JSON.stringify(next.audio)) out.push(...leafChanges(prev.audio ?? {}, next.audio ?? {}, t, (p) => `${t('assistant.copilot.studio.field.ducking')}: ${p}`));
  return out.slice(0, 8);
}

/** Where "Show me" goes for an op: the clip, its inspector section, and the control keys to flash. */
export function studioRevealTarget(op: StudioOp, project: StudioProject): StudioRevealTarget | null {
  const has = (id: string) => project.tracks.some((tr) => tr.clips.some((c) => c.id === id));
  const firstClip = (ref: 'all' | string[]) => (ref === 'all' ? project.tracks.flatMap((tr) => (tr.kind === 'video' ? tr.clips : [])).find((c) => !c.title)?.id : ref.find(has));
  const keysOf = (o: object | undefined, prefix: string) => (o ? Object.keys(o).map((k) => `studio:${prefix}${k}`) : []);
  switch (op.op) {
    case 'grade': {
      const id = firstClip(op.clipIds);
      return id ? { clipId: id, section: 'effects', keys: [...keysOf(op.lumetri, ''), 'studio:section.effects'] } : null;
    }
    case 'apply_look': {
      const id = firstClip(op.clipIds);
      return id ? { clipId: id, section: 'effects', keys: ['studio:section.effects'] } : null;
    }
    case 'set_transform':
      return has(op.clipId) ? { clipId: op.clipId, section: 'motion', keys: [...(['x', 'y', 'scale', 'rotationDeg'] as const).filter((k) => op[k] !== undefined).map((k) => `studio:${k}`), 'studio:section.motion'] } : null;
    case 'set_keyframes':
      return has(op.clipId) ? { clipId: op.clipId, section: /^(positionX|positionY|scale|rotation)$/.test(op.property) ? 'motion' : op.property === 'volume' || op.property === 'pan' ? 'audio' : 'effects', keys: ['studio:section.motion', 'studio:section.effects', 'studio:section.audio'] } : null;
    case 'set_speed':
      return has(op.clipId) ? { clipId: op.clipId, section: 'speed', keys: ['studio:section.speed'] } : null;
    case 'set_transition':
      return has(op.clipId) ? { clipId: op.clipId, section: 'transition', keys: ['studio:section.transition'] } : null;
    case 'set_volume':
      return op.clipId && has(op.clipId) ? { clipId: op.clipId, section: 'audio', keys: ['studio:section.audio'] } : null;
    case 'split':
    case 'trim':
    case 'move_clip':
    case 'delete_clip':
    case 'freeze_frame':
      return has(op.clipId) ? { clipId: op.clipId, keys: [`studio:clip.${op.clipId}`] } : null;
    case 'add_title':
      return { section: 'title', keys: ['studio:section.title'] };
    default:
      return null;
  }
}

interface TokenState {
  after: StudioProject;
  depth: number;
}

let tokenSeq = 0;

export function createStudioAdapter(deps: StudioAdapterDeps): CopilotAdapter {
  const tokens = new Map<number, TokenState>();
  const live = (tok: CopilotEditToken): TokenState | null => {
    const st = tokens.get(tok.id);
    if (!st) return null;
    const s = deps.store.getState();
    return s.project === st.after && s.past.length === st.depth && s.gestureDepth === 0 ? st : null;
  };
  return {
    surface: 'studio',
    frameOnMessage: true,
    isVisual: (ops) => Array.isArray(ops) && ops.some((o) => STUDIO_VISUAL_OPS.has((o as { op?: string })?.op ?? '')),
    digest() {
      const s = deps.store.getState();
      if (!s.project) return '';
      const assets: Record<string, StudioDigestAsset> = {};
      for (const [id, e] of Object.entries(s.assets)) {
        if (e) assets[id] = { name: e.asset.displayName || e.asset.originalFileName, kind: e.asset.mediaKind, durationSeconds: e.asset.durationSeconds };
      }
      return studioDigest({ project: s.project, assets, playhead: s.playhead, selectedClipIds: s.selectedClipIds });
    },
    captureFrame: () => deps.captureFrame(),
    projectId: () => deps.projectId(),
    apply(summary, ops): CopilotApplyResult {
      const s = deps.store.getState();
      if (!s.project) return { ok: false, reason: 'validation', errors: ['no project is open'] };
      const before = s.project;
      const res = s.applyAssistantOps(summary, ops, { signedIn: deps.signedIn?.() });
      if (!res.ok) return res;
      for (const o of ops as StudioOp[]) if (o.op === 'set_caption_style' && o.look) deps.onCaptionLookApplied?.(o.look);
      const after = deps.store.getState();
      tokenSeq += 1;
      const token: CopilotEditToken = { id: tokenSeq };
      tokens.set(token.id, { after: after.project as StudioProject, depth: after.past.length });
      const list = ops as StudioOp[];
      return { ok: true, token, opCount: list.length, opKinds: Array.from(new Set(list.map((o) => o.op))), changes: describeStudioOps(list, before, deps.t), lines: studioChangeLines(list, before, deps.t) };
    },
    preview(ops): CopilotPreviewResult {
      const s = deps.store.getState();
      if (!s.project) return { ok: false, reason: 'validation', errors: ['no project is open'] };
      const ctx = {
        assetKind: (id: string) => s.assets[id]?.asset.mediaKind,
        assetDuration: (id: string) => s.assets[id]?.asset.durationSeconds,
        lockedViolation,
        signedIn: deps.signedIn?.(),
      };
      const list = ops as StudioOp[];
      const whole = applyStudioOps(s.project, ops, ctx);
      if (!whole.ok) return whole;
      let running = s.project;
      const lines: CopilotDiffLine[] = [];
      for (const op of list) {
        const step = applyStudioOps(running, [op], ctx);
        if (!step.ok) return step;
        const text = describeStudioOp(op, running, deps.t).join('; ');
        if (text) lines.push({ text, op: op.op, raw: op, ...(op.reason ? { reason: op.reason } : {}), values: studioValueChanges(running, step.project, deps.t) });
        running = step.project;
      }
      return { ok: true, lines };
    },
    canReveal(op) {
      const p = deps.store.getState().project;
      return !!p && !!studioRevealTarget(op as StudioOp, p);
    },
    reveal(op) {
      const st = deps.store.getState();
      const target = st.project ? studioRevealTarget(op as StudioOp, st.project) : null;
      return target ? studioRevealBridge.request(target) : false;
    },
    canUndo: (tok) => live(tok) !== null,
    undo(tok) {
      if (!live(tok)) return false;
      deps.store.getState().undo();
      tokens.delete(tok.id);
      return true;
    },
    suggest: {
      generate_captions: (p) => deps.onGenerateCaptions(typeof p.language === 'string' && /^[a-z]{2}$/.test(p.language) ? p.language : null),
      derive_audio: (p) => {
        const op = p.operation === 'split_vocals' || p.operation === 'split_instrumental' ? p.operation : 'voice_clean';
        return deps.onDeriveAudio(typeof p.clipId === 'string' ? p.clipId : null, op);
      },
      voiceover: (p) => deps.onVoiceover(typeof p.text === 'string' ? p.text.slice(0, 2000) : null),
      export: (p) => deps.onExport(p ?? {}),
      open_tool: (p) => deps.onOpenTool(p),
    },
  };
}
