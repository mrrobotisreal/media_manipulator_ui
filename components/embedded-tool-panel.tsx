'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { X } from 'lucide-react';
import dynamic from 'next/dynamic';
import { getFileType } from '@/lib/utils';
import { PanelLoading } from '@/components/darkroom/panel-loading';
import type { PdfFormPresets } from '@/components/pdf-conversion-form';
import type { TranscodeProtocol, DashCodec } from '@/lib/transcodeTypes';
import useConvertFile, { type UploadFileResponse } from '@/lib/useConvertFile';
import useTranscribeFile, {
  type TranscribeFormData,
  type TranscribeUploadResponse,
} from '@/lib/useTranscribeFile';
import useGetJobStatus, { type ConversionJob } from '@/lib/useGetJobStatus';
import { describe as describeResult } from '@/lib/results/describe';
import { ResultPanel } from '@/components/results/result-panel';
import { ExifInspect, ExifResult } from '@/components/metadata/exif-flow';
import { fpsHint } from '@/lib/results/videoFps';
import type { ConversionFormData } from '@/schemas/types';
import type { EmbedPreset } from '@/content/toolPages';
import {
  EVENTS,
  normalizeMediaKind,
  safeFileExtension,
  ToolAnalyticsProvider,
  trackFileChoice,
  useToolAnalytics,
} from '@/lib/analytics';
import { useLocalization } from '@/i18n/useLocalization';
import { useLocalizedHref } from '@/i18n/useLocalizedHref';
import { useAuth } from '@/lib/auth/AuthProvider';
import { UploadLimitHint, useUpgradeNudge } from '@/components/account/upgrade-surfaces';
import { QuotaChip } from '@/components/quota-chip';
import {
  ICON_MAP,
  DropzoneCopy,
  SELECT_FILE_BUTTON,
  ToolPanelFooter,
  ToolPanelFormats,
  ToolPanelIntro,
  ToolPanelSection,
  describePanelChrome,
  dropzoneClass,
} from '@/components/tools/panel-chrome';
import { isVocalStemJob } from '@/lib/results/mp3Download';
import { isStemFormatChoice, isStemOperation, stemOutputFormat, type StemFormatChoice } from '@/lib/audio/stemFormat';

/**
 * Shared loading state for the code-split forms below. Module scope, not
 * defined during render, so each `dynamic()` gets a stable component identity.
 */
const FormLoading = () => {
  const { t } = useLocalization('interface');
  return <PanelLoading variant="inline" label={t('common.loading')} />;
};

// Every conversion form and specialized panel is code-split.
//
// A tool page renders exactly one of these, but importing them statically put
// all fifteen — with their schemas, react-hook-form wiring, and effect UIs — in
// the first-load chunk of every `/tools/*` route. `ssr: false` costs nothing
// here: this whole module already loads behind an ssr:false island.
//
// Per the Next 16 lazy-loading guide, each `import()` is written out literally
// inside its own `dynamic()` call — a helper or template string would break
// chunk matching and preloading.
const ImageConversionForm = dynamic(() => import('@/components/image-conversion-form'), { ssr: false, loading: FormLoading });
const PdfConversionForm = dynamic(() => import('@/components/pdf-conversion-form'), { ssr: false, loading: FormLoading });
const VideoConversionForm = dynamic(() => import('@/components/video-conversion-form'), { ssr: false, loading: FormLoading });
const AudioConversionForm = dynamic(() => import('@/components/audio-conversion-form'), { ssr: false, loading: FormLoading });
const TranscribeForm = dynamic(() => import('@/components/transcribe-form'), { ssr: false, loading: FormLoading });
const VideoTranscodeForm = dynamic(() => import('@/components/video-transcode-form'), { ssr: false, loading: FormLoading });
const AudioWaveformPanel = dynamic(() => import('@/components/audio-waveform-panel'), { ssr: false, loading: FormLoading });
const ExtractAudioPanel = dynamic(() => import('@/components/extract-audio-panel'), { ssr: false, loading: FormLoading });
const ExtractVideoOnlyPanel = dynamic(() => import('@/components/extract-video-only-panel'), { ssr: false, loading: FormLoading });
const ExtractFramesPanel = dynamic(() => import('@/components/extract-frames-panel'), { ssr: false, loading: FormLoading });
const CaptionTranslatorPanel = dynamic(() => import('@/components/caption-translator-panel'), { ssr: false, loading: FormLoading });
const StitchAudioToVideoPanel = dynamic(() => import('@/components/stitch-audio-to-video-panel'), { ssr: false, loading: FormLoading });
const VideoCompressorPanel = dynamic(() => import('@/components/video-compressor-panel'), { ssr: false, loading: FormLoading });
const VideoTrimmerPanel = dynamic(() => import('@/components/video-trimmer-panel'), { ssr: false, loading: FormLoading });
const VideoTransformPanel = dynamic(() => import('@/components/video-transform-panel'), { ssr: false, loading: FormLoading });
const MetadataInspectPanel = dynamic(() => import('@/components/metadata/metadata-inspect-panel'), { ssr: false, loading: FormLoading });
// MM75: video / audio summaries (the MM74 staged job).
const SummarizePanel = dynamic(() => import('@/components/summarize-panel'), { ssr: false, loading: FormLoading });
// MM78 voices: the three voice tool panels.
const VoiceCloningPanel = dynamic(() => import('@/components/voices/voice-cloning-panel'), { ssr: false, loading: FormLoading });
const VoiceDesignerPanel = dynamic(() => import('@/components/voices/voice-designer-panel'), { ssr: false, loading: FormLoading });
const VoiceChangerPanel = dynamic(() => import('@/components/voices/voice-changer-panel'), { ssr: false, loading: FormLoading });

export type EmbeddedMediaKind = 'image' | 'video' | 'audio' | 'pdf';

