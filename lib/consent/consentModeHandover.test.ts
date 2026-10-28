/**
 * MM82 decision 4: when ads are on, our Consent Mode writes never touch the ad
 * signals in the `gdpr` group (Google's consent message owns them), and only
 * mirror an actual advertising decision elsewhere. GPC still wins.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { ConsentDetails } from './state';

vi.mock('./audit', () => ({ recordConsent: vi.fn(), deriveAction: () => 'updated' }));
vi.mock('./regions', () => ({
  resolveRegion: vi.fn(async () => ({ regionGroup: 'us' })),
  requiresOptIn: () => false,
}));
vi.mock('@/lib/analytics/identity', () => ({ getVisitorId: () => 'v1' }));

const base: ConsentDetails = {
  v: 2,
  policyVersion: 'p',
  bannerVersion: 'b',
  regionGroup: 'us',
  analytics: 'granted',
  advertising: 'unset',
  gpc: false,
  decidedAt: null,
};

type Gtag = ReturnType<typeof vi.fn>;

async function load(adsEnabled: boolean) {
  vi.stubEnv('NEXT_PUBLIC_ADSENSE_ENABLED', adsEnabled ? 'true' : 'false');
  vi.stubEnv('NODE_ENV', 'production');
  vi.stubEnv('NEXT_PUBLIC_DEPLOY_ROLE', '');
  vi.resetModules();
  const consent = await import('./index');
  const state = await import('./state');
  state.resetConsentStateForTests();
  return { consent, state };
}

function lastUpdate(gtag: Gtag): Record<string, string> {
  const calls = gtag.mock.calls.filter((c) => c[0] === 'consent' && c[1] === 'update');
  return calls[calls.length - 1]?.[2] as Record<string, string>;
}

let gtag: Gtag;
beforeEach(() => {
  gtag = vi.fn();
  (window as unknown as { gtag: Gtag }).gtag = gtag;
  localStorage.clear();
});
afterEach(() => {
  vi.unstubAllEnvs();
  Object.defineProperty(navigator, 'globalPrivacyControl', { value: undefined, configurable: true });
});

describe('ownsAdSignals', () => {
  it('ads off: always writes the ad signals (unchanged behaviour)', async () => {
    const { consent } = await load(false);
    expect(consent.ownsAdSignals({ ...base, regionGroup: 'gdpr' }, false)).toBe(true);
    expect(consent.ownsAdSignals(base, false)).toBe(true);
  });

  it('ads on: never in the gdpr group, only with a decision elsewhere', async () => {
    const { consent } = await load(true);
    expect(consent.ownsAdSignals({ ...base, regionGroup: 'gdpr', advertising: 'granted' }, true)).toBe(false);
    expect(consent.ownsAdSignals({ ...base, advertising: 'unset' }, true)).toBe(false);
    expect(consent.ownsAdSignals({ ...base, advertising: 'granted' }, true)).toBe(true);
    expect(consent.ownsAdSignals({ ...base, advertising: 'denied' }, true)).toBe(true);
    expect(consent.ownsAdSignals({ ...base, regionGroup: 'other', advertising: 'denied' }, true)).toBe(true);
  });
});

describe('pushConsentMode handover via setConsent', () => {
  it('ads on, gdpr group: the update carries analytics only, even when advertising is granted', async () => {
    const { consent, state } = await load(true);
    state.applyConsent({ ...base, regionGroup: 'gdpr', analytics: 'unset' }, false);
    consent.setConsent({ analytics: true, advertising: true, mechanism: 'banner' });
    expect(lastUpdate(gtag)).toEqual({ analytics_storage: 'granted' });
  });

  it('ads on, outside gdpr: the analytics-only banner leaves the ad defaults alone', async () => {
    const { consent, state } = await load(true);
    state.applyConsent({ ...base, regionGroup: 'other', analytics: 'unset' }, false);
    consent.setConsent({ analytics: true, mechanism: 'banner' });
    expect(lastUpdate(gtag)).toEqual({ analytics_storage: 'granted' });
  });

  it('ads on, outside gdpr: an advertising grant from the preferences centre is mirrored', async () => {
    const { consent, state } = await load(true);
    state.applyConsent(base, false);
    const next = consent.setConsent({ analytics: true, advertising: true, mechanism: 'preferences' });
    expect(next.advertising).toBe('granted');
    expect(lastUpdate(gtag)).toEqual({
      analytics_storage: 'granted',
      ad_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'granted',
    });
  });

  it('ads on, outside gdpr: GPC turns an advertising grant into denied, and that is mirrored', async () => {
    Object.defineProperty(navigator, 'globalPrivacyControl', { value: true, configurable: true });
    const { consent, state } = await load(true);
    state.applyConsent(base, false);
    const next = consent.setConsent({ analytics: true, advertising: true, mechanism: 'preferences' });
    expect(next.advertising).toBe('denied');
    expect(lastUpdate(gtag)).toMatchObject({ ad_storage: 'denied', ad_personalization: 'denied' });
  });

  it('ads off: every update carries all four signals, as before MM82', async () => {
    const { consent, state } = await load(false);
    state.applyConsent({ ...base, regionGroup: 'gdpr', analytics: 'unset' }, false);
    consent.setConsent({ analytics: true, mechanism: 'banner' });
    expect(Object.keys(lastUpdate(gtag)).sort()).toEqual(
      ['ad_personalization', 'ad_storage', 'ad_user_data', 'analytics_storage'],
    );
  });
});
