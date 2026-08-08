import { spawnSync } from 'node:child_process';
import { createReadStream, existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { createServer, type Server } from 'node:http';
import { basename, extname, join, normalize, resolve } from 'node:path';
import esbuild from 'esbuild';
import { chromium, type Browser } from 'playwright-core';
import { runCompare } from './compare';
import type { GoldenFile, GoldenVariantKey } from './goldenTypes';

/**
 * Parity-harness orchestrator (ADR ws/0002, part 13). WORKSTATION-ONLY — this
 * never runs on the laptop; see README.md for the bring-up checklist.
 *
 *   npm run parity            # fixture check → WebGL capture → ffmpeg render → compare
 *   npm run parity -- --fallback           # SwiftShader instead of NVIDIA GL
 *   npm run parity -- --scenario lut_full  # subset (comma-separated ids)
 *   npm run parity -- --skip-capture --skip-render   # re-compare existing frames
 *
 * Chromium configuration comes verbatim from research ticket 02
 * (.scratch/darkroom-v3/issues/02-…md): full Chromium via channel 'chromium'
 * in new-headless mode with the ANGLE GL-EGL device path, and a mandatory
 * UNMASKED_RENDERER_WEBGL assertion — frames from an unknown rasterizer are
 * never compared.
 */

interface Args {
  fallback: boolean;
  skipCapture: boolean;
  skipRender: boolean;
  skipCompare: boolean;
  scenarios: string[];
  apiDir: string;
}

const HARNESS_DIR = resolve(__dirname);
const UI_ROOT = resolve(HARNESS_DIR, '..');
const FIXTURES_DIR = join(HARNESS_DIR, 'fixtures');
const GOLDENS_DIR = join(HARNESS_DIR, 'goldens');
const OUT_DIR = join(HARNESS_DIR, 'out');
const BUNDLE_PATH = join(OUT_DIR, '.build', 'capture.js');

function parseArgs(argv: string[]): Args {
  const args: Args = {
    fallback: false,
    skipCapture: false,
    skipRender: false,
    skipCompare: false,
    scenarios: [],
    apiDir: process.env.MM_API_DIR ?? resolve(UI_ROOT, '..', 'media_manipulator_api'),
  };
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === '--fallback') args.fallback = true;
    else if (a === '--skip-capture') args.skipCapture = true;
    else if (a === '--skip-render') args.skipRender = true;
    else if (a === '--skip-compare') args.skipCompare = true;
    else if (a === '--scenario') args.scenarios.push(...(argv[++i] ?? '').split(',').filter(Boolean));
    else if (a === '--api-dir') args.apiDir = resolve(argv[++i] ?? '');
    else throw new Error(`unknown flag: ${a}`);
  }
  return args;
}

function loadGoldens(filter: string[]): Map<string, GoldenFile> {
  const out = new Map<string, GoldenFile>();
  for (const f of readdirSync(GOLDENS_DIR).filter((f) => f.endsWith('.json')).sort()) {
    const id = basename(f, '.json');
    if (filter.length > 0 && !filter.includes(id)) continue;
    out.set(id, JSON.parse(readFileSync(join(GOLDENS_DIR, f), 'utf8')) as GoldenFile);
  }
  if (out.size === 0) throw new Error('no golden scenarios matched');
  return out;
}

function checkFixtures(goldens: Map<string, GoldenFile>): void {
  const missing = new Set<string>();
  for (const g of goldens.values()) {
    for (const asset of Object.values(g.assets)) {
      if (!existsSync(join(FIXTURES_DIR, asset.file))) missing.add(asset.file);
    }
  }
  if (missing.size > 0) {
    throw new Error(
      `missing fixtures: ${[...missing].join(', ')} — run parity-harness/make-fixtures.sh (requires ffmpeg)`,
    );
  }
}

// --- static file server (fixtures + capture page + bundle) -----------------

const MIME: Record<string, string> = {
  '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json',
  '.mp4': 'video/mp4', '.m4a': 'audio/mp4', '.cube': 'text/plain', '.png': 'image/png',
  '.woff2': 'font/woff2', '.ttf': 'font/ttf',
};

