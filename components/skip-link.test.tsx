/**
 * MM88 decision 4: a "Skip to content" link is the first focusable element in both root
 * layouts, it targets `<main id="main" tabIndex={-1}>`, and its label is localized in all
 * 18 locales (`accessibility:skipToContent`). The built-HTML half of this (the link and
 * `id="main"` in `en/tools/compress-image.html`) is checked in the ticket log.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';

import { locales } from '@/i18n/locales';
import { getServerT } from '@/lib/i18n/server';
import { MAIN_CONTENT_ID, SkipLink } from './skip-link';

const ROOT = join(__dirname, '..');
const read = (rel: string) => readFileSync(join(ROOT, rel), 'utf8');

afterEach(cleanup);

describe('MM88 skip link', () => {
  it('links to #main, is visually hidden until focused, then shown at the inline start', () => {
    render(<SkipLink label="Skip to content" />);
    const link = screen.getByRole('link', { name: 'Skip to content' });
    expect(MAIN_CONTENT_ID).toBe('main');
    expect(link.getAttribute('href')).toBe('#main');
    const cls = link.className.split(/\s+/);
    expect(cls).toContain('sr-only');
    expect(cls).toContain('focus:not-sr-only');
    expect(cls).toContain('focus:start-4');
  });

  it.each(['app/(localized)/[lang]/layout.tsx', 'app/(system)/layout.tsx'])(
    '%s renders it as the first element in <body>',
    (file) => {
      const src = read(file);
      const body = src.slice(src.indexOf('<body'));
      const firstElement = body
        .slice(body.indexOf('>') + 1)
        .replace(/\{\/\*[\s\S]*?\*\/\}/g, '')
        .trim();
      expect(firstElement.startsWith('<SkipLink label={getServerT(')).toBe(true);
    },
  );

  it('the target exists in both provider branches: <main id="main"> and the chromeless wrapper', () => {
    const src = read('app/providers.tsx');
    expect(src).toContain('<main id={MAIN_CONTENT_ID} tabIndex={-1}');
    expect(src).toContain('<div id={MAIN_CONTENT_ID} tabIndex={-1}');
  });

  it('the label is translated in every locale (no English fallback outside en)', () => {
    const en = getServerT('accessibility', 'en-US')('skipToContent');
    expect(en).toBe('Skip to content');
    for (const l of locales) {
      const label = getServerT('accessibility', l.code)('skipToContent');
      expect(label, l.code).not.toBe('skipToContent');
      if (l.code !== 'en-US') expect(label, l.code).not.toBe(en);
    }
  });
});
