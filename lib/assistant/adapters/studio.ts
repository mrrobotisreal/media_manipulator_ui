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
import type { CopilotAdapter, CopilotApplyResult, CopilotEditToken } from '@/lib/assistant/copilot/types';
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
  applyAssistantOps: (summary: string, ops: unknown) => { ok: true; project: StudioProject; touched: string[] } | { ok: false; reason: 'validation' | 'unknown_id' | 'locked'; errors: string[] };
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
  onExport: () => void;
  onOpenTool: (params: Record<string, unknown>) => void;
}

/** Ops whose result is visible in the preview (the verify loop sends a frame after these). */
export const STUDIO_VISUAL_OPS: ReadonlySet<string> = new Set(['grade', 'apply_look', 'add_title', 'set_transform', 'set_canvas', 'set_keyframes', 'set_transition', 'freeze_frame']);

/** The plain-words "what I changed" lines of an applied op list (templated keys, never model text). */
export function describeStudioOps(ops: StudioOp[], before: StudioProject, t: Translate): string[] {
  const clipName = (id: string) => {
    for (const tr of before.tracks) {
      const c = tr.clips.find((x) => x.id === id);
      if (c) return c.title ? t('assistant.copilot.studio.titleClip') : `${trackLabel(tr)} ${Math.round(c.timelineStart * 10) / 10}s`;
    }
    return id;
  };
  const clips = (ref: 'all' | string[]) => (ref === 'all' ? t('assistant.copilot.studio.allClips') : ref.map(clipName).join(', '));
  const out: string[] = [];
  for (const o of ops) {
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
      const res = s.applyAssistantOps(summary, ops);
      if (!res.ok) return res;
      const after = deps.store.getState();
      tokenSeq += 1;
      const token: CopilotEditToken = { id: tokenSeq };
      tokens.set(token.id, { after: after.project as StudioProject, depth: after.past.length });
      const list = ops as StudioOp[];
      return { ok: true, token, opCount: list.length, opKinds: Array.from(new Set(list.map((o) => o.op))), changes: describeStudioOps(list, before, deps.t) };
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
      export: () => deps.onExport(),
      open_tool: (p) => deps.onOpenTool(p),
    },
  };
}
