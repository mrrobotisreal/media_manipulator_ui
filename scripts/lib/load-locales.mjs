/**
 * Loads `i18n/locales.ts` from a plain Node 24 script, with no build step.
 *
 * Node 24 strips TypeScript types natively, so the file imports as-is. That is
 * why `locales.ts` must stay erasable-syntax only (no enums, no namespaces, no
 * parameter properties) and dependency-free. The one noise source is Node's
 * MODULE_TYPELESS_PACKAGE_JSON warning (the repo's package.json has no
 * `"type"`), which would pollute the stdout/stderr that CI scripts parse, so
 * it is filtered here and nowhere else.
 */
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

let filtered = false;
function filterTypelessWarning() {
  if (filtered) return;
  filtered = true;
  const emit = process.emitWarning;
  process.emitWarning = function (warning, ...rest) {
    const opt = rest[0];
    const code = typeof opt === 'object' && opt !== null ? opt.code : rest[1];
    if (code === 'MODULE_TYPELESS_PACKAGE_JSON') return;
    return emit.call(this, warning, ...rest);
  };
}

/** @returns {Promise<typeof import('../../i18n/locales.ts')>} */
export async function loadLocales(root = repoRoot) {
  filterTypelessWarning();
  return import(pathToFileURL(join(root, 'i18n', 'locales.ts')).href);
}
