import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactElement } from 'react';
import components from '@/i18n/locales/en-us/interface/components.json';
import panels from '@/i18n/locales/en-us/interface/panels.json';
import forms from '@/i18n/locales/en-us/interface/forms.json';
import core from '@/i18n/locales/en-us/interface/_core.json';
import { resetResultBlobCache } from '@/lib/results/useResultBlob';
import { resetPreviewedForTests } from '@/components/results/result-panel';
import AudioGettingStarted from './audio-getting-started';
import ImageGettingStarted from './image-getting-started';
import VideoGettingStarted from './video-getting-started';
import AIFrameInterpolation from './ai-frame-interpolation';

/**
 * MM06: the four tutorials that embed a tool panel reach the shared ResultPanel when a job
 * completes, and report `surface: 'tutorial'`. `content-studio.tsx` has no tool panel and
 * is out of scope. Everything below the panel's job hooks is mocked; the panel, the
 * ResultPanel and the real tutorial views are real.
 */
const { analyticsTrack, jobState } = vi.hoisted(() => ({ analyticsTrack: vi.fn(), jobState: { resultFileName: 'out.png' } }));

vi.mock('@/i18n/useLocalization', () => ({
  useLocalization: () => ({
    t: (key: string, opts?: Record<string, string | number>) => {
      const path = key.replace(/^interface:/, '');
      let found: unknown;
      for (const root of [components, panels, forms, core]) {
        found = path.split('.').reduce<unknown>((o, k) => (o as Record<string, unknown> | undefined)?.[k], root);
        if (typeof found === 'string') break;
      }
      const text = typeof found === 'string' ? found : key;
      return text.replace(/\{\{(\w+)\}\}/g, (_, k: string) => String(opts?.[k] ?? ''));
    },
    formatFileSize: (n: number) => `${n} B`,
    formatDate: () => 'Oct 24, 2026',
    formatTime: () => '9:00 AM',
    language: { code: 'en-US' },
  }),
}));
// ToolAnalyticsProvider imports the client from its own module, so mock it there.
vi.mock('@/lib/analytics/client', async () => {
  const actual = await vi.importActual<typeof import('@/lib/analytics/client')>('@/lib/analytics/client');
  return { ...actual, analytics: { track: analyticsTrack, setContext: vi.fn() } };
});
vi.mock('@/components/analytics/content-read-tracker', () => ({ default: () => null }));
vi.mock('@/lib/auth/AuthProvider', () => ({ useAuth: () => null }));
vi.mock('next/link', () => ({ default: ({ children, href }: { children: React.ReactNode; href: string }) => <a href={href}>{children}</a> }));
// The tutorial loads the client panel through next/dynamic(ssr:false); render the real panel
// directly, with each conversion form replaced by one "run" button that submits it.
vi.mock('@/components/tools/embedded-tool-panel-client', async () => {
  const mod = await vi.importActual<typeof import('@/components/embedded-tool-panel')>('@/components/embedded-tool-panel');
  return { default: mod.default };
});
vi.mock('next/dynamic', () => ({
  default: () =>
    function FormStub(props: { onSubmit?: (d: unknown) => void }) {
      return <button type="button" onClick={() => props.onSubmit?.({ format: 'x' })}>run job</button>;
    },
}));
vi.mock('@/lib/useConvertFile', () => ({
  default: (onSuccess: (r: { jobId: string }) => void) => ({
    mutate: () => onSuccess({ jobId: 'tut-job' }),
    isPending: false,
    uploadProgress: 0,
  }),
}));
vi.mock('@/lib/useTranscribeFile', () => ({
  default: () => ({ mutate: vi.fn(), isPending: false, uploadProgress: 0 }),
}));
// Polling answers only once a job exists. The panel merges the answer into its job in an
// effect, so the object is referentially stable per file name.
vi.mock('@/lib/useGetJobStatus', () => {
  const cache = new Map<string, object>();
  return {
    default: (job: object | null) => {
      if (!job) return { data: undefined };
      const name = jobState.resultFileName;
      if (!cache.has(name)) cache.set(name, { id: 'tut-job', status: 'completed', resultFileName: name, resultSizeBytes: 2048 });
      return { data: cache.get(name) };
    },
  };
});
vi.mock('@/lib/useDownloadFile', () => ({
  default: () => ({ downloadFile: async () => new Blob(['bytes'], { type: 'application/octet-stream' }) }),
}));
vi.mock('@/lib/results/save', () => ({ saveBlobToDisk: vi.fn() }));

const withQuery = (ui: ReactElement) => (
  <QueryClientProvider client={new QueryClient()}>{ui}</QueryClientProvider>
);

const CASES: Array<[string, () => ReactElement, string, File]> = [
  ['audio-getting-started', () => <AudioGettingStarted />, 'out.mp3', new File(['a'], 'in.wav', { type: 'audio/wav' })],
  ['image-getting-started', () => <ImageGettingStarted />, 'out.png', new File(['a'], 'in.jpg', { type: 'image/jpeg' })],
  ['video-getting-started', () => <VideoGettingStarted />, 'out.mp4', new File(['a'], 'in.mov', { type: 'video/quicktime' })],
  ['ai-frame-interpolation', () => <AIFrameInterpolation />, 'out.mp4', new File(['a'], 'in.mp4', { type: 'video/mp4' })],
];

describe('tutorials show the shared result viewer', () => {
  beforeEach(() => {
    let n = 0;
    Object.assign(URL, { createObjectURL: vi.fn(() => `blob:fake-${++n}`), revokeObjectURL: vi.fn() });
    analyticsTrack.mockClear();
  });
  afterEach(() => {
    cleanup();
    resetResultBlobCache();
    resetPreviewedForTests();
  });

  it.each(CASES)('%s renders a Result region and reports surface tutorial', async (_name, view, resultFileName, file) => {
    jobState.resultFileName = resultFileName;
    render(withQuery(view()));
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    expect(input).toBeTruthy();
    fireEvent.change(input, { target: { files: [file] } });
    fireEvent.click(await screen.findByRole('button', { name: 'run job' }));

    const region = await screen.findByRole('region', { name: components.resultPanel.ariaLabel });
    expect(region).toBeTruthy();
    await waitFor(() => {
      const viewed = analyticsTrack.mock.calls.find((c) => c[0] === 'result_viewed');
      expect(viewed?.[1]).toMatchObject({ job_id: 'tut-job', surface: 'tutorial' });
    });
  });
});
