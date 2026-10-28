/**
 * MM88 decision 5: the server-rendered tool shell.
 *
 *  - It is the live panel's empty state, structurally: the same section, intro, quota-chip
 *    slot, format box, dropzone (with the same copy) and footer, element for element and
 *    class for class, so nothing jumps when the island hydrates. The only differences are
 *    the disabled button / input, the aria-busy flag, and the tier-dependent content that
 *    the live panel fills into the reserved slots.
 *  - Its labels are localized on the server for every locale.
 *  - The client loader renders it as next/dynamic's `loading` state.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { renderToStaticMarkup } from 'react-dom/server';

import { createI18nInstance } from '@/i18n';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { locales } from '@/i18n/locales';
import { TOOL_PAGES } from '@/content/toolPages';
import { getServerT } from '@/lib/i18n/server';
import { ToolPanelShell } from './tool-panel-shell';
import { getToolPanelShellLabels } from './tool-panel-shell-labels';

// The live panel, rendered in its empty state with the same tier-loading state the shell
// mirrors (auth resolving: chip skeleton + empty limit line).
// The live panel's code-split pieces: the focused video panels are rendered for real (their
// empty state is what the shell mirrors; registered below, after the imports, so the mock
// factory never imports a module that itself uses next/dynamic); every other one is a stub.
const registry = vi.hoisted(() => ({ real: {} as Record<string, React.ComponentType<Record<string, unknown>>> }));
vi.mock('next/dynamic', async () => {
  const { createElement } = await import('react');
  return {
    default: (loader: () => Promise<unknown>) => {
      const src = String(loader);
      return function Dynamic(props: Record<string, unknown>) {
        const hit = Object.entries(registry.real).find(([k]) => src.includes(k));
        return hit ? createElement(hit[1], props) : null;
      };
    },
  };
});
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  usePathname: () => '/tools/compress-image',
  useSearchParams: () => new URLSearchParams(),
}));
vi.mock('next/link', () => ({
  default: ({ children, href, className }: { children: React.ReactNode; href: string; className?: string }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));
vi.mock('@/i18n/useLocalizedHref', () => ({ useLocalizedHref: () => (p: string) => p }));
vi.mock('@/lib/auth/AuthProvider', () => ({
  useAuth: () => ({ loading: true, user: null, tier: 'anonymous', limits: null, usage: {}, allowanceOf: () => 0 }),
}));
vi.mock('@/lib/billing/useUpgradeAction', () => ({ useUpgradeAction: () => ({ run: vi.fn(), visible: false, busy: false }) }));
vi.mock('@/lib/analytics', () => ({
  analytics: { track: vi.fn() },
  EVENTS: new Proxy({}, { get: (_t, k) => String(k) }),
  normalizeMediaKind: (k: string) => k,
  safeFileExtension: (n: string) => n.slice(n.lastIndexOf('.')),
  ToolAnalyticsProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  trackFileChoice: () => undefined,
  useToolAnalytics: () => ({ track: () => undefined, setMediaKind: () => undefined }),
}));
vi.mock('@/lib/useConvertFile', () => ({ default: () => ({ mutate: vi.fn(), isPending: false, uploadProgress: 0 }) }));
vi.mock('@/lib/useTranscribeFile', () => ({ default: () => ({ mutate: vi.fn(), isPending: false, uploadProgress: 0 }) }));
vi.mock('@/lib/useGetJobStatus', () => ({ default: () => ({ data: undefined }) }));

import EmbeddedToolPanel from '@/components/embedded-tool-panel';
import VideoCompressorPanel from '@/components/video-compressor-panel';
import VideoTrimmerPanel from '@/components/video-trimmer-panel';
import ExtractAudioPanel from '@/components/extract-audio-panel';

registry.real['video-compressor-panel'] = VideoCompressorPanel as never;
registry.real['video-trimmer-panel'] = VideoTrimmerPanel as never;
registry.real['extract-audio-panel'] = ExtractAudioPanel as never;
import panelsEn from '@/i18n/locales/en-us/interface/panels.json';

afterEach(cleanup);

/** Element tree with classes, minus attributes that legitimately differ. */
function skeleton(el: Element): string {
  const attrs = [...el.attributes]
    .filter((a) => ['class', 'type', 'accept', 'href'].includes(a.name))
    .map((a) => `${a.name}="${a.value}"`)
    .join(' ');
  const kids = [...el.children].map(skeleton).join('');
  const text = [...el.childNodes]
    .filter((n) => n.nodeType === 3)
    .map((n) => n.textContent)
    .join('')
    .trim();
  return `<${el.tagName.toLowerCase()} ${attrs}>${text}${kids}</>`;
}

