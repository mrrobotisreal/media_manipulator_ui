// Blog post metadata + JSON-LD, kept here because the blog SEO entries in
// lib/seo.ts are commented out (the blog was hidden during the prior review).
// Dates are the real publication/update dates from git (MM85): datePublished is
// the post's first commit; dateModified the last commit that changed its English
// text (the 2026-08-09 move into articles.json changed no wording and does not
// count). video-compression-guide: 2026-10-28, MM85's voice pass on "Why is this
// important". image-optimization-guide and audio-quality-guide: 2026-05-18, the
// same two commits (51e8568, 559152c) rewrote both posts' related links, so the
// two share a date honestly. Not fabricated freshness.

import type { Metadata } from 'next';
import {
  SITE_ORIGIN,
  SITE_NAME,
  ORG_NAME,
  DEFAULT_OG_IMAGE,
  articleAuthorLd,
  publisherLd,
  type JsonLd,
} from '@/lib/seo';
import { localeIndexing } from '@/lib/metadata';
import { getSeoOverride } from '@/lib/seoOverrides';
import { defaultLocale, localizeHref } from '@/i18n/locales';

export interface BlogPost {
  path: string;
  title: string;
  description: string;
  datePublished: string;
  dateModified: string;
  section: string;
  keywords: string[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    path: '/blog/video/video-compression-guide',
    title:
      'Video Compression Guide: Reduce File Size Without Ruining Quality | Media Manipulator',
    description:
      'Learn how video compression works, how codecs and bitrate affect quality, and how to reduce video file size for the web using practical Media Manipulator and FFmpeg concepts.',
    datePublished: '2025-06-13',
    dateModified: '2026-10-28',
    section: 'Video',
    keywords: [
      'video compression',
      'compress MP4',
      'reduce video file size',
      'video bitrate',
      'web video optimization',
      'FFmpeg compression',
    ],
  },
  {
    path: '/blog/image/image-optimization-guide',
    title:
      'Image Optimization Guide: Compress, Resize & Convert Images for the Web | Media Manipulator',
    description:
      'Learn how to optimize JPG, PNG, WebP, AVIF, and GIF files for faster websites, smaller uploads, better quality, and privacy-safe sharing.',
    datePublished: '2025-06-14',
    dateModified: '2026-05-18',
    section: 'Image',
    keywords: [
      'image optimization',
      'compress images',
      'convert WebP',
      'resize images',
      'remove EXIF metadata',
      'web image formats',
    ],
  },
  {
    path: '/blog/audio/audio-quality-guide',
    title:
      'Audio Quality Guide: Bitrate, Formats, Compression & Cleanup | Media Manipulator',
    description:
      'Learn how audio bitrate, sample rate, channels, codecs, compression, cleanup, and transcription affect file size and quality.',
    datePublished: '2025-06-14',
    dateModified: '2026-05-18',
    section: 'Audio',
    keywords: [
      'audio quality',
      'audio bitrate',
      'compress audio',
      'convert WAV to MP3',
      'audio cleanup',
      'transcribe audio',
    ],
  },
];

export function getBlogPost(path: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.path === path);
}

const url = (path: string) => new URL(path, SITE_ORIGIN).toString();

export function blogPostMetadata(post: BlogPost, locale: string = defaultLocale): Metadata {
  const canonicalUrl = url(localizeHref(post.path, locale));
  // MM86: public (translated + reviewed) locales only; others are noindex with no hreflang.
  const indexing = localeIndexing(post.path, locale);
  const override = getSeoOverride(post.path, locale);
  const title = override?.title ?? post.title;
  const description = override?.description ?? post.description;
  return {
    title,
    description,
    keywords: post.keywords,
    alternates: {
      canonical: canonicalUrl,
      languages: indexing.languages,
    },
    robots: indexing.robots,
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      type: 'article',
      images: [{ url: DEFAULT_OG_IMAGE }],
      publishedTime: post.datePublished,
      modifiedTime: post.dateModified,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [DEFAULT_OG_IMAGE],
    },
  };
}

export function blogPostJsonLd(post: BlogPost): JsonLd[] {
  const breadcrumbs = ['Home:/', 'Blog:/blog', `${post.section}:${post.path}`];
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: post.title,
      description: post.description,
      image: DEFAULT_OG_IMAGE,
      datePublished: post.datePublished,
      dateModified: post.dateModified,
      articleSection: post.section,
      keywords: post.keywords.join(', '),
      mainEntityOfPage: { '@type': 'WebPage', '@id': url(post.path) },
      // MM85: the byline names a person, so the structured data does too.
      author: articleAuthorLd,
      publisher: publisherLd,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((entry, index) => {
        const [name, path] = entry.split(':');
        return {
          '@type': 'ListItem',
          position: index + 1,
          name,
          item: url(path),
        };
      }),
    },
  ];
}

export function blogIndexMetadata(locale: string = defaultLocale): Metadata {
  const override = getSeoOverride('/blog', locale);
  const title =
    override?.title ??
    'Media Conversion, Compression & Editing Guides | Media Manipulator Blog';
  const description =
    override?.description ??
    'Learn how media formats, compression, metadata, transcription, and FFmpeg-powered file processing work with practical guides from Media Manipulator.';
  const canonicalUrl = url(localizeHref('/blog', locale));
  // MM86: public (translated + reviewed) locales only; others are noindex with no hreflang.
  const indexing = localeIndexing('/blog', locale);
  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: indexing.languages,
    },
    robots: indexing.robots,
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      type: 'website',
      images: [{ url: DEFAULT_OG_IMAGE }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [DEFAULT_OG_IMAGE],
    },
  };
}

export function blogIndexJsonLd(): JsonLd[] {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Blog',
      name: 'Media Manipulator Blog',
      url: url('/blog'),
      publisher: { '@type': 'Organization', name: ORG_NAME, url: SITE_ORIGIN },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: url('/') },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: url('/blog') },
      ],
    },
  ];
}
