/**
 * MM54 decision 6 / 14 / acceptance 2, 7: POST /api/translator/submit against a
 * fake GitHub (no network): path allowlist refusals with ZERO write calls, the
 * tree/commit/ref/pull call order and arguments (incl. base_tree), conflict
 * 409 -> confirmed, warnings 422 -> acknowledged, rate limit 429 -> pass after
 * the window (fake clock), label creation, ref-name collision suffix, hostile
 * descriptions/keys, and no secret in any response or log.
 */
// @vitest-environment node
import { beforeAll, describe, expect, it } from 'vitest';

import { conflictId, type SubmitRequest } from '../submitContract';
import { handleSubmit } from './handlers';
import { BRANCH_RE } from './prBody';
import { gitSha } from './testing/fakeGithub';
import { harness, post, TEST_APP_KEY_B64, TEST_APP_KEY_PEM, type Harness } from './testing/harness';
import { claims, createTestKeys, type TestKeys } from './testing/tokens';

let keys: TestKeys;
let token: string;
beforeAll(async () => {
  keys = await createTestKeys();
  token = await keys.sign();
});

const EN = `{
  "hero": {
    "title": "Convert anything",
    "count_one": "{{count}} file",
    "count_other": "{{count}} files"
  },
  "resolutions": {
    "1080": "1080p",
    "720": "720p"
  },
  "models": {
    "rife-v4.6": "RIFE 4.6"
  },
  "save": "Save"
}
`;
const DE = EN; // byte-copy, as the shards are today
const DE_PATH = 'i18n/locales/de-de/interface/pages.json';
const EN_PATH = 'i18n/locales/en-us/interface/pages.json';

function files(): Record<string, string> {
  return {
    [DE_PATH]: DE,
    [EN_PATH]: EN,
    'i18n/locales/de-de/interface/_core.json': '{\n  "x": "X"\n}\n',
    'i18n/locales/en-us/interface/_core.json': '{\n  "x": "X"\n}\n',
    'i18n/locales/fr-fr/interface/pages.json': EN,
    'i18n/locales/en-us/interface/metadata.json': '{\n  "m": "M"\n}\n',
    'app/page.tsx': 'export default 1',
  };
}

function baseFor(h: Harness) {
  const out: Record<string, string> = {};
  for (const [p, c] of h.fake.files) if (p.startsWith('i18n/locales/')) out[p] = gitSha(c);
  return { sha: h.fake.head, files: out };
}

function request(h: Harness, over: Partial<SubmitRequest> = {}): SubmitRequest {
  return {
    locale: 'de-DE',
    description: 'Translate the hero title into German',
    changes: [{ file: DE_PATH, key: 'hero.title', value: 'Alles konvertieren', baseValue: 'Convert anything', seenOn: ['/de'] }],
    base: baseFor(h),
    acknowledged: [],
    confirmConflicts: [],
    ...over,
  };
}

const submit = (h: Harness, body: unknown, opts: { dryRun?: boolean; tok?: string } = {}) =>
  handleSubmit(post(`/api/translator/submit${opts.dryRun ? '?dryRun=1' : ''}`, body, opts.tok ?? token), h.deps);

