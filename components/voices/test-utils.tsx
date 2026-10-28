import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import en from '@/i18n/locales/en-us/interface/panels.json';
import type { VoicesCapabilities } from '@/lib/voices/voicesApi';

/** `t` over the real English panels shard, with {{placeholders}} filled. */
export function enT(key: string, opts?: Record<string, unknown>): string {
  const found = key.split('.').reduce<unknown>((o, k) => (o as Record<string, unknown> | undefined)?.[k], en);
  const text = typeof found === 'string' ? found : key;
  return text.replace(/\{\{(\w+)\}\}/g, (_, k: string) => String(opts?.[k] ?? ''));
}

export const localizationMock = () => ({
  useLocalization: () => ({
    t: enT,
    language: { code: 'en-US' },
    dir: 'ltr',
    formatDate: (d: string) => `D(${String(d).slice(0, 10)})`,
    formatFileSize: (n: number) => `${n} B`,
    formatTime: () => '9:00',
  }),
});

export function caps(over: Partial<VoicesCapabilities> = {}): VoicesCapabilities {
  return {
    enabled: true,
    warm: true,
    engines: { chatterbox: { loaded: true, version: '0.1.7' } },
    languages: ['en', 'de', 'ru'],
    designLanguages: ['en', 'de'],
    presets: [{ id: 'Vivian', name: 'Vivian', description: '', language: 'en', engine: 'qwen', kind: 'preset', languages: null }],
    shiftPresets: [],
    signedIn: false,
    limits: { voicesSaved: 1, voicesMaxSeconds: 60, voicesConvert: true, voicesConvertMaxSeconds: 60, textMaxChars: 1080 },
    tier: 'free',
    ...over,
  };
}

export function renderWithQuery(ui: React.ReactElement) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
  return render(<QueryClientProvider client={qc}>{ui}</QueryClientProvider>);
}

/** A fetch double that records every call and answers by route. */
export function fakeFetch(routes: Record<string, (init?: RequestInit) => { status: number; body: unknown }>) {
  const calls: Array<{ url: string; init?: RequestInit }> = [];
  const fn = async (url: string, init?: RequestInit) => {
    calls.push({ url, init });
    const method = (init?.method ?? 'GET').toUpperCase();
    const path = url.replace(/^.*\/api/, '').replace(/^https?:\/\/[^/]+/, '');
    const key = Object.keys(routes).find((k) => {
      const [m, p] = k.split(' ');
      return m === method && new RegExp(`^${p}$`).test(path);
    });
    if (!key) return new Response(JSON.stringify({ error: 'not_found' }), { status: 404 });
    const { status, body } = routes[key](init);
    return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
  };
  return { fn, calls };
}
