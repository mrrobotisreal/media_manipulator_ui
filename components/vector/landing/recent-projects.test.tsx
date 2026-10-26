import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';

const auth = vi.hoisted(() => ({ value: null as null | { user: unknown; loading: boolean } }));
vi.mock('@/lib/auth/AuthProvider', () => ({ useAuth: () => auth.value }));
const track = vi.hoisted(() => vi.fn());
vi.mock('@/lib/analytics', () => ({ analytics: { track }, EVENTS: { CTA_CLICKED: 'cta_clicked' } }));

const fetchProjects = vi.hoisted(() => vi.fn());
vi.mock('@/lib/auth/accountApi', () => ({ fetchVectorProjects: fetchProjects }));
vi.mock('@/lib/account/requireToken', () => ({ requireToken: async () => 'tok' }));
const listDrafts = vi.hoisted(() => vi.fn());
vi.mock('@/lib/vector/draftStore', () => ({ listVectorDrafts: listDrafts }));

import MotionLauncher, { MOTION_NEW_HREF, RECENT_LIMIT, loadRecent, type RecentState } from './recent-projects';

const labels = {
  open: 'Open Motion',
  openHint: 'hint',
  recentTitle: 'Recent projects',
  sourceAccount: 'Saved to your account',
  sourceBrowser: 'Saved in this browser',
  loading: 'Loading',
  empty: 'No projects yet',
  error: 'Could not load',
  untitled: 'Untitled drawing',
  edited: 'Edited {{date}}',
};

afterEach(() => {
  cleanup();
  auth.value = null;
  track.mockReset();
  fetchProjects.mockReset();
  listDrafts.mockReset();
});

describe('Motion launcher (MM48 acceptance 2: recent projects)', () => {
  it('Open Motion is the raw /motion/new path and reports cta_clicked', () => {
    render(<MotionLauncher labels={labels} locale="ru-RU" loader={() => new Promise(() => {})} />);
    const open = screen.getByTestId('motion-open');
    expect(open.getAttribute('href')).toBe('/motion/new');
    expect(MOTION_NEW_HREF).toBe('/motion/new');
    open.click();
    expect(track).toHaveBeenCalledWith('cta_clicked', { cta_id: 'motion_open', placement: 'tool_page_motion', href: '/motion/new' });
  });

  it('loading state while the list is in flight', () => {
    render(<MotionLauncher labels={labels} locale="en-US" loader={() => new Promise(() => {})} />);
    expect(screen.getByTestId('motion-recent-loading')).toBeTruthy();
  });

  it('empty state', async () => {
    render(<MotionLauncher labels={labels} locale="en-US" loader={async () => ({ status: 'ready', source: 'browser', rows: [] })} />);
    await waitFor(() => expect(screen.getByTestId('motion-recent-empty').textContent).toBe('No projects yet'));
  });

  it('error state when the loader throws', async () => {
    render(<MotionLauncher labels={labels} locale="en-US" loader={async () => Promise.reject(new Error('boom'))} />);
    await waitFor(() => expect(screen.getByTestId('motion-recent-error')).toBeTruthy());
  });

  it('loaded (signed in): account projects link to the raw editor path, untitled fallback', async () => {
    auth.value = { user: { uid: 'u' }, loading: false };
    const loader = vi.fn(
      async (signedIn: boolean): Promise<RecentState> => ({
        status: 'ready',
        source: signedIn ? 'account' : 'browser',
        rows: [
          { id: '0b3c5e2a-1111-4222-8333-444455556666', name: 'Logo loop', at: Date.UTC(2026, 9, 25) },
          { id: 'local-abcdefabcdef', name: '  ', at: 0 },
        ],
      }),
    );
    render(<MotionLauncher labels={labels} locale="en-US" loader={loader} />);
    await waitFor(() => expect(screen.getByTestId('motion-recent-list')).toBeTruthy());
    expect(loader).toHaveBeenCalledWith(true);
    expect(screen.getByText('Saved to your account')).toBeTruthy();
    const links = screen.getAllByRole('link').filter((a) => a.getAttribute('data-testid') !== 'motion-open');
    expect(links.map((a) => a.getAttribute('href'))).toEqual([
      '/motion/0b3c5e2a-1111-4222-8333-444455556666',
      '/motion/local-abcdefabcdef',
    ]);
    expect(screen.getByText('Untitled drawing')).toBeTruthy();
    expect(screen.getByText(/^Edited /)).toBeTruthy();
  });

  it('signed out reads the browser drafts', async () => {
    const loader = vi.fn(async (): Promise<RecentState> => ({ status: 'ready', source: 'browser', rows: [{ id: 'local-aaaaaaaaaaaa', name: 'Draft', at: 1 }] }));
    render(<MotionLauncher labels={labels} locale="en-US" loader={loader} />);
    await waitFor(() => expect(screen.getByText('Saved in this browser')).toBeTruthy());
    expect(loader).toHaveBeenCalledWith(false);
  });

  it('waits for auth to resolve before loading', () => {
    auth.value = { user: null, loading: true };
    const loader = vi.fn(() => new Promise<RecentState>(() => {}));
    render(<MotionLauncher labels={labels} locale="en-US" loader={loader} />);
    expect(loader).not.toHaveBeenCalled();
  });

  it('the default loader keeps the five newest account projects', async () => {
    const projects = Array.from({ length: 7 }, (_, i) => ({
      id: `p${i}`, name: `P${i}`, revision: 1, documentBytes: 1, createdAt: '', updatedAt: new Date(Date.UTC(2026, 9, 1 + i)).toISOString(),
    }));
    fetchProjects.mockResolvedValue(projects);
    const state = await loadRecent(true);
    expect(RECENT_LIMIT).toBe(5);
    expect(state).toMatchObject({ status: 'ready', source: 'account' });
    expect(state.status === 'ready' && state.rows.map((r) => r.id)).toEqual(['p6', 'p5', 'p4', 'p3', 'p2']);
  });

  it('the default loader reads IndexedDB drafts when signed out', async () => {
    listDrafts.mockResolvedValue([{ projectId: 'local-aaaaaaaaaaaa', name: 'D', savedAt: 5 }]);
    const state = await loadRecent(false);
    expect(state).toEqual({ status: 'ready', source: 'browser', rows: [{ id: 'local-aaaaaaaaaaaa', name: 'D', at: 5 }] });
    expect(fetchProjects).not.toHaveBeenCalled();
  });
});