function i18n() {
  const inst = createI18nInstance('en-US');
  // The panels shard is lazy in the app (withToolShards); merge it as the loader would.
  inst.addResourceBundle('en-US', 'interface', panelsEn, true, true);
  return inst;
}

const tool = (slug: string) => TOOL_PAGES.find((t) => t.slug === slug)!;
const compress = tool('compress-image');

describe('MM88 tool shell', () => {
  // Generic converter (plain, and with the locked-format box) and the three indexed pages
  // that mount a focused SpecializedToolShell panel.
  it.each(['compress-image', 'convert-png-to-jpg', 'compress-video', 'video-trimmer', 'extract-audio-from-video', 'mp4-to-mp3'])(
    '%s: the shell is the live empty panel, element for element (no jump on hydration)', (slug) => {
    const page = tool(slug);
    const props = { toolSlug: page.slug, ...page.embed };
    const labels = getToolPanelShellLabels(page.embed, 'en-US');
    const { container: shellBox } = render(<ToolPanelShell labels={labels} {...props} />);
    const shell = skeleton(shellBox.firstElementChild!);
    cleanup();
    const { container: liveBox } = render(
      <QueryClientProvider client={new QueryClient()}>
        <I18nextProvider i18n={i18n()}>
          <EmbeddedToolPanel {...props} />
        </I18nextProvider>
      </QueryClientProvider>,
    );
    const live = skeleton(liveBox.firstElementChild!);
    expect(shell).toBe(live);
  });

  it('renders the localized dropzone copy, the accept list and a disabled Select button', () => {
    const labels = getToolPanelShellLabels('image', 'en-US');
    render(<ToolPanelShell labels={labels} {...compress.embed} />);
    expect(screen.getByText('Drag and drop a image file here')).toBeTruthy();
    const button = screen.getByRole('button', { name: 'Select file' }) as HTMLButtonElement;
    expect(button.disabled).toBe(true);
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    expect(input.accept).toBe('image/*');
    expect(screen.getByRole('region', { name: 'Embedded media converter' }).getAttribute('aria-busy')).toBe('true');
    // The tool's purpose, server-side: its own panel title and description.
    expect(screen.getByText(`${compress.embed.title}.`)).toBeTruthy();
  });

  it('is localized for every locale from the server bundles (no English leak outside en)', () => {
    const en = getToolPanelShellLabels('image', 'en-US');
    for (const l of locales) {
      const labels = getToolPanelShellLabels('image', l.code);
      const expected = getServerT('interface', l.code)('embeddedToolPanel.dragDrop', {
        values: { kind: getServerT('interface', l.code)('embeddedToolPanel.mediaKinds.image') },
      });
      expect(labels.dragDrop, l.code).toBe(expected);
      expect(labels.dragDrop, l.code).not.toContain('{{');
      if (l.code !== 'en-US') expect(labels.dragDrop, l.code).not.toBe(en.dragDrop);
      expect(labels.footerHref, l.code).toBe(l.code === 'en-US' ? '/' : `/${l.prefix}`);
    }
  });

  it('prerenders (renderToStaticMarkup) with no client runtime', () => {
    const html = renderToStaticMarkup(
      <ToolPanelShell labels={getToolPanelShellLabels('video', 'de-DE')} defaultMediaKind="video" />,
    );
    expect(html).toContain(getToolPanelShellLabels('video', 'de-DE').dragDrop);
    expect(html).toContain('accept="video/*"');
    expect(html).toContain('disabled=""');
  });
});
