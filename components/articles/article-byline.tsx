import Image from 'next/image';
import Link from 'next/link';

import { TUTORIAL_DATES, type TutorialPath } from '@/content/pageDates';
import { localizeHref } from '@/i18n/locales';
import { getServerT } from '@/lib/i18n/server';
import { FOUNDER_NAME } from '@/lib/seo';

/**
 * MM85: the byline under a tutorial's H1: the founder's photo and name (linked
 * to /about), the publication date and, when it differs, the last-edit date.
 * Dates are the git-derived ones in content/pageDates.ts, the same values the
 * TechArticle JSON-LD and the sitemap carry.
 */
export function formatArticleDate(iso: string, locale: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  try {
    return new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }).format(d);
  } catch {
    return iso;
  }
}

export function TutorialByline({ path, locale }: { path: TutorialPath; locale?: string }) {
  const loc = locale ?? 'en-US';
  const t = getServerT('interface', loc);
  const { datePublished, dateModified } = TUTORIAL_DATES[path];
  return (
    <div className="not-prose mb-8 flex items-center gap-3" data-testid="article-byline">
      <Image src="/ProfilePic.webp" alt="" width={40} height={40} className="size-10 rounded-full border border-edge object-cover" />
      <div className="text-sm">
        <p className="font-medium text-card-foreground">
          <Link href={localizeHref('/about', loc)} rel="author" className="hover:underline">
            {t('articleMeta.byline', { values: { name: FOUNDER_NAME } })}
          </Link>
        </p>
        <p className="text-muted-foreground">
          <time dateTime={datePublished}>{t('articleMeta.published', { values: { date: formatArticleDate(datePublished, loc) } })}</time>
          {dateModified !== datePublished ? (
            <>
              {' · '}
              <time dateTime={dateModified}>{t('articleMeta.updated', { values: { date: formatArticleDate(dateModified, loc) } })}</time>
            </>
          ) : null}
        </p>
      </div>
    </div>
  );
}

/**
 * MM85 decision 6: one screenshot of the real UI per tutorial. No PNGs were
 * supplied (ticket log), so this is a captioned slot with the final alt text;
 * when `public/tutorials/<slug>.png` lands, pass `src` and it renders the image.
 */
export type ScreenshotKey = 'audioGettingStarted' | 'videoGettingStarted' | 'imageGettingStarted' | 'aiFrameInterpolation' | 'motion';

export function TutorialScreenshot({ k, locale, src }: { k: ScreenshotKey; locale?: string; src?: string }) {
  const t = getServerT('interface', locale ?? 'en-US');
  const alt = t(`articleMeta.screenshots.${k}.alt`);
  return (
    <figure className="not-prose my-6" data-testid="tutorial-screenshot" data-screenshot={k}>
      {src ? (
        <Image src={src} alt={alt} width={1280} height={720} className="w-full rounded-lg border border-border" />
      ) : (
        <div
          role="img"
          aria-label={alt}
          className="flex aspect-video w-full items-center justify-center rounded-lg border border-dashed border-edge bg-surface-2/40 p-6 text-center text-sm text-muted-foreground"
        >
          {alt}
        </div>
      )}
      <figcaption className="mt-2 text-center text-sm text-muted-foreground">{t(`articleMeta.screenshots.${k}.caption`)}</figcaption>
    </figure>
  );
}
