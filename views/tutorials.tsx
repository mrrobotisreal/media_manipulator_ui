import React from 'react';
import Link from 'next/link';
import { Aperture, Bot, Music, Image as ImageIcon, Spline, Video as VideoIcon } from 'lucide-react';
import { PHOTO_BRAND } from '@/lib/photo/brand';
import { getServerT } from '@/lib/i18n/server';
import { localizeHref } from '@/i18n/locales';
import { Panel } from '@/components/darkroom/panel';
import { PageFaq } from '@/components/page-faq';
import { TUTORIAL_DATES } from '@/content/pageDates';
import { TUTORIAL_GOALS, TUTORIAL_INDEX, type TutorialGoal, type TutorialIndexEntry } from '@/content/tutorialIndex';
import { formatArticleDate } from '@/components/articles/article-byline';

const GOAL_ICONS: Record<TutorialGoal, React.ReactNode> = {
  files: <ImageIcon className="w-7 h-7 text-premium" />,
  video: <VideoIcon className="w-7 h-7 text-data" />,
  photo: <Aperture className="w-7 h-7 text-data" />,
  audio: <Music className="w-7 h-7 text-primary" />,
  motion: <Spline className="w-7 h-7 text-data" />,
  assistant: <Bot className="w-7 h-7 text-data" />,
};

const NEWEST_COUNT = 4;
const brand = { values: { brand: PHOTO_BRAND } };

/**
 * The tutorials index. Both the "newest" strip and the goal groups are built from `TUTORIAL_INDEX` and
 * `TUTORIAL_DATES`, so publishing a tutorial adds it here with no edit to this file.
 */
const TutorialsPage: React.FC<{ locale?: string }> = ({ locale }) => {
  const t = getServerT('interface', locale);
  const loc = locale ?? 'en-US';

  const card = (e: TutorialIndexEntry, withDate: boolean) => (
    <Panel level="2" muted as="article" key={e.path} className="lg:p-6 transition-shadow">
      <h3 className="text-xl font-semibold mb-2 text-card-foreground hover:text-data">
        <Link href={localizeHref(e.path, loc)}>{t(`tutorials.tutorials.${e.key}.title`, brand)}</Link>
      </h3>
      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-3">
        <span>{t(`tutorials.tutorials.${e.key}.readTime`)}</span>
        {withDate ? (
          <time dateTime={TUTORIAL_DATES[e.path].datePublished}>
            {t('tutorials.atLink', { values: { date: formatArticleDate(TUTORIAL_DATES[e.path].datePublished, loc) } })}
          </time>
        ) : null}
      </div>
      <p className="text-muted-foreground mb-4">{t(`tutorials.tutorials.${e.key}.excerpt`, brand)}</p>
      <Link href={localizeHref(e.path, loc)} className="text-data hover:text-data font-medium">
        {t('tutorials.readTutorial')}
      </Link>
    </Panel>
  );

  const newest = [...TUTORIAL_INDEX]
    .sort((a, b) => TUTORIAL_DATES[b.path].datePublished.localeCompare(TUTORIAL_DATES[a.path].datePublished))
    .slice(0, NEWEST_COUNT);
  const groups = TUTORIAL_GOALS.map((goal) => ({ goal, entries: TUTORIAL_INDEX.filter((e) => e.goal === goal) })).filter(
    (g) => g.entries.length > 0,
  );
  const howItems = t('tutorials.how.items', { returnObjects: true }) as string[];
  const howParagraphs = t('tutorials.how.paragraphs', { returnObjects: true }) as string[];
  const faq = t('tutorials.faq.items', { returnObjects: true }) as Array<{ q: string; a: string }>;

  return (
    <>
      <div className="px-4 sm:px-6"><Panel level="1" className="max-w-7xl mx-auto my-2">
          <h1 className="text-4xl font-bold mb-4 text-card-foreground">{t('tutorials.title')}</h1>
          <p className="text-lg text-muted-foreground mb-4">{t('tutorials.intro')}</p>
          <p className="text-muted-foreground mb-8">{t('tutorials.intro2')}</p>

          <Panel level="2" as="section" className="mb-10" data-testid="tutorials-newest">
            <h2 className="text-2xl font-semibold text-card-foreground">{t('tutorials.newest.title')}</h2>
            <p className="text-muted-foreground mt-1 mb-4">{t('tutorials.newest.intro')}</p>
            <div className="grid gap-4 md:grid-cols-2">{newest.map((e) => card(e, true))}</div>
          </Panel>

          <h2 className="text-2xl font-semibold mb-2 text-card-foreground">{t('tutorials.goalsTitle')}</h2>
          <p className="text-muted-foreground mb-6">{t('tutorials.goalsIntro')}</p>

          <div className="grid gap-10">
            {groups.map(({ goal, entries }) => (
              <React.Fragment key={goal}>
                <Panel level="2" as="section" data-goal={goal}>
                  <div className="flex items-start gap-4 mb-4">
                    <div className="shrink-0 mt-1">{GOAL_ICONS[goal]}</div>
                    <div>
                      <h3 className="text-2xl font-semibold text-card-foreground">{t(`tutorials.goals.${goal}.title`)}</h3>
                      <p className="text-muted-foreground mt-1">{t(`tutorials.goals.${goal}.description`, brand)}</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        <strong>{t('tutorials.startHere')}</strong> {t(`tutorials.goals.${goal}.start`)}
                      </p>
                    </div>
                  </div>
                  <div className="grid gap-4 mt-4">{entries.map((e) => card(e, false))}</div>
                </Panel>
              </React.Fragment>
            ))}
          </div>

          <Panel level="2" as="section" className="mt-10" data-testid="tutorials-how">
            <h2 className="text-2xl font-semibold mb-3 text-card-foreground">{t('tutorials.how.title')}</h2>
            {howParagraphs.map((p) => (
              <p key={p} className="text-muted-foreground mb-3">{p}</p>
            ))}
            <ul className="list-disc ps-6 space-y-1 text-muted-foreground mb-3">
              {howItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="text-muted-foreground">{t('tutorials.how.limitsNote')}</p>
          </Panel>

          <Panel level="2" as="section" className="mt-10">
            <PageFaq title={t('tutorials.faq.title')} items={faq} id="tutorials-faq" />
          </Panel>

          <Panel level="1" accent="data" className="mt-10">
            <h2 className="text-2xl font-semibold mb-3 text-card-foreground">{t('tutorials.newToHere.title')}</h2>
            <p className="text-muted-foreground mb-4">{t('tutorials.newToHere.body')}</p>
            <div className="flex flex-wrap gap-3">
              <Link
                href={localizeHref('/how-it-works', loc)}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-[var(--accent-primary-hover)] transition-colors"
              >
                {t('tutorials.newToHere.ctaHow')}
              </Link>
              <Link
                href={localizeHref('/', loc)}
                className="bg-card border border-border text-card-foreground px-4 py-2 rounded-lg hover:bg-muted transition-colors"
              >
                {t('tutorials.newToHere.ctaConvert')}
              </Link>
            </div>
          </Panel>
        
      </Panel></div>
    </>
  );
};

export default TutorialsPage;
