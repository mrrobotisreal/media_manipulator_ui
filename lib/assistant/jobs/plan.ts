/**
 * MM116b: can Medi's confirmation card run this job in the guide, and with which request?
 *
 * "Run" is only offered for the tool families whose panel request is built by a pure function
 * (`toolOptions/requests.ts`, shared with the panel itself) and whose submit hook already exists:
 * the video compressor, resize / rotate / crop, the trimmer, extract-audio, remove-audio and the
 * transcribers. Every other family (the image / audio / video converter forms, the AI tools,
 * summaries, captions, waveform, frames, stitch, HLS/DASH) is built by a react-hook-form whose
 * state is private to its component, so the card sends the visitor to the tool page with the
 * same settings prefilled (`?o=`) and the visitor picks the file and presses the page's own button.
 */
import type { OptionValues } from '@/lib/assistant/toolOptions/codec';
import {
  compressorRequest,
  extractAudioRequest,
  extractVideoOnlyRequest,
  transformRequest,
  transformValid,
  trimRequest,
  trimValid,
} from '@/lib/assistant/toolOptions/requests';
import type { ConversionFormData } from '@/schemas/types';
import type { SpecializedToolOptions } from '@/lib/useSpecializedMediaTool';
import type { TranscribeFormData, TranscribeOutputFormat } from '@/lib/useTranscribeFile';

/** The slice of a tool page's `embed` config the requests read. */
export interface JobEmbed {
  defaultMediaKind?: string;
  defaultOutputFormat?: string;
  lockedVideoOutputFormat?: string;
  defaultVideoOutputFormat?: string;
  defaultVideoCompressionPreset?: string;
  defaultVideoCodec?: string;
  defaultVideoWidth?: number;
  defaultVideoHeight?: number;
  defaultExtractAudioFormat?: string;
  lockedExtractAudioFormat?: string;
  defaultTransform?: { rotation?: number; crop?: { x: number; y: number; width: number; height: number } };
}

export type FileKind = 'image' | 'video' | 'audio' | 'pdf';

export type JobPlan =
  | { submit: 'convert'; needs: FileKind[]; request: ConversionFormData }
  | { submit: 'specialized'; needs: FileKind[]; request: SpecializedToolOptions }
  | { submit: 'transcribe'; needs: FileKind[]; request: TranscribeFormData };

/** Families the guide can run. Everything else opens the tool page. */
export const RUNNABLE_FAMILIES = [
  'video:compress',
  'video:resize',
  'video:rotate',
  'video:crop',
  'video:trim',
  'video:extract-audio',
  'video:extract-video-only',
  'transcribe',
] as const;

const str = (v: unknown): string | undefined => (typeof v === 'string' && v ? v : undefined);
const numOf = (v: unknown): number | undefined => (typeof v === 'number' && Number.isFinite(v) ? v : undefined);

const COMPRESSION_LEVELS = ['smallest', 'balanced', 'high_quality'] as const;
const RESOLUTIONS = ['keep', '1080', '720', '480'] as const;

/**
 * The request the tool page would send for these options, or null when the family cannot run here
 * (or the options leave out something the page would ask the visitor for, like a trim range).
 */
