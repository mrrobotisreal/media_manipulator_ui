/**
 * MM106: Medi's recipe library — the craft knowledge (design §7.2).
 *
 * Recipes are hand-written markdown under `content/medi/recipes/<editor>/<id>.md`
 * (editor = photo | studio | vector | workflow). Each has a JSON-valued front
 * matter block and four sections:
 *
 *   ---
 *   id: "grey-except-red"
 *   editor: "photo"
 *   title: "Everything grey except the reds"
 *   intents: ["make everything black and white except the red", …]
 *   difficulty: "basic"            (basic | intermediate | advanced)
 *   ops_example: true              (false for workflows that span tools)
 *   tools: ["color-pop"]           (optional: related tool page slugs)
 *   ---
 *   ## When to use
 *   ## What a pro does and why
 *   ## Ops                          (one fenced ```json block: {summary, ops[]})
 *   ## How to adjust
 *
 * The `## Ops` block is an `apply_edits` call in the editor's op vocabulary
 * (design §8.4). Until MM108–MM110 land the real op schemas
 * (`lib/assistant/ops/<surface>.ts`), `checkRecipeOps` validates every op name,
 * parameter name and range against the editor registries the corpus is
 * generated from (`LAYER_PARAMS`, `effectRegistry.ts`, `TRACK_PROPERTY_PATTERN`,
 * `ANIMATOR_IDS`…) — ticket decision 3. MM108 flipped photo to the Zod op schema
 * (`lib/assistant/ops/photo.ts`); MM109 flips studio, MM110 vector
 * (`RECIPE_SCHEMA_SURFACES` below); the photo vocabulary lives only in the Zod schema.
 *
 * Darkroom looks and Motion templates do not exist yet (MM109/MM110 build
 * `lib/studio/looks.ts` and `lib/vector/templates.ts`); the ids recipes may use
 * are the planned catalogs in `PLANNED_STUDIO_LOOKS` / `PLANNED_VECTOR_TEMPLATES`,
 * and those tickets adjust the recipes if a name changes.
 */
import { OP_REASON_MAX, OP_REASON_MIN } from '@/lib/assistant/ops/photo';
import { photoOpsProblems } from '@/lib/assistant/ops/photo';
import { studioOpsProblems } from '@/lib/assistant/ops/studio';
import { STUDIO_LOOK_IDS } from '@/lib/studio/looks';
import { vectorOpsProblems } from '@/lib/assistant/ops/vector';
import { TEMPLATE_KINDS } from '@/lib/vector/templates';
import {
  CHROMAKEY_PARAMS,
  LUMETRI_PARAMS,
  LUT_PARAMS,
  STUDIO_V3_RANGES,
  TRANSFORM_PARAMS,
  TRANSITION_TYPE_GROUPS,
  type EffectParam,
} from '@/lib/studio/effectRegistry';
import { AUDIO_PRESETS } from '@/lib/studio/audioPresets';
import { STUDIO_TITLE_FONTS } from '@/lib/studio/titleFonts';
import { NAMED_KEYFRAME_PROPERTIES } from '@/lib/studio/keyframes';
import { studioCaptionStyleSchema, studioKeyframeEaseSchema, studioAudioConfigSchema } from '@/lib/studioTypes';

export const RECIPE_EDITORS = ['photo', 'studio', 'vector', 'workflow'] as const;
export type RecipeEditor = (typeof RECIPE_EDITORS)[number];
export const RECIPE_DIFFICULTIES = ['basic', 'intermediate', 'advanced'] as const;
export const RECIPE_SECTIONS = ['When to use', 'What a pro does and why', 'Ops', 'How to adjust'] as const;
/**
 * MM115: the optional fifth section. One bullet per measurable goal, `- <metric> <range>`, using the
 * meter names the browser sends (`lib/assistant/metrics.ts`): `meanLuma 0.35-0.55`,
 * `shadowsClipped <= 0.005`. The adjust loop stops when they hold; the `adjust` evals grade against them.
 */
