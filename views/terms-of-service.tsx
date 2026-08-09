import React from 'react';
import { getServerT } from '@/lib/i18n/server';
import { Panel } from '@/components/darkroom/panel';

interface Subsection {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
  afterBullets?: string[];
}

interface Section {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
  afterBullets?: string[];
  secondBullets?: string[];
  afterSecondBullets?: string[];
  subsections?: Subsection[];
  contactBlock?: boolean;
  contactEmail?: string;
}

const ContactBlock: React.FC<{ email: string; locale?: string }> = ({ email, locale }) => {
  const t = getServerT('interface', locale);
  return (
    <>
      <p className="mb-2">{t('legalCommon.operator')}</p>
      <p className="mb-1">{t('legalCommon.operatorEntity')}</p>
      <p className="mb-1">{t('legalCommon.operatingAs')}</p>
      <p className="mb-1">{t('legalCommon.location')}</p>
      <p className="mb-1">
        {t('legalCommon.emailLabel')}{' '}
        <a href={`mailto:${email}`} className="text-primary underline decoration-primary/40 underline-offset-2 hover:text-[var(--accent-primary-hover)] hover:decoration-primary">{email}</a>
      </p>
      <p className="mb-1">
        {t('legalCommon.websiteLabel')}{' '}
        <a href="https://www.media-manipulator.com" className="text-primary underline decoration-primary/40 underline-offset-2 hover:text-[var(--accent-primary-hover)] hover:decoration-primary">
          https://www.media-manipulator.com
        </a>
      </p>
    </>
  );
};

const renderBullets = (bullets: string[]) => (
  <ul className="list-disc pl-6 space-y-2 mb-4">
    {bullets.map((b, idx) => <li key={idx}>{b}</li>)}
  </ul>
);

const SubsectionView: React.FC<{ data: Subsection }> = ({ data }) => (
  <>
    <h3 className="text-xl font-semibold mb-3 text-card-foreground">{data.title}</h3>
    {data.paragraphs?.map((p, idx) => <p key={idx} className="mb-4">{p}</p>)}
    {data.bullets && renderBullets(data.bullets)}
    {data.afterBullets?.map((p, idx) => <p key={idx} className="mb-4">{p}</p>)}
  </>
);

const SectionView: React.FC<{ data: Section; locale?: string }> = ({ data, locale }) => (
  <section className="mb-8">
    <h2 className="text-2xl font-semibold mb-4 text-card-foreground">{data.title}</h2>
    {data.paragraphs?.map((p, idx) => <p key={idx} className="mb-4">{p}</p>)}
    {data.bullets && renderBullets(data.bullets)}
    {data.afterBullets?.map((p, idx) => <p key={idx} className="mb-4">{p}</p>)}
    {data.secondBullets && renderBullets(data.secondBullets)}
    {data.afterSecondBullets?.map((p, idx) => <p key={idx} className="mb-4">{p}</p>)}
    {data.subsections?.map((sub, idx) => <SubsectionView key={idx} data={sub} />)}
    {data.contactBlock && data.contactEmail && <ContactBlock email={data.contactEmail} locale={locale} />}
  </section>
);

const TermsOfServicePage: React.FC<{ locale?: string }> = ({ locale }) => {
  const t = getServerT('interface', locale);
  const sections = t('termsOfService.sections', { returnObjects: true }) as Section[];

  return (
    <div className="px-4 sm:px-6"><Panel level="1" className="max-w-7xl mx-auto my-2">
        <h1 className="text-4xl font-bold mb-8 text-card-foreground">{t('termsOfService.title')}</h1>

        <div className="prose max-w-none text-muted-foreground">
          <p className="mb-2">{t('legalCommon.effectiveDate')}</p>
          <p className="mb-6">{t('legalCommon.lastUpdated')}</p>

          <p className="mb-4">{t('termsOfService.intro')}</p>
          <p className="mb-4">{t('termsOfService.scope')}</p>
          <p className="mb-6">{t('termsOfService.agreement')}</p>

          {sections.map((section, idx) => <SectionView key={idx} data={section} locale={locale} />)}
        </div>
      
    </Panel></div>
  );
};

export default TermsOfServicePage;
