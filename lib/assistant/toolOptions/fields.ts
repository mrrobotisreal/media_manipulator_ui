/**
 * MM116a: building blocks of the per-tool option schemas. A tool's options are a flat, friendly
 * object (`{ level: "smallest", resolution: "720" }`) that Medi sends in `open_tool` and the tool
 * page reads from `?o=`. Every field is optional on the wire (the page keeps its own default for
 * anything not named); `default` is only documentation for the model, taken from the same
 * constants the panels use. Zod v4 so `z.toJSONSchema` can emit the JSON Schema the API validates
 * against (same split as the op vocabularies, lib/assistant/ops/zodBridge.ts).
 */
import { z } from 'zod/v4';

export interface FieldMeta {
  /** The label the form shows for this control (English; the model quotes it to the user). */
  label: string;
  description?: string;
  unit?: string;
  default?: unknown;
}

/** Make a field optional and attach the schema annotations the export emits. */
export function field<T extends z.ZodType>(base: T, m: FieldMeta) {
  const meta: Record<string, unknown> = { 'x-uiLabel': m.label };
  if (m.description) meta.description = m.description;
  if (m.unit) meta.unit = m.unit;
  if (m.default !== undefined) meta.default = m.default;
  return base.optional().meta(meta);
}

export const num = (min: number, max: number, m: FieldMeta) => field(z.number().min(min).max(max), m);
export const int = (min: number, max: number, m: FieldMeta) => field(z.number().int().min(min).max(max), m);
export const bool = (m: FieldMeta) => field(z.boolean(), m);
export const pick = <const V extends readonly [string, ...string[]]>(values: V, m: FieldMeta) => field(z.enum(values), m);
/** An enum that a page fixes (locked output format): one allowed value. */
export const fixed = (value: string, m: FieldMeta) => field(z.literal(value), { ...m, default: value });
export const text = (max: number, m: FieldMeta) => field(z.string().max(max), m);

export type OptionShape = Record<string, z.ZodType>;
export type OptionsSchema = z.ZodObject<OptionShape>;

export const strict = (shape: OptionShape): OptionsSchema => z.strictObject(shape) as OptionsSchema;

export const IMAGE_FORMATS = ['jpg', 'png', 'webp', 'gif', 'avif', 'pdf', 'svg', 'ico'] as const;
export const VIDEO_FORMATS = ['mp4', 'webm', 'avi', 'mov', 'mkv', 'flv', 'wmv', 'prores', 'dnxhd', 'gif'] as const;
export const AUDIO_FORMATS = ['mp3', 'wav', 'aac', 'ogg', 'flac', 'alac', 'opus', 'ac3', 'dts'] as const;
export const EXTRACT_AUDIO_FORMATS = ['mp3', 'wav', 'm4a', 'aac', 'flac', 'ogg'] as const;
export const IMAGE_FILTERS = ['none', 'grayscale', 'sepia', 'blur', 'sharpen', 'swirl', 'barrel-distortion', 'oil-painting', 'vintage', 'emboss', 'charcoal', 'sketch', 'rotate-45º', 'rotate-90º', 'rotate-180º', 'rotate-270º'] as const;
export const GRAVITIES = ['NorthWest', 'North', 'NorthEast', 'West', 'Center', 'East', 'SouthWest', 'South', 'SouthEast'] as const;
export const COMPRESSION_LEVELS = ['smallest', 'balanced', 'high_quality'] as const;
export const COMPRESSION_CODECS = ['h264', 'h265', 'vp9', 'av1'] as const;
export const COMPRESSION_RESOLUTIONS = ['keep', '1080', '720', '480'] as const;
/** Friendly compression level to CRF (the compressor panel and the schema description share it). */
export const LEVEL_CRF = { smallest: 31, balanced: 26, high_quality: 22 } as const;
export const LEVEL_QUALITY = { smallest: 'low', balanced: 'medium', high_quality: 'high' } as const;
/** Codecs the compressor panel's select offers (WebM always uses VP9 server-side). */
export const COMPRESSOR_CODEC_CHOICES = ['h264', 'h265'] as const;
export const COMPRESSOR_FORMATS = ['mp4', 'webm'] as const;
/** CRF override range of the compressor panel's number input. */
export const COMPRESSOR_CRF = { min: 18, max: 40 } as const;
