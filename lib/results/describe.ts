import { getBaseURL } from '@/lib/utils';

/**
 * Result descriptor: the pure answer to "what did this job produce?".
 *
 * Every tool surface (home, tool landing pages, specialized shell, bespoke panels) hands a
 * finished job to `describe()` and gets back one `ResultDescriptor`, which `ResultPanel`
 * renders. Nothing here touches the network, the DOM or React, so the whole task x output
 * matrix is unit-testable (see describe.test.ts).
 *
 * THE KIND COMES FROM THE FILE NAME, NOT FROM Content-Type. `GET /download/:jobId` always
 * answers `application/octet-stream`; the only honest signal is the job's `resultFileName`
 * extension, then (when the API did not name the file) the task or workflow mode.
 * See docs/design/RESULT_VIEWERS.md section 3 and ADR-0006.
 */

export type ResultKind =
  | 'image'
  | 'video'
  | 'gif'
  | 'audio'
  | 'transcript'
  | 'captions'
  | 'pdf'
  | 'archive'
  | 'hls'
  | 'dash'
  | 'metadata'
  | 'unknown';

/** Workflow mode of the job. Mirrors the home converter's modes; anything else is `convert`. */
export type ResultMode = 'convert' | 'transcribe' | 'transcode' | 'document' | (string & {});

/** The slice of a job `describe()` reads. Both ConversionJob and TranscodeJob satisfy it. */
export interface DescribableJob {
  id: string;
  resultFileName?: string;
  resultSizeBytes?: number;
  expiresAt?: string;
  /**
   * Server-sniffed MIME (MM05, additive). Feature-detected: absent on older APIs, and
   * `application/octet-stream` is treated as absent.
   */
  resultMime?: string;
  /** Present on jobs that already carry a download URL; otherwise derived from the id. */
  resultUrl?: string;
}

export interface ResultOriginal {
  file: File | null;
  /** Object URL for the original, when the caller already made one. */
  objectUrl?: string;
  kind: ResultKind;
}

export interface ResultDescriptor {
  kind: ResultKind;
  mime: string;
  fileName: string;
  sizeBytes?: number;
  jobId: string;
  downloadUrl: string;
  expiresAt?: string;
  /** True when `job.resultMime` was a usable MIME (inline-streaming viewers may use it). */
  mimeFromServer: boolean;
  /** Set when an original exists to compare against. */
  original?: ResultOriginal;
  sidecars?: { transcript?: string; analysis?: string; manifest?: string };
}

export interface DescribeInput {
  job: DescribableJob;
  originalFile?: File | null;
  /** The EmbeddedTask (`compress_video`, `transcribe_video`, ...) when the surface has one. */
  task?: string;
  mode?: ResultMode;
  /** Used only when no extension and no task decide the kind (specialized `previewConfig`). */
  kindHint?: ResultKind;
  /** Name to show when the API sent no `resultFileName` (the surface's suggested name). */
  fallbackFileName?: string;
}

const IMAGE_EXT = new Set(['jpg', 'jpeg', 'png', 'webp', 'avif', 'bmp', 'tiff', 'tif', 'ico', 'svg', 'heic']);
const VIDEO_EXT = new Set(['mp4', 'webm', 'mov', 'mkv', 'avi', 'm4v']);
const AUDIO_EXT = new Set(['mp3', 'wav', 'm4a', 'aac', 'flac', 'ogg', 'opus']);
const ARCHIVE_EXT = new Set(['zip', 'tar.gz', 'tgz']);

const MIME_BY_EXT: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  avif: 'image/avif',
  bmp: 'image/bmp',
  tiff: 'image/tiff',
  tif: 'image/tiff',
  ico: 'image/x-icon',
  svg: 'image/svg+xml',
  heic: 'image/heic',
  gif: 'image/gif',
  mp4: 'video/mp4',
  m4v: 'video/mp4',
  webm: 'video/webm',
  mov: 'video/quicktime',
  mkv: 'video/x-matroska',
  avi: 'video/x-msvideo',
  mp3: 'audio/mpeg',
  wav: 'audio/wav',
  m4a: 'audio/mp4',
  aac: 'audio/aac',
  flac: 'audio/flac',
  ogg: 'audio/ogg',
  opus: 'audio/opus',
  srt: 'application/x-subrip',
  vtt: 'text/vtt',
  txt: 'text/plain',
  json: 'application/json',
  pdf: 'application/pdf',
  zip: 'application/zip',
  'tar.gz': 'application/gzip',
  tgz: 'application/gzip',
};

/**
 * Lower-cased extension of a file name. `.tar.gz` is one extension; everything else is the
 * text after the last dot. Returns '' for names without one.
 */
export function extensionOf(fileName: string | undefined): string {
  const name = (fileName ?? '').trim().toLowerCase();
  if (!name) return '';
  if (name.endsWith('.tar.gz')) return 'tar.gz';
  const dot = name.lastIndexOf('.');
  if (dot <= 0 || dot === name.length - 1) return '';
  return name.slice(dot + 1);
}

/**
 * Kind of a task whose output type is fixed, used only when the job named no file.
 * Converter tasks whose output depends on the chosen format are deliberately absent: with no
 * extension and no hint those are `unknown` rather than a guess.
 */
