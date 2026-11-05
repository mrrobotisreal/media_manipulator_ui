import React from 'react';
import Link from 'next/link';
import { Bot } from 'lucide-react';
import ContentReadTracker from '@/components/analytics/content-read-tracker';
import RelatedLinks from '@/components/related-links';
import { TutorialByline } from '@/components/articles/article-byline';
import { getServerT } from '@/lib/i18n/server';
import { localizeHref } from '@/i18n/locales';
import { Panel } from '@/components/darkroom/panel';
import { MEDI_BRAND } from '@/lib/assistant/brand';

const K = 'tutorials.tutorials.medi.page';

/** The three walkthrough sections, in order (MM111). */
export const MEDI_TUTORIAL_STEPS = ['find', 'job', 'edit'] as const;

const BULLETS: Record<(typeof MEDI_TUTORIAL_STEPS)[number], string[]> = {
  find: ['ask', 'attach', 'scope', 'plans'],
  job: ['card', 'start', 'open', 'click'],
  edit: ['undo', 'review', 'showMe', 'numbers'],
};

/** Short localized Medi tutorial (MM111): same shell as the Aperture one, no screenshot. */
const MediTutorial: React.FC<{ locale?: string }> = ({ locale }) => {
  const t = getServerT('interface', locale);
  const loc = locale ?? 'en-US';
  const brand = { values: { brand: MEDI_BRAND } };
  return (
    <>
      <ContentReadTracker slug="medi" contentType="tutorial" />
      <div className="max-w-[1600px] mx-auto my-2 flex flex-col lg:flex-row gap-6 px-4">
        <aside className="hidden lg:block w-[300px] shrink-0" />
        <div className="flex-1 min-w-0">
          <Panel level="1">
            <div className="prose prose-invert max-w-none text-muted-foreground" data-testid="medi-tutorial">
              <p className="text-sm uppercase tracking-wide text-data font-medium">{t(`${K}.eyebrow`)}</p>
              <h1 className="text-4xl font-bold mb-3 text-card-foreground">{t(`${K}.title`, brand)}</h1>
              <TutorialByline path="/tutorials/medi" locale={locale} />
              <p className="text-lg mb-6">{t(`${K}.intro`, brand)}</p>
              {MEDI_TUTORIAL_STEPS.map((step) => (
                <React.Fragment key={step}>
                  <h2 className="text-2xl font-semibold mb-3 text-card-foreground">{t(`${K}.${step}.title`)}</h2>
                  <p className="mb-4">{t(`${K}.${step}.body`, brand)}</p>
                  <ul className="list-disc ps-6 space-y-1 mb-4">
                    {BULLETS[step].map((k) => (
                      <li key={k}>{t(`${K}.${step}.bullets.${k}`, brand)}</li>
                    ))}
                  </ul>
                </React.Fragment>
              ))}
              <Panel level="1" accent="data" className="not-prose mt-8">
                <h2 className="text-2xl font-semibold mb-3 text-card-foreground">{t(`${K}.cta.title`, brand)}</h2>
                <p className="text-muted-foreground mb-4">{t(`${K}.cta.body`, brand)}</p>
                <Link
                  href={localizeHref('/tools/medi', loc)}
                  className="inline-flex items-center gap-2 bg-success text-success-foreground px-4 py-2 rounded-lg hover:bg-success/90 transition-colors"
                >
                  <Bot className="w-4 h-4" aria-hidden="true" />
                  {t(`${K}.cta.button`, brand)}
                </Link>
              </Panel>
              <div className="not-prose">
                <RelatedLinks
                  title={t(`${K}.related.title`)}
                  intro={t(`${K}.related.intro`, brand)}
                  links={[
                    { label: MEDI_BRAND, to: '/tools/medi', description: t(`${K}.related.toolDesc`, brand) },
                    { label: t(`${K}.related.aperture`), to: '/tutorials/aperture', description: t(`${K}.related.apertureDesc`) },
                    { label: t(`${K}.related.pricing`), to: '/pricing', description: t(`${K}.related.pricingDesc`) },
                  ]}
                />
              </div>
            </div>
          </Panel>
        </div>
        <aside className="hidden lg:block w-[300px] shrink-0" />
      </div>
    </>
  );
};

export default MediTutorial;
