/**
 * Central SEO metadata map for every public route.
 *
 * - Each route entry contains the title, meta description, canonical URL,
 *   Open Graph + Twitter card metadata, keywords, and JSON-LD structured
 *   data blocks.
 * - The companion useSeoMeta hook (src/components/seo-head.tsx) consumes
 *   this map and updates the document head as the SPA navigates.
 * - The prerender script (scripts/prerender.mjs) also reads this map so
 *   that prerendered HTML contains per-route metadata at build time.
 */

import { TOOL_PAGES, type ToolPageContent } from '@/content/toolPages';

export const SITE_ORIGIN = 'https://www.media-manipulator.com';
export const SITE_NAME = 'Media Manipulator';
export const ORG_NAME = 'CreaTV Ltd.';
export const DEFAULT_OG_IMAGE = `${SITE_ORIGIN}/MMOpenGraph.jpg`;
export const DEFAULT_LOGO = `${SITE_ORIGIN}/MMIcon.webp`;

export type JsonLd = Record<string, unknown>;

export interface RouteSeo {
  path: string;
  title: string;
  description: string;
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogType: 'website' | 'article';
  ogImage: string;
  twitterCard: 'summary' | 'summary_large_image';
  keywords: string[];
  jsonLd: JsonLd[];
  /** When true, applySeoMeta will emit <meta name="robots" content="noindex">. */
  noindex?: boolean;
}

const buildCanonical = (path: string): string => {
  if (path === '/' || path === '') return `${SITE_ORIGIN}/`;
  return `${SITE_ORIGIN}${path.startsWith('/') ? path : `/${path}`}`;
};

const breadcrumbList = (
  items: Array<{ name: string; path: string }>,
): JsonLd => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: `${SITE_ORIGIN}${item.path === '/' ? '/' : item.path}`,
  })),
});

const organizationLd: JsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: ORG_NAME,
  url: SITE_ORIGIN,
  logo: DEFAULT_LOGO,
  sameAs: ['https://www.creatv.io/'],
};

const webApplicationLd: JsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: SITE_NAME,
  url: SITE_ORIGIN,
  applicationCategory: 'MultimediaApplication',
  operatingSystem: 'Web',
  description:
    'Free online media conversion, editing, compression, transcription, and metadata tools for images, videos, and audio files.',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  publisher: {
    '@type': 'Organization',
    name: ORG_NAME,
    url: SITE_ORIGIN,
  },
};

const websiteLd: JsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: SITE_ORIGIN,
  potentialAction: {
    '@type': 'SearchAction',
    target: `${SITE_ORIGIN}/?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
};

const articleLd = (params: {
  path: string;
  title: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  image?: string;
  section: string;
  keywords: string[];
}): JsonLd => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: params.title,
  description: params.description,
  image: params.image || DEFAULT_OG_IMAGE,
  datePublished: params.datePublished,
  dateModified: params.dateModified || params.datePublished,
  articleSection: params.section,
  keywords: params.keywords.join(', '),
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': buildCanonical(params.path),
  },
  author: {
    '@type': 'Organization',
    name: ORG_NAME,
    url: SITE_ORIGIN,
  },
  publisher: {
    '@type': 'Organization',
    name: ORG_NAME,
    url: SITE_ORIGIN,
    logo: {
      '@type': 'ImageObject',
      url: DEFAULT_LOGO,
    },
  },
});

const webApplicationToolLd = (tool: ToolPageContent): JsonLd => ({
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: `${SITE_NAME} — ${tool.name}`,
  url: buildCanonical(`/tools/${tool.slug}`),
  applicationCategory: 'MultimediaApplication',
  operatingSystem: 'Web',
  description: tool.metaDescription,
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  publisher: {
    '@type': 'Organization',
    name: ORG_NAME,
    url: SITE_ORIGIN,
  },
});

const faqPageLd = (tool: ToolPageContent): JsonLd => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: tool.faq.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  })),
});

// howToLd surfaces the tool's flow-step copy as a Google-eligible HowTo
// snippet. Only tools whose `flowSteps` are actually a step-by-step recipe
// should emit this; we gate it on a tool-by-tool basis below by always
// including it when there are 3+ steps (single-step "flows" do not benefit
// from the snippet).
const howToLd = (tool: ToolPageContent): JsonLd => ({
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: `How to use ${tool.name}`,
  description: tool.tagline,
  totalTime: 'PT2M',
  step: tool.flowSteps.map((step, idx) => ({
    '@type': 'HowToStep',
    position: idx + 1,
    name: step.title,
    text: step.description || step.title,
    url: `${buildCanonical(`/tools/${tool.slug}`)}#step-${idx + 1}`,
  })),
});

