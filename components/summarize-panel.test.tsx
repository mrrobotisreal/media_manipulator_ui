import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import panels from '@/i18n/locales/en-us/interface/panels.json';
import type { SummarizeCapabilities } from '@/lib/summarizeTypes';
import type { ConversionJob } from '@/lib/useGetJobStatus';

const h = vi.hoisted(() => ({
  auth: null as unknown,
  caps: { isLoading: false, isError: false, data: undefined as unknown },
  start: vi.fn(),
  error: null as Error | null,
}));

vi.mock('@/i18n/useLocalization', () => ({
  useLocalization: () => ({
    t: (key: string, opts?: Record<string, string | number>) => {
      const found = key.split('.').reduce<unknown>((o, k) => (o as Record<string, unknown> | undefined)?.[k], panels);
      const text = typeof found === 'string' ? found : key;
      return text.replace(/\{\{(\w+)\}\}/g, (_, k: string) => String(opts?.[k] ?? ''));
    },
    language: { code: 'de-DE' },
  }),
}));
vi.mock('@/lib/auth/AuthProvider', () => ({ useAuth: () => h.auth }));
vi.mock('@/lib/useSummarize', async (orig) => ({
  ...(await orig<typeof import('@/lib/useSummarize')>()),
  useSummarizeCapabilities: () => h.caps,
  useSummarize: () => ({ start: h.start, isPending: false, error: h.error, uploadProgress: 0, uploadPhase: 'idle', reset: vi.fn() }),
}));
// The shell is exercised elsewhere; here it renders the form for a picked file straight away.
vi.mock('@/components/specialized-tool-shell', () => ({
  default: (p: { renderForm: (a: unknown) => React.ReactNode; accept: string }) => (
    <div data-testid="shell" data-accept={p.accept}>
      {p.renderForm({ file: new File(['x'], 'clip.mp4', { type: 'video/mp4' }), isProcessing: false, conversionJob: null, triggerSubmit: vi.fn(), setSubmitHandler: vi.fn() })}
    </div>
  ),
}));

import SummarizePanel, { SummaryStageList, summarizeGate } from './summarize-panel';

const caps = (over: Partial<SummarizeCapabilities> = {}): SummarizeCapabilities => ({
  enabled: true,
  vlmModel: 'qwen3-vl:8b',
  summaryModel: 'qwen3.5:9b',
  deep: true,
  deepTiers: ['pro'],
  maxFramesByTier: { anonymous: 0, free: 24, premium: 48, pro: 96 },
  outputLanguages: ['auto', 'de-DE', 'en-US', 'fr-FR'],
  ...over,
});

const signedIn = (tier: string) => ({ loading: false, user: { uid: 'u' }, tier, openAuth: vi.fn() });

beforeEach(() => {
  h.auth = signedIn('free');
  h.caps = { isLoading: false, isError: false, data: caps() };
  h.error = null;
});
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe('SummarizePanel deep gating', () => {
  it.each(['free', 'premium'])('no depth toggle for %s', (tier) => {
    h.auth = signedIn(tier);
    render(<SummarizePanel task="summarize_video" />);
    expect(screen.getByTestId('summarize-start')).toBeTruthy();
    expect(screen.queryByTestId('summarize-depth')).toBeNull();
  });

  it('no depth toggle for pro when capabilities.deep is false', () => {
    h.auth = signedIn('pro');
    h.caps = { isLoading: false, isError: false, data: caps({ deep: false }) };
    render(<SummarizePanel task="summarize_video" />);
    expect(screen.queryByTestId('summarize-depth')).toBeNull();
  });

  it('depth toggle present for pro with deep, and deep is sent', () => {
    h.auth = signedIn('pro');
    render(<SummarizePanel task="summarize_video" />);
    expect(screen.getByTestId('summarize-depth')).toBeTruthy();
    fireEvent.click(screen.getByLabelText('Deep'));
    fireEvent.click(screen.getByTestId('summarize-start'));
    expect(h.start).toHaveBeenCalledWith(expect.objectContaining({ options: { outputLanguage: 'de-DE', depth: 'deep' } }));
  });
});

