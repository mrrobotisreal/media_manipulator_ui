/**
 * Raster export capability probe (ticket MM47 decision 5, design §3.3.5).
 *
 * Per CODEC, not per API: WebCodecs can exist while H.264 encoding does not
 * (Linux Chromium without proprietary codecs, some Firefox builds). Each codec
 * is asked with `VideoEncoder.isConfigSupported` for the export's own size and
 * frame rate, because support also depends on the level the size needs.
 *
 * Pure given its injected globals (`RasterGlobals`), so the tests drive it
 * with fakes (§5 "capability probe fakes"). WebCodecs exists only in secure
 * contexts; an insecure context reports `webcodecs: false` even when the
 * constructor is visible.
 */

export interface RasterProbe {
  gif: true;
  png: true;
  webcodecs: boolean;
  h264: boolean;
  vp9: boolean;
  av1: boolean;
  offscreen: boolean;
  secureContext: boolean;
}

export type VideoCodecId = 'h264' | 'vp9' | 'av1';

export interface ProbeConfig {
  codec: string;
  width: number;
  height: number;
  bitrate: number;
  framerate: number;
}

export interface RasterGlobals {
  VideoEncoder?: { isConfigSupported(config: ProbeConfig): Promise<{ supported?: boolean }> };
  OffscreenCanvas?: unknown;
  isSecureContext?: boolean;
}

/** The real globals (browser only). */
export function browserRasterGlobals(): RasterGlobals {
  const g = globalThis as unknown as RasterGlobals & { isSecureContext?: boolean };
  return { VideoEncoder: g.VideoEncoder, OffscreenCanvas: g.OffscreenCanvas, isSecureContext: g.isSecureContext };
}

export interface ProbeSize {
  width: number;
  height: number;
  fps: number;
}

/** The size the dialog probes with before the user picks one: 1080p30. */
export const DEFAULT_PROBE_SIZE: ProbeSize = { width: 1920, height: 1080, fps: 30 };

// --- codec strings ------------------------------------------------------------

/** H.264 levels from 3.0 up (small sizes use 3.0, which every encoder accepts): [level_idc, MaxMBPS, MaxFS] (ITU-T H.264 Table A-1). */
const AVC_LEVELS: Array<[number, number, number]> = [
  [30, 40500, 1620],
  [31, 108000, 3600],
  [32, 216000, 5120],
  [40, 245760, 8192],
  [42, 522240, 8704],
  [50, 589824, 22080],
  [51, 983040, 36864],
  [52, 2073600, 36864],
  [60, 4177920, 139264],
  [61, 8355840, 139264],
  [62, 16711680, 139264],
];

/** `avc1.6400xx`: High profile at the lowest level that fits the size and rate. */
export function avcCodecString(width: number, height: number, fps: number): string {
  const fs = Math.ceil(width / 16) * Math.ceil(height / 16);
  const mbps = fs * fps;
  const level = AVC_LEVELS.find(([, maxMbps, maxFs]) => fs <= maxFs && mbps <= maxMbps)?.[0] ?? 62;
  return `avc1.6400${level.toString(16).padStart(2, '0')}`;
}

/** VP9 levels: [level, MaxLumaPictureSize, MaxLumaSampleRate] (VP9 bitstream spec, Annex A). */
const VP9_LEVELS: Array<[string, number, number]> = [
  ['10', 36864, 829440],
  ['11', 73728, 2764800],
  ['20', 122880, 4608000],
  ['21', 245760, 9216000],
  ['30', 552960, 20736000],
  ['31', 983040, 36864000],
  ['40', 2228224, 83558400],
  ['41', 2228224, 160432128],
  ['50', 8912896, 311951360],
  ['51', 8912896, 588251136],
  ['52', 8912896, 1176502272],
  ['60', 35651584, 1176502272],
  ['61', 35651584, 2353004544],
  ['62', 35651584, 4706009088],
];

