import { describe as suite, expect, it } from 'vitest';
import { TOOL_PAGES } from '@/content/toolPages';
import { describe, extensionOf, kindOfFileName, kindOfOriginal, mimeForFileName, type ResultKind, type ResultMode } from './describe';

const job = (resultFileName?: string, extra: Record<string, unknown> = {}) => ({
  id: 'job-1',
  resultFileName,
  ...extra,
});

/** [task, mode, output file name, expected kind] - one row per task x plausible output. */
const MATRIX: Array<[string | undefined, ResultMode | undefined, string | undefined, ResultKind]> = [
  // Images
  ['image_converter', 'convert', 'photo.jpg', 'image'],
  ['image_converter', 'convert', 'photo.JPEG', 'image'],
  ['image_converter', 'convert', 'photo.png', 'image'],
  ['image_converter', 'convert', 'photo.webp', 'image'],
  ['image_converter', 'convert', 'photo.avif', 'image'],
  ['image_converter', 'convert', 'photo.bmp', 'image'],
  ['image_converter', 'convert', 'photo.tiff', 'image'],
  ['png_to_ico', 'convert', 'icon.ico', 'image'],
  ['png_to_svg', 'convert', 'logo.svg', 'image'],
  ['svg_to_png', 'convert', 'logo.png', 'image'],
  ['heic_to_jpg', 'convert', 'IMG_1.jpg', 'image'],
  ['avif_to_png', 'convert', 'a.png', 'image'],
  ['remove_background', 'convert', 'cutout.png', 'image'],
  ['remove_metadata', 'convert', 'clean.jpg', 'image'],
  ['image_resizer', 'convert', 'small.webp', 'image'],
  ['compress_image', 'convert', 'smaller.jpg', 'image'],
  // GIF
  ['video_to_gif', 'convert', 'clip.gif', 'gif'],
  ['mp4_to_gif', 'convert', 'clip.gif', 'gif'],
  ['gif_converter', 'convert', 'clip.gif', 'gif'],
  ['image_converter', 'convert', 'anim.gif', 'gif'],
  // Video
  ['video_converter', 'convert', 'out.mp4', 'video'],
  ['video_converter', 'convert', 'out.webm', 'video'],
  ['mov_to_mp4', 'convert', 'out.mp4', 'video'],
  ['mkv_to_mp4', 'convert', 'out.mp4', 'video'],
  ['avi_to_mp4', 'convert', 'out.mp4', 'video'],
  ['mp4_to_webm', 'convert', 'out.webm', 'video'],
  ['compress_video', 'convert', 'small.mp4', 'video'],
  ['crop_video', 'convert', 'crop.mov', 'video'],
  ['rotate_video', 'convert', 'rot.mkv', 'video'],
  ['remove_audio_from_video', 'convert', 'mute.mp4', 'video'],
  ['stitch_audio_to_video', 'convert', 'stitched.mp4', 'video'],
  ['ai_frame_interpolation', 'convert', 'smooth.mp4', 'video'],
  ['edit_video', 'convert', 'edit.avi', 'video'],
  // Audio
  ['audio_converter', 'convert', 'a.mp3', 'audio'],
  ['audio_converter', 'convert', 'a.wav', 'audio'],
  ['audio_converter', 'convert', 'a.m4a', 'audio'],
  ['wav_to_mp3', 'convert', 'a.mp3', 'audio'],
  ['extract_audio', 'convert', 'a.aac', 'audio'],
  ['mp4_to_mp3', 'convert', 'a.mp3', 'audio'],
  ['video_to_mp3', 'convert', 'a.flac', 'audio'],
  ['isolate_vocals', 'convert', 'vocals.ogg', 'audio'],
  ['audio_waveform', 'convert', 'wave.opus', 'audio'],
  // Transcripts and captions
  ['transcribe_video', 'transcribe', 'talk_transcript.txt', 'transcript'],
  ['transcribe_video', 'transcribe', 'talk_transcript.json', 'transcript'],
  ['transcribe_video', 'transcribe', 'talk_transcript.srt', 'captions'],
  ['transcribe_video', 'transcribe', 'talk_transcript.vtt', 'captions'],
  ['srt_generator', 'transcribe', 'talk.srt', 'captions'],
  ['caption_translator', 'convert', 'talk_es.srt', 'captions'],
  ['caption_translator', 'convert', 'talk_es.vtt', 'captions'],
  // txt/json outside a transcribe context is not a transcript
  ['image_converter', 'convert', 'data.json', 'unknown'],
  ['image_converter', 'convert', 'notes.txt', 'unknown'],
  // PDF
  ['image_to_pdf', 'convert', 'scan.pdf', 'pdf'],
  ['jpg_to_pdf', 'convert', 'scan.pdf', 'pdf'],
  ['pdf_converter', 'document', 'scan.pdf', 'pdf'],
  // PDF to image: single page is an image, all pages is a zip
  ['pdf_to_jpg', 'convert', 'doc_converted.jpg', 'image'],
  ['pdf_to_png', 'convert', 'doc_pages.zip', 'archive'],
  // Archives
  ['extract_frames', 'convert', 'frames.zip', 'archive'],
  ['extract_frames', 'convert', 'frames.tar.gz', 'archive'],
  ['extract_frames', 'convert', 'frames.tgz', 'archive'],
  ['pdf_to_jpg', 'convert', 'scan_pages.zip', 'archive'],
  ['transcode_to_dash', 'transcode', 'dash-package.zip', 'dash'],
  ['transcode_to_hls', 'transcode', 'hls-package.tgz', 'hls'],
  ['ai_video_restoration', 'transcode', 'restoration.tgz', 'hls'],
  ['ai_video_restoration', 'convert', 'restoration_results.tar.gz', 'archive'],
  // Transcode bundles
  ['transcode_to_hls', 'transcode', 'hls-package.tar.gz', 'hls'],
  ['transcode_to_dash', 'transcode', 'dash-package.tar.gz', 'dash'],
  ['transcode_to_hls', undefined, 'hls-package.zip', 'hls'],
  [undefined, 'transcode', 'package.tar.gz', 'hls'],
  // No file name from the API: task or mode decides
  ['transcribe_video', 'transcribe', undefined, 'transcript'],
  ['srt_generator', undefined, undefined, 'captions'],
  ['caption_translator', undefined, undefined, 'captions'],
  ['extract_frames', undefined, undefined, 'archive'],
  ['transcode_to_dash', 'transcode', undefined, 'dash'],
  ['compress_video', undefined, undefined, 'video'],
  ['audio_converter', undefined, undefined, 'audio'],
  // Unknown
  ['image_converter', 'convert', 'mystery.xyz', 'unknown'],
  ['image_converter', 'convert', undefined, 'unknown'],
  [undefined, undefined, undefined, 'unknown'],
];