// Title fonts (part 16) live in the app's public dir, outside HARNESS_DIR —
// /fonts/studio/* maps there so title goldens raster with the shipped faces.
const FONTS_DIR = normalize(join(HARNESS_DIR, '..', 'public', 'fonts', 'studio'));

function serveHarness(): Promise<{ server: Server; base: string }> {
  const server = createServer((req, res) => {
    const url = new URL(req.url ?? '/', 'http://x');
    const pathname = decodeURIComponent(url.pathname);
    const path = pathname.startsWith('/fonts/studio/')
      ? normalize(join(FONTS_DIR, pathname.slice('/fonts/studio/'.length)))
      : normalize(join(HARNESS_DIR, pathname));
    const rootOk = path.startsWith(HARNESS_DIR) || path.startsWith(FONTS_DIR);
    if (!rootOk || !existsSync(path) || !statSync(path).isFile()) {
      res.writeHead(404).end();
      return;
    }
    const size = statSync(path).size;
    const type = MIME[extname(path)] ?? 'application/octet-stream';
    const range = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range ?? '');
    if (range && (range[1] || range[2])) {
      // Minimal Range support — Chromium's media stack expects it for seeks.
      const start = range[1] ? parseInt(range[1], 10) : Math.max(0, size - parseInt(range[2], 10));
      const end = range[1] && range[2] ? Math.min(parseInt(range[2], 10), size - 1) : size - 1;
      res.writeHead(206, {
        'Content-Type': type,
        'Content-Range': `bytes ${start}-${end}/${size}`,
        'Content-Length': end - start + 1,
        'Accept-Ranges': 'bytes',
      });
      createReadStream(path, { start, end }).pipe(res);
    } else {
      res.writeHead(200, { 'Content-Type': type, 'Content-Length': size, 'Accept-Ranges': 'bytes' });
      createReadStream(path).pipe(res);
    }
  });
  return new Promise((resolveServer) => {
    server.listen(0, '127.0.0.1', () => {
      const addr = server.address();
      const port = typeof addr === 'object' && addr ? addr.port : 0;
      resolveServer({ server, base: `http://127.0.0.1:${port}` });
    });
  });
}

// --- capture (WebGL leg) ----------------------------------------------------

