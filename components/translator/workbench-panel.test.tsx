/**
 * MM53 panel component tests: This page fixture with attributes (criterion 2), All
 * keys virtualisation bound (3), plurals in the UI (5), two-way hover and Alt+click
 * focus (9), RTL dock side (10), storage banner (7), search, Esc and `/`.
 */
import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { createMemoryDraftStore } from '@/lib/translator/draftStore';
import { KeyRegistry, markerIndex } from '@/lib/translator/keyRegistry';
import { appendMarker } from '@/lib/translator/markerCodec';
import { bulkShard, makeModel, shard } from '@/lib/translator/testing/fixtures';
import { startWorkbenchSession, type WorkbenchSession } from '@/lib/translator/workbenchSession';
import type { WorkbenchController } from '@/lib/translator/workbenchSession';
import { fieldDomId } from './key-row';
import { WorkbenchPanel } from './workbench-panel';

const flush = () => act(() => new Promise<void>((r) => setTimeout(r, 0)));

let session: WorkbenchSession | null = null;
let registry: KeyRegistry;

const nullController: WorkbenchController = {
  highlightEntry: () => {},
  clearHighlight: () => {},
  onFocusKey: () => () => {},
};

/** Server-rendered marked text for `key` in `lng`. */
const marked = (text: string, key: string, lng: string) => appendMarker(text, markerIndex({ ns: 'interface', key, lng }));

const pageEnglish = {
  'fixture.heading': 'Compress images',
  'fixture.search': 'Search tools',
  'fixture.close': 'Close dialog',
  'fixture.tip': 'More info',
  'fixture.logo': 'Media Manipulator logo',
  'fixture.go': 'Go',
  'fixture.offPage': 'Not on this page',
  'fixture.files_one': '{{count}} file',
  'fixture.files_other': '{{count}} files',
};

function pageFixture(lng: string) {
  document.body.innerHTML =
    `<main id="page">` +
    `<h1 id="h">${marked('Compress images', 'fixture.heading', lng)}</h1>` +
    `<input id="search" placeholder="${marked('Search tools', 'fixture.search', lng)}">` +
    `<button id="close" aria-label="${marked('Close dialog', 'fixture.close', lng)}">×</button>` +
    `<a id="tip" href="/x" title="${marked('More info', 'fixture.tip', lng)}">i</a>` +
    `<img id="logo" alt="${marked('Media Manipulator logo', 'fixture.logo', lng)}">` +
    `<input id="go" type="submit" value="${marked('Go', 'fixture.go', lng)}">` +
    `<p id="count">${marked('3 files', 'fixture.files_other', lng)}</p>` +
    `</main>`;
}

async function startPage(lng: string) {
  pageFixture(lng);
  registry = new KeyRegistry();
  session = await startWorkbenchSession({
    locale: lng,
    i18n: null,
    api: null,
    getIdToken: async () => null,
    shards: [shard(lng, 'interface/components', pageEnglish)],
    store: createMemoryDraftStore(null),
    registry,
    scanImmediately: true,
  });
  const dir = lng.startsWith('ar') || lng.startsWith('he') ? 'rtl' : 'ltr';
  render(<WorkbenchPanel model={session.model} controller={session.controller} dir={dir} lang={lng} initialCollapsed={false} />);
  return session;
}

/**
 * jsdom has no layout: give the All keys scroller a viewport and each row a height, the
 * way a browser would (the virtualiser reads clientHeight / offsetHeight).
 */
const VIEWPORT = 900;
const ROW = 112;
const realClient = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'clientHeight');
const realOffset = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetHeight');

beforeEach(() => {
  window.localStorage.clear();
  Element.prototype.scrollIntoView = vi.fn();
  Object.defineProperty(HTMLElement.prototype, 'clientHeight', {
    configurable: true,
    get(this: HTMLElement) {
      return this.hasAttribute('data-virtual-scroll') ? VIEWPORT : 0;
    },
  });
  Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
    configurable: true,
    get(this: HTMLElement) {
      return this.hasAttribute('data-virtual-row') ? ROW : 0;
    },
  });
});

afterEach(() => {
  if (realClient) Object.defineProperty(HTMLElement.prototype, 'clientHeight', realClient);
  if (realOffset) Object.defineProperty(HTMLElement.prototype, 'offsetHeight', realOffset);
});

afterEach(() => {
  cleanup();
  session?.dispose();
  session = null;
  document.body.innerHTML = '';
});

