import React from 'react';
import ContentReadTracker from '@/components/analytics/content-read-tracker';
import Link from 'next/link';
import { Clapperboard } from 'lucide-react';
import RelatedLinks from '@/components/related-links';
import { ResourceHints } from '@/components/seo/resource-hints';
import { getServerT } from '@/lib/i18n/server';
import { Panel } from '@/components/darkroom/panel';

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
  const t = getServerT();

  const Shot: React.FC<{ src: string; altKey: string; capKey: string }> = ({ src, altKey, capKey }) => (
    <figure className="my-6">
      <img
        src={src}
        alt={t(`${K}.${altKey}`)}
        loading="lazy"
        decoding="async"
        className="w-full rounded-lg border border-border"
        width={1024}
        height={539}
      />
      <figcaption className="text-sm text-center text-muted-foreground mt-2">{t(`${K}.${capKey}`)}</figcaption>
    </figure>
  );

  return (
    <>
      {/* Reading measurement: content_read_progress at 25/50/75, content_read_completed
          at >=90% scroll AND >=15s active. Renders nothing. */}
      <ContentReadTracker slug="content-studio" contentType="tutorial" />
      {/* This is the only route left that loads anything from R2 — the four
          tutorial screenshots. Scoped here rather than in the root layout so no
          other page pays for a connection it will never use. */}
      <ResourceHints dnsPrefetch={[SHOT_BASE]} />
      <div className="max-w-[1600px] mx-auto my-2 flex flex-col lg:flex-row gap-6 px-4">
        <aside className="hidden lg:block w-[300px] shrink-0">
          
        </aside>
        <div className="flex-1 min-w-0">
          <Panel level="1"><div className="prose prose-invert max-w-none text-muted-foreground">
              <p className="text-sm uppercase tracking-wide text-data font-medium">{t(`${K}.eyebrow`)}</p>
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

              <Panel level="1" accent="data" className="not-prose mt-8">
                <h2 className="text-2xl font-semibold mb-3 text-card-foreground">{t(`${K}.cta.title`)}</h2>
                <p className="text-muted-foreground mb-4">{t(`${K}.cta.body`)}</p>
                <Link
                  href="/tools/content-studio"
                  className="inline-flex items-center gap-2 bg-success text-success-foreground px-4 py-2 rounded-lg hover:bg-success/90 transition-colors"
                >
                  <Clapperboard className="w-4 h-4" />
                  {t(`${K}.cta.button`)}
                </Link>
              </Panel>

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
            </div>
          </Panel>
        </div>
        <aside className="hidden lg:block w-[300px] shrink-0">
          
        </aside>
      </div>
      </>
  );
};

export default ContentStudioTutorial;
