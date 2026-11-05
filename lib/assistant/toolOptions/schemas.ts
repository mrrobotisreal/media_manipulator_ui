/**
 * MM116a: the option schema of every tool page, derived from the same embed config the page
 * renders with. `optionsSpecFor(input)` is called by the exporter (from a `ToolPageContent.embed`)
 * and by the embedded panel (from its props), so the schema Medi reads, the `?o=` validator and
 * the form prefill cannot drift apart. Panels read their ranges from the constants in
 * `fields.ts` / this file; `prefill.test.ts` also proves every prefill value passes the form's
 * own (Zod v3) schema at both ends of each range.
 *
 * A tool without options has `{ kind: 'none', reason }` (editors and the custom multi-step pages).
 */
import { z } from 'zod/v4';

import {
  AUDIO_FORMATS,
  COMPRESSOR_CODEC_CHOICES,
  COMPRESSOR_CRF,
  COMPRESSOR_FORMATS,
  COMPRESSION_LEVELS,
  COMPRESSION_RESOLUTIONS,
  EXTRACT_AUDIO_FORMATS,
  GRAVITIES,
  IMAGE_FILTERS,
  IMAGE_FORMATS,
  LEVEL_CRF,
  OptionsSchema,
  VIDEO_FORMATS,
  bool,
  field,
  int,
  num,
  pick,
  strict,
  text,
  type OptionShape,
} from './fields';

/** The subset of a tool page's embed config (and of the panel's props) that decides its options. */
export interface OptionsSpecInput {
  /** The tool page slug when known (the exporter passes it; panels may not). */
  slug?: string;
  defaultMediaKind: 'image' | 'video' | 'audio' | 'pdf' | 'document' | string;
  defaultTask?: string;
  preset?: { kind: string; panel?: string; aiOperation?: string; effect?: string } | undefined;
  lockedOutputFormat?: string;
  lockedVideoOutputFormat?: string;
  lockedExtractAudioFormat?: string;
  defaultAIImageOperation?: string;
  lockedAIImageOperation?: boolean;
  pdfLockOutputFormat?: boolean;
  transcribeMode?: boolean;
  transcodeMode?: boolean;
  transcodeProtocol?: string;
  transcodeLockProtocol?: boolean;
}

export type OptionsSpec =
  | { kind: 'none'; reason: string }
  | { kind: 'options'; family: string; schema: OptionsSchema };

const none = (reason: string): OptionsSpec => ({ kind: 'none', reason });
const spec = (family: string, shape: OptionShape): OptionsSpec => ({ kind: 'options', family, schema: strict(shape) });

/** Tasks whose page is an editor or a custom multi-step flow with no single request to prefill. */
const NO_OPTIONS_SLUGS: Record<string, string> = {
  'ai-image-restoration': 'A multi-model comparison flow with its own crop and model pickers.',
  'ai-document-scan': 'A multi-page scan flow with its own page ordering; there is nothing to prefill.',
  'ai-video-restoration': 'A multi-model comparison flow with its own snippet and model pickers.',
};

const NO_OPTIONS: Record<string, string> = {
  edit_video: 'Darkroom is an editor; Medi edits it through its copilot, not through options.',
  motion_editor: 'Motion is an editor; Medi edits it through its copilot, not through options.',
  photo_editor: 'Aperture is an editor; Medi edits it through its copilot, not through options.',
  inspect_metadata: 'Shows every tag of a file; there is nothing to configure.',
  voice_clone: 'Needs a consent step and a recording; it cannot be prefilled.',
  voice_design: 'A free-form voice description flow; it cannot be prefilled.',
  voice_convert: 'Pick a saved voice or preset in the page; it cannot be prefilled.',
  ai_video_restoration: 'A multi-model comparison flow with its own snippet and model pickers.',
};

const imageBase = (locked: boolean, defaultFormat = 'jpg'): OptionShape => ({
  ...(locked ? {} : { format: pick(IMAGE_FORMATS, { label: 'Output format', default: defaultFormat }) }),
  quality: int(1, 100, { label: 'Quality', description: 'JPG and WebP quality; higher is larger and sharper.', unit: 'percent', default: 85 }),
  width: int(1, 4096, { label: 'Width', unit: 'px', description: 'Target width; leave out to keep the original.' }),
  height: int(1, 4096, { label: 'Height', unit: 'px', description: 'Target height; leave out to keep the original.' }),
});

