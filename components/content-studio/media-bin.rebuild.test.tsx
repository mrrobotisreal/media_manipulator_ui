import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render as rtlRender, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactElement } from 'react';
import { createCreatvBackend, createMmBackend, type StudioBackend } from '@/lib/studio/studioBackend';
import type { StudioAsset } from '@/lib/studioTypes';

// MM71: the media bin's "Rebuild old previews" strip and per-clip "Rebuild
// preview" item exist only where the backend can rebuild (MM, not the CreaTV
// embed) and never on a translator deployment.
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

import { useStudioStore } from '@/lib/studioStore';
import MediaBin from './media-bin';

const asset = (id: string, proxyGeneration?: number): StudioAsset => ({
  id, projectId: 'p1', originalFileName: `${id}.mp4`, s3KeyOriginal: id, s3KeyProxy: `${id}_proxy.mp4`, mediaKind: 'video',
  durationSeconds: 30, hasAudio: false, probeJson: null, createdAt: '2026-01-01T00:00:00Z',
  ...(proxyGeneration === undefined ? {} : { proxyGeneration }),
});

const render = (ui: ReactElement) =>
  rtlRender(<QueryClientProvider client={new QueryClient()}>{ui}</QueryClientProvider>);

const strip = () => screen.queryByText('contentStudio.mediaBin.rebuildOldHint');

beforeEach(() => {
  vi.stubEnv('NEXT_PUBLIC_DEPLOY_ROLE', '');
  useStudioStore.getState().setAssets([asset('old', 0), asset('new', 1)]);
});
afterEach(() => {
  cleanup();
  vi.unstubAllEnvs();
  useStudioStore.getState().setAssets([]);
});

describe('MediaBin proxy rebuild gate (MM71)', () => {
  it('MM backend: offers the rebuild for the old clip', () => {
    backend = createMmBackend();
    render(<MediaBin projectId="p1" />);
    expect(strip()).toBeTruthy();
    expect(screen.getByRole('button', { name: /contentStudio\.mediaBin\.rebuildAll/ })).toBeTruthy();
  });

  it('CreaTV embed backend: no rebuild anywhere', () => {
    backend = createCreatvBackend({ apiBaseUrl: 'https://api.example', scope: { userId: 1, channelId: 2, draftId: 3 }, getToken: () => 't' });
    render(<MediaBin projectId="p1" />);
    expect(strip()).toBeNull();
  });

  it('translator deployment: hidden', () => {
    vi.stubEnv('NEXT_PUBLIC_DEPLOY_ROLE', 'translator');
    backend = createMmBackend();
    render(<MediaBin projectId="p1" />);
    expect(strip()).toBeNull();
  });

  it('an API older than MM71 (no proxyGeneration): hidden', () => {
    backend = createMmBackend();
    useStudioStore.getState().setAssets([asset('legacy')]);
    render(<MediaBin projectId="p1" />);
    expect(strip()).toBeNull();
  });
});
