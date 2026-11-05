/**
 * MM110: Motion's op vocabulary for Medi (design MEDI_ASSISTANT.md §8.4, ADR-0018).
 *
 * The contract between the model, the API and the editor, like `photo.ts`: an `apply_edits`
 * call on the `vector` surface carries a list of these ops; the API validates it against the
 * JSON Schema compiled from this file (`lib/assistant/ops/schema/vector.json`, byte-copied to
 * `media_manipulator_api/internal/assistant/ops/schema/vector.json`) before streaming, and the
 * client validates again before applying them all-or-nothing as one undo step
 * (`applyVectorOps`, `lib/assistant/adapters/vector.ts`).
 *
 * Writers may add ops or optional fields; never remove or rename one without bumping
 * `VECTOR_OPS_SCHEMA_VERSION` (the recipes in `content/medi/recipes/vector/` are validated
 * against this schema).
 *
 * Layer props are a hand-picked, STRICT subset of the document's layer fields (a test checks
 * every key exists on that layer type): the model can draw shapes, text and paths, style them
 * and give them a transform, but it never writes ids, references into `defs` (masks, clip
 * paths, filters, gradients: the animators create those), images or raw markup. SVG enters only
 * through `import_svg`, which runs the editor's own sanitising importer.
 *
 * Every regex here is RE2-compatible (no look-around): the API compiles the same patterns with
 * Go's regexp engine.
 */
import { z } from 'zod/v4';

import { ANIMATOR_IDS } from '@/lib/vector/animators';
import { TEMPLATE_KINDS } from '@/lib/vector/templates';
import { EASING_PRESETS, TRACK_PROPERTY_PATTERN } from '@/lib/vector/vectorTypes';

import { formatIssues } from './photo';

export const VECTOR_OPS_SCHEMA_VERSION = 1;
export const VECTOR_MAX_OPS = 24;
/** Largest SVG `import_svg` accepts (the editor's file import allows 4 MB; a model never needs that). */
export const VECTOR_IMPORT_MAX_CHARS = 200_000;
const MAX_MS = 3_600_000;
const COORD = 100_000;

const defs = z.registry<{ id: string }>();
const named = <T extends z.ZodType>(id: string, s: T): T => {
  defs.add(s, { id });
  return s;
};

