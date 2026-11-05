/**
 * MM116b: the confirmation card. Nothing is submitted until the click; Start runs the tool's own
 * submit hook with the request the page would send; with no file (or a family that cannot run
 * here) the button opens the tool page with the validated ?o= link.
 */
import * as React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { createI18nInstance } from '@/i18n';
import en from '@/i18n/locales/en-us/interface/assistant.json';

const h = vi.hoisted(() => ({
  convert: vi.fn(),
  specialized: vi.fn(),
  transcribe: vi.fn(),
  onStarted: null as null | ((r: { jobId: string }) => void),
  status: null as null | Record<string, unknown>,
  setContext: vi.fn(),
  toolSlug: 'compress-video' as string | null,
}));
vi.mock('next/navigation', () => ({ usePathname: () => '/tools/compress-video', useRouter: () => ({ push: vi.fn() }) }));
vi.mock('@/lib/useConvertFile', () => ({
  default: (onSuccess: (r: { jobId: string }) => void) => {
    h.onStarted = onSuccess;
    return { mutate: h.convert, isPending: false, isError: false, error: null, uploadProgress: 0, uploadPhase: 'idle' };
  },
}));
vi.mock('@/lib/useSpecializedMediaTool', () => ({
  default: () => ({ mutate: h.specialized, isPending: false, isError: false, error: null, uploadProgress: 0, uploadPhase: 'idle' }),
}));
vi.mock('@/lib/useTranscribeFile', () => ({
  default: () => ({ mutate: h.transcribe, isPending: false, isError: false, error: null, uploadProgress: 0, uploadPhase: 'idle' }),
}));
vi.mock('@/lib/useGetJobStatus', () => ({ default: () => ({ data: h.status ?? undefined }) }));
vi.mock('@/components/results/result-panel', () => ({ ResultPanel: (p: { open?: boolean }) => <div data-testid="result-panel" data-open={String(!!p.open)} /> }));
vi.mock('@/lib/analytics', async () => ({
  EVENTS: (await import('@/lib/analytics/events')).EVENTS,
  setContext: h.setContext,
  getToolSlug: () => h.toolSlug,
}));

import JobCard from './job-card';

function wrap(ui: React.ReactElement, locale = 'en-US') {
  const inst = createI18nInstance(locale);
  inst.addResourceBundle(locale, 'interface', en, true, true);
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={qc}>
      <I18nextProvider i18n={inst}>{ui}</I18nextProvider>
    </QueryClientProvider>,
  );
}

const QUOTA = { metric: 'ops' as const, tier: 'anonymous', limit: 10, remaining: 7, resetsAt: '2026-11-06T00:00:00Z' };
const params = (extra: Record<string, unknown> = {}) => ({ tool: 'compress-video', toolName: 'Compress Video', family: 'video:compress', options: { level: 'smallest', resolution: '720' }, quota: QUOTA, queueEstimate: { gpu: false, bucket: 'none' }, ...extra });
const video = () => new File([new Uint8Array(10)], 'trip.mov', { type: 'video/quicktime' });

let track: ReturnType<typeof vi.fn>;
let onOpen: ReturnType<typeof vi.fn<(href: string) => void>>;
beforeEach(() => {
  h.convert.mockReset();
  h.specialized.mockReset();
  h.transcribe.mockReset();
  h.setContext.mockReset();
  h.status = null;
  h.toolSlug = 'compress-video';
  track = vi.fn();
  onOpen = vi.fn<(href: string) => void>();
});
afterEach(cleanup);

const card = (p: Record<string, unknown>, file: File | null, locale = 'en-US') =>
  wrap(<JobCard callId="c1" label="Compress it" params={p} locale={locale} file={file} track={track as never} onOpen={onOpen} />, locale);

