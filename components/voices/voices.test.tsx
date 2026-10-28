import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, screen, waitFor } from '@testing-library/react';

import { caps, fakeFetch, renderWithQuery } from './test-utils';

// MM78 acceptance 2-5, 7, 8: recorder gate, consent gate, designer counter, shifter
// presets, anonymous flows (no upload before sign-in), capabilities states. The network
// is a fake behind authedFetch; every request the UI makes is recorded.

vi.mock('@/i18n/useLocalization', async () => (await import('./test-utils')).localizationMock());
vi.mock('@/i18n/useLocalizedHref', () => ({ useLocalizedHref: () => (p: string) => p }));
vi.mock('@/components/quota-chip', () => ({ QuotaChip: () => null }));
vi.mock('@/lib/useGetJobStatus', () => ({ default: () => ({ data: undefined }) }));

const auth = vi.hoisted(() => ({ value: { user: null as null | { uid: string }, loading: false, openAuth: vi.fn() } }));
vi.mock('@/lib/auth/AuthProvider', () => ({ useAuth: () => auth.value }));

const net = vi.hoisted(() => ({ fn: null as null | ((u: string, i?: RequestInit) => Promise<Response>) }));
vi.mock('@/lib/auth/authedFetch', () => ({ authedFetch: (u: string, i?: RequestInit) => net.fn!(u, i) }));

import { VoiceCloningPanel } from './voice-cloning-panel';
import { VoiceDesignerPanel } from './voice-designer-panel';
import { VoiceChangerPanel } from './voice-changer-panel';
import { VOICE_SHIFT_PRESETS } from '@/lib/voices/shift';

type Routes = Parameters<typeof fakeFetch>[0];
let calls: ReturnType<typeof fakeFetch>['calls'];

function serve(capabilities = caps(), extra: Routes = {}) {
  const f = fakeFetch({
    'GET /voices/capabilities': () => ({ status: 200, body: capabilities }),
    'GET /voices': () => ({ status: 200, body: { voices: [], limit: capabilities.limits.voicesSaved, used: 0 } }),
    'POST /voices': () => ({ status: 201, body: { id: '11111111-1111-1111-1111-111111111111', name: 'Me', kind: 'cloned', languageHint: 'en', engineVersion: 'x', consentAt: null, createdAt: '', updatedAt: '' } }),
    'POST /voices/design/preview': () => ({ status: 200, body: { seed: 42, mime: 'audio/mpeg', seconds: 3, audioBase64: btoa('ID3') } }),
    'POST /voices/shift': () => ({ status: 202, body: { jobId: 'job-shift', tool: 'voice_shift' } }),
    'POST /voices/convert': () => ({ status: 202, body: { jobId: 'job-conv', tool: 'voice_convert' } }),
    'POST /voices/presets/[^/]+/speak': () => ({ status: 202, body: { jobId: 'job-tts', tool: 'voice_tts' } }),
    ...extra,
  });
  net.fn = f.fn;
  calls = f.calls;
}

const posts = () => calls.filter((c) => (c.init?.method ?? 'GET') !== 'GET');

/** Make the next <audio> element report `seconds` once its src is set (upload length probe). */
function stubAudioDuration(seconds: number) {
  const real = document.createElement.bind(document);
  vi.spyOn(document, 'createElement').mockImplementation(((tag: string, opts?: ElementCreationOptions) => {
    const el = real(tag, opts);
    if (tag === 'audio') {
      Object.defineProperty(el, 'duration', { value: seconds, configurable: true });
      Object.defineProperty(el, 'src', {
        configurable: true,
        set() {
          setTimeout(() => (el as HTMLAudioElement).onloadedmetadata?.(new Event('loadedmetadata')), 0);
        },
      });
    }
    return el;
  }) as typeof document.createElement);
}

async function upload(seconds: number, name = 'take.wav') {
  stubAudioDuration(seconds);
  const input = await screen.findByTestId('voice-file-input');
  await act(async () => {
    fireEvent.change(input, { target: { files: [new File(['abc'], name, { type: 'audio/wav' })] } });
  });
  await waitFor(() => expect(screen.getByTestId('voice-clip')).toBeTruthy());
}

