'use client';

import React from 'react';
import Link from 'next/link';
import { useLocalization } from '@/i18n/useLocalization';
import { useLocalizedHref } from '@/i18n/useLocalizedHref';
import { Wordmark } from '@/components/darkroom/wordmark';
import { requestConsentReview } from '@/lib/consent';
import { showGoogleConsentMessage } from '@/lib/consent/googleConsentMessage';
import { MOTION_BRAND } from '@/lib/vector/brand';

const NAV_LINK_KEYS: { key: string; href: string; label?: string }[] = [
  { key: 'home', href: '/' },
  { key: 'tools', href: '/tools' },
  { key: 'contentStudio', href: '/tools/content-studio', label: 'Darkroom' },
  { key: 'motion', href: '/tools/motion', label: MOTION_BRAND },
  { key: 'voices', href: '/voices' },
  { key: 'blog', href: '/blog' },
  { key: 'tutorials', href: '/tutorials' },
  { key: 'howItWorks', href: '/how-it-works' },
  { key: 'about', href: '/about' },
  // MM85: who runs the site and how to reach them.
  { key: 'contact', href: '/contact' },
  { key: 'pricing', href: '/pricing', label: 'Pricing' },
];

// MM34: footer-only links (not in the header nav, per the ticket).
const FOOTER_EXTRA_LINKS: { key: string; href: string }[] = [
  { key: 'changelog', href: '/changelog' },
  { key: 'status', href: '/status' },
];

const LEGAL_LINK_KEYS: { key: string; href: string; labelKey?: string }[] = [
  { key: 'privacyPolicy', href: '/privacy-policy' },
  { key: 'termsOfService', href: '/terms-of-service' },
  // MM48: MM47's open-source licence notices.
  { key: 'licenses', href: '/licenses', labelKey: 'interface:footer.licenses' },
];

const Footer: React.FC = () => {
  const { t } = useLocalization(['interface', 'accessibility']);
  const localized = useLocalizedHref();

  // Withdrawing consent has to be as easy as giving it, so this button tries
  // the two routes in order of authority (MM82):
  //
  //   1. Funding Choices, which exposes window.googlefc once the ad script has
  //      loaded and Privacy & messaging is on (EEA/UK/CH). When it is present
  //      it owns TCF state for ADS and is the only correct place to revoke
  //      those — a GDPR and AdSense requirement, and why it stays first.
  //   2. Otherwise the first-party preferences centre, which is what actually
  //      asked. `requestConsentReview()` opens the PREFERENCES DIALOG rather
  //      than re-showing the banner: someone clicking a settings link wants to
  //      see and adjust their current state. It is also the fallback when the
  //      Google message throws, so this control never does nothing.
  const handleCookieSettings = () => {
    if (showGoogleConsentMessage(requestConsentReview)) return;
    requestConsentReview();
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
                href={localized('/')}
                className="flex items-center gap-3 hover:opacity-90 transition-opacity"
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
                    href={localized(link.href)}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label ?? t(`interface:topNav.${link.key}`)}
                  </Link>
                </li>
              ))}
              {FOOTER_EXTRA_LINKS.map(link => (
                <li key={link.key}>
                  <Link
                    href={localized(link.href)}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {t(`interface:footer.${link.key}`)}
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
                    href={localized(link.href)}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {t(link.labelKey ?? `interface:topNav.${link.key}`)}
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
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors text-start"
                >
                  {t('interface:footer.doNotSell')}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={handleCookieSettings}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors text-start"
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
    </footer>
  );
};

export default Footer;
