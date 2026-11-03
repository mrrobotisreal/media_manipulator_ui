/**
 * MM97 acceptance 6: `/photo/new` renders the Aperture editor shell without
 * site chrome (no top nav, footer, consent bar, ads, AdSense loader) and is
 * noindex.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';

import enPanels from '@/i18n/locales/en-us/interface/panels.json';
import { createI18nInstance } from '@/i18n';

const nav = vi.hoisted(() => ({ pathname: '/photo/new' }));
vi.mock('next/navigation', () => ({
  usePathname: () => nav.pathname,
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));
vi.mock('@/components/top-nav', () => ({ default: () => <div data-testid="site-top-nav" /> }));
vi.mock('@/components/footer', () => ({ default: () => <div data-testid="site-footer" /> }));
vi.mock('@/components/consent/consent-gate', () => ({ ConsentGate: () => <div data-testid="site-consent" /> }));
vi.mock('@/components/onboarding/account-tour-host', () => ({ AccountTourHost: () => null }));
vi.mock('@/lib/auth/AuthProvider', () => ({ AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</> }));
vi.mock('@/lib/analytics', () => ({ AnalyticsProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="site-analytics">{children}</div> }));
// Firebase answers "signed out" immediately.
vi.mock('@/lib/firebase', () => ({
  onAuthStateChange: (cb: (u: null) => void) => {
    queueMicrotask(() => cb(null));
    return () => {};
  },
  getCurrentIdToken: async () => null,
}));
vi.mock('@/lib/photo/projectsApi', async (orig) => ({
  ...(await orig<typeof import('@/lib/photo/projectsApi')>()),
  getPhotoCapabilities: async () => ({ enabled: true, render: false, formats: ['jpg'], maxMegapixels: 12, photoProjects: 5, photoBatch: 0, aiMasks: false, heal: false, tier: 'anonymous' }),
}));
// next/dynamic(ssr:false) never resolves synchronously in jsdom: render the editor directly.
vi.mock('@/components/photo/editor-client', async () => {
  const Editor = (await import('@/components/photo/editor')).default;
  return { default: ({ projectId }: { projectId: string }) => <Editor projectId={projectId} /> };
});

import Providers from '@/app/providers';
import PhotoEditorPage from './page';
import { metadata } from '../layout';
import { usePhotoStore } from '@/lib/photo/photoStore';

beforeEach(() => {
  vi.spyOn(console, 'warn').mockImplementation(() => {});
  vi.stubGlobal('fetch', vi.fn(async () => new Response('{}', { status: 404 })));
});
afterEach(() => {
  cleanup();
  usePhotoStore.getState().close();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

async function renderRoute(path: string, projectId: string) {
  nav.pathname = path;
  const i18n = createI18nInstance('en-US');
  i18n.addResourceBundle('en-US', 'interface', enPanels, true, true);
  const page = await PhotoEditorPage({ params: Promise.resolve({ projectId }) });
  await act(async () => {
    render(
      <Providers>
        <I18nextProvider i18n={i18n}>{page}</I18nextProvider>
      </Providers>,
    );
  });
}

describe('/photo/[projectId]', () => {
  it('is noindex', () => {
    expect(metadata.robots).toEqual({ index: false, follow: false });
  });

  it('/photo/new renders the open screen without site chrome or ads', async () => {
    await renderRoute('/photo/new', 'new');
    expect(screen.getByTestId('photo-open')).toBeTruthy();
    expect(screen.queryByTestId('site-top-nav')).toBeNull();
    expect(screen.queryByTestId('site-footer')).toBeNull();
    expect(screen.queryByTestId('site-consent')).toBeNull();
    expect(screen.queryByTestId('site-analytics')).toBeNull();
    expect(document.querySelector('ins.adsbygoogle')).toBeNull();
    expect(document.querySelector('script[src*="adsbygoogle"]')).toBeNull();
    expect(screen.getByTestId('photo-file-input')).toBeTruthy();
  });

  it('keeps the site chrome on a look-alike path (exact /photo match)', async () => {
    await renderRoute('/photography', 'new');
    expect(screen.getByTestId('site-top-nav')).toBeTruthy();
  });

  it('shows the invalid-project state for an unknown id', async () => {
    await renderRoute('/photo/../x', '..%2Fx');
    expect(screen.queryByTestId('photo-editor')).toBeNull();
    expect(screen.getByRole('alert').textContent).toMatch(/could not be opened/);
  });
});
