/**
 * MM44 acceptance 6 at the editor level: an account project opens from the
 * server, edits autosave with If-Match, a 409 shows the banner ("This project
 * changed in another tab or device"), "Keep mine" re-saves with the 409's
 * currentRevision, "Reload theirs" replaces the document, and signed-out
 * saves prompt sign-in (no request).
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';

import enPanels from '@/i18n/locales/en-us/interface/panels.json';
import { createI18nInstance } from '@/i18n';
import { FakeIDBFactory } from '@/lib/vector/testing/fakeIndexedDb';
import { useVectorStore } from '@/lib/vector/vectorStore';
import { translateLayers } from '@/lib/vector/transformOps';
import { parseVectorDoc, type VectorDoc } from '@/lib/vector/vectorTypes';

const auth = vi.hoisted(() => ({ user: true as boolean }));
vi.mock('@/lib/firebase', () => ({
  getCurrentIdToken: async () => (auth.user ? 'tok' : null),
  onAuthStateChange: (cb: (u: unknown) => void) => {
    queueMicrotask(() => cb(auth.user ? { uid: 'u1' } : null));
    return () => {};
  },
}));
vi.mock('next/navigation', () => ({ usePathname: () => '/motion/x', useRouter: () => ({ push: vi.fn(), replace: vi.fn() }) }));
vi.mock('@/i18n/useLocalizedHref', () => ({ useLocalizedHref: () => (p: string) => p }));

import MotionEditor from './editor';

const i18n = createI18nInstance('en-US');
i18n.addResourceBundle('en-US', 'interface', enPanels, true, true);

const ID = '0b9e8a9c-6a7f-4d0e-9a51-2f7f6d2c1e10';
const doc = (x: number): VectorDoc => {
  const r = parseVectorDoc({ version: 1, layers: [{ type: 'rect', id: 'a', x, y: 0, width: 1, height: 1 }] });
  if (!r.ok) throw new Error(r.error);
  return r.doc;
};
const project = (revision: number, d: VectorDoc, name = 'Bounce') => ({
  id: ID,
  name,
  revision,
  documentBytes: 1,
  createdAt: '2026-10-25T00:00:00Z',
  updatedAt: '2026-10-25T00:00:00Z',
  document: d,
});
const json = (status: number, body: unknown) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

const fetchMock = vi.fn<typeof fetch>();
const puts = () => fetchMock.mock.calls.filter(([, init]) => init?.method === 'PUT');

const installFakeIndexedDb = () =>
  Object.defineProperty(globalThis, 'indexedDB', { value: new FakeIDBFactory(), configurable: true, writable: true });

beforeEach(() => {
  installFakeIndexedDb();
  auth.user = true;
  fetchMock.mockReset();
  vi.stubGlobal('fetch', fetchMock);
  Object.assign(Element.prototype, { setPointerCapture: () => {}, releasePointerCapture: () => {} });
  vi.spyOn(console, 'warn').mockImplementation(() => {});
});
afterEach(() => {
  cleanup();
  useVectorStore.getState().close();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  vi.useRealTimers();
});

async function openServerProject() {
  fetchMock.mockResolvedValueOnce(json(200, project(3, doc(0))));
  render(
    <I18nextProvider i18n={i18n}>
      <MotionEditor projectId={ID} />
    </I18nextProvider>,
  );
  await waitFor(() => expect(useVectorStore.getState().projectId).toBe(ID));
  await waitFor(() => expect(screen.getByTestId('vector-save-status')).toBeTruthy());
}

const edit = (dx: number) => act(() => useVectorStore.getState().mutate('Move', (d) => translateLayers(d, ['a'], dx, 0)));

describe('Motion editor: account save + 409 flow', () => {
  it('opens a server project and autosaves with If-Match', async () => {
    await openServerProject();
    expect(fetchMock.mock.calls[0][0]).toMatch(new RegExp(`/vector/projects/${ID}$`));
    expect(screen.getByTestId('vector-save-status').dataset.state).toBe('saved');
    fetchMock.mockResolvedValueOnce(json(200, project(4, doc(5))));
    vi.useFakeTimers({ shouldAdvanceTime: true });
    edit(5);
    await act(async () => {
      await vi.advanceTimersByTimeAsync(3000);
    });
    expect(puts()).toHaveLength(1);
    expect(new Headers(puts()[0][1]?.headers).get('If-Match')).toBe('3');
    await waitFor(() => expect(screen.getByTestId('vector-save-status').dataset.state).toBe('saved'));
  });

  it('409 shows the banner; Keep mine re-saves with currentRevision', async () => {
    await openServerProject();
    fetchMock
      .mockResolvedValueOnce(json(409, { error: 'revision_conflict', currentRevision: 9, updatedAt: '2026-10-25T23:59:02Z' }))
      .mockResolvedValueOnce(json(200, project(10, doc(5))));
    edit(5);
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    const banner = await screen.findByTestId('vector-conflict-banner');
    expect(banner.textContent).toContain('This project changed in another tab or device');
    expect(screen.getByTestId('vector-save-status').dataset.state).toBe('conflict');
    fireEvent.click(within(banner).getByRole('button', { name: 'Keep mine' }));
    await waitFor(() => expect(screen.queryByTestId('vector-conflict-banner')).toBeNull());
    expect(puts()).toHaveLength(2);
    expect(new Headers(puts()[1][1]?.headers).get('If-Match')).toBe('9');
    expect(JSON.parse(String(puts()[1][1]?.body)).document).toEqual(useVectorStore.getState().doc);
  });

  it('Reload theirs offers a download first, then replaces the document', async () => {
    await openServerProject();
    fetchMock
      .mockResolvedValueOnce(json(409, { error: 'revision_conflict', currentRevision: 6, updatedAt: 'x' }))
      .mockResolvedValueOnce(json(200, project(6, doc(77), 'Theirs')));
    edit(5);
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    const banner = await screen.findByTestId('vector-conflict-banner');
    fireEvent.click(within(banner).getByRole('button', { name: 'Reload theirs' }));
    const dialog = await screen.findByTestId('vector-reload-dialog');
    expect(within(dialog).getByRole('button', { name: 'Download my version' })).toBeTruthy();
    fireEvent.click(within(dialog).getByRole('button', { name: 'Reload theirs' }));
    await waitFor(() => expect(useVectorStore.getState().name).toBe('Theirs'));
    expect(useVectorStore.getState().doc).toEqual(doc(77));
    expect(screen.queryByTestId('vector-conflict-banner')).toBeNull();
    expect(useVectorStore.getState().past).toHaveLength(0);
  });

  it('a failed save keeps the edits (and the draft) and shows the state', async () => {
    await openServerProject();
    fetchMock.mockResolvedValueOnce(json(422, { error: 'vector_doc_invalid' }));
    edit(5);
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    await waitFor(() => expect(screen.getByTestId('vector-save-status').dataset.state).toBe('failed'));
    expect(useVectorStore.getState().doc).toEqual(translateLayers(doc(0), ['a'], 5, 0));
  });

  it('signed out: Save prompts sign-in, offers .json and sends nothing', async () => {
    auth.user = false;
    render(
      <I18nextProvider i18n={i18n}>
        <MotionEditor projectId="new" />
      </I18nextProvider>,
    );
    await waitFor(() => expect(screen.getByTestId('vector-save-status').dataset.state).toBe('local'));
    fireEvent.click(screen.getByRole('button', { name: 'Save to account' }));
    const prompt = await screen.findByTestId('vector-signin-prompt');
    expect(within(prompt).getByRole('button', { name: 'Download .json' })).toBeTruthy();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('signed in, local project: Save to account creates it and moves the URL to the server id', async () => {
    const replace = vi.spyOn(window.history, 'replaceState');
    render(
      <I18nextProvider i18n={i18n}>
        <MotionEditor projectId="new" />
      </I18nextProvider>,
    );
    await waitFor(() => expect(screen.getByTestId('vector-save-status').dataset.state).toBe('local'));
    fetchMock.mockResolvedValueOnce(json(201, project(1, useVectorStore.getState().doc!)));
    fireEvent.click(screen.getByRole('button', { name: 'Save to account' }));
    await waitFor(() => expect(useVectorStore.getState().projectId).toBe(ID));
    expect(fetchMock.mock.calls[0][1]?.method).toBe('POST');
    expect(replace).toHaveBeenLastCalledWith(null, '', `/motion/${ID}`);
    await waitFor(() => expect(screen.getByRole('button', { name: 'Save' })).toBeTruthy());
  });

  it('a stranger / missing project shows the not-found state', async () => {
    fetchMock.mockResolvedValueOnce(json(404, { error: 'Project not found' }));
    render(
      <I18nextProvider i18n={i18n}>
        <MotionEditor projectId={ID} />
      </I18nextProvider>,
    );
    expect((await screen.findByTestId('vector-open-error')).textContent).toContain('does not exist');
  });
});
