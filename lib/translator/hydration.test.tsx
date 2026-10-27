/**
 * MM52 criterion 4: the same string rendered on the server and on the client
 * carries identical key markers, so hydration sees identical text.
 *
 * A fixture page mixes the three string sources a real page has: a server
 * component (`getServerT` / `ServerTrans`) and a client component (`useTranslation`
 * through the app's own `createI18nInstance`), for an RTL locale with six plural
 * forms. It is rendered with `renderToString` (server pass), then hydrated with
 * `hydrateRoot` in jsdom (client pass) — any text mismatch is a React hydration
 * error, which the test captures.
 */
import { act } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { I18nextProvider, useTranslation } from 'react-i18next';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const ROLE = 'NEXT_PUBLIC_DEPLOY_ROLE';
const LOCALE = 'NEXT_PUBLIC_TRANSLATOR_LOCALE';

async function load() {
  vi.resetModules();
  // Next's bundlers resolve the guarded `require('./keyMarker')` in mode.ts;
  // vitest's CommonJS `require` cannot load TS, so evaluate it first (it fills
  // the runtime slot the loader checks before requiring).
  if (process.env[ROLE] === 'translator') await import('@/lib/translator/keyMarker');
  const i18n = await import('@/i18n');
  const resources = await import('@/i18n/localeResources');
  const server = await import('@/lib/i18n/server');
  const codec = await import('@/lib/translator/markerCodec');
  return { ...i18n, ...resources, ...server, ...codec };
}

function ClientPart() {
  const { t } = useTranslation('interface');
  return (
    <p>
      <span data-k="plural">{t('duration.minutes', { count: 3 })}</span>
      <input aria-label={t('accessibility:topNav.openMenu')} placeholder={t('common.loading')} readOnly />
      <button type="button">{t('common.cancel')}</button>
    </p>
  );
}

function attrValues(root: Element): string[] {
  return [...root.querySelectorAll('[aria-label],[placeholder]')].flatMap((el) => [
    el.getAttribute('aria-label') ?? '',
    el.getAttribute('placeholder') ?? '',
  ]);
}

