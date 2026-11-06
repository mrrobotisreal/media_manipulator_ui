/**
 * MM109: Darkroom's op vocabulary for Medi (design MEDI_ASSISTANT.md §8.4, ADR-0018).
 *
 * THE contract between the model, the API and the editor, the same pattern as Aperture's
 * (`./photo.ts`): an `apply_edits` call carries a list of these ops; the API validates it
 * against the JSON Schema compiled from this file (`lib/assistant/ops/schema/studio.json`,
 * byte-copied to `media_manipulator_api/internal/assistant/ops/schema/studio.json`) before
 * streaming, and the client validates again here before `applyStudioOps` lands the whole list
 * as ONE undo entry through the store's `applyAssistantOps`.
 *
 * Times are timeline seconds; keyframe `t` is seconds from the clip's start (Darkroom's own
 * keyframe convention). Clip ids come from the timeline digest; tracks are addressed by their
 * digest label (`V1`, `A2`…) or id. Every range is the registry's (`effectRegistry.ts`,
 * `STUDIO_V3_RANGES`, the Zod EDL schema): out-of-range values are refused, not clamped, so the
 * model is told what it got wrong.
 *
 * Writers may add ops or optional fields; never remove or rename one without bumping
 * `STUDIO_OPS_SCHEMA_VERSION` (the recipes in `content/medi/recipes/studio/` are validated
 * against this schema). Captions, voiceover, voice cleanup / stem splits and export are not ops:
 * the model offers them with `suggest_action` (they spend allowance or need a human).
 */
import { z } from 'zod/v4';

import { AUDIO_PRESETS } from '@/lib/studio/audioPresets';
import { LUMETRI_PARAMS, STUDIO_V3_RANGES, TRANSFORM_PARAMS, TRANSITION_TYPE_GROUPS } from '@/lib/studio/effectRegistry';
import { NAMED_KEYFRAME_PROPERTIES, keyframeValueRange } from '@/lib/studio/keyframes';
import { STUDIO_LOOK_IDS } from '@/lib/studio/looks';
import { STUDIO_TITLE_FONTS } from '@/lib/studio/titleFonts';
import {
  STUDIO_CAPTION_ANIMATIONS,
  STUDIO_CAPTION_BACKGROUND_MODES,
  STUDIO_CAPTION_LOOK_IDS,
  studioAudioConfigSchema,
  studioCaptionStyleSchema,
  studioKeyframeEaseSchema,
} from '@/lib/studioTypes';
import captionsCatalog from '@/lib/studio/captions/captionsCatalog.json';

import { bridge } from './zodBridge';
import { formatIssues } from './photo';

export const STUDIO_OPS_SCHEMA_VERSION = 1;
export const STUDIO_MAX_OPS = 24;
/** The latest timeline time an op may name (24 h), and the longest clip/title it may add. */
const MAX_T = 86_400;

export const TITLE_TEMPLATES = ['lowerThird', 'title', 'endCard', 'caption'] as const;
export type TitleTemplate = (typeof TITLE_TEMPLATES)[number];
export const TITLE_ANIMATE_IN = ['none', 'fade', 'slideLeft', 'slideRight', 'slideUp', 'pop'] as const;
export const TITLE_ANIMATE_OUT = ['none', 'fade', 'slideLeft', 'slideRight', 'slideDown'] as const;
export const CANVAS_ASPECTS = ['16:9', '9:16', '1:1', '4:5'] as const;
export type CanvasAspect = (typeof CANVAS_ASPECTS)[number];

const R = STUDIO_V3_RANGES;
const TRANSITIONS = TRANSITION_TYPE_GROUPS.flatMap((g) => g.types) as [string, ...string[]];
const FONT_FAMILIES = STUDIO_TITLE_FONTS.map((f) => f.family) as [string, ...string[]];
const PRESET_IDS = AUDIO_PRESETS.map((p) => p.id) as [string, ...string[]];

// A private registry gives the shared pieces stable `$defs` names in the JSON Schema.
const defs = z.registry<{ id: string }>();
const named = <T extends z.ZodType>(id: string, s: T): T => {
  defs.add(s, { id });
  return s;
};

