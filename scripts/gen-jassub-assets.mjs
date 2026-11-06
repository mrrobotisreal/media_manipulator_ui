#!/usr/bin/env node
/**
 * MM121: stages the JASSUB (libass in WebAssembly) caption renderer under public/jassub/<version>/
 * so the Darkroom preview loads it as plain static files, the same reason as
 * scripts/gen-gif-worker.mjs: Next 16's Turbopack build emits `new Worker(new URL(...))` targets
 * as untranspiled assets a browser cannot run, and jassub's worker imports bare specifiers.
 *
 *   public/jassub/<v>/jassub.js                  esbuild bundle of jassub/dist/jassub.js (ESM, main thread)
 *   public/jassub/<v>/worker.js                  esbuild bundle of jassub/dist/worker/worker.js (ESM)
 *   public/jassub/<v>/jassub-worker.wasm         copied (non-SIMD build)
 *   public/jassub/<v>/jassub-worker-modern.wasm  copied (SIMD build)
 *   public/jassub/<v>/LICENSE                    jassub MIT license (+ bundled deps' notices)
 *
 * lib/studio/captions/jassubPreview.ts imports jassub.js with a bundler-ignored dynamic import
 * only when captions are shown, so none of it (nor the ~2 MB WASM) is in any Next chunk. The
 * version folder makes the files immutable per release.
 *
 *   node scripts/gen-jassub-assets.mjs           (write)
 *   node scripts/gen-jassub-assets.mjs --check   (exit 1 when stale)
 * lib/studio/captions/jassubAssets.test.ts runs the check.
 */
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PKG = join(ROOT, 'node_modules', 'jassub');
export const VERSION = JSON.parse(readFileSync(join(PKG, 'package.json'), 'utf8')).version;
export const OUT_DIR = join(ROOT, 'public', 'jassub', VERSION);

export async function render() {
  const { build } = await import('esbuild');
  const bundle = async (entry) =>
    (await build({
      entryPoints: [entry],
      bundle: true,
      minify: true,
      format: 'esm',
      legalComments: 'none',
      target: 'es2022',
      platform: 'browser',
      write: false,
      absWorkingDir: ROOT,
      logLevel: 'silent',
    })).outputFiles[0].text;
  // Emscripten's pthread pool re-spawns the glue as module workers via
  // `new URL("jassub-worker.js", import.meta.url)`; point that at this bundle.
  const code = (await bundle(join(PKG, 'dist', 'worker', 'worker.js'))).replaceAll('"jassub-worker.js"', '"worker.js"');
  const main = await bundle(join(PKG, 'dist', 'jassub.js'));
  const pkg = JSON.parse(readFileSync(join(PKG, 'package.json'), 'utf8'));
  const banner = `// DO NOT EDIT. jassub@${VERSION}, bundled by scripts/gen-jassub-assets.mjs. License: see LICENSE next to this file.\n`;
  const license = [
    `jassub@${VERSION} (${pkg.homepage}), staged unmodified except for bundling its worker.`,
    `npm license field: ${pkg.license}`,
    '(the .wasm files are the upstream builds of libass and its dependencies, copied byte for byte)',
    '',
    readFileSync(join(PKG, 'LICENSE'), 'utf8').trim(),
    '',
  ].join('\n');
  return { 'jassub.js': banner + main, 'worker.js': banner + code, LICENSE: license };
}

function wasmFiles() {
  return readdirSync(join(PKG, 'dist', 'wasm')).filter((f) => f.endsWith('.wasm'));
}

async function main() {
  const files = await render();
  const check = process.argv.includes('--check');
  if (check) {
    let stale = !existsSync(OUT_DIR);
    for (const [name, body] of Object.entries(files)) {
      if (stale) break;
      stale = !existsSync(join(OUT_DIR, name)) || readFileSync(join(OUT_DIR, name), 'utf8') !== body;
    }
    for (const w of wasmFiles()) {
      if (stale) break;
      stale = !existsSync(join(OUT_DIR, w)) || !readFileSync(join(OUT_DIR, w)).equals(readFileSync(join(PKG, 'dist', 'wasm', w)));
    }
    if (stale) {
      console.error(`${OUT_DIR} is stale — run node scripts/gen-jassub-assets.mjs`);
      process.exit(1);
    }
    console.log('jassub assets up to date');
    return;
  }
  // One version folder only.
  const parent = join(ROOT, 'public', 'jassub');
  if (existsSync(parent)) for (const d of readdirSync(parent)) if (d !== VERSION) rmSync(join(parent, d), { recursive: true });
  mkdirSync(OUT_DIR, { recursive: true });
  for (const [name, body] of Object.entries(files)) writeFileSync(join(OUT_DIR, name), body);
  for (const w of wasmFiles()) copyFileSync(join(PKG, 'dist', 'wasm', w), join(OUT_DIR, w));
  console.log(`wrote ${OUT_DIR}`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
