/**
 * MM82 decision 4: the first-party bar shows wherever `needsPrompt` is true,
 * ads on or off (it used to return early with ads on, so EEA visitors whose
 * ad script never loaded got no banner at all).
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';

const details = { regionGroup: 'gdpr', analytics: 'unset', advertising: 'unset', gpc: false };

vi.mock('next/dynamic', () => ({
  default: (loader: () => Promise<unknown>) => {
    const name = String(loader).includes('consent-banner') ? 'banner' : 'preferences';
    const Stub = () => <div data-testid={`consent-${name}`} />;
    return Stub;
  },
}));
vi.mock('@/lib/consent', () => ({
  initConsent: vi.fn(async () => details),
  getConsentDetails: () => details,
  needsPrompt: (d: { analytics: string }) => d.analytics === 'unset',
  onConsentReviewRequest: () => () => undefined,
}));

async function loadGate(adsEnabled: boolean) {
  vi.stubEnv('NEXT_PUBLIC_ADSENSE_ENABLED', adsEnabled ? 'true' : 'false');
  vi.stubEnv('NODE_ENV', 'production');
  vi.stubEnv('NEXT_PUBLIC_DEPLOY_ROLE', '');
  vi.resetModules();
  return (await import('./consent-gate')).ConsentGate;
}

afterEach(() => {
  cleanup();
  vi.unstubAllEnvs();
  details.analytics = 'unset';
});

describe('ConsentGate', () => {
  it.each([true, false])('shows the first-party banner in the gdpr group (ads enabled: %s)', async (ads) => {
    const ConsentGate = await loadGate(ads);
    render(<ConsentGate />);
    await waitFor(() => expect(screen.getByTestId('consent-banner')).toBeTruthy());
  });

  it('shows no banner once analytics is decided, with ads on', async () => {
    details.analytics = 'granted';
    const ConsentGate = await loadGate(true);
    render(<ConsentGate />);
    await new Promise((r) => setTimeout(r, 0));
    expect(screen.queryByTestId('consent-banner')).toBeNull();
  });
});