const buildToolRouteSeo = (tool: ToolPageContent): RouteSeo => {
  const path = `/tools/${tool.slug}`;
  return {
    path,
    title: tool.metaTitle,
    description: tool.metaDescription,
    canonicalUrl: buildCanonical(path),
    ogTitle: tool.ogTitle,
    ogDescription: tool.ogDescription,
    ogType: 'website',
    ogImage: DEFAULT_OG_IMAGE,
    twitterCard: 'summary_large_image',
    keywords: [tool.primaryKeyword, ...tool.secondaryKeywords],
    jsonLd: [
      webApplicationToolLd(tool),
      breadcrumbList([
        { name: 'Home', path: '/' },
        { name: 'Tools', path: '/tools' },
        { name: tool.name, path },
      ]),
      faqPageLd(tool),
      // Only emit HowTo for tools that have a real 3+ step walkthrough — a
      // single-step "flow" doesn't qualify for the HowTo rich result and Google
      // can penalize boilerplate HowTo markup that doesn't match the page.
      ...(tool.flowSteps.length >= 3 ? [howToLd(tool)] : []),
    ],
  };
};

const techArticleLd = (params: {
  path: string;
  title: string;
  description: string;
  section: string;
  keywords: string[];
  dependencies?: string;
}): JsonLd => ({
  ...articleLd({
    path: params.path,
    title: params.title,
    description: params.description,
    datePublished: '2026-05-15',
    section: params.section,
    keywords: params.keywords,
  }),
  '@type': 'TechArticle',
  proficiencyLevel: 'Beginner',
  dependencies: params.dependencies,
});

