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

// --- formats ----------------------------------------------------------------

export const EXPORT_FORMATS: readonly StudioExportFormat[] = ['h264', 'hevc', 'mp3', 'wav'];

export function isAudioFormat(f: StudioExportFormat): boolean {
  return f === 'mp3' || f === 'wav';
}

/** Download file extension for a format. */
export function formatExtension(f: StudioExportFormat): string {
  return f === 'mp3' ? 'mp3' : f === 'wav' ? 'wav' : 'mp4';
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

export interface ExportChoices {
  fileName: string;
  quality: 'low' | 'medium' | 'high';
  loudness: 'none' | 'streaming' | 'podcast' | 'broadcast';
  format: StudioExportFormat;
  resolution: number;
  captionsMode: StudioCaptionsMode;
}

export const DEFAULT_EXPORT_CHOICES: Omit<ExportChoices, 'fileName'> = {
  quality: 'high',
  loudness: 'none',
  format: 'h264',
  resolution: 0,
  captionsMode: 'burn_in',
};

/**
 * Build the wire request. When the backend lacks export depth (CreaTV) only
 * the legacy fields are sent, so the host sees exactly the pre-part-20 body.
 * Audio formats drop resolution and captions (nothing to scale or burn).
 */
export function buildExportRequest(c: ExportChoices, exportDepth: boolean): StudioExportRequest {
  const base: StudioExportRequest = {
    fileName: c.fileName,
    preset: c.quality,
    loudness: c.loudness === 'none' ? '' : c.loudness,
  };
  if (!exportDepth) return base;
  const audio = isAudioFormat(c.format);
  return {
    ...base,
    format: c.format,
    resolution: audio ? 0 : c.resolution,
    captionsMode: audio ? 'none' : c.captionsMode,
  };
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
