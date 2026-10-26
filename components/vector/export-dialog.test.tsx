/**
 * MM44 acceptance 5: the counted export flow with a mocked API.
 *   {ok:true}  → exporter runs, file downloads, remaining shown
 *   429/403/422 → no exporter run, message + /pricing link
 *   static SVG → ZERO API calls (no fetch at all)
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';

import enPanels from '@/i18n/locales/en-us/interface/panels.json';
import { createI18nInstance } from '@/i18n';
import { parseVectorDoc } from '@/lib/vector/vectorTypes';

const css = vi.hoisted(() => ({ spy: null as null | ReturnType<typeof vi.fn> }));
vi.mock('@/lib/vector/export/css', async (orig) => {
  const real = await orig<typeof import('@/lib/vector/export/css')>();
  const spy = vi.fn(real.exportAnimatedSvgCss);
  css.spy = spy;
  return { ...real, exportAnimatedSvgCss: spy };
});
vi.mock('next/navigation', () => ({ usePathname: () => '/motion/x', useRouter: () => ({ push: vi.fn() }) }));
vi.mock('@/i18n/useLocalizedHref', () => ({ useLocalizedHref: () => (p: string) => `/de${p}` }));
vi.mock('@/lib/firebase', () => ({ getCurrentIdToken: async () => null, onAuthStateChange: () => () => {} }));

import { ExportDialog } from './export-dialog';
import { countVectorExport } from '@/lib/vector/exportsApi';

const i18n = createI18nInstance('en-US');
i18n.addResourceBundle('en-US', 'interface', enPanels, true, true);

const doc = (() => {
  const r = parseVectorDoc({
    version: 1,
    duration: 1500,
    fps: 30,
    canvas: { width: 400, height: 300 },
    layers: [{ type: 'rect', id: 'box', x: 0, y: 0, width: 10, height: 10 }],
    animations: [{ layerId: 'box', property: 'transform.x', keyframes: [{ t: 0, value: 0, easing: 'linear' }, { t: 1500, value: 90, easing: 'linear' }] }],
  });
  if (!r.ok) throw new Error(r.error);
  return r.doc;
})();

const fetchMock = vi.fn<typeof fetch>();
beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal('fetch', fetchMock);
  css.spy!.mockClear();
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

const json = (status: number, body: unknown) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

function mount(extra: Partial<React.ComponentProps<typeof ExportDialog>> = {}) {
  const save = vi.fn();
  render(
    <I18nextProvider i18n={i18n}>
      <ExportDialog open onOpenChange={() => {}} doc={doc} name="Bounce" time={750} signedIn={false} save={save} {...extra} />
    </I18nextProvider>,
  );
  return { save };
}

const exportButton = () => screen.getByRole('button', { name: 'Export' });

describe('Motion export dialog', () => {
  it('lists animated SVG, static SVG, the MM46 formats, the beta label, and GIF / video disabled', () => {
    mount();
    expect(screen.getByRole('radio', { name: /Animated SVG/ })).toBeTruthy();
    expect(screen.getByRole('radio', { name: /Static SVG/ })).toBeTruthy();
    for (const name of [/^Lottie JSON/, /^React component/, /^JavaScript module/, /^TypeScript module/, /^Flutter widget/]) expect(screen.getByRole('radio', { name })).toBeTruthy();
    expect(screen.getByText('Motion (beta)')).toBeTruthy();
    expect(screen.getAllByText('Coming soon').length).toBeGreaterThan(1);
  });

  it('{ok:true}: counts first, then runs the exporter and downloads; remaining is shown', async () => {
    fetchMock.mockResolvedValueOnce(json(200, { ok: true, format: 'svg_animated', tier: 'anonymous', limit: 2, remaining: 1, resetsAt: '2026-10-26T00:00:00Z' }));
    const { save } = mount();
    fireEvent.click(exportButton());
    await waitFor(() => expect(save).toHaveBeenCalledTimes(1));
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(String(url)).toMatch(/\/vector\/exports$/);
    expect(init?.method).toBe('POST');
    expect(JSON.parse(String(init?.body))).toEqual({ format: 'svg_animated', durationMs: 1500, height: 300, fps: 30 });
    expect(new Headers(init?.headers).get('X-MM-Session-ID')).toBeTruthy();
    expect(css.spy).toHaveBeenCalledTimes(1);
    expect(css.spy!.mock.invocationCallOrder[0]).toBeGreaterThan(fetchMock.mock.invocationCallOrder[0]);
    const [blob, fileName] = save.mock.calls[0] as [Blob, string];
    expect(fileName).toBe('Bounce.svg');
    const text = await blob.text();
    expect(text.startsWith('<!-- made with Media Manipulator -->')).toBe(true);
    expect(text).toContain('@keyframes mm-box-transform');
    expect(screen.getByTestId('vector-export-status').textContent).toBe('Downloaded. 1 animated export left today.');
  });

  it('sends projectId when the project is saved', async () => {
    fetchMock.mockResolvedValueOnce(json(200, { ok: true, remaining: -1 }));
    mount({ projectId: '6f1c', signedIn: true });
    fireEvent.click(exportButton());
    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    expect(JSON.parse(String(fetchMock.mock.calls[0][1]?.body)).projectId).toBe('6f1c');
    await waitFor(() => expect(screen.getByTestId('vector-export-status').textContent).toBe('Downloaded.'));
  });

  it.each([
    [429, { error: 'vector_export_limit', tier: 'anonymous', metric: 'vector_export', limit: 2, used: 2, resetsAt: 'x', upgradePath: 'signup' }, 'limit', 'You have used your 2 animated exports for today.'],
    [403, { error: 'vector_format_locked', format: 'svg_animated', tier: 'anonymous', upgradePath: 'signup' }, 'locked', 'Your plan does not include this format.'],
    [422, { error: 'vector_cap_exceeded', cap: 'duration', max: 10000, tier: 'anonymous' }, 'cap', 'Your plan exports animations up to 10 s long.'],
  ])('%i: no exporter run, message with a /pricing link', async (status, body, kind, message) => {
    fetchMock.mockResolvedValueOnce(json(status, body));
    const { save } = mount();
    fireEvent.click(exportButton());
    await waitFor(() => expect(screen.getByTestId('vector-export-status').querySelector('[data-refusal]')).toBeTruthy());
    const el = screen.getByTestId('vector-export-status').querySelector('[data-refusal]')!;
    expect(el.getAttribute('data-refusal')).toBe(kind);
    expect(el.textContent).toContain(message);
    expect(screen.getByRole('link', { name: 'See plans' }).getAttribute('href')).toBe('/de/pricing');
    expect(css.spy).not.toHaveBeenCalled();
    expect(save).not.toHaveBeenCalled();
  });

  it('503 / network failure: fails closed, no exporter run, no upgrade link', async () => {
    fetchMock.mockRejectedValueOnce(new TypeError('offline'));
    const { save } = mount();
    fireEvent.click(exportButton());
    await waitFor(() => expect(screen.getByTestId('vector-export-status').textContent).toContain('Nothing was counted'));
    expect(screen.queryByRole('link', { name: 'See plans' })).toBeNull();
    expect(css.spy).not.toHaveBeenCalled();
    expect(save).not.toHaveBeenCalled();
  });

  it('static SVG export makes zero API calls', async () => {
    const { save } = mount();
    fireEvent.click(screen.getByRole('radio', { name: /Static SVG/ }));
    await act(async () => {
      fireEvent.click(exportButton());
    });
    expect(save).toHaveBeenCalledTimes(1);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(css.spy).not.toHaveBeenCalled();
    const svg = await (save.mock.calls[0][0] as Blob).text();
    // The frame at the playhead (750 ms → x = 45), no animation.
    expect(svg).toContain('transform="translate(45 0)"');
    expect(svg).not.toContain('<style>');
    expect(screen.getByTestId('vector-export-status').textContent).toBe('Static SVG downloaded.');
  });

  it('a document CSS cannot express is refused before any API call', async () => {
    // MM45: draw-on is CSS now; a track inside a symbol is something no exporter writes.
    const r = parseVectorDoc({
      ...JSON.parse(JSON.stringify(doc)),
      layers: [...JSON.parse(JSON.stringify(doc)).layers, { type: 'use', id: 'u', ref: 'sym' }],
      defs: { symbols: [{ id: 'sym', layers: [{ type: 'rect', id: 'in-sym', x: 0, y: 0, width: 5, height: 5 }] }] },
      animations: [{ layerId: 'in-sym', property: 'opacity', keyframes: [{ t: 0, value: 1, easing: 'linear' }, { t: 1000, value: 0, easing: 'linear' }] }],
    });
    if (!r.ok) throw new Error(r.error);
    mount({ doc: r.doc });
    expect((exportButton() as HTMLButtonElement).disabled).toBe(true);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

const morphDoc = (() => {
  const r = parseVectorDoc({
    ...JSON.parse(JSON.stringify(doc)),
    layers: [{ type: 'path', id: 'box', d: 'M0 0L10 0L10 10Z' }],
    animations: [{ layerId: 'box', property: 'd', keyframes: [{ t: 0, value: 'M0 0L10 0L10 10Z', easing: 'linear' }, { t: 1500, value: 'M0 0L20 0L20 20Z', easing: 'linear' }] }],
  });
  if (!r.ok) throw new Error(r.error);
  return r.doc;
})();

describe('MM45: runtime chooser in the dialog', () => {
  it('a CSS-expressible document says "Pure CSS" and exports CSS', async () => {
    fetchMock.mockResolvedValueOnce(json(200, { ok: true, format: 'svg_animated', tier: 'free', limit: 5, remaining: 4, resetsAt: '' }));
    const { save } = mount();
    expect(screen.getByTestId('vector-export-runtime').dataset.runtime).toBe('css');
    expect(screen.getByText('Pure CSS, no script.')).toBeTruthy();
    fireEvent.click(exportButton());
    await waitFor(() => expect(save).toHaveBeenCalledTimes(1));
    const text = await (save.mock.calls[0][0] as Blob).text();
    expect(text).not.toContain('<script');
  });

  it('a morph shows the script runtime and its reason, locks the checkbox, and exports anime (counted as svg_animated)', async () => {
    fetchMock.mockResolvedValueOnce(json(200, { ok: true, format: 'svg_animated', tier: 'free', limit: 5, remaining: 4, resetsAt: '' }));
    const { save } = mount({ doc: morphDoc });
    const note = screen.getByTestId('vector-export-runtime');
    expect(note.dataset.runtime).toBe('anime');
    expect(note.textContent).toMatch(/Uses a \d+ KB script \(anime\.js, MIT\) because: shape morph\./);
    expect(note.textContent).toContain('not inside an <img> tag');
    const box = screen.getByRole('checkbox', { name: 'Use the script runtime' }) as HTMLInputElement;
    expect(box.checked).toBe(true);
    expect(box.disabled).toBe(true);
    fireEvent.click(exportButton());
    await waitFor(() => expect(save).toHaveBeenCalledTimes(1));
    expect(JSON.parse(String(fetchMock.mock.calls[0][1]?.body)).format).toBe('svg_animated');
    const text = await (save.mock.calls[0][0] as Blob).text();
    expect(text.startsWith('<!--\nanime.js v')).toBe(true);
    expect(text.match(/<script/g)).toHaveLength(1);
    expect(css.spy).not.toHaveBeenCalled();
  });

  it('the user can force the script runtime on a CSS document', async () => {
    fetchMock.mockResolvedValueOnce(json(200, { ok: true, format: 'svg_animated', tier: 'free', limit: 5, remaining: 4, resetsAt: '' }));
    const { save } = mount();
    fireEvent.click(screen.getByRole('checkbox', { name: 'Use the script runtime' }));
    expect(screen.getByTestId('vector-export-runtime').dataset.runtime).toBe('anime');
    fireEvent.click(exportButton());
    await waitFor(() => expect(save).toHaveBeenCalledTimes(1));
    expect(await (save.mock.calls[0][0] as Blob).text()).toContain('<script><![CDATA[');
  });
});

describe('translator deployments (MM52 gating)', () => {
  afterEach(() => vi.unstubAllEnvs());

  it('hide the counted format; static SVG stays and still makes zero API calls', async () => {
    vi.stubEnv('NEXT_PUBLIC_DEPLOY_ROLE', 'translator');
    const { save } = mount();
    expect(screen.queryByRole('radio', { name: /Animated SVG/ })).toBeNull();
    expect((screen.getByRole('radio', { name: /Static SVG/ }) as HTMLInputElement).checked).toBe(true);
    await act(async () => {
      fireEvent.click(exportButton());
    });
    expect(save).toHaveBeenCalledTimes(1);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe('countVectorExport', () => {
  it('maps every MM43 refusal and never throws', async () => {
    const cases: Array<[Response, string]> = [
      [json(429, { error: 'vector_export_limit', limit: 5, used: 5, upgradePath: 'premium' }), 'limit'],
      [json(403, { error: 'vector_format_locked', upgradePath: '' }), 'locked'],
      [json(422, { error: 'vector_cap_exceeded', cap: 'height', max: 720 }), 'cap'],
      [json(503, { error: 'Exports are temporarily unavailable' }), 'unavailable'],
      [json(400, { error: 'vector_format_not_countable' }), 'unavailable'],
    ];
    for (const [res, kind] of cases) {
      const f = vi.fn(async () => res);
      const r = await countVectorExport({ format: 'svg_animated', durationMs: 1, height: 1, fps: 1 }, f);
      expect(r.ok).toBe(false);
      if (!r.ok) expect(r.refusal.kind).toBe(kind);
    }
  });
});

describe('MM46: Lottie and code exports in the dialog', () => {
  const ok = (format: string) => json(200, { ok: true, format, tier: 'premium', limit: 30, remaining: 29, resetsAt: '' });
  const pick = (name: RegExp) => fireEvent.click(screen.getByRole('radio', { name }));

  it.each([
    [/^Lottie JSON/, 'lottie', 'Bounce.json'],
    [/^React component/, 'react_tsx', 'Bounce.tsx'],
    [/^JavaScript module/, 'js_ts', 'Bounce.js'],
    [/^TypeScript module/, 'js_ts', 'Bounce.ts'],
    [/^Flutter widget/, 'flutter', 'bounce.dart'],
  ])('%s counts as %s first, then downloads %s', async (radio, format, fileName) => {
    fetchMock.mockResolvedValueOnce(ok(format));
    const { save } = mount();
    pick(radio);
    fireEvent.click(exportButton());
    await waitFor(() => expect(save).toHaveBeenCalledTimes(1));
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(JSON.parse(String(fetchMock.mock.calls[0][1]?.body))).toEqual({ format, durationMs: 1500, height: 300, fps: 30 });
    expect((save.mock.calls[0] as [Blob, string])[1]).toBe(fileName);
    expect(screen.getByTestId('vector-export-status').textContent).toContain('29 animated exports left today.');
  });

  it.each([
    [429, { error: 'vector_export_limit', limit: 30, used: 30, upgradePath: 'pro' }, 'limit'],
    [403, { error: 'vector_format_locked', format: 'flutter', tier: 'free', upgradePath: 'premium' }, 'locked'],
  ])('%i: no exporter run, no download', async (status, body, kind) => {
    fetchMock.mockResolvedValueOnce(json(status, body));
    const { save } = mount();
    pick(/^Flutter widget/);
    fireEvent.click(exportButton());
    await waitFor(() => expect(screen.getByTestId('vector-export-status').querySelector('[data-refusal]')).toBeTruthy());
    expect(screen.getByTestId('vector-export-status').querySelector('[data-refusal]')!.getAttribute('data-refusal')).toBe(kind);
    expect(save).not.toHaveBeenCalled();
  });

  it('Lottie: the unsupported list is shown, and the warnings after the export name the feature and layer', async () => {
    const r = parseVectorDoc({ ...JSON.parse(JSON.stringify(doc)), layers: [...JSON.parse(JSON.stringify(doc)).layers, { type: 'text', id: 'title', name: 'Headline', x: 0, y: 20, text: 'Hi' }] });
    if (!r.ok) throw new Error(r.error);
    fetchMock.mockResolvedValueOnce(ok('lottie'));
    const { save } = mount({ doc: r.doc });
    pick(/^Lottie JSON/);
    expect(screen.getByTestId('vector-lottie-support').textContent).toContain('Blur and other filters');
    fireEvent.click(exportButton());
    await waitFor(() => expect(save).toHaveBeenCalledTimes(1));
    const list = screen.getByTestId('vector-export-warnings');
    expect(list.textContent).toContain('1 thing did not carry over');
    expect(list.querySelector('[data-feature="text"]')!.textContent).toContain('Headline');
    const lottie = JSON.parse(await (save.mock.calls[0][0] as Blob).text());
    expect(lottie.ver).toBe(10001);
  });

  it('Flutter: a transform-only document says it emitted the native widget', async () => {
    fetchMock.mockResolvedValueOnce(ok('flutter'));
    mount();
    pick(/^Flutter widget/);
    fireEvent.click(exportButton());
    await waitFor(() => expect(screen.getByTestId('vector-export-emitted-flutter')).toBeTruthy());
    const note = screen.getByTestId('vector-export-emitted-flutter');
    expect(note.dataset.emitter).toBe('native');
    expect(note.textContent).toContain('native widget');
  });

  it('Flutter: a morph says it emitted the WebView player and why', async () => {
    fetchMock.mockResolvedValueOnce(ok('flutter'));
    const { save } = mount({ doc: morphDoc });
    pick(/^Flutter widget/);
    fireEvent.click(exportButton());
    await waitFor(() => expect(save).toHaveBeenCalledTimes(1));
    const note = screen.getByTestId('vector-export-emitted-flutter');
    expect(note.dataset.emitter).toBe('webview');
    expect(note.textContent).toContain('because it morphs a shape');
    expect(note.textContent).toContain('opaque background');
    expect(screen.getByTestId('vector-export-emitted-runtime').textContent).toContain('because: shape morph');
  });

  it('React: the runtime that was emitted is stated', async () => {
    fetchMock.mockResolvedValueOnce(ok('react_tsx'));
    const { save } = mount();
    pick(/^React component/);
    fireEvent.click(exportButton());
    await waitFor(() => expect(save).toHaveBeenCalledTimes(1));
    expect(screen.getByTestId('vector-export-emitted-runtime').textContent).toBe('Animated with CSS, no script.');
    expect(await (save.mock.calls[0][0] as Blob).text()).toContain("from 'react'");
  });

  it('a document no exporter can write disables the code formats before any API call', async () => {
    const r = parseVectorDoc({
      ...JSON.parse(JSON.stringify(doc)),
      layers: [...JSON.parse(JSON.stringify(doc)).layers, { type: 'use', id: 'u', ref: 'sym' }],
      defs: { symbols: [{ id: 'sym', layers: [{ type: 'rect', id: 'in-sym', x: 0, y: 0, width: 5, height: 5 }] }] },
      animations: [{ layerId: 'in-sym', property: 'opacity', keyframes: [{ t: 0, value: 1, easing: 'linear' }, { t: 1000, value: 0, easing: 'linear' }] }],
    });
    if (!r.ok) throw new Error(r.error);
    mount({ doc: r.doc });
    pick(/^React component/);
    expect((exportButton() as HTMLButtonElement).disabled).toBe(true);
    pick(/^Lottie JSON/);
    expect((exportButton() as HTMLButtonElement).disabled).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('translator deployments hide every counted MM46 format', () => {
    vi.stubEnv('NEXT_PUBLIC_DEPLOY_ROLE', 'translator');
    mount();
    for (const name of [/^Lottie JSON/, /^React component/, /^JavaScript module/, /^TypeScript module/, /^Flutter widget/]) expect(screen.queryByRole('radio', { name })).toBeNull();
    vi.unstubAllEnvs();
  });
});
