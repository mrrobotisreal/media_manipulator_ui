import Link from 'next/link';

import { Panel } from '@/components/darkroom/panel';
import { REVIEW_INDEXED_TOOL_SLUGS } from '@/content/reviewAllowlist';
import type { ToolPageContent } from '@/content/toolPages';
import { getLocalizedToolPages } from '@/i18n/toolPageContent';
import { localizeHref } from '@/i18n/locales';
import { getServerT, ServerTrans } from '@/lib/i18n/server';

/**
 * Server-rendered body copy for `/` (and its locale-prefixed siblings).
 *
 * The home page is a client island (the converter), so before this the route
 * emitted essentially no crawlable prose — just JSON-LD wrapped around a
 * `'use client'` component. AdSense review weighs content depth and this is the
 * landing page, so a short, genuinely useful block sits below the tool.
 *
 * MM85 (decision 7): a real introduction of at least 450 words: what you can
 * do here (one paragraph per category, linking the review-allowed tools), the
 * three steps, an internal-link grid, what we deliberately don't do, and who
 * makes the site. Copy comes from the
 * server-only `homeContent` section of `interface/pages.json`; tool names and
 * taglines read through `getLocalizedToolPages` (partial per-locale overrides
 * over `content/toolPages.ts`, which is only read, never modified).
 */

const LINK =
  'text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary';

interface HomeStep {
  title: string;
  body: string;
}

export function HomeContent({ locale }: { locale?: string }) {
  const t = getServerT('interface', locale);
  const steps = t('interface:homeContent.howItWorks.steps', {
    returnObjects: true,
  }) as HomeStep[];

  // Content Studio and Motion are featured separately on /tools (editors, not
  // conversions), so they are excluded here.
  const localizedTools = getLocalizedToolPages(locale ?? 'en-US');
  const popular: ToolPageContent[] = REVIEW_INDEXED_TOOL_SLUGS.filter(
    (slug) => slug !== 'content-studio' && slug !== 'motion'
  )
    .map((slug) => localizedTools.find((tool) => tool.slug === slug))
    .filter((tool): tool is ToolPageContent => Boolean(tool));

  const href = (path: string) => localizeHref(path, locale ?? 'en-US');
  const notDone = t('interface:homeContent.whatWeDont.items', { returnObjects: true }) as string[];
  const link = (path: string) => <Link href={href(path)} className={LINK} />;
  // MM85: each category paragraph links three or four review-allowlisted tools.
  const toolLinks = {
    strong: <strong className="text-foreground" />,
    compressVideo: link('/tools/compress-video'),
    trimVideo: link('/tools/video-trimmer'),
    videoGif: link('/tools/convert-video-to-animated-gif'),
    hls: link('/tools/transcode-to-hls'),
    removeExif: link('/tools/remove-exif-metadata'),
    compressImage: link('/tools/compress-image'),
    resizeImage: link('/tools/image-resizer'),
    imageToPdf: link('/tools/image-to-pdf'),
    pdfToJpg: link('/tools/pdf-to-jpg'),
    extractAudio: link('/tools/extract-audio-from-video'),
    transcribe: link('/tools/transcribe-video'),
    removeBg: link('/tools/remove-background-from-image'),
    imageRestore: link('/tools/ai-image-restoration'),
    videoRestore: link('/tools/ai-video-restoration'),
    docScan: link('/tools/ai-document-scan'),
    darkroom: link('/tools/content-studio'),
    motion: link('/tools/motion'),
  };

  return (
    <div className="mx-auto grid max-w-[1600px] gap-6 px-4 pb-12 lg:grid-cols-2" data-testid="home-content">
      <Panel
        level="1"
        as="section"
        eyebrow={t('interface:homeContent.whatYouCanDo.eyebrow')}
        title={t('interface:homeContent.whatYouCanDo.title')}
        titleAs="h2"
        className="lg:col-span-2"
      >
        <div className="grid gap-4 text-sm text-muted-foreground md:grid-cols-2">
          {(['video', 'images', 'audio', 'ai', 'editors'] as const).map((key) => (
            <p key={key}>
              <ServerTrans i18nKey={`interface:homeContent.whatYouCanDo.${key}`} locale={locale} components={toolLinks} />
            </p>
          ))}
        </div>
      </Panel>

      <Panel
        level="1"
        as="section"
        eyebrow={t('interface:homeContent.howItWorks.eyebrow')}
        title={t('interface:homeContent.howItWorks.title')}
        titleAs="h2"
      >
        <ol className="space-y-5">
          {steps.map((step, i) => (
            <li key={step.title} className="flex gap-4">
              {/* Coral monospace step marker, connected by a hairline. */}
              <span
                aria-hidden="true"
                className="relative flex shrink-0 flex-col items-center"
              >
                <span className="num grid size-7 place-items-center rounded-full border border-primary/40 bg-primary/10 text-xs text-primary">
                  {i + 1}
                </span>
                {i < steps.length - 1 && (
                  <span className="mt-1 w-px flex-1 bg-edge" />
                )}
              </span>
              <span className="min-w-0 pb-1">
                <span className="block font-medium text-foreground">
                  {step.title}
                </span>
                <span className="mt-1 block text-sm text-muted-foreground">
                  {step.body}
                </span>
              </span>
            </li>
          ))}
        </ol>
        <p className="mt-6 text-sm text-muted-foreground">
          <ServerTrans
            i18nKey="interface:homeContent.howItWorks.more"
            locale={locale}
            components={{
              linkHow: (
                <Link
                  href={href('/how-it-works')}
                  className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary"
                />
              ),
              linkTools: (
                <Link
                  href={href('/tools')}
                  className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary"
                />
              ),
            }}
          />
        </p>
      </Panel>

      <Panel
        level="1"
        as="section"
        eyebrow={t('interface:homeContent.popular.eyebrow')}
        title={t('interface:homeContent.popular.title')}
        titleAs="h2"
      >
        <ul className="grid gap-2 sm:grid-cols-2">
          {popular.map((tool) => (
            <li key={tool.slug}>
              <Link
                href={href(`/tools/${tool.slug}`)}
                className="block rounded-md border border-edge bg-surface-2/40 p-3 transition-colors duration-[var(--dur-base)] ease-[var(--ease-instrument)] hover:border-edge-strong hover:bg-surface-2"
              >
                <span className="block truncate text-sm font-medium text-foreground">
                  {tool.name}
                </span>
                <span className="mt-0.5 block text-xs text-muted-foreground">
                  {tool.tagline}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Panel>

      <Panel
        level="1"
        as="section"
        eyebrow={t('interface:homeContent.whatWeDont.eyebrow')}
        title={t('interface:homeContent.whatWeDont.title')}
        titleAs="h2"
      >
        <ul className="space-y-3 text-sm text-muted-foreground">
          {notDone.map((item) => (
            <li key={item}>
              <ServerTrans i18nKey="_inline" defaults={item} locale={locale} components={{ strong: <strong className="text-foreground" /> }} />
            </li>
          ))}
        </ul>
      </Panel>

      <Panel
        level="1"
        as="section"
        eyebrow={t('interface:homeContent.whoMakes.eyebrow')}
        title={t('interface:homeContent.whoMakes.title')}
        titleAs="h2"
      >
        <p className="text-sm text-muted-foreground">
          <ServerTrans
            i18nKey="interface:homeContent.whoMakes.body"
            locale={locale}
            components={{ linkAbout: link('/about'), linkContact: link('/contact') }}
          />
        </p>
      </Panel>
    </div>
  );
}

export default HomeContent;
