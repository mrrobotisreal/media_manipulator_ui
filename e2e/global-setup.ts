import { existsSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Preflight: fail fast with an actionable message instead of a 15-minute
 * timeout when the stack or the fixtures are not there.
 */
export default async function globalSetup(): Promise<void> {
  const fixtures = ['clipA.mp4', 'clipB.mp4', 'tone.wav'].map((f) => join(__dirname, 'fixtures', f));
  const missing = fixtures.filter((f) => !existsSync(f));
  if (missing.length > 0) {
    throw new Error(`E2E fixtures missing (${missing.length}). Run \`npm run e2e:fixtures\` first (needs ffmpeg).`);
  }

  const baseURL = process.env.E2E_BASE_URL || 'http://localhost:3000';
  const ui = await fetch(`${baseURL}/tools/content-studio`, { redirect: 'follow' }).catch(() => null);
  if (!ui || !ui.ok) {
    throw new Error(`The UI is not reachable at ${baseURL}/tools/content-studio (set E2E_BASE_URL to the deployed workstation stack).`);
  }

  const apiURL = process.env.E2E_API_URL;
  if (apiURL) {
    const api = await fetch(`${apiURL.replace(/\/$/, '')}/health`).catch(() => null);
    if (!api || !api.ok) {
      throw new Error(`The API health check failed at ${apiURL}/health (E2E_API_URL must be the API base the UI was built with).`);
    }
  }
}
