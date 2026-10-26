/**
 * MM54 decision 5: the Octokit adapter, with a mocked `fetch` (no network).
 * Proves the installation token is requested NARROWED (one repo, Contents /
 * Pull requests / Issues write), the Git Data calls carry `base_tree` and the
 * right shapes, a 422 on createRef is a collision, and errors never carry the
 * token or the request.
 */
// @vitest-environment node
import { describe, expect, it } from 'vitest';

import { githubConfig } from './config';
import { GithubError } from './githubClient';
import { createOctokitGithubClient, TOKEN_PERMISSIONS } from './octokitClient';
import { testEnv } from './testing/harness';

const INSTALLATION_TOKEN = 'ghs_testInstallationToken0000000000000';

function mockGithub(overrides: Record<string, (body: unknown) => [number, unknown]> = {}) {
  const calls: Array<{ method: string; path: string; auth: string | null; body: unknown }> = [];
  const unexpected: string[] = [];
  const fetchMock = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = new URL(typeof input === 'string' ? input : input instanceof URL ? input.href : input.url);
    const method = (init?.method ?? 'GET').toUpperCase();
    const headers = new Headers(init?.headers);
    const body = init?.body ? JSON.parse(String(init.body)) : null;
    // Octokit percent-encodes the `heads/main` ref segment (documented usage; GitHub accepts it).
    const key = `${method} ${url.pathname.replace(/%2F/gi, '/')}`;
    calls.push({ method, path: `${url.pathname}${url.search}`, auth: headers.get('authorization'), body });
    const reply = (status: number, data: unknown) =>
      new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json' } });
    if (overrides[key]) return reply(...overrides[key](body));
    if (key === 'POST /app/installations/7890123/access_tokens') {
      return reply(201, { token: INSTALLATION_TOKEN, expires_at: '2099-01-01T00:00:00Z', permissions: body.permissions, repository_selection: 'selected' });
    }
    if (key === 'GET /repos/mrrobotisreal/media_manipulator_ui/git/ref/heads/main') return reply(200, { object: { sha: 'c'.repeat(40) } });
    if (key === `GET /repos/mrrobotisreal/media_manipulator_ui/git/commits/${'c'.repeat(40)}`) return reply(200, { tree: { sha: 't'.repeat(40) } });
    if (key.startsWith('GET /repos/mrrobotisreal/media_manipulator_ui/git/trees/'))
      return reply(200, { sha: 't'.repeat(40), truncated: false, tree: [{ path: 'a.json', sha: 'b'.repeat(40), type: 'blob', mode: '100644' }] });
    if (key.startsWith('GET /repos/mrrobotisreal/media_manipulator_ui/git/blobs/'))
      return reply(200, { content: Buffer.from('{\n  "a": "ä"\n}\n').toString('base64'), encoding: 'base64' });
    if (key === 'POST /repos/mrrobotisreal/media_manipulator_ui/git/trees') return reply(201, { sha: 'n'.repeat(40) });
    if (key === 'POST /repos/mrrobotisreal/media_manipulator_ui/git/commits') return reply(201, { sha: 'm'.repeat(40) });
    if (key === 'POST /repos/mrrobotisreal/media_manipulator_ui/git/refs') return reply(201, { ref: body.ref });
    if (key === 'POST /repos/mrrobotisreal/media_manipulator_ui/pulls') return reply(201, { number: 7, html_url: 'https://github.com/x/y/pull/7' });
    if (key.startsWith('GET /repos/mrrobotisreal/media_manipulator_ui/labels/')) return reply(404, { message: 'Not Found' });
    if (key === 'POST /repos/mrrobotisreal/media_manipulator_ui/labels') return reply(201, {});
    if (key.endsWith('/labels') || key.endsWith('/assignees')) return reply(200, {});
    unexpected.push(key);
    return reply(500, { message: `unexpected ${key}` });
  };
  return { calls, unexpected, fetch: fetchMock as typeof fetch };
}

const config = () => {
  const c = githubConfig(testEnv());
  if (!c.ok) throw new Error('test config');
  return c.config;
};

