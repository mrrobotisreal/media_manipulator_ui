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
} from '@/components/embedded-tool-panel';
import type { DashCodec, TranscodeProtocol } from '@/lib/transcodeTypes';

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

export interface ToolPageContent {
  /** Path slug under /tools, e.g. "remove-exif-metadata" -> /tools/remove-exif-metadata */
  slug: string;
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
  category: 'image' | 'video' | 'audio' | 'ai' | 'metadata' | 'contentStudio';
  /** Embedded panel configuration. */
  embed: {
    defaultMediaKind: EmbeddedMediaKind;
    defaultTask: EmbeddedTask;
    defaultOutputFormat?: string;
    lockedInputFormat?: string;
    lockedOutputFormat?: string;
    allowedInputFormats?: string[];
    acceptOverride?: string;
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
}

const sharedPrivacyNote =
  'Your uploads are processed on our own servers and are designed to be automatically deleted within 24 hours. We do not share your files with third-party AI providers, and AI features run on a local GPU server we operate. No login or account is required.';

export const TOOL_PAGES: ToolPageContent[] = [
  // ----------------------------------------------------------------------- CONTENT STUDIO
  {
    slug: 'content-studio',
    name: 'Content Studio',
    h1: 'Content Studio',
    tagline:
      'Edit, layer, and mix video & audio on a multi-track timeline — then export MP4. A Premiere Pro–style editor, right in your browser.',
    metaTitle: 'Content Studio — Free Online Multi-Track Video Editor | Media Manipulator',
    metaDescription:
      'Edit, layer, and mix video & audio on a multi-track timeline, then export MP4 — a free, Premiere Pro–style video editor that runs right in your browser. No signup, no install.',
    ogTitle: '🎬 Content Studio — Free Multi-Track Video Editor in Your Browser',
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
      "Content Studio is a free, browser-based multi-track video editor. Instead of converting one file at a time, you build a complete edit: lay video, image, and audio clips across stacked timeline tracks, trim and split them on a frame-accurate timeline, layer titles and overlays on top, mix audio, and export the whole thing to MP4. It's the closest thing to a Premiere Pro–style timeline that runs entirely in your web browser — no install, no signup, and nothing to learn before you start.",
    whatItDoes: [
      'Hosts a multi-track timeline where video, image, and audio clips stack on separate layers and play back together.',
      'Lets you trim clip in/out points, split clips at the playhead, and ripple-delete to close gaps.',
      'Layers overlays — additional video, images, and titles render on top of the base track in stacking order.',
      'Mixes multiple audio tracks alongside your video and previews the composite in real time.',
      'Exports the finished sequence as a single MP4 you can download and share.',
    ],
    flowSteps: [
      {
        title: 'Create a project',
        description: 'Name it and pick a resolution (up to 4K) and frame rate (24/30/60 fps).',
      },
      {
        title: 'Import media',
        description: 'Drag video, image, and audio files into the media bin.',
      },
      {
        title: 'Build the timeline',
        description: 'Drop clips onto tracks, then trim, split, and arrange them around the playhead.',
      },
      {
        title: 'Layer & mix',
        description: 'Stack overlays and titles, add extra audio tracks, and preview the result.',
      },
      {
        title: 'Export MP4',
        description: 'Render the sequence to an MP4 and download it.',
      },
    ],
    advancedDetails: [
      'The timeline is frame-accurate: the playhead, clip boundaries, and split points snap to the project frame rate so cuts land where you expect.',
      'Tracks composite in stacking order — higher tracks render over lower ones — which is how overlays, picture-in-picture, and titles sit on top of your base footage.',
      'Preview playback is driven by a browser preview engine that composites the active clips on a canvas; the final export is encoded to H.264 MP4 with AAC audio.',
      'Projects, media references, and edit decisions are stored per project, so you can close the tab and reopen a recent project to keep working.',
    ],
    whyItMatters: [
      'Most online media tools only do one operation at a time; real content needs several clips cut, layered, and mixed together.',
      'A timeline editor lets you tell a story — intro, b-roll, titles, music — instead of just converting a single file.',
      'Doing it in the browser means no multi-gigabyte install and no account, so you can go from raw clips to an exported MP4 in minutes.',
    ],
    useCases: [
      {
        title: 'Short-form social videos',
        description: 'Cut clips, add a title card and background music, and export a vertical or square MP4.',
      },
      {
        title: 'Tutorials and screen recordings',
        description: 'Trim dead air, stitch takes together, and overlay callout titles.',
      },
      {
        title: 'Highlight reels',
        description: 'Assemble the best moments from several clips into one continuous edit.',
      },
      {
        title: 'Simple promos',
        description: 'Layer a logo or text overlay over b-roll and mix in a voiceover or music bed.',
      },
    ],
    whyMediaManipulator: [
      'A genuine multi-track timeline — not a single-clip trimmer dressed up as an editor.',
      'Runs in your browser with no install and no signup, and your media is processed on our own servers.',
      'Pairs with the rest of Media Manipulator: compress, transcode, transcribe, or strip metadata from your source or exported files in the same place.',
    ],
    privacyNote: sharedPrivacyNote,
    faq: [
      {
        question: 'Is Content Studio free?',
        answer: 'Yes. Content Studio is free to use with no signup or account required.',
      },
      {
        question: 'Do I need to install anything?',
        answer: 'No. It runs entirely in your web browser — there is nothing to download or install.',
      },
      {
        question: 'What can I put on the timeline?',
        answer: 'Video clips, images, and audio files. They stack on separate tracks and play back together.',
      },
      {
        question: 'What format does it export?',
        answer: 'Content Studio exports your finished sequence as an MP4 (H.264 video with AAC audio).',
      },
      {
        question: 'What resolutions and frame rates are supported?',
        answer: 'You can create projects at up to 4K (3840×2160), including vertical 1080×1920, at 24, 30, or 60 fps.',
      },
      {
        question: 'Are my files kept private?',
        answer: 'Your media is processed on our own servers and is designed to be automatically deleted within 24 hours. We do not share files with third-party providers.',
      },
      {
        question: 'Can I come back to a project later?',
        answer: 'Yes. Recent projects appear on the Content Studio start screen so you can reopen one and keep editing.',
      },
    ],
    related: [
      {
        label: 'Compress Video',
        to: '/tools/compress-video',
        description: 'Shrink your exported MP4 for faster uploads and sharing.',
      },
      {
        label: 'Transcribe Video',
        to: '/tools/transcribe-video',
        description: 'Generate a transcript or captions from your finished video.',
      },
      {
        label: 'Extract Audio from Video',
        to: '/tools/extract-audio-from-video',
        description: 'Pull the audio track out of a clip as MP3 or WAV.',
      },
      {
        label: 'Content Studio tutorial',
        to: '/tutorials/content-studio',
        description: 'A step-by-step walkthrough of building an edit and exporting MP4.',
      },
    ],
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
        'Source and exported files are processed on our servers and deleted within 24 hours.',
      ],
      processingNotes: [
        'Preview composites in the browser; the final export is encoded to H.264 MP4.',
      ],
    },
  },

  // ----------------------------------------------------------------------- METADATA / PRIVACY
  {
    slug: 'remove-exif-metadata',
    name: 'Remove EXIF Metadata from Images',
    h1: 'Remove EXIF Metadata from Images Online',
    tagline:
      'Strip GPS location, device, camera, and timestamp data from photos before you share them anywhere.',
    metaTitle:
      'Remove EXIF Metadata from Images Online (Free) | Media Manipulator',
    metaDescription:
      'Free online tool to remove EXIF, GPS, IPTC, and camera metadata from JPG, PNG, WebP, and HEIC images. No signup, deleted within 24 hours.',
    ogTitle: 'Remove EXIF Metadata from Images Online',
    ogDescription:
      'Strip GPS location, camera, and timestamp metadata from images before sharing them publicly.',
    category: 'metadata',
    embed: {
      defaultMediaKind: 'image',
      defaultTask: 'remove_metadata',
      title: 'Remove metadata from an image',
      description:
        'Upload a JPG, PNG, WebP, or HEIC photo. Use the Metadata section in the form below and set the metadata mode to "Strip" before converting.',
    },
    intro:
      'Every photo you take stores hidden information about it — the camera you used, the exact time, and often the GPS coordinates of where the photo was taken. This metadata can leak your home address, daily routine, or device details whenever you share a picture online. Media Manipulator strips all of that out and gives you a clean image safe to publish.',
    whatItDoes: [
      'Removes EXIF tags including camera make/model, exposure settings, and embedded thumbnails.',
      'Strips GPS location data: latitude, longitude, altitude, capture direction, and GPS timestamps.',
      'Removes IPTC and XMP metadata such as author, copyright, keywords, and descriptions.',
      'Preserves the original visual content — only the hidden metadata sidecar is touched.',
    ],
    flowSteps: [
      {
        title: 'Upload image',
        description: 'Drop in any JPG, PNG, WebP, or HEIC photo.',
      },
      {
        title: 'Read metadata',
        description: 'We parse EXIF/IPTC/XMP fields locally on our servers.',
      },
      {
        title: 'Remove private fields',
        description: 'GPS, device, and timestamp tags are stripped.',
      },
      {
        title: 'Download clean image',
        description: 'Save the metadata-free copy for safe sharing.',
      },
    ],
    advancedDetails: [
      'Stripping is performed with ImageMagick + exiftool on the server, ensuring every common metadata profile (EXIF, IPTC, XMP, ICC, MakerNote) is removed.',
      'The output container is preserved by default — JPG stays JPG, PNG stays PNG — so re-encoding artifacts are minimal.',
      'If you want to keep ICC color profiles but drop everything else, use the Metadata section\'s "Custom" mode to keep only the fields you care about.',
    ],
    whyItMatters: [
      'Photos uploaded straight from a phone can reveal the exact GPS coordinates of your home or workplace.',
      'EXIF data persists when you message, email, or upload an image to most websites — even some social networks keep it intact.',
      'Stripping metadata is the simplest way to make a photo safe to share without changing what it looks like.',
    ],
    useCases: [
      {
        title: 'Posting on forums or marketplaces',
        description: 'Hide your home GPS coordinates from buyers, members, or strangers.',
      },
      {
        title: 'Sharing photos publicly',
        description: 'Remove camera serial numbers, lens info, and capture times from publicly posted photos.',
      },
      {
        title: 'Journalism and source protection',
        description: 'Scrub identifying device/GPS metadata before publishing a sensitive image.',
      },
      {
        title: 'Selling a product',
        description: 'Remove the embedded thumbnail and EXIF data before listing on a marketplace.',
      },
    ],
    whyMediaManipulator: [
      'Runs entirely on our own infrastructure — no third-party metadata service sees your photo.',
      'Strips every common metadata profile, not just the EXIF block.',
      'Free, no signup, no watermarks, and the original is auto-deleted within 24 hours.',
    ],
    privacyNote: sharedPrivacyNote,
    faq: [
      {
        question: 'What metadata gets removed?',
        answer:
          'EXIF (camera, exposure, GPS, timestamps), IPTC (author, copyright, keywords), XMP, embedded thumbnails, and most MakerNote vendor blocks.',
      },
      {
        question: 'Will the image quality change?',
        answer:
          'No — we keep the original encoding when possible. JPG stays JPG without re-compressing twice, PNG stays PNG.',
      },
      {
        question: 'Can I keep some metadata, like copyright?',
        answer:
          'Yes. Use the "Custom" metadata mode in the form and keep only the IPTC fields you want to publish.',
      },
      {
        question: 'Are my uploads kept?',
        answer:
          'No — files are deleted within 24 hours and never shared with third-party providers.',
      },
    ],
    related: [
      {
        label: 'Image converter',
        to: '/tools/image-converter',
        description: 'Convert between JPG, PNG, WebP, AVIF, GIF, and more.',
      },
      // Hidden during AdSense review — re-enable when the blog returns.
      // {
      //   label: 'Image optimization guide',
      //   to: '/blog/image/image-optimization-guide',
      //   description: 'JPG vs PNG vs WebP and how to shrink images for the web.',
      // },
      {
        label: 'Image converter tutorial',
        to: '/tutorials/image/getting-started',
        description: 'Full walkthrough of every option in the image converter.',
      },
      {
        label: 'Privacy policy',
        to: '/privacy-policy',
        description: 'How uploaded files are processed and deleted.',
      },
    ],
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
    name: 'Compress Video',
    h1: 'Compress Video Online Without Ruining Quality',
    tagline:
      'Shrink MP4, WebM, MOV, MKV, and AVI files for the web, email, social, and cloud uploads.',
    metaTitle: 'Compress Video Online (Free) | Media Manipulator',
    metaDescription:
      'Free online video compressor. Reduce MP4, WebM, MOV, MKV, and AVI file size while keeping good quality. No signup, deleted within 24 hours.',
    ogTitle: 'Compress Video Online Without Ruining Quality',
    ogDescription:
      'Shrink MP4, WebM, MOV, and AVI video files for the web without losing watchable quality.',
    category: 'video',
    embed: {
      defaultMediaKind: 'video',
      defaultTask: 'compress_video',
      title: 'Compress a video',
      description:
        'Upload a video and pick a smaller quality preset or lower bitrate. Keep the same codec for the fastest result, or switch to WebM/H.265 for smaller files on modern devices.',
    },
    intro:
      'A 30-second clip from a modern phone or screen recorder can easily be hundreds of megabytes. Media Manipulator re-encodes your video at a lower bitrate or with a more efficient codec so the file shrinks dramatically while still looking good. Most users get 50–80% smaller files with no visible quality loss.',
    whatItDoes: [
      'Re-encodes video at a lower bitrate or with a more efficient codec.',
      'Supports MP4, WebM, MOV, MKV, AVI, FLV, WMV, and ProRes inputs.',
      'Lets you change resolution, frame rate, and audio bitrate for further savings.',
      'Outputs to MP4 (H.264 / H.265), WebM (VP9), or any other supported container.',
    ],
    flowSteps: [
      {
        title: 'Upload video',
        description: 'Drop in any MP4, WebM, MOV, MKV, AVI, or other supported video.',
      },
      {
        title: 'Analyze codec/bitrate',
        description: 'We detect the source codec and recommend a target.',
      },
      {
        title: 'Apply compression',
        description: 'FFmpeg re-encodes at a lower bitrate or smarter codec.',
      },
      {
        title: 'Download smaller video',
        description: 'Save a leaner file ready for the web or sharing.',
      },
    ],
    advancedDetails: [
      'Under the hood the tool runs FFmpeg with libx264, libx265, or libvpx-vp9 depending on the target container.',
      'For modern browsers, H.265 in MP4 (HEVC) or VP9 in WebM typically gives 25–50% smaller files than H.264 at equivalent quality.',
      'When dropping resolution from 4K to 1080p, file size usually drops 4× — even before re-encoding.',
      'The "medium" quality preset roughly matches a 23 CRF for x264, a sensible visually-lossless default.',
    ],
    whyItMatters: [
      'Page-load time directly affects bounce rate, SEO ranking, and conversions.',
      'Most email and chat platforms reject files over a few hundred MB.',
      'Hosting costs scale with bandwidth — smaller videos save real money at scale.',
    ],
    useCases: [
      {
        title: 'Faster websites',
        description: 'Shrink hero or background videos so pages load in under 3 seconds.',
      },
      {
        title: 'Email and Slack',
        description: 'Get under file-size limits without uploading to a separate share host.',
      },
      {
        title: 'Social media',
        description: 'Pre-compress so uploads finish faster on mobile data.',
      },
      {
        title: 'Cloud storage',
        description: 'Cut storage bills by archiving compressed versions of large originals.',
      },
    ],
    whyMediaManipulator: [
      'Runs on our own GPU and CPU servers — no third-party processing.',
      'Full control over codec, bitrate, resolution, and audio settings.',
      'Free, no watermarks, no signup, no monthly limit on a casual use level.',
    ],
    privacyNote: sharedPrivacyNote,
    faq: [
      {
        question: 'Will the video quality drop?',
        answer:
          'A small amount — but at the "medium" or "high" preset most people can\'t tell the difference. For the smallest file size try the "low" preset or drop the resolution.',
      },
      {
        question: 'Which output format is best?',
        answer:
          'MP4 with H.264 is the safe-everywhere default. WebM (VP9) or MP4 (H.265) are smaller, but H.265 requires a modern player.',
      },
      {
        question: 'Can I keep the original audio?',
        answer:
          'Yes — set the audio bitrate to "match source" or pick the same audio codec. The audio is typically a small part of total file size.',
      },
      {
        question: 'Is there a file-size limit?',
        answer:
          'Yes, large uploads may be rejected to keep the free service stable. For very large files, lower the resolution before uploading.',
      },
    ],
    related: [
      {
        label: 'Video compressor',
        to: '/tools/video-compressor',
        description: 'Compress any video with one-click presets.',
      },
      {
        label: 'Compress MP4',
        to: '/tools/compress-mp4',
        description: 'MP4-specific compressor with H.264 output.',
      },
      {
        label: 'Video converter',
        to: '/tools/video-converter',
        description: 'Convert between MP4, WebM, MOV, AVI, and more.',
      },
      {
        label: 'MP4 converter',
        to: '/tools/mp4-converter',
        description: 'Convert almost any video into a universal MP4.',
      },
      {
        label: 'Convert MP4 to WebM',
        to: '/tools/convert-mp4-to-webm',
        description: 'Re-encode MP4 into a smaller VP9 WebM for the web.',
      },
      {
        label: 'Convert video to animated GIF',
        to: '/tools/convert-video-to-animated-gif',
        description: 'Turn short clips into shareable animated GIFs.',
      },
      {
        label: 'Transcribe video',
        to: '/tools/transcribe-video',
        description: 'Pull speech out of video into searchable text.',
      },
      {
        label: 'AI Frame Interpolation',
        to: '/tools/ai-frame-interpolation',
        description: 'Smooth video motion by lifting FPS to 48, 60, or 120 with RIFE.',
      },
      // Hidden during AdSense review — re-enable when the blog returns.
      // {
      //   label: 'Video compression guide',
      //   to: '/blog/video/video-compression-guide',
      //   description: 'Codecs, bitrate, and container deep dive.',
      // },
      {
        label: 'Video converter tutorial',
        to: '/tutorials/video/getting-started',
        description: 'Step-by-step walkthrough of every video option.',
      },
    ],
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
      'HTTP Live Streaming (HLS) is Apple’s adaptive streaming format and the closest thing the web has to a universally supported VOD container. Media Manipulator transcodes your source video into an HLS package — master.m3u8 plus per-rendition variant playlists and .ts segments — so you can drop the unzipped folder onto any CDN or origin and serve it with built-in adaptive bitrate switching. Free tier covers 360p, 480p, and 720p; premium rungs are coming soon.',
    whatItDoes: [
      'Probes your source with ffprobe and shows resolution, FPS, duration, codec, and audio status.',
      'Lets you tick which quality rungs to encode (only ones your source can actually support are enabled).',
      'Runs an H.264 + AAC FFmpeg pipeline with HLS VOD output and independent_segments.',
      'Writes a master.m3u8 that references each variant, plus a variant index.m3u8 + .ts segments per rung.',
      'Optionally generates WebVTT captions and storyboard scrubber thumbnails.',
      'Bundles the result into media-manipulator-hls-<jobID>.tar.gz with a report.json and README.',
      'Uploads the tarball to S3 and hands you back a short-lived presigned GET URL for download.',
    ],
    flowSteps: [
      {
        title: 'Upload',
        description: 'Direct S3 presigned PUT — your file never goes through the API server.',
      },
      {
        title: 'Probe',
        description: 'ffprobe reads resolution, FPS, audio presence, and codec metadata.',
      },
      {
        title: 'Pick rungs',
        description: 'Choose 360p, 480p, 720p, or any combination you need.',
      },
      {
        title: 'Encode',
        description: 'libx264 + AAC at 2-second segments with forced keyframes on segment boundaries.',
      },
      {
        title: 'Package',
        description: 'master.m3u8 + variants + segments tar.gz’d with report.json and README.',
      },
      {
        title: 'Download',
        description: 'Presigned S3 GET URL valid for 30 minutes.',
      },
    ],
    advancedDetails: [
      'HLS variants are encoded with -hls_time 2 -hls_playlist_type vod -hls_flags independent_segments.',
      'Force keyframes are emitted every 2 seconds so segments align cleanly across renditions.',
      'CODECS attribute is "avc1.640028" with "mp4a.40.2" appended when audio is present.',
      'No upscaling: rungs taller than the source resolution are disabled with a tooltip.',
      'When the source has no audio track, the audio mapping is omitted so video-only HLS still works.',
    ],
    whyItMatters: [
      'HLS is the de-facto streaming format on iOS, Safari, and every modern CDN.',
      'A master playlist enables adaptive bitrate so viewers on slow connections get a watchable stream.',
      'Pre-segmented VOD is far cheaper to serve than re-encoding on every request.',
    ],
    useCases: [
      { title: 'Course platforms', description: 'Serve lessons with adaptive bitrate on iOS/Android without a video service.' },
      { title: 'Marketing sites', description: 'Drop a polished hero video that doesn’t buffer on mobile data.' },
      { title: 'Internal portals', description: 'Host onboarding videos on your own CDN, no third-party SaaS.' },
      { title: 'Archival', description: 'Convert a back catalog into a streamable format you control.' },
    ],
    whyMediaManipulator: [
      'Runs on our own servers — no third-party transcoding provider sees your video.',
      'Free tier already covers the three rungs most products need (360p/480p/720p).',
      'Open package format: just unzip the .tar.gz and host the master.m3u8.',
    ],
    privacyNote: sharedPrivacyNote,
    faq: [
      {
        question: 'What codec is used?',
        answer: 'H.264 (libx264 High profile, level 4.1) for video and AAC LC for audio. The standard combo every HLS player supports.',
      },
      {
        question: 'Why are 144p, 240p, 1080p, and 2160p disabled?',
        answer: 'They’re part of a premium ladder we’ll unlock when Premium sign-up launches. For now the free tool encodes 360p, 480p, and 720p only.',
      },
      {
        question: 'What if my video has no audio?',
        answer: 'The variant playlists are encoded video-only. The master.m3u8 omits the AAC codec hint so players don’t expect an audio track.',
      },
      {
        question: 'Can I get captions in the master playlist?',
        answer: 'Captions are generated as a WebVTT file inside the tar.gz. Linking them as an EXT-X-MEDIA subtitle rendition in the master.m3u8 is on the roadmap.',
      },
      {
        question: 'How long does the download URL last?',
        answer: 'Presigned GET URLs are valid for 30 minutes by default. Re-run the transcode if you need a fresh link.',
      },
    ],
    related: [
      {
        label: 'Transcode video to DASH',
        to: '/tools/transcode-to-dash',
        description: 'Same upload, but emits a MPEG-DASH (.mpd) package with AV1 or VP9.',
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
    privacyNote: sharedPrivacyNote,
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
      'Animated GIFs are the universal short-form clip format — they play inline in chat apps, forums, and email. Media Manipulator converts your video to a clean, looping GIF with full control over dimensions and frame rate. For best results, keep the clip short and trim before converting.',
    whatItDoes: [
      'Converts MP4, WebM, MOV, MKV, AVI, and more to looping animated GIFs.',
      'Lets you trim the clip and change resolution before exporting.',
      'Pick a frame rate that balances smoothness and file size.',
      'Outputs standard, broadly-compatible animated GIFs.',
    ],
    flowSteps: [
      {
        title: 'Upload clip',
        description: 'Drop in a short video — under ~10 seconds works best.',
      },
      {
        title: 'Trim and resize',
        description: 'Pick the segment, dimensions, and frame rate.',
      },
      {
        title: 'Generate frames',
        description: 'FFmpeg extracts frames and palettes a clean GIF.',
      },
      {
        title: 'Export animated GIF',
        description: 'Download a looping .gif ready for chat or web.',
      },
    ],
    advancedDetails: [
      'Behind the scenes we use a two-pass FFmpeg palettegen/paletteuse flow to get clean colors instead of the default GIF quantization.',
      'A 480px-wide GIF at 12 fps usually balances file size and smoothness for chat platforms.',
      'GIF is uncompressed compared to MP4/WebM — for clips longer than ~10 seconds, an MP4 or WebM clip is usually a better choice even though it does not autoplay-loop everywhere.',
    ],
    whyItMatters: [
      'Animated GIFs autoplay inline almost everywhere video does not.',
      'They are still the most reliable format for reaction clips, product demos, and bug repros.',
      'A trimmed, well-sized GIF beats a multi-megabyte attached video for casual sharing.',
    ],
    useCases: [
      {
        title: 'Bug reproductions',
        description: 'Capture a short screen recording and turn it into a GIF for a ticket.',
      },
      {
        title: 'Product demos',
        description: 'Show a feature in motion inside a blog post or README.',
      },
      {
        title: 'Reaction clips',
        description: 'Turn a video clip into a looping reaction GIF for chat.',
      },
      {
        title: 'Email signatures and previews',
        description: 'Use a tiny animated GIF to preview a longer video.',
      },
    ],
    whyMediaManipulator: [
      'Uses FFmpeg\'s palette-aware GIF encoder for clean colors.',
      'Trim, resize, and re-color in one upload — no separate editor needed.',
      'No watermarks, no signup, output is fully yours to use.',
    ],
    privacyNote: sharedPrivacyNote,
    faq: [
      {
        question: 'How long can my clip be?',
        answer:
          'There is no hard limit, but GIFs over ~10 seconds tend to become several megabytes. For longer clips, consider exporting WebP or short MP4 instead.',
      },
      {
        question: 'Will my GIF loop?',
        answer:
          'Yes — the exported GIF loops by default. Most platforms autoplay it inline.',
      },
      {
        question: 'How can I make the file smaller?',
        answer:
          'Trim aggressively, drop the dimensions (e.g. 480px wide), and lower the frame rate (10–12 fps is usually fine).',
      },
      {
        question: 'What is the resolution limit?',
        answer:
          'You can output up to the source resolution, but most chat apps shrink GIFs to fit. 480px width is a sensible default.',
      },
    ],
    related: [
      {
        label: 'MP4 to GIF',
        to: '/tools/mp4-to-gif',
        description: 'Output locked to GIF for MP4 input.',
      },
      {
        label: 'Video to GIF',
        to: '/tools/video-to-gif',
        description: 'Make a GIF from any video format.',
      },
      {
        label: 'GIF converter',
        to: '/tools/gif-converter',
        description: 'The GIF hub — make and tune animated GIFs.',
      },
      {
        label: 'Compress video',
        to: '/tools/compress-video',
        description: 'Shrink the source video before exporting a GIF.',
      },
      {
        label: 'Video converter',
        to: '/tools/video-converter',
        description: 'Switch between MP4, WebM, MOV, AVI, and more.',
      },
      {
        label: 'Video converter tutorial',
        to: '/tutorials/video/getting-started',
        description: 'Walk through trim, resize, and filter settings.',
      },
      // Hidden during AdSense review — re-enable when the blog returns.
      // {
      //   label: 'Video compression guide',
      //   to: '/blog/video/video-compression-guide',
      //   description: 'How codec and bitrate affect output size.',
      // },
    ],
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
    name: 'Transcribe Video',
    h1: 'Transcribe Video to Text Online',
    tagline:
      'Pull spoken words out of video files into searchable text, captions, or structured JSON.',
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
        'Upload a video. The AI transcription model runs on our local GPU server and exports as VTT captions, plain text, or JSON.',
    },
    intro:
      'Whether you are adding accessibility captions, building a searchable archive, or just want to skim a long video, transcription unlocks the speech inside your file. Media Manipulator transcribes your video locally on our own GPU server — no third-party AI provider sees your media.',
    whatItDoes: [
      'Extracts audio from your video and runs speech-to-text on it.',
      'Exports captions in WebVTT (.vtt), plain text, or structured JSON.',
      'Supports many spoken languages with automatic language detection.',
      'Runs locally on our GPU server — no third-party AI provider involved.',
    ],
    flowSteps: [
      {
        title: 'Upload video',
        description: 'Drop in any MP4, MOV, WebM, or MKV file.',
      },
      {
        title: 'Extract audio',
        description: 'FFmpeg pulls a clean audio track from the video.',
      },
      {
        title: 'Local AI transcription',
        description: 'whisper-ctranslate2 runs on our GPU server.',
      },
      {
        title: 'Download transcript',
        description: 'Save as VTT captions, plain text, or JSON.',
      },
    ],
    advancedDetails: [
      'Transcripts come from whisper-ctranslate2 (a faster Whisper implementation) running on a local GPU we operate.',
      'VTT output is the right pick for video captions — it works with HTML <track> elements, YouTube, and most video editors.',
      'JSON output includes per-segment start/end timestamps and confidence values, useful for building search indexes or summarization pipelines.',
    ],
    whyItMatters: [
      'Captions make your video accessible to deaf and hard-of-hearing viewers — and to anyone watching on mute.',
      'Search engines and AI agents can index a transcribed video far better than a raw video file.',
      'Internal teams can search across recorded calls, demos, and tutorials when transcripts exist.',
    ],
    useCases: [
      {
        title: 'Adding captions',
        description: 'Generate VTT files for accessibility and silent autoplay.',
      },
      {
        title: 'Searchable archive',
        description: 'Index recorded meetings, calls, or training videos.',
      },
      {
        title: 'Content repurposing',
        description: 'Turn a video into a blog post or summary with a quick start.',
      },
      {
        title: 'Compliance and notes',
        description: 'Keep written records of recorded interviews or interactions.',
      },
    ],
    whyMediaManipulator: [
      'Runs entirely on our own GPU server — no OpenAI/Anthropic/Google sees your audio.',
      'Outputs the format you actually need: VTT, text, or JSON.',
      'Same upload + delete-within-24-hours privacy model as the rest of the toolset.',
    ],
    privacyNote: sharedPrivacyNote,
    faq: [
      {
        question: 'Which video formats are supported?',
        answer:
          'MP4, MOV, WebM, MKV, AVI, FLV, and most other common containers. Audio files can also be transcribed directly.',
      },
      {
        question: 'How accurate is the transcript?',
        answer:
          'Word-error rates are typically a few percent for clear speech. Heavy background music, overlapping voices, or strong accents lower accuracy.',
      },
      {
        question: 'Can I get timestamps?',
        answer:
          'Yes — VTT and JSON outputs both include per-segment timestamps.',
      },
      {
        question: 'Does my video leave your servers?',
        answer:
          'No — transcription happens on a GPU server we operate. The original file and the transcript are deleted within 24 hours.',
      },
    ],
    related: [
      {
        label: 'Compress video',
        to: '/tools/compress-video',
        description: 'Shrink the video first if you only need the transcript.',
      },
      {
        label: 'Audio converter',
        to: '/tools/audio-converter',
        description: 'Extract a clean audio track for transcription.',
      },
      {
        label: 'Video converter tutorial',
        to: '/tutorials/video/getting-started',
        description: 'Trim and clean up the video before transcribing.',
      },
      {
        label: 'How it works',
        to: '/how-it-works',
        description: 'See how local AI transcription is wired up.',
      },
    ],
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
        'Upload a WebP image and pick JPG as the output format. Adjust the quality slider to balance file size against image quality.',
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
      'Same privacy and 24-hour deletion model as the rest of the toolset.',
    ],
    privacyNote: sharedPrivacyNote,
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
      'Free online PNG to JPG converter. Turn .png files into smaller, universally compatible JPG images at the quality you choose. No signup, files deleted within 24 hours.',
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
      'Keeps the visible content identical — only the encoding changes.',
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
      'Free, no signup, no watermarks, and uploads are deleted within 24 hours.',
    ],
    privacyNote: sharedPrivacyNote,
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
          'Upload your .png above, choose a JPG quality, and click convert. The download is a standard .jpg file. It is completely free with no signup.',
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
      {
        question: 'Are my uploaded files kept?',
        answer:
          'No. Files are processed on our own servers and deleted within 24 hours. No login is required and we never share your files with third parties.',
      },
    ],
    related: [
      { label: 'Convert JPG to PNG', to: '/tools/convert-jpg-to-png', description: 'Go the other way and add a transparent-capable PNG.' },
      { label: 'JPG converter', to: '/tools/jpg-converter', description: 'Convert any image format to JPG.' },
      { label: 'Compress image', to: '/tools/compress-image', description: 'Shrink the JPG further without changing format.' },
      { label: 'Image converter', to: '/tools/image-converter', description: 'Convert between JPG, PNG, WebP, AVIF, and GIF.' },
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
      'Free online JPG to PNG converter. Turn .jpg photos into lossless PNG files for editing, transparency, and graphics. No signup, files deleted within 24 hours.',
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
      'Keeps the visible content identical — only the encoding changes.',
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
      'Free, no signup, no watermarks, uploads deleted within 24 hours.',
    ],
    privacyNote: sharedPrivacyNote,
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
      {
        question: 'Are my uploaded files private?',
        answer:
          'Yes. Files are processed on our own servers and deleted within 24 hours. No account is required.',
      },
    ],
    related: [
      { label: 'Convert PNG to JPG', to: '/tools/convert-png-to-jpg', description: 'Go the other way and shrink a PNG into a JPG.' },
      { label: 'PNG converter', to: '/tools/png-converter', description: 'Convert any image format to PNG.' },
      { label: 'Remove background from image', to: '/tools/remove-background-from-image', description: 'Make a transparent PNG cutout automatically.' },
      { label: 'Image converter', to: '/tools/image-converter', description: 'Convert between JPG, PNG, WebP, AVIF, and GIF.' },
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
      'Free online WebP to PNG converter. Turn .webp images into lossless PNG files that keep transparency and open in any editor. No signup, files deleted within 24 hours.',
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
      'WebP is great for the web, but plenty of editors, older software, and design tools still expect PNG — and unlike JPG, PNG keeps full transparency. Media Manipulator converts your WebP to a clean, lossless PNG so it opens everywhere and your alpha channel survives. Free, online, no signup.',
    whatItDoes: [
      'Converts any .webp image to a lossless .png file.',
      'Preserves the alpha channel so transparent WebPs stay transparent.',
      'Produces a PNG that opens in any editor, viewer, or design tool.',
      'Keeps the visible content identical — only the encoding changes.',
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
      'Free, no signup, no watermarks, uploads deleted within 24 hours.',
    ],
    privacyNote: sharedPrivacyNote,
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
      {
        question: 'Are my uploads stored?',
        answer:
          'No. Uploads are processed on our own servers and deleted within 24 hours. No account is required.',
      },
    ],
    related: [
      { label: 'Convert PNG to WebP', to: '/tools/convert-png-to-webp', description: 'Go the other way and shrink a PNG into a WebP.' },
      { label: 'Convert WebP to JPG', to: '/tools/convert-webp-to-jpg', description: 'Convert WebP to a compact JPG instead.' },
      { label: 'PNG converter', to: '/tools/png-converter', description: 'Convert any image format to PNG.' },
      { label: 'Compress image', to: '/tools/compress-image', description: 'Shrink an image without re-format hassle.' },
      { label: 'Image converter', to: '/tools/image-converter', description: 'Convert between JPG, PNG, WebP, AVIF, and GIF.' },
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
      'Free online PNG to WebP converter. Shrink .png files into smaller WebP images for faster websites while keeping transparency. No signup, files deleted within 24 hours.',
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
      'Free, no signup, no watermarks, uploads deleted within 24 hours.',
    ],
    privacyNote: sharedPrivacyNote,
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
      {
        question: 'Are my uploads kept?',
        answer:
          'No. Files are processed on our own servers and deleted within 24 hours. No account is required.',
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
      'Free online JPG to WebP converter. Shrink .jpg photos into smaller WebP images for faster websites at the quality you choose. No signup, files deleted within 24 hours.',
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
      'WebP delivers the same visual quality as JPG in a noticeably smaller file, which is why it has become the default image format for fast websites. Media Manipulator converts your JPG to WebP at the quality you choose, so your photos look the same but load faster — free, online, no signup.',
    whatItDoes: [
      'Converts any .jpg/.jpeg photo to a modern .webp file.',
      'Lets you choose WebP quality to balance file size against fidelity.',
      'Typically produces files 25–35% smaller than the source JPG at equal quality.',
      'Keeps the visible content identical — only the encoding changes.',
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
      'Free, no signup, no watermarks, uploads deleted within 24 hours.',
    ],
    privacyNote: sharedPrivacyNote,
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
      {
        question: 'Are my uploads private?',
        answer:
          'Yes. Files are processed on our own servers and deleted within 24 hours. No account is required.',
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
      'Convert PNG, WebP, GIF, and more into universally compatible JPG photos at the quality you choose.',
    metaTitle: 'Free JPG Converter Online | Media Manipulator',
    metaDescription:
      'Free online JPG converter. Convert PNG, WebP, and GIF images into universally compatible JPG files at the quality you choose. No signup, files deleted within 24 hours.',
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
      'JPG (JPEG) is the most universally accepted image format on the planet — every device, editor, printer, and upload form takes it. Media Manipulator’s JPG converter turns PNG, WebP, GIF, and other images into a clean JPG at the quality you choose. JPG is preselected, but you can switch the output if you change your mind. Free, online, no signup.',
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
      'Free, no signup, no watermarks, uploads deleted within 24 hours.',
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
          'No. Files are processed on our own servers and deleted within 24 hours. No account is required.',
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
      'Convert JPG, WebP, GIF, and more into lossless PNG files with full transparency support.',
    metaTitle: 'Free PNG Converter Online | Media Manipulator',
    metaDescription:
      'Free online PNG converter. Convert JPG, WebP, and GIF images into lossless PNG files with transparency support. No signup, files deleted within 24 hours.',
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
      'PNG is the go-to lossless format for graphics, screenshots, logos, and anything that needs transparency. Media Manipulator’s PNG converter turns JPG, WebP, GIF, and other images into a clean, lossless PNG. PNG is preselected, but you can switch the output if you prefer. Free, online, no signup.',
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
      'Free, no signup, no watermarks, uploads deleted within 24 hours.',
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
          'No. Files are processed on our own servers and deleted within 24 hours. No account is required.',
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
    name: 'Image Resizer',
    h1: 'Resize Image Online Free',
    tagline:
      'Resize JPG, PNG, WebP, and GIF images to exact pixel dimensions while keeping the aspect ratio.',
    metaTitle: 'Resize Image Online Free | Media Manipulator',
    metaDescription:
      'Free online image resizer. Resize JPG, PNG, WebP, and GIF images to exact pixel dimensions while keeping the aspect ratio. No signup, files deleted within 24 hours.',
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
      'Resizing an image to exact pixel dimensions is one of the most common tasks on the web — fitting an avatar, a banner, a thumbnail, or an upload limit. Media Manipulator resizes your image to the width and height you set while keeping the aspect ratio, so nothing looks stretched. Free, online, no signup.',
    whatItDoes: [
      'Resizes JPG, PNG, WebP, and GIF images to exact pixel dimensions.',
      'Keeps the aspect ratio when you set only a width or only a height.',
      'Lets you keep the original format or switch it during the resize.',
      'Combines resize with quality control in a single pass.',
    ],
    flowSteps: [
      { title: 'Upload an image', description: 'Drop in any JPG, PNG, WebP, or GIF.' },
      { title: 'Set width / height', description: 'Enter a target width, height, or both.' },
      { title: 'Resize', description: 'ImageMagick scales the image to your dimensions.' },
      { title: 'Download', description: 'Save the resized image.' },
    ],
    advancedDetails: [
      'Set only width or only height and the other dimension scales proportionally to preserve aspect ratio.',
      'Set both width and height to force exact dimensions — useful when a platform requires a specific size.',
      'The image is auto-oriented from EXIF before resizing so the result matches the preview.',
      'Pair resizing with a lower quality on JPG/WebP output to shrink the file even more.',
    ],
    whyItMatters: [
      'Platforms enforce specific dimensions for avatars, banners, and thumbnails.',
      'Smaller dimensions mean smaller files and faster page loads.',
      'Resizing before upload avoids the platform’s own lower-quality auto-resize.',
    ],
    useCases: [
      { title: 'Profile pictures', description: 'Resize to the exact avatar dimensions a platform requires.' },
      { title: 'Social banners', description: 'Hit the precise header/cover size for each network.' },
      { title: 'Thumbnails', description: 'Generate small, fast-loading preview images.' },
      { title: 'Upload limits', description: 'Shrink dimensions to get under a size cap.' },
    ],
    whyMediaManipulator: [
      'Exact pixel control with aspect-ratio preservation built in.',
      'Resize and re-encode in one upload, with no watermarks.',
      'Free, no signup, uploads deleted within 24 hours.',
    ],
    privacyNote: sharedPrivacyNote,
    supportedFormats: {
      supportedInputFormats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
      supportedOutputFormats: ['jpg', 'png', 'webp', 'gif'],
      processingNotes: [
        'Leave one dimension blank to scale proportionally and keep the aspect ratio.',
      ],
    },
    faq: [
      {
        question: 'How do I resize an image online for free?',
        answer:
          'Upload your image, enter a target width and/or height in the resize fields, and click convert. The resized image downloads instantly. It is free with no signup.',
      },
      {
        question: 'How do I keep the aspect ratio when resizing?',
        answer:
          'Set only the width or only the height and leave the other field blank — the image scales proportionally so it never looks stretched.',
      },
      {
        question: 'Can I resize to exact dimensions?',
        answer:
          'Yes. Enter both a width and a height to force exact pixel dimensions, which is handy when a platform requires a specific size.',
      },
      {
        question: 'Will resizing change the file format?',
        answer:
          'No, the output keeps the original format by default. You can also pick a different format in the form if you want to convert at the same time.',
      },
      {
        question: 'Are my uploads private?',
        answer:
          'Yes. Files are processed on our own servers and deleted within 24 hours. No account is required.',
      },
    ],
    related: [
      { label: 'Compress image', to: '/tools/compress-image', description: 'Shrink an image’s file size without changing dimensions.' },
      { label: 'Image converter', to: '/tools/image-converter', description: 'Convert between JPG, PNG, WebP, AVIF, and GIF.' },
      { label: 'JPG converter', to: '/tools/jpg-converter', description: 'Convert any image to JPG.' },
      { label: 'PNG converter', to: '/tools/png-converter', description: 'Convert any image to lossless PNG.' },
      { label: 'Image converter tutorial', to: '/tutorials/image/getting-started', description: 'Walk through resize, crop, and quality settings.' },
    ],
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
    name: 'Compress Image',
    h1: 'Compress Image Online Free',
    tagline:
      'Shrink JPG, PNG, and WebP file sizes for faster websites, smaller uploads, and easier sharing.',
    metaTitle: 'Compress Image Online Free | Media Manipulator',
    metaDescription:
      'Free online image compressor. Shrink JPG, PNG, and WebP file sizes while keeping good quality. No signup, files deleted within 24 hours.',
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
      'Large images are the number-one cause of slow web pages and rejected uploads. Compressing an image lowers its file size — often by more than half — while keeping it looking great. Media Manipulator compresses your JPG, PNG, or WebP at the quality you choose, defaulting to a balanced 80. Free, online, no signup.',
    whatItDoes: [
      'Reduces image file size by re-encoding at a lower quality you control.',
      'Defaults to a balanced quality around 80 so files shrink with little visible change.',
      'Keeps the original format by default, or switch to WebP for the smallest result.',
      'Lets you also resize dimensions in the same pass for even smaller files.',
    ],
    flowSteps: [
      { title: 'Upload an image', description: 'Drop in any JPG, PNG, or WebP file.' },
      { title: 'Pick a quality', description: '75–85 balances size and fidelity; lower it for smaller files.' },
      { title: 'Compress', description: 'ImageMagick re-encodes at your chosen quality.' },
      { title: 'Download', description: 'Save a much smaller image.' },
    ],
    advancedDetails: [
      'Quality 75–85 is the sweet spot for JPG and WebP — most viewers can’t tell the difference from the original.',
      'For photographic content, switching the output to WebP usually beats JPG file size at the same quality.',
      'PNG is lossless: to shrink a PNG photo substantially, convert it to JPG or WebP rather than just lowering quality.',
      'Reducing the pixel dimensions as well as the quality compounds the savings.',
    ],
    whyItMatters: [
      'Page-load speed directly affects bounce rate, conversions, and SEO ranking.',
      'Smaller images stay under email, form, and platform upload limits.',
      'Lower bandwidth saves hosting costs at scale.',
    ],
    useCases: [
      { title: 'Faster websites', description: 'Compress images so pages load in under a few seconds.' },
      { title: 'Email attachments', description: 'Get photos under attachment size limits.' },
      { title: 'Form uploads', description: 'Meet a site’s maximum file-size requirement.' },
      { title: 'Storage savings', description: 'Archive smaller copies of large image libraries.' },
    ],
    whyMediaManipulator: [
      'Sensible default quality with precise manual control.',
      'Compress, resize, and convert in a single upload.',
      'Free, no signup, no watermarks, uploads deleted within 24 hours.',
    ],
    privacyNote: sharedPrivacyNote,
    supportedFormats: {
      supportedInputFormats: ['jpg', 'jpeg', 'png', 'webp'],
      supportedOutputFormats: ['jpg', 'png', 'webp'],
      processingNotes: [
        'Lowering quality affects JPG and WebP output. To shrink a PNG photo a lot, convert it to JPG or WebP.',
      ],
    },
    faq: [
      {
        question: 'How do I compress an image for free?',
        answer:
          'Upload your image, lower the quality value (75–85 is a good start), and click convert. The compressed image downloads instantly. It is free with no signup.',
      },
      {
        question: 'Does compressing an image reduce quality?',
        answer:
          'Slightly — compression is a trade-off. At quality 75–85 the change is usually invisible. Lower the quality further only when you need the smallest possible file.',
      },
      {
        question: 'How do I compress a PNG?',
        answer:
          'PNG is lossless, so the biggest savings come from converting a photographic PNG to JPG or WebP. For graphics, WebP lossless can also help.',
      },
      {
        question: 'What is the best format for small image files?',
        answer:
          'WebP usually gives the smallest files at a given visual quality. JPG is a close second for photos and is more universally compatible.',
      },
      {
        question: 'Are my uploads stored?',
        answer:
          'No. Files are processed on our own servers and deleted within 24 hours. No account is required.',
      },
    ],
    related: [
      { label: 'Image resizer', to: '/tools/image-resizer', description: 'Resize dimensions to shrink the file even more.' },
      { label: 'Convert JPG to WebP', to: '/tools/convert-jpg-to-webp', description: 'Switch to WebP for the smallest photo files.' },
      { label: 'Convert PNG to WebP', to: '/tools/convert-png-to-webp', description: 'Shrink PNG graphics by moving to WebP.' },
      { label: 'Image converter', to: '/tools/image-converter', description: 'Convert between JPG, PNG, WebP, AVIF, and GIF.' },
      { label: 'Image converter tutorial', to: '/tutorials/image/getting-started', description: 'Walk through quality, resize, and format settings.' },
    ],
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
    name: 'Remove Background from Image',
    h1: 'Remove Background from Image Online Free',
    tagline:
      'Automatically erase the background from any photo and download a clean, transparent PNG cutout.',
    metaTitle: 'Remove Background from Image Online Free | Media Manipulator',
    metaDescription:
      'Free online background remover. Automatically erase the background from any photo and download a transparent PNG. Runs on our own GPU — no third-party AI. Files deleted within 24 hours.',
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
      'Removing the background from a product shot, portrait, or logo used to require a manual selection in Photoshop. Media Manipulator does it automatically with an AI segmentation model running on our own GPU server — no third-party AI provider ever sees your image. The result is a clean, transparent PNG cutout, free, online, with no signup.',
    whatItDoes: [
      'Automatically detects the main subject and erases everything behind it.',
      'Outputs a transparent PNG so the cutout drops onto any background.',
      'Runs the segmentation model on our own GPU server — not a third-party API.',
      'Works on product photos, portraits, objects, and logos.',
    ],
    flowSteps: [
      { title: 'Upload a photo', description: 'Drop in any JPG, PNG, or WebP image with a clear subject.' },
      { title: 'AI finds the subject', description: 'A segmentation model separates subject from background on our GPU.' },
      { title: 'Background erased', description: 'Everything behind the subject becomes transparent.' },
      { title: 'Download transparent PNG', description: 'Save the cutout as a PNG with a transparent background.' },
    ],
    advancedDetails: [
      'Output is always PNG because transparency requires an alpha channel that JPG cannot store.',
      'Several segmentation models are available in the full image tool (general, portrait, lite) — this page is preset to the recommended general model.',
      'Clean separation works best when the subject is in clear focus and reasonably distinct from the background.',
      'For tricky edges like fine hair, results vary; the full image converter lets you switch models for a better cut.',
    ],
    whyItMatters: [
      'Transparent cutouts are essential for product listings, thumbnails, and design composites.',
      'Running locally on our GPU keeps your images away from third-party AI providers.',
      'Automatic removal saves the manual masking work that used to take minutes per image.',
    ],
    useCases: [
      { title: 'E-commerce products', description: 'Put products on a clean white or transparent background.' },
      { title: 'Profile and team photos', description: 'Cut out a person to drop onto a branded background.' },
      { title: 'Logos and graphics', description: 'Extract a logo from a solid background into a transparent PNG.' },
      { title: 'Design composites', description: 'Build collages and thumbnails from clean cutouts.' },
    ],
    whyMediaManipulator: [
      'AI background removal runs on our own GPU — no third-party AI provider sees your image.',
      'Output is preset to a transparent PNG, so there’s nothing to configure.',
      'Free, no signup, no watermarks, uploads deleted within 24 hours.',
    ],
    privacyNote: sharedPrivacyNote,
    supportedFormats: {
      supportedInputFormats: ['jpg', 'jpeg', 'png', 'webp'],
      supportedOutputFormats: ['png'],
      processingNotes: [
        'Output is always a transparent PNG. Background removal runs on our local GPU server, not a third-party API.',
      ],
    },
    faq: [
      {
        question: 'How do I remove the background from an image for free?',
        answer:
          'Upload your photo above and click convert — the tool is preset to the AI background remover. You get a transparent PNG cutout back. It is free with no signup.',
      },
      {
        question: 'What format is the result?',
        answer:
          'A PNG with a transparent background, because transparency needs an alpha channel that only formats like PNG support.',
      },
      {
        question: 'Does my image get sent to a third-party AI service?',
        answer:
          'No. Background removal runs on a GPU server we operate. Your image is never sent to OpenAI, Google, or any other third-party AI provider, and it is deleted within 24 hours.',
      },
      {
        question: 'What kinds of images work best?',
        answer:
          'Photos with a clear, in-focus subject that stands out from the background give the cleanest cutouts. Busy or low-contrast backgrounds can be harder.',
      },
      {
        question: 'Can I put the cutout on a new background?',
        answer:
          'Yes. Because the result is a transparent PNG, you can drop it onto any color or image in your editor or design tool.',
      },
    ],
    related: [
      { label: 'PNG converter', to: '/tools/png-converter', description: 'Convert other images to transparency-capable PNG.' },
      { label: 'Convert JPG to PNG', to: '/tools/convert-jpg-to-png', description: 'Turn a JPG into a PNG ready for transparency.' },
      { label: 'Image converter', to: '/tools/image-converter', description: 'Convert, resize, crop, and run AI tools in one upload.' },
      { label: 'Image resizer', to: '/tools/image-resizer', description: 'Resize the cutout to exact dimensions.' },
      { label: 'Image converter tutorial', to: '/tutorials/image/getting-started', description: 'Walk through every AI and image option.' },
    ],
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
    name: 'Image to PDF',
    h1: 'Convert Image to PDF Online Free',
    tagline:
      'Turn JPG, PNG, and other images into a clean, shareable PDF document in one click.',
    metaTitle: 'Convert Image to PDF Online Free | Media Manipulator',
    metaDescription:
      'Free online image to PDF converter. Turn JPG, PNG, and other images into a clean PDF document. No signup, no watermarks, files deleted within 24 hours.',
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
      'A PDF is the universal document format — it opens identically on every device, prints cleanly, and is the format most forms, schools, and offices ask for. Media Manipulator wraps your image in a single-page PDF at its native resolution so it looks exactly like the original. Free, online, no signup.',
    whatItDoes: [
      'Wraps a JPG, PNG, or other image into a single-page PDF document.',
      'Embeds JPG images losslessly and renders other formats crisply onto the page.',
      'Sizes the page to the image so nothing is cropped or stretched.',
      'Produces a standard PDF that opens in any reader, browser, or office suite.',
    ],
    flowSteps: [
      { title: 'Upload an image', description: 'Drop in any JPG, PNG, or other common image.' },
      { title: 'We build the page', description: 'The image is placed on a page sized to match it.' },
      { title: 'Generate PDF', description: 'A standard single-page PDF is assembled on our server.' },
      { title: 'Download PDF', description: 'Save a clean .pdf ready to share, print, or upload.' },
    ],
    advancedDetails: [
      'JPG inputs are embedded directly (no re-compression), so a photo keeps its exact original quality inside the PDF.',
      'PNG and other formats are flattened onto a white background and embedded losslessly — transparency becomes solid white, as PDF pages are opaque.',
      'The page is sized from the image dimensions at 96 DPI, a sensible default that avoids enlarging or shrinking the picture.',
      'To combine several images into one multi-page PDF, convert each and merge them in a PDF tool — single-image PDFs are the focus here.',
    ],
    whyItMatters: [
      'Many upload forms, job applications, and school portals accept PDF only.',
      'PDF prints predictably, while raw images can scale or tile unexpectedly.',
      'A PDF is easier to email and archive than a loose image file.',
    ],
    useCases: [
      { title: 'Document uploads', description: 'Turn a photo of a receipt or form into a PDF a portal will accept.' },
      { title: 'Printing', description: 'Get predictable print output from a single image.' },
      { title: 'Sharing scans', description: 'Convert a scanned page photo into a tidy PDF.' },
      { title: 'Archiving', description: 'Store images as PDFs alongside other documents.' },
    ],
    whyMediaManipulator: [
      'JPG embedding is lossless — your photo quality is preserved exactly.',
      'Runs on our own servers with no third-party processing of your file.',
      'Free, no signup, no watermarks, uploads deleted within 24 hours.',
    ],
    privacyNote: sharedPrivacyNote,
    supportedFormats: {
      supportedInputFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
      supportedOutputFormats: ['pdf'],
      processingNotes: [
        'Output is a single-page PDF. Transparency is flattened onto white because PDF pages are opaque.',
      ],
    },
    faq: [
      {
        question: 'How do I convert an image to PDF for free?',
        answer:
          'Upload your image above and click convert — the output is locked to PDF. You get a single-page PDF back. It is free with no signup.',
      },
      {
        question: 'Does converting to PDF reduce my image quality?',
        answer:
          'No. JPG images are embedded without re-compression, and other formats are embedded losslessly, so the picture inside the PDF matches your original.',
      },
      {
        question: 'Can I put multiple images into one PDF?',
        answer:
          'This tool creates a one-image-per-PDF document. To combine pages, convert each image and merge the PDFs in a dedicated merge tool.',
      },
      {
        question: 'What image formats can I convert to PDF?',
        answer:
          'JPG/JPEG and PNG are the most common; GIF and WebP are also supported. Each becomes a single-page PDF.',
      },
      {
        question: 'Are my uploads private?',
        answer:
          'Yes. Files are processed on our own servers and deleted within 24 hours. No account is required.',
      },
    ],
    related: [
      { label: 'Convert JPG to PDF', to: '/tools/convert-jpg-to-pdf', description: 'Focused JPG → PDF converter.' },
      { label: 'Convert PNG to PDF', to: '/tools/convert-png-to-pdf', description: 'Focused PNG → PDF converter.' },
      { label: 'PDF converter', to: '/tools/pdf-converter', description: 'Convert PDFs to images and back.' },
      { label: 'PDF to JPG', to: '/tools/pdf-to-jpg', description: 'Go the other way: render a PDF to JPG images.' },
      { label: 'Image converter', to: '/tools/image-converter', description: 'Convert between JPG, PNG, WebP, and more.' },
    ],
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
      'Free online JPG to PDF converter. Turn .jpg photos and scans into clean PDF documents with no quality loss. No signup, files deleted within 24 hours.',
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
      'JPG is the format your phone and camera shoot in, but a PDF is what most forms, applications, and offices want. Media Manipulator embeds your JPG directly into a PDF with no re-compression, so the document looks exactly like your photo and stays small. Free, online, no signup.',
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
      'Free, no signup, no watermarks, uploads deleted within 24 hours.',
    ],
    privacyNote: sharedPrivacyNote,
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
      {
        question: 'Are my uploads stored?',
        answer:
          'No. Files are processed on our own servers and deleted within 24 hours. No account is required.',
      },
    ],
    related: [
      { label: 'Convert PNG to PDF', to: '/tools/convert-png-to-pdf', description: 'Focused PNG → PDF converter.' },
      { label: 'Image to PDF', to: '/tools/image-to-pdf', description: 'Convert any image format to PDF.' },
      { label: 'JPG converter', to: '/tools/jpg-converter', description: 'Convert other formats to JPG first.' },
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
      'Free online PNG to PDF converter. Turn .png screenshots and graphics into crisp, lossless PDF documents. No signup, files deleted within 24 hours.',
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
      'PNG is the format for screenshots, diagrams, and graphics with crisp text and sharp edges. When you need to send or print one as a document, a PDF is the right wrapper. Media Manipulator embeds your PNG losslessly into a PDF so every edge stays sharp. Free, online, no signup.',
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
      'Free, no signup, no watermarks, uploads deleted within 24 hours.',
    ],
    privacyNote: sharedPrivacyNote,
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
      {
        question: 'Are my uploads private?',
        answer:
          'Yes. Files are processed on our own servers and deleted within 24 hours. No account is required.',
      },
    ],
    related: [
      { label: 'Convert JPG to PDF', to: '/tools/convert-jpg-to-pdf', description: 'Focused JPG → PDF converter.' },
      { label: 'Image to PDF', to: '/tools/image-to-pdf', description: 'Convert any image format to PDF.' },
      { label: 'PNG converter', to: '/tools/png-converter', description: 'Convert other formats to PNG first.' },
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
    name: 'PDF to JPG',
    h1: 'Convert PDF to JPG Online Free',
    tagline:
      'Render every page of a PDF to high-quality JPG images you can share, edit, or post.',
    metaTitle: 'Convert PDF to JPG Online Free | Media Manipulator',
    metaDescription:
      'Free online PDF to JPG converter. Render every page of a PDF to high-quality JPG images, downloaded as a ZIP. No signup, files deleted within 24 hours.',
    ogTitle: 'Convert PDF to JPG Online Free',
    ogDescription:
      'Render every page of a PDF to high-quality JPG images. Free, fast, no signup.',
    category: 'image',
    embed: {
      defaultMediaKind: 'pdf',
      defaultTask: 'pdf_to_jpg',
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
      'Sometimes you need a PDF as images — to post a page to social media, drop it into a slide, or edit it in an image editor. Media Manipulator renders each PDF page to a high-quality JPG using the same engine professional tools use. Choose every page or just the first, and pick the resolution. Free, online, no signup.',
    whatItDoes: [
      'Renders each PDF page to a JPG image at the DPI you choose.',
      'Converts all pages (downloaded as a ZIP) or just the first page (a single JPG).',
      'Names multi-page output clearly: page-001.jpg, page-002.jpg, and so on.',
      'Produces standard JPGs that open and edit anywhere.',
    ],
    flowSteps: [
      { title: 'Upload PDF', description: 'Drop in any .pdf document.' },
      { title: 'Pick pages and DPI', description: 'All pages or first only; 150 DPI is a good default.' },
      { title: 'Render to JPG', description: 'Poppler rasterizes each page to a JPG on our server.' },
      { title: 'Download', description: 'Get a single JPG, or a ZIP of one JPG per page.' },
    ],
    advancedDetails: [
      'Rendering uses Poppler (pdftoppm), the same engine behind many desktop PDF viewers, for accurate page output.',
      'Higher DPI yields sharper, larger images — 150 DPI suits screen use, 300 DPI suits printing.',
      'Multi-page PDFs are packaged into a single .zip so you get one tidy download instead of many files.',
      'There is a page-count limit so very large PDFs fail fast with a clear message rather than running indefinitely.',
    ],
    whyItMatters: [
      'JPG pages are easy to post, embed in slides, or drop into an editor.',
      'Images are accepted by tools and platforms that cannot take a PDF.',
      'A rendered page captures the exact visual layout of the document.',
    ],
    useCases: [
      { title: 'Social posts', description: 'Share a PDF page as an image on social platforms.' },
      { title: 'Presentations', description: 'Drop a document page into a slide as an image.' },
      { title: 'Editing', description: 'Open a PDF page in an image editor for markup.' },
      { title: 'Thumbnails', description: 'Generate a JPG preview of the first page.' },
    ],
    whyMediaManipulator: [
      'Poppler-based rendering for accurate, high-quality page images.',
      'Clear, tidy ZIP packaging with sortable page-numbered filenames.',
      'Free, no signup, no watermarks, uploads deleted within 24 hours.',
    ],
    privacyNote: sharedPrivacyNote,
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
        question: 'How do I convert a PDF to JPG for free?',
        answer:
          'Upload your .pdf above, choose all pages or just the first, pick a DPI, and click convert. It is free with no signup.',
      },
      {
        question: 'Will I get one image or many?',
        answer:
          'Choose "all pages" to get a ZIP containing one JPG per page (page-001.jpg, page-002.jpg, …), or "first page only" to get a single JPG.',
      },
      {
        question: 'What DPI should I pick?',
        answer:
          '150 DPI is great for on-screen use and sharing. Use 300 DPI when you need print-quality images. Higher DPI means larger files.',
      },
      {
        question: 'Is there a limit on PDF size?',
        answer:
          'Very large PDFs (beyond a generous page limit) are rejected with a clear message so the conversion stays fast and reliable.',
      },
      {
        question: 'Are my uploads private?',
        answer:
          'Yes. PDFs are processed on our own servers and deleted within 24 hours. No account is required.',
      },
    ],
    related: [
      { label: 'PDF to PNG', to: '/tools/pdf-to-png', description: 'Render PDF pages to lossless PNG instead.' },
      { label: 'PDF converter', to: '/tools/pdf-converter', description: 'Convert PDFs to images and images to PDF.' },
      { label: 'Image converter', to: '/tools/image-converter', description: 'Convert the rendered images between formats.' },
      { label: 'Image to PDF', to: '/tools/image-to-pdf', description: 'Go the other way: turn images into a PDF.' },
      { label: 'Compress image', to: '/tools/compress-image', description: 'Shrink the rendered JPGs for the web.' },
    ],
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
      'Free online PDF to PNG converter. Render every page of a PDF to crisp, lossless PNG images, downloaded as a ZIP. No signup, files deleted within 24 hours.',
    ogTitle: 'Convert PDF to PNG Online Free',
    ogDescription:
      'Render every page of a PDF to crisp, lossless PNG images. Free, fast, no signup.',
    category: 'image',
    embed: {
      defaultMediaKind: 'pdf',
      defaultTask: 'pdf_to_png',
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
      'PNG is the best choice when a PDF page has crisp text, thin lines, or diagrams you want to keep razor-sharp. Media Manipulator renders each page to a lossless PNG with Poppler, so there are no JPEG artifacts around text. Choose every page or just the first, and pick the resolution. Free, online, no signup.',
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
      'Free, no signup, no watermarks, uploads deleted within 24 hours.',
    ],
    privacyNote: sharedPrivacyNote,
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
          'Upload your .pdf above, choose all pages or just the first, pick a DPI, and click convert. It is free with no signup.',
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
      {
        question: 'Are my uploads stored?',
        answer:
          'No. PDFs are processed on our own servers and deleted within 24 hours. No account is required.',
      },
    ],
    related: [
      { label: 'PDF to JPG', to: '/tools/pdf-to-jpg', description: 'Render PDF pages to compact JPG instead.' },
      { label: 'PDF converter', to: '/tools/pdf-converter', description: 'Convert PDFs to images and images to PDF.' },
      { label: 'Image converter', to: '/tools/image-converter', description: 'Convert the rendered images between formats.' },
      { label: 'Image to PDF', to: '/tools/image-to-pdf', description: 'Go the other way: turn images into a PDF.' },
      { label: 'PNG converter', to: '/tools/png-converter', description: 'Convert the rendered pages to other formats.' },
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
      'Free online PDF converter. Convert PDF to JPG or PNG images, and convert images to PDF. No signup, no watermarks, files deleted within 24 hours.',
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
      'The PDF converter handles both directions in one place: render a PDF’s pages to JPG or PNG images, or wrap an image into a PDF document. Upload a PDF and you get image-export controls; upload an image and you get image-to-PDF. Everything runs on our own servers — free, online, no signup.',
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
      'Free, no signup, no watermarks, uploads deleted within 24 hours.',
    ],
    privacyNote: sharedPrivacyNote,
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
      {
        question: 'Is it really free?',
        answer:
          'Yes — no signup, no watermarks, and your files are deleted within 24 hours.',
      },
      {
        question: 'Are my uploads private?',
        answer:
          'Yes. Everything is processed on our own servers and deleted within 24 hours. No account is required.',
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
      'Free online HEIC to JPG converter. Turn iPhone .heic/.heif photos into universally compatible JPG files. No signup, files deleted within 24 hours.',
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
      'HEIC is the high-efficiency format iPhones use to save space, but it won’t open on many Windows PCs, websites, or older apps. Media Manipulator converts your HEIC photos to JPG — the format that works everywhere — with correct orientation and the quality you choose. Free, online, no signup.',
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
      'Free, no signup, no watermarks, uploads deleted within 24 hours.',
    ],
    privacyNote: sharedPrivacyNote,
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
          'Upload your .heic photo above, pick a quality, and click convert. You get a standard .jpg back. It is free with no signup.',
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
      {
        question: 'Are my uploads private?',
        answer:
          'Yes. Files are processed on our own servers and deleted within 24 hours. No account is required.',
      },
    ],
    related: [
      { label: 'JPG converter', to: '/tools/jpg-converter', description: 'Convert any image to JPG.' },
      { label: 'Image converter', to: '/tools/image-converter', description: 'Convert between JPG, PNG, WebP, and more.' },
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
      'Free online AVIF to JPG converter. Turn .avif images into universally compatible JPG files at the quality you choose. No signup, files deleted within 24 hours.',
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
      'AVIF is a cutting-edge image format that produces tiny files, but plenty of apps, editors, and upload forms still can’t open it. Media Manipulator converts AVIF to JPG so your image works everywhere. Pick a quality and download. Free, online, no signup.',
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
      'Free, no signup, no watermarks, uploads deleted within 24 hours.',
    ],
    privacyNote: sharedPrivacyNote,
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
          'Upload your .avif image above, pick a quality, and click convert. You get a standard .jpg back. It is free with no signup.',
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
      {
        question: 'Are my uploads stored?',
        answer:
          'No. Files are processed on our own servers and deleted within 24 hours. No account is required.',
      },
    ],
    related: [
      { label: 'Convert AVIF to PNG', to: '/tools/convert-avif-to-png', description: 'Keep transparency with a PNG instead.' },
      { label: 'JPG converter', to: '/tools/jpg-converter', description: 'Convert any image to JPG.' },
      { label: 'Image converter', to: '/tools/image-converter', description: 'Convert between JPG, PNG, WebP, and more.' },
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
      'Free online AVIF to PNG converter. Turn .avif images into lossless PNG files that preserve transparency and open in any editor. No signup, files deleted within 24 hours.',
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
      'When an AVIF image has transparency — like a logo or a cutout — converting to JPG would flatten it. PNG keeps the alpha channel and is lossless, so it’s the right target for graphics. Media Manipulator converts AVIF to PNG with transparency intact. Free, online, no signup.',
    whatItDoes: [
      'Converts AVIF images to lossless PNG.',
      'Preserves the alpha channel so transparent AVIFs stay transparent.',
      'Produces a PNG that opens in any editor, viewer, or design tool.',
      'Keeps the visible content identical — only the encoding changes.',
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
      'Free, no signup, no watermarks, uploads deleted within 24 hours.',
    ],
    privacyNote: sharedPrivacyNote,
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
          'Upload your .avif image above and click convert — the output is a lossless .png with transparency preserved. It is free with no signup.',
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
      {
        question: 'Are my uploads private?',
        answer:
          'Yes. Files are processed on our own servers and deleted within 24 hours. No account is required.',
      },
    ],
    related: [
      { label: 'Convert AVIF to JPG', to: '/tools/convert-avif-to-jpg', description: 'Convert AVIF to a compact JPG instead.' },
      { label: 'PNG converter', to: '/tools/png-converter', description: 'Convert any image to lossless PNG.' },
      { label: 'Image converter', to: '/tools/image-converter', description: 'Convert between JPG, PNG, WebP, and more.' },
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
      'Free online SVG to PNG converter. Rasterize SVG icons and logos into PNG images at the size you choose. No signup, files deleted within 24 hours.',
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
      'SVGs are perfect vectors, but many platforms — social networks, marketplaces, slide tools, and apps — only accept raster images like PNG. Media Manipulator rasterizes your SVG into a crisp, transparency-preserving PNG at the size you choose. SVGs are processed as untrusted input with a safe renderer. Free, online, no signup.',
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
      'Free, no signup, no watermarks, uploads deleted within 24 hours.',
    ],
    privacyNote: sharedPrivacyNote,
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
          'Upload your .svg above, optionally set a width or height, and click convert. You get a crisp .png back. It is free with no signup.',
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
      {
        question: 'Are my uploads stored?',
        answer:
          'No. Files are processed on our own servers and deleted within 24 hours. No account is required.',
      },
    ],
    related: [
      { label: 'Convert PNG to SVG', to: '/tools/convert-png-to-svg', description: 'Go the other way: vectorize a PNG into SVG.' },
      { label: 'SVG converter', to: '/tools/svg-converter', description: 'The full SVG conversion hub.' },
      { label: 'PNG converter', to: '/tools/png-converter', description: 'Convert the rendered PNG to other formats.' },
      { label: 'PNG to ICO', to: '/tools/png-to-ico', description: 'Turn the PNG into a favicon.' },
      { label: 'Image converter', to: '/tools/image-converter', description: 'Convert between image formats.' },
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
      'Free online PNG to SVG vectorizer. Trace logos, icons, and line art into real scalable SVG paths. Best for simple graphics, not photos. No signup, deleted within 24 hours.',
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
      'True PNG-to-SVG conversion means tracing your image into real vector paths that scale to any size without pixelation. Media Manipulator uses potrace to vectorize your PNG — ideal for logos, icons, signatures, and black-and-white line art. This is genuine vectorization, not a PNG hidden inside an SVG. It is not designed to turn photographs into clean vector art. Free, online, no signup.',
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
      'Free, no signup, no watermarks, uploads deleted within 24 hours.',
    ],
    privacyNote: sharedPrivacyNote,
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
          'Upload your .png above, adjust the threshold if needed, and click convert. You get a real vector .svg back. It is free with no signup.',
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
      {
        question: 'Are my uploads private?',
        answer:
          'Yes. Files are processed on our own servers and deleted within 24 hours. No account is required.',
      },
    ],
    related: [
      { label: 'Convert SVG to PNG', to: '/tools/convert-svg-to-png', description: 'Go the other way: rasterize an SVG to PNG.' },
      { label: 'SVG converter', to: '/tools/svg-converter', description: 'The full SVG conversion hub.' },
      { label: 'PNG converter', to: '/tools/png-converter', description: 'Convert a PNG to other raster formats.' },
      { label: 'PNG to ICO', to: '/tools/png-to-ico', description: 'Turn a PNG into a favicon.' },
      { label: 'Image converter', to: '/tools/image-converter', description: 'Convert between image formats.' },
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
      'Free online PNG to ICO converter. Generate a real multi-size .ico favicon (16–256px) for websites and Windows icons. No signup, files deleted within 24 hours.',
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
      'A favicon needs to be a real .ico file containing several sizes so browsers and Windows can pick the right one. Media Manipulator generates a genuine multi-size ICO from your PNG — not a renamed file — packing the standard 16–256 px icon ladder. Free, online, no signup.',
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
      'Free, no signup, no watermarks, uploads deleted within 24 hours.',
    ],
    privacyNote: sharedPrivacyNote,
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
          'Upload your .png above and click convert — you get a real multi-size .ico back. It is free with no signup.',
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
      {
        question: 'Are my uploads private?',
        answer:
          'Yes. Files are processed on our own servers and deleted within 24 hours. No account is required.',
      },
    ],
    related: [
      { label: 'PNG converter', to: '/tools/png-converter', description: 'Convert any image to PNG first.' },
      { label: 'Convert SVG to PNG', to: '/tools/convert-svg-to-png', description: 'Rasterize an SVG logo before making an icon.' },
      { label: 'Image resizer', to: '/tools/image-resizer', description: 'Make a square image before generating the icon.' },
      { label: 'Image converter', to: '/tools/image-converter', description: 'Convert between image formats.' },
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
      'Convert SVG to PNG and vectorize PNG to SVG — the complete SVG conversion hub.',
    metaTitle: 'Free SVG Converter Online | Media Manipulator',
    metaDescription:
      'Free online SVG converter. Rasterize SVG to PNG, or vectorize PNG to a real SVG. No signup, no watermarks, files deleted within 24 hours.',
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
      'The SVG converter handles both directions: rasterize an SVG into a PNG for platforms that don’t accept vectors, or vectorize a PNG logo into a real, scalable SVG. Upload an SVG to get a PNG, or upload a raster and pick SVG output for true potrace vectorization. Free, online, no signup.',
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
      'Free, no signup, no watermarks, uploads deleted within 24 hours.',
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
          'Yes. Files are processed on our own servers and deleted within 24 hours. No account is required.',
      },
    ],
    related: [
      { label: 'Convert SVG to PNG', to: '/tools/convert-svg-to-png', description: 'Focused SVG → PNG rasterizer.' },
      { label: 'Convert PNG to SVG', to: '/tools/convert-png-to-svg', description: 'Focused PNG → SVG vectorizer.' },
      { label: 'PNG to ICO', to: '/tools/png-to-ico', description: 'Turn a rasterized logo into a favicon.' },
      { label: 'PNG converter', to: '/tools/png-converter', description: 'Convert images to PNG.' },
      { label: 'Image converter', to: '/tools/image-converter', description: 'Convert between image formats.' },
    ],
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
      'Same 24-hour deletion privacy model as the rest of the toolset.',
    ],
    privacyNote: sharedPrivacyNote,
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
      title: 'Isolate vocals',
      description:
        'Upload a song. After it loads, enable the Isolate Vocals AI tool in the audio form below. Output as WAV for the cleanest stem, or MP3 for a smaller file.',
    },
    intro:
      'AI-based source separation can pull a vocal track out of a finished mix — great for remixes, covers, karaoke prep, or transcribing lyrics. Media Manipulator runs the separation on our own GPU server. The result is a single vocal stem you can download and use anywhere — as long as you have the right to do so for your source material.',
    whatItDoes: [
      'Runs AI-based source separation to extract the vocal track from a music recording.',
      'Outputs a single isolated vocal stem in WAV or MP3.',
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
        description: 'Save the isolated vocals as WAV or MP3.',
      },
    ],
    advancedDetails: [
      'Source separation is inherently imperfect — reverb, harmonies, and heavy effects bleed into the output.',
      'WAV output preserves the most detail, especially for further editing in a DAW.',
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
    privacyNote: sharedPrivacyNote,
    faq: [
      {
        question: 'Is this fully clean separation?',
        answer:
          'No source separation tool is perfect. Expect some artifacts, especially around heavy reverb and harmonies. WAV output gives the most material to clean up afterward in a DAW.',
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
        'Upload any image and choose the output format, quality, and resize/crop settings.',
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
    privacyNote: sharedPrivacyNote,
    faq: [
      { question: 'What is the best image format?', answer: 'It depends — WebP/AVIF for the web, PNG for transparency, JPG for compatibility.' },
      { question: 'Can I batch-convert?', answer: 'The free tool converts one image at a time. Run multiple conversions sequentially.' },
      { question: 'Will it strip metadata?', answer: 'Only if you set Metadata mode to "Strip". The default is to keep metadata.' },
      { question: 'Does it work on HEIC?', answer: 'Yes — iPhone HEIC photos convert cleanly to JPG, PNG, or WebP.' },
    ],
    related: [
      { label: 'JPG converter', to: '/tools/jpg-converter', description: 'Convert any image to a universal JPG.' },
      { label: 'PNG converter', to: '/tools/png-converter', description: 'Convert any image to a lossless PNG.' },
      { label: 'Image resizer', to: '/tools/image-resizer', description: 'Resize to exact pixel dimensions.' },
      { label: 'Compress image', to: '/tools/compress-image', description: 'Shrink image file size for the web.' },
      { label: 'Image to PDF', to: '/tools/image-to-pdf', description: 'Wrap an image into a PDF document.' },
      { label: 'PDF converter', to: '/tools/pdf-converter', description: 'Convert PDFs to images and back.' },
      { label: 'Convert HEIC to JPG', to: '/tools/convert-heic-to-jpg', description: 'Convert iPhone HEIC photos to JPG.' },
      { label: 'SVG converter', to: '/tools/svg-converter', description: 'Rasterize SVG to PNG or vectorize PNG to SVG.' },
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
        'Upload any video and choose the target container/codec. The "medium" quality preset is a good default.',
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
    privacyNote: sharedPrivacyNote,
    faq: [
      { question: 'What output format is best?', answer: 'MP4 with H.264 for compatibility, WebM with VP9 for the smallest web files.' },
      { question: 'Can I trim before converting?', answer: 'Yes — the trim section of the form lets you cut the clip down before re-encoding.' },
      { question: 'Will my audio stay in sync?', answer: 'Yes — FFmpeg keeps A/V sync. If you change frame rate or speed, audio is resampled accordingly.' },
      { question: 'Is there a file-size limit?', answer: 'Very large files may be rejected on the free tier. Try lowering the resolution first.' },
    ],
    related: [
      { label: 'MP4 converter', to: '/tools/mp4-converter', description: 'Convert almost any video into a universal MP4.' },
      { label: 'Convert MOV to MP4', to: '/tools/convert-mov-to-mp4', description: 'Make QuickTime/iPhone footage play everywhere.' },
      { label: 'Convert WebM to MP4', to: '/tools/convert-webm-to-mp4', description: 'Turn web video into an editable MP4.' },
      { label: 'Convert MP4 to WebM', to: '/tools/convert-mp4-to-webm', description: 'Shrink MP4 into VP9 WebM for the web.' },
      { label: 'Compress video', to: '/tools/compress-video', description: 'Focused compressor for shrinking video files.' },
      { label: 'Convert video to GIF', to: '/tools/convert-video-to-animated-gif', description: 'Turn short clips into animated GIFs.' },
      { label: 'MP4 to MP3', to: '/tools/mp4-to-mp3', description: 'Extract the audio track from an MP4 as MP3.' },
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
      'Convert almost any video — MOV, WebM, AVI, MKV, FLV, or WMV — into a universally compatible MP4 (H.264 + AAC).',
    metaTitle: 'Free MP4 Converter Online | Media Manipulator',
    metaDescription:
      'Free online MP4 converter. Convert MOV, WebM, AVI, MKV, FLV, and WMV to MP4 (H.264 + AAC) that plays everywhere. No watermark, no signup, deleted in 24 hours.',
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
      'MP4 is the format that plays everywhere — phones, browsers, TVs, editors, and social platforms all accept it. If you have a clip in MOV, WebM, AVI, MKV, FLV, or WMV that will not open or upload, converting it to MP4 (H.264 video + AAC audio) is almost always the fix. Media Manipulator re-encodes your video to a clean, broadly compatible MP4 with no watermark.',
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
      'Free, no watermark, no signup, and files are deleted within 24 hours.',
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
      'Free online MOV to MP4 converter. Convert QuickTime and iPhone .mov videos to MP4 that plays everywhere. No watermark, no signup, deleted within 24 hours.',
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
      'Lets you trim, resize, and pick a quality preset before exporting.',
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
      'Free, no watermark, no signup, deleted within 24 hours.',
    ],
    privacyNote: sharedPrivacyNote,
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
      { question: 'Is there a watermark or signup?', answer: 'No watermark and no account required. Files are deleted within 24 hours.' },
    ],
    related: [
      { label: 'MP4 converter', to: '/tools/mp4-converter', description: 'Convert any video to MP4.' },
      { label: 'Compress video', to: '/tools/compress-video', description: 'Shrink the MP4 for email or the web.' },
      { label: 'Convert video to GIF', to: '/tools/convert-video-to-animated-gif', description: 'Trim a clip and export an animated GIF.' },
      { label: 'Video converter', to: '/tools/video-converter', description: 'Full control over container, codec, and audio.' },
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
      'Lets you trim, resize, and pick a quality preset before exporting.',
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
      'Free, no watermark, no signup, deleted within 24 hours.',
    ],
    privacyNote: sharedPrivacyNote,
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
      { question: 'Is it free?', answer: 'Yes, free with no watermark and no signup. Files are deleted within 24 hours.' },
    ],
    related: [
      { label: 'MP4 converter', to: '/tools/mp4-converter', description: 'Convert any video to MP4.' },
      { label: 'Convert MP4 to WebM', to: '/tools/convert-mp4-to-webm', description: 'The reverse — make a small VP9 WebM.' },
      { label: 'Compress video', to: '/tools/compress-video', description: 'Shrink the MP4 for sharing.' },
      { label: 'Video converter', to: '/tools/video-converter', description: 'Full control over container and codec.' },
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
      'Free online AVI to MP4 converter. Convert old .avi (Xvid/DivX) videos to MP4 (H.264 + AAC) that plays everywhere. No watermark, no signup, deleted in 24 hours.',
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
      'Lets you trim, resize, and pick a quality preset before exporting.',
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
      'Free, no watermark, no signup, deleted within 24 hours.',
    ],
    privacyNote: sharedPrivacyNote,
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
      { question: 'Is it free?', answer: 'Yes — no watermark, no signup. Files are deleted within 24 hours.' },
    ],
    related: [
      { label: 'MP4 converter', to: '/tools/mp4-converter', description: 'Convert any video to MP4.' },
      { label: 'Compress video', to: '/tools/compress-video', description: 'Shrink the MP4 further.' },
      { label: 'Video converter', to: '/tools/video-converter', description: 'Full control over container and codec.' },
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
      'Lets you trim, resize, and pick a quality preset before exporting.',
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
      'Free, no watermark, no signup, deleted within 24 hours.',
    ],
    privacyNote: sharedPrivacyNote,
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
      { question: 'Is it free?', answer: 'Yes — no watermark, no signup. Files are deleted within 24 hours.' },
    ],
    related: [
      { label: 'MP4 converter', to: '/tools/mp4-converter', description: 'Convert any video to MP4.' },
      { label: 'Compress video', to: '/tools/compress-video', description: 'Shrink the MP4 for sharing.' },
      { label: 'Video converter', to: '/tools/video-converter', description: 'Full control over container and codec.' },
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
      'Free online MP4 to WebM converter. Re-encode MP4 to VP9 + Opus WebM for smaller, faster web video. No watermark, no signup, files deleted within 24 hours.',
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
      'Lets you trim, resize, and pick a quality preset before exporting.',
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
      'Free, no watermark, no signup, deleted within 24 hours.',
    ],
    privacyNote: sharedPrivacyNote,
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
      { question: 'Is it free?', answer: 'Yes — no watermark, no signup. Files are deleted within 24 hours.' },
    ],
    related: [
      { label: 'Convert WebM to MP4', to: '/tools/convert-webm-to-mp4', description: 'The reverse direction.' },
      { label: 'MP4 converter', to: '/tools/mp4-converter', description: 'Convert any video to MP4.' },
      { label: 'Compress video', to: '/tools/compress-video', description: 'Shrink video without changing the container.' },
      { label: 'Video converter', to: '/tools/video-converter', description: 'Full control over container and codec.' },
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
      'Extract the audio track from an MP4 video and save it as a clean MP3 file.',
    metaTitle: 'Convert MP4 to MP3 Online Free | Media Manipulator',
    metaDescription:
      'Free online MP4 to MP3 converter. Extract the audio from an MP4 video and save it as MP3. No watermark, no signup, files deleted within 24 hours.',
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
      'MP4 to MP3 is really an audio-extraction job: an MP4 is a video container, and you just want the sound. Media Manipulator pulls the first audio track out of your MP4 and re-encodes it to MP3, so you get music, a podcast, a lecture, or a voice memo as a small audio file that plays in any music app.',
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
      'Free, no watermark, no signup, deleted within 24 hours.',
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
      { question: 'Is it free?', answer: 'Yes — no watermark, no signup. Files are deleted within 24 hours.' },
    ],
    related: [
      { label: 'Video to MP3', to: '/tools/video-to-mp3', description: 'Same thing for any video format.' },
      { label: 'Extract audio from video', to: '/tools/extract-audio-from-video', description: 'Choose MP3, WAV, M4A, AAC, FLAC, or OGG.' },
      { label: 'Audio converter', to: '/tools/audio-converter', description: 'Convert the MP3 to other audio formats.' },
    ],
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
      'Extract the audio from any video — MP4, MOV, MKV, WebM, AVI — and save it as MP3.',
    metaTitle: 'Convert Video to MP3 Online Free | Media Manipulator',
    metaDescription:
      'Free online video to MP3 converter. Extract the audio from MP4, MOV, MKV, WebM, and AVI videos and save it as MP3. No watermark, no signup, deleted in 24 hours.',
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
      'Sometimes you just want the audio out of a video — and not always from an MP4. Media Manipulator extracts the first audio track from any common video container (MP4, MOV, MKV, WebM, AVI, M4V) and encodes it to MP3 by default, with other audio formats available if you need them.',
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
      'Free, no watermark, no signup, deleted within 24 hours.',
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
      { question: 'Is it free?', answer: 'Yes — no watermark, no signup. Files are deleted within 24 hours.' },
    ],
    related: [
      { label: 'MP4 to MP3', to: '/tools/mp4-to-mp3', description: 'The MP4-specific version.' },
      { label: 'Extract audio from video', to: '/tools/extract-audio-from-video', description: 'Full extract-audio tool with every format.' },
      { label: 'Audio converter', to: '/tools/audio-converter', description: 'Convert the extracted audio to other formats.' },
    ],
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
      'Turn a short MP4 clip into a clean, looping animated GIF for chat, forums, and the web.',
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
      'Animated GIFs autoplay and loop inline almost everywhere — chat apps, forums, READMEs, and email. Media Manipulator turns a short MP4 into a clean GIF using a palette-aware FFmpeg pipeline plus gifsicle optimization. For the smallest, sharpest result, trim the clip to a few seconds before converting.',
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
      'Free, no watermark, no signup, deleted within 24 hours.',
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
      { question: 'Is it free?', answer: 'Yes — no watermark, no signup. Files are deleted within 24 hours.' },
    ],
    related: [
      { label: 'Video to GIF', to: '/tools/video-to-gif', description: 'Same thing for any video format.' },
      { label: 'GIF converter', to: '/tools/gif-converter', description: 'The GIF hub — make and tune GIFs.' },
      { label: 'Convert video to animated GIF', to: '/tools/convert-video-to-animated-gif', description: 'Full video-to-GIF tool.' },
    ],
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
      'Make a looping animated GIF from any short video clip — MP4, MOV, WebM, MKV, or AVI.',
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
      'Turn any short video clip into a looping animated GIF — not just MP4. Media Manipulator accepts MP4, MOV, WebM, MKV, and AVI and produces a clean GIF using a palette-aware FFmpeg pipeline plus gifsicle. Trim to a few seconds before converting for the smallest, sharpest loop.',
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
      'Free, no watermark, no signup, deleted within 24 hours.',
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
      { question: 'Is it free?', answer: 'Yes — no watermark, no signup. Files are deleted within 24 hours.' },
    ],
    related: [
      { label: 'MP4 to GIF', to: '/tools/mp4-to-gif', description: 'The MP4-specific version.' },
      { label: 'GIF converter', to: '/tools/gif-converter', description: 'The GIF hub — make and tune GIFs.' },
      { label: 'Video converter', to: '/tools/video-converter', description: 'Convert between video formats.' },
    ],
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
      'Make animated GIFs from video clips and tune them — width, frame rate, colors, and optimization — in one place.',
    metaTitle: 'Free GIF Converter Online | Media Manipulator',
    metaDescription:
      'Free online GIF converter. Make animated GIFs from MP4, MOV, WebM, and more and tune width and frame rate. No watermark, no signup, deleted within 24 hours.',
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
      'The GIF converter is your hub for turning short video clips into clean, looping animated GIFs. GIF is preselected so you can jump straight into tuning width, frame rate, color count, and optimization — but the output stays unlocked, so you can also export MP4 or WebM from the same clip when a GIF is not the right fit.',
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
      'Free, no watermark, no signup, deleted within 24 hours.',
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
      { question: 'Is it free?', answer: 'Yes — no watermark, no signup. Files are deleted within 24 hours.' },
    ],
    related: [
      { label: 'MP4 to GIF', to: '/tools/mp4-to-gif', description: 'Output locked to GIF for MP4 input.' },
      { label: 'Video to GIF', to: '/tools/video-to-gif', description: 'GIF from any video format.' },
      { label: 'Convert video to animated GIF', to: '/tools/convert-video-to-animated-gif', description: 'The classic video-to-GIF tool.' },
      { label: 'Image converter', to: '/tools/image-converter', description: 'Convert still images between JPG, PNG, WebP, and GIF.' },
    ],
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
      'Shrink any video for email, social, and the web with simple presets — no watermark, no signup.',
    metaTitle: 'Compress Video Online Free | Media Manipulator',
    metaDescription:
      'Free online video compressor. Reduce video file size with simple presets while keeping good quality. MP4 output, no watermark, no signup, deleted in 24 hours.',
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
      'Big video files are hard to email, slow to upload, and expensive to host. The Media Manipulator video compressor re-encodes your clip with an efficient codec at the level you choose, so you get a much smaller file that still looks good. Pick a preset, optionally downscale the resolution or strip the audio, and download — no watermark and no account.',
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
      'Free, no watermark, no signup, deleted within 24 hours.',
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
      'Reduce MP4 file size while keeping H.264 compatibility — perfect for email, social, and the web.',
    metaTitle: 'Compress MP4 Online Free | Media Manipulator',
    metaDescription:
      'Free online MP4 compressor. Reduce MP4 file size with simple presets and H.264 + AAC output that plays everywhere. No watermark, no signup, deleted in 24 hours.',
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
      'MP4 is the format everyone uses, but the files can be large. This MP4 compressor re-encodes your video with efficient H.264 (or H.265) at the level you choose and keeps the output in a universally compatible MP4 container, so the smaller file still plays on every device and platform.',
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
      'Free, no watermark, no signup, deleted within 24 hours.',
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
      { question: 'Is it free?', answer: 'Yes — no watermark, no signup. Files are deleted within 24 hours.' },
    ],
    related: [
      { label: 'Video compressor', to: '/tools/video-compressor', description: 'Compress any video format.' },
      { label: 'MP4 converter', to: '/tools/mp4-converter', description: 'Convert other formats into MP4.' },
      { label: 'MP4 trimmer', to: '/tools/mp4-trimmer', description: 'Cut an MP4 down before compressing.' },
      { label: 'Video converter', to: '/tools/video-converter', description: 'Full control over container and codec.' },
    ],
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
    name: 'Video Trimmer',
    h1: 'Trim Video Online Free',
    tagline:
      'Cut a clip to the part you want with a fast, quality-preserving trim — no re-encode when possible.',
    metaTitle: 'Trim Video Online Free | Media Manipulator',
    metaDescription:
      'Free online video trimmer. Set a start and end time and cut your clip with a fast, lossless trim. MP4 output, no watermark, no signup, deleted in 24 hours.',
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
      'Trimming is the most common video edit — keep the good part, drop the rest. The Media Manipulator video trimmer lets you set a start and end time numerically or drag a visual range, then performs a fast stream-copy cut that preserves the original quality with no re-encode when possible. Output defaults to MP4.',
    whatItDoes: [
      'Cuts a video to a single start-to-end range.',
      'Prefers a lossless stream-copy (no re-encode, no quality loss, very fast).',
      'Falls back to a re-encode automatically when the container/codec needs it.',
      'Lets you pick the range numerically or with a visual scrubber.',
    ],
    flowSteps: [
      { title: 'Upload your video', description: 'Drop in any common video file.' },
      { title: 'Set start and end', description: 'Type the times or drag the visual range.' },
      { title: 'Trim', description: 'We cut losslessly when possible, or re-encode for accuracy.' },
      { title: 'Download', description: 'Save your trimmed clip.' },
    ],
    advancedDetails: [
      'The fast path is a stream-copy: ffmpeg seeks to the start and copies the segment without re-encoding, so there is zero quality loss.',
      'Stream-copy cuts at the nearest keyframe; tick "Re-encode for a frame-accurate cut" when you need the exact frame.',
      'MP4 re-encode fallback uses H.264 + AAC + yuv420p + faststart.',
    ],
    whyItMatters: [
      'Removing dead air at the start/end makes any clip better.',
      'A lossless trim keeps the original quality and is nearly instant.',
      'Trimming first makes converting, compressing, or GIF-ing faster.',
    ],
    useCases: [
      { title: 'Cut the intro/outro', description: 'Drop the boring beginning or end of a recording.' },
      { title: 'Clip a highlight', description: 'Keep just the moment you want to share.' },
      { title: 'Prep for upload', description: 'Trim before posting to social platforms.' },
      { title: 'Shorten for GIF', description: 'Cut to a few seconds before making a GIF.' },
    ],
    whyMediaManipulator: [
      'Quality-preserving stream-copy by default.',
      'Numeric and visual range selection in one panel.',
      'Free, no watermark, no signup, deleted within 24 hours.',
    ],
    privacyNote: sharedPrivacyNote,
    supportedFormats: {
      supportedInputFormats: ['mp4', 'mov', 'mkv', 'webm', 'avi', 'm4v'],
      supportedOutputFormats: ['mp4', 'mov', 'webm'],
      processingNotes: ['Stream-copy when possible (no quality loss); re-encode fallback uses H.264 + AAC for MP4.'],
    },
    faq: [
      { question: 'How do I trim a video online?', answer: 'Upload it, set a start and end time (or drag the visual range), and download the trimmed clip.' },
      { question: 'Does trimming reduce quality?', answer: 'No — the default lossless stream-copy keeps the original quality. Only the frame-accurate re-encode option re-compresses.' },
      { question: 'Why does my cut start slightly early?', answer: 'Lossless cuts snap to the nearest keyframe. Enable the frame-accurate re-encode option to cut at the exact time.' },
      { question: 'What output format do I get?', answer: 'MP4 by default; you can also choose MOV or WebM.' },
      { question: 'Is it free?', answer: 'Yes — no watermark, no signup. Files are deleted within 24 hours.' },
    ],
    related: [
      { label: 'MP4 trimmer', to: '/tools/mp4-trimmer', description: 'Trim MP4 files specifically.' },
      { label: 'Video cutter', to: '/tools/video-cutter', description: 'Cut a clip out of a video.' },
      { label: 'Cut video online', to: '/tools/cut-video-online', description: 'Quick browser-based cutting.' },
      { label: 'Video compressor', to: '/tools/video-compressor', description: 'Shrink the clip after trimming.' },
    ],
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
      'Cut an MP4 to the part you want with a fast, lossless trim and an MP4 output.',
    metaTitle: 'Trim MP4 Online Free | Media Manipulator',
    metaDescription:
      'Free online MP4 trimmer and cutter. Set a start and end time and cut your MP4 losslessly. MP4 output, no watermark, no signup, deleted within 24 hours.',
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
      'The MP4 trimmer is a focused tool for cutting MP4 videos down to the part you want. Set the start and end, and Media Manipulator performs a fast stream-copy that keeps the original H.264 quality with no re-encode, then hands you a clean MP4.',
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
      'Free, no watermark, no signup, deleted within 24 hours.',
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
      { question: 'Is it free?', answer: 'Yes — no watermark, no signup. Files are deleted within 24 hours.' },
    ],
    related: [
      { label: 'Video trimmer', to: '/tools/video-trimmer', description: 'Trim any video format.' },
      { label: 'MP4 converter', to: '/tools/mp4-converter', description: 'Convert other formats into MP4.' },
      { label: 'Compress MP4', to: '/tools/compress-mp4', description: 'Shrink the MP4 after trimming.' },
      { label: 'Video cutter', to: '/tools/video-cutter', description: 'Cut a clip out of a video.' },
    ],
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
      'Cut a section out of any video with a fast, quality-preserving trim — straight in your browser.',
    metaTitle: 'Cut Video Online Free | Media Manipulator',
    metaDescription:
      'Free online video cutter. Cut a clip from any video by start and end time with a fast, lossless cut. MP4 output, no watermark, no signup, deleted in 24 hours.',
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
      'Cutting a video means keeping a single section and dropping the rest. The Media Manipulator video cutter takes a start and end time and produces just that segment, using a fast stream-copy that preserves the original quality whenever possible. Everything runs server-side and your file is deleted within 24 hours.',
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
      'Free, no watermark, no signup, deleted within 24 hours.',
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
      { question: 'Is it free?', answer: 'Yes — no watermark, no signup. Files are deleted within 24 hours.' },
    ],
    related: [
      { label: 'Video trimmer', to: '/tools/video-trimmer', description: 'Trim a clip to a range.' },
      { label: 'Cut video online', to: '/tools/cut-video-online', description: 'Quick browser-based cutting.' },
      { label: 'Video compressor', to: '/tools/video-compressor', description: 'Shrink the cut clip.' },
      { label: 'MP4 trimmer', to: '/tools/mp4-trimmer', description: 'Cut MP4 files specifically.' },
    ],
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
      'A quick, no-install way to cut a clip out of any video right in your browser.',
    metaTitle: 'Cut Video Online Free — No Install | Media Manipulator',
    metaDescription:
      'Cut video online free, no install. Set a start and end and cut any clip in your browser with a fast, lossless cut. No watermark, no signup, deleted in 24 hours.',
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
      'Sometimes you just need to cut a quick clip without downloading software. This page is the fast, browser-based way to do it: upload a video, mark the part you want, and get a cut clip back in seconds. The actual cut runs on our servers with a quality-preserving stream-copy, so there is nothing to install and nothing to learn.',
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
      'Files are processed on our infrastructure and deleted within 24 hours.',
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
      'Free, no watermark, no signup, deleted within 24 hours.',
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
      { question: 'Is it free?', answer: 'Yes — no watermark, no signup. Files are deleted within 24 hours.' },
    ],
    related: [
      { label: 'Video trimmer', to: '/tools/video-trimmer', description: 'Focused trimming with a visual range.' },
      { label: 'Video cutter', to: '/tools/video-cutter', description: 'Cut a section out of a video.' },
      { label: 'MP4 trimmer', to: '/tools/mp4-trimmer', description: 'Cut MP4 files specifically.' },
      { label: 'Video compressor', to: '/tools/video-compressor', description: 'Shrink the clip after cutting.' },
    ],
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
      'Free online video cropper. Crop the edges of a video to reframe it or change the aspect ratio. MP4 output, no watermark, no signup, deleted within 24 hours.',
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
      { title: 'Upload your video', description: 'Drop in any common video file.' },
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
      'Free, no signup, files deleted within 24 hours.',
    ],
    privacyNote: sharedPrivacyNote,
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
      { question: 'Is it free?', answer: 'Yes — no watermark, no signup. Files are deleted within 24 hours.' },
    ],
    related: [
      { label: 'Resize video', to: '/tools/resize-video', description: 'Change the resolution instead of cropping.' },
      { label: 'Rotate video', to: '/tools/rotate-video', description: 'Fix sideways or upside-down video.' },
      { label: 'Video converter', to: '/tools/video-converter', description: 'Convert between video formats.' },
      { label: 'Video compressor', to: '/tools/video-compressor', description: 'Shrink the cropped video.' },
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
      'Free online video resizer. Change video resolution to 1080p, 720p, 480p, or a custom size. MP4 output, no watermark, no signup, deleted within 24 hours.',
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
      { title: 'Upload your video', description: 'Drop in any common video file.' },
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
      'Free, no signup, files deleted within 24 hours.',
    ],
    privacyNote: sharedPrivacyNote,
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
      { question: 'Is it free?', answer: 'Yes — no watermark, no signup. Files are deleted within 24 hours.' },
    ],
    related: [
      { label: 'Crop video', to: '/tools/crop-video', description: 'Cut away edges instead of scaling.' },
      { label: 'Video compressor', to: '/tools/video-compressor', description: 'Shrink the file with presets.' },
      { label: 'MP4 converter', to: '/tools/mp4-converter', description: 'Convert to MP4.' },
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
      'Free online video rotator. Rotate a video 90°, 180°, or 270° and fix sideways or upside-down clips. MP4 output, no watermark, no signup, deleted in 24 hours.',
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
      { title: 'Upload your video', description: 'Drop in any common video file.' },
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
      'Free, no watermark, no signup, deleted within 24 hours.',
    ],
    privacyNote: sharedPrivacyNote,
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
      { question: 'Is it free?', answer: 'Yes — no watermark, no signup. Files are deleted within 24 hours.' },
    ],
    related: [
      { label: 'Crop video', to: '/tools/crop-video', description: 'Cut away the edges.' },
      { label: 'Resize video', to: '/tools/resize-video', description: 'Change the resolution.' },
      { label: 'Video converter', to: '/tools/video-converter', description: 'Convert between video formats.' },
      { label: 'Video compressor', to: '/tools/video-compressor', description: 'Shrink the rotated video.' },
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
      'Free online tool to remove audio from a video. Strip the sound and download a silent, video-only MP4. No watermark, no signup, files deleted within 24 hours.',
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
      { title: 'Upload your video', description: 'Drop in any common video file.' },
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
      'Free, no watermark, no signup, deleted within 24 hours.',
    ],
    privacyNote: sharedPrivacyNote,
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
      { question: 'Is it free?', answer: 'Yes — no watermark, no signup. Files are deleted within 24 hours.' },
    ],
    related: [
      { label: 'Remove audio (video-only)', to: '/tools/extract-video-only-from-video', description: 'The same silent-video tool.' },
      { label: 'Extract audio from video', to: '/tools/extract-audio-from-video', description: 'Save the audio instead of removing it.' },
      { label: 'Video compressor', to: '/tools/video-compressor', description: 'Shrink the silent video.' },
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
        'Upload any audio file and pick the target format. 192 kbps MP3 is a sensible default.',
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
      { title: 'Upload audio', description: 'Drop in any common audio file.' },
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
    privacyNote: sharedPrivacyNote,
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
      'Generate SRT subtitle files from MP4, MOV, MP3, WAV, and more. Free, no signup, files deleted within 24 hours. Works with YouTube, Premiere, DaVinci Resolve.',
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
      'No signup, no watermarks, files deleted within 24 hours.',
      'Same transcription engine the rest of the app uses, so accuracy is consistent across SRT, VTT, plain text, and JSON outputs.',
    ],
    privacyNote: sharedPrivacyNote,
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
      { question: 'Are my uploaded files private?', answer: 'Yes. Uploaded media stays on our own server and is deleted within 24 hours. Transcription runs on a GPU we operate — no third-party AI provider sees your file.' },
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
      'Free, no signup, files deleted within 24 hours.',
    ],
    privacyNote: sharedPrivacyNote,
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
        'Upload an audio file and pick whether you want a waveform video, a waveform image, or both. Advanced controls let you tune size, colors, render mode, and stereo behavior.',
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
    privacyNote: sharedPrivacyNote,
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
    name: 'Extract Audio from Video',
    h1: 'Extract Audio from Video',
    tagline:
      'Save the audio track from any video as a clean MP3, WAV, M4A, AAC, FLAC, or OGG file.',
    metaTitle: 'Extract Audio from Video — MP3, WAV, M4A & More | Media Manipulator',
    metaDescription:
      'Free online tool to extract the audio from any video file (MP4, MOV, MKV, WebM, AVI). Output MP3, WAV, M4A, AAC, FLAC, or OGG. No signup, files deleted within 24 hours.',
    ogTitle: 'Extract Audio from Video',
    ogDescription:
      'Save MP4/MOV/MKV/WebM/AVI audio tracks as MP3, WAV, M4A, AAC, FLAC, or OGG. Free, no signup, files deleted within 24 hours.',
    category: 'video',
    embed: {
      defaultMediaKind: 'video',
      defaultTask: 'extract_audio',
      title: 'Extract the audio track from a video',
      description:
        'Upload any common video container. Pick MP3 for broad compatibility, WAV for lossless, or M4A/AAC for a compact compressed file.',
    },
    intro:
      'Pulling the audio out of a video is one of the most common editing tasks — for podcasting, voiceover review, transcript preparation, or simply saving a song from a music video. Media Manipulator extracts the first audio track from any common video container and re-encodes it into the format you choose, with no quality loss when the source already matches.',
    whatItDoes: [
      'Extracts the first audio stream from MP4, MOV, MKV, WebM, AVI, and M4V containers.',
      'Encodes output as MP3 (libmp3lame), WAV (pcm_s16le), M4A/AAC, FLAC, or OGG (libvorbis).',
      'Detects videos with no audio stream and returns a clear error instead of producing an empty file.',
      'Preserves the original duration and sample rate.',
    ],
    flowSteps: [
      { title: 'Upload your video', description: 'Drop any MP4, MOV, MKV, WebM, AVI, or M4V file.' },
      { title: 'Pick an output format', description: 'MP3 plays everywhere; WAV is lossless; M4A/AAC is a compact default.' },
      { title: 'We extract', description: 'FFmpeg pulls the first audio stream and encodes it cleanly.' },
      { title: 'Download', description: 'Save the extracted audio in your chosen format.' },
    ],
    advancedDetails: [
      'We pre-check the source with ffprobe so videos without an audio stream return a useful error instead of an empty file.',
      'MP3 is rendered with libmp3lame at quality preset 2 (≈190 kbps VBR) — the typical sweet spot for speech and music.',
      'M4A/AAC uses the native AAC encoder at 192 kbps, suitable for both speech and music.',
    ],
    whyItMatters: [
      'Audio extraction is the first step for podcast repurposing, transcription, music sampling, and voiceover review.',
      'Having a clean, format-specific audio file decouples the audio from the original video container.',
    ],
    useCases: [
      { title: 'Podcasters', description: 'Pull audio out of a video interview before publishing the audio-only episode.' },
      { title: 'Editors', description: 'Reuse a film or music clip’s soundtrack in a different edit.' },
      { title: 'Voiceover review', description: 'Send clients a clean audio file from a screen recording.' },
      { title: 'Transcript prep', description: 'Provide audio-only files to transcription tools that prefer them over video.' },
    ],
    whyMediaManipulator: [
      'Server-side FFmpeg means no codec headaches in the browser.',
      'Clear errors when the source video has no audio.',
      'Free, no signup, files deleted within 24 hours.',
    ],
    privacyNote: sharedPrivacyNote,
    supportedFormats: {
      supportedInputFormats: ['mp4', 'mov', 'webm', 'mkv', 'avi', 'm4v'],
      supportedOutputFormats: ['mp3', 'wav', 'm4a', 'aac', 'flac', 'ogg'],
      processingNotes: [
        'We extract the first audio stream. Videos without any audio stream return a clear error instead of an empty file.',
      ],
    },
    faq: [
      { question: 'Can I extract audio from an MP4?', answer: 'Yes — MP4 is the most common case. We also support MOV, MKV, WebM, AVI, and M4V.' },
      { question: 'What audio formats can I export?', answer: 'MP3, WAV, M4A, AAC, FLAC, and OGG.' },
      { question: 'Does extracting audio reduce quality?', answer: 'Output quality is determined by the format you pick. WAV is lossless. MP3 / AAC / OGG are lossy but at our defaults they sound essentially identical to the source for most listeners.' },
      { question: 'Can I extract audio from a video with multiple audio tracks?', answer: 'We always pull the first audio stream. If you need a specific alternate language track, please reach out and we will look at adding multi-stream selection.' },
      { question: 'What if my video has no audio?', answer: 'We detect that up front and return a clear error message instead of producing an empty file.' },
    ],
    related: [
      { label: 'MP4 to MP3', to: '/tools/mp4-to-mp3', description: 'Output locked to MP3 for MP4 input.' },
      { label: 'Video to MP3', to: '/tools/video-to-mp3', description: 'Extract MP3 from any video format.' },
      { label: 'Audio converter', to: '/tools/audio-converter', description: 'Convert the extracted audio to other formats.' },
      { label: 'SRT Generator', to: '/tools/srt-generator', description: 'Transcribe the extracted audio into subtitles.' },
      { label: 'Audio Waveform Generator', to: '/tools/audio-waveform-generator', description: 'Turn the extracted audio into a waveform visual.' },
      { label: 'Stitch Audio to Video', to: '/tools/stitch-audio-to-video', description: 'Reuse extracted audio inside a new video.' },
    ],
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
      'Export a video-only (silent) copy of your video with every audio track removed. Free, no signup, files deleted within 24 hours.',
    category: 'video',
    embed: {
      defaultMediaKind: 'video',
      defaultTask: 'extract_video_only',
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
      'Free; files deleted within 24 hours.',
    ],
    privacyNote: sharedPrivacyNote,
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
      { question: 'Is the original video modified?', answer: 'No. The original upload stays untouched. We produce a new file and delete the upload within 24 hours.' },
      { question: 'What if my video has no audio?', answer: 'No problem — the tool succeeds normally and returns a clean re-packaged copy.' },
    ],
    related: [
      { label: 'Remove audio from video', to: '/tools/remove-audio-from-video', description: 'The consumer-friendly mute / remove-sound page.' },
      { label: 'Extract Audio from Video', to: '/tools/extract-audio-from-video', description: 'Pull the audio track out as MP3, WAV, etc.' },
      { label: 'Stitch Audio to Video', to: '/tools/stitch-audio-to-video', description: 'Add a new soundtrack to your silent video.' },
      { label: 'Video compressor', to: '/tools/video-compressor', description: 'Shrink the silent video.' },
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
    privacyNote: sharedPrivacyNote,
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
      'Free, no signup, server-side FFmpeg, files deleted within 24 hours.',
    ],
    privacyNote: sharedPrivacyNote,
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
      title: 'AI frame interpolation',
      description:
        'Upload a short video. Then open the "AI Video Tools" panel below, pick "AI Frame Interpolation", and choose a target FPS (48, 60, or 120). The tool synthesizes new in-between frames and returns an MP4.',
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
      'Free, no signup, automatic cleanup of uploads within 24 hours.',
    ],
    privacyNote: sharedPrivacyNote,
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
      'AI Video Restoration runs a short snippet of your video through up to six state-of-the-art restoration and super-resolution models — Real-ESRGAN, SwinIR, HAT, BasicVSR++, RVRT, and VRT — and packages every result into a single download so you can compare them frame by frame. Different models make very different trade-offs between sharpness, temporal stability, and artifacts; the only reliable way to pick the right one for your footage is to run the same clip through all of them. Everything processes on our own GPU server, never a third-party API.',
    whatItDoes: [
      'Trims the exact snippet you select (up to 15 seconds / 450 frames) with frame accuracy, keeping the audio.',
      'Runs the snippet through your choice of six models: Real-ESRGAN, SwinIR, and HAT enhance frame by frame, while BasicVSR++, RVRT, and VRT restore the sequence as a whole for better temporal consistency.',
      'Upscales 2x or 4x automatically based on the source resolution (sources at or below 540p get 4x).',
      'Stitches every result back into an MP4 at the exact source frame rate, with the original audio re-attached.',
      'Packages everything — the original snippet, every enhanced MP4, optional enhanced frames, and a machine-readable manifest — into one results archive.',
      'Keeps going when a single model fails: the package records the failure and still includes every successful result.',
    ],
    flowSteps: [
      {
        title: 'Upload a video',
        description: 'Drop in any common video file — long sources are fine because only the snippet is processed.',
      },
      {
        title: 'Select a snippet',
        description: 'Drag the start and end handles (or the whole window) to pick up to 15 seconds; 10 seconds or less is recommended.',
      },
      {
        title: 'Choose restoration models',
        description: 'Pick any combination of Real-ESRGAN, SwinIR, HAT, BasicVSR++, RVRT, and VRT, and whether to include enhanced frames.',
      },
      {
        title: 'Watch the pipeline run',
        description: 'A live checklist tracks every stage — extraction, each model, packaging — with time estimates per model.',
      },
      {
        title: 'Download and compare',
        description: 'The results archive downloads automatically: one folder per model plus the original snippet for A/B playback.',
      },
    ],
    advancedDetails: [
      'Real-ESRGAN runs the realesrgan-x4plus GAN through a Vulkan binary — the fastest model and a good baseline for every comparison.',
      'SwinIR uses the large real-world SR GAN (003_realSR_BSRGAN SwinIR-L x4) with tiled inference so high resolutions fit in GPU memory.',
      'HAT runs Real_HAT_GAN_SRx4, a hybrid attention transformer that often produces the sharpest individual frames.',
      'BasicVSR++ propagates information between frames recurrently, which keeps textures stable where per-frame models shimmer.',
      'RVRT and VRT are video restoration transformers that process the sequence with temporal attention — typically the highest quality and by far the slowest.',
      'Frame extraction uses ffmpeg with vsync 0; stitching re-encodes with libx264 CRF 16 at the exact source frame-rate fraction (e.g. 30000/1001) so audio stays in sync.',
      'A 2x request still runs each model’s native 4x network and downscales with Lanczos during stitching — quality is identical and the pipeline stays uniform.',
      'Every model runs under a GPU scheduler lease with per-model VRAM budgets, and one restoration job runs at a time so jobs never starve each other.',
    ],
    whyItMatters: [
      'No single restoration model wins on all footage: GAN upscalers excel on stills but can flicker, while video transformers stay stable but soften fine detail.',
      'Running one short snippet through every model costs minutes, not hours, and tells you exactly which model deserves the full-length run.',
      'Old family footage, low-resolution archives, and compressed social exports all degrade differently — side-by-side comparison beats guessing.',
    ],
    useCases: [
      {
        title: 'Restoring old family videos',
        description: 'Digitized tapes and early digital camera clips are low-resolution and noisy — compare which model best recovers faces and detail.',
      },
      {
        title: 'Upscaling archive footage',
        description: 'Evaluate 480p/720p archive material at 4x before committing to a full restoration pass.',
      },
      {
        title: 'Choosing a model before a long render',
        description: 'Run a representative 10-second snippet through all six models to pick the right one for an hours-long GPU job.',
      },
      {
        title: 'Improving compressed downloads',
        description: 'Heavily compressed social media exports respond very differently to GAN vs transformer restoration — test both families.',
      },
      {
        title: 'Comparing temporal stability',
        description: 'Play the per-model MP4s side by side to spot shimmer and flicker that still frames hide.',
      },
    ],
    whyMediaManipulator: [
      'Six research-grade models behind one upload — no notebooks, CUDA setup, or model weights to manage.',
      'Runs entirely on our own GPU server: your video never goes to a third-party AI provider.',
      'One tidy package with a manifest, the original snippet, and every result — built for honest A/B comparison.',
    ],
    privacyNote: sharedPrivacyNote,
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
          'It genuinely depends on the footage — that is the reason this tool exists. GAN upscalers like Real-ESRGAN and HAT produce crisp individual frames but can shimmer in motion; video models like BasicVSR++, RVRT, and VRT use neighboring frames for stability but can look softer. Run your own snippet through all of them and judge with your eyes.',
      },
      {
        question: 'Why is the clip limited to 15 seconds?',
        answer:
          'Restoration models are extremely GPU-intensive — VRT can take several seconds per frame at 4x. A short snippet keeps the multi-model comparison fast and is all you need to evaluate quality before committing to a longer restoration elsewhere.',
      },
      {
        question: 'What is the difference between the two model groups?',
        answer:
          'Frame-by-frame enhancers (Real-ESRGAN, SwinIR, HAT) upscale each frame independently, so their results include both the enhanced frames and a stitched video. Video restoration models (BasicVSR++, RVRT, VRT) process the sequence as a whole using temporal information, and produce only an enhanced video.',
      },
      {
        question: 'Does the restored video keep my audio?',
        answer:
          'Yes. The selected snippet is trimmed with its audio, and every model’s output is stitched back together with that audio at the exact source frame rate, so all results stay in sync for A/B playback.',
      },
      {
        question: 'What does the results package contain?',
        answer:
          'One folder per model with its enhanced MP4 (frame-by-frame models can also include every enhanced frame as PNGs), the original trimmed snippet for reference, a README, and a manifest.json with per-model timings, output dimensions, and any failures.',
      },
      {
        question: 'What happens if one model fails?',
        answer:
          'The job keeps going. The failed model’s folder contains a FAILED.txt with the reason, the manifest records it, and every other selected model’s result is still packaged and downloadable.',
      },
      {
        question: 'Is 4x always better than 2x upscaling?',
        answer:
          'No. 4x shines on genuinely low-resolution sources (540p and below). On 720p–1080p sources, 4x produces enormous files for little visible gain, which is why auto mode picks 2x there.',
      },
      {
        question: 'Can AI restoration fix any video?',
        answer:
          'It can sharpen detail, reduce noise, and upscale resolution, but it cannot reconstruct information that was never captured. Severely blurred motion, extreme compression blocking, or very dark footage will improve — not become pristine.',
      },
      {
        question: 'How long does a restoration run take?',
        answer:
          'It scales with snippet length and model choice. Real-ESRGAN handles a 10-second clip in a few minutes; VRT can take an hour for the same clip. The picker shows a live estimate per model, and the models run fastest-first so early results are never blocked by slow ones.',
      },
    ],
    related: [
      {
        label: 'Video trimmer',
        to: '/tools/video-trimmer',
        description: 'Cut the perfect snippet before restoring it.',
      },
      {
        label: 'Compress video',
        to: '/tools/compress-video',
        description: 'Shrink the restored output for sharing.',
      },
      {
        label: 'Transcode to HLS',
        to: '/tools/transcode-to-hls',
        description: 'Package the restored video for adaptive streaming.',
      },
      {
        label: 'Transcribe video',
        to: '/tools/transcribe-video',
        description: 'Generate captions for the restored clip.',
      },
      {
        label: 'Content Studio',
        to: '/tools/content-studio',
        description: 'Edit the restored snippet into a full piece.',
      },
    ],
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
      'AI Image Restoration & Upscaling runs one photo through a configurable pipeline of up to eight models and shows every result next to the original. A fidelity-preserving pre-clean stage (FBCNN for JPEG artifacts, SCUNet for noise, NAFNet for motion blur) removes degradation without inventing detail; general upscalers (Real-ESRGAN, SwinIR, HAT) then enlarge 2x or 4x; and optional face enhancement (GFPGAN, CodeFormer) reconstructs faces. Pre-clean is non-generative — it filters the existing signal. Face enhancement is generative — it synthesizes plausible detail and must not be treated as a faithful recovery of the source. Everything runs on our own GPU server, never a third-party API.',
    whatItDoes: [
      'Lets you focus restoration on a drag-selected crop region (applied server-side on the original bytes for no quality loss) or keep the whole image.',
      'Optionally pre-cleans the image first: FBCNN removes JPEG/compression artifacts (with an optional manual quality factor), SCUNet denoises (PSNR-trained, no hallucinated texture), and NAFNet deblurs — always in that fixed order, each on the previous result.',
      'Runs your choice of general upscalers — Real-ESRGAN, SwinIR, HAT — at 2x or 4x (native x4 networks; 2x is a Lanczos downscale of the x4 output).',
      'Optionally adds face enhancement (GFPGAN and/or CodeFormer, with a fidelity dial), and can chain the face models onto each upscaler’s output as well as the source.',
      'Packages everything — the prepared original, every output, and a manifest — into one results archive, and shows an inline comparison grid so you can A/B each result against the original.',
      'Keeps going when a single model fails: the package records the failure and still includes every successful result.',
    ],
    flowSteps: [
      {
        title: 'Upload an image',
        description: 'Drop in a PNG, JPEG, WebP, TIFF, or BMP. Old, low-resolution, and compressed photos are exactly the target.',
      },
      {
        title: 'Crop or keep the whole image',
        description: 'Optionally drag-select a region to focus on (great for a face or a license plate), or restore the entire image.',
      },
      {
        title: 'Optionally pre-clean',
        description: 'Turn on pre-clean to strip artifacts, noise, and blur before enhancement — the cleaned image becomes the base every model runs on.',
      },
      {
        title: 'Pick models / face enhancement / chain',
        description: 'Choose any combination of upscalers and face models, set the scale, and optionally chain face restoration onto each upscaled result.',
      },
      {
        title: 'Watch the pipeline run',
        description: 'A live checklist tracks every stage — pre-clean, each model, packaging — with per-unit failure badges.',
      },
      {
        title: 'Compare & download',
        description: 'Every result appears in an inline grid next to the original; download the full results archive when you’re ready.',
      },
    ],
    advancedDetails: [
      'FBCNN predicts the JPEG quality factor blindly, or you can override it manually (lower assumes heavier compression) — useful for stubborn blocking artifacts.',
      'SCUNet uses the PSNR-trained real-denoise weights, not the GAN variant: the GAN model hallucinates texture, while the PSNR model is a pure filter — the right forensic default.',
      'NAFNet uses the GoPro motion-deblur weights; it targets motion blur specifically, not defocus or compression softness.',
      'The fixed pre-clean order (artifact removal → denoise → deblur) is deliberate: compression artifacts must come off before denoising, and deblurring runs last on the cleanest signal.',
      'General models run their native x4 networks; a 2x request downscales the x4 output with Lanczos, mirroring the video pipeline for uniform quality. Large inputs are tiled to stay within GPU memory.',
      'GFPGAN uses the clean v1.4 architecture; CodeFormer exposes a fidelity weight (w) where lower is prettier and higher stays closer to the input. Background up-sampling is disabled on face models so the comparison stays honest.',
      'Chaining runs each face model on every upscaler’s output (a pure face pass at 1x) in addition to running it on the source, so you can see face enhancement layered on top of each upscaler.',
      'Pre-clean output is a filtered version of the source signal (non-generative). Face-enhancement output is generative reconstruction — synthesized detail suitable for clarity and leads, not identification evidence.',
    ],
    whyItMatters: [
      'No single model wins on every photo: artifact removal, denoising, upscaling, and face reconstruction each fix different damage, and the right combination depends on how the image was degraded.',
      'Restoring one image through several models takes a minute or two and shows exactly which pipeline recovers the most usable detail.',
      'The non-generative vs generative distinction matters: pre-clean gives you a faithful, filtered image, while face enhancement gives you a plausible reconstruction — knowing which is which is essential for investigative and archival work.',
    ],
    useCases: [
      {
        title: 'Restoring old or scanned photos',
        description: 'Pre-clean compression and scanner noise, then upscale — and optionally reconstruct faces — to bring a low-resolution photo back to life.',
      },
      {
        title: 'Enhancing low-resolution or CCTV stills',
        description: 'Crop to the region of interest, remove artifacts, and upscale; chain face enhancement for visual clarity (as a lead, never as identification evidence).',
      },
      {
        title: 'Fixing blurry or compressed downloads',
        description: 'Heavily compressed social exports respond well to FBCNN + SCUNet followed by a GAN upscaler.',
      },
      {
        title: 'Comparing upscalers before a batch',
        description: 'Run one representative image through Real-ESRGAN, SwinIR, and HAT to pick the best model for a larger set.',
      },
      {
        title: 'Recovering detail in a specific region',
        description: 'Drag-select just a face or sign so the full pixel budget and GPU time go to the part you care about.',
      },
    ],
    whyMediaManipulator: [
      'Eight research-grade models behind one upload — no notebooks, CUDA setup, or model weights to manage.',
      'Runs entirely on our own GPU server: your image never goes to a third-party AI provider.',
      'Honest by design: pre-clean is labeled non-generative, face enhancement is labeled generative reconstruction, and the original is always shown for side-by-side comparison.',
    ],
    privacyNote: sharedPrivacyNote,
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
        question: 'What is the difference between pre-clean and the upscaling/face models?',
        answer:
          'Pre-clean models (FBCNN, SCUNet, NAFNet) are non-generative: they remove compression artifacts, noise, and motion blur by filtering the existing signal, without inventing new detail. Upscalers add resolution, and the face models (GFPGAN, CodeFormer) are generative — they synthesize plausible facial detail. That is why pre-clean output is a faithful filtered image while face output is a reconstruction.',
      },
      {
        question: 'Can AI face enhancement be used as identification evidence?',
        answer:
          'No. GFPGAN and CodeFormer synthesize plausible facial detail from a learned prior; they do not recover the true face. The output is useful for visual clarity and investigative leads, but it must never be treated as a faithful recovery of the source for identification.',
      },
      {
        question: 'Why do the pre-clean models always run in the same order?',
        answer:
          'Compression artifacts must be removed before denoising (otherwise the denoiser treats blocking as signal), and deblurring works best on the cleanest input, so the pipeline always runs FBCNN → SCUNet → NAFNet regardless of the order you select them.',
      },
      {
        question: 'What does the Chain option do?',
        answer:
          'With chaining on, each selected face model runs on every upscaler’s output in addition to running on the source. For example, two upscalers and two face models with chaining produce the two upscaled images, each face model on the source, and each face model on each upscaler’s result.',
      },
      {
        question: 'Should I use 2x or 4x?',
        answer:
          'The models run native 4x networks; a 2x request downscales the 4x output with Lanczos for identical quality at half the dimensions. Auto picks 4x for small crops and 2x for larger ones, and an output pixel budget prevents accidentally enormous results.',
      },
      {
        question: 'What happens if a model fails?',
        answer:
          'The job keeps going. The failed model’s entry records a user-safe reason, the manifest notes it, and every other result is still packaged and shown in the comparison grid.',
      },
      {
        question: 'Why is CodeFormer sometimes unavailable?',
        answer:
          'CodeFormer is under a non-commercial license, so it is gated behind a server flag and may be disabled on this deployment. GFPGAN (Apache-2.0) and the pre-clean models (Apache-2.0/MIT) are always available when installed.',
      },
      {
        question: 'Does it keep my original image?',
        answer:
          'The prepared (cropped) original is included in the results package and shown alongside every output so you can A/B each result honestly.',
      },
    ],
    related: [
      {
        label: 'AI Video Restoration',
        to: '/tools/ai-video-restoration',
        description: 'The moving-image sibling — restore and upscale a video snippet.',
      },
      {
        label: 'Remove background',
        to: '/tools/remove-background-from-image',
        description: 'Cut out the subject after restoring it.',
      },
      {
        label: 'Compress image',
        to: '/tools/compress-image',
        description: 'Shrink the restored image for sharing.',
      },
      {
        label: 'Image resizer',
        to: '/tools/image-resizer',
        description: 'Resize the restored image to exact dimensions.',
      },
      {
        label: 'Remove EXIF metadata',
        to: '/tools/remove-exif-metadata',
        description: 'Strip metadata from the restored image before sharing.',
      },
    ],
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
];

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
    id: 'metadata',
    label: 'Metadata & privacy tools',
    description: 'Strip EXIF, GPS, and other private metadata before sharing.',
  },
];
