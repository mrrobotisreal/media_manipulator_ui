/**
 * MM82 decision 5: the Advertising row is a real switch outside the `gdpr`
 * group while ads are on; in `gdpr` it defers to Google's consent message; GPC
 * keeps it off and locked; with ads off it stays disabled.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';

import components from '@/i18n/locales/en-us/interface/components.json';

const details = {
  regionGroup: 'us' as string,
  analytics: 'granted',
  advertising: 'unset',
  gpc: false,
};
const setConsent = vi.fn((input: { analytics: boolean; advertising?: boolean }) => ({
  ...details,
  analytics: input.analytics ? 'granted' : 'denied',
  advertising: input.advertising === undefined ? details.advertising : input.advertising ? 'granted' : 'denied',
}));

vi.mock('next/link', () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => <a href={href}>{children}</a>,
}));
vi.mock('@/i18n/useLocalization', () => ({
  useLocalization: () => ({
    t: (key: string) => {
      const k = key.replace(/^interface:/, '');
      const v = k.split('.').reduce<unknown>((o, p) => (o as Record<string, unknown> | undefined)?.[p], components);
      return typeof v === 'string' ? v : key;
    },
  }),
}));
vi.mock('@/i18n/useLocalizedHref', () => ({ useLocalizedHref: () => (p: string) => p }));
vi.mock('@/lib/consent', () => ({
  getConsentDetails: () => ({ ...details }),
  setConsent: (input: { analytics: boolean; advertising?: boolean }) => setConsent(input),
  optOutOfSale: () => ({ ...details, advertising: 'denied' }),
}));
vi.mock('@/lib/analytics', () => ({
  analyticsBaseUrl: () => 'https://a.example',
  forgetIdentity: vi.fn(),
  getVisitorId: () => 'v',
}));
vi.mock('@/lib/firebase', () => ({ getCurrentIdToken: async () => null }));

const prefs = components.consentPrefs;

async function open(adsEnabled: boolean) {
  vi.stubEnv('NEXT_PUBLIC_ADSENSE_ENABLED', adsEnabled ? 'true' : 'false');
  vi.stubEnv('NODE_ENV', 'production');
  vi.stubEnv('NEXT_PUBLIC_DEPLOY_ROLE', '');
  vi.resetModules();
  const { ConsentPreferences } = await import('./consent-preferences');
  render(<ConsentPreferences onClose={() => undefined} />);
}

const advertisingSwitch = () => screen.getByRole('switch', { name: prefs.advertising.title });

afterEach(() => {
  cleanup();
  vi.unstubAllEnvs();
  setConsent.mockClear();
  Object.assign(details, { regionGroup: 'us', analytics: 'granted', advertising: 'unset', gpc: false });
  delete (window as { googlefc?: unknown }).googlefc;
});

describe('ConsentPreferences advertising row', () => {
  it.each(['us', 'other', 'unknown'])('ads on, %s group: the switch grants advertising on save', async (region) => {
    details.regionGroup = region;
    await open(true);
    const sw = advertisingSwitch();
    expect(sw.hasAttribute('disabled')).toBe(false);
    expect(screen.getByText(prefs.advertising.body)).toBeTruthy();
    fireEvent.click(sw);
    fireEvent.click(screen.getByRole('button', { name: prefs.save }));
    expect(setConsent).toHaveBeenCalledWith({ analytics: true, advertising: true, mechanism: 'preferences' });
  });

  it('ads on, us group: switching a granted advertising choice off denies it', async () => {
    details.advertising = 'granted';
    await open(true);
    fireEvent.click(advertisingSwitch());
    fireEvent.click(screen.getByRole('button', { name: prefs.save }));
    expect(setConsent).toHaveBeenCalledWith({ analytics: true, advertising: false, mechanism: 'preferences' });
  });

  it('ads on, GPC: the switch is off and locked and saving never grants advertising', async () => {
    details.gpc = true;
    details.advertising = 'denied';
    await open(true);
    const sw = advertisingSwitch();
    expect(sw.hasAttribute('disabled')).toBe(true);
    expect(sw.getAttribute('aria-checked')).toBe('false');
    expect(screen.getByText(prefs.advertising.bodyGpc)).toBeTruthy();
    fireEvent.click(sw);
    fireEvent.click(screen.getByRole('button', { name: prefs.save }));
    expect(setConsent).toHaveBeenCalledWith({ analytics: true, mechanism: 'preferences' });
  });

  it('ads on, gdpr group: no switch; a managed-by-Google note and a button that reopens Google’s message', async () => {
    details.regionGroup = 'gdpr';
    const showRevocationMessage = vi.fn();
    const callbackQueue: Array<() => void> = [];
    (window as { googlefc?: unknown }).googlefc = { callbackQueue, showRevocationMessage };
    await open(true);
    expect(screen.queryByRole('switch', { name: prefs.advertising.title })).toBeNull();
    expect(screen.getByText(prefs.advertising.bodyGdpr)).toBeTruthy();
    expect(screen.getByText(prefs.advertising.managedByGoogle)).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: prefs.advertising.openGoogleMessage }));
    callbackQueue.forEach((cb) => cb());
    expect(showRevocationMessage).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByRole('button', { name: prefs.save }));
    expect(setConsent).toHaveBeenCalledWith({ analytics: true, mechanism: 'preferences' });
  });

  it('ads on, gdpr group without Google’s message: the note shows, the button does not', async () => {
    details.regionGroup = 'gdpr';
    await open(true);
    expect(screen.getByText(prefs.advertising.managedByGoogle)).toBeTruthy();
    expect(screen.queryByRole('button', { name: prefs.advertising.openGoogleMessage })).toBeNull();
  });

  it('ads off: the switch is disabled and saving leaves advertising untouched', async () => {
    await open(false);
    expect(advertisingSwitch().hasAttribute('disabled')).toBe(true);
    fireEvent.click(screen.getByRole('button', { name: prefs.save }));
    expect(setConsent).toHaveBeenCalledWith({ analytics: true, mechanism: 'preferences' });
  });
});
