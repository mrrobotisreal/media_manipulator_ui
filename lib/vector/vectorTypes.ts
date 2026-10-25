import { z } from 'zod';

import { SAFE_ATTRS } from '@/lib/vector/svgMap';

/**
 * `VectorDoc` v1: the Motion editor's document (code name `vector`, design
 * `docs/design/MOTION_SVG_ANIMATOR.md` §3.2, ADR-0012).
 *
 * THE cross-side contract: the Go sanitizer (`internal/vector/doc.go`, MM43)
 * mirrors these schemas, and both sides are tested against the same fixture
 * docs (`lib/vector/fixtures/*.json`, see `fixtures/README.md`).
 *
 * ADDITIVE-ONLY from v1 on (ADR-0004 rule): new fields are optional, nothing is
 * renamed, and an unknown `version` fails to parse. Every object schema here
 * PASSES UNKNOWN KEYS THROUGH, so a document written by a newer build keeps
 * its newer fields when an older build edits and re-saves it.
 *
 * Canonical JSON (`serializeVectorDoc`) is `JSON.stringify(parsed, null, 2)`
 * plus a trailing newline: keys in schema order, optional fields absent when
 * unset (never `null`), no HTML escaping.
 */

// ---------------------------------------------------------------------------
// Limits (mirrored by the Go sanitizer; `VECTOR_MAX_DOC_BYTES` there).
// ---------------------------------------------------------------------------

/** Serialized document cap, and the SVG import cap. */
export const VECTOR_MAX_DOC_BYTES = 4 * 1024 * 1024;
/** Layer-tree nesting cap (groups, masks, clip paths and symbols count). */
export const VECTOR_MAX_DEPTH = 32;
/** Total layers in a document, counting every nested layer. */
export const VECTOR_MAX_LAYERS = 5000;
/** Keyframes per track. */
export const VECTOR_MAX_KEYFRAMES = 2000;
/** One raw layer's markup. */
export const VECTOR_MAX_RAW_BYTES = 1024 * 1024;

/** Every id in a document: a valid XML name subset that needs no escaping. */
export const VECTOR_ID_PATTERN = /^[A-Za-z_][\w-]*$/;

/**
 * Object schema that keeps unknown keys at runtime (additive rule) while its
 * static type stays the strict shape, so code cannot accidentally depend on a
 * key it does not know about.
 */
function obj<T extends z.ZodRawShape>(shape: T): z.ZodObject<T> {
  return z.object(shape).passthrough() as unknown as z.ZodObject<T>;
}

const num = z.number().finite();
const unit = num.min(0).max(1);
export const vectorIdSchema = z.string().max(128).regex(VECTOR_ID_PATTERN);

export const viewBoxSchema = obj({
  x: num,
  y: num,
  width: num.positive(),
  height: num.positive(),
});
export type ViewBox = z.infer<typeof viewBoxSchema>;

/**
 * Layer transform. With `a = (anchorX, anchorY)` (the transform origin, in the
 * layer's own user units), the layer's matrix is
 *
 *   translate(x + anchorX, y + anchorY) · rotate(rotation) · skewX(skewX)
 *     · skewY(skewY) · scale(scaleX, scaleY) · translate(-anchorX, -anchorY)
 *
 * so `x`/`y` are a plain offset (identity at 0) and the anchor is the pivot
 * that rotation, skew and scale act about. Angles are degrees. These field
 * names are the `transform.*` animation property names.
 */
export const transformSchema = obj({
  x: num,
  y: num,
  scaleX: num,
  scaleY: num,
  rotation: num,
  skewX: num,
  skewY: num,
  anchorX: num,
  anchorY: num,
});
export type VectorTransform = z.infer<typeof transformSchema>;

/** SVG affine matrix `[a, b, c, d, e, f]` (gradientTransform, clipPath transform). */
export const matrixSchema = z.tuple([num, num, num, num, num, num]);
export type Matrix = z.infer<typeof matrixSchema>;

