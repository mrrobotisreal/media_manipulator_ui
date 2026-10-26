/**
 * The translator route handlers' logic (MM54 decisions 1-7, 13), framework-free:
 * `Request` in, `Response` out, every dependency injected. The route files under
 * `app/api/translator/*` call these through `routes.ts` behind the literal role
 * guard; tests call them directly with a local JWKS and a fake GitHub.
 *
 * SERVER ONLY, TRANSLATOR DEPLOYMENTS ONLY.
 *
 * Responses never carry the allowlist, a token, the App key, env values or
 * GitHub error details. Logs carry fixed codes and the 8-char uid prefix only.
 */
import type { JWTVerifyGetKey } from 'jose';

import {
  conflictId,
  DESCRIPTION_MAX,
  DESCRIPTION_MIN,
  MAX_BODY_BYTES,
  MAX_CHANGES,
  MAX_KEY_CHARS,
  MAX_SEEN_ON,
  MAX_SEEN_PATH_CHARS,
  MAX_VALUE_CHARS,
  type DryRunResponse,
  type SubmitConflict,
  type SubmitErrorCode,
  type SubmitSuccess,
  type SubmitWarning,
} from '../submitContract';
import { applyAt, flattenNode, locateKey, parseJson, writeJson, type JsonNode, type KeyTarget } from '../stableJson';
import { pluralCategories, validateKeys } from '../validators';
import { deploymentLocale, firebaseProjectId, githubConfig, isAllowlisted, type Env, type GithubConfig, type TranslatorLocaleInfo } from './config';
import { GithubError, type GithubClient, type TreeEntry } from './githubClient';
import { englishPathFor, isAllowedLocalePath } from './paths';
import {
  branchName,
  commitMessage,
  LABEL_TRANSLATION,
  localeLabel,
  PR_ASSIGNEE,
  prBody,
  prTitle,
  shortUid,
  type PrChangeRow,
} from './prBody';
import type { SubmitLimiter } from './rateLimit';
import { bearerToken, verifyFirebaseIdToken, type VerifiedToken } from './verifyIdToken';

export const BASE_CACHE_MS = 30_000;
export const TRANSLATOR_DOMAIN = 'translate.media-manipulator.com';
const SHA_RE = /^[0-9a-f]{40}$/;
const SEEN_PATH_RE = /^\/(?!\/)[A-Za-z0-9\-._~/%]*$/;
const CONTROL_RE = /[\u0000-\u001f\u007f]/;
const MAX_BRANCH_ATTEMPTS = 9;

export interface HandlerDeps {
  env: Env;
  github: (config: GithubConfig) => Promise<GithubClient>;
  limiter: SubmitLimiter;
  baseCache: Map<string, { at: number; value: { sha: string; files: Record<string, string> } }>;
  /** Test seam: a local JWKS instead of Google's. */
  jwks?: JWTVerifyGetKey;
  /** Test seam: milliseconds since epoch. */
  now?: () => number;
  log?: (message: string, detail: Record<string, unknown>) => void;
}

const defaultLog = (message: string, detail: Record<string, unknown>) => console.warn(`[translator] ${message}`, detail);

export function json(status: number, body: unknown, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
      ...headers,
    },
  });
}

const fail = (status: number, error: SubmitErrorCode, extra: Record<string, unknown> = {}, headers?: Record<string, string>) =>
  json(status, { error, ...extra }, headers);

export function notFound(): Response {
  return fail(404, 'not_found');
}

type Ctx = { locale: TranslatorLocaleInfo; projectId: string };

/** Role + locale + project: the deployment is an armed translator deployment. */
function context(deps: HandlerDeps): Ctx | Response {
  if (deps.env.NEXT_PUBLIC_DEPLOY_ROLE !== 'translator') return notFound();
  const locale = deploymentLocale(deps.env);
  if (!locale) return notFound();
  const projectId = firebaseProjectId(deps.env);
  if (!projectId) {
    (deps.log ?? defaultLog)('misconfigured', { missing: ['NEXT_PUBLIC_FB_PROJECT_ID'] });
    return fail(503, 'misconfigured');
  }
  return { locale, projectId };
}

type Auth = { user: VerifiedToken; status: 'allowed' | 'unverified' | 'not_allowlisted' };

