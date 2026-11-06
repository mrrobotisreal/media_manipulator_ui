/**
 * Export depth (part 20): the pure option model behind the export dialog, the
 * Exports panel and the canvas presets. No React, no I/O, so every rule is
 * unit-testable and the dialog/panel stay thin.
 *
 * THE TIER CAP IS ENFORCED BY THE SERVER (403 output_height_limited via
 * tiers.EnforceOutputHeight, routed to the UpgradeInterstitial by authedFetch).
 * The client only ANNOTATES rungs above the caller's cap so the choice is
 * informed; it never hides them (a hidden rung is a dead-end upsell) and never
 * relies on its own copy of the limits for correctness.
 */
import type {
  StudioCaptionsMode,
  StudioExportFormat,
  StudioExportRecord,
  StudioExportRequest,
} from '@/lib/studioTypes';
import {
  STATIC_STUDIO_OUTPUTS,
  containerExtension,
  fitChoice,
  isAudioOnlyContainer,
  needsAdvanced,
  outputLabel,
  parseOutputLabel,
  presetByKey,
  presetFor,
  type OutputChoice,
  type StudioOutputTable,
} from './studioOutputs';

// --- formats ----------------------------------------------------------------
// MM118: the output model lives in studioOutputs.ts (the API's table). These helpers keep
// the part-20 names for callers that hold a legacy format or a derived label.

/** The four legacy formats (the CreaTV body and pre-MM118 history rows). */
export const EXPORT_FORMATS: readonly StudioExportFormat[] = ['h264', 'hevc', 'mp3', 'wav'];

/** True for an audio-only legacy format or derived label (no picture, nothing to scale). */
export function isAudioFormat(f: string): boolean {
  const parts = parseOutputLabel(f);
  return parts ? isAudioOnlyContainer(parts.container) : false;
}

/** Download file extension for a legacy format or derived label. */
export function formatExtension(f: string): string {
  const parts = parseOutputLabel(f);
  return parts ? containerExtension(parts.container) : 'mp4';
}

// --- resolution ladder ------------------------------------------------------

/** 0 = the project's canvas height. Order is the display order. */
export const RESOLUTION_RUNGS = [0, 2160, 1440, 1080, 720] as const;

export interface ResolutionOption {
  value: number;
  /** True when the caller's plan cap is known and below this rung. */
  overCap: boolean;
  /** The rendered height this option produces for a given canvas. */
  height: number;
}

/**
 * The ladder for the dropdown. `canvasHeight` resolves the 0 ("Source") rung;
 * `maxOutputHeight` is the caller's cap from /api/account limits (undefined =
 * unknown, nothing annotated; <=0 = no cap). The canvas rung is over the cap
 * when the canvas itself is — that is exactly the case the server refuses.
 */
export function resolutionOptions(canvasHeight: number, maxOutputHeight?: number): ResolutionOption[] {
  const cap = maxOutputHeight && maxOutputHeight > 0 ? maxOutputHeight : undefined;
  return RESOLUTION_RUNGS.map((value) => {
    const height = value === 0 ? canvasHeight : value;
    return { value, height, overCap: cap !== undefined && height > cap };
  });
}

/** Output pixel size for a rung, mirroring the server's OutputDimensions (even width). */
export function outputDimensions(width: number, height: number, outHeight: number): { width: number; height: number } {
  if (outHeight <= 0 || outHeight === height) return { width, height };
  const w = Math.max(2, Math.round((width * outHeight) / height / 2) * 2);
  return { width: w, height: outHeight };
}

/** Closed-vocabulary analytics label for a resolution rung. */
export function resolutionLabel(resolution: number): string {
  return resolution > 0 ? `${resolution}p` : 'canvas';
}

// --- dialog state -> request ------------------------------------------------

/** Preset list (everyone) or the Advanced pickers (Premium/Pro). */
export type ExportMode = 'preset' | 'advanced';

export interface ExportChoices {
  fileName: string;
  quality: 'low' | 'medium' | 'high';
  loudness: 'none' | 'streaming' | 'podcast' | 'broadcast';
  /** MM118: an output preset key from the table (mp4_h264, mov_hevc, ...). */
  outputPreset: string;
  mode: ExportMode;
  /** The Advanced picker's choice (ignored in preset mode). */
  output: OutputChoice;
  resolution: number;
  captionsMode: StudioCaptionsMode;
}

const DEFAULT_PRESET = STATIC_STUDIO_OUTPUTS.presets[0].key;

