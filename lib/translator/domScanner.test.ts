import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { DomScanner, SCANNED_ATTRIBUTES } from './domScanner';
import { KeyRegistry, markerIndex } from './keyRegistry';
import { appendMarker } from './markerCodec';
import type { MarkerRef } from './mode';

const ZW = /[‌‍]/;
let registry: KeyRegistry;
let scanner: DomScanner;

const ref = (key: string, lng = 'he-IL', ns = 'interface'): MarkerRef => ({ ns, key, lng });
/** What `t()` would render for `key`: the text plus its marker. */
const marked = (text: string, key: string, lng = 'he-IL') => {
  const r = ref(key, lng);
  registry.record(r);
  return appendMarker(text, markerIndex(r));
};
const flush = () => new Promise<void>((resolve) => setTimeout(resolve, 0));

function allVisibleText(): string {
  let s = document.title + document.body.textContent;
  for (const el of document.querySelectorAll('*')) for (const a of el.getAttributeNames()) s += el.getAttribute(a);
  return s;
}

beforeEach(() => {
  registry = new KeyRegistry();
  document.head.innerHTML = '';
  document.body.innerHTML = '';
  document.title = '';
});

afterEach(() => scanner?.dispose());

describe('DOM scanner', () => {
  it('maps text nodes and every scanned attribute, then leaves no zero-width chars behind', () => {
    document.head.innerHTML =
      `<meta name="description" content="${marked('תיאור', 'meta.desc')}">` +
      `<meta property="og:title" content="${marked('כותרת', 'meta.og')}">` +
      `<meta name="twitter:title" content="${marked('כותרת', 'meta.tw')}">` +
      `<link rel="alternate" title="${marked('קישור', 'meta.link')}" href="/he">`;
    document.title = marked('דחיסת תמונה | Media Manipulator', 'meta.title');
    document.body.innerHTML = `
      <h1 id="h">${marked('דחיסת תמונה', 'tools.compress.title')}</h1>
      <p id="p">${marked('ضغط الصورة', 'tools.compress.blurb', 'ar-SA')}</p>
      <input id="i" placeholder="${marked('חיפוש', 'search.placeholder')}" aria-label="${marked('חפש', 'search.label')}">
      <img id="img" alt="${marked('לוגו', 'brand.logo')}" title="${marked('בית', 'brand.home')}">
      <input id="btn" type="submit" value="${marked('שליחה', 'common.submit')}">`;
    scanner = new DomScanner({ registry }).start({ immediate: true });

    const keys = scanner.getKeysOnPage().map((k) => k.key).sort();
    expect(keys).toEqual(
      [
        'tools.compress.title',
        'tools.compress.blurb',
        'search.placeholder',
        'search.label',
        'brand.logo',
        'brand.home',
        'common.submit',
      ].sort(),
    );
    expect(scanner.getElementsForKey(ref('tools.compress.title'))).toEqual([document.getElementById('h')]);
    expect(scanner.getElementsForKey(ref('tools.compress.blurb', 'ar-SA'))).toEqual([document.getElementById('p')]);
    expect(scanner.getKeysForElement(document.getElementById('i')!).map((k) => k.sites)).toEqual([
      ['placeholder'],
      ['aria-label'],
    ]);
    expect(scanner.getKeysForElement(document.getElementById('img')!).flatMap((k) => k.sites).sort()).toEqual([
      'alt',
      'title',
    ]);
    expect(scanner.getKeysForElement(document.getElementById('btn')!)[0].sites).toEqual(['value']);
    expect((document.getElementById('btn') as HTMLInputElement).value).toBe('שליחה');
    // Visible text, attributes, <title> and <meta>: all clean.
    expect(ZW.test(allVisibleText())).toBe(false);
    expect(document.title).toBe('דחיסת תמונה | Media Manipulator');
    expect(document.querySelector('meta[name=description]')!.getAttribute('content')).toBe('תיאור');
    expect(SCANNED_ATTRIBUTES).toEqual(['placeholder', 'aria-label', 'title', 'alt', 'value']);
  });

  it('maps two adjacent translations in one text node to the same element', () => {
    document.body.innerHTML = `<p id="p">${marked('Hello', 'a')} ${marked('world', 'b')}</p>`;
    scanner = new DomScanner({ registry }).start({ immediate: true });
    const el = document.getElementById('p')!;
    expect(el.textContent).toBe('Hello world');
    expect(scanner.getKeysForElement(el).map((k) => k.ref.key)).toEqual(['a', 'b']);
  });

  it('resolves markers minted elsewhere (server HTML) through the seeded shard table', () => {
    const minted = new KeyRegistry();
    const r = ref('footer.copyright', 'de-DE');
    document.body.innerHTML = `<footer>${appendMarker('© CreaTV', minted.record(r))}</footer>`;
    registry.seedFromResources('interface', { footer: { copyright: '©' } });
    scanner = new DomScanner({ registry }).start({ immediate: true });
    expect(scanner.getKeysOnPage()).toEqual([expect.objectContaining({ key: 'footer.copyright', lng: 'de-DE' })]);
  });

  it('picks up mutations incrementally and notifies subscribers with added and removed refs', async () => {
    scanner = new DomScanner({ registry }).start({ immediate: true });
    const changes: Array<{ added: string[]; removed: string[] }> = [];
    scanner.subscribe((c) => changes.push({ added: c.added.map((e) => e.key), removed: c.removed.map((e) => e.key) }));

    const div = document.createElement('div');
    div.innerHTML = `<span>${marked('one', 'k1')}</span>`;
    document.body.appendChild(div);
    await flush();
    expect(div.textContent).toBe('one');

    const span = div.querySelector('span')!;
    span.firstChild!.textContent = marked('two', 'k2');
    span.setAttribute('title', marked('tip', 'k3'));
    await flush();
    expect(span.textContent).toBe('two');
    expect(span.getAttribute('title')).toBe('tip');

    div.remove();
    await flush();
    expect(changes).toEqual([
      { added: ['k1'], removed: [] },
      { added: ['k2', 'k3'], removed: [] },
      { added: [], removed: ['k1', 'k2', 'k3'] },
    ]);
    expect(scanner.getKeysOnPage()).toEqual([]);
  });

  it('defers the initial scan until idle (after hydration)', async () => {
    document.body.innerHTML = `<p>${marked('later', 'deferred')}</p>`;
    scanner = new DomScanner({ registry }).start();
    expect(ZW.test(document.body.textContent!)).toBe(true);
    await new Promise((r) => setTimeout(r, 250));
    expect(ZW.test(document.body.textContent!)).toBe(false);
    expect(scanner.getKeysOnPage().map((k) => k.key)).toEqual(['deferred']);
  });

  it('patchTextNode rewrites mapped text and attributes and keeps the mapping', async () => {
    document.body.innerHTML =
      `<h2 id="a">${marked('Old', 'title')}</h2><button id="b" aria-label="${marked('Old', 'title')}">x</button>`;
    scanner = new DomScanner({ registry }).start({ immediate: true });
    expect(scanner.patchTextNode(ref('title'), 'חדש')).toBe(2);
    await flush();
    expect(document.getElementById('a')!.textContent).toBe('חדש');
    expect(document.getElementById('b')!.getAttribute('aria-label')).toBe('חדש');
    expect(scanner.getElementsForKey(ref('title')).map((e) => e.id)).toEqual(['a', 'b']);
  });

  it('leaves genuine joiners in the text alone (Hindi conjuncts, emoji)', () => {
    const hindi = 'क्‍ष 👨‍👩‍👧';
    document.body.innerHTML = `<p id="p">${marked(hindi, 'hi.text', 'hi-IN')}</p>`;
    scanner = new DomScanner({ registry }).start({ immediate: true });
    expect(document.getElementById('p')!.textContent).toBe(hindi);
  });
});
