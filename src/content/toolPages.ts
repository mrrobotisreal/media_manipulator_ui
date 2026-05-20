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
