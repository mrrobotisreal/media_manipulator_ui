import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/studio/studioBackend', () => ({
  getActiveStudioBackend: () => {
    throw new Error('studioBackend must not be reached');
  },
}));

import { MEDI_SANITIZER_FIXTURE, mediSanitizerTracks } from './studioSanitizerFixture';

const path = resolve(process.cwd(), process.env.MEDI_API_MODELS_TESTDATA ? `${process.env.MEDI_API_MODELS_TESTDATA}/medi_studio_tracks.json` : MEDI_SANITIZER_FIXTURE);

describe('Medi studio output ⇄ Go sanitizer fixture (MM109 acceptance 2)', () => {
  it.skipIf(!existsSync(resolve(path, '..')))('the API fixture is the engine output for the batch (WRITE_MEDI_FIXTURE=1 regenerates it)', () => {
    const body = mediSanitizerTracks();
    if (process.env.WRITE_MEDI_FIXTURE === '1') writeFileSync(path, body);
    expect(existsSync(path) && readFileSync(path, 'utf8') === body).toBe(true);
  });
});
