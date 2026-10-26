/**
 * MM53 gating (criterion 1, design §2.8): the panel mounts only for an allowlisted,
 * verified translator of this locale; `unverified` shows the verify notice whose
 * send button calls `sendVerificationEmail`; everyone else sees the plain site.
 */
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

const h = vi.hoisted(() => ({ auth: null as unknown }));
vi.mock('@/lib/auth/AuthProvider', () => ({ useAuth: () => h.auth }));

import { createFakeTranslatorApi, type MeResult } from '@/lib/translator/api';
import { createMemoryDraftStore } from '@/lib/translator/draftStore';
import { KeyRegistry } from '@/lib/translator/keyRegistry';
import { shard } from '@/lib/translator/testing/fixtures';
import { startWorkbenchSession, type StartWorkbenchSessionOptions } from '@/lib/translator/workbenchSession';
import TranslatorIsland from './translator-island';

const PLAIN_SITE = '<header><nav><a href="/">Media Manipulator</a></nav></header><main><h1>Compress images</h1><p>Fast and private.</p></main>';

function auth(overrides: Record<string, unknown> = {}) {
  return {
    loading: false,
    user: { uid: 'u1', getIdToken: vi.fn(async () => 'id-token') },
    emailVerified: true,
    openAuth: vi.fn(),
    sendVerificationEmail: vi.fn(async () => {}),
    refreshIdentity: vi.fn(async () => false),
    ...overrides,
  };
}

const startSession = vi.fn((o: StartWorkbenchSessionOptions) =>
  startWorkbenchSession({
    ...o,
    shards: [shard(o.locale, 'interface/components', { a: 'A' })],
    store: createMemoryDraftStore(null),
    registry: new KeyRegistry(),
    scanImmediately: true,
  }),
);

/** Renders the plain site plus the island and returns the island's container. */
async function renderSite(me: MeResult, a: unknown = auth(), locale: string | null = 'ar-SA') {
  h.auth = a;
  document.body.innerHTML = PLAIN_SITE;
  const api = createFakeTranslatorApi({ me });
  const host = document.createElement('div');
  document.body.appendChild(host);
  const utils = render(<TranslatorIsland api={api} locale={locale} i18n={null} startSession={startSession} />, { container: host });
  await act(async () => {
    await new Promise((r) => setTimeout(r, 0));
  });
  return { api, host, ...utils };
}

afterEach(() => {
  cleanup();
  document.body.innerHTML = '';
  startSession.mockClear();
});

describe('translator gate (criterion 1)', () => {
  it('not_allowlisted: no panel, and the DOM equals the plain site', async () => {
    const { api, host } = await renderSite({ status: 'not_allowlisted' });
    expect(api.calls.me).toEqual(['id-token']);
    host.remove();
    expect(document.body.innerHTML).toBe(PLAIN_SITE);
    expect(document.body.innerHTML).toMatchInlineSnapshot(
      `"<header><nav><a href="/">Media Manipulator</a></nav></header><main><h1>Compress images</h1><p>Fast and private.</p></main>"`,
    );
    expect(startSession).not.toHaveBeenCalled();
  });

  it.each<[string, MeResult]>([
    ['wrong_locale', { status: 'wrong_locale' }],
    ['401', { status: 'unauthorized' }],
    ['route missing (404) / network error', { status: 'error', detail: 'HTTP 404' }],
    ['allowed for another locale', { status: 'allowed', email: 'x@y.z', locale: 'de-DE' }],
  ])('%s: the island renders nothing (plain site, no hint)', async (_name, me) => {
    const { host } = await renderSite(me);
    expect(host.innerHTML).toBe('');
    expect(startSession).not.toHaveBeenCalled();
  });

  it('unverified: shows the "Verify your email" notice; its send button calls sendVerificationEmail', async () => {
    const a = auth({ emailVerified: false });
    const { host } = await renderSite({ status: 'unverified' }, a);
    expect(host.querySelector('[data-translator-verify]')).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Verify your email to start translating' })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Send verification email' }));
    await waitFor(() => expect(a.sendVerificationEmail).toHaveBeenCalledTimes(1));
    expect(host.querySelector('[data-workbench-panel]')).toBeNull();
  });

  it('signed out: only the small "Sign in to translate" entry, which opens the auth modal', async () => {
    const a = auth({ user: null });
    const { host, api } = await renderSite({ status: 'allowed', email: 'e', locale: 'ar-SA' }, a);
    expect(api.calls.me).toEqual([]);
    const button = screen.getByRole('button', { name: 'Sign in to translate' });
    expect(host.children).toHaveLength(1);
    fireEvent.click(button);
    expect(a.openAuth).toHaveBeenCalledWith({ intent: 'signin', source: 'translator_workbench' });
  });

  it('allowed for this locale: the workbench mounts (RTL locale docks left)', async () => {
    const { host } = await renderSite({ status: 'allowed', email: 't@example.com', locale: 'ar-SA' });
    await waitFor(() => expect(host.querySelector('[data-workbench-panel], [data-workbench-handle]')).toBeTruthy());
    expect(startSession).toHaveBeenCalledWith(expect.objectContaining({ locale: 'ar-SA' }));
    const panel = host.querySelector('[data-workbench-panel]');
    if (panel) expect(panel.getAttribute('data-side')).toBe('left');
  });

  it('not armed (no translator locale): nothing, no /me call', async () => {
    const { host, api } = await renderSite({ status: 'allowed', email: 'e', locale: 'ar-SA' }, auth(), null);
    expect(host.innerHTML).toBe('');
    expect(api.calls.me).toEqual([]);
  });
});
