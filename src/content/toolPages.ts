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
  category: 'image' | 'video' | 'audio' | 'ai' | 'metadata';
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
  'Your uploads are processed on our own servers and automatically deleted within 24 hours. We do not share your files with third-party AI providers, and AI features run on a local GPU server we operate. No login or account is required.';

export const TOOL_PAGES: ToolPageContent[] = [
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
        label: 'Video converter',
        to: '/tools/video-converter',
        description: 'Convert between MP4, WebM, MOV, AVI, and more.',
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
      { label: 'Compress video', to: '/tools/compress-video', description: 'Focused compressor for shrinking video files.' },
      { label: 'Convert video to GIF', to: '/tools/convert-video-to-animated-gif', description: 'Turn short clips into animated GIFs.' },
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
    name: 'Remove Audio from Video',
    h1: 'Remove Audio from Video',
    tagline:
      'Export a silent / video-only copy with every audio track removed — perfect for silent previews, edits, and re-scoring.',
    metaTitle: 'Remove Audio from Video — Free Mute Video Online | Media Manipulator',
    metaDescription:
      'Free online tool to mute a video by removing all audio tracks. Stream-copies the video where possible — no re-encoding, no quality loss.',
    ogTitle: 'Remove Audio from Video',
    ogDescription:
      'Export a silent / video-only copy of your video with every audio track removed. Free, no signup, files deleted within 24 hours.',
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
      { label: 'Extract Audio from Video', to: '/tools/extract-audio-from-video', description: 'Pull the audio track out as MP3, WAV, etc.' },
      { label: 'Stitch Audio to Video', to: '/tools/stitch-audio-to-video', description: 'Add a new soundtrack to your silent video.' },
      { label: 'Extract Frames from Video', to: '/tools/extract-frames-from-video', description: 'Pull still images out of the silent video.' },
    ],
    primaryKeyword: 'remove audio from video',
    secondaryKeywords: [
      'mute video online',
      'extract video without audio',
      'video only extractor',
      'delete audio track from video',
      'silent video maker',
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
