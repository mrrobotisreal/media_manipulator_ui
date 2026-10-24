import { defineConfig } from '@playwright/test';

/**
 * Darkroom E2E (part 22) - WORKSTATION-ONLY. Never run on the laptop and never
 * part of `npm test` / the laptop gates (see e2e/README.md). `npm run e2e`.
 *
 * Browser: per research ticket 02, full Chromium (`channel: 'chromium'`, new
 * headless) rather than Playwright's default headless shell. Unlike the parity
 * harness, E2E needs functionality, not GPU parity, so no GPU flags are set:
 * the specs assert the editor loads whether WebGL or the canvas fallback is in
 * use. Add the harness' ANGLE flags via E2E_CHROMIUM_ARGS to exercise the GPU path.
 *
 * Environment (all optional, see README):
 *   E2E_BASE_URL            deployed UI origin (default http://localhost:3000)
 *   E2E_API_URL             the API base the UI was built against, used only for
 *                           a preflight health check (default as the UI's own default)
 *   E2E_STORAGE_STATE       a Playwright storageState JSON of a signed-in user
 *   E2E_CHROMIUM_ARGS       extra Chromium flags, space separated
 *   E2E_EXPORT_TIMEOUT_MS   how long to wait for the export render (default 600000)
 */
const baseURL = process.env.E2E_BASE_URL || 'http://localhost:3000';
const extraArgs = (process.env.E2E_CHROMIUM_ARGS || '').split(/\s+/).filter(Boolean);

export default defineConfig({
  testDir: './specs',
  testMatch: '**/*.e2e.ts',
  outputDir: './results',
  reporter: [['list'], ['html', { outputFolder: './report', open: 'never' }]],
  // One user journey at a time: every spec writes real projects to the stack.
  workers: 1,
  fullyParallel: false,
  retries: 0,
  timeout: 15 * 60_000,
  expect: { timeout: 20_000 },
  globalSetup: './global-setup.ts',
  use: {
    baseURL,
    channel: 'chromium',
    headless: true,
    viewport: { width: 1600, height: 1000 },
    acceptDownloads: true,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'off',
    launchOptions: { args: extraArgs },
    storageState: process.env.E2E_STORAGE_STATE || undefined,
  },
  projects: [{ name: 'darkroom' }],
});
