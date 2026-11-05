/**
 * MM116b: the request bodies of the focused tool panels, built in one place. The panels
 * (video-compressor, video-transform, video-trimmer, extract-audio, extract-video-only) call these
 * from their submit handlers, and Medi's confirmation card calls the very same functions to run a
 * job from the guide, so the card can never send a different request than the page would.
 */
import type { ConversionFormData } from '@/schemas/types';

import { LEVEL_CRF, LEVEL_QUALITY, type COMPRESSION_LEVELS, type COMPRESSION_RESOLUTIONS } from './fields';

type Level = (typeof COMPRESSION_LEVELS)[number];
type Resolution = (typeof COMPRESSION_RESOLUTIONS)[number];

export interface CompressorState {
  level: Level;
  /** The container actually sent (a locked page forces it). */
  format: string;
  codec: string;
  resolution: Resolution;
  stripAudio: boolean;
  /** '' = the level's own CRF. */
  crfOverride: number | '';
}

export function compressorRequest(s: CompressorState): ConversionFormData {
  const options: Record<string, unknown> = {
    format: s.format,
    quality: LEVEL_QUALITY[s.level],
    speed: 1,
    preserveAspectRatio: true,
    crf: s.crfOverride === '' ? LEVEL_CRF[s.level] : s.crfOverride,
    stripAudio: s.stripAudio,
  };
  // VP9 (WebM) is selected by the backend automatically; only forward an explicit codec for the
  // H.26x containers where the choice is meaningful.
  if (s.format !== 'webm') options.videoCodec = s.codec;
  if (s.resolution !== 'keep') options.height = Number(s.resolution);
  return options as unknown as ConversionFormData;
}

export interface TransformState {
  emphasis: 'crop' | 'resize' | 'rotate';
  format: string;
  width: number | '';
  height: number | '';
  preserveAspect: boolean;
  rotation: number;
  flipH: boolean;
  flipV: boolean;
  cropX: number;
  cropY: number;
  cropW: number | '';
  cropH: number | '';
}

/** Whether the transform has what it needs to run (the panel disables its button otherwise). */
export function transformValid(s: TransformState): boolean {
  const cropValid = s.emphasis !== 'crop' || (typeof s.cropW === 'number' && s.cropW > 0 && typeof s.cropH === 'number' && s.cropH > 0);
  const resizeValid = s.emphasis !== 'resize' || (typeof s.width === 'number' && s.width > 0) || (typeof s.height === 'number' && s.height > 0);
  return cropValid && resizeValid;
}

export function transformRequest(s: TransformState): ConversionFormData {
  const options: Record<string, unknown> = {
    format: s.format,
    quality: 'medium',
    speed: 1,
    preserveAspectRatio: s.emphasis === 'resize' ? s.preserveAspect : true,
  };
  if (s.emphasis === 'resize') {
    if (typeof s.width === 'number') options.width = s.width;
    if (typeof s.height === 'number') options.height = s.height;
  } else if (s.emphasis === 'rotate') {
    options.transform = { rotation: s.rotation, flipHorizontal: s.flipH, flipVertical: s.flipV };
  } else if (s.emphasis === 'crop') {
    options.transform = { crop: { x: s.cropX, y: s.cropY, width: Number(s.cropW), height: Number(s.cropH) } };
  }
  return options as unknown as ConversionFormData;
}

export function trimRequest(s: { format: string; start: number; end: number; reencode: boolean }) {
  return { mode: 'trim_video' as const, format: s.format, startTime: s.start, endTime: s.end, copyMode: s.reencode ? 'reencode' : 'auto' };
}

export const trimValid = (start: number, end: number) => end > start && start >= 0 && end - start >= 0.1;

export const extractAudioRequest = (format: string) => ({ mode: 'extract_audio' as const, format });
export const extractVideoOnlyRequest = (format: string) => ({ mode: 'extract_video_only' as const, format });
