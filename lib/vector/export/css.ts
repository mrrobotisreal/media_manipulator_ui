/**
 * `VectorDoc` → animated SVG with embedded CSS (Motion, ticket MM44 decision 7,
 * design §3.3 rung 2). Pure, deterministic, NO script and NO runtime: one
 * `<style>` holding one `@keyframes` per animated track (transform tracks of a
 * layer combine into one), then the static SVG of frame 0 (`serializeSvg`), so
 * a renderer without CSS animation still shows the first frame.
 *
 * Agreement with the preview (`sampleTrack` / `sampleDoc`) is the contract,
 * golden-tested (`css.test.ts` evaluates the emitted keyframes with CSS timing
 * semantics and compares them with the sampler):
 *
 *   - every keyframe stop holds the sampler's value at that time; 0 % and 100 %
 *     are always present (before the first / after the last key, the end value
 *     holds, like the sampler);
 *   - the timing function of a segment sits in the keyframe of its LEFT stop:
 *     linear → `linear`; easeIn / easeOut → their exact cubic-bezier (they are
 *     quadratics); easeBoth → an extra stop at the midpoint, easeIn then
 *     easeOut (exact); cubicBezier → `cubic-bezier(…)`; hold, and paints that
 *     cannot interpolate (`none`, `url(#…)`), → `steps(1,end)` (§3.3.2), so
 *     the value jumps AT the next stop;
 *   - transform tracks of one layer combine into one `transform` keyframes
 *     over the union of their segment times. A union segment gets the single
 *     timing function the changing tracks agree on; where they disagree (two
 *     different curves at once, or a curve split by another track's key) the
 *     segment is sampled at 60 Hz with linear timing (`BAKE_STEP_MS`). A jump
 *     (hold) at a union stop is reproduced with a stop `JUMP_EPSILON` before it;
 *   - the transform is written as the model's matrix, anchor included:
 *     `translate(x+ax, y+ay) rotate() skewX() skewY() scale() translate(-ax, -ay)`
 *     with `transform-box: view-box; transform-origin: 0 0`, which is exactly
 *     the SVG `transform` attribute's semantics. (The ticket proposed
 *     `fill-box` + an anchor origin; that needs the element's bounding box,
 *     which for text depends on font metrics. Deviation logged in §8.) Every
 *     stop lists the same functions in the same order so browsers interpolate
 *     each argument numerically, as the sampler does.
 *
 * Keyframe names are `mm-<layerId>-<property>` (`transform` for the combined
 * group), sanitised to `[A-Za-z_][\w-]*` and de-duplicated deterministically
 * (`-2`, `-3`… in document order). Element rules select by layer id, which the
 * static exporter writes verbatim.
 *
 * MM45 adds the advanced animators (`lib/vector/advanced.ts`):
 *
 *   - draw-on: `stroke-dashoffset` keyframes (the dasharray is static);
 *   - motion path: `offset-path: path('<d>')` (the path in the layer's parent
 *     space) and `offset-rotate: auto | 0deg` on the element, `offset-distance`
 *     keyframes in % of the path length. With `transform-origin: 0 0` and
 *     `transform-box: view-box`, CSS composes `offset · transform`, exactly
 *     the model's `translate(P) · rotate(θ) · <own transform>`. The static
 *     markup therefore carries the layer's OWN transform (no path offset);
 *   - gradient stop colour: `stop-color` keyframes on
 *     `#<gradient> > stop:nth-child(i)`;
 *   - blur: `filter: blur(<stdDeviation>px)` keyframes on the layer (the CSS
 *     filter replaces the SVG `filter` reference while it runs). CSS can say
 *     it, but Safari does not apply CSS filters to SVG shapes, so
 *     `chooseRuntime` sends blur to the anime.js runtime (see there);
 *   - mask / clip content layers animate like any other layer (their ids are
 *     document ids, so `#id` selects them inside `<mask>` / `<clipPath>`).
 *
 * `canExportCss(doc)` lists what this exporter cannot express at all: path
 * morph (`d`, no CSS `d` in Safari), gradient stop offsets, tracks inside
 * symbols. `chooseRuntime` (`./chooseRuntime.ts`) decides between this and
 * the anime.js exporter.
 */
