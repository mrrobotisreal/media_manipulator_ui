/**
 * MM56: Mitch's translator dry run (2026-10-26), defects 2 and 3.
 *
 *  2. Navigating away lost the open submit modal, the selected changes and the
 *     typed description, and the panel took about a second to reappear.
 *  3. After returning, "This page" showed 0 items until an English -> German toggle.
 *
 * A navigation between the German page and the English view remounts the whole
 * `[lang]` layout (AuthProvider and the workbench island included), and React
 * replaces the page's DOM. These tests do exactly that: unmount the island,
 * replace the DOM with the next page's marked HTML, mount a new island.
 */
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const h = vi.hoisted(() => ({ auth: null as unknown }));
vi.mock('@/lib/auth/AuthProvider', () => ({ useAuth: () => h.auth }));

import { createFakeTranslatorApi, type FakeTranslatorApi } from '@/lib/translator/api';
import { MarkerMemory } from '@/lib/translator/domScanner';
import { createFakeIndexedDb } from '@/lib/translator/testing/fakeIndexedDb';
import { openDraftStore } from '@/lib/translator/draftStore';
import { KeyRegistry, markerIndex } from '@/lib/translator/keyRegistry';
import { appendMarker } from '@/lib/translator/markerCodec';
import { shard } from '@/lib/translator/testing/fixtures';
import type { GateCache, GateCacheEntry } from '@/lib/translator/useTranslatorGate';
import {
  releaseWorkbenchSession,
  startWorkbenchSession,
  type StartWorkbenchSessionOptions,
} from '@/lib/translator/workbenchSession';
import TranslatorIsland from './translator-island';

const LOCALE = 'de-DE';
const FILE = 'i18n/locales/de-de/interface/components.json';
const SHARDS = [
  shard(LOCALE, 'interface/components', { 'home.title': 'Media tools', 'home.cta': 'Start', 'about.title': 'About us' }, {
    'home.title': 'Medienwerkzeuge',
    'home.cta': 'Los geht’s',
    'about.title': 'Über uns',
  }),
];

const mark = (text: string, key: string) => appendMarker(text, markerIndex({ ns: 'interface', key, lng: LOCALE }));
const HOME = () => `<main id="page"><h1>${mark('Medienwerkzeuge', 'home.title')}</h1><a href="/de/about">${mark('Los geht’s', 'home.cta')}</a></main>`;
const ABOUT = () => `<main id="page"><h1>${mark('Über uns', 'about.title')}</h1></main>`;

function memoryCache(): GateCache & { entries: Map<string, GateCacheEntry> } {
  const entries = new Map<string, GateCacheEntry>();
  return {
    entries,
    read: (locale, uid) => {
      const e = entries.get(locale);
      return e && (uid === null || e.uid === uid) ? e : null;
    },
    write: (locale, e) => void entries.set(locale, e),
    clear: (locale) => void entries.delete(locale),
  };
}

const auth = (over: Record<string, unknown> = {}) => ({
  loading: false,
  user: { uid: 'u1', getIdToken: vi.fn(async () => 'id-token') },
  emailVerified: true,
  openAuth: vi.fn(),
  sendVerificationEmail: vi.fn(async () => {}),
  refreshIdentity: vi.fn(async () => false),
  ...over,
});

let idb: ReturnType<typeof createFakeIndexedDb>;
let memory: MarkerMemory;
let registry: KeyRegistry;
let api: FakeTranslatorApi;
let cache: ReturnType<typeof memoryCache>;
const startSession = vi.fn(async (o: StartWorkbenchSessionOptions) =>
  startWorkbenchSession({
    ...o,
    shards: SHARDS,
    store: await openDraftStore({ indexedDB: idb.asFactory() }),
    registry,
    memory,
    scanImmediately: true,
  }),
);