export type EmbeddedTask =
  | 'edit_video'
  | 'remove_metadata'
  | 'compress_video'
  | 'video_to_gif'
  | 'transcribe_video'
  | 'webp_to_jpg'
  | 'wav_to_mp3'
  | 'isolate_vocals'
  | 'image_converter'
  | 'video_converter'
  | 'audio_converter'
  | 'transcode_to_hls'
  | 'transcode_to_dash'
  | 'srt_generator'
  | 'caption_translator'
  | 'audio_waveform'
  | 'extract_audio'
  | 'extract_video_only'
  | 'extract_frames'
  | 'stitch_audio_to_video'
  | 'ai_frame_interpolation'
  // AI Video Restoration renders its own custom panel (components/video-restore)
  // via the static /tools/ai-video-restoration route — the literal exists so
  // its toolPages entry typechecks; the generic embedded panel never sees it.
  | 'ai_video_restoration'
  // Motion (MM48) opens its own chromeless editor from the static /tools/motion
  // route; like ai_video_restoration, the literal only lets its toolPages entry
  // typecheck and the generic embedded panel never sees it.
  | 'motion_editor'
  | 'png_to_jpg'
  | 'jpg_to_png'
  | 'webp_to_png'
  | 'png_to_webp'
  | 'jpg_to_webp'
  | 'jpg_converter'
  | 'png_converter'
  | 'image_resizer'
  | 'compress_image'
  | 'remove_background'
  | 'image_to_pdf'
  | 'jpg_to_pdf'
  | 'png_to_pdf'
  | 'pdf_to_jpg'
  | 'pdf_to_png'
  | 'pdf_converter'
  | 'heic_to_jpg'
  | 'avif_to_jpg'
  | 'avif_to_png'
  | 'svg_to_png'
  | 'png_to_svg'
  | 'png_to_ico'
  | 'svg_converter'
  // Video SEO batch 1 — exact-match converter pages over the same engine.
  | 'mp4_converter'
  | 'mov_to_mp4'
  | 'webm_to_mp4'
  | 'avi_to_mp4'
  | 'mkv_to_mp4'
  | 'mp4_to_webm'
  | 'mp4_to_mp3'
  | 'video_to_mp3'
  | 'mp4_to_gif'
  | 'gif_converter'
  // Video SEO batch 2 — creator utility pages (compress, trim/cut, transform).
  | 'video_compressor'
  | 'compress_mp4'
  | 'video_trimmer'
  | 'mp4_trimmer'
  | 'video_cutter'
  | 'cut_video_online'
  | 'crop_video'
  | 'resize_video'
  | 'rotate_video'
  | 'remove_audio_from_video'
  // Catalog expansion (2026-10-28): converter features that were only reachable
  // from the home page's advanced sections now have their own pages.
  | 'inspect_metadata'
  | 'change_video_speed'
  | 'reverse_video'
  | 'flip_video'
  | 'stabilize_video'
  | 'change_video_frame_rate'
  | 'adjust_video_color'
  | 'video_to_hevc'
  | 'audio_to_wav'
  | 'audio_to_flac'
  | 'audio_to_ogg'
  | 'audio_to_m4a'
  | 'audio_to_opus'
  | 'mp3_to_wav'
  | 'change_audio_speed'
  | 'change_audio_pitch'
  | 'normalize_audio'
  | 'adjust_audio_volume'
  | 'audio_equalizer'
  | 'add_reverb'
  | 'trim_audio'
  | 'add_text_to_image'
  | 'crop_image'
  | 'grayscale_image'
  | 'image_filters'
  | 'rotate_image'
  | 'sharpen_image'
  | 'blur_image'
  | 'edit_image_metadata'
  | 'transcribe_audio'
  | 'audio_to_text'
  | 'video_to_text'
  | 'summarize_video'
  | 'generate_vtt_captions'
  // MM75: the audio sibling of summarize_video (same MM74 job, no frames).
  | 'summarize_audio'
  // MM78 voices: clone, design and change a voice (components/voices/*).
  | 'voice_clone'
  | 'voice_design'
  | 'voice_convert';

/** Output formats the embedded image converter understands. "pdf" routes the
 *  image through the document pathway (image -> single-page PDF); "svg" routes
 *  to potrace vectorization; "ico" routes to multi-size icon generation. */
export type EmbeddedImageFormat = 'jpg' | 'png' | 'webp' | 'gif' | 'avif' | 'pdf' | 'svg' | 'ico';

/** AI image operations the embedded image converter understands. */
export type EmbeddedAIImageOperation =
  | 'none'
  | 'remove_background'
  | 'face_privacy'
  | 'ai_upscale'
  | 'redact_text'
  | 'remove_object';

/**
 * Concrete preset/lock configuration for the embedded image converter.
 * Threaded from a tool page's `embed` config into ImageConversionForm so SEO
 * pages can genuinely preselect/lock a conversion instead of only hinting.
 */
export interface ImageFormPresets {
  defaultOutputFormat?: EmbeddedImageFormat;
  lockedOutputFormat?: EmbeddedImageFormat;
  defaultAIImageOperation?: EmbeddedAIImageOperation;
  lockedAIImageOperation?: boolean;
  defaultQuality?: number;
  defaultWidth?: number;
  defaultHeight?: number;
  /** Visually emphasize the width/height controls (image resizer). */
  emphasizeResize?: boolean;
  /** Starting value of the metadata mode select (the EXIF page starts on strip). */
  defaultMetadataMode?: 'keep' | 'strip' | 'custom';
  /** Highlight one section of the image form (`embed.preset` kind 'image_effect'). */
  effect?: ImageEffectEmphasis;
  /** Seed the filter select (grayscale page, rotate page). */
  defaultFilter?: string;
}

/** Output containers/codecs the embedded video converter understands. Mirrors
 *  the `format` enum in src/schemas/videoSchema.ts and the backend
 *  models.VideoConversionOptions. */
export type EmbeddedVideoFormat =
  | 'mp4'
  | 'webm'
  | 'avi'
  | 'mov'
  | 'mkv'
  | 'flv'
  | 'wmv'
  | 'prores'
  | 'dnxhd'
  | 'gif';

/** Audio formats the specialized extract-audio flow can produce. */
export type EmbeddedExtractAudioFormat = 'mp3' | 'wav' | 'm4a' | 'aac' | 'flac' | 'ogg';

/**
 * Concrete preset/lock configuration for the embedded video converter.
 * Threaded from a tool page's `embed` config into VideoConversionForm so video
 * SEO pages can genuinely preselect/lock a conversion (e.g. MOV -> MP4) instead
 * of only hinting at it.
 */
