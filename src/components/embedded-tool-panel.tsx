import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Upload,
  Download,
  Image as ImageIcon,
  Video as VideoIcon,
  Music,
  X,
  Sparkles,
  Info,
  FileText,
} from 'lucide-react';
import { getFileType } from '@/lib/utils';
import ImageConversionForm from '@/components/image-conversion-form';
import PdfConversionForm, { type PdfFormPresets } from '@/components/pdf-conversion-form';
import VideoConversionForm from '@/components/video-conversion-form';
import AudioConversionForm from '@/components/audio-conversion-form';
import TranscribeForm from '@/components/transcribe-form';
import VideoTranscodeForm from '@/components/video-transcode-form';
import AudioWaveformPanel from '@/components/audio-waveform-panel';
import ExtractAudioPanel from '@/components/extract-audio-panel';
import ExtractVideoOnlyPanel from '@/components/extract-video-only-panel';
import ExtractFramesPanel from '@/components/extract-frames-panel';
import CaptionTranslatorPanel from '@/components/caption-translator-panel';
import StitchAudioToVideoPanel from '@/components/stitch-audio-to-video-panel';
import type { TranscodeProtocol, DashCodec } from '@/lib/transcodeTypes';
import useConvertFile, { type UploadFileResponse } from '@/lib/useConvertFile';
import useTranscribeFile, {
  type TranscribeFormData,
  type TranscribeUploadResponse,
} from '@/lib/useTranscribeFile';
import useGetJobStatus, { type ConversionJob } from '@/lib/useGetJobStatus';
import useDownloadFile from '@/lib/useDownloadFile';
import type { ConversionFormData } from '@/schemas/types';
import {
  trackFileConversion,
  trackFileDownload,
  trackFileUpload,
  getSafeFileExtension,
} from '@/lib/analytics';
import { useLocalization } from '@/i18n/useLocalization';

export type EmbeddedMediaKind = 'image' | 'video' | 'audio' | 'pdf';

export type EmbeddedTask =
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
  | 'pdf_converter';

/** Output formats the embedded image converter understands. "pdf" routes the
 *  image through the document pathway (image -> single-page PDF). */
export type EmbeddedImageFormat = 'jpg' | 'png' | 'webp' | 'gif' | 'pdf';

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
}