export const DEFAULT_EXPORT_CHOICES: Omit<ExportChoices, 'fileName'> = {
  quality: 'high',
  loudness: 'none',
  outputPreset: DEFAULT_PRESET,
  mode: 'preset',
  output: { container: 'mp4', videoCodec: 'h264', audioCodec: 'aac', audioBitrate: 192, audioChannels: 2 },
  resolution: 0,
  captionsMode: 'burn_in',
};

/** The output a set of choices renders (the preset's row, or the Advanced picker's). */
export function choiceOutput(c: Pick<ExportChoices, 'mode' | 'outputPreset' | 'output'>, t: StudioOutputTable = STATIC_STUDIO_OUTPUTS): OutputChoice {
  if (c.mode === 'advanced') return c.output;
  const p = presetByKey(c.outputPreset, t) ?? t.presets[0];
  const codec = t.codecs.find((x) => x.key === p.audioCodec);
  return { container: p.container, videoCodec: p.videoCodec, audioCodec: p.audioCodec, audioBitrate: codec?.defaultBitrate ?? 0, audioChannels: t.defaultChannels };
}

/**
 * Build the wire request. When the backend lacks export depth (CreaTV) only the legacy
 * fields are sent, so the host sees exactly the pre-part-20 body. Otherwise a preset sends
 * `outputPreset` alone; Advanced sends the explicit parts, with bitrate/channels only when
 * they differ from the defaults (a default Advanced choice that equals a preset is that
 * preset, so the server never gates it as Advanced). Audio-only outputs drop resolution and
 * captions (nothing to scale or burn). `format` (the alias) is never sent with these.
 */
export function buildExportRequest(c: ExportChoices, exportDepth: boolean, t: StudioOutputTable = STATIC_STUDIO_OUTPUTS): StudioExportRequest {
  const base: StudioExportRequest = {
    fileName: c.fileName,
    preset: c.quality,
    loudness: c.loudness === 'none' ? '' : c.loudness,
  };
  if (!exportDepth) return base;
  const out = choiceOutput(c, t);
  const audio = isAudioOnlyContainer(out.container, t);
  const req: StudioExportRequest = { ...base, resolution: audio ? 0 : c.resolution, captionsMode: audio ? 'none' : c.captionsMode };
  const preset = presetFor(out, t);
  if (preset && !needsAdvanced(out, t)) return { ...req, outputPreset: preset.key };
  const codec = t.codecs.find((x) => x.key === out.audioCodec);
  return {
    ...req,
    container: out.container,
    videoCodec: out.videoCodec,
    audioCodec: out.audioCodec,
    ...(out.audioBitrate && out.audioBitrate !== codec?.defaultBitrate ? { audioBitrate: out.audioBitrate } : {}),
    ...(out.audioChannels && out.audioChannels !== t.defaultChannels ? { audioChannels: out.audioChannels } : {}),
  };
}

/** The analytics mode of a request: Advanced only when the output needs the picker. */
export function exportMode(c: Pick<ExportChoices, 'mode' | 'outputPreset' | 'output'>, t: StudioOutputTable = STATIC_STUDIO_OUTPUTS): ExportMode {
  return needsAdvanced(choiceOutput(c, t), t) ? 'advanced' : 'preset';
}

/** The derived label of a set of choices (history, analytics, the done state). */
export function choiceLabel(c: Pick<ExportChoices, 'mode' | 'outputPreset' | 'output'>, t: StudioOutputTable = STATIC_STUDIO_OUTPUTS): string {
  return outputLabel(choiceOutput(c, t), t);
}

/**
 * Captions modes that make sense for a project: with no captions every mode is
 * equivalent, so the dialog collapses the choice to 'none'.
 */
export function effectiveCaptionsMode(mode: StudioCaptionsMode, hasCaptions: boolean): StudioCaptionsMode {
  return hasCaptions ? mode : 'none';
}

// --- sidecar captions -------------------------------------------------------

/** Sidecar file names share the video's base name: `<base>.srt` / `<base>.vtt`. */
export function sidecarFileNames(base: string): { srt: string; vtt: string } {
  const stem = base.replace(/\.[a-z0-9]{2,4}$/i, '') || 'captions';
  return { srt: `${stem}.srt`, vtt: `${stem}.vtt` };
}

// --- exports panel merge ----------------------------------------------------

/** Live job progress, keyed by jobId, as the panel's watchers report it. */
export interface LiveJob {
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  error?: string;
}

