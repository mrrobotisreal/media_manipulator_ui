/**
 * The `POST /api/translator/submit` contract (MM54 decision 6, design §2.14).
 *
 * Zero imports, so the browser modal (`components/translator/submit-modal.tsx`)
 * and the Node route (`lib/translator/server/submit.ts`) share one definition.
 *
 *   POST /api/translator/submit[?dryRun=1]
 *   Authorization: Bearer <Firebase ID token>
 *   body SubmitRequest (JSON, <= 1 MB)
 *
 *   200 SubmitSuccess              the PR is open
 *   200 DryRunResponse             `?dryRun=1`: conflicts + warnings, nothing written
 *   400 { error, ... }             invalid body; `path_not_allowed` lists the paths
 *   401 { error: 'unauthorized' }  missing / invalid token
 *   403 { error: 'forbidden' }     not allowlisted or email not verified
 *   409 { error: 'conflicts', conflicts }    unconfirmed upstream conflicts
 *   413 { error: 'body_too_large' }
 *   422 { error: 'unacknowledged_warnings', warnings }
 *   429 { error: 'rate_limited', retryAfter }  + `Retry-After` header (seconds)
 *   5xx { error }                  misconfigured deployment / GitHub failure; drafts are kept
 *
 * Deviations from the ticket body (design §7 MM54): `baseValue`, `seenOn`,
 * `acknowledged` as proposed; `confirmConflicts` is the LIST of conflict ids the
 * translator chose "Keep my version" for (not a boolean), so a conflict that
 * appears between the pre-flight and the submit is never confirmed blindly.
 */

export const TRANSLATOR_SUBMIT_PATH = '/api/translator/submit';

export const DESCRIPTION_MIN = 10;
export const DESCRIPTION_MAX = 2000;
export const MAX_CHANGES = 2000;
export const MAX_VALUE_CHARS = 20_000;
export const MAX_KEY_CHARS = 300;
export const MAX_BODY_BYTES = 1_000_000;
export const MAX_SEEN_ON = 5;
export const MAX_SEEN_PATH_CHARS = 300;
/** One real submit per user per window (best-effort, per function instance). */
export const SUBMIT_WINDOW_MS = 10 * 60 * 1000;

export interface SubmitChange {
  /** Repo path `i18n/locales/<locale dir>/<shard>.json`. */
  file: string;
  /** The dotted i18next key (`a.b.c`, `items.0.title`, `foo_few`), as in the panel. */
  key: string;
  value: string;
  /** The value the draft was started from ('' for a new key). */
  baseValue: string;
  /** Pathnames (`/de/tools/x`) where the key was seen in this session. */
  seenOn?: string[];
}

export interface SubmitRequest {
  locale: string;
  description: string;
  changes: SubmitChange[];
  base: { sha: string; files: Record<string, string> };
  /** Warning ids (`${key}#${code}`) the translator acknowledged. */
  acknowledged: string[];
  /** Conflict ids (`conflictId(file, key)`) the translator chose "Keep my version" for. */
  confirmConflicts: string[];
}

export interface SubmitConflict {
  id: string;
  file: string;
  key: string;
  /** The value the translator started from. */
  base: string;
  /** The value on `main` now (null: the key is gone from main). */
  theirs: string | null;
  mine: string;
}

export interface SubmitWarning {
  id: string;
  code: string;
  key: string;
  message: string;
}

export interface DryRunResponse {
  dryRun: true;
  conflicts: SubmitConflict[];
  warnings: SubmitWarning[];
  files: number;
  changed: number;
}

export interface SubmitSuccess {
  prUrl: string;
  prNumber: number;
  branch: string;
  files: number;
  changed: number;
}

export type SubmitErrorCode =
  | 'not_found'
  | 'unauthorized'
  | 'forbidden'
  | 'invalid_body'
  | 'body_too_large'
  | 'wrong_locale'
  | 'description_invalid'
  | 'path_not_allowed'
  | 'too_many_changes'
  | 'value_too_long'
  | 'duplicate_change'
  | 'file_not_found'
  | 'key_unknown'
  | 'no_changes'
  | 'conflicts'
  | 'unacknowledged_warnings'
  | 'rate_limited'
  | 'misconfigured'
  | 'github_error';

export function conflictId(file: string, key: string): string {
  return `${file}|${key}`;
}