function imageSpec(p: OptionsSpecInput): OptionsSpec {
  const locked = !!p.lockedOutputFormat;
  const shape: OptionShape = { ...imageBase(locked) };
  const effect = p.preset?.kind === 'image_effect' ? p.preset.effect : undefined;
  const ai = p.defaultAIImageOperation ?? 'none';
  const family = `image:${ai !== 'none' ? ai : effect ?? 'convert'}`;
  Object.assign(shape, {
    filter: pick(IMAGE_FILTERS, { label: 'Filter', description: 'One effect applied before export.', default: 'none' }),
    metadataMode: pick(['keep', 'strip', 'custom'] as const, { label: 'Metadata', description: 'strip removes EXIF, GPS and other tags.', default: 'keep' }),
  });
  if (effect === 'text') {
    Object.assign(shape, {
      overlayText: text(500, { label: 'Text', description: 'Words drawn over the picture.' }),
      textSize: int(8, 512, { label: 'Text size', unit: 'px', default: 48 }),
      textColor: text(20, { label: 'Text colour', description: 'CSS hex such as #ffffff.', default: '#ffffff' }),
      textGravity: pick(GRAVITIES, { label: 'Text position', default: 'South' }),
    });
  }
  if (ai === 'face_privacy') Object.assign(shape, { faceMode: pick(['blur', 'pixelate', 'blackbox'] as const, { label: 'Face effect', default: 'blur' }) });
  if (ai === 'ai_upscale') Object.assign(shape, { upscaleScale: field(z.union([z.literal(2), z.literal(4)]), { label: 'Upscale factor', description: '2 or 4 times larger.', default: 4 }) });
  if (ai === 'redact_text') {
    Object.assign(shape, {
      textDetect: pick(['pii', 'all-text'] as const, { label: 'What to hide', description: 'pii = personal details only; all-text = every piece of text.', default: 'pii' }),
      textRedaction: pick(['blackbox', 'blur', 'pixelate'] as const, { label: 'Redaction style', default: 'blackbox' }),
    });
  }
  if (ai === 'none' && !locked) {
    Object.assign(shape, { vectorizeThreshold: int(1, 99, { label: 'Trace threshold', description: 'Only for SVG output: lower keeps less, higher keeps more.', default: 50 }) });
  }
  return spec(family, shape);
}

function videoSpec(p: OptionsSpecInput): OptionsSpec {
  const locked = !!p.lockedVideoOutputFormat;
  const shape: OptionShape = {
    ...(locked ? {} : { format: pick(VIDEO_FORMATS, { label: 'Output format', default: 'mp4' }) }),
    quality: pick(['low', 'medium', 'high'] as const, { label: 'Quality', default: 'medium' }),
    width: int(1, 4096, { label: 'Width', unit: 'px' }),
    height: int(1, 4096, { label: 'Height', unit: 'px' }),
    preserveAspectRatio: bool({ label: 'Keep aspect ratio', default: true }),
    speed: num(0.25, 4, { label: 'Speed', unit: 'x', default: 1, description: '0.5 is half speed, 2 is double.' }),
    reverse: bool({ label: 'Reverse', default: false }),
    flipHorizontal: bool({ label: 'Flip horizontally', default: false }),
    flipVertical: bool({ label: 'Flip vertically', default: false }),
    stabilize: bool({ label: 'Stabilize', default: false }),
    targetFps: int(1, 120, { label: 'Frame rate', unit: 'fps', description: 'Converts to this frame rate.' }),
    brightness: num(-100, 100, { label: 'Brightness', default: 0 }),
    contrast: num(-100, 100, { label: 'Contrast', default: 0 }),
    saturation: num(-100, 100, { label: 'Saturation', default: 0 }),
    gifWidth: int(16, 2000, { label: 'GIF width', unit: 'px', default: 900, description: 'Only for GIF output.' }),
    gifFps: int(1, 50, { label: 'GIF frame rate', unit: 'fps', default: 12, description: 'Only for GIF output.' }),
    gifColors: int(2, 256, { label: 'GIF colours', default: 128, description: 'Only for GIF output.' }),
  };
  if (p.preset?.kind === 'video' && p.preset.aiOperation === 'frame_interpolation') {
    return spec('video:interpolate', {
      aiTargetFps: field(z.union([z.literal(48), z.literal(60), z.literal(120)]), { label: 'Target frame rate', unit: 'fps', default: 60, description: 'Frames per second after AI interpolation: 48, 60 or 120.' }),
    });
  }
  return spec('video:convert', shape);
}

