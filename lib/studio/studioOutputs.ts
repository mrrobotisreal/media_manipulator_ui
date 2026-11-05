/**
 * MM118 Darkroom output model (ADR-0019, design DARKROOM_OUTPUTS_AND_CAPTIONS.md §3).
 *
 * The API's output table (`internal/services/studio_outputs.go`) is the only place output
 * combinations live. The dialog reads it from `GET /api/studio/export-options` (table + the
 * live minimum plan per token + the caller's own allowed set); `studioOutputs.json` is the
 * byte-identical committed copy (`studioOutputs.test.ts` compares it with the API's fixture)
 * used before that answer arrives, on SSR, and offline. Nothing here hard-codes a
 * combination: every list below is derived from the table.
 *
 * The SERVER ENFORCES THE PLAN (403 format_not_in_plan, routed to the UpgradeInterstitial by
 * authedFetch). The client marks locked options so the choice is informed, and never hides
 * them (a hidden option is a dead-end upsell; the exportOptions.ts rule).
 */
import table from './studioOutputs.json';
import type { Tier } from '@/lib/auth/accountApi';

export interface StudioOutputContainer {
  key: string;
  ext: string;
  mime: string;
  mediaKind: string;
  audioOnly: boolean;
  videoCodecs: string[];
  audioCodecs: string[];
  faststart: boolean;
}

export interface StudioOutputCodec {
  key: string;
  kind: 'video' | 'audio' | string;
  bitrates: number[];
  defaultBitrate: number;
}

export interface StudioOutputWarningRule {
  warning: string;
  container?: string;
  videoCodec?: string;
  audioCodec?: string;
}

export interface StudioOutputPreset {
  key: string;
  container: string;
  videoCodec: string;
  audioCodec: string;
}

export interface StudioOutputTable {
  containers: StudioOutputContainer[];
  codecs: StudioOutputCodec[];
  warnings: StudioOutputWarningRule[];
  presets: StudioOutputPreset[];
  legacyFormats: Record<string, string>;
  formats: string[];
  tokens: string[];
  minTier: Record<string, string>;
  advancedMinTier: string;
  defaultChannels: number;
  channels: number[];
}

/** A public plan that can unlock an output option. */
export type RequiredPlan = 'anonymous' | 'free' | 'premium' | 'pro';

/** What the dialog knows about the caller and the live ladder. */
export interface StudioOutputAccess {
  /** The lowest public plan per output token, plus `advanced`. */
  required: Record<string, string>;
  /** The caller's allowed tokens; undefined = unknown (nothing is marked locked). */
  formats?: readonly string[];
  /** The caller may use the Advanced picker. */
  advanced?: boolean;
  tier?: Tier;
}

/** The committed static table (the API's testdata/studio_outputs.json, byte for byte). */
export const STATIC_STUDIO_OUTPUTS: StudioOutputTable = table as StudioOutputTable;

/** The table's default ladder as an access object (no caller set: nothing locked). */
export function defaultOutputAccess(t: StudioOutputTable = STATIC_STUDIO_OUTPUTS): StudioOutputAccess {
  return { required: { ...t.minTier, advanced: t.advancedMinTier } };
}

/**
 * Access for a caller from the served /api/tiers limits (`studioFormats`, `studioAdvanced`),
 * used while /export-options is loading. Undefined fields (an API before MM118) leave the
 * caller unknown, so nothing is marked locked and the server decides.
 */
export function accessFromLimits(
  limits: { studioFormats?: string[]; studioAdvanced?: boolean } | null | undefined,
  tier: Tier | undefined,
  t: StudioOutputTable = STATIC_STUDIO_OUTPUTS,
): StudioOutputAccess {
  return {
    ...defaultOutputAccess(t),
    formats: Array.isArray(limits?.studioFormats) ? limits?.studioFormats : undefined,
    advanced: typeof limits?.studioAdvanced === 'boolean' ? limits.studioAdvanced : undefined,
    tier,
  };
}

/** One resolved output choice (what the request carries). */
export interface OutputChoice {
  container: string;
  videoCodec: string;
  audioCodec: string;
  /** kbps; 0 = the codec's default / the codec has none. */
  audioBitrate: number;
  /** 1 | 2. */
  audioChannels: number;
}

const container = (t: StudioOutputTable, key: string) => t.containers.find((c) => c.key === key);
const codec = (t: StudioOutputTable, key: string) => t.codecs.find((c) => c.key === key);

export function presetChoice(p: StudioOutputPreset, t: StudioOutputTable = STATIC_STUDIO_OUTPUTS): OutputChoice {
  return {
    container: p.container,
    videoCodec: p.videoCodec,
    audioCodec: p.audioCodec,
    audioBitrate: codec(t, p.audioCodec)?.defaultBitrate ?? 0,
    audioChannels: t.defaultChannels,
  };
}

export function presetByKey(key: string, t: StudioOutputTable = STATIC_STUDIO_OUTPUTS): StudioOutputPreset | undefined {
  return t.presets.find((p) => p.key === key);
}

