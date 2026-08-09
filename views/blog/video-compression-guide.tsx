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

const RichBullets: React.FC<{ items: string[]; className?: string }> = ({
  items,
  className = 'list-disc pl-6 mb-6 space-y-2 text-muted-foreground',
}) => (
  <ul className={className}>
    {items.map((item, idx) => (
      <li key={idx}>
        <ServerTrans i18nKey="_inline" defaults={item} components={{ strong: <strong /> }} />
      </li>
    ))}
  </ul>
);

const VideoCompressionGuide: React.FC<{ locale?: string }> = ({ locale }) => {
  const t = getServerT('interface', locale);
  const loc = locale ?? 'en-US';
  const k = (path: string) => `blogVideoCompression.${path}`;

  const introBullets = t(k('intro.bullets'), { returnObjects: true }) as string[];

  const mp4Bullets = t(k('formats.mp4.bullets'), { returnObjects: true }) as string[];
  const webmBullets = t(k('formats.webm.bullets'), { returnObjects: true }) as string[];
  const aviBullets = t(k('formats.avi.bullets'), { returnObjects: true }) as string[];
  const movBullets = t(k('formats.mov.bullets'), { returnObjects: true }) as string[];
  const tableHeaders = t(k('formats.table.headers'), { returnObjects: true }) as string[];
  const tableRows = t(k('formats.table.rows'), { returnObjects: true }) as string[][];

  const useMp4Bullets = t(k('whenToUse.mp4.bullets'), { returnObjects: true }) as string[];
  const useWebmBullets = t(k('whenToUse.webm.bullets'), { returnObjects: true }) as string[];
  const useAviBullets = t(k('whenToUse.avi.bullets'), { returnObjects: true }) as string[];
  const useMovBullets = t(k('whenToUse.mov.bullets'), { returnObjects: true }) as string[];

  const googleBullets = t(k('whyImportant.googleWatching.bullets'), { returnObjects: true }) as string[];
  const clientResults = t(k('whyImportant.googleWatching.clientResults'), { returnObjects: true }) as string[];
  const bandwidthBullets = t(k('whyImportant.bandwidthBill.bullets'), { returnObjects: true }) as string[];
  const mobileBullets = t(k('whyImportant.mobileUsers.bullets'), { returnObjects: true }) as string[];
  const trustBullets = t(k('whyImportant.trust.bullets'), { returnObjects: true }) as string[];
  const monetizationBullets = t(k('whyImportant.monetization.bullets'), { returnObjects: true }) as string[];

  const cheatSheet = t(k('conclusion.cheatSheet'), { returnObjects: true }) as string[];
  const checklist = t(k('conclusion.checklist'), { returnObjects: true }) as string[];

  const relatedItems = t(k('relatedLinks.items'), { returnObjects: true }) as { label: string; description: string }[];
  const relatedHrefs = [
    '/tools/compress-video',
    '/tools/video-converter',
    '/tools/convert-video-to-animated-gif',
    '/tools/transcribe-video',
    '/tutorials/video/getting-started',
    '/blog/image/image-optimization-guide',
  ];

  return (
    <>
      {/* Reading measurement: content_read_progress at 25/50/75, content_read_completed
          at >=90% scroll AND >=15s active. Renders nothing. */}
      <ContentReadTracker slug="video-compression-guide" contentType="blog" />
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
          {t(k('nav.backToBlog'))}
        </Link>
      </div>
      <CardHeader className="px-0">
        <header>
          <h1 className="text-4xl font-bold text-card-foreground leading-tight">
            {t(k('title'))}
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
                {t(k('byline.writtenBy'))} Mitchell Wintrow
              </p>
              <p className="text-sm text-muted-foreground">
                <time dateTime="2025-06-13">{t(k('byline.date'))}</time> • {t(k('byline.time'))}
              </p>
            </div>
          </div>
        </header>

        <Separator className="mt-6" />
      </CardHeader>

      <CardContent className="px-0 prose prose-lg max-w-none">
        <h2 className="text-3xl font-semibold mt-12 mb-6 text-card-foreground">{t(k('intro.title'))}</h2>

        <p className="text-lg text-muted-foreground mb-6">{t(k('intro.p1'))}</p>

        <p className="text-lg text-muted-foreground mb-6">{t(k('intro.p2'))}</p>

        <p className="text-lg text-muted-foreground mb-4">{t(k('intro.p3'))}</p>

        <RichBullets items={introBullets} />

        <p className="text-lg text-muted-foreground mb-6">{t(k('intro.p4'))}</p>

        <blockquote className="border-l-4 border-primary pl-4 italic text-lg text-muted-foreground mb-8">
          {t(k('intro.quote'))}
        </blockquote>

        <h2 className="text-3xl font-semibold mt-12 mb-6 text-card-foreground">{t(k('formats.title'))}</h2>

        <p className="text-lg text-muted-foreground mb-6">{t(k('formats.intro'))}</p>

        <h3 className="text-2xl font-semibold mt-8 mb-4 text-card-foreground">{t(k('formats.mp4.title'))}</h3>
        <p className="text-lg text-muted-foreground mb-4">{t(k('formats.mp4.intro'))}</p>
        <RichBullets items={mp4Bullets} />

        <h3 className="text-2xl font-semibold mt-8 mb-4 text-card-foreground">{t(k('formats.webm.title'))}</h3>
        <p className="text-lg text-muted-foreground mb-4">{t(k('formats.webm.intro'))}</p>
        <RichBullets items={webmBullets} />

        <h3 className="text-2xl font-semibold mt-8 mb-4 text-card-foreground">{t(k('formats.avi.title'))}</h3>
        <p className="text-lg text-muted-foreground mb-4">{t(k('formats.avi.intro'))}</p>
        <RichBullets items={aviBullets} />

        <h3 className="text-2xl font-semibold mt-8 mb-4 text-card-foreground">{t(k('formats.mov.title'))}</h3>
        <p className="text-lg text-muted-foreground mb-4">{t(k('formats.mov.intro'))}</p>
        <RichBullets items={movBullets} />

        <p className="text-lg text-muted-foreground mb-4">{t(k('formats.comparisonIntro'))}</p>

        <div className="overflow-x-auto mb-8">
          <table className="min-w-full bg-card border border-border rounded-lg">
            <thead className="bg-muted/50">
              <tr>
                {tableHeaders.map((h, idx) => (
                  <th key={idx} className="px-6 py-3 text-left text-sm font-semibold text-card-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {tableRows.map((row, rIdx) => (
                <tr key={rIdx}>
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="px-6 py-4 text-sm text-muted-foreground">{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <blockquote className="border-l-4 border-primary pl-4 italic text-lg text-muted-foreground mb-8">
          {t(k('formats.quote'))}
        </blockquote>

        <h2 className="text-3xl font-semibold mt-12 mb-6 text-card-foreground">{t(k('whenToUse.title'))}</h2>

        <p className="text-lg text-muted-foreground mb-6">{t(k('whenToUse.p1'))}</p>

        <p className="text-lg text-muted-foreground mb-6">{t(k('whenToUse.p2'))}</p>

        <h3 className="text-2xl font-semibold mt-8 mb-4 text-card-foreground">{t(k('whenToUse.mp4.title'))}</h3>
        <p className="text-lg text-muted-foreground mb-4">
          <ServerTrans locale={locale} i18nKey={k('whenToUse.mp4.lead')} components={{ strong: <strong /> }} />
        </p>
        <RichBullets items={useMp4Bullets} />

        <p className="text-lg text-muted-foreground mb-6">
          <ServerTrans locale={locale} i18nKey={k('whenToUse.mp4.proTip')} components={{ strong: <strong /> }} />
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-4 text-card-foreground">{t(k('whenToUse.webm.title'))}</h3>
        <p className="text-lg text-muted-foreground mb-4">
          <ServerTrans locale={locale} i18nKey={k('whenToUse.webm.lead')} components={{ strong: <strong /> }} />
        </p>
        <RichBullets items={useWebmBullets} />

        <p className="text-lg text-muted-foreground mb-6">
          <ServerTrans locale={locale} i18nKey={k('whenToUse.webm.realTalk')} components={{ strong: <strong /> }} />
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-4 text-card-foreground">{t(k('whenToUse.avi.title'))}</h3>
        <p className="text-lg text-muted-foreground mb-4">
          <ServerTrans locale={locale} i18nKey={k('whenToUse.avi.lead')} components={{ strong: <strong /> }} />
        </p>
        <RichBullets items={useAviBullets} />

        <div className="bg-destructive/10 border-l-4 border-destructive p-4 mb-6">
          <p className="text-destructive">
            <ServerTrans locale={locale} i18nKey={k('whenToUse.avi.warning')} components={{ strong: <strong /> }} />
          </p>
        </div>

        <h3 className="text-2xl font-semibold mt-8 mb-4 text-card-foreground">{t(k('whenToUse.mov.title'))}</h3>
        <p className="text-lg text-muted-foreground mb-4">
          <ServerTrans locale={locale} i18nKey={k('whenToUse.mov.lead')} components={{ strong: <strong /> }} />
        </p>
        <RichBullets items={useMovBullets} />

        <p className="text-lg text-muted-foreground mb-6">
          <ServerTrans locale={locale} i18nKey={k('whenToUse.mov.realityCheck')} components={{ strong: <strong /> }} />
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-4 text-card-foreground">{t(k('whenToUse.decisionTree.title'))}</h3>
        <div className="bg-surface-2 p-6 rounded-lg mb-8 font-mono text-sm">
          <pre className="whitespace-pre-wrap text-muted-foreground">
            {t(k('whenToUse.decisionTree.diagram'))}
          </pre>
        </div>

        <blockquote className="border-l-4 border-primary pl-4 italic text-lg text-muted-foreground mb-8">
          {t(k('whenToUse.quote'))}
        </blockquote>

        <h2 className="text-3xl font-semibold mt-12 mb-6 text-card-foreground">{t(k('whyImportant.title'))}</h2>

        <p className="text-lg text-muted-foreground mb-6">{t(k('whyImportant.p1'))}</p>

        <p className="text-lg text-muted-foreground mb-6">{t(k('whyImportant.p2'))}</p>

        <h3 className="text-2xl font-semibold mt-8 mb-4 text-card-foreground">{t(k('whyImportant.threeSecondRule.title'))}</h3>
        <p className="text-lg text-muted-foreground mb-6">{t(k('whyImportant.threeSecondRule.body'))}</p>

        <h3 className="text-2xl font-semibold mt-8 mb-4 text-card-foreground">{t(k('whyImportant.googleWatching.title'))}</h3>
        <p className="text-lg text-muted-foreground mb-4">{t(k('whyImportant.googleWatching.intro'))}</p>
        <RichBullets items={googleBullets} />

        <p className="text-lg text-muted-foreground mb-6">{t(k('whyImportant.googleWatching.clientStory'))}</p>
        <RichBullets items={clientResults} />

        <h3 className="text-2xl font-semibold mt-8 mb-4 text-card-foreground">{t(k('whyImportant.bandwidthBill.title'))}</h3>
        <p className="text-lg text-muted-foreground mb-6">{t(k('whyImportant.bandwidthBill.body'))}</p>

        <p className="text-lg text-muted-foreground mb-4">
          <ServerTrans locale={locale} i18nKey={k('whyImportant.bandwidthBill.realNumbersIntro')} components={{ strong: <strong /> }} />
        </p>
        <RichBullets items={bandwidthBullets} />

        <h3 className="text-2xl font-semibold mt-8 mb-4 text-card-foreground">{t(k('whyImportant.mobileUsers.title'))}</h3>
        <p className="text-lg text-muted-foreground mb-4">{t(k('whyImportant.mobileUsers.intro'))}</p>
        <RichBullets items={mobileBullets} />

        <h3 className="text-2xl font-semibold mt-8 mb-4 text-card-foreground">{t(k('whyImportant.trust.title'))}</h3>
        <p className="text-lg text-muted-foreground mb-6">{t(k('whyImportant.trust.intro'))}</p>
        <RichBullets items={trustBullets} />

        <p className="text-lg text-muted-foreground mb-6">{t(k('whyImportant.trust.outro'))}</p>

        <h3 className="text-2xl font-semibold mt-8 mb-4 text-card-foreground">{t(k('whyImportant.monetization.title'))}</h3>
        <p className="text-lg text-muted-foreground mb-4">{t(k('whyImportant.monetization.intro'))}</p>
        <RichBullets items={monetizationBullets} />

        <blockquote className="border-l-4 border-primary pl-4 italic text-lg text-muted-foreground mb-8">
          {t(k('whyImportant.quote'))}
        </blockquote>

        <h2 className="text-3xl font-semibold mt-12 mb-6 text-card-foreground">{t(k('conclusion.title'))}</h2>

        <p className="text-lg text-muted-foreground mb-6">{t(k('conclusion.p1'))}</p>

        <p className="text-lg text-muted-foreground mb-4">{t(k('conclusion.cheatSheetIntro'))}</p>
        <RichBullets items={cheatSheet} />

        <p className="text-lg text-muted-foreground mb-4">{t(k('conclusion.p2'))}</p>
        <RichBullets items={checklist} className="list-none space-y-2 text-muted-foreground mb-6" />

        <p className="text-lg text-muted-foreground mb-6">{t(k('conclusion.p3'))}</p>

        <p className="text-lg text-muted-foreground mb-6">{t(k('conclusion.p4'))}</p>

        <blockquote className="border-l-4 border-primary pl-4 italic text-lg text-muted-foreground mb-8">
          {t(k('conclusion.quote'))}
        </blockquote>

        <RelatedLinks
          title={t(k('relatedLinks.title'))}
          intro={t(k('relatedLinks.intro'))}
          links={relatedItems.map((item, idx) => ({
            label: item.label,
            to: relatedHrefs[idx],
            description: item.description,
          }))}
        />
      </CardContent>

      <CardFooter className="px-0 flex flex-col items-center gap-4 pt-8 border-t">
        <div className="text-center max-w-2xl">
          <h2 className="text-2xl font-bold mb-3 text-card-foreground">
            {t(k('cta.title'))}
          </h2>
          <p className="text-lg text-muted-foreground mb-6">
            {t(k('cta.body'))}
          </p>
          <TrackedCtaButton
            ctaId="blog_video_compression_try_converter"
            placement="blog_guide_video_compression"
            href="/tools/compress-video"
            className="bg-success hover:bg-success/90 text-success-foreground font-semibold px-8 py-3 text-lg"
          >
            {t(k('cta.button'))}
          </TrackedCtaButton>
          <p className="text-sm text-muted-foreground mt-3">
            {t(k('cta.footnote'))}
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

export default VideoCompressionGuide;
