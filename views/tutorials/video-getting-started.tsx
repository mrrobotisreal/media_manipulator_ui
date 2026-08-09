import React from 'react';
import ContentReadTracker from '@/components/analytics/content-read-tracker';
import Link from 'next/link';
import EmbeddedToolPanel from '@/components/tools/embedded-tool-panel-client';
import RelatedLinks from '@/components/related-links';
import { Panel } from '@/components/darkroom/panel';
import { getServerT, ServerTrans } from '@/lib/i18n/server';
import { localizeHref } from '@/i18n/locales';

/**
 * Render a localised list item whose source value may contain inline
 * <strong> / <em> / <code> markup. `i18n` is the only safe way to express
 * these — using `dangerouslySetInnerHTML` would defeat the point of
 * structured strings.
 */
const RichBullet: React.FC<{ text: string }> = ({ text }) => (
  <li>
    <ServerTrans i18nKey="_inline" defaults={text} components={{ strong: <strong />, em: <em />, code: <code /> }} />
  </li>
);

const RichParagraph: React.FC<{ text: string; className?: string }> = ({ text, className }) => (
  <p className={className}>
    <ServerTrans i18nKey="_inline" defaults={text} components={{ strong: <strong />, em: <em />, code: <code /> }} />
  </p>
);

const VideoGettingStartedTutorial: React.FC<{ locale?: string }> = ({ locale }) => {
  const t = getServerT('interface', locale);
  const loc = locale ?? 'en-US';

  const formatBullets = t('tutorialVideoGettingStarted.format.bullets', { returnObjects: true }) as string[];
  const gifBullets = t('tutorialVideoGettingStarted.gif.bullets', { returnObjects: true }) as string[];
  const effectsBullets = t('tutorialVideoGettingStarted.effects.bullets', { returnObjects: true }) as string[];
  const transcribeBullets = t('tutorialVideoGettingStarted.transcribe.bullets', { returnObjects: true }) as string[];
  const tipsBullets = t('tutorialVideoGettingStarted.tips.bullets', { returnObjects: true }) as string[];
  const relatedLinksData = t('tutorialVideoGettingStarted.relatedLinks.links', { returnObjects: true }) as Array<{ label: string; description: string }>;

  return (
    <>
      {/* Reading measurement: content_read_progress at 25/50/75, content_read_completed
          at >=90% scroll AND >=15s active. Renders nothing. */}
      <ContentReadTracker slug="video-getting-started" contentType="tutorial" />
      <div className="max-w-[1600px] mx-auto my-2 flex flex-col lg:flex-row gap-6 px-4">
      <aside className="hidden lg:block w-[300px] shrink-0">
        
      </aside>
      <div className="flex-1 min-w-0">
      <Panel level="1"><div className="prose prose-invert max-w-none text-muted-foreground">
          <p className="text-sm uppercase tracking-wide text-data font-medium">{t('tutorialVideoGettingStarted.eyebrow')}</p>
          <h1 className="text-4xl font-bold mb-3 text-card-foreground">{t('tutorialVideoGettingStarted.title')}</h1>
          <p className="text-lg mb-8">
            {t('tutorialVideoGettingStarted.intro')}
          </p>

          <h2 className="text-2xl font-semibold mb-3 text-card-foreground">{t('tutorialVideoGettingStarted.upload.title')}</h2>
          <RichParagraph className="mb-4" text={t('tutorialVideoGettingStarted.upload.paragraph1')} />
          <RichParagraph className="mb-4" text={t('tutorialVideoGettingStarted.upload.paragraph2')} />

          <EmbeddedToolPanel
            defaultMediaKind="video"
            title={t('tutorialVideoGettingStarted.toolPanel.title')}
            description={t('tutorialVideoGettingStarted.toolPanel.description')}
          />

          <h2 className="text-2xl font-semibold mb-3 text-card-foreground">{t('tutorialVideoGettingStarted.format.title')}</h2>
          <RichParagraph className="mb-4" text={t('tutorialVideoGettingStarted.format.intro')} />
          <ul className="list-disc pl-6 space-y-1 mb-4">
            {formatBullets.map((item, idx) => <RichBullet key={idx} text={item} />)}
          </ul>
          <RichParagraph className="mb-4" text={t('tutorialVideoGettingStarted.format.quality')} />

          <h2 className="text-2xl font-semibold mb-3 text-card-foreground">{t('tutorialVideoGettingStarted.gif.title')}</h2>
          <RichParagraph className="mb-4" text={t('tutorialVideoGettingStarted.gif.paragraph1')} />
          <ul className="list-disc pl-6 space-y-1 mb-4">
            {gifBullets.map((item, idx) => <RichBullet key={idx} text={item} />)}
          </ul>
          <RichParagraph className="mb-4" text={t('tutorialVideoGettingStarted.gif.paragraph2')} />

          <h2 className="text-2xl font-semibold mb-3 text-card-foreground">{t('tutorialVideoGettingStarted.resize.title')}</h2>
          <RichParagraph className="mb-4" text={t('tutorialVideoGettingStarted.resize.paragraph1')} />
          <RichParagraph className="mb-4" text={t('tutorialVideoGettingStarted.resize.paragraph2')} />

          <h2 className="text-2xl font-semibold mb-3 text-card-foreground">{t('tutorialVideoGettingStarted.trim.title')}</h2>
          <RichParagraph className="mb-4" text={t('tutorialVideoGettingStarted.trim.paragraph')} />

          <h2 className="text-2xl font-semibold mb-3 text-card-foreground">{t('tutorialVideoGettingStarted.effects.title')}</h2>
          <RichParagraph className="mb-4" text={t('tutorialVideoGettingStarted.effects.intro')} />
          <ul className="list-disc pl-6 space-y-2 mb-4">
            {effectsBullets.map((item, idx) => <RichBullet key={idx} text={item} />)}
          </ul>

          <h2 className="text-2xl font-semibold mb-3 text-card-foreground">{t('tutorialVideoGettingStarted.convertDownload.title')}</h2>
          <RichParagraph className="mb-4" text={t('tutorialVideoGettingStarted.convertDownload.paragraph')} />

          <h2 className="text-2xl font-semibold mb-3 text-card-foreground">{t('tutorialVideoGettingStarted.transcribe.title')}</h2>
          <RichParagraph className="mb-4" text={t('tutorialVideoGettingStarted.transcribe.intro')} />
          <ul className="list-disc pl-6 space-y-1 mb-4">
            {transcribeBullets.map((item, idx) => <RichBullet key={idx} text={item} />)}
          </ul>
          <RichParagraph className="mb-4" text={t('tutorialVideoGettingStarted.transcribe.languageNote')} />

          <h2 className="text-2xl font-semibold mb-3 text-card-foreground">{t('tutorialVideoGettingStarted.tips.title')}</h2>
          <ul className="list-disc pl-6 space-y-1 mb-4">
            {tipsBullets.map((item, idx) => <RichBullet key={idx} text={item} />)}
          </ul>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link href={localizeHref('/', loc)} className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-[var(--accent-primary-hover)] transition-colors">
              {t('tutorialVideoGettingStarted.actions.tryConverter')}
            </Link>
            <Link href={localizeHref('/tutorials', loc)} className="bg-card border border-border text-card-foreground px-4 py-2 rounded-lg hover:bg-muted transition-colors">
              {t('tutorialVideoGettingStarted.actions.backToTutorials')}
            </Link>
            <Link href={localizeHref('/how-it-works', loc)} className="bg-card border border-border text-card-foreground px-4 py-2 rounded-lg hover:bg-muted transition-colors">
              {t('tutorialVideoGettingStarted.actions.howItWorks')}
            </Link>
          </div>

          <RelatedLinks
            title={t('tutorialVideoGettingStarted.relatedLinks.title')}
            intro={t('tutorialVideoGettingStarted.relatedLinks.intro')}
            links={[
              {
                label: relatedLinksData[0].label,
                to: '/tools/video-converter',
                description: relatedLinksData[0].description,
              },
              {
                label: relatedLinksData[1].label,
                to: '/tools/compress-video',
                description: relatedLinksData[1].description,
              },
              {
                label: relatedLinksData[2].label,
                to: '/tools/transcribe-video',
                description: relatedLinksData[2].description,
              },
              {
                label: relatedLinksData[3].label,
                to: '/tools/convert-video-to-animated-gif',
                description: relatedLinksData[3].description,
              },
              {
                label: relatedLinksData[4].label,
                to: '/tools/ai-frame-interpolation',
                description: relatedLinksData[4].description,
              },
              {
                label: relatedLinksData[5].label,
                to: '/tutorials/ai-frame-interpolation',
                description: relatedLinksData[5].description,
              },
              // Hidden during AdSense review — re-enable when the blog returns.
              // {
              //   label: 'Video compression guide',
              //   to: '/blog/video/video-compression-guide',
              //   description: 'MP4 vs WebM vs AVI and how codecs and bitrate affect quality.',
              // },
              {
                label: relatedLinksData[6].label,
                to: '/how-it-works',
                description: relatedLinksData[6].description,
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

export default VideoGettingStartedTutorial;
