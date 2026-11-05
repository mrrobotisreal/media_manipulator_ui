/**
 * MM110: the Motion copilot adapter (design MEDI_ASSISTANT.md §8.3, ticket decision 3).
 *
 * Binds the pure op engine (`lib/assistant/ops/applyVector.ts`) to the editor's store:
 * validate + apply all-or-nothing on a copy, then ONE `mutate('Medi|<summary>', () => next)`.
 * Never `load` (it clears history) and never `mutateAt` (the playhead must not change what an
 * op means). The undo token only acts while that edit is still the latest step, so it can never
 * undo the user's own later work. Motion sends a preview frame only on the verify loop
 * (`frameOnMessage: false`): the digest usually says enough.
 */
import type { StoreApi, UseBoundStore } from 'zustand';

import type { CopilotAdapter, CopilotApplyResult, CopilotChangeLine, CopilotDiffLine, CopilotEditToken, CopilotPreviewResult } from '@/lib/assistant/copilot/types';
import { labelOr, leafChanges } from '@/lib/assistant/copilot/diff';
import { perOpLines } from '@/lib/assistant/copilot/lines';
import { vectorRevealBridge, type VectorRevealTarget } from '@/lib/assistant/copilot/revealBridges';
import { vectorDigest } from '@/lib/assistant/digest/vector';
import { applyVectorOps } from '@/lib/assistant/ops/applyVector';
import type { VectorOp } from '@/lib/assistant/ops/vector';
import { findDocLayer } from '@/lib/vector/advanced';
import { docLoops, forEachLayer } from '@/lib/vector/vectorTypes';
import type { VectorState } from '@/lib/vector/vectorStore';
import type { VectorDoc } from '@/lib/vector/vectorTypes';

import { mediLabel } from './photo';

type Translate = (key: string, vars?: Record<string, unknown>) => string;

/** Export formats Medi may preselect (the dialog's own format ids). */
export const MEDI_EXPORT_FORMATS = ['svg_animated', 'svg_static', 'lottie', 'react_tsx', 'js', 'ts', 'flutter', 'gif', 'png_sequence', 'mp4', 'webm'] as const;
export type MediExportFormat = (typeof MEDI_EXPORT_FORMATS)[number];

/** The plain-words "what I changed" lines (templated keys, never model text). */
export function describeVectorOps(ops: VectorOp[], before: VectorDoc, t: Translate): string[] {
  return ops.flatMap((op) => describeVectorOp(op, before, t));
}

/** One op's lines (the change card shows them per op). */
export function describeVectorOp(op: VectorOp, before: VectorDoc, t: Translate): string[] {
  const name = (id: string) => {
    const l = findDocLayer(before, id);
    return l ? l.name || t(`vector.layerTypes.${l.type}`) : id;
  };
  const prop = (p: string) => {
    const m = /^transform\.(.+)$/.exec(p);
    const key = m ? m[1] : p === 'filter.blur' ? 'blur' : /^gradientStop\[(\d+)\]\.color$/.test(p) ? 'stopColor' : /^gradientStop\[(\d+)\]\.offset$/.test(p) ? 'stopOffset' : p;
    const n = /^gradientStop\[(\d+)\]/.exec(p);
    return t(`vector.properties.${key}`, n ? { n: Number(n[1]) + 1 } : undefined);
  };
  const out: string[] = [];
  {
    switch (op.op) {
      case 'add_layer':
        out.push(t('assistant.copilot.vectorChange.addLayer', { layer: t(`vector.layerTypes.${op.type}`) }));
        break;
      case 'add_text':
        out.push(t('assistant.copilot.vectorChange.addText'));
        break;
      case 'import_svg':
        out.push(t('assistant.copilot.vectorChange.importSvg'));
        break;
      case 'update_layer':
        out.push(t('assistant.copilot.vectorChange.updateLayer', { layer: name(op.layerId) }));
        break;
      case 'delete_layer':
        out.push(t('assistant.copilot.vectorChange.deleteLayer', { layer: name(op.layerId) }));
        break;
      case 'animate':
        out.push(t('assistant.copilot.vectorChange.animate', { layer: name(op.layerId), property: prop(op.property) }));
        break;
      case 'apply_animator':
        out.push(t('assistant.copilot.vectorChange.animator', { animator: t(`vector.animators.${op.animator}`), count: op.layerIds.length }));
        break;
      case 'template':
        out.push(t('assistant.copilot.vectorChange.template', { template: t(`vector.templates.${op.kind}`) }));
        break;
      case 'set_duration':
        out.push(t('assistant.copilot.vectorChange.duration', { seconds: Math.round(op.ms / 100) / 10 }));
        break;
      case 'set_canvas':
        out.push(t('assistant.copilot.vectorChange.canvas'));
        break;
      case 'set_loop':
        out.push(t(op.loop ? 'assistant.copilot.vectorChange.loopOn' : 'assistant.copilot.vectorChange.loopOff'));
        break;
    }
  }
  return out;
}


