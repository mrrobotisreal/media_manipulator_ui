#!/usr/bin/env node
/**
 * MM54: path guard for translation pull requests. Reads the PR's changed file
 * paths (newline-separated, from `git diff --name-only`) on stdin and exits 1
 * unless every path is a `.json` file under `i18n/locales/<dir>/` for exactly
 * ONE translator locale directory (a PR is one locale).
 *
 *   git diff --name-only "origin/main...HEAD" | node scripts/check-i18n-pr-paths.mjs
 *
 * The locale directories come from `i18n/locales.ts` (non-English codes,
 * lowercased), never a hand-written list. Runs on bare Node 24.
 */
import { loadLocales } from './lib/load-locales.mjs';

const PREFIX = 'i18n/locales/';

/**
 * Pure check, exported for tests.
 * @param {string[]} files changed paths
 * @param {string[]} localeDirs translator locale directories (e.g. `de-de`)
 * @returns {{ ok: boolean, localeDir: string | null, offending: string[], reason: string | null }}
 */
export function checkI18nPrPaths(files, localeDirs) {
  if (files.length === 0) {
    return { ok: false, localeDir: null, offending: [], reason: 'no changed files' };
  }
  const allowed = new Set(localeDirs);
  const offending = [];
  const dirs = new Set();
  for (const file of files) {
    const dir = localeDirOf(file, allowed);
    if (dir === null) offending.push(file);
    else dirs.add(dir);
  }
  if (offending.length > 0) {
    return {
      ok: false,
      localeDir: null,
      offending,
      reason: `changed files outside i18n/locales/<one translator locale>/**/*.json (${offending.length})`,
    };
  }
  if (dirs.size > 1) {
    return {
      ok: false,
      localeDir: null,
      offending: [],
      reason: `a translation PR must touch exactly one locale directory, found ${dirs.size}: ${[...dirs].sort().join(', ')}`,
    };
  }
  return { ok: true, localeDir: [...dirs][0], offending: [], reason: null };
}

/** The locale dir if `file` is an acceptable translator path, else null. */
function localeDirOf(file, allowed) {
  if (file.includes('\0') || file.includes('\\') || file.startsWith('/')) return null;
  const segments = file.split('/');
  if (segments.some((s) => s === '..' || s === '.' || s === '')) return null;
  if (!file.startsWith(PREFIX) || !file.endsWith('.json')) return null;
  const rest = segments.slice(2); // after "i18n", "locales"
  const dir = rest[0];
  if (rest.length < 2 || !allowed.has(dir)) return null;
  if (rest.join('/') === `${dir}/interface/metadata.json`) return null; // English-only shard
  return dir;
}

/** GitHub workflow-command escaping for the message part. */
export function escapeWorkflowData(s) {
  return s.replace(/%/g, '%25').replace(/\r/g, '%0D').replace(/\n/g, '%0A');
}

async function readStdin() {
  let data = '';
  process.stdin.setEncoding('utf8');
  for await (const chunk of process.stdin) data += chunk;
  return data;
}

const isMain = process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href;
if (isMain) {
  const { translatorLocales } = await loadLocales();
  const localeDirs = translatorLocales.map((l) => l.code.toLowerCase());
  const files = (await readStdin())
    .split('\n')
    .map((l) => l.replace(/\r$/, ''))
    .filter((l) => l.trim() !== '');
  const result = checkI18nPrPaths(files, localeDirs);
  if (result.ok) {
    console.log(`OK: ${files.length} changed file(s), all under ${PREFIX}${result.localeDir}/`);
  } else {
    console.error(`FAIL: ${result.reason}`);
    for (const p of result.offending) {
      console.error(`  offending: ${JSON.stringify(p)}`);
      if (process.env.GITHUB_ACTIONS === 'true') {
        console.log(`::error::${escapeWorkflowData(`Not allowed in a translation PR: ${p}`)}`);
      }
    }
    if (process.env.GITHUB_ACTIONS === 'true' && result.offending.length === 0 && result.reason) {
      console.log(`::error::${escapeWorkflowData(result.reason)}`);
    }
    process.exitCode = 1;
  }
}
