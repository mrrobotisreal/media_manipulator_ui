'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useLocalization } from '@/i18n/useLocalization';
import { Wordmark } from '@/components/darkroom/wordmark';

const NAV_LINK_KEYS: { key: string; href: string; label?: string }[] = [
  { key: 'home', href: '/' },
  { key: 'tools', href: '/tools' },
  { key: 'contentStudio', href: '/tools/content-studio', label: 'Content Studio' },
  { key: 'blog', href: '/blog' },
  { key: 'tutorials', href: '/tutorials' },
  { key: 'howItWorks', href: '/how-it-works' },
  { key: 'about', href: '/about' },
];

const LEGAL_LINK_KEYS: { key: string; href: string }[] = [
  { key: 'privacyPolicy', href: '/privacy-policy' },
  { key: 'termsOfService', href: '/terms-of-service' },
];

const Footer: React.FC = () => {
  const [cookiePromptOpen, setCookiePromptOpen] = useState(false);
  const { t } = useLocalization(['interface', 'accessibility']);

  const handleCookieSettings = () => {
    // Funding Choices exposes window.googlefc once the AdSense script has
    // loaded and Privacy & messaging is enabled in the dashboard. Calling
    // showRevocationMessage re-opens the consent banner.
    try {
      const fc = typeof window !== 'undefined' ? window.googlefc : undefined;
      if (fc?.callbackQueue && typeof fc.showRevocationMessage === 'function') {
        fc.callbackQueue.push(() => {
          try {
            fc.showRevocationMessage?.();
          } catch {
            setCookiePromptOpen(true);
          }
        });
        return;
      }
    } catch {
      // Fall through to dialog fallback.
    }
    setCookiePromptOpen(true);
  };

  return (
    <footer data-site-footer className="w-full bg-black text-gray-300 border-t border-edge">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center space-x-3 mb-3 hover:opacity-90 transition-opacity" aria-label={t('accessibility:footer.homeLink')}>
              {/* min-w-0 matters: without it flex's `min-width: auto` stops the
                  lockup shrinking and it overflows below ~400px. */}
              <div className="flex min-w-0 flex-col">
                <Wordmark size="lg" text={t('interface:common.brand')} />
                <span className="mt-1 truncate text-sm text-muted-foreground">
                  {t('interface:common.brandTagline')}
                </span>
              </div>
            </Link>
            <p className="text-sm text-gray-400 max-w-md">
              {t('interface:footer.tagline')}
            </p>
            <p className="text-sm text-gray-400 mt-4">
              {t('interface:footer.contact')}{' '}
              <a
                href="mailto:support@media-manipulator.com"
                className="text-gray-300 hover:text-white transition-colors"
              >
                support@media-manipulator.com
              </a>
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
              {t('interface:footer.explore')}
            </h3>
            <ul className="space-y-2">
              {NAV_LINK_KEYS.map(link => (
                <li key={link.key}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label ?? t(`interface:topNav.${link.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
              {t('interface:footer.legal')}
            </h3>
            <ul className="space-y-2">
              {LEGAL_LINK_KEYS.map(link => (
                <li key={link.key}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {t(`interface:topNav.${link.key}`)}
                  </Link>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={handleCookieSettings}
                  className="text-sm text-gray-400 hover:text-white transition-colors text-left"
                >
                  {t('interface:footer.cookieSettings')}
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-800 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <p className="text-xs text-gray-400">
            {t('interface:footer.copyright', { year: new Date().getFullYear() })}
          </p>
          <p className="text-xs text-gray-500">
            {t('interface:footer.operatedBy')}
          </p>
        </div>
      </div>

      <Dialog open={cookiePromptOpen} onOpenChange={setCookiePromptOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('interface:footer.cookieDialog.title')}</DialogTitle>
            <DialogDescription>
              {t('interface:footer.cookieDialog.description')}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </footer>
  );
};

export default Footer;
