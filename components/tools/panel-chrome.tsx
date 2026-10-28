import * as React from 'react';
import Link from 'next/link';
import {
  FileText,
  Image as ImageIcon,
  Info,
  Music,
  Sparkles,
  Upload,
  Video as VideoIcon,
} from 'lucide-react';

import { Panel } from '@/components/darkroom/panel';
import { cn } from '@/lib/utils';
import type { EmbedPreset } from '@/content/toolPages';
import type { EmbeddedMediaKind, EmbeddedTask } from '@/components/embedded-tool-panel';

/**
 * MM88: the static chrome of the embedded tool panel, shared by the live panel
 * (`components/embedded-tool-panel.tsx`, client-only) and its server-rendered shell
 * (`components/tools/tool-panel-shell.tsx`, the `next/dynamic` loading state).
 *
 * Both render the same section, intro, quota-chip slot, format box, dropzone and footer
 * from these pieces and these class strings, so when the island hydrates nothing moves:
 * the shell is the panel's empty state with the file picker disabled. Presentational
 * only: no hooks, no i18n; callers pass already-translated text.
 */

export const ACCEPT_MAP: Record<EmbeddedMediaKind, string> = {
  image: 'image/*',
  video: 'video/*',
  audio: 'audio/*',
  // PDF kind also accepts images so the pdf-converter hub can take either
  // direction (PDF -> image or image -> PDF).
  pdf: 'application/pdf,image/*',
};

export const ICON_MAP: Record<EmbeddedMediaKind, React.ReactNode> = {
  image: <ImageIcon className="w-5 h-5" />,
  video: <VideoIcon className="w-5 h-5" />,
  audio: <Music className="w-5 h-5" />,
  pdf: <FileText className="w-5 h-5" />,
};

export const DEFAULT_TITLES: Record<EmbeddedMediaKind, string> = {
  image: 'Try the image converter',
  video: 'Try the video converter',
  audio: 'Try the audio converter',
  pdf: 'Try the PDF converter',
};

export const DEFAULT_DESCRIPTIONS: Record<EmbeddedMediaKind, string> = {
  image:
    'Upload an image and pick a format. The same converter as the homepage — no signup required.',
  video:
    'Upload a video to convert, compress, or trim. The same converter as the homepage — no signup required.',
  audio:
    'Upload an audio file to convert or compress. The same converter as the homepage — no signup required.',
  pdf:
    'Upload a PDF to convert to images, or an image to turn into a PDF. No signup required.',
};

export const SPECIALIZED_PANEL_TASKS: Partial<Record<EmbeddedTask, true>> = {
  inspect_metadata: true,
  audio_waveform: true,
  extract_audio: true,
  extract_video_only: true,
  extract_frames: true,
  caption_translator: true,
  stitch_audio_to_video: true,
  // Video-to-audio pages output audio, not video, so they reuse the
  // specialized extract-audio flow rather than the video converter.
  mp4_to_mp3: true,
  video_to_mp3: true,
  // Video utility pages (batch 2) each render a focused panel instead of the
  // full advanced video form.
  video_compressor: true,
  compress_mp4: true,
  video_trimmer: true,
  mp4_trimmer: true,
  video_cutter: true,
  cut_video_online: true,
  crop_video: true,
  resize_video: true,
  rotate_video: true,
  remove_audio_from_video: true,
  // MM75: both summary pages render the summarize panel.
  summarize_video: true,
  summarize_audio: true,
  // MM78 voices.
  voice_clone: true,
  voice_design: true,
  voice_convert: true,
};

/** The subset of the panel's props that decides its static chrome. */
export interface PanelChromeInput {
  defaultMediaKind: EmbeddedMediaKind;
  defaultTask?: EmbeddedTask;
  preset?: EmbedPreset;
  title?: string;
  description?: string;
  acceptOverride?: string;
  allowedInputFormats?: string[];
  defaultOutputFormat?: string;
  lockedInputFormat?: string;
  lockedOutputFormat?: string;
  defaultVideoOutputFormat?: string;
  lockedVideoOutputFormat?: string;
  defaultExtractAudioFormat?: string;
  lockedExtractAudioFormat?: string;
  transcribeMode?: boolean;
}

