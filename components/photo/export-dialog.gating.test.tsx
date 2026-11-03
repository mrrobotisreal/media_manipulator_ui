/**
 * MM101 acceptance 3 (dialog half) and 4: ladder-aware CTAs on the locked Max sizes
 * and the batch wall, `photo_export_gated` once per kind, and the export started /
 * completed / failed trio, with a recording tracker and a fake backend. Consent is
 * the tracker's job (lib/photo/analytics.test.ts); the pure routing table is
 * lib/photo/gating.test.ts.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';

import type { TierLimits, TiersResponse } from '@/lib/auth/accountApi';
import type { BatchDeps } from '@/lib/photo/batch';
import type { PhotoTracker } from '@/lib/photo/analytics';
import { newPhotoDoc } from '@/lib/photo/photoTypes';
import { PhotoApiError, type PhotoCapabilities } from '@/lib/photo/projectsApi';
import { Wrap } from './test-utils';
import { ExportDialog } from './export-dialog';

vi.mock('next/navigation', () => ({ usePathname: () => '/photo/x', useRouter: () => ({ push: vi.fn() }) }));
vi.mock('@/i18n/useLocalizedHref', () => ({ useLocalizedHref: () => (p: string) => `/de${p}` }));
vi.mock('@/lib/firebase', () => ({ getCurrentIdToken: async () => null, onAuthStateChange: () => () => {} }));

const row = (photoProjects: number, photoMaxMegapixels: number, photoBatch: number) => ({ photoProjects, photoMaxMegapixels, photoBatch }) as TierLimits;
const TIERS: TiersResponse = {
  premiumPurchasable: true,
  premiumPriceUSD: 8,
  proPurchasable: true,
  tiers: [
    { tier: 'anonymous', limits: row(0, 12, 0) },
    { tier: 'free', limits: row(5, 12, 3) },
    { tier: 'premium', limits: row(50, 120, 10) },
    { tier: 'pro', limits: row(-1, 120, 25) },
  ],
};

beforeEach(() => {
  vi.stubGlobal('ResizeObserver', class { observe() {} unobserve() {} disconnect() {} });
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

function recorder() {
  const events: Array<[string, Record<string, unknown>]> = [];
  const track: PhotoTracker = { track: (name, props) => void events.push([name, props as unknown as Record<string, unknown>]) };
  return { events, track, of: (name: string) => events.filter(([n]) => n === name).map(([, p]) => p) };
}
const caps = (over: Partial<PhotoCapabilities> = {}): PhotoCapabilities => ({ enabled: true, render: true, formats: ['jpg', 'png', 'webp'], maxMegapixels: 12, photoProjects: 5, photoBatch: 3, aiMasks: false, heal: false, tier: 'free', ...over });
const dlg = (c: PhotoCapabilities, extra: Partial<React.ComponentProps<typeof ExportDialog>> = {}) => (
  <Wrap>
    <ExportDialog open onOpenChange={() => undefined} doc={newPhotoDoc(8000, 6000)} projectName="P" projectId="p1" file={null} signedIn capabilities={c} originalFile={null} tiers={TIERS} {...extra} />
  </Wrap>
);
const sizeBtn = (mp: number) => screen.getByRole('radio', { name: `${mp} MP` });

describe('export size gating (24 / 64 / 120 MP first available at Premium)', () => {
  it('free: the locked size shows the Premium note, a pricing CTA, and sends photo_export_gated once', () => {
    const rec = recorder();
    render(dlg(caps({ tier: 'free' }), { track: rec.track }));
    // The plan line itself carries the CTA for the locked options.
    expect(screen.getAllByTestId('photo-upgrade-cta')[0].getAttribute('data-cta')).toBe('premium');
    fireEvent.click(sizeBtn(24));
    fireEvent.click(sizeBtn(24));
    fireEvent.click(sizeBtn(64));
    const note = screen.getByTestId('size-gate');
    expect(note.getAttribute('data-required-tier')).toBe('premium');
    expect(note.textContent).toContain('Exports above 64 MP are included with Premium.');
    const cta = note.querySelector('[data-testid="photo-upgrade-cta"]') as HTMLAnchorElement;
    expect(cta.textContent).toBe('Upgrade to Premium');
    expect(cta.getAttribute('href')).toBe('/de/pricing');
    expect(cta.getAttribute('target')).toBe('_blank');
    expect(rec.of('photo_export_gated')).toEqual([
      { reason: 'megapixels', tier: 'free', upgrade_path: 'premium' },
      { reason: 'megapixels', tier: 'free', upgrade_path: 'premium' },
    ]); // once per size (24 and 64), not per click
    fireEvent.click(cta);
    expect(rec.of('upgrade_cta_clicked').at(-1)).toMatchObject({ placement: 'aperture_export_size_pick', from_tier: 'free' });
  });

  it('anonymous: also "Upgrade to Premium" (signing in alone never unlocks it), tier anonymous in the event', () => {
    const rec = recorder();
    render(dlg(caps({ tier: 'anonymous', photoBatch: 0 }), { signedIn: false, track: rec.track }));
    fireEvent.click(sizeBtn(120));
    expect(screen.getByTestId('size-gate').getAttribute('data-cta')).toBe('premium');
    expect(rec.of('photo_export_gated')).toEqual([{ reason: 'megapixels', tier: 'anonymous', upgrade_path: 'premium' }]);
  });

  it('premium and pro: nothing is locked, no size CTA, no gate event', () => {
    for (const tier of ['premium', 'pro']) {
      cleanup();
      const rec = recorder();
      render(dlg(caps({ tier, maxMegapixels: 120, photoBatch: 10 }), { track: rec.track }));
      expect(screen.queryByTestId('size-gate')).toBeNull();
      fireEvent.click(sizeBtn(120));
      expect(rec.of('photo_export_gated')).toEqual([]);
    }
  });

  it('without a served photo* table the dialog stays advisory-free: the ladder default is offered to free, nothing to premium', () => {
    const rec = recorder();
    render(dlg(caps({ tier: 'free' }), { tiers: null, track: rec.track }));
    fireEvent.click(sizeBtn(24));
    expect(screen.getByTestId('size-gate').getAttribute('data-cta')).toBe('premium');
  });
});

describe('batch wall CTAs', () => {
  const wallDeps = (err: PhotoApiError): BatchDeps => ({
    createProject: vi.fn(async (f: File) => ({ id: `id-${f.name}` })),
    startBatch: vi.fn(async () => {
      throw err;
    }),
    jobStatus: vi.fn(async () => ({ status: 'completed' })),
    fetchResult: vi.fn(async () => new Blob(['x'])),
    sleep: vi.fn(async () => undefined),
  });

  it('anonymous (cap 0): "Sign in free" and photo_export_gated {batch, anonymous, signup}', () => {
    const rec = recorder();
    render(dlg(caps({ tier: 'anonymous', photoBatch: 0 }), { signedIn: false, track: rec.track }));
    fireEvent.click(screen.getByTestId('batch-choose'));
    const line = screen.getByTestId('batch-signin');
    expect((line.querySelector('[data-testid="photo-upgrade-cta"]') as HTMLElement).textContent).toBe('Sign in free');
    expect(rec.of('photo_export_gated')).toEqual([{ reason: 'batch', tier: 'anonymous', upgrade_path: 'signup' }]);
  });

  it('free at the server limit (403 photo_batch_limit): "Upgrade to Premium", gated + failed(limit)', async () => {
    const rec = recorder();
    render(dlg(caps({ tier: 'free', photoBatch: 3 }), { batchDeps: wallDeps(new PhotoApiError(403, 'photo_batch_limit', { limit: 3 })), track: rec.track }));
    fireEvent.change(screen.getByTestId('batch-input'), { target: { files: [new File(['1'], 'a.jpg')] } });
    await waitFor(() => expect(screen.getByTestId('batch-limit')).toBeTruthy());
    expect((screen.getByTestId('batch-limit').querySelector('[data-testid="photo-upgrade-cta"]') as HTMLElement).textContent).toBe('Upgrade to Premium');
    expect(rec.of('photo_export_gated')).toEqual([{ reason: 'batch', tier: 'free', upgrade_path: 'premium' }]);
    expect(rec.of('photo_export_failed')).toEqual([expect.objectContaining({ reason: 'limit' })]);
  });

  it('premium at its 10: "Upgrade to Pro"; pro at 25: no CTA', async () => {
    let rec = recorder();
    render(dlg(caps({ tier: 'premium', photoBatch: 10, maxMegapixels: 120 }), { batchDeps: wallDeps(new PhotoApiError(403, 'photo_batch_limit', { limit: 10 })), track: rec.track }));
    fireEvent.change(screen.getByTestId('batch-input'), { target: { files: [new File(['1'], 'a.jpg')] } });
    await waitFor(() => expect(screen.getByTestId('batch-limit')).toBeTruthy());
    expect((screen.getByTestId('batch-limit').querySelector('[data-testid="photo-upgrade-cta"]') as HTMLElement).textContent).toBe('Upgrade to Pro');
    expect(rec.of('photo_export_gated')).toEqual([{ reason: 'batch', tier: 'premium', upgrade_path: 'pro' }]);
    cleanup();
    rec = recorder();
    render(dlg(caps({ tier: 'pro', photoBatch: 25, maxMegapixels: 120 }), { batchDeps: wallDeps(new PhotoApiError(403, 'photo_batch_limit', { limit: 25 })), track: rec.track }));
    fireEvent.change(screen.getByTestId('batch-input'), { target: { files: [new File(['1'], 'a.jpg')] } });
    await waitFor(() => expect(screen.getByTestId('batch-limit')).toBeTruthy());
    expect(screen.getByTestId('batch-limit').querySelector('[data-testid="photo-upgrade-cta"]')).toBeNull();
    expect(rec.of('photo_export_gated')).toEqual([{ reason: 'batch', tier: 'pro', upgrade_path: 'none' }]);
  });
});

describe('export outcome events', () => {
  it('start: photo_export_started with buckets; a refused start: photo_export_failed with a mapped reason', async () => {
    const rec = recorder();
    const exporters = {
      project: vi.fn(async () => {
        throw new PhotoApiError(429, '');
      }),
      stateless: vi.fn(),
    };
    render(dlg(caps({ tier: 'free' }), { track: rec.track, exporters: exporters as never }));
    fireEvent.click(screen.getByTestId('export-start'));
    await waitFor(() => expect(rec.of('photo_export_failed')).toHaveLength(1));
    expect(rec.of('photo_export_started')).toEqual([{ format: 'jpg', megapixels_bucket: '<=16', layers: '0', masks: '0', batch_size: '1' }]);
    expect(rec.of('photo_export_failed')[0]).toMatchObject({ format: 'jpg', megapixels_bucket: '<=16', reason: 'limit' });
    expect(Object.keys(rec.of('photo_export_failed')[0]).sort()).toEqual(['format', 'megapixels_bucket', 'ms', 'reason']);
  });
});
