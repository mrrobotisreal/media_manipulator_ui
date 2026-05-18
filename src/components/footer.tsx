import React from 'react';
import { Link } from 'react-router-dom';
import formatterIcon from '/MMIcon.webp';

const navLinks: { title: string; href: string }[] = [
  { title: 'Home', href: '/' },
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
  return (
    <footer className="w-full bg-black text-gray-300 sci-fi-frame-top">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-3">
              <img
                src={formatterIcon}
                alt="Media Manipulator Icon"
                className="h-20 w-20 rounded-sm"
              />
              <div className="flex flex-col">
                <h1 className="font-glitch text-4xl text-white">Media Manipulator</h1>
                <p className="text-sm text-gray-400">Convert images, videos, and audio files with ease</p>
              </div>
            </div>
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
    </footer>
  );
};

export default Footer;
