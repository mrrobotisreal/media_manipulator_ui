/**
 * MM110: apply Medi's Motion ops to a `VectorDoc` (design MEDI_ASSISTANT.md §8.3).
 *
 * Pure: (doc, ops) → a new doc or the reasons nothing changed. Every op runs through the
 * editor's own pure modules (`layerTree`, `keyframes`, `animators`, `templates`, the SVG
 * importer) on a copy; the result is parsed with `parseVectorDoc` (whose `docIntegrityIssues`
 * the Go sanitizer mirrors). ALL-OR-NOTHING: one failing op, an unknown id, a time outside the
 * composition or a failed parse returns `{ok:false}` and the caller changes nothing. The caller
 * records the result as ONE undo entry (`mutate('Medi|<summary>', () => doc)`).
 *
 * Time is explicit, never implied by the playhead: `animate` writes exactly the keyframes it was
 * given (no `mutateAt` folding), animators run over the op's own span. `set_duration` runs
 * before every other op of the same call, so a call may lengthen the composition and key into
 * the new time (ticket decision 1); otherwise every keyframe must lie within the duration.
 * Locked layers (or layers inside a locked group) are refused, as on the canvas.
 */
import { findDocLayer } from '@/lib/vector/advanced';
import { applyBlur, applyDrawOn, applyGradientStops, applyMaskClip, applyMorph, applyMotionPath, canDrawOn, mapAnyLayer, type AnimatorSpan } from '@/lib/vector/animators';
import { canonicalTransform, resolveTransform } from '@/lib/vector/geometry';
import { normalizeKeyframes, pruneTracks, setDuration } from '@/lib/vector/keyframes';
import { docIds, findLayer, insertLayers, nextId, removeLayers } from '@/lib/vector/layerTree';
import { roundNum } from '@/lib/vector/num';
import { normalizePath } from '@/lib/vector/pathData';
import { DEFAULT_LINE_STYLE, DEFAULT_PATH_STYLE, DEFAULT_SHAPE_STYLE, DEFAULT_TEXT_STYLE } from '@/lib/vector/tools/types';
import { applyTemplate } from '@/lib/vector/templates';
import { isLocked } from '@/lib/vector/transformOps';
import { parseSvg, SvgImportError } from '@/lib/vector/importSvg';
import { forEachLayer, isSafeColor, parseVectorDoc, type Easing, type Layer, type Track, type VectorDoc, type VectorTransform } from '@/lib/vector/vectorTypes';

import { vectorOpsProblems, type VectorEasingOp, type VectorOp } from './vector';

export type VectorApplyResult =
  | { ok: true; doc: VectorDoc; touched: string[] }
  | { ok: false; reason: 'validation' | 'unknown_id' | 'locked'; errors: string[] };

class OpError extends Error {
  constructor(
    readonly reason: 'validation' | 'unknown_id' | 'locked',
    message: string,
  ) {
    super(message);
  }
}

const IDENTITY: VectorTransform = { x: 0, y: 0, scaleX: 1, scaleY: 1, rotation: 0, skewX: 0, skewY: 0, anchorX: 0, anchorY: 0 };

/** A layer the op may edit: it exists (tree or defs), is not raw, and is not locked. */
function editable(doc: VectorDoc, id: string, at: string): Exclude<Layer, { type: 'raw' }> {
  const l = findDocLayer(doc, id);
  if (!l) throw new OpError('unknown_id', `${at}: no layer ${JSON.stringify(id)} in the document`);
  if (l.type === 'raw') throw new OpError('validation', `${at}: layer ${JSON.stringify(id)} is kept as imported and cannot be edited`);
  if (findLayer(doc.layers, id) && isLocked(doc.layers, id)) throw new OpError('locked', `${at}: layer ${JSON.stringify(id)} is locked`);
  return l;
}

/** The op's partial transform merged over the layer's (identity when it has none). */
function mergeTransform(base: VectorTransform | undefined, patch: Partial<VectorTransform> | undefined): VectorTransform | undefined {
  if (!patch) return base;
  return canonicalTransform({ ...resolveTransform(base ?? IDENTITY), ...patch });
}

