/**
 * Raster export options and the tier caps (ticket MM47 decision 6, design §3.4).
 *
 * The caps are the caller's own `TierLimits` row, the same struct
 * `GET /api/tiers` lists per tier (`vectorFormats`, `vectorMaxDurationMs`,
 * `vectorVideo{maxHeight,maxFps,maxSeconds}`; MM43 `internal/tiers`). They
 * are never literals here: a 0 cap field means "no cap on that axis". The UI
 * pre-clamps so the user sees the limits before spending an export; the
 * server stays the authority (`POST /api/vector/exports` answers 403
 * `vector_format_locked` / 422 `vector_cap_exceeded`).
 *
 * Unknown caps (`null`: the limits could not be loaded, or an API before
 * MM43) clamp nothing and lock nothing; the server decides.
 */
import type { TierLimits } from '@/lib/auth/accountApi';

/** The raster formats, exactly the MM43 server names (`internal/tiers/vector.go`). */
export const RASTER_FORMATS = ['gif', 'png_sequence', 'mp4', 'webm'] as const;
export type RasterFormat = (typeof RASTER_FORMATS)[number];
export const isVideoFormat = (f: RasterFormat): f is 'mp4' | 'webm' => f === 'mp4' || f === 'webm';

/** Output heights offered (decision 7), filtered by the tier's `maxHeight`. */
export const HEIGHT_PRESETS = [480, 720, 1080, 1440, 2160] as const;
/** Frame rates offered, filtered by the tier's `maxFps`. */
export const FPS_PRESETS = [12, 15, 24, 25, 30, 50, 60] as const;
/** GIF delays are whole centiseconds and browsers slow anything under 2 cs, so GIF stops at 50 fps. */
export const GIF_MAX_FPS = 50;

/** The tier's raster caps. `formats` null = unknown (nothing locked). */
export interface RasterCaps {
  formats: readonly string[] | null;
  maxHeight: number;
  maxFps: number;
  /** Longest export in ms from both `vectorMaxDurationMs` and `vectorVideo.maxSeconds`; 0 = no cap. */
  maxDurationMs: number;
}

/** Caps from the caller's limits, or null when they are unknown. */
export function capsFromLimits(limits: Pick<TierLimits, 'vectorFormats' | 'vectorVideo' | 'vectorMaxDurationMs'> | null | undefined): RasterCaps | null {
  if (!limits || !Array.isArray(limits.vectorFormats)) return null;
  const v = limits.vectorVideo;
  const fromSeconds = v && v.maxSeconds > 0 ? v.maxSeconds * 1000 : 0;
  const fromDoc = limits.vectorMaxDurationMs && limits.vectorMaxDurationMs > 0 ? limits.vectorMaxDurationMs : 0;
  const maxDurationMs = fromSeconds && fromDoc ? Math.min(fromSeconds, fromDoc) : fromSeconds || fromDoc;
  return { formats: limits.vectorFormats, maxHeight: v?.maxHeight ?? 0, maxFps: v?.maxFps ?? 0, maxDurationMs };
}

export interface RasterOptions {
  format: RasterFormat;
  /** Output pixel height (the server's `height`). */
  height: number;
  fps: number;
  /** Exported span within the document, ms. */
  startMs: number;
  endMs: number;
}

export type ClampedAxis = 'height' | 'fps' | 'duration';

export type ClampResult =
  | { available: false; reason: 'locked' }
  | {
      available: true;
      options: RasterOptions;
      /** Heights / frame rates the dialog may offer for this format. */
      heights: number[];
      fpsChoices: number[];
      /** Longest span allowed, ms (0 = only the document's own length). */
      maxDurationMs: number;
      /** Which axes were reduced to fit. */
      clamped: ClampedAxis[];
    };

const under = (list: readonly number[], max: number): number[] => (max > 0 ? list.filter((x) => x <= max) : [...list]);

/**
 * Fit `options` to the format, the document and the caps. Pure. Locked when
 * the caps are known and the tier's `vectorFormats` lacks the format.
 */
