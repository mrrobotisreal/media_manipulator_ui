/**
 * MM108: Aperture's op vocabulary for Medi (design MEDI_ASSISTANT.md §8.4, ADR-0018).
 *
 * THE contract between the model, the API and the editor. The model never writes a document:
 * an `apply_edits` call carries a list of these ops, which the API validates against the JSON
 * Schema compiled from this file (`lib/assistant/ops/schema/photo.json`, byte-copied to
 * `media_manipulator_api/internal/assistant/ops/schema/photo.json`) before streaming, and the
 * client validates again here before applying them all-or-nothing as one undo step
 * (`applyPhotoOps`, `lib/assistant/adapters/photo.ts`).
 *
 * Writers may add ops or optional fields; never remove or rename one without bumping
 * `PHOTO_OPS_SCHEMA_VERSION` (the recipes in `content/medi/recipes/photo/` are validated
 * against this schema, so a rename fails their test).
 *
 * Layer params are a strict copy of `LAYER_PARAMS` (see `zodBridge.ts`): unknown keys and
 * out-of-range numbers are refused rather than clamped, so the model learns from the error.
 * A LUT's `cube` text is not part of the vocabulary (the model may change `intensity` only).
 * Brush masks, the AI subject mask and heal are not ops: the model offers them with
 * `suggest_action` (they need a human hand or spend allowance).
 */
import { z } from 'zod/v4';

import { BLEND_MODES, LAYER_PARAMS, LAYER_TYPES, maskComponentSchema, type LayerType } from '@/lib/photo/photoTypes';
import { BUILTIN_PRESETS } from '@/lib/photo/presets';

import { bridge } from './zodBridge';

export const PHOTO_OPS_SCHEMA_VERSION = 1;
export const PHOTO_MAX_OPS = 24;

/** Named colours `grey_except` keeps (design §8.4) and the hue each one centres on. */
export const GREY_EXCEPT_HUES = { red: 0, orange: 30, yellow: 60, green: 120, aqua: 180, blue: 240, purple: 270, magenta: 300 } as const;
export type GreyExceptName = keyof typeof GREY_EXCEPT_HUES;
export const GREY_EXCEPT_NAMES = Object.keys(GREY_EXCEPT_HUES) as GreyExceptName[];

/** Mask components the model may build (the parametric ones). */
export const MODEL_MASK_KINDS = ['gradient', 'radial', 'luminosity', 'colorRange'] as const;
export const CROP_ASPECTS = ['1:1', '4:3', '3:2', '16:9', '9:16', '4:5', '5:4', '2.39:1', 'original'] as const;
export type CropAspect = (typeof CROP_ASPECTS)[number];

// A private registry gives the shared pieces stable `$defs` names in the JSON Schema.
const defs = z.registry<{ id: string }>();
const named = <T extends z.ZodType>(id: string, s: T): T => {
  defs.add(s, { id });
  return s;
};

/** Strict params of one layer type (every field optional: the document's defaults fill the rest). */
const PARAMS: Record<LayerType, z.ZodType> = Object.fromEntries(
  LAYER_TYPES.map((t) => [t, named(`params_${t}`, bridge(LAYER_PARAMS[t], { omit: t === 'lut' ? ['cube'] : [] }))]),
) as Record<LayerType, z.ZodType>;

const v3Options = (maskComponentSchema as unknown as { _def: { options: unknown[] } })._def.options;
const componentOf = (kind: string) =>
  bridge(v3Options.find((o) => (o as { _def: { shape: () => { kind: { _def: { value: string } } } } })._def.shape().kind._def.value === kind));
