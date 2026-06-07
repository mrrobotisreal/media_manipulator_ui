'use client';

import React from 'react';
import Link from 'next/link';
import { Trans } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import RelatedLinks from '@/components/related-links';
import { useLocalization } from '@/i18n/useLocalization';

const RELATED_LINK_KEYS = ['converter', 'tutorials', 'howItWorks'] as const;
const RELATED_LINK_HREFS: Record<typeof RELATED_LINK_KEYS[number], string> = {
  converter: '/',
  tutorials: '/tutorials',
  howItWorks: '/how-it-works',
};

const AboutPage: React.FC = () => {
  const { t } = useLocalization('interface');

  const imageItems = t('about.whatItDoes.image.items', { returnObjects: true }) as string[];
  const videoItems = t('about.whatItDoes.video.items', { returnObjects: true }) as string[];
  const audioItems = t('about.whatItDoes.audio.items', { returnObjects: true }) as string[];
  const commonImage = t('about.commonTasks.image.items', { returnObjects: true }) as string[];
  const commonVideoAudio = t('about.commonTasks.videoAudio.items', { returnObjects: true }) as string[];
  const imagesFormats = t('about.supportedFormats.images.items', { returnObjects: true }) as string[];
  const videoFormats = t('about.supportedFormats.videos.items', { returnObjects: true }) as string[];
  const audioFormats = t('about.supportedFormats.audio.items', { returnObjects: true }) as string[];

  return (
    <>
      <Card className="max-w-7xl mx-auto my-2 sci-fi-frame">
        <CardContent className="p-12">
          <h1 className="text-4xl font-bold mb-4 text-card-foreground">{t('about.title')}</h1>
          <p className="text-lg text-muted-foreground mb-8">
            <Trans i18nKey="interface:about.intro" components={{ strong: <strong /> }} />
          </p>

          <div className="prose max-w-none text-muted-foreground">
            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 text-card-foreground">{t('about.mission.title')}</h2>
              <p className="mb-4">{t('about.mission.p1')}</p>
              <p className="mb-4">{t('about.mission.p2')}</p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 text-card-foreground">{t('about.whatItDoes.title')}</h2>
              <p className="mb-4">{t('about.whatItDoes.intro')}</p>

              <div className="grid md:grid-cols-3 gap-6 mt-6">
                <div className="bg-card p-6 sci-fi-frame-inner">
                  <h3 className="font-semibold mb-3 text-blue-600">{t('about.whatItDoes.image.title')}</h3>
                  <ul className="space-y-1 text-sm">
                    {imageItems.map((item, idx) => (
                      <li key={idx}>
                        <Trans i18nKey="_inline" defaults={item} components={{ strong: <strong /> }} />
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-card p-6 sci-fi-frame-inner">
                  <h3 className="font-semibold mb-3 text-green-600">{t('about.whatItDoes.video.title')}</h3>
                  <ul className="space-y-1 text-sm">
                    {videoItems.map((item, idx) => (
                      <li key={idx}>
                        <Trans i18nKey="_inline" defaults={item} components={{ strong: <strong /> }} />
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-card p-6 sci-fi-frame-inner">
                  <h3 className="font-semibold mb-3 text-purple-600">{t('about.whatItDoes.audio.title')}</h3>
                  <ul className="space-y-1 text-sm">
                    {audioItems.map((item, idx) => (
                      <li key={idx}>
                        <Trans i18nKey="_inline" defaults={item} components={{ strong: <strong /> }} />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <p className="mt-6">
                <Trans
                  i18nKey="interface:about.whatItDoes.outro"
                  components={{
                    linkTutorials: <Link href="/tutorials" className="text-blue-600 hover:text-blue-800" />,
                    linkHow: <Link href="/how-it-works" className="text-blue-600 hover:text-blue-800" />,
                  }}
                />
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 text-card-foreground">{t('about.whyChoose.title')}</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-card p-6 sci-fi-frame-inner">
                  <h3 className="font-semibold mb-2 text-card-foreground">{t('about.whyChoose.noSignup.title')}</h3>
                  <p>{t('about.whyChoose.noSignup.body')}</p>
                </div>
                <div className="bg-card p-6 sci-fi-frame-inner">
                  <h3 className="font-semibold mb-2 text-card-foreground">{t('about.whyChoose.privacy.title')}</h3>
                  <p>
                    <Trans
                      i18nKey="interface:about.whyChoose.privacy.body"
                      components={{
                        strong: <strong />,
                        linkPrivacy: <Link href="/privacy-policy" className="text-blue-600 hover:text-blue-800" />,
                      }}
                    />
                  </p>
                </div>
                <div className="bg-card p-6 sci-fi-frame-inner">
                  <h3 className="font-semibold mb-2 text-card-foreground">{t('about.whyChoose.localAi.title')}</h3>
                  <p>
                    <Trans i18nKey="interface:about.whyChoose.localAi.body" components={{ strong: <strong /> }} />
                  </p>
                </div>
                <div className="bg-card p-6 sci-fi-frame-inner">
                  <h3 className="font-semibold mb-2 text-card-foreground">{t('about.whyChoose.realTools.title')}</h3>
                  <p>{t('about.whyChoose.realTools.body')}</p>
                </div>
                <div className="bg-card p-6 sci-fi-frame-inner">
                  <h3 className="font-semibold mb-2 text-card-foreground">{t('about.whyChoose.web.title')}</h3>
                  <p>{t('about.whyChoose.web.body')}</p>
                </div>
                <div className="bg-card p-6 sci-fi-frame-inner">
                  <h3 className="font-semibold mb-2 text-card-foreground">{t('about.whyChoose.open.title')}</h3>
                  <p>
                    <Trans
                      i18nKey="interface:about.whyChoose.open.body"
                      components={{
                        emailLink: (
                          <a
                            href="mailto:support@media-manipulator.com"
                            className="text-blue-600 hover:text-blue-800"
                          />
                        ),
                      }}
                    />
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 text-card-foreground">{t('about.commonTasks.title')}</h2>
              <p className="mb-4">
                <Trans
                  i18nKey="interface:about.commonTasks.intro"
                  components={{ linkHome: <Link href="/" className="text-blue-600 hover:text-blue-800" /> }}
                />
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2 text-card-foreground">{t('about.commonTasks.image.title')}</h3>
                  <ul className="space-y-1 text-sm">
                    {commonImage.map((item, idx) => <li key={idx}>{item}</li>)}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-card-foreground">{t('about.commonTasks.videoAudio.title')}</h3>
                  <ul className="space-y-1 text-sm">
                    {commonVideoAudio.map((item, idx) => <li key={idx}>{item}</li>)}
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 text-card-foreground">{t('about.whoBuilds.title')}</h2>
              <p className="mb-4">
                <Trans i18nKey="interface:about.whoBuilds.p1" components={{ strong: <strong /> }} />
              </p>
              <p className="mb-4">{t('about.whoBuilds.p2')}</p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 text-card-foreground">{t('about.supportedFormats.title')}</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-card p-6 sci-fi-frame-inner">
                  <h3 className="font-semibold mb-2 text-blue-600">{t('about.supportedFormats.images.title')}</h3>
                  <ul className="space-y-1 text-sm">
                    {imagesFormats.map((item, idx) => <li key={idx}>{item}</li>)}
                  </ul>
                </div>
                <div className="bg-card p-6 sci-fi-frame-inner">
                  <h3 className="font-semibold mb-2 text-green-600">{t('about.supportedFormats.videos.title')}</h3>
                  <ul className="space-y-1 text-sm">
                    {videoFormats.map((item, idx) => <li key={idx}>{item}</li>)}
                  </ul>
                </div>
                <div className="bg-card p-6 sci-fi-frame-inner">
                  <h3 className="font-semibold mb-2 text-purple-600">{t('about.supportedFormats.audio.title')}</h3>
                  <ul className="space-y-1 text-sm">
                    {audioFormats.map((item, idx) => <li key={idx}>{item}</li>)}
                  </ul>
                </div>
              </div>
              <p className="mt-4 text-sm">{t('about.supportedFormats.footnote')}</p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 text-card-foreground">{t('about.contact.title')}</h2>
              <p className="mb-2">
                <Trans i18nKey="interface:about.contact.operator" components={{ strong: <strong /> }} />
              </p>
              <p className="mb-1">{t('about.contact.location')}</p>
              <p className="mb-1">
                {t('about.contact.generalSupport')}{' '}
                <a href="mailto:support@media-manipulator.com" className="text-blue-600 hover:text-blue-800">
                  support@media-manipulator.com
                </a>
              </p>
              <p className="mb-1">
                {t('about.contact.privacyRequests')}{' '}
                <a href="mailto:privacy@media-manipulator.com" className="text-blue-600 hover:text-blue-800">
                  privacy@media-manipulator.com
                </a>
              </p>
              <p className="mb-4">
                {t('about.contact.helpfulStartingPoints')}{' '}
                <Link href="/how-it-works" className="text-blue-600 hover:text-blue-800">{t('topNav.howItWorks')}</Link>{' · '}
                <Link href="/tutorials" className="text-blue-600 hover:text-blue-800">{t('topNav.tutorials')}</Link>{' · '}
                <Link href="/privacy-policy" className="text-blue-600 hover:text-blue-800">{t('topNav.privacyPolicy')}</Link>{' · '}
                <Link href="/terms-of-service" className="text-blue-600 hover:text-blue-800">{t('topNav.termsOfService')}</Link>
              </p>
            </section>

            <RelatedLinks
              title={t('about.relatedLinks.title')}
              intro={t('about.relatedLinks.intro')}
              links={RELATED_LINK_KEYS.map((key) => ({
                label: t(`about.relatedLinks.${key}.label`),
                to: RELATED_LINK_HREFS[key],
                description: t(`about.relatedLinks.${key}.description`),
              }))}
            />
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default AboutPage;