const KIND_BY_TASK: Record<string, ResultKind> = {
  transcribe_video: 'transcript',
  srt_generator: 'captions',
  caption_translator: 'captions',
  caption_translate: 'captions',
  extract_frames: 'archive',
  transcode_to_hls: 'hls',
  transcode_to_dash: 'dash',
  ai_video_restoration: 'archive',
  stitch_audio_to_video: 'video',
  ai_frame_interpolation: 'video',
  compress_video: 'video',
  video_compressor: 'video',
  compress_mp4: 'video',
  video_trimmer: 'video',
  mp4_trimmer: 'video',
  video_cutter: 'video',
  cut_video_online: 'video',
  crop_video: 'video',
  resize_video: 'video',
  rotate_video: 'video',
  remove_audio_from_video: 'video',
  extract_video_only: 'video',
  video_to_gif: 'gif',
  mp4_to_gif: 'gif',
  extract_audio: 'audio',
  mp4_to_mp3: 'audio',
  video_to_mp3: 'audio',
  wav_to_mp3: 'audio',
  isolate_vocals: 'audio',
  audio_converter: 'audio',
  image_to_pdf: 'pdf',
  jpg_to_pdf: 'pdf',
  png_to_pdf: 'pdf',
  remove_background: 'image',
  image_resizer: 'image',
  compress_image: 'image',
  png_to_jpg: 'image',
  jpg_to_png: 'image',
  webp_to_jpg: 'image',
  webp_to_png: 'image',
  png_to_webp: 'image',
  jpg_to_webp: 'image',
  heic_to_jpg: 'image',
  avif_to_jpg: 'image',
  avif_to_png: 'image',
  svg_to_png: 'image',
  png_to_svg: 'image',
  png_to_ico: 'image',
  mov_to_mp4: 'video',
  webm_to_mp4: 'video',
  avi_to_mp4: 'video',
  mkv_to_mp4: 'video',
  mp4_to_webm: 'video',
  mp4_converter: 'video',
};

const isUsableMime = (mime: string | undefined): mime is string =>
  !!mime && !/^application\/octet-stream/i.test(mime.trim());

function isDashTask(task: string | undefined, mode: string | undefined): boolean {
  return /dash/i.test(task ?? '') || /dash/i.test(mode ?? '');
}

/** Kind of a file by extension alone, given the workflow context. `null` = undecided. */
function kindFromExtension(
  ext: string,
  ctx: { task?: string; mode?: string },
): ResultKind | null {
  if (!ext) return null;
  if (ext === 'gif') return 'gif';
  if (IMAGE_EXT.has(ext)) return 'image';
  if (VIDEO_EXT.has(ext)) return 'video';
  if (AUDIO_EXT.has(ext)) return 'audio';
  if (ext === 'srt' || ext === 'vtt') return 'captions';
  if (ext === 'pdf') return 'pdf';
  if (ext === 'txt' || ext === 'json') {
    const transcribing = ctx.mode === 'transcribe' || KIND_BY_TASK[ctx.task ?? ''] === 'transcript';
    return transcribing ? 'transcript' : null;
  }
  if (ARCHIVE_EXT.has(ext)) {
    // A transcode job's package is a tarball, but it is an HLS/DASH bundle, not a gallery.
    if (ctx.mode === 'transcode' || /^transcode_to_/.test(ctx.task ?? '')) {
      return isDashTask(ctx.task, ctx.mode) ? 'dash' : 'hls';
    }
    return 'archive';
  }
  return null;
}

/** Mime for a descriptor: the server's when usable, else the extension table, else octet-stream. */
function mimeFor(job: DescribableJob, ext: string): { mime: string; fromServer: boolean } {
  if (isUsableMime(job.resultMime)) return { mime: job.resultMime.trim(), fromServer: true };
  return { mime: MIME_BY_EXT[ext] ?? 'application/octet-stream', fromServer: false };
}

/** Kind of an uploaded original, for the compare modes. */
export function kindOfOriginal(file: File | null | undefined): ResultKind {
  if (!file) return 'unknown';
  const type = file.type || '';
  if (type === 'image/gif') return 'gif';
  if (type.startsWith('image/')) return 'image';
  if (type.startsWith('video/')) return 'video';
  if (type.startsWith('audio/')) return 'audio';
  if (type === 'application/pdf') return 'pdf';
  return kindFromExtension(extensionOf(file.name), {}) ?? 'unknown';
}

export function describe(input: DescribeInput): ResultDescriptor {
  const { job, originalFile, task, mode, kindHint, fallbackFileName } = input;
  const fileName = job.resultFileName || fallbackFileName || `result-${job.id}`;
  const ext = extensionOf(job.resultFileName || fallbackFileName);
  const ctx = { task, mode };

  // Extension first, then the task, then the surface's hint; Content-Type is never consulted.
  const kind: ResultKind =
    kindFromExtension(ext, ctx) ??
    (mode === 'transcode' ? (isDashTask(task, mode) ? 'dash' : 'hls') : null) ??
    (task ? KIND_BY_TASK[task] : undefined) ??
    (mode === 'transcribe' ? 'transcript' : null) ??
    kindHint ??
    'unknown';

  const { mime, fromServer } = mimeFor(job, ext);
  const original: ResultOriginal | undefined =
    originalFile && originalFile.size > 0
      ? { file: originalFile, kind: kindOfOriginal(originalFile) }
      : undefined;

  return {
    kind,
    mime,
    fileName,
    sizeBytes: job.resultSizeBytes,
    jobId: job.id,
    downloadUrl: job.resultUrl || `${getBaseURL()}/download/${job.id}`,
    expiresAt: job.expiresAt,
    mimeFromServer: fromServer,
    original,
  };
}
