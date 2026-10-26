#!/usr/bin/env node
/**
 * Prints the translator locales from `i18n/locales.ts` (every non-English
 * locale), so workflows and setup scripts never hand-list locales (MM51).
 *
 *   node scripts/list-locales.mjs           one URL prefix per line (de, pt-br, …)
 *   node scripts/list-locales.mjs --json    JSON array of prefixes (GitHub Actions matrix)
 *   node scripts/list-locales.mjs --codes   prefix=code per line (pt-br=pt-BR)
 *   node scripts/list-locales.mjs --matrix  GitHub Actions matrix {"include":[{prefix,hook}]}
 *                                           where hook is the deploy-hook secret name
 *
 * A prefix is also the branch suffix (`translate/<prefix>`) and the DNS label
 * (`<prefix>.translate.media-manipulator.com`). Runs on bare Node 24.
 */
import { loadLocales } from './lib/load-locales.mjs';

/** Deploy-hook secret name for a prefix: `pt-br` -> `VERCEL_DEPLOY_HOOK_PT_BR`. */
export function hookSecretName(prefix) {
  return `VERCEL_DEPLOY_HOOK_${prefix.toUpperCase().replace(/-/g, '_')}`;
}

/** Pure formatter, exported for tests. */
export function format(translatorLocales, argv = []) {
  if (argv.includes('--json')) return JSON.stringify(translatorLocales.map((l) => l.prefix));
  if (argv.includes('--matrix')) {
    return JSON.stringify({ include: translatorLocales.map((l) => ({ prefix: l.prefix, hook: hookSecretName(l.prefix) })) });
  }
  if (argv.includes('--codes')) return translatorLocales.map((l) => `${l.prefix}=${l.code}`).join('\n');
  return translatorLocales.map((l) => l.prefix).join('\n');
}

const isMain = process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href;
if (isMain) {
  const { translatorLocales } = await loadLocales();
  process.stdout.write(`${format(translatorLocales, process.argv.slice(2))}\n`);
}
