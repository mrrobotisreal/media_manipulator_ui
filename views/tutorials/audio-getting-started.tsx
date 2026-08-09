import React from 'react';
import ContentReadTracker from '@/components/analytics/content-read-tracker';
import Link from 'next/link';
import EmbeddedToolPanel from '@/components/tools/embedded-tool-panel-client';
import RelatedLinks from '@/components/related-links';
import { Panel } from '@/components/darkroom/panel';
import { getServerT, ServerTrans } from '@/lib/i18n/server';
import { localizeHref } from '@/i18n/locales';

const K = 'tutorialAudioGettingStarted';

/**
 * Renders a bulleted list whose source strings carry inline `<strong>` markup
 * (e.g. `"<strong>MP3</strong> — universal compatibility…"`). Mirrors the
 * `RichList` pattern in `views/how-it-works.tsx`.
 */
const RichBullets: React.FC<{ items: string[]; locale?: string; className?: string }> = ({
  items,
  locale,
  className = 'list-disc pl-6 space-y-1 mb-4',
}) => (
  <ul className={className}>
    {items.map((item, idx) => (
      <li key={idx}>
        <ServerTrans i18nKey="_inline" defaults={item} locale={locale} components={{ strong: <strong /> }} />
      </li>
    ))}
  </ul>
);

