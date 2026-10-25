import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';

const state = {
  project: { name: 'p', durationSeconds: 10, height: 1080, captions: [] },
  toSaveRequest: vi.fn(),
  markSaved: vi.fn(),
};

vi.mock('@/i18n/useLocalization', () => ({ useLocalization: () => ({ t: (k: string) => k, language: { code: 'en-US' } }) }));
vi.mock('@/lib/studio/studioBackendProvider', () => ({
  useStudioBackend: () => ({ ecosystem: 'mm', capabilities: { publish: false, exportDepth: false }, scope: null }),
}));
vi.mock('./embed-bridge', () => ({ useEmbedBridgeOptional: () => null }));
vi.mock('@/lib/studioStore', () => {
  const useStudioStore = Object.assign(<T,>(sel: (s: typeof state) => T) => sel(state), { getState: () => state });
  return { useStudioStore };
});
vi.mock('@/lib/useStudioProject', () => ({ useSaveProject: () => ({ isPending: false, mutateAsync: vi.fn() }) }));
vi.mock('@/lib/useStudioExport', () => ({
  useStartStudioExport: () => ({ startExport: vi.fn(), isStarting: false }),
  studioDownloadUrl: () => '',
}));
vi.mock('@/lib/useStudioJob', () => ({ useStudioJobProgress: () => null }));
vi.mock('@/lib/auth/AuthProvider', () => ({ useAuth: () => ({ limits: {} }) }));
vi.mock('@tanstack/react-query', async (orig) => ({
  ...(await orig<typeof import('@tanstack/react-query')>()),
  useQueryClient: () => ({ invalidateQueries: vi.fn() }),
}));
vi.mock('@/lib/analytics', async (orig) => ({
  ...(await orig<typeof import('@/lib/analytics')>()),
  analytics: { track: vi.fn() },
}));

import ExportDialog from './export-dialog';

afterEach(() => {
  cleanup();
  vi.unstubAllEnvs();
});

describe('ExportDialog translator gate (MM52)', () => {
  it('translator mode: renders nothing', () => {
    vi.stubEnv('NEXT_PUBLIC_DEPLOY_ROLE', 'translator');
    const { container } = render(<ExportDialog projectId="p1" />);
    expect(container.innerHTML).toBe('');
  });

  it('production: renders the export trigger button', () => {
    vi.stubEnv('NEXT_PUBLIC_DEPLOY_ROLE', '');
    render(<ExportDialog projectId="p1" />);
    expect(screen.getByRole('button', { name: /contentStudio\.export\.button/ })).toBeTruthy();
  });
});
