import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import en from '@/i18n/locales/en-us/interface/components.json';
import panels from '@/i18n/locales/en-us/interface/panels.json';
import type { TranscribeResult } from '@/lib/useTranscribeResult';
import { TranscriptView } from './transcript-viewer';

vi.mock('@/i18n/useLocalization', () => ({
  useLocalization: () => ({
    t: (key: string, opts?: Record<string, string | number>) => {
      const lookup = (root: unknown, path: string) => path.split('.').reduce<unknown>((o, k) => (o as Record<string, unknown> | undefined)?.[k], root);
      const found = lookup(en, key) ?? lookup(panels, key);
      const text = typeof found === 'string' ? found : key;
      return text.replace(/\{\{(\w+)\}\}/g, (_, k: string) => String(opts?.[k] ?? ''));
    },
    formatDuration: (s: number) => `${s.toFixed(1)}s`,
    formatFileSize: (n: number) => `${n} B`,
  }),
}));

const base: TranscribeResult = {
  format: 'srt',
  language: 'en',
  hasAudio: true,
  hasSpeech: true,
  segmentCount: 3,
  durationSeconds: 12,
  outputFile: 'a.srt',
  startedAt: '',
  completedAt: '',
  segments: [
    { id: 0, start: 1, end: 3, text: 'Hello world' },
    { id: 1, start: 4, end: 6, text: 'Another HELLO here' },
    { id: 2, start: 7, end: 9, text: 'Goodbye' },
  ],
};

const original = (kind: 'audio' | 'video' = 'audio') => ({ file: null, objectUrl: 'blob:orig', kind });
const view = (props: Partial<React.ComponentProps<typeof TranscriptView>> = {}) =>
  render(<TranscriptView result={base} analysis={null} isLoading={false} isAnalysisLoading={false} {...props} />);

describe('TranscriptView', () => {
  beforeEach(() => {
    HTMLMediaElement.prototype.play = vi.fn(() => Promise.resolve());
    HTMLElement.prototype.scrollIntoView = vi.fn();
  });
  afterEach(cleanup);

  it('renders an srt result as a cue list (format includes srt)', () => {
    view();
    expect(screen.getByText('Hello world')).toBeTruthy();
    expect(screen.getByText('Goodbye')).toBeTruthy();
    expect(screen.getByText('srt')).toBeTruthy();
  });

  it('is read-only without an original: no timestamp buttons', () => {
    view();
    expect(screen.queryByRole('button', { name: /Jump to/ })).toBeNull();
    expect(screen.queryByTestId('seek-player')).toBeNull();
  });

  it('clicking a timestamp seeks the bound media element and calls onSeek', () => {
    const onSeek = vi.fn();
    const { container } = view({ original: original(), onSeek });
    const media = container.querySelector('audio') as HTMLAudioElement;
    expect(media.getAttribute('src')).toBe('blob:orig');
    fireEvent.click(screen.getByRole('button', { name: 'Jump to 0:04' }));
    expect(media.currentTime).toBe(4);
    expect(onSeek).toHaveBeenCalledWith(expect.objectContaining({ startMs: 4000 }));
  });

  it('uses a video element for video originals and follows timeupdate', () => {
    const { container } = view({ original: original('video') });
    const media = container.querySelector('video') as HTMLVideoElement;
    media.currentTime = 7.5;
    fireEvent.timeUpdate(media);
    expect(container.querySelector('[data-row="2"]')?.getAttribute('data-active')).toBe('true');
  });

  it('search counts, highlights and cycles with Enter / Shift+Enter', () => {
    const { container } = view();
    const input = screen.getByLabelText('Search transcript');
    fireEvent.change(input, { target: { value: 'hello' } });
    expect(screen.getByText('1 of 2')).toBeTruthy();
    expect(container.querySelectorAll('mark')).toHaveLength(2);
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(screen.getByText('2 of 2')).toBeTruthy();
    fireEvent.keyDown(input, { key: 'Enter', shiftKey: true });
    expect(screen.getByText('1 of 2')).toBeTruthy();
    fireEvent.change(input, { target: { value: 'zzz' } });
    expect(screen.getByText('No matches')).toBeTruthy();
  });

  it('copy all sends the selected format to the clipboard and flips the label', async () => {
    vi.useFakeTimers();
    const writeText = vi.fn(() => Promise.resolve());
    Object.assign(navigator, { clipboard: { writeText } });
    const onCopy = vi.fn();
    view({ onCopy });
    fireEvent.click(screen.getByLabelText('TXT'));
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Copy all/ }));
    });
    expect(writeText).toHaveBeenCalledWith('Hello world\nAnother HELLO here\nGoodbye');
    expect(onCopy).toHaveBeenCalledWith('txt');
    expect(screen.getByText('Copied')).toBeTruthy();
    act(() => { vi.advanceTimersByTime(2100); });
    expect(screen.getByText('Copy all')).toBeTruthy();
    vi.useRealTimers();
  });

  it('format switch changes the raw preview', () => {
    view();
    fireEvent.click(screen.getByRole('button', { name: 'Raw text' }));
    expect(screen.getByTestId('transcript-raw').textContent).toContain('00:00:01,000 --> 00:00:03,000');
    fireEvent.click(screen.getByLabelText('VTT'));
    expect(screen.getByTestId('transcript-raw').textContent).toMatch(/^WEBVTT/);
  });

  it('windows very long transcripts and offers Show more', () => {
    const segments = Array.from({ length: 2500 }, (_, i) => ({ id: i, start: i, end: i + 1, text: `cue ${i}` }));
    const { container } = view({ result: { ...base, segments, segmentCount: 2500 } });
    expect(container.querySelectorAll('[data-row]')).toHaveLength(200);
    fireEvent.click(screen.getByRole('button', { name: /Show more/ }));
    expect(container.querySelectorAll('[data-row]')).toHaveLength(400);
  });

  it('keeps the no-speech message and analysis section', () => {
    view({ result: { ...base, hasSpeech: false, segments: [], message: 'Silence only' } });
    expect(screen.getByText('Silence only')).toBeTruthy();
    expect(screen.getByText(/AI summary/)).toBeTruthy();
  });
});