const AudioGettingStartedTutorial: React.FC<{ locale?: string }> = ({ locale }) => {
  const t = getServerT('interface', locale);
  const loc = locale ?? 'en-US';

  const formatItems = t(`${K}.format.items`, { returnObjects: true }) as string[];
  const aiToolItems = t(`${K}.aiTools.items`, { returnObjects: true }) as string[];
  const advancedEffectItems = t(`${K}.advancedEffects.items`, { returnObjects: true }) as string[];
  const tipItems = t(`${K}.tips.items`, { returnObjects: true }) as string[];
  const relatedLinks = t(`${K}.related.links`, { returnObjects: true }) as { label: string; description: string }[];

  return (
    <>
      {/* Reading measurement: content_read_progress at 25/50/75, content_read_completed
          at >=90% scroll AND >=15s active. Renders nothing. */}
      <ContentReadTracker slug="audio-getting-started" contentType="tutorial" />
      <div className="max-w-[1600px] mx-auto my-2 flex flex-col lg:flex-row gap-6 px-4">
      <aside className="hidden lg:block w-[300px] shrink-0">

      </aside>
      <div className="flex-1 min-w-0">
      <Panel level="1"><div className="prose prose-invert max-w-none text-muted-foreground">
          <p className="text-sm uppercase tracking-wide text-data font-medium">{t(`${K}.eyebrow`)}</p>
          <h1 className="text-4xl font-bold mb-3 text-card-foreground">{t(`${K}.title`)}</h1>
          <p className="text-lg mb-8">
            {t(`${K}.intro`)}
          </p>

          <h2 className="text-2xl font-semibold mb-3 text-card-foreground">{t(`${K}.upload.heading`)}</h2>
          <p className="mb-4">
            <ServerTrans locale={locale} i18nKey={`${K}.upload.p1`} components={{ strong: <strong /> }} />
          </p>
          <p className="mb-4">
            <ServerTrans locale={locale} i18nKey={`${K}.upload.p2`} components={{ strong: <strong />, em: <em /> }} />
          </p>

          <EmbeddedToolPanel
            defaultMediaKind="audio"
            title={t(`${K}.toolPanel.title`)}
            description={t(`${K}.toolPanel.description`)}
          />

          <h2 className="text-2xl font-semibold mb-3 text-card-foreground">{t(`${K}.format.heading`)}</h2>
          <p className="mb-4">
            <ServerTrans locale={locale} i18nKey={`${K}.format.intro`} components={{ strong: <strong /> }} />
          </p>
          <RichBullets items={formatItems} locale={locale} />
          {/* Blog hidden during AdSense review — restore the "need help
              choosing" paragraph below when the blog returns.
          <p className="mb-4">
            Need help choosing? Our <Link href="/blog/audio/audio-quality-guide" className="text-primary underline decoration-primary/40 underline-offset-2 hover:text-[var(--accent-primary-hover)] hover:decoration-primary">audio quality guide</Link> covers when to use each codec.
          </p>
          */}

          <h2 className="text-2xl font-semibold mb-3 text-card-foreground">{t(`${K}.quality.heading`)}</h2>
          <p className="mb-4">
            <ServerTrans locale={locale} i18nKey={`${K}.quality.bitrate`} components={{ strong: <strong /> }} />
          </p>
          <p className="mb-4">
            <ServerTrans locale={locale} i18nKey={`${K}.quality.sampleRate`} components={{ strong: <strong /> }} />
          </p>
          <p className="mb-4">
            <ServerTrans locale={locale} i18nKey={`${K}.quality.channels`} components={{ strong: <strong /> }} />
          </p>

          <h2 className="text-2xl font-semibold mb-3 text-card-foreground">{t(`${K}.speedVolume.heading`)}</h2>
          <p className="mb-4">
            <ServerTrans locale={locale} i18nKey={`${K}.speedVolume.p1`} components={{ strong: <strong /> }} />
          </p>
          <p className="mb-4">
            <ServerTrans locale={locale} i18nKey={`${K}.speedVolume.p2`} components={{ strong: <strong /> }} />
          </p>

          <h2 className="text-2xl font-semibold mb-3 text-card-foreground">{t(`${K}.aiTools.heading`)}</h2>
          <p className="mb-4">
            <ServerTrans locale={locale} i18nKey={`${K}.aiTools.intro`} components={{ strong: <strong /> }} />
          </p>
          <RichBullets items={aiToolItems} locale={locale} className="list-disc pl-6 space-y-2 mb-4" />
          <p className="mb-4">
            {t(`${K}.aiTools.outro`)}
          </p>

          <h2 className="text-2xl font-semibold mb-3 text-card-foreground">{t(`${K}.advancedEffects.heading`)}</h2>
          <p className="mb-4">
            <ServerTrans locale={locale} i18nKey={`${K}.advancedEffects.intro`} components={{ strong: <strong /> }} />
          </p>
          <RichBullets items={advancedEffectItems} locale={locale} />

          <h2 className="text-2xl font-semibold mb-3 text-card-foreground">{t(`${K}.convertDownload.heading`)}</h2>
          <p className="mb-4">
            <ServerTrans locale={locale} i18nKey={`${K}.convertDownload.body`} components={{ strong: <strong />, em: <em /> }} />
          </p>

          <h2 className="text-2xl font-semibold mb-3 text-card-foreground">{t(`${K}.tips.heading`)}</h2>
          <RichBullets items={tipItems} locale={locale} />

          <div className="mt-10 flex flex-wrap gap-3">
            <Link href={localizeHref('/', loc)} className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-[var(--accent-primary-hover)] transition-colors">
              {t(`${K}.cta.tryConverter`)}
            </Link>
            <Link href={localizeHref('/tutorials', loc)} className="bg-card border border-border text-card-foreground px-4 py-2 rounded-lg hover:bg-muted transition-colors">
              {t(`${K}.cta.backToTutorials`)}
            </Link>
            <Link href={localizeHref('/how-it-works', loc)} className="bg-card border border-border text-card-foreground px-4 py-2 rounded-lg hover:bg-muted transition-colors">
              {t(`${K}.cta.howItWorks`)}
            </Link>
          </div>

          <RelatedLinks
            title={t(`${K}.related.title`)}
            intro={t(`${K}.related.intro`)}
            links={[
              {
                label: relatedLinks[0].label,
                to: '/tools/audio-converter',
                description: relatedLinks[0].description,
              },
              {
                label: relatedLinks[1].label,
                to: '/tools/convert-wav-to-mp3',
                description: relatedLinks[1].description,
              },
              {
                label: relatedLinks[2].label,
                to: '/tools/isolate-vocals-from-song',
                description: relatedLinks[2].description,
              },
              // Hidden during AdSense review — re-enable when the blog returns.
              // {
              //   label: 'Audio quality guide',
              //   to: '/blog/audio/audio-quality-guide',
              //   description: 'How bitrate, sample rate, and codec choice affect quality.',
              // },
              {
                label: relatedLinks[3].label,
                to: '/tutorials/video/getting-started',
                description: relatedLinks[3].description,
              },
              {
                label: relatedLinks[4].label,
                to: '/how-it-works',
                description: relatedLinks[4].description,
              },
            ]}
          />
        </div>
      </Panel>
      </div>
      <aside className="hidden lg:block w-[300px] shrink-0">

      </aside>
      </div>
      </>
  );
};

export default AudioGettingStartedTutorial;
