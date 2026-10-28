/**
 * MM82 decisions 2–3: an ad unit's existence is gated on tier + path + slot,
 * never on first-party consent, and an unresolved or missing tier shows nothing.
 *
 * `ADSENSE_ENABLED` is read at module scope, so the component is re-imported
 * after `vi.resetModules()` with ads on in production (as a build would).
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render } from '@testing-library/react';

type FakeAuth = {
  loading: boolean;
  user: { uid: string } | null;
  limits: { adsRemoved: boolean } | null;
} | null;

let auth: FakeAuth = null;
let pathname = '/tools/compress-image';
const hasAdStorageConsent = vi.fn(() => false);

vi.mock('next/navigation', () => ({ usePathname: () => pathname }));
vi.mock('@/lib/auth/AuthProvider', () => ({ useAuth: () => auth }));
vi.mock('@/components/mock-ad', () => ({ MockAd: () => <div data-testid="mock-ad" /> }));
// If the banner ever consulted first-party consent again, these would matter;
// advertising consent is never granted here, and units must still render.
vi.mock('@/lib/consent', () => ({
  hasAdStorageConsent,
  onConsentDetailsChange: () => () => undefined,
}));

const SLOT = '7160565051';

async function loadBanner() {
  vi.stubEnv('NEXT_PUBLIC_ADSENSE_ENABLED', 'true');
  vi.stubEnv('NODE_ENV', 'production');
  vi.stubEnv('NEXT_PUBLIC_DEPLOY_ROLE', '');
  vi.resetModules();
  return (await import('./ad-banner')).default;
}

beforeEach(() => {
  (window as unknown as { adsbygoogle?: unknown[] }).adsbygoogle = [];
});

afterEach(() => {
  cleanup();
  vi.unstubAllEnvs();
  auth = null;
  pathname = '/tools/compress-image';
});

const anonymous: FakeAuth = { loading: false, user: null, limits: { adsRemoved: false } };
const free: FakeAuth = { loading: false, user: { uid: 'f' }, limits: { adsRemoved: false } };
const premium: FakeAuth = { loading: false, user: { uid: 'p' }, limits: { adsRemoved: true } };
const pro: FakeAuth = { loading: false, user: { uid: 'r' }, limits: { adsRemoved: true } };
const loading: FakeAuth = { loading: true, user: null, limits: null };
const signedInNullLimits: FakeAuth = { loading: false, user: { uid: 'x' }, limits: null };
const anonymousNullLimits: FakeAuth = { loading: false, user: null, limits: null };

describe('AdBanner tier table (MM82 decision 3)', () => {
  it.each([
    ['anonymous → renders', anonymous, true],
    ['anonymous with a failed usage snapshot → renders', anonymousNullLimits, true],
    ['free → renders', free, true],
    ['premium → null', premium, false],
    ['pro → null', pro, false],
    ['loading → null', loading, false],
    ['signed in with null limits → null', signedInNullLimits, false],
    ['outside the auth provider → null', null, false],
  ] as const)('%s', async (_name, state, renders) => {
    auth = state;
    const AdBanner = await loadBanner();
    const { container } = render(<AdBanner adSlot={SLOT} placement="incontent" />);
    const ins = container.querySelector('ins.adsbygoogle');
    if (renders) {
      expect(ins).not.toBeNull();
      expect((ins as HTMLElement | null)?.dataset.adSlot).toBe(SLOT);
      expect((window as unknown as { adsbygoogle: unknown[] }).adsbygoogle).toHaveLength(1);
    } else {
      expect(container.innerHTML).toBe('');
      expect((window as unknown as { adsbygoogle: unknown[] }).adsbygoogle).toHaveLength(0);
    }
  });
});

describe('AdBanner gating (MM82 decision 2)', () => {
  it('renders without first-party advertising consent and never loads its own script', async () => {
    auth = anonymous;
    const AdBanner = await loadBanner();
    const { container } = render(<AdBanner adSlot={SLOT} placement="incontent" />);
    expect(container.querySelector('ins.adsbygoogle')).not.toBeNull();
    expect(container.querySelector('script')).toBeNull();
    expect(hasAdStorageConsent).not.toHaveBeenCalled();
  });

  it('resolves the internal /en rewrite path like the public URL', async () => {
    auth = anonymous;
    pathname = '/en/tools/compress-image';
    const AdBanner = await loadBanner();
    const { container } = render(<AdBanner adSlot={SLOT} placement="incontent" />);
    expect(container.querySelector('ins.adsbygoogle')).not.toBeNull();
  });

  it.each(['/pricing', '/tools', '/', '/tools/some-unlisted-tool', '/ru/tools/compress-image'])(
    'renders nothing on %s',
    async (path) => {
      auth = anonymous;
      pathname = path;
      const AdBanner = await loadBanner();
      const { container } = render(<AdBanner adSlot={SLOT} placement="incontent" />);
      expect(container.innerHTML).toBe('');
    },
  );

  it('renders nothing for a non-incontent placement or a non-numeric slot', async () => {
    auth = anonymous;
    const AdBanner = await loadBanner();
    const a = render(<AdBanner adSlot={SLOT} placement="sidebar" />);
    expect(a.container.innerHTML).toBe('');
    const b = render(<AdBanner adSlot="PLACEHOLDER" placement="incontent" />);
    expect(b.container.innerHTML).toBe('');
  });
});
