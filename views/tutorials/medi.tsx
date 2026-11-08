import React from 'react';
import Link from 'next/link';
import { Bot } from 'lucide-react';
import ContentReadTracker from '@/components/analytics/content-read-tracker';
import RelatedLinks from '@/components/related-links';
import { TutorialByline } from '@/components/articles/article-byline';
import { PageFaq } from '@/components/page-faq';
import { MediPlans } from '@/components/assistant/landing/medi-landing';
import { getServerT } from '@/lib/i18n/server';
import { localizeHref } from '@/i18n/locales';
import { Panel } from '@/components/darkroom/panel';
import { MEDI_BRAND } from '@/lib/assistant/brand';
import type { TiersResponse } from '@/lib/auth/accountApi';

const K = 'tutorials.tutorials.medi.page';

/** The three starter workflows, in order (MM111). Each has numbered steps and a tip. */
export const MEDI_TUTORIAL_STEPS = ['find', 'job', 'edit'] as const;

const H2 = 'text-2xl font-semibold mb-3 text-card-foreground';

/**
 * The Medi tutorial: three starter workflows, the change list, Show me, review-before-applying, undo, limits (the
 * plan table is read from `/api/tiers` by the route, like /tools/medi) and privacy. Strings live under
 * `tutorials.tutorials.medi.page`; the brand is interpolated, never spelled in the JSON.
 */
const MediTutorial: React.FC<{ locale?: string; tiers?: TiersResponse | null }> = ({ locale, tiers = null }) => {
  const t = getServerT('interface', locale);
  const loc = locale ?? 'en-US';
  const brand = { values: { brand: MEDI_BRAND } };
  const list = (key: string) => t(`${K}.${key}`, { ...brand, returnObjects: true }) as string[];
  const faq = (t(`${K}.faq.items`, { ...brand, returnObjects: true }) as Array<{ q: string; a: string }>);
  const Steps: React.FC<{ k: string }> = ({ k }) => (
    <ol className="list-decimal ps-6 space-y-1 mb-4">
      {list(`${k}.steps`).map((s) => (
        <li key={s}>{s}</li>
      ))}
    </ol>
  );
  const Bullets: React.FC<{ k: string }> = ({ k }) => (
    <ul className="list-disc ps-6 space-y-1 mb-4">
      {list(k).map((s) => (
        <li key={s}>{s}</li>
      ))}
    </ul>
  );
  const Tip: React.FC<{ k: string }> = ({ k }) => <p className="mb-6 text-sm"><strong>{t(`${K}.tipLabel`)}</strong> {t(`${K}.${k}.tip`, brand)}</p>;
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

              <h2 className={H2}>{t(`${K}.before.title`)}</h2>
              <p className="mb-3">{t(`${K}.before.body`, brand)}</p>
              <Bullets k="before.items" />

              <h2 className={H2}>{t(`${K}.find.title`)}</h2>
              <p className="mb-3">{t(`${K}.find.body`, brand)}</p>
              <Steps k="find" />
              <Tip k="find" />

              <h2 className={H2}>{t(`${K}.job.title`, brand)}</h2>
              <p className="mb-3">{t(`${K}.job.body`, brand)}</p>
              <h3 className="text-xl font-semibold mb-2 text-card-foreground">{t(`${K}.job.card.title`)}</h3>
              <Bullets k="job.card.items" />
              <Steps k="job" />
              <Tip k="job" />

              <h2 className={H2}>{t(`${K}.edit.title`)}</h2>
              <p className="mb-3">{t(`${K}.edit.body`, brand)}</p>
              <Steps k="edit" />
              <Tip k="edit" />

              <h2 className={H2}>{t(`${K}.changes.title`)}</h2>
              <p className="mb-3">{t(`${K}.changes.body`, brand)}</p>
              <Bullets k="changes.items" />
              <p className="mb-6">{t(`${K}.changes.numbers`, brand)}</p>

              <h2 className={H2}>{t(`${K}.showMe.title`)}</h2>
              <p className="mb-6">{t(`${K}.showMe.body`, brand)}</p>

              <h2 className={H2}>{t(`${K}.review.title`)}</h2>
              <p className="mb-3">{t(`${K}.review.body`, brand)}</p>
              <Steps k="review" />

              <h2 className={H2}>{t(`${K}.plan.title`)}</h2>
              <p className="mb-6">{t(`${K}.plan.body`, brand)}</p>

              <h2 className={H2}>{t(`${K}.undo.title`)}</h2>
              <p className="mb-6">{t(`${K}.undo.body`, brand)}</p>

              <h2 className={H2}>{t(`${K}.limits.title`)}</h2>
              <p className="mb-3">{t(`${K}.limits.body`, brand)}</p>
              <div className="not-prose mb-6">
                <MediPlans data={tiers} locale={loc} />
              </div>

              <h2 className={H2}>{t(`${K}.privacy.title`, brand)}</h2>
              <p className="mb-3">{t(`${K}.privacy.intro`, brand)}</p>
              <Bullets k="privacy.items" />
              <p className="mb-6">
                <Link href={localizeHref('/privacy-policy', loc)} className="text-primary underline">
                  {t(`${K}.related.privacy`)}
                </Link>
              </p>

              <h2 className={H2}>{t(`${K}.whenNot.title`)}</h2>
              <p className="mb-6">{t(`${K}.whenNot.body`, brand)}</p>

              <PageFaq title={t(`${K}.faq.title`)} items={faq} id="medi-tutorial-faq" headingClassName={H2} />

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
                    { label: t(`${K}.related.privacy`), to: '/privacy-policy', description: t(`${K}.related.privacyDesc`, brand) },
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
