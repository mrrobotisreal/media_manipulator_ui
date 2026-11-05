/**
 * MM108: apply Medi's Aperture ops to a `PhotoDoc` (design MEDI_ASSISTANT.md §8.3).
 *
 * Pure: (doc, ops, env) → a new doc or the reasons nothing changed. Every op runs through the
 * editor's own pure ops (`layerOps`, `maskOps`, `geometryOps`, `appendPreset`,
 * `computeAutoPreset`) on a copy; the result is parsed with `parsePhotoDoc` (the same schema the
 * server's sanitizer mirrors). ALL-OR-NOTHING: one failing op, an unknown id or a failed parse
 * returns `{ok:false}` and the caller changes nothing. The caller records the result as ONE
 * undo entry (`mutate('Medi|<summary>', () => doc)`); this module never touches the store.
 */
import { appendPreset, parsePresetLayers, presetById, presetGroupName } from '@/lib/photo/presets';
import { computeAutoPreset } from '@/lib/photo/presets/autoPreset';
import { greyExceptAll, moveLayer, newLayer, patchLayer, removeLayer } from '@/lib/photo/layerOps';
import { maskOfLayer, pruneMasks, remapParametricMasks } from '@/lib/photo/maskOps';
import { patchGeometry, rotateBy } from '@/lib/photo/geometryOps';
import { autoCropRect, geometryOutputSize } from '@/lib/photo/colorMath';
import { aspectValue, fitAspectRect, normalizeCrop, type AspectPreset } from '@/lib/photo/toolMath';
import { defaultHslRanges, isMaskRef, LAYER_PARAMS, parsePhotoDoc, PHOTO_MAX_LAYERS, type AdjustmentLayer, type HslRange, type Mask, type PhotoDoc } from '@/lib/photo/photoTypes';
import type { Histogram } from '@/lib/photo/gl/histogram';

import { GREY_EXCEPT_HUES, photoOpsProblems, photoParamsSchema, type GreyExceptName, type PhotoMaskSpec, type PhotoOp } from './photo';

export interface PhotoApplyEnv {
  /** The proxy's histogram (auto_tone needs it). */
  histogram?: Pick<Histogram, 'r' | 'g' | 'b'> | null;
  /** Display name of a built-in preset (the group header, as the presets panel writes it). */
  presetGroupName?: (presetId: string) => string;
}

export type PhotoApplyResult =
  | { ok: true; doc: PhotoDoc; touched: string[] }
  | { ok: false; reason: 'validation' | 'unknown_id'; errors: string[] };

class OpError extends Error {
  constructor(
    readonly reason: 'validation' | 'unknown_id',
    message: string,
  ) {
    super(message);
  }
}

const has = (doc: PhotoDoc, id: string) => doc.layers.some((l) => l.id === id);
const need = (doc: PhotoDoc, id: string, at: string) => {
  if (!has(doc, id)) throw new OpError('unknown_id', `${at}: no layer ${JSON.stringify(id)} in the document`);
};

/** A layer mask from the op's parametric spec: `combine` is the mode of every component after the first. */
export function maskFromSpec(spec: PhotoMaskSpec): Mask {
  return {
    components: spec.components.map((c, i) => ({ mode: i === 0 ? 'add' : spec.combine ?? 'add', ...c })) as Mask['components'],
    feather: spec.feather ?? 0,
    invert: spec.invert ?? false,
    opacity: 1,
  };
}

/** Deep merge of a params patch into existing params (objects merge, everything else replaces). */
function mergeParams(base: unknown, patch: unknown): unknown {
  if (!patch || typeof patch !== 'object' || Array.isArray(patch) || !base || typeof base !== 'object' || Array.isArray(base)) return patch;
  const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
  for (const [k, v] of Object.entries(patch as Record<string, unknown>)) out[k] = mergeParams((base as Record<string, unknown>)[k], v);
  return out;
}

/** HSL ranges for `grey_except`: named colours map onto the six default ranges, extra hues become custom ranges. */
export function greyExceptRanges(base: HslRange[], wanted: (GreyExceptName | { hue: number; width?: number })[]): HslRange[] {
  let ranges = base.length ? base : defaultHslRanges();
  const keep: string[] = [];
  let n = 1;
  const ids = new Set(ranges.map((r) => r.id));
  const nextId = () => {
    while (ids.has(`custom-${n}`)) n += 1;
    const id = `custom-${n}`;
    ids.add(id);
    return id;
  };
  for (const w of wanted) {
    const hue = typeof w === 'string' ? GREY_EXCEPT_HUES[w] : ((Math.round(w.hue) % 360) + 360) % 360;
    const width = typeof w === 'string' ? undefined : w.width;
    // A named colour that sits on a default range keeps that range (red → reds …).
    const onDefault = width === undefined ? ranges.find((r) => !r.id.startsWith('custom-') && Math.abs(((r.center - hue + 540) % 360) - 180) < 1) : undefined;
    if (onDefault) {
      keep.push(onDefault.id);
      continue;
    }
    const id = nextId();
    ranges = [...ranges, { id, center: hue, width: width ?? 30, feather: 30, hue: 0, saturation: 0, lightness: 0 }];
    keep.push(id);
  }
  return greyExceptAll(ranges, keep);
}