/** The preset naming this combination, if any. */
export function presetFor(c: Pick<OutputChoice, 'container' | 'videoCodec' | 'audioCodec'>, t: StudioOutputTable = STATIC_STUDIO_OUTPUTS) {
  return t.presets.find((p) => p.container === c.container && p.videoCodec === c.videoCodec && p.audioCodec === c.audioCodec);
}

export function isAudioOnlyContainer(key: string, t: StudioOutputTable = STATIC_STUDIO_OUTPUTS): boolean {
  return !!container(t, key)?.audioOnly;
}

/** The file extension (without the dot) for a container. */
export function containerExtension(key: string, t: StudioOutputTable = STATIC_STUDIO_OUTPUTS): string {
  return (container(t, key)?.ext ?? '.mp4').replace(/^\./, '');
}

/**
 * The derived label (history + analytics): the legacy name for the four combinations the
 * old `format` always meant, else `<container>_<video>_<audio>`. Mirrors the API's
 * StudioOutputLabel; the identity test checks every combination against `formats`.
 */
export function outputLabel(c: Pick<OutputChoice, 'container' | 'videoCodec' | 'audioCodec'>, t: StudioOutputTable = STATIC_STUDIO_OUTPUTS): string {
  const p = presetFor(c, t);
  if (p) {
    const legacy = Object.entries(t.legacyFormats).find(([, key]) => key === p.key);
    if (legacy) return legacy[0];
  }
  return `${c.container}_${c.videoCodec}_${c.audioCodec}`;
}

/** The parts of a derived label or legacy format (inverse of outputLabel). */
export function parseOutputLabel(label: string, t: StudioOutputTable = STATIC_STUDIO_OUTPUTS): OutputChoice | null {
  const legacyKey = t.legacyFormats[label];
  if (legacyKey) {
    const p = presetByKey(legacyKey, t);
    return p ? presetChoice(p, t) : null;
  }
  for (const c of t.containers) {
    if (!label.startsWith(`${c.key}_`)) continue;
    for (const v of c.videoCodecs) {
      for (const a of c.audioCodecs) {
        if (label === `${c.key}_${v}_${a}`) {
          return { container: c.key, videoCodec: v, audioCodec: a, audioBitrate: codec(t, a)?.defaultBitrate ?? 0, audioChannels: t.defaultChannels };
        }
      }
    }
  }
  return null;
}

/** The gated tokens of a choice: container, video codec (unless none), audio codec (unless it is the container). */
export function choiceTokens(c: Pick<OutputChoice, 'container' | 'videoCodec' | 'audioCodec'>): string[] {
  const out = [c.container];
  if (c.videoCodec && c.videoCodec !== 'none') out.push(c.videoCodec);
  if (c.audioCodec && c.audioCodec !== c.container) out.push(c.audioCodec);
  return out;
}

/** True when the choice needs the Advanced picker (mirrors the API's StudioOutput.Advanced). */
export function needsAdvanced(c: OutputChoice, t: StudioOutputTable = STATIC_STUDIO_OUTPUTS): boolean {
  if (!presetFor(c, t)) return true;
  const def = codec(t, c.audioCodec)?.defaultBitrate ?? 0;
  const bitrate = c.audioBitrate || def;
  return bitrate !== def || (c.audioChannels || t.defaultChannels) !== t.defaultChannels;
}

/** The table's warnings for a combination. */
export function outputWarnings(c: Pick<OutputChoice, 'container' | 'videoCodec' | 'audioCodec'>, t: StudioOutputTable = STATIC_STUDIO_OUTPUTS): string[] {
  return t.warnings
    .filter((w) => (!w.container || w.container === c.container) && (!w.videoCodec || w.videoCodec === c.videoCodec) && (!w.audioCodec || w.audioCodec === c.audioCodec))
    .map((w) => w.warning);
}

/** A lock on an option: the plan that unlocks it, or null when the caller has it (or is unknown). */
export interface OptionLock {
  /** The token (or `advanced`) the caller lacks. */
  option: string;
  required: RequiredPlan | null;
}

function requiredOf(access: StudioOutputAccess, option: string): RequiredPlan | null {
  const r = access.required[option];
  return r === 'anonymous' || r === 'free' || r === 'premium' || r === 'pro' ? r : null;
}

/** The first token of `tokens` the caller lacks (null = allowed, or the caller is unknown). */
export function lockFor(tokens: string[], access: StudioOutputAccess, advanced = false): OptionLock | null {
  if (access.tier === 'operator') return null;
  if (access.formats) {
    const have = new Set(access.formats);
    const missing = tokens.find((tok) => !have.has(tok));
    if (missing) return { option: missing, required: requiredOf(access, missing) };
  }
  if (advanced && access.advanced === false) return { option: 'advanced', required: requiredOf(access, 'advanced') };
  return null;
}

