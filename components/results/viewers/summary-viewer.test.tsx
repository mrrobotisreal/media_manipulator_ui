import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import en from '@/i18n/locales/en-us/interface/components.json';
import { parseSummary } from '@/lib/results/summary';
import { describe as describeResult } from '@/lib/results/describe';
import { SummaryView, SUMMARY_LIST_PREVIEW } from './summary-viewer';
import { viewerFor } from './index';

vi.mock('@/i18n/useLocalization', () => ({
  useLocalization: () => ({
    t: (key: string, opts?: Record<string, string | number>) => {
      const found = key.split('.').reduce<unknown>((o, k) => (o as Record<string, unknown> | undefined)?.[k], en);
      const text = typeof found === 'string' ? found : key;
      return text.replace(/\{\{(\w+)\}\}/g, (_, k: string) => String(opts?.[k] ?? ''));
    },
  }),
}));

const copied = vi.hoisted(() => ({ text: '' }));
vi.mock('@/lib/results/clipboard', () => ({
  copyText: async (text: string) => {
    copied.text = text;
    return true;
  },
}));

const FIXTURES = join(__dirname, '..', '..', '..', 'lib', 'results', 'fixtures');
const FIXTURE = parseSummary(JSON.parse(readFileSync(join(FIXTURES, 'summary.json'), 'utf8')))!;
const FIXTURE_MD = readFileSync(join(FIXTURES, 'summary.md'), 'utf8');
const original = () => ({ file: null, objectUrl: 'blob:orig', kind: 'video' as const });

describe('SummaryView', () => {
  beforeEach(() => {
    HTMLMediaElement.prototype.play = vi.fn(() => Promise.resolve());
    copied.text = '';
  });
  afterEach(cleanup);

  it('viewer fixture: renders title, summary, chapters, topics, on-screen text and caveats', () => {
    render(<SummaryView summary={FIXTURE} isLoading={false} />);
    expect(screen.getByText('Building a birdhouse from one pine board')).toBeTruthy();
    expect(screen.getByText(/She builds a birdhouse/)).toBeTruthy();
    const chapters = screen.getByTestId('summary-chapters');
    expect(within(chapters).getAllByRole('listitem')).toHaveLength(3);
    expect(within(chapters).getByText('The finished house')).toBeTruthy();
    expect(within(screen.getByTestId('summary-topics')).getAllByRole('listitem').map((li) => li.textContent)).toEqual([
      'woodworking', 'birdhouse', 'DIY',
    ]);
    expect(within(screen.getByTestId('summary-onscreen')).getByText('Step 1: measure')).toBeTruthy();
    expect(screen.getByTestId('summary-visual')).toBeTruthy();
    expect(screen.getByTestId('summary-speech')).toBeTruthy();
    expect(within(screen.getByTestId('summary-caveats')).getByText(/machine-generated/)).toBeTruthy();
  });

  it('survives a fixture with missing optional fields (renders what exists)', () => {
    const sparse = parseSummary({ title: 'Just this', chapters: 'bad', topics: null })!;
    render(<SummaryView summary={sparse} isLoading={false} />);
    expect(screen.getByText('Just this')).toBeTruthy();
    for (const id of ['summary-chapters', 'summary-topics', 'summary-onscreen', 'summary-visual', 'summary-speech', 'summary-caveats']) {
      expect(screen.queryByTestId(id)).toBeNull();
    }
    expect(screen.getByText('Copy as Markdown')).toBeTruthy();
  });

  it('an untitled summary shows the fallback heading; a missing summary says it could not load', () => {
    const { rerender } = render(<SummaryView summary={parseSummary({})} isLoading={false} />);
    expect(screen.getByRole('heading', { name: 'Summary' })).toBeTruthy();
    rerender(<SummaryView summary={null} isLoading={false} />);
    expect(screen.getByText('The summary could not be loaded.')).toBeTruthy();
  });

  it('onSeek: clicking a chapter seeks the original and calls onSeek(start)', () => {
    const onSeek = vi.fn();
    const { container } = render(<SummaryView summary={FIXTURE} isLoading={false} original={original()} onSeek={onSeek} />);
    const media = container.querySelector('video') as HTMLVideoElement;
    expect(media.getAttribute('src')).toBe('blob:orig');
    fireEvent.click(screen.getByRole('button', { name: 'Jump to 0:45' }));
    expect(onSeek).toHaveBeenCalledWith(45);
    expect(media.currentTime).toBe(45);
    fireEvent.click(screen.getByRole('button', { name: 'Jump to 2:20' }));
    expect(onSeek).toHaveBeenLastCalledWith(140);
  });

  it('without an original the timestamps are plain text', () => {
    render(<SummaryView summary={FIXTURE} isLoading={false} />);
    expect(screen.queryByRole('button', { name: /Jump to/ })).toBeNull();
  });

  it('markdown round trip: Copy as Markdown copies exactly the server summary.md', async () => {
    render(<SummaryView summary={FIXTURE} isLoading={false} />);
    await act(async () => {
      fireEvent.click(screen.getByText('Copy as Markdown'));
    });
    expect(copied.text).toBe(FIXTURE_MD);
  });

  it('collapses a long chapter list behind Show all', () => {
    const many = parseSummary({
      chapters: Array.from({ length: SUMMARY_LIST_PREVIEW + 4 }, (_, i) => ({ start: i * 10, end: i * 10 + 9, title: `C${i}` })),
    })!;
    render(<SummaryView summary={many} isLoading={false} />);
    expect(screen.queryByText(`C${SUMMARY_LIST_PREVIEW + 2}`)).toBeNull();
    fireEvent.click(screen.getByText(`Show all (${SUMMARY_LIST_PREVIEW + 4})`));
    expect(screen.getByText(`C${SUMMARY_LIST_PREVIEW + 2}`)).toBeTruthy();
  });
});

describe('summary result kind', () => {
  it('a summary job resolves to the summary viewer, which fetches for itself', () => {
    const d = describeResult({ job: { id: 'j1', resultFileName: 'summary.md' }, task: 'summarize_video' });
    expect(d.kind).toBe('summary');
    expect(viewerFor('summary').needsBlob).toBe(false);
    expect(viewerFor('summary').component.name).toBe('SummaryViewer');
  });
});
