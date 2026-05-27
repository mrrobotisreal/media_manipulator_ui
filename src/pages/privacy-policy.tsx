import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useLocalization } from '@/i18n/useLocalization';

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

const ContactBlock: React.FC<{ email: string }> = ({ email }) => {
  const { t } = useLocalization('interface');
  return (
    <>
      <p className="mb-2">{t('legalCommon.operator')}</p>
      <p className="mb-1">{t('legalCommon.operatorEntity')}</p>
      <p className="mb-1">{t('legalCommon.operatingAs')}</p>
      <p className="mb-1">{t('legalCommon.location')}</p>
      <p className="mb-1">
        {t('legalCommon.emailLabel')}{' '}
        <a href={`mailto:${email}`} className="text-blue-600 hover:text-blue-800">{email}</a>
      </p>
      <p className="mb-1">
        {t('legalCommon.websiteLabel')}{' '}
        <a href="https://www.media-manipulator.com" className="text-blue-600 hover:text-blue-800">
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

const SectionView: React.FC<{ data: Section }> = ({ data }) => (
  <section className="mb-8">
    <h2 className="text-2xl font-semibold mb-4 text-card-foreground">{data.title}</h2>
    {data.paragraphs?.map((p, idx) => <p key={idx} className="mb-4">{p}</p>)}
    {data.bullets && renderBullets(data.bullets)}
    {data.afterBullets?.map((p, idx) => <p key={idx} className="mb-4">{p}</p>)}
    {data.secondBullets && renderBullets(data.secondBullets)}
    {data.afterSecondBullets?.map((p, idx) => <p key={idx} className="mb-4">{p}</p>)}
    {data.subsections?.map((sub, idx) => <SubsectionView key={idx} data={sub} />)}
    {data.contactBlock && data.contactEmail && <ContactBlock email={data.contactEmail} />}
  </section>
);

const PrivacyPolicyPage: React.FC = () => {
  const { t } = useLocalization('interface');
  const sections = t('privacyPolicy.sections', { returnObjects: true }) as Section[];

  return (
    <Card className="max-w-7xl mx-auto my-2 sci-fi-frame">
      <CardContent className="p-12">
        <h1 className="text-4xl font-bold mb-8 text-card-foreground">{t('privacyPolicy.title')}</h1>

        <div className="prose max-w-none text-muted-foreground">
          <p className="mb-2">{t('legalCommon.effectiveDate')}</p>
          <p className="mb-6">{t('legalCommon.lastUpdated')}</p>

          <p className="mb-4">{t('privacyPolicy.intro')}</p>

          <blockquote className="border-l-4 border-muted-foreground/30 pl-4 italic mb-4">
            {t('privacyPolicy.blockquote')}
          </blockquote>

          <p className="mb-4">{t('privacyPolicy.explanation')}</p>
          <p className="mb-6">{t('privacyPolicy.acceptance')}</p>

          {sections.map((section, idx) => <SectionView key={idx} data={section} />)}
        </div>
      </CardContent>
    </Card>
  );
};

export default PrivacyPolicyPage;
