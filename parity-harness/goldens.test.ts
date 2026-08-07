import { readFileSync, readdirSync } from 'node:fs';
import { basename, join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { PARITY_TOLERANCES, parityTolerance } from '../lib/studio/parityTolerances';
import { studioAudioConfigSchema, studioTrackSchema } from '../lib/studioTypes';
import type { GoldenFile, GoldenProject } from './goldenTypes';

/**
 * Laptop-checkable validity of the golden EDLs: every golden must be a valid
 * v3 EDL under the REAL Zod schema, reference only declared assets, map to a
 * tolerance row, and collectively cover every row in parityTolerances.ts —
 * so a part 14+ session that adds a tolerance row without a golden fails the
 * laptop gate, not the workstation run.
 */

const GOLDENS_DIR = join(__dirname, 'goldens');

const goldens = new Map<string, GoldenFile>(
  readdirSync(GOLDENS_DIR)
    .filter((f) => f.endsWith('.json'))
    .sort()
    .map((f) => [basename(f, '.json'), JSON.parse(readFileSync(join(GOLDENS_DIR, f), 'utf8')) as GoldenFile]),
);

const goldenProjectChecks = (id: string, variant: string, p: GoldenProject, g: GoldenFile) => {
  it(`${id} ${variant}: tracks parse under the real EDL Zod schema`, () => {
    expect(() => z.array(studioTrackSchema).parse(p.tracks)).not.toThrow();
    if (g.project.audio) expect(() => studioAudioConfigSchema.parse(p.audio)).not.toThrow();
    expect(p.fps).toBeGreaterThan(0);
    expect(p.width).toBeGreaterThan(0);
    expect(p.height).toBeGreaterThan(0);
  });

  it(`${id} ${variant}: every clip/effect references a declared asset`, () => {
    for (const track of p.tracks) {
      for (const clip of track.clips) {
        expect(g.assets, `clip ${clip.id} assetId`).toHaveProperty(clip.assetId);
        for (const e of clip.effects ?? []) {
          if (e.type === 'lut') {
            expect(g.assets, `lut effect ${e.id}`).toHaveProperty(e.lutAssetId);
            expect(g.assets[e.lutAssetId].kind).toBe('lut');
          }
        }
      }
    }
  });

  it(`${id} ${variant}: sample frames land inside the timeline`, () => {
    expect(g.sampleFrames.length).toBeGreaterThan(0);
    let end = 0;
    for (const track of p.tracks) {
      for (const clip of track.clips) {
        end = Math.max(end, clip.timelineStart + (clip.sourceOut - clip.sourceIn));
      }
    }
    for (const k of g.sampleFrames) {
      expect(Number.isInteger(k)).toBe(true);
      expect(k).toBeGreaterThanOrEqual(0);
      expect(k / p.fps).toBeLessThan(end);
    }
  });
};

describe('golden EDLs', () => {
  it('exist', () => {
    expect(goldens.size).toBeGreaterThan(0);
  });

  for (const [id, g] of goldens) {
    describe(id, () => {
      it('maps to a tolerance row', () => {
        expect(parityTolerance(g.toleranceId ?? id), `toleranceId '${g.toleranceId ?? id}'`).toBeDefined();
      });
      goldenProjectChecks(id, 'project', g.project, g);
      if (g.projectRef) goldenProjectChecks(id, 'projectRef', g.projectRef, g);
    });
  }

  it('covers every tolerance row with at least one golden', () => {
    const covered = new Set([...goldens.entries()].map(([id, g]) => g.toleranceId ?? id));
    const missing = PARITY_TOLERANCES.map((r) => r.id).filter((rid) => !covered.has(rid));
    expect(missing, 'tolerance rows without a golden EDL').toEqual([]);
  });

  it('policy scenarios carry a projectRef variant', () => {
    expect(goldens.get('effect_stack_first_per_type')?.projectRef).toBeDefined();
  });
});