const maskComponent = named(
  'mask_component',
  z.discriminatedUnion('kind', MODEL_MASK_KINDS.map(componentOf) as unknown as [z.ZodObject, z.ZodObject, ...z.ZodObject[]]),
);
const combine = z.enum(['add', 'subtract', 'intersect']);
/** An inline mask: where the adjustment applies. `combine` is the mode of every component after the first. */
const maskSpec = named(
  'mask',
  z.strictObject({
    components: z.array(maskComponent).min(1).max(16),
    combine: combine.optional(),
    feather: z.number().min(0).max(100).optional(),
    invert: z.boolean().optional(),
  }),
);
const layerId = named('layer_id', z.string().regex(/^[A-Za-z0-9_-]{1,40}$/));
const unit = named('unit', z.number().min(0).max(1));
const layerName = named('layer_name', z.string().min(1).max(80));
const blend = named('blend', z.enum(BLEND_MODES));

/** MM114: why this op (4-140 chars), shown beside it in the change card; optional per op, required once per batch (`apply_edits.reason`). */
export const OP_REASON_MIN = 4;
export const OP_REASON_MAX = 140;
const reasonField = named('reason', z.string().min(OP_REASON_MIN).max(OP_REASON_MAX)).optional();

const addLayer = z
  .discriminatedUnion(
    'type',
    LAYER_TYPES.map((t) =>
      z.strictObject({
        op: z.literal('add_layer'), reason: reasonField,
        type: z.literal(t),
        params: PARAMS[t].optional(),
        name: layerName.optional(),
        opacity: unit.optional(),
        blend: blend.optional(),
        mask: maskSpec.optional(),
      }),
    ) as unknown as [z.ZodObject, z.ZodObject, ...z.ZodObject[]],
  )
  .describe('Add an adjustment layer on top of the stack (params default to neutral).');

const updateLayer = z
  .strictObject({
    op: z.literal('update_layer'), reason: reasonField,
    layerId,
    params: z.union(LAYER_TYPES.map((t) => PARAMS[t]) as unknown as [z.ZodType, z.ZodType, ...z.ZodType[]]).optional(),
    opacity: unit.optional(),
    blend: blend.optional(),
    enabled: z.boolean().optional(),
    name: layerName.optional(),
  })
  .describe("Change an existing layer from the digest; params merge into the layer's params.");

const removeLayer = z.strictObject({ op: z.literal('remove_layer'), reason: reasonField, layerId }).describe('Delete a layer (ask first).');
const moveLayer = z.strictObject({ op: z.literal('move_layer'), reason: reasonField, layerId, toIndex: z.number().int().min(0).max(63) }).describe('Move a layer; 0 is the bottom.');

const greyRange = z.union([z.enum(GREY_EXCEPT_NAMES as [GreyExceptName, ...GreyExceptName[]]), z.strictObject({ hue: z.number().min(0).max(360), width: z.number().min(10).max(120).optional() })]);
const greyExcept = z
  .strictObject({ op: z.literal('grey_except'), reason: reasonField, ranges: z.array(greyRange).min(1).max(8), layerId: layerId.optional() })
  .describe('Make everything grey except the given colours (an HSL layer; layerId reuses an existing HSL layer).');

const setMask = z
  .strictObject({
    op: z.literal('set_mask'), reason: reasonField,
    layerId,
    components: z.array(maskComponent).min(1).max(16),
    combine: combine.optional(),
    feather: z.number().min(0).max(100).optional(),
    invert: z.boolean().optional(),
  })
  .describe("Replace a layer's mask with parametric components (coordinates 0..1 of the displayed photo).");

const PRESET_IDS = BUILTIN_PRESETS.map((p) => p.id) as [string, ...string[]];
const applyPreset = z
  .strictObject({ op: z.literal('apply_preset'), reason: reasonField, presetId: z.enum(PRESET_IDS), intensity: unit.optional() })
  .describe('Append a built-in look as a layer group; intensity sets its layers opacity.');
const autoTone = z.strictObject({ op: z.literal('auto_tone'), reason: reasonField }).describe('Auto levels and white balance from the histogram.');