/**
 * Colour: `#hex`, a CSS colour keyword or a colour function (`rgb()`,
 * `hsl()`, `color-mix()`…). Strict grammar: no backslash (CSS escapes), no
 * `url(`, no quotes or punctuation that could end a declaration.
 */
export const COLOR_PATTERN = /^(?!.*url\()[#A-Za-z0-9(),.%\s/+-]+$/i;
/**
 * Paint: `none`, `currentColor`, a colour, or `url(#id)` naming a gradient
 * (or an id inside a raw layer) with an optional fallback colour.
 */
export const PAINT_PATTERN = /^(url\(\s*#[A-Za-z_][\w-]*\s*\)(\s+(?!.*url\()[#A-Za-z0-9(),.%\s/+-]+)?|(?!.*url\()[#A-Za-z0-9(),.%\s/+-]+)$/i;
export const isSafePaint = (v: string) => v.length <= 256 && PAINT_PATTERN.test(v.trim());
export const isSafeColor = (v: string) => v.length <= 128 && COLOR_PATTERN.test(v.trim());
export const paintSchema = z.string().min(1).max(256).refine(isSafePaint, { message: 'invalid paint' });
export const colorSchema = z.string().min(1).max(128).refine(isSafeColor, { message: 'invalid colour' });

/**
 * Unmodelled-but-safe SVG presentation attributes (`paint-order`,
 * `vector-effect`, `font-variant`, `data-*`, ...), exported verbatim in key
 * order. Never event handlers, hrefs, `style`, or values that could reach the
 * network or run script.
 */
const UNSAFE_ATTR_VALUE = /javascript:|vbscript:|@import|expression\(|image-set\(|\\|url\(\s*['"]?(?!#)/i;
/** True when `name` may appear in `attrs`: the `SAFE_ATTRS` allowlist or `data-*`. */
export const isAllowedAttrName = (name: string) =>
  SAFE_ATTRS.has(name) || /^data-[a-z0-9-]+$/.test(name);
export const isSafeAttrValue = (v: string) => v.length <= 4096 && !UNSAFE_ATTR_VALUE.test(v);
export const attrsSchema = z
  .record(z.string().regex(/^[a-z][a-zA-Z0-9-]*$/), z.string().max(4096))
  .refine((a) => Object.entries(a).every(([k, v]) => isAllowedAttrName(k) && isSafeAttrValue(v)), {
    message: 'attrs may only carry allow-listed presentation attributes with safe values',
  });

const styleShape = {
  opacity: unit.optional(),
  fill: paintSchema.optional(),
  fillOpacity: unit.optional(),
  fillRule: z.enum(['nonzero', 'evenodd']).optional(),
  stroke: paintSchema.optional(),
  strokeWidth: num.min(0).optional(),
  strokeOpacity: unit.optional(),
  strokeLinecap: z.enum(['butt', 'round', 'square']).optional(),
  strokeLinejoin: z.enum(['miter', 'round', 'bevel', 'arcs', 'miter-clip']).optional(),
  strokeMiterlimit: num.min(1).optional(),
  strokeDasharray: z.array(num.min(0)).max(64).optional(),
  strokeDashoffset: num.optional(),
  clipRule: z.enum(['nonzero', 'evenodd']).optional(),
  /** Id of a `defs.masks` entry (or of an id inside a raw layer). */
  mask: vectorIdSchema.optional(),
  /** Id of a `defs.clipPaths` entry (or of an id inside a raw layer). */
  clipPath: vectorIdSchema.optional(),
  /** Id of a `defs.filters` entry (or of an id inside a raw layer). */
  filter: vectorIdSchema.optional(),
};

const headShape = {
  id: vectorIdSchema,
  /** Layer-panel name; exported as `data-name`. */
  name: z.string().max(200).optional(),
  /** Hidden in the editor; exported as `display="none"`. */
  hidden: z.boolean().optional(),
  /** Not selectable or editable on the canvas. Editor-only, never exported. */
  locked: z.boolean().optional(),
};

const tailShape = {
  ...styleShape,
  /** Absent = identity. */
  transform: transformSchema.optional(),
  attrs: attrsSchema.optional(),
};

export const rectLayerSchema = obj({
  type: z.literal('rect'),
  ...headShape,
  x: num,
  y: num,
  width: num.min(0),
  height: num.min(0),
  /** Corner radius; absent = 0. */
  rx: num.min(0).optional(),
  /** Absent = rx (SVG auto). */
  ry: num.min(0).optional(),
  ...tailShape,
});
export type RectLayer = z.infer<typeof rectLayerSchema>;

/** `<ellipse>`; exported as `<circle>` when rx === ry. */
export const ellipseLayerSchema = obj({
  type: z.literal('ellipse'),
  ...headShape,
  cx: num,
  cy: num,
  rx: num.min(0),
  ry: num.min(0),
  ...tailShape,
});
export type EllipseLayer = z.infer<typeof ellipseLayerSchema>;

export const lineLayerSchema = obj({
  type: z.literal('line'),
  ...headShape,
  x1: num,
  y1: num,
  x2: num,
  y2: num,
  ...tailShape,
});
export type LineLayer = z.infer<typeof lineLayerSchema>;

/** Flat `[x0, y0, x1, y1, ...]`. */
const pointsSchema = z
  .array(num)
  .max(200_000)
  .refine((p) => p.length % 2 === 0, { message: 'points must hold x,y pairs' });

export const polylineLayerSchema = obj({
  type: z.literal('polyline'),
  ...headShape,
  points: pointsSchema,
  ...tailShape,
});
export type PolylineLayer = z.infer<typeof polylineLayerSchema>;

export const polygonLayerSchema = obj({
  type: z.literal('polygon'),
  ...headShape,
  points: pointsSchema,
  ...tailShape,
});
export type PolygonLayer = z.infer<typeof polygonLayerSchema>;

/** Path data in canonical form (`lib/vector/pathData.ts` `normalizePath`). */
export const pathLayerSchema = obj({
  type: z.literal('path'),
  ...headShape,
  d: z.string().max(2_000_000),
  ...tailShape,
});
export type PathLayer = z.infer<typeof pathLayerSchema>;

/** Single-line text in v1 (multi-line `<tspan>` text imports as a raw layer). */
export const textLayerSchema = obj({
  type: z.literal('text'),
  ...headShape,
  x: num,
  y: num,
  text: z.string().max(10_000),
  fontFamily: z.string().max(256).optional(),
  fontSize: num.positive().optional(),
  fontWeight: z.string().max(32).optional(),
  fontStyle: z.enum(['normal', 'italic', 'oblique']).optional(),
  textAnchor: z.enum(['start', 'middle', 'end']).optional(),
  letterSpacing: num.optional(),
  ...tailShape,
});
export type TextLayer = z.infer<typeof textLayerSchema>;

/**
 * Raster image. `href` is a `data:image/(png|jpeg|gif|webp|avif);base64,`
 * URI or an asset reference `asset:<id>` (resolved by MM44+); external URLs
 * never enter the model.
 */
export const IMAGE_HREF_PATTERN = /^(data:image\/(png|jpeg|gif|webp|avif);base64,[A-Za-z0-9+/=\s]*|asset:[A-Za-z0-9_-]{1,128})$/;
export const imageLayerSchema = obj({
  type: z.literal('image'),
  ...headShape,
  x: num,
  y: num,
  width: num.min(0),
  height: num.min(0),
  href: z.string().max(VECTOR_MAX_DOC_BYTES).regex(IMAGE_HREF_PATTERN),
  preserveAspectRatio: z.string().max(64).optional(),
  ...tailShape,
});
export type ImageLayer = z.infer<typeof imageLayerSchema>;

/** `<use>`: `ref` is the bare id of a symbol, a layer, or an id inside a raw layer. */
export const useLayerSchema = obj({
  type: z.literal('use'),
  ...headShape,
  ref: vectorIdSchema,
  x: num.optional(),
  y: num.optional(),
  width: num.min(0).optional(),
  height: num.min(0).optional(),
  ...tailShape,
});
export type UseLayer = z.infer<typeof useLayerSchema>;

/**
 * Opaque markup the model does not cover (filters beyond blur,
 * `foreignObject`, `switch`, SMIL, un-inlinable `<style>`, multi-line text,
 * patterns, markers, ...). Round-trips byte-stable, is not editable, and has
 * already been stripped of scripts, event handlers and external references.
 * `ids` lists the element ids declared inside `markup`, so paint/mask/use
 * references to them resolve.
 */
export const rawLayerSchema = obj({
  type: z.literal('raw'),
  id: vectorIdSchema,
  name: z.string().max(200).optional(),
  markup: z.string().max(VECTOR_MAX_RAW_BYTES),
  ids: z.array(vectorIdSchema).max(VECTOR_MAX_LAYERS).optional(),
});
export type RawLayer = z.infer<typeof rawLayerSchema>;

const groupLayerBase = obj({
  type: z.literal('group'),
  ...headShape,
  ...tailShape,
});
export type GroupLayer = z.infer<typeof groupLayerBase> & { children: Layer[] };

export type Layer =
  | GroupLayer
  | PathLayer
  | RectLayer
  | EllipseLayer
  | LineLayer
  | PolylineLayer
  | PolygonLayer
  | TextLayer
  | ImageLayer
  | UseLayer
  | RawLayer;
export type LayerType = Layer['type'];

export const groupLayerSchema = groupLayerBase.extend({
  children: z.lazy((): z.ZodType<Layer[], z.ZodTypeDef, unknown> => z.array(layerSchema)),
});

export const layerSchema: z.ZodType<Layer, z.ZodTypeDef, unknown> = z.discriminatedUnion('type', [
  groupLayerSchema,
  pathLayerSchema,
  rectLayerSchema,
  ellipseLayerSchema,
  lineLayerSchema,
  polylineLayerSchema,
  polygonLayerSchema,
  textLayerSchema,
  imageLayerSchema,
  useLayerSchema,
  rawLayerSchema,
]);

/** Layers the editor can transform and style (everything but `raw`). */
export type EditableLayer = Exclude<Layer, RawLayer>;
/** Layers with geometry and no children. */
export type ShapeLayer = Exclude<Layer, RawLayer | GroupLayer>;

// ---------------------------------------------------------------------------
// defs
// ---------------------------------------------------------------------------

export const gradientStopSchema = obj({
  /** 0..1, non-decreasing within a gradient. */
  offset: unit,
  color: colorSchema,
  /** Absent = 1. */
  opacity: unit.optional(),
});
export type GradientStop = z.infer<typeof gradientStopSchema>;

const gradientUnits = z.enum(['objectBoundingBox', 'userSpaceOnUse']);
const spreadMethod = z.enum(['pad', 'reflect', 'repeat']);

/** Coordinates are fractions of the bounding box unless `units` is userSpaceOnUse. */
export const linearGradientSchema = obj({
  type: z.literal('linear'),
  id: vectorIdSchema,
  /** Absent = objectBoundingBox. */
  units: gradientUnits.optional(),
  x1: num,
  y1: num,
  x2: num,
  y2: num,
  stops: z.array(gradientStopSchema).max(256),
  spreadMethod: spreadMethod.optional(),
  gradientTransform: matrixSchema.optional(),
});
export type LinearGradient = z.infer<typeof linearGradientSchema>;

export const radialGradientSchema = obj({
  type: z.literal('radial'),
  id: vectorIdSchema,
  units: gradientUnits.optional(),
  cx: num,
  cy: num,
  r: num.min(0),
  /** Absent = cx / cy. */
  fx: num.optional(),
  fy: num.optional(),
  fr: num.min(0).optional(),
  stops: z.array(gradientStopSchema).max(256),
  spreadMethod: spreadMethod.optional(),
  gradientTransform: matrixSchema.optional(),
});
export type RadialGradient = z.infer<typeof radialGradientSchema>;

export const gradientSchema = z.discriminatedUnion('type', [linearGradientSchema, radialGradientSchema]);
export type Gradient = z.infer<typeof gradientSchema>;

export const maskSchema = obj({
  id: vectorIdSchema,
  /** maskUnits; absent = objectBoundingBox. */
  units: gradientUnits.optional(),
  /** maskContentUnits; absent = userSpaceOnUse. */
  contentUnits: gradientUnits.optional(),
  /** Mask region; absent = the SVG defaults (-10% / 120%). */
  x: num.optional(),
  y: num.optional(),
  width: num.optional(),
  height: num.optional(),
  layers: z.array(layerSchema),
});
export type VectorMask = z.infer<typeof maskSchema>;

export const clipPathSchema = obj({
  id: vectorIdSchema,
  /** clipPathUnits; absent = userSpaceOnUse. */
  units: gradientUnits.optional(),
  transform: matrixSchema.optional(),
  /** Shapes, text and `use` only (SVG forbids groups inside clipPath). */
  layers: z.array(layerSchema),
});
export type VectorClipPath = z.infer<typeof clipPathSchema>;

const filterRegion = z.string().regex(/^-?(\d+\.?\d*|\.\d+)%?$/).optional();
/** Only a single Gaussian blur is modelled (`filter.blur`); other filters import as raw layers. */
export const blurFilterSchema = obj({
  type: z.literal('blur'),
  id: vectorIdSchema,
  stdDeviation: num.min(0),
  x: filterRegion,
  y: filterRegion,
  width: filterRegion,
  height: filterRegion,
});
export const filterSchema = z.discriminatedUnion('type', [blurFilterSchema]);
export type VectorFilter = z.infer<typeof filterSchema>;

export const symbolSchema = obj({
  id: vectorIdSchema,
  viewBox: viewBoxSchema.optional(),
  preserveAspectRatio: z.string().max(64).optional(),
  layers: z.array(layerSchema),
});
export type VectorSymbol = z.infer<typeof symbolSchema>;

export const defsSchema = obj({
  gradients: z.array(gradientSchema).default([]),
  masks: z.array(maskSchema).default([]),
  clipPaths: z.array(clipPathSchema).default([]),
  filters: z.array(filterSchema).default([]),
  symbols: z.array(symbolSchema).default([]),
});
export type VectorDefs = z.infer<typeof defsSchema>;

// ---------------------------------------------------------------------------
// animations (defined in full for v1; MM42 never creates tracks)
// ---------------------------------------------------------------------------

export const EASING_PRESETS = ['linear', 'easeIn', 'easeOut', 'easeBoth'] as const;
/** Darkroom's preset curves (`lib/studio/ease.ts`), `hold`, or a CSS cubic-bezier. */
export const easingSchema = z.union([
  z.enum([...EASING_PRESETS, 'hold']),
  obj({ cubicBezier: z.tuple([unit, num, unit, num]) }),
]);
export type Easing = z.infer<typeof easingSchema>;

export const keyframeSchema = obj({
  /** Milliseconds from the start of the composition. */
  t: num.min(0),
  /** Number for numeric properties; string for colours and path data. */
  value: z.union([num, z.string().max(2_000_000)]),
  /** Ease of the segment that STARTS at this keyframe. */
  easing: easingSchema,
});
export type Keyframe = z.infer<typeof keyframeSchema>;

/** The animatable properties (§3.2); `gradientStop[i]` indexes the layer's gradient stops. */
export const TRACK_PROPERTY_PATTERN =
  /^(transform\.(x|y|scaleX|scaleY|rotation|skewX|skewY|anchorX|anchorY)|opacity|fill|stroke|strokeWidth|strokeDashoffset|d|gradientStop\[(0|[1-9]\d{0,2})\]\.(color|offset)|mask|clipPath|filter\.blur|motionPath)$/;

export const trackSchema = obj({
  layerId: vectorIdSchema,
  property: z.string().regex(TRACK_PROPERTY_PATTERN),
  keyframes: z.array(keyframeSchema).max(VECTOR_MAX_KEYFRAMES),
  /** Property-specific settings (e.g. motionPath `{pathId|d, autoOrient}`). */
  extras: z.record(z.string(), z.unknown()).optional(),
});
export type Track = z.infer<typeof trackSchema>;

// ---------------------------------------------------------------------------
// document
// ---------------------------------------------------------------------------

/** Proposed defaults (design §7): 512×512, transparent, 3 s, 24 fps preview. */
export const DEFAULT_CANVAS_SIZE = 512;
export const DEFAULT_BACKGROUND = 'transparent';
export const DEFAULT_DURATION_MS = 3000;
export const DEFAULT_FPS = 24;

export const canvasSchema = obj({
  width: num.positive().default(DEFAULT_CANVAS_SIZE),
  height: num.positive().default(DEFAULT_CANVAS_SIZE),
  /** Absent on input = `0 0 width height`. Always present on output. */
  viewBox: viewBoxSchema.optional(),
  background: colorSchema.default(DEFAULT_BACKGROUND),
}).transform(({ width, height, viewBox, background, ...rest }) => ({
  width,
  height,
  viewBox: viewBox ?? { x: 0, y: 0, width, height },
  background,
  ...rest,
}));
export type VectorCanvas = z.output<typeof canvasSchema>;

const docShape = obj({
  version: z.literal(1),
  canvas: canvasSchema.default({}),
  /** Composition length, ms. */
  duration: z.number().int().min(0).max(3_600_000).default(DEFAULT_DURATION_MS),
  /** Preview frame rate only; exporters choose their own. */
  fps: num.positive().max(120).default(DEFAULT_FPS),
  layers: z.array(layerSchema).default([]),
  defs: defsSchema.default({}),
  animations: z.array(trackSchema).default([]),
  /**
   * MM44 (additive, optional): whether the animation repeats. Absent = loops
   * (`docLoops`). Drives the CSS export's `animation-iteration-count` and the
   * preview's loop toggle.
   */
  loop: z.boolean().optional(),
});

/** Absent `loop` means the animation repeats. */
export const docLoops = (doc: Pick<VectorDoc, 'loop'>): boolean => doc.loop !== false;

export const vectorDocSchema = docShape.superRefine((doc, ctx) => {
  for (const message of docIntegrityIssues(doc as VectorDoc)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message });
  }
});
export type VectorDoc = z.output<typeof docShape>;
export type VectorDocInput = z.input<typeof docShape>;

// ---------------------------------------------------------------------------
// integrity (ids, references, limits) — the Go sanitizer applies the same rules
// ---------------------------------------------------------------------------

const PAINT_URL = /^url\(\s*#([^)\s]+)\s*\)(?:\s+[^\s()]+)?$/;

/** The gradient/raw id a paint references, or null for a plain colour. */
export function paintRef(paint: string | undefined): string | null {
  if (!paint) return null;
  const m = PAINT_URL.exec(paint.trim());
  return m ? m[1] : null;
}

/**
 * Problems a raw layer's markup must never carry (UI strips them on import;
 * the Go sanitizer rejects). Raw markup is canonical `XMLSerializer` output,
 * so anything a serializer never produces (CDATA, numeric/named entities other
 * than the five XML escapes and the whitespace char refs, unquoted
 * attributes) is rejected outright: those are how parser differentials hide
 * payloads.
 */
export function rawMarkupIssues(markup: string): string[] {
  const issues: string[] = [];
  if (/<\s*script/i.test(markup)) issues.push('script element');
  if (/<\s*\/?\s*(iframe|object|embed|frame|frameset|applet|meta|link|base|form|input|button|textarea|select|template|noscript|portal|style)\b/i.test(markup)) {
    issues.push('forbidden element');
  }
  if (/<!\[CDATA\[|<!--|<\?|<!DOCTYPE|<!ENTITY/i.test(markup)) issues.push('CDATA, comment or declaration');
  if (/&(?!(amp|lt|gt|quot|apos|#9|#10|#13|#xA|#xD|#x9);)/i.test(markup)) issues.push('character reference');
  if (/[\s"'/]on[a-z]+\s*=/i.test(markup)) issues.push('event-handler attribute');
  if (/\b(srcdoc|formaction|srcset|ping|background)\s*=/i.test(markup)) issues.push('dangerous attribute');
  if (/javascript:|vbscript:|data:text\/html/i.test(markup)) issues.push('script URL');
  if (/\s[\w:-]+\s*=\s*(?!["'])/.test(markup)) issues.push('unquoted attribute');
  if (/(?:^|[\s"'])(?:xlink:)?(?:href|src)\s*=\s*["'](?!#|data:image\/(?:png|jpeg|gif|webp|avif);)/i.test(markup)) {
    issues.push('external reference');
  }
  if (/attributeName\s*=\s*["']\s*(xlink:)?href/i.test(markup)) issues.push('animated href');
  if (/url\(\s*["']?(?!#)/i.test(markup) || /image-set\(/i.test(markup)) issues.push('external url()');
  if (/@import/i.test(markup)) issues.push('@import');
  if (/=\s*"[^"]*\\|=\s*'[^']*\\/.test(markup)) issues.push('backslash in attribute');
  return issues;
}

type Visit = (layer: Layer, depth: number) => void;

function walkLayers(layers: Layer[], depth: number, visit: Visit): void {
  for (const layer of layers) {
    visit(layer, depth);
    if (layer.type === 'group') walkLayers(layer.children, depth + 1, visit);
  }
}

/** Visit every layer in the document: the tree, mask/clip contents and symbols. */
export function forEachLayer(doc: Pick<VectorDoc, 'layers' | 'defs'>, visit: Visit): void {
  walkLayers(doc.layers, 1, visit);
  for (const m of doc.defs.masks) walkLayers(m.layers, 2, visit);
  for (const c of doc.defs.clipPaths) walkLayers(c.layers, 2, visit);
  for (const s of doc.defs.symbols) walkLayers(s.layers, 2, visit);
}

/**
 * Document-level rules a per-field schema cannot express: unique ids,
 * resolvable references, no `use` cycles, tracks on existing layers, raw
 * markup hygiene, and the depth/size caps. Returns human-readable issues.
 */
export function docIntegrityIssues(doc: VectorDoc): string[] {
  const issues: string[] = [];
  const seen = new Set<string>();
  const claim = (id: string, what: string) => {
    if (seen.has(id)) issues.push(`duplicate id "${id}" (${what})`);
    seen.add(id);
  };
  const layerIds = new Set<string>();
  const rawIds = new Set<string>();
  let count = 0;

  forEachLayer(doc, (layer, depth) => {
    count += 1;
    if (depth > VECTOR_MAX_DEPTH) issues.push(`layer "${layer.id}" nests deeper than ${VECTOR_MAX_DEPTH}`);
    claim(layer.id, 'layer');
    layerIds.add(layer.id);
    if (layer.type === 'raw') {
      for (const id of layer.ids ?? []) {
        claim(id, 'raw markup');
        rawIds.add(id);
      }
      for (const problem of rawMarkupIssues(layer.markup)) issues.push(`raw layer "${layer.id}": ${problem}`);
    }
  });
  if (count > VECTOR_MAX_LAYERS) issues.push(`more than ${VECTOR_MAX_LAYERS} layers`);

  const gradientIds = new Set(doc.defs.gradients.map((g) => g.id));
  const maskIds = new Set(doc.defs.masks.map((m) => m.id));
  const clipIds = new Set(doc.defs.clipPaths.map((c) => c.id));
  const filterIds = new Set(doc.defs.filters.map((f) => f.id));
  const symbolIds = new Set(doc.defs.symbols.map((s) => s.id));
  for (const id of gradientIds) claim(id, 'gradient');
  for (const id of maskIds) claim(id, 'mask');
  for (const id of clipIds) claim(id, 'clipPath');
  for (const id of filterIds) claim(id, 'filter');
  for (const id of symbolIds) claim(id, 'symbol');

  const resolves = (id: string, bucket: Set<string>) => bucket.has(id) || rawIds.has(id);

  forEachLayer(doc, (layer) => {
    if (layer.type === 'raw') return;
    for (const key of ['fill', 'stroke'] as const) {
      const paint = layer[key];
      if (paint === undefined) continue;
      if (/url\(/i.test(paint)) {
        const ref = paintRef(paint);
        if (!ref) issues.push(`layer "${layer.id}" ${key} has a non-local url()`);
        else if (!resolves(ref, gradientIds)) issues.push(`layer "${layer.id}" ${key} references missing "${ref}"`);
      }
    }
    if (layer.mask && !resolves(layer.mask, maskIds)) issues.push(`layer "${layer.id}" mask references missing "${layer.mask}"`);
    if (layer.clipPath && !resolves(layer.clipPath, clipIds)) {
      issues.push(`layer "${layer.id}" clipPath references missing "${layer.clipPath}"`);
    }
    if (layer.filter && !resolves(layer.filter, filterIds)) {
      issues.push(`layer "${layer.id}" filter references missing "${layer.filter}"`);
    }
    if (layer.type === 'use' && !symbolIds.has(layer.ref) && !layerIds.has(layer.ref) && !rawIds.has(layer.ref)) {
      issues.push(`use "${layer.id}" references missing "${layer.ref}"`);
    }
  });

  if (hasUseCycle(doc)) issues.push('a use element references itself or an ancestor');

  for (const track of doc.animations) {
    if (!layerIds.has(track.layerId)) issues.push(`track references missing layer "${track.layerId}"`);
  }
  return issues;
}

/**
 * Directed graph: container → child (structure) and use → ref. The structural
 * edges form a forest, so any cycle runs through a `use` that (transitively)
 * instantiates itself.
 */
function hasUseCycle(doc: VectorDoc): boolean {
  const edges = new Map<string, string[]>();
  const add = (from: string, to: string) => {
    const list = edges.get(from);
    if (list) list.push(to);
    else edges.set(from, [to]);
  };
  const link = (parent: string, layers: Layer[]) => {
    for (const layer of layers) {
      add(parent, layer.id);
      if (layer.type === 'group') link(layer.id, layer.children);
      if (layer.type === 'use') add(layer.id, layer.ref);
    }
  };
  for (const s of doc.defs.symbols) link(s.id, s.layers);
  for (const m of doc.defs.masks) link(m.id, m.layers);
  for (const c of doc.defs.clipPaths) link(c.id, c.layers);
  link('\u0000root', doc.layers);

  const state = new Map<string, 1 | 2>(); // 1 = on stack, 2 = done
  const visit = (node: string): boolean => {
    const s = state.get(node);
    if (s === 1) return true;
    if (s === 2) return false;
    state.set(node, 1);
    for (const next of edges.get(node) ?? []) if (visit(next)) return true;
    state.set(node, 2);
    return false;
  };
  for (const node of edges.keys()) if (visit(node)) return true;
  return false;
}

// ---------------------------------------------------------------------------
// parse / serialize
// ---------------------------------------------------------------------------

export type ParseResult = { ok: true; doc: VectorDoc } | { ok: false; error: string };

/** Parse an unknown value (or JSON text) into a `VectorDoc`. Never throws. */
export function parseVectorDoc(input: unknown): ParseResult {
  let value = input;
  if (typeof input === 'string') {
    if (input.length > VECTOR_MAX_DOC_BYTES) return { ok: false, error: 'document too large' };
    try {
      value = JSON.parse(input);
    } catch {
      return { ok: false, error: 'invalid JSON' };
    }
  }
  const parsed = vectorDocSchema.safeParse(value);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    const where = first?.path.length ? ` at ${first.path.join('.')}` : '';
    return { ok: false, error: `${first?.message ?? 'invalid document'}${where}` };
  }
  return { ok: true, doc: parsed.data };
}

/** Canonical JSON text (the fixture format): schema key order, 2-space indent, trailing newline. */
export function serializeVectorDoc(doc: VectorDoc): string {
  return `${JSON.stringify(doc, null, 2)}\n`;
}
