import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, screen, waitFor } from '@testing-library/react';
import { createMmBackend, type StudioBackend } from '@/lib/studio/studioBackend';
import type { StudioAsset, StudioProject } from '@/lib/studioTypes';
import { caps, fakeFetch, renderWithQuery } from '@/components/voices/test-utils';

// MM79 acceptance 3: the Darkroom Generate voiceover dialog. Voices reads go through
// authedFetch (the MM78 client), Darkroom requests through the studio backend; both are
// fakes that record every request.

vi.mock('@/i18n/useLocalization', async () => (await import('@/components/voices/test-utils')).localizationMock());
vi.mock('@/i18n/useLocalizedHref', () => ({ useLocalizedHref: () => (p: string) => p }));
vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }));
const track = vi.hoisted(() => vi.fn());
vi.mock('@/lib/analytics', async (orig) => ({ ...(await orig<typeof import('@/lib/analytics')>()), analytics: { track } }));

const auth = vi.hoisted(() => ({ value: { user: null as null | { uid: string }, loading: false, openAuth: vi.fn() } }));
vi.mock('@/lib/auth/AuthProvider', () => ({ useAuth: () => auth.value }));
const net = vi.hoisted(() => ({ fn: null as null | ((u: string, i?: RequestInit) => Promise<Response>) }));
vi.mock('@/lib/auth/authedFetch', () => ({ authedFetch: (u: string, i?: RequestInit) => net.fn!(u, i) }));

let backend: StudioBackend;
vi.mock('@/lib/studio/studioBackendProvider', () => ({ useStudioBackend: () => backend }));

import { useStudioStore } from '@/lib/studioStore';
import { resetVoiceAnalyticsForTests } from '@/lib/voices/analytics';
import VoiceoverGenerateDialog from './voiceover-generate-dialog';

const SAVED = { id: '11111111-1111-1111-1111-111111111111', name: 'My voice', kind: 'cloned', languageHint: 'en', engineVersion: 'x', consentAt: null, createdAt: '', updatedAt: '' };
const NEW_ASSET: StudioAsset = {
  id: 'asset-vo', projectId: 'p1', originalFileName: 'Generated voiceover.wav', s3KeyOriginal: 'k', s3KeyProxy: 'k_proxy.m4a',
  mediaKind: 'audio', durationSeconds: 4, hasAudio: true, probeJson: null, createdAt: '2026-10-28T00:00:00Z',
};

type Route = (body: unknown) => { status: number; body: unknown };
let studioCalls: Array<{ url: string; body: unknown }>;

function studio(routes: { voiceover?: Route; job?: () => unknown }) {
  backend = createMmBackend();
  studioCalls = [];
  backend.fetch = async (url: string, init?: RequestInit) => {
    const body = init?.body ? JSON.parse(String(init.body)) : undefined;
    studioCalls.push({ url, body });
    if (url.endsWith('/voiceover')) {
      const r = (routes.voiceover ?? (() => ({ status: 202, body: { jobId: 'job-vo', tool: 'voice_tts' } })))(body);
      return new Response(JSON.stringify(r.body), { status: r.status });
    }
    if (url.includes('/job/')) {
      return new Response(JSON.stringify(routes.job ? routes.job() : { status: 'completed', progress: 100, assetId: 'asset-vo', resultSeconds: 12 }), { status: 200 });
    }
    if (url.endsWith('/projects/p1/assets')) return new Response(JSON.stringify({ assets: [NEW_ASSET] }), { status: 200 });
    return new Response('{}', { status: 404 });
  };
}

function voicesNet(signedIn: boolean, capabilities = caps({ signedIn })) {
  net.fn = fakeFetch({
    'GET /voices/capabilities': () => ({ status: 200, body: capabilities }),
    'GET /voices': () => ({ status: 200, body: { voices: signedIn ? [SAVED] : [], limit: 1, used: 1 } }),
  }).fn;
}

const project: StudioProject = {
  id: 'p1', name: 'P', schemaVersion: 2, fps: 30, width: 1920, height: 1080, durationSeconds: 0, tracks: [], captions: [], captionsEnabled: true,
  createdAt: '', updatedAt: '',
} as unknown as StudioProject;

function open(onAssetReady = vi.fn(), onOpenChange = vi.fn()) {
  renderWithQuery(<VoiceoverGenerateDialog projectId="p1" open onOpenChange={onOpenChange} onAssetReady={onAssetReady} pollMs={5} />);
  return { onAssetReady, onOpenChange };
}

const generateButton = () => screen.getByRole('button', { name: /Generate voiceover/ }) as HTMLButtonElement;
const typeText = (v: string) => fireEvent.change(screen.getByLabelText('Text to speak'), { target: { value: v } });