export interface VideoFormPresets {
  defaultOutputFormat?: EmbeddedVideoFormat;
  lockedOutputFormat?: EmbeddedVideoFormat;
  defaultQuality?: 'low' | 'medium' | 'high';
  defaultWidth?: number;
  defaultHeight?: number;
  defaultSpeed?: number;
  /** `embed.preset` of kind 'video' + frame_interpolation: seeds the AI op. */
  aiPreset?: Extract<EmbedPreset, { kind: 'video'; aiOperation: 'frame_interpolation' }>;
  /** Open and highlight one effect section (`embed.preset` kind 'video_effect'). */
  effect?: VideoEffectEmphasis;
  effectDefaults?: VideoEffectDefaults;
}

/**
 * Which part of the audio form a page is about. The form opens that section
 * and highlights it, so a "change pitch" page lands on the pitch slider rather
 * than a collapsed "Advanced" header three screens down.
 */
export type AudioEffectEmphasis = 'speed' | 'volume' | 'pitch' | 'normalize' | 'equalizer' | 'reverb' | 'trim';

/** Preset config for the audio converter (`embed.preset` of kind 'audio'). */
export interface AudioFormPresets {
  aiOperation?: Extract<EmbedPreset, { kind: 'audio' }>['aiOperation'];
  /** Show a read-only chip instead of the operation select. */
  hideOperationSelect?: boolean;
  defaultFormat?: string;
  /** MM81: vocal stems' "Output format" choice; absent = "Same as input" (`auto`). */
  stemFormat?: StemFormatChoice;
  /** Lock the output format select (the WAV/FLAC/OGG pages). */
  lockedFormat?: string;
  /** Open and highlight one effect section (`embed.preset` kind 'audio_effect'). */
  effect?: AudioEffectEmphasis;
  /** Seed values for the emphasised effect, e.g. `{ speed: 1.5 }` or `{ pitchSemitones: 2 }`. */
  effectDefaults?: AudioEffectDefaults;
}

export interface AudioEffectDefaults {
  speed?: number;
  volume?: number;
  pitchSemitones?: number;
  normalize?: boolean;
  equalizerPreset?: 'none' | 'bass-boost' | 'treble-boost' | 'vocal' | 'classical' | 'rock' | 'jazz';
  reverbType?: 'none' | 'room' | 'hall' | 'plate' | 'spring';
}

/** Which part of the video form a page is about; see AudioEffectEmphasis. */
export type VideoEffectEmphasis = 'speed' | 'reverse' | 'flip' | 'stabilize' | 'frameRate' | 'color';

export interface VideoEffectDefaults {
  speed?: number;
  reverse?: boolean;
  flipHorizontal?: boolean;
  flipVertical?: boolean;
  stabilize?: boolean;
  targetFps?: number;
}

/** Which part of the image form a page is about. */
export type ImageEffectEmphasis = 'text' | 'crop' | 'filter' | 'metadata';

/**
 * Concrete preset/lock configuration for the specialized extract-audio panel
 * (mp4-to-mp3 / video-to-mp3 pages). Output is audio, so these pages reuse the
 * extract-audio flow rather than the video converter.
 */
export interface ExtractAudioPresets {
  defaultFormat?: EmbeddedExtractAudioFormat;
  lockedFormat?: EmbeddedExtractAudioFormat;
  /** Override the file-input accept attribute (e.g. lock to MP4). */
  accept?: string;
  /** Expected input format hint, shown above the panel. */
  expectedInput?: string;
}

/** Friendly compression level (mapped to a CRF value client-side). */
export type EmbeddedVideoCompressionPreset = 'smallest' | 'balanced' | 'high_quality';

/** Video codec choices the compressor exposes. */
export type EmbeddedVideoCodec = 'h264' | 'h265' | 'vp9' | 'av1';

/** Preset/lock config for the focused video-compressor panel. */
export interface VideoCompressorPresets {
  defaultOutputFormat?: EmbeddedVideoFormat;
  lockedOutputFormat?: EmbeddedVideoFormat;
  defaultPreset?: EmbeddedVideoCompressionPreset;
  defaultCodec?: EmbeddedVideoCodec;
  expectedInput?: string;
}

/** Preset/lock config for the focused trim/cut panel. */
export interface VideoTrimmerPresets {
  defaultOutputFormat?: EmbeddedVideoFormat;
  lockedOutputFormat?: EmbeddedVideoFormat;
  /** 'trim' keeps the middle; 'cut' is the same operation, different framing/copy. */
  intent?: 'trim' | 'cut';
  expectedInput?: string;
}

/** Which transform control the transform panel emphasizes. */
export type VideoTransformEmphasis = 'crop' | 'resize' | 'rotate';

/** Preset/lock config for the focused crop/resize/rotate panel. */
export interface VideoTransformPresets {
  emphasis: VideoTransformEmphasis;
  defaultOutputFormat?: EmbeddedVideoFormat;
  lockedOutputFormat?: EmbeddedVideoFormat;
  defaultWidth?: number;
  defaultHeight?: number;
  defaultRotation?: number;
  defaultCrop?: { x: number; y: number; width: number; height: number };
  expectedInput?: string;
}

