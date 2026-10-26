/**
 * MM53 live edit (acceptance criterion 4): client re-render through the store,
 * server-rendered DOM patching, re-apply after a simulated client navigation, and
 * the merge order (a lazy shard merge never clobbers a draft).
 */
import { act, cleanup, render, screen } from '@testing-library/react';
import { createInstance, type i18n as I18n } from 'i18next';
import { I18nextProvider, initReactI18next, useTranslation } from 'react-i18next';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { DomScanner } from './domScanner';
import { KeyRegistry, markerIndex } from './keyRegistry';
import { LiveEditor, recoverTokens, renderTemplate, type LiveTarget } from './liveEdit';
import { appendMarker } from './markerCodec';

const LNG = 'ar-SA';
const flush = () => new Promise<void>((r) => setTimeout(r, 0));

let registry: KeyRegistry;
let scanner: DomScanner | null = null;

/** What a server component renders for `key` (text + marker; the browser did not mint it). */
const serverMarked = (text: string, key: string, ns = 'interface') => {
  registry.seedKeys(ns, [key]);
  return appendMarker(text, markerIndex({ ns, key, lng: LNG }));
};

const target = (key: string, deployed: string, extra: Partial<LiveTarget> = {}): LiveTarget => ({
  ns: 'interface',
  key,
  trans: false,
  base: deployed,
  deployed,
  ...extra,
});

async function makeI18n(resources: Record<string, string>): Promise<I18n> {
  const i18n = createInstance();
  await i18n.use(initReactI18next).init({
    lng: LNG,
    fallbackLng: 'en-US',
    resources: { [LNG]: { interface: resources }, 'en-US': { interface: {} } },
    defaultNS: 'interface',
    interpolation: { escapeValue: false },
    react: { useSuspense: false, bindI18n: 'languageChanged loaded', bindI18nStore: 'added removed' },
  });
  return i18n;
}

beforeEach(() => {
  registry = new KeyRegistry();
  document.body.innerHTML = '';
});

afterEach(() => {
  cleanup();
  scanner?.dispose();
  scanner = null;
});

describe('live edit: template param recovery', () => {
  it.each([
    ['{{count}} files', '3 files', [['{{count}}', '3']]],
    ['Hello {{ name }}, you have {{n}}', 'Hello Rana, you have 2', [['{{name}}', 'Rana'], ['{{n}}', '2']]],
    ['Saved $t(common.ok)', 'Saved OK', [['$t(common.ok)', 'OK']]],
  ])('recovers %s from %s', (template, rendered, expected) => {
    expect([...(recoverTokens(template, rendered) ?? new Map())]).toEqual(expected);
  });

  it('a mismatching text recovers nothing; unknown tokens stay literal and count as missing', () => {
    expect(recoverTokens('{{count}} files', 'nothing like it')).toBeNull();
    expect(renderTemplate('{{count}} ملفات', null)).toEqual({ text: '{{count}} ملفات', missing: 1 });
    expect(renderTemplate('{{count}} ملفات', null, { count: 4 })).toEqual({ text: '4 ملفات', missing: 0 });
  });
});

