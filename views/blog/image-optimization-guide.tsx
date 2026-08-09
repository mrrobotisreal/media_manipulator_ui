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

interface ScenarioItem {
  title: string;
  body: string;
}

interface RelatedLinkItem {
  label: string;
  description: string;
}

/**
 * Renders a rich-text list item whose i18n source string may contain inline
 * <strong> markup (e.g. "<strong>Pros</strong>: ..."). Mirrors the RichList
 * pattern used in views/how-it-works.tsx.
 */
const RichListItem: React.FC<{ text: string }> = ({ text }) => (
  <li>
    <ServerTrans i18nKey="_inline" defaults={text} components={{ strong: <strong /> }} />
  </li>
);

const ImageOptimizationGuide: React.FC<{ locale?: string }> = ({ locale }) => {
  const t = getServerT('interface', locale);
  const loc = locale ?? 'en-US';

  const jpgBullets = t('blogImageOptimization.sections.differences.jpg.bullets', { returnObjects: true }) as string[];
  const pngBullets = t('blogImageOptimization.sections.differences.png.bullets', { returnObjects: true }) as string[];
  const webpBullets = t('blogImageOptimization.sections.differences.webp.bullets', { returnObjects: true }) as string[];
  const decisionTreeItems = t('blogImageOptimization.sections.choosing.decisionTree.items', { returnObjects: true }) as string[];
  const scenarios = t('blogImageOptimization.sections.choosing.scenarios.items', { returnObjects: true }) as ScenarioItem[];
  const proTips = t('blogImageOptimization.sections.choosing.proTips.items', { returnObjects: true }) as string[];
  const loadTimesItems = t('blogImageOptimization.sections.whyImportant.loadTimes.items', { returnObjects: true }) as string[];
  const seoItems = t('blogImageOptimization.sections.whyImportant.seo.items', { returnObjects: true }) as string[];
  const moneyItems = t('blogImageOptimization.sections.whyImportant.money.items', { returnObjects: true }) as string[];
  const trustItems = t('blogImageOptimization.sections.whyImportant.trust.items', { returnObjects: true }) as string[];
  const tldrItems = t('blogImageOptimization.sections.conclusion.tldr.items', { returnObjects: true }) as string[];
  const actionPlanItems = t('blogImageOptimization.sections.conclusion.actionPlan.items', { returnObjects: true }) as string[];
  const relatedLinkItems = t('blogImageOptimization.relatedLinks.links', { returnObjects: true }) as RelatedLinkItem[];

  return (
    <>
      {/* Reading measurement: content_read_progress at 25/50/75, content_read_completed
          at >=90% scroll AND >=15s active. Renders nothing. */}
      <ContentReadTracker slug="image-optimization-guide" contentType="blog" />
      <div className="max-w-[1600px] mx-auto my-2 flex flex-col lg:flex-row gap-6 px-4">
      <aside className="hidden lg:block w-[300px] shrink-0">
        
      </aside>
      <div className="flex-1 min-w-0">
      <Panel level="1">
        <article>
        <div className="mb-4">
        <Link
          href={localizeHref('/blog', loc)}
          className="inline-flex items-center gap-2 text-primary underline decoration-primary/40 underline-offset-2 hover:text-[var(--accent-primary-hover)] hover:decoration-primary font-medium text-sm transition-colors"
        >
          {t('blogImageOptimization.backLink')}
        </Link>
      </div>
      <CardHeader className="px-0">
        <header>
          <h1 className="text-4xl font-bold text-card-foreground leading-tight">
            {t('blogImageOptimization.title')}
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
                {t('blogImageOptimization.byline.label')} Mitchell Wintrow
              </p>
              <p className="text-sm text-muted-foreground">
                <time dateTime="2025-06-14">{t('blogImageOptimization.byline.date')}</time> • {t('blogImageOptimization.byline.time')}
              </p>
            </div>
          </div>
        </header>

        <Separator className="mt-6" />
      </CardHeader>

      <CardContent className="px-0 prose prose-lg max-w-none">
        <h2 className="text-3xl font-semibold mt-12 mb-6 text-card-foreground">{t('blogImageOptimization.sections.intro.title')}</h2>

        <p className="text-lg text-muted-foreground mb-6">
          <ServerTrans locale={locale} i18nKey="interface:blogImageOptimization.sections.intro.p1" components={{ em: <em /> }} />
        </p>

        <p className="text-lg text-muted-foreground mb-6">
          {t('blogImageOptimization.sections.intro.p2')}
        </p>

        <p className="text-lg text-muted-foreground mb-6">
          <ServerTrans locale={locale} i18nKey="interface:blogImageOptimization.sections.intro.p3" components={{ em: <em /> }} />
        </p>

        <p className="text-lg text-muted-foreground mb-6">
          {t('blogImageOptimization.sections.intro.p4')}
        </p>

        <blockquote className="border-l-4 border-primary pl-4 italic text-lg text-muted-foreground mb-8">
          {t('blogImageOptimization.sections.intro.quote')}
        </blockquote>

        <h2 className="text-3xl font-semibold mt-12 mb-6 text-card-foreground">{t('blogImageOptimization.sections.differences.title')}</h2>

        <p className="text-lg text-muted-foreground mb-6">
          {t('blogImageOptimization.sections.differences.intro')}
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-4 text-card-foreground">{t('blogImageOptimization.sections.differences.jpg.title')}</h3>
        <p className="text-lg text-muted-foreground mb-4">
          {t('blogImageOptimization.sections.differences.jpg.body')}
        </p>

        <ul className="list-disc pl-6 mb-6 space-y-2 text-muted-foreground">
          {jpgBullets.map((item, idx) => <RichListItem key={idx} text={item} />)}
        </ul>

        <h3 className="text-2xl font-semibold mt-8 mb-4 text-card-foreground">{t('blogImageOptimization.sections.differences.png.title')}</h3>
        <p className="text-lg text-muted-foreground mb-4">
          {t('blogImageOptimization.sections.differences.png.body')}
        </p>

        <ul className="list-disc pl-6 mb-6 space-y-2 text-muted-foreground">
          {pngBullets.map((item, idx) => <RichListItem key={idx} text={item} />)}
        </ul>

        <h3 className="text-2xl font-semibold mt-8 mb-4 text-card-foreground">{t('blogImageOptimization.sections.differences.webp.title')}</h3>
        <p className="text-lg text-muted-foreground mb-4">
          {t('blogImageOptimization.sections.differences.webp.body')}
        </p>

        <ul className="list-disc pl-6 mb-6 space-y-2 text-muted-foreground">
          {webpBullets.map((item, idx) => <RichListItem key={idx} text={item} />)}
        </ul>

        <p className="text-lg text-muted-foreground mb-6">
          {t('blogImageOptimization.sections.differences.example')}
        </p>

        <blockquote className="border-l-4 border-primary pl-4 italic text-lg text-muted-foreground mb-8">
          {t('blogImageOptimization.sections.differences.quote')}
        </blockquote>

        <h2 className="text-3xl font-semibold mt-12 mb-6 text-card-foreground">{t('blogImageOptimization.sections.choosing.title')}</h2>

        <p className="text-lg text-muted-foreground mb-6">
          {t('blogImageOptimization.sections.choosing.intro')}
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-4 text-card-foreground">{t('blogImageOptimization.sections.choosing.decisionTree.title')}</h3>
        <p className="text-lg text-muted-foreground mb-4">
          {t('blogImageOptimization.sections.choosing.decisionTree.lead')}
        </p>
        <ol className="list-decimal pl-6 mb-6 space-y-2 text-muted-foreground">
          {decisionTreeItems.map((item, idx) => <li key={idx}>{item}</li>)}
        </ol>

        <h3 className="text-2xl font-semibold mt-8 mb-4 text-card-foreground">{t('blogImageOptimization.sections.choosing.scenarios.title')}</h3>

        {scenarios.map((scenario, idx) => (
          <React.Fragment key={idx}>
            <h4 className="text-xl font-semibold mt-6 mb-3 text-card-foreground">{scenario.title}</h4>
            <p className="text-lg text-muted-foreground mb-4">
              {scenario.body}
            </p>
          </React.Fragment>
        ))}

        <h3 className="text-2xl font-semibold mt-8 mb-4 text-card-foreground">{t('blogImageOptimization.sections.choosing.proTips.title')}</h3>
        <ul className="list-disc pl-6 mb-6 space-y-2 text-muted-foreground">
          {proTips.map((item, idx) => <li key={idx}>{item}</li>)}
        </ul>

        <blockquote className="border-l-4 border-primary pl-4 italic text-lg text-muted-foreground mb-8">
          {t('blogImageOptimization.sections.choosing.quote')}
        </blockquote>

        <h2 className="text-3xl font-semibold mt-12 mb-6 text-card-foreground">{t('blogImageOptimization.sections.whyImportant.title')}</h2>

        <p className="text-lg text-muted-foreground mb-6">
          {t('blogImageOptimization.sections.whyImportant.intro')}
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-4 text-card-foreground">{t('blogImageOptimization.sections.whyImportant.loadTimes.title')}</h3>
        <p className="text-lg text-muted-foreground mb-4">
          <ServerTrans locale={locale} i18nKey="interface:blogImageOptimization.sections.whyImportant.loadTimes.p1" components={{ strong: <strong /> }} />
        </p>

        <p className="text-lg text-muted-foreground mb-4">
          {t('blogImageOptimization.sections.whyImportant.loadTimes.p2')}
        </p>
        <ul className="list-disc pl-6 mb-6 space-y-2 text-muted-foreground">
          {loadTimesItems.map((item, idx) => <li key={idx}>{item}</li>)}
        </ul>

        <h3 className="text-2xl font-semibold mt-8 mb-4 text-card-foreground">{t('blogImageOptimization.sections.whyImportant.seo.title')}</h3>
        <p className="text-lg text-muted-foreground mb-4">
          {t('blogImageOptimization.sections.whyImportant.seo.intro')}
        </p>
        <ol className="list-decimal pl-6 mb-6 space-y-2 text-muted-foreground">
          {seoItems.map((item, idx) => <li key={idx}>{item}</li>)}
        </ol>

        <p className="text-lg text-muted-foreground mb-6">
          {t('blogImageOptimization.sections.whyImportant.seo.outro')}
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-4 text-card-foreground">{t('blogImageOptimization.sections.whyImportant.mobile.title')}</h3>
        <p className="text-lg text-muted-foreground mb-6">
          {t('blogImageOptimization.sections.whyImportant.mobile.p1')}
        </p>

        <p className="text-lg text-muted-foreground mb-6">
          {t('blogImageOptimization.sections.whyImportant.mobile.p2')}
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-4 text-card-foreground">{t('blogImageOptimization.sections.whyImportant.money.title')}</h3>
        <ul className="list-disc pl-6 mb-6 space-y-2 text-muted-foreground">
          {moneyItems.map((item, idx) => <RichListItem key={idx} text={item} />)}
        </ul>

        <p className="text-lg text-muted-foreground mb-6">
          {t('blogImageOptimization.sections.whyImportant.money.outro')}
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-4 text-card-foreground">{t('blogImageOptimization.sections.whyImportant.horrorStory.title')}</h3>
        <p className="text-lg text-muted-foreground mb-6">
          {t('blogImageOptimization.sections.whyImportant.horrorStory.body')}
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-4 text-card-foreground">{t('blogImageOptimization.sections.whyImportant.trust.title')}</h3>
        <p className="text-lg text-muted-foreground mb-4">
          {t('blogImageOptimization.sections.whyImportant.trust.intro')}
        </p>
        <ul className="list-disc pl-6 mb-6 space-y-2 text-muted-foreground">
          {trustItems.map((item, idx) => <li key={idx}>{item}</li>)}
        </ul>

        <p className="text-lg text-muted-foreground mb-6">
          {t('blogImageOptimization.sections.whyImportant.trust.outro')}
        </p>

        <blockquote className="border-l-4 border-primary pl-4 italic text-lg text-muted-foreground mb-8">
          {t('blogImageOptimization.sections.whyImportant.quote')}
        </blockquote>

        <h2 className="text-3xl font-semibold mt-12 mb-6 text-card-foreground">{t('blogImageOptimization.sections.conclusion.title')}</h2>

        <p className="text-lg text-muted-foreground mb-6">
          {t('blogImageOptimization.sections.conclusion.intro')}
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-4 text-card-foreground">{t('blogImageOptimization.sections.conclusion.tldr.title')}</h3>
        <ul className="list-disc pl-6 mb-6 space-y-2 text-muted-foreground">
          {tldrItems.map((item, idx) => <RichListItem key={idx} text={item} />)}
        </ul>

        <h3 className="text-2xl font-semibold mt-8 mb-4 text-card-foreground">{t('blogImageOptimization.sections.conclusion.actionPlan.title')}</h3>
        <ol className="list-decimal pl-6 mb-6 space-y-2 text-muted-foreground">
          {actionPlanItems.map((item, idx) => <RichListItem key={idx} text={item} />)}
        </ol>

        <h3 className="text-2xl font-semibold mt-8 mb-4 text-card-foreground">{t('blogImageOptimization.sections.conclusion.bigPicture.title')}</h3>
        <p className="text-lg text-muted-foreground mb-6">
          {t('blogImageOptimization.sections.conclusion.bigPicture.p1')}
        </p>

        <p className="text-lg text-muted-foreground mb-6">
          {t('blogImageOptimization.sections.conclusion.bigPicture.p2')}
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-4 text-card-foreground">{t('blogImageOptimization.sections.conclusion.finalChallenge.title')}</h3>
        <p className="text-lg text-muted-foreground mb-6">
          {t('blogImageOptimization.sections.conclusion.finalChallenge.p1')}
        </p>

        <p className="text-lg text-muted-foreground mb-6">
          {t('blogImageOptimization.sections.conclusion.finalChallenge.p2')}
        </p>

        <blockquote className="border-l-4 border-primary pl-4 italic text-lg text-muted-foreground mb-8">
          {t('blogImageOptimization.sections.conclusion.quote')}
        </blockquote>

        <RelatedLinks
          title={t('blogImageOptimization.relatedLinks.title')}
          intro={t('blogImageOptimization.relatedLinks.intro')}
          links={[
            {
              label: relatedLinkItems[0].label,
              to: '/tools/image-converter',
              description: relatedLinkItems[0].description,
            },
            {
              label: relatedLinkItems[1].label,
              to: '/tools/convert-webp-to-jpg',
              description: relatedLinkItems[1].description,
            },
            {
              label: relatedLinkItems[2].label,
              to: '/tools/remove-exif-metadata',
              description: relatedLinkItems[2].description,
            },
            {
              label: relatedLinkItems[3].label,
              to: '/tutorials/image/getting-started',
              description: relatedLinkItems[3].description,
            },
            {
              label: relatedLinkItems[4].label,
              to: '/blog/video/video-compression-guide',
              description: relatedLinkItems[4].description,
            },
            {
              label: relatedLinkItems[5].label,
              to: '/blog/audio/audio-quality-guide',
              description: relatedLinkItems[5].description,
            },
          ]}
        />
      </CardContent>

      <CardFooter className="px-0 flex flex-col items-center gap-4 pt-8 border-t">
        <div className="text-center max-w-2xl">
          <h2 className="text-2xl font-bold mb-3 text-card-foreground">
            {t('blogImageOptimization.footer.title')}
          </h2>
          <p className="text-lg text-muted-foreground mb-6">
            {t('blogImageOptimization.footer.body')}
          </p>
          <TrackedCtaButton
            ctaId="blog_image_optimization_try_converter"
            placement="blog_guide_image_optimization"
            href={localizeHref('/tools/image-converter', loc)}
            className="bg-success hover:bg-success/90 text-success-foreground font-semibold px-8 py-3 text-lg"
          >
            {t('blogImageOptimization.footer.ctaLabel')}
          </TrackedCtaButton>
          <p className="text-sm text-muted-foreground mt-3">
            {t('blogImageOptimization.footer.disclaimer')}
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

export default ImageOptimizationGuide;
