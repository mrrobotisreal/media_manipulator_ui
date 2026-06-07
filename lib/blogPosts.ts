// Blog post metadata + JSON-LD, kept here because the blog SEO entries in
// lib/seo.ts are commented out (the blog was hidden during the prior review).
// Dates are the real publication/update dates carried over from the Vite app —
// not fabricated freshness.

import type { Metadata } from 'next';
import {
  SITE_ORIGIN,
  SITE_NAME,
  ORG_NAME,
  DEFAULT_OG_IMAGE,
  DEFAULT_LOGO,
  type JsonLd,
} from '@/lib/seo';

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
    dateModified: '2026-05-15',
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
    dateModified: '2026-05-15',
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
    dateModified: '2026-05-15',
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

export function blogPostMetadata(post: BlogPost): Metadata {
  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    alternates: { canonical: url(post.path) },
    robots: { index: true, follow: true },
    openGraph: {
      title: post.title,
      description: post.description,
      url: url(post.path),
      siteName: SITE_NAME,
      type: 'article',
      images: [{ url: DEFAULT_OG_IMAGE }],
      publishedTime: post.datePublished,
      modifiedTime: post.dateModified,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
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
      author: { '@type': 'Organization', name: ORG_NAME, url: SITE_ORIGIN },
      publisher: {
        '@type': 'Organization',
        name: ORG_NAME,
        url: SITE_ORIGIN,
        logo: { '@type': 'ImageObject', url: DEFAULT_LOGO },
      },
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

export function blogIndexMetadata(): Metadata {
  const title =
    'Media Conversion, Compression & Editing Guides | Media Manipulator Blog';
  const description =
    'Learn how media formats, compression, metadata, transcription, and FFmpeg-powered file processing work with practical guides from Media Manipulator.';
  return {
    title,
    description,
    alternates: { canonical: url('/blog') },
    robots: { index: true, follow: true },
    openGraph: {
      title,
      description,
      url: url('/blog'),
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
