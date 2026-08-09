import React from 'react';
import ContentReadTracker from '@/components/analytics/content-read-tracker';
import Link from 'next/link';
import { CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Panel } from '@/components/darkroom/panel';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import RelatedLinks from '@/components/related-links';
import TrackedCtaButton from '@/components/analytics/tracked-cta-button';
import { getServerT, ServerTrans } from '@/lib/i18n/server';
import { localizeHref } from '@/i18n/locales';

const AudioQualityGuide: React.FC<{ locale?: string }> = ({ locale }) => {
  const t = getServerT('interface', locale);

  const introBullets = t('blogAudioQuality.intro.bullets', { returnObjects: true }) as string[];
  const formatsBullets = t('blogAudioQuality.difference.formatsBullets', { returnObjects: true }) as string[];
  const bitrateBullets = t('blogAudioQuality.difference.bitrateBullets', { returnObjects: true }) as string[];
  const sampleRateBullets = t('blogAudioQuality.difference.sampleRateBullets', { returnObjects: true }) as string[];
  const backgroundBullets = t('blogAudioQuality.usage.background.bullets', { returnObjects: true }) as string[];
  const podcastsBullets = t('blogAudioQuality.usage.podcasts.bullets', { returnObjects: true }) as string[];
  const streamingBullets = t('blogAudioQuality.usage.streaming.bullets', { returnObjects: true }) as string[];
  const previewsBullets = t('blogAudioQuality.usage.previews.bullets', { returnObjects: true }) as string[];
  const archivalBullets = t('blogAudioQuality.usage.archival.bullets', { returnObjects: true }) as string[];
  const decisionTreeContent = t('blogAudioQuality.usage.decisionTree.content');
  const pageLoadSpeedBullets = t('blogAudioQuality.importance.pageLoadSpeed.bullets', { returnObjects: true }) as string[];
  const realNumbersBullets = t('blogAudioQuality.importance.realNumbers.bullets', { returnObjects: true }) as string[];
  const trustFactorBullets = t('blogAudioQuality.importance.trustFactor.bullets', { returnObjects: true }) as string[];
  const seoVitalsBullets = t('blogAudioQuality.importance.seoVitals.bullets', { returnObjects: true }) as string[];
  const moreReasonsBullets = t('blogAudioQuality.importance.moreReasons.bullets', { returnObjects: true }) as string[];
  const takeawaysBullets = t('blogAudioQuality.conclusion.takeaways.bullets', { returnObjects: true }) as string[];
  const actionPlanSteps = t('blogAudioQuality.conclusion.actionPlan.steps', { returnObjects: true }) as string[];
  const relatedLinksItems = t('blogAudioQuality.relatedLinks.links', { returnObjects: true }) as Array<{ label: string; description: string }>;

  return (
    <>
      {/* Reading measurement: content_read_progress at 25/50/75, content_read_completed
          at >=90% scroll AND >=15s active. Renders nothing. */}
      <ContentReadTracker slug="audio-quality-guide" contentType="blog" />
      <div className="max-w-[1600px] mx-auto my-2 flex flex-col lg:flex-row gap-6 px-4">
      <aside className="hidden lg:block w-[300px] shrink-0">

      </aside>
      <div className="flex-1 min-w-0">
      <Panel level="1">
        <article>
        <div className="mb-4">
        <Link
          href={localizeHref('/blog', locale ?? 'en-US')}
          className="inline-flex items-center gap-2 text-primary underline decoration-primary/40 underline-offset-2 hover:text-[var(--accent-primary-hover)] hover:decoration-primary font-medium text-sm transition-colors"
        >
          {t('blogAudioQuality.nav.backToBlog')}
        </Link>
      </div>
      <CardHeader className="px-0">
        <header>
          <h1 className="text-4xl font-bold text-card-foreground leading-tight">
            <ServerTrans
              locale={locale}
              i18nKey="interface:blogAudioQuality.header.title"
              components={{ strike: <span className="line-through text-muted-foreground" /> }}
            />
          </h1>

          <div className="flex items-center gap-4 mt-6">
            <Avatar className="w-12 h-12">
              <AvatarImage src="/ProfilePic.webp" alt="Mitchell Wintrow" />
              <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                MW
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col">
              <p className="text-sm font-medium text-card-foreground">
                {t('blogAudioQuality.header.byline')} Mitchell Wintrow
              </p>
              <p className="text-sm text-muted-foreground">
                <time dateTime="2025-06-14">{t('blogAudioQuality.header.dateDisplay')}</time> • {t('blogAudioQuality.header.timeDisplay')}
              </p>
            </div>
          </div>
        </header>

        <Separator className="mt-6" />
      </CardHeader>

      <CardContent className="px-0 prose prose-lg max-w-none">
        <h2 className="text-3xl font-semibold mt-12 mb-6 text-card-foreground">{t('blogAudioQuality.intro.title')}</h2>

        <p className="text-lg text-muted-foreground mb-6">
          {t('blogAudioQuality.intro.p1')}
        </p>

        <ul className="list-disc pl-6 mb-6 space-y-2 text-muted-foreground">
          {introBullets.map((item, idx) => <li key={idx}>{item}</li>)}
        </ul>

        <p className="text-lg text-muted-foreground mb-6">
          {t('blogAudioQuality.intro.p2')}
        </p>

        <p className="text-lg text-muted-foreground mb-6">
          {t('blogAudioQuality.intro.p3')}
        </p>

        <p className="text-lg text-muted-foreground mb-6">
          {t('blogAudioQuality.intro.p4')}
        </p>

        <blockquote className="border-l-4 border-primary pl-4 italic text-lg text-muted-foreground mb-8">
          {t('blogAudioQuality.intro.quote')}
        </blockquote>

        <h2 className="text-3xl font-semibold mt-12 mb-6 text-card-foreground">{t('blogAudioQuality.difference.title')}</h2>

        <p className="text-lg text-muted-foreground mb-6">
          {t('blogAudioQuality.difference.p1')}
        </p>

        <p className="text-lg text-muted-foreground mb-4">
          <ServerTrans locale={locale} i18nKey="interface:blogAudioQuality.difference.formatsLead" components={{ strong: <strong /> }} />
        </p>
        <ul className="list-disc pl-6 mb-6 space-y-2 text-muted-foreground">
          {formatsBullets.map((item, idx) => (
            <li key={idx}><ServerTrans i18nKey="_inline" defaults={item} components={{ strong: <strong /> }} /></li>
          ))}
        </ul>

        <p className="text-lg text-muted-foreground mb-4">
          <ServerTrans locale={locale} i18nKey="interface:blogAudioQuality.difference.bitrateLead" components={{ strong: <strong /> }} />
        </p>
        <ul className="list-disc pl-6 mb-6 space-y-2 text-muted-foreground">
          {bitrateBullets.map((item, idx) => (
            <li key={idx}><ServerTrans i18nKey="_inline" defaults={item} components={{ strong: <strong /> }} /></li>
          ))}
        </ul>

        <p className="text-lg text-muted-foreground mb-4">
          <ServerTrans locale={locale} i18nKey="interface:blogAudioQuality.difference.sampleRateLead" components={{ strong: <strong /> }} />
        </p>
        <ul className="list-disc pl-6 mb-6 space-y-2 text-muted-foreground">
          {sampleRateBullets.map((item, idx) => (
            <li key={idx}><ServerTrans i18nKey="_inline" defaults={item} components={{ strong: <strong /> }} /></li>
          ))}
        </ul>

        <p className="text-lg text-muted-foreground mb-6">
          {t('blogAudioQuality.difference.p2')}
        </p>

        <blockquote className="border-l-4 border-primary pl-4 italic text-lg text-muted-foreground mb-8">
          {t('blogAudioQuality.difference.quote')}
        </blockquote>

        <h2 className="text-3xl font-semibold mt-12 mb-6 text-card-foreground">{t('blogAudioQuality.usage.title')}</h2>

        <p className="text-lg text-muted-foreground mb-6">
          {t('blogAudioQuality.usage.p1')}
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-4 text-card-foreground">{t('blogAudioQuality.usage.background.title')}</h3>
        <ul className="list-disc pl-6 mb-6 space-y-2 text-muted-foreground">
          {backgroundBullets.map((item, idx) => (
            <li key={idx}><ServerTrans i18nKey="_inline" defaults={item} components={{ strong: <strong /> }} /></li>
          ))}
        </ul>

        <h3 className="text-2xl font-semibold mt-8 mb-4 text-card-foreground">{t('blogAudioQuality.usage.podcasts.title')}</h3>
        <ul className="list-disc pl-6 mb-6 space-y-2 text-muted-foreground">
          {podcastsBullets.map((item, idx) => (
            <li key={idx}><ServerTrans i18nKey="_inline" defaults={item} components={{ strong: <strong /> }} /></li>
          ))}
        </ul>

        <h3 className="text-2xl font-semibold mt-8 mb-4 text-card-foreground">{t('blogAudioQuality.usage.streaming.title')}</h3>
        <ul className="list-disc pl-6 mb-6 space-y-2 text-muted-foreground">
          {streamingBullets.map((item, idx) => (
            <li key={idx}><ServerTrans i18nKey="_inline" defaults={item} components={{ strong: <strong /> }} /></li>
          ))}
        </ul>

        <h3 className="text-2xl font-semibold mt-8 mb-4 text-card-foreground">{t('blogAudioQuality.usage.previews.title')}</h3>
        <ul className="list-disc pl-6 mb-6 space-y-2 text-muted-foreground">
          {previewsBullets.map((item, idx) => (
            <li key={idx}><ServerTrans i18nKey="_inline" defaults={item} components={{ strong: <strong /> }} /></li>
          ))}
        </ul>

        <h3 className="text-2xl font-semibold mt-8 mb-4 text-card-foreground">{t('blogAudioQuality.usage.archival.title')}</h3>
        <ul className="list-disc pl-6 mb-6 space-y-2 text-muted-foreground">
          {archivalBullets.map((item, idx) => (
            <li key={idx}><ServerTrans i18nKey="_inline" defaults={item} components={{ strong: <strong /> }} /></li>
          ))}
        </ul>

        <h3 className="text-2xl font-semibold mt-8 mb-4 text-card-foreground">{t('blogAudioQuality.usage.decisionTree.title')}</h3>
        <div className="bg-surface-2 p-6 rounded-lg mb-8 font-mono text-sm">
          <pre className="whitespace-pre-wrap text-muted-foreground">
{decisionTreeContent}
          </pre>
        </div>

        <p className="text-lg text-muted-foreground mb-6">
          {t('blogAudioQuality.usage.ninjaTip')}
        </p>

        <p className="text-lg text-muted-foreground mb-6">
          <ServerTrans locale={locale} i18nKey="interface:blogAudioQuality.usage.realWorldExample" components={{ strong: <strong /> }} />
        </p>

        <blockquote className="border-l-4 border-primary pl-4 italic text-lg text-muted-foreground mb-8">
          {t('blogAudioQuality.usage.quote')}
        </blockquote>

        <h2 className="text-3xl font-semibold mt-12 mb-6 text-card-foreground">{t('blogAudioQuality.importance.title')}</h2>

        <p className="text-lg text-muted-foreground mb-6">
          {t('blogAudioQuality.importance.p1')}
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-4 text-card-foreground">{t('blogAudioQuality.importance.pageLoadSpeed.title')}</h3>
        <p className="text-lg text-muted-foreground mb-4">
          {t('blogAudioQuality.importance.pageLoadSpeed.lead')}
        </p>
        <ul className="list-disc pl-6 mb-6 space-y-2 text-muted-foreground">
          {pageLoadSpeedBullets.map((item, idx) => (
            <li key={idx}><ServerTrans i18nKey="_inline" defaults={item} components={{ strong: <strong /> }} /></li>
          ))}
        </ul>

        <p className="text-lg text-muted-foreground mb-6">
          {t('blogAudioQuality.importance.pageLoadSpeed.outro')}
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-4 text-card-foreground">{t('blogAudioQuality.importance.mobileReality.title')}</h3>
        <p className="text-lg text-muted-foreground mb-6">
          {t('blogAudioQuality.importance.mobileReality.p')}
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-4 text-card-foreground">{t('blogAudioQuality.importance.realNumbers.title')}</h3>
        <p className="text-lg text-muted-foreground mb-4">
          {t('blogAudioQuality.importance.realNumbers.lead')}
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2 text-muted-foreground">
          {realNumbersBullets.map((item, idx) => <li key={idx}>{item}</li>)}
        </ul>

        <p className="text-lg text-muted-foreground mb-6">
          <ServerTrans locale={locale} i18nKey="interface:blogAudioQuality.importance.realNumbers.comparisonWav" components={{ strong: <strong /> }} /><br />
          <ServerTrans locale={locale} i18nKey="interface:blogAudioQuality.importance.realNumbers.comparisonMp3" components={{ strong: <strong /> }} />
        </p>

        <p className="text-lg text-muted-foreground mb-6">
          {t('blogAudioQuality.importance.realNumbers.outro')}
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-4 text-card-foreground">{t('blogAudioQuality.importance.trustFactor.title')}</h3>
        <p className="text-lg text-muted-foreground mb-4">
          {t('blogAudioQuality.importance.trustFactor.lead')}
        </p>
        <ul className="list-disc pl-6 mb-6 space-y-2 text-muted-foreground">
          {trustFactorBullets.map((item, idx) => <li key={idx}>{item}</li>)}
        </ul>

        <p className="text-lg text-muted-foreground mb-6">
          {t('blogAudioQuality.importance.trustFactor.outro')}
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-4 text-card-foreground">{t('blogAudioQuality.importance.seoVitals.title')}</h3>
        <p className="text-lg text-muted-foreground mb-4">
          {t('blogAudioQuality.importance.seoVitals.lead')}
        </p>
        <ul className="list-disc pl-6 mb-6 space-y-2 text-muted-foreground">
          {seoVitalsBullets.map((item, idx) => (
            <li key={idx}><ServerTrans i18nKey="_inline" defaults={item} components={{ strong: <strong /> }} /></li>
          ))}
        </ul>

        <p className="text-lg text-muted-foreground mb-6">
          {t('blogAudioQuality.importance.seoVitals.outro')}
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-4 text-card-foreground">{t('blogAudioQuality.importance.moreReasons.title')}</h3>
        <p className="text-lg text-muted-foreground mb-4">
          {t('blogAudioQuality.importance.moreReasons.lead')}
        </p>
        <ul className="list-disc pl-6 mb-6 space-y-2 text-muted-foreground">
          {moreReasonsBullets.map((item, idx) => <li key={idx}>{item}</li>)}
        </ul>

        <p className="text-lg text-muted-foreground mb-6">
          {t('blogAudioQuality.importance.moreReasons.clientStory')}
        </p>

        <blockquote className="border-l-4 border-primary pl-4 italic text-lg text-muted-foreground mb-8">
          {t('blogAudioQuality.importance.quote')}
        </blockquote>

        <h2 className="text-3xl font-semibold mt-12 mb-6 text-card-foreground">{t('blogAudioQuality.conclusion.title')}</h2>

        <p className="text-lg text-muted-foreground mb-6">
          {t('blogAudioQuality.conclusion.p1')}
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-4 text-card-foreground">{t('blogAudioQuality.conclusion.takeaways.title')}</h3>
        <ul className="list-disc pl-6 mb-6 space-y-2 text-muted-foreground">
          {takeawaysBullets.map((item, idx) => <li key={idx}>{item}</li>)}
        </ul>

        <h3 className="text-2xl font-semibold mt-8 mb-4 text-card-foreground">{t('blogAudioQuality.conclusion.actionPlan.title')}</h3>
        <ol className="list-decimal pl-6 mb-6 space-y-2 text-muted-foreground">
          {actionPlanSteps.map((item, idx) => (
            <li key={idx}><ServerTrans i18nKey="_inline" defaults={item} components={{ strong: <strong /> }} /></li>
          ))}
        </ol>

        <p className="text-lg text-muted-foreground mb-6">
          {t('blogAudioQuality.conclusion.p2')}
        </p>

        <p className="text-lg text-muted-foreground mb-6">
          {t('blogAudioQuality.conclusion.p3')}
        </p>

        <p className="text-lg text-muted-foreground mb-6">
          {t('blogAudioQuality.conclusion.p4')}
        </p>

        <blockquote className="border-l-4 border-primary pl-4 italic text-lg text-muted-foreground mb-8">
          {t('blogAudioQuality.conclusion.quote')}
        </blockquote>

        <RelatedLinks
          title={t('blogAudioQuality.relatedLinks.title')}
          intro={t('blogAudioQuality.relatedLinks.intro')}
          links={[
            {
              label: relatedLinksItems[0].label,
              to: '/tools/audio-converter',
              description: relatedLinksItems[0].description,
            },
            {
              label: relatedLinksItems[1].label,
              to: '/tools/convert-wav-to-mp3',
              description: relatedLinksItems[1].description,
            },
            {
              label: relatedLinksItems[2].label,
              to: '/tools/isolate-vocals-from-song',
              description: relatedLinksItems[2].description,
            },
            {
              label: relatedLinksItems[3].label,
              to: '/tutorials/audio/getting-started',
              description: relatedLinksItems[3].description,
            },
            {
              label: relatedLinksItems[4].label,
              to: '/blog/video/video-compression-guide',
              description: relatedLinksItems[4].description,
            },
            {
              label: relatedLinksItems[5].label,
              to: '/blog/image/image-optimization-guide',
              description: relatedLinksItems[5].description,
            },
          ]}
        />
      </CardContent>

      <CardFooter className="px-0 flex flex-col items-center gap-4 pt-8 border-t">
        <div className="text-center max-w-2xl">
          <h2 className="text-2xl font-bold mb-3 text-card-foreground">
            {t('blogAudioQuality.cta.title')}
          </h2>
          <p className="text-lg text-muted-foreground mb-6">
            {t('blogAudioQuality.cta.body')}
          </p>
          <TrackedCtaButton
            ctaId="blog_audio_quality_try_converter"
            placement="blog_guide_audio_quality"
            href={localizeHref('/tools/audio-converter', locale ?? 'en-US')}
            className="bg-success hover:bg-success/90 text-success-foreground font-semibold px-8 py-3 text-lg"
          >
            {t('blogAudioQuality.cta.buttonLabel')}
          </TrackedCtaButton>
          <p className="text-sm text-muted-foreground mt-3">
            {t('blogAudioQuality.cta.footnote')}
          </p>
        </div>
        </CardFooter>
        </article>
      </Panel>
      </div>
      <aside className="hidden lg:block w-[300px] shrink-0">

      </aside>
      </div>
      </>
  );
};

export default AudioQualityGuide;
