'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { useLocalization } from '@/i18n/useLocalization';

const QUICK_LINKS: { key: string; to: string }[] = [
  { key: 'home', to: '/' },
  { key: 'tools', to: '/tools' },
  // Hidden during AdSense review — re-enable when the blog returns.
  // { key: 'blog', to: '/blog' },
  { key: 'tutorials', to: '/tutorials' },
];

const NotFoundPage: React.FC = () => {
  const { t } = useLocalization(['interface', 'accessibility']);
  return (
    <>
      <Card className="max-w-3xl mx-auto my-12 sci-fi-frame">
        <CardContent className="p-10 md:p-12 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">
            {t('interface:notFound.preTitle')}
          </p>
          <h1
            className="font-glitch text-[5rem] md:text-[8rem] leading-none text-card-foreground"
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
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors text-sm"
              >
                {t(`interface:notFound.links.${link.key}`)}
              </Link>
            ))}
          </nav>
        </CardContent>
      </Card>
    </>
  );
};

export default NotFoundPage;
