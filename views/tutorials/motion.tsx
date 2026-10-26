import React from 'react';
import Link from 'next/link';
import { Spline } from 'lucide-react';
import ContentReadTracker from '@/components/analytics/content-read-tracker';
import RelatedLinks from '@/components/related-links';
import { getServerT } from '@/lib/i18n/server';
import { localizeHref } from '@/i18n/locales';
import { Panel } from '@/components/darkroom/panel';
import { MOTION_BRAND } from '@/lib/vector/brand';

const K = 'tutorials.tutorials.motion.page';

/** The five walkthrough sections, in order (ticket MM48 decision 3). */
export const MOTION_TUTORIAL_STEPS = ['import', 'animate', 'easing', 'export', 'formats'] as const;

/**
 * Long-form, localized Motion tutorial (MM48). Same shell as the Darkroom
 * tutorial: server-rendered prose, a CTA to the tool page and related links.
 * No screenshots (no Motion asset exists outside R2, and R2 is never used for
 * new Media Manipulator assets).
 */
const MotionTutorial: React.FC<{ locale?: string }> = ({ locale }) => {
  const t = getServerT('interface', locale);
  const loc = locale ?? 'en-US';
  const brand = { values: { brand: MOTION_BRAND } };
  const bullets = (step: string, keys: string[]) => (
    <ul className="list-disc ps-6 space-y-1 mb-4">
      {keys.map((k) => (
        <li key={k}>{t(`${K}.${step}.bullets.${k}`, brand)}</li>
      ))}
    </ul>
  );

  return (
    <>
      {/* content_read_progress / content_read_completed, existing catalog events. Renders nothing. */}
      <ContentReadTracker slug="motion" contentType="tutorial" />
      <div className="max-w-[1600px] mx-auto my-2 flex flex-col lg:flex-row gap-6 px-4">
        <aside className="hidden lg:block w-[300px] shrink-0" />
        <div className="flex-1 min-w-0">
          <Panel level="1">
            <div className="prose prose-invert max-w-none text-muted-foreground" data-testid="motion-tutorial">
              <p className="text-sm uppercase tracking-wide text-data font-medium">{t(`${K}.eyebrow`)}</p>
              <h1 className="text-4xl font-bold mb-3 text-card-foreground">{t(`${K}.title`, brand)}</h1>
              <p className="text-lg mb-6">{t(`${K}.intro`, brand)}</p>

              <h2 className="text-2xl font-semibold mb-3 text-card-foreground">{t(`${K}.import.title`)}</h2>
              <p className="mb-4">{t(`${K}.import.body`, brand)}</p>
              {bullets('import', ['svg', 'lottie', 'blank', 'safety'])}

              <h2 className="text-2xl font-semibold mb-3 text-card-foreground">{t(`${K}.animate.title`)}</h2>
              <p className="mb-4">{t(`${K}.animate.body`, brand)}</p>
              {bullets('animate', ['playhead', 'keyframe', 'autokey', 'animators'])}

              <h2 className="text-2xl font-semibold mb-3 text-card-foreground">{t(`${K}.easing.title`)}</h2>
              <p className="mb-4">{t(`${K}.easing.body`)}</p>
              {bullets('easing', ['presets', 'curve', 'hold', 'range'])}

              <h2 className="text-2xl font-semibold mb-3 text-card-foreground">{t(`${K}.export.title`)}</h2>
              <p className="mb-4">{t(`${K}.export.body`, brand)}</p>

              <h2 className="text-2xl font-semibold mb-3 text-card-foreground">{t(`${K}.formats.title`)}</h2>
              <p className="mb-4">{t(`${K}.formats.body`)}</p>
              {bullets('formats', ['svg', 'lottie', 'code', 'flutter', 'gif'])}

              <h2 className="text-2xl font-semibold mb-3 text-card-foreground">{t(`${K}.save.title`)}</h2>
              <p className="mb-4">{t(`${K}.save.body`, brand)}</p>

              <Panel level="1" accent="data" className="not-prose mt-8">
                <h2 className="text-2xl font-semibold mb-3 text-card-foreground">{t(`${K}.cta.title`, brand)}</h2>
                <p className="text-muted-foreground mb-4">{t(`${K}.cta.body`)}</p>
                <Link
                  href={localizeHref('/tools/motion', loc)}
                  className="inline-flex items-center gap-2 bg-success text-success-foreground px-4 py-2 rounded-lg hover:bg-success/90 transition-colors"
                >
                  <Spline className="w-4 h-4" aria-hidden="true" />
                  {t(`${K}.cta.button`, brand)}
                </Link>
              </Panel>

              <div className="not-prose">
                <RelatedLinks
                  title={t(`${K}.related.title`)}
                  intro={t(`${K}.related.intro`)}
                  links={[
                    { label: MOTION_BRAND, to: '/tools/motion', description: t(`${K}.related.motionDesc`) },
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

export default MotionTutorial;