const DEFAULTS: Record<string, Record<string, unknown>> = {
  rect: DEFAULT_SHAPE_STYLE,
  ellipse: DEFAULT_SHAPE_STYLE,
  polygon: DEFAULT_SHAPE_STYLE,
  line: DEFAULT_LINE_STYLE,
  polyline: DEFAULT_LINE_STYLE,
  path: DEFAULT_PATH_STYLE,
  text: DEFAULT_TEXT_STYLE,
  group: {},
};

function cleanPath(d: string, at: string): string {
  try {
    return normalizePath(d);
  } catch {
    throw new OpError('validation', `${at}: the path data does not parse`);
  }
}

function newLayer(type: string, props: Record<string, unknown>, id: string, at: string): Layer {
  const { transform, ...rest } = props as Record<string, unknown> & { transform?: Partial<VectorTransform> };
  const layer: Record<string, unknown> = { type, id, ...DEFAULTS[type], ...rest };
  if (type === 'group') layer.children = [];
  if (type === 'path') layer.d = cleanPath(String(rest.d), `${at}.props.d`);
  const tf = mergeTransform(undefined, transform);
  if (tf) layer.transform = tf;
  return layer as unknown as Layer;
}

function parentOf(doc: VectorDoc, parentId: string | undefined, at: string): string | null {
  if (!parentId) return null;
  const g = findLayer(doc.layers, parentId);
  if (!g) throw new OpError('unknown_id', `${at}.parentId: no group ${JSON.stringify(parentId)}`);
  if (g.type !== 'group') throw new OpError('validation', `${at}.parentId: ${JSON.stringify(parentId)} is a ${g.type}, not a group`);
  if (isLocked(doc.layers, parentId)) throw new OpError('locked', `${at}.parentId: group ${JSON.stringify(parentId)} is locked`);
  return parentId;
}

/** Fields `update_layer` may set on each layer type (everything else in the patch is refused). */
const TYPE_FIELDS: Record<string, readonly string[]> = {
  rect: ['x', 'y', 'width', 'height', 'rx', 'ry'],
  ellipse: ['cx', 'cy', 'rx', 'ry'],
  line: ['x1', 'y1', 'x2', 'y2'],
  polyline: ['points'],
  polygon: ['points'],
  path: ['d'],
  text: ['x', 'y', 'text', 'fontFamily', 'fontSize', 'fontWeight', 'fontStyle', 'textAnchor', 'letterSpacing'],
  image: ['x', 'y', 'width', 'height'],
  use: ['x', 'y', 'width', 'height'],
  group: [],
};
const STYLE_FIELDS = ['name', 'hidden', 'locked', 'opacity', 'fill', 'fillOpacity', 'stroke', 'strokeWidth', 'strokeOpacity', 'strokeLinecap', 'strokeLinejoin', 'strokeDasharray', 'transform'];

function updateOne(doc: VectorDoc, op: Extract<VectorOp, { op: 'update_layer' }>, at: string): VectorDoc {
  const l = editable(doc, op.layerId, at);
  const allowed = new Set([...TYPE_FIELDS[l.type], ...STYLE_FIELDS]);
  for (const k of Object.keys(op.patch)) {
    if (!allowed.has(k)) throw new OpError('validation', `${at}.patch.${k}: a ${l.type} layer has no ${k}`);
  }
  const { transform, ...rest } = op.patch;
  const p: Record<string, unknown> = { ...rest };
  if (typeof p.d === 'string') p.d = cleanPath(p.d, `${at}.patch.d`);
  return mapAnyLayer(doc, op.layerId, (x) => {
    const next = { ...x, ...p } as Record<string, unknown>;
    if (transform) {
      const tf = mergeTransform((x as { transform?: VectorTransform }).transform, transform);
      if (tf) next.transform = tf;
      else delete next.transform;
    }
    return next as unknown as Layer;
  });
}

function easingOf(e: VectorEasingOp | undefined): Easing | undefined {
  return e as Easing | undefined;
}