function audioSpec(p: OptionsSpecInput): OptionsSpec {
  const aiOp = p.preset?.kind === 'audio' ? p.preset.aiOperation : undefined;
  if (aiOp === 'isolate_vocals' || aiOp === 'remove_vocals') {
    return spec('audio:stems', { stemFormat: pick(['auto', 'mp3', 'flac', 'wav'] as const, { label: 'Output format', description: 'auto keeps the input format.', default: 'auto' }) });
  }
  if (aiOp) return spec('audio:ai', { format: pick(AUDIO_FORMATS, { label: 'Output format', default: 'mp3' }) });
  const locked = !!p.lockedOutputFormat;
  return spec('audio:convert', {
    ...(locked ? {} : { format: pick(AUDIO_FORMATS, { label: 'Output format', default: 'mp3' }) }),
    bitrate: pick(['128', '192', '256', '320', '512', '1024'] as const, { label: 'Bitrate', unit: 'kbps', default: '192' }),
    sampleRate: pick(['22050', '44100', '48000', '96000', '192000'] as const, { label: 'Sample rate', unit: 'Hz', default: '44100' }),
    channels: pick(['mono', 'stereo', '5.1', '7.1'] as const, { label: 'Channels', default: 'stereo' }),
    speed: num(0.25, 4, { label: 'Speed', unit: 'x', default: 1 }),
    volume: num(0.1, 2, { label: 'Volume', unit: 'x', default: 1, description: '1 is unchanged, 2 is twice as loud.' }),
    normalize: bool({ label: 'Normalize loudness', default: false }),
    pitchSemitones: num(-24, 24, { label: 'Pitch shift', unit: 'semitones', default: 0 }),
    equalizerPreset: pick(['none', 'bass-boost', 'treble-boost', 'vocal', 'classical', 'rock', 'jazz'] as const, { label: 'Equalizer', default: 'none' }),
    reverbType: pick(['none', 'room', 'hall', 'plate', 'spring'] as const, { label: 'Reverb', default: 'none' }),
    fadeIn: num(0, 30, { label: 'Fade in', unit: 's', default: 0 }),
    fadeOut: num(0, 30, { label: 'Fade out', unit: 's', default: 0 }),
    trimStart: num(0, 86400, { label: 'Trim start', unit: 's' }),
    trimEnd: num(0, 86400, { label: 'Trim end', unit: 's' }),
  });
}