describe('This page tab (criterion 2)', () => {
  it('lists the fixture page keys (text, placeholder, aria-label, title, alt, button value) with attribute badges', async () => {
    await startPage('de-DE');
    const tab = document.querySelector('[data-tab-panel="page"]') as HTMLElement;
    const rows = [...tab.querySelectorAll('[data-entry-id]')].map((r) => r.getAttribute('data-entry-id')!.split('|')[1]);
    expect(rows).toEqual([
      'fixture.heading',
      'fixture.search',
      'fixture.close',
      'fixture.tip',
      'fixture.logo',
      'fixture.go',
      'fixture.files_one',
    ]);
    expect(tab.querySelector('[data-shard-group="interface › components"]')).toBeTruthy();
    const badgeOf = (key: string) =>
      [...tab.querySelector(`[data-entry-id$="|${key}"]`)!.querySelectorAll('[data-attr-badge]')].map((b) => b.getAttribute('data-attr-badge'));
    expect(badgeOf('fixture.heading')).toEqual([]);
    expect(badgeOf('fixture.search')).toEqual(['placeholder']);
    expect(badgeOf('fixture.close')).toEqual(['aria-label']);
    expect(badgeOf('fixture.tip')).toEqual(['title']);
    expect(badgeOf('fixture.logo')).toEqual(['alt']);
    expect(badgeOf('fixture.go')).toEqual(['value']);
    // English source is always LTR; the field follows the locale.
    const heading = tab.querySelector('[data-entry-id$="|fixture.heading"]')!;
    expect(heading.querySelector('p[lang="en"]')!.getAttribute('dir')).toBe('ltr');
    expect(within(heading as HTMLElement).getByRole('textbox').getAttribute('lang')).toBe('de-DE');
  });

  it('editing a row patches the page live and shows the modified dot; Changes lists it with an enabled Submit that opens the modal', async () => {
    const s = await startPage('de-DE');
    const field = screen.getByLabelText('Translation for fixture.search');
    fireEvent.change(field, { target: { value: 'Werkzeuge suchen' } });
    expect(document.getElementById('search')!.getAttribute('placeholder')).toBe('Werkzeuge suchen');
    expect(field.closest('[data-entry-id]')!.querySelector('[data-modified]')).toBeTruthy();
    expect(s.model.changes()).toHaveLength(1);
    fireEvent.mouseDown(screen.getByRole('tab', { name: /Changes/ }));
    fireEvent.click(screen.getByRole('tab', { name: /Changes/ }));
    const changes = document.querySelector('[data-tab-panel="changes"]') as HTMLElement;
    expect(changes.querySelector('[data-changes-count]')!.textContent).toBe('1 pending change');
    const submit = within(changes).getByRole('button', { name: 'Submit for review' });
    expect(submit).toHaveProperty('disabled', false);
    fireEvent.click(submit);
    expect(screen.getByRole('dialog', { name: 'Submit for review' })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(screen.queryByRole('dialog')).toBeNull();
    fireEvent.click(within(changes).getByRole('button', { name: 'Revert fixture.search' }));
    expect(document.getElementById('search')!.getAttribute('placeholder')).toBe('Search tools');
    expect(s.model.changes()).toHaveLength(0);
  });
});

describe('two-way hover and Alt+click (criterion 9)', () => {
  it('row hover outlines the page element and scrolls it into view; leaving clears it', async () => {
    await startPage('de-DE');
    const row = document.querySelector('[data-tab-panel="page"] [data-entry-id$="|fixture.heading"]')!;
    const h1 = document.getElementById('h')!;
    h1.getBoundingClientRect = () => ({ top: 2000, bottom: 2040, left: 0, right: 100, width: 100, height: 40, x: 0, y: 2000, toJSON: () => ({}) });
    fireEvent.mouseEnter(row);
    const overlay = document.getElementById('mm-translator-highlight')!;
    expect(overlay.children).toHaveLength(1);
    expect(h1.scrollIntoView).toHaveBeenCalledWith({ block: 'center' });
    fireEvent.mouseLeave(row);
    expect(overlay.children).toHaveLength(0);
  });

  it('element hover highlights the matching row and scrolls it into view in This page', async () => {
    await startPage('de-DE');
    fireEvent.mouseMove(document.getElementById('close')!);
    await flush();
    const row = document.querySelector('[data-tab-panel="page"] [data-entry-id$="|fixture.close"]')!;
    expect(row.hasAttribute('data-hovered')).toBe(true);
    expect(row.scrollIntoView).toHaveBeenCalled();
    fireEvent.mouseMove(document.body);
    await flush();
    expect(row.hasAttribute('data-hovered')).toBe(false);
  });

  it('Alt+click on an element focuses and selects its row field (link click suppressed)', async () => {
    const s = await startPage('de-DE');
    const id = s.model.table.byRef('interface', 'fixture.tip')!.id;
    const pageClick = vi.fn();
    document.getElementById('tip')!.addEventListener('click', pageClick);
    document.elementsFromPoint = () => [document.getElementById('tip')!];
    fireEvent.click(document.getElementById('tip')!, { altKey: true });
    await flush();
    await flush();
    const field = document.getElementById(fieldDomId(id)) as HTMLInputElement;
    expect(document.activeElement).toBe(field);
    expect(field.selectionStart).toBe(0);
    expect(field.selectionEnd).toBe(field.value.length);
    expect(pageClick).not.toHaveBeenCalled();
  });

  it('a plural group row outlines every form on the page', async () => {
    const s = await startPage('de-DE');
    const highlight = vi.spyOn(s.controller, 'highlightEntry');
    const row = document.querySelector('[data-tab-panel="page"] [data-plural-group="fixture.files"]')!.closest('[data-entry-id]')!;
    fireEvent.mouseEnter(row);
    expect(highlight).toHaveBeenCalled();
    expect(document.getElementById('mm-translator-highlight')!.children).toHaveLength(1);
  });
});

describe('plural groups in the panel (criterion 5)', () => {
  it('ar shows six form fields, ja one required (+ the surplus English _one)', async () => {
    for (const [lng, required, total] of [
      ['ar-SA', 6, 6],
      ['ja-JP', 1, 2],
    ] as const) {
      const model = await makeModel(lng, [shard(lng, 'interface/components', pageEnglish)]);
      render(<WorkbenchPanel model={model} controller={nullController} dir={lng === 'ar-SA' ? 'rtl' : 'ltr'} lang={lng} initialCollapsed={false} virtualRect={{ width: 400, height: 2000 }} />);
      fireEvent.mouseDown(screen.getByRole('tab', { name: 'All keys' }));
      const group = document.querySelector('[data-plural-group="fixture.files"]')!;
      expect(group.querySelectorAll('[data-plural-form]')).toHaveLength(total);
      expect(group.querySelectorAll('[data-plural-form][data-required]')).toHaveLength(required);
      expect(group.querySelectorAll('textarea, input')).toHaveLength(total);
      cleanup();
    }
  });
});

describe('All keys virtualisation (criterion 3)', () => {
  it('a 5,000-key fixture keeps the mounted row count under 80 while scrolling', async () => {
    const model = await makeModel('de-DE', [bulkShard('de-DE', 5000)]);
    render(<WorkbenchPanel model={model} controller={nullController} dir="ltr" lang="de-DE" initialCollapsed={false} virtualRect={{ width: 400, height: 900 }} />);
    fireEvent.mouseDown(screen.getByRole('tab', { name: 'All keys' }));
    const scroller = document.querySelector('[data-virtual-scroll]') as HTMLDivElement;
    const counts: number[] = [];
    for (const top of [0, 20_000, 200_000, 400_000, 559_000]) {
      scroller.scrollTop = top;
      fireEvent.scroll(scroller);
      await flush();
      counts.push(document.querySelectorAll('[data-virtual-row]').length);
    }
    expect(Math.max(...counts)).toBeLessThan(80);
    expect(Math.min(...counts)).toBeGreaterThan(0);
    // Search narrows the virtual list (debounced 120 ms).
    vi.useFakeTimers();
    fireEvent.change(screen.getByLabelText('Search keys, English or translation'), { target: { value: 'number 4321' } });
    await act(async () => {
      vi.advanceTimersByTime(130);
    });
    vi.useRealTimers();
    expect(document.querySelectorAll('[data-virtual-row]')).toHaveLength(1);
  });
});

describe('dock side, RTL and keyboard (criteria 10, 11)', () => {
  it.each([
    ['he-IL', 'rtl', 'left'],
    ['ar-SA', 'rtl', 'left'],
    ['de-DE', 'ltr', 'right'],
    ['ja-JP', 'ltr', 'right'],
  ] as const)('%s docks %s -> %s', async (lng, dir, side) => {
    const model = await makeModel(lng, [shard(lng, 'interface/components', { a: 'A' })]);
    render(<WorkbenchPanel model={model} controller={nullController} dir={dir} lang={lng} initialCollapsed={false} />);
    const panel = document.querySelector('[data-workbench-panel]')!;
    expect(panel.getAttribute('data-side')).toBe(side);
    expect(panel.getAttribute('dir')).toBe(dir);
    expect(panel.className).toContain(side === 'left' ? 'left-0' : 'right-0');
  });

  it('Esc collapses to a slim handle; the handle reopens; "/" focuses search', async () => {
    const model = await makeModel('he-IL', [shard('he-IL', 'interface/components', { a: 'A' })]);
    render(<WorkbenchPanel model={model} controller={nullController} dir="rtl" lang="he-IL" initialCollapsed={false} />);
    fireEvent.keyDown(document.body, { key: 'Escape' });
    const handle = document.querySelector('[data-workbench-handle]')!;
    expect(handle.parentElement!.className).toContain('left-0');
    expect(document.querySelector('[data-workbench-panel]')).toBeNull();
    fireEvent.click(handle);
    expect(document.querySelector('[data-workbench-panel]')).toBeTruthy();
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      cb(0);
      return 0;
    });
    fireEvent.keyDown(document.body, { key: '/' });
    expect(document.activeElement).toBe(document.querySelector('[data-workbench-search]'));
  });

  it('the resize handle clamps between 320 px and 60 vw and remembers the width', async () => {
    const model = await makeModel('de-DE', [shard('de-DE', 'interface/components', { a: 'A' })]);
    render(<WorkbenchPanel model={model} controller={nullController} dir="ltr" lang="de-DE" initialCollapsed={false} />);
    const handle = document.querySelector('[data-resize-handle]')!;
    for (let i = 0; i < 40; i++) fireEvent.keyDown(handle, { key: 'ArrowRight' });
    expect((document.querySelector('[data-workbench-panel]') as HTMLElement).style.width).toBe('320px');
    for (let i = 0; i < 80; i++) fireEvent.keyDown(handle, { key: 'ArrowLeft' });
    expect((document.querySelector('[data-workbench-panel]') as HTMLElement).style.width).toBe(`${Math.floor(window.innerWidth * 0.6)}px`);
    expect(window.localStorage.getItem('mm-translator-panel-width')).toBe(String(Math.floor(window.innerWidth * 0.6)));
  });

  it('unavailable storage shows the "drafts are not being saved" banner', async () => {
    const model = await makeModel('de-DE', [shard('de-DE', 'interface/components', { a: 'A' })], { store: createMemoryDraftStore('unavailable') });
    render(<WorkbenchPanel model={model} controller={nullController} dir="ltr" lang="de-DE" initialCollapsed={false} />);
    expect(document.querySelector('[data-storage-banner]')!.textContent).toContain('Drafts are not being saved');
  });

  it('a <Trans> row edits the raw template with a preview; <script> injects nothing', async () => {
    const model = await makeModel('de-DE', [shard('de-DE', 'interface/components', { by: 'built by <strong>CreaTV</strong>' })]);
    render(<WorkbenchPanel model={model} controller={nullController} dir="ltr" lang="de-DE" initialCollapsed={false} virtualRect={{ width: 400, height: 900 }} />);
    fireEvent.mouseDown(screen.getByRole('tab', { name: 'All keys' }));
    const field = screen.getByLabelText('Translation for by') as HTMLTextAreaElement;
    expect(field.className).toContain('font-mono');
    fireEvent.change(field, { target: { value: 'von <strong>CreaTV</strong>' } });
    expect(document.querySelector('[data-testid="trans-preview"] strong')!.textContent).toBe('CreaTV');
    fireEvent.change(field, { target: { value: 'von <script>alert(1)</script>' } });
    expect(screen.getByRole('alert').textContent).toContain('Template cannot be previewed');
    expect(document.querySelector('script')).toBeNull();
    expect(model.valueOf(model.table.entries[0].id)).toBe('von <script>alert(1)</script>');
  });
});

