/**
 * Pure keyframe/track operations on a `VectorDoc` (ticket MM44 decisions 1 and
 * 4). The store wraps each in `mutate`, so every one is a single undo step.
 *
 * Invariants every write keeps (decision 1):
 *   - keyframe `t` is an integer number of ms in [0, doc.duration];
 *   - keyframes are sorted by `t`, at most one per `t` per track
 *     (`normalizeKeyframes` refuses coincident times instead of guessing);
 *   - at most one track per (layerId, property), and a track that loses its
 *     last keyframe is removed;
 *   - tracks never outlive their layer (`pruneTracks`).
 *
 * Operations that cannot keep an invariant return the document unchanged
 * (same reference), which `mutate` treats as "no edit, no history entry".
 */
import { forEachLayer, type Easing, type Keyframe, type Track, type VectorDoc } from '@/lib/vector/vectorTypes';

/** Identifies one keyframe: at most one keyframe per t per track. */
export interface KeyRef {
  layerId: string;
  property: string;
  t: number;
}

/** Copied keyframes, times relative to the earliest copied key. */
export interface KeyClipboard {
  entries: Array<{ layerId: string; property: string; dt: number; value: number | string; easing: Easing }>;
}

export const DEFAULT_EASING: Easing = 'linear';

export const sameKey = (a: KeyRef, b: KeyRef) => a.layerId === b.layerId && a.property === b.property && a.t === b.t;
export const keyId = (r: KeyRef) => `${r.layerId}\u0000${r.property}\u0000${r.t}`;

/** Integer ms in [0, duration]. */
export function clampTime(t: number, duration: number): number {
  if (!Number.isFinite(t)) return 0;
  return Math.min(Math.max(0, Math.round(t)), Math.max(0, Math.round(duration)));
}

/**
 * Sort by t and round t to integer ms. Returns null when two keyframes share
 * a time after rounding (coincident times are rejected on write).
 */
export function normalizeKeyframes(keys: readonly Keyframe[]): Keyframe[] | null {
  const out = keys.map((k) => (Number.isInteger(k.t) && k.t >= 0 ? k : { ...k, t: Math.max(0, Math.round(k.t)) }));
  out.sort((a, b) => a.t - b.t);
  for (let i = 1; i < out.length; i++) if (out[i].t === out[i - 1].t) return null;
  return out;
}

export function trackIndex(doc: VectorDoc, layerId: string, property: string): number {
  return doc.animations.findIndex((tr) => tr.layerId === layerId && tr.property === property);
}

export function findTrack(doc: VectorDoc, layerId: string, property: string): Track | undefined {
  const i = trackIndex(doc, layerId, property);
  return i < 0 ? undefined : doc.animations[i];
}

export function hasTrack(doc: VectorDoc, layerId: string, property: string): boolean {
  return trackIndex(doc, layerId, property) >= 0;
}

export function keyframeAt(doc: VectorDoc, layerId: string, property: string, t: number): Keyframe | undefined {
  return findTrack(doc, layerId, property)?.keyframes.find((k) => k.t === t);
}

/** Replace the track at `i` with `keyframes` (removed when empty). */
function withTrackKeys(doc: VectorDoc, i: number, keyframes: Keyframe[]): VectorDoc {
  const animations = keyframes.length === 0
    ? doc.animations.filter((_, j) => j !== i)
    : doc.animations.map((tr, j) => (j === i ? { ...tr, keyframes } : tr));
  return { ...doc, animations };
}

/**
 * Set the value at time t (creating the track and keyframe when needed). An
 * existing keyframe at t keeps its easing unless `easing` is given.
 */