import type { CubicBezier } from '@/lib/vector/bezier';
import { serializeSvg } from '@/lib/vector/exportSvg';
import { resolveTransform } from '@/lib/vector/geometry';
import { MOTION_BRAND } from '@/lib/vector/brand';
import { formatNumber } from '@/lib/vector/num';
import {
  TRANSFORM_PROPERTIES,
  isEditableProperty,
  isTransformProperty,
  transformField,
  type AnimatableLayer,
  type EditableProperty,
} from '@/lib/vector/properties';
import { interpolable, sampleKeyframes, sampleDoc, type TrackValue } from '@/lib/vector/sampleTrack';
import { advancedKind, motionExtras, motionPathData, parseStopProperty, trackBlurFilter, trackGradient } from '@/lib/vector/advanced';
import {
  VECTOR_ID_PATTERN,
  docLoops,
  isSafeColor,
  isSafePaint,
  type Easing,
  type Layer,
  type Track,
  type VectorDoc,
  type VectorTransform,
} from '@/lib/vector/vectorTypes';

// ---------------------------------------------------------------------------
// constants
// ---------------------------------------------------------------------------

/** Bake resolution where combined transform tracks cannot share one timing function. */
export const BAKE_STEP_MS = 1000 / 60;
/** A jump at a union stop is preceded by a stop this fraction of the duration earlier. */
export const JUMP_EPSILON = 1e-6;
/** Exact cubic-bezier forms of Darkroom's quadratic presets (`lib/studio/ease.ts`). */
export const EASE_IN_CURVE: CubicBezier = [1 / 3, 0, 2 / 3, 1 / 3];
export const EASE_OUT_CURVE: CubicBezier = [1 / 3, 2 / 3, 2 / 3, 1];
export const HOLD_TIMING = 'steps(1,end)';

/** Header comments (decision 7; anonymous exports carry the "made with" note, comment only). */
export const MADE_WITH_COMMENT = '<!-- made with Media Manipulator -->';
export const generatedComment = () => `<!-- Generated by Media Manipulator ${MOTION_BRAND} -->`;

// ---------------------------------------------------------------------------
// canExportCss
// ---------------------------------------------------------------------------

export type CssExportIssueCode =
  /** A track on a property CSS cannot express (MM45: `d` morph, gradient stop offset). */
  | 'unsupported_property'
  /** A track on a layer inside a symbol (its instances live in `<use>` shadow trees). */
  | 'defs_layer'
  /** A track on a layer that is missing or not animatable. */
  | 'missing_layer'
  /** A keyframe value of the wrong kind, out of range, or an unsafe paint. */
  | 'bad_value'
  /** Animated tracks on a zero-length composition. */
  | 'zero_duration';

export interface CssExportIssue {
  code: CssExportIssueCode;
  layerId?: string;
  property?: string;
}

export type CssExportCheck = { ok: true } | { ok: false; issues: CssExportIssue[] };

/** The CSS-side property of a track, or null when CSS cannot express it. */
export type CssTrackProperty = Exclude<EditableProperty, `transform.${string}`> | 'transform' | 'strokeDashoffset' | 'motionPath' | 'stopColor' | 'blur';

function cssPropertyOf(p: string): CssTrackProperty | null {
  if (isTransformProperty(p)) return 'transform';
  if (isEditableProperty(p)) return p as CssTrackProperty;
  switch (advancedKind(p)) {
    case 'dash':
      return 'strokeDashoffset';
    case 'motion':
      return 'motionPath';
    case 'stopColor':
      return 'stopColor';
    case 'blur':
      return 'blur';
    default:
      return null;
  }
}