/** One preset row for the dialog. */
export interface PresetOption {
  preset: StudioOutputPreset;
  choice: OutputChoice;
  audioOnly: boolean;
  lock: OptionLock | null;
  warnings: string[];
}

/** Every preset, in table order, each marked with its lock (locked rows stay listed). */
export function presetOptions(access: StudioOutputAccess, t: StudioOutputTable = STATIC_STUDIO_OUTPUTS): PresetOption[] {
  return t.presets.map((p) => {
    const choice = presetChoice(p, t);
    return { preset: p, choice, audioOnly: isAudioOnlyContainer(p.container, t), lock: lockFor(choiceTokens(choice), access), warnings: outputWarnings(choice, t) };
  });
}

/** One value in an Advanced picker. */
export interface PickerOption {
  value: string;
  /** False when the table does not allow it with the current upstream choice (greyed, with why). */
  valid: boolean;
  /** Why it is invalid: the upstream container it does not fit. */
  invalidBecause?: string;
  lock: OptionLock | null;
}

/** Containers for the Advanced picker: every container the table has, each with its lock. */
export function containerOptions(access: StudioOutputAccess, t: StudioOutputTable = STATIC_STUDIO_OUTPUTS): PickerOption[] {
  return t.containers.map((c) => ({ value: c.key, valid: true, lock: lockFor([c.key], access) }));
}

/** Every video (or audio) codec the table knows, valid only when the container carries it. */
export function codecOptions(kind: 'video' | 'audio', containerKey: string, access: StudioOutputAccess, t: StudioOutputTable = STATIC_STUDIO_OUTPUTS): PickerOption[] {
  const c = container(t, containerKey);
  const allowed = new Set(kind === 'video' ? c?.videoCodecs ?? [] : c?.audioCodecs ?? []);
  const all = t.codecs.filter((x) => x.kind === kind).map((x) => x.key);
  // An audio-only container's video "codec" is none; it is not a table codec row.
  if (kind === 'video' && c?.audioOnly) return [{ value: 'none', valid: true, lock: null }];
  return all.map((value) => {
    const valid = allowed.has(value);
    // The container's own codec (mp3 in .mp3) is not a separate token.
    const tokens = value === containerKey ? [] : [value];
    return { value, valid, invalidBecause: valid ? undefined : containerKey, lock: valid ? lockFor(tokens, access) : null };
  });
}

/** The closed bitrate list of an audio codec ([] = no bitrate setting, e.g. PCM). */
export function bitrateOptions(audioCodec: string, t: StudioOutputTable = STATIC_STUDIO_OUTPUTS): number[] {
  return codec(t, audioCodec)?.bitrates ?? [];
}

/**
 * Re-fit a choice after its container changed: keep each codec when the new container
 * carries it, else its first; a bitrate the new codec lacks falls back to its default.
 */
export function fitChoice(c: OutputChoice, t: StudioOutputTable = STATIC_STUDIO_OUTPUTS): OutputChoice {
  const k = container(t, c.container) ?? t.containers[0];
  const videoCodec = k.videoCodecs.includes(c.videoCodec) ? c.videoCodec : k.videoCodecs[0];
  const audioCodec = k.audioCodecs.includes(c.audioCodec) ? c.audioCodec : k.audioCodecs[0];
  const rates = bitrateOptions(audioCodec, t);
  const def = codec(t, audioCodec)?.defaultBitrate ?? 0;
  const audioBitrate = rates.length === 0 ? 0 : rates.includes(c.audioBitrate) ? c.audioBitrate : def;
  const audioChannels = t.channels.includes(c.audioChannels) ? c.audioChannels : t.defaultChannels;
  return { container: k.key, videoCodec, audioCodec, audioBitrate, audioChannels };
}

/** The default preset: the first the caller may use (the table's first, mp4_h264, for anyone). */
export function defaultPresetKey(access: StudioOutputAccess, t: StudioOutputTable = STATIC_STUDIO_OUTPUTS): string {
  return presetOptions(access, t).find((o) => !o.lock)?.preset.key ?? t.presets[0].key;
}

/** Human label parts for a history row: "MOV · H.265 · AAC 192k". Container/codec names are not translated. */
export const CODEC_NAMES: Record<string, string> = {
  h264: 'H.264',
  hevc: 'H.265',
  aac: 'AAC',
  pcm_s16le: 'PCM 16-bit',
  mp3: 'MP3',
};

export function outputHumanLabel(c: Partial<OutputChoice> & { container: string; videoCodec?: string; audioCodec?: string }): string {
  const parts = [c.container.toUpperCase()];
  if (c.videoCodec && c.videoCodec !== 'none') parts.push(CODEC_NAMES[c.videoCodec] ?? c.videoCodec);
  if (c.audioCodec && c.audioCodec !== c.container) {
    const name = CODEC_NAMES[c.audioCodec] ?? c.audioCodec;
    parts.push(c.audioBitrate ? `${name} ${c.audioBitrate}k` : name);
  }
  if (c.audioChannels === 1) parts.push('mono');
  return parts.join(' · ');
}
