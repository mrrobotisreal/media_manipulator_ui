/**
 * Data-driven definitions for the high-intent /tools landing pages.
 *
 * Each entry is consumed by both the reusable ToolLandingPage component
 * and the central SEO map (src/lib/seo.ts) so titles, descriptions, FAQ
 * content, and the embedded panel config stay in sync.
 */

import type {
  EmbeddedMediaKind,
  EmbeddedTask,
  EmbeddedAIImageOperation,
  EmbeddedVideoFormat,
  EmbeddedExtractAudioFormat,
  EmbeddedVideoCompressionPreset,
  EmbeddedVideoCodec,
  AudioEffectEmphasis,
  AudioEffectDefaults,
  VideoEffectEmphasis,
  VideoEffectDefaults,
  ImageEffectEmphasis,
} from '@/components/embedded-tool-panel';
import type { DashCodec, TranscodeProtocol } from '@/lib/transcodeTypes';
import { MOTION_BRAND } from '@/lib/vector/brand';

import { RETENTION_PROMISE } from '@/content/retentionPromise';
import { privacyNoteFor } from '@/content/toolPrivacy';
import { CATALOG_TOOL_PAGES, VOICE_TOOL_PAGES } from '@/content/toolPagesCatalog';
import { aliasTargetOf } from '@/content/toolAliases';

export { RETENTION_PROMISE } from '@/content/retentionPromise';

export interface ToolFaq {
  question: string;
  answer: string;
}

export interface ToolUseCase {
  title: string;
  description: string;
}

export interface ToolFlowStepData {
  title: string;
  description?: string;
}

/** MM84: a worked example with real numbers taken from the API's behaviour. */
export interface ToolWorkedExample {
  /** Short heading, e.g. "A 48 MB phone clip at Balanced". */
  title: string;
  /** Input size/format -> output size/format and time, phrased "about" where it depends on the input. */
  body: string;
}

export interface ToolRelatedLink {
  label: string;
  to: string;
  description?: string;
}

/**
 * Tool-page supported-format entries. Rendered as labelled badge groups in
 * the "Supported formats" section of ToolLandingPage. Both fields are
 * optional — tools that don't accept/produce discrete formats (e.g. the
 * transcoder, which always bundles multiple renditions) can omit them.
 */
export interface ToolSupportedFormats {
  /** Input file containers/extensions the tool accepts. */
  supportedInputFormats?: string[];
  /** Output file containers/extensions the tool produces. */
  supportedOutputFormats?: string[];
  /** Free-text notes about file-size limits, retention, or batch limits. */
  maxFileNotes?: string[];
  /** Free-text notes about processing time, GPU usage, or edge cases. */
  processingNotes?: string[];
}

/**
 * Task preset for a tool page: tells the embedded form to open already set up
 * for the task the page's SEO copy promises, so the visitor never has to
 * "scroll down and change a setting". Discriminated by `kind` so the compiler
 * rejects nonsense (e.g. an audio preset carrying `targetFps`).
 */
export type EmbedPreset =
  | { kind: 'metadata'; mode: 'strip' }
  | {
      kind: 'audio';
      aiOperation: 'clean_voice' | 'remove_background_noise' | 'isolate_vocals' | 'remove_vocals';
      /** Replace the operation select with a read-only chip naming the operation. */
      hideOperationSelect?: boolean;
      /**
       * Output format seeded into the form (e.g. 'wav'). For the vocal-stem operations it is
       * the stem choice: 'auto' (same as the input, MM81), 'mp3', 'flac' or 'wav'.
       */
      format?: string;
    }
  | {
      kind: 'video';
      aiOperation: 'frame_interpolation';
      /** Mount with the AI Video Tools panel open and the operation selected. */
      openAiPanel: true;
      targetFps?: 48 | 60 | 120;
      /** Render the target-FPS picker before the other AI options. */
      fpsPickerOnTop?: boolean;
    }
  | { kind: 'video'; panel: 'video_compressor' }
  // Catalog expansion (2026-10-28): the converter forms open on, and highlight,
  // the one section the page is about, with that section's values seeded.
  | { kind: 'audio_effect'; effect: AudioEffectEmphasis; defaults?: AudioEffectDefaults }
  | { kind: 'video_effect'; effect: VideoEffectEmphasis; defaults?: VideoEffectDefaults }
  | { kind: 'image_effect'; effect: ImageEffectEmphasis; filter?: string };

export interface ToolPageContent {
  /** Path slug under /tools, e.g. "remove-exif-metadata" -> /tools/remove-exif-metadata */
  slug: string;
  /**
   * MM85: when this page's copy was last reviewed or materially changed
   * (YYYY-MM-DD, from git), for the sitemap's lastModified. Absent means
   * TOOL_PAGES_DEFAULT_REVIEWED (content/pageDates.ts); MM84 sets it per page.
   */
  lastReviewed?: string;
  /** Display name used in breadcrumbs and the /tools index card. */
  name: string;
  /** High-intent H1 for the page. */
  h1: string;
  /** Short tagline shown under the H1. */
  tagline: string;
  /** SEO meta title (≤ ~70 chars). */
  metaTitle: string;
  /** SEO meta description (~155 chars). */
  metaDescription: string;
  /** Open Graph title (often same as metaTitle). */
  ogTitle: string;
  /** Open Graph description (often same as metaDescription). */
  ogDescription: string;
  /** Top-level category for the /tools index grouping. */
  category: 'image' | 'video' | 'audio' | 'ai' | 'metadata' | 'contentStudio' | 'motion';
  /** Embedded panel configuration. */
  embed: {
    defaultMediaKind: EmbeddedMediaKind;
    defaultTask: EmbeddedTask;
    defaultOutputFormat?: string;
    lockedInputFormat?: string;
    lockedOutputFormat?: string;
    allowedInputFormats?: string[];
    acceptOverride?: string;
    /** Task preset: the form opens already set up for this page's task. */
    preset?: EmbedPreset;
    /** Preselect an AI image operation (image tools only). */
    defaultAIImageOperation?: EmbeddedAIImageOperation;
    /** Lock the AI image operation select (image tools only). */
    lockedAIImageOperation?: boolean;
    /** Preselect JPG/WebP quality 1–100 (image tools only). */
    defaultQuality?: number;
    /** Preselect target width in px (image tools only). */
    defaultWidth?: number;
    /** Preselect target height in px (image tools only). */
    defaultHeight?: number;
    /** Visually emphasize the resize controls (image resizer). */
    emphasizeResize?: boolean;
    /** Video: preselect the output container/codec (video tools only). */
    defaultVideoOutputFormat?: EmbeddedVideoFormat;
    /** Video: lock the output container/codec select (e.g. MOV -> MP4 pages). */
    lockedVideoOutputFormat?: EmbeddedVideoFormat;
    /** Video: preselect the quality preset (video tools only). */
    defaultVideoQuality?: 'low' | 'medium' | 'high';
    /** Video: preselect target width in px (video tools only). */
    defaultVideoWidth?: number;
    /** Video: preselect target height in px (video tools only). */
    defaultVideoHeight?: number;
    /** Video: preselect playback speed multiplier (video tools only). */
    defaultVideoSpeed?: number;
    /** Extract-audio: preselect the output audio format (video-to-audio pages). */
    defaultExtractAudioFormat?: EmbeddedExtractAudioFormat;
    /** Extract-audio: lock the output audio format (mp4-to-mp3 page). */
    lockedExtractAudioFormat?: EmbeddedExtractAudioFormat;
    /** Video compressor: default compression level. */
    defaultVideoCompressionPreset?: EmbeddedVideoCompressionPreset;
    /** Video compressor: default codec. */
    defaultVideoCodec?: EmbeddedVideoCodec;
    /** Crop/resize/rotate: seed transform values (rotate-video / crop-video). */
    defaultTransform?: { rotation?: number; crop?: { x: number; y: number; width: number; height: number } };
    /** PDF -> image: default output image format (jpg | png). */
    pdfDefaultOutputFormat?: 'jpg' | 'png';
    /** PDF -> image: lock the output format select. */
    pdfLockOutputFormat?: boolean;
    /** PDF -> image: default page selection (all | first). */
    pdfDefaultPageSelection?: 'all' | 'first';
    /** PDF -> image: default render DPI. */
    pdfDefaultDpi?: number;
    transcribeMode?: boolean;
    transcodeMode?: boolean;
    transcodeProtocol?: TranscodeProtocol;
    transcodeDashCodec?: DashCodec;
    transcodeLockProtocol?: boolean;
    title: string;
    description: string;
  };
  /** Intro paragraph that follows the H1. */
  intro: string;
  /** Customer-facing "What this tool does" copy. */
  whatItDoes: string[];
  /** Plain-language how-it-works steps for the flow diagram. */
  flowSteps: ToolFlowStepData[];
  /** Optional power-user technical details (expandable section). */
  advancedDetails?: string[];
  /** Why this matters. */
  whyItMatters: string[];
  /** Common use cases. */
  useCases: ToolUseCase[];
  /** Why Media Manipulator's version stands out. */
  whyMediaManipulator: string[];
  /** Privacy / temporary storage explanation. */
  privacyNote: string;
  /** FAQ entries. */
  faq: ToolFaq[];
  /** Related links surfaced on the page. */
  related: ToolRelatedLink[];
  /** Primary keyword (for keywordMap + meta keywords list). */
  primaryKeyword: string;
  /** Secondary keywords. */
  secondaryKeywords: string[];
  /** Optional supported-format section content. */
  supportedFormats?: ToolSupportedFormats;
  /**
   * MM84 copy bar: two worked examples with real numbers (required on the 24
   * allowlisted + pending pages, see content/toolCopy.test.ts).
   */
  workedExamples?: ToolWorkedExample[];
  /** MM84 copy bar: one "When not to use this" paragraph. */
  whenNotToUse?: string;
  /**
   * MM84: this slug is a thin alias of another page with the same intent
   * (content/toolAliases.ts). The alias keeps its URL, H1, intro and panel,
   * sets its canonical to the primary, is `noindex, follow`, and is never
   * listed on /tools, in the sitemap or in llms.txt.
   */
  aliasOf?: string;
  /**
   * Shipped features for a `SoftwareApplication` JSON-LD block (MM48). When set,
   * lib/seo.ts emits SoftwareApplication with this `featureList` instead of the
   * generic WebApplication block. List only what users can use today.
   */
  featureList?: string[];
}

const sharedPrivacyNote =
  `Your uploads are processed on our own servers. ${RETENTION_PROMISE}. We do not share your files with third-party AI providers, and AI features run on a local GPU server we operate. No login or account is required.`;

const TOOL_PAGE_ENTRIES: ToolPageContent[] = [
  // ----------------------------------------------------------------------- CONTENT STUDIO
  {
    slug: 'content-studio',
    name: 'Darkroom',
    h1: 'Darkroom',
    tagline:
      'Edit, layer, and mix video & audio on a multi-track timeline — then export MP4. A Premiere Pro–style editor, right in your browser.',
    metaTitle: 'Darkroom — Free Online Multi-Track Video Editor | Media Manipulator',
    metaDescription:
      'Edit, layer, and mix video & audio on a multi-track timeline, then export MP4 — a free, Premiere Pro–style video editor that runs right in your browser. No signup, no install.',
    ogTitle: '🎬 Darkroom — Free Multi-Track Video Editor in Your Browser',
    ogDescription:
      'Edit, layer & mix video and audio on a multi-track timeline, add titles, transitions & color, then export MP4. A Premiere Pro–style editor — right in your browser, no signup, totally free. Come try it! 🎬',
    category: 'contentStudio',
    embed: {
      defaultMediaKind: 'video',
      defaultTask: 'edit_video',
      title: 'Edit video',
      description:
        'Create a new project (or reopen a recent one), drag video, image, and audio files into the media bin, then drop them onto the multi-track timeline. Trim, split, and arrange clips, layer overlays and titles, mix audio, and export a finished MP4 — all in your browser.',
    },
    intro:
      'Darkroom is a multi-track video editor that runs in a browser tab. You create a project with a canvas and a frame rate, drop video, image and audio files into a media bin, lay them out on stacked tracks, trim and split them at frame boundaries, grade and key them, add titles, transitions and captions, mix the audio with a per-track mixer, and then hand the finished timeline to our render server, where ffmpeg builds the whole edit as one filter graph and encodes it to H.264 or HEVC in MP4, or to MP3 or WAV when the project is audio only. The preview you edit against is composited live on your GPU in WebGL2; the export is checked against that preview so what you saw is what you get.',
    whatItDoes: [
      'Runs a frame-accurate multi-track timeline: trim, split, ripple delete, razor, slip, slide, roll and ripple edits, markers, groups, track lock, solo and hide, and detaching audio from video.',
      'Composites tracks in stacking order with crop, fit, transform, a Lumetri-style colour grade (exposure, contrast, saturation, temperature, tint, vibrance), 3D LUTs, chroma key with an eyedropper, opacity and eight blend modes.',
      'Animates position, scale, rotation, opacity, volume, pan and effect parameters with keyframes and five easing curves; adds fifteen transitions and title clips built from text and shape layers.',
      'Mixes audio through a per-track fader, pan, three-band EQ and compressor with live meters, plus ducking and streaming, podcast and broadcast loudness presets on the master bus.',
      'Generates captions with Whisper on our GPU, lets you edit them in a captions lane, and exports them burned into the picture or as an SRT or VTT sidecar.',
      'Exports H.264 or HEVC MP4 with AAC audio, or MP3 or WAV, at the canvas size or scaled to 720, 1080, 1440 or 2160 lines, and keeps an exports panel with progress and re-render.',
    ],
    flowSteps: [
      {
        title: 'Create a project',
        description: 'Pick a canvas (16:9 at 1920 x 1080, 9:16 at 1080 x 1920, 1:1, 4:5 or a custom size) and a frame rate of 24, 30 or 60.',
      },
      {
        title: 'Import media',
        description: 'Upload video, images and audio to the media bin. The server renders a preview proxy with a keyframe every second so scrubbing stays cheap.',
      },
      {
        title: 'Cut and layer',
        description: 'Place clips on tracks, trim and split at the playhead, stack overlays and titles above the base footage, and hold still images for any length.',
      },
      {
        title: 'Grade, key and mix',
        description: 'Adjust colour, apply a LUT, key out a background, keyframe what should move, and balance the audio tracks on the mixer.',
      },
      {
        title: 'Export',
        description: 'Choose format, quality, output height, captions mode and loudness preset. ffmpeg renders the timeline on our server and the file appears in the exports panel.',
      },
    ],
    advancedDetails: [
      'The export is one ffmpeg invocation: every source is an input, the timeline becomes a filter_complex graph (trim, scale, overlay, drawtext for titles, eq and colour filters, amix with normalize=0 for audio) and the output is encoded in a single pass. Keyframed parameters ride a sendcmd sidecar on the graph, which needs ffmpeg 4.4 or newer on the render host.',
      'H.264 uses the h264_nvenc hardware encoder when a probe encode succeeds on the render GPU, otherwise libx264. Quality presets map to NVENC preset p4 at constant quality 23 (Medium), p5 at CQ 19 (High) and p4 at CQ 28 (Low); on libx264 they are preset medium CRF 23, slow CRF 18 and veryfast CRF 28. Both pin yuv420p.',
      'HEVC uses hevc_nvenc or libx265 at CQ or CRF values five points higher (28, 24, 33 on NVENC; 28, 24, 32 on libx265), which is the usual offset for equal perceived quality, and tags the stream hvc1 so the MP4 plays in Safari and QuickTime. If neither encoder is available the export fails loudly instead of handing back H.264 under an HEVC name.',
      'Audio is resampled to 48 kHz stereo inside the graph and encoded as AAC at 192 kb/s for video exports; MP3 exports use libmp3lame at 192 kb/s and WAV exports are 16-bit PCM. The loudness presets are ffmpeg loudnorm: streaming I=-14 LUFS TP=-1.5 LRA=11, podcast I=-16 TP=-1.5 LRA=11, broadcast I=-23 TP=-2 LRA=7.',
      'Choosing an output height scales the composed frame as the last filter (lanczos, square pixels, width rounded to an even number), after captions are burned in, so text is scaled with the picture rather than redrawn. A height your plan cannot render is refused with an error, never silently downgraded.',
      'MP4 files are written with -movflags +faststart so the index sits at the front and the file starts playing before it has fully downloaded. Still images on the timeline become inputs with -loop 1 -framerate <project fps> -t <hold>, so a held photo costs no more to decode than its frames.',
    ],
    whyItMatters: [
      'A conversion tool changes one file. An edit combines several: the b-roll under the interview, the title over the opening, the music bed under both, each trimmed to the frame.',
      'Preview and export usually drift apart in browser editors. Darkroom renders the preview on your GPU and the export on ours, and keeps the two inside a documented tolerance with a golden-image harness.',
      'The heavy work stays off your laptop. A 4K export, a Whisper transcription or a LUT-graded multi-layer composite runs on a GPU render server, so a thin notebook can finish the job.',
    ],
    useCases: [
      {
        title: 'Vertical clips for short-form platforms',
        description: 'A 1080 x 1920 canvas, a punch-in on the speaker, a title card, music ducked under the voice and captions burned in.',
      },
      {
        title: 'Tutorials and screen recordings',
        description: 'Cut dead air, stitch takes, overlay a webcam picture-in-picture, add callouts and export at 1080p with a sidecar caption file.',
      },
      {
        title: 'Interview and podcast episodes',
        description: 'Two camera angles cut to the speaker, a loudness-normalised mix, and an MP3 export of the same timeline for the audio feed.',
      },
      {
        title: 'Promos and product videos',
        description: 'Chroma-keyed footage over a background plate, a LUT for the look, keyframed logo moves and a 15-second cut at 4K for the wall screen.',
      },
    ],
    whyMediaManipulator: [
      'Real editing primitives: razor, slip, slide, roll, ripple, markers, groups, keyframes with easing, a mixer with EQ and compression, not a trimmer with a title field.',
      'Honest exports: hardware or software encoding is chosen by a live probe, HEVC refuses rather than lies, and a resolution your plan cannot render is an error, not a quiet downgrade.',
      'One account, one place: transcribe, compress or strip metadata from the same files you edit, and generate voiceover or captions on the same GPU server.',
    ],
    privacyNote:
      `Darkroom keeps your media on our servers for as long as the project exists: uploads go to the media bin as assets, the server renders preview proxies, filmstrips and waveform peaks from them, and exports are built by ffmpeg into outputs/<jobId>/ on the render host. When you ask for captions, the audio is sent to Whisper on our own GPU and the resulting cues are stored with the project. The project document, its assets, versions and exports can be deleted from the editor or your Account page. ${RETENTION_PROMISE}. Uploaded video and audio also pass through an automated analysis step on our own server. Nothing is sent to a third-party AI provider and no file is used to train anything.`,
    faq: [
      {
        question: 'Is Darkroom free?',
        answer:
          'Yes. Without an account you can keep one project and render 5 exports a day, with uploads up to 200 MB per file and output up to 1080 lines. A free account raises that to 5 projects, 30 exports a day, 1 GB files and 1440 lines; Premium gives unlimited projects, 300 exports a day, 5 GB files and 2160-line output; Pro raises exports to 700 a day. Exports have their own daily counter and do not consume the general operations allowance. These are the defaults; the pricing page shows the live numbers.',
      },
      {
        question: 'What can I export?',
        answer:
          'MP4 with H.264 or HEVC video and AAC audio, or MP3 or WAV for audio-only projects. Video can go out at the canvas size or scaled to 720, 1080, 1440 or 2160 lines, with captions burned in, as an SRT or VTT sidecar, or omitted, and with a streaming, podcast or broadcast loudness preset on the mix.',
      },
      {
        question: 'Which quality preset should I pick?',
        answer:
          'Medium is CRF 23 on libx264 or constant quality 23 on NVENC and is the sensible default for upload to a platform that re-encodes anyway. High (CRF 18 or CQ 19, preset slow or p5) is for a master you will edit again or show on a large screen. Low (CRF 28 or CQ 28, veryfast or p4) is for a quick preview to send to a colleague.',
      },
      {
        question: 'Why did my HEVC export fail?',
        answer:
          'HEVC needs either hevc_nvenc on the render GPU or libx265 in the ffmpeg build. If the server has neither the export fails with an unsupported-encoder message instead of returning an H.264 file labelled HEVC. Switch the format to H.264 and the same timeline will render.',
      },
      {
        question: 'How are captions made?',
        answer:
          'Generate captions sends the timeline audio to Whisper on our GPU server. The segments come back as cues you can edit in the captions lane, then export burned into the picture (an ASS subtitle track rendered into the frames) or as an SRT or VTT file next to the video. Generating captions counts as one AI job, from the AI allowance.',
      },
      {
        question: 'Does the export match the preview?',
        answer:
          'That is the point of the design. The preview composites in WebGL2 in the same order the server filter graph uses (crop, fit, transform, grade, LUT, key, opacity, blend), and a golden-image harness compares frames from both within a documented tolerance. Solo and hide apply to the export exactly as they do to the preview.',
      },
      {
        question: 'Can I come back to a project later?',
        answer:
          'Yes. Projects are saved with revision numbers, so a stale tab cannot overwrite newer work, and version history keeps checkpoints you can return to. A draft is also kept in your browser for crash recovery. Signed-in users can open recent projects from any device; guest projects stay with the browser session and the 24-hour retention window.',
      },
    ],
    related: [
      {
        label: 'Compress video',
        to: '/tools/compress-video',
        description: 'Shrink an export further for email or a slow connection.',
      },
      {
        label: 'Transcribe video',
        to: '/tools/transcribe-video',
        description: 'Get a full transcript of a finished edit, not just captions.',
      },
      {
        label: 'Extract audio from video',
        to: '/tools/extract-audio-from-video',
        description: 'Pull the soundtrack out of a clip before you bring it into the timeline.',
      },
      {
        label: 'Video trimmer',
        to: '/tools/video-trimmer',
        description: 'When a single cut is all you need.',
      },
      {
        label: `${MOTION_BRAND}`,
        to: '/tools/motion',
        description: 'Animate a logo or lower third as SVG, then export a GIF for the timeline.',
      },
      {
        label: 'Darkroom tutorial',
        to: '/tutorials/content-studio',
        description: 'Build an edit from empty project to exported MP4, step by step.',
      },
    ],
    lastReviewed: '2026-10-29',
    workedExamples: [
      {
        title: 'A 90-second 1080p30 cut at the Medium preset',
        body:
          'Two 1080p clips, a music track and a title card on a 1920 x 1080 canvas at 30 fps, exported as H.264 at Medium. On the render server with a working NVENC this is h264_nvenc preset p4 at constant quality 23 with yuv420p; without it, libx264 preset medium CRF 23. The audio mix is encoded as AAC at 192 kb/s, which for 90 seconds is 192,000 x 90 / 8, about 2.2 MB of audio regardless of content. The video side is quality-targeted rather than bitrate-targeted, so its size follows the footage: static talking-head material at CQ 23 encodes small, handheld motion encodes large. The render time scales with timeline length and the number of clips visible at once, because every frame of every visible clip is decoded and composited before the encoder sees it.',
      },
      {
        title: 'A 20-minute podcast exported as MP3 and as WAV',
        body:
          'An audio-only project (two voice tracks, an intro sting, podcast loudness preset) skips the video graph entirely. Exported as MP3 the file is libmp3lame at a constant 192 kb/s: 192,000 x 1,200 / 8 = 28.8 MB, so about 29 MB. Exported as WAV it is 16-bit PCM at the graph\'s 48 kHz stereo: 48,000 x 2 channels x 2 bytes = 192,000 bytes a second, 230 MB for 20 minutes. The loudnorm stage targets -16 LUFS integrated with a -1.5 dBTP ceiling and 11 LU of loudness range. With no frames to composite the job is bounded by decoding the sources and the audio filters, so it finishes well inside the length of the episode.',
      },
    ],
    whenNotToUse:
      'Darkroom is the wrong tool for a one-step job. If you only need to cut the start and end off a clip, change its format or shrink it, the single-purpose video trimmer and compressor pages do that with one upload and no project. It is also not a place for footage you cannot upload: every source is sent to our server for proxies and rendering, so material that must never leave your machine belongs in a desktop editor. Projects on a guest session are limited to one and last 24 hours; sign in before starting anything you want to return to next week.',
    primaryKeyword: 'online video editor',
    secondaryKeywords: [
      'multi-track video editor',
      'free video editor',
      'browser video editor',
      'timeline video editor',
      'edit video online',
      'mix audio and video',
      'export mp4',
      'online video timeline',
    ],
    supportedFormats: {
      supportedInputFormats: [
        'MP4', 'MOV', 'WebM', 'MKV', 'JPG', 'PNG', 'WebP', 'MP3', 'WAV', 'AAC',
      ],
      supportedOutputFormats: ['MP4 (H.264 / AAC)'],
      maxFileNotes: [
        `Source and exported files are processed on our servers. ${RETENTION_PROMISE}.`,
      ],
      processingNotes: [
        'Preview composites in the browser; the final export is encoded to H.264 MP4.',
      ],
    },
  },

  // ----------------------------------------------------------------------- MOTION (SVG ANIMATION)
  // MM48. Brand from MOTION_BRAND (design §1); the editor itself is the chromeless
  // /motion/[projectId] route, so this entry renders a custom panel (Open + recent
  // projects) and a format table served by /api/tiers. List only shipped features.
  {
    slug: 'motion',
    name: MOTION_BRAND,
    h1: MOTION_BRAND,
    tagline:
      'Draw or import an SVG, animate it on a keyframe timeline, and export animated SVG, Lottie, React, JavaScript, Flutter or GIF, all in your browser.',
    metaTitle: `${MOTION_BRAND}: Free Online SVG Animation Editor | Media Manipulator`,
    metaDescription:
      'Animate SVG in your browser: keyframes, easing, holds, draw-on, motion paths and morphs. Export animated SVG, Lottie JSON, React, JS, Flutter or GIF.',
    ogTitle: `${MOTION_BRAND}: Animate SVG in Your Browser`,
    ogDescription:
      'Import an SVG or draw one, animate it on a keyframe timeline, and export animated SVG, Lottie JSON, React, JavaScript, Flutter or GIF. Exports are made in your browser.',
    category: 'motion',
    embed: {
      defaultMediaKind: 'image',
      defaultTask: 'motion_editor',
      title: `Open ${MOTION_BRAND}`,
      description:
        'Start a new drawing or reopen a recent one. The editor opens full screen; your work is kept in this browser, and signed-in users can save it to their account.',
    },
    intro:
      `${MOTION_BRAND} is an SVG editor with an animation timeline, built into Media Manipulator. Open an SVG file (or a Lottie animation) and every shape becomes a layer you can select, move, recolour and animate, or start from a blank canvas and draw with the rectangle, ellipse, line, pen and text tools. Each animated property gets its own track of keyframes, with easing presets, a curve editor for custom easing, and hold keys for instant jumps. One-click animators add stroke draw-on, motion along a path, shape morphing, gradient colour changes, mask animation and blur. When it moves the way you want, export it as an animated SVG, a Lottie file, a React component, a JavaScript or TypeScript module, a Flutter widget or a GIF. Editing and every export run in your browser, so your artwork is never uploaded to export it; the server is only asked to count the export against your daily allowance.`,
    whatItDoes: [
      'Imports SVG files into an editable layer tree (groups, paths, shapes, text, images, gradients, masks and clip paths) and imports Lottie JSON animations with their keyframes, each file up to 4 MB.',
      'Draws new artwork with rectangle, ellipse, line, pen (Bézier) and text tools, and edits path nodes directly on the canvas.',
      'Animates position, scale, rotation, skew, opacity, fill, stroke and stroke width on a keyframe timeline with linear, ease-in, ease-out, ease-in-out, custom cubic-bezier and hold easing.',
      'Adds six one-click animators: stroke draw-on, motion along a path with optional auto-rotate, shape morphing, gradient stop colours, mask and clip-path animation, and blur.',
      'Exports a static SVG (always free and never counted), an animated SVG that plays without any library, Lottie JSON, a React component, a JavaScript or TypeScript module, a Flutter widget and an animated GIF, all generated on your machine.',
    ],
    flowSteps: [
      {
        title: 'Open or draw',
        description: 'Import an SVG or Lottie file, or draw shapes and paths on a blank canvas.',
      },
      {
        title: 'Animate',
        description: 'Move the playhead and change a property: the timeline records a keyframe for it.',
      },
      {
        title: 'Shape the timing',
        description: 'Pick an easing preset, draw a custom curve, add holds, or apply a one-click animator.',
      },
      {
        title: 'Export',
        description: 'Choose a format; the server counts one export, then your browser builds and downloads the file.',
      },
    ],
    advancedDetails: [
      'The animated SVG export uses pure CSS keyframes whenever every effect can be expressed in CSS in Chrome, Firefox and Safari. Shape morphs, moving gradient stops and blur need a script, so those files embed a trimmed copy of anime.js (MIT licence, about 31 KB of script, roughly 13 KB after gzip) with its licence notice at the top.',
      'Shape morphing normalises both shapes to the same number of curve segments and lines up their start points and winding, so the morph does not twist. Two shapes that cannot be matched hold instead of morphing.',
      'The Lottie writer targets the Lottie 1.0.1 specification and the LottieFiles "Basic" feature set. Anything Lottie cannot carry (such as filters, text or advanced masks) is listed after the download; nothing is dropped silently. The reader uses the same list in the other direction.',
      'GIF export renders frames one at a time, transfers each to a Worker, and encodes with an encoder written for Media Manipulator: one global palette sampled from five frames spread across the span, dithering off by default (flat vector art has few colours and dither adds noise), a frame delay of round(100 / fps) centiseconds, and transparency kept only when the canvas background is transparent. Output is capped at 2 GB and the dialog shows a size estimate before you start.',
      'Imported SVGs are cleaned on the way in: scripts, event handlers, external references and other unsafe content are removed, and the editor rebuilds unsupported markup from an allow-list instead of inserting it as HTML. Markup it cannot model is kept as an opaque layer that round-trips unchanged.',
      'The export counter is a single database transaction: the format lock and the caps are checked, then the counter and an export row are written together. A refused export writes nothing and costs nothing; an export the browser then cancels or fails has already been counted.',
    ],
    whyItMatters: [
      'Animated SVGs stay sharp at every size and are usually far smaller than a video or GIF of the same animation, which makes them ideal for logos, icons, loaders and illustrations on the web.',
      'Developers need animation as code, not just as a video: a React component, a JavaScript module, a Lottie file or a Flutter widget drops straight into an app.',
      'Doing the export in the browser means your artwork stays on your device; only the format, size, length and time of each export are sent to us, to enforce the daily allowance.',
    ],
    useCases: [
      {
        title: 'Logo and icon animation',
        description: 'Draw a logo on with a stroke animation, or make an icon bounce, spin or change colour on hover.',
      },
      {
        title: 'Loaders and UI micro-animations',
        description: 'Build spinners and progress animations and export them as CSS-only SVG or a React component.',
      },
      {
        title: 'Lottie for mobile apps',
        description: 'Export Lottie JSON for the iOS, Android, web and Flutter Lottie players, or edit an existing Lottie file.',
      },
      {
        title: 'Animated illustrations',
        description: 'Move parts of an illustration along paths, morph shapes into each other and export a GIF for chat or email.',
      },
    ],
    whyMediaManipulator: [
      'A real layer-and-keyframe editor with holds, custom curves and six animators, not a template gallery.',
      'Exports for designers and developers alike: animated SVG, Lottie, React, JavaScript or TypeScript, Flutter and GIF from one project.',
      'Exports are made in your browser, and the only third-party code an export uses is permissively licensed (anime.js under MIT; flutter_svg and webview_flutter for Flutter), with its licence notice kept in the file.',
    ],
    privacyNote:
      'Editing and exporting happen in your browser; your artwork is not uploaded to export it. Without an account, projects are kept only in this browser. If you sign in and save a project to your account, the sanitised document (up to 4 MB) and a thumbnail are stored on our servers like a Darkroom project, follow the retention period you choose, and can be deleted from your Account page. For each counted export we record only its format, height, frame rate, length and time, with your account or session as the owner, to enforce the daily allowance; the export row never contains the artwork.',
    faq: [
      {
        question: `Is ${MOTION_BRAND} free?`,
        answer:
          `Yes. Opening ${MOTION_BRAND}, drawing, animating, saving in this browser and exporting a static SVG are free, unlimited and need no account. Animated exports count toward a daily allowance that depends on your plan: by default 2 a day without an account (animated SVG only), 5 with a free account, 30 with Premium and 150 with Pro. The plan table on this page shows each plan's live allowance and formats.`,
      },
      {
        question: 'Which formats can I export?',
        answer:
          'Static SVG, animated SVG (CSS, or a small inline script when needed), Lottie JSON, a React component (.tsx), a JavaScript or TypeScript module, a Flutter widget (.dart) and an animated GIF. By default animated SVG is on every plan, Lottie from the free account up, and React, JS/TS, Flutter and GIF from Premium up. Which of these your plan includes, and the daily number of exports, are shown in the plan table on this page.',
      },
      {
        question: 'What are the limits?',
        answer:
          'Animated exports are counted per day and reset at midnight UTC; a refused export is not counted, but an export you cancel after the count has been taken is. Visitors without an account save projects only in their browser and can export animations up to 10 seconds long; a free account saves 3 projects to the account, Premium 25, Pro without limit. SVG and Lottie imports are capped at 4 MB each, GIF export at 50 fps and 2 GB of output. Every current number is in the plan table on this page and on the pricing page.',
      },
      {
        question: 'Can I animate an SVG I already have?',
        answer:
          'Yes. Import any SVG and its groups, paths, shapes, text, gradients, masks and clip paths become editable layers. Parts the editor cannot edit, such as patterns or complex filters, are kept and exported unchanged, and anything unsafe (scripts, event handlers or external links) is removed and listed after the import.',
      },
      {
        question: 'Does it support Lottie?',
        answer:
          'Yes, in both directions. You can import a Lottie JSON file to edit it (the import counts as one unit on the free plan and up), and export your animation as Lottie JSON for lottie-web and the iOS, Android and Flutter Lottie players. Features one side cannot represent are listed in the dialog instead of being dropped silently.',
      },
      {
        question: 'Which browsers support video export?',
        answer:
          'GIF export works in all modern browsers. MP4 and WebM export rely on WebCodecs, the browser\'s built-in video encoder, which is available in Chrome and Edge and in recent versions of Safari and Firefox depending on the codec; the export dialog checks your browser and says when it cannot encode. The plan table on this page shows which plan includes each video format.',
      },
      {
        question: 'What licence applies to the exported code?',
        answer:
          'Your animation belongs to you. When an animated SVG or a code export needs a runtime, it uses anime.js, which is MIT-licensed; its copyright notice is written at the top of the file and must be kept there. Flutter exports use the flutter_svg (MIT) or webview_flutter (BSD-3-Clause) package. Everything else in the file is generated from your project. The open-source libraries the editor uses are listed on our licences page.',
      },
      {
        question: 'Where are my projects stored?',
        answer:
          'Without an account, projects are kept only in this browser, so clearing your browser data removes them. When you are signed in you can save a project to your account; it then syncs between devices, autosaves while you work, follows the retention period you chose and can be deleted from your Account page.',
      },
    ],
    related: [
      {
        label: `${MOTION_BRAND} tutorial`,
        to: '/tutorials/motion',
        description: 'Import an SVG, animate it, shape the easing and export it, step by step.',
      },
      {
        label: 'Darkroom',
        to: '/tools/content-studio',
        description: 'Edit video on a multi-track timeline and export MP4.',
      },
      {
        label: 'Convert video to animated GIF',
        to: '/tools/convert-video-to-animated-gif',
        description: 'Turn a video clip into a GIF when your animation started as footage.',
      },
      {
        label: 'Open-source licences',
        to: '/licenses',
        description: 'The libraries the editor runs and writes into your exports.',
      },
    ],
    lastReviewed: '2026-10-29',
    workedExamples: [
      {
        title: 'A 2-second logo draw-on as animated SVG',
        body:
          'A wordmark of a few paths with the Draw on animator across 2,000 ms, exported as animated SVG. Draw-on is a stroke-dasharray and stroke-dashoffset animation, which CSS can express in every major browser, so the exporter writes a <style> block of @keyframes and no script at all. The file is your SVG plus a few hundred bytes of CSS, it plays the moment it is in the page, and it counts as one svg_animated export: without an account that is one of 2 a day and within the 10-second length cap for visitors; with a free account one of 5. The export is a string transform in your browser and completes at once.',
      },
      {
        title: 'A 400 x 400 morph loop as a GIF',
        body:
          'A 2-second shape morph on a 400 x 400 canvas exported as GIF at 25 fps on a Premium plan (GIF is a Premium format by default). The dialog clamps to the plan\'s height and frame-rate presets, 25 fps giving a delay of round(100 / 25) = 4 centiseconds per frame and 50 frames in all. Its size estimate is pixels x frames x 0.25 bytes + 1 KB: 160,000 x 50 x 0.25 is about 2 MB, deliberately on the high side, and flat two-colour art usually lands well under it. Frames render on the main thread and encode in a Worker one at a time, so memory stays at a couple of frames plus the growing file; the time is spent rasterising 50 frames of SVG, a few seconds on a laptop.',
      },
    ],
    whenNotToUse:
      `${MOTION_BRAND} animates vector artwork; it does not edit video or photographs. If your starting point is footage, Darkroom is the editor and the video-to-GIF page turns a clip into a GIF. It is also not a vectoriser for complex raster images: a photograph traced to paths will be heavy and the result will not animate meaningfully. Animations that depend on filters, text effects or advanced masks will not survive a Lottie export intact (the dialog lists what was dropped), so for those targets keep to the animated SVG, React or JavaScript exports. And MP4 or WebM output depends on your browser's WebCodecs support and on your plan, so check the plan table before planning a video deliverable.`,
    primaryKeyword: 'svg animation editor',
    secondaryKeywords: [
      'animate svg online',
      'svg animator',
      'animated svg maker',
      'svg to lottie',
      'lottie editor',
      'svg animation to react',
      'css svg animation generator',
      'svg to gif',
      'logo animation',
    ],
    supportedFormats: {
      supportedInputFormats: ['SVG', 'Lottie JSON', `${MOTION_BRAND} project (.json)`],
      supportedOutputFormats: [
        'Static SVG',
        'Animated SVG',
        'Lottie JSON',
        'React (.tsx)',
        'JavaScript / TypeScript',
        'Flutter (.dart)',
        'GIF',
      ],
      maxFileNotes: [
        'SVG and Lottie imports up to 4 MB each.',
        'Projects without an account live only in this browser; signed-in projects follow the retention period you choose.',
      ],
      processingNotes: [
        'Editing, preview and every export run in your browser. Only a count of each export is sent to our servers.',
      ],
    },
    featureList: [
      'SVG import into editable layers',
      'Lottie JSON import',
      'Rectangle, ellipse, line, pen and text tools',
      'Keyframe timeline with easing presets, custom cubic-bezier curves and hold keys',
      'Stroke draw-on, motion path, shape morph, gradient, mask and blur animators',
      'Static SVG export',
      'Animated SVG export (CSS or inline anime.js runtime)',
      'Lottie JSON export',
      'React, JavaScript, TypeScript and Flutter code export',
      'Animated GIF export',
      'Projects saved in the browser or to your account',
    ],
  },

  // ----------------------------------------------------------------------- METADATA / PRIVACY
  {
    slug: 'remove-exif-metadata',
    lastReviewed: '2026-10-29',
    name: 'Remove EXIF Metadata from Images',
    h1: 'Remove EXIF Metadata from Images Online',
    tagline:
      'Strip GPS location, device, camera, and timestamp data from photos before you share them anywhere.',
    metaTitle:
      'Remove EXIF Metadata from Images Online (Free) | Media Manipulator',
    metaDescription:
      `Free online tool to remove EXIF, GPS, IPTC, and camera metadata from JPG, PNG, WebP, and HEIC images. No signup. ${RETENTION_PROMISE}.`,
    ogTitle: 'Remove EXIF Metadata from Images Online',
    ogDescription:
      'Strip GPS location, camera, and timestamp metadata from images before sharing them publicly.',
    category: 'metadata',
    embed: {
      defaultMediaKind: 'image',
      defaultTask: 'remove_metadata',
      preset: { kind: 'metadata', mode: 'strip' },
      title: 'Remove metadata from an image',
      description:
        'Upload a JPG, PNG, WebP, or HEIC photo. We show every tag it carries, then press Strip everything to remove them all and see exactly what was removed.',
    },
    intro:
      'A photo carries a second document inside it. Alongside the pixels, a phone or camera writes the make and model of the device, often its serial number, the lens, the exposure, the exact second the shutter fired, the software that last saved the file, a small preview thumbnail, and, when location services were on, the latitude, longitude and altitude of the spot you were standing on. This tool reads all of that out of a JPG, PNG, WebP or HEIC, shows you every tag grouped by what it reveals, and then removes the lot with a single pass of ExifTool so the copy you share carries only the picture.',
    whatItDoes: [
      'Inspects the upload with ExifTool and lists every tag it finds, grouped into categories (camera, lens, GPS, date and time, XMP, IPTC, thumbnail, colour, maker notes and more) with location, identity, device and history tags flagged.',
      'Removes the EXIF blocks (IFD0 and ExifIFD: make, model, body serial number, lens model, exposure, ISO, focal length, capture and modification dates) and the GPS IFD (latitude, longitude, altitude, their reference tags, GPS timestamps).',
      'Removes the IFD1 embedded preview thumbnail, which is a separate small copy of the image that survives cropping in many editors.',
      'Removes XMP packets (creator tool, edit history, keywords, ratings), IPTC records (author, copyright, caption), Photoshop resource blocks, vendor maker notes and the ICC colour profile.',
      'Applies the EXIF orientation to the pixels first, so a phone photo that relied on the rotation tag does not come out sideways once the tag is gone.',
      'Counts what was removed by comparing the before and after reports and shows the number, with a note when location tags were among them.',
    ],
    flowSteps: [
      {
        title: 'Upload the photo',
        description: 'Drop in a JPG, PNG, WebP or HEIC. The server runs ExifTool twice (a readable pass and a numeric pass for GPS and exposure values) and returns the report.',
      },
      {
        title: 'Read the report',
        description: 'Tags are grouped by category; GPS coordinates are plotted on a locator so you can see exactly what the file gives away.',
      },
      {
        title: 'Strip everything',
        description: 'One click re-saves the image with ImageMagick and runs exiftool -all= over the result.',
      },
      {
        title: 'Compare and download',
        description: 'The result screen reports how many tags went, offers a side-by-side diff of the two reports, and gives you the clean file.',
      },
    ],
    advancedDetails: [
      'The pixel pass is ImageMagick: convert <input> -auto-orient -quality 85 <output>, with the output container matching the input for JPG, PNG, WebP, GIF and AVIF. HEIC, TIFF and BMP have no same-container path on this page and come back as JPG.',
      'The metadata pass is exiftool -overwrite_original -all= on the converted file. -all= removes every writable group in one go: EXIF (IFD0, ExifIFD, GPS, InteropIFD), the IFD1 thumbnail, XMP, IPTC, Photoshop IRB, ICC_Profile, maker notes and any APP segments ExifTool knows how to write. The JFIF and Adobe APP14 segments a JPEG decoder needs are left in place; they describe pixel layout, not you.',
      'Because the image is re-encoded, a JPG is written again at quality 85 and a PNG is written again losslessly. The strip is not a byte-for-byte copy with the metadata cut out.',
      'The before and after reports are the same MetadataDocument the inspector builds: group-keyed entries such as GPS:GPSLatitude or XMP-xmpMM:History, each classified by a catalogue of about 1,800 tags into 22 categories and four privacy classes (location, identity, device, history).',
      'The removed count excludes rows that change on every conversion (file name, size, modification date, MIME type, image size), so it reflects metadata that was actually dropped rather than bookkeeping.',
      'Video and audio containers can be stripped too, from the video and audio converters: ffmpeg is run with -map_metadata -1 -map_chapters -1, and for MP4, MOV, M4A and M4V an exiftool -all= pass follows because ffmpeg leaves QuickTime keys and XMP behind.',
    ],
    whyItMatters: [
      'GPS tags resolve to a street address. A photo of a sofa for sale, posted from home, can tell a stranger where the sofa is.',
      'Device and serial-number tags link photos to each other and to you. Two images with the same BodySerialNumber were taken with the same camera, whatever account posted them.',
      'The IFD1 thumbnail is a copy of the original frame. Crop a face or a document out of the picture and the preview may still show it.',
      'Many sites strip EXIF on upload and many do not. Messaging apps, email attachments, cloud shares and marketplaces frequently pass the file through untouched.',
    ],
    useCases: [
      {
        title: 'Marketplace and classified listings',
        description: 'Remove the location and capture time from product photos taken at home before buyers see them.',
      },
      {
        title: 'Photos of documents',
        description: 'A snapshot of a form or a letter also records when and where it was photographed; strip that before sending it on.',
      },
      {
        title: 'Publishing from a sensitive location',
        description: 'Drop device identifiers and coordinates from an image before it leaves your control, and verify with the diff that they are gone.',
      },
      {
        title: 'Cleaning an edited image',
        description: 'Editors append XMP history and keep the original thumbnail; remove both so the file only shows what you intended.',
      },
    ],
    whyMediaManipulator: [
      'You see the evidence. The inspector lists every tag before you strip and a diff proves what went after, rather than a green tick and a promise.',
      'One pass, every group. ExifTool -all= removes EXIF, GPS, XMP, IPTC, Photoshop, ICC, maker notes and the preview thumbnail together; nothing has to be ticked one block at a time.',
      'Orientation is handled. The rotation tag is applied to the pixels before it is removed, which is the usual way a stripped phone photo ends up on its side elsewhere.',
    ],
    privacyNote:
      `This tool removes, from the copy it returns, the EXIF blocks (camera make, model, serial number, lens, exposure, dates), the GPS block, the IFD1 preview thumbnail, XMP and IPTC records, Photoshop resources, maker notes and the ICC profile. To do that the server has to read them first: the upload is inspected with ExifTool and the report is written to the job folder as metadata.json, and after the strip a second report of the result is kept beside it so the Compare view can show the difference. Both reports and both files live in uploads/<jobId>/ and outputs/<jobId>/ and are deleted together when the retention window ends. ${RETENTION_PROMISE}. The stand-alone inspector (reading a file without converting it) removes its temporary copy as soon as the report is produced. Images also pass through an automated analysis step on our own server; nothing is sent to a third party.`,
    faq: [
      {
        question: 'Exactly which metadata groups are removed?',
        answer:
          'Everything ExifTool can write: EXIF (IFD0, ExifIFD, InteropIFD), the GPS IFD, the IFD1 thumbnail, XMP in all its namespaces (xmp, dc, xmpMM, photoshop, and so on), IPTC IIM records, Photoshop resource blocks, maker notes from Apple, Canon, Nikon, Sony and other vendors, and the ICC colour profile. For PNG that includes the tEXt, iTXt, zTXt, eXIf and iCCP chunks; for WebP the EXIF, XMP and ICCP chunks.',
      },
      {
        question: 'Does the image get re-encoded?',
        answer:
          'Yes. The file goes through ImageMagick (which also applies the orientation tag to the pixels) before ExifTool removes the tags. A JPG is rewritten at quality 85, a PNG is rewritten losslessly, a WebP at quality 85. Visually the JPG re-encode is hard to tell from the original at normal viewing sizes, but it is not the identical bitstream.',
      },
      {
        question: 'Why did my HEIC come back as a JPG?',
        answer:
          'The one-click strip keeps the container for JPG, PNG, WebP, GIF and AVIF. HEIC, TIFF and BMP are decoded and written as JPG so the result opens everywhere. If you need a HEIC back, convert it in the image converter with metadata set to Strip.',
      },
      {
        question: 'Will the colour profile be removed, and does that matter?',
        answer:
          'Yes, exiftool -all= removes the ICC profile. For a standard sRGB photo nothing changes, because viewers assume sRGB when no profile is present. For a wide-gamut Display P3 photo from a recent phone, colours may look slightly less saturated in software that honours profiles. If that matters to you, use the image converter\'s Custom metadata mode and keep the profile there.',
      },
      {
        question: 'Can I keep a copyright line or a title?',
        answer:
          'Not with the one-click strip, which removes everything. The image converter\'s metadata section has a Custom mode that strips the file and then writes back only what you type: title, author, description, copyright, comment, keywords and chosen EXIF or GPS fields. Use that when you want a clean file that still names you.',
      },
      {
        question: 'How do I know it worked?',
        answer:
          'The result screen gives the number of tags removed and flags when location data was among them. Open Compare for the full before and after: it is the same ExifTool report run on the output file, so a GPS or serial-number row that survived would show up there.',
      },
      {
        question: 'Is it free, and how many photos can I strip?',
        answer:
          'Yes. Each strip is one upload through the standard converter, so it counts against the daily operations allowance: by default 5 a day without an account and up to 200 MB per file, 30 a day with a free account and files up to 1 GB, 300 with Premium and 700 with Pro. A job that fails gives its unit back. The live numbers are on the pricing page.',
      },
    ],
    related: [
      {
        label: 'Blur faces in a photo',
        to: '/tools/blur-faces-in-photo',
        description: 'Metadata is only half the story; hide the faces the picture itself shows.',
      },
      {
        label: 'Redact text in an image',
        to: '/tools/redact-text-in-image',
        description: 'Black out names, addresses and numbers printed in the picture.',
      },
      {
        label: 'Compress image',
        to: '/tools/compress-image',
        description: 'Shrink the cleaned photo before posting it.',
      },
      {
        label: 'Image to PDF',
        to: '/tools/image-to-pdf',
        description: 'Bundle stripped photos of documents into one PDF.',
      },
      {
        label: 'Privacy policy',
        to: '/privacy-policy',
        description: 'How uploads, reports and results are stored and deleted.',
      },
    ],
    workedExamples: [
      {
        title: 'A 12-megapixel iPhone JPEG with GPS',
        body:
          'A 4032 x 3024 JPEG straight from an iPhone 15 Pro carries, in a typical case, 5 IFD0 tags (make, model, orientation, software, modify date), 7 ExifIFD tags including the body serial number and lens model, 5 GPS tags, 4 XMP entries including edit history, 2 ICC profile entries, the 3 IFD1 thumbnail entries (about 5 KB of preview JPEG) and a derived GPSPosition. The result screen reports 27 tags removed, including location: those 27 are every entry except the file name, size, date and type rows and the image size, which exist on any file. The output is a JPG re-encoded at quality 85 with the orientation baked into the pixels; the re-encode decides the final size. The job is a single ImageMagick decode and encode plus one ExifTool rewrite, so it finishes in a few seconds and the time is spent on the pixels, not the tags.',
      },
      {
        title: 'A HEIC from a recent phone',
        body:
          'HEIC has no same-container path on this page, so a 12-megapixel HEIC is decoded by ImageMagick and written as a JPG at quality 85, then stripped with exiftool -all=. You lose the HEIC container and its colour profile and gain a file every browser and marketplace accepts. Expect a larger file than the HEIC you uploaded, because the JPEG re-encode at quality 85 is the only compression applied and it decides the size. The report lists the Apple maker notes and GPS block before, and nothing but file and image-size rows after. The HEIC decode is the slow part; it is still a matter of seconds for one photo.',
      },
    ],
    whenNotToUse:
      'Do not strip a photo you still need to edit or prove the provenance of. Camera RAW files are not accepted here and should not be stripped with -all= anyway, because their maker notes hold data the RAW converter needs. If you want to keep a copyright notice or a title while dropping GPS and device tags, use the image converter\'s Custom metadata mode instead, which strips everything and writes back only the fields you fill in. And remember that removing metadata does not remove what is visible in the picture: a street sign, a reflection or a face still says where you were; the face blur and text redaction tools handle those.',
    primaryKeyword: 'remove EXIF metadata',
    secondaryKeywords: [
      'strip GPS from photo',
      'remove image metadata',
      'photo metadata remover',
      'remove EXIF online',
      'IPTC remover',
    ],
  },

  // ----------------------------------------------------------------------- VIDEO
  {
    slug: 'compress-video',
    lastReviewed: '2026-10-29',
    name: 'Compress Video',
    h1: 'Compress Video Online Without Ruining Quality',
    tagline:
      'Shrink MP4, WebM, MOV, MKV, and AVI files for the web, email, social, and cloud uploads.',
    metaTitle: 'Compress Video Online (Free) | Media Manipulator',
    metaDescription:
      `Free online video compressor. Reduce MP4, WebM, MOV, MKV, and AVI file size while keeping good quality. No signup. ${RETENTION_PROMISE}.`,
    ogTitle: 'Compress Video Online Without Ruining Quality',
    ogDescription:
      'Shrink MP4, WebM, MOV, and AVI video files for the web without losing watchable quality.',
    category: 'video',
    embed: {
      defaultMediaKind: 'video',
      defaultTask: 'compress_video',
      preset: { kind: 'video', panel: 'video_compressor' },
      title: 'Compress a video',
      description:
        'Upload a video and pick a smaller quality preset or lower bitrate. Keep the same codec for the fastest result, or switch to WebM/H.265 for smaller files on modern devices. Keeping the same resolution gives the most natural-looking result.',
    },
    intro:
      'A video file is large because of its bitrate: how many bits the encoder spent per second of footage. Phones and screen recorders spend generously, which is why a short 1080p clip can run to tens or hundreds of megabytes. This page opens a three-control compressor instead of the full converter: a compression level, an output container, and an optional resolution and codec. On our server the job is one FFmpeg command that re-encodes the picture at a constant-quality setting (CRF) chosen by the level, re-encodes the audio to AAC or Opus, and writes the result with the index at the front of the file so it starts playing before it has fully downloaded.',
    whatItDoes: [
      'Re-encodes the video at a fixed quality level rather than a fixed bitrate: Smallest file is CRF 31, Balanced is CRF 26 and High quality is CRF 22.',
      'Outputs MP4 (H.264 by default, or H.265/HEVC when you pick it) or WebM (VP9 with Opus audio).',
      'Optionally scales the picture down to 1080p, 720p or 480p in the same pass while keeping the aspect ratio.',
      'Optionally drops the audio track entirely for the smallest possible file.',
      'Accepts MP4, MOV, M4V, WebM, MKV, AVI, FLV, WMV, MPEG and MPG uploads; the full converter page handles ProRes and other editing formats.',
    ],
    flowSteps: [
      { title: 'Upload the video', description: 'The browser puts the file straight into our storage bucket, then asks the API to start the job.' },
      { title: 'Choose a level', description: 'Balanced is preselected. Smallest file trades visible detail for size; High quality keeps more of it.' },
      { title: 'Optionally change format, resolution or codec', description: 'MP4 with H.264 plays everywhere; H.265 and WebM are smaller on devices that decode them.' },
      { title: 'FFmpeg re-encodes', description: 'libx264, libx265 or libvpx-vp9 with the CRF for your level, plus AAC or Opus audio and faststart for MP4.' },
      { title: 'Download the smaller file', description: 'The result stays in the job folder until its retention window ends.' },
    ],
    advancedDetails: [
      'The exact command for MP4 is ffmpeg -i input [-vf scale=-1:H] -c:v libx264 -crf N -pix_fmt yuv420p -movflags +faststart -c:a aac output.mp4, where N is 31, 26 or 22 for the three levels (buildVideoCodecArgs and videoCRF in converter.go). No encoder speed preset is passed, so libx264 runs at its default, medium.',
      'Picking H.265 swaps the encoder for libx265 and adds -tag:v hvc1, the tag QuickTime and Safari need to recognise HEVC inside MP4. Older Android phones, smart TVs and many web players cannot decode H.265 at all.',
      'WebM output runs libvpx-vp9 with -b:v 0 -crf N and Opus audio; if the server FFmpeg build lacked VP9 or Opus it would fall back to VP8 and Vorbis. The same N is passed, but VP9 reads CRF on a 0 to 63 scale, so 26 is a relatively high quality setting there.',
      'A resolution choice becomes scale=-1:1080, scale=-1:720 or scale=-1:480: height fixed, width computed from the source aspect ratio. The height is applied as given, so picking 1080p for a 720p source upscales it and makes the file larger, not smaller; pick a height at or below the source.',
      'Remove the audio track adds -an. Otherwise the audio is re-encoded by the FFmpeg native AAC encoder at its default bitrate (no -b:a is passed; for stereo that is typically about 128 kbps), which is a small fraction of the file at any level.',
      'Compression is CRF-driven, so the output size follows the content: static slides compress far harder than confetti or water. The server validates CRF to 0 to 51 and the compression level to one of the three names before any encoding starts.',
      'The upload is also queued for the automated content analysis that every standard conversion receives: frames are sampled and described by a local vision model, and audio is transcribed on our own hardware. The analysis result is stored with the job, not shared.',
    ],
    whyItMatters: [
      'Chat apps, mail servers and learning platforms enforce caps in megabytes, and a phone clip at its native bitrate blows through them.',
      'A page that autoplays a 60 MB background video stalls on mobile connections; the same clip at CRF 26 is a fraction of that.',
      'Storage and bandwidth bills scale with bytes, so keeping compressed copies of originals you rarely open adds up quickly.',
    ],
    useCases: [
      { title: 'Email and chat', description: 'Get a 1 minute phone recording under a 25 MB or 100 MB limit without a separate sharing link.' },
      { title: 'Website hero and background loops', description: 'Encode a WebM or H.264 MP4 that a page can autoplay without a long buffer.' },
      { title: 'Course and meeting recordings', description: 'Shrink screen recordings whose static slides compress extremely well at any CRF.' },
      { title: 'Archive copies', description: 'Keep a 720p Balanced copy of long originals and move the master to cold storage.' },
    ],
    whyMediaManipulator: [
      'The CRF behind each level is written on this page, so you can predict what Smallest file will do to detailed footage before you wait for it.',
      'H.265 in MP4 gets the hvc1 tag Apple players require, which many online compressors forget.',
      'Encoding runs on our own servers with FFmpeg; nothing is handed to an outside processing service, and no watermark is added.',
      `A compression counts as one operation of your daily allowance: 5 a day without an account by default, 30 with a free account. ${RETENTION_PROMISE}.`,
    ],
    privacyNote:
      `The compressor re-encodes your video on our own servers with FFmpeg. The upload is stored under uploads/<jobId>/ and the compressed file under outputs/<jobId>/; both are in the retention ledger and deleted when the window ends. ${RETENTION_PROMISE}. Because this is a standard conversion, the upload is also passed through our automated content analysis on the same hardware (sampled frames described by a local vision model, audio transcribed locally); that report is kept with the job and is not shared with third parties. Container metadata is kept unless you choose to strip it; nothing is sent to an outside AI or processing provider.`,
    faq: [
      {
        question: 'Will compressing make my video look worse?',
        answer:
          'Some detail is always lost in a re-encode. At High quality (CRF 22) and Balanced (CRF 26) the loss is mostly in fine grain and noise that most viewers do not notice; at Smallest file (CRF 31) you can see softening on detailed footage. Keeping the resolution avoids the blurring that downscaling adds.',
      },
      {
        question: 'Should I pick H.264, H.265 or WebM?',
        answer:
          'H.264 MP4 plays on everything, including old TVs and corporate laptops. H.265 gives a smaller file at the same CRF but needs a device that decodes HEVC; we tag it hvc1 so Apple players accept it. WebM (VP9 and Opus) is the choice for web pages where you control the player.',
      },
      {
        question: 'How much smaller will the file be?',
        answer:
          'It depends on the source bitrate and the content. A phone clip at 12 Mbps has a lot of headroom and shrinks dramatically at CRF 26; a file that was already encoded at a modest bitrate shrinks little, because CRF spends what the picture needs. Dropping to 720p and removing audio always help.',
      },
      {
        question: 'Does the compressor add a watermark or change the frame rate?',
        answer:
          'No. The frame rate, duration and aspect ratio are preserved, and nothing is drawn on the picture. Only the codec, the CRF, the optional height and the optional audio removal change.',
      },
      {
        question: 'Is compressing a video free, and what are the limits?',
        answer:
          'By default a guest gets 5 operations a day with files up to 200 MB and 5 minutes of video, output up to 1080p; a free account raises that to 30 a day, 1 GB and 20 minutes. A compression that fails is refunded. The current numbers are on the pricing page.',
      },
      {
        question: 'Why is the output not smaller than the original?',
        answer:
          'The source was probably already compressed efficiently, or it is at a low bitrate for its resolution. CRF cannot go below what the picture requires without a lower level. Try Smallest file, or drop the resolution, or switch to H.265.',
      },
      {
        question: 'Can I compress a video with no audio or keep the original audio untouched?',
        answer:
          'A silent source stays silent. Audio in a kept track is always re-encoded to AAC (MP4) or Opus (WebM) by this page; the full video converter is where you set an explicit audio bitrate.',
      },
    ],
    related: [
      { label: 'Trim video', to: '/tools/video-trimmer', description: 'Cut the clip first; the compressor then has less to encode.' },
      { label: 'Convert video to animated GIF', to: '/tools/convert-video-to-animated-gif', description: 'For clips of a few seconds, a GIF is the format that plays inline.' },
      { label: 'Transcode to HLS', to: '/tools/transcode-to-hls', description: 'Package a video as an adaptive stream instead of one file.' },
      { label: 'Extract audio from video', to: '/tools/extract-audio-from-video', description: 'Keep only the sound track as MP3, WAV or FLAC.' },
      { label: 'Transcribe video', to: '/tools/transcribe-video', description: 'Get the speech as text before or after compressing.' },
      { label: 'Video converter tutorial', to: '/tutorials/video/getting-started', description: 'Step-by-step walkthrough of every video option.' },
    ],
    workedExamples: [
      {
        title: 'A 48 MB, 30 second 1080p phone clip at Balanced',
        body:
          'Input: a 30 second MP4 from a phone, 1920 x 1080, 48 MB, which works out to about 12.8 Mbps. Settings: Balanced, MP4, H.264, resolution kept, audio kept. The server runs libx264 at CRF 26 with yuv420p and faststart, and re-encodes the audio to AAC at 128 kbps, so the sound track alone is about 0.5 MB of the result (128 kbps x 30 s). Everything else is decided by the picture: CRF 26 gives up fine grain and noise first, so a steady handheld shot comes out a small fraction of the 12.8 Mbps source, while fast action or heavy camera noise shrinks less. The encode is a single pass over 900 frames of 1080p with the default medium preset; on our server that is a short job, and the upload of 48 MB usually dominates the wait.',
      },
      {
        title: 'A 160 MB, 60 second 4K clip to 720p H.265 at Smallest file',
        body:
          'Input: a 60 second 3840 x 2160 MP4 of 160 MB, about 21 Mbps, within the 200 MB guest cap. Settings: Smallest file, MP4, codec H.265, resolution 720p, audio removed. FFmpeg applies scale=-1:720, which produces 1280 x 720: 0.92 megapixels per frame against 8.3 for the source, roughly a ninth of the pixels before the codec does anything. Then libx265 runs at CRF 31 with -tag:v hvc1 and -an drops the audio. The combination of nine times fewer pixels, a more efficient codec and a high CRF is where the largest reductions come from, so expect a result measured in a few megabytes rather than tens. Time is dominated by decoding 4K frames and by libx265, which is noticeably slower than libx264 at the same preset, so this job takes longer than the 1080p example even though the output is smaller.',
      },
    ],
    whenNotToUse:
      'Do not compress a file you still intend to edit or colour grade; every re-encode loses detail, and an editor wants the original or a ProRes intermediate from the full converter instead. Do not use it to make a clip play on a particular device if the problem is the container rather than the size; the video converter changes formats without lowering quality. If your only goal is to cut a section out, the trimmer copies the streams without re-encoding and is both faster and lossless. And if the file is large because it is long, compression helps less than you hope; a 20 minute recording at CRF 26 is still a 20 minute recording.',
    primaryKeyword: 'compress video online',
    secondaryKeywords: [
      'reduce video file size',
      'shrink MP4',
      'video compressor',
      'compress video for email',
      'compress video without quality loss',
    ],
  },
  {
    slug: 'transcode-to-hls',
    lastReviewed: '2026-10-29',
    name: 'Transcode Video to HLS',
    h1: 'Transcode Video to HLS Online',
    tagline:
      'Package any video into an Apple HLS VOD bundle: master.m3u8, per-rendition .ts segments, ready for the web.',
    metaTitle: 'Transcode Video to HLS Online | Free Adaptive Streaming Tool',
    metaDescription:
      'Free online HLS transcoder. Convert MP4, MOV, WebM, MKV into an HLS VOD package with 360p/480p/720p renditions, optional captions and storyboards.',
    ogTitle: 'Transcode Video to HLS Online',
    ogDescription:
      'Generate an adaptive HLS package (master.m3u8 + variant playlists + .ts segments) from any video — free, in your browser.',
    category: 'video',
    embed: {
      defaultMediaKind: 'video',
      defaultTask: 'transcode_to_hls',
      transcodeMode: true,
      transcodeProtocol: 'hls',
      transcodeLockProtocol: true,
      title: 'Transcode a video to HLS',
      description:
        'Upload an MP4/MOV/WebM/MKV. We ffprobe the source, let you pick free quality rungs (360p/480p/720p), then run H.264 + AAC ffmpeg encoding and bundle a downloadable tar.gz of the HLS package.',
    },
    intro:
      'HTTP Live Streaming serves a video as a playlist of short segments at several quality levels, so a player can start fast and switch rungs as the connection changes. Producing that package by hand means encoding each rendition with aligned keyframes, segmenting them, and writing a master playlist that describes every variant correctly. This page does the whole job: it probes your upload, offers the ladder rungs your source and plan allow, encodes each one with libx264 and AAC into 2 second MPEG-TS segments, optionally adds captions from our own Whisper transcriber, a storyboard sprite sheet and an I-frame playlist for scrubbing, and bundles everything as a tar.gz or zip you can unpack onto any static host.',
    whatItDoes: [
      'Probes the source with ffprobe and lists the ladder rungs: 144p, 240p, 360p, 480p, 720p, 1080p and 2160p, each enabled only if the source is tall enough and your plan allows it.',
      'Encodes each selected rung with libx264 High profile level 4.1 and AAC stereo at 48 kHz, into 2 second .ts segments with a keyframe on every segment boundary.',
      'Writes hls/master.m3u8 with BANDWIDTH, RESOLUTION, FRAME-RATE and CODECS for every variant, plus one index.m3u8 per rung.',
      'Optionally transcribes the audio with Whisper into a WebVTT track, translates it into up to 3 more languages with a local model, and links each as a subtitle rendition in the master.',
      'Optionally renders a storyboard sprite sheet with a WebVTT index for scrubber thumbnails, and always tries to add a 240p I-frame-only playlist.',
      'Packages the folder with README.txt and report.json into a tar.gz (or zip) and gives you a presigned download link.',
    ],
    flowSteps: [
      { title: 'Upload', description: 'The browser uploads straight to our storage bucket with a presigned PUT; the API then downloads it to work on.' },
      { title: 'Probe', description: 'ffprobe reads width, height, frame rate, duration and whether there is audio; rungs taller than the source are greyed out.' },
      { title: 'Pick rungs and extras', description: '360p, 480p and 720p are preselected. Tick captions, extra caption languages, storyboards, and tar.gz or zip.' },
      { title: 'Encode each rung', description: 'libx264 at the rung CRF and bitrate with a 2 second GOP, AAC at the rung audio bitrate, HLS VOD output.' },
      { title: 'Add extras and write the master', description: 'Captions, storyboards and the I-frame playlist are generated, then master.m3u8 is rewritten to reference them.' },
      { title: 'Download the package', description: 'A presigned link valid for 30 minutes by default; the job page lets you fetch it while it lasts.' },
    ],
    advancedDetails: [
      'The ladder (transcode_profiles.go) is: 144p 200 kbps video and 64 kbps audio, CRF 26; 240p 400/64, CRF 25; 360p 800/96, CRF 23; 480p 1200/128, CRF 23; 720p 2800/128, CRF 22; 1080p 5000/192, CRF 22; 2160p 12000/256, CRF 21. All rungs use the veryfast preset except 2160p, which uses slow.',
      'Each rung is encoded as ffmpeg -i input -map 0:v:0 -vf scale=-2:H -r FPS -c:v libx264 -profile:v high -level 4.1 -preset P -crf N -sc_threshold 0 -g GOP -keyint_min GOP -b:v B -maxrate 1.2B -bufsize 2B -force_key_frames expr:gte(t,n_forced*2) -map 0:a:0? -c:a aac -b:a A -ac 2 -ar 48000 -hls_time 2 -hls_playlist_type vod -hls_flags independent_segments. GOP is the frame rate times 2, so segments start on keyframes in every rung.',
      'Because the encode is CRF-driven with -maxrate as a cap, a rung averages at most about its listed bitrate (the cap is 1.2 times it) and comes in lower on easy content. The master playlist advertises BANDWIDTH as the listed video plus audio bitrate, and CODECS as avc1.640028 with mp4a.40.2 appended when audio is present.',
      'By default a guest may select 360p to 720p, a free account 360p to 1080p, and Premium or Pro the full 144p to 2160p ladder; sources shorter than 360p are refused below Premium. The server re-validates the rungs at start, so a client cannot request a rung it was not offered.',
      'Captions use the same Whisper model (whisper-ctranslate2, medium) as the transcriber; the primary track is written to captions/<lang>/auto.vtt with a one-segment subs.m3u8 wrapper and referenced from the master as EXT-X-MEDIA TYPE=SUBTITLES. Up to 3 extra languages from a list of 37 are translated segment by segment by a local Ollama model (a translategemma 12b build); a failed translation is recorded as a warning, never a failed job.',
      'Storyboards are one ffmpeg pass: fps=1/N with N of 5, 10 or 15 seconds depending on duration (under 10 minutes, under 30, longer), 160 x 90 tiles padded to 16:9 in a 10 x 10 grid per JPEG sprite, plus storyboard.vtt with #xywh cues. The I-frame playlist re-encodes only keyframes at 240p (select=eq(pict_type,I), libx264 CRF 30, 4 second segments) and is listed as EXT-X-I-FRAME-STREAM-INF.',
      'The master carries EXT-X-VERSION:6, EXT-X-INDEPENDENT-SEGMENTS and three EXT-X-SESSION-DATA entries naming the producer, the site and the copyright holder. report.json records the probe, the variants with segment counts and byte sizes, warnings and timestamps.',
    ],
    whyItMatters: [
      'HLS is the native streaming format of iOS, Safari and every CDN, and with hls.js it plays in every other browser too.',
      'Adaptive rungs let a viewer on a weak connection keep watching at 360p instead of buffering at 1080p.',
      'A pre-segmented VOD package is static files, so it can be hosted on object storage with no transcoding server behind it.',
    ],
    useCases: [
      { title: 'Course platforms', description: 'Serve lessons from a bucket with adaptive bitrate and captions in several languages.' },
      { title: 'Product and marketing pages', description: 'Stream a demo without a third-party video host and its player branding.' },
      { title: 'Internal portals', description: 'Host training videos on your own CDN with scrubber thumbnails.' },
      { title: 'Archives', description: 'Convert a back catalogue into a streamable layout you control and can mirror.' },
    ],
    whyMediaManipulator: [
      'Every rung bitrate, CRF, preset and FFmpeg flag is listed on this page, so what the package contains is not a surprise.',
      'Captions come from our own Whisper transcriber and translations from a model on our own hardware, both referenced correctly in the master playlist.',
      'The package is plain files with a README and a report.json; unpack it onto any static host and point a player at master.m3u8.',
      `A transcode spends one operation of your daily allowance (5 a day as a guest by default, 30 with a free account) and is limited to 10 starts an hour per session; a failed job is refunded. ${RETENTION_PROMISE}.`,
    ],
    privacyNote:
      `Your upload goes straight from the browser to our storage bucket and is then downloaded to our own server, where ffprobe, FFmpeg and, if you tick captions, our Whisper transcriber and a local Ollama translation model run; no third-party transcoding or AI service is involved. The source object, the working directory and the finished package are all registered in the retention ledger and deleted when the window ends, and the download link itself expires after 30 minutes by default. ${RETENTION_PROMISE}. Transcoding does not run the automated content analysis that standard conversions receive. The generated master playlist contains session-data lines naming Media Manipulator as the producer; they carry no information about you.`,
    faq: [
      {
        question: 'Which rungs can I select on my plan?',
        answer:
          'By default a guest gets 360p, 480p and 720p; a free account adds 1080p; Premium and Pro unlock 144p, 240p and 2160p as well. A rung taller than your source is always disabled, because nothing is upscaled. The chips show the reason on hover.',
      },
      {
        question: 'How long are the segments, and why 2 seconds?',
        answer:
          'Every rung is cut into 2 second MPEG-TS segments with a forced keyframe at each boundary, so a player can switch rungs at any segment without a visual glitch. The I-frame playlist uses 4 second segments because it holds only keyframes.',
      },
      {
        question: 'Are the captions linked in the master playlist?',
        answer:
          'Yes. Each language is written as captions/<lang>/auto.vtt with a subs.m3u8 wrapper and declared in master.m3u8 as EXT-X-MEDIA TYPE=SUBTITLES in the subs group, with the source language marked DEFAULT. You can add up to 3 translated languages from the list of 37.',
      },
      {
        question: 'What if my video has no audio?',
        answer:
          'The rungs are encoded video-only with -an, the CODECS attribute omits mp4a.40.2, and the captions step is skipped with a warning in report.json since there is nothing to transcribe.',
      },
      {
        question: 'What is in the package, and how do I host it?',
        answer:
          'hls/master.m3u8, one folder per rung with index.m3u8 and segments, hls/iframes/, optional captions/ and storyboards/, README.txt and report.json. Unpack it onto any static host or bucket that serves .m3u8 and .ts with the right MIME types and point your player at master.m3u8.',
      },
      {
        question: 'How long does the download link work, and can I get tar.gz or zip?',
        answer:
          'The presigned link lasts 30 minutes by default; run the job again if it has expired. Choose tar.gz (the default) or zip in the form before starting.',
      },
      {
        question: 'How long does an HLS transcode take?',
        answer:
          'Each selected rung is a full libx264 encode with the veryfast preset, run one after another, so time grows with duration times the number of rungs; 720p dominates the three default rungs. Captions add a Whisper pass over the whole audio. The job page shows each stage as it completes.',
      },
    ],
    related: [
      { label: 'Compress video', to: '/tools/compress-video', description: 'One smaller MP4 instead of a streaming package.' },
      { label: 'Transcribe video', to: '/tools/transcribe-video', description: 'Get the same Whisper captions as a standalone VTT or SRT.' },
      { label: 'Trim video', to: '/tools/video-trimmer', description: 'Remove the dead start and end before transcoding.' },
      { label: 'AI video restoration', to: '/tools/ai-video-restoration', description: 'Upscale a low-resolution snippet before you build a ladder from it.' },
      { label: 'Darkroom', to: '/tools/content-studio', description: 'Edit and caption the video, then transcode the export.' },
    ],
    workedExamples: [
      {
        title: 'A 3 minute 1080p clip at the three default rungs',
        body:
          'Input: a 3 minute 1920 x 1080 30 fps MP4 of 140 MB with stereo audio, within the guest caps. Settings: 360p, 480p and 720p (the default selection and the most a guest can pick), no captions or storyboards, tar.gz. Each rung is cut into 2 second segments, 90 per rung, with a GOP of 60 frames so every segment starts on a keyframe. At the listed bitrates the rungs weigh at most about 20 MB for 360p (800 + 96 kbps x 180 s), 30 MB for 480p (1200 + 128 kbps) and 66 MB for 720p (2800 + 128 kbps), about 116 MB together before the small 240p I-frame playlist, and less on easy content because the encode is CRF-driven with the bitrate as a cap. The resulting package has 270 .ts segments, three index.m3u8 files and the master. Time is three libx264 veryfast encodes of 5400 frames each run one after another; the 720p rung takes the longest.',
      },
      {
        title: 'A 12 minute 720p webinar with English captions, Spanish translation and storyboards',
        body:
          'Input: a 12 minute 1280 x 720 25 fps MP4 of 380 MB, uploaded with a free account because it exceeds the 5 minute guest default. Settings: 360p and 720p (1080p is greyed out because the source is 720p), captions on with Spanish as an extra language, storyboards on, zip. Whisper transcribes the 12 minutes first and writes captions/en/auto.vtt; the Spanish track is translated in batches of 30 segments into captions/es/auto.vtt, and both are listed as subtitle renditions in the master. Storyboards use a 10 second interval for a source over 10 minutes: 72 thumbnails of 160 x 90 fit in a single 1600 x 900 sprite_001.jpg with a storyboard.vtt pointing at each tile. The two rungs are 360 segments each of 2 seconds, with a 50 frame GOP at 25 fps, and weigh at most about 81 MB (360p) and 264 MB (720p) at the listed bitrates. The job spends longer on Whisper and the two encodes than on anything else; the translation is a short extra step.',
      },
    ],
    whenNotToUse:
      'Do not transcode to HLS if you simply want a smaller single file to send or embed; the compressor does that in one pass without segments and playlists. Do not use it for live events, since the output is a finished VOD playlist, not a live origin. If your source is below 360p, the ladder cannot be built without Premium. And if your player is a plain video tag with no HLS support, you need an MP4 or an hls.js style player first; a master.m3u8 on its own plays natively only in Safari and on Apple devices.',
    primaryKeyword: 'transcode video to HLS',
    secondaryKeywords: [
      'HLS transcoder',
      'convert MP4 to HLS',
      'master.m3u8 generator',
      'adaptive bitrate streaming',
      'HLS VOD packaging',
    ],
  },
  {
    slug: 'transcode-to-dash',
    name: 'Transcode Video to DASH (AV1 / VP9)',
    h1: 'Transcode Video to DASH AV1 or VP9 Online',
    tagline:
      'Package any video into a MPEG-DASH bundle with manifest.mpd + per-rendition init/media segments.',
    metaTitle: 'Transcode Video to DASH AV1/VP9 Online | Free MPEG-DASH Tool',
    metaDescription:
      'Free online MPEG-DASH transcoder. Convert MP4, MOV, WebM, MKV into a DASH package with AV1 or VP9 video, optional captions and storyboards.',
    ogTitle: 'Transcode Video to DASH AV1/VP9 Online',
    ogDescription:
      'Generate an adaptive DASH package (manifest.mpd + per-rendition init/media segments) from any video — free, in your browser.',
    category: 'video',
    embed: {
      defaultMediaKind: 'video',
      defaultTask: 'transcode_to_dash',
      transcodeMode: true,
      transcodeProtocol: 'dash',
      transcodeDashCodec: 'av1',
      transcodeLockProtocol: true,
      title: 'Transcode a video to DASH (AV1 / VP9)',
      description:
        'Upload an MP4/MOV/WebM/MKV. We ffprobe the source, let you pick free quality rungs (360p/480p/720p), then run an AV1 (default) or VP9 ffmpeg encode and bundle a downloadable tar.gz with manifest.mpd.',
    },
    intro:
      'MPEG-DASH is the open adaptive-streaming standard supported by every modern browser. Media Manipulator transcodes your source video into a DASH VOD bundle — manifest.mpd plus per-rendition init.mp4 and .m4s segments — using AV1 (smaller files, best for new web players) or VP9 (broader playback support). Drop the unzipped folder onto any CDN or origin and serve manifest.mpd to clients. Free tier covers 360p, 480p, and 720p.',
    whatItDoes: [
      'Probes your source with ffprobe and shows resolution, FPS, duration, codec, and audio status.',
      'Lets you pick which quality rungs to encode and whether to emit AV1 or VP9.',
      'Auto-detects the best AV1 encoder available (av1_nvenc → libsvtav1 → libaom-av1).',
      'Generates an MPEG-DASH manifest.mpd referencing each video Representation plus an AAC audio Representation when present.',
      'Optionally generates WebVTT captions and storyboard scrubber thumbnails.',
      'Bundles the result into media-manipulator-dash-<codec>-<jobID>.tar.gz with a report.json and README.',
      'Uploads the tarball to S3 and hands you back a short-lived presigned GET URL.',
    ],
    flowSteps: [
      { title: 'Upload', description: 'Direct S3 presigned PUT — your file never goes through the API server.' },
      { title: 'Probe', description: 'ffprobe reads resolution, FPS, audio presence, and codec metadata.' },
      { title: 'Pick rungs + codec', description: 'Choose AV1 or VP9 and any combination of 360p/480p/720p.' },
      { title: 'Encode', description: 'AV1 (svtav1/libaom/nvenc) or libvpx-vp9 at 2-second segments.' },
      { title: 'Package', description: 'manifest.mpd + per-rendition init/segments tar.gz’d with report.json and README.' },
      { title: 'Download', description: 'Presigned S3 GET URL valid for 30 minutes.' },
    ],
    advancedDetails: [
      'AV1 encoder selection prefers av1_nvenc (GPU) when available, falling back to libsvtav1, then libaom-av1.',
      'VP9 uses libvpx-vp9 with row-mt, frame-parallel decoding, and CRF + bitrate guidance.',
      'DASH variants are emitted with -seg_duration 2 -use_template 1 -use_timeline 0 -single_file 0.',
      'manifest.mpd declares one AdaptationSet per content type (video + audio when present) with codecs attributes "av01.0.08M.08" / "vp09.00.51.08" / "mp4a.40.2".',
      'No upscaling: rungs taller than the source resolution are disabled with a tooltip.',
    ],
    whyItMatters: [
      'AV1 typically halves the bitrate at equivalent quality versus H.264.',
      'DASH is the dominant adaptive-streaming format outside the Apple ecosystem.',
      'Pre-packaged VOD avoids per-request transcoding bills on streaming platforms.',
    ],
    useCases: [
      { title: 'Modern web players', description: 'Shaka Player and dash.js consume manifest.mpd natively.' },
      { title: 'Bandwidth-sensitive distribution', description: 'AV1 gives near-half the bytes of an H.264 HLS package.' },
      { title: 'Internal media library', description: 'Self-host adaptive video without paying a SaaS streaming platform.' },
      { title: 'Quality testing', description: 'A/B AV1 vs VP9 encodes side-by-side from the same source.' },
    ],
    whyMediaManipulator: [
      'Runs on our own servers — no third-party transcoding provider sees your video.',
      'AV1 selected by default since AV1 is the future for high-quality adaptive streaming.',
      'Open package format: just unzip the .tar.gz and host the manifest.mpd.',
    ],
    privacyNote: privacyNoteFor('video', 'Your video is read once by FFmpeg, encoded into AV1 or VP9 renditions and split into DASH segments with a manifest, all on our servers.'),
    faq: [
      {
        question: 'AV1 or VP9 — which should I pick?',
        answer: 'AV1 produces smaller files at equivalent quality, but encoding is slower on CPU-only hosts. VP9 has broader playback support and faster encoding. AV1 is the default.',
      },
      {
        question: 'My server says AV1 is unavailable?',
        answer: 'AV1 needs one of av1_nvenc (NVIDIA GPU), libsvtav1, or libaom-av1 in FFmpeg. Check /api/video-transcode/capabilities for what your install has.',
      },
      {
        question: 'Is audio always AAC?',
        answer: 'Yes — the DASH audio AdaptationSet currently emits AAC LC at 128 kbps for maximum compatibility regardless of source codec.',
      },
      {
        question: 'Can I serve this manifest cross-origin?',
        answer: 'Yes, but your CDN/origin needs the right CORS headers on .mpd, init.mp4, and .m4s files. The tarball does not bundle those headers.',
      },
      {
        question: 'How long does the download URL last?',
        answer: 'Presigned GET URLs are valid for 30 minutes by default. Re-run the transcode if you need a fresh link.',
      },
    ],
    related: [
      {
        label: 'Transcode video to HLS',
        to: '/tools/transcode-to-hls',
        description: 'Same upload, but emits an Apple HLS package with H.264 + AAC.',
      },
      {
        label: 'Compress video',
        to: '/tools/compress-video',
        description: 'Shrink an MP4 with the regular FFmpeg pipeline.',
      },
      {
        label: 'Transcribe video',
        to: '/tools/transcribe-video',
        description: 'Pull speech out of video into searchable text.',
      },
      // Hidden during AdSense review — re-enable when the blog returns.
      // {
      //   label: 'Video compression guide',
      //   to: '/blog/video/video-compression-guide',
      //   description: 'Codecs, bitrate, and container deep dive.',
      // },
    ],
    primaryKeyword: 'transcode video to DASH',
    secondaryKeywords: [
      'MPEG-DASH transcoder',
      'AV1 DASH packager',
      'VP9 DASH packager',
      'manifest.mpd generator',
      'adaptive bitrate streaming',
    ],
  },
  {
    slug: 'convert-video-to-animated-gif',
    lastReviewed: '2026-10-29',
    name: 'Convert Video to Animated GIF',
    h1: 'Convert Video to Animated GIF Online',
    tagline:
      'Turn short MP4, WebM, MOV, or MKV clips into shareable animated GIFs in seconds.',
    metaTitle: 'Convert Video to Animated GIF Online (Free) | Media Manipulator',
    metaDescription:
      'Free online video-to-GIF converter. Turn short MP4, WebM, MOV, and MKV clips into animated GIFs with control over size and frame rate.',
    ogTitle: 'Convert Video to Animated GIF Online',
    ogDescription:
      'Turn short video clips into shareable animated GIFs. Control frame rate, dimensions, and loop.',
    category: 'video',
    embed: {
      defaultMediaKind: 'video',
      defaultTask: 'video_to_gif',
      defaultOutputFormat: 'gif',
      title: 'Convert a video clip to GIF',
      description:
        'Upload a short video and pick GIF as the output format. Trim to under ~10 seconds and lower the frame rate for a smaller file.',
    },
    intro:
      'An animated GIF is a stack of indexed-colour frames, 256 colours at most per palette, with no inter-frame compression beyond simple run-length coding. That is why a GIF of a few seconds can outweigh an MP4 of a minute, and why making a good one is mostly about choosing width, frame rate and palette size. This page runs a two-stage pipeline: FFmpeg scales the video to the width you set and samples it at your frame rate, writing a raw GIF, then gifsicle re-quantises the palette to your colour count, sets the frame delay and optimises the frames so only changed pixels are stored. The defaults are tuned for screen recordings: 900 pixels wide, 12 frames per second, 128 colours.',
    whatItDoes: [
      'Scales the clip to a chosen width (16 to 2000 px) with the height computed from the aspect ratio and rounded to a multiple of 4.',
      'Samples the source at a chosen frame rate (1 to 50 fps; 12 by default) with FFmpeg.',
      'Quantises each frame to a palette of 2 to 256 colours (128 by default) and optimises inter-frame storage with gifsicle at level 1 to 3.',
      'Sets the frame delay in hundredths of a second, which decides playback speed independently of the sampling rate.',
      'Honours a trim range from the converter form so only the selected seconds become frames.',
    ],
    flowSteps: [
      { title: 'Upload a video and pick GIF', description: 'GIF is already selected as the output on this page; the Quality control is disabled because it does not apply.' },
      { title: 'Trim to a few seconds', description: 'Use the trim control to keep the moment you want; every extra second is 12 more frames at the default rate.' },
      { title: 'Set width, frame rate, colours and delay', description: 'The Animated GIF Settings panel starts at 900 px, 12 fps, 128 colours, delay 3, optimise 3.' },
      { title: 'FFmpeg samples, gifsicle optimises', description: 'ffmpeg scale=W:-4 -pix_fmt rgb8 -r FPS, then gifsicle --optimize --delay --colors --interlace.' },
      { title: 'Download the GIF', description: 'A standard looping GIF that chat apps and browsers play inline.' },
    ],
    advancedDetails: [
      'Stage one is ffmpeg -i input [-ss START -t DURATION] -vf scale=W:-4 -pix_fmt rgb8 -r FPS -f gif raw.gif (convertVideoToGIF in converter.go). The -4 asks for a height that keeps the aspect ratio and is divisible by 4; rgb8 is an 8-bit indexed intermediate that stage two re-quantises.',
      'Stage two is gifsicle --optimize=L --delay=D --colors C --interlace raw.gif -o output.gif. Optimise level 3 is the slowest and smallest: it stores only the rectangle of pixels that changed between frames, which is why a screencast with a static toolbar compresses far better than a panning camera shot.',
      'The delay is applied to every frame after sampling and is independent of the sampling rate. At the default 12 fps and delay 3 (30 ms per frame) a clip plays about 2.8 times faster than real time; set the delay to 8 (80 ms, 12.5 fps) for roughly real-time playback at 12 fps, or 10 at 10 fps.',
      'A width typed into the main Width field of the converter overrides the GIF panel width, so power users can keep one knob. Colours are clamped to 2 to 256 by the form; a GIF palette can never exceed 256.',
      'There is no palettegen pass in FFmpeg here; palette quality comes from gifsicle --colors, which builds one optimised palette for the whole animation. Photographic clips with smooth gradients benefit from 256 colours; flat UI footage looks identical at 64.',
      'The gifsicle stage runs under a 6 hour timeout, and the upload also receives the automated content analysis that standard conversions get, since GIF is a format of the regular video converter.',
    ],
    whyItMatters: [
      'GIFs autoplay inline in issue trackers, chat apps, documentation sites and email clients where a video attachment would show a play button or nothing.',
      'A 5 second GIF of a bug reproduces it faster than a paragraph and does not need a video player.',
      'Palette and frame-rate choices change the size by an order of magnitude, so exposing them beats a one-size preset.',
    ],
    useCases: [
      { title: 'Bug reproductions', description: 'Record the screen, trim to the failure, and drop the GIF in the ticket.' },
      { title: 'README and documentation demos', description: 'Show a feature in motion where a video embed is not allowed.' },
      { title: 'Reaction clips', description: 'Cut 3 seconds from a video and share it anywhere that accepts images.' },
      { title: 'Email previews', description: 'A small looping GIF linking to the full video, where video itself will not play.' },
    ],
    whyMediaManipulator: [
      'Both stages of the pipeline and their defaults are documented here, including the delay behaviour that makes default GIFs play fast.',
      'Width, frame rate, colour count, delay and optimisation level are all exposed, not a single size slider.',
      `A GIF conversion counts as one operation (5 a day for guests by default, 30 with a free account), and a failed job is refunded. ${RETENTION_PROMISE}.`,
    ],
    privacyNote:
      `GIF conversion runs on our own servers: FFmpeg samples and scales the frames, then gifsicle quantises and optimises them; a temporary raw GIF is deleted as soon as gifsicle finishes. The upload is kept in uploads/<jobId>/ and the GIF in outputs/<jobId>/, both in the retention ledger and deleted when the window ends. ${RETENTION_PROMISE}. As a format of the standard video converter, the upload also goes through our automated content analysis on the same hardware (sampled frames described by a local vision model, any audio transcribed locally); that report stays with the job and is not shared with third parties.`,
    faq: [
      {
        question: 'Why does my GIF play faster than the original video?',
        answer:
          'The frame delay is set after sampling and defaults to 3 hundredths of a second, which is about 33 frames per second of playback for frames sampled at 12 per second. Set the delay to 8 at 12 fps, or 10 at 10 fps, for real-time playback.',
      },
      {
        question: 'How do I make the GIF smaller?',
        answer:
          'In order of effect: trim to fewer seconds, lower the width (480 is plenty for chat), lower the frame rate to 8 or 10, and reduce colours to 64 on flat UI footage. Keep optimise at 3; levels 1 and 2 only trade size for speed.',
      },
      {
        question: 'How many colours should I use?',
        answer:
          '128, the default, suits most screen recordings. Flat interfaces look identical at 64 and save bytes. Photographic footage with gradients wants 256, which is the GIF maximum.',
      },
      {
        question: 'Can I pick which part of the video becomes the GIF?',
        answer:
          'Yes. Use the trim control in the converter to set a start and end; only that range is sampled. Shorter is better, since every second adds frames at the chosen rate.',
      },
      {
        question: 'Will the GIF loop, and does it keep the sound?',
        answer:
          'It loops, as GIFs do by default in every player. It cannot carry audio; the format has no sound track. Extract the audio separately if you need it.',
      },
      {
        question: 'What is the largest GIF I can make?',
        answer:
          'The form allows up to 2000 px wide, 50 fps and 256 colours, but a GIF at those settings grows enormous fast. The upload itself is bound by your plan, 200 MB and 5 minutes of video for a guest by default.',
      },
    ],
    related: [
      { label: 'Trim video', to: '/tools/video-trimmer', description: 'Cut the exact seconds first, losslessly.' },
      { label: 'Compress video', to: '/tools/compress-video', description: 'For anything longer than a few seconds, a small MP4 beats a GIF.' },
      { label: 'Darkroom', to: '/tools/content-studio', description: 'Add captions or crop before exporting the clip.' },
      { label: 'Video converter tutorial', to: '/tutorials/video/getting-started', description: 'Walk through trim, resize, and filter settings.' },
    ],
    workedExamples: [
      {
        title: 'An 8 second 1080p screen recording at the defaults',
        body:
          'Input: an 8 second 1920 x 1080 MP4 screen recording of about 15 MB. Settings: GIF, width 900, 12 fps, 128 colours, delay 3, optimise 3. FFmpeg scales to 900 pixels wide by about 506 tall (nudged to a multiple of 4) and samples 96 frames. Uncompressed those 96 indexed frames would be about 43 MB (900 x 504 x 96 bytes), which is the ceiling gifsicle works down from; with a static toolbar and a moving cursor, level 3 optimisation stores only the changing rectangles, so a screencast lands far below that bound, typically in the low megabytes. With delay 3 the 96 frames play in about 2.9 seconds, roughly 2.8 times faster than the 8 second source; set the delay to 8 to play in about 7.7 seconds. The job is a short encode plus a gifsicle pass over 96 frames.',
      },
      {
        title: 'A 5 second reaction clip at 480 px, 10 fps and 64 colours',
        body:
          'Input: a 20 second 1080p MP4 of 40 MB, trimmed in the form to a 5 second range. Settings: GIF, width 480, 10 fps, 64 colours, delay 10, optimise 3. FFmpeg cuts the 5 seconds, scales to 480 pixels wide by about 270 tall (rounded to a multiple of 4) and samples 50 frames. The raw frame data is about 6.5 MB (480 x 268 x 50 bytes) before optimisation, and a 64-colour palette needs only 6 bits per pixel, so a camera shot with motion across the whole frame will still come out well under that, while a steady talking head compresses to a fraction of it. Delay 10 is 100 ms per frame, so 50 frames play in exactly 5 seconds, matching real time at 10 fps.',
      },
    ],
    whenNotToUse:
      'Do not make a GIF of anything longer than about 10 seconds or with photographic motion across the whole frame; the format has no real inter-frame compression, so such clips become tens of megabytes while an MP4 or WebM of the same thing is a tenth of the size. Do not use GIF when colour fidelity matters, since every frame is limited to a 256-colour palette and gradients band. If the destination plays video inline, a compressed MP4 is better in every way. And if you need audio, a GIF cannot carry it at all.',
    primaryKeyword: 'convert video to GIF',
    secondaryKeywords: [
      'video to animated GIF',
      'MP4 to GIF',
      'WebM to GIF',
      'make a GIF from a video',
      'free video to GIF converter',
    ],
  },
  {
    slug: 'transcribe-video',
    lastReviewed: '2026-10-29',
    name: 'Transcribe Video',
    h1: 'Transcribe Video to Text Online',
    tagline:
      'Pull the spoken words out of a video or audio file as WebVTT or SRT captions, plain text, or timestamped JSON.',
    metaTitle: 'Transcribe Video to Text Online (Free) | Media Manipulator',
    metaDescription:
      'Free online video transcription. Convert MP4, MOV, WebM, MKV, and audio files into searchable text, VTT captions, or JSON transcripts.',
    ogTitle: 'Transcribe Video to Text Online',
    ogDescription:
      'Extract speech from videos into text, captions, or JSON transcripts. Runs on a local GPU server.',
    category: 'ai',
    embed: {
      defaultMediaKind: 'video',
      defaultTask: 'transcribe_video',
      transcribeMode: true,
      title: 'Transcribe a video',
      description:
        'Upload a video. The AI transcription model runs on our local GPU server and exports as VTT captions, plain text, or JSON: VTT for captions, plain text for an article, JSON for downstream tooling.',
    },
    intro:
      'Transcribe Video takes an MP4, MOV, WebM, MKV or a plain audio file, separates the audio track, and runs it through Whisper on a GPU server we operate. You choose the shape of the result before you upload: a WebVTT or SRT caption file with cue timings, a plain text file with just the words, or a JSON document with every segment and its start and end time to the millisecond. The language is detected automatically, or you can type a two-letter code to pin it.',
    whatItDoes: [
      'Decodes the audio track with ffmpeg into a 16 kHz mono WAV, the sample rate Whisper expects, and deletes that intermediate when the job finishes.',
      'Runs whisper-ctranslate2 with the medium Whisper model in float16 on our GPU, with voice-activity filtering switched on so silence and long stretches of music are skipped.',
      'Writes one file named transcript.vtt, transcript.srt, transcript.txt or transcript.json, depending on the format you picked.',
      'Detects the spoken language from the audio itself; a language code you type in the form overrides detection for short or mixed clips.',
      'Reports honestly when there is nothing to transcribe: a video with no audio stream, or audio with no recognizable speech, still completes with a short message instead of an empty file.',
    ],
    flowSteps: [
      { title: 'Upload video or audio', description: 'MP4, MOV, WebM, MKV, AVI, or an audio file such as MP3, WAV, M4A or FLAC.' },
      { title: 'Pick a format', description: 'VTT or SRT for captions, TXT for a readable transcript, JSON for timestamps you can process.' },
      { title: 'ffmpeg extracts the audio', description: 'The track is converted to 16 kHz mono PCM; the video frames are never decoded.' },
      { title: 'Whisper transcribes on our GPU', description: 'The job waits for a free GPU slot, then the medium model runs over the whole file in one pass.' },
      { title: 'Download the transcript', description: 'The file appears with the job and can be downloaded as long as the job is kept.' },
    ],
    advancedDetails: [
      'The exact extraction command is ffmpeg -vn -acodec pcm_s16le -ar 16000 -ac 1, so a stereo 48 kHz track is folded to mono and resampled before Whisper sees it. That intermediate costs 32 KB per second (about 1.9 MB per minute) of disk while the job runs and is removed afterwards.',
      'whisper-ctranslate2 is launched with --model medium --device cuda --compute_type float16 --vad_filter True and --output_format json; the API parses that JSON and renders your chosen format itself. The model is a server setting (WHISPER_CT2_MODEL), so medium is the default, not a promise.',
      'VTT output starts with the WEBVTT header and numbers each cue; timestamps are HH:MM:SS.mmm. SRT is the same cue list with comma millisecond separators. A segment whose end equals its start is given half a second so players still display it.',
      'JSON output contains language, hasAudio, hasSpeech, transcript, durationSeconds and a segments array of {id, start, end, text} with times rounded to the millisecond. There are no per-word timings and no confidence scores in this output.',
      'Only one Whisper process runs at a time by default (WHISPER_GPU_CONCURRENCY=1), and the GPU scheduler checks free VRAM before starting; the medium model in float16 needs about 3.5 GB plus a 512 MB margin. If the card is busy your job waits in the queue rather than failing.',
      'With the VAD filter on, a file that is all music or very faint speech can come back with "Audio was detected but no recognizable speech was found." That message is written into the transcript file so the download is never empty.',
    ],
    whyItMatters: [
      'A caption file is the difference between a video that can be watched on mute, searched, or quoted and one that cannot.',
      'Timestamped segments let you jump to the moment a phrase was said, which is what turns a two-hour recording into something you can actually use.',
      'Keeping the transcription on hardware we run means the audio is not handed to an outside speech API.',
    ],
    useCases: [
      { title: 'Captions for a published video', description: 'Export VTT for HTML video and most web players, or SRT for editing suites and TV-style subtitle workflows.' },
      { title: 'Meeting and interview notes', description: 'Take the TXT output into a document and edit from there instead of typing from scratch.' },
      { title: 'Indexing a recording archive', description: 'Use the JSON segments to build a search index that points at the exact second a word was spoken.' },
      { title: 'A first draft of an article', description: 'Transcribe a talk or screencast, then rewrite the plain text into prose.' },
    ],
    whyMediaManipulator: [
      'You choose VTT, SRT, TXT or JSON before uploading, so there is no second conversion step after the transcript exists.',
      'Whisper runs on our own GPU with the model cache set to offline mode; no outside speech service receives the audio.',
      'Transcription counts as one AI job, drawn from the AI allowance, which is separate from the everyday one: by default 3 a day for a guest and 10 with a free account, and your everyday jobs stay untouched (see /pricing).',
    ],
    privacyNote:
      `Your video or audio file is stored under its job folder on our server. ffmpeg writes a temporary 16 kHz mono WAV that Whisper reads on our GPU, and that WAV is deleted when the job finishes. The transcript file and a transcribe_result.json copy of the segments stay with the job, and the transcript text is also passed to a language model running on our own hardware for an automated summary and safety review whose result is kept with the job. Nothing is sent to a third-party AI provider. ${RETENTION_PROMISE}.`,
    faq: [
      {
        question: 'Which caption format should I pick, VTT or SRT?',
        answer:
          'VTT if the captions are for the web (HTML video, most players) and SRT if they are going into a video editor or a broadcast-style workflow. Both contain the same cues; only the header and the millisecond separator differ, a period in VTT and a comma in SRT.',
      },
      {
        question: 'Does the JSON transcript include confidence scores or word timings?',
        answer:
          'No. Each segment has an id, a start and end time in seconds (rounded to the millisecond) and its text. The file also records the detected language, the duration and whether speech was found, but there are no per-word timings and no probabilities.',
      },
      {
        question: 'How long a file can I transcribe?',
        answer:
          'Audio-only uploads are held to the same duration cap as video: 5 minutes for a guest, 20 minutes with a free account, 2 hours on Premium and Pro by default, and 200 MB, 1 GB or 5 GB per file respectively. The form shows the limits that apply to you, and /pricing lists the current numbers.',
      },
      {
        question: 'Why did I get "no recognizable speech was found"?',
        answer:
          'Whisper runs with voice-activity detection switched on, so a file that is music, ambient sound, silence or very faint speech can be trimmed to nothing. The message is written into the transcript file itself so the download still works. Re-record louder or trim to the spoken part and try again.',
      },
      {
        question: 'Can I force the language instead of letting it detect?',
        answer:
          'Yes. Type a two-letter language code such as en, de or es in the language field and Whisper will transcribe in that language. Leave it blank for automatic detection, which works well on clips longer than a few seconds.',
      },
      {
        question: 'Does transcription use my AI allowance?',
        answer:
          'Yes. Each transcription is one AI job: by default 3 per day as a guest, 10 with a free account, 100 on Premium and 200 on Pro. The AI allowance is its own counter, so transcribing never uses up the everyday allowance for conversions. A job that fails refunds the unit.',
      },
      {
        question: 'What model is used, and can I pick a bigger one?',
        answer:
          'The service runs whisper-ctranslate2 with the medium model in float16 on a CUDA GPU by default. There is no model picker in the form; the model is set on the server, so very fast or very large variants are not something you can request per job.',
      },
    ],
    related: [
      { label: 'Compress video', to: '/tools/compress-video', description: 'Shrink a large recording before uploading it for a transcript.' },
      { label: 'Extract audio from video', to: '/tools/extract-audio-from-video', description: 'Pull out the audio track if you want to keep a copy of it as well.' },
      { label: 'Clean voice audio', to: '/tools/clean-voice-audio', description: 'Lift a noisy recording before transcribing it.' },
      { label: 'Video trimmer', to: '/tools/video-trimmer', description: 'Cut the file down to the spoken part first.' },
      { label: 'Video converter tutorial', to: '/tutorials/video/getting-started', description: 'Prepare and convert the video before transcribing.' },
    ],
    workedExamples: [
      {
        title: 'A 9-minute 1080p MP4 of 120 MB, as VTT captions',
        body: 'The 120 MB is under the 200 MB guest cap, but 9 minutes is over the 5-minute guest limit, so this one needs a free account, which allows 20 minutes by default. ffmpeg writes a 16 kHz mono WAV of about 17 MB (32,000 bytes per second for 540 seconds), which is deleted after the run. Whisper medium then produces numbered cues with HH:MM:SS.mmm timings, and the resulting transcript.vtt is a few kilobytes, because it holds only text and timestamps. Uploading 120 MB on a home connection usually takes longer than the extraction, which is a few seconds; the Whisper pass is the rest and scales with the length of the speech, not the size of the video.',
      },
      {
        title: 'An 18-minute podcast MP3 of about 26 MB, as JSON',
        body: 'A 192 kbps MP3 is 24 KB per second, so 1,080 seconds comes to about 26 MB. Audio-only files are held to the same duration limit as video, so 18 minutes needs a free account (20-minute cap) rather than a guest session (5 minutes). There is no video to skip, but the file is still converted to 16 kHz mono PCM first (about 35 MB on disk, removed afterwards). The language is detected from the audio and written into the JSON as a two-letter code, and each segment carries its own start and end time. The JSON is larger than the TXT of the same recording because every segment is wrapped in its own object, but still well under a megabyte.',
      },
    ],
    whenNotToUse:
      'Do not use this when you need per-word timings, speaker labels, or confidence scores: the output has none of those, only segment-level timestamps. It is also the wrong tool for a file whose audio is music with no speech, since the voice-activity filter will skip it and you will get a short message instead of lyrics. If you only need to listen to the file, or you want captions translated into another language, you are after a different step. And if the recording is longer than your plan allows (5 minutes as a guest, 20 minutes on a free account by default), trim it first or sign in.',
    primaryKeyword: 'transcribe video online',
    secondaryKeywords: [
      'video to text',
      'free video transcription',
      'auto captions',
      'speech to text from video',
      'generate VTT subtitles',
    ],
  },

  // ----------------------------------------------------------------------- IMAGE
  {
    slug: 'convert-webp-to-jpg',
    name: 'Convert WebP to JPG',
    h1: 'Convert WebP to JPG Online',
    tagline:
      'Turn WebP images into broadly compatible JPG files that work in any image viewer or editor.',
    metaTitle: 'Convert WebP to JPG Online (Free) | Media Manipulator',
    metaDescription:
      'Free online WebP to JPG converter. Quickly turn .webp images into universally compatible JPG files at the quality you choose.',
    ogTitle: 'Convert WebP to JPG Online',
    ogDescription:
      'Turn WebP images into universally compatible JPG files in a couple of clicks.',
    category: 'image',
    embed: {
      defaultMediaKind: 'image',
      defaultTask: 'webp_to_jpg',
      defaultOutputFormat: 'jpg',
      lockedInputFormat: 'webp',
      acceptOverride: 'image/webp,image/*',
      title: 'Convert WebP to JPG',
      description:
        'Upload a WebP image and pick JPG as the output format. Adjust the quality slider to balance file size against image quality. JPG drops transparency, so use PNG instead if your image has a transparent background.',
    },
    intro:
      'WebP is great for the web — but older software, presentation tools, and printers often can\'t read it. Media Manipulator converts WebP back to JPG so you can use the image anywhere. Pick the quality you want, and we handle the rest.',
    whatItDoes: [
      'Converts any .webp image (still or animated frame) to standard .jpg.',
      'Lets you choose JPG quality — higher quality = larger file.',
      'Flattens transparency over a chosen background color (JPG has no alpha channel).',
      'Preserves color profile when possible.',
    ],
    flowSteps: [
      {
        title: 'Upload WebP',
        description: 'Drop in a .webp file from your computer.',
      },
      {
        title: 'Pick JPG quality',
        description: '85 is a good default; lower for smaller files.',
      },
      {
        title: 'Encode JPG',
        description: 'ImageMagick re-encodes with the chosen quality.',
      },
      {
        title: 'Download JPG',
        description: 'Save a universally compatible .jpg file.',
      },
    ],
    advancedDetails: [
      'Quality 85 is a long-standing balance point — anything above ~92 mostly just increases file size with little visual improvement.',
      'JPG has no transparency, so transparent WebPs are flattened. If you need transparency, convert to PNG instead.',
      'For lossless image conversion or animated WebPs, prefer PNG (still) or animated GIF.',
    ],
    whyItMatters: [
      'Some older browsers, image editors, and embedded software still do not support WebP.',
      'Many printers, photo kiosks, and presentation tools require JPG or PNG.',
      'JPG is the de facto exchange format for photos.',
    ],
    useCases: [
      {
        title: 'Sending photos to clients',
        description: 'Ensure the recipient can open the file on any device.',
      },
      {
        title: 'Embedding in presentations',
        description: 'PowerPoint/Keynote slides accept JPG everywhere; WebP is hit-or-miss.',
      },
      {
        title: 'Printing and photo labs',
        description: 'Most labs accept JPG only.',
      },
      {
        title: 'Stock photo submissions',
        description: 'Many stock sites require JPG uploads.',
      },
    ],
    whyMediaManipulator: [
      'No watermarks, no signup, free for casual use.',
      'Tune quality and compression precisely, instead of one-size-fits-all preset.',
      'Same privacy and retention model as the rest of the toolset.',
    ],
    privacyNote: privacyNoteFor('image', 'Your WebP is decoded and re-encoded as a JPG on our server; a transparent area is flattened because JPG cannot store it.'),
    faq: [
      {
        question: 'What about transparency?',
        answer:
          'JPG does not support transparency. Transparent WebPs are flattened against the chosen background color. If you need transparency, convert to PNG instead.',
      },
      {
        question: 'What quality should I use?',
        answer:
          '85 is a balanced default. Use 90+ for photos where quality matters most, 70 for thumbnails or previews.',
      },
      {
        question: 'Will it work with animated WebP?',
        answer:
          'Only the first frame becomes a JPG. For animated WebP, convert to an animated GIF instead.',
      },
      {
        question: 'Can I batch-convert multiple files?',
        answer:
          'The free tool handles one file at a time. Convert each WebP individually for now.',
      },
    ],
    related: [
      {
        label: 'Convert WebP to PNG',
        to: '/tools/convert-webp-to-png',
        description: 'Keep transparency with a lossless PNG instead.',
      },
      {
        label: 'Image converter',
        to: '/tools/image-converter',
        description: 'Convert between JPG, PNG, WebP, AVIF, and GIF.',
      },
      {
        label: 'Compress image',
        to: '/tools/compress-image',
        description: 'Shrink the JPG file size even further.',
      },
      {
        label: 'Remove EXIF metadata',
        to: '/tools/remove-exif-metadata',
        description: 'Strip private metadata before sharing the JPG.',
      },
      // Hidden during AdSense review — re-enable when the blog returns.
      // {
      //   label: 'Image optimization guide',
      //   to: '/blog/image/image-optimization-guide',
      //   description: 'JPG vs PNG vs WebP and when to use each.',
      // },
      {
        label: 'Image converter tutorial',
        to: '/tutorials/image/getting-started',
        description: 'Step-by-step walkthrough of every image option.',
      },
    ],
    primaryKeyword: 'convert WebP to JPG',
    secondaryKeywords: [
      'WebP to JPEG',
      'change WebP to JPG',
      'WebP converter',
      '.webp to .jpg',
      'open WebP file',
    ],
  },

  // ------------------------------------------------------------- IMAGE: EXACT CONVERSIONS
  {
    slug: 'convert-png-to-jpg',
    name: 'Convert PNG to JPG',
    h1: 'Convert PNG to JPG Online Free',
    tagline:
      'Turn large PNG screenshots and graphics into small, universally compatible JPG photos in seconds.',
    metaTitle: 'Convert PNG to JPG Online Free | Media Manipulator',
    metaDescription:
      `Free online PNG to JPG converter. Turn .png files into smaller, universally compatible JPG images at the quality you choose. No signup. ${RETENTION_PROMISE}.`,
    ogTitle: 'Convert PNG to JPG Online Free',
    ogDescription:
      'Turn PNG images into smaller, universally compatible JPG files. Free, fast, no signup.',
    category: 'image',
    embed: {
      defaultMediaKind: 'image',
      defaultTask: 'png_to_jpg',
      defaultOutputFormat: 'jpg',
      lockedOutputFormat: 'jpg',
      lockedInputFormat: 'png',
      acceptOverride: 'image/png,image/*',
      title: 'Convert PNG to JPG',
      description:
        'Upload a PNG image. The output is locked to JPG for this tool — just pick a quality and convert. Transparent areas are flattened onto a solid background because JPG has no alpha channel.',
    },
    intro:
      'PNG is a lossless format, which makes it perfect for screenshots and graphics but often far larger than it needs to be for photos. Converting PNG to JPG can shrink a file by 5–10× with no visible difference for photographic content. Media Manipulator converts your PNG to a clean JPG at the quality you choose — free, online, and with no signup.',
    whatItDoes: [
      'Converts any .png image to a standard .jpg (JPEG) file.',
      'Lets you pick JPG quality so you can balance file size against fidelity.',
      'Flattens transparency onto a solid background, since JPG has no alpha channel.',
      'The pixels you see stay the same; only the file is re-encoded from PNG into JPG.',
    ],
    flowSteps: [
      { title: 'Upload PNG', description: 'Drop in a .png screenshot, graphic, or photo.' },
      { title: 'Pick JPG quality', description: '85 is a balanced default; lower it for smaller files.' },
      { title: 'Encode JPG', description: 'ImageMagick re-encodes your image as a JPEG.' },
      { title: 'Download JPG', description: 'Save a smaller, universally compatible .jpg file.' },
    ],
    advancedDetails: [
      'Quality 85 is the long-standing sweet spot — above ~92 you mostly add file size with little visible gain.',
      'A photographic PNG often drops from several megabytes to a few hundred kilobytes as a JPG.',
      'For graphics with sharp edges or text, PNG or WebP usually look cleaner than JPG at the same size.',
      'If your PNG has transparency you want to keep, convert to WebP instead — JPG cannot store an alpha channel.',
    ],
    whyItMatters: [
      'JPG is the most universally accepted photo format — every device, editor, and upload form takes it.',
      'Smaller JPGs load faster on the web and stay under email and form upload limits.',
      'Many print labs, marketplaces, and stock sites accept JPG only.',
    ],
    useCases: [
      { title: 'Shrinking screenshots', description: 'Turn a heavy PNG screenshot into a lightweight JPG for email or chat.' },
      { title: 'Uploading photos', description: 'Convert a photographic PNG to JPG to meet a site’s format requirement.' },
      { title: 'Print and photo labs', description: 'Most labs require JPG — convert before you order.' },
      { title: 'Faster web pages', description: 'Replace large PNG photos with compact JPGs to cut page weight.' },
    ],
    whyMediaManipulator: [
      'Output is genuinely locked to JPG, so there’s nothing to misconfigure.',
      'Precise quality control instead of a one-size-fits-all preset.',
    ],
    privacyNote: privacyNoteFor('image', 'Your PNG is re-encoded as a JPG at the quality you set, on our server, and any transparency is flattened onto a solid background.'),
    supportedFormats: {
      supportedInputFormats: ['png'],
      supportedOutputFormats: ['jpg'],
      processingNotes: [
        'Transparent PNG areas are flattened onto a solid background because JPG has no transparency.',
      ],
    },
    faq: [
      {
        question: 'How do I convert a PNG to JPG for free?',
        answer:
          'Upload your .png above, choose a JPG quality, and click convert. The download is a standard .jpg file.',
      },
      {
        question: 'Will converting PNG to JPG reduce quality?',
        answer:
          'JPG is lossy, so there is a small quality trade-off. At quality 85–90 the difference is invisible for photos. For graphics with sharp text, keep PNG or use WebP.',
      },
      {
        question: 'What happens to transparency when I convert PNG to JPG?',
        answer:
          'JPG does not support transparency, so transparent areas are flattened onto a solid background. If you need to keep transparency, convert PNG to WebP instead.',
      },
      {
        question: 'Why is my PNG so much bigger than the JPG?',
        answer:
          'PNG is lossless and stores every pixel exactly, which is large for photos. JPG uses perceptual compression, so photographic images shrink dramatically with little visible change.',
      },
    ],
    related: [
      { label: 'Convert JPG to PNG', to: '/tools/convert-jpg-to-png', description: 'Go the other way and add a transparent-capable PNG.' },
      { label: 'Image converter', to: '/tools/image-converter', description: 'Convert between JPG, PNG, WebP, AVIF and more.' },
      { label: 'Compress image', to: '/tools/compress-image', description: 'Shrink the JPG further without changing format.' },
      { label: 'Image converter tutorial', to: '/tutorials/image/getting-started', description: 'Walk through every image option in detail.' },
    ],
    primaryKeyword: 'convert PNG to JPG',
    secondaryKeywords: [
      'PNG to JPG',
      'PNG to JPEG',
      'change PNG to JPG',
      '.png to .jpg',
      'PNG to JPG converter free',
    ],
  },
  {
    slug: 'convert-jpg-to-png',
    name: 'Convert JPG to PNG',
    h1: 'Convert JPG to PNG Online Free',
    tagline:
      'Turn JPG photos into lossless PNG files ready for editing, transparency, and high-quality graphics work.',
    metaTitle: 'Convert JPG to PNG Online Free | Media Manipulator',
    metaDescription:
      `Free online JPG to PNG converter. Turn .jpg photos into lossless PNG files for editing, transparency, and graphics. No signup. ${RETENTION_PROMISE}.`,
    ogTitle: 'Convert JPG to PNG Online Free',
    ogDescription:
      'Turn JPG photos into lossless PNG files for editing and graphics. Free, fast, no signup.',
    category: 'image',
    embed: {
      defaultMediaKind: 'image',
      defaultTask: 'jpg_to_png',
      defaultOutputFormat: 'png',
      lockedOutputFormat: 'png',
      lockedInputFormat: 'jpg',
      acceptOverride: 'image/jpeg,image/*',
      title: 'Convert JPG to PNG',
      description:
        'Upload a JPG image. The output is locked to PNG for this tool, so you get a lossless file ready for editing or layering on a transparent canvas.',
    },
    intro:
      'PNG is a lossless format that never adds compression artifacts, which makes it ideal once you start editing an image, adding transparency, or layering graphics. Converting a JPG to PNG locks in the current pixels so further edits don’t degrade quality. Media Manipulator converts your JPG to a clean PNG online, free, with no signup.',
    whatItDoes: [
      'Converts any .jpg/.jpeg image to a lossless .png file.',
      'Preserves the exact current pixels so repeated editing won’t add artifacts.',
      'Produces a PNG you can later layer, mask, or make transparent in an editor.',
      'Every pixel of the JPG is kept exactly; the PNG stores them without further loss.',
    ],
    flowSteps: [
      { title: 'Upload JPG', description: 'Drop in a .jpg or .jpeg photo.' },
      { title: 'Convert to PNG', description: 'We re-encode the image losslessly as PNG.' },
      { title: 'Encode PNG', description: 'ImageMagick writes a standard 24/32-bit PNG.' },
      { title: 'Download PNG', description: 'Save a lossless .png ready for editing.' },
    ],
    advancedDetails: [
      'PNG is lossless, so the converted file will usually be larger than the source JPG — that is expected.',
      'Converting JPG to PNG does not recover detail the JPG already discarded; it freezes the current pixels losslessly.',
      'PNG supports an alpha channel, so the result is ready for you to add transparency in an editor.',
      'For the smallest lossless web files, WebP (lossless) is often smaller than PNG.',
    ],
    whyItMatters: [
      'Lossless PNG is the right working format once an image will be edited repeatedly.',
      'Design tools, app assets, and UI work expect PNG for crisp edges and transparency support.',
      'PNG avoids the generation-loss that happens when you re-save a JPG over and over.',
    ],
    useCases: [
      { title: 'Editing prep', description: 'Convert a JPG to PNG before retouching so edits stay lossless.' },
      { title: 'Adding transparency', description: 'Get a PNG canvas ready to cut out a background.' },
      { title: 'UI and app assets', description: 'Most design systems expect PNG for icons and graphics.' },
      { title: 'Document embedding', description: 'Use PNG where crisp text and lines matter more than file size.' },
    ],
    whyMediaManipulator: [
      'Output is genuinely locked to PNG, so the result is always lossless.',
      'Runs on our own servers — no third-party processing of your image.',
    ],
    privacyNote: privacyNoteFor('image', 'Your JPG is decoded on our server and written out as a lossless PNG of exactly the same pixels.'),
    supportedFormats: {
      supportedInputFormats: ['jpg', 'jpeg'],
      supportedOutputFormats: ['png'],
      processingNotes: [
        'PNG is lossless, so the output is usually larger than the source JPG.',
      ],
    },
    faq: [
      {
        question: 'How do I convert a JPG to PNG for free?',
        answer:
          'Upload your .jpg above and click convert — the output is a lossless .png. It is free, requires no signup, and works in your browser.',
      },
      {
        question: 'Does converting JPG to PNG improve quality?',
        answer:
          'No. The conversion is lossless but it cannot recover detail the JPG already discarded. It freezes the current pixels so future edits stay artifact-free.',
      },
      {
        question: 'Will the PNG be bigger than my JPG?',
        answer:
          'Usually yes. PNG stores every pixel exactly with no lossy compression, so a photographic PNG is typically larger than the equivalent JPG.',
      },
      {
        question: 'Can I add transparency after converting to PNG?',
        answer:
          'Yes. PNG supports an alpha channel, so once you have the PNG you can erase or cut out a background in any image editor.',
      },
    ],
    related: [
      { label: 'Convert PNG to JPG', to: '/tools/convert-png-to-jpg', description: 'Go the other way and shrink a PNG into a JPG.' },
      { label: 'Image converter', to: '/tools/image-converter', description: 'Convert between JPG, PNG, WebP, AVIF and more.' },
      { label: 'Remove background from image', to: '/tools/remove-background-from-image', description: 'Make a transparent PNG cutout automatically.' },
      { label: 'Image converter tutorial', to: '/tutorials/image/getting-started', description: 'Walk through every image option in detail.' },
    ],
    primaryKeyword: 'convert JPG to PNG',
    secondaryKeywords: [
      'JPG to PNG',
      'JPEG to PNG',
      'change JPG to PNG',
      '.jpg to .png',
      'JPG to PNG converter free',
    ],
  },
  {
    slug: 'convert-webp-to-png',
    name: 'Convert WebP to PNG',
    h1: 'Convert WebP to PNG Online Free',
    tagline:
      'Turn WebP images into lossless PNG files that open everywhere and keep full transparency.',
    metaTitle: 'Convert WebP to PNG Online Free | Media Manipulator',
    metaDescription:
      `Free online WebP to PNG converter. Turn .webp images into lossless PNG files that keep transparency and open in any editor. No signup. ${RETENTION_PROMISE}.`,
    ogTitle: 'Convert WebP to PNG Online Free',
    ogDescription:
      'Turn WebP images into lossless, transparency-preserving PNG files. Free, fast, no signup.',
    category: 'image',
    embed: {
      defaultMediaKind: 'image',
      defaultTask: 'webp_to_png',
      defaultOutputFormat: 'png',
      lockedOutputFormat: 'png',
      lockedInputFormat: 'webp',
      acceptOverride: 'image/webp,image/*',
      title: 'Convert WebP to PNG',
      description:
        'Upload a WebP image. The output is locked to PNG for this tool, so transparency is preserved and the file opens in any image editor or viewer.',
    },
    intro:
      'WebP is great for the web, but plenty of editors, older software, and design tools still expect PNG — and unlike JPG, PNG keeps full transparency. Media Manipulator converts your WebP to a clean, lossless PNG so it opens everywhere and your alpha channel survives.',
    whatItDoes: [
      'Converts any .webp image to a lossless .png file.',
      'Preserves the alpha channel so transparent WebPs stay transparent.',
      'Produces a PNG that opens in any editor, viewer, or design tool.',
      'The picture is unchanged; WebP compression is swapped for lossless PNG storage.',
    ],
    flowSteps: [
      { title: 'Upload WebP', description: 'Drop in a .webp file, transparent or solid.' },
      { title: 'Convert to PNG', description: 'We decode the WebP and re-encode it as PNG.' },
      { title: 'Encode PNG', description: 'ImageMagick writes a lossless 24/32-bit PNG.' },
      { title: 'Download PNG', description: 'Save a transparency-preserving .png file.' },
    ],
    advancedDetails: [
      'Transparency in the source WebP is preserved as a PNG alpha channel.',
      'Only the first frame of an animated WebP becomes a still PNG — for animation, convert to GIF instead.',
      'PNG is lossless, so the output is usually larger than the source WebP; that is the cost of universal compatibility and lossless storage.',
    ],
    whyItMatters: [
      'Some editors, presentation tools, and older software still cannot open WebP.',
      'PNG keeps transparency, which JPG cannot — important for logos and cutouts.',
      'PNG is a safe, lossless interchange format for graphics work.',
    ],
    useCases: [
      { title: 'Opening WebP in editors', description: 'Convert to PNG so an editor that lacks WebP support can open it.' },
      { title: 'Keeping transparency', description: 'Preserve a transparent WebP logo as a transparent PNG.' },
      { title: 'Design handoffs', description: 'Hand a PNG to tools or teammates that expect PNG assets.' },
      { title: 'Presentations', description: 'Drop a PNG into slide software that won’t accept WebP.' },
    ],
    whyMediaManipulator: [
      'Output is locked to PNG with transparency preserved automatically.',
      'Runs on our own servers — no third-party processing of your image.',
    ],
    privacyNote: privacyNoteFor('image', 'Your WebP is decoded on our server and saved as a lossless PNG, keeping its transparency.'),
    supportedFormats: {
      supportedInputFormats: ['webp'],
      supportedOutputFormats: ['png'],
      processingNotes: [
        'Transparency is preserved. Only the first frame of an animated WebP is converted.',
      ],
    },
    faq: [
      {
        question: 'How do I convert WebP to PNG for free?',
        answer:
          'Upload your .webp above and click convert. The download is a lossless .png with transparency preserved. It is free and needs no signup.',
      },
      {
        question: 'Does WebP to PNG keep transparency?',
        answer:
          'Yes. If your WebP has a transparent background, the resulting PNG keeps that alpha channel intact.',
      },
      {
        question: 'Why convert WebP to PNG instead of JPG?',
        answer:
          'PNG is lossless and preserves transparency, while JPG flattens transparency and adds compression. Choose PNG when you need transparency or lossless graphics; choose JPG for the smallest photo files.',
      },
      {
        question: 'Can I convert an animated WebP?',
        answer:
          'Only the first frame becomes a PNG. For animation, convert the WebP to an animated GIF instead.',
      },
    ],
    related: [
      { label: 'Convert PNG to WebP', to: '/tools/convert-png-to-webp', description: 'Go the other way and shrink a PNG into a WebP.' },
      { label: 'Convert WebP to JPG', to: '/tools/convert-webp-to-jpg', description: 'Convert WebP to a compact JPG instead.' },
      { label: 'Image converter', to: '/tools/image-converter', description: 'Convert between JPG, PNG, WebP, AVIF and more.' },
      { label: 'Compress image', to: '/tools/compress-image', description: 'Shrink an image without re-format hassle.' },
    ],
    primaryKeyword: 'convert WebP to PNG',
    secondaryKeywords: [
      'WebP to PNG',
      'change WebP to PNG',
      '.webp to .png',
      'WebP to PNG transparent',
      'WebP to PNG converter free',
    ],
  },
  {
    slug: 'convert-png-to-webp',
    name: 'Convert PNG to WebP',
    h1: 'Convert PNG to WebP Online Free',
    tagline:
      'Shrink PNG graphics into modern WebP files that load faster on the web and keep full transparency.',
    metaTitle: 'Convert PNG to WebP Online Free | Media Manipulator',
    metaDescription:
      `Free online PNG to WebP converter. Shrink .png files into smaller WebP images for faster websites while keeping transparency. No signup. ${RETENTION_PROMISE}.`,
    ogTitle: 'Convert PNG to WebP Online Free',
    ogDescription:
      'Shrink PNG graphics into smaller, transparency-preserving WebP files for faster websites. Free, no signup.',
    category: 'image',
    embed: {
      defaultMediaKind: 'image',
      defaultTask: 'png_to_webp',
      defaultOutputFormat: 'webp',
      lockedOutputFormat: 'webp',
      lockedInputFormat: 'png',
      acceptOverride: 'image/png,image/*',
      title: 'Convert PNG to WebP',
      description:
        'Upload a PNG image. The output is locked to WebP for this tool — pick a quality and convert. Transparency is preserved, and WebP files are typically much smaller than PNG.',
    },
    intro:
      'WebP is the modern web image format: it produces dramatically smaller files than PNG while preserving transparency, which means faster pages and better Core Web Vitals. Media Manipulator converts your PNG to WebP at the quality you choose — free, online, with transparency kept intact and no signup required.',
    whatItDoes: [
      'Converts any .png image to a modern .webp file.',
      'Preserves the alpha channel so transparent PNGs stay transparent.',
      'Lets you pick quality to balance file size against fidelity.',
      'Typically produces files 25–80% smaller than the source PNG.',
    ],
    flowSteps: [
      { title: 'Upload PNG', description: 'Drop in a .png graphic, icon, or screenshot.' },
      { title: 'Pick WebP quality', description: '80–85 is a great default for web use.' },
      { title: 'Encode WebP', description: 'ImageMagick re-encodes your image as WebP.' },
      { title: 'Download WebP', description: 'Save a smaller, transparency-preserving .webp file.' },
    ],
    advancedDetails: [
      'WebP supports both lossy and lossless modes; at quality ~80 it usually beats PNG file size by a wide margin while staying visually clean.',
      'Transparency is preserved, so logos and UI assets keep their alpha channel.',
      'WebP is supported by every modern browser — serve it directly for faster page loads.',
      'For maximum compatibility with very old software, keep a PNG fallback.',
    ],
    whyItMatters: [
      'Smaller images are the single biggest lever for faster page loads and better SEO.',
      'WebP keeps transparency, so you don’t have to trade alpha for size like you would with JPG.',
      'Google’s Core Web Vitals reward lighter pages — WebP helps directly.',
    ],
    useCases: [
      { title: 'Faster websites', description: 'Replace heavy PNG assets with WebP to cut page weight.' },
      { title: 'Transparent logos', description: 'Shrink a transparent PNG logo while keeping its alpha channel.' },
      { title: 'App and UI assets', description: 'Ship lighter graphics without losing crispness.' },
      { title: 'Image-heavy galleries', description: 'Convert a batch of PNGs to WebP for a snappier gallery.' },
    ],
    whyMediaManipulator: [
      'Output is locked to WebP with transparency preserved.',
      'Precise quality control so you decide the size/fidelity trade-off.',
    ],
    privacyNote: privacyNoteFor('image', 'Your PNG is re-encoded as WebP on our server at the quality you choose, with its transparency kept.'),
    supportedFormats: {
      supportedInputFormats: ['png'],
      supportedOutputFormats: ['webp'],
      processingNotes: [
        'Transparency is preserved in the WebP output.',
      ],
    },
    faq: [
      {
        question: 'How do I convert PNG to WebP for free?',
        answer:
          'Upload your .png above, pick a quality, and click convert. The download is a .webp file. It is free and requires no signup.',
      },
      {
        question: 'Does PNG to WebP keep transparency?',
        answer:
          'Yes. WebP supports an alpha channel, so transparent PNGs stay transparent after conversion.',
      },
      {
        question: 'How much smaller will the WebP be?',
        answer:
          'It depends on the image, but WebP is commonly 25–80% smaller than the source PNG at a visually similar quality.',
      },
      {
        question: 'Is WebP supported everywhere?',
        answer:
          'Every modern browser supports WebP. A few older or niche programs do not — keep a PNG fallback if you need to support them.',
      },
    ],
    related: [
      { label: 'Convert WebP to PNG', to: '/tools/convert-webp-to-png', description: 'Go the other way back to a lossless PNG.' },
      { label: 'Convert JPG to WebP', to: '/tools/convert-jpg-to-webp', description: 'Shrink JPG photos into WebP for the web.' },
      { label: 'Compress image', to: '/tools/compress-image', description: 'Shrink images further without changing format.' },
      { label: 'Image converter', to: '/tools/image-converter', description: 'Convert between JPG, PNG, WebP, AVIF, and GIF.' },
      { label: 'Image converter tutorial', to: '/tutorials/image/getting-started', description: 'Walk through every image option in detail.' },
    ],
    primaryKeyword: 'convert PNG to WebP',
    secondaryKeywords: [
      'PNG to WebP',
      'change PNG to WebP',
      '.png to .webp',
      'PNG to WebP transparent',
      'PNG to WebP converter free',
    ],
  },
  {
    slug: 'convert-jpg-to-webp',
    name: 'Convert JPG to WebP',
    h1: 'Convert JPG to WebP Online Free',
    tagline:
      'Shrink JPG photos into modern WebP files that load faster on the web at the same visual quality.',
    metaTitle: 'Convert JPG to WebP Online Free | Media Manipulator',
    metaDescription:
      `Free online JPG to WebP converter. Shrink .jpg photos into smaller WebP images for faster websites at the quality you choose. No signup. ${RETENTION_PROMISE}.`,
    ogTitle: 'Convert JPG to WebP Online Free',
    ogDescription:
      'Shrink JPG photos into smaller WebP files for faster websites at the same visual quality. Free, no signup.',
    category: 'image',
    embed: {
      defaultMediaKind: 'image',
      defaultTask: 'jpg_to_webp',
      defaultOutputFormat: 'webp',
      lockedOutputFormat: 'webp',
      lockedInputFormat: 'jpg',
      acceptOverride: 'image/jpeg,image/*',
      title: 'Convert JPG to WebP',
      description:
        'Upload a JPG image. The output is locked to WebP for this tool — pick a quality and convert. WebP usually produces a smaller file than JPG at the same visual quality.',
    },
    intro:
      'WebP delivers the same visual quality as JPG in a noticeably smaller file, which is why it has become the default image format for fast websites. Media Manipulator converts your JPG to WebP at the quality you choose, so your photos look the same but load faster.',
    whatItDoes: [
      'Converts any .jpg/.jpeg photo to a modern .webp file.',
      'Lets you choose WebP quality to balance file size against fidelity.',
      'Typically produces files 25–35% smaller than the source JPG at equal quality.',
      'The photo looks the same; its bytes are re-encoded with WebP to make the file smaller.',
    ],
    flowSteps: [
      { title: 'Upload JPG', description: 'Drop in a .jpg or .jpeg photo.' },
      { title: 'Pick WebP quality', description: '80–85 closely matches typical JPG quality.' },
      { title: 'Encode WebP', description: 'ImageMagick re-encodes your photo as WebP.' },
      { title: 'Download WebP', description: 'Save a smaller .webp ready for the web.' },
    ],
    advancedDetails: [
      'At equivalent visual quality, WebP is commonly 25–35% smaller than JPG thanks to more modern compression.',
      'Avoid stacking heavy compression: re-encoding an already-lossy JPG at very low WebP quality can compound artifacts.',
      'WebP is supported by every modern browser — serve it directly to speed up page loads.',
      'For maximum compatibility with very old software, keep a JPG fallback.',
    ],
    whyItMatters: [
      'Lighter images directly improve page-load time, bounce rate, and SEO.',
      'WebP gets you JPG-like quality at a smaller size with one conversion.',
      'Core Web Vitals reward smaller images — WebP is a quick win.',
    ],
    useCases: [
      { title: 'Faster websites', description: 'Convert hero and gallery JPGs to WebP to cut page weight.' },
      { title: 'E-commerce catalogs', description: 'Shrink product photos so listings load instantly.' },
      { title: 'Blogs and articles', description: 'Serve lighter inline images without visible quality loss.' },
      { title: 'Email-friendly photos', description: 'Get smaller files that stay under attachment limits.' },
    ],
    whyMediaManipulator: [
      'Output is locked to WebP, so there’s nothing to misconfigure.',
      'Precise quality control instead of a fixed preset.',
    ],
    privacyNote: privacyNoteFor('image', 'Your JPG is re-encoded as a smaller WebP on our server at the quality you choose.'),
    supportedFormats: {
      supportedInputFormats: ['jpg', 'jpeg'],
      supportedOutputFormats: ['webp'],
      processingNotes: [
        'JPG has no transparency, so the WebP output is fully opaque.',
      ],
    },
    faq: [
      {
        question: 'How do I convert JPG to WebP for free?',
        answer:
          'Upload your .jpg above, pick a quality, and click convert. The download is a .webp file. It is free and requires no signup.',
      },
      {
        question: 'Is WebP better than JPG?',
        answer:
          'For the web, usually yes — WebP delivers similar quality at a smaller size. JPG still wins on universal compatibility with very old software.',
      },
      {
        question: 'How much smaller is WebP than JPG?',
        answer:
          'At equivalent visual quality, WebP is commonly 25–35% smaller than JPG, though the exact savings depend on the image.',
      },
      {
        question: 'Will converting JPG to WebP lose quality?',
        answer:
          'Both formats are lossy. At quality 80–85 the result looks the same as the JPG. Avoid setting WebP quality very low to prevent compounding artifacts.',
      },
    ],
    related: [
      { label: 'Convert WebP to JPG', to: '/tools/convert-webp-to-jpg', description: 'Go the other way back to a universal JPG.' },
      { label: 'Convert PNG to WebP', to: '/tools/convert-png-to-webp', description: 'Shrink PNG graphics into WebP for the web.' },
      { label: 'Compress image', to: '/tools/compress-image', description: 'Shrink images further without changing format.' },
      { label: 'Image converter', to: '/tools/image-converter', description: 'Convert between JPG, PNG, WebP, AVIF, and GIF.' },
      { label: 'Image converter tutorial', to: '/tutorials/image/getting-started', description: 'Walk through every image option in detail.' },
    ],
    primaryKeyword: 'convert JPG to WebP',
    secondaryKeywords: [
      'JPG to WebP',
      'JPEG to WebP',
      'change JPG to WebP',
      '.jpg to .webp',
      'JPG to WebP converter free',
    ],
  },

  // ------------------------------------------------------------- IMAGE: HUB CONVERTERS
  {
    slug: 'jpg-converter',
    name: 'JPG Converter',
    h1: 'Free JPG Converter Online',
    tagline:
      "Convert images to JPG: the image converter with JPG preselected.",
    metaTitle: 'Free JPG Converter Online | Media Manipulator',
    metaDescription:
      `Free online JPG converter. Convert PNG, WebP, and GIF images into universally compatible JPG files at the quality you choose. No signup. ${RETENTION_PROMISE}.`,
    ogTitle: 'Free JPG Converter Online',
    ogDescription:
      'Convert PNG, WebP, GIF, and more into universally compatible JPG photos. Free, fast, no signup.',
    category: 'image',
    embed: {
      defaultMediaKind: 'image',
      defaultTask: 'jpg_converter',
      defaultOutputFormat: 'jpg',
      title: 'Convert an image to JPG',
      description:
        'Upload any image — PNG, WebP, GIF, and more — and JPG is preselected as the output. Pick a quality and convert. Transparency is flattened because JPG has no alpha channel.',
    },
    intro:
      "This page opens the Media Manipulator image converter with JPG already chosen as the output. That is the only difference. You can still switch to PNG, WebP, AVIF or GIF before converting, and the same quality, resize and crop controls are on the form. JPG is the safest format to send a photo anywhere, but it has no transparency: a PNG logo or a cut-out with a transparent background is flattened onto a solid colour when it becomes a JPG, so keep those as PNG or WebP. The quality slider sets the JPEG encoder's quality; around 85 is a sensible default for photos, and lower values trade detail for size. The image converter page is the canonical version of this tool and covers each output format, the trade-offs between them and the upload limits for guests and free accounts. Upload an image below, check the quality and convert.",
    whatItDoes: [
      'Converts PNG, WebP, GIF, and other images to standard JPG.',
      'Preselects JPG as the output while still letting you change it.',
      'Lets you pick JPG quality to balance file size against fidelity.',
      'Flattens transparency onto a solid background, since JPG has no alpha channel.',
    ],
    flowSteps: [
      { title: 'Upload an image', description: 'Drop in any PNG, WebP, GIF, or other supported image.' },
      { title: 'Confirm JPG output', description: 'JPG is preselected; pick a quality you like.' },
      { title: 'Encode JPG', description: 'ImageMagick re-encodes your image as a JPEG.' },
      { title: 'Download JPG', description: 'Save a universally compatible .jpg file.' },
    ],
    advancedDetails: [
      'Quality 85 is a balanced default — push to 90+ for photos where fidelity matters most.',
      'JPG is ideal for photographs; for sharp text, line art, or transparency, PNG or WebP usually look better.',
      'Transparent areas are flattened to a solid background because JPG cannot store an alpha channel.',
    ],
    whyItMatters: [
      'JPG is the safest format when you don’t control what software the recipient uses.',
      'Smaller JPGs load faster and stay under email and upload limits.',
      'Print labs, marketplaces, and stock sites frequently require JPG.',
    ],
    useCases: [
      { title: 'Universal sharing', description: 'Convert any image to JPG so it opens on every device.' },
      { title: 'Meeting upload rules', description: 'Satisfy forms and sites that accept JPG only.' },
      { title: 'Printing', description: 'Produce a JPG that photo labs and print shops accept.' },
      { title: 'Web photos', description: 'Get compact JPGs for fast-loading photographic content.' },
    ],
    whyMediaManipulator: [
      'JPG preselected for one-click conversion, with full quality control.',
      'Handles PNG, WebP, GIF, and more in one place.',
      `Free, no signup, no watermarks. ${RETENTION_PROMISE}.`,
    ],
    privacyNote: sharedPrivacyNote,
    supportedFormats: {
      supportedInputFormats: ['png', 'webp', 'gif', 'jpg'],
      supportedOutputFormats: ['jpg'],
      processingNotes: [
        'Transparent areas are flattened because JPG has no transparency channel.',
      ],
    },
    faq: [
      {
        question: 'How do I convert an image to JPG for free?',
        answer:
          'Upload your image above — JPG is already selected as the output. Pick a quality and click convert. It is free with no signup.',
      },
      {
        question: 'What formats can I convert to JPG?',
        answer:
          'PNG, WebP, GIF, and other common image formats all convert cleanly to JPG.',
      },
      {
        question: 'What JPG quality should I use?',
        answer:
          '85 is a balanced default. Use 90+ for important photos and around 70 for thumbnails or previews.',
      },
      {
        question: 'Will transparency be kept?',
        answer:
          'No — JPG cannot store transparency, so transparent areas are flattened onto a solid background. Use the PNG converter or WebP if you need transparency.',
      },
      {
        question: 'Are my uploads stored?',
        answer:
          `No. Files are processed on our own servers. ${RETENTION_PROMISE}. No account is required.`,
      },
    ],
    related: [
      { label: 'Convert PNG to JPG', to: '/tools/convert-png-to-jpg', description: 'Focused PNG → JPG converter.' },
      { label: 'Convert WebP to JPG', to: '/tools/convert-webp-to-jpg', description: 'Focused WebP → JPG converter.' },
      { label: 'Convert HEIC to JPG', to: '/tools/convert-heic-to-jpg', description: 'Convert iPhone HEIC photos to JPG.' },
      { label: 'Convert AVIF to JPG', to: '/tools/convert-avif-to-jpg', description: 'Convert modern AVIF images to JPG.' },
      { label: 'Convert JPG to PDF', to: '/tools/convert-jpg-to-pdf', description: 'Wrap a JPG into a PDF document.' },
      { label: 'PNG converter', to: '/tools/png-converter', description: 'Convert any image to lossless PNG instead.' },
      { label: 'Compress image', to: '/tools/compress-image', description: 'Shrink your JPG even further.' },
      { label: 'Image converter', to: '/tools/image-converter', description: 'Convert between JPG, PNG, WebP, AVIF, and GIF.' },
    ],
    lastReviewed: '2026-10-29',
    primaryKeyword: 'JPG converter',
    secondaryKeywords: [
      'convert to JPG',
      'image to JPG',
      'JPEG converter',
      'free JPG converter online',
      'PNG to JPG converter',
    ],
  },
  {
    slug: 'png-converter',
    name: 'PNG Converter',
    h1: 'Free PNG Converter Online',
    tagline:
      "Convert images to PNG: the image converter with PNG preselected.",
    metaTitle: 'Free PNG Converter Online | Media Manipulator',
    metaDescription:
      `Free online PNG converter. Convert JPG, WebP, and GIF images into lossless PNG files with transparency support. No signup. ${RETENTION_PROMISE}.`,
    ogTitle: 'Free PNG Converter Online',
    ogDescription:
      'Convert JPG, WebP, GIF, and more into lossless, transparency-capable PNG files. Free, fast, no signup.',
    category: 'image',
    embed: {
      defaultMediaKind: 'image',
      defaultTask: 'png_converter',
      defaultOutputFormat: 'png',
      title: 'Convert an image to PNG',
      description:
        'Upload any image — JPG, WebP, GIF, and more — and PNG is preselected as the output. PNG is lossless and keeps transparency where the source has it.',
    },
    intro:
      "This page is the Media Manipulator image converter with PNG preselected as the output, and nothing else about it is different. You can switch the output to JPG, WebP, AVIF or GIF if you change your mind, and the resize and crop controls are the same. PNG is lossless and keeps transparency, which makes it right for screenshots, diagrams, logos and anything with sharp text. It is the wrong choice for photographs if size matters: a phone photo saved as PNG is usually several times larger than the JPG it came from, and converting a JPG to PNG does not bring back detail the JPG already discarded; it only stops further loss. For transparency with smaller files, WebP is often the better target. The image converter page is the canonical version of this tool, with the full comparison of formats and the per-plan limits. Upload an image below to convert it to PNG.",
    whatItDoes: [
      'Converts JPG, WebP, GIF, and other images to lossless PNG.',
      'Preselects PNG as the output while still letting you change it.',
      'Preserves transparency when the source image has an alpha channel.',
      'Produces a PNG that opens in any editor, viewer, or design tool.',
    ],
    flowSteps: [
      { title: 'Upload an image', description: 'Drop in any JPG, WebP, GIF, or other supported image.' },
      { title: 'Confirm PNG output', description: 'PNG is preselected — no quality setting needed.' },
      { title: 'Encode PNG', description: 'ImageMagick writes a lossless 24/32-bit PNG.' },
      { title: 'Download PNG', description: 'Save a lossless, transparency-capable .png file.' },
    ],
    advancedDetails: [
      'PNG is lossless, so the output is usually larger than a JPG or WebP source — that is the trade-off for lossless storage and transparency.',
      'Converting a JPG to PNG cannot recover detail the JPG already discarded; it freezes the current pixels losslessly.',
      'WebP with transparency converts to PNG with its alpha channel preserved.',
    ],
    whyItMatters: [
      'Lossless PNG is the right format for editing, graphics, and transparency.',
      'Design tools and app pipelines expect PNG for crisp edges and alpha support.',
      'PNG avoids the generation loss that comes from repeatedly re-saving JPGs.',
    ],
    useCases: [
      { title: 'Graphics and logos', description: 'Convert to PNG to keep crisp edges and transparency.' },
      { title: 'Editing prep', description: 'Move to a lossless PNG before retouching.' },
      { title: 'App and UI assets', description: 'Produce PNGs that design systems expect.' },
      { title: 'Screenshots', description: 'Keep text and lines sharp with lossless PNG.' },
    ],
    whyMediaManipulator: [
      'PNG preselected for one-click, always-lossless conversion.',
      'Handles JPG, WebP, GIF, and more in one place, with transparency preserved.',
      `Free, no signup, no watermarks. ${RETENTION_PROMISE}.`,
    ],
    privacyNote: sharedPrivacyNote,
    supportedFormats: {
      supportedInputFormats: ['jpg', 'jpeg', 'webp', 'gif'],
      supportedOutputFormats: ['png'],
      processingNotes: [
        'PNG is lossless, so output is usually larger than the source. Transparency is preserved when present.',
      ],
    },
    faq: [
      {
        question: 'How do I convert an image to PNG for free?',
        answer:
          'Upload your image above — PNG is already selected as the output. Click convert and download a lossless .png. It is free with no signup.',
      },
      {
        question: 'What formats can I convert to PNG?',
        answer:
          'JPG, WebP, GIF, and other common image formats all convert cleanly to lossless PNG.',
      },
      {
        question: 'Does the PNG keep transparency?',
        answer:
          'Yes, when the source has transparency (such as a transparent WebP or GIF), the PNG preserves the alpha channel. A JPG source has no transparency to keep.',
      },
      {
        question: 'Why is my PNG larger than the original?',
        answer:
          'PNG is lossless and stores every pixel exactly, so it is typically larger than a lossy JPG or WebP source. That is expected.',
      },
      {
        question: 'Are my uploads kept?',
        answer:
          `No. Files are processed on our own servers. ${RETENTION_PROMISE}. No account is required.`,
      },
    ],
    related: [
      { label: 'Convert JPG to PNG', to: '/tools/convert-jpg-to-png', description: 'Focused JPG → PNG converter.' },
      { label: 'Convert WebP to PNG', to: '/tools/convert-webp-to-png', description: 'Focused WebP → PNG converter.' },
      { label: 'Convert AVIF to PNG', to: '/tools/convert-avif-to-png', description: 'Convert AVIF images to lossless PNG.' },
      { label: 'PNG to ICO', to: '/tools/png-to-ico', description: 'Turn a PNG into a multi-size favicon.' },
      { label: 'Convert PNG to SVG', to: '/tools/convert-png-to-svg', description: 'Vectorize a PNG logo into SVG.' },
      { label: 'Convert PNG to PDF', to: '/tools/convert-png-to-pdf', description: 'Wrap a PNG into a PDF document.' },
      { label: 'JPG converter', to: '/tools/jpg-converter', description: 'Convert any image to JPG instead.' },
      { label: 'Remove background from image', to: '/tools/remove-background-from-image', description: 'Make a transparent PNG cutout automatically.' },
      { label: 'Image converter', to: '/tools/image-converter', description: 'Convert between JPG, PNG, WebP, AVIF, and GIF.' },
    ],
    lastReviewed: '2026-10-29',
    primaryKeyword: 'PNG converter',
    secondaryKeywords: [
      'convert to PNG',
      'image to PNG',
      'free PNG converter online',
      'JPG to PNG converter',
      'WebP to PNG converter',
    ],
  },

  // ------------------------------------------------------------- IMAGE: RESIZE / COMPRESS / AI
  {
    slug: 'image-resizer',
    lastReviewed: '2026-10-29',
    name: 'Image Resizer',
    h1: 'Resize Image Online Free',
    tagline:
      'Resize JPG, PNG, WebP, and GIF images to exact pixel dimensions while keeping the aspect ratio.',
    metaTitle: 'Resize Image Online Free | Media Manipulator',
    metaDescription:
      `Free online image resizer. Resize JPG, PNG, WebP, and GIF images to exact pixel dimensions while keeping the aspect ratio. No signup. ${RETENTION_PROMISE}.`,
    ogTitle: 'Resize Image Online Free',
    ogDescription:
      'Resize JPG, PNG, WebP, and GIF images to exact pixel dimensions. Free, fast, no signup.',
    category: 'image',
    embed: {
      defaultMediaKind: 'image',
      defaultTask: 'image_resizer',
      emphasizeResize: true,
      title: 'Resize an image',
      description:
        'Upload an image and set a target width and/or height below. Leave one blank to scale proportionally and keep the original aspect ratio. The output format stays the same unless you change it.',
    },
    intro:
      'This page opens the image converter with the resize fields in front. Type a width, a height, or both, and the server runs ImageMagick with a -resize argument built from exactly what you typed: 1600x for a width alone, x900 for a height alone, and 1600x900! when you fill in both. That trailing exclamation mark matters: it tells ImageMagick to produce that precise box even if the ratio differs from the original, which stretches the picture. So the rule is simple. One field keeps the proportions; two fields give you the exact size and trust you to have chosen a matching ratio or to have cropped first.',
    whatItDoes: [
      'Scales JPG, PNG, WebP and GIF images to the pixel width and height you type, after auto-orienting them from the EXIF rotation flag.',
      'Keeps the aspect ratio when only one dimension is filled in; forces the exact box when both are.',
      'Offers a crop box in the same form, applied before the resize, which is how you get an exact square or banner without distortion.',
      'Writes the output in the original format by default, with a quality of 85 for JPG and WebP, and copies the original metadata tags onto it.',
      'Caps the requested height to your plan output limit and the dimensions to what ImageMagick is allowed to produce.',
    ],
    flowSteps: [
      { title: 'Upload the image', description: 'JPG, PNG, WebP or GIF, up to the per-file cap for your plan.' },
      { title: 'Type width, height or both', description: 'One value keeps the ratio. Two values force the box. Crop first if the ratio must change.' },
      { title: 'ImageMagick resizes', description: 'convert input -auto-orient [-crop WxH+X+Y] -resize <arg> [-quality 85] output.' },
      { title: 'Download', description: 'The resized file is served from the job output folder as converted.<format>.' },
    ],
    advancedDetails: [
      'The resize argument is built in convertImage (converter.go): both values give WxH! (force exact), width alone gives Wx, height alone gives xH. ImageMagick\'s default resampling filter is used; there is no option to pick a different one.',
      'A crop, when set, is passed as -crop WxH+X+Y and runs before -resize, so crop coordinates refer to the auto-oriented original, not to the resized result.',
      'The server rejects a width or height above 10000 or below 1, and the form caps both fields at 4096.',
      'An explicit height is also checked against your plan output-height cap before the upload is accepted: 1080 px for guests by default, 1440 with a free account, 2160 on Premium and Pro. A request above the cap is refused with a message naming both numbers and no unit is spent. Width alone is not checked.',
      'JPG and WebP output receive -quality 85 unless you change the number; PNG and GIF ignore it. Enlarging with this tool only interpolates existing pixels, so a 2x or 4x enlargement looks soft; the AI upscaler exists for that case.',
      'After ImageMagick finishes, exiftool copies the original tags onto the result in the default metadata mode, so the resized file still carries the capture date, camera model and any GPS position.',
    ],
    whyItMatters: [
      'Avatar, cover and thumbnail slots want specific pixel sizes, and a platform resize is usually a lower-quality, uncontrolled one.',
      'Pixel count is the single biggest factor in file size; a 24-megapixel photo displayed at 1920 px wide carries ten times the data the screen can show.',
      'Resizing on your terms also lets you choose the crop, instead of letting a square slot chop a head off.',
    ],
    useCases: [
      { title: 'Profile pictures and avatars', description: 'Crop to a square, then resize to the 400 or 512 px the service asks for.' },
      { title: 'Web and blog images', description: 'Scale camera photos to the column width they will actually be displayed at.' },
      { title: 'Banners and headers', description: 'Cut the exact aspect ratio, then hit the required width to the pixel.' },
      { title: 'Form upload limits', description: 'Drop the dimensions to get under a megapixel or megabyte cap.' },
    ],
    whyMediaManipulator: [
      'The exact-box versus keep-ratio behaviour is spelled out here with the real ImageMagick arguments, so there is no surprise when a photo comes back stretched.',
      'Crop, resize, format and quality are one upload, and the output carries no watermark.',
      `No signup for the standard tool. ${RETENTION_PROMISE}.`,
    ],
    privacyNote: `The uploaded picture is saved under uploads/<jobId>/ on our server and the resized copy under outputs/<jobId>/; both directories are on the retention ledger and are removed together. Because the default metadata mode copies the original tags onto the resized file with exiftool, GPS coordinates and the camera serial number travel with the result unless you pick strip in the metadata section of the form. Images uploaded for resizing also go through the automated analysis that runs on every image on our server, using a local vision model, with the summary stored in the job folder. ${RETENTION_PROMISE}. No third party receives the file.`,
    supportedFormats: {
      supportedInputFormats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
      supportedOutputFormats: ['jpg', 'png', 'webp', 'gif'],
      processingNotes: [
        'Leave one dimension blank to scale proportionally and keep the aspect ratio.',
      ],
    },
    faq: [
      {
        question: 'Does resizing cost anything?',
        answer:
          'No account and no payment for the standard tool. Each resize is one daily operation: 5 per day for guests and 30 for a free account by default, with a 200 MB and 1 GB per-file cap respectively. Premium and Pro raise the counts to 300 and 700. See /pricing for the numbers in force today.',
      },
      {
        question: 'How do I keep the aspect ratio?',
        answer:
          'Fill in only one of the two fields. A width alone becomes -resize 1600x and the height is computed from the original ratio; a height alone becomes x900 and the width follows.',
      },
      {
        question: 'Why did my image come out stretched?',
        answer:
          'You filled in both width and height with a ratio that does not match the picture. Two values are sent as WxH! which forces that exact box. Crop to the target ratio first, in the same form, and then set both values.',
      },
      {
        question: 'What is the largest size I can request?',
        answer:
          'The form accepts up to 4096 for either field and the server up to 10000. An explicit height above your plan output cap (1080 px for guests by default) is refused before the upload starts and costs nothing.',
      },
      {
        question: 'Can I make a small photo larger with this tool?',
        answer:
          'You can type a larger number, but ImageMagick only interpolates, so the result is soft. For a 2x or 4x enlargement that rebuilds detail, use the AI upscaler, which runs Real-ESRGAN instead.',
      },
      {
        question: 'Does the output keep my EXIF data and orientation?',
        answer:
          'The pixels are auto-oriented first, so the result displays upright everywhere, and in the default mode exiftool copies the original tags back onto it. Choose strip if you want the tags gone.',
      },
      {
        question: 'Can I resize a GIF?',
        answer:
          'GIF is accepted as input and output and goes through the same ImageMagick command. The tool is built for still images; for animated GIFs a dedicated GIF tool gives more control over frames and palette.',
      },
    ],
    related: [
      { label: 'Compress image', to: '/tools/compress-image', description: 'Lower the quality without changing dimensions.' },
      { label: 'AI image upscaler', to: '/tools/ai-image-upscaler', description: 'Enlarge 2x or 4x with a model instead of interpolation.' },
      { label: 'Remove EXIF metadata', to: '/tools/remove-exif-metadata', description: 'Drop the tags that resizing keeps by default.' },
      { label: 'Image to PDF', to: '/tools/image-to-pdf', description: 'Wrap the resized image in a PDF page.' },
      { label: 'Image converter tutorial', to: '/tutorials/image/getting-started', description: 'Walk through resize, crop, and quality settings.' },
    ],
    workedExamples: [
      {
        title: 'A 6000 x 4000 camera JPEG scaled to 1920 px wide',
        body:
          'Input: an 8.5 MB, 24-megapixel JPEG from a mirrorless camera. Settings: width 1920, height empty, format unchanged, quality 85. The server runs convert input -auto-orient -resize 1920x -quality 85 converted.jpg. The ratio is 3:2, so the output is 1920 x 1280 pixels, about 2.46 megapixels, roughly one tenth of the original pixel count. The file size falls in a similar proportion, so expect something under 1 MB. One ImageMagick pass over 24 megapixels takes a few seconds on the server, and the exiftool copy afterwards keeps the lens and exposure tags.',
      },
      {
        title: 'A 400 x 400 avatar from a 3024 x 4032 portrait phone photo',
        body:
          'Input: a 3.1 MB portrait JPEG, 3024 wide by 4032 tall. Typing 400 and 400 alone would run -resize 400x400! and squash the 3:4 picture into a square. Instead set the crop to 3024 x 3024 at offset 0,504 (a square from the middle), then width 400 and height 400. The command becomes convert input -auto-orient -crop 3024x3024+0+504 -resize 400x400! -quality 85 converted.jpg, and the result is an undistorted 400 x 400 JPG of 160,000 pixels, a few tens of kilobytes. The crop and resize are one pass and finish in a few seconds.',
      },
    ],
    whenNotToUse:
      'Do not use the resizer to make a small image bigger: ImageMagick only interpolates the pixels that exist, so a 640 px photo pushed to 2560 px comes out blurry, and that case belongs to the AI upscaler. Do not type both a width and a height whose ratio differs from the picture unless you have cropped first, because the exact-box mode stretches rather than letterboxes. If the file is big but the dimensions are already right, use the compressor instead and leave the pixels alone. And animated GIFs are better handled by a dedicated GIF tool than by a plain resize.',
    primaryKeyword: 'resize image online',
    secondaryKeywords: [
      'image resizer',
      'resize photo',
      'change image dimensions',
      'resize JPG',
      'resize PNG online free',
    ],
  },
  {
    slug: 'compress-image',
    lastReviewed: '2026-10-29',
    name: 'Compress Image',
    h1: 'Compress Image Online Free',
    tagline:
      'Shrink JPG, PNG, and WebP file sizes for faster websites, smaller uploads, and easier sharing.',
    metaTitle: 'Compress Image Online Free | Media Manipulator',
    metaDescription:
      `Free online image compressor. Shrink JPG, PNG, and WebP file sizes while keeping good quality. No signup. ${RETENTION_PROMISE}.`,
    ogTitle: 'Compress Image Online Free',
    ogDescription:
      'Shrink JPG, PNG, and WebP file sizes while keeping good quality. Free, fast, no signup.',
    category: 'image',
    embed: {
      defaultMediaKind: 'image',
      defaultTask: 'compress_image',
      defaultQuality: 80,
      title: 'Compress an image',
      description:
        'Upload an image and lower the quality slider to shrink the file. The output format stays the same by default, or switch to WebP for the smallest size. A quality around 75–85 is a good balance.',
    },
    intro:
      'Compressing an image means re-encoding it so the same picture takes fewer bytes. This page opens the image converter with the quality field already set to 80 and the output format matched to your upload, so a JPG stays a JPG and a WebP stays a WebP. On our server the job is one ImageMagick command: the file is auto-oriented from its EXIF rotation flag, then written out with -quality 80, or whatever number between 1 and 100 you type. For JPG and WebP that number is what decides the file size. For PNG it is ignored, because PNG is lossless, so the real lever for a PNG photo is switching the output to JPG or WebP.',
    whatItDoes: [
      'Re-encodes JPG and WebP output at the quality you choose; the form starts at 80.',
      'Keeps the input format unless you change it; moving a PNG photo to WebP or JPG is where the large savings for PNG come from.',
      'Can shrink the pixel dimensions in the same pass: a width or height typed into the resize fields is applied before the quality setting, so the two savings compound.',
      'Copies the original EXIF, IPTC and XMP tags back onto the compressed file unless you set the metadata mode to strip.',
      'Writes the result as converted.jpg, converted.webp or converted.png inside the job output folder, which is what the download link serves.',
    ],
    flowSteps: [
      { title: 'Upload a JPG, PNG or WebP', description: 'Anything up to your plan per-file cap, which is 200 MB for guests by default.' },
      { title: 'Pick a quality number', description: '80 is preset. 60 to 75 shrinks harder; 90 and above keeps nearly everything.' },
      { title: 'ImageMagick re-encodes', description: 'convert input -auto-orient -quality N output, followed by an exiftool pass that copies the tags across.' },
      { title: 'Download the smaller file', description: 'The output is served from the job folder until its retention window ends.' },
    ],
    advancedDetails: [
      'The exact command is ImageMagick convert with the input path first, then -auto-orient, an optional -crop and -resize, then -quality N, then the output path. The -quality argument is only appended when the output format is jpg, jpeg or webp (convertImage in converter.go).',
      'Quality is validated on the server to the range 1 to 100; a value outside it is rejected before any work starts, and the job unit is refunded.',
      'PNG output never receives a -quality argument, so lowering the number on a PNG-to-PNG job changes nothing. The converter does not run pngquant or any palette reduction; to make a PNG smaller you change its format.',
      'In the default metadata mode the server runs exiftool -TagsFromFile <original> -all:all -unsafe on the result, so camera, lens, date and GPS tags survive compression. Choosing strip runs exiftool -all= on the output instead.',
      'A resize, if you set one, happens before quality is applied. A width alone keeps the aspect ratio; width plus height forces that exact box even when the ratio differs.',
      'Filters, a tint and a text overlay are available in the same form: a filter is applied right after the resize, and the tint and text overlay are added last, after the quality setting.',
    ],
    whyItMatters: [
      'Image bytes are usually the largest part of a web page or an email, so halving them is the cheapest speed win available.',
      'Upload forms, CMS fields and messaging apps enforce caps measured in megabytes, not in pixels.',
      'Re-encoding once at a quality you chose beats letting a platform re-encode on its own terms.',
    ],
    useCases: [
      { title: 'Blog and product photos', description: 'Bring a 4 to 6 MB camera JPEG well under 1 MB before publishing.' },
      { title: 'Email attachments', description: 'Get a set of photos under a 20 or 25 MB mailbox limit.' },
      { title: 'Application portals', description: 'Meet a 2 MB headshot or document-photo limit without visible loss.' },
      { title: 'Working copies', description: 'Keep smaller copies for day-to-day use while the originals stay in your archive.' },
    ],
    whyMediaManipulator: [
      'The command that runs is written on this page, including the fact that PNG ignores the quality number, so you are not left guessing why a file did not shrink.',
      'Quality, resize, format and metadata controls live in one form and one upload, and no watermark is added.',
      `Nothing to install and no account needed for the standard tool. ${RETENTION_PROMISE}.`,
    ],
    privacyNote: `Your image is stored under uploads/<jobId>/ on our own server, ImageMagick writes the compressed copy to outputs/<jobId>/, and a metadata report of the original is written beside it. In the default mode exiftool copies the original EXIF, IPTC and XMP tags onto the compressed file, so location and camera data come back with the result unless you choose the strip option. Every uploaded image is also passed to an automated analysis run by a vision model on the same server, and its JSON summary is kept with the job. ${RETENTION_PROMISE}. Nothing is sent to a third-party service.`,
    supportedFormats: {
      supportedInputFormats: ['jpg', 'jpeg', 'png', 'webp'],
      supportedOutputFormats: ['jpg', 'png', 'webp'],
      processingNotes: [
        'Lowering quality affects JPG and WebP output. To shrink a PNG photo a lot, convert it to JPG or WebP.',
      ],
    },
    faq: [
      {
        question: 'Is compressing an image here free?',
        answer:
          'Yes for the standard tool. A compression job spends one of the day\'s operations: guests get 5 per day with a 200 MB per-file cap by default, a free account raises that to 30 per day and 1 GB per file, and Premium and Pro go to 300 and 700. The live numbers are on /pricing, because the limits can change.',
      },
      {
        question: 'What quality number should I use?',
        answer:
          '80 is the preset and a sensible default for photos. Go lower only when a hard size limit forces it, and go to 90 or above for images that will be printed or cropped later. The number is passed straight to ImageMagick\'s -quality option, so it means the same thing it does in other tools built on ImageMagick.',
      },
      {
        question: 'Why did my PNG not get smaller?',
        answer:
          'Because the quality field does nothing for PNG output: the server only adds -quality for jpg, jpeg and webp. Change the output format to WebP or JPG. If you need to keep transparency, WebP keeps an alpha channel while JPG does not.',
      },
      {
        question: 'Does compression keep my EXIF and GPS data?',
        answer:
          'By default, yes. After ImageMagick writes the file, exiftool copies every tag group from the original onto the result. Pick strip in the metadata section to remove them all instead, or use the dedicated EXIF remover.',
      },
      {
        question: 'Will the picture be resized as well?',
        answer:
          'Not unless you type a width or a height. With both fields empty the pixel dimensions are unchanged and only the encoding changes.',
      },
      {
        question: 'Can I compress several images in one go?',
        answer:
          'Each upload is one job with one output file. Run the tool once per image; every job counts as one operation against the daily allowance.',
      },
      {
        question: 'Is WebP always smaller than JPG at the same quality?',
        answer:
          'Usually for photographs, but the quality scales of the two encoders are not identical, so compare the two outputs rather than assuming. Keep JPG when the file must open in software that predates WebP support.',
      },
    ],
    related: [
      { label: 'Image resizer', to: '/tools/image-resizer', description: 'Cut pixel dimensions first for the biggest savings.' },
      { label: 'Remove EXIF metadata', to: '/tools/remove-exif-metadata', description: 'Strip location and camera tags without re-encoding.' },
      { label: 'Image to PDF', to: '/tools/image-to-pdf', description: 'Wrap the compressed JPG in a one-page PDF.' },
      { label: 'AI image upscaler', to: '/tools/ai-image-upscaler', description: 'Go the other way and enlarge a small image.' },
      { label: 'Image converter tutorial', to: '/tutorials/image/getting-started', description: 'Walk through quality, resize, and format settings.' },
    ],
    workedExamples: [
      {
        title: 'A 4000 x 3000 phone JPEG at quality 80 with a 1600 px width',
        body:
          'Input: a 4.8 MB JPEG, 4000 x 3000 pixels, straight from a phone camera. Settings: width 1600, height left blank, quality 80, format unchanged. ImageMagick runs -resize 1600x, which keeps the ratio and produces 1600 x 1200 pixels: 1.92 megapixels against the original 12, about one sixth of the pixels. The result is written with -quality 80 and gets its EXIF copied back, so the output is a 1600 x 1200 JPG whose size follows that pixel reduction, roughly a sixth of the original, so expect around 1 MB or less from 4.8 MB. The conversion is a single ImageMagick pass over a 12-megapixel image and takes a few seconds; uploading the 4.8 MB file usually takes longer than converting it.',
      },
      {
        title: 'A 2.6 MB PNG screenshot switched to WebP',
        body:
          'Input: a 1920 x 1080 PNG screenshot of 2.6 MB with no transparency. Leaving the format as PNG and moving the quality to 60 would change nothing, because -quality is not passed for PNG output. Switching the output to WebP at the preset 80 runs convert input -auto-orient -quality 80 converted.webp. Uncompressed, those 2,073,600 pixels are 6.2 MB of RGB; lossy WebP at quality 80 keeps only a fraction of that, so the result is a fraction of the 2.6 MB PNG, with the exact figure depending on how much flat colour and text the screenshot contains. The dimensions stay 1920 x 1080 and the job finishes in a few seconds.',
      },
    ],
    whenNotToUse:
      'Do not use lossy compression on an image you still intend to edit heavily, on a PNG whose transparency you need to keep as PNG (switching to JPG flattens the alpha channel), or on screenshots of small text where a quality much below 85 makes letters smear. If the file is large only because of its pixel dimensions, the image resizer is the better first step; if your goal is privacy rather than size, the EXIF remover strips tags without touching the pixels. And a JPG that was already saved at quality 70 does not get much smaller at 80; each re-save adds loss without a matching gain.',
    primaryKeyword: 'compress image online',
    secondaryKeywords: [
      'image compressor',
      'reduce image file size',
      'shrink image',
      'compress JPG',
      'compress photo online free',
    ],
  },
  {
    slug: 'remove-background-from-image',
    lastReviewed: '2026-10-29',
    name: 'Remove Background from Image',
    h1: 'Remove Background from Image Online Free',
    tagline:
      'Automatically erase the background from any photo and download a clean, transparent PNG cutout.',
    metaTitle: 'Remove Background from Image Online Free | Media Manipulator',
    metaDescription:
      `Free online background remover. Automatically erase the background from any photo and download a transparent PNG. Runs on our own GPU — no third-party AI. ${RETENTION_PROMISE}.`,
    ogTitle: 'Remove Background from Image Online Free',
    ogDescription:
      'Automatically erase the background from any photo and download a transparent PNG cutout. Free, no signup.',
    category: 'image',
    embed: {
      defaultMediaKind: 'image',
      defaultTask: 'remove_background',
      defaultAIImageOperation: 'remove_background',
      lockedAIImageOperation: true,
      defaultOutputFormat: 'png',
      lockedOutputFormat: 'png',
      title: 'Remove the background from an image',
      description:
        'Upload a photo. This tool is preset to the AI background remover and outputs a transparent PNG. Just upload and convert — the subject is kept and the background is erased.',
    },
    intro:
      'This page opens the image converter with the AI operation locked to Remove Background and the output locked to PNG. When you convert, the server hands your file to rembg, an open-source segmentation tool, running on a GPU we own: by default it loads the BiRefNet General model, predicts which pixels belong to the subject, and writes a PNG whose alpha channel is transparent everywhere else. Six other models are selectable in the form (a lighter BiRefNet, a portrait variant, ISNet, and three U2Net builds) for cases where the general model misjudges hair, glass or a person against a busy backdrop.',
    whatItDoes: [
      'Runs rembg with the model you pick (BiRefNet General unless you change it) and returns the subject on a transparent background.',
      'Always writes PNG, because transparency needs an alpha channel and the API forces the .png extension for this operation.',
      'Keeps the full pixel dimensions of your upload; the cutout is not resized or cropped.',
      'Executes on our own GPU through ONNX Runtime with CUDA; no image is sent to an outside AI service.',
      'Counts as one everyday job, the same unit as a plain format conversion, not an AI job.',
    ],
    flowSteps: [
      { title: 'Upload a JPG, PNG or WebP', description: 'A single clear subject gives the cleanest mask.' },
      { title: 'Choose a model, or keep the default', description: 'BiRefNet General is preselected; the portrait and human-segmentation models exist for people.' },
      { title: 'rembg segments on the GPU', description: 'rembg i -m <model> input output.png runs with the CUDA ONNX Runtime environment sourced.' },
      { title: 'Download the transparent PNG', description: 'The result is converted.png in the job output folder.' },
    ],
    advancedDetails: [
      'The call is RemoveBackground in ai_tools.go: a bash shell sources the ONNX Runtime CUDA environment script, sets U2NET_HOME to the server model directory, and runs rembg i -m <model> <input> <output>. Model weights are cached on the server, so the first job after a restart can take a little longer while they load.',
      'Accepted model names are birefnet-general, birefnet-general-lite, isnet-general-use, u2net, u2netp, u2net_human_seg and birefnet-portrait; any other value is rejected before the job starts. An empty value becomes birefnet-general.',
      'The AI path replaces the ImageMagick pipeline entirely, so the quality number, filters, tint, text overlay and metadata options in the form have no effect on this operation; the output is whatever rembg writes.',
      'Because the normal exiftool copy step does not run for AI operations, the PNG carries no EXIF from the original. If you need the tags on the cutout, the metadata editor can add them in a second job.',
      'Output size follows the subject: fully transparent regions compress to almost nothing in PNG, so a small product on a large canvas gives a small file while a full-frame subject gives a file close to a lossless PNG of the original.',
    ],
    whyItMatters: [
      'Product listings, thumbnails and composites all start with a cutout, and masking one by hand is minutes per image.',
      'Marketplaces increasingly require a plain or white background, which is a transparent cutout placed over a white layer.',
      'A model trained on millions of masks handles fur, hair and semi-transparent edges better than a magic-wand selection.',
    ],
    useCases: [
      { title: 'E-commerce products', description: 'Isolate the item and place it on white or any brand colour.' },
      { title: 'Headshots and team pages', description: 'Use the portrait model to cut people cleanly from office backgrounds.' },
      { title: 'Logos lifted from photos', description: 'Get a transparent version of a logo that only exists on a coloured sign or page.' },
      { title: 'Thumbnails and stickers', description: 'Build layered designs from several cutouts in your editor.' },
    ],
    whyMediaManipulator: [
      'Seven real segmentation models are exposed by name, so you can switch from the general model to a portrait or U2Net build when an edge comes out wrong.',
      'The output is a plain transparent PNG at full resolution with no watermark and no forced downscale.',
      `The model runs on hardware we operate, and the standard tool needs no account. ${RETENTION_PROMISE}.`,
    ],
    privacyNote: `Your photo is written to uploads/<jobId>/ on our server and read by rembg running on a GPU in the same machine; the cutout goes to outputs/<jobId>/converted.png. No external API is called for the segmentation and nothing from your image is used to train anything. Like every image upload, the file is also examined once by an automated analysis step using a vision model hosted on our server, and that summary is stored with the job. The PNG carries no EXIF from the original because the metadata copy step does not run for AI operations. ${RETENTION_PROMISE}.`,
    supportedFormats: {
      supportedInputFormats: ['jpg', 'jpeg', 'png', 'webp'],
      supportedOutputFormats: ['png'],
      processingNotes: [
        'Output is always a transparent PNG. Background removal runs on our local GPU server, not a third-party API.',
      ],
    },
    faq: [
      {
        question: 'Is background removal free?',
        answer:
          'Yes, within the daily allowance. Background removal deliberately counts as an everyday job, not as one from the separate AI allowance: 5 per day for guests and 30 with a free account by default, with per-file caps of 200 MB and 1 GB. Premium and Pro get 300 and 700. The current figures are on /pricing.',
      },
      {
        question: 'Which model should I choose?',
        answer:
          'Keep BiRefNet General for objects, products and most photos. Pick BiRefNet Portrait or U2Net Human Segmentation for people, and BiRefNet General Lite or U2Net Lite when you want a faster pass on a large image.',
      },
      {
        question: 'Why is the output always PNG?',
        answer:
          'The API forces a .png extension for this operation because the cutout needs an alpha channel; JPG has none and would show the background as black or white. Convert to another format afterwards if you have flattened it onto a colour.',
      },
      {
        question: 'Can I get a white background instead of transparency?',
        answer:
          'Not directly from this tool. Place the PNG over a white layer in any editor or in Darkroom; the transparent pixels take the colour beneath them.',
      },
      {
        question: 'Does it work on hair, fur and glass?',
        answer:
          'Often, and the portrait and BiRefNet models were trained with those edges in mind, but semi-transparent regions are the hardest case. Try a second model if the first leaves a fringe.',
      },
      {
        question: 'Is my photo sent to an outside AI company?',
        answer:
          'No. rembg and its models run on our own GPU server, and the job never calls a third-party API.',
      },
      {
        question: 'Does the cutout keep my EXIF data?',
        answer:
          'No. AI operations bypass the exiftool copy that the normal converter performs, so the PNG has no camera, date or GPS tags.',
      },
    ],
    related: [
      { label: 'Remove object from photo', to: '/tools/remove-object-from-photo', description: 'Erase one thing and keep the rest of the scene.' },
      { label: 'Image resizer', to: '/tools/image-resizer', description: 'Scale the cutout to the size your layout needs.' },
      { label: 'AI image upscaler', to: '/tools/ai-image-upscaler', description: 'Enlarge a small cutout before placing it.' },
      { label: 'Blur faces in photo', to: '/tools/blur-faces-in-photo', description: 'Anonymize people instead of isolating them.' },
      { label: 'Image converter tutorial', to: '/tutorials/image/getting-started', description: 'Walk through every AI and image option.' },
    ],
    workedExamples: [
      {
        title: 'A 3000 x 2000 product JPEG with the default model',
        body:
          'Input: a 2.1 MB, 3000 x 2000 JPEG of a shoe on a grey backdrop. Model left at BiRefNet General. The server runs rembg on the GPU and writes converted.png at the same 3000 x 2000 pixels, four channels. Uncompressed that is 24 MB of RGBA, but the transparent backdrop compresses to nearly nothing, so the PNG size is governed by the shoe itself, typically a few megabytes because PNG is lossless. The time is one forward pass of the model over the image plus PNG encoding, a few seconds once the model is warm; the first run after a quiet period adds the weight-loading time.',
      },
      {
        title: 'A 1080 x 1080 headshot with the portrait model',
        body:
          'Input: a 640 KB, 1080 x 1080 WebP selfie in front of a bookshelf. Switch the model to BiRefNet Portrait, which is tuned for people and hair. The output is a 1080 x 1080 PNG with the person opaque and the shelves fully transparent. At 1.17 megapixels the model pass is quick; most of the wall-clock time is the upload and the PNG write. Because the AI path skips the metadata copy, the PNG has no EXIF, which is usually what you want for a profile image.',
      },
    ],
    whenNotToUse:
      'Skip this tool when the subject is not a single distinct thing: a crowd, a landscape, a pattern, or an interior with no obvious foreground gives the model nothing to separate and the mask will be arbitrary. It is also the wrong tool when you want a soft blur behind a subject rather than transparency, when you need the result as JPG (JPG cannot hold the alpha channel, so you would have to flatten it afterwards), and when the input is a screenshot or a line drawing, where ISNet or a manual selection in an editor works better than a photo-trained model.',
    primaryKeyword: 'remove background from image',
    secondaryKeywords: [
      'background remover',
      'remove image background',
      'transparent background maker',
      'erase background from photo',
      'free background remover online',
    ],
  },

  // ------------------------------------------------------------- IMAGE <-> PDF
  {
    slug: 'image-to-pdf',
    lastReviewed: '2026-10-29',
    name: 'Image to PDF',
    h1: 'Convert Image to PDF Online Free',
    tagline:
      'Turn JPG, PNG, and other images into a clean, shareable PDF document in one click.',
    metaTitle: 'Convert Image to PDF Online Free | Media Manipulator',
    metaDescription:
      `Free online image to PDF converter. Turn JPG, PNG, and other images into a clean PDF document. No signup, no watermarks. ${RETENTION_PROMISE}.`,
    ogTitle: 'Convert Image to PDF Online Free',
    ogDescription:
      'Turn JPG, PNG, and other images into a clean, shareable PDF. Free, fast, no signup.',
    category: 'image',
    embed: {
      defaultMediaKind: 'image',
      defaultTask: 'image_to_pdf',
      defaultOutputFormat: 'pdf',
      lockedOutputFormat: 'pdf',
      acceptOverride: 'image/*',
      title: 'Convert an image to PDF',
      description:
        'Upload any image — JPG, PNG, and more. The output is locked to PDF for this tool, so you get a single-page PDF wrapping your image at its native resolution.',
    },
    intro:
      'This page locks the output format to PDF, which sends your image down a dedicated path in our API that builds the document in pure Go rather than through ImageMagick or Ghostscript. A JPEG is embedded byte-for-byte with the /DCTDecode filter, so the photo inside the PDF is the identical compressed stream you uploaded. A PNG, GIF or WebP is decoded, composited onto white, and stored as zlib-compressed 8-bit RGB. The single page is sized so the image sits at 96 pixels per inch: every pixel becomes 0.75 points, which keeps the picture at native resolution with no resampling.',
    whatItDoes: [
      'Wraps one image in a one-page PDF 1.4 document sized to the image at 96 DPI.',
      'Embeds JPEG data untouched, so there is no second generation of compression for photos.',
      'Flattens transparent PNG and GIF pixels onto white and stores them losslessly with zlib.',
      'Rasterizes WebP and other containers Go cannot decode through ImageMagick first, then embeds the result losslessly.',
      'Ignores the quality, resize, crop, filter and AI settings; the PDF path takes only the image.',
    ],
    flowSteps: [
      { title: 'Upload any image', description: 'JPG, PNG, GIF and WebP are the usual inputs; the field accepts any image type.' },
      { title: 'The server reads the pixels', description: 'JPEG dimensions come from the header; other formats are decoded and flattened to RGB.' },
      { title: 'A one-page PDF is assembled', description: 'Catalog, page, image XObject and a content stream that draws the image to fill the page.' },
      { title: 'Download converted.pdf', description: 'Served from the job output folder until retention expires.' },
    ],
    advancedDetails: [
      'The builder is imageToPDFBytes in pdf_tools.go. A file starting with the JPEG marker FF D8 FF is embedded as /DCTDecode with /DeviceRGB or /DeviceGray; a CMYK JPEG falls back to the decode-and-flatten path so the PDF never carries a CMYK stream.',
      'Non-JPEG inputs are decoded with Go image codecs (PNG and GIF are registered). Each pixel is alpha-composited over white and written as three bytes, then the whole buffer is zlib-compressed and stored with /FlateDecode at 8 bits per component.',
      'WebP and anything else Go cannot decode is first rasterized by ImageMagick with -auto-orient to a PNG stream in memory, and that PNG is then flattened and embedded.',
      'Page size in points is width x 72 / 96 and height x 72 / 96, so a 1200 x 1600 image gives a 900 x 1200 point page (12.5 by 16.7 inches). PDF viewers scale a page to fit the window and printers scale to paper, so a large page is not a problem for viewing, but set "fit to page" when printing.',
      'JPEGs on the fast path keep their EXIF, including an Orientation flag, but PDF viewers do not apply EXIF orientation. A phone photo stored sideways with a rotation flag will appear sideways in the PDF; convert it to JPG once first (which auto-orients) and then to PDF.',
      'The quality value sent by the form is accepted but unused on this path, and there is no multi-image mode: one upload makes one single-page PDF.',
    ],
    whyItMatters: [
      'Portals for visas, universities and HR systems frequently accept only PDF, even for a photo of a receipt.',
      'A PDF prints and previews the same on every device, while a bare image may be rotated or scaled by the viewer.',
      'Embedding the JPEG untouched means the PDF is proof-quality: nothing was re-encoded on the way in.',
    ],
    useCases: [
      { title: 'Receipts and forms', description: 'Turn a phone photo of a signed page into a PDF a portal will accept.' },
      { title: 'ID and document uploads', description: 'Submit a scanned card or certificate as the PDF the form demands.' },
      { title: 'Artwork proofs', description: 'Send a client a PDF of a PNG design with transparency flattened to white.' },
      { title: 'Archiving', description: 'Keep a photo alongside other documents in one format.' },
    ],
    whyMediaManipulator: [
      'The JPEG pass-through is a design decision: your photo is embedded without re-encoding, which many converters do not promise.',
      'No Ghostscript and no ImageMagick PDF policy on the path, so the conversion does not depend on a server-side security setting that might refuse PDFs.',
      `Free for the standard tool, no account required. ${RETENTION_PROMISE}.`,
    ],
    privacyNote: `The image is stored under uploads/<jobId>/ and the PDF under outputs/<jobId>/converted.pdf on our own server; both are deleted together when the retention window closes. A JPEG keeps all of its embedded metadata inside the PDF because the stream is copied verbatim, so EXIF location and camera tags remain readable by anyone who extracts the image; strip them first with the EXIF remover if that matters. PNG and other inputs are decoded to raw pixels, so no tags carry over. The upload itself is an image and therefore also goes through the automated vision-model analysis run on our server, whose summary stays with the job. ${RETENTION_PROMISE}.`,
    supportedFormats: {
      supportedInputFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
      supportedOutputFormats: ['pdf'],
      processingNotes: [
        'Output is a single-page PDF. Transparency is flattened onto white because PDF pages are opaque.',
      ],
    },
    faq: [
      {
        question: 'Is the image to PDF conversion free?',
        answer:
          'Yes for the standard tool. Each conversion spends one daily operation: 5 a day as a guest with a 200 MB file cap, 30 a day and 1 GB with a free account, and 300 or 700 on Premium or Pro, all by default and listed on /pricing.',
      },
      {
        question: 'Is the photo re-compressed inside the PDF?',
        answer:
          'Not if it is a JPEG: the original bytes are embedded with /DCTDecode. PNG, GIF and WebP are stored losslessly as zlib-compressed RGB after flattening, so no quality is lost there either.',
      },
      {
        question: 'What page size does the PDF have?',
        answer:
          'The page matches the image at 96 pixels per inch, so width and height in points are 0.75 times the pixel dimensions. A 1200 x 1600 image gives a 12.5 by 16.7 inch page; viewers and printers scale it to fit.',
      },
      {
        question: 'Can I combine several images into one PDF?',
        answer:
          'Not on this page. Each upload produces a single-page PDF. Convert each image and merge the resulting PDFs in a PDF editor.',
      },
      {
        question: 'What happens to transparency?',
        answer:
          'It is flattened onto white. PDF image XObjects on this path have no alpha, so transparent pixels become white pixels.',
      },
      {
        question: 'Why is my phone photo sideways in the PDF?',
        answer:
          'Phones often store the pixels in landscape and set an EXIF Orientation flag. The JPEG is embedded untouched and PDF viewers ignore that flag. Run the photo through the image converter as JPG first, which applies auto-orient, then convert the result to PDF.',
      },
      {
        question: 'Does the PDF keep my EXIF data?',
        answer:
          'For a JPEG, yes, because the whole JPEG stream including its EXIF is inside the PDF. Use the EXIF remover first if you do not want that. For PNG and other inputs, only the pixels are kept.',
      },
    ],
    related: [
      { label: 'PDF to JPG', to: '/tools/pdf-to-jpg', description: 'Render PDF pages back to images.' },
      { label: 'Remove EXIF metadata', to: '/tools/remove-exif-metadata', description: 'Strip tags before they are embedded in the PDF.' },
      { label: 'Compress image', to: '/tools/compress-image', description: 'Shrink the JPEG first, since the PDF embeds it as-is.' },
      { label: 'AI document scan', to: '/tools/ai-document-scan', description: 'Clean up and OCR a photographed page instead of just wrapping it.' },
      { label: 'Image resizer', to: '/tools/image-resizer', description: 'Set the pixel size, and therefore the page size, first.' },
    ],
    workedExamples: [
      {
        title: 'A 3024 x 4032 phone JPEG (2.9 MB)',
        body:
          'Input: a 2.9 MB JPEG, 3024 wide by 4032 tall, RGB. The header is read for the dimensions and the JPEG stream is embedded as-is with /DCTDecode. The page is 3024 x 0.75 = 2268 points wide and 4032 x 0.75 = 3024 points tall, which is 31.5 by 42 inches. The PDF comes out at about 2.9 MB plus under a kilobyte of PDF structure, because nothing is re-encoded. The work is reading the file and writing it back out, so the job is bound by disk and upload speed rather than CPU, and finishes in a few seconds.',
      },
      {
        title: 'A 1920 x 1080 PNG with a transparent background',
        body:
          'Input: a 1.4 MB PNG of a logo on transparency. The PNG is decoded, every pixel is composited over white, and the 1920 x 1080 x 3 = 6,220,800 bytes of RGB are zlib-compressed and stored with /FlateDecode. The page is 1440 x 810 points (20 by 11.25 inches). Because flat white and solid colour compress well under zlib, the PDF is typically in the same range as the PNG, sometimes larger, since plain zlib lacks the row filters PNG uses. Decoding, compositing two million pixels and compressing them is CPU work that takes a few seconds; the transparency is gone in the result by design.',
      },
    ],
    whenNotToUse:
      'This is not the tool for a multi-page document: it makes exactly one page from one image, so a set of scans needs each page converted and then merged in a PDF editor. Do not use it when transparency must survive, because every pixel is flattened onto white. Do not expect a smaller file: a JPEG is embedded unchanged and a PNG becomes zlib-compressed RGB, so compress or resize the image first if size matters. And a photo whose correct orientation lives only in an EXIF flag should be converted to JPG once beforehand, otherwise the PDF shows it as stored.',
    primaryKeyword: 'image to pdf',
    secondaryKeywords: [
      'image to pdf converter',
      'jpg png to pdf',
      'photo to pdf',
      'convert image to pdf',
      'picture to pdf',
    ],
  },
  {
    slug: 'convert-jpg-to-pdf',
    name: 'Convert JPG to PDF',
    h1: 'Convert JPG to PDF Online Free',
    tagline:
      'Turn JPG photos and scans into clean PDF documents ready to share, print, or upload.',
    metaTitle: 'Convert JPG to PDF Online Free | Media Manipulator',
    metaDescription:
      `Free online JPG to PDF converter. Turn .jpg photos and scans into clean PDF documents with no quality loss. No signup. ${RETENTION_PROMISE}.`,
    ogTitle: 'Convert JPG to PDF Online Free',
    ogDescription:
      'Turn JPG photos and scans into clean PDF documents. Lossless, free, no signup.',
    category: 'image',
    embed: {
      defaultMediaKind: 'image',
      defaultTask: 'jpg_to_pdf',
      defaultOutputFormat: 'pdf',
      lockedOutputFormat: 'pdf',
      lockedInputFormat: 'jpg',
      acceptOverride: 'image/jpeg,image/*',
      title: 'Convert JPG to PDF',
      description:
        'Upload a JPG image. The output is locked to PDF, and your JPG is embedded losslessly — the photo inside the PDF is bit-for-bit identical to your original.',
    },
    intro:
      'JPG is the format your phone and camera shoot in, but a PDF is what most forms, applications, and offices want. Media Manipulator embeds your JPG directly into a PDF with no re-compression, so the document looks exactly like your photo and stays small.',
    whatItDoes: [
      'Wraps a JPG/JPEG photo into a single-page PDF document.',
      'Embeds the original JPG bytes losslessly — zero added compression.',
      'Sizes the page to the photo so nothing is cropped or stretched.',
      'Produces a standard PDF that opens and prints anywhere.',
    ],
    flowSteps: [
      { title: 'Upload JPG', description: 'Drop in a .jpg or .jpeg photo or scan.' },
      { title: 'We embed it', description: 'The JPG is placed on a matching-size page, uncompressed.' },
      { title: 'Generate PDF', description: 'A standard single-page PDF is assembled.' },
      { title: 'Download PDF', description: 'Save a clean .pdf ready to share or upload.' },
    ],
    advancedDetails: [
      'The JPG stream is embedded with the PDF /DCTDecode filter, meaning the photo is stored as-is — no second round of lossy compression.',
      'Because there is no re-encode, a JPG-to-PDF document is typically about the same size as the original photo.',
      'The page is sized from the image at 96 DPI, so a typical phone photo produces a comfortably sized page.',
    ],
    whyItMatters: [
      'Forms, portals, and applications frequently require PDF, not JPG.',
      'A PDF prints predictably where a raw JPG might tile or rescale.',
      'Lossless embedding keeps text in a scanned document readable.',
    ],
    useCases: [
      { title: 'Job applications', description: 'Turn a photo of a signed form into a PDF a portal accepts.' },
      { title: 'Receipts and expenses', description: 'Convert receipt photos to PDFs for expense reports.' },
      { title: 'Scanned documents', description: 'Wrap a phone scan of a page into a tidy PDF.' },
      { title: 'Printing', description: 'Get predictable print output from a JPG.' },
    ],
    whyMediaManipulator: [
      'Truly lossless — the JPG inside the PDF is identical to your original.',
      'Output is locked to PDF, so there is nothing to misconfigure.',
    ],
    privacyNote: privacyNoteFor('image', 'Your JPG is placed, without being re-compressed, onto a single PDF page that our server builds.'),
    supportedFormats: {
      supportedInputFormats: ['jpg', 'jpeg'],
      supportedOutputFormats: ['pdf'],
      processingNotes: [
        'The JPG is embedded losslessly (no re-compression) into a single-page PDF.',
      ],
    },
    faq: [
      {
        question: 'How do I convert a JPG to PDF for free?',
        answer:
          'Upload your .jpg above and click convert — the output is a single-page PDF. It is free and requires no signup.',
      },
      {
        question: 'Will converting JPG to PDF lower the quality?',
        answer:
          'No. The JPG is embedded directly into the PDF without re-compression, so the image quality is identical to your original file.',
      },
      {
        question: 'Will the PDF be much bigger than my JPG?',
        answer:
          'No — because there is no re-encoding, the PDF is roughly the same size as the source JPG plus a tiny document wrapper.',
      },
      {
        question: 'Can I combine multiple JPGs into one PDF?',
        answer:
          'This tool makes one PDF per image. Convert each JPG and merge the PDFs in a merge tool if you need multiple pages.',
      },
    ],
    related: [
      { label: 'Convert PNG to PDF', to: '/tools/convert-png-to-pdf', description: 'Focused PNG → PDF converter.' },
      { label: 'Image to PDF', to: '/tools/image-to-pdf', description: 'Convert any image format to PDF.' },
      { label: 'Image converter', to: '/tools/image-converter', description: 'Convert between JPG, PNG, WebP, AVIF and more.' },
      { label: 'PDF to JPG', to: '/tools/pdf-to-jpg', description: 'Go the other way: render a PDF to JPG.' },
      { label: 'PDF converter', to: '/tools/pdf-converter', description: 'The full PDF conversion hub.' },
    ],
    primaryKeyword: 'jpg to pdf',
    secondaryKeywords: [
      'jpg to pdf converter',
      'convert jpg to pdf',
      'jpeg to pdf',
      '.jpg to .pdf',
      'photo to pdf',
    ],
  },
  {
    slug: 'convert-png-to-pdf',
    name: 'Convert PNG to PDF',
    h1: 'Convert PNG to PDF Online Free',
    tagline:
      'Turn PNG screenshots, graphics, and scans into clean, crisp PDF documents.',
    metaTitle: 'Convert PNG to PDF Online Free | Media Manipulator',
    metaDescription:
      `Free online PNG to PDF converter. Turn .png screenshots and graphics into crisp, lossless PDF documents. No signup. ${RETENTION_PROMISE}.`,
    ogTitle: 'Convert PNG to PDF Online Free',
    ogDescription:
      'Turn PNG screenshots and graphics into crisp, lossless PDF documents. Free, no signup.',
    category: 'image',
    embed: {
      defaultMediaKind: 'image',
      defaultTask: 'png_to_pdf',
      defaultOutputFormat: 'pdf',
      lockedOutputFormat: 'pdf',
      lockedInputFormat: 'png',
      acceptOverride: 'image/png,image/*',
      title: 'Convert PNG to PDF',
      description:
        'Upload a PNG image. The output is locked to PDF, and your PNG is embedded losslessly so text and sharp edges stay crisp on the page.',
    },
    intro:
      'PNG is the format for screenshots, diagrams, and graphics with crisp text and sharp edges. When you need to send or print one as a document, a PDF is the right wrapper. Media Manipulator embeds your PNG losslessly into a PDF so every edge stays sharp.',
    whatItDoes: [
      'Wraps a PNG image into a single-page PDF document.',
      'Embeds the image losslessly so text and line art stay crisp.',
      'Flattens transparency onto white, since PDF pages are opaque.',
      'Produces a standard PDF that opens and prints anywhere.',
    ],
    flowSteps: [
      { title: 'Upload PNG', description: 'Drop in a .png screenshot, diagram, or graphic.' },
      { title: 'We embed it', description: 'The PNG is composited onto a white page and embedded losslessly.' },
      { title: 'Generate PDF', description: 'A standard single-page PDF is assembled.' },
      { title: 'Download PDF', description: 'Save a crisp .pdf ready to share or print.' },
    ],
    advancedDetails: [
      'PNGs are decoded and embedded with lossless zlib (Flate) compression, so sharp text and edges are preserved exactly — no JPEG artifacts.',
      'Transparent areas become white because PDF pages do not have an alpha channel.',
      'The page is sized from the image at 96 DPI for a sensible default physical size.',
    ],
    whyItMatters: [
      'Screenshots and diagrams are often submitted as PDFs in tickets and reports.',
      'Lossless embedding keeps small text and thin lines readable.',
      'PDF prints predictably where a raw PNG can rescale unexpectedly.',
    ],
    useCases: [
      { title: 'Bug reports', description: 'Turn a screenshot into a PDF to attach to a ticket.' },
      { title: 'Diagrams and charts', description: 'Wrap an exported graphic into a shareable PDF.' },
      { title: 'Scanned forms', description: 'Convert a PNG scan into a tidy PDF document.' },
      { title: 'Printing', description: 'Get crisp, predictable prints from a PNG.' },
    ],
    whyMediaManipulator: [
      'Lossless embedding keeps text and edges razor-sharp.',
      'Output is locked to PDF, so there is nothing to misconfigure.',
    ],
    privacyNote: privacyNoteFor('image', 'Your PNG is embedded losslessly into a one-page PDF on our server, with transparency flattened onto white.'),
    supportedFormats: {
      supportedInputFormats: ['png'],
      supportedOutputFormats: ['pdf'],
      processingNotes: [
        'The PNG is embedded losslessly. Transparency is flattened onto white because PDF pages are opaque.',
      ],
    },
    faq: [
      {
        question: 'How do I convert a PNG to PDF for free?',
        answer:
          'Upload your .png above and click convert — the output is a single-page PDF. It is free and requires no signup.',
      },
      {
        question: 'Does PNG to PDF keep text sharp?',
        answer:
          'Yes. The PNG is embedded losslessly, so sharp text and line art stay crisp with no JPEG-style artifacts.',
      },
      {
        question: 'What happens to a transparent PNG?',
        answer:
          'Transparent areas are flattened onto a white background because PDF pages are opaque. The visible content is unchanged.',
      },
      {
        question: 'Can I merge several PNGs into one PDF?',
        answer:
          'This tool creates one PDF per image. Convert each PNG and merge the PDFs in a merge tool for multi-page documents.',
      },
    ],
    related: [
      { label: 'Convert JPG to PDF', to: '/tools/convert-jpg-to-pdf', description: 'Focused JPG → PDF converter.' },
      { label: 'Image to PDF', to: '/tools/image-to-pdf', description: 'Convert any image format to PDF.' },
      { label: 'Image converter', to: '/tools/image-converter', description: 'Convert between JPG, PNG, WebP, AVIF and more.' },
      { label: 'PDF to PNG', to: '/tools/pdf-to-png', description: 'Go the other way: render a PDF to PNG.' },
      { label: 'PDF converter', to: '/tools/pdf-converter', description: 'The full PDF conversion hub.' },
    ],
    primaryKeyword: 'png to pdf',
    secondaryKeywords: [
      'png to pdf converter',
      'convert png to pdf',
      '.png to .pdf',
      'screenshot to pdf',
      'image to pdf',
    ],
  },
  {
    slug: 'pdf-to-jpg',
    lastReviewed: '2026-10-29',
    name: 'PDF to JPG',
    h1: 'Convert PDF to JPG Online Free',
    tagline:
      'Render every page of a PDF to high-quality JPG images you can share, edit, or post.',
    metaTitle: 'Convert PDF to JPG Online Free | Media Manipulator',
    metaDescription:
      `Free online PDF to JPG converter. Render every page of a PDF to high-quality JPG images, downloaded as a ZIP. No signup. ${RETENTION_PROMISE}.`,
    ogTitle: 'Convert PDF to JPG Online Free',
    ogDescription:
      'Render every page of a PDF to high-quality JPG images. Free, fast, no signup.',
    category: 'image',
    embed: {
      defaultMediaKind: 'pdf',
      defaultTask: 'pdf_to_jpg',
      defaultOutputFormat: 'jpg',
      acceptOverride: 'application/pdf',
      pdfDefaultOutputFormat: 'jpg',
      pdfLockOutputFormat: true,
      pdfDefaultPageSelection: 'all',
      pdfDefaultDpi: 150,
      title: 'Convert PDF to JPG',
      description:
        'Upload a PDF. Each page is rendered to a JPG image. Choose "all pages" for a ZIP of images, or "first page only" for a single JPG. Pick a render DPI for sharper output.',
    },
    intro:
      'Upload a PDF and our server renders each page with pdftoppm from the Poppler toolkit, the same rasterizer used by many desktop PDF viewers. The form on this page is preset to JPG, all pages, and 150 DPI; you can change the DPI to 100, 200 or 300, limit the job to the first page, and set the JPEG quality, which defaults to 90. With all pages selected you get a ZIP containing page-001.jpg, page-002.jpg and so on; with first page only you get a single JPG. Before rendering, pdfinfo counts the pages and the job is refused if there are more than 500.',
    whatItDoes: [
      'Rasterizes every page, or only the first, to a JPG at the resolution you pick.',
      'Packages multi-page output as one ZIP with zero-padded, sortable filenames.',
      'Uses the JPEG quality you set (90 by default) for every page.',
      'Reads the page count first so an oversized document fails before any rendering happens.',
      'Keeps PDFs out of the automated image analysis, which only runs on image, video and audio uploads.',
    ],
    flowSteps: [
      { title: 'Upload a PDF', description: 'Any .pdf up to your per-file cap; the page count must be 500 or fewer.' },
      { title: 'Choose pages, DPI and quality', description: 'All pages or first only; 100, 150, 200 or 300 DPI; JPEG quality 1 to 100.' },
      { title: 'pdftoppm renders', description: 'pdftoppm -r <dpi> -jpeg -jpegopt quality=<q> [-f 1 -l 1] input page' },
      { title: 'Download', description: 'converted.jpg for a single page, converted.zip for all pages.' },
    ],
    advancedDetails: [
      'The renderer is convertPDFToImages in pdf_tools.go. It calls pdfinfo for the page count, refuses more than 500 pages, then runs pdftoppm with -r for the DPI, -jpeg and -jpegopt quality=N for JPG output, and -f 1 -l 1 when only the first page is wanted.',
      'The server clamps DPI to the range 50 to 400 and quality to 1 to 100 regardless of what the form sends; the form itself offers 100, 150, 200 and 300.',
      'pdftoppm writes one file per page; the server renames them to page-001.jpg, page-002.jpg and so on (three-digit, zero-padded) and zips them, so the files sort in page order in any file manager.',
      'Pixel dimensions follow directly from DPI: a US Letter page (8.5 x 11 in) is 1275 x 1650 pixels at 150 DPI and 2550 x 3300 at 300; an A4 page (8.27 x 11.69 in) is 1240 x 1754 at 150 and 2480 x 3508 at 300.',
      'A PDF that is itself a scan is re-rasterized: if the embedded scan was 300 DPI and you render at 150, each page comes out at half the linear resolution of the scan. Pick 300 to keep what the scan had.',
      'The PNG variant of this tool uses the same renderer with -png and no quality option; JPG is the right choice for photographic or scanned pages, PNG for pages with sharp text and flat colour where JPEG ringing would show.',
    ],
    whyItMatters: [
      'Many tools and platforms accept images but not PDFs: slide decks, social posts, chat apps and image editors.',
      'A rendered page is a faithful picture of the layout, fonts and vector graphics, with nothing to embed or reflow.',
      'Choosing the DPI yourself means you decide between a quick preview and a print-resolution export.',
    ],
    useCases: [
      { title: 'Slides and social posts', description: 'Render a report page or a poster to an image you can post or drop into a deck.' },
      { title: 'Thumbnails and previews', description: 'Render only the first page at 100 DPI for a cover image.' },
      { title: 'Markup in an editor', description: 'Open a page in an image editor to annotate, redact or crop.' },
      { title: 'Scan extraction', description: 'Get each scanned page back out of a PDF as a separate JPG at the original resolution.' },
    ],
    whyMediaManipulator: [
      'Poppler rendering with the real DPI and quality controls exposed, not a fixed preview size.',
      'A single ZIP with page-numbered filenames instead of a pile of downloads.',
      `No signup for the standard tool. ${RETENTION_PROMISE}.`,
    ],
    privacyNote: `Your PDF is stored under uploads/<jobId>/ on our server and the rendered JPGs, or their ZIP, under outputs/<jobId>/; pages are rendered into a temporary directory inside the output folder that is removed as soon as the ZIP is written. PDF uploads are detected as documents and are not passed to the automated vision analysis that image, video and audio uploads receive. Poppler runs entirely on our machine, and no page is sent to any outside service. ${RETENTION_PROMISE}.`,
    supportedFormats: {
      supportedInputFormats: ['pdf'],
      supportedOutputFormats: ['jpg', 'zip (one jpg per page)'],
      processingNotes: [
        'All-pages output is delivered as a .zip; first-page output is a single .jpg.',
        'Default render resolution is 150 DPI; raise it for print-quality output.',
      ],
    },
    faq: [
      {
        question: 'Is PDF to JPG conversion free?',
        answer:
          'Yes for the standard tool. One PDF, however many pages, is one daily operation: 5 per day as a guest with a 200 MB per-file cap, 30 per day and 1 GB with a free account, 300 on Premium and 700 on Pro, all by default and shown on /pricing.',
      },
      {
        question: 'How many images will I get?',
        answer:
          'One per page when all pages is selected, delivered as converted.zip with files named page-001.jpg upward. With first page only you get one converted.jpg and no ZIP.',
      },
      {
        question: 'Which DPI should I choose?',
        answer:
          '150 for reading on screen and sharing (1240 x 1754 for A4). 300 for print or for scans that were made at 300 (2480 x 3508 for A4). 100 for small previews. The server accepts 50 to 400.',
      },
      {
        question: 'What does the quality setting do?',
        answer:
          'It is passed to pdftoppm as -jpegopt quality=N, the standard JPEG quality scale. 90 is the default; lower it for smaller files on photo-heavy pages.',
      },
      {
        question: 'Is there a page limit?',
        answer:
          'Yes, 500 pages. pdfinfo counts them before rendering starts and a longer document is refused with a message stating the count and the limit, and the operation is refunded.',
      },
      {
        question: 'Will the text in the image be searchable?',
        answer:
          'No. The output is a raster image of each page. If you need text, keep the PDF, or use the AI document scan tool, which runs OCR on a photographed page.',
      },
      {
        question: 'Can I get PNG instead of JPG?',
        answer:
          'This page locks the format to JPG. The same renderer produces PNG through the PDF to PNG page, which uses -png and has no quality setting.',
      },
    ],
    related: [
      { label: 'Image to PDF', to: '/tools/image-to-pdf', description: 'Go the other way: wrap an image in a PDF page.' },
      { label: 'Compress image', to: '/tools/compress-image', description: 'Shrink the rendered JPGs for the web.' },
      { label: 'Image resizer', to: '/tools/image-resizer', description: 'Scale a rendered page to a thumbnail or banner size.' },
      { label: 'AI document scan', to: '/tools/ai-document-scan', description: 'OCR and clean up a photographed page.' },
      { label: 'Redact text in image', to: '/tools/redact-text-in-image', description: 'Black out names or numbers on a rendered page.' },
    ],
    workedExamples: [
      {
        title: 'A 12-page A4 report, all pages at 150 DPI',
        body:
          'Input: a 12-page A4 PDF of 1.8 MB containing text and a few charts. Settings left at the preset: JPG, all pages, 150 DPI, quality 90. pdfinfo reports 12 pages, under the 500 cap, and pdftoppm runs -r 150 -jpeg -jpegopt quality=90. Each page renders at 8.27 x 150 by 11.69 x 150, so 1240 x 1754 pixels (2.2 megapixels). The twelve files are renamed page-001.jpg through page-012.jpg and zipped into converted.zip. Rendering is per page and dominated by how much vector content and text each page has; a dozen text pages take a few seconds in total. Per-page JPEG size depends on content: mostly-white text pages compress far better than a full-bleed chart.',
      },
      {
        title: 'First page only of a US Letter scan at 300 DPI',
        body:
          'Input: a 40-page scanned contract, Letter size, 28 MB. Choose first page only and 300 DPI, keep quality 90. The server runs pdftoppm -r 300 -jpeg -jpegopt quality=90 -f 1 -l 1, so only one page is rasterized, at 8.5 x 300 by 11 x 300 = 2550 x 3300 pixels (8.4 megapixels). The output is a single converted.jpg, not a ZIP. Rendering one scanned page is fast because the page is one embedded image; the upload of 28 MB takes longer than the render. At 150 DPI the same page would be 1275 x 1650, a quarter of the pixels, which is enough for screen reading but not for re-printing the scan.',
      },
    ],
    whenNotToUse:
      'Do not render a PDF to JPG when you need the text to stay selectable or searchable: the result is pixels, and a screen reader or a search index gets nothing. Do not use JPG for pages that are mostly sharp text and line art if you will zoom in, since JPEG compression leaves faint ringing around edges; the PNG variant is cleaner there. Documents longer than 500 pages are refused outright, and very high DPI on a long document produces a large ZIP, so render only the pages you actually need. And if the goal is to edit the PDF content rather than picture it, a PDF editor is the right tool.',
    primaryKeyword: 'pdf to jpg',
    secondaryKeywords: [
      'pdf to image',
      'pdf page to jpg',
      'convert pdf to jpg',
      'pdf to jpeg',
      'pdf to jpg converter',
    ],
  },
  {
    slug: 'pdf-to-png',
    name: 'PDF to PNG',
    h1: 'Convert PDF to PNG Online Free',
    tagline:
      'Render every page of a PDF to crisp, lossless PNG images — ideal for text, diagrams, and editing.',
    metaTitle: 'Convert PDF to PNG Online Free | Media Manipulator',
    metaDescription:
      `Free online PDF to PNG converter. Render every page of a PDF to crisp, lossless PNG images, downloaded as a ZIP. No signup. ${RETENTION_PROMISE}.`,
    ogTitle: 'Convert PDF to PNG Online Free',
    ogDescription:
      'Render every page of a PDF to crisp, lossless PNG images. Free, fast, no signup.',
    category: 'image',
    embed: {
      defaultMediaKind: 'pdf',
      defaultTask: 'pdf_to_png',
      defaultOutputFormat: 'png',
      acceptOverride: 'application/pdf',
      pdfDefaultOutputFormat: 'png',
      pdfLockOutputFormat: true,
      pdfDefaultPageSelection: 'all',
      pdfDefaultDpi: 150,
      title: 'Convert PDF to PNG',
      description:
        'Upload a PDF. Each page is rendered to a lossless PNG image. Choose "all pages" for a ZIP, or "first page only" for a single PNG. Pick a render DPI for sharper output.',
    },
    intro:
      'PNG is the best choice when a PDF page has crisp text, thin lines, or diagrams you want to keep razor-sharp. Media Manipulator renders each page to a lossless PNG with Poppler, so there are no JPEG artifacts around text. Choose every page or just the first, and pick the resolution.',
    whatItDoes: [
      'Renders each PDF page to a lossless PNG image at the DPI you choose.',
      'Converts all pages (downloaded as a ZIP) or just the first page (a single PNG).',
      'Names multi-page output clearly: page-001.png, page-002.png, and so on.',
      'Keeps text and line art crisp with lossless PNG encoding.',
    ],
    flowSteps: [
      { title: 'Upload PDF', description: 'Drop in any .pdf document.' },
      { title: 'Pick pages and DPI', description: 'All pages or first only; 150 DPI is a good default.' },
      { title: 'Render to PNG', description: 'Poppler rasterizes each page to a lossless PNG.' },
      { title: 'Download', description: 'Get a single PNG, or a ZIP of one PNG per page.' },
    ],
    advancedDetails: [
      'Rendering uses Poppler (pdftoppm) for accurate, faithful page output.',
      'PNG is lossless, so it is the better choice than JPG when the page is mostly text, diagrams, or sharp graphics.',
      'Higher DPI yields sharper, larger images — 150 DPI suits screens, 300 DPI suits print.',
      'Rendered PNGs have a white background; PDF pages are opaque, so there is no transparency to preserve.',
    ],
    whyItMatters: [
      'Lossless PNG keeps small text and thin lines readable with no artifacts.',
      'PNG pages drop cleanly into editors, docs, and design tools.',
      'A rendered page captures the exact visual layout of the document.',
    ],
    useCases: [
      { title: 'Diagrams and schematics', description: 'Render technical pages without artifacts.' },
      { title: 'Markup and review', description: 'Open a crisp page in an editor to annotate.' },
      { title: 'Design assets', description: 'Pull a clean page graphic into a design tool.' },
      { title: 'Thumbnails', description: 'Generate a sharp PNG preview of the first page.' },
    ],
    whyMediaManipulator: [
      'Lossless PNG rendering keeps text and edges sharp.',
      'Clear, tidy ZIP packaging with sortable page-numbered filenames.',
    ],
    privacyNote: privacyNoteFor('image', 'Your PDF\'s pages are rendered to PNG images with Poppler on our server and, for more than one page, packed into a ZIP.'),
    supportedFormats: {
      supportedInputFormats: ['pdf'],
      supportedOutputFormats: ['png', 'zip (one png per page)'],
      processingNotes: [
        'All-pages output is delivered as a .zip; first-page output is a single .png.',
        'Rendered pages have a white background — PDF pages are opaque, so there is no transparency.',
      ],
    },
    faq: [
      {
        question: 'How do I convert a PDF to PNG for free?',
        answer:
          'Upload your .pdf above, choose all pages or just the first, pick a DPI, and click convert.',
      },
      {
        question: 'Why choose PNG over JPG for a PDF?',
        answer:
          'PNG is lossless, so it keeps text, thin lines, and diagrams crisp with no compression artifacts. JPG is better when you want smaller files for photo-heavy pages.',
      },
      {
        question: 'Will I get one image or many?',
        answer:
          'Choose "all pages" to get a ZIP with one PNG per page (page-001.png, …), or "first page only" for a single PNG.',
      },
      {
        question: 'Do the PNGs have a transparent background?',
        answer:
          'No — PDF pages are opaque, so rendered pages have a white background. There is no transparency to preserve.',
      },
    ],
    related: [
      { label: 'PDF to JPG', to: '/tools/pdf-to-jpg', description: 'Render PDF pages to compact JPG instead.' },
      { label: 'PDF converter', to: '/tools/pdf-converter', description: 'Convert PDFs to images and images to PDF.' },
      { label: 'Image converter', to: '/tools/image-converter', description: 'Convert the rendered images between formats.' },
      { label: 'Image to PDF', to: '/tools/image-to-pdf', description: 'Go the other way: turn images into a PDF.' },
    ],
    primaryKeyword: 'pdf to png',
    secondaryKeywords: [
      'pdf page to png',
      'convert pdf to png',
      'pdf to image',
      'pdf to png converter',
      'pdf to transparent png',
    ],
  },
  {
    slug: 'pdf-converter',
    name: 'PDF Converter',
    h1: 'Free PDF Converter Online',
    tagline:
      'Convert PDFs to JPG or PNG images, and turn images into PDFs — all in one place.',
    metaTitle: 'Free PDF Converter Online | Media Manipulator',
    metaDescription:
      `Free online PDF converter. Convert PDF to JPG or PNG images, and convert images to PDF. No signup, no watermarks. ${RETENTION_PROMISE}.`,
    ogTitle: 'Free PDF Converter Online',
    ogDescription:
      'Convert PDF to JPG/PNG images and images to PDF — all in one free tool. No signup.',
    category: 'image',
    embed: {
      defaultMediaKind: 'pdf',
      defaultTask: 'pdf_converter',
      acceptOverride: 'application/pdf,image/*',
      pdfDefaultOutputFormat: 'jpg',
      pdfDefaultPageSelection: 'all',
      pdfDefaultDpi: 150,
      title: 'Convert a PDF or an image',
      description:
        'Upload a PDF to render its pages to JPG or PNG images, or upload an image to turn it into a PDF. The form adapts to whichever file you choose.',
    },
    intro:
      'The PDF converter handles both directions in one place: render a PDF’s pages to JPG or PNG images, or wrap an image into a PDF document. Upload a PDF and you get image-export controls; upload an image and you get image-to-PDF. Everything runs on our own servers.',
    whatItDoes: [
      'Converts PDF pages to JPG or PNG at the resolution you choose.',
      'Converts JPG, PNG, and other images into single-page PDFs.',
      'Packages multi-page PDF exports into a tidy ZIP of numbered images.',
      'Adapts the form automatically to the file you upload.',
    ],
    flowSteps: [
      { title: 'Upload a file', description: 'Drop in a PDF, or an image like JPG or PNG.' },
      { title: 'Pick your output', description: 'For a PDF, choose JPG/PNG, pages, and DPI; for an image, the output is PDF.' },
      { title: 'Convert', description: 'We render or wrap your file on our server.' },
      { title: 'Download', description: 'Save a PDF, a single image, or a ZIP of page images.' },
    ],
    advancedDetails: [
      'PDF → image rendering uses Poppler (pdftoppm); image → PDF embeds JPGs losslessly and other formats with lossless Flate compression.',
      'Multi-page PDF exports are delivered as a .zip with sortable page-001/page-002 filenames.',
      'Image-to-PDF sizes the page to the image at 96 DPI; PDF-to-image defaults to 150 DPI and supports up to 300+ for print.',
      'A page-count limit protects against oversized PDFs.',
    ],
    whyItMatters: [
      'One tool covers both common PDF conversion directions.',
      'No need to hunt for a separate tool depending on which way you are converting.',
      'Consistent, server-side quality regardless of your browser or device.',
    ],
    useCases: [
      { title: 'Mixed workflows', description: 'Switch between PDF→image and image→PDF without changing tools.' },
      { title: 'Document prep', description: 'Turn images into PDFs for upload forms.' },
      { title: 'Repurposing', description: 'Render PDF pages to images for slides or social.' },
      { title: 'Quick previews', description: 'Generate a first-page image from any PDF.' },
    ],
    whyMediaManipulator: [
      'Both conversion directions in a single, adaptive tool.',
      'Lossless image→PDF and accurate Poppler PDF→image rendering.',
    ],
    privacyNote: privacyNoteFor('image', 'Your PDF is rendered page by page to images, or your image is wrapped into a PDF, by Poppler and ImageMagick on our server.'),
    supportedFormats: {
      supportedInputFormats: ['pdf', 'jpg', 'jpeg', 'png', 'gif', 'webp'],
      supportedOutputFormats: ['jpg', 'png', 'pdf', 'zip (multi-page export)'],
      processingNotes: [
        'Upload a PDF for PDF→image; upload an image for image→PDF. The form adapts automatically.',
        'All-pages PDF export is delivered as a .zip of numbered images.',
      ],
    },
    faq: [
      {
        question: 'What can the PDF converter do?',
        answer:
          'It converts PDF pages to JPG or PNG images, and converts images (JPG, PNG, and more) into PDF documents — all in one free tool.',
      },
      {
        question: 'How does it know which way to convert?',
        answer:
          'It adapts to your upload: a PDF shows image-export controls (format, pages, DPI), while an image is converted to a PDF.',
      },
      {
        question: 'Can I convert a multi-page PDF to images?',
        answer:
          'Yes. Choose "all pages" and you get a ZIP containing one image per page, named page-001, page-002, and so on.',
      },
    ],
    related: [
      { label: 'PDF to JPG', to: '/tools/pdf-to-jpg', description: 'Render PDF pages to JPG images.' },
      { label: 'PDF to PNG', to: '/tools/pdf-to-png', description: 'Render PDF pages to lossless PNG images.' },
      { label: 'Image to PDF', to: '/tools/image-to-pdf', description: 'Turn any image into a PDF.' },
      { label: 'Convert JPG to PDF', to: '/tools/convert-jpg-to-pdf', description: 'Focused JPG → PDF converter.' },
      { label: 'Convert PNG to PDF', to: '/tools/convert-png-to-pdf', description: 'Focused PNG → PDF converter.' },
      { label: 'Image converter', to: '/tools/image-converter', description: 'Convert between image formats.' },
    ],
    primaryKeyword: 'pdf converter',
    secondaryKeywords: [
      'online pdf converter',
      'convert pdf to image',
      'convert image to pdf',
      'pdf to jpg',
      'free pdf converter',
    ],
  },

  // ------------------------------------------------------------- IMAGE: MODERN / VECTOR / FAVICON
  {
    slug: 'convert-heic-to-jpg',
    name: 'Convert HEIC to JPG',
    h1: 'Convert HEIC to JPG Online Free',
    tagline:
      'Turn iPhone HEIC photos into universally compatible JPG files that open and upload anywhere.',
    metaTitle: 'Convert HEIC to JPG Online Free | Media Manipulator',
    metaDescription:
      `Free online HEIC to JPG converter. Turn iPhone .heic/.heif photos into universally compatible JPG files. No signup. ${RETENTION_PROMISE}.`,
    ogTitle: 'Convert HEIC to JPG Online Free',
    ogDescription:
      'Turn iPhone HEIC photos into universally compatible JPG files. Free, fast, no signup.',
    category: 'image',
    embed: {
      defaultMediaKind: 'image',
      defaultTask: 'heic_to_jpg',
      defaultOutputFormat: 'jpg',
      lockedOutputFormat: 'jpg',
      lockedInputFormat: 'heic',
      acceptOverride: 'image/heic,image/heif,.heic,.heif,image/*',
      title: 'Convert HEIC to JPG',
      description:
        'Upload a HEIC or HEIF photo from your iPhone. The output is locked to JPG, auto-oriented so it appears the right way up, at the quality you choose.',
    },
    intro:
      'HEIC is the high-efficiency format iPhones use to save space, but it won’t open on many Windows PCs, websites, or older apps. Media Manipulator converts your HEIC photos to JPG — the format that works everywhere — with correct orientation and the quality you choose.',
    whatItDoes: [
      'Converts Apple HEIC/HEIF photos to standard JPG.',
      'Auto-orients the image using EXIF so portraits aren’t sideways.',
      'Lets you pick JPG quality to balance file size and fidelity.',
      'Produces a JPG that opens on any device, site, or app.',
    ],
    flowSteps: [
      { title: 'Upload HEIC', description: 'Drop in a .heic or .heif photo from your iPhone.' },
      { title: 'Auto-orient', description: 'We read the EXIF orientation so the photo is upright.' },
      { title: 'Encode JPG', description: 'ImageMagick decodes HEIC (libheif) and writes a JPG.' },
      { title: 'Download JPG', description: 'Save a universally compatible .jpg file.' },
    ],
    advancedDetails: [
      'HEIC decoding relies on ImageMagick built with a libheif delegate. If the server lacks HEIC support, the tool returns a clear error rather than a broken file.',
      'Quality 85–90 is a great default — HEIC is already efficient, so a high-quality JPG keeps the photo looking identical.',
      'EXIF orientation is applied before encoding, which fixes the common “rotated 90°” problem when HEIC is converted naively.',
    ],
    whyItMatters: [
      'Windows, many web upload forms, and older software still cannot open HEIC.',
      'Sharing a JPG guarantees the recipient can view it on any device.',
      'Most print labs and marketplaces require JPG.',
    ],
    useCases: [
      { title: 'Sharing iPhone photos', description: 'Send photos that open on any phone or PC.' },
      { title: 'Web uploads', description: 'Satisfy forms and sites that reject HEIC.' },
      { title: 'Printing', description: 'Convert to JPG before ordering prints.' },
      { title: 'Editing in older apps', description: 'Open your photo in software without HEIC support.' },
    ],
    whyMediaManipulator: [
      'Correct auto-orientation — no sideways photos.',
      'Quality control instead of a fixed preset.',
    ],
    privacyNote: privacyNoteFor('image', 'Your HEIC photo is decoded on our server, turned the right way up and saved as a JPG.'),
    supportedFormats: {
      supportedInputFormats: ['heic', 'heif'],
      supportedOutputFormats: ['jpg'],
      processingNotes: [
        'HEIC decoding requires ImageMagick with a libheif delegate on the server.',
      ],
    },
    faq: [
      {
        question: 'How do I convert HEIC to JPG for free?',
        answer:
          'Upload your .heic photo above, pick a quality, and click convert. You get a standard .jpg back.',
      },
      {
        question: 'Why won’t my HEIC photo open on Windows?',
        answer:
          'HEIC is an Apple-favored format that older Windows versions and many apps can’t read. Converting to JPG makes the photo open everywhere.',
      },
      {
        question: 'Will the photo lose quality?',
        answer:
          'JPG is lossy, but at quality 85–90 the result looks identical to the HEIC original for virtually all photos.',
      },
      {
        question: 'Why was my converted photo rotated before?',
        answer:
          'Naive converters ignore EXIF orientation. We auto-orient the image, so your photo comes out the right way up.',
      },
    ],
    related: [
      { label: 'Image converter', to: '/tools/image-converter', description: 'Convert between JPG, PNG, WebP, AVIF and more.' },
      { label: 'Convert AVIF to JPG', to: '/tools/convert-avif-to-jpg', description: 'Convert modern AVIF photos to JPG.' },
      { label: 'Compress image', to: '/tools/compress-image', description: 'Shrink the JPG for the web.' },
      { label: 'Image converter tutorial', to: '/tutorials/image/getting-started', description: 'Walk through every image option.' },
    ],
    primaryKeyword: 'heic to jpg',
    secondaryKeywords: [
      'convert heic to jpg',
      'heic to jpeg',
      'iphone photo to jpg',
      '.heic to .jpg',
      'heic converter',
    ],
  },
  {
    slug: 'convert-avif-to-jpg',
    name: 'Convert AVIF to JPG',
    h1: 'Convert AVIF to JPG Online Free',
    tagline:
      'Turn modern AVIF images into universally compatible JPG files for apps and sites that don’t accept AVIF.',
    metaTitle: 'Convert AVIF to JPG Online Free | Media Manipulator',
    metaDescription:
      `Free online AVIF to JPG converter. Turn .avif images into universally compatible JPG files at the quality you choose. No signup. ${RETENTION_PROMISE}.`,
    ogTitle: 'Convert AVIF to JPG Online Free',
    ogDescription:
      'Turn modern AVIF images into universally compatible JPG files. Free, fast, no signup.',
    category: 'image',
    embed: {
      defaultMediaKind: 'image',
      defaultTask: 'avif_to_jpg',
      defaultOutputFormat: 'jpg',
      lockedOutputFormat: 'jpg',
      lockedInputFormat: 'avif',
      acceptOverride: 'image/avif,.avif,image/*',
      title: 'Convert AVIF to JPG',
      description:
        'Upload an AVIF image. The output is locked to JPG, so you get a file every app, editor, and upload form accepts, at the quality you choose.',
    },
    intro:
      'AVIF is a cutting-edge image format that produces tiny files, but plenty of apps, editors, and upload forms still can’t open it. Media Manipulator converts AVIF to JPG so your image works everywhere. Pick a quality and download.',
    whatItDoes: [
      'Converts AVIF images to standard JPG.',
      'Flattens any transparency onto a background, since JPG has no alpha.',
      'Lets you choose JPG quality for the size/fidelity balance you want.',
      'Produces a JPG that opens on any device or app.',
    ],
    flowSteps: [
      { title: 'Upload AVIF', description: 'Drop in a .avif image.' },
      { title: 'Pick JPG quality', description: '85 is a balanced default.' },
      { title: 'Encode JPG', description: 'ImageMagick decodes AVIF (libaom/libheif) and writes a JPG.' },
      { title: 'Download JPG', description: 'Save a universally compatible .jpg.' },
    ],
    advancedDetails: [
      'AVIF decoding relies on ImageMagick built with an AVIF delegate (libaom or libheif). If the server lacks AVIF support, the tool returns a clear error.',
      'AVIF supports transparency; when converting to JPG, transparent areas are flattened because JPG has no alpha channel. Use AVIF → PNG to keep transparency.',
      'Quality 85–90 keeps the JPG visually identical to the AVIF for most images.',
    ],
    whyItMatters: [
      'Many apps and upload forms still don’t support AVIF.',
      'JPG guarantees the recipient can open the image.',
      'Converting lets you use an AVIF download anywhere you need a JPG.',
    ],
    useCases: [
      { title: 'Saving web images', description: 'Convert an AVIF you downloaded into a usable JPG.' },
      { title: 'App compatibility', description: 'Open an AVIF in software that lacks AVIF support.' },
      { title: 'Uploads', description: 'Meet a form that only accepts JPG.' },
      { title: 'Printing', description: 'Produce a JPG for a photo lab.' },
    ],
    whyMediaManipulator: [
      'Quality control instead of a one-size-fits-all preset.',
      'Runs on our own servers — no third-party processing.',
    ],
    privacyNote: privacyNoteFor('image', 'Your AVIF is decoded on our server and re-encoded as a JPG at the quality you set.'),
    supportedFormats: {
      supportedInputFormats: ['avif'],
      supportedOutputFormats: ['jpg'],
      processingNotes: [
        'AVIF decoding requires ImageMagick with an AVIF delegate on the server. Transparency is flattened in JPG output.',
      ],
    },
    faq: [
      {
        question: 'How do I convert AVIF to JPG for free?',
        answer:
          'Upload your .avif image above, pick a quality, and click convert. You get a standard .jpg back.',
      },
      {
        question: 'Why can’t I open AVIF files?',
        answer:
          'AVIF is a newer format; many apps, editors, and websites haven’t added support yet. Converting to JPG makes the image open everywhere.',
      },
      {
        question: 'What about transparency?',
        answer:
          'JPG has no transparency, so transparent AVIF areas are flattened onto a background. If you need to keep transparency, use the AVIF → PNG tool.',
      },
      {
        question: 'Will I lose quality?',
        answer:
          'At quality 85–90 the JPG looks essentially identical to the AVIF for most images.',
      },
    ],
    related: [
      { label: 'Convert AVIF to PNG', to: '/tools/convert-avif-to-png', description: 'Keep transparency with a PNG instead.' },
      { label: 'Image converter', to: '/tools/image-converter', description: 'Convert between JPG, PNG, WebP, AVIF and more.' },
      { label: 'Convert HEIC to JPG', to: '/tools/convert-heic-to-jpg', description: 'Convert iPhone HEIC photos to JPG.' },
      { label: 'Compress image', to: '/tools/compress-image', description: 'Shrink the JPG for the web.' },
    ],
    primaryKeyword: 'avif to jpg',
    secondaryKeywords: [
      'convert avif to jpg',
      'avif to jpeg',
      '.avif to .jpg',
      'avif converter',
      'open avif file',
    ],
  },
  {
    slug: 'convert-avif-to-png',
    name: 'Convert AVIF to PNG',
    h1: 'Convert AVIF to PNG Online Free',
    tagline:
      'Turn AVIF images into lossless PNG files that open everywhere and keep full transparency.',
    metaTitle: 'Convert AVIF to PNG Online Free | Media Manipulator',
    metaDescription:
      `Free online AVIF to PNG converter. Turn .avif images into lossless PNG files that preserve transparency and open in any editor. No signup. ${RETENTION_PROMISE}.`,
    ogTitle: 'Convert AVIF to PNG Online Free',
    ogDescription:
      'Turn AVIF images into lossless, transparency-preserving PNG files. Free, fast, no signup.',
    category: 'image',
    embed: {
      defaultMediaKind: 'image',
      defaultTask: 'avif_to_png',
      defaultOutputFormat: 'png',
      lockedOutputFormat: 'png',
      lockedInputFormat: 'avif',
      acceptOverride: 'image/avif,.avif,image/*',
      title: 'Convert AVIF to PNG',
      description:
        'Upload an AVIF image. The output is locked to PNG, so transparency is preserved and the file opens losslessly in any editor or viewer.',
    },
    intro:
      'When an AVIF image has transparency — like a logo or a cutout — converting to JPG would flatten it. PNG keeps the alpha channel and is lossless, so it’s the right target for graphics. Media Manipulator converts AVIF to PNG with transparency intact.',
    whatItDoes: [
      'Converts AVIF images to lossless PNG.',
      'Preserves the alpha channel so transparent AVIFs stay transparent.',
      'Produces a PNG that opens in any editor, viewer, or design tool.',
      'The image is preserved pixel for pixel when the AVIF becomes a PNG.',
    ],
    flowSteps: [
      { title: 'Upload AVIF', description: 'Drop in a .avif image, transparent or solid.' },
      { title: 'Decode AVIF', description: 'ImageMagick decodes the AVIF with its AVIF delegate.' },
      { title: 'Encode PNG', description: 'A lossless PNG is written with transparency preserved.' },
      { title: 'Download PNG', description: 'Save a transparency-preserving .png file.' },
    ],
    advancedDetails: [
      'AVIF decoding relies on ImageMagick built with an AVIF delegate (libaom or libheif). If the server lacks AVIF support, the tool returns a clear error.',
      'Transparency in the AVIF is preserved as a PNG alpha channel.',
      'PNG is lossless, so the output is usually larger than the source AVIF — the trade-off for universal compatibility and transparency.',
    ],
    whyItMatters: [
      'PNG keeps transparency that JPG would destroy — essential for logos and cutouts.',
      'Some editors and apps can’t open AVIF; PNG opens everywhere.',
      'PNG is a safe, lossless interchange format for graphics.',
    ],
    useCases: [
      { title: 'Transparent logos', description: 'Convert a transparent AVIF logo to a usable PNG.' },
      { title: 'Design handoffs', description: 'Provide a PNG to tools that don’t read AVIF.' },
      { title: 'Editing', description: 'Open the image losslessly in your editor.' },
      { title: 'Web assets', description: 'Keep a PNG fallback for older browsers.' },
    ],
    whyMediaManipulator: [
      'Transparency preserved automatically.',
      'Lossless PNG output for graphics work.',
    ],
    privacyNote: privacyNoteFor('image', 'Your AVIF is decoded on our server and saved as a lossless PNG with its transparency intact.'),
    supportedFormats: {
      supportedInputFormats: ['avif'],
      supportedOutputFormats: ['png'],
      processingNotes: [
        'AVIF decoding requires ImageMagick with an AVIF delegate. Transparency is preserved in the PNG output.',
      ],
    },
    faq: [
      {
        question: 'How do I convert AVIF to PNG for free?',
        answer:
          'Upload your .avif image above and click convert — the output is a lossless .png with transparency preserved.',
      },
      {
        question: 'Does AVIF to PNG keep transparency?',
        answer:
          'Yes. PNG supports an alpha channel, so a transparent AVIF stays transparent after conversion.',
      },
      {
        question: 'Should I pick PNG or JPG for my AVIF?',
        answer:
          'Choose PNG when you need transparency or lossless quality (logos, graphics). Choose JPG for the smallest file when the image is a photo with no transparency.',
      },
      {
        question: 'Why is the PNG larger than the AVIF?',
        answer:
          'AVIF is a highly efficient compressed format, while PNG is lossless, so the PNG is typically larger. That’s expected.',
      },
    ],
    related: [
      { label: 'Convert AVIF to JPG', to: '/tools/convert-avif-to-jpg', description: 'Convert AVIF to a compact JPG instead.' },
      { label: 'Image converter', to: '/tools/image-converter', description: 'Convert between JPG, PNG, WebP, AVIF and more.' },
      { label: 'Convert HEIC to JPG', to: '/tools/convert-heic-to-jpg', description: 'Convert iPhone HEIC photos to JPG.' },
      { label: 'Remove background from image', to: '/tools/remove-background-from-image', description: 'Make a transparent PNG cutout automatically.' },
    ],
    primaryKeyword: 'avif to png',
    secondaryKeywords: [
      'convert avif to png',
      '.avif to .png',
      'avif to transparent png',
      'avif converter',
      'avif to png online',
    ],
  },
  {
    slug: 'convert-svg-to-png',
    name: 'Convert SVG to PNG',
    h1: 'Convert SVG to PNG Online Free',
    tagline:
      'Rasterize SVG icons and logos into PNG images at any size for uploads, slides, and apps.',
    metaTitle: 'Convert SVG to PNG Online Free | Media Manipulator',
    metaDescription:
      `Free online SVG to PNG converter. Rasterize SVG icons and logos into PNG images at the size you choose. No signup. ${RETENTION_PROMISE}.`,
    ogTitle: 'Convert SVG to PNG Online Free',
    ogDescription:
      'Rasterize SVG icons and logos into PNG images at any size. Free, fast, no signup.',
    category: 'image',
    embed: {
      defaultMediaKind: 'image',
      defaultTask: 'svg_to_png',
      defaultOutputFormat: 'png',
      lockedOutputFormat: 'png',
      lockedInputFormat: 'svg',
      acceptOverride: 'image/svg+xml,.svg',
      title: 'Convert SVG to PNG',
      description:
        'Upload an SVG. The output is locked to PNG. Optionally set a width or height to control the rendered resolution — leave them blank to use the SVG’s natural size.',
    },
    intro:
      'SVGs are perfect vectors, but many platforms — social networks, marketplaces, slide tools, and apps — only accept raster images like PNG. Media Manipulator rasterizes your SVG into a crisp, transparency-preserving PNG at the size you choose. SVGs are processed as untrusted input with a safe renderer.',
    whatItDoes: [
      'Rasterizes SVG vector files into PNG images.',
      'Lets you set a target width and/or height for the output resolution.',
      'Preserves transparency from the SVG in the PNG.',
      'Renders with a safe rasterizer that does not fetch external network resources.',
    ],
    flowSteps: [
      { title: 'Upload SVG', description: 'Drop in a .svg icon, logo, or illustration.' },
      { title: 'Set the size (optional)', description: 'Pick a width/height, or use the SVG’s natural size.' },
      { title: 'Rasterize', description: 'The SVG is rendered to a pixel image on our server.' },
      { title: 'Download PNG', description: 'Save a crisp, transparency-preserving .png.' },
    ],
    advancedDetails: [
      'Rendering uses rsvg-convert (librsvg) when available — it does not load remote resources by default — with ImageMagick as a hardened fallback.',
      'Because SVG is a vector, you can render at any resolution without quality loss; pick a larger width for sharper output.',
      'Uploaded SVGs are treated as untrusted input and processed with network access disabled to avoid SSRF/external-fetch risks.',
    ],
    whyItMatters: [
      'Most upload forms and social platforms reject SVG but accept PNG.',
      'Rasterizing at a chosen size guarantees crisp output for that use.',
      'PNG keeps the transparency that icons and logos rely on.',
    ],
    useCases: [
      { title: 'Social and uploads', description: 'Turn an SVG logo into a PNG a platform accepts.' },
      { title: 'Presentations', description: 'Drop a crisp PNG of an icon into a slide.' },
      { title: 'App assets', description: 'Export a PNG at the exact size your app needs.' },
      { title: 'Email', description: 'Use a PNG where SVG isn’t supported.' },
    ],
    whyMediaManipulator: [
      'Render at any size with no quality loss — vectors scale perfectly.',
      'Safe SVG handling with external fetches disabled.',
    ],
    privacyNote: privacyNoteFor('image', 'Your SVG is rendered to a PNG by librsvg on our server, with external images and fonts it references left unfetched.'),
    supportedFormats: {
      supportedInputFormats: ['svg'],
      supportedOutputFormats: ['png'],
      processingNotes: [
        'Rendered with rsvg-convert (preferred) or a hardened ImageMagick fallback. External network fetches from the SVG are disabled.',
      ],
    },
    faq: [
      {
        question: 'How do I convert SVG to PNG for free?',
        answer:
          'Upload your .svg above, optionally set a width or height, and click convert. You get a crisp .png back.',
      },
      {
        question: 'What size will the PNG be?',
        answer:
          'By default it uses the SVG’s natural size. Set a width and/or height to render larger or smaller — vectors scale without quality loss.',
      },
      {
        question: 'Does the PNG keep transparency?',
        answer:
          'Yes. Transparent areas of the SVG are preserved as transparency in the PNG.',
      },
      {
        question: 'Is it safe to upload an SVG?',
        answer:
          'Yes. We treat SVGs as untrusted input and render them with external network fetches disabled, so embedded remote references can’t be loaded.',
      },
    ],
    related: [
      { label: 'Convert PNG to SVG', to: '/tools/convert-png-to-svg', description: 'Go the other way: vectorize a PNG into SVG.' },
      { label: 'Image converter', to: '/tools/image-converter', description: 'Convert between JPG, PNG, WebP, AVIF and more.' },
      { label: 'PNG to ICO', to: '/tools/png-to-ico', description: 'Turn the PNG into a favicon.' },
    ],
    primaryKeyword: 'svg to png',
    secondaryKeywords: [
      'convert svg to png',
      'svg to png converter',
      'rasterize svg',
      '.svg to .png',
      'svg to image',
    ],
  },
  {
    slug: 'convert-png-to-svg',
    name: 'Convert PNG to SVG',
    h1: 'Convert PNG to SVG Online Free',
    tagline:
      'Vectorize logos, icons, and line art from PNG into real, scalable SVG paths with potrace.',
    metaTitle: 'Convert PNG to SVG Online Free | Media Manipulator',
    metaDescription:
      `Free online PNG to SVG vectorizer. Trace logos, icons, and line art into real scalable SVG paths. Best for simple graphics, not photos. No signup. ${RETENTION_PROMISE}.`,
    ogTitle: 'Convert PNG to SVG Online Free',
    ogDescription:
      'Vectorize logos, icons, and line art from PNG into real, scalable SVG paths. Free, no signup.',
    category: 'image',
    embed: {
      defaultMediaKind: 'image',
      defaultTask: 'png_to_svg',
      defaultOutputFormat: 'svg',
      lockedOutputFormat: 'svg',
      lockedInputFormat: 'png',
      acceptOverride: 'image/png,.png,image/*',
      title: 'Vectorize PNG to SVG',
      description:
        'Upload a PNG. The output is locked to SVG and produced by real vectorization (potrace), not a raster wrapped in SVG. Adjust the black/white threshold to capture more or less detail. Best for logos, icons, signatures, and line art.',
    },
    intro:
      'True PNG-to-SVG conversion means tracing your image into real vector paths that scale to any size without pixelation. Media Manipulator uses potrace to vectorize your PNG — ideal for logos, icons, signatures, and black-and-white line art. This is genuine vectorization, not a PNG hidden inside an SVG. It is not designed to turn photographs into clean vector art.',
    whatItDoes: [
      'Traces a PNG into real, scalable SVG vector paths using potrace.',
      'Reduces the image to a clean black/white bitmap, then vectorizes the shapes.',
      'Lets you tune the black/white threshold to capture more or less detail.',
      'Outputs a true .svg — not a raster image wrapped in an <image> tag.',
    ],
    flowSteps: [
      { title: 'Upload PNG', description: 'Drop in a logo, icon, signature, or line-art PNG.' },
      { title: 'Set the threshold', description: 'Pick the black/white cutoff to control detail.' },
      { title: 'Trace to vectors', description: 'ImageMagick prepares a bitmap; potrace traces the paths.' },
      { title: 'Download SVG', description: 'Save a real, scalable .svg file.' },
    ],
    advancedDetails: [
      'The pipeline flattens the PNG to a bilevel bitmap (ImageMagick threshold) and then runs potrace to produce smooth Bézier vector paths.',
      'Vectorization works best on high-contrast, simple graphics: logos, icons, monograms, signatures, and black-and-white line art.',
      'It will not faithfully reproduce photographs or complex gradients — tracing a photo produces large, messy paths, not clean vector art.',
      'Raise the threshold to capture finer/lighter detail; lower it to keep only the boldest shapes.',
    ],
    whyItMatters: [
      'Vector logos scale to any size — from a favicon to a billboard — without pixelation.',
      'SVGs are tiny for simple graphics and editable in vector tools like Illustrator or Inkscape.',
      'Recovering a vector from a PNG logo saves recreating it from scratch.',
    ],
    useCases: [
      { title: 'Logo recovery', description: 'Vectorize a PNG logo you no longer have the source for.' },
      { title: 'Icons and monograms', description: 'Turn a simple icon into a scalable SVG.' },
      { title: 'Signatures', description: 'Vectorize a scanned signature for clean reuse.' },
      { title: 'Line art', description: 'Trace black-and-white artwork into editable paths.' },
    ],
    whyMediaManipulator: [
      'Real potrace vectorization — honest about what it’s good at (and not).',
      'Threshold control so you can dial in the trace.',
    ],
    privacyNote: privacyNoteFor('image', 'Your image is reduced to black and white and traced into vector paths by potrace on our server.'),
    supportedFormats: {
      supportedInputFormats: ['png', 'jpg', 'gif'],
      supportedOutputFormats: ['svg'],
      processingNotes: [
        'Vectorization requires potrace on the server. Best for logos/icons/line art — not photographs.',
      ],
    },
    faq: [
      {
        question: 'How do I convert a PNG to SVG for free?',
        answer:
          'Upload your .png above, adjust the threshold if needed, and click convert. You get a real vector .svg back.',
      },
      {
        question: 'Is this real vectorization or just a wrapped PNG?',
        answer:
          'It is real vectorization. We trace the image into actual SVG paths with potrace — we do not embed the PNG inside an SVG and call it a day.',
      },
      {
        question: 'Will it vectorize my photo?',
        answer:
          'Not well. Vectorization is designed for logos, icons, signatures, and line art. Photographs and complex gradients produce large, messy paths rather than clean vectors.',
      },
      {
        question: 'What does the threshold control do?',
        answer:
          'It sets the black/white cutoff before tracing. Raise it to capture more (lighter) detail; lower it to keep only the boldest shapes.',
      },
    ],
    related: [
      { label: 'Convert SVG to PNG', to: '/tools/convert-svg-to-png', description: 'Go the other way: rasterize an SVG to PNG.' },
      { label: 'Image converter', to: '/tools/image-converter', description: 'Convert between JPG, PNG, WebP, AVIF and more.' },
      { label: 'PNG to ICO', to: '/tools/png-to-ico', description: 'Turn a PNG into a favicon.' },
    ],
    primaryKeyword: 'png to svg',
    secondaryKeywords: [
      'convert png to svg',
      'vectorize png',
      'png to svg converter',
      'image to vector',
      'png to vector',
    ],
  },
  {
    slug: 'png-to-ico',
    name: 'PNG to ICO',
    h1: 'Convert PNG to ICO Online Free',
    tagline:
      'Turn a PNG into a real multi-size .ico favicon for websites and Windows app icons.',
    metaTitle: 'Convert PNG to ICO Online Free | Media Manipulator',
    metaDescription:
      `Free online PNG to ICO converter. Generate a real multi-size .ico favicon (16–256px) for websites and Windows icons. No signup. ${RETENTION_PROMISE}.`,
    ogTitle: 'Convert PNG to ICO Online Free',
    ogDescription:
      'Generate a real multi-size .ico favicon from a PNG. Free, fast, no signup.',
    category: 'image',
    embed: {
      defaultMediaKind: 'image',
      defaultTask: 'png_to_ico',
      defaultOutputFormat: 'ico',
      lockedOutputFormat: 'ico',
      lockedInputFormat: 'png',
      acceptOverride: 'image/png,.png,image/*',
      title: 'Convert PNG to ICO',
      description:
        'Upload a PNG (a square image works best). The output is locked to ICO, and a real multi-size icon is generated containing 16, 32, 48, 64, 128, and 256 px versions.',
    },
    intro:
      'A favicon needs to be a real .ico file containing several sizes so browsers and Windows can pick the right one. Media Manipulator generates a genuine multi-size ICO from your PNG — not a renamed file — packing the standard 16–256 px icon ladder.',
    whatItDoes: [
      'Generates a real .ico container from a PNG image.',
      'Packs multiple sizes (16, 32, 48, 64, 128, 256 px) into one file.',
      'Preserves transparency so the icon sits cleanly on any background.',
      'Produces a file browsers and Windows accept as a favicon/app icon.',
    ],
    flowSteps: [
      { title: 'Upload PNG', description: 'Drop in a PNG — a square image gives the best icon.' },
      { title: 'Generate sizes', description: 'We render each standard icon size from your image.' },
      { title: 'Pack ICO', description: 'The sizes are packed into one real .ico container.' },
      { title: 'Download ICO', description: 'Save favicon.ico for your site or app.' },
    ],
    advancedDetails: [
      'The ICO is built with ImageMagick’s icon auto-resize, producing a true multi-image container — not a renamed PNG.',
      'Including several sizes lets browsers and Windows pick the sharpest icon for each context (tab, taskbar, desktop).',
      'For the cleanest result, start from a square PNG at 256×256 or larger so every size downsamples crisply.',
    ],
    whyItMatters: [
      'Browsers expect a real .ico favicon; a renamed PNG can fail or look blurry.',
      'A multi-size icon stays sharp from a 16px tab to a 256px desktop shortcut.',
      'Windows app icons require the .ico format.',
    ],
    useCases: [
      { title: 'Website favicons', description: 'Generate favicon.ico for your site’s tab icon.' },
      { title: 'Windows app icons', description: 'Create an .ico for a desktop application.' },
      { title: 'Shortcuts', description: 'Make a crisp icon for a desktop shortcut.' },
      { title: 'Branding', description: 'Turn a logo PNG into a proper icon file.' },
    ],
    whyMediaManipulator: [
      'A genuine multi-size ICO, not a renamed PNG.',
      'Transparency preserved for clean icons.',
    ],
    privacyNote: privacyNoteFor('image', 'Your image is resized to each standard icon size and packed into one .ico file by ImageMagick on our server.'),
    supportedFormats: {
      supportedInputFormats: ['png', 'jpg', 'webp'],
      supportedOutputFormats: ['ico'],
      processingNotes: [
        'A multi-size ICO (16/32/48/64/128/256 px) is generated. Start from a square image for the best result.',
      ],
    },
    faq: [
      {
        question: 'How do I convert a PNG to ICO for free?',
        answer:
          'Upload your .png above and click convert — you get a real multi-size .ico back.',
      },
      {
        question: 'Is this a real ICO or a renamed PNG?',
        answer:
          'A real ICO. We generate several icon sizes and pack them into a true .ico container, which is what browsers and Windows expect.',
      },
      {
        question: 'What sizes are included?',
        answer:
          'The standard favicon ladder: 16, 32, 48, 64, 128, and 256 px. Browsers and Windows pick the best size for each context.',
      },
      {
        question: 'What image works best?',
        answer:
          'A square PNG at 256×256 or larger gives the crispest result, since every smaller size downsamples cleanly from it.',
      },
    ],
    related: [
      { label: 'Image converter', to: '/tools/image-converter', description: 'Convert between JPG, PNG, WebP, AVIF and more.' },
      { label: 'Convert SVG to PNG', to: '/tools/convert-svg-to-png', description: 'Rasterize an SVG logo before making an icon.' },
      { label: 'Image resizer', to: '/tools/image-resizer', description: 'Make a square image before generating the icon.' },
      { label: 'Remove background from image', to: '/tools/remove-background-from-image', description: 'Make a transparent icon source.' },
    ],
    primaryKeyword: 'png to ico',
    secondaryKeywords: [
      'convert png to ico',
      'png to favicon',
      'favicon generator',
      '.png to .ico',
      'create ico file',
    ],
  },
  {
    slug: 'svg-converter',
    name: 'SVG Converter',
    h1: 'Free SVG Converter Online',
    tagline:
      "Rasterise SVG to PNG or trace a PNG into SVG: the image converter with an SVG starting point.",
    metaTitle: 'Free SVG Converter Online | Media Manipulator',
    metaDescription:
      `Free online SVG converter. Rasterize SVG to PNG, or vectorize PNG to a real SVG. No signup, no watermarks. ${RETENTION_PROMISE}.`,
    ogTitle: 'Free SVG Converter Online',
    ogDescription:
      'Rasterize SVG to PNG and vectorize PNG to SVG — all in one free tool. No signup.',
    category: 'image',
    embed: {
      defaultMediaKind: 'image',
      defaultTask: 'svg_converter',
      defaultOutputFormat: 'png',
      acceptOverride: 'image/svg+xml,.svg,image/*',
      title: 'Convert an SVG (or to SVG)',
      description:
        'Upload an SVG to rasterize it to PNG, or upload a PNG and choose SVG output to vectorize it. The form adapts to your file and chosen output.',
    },
    intro:
      "The SVG converter is the Media Manipulator image converter set up for vector work. It accepts SVG files as input and preselects PNG as the output, and if you upload a raster image instead you can choose SVG as the output to trace it. Both directions are part of the main image converter. SVG to PNG renders the drawing with librsvg at the size you ask for and keeps transparency; external resources referenced by the file are not fetched. PNG to SVG traces the image with potrace into real vector paths, which works well for logos, icons, signatures and line art and badly for photographs, because potrace works on a two-colour bitmap. The image converter page is the canonical version of this tool and covers every input and output format, quality settings and the upload limits for guests and free accounts. Upload an SVG or a simple PNG below.",
    whatItDoes: [
      'Rasterizes SVG files into PNG images at the size you choose.',
      'Vectorizes PNG/raster logos and line art into real SVG paths (potrace).',
      'Preserves transparency when rasterizing SVG to PNG.',
      'Renders SVGs safely with external network fetches disabled.',
    ],
    flowSteps: [
      { title: 'Upload your file', description: 'Drop in an SVG (to rasterize) or a PNG (to vectorize).' },
      { title: 'Pick the output', description: 'SVG → PNG, or choose SVG output to vectorize a raster.' },
      { title: 'Convert', description: 'We render or trace your file on our server.' },
      { title: 'Download', description: 'Save your PNG or real vector SVG.' },
    ],
    advancedDetails: [
      'SVG → PNG uses rsvg-convert (librsvg) when available, with a hardened ImageMagick fallback, and disables external resource loading.',
      'PNG → SVG uses potrace to trace a bilevel bitmap into smooth vector paths — best for logos, icons, and line art, not photos.',
      'Vector output scales to any size without quality loss; raster output is rendered at the resolution you request.',
    ],
    whyItMatters: [
      'One tool covers both common SVG conversion directions.',
      'Vectors and rasters each have their place — switch freely without hunting for a second tool.',
      'Safe SVG handling protects against external-fetch risks.',
    ],
    useCases: [
      { title: 'Platform uploads', description: 'Rasterize an SVG to PNG where vectors aren’t accepted.' },
      { title: 'Logo recovery', description: 'Vectorize a PNG logo back into editable SVG paths.' },
      { title: 'Design prep', description: 'Move between vector and raster as a project needs.' },
      { title: 'Icon work', description: 'Render or trace icons at the exact fidelity you need.' },
    ],
    whyMediaManipulator: [
      'Both SVG conversion directions in one adaptive tool.',
      'Real potrace vectorization and safe SVG rasterization.',
      `Free, no signup, no watermarks. ${RETENTION_PROMISE}.`,
    ],
    privacyNote: sharedPrivacyNote,
    supportedFormats: {
      supportedInputFormats: ['svg', 'png', 'jpg', 'gif'],
      supportedOutputFormats: ['png', 'svg'],
      processingNotes: [
        'SVG → PNG uses a safe rasterizer with external fetches disabled. PNG → SVG uses potrace and is best for simple graphics.',
      ],
    },
    faq: [
      {
        question: 'What can the SVG converter do?',
        answer:
          'It rasterizes SVG files into PNG images, and vectorizes PNG/raster logos and line art into real SVG paths — all in one free tool.',
      },
      {
        question: 'How do I rasterize an SVG to PNG?',
        answer:
          'Upload your .svg, keep the output on PNG, optionally set a size, and convert. You get a crisp, transparency-preserving PNG.',
      },
      {
        question: 'How do I vectorize a PNG to SVG?',
        answer:
          'Upload a PNG and choose SVG output. We trace it with potrace into real vector paths. It works best for logos, icons, and line art.',
      },
      {
        question: 'Is vectorization good for photos?',
        answer:
          'No — vectorization is for simple, high-contrast graphics. Photos produce large, messy paths rather than clean vectors.',
      },
      {
        question: 'Are my uploads private?',
        answer:
          `Yes. Files are processed on our own servers. ${RETENTION_PROMISE}. No account is required.`,
      },
    ],
    related: [
      { label: 'Convert SVG to PNG', to: '/tools/convert-svg-to-png', description: 'Focused SVG → PNG rasterizer.' },
      { label: 'Convert PNG to SVG', to: '/tools/convert-png-to-svg', description: 'Focused PNG → SVG vectorizer.' },
      { label: 'PNG to ICO', to: '/tools/png-to-ico', description: 'Turn a rasterized logo into a favicon.' },
      { label: 'PNG converter', to: '/tools/png-converter', description: 'Convert images to PNG.' },
      { label: 'Image converter', to: '/tools/image-converter', description: 'Convert between image formats.' },
    ],
    lastReviewed: '2026-10-29',
    primaryKeyword: 'svg converter',
    secondaryKeywords: [
      'online svg converter',
      'svg to png',
      'png to svg',
      'convert svg',
      'free svg converter',
    ],
  },

  // ----------------------------------------------------------------------- AUDIO
  {
    slug: 'convert-wav-to-mp3',
    name: 'Convert WAV to MP3',
    h1: 'Convert WAV to MP3 Online',
    tagline:
      'Shrink large lossless WAV recordings into widely compatible MP3 files for podcasts, sharing, and storage.',
    metaTitle: 'Convert WAV to MP3 Online (Free) | Media Manipulator',
    metaDescription:
      'Free online WAV to MP3 converter. Compress lossless .wav recordings into smaller MP3 files at the bitrate you choose.',
    ogTitle: 'Convert WAV to MP3 Online',
    ogDescription:
      'Compress WAV recordings to widely compatible MP3 files at the bitrate you choose.',
    category: 'audio',
    embed: {
      defaultMediaKind: 'audio',
      defaultTask: 'wav_to_mp3',
      defaultOutputFormat: 'mp3',
      lockedInputFormat: 'wav',
      title: 'Convert WAV to MP3',
      description:
        'Upload a WAV file and pick MP3 as the output format. 192 kbps is a good default for voice; use 256–320 kbps for music.',
    },
    intro:
      'WAV files are lossless and large. MP3 is the universally compatible compressed audio format — every phone, laptop, and music app plays it. Media Manipulator re-encodes your WAV to MP3 at the bitrate you pick, so you trade only a tiny bit of quality for a 5–10× smaller file.',
    whatItDoes: [
      'Re-encodes WAV recordings to MP3 at your chosen bitrate.',
      'Supports custom sample rates, channels, and bitrate (128 to 320 kbps).',
      'Preserves loudness and avoids unnecessary re-resampling.',
      'Outputs a standard ID3-tagged .mp3 file.',
    ],
    flowSteps: [
      {
        title: 'Upload WAV',
        description: 'Drop in any .wav file from your computer.',
      },
      {
        title: 'Pick bitrate',
        description: '192 kbps for voice, 256–320 kbps for music.',
      },
      {
        title: 'Encode MP3',
        description: 'FFmpeg encodes a clean MP3 at the chosen settings.',
      },
      {
        title: 'Download MP3',
        description: 'Save a widely compatible .mp3.',
      },
    ],
    advancedDetails: [
      'Uses LAME-style encoding via FFmpeg under the hood.',
      'MP3 is a lossy codec — quality plateaus around 256 kbps for music. Voice content sounds great at 128–192 kbps.',
      'If you need lossless smaller files, use FLAC or ALAC instead. Use Opus (in OGG) for the smallest modern lossy files when you control the player.',
    ],
    whyItMatters: [
      'WAV files are 5–10× larger than equivalent MP3 at sensible bitrates.',
      'MP3 plays on every device — no codec compatibility issues.',
      'Podcasts, audiobooks, and music platforms typically require or prefer MP3 uploads.',
    ],
    useCases: [
      {
        title: 'Podcast episodes',
        description: 'Master in WAV, publish as MP3 at 96–128 kbps mono.',
      },
      {
        title: 'Voice memos',
        description: 'Shrink phone recordings before sharing or archiving.',
      },
      {
        title: 'Music demos',
        description: 'Send mixes at 256–320 kbps without huge attachment sizes.',
      },
      {
        title: 'Embedding on a website',
        description: 'Use MP3 for compatibility — every browser plays it natively.',
      },
    ],
    whyMediaManipulator: [
      'Pick exact bitrate, sample rate, and channel layout.',
      'Free, no signup, no watermarks, output is fully yours.',
      'Same retention privacy model as the rest of the toolset.',
    ],
    privacyNote: privacyNoteFor('audio', 'Your WAV is encoded to MP3 by FFmpeg on our server at the bitrate you pick.'),
    faq: [
      {
        question: 'What bitrate should I pick?',
        answer:
          '192 kbps is a balanced default. Use 128 kbps for voice/podcast, 256–320 kbps for music.',
      },
      {
        question: 'Will the audio quality drop?',
        answer:
          'Slightly — MP3 is lossy. At 256+ kbps most listeners cannot tell the difference from the WAV original.',
      },
      {
        question: 'Can I convert other formats to MP3?',
        answer:
          'Yes — the audio converter accepts FLAC, M4A/AAC, OGG, OPUS, and more. Use the general audio converter tool.',
      },
      {
        question: 'Is there a file-size limit?',
        answer:
          'Reasonable file sizes are accepted. For very long recordings, consider trimming first.',
      },
    ],
    related: [
      {
        label: 'Audio converter',
        to: '/tools/audio-converter',
        description: 'Convert between any pair of audio formats.',
      },
      {
        label: 'Isolate vocals from a song',
        to: '/tools/isolate-vocals-from-song',
        description: 'Pull vocals out of music tracks.',
      },
      {
        label: 'Audio converter tutorial',
        to: '/tutorials/audio/getting-started',
        description: 'Walk through every audio option, including AI tools.',
      },
      // Hidden during AdSense review — re-enable when the blog returns.
      // {
      //   label: 'Audio quality guide',
      //   to: '/blog/audio/audio-quality-guide',
      //   description: 'Bitrate, sample rate, and codec deep dive.',
      // },
    ],
    primaryKeyword: 'convert WAV to MP3',
    secondaryKeywords: [
      'WAV to MP3 converter',
      'change WAV to MP3',
      'compress WAV',
      '.wav to .mp3',
      'WAV file to MP3 online',
    ],
  },
  {
    slug: 'isolate-vocals-from-song',
    name: 'Isolate Vocals from a Song',
    h1: 'Isolate Vocals from a Song Online',
    tagline:
      'Extract vocals from music tracks for remixes, covers, transcription, and analysis. Use only on music you have the right to.',
    metaTitle: 'Isolate Vocals from a Song Online (Free) | Media Manipulator',
    metaDescription:
      'Free online vocal isolation. Extract vocals from a song into a clean stem for remixes, covers, transcription, or analysis.',
    ogTitle: 'Isolate Vocals from a Song Online',
    ogDescription:
      'Extract vocals from a song into a clean isolated stem — for remixes, covers, transcription, or analysis.',
    category: 'audio',
    embed: {
      defaultMediaKind: 'audio',
      defaultTask: 'isolate_vocals',
      preset: { kind: 'audio', aiOperation: 'isolate_vocals', hideOperationSelect: true, format: 'auto' },
      title: 'Isolate vocals',
      description:
        'Upload a song and press the button: Isolate Vocals is already selected. Your result comes back in the same format as your file (MP3 stays MP3); pick FLAC or WAV under Output format for lossless.',
    },
    intro:
      'AI-based source separation can pull a vocal track out of a finished mix — great for remixes, covers, karaoke prep, or transcribing lyrics. Media Manipulator runs the separation on our own GPU server. The result is a single vocal stem you can download and use anywhere — as long as you have the right to do so for your source material.',
    whatItDoes: [
      'Runs AI-based source separation to extract the vocal track from a music recording.',
      'Outputs a single isolated vocal stem in the same format as your file (MP3 stays MP3), or in FLAC, WAV or MP3 if you choose.',
      'Pairs well with audio cleanup tools like denoise and EQ for a polished result.',
      'Supports WAV, MP3, FLAC, M4A, OGG, OPUS, and more inputs.',
    ],
    flowSteps: [
      {
        title: 'Upload song',
        description: 'Drop in any common audio file with mixed vocals + music.',
      },
      {
        title: 'Run AI separation',
        description: 'Local GPU model splits vocals from the rest of the mix.',
      },
      {
        title: 'Clean up (optional)',
        description: 'Apply denoise, EQ, or gain to polish the stem.',
      },
      {
        title: 'Download vocal stem',
        description: 'Save the isolated vocals: same format as your file by default, or FLAC, WAV or MP3.',
      },
    ],
    advancedDetails: [
      'Source separation is inherently imperfect — reverb, harmonies, and heavy effects bleed into the output.',
      'An MP3 or other compressed file comes back in its own format (MP3 at 320 kbps). Lossless files (WAV, FLAC, AIFF) come back as FLAC. FLAC and WAV keep the most detail for further editing in a DAW; WAV is the largest.',
      'For karaoke (instrumental only), use the dedicated "Remove Vocals" mode in the audio converter instead.',
    ],
    whyItMatters: [
      'Producers and remixers can build new tracks around an existing vocal.',
      'Singers can transcribe lyrics or melodies more accurately.',
      'Educators and audio engineers use isolated stems to study mixing technique.',
    ],
    useCases: [
      {
        title: 'Remixes and covers',
        description: 'Build a new instrumental around an isolated vocal.',
      },
      {
        title: 'Lyric and melody transcription',
        description: 'Get a clearer signal for hand or AI transcription.',
      },
      {
        title: 'Karaoke prep',
        description: 'Pair the isolated vocal with a separate instrumental version.',
      },
      {
        title: 'Audio engineering practice',
        description: 'Study mixing technique on commercial recordings.',
      },
    ],
    whyMediaManipulator: [
      'Local-GPU AI — no third-party AI provider sees your audio.',
      'Combine with EQ, denoise, and trim in a single upload.',
      'Free, no signup, no watermarks on the output.',
    ],
    privacyNote: privacyNoteFor('audio', 'Your song is split into stems by Demucs on our own GPU server and only the vocal stem is returned to you.'),
    faq: [
      {
        question: 'Is this fully clean separation?',
        answer:
          'No source separation tool is perfect. Expect some artifacts, especially around heavy reverb and harmonies. Choose FLAC or WAV output if you plan to clean the stem up afterward in a DAW.',
      },
      {
        question: 'What audio formats are supported?',
        answer:
          'WAV, MP3, FLAC, M4A/AAC, OGG, OPUS, and most other common audio formats.',
      },
      {
        question: 'Can I use this on copyrighted music?',
        answer:
          'Only if you own the rights, have a license, or are operating under fair use in your jurisdiction. You are responsible for how you use the output.',
      },
      {
        question: 'Where can I get just the instrumental?',
        answer:
          'Use the "Remove Vocals" AI mode in the audio converter — same upload, different output.',
      },
    ],
    related: [
      {
        label: 'Audio converter',
        to: '/tools/audio-converter',
        description: 'Convert and clean up the stem after isolation.',
      },
      {
        label: 'Convert WAV to MP3',
        to: '/tools/convert-wav-to-mp3',
        description: 'Compress the WAV stem to MP3 for sharing.',
      },
      {
        label: 'Audio converter tutorial',
        to: '/tutorials/audio/getting-started',
        description: 'Walk through every audio option, including AI tools.',
      },
      // Hidden during AdSense review — re-enable when the blog returns.
      // {
      //   label: 'Audio quality guide',
      //   to: '/blog/audio/audio-quality-guide',
      //   description: 'Bitrate, sample rate, and codec choices for clean audio.',
      // },
    ],
    primaryKeyword: 'isolate vocals from a song',
    secondaryKeywords: [
      'extract vocals from song',
      'vocal isolator online',
      'AI vocal extractor',
      'separate vocals from music',
      'acapella maker',
    ],
  },

  // ----------------------------------------------------------------------- MM28: AI IMAGE TOOLS (op-specific pages)
  {
    slug: 'ai-image-upscaler',
    name: 'AI Image Upscaler',
    h1: 'AI Image Upscaler: Enlarge Photos 2x or 4x Online',
    tagline:
      'Enlarge a small or soft photo with a Real-ESRGAN model that rebuilds fine detail instead of just stretching pixels.',
    metaTitle: 'AI Image Upscaler: Enlarge Photos 2x or 4x | Media Manipulator',
    metaDescription:
      `Upscale a low-resolution photo 2x or 4x with AI that restores edges and texture. Runs on our own GPU, outputs PNG. ${RETENTION_PROMISE}.`,
    ogTitle: 'AI Image Upscaler: Enlarge Photos 2x or 4x',
    ogDescription:
      'Enlarge small or soft photos with a Real-ESRGAN AI model that rebuilds detail instead of stretching pixels.',
    category: 'ai',
    embed: {
      defaultMediaKind: 'image',
      defaultTask: 'image_converter',
      defaultAIImageOperation: 'ai_upscale',
      lockedAIImageOperation: true,
      defaultOutputFormat: 'png',
      title: 'Upscale an image with AI',
      description:
        'Upload a photo. AI Upscale is already selected and locked, with the output set to PNG. Pick 2x or 4x and a model (photo or anime), then convert.',
    },
    intro:
      'This page opens the image converter with AI Upscale locked in and the output set to PNG. The server runs realesrgan-ncnn-vulkan, the Vulkan build of Real-ESRGAN, on a GPU we own: the default model is realesrgan-x4plus at 4x, with realesrgan-x4plus-anime and realesr-animevideov3 available for drawings and animation frames, and 2x as an alternative scale. Rather than interpolating between your existing pixels, the network predicts what edges, skin, fabric and foliage look like at the larger size and draws that detail in. The result is written as a lossless PNG so no new compression artifacts are stacked on top of the synthesized detail.',
    whatItDoes: [
      'Enlarges an image to 2x or 4x its width and height with a Real-ESRGAN model running on our GPU.',
      'Lets you choose between a photo model and two anime-style models in the form; 4x and the photo model are preselected.',
      'Always outputs PNG; the API forces the .png extension for this operation.',
      'Tiles the image automatically on the GPU so large inputs do not run out of video memory.',
      'Spends one AI job from the daily AI allowance, a counter of its own; the everyday allowance for conversions is not touched.',
    ],
    flowSteps: [
      { title: 'Upload a small or soft image', description: 'JPG, PNG or WebP. The smaller the input, the more the model has to invent.' },
      { title: 'Pick 4x or 2x and a model', description: 'realesrgan-x4plus for photos, the anime models for line art and cartoon frames.' },
      { title: 'Real-ESRGAN runs on the GPU', description: 'realesrgan-ncnn-vulkan -i in -o out -n <model> -s <2|4> -t 0 -g <gpu> -f png' },
      { title: 'Download the PNG', description: 'converted.png at 2x or 4x the original pixel dimensions.' },
    ],
    advancedDetails: [
      'The call is UpscaleImage in ai_tools.go. It launches realesrgan-ncnn-vulkan with -n for the model, -s for the scale, -t 0 for automatic tile size, -g for the GPU index and -f png; the Vulkan ICD is pinned by environment variables so the loader always finds the NVIDIA driver.',
      'Only scales 2 and 4 and only the three model names realesrgan-x4plus, realesrgan-x4plus-anime and realesr-animevideov3 are accepted; anything else is rejected before the job starts.',
      '2x runs the same x4 network at half scale. The form carries a note that 2x can look slightly cropped or zoomed on some images, which was observed on the server with a 640 x 360 photo; the API deliberately does not hide this by running 4x and downscaling.',
      'Because the AI path bypasses ImageMagick and the exiftool copy, the quality, resize, filter and metadata settings in the form do nothing here, and the PNG carries no EXIF from the original.',
      'Pixel count grows with the square of the scale: 4x means 16 times as many pixels and 2x means 4 times. The uncompressed RGB of the output is width x height x 3 bytes, which bounds how large the PNG can be.',
      'There is no server-side cap on input dimensions specific to this operation beyond the per-file size limit for your plan; very large inputs simply take longer, tile by tile.',
    ],
    whyItMatters: [
      'Old digital photos, low-resolution downloads and small web images often need to be printed or shown far larger than they were captured.',
      'Plain interpolation makes a larger image, not a sharper one; a super-resolution model is the difference between blurry and usable.',
      'Starting from a lossless PNG leaves you free to compress or resize the result afterward without compounding artifacts.',
    ],
    useCases: [
      { title: 'Printing old photos', description: 'Take a 1-megapixel photo from an early camera to a size that prints well.' },
      { title: 'Rescuing small downloads', description: 'Enlarge a 400 px product or reference image to something usable.' },
      { title: 'Anime and illustration', description: 'Scale up line art with realesrgan-x4plus-anime without muddy edges.' },
      { title: 'Game and video frames', description: 'Use realesr-animevideov3 on captured animation frames.' },
    ],
    whyMediaManipulator: [
      'The real binary, models and flags are named here, so you know it is Real-ESRGAN with automatic tiling and not a generic "enhance".',
      'The 2x caveat is stated instead of hidden, and the operation is locked so there is no menu to hunt through.',
      `Runs on hardware we own; the standard tool needs no account. ${RETENTION_PROMISE}.`,
    ],
    privacyNote: `Your image is stored under uploads/<jobId>/ on our server and read directly by the realesrgan-ncnn-vulkan binary on a GPU in the same machine; the PNG it produces goes to outputs/<jobId>/converted.png. No outside AI provider is involved and your image is not used to train anything. As with every image upload, an automated analysis step on our server runs a local vision model over the file once and stores its summary with the job. The result has no EXIF from the original, because AI operations skip the metadata copy. ${RETENTION_PROMISE}.`,
    supportedFormats: {
      supportedInputFormats: ['jpg', 'jpeg', 'png', 'webp'],
      supportedOutputFormats: ['png'],
      processingNotes: [
        'Output is PNG. Size limits and the daily AI allowance depend on your plan and are shown in the form, not fixed on this page.',
      ],
    },
    faq: [
      {
        question: 'Is the AI upscaler free to use?',
        answer:
          'Yes, within the daily AI allowance. Each upscale spends one AI job: by default 3 per day for guests and 10 with a free account, with 200 MB and 1 GB per-file caps; 100 and 200 on Premium and Pro. That allowance is separate from the everyday one, so your conversions are unaffected. The live numbers are on /pricing.',
      },
      {
        question: 'How is this different from the image resizer?',
        answer:
          'The resizer runs ImageMagick, which interpolates existing pixels and makes a larger but softer image. This tool runs a trained Real-ESRGAN network that synthesizes edges and texture at the larger size. It is an inference, not recovered data.',
      },
      {
        question: 'Should I pick 2x or 4x?',
        answer:
          '4x is the default and gives the most consistent output. 2x runs the same network at half scale and can look slightly cropped on some images, so if 4x is more than you need, consider 4x followed by a resize down.',
      },
      {
        question: 'Which model is right for drawings?',
        answer:
          'realesrgan-x4plus-anime for illustrations and flat-colour art; realesr-animevideov3 for frames taken from animation. The photo model adds skin-like texture that looks wrong on line art.',
      },
      {
        question: 'Why is the output PNG and so large?',
        answer:
          'PNG is forced so the synthesized detail is not immediately damaged by JPEG compression. A 4x result has 16 times the pixels, so the file is large; compress it to JPG or WebP afterward for sharing.',
      },
      {
        question: 'Can it fix a blurry or out-of-focus photo?',
        answer:
          'It helps with softness that comes from low resolution. It cannot undo motion blur or a missed focus, and it may smooth or alter faces and fine text. Compare the result with the original before using it.',
      },
      {
        question: 'Is my photo sent to a third-party AI service?',
        answer:
          'No. Real-ESRGAN runs on a GPU server we operate, and the job never calls an external API.',
      },
    ],
    related: [
      { label: 'AI image restoration', to: '/tools/ai-image-restoration', description: 'Clean compression and noise before or after enlarging.' },
      { label: 'Image resizer', to: '/tools/image-resizer', description: 'Bring a 4x result down to the exact size you need.' },
      { label: 'Compress image', to: '/tools/compress-image', description: 'Turn the large PNG into a shareable JPG or WebP.' },
      { label: 'Remove background from image', to: '/tools/remove-background-from-image', description: 'Cut the enlarged subject out onto transparency.' },
      { label: 'AI video restoration', to: '/tools/ai-video-restoration', description: 'The equivalent for video frames.' },
    ],
    lastReviewed: '2026-10-29',
    workedExamples: [
      {
        title: 'A 640 x 360 JPEG at 4x with realesrgan-x4plus',
        body:
          'Input: a 92 KB, 640 x 360 JPEG thumbnail of a landscape. Settings left at the preset: 4x, photo model, PNG output. The server runs realesrgan-ncnn-vulkan -n realesrgan-x4plus -s 4 -t 0 -f png and writes converted.png at 2560 x 1440 pixels, 16 times the original 230,400 pixels. The uncompressed output is 2560 x 1440 x 3 = 11 MB of RGB, and the PNG lands below that depending on how much sky and flat colour it contains, so expect several megabytes from a 92 KB input. The GPU pass over the automatically chosen tiles is a matter of seconds for an output of this size; the PNG encode and download of a multi-megabyte file take a noticeable share of the total.',
      },
      {
        title: 'A 1200 x 800 photo at 2x',
        body:
          'Input: a 480 KB, 1200 x 800 JPEG of a person. Choose 2x and keep the photo model. The output is a 2400 x 1600 PNG, 3.84 megapixels, four times the original 0.96. Uncompressed that is 11.5 MB of RGB, and the PNG will be some fraction of it. Because 2x runs the x4 network at half scale, inspect the edges for the slight crop or zoom the form warns about; if it appears, run 4x instead and resize the 4800 x 3200 result down to 2400 x 1600 with the image resizer, which costs one more operation.',
      },
    ],
    whenNotToUse:
      'Do not upscale an image that is already large and sharp: a 12-megapixel photo at 4x becomes a 192-megapixel PNG that is slow to produce, hundreds of megabytes uncompressed, and gains nothing visible. Do not rely on it for faces, text, logos or anything where the exact original must be preserved, because the added detail is predicted, not recovered, and small text can come out as plausible but wrong letters. Heavy motion blur and missed focus are not fixed by resolution. If you only need a specific pixel size from a larger original, the plain resizer is faster and cheaper.',
    primaryKeyword: 'ai image upscaler',
    secondaryKeywords: [
      'upscale image online',
      'enlarge photo without losing quality',
      'increase image resolution',
      'real-esrgan online',
      'make small image bigger',
    ],
  },
  {
    slug: 'blur-faces-in-photo',
    name: 'Blur Faces in Photo',
    h1: 'Blur Faces in a Photo Online',
    tagline:
      'Detect faces automatically, then blur, pixelate or black out all of them or only the ones you choose.',
    metaTitle: 'Blur Faces in a Photo Online | Media Manipulator',
    metaDescription:
      `Blur, pixelate or black out faces in a photo. Detect every face, then pick which to hide. AI runs on our own GPU. ${RETENTION_PROMISE}.`,
    ogTitle: 'Blur Faces in a Photo Online',
    ogDescription:
      'Automatically find faces in a photo and blur, pixelate or black out all of them or just the ones you pick.',
    category: 'ai',
    embed: {
      defaultMediaKind: 'image',
      defaultTask: 'image_converter',
      defaultAIImageOperation: 'face_privacy',
      lockedAIImageOperation: true,
      title: 'Blur faces in a photo',
      description:
        'Upload a photo. Face Blur / Pixelate is already selected and locked. Choose the style, optionally detect faces and select which to hide, then convert.',
    },
    intro:
      'Publishing a crowd, classroom or street photo usually means hiding people who never agreed to appear in it. This page finds faces with the YuNet detector running in OpenCV on our own server and covers each one with a Gaussian blur, a pixel mosaic or a solid black rectangle. You can cover every detected face in one step, or run detection first, see the boxes drawn on your photo, and choose only the faces to hide or only the faces to keep. The detector, its confidence threshold and the exact size of each effect are described below so you know what the output will and will not protect.',
    whatItDoes: [
      'Detects faces with OpenCV FaceDetectorYN and the YuNet 2023 model at a confidence threshold of 0.85, then grows each box by 18 percent on every side so hair and jawline are covered too.',
      'Hides each chosen face with a Gaussian blur whose kernel is a third of the box size, a mosaic of 14 blocks across the box, or a black fill.',
      'Offers three selection modes: all detected faces, only the faces you ticked, or all except the faces you ticked.',
      'Stores detection results in a 30 minute session bound to the SHA-256 of your file, so the boxes applied are exactly the boxes you saw.',
      'Writes a new JPG, PNG or WebP with the same pixel dimensions; the original upload is not altered.',
    ],
    flowSteps: [
      { title: 'Upload the photo', description: 'JPG, PNG or WebP. Face Blur / Pixelate is preselected and locked on this page.' },
      { title: 'Choose blur, pixelate or black box', description: 'Blur is preset; a black box removes the pixels entirely.' },
      { title: 'Optionally detect and select', description: 'Press Detect faces to see numbered boxes, then tick the ones to hide or to keep.' },
      { title: 'Run the job', description: 'The server applies the effect inside each chosen box and saves a new image.' },
      { title: 'Check and download', description: 'Zoom to full size and look for missed faces before you post it.' },
    ],
    advancedDetails: [
      'Detection runs face_privacy.py with OpenCV FaceDetectorYN on face_detection_yunet_2023mar.onnx at the full image resolution, score threshold 0.85, NMS threshold 0.3 and up to 5000 candidates. Boxes are padded by 0.18 of their width and height on each side and clamped to the image.',
      'Blur applies cv2.GaussianBlur with an odd kernel of max(3, longest box side / 3) pixels, so a 300 px face gets a 101 px kernel; the bigger the face, the stronger the blur. Pixelate shrinks the box to 14 blocks across with linear filtering and scales it back with nearest-neighbour, giving visible square tiles. Black box writes (0, 0, 0) into the region.',
      'When you detect first, the server computes the SHA-256 of the upload, stores the normalised boxes in a session that expires after 30 minutes, and refuses to apply a session whose hash does not match the file you later submit, so boxes cannot be transplanted onto a different picture.',
      'With no detection session the script redetects at run time and covers every face it finds; the result is identical to running Detect faces and leaving the mode on all.',
      'The output is written by OpenCV, and the converter exiftool copy-back step does not run on AI outputs, so the result carries none of the original EXIF, GPS or camera tags. It is still not a substitute for the EXIF tool, which lets you see and choose what is removed.',
      'A light blur on a large, sharp face can be partially reversed with deconvolution tools; the black box is the only choice that destroys the information, and a coarse mosaic is in between.',
    ],
    whyItMatters: [
      'Photos of other people, and especially of children, carry consent and sometimes legal obligations that a caption cannot fix.',
      'Hand-editing a photo with 20 faces is slow and inconsistent; detection finds the small ones in the back row.',
      'Detect-then-select lets you keep your own group visible while anonymising passers-by.',
    ],
    useCases: [
      { title: 'Event and crowd photos', description: 'Hide bystanders before publishing pictures from a public event.' },
      { title: 'School and club posts', description: 'Cover specific children whose families have not given consent.' },
      { title: 'Journalism and reporting', description: 'Protect sources or participants in a documentary still.' },
      { title: 'Screenshots of video calls', description: 'Anonymise colleagues in a meeting capture before sharing it outside the team.' },
    ],
    whyMediaManipulator: [
      'The detector, its threshold, the padding and the kernel arithmetic are stated, so you can judge how much protection each style gives.',
      'Detection boxes are tied to the file hash and expire after 30 minutes, so you select on the exact image that gets processed.',
      `Face blurring spends one AI job from the daily AI allowance (3 a day without an account by default, 10 with a free account), which is kept apart from the everyday allowance, and the Detect faces preview is not counted at all. ${RETENTION_PROMISE}.`,
    ],
    privacyNote:
      `Face detection and blurring run as a local OpenCV process on our own hardware; no outside AI service receives your photo, and nothing is used for training. The Detect faces preview saves a temporary copy, hashes it, detects, and deletes the copy before responding; only the box coordinates are kept, for 30 minutes. The uploaded photo lives in uploads/<jobId>/ and the result in outputs/<jobId>/, both in the retention ledger and deleted when the window ends. ${RETENTION_PROMISE}. As a standard image upload, the photo also passes through our automated content analysis on the same server, where a local vision model writes a short description that stays with the job and is not shared with third parties.`,
    supportedFormats: {
      supportedInputFormats: ['jpg', 'jpeg', 'png', 'webp'],
      supportedOutputFormats: ['jpg', 'png', 'webp'],
      processingNotes: [
        'Each job spends one AI job from your daily AI allowance; the per-file size limit for your plan is shown in the form.',
      ],
    },
    faq: [
      {
        question: 'Which faces will the detector miss?',
        answer:
          'YuNet is run at a 0.85 confidence threshold, so it skips low-confidence candidates: very small faces, profiles turned away from the camera, faces covered by masks or hands, and faces in deep shadow. Check the result at full size before sharing.',
      },
      {
        question: 'How do I blur only some of the faces?',
        answer:
          'Press Detect faces, tick the numbered boxes, and set the selection mode to only selected faces or all except selected faces. The boxes are stored for 30 minutes against the file hash, so re-detect if you swap the picture.',
      },
      {
        question: 'How strong is the blur, and can it be undone?',
        answer:
          'The Gaussian kernel is one third of the box size, so a 300 px face gets a 101 px kernel. Strong blur is hard to reverse but a determined attacker with a sharp large face has a chance; the black box removes the pixels and cannot be undone.',
      },
      {
        question: 'Does the output keep my photo EXIF and GPS data?',
        answer:
          'No. The result is written fresh by OpenCV and the metadata copy-back step is skipped for AI outputs, so camera and location tags are not carried over. Use the EXIF tool if you want to inspect or selectively strip tags.',
      },
      {
        question: 'Is my photo sent to an outside AI company?',
        answer:
          'No. Detection and the effect run in a local OpenCV process on our own server, and the file is not shared with third-party AI providers.',
      },
      {
        question: 'Does face blurring use my daily AI allowance?',
        answer:
          'Yes. Each blurred photo is one AI job: 3 a day as a guest by default, 10 with a free account. It never draws on the everyday allowance. The Detect faces preview is rate limited but not counted. A failed job is refunded.',
      },
      {
        question: 'What about licence plates, name tags or text on screens?',
        answer:
          'Those are not faces and are not detected here. Use the redact text tool for anything readable, or the object remover to erase a plate or a sign from the picture.',
      },
    ],
    related: [
      { label: 'Redact text in image', to: '/tools/redact-text-in-image', description: 'Hide emails, phone numbers and other readable text.' },
      { label: 'Remove object from photo', to: '/tools/remove-object-from-photo', description: 'Erase a person, plate or sign entirely.' },
      { label: 'Remove EXIF metadata', to: '/tools/remove-exif-metadata', description: 'Strip GPS and camera data from the same photo.' },
      { label: 'Compress image', to: '/tools/compress-image', description: 'Shrink the anonymised photo before posting.' },
      { label: 'Image resizer', to: '/tools/image-resizer', description: 'Scale the result to the size a platform wants.' },
    ],
    lastReviewed: '2026-10-29',
    workedExamples: [
      {
        title: 'A 4000 x 3000 group photo with 14 faces, all blurred',
        body:
          'Input: a 3.5 MB JPEG of 4000 x 3000 pixels from a phone, with 14 people. Settings: blur, selection mode all, no prior detection. The script runs YuNet over the full 12 megapixel frame; a face whose box is 300 x 360 pixels is padded by 18 percent to about 408 x 490 and blurred with a 163 px Gaussian kernel (490 / 3, rounded to odd), which turns it into a featureless patch. A 60 px face in the back row gets a 27 px kernel, enough to remove features at that size. The output is a 4000 x 3000 JPG written by OpenCV, usually within a few hundred kilobytes of the original size. Detection and blurring take a few seconds; the upload of 3.5 MB usually takes longer.',
      },
      {
        title: 'A 1920 x 1080 video-call screenshot, two of six faces pixelated',
        body:
          'Input: a 1.1 MB PNG screenshot of 1920 x 1080 showing six participants. Settings: Detect faces first, selection mode only selected, two faces ticked, pixelate. Detection returns six boxes and stores them in a 30 minute session tied to the file hash. On submit the server verifies the hash, passes the two selected box ids to the script, and each selected box, about 140 x 180 pixels after padding, is reduced to 14 blocks across so every tile is roughly 10 x 13 pixels, then written back as hard squares. The other four faces are untouched. The output is a 1920 x 1080 PNG, and the job runs in a few seconds because no redetection is needed.',
      },
    ],
    whenNotToUse:
      'Do not rely on this tool for anything where a single missed face is unacceptable, such as a legally mandated redaction; YuNet at a 0.85 threshold skips faces that are tiny, turned away, masked or in deep shadow, and you must check the output yourself. Do not use a light blur on a large face if the person must stay unidentifiable; use the black box. Name tags, licence plates and screens are not faces, so the text redaction tool or the object remover is the right choice for those. And if your goal is to remove a person from the scene entirely rather than hide their face, the object remover does that.',
    primaryKeyword: 'blur faces in photo',
    secondaryKeywords: [
      'face blur online',
      'pixelate faces in image',
      'anonymize faces in photo',
      'hide face in picture',
      'automatic face blur',
    ],
  },
  {
    slug: 'redact-text-in-image',
    name: 'Redact Text in Image',
    h1: 'Redact Text and Personal Data in an Image',
    tagline:
      'Find readable text in a screenshot or photo and cover personal details, or all text, with a blur or a black box.',
    metaTitle: 'Redact Text in an Image Online | Media Manipulator',
    metaDescription:
      `Automatically find text in an image and black out or blur names, emails, numbers and other personal data. AI on our own GPU. ${RETENTION_PROMISE}.`,
    ogTitle: 'Redact Text and Personal Data in an Image',
    ogDescription:
      'Find text in screenshots and photos and cover personal data or all text with a blur or black box.',
    category: 'ai',
    embed: {
      defaultMediaKind: 'image',
      defaultTask: 'image_converter',
      defaultAIImageOperation: 'redact_text',
      lockedAIImageOperation: true,
      title: 'Redact text in an image',
      description:
        'Upload a screenshot or photo. Redact Text / PII is already selected and locked. Choose whether to cover personal data or all text, and the redaction style, then convert.',
    },
    intro:
      'Screenshots leak the things their owners stopped seeing: an email address in a header, an account number in a table, a phone number in a chat bubble. This page reads every piece of text in an image with EasyOCR on our own server and covers the matches with a black rectangle, a blur or a pixel mosaic. In its default mode it only covers text that matches personal-data patterns: email addresses, phone numbers, social-security-style numbers, long card-like digit runs and street addresses. In all-text mode it covers every word it can read, which is the safer choice when you cannot predict what is on the page.',
    whatItDoes: [
      'Runs EasyOCR over the whole image to find text boxes and the text inside them, using the GPU of our server.',
      'In PII mode covers boxes whose text matches one of five patterns: email, phone number, 3-2-4 digit identifier, 13 to 19 digit card-like run, or a street address ending in Street, Avenue, Road, Drive, Lane, Boulevard, Way, Court, Circle or Place.',
      'In all-text mode covers every recognised text box regardless of content.',
      'Pads each box by 8 percent of its larger side (at least 3 pixels) and fills it with black, blurs it with a kernel of a third of its size, or pixelates it into 12 blocks.',
      'Writes a new JPG, PNG or WebP at the same dimensions and reports how many redactions were made.',
    ],
    flowSteps: [
      { title: 'Upload the image', description: 'A screenshot, scanned form or photo with readable text, as JPG, PNG or WebP.' },
      { title: 'Choose PII only or all text', description: 'Redact Text / PII is preselected and locked on this page; PII only is the default detect mode.' },
      { title: 'Pick black box, blur or pixelate', description: 'Black box is the default and the only irreversible one.' },
      { title: 'OCR and redaction run', description: 'EasyOCR reads the image, each matching box is padded and covered, and the result is saved.' },
      { title: 'Read it carefully and download', description: 'Check for text the OCR did not read, especially small, rotated or handwritten text.' },
    ],
    advancedDetails: [
      'The server runs redact_text_pii.py with --detect pii or all-text, --redaction blackbox, blur or pixelate and --gpu. The script builds an EasyOCR Reader for English (the only language passed today) and calls readtext on the file, which returns a box, the text and a confidence for every line.',
      'The PII patterns are regular expressions: an email (local part, @, domain with a dot and a 2+ letter TLD); a North American phone number of 10 digits with optional +1, brackets, dots, spaces or dashes; three, two and four digits separated by a dash or space; 13 to 19 digits optionally separated by spaces or dashes (card numbers); and a house number followed by a name and a street-type word. There is no pattern for personal names, dates of birth or non-US identifiers.',
      'Each matching box is enlarged by max(3, 0.08 x the larger of its width and height) pixels on every side and clamped to the image. Black box uses cv2.rectangle with a filled black interior; pixelate shrinks the region to 12 blocks across and scales back with nearest-neighbour; blur uses a Gaussian kernel of max(11, longest side / 3), made odd.',
      'OCR reads clean horizontal print best. Handwriting, decorative fonts, very small text, strong skew and low contrast lower the confidence and can be missed entirely. All-text mode does not fix a line the OCR never saw.',
      'The output is written by OpenCV and the converter exiftool copy-back is skipped for AI outputs, so the original EXIF, GPS and camera tags are not carried over to the result; the pixels, not the metadata, are what this tool is for.',
      'The script prints redactions=N when it finishes; a result of zero means the OCR found no matching text, not that the image was clean.',
    ],
    whyItMatters: [
      'Support tickets, bug reports and social posts routinely carry screenshots with real customer or account data.',
      'Covering text by hand with a drawing tool misses lines and leaves uneven results; a pattern search finds the third email you stopped noticing.',
      'An opaque rectangle is the only redaction that survives sharpening, contrast stretching and zoom.',
    ],
    useCases: [
      { title: 'Bug reports and support', description: 'Share a screenshot without exposing emails, phone numbers or card digits.' },
      { title: 'Scanned forms', description: 'Hide identifiers and addresses on a page before forwarding it.' },
      { title: 'Chat screenshots', description: 'Remove phone numbers and emails from a conversation before posting it.' },
      { title: 'Training material', description: 'Turn a real screen capture into a safe example with all text covered.' },
    ],
    whyMediaManipulator: [
      'The five PII patterns, the padding and the kernel sizes are written out, so you know exactly which text will be caught and how it will be covered.',
      'OCR and redaction run in a local process on our own GPU; screenshots full of customer data never leave our hardware.',
      `Text redaction spends one AI job (3 a day without an account by default, 10 with a free account), counted on the AI allowance rather than the everyday one, and a failed job is refunded. ${RETENTION_PROMISE}.`,
    ],
    privacyNote:
      `Text recognition and redaction run as a local EasyOCR and OpenCV process on our own GPU server; no outside OCR or AI service receives the image, and the recognised text is used only to decide which boxes to cover and is not stored. The upload lives in uploads/<jobId>/ and the redacted image in outputs/<jobId>/, both registered in the retention ledger and deleted when the window ends. ${RETENTION_PROMISE}. Like every standard image upload, the file also passes through our automated content analysis on the same server, where a local vision model writes a short description that is kept with the job and not shared with third parties.`,
    supportedFormats: {
      supportedInputFormats: ['jpg', 'jpeg', 'png', 'webp'],
      supportedOutputFormats: ['jpg', 'png', 'webp'],
      processingNotes: [
        'Each job spends one AI job from your daily AI allowance; the per-file size limit for your plan is shown in the form.',
      ],
    },
    faq: [
      {
        question: 'Which personal data does PII mode detect?',
        answer:
          'Text matching five patterns: email addresses, North American phone numbers, 3-2-4 digit identifiers, 13 to 19 digit card-like runs, and street addresses ending in a word such as Street, Avenue or Road. Names, dates and non-US identifiers are not matched; use all text for those.',
      },
      {
        question: 'When should I use all text instead of PII only?',
        answer:
          'Whenever you cannot list in advance what is sensitive: forms, tables, chat logs with names. All text covers every line the OCR reads, so the only remaining risk is text the OCR could not read.',
      },
      {
        question: 'Does the tool read languages other than English?',
        answer:
          'Not today. The OCR reader is started for English only, so Latin-script text is read reasonably but other scripts can be missed or misread. Review the output when the page is not in English.',
      },
      {
        question: 'Is a black box safer than blur or pixelate here?',
        answer:
          'Yes. The box is filled with solid black, so nothing remains. Blur uses a kernel of a third of the box size with an 11 px minimum, and pixelate leaves 12 blocks across; both can leave short text guessable. Choose the black box for anything you will publish.',
      },
      {
        question: 'Does redaction remove the hidden metadata in my photo?',
        answer:
          'The result is written fresh by OpenCV without copying the original tags, so EXIF and GPS data are not carried over. For a deliberate, inspectable strip of a file you are not otherwise editing, use the EXIF metadata tool.',
      },
      {
        question: 'Why did some text stay visible?',
        answer:
          'Either the OCR did not read it (handwriting, tiny print, skew, low contrast) or, in PII mode, it did not match a pattern. The server reports how many boxes it covered; zero means nothing matched, not that nothing was there.',
      },
      {
        question: 'Is redacting text free, and what counts against my allowance?',
        answer:
          'Yes. It is an AI job, 3 a day without an account by default and 10 with a free account, on images up to 200 MB and 1 GB respectively. It uses the AI allowance only, never the everyday one. The pricing page has the live numbers.',
      },
    ],
    related: [
      { label: 'Blur faces in photo', to: '/tools/blur-faces-in-photo', description: 'Hide the people in the same picture.' },
      { label: 'Remove EXIF metadata', to: '/tools/remove-exif-metadata', description: 'Strip hidden location and device data.' },
      { label: 'AI document scan', to: '/tools/ai-document-scan', description: 'Turn a photographed page into a clean, searchable PDF.' },
      { label: 'Remove object from photo', to: '/tools/remove-object-from-photo', description: 'Erase a logo, plate or badge that is not text.' },
      { label: 'Compress image', to: '/tools/compress-image', description: 'Shrink the redacted screenshot before attaching it.' },
    ],
    lastReviewed: '2026-10-29',
    workedExamples: [
      {
        title: 'A 1440 x 900 support-ticket screenshot in PII mode',
        body:
          'Input: a 400 KB PNG of 1440 x 900 showing a customer record with two email addresses, one phone number written as (555) 123-4567 and a customer name. Settings: PII only, black box. EasyOCR returns about 40 text lines; three of them match the email and phone patterns, the name matches nothing. Each of the three boxes, say 260 x 22 pixels for an email, is padded by 8 percent of 260, about 21 pixels, on every side and filled black, producing a 302 x 64 rectangle. The name stays visible, because there is no name pattern; switch to all text if it must go too. The output is a 1440 x 900 PNG, and the job takes a few seconds, most of it loading the OCR model and reading the page.',
      },
      {
        title: 'A 3024 x 4032 phone photo of a filled form in all-text mode with blur',
        body:
          'Input: a 2.1 MB JPEG photo of a printed form, 3024 x 4032 pixels, slightly skewed. Settings: all text, blur. Every line EasyOCR reads is covered: a typed field value of 600 x 40 pixels is padded by 48 pixels a side and blurred with a 201 px kernel (600 / 3, made odd), which removes the lettering completely at that scale; a 120 x 30 label gets the 11 px minimum kernel, which at that size still leaves letter shapes guessable, so pick black box for anything sensitive. Handwritten entries that the OCR cannot read stay as they were and must be checked by eye. The output is a 3024 x 4032 JPG; OCR over a 12 megapixel photo is the slowest step and takes longer than on a screenshot.',
      },
    ],
    whenNotToUse:
      'Do not use this tool as your only safeguard on a document that must be fully redacted; OCR is best effort, it reads English print only today, and the PII patterns know nothing about names, dates of birth or identifiers from outside North America. Do not use blur on text you will publish, since text blur is the easiest redaction to reverse; use the black box. Faces, logos and photographs are not text and are not touched; the face blur tool and the object remover handle those. And if the sensitive data is in the file metadata rather than the pixels, the EXIF tool is the right place.',
    primaryKeyword: 'redact text in image',
    secondaryKeywords: [
      'censor text in screenshot',
      'blur personal information in image',
      'hide pii in screenshot',
      'black out text in image',
      'image redaction tool',
    ],
  },
  {
    slug: 'remove-object-from-photo',
    name: 'Remove Object from Photo',
    h1: 'Remove an Object from a Photo Online',
    tagline:
      'Draw a box around something you do not want in the picture and an inpainting model fills the gap with matching background.',
    metaTitle: 'Remove an Object from a Photo Online | Media Manipulator',
    metaDescription:
      `Erase unwanted objects from a photo. Draw a rectangle and AI inpainting fills the space to match the background. Runs on our own GPU. ${RETENTION_PROMISE}.`,
    ogTitle: 'Remove an Object from a Photo Online',
    ogDescription:
      'Draw a box over an unwanted object and AI inpainting fills the space with matching background.',
    category: 'ai',
    embed: {
      defaultMediaKind: 'image',
      defaultTask: 'image_converter',
      defaultAIImageOperation: 'remove_object',
      lockedAIImageOperation: true,
      title: 'Remove an object from a photo',
      description:
        'Upload a photo. Remove Object is already selected and locked. Draw one or more rectangles over what you want gone, then convert.',
    },
    intro:
      'Upload a photo, drag one or more rectangles over the things you want gone, and convert. The form sends each rectangle as fractions of the image (left, top, width and height between 0 and 1), and our API turns them into a mask: a grayscale PNG the same size as your photo, white inside the rectangles and black everywhere else. A Python script then opens the image and the mask and runs the LaMa inpainting model from the simple_lama_inpainting package on our GPU, which repaints the white regions using the surrounding scene. You get the photo back at full size in the format you chose, with the marked areas filled.',
    whatItDoes: [
      'Accepts one or more rectangles drawn on the preview and removes whatever is inside them.',
      'Builds a pixel-exact mask on the server from the normalized rectangle coordinates, so the mask does not depend on your screen size.',
      'Runs LaMa inpainting on a GPU we operate and fills the masked areas with content that continues the background.',
      'Returns the full-resolution image in JPG, PNG, WebP or GIF as selected in the form.',
      'Counts as one AI job on the daily AI allowance; plain conversions use a different, separate allowance.',
    ],
    flowSteps: [
      { title: 'Upload the photo', description: 'JPG, PNG or WebP. The preview appears with a drawing overlay.' },
      { title: 'Draw rectangles', description: 'One box per object, slightly larger than the object itself. At least one box is required.' },
      { title: 'Mask and inpaint', description: 'The server writes a same-size mask PNG, then runs remove_object_lama.py with the image and mask.' },
      { title: 'Download and inspect', description: 'Zoom into the filled regions to check the seams before you use the image.' },
    ],
    advancedDetails: [
      'The handler is RemoveObject in ai_tools.go. It reads the image dimensions with ImageMagick identify, rasterizes the rectangles into a grayscale PNG mask in the server temp directory (white inside, black outside, coordinates rounded to whole pixels and clamped to the image), runs the script, and deletes the mask afterward.',
      'remove_object_lama.py opens the image with Pillow and converts it to RGB, loads the mask as grayscale, resizes the mask to the image if sizes differ, calls SimpleLama(image, mask), and saves the result to the output path. Because of the RGB conversion, a transparent PNG input loses its alpha channel.',
      'Each rectangle is validated server-side: width and height must be positive and the box must lie inside 0 to 1 on both axes, otherwise the job is rejected before it starts and the operation is refunded.',
      'The AI path skips the ImageMagick stage, so filters, tint, text overlay, quality and resize settings do not apply, and the exiftool metadata copy does not run; the result carries no EXIF from the original. Pillow saves the file with its own default encoder settings for the chosen format.',
      'LaMa fills from context, so the quality of the fill depends on what surrounds the box. Sky, grass, sand, water, walls and floors give convincing results; a box that cuts across a face, text or a regular pattern forces the model to invent structure it cannot know.',
    ],
    whyItMatters: [
      'A clone-stamp retouch across textured background takes practice and time; a rectangle takes two seconds.',
      'One stray person, cable or sign can be the only thing between a usable shot and a reshoot.',
      'It doubles as a privacy tool for house numbers, plates and screens that should not be in a shared photo.',
    ],
    useCases: [
      { title: 'Travel and landscape', description: 'Remove a tourist, a wire or a bin from an otherwise clean view.' },
      { title: 'Product photos', description: 'Erase a price tag, a stand or a dust speck from a listing image.' },
      { title: 'Real estate', description: 'Clear a car, a trash can or clutter from the edge of a frame.' },
      { title: 'Privacy', description: 'Paint out a street number, a licence plate or a visible monitor.' },
    ],
    whyMediaManipulator: [
      'The mask is built on the server from exact fractions, so what you draw on a phone preview maps to the same pixels as on a desktop.',
      'The model is named (LaMa through simple_lama_inpainting) and the format and alpha behaviour are documented rather than left to guesswork.',
      `Runs on our own GPU; the standard tool needs no account. ${RETENTION_PROMISE}.`,
    ],
    privacyNote: `Your photo is stored under uploads/<jobId>/ on our server; the rectangle mask is written as a temporary PNG in the server temp directory and deleted as soon as the inpainting script finishes; the filled image goes to outputs/<jobId>/. The rectangle coordinates are kept in the job options so the job can be reported on. LaMa runs on a GPU in the same machine and no part of the image goes to an outside provider. Every image upload, including this one, is also summarized once by an automated analysis step on our server using a local vision model, and that summary stays with the job. The output carries no EXIF because AI operations skip the metadata copy. ${RETENTION_PROMISE}.`,
    supportedFormats: {
      supportedInputFormats: ['jpg', 'jpeg', 'png', 'webp'],
      supportedOutputFormats: ['jpg', 'png', 'webp'],
      processingNotes: [
        'Each job spends one AI job from your daily AI allowance; the per-file size limit for your plan is shown in the form.',
      ],
    },
    faq: [
      {
        question: 'Is object removal free?',
        answer:
          'Yes, within the daily AI allowance. Each removal spends one AI job: by default 3 per day for guests and 10 with a free account, with 200 MB and 1 GB per-file caps; 100 and 200 on Premium and Pro. Your everyday allowance for conversions is separate and stays as it was. The numbers in force are on /pricing.',
      },
      {
        question: 'How precise does the rectangle need to be?',
        answer:
          'Not very. The mask is the rectangle you drew, rounded to whole pixels, so include a little background around the object and its shadow. The model blends the extra margin.',
      },
      {
        question: 'Can I remove several objects at once?',
        answer:
          'Yes. Every rectangle you draw is painted into the same mask and all of them are filled in one pass. At least one rectangle is required or the job is rejected.',
      },
      {
        question: 'Why does the filled area look blurry or repeated?',
        answer:
          'LaMa fills from the pixels around the box. A box over fine detail or a regular pattern leaves it guessing. Try a tighter box, remove one object at a time, or pick a shot where the background behind the object is simpler.',
      },
      {
        question: 'What format does the result come in?',
        answer:
          'Whatever you chose in the form: JPG, PNG, WebP or GIF. The input is converted to RGB before inpainting, so transparency is not preserved. PNG avoids JPEG artifacts in the filled regions.',
      },
      {
        question: 'Does the result keep my EXIF data?',
        answer:
          'No. The AI path skips the exiftool copy the normal converter does, and Pillow writes a fresh file, so no camera, date or GPS tags carry over.',
      },
      {
        question: 'Is the mask or my photo sent anywhere else?',
        answer:
          'No. The mask is a temporary file on our server that is deleted after the run, and the inpainting model runs on our own GPU.',
      },
    ],
    related: [
      { label: 'Remove background from image', to: '/tools/remove-background-from-image', description: 'Cut the subject out entirely instead of patching one area.' },
      { label: 'Blur faces in photo', to: '/tools/blur-faces-in-photo', description: 'Hide people without inventing background.' },
      { label: 'Redact text in image', to: '/tools/redact-text-in-image', description: 'Black out text that OCR can find, rather than inpainting it.' },
      { label: 'AI image restoration', to: '/tools/ai-image-restoration', description: 'Clean up noise and compression around the repair.' },
      { label: 'Compress image', to: '/tools/compress-image', description: 'Shrink the finished photo for sharing.' },
    ],
    lastReviewed: '2026-10-29',
    workedExamples: [
      {
        title: 'One rectangle on a 4000 x 3000 beach photo',
        body:
          'Input: a 5.2 MB, 4000 x 3000 JPEG with a person at the water line. Draw a box starting 60% across and 40% down, 10% wide and 15% tall, and keep JPG as the output. The API multiplies those fractions by the image size and writes a 4000 x 3000 mask with a white 400 x 450 pixel block at (2400, 1200). LaMa runs once over the image and mask on the GPU and the script saves a 4000 x 3000 JPG with the 180,000 masked pixels filled from the surrounding sand and water. The model pass on a 12-megapixel image takes seconds on the GPU; writing and downloading a multi-megabyte JPG is a comparable share of the total.',
      },
      {
        title: 'Two rectangles on a 1920 x 1080 PNG product shot',
        body:
          'Input: a 2.3 MB, 1920 x 1080 PNG of a lamp on a table with a cable and a price sticker. Draw two boxes: one over the cable (about 5% by 30%) and one over the sticker (about 8% by 6%). Both are rasterized into the same 1920 x 1080 mask, so a single inpainting pass handles both regions. Choose PNG as the output to avoid JPEG artifacts in the filled areas; the result is a 1920 x 1080 PNG, opaque RGB because Pillow converts the input to RGB before inpainting. At 2 megapixels the GPU pass is quick, and most of the wall-clock time is the upload and the PNG write.',
      },
    ],
    whenNotToUse:
      'Do not use inpainting on an object that covers a large share of the frame, sits in front of a face, overlaps readable text, or interrupts a regular pattern such as brick, tiles or a keyboard: the model has to fabricate structure and the result will look smeared or repetitive. It is also the wrong tool when you want to keep a transparent PNG intact, since the script flattens the input to RGB, and when the edit must be forensically honest, because the filled region is generated content. For whole-background replacement use the background remover; for faces that merely need hiding, the face blur tool is more appropriate.',
    primaryKeyword: 'remove object from photo',
    secondaryKeywords: [
      'erase object from image',
      'remove unwanted objects from photos',
      'ai object remover',
      'inpainting online',
      'remove photobomber',
    ],
  },
  // ----------------------------------------------------------------------- MM28: AI AUDIO TOOLS (op-specific pages)
  {
    slug: 'clean-voice-audio',
    name: 'Clean Voice Audio',
    h1: 'Clean Up Voice Recordings with AI',
    tagline:
      'Make speech clearer by reducing hiss, room tone and rumble in podcasts, interviews and voice memos.',
    metaTitle: 'Clean Up Voice Recordings with AI | Media Manipulator',
    metaDescription:
      `Clean up a voice recording with AI. Reduce hiss, hum and room noise so speech is easier to hear. Runs on our own GPU. ${RETENTION_PROMISE}.`,
    ogTitle: 'Clean Up Voice Recordings with AI',
    ogDescription:
      'Reduce hiss, hum and room noise so speech is clearer in podcasts, interviews and voice memos.',
    category: 'ai',
    embed: {
      defaultMediaKind: 'audio',
      defaultTask: 'audio_converter',
      preset: { kind: 'audio', aiOperation: 'clean_voice', hideOperationSelect: true },
      title: 'Clean up a voice recording',
      description:
        'Upload a recording. Clean Voice is already applied, so there is no operation menu to set. Choose an output format if you need something other than the default, then convert.',
    },
    intro:
      'A phone voice memo in an echoey kitchen, a podcast guest on a laptop microphone, a lecture recorded from the back of the room: the words are there, but they sit under hiss and room sound. Clean Voice runs the recording through DeepFilterNet on our GPU, then through a fixed broadcast-style polish chain that trims rumble, caps the top end, brings the level to a consistent loudness and stops peaks from clipping. It is built for talking, not for music.',
    whatItDoes: [
      'Converts your upload to 48 kHz mono with ffmpeg, which is the input DeepFilterNet expects, and hands that WAV to the model on our GPU.',
      'Suppresses steady background sound (hiss, fans, hum, room tone) while keeping the speech, using the DeepFilterNet enhancement network.',
      'Applies a polish chain after denoising: an 80 Hz high-pass, a 14 kHz low-pass, loudness normalisation to -16 LUFS with a -1.5 dBTP true-peak ceiling, and a limiter at 0.95.',
      'Encodes the result in the format you choose: MP3, AAC or OGG at 192 kbps, Opus at 128 kbps, FLAC, or 16-bit WAV.',
      'Skips the standard bitrate, EQ, effect and trim controls, since the AI path replaces the normal ffmpeg filter pipeline.',
    ],
    flowSteps: [
      { title: 'Upload a recording', description: 'Voice memos, interview audio, podcast takes or lecture captures in MP3, WAV, FLAC, M4A, AAC, OGG or Opus.' },
      { title: 'Clean Voice is preset', description: 'The operation is fixed on this page; the only choice left is the output format.' },
      { title: 'Normalise, denoise, polish', description: 'ffmpeg makes a 48 kHz mono WAV, DeepFilterNet denoises it, and the polish filters set the tone and loudness.' },
      { title: 'Download and listen', description: 'Compare with the original on headphones before you publish it.' },
    ],
    advancedDetails: [
      'The polish chain is exactly highpass=f=80,lowpass=f=14000,loudnorm=I=-16:TP=-1.5:LRA=11,alimiter=limit=0.95, applied once to the denoised WAV. The high-pass removes handling rumble and plosive thumps, the low-pass tames hiss above 14 kHz, and loudnorm brings the integrated loudness to -16 LUFS, the usual target for spoken-word podcasts.',
      'Output is always mono at 48 kHz because the model runs on a single channel. A stereo interview stays intelligible but loses its left-right placement; if you need stereo, this is the wrong tool.',
      'Encoder settings come from the output extension: libmp3lame at 192 kbps for MP3, aac at 192 kbps for AAC or M4A, libvorbis at 192 kbps for OGG, libopus at 128 kbps for Opus, flac for FLAC and pcm_s16le for WAV. There is no bitrate selector on the AI path.',
      'Trim ranges and the usual effects are ignored when an AI operation is selected; the converter routes the file straight to the model and returns. Trim the recording first if you only want part of it cleaned.',
      'A second pass through Clean Voice re-normalises audio that is already at -16 LUFS and can add a watery quality to consonants. Run it once.',
      'The model struggles with competing voices, music beds and sudden loud events; those are not "steady background" and are largely left in place.',
    ],
    whyItMatters: [
      'Listeners stop a recording that is tiring to hear even when what is being said is worth hearing.',
      'A consistent -16 LUFS level means an episode plays at the same volume as the ones around it without a manual gain pass.',
      'Speech that has been lifted out of the noise also transcribes more accurately, so cleaning first improves captions too.',
    ],
    useCases: [
      { title: 'Podcasts and interviews', description: 'Tidy a remote guest recorded on a basic microphone and bring them to the same loudness as the host.' },
      { title: 'Voice memos and dictation', description: 'Make a phone recording understandable later, and loud enough to hear without headphones.' },
      { title: 'Lectures and meetings', description: 'Lower the air-conditioning hum and projector fan in a recording taken from the back of a room.' },
      { title: 'Narration for a video', description: 'Polish voice-over before placing it in the Darkroom editor.' },
    ],
    whyMediaManipulator: [
      'DeepFilterNet and the polish chain run on a GPU we operate; the recording is not sent to an outside speech-enhancement service.',
      'The page opens with Clean Voice already selected and the operation menu hidden, so the only decision is the output format.',
      'One cleaning job is one everyday job on your daily allowance (5 as a guest, 30 with a free account by default), not an AI job, and a failed job refunds it.',
    ],
    privacyNote:
      `Your recording is saved in its job folder, converted by ffmpeg to a temporary 48 kHz mono WAV in a scratch directory, and passed to DeepFilterNet on our own GPU; that scratch directory is deleted as soon as the cleaned file has been encoded. The cleaned output stays with the job for download. Audio uploads also go through an automated analysis pass on our server, which transcribes the recording with Whisper for an internal content review and keeps that result with the job. No third-party AI provider receives the file. ${RETENTION_PROMISE}.`,
    supportedFormats: {
      supportedInputFormats: ['mp3', 'wav', 'flac', 'm4a', 'aac', 'ogg', 'opus'],
      supportedOutputFormats: ['mp3', 'wav', 'flac', 'm4a', 'ogg'],
      processingNotes: [
        'Clean Voice uses the everyday allowance; length limits depend on your plan and are shown live in the form.',
      ],
    },
    faq: [
      {
        question: 'Why does the cleaned file come out mono?',
        answer:
          'The pipeline converts every input to one channel at 48 kHz before DeepFilterNet runs, and encodes the model output as it is. A stereo recording therefore returns as mono. For a two-microphone interview, split the channels first and clean each one separately if you need to keep the separation.',
      },
      {
        question: 'What loudness does Clean Voice normalise to?',
        answer:
          'The polish chain uses ffmpeg loudnorm with an integrated target of -16 LUFS, a true-peak ceiling of -1.5 dBTP and a loudness range of 11 LU, followed by a limiter at 0.95. That matches common spoken-word delivery targets, so an episode cleaned here will sit at a similar level to professionally mastered podcasts.',
      },
      {
        question: 'Can I set the bitrate or trim the file on this page?',
        answer:
          'No. When an AI operation is active the converter routes straight to the model and ignores the bitrate, EQ, effects and trim settings. The output rate is fixed by the format: 192 kbps for MP3, AAC and OGG, 128 kbps for Opus. Trim the recording on another tool first if you only want part of it.',
      },
      {
        question: 'How is this different from Remove Background Noise?',
        answer:
          'Both run the same DeepFilterNet model. Clean Voice adds the high-pass, low-pass, loudness normalisation and limiter afterwards; Remove Background Noise stops at the denoised signal and leaves your levels and tone alone. Pick Clean Voice for a finished spoken-word file and the other page when you plan to mix or master it yourself.',
      },
      {
        question: 'Can it fix a recording that is clipped or distorted?',
        answer:
          'No. Clipping is missing waveform, not added noise, and the model has nothing to subtract. It can still lower the hiss around a distorted take, but the crunch on loud syllables will remain.',
      },
      {
        question: 'How many recordings can I clean per day, and is it free?',
        answer:
          'Clean Voice is deliberately counted as an everyday job, so it spends one from the everyday allowance: 5 per day as a guest, 30 with a free account, 300 on Premium and 700 on Pro by default, with file caps of 200 MB, 1 GB and 5 GB and length caps of 5 minutes, 20 minutes and 2 hours. The current table is on /pricing.',
      },
    ],
    related: [
      { label: 'Remove background noise', to: '/tools/remove-background-noise', description: 'The same denoiser without the loudness and tone polish.' },
      { label: 'Transcribe video', to: '/tools/transcribe-video', description: 'Turn the cleaned speech into captions or text.' },
      { label: 'Extract audio from video', to: '/tools/extract-audio-from-video', description: 'Pull the voice track out of a video before cleaning it.' },
      { label: 'Darkroom', to: '/tools/content-studio', description: 'Place the polished narration on a video timeline.' },
      { label: 'Remove vocals from a song', to: '/tools/remove-vocals-from-song', description: 'For music rather than speech, separate the singer instead.' },
    ],
    lastReviewed: '2026-10-29',
    workedExamples: [
      {
        title: 'A 12-minute phone memo (M4A, 128 kbps, about 11 MB) to MP3',
        body: 'An AAC file at 128 kbps is 16 KB per second, so 720 seconds is about 11.5 MB. Twelve minutes is over the 5-minute guest limit, so this needs a free account (20 minutes). ffmpeg first writes a 48 kHz mono WAV of about 69 MB (96,000 bytes per second) in a temporary folder that is removed when the job ends. DeepFilterNet and the polish chain run on that, and the MP3 encoder writes the result at 192 kbps: about 17 MB, which is larger than the input because 192 kbps is a higher rate than the memo was recorded at. The two ffmpeg steps take seconds; the DeepFilterNet pass dominates and grows with the length of the recording.',
      },
      {
        title: 'A 4-minute stereo WAV interview (44.1 kHz, 16-bit, about 42 MB) to WAV',
        body: 'Stereo 16-bit 44.1 kHz PCM is 176,400 bytes per second, so 240 seconds is about 42 MB, within the guest limits of 200 MB and 5 minutes. The file is folded to mono and resampled to 48 kHz before the model runs, and the cleaned WAV comes back as 16-bit mono 48 kHz: 96,000 bytes per second, about 23 MB. It is smaller than the input only because it has one channel instead of two. Choosing FLAC instead keeps the same samples losslessly in less space; choosing MP3 gives about 5.8 MB at 192 kbps.',
      },
    ],
    whenNotToUse:
      'Skip this tool for music, singing or anything where the background is part of the sound you want to keep: the model treats everything that is not speech as noise, and the polish chain cuts below 80 Hz and above 14 kHz, which hollows out instruments. It is also the wrong choice when you need to keep stereo, when the recording is clipped or distorted (that damage is not noise and cannot be filtered out), or when you only want the noise lowered without any change to level or tone, which is what the Remove Background Noise page does instead.',
    primaryKeyword: 'clean up voice recording',
    secondaryKeywords: [
      'improve voice quality online',
      'enhance speech audio',
      'ai voice cleaner',
      'make voice clearer',
      'podcast audio cleanup',
    ],
  },
  {
    slug: 'remove-background-noise',
    name: 'Remove Background Noise',
    h1: 'Remove Background Noise from Audio Online',
    tagline:
      'Lower hiss, hum, traffic and room noise in a recording with an AI denoiser, keeping the main sound in front.',
    metaTitle: 'Remove Background Noise from Audio Online | Media Manipulator',
    metaDescription:
      `Remove background noise from audio. An AI denoiser lowers hiss, hum and ambient sound in recordings. Runs on our own GPU. ${RETENTION_PROMISE}.`,
    ogTitle: 'Remove Background Noise from Audio Online',
    ogDescription:
      'An AI denoiser that lowers hiss, hum, traffic and room noise in audio recordings.',
    category: 'ai',
    embed: {
      defaultMediaKind: 'audio',
      defaultTask: 'audio_converter',
      preset: { kind: 'audio', aiOperation: 'remove_background_noise' },
      title: 'Remove background noise',
      description:
        'Upload a recording. Remove Background Noise is already selected for you. You can still change the output format, then convert.',
    },
    intro:
      'Air conditioners, computer fans, street traffic and electrical hum are steady sounds that sit underneath what you actually meant to record. This page runs the file through DeepFilterNet, a deep-learning denoiser, on our GPU and returns the denoised signal with nothing else changed: no loudness normalisation, no equalisation, no limiter. That makes it the right choice when you intend to mix or master the result yourself, or when you want the character of the original left alone.',
    whatItDoes: [
      'Resamples the upload to 48 kHz mono with ffmpeg and passes that WAV to the DeepFilterNet binary on our GPU.',
      'Estimates the stationary noise floor and subtracts it, lowering hiss, hum, fans, air handling and constant traffic.',
      'Returns the raw model output encoded in the format you pick, with the same peak level and tonal balance the model produced; there is no post-processing stage on this page.',
      'Keeps the operation menu visible, so you can switch to Clean Voice or the vocal tools from the same form.',
    ],
    flowSteps: [
      { title: 'Upload audio', description: 'Any common audio file, including a track extracted from a video.' },
      { title: 'Denoise is preselected', description: 'Remove Background Noise is already chosen; change the output format if you want something other than MP3.' },
      { title: 'DeepFilterNet runs on our GPU', description: 'The model separates steady noise from the foreground and writes an enhanced WAV.' },
      { title: 'Encode and download', description: 'ffmpeg writes the enhanced WAV in your chosen format; listen beside the original.' },
    ],
    advancedDetails: [
      'The only difference between this page and Clean Voice in the API is a single flag: polish=false. The ffmpeg encode step receives no -af filter, so the enhanced WAV is encoded as DeepFilterNet wrote it.',
      'Input normalisation is ffmpeg -ac 1 -ar 48000: the model runs on one 48 kHz channel, so the output is mono at 48 kHz regardless of the input layout or sample rate.',
      'Encoders follow the extension: MP3 via libmp3lame at 192 kbps, AAC at 192 kbps, OGG via libvorbis at 192 kbps, Opus via libopus at 128 kbps, FLAC lossless, WAV as pcm_s16le. Pick WAV or FLAC if you are going to edit further so you only pay for a lossy encode once.',
      'Because no loudness normalisation runs, a quiet recording stays quiet. Denoising removes energy, so the result can be a little lower in level than the input; raise the gain in your editor afterwards if needed.',
      'DeepFilterNet is trained on stationary and slowly varying noise. Keyboard clicks, door slams, a second speaker or a music bed are mostly preserved, since they look like signal to the model.',
      'The scratch directory holding the normalised and enhanced WAVs is deleted when the job finishes; only the encoded output stays with the job.',
    ],
    whyItMatters: [
      'Constant noise masks quiet consonants and tires listeners long before they notice why.',
      'Many recordings cannot be redone: a wedding speech, a lecture, an interview with someone who is no longer available.',
      'A denoised track that has not been normalised or limited gives you a clean starting point for your own mix instead of a finished-sounding file you then have to undo.',
    ],
    useCases: [
      { title: 'Audio pulled from a video', description: 'Extract the track, remove the camera fan or wind, then lay it back under the picture in Darkroom.' },
      { title: 'Field recordings', description: 'Lower the drone of a road or a generator under an outdoor interview.' },
      { title: 'Call and meeting exports', description: 'Reduce the line hiss in a recorded call before sharing or transcribing it.' },
      { title: 'Digitised cassettes', description: 'Take the tape hiss down on a converted recording without changing its levels.' },
    ],
    whyMediaManipulator: [
      'The denoiser runs on a GPU we operate; your audio is not uploaded to a third-party noise-removal service.',
      'Nothing is added after the model: no loudness change, no EQ, so what you hear is the denoising and only the denoising.',
      'A denoise job is one everyday job from your daily allowance, not an AI job, and is refunded if the job fails.',
    ],
    privacyNote:
      `The file you upload is written to its job folder, resampled by ffmpeg to a temporary mono 48 kHz WAV in a scratch directory, and denoised by DeepFilterNet on our own GPU; the scratch directory is removed once the output has been encoded. The encoded result is kept with the job for download. Like every audio upload, it is also run through an automated analysis step on our server, which transcribes it with Whisper for an internal review that stays with the job. Nothing goes to an outside AI provider. ${RETENTION_PROMISE}.`,
    supportedFormats: {
      supportedInputFormats: ['mp3', 'wav', 'flac', 'm4a', 'aac', 'ogg', 'opus'],
      supportedOutputFormats: ['mp3', 'wav', 'flac', 'm4a', 'ogg'],
      processingNotes: [
        'Denoising uses the everyday allowance; length limits depend on your plan and are shown live in the form.',
      ],
    },
    faq: [
      {
        question: 'Which noises does DeepFilterNet handle well, and which does it not?',
        answer:
          'Steady, slowly changing sound: hiss, mains hum, fans, air conditioning, room tone, a constant road. Short events and anything speech-like (a second person, a television, clicks, bangs) look like foreground to the model and are mostly kept.',
      },
      {
        question: 'Will the level or tone of my recording change?',
        answer:
          'Only as a side effect of removing noise energy; no normalisation, EQ or limiting is applied on this page. If you want a consistent -16 LUFS spoken-word level and a high-pass and low-pass pass as well, use Clean Voice, which runs the same model with that polish chain added.',
      },
      {
        question: 'Why is the denoised file mono?',
        answer:
          'The model takes a single 48 kHz channel, so ffmpeg folds any stereo input to mono first and the output is written that way. A stereo recording with different noise in each channel should be split and denoised one channel at a time if you need to keep it stereo.',
      },
      {
        question: 'Can I denoise the audio of a video directly?',
        answer:
          'Upload the audio track rather than the video: extract it with the Extract Audio tool, denoise it here, then combine the cleaned track and the video in Darkroom.',
      },
      {
        question: 'Which output format is best for further editing?',
        answer:
          'WAV (16-bit mono 48 kHz, 96 KB per second) or FLAC, which holds the same samples in less space. MP3, AAC and OGG are written at 192 kbps and Opus at 128 kbps; pick those only for the final share so the lossy encode happens once.',
      },
      {
        question: 'Does denoising count against the AI allowance?',
        answer:
          'No. Background-noise removal is deliberately counted as an everyday job, like Clean Voice: 5 a day for a guest, 30 with a free account, 300 on Premium and 700 on Pro by default. (Isolating or removing vocals is different: each of those is one AI job.) Length is capped at 5 minutes for guests and 20 minutes for free accounts; the current limits are on /pricing.',
      },
      {
        question: 'What if the recording is already fairly clean?',
        answer:
          'The model still runs and will remove whatever residual floor it finds, but the audible difference will be small and you may prefer the untouched original. Compare the two before replacing anything.',
      },
    ],
    related: [
      { label: 'Clean voice audio', to: '/tools/clean-voice-audio', description: 'The same denoiser plus loudness and tone polish for speech.' },
      { label: 'Extract audio from video', to: '/tools/extract-audio-from-video', description: 'Pull the audio track out of a video first.' },
      { label: 'Darkroom', to: '/tools/content-studio', description: 'Lay the denoised track back under the video.' },
      { label: 'Transcribe video', to: '/tools/transcribe-video', description: 'Transcribe the cleaner audio for captions.' },
      { label: 'Remove vocals from a song', to: '/tools/remove-vocals-from-song', description: 'Separate singing from music with a different model.' },
    ],
    lastReviewed: '2026-10-29',
    workedExamples: [
      {
        title: 'An 18-minute MP3 call recording at 128 kbps (about 17 MB) to FLAC',
        body: 'At 128 kbps an MP3 is 16 KB per second, so 1,080 seconds is about 17 MB. Eighteen minutes is inside the free-account cap of 20 minutes but over the 5-minute guest cap, so sign in first. ffmpeg writes a 48 kHz mono WAV of about 104 MB (96,000 bytes per second) for the model, and that WAV is discarded after encoding. Choosing FLAC returns the enhanced mono 48 kHz samples losslessly; the FLAC is smaller than the 104 MB WAV by an amount that depends on how much silence and hiss was removed, and the denoising itself usually makes FLAC compress better. Choosing MP3 instead would give about 26 MB at 192 kbps.',
      },
      {
        title: 'A 4-minute 30-second stereo FLAC field recording (about 30 MB) to WAV',
        body: 'Four and a half minutes and 30 MB are inside the guest limits of 5 minutes and 200 MB, so no account is needed. The stereo file is folded to mono and resampled to 48 kHz, DeepFilterNet lowers the traffic bed, and the WAV output is 16-bit mono 48 kHz: 96,000 bytes per second for 270 seconds, about 26 MB. The level is whatever the model left, with no normalisation applied, so bring it up in your editor if the original was quiet. The two ffmpeg conversions are a few seconds each; the GPU pass scales with duration.',
      },
    ],
    whenNotToUse:
      'This is not the tool for recordings where the noise is intermittent or is itself a voice: overlapping speakers, a television in the next room, chair scrapes and keyboard clatter are left largely intact because the model is built for steady noise. Do not use it on finished music, where the "noise" it removes may be reverb and room ambience you paid for. If you need the output stereo, it is the wrong choice because the pipeline is mono. And if you want a ready-to-publish spoken-word file at a standard loudness, Clean Voice adds that polish; this page deliberately does not.',
    primaryKeyword: 'remove background noise from audio',
    secondaryKeywords: [
      'audio denoiser online',
      'reduce noise in recording',
      'remove hiss from audio',
      'ai noise reduction',
      'remove hum from audio',
    ],
  },
  {
    slug: 'remove-vocals-from-song',
    name: 'Remove Vocals from a Song',
    h1: 'Remove Vocals from a Song for an Instrumental or Karaoke Track',
    tagline:
      'Strip the singing from a track and keep the music, for karaoke, practice and backing tracks. Use only on music you have rights to.',
    metaTitle: 'Remove Vocals from a Song: Karaoke Maker | Media Manipulator',
    metaDescription:
      `Remove vocals from a song with AI and download the instrumental in the same format as your file, or as FLAC or WAV. Karaoke and practice tracks, on our own GPU. ${RETENTION_PROMISE}.`,
    ogTitle: 'Remove Vocals from a Song for Karaoke',
    ogDescription:
      'Strip the singing from a song with AI and download the instrumental as MP3, FLAC or WAV.',
    category: 'ai',
    embed: {
      defaultMediaKind: 'audio',
      defaultTask: 'audio_converter',
      preset: { kind: 'audio', aiOperation: 'remove_vocals', hideOperationSelect: true, format: 'auto' },
      title: 'Remove vocals from a song',
      description:
        'Upload a song. Remove Vocals is already selected, and the instrumental comes back in the same format as your file (MP3 stays MP3); pick FLAC or WAV under Output format for lossless. Press convert.',
    },
    intro:
      'Karaoke nights, singing practice and cover recordings all need the band without the singer. This page runs the song through Demucs (the htdemucs model) on our GPU in two-stem mode, which splits the mix into "vocals" and "everything else", and returns the everything-else stem. The instrumental comes back in the same format as your file by default, so a 320 kbps MP3 stays a 320 kbps MP3 instead of swelling into a WAV; FLAC and WAV are there when you want a lossless file for editing.',
    whatItDoes: [
      'Runs Demucs htdemucs with --two-stems=vocals, so the model estimates only two parts: the lead vocal and the accompaniment.',
      'Keeps the no_vocals stem and discards the vocal stem; the result is one stereo file with the singing removed.',
      'Resolves "Same as input" to a concrete format on upload: MP3 stays MP3, AAC/M4A stays AAC/M4A, OGG and Opus stay as they are, and WAV, FLAC, AIFF or ALAC inputs come back as FLAC.',
      'Writes MP3 and AAC stems at 320 kbps rather than the 192 kbps the other audio tools use, so the encode does not add audible loss on top of the separation.',
      'Shows an estimated output size for each format choice before you start, based on the length of your file.',
    ],
    flowSteps: [
      { title: 'Upload a song', description: 'A track you own or are licensed to use, in MP3, WAV, FLAC, M4A, AAC, OGG or Opus.' },
      { title: 'Remove Vocals is preset', description: 'The operation is fixed; "Output format" defaults to Same as input, with MP3, FLAC and WAV as alternatives.' },
      { title: 'Demucs separates the mix', description: 'The model works through the song in 7-second segments on our GPU and writes vocals.wav and no_vocals.wav.' },
      { title: 'Encode and download', description: 'The no_vocals stem is encoded in the resolved format and offered for download.' },
    ],
    advancedDetails: [
      'The exact invocation is demucs -n htdemucs --two-stems=vocals --segment 7; the segment length bounds GPU memory and lets long tracks run on a single card. Demucs writes 44.1 kHz stereo stems whatever the input rate or channel count, so a mono or 48 kHz source comes back as 44.1 kHz stereo.',
      'Stem encoding is libmp3lame -b:a 320k for MP3 and aac -b:a 320k for AAC or M4A; OGG stays at 192 kbps, Opus at 128 kbps, FLAC and WAV are lossless. Every other AI audio operation uses 192 kbps, the 320 kbps rate is specific to stems.',
      'The "Same as input" rule is: lossy input returns the same container, lossless input returns FLAC, and a video file or anything the server cannot place returns MP3 at 320 kbps. An .m4a is probed with ffprobe before deciding, because it may hold lossless ALAC rather than AAC.',
      'The rule exists because of a real job: an 87-minute, 68 MB MP3 once came back as an 880 MB WAV. PCM adds no fidelity a lossy source never had, so the default now never upsizes lossy audio to WAV; choosing WAV explicitly is still honoured.',
      'Separation is never perfect. Reverb tails on the vocal, backing harmonies and anything the model hears as "voice-like" (some synth leads, whistles) can leak into the instrumental, and dense mixes separate worse than modern, well-spaced productions.',
      'The form warns when a WAV choice would be over 500 MB, since WAV at 44.1 kHz stereo 16-bit is 176,400 bytes per second, about 10.6 MB per minute.',
    ],
    whyItMatters: [
      'Official instrumental versions do not exist for most songs, and licensed backing tracks are often re-recorded rather than the original arrangement.',
      'Singers rehearse against the real arrangement more usefully than against a MIDI approximation.',
      'Returning the stem in the input format keeps a phone-sized file phone-sized; a 10 MB MP3 should not become a 50 MB download by accident.',
    ],
    useCases: [
      { title: 'Karaoke at home', description: 'Make a singalong version of a song you already own.' },
      { title: 'Vocal practice', description: 'Rehearse your part over the original band without the lead singer in your ear.' },
      { title: 'Covers and remixes', description: 'Use the instrumental as the bed for your own vocal take.' },
      { title: 'Background music for video', description: 'Pull a vocal-free bed from music you are licensed to use for a Darkroom project.' },
    ],
    whyMediaManipulator: [
      'Separation runs on a GPU we operate with the Demucs htdemucs model; your music is not sent to an outside stem service.',
      'The output follows your file by default, with the encoded MP3 or AAC stem at 320 kbps, and FLAC or WAV one click away.',
      'The size estimate for each format is shown before you start, so an oversized WAV is a choice, not a surprise.',
    ],
    privacyNote:
      `Your song is stored in its job folder and passed to Demucs on our own GPU, which writes the vocal and accompaniment stems into a scratch directory; only the accompaniment is encoded into your download, and the scratch directory (including the discarded vocal stem) is deleted when the job ends. The encoded instrumental is kept with the job. Audio uploads also pass through an automated analysis step on our server that transcribes the file with Whisper for an internal review kept with the job. No third-party AI provider is involved. ${RETENTION_PROMISE}.`,
    supportedFormats: {
      supportedInputFormats: ['mp3', 'wav', 'flac', 'm4a', 'aac', 'ogg', 'opus'],
      supportedOutputFormats: ['mp3', 'flac', 'wav', 'm4a', 'ogg', 'opus'],
      processingNotes: [
        'Vocal removal uses the AI allowance; it and the length limits depend on your plan and are shown live in the form.',
      ],
    },
    faq: [
      {
        question: 'Will every trace of the singer be gone?',
        answer:
          'Most of the lead vocal, but rarely all of it. Reverb tails, doubled and harmony vocals, and sounds the model hears as voice-like can remain at a low level. Modern stereo productions separate best; mono or heavily bled live recordings worst.',
      },
      {
        question: 'What format and sample rate does the instrumental come in?',
        answer:
          'Demucs writes 44.1 kHz stereo stems, so that is the rate of every output. The container follows your file by default: MP3 in, MP3 out at 320 kbps; AAC or M4A in, the same out at 320 kbps; WAV, FLAC, AIFF or ALAC in, FLAC out. You can pick MP3, FLAC or WAV explicitly instead.',
      },
      {
        question: 'Why is the default no longer WAV?',
        answer:
          'Because an 87-minute MP3 of 68 MB used to come back as an 880 MB WAV, and PCM cannot restore detail a lossy source never had. The stem now stays in the input format, with lossy stems written at 320 kbps so the extra encode is not audible. WAV is still available if you ask for it.',
      },
      {
        question: 'Can I get the vocals alone instead of the backing?',
        answer:
          'Yes, choose Isolate Vocals in the operation menu of the audio converter; it keeps the vocals.wav stem from the same two-stem Demucs run and discards the accompaniment.',
      },
      {
        question: 'Can I upload a music video instead of an audio file?',
        answer:
          'Upload the audio: extract the track from the video first. If a video file does reach this operation, the server resolves Same as input to MP3 at 320 kbps, since the video container is not an audio format.',
      },
      {
        question: 'How many songs a day can I separate for free?',
        answer:
          'Each song is one AI job: by default 3 per day without an account, 10 with a free account, 100 on Premium and 200 on Pro. The AI allowance is counted separately, so separating songs leaves your everyday allowance intact. Songs are capped at 5 minutes for guests and 20 minutes for free accounts, with 2 hours on paid plans; /pricing has the current table.',
      },
      {
        question: 'Is it legal to make a karaoke track this way?',
        answer:
          'Only from music you own, are licensed to use, or may use under an exception where you live. The tool does not check rights; you are responsible for the result and how you distribute it.',
      },
    ],
    related: [
      { label: 'Extract audio from video', to: '/tools/extract-audio-from-video', description: 'Get the audio out of a music video before separating it.' },
      { label: 'Clean voice audio', to: '/tools/clean-voice-audio', description: 'For speech recordings, use the speech-enhancement model instead.' },
      { label: 'Remove background noise', to: '/tools/remove-background-noise', description: 'Lower steady noise in a recording without separating it.' },
      { label: 'Darkroom', to: '/tools/content-studio', description: 'Use the instrumental as the music bed in a video edit.' },
      { label: 'Transcribe video', to: '/tools/transcribe-video', description: 'Get the lyrics as text from the original mix.' },
    ],
    lastReviewed: '2026-10-29',
    workedExamples: [
      {
        title: 'A 4-minute 320 kbps MP3 (about 9.6 MB) with Same as input',
        body: 'At 320 kbps an MP3 is 40 KB per second, so 240 seconds is about 9.6 MB, well inside the guest limits of 5 minutes and 200 MB. The format resolves to MP3 because the input is MP3. Demucs runs over the song in 7-second windows on our GPU and writes a 44.1 kHz stereo no_vocals.wav of about 42 MB in a scratch folder, which ffmpeg then encodes with libmp3lame at 320 kbps: the instrumental is again about 9.6 MB. The scratch WAV is deleted. The separation pass dominates the run time and grows with the length of the track.',
      },
      {
        title: 'A 4-minute 50-second CD-quality WAV (about 51 MB), default FLAC or explicit WAV',
        body: 'A 44.1 kHz stereo 16-bit WAV is 176,400 bytes per second, so 290 seconds is about 51 MB, still within the 5-minute guest cap. Because the input is lossless, Same as input resolves to FLAC: the form estimates the FLAC at roughly 55 percent of the PCM size, about 28 MB, and the actual figure depends on the music. Picking WAV instead returns the stem as 16-bit PCM at about 51 MB, the same size as the input; picking MP3 gives about 11.6 MB at 320 kbps. All three come from the same no_vocals stem, only the encoder differs.',
      },
    ],
    whenNotToUse:
      'Do not run this on music you do not own or hold a licence for; you are responsible for how the result is used. It is also the wrong tool when you want the singer rather than the band (that is the isolate-vocals operation in the same form), when you need a four-way split into drums, bass and other instruments (this page only produces vocals and accompaniment), or when the recording is speech rather than singing, which the Clean Voice and background-noise pages handle better. Very old mono recordings and live bootlegs with the vocal bleeding into every microphone separate poorly, so expect audible ghosts there.',
    primaryKeyword: 'remove vocals from song',
    secondaryKeywords: [
      'karaoke maker online',
      'make instrumental from song',
      'vocal remover',
      'ai vocal remover',
      'create backing track',
    ],
  },

  // ----------------------------------------------------------------------- GENERAL CONVERTERS
  {
    slug: 'image-converter',
    name: 'Image Converter',
    h1: 'Free Online Image Converter',
    tagline:
      'Convert between JPG, PNG, WebP, AVIF, GIF, and more — with control over quality, resizing, cropping, and metadata.',
    metaTitle: 'Free Online Image Converter | Media Manipulator',
    metaDescription:
      'Free online image converter for JPG, PNG, WebP, AVIF, GIF, and HEIC. Resize, compress, crop, and strip metadata in one upload.',
    ogTitle: 'Free Online Image Converter',
    ogDescription:
      'Convert JPG, PNG, WebP, AVIF, GIF, and HEIC. Resize, compress, and strip metadata in one upload.',
    category: 'image',
    embed: {
      defaultMediaKind: 'image',
      defaultTask: 'image_converter',
      title: 'Convert an image',
      description:
        'Upload any image and choose the output format, quality, and resize/crop settings. JPG suits photos, PNG keeps transparency, and WebP/AVIF give the smallest web files.',
    },
    intro:
      'A single image often needs to live in several places — your website, a presentation, a print piece, a marketplace listing. Each one prefers a different format. Media Manipulator handles every common image format in one place, with fine control over quality, resizing, and metadata.',
    whatItDoes: [
      'Converts between JPG, PNG, WebP, AVIF, GIF, HEIC, and more.',
      'Resize, crop, rotate, and apply visual filters in a single pass.',
      'Strip or keep EXIF/IPTC/XMP metadata as needed.',
      'AI tools: face blur, background removal, upscaling, and text/PII redaction.',
    ],
    flowSteps: [
      { title: 'Upload image', description: 'Drop in any common image file.' },
      { title: 'Pick output format', description: 'JPG, PNG, WebP, AVIF, GIF.' },
      { title: 'Tune quality and metadata', description: 'Resize, crop, or strip EXIF.' },
      { title: 'Download', description: 'Save the converted image.' },
    ],
    advancedDetails: [
      'WebP and AVIF give the smallest web files — AVIF often beats WebP at the same visual quality.',
      'PNG is lossless and supports transparency; great for UI assets and screenshots.',
      'JPG is the safest exchange format for photos.',
    ],
    whyItMatters: [
      'Different platforms and tools accept different image formats.',
      'Smaller image files load pages faster — Google ranks faster pages higher.',
      'Stripping metadata before sharing protects your privacy.',
    ],
    useCases: [
      { title: 'Web optimization', description: 'Convert PNG photos to WebP/AVIF to shrink page weight.' },
      { title: 'Cross-platform sharing', description: 'Convert HEIC iPhone photos to JPG.' },
      { title: 'Marketplace listings', description: 'Strip metadata and resize before posting.' },
      { title: 'Print and presentations', description: 'Output JPG at a high quality preset.' },
    ],
    whyMediaManipulator: [
      'One upload covers convert, resize, crop, filter, AI, and metadata.',
      'Free, no signup, no watermarks.',
      'AI tools run on our own GPU server.',
    ],
    privacyNote: privacyNoteFor('image', 'Your image is converted, and resized or cropped if you asked, by ImageMagick on our server.'),
    faq: [
      { question: 'What is the best image format?', answer: 'It depends — WebP/AVIF for the web, PNG for transparency, JPG for compatibility.' },
      { question: 'Can I batch-convert?', answer: 'The free tool converts one image at a time. Run multiple conversions sequentially.' },
      { question: 'Will it strip metadata?', answer: 'Only if you set Metadata mode to "Strip". The default is to keep metadata.' },
      { question: 'Does it work on HEIC?', answer: 'Yes — iPhone HEIC photos convert cleanly to JPG, PNG, or WebP.' },
    ],
    related: [
      { label: 'Image resizer', to: '/tools/image-resizer', description: 'Resize to exact pixel dimensions.' },
      { label: 'Compress image', to: '/tools/compress-image', description: 'Shrink image file size for the web.' },
      { label: 'Image to PDF', to: '/tools/image-to-pdf', description: 'Wrap an image into a PDF document.' },
      { label: 'PDF converter', to: '/tools/pdf-converter', description: 'Convert PDFs to images and back.' },
      { label: 'Convert HEIC to JPG', to: '/tools/convert-heic-to-jpg', description: 'Convert iPhone HEIC photos to JPG.' },
      { label: 'Remove background from image', to: '/tools/remove-background-from-image', description: 'Auto-erase a background into a transparent PNG.' },
      { label: 'Convert WebP to JPG', to: '/tools/convert-webp-to-jpg', description: 'Focused WebP → JPG converter.' },
      { label: 'Image converter tutorial', to: '/tutorials/image/getting-started', description: 'Full walkthrough of every option.' },
      // Hidden during AdSense review — re-enable when the blog returns.
      // { label: 'Image optimization guide', to: '/blog/image/image-optimization-guide', description: 'JPG vs PNG vs WebP vs AVIF.' },
    ],
    primaryKeyword: 'image converter',
    secondaryKeywords: [
      'online image converter',
      'convert JPG to PNG',
      'convert HEIC to JPG',
      'convert PNG to WebP',
      'free image converter',
    ],
  },
  {
    slug: 'video-converter',
    name: 'Video Converter',
    h1: 'Free Online Video Converter',
    tagline:
      'Convert between MP4, WebM, MOV, AVI, MKV, and more — with full control over codecs, resolution, and audio.',
    metaTitle: 'Free Online Video Converter | Media Manipulator',
    metaDescription:
      'Free online video converter for MP4, WebM, MOV, AVI, MKV, and more. Pick codecs, bitrate, resolution, and audio settings.',
    ogTitle: 'Free Online Video Converter',
    ogDescription:
      'Convert MP4, WebM, MOV, AVI, MKV, FLV, WMV, and more. Pick codec, bitrate, and audio settings.',
    category: 'video',
    embed: {
      defaultMediaKind: 'video',
      defaultTask: 'video_converter',
      title: 'Convert a video',
      description:
        'Upload any video and choose the target container/codec. The "medium" quality preset is a good default. MP4 plays everywhere; WebM gives smaller files in modern browsers.',
    },
    intro:
      'Different platforms want different video formats. Edit on a Mac in MOV, post to the web in MP4 or WebM, archive in MKV. Media Manipulator handles every common video container and codec in one place, with full control over bitrate, resolution, and audio.',
    whatItDoes: [
      'Converts between MP4, WebM, MOV, AVI, MKV, FLV, WMV, and ProRes.',
      'Choose codec (H.264, H.265, VP9, ProRes, DNxHD).',
      'Resize, change frame rate, trim, and re-encode audio.',
      'Apply filters and color grading optionally.',
    ],
    flowSteps: [
      { title: 'Upload video', description: 'Drop in any common video container.' },
      { title: 'Pick target format', description: 'MP4, WebM, MOV, AVI, MKV.' },
      { title: 'Tune codec and quality', description: 'Bitrate, resolution, audio.' },
      { title: 'Download', description: 'Save the converted video.' },
    ],
    advancedDetails: [
      'H.264 in MP4 is the safe-everywhere default.',
      'H.265 (HEVC) and VP9 give ~25–50% smaller files at the same visual quality, but need a modern player.',
      'For editing handoffs, ProRes (in MOV) or DNxHD (in MOV/MXF) preserve the most quality.',
    ],
    whyItMatters: [
      'Editing apps, browsers, and social platforms each prefer different formats.',
      'Smaller video files improve page-load time and bandwidth costs.',
      'Re-encoding lets you fix wrong codecs or unplayable files.',
    ],
    useCases: [
      { title: 'MOV → MP4', description: 'Make Apple-shot footage playable everywhere.' },
      { title: 'AVI → MP4', description: 'Modernize an old archive video.' },
      { title: 'MP4 → WebM', description: 'Shrink web video for modern browsers.' },
      { title: 'Editor handoffs', description: 'Export ProRes or DNxHD for high-quality editing.' },
    ],
    whyMediaManipulator: [
      'Full control over codec, bitrate, and audio in one upload.',
      'AI transcription available on the same file.',
      'Free, no signup, no watermarks.',
    ],
    privacyNote: privacyNoteFor('video', 'Your video is re-encoded by FFmpeg on our server into the container and codec you choose.'),
    faq: [
      { question: 'What output format is best?', answer: 'MP4 with H.264 for compatibility, WebM with VP9 for the smallest web files.' },
      { question: 'Can I trim before converting?', answer: 'Yes — the trim section of the form lets you cut the clip down before re-encoding.' },
      { question: 'Will my audio stay in sync?', answer: 'Yes — FFmpeg keeps A/V sync. If you change frame rate or speed, audio is resampled accordingly.' },
      { question: 'Is there a file-size limit?', answer: 'Very large files may be rejected on the free tier. Try lowering the resolution first.' },
    ],
    related: [
      { label: 'Convert MOV to MP4', to: '/tools/convert-mov-to-mp4', description: 'Make QuickTime/iPhone footage play everywhere.' },
      { label: 'Convert WebM to MP4', to: '/tools/convert-webm-to-mp4', description: 'Turn web video into an editable MP4.' },
      { label: 'Convert MP4 to WebM', to: '/tools/convert-mp4-to-webm', description: 'Shrink MP4 into VP9 WebM for the web.' },
      { label: 'Compress video', to: '/tools/compress-video', description: 'Focused compressor for shrinking video files.' },
      { label: 'Convert video to GIF', to: '/tools/convert-video-to-animated-gif', description: 'Turn short clips into animated GIFs.' },
      { label: 'Extract audio from video', to: '/tools/extract-audio-from-video', description: 'Save the soundtrack as MP3, WAV or M4A.' },
      { label: 'Video trimmer', to: '/tools/video-trimmer', description: 'Cut a clip to the part you want, losslessly.' },
      { label: 'Resize video', to: '/tools/resize-video', description: 'Change the resolution to 1080p, 720p, or custom.' },
      { label: 'Rotate video', to: '/tools/rotate-video', description: 'Fix sideways or upside-down footage.' },
      { label: 'Transcribe video', to: '/tools/transcribe-video', description: 'Pull speech out of video as text or VTT captions.' },
      { label: 'AI Frame Interpolation', to: '/tools/ai-frame-interpolation', description: 'Boost video FPS to 48, 60, or 120 with AI-generated frames.' },
      { label: 'Transcode video to HLS', to: '/tools/transcode-to-hls', description: 'Generate an adaptive HLS package from any video.' },
      { label: 'Transcode video to DASH', to: '/tools/transcode-to-dash', description: 'Generate a MPEG-DASH AV1/VP9 package from any video.' },
      { label: 'Video converter tutorial', to: '/tutorials/video/getting-started', description: 'Full walkthrough of every option.' },
      // Hidden during AdSense review — re-enable when the blog returns.
      // { label: 'Video compression guide', to: '/blog/video/video-compression-guide', description: 'Codec, bitrate, and container deep dive.' },
    ],
    primaryKeyword: 'video converter',
    secondaryKeywords: [
      'online video converter',
      'MP4 converter',
      'convert MOV to MP4',
      'convert AVI to MP4',
      'free video converter',
    ],
  },

  // ----------------------------------------------------------------------- VIDEO SEO BATCH 1 (MP4 / format converters, video-to-audio, video-to-GIF)
  {
    slug: 'mp4-converter',
    name: 'MP4 Converter',
    h1: 'Free MP4 Converter Online',
    tagline:
      "Convert a video to MP4: the video converter with MP4 preselected.",
    metaTitle: 'Free MP4 Converter Online | Media Manipulator',
    metaDescription:
      `Free online MP4 converter. Convert MOV, WebM, AVI, MKV, FLV, and WMV to MP4 (H.264 + AAC) that plays everywhere. No watermark, no signup. ${RETENTION_PROMISE}.`,
    ogTitle: 'Free MP4 Converter Online',
    ogDescription:
      'Convert MOV, WebM, AVI, MKV, FLV, and WMV to a universal MP4 that plays on every device and platform.',
    category: 'video',
    embed: {
      defaultMediaKind: 'video',
      defaultTask: 'mp4_converter',
      defaultVideoOutputFormat: 'mp4',
      title: 'Convert a video to MP4',
      description:
        'Upload any video and convert it to MP4. MP4 is preselected and uses H.264 + AAC by default, but you can switch the output to WebM, MOV, MKV, and more.',
    },
    intro:
      "This page opens the Media Manipulator video converter with MP4 already selected as the output. It is otherwise the same tool: you can switch the output to WebM, MOV, MKV, AVI or GIF, choose a quality preset, and resize the video in the same upload. MP4 output is encoded with H.264 video and AAC audio, in the yuv420p pixel format that Safari, QuickTime and social platforms expect, with the index moved to the front of the file so playback starts while it downloads. Converting is a re-encode, so the result can be larger or smaller than the source depending on the preset; it will not improve a low-quality original. For a MOV from an iPhone, or a WebM, MKV or AVI that will not open somewhere, MP4 is almost always the fix. The video converter page is the canonical version of this tool, covering every output format and the upload limits for guests and free accounts. Upload a video below to convert it to MP4.",
    whatItDoes: [
      'Converts MOV, WebM, AVI, MKV, FLV, WMV, and more into MP4.',
      'Encodes MP4 with H.264 + AAC, the safe-everywhere default, plus -pix_fmt yuv420p and a faststart flag for instant playback.',
      'Lets you resize, trim, change frame rate, and adjust quality before exporting.',
      'Keeps the output unlocked so you can target WebM, MOV, MKV, or GIF from the same upload.',
    ],
    flowSteps: [
      { title: 'Upload your video', description: 'Drop in any common video container.' },
      { title: 'Keep MP4 selected', description: 'MP4 (H.264 + AAC) is preselected; pick a quality preset.' },
      { title: 'Convert', description: 'We re-encode to a clean, compatible MP4.' },
      { title: 'Download', description: 'Save your MP4, ready to upload or play anywhere.' },
    ],
    advancedDetails: [
      'MP4 output uses libx264 with a CRF that maps to your quality preset (Low ≈ 30, Medium ≈ 23, High ≈ 18) and AAC audio.',
      'We add -pix_fmt yuv420p so the file plays in Safari, QuickTime, and on social platforms, and -movflags +faststart so playback can begin before the file finishes downloading.',
      'For the smallest web files you can switch the output to WebM (VP9); for editing handoffs, MOV with ProRes preserves more quality.',
    ],
    whyItMatters: [
      'A wrong or exotic container is the most common reason a video will not play or upload.',
      'MP4/H.264 is the single most widely supported video format in the world.',
      'Re-encoding to MP4 fixes unplayable files without you needing a desktop editor.',
    ],
    useCases: [
      { title: 'Make footage uploadable', description: 'Convert a MOV or MKV that a site rejects into an accepted MP4.' },
      { title: 'Play on any device', description: 'Turn AVI/WMV archives into MP4 that modern phones and TVs play.' },
      { title: 'Prep for social', description: 'Export an MP4 that Instagram, TikTok, and YouTube accept without re-processing issues.' },
      { title: 'Standardize a library', description: 'Bring a mix of containers into one consistent MP4 format.' },
    ],
    whyMediaManipulator: [
      'Server-side FFmpeg with the correct pixel format and faststart flag baked in.',
      'Output is not locked — convert to MP4 today, WebM or GIF tomorrow from the same tool.',
      `Free, no watermark, no signup. ${RETENTION_PROMISE}.`,
    ],
    privacyNote: sharedPrivacyNote,
    supportedFormats: {
      supportedInputFormats: ['mov', 'webm', 'avi', 'mkv', 'flv', 'wmv', 'm4v', 'mpeg', 'mp4'],
      supportedOutputFormats: ['mp4', 'webm', 'mov', 'mkv', 'avi', 'gif'],
      processingNotes: ['MP4 output uses H.264 + AAC with yuv420p and +faststart for universal playback.'],
    },
    faq: [
      { question: 'What is the best MP4 setting for compatibility?', answer: 'The default — H.264 video and AAC audio with yuv420p — plays on virtually every device, browser, and platform.' },
      { question: 'Can I convert MOV or WebM to MP4 here?', answer: 'Yes. Upload a MOV, WebM, AVI, MKV, FLV, or WMV and the converter outputs MP4. There are also dedicated MOV-to-MP4 and WebM-to-MP4 pages.' },
      { question: 'Will converting to MP4 reduce quality?', answer: 'Re-encoding is lossy, but at the Medium or High quality preset the difference is hard to notice. Pick High to stay closest to the source.' },
      { question: 'Is there a watermark?', answer: 'No. The output MP4 is clean, with no watermark or branding.' },
      { question: 'Is there a file-size limit?', answer: 'Very large files may be rejected on the free tier. Lowering the resolution or trimming the clip first usually helps.' },
    ],
    related: [
      { label: 'Convert MOV to MP4', to: '/tools/convert-mov-to-mp4', description: 'QuickTime/iPhone MOV to MP4.' },
      { label: 'Convert WebM to MP4', to: '/tools/convert-webm-to-mp4', description: 'Web video to MP4.' },
      { label: 'Convert AVI to MP4', to: '/tools/convert-avi-to-mp4', description: 'Old AVI archives to MP4.' },
      { label: 'Convert MKV to MP4', to: '/tools/convert-mkv-to-mp4', description: 'Matroska to MP4.' },
      { label: 'MP4 to MP3', to: '/tools/mp4-to-mp3', description: 'Extract MP3 audio from an MP4.' },
      { label: 'MP4 to GIF', to: '/tools/mp4-to-gif', description: 'Turn an MP4 clip into an animated GIF.' },
      { label: 'Compress video', to: '/tools/compress-video', description: 'Shrink the MP4 after converting.' },
      { label: 'Video converter', to: '/tools/video-converter', description: 'Full control over container, codec, and audio.' },
    ],
    lastReviewed: '2026-10-29',
    primaryKeyword: 'mp4 converter',
    secondaryKeywords: [
      'mp4 converter online',
      'free mp4 converter',
      'video to mp4',
      'convert to mp4',
      'online mp4 converter',
    ],
  },
  {
    slug: 'convert-mov-to-mp4',
    name: 'Convert MOV to MP4',
    h1: 'Convert MOV to MP4 Online Free',
    tagline:
      'Turn QuickTime and iPhone .mov files into a universal MP4 that plays and uploads everywhere.',
    metaTitle: 'Convert MOV to MP4 Online Free | Media Manipulator',
    metaDescription:
      `Free online MOV to MP4 converter. Convert QuickTime and iPhone .mov videos to MP4 that plays everywhere. No watermark, no signup. ${RETENTION_PROMISE}.`,
    ogTitle: 'Convert MOV to MP4 Online Free',
    ogDescription:
      'Convert QuickTime / iPhone MOV files to a universal MP4 that uploads and plays on any device.',
    category: 'video',
    embed: {
      defaultMediaKind: 'video',
      defaultTask: 'mov_to_mp4',
      lockedVideoOutputFormat: 'mp4',
      lockedInputFormat: 'mov',
      acceptOverride: 'video/quicktime,video/mp4,video/*,.mov',
      title: 'Convert MOV to MP4',
      description:
        'Upload your .mov file. The output is locked to MP4 (H.264 + AAC) for this tool, so just upload and convert.',
    },
    intro:
      'MOV is Apple’s QuickTime container — it is what iPhones, Macs, and many cameras record by default. It is great inside the Apple ecosystem, but it can refuse to play on Windows, Android, or some upload forms. Converting MOV to MP4 keeps the same H.264 video and AAC audio in a container the whole world accepts, usually with no visible quality change.',
    whatItDoes: [
      'Converts QuickTime / iPhone .mov files to MP4.',
      'Locks the output to MP4 (H.264 + AAC) so the result plays everywhere.',
      'Adds -pix_fmt yuv420p and +faststart so the MP4 plays in browsers and starts instantly.',
      'Trim the MOV, resize it or pick a quality preset in the same upload.',
    ],
    flowSteps: [
      { title: 'Upload your MOV', description: 'Drop in a .mov file from your iPhone, Mac, or camera.' },
      { title: 'Output is locked to MP4', description: 'No format picking needed — MP4 is set for this tool.' },
      { title: 'Convert', description: 'We re-wrap/re-encode the video into a clean MP4.' },
      { title: 'Download', description: 'Save your MP4, ready for any device or platform.' },
    ],
    advancedDetails: [
      'Most MOV files already contain H.264 video, so the conversion is fast and near-lossless at High quality.',
      'We force yuv420p chroma so the MP4 plays in Safari and on social platforms that reject 4:2:2/4:4:4 video.',
      'If your MOV holds ProRes, the converter transcodes it down to H.264 — pick High quality to keep the most detail.',
    ],
    whyItMatters: [
      'MOV often will not play on Windows or Android without extra codecs.',
      'Many upload forms and editors accept MP4 but reject MOV.',
      'MP4 is the safest format to share an iPhone video with anyone.',
    ],
    useCases: [
      { title: 'iPhone videos', description: 'Convert a .mov recorded on an iPhone so it plays on a Windows PC.' },
      { title: 'Upload to the web', description: 'Turn a QuickTime export into an MP4 a website will accept.' },
      { title: 'Send to non-Apple users', description: 'Share footage with Android and Windows users without playback issues.' },
      { title: 'Editor compatibility', description: 'Feed an MP4 into editors that struggle with raw MOV.' },
    ],
    whyMediaManipulator: [
      'Output locked to a known-good MP4 profile — no guessing at settings.',
      'Server-side FFmpeg handles ProRes-in-MOV and HEVC-in-MOV sources too.',
    ],
    privacyNote: privacyNoteFor('video', 'Your MOV is re-encoded by FFmpeg on our server into an H.264 and AAC MP4.'),
    supportedFormats: {
      supportedInputFormats: ['mov', 'qt'],
      supportedOutputFormats: ['mp4'],
      processingNotes: ['Output is locked to MP4 (H.264 + AAC, yuv420p, +faststart).'],
    },
    faq: [
      { question: 'How do I convert MOV to MP4?', answer: 'Upload your .mov file and click convert — the output is already set to MP4, so there is nothing else to choose.' },
      { question: 'Does converting MOV to MP4 lose quality?', answer: 'Most MOV files use H.264, so at High quality the re-encode is visually near-lossless. Lower presets trade some quality for a smaller file.' },
      { question: 'Why will my iPhone MOV not play on Windows?', answer: 'Windows may lack the QuickTime/HEVC codecs. MP4 with H.264 + AAC plays without extra software.' },
      { question: 'Is QuickTime to MP4 the same thing?', answer: 'Yes — QuickTime files use the .mov container, so converting QuickTime to MP4 is exactly this tool.' },
      { question: 'Is there a watermark or signup?', answer: `No watermark and no account required. ${RETENTION_PROMISE}.` },
    ],
    related: [
      { label: 'Video converter', to: '/tools/video-converter', description: 'Convert any video to MP4.' },
      { label: 'Compress video', to: '/tools/compress-video', description: 'Shrink the MP4 for email or the web.' },
      { label: 'Convert video to GIF', to: '/tools/convert-video-to-animated-gif', description: 'Trim a clip and export an animated GIF.' },
      { label: 'Video converter tutorial', to: '/tutorials/video/getting-started', description: 'Walk through trim, resize, and quality options.' },
    ],
    primaryKeyword: 'mov to mp4',
    secondaryKeywords: [
      'mov to mp4 converter',
      'convert mov to mp4',
      'quicktime to mp4',
      'iphone mov to mp4',
      'mov to mp4 online',
    ],
  },
  {
    slug: 'convert-webm-to-mp4',
    name: 'Convert WebM to MP4',
    h1: 'Convert WebM to MP4 Online Free',
    tagline:
      'Turn web-optimized .webm video into an MP4 you can edit, share, and play on any device.',
    metaTitle: 'Convert WebM to MP4 Online Free | Media Manipulator',
    metaDescription:
      'Free online WebM to MP4 converter. Convert .webm (VP8/VP9) video to MP4 (H.264 + AAC) for editors and devices that cannot open WebM. No watermark, no signup.',
    ogTitle: 'Convert WebM to MP4 Online Free',
    ogDescription:
      'Convert .webm video to a universal MP4 that editors, phones, and TVs can play.',
    category: 'video',
    embed: {
      defaultMediaKind: 'video',
      defaultTask: 'webm_to_mp4',
      lockedVideoOutputFormat: 'mp4',
      lockedInputFormat: 'webm',
      acceptOverride: 'video/webm,video/mp4,video/*,.webm',
      title: 'Convert WebM to MP4',
      description:
        'Upload your .webm file. The output is locked to MP4 (H.264 + AAC) for this tool, so just upload and convert.',
    },
    intro:
      'WebM is a modern, open container built for the web — small files, great for browser video. But many video editors, older devices, and messaging apps cannot open WebM. Converting WebM to MP4 re-encodes the VP8/VP9 video to H.264 and the audio to AAC, giving you a file that works in Premiere, Resolve, phones, and TVs.',
    whatItDoes: [
      'Converts .webm (VP8/VP9 + Vorbis/Opus) video to MP4.',
      'Locks the output to MP4 (H.264 + AAC) for maximum compatibility.',
      'Adds yuv420p and +faststart so the MP4 plays in every browser and starts instantly.',
      'A WebM screen capture can be trimmed or resized on its way to MP4.',
    ],
    flowSteps: [
      { title: 'Upload your WebM', description: 'Drop in a .webm file downloaded from the web or a screen recorder.' },
      { title: 'Output is locked to MP4', description: 'MP4 is preset for this tool — nothing to configure.' },
      { title: 'Convert', description: 'We transcode VP8/VP9 to H.264 + AAC.' },
      { title: 'Download', description: 'Save your MP4 for editing or playback anywhere.' },
    ],
    advancedDetails: [
      'WebM uses VP8/VP9 video, which most editors cannot import; MP4/H.264 imports cleanly into every NLE.',
      'We force yuv420p so the MP4 plays in Safari and on social platforms.',
      'If you actually want a smaller web file, the reverse MP4-to-WebM tool produces VP9 WebM instead.',
    ],
    whyItMatters: [
      'Most desktop editors cannot import WebM but handle MP4 natively.',
      'Some phones, TVs, and chat apps refuse to play WebM.',
      'MP4 is the safe handoff format for video you downloaded as WebM.',
    ],
    useCases: [
      { title: 'Edit downloaded video', description: 'Bring a .webm clip into Premiere or Resolve as an MP4.' },
      { title: 'Screen recordings', description: 'Convert a WebM screen capture into a shareable MP4.' },
      { title: 'Play on older devices', description: 'Make a WebM file play on a TV or phone that does not support it.' },
      { title: 'Messaging apps', description: 'Send video to apps that accept MP4 but not WebM.' },
    ],
    whyMediaManipulator: [
      'Server-side FFmpeg decodes VP8 and VP9 reliably.',
      'Output locked to a known-good MP4 profile.',
    ],
    privacyNote: privacyNoteFor('video', 'Your WebM is re-encoded by FFmpeg on our server from VP8 or VP9 into an H.264 MP4.'),
    supportedFormats: {
      supportedInputFormats: ['webm'],
      supportedOutputFormats: ['mp4'],
      processingNotes: ['Output is locked to MP4 (H.264 + AAC, yuv420p, +faststart).'],
    },
    faq: [
      { question: 'How do I convert WebM to MP4?', answer: 'Upload your .webm file and click convert — the output is already set to MP4.' },
      { question: 'Why can my editor not open WebM?', answer: 'Most editors do not include VP8/VP9 import. Converting to MP4 (H.264) fixes the import.' },
      { question: 'Will the file get bigger?', answer: 'MP4/H.264 can be slightly larger than VP9 WebM at the same quality. Pick a lower quality preset if size matters.' },
      { question: 'Does it keep the audio?', answer: 'Yes — Vorbis/Opus audio is re-encoded to AAC and stays in sync.' },
    ],
    related: [
      { label: 'Video converter', to: '/tools/video-converter', description: 'Convert any video to MP4.' },
      { label: 'Convert MP4 to WebM', to: '/tools/convert-mp4-to-webm', description: 'The reverse — make a small VP9 WebM.' },
      { label: 'Compress video', to: '/tools/compress-video', description: 'Shrink the MP4 for sharing.' },
    ],
    primaryKeyword: 'webm to mp4',
    secondaryKeywords: [
      'webm to mp4 converter',
      'convert webm to mp4',
      'webm to mp4 online',
      'free webm to mp4',
    ],
  },
  {
    slug: 'convert-avi-to-mp4',
    name: 'Convert AVI to MP4',
    h1: 'Convert AVI to MP4 Online Free',
    tagline:
      'Modernize old .avi videos into a compact MP4 that plays on every phone, browser, and TV.',
    metaTitle: 'Convert AVI to MP4 Online Free | Media Manipulator',
    metaDescription:
      `Free online AVI to MP4 converter. Convert old .avi (Xvid/DivX) videos to MP4 (H.264 + AAC) that plays everywhere. No watermark, no signup. ${RETENTION_PROMISE}.`,
    ogTitle: 'Convert AVI to MP4 Online Free',
    ogDescription:
      'Convert legacy .avi video to a modern, compact MP4 that plays on any device.',
    category: 'video',
    embed: {
      defaultMediaKind: 'video',
      defaultTask: 'avi_to_mp4',
      lockedVideoOutputFormat: 'mp4',
      lockedInputFormat: 'avi',
      acceptOverride: 'video/x-msvideo,video/avi,video/mp4,video/*,.avi',
      title: 'Convert AVI to MP4',
      description:
        'Upload your .avi file. The output is locked to MP4 (H.264 + AAC) for this tool, so just upload and convert.',
    },
    intro:
      'AVI is a classic Windows container from the DivX/Xvid era. The files are often large and use codecs that modern phones, browsers, and TVs no longer play. Converting AVI to MP4 re-encodes the video to efficient H.264 and the audio to AAC, producing a smaller file that plays on anything you own today.',
    whatItDoes: [
      'Converts legacy .avi (Xvid, DivX, MJPEG, and more) to MP4.',
      'Locks the output to MP4 (H.264 + AAC) for modern playback.',
      'Usually produces a noticeably smaller file than the AVI source.',
      'An old AVI can be cut down and scaled while it is converted.',
    ],
    flowSteps: [
      { title: 'Upload your AVI', description: 'Drop in an old .avi file from an archive or camera.' },
      { title: 'Output is locked to MP4', description: 'MP4 is preset — nothing to configure.' },
      { title: 'Convert', description: 'We re-encode to H.264 + AAC.' },
      { title: 'Download', description: 'Save a smaller, modern MP4.' },
    ],
    advancedDetails: [
      'AVI commonly uses Xvid/DivX (MPEG-4 Part 2); H.264 is roughly twice as efficient, so the MP4 is usually much smaller.',
      'We force yuv420p so the result plays in browsers and on social platforms.',
      'Interlaced AVI captures may benefit from the deinterlace option in the full video converter.',
    ],
    whyItMatters: [
      'AVI files are big and increasingly unplayable on modern devices.',
      'MP4/H.264 is smaller and plays everywhere.',
      'Converting old archives to MP4 future-proofs them.',
    ],
    useCases: [
      { title: 'Old video archives', description: 'Modernize camcorder or DVD-rip AVIs into MP4.' },
      { title: 'Free up space', description: 'Shrink a large AVI into a smaller MP4.' },
      { title: 'Phone & TV playback', description: 'Make an AVI play on devices that dropped AVI support.' },
      { title: 'Upload to the web', description: 'Turn an AVI into an MP4 a site will accept.' },
    ],
    whyMediaManipulator: [
      'Server-side FFmpeg decodes old AVI codecs other tools choke on.',
      'Output locked to a known-good MP4 profile.',
    ],
    privacyNote: privacyNoteFor('video', 'Your AVI is re-encoded by FFmpeg on our server into a modern H.264 MP4.'),
    supportedFormats: {
      supportedInputFormats: ['avi'],
      supportedOutputFormats: ['mp4'],
      processingNotes: ['Output is locked to MP4 (H.264 + AAC, yuv420p, +faststart).'],
    },
    faq: [
      { question: 'How do I convert AVI to MP4?', answer: 'Upload your .avi file and click convert — the output is already set to MP4.' },
      { question: 'Will the MP4 be smaller than the AVI?', answer: 'Usually yes. H.264 is far more efficient than the Xvid/DivX codecs most AVIs use.' },
      { question: 'Does it support old DivX/Xvid AVIs?', answer: 'Yes — FFmpeg decodes the common AVI codecs and re-encodes them to H.264.' },
      { question: 'Will I lose quality?', answer: 'Re-encoding is lossy, but at High quality the difference is minimal and the file is still smaller.' },
    ],
    related: [
      { label: 'Video converter', to: '/tools/video-converter', description: 'Convert any video to MP4.' },
      { label: 'Compress video', to: '/tools/compress-video', description: 'Shrink the MP4 further.' },
      { label: 'Video converter tutorial', to: '/tutorials/video/getting-started', description: 'Walk through trim, resize, and deinterlace.' },
    ],
    primaryKeyword: 'avi to mp4',
    secondaryKeywords: [
      'avi to mp4 converter',
      'convert avi to mp4',
      'avi to mp4 online',
      'free avi to mp4',
    ],
  },
  {
    slug: 'convert-mkv-to-mp4',
    name: 'Convert MKV to MP4',
    h1: 'Convert MKV to MP4 Online Free',
    tagline:
      'Turn Matroska .mkv files into an MP4 that streams, uploads, and plays on devices that reject MKV.',
    metaTitle: 'Convert MKV to MP4 Online Free | Media Manipulator',
    metaDescription:
      'Free online MKV to MP4 converter. Convert Matroska .mkv video to MP4 (H.264 + AAC) for devices and sites that cannot play MKV. No watermark, no signup.',
    ogTitle: 'Convert MKV to MP4 Online Free',
    ogDescription:
      'Convert Matroska .mkv video to a universal MP4 that plays and uploads everywhere.',
    category: 'video',
    embed: {
      defaultMediaKind: 'video',
      defaultTask: 'mkv_to_mp4',
      lockedVideoOutputFormat: 'mp4',
      lockedInputFormat: 'mkv',
      acceptOverride: 'video/x-matroska,video/mp4,video/*,.mkv',
      title: 'Convert MKV to MP4',
      description:
        'Upload your .mkv file. The output is locked to MP4 (H.264 + AAC) for this tool, so just upload and convert.',
    },
    intro:
      'MKV (Matroska) is a flexible container popular for high-quality video, but a lot of phones, browsers, smart TVs, and upload forms will not play it. Converting MKV to MP4 puts the video into a container those devices understand. Media Manipulator re-encodes to H.264 + AAC so the result plays and uploads cleanly.',
    whatItDoes: [
      'Converts Matroska .mkv files to MP4.',
      'Locks the output to MP4 (H.264 + AAC) for broad device support.',
      'Adds yuv420p and +faststart so the MP4 streams and starts instantly.',
      'Trim an MKV episode or change its size before the MP4 is written.',
    ],
    flowSteps: [
      { title: 'Upload your MKV', description: 'Drop in a .mkv file.' },
      { title: 'Output is locked to MP4', description: 'MP4 is preset for this tool.' },
      { title: 'Convert', description: 'We move/transcode the video into an MP4.' },
      { title: 'Download', description: 'Save an MP4 that plays everywhere.' },
    ],
    advancedDetails: [
      'If the MKV already holds H.264 + AAC, the conversion is fast and visually lossless.',
      'We force yuv420p so the MP4 plays in Safari and on social platforms.',
      'MKV can carry many subtitle/audio tracks; the converter keeps the primary video and first audio track.',
    ],
    whyItMatters: [
      'Many devices and websites simply do not support MKV.',
      'MP4 is the safe container for sharing and uploading.',
      'Converting keeps your high-quality video usable everywhere.',
    ],
    useCases: [
      { title: 'Phone & TV playback', description: 'Make an MKV play on a device that rejects it.' },
      { title: 'Upload to the web', description: 'Turn an MKV into an MP4 a site will accept.' },
      { title: 'Editor handoff', description: 'Import an MP4 into editors that struggle with MKV.' },
      { title: 'Standardize a library', description: 'Bring MKV downloads in line with your MP4 collection.' },
    ],
    whyMediaManipulator: [
      'Server-side FFmpeg handles MKV with multiple tracks.',
      'Output locked to a known-good MP4 profile.',
    ],
    privacyNote: privacyNoteFor('video', 'Your MKV is re-encoded by FFmpeg on our server into an MP4 that phones and browsers play.'),
    supportedFormats: {
      supportedInputFormats: ['mkv'],
      supportedOutputFormats: ['mp4'],
      processingNotes: ['Output is locked to MP4 (H.264 + AAC, yuv420p, +faststart). The primary video and first audio track are kept.'],
    },
    faq: [
      { question: 'How do I convert MKV to MP4?', answer: 'Upload your .mkv file and click convert — the output is already set to MP4.' },
      { question: 'Does converting MKV to MP4 lose quality?', answer: 'If the MKV already uses H.264, the result is visually lossless at High quality. Otherwise it is a normal lossy re-encode.' },
      { question: 'What happens to extra audio or subtitle tracks?', answer: 'The converter keeps the main video and the first audio track. For multi-track needs, reach out and we can look at track selection.' },
      { question: 'Why will my MKV not play?', answer: 'Many phones, TVs, browsers, and sites do not support the MKV container even when the codecs inside are common.' },
    ],
    related: [
      { label: 'Video converter', to: '/tools/video-converter', description: 'Convert any video to MP4.' },
      { label: 'Compress video', to: '/tools/compress-video', description: 'Shrink the MP4 for sharing.' },
      { label: 'Video converter tutorial', to: '/tutorials/video/getting-started', description: 'Walk through every option.' },
    ],
    primaryKeyword: 'mkv to mp4',
    secondaryKeywords: [
      'mkv to mp4 converter',
      'convert mkv to mp4',
      'matroska to mp4',
      'mkv to mp4 online',
    ],
  },
  {
    slug: 'convert-mp4-to-webm',
    name: 'Convert MP4 to WebM',
    h1: 'Convert MP4 to WebM Online Free',
    tagline:
      'Re-encode MP4 into a smaller, open VP9 WebM that is perfect for fast-loading web video.',
    metaTitle: 'Convert MP4 to WebM Online Free | Media Manipulator',
    metaDescription:
      `Free online MP4 to WebM converter. Re-encode MP4 to VP9 + Opus WebM for smaller, faster web video. No watermark, no signup. ${RETENTION_PROMISE}.`,
    ogTitle: 'Convert MP4 to WebM Online Free',
    ogDescription:
      'Convert MP4 to a smaller, open VP9 WebM that is ideal for embedding on the modern web.',
    category: 'video',
    embed: {
      defaultMediaKind: 'video',
      defaultTask: 'mp4_to_webm',
      lockedVideoOutputFormat: 'webm',
      lockedInputFormat: 'mp4',
      acceptOverride: 'video/mp4,video/*,.mp4',
      title: 'Convert MP4 to WebM',
      description:
        'Upload your .mp4 file. The output is locked to WebM (VP9 + Opus) for this tool, so just upload and convert.',
    },
    intro:
      'WebM is the open video format built for the web. With VP9 video and Opus audio it delivers smaller files than MP4 at the same quality, which means faster page loads for embedded video. Converting your MP4 to WebM is the right move when you control the player — modern browsers all support it natively.',
    whatItDoes: [
      'Converts MP4 (H.264) to WebM (VP9 + Opus).',
      'Locks the output to WebM for consistent open-web embeds.',
      'Typically produces a smaller file than the MP4 at the same visual quality.',
      'Shorten or shrink the clip and choose a quality preset before the WebM is made.',
    ],
    flowSteps: [
      { title: 'Upload your MP4', description: 'Drop in an .mp4 file.' },
      { title: 'Output is locked to WebM', description: 'WebM (VP9 + Opus) is preset for this tool.' },
      { title: 'Convert', description: 'We re-encode H.264 to VP9 and AAC to Opus.' },
      { title: 'Download', description: 'Save a smaller .webm for the web.' },
    ],
    advancedDetails: [
      'WebM output uses VP9 video with Opus audio where available, falling back to VP8 + Vorbis on FFmpeg builds without VP9/Opus.',
      'VP9 encoding is slower than H.264 but yields ~25-50% smaller files at comparable quality.',
      'Use the <video> tag with both a WebM and an MP4 source so browsers pick the best one they support.',
    ],
    whyItMatters: [
      'Smaller web video means faster pages and lower bandwidth bills.',
      'WebM is royalty-free and supported by all modern browsers.',
      'A WebM + MP4 pair covers virtually every browser with the smallest possible files.',
    ],
    useCases: [
      { title: 'Website hero video', description: 'Serve a small, fast-loading background or hero clip.' },
      { title: 'Open-web embeds', description: 'Embed video without proprietary codec concerns.' },
      { title: 'Bandwidth savings', description: 'Cut delivery size for high-traffic pages.' },
      { title: 'HTML5 <video>', description: 'Provide a WebM source alongside an MP4 fallback.' },
    ],
    whyMediaManipulator: [
      'VP9 + Opus encoding with an automatic VP8 + Vorbis fallback.',
      'Output locked to WebM so the result is predictable.',
    ],
    privacyNote: privacyNoteFor('video', 'Your video is re-encoded by FFmpeg on our server into a VP9 WebM.'),
    supportedFormats: {
      supportedInputFormats: ['mp4', 'mov', 'm4v'],
      supportedOutputFormats: ['webm'],
      processingNotes: ['Output is locked to WebM (VP9 + Opus, or VP8 + Vorbis if VP9/Opus is unavailable).'],
    },
    faq: [
      { question: 'How do I convert MP4 to WebM?', answer: 'Upload your .mp4 file and click convert — the output is already set to WebM.' },
      { question: 'Is WebM smaller than MP4?', answer: 'At the same visual quality, VP9 WebM is usually 25-50% smaller than H.264 MP4.' },
      { question: 'Do all browsers support WebM?', answer: 'All modern browsers do. For older browsers, provide an MP4 fallback in your <video> tag.' },
      { question: 'Why is WebM encoding slower?', answer: 'VP9 is more computationally intensive than H.264. The payoff is a smaller file.' },
    ],
    related: [
      { label: 'Convert WebM to MP4', to: '/tools/convert-webm-to-mp4', description: 'The reverse direction.' },
      { label: 'Video converter', to: '/tools/video-converter', description: 'Convert any video to MP4.' },
      { label: 'Compress video', to: '/tools/compress-video', description: 'Shrink video without changing the container.' },
    ],
    primaryKeyword: 'mp4 to webm',
    secondaryKeywords: [
      'mp4 to webm converter',
      'convert mp4 to webm',
      'mp4 to webm online',
      'free mp4 to webm',
    ],
  },
  {
    slug: 'mp4-to-mp3',
    name: 'Convert MP4 to MP3',
    h1: 'Convert MP4 to MP3 Online Free',
    tagline:
      "Get the audio of an MP4 as an MP3: Extract Audio from Video with MP4 in and MP3 out.",
    metaTitle: 'Convert MP4 to MP3 Online Free | Media Manipulator',
    metaDescription:
      `Free online MP4 to MP3 converter. Extract the audio from an MP4 video and save it as MP3. No watermark, no signup. ${RETENTION_PROMISE}.`,
    ogTitle: 'Convert MP4 to MP3 Online Free',
    ogDescription:
      'Extract the audio from an MP4 video and download it as a clean MP3 file. Free, no signup.',
    category: 'video',
    embed: {
      defaultMediaKind: 'video',
      defaultTask: 'mp4_to_mp3',
      lockedExtractAudioFormat: 'mp3',
      lockedInputFormat: 'mp4',
      acceptOverride: 'video/mp4,video/*,.mp4',
      title: 'Convert MP4 to MP3',
      description:
        'Upload your .mp4 video. We pull out the audio track and the output is locked to MP3 for this tool.',
    },
    intro:
      "This page is Extract Audio from Video with two settings fixed: the input is an MP4 (or M4V) and the output is always MP3. That is the whole difference. An MP4 is a container holding video and sound, and the tool takes the first audio track out of it and encodes it with the LAME MP3 encoder at a variable bitrate of about 190 kbps, a size and quality that suit podcasts, lectures and music alike. If the MP4 has no sound, the tool says so before doing any work. If you need lossless audio for editing, or your file is a MOV or MKV, use the main Extract Audio from Video page, which accepts any common video and also writes WAV, M4A, AAC, FLAC or OGG. That page is the canonical version of this tool and has worked examples with real sizes and the per-plan limits. Upload an MP4 below to get its MP3.",
    whatItDoes: [
      'Extracts the audio stream from an MP4 video.',
      'Encodes the output as MP3 (libmp3lame) at a quality suited to speech and music.',
      'Detects MP4s with no audio and returns a clear error instead of an empty file.',
      'Keeps the full duration and original sample rate.',
    ],
    flowSteps: [
      { title: 'Upload your MP4', description: 'Drop in the .mp4 you want the audio from.' },
      { title: 'Output is locked to MP3', description: 'MP3 is preset for this tool — nothing to choose.' },
      { title: 'Extract audio', description: 'FFmpeg pulls the first audio track and encodes MP3.' },
      { title: 'Download', description: 'Save your MP3, ready for any music player.' },
    ],
    advancedDetails: [
      'This page uses the specialized extract-audio flow, not the video converter, because the output is audio rather than video.',
      'MP3 is rendered with libmp3lame at quality preset 2 (≈190 kbps VBR) — the sweet spot for speech and music.',
      'We pre-check the source with ffprobe so MP4s without an audio stream return a useful error.',
    ],
    whyItMatters: [
      'You often want only the sound of a video — a song, a talk, an interview.',
      'MP3 is tiny compared to the original MP4 and plays in every audio app.',
      'Audio-only files are ideal for podcasts, transcription, and offline listening.',
    ],
    useCases: [
      { title: 'Save a song', description: 'Pull the audio from a music video as an MP3.' },
      { title: 'Podcast repurposing', description: 'Turn a video interview into an audio-only episode.' },
      { title: 'Lectures & talks', description: 'Keep a recorded talk as a small MP3 for offline listening.' },
      { title: 'Transcription prep', description: 'Provide an MP3 to a transcription tool that prefers audio.' },
    ],
    whyMediaManipulator: [
      'Server-side FFmpeg means no browser codec headaches.',
      'Clear errors when the MP4 has no audio track.',
      `Free, no watermark, no signup. ${RETENTION_PROMISE}.`,
    ],
    privacyNote: sharedPrivacyNote,
    supportedFormats: {
      supportedInputFormats: ['mp4', 'm4v'],
      supportedOutputFormats: ['mp3'],
      processingNotes: ['Output is locked to MP3. We extract the first audio stream; MP4s with no audio return a clear error.'],
    },
    faq: [
      { question: 'How do I convert MP4 to MP3?', answer: 'Upload your .mp4 video and click extract — the output is already set to MP3, so there is nothing else to choose.' },
      { question: 'Is this really converting, or extracting audio?', answer: 'It extracts the audio track from the MP4 and encodes it as MP3. That is exactly what people mean by MP4 to MP3.' },
      { question: 'What MP3 quality do I get?', answer: 'About 190 kbps VBR (libmp3lame -q:a 2), which sounds great for both speech and music.' },
      { question: 'What if my MP4 has no sound?', answer: 'We detect that up front and return a clear error instead of giving you an empty file.' },
      { question: 'Is it free?', answer: `Yes — no watermark, no signup. ${RETENTION_PROMISE}.` },
    ],
    related: [
      { label: 'Video to MP3', to: '/tools/video-to-mp3', description: 'Same thing for any video format.' },
      { label: 'Extract audio from video', to: '/tools/extract-audio-from-video', description: 'Choose MP3, WAV, M4A, AAC, FLAC, or OGG.' },
      { label: 'Audio converter', to: '/tools/audio-converter', description: 'Convert the MP3 to other audio formats.' },
    ],
    lastReviewed: '2026-10-29',
    primaryKeyword: 'mp4 to mp3',
    secondaryKeywords: [
      'mp4 to mp3 converter',
      'extract mp3 from mp4',
      'convert mp4 to mp3',
      'mp4 to mp3 online',
    ],
  },
  {
    slug: 'video-to-mp3',
    name: 'Convert Video to MP3',
    h1: 'Convert Video to MP3 Online Free',
    tagline:
      "Pull the soundtrack out of a video as an MP3: the same tool as Extract Audio from Video.",
    metaTitle: 'Convert Video to MP3 Online Free | Media Manipulator',
    metaDescription:
      `Free online video to MP3 converter. Extract the audio from MP4, MOV, MKV, WebM, and AVI videos and save it as MP3. No watermark, no signup. ${RETENTION_PROMISE}.`,
    ogTitle: 'Convert Video to MP3 Online Free',
    ogDescription:
      'Extract the audio from any video file and download it as MP3. Free, no signup.',
    category: 'video',
    embed: {
      defaultMediaKind: 'video',
      defaultTask: 'video_to_mp3',
      defaultExtractAudioFormat: 'mp3',
      acceptOverride: 'video/*',
      title: 'Convert video to MP3',
      description:
        'Upload any video. We pull out the audio track; MP3 is preselected, and you can switch to WAV, M4A, AAC, FLAC, or OGG.',
    },
    intro:
      "Converting a video to MP3 is an audio-extraction job, and this page opens the same tool as Extract Audio from Video, with MP3 preselected. Nothing else differs: you can switch to WAV, M4A, AAC, FLAC or OGG before converting, and any common video format is accepted. The tool reads the first audio track of the file and encodes it on our servers with FFmpeg; MP3 output uses the LAME encoder at a variable bitrate of about 190 kbps, which suits music and speech. A video with no audio track is caught before any work is done and returns a clear error instead of a silent file. If the video carries several language tracks, only the first is extracted. Extract Audio from Video is the canonical version of this tool and explains each output format, with worked examples of real file sizes and the limits for guests and free accounts. Upload a video below to get its sound as an MP3.",
    whatItDoes: [
      'Extracts the audio stream from MP4, MOV, MKV, WebM, AVI, and M4V videos.',
      'Preselects MP3 output and lets you switch to WAV, M4A, AAC, FLAC, or OGG.',
      'Detects videos with no audio and returns a clear error instead of an empty file.',
      'Keeps the full duration and original sample rate.',
    ],
    flowSteps: [
      { title: 'Upload your video', description: 'Drop in any common video file.' },
      { title: 'MP3 is preselected', description: 'Keep MP3, or pick WAV/M4A/AAC/FLAC/OGG.' },
      { title: 'Extract audio', description: 'FFmpeg pulls the first audio track and encodes it.' },
      { title: 'Download', description: 'Save your audio file.' },
    ],
    advancedDetails: [
      'This page uses the specialized extract-audio flow, not the video converter, because the output is audio.',
      'MP3 is rendered with libmp3lame at quality preset 2 (≈190 kbps VBR); WAV is lossless PCM if you need an editable master.',
      'We pre-check the source with ffprobe so videos without an audio stream return a useful error.',
    ],
    whyItMatters: [
      'Audio extraction works on far more than just MP4 — MOV, MKV, WebM, and AVI all carry audio.',
      'MP3 is small and plays in every audio app; WAV is the lossless choice for editing.',
      'Decoupling audio from video is the first step for podcasts, transcripts, and sampling.',
    ],
    useCases: [
      { title: 'Any source format', description: 'Pull audio from a MOV or MKV, not just an MP4.' },
      { title: 'Podcast repurposing', description: 'Turn a recorded video call into an audio episode.' },
      { title: 'Music & samples', description: 'Save a track from a music video as MP3 or lossless WAV.' },
      { title: 'Transcription prep', description: 'Hand a clean audio file to a transcription tool.' },
    ],
    whyMediaManipulator: [
      'Handles every common video container server-side with FFmpeg.',
      'MP3 by default, with WAV/M4A/AAC/FLAC/OGG one click away.',
      `Free, no watermark, no signup. ${RETENTION_PROMISE}.`,
    ],
    privacyNote: sharedPrivacyNote,
    supportedFormats: {
      supportedInputFormats: ['mp4', 'mov', 'mkv', 'webm', 'avi', 'm4v'],
      supportedOutputFormats: ['mp3', 'wav', 'm4a', 'aac', 'flac', 'ogg'],
      processingNotes: ['MP3 is the default. We extract the first audio stream; videos with no audio return a clear error.'],
    },
    faq: [
      { question: 'How do I convert a video to MP3?', answer: 'Upload your video and click extract. MP3 is preselected, so you can just download — or pick another audio format first.' },
      { question: 'Which video formats are supported?', answer: 'MP4, MOV, MKV, WebM, AVI, and M4V are all supported.' },
      { question: 'Can I get lossless audio instead of MP3?', answer: 'Yes — switch the output to WAV (lossless PCM) or FLAC before extracting.' },
      { question: 'What if the video has no sound?', answer: 'We detect that up front and return a clear error rather than an empty file.' },
      { question: 'Is it free?', answer: `Yes — no watermark, no signup. ${RETENTION_PROMISE}.` },
    ],
    related: [
      { label: 'MP4 to MP3', to: '/tools/mp4-to-mp3', description: 'The MP4-specific version.' },
      { label: 'Extract audio from video', to: '/tools/extract-audio-from-video', description: 'Full extract-audio tool with every format.' },
      { label: 'Audio converter', to: '/tools/audio-converter', description: 'Convert the extracted audio to other formats.' },
    ],
    lastReviewed: '2026-10-29',
    primaryKeyword: 'video to mp3',
    secondaryKeywords: [
      'video to mp3 converter',
      'extract audio from video',
      'convert video to mp3',
      'video to mp3 online',
    ],
  },
  {
    slug: 'mp4-to-gif',
    name: 'Convert MP4 to GIF',
    h1: 'Convert MP4 to GIF Online Free',
    tagline:
      "Make a looping GIF from an MP4 clip: the animated GIF converter with MP4 input locked.",
    metaTitle: 'Convert MP4 to GIF Online Free | Media Manipulator',
    metaDescription:
      'Free online MP4 to GIF converter. Turn short MP4 clips into looping animated GIFs with control over size and frame rate. No watermark, no signup.',
    ogTitle: 'Convert MP4 to GIF Online Free',
    ogDescription:
      'Turn a short MP4 clip into a clean, looping animated GIF. Control size and frame rate.',
    category: 'video',
    embed: {
      defaultMediaKind: 'video',
      defaultTask: 'mp4_to_gif',
      lockedVideoOutputFormat: 'gif',
      lockedInputFormat: 'mp4',
      acceptOverride: 'video/mp4,video/*,.mp4',
      title: 'Convert MP4 to GIF',
      description:
        'Upload a short .mp4 clip. The output is locked to GIF for this tool — trim to under ~10 seconds and tune width/frame rate in the GIF panel for a small file.',
    },
    intro:
      "This page is the Media Manipulator video-to-GIF tool with the input fixed to MP4 (M4V works too) and the output fixed to GIF. Apart from those two locks it is identical to Convert Video to Animated GIF: the same form, the same width and frame-rate controls, and the same pipeline, in which FFmpeg samples the frames and gifsicle builds the palette and optimises the file. The advice is the same as well. Keep the clip short, because a GIF holds every frame as an image and a ten-second clip at full width can come out larger than the MP4 it came from. If your clip is a MOV or WebM, or you want an MP4 or WebM loop instead of a GIF, use the main page. The canonical version, Convert Video to Animated GIF, has the details: how width, frame rate and colour count trade against size, worked examples with real numbers, and the per-plan limits. Upload an MP4 below to make your GIF.",
    whatItDoes: [
      'Converts a short MP4 clip into a looping animated GIF.',
      'Locks the output to GIF and exposes width, frame rate, colors, and optimization controls.',
      'Uses FFmpeg + gifsicle for clean colors and a small file.',
      'Lets you trim the clip before exporting.',
    ],
    flowSteps: [
      { title: 'Upload your MP4', description: 'Drop in a short .mp4 — under ~10 seconds works best.' },
      { title: 'Output is locked to GIF', description: 'Trim and tune width/frame rate in the GIF panel.' },
      { title: 'Generate frames', description: 'FFmpeg samples frames and palettizes a clean GIF.' },
      { title: 'Download', description: 'Save a looping .gif ready to share.' },
    ],
    advancedDetails: [
      'GIF runs a two-stage pipeline: FFmpeg downscales and samples at your chosen frame rate, then gifsicle quantizes the palette and optimizes the file.',
      'A 480-900px wide GIF at 12 fps balances smoothness and size for chat and the web.',
      'GIF is uncompressed compared to MP4 — for clips longer than ~10 seconds, a short MP4 or WebM is usually a better choice.',
    ],
    whyItMatters: [
      'GIFs autoplay and loop where embedded video does not.',
      'They are the most reliable format for reaction clips, demos, and bug repros.',
      'A trimmed, well-sized GIF beats attaching a multi-megabyte video.',
    ],
    useCases: [
      { title: 'Reaction clips', description: 'Turn a moment from an MP4 into a looping reaction GIF.' },
      { title: 'Product demos', description: 'Show a feature in motion in a README or blog post.' },
      { title: 'Bug reproductions', description: 'Attach a short looping GIF to a ticket.' },
      { title: 'Social previews', description: 'Use a tiny GIF to preview a longer video.' },
    ],
    whyMediaManipulator: [
      'Palette-aware FFmpeg + gifsicle pipeline for clean colors and small files.',
      'Trim and tune size/frame rate in one upload.',
      `Free, no watermark, no signup. ${RETENTION_PROMISE}.`,
    ],
    privacyNote: sharedPrivacyNote,
    supportedFormats: {
      supportedInputFormats: ['mp4', 'm4v'],
      supportedOutputFormats: ['gif'],
      processingNotes: ['Output is locked to GIF. Trim to under ~10 seconds for the smallest, sharpest result.'],
    },
    faq: [
      { question: 'How do I convert MP4 to GIF?', answer: 'Upload a short .mp4, trim it if needed, and convert — the output is already set to GIF.' },
      { question: 'How do I make the GIF smaller?', answer: 'Trim aggressively, lower the width (e.g. 480px), drop the frame rate to 10-12 fps, and reduce the color count.' },
      { question: 'Will the GIF loop?', answer: 'Yes — exported GIFs loop by default and autoplay inline on most platforms.' },
      { question: 'How long can the clip be?', answer: 'There is no hard limit, but GIFs over ~10 seconds get large fast. Consider a short MP4 or WebM instead.' },
      { question: 'Is it free?', answer: `Yes — no watermark, no signup. ${RETENTION_PROMISE}.` },
    ],
    related: [
      { label: 'Video to GIF', to: '/tools/video-to-gif', description: 'Same thing for any video format.' },
      { label: 'GIF converter', to: '/tools/gif-converter', description: 'The GIF hub — make and tune GIFs.' },
      { label: 'Convert video to animated GIF', to: '/tools/convert-video-to-animated-gif', description: 'Full video-to-GIF tool.' },
    ],
    lastReviewed: '2026-10-29',
    primaryKeyword: 'mp4 to gif',
    secondaryKeywords: [
      'mp4 to gif converter',
      'convert mp4 to gif',
      'mp4 to gif online',
      'free mp4 to gif',
    ],
  },
  {
    slug: 'video-to-gif',
    name: 'Convert Video to GIF',
    h1: 'Convert Video to GIF Online Free',
    tagline:
      "Turn a short clip in any common video format into a looping GIF: the same tool as the animated GIF converter.",
    metaTitle: 'Convert Video to GIF Online Free | Media Manipulator',
    metaDescription:
      'Free online video to GIF converter. Make a looping animated GIF from MP4, MOV, WebM, MKV, or AVI clips. Control size and frame rate. No watermark, no signup.',
    ogTitle: 'Convert Video to GIF Online Free',
    ogDescription:
      'Make a looping animated GIF from any short video clip. Control size and frame rate.',
    category: 'video',
    embed: {
      defaultMediaKind: 'video',
      defaultTask: 'video_to_gif',
      lockedVideoOutputFormat: 'gif',
      acceptOverride: 'video/*',
      title: 'Convert a video to GIF',
      description:
        'Upload a short video in any format. The output is locked to GIF — trim to under ~10 seconds and tune width/frame rate in the GIF panel.',
    },
    intro:
      "This page makes an animated GIF from a short video, and it is the same tool as Convert Video to Animated GIF with the output fixed to GIF. It accepts MP4, MOV, WebM, MKV and AVI. There is no other difference: the same two-stage pipeline runs on our servers, in which FFmpeg scales the clip and samples it at the frame rate you choose and gifsicle reduces the palette and optimises the file. Trim to a few seconds first, because a GIF stores every frame as a picture and grows quickly with length and width. If you might want an MP4 or WebM loop instead of a GIF, the main page leaves the output unlocked. The animated GIF page is the canonical version of this tool and explains the settings that decide the file size, with worked examples showing real input and output sizes and the limits that apply to guests and free accounts. Upload a clip below to start.",
    whatItDoes: [
      'Converts MP4, MOV, WebM, MKV, AVI, and more into looping animated GIFs.',
      'Locks the output to GIF and exposes width, frame rate, colors, and optimization controls.',
      'Uses FFmpeg + gifsicle for clean colors and small files.',
      'Lets you trim the clip before exporting.',
    ],
    flowSteps: [
      { title: 'Upload your clip', description: 'Drop in a short video in any common format.' },
      { title: 'Output is locked to GIF', description: 'Trim and tune width/frame rate in the GIF panel.' },
      { title: 'Generate frames', description: 'FFmpeg samples frames and palettizes a clean GIF.' },
      { title: 'Download', description: 'Save a looping .gif ready to share.' },
    ],
    advancedDetails: [
      'GIF runs a two-stage pipeline: FFmpeg downscales and samples at your chosen frame rate, then gifsicle quantizes the palette and optimizes the file.',
      'A 480-900px wide GIF at 12 fps balances smoothness and size for chat and the web.',
      'GIF is uncompressed compared to modern video codecs — for clips longer than ~10 seconds, a short MP4 or WebM is usually a better choice.',
    ],
    whyItMatters: [
      'GIFs autoplay and loop where embedded video does not.',
      'They work from any source clip, regardless of the original container.',
      'A trimmed, well-sized GIF is the most shareable short-clip format.',
    ],
    useCases: [
      { title: 'Reaction clips', description: 'Turn a moment from any video into a looping GIF.' },
      { title: 'Product demos', description: 'Show a feature in motion in a README or blog post.' },
      { title: 'Bug reproductions', description: 'Attach a short looping GIF to a ticket.' },
      { title: 'Social previews', description: 'Use a tiny GIF to preview a longer video.' },
    ],
    whyMediaManipulator: [
      'Accepts any common video container, not just MP4.',
      'Palette-aware FFmpeg + gifsicle pipeline for clean colors and small files.',
      `Free, no watermark, no signup. ${RETENTION_PROMISE}.`,
    ],
    privacyNote: sharedPrivacyNote,
    supportedFormats: {
      supportedInputFormats: ['mp4', 'mov', 'webm', 'mkv', 'avi', 'm4v'],
      supportedOutputFormats: ['gif'],
      processingNotes: ['Output is locked to GIF. Trim to under ~10 seconds for the smallest, sharpest result.'],
    },
    faq: [
      { question: 'How do I make a GIF from a video?', answer: 'Upload a short clip in any format, trim it if needed, and convert — the output is already set to GIF.' },
      { question: 'Which video formats can I use?', answer: 'MP4, MOV, WebM, MKV, AVI, and M4V are all supported.' },
      { question: 'How do I keep the GIF small?', answer: 'Trim aggressively, lower the width, drop the frame rate to 10-12 fps, and reduce the color count.' },
      { question: 'Will the GIF loop?', answer: 'Yes — exported GIFs loop by default and autoplay inline on most platforms.' },
      { question: 'Is it free?', answer: `Yes — no watermark, no signup. ${RETENTION_PROMISE}.` },
    ],
    related: [
      { label: 'MP4 to GIF', to: '/tools/mp4-to-gif', description: 'The MP4-specific version.' },
      { label: 'GIF converter', to: '/tools/gif-converter', description: 'The GIF hub — make and tune GIFs.' },
      { label: 'Video converter', to: '/tools/video-converter', description: 'Convert between video formats.' },
    ],
    lastReviewed: '2026-10-29',
    primaryKeyword: 'video to gif',
    secondaryKeywords: [
      'video to gif converter',
      'make gif from video',
      'convert video to gif',
      'video to gif online',
    ],
  },
  {
    slug: 'gif-converter',
    name: 'GIF Converter',
    h1: 'Free GIF Converter Online',
    tagline:
      "Make and tune animated GIFs from video clips: the animated GIF converter under another name.",
    metaTitle: 'Free GIF Converter Online | Media Manipulator',
    metaDescription:
      `Free online GIF converter. Make animated GIFs from MP4, MOV, WebM, and more and tune width and frame rate. No watermark, no signup. ${RETENTION_PROMISE}.`,
    ogTitle: 'Free GIF Converter Online',
    ogDescription:
      'Make and tune animated GIFs from any short video clip. Control width, frame rate, and colors.',
    category: 'video',
    embed: {
      defaultMediaKind: 'video',
      defaultTask: 'gif_converter',
      defaultVideoOutputFormat: 'gif',
      acceptOverride: 'video/*',
      title: 'Make a GIF',
      description:
        'Upload a short video clip. GIF is preselected, so you can trim and tune width, frame rate, colors, and optimization — or switch the output to MP4/WebM.',
    },
    intro:
      "The GIF converter is the same tool as Convert Video to Animated GIF. It opens the same video form with GIF preselected and the output left unlocked, so you can switch the same clip to an MP4 or WebM loop if a GIF turns out too large. It goes one way, from a video clip to an animated GIF; it does not turn an existing GIF back into a video or a still picture. Every control is the same as on the main page: trim range, width, frame rate, colour count and optimisation level, all applied by FFmpeg and gifsicle on our servers. The main page is the canonical version of this tool and is where the full explanation lives, with worked examples showing how big a GIF comes out at a given width and frame rate and what the limits are for guests and free accounts. Upload a short clip below to begin.",
    whatItDoes: [
      'Makes looping animated GIFs from MP4, MOV, WebM, MKV, AVI, and more.',
      'Exposes the full GIF panel: width, frame rate, colors, frame delay, and optimization level.',
      'Uses a palette-aware FFmpeg + gifsicle pipeline for clean colors.',
      'Keeps the output unlocked so you can switch to MP4 or WebM when needed.',
    ],
    flowSteps: [
      { title: 'Upload a clip', description: 'Drop in a short video in any common format.' },
      { title: 'GIF is preselected', description: 'Trim and tune width, frame rate, colors, and optimization.' },
      { title: 'Generate', description: 'FFmpeg + gifsicle build a clean, optimized GIF.' },
      { title: 'Download', description: 'Save your looping GIF — or switch the output to MP4/WebM.' },
    ],
    advancedDetails: [
      'GIF runs a two-stage pipeline: FFmpeg downscales and samples at your chosen frame rate, then gifsicle quantizes the palette and optimizes the output.',
      'Lower the color count to 64 on flat UI footage to shrink the file; raise it to 256 for photographic clips with gradients.',
      'Optimization level 3 produces the smallest file; drop to 1 for a fast draft while iterating.',
    ],
    whyItMatters: [
      'GIFs autoplay and loop inline almost everywhere.',
      'Fine control over palette and frame rate is the difference between a clean GIF and a muddy, oversized one.',
      'Having MP4/WebM as a fallback keeps you covered when a clip is too long for GIF.',
    ],
    useCases: [
      { title: 'Tune a GIF', description: 'Dial in width, frame rate, and colors for the perfect loop.' },
      { title: 'Reaction clips & demos', description: 'Make shareable looping clips for chat and docs.' },
      { title: 'Compare formats', description: 'Export GIF, then try MP4/WebM to see which is smaller.' },
      { title: 'Bug repros', description: 'Produce a tight, optimized GIF for a ticket.' },
    ],
    whyMediaManipulator: [
      'The full GIF tuning panel, not a one-button converter.',
      'Palette-aware FFmpeg + gifsicle for clean colors and small files.',
      `Free, no watermark, no signup. ${RETENTION_PROMISE}.`,
    ],
    privacyNote: sharedPrivacyNote,
    supportedFormats: {
      supportedInputFormats: ['mp4', 'mov', 'webm', 'mkv', 'avi', 'm4v'],
      supportedOutputFormats: ['gif', 'mp4', 'webm'],
      processingNotes: ['GIF is preselected but not locked — you can switch the output to MP4 or WebM.'],
    },
    faq: [
      { question: 'What does the GIF converter do?', answer: 'It turns short video clips into animated GIFs and gives you full control over width, frame rate, colors, frame delay, and optimization.' },
      { question: 'Can I convert MP4 to GIF here?', answer: 'Yes. There is also a dedicated MP4-to-GIF page if you want the output pre-locked to GIF.' },
      { question: 'How do I get the smallest GIF?', answer: 'Trim the clip, lower the width and frame rate, reduce the color count, and use optimization level 3.' },
      { question: 'Can I export something other than GIF?', answer: 'Yes — the output is not locked, so you can switch to MP4 or WebM for longer clips.' },
      { question: 'Is it free?', answer: `Yes — no watermark, no signup. ${RETENTION_PROMISE}.` },
    ],
    related: [
      { label: 'MP4 to GIF', to: '/tools/mp4-to-gif', description: 'Output locked to GIF for MP4 input.' },
      { label: 'Video to GIF', to: '/tools/video-to-gif', description: 'GIF from any video format.' },
      { label: 'Convert video to animated GIF', to: '/tools/convert-video-to-animated-gif', description: 'The classic video-to-GIF tool.' },
      { label: 'Image converter', to: '/tools/image-converter', description: 'Convert still images between JPG, PNG, WebP, and GIF.' },
    ],
    lastReviewed: '2026-10-29',
    primaryKeyword: 'gif converter',
    secondaryKeywords: [
      'video to gif',
      'mp4 to gif',
      'gif maker',
      'animated gif converter',
      'online gif converter',
    ],
  },

  // ----------------------------------------------------------------------- VIDEO SEO BATCH 2 (compress / trim / cut / transform / remove audio)
  {
    slug: 'video-compressor',
    name: 'Video Compressor',
    h1: 'Compress Video Online Free',
    tagline:
      "Shrink a video with a compression preset: the same tool as Compress Video.",
    metaTitle: 'Compress Video Online Free | Media Manipulator',
    metaDescription:
      `Free online video compressor. Reduce video file size with simple presets while keeping good quality. MP4 output, no watermark, no signup. ${RETENTION_PROMISE}.`,
    ogTitle: 'Compress Video Online Free',
    ogDescription:
      'Shrink video files with one-click presets while keeping watchable quality. Free, no watermark.',
    category: 'video',
    embed: {
      defaultMediaKind: 'video',
      defaultTask: 'video_compressor',
      defaultVideoOutputFormat: 'mp4',
      defaultVideoCompressionPreset: 'balanced',
      defaultVideoCodec: 'h264',
      title: 'Compress a video',
      description:
        'Upload a video and pick a compression level. Balanced is a great default; choose Smallest for email or High quality to keep more detail. Optionally downscale or drop audio.',
    },
    intro:
      "This page opens the same video compressor as the Compress Video page, with the Balanced preset and H.264 preselected. There is no other difference in what it does. The compressor re-encodes your clip with FFmpeg at the level you pick, Smallest, Balanced or High quality, and can also lower the resolution or drop the audio track to save more space. The output is an MP4 with H.264 or H.265 video and AAC audio, or WebM if you choose it, and MP4 output is written so playback can start before the download finishes. Compression is a trade, not free space: each step down in quality removes detail you cannot get back, so keep the original if you might need it later. Compress Video is the canonical version of this tool and has the explanation of each preset, worked examples with real before-and-after sizes and the limits for guests and free accounts. Upload a video below to start.",
    whatItDoes: [
      'Compresses any common video (MP4, MOV, MKV, WebM, AVI) into a smaller MP4 or WebM.',
      'Offers Smallest / Balanced / High quality presets that map to proven CRF settings.',
      'Optionally downscales to 1080p, 720p, or 480p and can remove the audio track.',
      'Lets you switch codec to H.265/HEVC for an even smaller file on modern devices.',
    ],
    flowSteps: [
      { title: 'Upload your video', description: 'Drop in any common video file.' },
      { title: 'Pick a compression level', description: 'Smallest, Balanced, or High quality.' },
      { title: 'Compress', description: 'We re-encode efficiently with faststart for instant playback.' },
      { title: 'Download', description: 'Save the smaller video.' },
    ],
    advancedDetails: [
      'Presets map to CRF: Smallest ≈ 31, Balanced ≈ 26, High quality ≈ 22 (lower CRF = higher quality, bigger file).',
      'MP4 output uses H.264 + AAC with -pix_fmt yuv420p and -movflags +faststart so it plays everywhere and starts before it finishes downloading.',
      'H.265/HEVC produces ~25-50% smaller files than H.264 at the same quality, but needs a modern player; WebM (VP9) is the open-web alternative.',
    ],
    whyItMatters: [
      'Email and chat apps reject videos over a size cap — compression gets you under it.',
      'Smaller videos upload faster and cost less to host and stream.',
      'A good preset shrinks the file a lot while staying watchable.',
    ],
    useCases: [
      { title: 'Email a video', description: 'Get under a 25 MB attachment limit with the Smallest preset.' },
      { title: 'Social uploads', description: 'Speed up posting to Instagram, TikTok, and YouTube.' },
      { title: 'Website video', description: 'Cut delivery size for hero clips and embeds.' },
      { title: 'Save storage', description: 'Archive footage at a fraction of the size.' },
    ],
    whyMediaManipulator: [
      'Simple presets instead of a wall of codec settings.',
      'H.265 and resolution downscale available when you want them.',
      `Free, no watermark, no signup. ${RETENTION_PROMISE}.`,
    ],
    privacyNote: sharedPrivacyNote,
    supportedFormats: {
      supportedInputFormats: ['mp4', 'mov', 'mkv', 'webm', 'avi', 'm4v'],
      supportedOutputFormats: ['mp4', 'webm'],
      processingNotes: ['MP4 output uses H.264 (or H.265) + AAC with yuv420p and +faststart.'],
    },
    faq: [
      { question: 'How do I compress a video?', answer: 'Upload it, pick a compression level (Balanced is a good default), and download the smaller file.' },
      { question: 'Will compression ruin the quality?', answer: 'At Balanced or High quality the difference is small. Smallest trades more quality for the lowest size.' },
      { question: 'How do I make the file as small as possible?', answer: 'Use the Smallest preset, downscale to 720p or 480p, switch to H.265, and remove the audio if you do not need it.' },
      { question: 'Is there a watermark?', answer: 'No. The compressed video is clean, with no watermark or branding.' },
      { question: 'Is there a file-size limit?', answer: 'Very large files may be rejected on the free tier. Downscaling the resolution first usually helps.' },
    ],
    related: [
      { label: 'Compress MP4', to: '/tools/compress-mp4', description: 'MP4-specific compressor.' },
      { label: 'Video converter', to: '/tools/video-converter', description: 'Convert between video formats.' },
      { label: 'Resize video', to: '/tools/resize-video', description: 'Change the resolution to shrink the file.' },
      { label: 'Remove audio from video', to: '/tools/remove-audio-from-video', description: 'Drop the audio track for a smaller file.' },
      { label: 'Video converter tutorial', to: '/tutorials/video/getting-started', description: 'Walk through every option.' },
    ],
    lastReviewed: '2026-10-29',
    primaryKeyword: 'video compressor',
    secondaryKeywords: [
      'compress video',
      'compress video online',
      'reduce video size',
      'video size reducer',
      'free video compressor',
    ],
  },
  {
    slug: 'compress-mp4',
    name: 'Compress MP4',
    h1: 'Compress MP4 Online Free',
    tagline:
      "Make an MP4 smaller and keep it an MP4: Compress Video with the container locked.",
    metaTitle: 'Compress MP4 Online Free | Media Manipulator',
    metaDescription:
      `Free online MP4 compressor. Reduce MP4 file size with simple presets and H.264 + AAC output that plays everywhere. No watermark, no signup. ${RETENTION_PROMISE}.`,
    ogTitle: 'Compress MP4 Online Free',
    ogDescription:
      'Shrink MP4 files with one-click presets. H.264 + AAC output, no watermark, no signup.',
    category: 'video',
    embed: {
      defaultMediaKind: 'video',
      defaultTask: 'compress_mp4',
      lockedVideoOutputFormat: 'mp4',
      lockedInputFormat: 'mp4',
      defaultVideoCompressionPreset: 'balanced',
      defaultVideoCodec: 'h264',
      title: 'Compress an MP4',
      description:
        'Upload an MP4 and pick a compression level. Output is locked to MP4 (H.264 + AAC) so the result plays everywhere. Optionally downscale or remove audio for an even smaller file.',
    },
    intro:
      "This page is the Media Manipulator video compressor with the input and output both fixed to MP4. The result is always an H.264 MP4 with AAC audio, which plays on every phone, browser and editor, and that lock is the only difference from the main Compress Video page. The same presets apply, Smallest, Balanced and High quality, each a different FFmpeg quality target, and you can still lower the resolution or remove the audio for a smaller file. If you would accept a WebM or an H.265 file in exchange for a smaller size, the main page lets you choose those. Re-encoding an MP4 that was already compressed hard saves less, and occasionally nothing; a phone recording at a high bitrate is where the savings are largest. Compress Video is the canonical version of this tool and shows real before-and-after numbers for each preset along with the per-plan limits. Upload an MP4 below to shrink it.",
    whatItDoes: [
      'Compresses MP4 videos into a smaller MP4 with H.264 + AAC.',
      'Offers Smallest / Balanced / High quality presets mapped to CRF values.',
      'Optionally downscales to 1080p/720p/480p and can strip the audio track.',
      'Can switch to H.265/HEVC for a smaller file on modern devices.',
    ],
    flowSteps: [
      { title: 'Upload your MP4', description: 'Drop in any .mp4 file.' },
      { title: 'Pick a compression level', description: 'Balanced is a solid default.' },
      { title: 'Compress', description: 'We re-encode to a compatible H.264 MP4 with faststart.' },
      { title: 'Download', description: 'Save the smaller MP4.' },
    ],
    advancedDetails: [
      'Output stays MP4 with H.264 + AAC, -pix_fmt yuv420p, and -movflags +faststart for universal playback.',
      'Compression presets map to CRF: Smallest ≈ 31, Balanced ≈ 26, High quality ≈ 22.',
      'H.265/HEVC can roughly halve the size at the same quality but needs a modern player.',
    ],
    whyItMatters: [
      'MP4 attachments often exceed email and chat size limits.',
      'A smaller MP4 uploads faster and streams more cheaply.',
      'Keeping the MP4/H.264 container means the smaller file still plays everywhere.',
    ],
    useCases: [
      { title: 'Email an MP4', description: 'Drop below a 25 MB cap with the Smallest preset.' },
      { title: 'Faster uploads', description: 'Shrink an MP4 before posting to social platforms.' },
      { title: 'Web embeds', description: 'Reduce MP4 delivery size for your site.' },
      { title: 'Phone storage', description: 'Re-compress phone recordings to save space.' },
    ],
    whyMediaManipulator: [
      'Output locked to a known-good MP4 profile.',
      'Simple presets, with H.265 and downscale available.',
      `Free, no watermark, no signup. ${RETENTION_PROMISE}.`,
    ],
    privacyNote: sharedPrivacyNote,
    supportedFormats: {
      supportedInputFormats: ['mp4', 'm4v'],
      supportedOutputFormats: ['mp4'],
      processingNotes: ['Output is locked to MP4 (H.264 + AAC, yuv420p, +faststart).'],
    },
    faq: [
      { question: 'How do I compress an MP4?', answer: 'Upload your .mp4, pick a compression level, and download — the output stays MP4.' },
      { question: 'Will the MP4 still play everywhere?', answer: 'Yes — we keep H.264 + AAC with yuv420p, the most compatible MP4 profile.' },
      { question: 'How much smaller will it be?', answer: 'It depends on the source, but Balanced often halves the size; Smallest or H.265 can shrink it much more.' },
      { question: 'Can I keep the resolution?', answer: 'Yes — leave the resolution on "Keep original" to compress without resizing.' },
      { question: 'Is it free?', answer: `Yes — no watermark, no signup. ${RETENTION_PROMISE}.` },
    ],
    related: [
      { label: 'Video compressor', to: '/tools/video-compressor', description: 'Compress any video format.' },
      { label: 'MP4 converter', to: '/tools/mp4-converter', description: 'Convert other formats into MP4.' },
      { label: 'MP4 trimmer', to: '/tools/mp4-trimmer', description: 'Cut an MP4 down before compressing.' },
      { label: 'Video converter', to: '/tools/video-converter', description: 'Full control over container and codec.' },
    ],
    lastReviewed: '2026-10-29',
    primaryKeyword: 'compress mp4',
    secondaryKeywords: [
      'mp4 compressor',
      'reduce mp4 file size',
      'compress mp4 online',
      'shrink mp4',
    ],
  },
  {
    slug: 'video-trimmer',
    lastReviewed: '2026-10-29',
    name: 'Video Trimmer',
    h1: 'Trim Video Online Free',
    tagline:
      'Cut a clip to the part you want with a fast, quality-preserving trim — no re-encode when possible.',
    metaTitle: 'Trim Video Online Free | Media Manipulator',
    metaDescription:
      `Free online video trimmer. Set a start and end time and cut your clip with a fast, lossless trim. MP4 output, no watermark, no signup. ${RETENTION_PROMISE}.`,
    ogTitle: 'Trim Video Online Free',
    ogDescription:
      'Trim videos to the part you want with a fast, quality-preserving cut. Free, no watermark.',
    category: 'video',
    embed: {
      defaultMediaKind: 'video',
      defaultTask: 'video_trimmer',
      defaultVideoOutputFormat: 'mp4',
      title: 'Trim a video',
      description:
        'Upload a video, then set a start and end time (or pick the range visually). We keep the original quality with a fast, lossless cut whenever possible.',
    },
    intro:
      'Trimming keeps one stretch of a video and discards the rest. Most online trimmers re-encode the whole clip to do that, which is slow and costs quality. This page does something simpler by default: it asks FFmpeg to seek to your start time and copy the compressed video and audio packets to a new file for the requested duration, without decoding them. That is a stream copy, it is lossless, and it runs about as fast as the file can be read. If the copy cannot work, because the source codec is not allowed in the container you chose, or because you ticked the frame-accurate option, the server re-encodes just the selected stretch instead.',
    whatItDoes: [
      'Cuts a single range out of a video, from a start time to an end time, typed in seconds or picked on a visual timeline.',
      'Copies the streams without re-encoding whenever the output container accepts the source codecs, so the kept part is bit-for-bit the original.',
      'Falls back automatically to a re-encode when the copy is refused, and lets you force a re-encode for a cut on the exact frame.',
      'Writes MP4 by default, or MOV or WebM; MP4 and MOV get the faststart flag so playback starts before the download finishes.',
      'Checks with ffprobe that the file actually has a video stream and refuses audio-only uploads with a clear message.',
    ],
    flowSteps: [
      { title: 'Upload the video', description: 'MP4, MOV, M4V, WebM, MKV, AVI, FLV, WMV, MPEG or MPG, uploaded straight to our storage bucket.' },
      { title: 'Set start and end', description: 'Type the seconds or drag the two handles; the panel shows the resulting clip length.' },
      { title: 'Pick a container and, if needed, frame accuracy', description: 'MP4 is preset. Tick Re-encode for a frame-accurate cut only when the exact frame matters.' },
      { title: 'FFmpeg cuts', description: 'A stream copy with -ss, -t and -c copy; or a libx264 CRF 18 re-encode when copying is impossible or you asked for it.' },
      { title: 'Download the clip', description: 'The output carries the _trimmed suffix and lives in the job folder until its retention window ends.' },
    ],
    advancedDetails: [
      'The stream-copy command is ffmpeg -ss START -i input -t DURATION -map 0 -c copy -avoid_negative_ts make_zero [-movflags +faststart] output (runTrimVideo in specialized_tools.go). -map 0 keeps every stream, including extra audio tracks and subtitles, and times are written with millisecond precision.',
      'With -ss placed before -i and no decoding, FFmpeg can only begin at a keyframe, so the copy starts at the nearest keyframe at or before your start time. On a phone recording keyframes are typically 1 to 2 seconds apart, which is the most the beginning can drift; -avoid_negative_ts make_zero then rebases the timestamps so players start cleanly.',
      'The re-encode path uses buildVideoCodecArgs at the high quality setting: libx264 -crf 18 -pix_fmt yuv420p with AAC for MP4 and MOV, or libvpx-vp9 -b:v 0 -crf 18 with Opus for WebM. Only the first video stream and the first audio stream (if any) are mapped, so extra tracks are dropped on this path.',
      'Copy mode is sent as auto, which tries the copy and re-encodes on failure. Choosing WebM for an H.264 source always ends up on the re-encode path, because WebM only accepts VP8, VP9 and AV1 video.',
      'Validation on the server: start must be 0 or later, the clip must be at least 0.1 seconds long and at most 6 hours, and end must be after start. Anything else is rejected before FFmpeg starts and the operation is refunded.',
      'Because trimming is a specialized mode, the upload skips the automated content analysis that standard conversions receive; the server only runs ffprobe and the cut.',
    ],
    whyItMatters: [
      'Dead air at the start and a fumbled stop at the end are in nearly every recording, and removing them is the single most common edit.',
      'A lossless cut means you can trim a master file without creating a second-generation copy.',
      'Cutting first makes every later step cheaper: compressing, captioning or turning the clip into a GIF only has to touch the part you kept.',
    ],
    useCases: [
      { title: 'Meeting and lecture recordings', description: 'Drop the minutes of people joining before the content begins.' },
      { title: 'Highlights for social posts', description: 'Keep the 20 seconds that matter and upload only those.' },
      { title: 'Evidence and bug reports', description: 'Share exactly the moment a problem happened, with the original quality intact.' },
      { title: 'Preparing a GIF or a restoration snippet', description: 'Cut to a few seconds before feeding the clip to a tool that works best on short input.' },
    ],
    whyMediaManipulator: [
      'Lossless stream copy is the default, with the re-encode fallback written down rather than hidden behind a slow-but-safe re-encode of everything.',
      'The exact FFmpeg flags are on this page, including why a cut may start at the previous keyframe and how to avoid that.',
      `A trim spends one operation of your daily allowance (5 a day as a guest by default, 30 with a free account), and a failed job is refunded. ${RETENTION_PROMISE}.`,
    ],
    privacyNote:
      `The trimmer runs ffprobe and one FFmpeg command on our own servers. In the default path the video and audio packets are copied, never decoded, so the server does not reconstruct a single picture from your file; in the re-encode path FFmpeg decodes only the seconds you kept. The upload lives in uploads/<jobId>/ and the clip in outputs/<jobId>/, both registered in the retention ledger and deleted when the window ends. ${RETENTION_PROMISE}. Trimming is a specialized mode, so the automated content analysis that standard conversions receive is not run on this upload, and nothing is sent to a third-party service.`,
    supportedFormats: {
      supportedInputFormats: ['mp4', 'mov', 'mkv', 'webm', 'avi', 'm4v'],
      supportedOutputFormats: ['mp4', 'mov', 'webm'],
      processingNotes: ['Stream-copy when possible (no quality loss); re-encode fallback uses H.264 + AAC for MP4.'],
    },
    faq: [
      {
        question: 'Does trimming re-encode my video?',
        answer:
          'Not by default. The server copies the compressed streams with -c copy, so the kept part is identical to the original. It re-encodes only when you tick the frame-accurate option or when the container you chose cannot hold the source codec, as with WebM for an H.264 file.',
      },
      {
        question: 'Why does my clip start a moment before the time I typed?',
        answer:
          'A stream copy can only begin at a keyframe, and FFmpeg picks the nearest one at or before your start time. Keyframes are usually 1 to 2 seconds apart on camera footage. Tick Re-encode for a frame-accurate cut to start on the exact frame.',
      },
      {
        question: 'Which output containers can I choose, and which keep the original quality?',
        answer:
          'MP4, MOV and WebM. MP4 and MOV accept the H.264 or HEVC video and AAC audio most cameras produce, so they stay lossless. WebM only accepts VP8, VP9 and AV1, so an H.264 source is re-encoded to VP9 at CRF 18 for that choice.',
      },
      {
        question: 'How long or short can the trimmed clip be?',
        answer:
          'At least 0.1 seconds and at most 6 hours, with the end after the start. In practice the upload caps bind first: by default 5 minutes of video for a guest, 20 minutes with a free account, 2 hours on Premium.',
      },
      {
        question: 'Does it keep all the audio tracks and subtitles?',
        answer:
          'In the stream-copy path yes: -map 0 copies every stream in the file. In the re-encode path only the first video and first audio stream are kept.',
      },
      {
        question: 'Can I trim a video to multiple parts at once?',
        answer:
          'No. One upload produces one clip from one range. For several pieces, run the trimmer once per range, or assemble the parts on a timeline in Darkroom.',
      },
    ],
    related: [
      { label: 'Compress video', to: '/tools/compress-video', description: 'Shrink the clip after trimming it.' },
      { label: 'Convert video to animated GIF', to: '/tools/convert-video-to-animated-gif', description: 'Turn the trimmed seconds into a GIF.' },
      { label: 'Extract audio from video', to: '/tools/extract-audio-from-video', description: 'Save only the sound of the clip.' },
      { label: 'AI video restoration', to: '/tools/ai-video-restoration', description: 'Restoration works on snippets of 15 seconds or less; trim first.' },
      { label: 'Darkroom', to: '/tools/content-studio', description: 'Join several trimmed pieces into one edit.' },
    ],
    workedExamples: [
      {
        title: 'A 30 second stream-copy cut from a 180 MB, 4.5 minute 1080p MP4',
        body:
          'Input: a 4 minute 30 second 1920 x 1080 H.264 MP4 of 180 MB, about 5.3 Mbps, which fits the default 200 MB and 5 minute guest caps. Settings: start 45.000, end 75.000, output MP4, re-encode unticked. The server runs the copy command with -ss 45.000 and -t 30.000. Since the packets are copied, the output holds roughly 30 of the 270 seconds of data, about 20 MB, at exactly the original quality, codec and frame rate. The cut begins at the last keyframe before 45 s, so the clip may open up to a second or two early. The job is bound by reading the file, not by computing, and finishes in a few seconds.',
      },
      {
        title: 'A frame-accurate 12 second cut from a 60 MB 1080p MP4',
        body:
          'Input: a 2 minute 1920 x 1080 MP4 of 60 MB. Settings: start 30.250, end 42.250, output MP4, Re-encode for a frame-accurate cut ticked. FFmpeg now decodes from 30.250 exactly, encodes 12 seconds (360 frames at 30 fps) with libx264 at CRF 18, yuv420p and faststart, and re-encodes the audio to AAC. CRF 18 keeps the picture visually very close to the source, so the result is in the same order of size per second as the source, a few megabytes for 12 seconds. Only the kept 12 seconds are encoded, never the full 2 minutes, so this is a short encode rather than a few-second copy.',
      },
    ],
    whenNotToUse:
      'Do not use the trimmer to remove several separate sections from one video; it keeps exactly one range, so a middle cut needs two trims and a join in Darkroom. Do not expect a stream copy to land on the exact frame; if a cut that is a second early matters, tick the re-encode option and accept a short encode. If your real goal is a smaller file, trimming only helps as much as you cut; the compressor changes the bitrate. And if the upload has no video stream, for example an M4A renamed to MP4, the trimmer refuses it; the audio tools handle audio-only files.',
    primaryKeyword: 'video trimmer',
    secondaryKeywords: [
      'trim video online',
      'online video trimmer',
      'cut video',
      'free video trimmer',
    ],
  },
  {
    slug: 'mp4-trimmer',
    name: 'MP4 Trimmer',
    h1: 'Trim MP4 Online Free',
    tagline:
      "The video trimmer with MP4 locked in and out.",
    metaTitle: 'Trim MP4 Online Free | Media Manipulator',
    metaDescription:
      `Free online MP4 trimmer and cutter. Set a start and end time and cut your MP4 losslessly. MP4 output, no watermark, no signup. ${RETENTION_PROMISE}.`,
    ogTitle: 'Trim MP4 Online Free',
    ogDescription:
      'Trim and cut MP4 files with a fast, quality-preserving cut. Free, no watermark.',
    category: 'video',
    embed: {
      defaultMediaKind: 'video',
      defaultTask: 'mp4_trimmer',
      lockedVideoOutputFormat: 'mp4',
      lockedInputFormat: 'mp4',
      title: 'Trim an MP4',
      description:
        'Upload an MP4 and set a start and end time. Output is locked to MP4 and we keep the original quality with a fast, lossless cut whenever possible.',
    },
    intro:
      "This page is the Media Manipulator video trimmer with two settings fixed: it accepts MP4 (and M4V) files, and the result is always an MP4. Nothing else is different. The cut is the same stream-copy the main trimmer uses, so a range taken from an H.264 MP4 keeps the original picture and sound without a re-encode, and it snaps to the nearest keyframe unless you turn on the frame-accurate option, which re-encodes to H.264 with AAC audio. If your clip is a MOV, MKV or WebM, or you would rather keep the source container, use the main video trimmer instead: it takes those formats and lets you pick the output. The full explanation of how the cut works, worked examples with real file sizes, the limits for guests and free accounts, and the questions people ask about keyframes all live on the video trimmer page, which this one points to as its canonical version. Upload an MP4 below, set the start and end, and download the trimmed file.",
    whatItDoes: [
      'Cuts an MP4 to a single start-to-end range.',
      'Keeps the output as MP4 (H.264 + AAC).',
      'Prefers a lossless stream-copy; re-encodes only when needed or requested.',
      'Supports numeric and visual range selection.',
    ],
    flowSteps: [
      { title: 'Upload your MP4', description: 'Drop in any .mp4 file.' },
      { title: 'Set start and end', description: 'Type the times or drag the visual range.' },
      { title: 'Trim', description: 'We stream-copy losslessly when possible.' },
      { title: 'Download', description: 'Save your trimmed MP4.' },
    ],
    advancedDetails: [
      'Most MP4s use H.264, which stream-copies cleanly into a trimmed MP4 — zero quality loss and near-instant.',
      'Stream-copy snaps to keyframes; the re-encode option gives a frame-exact cut.',
      'The MP4 re-encode fallback uses H.264 + AAC + yuv420p + faststart.',
    ],
    whyItMatters: [
      'MP4 is the most common video format, so a focused MP4 trimmer covers most needs.',
      'A lossless cut keeps the source quality intact.',
      'Output stays MP4, so the clip plays everywhere.',
    ],
    useCases: [
      { title: 'Trim a recording', description: 'Cut an MP4 screen or phone recording down.' },
      { title: 'Clip a moment', description: 'Keep a highlight from a longer MP4.' },
      { title: 'Remove dead air', description: 'Drop the silent start/end of a clip.' },
      { title: 'Prep for sharing', description: 'Shorten an MP4 before uploading.' },
    ],
    whyMediaManipulator: [
      'Lossless MP4-to-MP4 trim by default.',
      'Visual scrubber plus precise numeric inputs.',
      `Free, no watermark, no signup. ${RETENTION_PROMISE}.`,
    ],
    privacyNote: sharedPrivacyNote,
    supportedFormats: {
      supportedInputFormats: ['mp4', 'm4v'],
      supportedOutputFormats: ['mp4'],
      processingNotes: ['Output is locked to MP4. Stream-copy when possible; H.264 + AAC re-encode fallback.'],
    },
    faq: [
      { question: 'How do I trim an MP4?', answer: 'Upload your .mp4, set a start and end time, and download — the output stays MP4.' },
      { question: 'Is the MP4 trim lossless?', answer: 'Yes by default. We stream-copy the segment without re-encoding, so there is no quality loss.' },
      { question: 'Can I cut at an exact frame?', answer: 'Enable the frame-accurate re-encode option; otherwise the cut snaps to the nearest keyframe.' },
      { question: 'Is this also an MP4 cutter?', answer: 'Yes — trimming and cutting an MP4 are the same operation here.' },
      { question: 'Is it free?', answer: `Yes — no watermark, no signup. ${RETENTION_PROMISE}.` },
    ],
    related: [
      { label: 'Video trimmer', to: '/tools/video-trimmer', description: 'Trim any video format.' },
      { label: 'MP4 converter', to: '/tools/mp4-converter', description: 'Convert other formats into MP4.' },
      { label: 'Compress MP4', to: '/tools/compress-mp4', description: 'Shrink the MP4 after trimming.' },
      { label: 'Video cutter', to: '/tools/video-cutter', description: 'Cut a clip out of a video.' },
    ],
    lastReviewed: '2026-10-29',
    primaryKeyword: 'mp4 trimmer',
    secondaryKeywords: [
      'trim mp4',
      'mp4 cutter',
      'cut mp4 online',
      'mp4 trimmer online',
    ],
  },
  {
    slug: 'video-cutter',
    name: 'Video Cutter',
    h1: 'Cut Video Online Free',
    tagline:
      "Keep one section of a video and drop the rest: the same tool as the video trimmer.",
    metaTitle: 'Cut Video Online Free | Media Manipulator',
    metaDescription:
      `Free online video cutter. Cut a clip from any video by start and end time with a fast, lossless cut. MP4 output, no watermark, no signup. ${RETENTION_PROMISE}.`,
    ogTitle: 'Cut Video Online Free',
    ogDescription:
      'Cut a section out of any video with a fast, quality-preserving trim. Free, no watermark.',
    category: 'video',
    embed: {
      defaultMediaKind: 'video',
      defaultTask: 'video_cutter',
      defaultVideoOutputFormat: 'mp4',
      title: 'Cut a video',
      description:
        'Upload a video, set the start and end of the part you want to keep, and we cut it out — losslessly when possible. Output defaults to MP4.',
    },
    intro:
      "Cutting a video and trimming it are the same job here: you choose a start time and an end time, and Media Manipulator keeps only that section. This page opens the same form as the video trimmer, with MP4 preselected as the output and MOV or WebM available if you switch it, so there is no difference in what you can do or in the result you get. The cut is a stream-copy whenever the format allows, which means no quality loss and a result in seconds, and an optional frame-accurate mode that re-encodes for an exact cut point. It keeps one continuous range; to remove a section from the middle of a clip or join several pieces, use Darkroom, the multi-track editor. Everything about how the cut works, with worked examples and the per-plan file limits, is on the video trimmer page, the canonical version of this tool. Upload a video below and mark the part you want to keep.",
    whatItDoes: [
      'Cuts the selected start-to-end section out of a video.',
      'Prefers a lossless stream-copy (no re-encode).',
      'Falls back to a re-encode when the container/codec requires it.',
      'Outputs MP4 by default; MOV and WebM are available.',
    ],
    flowSteps: [
      { title: 'Upload your video', description: 'Drop in any common video file.' },
      { title: 'Mark start and end', description: 'Type the times or drag the visual range.' },
      { title: 'Cut', description: 'We extract just that segment, losslessly when possible.' },
      { title: 'Download', description: 'Save the cut clip.' },
    ],
    advancedDetails: [
      'The cut uses an ffmpeg stream-copy (seek + copy), so there is no re-encode and no quality loss on the fast path.',
      'Stream-copy aligns to keyframes; use the frame-accurate re-encode option for an exact cut point.',
      'MP4 re-encode fallback uses H.264 + AAC + yuv420p + faststart.',
    ],
    whyItMatters: [
      'You often need just one section of a long recording.',
      'A lossless cut is instant and keeps the source quality.',
      'Cutting first reduces the work for any later conversion or compression.',
    ],
    useCases: [
      { title: 'Grab a segment', description: 'Cut one scene out of a long video.' },
      { title: 'Remove a section', description: 'Keep the part before or after a moment.' },
      { title: 'Make a clip', description: 'Extract a shareable highlight.' },
      { title: 'Trim a recording', description: 'Cut a meeting or stream down to the useful part.' },
    ],
    whyMediaManipulator: [
      'Quality-preserving stream-copy cut.',
      'Visual + numeric range selection.',
      `Free, no watermark, no signup. ${RETENTION_PROMISE}.`,
    ],
    privacyNote: sharedPrivacyNote,
    supportedFormats: {
      supportedInputFormats: ['mp4', 'mov', 'mkv', 'webm', 'avi', 'm4v'],
      supportedOutputFormats: ['mp4', 'mov', 'webm'],
      processingNotes: ['Stream-copy when possible (no quality loss); H.264 + AAC re-encode fallback for MP4.'],
    },
    faq: [
      { question: 'How do I cut a video online?', answer: 'Upload it, mark the start and end of the part to keep, and download the cut clip.' },
      { question: 'Is cutting the same as trimming?', answer: 'Yes — here cutting and trimming both keep a single start-to-end section.' },
      { question: 'Does cutting lose quality?', answer: 'No — the default lossless stream-copy preserves the source. Only the frame-accurate option re-encodes.' },
      { question: 'What output do I get?', answer: 'MP4 by default; MOV and WebM are also available.' },
      { question: 'Is it free?', answer: `Yes — no watermark, no signup. ${RETENTION_PROMISE}.` },
    ],
    related: [
      { label: 'Video trimmer', to: '/tools/video-trimmer', description: 'Trim a clip to a range.' },
      { label: 'Cut video online', to: '/tools/cut-video-online', description: 'Quick browser-based cutting.' },
      { label: 'Video compressor', to: '/tools/video-compressor', description: 'Shrink the cut clip.' },
      { label: 'MP4 trimmer', to: '/tools/mp4-trimmer', description: 'Cut MP4 files specifically.' },
    ],
    lastReviewed: '2026-10-29',
    primaryKeyword: 'video cutter',
    secondaryKeywords: [
      'cut video online',
      'online video cutter',
      'video cutter free',
      'cut video',
    ],
  },
  {
    slug: 'cut-video-online',
    name: 'Cut Video Online',
    h1: 'Cut Video Online Free',
    tagline:
      "Cut a clip from a video in the browser, with nothing to install: the video trimmer under another name.",
    metaTitle: 'Cut Video Online Free — No Install | Media Manipulator',
    metaDescription:
      `Cut video online free, no install. Set a start and end and cut any clip in your browser with a fast, lossless cut. No watermark, no signup. ${RETENTION_PROMISE}.`,
    ogTitle: 'Cut Video Online Free — No Install',
    ogDescription:
      'Cut a clip out of any video right in your browser. Fast, lossless, no install, no watermark.',
    category: 'video',
    embed: {
      defaultMediaKind: 'video',
      defaultTask: 'cut_video_online',
      defaultVideoOutputFormat: 'mp4',
      title: 'Cut a video in your browser',
      description:
        'Upload, mark the part to keep, and download — no app to install. We cut losslessly when possible. Output defaults to MP4.',
    },
    intro:
      "People search for a way to cut a video online because they do not want to install an editor for a thirty-second job. This page is that, and it is the same tool as the Media Manipulator video trimmer: the same form, MP4 as the default output, and the same fast stream-copy cut on our servers. You upload the file in the browser, type or drag a start and end point, and download the section you kept. Nothing differs from the main trimmer except this introduction. Because the work happens server-side, an older laptop or a phone cuts a long file as quickly as a desktop. The video trimmer page is the canonical version, and it carries the details this page leaves out: why a stream-copy cut lands on a keyframe, when the frame-accurate option is worth its extra time, worked examples with real sizes, and the limits for guests and free accounts. Start below if you already know the range you want.",
    whatItDoes: [
      'Cuts a clip out of any common video, entirely in the browser flow.',
      'Uses a fast, lossless stream-copy whenever possible.',
      'No app, plugin, or signup required.',
      'Outputs MP4 by default; MOV and WebM available.',
    ],
    flowSteps: [
      { title: 'Upload', description: 'Drop a video into the page — no install.' },
      { title: 'Mark the range', description: 'Set start/end or drag the visual scrubber.' },
      { title: 'Cut', description: 'We extract that segment server-side, losslessly when possible.' },
      { title: 'Download', description: 'Save the clip immediately.' },
    ],
    advancedDetails: [
      'The browser uploads your file and the cut runs server-side with ffmpeg stream-copy — fast and lossless on the happy path.',
      'For a frame-exact cut, enable the re-encode option; otherwise the cut snaps to keyframes.',
      `Files are processed on our infrastructure. ${RETENTION_PROMISE}.`,
    ],
    whyItMatters: [
      'No-install tools win when you just need a quick cut.',
      'Browser-based means it works on any OS, including locked-down work laptops.',
      'A lossless cut keeps the quality and is nearly instant.',
    ],
    useCases: [
      { title: 'Quick clip', description: 'Cut a moment without opening an editor.' },
      { title: 'On a work laptop', description: 'No admin rights needed — it is all in the browser.' },
      { title: 'On the go', description: 'Cut a clip from any computer.' },
      { title: 'One-off edits', description: 'Skip installing software for a single cut.' },
    ],
    whyMediaManipulator: [
      'Truly no-install — just a web page.',
      'Quality-preserving stream-copy cut.',
      `Free, no watermark, no signup. ${RETENTION_PROMISE}.`,
    ],
    privacyNote: sharedPrivacyNote,
    supportedFormats: {
      supportedInputFormats: ['mp4', 'mov', 'mkv', 'webm', 'avi', 'm4v'],
      supportedOutputFormats: ['mp4', 'mov', 'webm'],
      processingNotes: ['Stream-copy when possible; H.264 + AAC re-encode fallback for MP4.'],
    },
    faq: [
      { question: 'Do I need to install anything?', answer: 'No. Cutting happens through this web page — there is no app or plugin to install.' },
      { question: 'How do I cut a video online for free?', answer: 'Upload your video, mark the start and end of the part to keep, and download the clip.' },
      { question: 'Is the cut lossless?', answer: 'Yes on the fast path — we stream-copy without re-encoding. The frame-accurate option re-encodes.' },
      { question: 'Which tool should I use for repeated edits?', answer: 'For focused trimming use the video trimmer or video cutter; this page is tuned for quick, one-off cuts.' },
      { question: 'Is it free?', answer: `Yes — no watermark, no signup. ${RETENTION_PROMISE}.` },
    ],
    related: [
      { label: 'Video trimmer', to: '/tools/video-trimmer', description: 'Focused trimming with a visual range.' },
      { label: 'Video cutter', to: '/tools/video-cutter', description: 'Cut a section out of a video.' },
      { label: 'MP4 trimmer', to: '/tools/mp4-trimmer', description: 'Cut MP4 files specifically.' },
      { label: 'Video compressor', to: '/tools/video-compressor', description: 'Shrink the clip after cutting.' },
    ],
    lastReviewed: '2026-10-29',
    primaryKeyword: 'cut video online',
    secondaryKeywords: [
      'cut video free',
      'online video cutter',
      'cut video no install',
      'browser video cutter',
    ],
  },
  {
    slug: 'crop-video',
    name: 'Crop Video',
    h1: 'Crop Video Online Free',
    tagline:
      'Cut away the edges of a video — change the framing or aspect ratio without an editor.',
    metaTitle: 'Crop Video Online Free | Media Manipulator',
    metaDescription:
      `Free online video cropper. Crop the edges of a video to reframe it or change the aspect ratio. MP4 output, no watermark, no signup. ${RETENTION_PROMISE}.`,
    ogTitle: 'Crop Video Online Free',
    ogDescription:
      'Crop the edges of a video to reframe it or change the aspect ratio. Free, no watermark.',
    category: 'video',
    embed: {
      defaultMediaKind: 'video',
      defaultTask: 'crop_video',
      defaultVideoOutputFormat: 'mp4',
      title: 'Crop a video',
      description:
        'Upload a video and enter the rectangle to keep (offset + width/height in pixels). We crop to exactly that area and export MP4.',
    },
    intro:
      'Cropping removes the outer edges of a video — useful for reframing a shot, cutting out black bars or a watermark, or changing the aspect ratio for a platform. The Media Manipulator video cropper takes a pixel rectangle (where to start and how big) and exports just that area as a clean MP4.',
    whatItDoes: [
      'Crops a video to a rectangle you specify in pixels.',
      'Removes black bars, edges, watermarks, or unwanted regions.',
      'Helps reframe to square or vertical for social platforms.',
      'Exports MP4 (H.264 + AAC) by default.',
    ],
    flowSteps: [
      { title: 'Upload your video', description: 'MP4, MOV, MKV, WebM, AVI or M4V to crop.' },
      { title: 'Enter the crop rectangle', description: 'Set the X/Y offset and the width/height to keep.' },
      { title: 'Crop', description: 'FFmpeg crops to exactly that region and re-encodes.' },
      { title: 'Download', description: 'Save the cropped video.' },
    ],
    advancedDetails: [
      'Crop coordinates are in pixels from the top-left corner: X/Y is where the kept area starts, width/height is its size.',
      'Cropping re-encodes the video; MP4 output uses H.264 + AAC + yuv420p + faststart.',
      'For pixel-perfect framing on a preview, the full converter on the homepage offers a visual crop overlay.',
    ],
    whyItMatters: [
      'Cropping reframes a shot without re-shooting.',
      'It removes black bars (letterboxing/pillarboxing) and unwanted edges.',
      'Changing aspect ratio (e.g. to 9:16) helps video fit a platform.',
    ],
    useCases: [
      { title: 'Make it vertical', description: 'Crop a landscape clip to 9:16 for Reels/Shorts/TikTok.' },
      { title: 'Remove black bars', description: 'Crop away letterboxing.' },
      { title: 'Hide a watermark', description: 'Crop out a corner logo or timestamp.' },
      { title: 'Reframe a subject', description: 'Tighten the shot on what matters.' },
    ],
    whyMediaManipulator: [
      'Precise pixel cropping server-side with FFmpeg.',
      'Clean MP4 output, no watermark.',
    ],
    privacyNote: privacyNoteFor('video', 'Your video is cropped to the rectangle you drew and re-encoded by FFmpeg on our server.'),
    supportedFormats: {
      supportedInputFormats: ['mp4', 'mov', 'mkv', 'webm', 'avi', 'm4v'],
      supportedOutputFormats: ['mp4', 'webm', 'mov', 'mkv'],
      processingNotes: ['Cropping re-encodes; MP4 output uses H.264 + AAC + yuv420p + faststart.'],
    },
    faq: [
      { question: 'How do I crop a video?', answer: 'Upload it, enter the rectangle to keep (X/Y offset and width/height in pixels), and download the cropped video.' },
      { question: 'Can I crop to a square or vertical aspect ratio?', answer: 'Yes — set the width and height to the ratio you want (e.g. equal values for square, taller than wide for 9:16).' },
      { question: 'Will cropping lower the quality?', answer: 'Cropping re-encodes, but at our default quality the loss is minimal.' },
      { question: 'Can I crop out a watermark?', answer: 'Yes, if the watermark is near an edge — crop the frame to exclude it.' },
    ],
    related: [
      { label: 'Resize video', to: '/tools/resize-video', description: 'Change the resolution instead of cropping.' },
      { label: 'Rotate video', to: '/tools/rotate-video', description: 'Fix sideways or upside-down video.' },
      { label: 'Video converter', to: '/tools/video-converter', description: 'Convert between video formats.' },
      { label: 'Compress video', to: '/tools/compress-video', description: 'Shrink the cropped video.' },
    ],
    primaryKeyword: 'crop video',
    secondaryKeywords: [
      'video cropper',
      'crop video online',
      'crop mp4',
      'crop video free',
    ],
  },
  {
    slug: 'resize-video',
    name: 'Resize Video',
    h1: 'Resize Video Online Free',
    tagline:
      'Change a video resolution — scale to 1080p, 720p, 480p, or any custom width and height.',
    metaTitle: 'Resize Video Online Free | Media Manipulator',
    metaDescription:
      `Free online video resizer. Change video resolution to 1080p, 720p, 480p, or a custom size. MP4 output, no watermark, no signup. ${RETENTION_PROMISE}.`,
    ogTitle: 'Resize Video Online Free',
    ogDescription:
      'Change a video resolution to 1080p, 720p, 480p, or a custom size. Free, no watermark.',
    category: 'video',
    embed: {
      defaultMediaKind: 'video',
      defaultTask: 'resize_video',
      defaultVideoOutputFormat: 'mp4',
      title: 'Resize a video',
      description:
        'Upload a video and set a target width and/or height. Leave one blank to scale proportionally. Output is MP4 by default.',
    },
    intro:
      'Resizing changes a video resolution — make a 4K clip 1080p, shrink to 720p for the web, or hit an exact pixel size a platform requires. The Media Manipulator video resizer scales your video to the dimensions you choose, preserving the aspect ratio by default, and exports a clean MP4.',
    whatItDoes: [
      'Scales a video to a target width and/or height.',
      'Preserves aspect ratio by default (leave one dimension blank to auto-scale).',
      'Downscales to shrink the file or upscales to fit a target size.',
      'Exports MP4 (H.264 + AAC) by default.',
    ],
    flowSteps: [
      { title: 'Upload your video', description: 'Pick the clip you want at a different size.' },
      { title: 'Set the size', description: 'Enter a width and/or height in pixels.' },
      { title: 'Resize', description: 'FFmpeg scales the video and re-encodes it.' },
      { title: 'Download', description: 'Save the resized video.' },
    ],
    advancedDetails: [
      'Leave one dimension blank to scale proportionally and keep the original aspect ratio.',
      'Keep "Preserve aspect ratio" on to fit within the box without stretching when both dimensions are set.',
      'Resizing re-encodes; MP4 output uses H.264 + AAC + yuv420p + faststart. Max 4096 px per side.',
    ],
    whyItMatters: [
      'Lower resolution means smaller files and faster uploads.',
      'Some platforms require an exact resolution.',
      'Resizing standardizes a mixed-resolution library.',
    ],
    useCases: [
      { title: 'Shrink for the web', description: 'Drop 4K to 1080p or 720p for faster pages.' },
      { title: 'Hit a target size', description: 'Match a platform spec exactly.' },
      { title: 'Reduce file size', description: 'Lower resolution to cut the bytes.' },
      { title: 'Standardize footage', description: 'Bring clips to one resolution.' },
    ],
    whyMediaManipulator: [
      'Aspect-ratio-aware scaling server-side with FFmpeg.',
      'Clean MP4 output, no watermark.',
    ],
    privacyNote: privacyNoteFor('video', 'Your video is scaled to the width and height you set and re-encoded by FFmpeg on our server.'),
    supportedFormats: {
      supportedInputFormats: ['mp4', 'mov', 'mkv', 'webm', 'avi', 'm4v'],
      supportedOutputFormats: ['mp4', 'webm', 'mov', 'mkv'],
      processingNotes: ['Resizing re-encodes; MP4 output uses H.264 + AAC + yuv420p + faststart. Max 4096 px per side.'],
    },
    faq: [
      { question: 'How do I resize a video?', answer: 'Upload it, set a target width and/or height, and download the resized video.' },
      { question: 'How do I change the resolution to 720p?', answer: 'Set the height to 720 and leave the width blank to scale proportionally.' },
      { question: 'Will resizing keep the aspect ratio?', answer: 'Yes — leave one dimension blank, or keep "Preserve aspect ratio" on so the video is not stretched.' },
      { question: 'Can I upscale a video?', answer: 'You can scale up to a larger size, but upscaling cannot add detail that was not captured.' },
    ],
    related: [
      { label: 'Crop video', to: '/tools/crop-video', description: 'Cut away edges instead of scaling.' },
      { label: 'Compress video', to: '/tools/compress-video', description: 'Shrink the file with presets.' },
      { label: 'Video converter', to: '/tools/video-converter', description: 'Convert to MP4.' },
      { label: 'Rotate video', to: '/tools/rotate-video', description: 'Fix orientation.' },
    ],
    primaryKeyword: 'resize video',
    secondaryKeywords: [
      'video resizer',
      'change video resolution',
      'resize video online',
      'scale video',
    ],
  },
  {
    slug: 'rotate-video',
    name: 'Rotate Video',
    h1: 'Rotate Video Online Free',
    tagline:
      'Fix sideways or upside-down video — rotate 90°, 180°, or 270° and flip in one click.',
    metaTitle: 'Rotate Video Online Free | Media Manipulator',
    metaDescription:
      `Free online video rotator. Rotate a video 90°, 180°, or 270° and fix sideways or upside-down clips. MP4 output, no watermark, no signup. ${RETENTION_PROMISE}.`,
    ogTitle: 'Rotate Video Online Free',
    ogDescription:
      'Rotate a video 90°, 180°, or 270° to fix sideways or upside-down footage. Free, no watermark.',
    category: 'video',
    embed: {
      defaultMediaKind: 'video',
      defaultTask: 'rotate_video',
      defaultVideoOutputFormat: 'mp4',
      defaultTransform: { rotation: 90 },
      title: 'Rotate a video',
      description:
        'Upload a video and pick a rotation (90°, 180°, or 270°). You can also flip it. We rotate the actual frames and export MP4.',
    },
    intro:
      'Phone videos often record sideways, and some clips end up upside down. The Media Manipulator video rotator fixes orientation for good — pick 90°, 180°, or 270° and we rotate the actual frames (swapping width and height for 90°/270°), so the video plays the right way up on every player, not just ones that read a rotation flag.',
    whatItDoes: [
      'Rotates a video 90° clockwise, 180°, or 270° (90° counter-clockwise).',
      'Optionally flips the video horizontally or vertically (mirror).',
      'Re-encodes so the rotation is baked into the frames, not just a metadata flag.',
      'Exports MP4 (H.264 + AAC) by default.',
    ],
    flowSteps: [
      { title: 'Upload your video', description: 'A sideways phone clip, for example.' },
      { title: 'Pick a rotation', description: '90°, 180°, or 270° — and flip if needed.' },
      { title: 'Rotate', description: 'FFmpeg rotates the frames (transpose) and re-encodes.' },
      { title: 'Download', description: 'Save the correctly-oriented video.' },
    ],
    advancedDetails: [
      'We use FFmpeg transpose for 90°/270° (which correctly swaps width and height) and a double transpose for 180°.',
      'Baking the rotation into the pixels fixes players that ignore the container rotation flag.',
      'Rotation re-encodes; MP4 output uses H.264 + AAC + yuv420p + faststart.',
    ],
    whyItMatters: [
      'Sideways phone videos are one of the most common video annoyances.',
      'A baked-in rotation plays correctly everywhere, unlike a rotation flag.',
      'Flipping fixes mirrored selfie/webcam footage.',
    ],
    useCases: [
      { title: 'Fix a sideways clip', description: 'Rotate a portrait phone video to play upright.' },
      { title: 'Flip a selfie video', description: 'Un-mirror webcam or front-camera footage.' },
      { title: 'Turn it 180°', description: 'Fix an upside-down recording.' },
      { title: 'Reorient for editing', description: 'Get the orientation right before importing.' },
    ],
    whyMediaManipulator: [
      'Real frame rotation (transpose), not just a metadata flag.',
      'Rotate and flip in one focused panel.',
    ],
    privacyNote: privacyNoteFor('video', 'Your video is turned by the angle you pick and re-encoded by FFmpeg on our server.'),
    supportedFormats: {
      supportedInputFormats: ['mp4', 'mov', 'mkv', 'webm', 'avi', 'm4v'],
      supportedOutputFormats: ['mp4', 'webm', 'mov', 'mkv'],
      processingNotes: ['Rotation re-encodes via FFmpeg transpose; MP4 output uses H.264 + AAC + yuv420p + faststart.'],
    },
    faq: [
      { question: 'How do I rotate a video?', answer: 'Upload it, pick 90°, 180°, or 270°, and download the rotated video.' },
      { question: 'How do I fix a sideways phone video?', answer: 'Rotate 90° clockwise or counter-clockwise until it plays upright; the rotation is baked into the frames.' },
      { question: 'Does it really rotate the frames, or just set a flag?', answer: 'It rotates the actual frames (FFmpeg transpose), so the video is upright in every player.' },
      { question: 'Can I flip / mirror the video too?', answer: 'Yes — horizontal and vertical flip options are included.' },
    ],
    related: [
      { label: 'Crop video', to: '/tools/crop-video', description: 'Cut away the edges.' },
      { label: 'Resize video', to: '/tools/resize-video', description: 'Change the resolution.' },
      { label: 'Video converter', to: '/tools/video-converter', description: 'Convert between video formats.' },
      { label: 'Compress video', to: '/tools/compress-video', description: 'Shrink the rotated video.' },
    ],
    primaryKeyword: 'rotate video',
    secondaryKeywords: [
      'rotate mp4',
      'rotate video online',
      'fix sideways video',
      'flip video',
    ],
  },
  {
    slug: 'remove-audio-from-video',
    name: 'Remove Audio from Video',
    h1: 'Remove Audio from Video Online Free',
    tagline:
      'Mute a video for good — strip the audio track and download a silent, video-only file.',
    metaTitle: 'Remove Audio from Video Online Free | Media Manipulator',
    metaDescription:
      `Free online tool to remove audio from a video. Strip the sound and download a silent, video-only MP4. No watermark, no signup. ${RETENTION_PROMISE}.`,
    ogTitle: 'Remove Audio from Video Online Free',
    ogDescription:
      'Strip the audio track from a video and download a silent, video-only file. Free, no watermark.',
    category: 'video',
    embed: {
      defaultMediaKind: 'video',
      defaultTask: 'remove_audio_from_video',
      defaultVideoOutputFormat: 'mp4',
      title: 'Remove audio from a video',
      description:
        'Upload a video and we strip the audio track, returning a silent, video-only file. Output defaults to MP4. We stream-copy the video where possible (no quality loss).',
    },
    intro:
      'Removing the audio from a video gives you a silent, video-only file — handy for muting background noise, dropping copyrighted music before re-uploading, or preparing a clip you will add new audio to. Media Manipulator strips the audio track and returns the video, stream-copying the picture where possible so there is no quality loss.',
    whatItDoes: [
      'Removes (mutes) the audio track and returns a video-only file.',
      'Stream-copies the video stream where possible — no re-encode, no quality loss.',
      'Falls back to a re-encode when the container/codec requires it.',
      'Outputs MP4 by default (WebM also available).',
    ],
    flowSteps: [
      { title: 'Upload your video', description: 'The clip whose sound you want gone.' },
      { title: 'Pick the output format', description: 'MP4 (default) or WebM.' },
      { title: 'Remove audio', description: 'FFmpeg drops the audio and keeps the video.' },
      { title: 'Download', description: 'Save the silent, video-only file.' },
    ],
    advancedDetails: [
      'We stream-copy the video stream (`-c:v copy -an`) so the picture is untouched; if the container does not accept the source codec we re-encode to H.264.',
      'The output has no audio track at all — it is silent, not just muted to zero volume.',
      'The downloaded filename is suffixed `_silent` so you can tell it apart from the original.',
    ],
    whyItMatters: [
      'Muting removes background noise, chatter, or wind for good.',
      'Dropping copyrighted music avoids takedowns on re-upload.',
      'A silent base clip is the starting point for adding new audio or a voiceover.',
    ],
    useCases: [
      { title: 'Mute background noise', description: 'Remove unwanted sound from a clip.' },
      { title: 'Drop copyrighted audio', description: 'Strip music before re-posting.' },
      { title: 'Prep for new audio', description: 'Get a silent base to add a voiceover to.' },
      { title: 'Privacy', description: 'Remove a conversation captured in the background.' },
    ],
    whyMediaManipulator: [
      'Quality-preserving stream-copy of the video stream.',
      'Truly silent output (audio track removed, not just lowered).',
    ],
    privacyNote: privacyNoteFor('video', 'Your video\'s audio track is dropped by FFmpeg on our server and the picture is kept.'),
    supportedFormats: {
      supportedInputFormats: ['mp4', 'mov', 'mkv', 'webm', 'avi', 'm4v'],
      supportedOutputFormats: ['mp4', 'webm'],
      processingNotes: ['Video is stream-copied where possible; the audio track is removed entirely. Download suffix: _silent.'],
    },
    faq: [
      { question: 'How do I remove audio from a video?', answer: 'Upload the video, pick an output format, and download the silent, video-only file.' },
      { question: 'Does this mute the video or remove the track?', answer: 'It removes the audio track entirely, so the result is truly silent rather than muted to zero.' },
      { question: 'Will the video quality change?', answer: 'No — we stream-copy the video stream where possible, so the picture is untouched.' },
      { question: 'Why is the file named "_silent"?', answer: 'We add a _silent suffix so you can tell the audio-free copy apart from the original.' },
    ],
    related: [
      { label: 'Remove audio (video-only)', to: '/tools/extract-video-only-from-video', description: 'The same silent-video tool.' },
      { label: 'Extract audio from video', to: '/tools/extract-audio-from-video', description: 'Save the audio instead of removing it.' },
      { label: 'Compress video', to: '/tools/compress-video', description: 'Shrink the silent video.' },
      { label: 'Stitch audio to video', to: '/tools/stitch-audio-to-video', description: 'Add a new soundtrack to the silent clip.' },
    ],
    primaryKeyword: 'remove audio from video',
    secondaryKeywords: [
      'mute video',
      'remove sound from video',
      'silence video',
      'strip audio from video',
    ],
  },
  {
    slug: 'audio-converter',
    name: 'Audio Converter',
    h1: 'Free Online Audio Converter',
    tagline:
      'Convert between MP3, WAV, M4A, OGG, FLAC, OPUS, and more — with full control over bitrate, sample rate, and channels.',
    metaTitle: 'Free Online Audio Converter | Media Manipulator',
    metaDescription:
      'Free online audio converter for MP3, WAV, M4A, OGG, FLAC, OPUS, and more. Choose bitrate, sample rate, and channels.',
    ogTitle: 'Free Online Audio Converter',
    ogDescription:
      'Convert WAV, MP3, M4A, OGG, FLAC, OPUS, and more. Choose bitrate, sample rate, and channels.',
    category: 'audio',
    embed: {
      defaultMediaKind: 'audio',
      defaultTask: 'audio_converter',
      title: 'Convert an audio file',
      description:
        'Upload any audio file and pick the target format. 192 kbps MP3 is a sensible default. WAV is lossless but large; M4A/AAC is a good compressed choice for music.',
    },
    intro:
      'Different devices, podcast hosts, and audio editors want different formats. Media Manipulator handles every common audio format in one place, with fine control over bitrate, sample rate, and channel layout.',
    whatItDoes: [
      'Converts between MP3, WAV, M4A/AAC, OGG, FLAC, ALAC, OPUS, AC3, DTS.',
      'Choose bitrate, sample rate, and channel layout.',
      'Trim and apply EQ, denoise, or AI cleanup in the same upload.',
      'Outputs valid, ID3-tagged files where applicable.',
    ],
    flowSteps: [
      { title: 'Upload audio', description: 'MP3, WAV, M4A, FLAC, OGG and more.' },
      { title: 'Pick output format', description: 'MP3, WAV, FLAC, M4A, OGG, OPUS.' },
      { title: 'Tune bitrate and rate', description: 'Trim or run AI cleanup.' },
      { title: 'Download', description: 'Save the converted audio.' },
    ],
    advancedDetails: [
      'MP3 is the universal compressed format — every device plays it.',
      'FLAC and ALAC are lossless — bigger than MP3, smaller than WAV.',
      'OPUS (in OGG) is the smallest modern lossy format for voice and music — great when you control the player.',
    ],
    whyItMatters: [
      'Podcast platforms, music services, and audio editors each prefer different formats.',
      'Smaller files mean smaller storage and faster delivery.',
      'Lossless formats are critical when audio will be re-edited.',
    ],
    useCases: [
      { title: 'Podcast publishing', description: 'WAV master → MP3 episode.' },
      { title: 'Voice memo sharing', description: 'Trim and compress to MP3.' },
      { title: 'Music archival', description: 'Convert MP3 → FLAC (no quality gain) or WAV → FLAC for lossless storage.' },
      { title: 'Game and app assets', description: 'Convert WAV → OPUS for tiny mobile assets.' },
    ],
    whyMediaManipulator: [
      'Full control over bitrate, sample rate, channels.',
      'AI cleanup tools (denoise, isolate vocals, remove vocals) in the same upload.',
      'Free, no signup, no watermarks.',
    ],
    privacyNote: privacyNoteFor('audio', 'Your audio is decoded and re-encoded by FFmpeg on our server into the format and bitrate you choose.'),
    faq: [
      { question: 'What format is best for music?', answer: 'FLAC for lossless storage, MP3 256–320 kbps for sharing, OPUS for the smallest streamable file.' },
      { question: 'What format is best for voice?', answer: 'MP3 at 96–128 kbps is a great podcast default.' },
      { question: 'Can I trim while converting?', answer: 'Yes — set start/end seconds in the trim section before submitting.' },
      { question: 'Is FLAC really lossless?', answer: 'Yes — FLAC compresses without throwing away any data. Decoding gives a bit-perfect copy of the input.' },
    ],
    related: [
      { label: 'Convert WAV to MP3', to: '/tools/convert-wav-to-mp3', description: 'Focused WAV → MP3 converter.' },
      { label: 'Isolate vocals from a song', to: '/tools/isolate-vocals-from-song', description: 'Pull vocals out of music tracks.' },
      { label: 'Audio converter tutorial', to: '/tutorials/audio/getting-started', description: 'Full walkthrough of every option.' },
      // Hidden during AdSense review — re-enable when the blog returns.
      // { label: 'Audio quality guide', to: '/blog/audio/audio-quality-guide', description: 'Bitrate, sample rate, and codec deep dive.' },
    ],
    primaryKeyword: 'audio converter',
    secondaryKeywords: [
      'online audio converter',
      'convert WAV to MP3',
      'convert FLAC to MP3',
      'convert audio online',
      'free audio converter',
    ],
  },

  // ----------------------------------------------------------------------- SRT GENERATOR
  {
    slug: 'srt-generator',
    name: 'SRT Generator',
    h1: 'Free SRT Generator',
    tagline:
      'Upload a video or audio file and generate a downloadable .srt subtitle file ready for YouTube, editors, and accessibility tools.',
    metaTitle: 'Free SRT Generator Online — Video & Audio to SRT | Media Manipulator',
    metaDescription:
      `Generate SRT subtitle files from MP4, MOV, MP3, WAV, and more. Free, no signup. ${RETENTION_PROMISE}. Works with YouTube, Premiere, DaVinci Resolve.`,
    ogTitle: 'Free SRT Generator — Video & Audio to SRT',
    ogDescription:
      'Generate accurate SRT subtitle files from any video or audio. Local AI transcription, no third-party providers.',
    category: 'ai',
    embed: {
      defaultMediaKind: 'video',
      defaultTask: 'srt_generator',
      defaultOutputFormat: 'srt',
      transcribeMode: true,
      title: 'Generate an SRT subtitle file',
      description:
        'Upload a video or audio file. We transcribe it on our own GPU server with whisper-ctranslate2 and return a .srt subtitle file you can drop into any video editor.',
    },
    intro:
      'SRT (SubRip) is the most widely-supported subtitle format on the internet — YouTube, Vimeo, Premiere, DaVinci Resolve, Final Cut, and almost every social platform accept it. Media Manipulator lets you generate an SRT file from any video or audio in one upload. The transcript runs on our own GPU server with whisper-ctranslate2, so the audio never leaves our infrastructure and never sees a third-party AI provider.',
    whatItDoes: [
      'Transcribes any video or audio file into a time-coded .srt subtitle file.',
      'Uses whisper-ctranslate2 on our local GPU server — no third-party AI providers see your media.',
      'Produces SubRip-format files (HH:MM:SS,mmm timestamps, sequential cue numbers) compatible with every major video editor and player.',
      'Supports automatic language detection or an optional BCP-47 language hint for better accuracy on short clips.',
    ],
    flowSteps: [
      { title: 'Upload your media', description: 'Drop any MP4, MOV, MP3, WAV, or other supported file.' },
      { title: 'We extract audio', description: 'FFmpeg pulls the audio track and converts it to the format whisper expects.' },
      { title: 'Whisper transcribes', description: 'Our GPU server runs whisper-ctranslate2 to produce timed segments.' },
      { title: 'Download .srt', description: 'A clean SubRip file is generated with sequential cues and accurate timing.' },
    ],
    advancedDetails: [
      'Whisper runs on our own NVIDIA GPU server using ctranslate2 — there is no external API in the loop.',
      'SRT output uses comma-millisecond timestamps (00:00:01,234) and sequential 1-indexed cue numbers, the format that maximizes editor compatibility.',
      'The transcription pipeline supports auto language detection or an optional WHISPER_CT2_LANGUAGE-style BCP-47 hint via the language field.',
      'Outputs go through the same job system as the rest of the app — you can also pick VTT, plain text, or structured JSON from the transcribe form.',
    ],
    whyItMatters: [
      'YouTube, Vimeo, Premiere, DaVinci Resolve, Final Cut, and most social platforms accept SRT as their default subtitle format.',
      'Captions make videos accessible to deaf and hard-of-hearing viewers and bump engagement on social platforms where most video plays silently.',
      'Search engines can index transcript content from your videos when you publish a matching .srt alongside them.',
    ],
    useCases: [
      { title: 'YouTube creators', description: 'Generate accurate captions and upload them as the SRT track on every video.' },
      { title: 'Course producers', description: 'Add transcripts to lecture videos so students can search, review, and translate them later.' },
      { title: 'Podcasters reposting to video', description: 'Turn podcast episodes into captioned video clips for social platforms.' },
      { title: 'Marketing / social teams', description: 'Caption every clip so silent-autoplay viewers still get the message.' },
    ],
    whyMediaManipulator: [
      'Whisper runs on our own GPU infrastructure — your media never touches a third-party AI provider.',
      `No signup, no watermarks. ${RETENTION_PROMISE}.`,
      'Same transcription engine the rest of the app uses, so accuracy is consistent across SRT, VTT, plain text, and JSON outputs.',
    ],
    privacyNote: privacyNoteFor('ai', 'Your file\'s speech is transcribed by Whisper on our own GPU server and timed into an SRT subtitle file.'),
    supportedFormats: {
      supportedInputFormats: ['mp4', 'mov', 'webm', 'mkv', 'avi', 'm4v', 'mp3', 'wav', 'm4a', 'aac', 'flac', 'ogg'],
      supportedOutputFormats: ['srt'],
      processingNotes: [
        'Transcription runs on our local GPU server — your file is never sent to an external AI provider.',
        'For long videos, the job runs asynchronously and you can keep the tab open to watch progress.',
      ],
    },
    faq: [
      { question: 'What is an SRT file?', answer: 'SRT (SubRip) is a plain-text subtitle file with timestamps and cue numbers. It is the default subtitle format accepted by YouTube, most video editors, and most video players.' },
      { question: 'Can I generate subtitles from an MP4?', answer: 'Yes. Upload any MP4 (or MOV, MKV, WebM, AVI, M4V) and we will produce a downloadable .srt subtitle file.' },
      { question: 'Can I use the SRT file on YouTube?', answer: 'Yes — YouTube accepts SRT directly. Upload your video, then add the subtitle file under Subtitles → Add language → Upload file.' },
      { question: 'What languages are supported?', answer: 'Whisper supports dozens of languages and can auto-detect the spoken language. You can also pass a BCP-47 hint (e.g. en, es, ja) for better accuracy on very short clips.' },
    ],
    related: [
      { label: 'Caption Translator', to: '/tools/caption-translator', description: 'Translate your generated SRT into other languages.' },
      { label: 'Extract Audio from Video', to: '/tools/extract-audio-from-video', description: 'Pull the audio out before transcribing manually.' },
      { label: 'Extract Frames from Video', to: '/tools/extract-frames-from-video', description: 'Grab stills for thumbnails and reference.' },
      { label: 'Transcode video to HLS', to: '/tools/transcode-to-hls', description: 'Prepare your video for streaming.' },
      { label: 'Transcode video to DASH', to: '/tools/transcode-to-dash', description: 'AV1 / VP9 DASH packaging.' },
    ],
    primaryKeyword: 'SRT generator',
    secondaryKeywords: [
      'generate SRT from video',
      'video to SRT',
      'audio to SRT',
      'free SRT generator',
      'create SRT file from video',
      'subtitle generator online',
      'MP4 to SRT',
    ],
  },

  // ----------------------------------------------------------------------- CAPTION TRANSLATOR
  {
    slug: 'caption-translator',
    name: 'Caption Translator',
    h1: 'Free Caption Translator',
    tagline:
      'Translate SRT and VTT subtitle files while preserving cue timings, cue order, and structure — no third-party AI provider.',
    metaTitle: 'Free Caption Translator (SRT & VTT) — Preserves Timestamps | Media Manipulator',
    metaDescription:
      'Translate SRT and VTT captions online with cue timings preserved exactly. Runs on our own local AI server — your captions are never sent to third-party providers.',
    ogTitle: 'Free Caption Translator — SRT & VTT',
    ogDescription:
      'Translate SRT or VTT captions while preserving timestamps and cue order. Local AI, no third-party providers.',
    category: 'ai',
    embed: {
      defaultMediaKind: 'video',
      defaultTask: 'caption_translator',
      title: 'Translate an SRT or VTT caption file',
      description:
        'Upload an existing .srt or .vtt file, pick a target language, and get back a translated subtitle file with the original cue timings preserved exactly.',
    },
    intro:
      'Translate existing subtitle files between languages without ever touching the cue timing. Media Manipulator parses the cues from your .srt or .vtt file, translates only the text using our locally-hosted caption translation model, and re-emits the original timestamps verbatim. No third-party translation API sees your captions — the model runs on our own GPU server.',
    whatItDoes: [
      'Accepts .srt or .vtt caption files and produces a translated copy in the same format (or the opposite, if you choose).',
      'Preserves cue numbers, cue order, and timestamps exactly — only the cue text is translated.',
      'Runs translation on our local Ollama model server using a custom captions-tuned model — your captions never leave our infrastructure.',
      'Supports 30+ target languages including major European, Asian, and Middle-Eastern languages.',
    ],
    flowSteps: [
      { title: 'Upload .srt or .vtt', description: 'Drop your existing subtitle file into the uploader.' },
      { title: 'Pick languages', description: 'Auto-detect or pick a source language, then choose a target language.' },
      { title: 'We translate cue text', description: 'Our local AI translates only the caption text — timestamps and ordering stay frozen.' },
      { title: 'Download translated captions', description: 'Get back a clean .srt or .vtt with identical timing and a translated copy of every cue.' },
    ],
    advancedDetails: [
      'Translation runs on our own Ollama server using a captions-tuned derivative of Translate-Gemma (mm-captions-translategemma-12b).',
      'We send only the cue text + a strict JSON schema header to the model and pin the timing back from the original file when reading the response — so even a misbehaving model cannot corrupt your cue timing.',
      'NOTE and STYLE blocks in VTT files are preserved and never sent to the translator.',
      'For long subtitle tracks we batch cues so the model never approaches its context limit.',
    ],
    whyItMatters: [
      'Translating captions manually is error-prone — it is very easy to break timestamp formatting or accidentally reorder cues.',
      'A purpose-built captions translator preserves the file structure that editors and players expect.',
      'Doing translation in-house on a local model keeps creator workflows independent of third-party translation pricing and policies.',
    ],
    useCases: [
      { title: 'Multilingual YouTube channels', description: 'Translate one master English SRT into 5+ languages for the same upload.' },
      { title: 'Online courses', description: 'Reach international students with subtitles in their native language.' },
      { title: 'Documentary / film festivals', description: 'Prepare translation tracks without touching cue timing.' },
      { title: 'News and journalism', description: 'Translate breaking-news caption tracks while keeping precise sync.' },
    ],
    whyMediaManipulator: [
      'Local AI translation — your captions never go to a third-party AI provider.',
      'Timing-safe parsing that pins original cue start/end times back even if the model misbehaves.',
    ],
    privacyNote: privacyNoteFor('ai', 'Only the text of your SRT or VTT file is read: each caption is translated by a language model we run on our own GPU server, and the timings are copied across unchanged.'),
    supportedFormats: {
      supportedInputFormats: ['srt', 'vtt'],
      supportedOutputFormats: ['srt', 'vtt'],
      maxFileNotes: ['Maximum caption file size: 2 MB (real subtitle tracks are usually well under this).'],
      processingNotes: [
        'Translation runs on a locally-hosted Ollama model — no third-party translation API is contacted.',
        'NOTE and STYLE blocks in WebVTT files are preserved as-is.',
      ],
    },
    faq: [
      { question: 'Can I translate an SRT file without breaking timestamps?', answer: 'Yes — that is the whole point of this tool. We parse the cues, translate only the text, and then pin the original timestamps back exactly before writing the output.' },
      { question: 'What subtitle formats are supported?', answer: 'Both SubRip (.srt) and WebVTT (.vtt) are supported. You can keep the output format the same as the input or convert between them.' },
      { question: 'Can I translate captions for YouTube videos?', answer: 'Yes. Generate (or export) an SRT from your video, translate it here, and upload the new SRT as an additional language track on YouTube.' },
      { question: 'Are captions translated with a third-party AI provider?', answer: 'No. The translation runs on our own Ollama-hosted model — your captions never leave our infrastructure.' },
      { question: 'What happens to cue timing?', answer: 'Cue start and end times are preserved exactly — we pin them back from the original file after translation so even a misbehaving model cannot corrupt your timing.' },
    ],
    related: [
      { label: 'SRT Generator', to: '/tools/srt-generator', description: 'Generate a fresh SRT from a video or audio file.' },
      { label: 'Extract Audio from Video', to: '/tools/extract-audio-from-video', description: 'Pull the audio out for review or re-transcription.' },
      { label: 'Stitch Audio to Video', to: '/tools/stitch-audio-to-video', description: 'Add a translated voiceover after translating the captions.' },
      { label: 'Transcode video to HLS', to: '/tools/transcode-to-hls', description: 'Bundle your video for streaming.' },
      { label: 'Transcode video to DASH', to: '/tools/transcode-to-dash', description: 'AV1 / VP9 DASH packaging.' },
    ],
    primaryKeyword: 'caption translator',
    secondaryKeywords: [
      'translate SRT file',
      'translate VTT file',
      'subtitle translator',
      'translate subtitles online',
      'SRT translator',
      'VTT translator',
      'caption translator online',
    ],
  },

  // ----------------------------------------------------------------------- AUDIO WAVEFORM GENERATOR
  {
    slug: 'audio-waveform-generator',
    name: 'Audio Waveform Generator',
    h1: 'Free Audio Waveform Generator',
    tagline:
      'Turn any audio file into a configurable waveform video, waveform image, or both — perfect for podcasts, music previews, and social clips.',
    metaTitle: 'Free Audio Waveform Generator — Video & Image Waveforms | Media Manipulator',
    metaDescription:
      'Generate waveform videos and images from any audio file. Wide 10:1 podcast strips, square social previews, split stereo channels, custom colors, and more.',
    ogTitle: 'Free Audio Waveform Generator',
    ogDescription:
      'Generate waveform videos and images from MP3, WAV, M4A, FLAC, and more. Highly configurable, no signup required.',
    category: 'audio',
    embed: {
      defaultMediaKind: 'audio',
      defaultTask: 'audio_waveform',
      title: 'Generate a waveform from an audio file',
      description:
        'Upload an audio file and pick whether you want a waveform video, a waveform image, or both. Advanced controls let you tune size, colors, render mode, and stereo behavior. The default is a wide 10:1 waveform video, suited to podcasts and music previews.',
    },
    intro:
      'A waveform makes audio visible — a critical asset for podcasts, music previews, social-clip thumbnails, and editing timelines. Media Manipulator renders waveforms using FFmpeg’s showwaves / showwavespic filters, with sensible defaults (a wide 10:1 strip at 1600×160) and a full advanced panel for tuning render mode, color, scale, and stereo splitting.',
    whatItDoes: [
      'Renders animated waveform videos using FFmpeg’s showwaves filter, with point / line / p2p / cline modes.',
      'Renders still waveform images using FFmpeg’s showwavespic filter, perfect for thumbnails and album art.',
      'Supports recommended aspect ratio presets (10:1 wide, 8:1, 6:1, 16:9, 1:1) plus custom width and height.',
      'Optional split-channel rendering so left and right channels are drawn in separate colors.',
    ],
    flowSteps: [
      { title: 'Upload audio', description: 'Drop in any MP3, WAV, M4A, AAC, FLAC, or OGG file.' },
      { title: 'Pick output and size', description: 'Choose waveform video, image, or both — and pick an aspect ratio preset or custom size.' },
      { title: 'Tune the look (optional)', description: 'Adjust render mode, frame rate, colors, scale, and draw mode in the advanced panel.' },
      { title: 'Download', description: 'Save your waveform video, image, or .zip with both.' },
    ],
    advancedDetails: [
      'Render modes correspond directly to FFmpeg’s showwaves modes: point, line, p2p, cline. Each is previewed in the form so you can pick by sight.',
      'You can choose either the output frame rate (rate=) or samples-per-column (n=) — never both, matching FFmpeg’s mutually-exclusive parameter.',
      'Scale options (lin, log, sqrt, cbrt) let you decide how visible quiet sections should be.',
      'When both video and image are requested, we package them into a single .zip — same job system as every other Media Manipulator download.',
    ],
    whyItMatters: [
      'Waveform visuals make audio content shareable — a clip with a moving waveform performs far better on silent-autoplay social feeds than a static thumbnail.',
      'Editors and producers use waveforms as reference assets when arranging timelines or designing album covers.',
      'A well-tuned waveform doubles as a thumbnail, an audiogram, and an audio teaser all at once.',
    ],
    useCases: [
      { title: 'Podcasts', description: 'Make audiograms for social — clip + waveform + captions = best-performing podcast promo format.' },
      { title: 'Music previews', description: 'Generate a square waveform card for Instagram or a wide one for YouTube descriptions.' },
      { title: 'Editing timelines', description: 'Use the still-image waveform as a reference frame inside Premiere or DaVinci Resolve.' },
      { title: 'Voiceover delivery', description: 'Send clients a waveform card alongside the WAV so they can preview at a glance.' },
    ],
    whyMediaManipulator: [
      'Defaults bias toward the most useful shape (wide 10:1) instead of FFmpeg’s 600×240 default.',
      'Advanced FFmpeg controls exposed safely — every setting is validated server-side before being passed to the filter graph.',
      'Output as MP4, PNG, or a ZIP of both — no need to run a second job.',
    ],
    privacyNote: privacyNoteFor('audio', 'Your audio is drawn into a waveform image or video by FFmpeg on our server.'),
    supportedFormats: {
      supportedInputFormats: ['mp3', 'wav', 'm4a', 'aac', 'flac', 'ogg'],
      supportedOutputFormats: ['mp4 (video)', 'webm (video)', 'png (image)', 'webp (image)', 'zip (both)'],
      processingNotes: [
        'Recommended default: 10:1 wide waveform (1600×160) — great for podcasts, music previews, and editing timelines.',
        'When you select "Both", the result is packaged into a single ZIP containing the video and the image.',
      ],
    },
    faq: [
      { question: 'What is an audio waveform?', answer: 'A waveform is a visual representation of an audio signal’s amplitude over time. It is the moving line you see in video editors and on platforms like SoundCloud.' },
      { question: 'Can I create a waveform video from an MP3?', answer: 'Yes. Upload the MP3 (or WAV/M4A/FLAC/OGG/AAC) and the tool renders a waveform video using FFmpeg’s showwaves filter.' },
      { question: 'Can I create a waveform image too?', answer: 'Yes. Set output to "Image" for a still PNG/WebP, or "Both" to receive a ZIP containing the video and the image.' },
      { question: 'What size should I use for a waveform?', answer: 'For most podcast and music workflows the 10:1 wide preset (1600×160) looks best. Use 16:9 or 1:1 if you need a social-friendly shape.' },
      { question: 'What do point, line, p2p, and cline modes mean?', answer: 'These are the FFmpeg showwaves render modes. Point draws a dot per sample, line draws a vertical bar, p2p connects each dot with a line, and cline draws a centered vertical bar. The form previews each one.' },
      { question: 'Can I split left and right audio channels?', answer: 'Yes — enable "Split stereo channels" in advanced settings and pick a different color for each channel.' },
    ],
    related: [
      { label: 'Extract Audio from Video', to: '/tools/extract-audio-from-video', description: 'Pull audio out of a video before generating a waveform.' },
      { label: 'SRT Generator', to: '/tools/srt-generator', description: 'Pair the waveform with captions for social audiograms.' },
      { label: 'Stitch Audio to Video', to: '/tools/stitch-audio-to-video', description: 'Combine your waveform render with another video.' },
    ],
    primaryKeyword: 'audio waveform generator',
    secondaryKeywords: [
      'create waveform from audio',
      'MP3 waveform generator',
      'podcast waveform video',
      'podcast waveform image',
      'sound wave video generator',
      'audio visualizer generator',
      'waveform video maker',
    ],
  },

  // ----------------------------------------------------------------------- EXTRACT AUDIO FROM VIDEO
  {
    slug: 'extract-audio-from-video',
    lastReviewed: '2026-10-29',
    name: 'Extract Audio from Video',
    h1: 'Extract Audio from Video',
    tagline:
      'Save the audio track from any video as a clean MP3, WAV, M4A, AAC, FLAC, or OGG file.',
    metaTitle: 'Extract Audio from Video — MP3, WAV, M4A & More | Media Manipulator',
    metaDescription:
      `Free online tool to extract the audio from any video file (MP4, MOV, MKV, WebM, AVI). Output MP3, WAV, M4A, AAC, FLAC, or OGG. No signup. ${RETENTION_PROMISE}.`,
    ogTitle: 'Extract Audio from Video',
    ogDescription:
      `Save MP4/MOV/MKV/WebM/AVI audio tracks as MP3, WAV, M4A, AAC, FLAC, or OGG. Free, no signup. ${RETENTION_PROMISE}.`,
    category: 'video',
    embed: {
      defaultMediaKind: 'video',
      defaultTask: 'extract_audio',
      defaultExtractAudioFormat: 'mp3',
      title: 'Extract the audio track from a video',
      description:
        'Upload any common video container. Pick MP3 for broad compatibility, WAV for lossless, or M4A/AAC for a compact compressed file. Videos with no audio track return a clear error.',
    },
    intro:
      'Every video container carries its audio as a separate stream, so getting the sound out does not involve the picture at all. This page asks FFmpeg to select the first audio stream, ignore the video, and encode that stream into the format you pick: MP3 for anything that plays music, WAV or FLAC when you want the samples untouched, M4A or AAC for a small file that phones handle natively, or OGG Vorbis. Before it starts, the server checks with ffprobe that an audio stream exists, because FFmpeg would otherwise write an empty file without complaint.',
    whatItDoes: [
      'Selects the first audio stream (-map 0:a:0) from MP4, MOV, M4V, WebM, MKV, AVI and the other common video containers and discards the video (-vn).',
      'Encodes MP3 with libmp3lame at quality 2 (variable bitrate averaging about 190 kbps), WAV as 16-bit PCM, M4A or AAC at 192 kbps, FLAC losslessly, or OGG with libvorbis at quality 5.',
      'Keeps the original sample rate and channel count; nothing is resampled or mixed down.',
      'Refuses a video with no audio stream up front with the message that there is nothing to extract.',
      'Returns a single audio file named after the original with the chosen extension.',
    ],
    flowSteps: [
      { title: 'Upload the video', description: 'Any common container; the file goes straight to our storage bucket and the API picks it up.' },
      { title: 'Choose the audio format', description: 'MP3 is preset. WAV and FLAC are lossless; M4A and AAC are compact; OGG is the open lossy option.' },
      { title: 'ffprobe confirms an audio stream exists', description: 'A silent video stops here with a clear error instead of producing an empty file.' },
      { title: 'FFmpeg encodes the stream', description: 'One command with -map 0:a:0 -vn and the encoder for your format.' },
      { title: 'Download the audio', description: 'The file lives in the job folder until its retention window ends.' },
    ],
    advancedDetails: [
      'The command is ffmpeg -y -i input -map 0:a:0 -vn <encoder args> output (runExtractAudio in specialized_tools.go). -vn means the video stream is never decoded, which is why extraction is fast even on 4K sources.',
      'MP3 uses -c:a libmp3lame -q:a 2, the LAME V2 variable-bitrate setting, which averages around 190 kbps on music and less on speech. WAV uses -c:a pcm_s16le, so a 44.1 kHz stereo source costs about 10.1 MB per minute and a 48 kHz source about 11 MB per minute.',
      'M4A and AAC both use the native FFmpeg AAC encoder with -b:a 192k. FLAC is lossless and typically lands at 50 to 70 percent of the WAV size. OGG uses -c:a libvorbis -q:a 5, roughly 160 kbps.',
      'No -ar or -ac flag is passed, so the output keeps the source sample rate and channel layout; 5.1 surround stays 5.1 in WAV and FLAC, while MP3 will carry at most two channels.',
      'Only stream 0:a:0 is mapped. A file with a commentary track or a second language keeps whichever track is listed first in the container.',
      'Extraction is a specialized mode: the upload is not queued for the automated content analysis that standard conversions receive, and the quality, resize and effect controls of the video converter do not apply.',
    ],
    whyItMatters: [
      'Podcasters, transcribers and editors usually need the sound without the pixels, and the video is often 20 to 50 times larger than the audio inside it.',
      'A correctly tagged MP3 or M4A plays on every phone and in every player without the video decoding that drains batteries.',
      'Lossless WAV or FLAC output is the right input for noise cleaning, vocal separation or a careful transcription.',
    ],
    useCases: [
      { title: 'Audio-only episodes', description: 'Publish the sound of a recorded video interview as a podcast MP3.' },
      { title: 'Transcription prep', description: 'Feed an 18 minute recording to a transcriber as a 25 MB MP3 instead of a 540 MB MP4.' },
      { title: 'Sound design and sampling', description: 'Pull a WAV from a clip to reuse ambience or music in another edit.' },
      { title: 'Lecture notes', description: 'Keep the audio of a class recording for listening on the go.' },
    ],
    whyMediaManipulator: [
      'The encoder settings are stated: LAME V2 for MP3, 192 kbps for AAC, 16-bit PCM for WAV, and the original sample rate throughout.',
      'A silent video is caught by ffprobe before anything runs, so you never download a zero-length file.',
      `One extraction is one operation of your daily allowance: 5 a day without an account by default, 30 with a free account; a refused or failed job is refunded. ${RETENTION_PROMISE}.`,
    ],
    privacyNote:
      `Extraction runs on our own servers as a single FFmpeg command that reads only the first audio stream of your upload; the video frames are never decoded. The uploaded file sits in uploads/<jobId>/ and the audio in outputs/<jobId>/, both registered in the retention ledger and removed when the window ends. ${RETENTION_PROMISE}. Because extraction is a specialized mode, the upload is not run through the automated content analysis that standard conversions receive; it is not transcribed or described, and nothing leaves our hardware.`,
    supportedFormats: {
      supportedInputFormats: ['mp4', 'mov', 'webm', 'mkv', 'avi', 'm4v'],
      supportedOutputFormats: ['mp3', 'wav', 'm4a', 'aac', 'flac', 'ogg'],
      processingNotes: [
        'We extract the first audio stream. Videos without any audio stream return a clear error instead of an empty file.',
      ],
    },
    faq: [
      {
        question: 'Which audio formats can I extract to, and which are lossless?',
        answer:
          'MP3, WAV, M4A, AAC, FLAC and OGG. WAV and FLAC are lossless copies of the decoded track. MP3 (about 190 kbps VBR), M4A and AAC (192 kbps) and OGG (quality 5) are lossy but above the bitrate of most video sound tracks.',
      },
      {
        question: 'How big will the extracted audio be?',
        answer:
          'WAV is about 10.1 MB per minute at 44.1 kHz stereo, or 11 MB at 48 kHz. MP3 at this page setting is about 1.4 MB per minute, M4A and AAC about 1.4 MB per minute at 192 kbps, OGG about 1.2 MB per minute. FLAC usually lands between half and two thirds of the WAV size.',
      },
      {
        question: 'Does extraction change the sample rate or stereo image?',
        answer:
          'No. FFmpeg is run without -ar or -ac, so the output keeps the source sample rate and channel layout. A 48 kHz stereo track stays 48 kHz stereo.',
      },
      {
        question: 'What happens if my video has no audio?',
        answer:
          'The server probes the file first and stops with the message that there is nothing to extract. The operation is refunded, and no empty file is produced.',
      },
      {
        question: 'My video has two audio tracks; which one do I get?',
        answer:
          'The first one in the container, stream 0:a:0. There is no track picker yet. If the one you need is second, remux or re-export the video with that track first.',
      },
      {
        question: 'Is extracting audio free, and how long a video can I upload?',
        answer:
          'Yes. By default a guest can run 5 operations a day on files up to 200 MB and 5 minutes; a free account allows 30 a day, 1 GB and 20 minutes; Premium takes 5 GB and 2 hours. Current limits are listed on the pricing page.',
      },
    ],
    related: [
      { label: 'Transcribe video', to: '/tools/transcribe-video', description: 'Skip the audio file and get the words directly.' },
      { label: 'Clean voice audio', to: '/tools/clean-voice-audio', description: 'Denoise and level the extracted speech.' },
      { label: 'Remove background noise', to: '/tools/remove-background-noise', description: 'Take the hum and hiss out of the extracted track.' },
      { label: 'Remove vocals from song', to: '/tools/remove-vocals-from-song', description: 'Turn the extracted music into an instrumental.' },
      { label: 'Trim video', to: '/tools/video-trimmer', description: 'Cut the video to the part you want before extracting.' },
    ],
    workedExamples: [
      {
        title: 'An 18 minute, 540 MB 720p recording to MP3',
        body:
          'Input: an 18 minute 1280 x 720 MP4 of 540 MB (about 4 Mbps), uploaded with a free account because it exceeds the 200 MB and 5 minute guest defaults. Settings: MP3. The server confirms the stereo 48 kHz AAC track with ffprobe and runs libmp3lame -q:a 2. At roughly 190 kbps that is about 1.4 MB per minute, so the result comes out at about 25 MB, about one twentieth of the upload. Because -vn skips the video entirely, the job is a straight audio decode and encode and is quick; uploading 540 MB takes far longer than extracting from it.',
      },
      {
        title: 'A 4 minute, 95 MB 1080p music video to WAV',
        body:
          'Input: a 4 minute 1920 x 1080 MP4 of 95 MB with a 44.1 kHz stereo AAC track, within the guest caps. Settings: WAV. FFmpeg decodes the AAC once and writes 16-bit PCM with pcm_s16le, keeping 44.1 kHz and two channels. PCM at that rate is 44,100 x 16 x 2 bits per second, about 10.1 MB per minute, so the file comes out at about 40 MB regardless of how loud or busy the music is. Choosing FLAC instead would compress those same samples losslessly to somewhere around 20 to 28 MB depending on the material. The time is a few seconds of audio decoding; the video is never touched.',
      },
    ],
    whenNotToUse:
      'Do not use this page to improve the sound; it copies what is there, and a noisy or distant recording stays noisy. The Clean Voice and Remove Background Noise tools are built for that. Do not expect a WAV to recover quality that the video lost; the source track is almost always lossy AAC, so a WAV is a faithful copy of a compressed signal, not a studio master. If the video has two language tracks and you need the second one, this tool only takes the first. And if what you really want is the words, the transcriber reads the audio and gives you text and captions directly.',
    primaryKeyword: 'extract audio from video',
    secondaryKeywords: [
      'video to MP3',
      'convert video to audio',
      'save audio from video',
      'MP4 to MP3',
      'MOV to WAV',
      'extract audio MP4 online',
    ],
  },

  // ----------------------------------------------------------------------- EXTRACT VIDEO ONLY FROM VIDEO
  {
    slug: 'extract-video-only-from-video',
    name: 'Extract Video Without Audio',
    h1: 'Extract Video Without Audio (Video-Only)',
    tagline:
      'Export a silent / video-only copy with every audio track removed — perfect for silent previews, B-roll, edits, and re-scoring.',
    metaTitle: 'Extract Video Without Audio — Video-Only Export | Media Manipulator',
    metaDescription:
      'Free online tool to export a video-only (silent) copy with every audio track removed. Stream-copies the video where possible — no re-encoding, no quality loss.',
    ogTitle: 'Extract Video Without Audio (Video-Only)',
    ogDescription:
      `Export a video-only (silent) copy of your video with every audio track removed. Free, no signup. ${RETENTION_PROMISE}.`,
    category: 'video',
    embed: {
      defaultMediaKind: 'video',
      defaultTask: 'extract_video_only',
      defaultOutputFormat: 'mp4',
      title: 'Remove audio from a video',
      description:
        'Upload your video and we produce a silent/video-only copy. The video stream is stream-copied wherever possible so there is no re-encode and no quality loss.',
    },
    intro:
      'Sometimes you want the video without the audio — for a silent social-feed preview, a B-roll asset to drop into a new edit, or a re-scoring workflow where you will add fresh music. Media Manipulator strips every audio track and emits a clean video-only file. The video stream is stream-copied wherever possible, so there is no re-encode and no quality loss.',
    whatItDoes: [
      'Removes every audio stream from your video.',
      'Stream-copies the video stream wherever possible — no re-encoding, no quality loss.',
      'Re-encodes to a compatible H.264 baseline only if the destination container requires it.',
      'Returns a silent MP4 (or WebM) you can drop straight into a new edit.',
    ],
    flowSteps: [
      { title: 'Upload your video', description: 'Drop any MP4, MOV, MKV, WebM, AVI, or M4V file.' },
      { title: 'Pick the output container', description: 'MP4 is the safe default. WebM is offered for VP9/AV1 sources.' },
      { title: 'We strip audio', description: 'FFmpeg drops the audio stream and copies the video stream when possible.' },
      { title: 'Download silent video', description: 'Save a clean, audio-free copy of your video.' },
    ],
    advancedDetails: [
      'The default attempt uses `-c:v copy` so no re-encode happens — quality is preserved bit-for-bit on the video stream.',
      'If the destination container rejects the source codec, we fall back to a libx264 + yuv420p re-encode at CRF 20.',
      'No watermarks, no overlay, no scaling — the visual output is identical to the source by default.',
    ],
    whyItMatters: [
      'Silent video is the de-facto autoplay format on most social platforms.',
      'Removing audio is a privacy step too — it strips embedded voice/conversation content from screen recordings before you share them.',
      'Editors often want a clean video-only file for re-scoring or for syncing to a different audio recording.',
    ],
    useCases: [
      { title: 'Silent social previews', description: 'Make a clean autoplay clip for Instagram, X, LinkedIn, or TikTok.' },
      { title: 'Re-scoring projects', description: 'Strip the original audio before adding music or voiceover.' },
      { title: 'Privacy-sensitive shares', description: 'Remove background conversation captured during a screen recording.' },
      { title: 'B-roll prep', description: 'Drop an audio-free clip into a multi-camera or B-roll-driven edit.' },
    ],
    whyMediaManipulator: [
      'Stream copy where possible — preserves the original video quality.',
      'Clear, fast, no signup, no watermarks.',
      `Free. ${RETENTION_PROMISE}.`,
    ],
    privacyNote: privacyNoteFor('video', 'Your video is copied without its audio track by FFmpeg on our server.'),
    supportedFormats: {
      supportedInputFormats: ['mp4', 'mov', 'webm', 'mkv', 'avi', 'm4v'],
      supportedOutputFormats: ['mp4', 'webm'],
      processingNotes: [
        'Video stream is copied without re-encoding wherever the destination container supports it.',
        'Input videos that have no audio stream succeed normally and return a re-packaged copy.',
      ],
    },
    faq: [
      { question: 'How do I remove audio from a video?', answer: 'Upload your video and click "Remove audio from video". The tool emits a video-only copy in your chosen container.' },
      { question: 'Will the video quality change?', answer: 'No, in the default case. We stream-copy the video stream so the output is bit-for-bit identical on the video side. We only re-encode if the destination container needs it.' },
      { question: 'Can I make an MP4 silent?', answer: 'Yes — MP4 is the default output container and the most common use case.' },
      { question: 'Is the original video modified?', answer: `No. The original upload stays untouched. We produce a new file and keep or delete the upload according to the retention rule: ${RETENTION_PROMISE}.` },
      { question: 'What if my video has no audio?', answer: 'No problem — the tool succeeds normally and returns a clean re-packaged copy.' },
    ],
    related: [
      { label: 'Remove audio from video', to: '/tools/remove-audio-from-video', description: 'The consumer-friendly mute / remove-sound page.' },
      { label: 'Extract Audio from Video', to: '/tools/extract-audio-from-video', description: 'Pull the audio track out as MP3, WAV, etc.' },
      { label: 'Stitch Audio to Video', to: '/tools/stitch-audio-to-video', description: 'Add a new soundtrack to your silent video.' },
      { label: 'Compress video', to: '/tools/compress-video', description: 'Shrink the silent video.' },
      { label: 'Extract Frames from Video', to: '/tools/extract-frames-from-video', description: 'Pull still images out of the silent video.' },
    ],
    primaryKeyword: 'extract video without audio',
    secondaryKeywords: [
      'video only extractor',
      'silent video maker',
      'B-roll without sound',
      'delete audio track from video',
      'strip audio from MP4',
    ],
  },

  // ----------------------------------------------------------------------- EXTRACT FRAMES FROM VIDEO
  {
    slug: 'extract-frames-from-video',
    name: 'Extract Frames from Video',
    h1: 'Extract Frames from Video',
    tagline:
      'Pull still image frames out of any video — every N seconds, at a target frame rate, or at specific timestamps — and download them as a ZIP.',
    metaTitle: 'Extract Frames from Video — Free Frame Extractor | Media Manipulator',
    metaDescription:
      'Free online tool to extract still images from any video. Choose every N seconds, frames per second, or specific timestamps. Output as a ZIP of JPG, PNG, or WebP frames.',
    ogTitle: 'Extract Frames from Video',
    ogDescription:
      'Pull still image frames out of MP4, MOV, MKV, WebM, AVI, and M4V. Download as a ZIP of JPG, PNG, or WebP frames.',
    category: 'video',
    embed: {
      defaultMediaKind: 'video',
      defaultTask: 'extract_frames',
      title: 'Extract frames from a video',
      description:
        'Upload a video, pick a sampling mode (every N seconds, at a frame rate, or at specific timestamps), and download a ZIP of still frames.',
    },
    intro:
      'Frame extraction turns a video back into a sequence of still images — useful for thumbnails, reference shots, design mockups, ML datasets, and animation/storyboard previews. Media Manipulator lets you sample frames every N seconds, at a target frame rate, or at specific timestamps, and packages the resulting images into a single ZIP for download.',
    whatItDoes: [
      'Extracts still frames as JPG, PNG, or WebP images.',
      'Supports three sampling modes: every N seconds, target frames per second, or specific timestamps.',
      'Packages the frames into a single ZIP for one-click download.',
      'Enforces a max-frame guardrail so runs stay fast and predictable.',
    ],
    flowSteps: [
      { title: 'Upload your video', description: 'Drop any MP4, MOV, MKV, WebM, AVI, or M4V file.' },
      { title: 'Pick a sampling mode', description: 'Every N seconds, a target FPS, or a comma-separated list of timestamps.' },
      { title: 'Choose image format', description: 'JPG for compact thumbnails, PNG for lossless stills, WebP for smaller modern files.' },
      { title: 'Download ZIP', description: 'All extracted frames are packaged into a single .zip you can extract anywhere.' },
    ],
    advancedDetails: [
      'Every-N-seconds and FPS modes use FFmpeg’s fps filter to sample evenly across the timeline.',
      'Timestamp mode runs one FFmpeg invocation per requested timestamp so per-frame failures (out-of-bounds requests, etc.) surface clearly.',
      'The max-frame guardrail defaults to 300 and caps at 1000 — keeps jobs fast and avoids runaway extractions.',
    ],
    whyItMatters: [
      'Frame extraction is the simplest way to grab thumbnails or reference frames from existing video assets.',
      'Designers and animators use sampled frames as drawing reference and as B-roll for storyboards.',
      'ML practitioners use them to build classification or detection datasets without needing a custom pipeline.',
    ],
    useCases: [
      { title: 'Thumbnails and previews', description: 'Pick a single frame to use as a YouTube/Vimeo thumbnail.' },
      { title: 'Design references', description: 'Sample a sequence of frames from gameplay or animation as drawing reference.' },
      { title: 'Storyboards', description: 'Generate a sequence of key frames for a storyboard pitch.' },
      { title: 'ML datasets', description: 'Build small image datasets from a small number of videos quickly.' },
    ],
    whyMediaManipulator: [
      'Three sampling modes cover almost every real-world need — interval, FPS, or specific timestamps.',
      'ZIP output keeps the download to one click no matter how many frames you grabbed.',
      'Server-side FFmpeg means consistent output regardless of browser or codec support.',
    ],
    privacyNote: privacyNoteFor('video', 'Frames are taken from your video at the rate you pick by FFmpeg on our server and returned as a ZIP of images.'),
    supportedFormats: {
      supportedInputFormats: ['mp4', 'mov', 'webm', 'mkv', 'avi', 'm4v'],
      supportedOutputFormats: ['zip (containing jpg/png/webp frames)'],
      processingNotes: [
        'Default max-frame cap is 300 — raise it up to 1000 in the form if you really need more.',
        'Timestamp mode accepts a comma-separated list of seconds (e.g. "1, 5.5, 12.25, 30").',
      ],
    },
    faq: [
      { question: 'How do I extract frames from a video?', answer: 'Upload your video, pick a sampling mode (every N seconds is the default), choose an image format, and click "Extract frames". The result is a ZIP of still images.' },
      { question: 'Can I export one frame every few seconds?', answer: 'Yes — that is the default mode. Set "Seconds between frames" to whatever interval you want.' },
      { question: 'What image formats are supported?', answer: 'JPG (compact, ideal for thumbnails), PNG (lossless), and WebP (smaller modern files).' },
      { question: 'Why does the tool return a ZIP file?', answer: 'Even short videos can produce dozens of frames. Returning a single ZIP keeps the download to one click and avoids fighting the browser over multiple file downloads.' },
      { question: 'Why is there a max-frame limit?', answer: 'The limit prevents accidental runaway jobs (e.g. extracting tens of thousands of frames from a long video). The default is 300 and the absolute cap is 1000.' },
    ],
    related: [
      { label: 'Extract Audio from Video', to: '/tools/extract-audio-from-video', description: 'Pull the audio out of the same video.' },
      { label: 'SRT Generator', to: '/tools/srt-generator', description: 'Transcribe the same video to .srt subtitles.' },
      { label: 'Remove Audio from Video', to: '/tools/extract-video-only-from-video', description: 'Strip audio to keep a silent copy of the video.' },
    ],
    primaryKeyword: 'extract frames from video',
    secondaryKeywords: [
      'video to images',
      'video frame extractor',
      'capture still images from video',
      'export frames from video',
      'video to JPG online',
      'extract every Nth frame',
    ],
  },

  // ----------------------------------------------------------------------- STITCH AUDIO TO VIDEO
  {
    slug: 'stitch-audio-to-video',
    name: 'Add Audio to Video',
    h1: 'Add Audio to Video',
    tagline:
      'Combine a base video with up to three additional audio files — voiceovers, music, narration — and download a new MP4.',
    metaTitle: 'Add Audio to Video — Voiceover, Music, Replace, Mix | Media Manipulator',
    metaDescription:
      'Free online tool to add voiceovers, music, or narration to a video, or replace the original audio entirely. Per-track volume and offset controls, MP4 output.',
    ogTitle: 'Add Audio to Video',
    ogDescription:
      'Add voiceover, music, narration, or replace original audio. Per-track volume and offset controls, MP4 output, no signup required.',
    category: 'video',
    embed: {
      defaultMediaKind: 'video',
      defaultTask: 'stitch_audio_to_video',
      title: 'Add or replace the audio track of a video',
      description:
        'Upload a base video, add one to three audio files, set per-track volume and offset, and pick "mix" or "replace". We return an MP4 with everything combined.',
    },
    intro:
      'Combining a base video with one or more additional audio files is one of the most common editing tasks — adding a voiceover, dropping in a backing track, narrating a screen recording, or replacing the original audio entirely. Media Manipulator gives you per-track volume and offset controls, a mix-vs-replace toggle, and an MP4 output that drops cleanly into any player.',
    whatItDoes: [
      'Combines a base video with up to three additional audio tracks.',
      'Per-track controls: volume (0–4×), start offset in seconds, optional loop-to-video-length.',
      'Top-level mode toggle: "mix" keeps the original audio, "replace" drops it.',
      'Output is always MP4 with AAC audio at 192 kbps — the safe everywhere default.',
    ],
    flowSteps: [
      { title: 'Upload the base video', description: 'Drop any MP4, MOV, MKV, WebM, AVI, or M4V file.' },
      { title: 'Add audio tracks', description: 'Add up to three audio files (voiceover, music, narration) with per-track settings.' },
      { title: 'Pick mix or replace', description: 'Keep the original audio and mix in the new tracks, or drop the original and use only the new audio.' },
      { title: 'Download the new MP4', description: 'We stitch on our server and return a clean MP4.' },
    ],
    advancedDetails: [
      'The filter graph is built programmatically: per-track adelay + volume nodes, then a single amix to combine them.',
      'The video stream is stream-copied wherever possible — only the audio is re-encoded (to AAC at 192 kbps).',
      'Looping is implemented with `-stream_loop -1` on the audio input so short backing tracks extend to the video duration cleanly.',
      'Output duration is "trim to video duration" by default — uncheck if you want the output to extend to the longest input.',
    ],
    whyItMatters: [
      'Voiceover, music, and narration are the most common audio additions to short-form video.',
      'Per-track volume and offset controls let you craft a real mix instead of a single drop-in track.',
      'Doing this in-browser would be slow and unreliable — server-side FFmpeg is fast and correct.',
    ],
    useCases: [
      { title: 'Creator videos', description: 'Add a music bed under a talking-head segment, or replace the room audio with a clean voiceover.' },
      { title: 'Tutorials', description: 'Drop a narration track on top of a screen recording.' },
      { title: 'Social clips', description: 'Add a trending track at a specific offset to a 15-second cut.' },
      { title: 'Family / personal videos', description: 'Add background music to a vacation montage.' },
    ],
    whyMediaManipulator: [
      'Per-track volume and offset controls — not just a single drop-in audio file.',
      'Stream-copies video where possible — preserves the original video quality.',
      `Free, no signup, server-side FFmpeg. ${RETENTION_PROMISE}.`,
    ],
    privacyNote: privacyNoteFor('video', 'Your video and the audio file you add are joined into one MP4 by FFmpeg on our server.'),
    supportedFormats: {
      supportedInputFormats: ['mp4', 'mov', 'webm', 'mkv', 'avi', 'm4v (video)', 'mp3', 'wav', 'm4a', 'aac', 'flac', 'ogg (audio)'],
      supportedOutputFormats: ['mp4'],
      maxFileNotes: ['Maximum 3 added audio tracks per job.'],
      processingNotes: [
        'Video stream is stream-copied where possible — only audio is re-encoded (to AAC 192 kbps).',
        'Loop checkbox extends short backing tracks to the video length.',
      ],
    },
    faq: [
      { question: 'Can I add music to a video?', answer: 'Yes — add the music file as an audio track, set its volume, and leave the mode on "mix" to keep the original audio underneath.' },
      { question: 'Can I add a voiceover and keep the original audio?', answer: 'Yes — keep mode on "mix", add the voiceover, and lower the original audio by setting a low volume on additional tracks if you want the voiceover to sit on top.' },
      { question: 'Can I replace the original audio track?', answer: 'Yes — set mode to "replace" and the original audio is dropped. Only the added tracks are mixed into the output.' },
      { question: 'What happens if the audio is longer than the video?', answer: 'By default we trim to the video duration. Uncheck "Trim to video duration" if you want the output to extend to the longest input.' },
      { question: 'Can I adjust the volume of added audio?', answer: 'Yes — each added track has its own volume scalar (0–4×) and a start offset in seconds.' },
    ],
    related: [
      { label: 'Extract Audio from Video', to: '/tools/extract-audio-from-video', description: 'Pull audio out of one video to reuse in another.' },
      { label: 'Remove Audio from Video', to: '/tools/extract-video-only-from-video', description: 'Strip audio to prepare a clean re-scoring base.' },
      { label: 'Audio Waveform Generator', to: '/tools/audio-waveform-generator', description: 'Make a visual companion for your audio track.' },
    ],
    primaryKeyword: 'add audio to video',
    secondaryKeywords: [
      'add music to video',
      'add voiceover to video',
      'combine audio and video',
      'replace audio in video',
      'mix audio with video',
      'add narration to video',
    ],
  },

  // ----------------------------------------------------------------------- AI FRAME INTERPOLATION
  {
    slug: 'ai-frame-interpolation',
    name: 'AI Frame Interpolation',
    h1: 'AI Frame Interpolation Tool',
    tagline:
      'Increase a video’s frame rate to 48, 60, or 120 FPS with AI-generated in-between frames for smoother motion.',
    metaTitle:
      'AI Frame Interpolation Tool — Convert Video to 60 or 120 FPS | Media Manipulator',
    metaDescription:
      'Free online AI frame interpolation tool. Use RIFE to turn 24/30fps video into smoother 48, 60, or 120 FPS MP4. No third-party API — runs on our own GPU.',
    ogTitle: 'AI Frame Interpolation Tool — Smooth Video to 60 or 120 FPS',
    ogDescription:
      'Upload a video, pick a target FPS, and download an MP4 with AI-generated in-between frames for smoother motion.',
    category: 'ai',
    embed: {
      defaultMediaKind: 'video',
      defaultTask: 'ai_frame_interpolation',
      defaultOutputFormat: 'mp4',
      preset: {
        kind: 'video',
        aiOperation: 'frame_interpolation',
        openAiPanel: true,
        targetFps: 60,
        fpsPickerOnTop: true,
      },
      title: 'AI frame interpolation',
      description:
        'Upload a short video. AI Frame Interpolation is already selected: choose a target FPS (48, 60, or 120) and the tool synthesizes new in-between frames and returns an MP4.',
    },
    intro:
      'AI Frame Interpolation increases a video’s frame rate by generating new in-between frames with a neural network (RIFE) instead of simply duplicating or blending existing frames. The result is noticeably smoother motion — 24/30fps footage starts to feel like 60fps, and 60fps clips can be lifted to a high-refresh-friendly 120fps. The processing runs on our own GPU server, not a third-party API, and the output is an MP4 you can drop straight into any player.',
    whatItDoes: [
      'Synthesizes new in-between frames with RIFE (rife-ncnn-vulkan) rather than duplicating or blending existing frames.',
      'Targets 48, 60, or 120 FPS with quality and max-processing-height presets you control.',
      'Runs on our own GPU server — no third-party AI provider sees your file.',
      'Returns an MP4 with H.264 + AAC (the audio track from the source is preserved by default).',
      'Limits long or very tall sources up front so a single job can’t hog the GPU.',
    ],
    flowSteps: [
      {
        title: 'Upload a video',
        description: 'Drop in a short MP4, MOV, WebM, MKV, or AVI clip.',
      },
      {
        title: 'Open AI Video Tools',
        description: 'In the video form, scroll to "AI Video Tools" and select AI Frame Interpolation.',
      },
      {
        title: 'Pick target FPS and quality',
        description: 'Choose 48, 60, or 120 FPS and an encode quality / max processing height.',
      },
      {
        title: 'Run interpolation',
        description: 'We extract frames, run RIFE on our GPU, and re-encode an MP4 at the new FPS.',
      },
      {
        title: 'Download MP4',
        description: 'Save the interpolated clip and preview it next to the original.',
      },
    ],
    advancedDetails: [
      'Frame extraction uses ffmpeg with vsync=0 so the input frame count matches the source FPS exactly.',
      'RIFE runs through rife-ncnn-vulkan with the chosen model directory (rife-v4.6 is the recommended default; rife-v4 and rife-v2.3 are also available for compatibility).',
      'After interpolation, ffmpeg re-encodes to H.264 (libx264) + AAC at the chosen quality (CRF 26/20/17 for low/medium/high).',
      'Source audio is remapped onto the new encode and the output uses +faststart so the file streams cleanly over HTTP.',
      'A max processing height (default 720p) caps GPU memory pressure on tall sources; the original aspect ratio is preserved with -2:min(ih,N) scaling.',
    ],
    whyItMatters: [
      'Motion smoothness is one of the biggest perceptual differences between consumer and broadcast-quality video.',
      'Modern displays and many social platforms favor 60fps and 120fps content for smoother playback.',
      'Older or low-frame-rate footage can be brought up a notch without re-shooting the source material.',
    ],
    useCases: [
      {
        title: '30fps → 60fps for the web',
        description: 'Lift talking-head, screencast, or vlog footage into the smoother 60fps range typical for modern social and video sites.',
      },
      {
        title: '60fps → 120fps for high-refresh playback',
        description: 'Prepare footage for 120Hz/144Hz displays or downstream slow-motion editing.',
      },
      {
        title: 'Smoother short clips',
        description: 'Make a 5–10 second cut look noticeably smoother before sharing.',
      },
      {
        title: 'Restoring older clips',
        description: 'Pull legacy 24/30fps clips into 48 or 60fps for a more modern playback feel.',
      },
      {
        title: 'Editing prep',
        description: 'Generate a denser frame timeline before applying slow motion or motion graphics in a downstream editor.',
      },
    ],
    whyMediaManipulator: [
      'Runs on our own GPU infrastructure — no third-party AI provider receives the file.',
      'Uses rife-ncnn-vulkan, a portable Vulkan binary, instead of a heavy PyTorch stack — fewer dependencies, faster cold starts.',
      `Free, no signup, ${RETENTION_PROMISE}.`,
    ],
    privacyNote: privacyNoteFor('ai', 'New in-between frames are generated for your video by RIFE on our own GPU server.'),
    supportedFormats: {
      supportedInputFormats: ['mp4', 'mov', 'webm', 'mkv', 'avi', 'm4v'],
      supportedOutputFormats: ['mp4'],
      maxFileNotes: [
        'Maximum source duration and processing height are bounded by AI_FRAME_INTERPOLATION_MAX_DURATION_SECONDS and AI_FRAME_INTERPOLATION_MAX_HEIGHT on the server.',
      ],
      processingNotes: [
        'AI interpolation is GPU-heavy. Lower the max processing height for faster turnaround on tall sources.',
        'Output is MP4 (H.264 + AAC) in v1. Audio is preserved from the source by default.',
      ],
    },
    faq: [
      {
        question: 'Does AI frame interpolation actually improve video quality?',
        answer:
          'It improves motion smoothness, not resolution or sharpness. If your source is already 60fps it will feel smoother at 120fps. If your source is 24/30fps it will feel closer to 60fps. It does not magically recover real motion that the camera never captured.',
      },
      {
        question: 'Is AI frame interpolation the same as just increasing FPS?',
        answer:
          'No. Basic FPS conversion typically duplicates, drops, or blends existing frames. AI interpolation synthesizes brand-new in-between frames based on estimated motion, which usually looks much more natural than duplication.',
      },
      {
        question: 'Can I convert 30fps to 60fps?',
        answer:
          'Yes — 30fps to 60fps is one of the most common targets and a good first test.',
      },
      {
        question: 'Can I convert 60fps to 120fps?',
        answer:
          'Yes. 120fps doubles the GPU work versus 60fps and produces a larger file, so try a short clip first.',
      },
      {
        question: 'Why can frame interpolation create artifacts?',
        answer:
          'Motion estimation has to guess what happens between two real frames. Fast motion, hands, hair, wheels, occlusions, and scene cuts are inherently harder — the synthesized frame can warp, ghost, or smear in those regions.',
      },
      {
        question: 'What output format does the tool create?',
        answer:
          'MP4 with H.264 video and AAC audio. v1 only emits MP4 because that container plays back everywhere and supports the higher frame rates this tool produces.',
      },
      {
        question: 'Is 60fps always better than 30fps?',
        answer:
          'For UI screencasts, sports, gameplay, and motion-heavy clips, 60fps usually feels more fluid. For cinematic content, 24/30fps is often the intended look. Pick the FPS that matches how you want the result to feel.',
      },
      {
        question: 'Is AI frame interpolation better than FFmpeg minterpolate?',
        answer:
          'AI interpolation (RIFE) generally produces cleaner motion than FFmpeg’s built-in minterpolate filter, especially for non-rigid motion. minterpolate is faster, simpler, and still useful for quick fallback conversions.',
      },
      {
        question: 'Why do scene cuts sometimes look strange after interpolation?',
        answer:
          'The model assumes adjacent frames belong to the same motion sequence. A hard scene cut breaks that assumption, so the synthesized frame at the boundary can show a brief warp. Clean cuts and short clips help.',
      },
    ],
    related: [
      {
        label: 'Video converter',
        to: '/tools/video-converter',
        description: 'Convert MP4, WebM, MOV, AVI, MKV, and more.',
      },
      {
        label: 'Compress video',
        to: '/tools/compress-video',
        description: 'Shrink video file size after interpolation.',
      },
      {
        label: 'Convert video to animated GIF',
        to: '/tools/convert-video-to-animated-gif',
        description: 'Turn short clips into shareable animated GIFs.',
      },
      {
        label: 'Extract frames from video',
        to: '/tools/extract-frames-from-video',
        description: 'Pull individual frames out as PNGs.',
      },
      {
        label: 'AI Frame Interpolation tutorial',
        to: '/tutorials/ai-frame-interpolation',
        description: 'Learn how AI interpolation works and when to use it.',
      },
      // Hidden during AdSense review — re-enable when the blog returns.
      // {
      //   label: 'Video compression guide',
      //   to: '/blog/video/video-compression-guide',
      //   description: 'Codec and bitrate deep dive for after interpolation.',
      // },
    ],
    primaryKeyword: 'AI frame interpolation',
    secondaryKeywords: [
      'video frame interpolation',
      'increase video FPS',
      'convert video to 60fps',
      'convert video to 120fps',
      'smooth video motion',
      'AI video enhancer',
      'FPS converter',
      'RIFE frame interpolation',
      'smoother video online',
      'video motion smoothing',
      'online frame interpolation tool',
      'AI FPS converter',
      'video FPS enhancer',
    ],
  },
  {
    slug: 'ai-video-restoration',
    lastReviewed: '2026-10-29',
    name: 'AI Video Restoration',
    h1: 'AI Video Restoration Tool',
    tagline:
      'Upscale and restore a short video snippet with up to six AI models — Real-ESRGAN, SwinIR, HAT, BasicVSR++, RVRT, and VRT — and compare every result side by side.',
    metaTitle:
      'AI Video Restoration Tool — Compare 6 Upscaling Models Online | Media Manipulator',
    metaDescription:
      'Free AI video restoration tool. Run a short clip through Real-ESRGAN, SwinIR, HAT, BasicVSR++, RVRT, and VRT super-resolution models on our own GPU and download every result in one package.',
    ogTitle: 'AI Video Restoration — Compare Real-ESRGAN, SwinIR, HAT, BasicVSR++, RVRT & VRT',
    ogDescription:
      'Pick a snippet from your video, select restoration models, and download one package with every enhanced version plus the original for A/B comparison.',
    category: 'ai',
    embed: {
      defaultMediaKind: 'video',
      defaultTask: 'ai_video_restoration',
      defaultOutputFormat: 'mp4',
      title: 'AI video restoration',
      description:
        'Upload a video, drag-select a short snippet (10 seconds or less works best), pick the restoration models you want to compare, and download one package with every enhanced result.',
    },
    intro:
      'Video restoration models disagree with each other. A GAN upscaler such as Real-ESRGAN gives you crisp single frames that can shimmer in motion; a video transformer such as VRT keeps the sequence stable but may soften detail. The only honest way to choose is to run the same footage through all of them and look. This page does exactly that on a snippet of up to 15 seconds: it extracts the frames, runs your choice of six models on our own GPU, stitches each result back into an MP4 at the source frame rate with the original audio, and packages everything, including the untouched snippet, into one archive for side-by-side comparison. Every number below comes from the pipeline as it runs today.',
    whatItDoes: [
      'Trims the snippet you select (0.5 to 15 seconds, at most 450 frames at your frame rate) frame-accurately with its audio.',
      'Runs any combination of Real-ESRGAN, SwinIR, HAT, BasicVSR++, RVRT and VRT; the first three enhance frame by frame, the last three restore the sequence as a whole.',
      'Chooses 4x for sources at or below 540p and 2x above that, since every model runs its native 4x network and the 2x result is a Lanczos downscale at stitch time.',
      'Stitches each result with libx264 at CRF 16 at the exact source frame-rate fraction and re-attaches the audio.',
      'Packages original/clip.mp4, one folder per model, optional enhanced PNG frames for the frame-by-frame models, manifest.json and README.txt into one tar.gz.',
      'Carries on when a model fails: its folder gets FAILED.txt, the manifest records the reason, and every other result is still delivered.',
    ],
    flowSteps: [
      { title: 'Upload a video', description: 'Up to 1920 x 1080; long sources are fine because only the snippet is processed.' },
      { title: 'Select a snippet', description: 'Drag the handles to pick up to 15 seconds; 10 seconds or less is recommended and the picker warns above that.' },
      { title: 'Choose models and whether to include frames', description: 'Any of the six; the picker shows a per-model time estimate from the server published seconds-per-frame figures.' },
      { title: 'Watch the stages', description: 'Download, probe, extract clip, extract frames, then each model from fastest to slowest, then packaging.' },
      { title: 'Compare and download', description: 'Play each model MP4 next to the original in the viewer, then fetch the archive while its 6 hour link lasts.' },
    ],
    advancedDetails: [
      'The reference clip is cut with ffmpeg -ss START -i source -t WINDOW -c:v libx264 -crf 10 -preset medium -pix_fmt yuv420p -c:a aac, then frames are extracted with -vsync 0 into numbered PNGs; if the count exceeds 450 the surplus frames are dropped.',
      'Real-ESRGAN runs realesrgan-ncnn-vulkan with the realesrgan-x4plus model, scale 4 and 256 px tiles. SwinIR uses the 003_realSR_BSRGAN SwinIR-L x4 GAN weights and HAT uses Real_HAT_GAN_SRx4, both through tiled inference (320 px tiles, 32 px overlap) so 1080p frames fit in memory.',
      'BasicVSR++ runs the REDS4 c64n7 generator through mmagic in windows of 16 frames; RVRT (001_RVRT_videosr_bi_REDS_30frames) and VRT (001_VRT_videosr_bi_REDS_6frames) run through their KAIR test scripts with temporal tiles of 30 and 12 frames and 128 x 128 spatial tiles.',
      'Stitching is uniform: ffmpeg -framerate FPS_FRACTION -i frames/%06d.png [-i clip.mp4 -map 0:v -map 1:a -c:a aac] [-vf scale=iw/2:ih/2:flags=lanczos] -c:v libx264 -crf 16 -preset slow -pix_fmt yuv420p -movflags +faststart -shortest. The frame-rate fraction, for example 30000/1001, is taken verbatim from ffprobe so the audio stays in sync.',
      'Models run in a fixed order, Real-ESRGAN, BasicVSR++, SwinIR, RVRT, HAT, VRT, under a GPU scheduler lease with VRAM budgets of 3, 11, 9, 12, 10 and 14 GB respectively, one restoration job at a time server-wide and a 75 minute timeout per model.',
      'The published per-frame estimates the picker multiplies by your frame count are 0.8 s (Real-ESRGAN), 1.0 s (BasicVSR++), 3.0 s (RVRT), 3.5 s (SwinIR), 5.0 s (HAT) and 7.0 s (VRT); they are server-side defaults that can change, not measurements of your clip.',
      'Explicit 4x is refused for sources taller than 1080p because the output would exceed 4K; auto mode picks 2x for 541p to 1080p and 4x at or below 540p. Included frames are the native 4x PNGs even on the 2x path, so a 1080p source yields 7680 x 4320 frames.',
    ],
    whyItMatters: [
      'No single restoration model wins on all footage, and still-frame comparisons hide the flicker that only playback reveals.',
      'A 10 second snippet through every model costs minutes of GPU time and tells you which model deserves a full-length run elsewhere.',
      'Digitised tapes, early digital camera clips and compressed social exports each degrade differently and respond to different model families.',
    ],
    useCases: [
      { title: 'Old family videos', description: 'See which model recovers faces and fabric on a 480p tape transfer before restoring the whole reel.' },
      { title: 'Archive footage', description: 'Test 4x on 360p and 480p material and judge the 4K-class output on your own monitor.' },
      { title: 'Model selection before a long render', description: 'Pick the model for an hours-long job from a representative 10 second test.' },
      { title: 'Compressed downloads', description: 'Compare GAN sharpening with transformer stability on blocky social media exports.' },
      { title: 'Temporal stability checks', description: 'Play the per-model MP4s side by side to spot shimmer and flicker that still frames hide.' },
    ],
    whyMediaManipulator: [
      'Six research-grade models behind one upload, with the weights, tile sizes and stitch command named on this page rather than hidden behind a brand name.',
      'Everything runs on our own GPU; your footage never goes to a third-party AI provider, and nothing is used for training.',
      `A restoration spends one AI job from your daily AI allowance, which is 3 a day without an account by default and 10 with a free account, and is limited to 2 starts an hour per session; a failed job is refunded. ${RETENTION_PROMISE}.`,
    ],
    privacyNote:
      `Your upload goes from the browser to our storage bucket and is downloaded to our own GPU server, where FFmpeg cuts the snippet and the six models run as local processes; no outside AI provider is involved and nothing is used for training. Only the selected snippet is decoded into frames; the rest of the source is never processed. The source object, the working frames, the per-model MP4s kept for the comparison viewer and the results archive are all registered in the retention ledger and deleted when the window ends, and the archive link expires after 6 hours. ${RETENTION_PROMISE}. Restoration jobs do not run the automated content analysis that standard conversions receive.`,
    supportedFormats: {
      supportedInputFormats: ['mp4', 'mov', 'webm', 'mkv', 'avi', 'm4v'],
      supportedOutputFormats: ['mp4', 'png'],
      maxFileNotes: [
        'Snippets are capped at 15 seconds or 450 frames (whichever is smaller at your video’s frame rate); 10 seconds or less is recommended.',
        'Source resolution is capped at 1920×1080 — restoration targets low-resolution footage, and 4x output of 1080p is already 4K+.',
      ],
      processingNotes: [
        'Models run from fastest to slowest (Real-ESRGAN first, VRT last) so partial results exist early.',
        'A failed model never sinks the job — its folder contains FAILED.txt and the other results still download.',
        'Download links stay valid for 6 hours; the archive can be large when enhanced frames are included.',
      ],
    },
    faq: [
      {
        question: 'Which AI video upscaling model is best?',
        answer:
          'It depends on the footage, which is why this tool exists. GAN upscalers like Real-ESRGAN and HAT produce crisp frames that can shimmer in motion; sequence models like BasicVSR++, RVRT and VRT use neighbouring frames for stability and can look softer. Run your own snippet through them and judge in motion.',
      },
      {
        question: 'Why is the clip limited to 15 seconds and 450 frames?',
        answer:
          'Restoration is expensive per frame: the published estimate for VRT alone is 7 seconds a frame at 4x. The frame cap is checked against your real frame rate, so a 60 fps source is limited to 7.5 seconds. A short snippet is enough to judge quality before a longer restoration elsewhere.',
      },
      {
        question: 'How does the 2x versus 4x choice work?',
        answer:
          'Auto picks 4x for sources at or below 540p and 2x above that. Every model runs its native 4x network regardless; on the 2x path the stitch halves the frames with a Lanczos filter. Explicit 4x is refused above 1080p because the output would exceed 4K.',
      },
      {
        question: 'Does the restored video keep my audio and frame rate?',
        answer:
          'Yes. The snippet is cut with its audio, and every stitch uses the exact frame-rate fraction from ffprobe (for example 30000/1001) and re-attaches that audio as AAC, so all results line up for A/B playback.',
      },
      {
        question: 'What does the results archive contain, and how large is it?',
        answer:
          'original/clip.mp4, a folder per model with its MP4 (and, for Real-ESRGAN, SwinIR and HAT with frames included, every enhanced PNG at native 4x), manifest.json with timings and dimensions, and README.txt. With frames on, a 10 second clip adds hundreds of large PNGs per model, so expect gigabytes.',
      },
      {
        question: 'What happens if one model fails or times out?',
        answer:
          'The job continues. That model folder holds FAILED.txt with the reason, manifest.json records it, and every other selected model still ships in the archive. Only when all selected models fail does the job fail.',
      },
      {
        question: 'How long does a restoration run take?',
        answer:
          'Frames times the per-model estimate, summed over the models you picked, since they run one after another: 0.8, 1.0, 3.0, 3.5, 5.0 and 7.0 seconds per frame for Real-ESRGAN, BasicVSR++, RVRT, SwinIR, HAT and VRT. A 300 frame clip through all six is roughly 100 minutes; through Real-ESRGAN alone about 4.',
      },
      {
        question: 'How many restorations can I run, and does it cost an AI job?',
        answer:
          'Starting a restoration spends one AI job: by default 3 a day without an account, 10 with a free account, 100 on Premium and 200 on Pro, plus a limit of 2 starts an hour per session. A job that fails outright is refunded. See the pricing page for the live numbers.',
      },
    ],
    related: [
      { label: 'Trim video', to: '/tools/video-trimmer', description: 'Cut the snippet you want to restore before uploading.' },
      { label: 'AI image restoration', to: '/tools/ai-image-restoration', description: 'The same model families for a single photo or frame.' },
      { label: 'Compress video', to: '/tools/compress-video', description: 'Shrink a restored 4K result for sharing.' },
      { label: 'Transcode to HLS', to: '/tools/transcode-to-hls', description: 'Package a restored clip for adaptive streaming.' },
      { label: 'Transcribe video', to: '/tools/transcribe-video', description: 'Add captions to the restored footage.' },
      { label: 'Darkroom', to: '/tools/content-studio', description: 'Edit the restored snippet into a longer piece.' },
    ],
    workedExamples: [
      {
        title: 'An 8 second 640 x 480 home video through all six models',
        body:
          'Input: a 640 x 480 MP4 at 29.97 fps from a digitised tape, with audio. Settings: an 8 second snippet, all six models, enhanced frames included, scale auto. The pipeline cuts an 8 second reference clip and extracts 240 frames (8 x 29.97, rounded). At 480p the auto rule picks 4x, so every model writes 2560 x 1920 frames and the stitched MP4s are 2560 x 1920 at 30000/1001 fps with the original audio. The picker estimate is the frame count times the published seconds per frame: about 3.2 minutes for Real-ESRGAN, 4 minutes for BasicVSR++, 12 for RVRT, 14 for SwinIR, 20 for HAT and 28 for VRT, about 81 minutes in total because models run one after another. Including frames adds 3 x 240 PNGs of 2560 x 1920 to the archive, which is why the download is measured in gigabytes rather than megabytes.',
      },
      {
        title: 'A 10 second 1080p clip at auto scale with Real-ESRGAN and BasicVSR++',
        body:
          'Input: a 1920 x 1080 30 fps MP4 of 90 MB, the largest source resolution the tool accepts. Settings: a 10 second snippet, Real-ESRGAN and BasicVSR++, frames excluded, scale auto. Extraction yields 300 frames, within the 450 cap (at 60 fps the same cap would limit the snippet to 7.5 seconds). Above 540p auto picks 2x, so each model still runs its native 4x network, producing 7680 x 4320 frames, and the stitch applies scale=iw/2:ih/2:flags=lanczos to deliver 3840 x 2160 MP4s at CRF 16. The published estimates give about 4 minutes for Real-ESRGAN (0.8 s x 300) and 5 minutes for BasicVSR++ (1.0 s x 300), so the job finishes in well under the 75 minute per-model timeout and the archive holds two 4K MP4s, the original clip, manifest.json and README.txt.',
      },
    ],
    whenNotToUse:
      'Do not use this page to restore a whole film; it is a comparison tool capped at 15 seconds and 450 frames, and the archive for even that can be gigabytes. Do not expect it to invent what was never recorded: severe motion blur, extreme compression blocking and very dark footage improve but do not become pristine. Sources above 1920 x 1080 are refused, because restoration targets low-resolution material and 2x of 1080p is already 4K. If your clip only needs a smaller file, a format change or a cut, the compressor, converter and trimmer do that in seconds without a GPU.',
    primaryKeyword: 'AI video restoration',
    secondaryKeywords: [
      'AI video upscaler',
      'video super resolution online',
      'restore old videos with AI',
      'Real-ESRGAN video upscaling',
      'SwinIR video restoration',
      'HAT super resolution',
      'BasicVSR++ online',
      'RVRT video restoration',
      'VRT video super resolution',
      'compare AI upscaling models',
      'enhance low resolution video',
      'AI video enhancement tool',
      '4x video upscaling online',
    ],
  },
  {
    slug: 'ai-image-restoration',
    lastReviewed: '2026-10-29',
    name: 'AI Image Restoration & Upscaling',
    h1: 'AI Image Restoration & Upscaling Tool',
    tagline:
      'Clean up, upscale, and restore a photo with up to eight AI models — fidelity-preserving pre-clean (FBCNN, SCUNet, NAFNet), general upscalers (Real-ESRGAN, SwinIR, HAT), and face enhancement (GFPGAN, CodeFormer) — and compare every result against the original.',
    metaTitle:
      'AI Image Restoration & Upscaler — Compare 8 Models Online | Media Manipulator',
    metaDescription:
      'Free AI photo restoration and upscaling. Remove JPEG artifacts, denoise, and deblur, then upscale to 4K/8K with Real-ESRGAN, SwinIR, or HAT and enhance faces with GFPGAN/CodeFormer — all on our own GPU, compared side by side.',
    ogTitle: 'AI Image Restoration & Upscaling — Pre-clean, Upscale & Enhance Faces',
    ogDescription:
      'Upload one image, optionally crop, optionally pre-clean, then run multiple upscaling and face models and compare every result inline against the original.',
    category: 'ai',
    embed: {
      defaultMediaKind: 'image',
      defaultTask: 'image_converter',
      title: 'AI image restoration & upscaling',
      description:
        'Upload an image, optionally crop to a region, optionally pre-clean it, pick the upscaling and face-enhancement models you want to compare, and download one package with every result.',
    },
    intro:
      'AI Image Restoration runs one photo through a configurable pipeline of up to eight models and shows every result next to the original. A fidelity-preserving pre-clean stage (FBCNN for JPEG artifacts, SCUNet for noise, NAFNet for motion blur) removes degradation without inventing detail; general upscalers (Real-ESRGAN, SwinIR, HAT) then enlarge 2x or 4x; and optional face enhancement (GFPGAN, CodeFormer) reconstructs faces. Pre-clean is non-generative: it filters the signal that is there. Face enhancement is generative: it synthesises plausible detail and must not be treated as a faithful recovery of the source. Every model runs on our own GPU server.',
    whatItDoes: [
      'Lets you drag-select a crop so the pixel budget and GPU time go to the region you care about; the crop is applied server-side on the auto-oriented original, so no quality is lost in the browser.',
      'Optionally pre-cleans first, always in the order FBCNN, SCUNet, NAFNet, each model working on the previous one\'s output; the cleaned image becomes the base every later model starts from.',
      'Runs any combination of Real-ESRGAN, SwinIR and HAT at 2x or 4x. All three are native x4 networks; a 2x result is the x4 output downscaled to 50 percent with a Lanczos filter.',
      'Optionally runs GFPGAN v1.4 and, where it is enabled on the server, CodeFormer with a fidelity weight, on the source and, with Chain on, on each upscaler\'s result as well.',
      'Packages the prepared original, every output PNG, a manifest.json and a README into one .tar.gz, and shows an inline comparison grid while the archive is served from the job.',
      'Records a failed model as a failed entry with a user-safe reason and still packages every result that succeeded.',
    ],
    flowSteps: [
      { title: 'Upload an image', description: 'PNG, JPEG, WebP, TIFF or BMP up to 12,000 pixels on each side; old, small and over-compressed photos are the target.' },
      { title: 'Crop or keep the whole frame', description: 'Drag a region (a face, a plate, a sign) or leave the crop off to restore everything.' },
      { title: 'Choose pre-clean, upscalers, faces, scale', description: 'Tick the models you want; the picker shows how many outputs the selection will produce out of the 12 allowed.' },
      { title: 'Watch the stages', description: 'The job queues for the single restoration slot, prepares the image, then runs each unit with its own progress and failure badge.' },
      { title: 'Compare and download', description: 'Each result sits beside the original in the grid; download the archive when you have decided which pipeline won.' },
    ],
    advancedDetails: [
      'The prepare stage runs ImageMagick -auto-orient to a normalised PNG, reads its dimensions, rejects anything over 12,000 x 12,000, converts your normalised crop rectangle to whole pixels and writes working_source.png. That file is also saved as original.png in the results, so what you compare against is exactly what the models received.',
      'Auto scale picks 4x when the crop is 540 pixels tall or less and 2x otherwise. Whatever the scale, the output is checked against a budget of 67,108,864 pixels (about 64 megapixels): a 6,000 x 4,000 whole image at 2x is 96 megapixels and is refused with a message telling you to choose 2x or a smaller crop.',
      'Real-ESRGAN runs the realesrgan-x4plus network through realesrgan-ncnn-vulkan with 256-pixel tiles. SwinIR uses the 003_realSR_BSRGAN SwinIR-L x4 GAN weights and HAT the Real_HAT_GAN_SRx4 weights, both through the same per-frame script as AI Video Restoration with 320-pixel tiles and a 32-pixel overlap, so large crops never exceed GPU memory.',
      'Pre-clean weights are fbcnn_color.pth, scunet_color_real_psnr.pth (the PSNR-trained real-noise model, not the GAN variant that invents texture) and NAFNet-GoPro-width64.pth (motion deblur, not defocus). They run in 512-pixel tiles with a 32-pixel overlap and never change dimensions. FBCNN predicts the JPEG quality factor blindly unless you set one from 1 to 100; a lower number assumes heavier compression.',
      'GFPGAN uses the clean v1.4 architecture with background up-sampling disabled, so outside the faces the image is plainly resized by the scale factor rather than model-enhanced; that keeps the comparison honest. CodeFormer takes a fidelity weight w from 0 to 1 (default 0.7): lower is prettier, higher stays closer to the input. CodeFormer ships under a non-commercial licence and is behind a server flag that is off by default.',
      'Chain re-runs each face model at 1x on every upscaler\'s output in addition to the source, so the output count is pre-clean + general + face + face x general. The server caps a job at 12 outputs, runs one restoration job at a time, and gives each model 1,800 seconds before marking it timed out.',
      'The server estimates run time per model from its own seconds-per-megapixel defaults: FBCNN 3, SCUNet 8, NAFNet 6, Real-ESRGAN 2, SwinIR 12, HAT 18, GFPGAN 6, CodeFormer 8. These feed the progress weights and the UI estimate; they are tuning values, not a guarantee.',
      'Results are not uploaded to object storage: the .tar.gz and the result PNGs stay in the job\'s output folder and are served from the job for the retention window.',
    ],
    whyItMatters: [
      'No single model wins on every photo: artifact removal, denoising, upscaling and face reconstruction each fix different damage, and the right order depends on how the image was degraded.',
      'Running several models on one upload and seeing them side by side answers the question "which one, and at what scale?" before you commit to a larger batch.',
      'The non-generative versus generative distinction matters: a pre-cleaned image is a filtered copy of the evidence, a face-enhanced one is a plausible reconstruction, and the page labels which is which.',
    ],
    useCases: [
      { title: 'Restoring old or scanned photos', description: 'Pre-clean scanner noise and compression, then upscale and, if you choose, reconstruct faces.' },
      { title: 'Enhancing low-resolution stills', description: 'Crop to the region of interest, remove artifacts and upscale; chain face enhancement for clarity, never as identification evidence.' },
      { title: 'Fixing compressed downloads', description: 'Heavily recompressed social exports respond well to FBCNN then SCUNet, followed by a GAN upscaler.' },
      { title: 'Comparing upscalers before a batch', description: 'Run one representative image through Real-ESRGAN, SwinIR and HAT to choose the model for a larger set.' },
      { title: 'Spending the budget on one region', description: 'Drag-select just a face or a sign so the 64-megapixel budget and the GPU time go where it counts.' },
    ],
    whyMediaManipulator: [
      'Eight research models behind one upload, with no notebooks, CUDA setup or weight files to manage.',
      'Every model runs on a GPU server we operate; the image is not sent to a third-party AI service.',
      'The page keeps the distinction honest: pre-clean outputs carry a fidelity note, face outputs a generative note, and the prepared original is always in the grid.',
    ],
    privacyNote:
      `Your image is saved in its job folder, auto-oriented and cropped by ImageMagick into a working PNG, and processed by the selected models on our own GPU. When the job ends the upload folder and the working tree are deleted; what remains with the job is the prepared original, each result PNG, the manifest and the packaged .tar.gz, served from the job for download and for the comparison grid. Face-model outputs are labelled as generative reconstructions in that manifest. No third-party AI provider receives the image. ${RETENTION_PROMISE}.`,
    supportedFormats: {
      supportedInputFormats: ['png', 'jpg', 'jpeg', 'webp', 'tiff', 'bmp'],
      supportedOutputFormats: ['png'],
      maxFileNotes: [
        'Output is capped by a pixel budget (~64 megapixels), comfortably past 8K — if a crop and scale would exceed it, choose 2x or a smaller crop.',
        'Pre-clean models never change dimensions (1x); only the general upscalers change resolution.',
      ],
      processingNotes: [
        'Pre-clean always runs first in a fixed order (FBCNN → SCUNet → NAFNet); the cleaned image becomes the base for every other model.',
        'A failed model never sinks the job — its entry shows the reason and the other results still download.',
        'Face enhancement is generative reconstruction — use it for clarity and leads, not identification evidence.',
      ],
    },
    faq: [
      {
        question: 'What is the difference between pre-clean and the upscaling or face models?',
        answer:
          'Pre-clean models (FBCNN, SCUNet, NAFNet) are non-generative: they remove compression artifacts, noise and motion blur by filtering the existing signal at 1x. Upscalers add resolution, and the face models (GFPGAN, CodeFormer) are generative, synthesising plausible facial detail. A pre-clean output is a faithful filtered image; a face output is a reconstruction.',
      },
      {
        question: 'Can an enhanced face be used as identification evidence?',
        answer:
          'No. GFPGAN and CodeFormer produce plausible faces from a learned prior; they do not recover the true face. The manifest marks every face output with a generative note for exactly this reason. Use them for visual clarity and leads only.',
      },
      {
        question: 'Why do the pre-clean models run in a fixed order whatever I tick?',
        answer:
          'Compression artifacts have to come off before denoising, otherwise the denoiser treats blocking as signal, and deblurring works best on the cleanest input, so the server always runs FBCNN, then SCUNet, then NAFNet, each on the previous result. If one of them fails, the next continues from the last successful step.',
      },
      {
        question: 'How does Auto decide between 2x and 4x, and what is the size limit?',
        answer:
          'Auto picks 4x when the crop is at most 540 pixels tall and 2x otherwise. The output is then checked against a budget of about 64 megapixels (67,108,864 pixels); a request over it is refused with the megapixel count and a suggestion to choose 2x or a smaller crop. Sources over 12,000 pixels on either side are rejected before that.',
      },
      {
        question: 'What does Chain do to the number of outputs?',
        answer:
          'With Chain on, each face model also runs at 1x on every upscaler\'s result, so outputs = pre-clean + general + face + face x general. Two upscalers and two face models with chaining is 2 + 2 + 4 = 8 outputs before any pre-clean; the server allows 12 per job.',
      },
      {
        question: 'What happens if one image model fails or times out?',
        answer:
          'The job carries on. The unit is marked failed with a user-safe reason (for example a timeout after 1,800 seconds suggesting a smaller crop or 2x), the manifest records it, and every other result is still packaged and shown. Only when every selected model fails does the job fail, and then the AI job is refunded.',
      },
      {
        question: 'Why is CodeFormer greyed out?',
        answer:
          'CodeFormer is licensed for non-commercial use, so it sits behind a server flag that is off by default; capabilities then report it as currently disabled. GFPGAN and the three pre-clean models have permissive licences and are available whenever their weights are installed.',
      },
      {
        question: 'How many restorations can I run, and is it free?',
        answer:
          'Starting a restoration spends one AI job: 3 per day as a guest, 10 with a free account, 100 on Premium and 200 on Pro by default, regardless of how many models you tick in that job. There is also a dedicated limit of 6 starts per session per hour. The upload cap is 200 MB for guests and 1 GB with a free account; /pricing shows the current numbers.',
      },
    ],
    related: [
      { label: 'AI video restoration', to: '/tools/ai-video-restoration', description: 'The moving-image sibling: the same upscalers on a short clip.' },
      { label: 'AI image upscaler', to: '/tools/ai-image-upscaler', description: 'A single Real-ESRGAN pass when you only need a bigger image.' },
      { label: 'Remove background', to: '/tools/remove-background-from-image', description: 'Cut out the subject after restoring it.' },
      { label: 'Compress image', to: '/tools/compress-image', description: 'Shrink the restored PNG for sharing.' },
      { label: 'Image resizer', to: '/tools/image-resizer', description: 'Resize the restored image to exact dimensions.' },
      { label: 'Remove EXIF metadata', to: '/tools/remove-exif-metadata', description: 'Strip metadata from the result before posting it.' },
    ],
    workedExamples: [
      {
        title: 'A 1,200 x 800 JPEG (about 350 KB), whole frame, auto scale, FBCNN + Real-ESRGAN + GFPGAN',
        body: 'The crop is the full 0.96-megapixel frame and its height of 800 pixels is over 540, so auto scale resolves to 2x. FBCNN runs first at 1x and its output becomes the working source. Real-ESRGAN upscales that to 4,800 x 3,200 with realesrgan-x4plus, then ImageMagick resizes it to 50 percent with Lanczos for a 2,400 x 1,600 PNG. GFPGAN runs on the pre-cleaned source at upscale 2, giving another 2,400 x 1,600 PNG with the faces reconstructed and the rest plainly resized. That is three outputs out of the 12 allowed. By the server\'s own per-megapixel estimates the model time is about 0.96 x (3 + 2 + 6), around 11 seconds, plus a few seconds of preparation and packaging; waiting for the single restoration slot can add more. One job spends one AI job.',
      },
      {
        title: 'A 300 x 400 face crop from a 640 x 480 still, pre-clean, three upscalers, GFPGAN with Chain',
        body: 'The crop is 0.12 megapixels and 400 pixels tall, so auto scale picks 4x and every upscaled result is 1,200 x 1,600 (1.92 megapixels), far inside the 64-megapixel budget. With FBCNN and SCUNet pre-clean, Real-ESRGAN, SwinIR and HAT, and GFPGAN chained, the job produces 2 + 3 + 1 + 1 x 3 = 9 outputs: two pre-clean steps, three upscales, GFPGAN on the cleaned source, and GFPGAN on each upscaled result at 1x. The pre-clean and upscale passes on 0.12 megapixels are each a few seconds by the server\'s estimates, while the three chained face passes run on the 1.92-megapixel results and take proportionally longer. Each face output carries a generative note in the manifest, because what you see in those faces is reconstruction, not recovery.',
      },
    ],
    whenNotToUse:
      'Do not use face enhancement for identification: GFPGAN and CodeFormer draw plausible faces from a learned prior, so a reconstructed face is a lead at most and never proof of who was in the picture. Skip the tool for images that are already large and sharp, where a 2x pass mostly adds GAN texture, and for photos larger than 12,000 pixels on a side, which are refused. If you only need a bigger copy of a clean image without pre-clean, face models or a comparison grid, the AI Image Upscaler is cheaper in time. And if your damage is defocus blur rather than motion blur, NAFNet\'s GoPro weights are the wrong model for it.',
    primaryKeyword: 'AI image restoration',
    secondaryKeywords: [
      'AI image upscaler',
      'restore old photo AI',
      'enhance low resolution image',
      'upscale image to 4k',
      'upscale image to 8k',
      'AI photo restoration online',
      'fix blurry photo AI',
      'enhance face in photo',
      'CCTV image enhancement',
      'remove jpeg artifacts AI',
      'denoise image AI',
      'deblur image AI',
    ],
  },
  {
    slug: 'ai-document-scan',
    lastReviewed: '2026-10-29',
    name: 'AI Document Scan',
    h1: 'AI Document Scan — Scanned Pages & Handwriting to Searchable PDF / Word',
    tagline:
      'Turn scanned documents and handwritten field notes into a searchable, multi-page PDF and an editable Word document — printed pages get a faithful Tesseract text layer, handwriting is transcribed by a vision AI with uncertainty marked, never fabricated.',
    metaTitle: 'AI Document Scan — Scanned Pages & Handwriting to PDF/Word | Media Manipulator',
    metaDescription:
      'Free AI document scanning: convert scanned images to a searchable PDF and image-to-Word OCR, plus transcribe handwritten notes to text. Reorder pages, mix printed and handwriting, all on our own GPU — verbatim, with uncertainty marked.',
    ogTitle: 'AI Document Scan — Searchable PDF + Word from Scans & Handwriting',
    ogDescription:
      'Upload one or more scanned pages — printed or handwritten — reorder them, and get a searchable PDF and an editable DOCX. Printed pages stay faithful; handwriting is transcribed verbatim with [illegible]/[?] markers preserved.',
    category: 'ai',
    embed: {
      defaultMediaKind: 'image',
      defaultTask: 'image_converter',
      title: 'AI document scan',
      description:
        'Add one or more scanned page images (printed documents or handwritten notes), reorder them if needed, choose a content mode and outputs, and get a searchable PDF plus an optional Word document.',
    },
    intro:
      'AI Document Scan turns one or more photographed or scanned pages into a searchable, multi-page PDF and, if you ask for it, an editable Word document. It treats two kinds of page differently and tells you which is which. Printed or typed pages go through OCRmyPDF and Tesseract: the output page is your scan, untouched, with an invisible text layer underneath so you can search, select and copy. Handwritten pages are read by a vision-language model running on our own GPU, which transcribes the writing word for word, marks what it cannot read as [illegible] and wraps a doubtful word as [?: best guess], and is told never to complete, correct or tidy anything. A single job can mix both kinds, page by page, in the order you set, and the result names the engine and the confidence for every page.',
    whatItDoes: [
      'Accepts up to 50 page images per job (PNG, JPEG, WebP, TIFF, BMP or HEIC, 25 MB each by default), normalises each to an upright PNG, and lets you drag them into reading order first.',
      'In Auto mode asks the vision model one question per page (printed or handwritten?) and routes the page accordingly; Printed and Handwriting modes force the answer.',
      'Builds a PDF/A in which every printed page is the original scan plus a Tesseract text layer, and every handwritten page is the scan plus an invisible machine-transcription layer placed line by line, with a visible footer saying so.',
      'Optionally builds a Word document: printed pages reconstructed as headings, lists and tables by PaddleOCR-VL (or Docling), handwritten pages as the verbatim transcription under a bold verify-against-the-scan note, rendered by Pandoc.',
      'Reports, per page, the engine used, a confidence of high, medium or low, and the number of uncertainty markers, so you know where to look.',
      'Can run a verification pass that re-reads only the flagged tokens, an independent second opinion that flags disagreements as [?: vlm | other], and a separately labelled AI summary, when the server has those engines enabled.',
    ],
    flowSteps: [
      {
        title: 'Add your pages',
        description: 'Drop in one page image per file, printed or handwritten or a mix, and drag them into order.',
      },
      {
        title: 'Choose mode and outputs',
        description: 'Auto, Printed or Handwriting; PDF always, Word optionally; the Tesseract language for printed pages; deskew and auto-rotate for printed OCR.',
      },
      {
        title: 'Prepare and read',
        description: 'Pages are auto-oriented and, for handwriting, upscaled 2x with Real-ESRGAN before the model reads them; printed pages wait for Tesseract in the PDF step.',
      },
      {
        title: 'Build the files',
        description: 'OCRmyPDF and reportlab make the per-page PDFs, pikepdf merges them; the Word document is assembled from Markdown by Pandoc.',
      },
      {
        title: 'Review and download',
        description: 'A viewer opens on the PDF; download it, the Word file if requested, and the manifest that records each page\'s engine and confidence.',
      },
    ],
    advancedDetails: [
      'Printed pages: the normalised PNG is wrapped losslessly with img2pdf, then OCRmyPDF runs Tesseract with your language code(s), deskew and rotate_pages when ticked, output_type pdfa and force_ocr, and writes the text layer under the image. If OCRmyPDF fails on a page the image-only page is kept, so the PDF is still complete.',
      'Handwritten pages: the model is qwen3-vl (8B, instruct, q8_0 quantisation) served by Ollama at temperature 0.1, prompted to transcribe verbatim, keep line breaks, mark [illegible] and [?: guess], note marks such as (arrow) or (circled), and return JSON with the full text and one bounding box per line.',
      'The handwriting PDF page is drawn with reportlab at the image\'s pixel size: the scan is the visible page, each transcribed line is placed at its bounding box in text render mode 3 (searchable, never drawn) in Helvetica sized to the line height between 6 and 48 points, with a full-page invisible block as fallback when no boxes came back, and a grey 8-point footer reading "Machine transcription, verify against original".',
      'Confidence is computed, not guessed: high when a page has no markers, medium when fewer than 15 percent of its lines carry one, low otherwise. The verify pass (on by default) sends the page and the draft back to the model with instructions to resolve only marked tokens and change nothing else; if it fails the draft is kept.',
      'Pre-cleaning for handwriting is realesrgan-x4plus at scale 2 on the Vulkan GPU, on by default for Auto and Handwriting and off for Printed; it is best effort and the originals are kept if it fails. The Word document is built from GitHub-flavoured Markdown by Pandoc; the optional summary uses a separate text model and is written to its own file with an AI-generated label.',
      'One document job runs at a time on the server by default, each model call has a 40-minute ceiling, and the uploads and the working folder are deleted the moment the job ends; only the results folder (PDF, DOCX, manifest.json, README.txt) stays for the retention window.',
    ],
    whyItMatters: [
      'A photo of a page is not a document until it can be searched and quoted. The PDF adds that without touching the pixels, so the scan remains the authority.',
      'Handwriting recognition that guesses confidently is worse than none. Explicit [illegible] and [?: guess] markers, a per-page confidence and a visible label make the transcription usable as a draft and never mistakable for the original.',
      'Printed and handwritten pages need different engines. Routing each page to the right one, inside one ordered job, is what makes a notebook with a printed form and handwritten answers come out as a single file.',
    ],
    useCases: [
      {
        title: 'Searchable paperwork',
        description: 'Scanned contracts, receipts and forms become one PDF/A you can search and copy from, page images untouched.',
      },
      {
        title: 'Field and lab notebooks',
        description: 'Handwritten notes become a searchable PDF and a Word draft with every uncertain word marked for you to check.',
      },
      {
        title: 'Image to Word',
        description: 'A printed page photographed with a phone becomes an editable .docx with its headings, lists and tables reconstructed.',
      },
      {
        title: 'Mixed documents',
        description: 'A printed questionnaire with handwritten answers goes through both engines and comes back as a single ordered file.',
      },
      {
        title: 'Archives',
        description: 'Old typed letters and minutes gain a text layer for indexing while the scan stays exactly as it was.',
      },
    ],
    whyMediaManipulator: [
      'The printed PDF is faithful by construction: OCRmyPDF places text under an untouched page image and outputs PDF/A, nothing is redrawn.',
      'Handwriting is verbatim with evidence: the prompt forbids invention, uncertainty is marked in the text, confidence is counted from those marks, and the page says it is a machine transcription.',
      'Every engine is ours: Tesseract on CPU, qwen3-vl and the text model through Ollama, PaddleOCR-VL and Real-ESRGAN on our GPUs. No page goes to a third-party AI service.',
    ],
    privacyNote:
      `Your page images are saved to uploads/<jobId>/src/ and normalised copies to a working folder; handwritten pages are sent to the qwen3-vl model served by Ollama on our own GPU, printed pages are read by Tesseract on the CPU, and the per-page transcription drafts are kept as JSON in that working folder while the job runs. When the job ends, both the uploads and the working folder are deleted immediately; what remains is the results folder in outputs/<jobId>/ with the PDF, the Word file if requested, the manifest (per-page engine, confidence and marker counts) and a README, and that folder is removed when the retention window ends. ${RETENTION_PROMISE}. The transcribed text lives inside the PDF text layer and the DOCX you download. Nothing is sent to a third-party AI provider and nothing is used for training.`,
    supportedFormats: {
      supportedInputFormats: ['png', 'jpg', 'jpeg', 'webp', 'tiff', 'bmp', 'heic'],
      supportedOutputFormats: ['pdf', 'docx'],
      maxFileNotes: [
        'Add up to many pages per job; each page image has an individual size cap (~25 MB).',
        'A searchable PDF is always produced; the editable Word document is optional.',
      ],
      processingNotes: [
        'Printed pages use deterministic OCR (OCRmyPDF + Tesseract) for a faithful, searchable text layer.',
        'Handwriting is transcribed verbatim by a vision AI with [illegible]/[?] markers preserved — it is a machine transcription, not the authoritative page.',
        'The Word document and any AI summary are reconstructions — verify them against the original scan.',
      ],
    },
    faq: [
      {
        question: 'What is the difference between the PDF and the Word document?',
        answer:
          'The PDF is your scan with a searchable text layer: a Tesseract layer under a printed page, an invisible machine transcription under a handwritten one, in both cases with the original image as the visible page. The Word document is a separate reconstruction: printed pages as headings, lists and tables produced by PaddleOCR-VL or Docling, handwritten pages as the verbatim transcription under a bold note telling you to verify it. Treat the PDF image as the authority and the DOCX as a draft.',
      },
      {
        question: 'How reliable is the handwriting transcription?',
        answer:
          'It is a careful machine reading, not a certified transcript. The model is instructed to copy exactly what is written, to mark anything unreadable as [illegible] and any doubtful word as [?: best guess], and never to invent or correct. Each page gets a confidence (high with no markers, medium under 15 percent of lines marked, low above) and a marker count, and the PDF page carries a visible machine-transcription footer. Read the flagged words against the scan.',
      },
      {
        question: 'Can I mix printed pages and handwritten pages?',
        answer:
          'Yes. In Auto mode the vision model is asked, for every page, whether it is primarily printed or handwritten, and the page goes to Tesseract or to the handwriting model accordingly. The manifest records the answer per page, and the final PDF and Word file keep the order you set before starting.',
      },
      {
        question: 'Which languages does printed OCR support?',
        answer:
          'Tesseract language codes, joined with a plus sign for mixed pages (for example eng+fra). The codes the server offers are listed in the form; English is installed by default and others appear as they are added. Handwriting is read by a vision model and does not use these codes.',
      },
      {
        question: 'What are the limits per job?',
        answer:
          'By default up to 50 page images per job (each image is one page, so 50 is also the page limit in practice), 25 MB per image, one running job at a time per server (others wait in the queue), and a 40-minute ceiling per model stage. Each job spends one AI job: 3 a day without an account, 10 with a free account, 100 with Premium and 200 with Pro, with the unit refunded when a job fails. Live numbers are on the pricing page.',
      },
      {
        question: 'Why does my handwriting PDF have a footer, and can I remove it?',
        answer:
          'Every handwritten page carries a small grey "Machine transcription, verify against original" line, and the Word section has a bold equivalent, because a searchable copy of handwriting can be mistaken for a verified one. They are part of the output by design and cannot be switched off. Printed pages, whose layer is deterministic Tesseract output, carry no stamp.',
      },
      {
        question: 'Do my pages leave your servers?',
        answer:
          'No. Tesseract runs on the CPU, the handwriting and classification model runs through Ollama on our GPU, and the structure engine and upscaler run on a second GPU in the same machine. The uploads and working files are deleted as soon as the job finishes.',
      },
    ],
    related: [
      {
        label: 'Image to PDF',
        to: '/tools/image-to-pdf',
        description: 'Bind page images into a PDF without a text layer, as an everyday job.',
      },
      {
        label: 'PDF to JPG',
        to: '/tools/pdf-to-jpg',
        description: 'Render an existing PDF to page images you can feed into the scan.',
      },
      {
        label: 'AI image restoration',
        to: '/tools/ai-image-restoration',
        description: 'Repair a faded or blurry scan before transcribing it.',
      },
      {
        label: 'Remove EXIF metadata',
        to: '/tools/remove-exif-metadata',
        description: 'Strip location and device tags from phone photos of documents.',
      },
      {
        label: 'Redact text in an image',
        to: '/tools/redact-text-in-image',
        description: 'Black out names or numbers on a page before you share the scan.',
      },
    ],
    workedExamples: [
      {
        title: 'Three printed A4 pages at 300 dpi',
        body:
          'Three 2480 x 3508 JPEG scans in Printed mode, PDF only, language eng, deskew and auto-rotate on. No model is involved: each page is wrapped by img2pdf, then OCRmyPDF runs Tesseract and writes an invisible text layer, outputs PDF/A, and pikepdf merges the three into document.pdf. The text layer adds only kilobytes per page, so the PDF is roughly the size of the three page images (a straightened page is re-rendered, an untouched one is embedded as is). The job spends one AI job (refunded if it fails) and its time is Tesseract on the CPU, page after page, plus any wait in the queue, since one document job runs at a time by default.',
      },
      {
        title: 'Two handwritten pages from a phone, with Word',
        body:
          'Two 4032 x 3024 phone photos of notebook pages in Auto mode with PDF and DOCX. Prepare auto-orients both to PNG and, because the mode is not Printed, upscales them 2x with realesrgan-x4plus to 8064 x 6048. Classify asks qwen3-vl one question per page, recognise returns the transcription with a bounding box per line, and verify re-reads only the flagged tokens. If a page has 30 lines and 2 of them carry [?: ...] markers, 2 / 30 is under 15 percent and the page is marked medium confidence with illegibleCount 2. The PDF pages are the processed images with invisible Helvetica lines at those boxes and the footer stamp; the Word file holds the verbatim text under the bold verify note. The time is three sequential vision-model passes per page on our GPU; nothing is run elsewhere.',
      },
    ],
    whenNotToUse:
      'Do not use this when you need the text to be authoritative without checking it: handwriting output is a machine reading with marked gaps, and the Word document and summary are reconstructions, so verify them against the scan before quoting them. It is not a PDF-to-PDF OCR tool: inputs are page images, so render an existing PDF to images first, and it is not a translator. If you only need the pages bound into a PDF with no text layer, the plain image-to-PDF tool does that as an everyday job instead of an AI job, which keeps the guest allowance of three AI jobs a day for work that needs a model.',
    primaryKeyword: 'scanned image to searchable PDF',
    secondaryKeywords: [
      'convert scanned document to PDF',
      'image to Word OCR',
      'handwriting to text',
      'transcribe handwritten notes to Word',
      'handwritten notes to PDF',
      'OCR notebook pages',
      'convert handwriting to editable document',
      'searchable PDF from scan',
      'scan to Word online',
      'handwriting OCR online',
    ],
  },
  // Catalog expansion (2026-10-28): converter features and format pairs that
  // were only reachable from the home page. Defined in content/toolPagesCatalog.ts.
  ...CATALOG_TOOL_PAGES,
  // MM78 voices.
  ...VOICE_TOOL_PAGES,
];

/**
 * Every tool page. MM84: `aliasOf` is stamped here from content/toolAliases.ts
 * (the one place the alias map lives) rather than repeated in each entry.
 */
export const TOOL_PAGES: ToolPageContent[] = TOOL_PAGE_ENTRIES.map((tool) => {
  const aliasOf = aliasTargetOf(tool.slug);
  return aliasOf ? { ...tool, aliasOf } : tool;
});

/** The pages that render in full: every tool page that is not an alias. */
export const PRIMARY_TOOL_PAGES: ToolPageContent[] = TOOL_PAGES.filter((tool) => !tool.aliasOf);

export const TOOL_PAGE_MAP: Record<string, ToolPageContent> = TOOL_PAGES.reduce(
  (acc, tool) => {
    acc[tool.slug] = tool;
    return acc;
  },
  {} as Record<string, ToolPageContent>,
);

export const getToolBySlug = (slug: string): ToolPageContent | undefined =>
  TOOL_PAGE_MAP[slug];

export const TOOL_CATEGORIES: Array<{
  id: ToolPageContent['category'];
  label: string;
  description: string;
}> = [
  {
    id: 'image',
    label: 'Image tools',
    description: 'Convert, resize, crop, and clean up image files.',
  },
  {
    id: 'video',
    label: 'Video tools',
    description: 'Convert, compress, and turn videos into GIFs.',
  },
  {
    id: 'audio',
    label: 'Audio tools',
    description: 'Convert, compress, and isolate audio.',
  },
  {
    id: 'ai',
    label: 'AI tools',
    description: 'Transcription, summaries, and other AI-powered media tools.',
  },
  {
    id: 'motion',
    label: 'SVG animation',
    description: 'Animate SVG on a keyframe timeline and export it as SVG, Lottie, code or GIF.',
  },
  {
    id: 'metadata',
    label: 'Metadata & privacy tools',
    description: 'Strip EXIF, GPS, and other private metadata before sharing.',
  },
];
