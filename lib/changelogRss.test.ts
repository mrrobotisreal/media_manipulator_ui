import { describe, expect, it } from 'vitest';
import { buildChangelogRss, toRfc822 } from './changelogRss';
import { CHANGELOG } from '@/content/changelog';

describe('changelog data', () => {
  it('is newest first with unique ids and real merge dates', () => {
    const dates = CHANGELOG.map((e) => e.date);
    expect([...dates].sort().reverse()).toEqual(dates);
    expect(new Set(CHANGELOG.map((e) => e.id)).size).toBe(CHANGELOG.length);
    // 2026-10-25: MM39 (Pro API) merged to API main and MM40 to UI.
    for (const d of dates) expect(['2026-10-23', '2026-10-24', '2026-10-25']).toContain(d);
  });

  it('does not announce email as being sent (sending is off until configured)', () => {
    expect(JSON.stringify(CHANGELOG).toLowerCase()).not.toMatch(/we (will )?email you|we send you an email/);
  });
});

describe('changelog RSS', () => {
  const xml = buildChangelogRss();

  it('is RSS 2.0 with a prolog and balanced items', () => {
    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
    expect(xml).toContain('<rss version="2.0"');
    expect(xml.match(/<item>/g)).toHaveLength(CHANGELOG.length);
    expect(xml.match(/<\/item>/g)).toHaveLength(CHANGELOG.length);
    expect(xml.trimEnd().endsWith('</rss>')).toBe(true);
  });

  it('has no unescaped ampersands or stray angle brackets in text', () => {
    const texts = [...xml.matchAll(/<(?:title|description)>([^<]*)<\/(?:title|description)>/g)].map((m) => m[1]);
    expect(texts.length).toBeGreaterThan(CHANGELOG.length);
    for (const t of texts) expect(t).not.toMatch(/&(?!amp;|lt;|gt;|quot;|apos;)/);
  });

  it('lists entries newest first with RFC-822 dates', () => {
    const pubs = [...xml.matchAll(/<pubDate>([^<]+)<\/pubDate>/g)].map((m) => m[1]);
    expect(pubs).toHaveLength(CHANGELOG.length);
    for (const p of pubs) {
      expect(p).toMatch(/^[A-Z][a-z]{2}, \d{2} [A-Z][a-z]{2} \d{4} \d{2}:\d{2}:\d{2} GMT$/);
    }
    const times = pubs.map((p) => Date.parse(p));
    expect([...times].sort((a, b) => b - a)).toEqual(times);
    expect(toRfc822('2026-10-24')).toBe('Sat, 24 Oct 2026 12:00:00 GMT');
  });

  it('uses absolute URLs only', () => {
    const links = [...xml.matchAll(/<(?:link|guid[^>]*)>([^<]+)</g)].map((m) => m[1]);
    expect(links.length).toBeGreaterThan(CHANGELOG.length);
    for (const l of links) expect(l).toMatch(/^https:\/\/www\.media-manipulator\.com\//);
  });
});