/** Values a property's keyframes may hold (numbers for numeric tracks, colours for paints, path data for `d`). */
function checkValues(property: string, keys: Array<{ value: number | string }>, at: string): void {
  const paint = property === 'fill' || property === 'stroke' || /\.color$/.test(property);
  const pathTrack = property === 'd';
  keys.forEach((k, i) => {
    const where = `${at}.keyframes[${i}].value`;
    if (paint) {
      if (typeof k.value !== 'string' || !isSafeColor(k.value)) throw new OpError('validation', `${where}: ${property} keyframes are colours`);
    } else if (pathTrack) {
      if (typeof k.value !== 'string') throw new OpError('validation', `${where}: d keyframes are path data`);
    } else if (typeof k.value !== 'number') throw new OpError('validation', `${where}: ${property} keyframes are numbers`);
    if (property === 'opacity' && typeof k.value === 'number' && (k.value < 0 || k.value > 1)) throw new OpError('validation', `${where}: opacity is 0..1`);
    if (/^gradientStop\[\d+\]\.offset$/.test(property) && typeof k.value === 'number' && (k.value < 0 || k.value > 1)) throw new OpError('validation', `${where}: a stop offset is 0..1`);
  });
}

function animateOne(doc: VectorDoc, op: Extract<VectorOp, { op: 'animate' }>, at: string): VectorDoc {
  editable(doc, op.layerId, at);
  const p = op.property;
  if (p === 'mask' || p === 'clipPath') throw new OpError('validation', `${at}.property: ${p} is animated through the maskClip animator`);
  if (p === 'motionPath') throw new OpError('validation', `${at}.property: motionPath needs a guide; use the motionPath animator`);
  if (p === 'd' && findDocLayer(doc, op.layerId)?.type !== 'path') throw new OpError('validation', `${at}.property: only a path has a d track (morph)`);
  checkValues(p, op.keyframes, at);
  let last = -1;
  op.keyframes.forEach((k, i) => {
    if (k.t <= last) throw new OpError('validation', `${at}.keyframes[${i}].t: keyframes must be in increasing time (ms)`);
    if (k.t > doc.duration) throw new OpError('validation', `${at}.keyframes[${i}].t: ${k.t} ms is after the end (${doc.duration} ms); add set_duration first`);
    last = k.t;
  });
  const keyframes = normalizeKeyframes(op.keyframes.map((k) => ({ t: k.t, value: typeof k.value === 'number' ? roundNum(k.value) : p === 'd' ? cleanPath(k.value, at) : k.value.trim(), easing: easingOf(k.easing) as Easing })));
  if (!keyframes) throw new OpError('validation', `${at}.keyframes: two keyframes share a time`);
  const track: Track = { layerId: op.layerId, property: p, keyframes };
  const others = doc.animations.filter((tr) => !(tr.layerId === op.layerId && tr.property === p));
  return { ...doc, animations: [...others, track] };
}

function animatorOne(doc: VectorDoc, op: Extract<VectorOp, { op: 'apply_animator' }>, at: string, touched: string[]): VectorDoc {
  const { start, end } = op.span;
  if (end <= start) throw new OpError('validation', `${at}.span: end must be after start`);
  if (end > doc.duration) throw new OpError('validation', `${at}.span.end: ${end} ms is after the end (${doc.duration} ms); add set_duration first`);
  const s: AnimatorSpan = { start, end, ...(op.span.easing ? { easing: easingOf(op.span.easing) } : {}) };
  let d = doc;
  for (const id of op.layerIds) {
    editable(d, id, at);
    let next: VectorDoc = d;
    switch (op.animator) {
      case 'drawOn':
        if (!canDrawOn(d, id)) throw new OpError('validation', `${at}: drawOn needs an outline shape (path, line, polyline, polygon, rect, ellipse); ${JSON.stringify(id)} has none`);
        next = applyDrawOn(d, id, s);
        break;
      case 'motionPath': {
        const o = op.options ?? {};
        if (!o.pathId && !o.d) throw new OpError('validation', `${at}.options: motionPath needs pathId or d`);
        if (o.pathId && !findLayer(d.layers, o.pathId)) throw new OpError('unknown_id', `${at}.options.pathId: no layer ${JSON.stringify(o.pathId)}`);
        next = applyMotionPath(d, id, s, { pathId: o.pathId, d: o.d, autoOrient: o.autoOrient });
        break;
      }
      case 'morph': {
        const target = op.options?.targetId;
        if (!target) throw new OpError('validation', `${at}.options.targetId: morph needs the target shape`);
        const r = applyMorph(d, id, target, s);
        if (!r.ok) throw new OpError(r.reason === 'no_target' ? 'unknown_id' : 'validation', `${at}: morph failed (${r.reason})`);
        next = r.doc;
        break;
      }
      case 'gradient':
        next = applyGradientStops(d, id, start);
        break;
      case 'maskClip': {
        const r = applyMaskClip(d, id, start);
        if (!r.contentId) throw new OpError('validation', `${at}: ${JSON.stringify(id)} has no mask or clip path to animate`);
        next = r.doc;
        break;
      }
      case 'blur':
        next = applyBlur(d, id, s, op.options?.amount);
        break;
    }
    if (next === d) throw new OpError('validation', `${at}: ${op.animator} does not apply to ${JSON.stringify(id)}`);
    d = next;
    touched.push(id);
  }
  return d;
}