export function clampRasterOptions(options: RasterOptions, caps: RasterCaps | null, docDurationMs: number): ClampResult {
  if (caps?.formats && !caps.formats.includes(options.format)) return { available: false, reason: 'locked' };
  const clamped: ClampedAxis[] = [];

  let heights = under(HEIGHT_PRESETS, caps?.maxHeight ?? 0);
  if (heights.length === 0) heights = [caps!.maxHeight - (caps!.maxHeight % 2)];
  let height = Math.round(options.height);
  if (!heights.includes(height)) {
    const fit = heights.filter((h) => h <= height);
    const next = fit.length ? fit[fit.length - 1] : heights[0];
    if (height > next) clamped.push('height');
    height = next;
  }

  const fpsMax = options.format === 'gif' ? GIF_MAX_FPS : 0;
  let fpsChoices = under(under(FPS_PRESETS, fpsMax), caps?.maxFps ?? 0);
  if (fpsChoices.length === 0) fpsChoices = [caps!.maxFps];
  let fps = Math.round(options.fps);
  if (!fpsChoices.includes(fps)) {
    const fit = fpsChoices.filter((f) => f <= fps);
    const next = fit.length ? fit[fit.length - 1] : fpsChoices[0];
    if (fps > next) clamped.push('fps');
    fps = next;
  }

  const total = Math.max(0, Math.round(docDurationMs));
  let startMs = Math.min(Math.max(0, Math.round(options.startMs)), total);
  let endMs = Math.min(Math.max(startMs, Math.round(options.endMs)), total);
  if (endMs <= startMs) {
    startMs = Math.max(0, Math.min(startMs, total - 1));
    endMs = total > startMs ? total : startMs;
  }
  const maxDurationMs = caps?.maxDurationMs ?? 0;
  if (maxDurationMs > 0 && endMs - startMs > maxDurationMs) {
    endMs = startMs + maxDurationMs;
    clamped.push('duration');
  }
  return { available: true, options: { format: options.format, height, fps, startMs, endMs }, heights, fpsChoices, maxDurationMs, clamped };
}

/**
 * Output pixel size for a height: width from the canvas aspect ratio. Video
 * (H.264/VP9/AV1 4:2:0) needs even dimensions on both axes.
 */
export function outputSize(canvas: { width: number; height: number }, height: number, even: boolean): { width: number; height: number } {
  const aspect = canvas.width > 0 && canvas.height > 0 ? canvas.width / canvas.height : 1;
  let w = Math.max(1, Math.round(height * aspect));
  let h = Math.max(1, Math.round(height));
  if (even) {
    w = Math.max(2, w - (w % 2));
    h = Math.max(2, h - (h % 2));
  }
  return { width: w, height: h };
}

/**
 * Memory guard (decision 7, proposed and changed): frames stream into the
 * zip / GIF writer / video encoder one at a time, so the pixel volume is never
 * held. What IS held is the output file until it is downloaded, so the guard
 * is on output bytes: refused up front when the estimate is over, and aborted
 * mid-export when the real byte count passes it.
 */
export const RASTER_MAX_OUTPUT_BYTES = 2 * 1024 * 1024 * 1024;

/**
 * Estimated output size in bytes (proposed, shown with "≈"). Video: the target
 * bitrate × duration. GIF and PNG: flat vector art compresses to roughly
 * 0.1–0.4 bytes per pixel per frame; these use the high end so the estimate
 * errs large.
 */
export function estimateBytes(format: RasterFormat, size: { width: number; height: number }, frames: number, videoBitrate: number, durationMs: number): number {
  const px = size.width * size.height;
  if (isVideoFormat(format)) return Math.round((videoBitrate * Math.max(0, durationMs)) / 8000);
  if (format === 'gif') return Math.round(px * frames * 0.25 + 1024);
  return Math.round(px * frames * 0.4 + frames * 120 + 22);
}
