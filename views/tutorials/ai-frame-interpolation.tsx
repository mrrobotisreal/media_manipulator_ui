import React from 'react';
import ContentReadTracker from '@/components/analytics/content-read-tracker';
import Link from 'next/link';
import EmbeddedToolPanel from '@/components/tools/embedded-tool-panel-client';
import RelatedLinks from '@/components/related-links';
import { Panel } from '@/components/darkroom/panel';
import { getServerT, ServerTrans } from '@/lib/i18n/server';
import { localizeHref } from '@/i18n/locales';

const K = 'tutorialAiFrameInterpolation';

/**
 * Long-form tutorial covering what AI frame interpolation is, how it differs
 * from basic FPS conversion, when to use it, and how to use the Media
 * Manipulator tool. Reuses the existing tutorial layout shell (header/sidebar
 * ads + content card + sidebar/footer ads) so it matches the existing
 * tutorial-page convention and AdSense pattern exactly.
 *
 * Ad slots reuse the tutorial_video_* IDs intentionally — this page lives in
 * the video tutorial section and we don't have dedicated AdSense slots for it
 * yet. The structure is in place to switch them out later.
 */
const AIFrameInterpolationTutorial: React.FC<{ locale?: string }> = ({ locale }) => {
  const t = getServerT('interface', locale);
  const loc = locale ?? 'en-US';

  const whatIsBullets = t(`${K}.whatIs.bullets`, { returnObjects: true }) as string[];
  const whyUseBullets = t(`${K}.whyUse.bullets`, { returnObjects: true }) as string[];
  const howItWorksParagraphs = t(`${K}.howItWorks.paragraphs`, { returnObjects: true }) as string[];
  const vsBasicFpsBullets = t(`${K}.vsBasicFps.bullets`, { returnObjects: true }) as string[];
  const fpsChoiceBullets = t(`${K}.fpsChoice.bullets`, { returnObjects: true }) as string[];
  const qualityTradeoffsBullets = t(`${K}.qualityTradeoffs.bullets`, { returnObjects: true }) as string[];
  const bestPracticesBullets = t(`${K}.bestPractices.bullets`, { returnObjects: true }) as string[];
  const limitationsBullets = t(`${K}.limitations.bullets`, { returnObjects: true }) as string[];
  const howToSteps = t(`${K}.howTo.steps`, { returnObjects: true }) as string[];
  const faqItems = t(`${K}.faq.items`, { returnObjects: true }) as { q: string; a: string }[];
  const relatedLinksData = t(`${K}.relatedLinks.links`, { returnObjects: true }) as { label: string; description: string }[];
  const RELATED_HREFS = [
    '/tools/ai-frame-interpolation',
    '/tools/video-converter',
    '/tools/compress-video',
    '/tools/extract-frames-from-video',
    '/tools/convert-video-to-animated-gif',
  ];

  return (
    <>
      {/* Reading measurement: content_read_progress at 25/50/75, content_read_completed
          at >=90% scroll AND >=15s active. Renders nothing. */}
      <ContentReadTracker slug="ai-frame-interpolation" contentType="tutorial" />
      <div className="max-w-[1600px] mx-auto my-2 flex flex-col lg:flex-row gap-6 px-4">
        <aside className="hidden lg:block w-[300px] shrink-0">

        </aside>
        <div className="flex-1 min-w-0">
          <Panel level="1"><div className="prose prose-invert max-w-none text-muted-foreground">
              <p className="text-sm uppercase tracking-wide text-data font-medium">
                {t(`${K}.eyebrow`)}
              </p>
              <h1 className="text-4xl font-bold mb-3 text-card-foreground">
                {t(`${K}.title`)}
              </h1>
              <p className="text-lg mb-8">
                {t(`${K}.intro`)}
              </p>

              <h2 className="text-2xl font-semibold mb-3 text-card-foreground">
                {t(`${K}.whatIs.title`)}
              </h2>
              <p className="mb-4">
                {t(`${K}.whatIs.intro`)}
              </p>
              <ul className="list-disc pl-6 space-y-1 mb-4">
                {whatIsBullets.map((item, idx) => (
                  <li key={idx}><ServerTrans i18nKey="_inline" defaults={item} components={{ strong: <strong /> }} /></li>
                ))}
              </ul>
              <p className="mb-4">
                {t(`${K}.whatIs.outro`)}
              </p>

              <EmbeddedToolPanel
                defaultMediaKind="video"
                defaultTask="ai_frame_interpolation"
                defaultOutputFormat="mp4"
                title={t(`${K}.toolPanel.title`)}
                description={t(`${K}.toolPanel.description`)}
              />

              <h2 className="text-2xl font-semibold mb-3 text-card-foreground">
                {t(`${K}.whyUse.title`)}
              </h2>
              <ul className="list-disc pl-6 space-y-1 mb-4">
                {whyUseBullets.map((item, idx) => <li key={idx}>{item}</li>)}
              </ul>

              <h2 className="text-2xl font-semibold mb-3 text-card-foreground">
                {t(`${K}.howItWorks.title`)}
              </h2>
              {howItWorksParagraphs.map((p, idx) => <p key={idx} className="mb-4">{p}</p>)}

              <h2 className="text-2xl font-semibold mb-3 text-card-foreground">
                {t(`${K}.vsBasicFps.title`)}
              </h2>
              <p className="mb-4">
                <ServerTrans locale={locale} i18nKey={`interface:${K}.vsBasicFps.p1`} components={{ code: <code /> }} />
              </p>
              <p className="mb-4">
                {t(`${K}.vsBasicFps.p2`)}
              </p>
              <ul className="list-disc pl-6 space-y-1 mb-4">
                {vsBasicFpsBullets.map((item, idx) => <li key={idx}>{item}</li>)}
              </ul>

              <h2 className="text-2xl font-semibold mb-3 text-card-foreground">
                {t(`${K}.fpsChoice.title`)}
              </h2>
              <ul className="list-disc pl-6 space-y-1 mb-4">
                {fpsChoiceBullets.map((item, idx) => (
                  <li key={idx}><ServerTrans i18nKey="_inline" defaults={item} components={{ strong: <strong /> }} /></li>
                ))}
              </ul>

              <h2 className="text-2xl font-semibold mb-3 text-card-foreground">
                {t(`${K}.qualityTradeoffs.title`)}
              </h2>
              <ul className="list-disc pl-6 space-y-1 mb-4">
                {qualityTradeoffsBullets.map((item, idx) => (
                  <li key={idx}><ServerTrans i18nKey="_inline" defaults={item} components={{ strong: <strong /> }} /></li>
                ))}
              </ul>
              <p className="mb-4">
                {t(`${K}.qualityTradeoffs.outro`)}
              </p>

              <h2 className="text-2xl font-semibold mb-3 text-card-foreground">
                {t(`${K}.bestPractices.title`)}
              </h2>
              <ul className="list-disc pl-6 space-y-1 mb-4">
                {bestPracticesBullets.map((item, idx) => <li key={idx}>{item}</li>)}
              </ul>

              <h2 className="text-2xl font-semibold mb-3 text-card-foreground">
                {t(`${K}.limitations.title`)}
              </h2>
              <ul className="list-disc pl-6 space-y-1 mb-4">
                {limitationsBullets.map((item, idx) => <li key={idx}>{item}</li>)}
              </ul>

              <h2 className="text-2xl font-semibold mb-3 text-card-foreground">
                {t(`${K}.howTo.title`)}
              </h2>
              <ol className="list-decimal pl-6 space-y-1 mb-4">
                {howToSteps.map((item, idx) => (
                  <li key={idx}>
                    <ServerTrans
                      i18nKey="_inline"
                      defaults={item}
                      components={{
                        linkTool: <Link href={localizeHref('/tools/ai-frame-interpolation', loc)} className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary" />,
                        strong: <strong />,
                        em: <em />,
                      }}
                    />
                  </li>
                ))}
              </ol>

              <h2 className="text-2xl font-semibold mb-3 text-card-foreground">
                {t(`${K}.faq.title`)}
              </h2>
              <ul className="list-disc pl-6 space-y-3 mb-4">
                {faqItems.map((item, idx) => (
                  <li key={idx}>
                    <strong>{item.q}</strong>
                    <br />
                    {item.a}
                  </li>
                ))}
              </ul>

              <div className="mt-10 flex flex-wrap gap-3">
                <Link href={localizeHref('/tools/ai-frame-interpolation', loc)} className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-[var(--accent-primary-hover)] transition-colors">
                  {t(`${K}.actions.tryTool`)}
                </Link>
                <Link href={localizeHref('/tutorials', loc)} className="bg-card border border-border text-card-foreground px-4 py-2 rounded-lg hover:bg-muted transition-colors">
                  {t(`${K}.actions.backToTutorials`)}
                </Link>
                <Link href={localizeHref('/tutorials/video/getting-started', loc)} className="bg-card border border-border text-card-foreground px-4 py-2 rounded-lg hover:bg-muted transition-colors">
                  {t(`${K}.actions.videoConverterTutorial`)}
                </Link>
              </div>

              {/* Hidden during AdSense review — re-enable the blog guide link when the blog returns. */}
              <RelatedLinks
                title={t(`${K}.relatedLinks.title`)}
                intro={t(`${K}.relatedLinks.intro`)}
                links={relatedLinksData.map((link, idx) => ({
                  label: link.label,
                  to: RELATED_HREFS[idx],
                  description: link.description,
                }))}
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

export default AIFrameInterpolationTutorial;
