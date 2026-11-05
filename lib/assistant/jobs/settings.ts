/**
 * MM116b: the rows of a confirmation card's settings list. Labels, units and enum values come from
 * the tool's own option schema (`x-uiLabel`, `unit`, `enum`), never from model text, so the card
 * shows exactly the fields the page would show for the same link.
 */
import type { OptionValues } from '@/lib/assistant/toolOptions/codec';
import { optionsJsonSchema } from '@/lib/assistant/toolOptions/export';
import type { OptionsSpec } from '@/lib/assistant/toolOptions/schemas';

export interface SettingRow {
  /** The option's field name (`level`, `gifFps`). */
  name: string;
  /** English x-uiLabel; the card prefers the localized `assistant.jobCard.fields.<name>` and falls back to this. */
  label: string;
  value: string | number | boolean;
  unit?: string;
  /** True for a closed word set (`smallest`), so the card can localize the value. */
  isEnum: boolean;
}

interface Prop {
  'x-uiLabel'?: string;
  unit?: string;
  enum?: unknown[];
  type?: string;
}

/** Rows in schema order for the options the card carries. Unknown names (never validated) are dropped. */
export function settingRows(spec: OptionsSpec, options: OptionValues | undefined): SettingRow[] {
  const js = optionsJsonSchema(spec);
  if (!js || !options) return [];
  const props = (js.properties ?? {}) as Record<string, Prop>;
  const rows: SettingRow[] = [];
  for (const [name, p] of Object.entries(props)) {
    const v = options[name];
    if (v === undefined || v === null) continue;
    if (typeof v !== 'string' && typeof v !== 'number' && typeof v !== 'boolean') continue;
    rows.push({ name, label: p['x-uiLabel'] ?? name, value: v, unit: p.unit, isEnum: Array.isArray(p.enum) && typeof v === 'string' });
  }
  return rows;
}

/** i18n key part for an enum value: letters and digits only (`rotate-45º` -> `rotate_45`). */
export function valueKey(v: string): string {
  return v.normalize('NFKD').replace(/[^A-Za-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
}

/** Every option field, unit and word-like enum value across the registry (the i18n coverage test reads this). */
export function vocabulary(specs: OptionsSpec[]): { fields: Record<string, string>; units: string[]; values: string[] } {
  const fields: Record<string, string> = {};
  const units = new Set<string>();
  const values = new Set<string>();
  for (const spec of specs) {
    const js = optionsJsonSchema(spec);
    if (!js) continue;
    for (const [name, p] of Object.entries((js.properties ?? {}) as Record<string, Prop>)) {
      fields[name] = p['x-uiLabel'] ?? name;
      if (p.unit) units.add(p.unit);
      for (const e of p.enum ?? []) if (typeof e === 'string' && /[A-Za-z]{3,}/.test(e) && !CODE_VALUES.has(e)) values.add(e);
    }
  }
  return { fields, units: [...units].sort(), values: [...values].sort() };
}

/** Enum values that are codes, formats or numbers, shown as they are in every language. */
export const CODE_VALUES: ReadonlySet<string> = new Set([
  'mp3', 'wav', 'aac', 'ogg', 'flac', 'alac', 'opus', 'ac3', 'dts', 'mp4', 'webm', 'avi', 'mov', 'mkv', 'flv', 'wmv', 'prores', 'dnxhd', 'gif',
  'jpg', 'png', 'webp', 'avif', 'pdf', 'svg', 'ico', 'm4a', 'json', 'srt', 'vtt', 'txt', 'h264', 'h265', 'vp9', 'av1', 'hls', 'dash', 'pii',
]);
