import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// MM78 acceptance 6: Voices tab CRUD against a fake /api/voices (list, rename, delete
// through ConfirmDialog, empty state, limit text).

vi.mock('@/i18n/useLocalization', async () => (await import('@/components/account/test-utils')).localizationMock());
vi.mock('@/i18n/useLocalizedHref', () => ({ useLocalizedHref: () => (p: string) => p }));
vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }));
vi.mock('@/lib/auth/AuthProvider', () => ({ useAuth: () => ({ user: { uid: 'u1' }, loading: false }) }));

type Voice = {
  id: string;
  name: string;
  kind: 'cloned' | 'designed';
  languageHint: string;
  engineVersion: string;
  consentAt: string | null;
  consentTextVersion?: string;
  previewUrl?: string;
  createdAt: string;
  updatedAt: string;
};

const server = vi.hoisted(() => ({
  voices: [] as Voice[],
  limit: 5,
  calls: [] as Array<{ method: string; url: string; body?: string }>,
  failDelete: false,
}));

vi.mock('@/lib/auth/authedFetch', () => ({
  authedFetch: async (url: string, init?: RequestInit) => {
    const method = (init?.method ?? 'GET').toUpperCase();
    server.calls.push({ method, url, body: typeof init?.body === 'string' ? init.body : undefined });
    const json = (status: number, body: unknown) => new Response(JSON.stringify(body), { status });
    const id = url.match(/\/voices\/([^/?]+)$/)?.[1];
    if (method === 'GET') return json(200, { voices: server.voices, limit: server.limit, used: server.voices.length });
    if (method === 'PATCH' && id) {
      const v = server.voices.find((x) => x.id === id)!;
      v.name = JSON.parse(String(init?.body)).name;
      return json(200, v);
    }
    if (method === 'DELETE' && id) {
      if (server.failDelete) return json(503, { error: 'voices_storage_unavailable' });
      server.voices = server.voices.filter((x) => x.id !== id);
      return json(200, { deleted: { objects: 2, bytes: 10 }, pending: 0 });
    }
    return json(404, {});
  },
}));

import { VoicesTab } from './voices-tab';
import { copy } from '@/components/account/test-utils';
import { ACCOUNT_TABS, parseAccountTab } from '@/lib/account/tabs';

const cloned: Voice = {
  id: 'a1', name: 'My voice', kind: 'cloned', languageHint: 'en', engineVersion: 'chatterbox 0.1.7',
  consentAt: '2026-10-28T10:00:00Z', consentTextVersion: '2026-10-28', previewUrl: 'https://s3/preview.mp3',
  createdAt: '2026-10-28T10:00:00Z', updatedAt: '2026-10-28T10:00:00Z',
};
const designed: Voice = {
  id: 'b2', name: 'Narrator', kind: 'designed', languageHint: 'de', engineVersion: 'x',
  consentAt: null, createdAt: '2026-10-27T10:00:00Z', updatedAt: '2026-10-27T10:00:00Z',
};

function renderTab() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={qc}>
      <VoicesTab copy={copy} />
    </QueryClientProvider>,
  );
}

beforeEach(() => {
  server.voices = [{ ...cloned }, { ...designed }];
  server.limit = 5;
  server.calls = [];
  server.failDelete = false;
});
afterEach(() => cleanup());

