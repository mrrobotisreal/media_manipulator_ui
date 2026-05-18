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
    targetRoute: '/',
    relatedRoutes: [
      '/tutorials/image/getting-started',
      '/blog/image/image-optimization-guide',
      '/how-it-works',
    ],
    suggestedFutureRoutes: [
      '/tools/image-converter',
      '/tools/convert-webp-to-jpg',
      '/tools/convert-png-to-webp',
      '/tools/convert-heic-to-jpg',
      '/guides/jpg-vs-png-vs-webp',
    ],
    recommendedInternalLinks: [
      {
        label: 'Image converter tutorial',
        route: '/tutorials/image/getting-started',
      },
      {
        label: 'Image optimization guide',
        route: '/blog/image/image-optimization-guide',
      },
      { label: 'Open the converter', route: '/' },
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
      '/blog/image/image-optimization-guide',
      '/tutorials/image/getting-started',
    ],
    suggestedFutureRoutes: [
      '/tools/compress-image',
      '/guides/best-image-compression-format',
    ],
    recommendedInternalLinks: [
      {
        label: 'Image optimization guide',
        route: '/blog/image/image-optimization-guide',
      },
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
    targetRoute: '/',
    relatedRoutes: [
      '/blog/image/image-optimization-guide',
      '/tutorials/image/getting-started',
      '/privacy-policy',
    ],
    suggestedFutureRoutes: [
      '/tools/remove-exif-metadata',
      '/guides/remove-gps-metadata-from-photos',
      '/guides/what-is-exif-metadata',
    ],
    recommendedInternalLinks: [
      {
        label: 'Image converter tutorial',
        route: '/tutorials/image/getting-started',
      },
      {
        label: 'Image optimization guide',
        route: '/blog/image/image-optimization-guide',
      },
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
    targetRoute: '/',
    relatedRoutes: [
      '/tutorials/video/getting-started',
      '/blog/video/video-compression-guide',
    ],
    suggestedFutureRoutes: [
      '/tools/video-converter',
      '/tools/convert-mp4-to-webm',
      '/tools/convert-mov-to-mp4',
      '/guides/best-video-format-for-websites',
      '/guides/mp4-vs-webm',
    ],
    recommendedInternalLinks: [
      {
        label: 'Video converter tutorial',
        route: '/tutorials/video/getting-started',
      },
      {
        label: 'Video compression guide',
        route: '/blog/video/video-compression-guide',
      },
      { label: 'Open the converter', route: '/' },
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
    targetRoute: '/blog/video/video-compression-guide',
    relatedRoutes: ['/', '/tutorials/video/getting-started'],
    suggestedFutureRoutes: [
      '/tools/compress-video',
      '/guides/h264-vs-h265',
      '/guides/what-bitrate-should-i-use',
    ],
    recommendedInternalLinks: [
      {
        label: 'Video compression guide',
        route: '/blog/video/video-compression-guide',
      },
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
    targetRoute: '/',
    relatedRoutes: [
      '/tutorials/audio/getting-started',
      '/blog/audio/audio-quality-guide',
    ],
    suggestedFutureRoutes: [
      '/tools/audio-converter',
      '/tools/convert-wav-to-mp3',
      '/tools/convert-flac-to-mp3',
      '/guides/wav-vs-mp3-vs-flac',
    ],
    recommendedInternalLinks: [
      {
        label: 'Audio converter tutorial',
        route: '/tutorials/audio/getting-started',
      },
      {
        label: 'Audio quality guide',
        route: '/blog/audio/audio-quality-guide',
      },
      { label: 'Open the converter', route: '/' },
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
    targetRoute: '/tutorials/audio/getting-started',
    relatedRoutes: ['/', '/blog/audio/audio-quality-guide'],
    suggestedFutureRoutes: [
      '/tools/remove-background-noise',
      '/tools/isolate-vocals',
      '/tools/remove-vocals',
      '/guides/how-to-clean-podcast-audio',
    ],
    recommendedInternalLinks: [
      {
        label: 'Audio converter tutorial',
        route: '/tutorials/audio/getting-started',
      },
      {
        label: 'Audio quality guide',
        route: '/blog/audio/audio-quality-guide',
      },
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
    targetRoute: '/',
    relatedRoutes: [
      '/tutorials/video/getting-started',
      '/tutorials/audio/getting-started',
      '/how-it-works',
    ],
    suggestedFutureRoutes: [
      '/tools/transcribe-video',
      '/tools/transcribe-audio',
      '/guides/how-to-add-captions-to-video',
    ],
    recommendedInternalLinks: [
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
