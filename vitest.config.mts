import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

// Vitest setup per the official Next.js guide
// (node_modules/next/dist/docs/01-app/02-guides/testing/vitest.md).
// jsdom is a safety net — the current suites cover pure, DOM-free editor logic
// (store actions, preview resolver, EDL normalizer). No network, DB, or browser.
export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: 'jsdom',
    // Playwright E2E is workstation-only (e2e/README.md): its files are
    // *.e2e.ts, and this exclude keeps `npm test` from ever collecting them.
    exclude: ['**/node_modules/**', '**/dist/**', 'e2e/**'],
  },
});