/** The imported SVG as one group of new layers (ids made unique against the document), centred and fitted to the canvas. */
function importOne(doc: VectorDoc, op: Extract<VectorOp, { op: 'import_svg' }>, at: string, touched: string[]): VectorDoc {
  let imported: VectorDoc;
  try {
    imported = parseSvg(op.markup).doc;
  } catch (e) {
    throw new OpError('validation', `${at}.markup: ${e instanceof SvgImportError ? e.code : 'not importable SVG'}`);
  }
  if (imported.layers.length === 0) throw new OpError('validation', `${at}.markup: nothing drawable in the SVG`);
  // Rename every id the import declares that the document already uses (layers, defs, raw ids), and rewrite references.
  const taken = docIds(doc);
  const mine = docIds(imported);
  const map = new Map<string, string>();
  for (const id of mine) if (taken.has(id)) map.set(id, nextId(taken, id.replace(/-\d+$/, '') || 'svg'));
  for (const id of mine) if (!map.has(id)) taken.add(id);
  if ([...map.keys()].length && imported.layers.some((l) => hasRaw(l))) {
    // Raw markup cannot be rewritten safely: refuse instead of producing dangling references.
    throw new OpError('validation', `${at}.markup: the SVG uses features kept as-is and its ids clash with the document; import it from the Import button instead`);
  }
  const text = JSON.stringify(imported).replace(/"(id|ref|mask|clipPath|filter|layerId)":"([^"]+)"|url\(#([^)]+)\)/g, (m, key: string | undefined, id: string | undefined, url: string | undefined) => {
    if (key && id && map.has(id)) return `"${key}":"${map.get(id)}"`;
    if (url && map.has(url)) return `url(#${map.get(url)})`;
    return m;
  });
  imported = JSON.parse(text) as VectorDoc;
  // Fit the import's viewBox into ours (scale to 60 % of the short side) and centre it.
  const src = imported.canvas.viewBox;
  const dst = doc.canvas.viewBox;
  const k = roundNum(Math.min((dst.width * 0.6) / src.width, (dst.height * 0.6) / src.height));
  const tx = roundNum(dst.x + (dst.width - src.width * k) / 2 - src.x * k);
  const ty = roundNum(dst.y + (dst.height - src.height * k) / 2 - src.y * k);
  const groupId = nextId(taken, 'import');
  const group: Layer = { type: 'group', id: groupId, name: op.name ?? 'Imported SVG', children: imported.layers, transform: canonicalTransform({ ...IDENTITY, x: tx, y: ty, scaleX: k, scaleY: k }) } as Layer;
  touched.push(groupId);
  const d = imported.defs;
  return {
    ...doc,
    layers: [...doc.layers, group],
    defs: {
      gradients: [...doc.defs.gradients, ...d.gradients],
      masks: [...doc.defs.masks, ...d.masks],
      clipPaths: [...doc.defs.clipPaths, ...d.clipPaths],
      filters: [...doc.defs.filters, ...d.filters],
      symbols: [...doc.defs.symbols, ...d.symbols],
    },
  };
}

const hasRaw = (l: Layer): boolean => l.type === 'raw' || (l.type === 'group' && l.children.some(hasRaw));

function canvasOne(doc: VectorDoc, op: Extract<VectorOp, { op: 'set_canvas' }>): VectorDoc {
  const c = doc.canvas;
  const width = op.width ?? c.width;
  const height = op.height ?? c.height;
  // The viewBox follows a size change (Motion's canvas has no separate zoom).
  const viewBox = op.width !== undefined || op.height !== undefined ? { x: 0, y: 0, width, height } : c.viewBox;
  return { ...doc, canvas: { ...c, width, height, viewBox, ...(op.background ? { background: op.background } : {}) }, ...(op.fps ? { fps: op.fps } : {}) };
}

