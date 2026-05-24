/**
 * Data-driven definitions for the high-intent /tools landing pages.
 *
 * Each entry is consumed by both the reusable ToolLandingPage component
 * and the central SEO map (src/lib/seo.ts) so titles, descriptions, FAQ
 * content, and the embedded panel config stay in sync.
 */

import type { EmbeddedMediaKind, EmbeddedTask } from '@/components/embedded-tool-panel';
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
      {
        label: 'Image optimization guide',
        to: '/blog/image/image-optimization-guide',
        description: 'JPG vs PNG vs WebP and how to shrink images for the web.',
      },
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
      {
        label: 'Video compression guide',
        to: '/blog/video/video-compression-guide',
        description: 'Codecs, bitrate, and container deep dive.',
      },
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
      {
        label: 'Video compression guide',
        to: '/blog/video/video-compression-guide',
        description: 'Codecs, bitrate, and container deep dive.',
      },
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
      {
        label: 'Video compression guide',
        to: '/blog/video/video-compression-guide',
        description: 'Codecs, bitrate, and container deep dive.',
      },
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
      {
        label: 'Video compression guide',
        to: '/blog/video/video-compression-guide',
        description: 'How codec and bitrate affect output size.',
      },
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
        label: 'Image converter',
        to: '/tools/image-converter',
        description: 'Convert between JPG, PNG, WebP, AVIF, and GIF.',
      },
      {
        label: 'Remove EXIF metadata',
        to: '/tools/remove-exif-metadata',
        description: 'Strip private metadata before sharing the JPG.',
      },
      {
        label: 'Image optimization guide',
        to: '/blog/image/image-optimization-guide',
        description: 'JPG vs PNG vs WebP and when to use each.',
      },
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
      {
        label: 'Audio quality guide',
        to: '/blog/audio/audio-quality-guide',
        description: 'Bitrate, sample rate, and codec deep dive.',
      },
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
      {
        label: 'Audio quality guide',
        to: '/blog/audio/audio-quality-guide',
        description: 'Bitrate, sample rate, and codec choices for clean audio.',
      },
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
      { label: 'Convert WebP to JPG', to: '/tools/convert-webp-to-jpg', description: 'Focused WebP → JPG converter.' },
      { label: 'Remove EXIF metadata', to: '/tools/remove-exif-metadata', description: 'Strip private metadata before sharing.' },
      { label: 'Image converter tutorial', to: '/tutorials/image/getting-started', description: 'Full walkthrough of every option.' },
      { label: 'Image optimization guide', to: '/blog/image/image-optimization-guide', description: 'JPG vs PNG vs WebP vs AVIF.' },
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
      { label: 'Video compression guide', to: '/blog/video/video-compression-guide', description: 'Codec, bitrate, and container deep dive.' },
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
      { label: 'Audio quality guide', to: '/blog/audio/audio-quality-guide', description: 'Bitrate, sample rate, and codec deep dive.' },
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
      {
        label: 'Video compression guide',
        to: '/blog/video/video-compression-guide',
        description: 'Codec and bitrate deep dive for after interpolation.',
      },
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
