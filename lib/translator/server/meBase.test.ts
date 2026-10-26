/**
 * MM54: GET /api/translator/me and /base (contract consumed by MM53's client),
 * role gating, allowlist parsing, and the /base tree filter + cache.
 */
// @vitest-environment node
import { beforeAll, describe, expect, it } from 'vitest';

import { parseBaseBody, parseMeBody } from '../api';
import { isAllowlisted, parseAllowlist } from './config';
import { gitSha } from './testing/fakeGithub';
import { get, harness, testEnv } from './testing/harness';
import { claims, createTestKeys, type TestKeys } from './testing/tokens';
import { BASE_CACHE_MS, handleBase, handleMe, handleSubmit } from './handlers';

let keys: TestKeys;
beforeAll(async () => {
  keys = await createTestKeys();
});

const FILES = {
  'i18n/locales/de-de/interface/_core.json': '{\n  "a": "A"\n}\n',
  'i18n/locales/de-de/interface/pages.json': '{\n  "p": "P"\n}\n',
  'i18n/locales/en-us/interface/_core.json': '{\n  "a": "A"\n}\n',
  'i18n/locales/en-us/interface/metadata.json': '{\n  "m": "M"\n}\n',
  'i18n/locales/fr-fr/interface/_core.json': '{\n  "a": "B"\n}\n',
  'app/page.tsx': 'export default 1',
};

describe('GET /api/translator/me', () => {
  it('401 without a token, with a garbage token, and with an expired one', async () => {
    const h = harness(keys, FILES);
    expect((await handleMe(get('/api/translator/me'), h.deps)).status).toBe(401);
    expect((await handleMe(get('/api/translator/me', 'a.b.c'), h.deps)).status).toBe(401);
    const expired = await keys.sign(claims({ exp: 1 }));
    expect((await handleMe(get('/api/translator/me', expired), h.deps)).status).toBe(401);
  });

  it('200 allowed: email + the deployment locale (case-insensitive, trimmed allowlist)', async () => {
    const h = harness(keys, FILES);
    const res = await handleMe(get('/api/translator/me', await keys.sign()), h.deps);
    expect(res.status).toBe(200);
    expect(res.headers.get('cache-control')).toBe('no-store');
    const body = await res.json();
    expect(body).toEqual({ allowed: true, email: 'translator@example.com', locale: 'de-DE' });
    expect(parseMeBody(body)).toEqual({ status: 'allowed', email: 'translator@example.com', locale: 'de-DE' });
  });

  it('200 not_allowlisted: another account; and an empty TRANSLATOR_EMAILS allows nobody', async () => {
    const h = harness(keys, FILES);
    const other = await keys.sign(claims({ email: 'stranger@example.com' }));
    expect(await (await handleMe(get('/api/translator/me', other), h.deps)).json()).toEqual({ allowed: false, reason: 'not_allowlisted' });
    const empty = harness(keys, FILES, { TRANSLATOR_EMAILS: '' });
    expect(await (await handleMe(get('/api/translator/me', await keys.sign()), empty.deps)).json()).toEqual({
      allowed: false,
      reason: 'not_allowlisted',
    });
  });

  it('200 unverified: an allowlisted account whose email is not verified; a non-listed unverified account is not_allowlisted', async () => {
    const h = harness(keys, FILES);
    const unverified = await keys.sign(claims({ email_verified: false }));
    const body = await (await handleMe(get('/api/translator/me', unverified), h.deps)).json();
    expect(body).toEqual({ allowed: false, reason: 'unverified' });
    expect(parseMeBody(body)).toEqual({ status: 'unverified' });
    const stranger = await keys.sign(claims({ email: 'x@example.com', email_verified: false }));
    expect(await (await handleMe(get('/api/translator/me', stranger), h.deps)).json()).toEqual({ allowed: false, reason: 'not_allowlisted' });
  });

  it('never returns the allowlist contents', async () => {
    const h = harness(keys, FILES);
    for (const token of [await keys.sign(), await keys.sign(claims({ email: 'x@example.com' })), 'bad']) {
      const text = await (await handleMe(get('/api/translator/me', token), h.deps)).text();
      expect(text).not.toContain('someone@example.com');
    }
  });
});