beforeEach(() => {
  idb = createFakeIndexedDb();
  memory = new MarkerMemory();
  registry = new KeyRegistry();
  api = createFakeTranslatorApi({ me: { status: 'allowed', email: 't@example.com', locale: LOCALE } });
  cache = memoryCache();
  h.auth = auth();
  try {
    window.localStorage.clear();
  } catch {
    // jsdom
  }
});

afterEach(() => {
  cleanup();
  releaseWorkbenchSession();
  document.body.innerHTML = '';
  startSession.mockClear();
});

/** Mounts the island next to `pageHtml` (null: keep the live DOM), as the `[lang]` layout does. */
function mountPage(pageHtml: string | null, pathname: string) {
  if (pageHtml !== null) document.body.innerHTML = pageHtml;
  const host = document.createElement('div');
  document.body.appendChild(host);
  return render(
    <TranslatorIsland api={api} locale={LOCALE} i18n={null} startSession={startSession} gateCache={cache} pathname={pathname} />,
    { container: host },
  );
}

const settle = () => act(async () => new Promise((r) => setTimeout(r, 10)));
const pageTabCount = () => Number(screen.getByRole('tab', { name: /This page/ }).querySelector('span')?.textContent ?? 'NaN');
const pageRowKeys = () =>
  [...document.querySelectorAll('[data-tab-panel="page"] [data-entry-id]')].map((r) => r.getAttribute('data-entry-id')!.split('|')[1]);

describe('MM56 defect 3: "This page" after a navigation', () => {
  it('is repopulated after the DOM is replaced and the panel remounts (no language toggle)', async () => {
    const first = mountPage(HOME(), '/de');
    await waitFor(() => expect(pageRowKeys()).toEqual(['home.title', 'home.cta']));

    // Navigate to About, in React's order: the commit swaps the page DOM while the
    // old island's scanner still observes (its MutationObserver microtask cleans the
    // new nodes), and only then do the old island's effect cleanups run (unmount).
    document.getElementById('page')!.outerHTML = ABOUT();
    await settle();
    first.unmount();
    mountPage(null, '/de/about');
    await settle();
    expect(pageRowKeys()).toEqual(['about.title']);

    // And back to the home page.
    document.getElementById('page')!.outerHTML = HOME();
    await settle();
    cleanup();
    mountPage(null, '/de');
    await settle();
    expect(pageRowKeys()).toEqual(['home.title', 'home.cta']);
    expect(pageTabCount()).toBe(2);
    // One session for the page lifetime: no shard reload, no second scanner.
    expect(startSession).toHaveBeenCalledTimes(1);
  });

  it('a client navigation without a remount re-scans when the pathname changes', async () => {
    const view = mountPage(HOME(), '/de');
    await waitFor(() => expect(pageRowKeys()).toEqual(['home.title', 'home.cta']));
    document.getElementById('page')!.outerHTML = ABOUT();
    view.rerender(
      <TranslatorIsland api={api} locale={LOCALE} i18n={null} startSession={startSession} gateCache={cache} pathname="/de/about" />,
    );
    await settle();
    expect(pageRowKeys()).toEqual(['about.title']);
  });
});

