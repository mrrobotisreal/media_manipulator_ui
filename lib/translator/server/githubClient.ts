/**
 * The GitHub seam for the translator routes (MM54 decision 5; research §4).
 *
 * SERVER ONLY, TRANSLATOR DEPLOYMENTS ONLY. `GithubClient` is the interface the
 * handlers use; `createOctokitGithubClient` (in `octokitClient.ts`) implements it
 * with a GitHub App installation token, and tests inject `createFakeGithub()`
 * (`testing/fakeGithub.ts`), so no test touches the network.
 *
 * Errors: implementations throw `GithubError` with the HTTP status and a fixed
 * message. Octokit's own error (request URL and headers) never leaves the client.
 */

export interface TreeEntry {
  path: string;
  /** Blob SHA (files) or tree SHA (directories). */
  sha: string;
  type: 'blob' | 'tree' | 'commit';
  mode: string;
}

export interface NewTreeFile {
  path: string;
  content: string;
}

export interface GithubClient {
  /** Commit SHA a branch points at. */
  getRef(branch: string): Promise<string>;
  /** Tree SHA of a commit. */
  getCommitTree(commitSha: string): Promise<string>;
  /** Recursive tree listing. `truncated` = GitHub cut the listing short. */
  getTree(treeSha: string): Promise<{ sha: string; truncated: boolean; entries: TreeEntry[] }>;
  /** UTF-8 content of a blob. */
  getBlobContent(blobSha: string): Promise<string>;
  /** A new tree on top of `baseTree` (changed files only; every other file is kept). */
  createTree(baseTree: string, files: NewTreeFile[]): Promise<string>;
  createCommit(input: { message: string; tree: string; parents: string[] }): Promise<string>;
  /** Creates `refs/heads/<branch>`. `false` when the branch already exists (name collision). */
  createRef(branch: string, sha: string): Promise<boolean>;
  pullsCreate(input: { title: string; head: string; base: string; body: string }): Promise<{ number: number; url: string }>;
  /** Creates any missing label (name -> colour without `#`). */
  ensureLabels(labels: Array<{ name: string; color: string; description: string }>): Promise<void>;
  addLabels(issueNumber: number, labels: string[]): Promise<void>;
  addAssignees(issueNumber: number, assignees: string[]): Promise<void>;
}

export class GithubError extends Error {
  constructor(
    readonly status: number,
    readonly operation: string,
  ) {
    super(`GitHub ${operation} failed (HTTP ${status})`);
    this.name = 'GithubError';
  }
}
