import { defineConfig } from '@playwright/test';

/**
 * MM52 RTL shaping check — WORKSTATION-ONLY (never on the laptop, never in
 * `npm test`). Needs only Chromium: the spec renders its own HTML with
 * `page.setContent`, so no stack and no fixtures.
 *
 *   npx playwright test -c e2e/translator/playwright.config.ts
 *
 * Record the result (pass/fail per locale, Chromium version, OS fonts) in the
 * MM52 log / MM55 dry-run notes.
 */
export default defineConfig({
  testDir: '.',
  testMatch: '**/*.e2e.ts',
  outputDir: './results',
  reporter: [['list']],
  workers: 1,
  retries: 0,
  use: { channel: 'chromium', headless: true, viewport: { width: 900, height: 200 } },
});
