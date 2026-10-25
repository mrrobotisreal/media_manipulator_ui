/**
 * The SVG attribute ⇄ `VectorDoc` field map shared by the importer and the
 * exporter. The ORDER of these tables is the exporter's attribute order, so it
 * is part of the canonical output and must not be reshuffled.
 */

export const SVG_NS = 'http://www.w3.org/2000/svg';
export const XLINK_NS = 'http://www.w3.org/1999/xlink';

/** Marks the exporter's background rect (`canvas.background`). */
export const BACKGROUND_ATTR = 'data-vector-background';

export type StyleKind = 'unit' | 'paint' | 'number' | 'positive' | 'dash' | 'ref' | { enum: readonly string[] };

/** Style fields every editable layer carries, in export order. */
export const STYLE_FIELDS = [
  ['fill', 'fill', 'paint'],
  ['fillOpacity', 'fill-opacity', 'unit'],
  ['fillRule', 'fill-rule', { enum: ['nonzero', 'evenodd'] }],
  ['stroke', 'stroke', 'paint'],
  ['strokeWidth', 'stroke-width', 'positive'],
  ['strokeOpacity', 'stroke-opacity', 'unit'],
  ['strokeLinecap', 'stroke-linecap', { enum: ['butt', 'round', 'square'] }],
  ['strokeLinejoin', 'stroke-linejoin', { enum: ['miter', 'round', 'bevel', 'arcs', 'miter-clip'] }],
  ['strokeMiterlimit', 'stroke-miterlimit', 'number'],
  ['strokeDasharray', 'stroke-dasharray', 'dash'],
  ['strokeDashoffset', 'stroke-dashoffset', 'number'],
  ['opacity', 'opacity', 'unit'],
  ['clipRule', 'clip-rule', { enum: ['nonzero', 'evenodd'] }],
  ['mask', 'mask', 'ref'],
  ['clipPath', 'clip-path', 'ref'],
  ['filter', 'filter', 'ref'],
] as const satisfies ReadonlyArray<readonly [string, string, StyleKind]>;

/** Text-only fields, in export order (after x/y, before style). */
export const TEXT_FIELDS = [
  ['fontFamily', 'font-family', 'string'],
  ['fontSize', 'font-size', 'positive'],
  ['fontWeight', 'font-weight', 'string'],
  ['fontStyle', 'font-style', { enum: ['normal', 'italic', 'oblique'] }],
  ['textAnchor', 'text-anchor', { enum: ['start', 'middle', 'end'] }],
  ['letterSpacing', 'letter-spacing', 'number'],
] as const;

/**
 * Presentation / harmless attributes the model does not cover but keeps
 * verbatim in `attrs` (plus `data-*`). Anything else is dropped on import.
 * Never: event handlers, href/src, `style`, `transform-origin`.
 */
export const SAFE_ATTRS = new Set([
  'class',
  'color',
  'display',
  'visibility',
  'paint-order',
  'vector-effect',
  'shape-rendering',
  'text-rendering',
  'image-rendering',
  'color-interpolation',
  'color-interpolation-filters',
  'color-rendering',
  'dominant-baseline',
  'alignment-baseline',
  'baseline-shift',
  'font-family',
  'font-size',
  'font-weight',
  'font-style',
  'font-variant',
  'font-stretch',
  'font-size-adjust',
  'text-anchor',
  'text-decoration',
  'letter-spacing',
  'word-spacing',
  'writing-mode',
  'direction',
  'unicode-bidi',
  'mix-blend-mode',
  'isolation',
  'pathLength',
  'marker-start',
  'marker-mid',
  'marker-end',
  'lengthAdjust',
  'textLength',
  'stroke-dasharray',
  'stroke-width',
  'stroke-dashoffset',
  'stroke-miterlimit',
  'opacity',
  'fill-opacity',
  'stroke-opacity',
]);

/** Map CSS property names from `style=""` to the attribute they stand for. */
export function cssPropToAttr(prop: string): string {
  return prop.trim().toLowerCase();
}
