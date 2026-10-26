/**
 * Server configuration for the translator routes (MM54 decisions 1, 3, 5).
 *
 * SERVER ONLY, TRANSLATOR DEPLOYMENTS ONLY. Imported by `app/api/translator/*`
 * route handlers, and only dynamically, after the literal role guard, so
 * production server bundles never evaluate it and no client bundle can.
 *
 * Every env var is read on demand, never at module load, and never logged.
 * Names (values live only in Vercel, branch-scoped Preview env; MM55 S6):
 *   NEXT_PUBLIC_DEPLOY_ROLE          'translator' (build-time, see next.config.ts)
 *   NEXT_PUBLIC_TRANSLATOR_LOCALE    e.g. 'de-DE' (build-time)
 *   NEXT_PUBLIC_FB_PROJECT_ID        Firebase project id (issuer/audience)
 *   TRANSLATOR_EMAILS                comma-separated allowlist (server)
 *   GITHUB_APP_ID, GITHUB_APP_INSTALLATION_ID, GITHUB_APP_PRIVATE_KEY (base64 PEM),
 *   GITHUB_REPO ('owner/name'), GITHUB_BASE_BRANCH ('main')
 */
import { translatorLocales } from '@/i18n/locales';

export type Env = Record<string, string | undefined>;

export interface TranslatorLocaleInfo {
  /** Registered spelling, `de-DE`. */
  code: string;
  /** URL / branch prefix, `de`, `pt-br`. */
  prefix: string;
  /** Shard directory, `de-de`. */
  dir: string;
}

/** The deployment's translator locale, validated against `translatorLocales`. */
export function deploymentLocale(env: Env): TranslatorLocaleInfo | null {
  const raw = (env.NEXT_PUBLIC_TRANSLATOR_LOCALE ?? '').trim().toLowerCase();
  if (!raw) return null;
  const l = translatorLocales.find((x) => x.code.toLowerCase() === raw);
  return l ? { code: l.code, prefix: l.prefix, dir: l.code.toLowerCase() } : null;
}

export function firebaseProjectId(env: Env): string | null {
  const id = (env.NEXT_PUBLIC_FB_PROJECT_ID ?? '').trim();
  return /^[a-z0-9-]{4,63}$/.test(id) ? id : null;
}

/** Trimmed, lowercased, de-duplicated. Empty or unset => nobody. */
export function parseAllowlist(raw: string | undefined): Set<string> {
  const out = new Set<string>();
  for (const part of (raw ?? '').split(',')) {
    const e = part.trim().toLowerCase();
    if (e) out.add(e);
  }
  return out;
}

export function isAllowlisted(email: string, env: Env): boolean {
  const list = parseAllowlist(env.TRANSLATOR_EMAILS);
  return list.size > 0 && list.has(email.trim().toLowerCase());
}

export interface GithubConfig {
  appId: string;
  installationId: number;
  privateKey: string;
  owner: string;
  repo: string;
  baseBranch: string;
}

/**
 * The GitHub App settings, or the NAMES of what is missing/invalid (never values).
 * `GITHUB_APP_PRIVATE_KEY` is a base64-encoded PEM (MM55 S2).
 */
export function githubConfig(env: Env): { ok: true; config: GithubConfig } | { ok: false; problems: string[] } {
  const problems: string[] = [];
  const appId = (env.GITHUB_APP_ID ?? '').trim();
  if (!/^\d+$/.test(appId)) problems.push('GITHUB_APP_ID');
  const inst = (env.GITHUB_APP_INSTALLATION_ID ?? '').trim();
  if (!/^\d+$/.test(inst)) problems.push('GITHUB_APP_INSTALLATION_ID');
  let privateKey = '';
  try {
    privateKey = Buffer.from((env.GITHUB_APP_PRIVATE_KEY ?? '').trim(), 'base64').toString('utf8');
  } catch {
    privateKey = '';
  }
  if (!/^-----BEGIN [A-Z ]*PRIVATE KEY-----/.test(privateKey.trim())) problems.push('GITHUB_APP_PRIVATE_KEY');
  const repoFull = (env.GITHUB_REPO ?? '').trim();
  const m = /^([A-Za-z0-9-]{1,39})\/([A-Za-z0-9._-]{1,100})$/.exec(repoFull);
  if (!m) problems.push('GITHUB_REPO');
  const baseBranch = (env.GITHUB_BASE_BRANCH ?? '').trim() || 'main';
  if (!/^[A-Za-z0-9._/-]{1,100}$/.test(baseBranch) || baseBranch.includes('..')) problems.push('GITHUB_BASE_BRANCH');
  if (problems.length) return { ok: false, problems };
  return {
    ok: true,
    config: { appId, installationId: Number(inst), privateKey, owner: m![1], repo: m![2], baseBranch },
  };
}
