import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { tiersFixture } from '@/lib/billing/test-utils';
import type { TiersResponse } from '@/lib/auth/accountApi';
import { PLAN_TABLE_FORMATS, buildPlanTable } from './planTable';
import { VECTOR_EXPORT_FORMATS } from './exportsApi';

/** The pro row MM49 will serve (design §3.4): Premium's formats plus PNG sequence, MP4, WebM. */
function withMm49Pro(): TiersResponse {
  const data = tiersFixture() as TiersResponse;
  return {
    ...data,
    tiers: data.tiers.map((t) =>
      t.tier === 'pro'
        ? {
            ...t,
            limits: {
              ...t.limits,
              vectorExportsPerDay: 151,
              vectorProjects: -1,
              vectorFormats: [...(t.limits.vectorFormats ?? []), 'png_sequence', 'mp4', 'webm'],
              vectorVideo: { maxHeight: 2161, maxFps: 61, maxSeconds: 59 },
            },
          }
        : t,
    ),
  };
}

describe('buildPlanTable (MM48 decisions 1 and 10)', () => {
  it('three tiers: no Pro column when the API returns none', () => {
    const table = buildPlanTable(tiersFixture({ withPro: false }) as TiersResponse)!;
    expect(table.columns.map((c) => c.tier)).toEqual(['anonymous', 'free', 'premium']);
    expect(table.hasPro).toBe(false);
  });

  it('four tiers: a Pro column when the API returns it', () => {
    const table = buildPlanTable(tiersFixture() as TiersResponse)!;
    expect(table.columns.map((c) => c.tier)).toEqual(['anonymous', 'free', 'premium', 'pro']);
    expect(table.hasPro).toBe(true);
  });

  it('reads every number from the served table', () => {
    const data = tiersFixture() as TiersResponse;
    const table = buildPlanTable(data)!;
    expect(table.exportsPerDay).toEqual(data.tiers.map((t) => t.limits.vectorExportsPerDay));
    expect(table.projects).toEqual(data.tiers.map((t) => t.limits.vectorProjects));
  });

  it('locks follow vectorFormats per tier', () => {
    const table = buildPlanTable(tiersFixture() as TiersResponse)!;
    const row = (f: string) => table.formats.find((r) => r.format === f)!;
    expect(row('svg_animated').included).toEqual([true, true, true, true]);
    expect(row('lottie').included).toEqual([false, true, true, true]);
    expect(row('gif').included).toEqual([false, false, true, true]);
  });

  it('MP4, WebM and PNG sequence are "not on any plan" while no tier lists them (before MM49)', () => {
    const table = buildPlanTable(tiersFixture() as TiersResponse)!;
    for (const f of ['png_sequence', 'mp4', 'webm']) {
      const row = table.formats.find((r) => r.format === f)!;
      expect(row.onNoPlan, f).toBe(true);
    }
    expect(table.formats.filter((r) => r.onNoPlan).map((r) => r.format)).toEqual(['png_sequence', 'mp4', 'webm']);
  });

  it('unlocks for Pro by itself when MM49 serves the Pro formats', () => {
    const table = buildPlanTable(withMm49Pro())!;
    const mp4 = table.formats.find((r) => r.format === 'mp4')!;
    expect(mp4.onNoPlan).toBe(false);
    expect(mp4.included).toEqual([false, false, false, true]);
    expect(table.rasterCap[3]).toEqual({ maxHeight: 2161, maxFps: 61, maxSeconds: 59 });
    expect(table.exportsPerDay[3]).toBe(151);
  });

  it('raster caps apply only to tiers with a raster format; duration cap in seconds', () => {
    const data = tiersFixture() as TiersResponse;
    data.tiers[0].limits.vectorMaxDurationMs = 9000;
    const table = buildPlanTable(data)!;
    expect(table.rasterCap[0]).toBeNull();
    expect(table.rasterCap[1]).toBeNull();
    expect(table.rasterCap[2]).toEqual(data.tiers[2].limits.vectorVideo);
    expect(table.maxDurationSeconds[0]).toBe(9);
    expect(table.maxDurationSeconds[2]).toBe(0);
  });

  it('is null when the API is down or predates the vector fields', () => {
    expect(buildPlanTable(null)).toBeNull();
    const old = tiersFixture() as TiersResponse;
    const stripped: TiersResponse = {
      ...old,
      tiers: old.tiers.map((t) => ({ ...t, limits: { ...t.limits, vectorFormats: undefined, vectorExportsPerDay: undefined } })),
    };
    expect(buildPlanTable(stripped)).toBeNull();
  });

  it('lists only countable server formats, never the free static SVG or the unbuilt vectorize import', () => {
    for (const f of PLAN_TABLE_FORMATS) expect(VECTOR_EXPORT_FORMATS as readonly string[]).toContain(f);
    expect(PLAN_TABLE_FORMATS as readonly string[]).not.toContain('svg_static');
    expect(PLAN_TABLE_FORMATS as readonly string[]).not.toContain('import_svg_vectorize');
  });

  it('has no numeric literal for a limit in the model or the view', () => {
    for (const file of ['planTable.ts', '../../components/vector/landing/motion-landing.tsx']) {
      const src = readFileSync(join(__dirname, file), 'utf8')
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/\/\/.*$/gm, '')
        .replace(/className=("[^"]*"|\{[^}]*\})/g, '');
      for (const n of ['2', '5', '10', '25', '30', '150', '720', '2160', '15', '60']) {
        expect(src, `${file} ${n}`).not.toMatch(new RegExp(`[^\\w.-]${n}[^\\w.%-]`));
      }
    }
  });
});
