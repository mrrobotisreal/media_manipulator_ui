/**
 * MM49 acceptance 3 (dialog half) and 5: ladder-aware locks, upgrade routing
 * and the vector_export_* events, with a mocked API, a fake plan carrying a
 * served /api/tiers table, a fake probe, a stub raster runtime and a
 * recording tracker. Consent is the tracker's job; the consent gate itself is
 * lib/vector/analytics.test.ts.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';

import enPanels from '@/i18n/locales/en-us/interface/panels.json';
import { createI18nInstance } from '@/i18n';
import type { TierLimits, TiersResponse } from '@/lib/auth/accountApi';
import type { RasterProbe } from '@/lib/vector/raster/capabilities';
import { capsFromLimits } from '@/lib/vector/raster/caps';
import type { RasterPlan } from '@/lib/vector/raster/plan';
import type { RasterRuntime } from '@/lib/vector/raster/run';
import type { VectorTracker } from '@/lib/vector/analytics';
import { parseVectorDoc } from '@/lib/vector/vectorTypes';

vi.mock('next/navigation', () => ({ usePathname: () => '/motion/x', useRouter: () => ({ push: vi.fn() }) }));
vi.mock('@/i18n/useLocalizedHref', () => ({ useLocalizedHref: () => (p: string) => `/de${p}` }));
vi.mock('@/lib/firebase', () => ({ getCurrentIdToken: async () => null, onAuthStateChange: () => () => {} }));

import { ExportDialog } from './export-dialog';

const i18n = createI18nInstance('en-US');
i18n.addResourceBundle('en-US', 'interface', enPanels, true, true);

const doc = (() => {
  const r = parseVectorDoc({
    version: 1,
    duration: 4000,
    fps: 30,
    canvas: { width: 1280, height: 720 },
    layers: [{ type: 'rect', id: 'box', x: 0, y: 0, width: 10, height: 10 }],
    animations: [{ layerId: 'box', property: 'transform.x', keyframes: [{ t: 0, value: 0, easing: 'linear' }, { t: 4000, value: 90, easing: 'linear' }] }],
  });
  if (!r.ok) throw new Error(r.error);
  return r.doc;
})();

// The served ladder (API defaults after MM49).
const ANON = ['svg_animated'];
const FREE = [...ANON, 'lottie', 'import_lottie', 'import_svg_vectorize'];
const PREMIUM = [...FREE, 'react_tsx', 'js_ts', 'flutter', 'gif'];
const PRO = [...PREMIUM, 'png_sequence', 'mp4', 'webm'];
const none = { maxHeight: 0, maxFps: 0, maxSeconds: 0 };
const limits = (formats: string[], perDay: number, video = none, maxDurationMs = 0) =>
  ({ vectorFormats: formats, vectorExportsPerDay: perDay, vectorVideo: video, vectorMaxDurationMs: maxDurationMs }) as TierLimits;
const ROWS = {
  anonymous: limits(ANON, 2, none, 10000),
  free: limits(FREE, 5),
  premium: limits(PREMIUM, 30, { maxHeight: 720, maxFps: 0, maxSeconds: 15 }),
  pro: limits(PRO, 150, { maxHeight: 2160, maxFps: 60, maxSeconds: 60 }),
};
const TIERS: TiersResponse = {
  premiumPurchasable: true,
  premiumPriceUSD: 8,
  tiers: (Object.keys(ROWS) as Array<keyof typeof ROWS>).map((tier) => ({ tier, limits: ROWS[tier] })),
};
const planFor = (tier: keyof typeof ROWS | 'operator', tiers: TiersResponse | null = TIERS): RasterPlan => {
  const row = tier === 'operator' ? limits([...PRO], -1, { maxHeight: 4320, maxFps: 240, maxSeconds: 600 }) : ROWS[tier];
  return { tier, caps: capsFromLimits(row), publicFormats: new Set(PRO), tiers };
};
const PROBE: RasterProbe = { gif: true, png: true, webcodecs: true, h264: true, vp9: true, av1: true, offscreen: true, secureContext: true };

const fetchMock = vi.fn<typeof fetch>();
beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal('fetch', fetchMock);
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

const json = (status: number, body: unknown) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

function recorder() {
  const events: Array<[string, Record<string, unknown>]> = [];
  const track: VectorTracker = { track: (name, props) => void events.push([name, props as unknown as Record<string, unknown>]) };
  return { events, track, names: () => events.map(([n]) => n) };
}

function stubRuntime() {
  const run = vi.fn(async () => ({ blob: new Blob([new Uint8Array(150 * 1024)], { type: 'video/mp4' }), frames: 1, bytes: 150 * 1024 }));
  const runtime: RasterRuntime = { run, canEncode: vi.fn(async () => true), check: vi.fn(() => [] as string[]) };
  return { run, load: vi.fn(async () => runtime) };
}

function mount(plan: RasterPlan | null, rec = recorder()) {
  const save = vi.fn();
  const runtime = stubRuntime();
  render(
    <I18nextProvider i18n={i18n}>
      <ExportDialog open onOpenChange={() => {}} doc={doc} name="Bounce" time={0} signedIn save={save} plan={async () => plan} probe={async () => PROBE} raster={runtime.load} track={rec.track} />
    </I18nextProvider>,
  );
  return { save, rec, runtime };
}

const radio = (name: RegExp) => screen.getByRole('radio', { name }) as HTMLInputElement;
const exportButton = () => screen.getByRole('button', { name: 'Export' }) as HTMLButtonElement;
const settle = () => act(async () => {});
const gate = (id: string) => screen.queryByTestId(`vector-gate-${id}`);

describe('MM49 export dialog locks by ladder', () => {
  it.each([
    // tier, format id, lock?, required tier, CTA text
    ['anonymous', 'lottie', 'free', 'Sign in free'],
    ['anonymous', 'gif', 'premium', 'Upgrade to Premium'],
    ['anonymous', 'mp4', 'pro', 'Upgrade to Pro'],
    ['free', 'react_tsx', 'premium', 'Upgrade to Premium'],
    ['free', 'webm', 'pro', 'Upgrade to Pro'],
    ['premium', 'png_sequence', 'pro', 'Upgrade to Pro'],
    ['premium', 'mp4', 'pro', 'Upgrade to Pro'],
  ] as const)('%s × %s: lock icon, requires %s, "%s"', async (tier, format, required, cta) => {
    mount(planFor(tier));
    await settle();
    expect(screen.getByTestId(`vector-lock-${format}`)).toBeTruthy();
    const note = gate(format)!;
    expect(note.getAttribute('data-required-tier')).toBe(required);
    const link = note.querySelector('a')!;
    expect(link.textContent).toBe(cta);
    expect(link.getAttribute('href')).toBe(cta === 'Sign in free' ? '/de/account' : '/de/pricing');
  });

  it.each(['pro', 'operator'] as const)('%s: nothing is locked and no upsell is shown', async (tier) => {
    mount(planFor(tier));
    await settle();
    expect(document.querySelector('[data-testid^="vector-lock-"]')).toBeNull();
    expect(screen.queryByTestId('vector-upgrade-cta')).toBeNull();
  });

  it('premium sees Lottie, code and GIF unlocked', async () => {
    mount(planFor('premium'));
    await settle();
    for (const f of ['svg_animated', 'lottie', 'react_tsx', 'js', 'ts', 'flutter', 'gif']) expect(screen.queryByTestId(`vector-lock-${f}`)).toBeNull();
  });

  it('a pre-MM39 table (no pro row): video formats say "not on any plan", no upsell, no throw', async () => {
    const noPro: TiersResponse = { ...TIERS, tiers: TIERS.tiers.filter((t) => t.tier !== 'pro') };
    mount(planFor('premium', noPro));
    await settle();
    const note = gate('mp4')!;
    expect(note.getAttribute('data-cta')).toBe('none');
    expect(note.textContent).toContain('Not available on any plan yet.');
    expect(note.querySelector('a')).toBeNull();
  });

  it('picking a locked format disables Export and emits vector_export_gated once; the CTA emits upgrade_cta_clicked', async () => {
    const { rec } = mount(planFor('premium'));
    await settle();
    fireEvent.click(radio(/MP4 video/));
    fireEvent.click(radio(/Animated SVG/));
    fireEvent.click(radio(/MP4 video/));
    expect(exportButton().disabled).toBe(true);
    expect(rec.events.filter(([n]) => n === 'vector_export_gated')).toEqual([['vector_export_gated', { format: 'mp4', tier: 'premium', upgrade_path: 'pro' }]]);
    fireEvent.click(gate('mp4')!.querySelector('a')!);
    expect(rec.events.at(-1)).toEqual(['upgrade_cta_clicked', { placement: 'motion_export_lock', cta_id: 'motion_mp4', from_tier: 'premium' }]);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe('MM49 refusals route by ladder', () => {
  it.each([
    ['premium', 429, { error: 'vector_export_limit', tier: 'premium', limit: 30, used: 30, resetsAt: 'x', upgradePath: 'pro' }, 'Upgrade to Pro', 'pro'],
    ['free', 429, { error: 'vector_export_limit', tier: 'free', limit: 5, used: 5, resetsAt: 'x', upgradePath: 'premium' }, 'Upgrade to Premium', 'premium'],
    ['pro', 429, { error: 'vector_export_limit', tier: 'pro', limit: 150, used: 150, resetsAt: 'x', upgradePath: '' }, null, 'none'],
    ['premium', 422, { error: 'vector_cap_exceeded', cap: 'duration', max: 15000, tier: 'premium' }, 'Upgrade to Pro', null],
  ] as const)('%s %i → %s', async (tier, status, body, cta, gatedPath) => {
    const { rec } = mount(planFor(tier));
    await settle();
    fetchMock.mockResolvedValueOnce(json(status, body));
    fireEvent.click(exportButton());
    await waitFor(() => expect(screen.getByTestId('vector-export-status').querySelector('[data-refusal]')).toBeTruthy());
    const statusCta = screen.getByTestId('vector-export-status').querySelector('[data-testid="vector-upgrade-cta"]');
    if (cta) expect(statusCta?.textContent).toBe(cta);
    else expect(statusCta).toBeNull();
    const reason = status === 429 ? 'limit' : 'cap';
    expect(rec.events.find(([n]) => n === 'vector_export_failed')?.[1].reason).toBe(reason);
    const gated = rec.events.find(([n]) => n === 'vector_export_gated');
    if (gatedPath) expect(gated?.[1]).toEqual({ format: 'svg_animated', tier, upgrade_path: gatedPath });
    else expect(gated).toBeUndefined();
  });
});

describe('MM49 export events', () => {
  it('a successful export emits started, then completed, with bucketed fields', async () => {
    const { rec, save } = mount(planFor('pro'));
    await settle();
    fireEvent.click(radio(/MP4 video/));
    fetchMock.mockResolvedValueOnce(json(200, { ok: true, format: 'mp4', tier: 'pro', limit: 150, remaining: 149, resetsAt: '' }));
    fireEvent.click(exportButton());
    await waitFor(() => expect(save).toHaveBeenCalledTimes(1));
    const vec = rec.events.filter(([n]) => n.startsWith('vector_export_'));
    expect(vec.map(([n]) => n)).toEqual(['vector_export_started', 'vector_export_completed']);
    expect(vec[0][1]).toEqual({ format: 'mp4', duration_ms: '1-5s', height: '<=720', fps: '<=30' });
    const done = vec[1][1];
    expect(done).toMatchObject({ format: 'mp4', duration_ms: '1-5s', height: '<=720', fps: '<=30', bytes: '100kb-1mb' });
    expect(typeof done.ms).toBe('string');
    for (const v of Object.values(done)) expect(typeof v).toBe('string');
  });

  it('animated SVG carries its runtime', async () => {
    const { rec, save } = mount(planFor('free'));
    await settle();
    fetchMock.mockResolvedValueOnce(json(200, { ok: true, format: 'svg_animated', tier: 'free', limit: 5, remaining: 4, resetsAt: '' }));
    fireEvent.click(exportButton());
    await waitFor(() => expect(save).toHaveBeenCalledTimes(1));
    expect(rec.events.find(([n]) => n === 'vector_export_completed')?.[1]).toMatchObject({ format: 'svg_animated', runtime: 'css', duration_ms: '1-5s' });
  });

  it('a 422 emits started then failed {reason: cap}; nothing completes', async () => {
    const { rec, save } = mount(planFor('anonymous'));
    await settle();
    fetchMock.mockResolvedValueOnce(json(422, { error: 'vector_cap_exceeded', cap: 'duration', max: 10000, tier: 'anonymous' }));
    fireEvent.click(exportButton());
    await waitFor(() => expect(rec.names()).toContain('vector_export_failed'));
    expect(rec.names().filter((n) => n.startsWith('vector_export_'))).toEqual(['vector_export_started', 'vector_export_failed']);
    expect(rec.events.find(([n]) => n === 'vector_export_failed')?.[1]).toMatchObject({ format: 'svg_animated', reason: 'cap' });
    expect(save).not.toHaveBeenCalled();
  });

  it('static SVG: started + completed, still zero API calls', async () => {
    const { rec, save } = mount(planFor('anonymous'));
    await settle();
    fireEvent.click(radio(/Static SVG/));
    await act(async () => {
      fireEvent.click(exportButton());
    });
    expect(save).toHaveBeenCalledTimes(1);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(rec.names()).toEqual(['vector_export_started', 'vector_export_completed']);
    expect(rec.events[0][1]).toEqual({ format: 'svg_static', duration_ms: '0', height: '<=720', fps: '0' });
  });
});