interface EmbeddedToolPanelProps {
  /** Default media kind to bias the panel toward when no file is selected yet. */
  defaultMediaKind: EmbeddedMediaKind;
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

const ACCEPT_MAP: Record<EmbeddedMediaKind, string> = {
  image: 'image/*',
  video: 'video/*',
  audio: 'audio/*',
  // PDF kind also accepts images so the pdf-converter hub can take either
  // direction (PDF -> image or image -> PDF).
  pdf: 'application/pdf,image/*',
};

const ICON_MAP: Record<EmbeddedMediaKind, React.ReactNode> = {
  image: <ImageIcon className="w-5 h-5" />,
  video: <VideoIcon className="w-5 h-5" />,
  audio: <Music className="w-5 h-5" />,
  pdf: <FileText className="w-5 h-5" />,
};

const DEFAULT_TITLES: Record<EmbeddedMediaKind, string> = {
  image: 'Try the image converter',
  video: 'Try the video converter',
  audio: 'Try the audio converter',
  pdf: 'Try the PDF converter',
};

const DEFAULT_DESCRIPTIONS: Record<EmbeddedMediaKind, string> = {
  image:
    'Upload an image and pick a format. The same converter as the homepage — no signup required.',
  video:
    'Upload a video to convert, compress, or trim. The same converter as the homepage — no signup required.',
  audio:
    'Upload an audio file to convert or compress. The same converter as the homepage — no signup required.',
  pdf:
    'Upload a PDF to convert to images, or an image to turn into a PDF. No signup required.',
};

const TASK_HINTS: Partial<Record<EmbeddedTask, { recommended?: string; note?: string }>> = {
  remove_metadata: {
    note:
      'Scroll to the Metadata section after uploading and set metadata mode to “Strip” to remove EXIF, GPS, and IPTC fields.',
  },
  compress_video: {
    note:
      'Lower the quality preset or bitrate to shrink the file. Keep the same resolution and codec for the most natural-looking result.',
  },
  video_to_gif: {
    recommended: 'gif',
    note: 'Pick GIF as the output format. Trim to under ~10 seconds for a small, shareable file.',
  },
  webp_to_jpg: {
    recommended: 'jpg',
    note: 'Pick JPG as the output format. JPG drops transparency, so use PNG instead if your image has a transparent background.',
  },
  wav_to_mp3: {
    recommended: 'mp3',
    note: 'Pick MP3 as the output format. 192 kbps is a good default for voice; 256–320 kbps for music.',
  },
  isolate_vocals: {
    note: 'After uploading, enable the “Isolate Vocals” AI tool in the audio panel. Output WAV preserves the most detail.',
  },
  image_converter: {
    note: 'Pick any output format: JPG for photos, PNG for transparency, WebP/AVIF for the smallest web files.',
  },
  video_converter: {
    note: 'MP4 is the safe everywhere default. WebM gives smaller files for modern browsers.',
  },
  audio_converter: {
    note: 'MP3 plays everywhere. WAV is lossless but large. M4A/AAC is a good compressed default for music.',
  },
  transcribe_video: {
    note: 'Choose the transcript format that fits your use case — VTT for captions, plain text for an article, JSON for downstream tooling.',
  },
  transcode_to_hls: {
    note: 'Free tier covers 360p/480p/720p. We package master.m3u8 + variant playlists + .ts segments into a downloadable .tar.gz.',
  },
  transcode_to_dash: {
    note: 'Pick AV1 (smaller files) or VP9 (broader playback). The .tar.gz contains manifest.mpd + per-rendition init/segment files.',
  },
  srt_generator: {
    recommended: 'srt',
    note: 'SRT is selected by default — the file works on YouTube, in DaVinci Resolve / Premiere, and in most video editors.',
  },
  caption_translator: {
    note: 'Upload an existing .srt or .vtt file. Cue timings are preserved exactly — only the text is translated, on our local AI server.',
  },
  audio_waveform: {
    note: 'Defaults to a wide 10:1 waveform video — perfect for podcasts, music previews, and editing timelines. Switch to image-only or both via the Output selector.',
  },
  extract_audio: {
    recommended: 'mp3',
    note: 'Extracts the first audio track of the video. Videos with no audio return a clear error.',
  },
  extract_video_only: {
    recommended: 'mp4',
    note: 'Strips all audio tracks. We stream-copy the video stream where possible — no re-encode, no quality loss.',
  },
  extract_frames: {
    note: 'Bundles the extracted frames into a single .zip you can download in one click. The max-frame cap keeps runs short.',
  },
  stitch_audio_to_video: {
    note: 'Add up to three audio tracks (music, voiceover, narration) and pick "mix" or "replace" to control whether the original audio stays.',
  },
  ai_frame_interpolation: {
    recommended: 'mp4',
    note: 'After uploading, scroll to the "AI Video Tools" panel and pick AI Frame Interpolation. Choose a target FPS (48, 60, or 120). Output is MP4 in v1.',
  },
  // Image SEO tasks. User-facing guidance prose lives in each tool's
  // canonical `embed.description` (toolPages.ts) rather than being hardcoded
  // here, so these only carry the data-shaped `recommended` format chip.
  png_to_jpg: { recommended: 'jpg' },
  jpg_to_png: { recommended: 'png' },
  webp_to_png: { recommended: 'png' },
  png_to_webp: { recommended: 'webp' },
  jpg_to_webp: { recommended: 'webp' },
  jpg_converter: { recommended: 'jpg' },
  png_converter: { recommended: 'png' },
  image_resizer: {},
  compress_image: {},
  remove_background: { recommended: 'png' },
  // PDF tasks. Guidance prose lives in each tool's canonical embed.description.
  image_to_pdf: { recommended: 'pdf' },
  jpg_to_pdf: { recommended: 'pdf' },
  png_to_pdf: { recommended: 'pdf' },
  pdf_to_jpg: { recommended: 'jpg' },
  pdf_to_png: { recommended: 'png' },
  pdf_converter: {},
};

const SPECIALIZED_PANEL_TASKS: Partial<Record<EmbeddedTask, true>> = {
  audio_waveform: true,
  extract_audio: true,
  extract_video_only: true,
  extract_frames: true,
  caption_translator: true,
  stitch_audio_to_video: true,
};

/**
 * Compact, embedded version of the homepage converter for tutorial and
 * /tools landing pages. Reuses the same form components, upload hook,
 * status poller, and download helper as the full app so behavior stays
 * consistent. Intentionally omits conversion history, ads, and the
 * result modal — landing pages only need the core "upload → convert →
 * download" loop.
 */
const EmbeddedToolPanel: React.FC<EmbeddedToolPanelProps> = ({
  defaultMediaKind,
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [conversionJob, setConversionJob] = useState<ConversionJob | null>(null);
  const [conversionOptions, setConversionOptions] =
    useState<ConversionFormData | null>(null);
  const [originalMediaUrl, setOriginalMediaUrl] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: jobStatusData } = useGetJobStatus(conversionJob);
  const { downloadFile } = useDownloadFile();

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

  const onFileChosen = (file: File) => {
    setSelectedFile(file);
    setConversionJob(null);
    setConversionOptions(null);
    trackFileUpload(getFileType(file), file.size, file.name);
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
    const fromFormat =
      selectedFile.name.split('.').pop()?.toLowerCase() || 'unknown';
    trackFileConversion(fromFormat, data.format, selectedFile.size);
    convertMutate({ file: selectedFile, options: data });
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
    return `${nameWithoutExt}.${conversionOptions.format}`;
  };

  const saveBlobToDisk = (blob: Blob, fileName: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownload = async () => {
    if (!conversionJob?.id) return;
    try {
      const blob = await downloadFile(conversionJob.id);
      const fileName = getConvertedFilename();
      saveBlobToDisk(blob, fileName);
      trackFileDownload(fileName, effectiveKind);
    } catch (err) {
      console.error('Embedded tool download failed', err);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setConversionJob(null);
    setConversionOptions(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const isPending = transcribeMode ? isTranscribePending : isConvertPending;
  const activeProgress = transcribeMode ? transcribeProgress : uploadProgress;
  const isProcessing = isPending || conversionJob?.status === 'processing';
  const isCompleted = conversionJob?.status === 'completed';
  const accept = acceptOverride || ACCEPT_MAP[defaultMediaKind];

  const heading = title || DEFAULT_TITLES[defaultMediaKind];
  const subheading = description || DEFAULT_DESCRIPTIONS[defaultMediaKind];
  const { t, formatFileSize } = useLocalization('interface');
  const hint = defaultTask ? TASK_HINTS[defaultTask] : undefined;
  const recommendedFormat = defaultOutputFormat || hint?.recommended;

  const isImageFormat = (v: string | undefined): v is EmbeddedImageFormat =>
    v === 'jpg' || v === 'png' || v === 'webp' || v === 'gif';

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
  };

  const pdfPresets: PdfFormPresets = {
    defaultOutputFormat: pdfDefaultOutputFormat,
    lockOutputFormat: pdfLockOutputFormat,
    defaultPageSelection: pdfDefaultPageSelection,
    defaultDpi: pdfDefaultDpi,
  };

  const isTranscribeAllowed =
    transcribeMode && (defaultMediaKind === 'video' || defaultMediaKind === 'audio');
  const isTranscodeAllowed = transcodeMode && defaultMediaKind === 'video';
  const specializedPanel = defaultTask && SPECIALIZED_PANEL_TASKS[defaultTask] ? defaultTask : null;

  return (
    <section
      className={`bg-card border border-border rounded-lg ${compact ? 'p-10' : 'p-12'} my-8 sci-fi-frame-inner`}
      aria-label={t('embeddedToolPanel.sectionAria')}
    >
      <div className="flex items-start gap-3 mb-4">
        <span className="mt-1 text-blue-600">
          {transcribeMode ? <FileText className="w-5 h-5" /> : ICON_MAP[defaultMediaKind]}
        </span>
        <div>
          <h2 className="text-xl font-semibold text-card-foreground flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600" /> {t('embeddedToolPanel.tryItNow')}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            <span className="font-medium">{heading}.</span> {subheading}
          </p>
        </div>
      </div>

      {(hint?.note || recommendedFormat || lockedOutputFormat || lockedInputFormat || allowedInputFormats?.length) && (
        <div className="mb-4 flex items-start gap-2 rounded-md border border-blue-200 dark:border-blue-900/60 bg-blue-50/50 dark:bg-blue-950/30 p-3">
          <Info className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
          <div className="text-sm text-card-foreground">
            {recommendedFormat && (
              <p>
                <span className="font-medium">{t('embeddedToolPanel.recommendedOutput')}</span>{' '}
                <code className="px-1.5 py-0.5 bg-card border border-border rounded text-xs">
                  {recommendedFormat.toUpperCase()}
                </code>
              </p>
            )}
            {lockedOutputFormat && (
              <p>
                <span className="font-medium">{t('embeddedToolPanel.outputFormat')}</span>{' '}
                <code className="px-1.5 py-0.5 bg-card border border-border rounded text-xs">
                  {lockedOutputFormat.toUpperCase()}
                </code>
              </p>
            )}
            {lockedInputFormat && (
              <p>
                <span className="font-medium">{t('embeddedToolPanel.expectedInput')}</span>{' '}
                <code className="px-1.5 py-0.5 bg-card border border-border rounded text-xs">
                  {lockedInputFormat.toUpperCase()}
                </code>
              </p>
            )}
            {allowedInputFormats && allowedInputFormats.length > 0 && (
              <p>
                <span className="font-medium">{t('embeddedToolPanel.accepts')}</span>{' '}
                {allowedInputFormats.map((f) => f.toUpperCase()).join(', ')}
              </p>
            )}
            {hint?.note && <p className="text-muted-foreground mt-1">{hint.note}</p>}
          </div>
        </div>
      )}

      {specializedPanel === 'audio_waveform' ? (
        <AudioWaveformPanel />
      ) : specializedPanel === 'extract_audio' ? (
        <ExtractAudioPanel />
      ) : specializedPanel === 'extract_video_only' ? (
        <ExtractVideoOnlyPanel />
      ) : specializedPanel === 'extract_frames' ? (
        <ExtractFramesPanel />
      ) : specializedPanel === 'caption_translator' ? (
        <CaptionTranslatorPanel />
      ) : specializedPanel === 'stitch_audio_to_video' ? (
        <StitchAudioToVideoPanel />
      ) : !selectedFile ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            isDragOver
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/50'
              : 'border-muted-foreground/25 hover:border-muted-foreground/50'
          }`}
        >
          <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="font-medium text-card-foreground mb-1">
            {t('embeddedToolPanel.dragDrop', { kind: t(`embeddedToolPanel.mediaKinds.${defaultMediaKind}`) })}
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            {t('embeddedToolPanel.selectHint')}
          </p>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t('embeddedToolPanel.selectFile')}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3 min-w-0">
              <span className="shrink-0 text-blue-600">
                {ICON_MAP[effectiveKind]}
              </span>
              <div className="min-w-0">
                <p className="font-medium text-card-foreground truncate">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(selectedFile.size)} ·{' '}
                  {getSafeFileExtension(selectedFile.name)}
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
                />
              )}
              {effectiveKind === 'audio' && (
                <AudioConversionForm
                  onSubmit={handleConvert}
                  isLoading={isProcessing}
                  audioUrl={originalMediaUrl || undefined}
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
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${conversionJob?.progress || activeProgress || 0}%`,
                  }}
                />
              </div>
            </div>
          )}

          {!isTranscodeAllowed && isCompleted && (
            <button
              type="button"
              onClick={() => void handleDownload()}
              className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              {t('embeddedToolPanel.downloadFilename', { filename: getConvertedFilename() })}
            </button>
          )}

          {!isTranscodeAllowed && conversionJob?.status === 'failed' && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 text-sm text-destructive">
              {transcribeMode ? t('embeddedToolPanel.transcribeFailed') : t('embeddedToolPanel.conversionFailed')} {t('embeddedToolPanel.tryAgainOrOpen')}
            </div>
          )}
        </div>
      )}

      <p className="text-xs text-muted-foreground mt-4">
        {t('embeddedToolPanel.needFullPrefix')}{' '}
        <Link to="/" className="text-blue-600 hover:underline">
          {t('embeddedToolPanel.openFullConverter')}
        </Link>{' '}
        {t('embeddedToolPanel.needFullSuffix')}
      </p>
    </section>
  );
};

export default EmbeddedToolPanel;
