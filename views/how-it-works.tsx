'use client';

import React from 'react';
import Link from 'next/link';
import { Trans } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { useLocalization } from '@/i18n/useLocalization';

/**
 * Render a localised list whose source values may contain inline <strong> /
 * <em> markup. `i18n` is the only safe way to express these — using `dangerouslySetInnerHTML`
 * would defeat the point of structured strings.
 */
const RichList: React.FC<{ items: string[] }> = ({ items }) => (
  <>
    {items.map((item, idx) => (
      <li key={idx}>
        <Trans i18nKey="_inline" defaults={item} components={{ strong: <strong />, em: <em /> }} />
      </li>
    ))}
  </>
);

const HowItWorksPage: React.FC = () => {
  const { t } = useLocalization('interface');

  const imageItems = t('howItWorks.capabilities.image.items', { returnObjects: true }) as string[];
  const videoItems = t('howItWorks.capabilities.video.items', { returnObjects: true }) as string[];
  const audioItems = t('howItWorks.capabilities.audio.items', { returnObjects: true }) as string[];
  const aiImageItems = t('howItWorks.ai.image.items', { returnObjects: true }) as string[];
  const aiAudioItems = t('howItWorks.ai.audio.items', { returnObjects: true }) as string[];
  const transcriptionItems = t('howItWorks.transcription.items', { returnObjects: true }) as string[];
  const securityItems = t('howItWorks.privacy.security.items', { returnObjects: true }) as string[];
  const qualityItems = t('howItWorks.privacy.quality.items', { returnObjects: true }) as string[];

  return (
    <>
      <Card className="max-w-7xl mx-auto my-2 sci-fi-frame">
        <CardContent className="p-12">
          <h1 className="text-4xl font-bold mb-4 text-card-foreground">
            {t('howItWorks.title')}
          </h1>
          <p className="text-lg text-muted-foreground mb-8">{t('howItWorks.intro')}</p>

          <div className="grid gap-8">
            <section className="bg-card p-6 sci-fi-frame-inner">
              <h2 className="text-2xl font-semibold mb-4 text-card-foreground">{t('howItWorks.process.title')}</h2>
              <div className="grid md:grid-cols-4 gap-6">
                {(['step1', 'step2', 'step3', 'step4'] as const).map((step, idx) => {
                  const ringColor = ['bg-blue-100', 'bg-green-100', 'bg-purple-100', 'bg-orange-100'][idx];
                  const textColor = ['text-blue-600', 'text-green-600', 'text-purple-600', 'text-orange-600'][idx];
                  return (
                    <div key={step} className="text-center">
                      <div className={`w-16 h-16 ${ringColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
                        <span className={`text-2xl font-bold ${textColor}`}>{idx + 1}</span>
                      </div>
                      <h3 className="font-semibold mb-2 text-card-foreground">{t(`howItWorks.process.${step}.title`)}</h3>
                      <p className="text-muted-foreground">{t(`howItWorks.process.${step}.body`)}</p>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="bg-card p-6 sci-fi-frame-inner">
              <h2 className="text-2xl font-semibold mb-4 text-card-foreground">{t('howItWorks.capabilities.title')}</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-semibold mb-2 text-card-foreground">{t('howItWorks.capabilities.image.title')}</h3>
                  <ul className="text-muted-foreground space-y-1">
                    {imageItems.map((item, idx) => <li key={idx}>• {item}</li>)}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-card-foreground">{t('howItWorks.capabilities.video.title')}</h3>
                  <ul className="text-muted-foreground space-y-1">
                    {videoItems.map((item, idx) => <li key={idx}>• {item}</li>)}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-card-foreground">{t('howItWorks.capabilities.audio.title')}</h3>
                  <ul className="text-muted-foreground space-y-1">
                    {audioItems.map((item, idx) => <li key={idx}>• {item}</li>)}
                  </ul>
                </div>
              </div>
            </section>

            <section className="bg-card p-6 sci-fi-frame-inner">
              <h2 className="text-2xl font-semibold mb-4 text-card-foreground">{t('howItWorks.ai.title')}</h2>
              <p className="text-muted-foreground mb-4">{t('howItWorks.ai.intro')}</p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2 text-card-foreground">{t('howItWorks.ai.image.title')}</h3>
                  <ul className="text-muted-foreground space-y-1">
                    {aiImageItems.map((item, idx) => (
                      <li key={idx}>• <Trans i18nKey="_inline" defaults={item} components={{ strong: <strong /> }} /></li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-card-foreground">{t('howItWorks.ai.audio.title')}</h3>
                  <ul className="text-muted-foreground space-y-1">
                    {aiAudioItems.map((item, idx) => (
                      <li key={idx}>• <Trans i18nKey="_inline" defaults={item} components={{ strong: <strong /> }} /></li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            <section className="bg-card p-6 sci-fi-frame-inner">
              <h2 className="text-2xl font-semibold mb-4 text-card-foreground">{t('howItWorks.transcription.title')}</h2>
              <p className="text-muted-foreground mb-4">
                <Trans i18nKey="interface:howItWorks.transcription.intro" components={{ em: <em /> }} />
              </p>
              <ul className="text-muted-foreground space-y-1">
                {transcriptionItems.map((item, idx) => (
                  <li key={idx}>• <Trans i18nKey="_inline" defaults={item} components={{ strong: <strong /> }} /></li>
                ))}
              </ul>
              <p className="text-muted-foreground mt-4">{t('howItWorks.transcription.outro')}</p>
            </section>

            <section className="bg-card p-6 sci-fi-frame-inner">
              <h2 className="text-2xl font-semibold mb-4 text-card-foreground">{t('howItWorks.privacy.title')}</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2 text-card-foreground">{t('howItWorks.privacy.security.title')}</h3>
                  <ul className="text-muted-foreground space-y-1">
                    <RichList items={securityItems} />
                    <li>• {t('howItWorks.privacy.security.linkPrefix')}{' '}
                      <Link href="/privacy-policy" className="text-blue-600 hover:text-blue-800">
                        {t('howItWorks.privacy.security.linkText')}
                      </Link>
                      {' '}{t('howItWorks.privacy.security.linkSuffix')}
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-card-foreground">{t('howItWorks.privacy.quality.title')}</h3>
                  <ul className="text-muted-foreground space-y-1">
                    {qualityItems.map((item, idx) => <li key={idx}>• {item}</li>)}
                  </ul>
                </div>
              </div>
            </section>

            <section className="bg-card p-6 sci-fi-frame-green">
              <h2 className="text-2xl font-semibold mb-4 text-card-foreground">{t('howItWorks.next.title')}</h2>
              <p className="text-muted-foreground mb-4">{t('howItWorks.next.body')}</p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/tutorials"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {t('howItWorks.next.ctaTutorials')}
                </Link>
                <Link
                  href="/"
                  className="bg-card border border-border text-card-foreground px-4 py-2 rounded-lg hover:bg-muted transition-colors"
                >
                  {t('howItWorks.next.ctaConvert')}
                </Link>
              </div>
            </section>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default HowItWorksPage;
