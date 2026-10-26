/**
 * A fake `GithubClient` for MM54 tests: an in-memory repo (one branch head, a
 * flat blob map) that records every call in order. No network.
 */
import { createHash } from 'node:crypto';

import { GithubError, type GithubClient, type NewTreeFile, type TreeEntry } from '../githubClient';

export const WRITE_OPS = ['createTree', 'createCommit', 'createRef', 'pullsCreate', 'ensureLabels', 'addLabels', 'addAssignees'] as const;

export interface FakeCall {
  op: string;
  args: unknown[];
}

export const gitSha = (content: string) => createHash('sha1').update(`blob ${Buffer.byteLength(content)}\0${content}`).digest('hex');
const fakeSha = (seed: string) => createHash('sha1').update(seed).digest('hex');

export interface FakeGithub extends GithubClient {
  calls: FakeCall[];
  files: Map<string, string>;
  head: string;
  existingRefs: Set<string>;
  labels: Set<string>;
  /** Replace a file on main (moves the head). */
  commitOnMain(path: string, content: string): void;
  writeCalls(): FakeCall[];
  failOn: Partial<Record<string, number>>;
}

export function createFakeGithub(initial: Record<string, string>, options: { labels?: string[] } = {}): FakeGithub {
  const files = new Map(Object.entries(initial));
  let n = 0;
  const fake: FakeGithub = {
    calls: [],
    files,
    head: fakeSha('head-0'),
    existingRefs: new Set(),
    labels: new Set(options.labels ?? []),
    failOn: {},
    commitOnMain(path, content) {
      files.set(path, content);
      fake.head = fakeSha(`head-${++n}`);
    },
    writeCalls() {
      return fake.calls.filter((c) => (WRITE_OPS as readonly string[]).includes(c.op));
    },
    async getRef(branch) {
      record('getRef', branch);
      return fake.head;
    },
    async getCommitTree(sha) {
      record('getCommitTree', sha);
      return fakeSha(`tree-of-${sha}`);
    },
    async getTree(treeSha) {
      record('getTree', treeSha);
      const entries: TreeEntry[] = [...files].map(([path, content]) => ({ path, sha: gitSha(content), type: 'blob', mode: '100644' }));
      return { sha: treeSha, truncated: false, entries };
    },
    async getBlobContent(sha) {
      record('getBlobContent', sha);
      for (const content of files.values()) if (gitSha(content) === sha) return content;
      throw new GithubError(404, 'getBlob');
    },
    async createTree(baseTree, treeFiles: NewTreeFile[]) {
      record('createTree', baseTree, treeFiles);
      return fakeSha(`new-tree-${baseTree}-${treeFiles.map((f) => f.path).join(',')}`);
    },
    async createCommit(input) {
      record('createCommit', input);
      return fakeSha(`commit-${input.tree}`);
    },
    async createRef(branch, sha) {
      record('createRef', branch, sha);
      if (fake.existingRefs.has(branch)) return false;
      fake.existingRefs.add(branch);
      return true;
    },
    async pullsCreate(input) {
      record('pullsCreate', input);
      return { number: 42, url: 'https://github.com/mrrobotisreal/media_manipulator_ui/pull/42' };
    },
    async ensureLabels(labels) {
      record('ensureLabels', labels);
      for (const l of labels) fake.labels.add(l.name);
    },
    async addLabels(issue, labels) {
      record('addLabels', issue, labels);
    },
    async addAssignees(issue, assignees) {
      record('addAssignees', issue, assignees);
    },
  };
  function record(op: string, ...args: unknown[]) {
    fake.calls.push({ op, args });
    const status = fake.failOn[op];
    if (status) throw new GithubError(status, op);
  }
  return fake;
}