beforeEach(() => {
  auth.value = { user: null, loading: false, openAuth: vi.fn() };
  Object.assign(URL, { createObjectURL: vi.fn(() => 'blob:x'), revokeObjectURL: vi.fn() });
  vi.stubGlobal('MediaRecorder', undefined);
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

const signIn = () => {
  auth.value = { ...auth.value, user: { uid: 'u1' } };
};

describe('recorder length gate (acceptance 2)', () => {
  beforeEach(() => {
    signIn();
    serve(caps({ signedIn: true }));
  });

  it.each([
    [4.9, 'at least 5 seconds'],
    [60.1, '60 seconds or less'],
  ])('a %s s take disables Create with the right message', async (seconds, message) => {
    renderWithQuery(<VoiceCloningPanel />);
    await upload(seconds);
    expect(screen.getByTestId('voice-length-message').textContent).toContain(message);
    fireEvent.change(screen.getByLabelText('Voice name'), { target: { value: 'Me' } });
    fireEvent.click(screen.getByRole('checkbox'));
    expect((screen.getByRole('button', { name: 'Create voice' }) as HTMLButtonElement).disabled).toBe(true);
  });

  it('a 10 s take passes the gate', async () => {
    renderWithQuery(<VoiceCloningPanel />);
    await upload(10);
    expect(screen.queryByTestId('voice-length-message')).toBeNull();
    fireEvent.change(screen.getByLabelText('Voice name'), { target: { value: 'Me' } });
    fireEvent.click(screen.getByRole('checkbox'));
    expect((screen.getByRole('button', { name: 'Create voice' }) as HTMLButtonElement).disabled).toBe(false);
  });
});

describe('consent gate (acceptance 3)', () => {
  it('Create stays disabled until the box is ticked; the request carries consent=true and the text version', async () => {
    signIn();
    serve(caps({ signedIn: true }));
    renderWithQuery(<VoiceCloningPanel />);
    await upload(12);
    fireEvent.change(screen.getByLabelText('Voice name'), { target: { value: 'My voice' } });
    const create = screen.getByRole('button', { name: 'Create voice' }) as HTMLButtonElement;
    expect(create.disabled).toBe(true);
    expect(screen.getByLabelText('This is my voice, or I have the explicit permission of the person whose voice this is.')).toBeTruthy();
    fireEvent.click(screen.getByRole('checkbox'));
    expect(create.disabled).toBe(false);
    await act(async () => {
      fireEvent.click(create);
    });
    await waitFor(() => expect(posts().some((c) => /\/voices$/.test(c.url))).toBe(true));
    const form = posts().find((c) => /\/voices$/.test(c.url))!.init!.body as FormData;
    expect(form.get('consent')).toBe('true');
    expect(form.get('consentTextVersion')).toBe('2026-10-28');
    expect(form.get('name')).toBe('My voice');
    expect(await screen.findByText(/Voice created/)).toBeTruthy();
  });
});

describe('designer preview counter (acceptance 4)', () => {
  it('counts 3 to 0, then disables Preview with a message; a changed description resets it', async () => {
    serve();
    renderWithQuery(<VoiceDesignerPanel />);
    const desc = await screen.findByLabelText('Description');
    fireEvent.change(desc, { target: { value: 'warm, low' } });
    const counter = () => screen.getByTestId('previews-left').textContent;
    expect(counter()).toBe('Previews left: 3 of 3');
    for (const left of [2, 1, 0]) {
      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: 'Preview' }));
      });
      await waitFor(() => expect(counter()).toBe(`Previews left: ${left} of 3`));
    }
    expect((screen.getByRole('button', { name: 'Preview' }) as HTMLButtonElement).disabled).toBe(true);
    expect(screen.getByTestId('previews-used').textContent).toMatch(/used the 3 previews/);
    fireEvent.change(desc, { target: { value: 'warm, low, slow pace' } });
    expect(counter()).toBe('Previews left: 3 of 3');
    expect((screen.getByRole('button', { name: 'Preview' }) as HTMLButtonElement).disabled).toBe(false);
  });

  it('a server preview_limit (another tab) also drops the counter to 0', async () => {
    serve(caps(), { 'POST /voices/design/preview': () => ({ status: 429, body: { error: 'preview_limit', limit: 3 } }) });
    renderWithQuery(<VoiceDesignerPanel />);
    fireEvent.change(await screen.findByLabelText('Description'), { target: { value: 'bright' } });
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Preview' }));
    });
    await waitFor(() => expect(screen.getByTestId('previews-left').textContent).toBe('Previews left: 0 of 3'));
    expect(screen.getByRole('alert').textContent).toMatch(/three times this hour/);
  });
});

