/**
 * `GithubClient` over Octokit with a GitHub App installation token (MM54 decision 5).
 *
 * SERVER ONLY, TRANSLATOR DEPLOYMENTS ONLY (loaded by `routes.ts`, which the
 * route files import only behind the literal role guard).
 *
 * Token: one installation token per function instance per hour. It is requested
 * NARROWED to the one repository and to Contents / Pull requests / Issues write
 * (the App's own grant also includes Metadata read, MM55 S1). `@octokit/auth-app`
 * caches it for 59 minutes; the private key and token are never logged.
 */
import { createAppAuth } from '@octokit/auth-app';
import { Octokit } from '@octokit/rest';

import type { GithubConfig } from './config';
import { GithubError, type GithubClient } from './githubClient';

export const TOKEN_PERMISSIONS = { contents: 'write', pull_requests: 'write', issues: 'write' } as const;

const silentLog = { debug: () => {}, info: () => {}, warn: () => {}, error: () => {} };

type AppAuth = ReturnType<typeof createAppAuth>;
let cachedAuth: { key: string; auth: AppAuth } | null = null;

/** Test seam: route every HTTP call through `fetch` (no network in tests). */
export interface OctokitClientOptions {
  fetch?: typeof fetch;
}

function appAuth(config: GithubConfig, options: OctokitClientOptions): AppAuth {
  if (options.fetch) {
    return createAppAuth({ appId: config.appId, privateKey: config.privateKey, request: new Octokit({ request: { fetch: options.fetch }, log: silentLog }).request });
  }
  const key = `${config.appId}:${config.installationId}`;
  if (!cachedAuth || cachedAuth.key !== key) {
    cachedAuth = { key, auth: createAppAuth({ appId: config.appId, privateKey: config.privateKey }) };
  }
  return cachedAuth.auth;
}

async function installationOctokit(config: GithubConfig, options: OctokitClientOptions): Promise<Octokit> {
  let token: string;
  try {
    const result = await appAuth(config, options)({
      type: 'installation',
      installationId: config.installationId,
      repositoryNames: [config.repo],
      permissions: { ...TOKEN_PERMISSIONS },
    });
    token = result.token;
  } catch (error) {
    throw new GithubError(statusOf(error), 'installation token');
  }
  return new Octokit({
    auth: token,
    userAgent: 'mm-translator-workbench',
    log: silentLog,
    ...(options.fetch ? { request: { fetch: options.fetch } } : {}),
  });
}

function statusOf(error: unknown): number {
  const s = (error as { status?: unknown })?.status;
  return typeof s === 'number' ? s : 502;
}

async function call<T>(operation: string, run: () => Promise<T>): Promise<T> {
  try {
    return await run();
  } catch (error) {
    if (error instanceof GithubError) throw error;
    throw new GithubError(statusOf(error), operation);
  }
}

export async function createOctokitGithubClient(config: GithubConfig, options: OctokitClientOptions = {}): Promise<GithubClient> {
  const octokit = await installationOctokit(config, options);
  const repo = { owner: config.owner, repo: config.repo };
  return {
    getRef: (branch) =>
      call('getRef', async () => (await octokit.rest.git.getRef({ ...repo, ref: `heads/${branch}` })).data.object.sha),
    getCommitTree: (sha) =>
      call('getCommit', async () => (await octokit.rest.git.getCommit({ ...repo, commit_sha: sha })).data.tree.sha),
    getTree: (treeSha) =>
      call('getTree', async () => {
        const { data } = await octokit.rest.git.getTree({ ...repo, tree_sha: treeSha, recursive: 'true' });
        return {
          sha: data.sha,
          truncated: !!data.truncated,
          entries: data.tree
            .filter((e) => typeof e.path === 'string' && typeof e.sha === 'string')
            .map((e) => ({ path: e.path!, sha: e.sha!, type: e.type as 'blob' | 'tree' | 'commit', mode: e.mode ?? '' })),
        };
      }),
    getBlobContent: (sha) =>
      call('getBlob', async () => {
        const { data } = await octokit.rest.git.getBlob({ ...repo, file_sha: sha });
        return Buffer.from(data.content, data.encoding === 'base64' ? 'base64' : 'utf8').toString('utf8');
      }),
    createTree: (baseTree, files) =>
      call('createTree', async () => {
        const { data } = await octokit.rest.git.createTree({
          ...repo,
          base_tree: baseTree,
          tree: files.map((f) => ({ path: f.path, mode: '100644' as const, type: 'blob' as const, content: f.content })),
        });
        return data.sha;
      }),
    createCommit: (input) =>
      call('createCommit', async () => (await octokit.rest.git.createCommit({ ...repo, ...input })).data.sha),
    createRef: (branch, sha) =>
      call('createRef', async () => {
        try {
          await octokit.rest.git.createRef({ ...repo, ref: `refs/heads/${branch}`, sha });
          return true;
        } catch (error) {
          // 422 "Reference already exists" is the collision case.
          if (statusOf(error) === 422) return false;
          throw error;
        }
      }),
    pullsCreate: (input) =>
      call('pulls.create', async () => {
        const { data } = await octokit.rest.pulls.create({ ...repo, ...input, maintainer_can_modify: false });
        return { number: data.number, url: data.html_url };
      }),
    ensureLabels: (labels) =>
      call('labels', async () => {
        for (const l of labels) {
          try {
            await octokit.rest.issues.getLabel({ ...repo, name: l.name });
          } catch (error) {
            if (statusOf(error) !== 404) throw error;
            try {
              await octokit.rest.issues.createLabel({ ...repo, name: l.name, color: l.color, description: l.description });
            } catch (createError) {
              if (statusOf(createError) !== 422) throw createError; // 422: created concurrently
            }
          }
        }
      }),
    addLabels: (issueNumber, labels) =>
      call('addLabels', async () => {
        await octokit.rest.issues.addLabels({ ...repo, issue_number: issueNumber, labels });
      }),
    addAssignees: (issueNumber, assignees) =>
      call('addAssignees', async () => {
        await octokit.rest.issues.addAssignees({ ...repo, issue_number: issueNumber, assignees });
      }),
  };
}