export function planJob(family: string, o: OptionValues, embed: JobEmbed): JobPlan | null {
  const videoFormat = embed.lockedVideoOutputFormat ?? str(o.format) ?? embed.defaultVideoOutputFormat ?? 'mp4';
  switch (family) {
    case 'video:compress': {
      const level = (COMPRESSION_LEVELS as readonly string[]).includes(str(o.level) ?? '') ? (o.level as (typeof COMPRESSION_LEVELS)[number]) : ((COMPRESSION_LEVELS as readonly string[]).includes(embed.defaultVideoCompressionPreset ?? '') ? (embed.defaultVideoCompressionPreset as (typeof COMPRESSION_LEVELS)[number]) : 'balanced');
      const resolution = (RESOLUTIONS as readonly string[]).includes(str(o.resolution) ?? '') ? (o.resolution as (typeof RESOLUTIONS)[number]) : 'keep';
      return {
        submit: 'convert',
        needs: ['video'],
        request: compressorRequest({
          level,
          format: embed.lockedVideoOutputFormat ?? str(o.format) ?? embed.defaultVideoOutputFormat ?? 'mp4',
          codec: str(o.codec) ?? embed.defaultVideoCodec ?? 'h264',
          resolution,
          stripAudio: o.stripAudio === true,
          crfOverride: numOf(o.crf) ?? '',
        }),
      };
    }
    case 'video:resize':
    case 'video:rotate':
    case 'video:crop': {
      const emphasis = family === 'video:resize' ? 'resize' : family === 'video:rotate' ? 'rotate' : 'crop';
      const crop = embed.defaultTransform?.crop;
      const state = {
        emphasis,
        format: videoFormat,
        width: numOf(o.width) ?? embed.defaultVideoWidth ?? ('' as const),
        height: numOf(o.height) ?? embed.defaultVideoHeight ?? ('' as const),
        preserveAspect: typeof o.preserveAspectRatio === 'boolean' ? o.preserveAspectRatio : true,
        rotation: numOf(o.rotation) ?? embed.defaultTransform?.rotation ?? 90,
        flipH: o.flipHorizontal === true,
        flipV: o.flipVertical === true,
        cropX: numOf(o.cropX) ?? crop?.x ?? 0,
        cropY: numOf(o.cropY) ?? crop?.y ?? 0,
        cropW: numOf(o.cropWidth) ?? crop?.width ?? ('' as const),
        cropH: numOf(o.cropHeight) ?? crop?.height ?? ('' as const),
      } as const;
      if (!transformValid(state)) return null;
      return { submit: 'convert', needs: ['video'], request: transformRequest(state) };
    }
    case 'video:trim': {
      const start = numOf(o.startTime) ?? 0;
      const end = numOf(o.endTime);
      // The page fills the end from the file's duration; without it the visitor must set the range there.
      if (end === undefined || !trimValid(start, end)) return null;
      return { submit: 'specialized', needs: ['video'], request: trimRequest({ format: videoFormat, start, end, reencode: o.reencode === true }) };
    }
    case 'video:extract-audio':
      return {
        submit: 'specialized',
        needs: ['video'],
        request: extractAudioRequest(embed.lockedExtractAudioFormat ?? str(o.format) ?? embed.defaultExtractAudioFormat ?? 'mp3'),
      };
    case 'video:extract-video-only':
      return { submit: 'specialized', needs: ['video'], request: extractVideoOnlyRequest(o.format === 'webm' ? 'webm' : 'mp4') };
    case 'transcribe': {
      const fmt = [str(o.format), embed.defaultOutputFormat].find((f): f is TranscribeOutputFormat => f === 'vtt' || f === 'srt' || f === 'txt' || f === 'json');
      const language = str(o.language)?.trim();
      return {
        submit: 'transcribe',
        needs: ['audio', 'video'],
        request: { mode: 'transcribe', format: fmt ?? 'vtt', ...(language ? { language } : {}) },
      };
    }
    default:
      return null;
  }
}

/** Why a card falls back to "Open the tool" (for the log line and the card's note). */
export type RunBlock = 'no_file' | 'wrong_kind' | 'unsupported' | 'quota_exhausted';

export function runBlock(plan: JobPlan | null, file: { kind: FileKind | 'unknown' } | null, quotaExhausted: boolean): RunBlock | null {
  if (!plan) return 'unsupported';
  if (!file) return 'no_file';
  if (file.kind === 'unknown' || !plan.needs.includes(file.kind)) return 'wrong_kind';
  if (quotaExhausted) return 'quota_exhausted';
  return null;
}

/** The suggested name of the result file (the panels name it the same way). */
export function resultFileName(plan: JobPlan, file: File): string {
  const base = file.name.includes('.') ? file.name.slice(0, file.name.lastIndexOf('.')) : file.name;
  const r = plan.request as unknown as { format?: string };
  return `${base}${plan.submit === 'transcribe' ? '_transcript' : ''}.${r.format ?? 'mp4'}`;
}