export interface ExportRow extends StudioExportRecord {
  /** 0-100 for a running row (live when known, else 0). */
  progress: number;
  /** The status the user should see, with live job truth overlaid on the stored row. */
  displayStatus: 'running' | 'completed' | 'failed';
  /** Whether the row offers a re-download. */
  canDownload: boolean;
}

/**
 * Overlay live job progress on the stored history. The stored row is the
 * durable truth (it survives a page leave); the live job only wins while it is
 * AHEAD of the row: a running row whose job already finished shows finished
 * before the next refetch lands. A completed/failed row is never reopened.
 */
export function mergeExportRows(records: StudioExportRecord[], live: Record<string, LiveJob | undefined>): ExportRow[] {
  return records.map((r) => {
    const job = live[r.jobId];
    let displayStatus: ExportRow['displayStatus'] = r.status;
    let progress = r.status === 'completed' ? 100 : 0;
    let error = r.error;
    let available = r.available;
    if (r.status === 'running' && job) {
      if (job.status === 'completed') {
        displayStatus = 'completed';
        progress = 100;
        available = true;
      } else if (job.status === 'failed') {
        displayStatus = 'failed';
        error = r.error ?? 'failed';
      } else {
        progress = Math.max(0, Math.min(100, job.progress));
      }
    }
    return { ...r, error, available, displayStatus, progress, canDownload: displayStatus === 'completed' && available };
  });
}

/** Job ids the panel must keep watching: every row still running. */
export function jobsToWatch(records: StudioExportRecord[]): string[] {
  return records.filter((r) => r.status === 'running').map((r) => r.jobId);
}

/** True when any row is in flight (drives the header badge and the history poll). */
export function hasRunning(rows: Pick<ExportRow, 'displayStatus'>[]): boolean {
  return rows.some((r) => r.displayStatus === 'running');
}

/** Error class -> i18n key suffix; unknown classes fall back to `generic`. */
export function errorClassKey(error: string | undefined): string {
  switch (error) {
    case 'timeout':
    case 'unsupported':
    case 'gpu':
    case 'oom':
    case 'disk':
    case 'interrupted':
    case 'cancelled':
    case 'upstream':
    case 'corrupt_input':
    case 'too_large':
      return error;
    default:
      return 'generic';
  }
}

// --- embed summary ----------------------------------------------------------

/** The cs:export-history payload: newest entries only, enums + booleans. */
export function exportHistorySummary(rows: ExportRow[], limit = 10) {
  return {
    total: rows.length,
    running: rows.filter((r) => r.displayStatus === 'running').length,
    entries: rows.slice(0, limit).map((r) => ({
      jobId: r.jobId,
      format: r.format,
      container: r.container ?? parseOutputLabel(r.format)?.container,
      resolution: r.resolution,
      status: r.displayStatus,
      available: r.canDownload,
    })),
  };
}

// --- canvas presets ---------------------------------------------------------

export interface CanvasPreset {
  key: string;
  width: number;
  height: number;
}

export const CANVAS_PRESETS: readonly CanvasPreset[] = [
  { key: '16:9', width: 1920, height: 1080 },
  { key: '9:16', width: 1080, height: 1920 },
  { key: '1:1', width: 1080, height: 1080 },
  { key: '4:5', width: 1080, height: 1350 },
];

export const CANVAS_MIN = 64;
export const CANVAS_MAX_WIDTH = 7680;
export const CANVAS_MAX_HEIGHT = 4320;

/** Clamp a custom canvas to the server's accepted range and to even numbers. */
export function clampCanvas(width: number, height: number): { width: number; height: number } {
  const f = (v: number, max: number, def: number) => {
    const n = Number.isFinite(v) ? Math.round(v) : def;
    return Math.max(CANVAS_MIN, Math.min(max, n)) & ~1;
  };
  return { width: f(width, CANVAS_MAX_WIDTH, 1920), height: f(height, CANVAS_MAX_HEIGHT, 1080) };
}

/** The preset key matching a canvas, or 'custom'. Closed vocabulary for analytics. */
export function canvasPresetKey(width: number, height: number): string {
  return CANVAS_PRESETS.find((p) => p.width === width && p.height === height)?.key ?? 'custom';
}

// --- Medi prefill (MM118) ---------------------------------------------------

/** What Medi's export suggestion prefills in the dialog (the user still presses Export). */
export interface ExportPrefill {
  mode: ExportMode;
  outputPreset: string;
  output: OutputChoice;
  resolution?: number;
  captionsMode?: StudioCaptionsMode;
  /** Medi's first pick was above the plan: the server swapped in the nearest allowed preset. */
  upgrade?: { required: 'free' | 'premium' | 'pro'; option: string };
}