interface EmbeddedToolPanelProps {
  /**
   * The canonical tool slug from content/toolPages.ts.
   *
   * PREVIOUSLY MISSING ENTIRELY, and that was the single biggest gap in the old
   * instrumentation: this panel is the interactive island on all ~70 SEO tool pages, and
   * without the slug every conversion started from a tool page was indistinguishable from
   * every other. The slug cannot be derived here — the panel is rendered by
   * EmbeddedToolPanelClient inside an arbitrary page, and in the CreaTV /embed iframe the
   * URL is not even ours — so it is threaded down from tool-landing-page as a prop.
   *
   * Optional so the handful of ad-hoc embeds that render the panel directly keep working;
   * those show up in the data as unattributed, which is visible rather than silent.
   */
  toolSlug?: string | null;
  /**
   * Which surface hosts the panel, for result analytics. Defaults to `tool_page` when a
   * `toolSlug` is set and `tutorial` otherwise; tutorial views pass it explicitly.
   */
  surface?: 'tool_page' | 'tutorial';
  /** Default media kind to bias the panel toward when no file is selected yet. */
  defaultMediaKind: EmbeddedMediaKind;
  /**
   * Task preset (content/toolPages.ts `embed.preset`): seeds the form's initial
   * state so the page opens ready for the task its copy promises. Absent means
   * the panel behaves exactly as before.
   */
  preset?: EmbedPreset;
  /** Optional high-intent task. Drives recommended settings + banner copy. */
  defaultTask?: EmbeddedTask;
  /** Heading shown above the panel. */
  title?: string;
  /** Short description shown under the heading. */
  description?: string;
  /** Render the panel in a more compact layout. Defaults to true. */
  compact?: boolean;
  /** Pre-fill the file input accept attribute. */
  acceptOverride?: string;
  /** Restrict the visible input formats (informational hint only). */
  allowedInputFormats?: string[];
  /** Recommended output format. For image tasks this preselects the format. */
  defaultOutputFormat?: string;
  /** Locked input format (informational hint). */
  lockedInputFormat?: string;
  /**
   * Locked output format. For image tasks the converter genuinely locks the
   * format select to this value and still submits it.
   */
  lockedOutputFormat?: string;
  /** Default AI image operation to preselect (image tasks only). */
  defaultAIImageOperation?: EmbeddedAIImageOperation;
  /** Lock the AI image operation select so it can't be changed (image tasks). */
  lockedAIImageOperation?: boolean;
  /** Default JPG/WebP quality (1–100) to preselect (image tasks only). */
  defaultQuality?: number;
  /** Default target width in px (image tasks only). */
  defaultWidth?: number;
  /** Default target height in px (image tasks only). */
  defaultHeight?: number;
  /** Visually emphasize the resize controls (image resizer). */
  emphasizeResize?: boolean;
  /** Default output container/codec the video converter preselects. */
  defaultVideoOutputFormat?: EmbeddedVideoFormat;
  /**
   * Locked output container/codec for the video converter. The form locks the
   * format select to this value and still submits it (e.g. MOV -> MP4 pages).
   */
  lockedVideoOutputFormat?: EmbeddedVideoFormat;
  /** Default quality preset for the video converter. */
  defaultVideoQuality?: 'low' | 'medium' | 'high';
  /** Default target width in px (video tasks only). */
  defaultVideoWidth?: number;
  /** Default target height in px (video tasks only). */
  defaultVideoHeight?: number;
  /** Default playback speed multiplier (video tasks only). */
  defaultVideoSpeed?: number;
  /** Default output audio format for the extract-audio flow (video-to-audio pages). */
  defaultExtractAudioFormat?: EmbeddedExtractAudioFormat;
  /** Locked output audio format for the extract-audio flow (mp4-to-mp3 page). */
  lockedExtractAudioFormat?: EmbeddedExtractAudioFormat;
  /** Default compression level for the video-compressor panel. */
  defaultVideoCompressionPreset?: EmbeddedVideoCompressionPreset;
  /** Default codec for the video-compressor panel. */
  defaultVideoCodec?: EmbeddedVideoCodec;
  /**
   * Default transform for crop/resize/rotate pages. `rotation` seeds the
   * rotate-video control; `crop` seeds the crop-video control.
   */
  defaultTransform?: { rotation?: number; crop?: { x: number; y: number; width: number; height: number } };
  /** Default output format for the PDF -> image form (jpg | png). */
  pdfDefaultOutputFormat?: 'jpg' | 'png';
  /** Lock the PDF -> image output format select. */
  pdfLockOutputFormat?: boolean;
  /** Default page selection for the PDF -> image form (all | first). */
  pdfDefaultPageSelection?: 'all' | 'first';
  /** Default render DPI for the PDF -> image form. */
  pdfDefaultDpi?: number;
  /**
   * When true, render in transcribe mode instead of conversion mode.
   * Only meaningful for video/audio defaultMediaKind.
   */
  transcribeMode?: boolean;
  /**
   * When true, render the HLS/DASH transcode form instead of the regular
   * conversion form. Only meaningful for video defaultMediaKind.
   */
  transcodeMode?: boolean;
  /** Default protocol when transcodeMode is on. */
  transcodeProtocol?: TranscodeProtocol;
  /** Default DASH codec when transcodeMode is on AND protocol is "dash". */
  transcodeDashCodec?: DashCodec;
  /** Lock the protocol so the user can't switch between HLS and DASH. */
  transcodeLockProtocol?: boolean;
}

// MM88: ACCEPT_MAP, ICON_MAP, DEFAULT_TITLES/DESCRIPTIONS and SPECIALIZED_PANEL_TASKS moved to
// components/tools/panel-chrome.tsx, shared with the server-rendered shell.

/**
 * Compact, embedded version of the homepage converter for tutorial and
 * /tools landing pages. Reuses the same form components, upload hook,
 * status poller, and download helper as the full app so behavior stays
 * consistent. Leaves out conversion history and ads. A finished
 * job renders the shared ResultPanel inline (viewer, Original/Result toggle,
 * Download), the same panel the home converter opens in a modal.
 */
const EmbeddedToolPanel: React.FC<EmbeddedToolPanelProps> = (props) => (
  // This provider stays even though tool-landing-page now wraps its own
  // ToolAnalyticsBoundary, because this panel is ALSO rendered standalone in four tutorial
  // views (views/tutorials/*), where no boundary exists and nothing else would supply a
  // slug or announce the view. On a /tools/* page the two providers nest, and the inner one
  // suppresses its view event because the parent already announced the same slug — see the
  // nesting comment in lib/analytics/ToolAnalyticsContext.tsx.
  //
  // `viewEntryPoint` reproduces exactly what the panel's own explicit TOOL_VIEWED call used
  // to compute: a panel with a slug is on a tool page, one without is embedded elsewhere.
  <ToolAnalyticsProvider
    slug={props.toolSlug ?? null}
    mediaKind={props.defaultMediaKind}
    viewEntryPoint={props.toolSlug ? 'tool_page' : 'embedded'}
  >
    <EmbeddedToolPanelInner {...props} />
  </ToolAnalyticsProvider>
);