async function authenticate(request: Request, ctx: Ctx, deps: HandlerDeps): Promise<Auth | Response> {
  const token = bearerToken(request.headers.get('authorization'));
  if (!token) return fail(401, 'unauthorized');
  const verified = await verifyFirebaseIdToken(token, {
    projectId: ctx.projectId,
    jwks: deps.jwks,
    now: deps.now ? () => Math.floor(deps.now!() / 1000) : undefined,
  });
  if (!verified.ok) return fail(401, 'unauthorized');
  const user = verified.token;
  // Only an allowlisted account learns that verification is what is missing;
  // everyone else gets the plain site (MM53 decision 2: no hint).
  if (!isAllowlisted(user.email, deps.env)) return { user, status: 'not_allowlisted' };
  if (!user.emailVerified) return { user, status: 'unverified' };
  return { user, status: 'allowed' };
}

/* ------------------------------------------------------------------------- */
/* GET /api/translator/me                                                     */
/* ------------------------------------------------------------------------- */

export async function handleMe(request: Request, deps: HandlerDeps): Promise<Response> {
  const ctx = context(deps);
  if (ctx instanceof Response) return ctx;
  const auth = await authenticate(request, ctx, deps);
  if (auth instanceof Response) return auth;
  if (auth.status !== 'allowed') return json(200, { allowed: false, reason: auth.status });
  return json(200, { allowed: true, email: auth.user.email, locale: ctx.locale.code });
}

/* ------------------------------------------------------------------------- */
/* GitHub helpers                                                             */
/* ------------------------------------------------------------------------- */

async function github(deps: HandlerDeps): Promise<{ client: GithubClient; config: GithubConfig } | Response> {
  const cfg = githubConfig(deps.env);
  if (!cfg.ok) {
    (deps.log ?? defaultLog)('misconfigured', { missing: cfg.problems });
    return fail(503, 'misconfigured');
  }
  try {
    return { client: await deps.github(cfg.config), config: cfg.config };
  } catch (error) {
    return githubFailure(error, deps);
  }
}

function githubFailure(error: unknown, deps: HandlerDeps, uid?: string): Response {
  const detail =
    error instanceof GithubError
      ? { operation: error.operation, status: error.status }
      : { operation: 'unknown', status: null, kind: error instanceof Error ? error.name : typeof error };
  (deps.log ?? defaultLog)('github call failed', { ...detail, ...(uid ? { translator: shortUid(uid) } : {}) });
  return fail(502, 'github_error');
}

async function loadHead(client: GithubClient, baseBranch: string): Promise<{ headSha: string; treeSha: string; entries: Map<string, TreeEntry> }> {
  const headSha = await client.getRef(baseBranch);
  const treeSha = await client.getCommitTree(headSha);
  const tree = await client.getTree(treeSha);
  if (tree.truncated) throw new GithubError(507, 'getTree (truncated)');
  const entries = new Map<string, TreeEntry>();
  for (const e of tree.entries) if (e.type === 'blob') entries.set(e.path, e);
  return { headSha, treeSha, entries };
}

/* ------------------------------------------------------------------------- */
/* GET /api/translator/base                                                   */
/* ------------------------------------------------------------------------- */

export async function handleBase(request: Request, deps: HandlerDeps): Promise<Response> {
  const ctx = context(deps);
  if (ctx instanceof Response) return ctx;
  const auth = await authenticate(request, ctx, deps);
  if (auth instanceof Response) return auth;
  if (auth.status !== 'allowed') return fail(403, 'forbidden');

  const now = (deps.now ?? Date.now)();
  const cached = deps.baseCache.get(ctx.locale.dir);
  if (cached && now - cached.at < BASE_CACHE_MS) return json(200, cached.value);

  const gh = await github(deps);
  if (gh instanceof Response) return gh;
  try {
    const head = await loadHead(gh.client, gh.config.baseBranch);
    const prefixes = [`i18n/locales/${ctx.locale.dir}/`, 'i18n/locales/en-us/'];
    const files: Record<string, string> = {};
    for (const [path, e] of [...head.entries].sort(([a], [b]) => a.localeCompare(b))) {
      if (path.endsWith('.json') && prefixes.some((p) => path.startsWith(p))) files[path] = e.sha;
    }
    const value = { sha: head.headSha, files };
    deps.baseCache.set(ctx.locale.dir, { at: now, value });
    return json(200, value);
  } catch (error) {
    return githubFailure(error, deps, auth.user.uid);
  }
}

/* ------------------------------------------------------------------------- */
/* POST /api/translator/submit                                                */
/* ------------------------------------------------------------------------- */

