import React from 'react';
import { Link } from 'react-router-dom';
import { Clapperboard } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import AdBanner from '@/components/ad-banner';
import RelatedLinks from '@/components/related-links';
import { AD_SLOTS } from '@/lib/adSlots';
import { useLocalization } from '@/i18n/useLocalization';

const SHOT_BASE = 'https://pub-13a4fdf185fa488299e681e08dd9f856.r2.dev';
const SCREENSHOTS = {
  overview: `${SHOT_BASE}/contentStudio01.webp`,
  effects: `${SHOT_BASE}/contentStudio02.webp`,
  color: `${SHOT_BASE}/contentStudio03.webp`,
  text: `${SHOT_BASE}/contentStudio04.webp`,
};

const K = 'tutorials.tutorials.contentStudio.page';

/**
 * Long-form, localized tutorial for Content Studio. Reuses the tutorial layout
 * shell (header/sidebar/footer ads + content card) so it matches the existing
 * tutorial-page + AdSense convention. Screenshots are served from R2.
 */
const ContentStudioTutorial: React.FC = () => {
  const { t } = useLocalization('interface');

  const Shot: React.FC<{ src: string; altKey: string; capKey: string }> = ({ src, altKey, capKey }) => (
    <figure className="my-6">
      <img
        src={src}
        alt={t(`${K}.${altKey}`)}
        loading="lazy"
        className="w-full rounded-lg border border-border"
        width={1024}
        height={539}
      />
      <figcaption className="text-sm text-center text-muted-foreground mt-2">{t(`${K}.${capKey}`)}</figcaption>
    </figure>
  );

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 pt-4">
        <AdBanner
          adSlot={AD_SLOTS.tutorial_video_header}
          adFormat="leaderboard"
          adPosition="tutorial_content_studio_header"
          utmMedium="tutorial_content_studio_header_leaderboard"
        />
      </div>
      <div className="max-w-[1600px] mx-auto my-2 flex flex-col lg:flex-row gap-6 px-4">
        <aside className="hidden lg:block w-[300px] shrink-0">
          <AdBanner
            adSlot={AD_SLOTS.tutorial_video_sidebar_left}
            adFormat="halfpage"
            adPosition="tutorial_content_studio_sidebar_left"
            sticky
            utmMedium="tutorial_content_studio_sidebar_left_halfpage"
          />
        </aside>
        <div className="flex-1 min-w-0">
          <Card className="sci-fi-frame">
            <CardContent className="p-8 md:p-12 prose prose-invert max-w-none text-muted-foreground">
              <p className="text-sm uppercase tracking-wide text-green-600 font-medium">{t(`${K}.eyebrow`)}</p>
              <h1 className="text-4xl font-bold mb-3 text-card-foreground">{t(`${K}.title`)}</h1>
              <p className="text-lg mb-6">{t(`${K}.intro`)}</p>

              <Shot src={SCREENSHOTS.overview} altKey="overviewAlt" capKey="overviewCaption" />

              <h2 className="text-2xl font-semibold mb-3 text-card-foreground">{t(`${K}.create.title`)}</h2>
              <p className="mb-4">{t(`${K}.create.body`)}</p>

              <h2 className="text-2xl font-semibold mb-3 text-card-foreground">{t(`${K}.media.title`)}</h2>
              <p className="mb-4">{t(`${K}.media.body`)}</p>

              <h2 className="text-2xl font-semibold mb-3 text-card-foreground">{t(`${K}.timeline.title`)}</h2>
              <p className="mb-4">{t(`${K}.timeline.body`)}</p>
              <ul className="list-disc pl-6 space-y-1 mb-4">
                <li>{t(`${K}.timeline.bullets.tracks`)}</li>
                <li>{t(`${K}.timeline.bullets.drag`)}</li>
                <li>{t(`${K}.timeline.bullets.trim`)}</li>
                <li>{t(`${K}.timeline.bullets.split`)}</li>
                <li>{t(`${K}.timeline.bullets.ripple`)}</li>
              </ul>

              <h2 className="text-2xl font-semibold mb-3 text-card-foreground">{t(`${K}.effects.title`)}</h2>
              <p className="mb-4">{t(`${K}.effects.body`)}</p>
              <Shot src={SCREENSHOTS.effects} altKey="effectsAlt" capKey="effectsCaption" />
              <h3 className="text-xl font-semibold mb-2 text-card-foreground">{t(`${K}.color.title`)}</h3>
              <p className="mb-4">{t(`${K}.color.body`)}</p>
              <Shot src={SCREENSHOTS.color} altKey="colorAlt" capKey="colorCaption" />
              <h3 className="text-xl font-semibold mb-2 text-card-foreground">{t(`${K}.text.title`)}</h3>
              <p className="mb-4">{t(`${K}.text.body`)}</p>
              <Shot src={SCREENSHOTS.text} altKey="textAlt" capKey="textCaption" />
              <h3 className="text-xl font-semibold mb-2 text-card-foreground">{t(`${K}.dissolve.title`)}</h3>
              <p className="mb-4">{t(`${K}.dissolve.body`)}</p>

              <h2 className="text-2xl font-semibold mb-3 text-card-foreground">{t(`${K}.preview.title`)}</h2>
              <p className="mb-4">{t(`${K}.preview.body`)}</p>

              <h2 className="text-2xl font-semibold mb-3 text-card-foreground">{t(`${K}.export.title`)}</h2>
              <p className="mb-4">{t(`${K}.export.body`)}</p>

              <h2 className="text-2xl font-semibold mb-3 text-card-foreground">{t(`${K}.shortcuts.title`)}</h2>
              <p className="mb-4">{t(`${K}.shortcuts.body`)}</p>

              <div className="not-prose mt-8 bg-card p-6 sci-fi-frame-green">
                <h2 className="text-2xl font-semibold mb-3 text-card-foreground">{t(`${K}.cta.title`)}</h2>
                <p className="text-muted-foreground mb-4">{t(`${K}.cta.body`)}</p>
                <Link
                  to="/tools/content-studio"
                  className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Clapperboard className="w-4 h-4" />
                  {t(`${K}.cta.button`)}
                </Link>
              </div>

              <div className="not-prose">
                <RelatedLinks
                  title={t(`${K}.related.title`)}
                  intro={t(`${K}.related.intro`)}
                  links={[
                    { label: t(`${K}.related.studio`), to: '/tools/content-studio', description: t(`${K}.related.studioDesc`) },
                    { label: t(`${K}.related.video`), to: '/tutorials/video/getting-started', description: t(`${K}.related.videoDesc`) },
                  ]}
                />
              </div>
            </CardContent>
          </Card>
        </div>
        <aside className="hidden lg:block w-[300px] shrink-0">
          <AdBanner
            adSlot={AD_SLOTS.tutorial_video_sidebar_right}
            adFormat="halfpage"
            adPosition="tutorial_content_studio_sidebar_right"
            sticky
            utmMedium="tutorial_content_studio_sidebar_right_halfpage"
          />
        </aside>
      </div>
      <div className="max-w-7xl mx-auto px-4 pb-8">
        <AdBanner
          adSlot={AD_SLOTS.tutorial_video_footer}
          adFormat="leaderboard"
          adPosition="tutorial_content_studio_footer"
          className="mt-8"
          utmMedium="tutorial_content_studio_footer_leaderboard"
        />
      </div>
    </>
  );
};

export default ContentStudioTutorial;