beforeEach(() => {
  document.body.innerHTML = '';
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe('key markers are hydration-safe', () => {
  it('server render and client hydrate produce identical marked text (ar-SA)', async () => {
    vi.stubEnv(ROLE, 'translator');
    vi.stubEnv(LOCALE, 'ar-SA');
    const m = await load();
    const locale = 'ar-SA';

    const Page = ({ i18n }: { i18n: ReturnType<typeof m.createI18nInstance> }) => {
      const st = m.getServerT('interface', locale);
      return (
        <main>
          <h1 data-k="server">{st('common.cancel')}</h1>
          <m.ServerTrans i18nKey="interface:common.brandTagline" locale={locale} />
          <I18nextProvider i18n={i18n}>
            <ClientPart />
          </I18nextProvider>
        </main>
      );
    };

    // Server pass: its own instance, as `getI18nForLocale` does on the server.
    const serverI18n = m.createI18nInstance(locale, m.getClientResources(locale));
    const html = renderToString(<Page i18n={serverI18n} />);
    expect(m.hasMarker(html)).toBe(true);

    // The same key rendered by a server component and by a client `t()` gets the same marker.
    const container = document.createElement('div');
    container.innerHTML = html;
    const before = { text: container.textContent, attrs: attrValues(container) };
    const serverCancel = container.querySelector('[data-k="server"]')!.textContent!;
    const clientCancel = container.querySelector('button')!.textContent!;
    expect(serverCancel).toBe(clientCancel);
    expect(m.findMarkers(serverCancel)).toHaveLength(1);

    // Client pass: a fresh instance in the browser, hydrating the server HTML.
    document.body.appendChild(container);
    const errors: unknown[] = [];
    const consoleError = vi.spyOn(console, 'error').mockImplementation((...args) => errors.push(args));
    const clientI18n = m.createI18nInstance(locale, m.getClientResources(locale));
    await act(async () => {
      hydrateRoot(container, <Page i18n={clientI18n} />, {
        onRecoverableError: (e) => errors.push(e),
      });
    });
    expect(errors).toEqual([]);
    consoleError.mockRestore();
    // Hydration kept the server text and attribute values byte-for-byte (markers included).
    expect(container.textContent).toBe(before.text);
    expect(attrValues(container)).toEqual(before.attrs);
    // Arabic plural: 3 -> `_few`, resolved key recorded in the marker (MM63: ar-SA is translated, `3 د`).
    const plural = container.querySelector('[data-k="plural"]')!.textContent!;
    expect(m.findMarkers(plural)).toHaveLength(1);
    expect(m.stripMarkers(plural)).toBe('3 د');
  });

  it('metadata strings carry no markers (getServerMetadataT), page strings do', async () => {
    vi.stubEnv(ROLE, 'translator');
    vi.stubEnv(LOCALE, 'de-DE');
    const m = await load();
    expect(m.hasMarker(m.getServerMetadataT('interface', 'de-DE')('voices.title'))).toBe(false);
    expect(m.hasMarker(m.getServerT('interface', 'de-DE')('voices.title'))).toBe(true);
    const objects = m.getServerT('interface', 'de-DE')('privacyPolicy.sections', { returnObjects: true }) as Array<
      Record<string, unknown>
    >;
    expect(objects.some((s) => s.id === 'retention')).toBe(true);
    expect(m.hasMarker(String(objects[0].title))).toBe(true);
    // The legal contact email is rendered inside href="mailto:…": never marked.
    const emails = objects.map((o) => o.contactEmail).filter(Boolean) as string[];
    expect(emails.length).toBeGreaterThan(0);
    for (const e of emails) expect(m.hasMarker(e)).toBe(false);
  });

  it('generateMetadata of the pages that read copy returns clean strings', async () => {
    vi.stubEnv(ROLE, 'translator');
    vi.stubEnv(LOCALE, 'ar-SA');
    vi.resetModules();
    await import('@/lib/translator/keyMarker');
    const { hasMarker } = await import('@/lib/translator/markerCodec');
    const params = Promise.resolve({ lang: 'ar' });
    const pages = await Promise.all([
      import('@/app/(localized)/[lang]/voices/page'),
      import('@/app/(localized)/[lang]/changelog/page'),
      import('@/app/(localized)/[lang]/status/page'),
      import('@/app/(localized)/[lang]/page'),
      import('@/app/(localized)/[lang]/tools/page'),
    ]);
    for (const page of pages) {
      const meta = await page.generateMetadata({ params });
      expect(hasMarker(JSON.stringify(meta)), JSON.stringify(meta).slice(0, 120)).toBe(false);
    }
  });

  it('production (role unset): no plugin, no markers anywhere', async () => {
    vi.stubEnv(ROLE, '');
    vi.stubEnv(LOCALE, '');
    const m = await load();
    const i18n = m.createI18nInstance('ar-SA', m.getClientResources('ar-SA'));
    expect(i18n.options.postProcess).toBeFalsy();
    expect(m.hasMarker(i18n.t('common.cancel'))).toBe(false);
    expect(m.hasMarker(m.getServerT('interface', 'ar-SA')('common.cancel'))).toBe(false);
    expect(m.hasMarker(renderToString(<m.ServerTrans i18nKey="interface:common.brandTagline" locale="ar-SA" />))).toBe(
      false,
    );
  });

  it('translator role with an invalid locale: hardened but unarmed, no markers', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    vi.stubEnv(ROLE, 'translator');
    vi.stubEnv(LOCALE, 'en-US');
    const m = await load();
    expect(m.hasMarker(m.createI18nInstance('de-DE').t('common.cancel'))).toBe(false);
    expect(m.hasMarker(m.getServerT('interface', 'de-DE')('common.cancel'))).toBe(false);
  });
});