const range = (min: number, max: number) => z.number().min(min).max(max);
const time = named('time', range(0, MAX_T));
const clipId = named('clip_id', z.string().regex(/^[A-Za-z0-9_-]{1,64}$/));
/** A track by digest label (V1, A2…) or by id. */
const trackRef = named('track_ref', z.string().regex(/^[A-Za-z0-9_-]{1,64}$/));
const clipIds = named('clip_ids', z.union([z.literal('all'), z.array(clipId).min(1).max(64)]));
const hex = named('hex_color', z.string().regex(/^#[0-9A-Fa-f]{6}$/));
const ease = named('ease', z.enum(studioKeyframeEaseSchema.options));

const lumetri = named(
  'lumetri',
  z.strictObject(Object.fromEntries(LUMETRI_PARAMS.map((p) => [p.key, range(p.min, p.max).optional()]))),
);

/** Keyframe lanes: the named clip properties, or `<effectId>.<param>` of a Lumetri effect on the clip. */
const keyframeProperty = named(
  'keyframe_property',
  z.union([z.enum(NAMED_KEYFRAME_PROPERTIES), z.string().regex(new RegExp(`^[A-Za-z0-9_-]{1,64}\\.(${LUMETRI_PARAMS.map((p) => p.key).join('|')})$`))]),
);
const keyframes = z
  .array(z.strictObject({ t: range(0, MAX_T), value: z.number(), ease }))
  .min(1)
  .max(R.keyframesPerProperty);

const titleStyle = named(
  'title_style',
  z.strictObject({
    fontFamily: z.enum(FONT_FAMILIES).optional(),
    fontSizePx: range(R.title.fontSizePx.min, R.title.fontSizePx.max).optional(),
    fontWeight: z.union([z.literal(400), z.literal(700)]).optional(),
    fillColor: hex.optional(),
    strokeColor: hex.optional(),
    strokeWidthPx: range(R.title.strokeWidthPx.min, R.title.strokeWidthPx.max).optional(),
    letterSpacingPx: range(R.title.letterSpacingPx.min, R.title.letterSpacingPx.max).optional(),
    lineHeight: range(R.title.lineHeight.min, R.title.lineHeight.max).optional(),
    align: z.enum(['left', 'center', 'right']).optional(),
    backgroundColor: hex.optional(),
    backgroundOpacity: range(0, 1).optional(),
  }),
);

/** MM114: why this op (4-140 chars), shown beside it in the change card; optional per op, required once per batch (`apply_edits.reason`). */
export const OP_REASON_MIN = 4;
export const OP_REASON_MAX = 140;
const reasonField = named('reason', z.string().min(OP_REASON_MIN).max(OP_REASON_MAX)).optional();

const op = <T extends Record<string, z.ZodType>>(name: string, shape: T, describe: string) =>
  z.strictObject({ op: z.literal(name), reason: reasonField, ...shape }).describe(describe);

const split = op('split', { clipId, at: time }, 'Cut a clip in two at timeline time `at`; the right piece gets a new id (read it from the next digest).');
const trim = op(
  'trim',
  { clipId, sourceIn: time.optional(), sourceOut: time.optional() },
  "Set a clip's in/out point in its source media (seconds); the clip keeps its timeline start.",
);
const moveClip = op(
  'move_clip',
  { clipId, timelineStart: time, track: trackRef.optional() },
  'Move a clip to a new start (and optionally onto another track of the same kind); it lands in the nearest free slot.',
);
const deleteClip = op('delete_clip', { clipId, ripple: z.boolean().optional() }, 'Delete a clip (ask first); ripple closes the gap on its track.');
const setTransition = op(
  'set_transition',
  { clipId, type: z.enum(TRANSITIONS), durationSeconds: range(R.transitionDurationSeconds.min, R.transitionDurationSeconds.max) },
  'Add or change the entrance transition of a clip from the clip before it on the same track.',
);
const grade = op(
  'grade',
  { clipIds, lumetri },
  'Set the Lumetri colour grade of clips (`all` = every video/image clip): exposure in stops, contrast/saturation 1 = neutral, temperature/tint -100..100, vibrance.',
);
const applyLook = op(
  'apply_look',
  { clipIds, lookId: z.enum(STUDIO_LOOK_IDS), intensity: range(0, 1).optional() },
  'Apply a named look from the Looks catalog to clips (replaces an earlier look); intensity mixes it from neutral (default 1).',
);
const setTransform = op(
  'set_transform',
  { clipId, ...Object.fromEntries(TRANSFORM_PARAMS.map((p) => [p.key, range(p.min, p.max).optional()])) },
  'Position/scale/rotate a clip: x/y are offsets of its centre from the frame centre as fractions of the frame (y down), scale 1 = fit.',
);
const setKeyframes = op(
  'set_keyframes',
  { clipId, property: keyframeProperty, keyframes },
  "Replace one property's keyframes on a clip (t = seconds from the clip's start): Ken Burns on scale/position, fades on opacity or volume.",
);
const addTitle = op(
  'add_title',
  {
    template: z.enum(TITLE_TEMPLATES),
    lines: z.array(z.string().min(1).max(R.title.maxTextLength)).min(1).max(4),
    start: time,
    duration: range(0.5, 600),
    style: titleStyle.optional(),
    animateIn: z.enum(TITLE_ANIMATE_IN).optional(),
    animateOut: z.enum(TITLE_ANIMATE_OUT).optional(),
  },
  'Add a designed title clip on the top video track: lowerThird (name + role, lower left), title (centred card), endCard, caption (one line at the bottom).',
);
const setSpeed = op(
  'set_speed',
  { clipId, speed: range(R.speed.min, R.speed.max), maintainPitch: z.boolean().optional() },
  'Change a clip’s playback rate (0.5 = half speed); later clips on the track are not moved.',
);
const freezeFrame = op(
  'freeze_frame',
  { clipId, at: time, duration: range(0.1, 60) },
  'Insert a held frame of the video at timeline time `at`, right after the clip.',
);
const audioPreset = op('audio_preset', { track: trackRef, preset: z.enum(PRESET_IDS) }, 'Apply a track EQ + compressor preset (voiceClarity, podcast, musicBed) to an audio track.');
const audioShape = studioAudioConfigSchema.shape;
const setDucking = op(
  'set_ducking',
  {
    enabled: z.boolean(),
    voiceTrack: trackRef.optional(),
    amountDb: bridge(audioShape.duckAmountDb).optional(),
    attackMs: bridge(audioShape.duckAttackMs).optional(),
    releaseMs: bridge(audioShape.duckReleaseMs).optional(),
  },
  'Turn on automatic music ducking under the voice track (amount in dB, attack/release in ms).',
);
const setVolume = op(
  'set_volume',
  { clipId: clipId.optional(), track: trackRef.optional(), gainDb: range(-60, 6) },
  'Set the gain of one clip or one whole track in dB (0 = unchanged, +6 max).',
);
const addMarker = op('add_marker', { at: time, label: z.string().min(1).max(R.markers.maxNameLength) }, 'Drop a named marker on the timeline.');
const captionShape = studioCaptionStyleSchema.shape;
const CAPTION_FONT_FAMILIES = captionsCatalog.fonts.map((f) => f.family) as [string, ...string[]];
const setCaptionStyle = op(
  'set_caption_style',
  {
    look: z.enum(STUDIO_CAPTION_LOOK_IDS).optional(),
    fontSizePct: bridge(captionShape.fontSizePct).optional(),
    color: hex.optional(),
    backgroundColor: hex.optional(),
    backgroundOpacity: bridge(captionShape.backgroundOpacity).optional(),
    position: z.enum(['bottom', 'middle', 'top']).optional(),
    maxWidthPct: bridge(captionShape.maxWidthPct).optional(),
    fontFamily: z.enum(CAPTION_FONT_FAMILIES).optional(),
    bold: z.boolean().optional(),
    uppercase: z.boolean().optional(),
    highlightColor: hex.optional(),
    outlineColor: hex.optional(),
    outlineWidth: range(0, 12).optional(),
    shadow: range(0, 1).optional(),
    backgroundMode: z.enum(STUDIO_CAPTION_BACKGROUND_MODES).optional(),
    wordsPerGroup: z.number().int().min(0).max(6).optional(),
    animation: z.enum(STUDIO_CAPTION_ANIMATIONS).optional(),
    animationStrength: range(0, 1).optional(),
  },
  'Restyle the captions (they must exist; generating them is a suggested action). look applies a named caption look first (bold_pop = TikTok-style pop, karaoke_classic = karaoke fill for songs, clean_highlight, minimal, neon, podcast = calm boxed lines); the other fields then tweak it. animation: karaoke_fill sweeps each word in highlightColor as it is spoken, highlight recolours the current word, pop scales it (animationStrength); wordsPerGroup 1-6 words on screen at once, 0 = whole line. Styling and animation only show when captions are burned in.',
);
const setCanvas = op('set_canvas', { aspect: z.enum(CANVAS_ASPECTS) }, 'Change the frame shape (16:9 landscape, 9:16 vertical, 1:1 square, 4:5 portrait).');

export const studioOpSchema = z.discriminatedUnion('op', [
  split,
  trim,
  moveClip,
  deleteClip,
  setTransition,
  grade,
  applyLook,
  setTransform,
  setKeyframes,
  addTitle,
  setSpeed,
  freezeFrame,
  audioPreset,
  setDucking,
  setVolume,
  addMarker,
  setCaptionStyle,
  setCanvas,
] as unknown as [z.ZodObject, z.ZodObject, ...z.ZodObject[]]);

/** The `ops` array of one `apply_edits` call. */
export const studioOpsSchema = z.array(studioOpSchema).min(1).max(STUDIO_MAX_OPS);

export const STUDIO_OP_NAMES = [
  'split',
  'trim',
  'move_clip',
  'delete_clip',
  'set_transition',
  'grade',
  'apply_look',
  'set_transform',
  'set_keyframes',
  'add_title',
  'set_speed',
  'freeze_frame',
  'audio_preset',
  'set_ducking',
  'set_volume',
  'add_marker',
  'set_caption_style',
  'set_canvas',
] as const;
export type StudioOpName = (typeof STUDIO_OP_NAMES)[number];

type Lumetri = Partial<Record<(typeof LUMETRI_PARAMS)[number]['key'], number>>;
export type StudioTitleStyle = Partial<{
  fontFamily: string;
  fontSizePx: number;
  fontWeight: 400 | 700;
  fillColor: string;
  strokeColor: string;
  strokeWidthPx: number;
  letterSpacingPx: number;
  lineHeight: number;
  align: 'left' | 'center' | 'right';
  backgroundColor: string;
  backgroundOpacity: number;
}>;
export type StudioOp =
  | { op: 'split'; reason?: string; clipId: string; at: number }
  | { op: 'trim'; reason?: string; clipId: string; sourceIn?: number; sourceOut?: number }
  | { op: 'move_clip'; reason?: string; clipId: string; timelineStart: number; track?: string }
  | { op: 'delete_clip'; reason?: string; clipId: string; ripple?: boolean }
  | { op: 'set_transition'; reason?: string; clipId: string; type: string; durationSeconds: number }
  | { op: 'grade'; reason?: string; clipIds: 'all' | string[]; lumetri: Lumetri }
  | { op: 'apply_look'; reason?: string; clipIds: 'all' | string[]; lookId: string; intensity?: number }
  | { op: 'set_transform'; reason?: string; clipId: string; x?: number; y?: number; scale?: number; rotationDeg?: number }
  | { op: 'set_keyframes'; reason?: string; clipId: string; property: string; keyframes: { t: number; value: number; ease: 'linear' | 'hold' | 'easeIn' | 'easeOut' | 'easeBoth' }[] }
  | { op: 'add_title'; reason?: string; template: TitleTemplate; lines: string[]; start: number; duration: number; style?: StudioTitleStyle; animateIn?: (typeof TITLE_ANIMATE_IN)[number]; animateOut?: (typeof TITLE_ANIMATE_OUT)[number] }
  | { op: 'set_speed'; reason?: string; clipId: string; speed: number; maintainPitch?: boolean }
  | { op: 'freeze_frame'; reason?: string; clipId: string; at: number; duration: number }
  | { op: 'audio_preset'; reason?: string; track: string; preset: string }
  | { op: 'set_ducking'; reason?: string; enabled: boolean; voiceTrack?: string; amountDb?: number; attackMs?: number; releaseMs?: number }
  | { op: 'set_volume'; reason?: string; clipId?: string; track?: string; gainDb: number }
  | { op: 'add_marker'; reason?: string; at: number; label: string }
  | {
      op: 'set_caption_style';
      reason?: string;
      look?: (typeof STUDIO_CAPTION_LOOK_IDS)[number];
      fontSizePct?: number;
      color?: string;
      backgroundColor?: string;
      backgroundOpacity?: number;
      position?: 'bottom' | 'middle' | 'top';
      maxWidthPct?: number;
      fontFamily?: string;
      bold?: boolean;
      uppercase?: boolean;
      highlightColor?: string;
      outlineColor?: string;
      outlineWidth?: number;
      shadow?: number;
      backgroundMode?: (typeof STUDIO_CAPTION_BACKGROUND_MODES)[number];
      wordsPerGroup?: number;
      animation?: (typeof STUDIO_CAPTION_ANIMATIONS)[number];
      animationStrength?: number;
    }
  | { op: 'set_canvas'; reason?: string; aspect: CanvasAspect };

/**
 * Rules JSON Schema cannot state on its own field list (`z.toJSONSchema` drops refinements):
 * `set_volume` names exactly one of clipId / track, `trim` and `set_caption_style` change at
 * least one field. They are written into the exported schema below so both validators agree.
 */
/** Every set_caption_style field (at least one is required). */
export const SET_CAPTION_STYLE_FIELDS = [
  'look', 'fontSizePct', 'color', 'backgroundColor', 'backgroundOpacity', 'position', 'maxWidthPct', 'fontFamily', 'bold', 'uppercase',
  'highlightColor', 'outlineColor', 'outlineWidth', 'shadow', 'backgroundMode', 'wordsPerGroup', 'animation', 'animationStrength',
] as const;

function refineSchema(schema: Record<string, unknown>): Record<string, unknown> {
  const walk = (v: unknown): void => {
    if (Array.isArray(v)) return v.forEach(walk);
    if (!v || typeof v !== 'object') return;
    const o = v as Record<string, unknown>;
    const name = (o.properties as Record<string, { const?: unknown }> | undefined)?.op?.const;
    if (o.type === 'object' && name === 'set_volume') o.oneOf = [{ required: ['clipId'] }, { required: ['track'] }];
    if (o.type === 'object' && name === 'trim') o.anyOf = [{ required: ['sourceIn'] }, { required: ['sourceOut'] }];
    if (o.type === 'object' && name === 'set_caption_style') o.anyOf = SET_CAPTION_STYLE_FIELDS.map((k) => ({ required: [k] }));
    Object.values(o).forEach(walk);
  };
  walk(schema);
  return schema;
}

/**
 * The same three rules for the client-side parse (the Zod objects above stay plain for export),
 * plus each keyframe lane's own value range (a property-dependent bound JSON Schema cannot
 * express on one `value` field; the engine refuses it too, and the model hears the reason).
 */
function refinementProblems(ops: StudioOp[]): string[] {
  const out: string[] = [];
  ops.forEach((o, i) => {
    if (o.op === 'set_keyframes') {
      const { min, max } = keyframeValueRange(o.property);
      o.keyframes.forEach((k, j) => {
        if (k.value < min || k.value > max) out.push(`ops[${i}].keyframes[${j}].value: ${k.value} is outside ${min}..${max} for ${o.property}`);
      });
    }
    if (o.op === 'set_volume' && (o.clipId === undefined) === (o.track === undefined)) out.push(`ops[${i}]: set_volume needs exactly one of clipId or track`);
    if (o.op === 'trim' && o.sourceIn === undefined && o.sourceOut === undefined) out.push(`ops[${i}]: trim needs sourceIn or sourceOut`);
    if (o.op === 'set_caption_style' && Object.keys(o).filter((k) => k !== 'op' && k !== 'reason').length < 1) out.push(`ops[${i}]: set_caption_style needs at least one field`);
  });
  return out;
}

/** The JSON Schema the API validates `apply_edits.ops` with (draft 2020-12). */
export function studioOpsJsonSchema(): Record<string, unknown> {
  const out = z.toJSONSchema(studioOpsSchema, { target: 'draft-2020-12', metadata: defs, unrepresentable: 'throw' }) as Record<string, unknown>;
  const d = out.$defs as Record<string, Record<string, unknown>> | undefined;
  for (const v of Object.values(d ?? {})) delete v.id;
  return refineSchema(out);
}

/** Human-readable problems of an op list ([] = valid), one line each, for the model's retry and the recipe test. */
export function studioOpsProblems(ops: unknown): string[] {
  const r = studioOpsSchema.safeParse(ops, { reportInput: true });
  if (!r.success) {
    return formatIssues(r.error.issues as unknown as Parameters<typeof formatIssues>[0]).map((l) =>
      l.replace(/unknown op (".*?") \(allowed: [^)]*\)/, `unknown op $1 (allowed: ${STUDIO_OP_NAMES.join(', ')})`),
    );
  }
  return refinementProblems(r.data as StudioOp[]);
}