describe('live edit (criterion 4)', () => {
  it('editing a client string re-renders it (react-i18next fixture)', async () => {
    const i18n = await makeI18n({ greet: 'Hello' });
    function Greeting() {
      const { t } = useTranslation('interface');
      return <p>{t('greet')}</p>;
    }
    render(
      <I18nextProvider i18n={i18n}>
        <Greeting />
      </I18nextProvider>,
    );
    expect(screen.getByText('Hello')).toBeTruthy();
    const live = new LiveEditor({ locale: LNG, i18n, scanner: null, registry });
    live.attach();
    act(() => live.set(target('greet', 'Hello'), 'مرحبا'));
    expect(screen.getByText('مرحبا')).toBeTruthy();
    live.dispose();
  });

  it('editing a server-rendered string patches the DOM node and attributes (static HTML fixture)', () => {
    document.body.innerHTML =
      `<h1 id="h">${serverMarked('Compress images', 'tools.title')}</h1>` +
      `<input id="i" placeholder="${serverMarked('Compress images', 'tools.title')}">`;
    scanner = new DomScanner({ registry }).start({ immediate: true });
    const live = new LiveEditor({ locale: LNG, i18n: null, scanner, registry });
    live.set(target('tools.title', 'Compress images'), 'ضغط الصور');
    expect(document.getElementById('h')!.textContent).toBe('ضغط الصور');
    expect(document.getElementById('i')!.getAttribute('placeholder')).toBe('ضغط الصور');
    expect(live.isApproximate('interface', 'tools.title')).toBe(false);
  });

  it('interpolated server text keeps each node\'s own params; unknown params flag "preview approximate"', () => {
    document.body.innerHTML =
      `<p id="a">${serverMarked('3 files', 'files')}</p><p id="b">${serverMarked('7 files', 'files')}</p>`;
    scanner = new DomScanner({ registry }).start({ immediate: true });
    const live = new LiveEditor({ locale: LNG, i18n: null, scanner, registry });
    live.set(target('files', '{{count}} files'), '{{count}} ملفات');
    expect(document.getElementById('a')!.textContent).toBe('3 ملفات');
    expect(document.getElementById('b')!.textContent).toBe('7 ملفات');
    live.set(target('files', '{{count}} files'), '{{count}} ملفات جديدة');
    expect(document.getElementById('a')!.textContent).toBe('3 ملفات جديدة');
    expect(live.isApproximate('interface', 'files')).toBe(false);

    document.body.innerHTML = `<p id="c">${serverMarked('rendered differently', 'other')}</p>`;
    scanner.dispose();
    scanner = new DomScanner({ registry }).start({ immediate: true });
    const live2 = new LiveEditor({ locale: LNG, i18n: null, scanner, registry });
    live2.set(target('other', '{{n}} things'), '{{n}} أشياء');
    expect(document.getElementById('c')!.textContent).toBe('{{n}} أشياء');
    expect(live2.isApproximate('interface', 'other')).toBe(true);
  });

  it('after a simulated client navigation (DOM replaced) the draft re-applies', async () => {
    document.body.innerHTML = `<main><h1>${serverMarked('Pricing', 'pricing.title')}</h1></main>`;
    scanner = new DomScanner({ registry }).start({ immediate: true });
    const live = new LiveEditor({ locale: LNG, i18n: null, scanner, registry });
    live.attach();
    live.set(target('pricing.title', 'Pricing'), 'الأسعار');
    expect(document.querySelector('h1')!.textContent).toBe('الأسعار');

    // Navigate away and back: React swaps in fresh server HTML with the deployed text.
    document.querySelector('main')!.replaceWith(Object.assign(document.createElement('main'), { innerHTML: '<p>other page</p>' }));
    await flush();
    const back = document.createElement('main');
    back.innerHTML = `<h1 id="again">${serverMarked('Pricing', 'pricing.title')}</h1>`;
    document.querySelector('main')!.replaceWith(back);
    await flush();
    expect(document.getElementById('again')!.textContent).toBe('الأسعار');
    live.dispose();
  });

  it('a lazy shard merge (ensureShard: addResourceBundle overwrite) does not clobber a draft: shard first, drafts last', async () => {
    const i18n = await makeI18n({ panel: { title: 'Panel' } } as unknown as Record<string, string>);
    const live = new LiveEditor({ locale: LNG, i18n, scanner: null, registry });
    live.attach();
    live.set(target('panel.title', 'Panel'), 'لوحة');
    expect(i18n.t('panel.title')).toBe('لوحة');
    i18n.addResourceBundle(LNG, 'interface', { panel: { title: 'Panel (lazy shard)', other: 'x' } }, true, true);
    expect(i18n.t('panel.title')).toBe('لوحة');
    expect(i18n.t('panel.other')).toBe('x');
    // languageChanged re-applies too.
    i18n.addResourceBundle(LNG, 'interface', { panel: { title: 'silent' } }, true, true, { silent: true } as never);
    await i18n.changeLanguage(LNG);
    expect(i18n.t('panel.title')).toBe('لوحة');
    live.dispose();
  });

  it('revert restores the deployed value in the store and the DOM', () => {
    document.body.innerHTML = `<h2 id="h">${serverMarked('Old', 'k')}</h2>`;
    scanner = new DomScanner({ registry }).start({ immediate: true });
    const store: Array<[string, unknown]> = [];
    const fakeI18n = {
      addResource: (_l: string, _n: string, k: string, v: unknown) => store.push([k, v]),
      on: () => {},
      off: () => {},
      store: { on: () => {}, off: () => {} },
    };
    const live = new LiveEditor({ locale: LNG, i18n: fakeI18n, scanner, registry });
    live.set(target('k', 'Old'), 'جديد');
    expect(document.getElementById('h')!.textContent).toBe('جديد');
    live.set(target('k', 'Old'), undefined);
    expect(document.getElementById('h')!.textContent).toBe('Old');
    expect(store).toEqual([
      ['k', 'جديد'],
      ['k', 'Old'],
    ]);
  });

  it('<Trans> strings are never DOM-patched; server ones are flagged approximate', () => {
    document.body.innerHTML = `<p id="p">built by <strong>CreaTV</strong>${serverMarked(' Ltd.', 'about.by')}</p>`;
    scanner = new DomScanner({ registry }).start({ immediate: true });
    const live = new LiveEditor({ locale: LNG, i18n: null, scanner, registry });
    live.set(target('about.by', 'built by <strong>CreaTV</strong> Ltd.', { trans: true }), 'من <strong>CreaTV</strong>');
    expect(document.getElementById('p')!.textContent).toBe('built by CreaTV Ltd.');
    expect(live.isApproximate('interface', 'about.by')).toBe(true);
  });
});

describe('live edit: client strings with count', () => {
  it('a client plural string re-rendered by React is not re-patched with a literal {{count}}', async () => {
    const i18n = await makeI18n({ files_one: '{{count}} file', files_other: '{{count}} files' } as Record<string, string>);
    document.body.innerHTML = `<p id="p">${serverMarked('5 files', 'files_other')}</p>`;
    // The browser minted it: the registry knows the raw template but not `count` in params.
    registry.record({ ns: 'interface', key: 'files_other', lng: LNG }, { template: '{{count}} files', count: 5 });
    scanner = new DomScanner({ registry }).start({ immediate: true });
    const live = new LiveEditor({ locale: LNG, i18n, scanner, registry });
    live.attach();
    live.set(target('files_other', '{{count}} files'), '{{count}} ملفات');
    expect(document.getElementById('p')!.textContent).toBe('5 ملفات');
    // React re-renders the node from the store (fresh marked text) -> left as rendered.
    const p = document.getElementById('p')!;
    p.firstChild!.textContent = serverMarked(i18n.t('files', { count: 5 }), 'files_other');
    await flush();
    expect(p.textContent).toBe('5 ملفات');
    expect(live.isApproximate('interface', 'files_other')).toBe(false);
    live.dispose();
  });
});
