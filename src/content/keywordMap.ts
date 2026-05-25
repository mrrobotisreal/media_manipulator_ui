/**
 * Keyword / content cluster map used for internal linking and to plan
 * future SEO landing pages (tools/guides). The shape is intentionally
 * stable so internal-link components and future routing logic can read
 * it directly.
 *
 * - `targetRoute` is the route that already exists today (the cluster's
 *   canonical destination).
 * - `relatedRoutes` is for cross-linking inside the current site map.
 * - `suggestedFutureRoutes` is a forward-looking list of routes that have
 *   not been built yet but are tracked here so authoring stays consistent.
 * - `recommendedInternalLinks` is a curated set of (label, route) pairs
 *   that components can use to build "Related" sections without having to
 *   hardcode anchor text page-by-page.
 */

export type SearchIntent =
  | 'informational'
  | 'transactional'
  | 'navigational'
  | 'commercial';

export interface InternalLinkRecommendation {
  label: string;
  route: string;
  description?: string;
}

export interface KeywordCluster {
  slug: string;
  title: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  intent: SearchIntent;
  targetRoute: string;
  relatedRoutes: string[];
  suggestedFutureRoutes: string[];
  recommendedInternalLinks: InternalLinkRecommendation[];
}

export const KEYWORD_CLUSTERS: KeywordCluster[] = [
  {
    slug: 'image-conversion',
    title: 'Image conversion',
    primaryKeyword: 'image converter',
    secondaryKeywords: [
      'convert JPG to PNG',
      'convert PNG to WebP',
      'convert HEIC to JPG',
      'convert WebP to JPG',
      'online image converter',
    ],
    intent: 'transactional',
    targetRoute: '/tools/image-converter',
    relatedRoutes: [
      '/tools/convert-webp-to-jpg',
      '/tools/remove-exif-metadata',
      '/tutorials/image/getting-started',
      // '/blog/image/image-optimization-guide', // hidden during AdSense review
      '/how-it-works',
    ],
    suggestedFutureRoutes: [
      '/tools/convert-png-to-webp',
      '/tools/convert-heic-to-jpg',
      '/guides/jpg-vs-png-vs-webp',
    ],
    recommendedInternalLinks: [
      { label: 'Image converter', route: '/tools/image-converter' },
      { label: 'Convert WebP to JPG', route: '/tools/convert-webp-to-jpg' },
      { label: 'Remove EXIF metadata', route: '/tools/remove-exif-metadata' },
      {
        label: 'Image converter tutorial',
        route: '/tutorials/image/getting-started',
      },
      // Hidden during AdSense review — re-enable when the blog returns.
      // {
      //   label: 'Image optimization guide',
      //   route: '/blog/image/image-optimization-guide',
      // },
    ],
  },
  {
    slug: 'image-compression',
    title: 'Image compression',
    primaryKeyword: 'compress images online',
    secondaryKeywords: [
      'shrink image size',
      'reduce JPG file size',
      'compress PNG',
      'WebP compression',
      'lossy vs lossless image compression',
    ],
    intent: 'transactional',
    targetRoute: '/',
    relatedRoutes: [
      // '/blog/image/image-optimization-guide', // hidden during AdSense review
      '/tutorials/image/getting-started',
    ],
    suggestedFutureRoutes: [
      '/tools/compress-image',
      '/guides/best-image-compression-format',
    ],
    recommendedInternalLinks: [
      // Hidden during AdSense review — re-enable when the blog returns.
      // {
      //   label: 'Image optimization guide',
      //   route: '/blog/image/image-optimization-guide',
      // },
      {
        label: 'Image converter tutorial',
        route: '/tutorials/image/getting-started',
      },
    ],
  },
  {
    slug: 'exif-metadata-removal',
    title: 'EXIF and image metadata removal',
    primaryKeyword: 'remove EXIF metadata',
    secondaryKeywords: [
      'strip GPS from photos',
      'remove IPTC metadata',
      'photo metadata remover',
      'privacy-safe photo sharing',
    ],
    intent: 'transactional',
    targetRoute: '/tools/remove-exif-metadata',
    relatedRoutes: [
      '/tools/image-converter',
      // '/blog/image/image-optimization-guide', // hidden during AdSense review
      '/tutorials/image/getting-started',
      '/privacy-policy',
    ],
    suggestedFutureRoutes: [
      '/guides/remove-gps-metadata-from-photos',
      '/guides/what-is-exif-metadata',
    ],
    recommendedInternalLinks: [
      { label: 'Remove EXIF metadata', route: '/tools/remove-exif-metadata' },
      { label: 'Image converter', route: '/tools/image-converter' },
      {
        label: 'Image converter tutorial',
        route: '/tutorials/image/getting-started',
      },
      // Hidden during AdSense review — re-enable when the blog returns.
      // {
      //   label: 'Image optimization guide',
      //   route: '/blog/image/image-optimization-guide',
      // },
      { label: 'How it works', route: '/how-it-works' },
    ],
  },
  {
    slug: 'video-conversion',
    title: 'Video conversion',
    primaryKeyword: 'video converter',
    secondaryKeywords: [
      'convert MP4 to WebM',
      'convert MOV to MP4',
      'convert MKV to MP4',
      'convert AVI to MP4',
      'online video converter',
    ],
    intent: 'transactional',
    targetRoute: '/tools/video-converter',
    relatedRoutes: [
      '/tools/compress-video',
      '/tools/convert-video-to-animated-gif',
      '/tutorials/video/getting-started',
      // '/blog/video/video-compression-guide', // hidden during AdSense review
    ],
    suggestedFutureRoutes: [
      '/tools/convert-mp4-to-webm',
      '/tools/convert-mov-to-mp4',
      '/guides/best-video-format-for-websites',
      '/guides/mp4-vs-webm',
    ],
    recommendedInternalLinks: [
      { label: 'Video converter', route: '/tools/video-converter' },
      { label: 'Compress video', route: '/tools/compress-video' },
      { label: 'Convert video to GIF', route: '/tools/convert-video-to-animated-gif' },
      {
        label: 'Video converter tutorial',
        route: '/tutorials/video/getting-started',
      },
      // Hidden during AdSense review — re-enable when the blog returns.
      // {
      //   label: 'Video compression guide',
      //   route: '/blog/video/video-compression-guide',
      // },
    ],
  },
  {
    slug: 'video-compression',
    title: 'Video compression',
    primaryKeyword: 'compress video online',
    secondaryKeywords: [
      'reduce MP4 file size',
      'shrink video for web',
      'video bitrate explained',
      'H.264 vs H.265',
      'compress video for email',
    ],
    intent: 'transactional',
    targetRoute: '/tools/compress-video',
    relatedRoutes: [
      '/tools/video-converter',
      // '/blog/video/video-compression-guide', // hidden during AdSense review
      '/tutorials/video/getting-started',
    ],
    suggestedFutureRoutes: [
      '/guides/h264-vs-h265',
      '/guides/what-bitrate-should-i-use',
    ],
    recommendedInternalLinks: [
      { label: 'Compress video', route: '/tools/compress-video' },
      { label: 'Video converter', route: '/tools/video-converter' },
      // Hidden during AdSense review — re-enable when the blog returns.
      // {
      //   label: 'Video compression guide',
      //   route: '/blog/video/video-compression-guide',
      // },
      {
        label: 'Video converter tutorial',
        route: '/tutorials/video/getting-started',
      },
    ],
  },
  {
    slug: 'video-trim-cut',
    title: 'Video trimming and cutting',
    primaryKeyword: 'trim video online',
    secondaryKeywords: [
      'cut MP4 online',
      'split video file',
      'free video trimmer',
      'crop video',
    ],
    intent: 'transactional',
    targetRoute: '/',
    relatedRoutes: ['/tutorials/video/getting-started'],
    suggestedFutureRoutes: [
      '/tools/trim-video',
      '/tools/cut-video',
      '/guides/how-to-trim-video-without-reencoding',
    ],
    recommendedInternalLinks: [
      {
        label: 'Video converter tutorial',
        route: '/tutorials/video/getting-started',
      },
      { label: 'Open the converter', route: '/' },
    ],
  },
  {
    slug: 'audio-conversion',
    title: 'Audio conversion',
    primaryKeyword: 'audio converter',
    secondaryKeywords: [
      'convert WAV to MP3',
      'convert FLAC to MP3',
      'convert MP3 to OGG',
      'online audio converter',
    ],
    intent: 'transactional',
    targetRoute: '/tools/audio-converter',
    relatedRoutes: [
      '/tools/convert-wav-to-mp3',
      '/tools/isolate-vocals-from-song',
      '/tutorials/audio/getting-started',
      // '/blog/audio/audio-quality-guide', // hidden during AdSense review
    ],
    suggestedFutureRoutes: [
      '/tools/convert-flac-to-mp3',
      '/guides/wav-vs-mp3-vs-flac',
    ],
    recommendedInternalLinks: [
      { label: 'Audio converter', route: '/tools/audio-converter' },
      { label: 'Convert WAV to MP3', route: '/tools/convert-wav-to-mp3' },
      { label: 'Isolate vocals from a song', route: '/tools/isolate-vocals-from-song' },
      {
        label: 'Audio converter tutorial',
        route: '/tutorials/audio/getting-started',
      },
      // Hidden during AdSense review — re-enable when the blog returns.
      // {
      //   label: 'Audio quality guide',
      //   route: '/blog/audio/audio-quality-guide',
      // },
    ],
  },
  {
    slug: 'audio-cleanup',
    title: 'Audio cleanup and restoration',
    primaryKeyword: 'remove background noise from audio',
    secondaryKeywords: [
      'clean voice recording',
      'isolate vocals',
      'remove vocals from song',
      'audio denoise online',
      'karaoke maker',
    ],
    intent: 'transactional',
    targetRoute: '/tools/isolate-vocals-from-song',
    relatedRoutes: [
      '/tools/audio-converter',
      '/tools/convert-wav-to-mp3',
      '/tutorials/audio/getting-started',
      // '/blog/audio/audio-quality-guide', // hidden during AdSense review
    ],
    suggestedFutureRoutes: [
      '/tools/remove-background-noise',
      '/tools/remove-vocals',
      '/guides/how-to-clean-podcast-audio',
    ],
    recommendedInternalLinks: [
      { label: 'Isolate vocals from a song', route: '/tools/isolate-vocals-from-song' },
      { label: 'Audio converter', route: '/tools/audio-converter' },
      {
        label: 'Audio converter tutorial',
        route: '/tutorials/audio/getting-started',
      },
      // Hidden during AdSense review — re-enable when the blog returns.
      // {
      //   label: 'Audio quality guide',
      //   route: '/blog/audio/audio-quality-guide',
      // },
    ],
  },
  {
    slug: 'transcription',
    title: 'Transcription and captions',
    primaryKeyword: 'transcribe video online',
    secondaryKeywords: [
      'video to text',
      'audio to text',
      'generate captions',
      'VTT subtitle generator',
      'free transcription',
    ],
    intent: 'transactional',
    targetRoute: '/tools/transcribe-video',
    relatedRoutes: [
      '/tools/video-converter',
      '/tools/audio-converter',
      '/tutorials/video/getting-started',
      '/tutorials/audio/getting-started',
      '/how-it-works',
    ],
    suggestedFutureRoutes: [
      '/tools/transcribe-audio',
      '/guides/how-to-add-captions-to-video',
    ],
    recommendedInternalLinks: [
      { label: 'Transcribe video', route: '/tools/transcribe-video' },
      { label: 'Video converter', route: '/tools/video-converter' },
      {
        label: 'Video converter tutorial',
        route: '/tutorials/video/getting-started',
      },
      {
        label: 'Audio converter tutorial',
        route: '/tutorials/audio/getting-started',
      },
      { label: 'How it works', route: '/how-it-works' },
    ],
  },
  {
    slug: 'ai-summaries',
    title: 'AI summaries and descriptions',
    primaryKeyword: 'AI video summary',
    secondaryKeywords: [
      'summarize video',
      'AI transcript summary',
      'image caption AI',
      'media analysis AI',
    ],
    intent: 'informational',
    targetRoute: '/how-it-works',
    relatedRoutes: [
      '/',
      '/tutorials/video/getting-started',
      '/tutorials/audio/getting-started',
    ],
    suggestedFutureRoutes: [
      '/guides/ai-video-summaries',
      '/guides/ai-image-descriptions',
    ],
    recommendedInternalLinks: [
      { label: 'How it works', route: '/how-it-works' },
      {
        label: 'Video converter tutorial',
        route: '/tutorials/video/getting-started',
      },
    ],
  },
  {
    slug: 'privacy-safe-media',
    title: 'Privacy-safe media sharing',
    primaryKeyword: 'private file converter',
    secondaryKeywords: [
      'temporary file storage',
      'auto-delete uploads',
      'local AI processing',
      'no third-party AI providers',
    ],
    intent: 'commercial',
    targetRoute: '/how-it-works',
    relatedRoutes: ['/privacy-policy', '/terms-of-service', '/about'],
    suggestedFutureRoutes: [
      '/guides/privacy-safe-media-conversion',
      '/guides/how-uploads-are-deleted',
    ],
    recommendedInternalLinks: [
      { label: 'Privacy Policy', route: '/privacy-policy' },
      { label: 'How it works', route: '/how-it-works' },
      { label: 'About', route: '/about' },
    ],
  },
  {
    slug: 'video-to-gif',
    title: 'Video to GIF conversion',
    primaryKeyword: 'convert video to GIF',
    secondaryKeywords: [
      'video to animated GIF',
      'MP4 to GIF',
      'WebM to GIF',
      'make a GIF from a video',
      'free video to GIF converter',
    ],
    intent: 'transactional',
    targetRoute: '/tools/convert-video-to-animated-gif',
    relatedRoutes: [
      '/tools/compress-video',
      '/tools/video-converter',
      '/tutorials/video/getting-started',
    ],
    suggestedFutureRoutes: [
      '/guides/best-gif-settings',
      '/tools/convert-video-to-webp',
    ],
    recommendedInternalLinks: [
      { label: 'Convert video to GIF', route: '/tools/convert-video-to-animated-gif' },
      { label: 'Compress video', route: '/tools/compress-video' },
      { label: 'Video converter', route: '/tools/video-converter' },
      {
        label: 'Video converter tutorial',
        route: '/tutorials/video/getting-started',
      },
    ],
  },
  {
    slug: 'webp-to-jpg',
    title: 'WebP to JPG conversion',
    primaryKeyword: 'convert WebP to JPG',
    secondaryKeywords: [
      'WebP to JPEG',
      'change WebP to JPG',
      'open WebP file',
      '.webp to .jpg',
      'free WebP converter',
    ],
    intent: 'transactional',
    targetRoute: '/tools/convert-webp-to-jpg',
    relatedRoutes: [
      '/tools/image-converter',
      '/tools/remove-exif-metadata',
      // '/blog/image/image-optimization-guide', // hidden during AdSense review
      '/tutorials/image/getting-started',
    ],
    suggestedFutureRoutes: [
      '/tools/convert-jpg-to-webp',
      '/tools/convert-png-to-jpg',
      '/guides/why-webp',
    ],
    recommendedInternalLinks: [
      { label: 'Convert WebP to JPG', route: '/tools/convert-webp-to-jpg' },
      { label: 'Image converter', route: '/tools/image-converter' },
      { label: 'Remove EXIF metadata', route: '/tools/remove-exif-metadata' },
      // Hidden during AdSense review — re-enable when the blog returns.
      // {
      //   label: 'Image optimization guide',
      //   route: '/blog/image/image-optimization-guide',
      // },
    ],
  },
  {
    slug: 'wav-to-mp3',
    title: 'WAV to MP3 conversion',
    primaryKeyword: 'convert WAV to MP3',
    secondaryKeywords: [
      'WAV to MP3 converter',
      'change WAV to MP3',
      'compress WAV',
      '.wav to .mp3',
      'WAV file to MP3 online',
    ],
    intent: 'transactional',
    targetRoute: '/tools/convert-wav-to-mp3',
    relatedRoutes: [
      '/tools/audio-converter',
      '/tools/isolate-vocals-from-song',
      '/tutorials/audio/getting-started',
      // '/blog/audio/audio-quality-guide', // hidden during AdSense review
    ],
    suggestedFutureRoutes: [
      '/tools/convert-flac-to-mp3',
      '/tools/convert-m4a-to-mp3',
    ],
    recommendedInternalLinks: [
      { label: 'Convert WAV to MP3', route: '/tools/convert-wav-to-mp3' },
      { label: 'Audio converter', route: '/tools/audio-converter' },
      // Hidden during AdSense review — re-enable when the blog returns.
      // {
      //   label: 'Audio quality guide',
      //   route: '/blog/audio/audio-quality-guide',
      // },
    ],
  },
  {
    slug: 'isolate-vocals',
    title: 'Vocal isolation',
    primaryKeyword: 'isolate vocals from a song',
    secondaryKeywords: [
      'extract vocals from song',
      'vocal isolator online',
      'AI vocal extractor',
      'separate vocals from music',
      'acapella maker',
    ],
    intent: 'transactional',
    targetRoute: '/tools/isolate-vocals-from-song',
    relatedRoutes: [
      '/tools/audio-converter',
      '/tools/convert-wav-to-mp3',
      '/tutorials/audio/getting-started',
      // '/blog/audio/audio-quality-guide', // hidden during AdSense review
    ],
    suggestedFutureRoutes: [
      '/tools/remove-vocals',
      '/tools/remove-background-noise',
      '/guides/how-source-separation-works',
    ],
    recommendedInternalLinks: [
      { label: 'Isolate vocals from a song', route: '/tools/isolate-vocals-from-song' },
      { label: 'Audio converter', route: '/tools/audio-converter' },
      { label: 'Convert WAV to MP3', route: '/tools/convert-wav-to-mp3' },
      // Hidden during AdSense review — re-enable when the blog returns.
      // {
      //   label: 'Audio quality guide',
      //   route: '/blog/audio/audio-quality-guide',
      // },
    ],
  },
  {
    slug: 'srt-generator',
    title: 'SRT generator',
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
    intent: 'transactional',
    targetRoute: '/tools/srt-generator',
    relatedRoutes: [
      '/tools/caption-translator',
      '/tools/extract-audio-from-video',
      '/tools/transcribe-video',
      '/tools/transcode-to-hls',
      '/tools/transcode-to-dash',
    ],
    suggestedFutureRoutes: [
      '/guides/srt-vs-vtt',
      '/tools/burn-subtitles-into-video',
    ],
    recommendedInternalLinks: [
      { label: 'SRT generator', route: '/tools/srt-generator' },
      { label: 'Caption translator', route: '/tools/caption-translator' },
      { label: 'Extract audio from video', route: '/tools/extract-audio-from-video' },
      { label: 'Transcribe a video', route: '/tools/transcribe-video' },
    ],
  },
  {
    slug: 'caption-translator',
    title: 'Caption translator',
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
    intent: 'transactional',
    targetRoute: '/tools/caption-translator',
    relatedRoutes: [
      '/tools/srt-generator',
      '/tools/extract-audio-from-video',
      '/tools/stitch-audio-to-video',
      '/tools/transcode-to-hls',
      '/tools/transcode-to-dash',
    ],
    suggestedFutureRoutes: ['/guides/translating-youtube-captions'],
    recommendedInternalLinks: [
      { label: 'Caption translator', route: '/tools/caption-translator' },
      { label: 'SRT generator', route: '/tools/srt-generator' },
      { label: 'Stitch audio to video', route: '/tools/stitch-audio-to-video' },
    ],
  },
  {
    slug: 'audio-waveform-generator',
    title: 'Audio waveform generator',
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
    intent: 'transactional',
    targetRoute: '/tools/audio-waveform-generator',
    relatedRoutes: [
      '/tools/extract-audio-from-video',
      '/tools/srt-generator',
      '/tools/stitch-audio-to-video',
    ],
    suggestedFutureRoutes: ['/guides/audiogram-best-practices'],
    recommendedInternalLinks: [
      { label: 'Audio waveform generator', route: '/tools/audio-waveform-generator' },
      { label: 'Extract audio from video', route: '/tools/extract-audio-from-video' },
      { label: 'SRT generator', route: '/tools/srt-generator' },
    ],
  },
  {
    slug: 'extract-audio-from-video',
    title: 'Extract audio from video',
    primaryKeyword: 'extract audio from video',
    secondaryKeywords: [
      'video to MP3',
      'convert video to audio',
      'save audio from video',
      'MP4 to MP3',
      'MOV to WAV',
      'extract audio MP4 online',
    ],
    intent: 'transactional',
    targetRoute: '/tools/extract-audio-from-video',
    relatedRoutes: [
      '/tools/srt-generator',
      '/tools/audio-waveform-generator',
      '/tools/stitch-audio-to-video',
    ],
    suggestedFutureRoutes: ['/guides/podcast-from-video'],
    recommendedInternalLinks: [
      { label: 'Extract audio from video', route: '/tools/extract-audio-from-video' },
      { label: 'Audio waveform generator', route: '/tools/audio-waveform-generator' },
      { label: 'SRT generator', route: '/tools/srt-generator' },
    ],
  },
  {
    slug: 'extract-video-only-from-video',
    title: 'Remove audio from video',
    primaryKeyword: 'remove audio from video',
    secondaryKeywords: [
      'mute video online',
      'extract video without audio',
      'video only extractor',
      'delete audio track from video',
      'silent video maker',
      'strip audio from MP4',
    ],
    intent: 'transactional',
    targetRoute: '/tools/extract-video-only-from-video',
    relatedRoutes: [
      '/tools/extract-audio-from-video',
      '/tools/stitch-audio-to-video',
      '/tools/extract-frames-from-video',
    ],
    suggestedFutureRoutes: ['/guides/social-silent-video'],
    recommendedInternalLinks: [
      { label: 'Remove audio from video', route: '/tools/extract-video-only-from-video' },
      { label: 'Extract audio from video', route: '/tools/extract-audio-from-video' },
      { label: 'Stitch audio to video', route: '/tools/stitch-audio-to-video' },
    ],
  },
  {
    slug: 'extract-frames-from-video',
    title: 'Extract frames from video',
    primaryKeyword: 'extract frames from video',
    secondaryKeywords: [
      'video to images',
      'video frame extractor',
      'capture still images from video',
      'export frames from video',
      'video to JPG online',
      'extract every Nth frame',
    ],
    intent: 'transactional',
    targetRoute: '/tools/extract-frames-from-video',
    relatedRoutes: [
      '/tools/extract-audio-from-video',
      '/tools/srt-generator',
      '/tools/extract-video-only-from-video',
    ],
    suggestedFutureRoutes: ['/guides/thumbnails-from-video'],
    recommendedInternalLinks: [
      { label: 'Extract frames from video', route: '/tools/extract-frames-from-video' },
      { label: 'Extract audio from video', route: '/tools/extract-audio-from-video' },
      { label: 'Remove audio from video', route: '/tools/extract-video-only-from-video' },
    ],
  },
  {
    slug: 'stitch-audio-to-video',
    title: 'Stitch audio to video',
    primaryKeyword: 'add audio to video',
    secondaryKeywords: [
      'add music to video',
      'add voiceover to video',
      'combine audio and video',
      'replace audio in video',
      'mix audio with video',
      'add narration to video',
    ],
    intent: 'transactional',
    targetRoute: '/tools/stitch-audio-to-video',
    relatedRoutes: [
      '/tools/extract-audio-from-video',
      '/tools/extract-video-only-from-video',
      '/tools/audio-waveform-generator',
    ],
    suggestedFutureRoutes: ['/guides/voiceover-workflow'],
    recommendedInternalLinks: [
      { label: 'Stitch audio to video', route: '/tools/stitch-audio-to-video' },
      { label: 'Extract audio from video', route: '/tools/extract-audio-from-video' },
      { label: 'Remove audio from video', route: '/tools/extract-video-only-from-video' },
    ],
  },
  /* FFmpeg-education cluster hidden during AdSense review because every
     destination it pointed at lives under /blog. Re-enable alongside the
     blog when new posts are ready.
  {
    slug: 'ffmpeg-education',
    title: 'FFmpeg and media format education',
    primaryKeyword: 'FFmpeg tutorial',
    secondaryKeywords: [
      'how FFmpeg works',
      'video codec explained',
      'audio codec explained',
      'container vs codec',
    ],
    intent: 'informational',
    targetRoute: '/blog',
    relatedRoutes: [
      '/blog/video/video-compression-guide',
      '/blog/image/image-optimization-guide',
      '/blog/audio/audio-quality-guide',
    ],
    suggestedFutureRoutes: [
      '/guides/container-vs-codec',
      '/guides/ffmpeg-cheatsheet',
    ],
    recommendedInternalLinks: [
      { label: 'Browse the blog', route: '/blog' },
      {
        label: 'Video compression guide',
        route: '/blog/video/video-compression-guide',
      },
      {
        label: 'Audio quality guide',
        route: '/blog/audio/audio-quality-guide',
      },
    ],
  },
  */
];

export const KEYWORD_CLUSTER_MAP: Record<string, KeywordCluster> =
  KEYWORD_CLUSTERS.reduce(
    (acc, cluster) => {
      acc[cluster.slug] = cluster;
      return acc;
    },
    {} as Record<string, KeywordCluster>,
  );

export const getClusterBySlug = (slug: string): KeywordCluster | undefined =>
  KEYWORD_CLUSTER_MAP[slug];