beforeEach(() => {
  auth.value = { user: { uid: 'u1' }, loading: false, openAuth: vi.fn() };
  track.mockClear();
  resetVoiceAnalyticsForTests();
  useStudioStore.setState({ project, assets: {}, playhead: 7.5 } as never);
  studio({});
  voicesNet(true);
});
afterEach(() => cleanup());

describe('Generate voiceover dialog (MM79)', () => {
  it('Generate stays disabled until there is text, and over the cap', async () => {
    open();
    await screen.findByText('My voice');
    expect(generateButton().disabled).toBe(true);
    typeText('Hello');
    expect(generateButton().disabled).toBe(false);
    typeText('a'.repeat(1081));
    expect(generateButton().disabled).toBe(true);
    expect(screen.getByTestId('voiceover-counter').textContent).toContain('1081 of 1080');
  });

  it('gates on a voice: no saved voice and no preset leaves Generate disabled', async () => {
    net.fn = fakeFetch({
      'GET /voices/capabilities': () => ({ status: 200, body: caps({ signedIn: true, presets: [] }) }),
      'GET /voices': () => ({ status: 200, body: { voices: [], limit: 1, used: 0 } }),
    }).fn;
    open();
    await screen.findByLabelText('Text to speak');
    typeText('Hello');
    expect(generateButton().disabled).toBe(true);
  });

  it('success: posts the saved voice, selects the new asset, places it at the playhead, emits voice_generated', async () => {
    const { onAssetReady, onOpenChange } = open();
    await screen.findByText('My voice');
    typeText('  Welcome to the trailer.  ');
    await act(async () => {
      fireEvent.click(generateButton());
    });
    await waitFor(() => expect(onAssetReady).toHaveBeenCalledWith('asset-vo'));
    const post = studioCalls.find((c) => c.url.endsWith('/studio/projects/p1/voiceover'));
    expect(post?.body).toEqual({ voiceId: SAVED.id, text: 'Welcome to the trailer.', language: 'en' });
    const s = useStudioStore.getState();
    expect(s.assets['asset-vo']?.status).toBe('ready');
    const clip = s.project!.tracks.flatMap((t) => t.clips).find((c) => c.assetId === 'asset-vo');
    expect(clip?.timelineStart).toBe(7.5);
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(track).toHaveBeenCalledWith(
      'voice_generated',
      { kind: 'tts', secondsBucket: '10-30', language: 'en', source: 'darkroom' },
      { job_id: 'job-vo', feature: 'voices' },
    );
    const raw = JSON.stringify(track.mock.calls);
    expect(raw).not.toContain('trailer');
    expect(raw).not.toContain('My voice');
  });

  it.each([
    [{ status: 400, body: { error: 'text_too_long', limit: 1080 } }, 'Your plan allows up to 1080 characters'],
    [{ status: 503, body: { error: 'voices_unavailable' } }, 'unavailable'],
    [{ status: 401, body: { error: 'sign_in_required' } }, 'Sign in'],
  ])('errors map to the MM78 messages (%j)', async (answer, fragment) => {
    studio({ voiceover: () => answer });
    open();
    await screen.findByText('My voice');
    typeText('Hello');
    await act(async () => {
      fireEvent.click(generateButton());
    });
    const alert = await screen.findByRole('alert');
    expect(alert.textContent?.toLowerCase()).toContain(fragment.toLowerCase().slice(0, 12));
  });

  it('a failed job shows its error and adds nothing', async () => {
    studio({ job: () => ({ status: 'failed', progress: 0, error: 'The voice engine is unavailable right now.' }) });
    const { onAssetReady } = open();
    await screen.findByText('My voice');
    typeText('Hello');
    await act(async () => {
      fireEvent.click(generateButton());
    });
    expect((await screen.findByRole('alert')).textContent).toContain('voice engine is unavailable');
    expect(onAssetReady).not.toHaveBeenCalled();
    expect(useStudioStore.getState().assets['asset-vo']).toBeUndefined();
  });

  it('anonymous: presets only, with the sign-in prompt for saved voices', async () => {
    auth.value = { user: null, loading: false, openAuth: vi.fn() };
    voicesNet(false);
    open();
    expect(await screen.findByTestId('voiceover-signin')).toBeTruthy();
    expect(screen.queryByText('My voice')).toBeNull();
    typeText('Hello');
    await act(async () => {
      fireEvent.click(generateButton());
    });
    await waitFor(() => expect(studioCalls.some((c) => c.url.endsWith('/voiceover'))).toBe(true));
    const post = studioCalls.find((c) => c.url.endsWith('/voiceover'));
    expect(post?.body).toEqual({ preset: 'Vivian', text: 'Hello', language: 'en' });
  });

  it('voices disabled: the unavailable state, no form', async () => {
    voicesNet(true, caps({ enabled: false }));
    open();
    expect(await screen.findByTestId('voices-unavailable')).toBeTruthy();
    expect(screen.queryByLabelText('Text to speak')).toBeNull();
  });
});