/** `vp09.00.LL.08`: profile 0, 8-bit, the lowest level that fits size and luma rate. */
export function vp9CodecString(width: number, height: number, fps: number): string {
  const px = width * height;
  const level = VP9_LEVELS.find(([, maxPx, maxRate]) => px <= maxPx && px * fps <= maxRate)?.[0] ?? '62';
  return `vp09.00.${level}.08`;
}

/** AV1 levels: [seq_level_idx, MaxPicSize, MaxDisplayRate] (AV1 spec, Annex A.3). */
const AV1_LEVELS: Array<[number, number, number]> = [
  [0, 147456, 4423680],
  [1, 278784, 8363520],
  [4, 665856, 19975680],
  [5, 1065024, 31950720],
  [8, 2359296, 70778880],
  [9, 2359296, 141557760],
  [12, 8912896, 267386880],
  [13, 8912896, 534773760],
  [14, 8912896, 1069547520],
  [16, 35651584, 1069547520],
  [17, 35651584, 2139095040],
  [18, 35651584, 4278190080],
];

/** `av01.0.LLM.08`: main profile, main tier, 8-bit, the lowest level that fits. */
export function av1CodecString(width: number, height: number, fps: number): string {
  const px = width * height;
  const idx = AV1_LEVELS.find(([, maxPx, maxRate]) => px <= maxPx && px * fps <= maxRate)?.[0] ?? 18;
  return `av01.0.${String(idx).padStart(2, '0')}M.08`;
}

export function codecString(codec: VideoCodecId, width: number, height: number, fps: number): string {
  return codec === 'h264' ? avcCodecString(width, height, fps) : codec === 'vp9' ? vp9CodecString(width, height, fps) : av1CodecString(width, height, fps);
}

/**
 * Target bitrate (proposed table, decision 4): 1080p30 ≈ 8 Mbps, scaled by
 * pixels × fps, kept within 0.5–80 Mbps.
 */
export function videoBitrate(width: number, height: number, fps: number): number {
  const scaled = 8_000_000 * ((width * height) / (1920 * 1080)) * (fps / 30);
  return Math.round(Math.min(80_000_000, Math.max(500_000, scaled)));
}

export function probeConfig(codec: VideoCodecId, size: ProbeSize): ProbeConfig {
  return { codec: codecString(codec, size.width, size.height, size.fps), width: size.width, height: size.height, bitrate: videoBitrate(size.width, size.height, size.fps), framerate: size.fps };
}

async function supported(g: RasterGlobals, codec: VideoCodecId, size: ProbeSize): Promise<boolean> {
  try {
    const r = await g.VideoEncoder!.isConfigSupported(probeConfig(codec, size));
    return r?.supported === true;
  } catch {
    return false;
  }
}

/** Probe the browser. Never throws. */
export async function probeRaster(g: RasterGlobals = browserRasterGlobals(), size: ProbeSize = DEFAULT_PROBE_SIZE): Promise<RasterProbe> {
  const secureContext = g.isSecureContext === true;
  const webcodecs = secureContext && typeof g.VideoEncoder?.isConfigSupported === 'function';
  const offscreen = typeof g.OffscreenCanvas === 'function';
  if (!webcodecs) return { gif: true, png: true, webcodecs: false, h264: false, vp9: false, av1: false, offscreen, secureContext };
  const [h264, vp9, av1] = await Promise.all((['h264', 'vp9', 'av1'] as const).map((c) => supported(g, c, size)));
  return { gif: true, png: true, webcodecs, h264, vp9, av1, offscreen, secureContext };
}

/** Video containers and the codecs tried for each, in order (decision 4). */
export const CONTAINER_CODECS = {
  mp4: ['h264', 'av1'],
  webm: ['vp9', 'av1'],
} as const satisfies Record<string, readonly VideoCodecId[]>;

/** The first codec of the container the probe found, or null (container disabled). */
export function pickCodec(probe: RasterProbe, container: keyof typeof CONTAINER_CODECS): VideoCodecId | null {
  if (!probe.webcodecs) return null;
  return CONTAINER_CODECS[container].find((c) => probe[c]) ?? null;
}