describe('submit: path allowlist (zero GitHub writes)', () => {
  it.each([
    ['../ traversal', 'i18n/locales/de-de/../en-us/interface/pages.json'],
    ['leading ../', '../i18n/locales/de-de/interface/pages.json'],
    ['another locale', 'i18n/locales/fr-fr/interface/pages.json'],
    ['English', 'i18n/locales/en-us/interface/pages.json'],
    ['metadata.json (English-only shard)', 'i18n/locales/de-de/interface/metadata.json'],
    ['absolute path', '/i18n/locales/de-de/interface/pages.json'],
    ['backslash', 'i18n\\locales\\de-de\\interface\\pages.json'],
    ['outside i18n', 'app/page.tsx'],
    ['workflow file', '.github/workflows/i18n-pr-guard.yml'],
    ['non-json in the locale dir', 'i18n/locales/de-de/interface/pages.ts'],
    ['dot segment', 'i18n/locales/de-de/./interface/pages.json'],
    ['double slash', 'i18n/locales/de-de//interface/pages.json'],
    ['hidden file', 'i18n/locales/de-de/.pages.json'],
    ['NUL byte', 'i18n/locales/de-de/interface/pages.json\u0000.png'],
    ['URL-encoded traversal', 'i18n/locales/de-de/%2e%2e/en-us/pages.json'],
    ['prefix trick', 'i18n/locales/de-de-evil/interface/pages.json'],
  ])('refuses %s with 400 path_not_allowed and performs zero GitHub write calls', async (_name, file) => {
    const h = harness(keys, files());
    const res = await submit(h, request(h, { changes: [{ file, key: 'hero.title', value: 'x', baseValue: '' }] }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe('path_not_allowed');
    expect(h.fake.writeCalls()).toEqual([]);
    expect(h.fake.calls).toEqual([]); // refused before any GitHub call at all
  });

  it('one bad path among good ones refuses the whole submit (all-or-nothing)', async () => {
    const h = harness(keys, files());
    const body = request(h);
    body.changes.push({ file: 'i18n/locales/fr-fr/interface/pages.json', key: 'save', value: 'Enregistrer', baseValue: 'Save' });
    const res = await submit(h, body);
    expect(res.status).toBe(400);
    expect((await res.json()).paths).toEqual(['i18n/locales/fr-fr/interface/pages.json']);
    expect(h.fake.calls).toEqual([]);
  });
});

describe('submit: the happy path', () => {
  it('calls getRef -> getCommitTree -> getTree -> blobs -> createTree(base_tree) -> createCommit(parent) -> createRef -> pullsCreate -> labels -> assignee', async () => {
    const h = harness(keys, files());
    const res = await submit(h, request(h));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual({
      prUrl: 'https://github.com/mrrobotisreal/media_manipulator_ui/pull/42',
      prNumber: 42,
      branch: expect.stringMatching(BRANCH_RE),
      files: 1,
      changed: 1,
    });
    expect(h.fake.calls.map((c) => c.op)).toEqual([
      'getRef',
      'getCommitTree',
      'getTree',
      'getBlobContent',
      'createTree',
      'createCommit',
      'createRef',
      'pullsCreate',
      'ensureLabels',
      'addLabels',
      'addAssignees',
    ]);
    const call = (op: string) => h.fake.calls.find((c) => c.op === op)!.args;
    expect(call('getRef')).toEqual(['main']);
    const treeSha = await h.fake.getCommitTree(h.fake.head); // what loadHead read
    const [baseTree, treeFiles] = call('createTree') as [string, Array<{ path: string; content: string }>];
    expect(baseTree).toBe(treeSha); // base_tree: every other file is kept
    expect(treeFiles).toEqual([{ path: DE_PATH, content: DE.replace('"title": "Convert anything"', '"title": "Alles konvertieren"') }]);
    const commit = call('createCommit')[0] as { message: string; tree: string; parents: string[] };
    expect(commit.parents).toEqual([h.fake.head]);
    expect(commit.message).toMatch(/^i18n\(de\): Translate the hero title into German\n/);
    const [ref] = call('createRef') as [string, string];
    expect(ref).toBe('i18n/de/20260921-1413-translate-the-hero-title-into-german');
    const pr = call('pullsCreate')[0] as { title: string; head: string; base: string; body: string };
    expect(pr).toMatchObject({ title: 'i18n(de): Translate the hero title into German', head: ref, base: 'main' });
    expect(pr.body).toContain('### Changes');
    expect(pr.body).toContain('| interface/pages.json | hero.title | Convert anything | Alles konvertieren |');
    expect(pr.body).toContain('<https://de.translate.media-manipulator.com/de>');
    expect(pr.body).toContain('Submitted by translator uid01234 (Firebase uid prefix)');
    expect(call('ensureLabels')).toEqual([
      [
        { name: 'translation', color: '0e8a16', description: expect.any(String) },
        { name: 'locale:de', color: '1d76db', description: expect.any(String) },
      ],
    ]);
    expect(call('addLabels')).toEqual([42, ['translation', 'locale:de']]);
    expect(call('addAssignees')).toEqual([42, ['mrrobotisreal']]);
    expect(h.fake.labels).toEqual(new Set(['translation', 'locale:de'])); // created when missing
  });

  it('keeps integer-like key order, resolves dotted keys, and inserts a missing plural form after the last sibling', async () => {
    const h = harness(keys, files(), { NEXT_PUBLIC_TRANSLATOR_LOCALE: 'ru-RU' });
    const RU = 'i18n/locales/ru-ru/interface/pages.json';
    h.fake.files.set(RU, EN);
    const res = await submit(
      h,
      request(h, {
        locale: 'ru-RU',
        description: 'Russian plurals and labels',
        changes: [
          { file: RU, key: 'resolutions.720', value: '720p (HD)', baseValue: '720p' },
          { file: RU, key: 'models.rife-v4.6', value: 'RIFE 4.6 (рекомендуется)', baseValue: 'RIFE 4.6' },
          { file: RU, key: 'hero.count_few', value: '{{count}} файла', baseValue: '' },
          { file: RU, key: 'hero.count_many', value: '{{count}} файлов', baseValue: '' },
        ],
        base: { sha: h.fake.head, files: { [RU]: gitSha(EN) } },
      }),
    );
    expect(res.status).toBe(200);
    const [, treeFiles] = h.fake.calls.find((c) => c.op === 'createTree')!.args as [string, Array<{ content: string }>];
    expect(treeFiles[0].content).toBe(
      EN.replace('"720": "720p"', '"720": "720p (HD)"')
        .replace('"rife-v4.6": "RIFE 4.6"', '"rife-v4.6": "RIFE 4.6 (рекомендуется)"')
        .replace('"count_other": "{{count}} files"\n', '"count_other": "{{count}} files",\n    "count_few": "{{count}} файла",\n    "count_many": "{{count}} файлов"\n'),
    );
  });

  it('ref-name collision appends -2, -3', async () => {
    const h = harness(keys, files());
    h.fake.existingRefs.add('i18n/de/20260921-1413-translate-the-hero-title-into-german');
    h.fake.existingRefs.add('i18n/de/20260921-1413-translate-the-hero-title-into-german-2');
    const res = await submit(h, request(h));
    expect((await res.json()).branch).toBe('i18n/de/20260921-1413-translate-the-hero-title-into-german-3');
    expect(h.fake.calls.filter((c) => c.op === 'createRef')).toHaveLength(3);
  });

  it('a label/assignee failure after the PR exists still answers 200 (logged)', async () => {
    const h = harness(keys, files());
    h.fake.failOn.addAssignees = 422;
    const res = await submit(h, request(h));
    expect(res.status).toBe(200);
    expect(h.logs.map((l) => l.message)).toContain('labels or assignee failed');
  });
});

describe('submit: conflicts', () => {
  it('main moved and changed the key: 409 with base/theirs/mine and nothing written; confirmed -> PR lists it', async () => {
    const h = harness(keys, files());
    const body = request(h); // base captured before main moves
    h.fake.commitOnMain(DE_PATH, DE.replace('"Convert anything"', '"Alles umwandeln"'));
    const res = await submit(h, body);
    expect(res.status).toBe(409);
    const id = conflictId(DE_PATH, 'hero.title');
    expect(await res.json()).toEqual({
      error: 'conflicts',
      conflicts: [{ id, file: DE_PATH, key: 'hero.title', base: 'Convert anything', theirs: 'Alles umwandeln', mine: 'Alles konvertieren' }],
    });
    expect(h.fake.writeCalls()).toEqual([]);

    const ok = await submit(h, { ...body, confirmConflicts: [id] });
    expect(ok.status).toBe(200);
    const pr = h.fake.calls.find((c) => c.op === 'pullsCreate')!.args[0] as { body: string };
    expect(pr.body).toContain('### Upstream conflicts resolved');
    expect(pr.body).toContain('| hero.title | Convert anything | Alles umwandeln | Alles konvertieren |');
    const [, treeFiles] = h.fake.calls.find((c) => c.op === 'createTree')!.args as [string, Array<{ content: string }>];
    expect(treeFiles[0].content).toContain('"title": "Alles konvertieren"'); // the translator's value wins
  });

  it('main moved but only OTHER keys changed: no conflict, the edit is applied on top of the new main', async () => {
    const h = harness(keys, files());
    const body = request(h);
    h.fake.commitOnMain(DE_PATH, DE.replace('"save": "Save"', '"save": "Speichern"'));
    const res = await submit(h, body);
    expect(res.status).toBe(200);
    const [, treeFiles] = h.fake.calls.find((c) => c.op === 'createTree')!.args as [string, Array<{ content: string }>];
    expect(treeFiles[0].content).toContain('"save": "Speichern"');
    expect(treeFiles[0].content).toContain('"title": "Alles konvertieren"');
  });

  it('dry run returns conflicts and warnings without writing, and skips the description check', async () => {
    const h = harness(keys, files());
    const body = request(h, { description: '' });
    h.fake.commitOnMain(DE_PATH, DE.replace('"Convert anything"', '"Alles umwandeln"'));
    const res = await submit(h, body, { dryRun: true });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toMatchObject({ dryRun: true, files: 1, changed: 1 });
    expect(json.conflicts).toHaveLength(1);
    expect(h.fake.writeCalls()).toEqual([]);
  });
});

describe('submit: validator warnings (same module as the client)', () => {
  it('422 lists unacknowledged warnings; re-submitting with the ids acknowledged opens the PR and lists them', async () => {
    const h = harness(keys, files());
    const body = request(h, {
      changes: [{ file: DE_PATH, key: 'hero.count_other', value: 'Dateien', baseValue: '{{count}} files' }],
    });
    const res = await submit(h, body);
    expect(res.status).toBe(422);
    const json = await res.json();
    expect(json.error).toBe('unacknowledged_warnings');
    expect(json.warnings.map((w: { id: string }) => w.id)).toEqual(['hero.count_other#placeholder_missing']);
    expect(h.fake.writeCalls()).toEqual([]);

    const ok = await submit(h, { ...body, acknowledged: ['hero.count_other#placeholder_missing'] });
    expect(ok.status).toBe(200);
    const pr = h.fake.calls.find((c) => c.op === 'pullsCreate')!.args[0] as { body: string };
    expect(pr.body).toContain('### Validator warnings acknowledged\n\n- placeholder\\_missing: hero.count\\_other');
  });
});

describe('submit: rate limit', () => {
  it('one successful submit per user per 10 minutes: 429 + Retry-After, then passes after the window (fake clock)', async () => {
    const h = harness(keys, files());
    expect((await submit(h, request(h))).status).toBe(200);
    h.clock.ms += 60_000;
    const limited = await submit(h, request(h, { description: 'A second batch of fixes for de' }));
    expect(limited.status).toBe(429);
    expect(limited.headers.get('retry-after')).toBe('540');
    expect(await limited.json()).toEqual({ error: 'rate_limited', retryAfter: 540 });
    const writesBefore = h.fake.writeCalls().length;
    h.clock.ms += 9 * 60_000;
    expect((await submit(h, request(h, { description: 'A second batch of fixes for de' }))).status).toBe(200);
    expect(h.fake.writeCalls().length).toBeGreaterThan(writesBefore);
  });

  it('failed submits (409/422/GitHub error) do not consume the window; another user is not limited', async () => {
    const h = harness(keys, files());
    h.fake.failOn.pullsCreate = 500;
    expect((await submit(h, request(h))).status).toBe(502);
    delete h.fake.failOn.pullsCreate;
    expect((await submit(h, request(h))).status).toBe(200);
    const other = await keys.sign(claims({ sub: 'otherUid999', email: 'someone@example.com' }));
    expect((await submit(h, request(h), { tok: other })).status).toBe(200);
  });
});

describe('submit: request validation', () => {
  it('auth: 401 without token, 403 for a non-allowlisted or unverified account', async () => {
    const h = harness(keys, files());
    expect((await handleSubmit(post('/api/translator/submit', request(h)), h.deps)).status).toBe(401);
    expect((await submit(h, request(h), { tok: await keys.sign(claims({ email: 'x@example.com' })) })).status).toBe(403);
    expect((await submit(h, request(h), { tok: await keys.sign(claims({ email_verified: false })) })).status).toBe(403);
    expect(h.fake.calls).toEqual([]);
  });

  it('wrong locale, short/long description, empty and duplicate changes, unknown keys, caps, bad JSON', async () => {
    const h = harness(keys, files());
    const code = async (body: unknown) => (await (await submit(h, body)).json()).error;
    expect(await code(request(h, { locale: 'fr-FR' }))).toBe('wrong_locale');
    expect(await code(request(h, { description: '123456789' }))).toBe('description_invalid');
    expect(await code(request(h, { description: 'x'.repeat(2001) }))).toBe('description_invalid');
    expect(await code(request(h, { changes: [] }))).toBe('no_changes');
    const c = request(h).changes[0];
    expect(await code(request(h, { changes: [c, c] }))).toBe('duplicate_change');
    expect(await code(request(h, { changes: [{ ...c, key: 'brand.newKey' }] }))).toBe('key_unknown');
    expect(await code(request(h, { changes: [{ ...c, value: 'x'.repeat(20_001) }] }))).toBe('value_too_long');
    expect(await code(request(h, { changes: Array.from({ length: 2001 }, () => c) }))).toBe('too_many_changes');
    expect(await code('{not json')).toBe('invalid_body');
    expect(await code({ ...request(h), changes: 'nope' })).toBe('invalid_body');
    expect((await submit(h, 'x'.repeat(1_000_001))).status).toBe(413);
    expect(h.fake.writeCalls()).toEqual([]);
    // Last, because a success starts the rate-limit window: the description is trimmed first.
    expect((await submit(h, request(h, { description: '   1234567890   ' }))).status).toBe(200);
  });

  it('a change equal to main is a no-op; only no-op changes => no_changes', async () => {
    const h = harness(keys, files());
    const res = await submit(h, request(h, { changes: [{ file: DE_PATH, key: 'save', value: 'Save', baseValue: 'Save' }] }));
    expect((await res.json()).error).toBe('no_changes');
    expect(h.fake.writeCalls()).toEqual([]);
  });
});

describe('submit: hostile input', () => {
  const HOSTILE = [
    'Fix @mrrobotisreal please #1 <script>alert(1)</script>',
    '| table | break |\n# Heading\n```js\nevil()\n```',
    '[click](javascript:alert(1)) ![x](https://evil.example/x.png) <img src=x onerror=alert(1)>',
    '<!-- hidden --> &amp; <details open>x</details> \u0000\u0007 ­‮rtl override',
  ];

  it.each(HOSTILE)('escapes a hostile description in the PR title, body and commit: %j', async (description) => {
    const h = harness(keys, files());
    const body = request(h, {
      description,
      changes: [
        {
          file: DE_PATH,
          key: 'hero.title',
          value: `${description} | <b>x</b>`,
          baseValue: 'Convert anything',
          seenOn: ['/de', 'javascript:alert(1)', '//evil.example', '/de/../../x'],
        },
      ],
    });
    // Acknowledge whatever the validators raise, so the PR is always built and its escaping checked.
    const dry = await (await submit(h, body, { dryRun: true })).json();
    const res = await submit(h, { ...body, acknowledged: dry.warnings.map((w: { id: string }) => w.id) });
    expect(res.status).toBe(200);
    const pr = h.fake.calls.find((c) => c.op === 'pullsCreate')!.args[0] as { title: string; body: string };
    for (const text of [pr.body]) {
      expect(text).not.toMatch(/<script|<img|<details|<!--|<b>/i);
      expect(text).not.toMatch(/(^|[^\\])\[click\]\(/);
      expect(text).not.toMatch(/@mrrobotisreal/); // the mention is broken by a word joiner
      expect(text).not.toMatch(/(^|\s)#1\b/);
      expect(text).not.toMatch(/\]\(javascript:/); // the link syntax is escaped
      expect(text).not.toContain('<https://de.translate.media-manipulator.comjavascript');
      expect(text).not.toContain('https://evil.example'); // no autolink: `://` carries a word joiner
      expect(text).not.toContain('//evil.example>'); // `//…` pages were dropped
      expect(text).not.toContain('/de/../../x');
      expect(text).not.toContain('\u0000');
      expect(text).not.toMatch(/^```/m);
      expect(text).not.toMatch(/^# Heading/m);
    }
    expect(pr.title.startsWith('i18n(de): ')).toBe(true);
    expect(pr.title).not.toContain('\n');
    expect([...pr.title].length).toBeLessThanOrEqual('i18n(de): '.length + 60);
    const commit = h.fake.calls.find((c) => c.op === 'createCommit')!.args[0] as { message: string };
    expect(commit.message).not.toContain('\u0000');
  });

  it('hostile keys (prototype pollution, traversal-looking, control chars) never write', async () => {
    const h = harness(keys, files());
    for (const key of ['__proto__', 'constructor.prototype.polluted', '__proto__.polluted', 'hero.__proto__', '../../etc', 'hero.title\u0000', 'hero\ntitle']) {
      const res = await submit(h, request(h, { changes: [{ file: DE_PATH, key, value: 'x', baseValue: '' }] }));
      expect(res.status, key).toBe(400);
    }
    expect(({} as Record<string, unknown>).polluted).toBeUndefined();
    expect(h.fake.writeCalls()).toEqual([]);
  });
});

describe('submit: no secrets in responses or logs', () => {
  it('no response or log line contains the App key, the token, the allowlist or the email', async () => {
    const h = harness(keys, files());
    const texts: string[] = [];
    const run = async (body: unknown, opts: { dryRun?: boolean; tok?: string } = {}) => texts.push(await (await submit(h, body, opts)).text());
    await run(request(h));
    await run(request(h)); // 429
    h.fake.failOn.createTree = 500;
    await run(request(h, { description: 'Another description here' }));
    await run(request(h, { changes: [{ file: 'app/page.tsx', key: 'x', value: 'x', baseValue: '' }] }));
    await run(request(h), { tok: 'garbage.token.here' });
    const misconfigured = harness(keys, files(), { GITHUB_APP_PRIVATE_KEY: '' });
    texts.push(await (await handleSubmit(post('/api/translator/submit', request(misconfigured), token), misconfigured.deps)).text());
    const all = [...texts, ...h.logs.map((l) => JSON.stringify(l)), ...misconfigured.logs.map((l) => JSON.stringify(l))].join('\n');
    expect(all).not.toContain(TEST_APP_KEY_B64.slice(0, 40));
    expect(all).not.toContain(TEST_APP_KEY_PEM.split('\n')[1]);
    expect(all).not.toContain(token);
    expect(all).not.toContain('someone@example.com');
    expect(all).not.toContain('translator@example.com');
    const pr = h.fake.calls.find((c) => c.op === 'pullsCreate')!.args[0] as { body: string };
    expect(pr.body).not.toContain('translator@example.com');
    expect(pr.body).not.toContain('@example.com');
  });
});