describe('SummarizePanel gates', () => {
  it('anonymous sees the sign-in prompt and no start button; the prompt opens the auth panel', () => {
    const auth = { loading: false, user: null, tier: 'anonymous', openAuth: vi.fn() };
    h.auth = auth;
    render(<SummarizePanel task="summarize_video" />);
    expect(screen.getByTestId('summarize-signin')).toBeTruthy();
    expect(screen.queryByTestId('summarize-start')).toBeNull();
    expect(screen.queryByTestId('shell')).toBeNull();
    fireEvent.click(screen.getByText('Sign in'));
    expect(auth.openAuth).toHaveBeenCalledWith({ intent: 'signin', source: 'summarize_panel' });
  });

  it('enabled: false shows the unavailable state', () => {
    h.caps = { isLoading: false, isError: false, data: caps({ enabled: false }) };
    render(<SummarizePanel task="summarize_video" />);
    expect(screen.getByTestId('summarize-unavailable')).toBeTruthy();
    expect(screen.queryByTestId('summarize-start')).toBeNull();
  });

  it('a failed capabilities call is also unavailable, never a broken start button', () => {
    h.caps = { isLoading: false, isError: true, data: undefined };
    render(<SummarizePanel task="summarize_video" />);
    expect(screen.getByTestId('summarize-unavailable')).toBeTruthy();
  });

  it('a 403 signin_required from the API falls back to the sign-in prompt', async () => {
    const { SummarizeStartError } = await import('@/lib/useSummarize');
    h.error = new SummarizeStartError(403, 'signin_required', 'Sign in');
    render(<SummarizePanel task="summarize_video" />);
    expect(screen.getByTestId('summarize-signin')).toBeTruthy();
  });

  it('defaults the output language to the page locale and offers "same as speech"', () => {
    render(<SummarizePanel task="summarize_audio" />);
    const select = screen.getByLabelText('Summary language') as HTMLSelectElement;
    expect(select.value).toBe('de-DE');
    expect([...select.options].map((o) => o.value)).toEqual(['auto', 'en-US', 'de-DE', 'fr-FR']);
    expect(screen.getByTestId('shell').getAttribute('data-accept')).toBe('audio/*');
  });

  it('summarizeGate covers loading, plan and operator', () => {
    const base = { capsLoading: false, capsError: false, caps: caps(), authLoading: false };
    expect(summarizeGate({ ...base, capsLoading: true, tier: 'free' })).toBe('loading');
    expect(summarizeGate({ ...base, tier: null })).toBe('signin');
    expect(summarizeGate({ ...base, caps: caps({ maxFramesByTier: { free: 0 } }), tier: 'free' })).toBe('not_in_plan');
    expect(summarizeGate({ ...base, tier: 'operator' })).toBe('ready');
  });
});

describe('SummaryStageList', () => {
  it('stage list reflects polled stages[] with the active stage highlighted', () => {
    const job: Pick<ConversionJob, 'stages'> = {
      stages: [
        { key: 'probe', label: '', status: 'completed', progress: 5 },
        { key: 'audio', label: '', status: 'completed', progress: 25, message: '40 segments' },
        { key: 'frames', label: '', status: 'completed', progress: 40, message: '24 frames' },
        { key: 'vision', label: '', status: 'processing', progress: 70 },
        { key: 'synthesis', label: '', status: 'pending', progress: 95 },
        { key: 'render', label: '', status: 'pending', progress: 100 },
      ],
    };
    render(<SummaryStageList job={job} />);
    const items = screen.getByTestId('summary-stages').querySelectorAll('li');
    expect([...items].map((li) => `${li.getAttribute('data-stage')}:${li.getAttribute('data-status')}`)).toEqual([
      'probe:completed', 'audio:completed', 'frames:completed', 'vision:processing', 'synthesis:pending', 'render:pending',
    ]);
    expect(screen.getByText('Describing the frames').closest('li')?.getAttribute('aria-current')).toBe('step');
    expect(screen.getByText('Frames: 24')).toBeTruthy();
  });
});
