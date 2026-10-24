import { readFileSync, readdirSync } from 'node:fs';
import { basename, join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { PARITY_TOLERANCES, parityTolerance } from '../lib/studio/parityTolerances';
import { clipTimelineDuration } from '../lib/studio/speed';
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
        if (clip.title) {
          // Title clips (part 16) are assetless by contract (assetId XOR title).
          expect(clip.assetId).toBe('');
          continue;
        }
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
        end = Math.max(end, clip.timelineStart + clipTimelineDuration(clip));
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

  it('every referenced fixture file is produced by make-fixtures.sh (or committed)', () => {
    const script = readFileSync(join(__dirname, 'make-fixtures.sh'), 'utf8');
    const committed = new Set(readdirSync(join(__dirname, 'fixtures')));
    for (const [id, g] of goldens) {
      for (const [assetId, asset] of Object.entries(g.assets)) {
        const known = committed.has(asset.file) || script.includes(asset.file);
        expect(known, `${id}: asset ${assetId} fixture '${asset.file}'`).toBe(true);
      }
    }
  });

  it('image goldens use image assets only on image kinds', () => {
    for (const id of [
      'image_hold_passthrough',
      'image_hold_transform',
      'image_hold_dissolve_to_video',
      'image_alpha_over_video',
    ]) {
      const g = goldens.get(id);
      expect(g, id).toBeDefined();
      expect(Object.values(g!.assets).some((a) => a.kind === 'image'), `${id} has an image asset`).toBe(true);
    }
  });

  it('speed goldens exercise their control and stay image-free (part 17)', () => {
    const clipOf = (id: string) => goldens.get(id)!.project.tracks[0].clips[0];
    expect(clipOf('speed_up').speed).toBe(2);
    expect(clipOf('speed_slow').speed).toBe(0.5);
    expect(clipOf('speed_reverse').reverse).toBe(true);
    expect(clipOf('speed_freeze').freeze).toBeDefined();
    // The reversed scenario needs the reversed fixture the capture leg swaps to.
    expect(Object.values(goldens.get('speed_reverse')!.assets).some((a) => !!a.reversedFile)).toBe(true);
    for (const id of ['speed_up', 'speed_slow', 'speed_reverse', 'speed_freeze']) {
      expect(Object.values(goldens.get(id)!.assets).every((a) => a.kind === 'video'), id).toBe(true);
    }
  });

  it('policy scenarios carry a projectRef variant', () => {
    expect(goldens.get('effect_stack_first_per_type')?.projectRef).toBeDefined();
  });
});
