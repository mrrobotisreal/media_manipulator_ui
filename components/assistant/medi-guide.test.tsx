/**
 * MM107 widget tests: the launcher is absent until armed and capabilities say the guide is on,
 * hidden on excluded routes, sits in the inline-end corner (left in RTL); the sheet streams an
 * answer, renders an action as a locale-prefixed button with its preset, stops, shows the static
 * fallback, sends feedback, and tracks the assistant_* events.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';

import { createI18nInstance } from '@/i18n';
import en from '@/i18n/locales/en-us/interface/assistant.json';
import he from '@/i18n/locales/he-il/interface/assistant.json';

const h = vi.hoisted(() => ({
  pathname: '/tools/compress-video',
  push: vi.fn(),
  track: vi.fn(),
  user: null as null | { uid: string },
  stream: vi.fn(),
  feedback: vi.fn(async () => true),
}));
vi.mock('next/navigation', () => ({ usePathname: () => h.pathname, useRouter: () => ({ push: h.push }) }));
vi.mock('@/lib/analytics', async () => ({ EVENTS: (await import('@/lib/analytics/events')).EVENTS, analytics: { track: h.track } }));
vi.mock('@/lib/auth/AuthProvider', () => ({ useAuth: () => ({ user: h.user }) }));
vi.mock('@/lib/useMediaQuery', () => ({ useMediaQuery: () => false }));
vi.mock('@/lib/i18n/ensureShard', () => ({ withAssistantShard: <T,>(load: () => Promise<T>) => load() }));
vi.mock('@/lib/assistant/stream', () => ({ streamAssistantChat: h.stream }));
vi.mock('@/lib/assistant/api', async (orig) => ({
  ...(await orig<typeof import('@/lib/assistant/api')>()),
  sendAssistantFeedback: h.feedback,
  listAssistantConversations: vi.fn(async () => []),
}));

import { MediGuide, afterFirstInteractionIdle } from './medi-guide';
import GuideSheet from './guide-sheet';

const ON = {
  enabled: true as const,
  guide: { enabled: true },
  copilot: { enabled: false, surfaces: [], signedInOnly: true, editSurfaces: [] },
  turns: { limit: 0, remaining: 0, resetsAt: '' },
  frames: true,
  maxFrameBytes: 307200,
  maxMessageChars: 4000,
  spendCapReached: false,
};

function i18n(locale = 'en-US', shard: object = en) {
  const inst = createI18nInstance(locale);
  inst.addResourceBundle(locale, 'interface', shard, true, true);
  return inst;
}

beforeEach(() => {
  h.pathname = '/tools/compress-video';
  h.user = null;
  h.track.mockReset();
  h.push.mockReset();
  h.stream.mockReset();
  h.feedback.mockClear();
});
afterEach(cleanup);

describe('MediGuide launcher', () => {
  it('renders nothing until the first interaction + idle', async () => {
    const load = vi.fn(async () => ON);
    render(
      <I18nextProvider i18n={i18n()}>
        <MediGuide loadCapabilities={load} />
      </I18nextProvider>,
    );
    expect(screen.queryByTestId('medi-guide-button')).toBeNull();
    expect(load).not.toHaveBeenCalled();
  });

  it('arms after interaction then idle (helper)', () => {
    vi.useFakeTimers();
    const cb = vi.fn();
    const off = afterFirstInteractionIdle(window, cb);
    window.dispatchEvent(new Event('scroll'));
    vi.advanceTimersByTime(2500);
    expect(cb).toHaveBeenCalledTimes(1);
    off();
    vi.useRealTimers();
  });

  it('stays hidden while capabilities say off', async () => {
    render(
      <I18nextProvider i18n={i18n()}>
        <MediGuide armImmediately loadCapabilities={async () => ({ enabled: false })} />
      </I18nextProvider>,
    );
    await act(async () => {});
    expect(screen.queryByTestId('medi-guide-button')).toBeNull();
  });

  it('stays hidden when the guide alone is off', async () => {
    render(
      <I18nextProvider i18n={i18n()}>
        <MediGuide armImmediately loadCapabilities={async () => ({ ...ON, guide: { enabled: false } })} />
      </I18nextProvider>,
    );
    await act(async () => {});
    expect(screen.queryByTestId('medi-guide-button')).toBeNull();
  });

  it.each(['/dr/docs', '/embed/content-studio', '/translator', '/tools/content-studio', '/ru/tools/content-studio', '/photo/new', '/motion/x'])('is hidden on %s', async (p) => {
    h.pathname = p;
    render(
      <I18nextProvider i18n={i18n()}>
        <MediGuide armImmediately loadCapabilities={async () => ON} />
      </I18nextProvider>,
    );
    await act(async () => {});
    expect(screen.queryByTestId('medi-guide-button')).toBeNull();
  });

  it('shows bottom-right in LTR, bottom-left in RTL, and tracks assistant_opened', async () => {
    const { unmount } = render(
      <I18nextProvider i18n={i18n()}>
        <MediGuide armImmediately loadCapabilities={async () => ON} />
      </I18nextProvider>,
    );
    const btn = await screen.findByTestId('medi-guide-button');
    expect(btn.className).toContain('right-4');
    expect(btn.className).toContain('fixed');
    expect(btn.getAttribute('aria-label')).toBe('Ask Medi, the Media Manipulator guide');
    fireEvent.click(btn);
    expect(h.track).toHaveBeenCalledWith('assistant_opened', { surface: 'guide', entry: 'button' });
    unmount();
    h.pathname = '/he';
    render(
      <I18nextProvider i18n={i18n('he-IL', he)}>
        <MediGuide armImmediately loadCapabilities={async () => ON} />
      </I18nextProvider>,
    );
    expect((await screen.findByTestId('medi-guide-button')).className).toContain('left-4');
  });

  it('puts the sheet close button in the inline-end corner, clear of the Medi mark in RTL', async () => {
    h.pathname = '/he';
    render(
      <I18nextProvider i18n={i18n('he-IL', he)}>
        <MediGuide armImmediately loadCapabilities={async () => ON} />
      </I18nextProvider>,
    );
    fireEvent.click(await screen.findByTestId('medi-guide-button'));
    const sheet = await screen.findByTestId('medi-guide-sheet');
    const close = sheet.querySelector('[data-slot="sheet-content"] > button:last-child, button.absolute') as HTMLElement;
    expect(close).not.toBeNull();
    // Logical `end-4`: right in LTR, left in RTL (Hebrew screenshot, 2026-11-05: the X sat on the mark).
    expect(close.className).toContain('end-4');
    expect(close.className).not.toMatch(/(^|\s)right-4(\s|$)/);
  });
});

type Emit = (ev: unknown) => void;
function streamWith(frames: unknown[] | ((emit: Emit, signal?: AbortSignal) => Promise<void>)) {
  h.stream.mockImplementation(async (_body: unknown, emit: Emit, signal?: AbortSignal) => {
    if (typeof frames === 'function') return frames(emit, signal);
    for (const f of frames) emit(f);
  });
}

function renderSheet(locale = 'en-US') {
  return render(
    <I18nextProvider i18n={i18n(locale)}>
      <GuideSheet open onOpenChange={() => {}} capabilities={ON} />
    </I18nextProvider>,
  );
}

describe('GuideSheet', () => {
  it('starter chip → streamed answer + action button with the locale-prefixed preset route', async () => {
    h.pathname = '/ru/tools/compress-video';
    streamWith([
      { type: 'meta', conversationId: null, turnId: 't', model: 'm' },
      { type: 'delta', text: 'Use the [vignette tool](/tools/add-vignette) or see [evil](https://evil.example).' },
      { type: 'action', callId: 'a', kind: 'open_tool', label: 'Open Vignette', params: { slug: 'add-vignette', route: '/tools/add-vignette', preset: 'vintage' } },
      { type: 'usage', inputTokens: 1, outputTokens: 1, cachedTokens: 0, costUsd: 0 },
      { type: 'done' },
    ]);
    renderSheet('ru-RU');
    fireEvent.click(screen.getByText('Which tool do I need?'));
    const action = await screen.findByTestId('medi-action');
    expect(action.getAttribute('data-href')).toBe('/ru/tools/add-vignette?preset=vintage');
    expect(screen.getByText('vignette tool').closest('a')?.getAttribute('href')).toBe('/ru/tools/add-vignette');
    expect(screen.getByText('evil').closest('a')).toBeNull();
    fireEvent.click(action);
    expect(h.push).toHaveBeenCalledWith('/ru/tools/add-vignette?preset=vintage');
    expect(h.track).toHaveBeenCalledWith('assistant_action_clicked', { surface: 'guide', kind: 'open_tool' });
    expect(h.track).toHaveBeenCalledWith('assistant_message_sent', { surface: 'guide', has_frame: false, turn_index_bucket: '1', plan: false });
    expect(h.track).toHaveBeenCalledWith('assistant_response_completed', expect.objectContaining({ surface: 'guide', model_tier: 'guide', outcome: 'action', tool_rounds: 0 }));
    const body = h.stream.mock.calls[0][0];
    expect(body).toMatchObject({ surface: 'guide', locale: 'ru-RU', message: { text: 'Which tool do I need?' } });
  });

  it('Stop aborts the stream and says so', async () => {
    streamWith(
      (emit, signal) =>
        new Promise((_res, rej) => {
          emit({ type: 'meta', conversationId: null, turnId: 't', model: 'm' });
          signal?.addEventListener('abort', () => rej(Object.assign(new Error('aborted'), { name: 'AbortError' })));
        }),
    );
    renderSheet();
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'hello' } });
    fireEvent.submit(screen.getByRole('textbox').closest('form')!);
    fireEvent.click(await screen.findByTestId('medi-stop'));
    await screen.findByText('Stopped.');
    expect(h.track).toHaveBeenCalledWith('assistant_response_failed', { surface: 'guide', reason: 'aborted' });
  });

  it('renders the spend-cap static answer and reports outcome static', async () => {
    streamWith([
      { type: 'meta', conversationId: null, turnId: 't', model: 'm' },
      { type: 'delta', text: "I'm taking a short break today, so here are the help pages:\n\n- [Pricing](/pricing)" },
      { type: 'usage', inputTokens: 0, outputTokens: 0, cachedTokens: 0, costUsd: 0 },
      { type: 'done', outcome: 'static' },
    ]);
    renderSheet();
    fireEvent.click(screen.getByText('What does Premium include?'));
    expect((await screen.findByText('Pricing')).closest('a')?.getAttribute('href')).toBe('/pricing');
    expect(h.track).toHaveBeenCalledWith('assistant_response_completed', expect.objectContaining({ outcome: 'static' }));
  });

  it('shows the localized error for a refusal and tracks the reason', async () => {
    streamWith([{ type: 'error', code: 'rate_limited', message: 'HTTP 429' }]);
    renderSheet();
    fireEvent.click(screen.getByText('Make a GIF from a video'));
    await screen.findByText(/a lot of questions/);
    expect(h.track).toHaveBeenCalledWith('assistant_response_failed', { surface: 'guide', reason: 'rate_limited' });
  });

  it('signed in: thumbs send feedback once and track it', async () => {
    h.user = { uid: 'u' };
    streamWith([
      { type: 'meta', conversationId: '00000000-0000-4000-8000-000000000001', turnId: 't', model: 'm' },
      { type: 'delta', text: 'Done.' },
      { type: 'done', messageId: 'msg-1' },
    ]);
    renderSheet();
    fireEvent.click(screen.getByText('Edit a photo like a pro'));
    fireEvent.click(await screen.findByLabelText('Helpful'));
    await waitFor(() => expect(h.feedback).toHaveBeenCalledWith('msg-1', 'up'));
    expect(h.track).toHaveBeenCalledWith('assistant_feedback_given', { surface: 'guide', rating: 'up' });
    expect(screen.getByText('Thanks for the feedback.')).toBeTruthy();
    // The next message continues the same conversation.
    streamWith([{ type: 'done' }]);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'more' } });
    fireEvent.submit(screen.getByRole('textbox').closest('form')!);
    await waitFor(() => expect(h.stream).toHaveBeenCalledTimes(2));
    expect(h.stream.mock.calls[1][0]).toMatchObject({ conversationId: '00000000-0000-4000-8000-000000000001' });
  });

  it('guests get no thumbs (nothing stored to rate)', async () => {
    streamWith([{ type: 'delta', text: 'Hi.' }, { type: 'done' }]);
    renderSheet();
    fireEvent.click(screen.getByText('Make a GIF from a video'));
    await screen.findByText('Hi.');
    expect(screen.queryByLabelText('Helpful')).toBeNull();
  });

  it('teases the copilot on an Aperture tool page', () => {
    h.pathname = '/tools/color-pop';
    renderSheet();
    expect(screen.getByTestId('medi-copilot-teaser').textContent).toContain('Open Aperture');
  });
});
