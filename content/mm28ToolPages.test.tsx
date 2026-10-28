import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import en from '@/i18n/locales/en-us/interface/forms.json';
import { TOOL_PAGES, type EmbedPreset } from '@/content/toolPages';
import { PENDING_ALLOWLIST, REVIEW_INDEXED_TOOL_SLUGS } from '@/content/reviewAllowlist';
import { getLocalizedToolBySlug } from '@/i18n/toolPageContent';
import { getAllRouteSeo } from '@/lib/seo';
import sitemap from '@/app/sitemap';

vi.mock('next/dynamic', () => ({ default: () => () => null }));
vi.mock('next/link', () => ({ default: ({ children }: { children: React.ReactNode }) => <a>{children}</a> }));
vi.mock('@/i18n/useLocalization', () => ({
  useLocalization: () => ({
    t: (key: string) => {
      const k = key.replace(/^interface:/, '');
      const found = k.split('.').reduce<unknown>((o, p) => (o as Record<string, unknown> | undefined)?.[p], en);
      return typeof found === 'string' ? found : key;
    },
    formatDuration: () => '',
    formatFileSize: () => '',
  }),
}));
vi.mock('react-i18next', () => ({ Trans: ({ i18nKey }: { i18nKey: string }) => <>{i18nKey}</> }));
vi.mock('@/i18n/useLocalizedHref', () => ({ useLocalizedHref: () => (p: string) => p }));
vi.mock('@/components/conversion-options', () => ({ default: () => null }));
vi.mock('@/components/advanced-audio-effects', () => ({ default: () => null }));
vi.mock('@/components/media-trim-modal', () => ({ default: () => null }));
vi.mock('@/components/info-tooltip', () => ({ default: () => null }));
vi.mock('@/lib/auth/AuthProvider', () => ({ useAuth: () => null }));
vi.mock('@/components/account/upgrade-surfaces', () => ({ UploadLimitHint: () => null, useUpgradeNudge: () => () => undefined }));
vi.mock('@/lib/analytics', () => ({
  EVENTS: new Proxy({}, { get: (_t, k) => String(k) }),
  normalizeMediaKind: (k: string) => k,
  safeFileExtension: (n: string) => n,
  ToolAnalyticsProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  trackFileChoice: () => undefined,
  useToolAnalytics: () => ({ track: () => undefined, setMediaKind: () => undefined }),
}));
vi.mock('@/lib/useConvertFile', () => ({ default: () => ({ mutate: vi.fn(), isPending: false, uploadProgress: 0 }) }));
vi.mock('@/lib/useTranscribeFile', () => ({ default: () => ({ mutate: vi.fn(), isPending: false, uploadProgress: 0 }) }));
vi.mock('@/lib/useGetJobStatus', () => ({ default: () => ({ data: undefined }) }));
vi.mock('@/components/results/result-panel', () => ({ ResultPanel: () => null }));

vi.mock('@/lib/useDetectFaces', () => ({
  default: () => ({ mutateAsync: vi.fn(), reset: vi.fn(), isPending: false }),
}));
vi.mock('@/components/image-crop-modal', () => ({ default: () => null }));
vi.mock('@/components/remove-object-overlay', () => ({
  default: () => <div data-testid="remove-object-overlay" />,
}));
vi.mock('@/components/face-selection-overlay', () => ({
  default: () => <div data-testid="face-selection-overlay" />,
}));

import AudioConversionForm from '@/components/audio-conversion-form';
import ImageConversionForm from '@/components/image-conversion-form';

afterEach(cleanup);

const SLUG_TO_OP: Record<string, string> = {
  'ai-image-upscaler': 'ai_upscale',
  'blur-faces-in-photo': 'face_privacy',
  'redact-text-in-image': 'redact_text',
  'remove-object-from-photo': 'remove_object',
  'clean-voice-audio': 'clean_voice',
  'remove-background-noise': 'remove_background_noise',
  'remove-vocals-from-song': 'remove_vocals',
};
const LOCALES = ['en-US', 'ru-RU', 'uk-UA', 'de-DE', 'es-ES', 'he-IL'];
const rows = Object.entries(SLUG_TO_OP);
const opOf = (slug: string): string => {
  const e = TOOL_PAGES.find((t) => t.slug === slug)!.embed;
  if (e.preset?.kind === 'audio') return e.preset.aiOperation;
  return e.defaultAIImageOperation as string;
};