export interface PanelChrome {
  accept: string;
  heading: string;
  subheading: string;
  /** A single "output is locked" value, regardless of media kind. */
  lockedOutputDisplay: string | undefined;
  /** Shown only when the output is not locked, so the two chips never repeat a format. */
  recommendedFormat: string | undefined;
  /** The focused panel this page renders instead of the generic dropzone + form, if any. */
  specializedPanel: EmbeddedTask | null;
  /** MM78/MM75: the voice and summarize panels render their own chip. */
  showQuotaChip: boolean;
}

export function describePanelChrome(p: PanelChromeInput): PanelChrome {
  const lockedOutputDisplay =
    p.lockedOutputFormat || p.lockedVideoOutputFormat || p.lockedExtractAudioFormat;
  const recommendedFormat = lockedOutputDisplay
    ? undefined
    : p.defaultOutputFormat || p.defaultVideoOutputFormat || p.defaultExtractAudioFormat;
  // A `panel: 'video_compressor'` preset selects the focused compressor panel
  // even when the page's defaultTask is the generic compress_video.
  const specializedPanel: EmbeddedTask | null =
    p.preset && p.preset.kind === 'video' && 'panel' in p.preset
      ? p.preset.panel
      : p.defaultTask && SPECIALIZED_PANEL_TASKS[p.defaultTask]
        ? p.defaultTask
        : null;
  const ownChip =
    specializedPanel === 'voice_clone' ||
    specializedPanel === 'voice_design' ||
    specializedPanel === 'voice_convert' ||
    specializedPanel === 'summarize_video' ||
    specializedPanel === 'summarize_audio';
  return {
    accept: p.acceptOverride || ACCEPT_MAP[p.defaultMediaKind],
    heading: p.title || DEFAULT_TITLES[p.defaultMediaKind],
    subheading: p.description || DEFAULT_DESCRIPTIONS[p.defaultMediaKind],
    lockedOutputDisplay,
    recommendedFormat,
    specializedPanel,
    showQuotaChip: !ownChip,
  };
}

/** The panel's outer section. `compact` only tightens the large breakpoint. */
export function ToolPanelSection({
  compact = true,
  className,
  children,
  ...props
}: {
  compact?: boolean;
  className?: string;
  children?: React.ReactNode;
  'aria-label'?: string;
  'aria-busy'?: boolean;
  'data-tool-shell'?: string;
}) {
  return (
    <Panel
      level="2"
      as="section"
      // Panel owns responsive padding; `compact` now only tightens the large
      // breakpoint rather than setting the old fixed p-10 / p-12.
      className={cn('my-8', compact && 'lg:p-6', className)}
      {...props}
    >
      {children}
    </Panel>
  );
}

export function ToolPanelIntro({
  mediaKind,
  transcribe,
  tryItNow,
  heading,
  subheading,
}: {
  mediaKind: EmbeddedMediaKind;
  transcribe?: boolean;
  tryItNow: string;
  heading: string;
  subheading: string;
}) {
  return (
    <div className="flex items-start gap-3 mb-4">
      <span className="mt-1 text-primary">
        {transcribe ? <FileText className="w-5 h-5" /> : ICON_MAP[mediaKind]}
      </span>
      <div>
        <h2 className="text-xl font-semibold text-card-foreground flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" /> {tryItNow}
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          <span className="font-medium">{heading}.</span> {subheading}
        </p>
      </div>
    </div>
  );
}

export interface FormatLabels {
  recommendedOutput: string;
  outputLocked: string;
  expectedInput: string;
  accepts: string;
}

export function ToolPanelFormats({
  labels,
  recommendedFormat,
  lockedOutputDisplay,
  lockedInputFormat,
  allowedInputFormats,
}: {
  labels: FormatLabels;
  recommendedFormat?: string;
  lockedOutputDisplay?: string;
  lockedInputFormat?: string;
  allowedInputFormats?: string[];
}) {
  if (!(recommendedFormat || lockedOutputDisplay || lockedInputFormat || allowedInputFormats?.length)) {
    return null;
  }
  return (
    <div className="mb-4 flex items-start gap-2 rounded-md border border-primary/30 bg-primary/10 p-3">
      <Info className="w-4 h-4 text-primary mt-0.5 shrink-0" />
      <div className="text-sm text-card-foreground">
        {recommendedFormat && (
          <p>
            <span className="font-medium">{labels.recommendedOutput}</span>{' '}
            <code className="px-1.5 py-0.5 bg-card border border-border rounded text-xs">
              {recommendedFormat.toUpperCase()}
            </code>
          </p>
        )}
        {lockedOutputDisplay && (
          <p>
            <span className="font-medium">{labels.outputLocked}</span>{' '}
            <code className="px-1.5 py-0.5 bg-card border border-border rounded text-xs">
              {lockedOutputDisplay.toUpperCase()}
            </code>
          </p>
        )}
        {lockedInputFormat && (
          <p>
            <span className="font-medium">{labels.expectedInput}</span>{' '}
            <code className="px-1.5 py-0.5 bg-card border border-border rounded text-xs">
              {lockedInputFormat.toUpperCase()}
            </code>
          </p>
        )}
        {allowedInputFormats && allowedInputFormats.length > 0 && (
          <p>
            <span className="font-medium">{labels.accepts}</span>{' '}
            {allowedInputFormats.map((f) => f.toUpperCase()).join(', ')}
          </p>
        )}
      </div>
    </div>
  );
}