describe('Account → Voices (MM78)', () => {
  it('is a routable account tab after Projects', () => {
    expect(ACCOUNT_TABS.indexOf('voices')).toBe(ACCOUNT_TABS.indexOf('projects') + 1);
    expect(parseAccountTab('voices')).toBe('voices');
    expect(copy.tabs.voices).toBe('Voices');
  });

  it('lists name, kind, language, created date, the consent record and the preview, with "n of N voices"', async () => {
    renderTab();
    expect(await screen.findByText('My voice')).toBeTruthy();
    expect(screen.getByText('Narrator')).toBeTruthy();
    expect(screen.getByTestId('voices-usage').textContent).toBe('2 of 5 voices');
    const [first, second] = screen.getAllByTestId('voice-row');
    expect(first.textContent).toContain('Cloned');
    expect(first.textContent).toContain('English');
    expect(within(first).getByTestId('voice-consent').textContent).toBe('Consent confirmed D(2026-10-28) (text version 2026-10-28)');
    expect(within(second).getByTestId('voice-consent').textContent).toMatch(/Designed from a description/);
    expect(first.querySelector('audio')?.getAttribute('src')).toBe('https://s3/preview.mp3');
  });

  it('unlimited (operator) shows the count without a limit', async () => {
    server.limit = -1;
    renderTab();
    await screen.findByText('My voice');
    expect(screen.getByTestId('voices-usage').textContent).toBe('2 voices');
  });

  it('renames inline with PATCH {name}', async () => {
    renderTab();
    await screen.findByText('My voice');
    fireEvent.click(screen.getAllByRole('button', { name: 'Rename' })[0]);
    const input = screen.getByLabelText('New name for My voice');
    fireEvent.change(input, { target: { value: 'Studio voice' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    await waitFor(() => expect(server.calls.some((c) => c.method === 'PATCH')).toBe(true));
    const patch = server.calls.find((c) => c.method === 'PATCH')!;
    expect(patch.url).toMatch(/\/voices\/a1$/);
    expect(JSON.parse(patch.body!)).toEqual({ name: 'Studio voice' });
    expect(await screen.findByText('Studio voice')).toBeTruthy();
  });

  it('an empty name cannot be saved', async () => {
    renderTab();
    await screen.findByText('My voice');
    fireEvent.click(screen.getAllByRole('button', { name: 'Rename' })[0]);
    fireEvent.change(screen.getByLabelText('New name for My voice'), { target: { value: '  ' } });
    expect((screen.getByRole('button', { name: 'Save' }) as HTMLButtonElement).disabled).toBe(true);
  });

  it('delete asks first (the copy says generated files keep playing), then DELETEs and refetches', async () => {
    renderTab();
    await screen.findByText('My voice');
    fireEvent.click(screen.getAllByRole('button', { name: 'Delete' })[0]);
    expect(server.calls.some((c) => c.method === 'DELETE')).toBe(false);
    const dialog = await screen.findByRole('alertdialog');
    expect(within(dialog).getByText(/keeps playing until its own retention period ends/)).toBeTruthy();
    fireEvent.click(within(dialog).getByRole('button', { name: 'Delete voice' }));
    await waitFor(() => expect(server.calls.find((c) => c.method === 'DELETE')?.url).toMatch(/\/voices\/a1$/));
    await waitFor(() => expect(screen.queryByText('My voice')).toBeNull());
    expect(screen.getByTestId('voices-usage').textContent).toBe('1 of 5 voices');
  });

  it('a failed delete keeps the voice and says so', async () => {
    server.failDelete = true;
    renderTab();
    await screen.findByText('My voice');
    fireEvent.click(screen.getAllByRole('button', { name: 'Delete' })[0]);
    fireEvent.click(within(await screen.findByRole('alertdialog')).getByRole('button', { name: 'Delete voice' }));
    await waitFor(() => expect(screen.getByRole('status').textContent).toBe(copy.voices.deleteFailed));
    expect(screen.getByText('My voice')).toBeTruthy();
  });

  it('empty state links to the three voice tools', async () => {
    server.voices = [];
    renderTab();
    expect(await screen.findByTestId('voices-empty')).toBeTruthy();
    expect(screen.getByTestId('voices-usage').textContent).toBe('0 of 5 voices');
    expect(screen.getAllByRole('link').map((a) => a.getAttribute('href'))).toEqual([
      '/tools/voice-cloning',
      '/tools/voice-designer',
      '/tools/voice-changer',
    ]);
  });

  it('translator deployments hide delete but keep rename', async () => {
    vi.stubEnv('NEXT_PUBLIC_DEPLOY_ROLE', 'translator');
    try {
      renderTab();
      await screen.findByText('My voice');
      expect(screen.queryByRole('button', { name: 'Delete' })).toBeNull();
      expect(screen.getAllByRole('button', { name: 'Rename' })).toHaveLength(2);
    } finally {
      vi.unstubAllEnvs();
    }
  });
});