/** Per-op lines of the change card (MM114). */
export function vectorChangeLines(ops: VectorOp[], before: VectorDoc, t: Translate): CopilotChangeLine[] {
  return perOpLines(ops, (op) => describeVectorOp(op, before, t));
}

const layerName = (doc: VectorDoc, id: string, t: Translate) => {
  const l = findDocLayer(doc, id);
  return l ? l.name || t(`vector.layerTypes.${l.type}`) : id;
};

/** `before → after` values of one op: changed layer fields and the animation settings (MM114 diff card). */
export function vectorValueChanges(prev: VectorDoc, next: VectorDoc, t: Translate) {
  const out: CopilotDiffLine['values'] = [];
  const flat = (l: Record<string, unknown>) => {
    return Object.fromEntries(Object.entries(l).filter(([k]) => k !== 'children'));
  };
  const byId = (doc: VectorDoc) => {
    const m = new Map<string, Record<string, unknown>>();
    forEachLayer(doc, (l) => m.set(l.id, flat(l as unknown as Record<string, unknown>)));
    return m;
  };
  const was = byId(prev);
  for (const [id, now] of byId(next)) {
    const old = was.get(id);
    if (!old) continue;
    const name = layerName(next, id, t);
    for (const v of leafChanges(old, now, t, (path) => `${name}: ${labelOr(t, `vector.properties.${path.replace(/^transform\./, '')}`, path)}`)) out.push(v);
  }
  const animated = (doc: VectorDoc) => doc.animations.map((a) => `${a.layerId}:${a.property}:${a.keyframes.length}`).sort().join(' ');
  if (animated(prev) !== animated(next)) out.push({ label: t('assistant.copilot.vectorChange.keysLabel'), before: String(prev.animations.reduce((n, a) => n + a.keyframes.length, 0)), after: String(next.animations.reduce((n, a) => n + a.keyframes.length, 0)) });
  out.push(...leafChanges({ duration: prev.duration, fps: prev.fps, loop: docLoops(prev), width: prev.canvas.width, height: prev.canvas.height, background: prev.canvas.background }, { duration: next.duration, fps: next.fps, loop: docLoops(next), width: next.canvas.width, height: next.canvas.height, background: next.canvas.background }, t, (p) => `${t('assistant.copilot.vectorChange.docLabel')}: ${p}`));
  return out.slice(0, 8);
}

/** Where "Show me" goes for an op: the layer (selected and expanded), a property row, and the keys to flash. */
export function vectorRevealTarget(op: VectorOp, doc: VectorDoc): VectorRevealTarget | null {
  const has = (id: string) => !!findDocLayer(doc, id);
  switch (op.op) {
    case 'update_layer':
      return has(op.layerId) ? { layerId: op.layerId, keys: [`vector:layer.${op.layerId}`] } : null;
    case 'animate':
      return has(op.layerId) ? { layerId: op.layerId, property: op.property, keys: [`vector:property.${op.layerId}.${op.property}`, `vector:layer.${op.layerId}`] } : null;
    case 'apply_animator':
      return op.layerIds.length && has(op.layerIds[0]) ? { layerId: op.layerIds[0], keys: [`vector:layer.${op.layerIds[0]}`] } : null;
    case 'delete_layer':
      return has(op.layerId) ? { layerId: op.layerId, keys: [`vector:layer.${op.layerId}`] } : null;
    case 'template': {
      const id = op.layerIds?.find(has);
      return id ? { layerId: id, keys: [`vector:layer.${id}`] } : null;
    }
    default:
      return null;
  }
}