export function dropzoneClass(isDragOver: boolean): string {
  return `border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
    isDragOver
      ? 'border-primary bg-primary/10'
      : 'border-muted-foreground/25 hover:border-muted-foreground/50'
  }`;
}

/** The dropzone's icon and two lines of copy (above the select button). */
export function DropzoneCopy({ dragDrop, selectHint }: { dragDrop: string; selectHint: string }) {
  return (
    <>
      <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
      <p className="font-medium text-card-foreground mb-1">{dragDrop}</p>
      <p className="text-sm text-muted-foreground mb-4">{selectHint}</p>
    </>
  );
}

/**
 * The focused panels that render `components/specialized-tool-shell.tsx` (its own quota
 * chip, a "Drop your {{hint}} here" dropzone and an `accept` of its own), with the
 * `interface:<key>.uploadHint` noun and accept list each one passes. The server shell
 * reads this so its empty state matches the panel the page will actually mount. A test
 * keeps it in step with the panels.
 */
export const SPECIALIZED_DROPZONES: Partial<
  Record<EmbeddedTask, { hintKey: string; accept: string | ((acceptOverride?: string) => string) }>
> = {
  extract_audio: { hintKey: 'extractAudio.uploadHint', accept: (o) => o ?? 'video/*' },
  mp4_to_mp3: { hintKey: 'extractAudio.uploadHint', accept: (o) => o ?? 'video/*' },
  video_to_mp3: { hintKey: 'extractAudio.uploadHint', accept: (o) => o ?? 'video/*' },
  extract_video_only: { hintKey: 'extractVideoOnly.uploadHint', accept: 'video/*' },
  remove_audio_from_video: { hintKey: 'extractVideoOnly.uploadHint', accept: 'video/*' },
  extract_frames: { hintKey: 'extractFrames.uploadHint', accept: 'video/*' },
  audio_waveform: { hintKey: 'audioWaveformPanel.uploadHint', accept: 'audio/*' },
  video_compressor: { hintKey: 'videoCompressor.uploadHint', accept: 'video/*' },
  compress_mp4: { hintKey: 'videoCompressor.uploadHint', accept: 'video/*' },
  video_trimmer: { hintKey: 'videoTrimmer.uploadHint', accept: 'video/*' },
  mp4_trimmer: { hintKey: 'videoTrimmer.uploadHint', accept: 'video/*' },
  video_cutter: { hintKey: 'videoTrimmer.uploadHint', accept: 'video/*' },
  cut_video_online: { hintKey: 'videoTrimmer.uploadHint', accept: 'video/*' },
  crop_video: { hintKey: 'videoTransform.uploadHint', accept: 'video/*' },
  resize_video: { hintKey: 'videoTransform.uploadHint', accept: 'video/*' },
  rotate_video: { hintKey: 'videoTransform.uploadHint', accept: 'video/*' },
};

export const SELECT_FILE_BUTTON =
  'bg-primary text-primary-foreground px-5 py-2 rounded-lg hover:bg-[var(--accent-primary-hover)] transition-colors disabled:cursor-wait disabled:opacity-60';

export function ToolPanelFooter({
  href,
  prefix,
  linkLabel,
  suffix,
}: {
  href: string;
  prefix: string;
  linkLabel: string;
  suffix: string;
}) {
  return (
    <p className="text-xs text-muted-foreground mt-4">
      {prefix}{' '}
      <Link
        href={href}
        className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary"
      >
        {linkLabel}
      </Link>{' '}
      {suffix}
    </p>
  );
}