const ROUTES: RouteSeo[] = [
  {
    path: '/',
    title:
      'Free Online Media Converter, Editor, Transcriber & Metadata Tool | Media Manipulator',
    description:
      'Convert, edit, compress, transcribe, summarize, and inspect image, video, and audio files online. Media Manipulator supports media conversion, metadata tools, AI summaries, and privacy-focused file processing.',
    canonicalUrl: buildCanonical('/'),
    ogTitle:
      'Free Online Media Converter, Editor, Transcriber & Metadata Tool | Media Manipulator',
    ogDescription:
      'Convert, edit, compress, transcribe, summarize, and inspect image, video, and audio files online with Media Manipulator.',
    ogType: 'website',
    ogImage: DEFAULT_OG_IMAGE,
    twitterCard: 'summary_large_image',
    keywords: [
      'free media converter',
      'online file converter',
      'image converter',
      'video converter',
      'audio converter',
      'transcribe video',
      'remove metadata',
      'EXIF remover',
      'media tools',
    ],
    jsonLd: [webApplicationLd, websiteLd, organizationLd],
  },
  /* Blog SEO entries hidden during AdSense review — re-enable when the
     blog section is reactivated. Leaving the code here so titles, JSON-LD,
     and breadcrumbs stay easy to re-enable.
  {
    path: '/blog',
    title:
      'Media Conversion, Compression & Editing Guides | Media Manipulator Blog',
    description:
      'Learn how media formats, compression, metadata, transcription, and FFmpeg-powered file processing work with practical guides from Media Manipulator.',
    canonicalUrl: buildCanonical('/blog'),
    ogTitle: 'Media Manipulator Blog: Conversion, Compression & Editing Guides',
    ogDescription:
      'Practical guides on video compression, image optimization, audio quality, and metadata tools.',
    ogType: 'website',
    ogImage: DEFAULT_OG_IMAGE,
    twitterCard: 'summary_large_image',
    keywords: [
      'media blog',
      'video compression guide',
      'image optimization guide',
      'audio quality guide',
      'FFmpeg tutorials',
      'media conversion',
    ],
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'Blog',
        name: 'Media Manipulator Blog',
        url: buildCanonical('/blog'),
        publisher: {
          '@type': 'Organization',
          name: ORG_NAME,
          url: SITE_ORIGIN,
        },
      },
      breadcrumbList([
        { name: 'Home', path: '/' },
        { name: 'Blog', path: '/blog' },
      ]),
    ],
  },
  {
    path: '/blog/video/video-compression-guide',
    title:
      'Video Compression Guide: Reduce File Size Without Ruining Quality | Media Manipulator',
    description:
      'Learn how video compression works, how codecs and bitrate affect quality, and how to reduce video file size for the web using practical Media Manipulator and FFmpeg concepts.',
    canonicalUrl: buildCanonical('/blog/video/video-compression-guide'),
    ogTitle: 'Video Compression Guide: Reduce File Size Without Ruining Quality',
    ogDescription:
      'How codecs, bitrate, and container formats affect video quality, and how to compress video for the web.',
    ogType: 'article',
    ogImage: DEFAULT_OG_IMAGE,
    twitterCard: 'summary_large_image',
    keywords: [
      'video compression',
      'compress MP4',
      'reduce video file size',
      'video bitrate',
      'web video optimization',
      'FFmpeg compression',
    ],
    jsonLd: [
      articleLd({
        path: '/blog/video/video-compression-guide',
        title:
          'Video Compression Guide: Reduce File Size Without Ruining Quality',
        description:
          'How video compression works, how codecs and bitrate affect quality, and how to compress video for the web.',
        datePublished: '2025-06-13',
        dateModified: '2026-05-15',
        section: 'Video',
        keywords: [
          'video compression',
          'compress MP4',
          'reduce video file size',
          'video bitrate',
          'FFmpeg compression',
        ],
      }),
      breadcrumbList([
        { name: 'Home', path: '/' },
        { name: 'Blog', path: '/blog' },
        {
          name: 'Video Compression Guide',
          path: '/blog/video/video-compression-guide',
        },
      ]),
    ],
  },
  {
    path: '/blog/image/image-optimization-guide',
    title:
      'Image Optimization Guide: Compress, Resize & Convert Images for the Web | Media Manipulator',
    description:
      'Learn how to optimize JPG, PNG, WebP, AVIF, and GIF files for faster websites, smaller uploads, better quality, and privacy-safe sharing.',
    canonicalUrl: buildCanonical('/blog/image/image-optimization-guide'),
    ogTitle:
      'Image Optimization Guide: Compress, Resize & Convert Images for the Web',
    ogDescription:
      'How to choose JPG vs PNG vs WebP vs AVIF, resize and compress images, and remove EXIF metadata.',
    ogType: 'article',
    ogImage: DEFAULT_OG_IMAGE,
    twitterCard: 'summary_large_image',
    keywords: [
      'image optimization',
      'compress images',
      'convert WebP',
      'resize images',
      'remove EXIF metadata',
      'web image formats',
    ],
    jsonLd: [
      articleLd({
        path: '/blog/image/image-optimization-guide',
        title:
          'Image Optimization Guide: Compress, Resize & Convert Images for the Web',
        description:
          'Optimize JPG, PNG, WebP, AVIF, and GIF files for faster websites and smaller uploads.',
        datePublished: '2025-06-14',
        dateModified: '2026-05-15',
        section: 'Image',
        keywords: [
          'image optimization',
          'compress images',
          'convert WebP',
          'resize images',
          'remove EXIF metadata',
        ],
      }),
      breadcrumbList([
        { name: 'Home', path: '/' },
        { name: 'Blog', path: '/blog' },
        {
          name: 'Image Optimization Guide',
          path: '/blog/image/image-optimization-guide',
        },
      ]),
    ],
  },
  {
    path: '/blog/audio/audio-quality-guide',
    title:
      'Audio Quality Guide: Bitrate, Formats, Compression & Cleanup | Media Manipulator',
    description:
      'Learn how audio bitrate, sample rate, channels, codecs, compression, cleanup, and transcription affect file size and quality.',
    canonicalUrl: buildCanonical('/blog/audio/audio-quality-guide'),
    ogTitle: 'Audio Quality Guide: Bitrate, Formats, Compression & Cleanup',
    ogDescription:
      'How bitrate, sample rate, codecs, and audio cleanup affect file size and listening quality.',
    ogType: 'article',
    ogImage: DEFAULT_OG_IMAGE,
    twitterCard: 'summary_large_image',
    keywords: [
      'audio quality',
      'audio bitrate',
      'compress audio',
      'convert WAV to MP3',
      'audio cleanup',
      'transcribe audio',
    ],
    jsonLd: [
      articleLd({
        path: '/blog/audio/audio-quality-guide',
        title: 'Audio Quality Guide: Bitrate, Formats, Compression & Cleanup',
        description:
          'How bitrate, sample rate, codecs, and audio cleanup affect file size and quality.',
        datePublished: '2025-06-14',
        dateModified: '2026-05-15',
        section: 'Audio',
        keywords: [
          'audio quality',
          'audio bitrate',
          'compress audio',
          'convert WAV to MP3',
          'audio cleanup',
        ],
      }),
      breadcrumbList([
        { name: 'Home', path: '/' },
        { name: 'Blog', path: '/blog' },
        {
          name: 'Audio Quality Guide',
          path: '/blog/audio/audio-quality-guide',
        },
      ]),
    ],
  },
  */
  {
    path: '/about',
    title: 'About Media Manipulator | Free Online Media Tools by CreaTV Ltd.',
    description:
      'Media Manipulator is a free media utility from CreaTV Ltd. for converting, editing, compressing, transcribing, summarizing, and inspecting image, video, and audio files.',
    canonicalUrl: buildCanonical('/about'),
    ogTitle: 'About Media Manipulator | Free Online Media Tools by CreaTV Ltd.',
    ogDescription:
      'Media Manipulator is a free media utility from CreaTV Ltd. for converting, editing, transcribing, and inspecting media files.',
    ogType: 'website',
    ogImage: DEFAULT_OG_IMAGE,
    twitterCard: 'summary_large_image',
    keywords: [
      'about Media Manipulator',
      'CreaTV Ltd',
      'free media tools',
      'online media editor',
    ],
    jsonLd: [
      organizationLd,
      breadcrumbList([
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' },
      ]),
    ],
  },
  {
    path: '/how-it-works',
    title:
      'How Media Manipulator Works | File Conversion, AI Processing & Temporary Storage',
    description:
      'Learn how Media Manipulator processes files, converts media formats, handles AI transcription and summaries, scans uploads for safety, and temporarily stores outputs for up to 24 hours.',
    canonicalUrl: buildCanonical('/how-it-works'),
    ogTitle:
      'How Media Manipulator Works | Conversion, AI Processing & Temporary Storage',
    ogDescription:
      'How files are processed, converted, transcribed, scanned, and temporarily stored on Media Manipulator.',
    ogType: 'website',
    ogImage: DEFAULT_OG_IMAGE,
    twitterCard: 'summary_large_image',
    keywords: [
      'how media conversion works',
      'AI transcription',
      'temporary file storage',
      'metadata removal',
      'file processing',
    ],
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'How Media Manipulator Works',
        url: buildCanonical('/how-it-works'),
        description:
          'How files are processed, converted, transcribed, scanned, and temporarily stored on Media Manipulator.',
        isPartOf: {
          '@type': 'WebSite',
          name: SITE_NAME,
          url: SITE_ORIGIN,
        },
      },
      breadcrumbList([
        { name: 'Home', path: '/' },
        { name: 'How it Works', path: '/how-it-works' },
      ]),
    ],
  },
  {
    path: '/tutorials',
    title: 'Media Manipulator Tutorials | Learn Image, Video & Audio Tools',
    description:
      "Step-by-step tutorials for using Media Manipulator's image converter, video converter, audio converter, metadata tools, transcription tools, and AI media features.",
    canonicalUrl: buildCanonical('/tutorials'),
    ogTitle: 'Media Manipulator Tutorials | Image, Video & Audio Tools',
    ogDescription:
      'Step-by-step tutorials for the image, video, and audio converters and AI media features.',
    ogType: 'website',
    ogImage: DEFAULT_OG_IMAGE,
    twitterCard: 'summary_large_image',
    keywords: [
      'media tutorials',
      'image converter tutorial',
      'video converter tutorial',
      'audio converter tutorial',
      'online converter guide',
    ],
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Media Manipulator Tutorials',
        url: buildCanonical('/tutorials'),
        description:
          "Step-by-step tutorials for Media Manipulator's image, video, and audio tools.",
      },
      breadcrumbList([
        { name: 'Home', path: '/' },
        { name: 'Tutorials', path: '/tutorials' },
      ]),
    ],
  },
  {
    path: '/tutorials/audio/getting-started',
    title: 'Getting Started with Audio Conversion | Media Manipulator Tutorial',
    description:
      "Learn how to convert, compress, clean up, and transcribe audio files with Media Manipulator's free online audio tools.",
    canonicalUrl: buildCanonical('/tutorials/audio/getting-started'),
    ogTitle:
      'Getting Started with Audio Conversion | Media Manipulator Tutorial',
    ogDescription:
      'Convert, compress, clean up, and transcribe audio files with the Media Manipulator audio tools.',
    ogType: 'article',
    ogImage: DEFAULT_OG_IMAGE,
    twitterCard: 'summary_large_image',
    keywords: [
      'audio converter tutorial',
      'convert audio online',
      'audio transcription',
      'audio cleanup',
      'compress audio',
    ],
    jsonLd: [
      techArticleLd({
        path: '/tutorials/audio/getting-started',
        title:
          'Getting Started with Audio Conversion | Media Manipulator Tutorial',
        description:
          'Convert, compress, clean up, and transcribe audio files with the Media Manipulator audio tools.',
        section: 'Audio Tutorials',
        keywords: [
          'audio converter tutorial',
          'convert audio online',
          'audio transcription',
          'audio cleanup',
        ],
        dependencies: 'Modern web browser',
      }),
      breadcrumbList([
        { name: 'Home', path: '/' },
        { name: 'Tutorials', path: '/tutorials' },
        {
          name: 'Audio: Getting Started',
          path: '/tutorials/audio/getting-started',
        },
      ]),
      {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'Media Manipulator Audio Tools',
        url: SITE_ORIGIN,
        applicationCategory: 'MultimediaApplication',
        operatingSystem: 'Web',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      },
    ],
  },
  {
    path: '/tutorials/video/getting-started',
    title: 'Getting Started with Video Conversion | Media Manipulator Tutorial',
    description:
      "Learn how to convert, compress, trim, cut, and transcribe video files with Media Manipulator's free online video tools.",
    canonicalUrl: buildCanonical('/tutorials/video/getting-started'),
    ogTitle:
      'Getting Started with Video Conversion | Media Manipulator Tutorial',
    ogDescription:
      'Convert, compress, trim, and transcribe video files with Media Manipulator video tools.',
    ogType: 'article',
    ogImage: DEFAULT_OG_IMAGE,
    twitterCard: 'summary_large_image',
    keywords: [
      'video converter tutorial',
      'convert video online',
      'compress video',
      'trim video',
      'transcribe video',
    ],
    jsonLd: [
      techArticleLd({
        path: '/tutorials/video/getting-started',
        title:
          'Getting Started with Video Conversion | Media Manipulator Tutorial',
        description:
          'Convert, compress, trim, and transcribe video files with the Media Manipulator video tools.',
        section: 'Video Tutorials',
        keywords: [
          'video converter tutorial',
          'convert video online',
          'compress video',
          'trim video',
        ],
        dependencies: 'Modern web browser',
      }),
      breadcrumbList([
        { name: 'Home', path: '/' },
        { name: 'Tutorials', path: '/tutorials' },
        {
          name: 'Video: Getting Started',
          path: '/tutorials/video/getting-started',
        },
      ]),
      {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'Media Manipulator Video Tools',
        url: SITE_ORIGIN,
        applicationCategory: 'MultimediaApplication',
        operatingSystem: 'Web',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      },
    ],
  },
  {
    path: '/tutorials/image/getting-started',
    title: 'Getting Started with Image Conversion | Media Manipulator Tutorial',
    description:
      "Learn how to convert, resize, crop, filter, optimize, and remove metadata from images using Media Manipulator's free online image tools.",
    canonicalUrl: buildCanonical('/tutorials/image/getting-started'),
    ogTitle:
      'Getting Started with Image Conversion | Media Manipulator Tutorial',
    ogDescription:
      'Convert, resize, crop, filter, and remove metadata from images with the Media Manipulator image tools.',
    ogType: 'article',
    ogImage: DEFAULT_OG_IMAGE,
    twitterCard: 'summary_large_image',
    keywords: [
      'image converter tutorial',
      'convert image online',
      'resize image',
      'crop image',
      'remove EXIF metadata',
    ],
    jsonLd: [
      techArticleLd({
        path: '/tutorials/image/getting-started',
        title:
          'Getting Started with Image Conversion | Media Manipulator Tutorial',
        description:
          'Convert, resize, crop, and remove metadata from images with the Media Manipulator image tools.',
        section: 'Image Tutorials',
        keywords: [
          'image converter tutorial',
          'convert image online',
          'resize image',
          'crop image',
          'remove EXIF metadata',
        ],
        dependencies: 'Modern web browser',
      }),
      breadcrumbList([
        { name: 'Home', path: '/' },
        { name: 'Tutorials', path: '/tutorials' },
        {
          name: 'Image: Getting Started',
          path: '/tutorials/image/getting-started',
        },
      ]),
      {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'Media Manipulator Image Tools',
        url: SITE_ORIGIN,
        applicationCategory: 'MultimediaApplication',
        operatingSystem: 'Web',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      },
    ],
  },
  {
    path: '/tutorials/ai-frame-interpolation',
    title:
      'What Is AI Frame Interpolation? How Video FPS Smoothing Works | Media Manipulator',
    description:
      'Learn how AI frame interpolation works, how it compares to basic FPS conversion, when to pick 48/60/120fps, common artifacts, and how to use the Media Manipulator AI Frame Interpolation tool.',
    canonicalUrl: buildCanonical('/tutorials/ai-frame-interpolation'),
    ogTitle:
      'What Is AI Frame Interpolation? How Video FPS Smoothing Works',
    ogDescription:
      'Smooth video motion with AI frame interpolation. Compare AI interpolation vs basic FPS conversion, learn about RIFE, and see when to pick 48/60/120fps.',
    ogType: 'article',
    ogImage: DEFAULT_OG_IMAGE,
    twitterCard: 'summary_large_image',
    keywords: [
      'AI frame interpolation',
      'video frame interpolation',
      'convert video to 60fps',
      'convert video to 120fps',
      'smooth video motion',
      'RIFE frame interpolation',
      'AI FPS converter',
      'video motion smoothing',
    ],
    jsonLd: [
      techArticleLd({
        path: '/tutorials/ai-frame-interpolation',
        title:
          'What Is AI Frame Interpolation? How Video FPS Smoothing Works',
        description:
          'Learn how AI frame interpolation works, how it compares to basic FPS conversion, and when to use 48/60/120fps.',
        section: 'Video Tutorials',
        keywords: [
          'AI frame interpolation',
          'video frame interpolation',
          'increase video FPS',
          'convert video to 60fps',
          'convert video to 120fps',
          'RIFE',
        ],
        dependencies: 'Modern web browser',
      }),
      breadcrumbList([
        { name: 'Home', path: '/' },
        { name: 'Tutorials', path: '/tutorials' },
        {
          name: 'AI Frame Interpolation',
          path: '/tutorials/ai-frame-interpolation',
        },
      ]),
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Does AI frame interpolation improve video quality?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'It improves motion smoothness, not resolution or sharpness. The eye sees more frames per second, which makes motion feel less stuttery.',
            },
          },
          {
            '@type': 'Question',
            name: 'Is AI frame interpolation the same as just increasing FPS?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'No. Basic FPS conversion duplicates, drops, or blends frames; AI interpolation synthesizes new in-between frames using a neural network.',
            },
          },
          {
            '@type': 'Question',
            name: 'Can I convert 30fps to 60fps?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes — 30fps to 60fps is one of the most common targets and a good first test.',
            },
          },
          {
            '@type': 'Question',
            name: 'Can I convert 60fps to 120fps?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes. 120fps roughly doubles the GPU work versus 60fps and produces a larger file.',
            },
          },
          {
            '@type': 'Question',
            name: 'Why can frame interpolation create artifacts?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'The model has to guess what happens between two real frames, so fast motion, occlusions, scene cuts, hair, hands, and wheels can warp or smear in the synthesized frame.',
            },
          },
          {
            '@type': 'Question',
            name: 'What output format does the tool create?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'MP4 with H.264 video and AAC audio. v1 only emits MP4.',
            },
          },
          {
            '@type': 'Question',
            name: 'Is 60fps always better than 30fps?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Not always — cinematic content is often intended at 24 or 30fps. Pick the FPS that matches how you want the result to feel.',
            },
          },
          {
            '@type': 'Question',
            name: 'Is AI frame interpolation better than FFmpeg FPS conversion?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'For most clips, AI interpolation produces cleaner motion than FFmpeg minterpolate, though minterpolate is faster.',
            },
          },
          {
            '@type': 'Question',
            name: 'Why do scene cuts sometimes look strange after interpolation?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'The model assumes adjacent frames belong to the same motion sequence; a hard scene cut breaks that assumption and can show a brief warp.',
            },
          },
        ],
      },
      {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'Media Manipulator AI Frame Interpolation',
        url: buildCanonical('/tools/ai-frame-interpolation'),
        applicationCategory: 'MultimediaApplication',
        operatingSystem: 'Web',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      },
    ],
  },
  {
    path: '/tutorials/content-studio',
    title:
      'How to Use Content Studio: Multi-Track Video Editing in Your Browser | Media Manipulator',
    description:
      'Step-by-step Content Studio tutorial: import media, build a multi-track timeline, trim, split and ripple-delete, add cross-dissolves, color adjustments and text overlays, and export MP4 — all in your browser.',
    canonicalUrl: buildCanonical('/tutorials/content-studio'),
    ogTitle: 'How to Use Content Studio — Multi-Track Video Editing in Your Browser',
    ogDescription:
      'Import media, build a multi-track timeline, add transitions, color and text overlays, and export MP4 with Content Studio.',
    ogType: 'article',
    ogImage: DEFAULT_OG_IMAGE,
    twitterCard: 'summary_large_image',
    keywords: [
      'content studio tutorial',
      'online video editor tutorial',
      'multi-track timeline',
      'how to edit video in browser',
      'cross dissolve',
      'text overlay video',
      'export mp4',
    ],
    jsonLd: [
      techArticleLd({
        path: '/tutorials/content-studio',
        title: 'How to Use Content Studio: Multi-Track Video Editing in Your Browser',
        description:
          'Import media, build a multi-track timeline, trim/split/ripple, add cross-dissolves, color and text overlays, and export MP4.',
        section: 'Video Tutorials',
        keywords: ['content studio tutorial', 'online video editor', 'multi-track timeline', 'export mp4'],
        dependencies: 'Modern web browser',
      }),
      breadcrumbList([
        { name: 'Home', path: '/' },
        { name: 'Tutorials', path: '/tutorials' },
        { name: 'Content Studio', path: '/tutorials/content-studio' },
      ]),
      {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'Media Manipulator Content Studio',
        url: buildCanonical('/tools/content-studio'),
        applicationCategory: 'MultimediaApplication',
        operatingSystem: 'Web',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      },
    ],
  },
  {
    path: '/tools',
    title: 'Free Online Media Tools | Media Manipulator',
    description:
      'Free online image, video, audio, AI, and metadata tools — convert, compress, transcribe, remove EXIF, isolate vocals, and more.',
    canonicalUrl: buildCanonical('/tools'),
    ogTitle: 'Free Online Media Tools | Media Manipulator',
    ogDescription:
      'Image, video, audio, AI, and metadata tools — convert, compress, transcribe, and remove metadata.',
    ogType: 'website',
    ogImage: DEFAULT_OG_IMAGE,
    twitterCard: 'summary_large_image',
    keywords: [
      'free media tools',
      'image converter',
      'video converter',
      'audio converter',
      'transcribe video',
      'remove EXIF metadata',
      'compress video',
      'isolate vocals',
    ],
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Media Manipulator Tools',
        url: buildCanonical('/tools'),
        description:
          'Single-purpose image, video, audio, AI, and metadata tools from Media Manipulator.',
      },
      breadcrumbList([
        { name: 'Home', path: '/' },
        { name: 'Tools', path: '/tools' },
      ]),
    ],
  },
  {
    path: '/tools/content-studio',
    title:
      'Content Studio — Free Online Multi-Track Video Editor | Media Manipulator',
    description:
      'Edit, layer, and mix video & audio on a multi-track timeline, then export MP4 — a Premiere Pro–style video editor that runs right in your browser. No signup, free to use.',
    canonicalUrl: buildCanonical('/tools/content-studio'),
    ogTitle: 'Content Studio — Free Online Multi-Track Video Editor',
    ogDescription:
      'A Premiere Pro–style multi-track video editor in your browser. Trim, layer, and mix video & audio, then export MP4.',
    ogType: 'website',
    ogImage: DEFAULT_OG_IMAGE,
    twitterCard: 'summary_large_image',
    keywords: [
      'online video editor',
      'multi-track video editor',
      'free video editor',
      'browser video editor',
      'timeline video editor',
      'edit video online',
      'mix audio and video',
      'export MP4',
    ],
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: `${SITE_NAME} — Content Studio`,
        url: buildCanonical('/tools/content-studio'),
        applicationCategory: 'MultimediaApplication',
        operatingSystem: 'Web',
        description:
          'A Premiere Pro–style multi-track video editor in your browser. Trim, layer, and mix video & audio on a timeline, then export MP4.',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        publisher: {
          '@type': 'Organization',
          name: ORG_NAME,
          url: SITE_ORIGIN,
        },
      },
      breadcrumbList([
        { name: 'Home', path: '/' },
        { name: 'Tools', path: '/tools' },
        { name: 'Content Studio', path: '/tools/content-studio' },
      ]),
    ],
  },
  {
    path: '/privacy-policy',
    title: 'Privacy Policy | Media Manipulator',
    description:
      'Learn how Media Manipulator handles uploaded files, temporary storage, local AI processing, analytics, advertising, content scans, and deletion.',
    canonicalUrl: buildCanonical('/privacy-policy'),
    ogTitle: 'Privacy Policy | Media Manipulator',
    ogDescription:
      'How Media Manipulator handles uploaded files, temporary storage, AI processing, analytics, and deletion.',
    ogType: 'website',
    ogImage: DEFAULT_OG_IMAGE,
    twitterCard: 'summary_large_image',
    keywords: [
      'Media Manipulator privacy policy',
      'file privacy',
      'temporary storage',
      'local AI processing',
    ],
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'Privacy Policy',
        url: buildCanonical('/privacy-policy'),
        description:
          'Privacy policy for Media Manipulator covering uploads, AI processing, analytics, and deletion.',
      },
    ],
  },
  {
    path: '/404',
    title: 'Page not found | Media Manipulator',
    description: 'The page you were looking for does not exist on Media Manipulator.',
    canonicalUrl: buildCanonical('/404'),
    ogTitle: 'Page not found | Media Manipulator',
    ogDescription: 'The page you were looking for does not exist on Media Manipulator.',
    ogType: 'website',
    ogImage: DEFAULT_OG_IMAGE,
    twitterCard: 'summary',
    keywords: [],
    jsonLd: [],
    noindex: true,
  },
  {
    path: '/terms-of-service',
    title: 'Terms of Service & Acceptable Use Policy | Media Manipulator',
    description:
      "Review Media Manipulator's terms for uploaded content, acceptable use, file processing, AI features, advertising, and user responsibilities.",
    canonicalUrl: buildCanonical('/terms-of-service'),
    ogTitle: 'Terms of Service & Acceptable Use | Media Manipulator',
    ogDescription:
      'Terms for uploaded content, acceptable use, file processing, AI features, advertising, and user responsibilities.',
    ogType: 'website',
    ogImage: DEFAULT_OG_IMAGE,
    twitterCard: 'summary_large_image',
    keywords: [
      'Media Manipulator terms',
      'acceptable use policy',
      'file upload terms',
      'media processing terms',
    ],
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'Terms of Service',
        url: buildCanonical('/terms-of-service'),
        description:
          'Terms of service and acceptable use policy for Media Manipulator.',
      },
    ],
  },
];