export const RECIPE_CRITERIA_SECTION = 'Success criteria';
export const CRITERIA_METRICS = ['meanLuma', 'medianLuma', 'lumaStd', 'shadowsClipped', 'highlightsClipped', 'warmth', 'tint', 'integratedLUFS', 'truePeakDBFS', 'noiseFloorDB'] as const;

export interface RecipeCriterion {
  metric: (typeof CRITERIA_METRICS)[number];
  min?: number;
  max?: number;
}

/** Parse the `## Success criteria` bullets; throws a plain message on a malformed line. */
export function parseCriteria(text: string): RecipeCriterion[] {
  const out: RecipeCriterion[] = [];
  for (const raw of text.split('\n')) {
    const line = raw.trim();
    if (!line.startsWith('- ')) continue;
    const m = /^- (\w+) (?:(-?\d+(?:\.\d+)?)-(-?\d+(?:\.\d+)?)|(<=|>=) (-?\d+(?:\.\d+)?))(?:\s|$)/.exec(line);
    if (!m) throw new Error(`criteria line ${JSON.stringify(line)}: use "- <metric> <min>-<max>" or "- <metric> <= <n>"`);
    if (!(CRITERIA_METRICS as readonly string[]).includes(m[1])) throw new Error(`criteria metric ${m[1]} is not a known meter`);
    const metric = m[1] as RecipeCriterion['metric'];
    if (m[2] !== undefined) {
      const lo = Number(m[2]);
      const hi = Number(m[3]);
      if (lo > hi) throw new Error(`criteria line ${JSON.stringify(line)}: min above max`);
      out.push({ metric, min: lo, max: hi });
    } else out.push(m[4] === '<=' ? { metric, max: Number(m[5]) } : { metric, min: Number(m[5]) });
  }
  if (out.length === 0) throw new Error('criteria section has no "- metric range" bullets');
  return out;
}

/** Surfaces whose recipes are checked against a real op schema (flipped by MM108–MM110). */
export const RECIPE_SCHEMA_SURFACES: readonly RecipeEditor[] = ['photo', 'studio', 'vector'];

/** The Darkroom looks (`lib/studio/looks.ts`, MM109): recipes may name any of them. */
export const PLANNED_STUDIO_LOOKS = STUDIO_LOOK_IDS;

/** The Motion templates (`lib/vector/templates.ts`, MM110); every one needs a recipe. */
export const PLANNED_VECTOR_TEMPLATES = TEMPLATE_KINDS;


export interface RecipeMeta {
  id: string;
  editor: RecipeEditor;
  title: string;
  intents: string[];
  difficulty: (typeof RECIPE_DIFFICULTIES)[number];
  ops_example: boolean;
  tools: string[];
}

export interface Recipe extends RecipeMeta {
  /** Path relative to the recipes root, e.g. `photo/grey-except-red.md`. */
  path: string;
  sections: Record<(typeof RECIPE_SECTIONS)[number], string>;
  /** MM115: the parsed `## Success criteria` (empty when the recipe has none). */
  criteria: RecipeCriterion[];
  /** The parsed `## Ops` JSON (null when `ops_example` is false). */
  example: { summary: string; reason: string; ops: Op[] } | null;
}

export type Op = { op: string } & Record<string, unknown>;

export class RecipeError extends Error {}

const ID = /^[a-z0-9][a-z0-9-]{1,60}$/;