export interface VectorAdapterDeps {
  store: UseBoundStore<StoreApi<VectorState>>;
  t: Translate;
  captureFrame: () => Promise<Blob | null>;
  projectId: () => string | null;
  /** Suggested actions: each runs only on the user's click. */
  onExport: (format: MediExportFormat | null) => void;
  onOpenTool: (params: Record<string, unknown>) => void;
}

interface TokenState {
  after: VectorDoc;
  depth: number;
}

let tokenSeq = 0;

export function createVectorAdapter(deps: VectorAdapterDeps): CopilotAdapter {
  const tokens = new Map<number, TokenState>();
  const live = (tok: CopilotEditToken): TokenState | null => {
    const st = tokens.get(tok.id);
    if (!st) return null;
    const s = deps.store.getState();
    return s.doc === st.after && s.past.length === st.depth && s.gestureDepth === 0 ? st : null;
  };
  return {
    surface: 'vector',
    frameOnMessage: false,
    digest() {
      const s = deps.store.getState();
      return s.doc ? vectorDigest({ doc: s.doc, selection: s.selection, time: s.time }) : '';
    },
    captureFrame: () => deps.captureFrame(),
    projectId: () => deps.projectId(),
    apply(summary, ops): CopilotApplyResult {
      const s = deps.store.getState();
      if (!s.doc) return { ok: false, reason: 'validation', errors: ['no animation is open'] };
      if (s.gestureDepth > 0) return { ok: false, reason: 'locked', errors: ['the user is dragging on the canvas; try again'] };
      const before = s.doc;
      const res = applyVectorOps(before, ops);
      if (!res.ok) return res;
      if (JSON.stringify(res.doc) === JSON.stringify(before)) return { ok: false, reason: 'validation', errors: ['the edit changes nothing in this animation'] };
      const list = ops as VectorOp[];
      const select = res.touched.length ? [res.touched[res.touched.length - 1]] : undefined;
      s.setPlaying(false);
      deps.store.getState().mutate(mediLabel(summary), () => res.doc, select);
      const after = deps.store.getState();
      tokenSeq += 1;
      const token: CopilotEditToken = { id: tokenSeq };
      tokens.set(token.id, { after: after.doc as VectorDoc, depth: after.past.length });
      return { ok: true, token, opCount: list.length, opKinds: Array.from(new Set(list.map((o) => o.op))), changes: describeVectorOps(list, before, deps.t), lines: vectorChangeLines(list, before, deps.t) };
    },
    preview(ops): CopilotPreviewResult {
      const s = deps.store.getState();
      if (!s.doc) return { ok: false, reason: 'validation', errors: ['no animation is open'] };
      const whole = applyVectorOps(s.doc, ops);
      if (!whole.ok) return whole;
      let running = s.doc;
      const lines: CopilotDiffLine[] = [];
      for (const op of ops as VectorOp[]) {
        const step = applyVectorOps(running, [op]);
        if (!step.ok) return step;
        const text = describeVectorOp(op, running, deps.t).join('; ');
        if (text) lines.push({ text, op: op.op, raw: op, ...(op.reason ? { reason: op.reason } : {}), values: vectorValueChanges(running, step.doc, deps.t) });
        running = step.doc;
      }
      return { ok: true, lines };
    },
    canReveal(op) {
      const d = deps.store.getState().doc;
      return !!d && !!vectorRevealTarget(op as VectorOp, d);
    },
    reveal(op) {
      const d = deps.store.getState().doc;
      const target = d ? vectorRevealTarget(op as VectorOp, d) : null;
      return target ? vectorRevealBridge.request(target) : false;
    },
    canUndo: (tok) => live(tok) !== null,
    undo(tok) {
      if (!live(tok)) return false;
      deps.store.getState().undo();
      tokens.delete(tok.id);
      return true;
    },
    suggest: {
      export: (p) => deps.onExport(typeof p.format === 'string' && (MEDI_EXPORT_FORMATS as readonly string[]).includes(p.format) ? (p.format as MediExportFormat) : null),
      open_tool: (p) => deps.onOpenTool(p),
    },
  };
}
