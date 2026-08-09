import React from 'react';
import ContentReadTracker from '@/components/analytics/content-read-tracker';
import Link from 'next/link';
import EmbeddedToolPanel from '@/components/tools/embedded-tool-panel-client';
import RelatedLinks from '@/components/related-links';
import { Panel } from '@/components/darkroom/panel';
import { getServerT, ServerTrans } from '@/lib/i18n/server';
import { localizeHref } from '@/i18n/locales';

const K = 'tutorialImageGettingStarted';

/**
 * Render a localised list whose source values may contain inline <strong> /
 * <em> / <code> markup, matching the `RichList` pattern used by
 * `views/how-it-works.tsx`.
 */
const RichList: React.FC<{ items: string[] }> = ({ items }) => (
  <>
    {items.map((item, idx) => (
      <li key={idx}>
        <ServerTrans i18nKey="_inline" defaults={item} components={{ strong: <strong />, em: <em />, code: <code /> }} />
      </li>
    ))}
  </>
);

const PlainList: React.FC<{ items: string[] }> = ({ items }) => (
  <>
    {items.map((item, idx) => (
      <li key={idx}>{item}</li>
    ))}
  </>
);

const ImageGettingStartedTutorial: React.FC<{ locale?: string }> = ({ locale }) => {
  const t = getServerT('interface', locale);
  const loc = locale ?? 'en-US';

  const formatBullets = t(`${K}.format.bullets`, { returnObjects: true }) as string[];
  const textOverlayBullets = t(`${K}.textOverlay.bullets`, { returnObjects: true }) as string[];
  const metadataBullets = t(`${K}.metadata.bullets`, { returnObjects: true }) as string[];
  const metadataCustomBullets = t(`${K}.metadata.customBullets`, { returnObjects: true }) as string[];
  const removeObjectTips = t(`${K}.aiTools.removeObjectTips`, { returnObjects: true }) as string[];
  const tipsBullets = t(`${K}.tips.bullets`, { returnObjects: true }) as string[];
  const relatedLinksData = t(`${K}.relatedLinks.links`, { returnObjects: true }) as { label: string; description: string }[];

  return (
    <>
      {/* Reading measurement: content_read_progress at 25/50/75, content_read_completed
          at >=90% scroll AND >=15s active. Renders nothing. */}
      <ContentReadTracker slug="image-getting-started" contentType="tutorial" />
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

          <h2 className="text-2xl font-semibold mb-3 text-card-foreground">{t(`${K}.upload.title`)}</h2>
          <p className="mb-4">
            <ServerTrans locale={locale} i18nKey={`interface:${K}.upload.paragraph`} components={{ strong: <strong /> }} />
          </p>

          <EmbeddedToolPanel
            defaultMediaKind="image"
            title={t(`${K}.toolPanel.title`)}
            description={t(`${K}.toolPanel.description`)}
          />

          <h2 className="text-2xl font-semibold mb-3 text-card-foreground">{t(`${K}.format.title`)}</h2>
          <ul className="list-disc pl-6 space-y-1 mb-4">
            <RichList items={formatBullets} />
          </ul>
          <p className="mb-4">
            <ServerTrans locale={locale} i18nKey={`interface:${K}.format.quality`} components={{ strong: <strong /> }} />
            {/* Blog hidden during AdSense review — restore the inline link
                when the blog returns:
            Need help picking? See our <Link href="/blog/image/image-optimization-guide" className="text-primary underline decoration-primary/40 underline-offset-2 hover:text-[var(--accent-primary-hover)] hover:decoration-primary">image optimization guide</Link>.
            */}
          </p>

          <h2 className="text-2xl font-semibold mb-3 text-card-foreground">{t(`${K}.resize.title`)}</h2>
          <p className="mb-4">
            <ServerTrans locale={locale} i18nKey={`interface:${K}.resize.paragraph1`} components={{ strong: <strong /> }} />
          </p>
          <p className="mb-4">
            <ServerTrans locale={locale} i18nKey={`interface:${K}.resize.paragraph2`} components={{ strong: <strong /> }} />
          </p>

          <h2 className="text-2xl font-semibold mb-3 text-card-foreground">{t(`${K}.textOverlay.title`)}</h2>
          <p className="mb-4">
            <ServerTrans locale={locale} i18nKey={`interface:${K}.textOverlay.intro`} components={{ strong: <strong /> }} />
          </p>
          <ul className="list-disc pl-6 space-y-1 mb-4">
            <RichList items={textOverlayBullets} />
          </ul>

          <h2 className="text-2xl font-semibold mb-3 text-card-foreground">{t(`${K}.metadata.title`)}</h2>
          <p className="mb-4">
            {t(`${K}.metadata.intro`)}
          </p>
          <ul className="list-disc pl-6 space-y-1 mb-4">
            <RichList items={metadataBullets} />
            <li>
              <ServerTrans locale={locale} i18nKey={`interface:${K}.metadata.customLabel`} components={{ strong: <strong /> }} />
              <ul className="list-disc pl-6 mt-1 space-y-1">
                <PlainList items={metadataCustomBullets} />
              </ul>
            </li>
          </ul>

          <h2 className="text-2xl font-semibold mb-3 text-card-foreground">{t(`${K}.aiTools.title`)}</h2>
          <p className="mb-4">
            <ServerTrans locale={locale} i18nKey={`interface:${K}.aiTools.intro`} components={{ strong: <strong /> }} />
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>
              <ServerTrans locale={locale} i18nKey={`interface:${K}.aiTools.faceBlur`} components={{ strong: <strong /> }} />
            </li>
            <li>
              <ServerTrans locale={locale} i18nKey={`interface:${K}.aiTools.removeBackground`} components={{ strong: <strong /> }} />
            </li>
            <li>
              <ServerTrans locale={locale} i18nKey={`interface:${K}.aiTools.aiUpscale`} components={{ strong: <strong />, em: <em />, code: <code /> }} />
            </li>
            <li>
              <ServerTrans locale={locale} i18nKey={`interface:${K}.aiTools.redactText`} components={{ strong: <strong />, em: <em /> }} />
            </li>
            <li>
              <ServerTrans locale={locale} i18nKey={`interface:${K}.aiTools.removeObject`} components={{ strong: <strong />, code: <code /> }} />
              <ul className="list-disc pl-6 mt-1 space-y-1">
                <PlainList items={removeObjectTips} />
              </ul>
            </li>
          </ul>

          <h2 className="text-2xl font-semibold mb-3 text-card-foreground">{t(`${K}.convertDownload.title`)}</h2>
          <p className="mb-4">
            <ServerTrans locale={locale} i18nKey={`interface:${K}.convertDownload.paragraph`} components={{ strong: <strong />, em: <em /> }} />
          </p>

          <h2 className="text-2xl font-semibold mb-3 text-card-foreground">{t(`${K}.tips.title`)}</h2>
          <ul className="list-disc pl-6 space-y-1 mb-4">
            <RichList items={tipsBullets} />
          </ul>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link href={localizeHref('/', loc)} className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-[var(--accent-primary-hover)] transition-colors">
              {t(`${K}.actions.tryConverter`)}
            </Link>
            <Link href={localizeHref('/tutorials', loc)} className="bg-card border border-border text-card-foreground px-4 py-2 rounded-lg hover:bg-muted transition-colors">
              {t(`${K}.actions.backToTutorials`)}
            </Link>
            <Link href={localizeHref('/how-it-works', loc)} className="bg-card border border-border text-card-foreground px-4 py-2 rounded-lg hover:bg-muted transition-colors">
              {t(`${K}.actions.howItWorks`)}
            </Link>
          </div>

          <RelatedLinks
            title={t(`${K}.relatedLinks.title`)}
            intro={t(`${K}.relatedLinks.intro`)}
            links={[
              {
                label: relatedLinksData[0].label,
                to: '/tools/image-converter',
                description: relatedLinksData[0].description,
              },
              {
                label: relatedLinksData[1].label,
                to: '/tools/convert-webp-to-jpg',
                description: relatedLinksData[1].description,
              },
              {
                label: relatedLinksData[2].label,
                to: '/tools/remove-exif-metadata',
                description: relatedLinksData[2].description,
              },
              // Hidden during AdSense review — re-enable when the blog returns.
              // {
              //   label: 'Image optimization guide',
              //   to: '/blog/image/image-optimization-guide',
              //   description: 'JPG vs PNG vs WebP and how to shrink images for the web.',
              // },
              {
                label: relatedLinksData[3].label,
                to: '/tutorials/video/getting-started',
                description: relatedLinksData[3].description,
              },
              {
                label: relatedLinksData[4].label,
                to: '/how-it-works',
                description: relatedLinksData[4].description,
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

export default ImageGettingStartedTutorial;