interface ParsedChange {
  file: string;
  key: string;
  value: string;
  baseValue: string;
  seenOn: string[];
}

interface ParsedBody {
  locale: string;
  description: string;
  changes: ParsedChange[];
  base: { sha: string; files: Record<string, string> };
  acknowledged: Set<string>;
  confirmConflicts: Set<string>;
}

const isObj = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v);
const strArray = (v: unknown, max: number): string[] | null =>
  v === undefined ? [] : Array.isArray(v) && v.length <= max && v.every((x) => typeof x === 'string') ? (v as string[]) : null;

/** Shape check only (types and hard caps); semantic checks come after. */
function parseBody(raw: unknown): ParsedBody | Response {
  const invalid = (field: string) => fail(400, 'invalid_body', { field });
  if (!isObj(raw)) return invalid('body');
  if (typeof raw.locale !== 'string') return invalid('locale');
  if (typeof raw.description !== 'string') return invalid('description');
  if (!Array.isArray(raw.changes)) return invalid('changes');
  if (raw.changes.length > MAX_CHANGES) return fail(400, 'too_many_changes', { max: MAX_CHANGES });
  if (!isObj(raw.base) || typeof raw.base.sha !== 'string' || (raw.base.files !== undefined && !isObj(raw.base.files))) {
    return invalid('base');
  }
  const acknowledged = strArray(raw.acknowledged, 20_000);
  if (!acknowledged) return invalid('acknowledged');
  const confirm = strArray(raw.confirmConflicts, MAX_CHANGES);
  if (!confirm) return invalid('confirmConflicts');
  const files: Record<string, string> = {};
  for (const [p, sha] of Object.entries((raw.base.files as Record<string, unknown> | undefined) ?? {})) {
    if (typeof sha === 'string' && SHA_RE.test(sha)) files[p] = sha;
  }
  const changes: ParsedChange[] = [];
  for (const c of raw.changes) {
    if (!isObj(c)) return invalid('changes');
    if (typeof c.file !== 'string' || typeof c.key !== 'string' || typeof c.value !== 'string') return invalid('changes');
    const baseValue = c.baseValue === undefined ? '' : c.baseValue;
    if (typeof baseValue !== 'string') return invalid('changes');
    const seen = strArray(c.seenOn, 100);
    if (!seen) return invalid('changes');
    changes.push({
      file: c.file,
      key: c.key,
      value: c.value,
      baseValue,
      seenOn: seen.filter((p) => p.length <= MAX_SEEN_PATH_CHARS && SEEN_PATH_RE.test(p) && !p.includes('..')).slice(0, MAX_SEEN_ON),
    });
  }
  return {
    locale: raw.locale,
    description: raw.description,
    changes,
    base: { sha: SHA_RE.test(raw.base.sha) ? raw.base.sha : '', files },
    acknowledged: new Set(acknowledged),
    confirmConflicts: new Set(confirm),
  };
}

async function readBody(request: Request): Promise<unknown | Response> {
  const declared = Number(request.headers.get('content-length') ?? '0');
  if (Number.isFinite(declared) && declared > MAX_BODY_BYTES) return fail(413, 'body_too_large');
  let text: string;
  try {
    text = await request.text();
  } catch {
    return fail(400, 'invalid_body', { field: 'body' });
  }
  if (Buffer.byteLength(text, 'utf8') > MAX_BODY_BYTES) return fail(413, 'body_too_large');
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return fail(400, 'invalid_body', { field: 'json' });
  }
}

interface FileWork {
  file: string;
  englishFile: string;
  blobSha: string;
  root: JsonNode;
  english: Record<string, string>;
  original: string;
}