// Append data-driven tool landing pages so toolPages.ts stays the single
// source of truth for tool content + metadata.
const TOOL_ROUTES: RouteSeo[] = TOOL_PAGES.map(buildToolRouteSeo);
const ALL_ROUTES: RouteSeo[] = [...ROUTES, ...TOOL_ROUTES];

export const ROUTE_SEO_MAP: Record<string, RouteSeo> = ALL_ROUTES.reduce(
  (acc, route) => {
    acc[route.path] = route;
    return acc;
  },
  {} as Record<string, RouteSeo>,
);

export const PUBLIC_ROUTES: string[] = ALL_ROUTES.map((r) => r.path);

const NOT_FOUND_SEO: RouteSeo = ROUTE_SEO_MAP['/404'] || ROUTE_SEO_MAP['/'];

const stripTrailingSlash = (path: string): string => {
  if (path.length > 1 && path.endsWith('/')) return path.slice(0, -1);
  return path;
};

export const getSeoForPath = (pathname: string): RouteSeo => {
  const normalized = stripTrailingSlash(pathname) || '/';
  return ROUTE_SEO_MAP[normalized] || NOT_FOUND_SEO;
};

export const getAllRouteSeo = (): RouteSeo[] => ALL_ROUTES;

// ---------------------------------------------------------------------------
// Runtime head updater + hook.
//
// Kept in this file (rather than in a React component file) so the React
// fast-refresh boundary stays clean — components live in
// src/components/seo-head.tsx and import these helpers.
// ---------------------------------------------------------------------------