describe('Octokit GitHub client (mocked fetch)', () => {
  it('requests an installation token narrowed to the one repo and three permissions, signed with an App JWT', async () => {
    const gh = mockGithub();
    await createOctokitGithubClient(config(), { fetch: gh.fetch });
    const tokenCall = gh.calls.find((c) => c.path === '/app/installations/7890123/access_tokens')!;
    expect(tokenCall.body).toEqual({ repositories: ['media_manipulator_ui'], permissions: TOKEN_PERMISSIONS });
    expect(TOKEN_PERMISSIONS).toEqual({ contents: 'write', pull_requests: 'write', issues: 'write' });
    expect(tokenCall.auth).toMatch(/^bearer [A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/);
  });

  it('git data calls: getRef, getCommit, recursive getTree, base64 blob, createTree WITH base_tree, commit, ref, PR, labels, assignee', async () => {
    const gh = mockGithub();
    const client = await createOctokitGithubClient(config(), { fetch: gh.fetch });
    const ref = await client.getRef('main').catch((e) => e);
    expect(gh.unexpected).toEqual([]);
    expect(ref).toBe('c'.repeat(40));
    expect(await client.getCommitTree('c'.repeat(40))).toBe('t'.repeat(40));
    expect((await client.getTree('t'.repeat(40))).entries).toEqual([{ path: 'a.json', sha: 'b'.repeat(40), type: 'blob', mode: '100644' }]);
    expect(await client.getBlobContent('b'.repeat(40))).toBe('{\n  "a": "ä"\n}\n');
    expect(await client.createTree('t'.repeat(40), [{ path: 'i18n/locales/de-de/x.json', content: '{}\n' }])).toBe('n'.repeat(40));
    expect(await client.createCommit({ message: 'm', tree: 'n'.repeat(40), parents: ['c'.repeat(40)] })).toBe('m'.repeat(40));
    expect(await client.createRef('i18n/de/20260101-0000-x', 'm'.repeat(40))).toBe(true);
    expect(await client.pullsCreate({ title: 't', head: 'i18n/de/20260101-0000-x', base: 'main', body: 'b' })).toEqual({ number: 7, url: 'https://github.com/x/y/pull/7' });
    await client.ensureLabels([{ name: 'locale:pt-br', color: '1d76db', description: 'd' }]);
    await client.addLabels(7, ['translation']);
    await client.addAssignees(7, ['mrrobotisreal']);

    const api = gh.calls.filter((c) => !c.path.startsWith('/app/'));
    expect(api.every((c) => c.auth === `token ${INSTALLATION_TOKEN}`)).toBe(true);
    expect(api.find((c) => c.path.startsWith('/repos/mrrobotisreal/media_manipulator_ui/git/trees/'))!.path).toContain('recursive=true');
    expect(api.find((c) => c.method === 'POST' && c.path.endsWith('/git/trees'))!.body).toEqual({
      base_tree: 't'.repeat(40),
      tree: [{ path: 'i18n/locales/de-de/x.json', mode: '100644', type: 'blob', content: '{}\n' }],
    });
    expect(api.find((c) => c.method === 'POST' && c.path.endsWith('/git/refs'))!.body).toEqual({ ref: 'refs/heads/i18n/de/20260101-0000-x', sha: 'm'.repeat(40) });
    expect(api.find((c) => c.method === 'POST' && c.path.endsWith('/pulls'))!.body).toMatchObject({ base: 'main', head: 'i18n/de/20260101-0000-x', maintainer_can_modify: false });
    expect(decodeURIComponent(api.find((c) => c.path.startsWith('/repos/mrrobotisreal/media_manipulator_ui/labels/'))!.path)).toBe('/repos/mrrobotisreal/media_manipulator_ui/labels/locale:pt-br');
    expect(api.find((c) => c.method === 'POST' && c.path.endsWith('/labels') && !c.path.includes('/issues/'))!.body).toEqual({ name: 'locale:pt-br', color: '1d76db', description: 'd' });
    expect(api.find((c) => c.path.endsWith('/issues/7/assignees'))!.body).toEqual({ assignees: ['mrrobotisreal'] });
  });

  it('createRef 422 (already exists) is a collision, not an error', async () => {
    const gh = mockGithub({ 'POST /repos/mrrobotisreal/media_manipulator_ui/git/refs': () => [422, { message: 'Reference already exists' }] });
    const client = await createOctokitGithubClient(config(), { fetch: gh.fetch });
    expect(await client.createRef('i18n/de/x', 'm'.repeat(40))).toBe(false);
  });

  it('errors are GithubError(status, operation) and never carry the token, key or request', async () => {
    const gh = mockGithub({ 'POST /repos/mrrobotisreal/media_manipulator_ui/pulls': () => [403, { message: `denied ${INSTALLATION_TOKEN}` }] });
    const client = await createOctokitGithubClient(config(), { fetch: gh.fetch });
    const error = await client.pullsCreate({ title: 't', head: 'h', base: 'main', body: 'b' }).catch((e: unknown) => e);
    expect(error).toBeInstanceOf(GithubError);
    expect(error).toMatchObject({ status: 403, operation: 'pulls.create' });
    expect(JSON.stringify(error) + String(error) + (error as Error).stack).not.toContain(INSTALLATION_TOKEN);
    expect(Object.keys(error as object)).toEqual(expect.not.arrayContaining(['request', 'response']));
  });

  it('a failing token exchange is GithubError("installation token")', async () => {
    const gh = mockGithub({ 'POST /app/installations/7890123/access_tokens': () => [401, { message: 'bad jwt' }] });
    await expect(createOctokitGithubClient(config(), { fetch: gh.fetch })).rejects.toMatchObject({ status: 401, operation: 'installation token' });
  });
});
