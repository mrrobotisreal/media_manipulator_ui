import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import formatterIcon from '/MMIcon.webp';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const navLinks: { title: string; href: string }[] = [
  { title: 'Home', href: '/' },
  { title: 'Tools', href: '/tools' },
  { title: 'Blog', href: '/blog' },
  { title: 'Tutorials', href: '/tutorials' },
  { title: 'How it works', href: '/how-it-works' },
  { title: 'About', href: '/about' },
];

const legalLinks: { title: string; href: string }[] = [
  { title: 'Privacy Policy', href: '/privacy-policy' },
  { title: 'Terms of Service', href: '/terms-of-service' },
];

const Footer: React.FC = () => {
  const [cookiePromptOpen, setCookiePromptOpen] = useState(false);

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
    <footer className="w-full bg-black text-gray-300 sci-fi-frame-top">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center space-x-3 mb-3 hover:opacity-90 transition-opacity" aria-label="Media Manipulator home">
              <img
                src={formatterIcon}
                alt="Media Manipulator Icon"
                className="h-20 w-20 rounded-sm"
              />
              <div className="flex flex-col">
                <span className="font-glitch text-4xl text-white">Media Manipulator</span>
                <span className="text-sm text-gray-400">Convert images, videos, and audio files with ease</span>
              </div>
            </Link>
            <p className="text-sm text-gray-400 max-w-md">
              Browser-based and server-assisted tools for editing, converting, compressing, analyzing,
              transcribing, summarizing, and otherwise processing image, video, and audio files.
            </p>
            <p className="text-sm text-gray-400 mt-4">
              Contact:{' '}
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
              Explore
            </h3>
            <ul className="space-y-2">
              {navLinks.map(link => (
                <li key={link.title}>
                  <Link
                    to={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
              Legal
            </h3>
            <ul className="space-y-2">
              {legalLinks.map(link => (
                <li key={link.title}>
                  <Link
                    to={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={handleCookieSettings}
                  className="text-sm text-gray-400 hover:text-white transition-colors text-left"
                >
                  Cookie settings
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-800 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <p className="text-xs text-gray-400">
            &copy; 2026 Media Manipulator, a CreaTV Ltd. product. All rights reserved.
          </p>
          <p className="text-xs text-gray-500">
            Operated by CreaTV Ltd. &middot; Colorado, USA
          </p>
        </div>
      </div>

      <Dialog open={cookiePromptOpen} onOpenChange={setCookiePromptOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cookie preferences</DialogTitle>
            <DialogDescription>
              Cookie preferences are managed by Google. Please reload the page if the cookie banner does not appear, or visit our Privacy Policy for details on how Media Manipulator processes data.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </footer>
  );
};

export default Footer;
