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
import { ADSENSE_ENABLED } from '@/lib/adsenseConfig';
import { requestConsentReview } from '@/lib/consent';

const NAV_LINK_KEYS: { key: string; href: string; label?: string }[] = [
  { key: 'home', href: '/' },
  { key: 'tools', href: '/tools' },
  { key: 'contentStudio', href: '/tools/content-studio', label: 'Content Studio' },
  { key: 'blog', href: '/blog' },
  { key: 'tutorials', href: '/tutorials' },
  { key: 'howItWorks', href: '/how-it-works' },
  { key: 'about', href: '/about' },
  { key: 'pricing', href: '/pricing', label: 'Pricing' },
];

const LEGAL_LINK_KEYS: { key: string; href: string }[] = [
  { key: 'privacyPolicy', href: '/privacy-policy' },
  { key: 'termsOfService', href: '/terms-of-service' },
];

const Footer: React.FC = () => {
  const [cookiePromptOpen, setCookiePromptOpen] = useState(false);
  const { t } = useLocalization(['interface', 'accessibility']);

  // Withdrawing consent has to be as easy as giving it, so this button tries
  // the three routes in order of authority:
  //
  //   1. Funding Choices, which exposes window.googlefc once the AdSense script
  //      has loaded and Privacy & messaging is on. When it is present it owns
  //      TCF state for ADS and is the only correct place to revoke those — a GDPR
  //      and AdSense requirement, and why it stays first. Kept for the Phase 12
  //      handover; it is unreachable while the review build ships no ad script.
  //   2. Otherwise the first-party preferences centre, which is what actually
  //      asked. `requestConsentReview()` now opens the PREFERENCES DIALOG rather
  //      than re-showing the banner: someone clicking a settings link wants to
  //      see and adjust their current state, not answer the first-visit question
  //      again with no indication of what they chose last time.
  //   3. Otherwise the explainer, for the narrow case where ads are enabled but
  //      Funding Choices never arrived (blocked script, dashboard misconfigured).
  //      Doing nothing at all would be the wrong failure for this control.
  const handleCookieSettings = () => {
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
      // Fall through.
    }
    if (!ADSENSE_ENABLED) {
      requestConsentReview();
      return;
    }
    setCookiePromptOpen(true);
  };

  return (
    <footer data-site-footer className="w-full border-t border-edge bg-surface-0 text-muted-foreground">
      <div className="container mx-auto px-4 py-8 sm:py-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            {/* min-w-0 matters: without it flex's `min-width: auto` stops the
                lockup shrinking and it overflows below ~400px.

                The tagline sits outside the anchor. It is not part of the
                link's purpose, and while it was inside, the `aria-label`
                replaced it in the accessible name — which fails WCAG 2.5.3
                Label in Name. With only the wordmark inside, "Media Manipulator
                home" properly contains the visible text. */}
            <div className="mb-3 flex min-w-0 flex-col">
              <Link
                href="/"
                className="flex items-center space-x-3 hover:opacity-90 transition-opacity"
                aria-label={t('accessibility:footer.homeLink')}
              >
                <Wordmark size="lg" animated text={t('interface:common.brand')} />
              </Link>
              <span className="mt-1 truncate text-sm text-muted-foreground">
                {t('interface:common.brandTagline')}
              </span>
            </div>
            <p className="text-sm text-muted-foreground max-w-md">
              {t('interface:footer.tagline')}
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              {t('interface:footer.contact')}{' '}
              <a
                href="mailto:support@media-manipulator.com"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                support@media-manipulator.com
              </a>
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-3">
              {t('interface:footer.explore')}
            </h3>
            <ul className="space-y-2">
              {NAV_LINK_KEYS.map(link => (
                <li key={link.key}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label ?? t(`interface:topNav.${link.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-3">
              {t('interface:footer.legal')}
            </h3>
            <ul className="space-y-2">
              {LEGAL_LINK_KEYS.map(link => (
                <li key={link.key}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {t(`interface:topNav.${link.key}`)}
                  </Link>
                </li>
              ))}
              <li>
                {/*
                  A SEPARATE link from "Cookie settings", by the literal name CPRA
                  §1798.135 requires: "Do Not Sell or Share My Personal Information".
                  The statute names the link, so paraphrasing it or folding it into a
                  generic settings entry does not satisfy it — even though, here, both
                  open the same dialog. Rendered unconditionally rather than only for
                  US visitors: region detection is best-effort, and a missing link is a
                  compliance failure while an extra one costs a line of text.
                */}
                <button
                  type="button"
                  onClick={requestConsentReview}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors text-left"
                >
                  {t('interface:footer.doNotSell')}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={handleCookieSettings}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors text-left"
                >
                  {t('interface:footer.cookieSettings')}
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-edge flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            {t('interface:footer.copyright', { year: new Date().getFullYear() })}
          </p>
          <p className="text-xs text-muted-foreground">
            {t('interface:footer.operatedBy')}
          </p>
        </div>
      </div>

      <Dialog open={cookiePromptOpen} onOpenChange={setCookiePromptOpen}>
        {/* Wider than the 512px default, but deliberately not as wide as the
            account panel: this is a title and two sentences. Body copy reads
            best at 65–75 characters, and stretching a short explainer to 1400px
            would trade one legibility problem for another. */}
        <DialogContent className="sm:max-w-xl md:max-w-2xl">
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
