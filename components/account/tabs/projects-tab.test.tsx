import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

vi.mock('@/i18n/useLocalization', async () => (await import('@/components/account/test-utils')).localizationMock());
vi.mock('@/i18n/useLocalizedHref', () => ({ useLocalizedHref: () => (p: string) => p }));
vi.mock('@/lib/firebase', () => ({ getCurrentIdToken: async () => 'tok' }));
vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }));
vi.mock('@/lib/auth/accountApi', async (orig) => ({
  ...(await orig<typeof import('@/lib/auth/accountApi')>()),
  fetchStudioProjects: vi.fn(),
  deleteProject: vi.fn(),
}));

import { deleteProject, fetchStudioProjects } from '@/lib/auth/accountApi';
import { ProjectsTab } from './projects-tab';
import { copy } from '@/components/account/test-utils';

const project = (id: string, name: string) => ({
  id, name, durationSeconds: 75, createdAt: '2026-10-01T00:00:00Z', updatedAt: '2026-10-02T00:00:00Z',
});

function renderTab() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={qc}>
      <ProjectsTab copy={copy} uid="u1" />
    </QueryClientProvider>,
  );
}

afterEach(() => {
  cleanup();
  vi.mocked(deleteProject).mockReset();
});

describe('ProjectsTab', () => {
  it('lists real projects with Open links and no static panel text', async () => {
    vi.mocked(fetchStudioProjects).mockResolvedValue([project('p1', 'Trailer')] as never);
    renderTab();
    expect(await screen.findByText('Trailer')).toBeTruthy();
    expect(screen.getByText(/Length 1:15/)).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Open' }).getAttribute('href')).toBe('/tools/content-studio?project=p1');
    expect(screen.queryByText(copy.emptyProjects)).toBeNull();
  });

  it('shows the empty state with the Open Darkroom link', async () => {
    vi.mocked(fetchStudioProjects).mockResolvedValue([]);
    renderTab();
    expect(await screen.findByText(copy.emptyProjects)).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Open Darkroom' })).toBeTruthy();
  });

  it('delete asks first, then calls deleteProject and refetches', async () => {
    vi.mocked(fetchStudioProjects).mockResolvedValue([project('p1', 'Trailer')] as never);
    vi.mocked(deleteProject).mockResolvedValue({ deleted: { objects: 3, bytes: 9 }, pending: 0 });
    renderTab();
    fireEvent.click(await screen.findByRole('button', { name: 'Delete' }));
    expect(deleteProject).not.toHaveBeenCalled();
    const dialog = await screen.findByRole('alertdialog');
    fireEvent.click(within(dialog).getByRole('button', { name: 'Delete project' }));
    await waitFor(() => expect(deleteProject).toHaveBeenCalledWith('tok', 'p1'));
    await waitFor(() => expect(vi.mocked(fetchStudioProjects).mock.calls.length).toBeGreaterThan(1));
  });
});
