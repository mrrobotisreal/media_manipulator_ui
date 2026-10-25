/**
 * MM42 acceptance 6: `/motion/new` renders the Motion editor without site
 * chrome (no top nav, footer, consent bar, ads) and is noindex.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';

import enPanels from '@/i18n/locales/en-us/interface/panels.json';
import { createI18nInstance } from '@/i18n';

const nav = vi.hoisted(() => ({ pathname: '/motion/new' }));
vi.mock('next/navigation', () => ({
  usePathname: () => nav.pathname,
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));
// Site chrome: if Providers ever renders these on /motion the test fails.
vi.mock('@/components/top-nav', () => ({ default: () => <div data-testid="site-top-nav" /> }));
vi.mock('@/components/footer', () => ({ default: () => <div data-testid="site-footer" /> }));
vi.mock('@/components/consent/consent-gate', () => ({ ConsentGate: () => <div data-testid="site-consent" /> }));
vi.mock('@/components/onboarding/account-tour-host', () => ({ AccountTourHost: () => null }));
vi.mock('@/lib/auth/AuthProvider', () => ({ AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</> }));
vi.mock('@/lib/analytics', () => ({ AnalyticsProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="site-analytics">{children}</div> }));
// next/dynamic(ssr:false) never resolves synchronously in jsdom: render the editor directly.
vi.mock('@/components/vector/editor-client', async () => {
  const Editor = (await import('@/components/vector/editor')).default;
  return { default: ({ projectId }: { projectId: string }) => <Editor projectId={projectId} /> };
});

import Providers from '@/app/providers';
import MotionEditorPage from './page';
import { metadata } from '../layout';
import { useVectorStore } from '@/lib/vector/vectorStore';

beforeEach(() => {
  // jsdom lacks these; the canvas uses them.
  if (!('setPointerCapture' in Element.prototype)) {
    Object.assign(Element.prototype, { setPointerCapture: () => {}, releasePointerCapture: () => {} });
  }
  vi.spyOn(console, 'warn').mockImplementation(() => {});
});
afterEach(() => {
  cleanup();
  useVectorStore.getState().close();
  vi.restoreAllMocks();
});

async function renderRoute(path: string, projectId: string) {
  nav.pathname = path;
  const page = await MotionEditorPage({ params: Promise.resolve({ projectId }) });
  let view!: ReturnType<typeof render>;
  await act(async () => {
    view = render(<Providers>{page}</Providers>);
  });
  return view;
}

describe('/motion/[projectId]', () => {
  it('is noindex', () => {
    expect(metadata.robots).toEqual({ index: false, follow: false });
  });

  it('/motion/new renders the editor without site chrome', async () => {
    // Providers creates its own i18n instance; make the lazy panels shard available to it.
    const i18n = createI18nInstance('en-US');
    i18n.addResourceBundle('en-US', 'interface', enPanels, true, true);
    nav.pathname = '/motion/new';
    const page = await MotionEditorPage({ params: Promise.resolve({ projectId: 'new' }) });
    await act(async () => {
      render(
        <Providers>
          <I18nextProvider i18n={i18n}>{page}</I18nextProvider>
        </Providers>,
      );
    });
    expect(screen.queryByTestId('site-top-nav')).toBeNull();
    expect(screen.queryByTestId('site-footer')).toBeNull();
    expect(screen.queryByTestId('site-consent')).toBeNull();
    expect(screen.queryByTestId('site-analytics')).toBeNull();
    expect(document.querySelector('ins.adsbygoogle')).toBeNull();
    expect(screen.getByTestId('vector-beta-chip').textContent).toBe('Motion (beta)');
    expect(screen.getByRole('button', { name: 'Export' })).toBeTruthy();
    expect(screen.getByRole('region', { name: 'Timeline' })).toBeTruthy();
    // A blank 512×512 document was created under a fresh local id.
    const s = useVectorStore.getState();
    expect(s.projectId).toMatch(/^local-/);
    expect(s.doc?.canvas).toMatchObject({ width: 512, height: 512 });
  });

  it('keeps the site chrome on a look-alike path (exact /motion match)', async () => {
    await renderRoute('/motion-graphics', 'new');
    expect(screen.getByTestId('site-top-nav')).toBeTruthy();
  });

  it('shows the invalid-project state for an unknown id', async () => {
    await renderRoute('/motion/../x', '..%2Fx');
    expect(screen.queryByTestId('vector-beta-chip')).toBeNull();
  });
});
