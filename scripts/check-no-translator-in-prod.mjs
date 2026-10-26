#!/usr/bin/env node
/**
 * MM52: proves a production build contains no translator-workbench code.
 *
 * Run after `npm run build`:  npm run check:no-translator
 *
 * Scans the build output that is SHIPPED or EXECUTED (`.next/static/**` and
 * `.next/server/**` .js/.html/.rsc/.json/.body, source maps excluded because
 * they quote source text, including comments, and are never served) for:
 *
 *   - `__MM_TRANSLATOR_SENTINEL__`   exported only by lib/translator/keyMarker.ts
 *   - `__MM_TRANSLATOR_CODEC__`      only in lib/translator/markerCodec.ts (the encoder)
 *   - `__mmTranslatorMarkerRuntime`  the runtime slot keyMarker.ts registers into
 *   - a key-marker terminator run    eight U+200D + U+200C, the encoder's output
 *                                    (raw or as \u escapes) in prerendered pages
 *   - `__MM_TRANSLATOR_SERVER__`     only in lib/translator/server/routes.ts (MM54
 *                                    route wiring: GitHub App, token checks)
 *   - `jose` / `@octokit/*` code     MM54's dependencies, which only translator
 *                                    route handlers load: `ERR_JWKS_NO_MATCHING_KEY`
 *                                    (jose), `octokit-core.js` / `octokit-rest.js`
 *                                    (Octokit user agents), `universal-github-app-jwt`
 *                                    (App JWT signer). Server chunks included: a
 *                                    production build must hold none of them.
 *
 * Exit 0 = clean. Exit 1 = translator code or markers found (lists where), or
 * no build to scan. A build made with NEXT_PUBLIC_DEPLOY_ROLE=translator is
 * expected to FAIL this check; that is its purpose.
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const ROOT = process.cwd();
const NEXT = join(ROOT, process.argv.includes('--dir') ? process.argv[process.argv.indexOf('--dir') + 1] : '.next');
const SCAN = ['static', 'server'].map((d) => join(NEXT, d));
const EXT = /\.(js|mjs|cjs|html|rsc|json|body|txt|xml)$/;

const NEEDLES = [
  ['sentinel', '__MM_TRANSLATOR_SENTINEL__'],
  ['marker encoder', '__MM_TRANSLATOR_CODEC__'],
  ['marker runtime slot', '__mmTranslatorMarkerRuntime'],
  ['key-marker terminator (raw)', '‍'.repeat(8) + '‌'],
  ['key-marker terminator (escaped)', '\\u200D'.repeat(8) + '\\u200C'],
  ['key-marker terminator (escaped, lower)', '\\u200d'.repeat(8) + '\\u200c'],
  ['translator server routes', '__MM_TRANSLATOR_SERVER__'],
  ['jose', 'ERR_JWKS_NO_MATCHING_KEY'],
  ['@octokit/core', 'octokit-core.js'],
  ['@octokit/rest', 'octokit-rest.js'],
  ['@octokit/auth-app JWT', 'universal-github-app-jwt'],
];

function* walk(dir) {
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return;
  }
  for (const name of entries) {
    const abs = join(dir, name);
    const st = statSync(abs);
    if (st.isDirectory()) yield* walk(abs);
    else if (EXT.test(name)) yield abs;
  }
}

/** Pure: the needles found in one file's text. Exported for the unit test. */
export function findTranslatorTraces(text) {
  return NEEDLES.filter(([, needle]) => text.includes(needle)).map(([label]) => label);
}

function main() {
  if (!existsSync(join(NEXT, 'BUILD_ID'))) {
    console.error(`check:no-translator: no build at ${relative(ROOT, NEXT) || NEXT} (run \`npm run build\` first).`);
    process.exit(1);
  }
  const hits = [];
  let scanned = 0;
  for (const dir of SCAN) {
    for (const abs of walk(dir)) {
      scanned++;
      const found = findTranslatorTraces(readFileSync(abs, 'utf8'));
      if (found.length) hits.push(`${relative(ROOT, abs).split(sep).join('/')}: ${found.join(', ')}`);
    }
  }
  if (hits.length) {
    console.error(`✗ Translator code found in the build (${hits.length} of ${scanned} files):`);
    for (const h of hits.slice(0, 25)) console.error(`  ${h}`);
    if (hits.length > 25) console.error(`  … and ${hits.length - 25} more`);
    console.error('A production build must not contain lib/translator code, jose or @octokit. Was NEXT_PUBLIC_DEPLOY_ROLE=translator set,');
    console.error('or was a translator module imported outside the literal role guard (see lib/translator/mode.ts and app/api/translator/*)?');
    process.exit(1);
  }
  console.log(`✓ No translator code in the build (${scanned} files scanned in .next/static and .next/server).`);
}

if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) main();
