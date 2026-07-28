import React from 'react';
import Link from 'next/link';
import { Music, Image as ImageIcon, Video as VideoIcon } from 'lucide-react';
import { getServerT } from '@/lib/i18n/server';
import { Panel } from '@/components/darkroom/panel';

interface TutorialDef {
  titleKey: string;
  excerptKey: string;
  readTimeKey: string;
  slug: string;
}

interface CategoryDef {
  id: 'audio' | 'video' | 'image';
  titleKey: string;
  descriptionKey: string;
  icon: React.ReactNode;
  tutorials: TutorialDef[];
}

const CATEGORIES: CategoryDef[] = [
  {
    id: 'audio',
    titleKey: 'tutorials.categories.audio.title',
    descriptionKey: 'tutorials.categories.audio.description',
    icon: <Music className="w-7 h-7 text-primary" />,
    tutorials: [
      {
        titleKey: 'tutorials.tutorials.audioGettingStarted.title',
        excerptKey: 'tutorials.tutorials.audioGettingStarted.excerpt',
        readTimeKey: 'tutorials.tutorials.audioGettingStarted.readTime',
        slug: 'audio/getting-started',
      },
    ],
  },
  {
    id: 'video',
    titleKey: 'tutorials.categories.video.title',
    descriptionKey: 'tutorials.categories.video.description',
    icon: <VideoIcon className="w-7 h-7 text-data" />,
    tutorials: [
      {
        titleKey: 'tutorials.tutorials.contentStudio.title',
        excerptKey: 'tutorials.tutorials.contentStudio.excerpt',
        readTimeKey: 'tutorials.tutorials.contentStudio.readTime',
        slug: 'content-studio',
      },
      {
        titleKey: 'tutorials.tutorials.videoGettingStarted.title',
        excerptKey: 'tutorials.tutorials.videoGettingStarted.excerpt',
        readTimeKey: 'tutorials.tutorials.videoGettingStarted.readTime',
        slug: 'video/getting-started',
      },
      {
        titleKey: 'tutorials.tutorials.aiFrameInterpolation.title',
        excerptKey: 'tutorials.tutorials.aiFrameInterpolation.excerpt',
        readTimeKey: 'tutorials.tutorials.aiFrameInterpolation.readTime',
        slug: 'ai-frame-interpolation',
      },
    ],
  },
  {
    id: 'image',
    titleKey: 'tutorials.categories.image.title',
    descriptionKey: 'tutorials.categories.image.description',
    icon: <ImageIcon className="w-7 h-7 text-premium" />,
    tutorials: [
      {
        titleKey: 'tutorials.tutorials.imageGettingStarted.title',
        excerptKey: 'tutorials.tutorials.imageGettingStarted.excerpt',
        readTimeKey: 'tutorials.tutorials.imageGettingStarted.readTime',
        slug: 'image/getting-started',
      },
    ],
  },
];

const TutorialsPage: React.FC = () => {
  const t = getServerT();
  return (
    <>
      <div className="px-4 sm:px-6"><Panel level="1" className="max-w-7xl mx-auto my-2">
          <h1 className="text-4xl font-bold mb-4 text-card-foreground">{t('tutorials.title')}</h1>
          <p className="text-lg text-muted-foreground mb-8">{t('tutorials.intro')}</p>

          <div className="grid gap-10">
            {CATEGORIES.map((category) => (
              <React.Fragment key={category.id}>
                <Panel level="2" as="section">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="shrink-0 mt-1">{category.icon}</div>
                    <div>
                      <h2 className="text-2xl font-semibold text-card-foreground">{t(category.titleKey)}</h2>
                      <p className="text-muted-foreground mt-1">{t(category.descriptionKey)}</p>
                    </div>
                  </div>

                  <div className="grid gap-4 mt-4">
                    {category.tutorials.map((tutorial) => (
                      <Panel
                        level="2"
                        muted
                        as="article"
                        key={tutorial.slug}
                        className="lg:p-6 transition-shadow"
                      >
                        <h3 className="text-xl font-semibold mb-2 text-card-foreground hover:text-data">
                          <Link href={`/tutorials/${tutorial.slug}`}>{t(tutorial.titleKey)}</Link>
                        </h3>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
                          <span>{t(tutorial.readTimeKey)}</span>
                        </div>
                        <p className="text-muted-foreground mb-4">{t(tutorial.excerptKey)}</p>
                        <Link
                          href={`/tutorials/${tutorial.slug}`}
                          className="text-data hover:text-data font-medium"
                        >
                          {t('tutorials.readTutorial')}
                        </Link>
                      </Panel>
                    ))}
                  </div>
                </Panel>
              </React.Fragment>
            ))}
          </div>

          <Panel level="1" accent="data" className="mt-10">
            <h2 className="text-2xl font-semibold mb-3 text-card-foreground">{t('tutorials.newToHere.title')}</h2>
            <p className="text-muted-foreground mb-4">{t('tutorials.newToHere.body')}</p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/how-it-works"
                className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-[var(--accent-primary-hover)] transition-colors"
              >
                {t('tutorials.newToHere.ctaHow')}
              </Link>
              <Link
                href="/"
                className="bg-card border border-border text-card-foreground px-4 py-2 rounded-lg hover:bg-muted transition-colors"
              >
                {t('tutorials.newToHere.ctaConvert')}
              </Link>
            </div>
          </Panel>
        
      </Panel></div>
    </>
  );
};

export default TutorialsPage;