describe('shifter presets (acceptance 5)', () => {
  it.each(VOICE_SHIFT_PRESETS.map((p) => [p.id, p.semitones, p.formant] as const))(
    '%s sends semitones %s and formant %s',
    async (id, semitones, formant) => {
      serve();
      renderWithQuery(<VoiceChangerPanel />);
      await upload(8, 'clip.wav');
      const chip = { deeper: 'Deeper', higher: 'Higher', child: 'Child-like', elder: 'Older', telephone: 'Telephone' }[id];
      fireEvent.click(screen.getByRole('button', { name: chip }));
      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: 'Shift voice' }));
      });
      const form = posts().find((c) => c.url.endsWith('/voices/shift'))!.init!.body as FormData;
      expect([form.get('preset'), Number(form.get('semitones')), form.get('formant')]).toEqual([id, semitones, formant]);
    },
  );

  it('moving the slider after a preset sends a custom pair (no preset)', async () => {
    serve();
    renderWithQuery(<VoiceChangerPanel />);
    await upload(8);
    fireEvent.click(screen.getByRole('button', { name: 'Deeper' }));
    fireEvent.change(screen.getByLabelText(/^Pitch/), { target: { value: '3' } });
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Shift voice' }));
    });
    const form = posts().find((c) => c.url.endsWith('/voices/shift'))!.init!.body as FormData;
    expect([form.get('preset'), form.get('semitones'), form.get('formant')]).toEqual([null, '3', 'shifted']);
  });
});

describe('anonymous visitors (acceptance 7)', () => {
  it('the shifter runs without an account', async () => {
    serve();
    renderWithQuery(<VoiceChangerPanel />);
    await upload(8);
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Shift voice' }));
    });
    expect(posts().map((c) => c.url.replace(/^.*\/api/, ''))).toEqual(['/voices/shift']);
  });

  it('preset speech runs without an account', async () => {
    serve();
    renderWithQuery(<VoiceCloningPanel />);
    fireEvent.change(await screen.findByLabelText('Text to speak'), { target: { value: 'Hello there' } });
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Generate speech' }));
    });
    expect(posts().map((c) => c.url.replace(/^.*\/api/, ''))).toEqual(['/voices/presets/Vivian/speak']);
  });

  it('cloning shows the sign-in prompt and no recorder: nothing can be uploaded', async () => {
    serve();
    renderWithQuery(<VoiceCloningPanel />);
    expect(await screen.findByTestId('voices-sign-in')).toBeTruthy();
    expect(screen.queryByTestId('voice-file-input')).toBeNull();
    expect(screen.queryByRole('button', { name: 'Create voice' })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }));
    expect(auth.value.openAuth).toHaveBeenCalledWith({ intent: 'signin', source: 'voice_cloning' });
    expect(posts()).toEqual([]);
    expect(calls.some((c) => /\/voices$/.test(c.url))).toBe(false);
  });

  it('keeping a designed voice asks for sign-in; only the free preview went out', async () => {
    serve();
    renderWithQuery(<VoiceDesignerPanel />);
    fireEvent.change(await screen.findByLabelText('Description'), { target: { value: 'warm' } });
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Preview' }));
    });
    expect(await screen.findByTestId('voices-sign-in')).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Keep this voice' })).toBeNull();
    expect(posts().map((c) => c.url.replace(/^.*\/api/, ''))).toEqual(['/voices/design/preview']);
  });

  it('convert asks for sign-in before any upload', async () => {
    serve();
    renderWithQuery(<VoiceChangerPanel />);
    await upload(8);
    fireEvent.click(screen.getByRole('radio', { name: /Convert to a voice/ }));
    expect(screen.getByTestId('voices-sign-in')).toBeTruthy();
    expect((screen.getByRole('button', { name: 'Convert' }) as HTMLButtonElement).disabled).toBe(true);
    expect(posts()).toEqual([]);
  });

  it('a signed-in plan without conversion sees the upgrade hint, not a form', async () => {
    signIn();
    serve(caps({ signedIn: true, limits: { ...caps().limits, voicesConvert: false } }));
    renderWithQuery(<VoiceChangerPanel />);
    await upload(8);
    fireEvent.click(screen.getByRole('radio', { name: /Convert to a voice/ }));
    expect(screen.getByTestId('voices-upgrade').textContent).toMatch(/not part of your plan/);
    expect((screen.getByRole('button', { name: 'Convert' }) as HTMLButtonElement).disabled).toBe(true);
    expect(posts()).toEqual([]);
  });
});