suite('describe() kind matrix', () => {
  it('has at least 40 rows', () => {
    expect(MATRIX.length).toBeGreaterThanOrEqual(40);
  });

  it.each(MATRIX)('task=%s mode=%s file=%s -> %s', (task, mode, fileName, expected) => {
    expect(describe({ job: job(fileName), task, mode }).kind).toBe(expected);
  });
});

suite('describe() details', () => {
  it('never reads Content-Type: a lying resultMime does not change the kind', () => {
    const d = describe({ job: job('clip.mp4', { resultMime: 'text/plain' }), task: 'compress_video' });
    expect(d.kind).toBe('video');
  });

  it('prefers a usable server MIME and flags it; ignores octet-stream', () => {
    const real = describe({ job: job('clip.mp4', { resultMime: 'video/mp4' }) });
    expect(real.mime).toBe('video/mp4');
    expect(real.mimeFromServer).toBe(true);
    const octet = describe({ job: job('clip.mp4', { resultMime: 'application/octet-stream' }) });
    expect(octet.mime).toBe('video/mp4');
    expect(octet.mimeFromServer).toBe(false);
  });

  it('falls back to the extension MIME table and to octet-stream', () => {
    expect(describe({ job: job('a.webp') }).mime).toBe('image/webp');
    expect(describe({ job: job('a.qqq') }).mime).toBe('application/octet-stream');
  });

  it('uses the kind hint only when nothing else decides', () => {
    expect(describe({ job: job(undefined), kindHint: 'video' }).kind).toBe('video');
    expect(describe({ job: job('a.mp3'), kindHint: 'video' }).kind).toBe('audio');
  });

  it('carries job fields and builds a download url', () => {
    const d = describe({
      job: job('a.mp4', { resultSizeBytes: 123, expiresAt: '2026-10-24T00:00:00Z' }),
      fallbackFileName: 'ignored.mp4',
    });
    expect(d.jobId).toBe('job-1');
    expect(d.fileName).toBe('a.mp4');
    expect(d.sizeBytes).toBe(123);
    expect(d.expiresAt).toBe('2026-10-24T00:00:00Z');
    expect(d.downloadUrl.endsWith('/download/job-1')).toBe(true);
  });

  it('uses the fallback file name when the job has none', () => {
    expect(describe({ job: job(undefined), fallbackFileName: 'x_stitched.mp4' }).fileName).toBe('x_stitched.mp4');
  });

  it('attaches an original only for a real file', () => {
    const real = new File(['abc'], 'in.png', { type: 'image/png' });
    const placeholder = new File([], 'temp');
    expect(describe({ job: job('a.png'), originalFile: real }).original?.kind).toBe('image');
    expect(describe({ job: job('a.png'), originalFile: placeholder }).original).toBeUndefined();
    expect(describe({ job: job('a.png') }).original).toBeUndefined();
  });

  it('extensionOf handles tar.gz, case and missing extensions', () => {
    expect(extensionOf('A.TAR.GZ')).toBe('tar.gz');
    expect(extensionOf('a.b.mp4')).toBe('mp4');
    expect(extensionOf('noext')).toBe('');
    expect(extensionOf('.hidden')).toBe('');
    expect(extensionOf(undefined)).toBe('');
  });

  it('kindOfOriginal reads the MIME type, then the extension', () => {
    expect(kindOfOriginal(new File(['x'], 'a.gif', { type: 'image/gif' }))).toBe('gif');
    expect(kindOfOriginal(new File(['x'], 'a.bin', { type: 'audio/mpeg' }))).toBe('audio');
    expect(kindOfOriginal(new File(['x'], 'a.srt', { type: '' }))).toBe('captions');
    expect(kindOfOriginal(null)).toBe('unknown');
  });
});

