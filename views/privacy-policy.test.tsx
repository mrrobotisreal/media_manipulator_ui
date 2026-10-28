/**
 * MM87 acceptance 1: the Privacy Policy renders Google's opt-out and partner-sites URLs
 * as real links (decision 1(d)) in every locale, with sentence punctuation kept outside.
 */
import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';

import { locales } from '@/i18n/locales';
import { linkifyLegal } from '@/components/legal/linkify';

import PrivacyPolicyPage from './privacy-policy';

const LINKS = [
  'https://adssettings.google.com',
  'https://www.aboutads.info/choices',
  'https://youronlinechoices.eu',
  'https://policies.google.com/technologies/partner-sites',
  'https://policies.google.com/technologies/cookies',
  'https://www.media-manipulator.com/ads.txt',
];

describe('/privacy-policy advertising links (MM87)', () => {
  it('en-US shows the vendor-cookie sentence', () => {
    const html = renderToStaticMarkup(<PrivacyPolicyPage locale="en-US" />);
    expect(html).toContain('Google, as a third-party vendor, uses cookies to serve ads on Media Manipulator');
    expect(html).toContain('5.1 Advertising cookies and Google AdSense');
  });

  for (const { code } of locales) {
    it(`${code}: every advertising URL is an anchor`, () => {
      const html = renderToStaticMarkup(<PrivacyPolicyPage locale={code} />);
      for (const url of LINKS) expect(html, url).toContain(`href="${url}"`);
    });
  }
});

describe('linkifyLegal', () => {
  const render = (text: string) => renderToStaticMarkup(<p>{linkifyLegal(text)}</p>);

  it('leaves text without a URL untouched', () => {
    expect(linkifyLegal('No links here.')).toBe('No links here.');
  });

  it('keeps trailing punctuation and following non-ASCII text outside the link', () => {
    expect(render('See https://www.media-manipulator.com/ads.txt.')).toContain(
      '<a href="https://www.media-manipulator.com/ads.txt" target="_blank" rel="noopener noreferrer"',
    );
    expect(render('See https://www.media-manipulator.com/ads.txt.')).toMatch(/<\/a>\.<\/p>$/);
    expect(render('https://youronlinechoices.eu（欧州連合）')).toMatch(/<\/a>（欧州連合）<\/p>$/);
    expect(render('a https://adssettings.google.com, b https://www.aboutads.info/choices;')).toMatch(
      /href="https:\/\/adssettings\.google\.com".*<\/a>, b <a href="https:\/\/www\.aboutads\.info\/choices".*<\/a>;<\/p>$/,
    );
  });
});
