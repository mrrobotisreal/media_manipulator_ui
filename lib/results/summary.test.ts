import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { formatClock, parseSummary, renderSummaryMarkdown, summaryHistoryLabel, toSeconds } from './summary';

// Byte copies of media_manipulator_api internal/services/testdata/video_summary/summary.{json,md}
// (the API's TestRenderSummaryMarkdownFixture pins the same pair on the server side).
const FIXTURE_JSON = JSON.parse(readFileSync(join(__dirname, 'fixtures', 'summary.json'), 'utf8'));
const FIXTURE_MD = readFileSync(join(__dirname, 'fixtures', 'summary.md'), 'utf8');

describe('renderSummaryMarkdown (copy-as-Markdown contract)', () => {
  it('markdown round trip: the rendered fixture equals the server summary.md byte for byte', () => {
    const summary = parseSummary(FIXTURE_JSON)!;
    expect(renderSummaryMarkdown(summary)).toBe(FIXTURE_MD);
  });

  it('omits empty sections and ends with exactly one newline', () => {
    const md = renderSummaryMarkdown(parseSummary({ title: 'Only a title', summary: 'One line.' })!);
    expect(md).toBe('# Only a title\n\nOne line.\n');
  });

  it('a chapter without a description has no trailing colon; an empty title falls back', () => {
    const md = renderSummaryMarkdown(parseSummary({ chapters: [{ start: 3661, end: 3700, title: 'Late' }] })!);
    expect(md).toBe('# Summary\n\n## Chapters\n\n- **1:01:01–1:01:40 · Late**\n');
  });
});

describe('parseSummary (defensive)', () => {
  it('parses the full fixture', () => {
    const s = parseSummary(FIXTURE_JSON)!;
    expect(s.title).toBe('Building a birdhouse from one pine board');
    expect(s.chapters).toHaveLength(3);
    expect(s.chapters[1]).toEqual({ start: 45, end: 140, title: 'Building', description: 'The panels are cut and assembled.' });
    expect(s.topics).toEqual(['woodworking', 'birdhouse', 'DIY']);
    expect(s.onScreenText).toEqual([{ text: 'WELCOME', firstSeen: 1 }, { text: 'Step 1: measure', firstSeen: 60 }]);
    expect(s.caveats).toHaveLength(1);
  });

  it('survives missing and malformed fields', () => {
    const s = parseSummary({
      title: 42,
      chapters: [null, { start: 'abc' }, { start: '1:05', end: 10, title: 'Clock' }, 'nope'],
      topics: 'single',
      onScreenText: ['bare', { text: '' }, { text: 'T', firstSeen: 'x' }],
      caveats: null,
    })!;
    expect(s.title).toBe('');
    expect(s.summary).toBe('');
    expect(s.chapters).toEqual([{ start: 65, end: 65, title: 'Clock', description: '' }]);
    expect(s.topics).toEqual(['single']);
    expect(s.onScreenText).toEqual([{ text: 'bare', firstSeen: 0 }, { text: 'T', firstSeen: 0 }]);
    expect(s.caveats).toEqual([]);
  });

  it('returns null for a non-object', () => {
    expect(parseSummary(null)).toBeNull();
    expect(parseSummary([1])).toBeNull();
    expect(parseSummary('x')).toBeNull();
  });
});

describe('clock helpers', () => {
  it('formatClock mirrors the API FormatClock', () => {
    expect(formatClock(0)).toBe('0:00');
    expect(formatClock(59.999)).toBe('0:59');
    expect(formatClock(140)).toBe('2:20');
    expect(formatClock(3600)).toBe('1:00:00');
    expect(formatClock(-4)).toBe('0:00');
    expect(formatClock(Number.NaN)).toBe('0:00');
  });

  it('toSeconds reads numbers, numeric strings and clocks', () => {
    expect(toSeconds(12.5)).toBe(12.5);
    expect(toSeconds('7')).toBe(7);
    expect(toSeconds('1:02:03')).toBe(3723);
    expect(Number.isNaN(toSeconds('soon'))).toBe(true);
  });
});

describe('summaryHistoryLabel', () => {
  it('History label uses the title, then the file name, then the tool label', () => {
    expect(summaryHistoryLabel('Birdhouse build', 'clip_summary.md', 'Video summary')).toBe('Birdhouse build');
    expect(summaryHistoryLabel('  ', 'clip_summary.md', 'Video summary')).toBe('clip_summary.md');
    expect(summaryHistoryLabel(null, undefined, 'Video summary')).toBe('Video summary');
  });
});