function specializedSpec(task: string, p: OptionsSpecInput): OptionsSpec | null {
  switch (task) {
    case 'video_compressor':
    case 'compress_mp4':
      return spec('video:compress', {
        level: pick(COMPRESSION_LEVELS, { label: 'Compression level', description: `smallest = CRF ${LEVEL_CRF.smallest}, balanced = CRF ${LEVEL_CRF.balanced}, high_quality = CRF ${LEVEL_CRF.high_quality}. Higher CRF means a smaller, softer file.`, default: 'balanced' }),
        crf: int(COMPRESSOR_CRF.min, COMPRESSOR_CRF.max, { label: 'CRF override', description: 'Fine control beyond the level: 18 is near lossless, 28 is small, 40 is very small.', default: LEVEL_CRF.balanced }),
        ...(p.lockedVideoOutputFormat ? {} : { format: pick(COMPRESSOR_FORMATS, { label: 'Output format', default: 'mp4' }) }),
        codec: pick(COMPRESSOR_CODEC_CHOICES, { label: 'Codec', description: 'Ignored for WebM (VP9).', default: 'h264' }),
        resolution: pick(COMPRESSION_RESOLUTIONS, { label: 'Resolution', description: 'Maximum height in pixels, or keep the original.', default: 'keep' }),
        stripAudio: bool({ label: 'Remove audio', default: false }),
      });
    case 'video_trimmer':
    case 'mp4_trimmer':
    case 'video_cutter':
    case 'cut_video_online':
      return spec('video:trim', {
        startTime: num(0, 86400, { label: 'Start', unit: 's' }),
        endTime: num(0, 86400, { label: 'End', unit: 's' }),
        ...(p.lockedVideoOutputFormat ? {} : { format: pick(VIDEO_FORMATS, { label: 'Output format', default: 'mp4' }) }),
        reencode: bool({ label: 'Re-encode for exact cuts', description: 'Slower; cuts on the exact frame instead of the nearest keyframe.', default: false }),
      });
    case 'crop_video':
      return spec('video:crop', {
        cropX: int(0, 8192, { label: 'Crop X', unit: 'px', default: 0 }),
        cropY: int(0, 8192, { label: 'Crop Y', unit: 'px', default: 0 }),
        cropWidth: int(1, 8192, { label: 'Crop width', unit: 'px' }),
        cropHeight: int(1, 8192, { label: 'Crop height', unit: 'px' }),
        ...(p.lockedVideoOutputFormat ? {} : { format: pick(VIDEO_FORMATS, { label: 'Output format', default: 'mp4' }) }),
      });
    case 'resize_video':
      return spec('video:resize', {
        width: int(1, 4096, { label: 'Width', unit: 'px' }),
        height: int(1, 4096, { label: 'Height', unit: 'px' }),
        preserveAspectRatio: bool({ label: 'Keep aspect ratio', default: true }),
        ...(p.lockedVideoOutputFormat ? {} : { format: pick(VIDEO_FORMATS, { label: 'Output format', default: 'mp4' }) }),
      });
    case 'rotate_video':
      return spec('video:rotate', {
        rotation: field(z.union([z.literal(90), z.literal(180), z.literal(270)]), { label: 'Rotation', unit: 'degrees', default: 90 }),
        flipHorizontal: bool({ label: 'Flip horizontally', default: false }),
        flipVertical: bool({ label: 'Flip vertically', default: false }),
        ...(p.lockedVideoOutputFormat ? {} : { format: pick(VIDEO_FORMATS, { label: 'Output format', default: 'mp4' }) }),
      });
    case 'extract_audio':
    case 'mp4_to_mp3':
    case 'video_to_mp3':
      return spec('video:extract-audio', p.lockedExtractAudioFormat ? {} : { format: pick(EXTRACT_AUDIO_FORMATS, { label: 'Audio format', default: 'mp3' }) });
    case 'extract_video_only':
    case 'remove_audio_from_video':
      return spec('video:extract-video-only', { format: pick(['mp4', 'webm'] as const, { label: 'Output format', default: 'mp4' }) });
    case 'extract_frames':
      return spec('video:extract-frames', {
        frameMode: pick(['every_n_seconds', 'fps', 'timestamp'] as const, { label: 'Frame mode', default: 'every_n_seconds' }),
        intervalSeconds: num(0.1, 600, { label: 'Interval', unit: 's', default: 5, description: 'Used by every_n_seconds.' }),
        fps: num(0.05, 60, { label: 'Frames per second', unit: 'fps', default: 1, description: 'Used by fps.' }),
        timestamps: text(400, { label: 'Timestamps', description: 'Comma-separated seconds, e.g. "1.5, 10, 42". Used by timestamp.' }),
        format: pick(['jpg', 'png', 'webp'] as const, { label: 'Image format', default: 'jpg' }),
        maxFrames: int(1, 1000, { label: 'Maximum frames', default: 300 }),
      });
    case 'audio_waveform':
      return spec('audio:waveform', {
        output: pick(['video', 'image'] as const, { label: 'Output', default: 'video' }),
        videoFormat: pick(['mp4', 'webm'] as const, { label: 'Video format', default: 'mp4' }),
        imageFormat: pick(['png', 'webp'] as const, { label: 'Image format', default: 'png' }),
        width: int(64, 7680, { label: 'Width', unit: 'px', default: 1600 }),
        height: int(64, 7680, { label: 'Height', unit: 'px', default: 160 }),
        mode: pick(['point', 'line', 'p2p', 'cline'] as const, { label: 'Drawing mode', default: 'point' }),
        colorPrimary: text(20, { label: 'Primary colour', default: '#22D3EE' }),
        colorSecondary: text(20, { label: 'Secondary colour', default: '#A855F7' }),
        scale: pick(['lin', 'log', 'sqrt', 'cbrt'] as const, { label: 'Amplitude scale', default: 'lin' }),
        includeAudio: bool({ label: 'Include audio', default: true }),
      });
    case 'caption_translator':
      return spec('caption:translate', {
        outputFormat: pick(['same', 'srt', 'vtt'] as const, { label: 'Output format', default: 'same' }),
        sourceLanguage: text(12, { label: 'Source language', description: 'BCP-47 code or "auto".', default: 'auto' }),
        targetLanguage: text(12, { label: 'Target language', description: 'BCP-47 code such as es, fr, de, ja.', default: 'es' }),
      });
    case 'stitch_audio_to_video':
      return spec('video:stitch', {
        audioMode: pick(['mix', 'replace'] as const, { label: 'Audio mode', description: 'mix keeps the video sound; replace swaps it.', default: 'mix' }),
        trimToVideoDuration: bool({ label: 'End with the video', description: 'false keeps the longest track.', default: true }),
      });
    case 'summarize_video':
    case 'summarize_audio':
      return spec('summarize', {
        depth: pick(['standard', 'deep'] as const, { label: 'Depth', default: 'standard' }),
        language: text(12, { label: 'Summary language', description: 'BCP-47 code; defaults to the page language.' }),
      });
    default:
      return null;
  }
}