describe('capabilities states (acceptance 8)', () => {
  it('enabled:false renders the unavailable state instead of the form', async () => {
    serve(caps({ enabled: false }));
    renderWithQuery(<VoiceCloningPanel />);
    expect(await screen.findByTestId('voices-unavailable')).toBeTruthy();
    expect(screen.getByText('Voices is not available right now')).toBeTruthy();
    expect(screen.queryByLabelText('Text to speak')).toBeNull();
  });

  it('the voice changer keeps its shifter when the engine is off', async () => {
    serve(caps({ enabled: false }));
    renderWithQuery(<VoiceChangerPanel />);
    expect(await screen.findByText(/does not need the voice engine/)).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Shift voice' })).toBeTruthy();
  });

  it('warm:false with a request in flight shows the warming-up text', async () => {
    let release: () => void = () => undefined;
    serve(caps({ warm: false }));
    const base = net.fn!;
    net.fn = (u, i) =>
      /presets\/.+\/speak$/.test(u)
        ? new Promise((resolve) => {
            release = () => resolve(new Response(JSON.stringify({ jobId: 'j', tool: 'voice_tts' }), { status: 202 }));
          })
        : base(u, i);
    renderWithQuery(<VoiceCloningPanel />);
    fireEvent.change(await screen.findByLabelText('Text to speak'), { target: { value: 'Hi' } });
    expect(screen.queryByTestId('voices-warming-up')).toBeNull();
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Generate speech' }));
    });
    expect((await screen.findByTestId('voices-warming-up')).textContent).toBe(
      'Warming up the voice engine, the first request can take up to 20 seconds.',
    );
    await act(async () => release());
  });

  it('warm:true never shows it', async () => {
    serve(caps({ warm: true }));
    renderWithQuery(<VoiceCloningPanel />);
    fireEvent.change(await screen.findByLabelText('Text to speak'), { target: { value: 'Hi' } });
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Generate speech' }));
    });
    expect(screen.queryByTestId('voices-warming-up')).toBeNull();
  });

  it('the speak counter follows the tier cap and blocks over-long text', async () => {
    serve(caps({ limits: { ...caps().limits, textMaxChars: 10 } }));
    renderWithQuery(<VoiceCloningPanel />);
    const text = await screen.findByLabelText('Text to speak');
    fireEvent.change(text, { target: { value: 'twelve chars' } });
    expect(screen.getByTestId('speak-counter').textContent).toMatch(/^12 of 10 characters/);
    expect((screen.getByRole('button', { name: 'Generate speech' }) as HTMLButtonElement).disabled).toBe(true);
  });
});
