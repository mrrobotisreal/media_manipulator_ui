import React from 'react';
import Link from 'next/link';
import { getServerT } from '@/lib/i18n/server';
import { Panel } from '@/components/darkroom/panel';

const QUICK_LINKS: { key: string; to: string }[] = [
  { key: 'home', to: '/' },
  { key: 'tools', to: '/tools' },
  // Hidden during AdSense review — re-enable when the blog returns.
  // { key: 'blog', to: '/blog' },
  { key: 'tutorials', to: '/tutorials' },
];

const NotFoundPage: React.FC = () => {
  // Keys here are namespace-qualified (`interface:` / `accessibility:`), which
  // the server resolver handles directly.
  const t = getServerT();
  return (
    <>
      <div className="px-4 sm:px-6"><Panel level="1" className="max-w-3xl mx-auto my-12"><div className="text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">
            {t('interface:notFound.preTitle')}
          </p>
          <h1
            className="num text-[5rem] md:text-[8rem] leading-none text-card-foreground"
            aria-label="404"
          >
            404
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-card-foreground mt-4">
            {t('interface:notFound.title')}
          </h2>
          <p className="text-muted-foreground mt-3">
            {t('interface:notFound.body')}
          </p>

          <nav
            aria-label={t('accessibility:notFound.recoveryRoutes')}
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            {QUICK_LINKS.map((link) => (
              <Link
                key={link.to}
                href={link.to}
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-[var(--accent-primary-hover)] transition-colors text-sm"
              >
                {t(`interface:notFound.links.${link.key}`)}
              </Link>
            ))}
          </nav>
        </div>
      </Panel></div>
    </>
  );
};

export default NotFoundPage;