function setGeometry(doc: PhotoDoc, op: Extract<PhotoOp, { op: 'set_geometry' }>, at: string): PhotoDoc {
  let d = doc;
  if (op.rotate !== undefined && op.rotate !== 0) d = rotateBy(d, op.rotate);
  if (op.straighten !== undefined) {
    const base = Math.round(d.geometry.rotate / 90) * 90;
    d = patchGeometry(d, { rotate: Math.round((base + op.straighten) * 100) / 100 });
  }
  if (op.flipH !== undefined) d = patchGeometry(d, { flipH: op.flipH });
  if (op.flipV !== undefined) d = patchGeometry(d, { flipV: op.flipV });
  const w0 = d.source.width;
  const h0 = d.source.height;
  let crop = d.geometry.crop;
  if (op.crop !== undefined) {
    if (op.crop === null) crop = null;
    else if ('rect' in op.crop) crop = normalizeCrop(op.crop.rect);
    else {
      const canvas = geometryOutputSize({ ...d.geometry, crop: null }, w0, h0);
      const asp = op.crop.aspect === '2.39:1' ? 2.39 : aspectValue(op.crop.aspect as AspectPreset, w0, h0);
      if (!asp) throw new OpError('validation', `${at}.crop.aspect: unknown aspect`);
      crop = normalizeCrop(op.straighten ? autoCropRect({ ...d.geometry, crop: null }, w0, h0, asp) : fitAspectRect(asp, canvas.width, canvas.height));
    }
  } else if (op.straighten !== undefined && op.straighten !== 0) {
    // Straighten shows no empty corners (the panel's auto-crop).
    crop = normalizeCrop(autoCropRect({ ...d.geometry, crop: null }, w0, h0));
  }
  if (crop !== d.geometry.crop) {
    // Brush masks would need an async re-bake; a crop change with brushes is a human edit.
    const hasBrush = d.layers.some((l) => (maskOfLayer(d, l.id)?.components ?? []).some((c) => c.kind === 'brush'));
    if (hasBrush) throw new OpError('validation', `${at}.crop: this photo has painted (brush) masks; crop it in the Geometry panel instead`);
    const from = d.geometry.crop;
    d = remapParametricMasks(patchGeometry(d, { crop }), from, crop);
  }
  return d;
}

