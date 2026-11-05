/**
 * MM108: the Aperture copilot adapter (design MEDI_ASSISTANT.md §8.3, ticket decision 3).
 *
 * Binds the pure op engine (`lib/assistant/ops/applyPhoto.ts`) to the editor's store:
 * validate + apply all-or-nothing on a copy, then ONE `mutate('Medi|<summary>', () => next)`
 * (never `replaceDoc`, `load` or `restoreDraft`, which clear history), so the History panel shows
 * "Medi: <summary>" and one Undo restores the previous document byte for byte. The undo token
 * only acts while that edit is still the latest step, so it can never undo the user's own work.
 */
import { LAYER_TYPES, type LayerType, type PhotoDoc } from '@/lib/photo/photoTypes';
import type { PhotoState } from '@/lib/photo/photoStore';
import type { Histogram } from '@/lib/photo/gl/histogram';
import type { StoreApi, UseBoundStore } from 'zustand';

import type { CopilotAdapter, CopilotApplyResult, CopilotEditToken } from '@/lib/assistant/copilot/types';
import { photoDigest } from '@/lib/assistant/digest/photo';
import { applyPhotoOps } from '@/lib/assistant/ops/applyPhoto';
import { GREY_EXCEPT_NAMES, type PhotoOp } from '@/lib/assistant/ops/photo';

/** The history label prefix of a Medi edit (`lib/photo/history.ts` resolves it). */
export const MEDI_LABEL_PREFIX = 'Medi|';
export const mediLabel = (summary: string): string => `${MEDI_LABEL_PREFIX}${summary.trim().slice(0, 60)}`;

type Translate = (key: string, vars?: Record<string, unknown>) => string;

/** The plain-words "what I changed" lines of an applied op list (templated keys, never model text). */
export function describePhotoOps(ops: PhotoOp[], before: PhotoDoc, t: Translate): string[] {
  const typeName = (type: string) => ((LAYER_TYPES as readonly string[]).includes(type) ? t(`photo.layers.type.${type}`) : type);
  const layerName = (id: string) => {
    const l = before.layers.find((x) => x.id === id);
    return l ? l.name || typeName(l.type) : id;
  };
  const out: string[] = [];
  for (const op of ops) {
    switch (op.op) {
      case 'add_layer':
        out.push(t(op.mask ? 'assistant.copilot.change.addLayerMasked' : 'assistant.copilot.change.addLayer', { layer: typeName(op.type) }));
        break;
      case 'update_layer':
        out.push(t('assistant.copilot.change.updateLayer', { layer: layerName(op.layerId) }));
        break;
      case 'remove_layer':
        out.push(t('assistant.copilot.change.removeLayer', { layer: layerName(op.layerId) }));
        break;
      case 'move_layer':
        out.push(t('assistant.copilot.change.moveLayer', { layer: layerName(op.layerId) }));
        break;
      case 'grey_except': {
        const names = op.ranges.map((r) => (typeof r === 'string' && (GREY_EXCEPT_NAMES as string[]).includes(r) ? t(`assistant.copilot.colors.${r}`) : t('assistant.copilot.colors.custom')));
        out.push(t('assistant.copilot.change.greyExcept', { colors: Array.from(new Set(names)).join(', ') }));
        break;
      }
      case 'set_mask':
        out.push(t('assistant.copilot.change.setMask', { layer: layerName(op.layerId) }));
        break;
      case 'apply_preset':
        out.push(t('assistant.copilot.change.applyPreset', { preset: t(`photo.presets.name.${op.presetId}`) }));
        break;
      case 'auto_tone':
        out.push(t('assistant.copilot.change.autoTone'));
        break;
      case 'set_geometry':
        if (op.rotate) out.push(t('assistant.copilot.change.rotate', { degrees: op.rotate }));
        if (op.straighten !== undefined) out.push(t('assistant.copilot.change.straighten', { degrees: op.straighten }));
        if (op.flipH || op.flipV) out.push(t('assistant.copilot.change.flip'));
        if (op.crop === null) out.push(t('assistant.copilot.change.cropReset'));
        else if (op.crop && 'aspect' in op.crop) out.push(t('assistant.copilot.change.cropAspect', { aspect: op.crop.aspect === 'original' ? t('photo.geometry.original') : op.crop.aspect }));
        else if (op.crop) out.push(t('assistant.copilot.change.crop'));
        break;
    }
  }
  return out;
}