/** The options of one tool page. */
export function optionsSpecFor(p: OptionsSpecInput): OptionsSpec {
  const task = p.defaultTask ?? '';
  if (p.slug && NO_OPTIONS_SLUGS[p.slug]) return none(NO_OPTIONS_SLUGS[p.slug]);
  const panel = p.preset?.kind === 'video' && p.preset.panel ? p.preset.panel : undefined;
  if (NO_OPTIONS[task]) return none(NO_OPTIONS[task]);
  if (p.preset?.kind === 'photo') return none('Aperture is an editor; Medi edits it through its copilot, not through options.');
  const special = specializedSpec(panel ?? task, p);
  if (special) return special;
  if (p.transcribeMode) {
    return spec('transcribe', {
      format: pick(['vtt', 'srt', 'txt', 'json'] as const, { label: 'Transcript format', default: 'vtt' }),
      language: text(12, { label: 'Spoken language', description: 'Leave out to auto-detect, or a code such as en, es, ru.' }),
    });
  }
  if (p.transcodeMode) {
    return spec('transcode', {
      ...(p.transcodeLockProtocol ? {} : { protocol: pick(['hls', 'dash'] as const, { label: 'Streaming protocol', default: p.transcodeProtocol ?? 'hls' }) }),
      dashCodec: pick(['av1', 'vp9'] as const, { label: 'DASH codec', description: 'Only used for DASH.', default: 'av1' }),
    });
  }
  if (p.defaultMediaKind === 'pdf') {
    return spec('pdf', {
      ...(p.pdfLockOutputFormat ? {} : { format: pick(['jpg', 'png'] as const, { label: 'Image format', default: 'jpg' }) }),
      pageSelection: pick(['all', 'first'] as const, { label: 'Pages', description: 'all pages (a ZIP) or only the first.', default: 'all' }),
      dpi: int(50, 400, { label: 'Resolution', unit: 'dpi', default: 150 }),
      quality: int(1, 100, { label: 'Quality', unit: 'percent', default: 90 }),
    });
  }
  if (p.defaultMediaKind === 'image') return imageSpec(p);
  if (p.defaultMediaKind === 'video') return videoSpec(p);
  if (p.defaultMediaKind === 'audio') return audioSpec(p);
  return none('This page has no configurable options.');
}