/** Parse one recipe file. Throws `RecipeError` with the path on any shape problem. */
export function parseRecipe(path: string, text: string): Recipe {
  const fail = (msg: string): never => {
    throw new RecipeError(`${path}: ${msg}`);
  };
  const m = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/.exec(text.replace(/\r\n/g, '\n'));
  if (!m) fail('missing front matter');
  const meta: Record<string, unknown> = {};
  for (const line of m![1].split('\n')) {
    if (!line.trim()) continue;
    const kv = /^([a-z_]+):\s*(.+)$/.exec(line);
    if (!kv) fail(`bad front matter line ${JSON.stringify(line)}`);
    try {
      meta[kv![1]] = JSON.parse(kv![2]);
    } catch {
      fail(`front matter ${kv![1]} is not JSON`);
    }
  }
  const str = (k: string) => (typeof meta[k] === 'string' && (meta[k] as string).trim() ? (meta[k] as string) : fail(`front matter ${k} must be a non-empty string`));
  const id = str('id');
  if (!ID.test(id)) fail(`bad id ${id}`);
  const editor = str('editor') as RecipeEditor;
  if (!RECIPE_EDITORS.includes(editor)) fail(`bad editor ${editor}`);
  if (path !== `${editor}/${id}.md`) fail(`path must be ${editor}/${id}.md`);
  const difficulty = str('difficulty') as Recipe['difficulty'];
  if (!RECIPE_DIFFICULTIES.includes(difficulty)) fail(`bad difficulty ${difficulty}`);
  const intents = meta.intents;
  if (!Array.isArray(intents) || intents.length < 3 || !intents.every((s) => typeof s === 'string' && s.trim())) fail('intents must list at least three plain-language asks');
  const tools = meta.tools ?? [];
  if (!Array.isArray(tools) || !tools.every((s) => typeof s === 'string')) fail('tools must be a list of slugs');
  if (typeof meta.ops_example !== 'boolean') fail('ops_example must be true or false');
  const known = new Set(['id', 'editor', 'title', 'intents', 'difficulty', 'ops_example', 'tools']);
  for (const k of Object.keys(meta)) if (!known.has(k)) fail(`unknown front matter key ${k}`);

  const body = m![2];
  const heads = [...body.matchAll(/^## (.+)$/gm)].map((h) => ({ name: h[1].trim(), at: h.index! }));
  const names = heads.map((h) => h.name).join('|');
  const base = RECIPE_SECTIONS.join('|');
  if (names !== base && names !== `${base}|${RECIPE_CRITERIA_SECTION}`) fail(`sections must be exactly: ${RECIPE_SECTIONS.join(', ')} (and optionally ${RECIPE_CRITERIA_SECTION} last)`);
  let criteria: RecipeCriterion[] = [];
  const sections = {} as Recipe['sections'];
  heads.forEach((h, i) => {
    const start = h.at + `## ${h.name}`.length;
    const text = body.slice(start, i + 1 < heads.length ? heads[i + 1].at : undefined).trim();
    if (!text) fail(`section ${h.name} is empty`);
    if (h.name === RECIPE_CRITERIA_SECTION) {
      try {
        criteria = parseCriteria(text);
      } catch (e) {
        fail((e as Error).message);
      }
      return;
    }
    sections[h.name as (typeof RECIPE_SECTIONS)[number]] = text;
  });

  let example: Recipe['example'] = null;
  const fence = /```json\n([\s\S]*?)\n```/.exec(sections.Ops);
  if (meta.ops_example) {
    if (!fence) fail('ops_example is true but ## Ops has no ```json block');
    let parsed: unknown;
    try {
      parsed = JSON.parse(fence![1]);
    } catch (e) {
      fail(`## Ops JSON does not parse: ${(e as Error).message}`);
    }
    const p = parsed as { summary?: unknown; reason?: unknown; ops?: unknown };
    if (!p || typeof p.summary !== 'string' || !p.summary.trim() || p.summary.length > 60) fail('## Ops needs a summary of at most 60 characters (the undo label)');
    // MM114: every example carries the batch `reason` (4-140 chars) a real apply_edits call must have.
    if (typeof p.reason !== 'string' || p.reason.trim().length < OP_REASON_MIN || p.reason.length > OP_REASON_MAX) fail(`## Ops needs a reason of ${OP_REASON_MIN}-${OP_REASON_MAX} characters (why the edit, citing what was seen or asked)`);
    if (!Array.isArray(p.ops) || p.ops.length === 0) fail('## Ops needs a non-empty ops list');
    if (Object.keys(p).some((k) => k !== 'summary' && k !== 'reason' && k !== 'ops')) fail('## Ops object has only summary, reason and ops');
    example = { summary: p.summary as string, reason: p.reason as string, ops: p.ops as Op[] };
  } else if (fence) {
    fail('ops_example is false but ## Ops has a ```json block');
  }

  return {
    id,
    editor,
    title: str('title'),
    intents: (intents as string[]).map((s) => s.trim()),
    difficulty,
    ops_example: meta.ops_example as boolean,
    tools: tools as string[],
    path,
    sections,
    criteria,
    example,
  };
}

// ---------------------------------------------------------------------------
// Registry-backed op checks (decision 3)
// ---------------------------------------------------------------------------

interface ZodLike {
  _def: { typeName: string; [k: string]: unknown };
  shape?: Record<string, ZodLike>;
}

function unwrap(s: ZodLike): ZodLike {
  let cur = s;
  for (let i = 0; i < 8; i += 1) {
    const d = cur._def;
    if (d.typeName === 'ZodDefault' || d.typeName === 'ZodNullable' || d.typeName === 'ZodOptional') cur = d.innerType as ZodLike;
    else if (d.typeName === 'ZodEffects') cur = d.schema as ZodLike;
    else if (d.typeName === 'ZodLazy') cur = (d.getter as () => ZodLike)();
    else break;
  }
  return cur;
}

const shapeOf = (s: ZodLike): Record<string, ZodLike> => (s._def.shape as (() => Record<string, ZodLike>) | undefined)?.() ?? s.shape ?? {};

/**
 * Check `value` against a Zod schema's *structure*: every key must exist, every
 * number must lie inside the declared min/max (the schemas clamp silently, so a
 * plain parse would hide an out-of-range recipe value), enums must match.
 */
export function checkAgainstSchema(schema: unknown, value: unknown, path: string, errors: string[]): void {
  const s = unwrap(schema as ZodLike);
  const t = s._def.typeName;
  switch (t) {
    case 'ZodObject': {
      if (!value || typeof value !== 'object' || Array.isArray(value)) {
        errors.push(`${path}: expected an object`);
        return;
      }
      const shape = shapeOf(s);
      for (const [k, v] of Object.entries(value)) {
        if (!(k in shape)) errors.push(`${path}.${k}: unknown parameter`);
        else checkAgainstSchema(shape[k], v, `${path}.${k}`, errors);
      }
      return;
    }
    case 'ZodNumber': {
      if (typeof value !== 'number' || !Number.isFinite(value)) {
        errors.push(`${path}: expected a number`);
        return;
      }
      const checks = (s._def.checks ?? []) as Array<{ kind: string; value?: number }>;
      const min = checks.find((c) => c.kind === 'min')?.value;
      const max = checks.find((c) => c.kind === 'max')?.value;
      if (min !== undefined && value < min) errors.push(`${path}: ${value} < min ${min}`);
      if (max !== undefined && value > max) errors.push(`${path}: ${value} > max ${max}`);
      if (checks.some((c) => c.kind === 'int') && !Number.isInteger(value)) errors.push(`${path}: must be an integer`);
      return;
    }
    case 'ZodBoolean':
      if (typeof value !== 'boolean') errors.push(`${path}: expected true/false`);
      return;
    case 'ZodString':
      if (typeof value !== 'string') errors.push(`${path}: expected text`);
      return;
    case 'ZodEnum':
      if (!(s._def.values as string[]).includes(value as string)) errors.push(`${path}: ${JSON.stringify(value)} is not one of ${(s._def.values as string[]).join(', ')}`);
      return;
    case 'ZodLiteral':
      if (value !== s._def.value) errors.push(`${path}: must be ${JSON.stringify(s._def.value)}`);
      return;
    case 'ZodArray': {
      if (!Array.isArray(value)) {
        errors.push(`${path}: expected a list`);
        return;
      }
      const max = (s._def.maxLength as { value: number } | null)?.value;
      if (max !== undefined && value.length > max) errors.push(`${path}: more than ${max} items`);
      value.forEach((v, i) => checkAgainstSchema(s._def.type, v, `${path}[${i}]`, errors));
      return;
    }
    case 'ZodDiscriminatedUnion': {
      const key = s._def.discriminator as string;
      const opt = (s._def.options as ZodLike[]).find((o) => {
        const lit = unwrap(shapeOf(o)[key]);
        return lit._def.value === (value as Record<string, unknown> | null)?.[key];
      });
      if (!opt) errors.push(`${path}.${key}: unknown ${key} ${JSON.stringify((value as Record<string, unknown> | null)?.[key])}`);
      else checkAgainstSchema(opt, value, path, errors);
      return;
    }
    case 'ZodUnion':
      // Accept when any branch accepts.
      for (const o of s._def.options as ZodLike[]) {
        const e: string[] = [];
        checkAgainstSchema(o, value, path, e);
        if (e.length === 0) return;
      }
      errors.push(`${path}: matches no allowed form`);
      return;
    case 'ZodTuple':
      if (!Array.isArray(value)) errors.push(`${path}: expected a list`);
      return;
    default:
      return; // records, unknowns: accepted
  }
}

const has = (o: Record<string, unknown>, k: string) => Object.prototype.hasOwnProperty.call(o, k);

type FieldCheck = (v: unknown, path: string, errors: string[]) => void;
const isStr: FieldCheck = (v, p, e) => {
  if (typeof v !== 'string' || !v.trim()) e.push(`${p}: expected text`);
};
const isBool: FieldCheck = (v, p, e) => {
  if (typeof v !== 'boolean') e.push(`${p}: expected true/false`);
};
const range = (min: number, max: number, int = false): FieldCheck => (v, p, e) => {
  if (typeof v !== 'number' || !Number.isFinite(v)) e.push(`${p}: expected a number`);
  else if (v < min || v > max) e.push(`${p}: ${v} outside ${min}..${max}`);
  else if (int && !Number.isInteger(v)) e.push(`${p}: must be an integer`);
};
const oneOf = (xs: readonly string[]): FieldCheck => (v, p, e) => {
  if (!xs.includes(v as string)) e.push(`${p}: ${JSON.stringify(v)} is not one of ${xs.join(', ')}`);
};
const listOf = (item: FieldCheck, max = 64): FieldCheck => (v, p, e) => {
  if (!Array.isArray(v) || v.length === 0 || v.length > max) e.push(`${p}: expected a list of 1..${max}`);
  else v.forEach((x, i) => item(x, `${p}[${i}]`, e));
};
const schemaOf = (schema: unknown): FieldCheck => (v, p, e) => checkAgainstSchema(schema, v, p, e);
const fromParams = (params: readonly EffectParam[]): FieldCheck => (v, p, e) => {
  if (!v || typeof v !== 'object' || Array.isArray(v)) {
    e.push(`${p}: expected an object`);
    return;
  }
  for (const [k, x] of Object.entries(v)) {
    const def = params.find((q) => q.key === k);
    if (!def) e.push(`${p}.${k}: unknown parameter (allowed: ${params.map((q) => q.key).join(', ')})`);
    else range(def.min, def.max)(x, `${p}.${k}`, e);
  }
};
const clipRef: FieldCheck = (v, p, e) => {
  if (v === 'all') return;
  if (Array.isArray(v) && v.length > 0 && v.every((x) => typeof x === 'string' && x.trim())) return;
  e.push(`${p}: expected "all" or a list of clip ids`);
};

interface OpSpec {
  required: Record<string, FieldCheck>;
  optional?: Record<string, FieldCheck>;
  /** Extra cross-field rule. */
  extra?: (op: Record<string, unknown>, path: string, errors: string[]) => void;
}

function checkOp(specs: Record<string, OpSpec>, op: unknown, path: string, errors: string[]): void {
  if (!op || typeof op !== 'object' || Array.isArray(op)) {
    errors.push(`${path}: an op is an object`);
    return;
  }
  const o = op as Record<string, unknown>;
  const name = o.op;
  const spec = typeof name === 'string' ? specs[name] : undefined;
  if (!spec) {
    errors.push(`${path}.op: unknown op ${JSON.stringify(name)} (allowed: ${Object.keys(specs).join(', ')})`);
    return;
  }
  for (const k of Object.keys(o)) {
    if (k === 'op') continue;
    if (!has(spec.required, k) && !has(spec.optional ?? {}, k)) errors.push(`${path}.${k}: unknown field of ${name as string}`);
  }
  for (const [k, check] of Object.entries(spec.required)) {
    if (!has(o, k)) errors.push(`${path}.${k}: required by ${name as string}`);
    else check(o[k], `${path}.${k}`, errors);
  }
  for (const [k, check] of Object.entries(spec.optional ?? {})) if (has(o, k)) check(o[k], `${path}.${k}`, errors);
  spec.extra?.(o, path, errors);
}

// --- Aperture: the Zod op schema itself (MM108, lib/assistant/ops/photo.ts) -------

// --- Darkroom (design §8.4) ---------------------------------------------------

const R = STUDIO_V3_RANGES;
const TRANSITIONS = TRANSITION_TYPE_GROUPS.flatMap((g) => g.types);
const STUDIO_EASES = studioKeyframeEaseSchema.options;
const FONT_FAMILIES = STUDIO_TITLE_FONTS.map((f) => f.family);
const KEYFRAME_RANGE: Record<string, { min: number; max: number }> = {
  positionX: R.keyframeValue.positionX,
  positionY: R.keyframeValue.positionY,
  scale: R.keyframeValue.scale,
  rotation: R.keyframeValue.rotation,
  opacity: R.keyframeValue.opacity,
  volume: R.keyframeValue.volume,
  pan: R.keyframeValue.pan,
};
const EFFECT_PARAMS: Record<string, readonly EffectParam[]> = { lumetri: LUMETRI_PARAMS, lut: LUT_PARAMS, chromakey: CHROMAKEY_PARAMS };
const studioKeyframes = (property: unknown): FieldCheck => (v, p, e) => {
  if (!Array.isArray(v) || v.length === 0 || v.length > R.keyframesPerProperty) {
    e.push(`${p}: 1..${R.keyframesPerProperty} keyframes`);
    return;
  }
  let bounds: { min: number; max: number } | undefined = KEYFRAME_RANGE[property as string];
  // Effect lanes are "<effectId>.<param>"; the id is the clip's own, so bound by the param name.
  const effect = /^[A-Za-z0-9_-]+\.(\w+)$/.exec(property as string);
  if (effect) {
    const def = Object.values(EFFECT_PARAMS).flat().find((q) => q.key === effect[1]);
    bounds = def && { min: def.min, max: def.max };
  }
  let last = -1;
  v.forEach((k, i) => {
    const kk = k as Record<string, unknown>;
    for (const f of Object.keys(kk ?? {})) if (!['t', 'value', 'ease'].includes(f)) e.push(`${p}[${i}].${f}: unknown field`);
    range(0, 3600)(kk?.t, `${p}[${i}].t`, e);
    if (typeof kk?.t === 'number' && kk.t <= last) e.push(`${p}[${i}].t: keyframes must be in increasing time`);
    last = typeof kk?.t === 'number' ? kk.t : last;
    if (bounds) range(bounds.min, bounds.max)(kk?.value, `${p}[${i}].value`, e);
    oneOf(STUDIO_EASES)(kk?.ease, `${p}[${i}].ease`, e);
  });
};
const titleStyle: FieldCheck = (v, p, e) => {
  const o = v as Record<string, unknown> | null;
  if (!o || typeof o !== 'object') {
    e.push(`${p}: expected an object`);
    return;
  }
  const T = R.title;
  const checks: Record<string, FieldCheck> = {
    fontFamily: oneOf(FONT_FAMILIES),
    fontSizePx: range(T.fontSizePx.min, T.fontSizePx.max),
    fontWeight: (x, q, err) => {
      if (x !== 400 && x !== 700) err.push(`${q}: 400 or 700`);
    },
    fillColor: hexColor,
    strokeColor: hexColor,
    strokeWidthPx: range(T.strokeWidthPx.min, T.strokeWidthPx.max),
    letterSpacingPx: range(T.letterSpacingPx.min, T.letterSpacingPx.max),
    lineHeight: range(T.lineHeight.min, T.lineHeight.max),
    align: oneOf(['left', 'center', 'right']),
    backgroundColor: hexColor,
    backgroundOpacity: range(0, 1),
  };
  for (const [k, x] of Object.entries(o)) {
    if (!checks[k]) e.push(`${p}.${k}: unknown style field`);
    else checks[k](x, `${p}.${k}`, e);
  }
};
function hexColor(v: unknown, p: string, e: string[]) {
  if (typeof v !== 'string' || !/^#[0-9A-Fa-f]{6}$/.test(v)) e.push(`${p}: a #rrggbb colour`);
}

export const STUDIO_OP_SPECS: Record<string, OpSpec> = {
  split: { required: { clipId: isStr, at: range(0, 86_400) } },
  trim: { required: { clipId: isStr }, optional: { sourceIn: range(0, 86_400), sourceOut: range(0, 86_400) } },
  move_clip: { required: { clipId: isStr, timelineStart: range(0, 86_400) }, optional: { trackIndex: range(0, 63, true) } },
  delete_clip: { required: { clipId: isStr }, optional: { ripple: isBool } },
  set_transition: {
    required: { clipId: isStr, type: oneOf(TRANSITIONS), durationSeconds: range(R.transitionDurationSeconds.min, R.transitionDurationSeconds.max) },
  },
  grade: { required: { clipIds: clipRef, lumetri: fromParams(LUMETRI_PARAMS) } },
  apply_look: { required: { clipIds: clipRef, lookId: oneOf(PLANNED_STUDIO_LOOKS) }, optional: { intensity: range(0, 1) } },
  set_transform: {
    required: { clipId: isStr },
    optional: Object.fromEntries(TRANSFORM_PARAMS.map((q) => [q.key, range(q.min, q.max)])),
  },
  set_keyframes: {
    required: {
      clipId: isStr,
      property: (v, p, e) => {
        const param = /^[A-Za-z0-9_-]+\.(\w+)$/.exec(v as string)?.[1];
        const effectParam = !!param && Object.values(EFFECT_PARAMS).flat().some((q) => q.key === param);
        if (!(NAMED_KEYFRAME_PROPERTIES as readonly string[]).includes(v as string) && !effectParam)
          e.push(`${p}: ${JSON.stringify(v)} is not a keyframe lane (${NAMED_KEYFRAME_PROPERTIES.join(', ')} or <effectId>.<param>)`);
      },
      keyframes: () => undefined,
    },
    extra: (o, p, e) => studioKeyframes(o.property)(o.keyframes, `${p}.keyframes`, e),
  },
  add_title: {
    required: { template: oneOf(['lowerThird', 'title', 'endCard', 'caption']), lines: listOf(isStr, R.title.maxLayers), start: range(0, 86_400), duration: range(0.1, 600) },
    optional: { style: titleStyle, animateIn: oneOf(['none', 'fade', 'slideLeft', 'slideRight', 'slideUp', 'pop']), animateOut: oneOf(['none', 'fade', 'slideLeft', 'slideRight', 'slideDown']) },
  },
  set_speed: { required: { clipId: isStr, speed: range(R.speed.min, R.speed.max) }, optional: { maintainPitch: isBool } },
  freeze_frame: { required: { clipId: isStr, at: range(0, 86_400), duration: range(0.1, 60) } },
  audio_preset: { required: { trackIndex: range(0, 63, true), preset: oneOf(AUDIO_PRESETS.map((a) => a.id)) } },
  set_ducking: {
    required: { enabled: isBool },
    optional: {
      voiceTrackIndex: range(0, 63, true),
      amountDb: schemaOf(studioAudioConfigSchema.shape.duckAmountDb),
      attackMs: schemaOf(studioAudioConfigSchema.shape.duckAttackMs),
      releaseMs: schemaOf(studioAudioConfigSchema.shape.duckReleaseMs),
    },
  },
  set_volume: {
    required: { gainDb: range(-60, 6.02) },
    optional: { clipId: isStr, trackIndex: range(0, 63, true) },
    extra: (o, p, e) => {
      if (has(o, 'clipId') === has(o, 'trackIndex')) e.push(`${p}: exactly one of clipId or trackIndex`);
    },
  },
  add_marker: { required: { at: range(0, 86_400), label: (v, p, e) => (typeof v === 'string' && v.length <= R.markers.maxNameLength ? undefined : e.push(`${p}: up to ${R.markers.maxNameLength} characters`)) } },
  set_caption_style: {
    required: {},
    optional: Object.fromEntries(Object.entries(studioCaptionStyleSchema.shape).map(([k, s]) => [k, schemaOf(s)])),
    extra: (o, p, e) => {
      if (Object.keys(o).length === 1) e.push(`${p}: set_caption_style needs at least one field`);
    },
  },
  set_canvas: { required: { aspect: oneOf(['16:9', '9:16', '1:1', '4:5']) } },
};

// Motion recipes are checked against the op schema (MM110, lib/assistant/ops/vector.ts).

export const RECIPE_OP_SPECS: Record<'studio', Record<string, OpSpec>> = {
  studio: STUDIO_OP_SPECS,
};

/** Every problem with a recipe's ops against its editor's registries ([] = valid). */
export function checkRecipeOps(recipe: Pick<Recipe, 'editor' | 'example' | 'path'>): string[] {
  if (!recipe.example) return [];
  if (recipe.editor === 'workflow') return [`${recipe.path}: workflow recipes carry no op list`];
  // MM108: photo recipes are held to the op schema the model is held to (lib/assistant/ops/photo.ts).
  if (recipe.editor === 'photo') return photoOpsProblems(recipe.example.ops).map((e) => `${recipe.path} ${e}`);
  // MM109: Darkroom recipes too (lib/assistant/ops/studio.ts).
  if (recipe.editor === 'studio') return studioOpsProblems(recipe.example.ops).map((e) => `${recipe.path} ${e}`);
  // MM110: Motion recipes likewise (lib/assistant/ops/vector.ts).
  if (recipe.editor === 'vector') return vectorOpsProblems(recipe.example.ops).map((e) => `${recipe.path} ${e}`);
  const errors: string[] = [];
  recipe.example.ops.forEach((op, i) => checkOp(RECIPE_OP_SPECS[recipe.editor as 'studio'], op, `${recipe.path} ops[${i}]`, errors));
  return errors;
}

/** The plain-text sentences of a recipe that state a price or a plan limit (none allowed; MM105 decision 3). */
export function recipeProse(recipe: Recipe): string {
  return RECIPE_SECTIONS.map((s) => recipe.sections[s].replace(/```json[\s\S]*?```/g, '')).join('\n');
}