function applyOne(doc: VectorDoc, op: VectorOp, at: string, touched: string[]): VectorDoc {
  switch (op.op) {
    case 'add_layer': {
      const parent = parentOf(doc, op.parentId, at);
      const taken = docIds(doc);
      const layer = newLayer(op.type, op.props, nextId(taken, op.type), at);
      touched.push(layer.id);
      return { ...doc, layers: insertLayers(doc.layers, parent, undefined, [layer]) };
    }
    case 'add_text': {
      const parent = parentOf(doc, op.parentId, at);
      const taken = docIds(doc);
      const props: Record<string, unknown> = { x: op.x, y: op.y, text: op.text };
      if (op.font) props.fontFamily = op.font;
      if (op.size) props.fontSize = op.size;
      if (op.weight) props.fontWeight = op.weight;
      if (op.fill) props.fill = op.fill;
      if (op.anchor) props.textAnchor = op.anchor;
      const layer = newLayer('text', props, nextId(taken, 'text'), at);
      touched.push(layer.id);
      return { ...doc, layers: insertLayers(doc.layers, parent, undefined, [layer]) };
    }
    case 'import_svg':
      return importOne(doc, op, at, touched);
    case 'update_layer':
      touched.push(op.layerId);
      return updateOne(doc, op, at);
    case 'delete_layer': {
      editable(doc, op.layerId, at);
      if (!findLayer(doc.layers, op.layerId)) throw new OpError('validation', `${at}: ${JSON.stringify(op.layerId)} is mask or clip content; delete the layer that uses it`);
      return pruneTracks({ ...doc, layers: removeLayers(doc.layers, new Set([op.layerId])) });
    }
    case 'animate':
      touched.push(op.layerId);
      return animateOne(doc, op, at);
    case 'apply_animator':
      return animatorOne(doc, op, at, touched);
    case 'template': {
      for (const id of op.layerIds ?? []) editable(doc, id, `${at}.layerIds`);
      const r = applyTemplate(doc, op.kind, { text: op.text, colors: op.colors, at: op.at, duration: op.duration, value: op.value, layerIds: op.layerIds });
      if (!r.ok) throw new OpError('validation', `${at}: ${r.error}`);
      touched.push(...r.added);
      return r.doc;
    }
    case 'set_duration':
      return doc; // ran first (see applyVectorOps)
    case 'set_canvas':
      return canvasOne(doc, op);
    case 'set_loop': {
      if ((doc.loop !== false) === op.loop) return doc;
      const { loop: _old, ...rest } = doc;
      void _old;
      return (op.loop ? rest : { ...rest, loop: false }) as VectorDoc;
    }
  }
}

/** Apply an `apply_edits` op list to a Motion document, all or nothing. */
export function applyVectorOps(doc: VectorDoc, ops: unknown): VectorApplyResult {
  const problems = vectorOpsProblems(ops);
  if (problems.length) return { ok: false, reason: 'validation', errors: problems.slice(0, 8) };
  const list = ops as VectorOp[];
  let d = doc;
  const touched: string[] = [];
  try {
    // Duration first (decision 1): a call may lengthen the composition and key into the new time.
    for (const op of list) if (op.op === 'set_duration') d = setDuration(d, op.ms);
    list.forEach((op, i) => {
      d = applyOne(d, op, `ops[${i}]`, touched);
    });
  } catch (e) {
    if (e instanceof OpError) return { ok: false, reason: e.reason, errors: [e.message] };
    return { ok: false, reason: 'validation', errors: [e instanceof Error ? e.message : String(e)] };
  }
  const parsed = parseVectorDoc(d);
  if (!parsed.ok) return { ok: false, reason: 'validation', errors: [`the edited animation is not valid: ${parsed.error}`] };
  const live = new Set<string>();
  forEachLayer(parsed.doc, (l) => live.add(l.id));
  return { ok: true, doc: parsed.doc, touched: Array.from(new Set(touched)).filter((id) => live.has(id)) };
}
