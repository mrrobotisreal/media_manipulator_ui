/**
 * Process-wide wiring for `app/api/translator/*` (MM54).
 *
 * SERVER ONLY, TRANSLATOR DEPLOYMENTS ONLY: each route file imports this module
 * with a dynamic `import()` inside the literal
 * `process.env.NEXT_PUBLIC_DEPLOY_ROLE === 'translator'` guard, so a production
 * build folds the import away and never bundles `jose` or `@octokit/*`.
 *
 * Env is read with literal property accesses (build-time-inlined where Next
 * inlines them, runtime otherwise) and handed to the handlers as a plain object.
 */
import { SUBMIT_WINDOW_MS } from '../submitContract';
import type { Env } from './config';
import { handleBase, handleMe, handleSubmit, type HandlerDeps } from './handlers';
import { createOctokitGithubClient } from './octokitClient';
import { createSubmitLimiter } from './rateLimit';

/** Build-artifact sentinel for `npm run check:no-translator` (kept reachable below). */
export const TRANSLATOR_SERVER_SENTINEL = '__MM_TRANSLATOR_SERVER__';

function env(): Env {
  return {
    NEXT_PUBLIC_DEPLOY_ROLE: process.env.NEXT_PUBLIC_DEPLOY_ROLE,
    NEXT_PUBLIC_TRANSLATOR_LOCALE: process.env.NEXT_PUBLIC_TRANSLATOR_LOCALE,
    NEXT_PUBLIC_FB_PROJECT_ID: process.env.NEXT_PUBLIC_FB_PROJECT_ID,
    TRANSLATOR_EMAILS: process.env.TRANSLATOR_EMAILS,
    GITHUB_APP_ID: process.env.GITHUB_APP_ID,
    GITHUB_APP_INSTALLATION_ID: process.env.GITHUB_APP_INSTALLATION_ID,
    GITHUB_APP_PRIVATE_KEY: process.env.GITHUB_APP_PRIVATE_KEY,
    GITHUB_REPO: process.env.GITHUB_REPO,
    GITHUB_BASE_BRANCH: process.env.GITHUB_BASE_BRANCH,
  };
}

const limiter = createSubmitLimiter({ windowMs: SUBMIT_WINDOW_MS });
const baseCache: HandlerDeps['baseCache'] = new Map();

function deps(): HandlerDeps {
  if (TRANSLATOR_SERVER_SENTINEL.length === 0) throw new Error('unreachable');
  // Env is re-read per request (cheap) so nothing secret is held in module scope.
  return { env: env(), github: createOctokitGithubClient, limiter, baseCache };
}

export const routeMe = (request: Request) => handleMe(request, deps());
export const routeBase = (request: Request) => handleBase(request, deps());
export const routeSubmit = (request: Request) => handleSubmit(request, deps());
