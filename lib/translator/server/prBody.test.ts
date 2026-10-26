/**
 * MM54 decisions 6k, 7, 13: PR title/body/branch name. Pure.
 */
// @vitest-environment node
import { describe, expect, it } from 'vitest';

import { branchName, BRANCH_RE, descriptionHead, mdCell, mdText, prBody, prTitle, shortUid, slugify, type PrChangeRow } from './prBody';

const row = (i: number, value = `Wert ${i}`): PrChangeRow => ({
  file: 'i18n/locales/de-de/interface/pages.json',
  key: `k.${i}`,
  old: `Value ${i}`,
  value,
  isNew: false,
  seenOn: [],
});

describe('PR title and branch', () => {
  it('title = i18n(<prefix>): first line, whitespace collapsed, <= 60 chars', () => {
    expect(prTitle('pt-br', '  Fix   the\tupload page \n\nmore details')).toBe('i18n(pt-br): Fix the upload page');
    const head = descriptionHead('x'.repeat(100));
    expect([...head].length).toBe(60);
    expect(head.endsWith('…')).toBe(true);
  });

  it('slug: kebab-case of the first 6 words, ASCII-folded, <= 40 chars; "update" when nothing survives', () => {
    expect(slugify('Übersetze die Überschrift der Startseite und mehr Wörter hier')).toBe('ubersetze-die-uberschrift-der-startseite');
    expect(slugify('日本語の説明')).toBe('update');
    expect(slugify('Fix: "quotes" & <tags>!')).toBe('fix-quotes-tags');
    expect(slugify('a'.repeat(80)).length).toBeLessThanOrEqual(40);
  });

  it('branch: i18n/<prefix>/<yyyymmdd-hhmm>-<slug>[-n] in UTC, always matching the ref pattern', () => {
    const at = new Date(Date.UTC(2026, 9, 26, 7, 5));
    expect(branchName('de', 'Fix the hero', at)).toBe('i18n/de/20261026-0705-fix-the-hero');
    expect(branchName('zh-cn', '日本語', at, 3)).toBe('i18n/zh-cn/20261026-0705-update-3');
    for (const d of ['../../main', 'refs/heads/main', '-- --force', '~^:?*[\\']) expect(branchName('de', d, at)).toMatch(BRANCH_RE);
    expect(() => branchName('DE', 'x', at)).toThrow();
    expect(() => branchName('de/../main', 'x', at)).toThrow();
  });

  it('uid prefix: 8 alphanumerics', () => {
    expect(shortUid('aB3dE5gH9jK')).toBe('aB3dE5gH');
    expect(shortUid('../<>@x')).toBe('x');
    expect(shortUid('')).toBe('unknown');
  });
});

describe('PR body', () => {
  it('section order: description, Changes, Pages, conflicts, warnings, footer', () => {
    const body = prBody({
      prefix: 'de',
      description: 'Line one\nLine two',
      rows: [{ ...row(1), seenOn: ['/de/tools/x'] }],
      origin: 'https://de.translate.media-manipulator.com',
      conflicts: [{ id: 'f|k', file: 'f', key: 'k', base: 'a', theirs: 'b', mine: 'c' }],
      warnings: [{ id: 'k#empty', code: 'empty', key: 'k', message: 'm' }],
      uid: 'uid12345678',
    });
    const order = ['> Line one  \n> Line two', '### Changes', '### Pages', '### Upstream conflicts resolved', '### Validator warnings acknowledged', 'Submitted by translator uid12345'];
    const idx = order.map((s) => body.indexOf(s));
    expect(idx.every((i) => i >= 0)).toBe(true);
    expect([...idx].sort((a, b) => a - b)).toEqual(idx);
    expect(body).toContain('- k.1: <https://de.translate.media-manipulator.com/de/tools/x>');
  });

  it('values are truncated to 120 chars with an ellipsis; pipes and newlines cannot break the table', () => {
    expect(mdCell('a|b\nc')).toBe('a\\|b<br>c');
    const long = mdCell('y'.repeat(300));
    expect([...long].length).toBe(121);
    expect(long.endsWith('…')).toBe(true);
  });

  it('the table is capped at 200 rows with "…and N more"', () => {
    const body = prBody({ prefix: 'de', description: 'd', rows: Array.from({ length: 250 }, (_, i) => row(i)), origin: 'o', conflicts: [], warnings: [], uid: 'u' });
    expect(body.match(/^\| interface\/pages\.json/gm)).toHaveLength(200);
    expect(body).toContain('…and 50 more (the full list is in the diff).');
    expect(body.length).toBeLessThan(65_536);
  });

  it('huge values stay under GitHub\'s body limit', () => {
    const body = prBody({ prefix: 'de', description: 'z'.repeat(2000), rows: Array.from({ length: 2000 }, (_, i) => row(i, 'v'.repeat(20000))), origin: 'o', conflicts: [], warnings: [], uid: 'u' });
    expect(body.length).toBeLessThan(65_536);
  });

  it('mdText neutralises HTML, links, mentions, issue refs and autolinks', () => {
    const t = mdText('<a href="x">@user #12 [l](u) https://x.y www.z.com</a>');
    expect(t).not.toMatch(/<a|@user|#12|\]\(|https:\/\/|www\./);
  });
});