import { useEffect } from 'react';

const MANAGED_ATTR = 'data-managed-by';
const MANAGED_VALUE = 'media-manipulator-seo';

const setMetaByName = (name: string, content: string): void => {
  if (typeof document === 'undefined') return;
  let el = document.head.querySelector<HTMLMetaElement>(
    `meta[name="${name}"]`,
  );
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('name', name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
};

const setMetaByProperty = (property: string, content: string): void => {
  if (typeof document === 'undefined') return;
  let el = document.head.querySelector<HTMLMetaElement>(
    `meta[property="${property}"]`,
  );
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('property', property);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
};

const setCanonical = (href: string): void => {
  if (typeof document === 'undefined') return;
  let el = document.head.querySelector<HTMLLinkElement>(
    'link[rel="canonical"]',
  );
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
};

const removeManagedJsonLd = (): void => {
  if (typeof document === 'undefined') return;
  const nodes = document.head.querySelectorAll(
    `script[type="application/ld+json"][${MANAGED_ATTR}="${MANAGED_VALUE}"]`,
  );
  nodes.forEach((node) => node.parentElement?.removeChild(node));
};

const appendJsonLd = (data: JsonLd): void => {
  if (typeof document === 'undefined') return;
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.setAttribute(MANAGED_ATTR, MANAGED_VALUE);
  try {
    script.textContent = JSON.stringify(data);
  } catch {
    return;
  }
  document.head.appendChild(script);
};

/**
 * Apply route-specific SEO metadata to the document head. Safe to call on
 * every route change — handles cleanup of previous JSON-LD tags.
 */
export const applySeoMeta = (seo: RouteSeo): void => {
  if (typeof document === 'undefined') return;
  document.title = seo.title;
  setMetaByName('description', seo.description);
  setMetaByName('keywords', seo.keywords.join(', '));
  setMetaByName('robots', seo.noindex ? 'noindex,follow' : 'index,follow');
  setCanonical(seo.canonicalUrl);

  setMetaByProperty('og:title', seo.ogTitle);
  setMetaByProperty('og:description', seo.ogDescription);
  setMetaByProperty('og:type', seo.ogType);
  setMetaByProperty('og:url', seo.canonicalUrl);
  setMetaByProperty('og:image', seo.ogImage);
  setMetaByProperty('og:site_name', 'Media Manipulator');

  setMetaByName('twitter:card', seo.twitterCard);
  setMetaByName('twitter:title', seo.ogTitle);
  setMetaByName('twitter:description', seo.ogDescription);
  setMetaByName('twitter:image', seo.ogImage);

  removeManagedJsonLd();
  seo.jsonLd.forEach(appendJsonLd);
};

/**
 * Hook that applies the SEO metadata for the given pathname. Used by the
 * top-level RouteAnalytics component so the document head always matches
 * the current route after SPA navigation.
 */
export const useSeoMeta = (pathname: string): void => {
  useEffect(() => {
    applySeoMeta(getSeoForPath(pathname));
  }, [pathname]);
};
