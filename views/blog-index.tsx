'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import RelatedLinks from '@/components/related-links';
import { useLocalization } from '@/i18n/useLocalization';

const RELATED_LINK_KEYS = ['allTools', 'compressVideo', 'removeExif', 'homepage', 'tutorials', 'howItWorks'] as const;
const RELATED_LINK_HREFS: Record<typeof RELATED_LINK_KEYS[number], string> = {
  allTools: '/tools',
  compressVideo: '/tools/compress-video',
  removeExif: '/tools/remove-exif-metadata',
  homepage: '/',
  tutorials: '/tutorials',
  howItWorks: '/how-it-works',
};

const BlogPage: React.FC = () => {
  const { t } = useLocalization('interface');

  const articles = [
    {
      titleKey: 'blog.articles.videoCompression.title',
      excerptKey: 'blog.articles.videoCompression.excerpt',
      readTimeKey: 'blog.articles.videoCompression.readTime',
      date: '2025-06-13',
      slug: 'video/video-compression-guide',
    },
    {
      titleKey: 'blog.articles.imageOptimization.title',
      excerptKey: 'blog.articles.imageOptimization.excerpt',
      readTimeKey: 'blog.articles.imageOptimization.readTime',
      date: '2025-06-14',
      slug: 'image/image-optimization-guide',
    },
    {
      titleNode: (
        <>
          {t('blog.articles.audioQualityPrefix')}{' '}
          <span className="line-through text-gray-400">{t('blog.articles.audioQualityStrike')}</span>{' '}
          {t('blog.articles.audioQualitySuffix')}
        </>
      ),
      excerptKey: 'blog.articles.audioQuality.excerpt',
      readTimeKey: 'blog.articles.audioQuality.readTime',
      date: '2025-06-14',
      slug: 'audio/audio-quality-guide',
    },
  ];

  return (
    <>
      <div className="max-w-[1600px] mx-auto my-2 flex flex-col lg:flex-row gap-6 px-4">
        <aside className="hidden lg:block w-[300px] shrink-0">
          
        </aside>
        <div className="flex-1 min-w-0">
          <Card className="sci-fi-frame">
            <CardContent className="p-12">
              <h1 className="text-4xl font-bold mb-8 text-card-foreground">{t('blog.title')}</h1>
              <p className="text-lg text-muted-foreground mb-8">{t('blog.intro')}</p>

              <div className="grid gap-8">
                {articles.map((article, index) => (
                  <article key={index} className="bg-card p-6 hover:shadow-lg transition-shadow sci-fi-frame-inner">
                    <h2 className="text-2xl font-semibold mb-2 text-card-foreground hover:text-green-600">
                      <Link href={`/blog/${article.slug}`}>
                        {article.titleNode ?? t(article.titleKey!)}
                      </Link>
                    </h2>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <span>{article.date}</span>
                      <span>•</span>
                      <span>{t(article.readTimeKey)}</span>
                    </div>
                    <p className="text-muted-foreground mb-4">{t(article.excerptKey)}</p>
                    <Link
                      href={`/blog/${article.slug}`}
                      className="text-green-600 hover:text-green-700 font-medium"
                    >
                      {t('blog.readMore')}
                    </Link>
                  </article>
                ))}
              </div>

              <RelatedLinks
                title={t('blog.relatedLinks.title')}
                intro={t('blog.relatedLinks.intro')}
                links={RELATED_LINK_KEYS.map((key) => ({
                  label: t(`blog.relatedLinks.${key}.label`),
                  to: RELATED_LINK_HREFS[key],
                  description: t(`blog.relatedLinks.${key}.description`),
                }))}
              />
            </CardContent>
          </Card>
        </div>
        <aside className="hidden lg:block w-[300px] shrink-0">
          
        </aside>
      </div>
      </>
  );
};

export default BlogPage;
