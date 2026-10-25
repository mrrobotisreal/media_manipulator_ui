/**
 * The animatable properties the MM44 timeline edits (ticket decision 1), and
 * how each one reads from and writes to a layer.
 *
 * `transform.*` map onto the layer's `transform` fields (identity defaults),
 * `opacity` / `strokeWidth` are numbers, `fill` / `stroke` are paints. The
 * advanced properties of §3.2 (`strokeDashoffset`, `d`, gradient stops,
 * mask/clip, blur, motion path) are MM45: the schema accepts them, but the
 * UI hides them, the preview ignores them and `canExportCss` refuses them.
 */
import { resolveTransform } from '@/lib/vector/geometry';
import { isSafePaint, type Layer, type VectorTransform } from '@/lib/vector/vectorTypes';

export const TRANSFORM_PROPERTIES = [
  'transform.x',
  'transform.y',
  'transform.scaleX',
  'transform.scaleY',
  'transform.rotation',
  'transform.skewX',
  'transform.skewY',
  'transform.anchorX',
  'transform.anchorY',
] as const;

export const EDITABLE_PROPERTIES = [...TRANSFORM_PROPERTIES, 'opacity', 'fill', 'stroke', 'strokeWidth'] as const;
export type EditableProperty = (typeof EDITABLE_PROPERTIES)[number];
export type TransformProperty = (typeof TRANSFORM_PROPERTIES)[number];
export type TransformField = keyof VectorTransform;

const EDITABLE = new Set<string>(EDITABLE_PROPERTIES);

export const isEditableProperty = (p: string): p is EditableProperty => EDITABLE.has(p);
export const isTransformProperty = (p: string): p is TransformProperty => p.startsWith('transform.') && EDITABLE.has(p);
export const isPaintProperty = (p: string): p is 'fill' | 'stroke' => p === 'fill' || p === 'stroke';

/** `transform.rotation` → `rotation`. */
export const transformField = (p: TransformProperty): TransformField => p.slice('transform.'.length) as TransformField;

/** A layer that can carry editable tracks (raw layers cannot). */
export type AnimatableLayer = Exclude<Layer, { type: 'raw' }>;
export const isAnimatable = (l: Layer | undefined): l is AnimatableLayer => !!l && l.type !== 'raw';

/** The value a property has on the static layer (SVG defaults when unset). */
export function baseValue(layer: AnimatableLayer, p: EditableProperty): number | string {
  if (isTransformProperty(p)) return resolveTransform(layer.transform)[transformField(p)];
  switch (p) {
    case 'opacity':
      return layer.opacity ?? 1;
    case 'strokeWidth':
      return layer.strokeWidth ?? 1;
    case 'fill':
      // SVG's initial fill is black; a line has no fill to show.
      return layer.fill ?? (layer.type === 'line' ? 'none' : '#000000');
    case 'stroke':
      return layer.stroke ?? 'none';
  }
}

/**
 * Write `value` into the layer. Values of the wrong kind, non-finite numbers
 * and unsafe paints (a keyframe string the paint grammar refuses) leave the
 * layer unchanged, so a hostile document can never reach the renderer.
 */
export function withValue(layer: AnimatableLayer, p: EditableProperty, value: number | string): AnimatableLayer {
  if (isPaintProperty(p)) {
    if (typeof value !== 'string' || !isSafePaint(value)) return layer;
    return layer[p] === value ? layer : ({ ...layer, [p]: value } as AnimatableLayer);
  }
  if (typeof value !== 'number' || !Number.isFinite(value)) return layer;
  if (isTransformProperty(p)) {
    const field = transformField(p);
    const tf = resolveTransform(layer.transform);
    return tf[field] === value && layer.transform ? layer : { ...layer, transform: { ...tf, [field]: value } };
  }
  const v = p === 'opacity' ? Math.min(1, Math.max(0, value)) : Math.max(0, value);
  return layer[p] === v ? layer : ({ ...layer, [p]: v } as AnimatableLayer);
}
