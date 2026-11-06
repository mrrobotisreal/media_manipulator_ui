import { act } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';

// MM119: the export dialog's embedded captions mode (plain-text note, Premium lock) and the
// Queued display state of a VP9 export waiting for a server CPU encode slot.
const state = {
  project: { name: 'p', durationSeconds: 10, height: 1080, captions: [{ id: 'c1', startSeconds: 0, endSeconds: 1, text: 'hi' }], tracks: [] },
  toSaveRequest: vi.fn(() => ({})),
  markSaved: vi.fn(),
};
const auth = { tier: 'premium', limits: { studioFormats: ['mp4', 'mov', 'mkv', 'webm', 'mp3', 'wav', 'opus', 'h264', 'hevc', 'vp9', 'aac', 'pcm_s16le', 'vorbis', 'subs_embedded'], studioAdvanced: true } as Record<string, unknown> };
let job: { status: string; progress: number; queued?: boolean } | null = null;
const startExport = vi.fn(async () => ({ jobId: 'j1' }));

vi.mock('@/i18n/useLocalization', () => ({ useLocalization: () => ({ t: (k: string) => k, language: { code: 'en-US' } }) }));
vi.mock('@/lib/studio/studioBackendProvider', () => ({
  useStudioBackend: () => ({ ecosystem: 'mm', capabilities: { publish: false, exportDepth: true }, scope: null }),
}));
vi.mock('./embed-bridge', () => ({ useEmbedBridgeOptional: () => null }));
vi.mock('@/lib/studioStore', () => {
  const useStudioStore = Object.assign(<T,>(sel: (s: typeof state) => T) => sel(state), { getState: () => state });
  return { useStudioStore };
});
vi.mock('@/lib/useStudioProject', () => ({ useSaveProject: () => ({ isPending: false, mutateAsync: vi.fn(async () => ({})) }) }));
vi.mock('@/lib/useStudioExport', () => ({ useStartStudioExport: () => ({ startExport, isStarting: false }), studioDownloadUrl: () => '' }));
vi.mock('@/lib/useStudioJob', () => ({ useStudioJobProgress: () => job }));
vi.mock('@/lib/auth/AuthProvider', () => ({ useAuth: () => auth }));
vi.mock('@tanstack/react-query', async (orig) => ({
  ...(await orig<typeof import('@tanstack/react-query')>()),
  useQueryClient: () => ({ invalidateQueries: vi.fn() }),
  useQuery: () => ({ data: undefined }),
}));
vi.mock('@/lib/analytics', async (orig) => ({
  ...(await orig<typeof import('@/lib/analytics')>()),
  analytics: { track: vi.fn() },
  markJobStarted: vi.fn(),
}));

import ExportDialog from './export-dialog';
import { exportDialogBridge } from '@/lib/studio/editorBridges';
import { prefillFromParams } from '@/lib/studio/exportOptions';

beforeEach(() => {
  globalThis.ResizeObserver ??= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver;
  job = null;
  auth.tier = 'premium';
  startExport.mockClear();
});
afterEach(() => cleanup());

const open = (params: Record<string, unknown>) =>
  act(() => {
    exportDialogBridge.request(prefillFromParams(params));
  });

describe('ExportDialog MM119', () => {
  it('embedded captions prefilled by Medi show the plain-text note', () => {
    render(<ExportDialog projectId="p1" />);
    open({ preset: 'webm_vp9_opus', captionsMode: 'embedded' });
    expect(screen.getByText('contentStudio.export.captionsEmbeddedHint')).toBeTruthy();
    expect(screen.queryByText('contentStudio.export.captionsHint')).toBeNull();
  });

  it('an audio-only output drops the captions field (no embedded track possible)', () => {
    render(<ExportDialog projectId="p1" />);
    open({ preset: 'audio_opus', captionsMode: 'embedded' });
    expect(screen.queryByText('contentStudio.export.captions')).toBeNull();
  });

  it('a free caller asking for embedded falls back to sidecar (the track is Premium)', () => {
    auth.tier = 'free';
    const prev = auth.limits;
    auth.limits = { studioFormats: ['mp4', 'mp3', 'wav', 'h264', 'hevc', 'aac', 'pcm_s16le'], studioAdvanced: false };
    try {
      render(<ExportDialog projectId="p1" />);
      open({ preset: 'mp4_h264', captionsMode: 'embedded' });
      expect(screen.queryByText('contentStudio.export.captionsEmbeddedHint')).toBeNull();
      expect(screen.getByText('contentStudio.export.captionsHint')).toBeTruthy();
    } finally {
      auth.limits = prev;
    }
  });

  it('a queued job shows Queued, then the render progress once it starts', async () => {
    const { rerender } = render(<ExportDialog projectId="p1" />);
    open({ preset: 'webm_vp9_opus' });
    await act(async () => {
      screen.getByRole('button', { name: /contentStudio\.export\.start/ }).click();
    });
    expect(startExport).toHaveBeenCalledWith(expect.objectContaining({ outputPreset: 'webm_vp9_opus' }));
    job = { status: 'processing', progress: 0, queued: true };
    rerender(<ExportDialog projectId="p1" />);
    expect(screen.getByTestId('export-queued').textContent).toContain('contentStudio.exports.status_queued');
    expect(screen.queryByText(/contentStudio\.export\.rendering/)).toBeNull();
    job = { status: 'processing', progress: 40 };
    rerender(<ExportDialog projectId="p1" />);
    expect(screen.queryByTestId('export-queued')).toBeNull();
    expect(screen.getByText(/contentStudio\.export\.rendering/)).toBeTruthy();
  });
});
