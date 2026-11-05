import React from 'react';
import Link from 'next/link';
import { Aperture } from 'lucide-react';
import ContentReadTracker from '@/components/analytics/content-read-tracker';
import RelatedLinks from '@/components/related-links';
import { TutorialByline, TutorialScreenshot } from '@/components/articles/article-byline';
import { getServerT } from '@/lib/i18n/server';
import { localizeHref } from '@/i18n/locales';
import { Panel } from '@/components/darkroom/panel';
import { PHOTO_BRAND } from '@/lib/photo/brand';

const K = 'tutorials.tutorials.aperture.page';

/** The eight walkthrough sections, in order (ticket MM100 decision 6). */
export const APERTURE_TUTORIAL_STEPS = ['open', 'basic', 'colorPop', 'masks', 'heal', 'export', 'presets', 'batch'] as const;

const BULLETS: Record<(typeof APERTURE_TUTORIAL_STEPS)[number], string[]> = {
  open: ['formats', 'local', 'account', 'original'],
  basic: ['exposure', 'tone', 'whiteBalance', 'history'],
  colorPop: ['look', 'chips', 'ranges', 'tune'],
  masks: ['kinds', 'combine', 'colorRange', 'subject'],
  heal: ['paint', 'press', 'cost', 'base'],
  export: ['format', 'size', 'server', 'cost'],
  presets: ['builtin', 'append', 'mine', 'file'],
  batch: ['limit', 'run', 'zip', 'retry'],
};

/**
 * Long-form, localized Aperture tutorial (MM100). Same shell as the Motion and Darkroom
 * tutorials: server-rendered prose, a CTA to the tool page and related links. The screenshot is
 * served from `public/tutorials/` (never R2).
 */
const ApertureTutorial: React.FC<{ locale?: string }> = ({ locale }) => {
  const t = getServerT('interface', locale);
  const loc = locale ?? 'en-US';
  const brand = { values: { brand: PHOTO_BRAND } };

  return (
    <>
      <ContentReadTracker slug="aperture" contentType="tutorial" />
      <div className="max-w-[1600px] mx-auto my-2 flex flex-col lg:flex-row gap-6 px-4">
        <aside className="hidden lg:block w-[300px] shrink-0" />
        <div className="flex-1 min-w-0">
          <Panel level="1">
            <div className="prose prose-invert max-w-none text-muted-foreground" data-testid="aperture-tutorial">
              <p className="text-sm uppercase tracking-wide text-data font-medium">{t(`${K}.eyebrow`)}</p>
              <h1 className="text-4xl font-bold mb-3 text-card-foreground">{t(`${K}.title`, brand)}</h1>
              <TutorialByline path="/tutorials/aperture" locale={locale} />
              <p className="text-lg mb-6">{t(`${K}.intro`, brand)}</p>
              <TutorialScreenshot k="aperture" locale={locale} src="/tutorials/aperture-editor.webp" width={1600} height={911} />

              {APERTURE_TUTORIAL_STEPS.map((step) => (
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
                  href={localizeHref('/tools/aperture', loc)}
                  className="inline-flex items-center gap-2 bg-success text-success-foreground px-4 py-2 rounded-lg hover:bg-success/90 transition-colors"
                >
                  <Aperture className="w-4 h-4" aria-hidden="true" />
                  {t(`${K}.cta.button`, brand)}
                </Link>
              </Panel>

              <div className="not-prose">
                <RelatedLinks
                  title={t(`${K}.related.title`)}
                  intro={t(`${K}.related.intro`, brand)}
                  links={[
                    { label: PHOTO_BRAND, to: '/tools/aperture', description: t(`${K}.related.toolDesc`, brand) },
                    { label: t(`${K}.related.licenses`), to: '/licenses', description: t(`${K}.related.licensesDesc`) },
                    { label: t(`${K}.related.darkroom`), to: '/tutorials/content-studio', description: t(`${K}.related.darkroomDesc`) },
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

export default ApertureTutorial;