const crop = z.union([
  z.strictObject({ aspect: z.enum(CROP_ASPECTS) }),
  z.strictObject({ rect: z.strictObject({ x: z.number().min(0).max(0.999), y: z.number().min(0).max(0.999), width: z.number().min(0.001).max(1), height: z.number().min(0.001).max(1) }) }),
  z.null(),
]);
const setGeometry = z
  .strictObject({
    op: z.literal('set_geometry'), reason: reasonField,
    rotate: z.number().int().min(-360).max(360).multipleOf(90).optional(),
    straighten: z.number().min(-45).max(45).optional(),
    flipH: z.boolean().optional(),
    flipV: z.boolean().optional(),
    crop: crop.optional(),
  })
  .refine((o) => Object.keys(o).filter((k) => k !== 'op' && k !== 'reason').length > 0, { message: 'set_geometry needs at least one field' })
  .describe('rotate adds quarter turns; straighten sets the fine angle (auto-crops the corners); crop {aspect} | {rect} | null.');

export const photoOpSchema = z.discriminatedUnion('op', [
  addLayer,
  updateLayer,
  removeLayer,
  moveLayer,
  greyExcept,
  setMask,
  applyPreset,
  autoTone,
  setGeometry as unknown as z.ZodObject,
] as unknown as [z.ZodObject, z.ZodObject, ...z.ZodObject[]]);

/** The `ops` array of one `apply_edits` call. */
export const photoOpsSchema = z.array(photoOpSchema).min(1).max(PHOTO_MAX_OPS);

export type PhotoMaskSpec = { components: Record<string, unknown>[]; combine?: 'add' | 'subtract' | 'intersect'; feather?: number; invert?: boolean };
export type PhotoOp =
  | { op: 'add_layer'; reason?: string; type: LayerType; params?: Record<string, unknown>; name?: string; opacity?: number; blend?: (typeof BLEND_MODES)[number]; mask?: PhotoMaskSpec }
  | { op: 'update_layer'; reason?: string; layerId: string; params?: Record<string, unknown>; opacity?: number; blend?: (typeof BLEND_MODES)[number]; enabled?: boolean; name?: string }
  | { op: 'remove_layer'; reason?: string; layerId: string }
  | { op: 'move_layer'; reason?: string; layerId: string; toIndex: number }
  | { op: 'grey_except'; reason?: string; ranges: (GreyExceptName | { hue: number; width?: number })[]; layerId?: string }
  | ({ op: 'set_mask'; reason?: string; layerId: string } & PhotoMaskSpec)
  | { op: 'apply_preset'; reason?: string; presetId: string; intensity?: number }
  | { op: 'auto_tone'; reason?: string }
  | { op: 'set_geometry'; reason?: string; rotate?: number; straighten?: number; flipH?: boolean; flipV?: boolean; crop?: { aspect: CropAspect } | { rect: { x: number; y: number; width: number; height: number } } | null };

export const PHOTO_OP_NAMES = ['add_layer', 'update_layer', 'remove_layer', 'move_layer', 'grey_except', 'set_mask', 'apply_preset', 'auto_tone', 'set_geometry'] as const;

/** The strict params schema of one layer type (apply-time check of an update's patch). */
export const photoParamsSchema = (type: LayerType): z.ZodType => PARAMS[type];

/** The JSON Schema the API validates `apply_edits.ops` with (draft 2020-12). */
export function photoOpsJsonSchema(): Record<string, unknown> {
  const out = z.toJSONSchema(photoOpsSchema, { target: 'draft-2020-12', metadata: defs, unrepresentable: 'throw' }) as Record<string, unknown>;
  // `z.toJSONSchema` copies each registry id into its `$defs` entry; the key already names it.
  const named = out.$defs as Record<string, Record<string, unknown>> | undefined;
  for (const d of Object.values(named ?? {})) delete d.id;
  return requireGeometryField(out);
}

/**
 * The `set_geometry` "at least one field" refinement has no JSON Schema form of its own
 * (`z.toJSONSchema` drops refinements), so it is written into the exported schema as
 * an `anyOf` of `required` field names (`reason` does not count): both validators then refuse an empty call.
 */
