/**
 * Typed client for the translator routes (MM53 codes against MM54's contract).
 *
 * TRANSLATOR DEPLOYMENTS ONLY (loaded inside the workbench chunk, never from app code).
 *
 *   GET /api/translator/me     Authorization: Bearer <Firebase ID token>
 *     200 { allowed: true, email, locale }
 *     200 { allowed: false, reason: 'unverified' | 'not_allowlisted' | 'wrong_locale' }
 *     401 (missing / invalid token)
 *   GET /api/translator/base   same auth, allowed users only
 *     200 { sha, files: { "<repo path>": "<blob sha>" } }
 *     `sha` = commit SHA of `main`; `files` covers `i18n/locales/<locale dir>/**` and
 *     `i18n/locales/en-us/**` (MM54 decision 4).
 *
 * `wrong_locale` is reserved: MM54 allowlists per branch, so the server never sends it,
 * but the client also maps a `/me` locale that differs from the deployment's to it.
 * Anything else (404 before MM54 lands, 5xx, network, malformed JSON) is `error`, and the
 * gate treats `error` like every other refusal: the plain site, no panel, no hint.
 */

export type MeResponse =
  | { allowed: true; email: string; locale: string }
  | { allowed: false; reason: 'unverified' | 'not_allowlisted' | 'wrong_locale' };

export interface BaseResponse {
  sha: string;
  files: Record<string, string>;
}

/** What the gate sees: the `/me` verdict plus the transport outcomes. */
export type MeResult =
  | { status: 'allowed'; email: string; locale: string }
  | { status: 'unverified' | 'not_allowlisted' | 'wrong_locale' }
  | { status: 'unauthorized' }
  | { status: 'error'; detail: string };

export type BaseResult = { ok: true; base: BaseResponse } | { ok: false; status: number | null; detail: string };

/** The seam: the HTTP client in the deployment, a fake in tests. */
export interface TranslatorApi {
  me(idToken: string): Promise<MeResult>;
  base(idToken: string): Promise<BaseResult>;
}

export const TRANSLATOR_ME_PATH = '/api/translator/me';
export const TRANSLATOR_BASE_PATH = '/api/translator/base';

const REFUSALS = new Set(['unverified', 'not_allowlisted', 'wrong_locale']);

/** Validates a `/me` body; anything off-contract becomes `error`. */
export function parseMeBody(body: unknown): MeResult {
  if (!body || typeof body !== 'object') return { status: 'error', detail: 'malformed /me body' };
  const b = body as Record<string, unknown>;
  if (b.allowed === true && typeof b.email === 'string' && typeof b.locale === 'string') {
    return { status: 'allowed', email: b.email, locale: b.locale };
  }
  if (b.allowed === false && typeof b.reason === 'string' && REFUSALS.has(b.reason)) {
    return { status: b.reason as 'unverified' | 'not_allowlisted' | 'wrong_locale' };
  }
  return { status: 'error', detail: 'malformed /me body' };
}

/** Validates a `/base` body. */
export function parseBaseBody(body: unknown): BaseResponse | null {
  if (!body || typeof body !== 'object') return null;
  const b = body as Record<string, unknown>;
  if (typeof b.sha !== 'string' || !b.sha || !b.files || typeof b.files !== 'object') return null;
  const files: Record<string, string> = {};
  for (const [path, sha] of Object.entries(b.files as Record<string, unknown>)) {
    if (typeof sha !== 'string') return null;
    files[path] = sha;
  }
  return { sha: b.sha, files };
}

export interface HttpTranslatorApiOptions {
  fetch?: typeof fetch;
  /** Origin-relative by default (the translator deployment serves the routes itself). */
  baseUrl?: string;
}

export function createHttpTranslatorApi(options: HttpTranslatorApiOptions = {}): TranslatorApi {
  const doFetch = options.fetch ?? ((...args: Parameters<typeof fetch>) => fetch(...args));
  const base = options.baseUrl ?? '';
  const get = (path: string, idToken: string) =>
    doFetch(`${base}${path}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${idToken}`, Accept: 'application/json' },
      cache: 'no-store',
      credentials: 'same-origin',
    });

  return {
    async me(idToken) {
      try {
        const res = await get(TRANSLATOR_ME_PATH, idToken);
        if (res.status === 401) return { status: 'unauthorized' };
        if (!res.ok) return { status: 'error', detail: `HTTP ${res.status}` };
        return parseMeBody(await res.json());
      } catch (error) {
        return { status: 'error', detail: error instanceof Error ? error.message : String(error) };
      }
    },
    async base(idToken) {
      try {
        const res = await get(TRANSLATOR_BASE_PATH, idToken);
        if (!res.ok) return { ok: false, status: res.status, detail: `HTTP ${res.status}` };
        const parsed = parseBaseBody(await res.json());
        return parsed ? { ok: true, base: parsed } : { ok: false, status: res.status, detail: 'malformed /base body' };
      } catch (error) {
        return { ok: false, status: null, detail: error instanceof Error ? error.message : String(error) };
      }
    },
  };
}

/** Test double: canned answers, and a record of the tokens each route saw. */
export interface FakeTranslatorApi extends TranslatorApi {
  calls: { me: string[]; base: string[] };
  setMe(result: MeResult): void;
  setBase(result: BaseResult): void;
}

export function createFakeTranslatorApi(init: { me?: MeResult; base?: BaseResult } = {}): FakeTranslatorApi {
  let me: MeResult = init.me ?? { status: 'not_allowlisted' };
  let base: BaseResult = init.base ?? { ok: true, base: { sha: 'fake-sha', files: {} } };
  const calls = { me: [] as string[], base: [] as string[] };
  return {
    calls,
    setMe: (r) => void (me = r),
    setBase: (r) => void (base = r),
    async me(idToken) {
      calls.me.push(idToken);
      return me;
    },
    async base(idToken) {
      calls.base.push(idToken);
      return base;
    },
  };
}
