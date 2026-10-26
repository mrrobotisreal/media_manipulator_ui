import { describe, expect, it, vi } from 'vitest';

import { createFakeTranslatorApi, createHttpTranslatorApi, parseBaseBody, parseMeBody } from './api';

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

describe('translator API client (MM54 contract)', () => {
  it('GET /me sends the Firebase ID token as a Bearer header and maps allowed:true', async () => {
    const fetchMock = vi.fn(async () => json(200, { allowed: true, email: 't@example.com', locale: 'ar-SA' }));
    const api = createHttpTranslatorApi({ fetch: fetchMock as unknown as typeof fetch });
    expect(await api.me('tok-1')).toEqual({ status: 'allowed', email: 't@example.com', locale: 'ar-SA' });
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe('/api/translator/me');
    expect((init.headers as Record<string, string>).Authorization).toBe('Bearer tok-1');
    expect(init.cache).toBe('no-store');
  });

  it.each(['unverified', 'not_allowlisted', 'wrong_locale'] as const)('GET /me maps allowed:false reason %s', async (reason) => {
    const api = createHttpTranslatorApi({ fetch: (async () => json(200, { allowed: false, reason })) as unknown as typeof fetch });
    expect(await api.me('t')).toEqual({ status: reason });
  });

  it('GET /me: 401 is unauthorized; 404 (route not deployed), 500, network and malformed bodies are error', async () => {
    const make = (impl: () => Promise<Response>) => createHttpTranslatorApi({ fetch: impl as unknown as typeof fetch });
    expect(await make(async () => new Response('', { status: 401 })).me('t')).toEqual({ status: 'unauthorized' });
    expect((await make(async () => new Response('', { status: 404 })).me('t')).status).toBe('error');
    expect((await make(async () => new Response('', { status: 500 })).me('t')).status).toBe('error');
    expect((await make(async () => Promise.reject(new TypeError('offline'))).me('t')).status).toBe('error');
    expect((await make(async () => json(200, { allowed: 'yes' })).me('t')).status).toBe('error');
    expect((await make(async () => json(200, { allowed: false, reason: 'banned' })).me('t')).status).toBe('error');
  });

  it('GET /base returns { sha, files } and rejects malformed bodies', async () => {
    const body = { sha: 'abc123', files: { 'i18n/locales/ar-sa/interface/pages.json': 'b1' } };
    const api = createHttpTranslatorApi({ fetch: (async () => json(200, body)) as unknown as typeof fetch });
    expect(await api.base('t')).toEqual({ ok: true, base: body });
    expect(parseBaseBody({ sha: '', files: {} })).toBeNull();
    expect(parseBaseBody({ sha: 'x', files: { a: 1 } })).toBeNull();
    const failing = createHttpTranslatorApi({ fetch: (async () => new Response('', { status: 403 })) as unknown as typeof fetch });
    expect(await failing.base('t')).toMatchObject({ ok: false, status: 403 });
  });

  it('parseMeBody requires email and locale strings on allowed:true', () => {
    expect(parseMeBody({ allowed: true, email: 'a@b.c' }).status).toBe('error');
    expect(parseMeBody(null).status).toBe('error');
  });

  it('the fake records tokens and returns canned answers', async () => {
    const fake = createFakeTranslatorApi({ me: { status: 'unverified' } });
    expect(await fake.me('x')).toEqual({ status: 'unverified' });
    fake.setMe({ status: 'allowed', email: 'e', locale: 'de-DE' });
    expect((await fake.me('y')).status).toBe('allowed');
    expect(fake.calls.me).toEqual(['x', 'y']);
  });
});