export async function handleSubmit(request: Request, deps: HandlerDeps): Promise<Response> {
  const ctx = context(deps);
  if (ctx instanceof Response) return ctx;
  const dryRun = new URL(request.url).searchParams.get('dryRun') === '1';
  const log = deps.log ?? defaultLog;

  // (a) token + allowlist
  const auth = await authenticate(request, ctx, deps);
  if (auth instanceof Response) return auth;
  if (auth.status !== 'allowed') return fail(403, 'forbidden');
  const uid = auth.user.uid;

  // body: size cap, JSON, shape
  const raw = await readBody(request);
  if (raw instanceof Response) return raw;
  const body = parseBody(raw);
  if (body instanceof Response) return body;

  // (b) locale
  if (body.locale.toLowerCase() !== ctx.locale.code.toLowerCase()) return fail(400, 'wrong_locale');

  // (d) path allowlist: refused before ANY GitHub call, nothing written
  const badPaths = [...new Set(body.changes.map((c) => c.file).filter((f) => !isAllowedLocalePath(f, ctx.locale.dir)))];
  if (badPaths.length) {
    log('path_not_allowed', { translator: shortUid(uid), count: badPaths.length });
    return fail(400, 'path_not_allowed', { paths: badPaths.slice(0, 50).map((p) => p.slice(0, 200)) });
  }

  // (c) description (a pre-flight may run before the translator has written one)
  const description = body.description.trim();
  if (!dryRun && ([...description].length < DESCRIPTION_MIN || [...description].length > DESCRIPTION_MAX)) {
    return fail(400, 'description_invalid', { min: DESCRIPTION_MIN, max: DESCRIPTION_MAX });
  }

  // (e) caps and shape of each change
  if (body.changes.length === 0) return fail(400, 'no_changes');
  const seenIds = new Set<string>();
  for (const c of body.changes) {
    if (c.key.length === 0 || c.key.length > MAX_KEY_CHARS || CONTROL_RE.test(c.key)) return fail(400, 'invalid_body', { field: 'key' });
    if (c.value.length > MAX_VALUE_CHARS || c.baseValue.length > MAX_VALUE_CHARS) {
      return fail(400, 'value_too_long', { max: MAX_VALUE_CHARS });
    }
    const id = conflictId(c.file, c.key);
    if (seenIds.has(id)) return fail(400, 'duplicate_change');
    seenIds.add(id);
  }

  // (f) rate limit
  if (dryRun) {
    if (!deps.limiter.allowDryRun(uid)) return fail(429, 'rate_limited', { retryAfter: 60 }, { 'Retry-After': '60' });
  } else {
    const wait = deps.limiter.retryAfter(uid);
    if (wait > 0 || !deps.limiter.begin(uid)) {
      const secs = Math.max(wait, 30);
      return fail(429, 'rate_limited', { retryAfter: secs }, { 'Retry-After': String(secs) });
    }
  }

  let succeeded = false;
  try {
    const gh = await github(deps);
    if (gh instanceof Response) return gh;
    const { client, config } = gh;

    // (g) load each touched file (and its English source) from the base branch
    let head: Awaited<ReturnType<typeof loadHead>>;
    const work = new Map<string, FileWork>();
    try {
      head = await loadHead(client, config.baseBranch);
      const blobs = new Map<string, string>();
      const blob = async (sha: string) => {
        if (!blobs.has(sha)) blobs.set(sha, await client.getBlobContent(sha));
        return blobs.get(sha)!;
      };
      const missing: string[] = [];
      for (const file of new Set(body.changes.map((c) => c.file))) {
        const entry = head.entries.get(file);
        const englishFile = englishPathFor(file, ctx.locale.dir);
        const englishEntry = head.entries.get(englishFile);
        if (!entry || !englishEntry) {
          missing.push(file);
          continue;
        }
        const original = await blob(entry.sha);
        const root = parseJson(original);
        const english = flattenNode(parseJson(await blob(englishEntry.sha)));
        work.set(file, { file, englishFile, blobSha: entry.sha, root, english, original });
      }
      if (missing.length) return fail(400, 'file_not_found', { paths: missing.slice(0, 50) });
    } catch (error) {
      return githubFailure(error, deps, uid);
    }

    // (h) locate every key and check for upstream conflicts
    const categories = pluralCategories(ctx.locale.code);
    const unknown: string[] = [];
    const conflicts: SubmitConflict[] = [];
    const located: Array<{ change: ParsedChange; target: KeyTarget; theirs: string | null }> = [];
    for (const change of body.changes) {
      const w = work.get(change.file)!;
      let target: KeyTarget | null;
      try {
        target = locateKey(w.root, change.key, categories);
      } catch {
        target = null;
      }
      if (!target) {
        unknown.push(change.key);
        continue;
      }
      const theirs = target.kind === 'existing' ? target.value : null;
      const moved = body.base.files[change.file] !== w.blobSha;
      if (moved && (theirs ?? '') !== change.baseValue && theirs !== change.value) {
        conflicts.push({ id: conflictId(change.file, change.key), file: change.file, key: change.key, base: change.baseValue, theirs, mine: change.value });
      }
      located.push({ change, target, theirs });
    }
    if (unknown.length) return fail(400, 'key_unknown', { keys: unknown.slice(0, 50).map((k) => k.slice(0, MAX_KEY_CHARS)) });
    const unconfirmed = conflicts.filter((c) => !body.confirmConflicts.has(c.id));
    if (!dryRun && unconfirmed.length) return fail(409, 'conflicts', { conflicts: unconfirmed });

    // (i) apply with the stable writer
    let changed = 0;
    const keysByFile = new Map<string, string[]>();
    for (const { change, target, theirs } of located) {
      if (theirs === change.value) continue; // already on main: nothing to write
      applyAt(work.get(change.file)!.root, target, change.value);
      changed++;
      keysByFile.set(change.file, [...(keysByFile.get(change.file) ?? []), change.key]);
    }

    // (j) the client's validators, re-run on the files as they will be committed
    const warnings: SubmitWarning[] = [];
    for (const [file, keys] of keysByFile) {
      const w = work.get(file)!;
      for (const v of validateKeys({ locale: ctx.locale.code, keys, values: flattenNode(w.root), english: w.english })) {
        warnings.push({ id: v.id, code: v.code, key: v.key, message: v.message });
      }
    }

    const outFiles = [...keysByFile.keys()].map((file) => ({ path: file, content: writeJson(work.get(file)!.root) }));

    if (dryRun) {
      const res: DryRunResponse = { dryRun: true, conflicts, warnings, files: outFiles.length, changed };
      return json(200, res);
    }
    if (changed === 0) return fail(400, 'no_changes');
    const unacked = warnings.filter((w) => !body.acknowledged.has(w.id));
    if (unacked.length) return fail(422, 'unacknowledged_warnings', { warnings: unacked });

    // (k) tree (base_tree keeps every other file) -> commit -> ref -> PR
    const rows: PrChangeRow[] = located
      .filter(({ change, theirs }) => theirs !== change.value)
      .map(({ change, theirs, target }) => ({
        file: change.file,
        key: change.key,
        old: theirs ?? '',
        value: change.value,
        isNew: target.kind === 'new',
        seenOn: change.seenOn,
      }));
    const confirmed = conflicts.filter((c) => body.confirmConflicts.has(c.id));
    try {
      const tree = await client.createTree(head.treeSha, outFiles);
      const commit = await client.createCommit({
        message: commitMessage(ctx.locale.prefix, description, changed, outFiles.length, uid),
        tree,
        parents: [head.headSha],
      });
      const now = new Date((deps.now ?? Date.now)());
      let branch = '';
      for (let attempt = 1; attempt <= MAX_BRANCH_ATTEMPTS && !branch; attempt++) {
        const name = branchName(ctx.locale.prefix, description, now, attempt);
        if (await client.createRef(name, commit)) branch = name;
      }
      if (!branch) throw new GithubError(409, 'createRef (name taken)');
      const pr = await client.pullsCreate({
        title: prTitle(ctx.locale.prefix, description),
        head: branch,
        base: config.baseBranch,
        body: prBody({
          prefix: ctx.locale.prefix,
          description,
          rows,
          origin: `https://${ctx.locale.prefix}.${TRANSLATOR_DOMAIN}`,
          conflicts: confirmed,
          warnings: warnings.filter((w) => body.acknowledged.has(w.id)),
          uid,
        }),
      });
      succeeded = true;
      // (l) labels and assignee: the PR exists now, so a failure here is logged, not fatal
      // (i18n-pr-guard also runs on the `i18n/` head ref without the label).
      try {
        await client.ensureLabels([LABEL_TRANSLATION, localeLabel(ctx.locale.prefix)]);
        await client.addLabels(pr.number, [LABEL_TRANSLATION.name, localeLabel(ctx.locale.prefix).name]);
        await client.addAssignees(pr.number, [PR_ASSIGNEE]);
      } catch (error) {
        log('labels or assignee failed', {
          translator: shortUid(uid),
          pr: pr.number,
          ...(error instanceof GithubError ? { operation: error.operation, status: error.status } : {}),
        });
      }
      const res: SubmitSuccess = { prUrl: pr.url, prNumber: pr.number, branch, files: outFiles.length, changed };
      return json(200, res);
    } catch (error) {
      return githubFailure(error, deps, uid);
    }
  } finally {
    if (!dryRun) deps.limiter.end(uid, succeeded);
  }
}