describe('a11y (criterion 11)', () => {
  it('chrome is lang=en; target fields carry the locale lang and dir; English source is LTR; no focus trap', async () => {
    const model = await makeModel('ar-SA', [shard('ar-SA', 'interface/components', { a: 'Hello' })]);
    render(
      <>
        <button>before</button>
        <WorkbenchPanel model={model} controller={nullController} dir="rtl" lang="ar-SA" initialCollapsed={false} virtualRect={{ width: 400, height: 900 }} />
        <button>after</button>
      </>,
    );
    const panel = document.querySelector('[data-workbench-panel]')!;
    expect(panel.getAttribute('lang')).toBe('en');
    fireEvent.mouseDown(screen.getByRole('tab', { name: 'All keys' }));
    const field = screen.getByLabelText('Translation for a');
    expect(field.getAttribute('lang')).toBe('ar-SA');
    expect(field.getAttribute('dir')).toBe('rtl');
    expect(field.closest('[data-entry-id]')!.querySelector('p[lang="en"]')!.getAttribute('dir')).toBe('ltr');
    // Nothing intercepts Tab: focus leaves the panel normally.
    field.focus();
    fireEvent.keyDown(field, { key: 'Tab' });
    screen.getByText('after').focus();
    expect(document.activeElement!.textContent).toBe('after');
  });
});
