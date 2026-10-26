// @vitest-environment node
/**
 * The checked-in anime.js runtime constant is exactly what
 * `scripts/gen-anime-runtime.mjs` builds from the installed (pinned) package:
 * a version bump without `node scripts/gen-anime-runtime.mjs` fails here.
 * (Node environment: esbuild refuses to run under jsdom.)
 */
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

import { OUT_FILE, render } from '../../../scripts/gen-anime-runtime.mjs';

describe('animeRuntime.generated.ts', () => {
  it('is what the generator produces (run node scripts/gen-anime-runtime.mjs)', async () => {
    expect(await render()).toBe(readFileSync(OUT_FILE, 'utf8'));
  });
});