export function upsertKeyframe(
  doc: VectorDoc,
  layerId: string,
  property: string,
  t: number,
  value: number | string,
  easing?: Easing,
): VectorDoc {
  const time = clampTime(t, doc.duration);
  const i = trackIndex(doc, layerId, property);
  if (i < 0) {
    const track: Track = { layerId, property, keyframes: [{ t: time, value, easing: easing ?? DEFAULT_EASING }] };
    return { ...doc, animations: [...doc.animations, track] };
  }
  const keys = doc.animations[i].keyframes;
  const at = keys.findIndex((k) => k.t === time);
  if (at >= 0) {
    const k = keys[at];
    if (k.value === value && (easing === undefined || easing === k.easing)) return doc;
    const next = keys.map((kf, j) => (j === at ? { ...kf, value, easing: easing ?? kf.easing } : kf));
    return withTrackKeys(doc, i, next);
  }
  const prev = [...keys].reverse().find((k) => k.t < time);
  const next = normalizeKeyframes([...keys, { t: time, value, easing: easing ?? prev?.easing ?? DEFAULT_EASING }]);
  return next ? withTrackKeys(doc, i, next) : doc;
}

/** Remove keyframes; tracks left empty are removed. */
export function removeKeyframes(doc: VectorDoc, refs: readonly KeyRef[]): VectorDoc {
  if (refs.length === 0) return doc;
  const drop = new Set(refs.map(keyId));
  let changed = false;
  const animations: Track[] = [];
  for (const tr of doc.animations) {
    const keyframes = tr.keyframes.filter((k) => !drop.has(keyId({ layerId: tr.layerId, property: tr.property, t: k.t })));
    if (keyframes.length !== tr.keyframes.length) changed = true;
    if (keyframes.length > 0) animations.push(keyframes.length === tr.keyframes.length ? tr : { ...tr, keyframes });
  }
  return changed ? { ...doc, animations } : doc;
}

/** Remove whole tracks (the stopwatch toggle). */
export function removeTrack(doc: VectorDoc, layerId: string, property: string): VectorDoc {
  const i = trackIndex(doc, layerId, property);
  return i < 0 ? doc : { ...doc, animations: doc.animations.filter((_, j) => j !== i) };
}

/**
 * Shift keyframes by `dt` ms (rounded). The shift is clamped so every moved
 * key stays in [0, duration]. A move that would land a key on the time of a
 * key that is not moving is refused (document unchanged).
 */
export function moveKeyframes(doc: VectorDoc, refs: readonly KeyRef[], dt: number): { doc: VectorDoc; refs: KeyRef[] } {
  const moving = new Set(refs.map(keyId));
  const times = refs.map((r) => r.t);
  if (times.length === 0) return { doc, refs: [...refs] };
  const min = Math.min(...times);
  const max = Math.max(...times);
  let d = Math.round(dt);
  if (min + d < 0) d = -min;
  if (max + d > doc.duration) d = doc.duration - max;
  if (d === 0) return { doc, refs: [...refs] };
  const animations: Track[] = [];
  for (const tr of doc.animations) {
    const isMoving = (k: Keyframe) => moving.has(keyId({ layerId: tr.layerId, property: tr.property, t: k.t }));
    if (!tr.keyframes.some(isMoving)) {
      animations.push(tr);
      continue;
    }
    const next = normalizeKeyframes(tr.keyframes.map((k) => (isMoving(k) ? { ...k, t: k.t + d } : k)));
    if (!next) return { doc, refs: [...refs] };
    animations.push({ ...tr, keyframes: next });
  }
  return { doc: { ...doc, animations }, refs: refs.map((r) => ({ ...r, t: r.t + d })) };
}

/** Set the easing of the segments that start at these keyframes. */
export function setKeyframeEasing(doc: VectorDoc, refs: readonly KeyRef[], easing: Easing): VectorDoc {
  const target = new Set(refs.map(keyId));
  let changed = false;
  const animations = doc.animations.map((tr) => {
    let touched = false;
    const keyframes = tr.keyframes.map((k) => {
      if (!target.has(keyId({ layerId: tr.layerId, property: tr.property, t: k.t }))) return k;
      if (JSON.stringify(k.easing) === JSON.stringify(easing)) return k;
      touched = true;
      return { ...k, easing };
    });
    if (!touched) return tr;
    changed = true;
    return { ...tr, keyframes };
  });
  return changed ? { ...doc, animations } : doc;
}