function requireGeometryField(schema: Record<string, unknown>): Record<string, unknown> {
  const walk = (v: unknown): void => {
    if (Array.isArray(v)) return v.forEach(walk);
    if (!v || typeof v !== 'object') return;
    const o = v as Record<string, unknown>;
    const props = o.properties as Record<string, { const?: unknown }> | undefined;
    if (o.type === 'object' && props?.op?.const === 'set_geometry') o.anyOf = ['rotate', 'straighten', 'flipH', 'flipV', 'crop'].map((k) => ({ required: [k] }));
    Object.values(o).forEach(walk);
  };
  walk(schema);
  return schema;
}

/** Human-readable problems of an op list ([] = valid), one line each, for the model's retry and the recipe test. */
export function photoOpsProblems(ops: unknown): string[] {
  const r = photoOpsSchema.safeParse(ops, { reportInput: true });
  return r.success ? [] : formatIssues(r.error.issues as unknown as Issue[]);
}

interface Issue {
  code: string;
  path: (string | number)[];
  message: string;
  input?: unknown;
  keys?: string[];
  maximum?: number | bigint;
  minimum?: number | bigint;
  values?: unknown[];
  errors?: Issue[][];
  note?: string;
}

const where = (path: (string | number)[]) => path.reduce<string>((s, p) => (typeof p === 'number' ? `${s}[${p}]` : s ? `${s}.${p}` : p), 'ops');

export function formatIssues(issues: Issue[], base: (string | number)[] = []): string[] {
  const out: string[] = [];
  for (const i of issues) {
    const path = [...base, ...i.path];
    const at = where(path);
    const last = path[path.length - 1];
    switch (i.code) {
      case 'unrecognized_keys':
        for (const k of i.keys ?? []) out.push(`${where([...path, k])}: unknown parameter`);
        break;
      case 'too_big':
        out.push(`${at}: ${typeof i.input === 'number' ? i.input : JSON.stringify(i.input)} > max ${i.maximum}`);
        break;
      case 'too_small':
        out.push(`${at}: ${typeof i.input === 'number' ? i.input : Array.isArray(i.input) ? `${i.input.length} items` : JSON.stringify(i.input)} < min ${i.minimum}`);
        break;
      case 'invalid_value':
        out.push(`${at}: ${JSON.stringify(i.input)} is not one of ${(i.values ?? []).map(String).join(', ')}`);
        break;
      case 'invalid_union': {
        if (i.note === 'No matching discriminator') {
          const got = JSON.stringify(i.input && typeof i.input === 'object' ? (i.input as Record<string, unknown>)[String(last)] : i.input);
          if (last === 'op') out.push(`${at}: unknown op ${got} (allowed: ${PHOTO_OP_NAMES.join(', ')})`);
          else if (last === 'kind') out.push(`${at}: ${got}: the model may build only ${MODEL_MASK_KINDS.join(', ')} masks (brush and subject are suggested actions)`);
          else if (last === 'type') out.push(`${at}: unknown layer type ${got}`);
          else out.push(`${at}: ${i.message}`);
          break;
        }
        // A plain union (update params, crop, grey ranges): report the branch that came closest.
        // On a tie an object input is reported against the object branch, not a list of names.
        const isObj = !!i.input && typeof i.input === 'object';
        const score = (b: string[]) => b.length * 2 + (isObj && b.some((l) => l.includes(' is not one of ')) ? 1 : 0);
        const branches = (i.errors ?? []).map((b) => formatIssues(b, path));
        const best = branches.reduce<string[] | null>((a, b) => (!a || score(b) < score(a) ? b : a), null);
        out.push(...(best && best.length ? best : [`${at}: matches no allowed form`]));
        break;
      }
      default:
        out.push(`${at}: ${i.message}`);
    }
  }
  return Array.from(new Set(out));
}