describe('DEPLOY_ROLE gating', () => {
  it.each([
    ['production (role unset)', { NEXT_PUBLIC_DEPLOY_ROLE: undefined }],
    ['role empty string', { NEXT_PUBLIC_DEPLOY_ROLE: '' }],
    ['another role', { NEXT_PUBLIC_DEPLOY_ROLE: 'preview' }],
    ['translator role without a valid locale', { NEXT_PUBLIC_TRANSLATOR_LOCALE: 'xx-XX' }],
    ['translator role with English', { NEXT_PUBLIC_TRANSLATOR_LOCALE: 'en-US' }],
  ])('%s: all three handlers 404 before any auth or GitHub work', async (_name, env) => {
    const h = harness(keys, FILES, env);
    const token = await keys.sign();
    expect((await handleMe(get('/api/translator/me', token), h.deps)).status).toBe(404);
    expect((await handleBase(get('/api/translator/base', token), h.deps)).status).toBe(404);
    const submit = new Request('https://x/api/translator/submit', { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: '{}' });
    expect((await handleSubmit(submit, h.deps)).status).toBe(404);
    expect(h.githubFactoryCalls).toBe(0);
    expect(h.fake.calls).toEqual([]);
  });

  it('missing Firebase project id: 503 misconfigured, and the response names nothing', async () => {
    const h = harness(keys, FILES, { NEXT_PUBLIC_FB_PROJECT_ID: '' });
    const res = await handleMe(get('/api/translator/me', await keys.sign()), h.deps);
    expect(res.status).toBe(503);
    expect(await res.json()).toEqual({ error: 'misconfigured' });
  });
});

describe('GET /api/translator/base', () => {
  it('returns main\'s commit sha and the blob shas of the locale and en-us shards only', async () => {
    const h = harness(keys, FILES);
    const res = await handleBase(get('/api/translator/base', await keys.sign()), h.deps);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual({
      sha: h.fake.head,
      files: {
        'i18n/locales/de-de/interface/_core.json': gitSha(FILES['i18n/locales/de-de/interface/_core.json']),
        'i18n/locales/de-de/interface/pages.json': gitSha(FILES['i18n/locales/de-de/interface/pages.json']),
        'i18n/locales/en-us/interface/_core.json': gitSha(FILES['i18n/locales/en-us/interface/_core.json']),
        'i18n/locales/en-us/interface/metadata.json': gitSha(FILES['i18n/locales/en-us/interface/metadata.json']),
      },
    });
    expect(parseBaseBody(body)).toEqual(body);
    expect(h.fake.calls.map((c) => c.op)).toEqual(['getRef', 'getCommitTree', 'getTree']);
    expect(h.fake.calls[0].args).toEqual(['main']);
  });

  it('is cached for 30 s per instance', async () => {
    const h = harness(keys, FILES);
    const token = await keys.sign();
    await handleBase(get('/api/translator/base', token), h.deps);
    await handleBase(get('/api/translator/base', token), h.deps);
    expect(h.fake.calls.filter((c) => c.op === 'getRef')).toHaveLength(1);
    h.clock.ms += BASE_CACHE_MS;
    await handleBase(get('/api/translator/base', token), h.deps);
    expect(h.fake.calls.filter((c) => c.op === 'getRef')).toHaveLength(2);
  });

  it('403 for a non-allowlisted or unverified account; 401 without a token; no GitHub call', async () => {
    const h = harness(keys, FILES);
    expect((await handleBase(get('/api/translator/base', await keys.sign(claims({ email: 'x@example.com' }))), h.deps)).status).toBe(403);
    expect((await handleBase(get('/api/translator/base', await keys.sign(claims({ email_verified: false }))), h.deps)).status).toBe(403);
    expect((await handleBase(get('/api/translator/base'), h.deps)).status).toBe(401);
    expect(h.githubFactoryCalls).toBe(0);
  });

  it('missing GitHub App env: 503 misconfigured; the log names the variables, the response does not', async () => {
    const h = harness(keys, FILES, { GITHUB_APP_PRIVATE_KEY: 'bm90IGEga2V5', GITHUB_APP_ID: '' });
    const res = await handleBase(get('/api/translator/base', await keys.sign()), h.deps);
    expect(res.status).toBe(503);
    expect(await res.json()).toEqual({ error: 'misconfigured' });
    expect(h.logs).toEqual([{ message: 'misconfigured', detail: { missing: ['GITHUB_APP_ID', 'GITHUB_APP_PRIVATE_KEY'] } }]);
  });

  it('a GitHub failure is a bare 502 github_error', async () => {
    const h = harness(keys, FILES);
    h.fake.failOn.getTree = 500;
    const res = await handleBase(get('/api/translator/base', await keys.sign()), h.deps);
    expect(res.status).toBe(502);
    expect(await res.json()).toEqual({ error: 'github_error' });
  });
});

describe('allowlist parsing', () => {
  it('trims, lowercases, ignores empties; empty means nobody', () => {
    expect([...parseAllowlist(' A@x.com, ,b@Y.com,,')]).toEqual(['a@x.com', 'b@y.com']);
    expect(parseAllowlist('').size).toBe(0);
    expect(parseAllowlist(undefined).size).toBe(0);
    expect(isAllowlisted('B@y.COM ', testEnv({ TRANSLATOR_EMAILS: 'a@x.com,b@y.com' }))).toBe(true);
    expect(isAllowlisted('c@y.com', testEnv({ TRANSLATOR_EMAILS: 'a@x.com,b@y.com' }))).toBe(false);
    expect(isAllowlisted('', testEnv({ TRANSLATOR_EMAILS: '' }))).toBe(false);
  });
});
