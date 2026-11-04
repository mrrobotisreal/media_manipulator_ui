/**
 * MM105: writes Medi's knowledge base into the API repo from the site's registries.
 * Usage: npm run export:medi -- [--out <dir>] [--check]
 *   (default out: ../media_manipulator_api/internal/assistant/knowledge)
 *
 * - Every file from lib/assistant/knowledgeExport.ts buildMediKnowledge() is written.
 * - Every other file under the target is deleted (stale docs), then empty dirs pruned.
 * - --check writes nothing and exits 1 when the target differs (stale export).
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';

import { MEDI_KNOWLEDGE_DIR, buildMediKnowledge } from '../lib/assistant/knowledgeExport';

const argv = process.argv.slice(2);
const i = argv.indexOf('--out');
const out = resolve(i >= 0 && argv[i + 1] ? argv[i + 1] : join(process.cwd(), MEDI_KNOWLEDGE_DIR));
const check = argv.includes('--check');

function walk(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

const files = buildMediKnowledge();
const keep = new Set(Object.keys(files));
const existing = walk(out).map((p) => relative(out, p));
const stale = existing.filter((rel) => !keep.has(rel));
const changed = Object.entries(files).filter(([rel, body]) => {
  const p = join(out, rel);
  return !existsSync(p) || readFileSync(p, 'utf8') !== body;
});

if (check) {
  if (stale.length || changed.length) {
    console.error(`export:medi --check: ${changed.length} changed, ${stale.length} stale under ${out}; run npm run export:medi`);
    process.exit(1);
  }
  console.log(`export:medi --check: ${keep.size} files up to date`);
  process.exit(0);
}

for (const rel of stale) rmSync(join(out, rel));
const pruneEmpty = (dir: string): boolean => {
  if (!existsSync(dir)) return true;
  const empty = readdirSync(dir).every((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? pruneEmpty(p) : false;
  });
  if (empty && dir !== out) rmSync(dir, { recursive: true });
  return empty;
};
for (const [rel, body] of changed) {
  const p = join(out, rel);
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, body);
}
pruneEmpty(out);
const bytes = Object.values(files).reduce((n, b) => n + Buffer.byteLength(b), 0);
console.log(`export:medi: ${keep.size} files (${(bytes / 1024).toFixed(0)} KB) → ${out}; ${changed.length} written, ${stale.length} removed`);