/** A plain colour (no `url()`, no escapes): `#hex`, a CSS name, `rgb()/rgba()/hsl()/hsla()`, `none`, `transparent`, `currentColor`. */
export const VECTOR_COLOR_RE = /^(#[0-9A-Fa-f]{3,8}|[A-Za-z]{3,30}|(rgb|rgba|hsl|hsla)\([0-9.,%\s/+-]{1,60}\))$/;
/** Path data characters only (the same set the sampler accepts). */
export const VECTOR_PATH_RE = /^[MmLlHhVvCcSsQqTtAaZz0-9eE.,+\-\s]+$/;
const FONT_RE = /^[A-Za-z0-9 ,_-]{1,100}$/;
const ID_RE = /^[A-Za-z_][A-Za-z0-9_-]*$/;

/** MM114: why this op (4-140 chars), shown beside it in the change card; optional per op, required once per batch (`apply_edits.reason`). */
export const OP_REASON_MIN = 4;
export const OP_REASON_MAX = 140;
const reasonField = named('reason', z.string().min(OP_REASON_MIN).max(OP_REASON_MAX)).optional();

const layerId = named('layer_id', z.string().max(128).regex(ID_RE));
const color = named('color', z.string().min(1).max(80).regex(VECTOR_COLOR_RE));
const unit = named('unit', z.number().min(0).max(1));
const coord = named('coord', z.number().min(-COORD).max(COORD));
const size = z.number().min(0).max(COORD);
const ms = named('ms', z.number().int().min(0).max(MAX_MS));
const easing = named('easing', z.union([z.enum([...EASING_PRESETS, 'hold'] as [string, ...string[]]), z.strictObject({ cubicBezier: z.tuple([z.number().min(0).max(1), z.number().min(-5).max(5), z.number().min(0).max(1), z.number().min(-5).max(5)]) })]));

/** A partial layer transform (the rest stays identity / unchanged). Angles in degrees. */
const transform = named(
  'transform',
  z.strictObject({
    x: coord.optional(),
    y: coord.optional(),
    scaleX: z.number().min(-100).max(100).optional(),
    scaleY: z.number().min(-100).max(100).optional(),
    rotation: z.number().min(-3600).max(3600).optional(),
    skewX: z.number().min(-89).max(89).optional(),
    skewY: z.number().min(-89).max(89).optional(),
    anchorX: coord.optional(),
    anchorY: coord.optional(),
  }),
);

const style = {
  name: z.string().min(1).max(80).optional(),
  hidden: z.boolean().optional(),
  opacity: unit.optional(),
  fill: color.optional(),
  fillOpacity: unit.optional(),
  stroke: color.optional(),
  strokeWidth: z.number().min(0).max(1000).optional(),
  strokeOpacity: unit.optional(),
  strokeLinecap: z.enum(['butt', 'round', 'square']).optional(),
  strokeLinejoin: z.enum(['miter', 'round', 'bevel']).optional(),
  strokeDasharray: z.array(z.number().min(0).max(COORD)).max(16).optional(),
  transform: transform.optional(),
};
const textFields = {
  text: z.string().min(1).max(500),
  fontFamily: z.string().regex(FONT_RE).optional(),
  fontSize: z.number().min(1).max(2000).optional(),
  fontWeight: z.enum(['300', '400', '500', '600', '700', '800', '900', 'normal', 'bold']).optional(),
  fontStyle: z.enum(['normal', 'italic']).optional(),
  textAnchor: z.enum(['start', 'middle', 'end']).optional(),
  letterSpacing: z.number().min(-100).max(100).optional(),
};
const points = z.array(coord).min(4).max(2000);

/** Props of a new layer, per type (geometry required, style optional). */
export const VECTOR_LAYER_PROPS = {
  rect: z.strictObject({ x: coord, y: coord, width: size, height: size, rx: size.optional(), ry: size.optional(), ...style }),
  ellipse: z.strictObject({ cx: coord, cy: coord, rx: size, ry: size, ...style }),
  line: z.strictObject({ x1: coord, y1: coord, x2: coord, y2: coord, ...style }),
  polyline: z.strictObject({ points, ...style }),
  polygon: z.strictObject({ points, ...style }),
  path: z.strictObject({ d: z.string().max(20_000).regex(VECTOR_PATH_RE), ...style }),
  text: z.strictObject({ x: coord, y: coord, ...textFields, ...style }),
  group: z.strictObject({ ...style }),
} as const;
export type VectorNewLayerType = keyof typeof VECTOR_LAYER_PROPS;
export const VECTOR_NEW_LAYER_TYPES = Object.keys(VECTOR_LAYER_PROPS) as VectorNewLayerType[];

/** Every field `update_layer` may patch (checked against the layer's own type at apply time). */
const patch = named(
  'layer_patch',
  z.strictObject({
    x: coord.optional(),
    y: coord.optional(),
    width: size.optional(),
    height: size.optional(),
    rx: size.optional(),
    ry: size.optional(),
    cx: coord.optional(),
    cy: coord.optional(),
    x1: coord.optional(),
    y1: coord.optional(),
    x2: coord.optional(),
    y2: coord.optional(),
    points: points.optional(),
    d: z.string().max(20_000).regex(VECTOR_PATH_RE).optional(),
    ...textFields,
    text: textFields.text.optional(),
    ...style,
    locked: z.boolean().optional(),
  }),
);

const parentId = layerId.optional();

const addLayer = z
  .discriminatedUnion(
    'type',
    VECTOR_NEW_LAYER_TYPES.map((t) => z.strictObject({ op: z.literal('add_layer'), reason: reasonField, type: z.literal(t), props: VECTOR_LAYER_PROPS[t], parentId })) as unknown as [z.ZodObject, z.ZodObject, ...z.ZodObject[]],
  )
  .describe('Add a shape, text, path or empty group on top (or inside the group parentId). Coordinates are canvas user units (viewBox), y down.');

const addText = z
  .strictObject({
    op: z.literal('add_text'), reason: reasonField,
    text: z.string().min(1).max(500),
    x: coord,
    y: coord,
    font: z.string().regex(FONT_RE).optional(),
    size: z.number().min(1).max(2000).optional(),
    weight: textFields.fontWeight,
    fill: color.optional(),
    anchor: z.enum(['start', 'middle', 'end']).optional(),
    parentId,
  })
  .describe('Add one line of text; y is the baseline.');

const importSvg = z
  .strictObject({ op: z.literal('import_svg'), reason: reasonField, markup: z.string().min(10).max(VECTOR_IMPORT_MAX_CHARS), name: z.string().min(1).max(80).optional() })
  .describe('Import SVG markup as a group centred on the canvas (scripts, handlers and external references are stripped by the editor).');

const updateLayer = z.strictObject({ op: z.literal('update_layer'), reason: reasonField, layerId, patch }).describe("Change fields of an existing layer from the digest (only fields its type has).");
const deleteLayer = z.strictObject({ op: z.literal('delete_layer'), reason: reasonField, layerId }).describe('Delete a layer and its tracks (ask first).');

const keyframe = z.strictObject({ t: ms, value: z.union([z.number().min(-1e7).max(1e7), z.string().min(1).max(80)]), easing });
const animate = z
  .strictObject({
    op: z.literal('animate'), reason: reasonField,
    layerId,
    property: z.string().regex(TRACK_PROPERTY_PATTERN),
    keyframes: z.array(keyframe).min(2).max(64),
  })
  .describe('Replace the track of one property with these keyframes (t in ms, increasing, within the duration). The easing belongs to the segment a keyframe starts.');

const span = named('span', z.strictObject({ start: ms, end: ms, easing: easing.optional() }));
const applyAnimator = z
  .strictObject({
    op: z.literal('apply_animator'), reason: reasonField,
    layerIds: z.array(layerId).min(1).max(32),
    animator: z.enum(ANIMATOR_IDS),
    span,
    options: z
      .strictObject({
        pathId: layerId.optional(),
        d: z.string().max(20_000).regex(VECTOR_PATH_RE).optional(),
        autoOrient: z.boolean().optional(),
        targetId: layerId.optional(),
        amount: z.number().min(0).max(200).optional(),
      })
      .optional(),
  })
  .describe('Run a built-in animator: drawOn (outline draws itself), motionPath (options.pathId or options.d), morph (options.targetId), gradient, maskClip (needs an existing mask), blur (options.amount).');

const template = z
  .strictObject({
    op: z.literal('template'), reason: reasonField,
    kind: z.enum(TEMPLATE_KINDS),
    text: z.union([z.string().min(1).max(200), z.array(z.string().min(1).max(200)).min(1).max(8)]).optional(),
    colors: z.array(color).min(1).max(4).optional(),
    at: ms.optional(),
    duration: z.number().int().min(100).max(60_000).optional(),
    value: z.number().min(-1e9).max(1e9).optional(),
    layerIds: z.array(layerId).min(1).max(32).optional(),
  })
  .describe('Add a ready-made animation: lowerThird (text: [name, role]), logoReveal (the logo layers), titlePop, bulletReveal (text: lines), counter (value, text = label), badgeBounce (text: one word). colors: accent first.');

const setDuration = z.strictObject({ op: z.literal('set_duration'), reason: reasonField, ms: z.number().int().min(100).max(MAX_MS) }).describe('Set the composition length (runs before the other ops of the call; keys after the end are removed).');
const setCanvas = z
  .strictObject({
    op: z.literal('set_canvas'), reason: reasonField,
    width: z.number().min(16).max(8192).optional(),
    height: z.number().min(16).max(8192).optional(),
    background: color.optional(),
    fps: z.number().min(1).max(120).optional(),
  })
  .describe('Canvas size (the viewBox follows), background colour and preview fps.');
const setLoop = z.strictObject({ op: z.literal('set_loop'), reason: reasonField, loop: z.boolean() }).describe('Whether the animation repeats.');

export const vectorOpSchema = z.discriminatedUnion('op', [
  addLayer,
  addText,
  importSvg,
  updateLayer,
  deleteLayer,
  animate,
  applyAnimator,
  template,
  setDuration,
  setCanvas,
  setLoop,
] as unknown as [z.ZodObject, z.ZodObject, ...z.ZodObject[]]);

export const vectorOpsSchema = z.array(vectorOpSchema).min(1).max(VECTOR_MAX_OPS);

export const VECTOR_OP_NAMES = ['add_layer', 'add_text', 'import_svg', 'update_layer', 'delete_layer', 'animate', 'apply_animator', 'template', 'set_duration', 'set_canvas', 'set_loop'] as const;
export type VectorOpName = (typeof VECTOR_OP_NAMES)[number];

type Transform = Partial<Record<'x' | 'y' | 'scaleX' | 'scaleY' | 'rotation' | 'skewX' | 'skewY' | 'anchorX' | 'anchorY', number>>;
export type VectorEasingOp = string | { cubicBezier: [number, number, number, number] };
export type VectorOp =
  | { op: 'add_layer'; reason?: string; type: VectorNewLayerType; props: Record<string, unknown> & { transform?: Transform }; parentId?: string }
  | { op: 'add_text'; reason?: string; text: string; x: number; y: number; font?: string; size?: number; weight?: string; fill?: string; anchor?: 'start' | 'middle' | 'end'; parentId?: string }
  | { op: 'import_svg'; reason?: string; markup: string; name?: string }
  | { op: 'update_layer'; reason?: string; layerId: string; patch: Record<string, unknown> & { transform?: Transform } }
  | { op: 'delete_layer'; reason?: string; layerId: string }
  | { op: 'animate'; reason?: string; layerId: string; property: string; keyframes: Array<{ t: number; value: number | string; easing: VectorEasingOp }> }
  | {
      op: 'apply_animator';
      reason?: string;
      layerIds: string[];
      animator: (typeof ANIMATOR_IDS)[number];
      span: { start: number; end: number; easing?: VectorEasingOp };
      options?: { pathId?: string; d?: string; autoOrient?: boolean; targetId?: string; amount?: number };
    }
  | { op: 'template'; reason?: string; kind: (typeof TEMPLATE_KINDS)[number]; text?: string | string[]; colors?: string[]; at?: number; duration?: number; value?: number; layerIds?: string[] }
  | { op: 'set_duration'; reason?: string; ms: number }
  | { op: 'set_canvas'; reason?: string; width?: number; height?: number; background?: string; fps?: number }
  | { op: 'set_loop'; reason?: string; loop: boolean };

/** The JSON Schema the API validates `apply_edits.ops` with (draft 2020-12). */
export function vectorOpsJsonSchema(): Record<string, unknown> {
  const out = z.toJSONSchema(vectorOpsSchema, { target: 'draft-2020-12', metadata: defs, unrepresentable: 'throw' }) as Record<string, unknown>;
  const named = out.$defs as Record<string, Record<string, unknown>> | undefined;
  for (const d of Object.values(named ?? {})) delete d.id;
  return out;
}

/** Human-readable problems of an op list ([] = valid), one line each (the model's retry, the recipe test). */
export function vectorOpsProblems(ops: unknown): string[] {
  const r = vectorOpsSchema.safeParse(ops, { reportInput: true });
  if (r.success) return [];
  return formatIssues(r.error.issues as unknown as Parameters<typeof formatIssues>[0]).map((l) =>
    l.replace(/unknown op (".*?") \(allowed: [^)]*\)/, `unknown op $1 (allowed: ${VECTOR_OP_NAMES.join(', ')})`).replace(/: (".*?"): the model may build only .*$/, ': $1 is not allowed here'),
  );
}