describe('JobCard (MM116b)', () => {
  it('shows labels, units and values from the option schema, plus the server-priced quota and queue', async () => {
    card(params(), video());
    const rows = await screen.findByTestId('medi-job-settings');
    expect(rows.textContent).toContain('Compression level');
    expect(rows.textContent).toContain('Smallest');
    expect(rows.textContent).toContain('Resolution');
    expect(rows.textContent).toContain('720');
    expect(screen.getByTestId('medi-job-costs').textContent).toContain('Uses 1 of your daily everyday operations.');
    expect(screen.getByTestId('medi-job-costs').textContent).toContain('7 of 10 left today.');
    expect(screen.getByTestId('medi-job-queue').textContent).toBe('No wait: it starts right away.');
    expect(screen.getByTestId('medi-job-file').textContent).toContain('trip.mov');
    expect(screen.getByText('Run Compress Video?')).toBeTruthy();
  });

  it('never takes words from the model: its label is not rendered', async () => {
    card(params({ options: { level: 'smallest' } }), video());
    await screen.findByTestId('medi-job-settings');
    expect(screen.queryByText('Compress it')).toBeNull();
  });

  it('proposing emits assistant_job_proposed once and submits nothing (no submit call until the click)', async () => {
    card(params(), video());
    await screen.findByTestId('medi-job-start');
    expect(track).toHaveBeenCalledTimes(1);
    expect(track).toHaveBeenCalledWith('assistant_job_proposed', { surface: 'guide', tool: 'compress-video', quota_metric: 'ops', queue_bucket: 'none', has_file: true });
    expect(h.convert).not.toHaveBeenCalled();
    expect(h.specialized).not.toHaveBeenCalled();
    expect(h.transcribe).not.toHaveBeenCalled();
    expect(track).not.toHaveBeenCalledWith('assistant_job_confirmed', expect.anything());
  });

  it('Start runs the job through the tool hook with the file and the page request, and nothing else', async () => {
    const f = video();
    card(params(), f);
    fireEvent.click(await screen.findByTestId('medi-job-start'));
    expect(h.convert).toHaveBeenCalledTimes(1);
    expect(h.convert).toHaveBeenCalledWith({
      file: f,
      options: { format: 'mp4', quality: 'low', speed: 1, preserveAspectRatio: true, crf: 31, stripAudio: false, videoCodec: 'h264', height: 720 },
    });
    expect(track).toHaveBeenCalledWith('assistant_job_confirmed', { surface: 'guide', tool: 'compress-video', mode: 'run', quota_metric: 'ops' });
    // The funnel events of the job carry this card's tool, and the page's slug is restored after.
    expect(h.setContext).toHaveBeenCalledWith({ tool_slug: 'compress-video' });
    expect(onOpen).not.toHaveBeenCalled();
    // Start is gone while it runs (no double submit).
    expect(screen.queryByTestId('medi-job-start')).toBeNull();
  });

  it('progress and the result: polls via useGetJobStatus and opens the shared ResultPanel', async () => {
    card(params(), video());
    fireEvent.click(await screen.findByTestId('medi-job-start'));
    await act(async () => h.onStarted?.({ jobId: 'job-1' }));
    expect(screen.getByTestId('medi-job-progress')).toBeTruthy();
  });

  it('a finished job offers the result in the panel', async () => {
    const f = video();
    card(params(), f);
    fireEvent.click(await screen.findByTestId('medi-job-start'));
    // The status poll answers once the job exists (a new object, like a refetch).
    h.status = { id: 'job-1', status: 'completed', resultFileName: 'trip.mp4', resultSizeBytes: 5 };
    await act(async () => h.onStarted?.({ jobId: 'job-1' }));
    await waitFor(() => expect(screen.getByTestId('medi-job-done')).toBeTruthy());
    expect(screen.getByTestId('result-panel').getAttribute('data-open')).toBe('false');
    fireEvent.click(screen.getByText('View and download'));
    expect(screen.getByTestId('result-panel').getAttribute('data-open')).toBe('true');
    expect(h.setContext).toHaveBeenLastCalledWith({ tool_slug: 'compress-video' });
  });

  it('no file attached: the button opens the tool with these settings (?o= link) and submits nothing', async () => {
    card(params(), null);
    const btn = await screen.findByTestId('medi-job-open');
    expect(screen.queryByTestId('medi-job-start')).toBeNull();
    expect(btn.textContent).toBe('Open Compress Video with these settings');
    expect(btn.getAttribute('data-href')).toMatch(/^\/tools\/compress-video\?o=[A-Za-z0-9_-]+$/);
    expect(screen.getByText(/Open the tool to choose your file/)).toBeTruthy();
    expect(track).toHaveBeenCalledWith('assistant_job_proposed', expect.objectContaining({ has_file: false }));
    fireEvent.click(btn);
    expect(onOpen).toHaveBeenCalledWith(btn.getAttribute('data-href'));
    expect(track).toHaveBeenCalledWith('assistant_job_confirmed', { surface: 'guide', tool: 'compress-video', mode: 'open', quota_metric: 'ops' });
    expect(h.convert).not.toHaveBeenCalled();
  });

  it('a locale prefix rides on the open link', async () => {
    card(params(), null, 'es-ES');
    expect((await screen.findByTestId('medi-job-open')).getAttribute('data-href')).toMatch(/^\/es\/tools\/compress-video\?o=/);
  });

  it('a family that cannot run here (the image converter) falls back to the deep link even with a file', async () => {
    const img = new File([new Uint8Array(4)], 'a.png', { type: 'image/png' });
    card(params({ tool: 'image-converter', toolName: 'Image Converter', family: 'image:convert', options: { format: 'webp' }, queueEstimate: { bucket: 'none' } }), img);
    const btn = await screen.findByTestId('medi-job-open');
    expect(screen.queryByTestId('medi-job-start')).toBeNull();
    expect(btn.getAttribute('data-href')).toMatch(/^\/tools\/image-converter\?o=/);
    expect(screen.getByText(/run from its own page/)).toBeTruthy();
    fireEvent.click(btn);
    expect(h.convert).not.toHaveBeenCalled();
    expect(track).toHaveBeenCalledWith('assistant_job_confirmed', expect.objectContaining({ mode: 'open' }));
  });

  it('the wrong kind of file falls back to opening the tool', async () => {
    card(params(), new File([new Uint8Array(4)], 'a.mp3', { type: 'audio/mpeg' }));
    await screen.findByTestId('medi-job-open');
    expect(screen.queryByTestId('medi-job-start')).toBeNull();
    expect(screen.getByText(/isn't the kind this tool works on/)).toBeTruthy();
  });

  it('an AI job shows the AI allowance; an exhausted allowance does not offer Start', async () => {
    card(params({ tool: 'transcribe-audio', toolName: 'Transcribe Audio', family: 'transcribe', options: { format: 'srt' }, quota: { metric: 'ai_ops', limit: 3, remaining: 0 }, queueEstimate: { gpu: true, bucket: 'long', waiting: 5 } }), new File([new Uint8Array(4)], 't.mp3', { type: 'audio/mpeg' }));
    await screen.findByTestId('medi-job-open');
    expect(screen.getByTestId('medi-job-costs').textContent).toContain('Uses 1 of your daily AI operations.');
    expect(screen.getByTestId('medi-job-costs').textContent).toContain('0 of 3 left today.');
    expect(screen.getByTestId('medi-job-queue').textContent).toContain('A longer wait');
    expect(screen.queryByTestId('medi-job-start')).toBeNull();
  });

  it('transcribe runs through the transcribe hook', async () => {
    const f = new File([new Uint8Array(4)], 't.mp3', { type: 'audio/mpeg' });
    card(params({ tool: 'transcribe-audio', toolName: 'Transcribe Audio', family: 'transcribe', options: { format: 'srt', language: 'es' }, quota: { metric: 'ai_ops', unlimited: true }, queueEstimate: { gpu: true, bucket: 'unknown' } }), f);
    await screen.findByTestId('medi-job-start');
    expect(screen.getByTestId('medi-job-costs').textContent).toContain('You have no daily limit on this.');
    expect(screen.getByTestId('medi-job-queue').textContent).toBe("The wait can't be estimated right now.");
    fireEvent.click(screen.getByTestId('medi-job-start'));
    expect(h.transcribe).toHaveBeenCalledWith({ file: f, options: { mode: 'transcribe', format: 'srt', language: 'es' } });
    expect(h.convert).not.toHaveBeenCalled();
  });

  it('a malformed proposal (missing quota or queue) renders nothing', () => {
    const { container } = card({ tool: 'compress-video' }, video());
    expect(container.textContent).toBe('');
    expect(track).not.toHaveBeenCalled();
  });

  it('no options: the tool\'s usual settings', async () => {
    card(params({ options: undefined }), null);
    expect(await screen.findByText("The tool's usual settings.")).toBeTruthy();
  });
});
