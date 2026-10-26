/**
 * MM54 handler test harness: env, deps with a fake GitHub + local JWKS + fake
 * clock, request builders. Throwaway App key (base64 PEM) generated locally.
 */
import { generateKeyPairSync } from 'node:crypto';

import type { Env } from '../config';
import { createFakeGithub, type FakeGithub } from './fakeGithub';
import type { HandlerDeps } from '../handlers';
import { createSubmitLimiter } from '../rateLimit';
import { NOW_S, PROJECT, type TestKeys } from './tokens';

const { privateKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });
export const TEST_APP_KEY_PEM = privateKey.export({ type: 'pkcs8', format: 'pem' }).toString();
export const TEST_APP_KEY_B64 = Buffer.from(TEST_APP_KEY_PEM).toString('base64');

export function testEnv(overrides: Env = {}): Env {
  return {
    NEXT_PUBLIC_DEPLOY_ROLE: 'translator',
    NEXT_PUBLIC_TRANSLATOR_LOCALE: 'de-DE',
    NEXT_PUBLIC_FB_PROJECT_ID: PROJECT,
    TRANSLATOR_EMAILS: ' someone@example.com , Translator@Example.com ',
    GITHUB_APP_ID: '123456',
    GITHUB_APP_INSTALLATION_ID: '7890123',
    GITHUB_APP_PRIVATE_KEY: TEST_APP_KEY_B64,
    GITHUB_REPO: 'mrrobotisreal/media_manipulator_ui',
    GITHUB_BASE_BRANCH: 'main',
    ...overrides,
  };
}

export interface Harness {
  deps: HandlerDeps;
  fake: FakeGithub;
  clock: { ms: number };
  logs: Array<{ message: string; detail: Record<string, unknown> }>;
  githubFactoryCalls: number;
}

export function harness(keys: TestKeys, files: Record<string, string>, env: Env = {}): Harness {
  const fake = createFakeGithub(files);
  const clock = { ms: NOW_S * 1000 };
  const logs: Harness['logs'] = [];
  const h: Harness = {
    fake,
    clock,
    logs,
    githubFactoryCalls: 0,
    deps: {
      env: testEnv(env),
      github: async () => {
        h.githubFactoryCalls++;
        return fake;
      },
      limiter: createSubmitLimiter({ windowMs: 10 * 60 * 1000, now: () => clock.ms }),
      baseCache: new Map(),
      jwks: keys.jwks,
      now: () => clock.ms,
      log: (message, detail) => logs.push({ message, detail }),
    },
  };
  return h;
}

export function get(path: string, token?: string): Request {
  return new Request(`https://de.translate.media-manipulator.com${path}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}

export function post(path: string, body: unknown, token?: string): Request {
  return new Request(`https://de.translate.media-manipulator.com${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}