function applyOne(doc: PhotoDoc, op: PhotoOp, at: string, env: PhotoApplyEnv, touched: string[]): PhotoDoc {
  switch (op.op) {
    case 'add_layer': {
      if (doc.layers.length >= PHOTO_MAX_LAYERS) throw new OpError('validation', `${at}: the photo already has ${PHOTO_MAX_LAYERS} layers`);
      const base = newLayer(doc, op.type);
      const params = op.params ? LAYER_PARAMS[op.type].parse(mergeParams(base.params, op.params)) : base.params;
      const layer = {
        ...base,
        params,
        ...(op.name ? { name: op.name } : {}),
        ...(op.opacity !== undefined ? { opacity: op.opacity } : {}),
        ...(op.blend ? { blend: op.blend } : {}),
        ...(op.mask ? { mask: maskFromSpec(op.mask) } : {}),
      } as AdjustmentLayer;
      touched.push(layer.id);
      return { ...doc, layers: [...doc.layers, layer] };
    }
    case 'update_layer': {
      need(doc, op.layerId, at);
      const cur = doc.layers.find((l) => l.id === op.layerId) as AdjustmentLayer;
      let d = doc;
      if (op.params) {
        const problems = photoParamsSchema(cur.type).safeParse(op.params);
        if (!problems.success) throw new OpError('validation', `${at}.params: not parameters of a ${cur.type} layer (${photoOpsProblems([{ op: 'add_layer', type: cur.type, params: op.params }]).join('; ').replace(/ops\[0\]\./g, '')})`);
        const params = LAYER_PARAMS[cur.type].parse(mergeParams(cur.params, op.params));
        d = { ...d, layers: d.layers.map((l) => (l.id === op.layerId ? ({ ...l, params } as AdjustmentLayer) : l)) };
      }
      const patch: Partial<AdjustmentLayer> = {};
      if (op.opacity !== undefined) patch.opacity = op.opacity;
      if (op.blend !== undefined) patch.blend = op.blend;
      if (op.enabled !== undefined) patch.enabled = op.enabled;
      if (op.name !== undefined) patch.name = op.name;
      if (Object.keys(patch).length) d = patchLayer(d, op.layerId, patch);
      touched.push(op.layerId);
      return d;
    }
    case 'remove_layer':
      need(doc, op.layerId, at);
      return clearUnused(removeLayer(doc, op.layerId));
    case 'move_layer':
      need(doc, op.layerId, at);
      touched.push(op.layerId);
      return moveLayer(doc, op.layerId, op.toIndex);
    case 'grey_except': {
      if (op.layerId !== undefined) {
        need(doc, op.layerId, at);
        const cur = doc.layers.find((l) => l.id === op.layerId) as AdjustmentLayer;
        if (cur.type !== 'hsl') throw new OpError('validation', `${at}.layerId: ${op.layerId} is a ${cur.type} layer, not hsl`);
        const ranges = greyExceptRanges(cur.params.ranges, op.ranges);
        touched.push(cur.id);
        return { ...doc, layers: doc.layers.map((l) => (l.id === cur.id ? ({ ...cur, params: { ...cur.params, ranges } } as AdjustmentLayer) : l)) };
      }
      if (doc.layers.length >= PHOTO_MAX_LAYERS) throw new OpError('validation', `${at}: the photo already has ${PHOTO_MAX_LAYERS} layers`);
      const base = newLayer(doc, 'hsl');
      const layer = { ...base, params: { ...base.params, ranges: greyExceptRanges(base.params.ranges, op.ranges) } } as AdjustmentLayer;
      touched.push(layer.id);
      return { ...doc, layers: [...doc.layers, layer] };
    }
    case 'set_mask': {
      need(doc, op.layerId, at);
      const cur = doc.layers.find((l) => l.id === op.layerId) as AdjustmentLayer;
      if (cur.mask && isMaskRef(cur.mask)) throw new OpError('validation', `${at}: ${op.layerId} uses a shared mask; edit it in the Masks panel`);
      touched.push(op.layerId);
      const mask = maskFromSpec(op);
      return clearUnused({ ...doc, layers: doc.layers.map((l) => (l.id === op.layerId ? ({ ...l, mask } as AdjustmentLayer) : l)) });
    }
    case 'apply_preset': {
      const def = presetById(op.presetId);
      if (!def) throw new OpError('validation', `${at}.presetId: unknown preset`);
      let layers = def.computed ? (env.histogram ? computeAutoPreset(env.histogram).layers : null) : parsePresetLayers(def.layers);
      if (!layers || layers.length === 0) throw new OpError('validation', `${at}: the ${op.presetId} look needs the photo's histogram; try again in a moment`);
      if (op.intensity !== undefined) layers = layers.map((l) => ({ ...l, opacity: Math.round(l.opacity * (op.intensity as number) * 1000) / 1000 }) as AdjustmentLayer);
      const group = (env.presetGroupName?.(op.presetId) ?? presetGroupName(op.presetId)).slice(0, 80);
      const next = appendPreset(doc, def.id, layers, group);
      if (next === doc) throw new OpError('validation', `${at}: the photo has no room for ${layers.length} more layers`);
      touched.push(...next.layers.slice(doc.layers.length).map((l) => l.id));
      return next;
    }
    case 'auto_tone': {
      if (!env.histogram) throw new OpError('validation', `${at}: the histogram is not ready yet; try again in a moment`);
      const layers = computeAutoPreset(env.histogram).layers;
      const group = (env.presetGroupName?.('auto') ?? presetGroupName('auto')).slice(0, 80);
      const next = appendPreset(doc, 'auto', layers, group);
      if (next === doc) throw new OpError('validation', `${at}: the photo has no room for 2 more layers`);
      touched.push(...next.layers.slice(doc.layers.length).map((l) => l.id));
      return next;
    }
    case 'set_geometry':
      return setGeometry(doc, op, at);
  }
}

/** Drop an unreferenced named mask after a layer or mask change. */
const clearUnused = (doc: PhotoDoc) => pruneMasks(doc);

/**
 * Apply an op list (all or nothing). The ops are validated against the op schema first (the
 * API did too; this is the client's second check), then run in order on a copy.
 */
export function applyPhotoOps(doc: PhotoDoc, ops: unknown, env: PhotoApplyEnv = {}): PhotoApplyResult {
  const problems = photoOpsProblems(ops);
  if (problems.length) return { ok: false, reason: 'validation', errors: problems.slice(0, 8) };
  let d = doc;
  const touched: string[] = [];
  try {
    (ops as PhotoOp[]).forEach((op, i) => {
      d = applyOne(d, op, `ops[${i}]`, env, touched);
    });
  } catch (e) {
    if (e instanceof OpError) return { ok: false, reason: e.reason, errors: [e.message] };
    return { ok: false, reason: 'validation', errors: [e instanceof Error ? e.message : String(e)] };
  }
  const parsed = parsePhotoDoc(d);
  if (!parsed.ok) return { ok: false, reason: 'validation', errors: [`the edited photo is not valid: ${parsed.error}`] };
  return { ok: true, doc: parsed.doc, touched: Array.from(new Set(touched)).filter((id) => parsed.doc.layers.some((l) => l.id === id)) };
}
