import React from 'react';
import { Panel } from '@/components/darkroom/panel';
import { LICENSES } from '@/content/licenses';
import { getServerT } from '@/lib/i18n/server';

// MM47 (design §4): the open-source attribution page. Chrome is localized;
// the per-library descriptions and notices are English by decision (like the
// changelog entries), and the page says so. mediabunny (MPL-2.0) is used
// unmodified, with its Exhibit A notice and a link to its source.
const LicensesPage: React.FC<{ locale?: string }> = ({ locale }) => {
  const t = getServerT('interface', locale);
  return (
    <div className="px-4 sm:px-6">
      <Panel level="1" as="section" className="max-w-3xl mx-auto my-2">
        <h1 className="text-4xl font-bold mb-3 text-card-foreground">{t('licenses.title')}</h1>
        <p className="text-lg text-muted-foreground mb-2">{t('licenses.intro')}</p>
        <p className="text-sm text-muted-foreground mb-6">{t('licenses.note')}</p>
        <ul className="space-y-8">
          {LICENSES.map((l) => (
            <li key={l.name} id={l.name} className="border-t border-edge pt-6 scroll-mt-20" data-license={l.license}>
              <h2 lang="en" dir="ltr" className="text-xl font-semibold text-card-foreground mb-2 font-mono">
                {l.name}
              </h2>
              <dl className="grid grid-cols-[max-content_1fr] gap-x-4 gap-y-1 text-sm">
                <dt className="text-muted-foreground">{t('licenses.version')}</dt>
                <dd className="font-mono" dir="ltr">
                  {l.version}
                </dd>
                <dt className="text-muted-foreground">{t('licenses.license')}</dt>
                <dd>
                  <a href={l.licenseUrl} className="underline underline-offset-2" rel="noopener noreferrer">
                    {l.license}
                  </a>
                </dd>
                <dt className="text-muted-foreground">{t('licenses.copyright')}</dt>
                <dd lang="en" dir="ltr">
                  {l.copyright}
                </dd>
                <dt className="text-muted-foreground">{t('licenses.source')}</dt>
                <dd dir="ltr">
                  <a href={l.source} className="underline underline-offset-2 break-all" rel="noopener noreferrer">
                    {l.source}
                  </a>
                </dd>
                <dt className="text-muted-foreground">{t('licenses.usedFor')}</dt>
                <dd lang="en" dir="ltr">
                  {l.usedFor}
                </dd>
              </dl>
              {l.embeddedInExports && <p className="mt-2 text-sm text-muted-foreground">{t('licenses.embedded')}</p>}
              {l.license === 'MPL-2.0' && <p className="mt-2 text-sm text-muted-foreground">{t('licenses.unmodified')}</p>}
              {l.notice && (
                <blockquote lang="en" dir="ltr" className="mt-3 border-s-2 border-edge ps-3 text-sm text-muted-foreground">
                  {l.notice}
                </blockquote>
              )}
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
};

export default LicensesPage;
