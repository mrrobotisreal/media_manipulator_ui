import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

import type { StudioCaptionCue, StudioCaptionStyle } from '@/lib/studioTypes';
import { buildASS } from './ass';

/**
 * Golden .ass parity (MM121 decision 4): the TS generator reproduces every fixture the Go
 * BuildASS is checked against, byte for byte. The fixtures are copied from
 * media_manipulator_api/internal/services/testdata/captions/ (identity-checked below when the API
 * checkout sits next to this repo, the op-schema pattern).
 */
const DIR = join(process.cwd(), 'lib', 'studio', 'captions', 'goldens');
// MM_API_CAPTIONS_DIR points at another API checkout (a worktree) for the identity check.
const API_DIR = process.env.MM_API_CAPTIONS_DIR ?? join(process.cwd(), '..', 'media_manipulator_api', 'internal', 'services', 'testdata', 'captions');
const names = readdirSync(DIR).filter((f) => f.endsWith('.json')).map((f) => f.slice(0, -5)).sort();

interface Fixture {
  name: string;
  width: number;
  height: number;
  style: StudioCaptionStyle | null;
  cues: StudioCaptionCue[];
}

describe('caption ASS goldens (TS = Go, byte for byte)', () => {
  it('has the fixture count (MM121 18 + MM122 12)', () => {
    expect(names.length).toBeGreaterThanOrEqual(30);
  });

  for (const name of names) {
    it(name, () => {
      const fx = JSON.parse(readFileSync(join(DIR, `${name}.json`), 'utf8')) as Fixture;
      const want = readFileSync(join(DIR, `${name}.ass`), 'utf8');
      expect(buildASS(fx.cues, fx.style, fx.width, fx.height)).toBe(want);
    });
  }

  it('the UI copies equal the API fixtures (when the API checkout is present)', () => {
    if (!existsSync(API_DIR)) return;
    const api = readdirSync(API_DIR).sort();
    expect(readdirSync(DIR).filter((f) => f !== 'README.md').sort()).toEqual(api);
    for (const f of api) expect(readFileSync(join(DIR, f), 'utf8'), f).toBe(readFileSync(join(API_DIR, f), 'utf8'));
    expect(readFileSync(join(process.cwd(), 'lib', 'studio', 'captions', 'captionsCatalog.json'), 'utf8')).toBe(
      readFileSync(join(API_DIR, '..', 'captions_catalog.json'), 'utf8'),
    );
  });
});
