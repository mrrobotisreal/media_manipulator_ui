/**
 * The submit path allowlist (MM54 decision 6d; research §4: no GitHub token
 * scope is path-aware, so this check and the `i18n-pr-guard` workflow are the
 * real controls).
 *
 * A change's `file` must be exactly `i18n/locales/<the deployment's dir>/<...>.json`:
 * no `..`, no leading `/`, no backslash, no NUL, no empty or dot segments,
 * unchanged by `path.posix.normalize`, and never `interface/metadata.json`
 * (English-only shard). Anything else is refused BEFORE any GitHub call.
 */
import { posix } from 'node:path';

const SAFE_TAIL = /^[A-Za-z0-9_./-]+\.json$/;

export function isAllowedLocalePath(file: unknown, localeDir: string): boolean {
  if (typeof file !== 'string' || file.length === 0 || file.length > 200) return false;
  if (!/^[a-z]{2,3}(-[a-z0-9]{2,8})?$/.test(localeDir) || localeDir === 'en-us') return false;
  if (file.includes('\\') || file.includes('\0') || file.startsWith('/')) return false;
  const prefix = `i18n/locales/${localeDir}/`;
  if (!file.startsWith(prefix)) return false;
  const tail = file.slice(prefix.length);
  if (!SAFE_TAIL.test(tail)) return false;
  const segments = file.split('/');
  if (segments.some((s) => s === '' || s === '.' || s === '..' || s.startsWith('.'))) return false;
  const normalized = posix.normalize(file);
  if (normalized !== file || !normalized.startsWith(prefix)) return false;
  if (tail === 'interface/metadata.json') return false;
  return true;
}

/** The en-US counterpart of an allowed locale file (validators need the source). */
export function englishPathFor(file: string, localeDir: string): string {
  return `i18n/locales/en-us/${file.slice(`i18n/locales/${localeDir}/`.length)}`;
}
