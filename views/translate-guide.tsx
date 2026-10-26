import React from 'react';

import { Panel } from '@/components/darkroom/panel';
import { getLocaleDef } from '@/i18n/locales';
import { getServerMetadataT, getServerT } from '@/lib/i18n/server';

/**
 * MM56 translator onboarding guide (design §5). Rendered only by
 * `app/(localized)/[lang]/translate-guide/page.tsx` on translator deployments.
 *
 * English first (canonical), then the same text in the deployment's locale,
 * each in its own `lang`/`dir` section. Strings live in `interface/pages.json`
 * → `translateGuide` in every locale. The English section reads them without
 * key markers (`getServerMetadataT` never marks), so the workbench's "This page"
 * lists only the locale section's keys, which the translator can edit in place
 * like any other page.
 *
 * TODO(i18n): `translateGuide` is English in every non-English locale (MM56). The
 * marker lives here, not in the JSON: `legalCopy.test.ts` forbids `TODO(i18n)` in
 * a translated locale's `pages.json`, and byte-copy locales must stay identical to
 * en-US. Until a locale's translation session (or its translator, through the
 * workbench) translates it, the locale section shows `notTranslatedYet`.
 */
interface GuideSection {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
}

interface Guide {
  title: string;
  intro: string;
  englishHeading: string;
  localeHeading: string;
  notTranslatedYet: string;
  sections: GuideSection[];
}

type T = ReturnType<typeof getServerT>;

function readGuide(t: T): Guide {
  return t('translateGuide', { returnObjects: true }) as Guide;
}

const GuideBody: React.FC<{ guide: Guide; idPrefix: string }> = ({ guide, idPrefix }) => (
  <>
    {guide.sections.map((s, i) => (
      <section key={i} className="mb-6" aria-labelledby={`${idPrefix}-${i}`}>
        <h3 id={`${idPrefix}-${i}`} className="text-xl font-semibold mb-3 text-card-foreground">
          {s.title}
        </h3>
        {s.paragraphs?.map((p, j) => (
          <p key={j} className="mb-3">
            {p}
          </p>
        ))}
        {s.bullets ? (
          <ul className="list-disc ps-6 space-y-2 mb-3">
            {s.bullets.map((b, j) => (
              <li key={j}>{b}</li>
            ))}
          </ul>
        ) : null}
      </section>
    ))}
  </>
);

/** Compares two guides by their visible text (markers never reach the English copy). */
function sameText(a: Guide, b: Guide): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

const TranslateGuidePage: React.FC<{ locale: string | null }> = ({ locale }) => {
  const english = readGuide(getServerMetadataT('interface', 'en-US'));
  const def = locale ? getLocaleDef(locale) : undefined;
  const localized = def ? readGuide(getServerT('interface', def.code)) : null;
  const untranslated = def ? sameText(readGuide(getServerMetadataT('interface', def.code)), english) : false;

  return (
    <div className="px-4 sm:px-6">
      <Panel level="1" className="max-w-4xl mx-auto my-2" data-translate-guide="">
        <section lang="en" dir="ltr" data-guide-section="en-US">
          <h1 className="text-4xl font-bold mb-2 text-card-foreground">{english.title}</h1>
          <p className="text-sm uppercase tracking-wide text-muted-foreground mb-4">{english.englishHeading}</p>
          <p className="text-lg text-muted-foreground mb-8">{english.intro}</p>
          <GuideBody guide={english} idPrefix="guide-en" />
        </section>
        {def && localized ? (
          <section lang={def.code} dir={def.dir} data-guide-section={def.code} className="mt-10 border-t border-border pt-8">
            <h2 className="text-3xl font-bold mb-2 text-card-foreground">{localized.title}</h2>
            <p className="text-sm uppercase tracking-wide text-muted-foreground mb-4">
              {localized.localeHeading} · {def.label}
            </p>
            {untranslated ? (
              <p className="mb-6 rounded-md border border-border bg-muted/40 px-3 py-2 text-sm" data-guide-untranslated="">
                {localized.notTranslatedYet}
              </p>
            ) : null}
            <p className="text-lg text-muted-foreground mb-8">{localized.intro}</p>
            <GuideBody guide={localized} idPrefix={`guide-${def.prefix}`} />
          </section>
        ) : null}
      </Panel>
    </div>
  );
};

export default TranslateGuidePage;
