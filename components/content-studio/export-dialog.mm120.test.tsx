import { act } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';

// MM120: the export dialog's Pro formats: ProRes shows the 8-bit-source note and the size
// estimate (with the over-4-GB warning), AV1 shows its playback warning and no estimate, and a
// Premium caller's Pro presets carry the Pro badge.
const state = {
  project: { name: 'p', durationSeconds: 60, width: 1920, height: 1080, fps: 30, captions: [], tracks: [] } as Record<string, unknown>,
  toSaveRequest: vi.fn(() => ({})),
  markSaved: vi.fn(),
};
const PREMIUM = ['mp4', 'mov', 'mkv', 'webm', 'mp3', 'wav', 'opus', 'h264', 'hevc', 'vp9', 'aac', 'pcm_s16le', 'vorbis', 'subs_embedded'];
const PRO = [...PREMIUM, 'flac', 'av1', 'prores', 'pcm_s24le'];
const auth = { tier: 'pro', limits: { studioFormats: PRO, studioAdvanced: true } as Record<string, unknown> };

vi.mock('@/i18n/useLocalization', () => ({
  useLocalization: () => ({ t: (k: string, v?: Record<string, unknown>) => (v?.size ? `${k}:${v.size}` : k), language: { code: 'en-US' } }),
}));
vi.mock('@/lib/studio/studioBackendProvider', () => ({
  useStudioBackend: () => ({ ecosystem: 'mm', capabilities: { publish: false, exportDepth: true }, scope: null }),
}));
vi.mock('./embed-bridge', () => ({ useEmbedBridgeOptional: () => null }));
vi.mock('@/lib/studioStore', () => {
  const useStudioStore = Object.assign(<T,>(sel: (s: typeof state) => T) => sel(state), { getState: () => state });
  return { useStudioStore };
});
vi.mock('@/lib/useStudioProject', () => ({ useSaveProject: () => ({ isPending: false, mutateAsync: vi.fn(async () => ({})) }) }));
vi.mock('@/lib/useStudioExport', () => ({ useStartStudioExport: () => ({ startExport: vi.fn(async () => ({ jobId: 'j1' })), isStarting: false }), studioDownloadUrl: () => '' }));
vi.mock('@/lib/useStudioJob', () => ({ useStudioJobProgress: () => null }));
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

import ExportDialog, { formatEstimate } from './export-dialog';
import { exportDialogBridge } from '@/lib/studio/editorBridges';
import { prefillFromParams } from '@/lib/studio/exportOptions';

beforeEach(() => {
  globalThis.ResizeObserver ??= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver;
  auth.tier = 'pro';
  auth.limits = { studioFormats: PRO, studioAdvanced: true };
  state.project = { ...state.project, durationSeconds: 60, height: 1080, width: 1920 };
});
afterEach(() => cleanup());

const open = (params: Record<string, unknown>) =>
  act(() => {
    exportDialogBridge.request(prefillFromParams(params));
  });

describe('ExportDialog MM120', () => {
  it('ProRes shows the 8-bit-source note and the size estimate (~1.1 GB a minute at 1080p30)', () => {
    render(<ExportDialog projectId="p1" />);
    open({ preset: 'mov_prores' });
    expect(screen.getByTestId('export-prores-note').textContent).toBe('contentStudio.export.proresNote');
    const est = screen.getByTestId('export-size-estimate').textContent ?? '';
    expect(est).toBe('contentStudio.export.sizeEstimate:≈ 1.1 GB');
    expect(est).not.toContain('sizeLarge');
  });

  it('a long 4K ProRes export warns above 4 GB', () => {
    state.project = { ...state.project, durationSeconds: 300, height: 2160, width: 3840 };
    render(<ExportDialog projectId="p1" />);
    open({ preset: 'mov_prores' });
    expect(screen.getByTestId('export-size-estimate').textContent).toContain('contentStudio.export.sizeLarge');
  });

  it('AV1 shows its playback warning and no size estimate (constant quality)', () => {
    render(<ExportDialog projectId="p1" />);
    open({ preset: 'mp4_av1' });
    expect(screen.getByText('contentStudio.export.warning_av1_playback')).toBeTruthy();
    expect(screen.queryByTestId('export-size-estimate')).toBeNull();
    expect(screen.queryByTestId('export-prores-note')).toBeNull();
  });

  it('formatEstimate', () => {
    expect(formatEstimate(1_124_280_000)).toBe('≈ 1.1 GB');
    expect(formatEstimate(345_600_000)).toBe('≈ 346 MB');
    expect(formatEstimate(10)).toBe('≈ 1 MB');
  });
});
