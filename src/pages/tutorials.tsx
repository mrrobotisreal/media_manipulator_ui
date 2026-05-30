import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import AdBanner from '@/components/ad-banner';
import { Music, Image as ImageIcon, Video as VideoIcon } from 'lucide-react';
import { AD_SLOTS } from '@/lib/adSlots';
import { useLocalization } from '@/i18n/useLocalization';

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
  bannerSlot: string;
}

const CATEGORIES: CategoryDef[] = [
  {
    id: 'audio',
    titleKey: 'tutorials.categories.audio.title',
    descriptionKey: 'tutorials.categories.audio.description',
    icon: <Music className="w-7 h-7 text-blue-600" />,
    bannerSlot: AD_SLOTS.tutorials_index_audio_banner,
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
    icon: <VideoIcon className="w-7 h-7 text-green-600" />,
    bannerSlot: AD_SLOTS.tutorials_index_video_banner,
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
    icon: <ImageIcon className="w-7 h-7 text-purple-600" />,
    bannerSlot: AD_SLOTS.tutorials_index_image_banner,
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
  const { t } = useLocalization('interface');
  return (
    <>
      <div className="max-w-7xl mx-auto px-4 pt-4">
        <AdBanner
          adSlot={AD_SLOTS.tutorials_index_header}
          adFormat="leaderboard"
          adPosition="tutorials_index_header"
          utmMedium="tutorials_index_header_leaderboard"
        />
      </div>
      <Card className="max-w-7xl mx-auto my-2 sci-fi-frame">
        <CardContent className="p-12">
          <h1 className="text-4xl font-bold mb-4 text-card-foreground">{t('tutorials.title')}</h1>
          <p className="text-lg text-muted-foreground mb-8">{t('tutorials.intro')}</p>

          <div className="grid gap-10">
            {CATEGORIES.map((category) => (
              <React.Fragment key={category.id}>
                <section className="bg-card p-6 sci-fi-frame-inner">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="shrink-0 mt-1">{category.icon}</div>
                    <div>
                      <h2 className="text-2xl font-semibold text-card-foreground">{t(category.titleKey)}</h2>
                      <p className="text-muted-foreground mt-1">{t(category.descriptionKey)}</p>
                    </div>
                  </div>

                  <div className="grid gap-4 mt-4">
                    {category.tutorials.map((tutorial) => (
                      <article
                        key={tutorial.slug}
                        className="bg-card p-5 hover:shadow-lg transition-shadow sci-fi-frame-inner-inner"
                      >
                        <h3 className="text-xl font-semibold mb-2 text-card-foreground hover:text-green-600">
                          <Link to={`/tutorials/${tutorial.slug}`}>{t(tutorial.titleKey)}</Link>
                        </h3>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
                          <span>{t(tutorial.readTimeKey)}</span>
                        </div>
                        <p className="text-muted-foreground mb-4">{t(tutorial.excerptKey)}</p>
                        <Link
                          to={`/tutorials/${tutorial.slug}`}
                          className="text-green-600 hover:text-green-700 font-medium"
                        >
                          {t('tutorials.readTutorial')}
                        </Link>
                      </article>
                    ))}
                  </div>
                </section>

                <div className="flex justify-center">
                  <AdBanner
                    adSlot={category.bannerSlot}
                    adFormat="banner"
                    adPosition={`tutorials_index_${category.id}_banner`}
                    utmMedium={`tutorials_index_${category.id}_banner`}
                  />
                </div>
              </React.Fragment>
            ))}
          </div>

          <div className="mt-10 bg-card p-6 sci-fi-frame-green">
            <h2 className="text-2xl font-semibold mb-3 text-card-foreground">{t('tutorials.newToHere.title')}</h2>
            <p className="text-muted-foreground mb-4">{t('tutorials.newToHere.body')}</p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/how-it-works"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {t('tutorials.newToHere.ctaHow')}
              </Link>
              <Link
                to="/"
                className="bg-card border border-border text-card-foreground px-4 py-2 rounded-lg hover:bg-muted transition-colors"
              >
                {t('tutorials.newToHere.ctaConvert')}
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="max-w-7xl mx-auto px-4 pb-8">
        <AdBanner
          adSlot={AD_SLOTS.tutorials_index_footer}
          adFormat="leaderboard"
          adPosition="tutorials_index_footer"
          className="mt-8"
          utmMedium="tutorials_index_footer_leaderboard"
        />
      </div>
    </>
  );
};

export default TutorialsPage;