describe('MM28 tool pages: resolution matrix', () => {
  it.each(rows)('%s maps to %s, is category ai, and locks the operation', (slug, op) => {
    const t = TOOL_PAGES.find((p) => p.slug === slug)!;
    expect(t.category).toBe('ai');
    expect(opOf(slug)).toBe(op);
    if (t.embed.defaultMediaKind === 'image') expect(t.embed.lockedAIImageOperation).toBe(true);
    else expect((t.embed.preset as Extract<EmbedPreset, { kind: 'audio' }>).kind).toBe('audio');
  });

  it('table is printable', () => {
    console.log('MM28 slug -> op\n' + rows.map(([s]) => `${s} -> ${opOf(s)}`).join('\n'));
  });

  it('presets keep clean-voice and remove-vocals operation selects hidden, noise visible, vocals same-as-input (MM81)', () => {
    const pre = (s: string) => TOOL_PAGES.find((p) => p.slug === s)!.embed.preset as Extract<EmbedPreset, { kind: 'audio' }>;
    expect(pre('clean-voice-audio').hideOperationSelect).toBe(true);
    expect(pre('remove-vocals-from-song')).toMatchObject({ hideOperationSelect: true, format: 'auto' });
    expect(pre('remove-background-noise').hideOperationSelect).toBeUndefined();
  });

  it.each(rows.flatMap(([slug]) => LOCALES.map((l) => [slug, l] as const)))('%s resolves in %s', (slug, lang) => {
    const t = getLocalizedToolBySlug(slug, lang)!;
    expect(t.h1.length).toBeGreaterThan(10);
    expect(t.metaTitle.length).toBeGreaterThan(10);
    expect(t.metaDescription.length).toBeGreaterThan(40);
    expect(t.faq.length).toBeGreaterThanOrEqual(4);
    expect(t.related.filter((r) => TOOL_PAGES.some((p) => `/tools/${p.slug}` === r.to)).length).toBeGreaterThanOrEqual(2);
    if (lang !== 'en-US') {
      const en = getLocalizedToolBySlug(slug, 'en-US')!;
      expect(t.h1).not.toBe(en.h1);
      expect(t.intro).not.toBe(en.intro);
    }
  });

  it('every related link resolves to a real tool page', () => {
    for (const [slug] of rows) {
      for (const r of TOOL_PAGES.find((p) => p.slug === slug)!.related) {
        if (r.to.startsWith('/tools/')) expect(TOOL_PAGES.some((p) => `/tools/${p.slug}` === r.to), `${slug} -> ${r.to}`).toBe(true);
      }
    }
  });

  it('has no duplicated intro or FAQ answers across the seven pages', () => {
    const intros = rows.map(([s]) => TOOL_PAGES.find((p) => p.slug === s)!.intro);
    expect(new Set(intros).size).toBe(7);
    const answers = rows.flatMap(([s]) => TOOL_PAGES.find((p) => p.slug === s)!.faq.map((f) => f.answer));
    expect(new Set(answers).size).toBe(answers.length);
  });
});

