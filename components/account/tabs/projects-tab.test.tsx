import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

vi.mock('@/i18n/useLocalization', async () => (await import('@/components/account/test-utils')).localizationMock());
const hrefPrefix = vi.hoisted(() => ({ value: '' }));
vi.mock('@/i18n/useLocalizedHref', () => ({
  useLocalizedHref: () => (p: string) => `${hrefPrefix.value}${p}`,
}));
vi.mock('@/lib/firebase', () => ({ getCurrentIdToken: async () => 'tok' }));
vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }));
vi.mock('@/lib/auth/accountApi', async (orig) => ({
  ...(await orig<typeof import('@/lib/auth/accountApi')>()),
  fetchStudioProjects: vi.fn(),
  deleteProject: vi.fn(),
  fetchVectorProjects: vi.fn(),
  deleteVectorProject: vi.fn(),
}));

import { deleteProject, deleteVectorProject, fetchStudioProjects, fetchVectorProjects } from '@/lib/auth/accountApi';
import { ProjectsTab } from './projects-tab';
import { copy } from '@/components/account/test-utils';
import { locales } from '@/i18n/locales';

const track = vi.hoisted(() => vi.fn());
vi.mock('@/lib/analytics/client', () => ({ analytics: { track } }));

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

const vproject = (id: string, name: string, updatedAt = '2026-10-03T00:00:00Z') => ({
  id, name, revision: 1, documentBytes: 10, createdAt: '2026-10-01T00:00:00Z', updatedAt,
});

beforeEach(() => {
  hrefPrefix.value = '';
  vi.mocked(fetchVectorProjects).mockReset().mockResolvedValue([]);
  vi.mocked(deleteVectorProject).mockReset();
});

afterEach(() => {
  cleanup();
  track.mockClear();
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

  it('emits history_item_reopened for a project Open and data_deleted item/project on delete', async () => {
    vi.mocked(fetchStudioProjects).mockResolvedValue([project('p1', 'Trailer')] as never);
    vi.mocked(deleteProject).mockResolvedValue({ deleted: { objects: 3, bytes: 9 }, pending: 0 });
    renderTab();
    fireEvent.click(await screen.findByRole('link', { name: 'Open' }));
    expect(track).toHaveBeenCalledWith('history_item_reopened', expect.objectContaining({ kind: 'project' }));
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));
    fireEvent.click(within(await screen.findByRole('alertdialog')).getByRole('button', { name: 'Delete project' }));
    await waitFor(() => expect(track).toHaveBeenCalledWith('data_deleted', { scope: 'item', kind: 'project' }));
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

  it('lists both kinds with kind chips, newest first', async () => {
    vi.mocked(fetchStudioProjects).mockResolvedValue([project('p1', 'Trailer')] as never);
    vi.mocked(fetchVectorProjects).mockResolvedValue([vproject('v1', 'Logo')] as never);
    renderTab();
    expect(await screen.findByText('Trailer')).toBeTruthy();
    expect(screen.getByText('Logo')).toBeTruthy();
    expect(screen.getAllByTestId('project-kind').map((e) => e.textContent)).toEqual(['Motion', 'Darkroom']);
    const names = screen.getAllByTestId('project-row').map((r) => r.querySelector('span')?.textContent);
    expect(names).toEqual(['Logo', 'Trailer']);
  });

  it('Motion Open href is /motion/<id> unprefixed for every locale', async () => {
    vi.mocked(fetchStudioProjects).mockResolvedValue([project('p1', 'Trailer')] as never);
    vi.mocked(fetchVectorProjects).mockResolvedValue([vproject('v1', 'Logo')] as never);
    for (const l of locales) {
      hrefPrefix.value = l.code === 'en-US' ? '' : `/${l.prefix}`;
      const view = renderTab();
      await screen.findByText('Logo');
      const hrefs = screen.getAllByRole('link', { name: 'Open' }).map((a) => a.getAttribute('href'));
      expect(hrefs[0]).toBe('/motion/v1');
      expect(hrefs[1]).toBe(`${hrefPrefix.value}/tools/content-studio?project=p1`);
      view.unmount();
    }
  });

  it('delete on a Motion row calls the vector endpoint and refetches', async () => {
    vi.mocked(fetchVectorProjects).mockResolvedValue([vproject('v1', 'Logo')] as never);
    vi.mocked(fetchStudioProjects).mockResolvedValue([]);
    vi.mocked(deleteVectorProject).mockResolvedValue({ deleted: { objects: 2, bytes: 5 }, pending: 0 });
    renderTab();
    fireEvent.click(await screen.findByRole('button', { name: 'Delete' }));
    const dialog = await screen.findByRole('alertdialog');
    expect(within(dialog).getByText(/thumbnail/)).toBeTruthy();
    fireEvent.click(within(dialog).getByRole('button', { name: 'Delete project' }));
    await waitFor(() => expect(deleteVectorProject).toHaveBeenCalledWith('tok', 'v1'));
    expect(deleteProject).not.toHaveBeenCalled();
    await waitFor(() => expect(vi.mocked(fetchVectorProjects).mock.calls.length).toBeGreaterThan(1));
    await waitFor(() => expect(vi.mocked(fetchStudioProjects).mock.calls.length).toBeGreaterThan(1));
  });

  it('Motion list failure keeps Darkroom rows and shows a note', async () => {
    vi.mocked(fetchStudioProjects).mockResolvedValue([project('p1', 'Trailer')] as never);
    vi.mocked(fetchVectorProjects).mockRejectedValue(new Error('boom'));
    renderTab();
    expect(await screen.findByText('Trailer', {}, { timeout: 4000 })).toBeTruthy();
    expect(screen.getByText(/Could not load your Motion projects/)).toBeTruthy();
  });

  it('both lists failing shows the load-failed panel', async () => {
    vi.mocked(fetchStudioProjects).mockRejectedValue(new Error('boom'));
    vi.mocked(fetchVectorProjects).mockRejectedValue(new Error('boom'));
    renderTab();
    expect(await screen.findByText(copy.projects.loadFailed, {}, { timeout: 4000 })).toBeTruthy();
  });
});
