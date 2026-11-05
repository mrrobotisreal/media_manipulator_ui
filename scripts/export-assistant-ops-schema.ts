/**
 * MM108: writes Medi's op JSON Schemas from the Zod vocabularies (lib/assistant/ops/*.ts).
 * Usage: npm run export:ops -- [--api <dir>] [--check]
 *   Writes lib/assistant/ops/schema/<surface>.json here and the byte-identical copy into the
 *   API (default ../media_manipulator_api/internal/assistant/ops/schema). --check writes nothing
 *   and exits 1 when either copy differs.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

import { API_OPS_SCHEMA_DIR, OPS_SCHEMA_DIR, buildOpsSchemaFiles } from '../lib/assistant/ops/schemaFiles';

const argv = process.argv.slice(2);
const i = argv.indexOf('--api');
const apiDir = resolve(i >= 0 && argv[i + 1] ? argv[i + 1] : join(process.cwd(), API_OPS_SCHEMA_DIR));
const uiDir = resolve(process.cwd(), OPS_SCHEMA_DIR);
const check = argv.includes('--check');
const files = buildOpsSchemaFiles();

const targets = [uiDir, ...(existsSync(resolve(apiDir, '..')) ? [apiDir] : [])];
if (targets.length === 1) console.warn(`export:ops: ${apiDir} not found (sibling API checkout absent); writing the UI copy only`);

let stale = 0;
for (const dir of targets) {
  for (const [name, body] of Object.entries(files)) {
    const p = join(dir, name);
    const same = existsSync(p) && readFileSync(p, 'utf8') === body;
    if (same) continue;
    stale += 1;
    if (check) {
      console.error(`export:ops --check: ${p} is stale`);
      continue;
    }
    mkdirSync(dir, { recursive: true });
    writeFileSync(p, body);
    console.log(`export:ops: wrote ${p}`);
  }
}
if (check && stale) process.exit(1);
if (!check && !stale) console.log('export:ops: up to date');
