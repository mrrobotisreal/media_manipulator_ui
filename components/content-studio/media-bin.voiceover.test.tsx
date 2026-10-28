import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render as rtlRender, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactElement } from 'react';
import { createCreatvBackend, createMmBackend, type StudioBackend } from '@/lib/studio/studioBackend';
import { fetchStudioCapabilities, parseStudioCapabilities, voiceoverAvailable } from '@/lib/studio/voiceoverGenerate';

// MM79 acceptance 3: the media bin's Generate voiceover action is shown only when the
// backend has the route AND GET /studio/capabilities says voices:true. Hidden for the
// CreaTV embed backend (whatever the host sends), for an API without the route (404),
// for voices:false, and on translator deployments.
let backend: StudioBackend = createMmBackend();

vi.mock('@/i18n/useLocalization', () => ({
  useLocalization: () => ({ t: (k: string) => k, formatReadableDuration: () => '0:30', language: { code: 'en-US' } }),
}));
vi.mock('@/lib/studio/studioBackendProvider', () => ({ useStudioBackend: () => backend }));
vi.mock('@/lib/analytics', async (orig) => ({
  ...(await orig<typeof import('@/lib/analytics')>()),
  analytics: { track: vi.fn() },
}));
vi.mock('@dnd-kit/core', () => ({
  useDraggable: () => ({ attributes: {}, listeners: {}, setNodeRef: () => {}, isDragging: false }),
  useDroppable: () => ({ setNodeRef: () => {}, isOver: false }),
}));
vi.mock('./voiceover-recorder', () => ({ default: () => null }));

import MediaBin from './media-bin';

const render = (ui: ReactElement) =>
  rtlRender(<QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>{ui}</QueryClientProvider>);

/** An MM backend whose fetch answers GET /studio/capabilities with `answer`. */
function mmWith(answer: { status: number; body?: unknown } | 'throw'): StudioBackend {
  const b = createMmBackend();
  const calls: string[] = [];
  b.fetch = async (url: string) => {
    calls.push(url);
    if (answer === 'throw') throw new Error('network');
    return new Response(JSON.stringify(answer.body ?? {}), { status: answer.status });
  };
  (b as StudioBackend & { calls: string[] }).calls = calls;
  return b;
}

const button = () => screen.queryByTestId('generate-voiceover');

beforeEach(() => vi.stubEnv('NEXT_PUBLIC_DEPLOY_ROLE', ''));
afterEach(() => {
  cleanup();
  vi.unstubAllEnvs();
});

describe('Generate voiceover gate (MM79)', () => {
  it('MM backend + voices:true: the action is shown', async () => {
    backend = mmWith({ status: 200, body: { voices: true } });
    render(<MediaBin projectId="p1" />);
    await waitFor(() => expect(button()).toBeTruthy());
  });

  it('MM backend + voices:false: hidden', async () => {
    backend = mmWith({ status: 200, body: { voices: false } });
    render(<MediaBin projectId="p1" />);
    await waitFor(() => expect((backend as StudioBackend & { calls: string[] }).calls.length).toBe(1));
    expect(button()).toBeNull();
  });

  it('an API without capabilities.voices (404, or a body without the field): hidden', async () => {
    for (const answer of [{ status: 404 }, { status: 200, body: {} }, 'throw' as const]) {
      backend = mmWith(answer);
      render(<MediaBin projectId="p1" />);
      await waitFor(() => expect((backend as StudioBackend & { calls: string[] }).calls.length).toBe(1));
      expect(button()).toBeNull();
      cleanup();
    }
  });

  it('CreaTV embed backend: hidden and never asks, even if the host claims voices', async () => {
    const calls: string[] = [];
    backend = createCreatvBackend({
      apiBaseUrl: 'https://api.example',
      scope: { userId: 1, channelId: 2, draftId: 3 },
      getToken: () => 't',
      capabilities: { voices: true } as never,
    });
    backend.fetch = async (url: string) => {
      calls.push(url);
      return new Response('{"voices":true}', { status: 200 });
    };
    expect(backend.capabilities.voices).toBe(false);
    expect(backend.voiceoverUrl).toBeUndefined();
    render(<MediaBin projectId="3" />);
    await new Promise((r) => setTimeout(r, 20));
    expect(button()).toBeNull();
    expect(calls.filter((u) => u.includes('capabilities'))).toEqual([]);
  });

  it('translator deployment: hidden', async () => {
    vi.stubEnv('NEXT_PUBLIC_DEPLOY_ROLE', 'translator');
    backend = mmWith({ status: 200, body: { voices: true } });
    render(<MediaBin projectId="p1" />);
    await new Promise((r) => setTimeout(r, 20));
    expect(button()).toBeNull();
  });
});

describe('studio capabilities helpers', () => {
  it('parse is strict: only voices === true counts', () => {
    expect(parseStudioCapabilities({ voices: true })).toEqual({ voices: true });
    expect(parseStudioCapabilities({ voices: 'yes' })).toEqual({ voices: false });
    expect(parseStudioCapabilities(null)).toEqual({ voices: false });
  });
  it('fetch never throws and reads the MM route', async () => {
    const b = mmWith('throw');
    await expect(fetchStudioCapabilities(b)).resolves.toEqual({ voices: false });
    const ok = mmWith({ status: 200, body: { voices: true } });
    await expect(fetchStudioCapabilities(ok)).resolves.toEqual({ voices: true });
    expect((ok as StudioBackend & { calls: string[] }).calls[0]).toMatch(/\/studio\/capabilities$/);
  });
  it('voiceoverAvailable needs the route and the server flag', () => {
    const mm = createMmBackend();
    expect(voiceoverAvailable(mm, true)).toBe(true);
    expect(voiceoverAvailable(mm, false)).toBe(false);
    expect(voiceoverAvailable({ ...mm, voiceoverUrl: undefined }, true)).toBe(false);
  });
});