const EmbeddedToolPanelInner: React.FC<EmbeddedToolPanelProps> = ({
  toolSlug,
  surface,
  defaultMediaKind,
  preset,
  defaultTask,
  title,
  description,
  compact = true,
  acceptOverride,
  allowedInputFormats,
  defaultOutputFormat,
  lockedInputFormat,
  lockedOutputFormat,
  defaultAIImageOperation,
  lockedAIImageOperation = false,
  defaultQuality,
  defaultWidth,
  defaultHeight,
  emphasizeResize = false,
  defaultVideoOutputFormat,
  lockedVideoOutputFormat,
  defaultVideoQuality,
  defaultVideoWidth,
  defaultVideoHeight,
  defaultVideoSpeed,
  defaultExtractAudioFormat,
  lockedExtractAudioFormat,
  defaultVideoCompressionPreset,
  defaultVideoCodec,
  defaultTransform,
  pdfDefaultOutputFormat,
  pdfLockOutputFormat = false,
  pdfDefaultPageSelection,
  pdfDefaultDpi,
  transcribeMode = false,
  transcodeMode = false,
  transcodeProtocol = 'hls',
  transcodeDashCodec = 'av1',
  transcodeLockProtocol = false,
}) => {
  // tool_slug and media_kind ride along automatically on everything trackTool emits.
  const { track: trackTool, setMediaKind: setToolMediaKind } = useToolAnalytics();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [conversionJob, setConversionJob] = useState<ConversionJob | null>(null);
  const [conversionOptions, setConversionOptions] =
    useState<ConversionFormData | null>(null);
  const [originalMediaUrl, setOriginalMediaUrl] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: jobStatusData } = useGetJobStatus(conversionJob);
  // Nullable: this panel also renders in the chromeless /embed tree, where there is no
  // AuthProvider. Read only for the tier's file-size ceiling on `file_rejected`. Declared
  // up here with the other hooks because onFileChosen below closes over it, and a reference
  // that appears before the declaration would not see later updates.
  const auth = useAuth();

  const fileType = selectedFile ? getFileType(selectedFile) : null;
  const effectiveKind: EmbeddedMediaKind =
    fileType && fileType !== 'unknown' ? (fileType as EmbeddedMediaKind) : defaultMediaKind;

  const handleUploadStart = useCallback(
    (jobId: string) => {
      if (!selectedFile) return;
      setConversionJob({
        id: jobId,
        status: 'processing',
        originalFile: selectedFile,
        progress: 0,
      });
    },
    [selectedFile],
  );

  const { mutate: convertMutate, isPending: isConvertPending, uploadProgress } = useConvertFile(
    (res: UploadFileResponse) => handleUploadStart(res.jobId),
  );

  const {
    mutate: transcribeMutate,
    isPending: isTranscribePending,
    uploadProgress: transcribeProgress,
  } = useTranscribeFile((res: TranscribeUploadResponse) => handleUploadStart(res.jobId));

  useEffect(() => {
    if (!selectedFile) {
      setOriginalMediaUrl(null);
      return;
    }
    const url = URL.createObjectURL(selectedFile);
    setOriginalMediaUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [selectedFile]);

  useEffect(() => {
    if (jobStatusData) {
      setConversionJob((prev) => (prev ? { ...prev, ...jobStatusData } : null));
    }
  }, [jobStatusData]);

  // `tool_viewed` is emitted by the ToolAnalyticsProvider above (via its viewEntryPoint),
  // not here. It moved so that the four /tools pages passing a CUSTOM panel — which never
  // render this component — also announce the top of their funnel.

  // Keep the funnel's media_kind in step with what the panel is actually showing — it
  // starts from defaultMediaKind and narrows once a file is chosen.
  useEffect(() => {
    setToolMediaKind(effectiveKind);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectiveKind]);

  const onFileChosen = (file: File) => {
    setSelectedFile(file);
    setConversionJob(null);
    setConversionOptions(null);
    const fileKind = getFileType(file);
    setToolMediaKind(normalizeMediaKind(fileKind));
    // `unsupported` mirrors what effectiveKind above already decides: with an unrecognised
    // type the panel falls back to its default kind and renders a form the file cannot
    // satisfy, so the choice is a rejection rather than a funnel entry. See
    // lib/analytics/fileChoice.ts for why unsupported-type replaces file_selected while
    // over-the-limit accompanies it.
    trackFileChoice(trackTool, file, fileKind, {
      unsupported: fileKind === 'unknown',
      limitBytes: auth?.limits?.maxFileBytes,
    });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileChosen(file);
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    // Required for the drop event to fire — also signals "copy" to the
    // OS-level drag UI so the cursor shows the right affordance.
    e.dataTransfer.dropEffect = 'copy';
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) onFileChosen(file);
  }, []);

  const handleConvert = (data: ConversionFormData) => {
    if (!selectedFile) return;
    setConversionOptions(data);
    setConversionJob(null);
    // No event here. `job_started` is emitted by useConvertFile once the API has actually
    // ACCEPTED the job and returned a jobId — which is also where markJobStarted records
    // the clock that produces a real duration. Emitting a "conversion started" event at the
    // click, as the old code did, counted submissions that the server rejected as
    // conversions and made the funnel's success rate look worse than it was.
    convertMutate({ file: selectedFile, options: data });
  };

  // EXIF page: "Strip everything" in the inspector. Same container as the input (HEIC/TIFF/BMP
  // fall back to JPG), metadata forced to strip, through the ordinary handleConvert path.
  const handleStripEverything = () => {
    if (!selectedFile) return;
    const ext = safeFileExtension(selectedFile.name).toLowerCase().replace(/^\./, '');
    const format = ext === 'jpeg' ? 'jpg' : ['jpg', 'png', 'webp', 'gif', 'avif'].includes(ext) ? ext : 'jpg';
    handleConvert({ format, quality: 85, filter: 'none', metadataMode: 'strip' } as ConversionFormData);
  };

  const handleTranscribe = (data: TranscribeFormData) => {
    if (!selectedFile) return;
    setConversionOptions({ format: data.format } as unknown as ConversionFormData);
    setConversionJob(null);
    transcribeMutate({ file: selectedFile, options: data });
  };

  const getConvertedFilename = () => {
    if (!selectedFile || !conversionOptions) return selectedFile?.name || 'converted_file';
    const originalName = selectedFile.name;
    const nameWithoutExt =
      originalName.substring(0, originalName.lastIndexOf('.')) || originalName;
    if (transcribeMode) {
      return `${nameWithoutExt}_transcript.${conversionOptions.format}`;
    }
    // PDF -> image: an "all pages" job returns a ZIP of per-page images; a
    // "first page" job returns a single image. Mirror the server's naming.
    if (effectiveKind === 'pdf') {
      const opts = conversionOptions as { format?: string; pageSelection?: string };
      if (!opts.pageSelection || opts.pageSelection === 'all') {
        return `${nameWithoutExt}_pages.zip`;
      }
      return `${nameWithoutExt}_converted.${opts.format || 'jpg'}`;
    }
    // MM81: a vocal stem asked for `auto`; name it by what the API resolved (or will).
    const aiOp = (conversionOptions as { ai?: { operation?: string } }).ai?.operation;
    if (isStemOperation(aiOp)) {
      return `${nameWithoutExt}.${stemOutputFormat(conversionOptions.format, originalName, selectedFile.type, conversionJob?.options)}`;
    }
    return `${nameWithoutExt}.${conversionOptions.format}`;
  };

  const upgradeNudge = useUpgradeNudge();

  /** What preceded a reset, from the job state that is about to be discarded. */
  const resetOutcome = (): 'success' | 'failure' | 'idle' => {
    if (conversionJob?.status === 'completed') return 'success';
    if (conversionJob?.status === 'failed') return 'failure';
    return 'idle';
  };

  const clearFile = () => {
    // `after` is read BEFORE the state is cleared, and it is the whole value of the event:
    // a reset following a download is someone starting a second job, a reset following a
    // failure is someone retrying, and an idle reset is someone changing their mind. The
    // homepage has emitted this since Part 1; this panel and the specialized shell did not,
    // which meant the retry-after-failure signal existed on one surface out of three.
    trackTool(EVENTS.TOOL_RESET, { after: resetOutcome() });
    setSelectedFile(null);
    setConversionJob(null);
    setConversionOptions(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const isPending = transcribeMode ? isTranscribePending : isConvertPending;
  const activeProgress = transcribeMode ? transcribeProgress : uploadProgress;
  const isProcessing = isPending || conversionJob?.status === 'processing';
  const isCompleted = conversionJob?.status === 'completed';
  // The shared ResultPanel renders this where the Download button used to be. `task` and
  // `mode` only matter when the API named no file; the extension decides first.
  const resultDescriptor = useMemo(
    () =>
      isCompleted && conversionJob
        ? describeResult({
            job: conversionJob,
            originalFile: selectedFile,
            task: defaultTask,
            mode: transcribeMode ? 'transcribe' : effectiveKind === 'pdf' ? 'document' : 'convert',
            fallbackFileName: getConvertedFilename(),
          })
        : null,
    // getConvertedFilename is derived from the same file/options listed here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isCompleted, conversionJob, selectedFile, defaultTask, transcribeMode, effectiveKind, conversionOptions],
  );
  // MM88: the static chrome (accept list, heading, format chips, which focused panel) is
  // derived by the same function the server-rendered shell uses, so the two cannot differ.
  const {
    accept,
    heading,
    subheading,
    lockedOutputDisplay,
    recommendedFormat,
    specializedPanel,
    showQuotaChip,
  } = describePanelChrome({
    defaultMediaKind,
    defaultTask,
    preset,
    title,
    description,
    acceptOverride,
    allowedInputFormats,
    defaultOutputFormat,
    lockedInputFormat,
    lockedOutputFormat,
    defaultVideoOutputFormat,
    lockedVideoOutputFormat,
    defaultExtractAudioFormat,
    lockedExtractAudioFormat,
    transcribeMode,
  });
  const { t, formatFileSize } = useLocalization('interface');
  const localized = useLocalizedHref();

  // Must recognize EVERY EmbeddedImageFormat — otherwise tool pages advertising
  // AVIF/PDF/SVG/ICO output silently fall through and the promised output is
  // never preselected or locked.
  const isImageFormat = (v: string | undefined): v is EmbeddedImageFormat =>
    v === 'jpg' ||
    v === 'png' ||
    v === 'webp' ||
    v === 'gif' ||
    v === 'avif' ||
    v === 'pdf' ||
    v === 'svg' ||
    v === 'ico';

  // Concrete preset/lock config handed to the image form. Only meaningful for
  // image conversions; the form ignores it for other media kinds.
  const imagePresets: ImageFormPresets = {
    defaultOutputFormat: isImageFormat(defaultOutputFormat) ? defaultOutputFormat : undefined,
    lockedOutputFormat: isImageFormat(lockedOutputFormat) ? lockedOutputFormat : undefined,
    defaultAIImageOperation,
    lockedAIImageOperation,
    defaultQuality,
    defaultWidth,
    defaultHeight,
    emphasizeResize,
    defaultMetadataMode:
      preset?.kind === 'metadata' ? preset.mode : defaultTask === 'remove_metadata' ? 'strip' : undefined,
    effect: preset?.kind === 'image_effect' ? preset.effect : undefined,
    defaultFilter: preset?.kind === 'image_effect' ? preset.filter : undefined,
  };

  const pdfPresets: PdfFormPresets = {
    defaultOutputFormat: pdfDefaultOutputFormat,
    lockOutputFormat: pdfLockOutputFormat,
    defaultPageSelection: pdfDefaultPageSelection,
    defaultDpi: pdfDefaultDpi,
  };

  // Concrete preset/lock config for the video converter. Ignored for non-video
  // media kinds. lockedOutputFormat makes MOV->MP4 style pages submit MP4 even
  // though the select is disabled.
  const videoPresets: VideoFormPresets = {
    defaultOutputFormat: defaultVideoOutputFormat,
    lockedOutputFormat: lockedVideoOutputFormat,
    defaultQuality: defaultVideoQuality,
    defaultWidth: defaultVideoWidth,
    defaultHeight: defaultVideoHeight,
    defaultSpeed: defaultVideoSpeed,
    aiPreset:
      preset && preset.kind === 'video' && 'aiOperation' in preset ? preset : undefined,
    effect: preset && preset.kind === 'video_effect' ? preset.effect : undefined,
    effectDefaults: preset && preset.kind === 'video_effect' ? preset.defaults : undefined,
  };

  // Audio converter preset. Undefined unless the page declares an audio preset,
  // so every other audio page keeps its untouched initial form state.
  const audioPresets: AudioFormPresets | undefined =
    preset && preset.kind === 'audio'
      ? {
          aiOperation: preset.aiOperation,
          hideOperationSelect: preset.hideOperationSelect,
          // MM81: a vocal page's `format` is the stem choice ('auto' = same as input).
          ...(isStemOperation(preset.aiOperation)
            ? { stemFormat: isStemFormatChoice(preset.format) ? preset.format : undefined }
            : { defaultFormat: preset.format }),
        }
      : preset && preset.kind === 'audio_effect'
        ? {
            effect: preset.effect,
            effectDefaults: preset.defaults,
            defaultFormat: defaultOutputFormat,
            lockedFormat: lockedOutputFormat,
          }
        : defaultMediaKind === 'audio' && (defaultOutputFormat || lockedOutputFormat)
          ? { defaultFormat: defaultOutputFormat, lockedFormat: lockedOutputFormat }
          : undefined;

  // Concrete preset/lock config for the specialized extract-audio panel
  // (mp4-to-mp3 / video-to-mp3 pages).
  const extractAudioPresets: ExtractAudioPresets = {
    defaultFormat: defaultExtractAudioFormat,
    lockedFormat: lockedExtractAudioFormat,
    accept: acceptOverride,
    expectedInput: lockedInputFormat,
  };

  // Preset/lock config for the focused video utility panels (batch 2).
  const videoCompressorPresets: VideoCompressorPresets = {
    defaultOutputFormat: defaultVideoOutputFormat,
    lockedOutputFormat: lockedVideoOutputFormat,
    defaultPreset: defaultVideoCompressionPreset,
    defaultCodec: defaultVideoCodec,
    expectedInput: lockedInputFormat,
  };
  const videoTrimmerPresets: VideoTrimmerPresets = {
    defaultOutputFormat: defaultVideoOutputFormat,
    lockedOutputFormat: lockedVideoOutputFormat,
    intent:
      defaultTask === 'video_cutter' || defaultTask === 'cut_video_online' ? 'cut' : 'trim',
    expectedInput: lockedInputFormat,
  };
  // The crop/resize/rotate panel emphasizes one control, derived from the task.
  const transformEmphasis: VideoTransformEmphasis =
    defaultTask === 'crop_video'
      ? 'crop'
      : defaultTask === 'rotate_video'
        ? 'rotate'
        : 'resize';
  const videoTransformPresets: VideoTransformPresets = {
    emphasis: transformEmphasis,
    defaultOutputFormat: defaultVideoOutputFormat,
    lockedOutputFormat: lockedVideoOutputFormat,
    defaultWidth: defaultVideoWidth,
    defaultHeight: defaultVideoHeight,
    defaultRotation: defaultTransform?.rotation,
    defaultCrop: defaultTransform?.crop,
    expectedInput: lockedInputFormat,
  };

  const isTranscribeAllowed =
    transcribeMode && (defaultMediaKind === 'video' || defaultMediaKind === 'audio');
  const isTranscodeAllowed = transcodeMode && defaultMediaKind === 'video';

  return (
    <ToolPanelSection compact={compact} aria-label={t('embeddedToolPanel.sectionAria')}>
      <ToolPanelIntro
        mediaKind={defaultMediaKind}
        transcribe={transcribeMode}
        tryItNow={t('embeddedToolPanel.tryItNow')}
        heading={heading}
        subheading={subheading}
      />
      {/* MM78: the voice panels render their own chip (ai_ops, or ops / ai_ops by mode).
          MM75: so does the summarize panel (its shell's chip, shown only once it can run). */}
      {showQuotaChip ? (
        <QuotaChip
          task={defaultTask}
          // MM90: the upscaler, face blur, redaction, object removal and vocal pages run a
          // generic converter task with a preset AI operation; that operation picks the metric.
          taskContext={{
            aiOperation:
              defaultAIImageOperation ??
              (preset && 'aiOperation' in preset ? preset.aiOperation : undefined),
            transcribe: transcribeMode,
          }}
          busy={isProcessing}
          className="mb-4"
        />
      ) : null}

      <ToolPanelFormats
        labels={{
          recommendedOutput: t('embeddedToolPanel.recommendedOutput'),
          outputLocked: t('embeddedToolPanel.outputLocked'),
          expectedInput: t('embeddedToolPanel.expectedInput'),
          accepts: t('embeddedToolPanel.accepts'),
        }}
        recommendedFormat={recommendedFormat}
        lockedOutputDisplay={lockedOutputDisplay}
        lockedInputFormat={lockedInputFormat}
        allowedInputFormats={allowedInputFormats}
      />

      {specializedPanel === 'summarize_video' || specializedPanel === 'summarize_audio' ? (
        <SummarizePanel task={specializedPanel} />
      ) : specializedPanel === 'inspect_metadata' ? (
        <MetadataInspectPanel accept={accept} />
      ) : specializedPanel === 'audio_waveform' ? (
        <AudioWaveformPanel />
      ) : specializedPanel === 'extract_audio' ||
        specializedPanel === 'mp4_to_mp3' ||
        specializedPanel === 'video_to_mp3' ? (
        <ExtractAudioPanel presets={extractAudioPresets} />
      ) : specializedPanel === 'extract_video_only' || specializedPanel === 'remove_audio_from_video' ? (
        <ExtractVideoOnlyPanel />
      ) : specializedPanel === 'extract_frames' ? (
        <ExtractFramesPanel />
      ) : specializedPanel === 'caption_translator' ? (
        <CaptionTranslatorPanel />
      ) : specializedPanel === 'stitch_audio_to_video' ? (
        <StitchAudioToVideoPanel />
      ) : specializedPanel === 'video_compressor' || specializedPanel === 'compress_mp4' ? (
        <VideoCompressorPanel presets={videoCompressorPresets} />
      ) : specializedPanel === 'video_trimmer' ||
        specializedPanel === 'mp4_trimmer' ||
        specializedPanel === 'video_cutter' ||
        specializedPanel === 'cut_video_online' ? (
        <VideoTrimmerPanel presets={videoTrimmerPresets} />
      ) : specializedPanel === 'crop_video' ||
        specializedPanel === 'resize_video' ||
        specializedPanel === 'rotate_video' ? (
        <VideoTransformPanel presets={videoTransformPresets} />
      ) : specializedPanel === 'voice_clone' ? (
        <VoiceCloningPanel />
      ) : specializedPanel === 'voice_design' ? (
        <VoiceDesignerPanel />
      ) : specializedPanel === 'voice_convert' ? (
        <VoiceChangerPanel />
      ) : !selectedFile ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={dropzoneClass(isDragOver)}
        >
          <DropzoneCopy
            dragDrop={t('embeddedToolPanel.dragDrop', { kind: t(`embeddedToolPanel.mediaKinds.${defaultMediaKind}`) })}
            selectHint={t('embeddedToolPanel.selectHint')}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={SELECT_FILE_BUTTON}
          >
            {t('embeddedToolPanel.selectFile')}
          </button>
          {/* Named explicitly: the trigger button is a sibling, not a label. */}
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileSelect}
            className="hidden"
            aria-label={t('embeddedToolPanel.selectFile')}
          />
          {/* §4.9: the caller's real upload cap, stated before they pick a file
              rather than after the upload fails. */}
          <UploadLimitHint className="mt-3" />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3 min-w-0">
              <span className="shrink-0 text-primary">
                {ICON_MAP[effectiveKind]}
              </span>
              <div className="min-w-0">
                <p className="font-medium text-card-foreground truncate">
                  {selectedFile.name}
                </p>
                <p className="num text-xs text-muted-foreground">
                  {formatFileSize(selectedFile.size)} ·{' '}
                  {safeFileExtension(selectedFile.name)}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={clearFile}
              className="text-muted-foreground hover:text-card-foreground transition-colors"
              aria-label={t('embeddedToolPanel.removeFile')}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {defaultTask === 'remove_metadata' && !isCompleted && (
            <ExifInspect
              file={selectedFile}
              processing={isProcessing}
              onStripAll={effectiveKind === 'image' ? handleStripEverything : undefined}
            />
          )}

          {isTranscodeAllowed && effectiveKind === 'video' ? (
            <VideoTranscodeForm
              file={selectedFile}
              defaultProtocol={transcodeProtocol}
              defaultDashCodec={transcodeDashCodec}
              lockProtocol={transcodeLockProtocol}
            />
          ) : isTranscribeAllowed && (effectiveKind === 'video' || effectiveKind === 'audio') ? (
            <TranscribeForm
              mediaKind={effectiveKind}
              isLoading={isProcessing}
              onSubmit={handleTranscribe}
              defaultFormat={
                defaultOutputFormat === 'srt' || defaultOutputFormat === 'vtt' ||
                defaultOutputFormat === 'txt' || defaultOutputFormat === 'json'
                  ? (defaultOutputFormat as 'srt' | 'vtt' | 'txt' | 'json')
                  : undefined
              }
            />
          ) : (
            <>
              {effectiveKind === 'image' && (
                <ImageConversionForm
                  onSubmit={handleConvert}
                  isLoading={isProcessing}
                  imageUrl={originalMediaUrl || undefined}
                  file={selectedFile}
                  presets={imagePresets}
                />
              )}
              {effectiveKind === 'video' && (
                <VideoConversionForm
                  onSubmit={handleConvert}
                  isLoading={isProcessing}
                  videoUrl={originalMediaUrl || undefined}
                  presets={videoPresets}
                />
              )}
              {effectiveKind === 'audio' && (
                <AudioConversionForm
                  onSubmit={handleConvert}
                  isLoading={isProcessing}
                  audioUrl={originalMediaUrl || undefined}
                  presets={audioPresets}
                  fileName={selectedFile?.name}
                  fileType={selectedFile?.type}
                />
              )}
              {effectiveKind === 'pdf' && (
                <PdfConversionForm
                  onSubmit={handleConvert}
                  isLoading={isProcessing}
                  presets={pdfPresets}
                />
              )}
            </>
          )}

          {!isTranscodeAllowed && isProcessing && (
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">
                {activeProgress > 0
                  ? t('embeddedToolPanel.uploadingPercent', { percent: activeProgress })
                  : t('embeddedToolPanel.workingOnFile')}{' '}
                {conversionJob?.progress ? `· ${conversionJob.progress}%` : ''}
              </p>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${conversionJob?.progress || activeProgress || 0}%`,
                  }}
                />
              </div>
            </div>
          )}

          {!isTranscodeAllowed && isCompleted && conversionJob && resultDescriptor && (
            <ResultPanel
              surface={surface ?? (toolSlug ? 'tool_page' : 'tutorial')}
              descriptor={resultDescriptor}
              targetFps={fpsHint(defaultTask, conversionOptions)}
              downloadFileName={getConvertedFilename()}
              downloadLabel={t('embeddedToolPanel.downloadFilename', { filename: getConvertedFilename() })}
              onDownloaded={upgradeNudge}
              offerMp3={isVocalStemJob(audioPresets?.aiOperation)}
              onRunAnother={clearFile}
              metadataStrip={defaultTask !== 'remove_metadata'}
            />
          )}

          {defaultTask === 'remove_metadata' && !isTranscodeAllowed && isCompleted && conversionJob && (
            <ExifResult
              jobId={conversionJob.id}
              originalName={selectedFile.name}
              resultName={resultDescriptor?.fileName ?? getConvertedFilename()}
              strippedCount={conversionJob.strippedCount}
              available={conversionJob.metadataAvailable}
            />
          )}

          {!isTranscodeAllowed && conversionJob?.status === 'failed' && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 text-sm text-destructive">
              {transcribeMode ? t('embeddedToolPanel.transcribeFailed') : t('embeddedToolPanel.conversionFailed')} {t('embeddedToolPanel.tryAgainOrOpen')}
            </div>
          )}
        </div>
      )}

      <ToolPanelFooter
        href={localized('/')}
        prefix={t('embeddedToolPanel.needFullPrefix')}
        linkLabel={t('embeddedToolPanel.openFullConverter')}
        suffix={t('embeddedToolPanel.needFullSuffix')}
      />
    </ToolPanelSection>
  );
};

export default EmbeddedToolPanel;