/** Copy keyframes (times relative to the earliest). */
export function copyKeyframes(doc: VectorDoc, refs: readonly KeyRef[]): KeyClipboard {
  const live = refs
    .map((r) => {
      const k = keyframeAt(doc, r.layerId, r.property, r.t);
      return k ? { ...r, value: k.value, easing: k.easing } : null;
    })
    .filter((x): x is KeyRef & { value: number | string; easing: Easing } => x !== null);
  if (live.length === 0) return { entries: [] };
  const t0 = Math.min(...live.map((k) => k.t));
  return { entries: live.map((k) => ({ layerId: k.layerId, property: k.property, dt: k.t - t0, value: k.value, easing: k.easing })) };
}

/**
 * Paste at time `at`. Keys copied from ONE layer paste onto `targetLayerId`
 * when given (copy from one shape, paste onto another); otherwise onto their
 * own layers. Existing keys at the pasted times are replaced; keys that would
 * land after the end, or on a layer that no longer exists, are skipped.
 */
export function pasteKeyframes(
  doc: VectorDoc,
  clip: KeyClipboard,
  at: number,
  targetLayerId?: string,
): { doc: VectorDoc; refs: KeyRef[] } {
  const layers = new Set<string>();
  forEachLayer(doc, (l) => {
    if (l.type !== 'raw') layers.add(l.id);
  });
  const single = new Set(clip.entries.map((e) => e.layerId)).size === 1;
  let out = doc;
  const refs: KeyRef[] = [];
  for (const e of clip.entries) {
    const layerId = single && targetLayerId ? targetLayerId : e.layerId;
    const t = Math.round(at + e.dt);
    if (!layers.has(layerId) || t < 0 || t > doc.duration) continue;
    out = upsertKeyframe(out, layerId, e.property, t, e.value, e.easing);
    refs.push({ layerId, property: e.property, t });
  }
  return { doc: out, refs };
}

/** Drop tracks whose layer no longer exists (or is a raw layer). */
export function pruneTracks(doc: VectorDoc): VectorDoc {
  if (doc.animations.length === 0) return doc;
  const ok = new Set<string>();
  forEachLayer(doc, (l) => {
    if (l.type !== 'raw') ok.add(l.id);
  });
  const animations = doc.animations.filter((tr) => ok.has(tr.layerId));
  return animations.length === doc.animations.length ? doc : { ...doc, animations };
}

/**
 * Change the composition length (integer ms). Keyframes after the new end
 * are removed so no track runs past the end.
 */
export function setDuration(doc: VectorDoc, ms: number): VectorDoc {
  const duration = Math.min(3_600_000, Math.max(0, Math.round(Number.isFinite(ms) ? ms : doc.duration)));
  if (duration === doc.duration) return doc;
  const animations = doc.animations
    .map((tr) => (tr.keyframes.some((k) => k.t > duration) ? { ...tr, keyframes: tr.keyframes.filter((k) => k.t <= duration) } : tr))
    .filter((tr) => tr.keyframes.length > 0);
  return { ...doc, duration, animations };
}

/** Sorted, de-duplicated key times of a layer across its tracks (collapsed-row summary). */
export function layerKeyTimes(doc: VectorDoc, layerId: string, properties?: ReadonlySet<string>): number[] {
  const s = new Set<number>();
  for (const tr of doc.animations) {
    if (tr.layerId !== layerId || (properties && !properties.has(tr.property))) continue;
    for (const k of tr.keyframes) s.add(k.t);
  }
  return [...s].sort((a, b) => a - b);
}

/** Every keyframe of the document as refs (select all). */
export function allKeyRefs(doc: VectorDoc, properties?: ReadonlySet<string>): KeyRef[] {
  const out: KeyRef[] = [];
  for (const tr of doc.animations) {
    if (properties && !properties.has(tr.property)) continue;
    for (const k of tr.keyframes) out.push({ layerId: tr.layerId, property: tr.property, t: k.t });
  }
  return out;
}

/** Refs that still name a keyframe in `doc`. */
export function liveKeyRefs(doc: VectorDoc, refs: readonly KeyRef[]): KeyRef[] {
  const kept = refs.filter((r) => keyframeAt(doc, r.layerId, r.property, r.t) !== undefined);
  return kept.length === refs.length ? (refs as KeyRef[]) : kept;
}
