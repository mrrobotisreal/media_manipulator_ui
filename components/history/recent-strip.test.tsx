import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import en from '@/i18n/locales/en-us/interface/components.json';
import type { LocalHistoryEntry } from '@/lib/history/localHistory';
import { RecentStrip, orderForTool } from './recent-strip';

const NOW = 1_800_000_000_000;
const store = vi.hoisted(() => ({ entries: [] as LocalHistoryEntry[], listeners: new Set<() => void>() }));
const remove = vi.hoisted(() => vi.fn());
const clear = vi.hoisted(() => vi.fn());
const auth = vi.hoisted(() => ({ value: { user: null, loading: false, openAuth: vi.fn() } as unknown }));
const toastError = vi.hoisted(() => vi.fn());
const authedFetch = vi.hoisted(() => vi.fn());

vi.mock('@/lib/history/localHistory', () => ({
  localHistory: {
    list: async () => store.entries,
    remove: async (id: string) => {
      remove(id);
      store.entries = store.entries.filter((e) => e.jobId !== id);
      store.listeners.forEach((l) => l());
    },
    clear: async () => {
      clear();
      store.entries = [];
    },
  },
  subscribeLocalHistory: (fn: () => void) => {
    store.listeners.add(fn);
    return () => store.listeners.delete(fn);
  },
}));
vi.mock('@/lib/auth/AuthProvider', () => ({ useAuth: () => auth.value }));
vi.mock('@/lib/auth/authedFetch', () => ({ authedFetch }));
const itemReopened = vi.hoisted(() => vi.fn());
vi.mock('@/lib/analytics/retentionEvents', () => ({ retentionEvents: { itemReopened } }));
vi.mock('sonner', () => ({ toast: { error: toastError } }));
vi.mock('@/components/results/result-panel', () => ({
  ResultPanel: (p: { descriptor: { jobId: string } }) => <div data-testid="panel">{p.descriptor.jobId}</div>,
}));
vi.mock('@/i18n/useLocalization', () => ({
  useLocalization: () => ({
    t: (key: string, opts?: Record<string, string | number>) => {
      const found = key.split('.').reduce<unknown>((o, k) => (o as Record<string, unknown> | undefined)?.[k], en);
      const text = typeof found === 'string' ? found : key;
      return text.replace(/\{\{(\w+)\}\}/g, (_, k: string) => String(opts?.[k] ?? ''));
    },
    formatFileSize: (n: number) => `${n} B`,
  }),
}));

const entry = (id: string, extra: Partial<LocalHistoryEntry> = {}): LocalHistoryEntry => ({
  jobId: id, tool: 'compress-image', kind: 'image', fileName: `${id}.png`, sizeBytes: 10,
  createdAt: NOW - 1000, expiresAt: NOW + 5 * 3_600_000, ...extra,
});

describe('RecentStrip', () => {
  beforeEach(() => {
    store.entries = [];
    store.listeners.clear();
    auth.value = { user: null, loading: false, openAuth: vi.fn() };
    [remove, clear, toastError, authedFetch].forEach((m) => m.mockReset());
  });
  afterEach(cleanup);

  it('renders nothing when there is no history', async () => {
    const { container } = render(<RecentStrip now={() => NOW} />);
    await new Promise((r) => setTimeout(r, 10));
    expect(container.innerHTML).toBe("");
  });

  it('lists live entries with expiry and shows the guest sign-up CTA', async () => {
    store.entries = [entry('a'), entry('old', { expiresAt: NOW - 1 })];
    render(<RecentStrip now={() => NOW} />);
    expect(await screen.findByText('a.png')).toBeTruthy();
    expect(screen.queryByText('old.png')).toBeNull();
    expect(screen.getByText('Expires in 5h')).toBeTruthy();
    expect(screen.getByText(en.recentStrip.signupCta)).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: en.recentStrip.signupAction }));
    expect((auth.value as { openAuth: ReturnType<typeof vi.fn> }).openAuth).toHaveBeenCalledWith({ intent: 'signup', source: 'recent_strip' });
  });

  it('signed-in users see no strip and the browser copy is handed over (cleared)', async () => {
    store.entries = [entry('a')];
    auth.value = { user: { uid: 'u' }, loading: false, openAuth: vi.fn() };
    const { container } = render(<RecentStrip now={() => NOW} />);
    await waitFor(() => expect(clear).toHaveBeenCalled());
    expect(container.innerHTML).toBe("");
  });

  it('click re-fetches the result and calls the opener', async () => {
    store.entries = [entry('a')];
    authedFetch.mockResolvedValue({ ok: true, status: 200, blob: async () => new Blob(['x']) });
    const onReopen = vi.fn();
    render(<RecentStrip now={() => NOW} onReopen={onReopen} />);
    fireEvent.click(await screen.findByRole('button', { name: 'Open a.png' }));
    expect((await screen.findByTestId('panel')).textContent).toBe('a');
    expect(onReopen).toHaveBeenCalledWith(expect.objectContaining({ jobId: 'a' }));
    expect(authedFetch.mock.calls[0][0]).toMatch(/\/download\/a$/);
    // MM30: the guest strip reports the reopen with source 'local' (kind and a derived timestamp only).
    expect(itemReopened).toHaveBeenCalledWith(expect.anything(), expect.any(String), 'local');
  });

  it('a 404 removes the entry and toasts that it expired', async () => {
    store.entries = [entry('a'), entry('b')];
    authedFetch.mockResolvedValue({ ok: false, status: 404 });
    render(<RecentStrip now={() => NOW} />);
    fireEvent.click(await screen.findByRole('button', { name: 'Open a.png' }));
    await waitFor(() => expect(remove).toHaveBeenCalledWith('a'));
    expect(toastError).toHaveBeenCalledWith(en.recentStrip.expired);
    await waitFor(() => expect(screen.queryByText('a.png')).toBeNull());
    expect(screen.getByText('b.png')).toBeTruthy();
  });

  it('Clear recent clears the store', async () => {
    store.entries = [entry('a')];
    render(<RecentStrip now={() => NOW} />);
    fireEvent.click(await screen.findByRole('button', { name: en.recentStrip.clear }));
    expect(clear).toHaveBeenCalled();
  });
});

describe('orderForTool', () => {
  it('puts the current tool first, newest first within groups', () => {
    const out = orderForTool(
      [entry('x', { tool: 'other', createdAt: 3 }), entry('y', { createdAt: 1 }), entry('z', { createdAt: 2 })],
      'compress-image',
    );
    expect(out.map((e) => e.jobId)).toEqual(['z', 'y', 'x']);
  });
});