/**
 * Turn the server-validated params of a `suggest_action export` into dialog values. The API
 * already checked them against the table and the caller's plan (handlers.AssistantExports);
 * this re-reads them defensively against the table, so a malformed or stale action prefills
 * nothing rather than something the table does not have. null = open the dialog unchanged.
 */
export function prefillFromParams(p: Record<string, unknown> | null | undefined, t: StudioOutputTable = STATIC_STUDIO_OUTPUTS): ExportPrefill | null {
  if (!p || typeof p !== 'object') return null;
  const str = (k: string) => (typeof p[k] === 'string' ? (p[k] as string) : undefined);
  const num = (k: string) => (typeof p[k] === 'number' && Number.isInteger(p[k]) ? (p[k] as number) : undefined);
  let out: OutputChoice | null = null;
  const preset = str('preset') ? presetByKey(str('preset')!, t) : undefined;
  if (str('container') && t.containers.some((c) => c.key === str('container'))) {
    const fitted = fitChoice(
      {
        container: str('container')!,
        videoCodec: str('videoCodec') ?? '',
        audioCodec: str('audioCodec') ?? '',
        audioBitrate: num('audioBitrate') ?? 0,
        audioChannels: num('audioChannels') ?? t.defaultChannels,
      },
      t,
    );
    // fitChoice swaps codecs the container lacks; a prefill must never silently change one.
    if ((str('videoCodec') && fitted.videoCodec !== str('videoCodec')) || (str('audioCodec') && fitted.audioCodec !== str('audioCodec'))) return null;
    out = fitted;
  } else if (preset) {
    out = choiceOutput({ mode: 'preset', outputPreset: preset.key, output: DEFAULT_EXPORT_CHOICES.output }, t);
  }
  if (!out) return null;
  const named = presetFor(out, t);
  const advanced = !named || needsAdvanced(out, t);
  const prefill: ExportPrefill = {
    mode: advanced ? 'advanced' : 'preset',
    outputPreset: named?.key ?? DEFAULT_EXPORT_CHOICES.outputPreset,
    output: out,
  };
  const res = num('resolution');
  if (res !== undefined && (RESOLUTION_RUNGS as readonly number[]).includes(res)) prefill.resolution = res;
  const cm = str('captionsMode');
  if (cm === 'none' || cm === 'burn_in' || cm === 'sidecar') prefill.captionsMode = cm;
  const up = p.upgrade as { required?: unknown; option?: unknown } | undefined;
  if (up && (up.required === 'free' || up.required === 'premium' || up.required === 'pro') && typeof up.option === 'string') {
    prefill.upgrade = { required: up.required, option: up.option };
  }
  return prefill;
}

// --- history rows (MM118) ---------------------------------------------------

/** A history row's output parts: the stored ones, else what its label means. */
export function recordOutput(r: Pick<StudioExportRecord, 'format' | 'container' | 'videoCodec' | 'audioCodec' | 'audioBitrate' | 'audioChannels'>): OutputChoice {
  const parsed = parseOutputLabel(r.format);
  if (r.container) {
    return {
      container: r.container,
      videoCodec: r.videoCodec ?? parsed?.videoCodec ?? 'none',
      audioCodec: r.audioCodec ?? parsed?.audioCodec ?? '',
      audioBitrate: r.audioBitrate ?? 0,
      audioChannels: r.audioChannels ?? STATIC_STUDIO_OUTPUTS.defaultChannels,
    };
  }
  return parsed ?? { container: 'mp4', videoCodec: 'h264', audioCodec: 'aac', audioBitrate: 192, audioChannels: 2 };
}

/** The studio_export_* props of a render-again of a history row. */
export function rerenderExportProps(row: StudioExportRecord, host: 'mm' | 'creatv') {
  const out = recordOutput(row);
  const audio = isAudioOnlyContainer(out.container);
  return {
    preset: (['low', 'medium', 'high'].includes(row.preset ?? '') ? row.preset : 'high') as 'low' | 'medium' | 'high',
    format: row.format,
    container: out.container,
    videoCodec: out.videoCodec,
    audioCodec: out.audioCodec,
    audioBitrate: out.audioBitrate,
    audioChannels: out.audioChannels,
    mode: needsAdvanced(out) ? ('advanced' as const) : ('preset' as const),
    resolution: audio ? 'audio' : resolutionLabel(row.resolution),
    captionsMode: row.captionsMode,
    host,
  };
}