/**
 * A plausible output file for a tool page, from its embed config. This is the same
 * derivation the matrix uses by hand: locked/default output formats first, then what the
 * task fixes (transcode tarball, frames zip, transcript, ...).
 */
export function plausibleOutput(embed: (typeof TOOL_PAGES)[number]['embed']): {
  fileName?: string;
  mode: ResultMode;
} {
  if (embed.transcodeMode) return { fileName: 'package.tar.gz', mode: 'transcode' };
  if (embed.transcribeMode) return { fileName: `out.${embed.defaultOutputFormat ?? 'srt'}`, mode: 'transcribe' };
  if (embed.defaultTask === 'extract_frames') return { fileName: 'frames.zip', mode: 'convert' };
  if (embed.defaultTask === 'ai_video_restoration') return { fileName: 'results.tar.gz', mode: 'convert' };
  if (embed.defaultTask === 'caption_translator') return { fileName: 'out.srt', mode: 'convert' };
  const ext =
    embed.lockedExtractAudioFormat ??
    embed.defaultExtractAudioFormat ??
    embed.lockedVideoOutputFormat ??
    embed.defaultVideoOutputFormat ??
    embed.lockedOutputFormat ??
    embed.defaultOutputFormat ??
    embed.pdfDefaultOutputFormat;
  return { fileName: ext ? `out.${ext}` : undefined, mode: embed.defaultMediaKind === 'pdf' ? 'document' : 'convert' };
}

suite('describe() over content/toolPages.ts', () => {
  it('covers every embed.defaultTask with a non-unknown kind (or a documented hint)', () => {
    const unknown: string[] = [];
    for (const page of TOOL_PAGES) {
      const { fileName, mode } = plausibleOutput(page.embed);
      const kind = describe({
        job: job(fileName),
        task: page.embed.defaultTask,
        mode,
        kindHint: page.embed.defaultMediaKind === 'pdf' ? undefined : (page.embed.defaultMediaKind as ResultKind),
      }).kind;
      if (kind === 'unknown') unknown.push(page.slug);
    }
    expect(unknown).toEqual([]);
  });
});

suite('archive entry helpers (MM04)', () => {
  it('kindOfFileName classifies entries by extension, never hls/dash', () => {
    expect(kindOfFileName('frames/f1.PNG')).toBe('image');
    expect(kindOfFileName('a/b.mp4')).toBe('video');
    expect(kindOfFileName('master.m3u8')).toBe('metadata');
    expect(kindOfFileName('x.tar.gz')).toBe('archive');
    expect(kindOfFileName('README')).toBe('unknown');
  });
  it('mimeForFileName knows stream parts', () => {
    expect(mimeForFileName('a.m3u8')).toBe('application/vnd.apple.mpegurl');
    expect(mimeForFileName('a.mpd')).toBe('application/dash+xml');
    expect(mimeForFileName('s.m4s')).toBe('video/mp4');
    expect(mimeForFileName('s.ts')).toBe('video/mp2t');
  });
});
