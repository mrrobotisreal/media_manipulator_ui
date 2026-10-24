import React from 'react';
import Link from 'next/link';
import { Panel } from '@/components/darkroom/panel';
import { CHANGELOG, type ChangelogTag } from '@/content/changelog';
import { getServerT } from '@/lib/i18n/server';
import { localizeHref } from '@/i18n/locales';

const TAG_KEYS: Record<ChangelogTag, string> = {
  new: 'changelog.new',
  improved: 'changelog.improved',
  fixed: 'changelog.fixed',
};

// Chrome (headings, tag labels, dates) is localized; the entry text is English
// by decision (MM34), and the page says so.
const ChangelogPage: React.FC<{ locale?: string }> = ({ locale }) => {
  const t = getServerT('interface', locale);
  const loc = locale ?? 'en-US';
  const formatDate = (iso: string) => {
    try {
      return new Intl.DateTimeFormat(loc, { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }).format(
        new Date(`${iso}T12:00:00Z`),
      );
    } catch {
      return iso;
    }
  };

  return (
    <div className="px-4 sm:px-6">
      <Panel level="1" as="section" className="max-w-3xl mx-auto my-2">
        <h1 className="text-4xl font-bold mb-3 text-card-foreground">{t('changelog.title')}</h1>
        <p className="text-lg text-muted-foreground mb-2">{t('changelog.intro')}</p>
        <p className="text-sm text-muted-foreground mb-6">
          {t('changelog.note')}{' '}
          <a href="/changelog.xml" className="underline underline-offset-2 hover:text-foreground">
            {t('changelog.subscribe')}
          </a>
        </p>
        <ol className="space-y-8">
          {CHANGELOG.map((entry) => (
            <li key={entry.id} id={entry.id} className="border-t border-edge pt-6 scroll-mt-20">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <time dateTime={entry.date} className="text-sm text-muted-foreground">
                  {formatDate(entry.date)}
                </time>
                {entry.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded border border-edge px-1.5 py-0.5 text-xs uppercase tracking-wide text-muted-foreground"
                  >
                    {t(TAG_KEYS[tag])}
                  </span>
                ))}
              </div>
              <h2 lang="en" dir="ltr" className="text-xl font-semibold text-card-foreground mb-2">
                {entry.title}
              </h2>
              <p lang="en" dir="ltr" className="text-muted-foreground">
                {entry.body}
              </p>
              {entry.links?.length ? (
                <p className="mt-2 text-sm" lang="en" dir="ltr">
                  {entry.links.map((l, i) => (
                    <React.Fragment key={l.href}>
                      {i > 0 ? ' · ' : null}
                      <Link href={localizeHref(l.href, loc)} className="underline underline-offset-2">
                        {l.label}
                      </Link>
                    </React.Fragment>
                  ))}
                </p>
              ) : null}
            </li>
          ))}
        </ol>
      </Panel>
    </div>
  );
};

export default ChangelogPage;