export interface PhotoAdapterDeps {
  store: UseBoundStore<StoreApi<PhotoState>>;
  t: Translate;
  histogram: () => Pick<Histogram, 'r' | 'g' | 'b' | 'luma'> | null;
  previewSize: () => { width: number; height: number } | null;
  captureFrame: () => Promise<Blob | null>;
  projectId: () => string | null;
  /** Suggested actions: each runs only on the user's click. */
  onSubjectMask: (layerId: string | null) => void | Promise<void>;
  onHeal: () => void;
  onExport: () => void;
  onOpenTool: (params: Record<string, unknown>) => void;
}

interface TokenState {
  id: number;
  after: PhotoDoc;
  depth: number;
}

let tokenSeq = 0;

export function createPhotoAdapter(deps: PhotoAdapterDeps): CopilotAdapter {
  const tokens = new Map<number, TokenState>();
  const live = (tok: CopilotEditToken): TokenState | null => {
    const st = tokens.get(tok.id);
    if (!st) return null;
    const s = deps.store.getState();
    return s.doc === st.after && s.past.length === st.depth && s.gestureDepth === 0 ? st : null;
  };
  return {
    surface: 'photo',
    frameOnMessage: true,
    digest() {
      const s = deps.store.getState();
      if (!s.doc) return '';
      return photoDigest({ doc: s.doc, selection: s.selection, histogram: deps.histogram(), previewSize: deps.previewSize() });
    },
    captureFrame: () => deps.captureFrame(),
    projectId: () => deps.projectId(),
    apply(summary, ops): CopilotApplyResult {
      const s = deps.store.getState();
      if (!s.doc) return { ok: false, reason: 'validation', errors: ['no photo is open'] };
      if (s.gestureDepth > 0) return { ok: false, reason: 'locked', errors: ['the user is dragging a slider; try again'] };
      const before = s.doc;
      const res = applyPhotoOps(before, ops, {
        histogram: deps.histogram(),
        presetGroupName: (id) => deps.t('photo.presets.groupName', { name: deps.t(`photo.presets.name.${id}`) }),
      });
      if (!res.ok) return res;
      const list = ops as PhotoOp[];
      if (res.doc === before || JSON.stringify(res.doc) === JSON.stringify(before)) {
        return { ok: false, reason: 'validation', errors: ['the edit changes nothing in this photo'] };
      }
      const select = res.touched.length ? res.touched[res.touched.length - 1] : undefined;
      deps.store.getState().mutate(mediLabel(summary), () => res.doc, select);
      const after = deps.store.getState();
      tokenSeq += 1;
      const token: CopilotEditToken = { id: tokenSeq };
      tokens.set(token.id, { id: token.id, after: after.doc as PhotoDoc, depth: after.past.length });
      return { ok: true, token, opCount: list.length, opKinds: Array.from(new Set(list.map((o) => o.op))), changes: describePhotoOps(list, before, deps.t) };
    },
    canUndo: (tok) => live(tok) !== null,
    undo(tok) {
      if (!live(tok)) return false;
      deps.store.getState().undo();
      tokens.delete(tok.id);
      return true;
    },
    suggest: {
      subject_mask: (p) => deps.onSubjectMask(typeof p.layerId === 'string' ? p.layerId : null),
      heal: () => deps.onHeal(),
      export: () => deps.onExport(),
      open_tool: (p) => deps.onOpenTool(p),
    },
  };
}

export const isLayerType = (t: string): t is LayerType => (LAYER_TYPES as readonly string[]).includes(t);