describe('MM56 defect 2: state survives leaving the page', () => {
  it('the panel shows immediately on remount from the cached /me answer, then revalidates', async () => {
    const first = mountPage(HOME(), '/de');
    await waitFor(() => expect(document.querySelector('[data-workbench-panel]')).toBeTruthy());
    expect(cache.entries.get(LOCALE)?.uid).toBe('u1');
    first.unmount();

    // The remounted AuthProvider has not restored the Firebase user yet.
    h.auth = auth({ loading: true, user: null });
    mountPage(HOME(), '/de');
    // Same commit: no "Loading…" status, the panel is there.
    expect(document.querySelector('[data-workbench-panel]')).toBeTruthy();
    expect(screen.queryByRole('status')).toBeNull();
    const callsBefore = api.calls.me.length;
    h.auth = auth();
    cleanup();
    mountPage(HOME(), '/de');
    await settle();
    expect(api.calls.me.length).toBeGreaterThan(callsBefore);
  });

  it('a stale cache never shows the panel to a refused user: revalidation hides it and clears the cache', async () => {
    cache.write(LOCALE, { uid: 'u1', email: 't@example.com', at: Date.now() });
    api.setMe({ status: 'not_allowlisted' });
    mountPage(HOME(), '/de');
    await settle();
    expect(document.querySelector('[data-workbench-panel], [data-workbench-handle]')).toBeNull();
    expect(cache.entries.has(LOCALE)).toBe(false);
  });

  it('a cache entry for another uid is ignored', async () => {
    cache.write(LOCALE, { uid: 'someone-else', email: 'x@example.com', at: Date.now() });
    api.setMe({ status: 'not_allowlisted' });
    mountPage(HOME(), '/de');
    expect(document.querySelector('[data-workbench-panel]')).toBeNull();
    await settle();
    expect(document.querySelector('[data-workbench-panel], [data-workbench-handle]')).toBeNull();
  });

  it('the open submit modal, its description and ticked warnings come back after leaving (and after a reload)', async () => {
    api.setSubmit((_b, dryRun) =>
      dryRun
        ? {
            kind: 'dry_run',
            result: {
              dryRun: true,
              conflicts: [],
              warnings: [{ id: 'home.title#identical', code: 'identical', key: 'home.title', message: 'Same as English' }],
              files: 1,
              changed: 1,
            },
          }
        : { kind: 'ok', result: { prUrl: 'https://github.com/o/r/pull/7', prNumber: 7, branch: 'i18n/de/x', files: 1, changed: 1 } },
    );
    const first = mountPage(HOME(), '/de');
    await waitFor(() => expect(document.querySelector('[data-workbench-panel]')).toBeTruthy());
    const field = document.querySelector<HTMLTextAreaElement | HTMLInputElement>(`[data-entry-id="${FILE}|home.title"] textarea, [data-entry-id="${FILE}|home.title"] input`)!;
    fireEvent.change(field, { target: { value: 'Medien-Werkzeuge' } });
    fireEvent.mouseDown(screen.getByRole('tab', { name: /Changes/ }));
    fireEvent.click(screen.getByRole('tab', { name: /Changes/ }));
    fireEvent.click(await screen.findByRole('button', { name: 'Submit for review' }));
    const desc = await screen.findByLabelText(/Describe/);
    fireEvent.change(desc, { target: { value: 'Tidy the German home page title' } });
    const ack = await screen.findByRole('checkbox', { name: /home\.title identical/ });
    fireEvent.click(ack);
    await settle();

    // Leave: unmount everything; come back on a fresh mount.
    first.unmount();
    document.body.innerHTML = '';
    mountPage(HOME(), '/de');
    await settle();
    expect(await screen.findByLabelText(/Describe/)).toHaveProperty('value', 'Tidy the German home page title');
    await waitFor(() => expect(screen.getByRole('checkbox', { name: /home\.title identical/ })).toHaveProperty('checked', true));

    // Reload: a new realm session over the same IndexedDB.
    cleanup();
    releaseWorkbenchSession();
    document.body.innerHTML = '';
    mountPage(HOME(), '/de');
    await settle();
    expect(await screen.findByLabelText(/Describe/)).toHaveProperty('value', 'Tidy the German home page title');
    expect(document.querySelector(`[data-diff-row="home.title"]`)?.textContent).toContain('Medien-Werkzeuge');

    // A successful submit clears it.
    await waitFor(() => expect(screen.getByRole('checkbox', { name: /home\.title identical/ })).toHaveProperty('checked', true));
    fireEvent.click(document.querySelector('[data-submit-confirm]')!);
    await screen.findByText(/Open the pull request/);
    await settle();
    const store = await openDraftStore({ indexedDB: idb.asFactory() });
    expect(await store.getSubmitDraft(LOCALE)).toBeUndefined();
  });
});
