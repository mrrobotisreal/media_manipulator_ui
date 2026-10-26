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

import {
  TRANSLATOR_SUBMIT_PATH,
  type DryRunResponse,
  type SubmitConflict,
  type SubmitRequest,
  type SubmitSuccess,
  type SubmitWarning,
} from './submitContract';

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

/**
 * `POST /api/translator/submit` outcomes (MM54; contract in `submitContract.ts`).
 * Every failure keeps the drafts: the modal maps each kind to a message and a retry.
 */
export type SubmitResult =
  | { kind: 'ok'; result: SubmitSuccess }
  | { kind: 'dry_run'; result: DryRunResponse }
  | { kind: 'conflicts'; conflicts: SubmitConflict[] }
  | { kind: 'warnings'; warnings: SubmitWarning[] }
  | { kind: 'rate_limited'; retryAfterSeconds: number }
  | { kind: 'unauthorized' }
  | { kind: 'forbidden' }
  | { kind: 'invalid'; status: number; error: string; paths?: string[] }
  | { kind: 'error'; status: number | null; detail: string };

/** The seam: the HTTP client in the deployment, a fake in tests. */
export interface TranslatorApi {
  me(idToken: string): Promise<MeResult>;
  base(idToken: string): Promise<BaseResult>;
  /** MM54. Optional so MM53-era fakes stay valid; the HTTP client always has it. */
  submit?(idToken: string, body: SubmitRequest, options?: { dryRun?: boolean }): Promise<SubmitResult>;
}

export const TRANSLATOR_ME_PATH = '/api/translator/me';
export const TRANSLATOR_BASE_PATH = '/api/translator/base';
export { TRANSLATOR_SUBMIT_PATH };

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

const isObj = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v);

/** Maps a `/submit` response (status + parsed JSON body, or null) to a `SubmitResult`. */
export function parseSubmitResponse(status: number, body: unknown, retryAfterHeader: string | null = null): SubmitResult {
  const b = isObj(body) ? body : {};
  if (status === 200) {
    if (b.dryRun === true && Array.isArray(b.conflicts) && Array.isArray(b.warnings)) {
      return { kind: 'dry_run', result: body as DryRunResponse };
    }
    if (typeof b.prUrl === 'string' && typeof b.prNumber === 'number' && typeof b.branch === 'string') {
      return { kind: 'ok', result: body as SubmitSuccess };
    }
    return { kind: 'error', status, detail: 'malformed /submit body' };
  }
  if (status === 401) return { kind: 'unauthorized' };
  if (status === 403) return { kind: 'forbidden' };
  if (status === 409 && Array.isArray(b.conflicts)) return { kind: 'conflicts', conflicts: b.conflicts as SubmitConflict[] };
  if (status === 422 && Array.isArray(b.warnings)) return { kind: 'warnings', warnings: b.warnings as SubmitWarning[] };
  if (status === 429) {
    const fromBody = typeof b.retryAfter === 'number' ? b.retryAfter : NaN;
    const fromHeader = retryAfterHeader ? Number(retryAfterHeader) : NaN;
    const secs = Number.isFinite(fromBody) ? fromBody : Number.isFinite(fromHeader) ? fromHeader : 600;
    return { kind: 'rate_limited', retryAfterSeconds: Math.max(1, Math.ceil(secs)) };
  }
  if (status >= 400 && status < 500 && typeof b.error === 'string') {
    const paths = Array.isArray(b.paths) ? b.paths.filter((p): p is string => typeof p === 'string') : undefined;
    return { kind: 'invalid', status, error: b.error, ...(paths ? { paths } : {}) };
  }
  return { kind: 'error', status, detail: typeof b.error === 'string' ? b.error : `HTTP ${status}` };
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
    async submit(idToken, body, opts = {}) {
      try {
        const res = await doFetch(`${base}${TRANSLATOR_SUBMIT_PATH}${opts.dryRun ? '?dryRun=1' : ''}`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${idToken}`, Accept: 'application/json', 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
          cache: 'no-store',
          credentials: 'same-origin',
        });
        let parsed: unknown = null;
        try {
          parsed = await res.json();
        } catch {
          parsed = null;
        }
        return parseSubmitResponse(res.status, parsed, res.headers.get('Retry-After'));
      } catch (error) {
        return { kind: 'error', status: null, detail: error instanceof Error ? error.message : String(error) };
      }
    },
  };
}

/** Test double: canned answers, and a record of the tokens each route saw. */
export interface FakeTranslatorApi extends TranslatorApi {
  calls: { me: string[]; base: string[]; submit: Array<{ token: string; body: SubmitRequest; dryRun: boolean }> };
  setMe(result: MeResult): void;
  setBase(result: BaseResult): void;
  /** Canned `/submit` answers: a function of the request, or a fixed result. */
  setSubmit(handler: SubmitResult | ((body: SubmitRequest, dryRun: boolean) => SubmitResult)): void;
}

export function createFakeTranslatorApi(init: { me?: MeResult; base?: BaseResult } = {}): FakeTranslatorApi {
  let me: MeResult = init.me ?? { status: 'not_allowlisted' };
  let base: BaseResult = init.base ?? { ok: true, base: { sha: 'fake-sha', files: {} } };
  let submit: SubmitResult | ((body: SubmitRequest, dryRun: boolean) => SubmitResult) = (_b, dryRun) =>
    dryRun
      ? { kind: 'dry_run', result: { dryRun: true, conflicts: [], warnings: [], files: 0, changed: 0 } }
      : { kind: 'ok', result: { prUrl: 'https://github.com/o/r/pull/1', prNumber: 1, branch: 'i18n/x/fake', files: 0, changed: 0 } };
  const calls = { me: [] as string[], base: [] as string[], submit: [] as Array<{ token: string; body: SubmitRequest; dryRun: boolean }> };
  return {
    calls,
    setMe: (r) => void (me = r),
    setBase: (r) => void (base = r),
    setSubmit: (h) => void (submit = h),
    async submit(idToken, body, opts = {}) {
      const dryRun = !!opts.dryRun;
      calls.submit.push({ token: idToken, body, dryRun });
      return typeof submit === 'function' ? submit(body, dryRun) : submit;
    },
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