describe('MM28 JSON-LD', () => {
  it.each(rows)('%s emits valid WebApplication, Breadcrumb, FAQPage and HowTo', (slug) => {
    const seo = getAllRouteSeo().find((r) => r.path === `/tools/${slug}`)!;
    const parsed = JSON.parse(JSON.stringify(seo.jsonLd)) as Array<Record<string, unknown>>;
    type Ld = { itemListElement: unknown[]; mainEntity: Array<Record<string, unknown> & { acceptedAnswer: { text: string } }>; step: Array<Record<string, unknown>> };
    const type = (t: string) => parsed.find((b) => b['@type'] === t) as unknown as Ld;
    expect(parsed.some((b) => b['@type'] === 'WebApplication' || b['@type'] === 'SoftwareApplication')).toBe(true);
    expect(type('BreadcrumbList').itemListElement.length).toBe(3);
    const faq = type('FAQPage');
    expect(faq.mainEntity.length).toBeGreaterThanOrEqual(4);
    expect(faq.mainEntity[0]).toMatchObject({ '@type': 'Question' });
    expect(faq.mainEntity[0].acceptedAnswer.text.length).toBeGreaterThan(10);
    const how = type('HowTo');
    expect(how.step.length).toBeGreaterThanOrEqual(3);
    expect(how.step[0]).toMatchObject({ '@type': 'HowToStep', position: 1 });
  });
});

describe('MM28 indexing', () => {
  it('seven slugs are not in the review allowlist', () => {
    for (const s of PENDING_ALLOWLIST) expect((REVIEW_INDEXED_TOOL_SLUGS as readonly string[]).includes(s)).toBe(false);
    expect([...PENDING_ALLOWLIST].sort()).toEqual(Object.keys(SLUG_TO_OP).sort());
  });
  it('sitemap excludes the seven', () => {
    const urls = sitemap().map((e) => e.url).join('\n');
    for (const [slug] of rows) expect(urls).not.toContain(`/tools/${slug}`);
  });
});

describe('MM28 audio pages render', () => {
  const audio = (slug: string) => TOOL_PAGES.find((p) => p.slug === slug)!.embed.preset as Extract<EmbedPreset, { kind: 'audio' }>;
  it.each(['clean-voice-audio', 'remove-vocals-from-song'])('%s: chip shown, no operation dropdown', (slug) => {
    const p = audio(slug);
    render(<AudioConversionForm onSubmit={vi.fn()} isLoading={false} presets={{ aiOperation: p.aiOperation, hideOperationSelect: p.hideOperationSelect, defaultFormat: p.format }} />);
    // No operation dropdown. MM81: a vocal page shows exactly one select, the stem "Output format".
    const selects = screen.queryAllByRole('combobox');
    expect(selects.map((el) => el.closest('[data-testid="stem-format"]') !== null)).toEqual(
      p.aiOperation === 'remove_vocals' ? [true] : [],
    );
    expect(screen.getByTestId('audio-ai-preset-chip').textContent).toContain(
      (en.audioForm.ai.operations as Record<string, string>)[p.aiOperation],
    );
  });
  it('remove-background-noise: select present, preselected', () => {
    const p = audio('remove-background-noise');
    render(<AudioConversionForm onSubmit={vi.fn()} isLoading={false} presets={{ aiOperation: p.aiOperation, defaultFormat: p.format }} />);
    expect((screen.getAllByRole('combobox')[0] as HTMLSelectElement).value).toBe('remove_background_noise');
  });
});

describe('MM28 image pages render', () => {
  const imageSlugs = rows.filter(([s]) => TOOL_PAGES.find((p) => p.slug === s)!.embed.defaultMediaKind === 'image');
  it.each(imageSlugs)('%s: operation %s preselected and locked', async (slug, op) => {
    const e = TOOL_PAGES.find((p) => p.slug === slug)!.embed;
    const { container } = render(
      <ImageConversionForm
        onSubmit={vi.fn()}
        isLoading={false}
        imageUrl="blob:x"
        file={new File(['x'], 'a.png', { type: 'image/png' })}
        presets={{
          defaultAIImageOperation: e.defaultAIImageOperation,
          lockedAIImageOperation: e.lockedAIImageOperation,
          defaultOutputFormat: e.defaultOutputFormat as 'png' | undefined,
          lockedOutputFormat: e.lockedOutputFormat as 'png' | undefined,
        }}
      />,
    );
    const select = container.querySelector('select[aria-disabled="true"]') as HTMLSelectElement;
    expect(select).toBeTruthy();
    expect(select.value).toBe(op);
    expect(select.disabled).toBe(true);
    if (op === 'remove_object') expect(screen.getByTestId('remove-object-overlay')).toBeTruthy();
  });
});