async function buildCaptureBundle(): Promise<void> {
  await esbuild.build({
    entryPoints: [join(HARNESS_DIR, 'capture', 'capture-main.ts')],
    bundle: true,
    outfile: BUNDLE_PATH,
    format: 'iife',
    platform: 'browser',
    target: 'chrome120',
    plugins: [
      {
        name: 'mm-alias',
        setup(build) {
          // The capture bundle must not drag the auth/analytics stack in via
          // previewEngine's backend import — stub it (see capture/backendStub.ts).
          build.onResolve({ filter: /^@\/lib\/studio\/studioBackend$/ }, () => ({
            path: join(HARNESS_DIR, 'capture', 'backendStub.ts'),
          }));
          // '@/…' → UI repo root (mirrors tsconfig paths).
          build.onResolve({ filter: /^@\// }, (args) =>
            build.resolve('./' + args.path.slice(2), { kind: args.kind, resolveDir: UI_ROOT }),
          );
        },
      },
    ],
  });
}

function chromiumArgs(fallback: boolean): string[] {
  const common = [
    '--force-color-profile=srgb',
    '--force-device-scale-factor=1',
    '--window-size=1920,1080',
    '--hide-scrollbars',
    // Autoplay policy is irrelevant (videos stay paused), but muted videos
    // must not be throttled in the background page.
    '--disable-background-timer-throttling',
  ];
  if (process.env.PARITY_CONTAINER === '1') {
    common.push('--no-sandbox', '--disable-dev-shm-usage');
  }
  if (fallback) {
    return [...common, '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'];
  }
  return [
    ...common,
    // The load-bearing pair for the NVIDIA EGL-device path (no display server).
    '--use-gl=angle',
    '--use-angle=gl-egl',
    '--enable-gpu',
    '--ignore-gpu-blocklist',
  ];
}

async function capture(goldens: Map<string, GoldenFile>, fallback: boolean): Promise<void> {
  await buildCaptureBundle();
  const { server, base } = await serveHarness();
  let browser: Browser | null = null;
  try {
    browser = await chromium.launch({
      channel: 'chromium', // full Chromium, NOT the headless shell — GPU flags apply (Playwright ≥1.49)
      headless: true,
      args: chromiumArgs(fallback),
    });
    const page = await browser.newPage();
    page.setDefaultTimeout(120_000);
    await page.goto(`${base}/capture/capture-page.html`);
    await page.waitForFunction(() => !!window.__parity);

    // Mandatory rasterizer assertion (research ticket 02): Chromium falls back
    // to SwiftShader SILENTLY — never compare frames from an unknown renderer.
    const renderer = await page.evaluate(() => window.__parity.renderer());
    const want = fallback ? /SwiftShader/i : /NVIDIA/i;
    if (!want.test(renderer)) {
      throw new Error(
        `UNMASKED_RENDERER_WEBGL is '${renderer}' but ${fallback ? 'SwiftShader (--fallback)' : 'NVIDIA'} was required. ` +
          `Check the host prerequisites in parity-harness/README.md (driver + libnvidia-gl + glvnd EGL ICD).`,
      );
    }
    console.log(`capture renderer: ${renderer}`);
    writeFileSync(join(OUT_DIR, 'capture-renderer.json'), JSON.stringify({ renderer, fallback }, null, 2) + '\n');

    for (const [id, golden] of goldens) {
      const variants: GoldenVariantKey[] = golden.projectRef ? ['project', 'projectRef'] : ['project'];
      for (const variant of variants) {
        const legDir = join(OUT_DIR, id, variant === 'projectRef' ? 'webgl_ref' : 'webgl');
        mkdirSync(legDir, { recursive: true });
        await page.evaluate(
          ([g, v, fixtureBase, fontsBase]) => window.__parity.setup(g, v, fixtureBase, fontsBase),
          [golden, variant, `${base}/fixtures`, `${base}/fonts/studio`] as const,
        );
        for (const frame of golden.sampleFrames) {
          const res = await page.evaluate((k) => window.__parity.capture(k), frame);
          writeFileSync(join(legDir, `f${frame}.rgba`), Buffer.from(res.rgbaBase64, 'base64'));
          writeFileSync(join(legDir, `f${frame}.png`), Buffer.from(res.pngDataUrl.split(',')[1] ?? '', 'base64'));
        }
        console.log(`  captured ${id}${variant === 'projectRef' ? ' (ref)' : ''} (${golden.sampleFrames.length} frames)`);
      }
    }
  } finally {
    await browser?.close();
    server.close();
  }
}

// --- ffmpeg render (export leg, via the Go CLI) ------------------------------

function render(args: Args): void {
  if (!existsSync(join(args.apiDir, 'cmd', 'parity-render', 'main.go'))) {
    throw new Error(
      `cmd/parity-render not found under '${args.apiDir}' — point --api-dir (or MM_API_DIR) at the media_manipulator_api checkout`,
    );
  }
  const cliArgs = [
    'run', './cmd/parity-render',
    '-goldens', GOLDENS_DIR,
    '-fixtures', FIXTURES_DIR,
    '-out', OUT_DIR,
  ];
  if (args.scenarios.length > 0) cliArgs.push('-scenarios', args.scenarios.join(','));
  const res = spawnSync('go', cliArgs, { cwd: args.apiDir, stdio: 'inherit' });
  if (res.error) throw res.error;
  if (res.status !== 0) throw new Error(`parity-render exited with status ${res.status}`);
}

// --- main -------------------------------------------------------------------

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  const goldens = loadGoldens(args.scenarios);
  checkFixtures(goldens);
  mkdirSync(OUT_DIR, { recursive: true });

  if (!args.skipCapture) {
    console.log(`\n== capture (WebGL, ${args.fallback ? 'SwiftShader fallback' : 'NVIDIA GL'}) ==`);
    await capture(goldens, args.fallback);
  }
  if (!args.skipRender) {
    console.log('\n== render (ffmpeg export path, cmd/parity-render) ==');
    render(args);
  }
  if (!args.skipCompare) {
    console.log('\n== compare ==');
    const report = runCompare({
      harnessDir: HARNESS_DIR,
      outDir: OUT_DIR,
      fallback: args.fallback,
      scenarios: args.scenarios,
    });
    if (!report.pass) process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exitCode = 1;
});