const UNSAFE_CSS_VALUE = /[<>&{};\\'"]/;

function valueOk(property: CssTrackProperty, v: number | string): boolean {
  if (property === 'fill' || property === 'stroke') return typeof v === 'string' && isSafePaint(v) && !UNSAFE_CSS_VALUE.test(v);
  if (property === 'stopColor') return typeof v === 'string' && isSafeColor(v) && !UNSAFE_CSS_VALUE.test(v);
  if (typeof v !== 'number' || !Number.isFinite(v)) return false;
  if (property === 'opacity') return v >= 0 && v <= 1;
  if (property === 'strokeWidth' || property === 'blur') return v >= 0;
  return true;
}

/** Every keyframe holds the same value: the track changes nothing. */
const constantTrack = (tr: Track) => tr.keyframes.every((k) => k.value === tr.keyframes[0].value);

/** Layers CSS can select: the tree and mask / clip contents (`symbols` are instanced by `use`). */
function cssLayers(doc: VectorDoc): { selectable: Map<string, Layer>; symbol: Set<string> } {
  const selectable = new Map<string, Layer>();
  const symbol = new Set<string>();
  const walk = (ls: Layer[], into: (l: Layer) => void) => {
    for (const l of ls) {
      into(l);
      if (l.type === 'group') walk(l.children, into);
    }
  };
  const add = (l: Layer) => selectable.set(l.id, l);
  walk(doc.layers, add);
  for (const m of doc.defs.masks) walk(m.layers, add);
  for (const c of doc.defs.clipPaths) walk(c.layers, add);
  for (const s of doc.defs.symbols) walk(s.layers, (l) => symbol.add(l.id));
  return { selectable, symbol };
}

/** Whether every track can be expressed in CSS by this exporter (see the module comment). */
export function canExportCss(doc: VectorDoc): CssExportCheck {
  const issues: CssExportIssue[] = [];
  const { selectable, symbol } = cssLayers(doc);
  let animated = false;
  for (const tr of doc.animations) {
    if (tr.keyframes.length === 0 || tr.property === 'mask' || tr.property === 'clipPath') continue;
    animated = true;
    const at = { layerId: tr.layerId, property: tr.property };
    const property = cssPropertyOf(tr.property);
    if (symbol.has(tr.layerId)) {
      issues.push({ code: 'defs_layer', ...at });
      continue;
    }
    const layer = selectable.get(tr.layerId);
    // `#id` selectors need the document id pattern (the schema enforces it; be defensive).
    if (!layer || layer.type === 'raw' || !VECTOR_ID_PATTERN.test(tr.layerId)) {
      issues.push({ code: 'missing_layer', ...at });
      continue;
    }
    if (!property) {
      // A morph / stop offset that never changes needs no CSS.
      if (!constantTrack(tr)) issues.push({ code: 'unsupported_property', ...at });
      continue;
    }
    if (tr.keyframes.some((k) => !valueOk(property, k.value))) issues.push({ code: 'bad_value', ...at });
  }
  if (animated && doc.duration <= 0) issues.push({ code: 'zero_duration' });
  return issues.length === 0 ? { ok: true } : { ok: false, issues };
}

// ---------------------------------------------------------------------------
// atomic segments: one track as exact pieces
// ---------------------------------------------------------------------------

export type Timing = { kind: 'linear' } | { kind: 'steps' } | { kind: 'cubic'; curve: CubicBezier };

/** [t0, t1): value runs v0 → v1 through `timing` (for 'steps', v0 holds and v1 lands at t1). */
export interface Piece {
  t0: number;
  t1: number;
  v0: TrackValue;
  v1: TrackValue;
  timing: Timing;
}

function easingTiming(e: Easing): Timing | 'easeBoth' {
  if (typeof e === 'object') return { kind: 'cubic', curve: [e.cubicBezier[0], e.cubicBezier[1], e.cubicBezier[2], e.cubicBezier[3]] };
  switch (e) {
    case 'hold':
      return { kind: 'steps' };
    case 'easeIn':
      return { kind: 'cubic', curve: EASE_IN_CURVE };
    case 'easeOut':
      return { kind: 'cubic', curve: EASE_OUT_CURVE };
    case 'easeBoth':
      return 'easeBoth';
    default:
      return { kind: 'linear' };
  }
}

const sameValue = (a: TrackValue, b: TrackValue) => a === b;

/**
 * A track as exact pieces covering [0, duration] (shared with the anime
 * exporter). Keyframes are sorted (the store guarantees it).
 */
export function trackPieces(track: Track, duration: number): Piece[] {
  const keys = [...track.keyframes].sort((a, b) => a.t - b.t);
  const out: Piece[] = [];
  const first = keys[0];
  const last = keys[keys.length - 1];
  const constant = (t0: number, t1: number, v: TrackValue) => {
    if (t1 > t0) out.push({ t0, t1, v0: v, v1: v, timing: { kind: 'linear' } });
  };
  constant(0, Math.min(first.t, duration), first.value);
  for (let i = 0; i + 1 < keys.length; i++) {
    const a = keys[i];
    const b = keys[i + 1];
    const t1 = Math.min(b.t, duration);
    if (a.t >= duration || t1 <= a.t) continue;
    if (!interpolable(a.value, b.value)) {
      out.push({ t0: a.t, t1, v0: a.value, v1: b.value, timing: { kind: 'steps' } });
      continue;
    }
    if (sameValue(a.value, b.value)) {
      constant(a.t, t1, a.value);
      continue;
    }
    const timing = easingTiming(a.easing);
    if (timing === 'easeBoth') {
      const mid = (a.t + b.t) / 2;
      const vm = sampleKeyframes([a, b], mid)!;
      out.push({ t0: a.t, t1: mid, v0: a.value, v1: vm, timing: { kind: 'cubic', curve: EASE_IN_CURVE } });
      out.push({ t0: mid, t1, v0: vm, v1: b.value, timing: { kind: 'cubic', curve: EASE_OUT_CURVE } });
    } else out.push({ t0: a.t, t1, v0: a.value, v1: b.value, timing });
  }
  constant(Math.max(0, last.t), duration, last.value);
  return out;
}

// ---------------------------------------------------------------------------
// keyframes model (exported for the agreement test)
// ---------------------------------------------------------------------------

/** One `@keyframes` stop. `timing` is the CSS timing function of the segment that STARTS here. */
export interface CssStop {
  /** ms */
  t: number;
  /** Per field (transform group) or the single property's value. */
  values: Record<string, TrackValue>;
  timing: string;
}

export interface CssAnimation {
  name: string;
  layerId: string;
  /** `transform` for the combined group, else the CSS-side property. */
  property: CssTrackProperty;
  /** The element rule's selector (`#<layerId>`, or `#<gradient> > stop:nth-child(n)`). */
  selector: string;
  /** The track property (`gradientStop[1].color`…); absent for the transform group. */
  track?: string;
  /** Motion path: the path (parent space) and orientation, written on the element rule. */
  motion?: { d: string; autoOrient: boolean };
  stops: CssStop[];
}

const timingCss = (t: Timing): string =>
  t.kind === 'linear' ? 'linear' : t.kind === 'steps' ? HOLD_TIMING : `cubic-bezier(${t.curve.map(fmt4).join(',')})`;

function fmt4(n: number): string {
  const r = Math.round(n * 10000) / 10000;
  return String(Object.is(r, -0) ? 0 : r);
}

interface Channel {
  key: string;
  pieces: Piece[];
}

/**
 * Stops for a set of channels (one track, or the transform tracks of a layer)
 * over [0, duration], with the timing rules in the module comment. `sample(t)`
 * gives every channel's value at t (right-continuous, like the sampler).
 */
function buildStops(channels: Channel[], duration: number, sample: (t: number) => Record<string, TrackValue>): CssStop[] {
  const cuts = new Set<number>([0, duration]);
  for (const ch of channels) for (const p of ch.pieces) {
    cuts.add(p.t0);
    cuts.add(p.t1);
  }
  const times = [...cuts].filter((t) => t >= 0 && t <= duration).sort((a, b) => a - b);
  const eps = duration * JUMP_EPSILON;
  const stops: CssStop[] = [];
  for (let i = 0; i + 1 < times.length; i++) {
    const u0 = times[i];
    const u1 = times[i + 1];
    const smooth = new Set<string>();
    let jump = false;
    let bake = false;
    for (const ch of channels) {
      const p = ch.pieces.find((x) => x.t0 <= u0 && u0 < x.t1);
      if (!p || sameValue(p.v0, p.v1)) continue;
      if (p.timing.kind === 'steps') {
        if (p.t1 === u1) jump = true;
        continue;
      }
      if (p.timing.kind === 'linear') smooth.add('linear');
      else if (p.t0 === u0 && p.t1 === u1) smooth.add(timingCss(p.timing));
      else bake = true;
    }
    if (smooth.size > 1) bake = true;
    if (bake) {
      // 60 Hz linear samples; the last one before a jump is its left limit.
      for (let t = u0; t < u1 - eps; t += BAKE_STEP_MS) stops.push({ t, values: sample(t), timing: 'linear' });
      if (jump) stops.push({ t: u1 - eps, values: sample(u1 - eps), timing: HOLD_TIMING });
      continue;
    }
    const only = smooth.size === 1 ? [...smooth][0] : null;
    if (jump && only) {
      stops.push({ t: u0, values: sample(u0), timing: only });
      stops.push({ t: u1 - eps, values: sample(u1 - eps), timing: HOLD_TIMING });
    } else stops.push({ t: u0, values: sample(u0), timing: only ?? (jump ? HOLD_TIMING : 'linear') });
  }
  stops.push({ t: duration, values: sample(duration), timing: 'linear' });
  return stops;
}

const sanitizeName = (s: string) => {
  const r = s.replace(/[^\w-]/g, '_');
  return VECTOR_ID_PATTERN.test(r) ? r : `_${r}`;
};

/** The animations the exporter writes, in document order (tracks with no change are skipped). */
export function buildCssAnimations(doc: VectorDoc): CssAnimation[] {
  const duration = doc.duration;
  if (duration <= 0) return [];
  const { selectable } = cssLayers(doc);
  const tracks = doc.animations.filter((tr) => tr.keyframes.length > 0 && cssPropertyOf(tr.property) !== null);

  // Group: per layer, the transform tracks first, then each other track in document order.
  const order: string[] = [];
  const byLayer = new Map<string, Track[]>();
  for (const tr of tracks) {
    const l = selectable.get(tr.layerId);
    if (!l || l.type === 'raw') continue;
    if (!byLayer.has(tr.layerId)) {
      byLayer.set(tr.layerId, []);
      order.push(tr.layerId);
    }
    byLayer.get(tr.layerId)!.push(tr);
  }

  const taken = new Set<string>();
  const nameFor = (layerId: string, property: string) => {
    const base = sanitizeName(`mm-${layerId}-${property}`);
    let name = base;
    for (let n = 2; taken.has(name); n++) name = `${base}-${n}`;
    taken.add(name);
    return name;
  };
  // First track per animated target wins (preview rule, `advanced.ts`).
  const claimed = new Set<string>();
  const claim = (key: string) => {
    if (claimed.has(key)) return false;
    claimed.add(key);
    return true;
  };

  const out: CssAnimation[] = [];
  for (const layerId of order) {
    const layer = selectable.get(layerId) as AnimatableLayer;
    const own = byLayer.get(layerId)!;
    const tfTracks = own.filter((tr) => isTransformProperty(tr.property));
    if (tfTracks.length > 0) {
      const base = resolveTransform(layer.transform);
      const channels = tfTracks.map((tr) => ({ key: transformField(tr.property as (typeof TRANSFORM_PROPERTIES)[number]), pieces: trackPieces(tr, duration), tr }));
      const sample = (t: number) => {
        const v: Record<string, TrackValue> = { ...base };
        for (const ch of channels) {
          const s = sampleKeyframes(ch.tr.keyframes, t);
          if (typeof s === 'number') v[ch.key] = s;
        }
        return v;
      };
      const stops = buildStops(channels, duration, sample);
      if (!constantStops(stops)) out.push({ name: nameFor(layerId, 'transform'), layerId, property: 'transform', selector: `#${layerId}`, stops });
    }
    for (const tr of own) {
      if (isTransformProperty(tr.property)) continue;
      const prop = cssPropertyOf(tr.property)!;
      let selector = `#${layerId}`;
      let motion: CssAnimation['motion'];
      if (prop === 'stopColor') {
        const g = trackGradient(doc, tr);
        const stop = parseStopProperty(tr.property)!;
        if (!g || stop.index >= g.stops.length || !claim(`stop\u0000${g.id}\u0000${tr.property}`)) continue;
        selector = `#${g.id} > stop:nth-child(${stop.index + 1})`;
      } else if (prop === 'blur') {
        const fid = trackBlurFilter(doc, layerId);
        if (!fid || !claim(`blur\u0000${fid}`)) continue;
      } else if (prop === 'motionPath') {
        const d = motionPathData(doc, tr);
        if (!d || !claim(`motion\u0000${layerId}`)) continue;
        motion = { d, autoOrient: motionExtras(tr).autoOrient === true };
      }
      const sample = (t: number) => ({ [prop]: sampleKeyframes(tr.keyframes, t)! });
      const stops = buildStops([{ key: prop, pieces: trackPieces(tr, duration) }], duration, sample);
      // A motion path places the layer even when it never moves along it.
      if (constantStops(stops) && !motion) continue;
      out.push({ name: nameFor(layerId, tr.property), layerId, property: prop, selector, track: tr.property, ...(motion ? { motion } : {}), stops });
    }
  }
  return out;
}

const constantStops = (stops: CssStop[]) => stops.every((s) => JSON.stringify(s.values) === JSON.stringify(stops[0].values));

// ---------------------------------------------------------------------------
// CSS text
// ---------------------------------------------------------------------------

function pct(t: number, duration: number): string {
  const v = Math.round((t / duration) * 100 * 1e6) / 1e6;
  return `${Object.is(v, -0) ? 0 : v}%`;
}

const px = (n: number) => `${formatNumber(n)}px`;
const deg = (n: number) => `${formatNumber(n)}deg`;

/** Which optional transform functions an animation needs (identical in every stop). */
function transformShape(stops: CssStop[]) {
  const any = (f: (v: VectorTransform) => boolean) => stops.some((s) => f(s.values as unknown as VectorTransform));
  return {
    skew: any((v) => formatNumber(v.skewX) !== '0' || formatNumber(v.skewY) !== '0'),
    anchor: any((v) => formatNumber(v.anchorX) !== '0' || formatNumber(v.anchorY) !== '0'),
  };
}

function transformCss(v: VectorTransform, shape: { skew: boolean; anchor: boolean }): string {
  const parts = [
    `translate(${px(v.x + v.anchorX)}, ${px(v.y + v.anchorY)})`,
    `rotate(${deg(v.rotation)})`,
    ...(shape.skew ? [`skewX(${deg(v.skewX)})`, `skewY(${deg(v.skewY)})`] : []),
    `scale(${formatNumber(v.scaleX)}, ${formatNumber(v.scaleY)})`,
    ...(shape.anchor ? [`translate(${px(-v.anchorX)}, ${px(-v.anchorY)})`] : []),
  ];
  return parts.join(' ');
}

function declaration(a: CssAnimation, stop: CssStop, shape: { skew: boolean; anchor: boolean }): string {
  switch (a.property) {
    case 'transform':
      return `transform: ${transformCss(stop.values as unknown as VectorTransform, shape)}`;
    case 'opacity':
      return `opacity: ${formatNumber(Math.min(1, Math.max(0, stop.values.opacity as number)))}`;
    case 'strokeWidth':
      return `stroke-width: ${px(Math.max(0, stop.values.strokeWidth as number))}`;
    case 'fill':
    case 'stroke':
      return `${a.property}: ${String(stop.values[a.property]).trim()}`;
    case 'strokeDashoffset':
      return `stroke-dashoffset: ${px(stop.values.strokeDashoffset as number)}`;
    case 'motionPath':
      return `offset-distance: ${formatPercent((stop.values.motionPath as number) * 100)}`;
    case 'stopColor':
      return `stop-color: ${String(stop.values.stopColor).trim()}`;
    case 'blur':
      return `filter: blur(${px(Math.max(0, stop.values.blur as number))})`;
  }
}

/** A percentage with up to 4 decimals (offset-distance needs finer steps than 3-decimal user units). */
function formatPercent(n: number): string {
  const r = Math.round(n * 10000) / 10000;
  return `${Object.is(r, -0) ? 0 : r}%`;
}

/** The `<style>` body (CSS), indented for the SVG. */
export function cssText(doc: VectorDoc, animations: CssAnimation[], indent = '    '): string {
  const lines: string[] = [];
  const i1 = indent;
  const i2 = `${indent}  `;
  for (const a of animations) {
    const shape = a.property === 'transform' ? transformShape(a.stops) : { skew: false, anchor: false };
    lines.push(`${i1}@keyframes ${a.name} {`);
    a.stops.forEach((s, i) => {
      // The last stop starts no segment, so it carries no timing function.
      const timing = i === a.stops.length - 1 ? '' : ` animation-timing-function: ${s.timing};`;
      lines.push(`${i2}${pct(s.t, doc.duration)} { ${declaration(a, s, shape)};${timing} }`);
    });
    lines.push(`${i1}}`);
  }
  const bySelector = new Map<string, CssAnimation[]>();
  for (const a of animations) {
    if (!bySelector.has(a.selector)) bySelector.set(a.selector, []);
    bySelector.get(a.selector)!.push(a);
  }
  const iterations = docLoops(doc) ? 'infinite' : '1';
  for (const [selector, list] of bySelector) {
    lines.push(`${i1}${selector} {`);
    lines.push(`${i2}animation-name: ${list.map((a) => a.name).join(', ')};`);
    lines.push(`${i2}animation-duration: ${doc.duration}ms;`);
    lines.push(`${i2}animation-timing-function: linear;`);
    lines.push(`${i2}animation-iteration-count: ${iterations};`);
    lines.push(`${i2}animation-fill-mode: both;`);
    const motion = list.find((a) => a.motion)?.motion;
    if (list.some((a) => a.property === 'transform') || motion) {
      lines.push(`${i2}transform-box: view-box;`);
      lines.push(`${i2}transform-origin: 0 0;`);
    }
    if (motion) {
      lines.push(`${i2}offset-path: path('${motion.d}');`);
      lines.push(`${i2}offset-rotate: ${motion.autoOrient ? 'auto' : '0deg'};`);
    }
    lines.push(`${i1}}`);
  }
  return lines.join('\n');
}

export class CssExportError extends Error {
  readonly issues: CssExportIssue[];
  constructor(issues: CssExportIssue[]) {
    super(`animated SVG (CSS) cannot express: ${issues.map((i) => i.code).join(', ')}`);
    this.name = 'CssExportError';
    this.issues = issues;
  }
}

export interface CssExportOptions {
  /** Anonymous export: the header comment says "made with Media Manipulator" (decision 7). */
  anonymous?: boolean;
}

/**
 * `exportAnimatedSvgCss(doc) → string`. Throws `CssExportError` when
 * `canExportCss(doc)` fails (the dialog checks first).
 */
export function exportAnimatedSvgCss(doc: VectorDoc, opts: CssExportOptions = {}): string {
  const check = canExportCss(doc);
  if (!check.ok) throw new CssExportError(check.issues);
  const animations = buildCssAnimations(doc);
  const header = opts.anonymous ? MADE_WITH_COMMENT : generatedComment();
  // The static markup is frame 0, so a renderer without CSS animation shows the first frame.
  // A motion path is added by `offset-path`, so the markup keeps the layer's own transform.
  const svg = serializeSvg(sampleDoc(withoutMotionTracks(doc), 0));
  if (animations.length === 0) return `${header}\n${svg}`;
  const css = cssText(doc, animations);
  if (/[<&\\]/.test(css)) throw new CssExportError([{ code: 'bad_value' }]);
  const style = `  <style>\n${css}\n  </style>`;
  const nl = svg.indexOf('\n');
  const open = svg.slice(0, nl);
  const rest = svg.slice(nl + 1);
  if (open.endsWith('/>')) return `${header}\n${open.slice(0, -2)}>\n${style}\n</svg>\n`;
  return `${header}\n${open}\n${style}\n${rest}`;
}

/** The document without its motion-path tracks (CSS adds the path offset itself). */
export function withoutMotionTracks(doc: VectorDoc): VectorDoc {
  return doc.animations.some((tr) => tr.property === 'motionPath') ? { ...doc, animations: doc.animations.filter((tr) => tr.property !== 'motionPath') } : doc;
}

/** Suggested download name for an animated SVG. */
export { svgFileName as animatedSvgFileName } from '@/lib/vector/exportSvg';
