import { describe, expect, it } from 'vitest';

import sitemap from '@/app/sitemap';
import robots from '@/app/robots';
import { llmsFullMarkdown, llmsIndexMarkdown } from '@/lib/llmsTxt';
import { estimateLabel, runBlock } from './caps';
import { buildParams, defaultValues, schemaToFields } from './schemaForm';
import { LAB_COOKIE_NAME, buildClearedLabCookie, buildLabCookie, syncLabCookie } from './session';
import type { LabModel, LabSpend } from './types';

describe('schemaToFields', () => {
  const schema = {
    type: 'object',
    required: ['mode', 'strength'],
    properties: {
      mode: { type: 'string', enum: ['a', 'b'], title: 'Mode' },
      strength: { type: 'number', minimum: 0, maximum: 1, default: 0.5 },
      steps: { type: 'integer', minimum: 1, maximum: 10 },
      upscale: { type: 'boolean', default: true },
      prompt: { type: 'string', description: 'Text' },
      nested: { type: 'object' },
      list: { type: 'array' },
    },
  };
  const fields = schemaToFields(schema);
  const byName = Object.fromEntries(fields.map((f) => [f.name, f]));

  it('maps enum, boolean, number bounds, string, required and defaults', () => {
    expect(byName.mode).toMatchObject({ kind: 'select', options: ['a', 'b'], required: true, label: 'Mode' });
    expect(byName.strength).toMatchObject({ kind: 'number', min: 0, max: 1, default: 0.5, required: true });
    expect(byName.steps).toMatchObject({ kind: 'number', integer: true, min: 1, max: 10, required: false });
    expect(byName.upscale).toMatchObject({ kind: 'boolean', default: true });
    expect(byName.prompt).toMatchObject({ kind: 'text', description: 'Text' });
  });
  it('skips unsupported types and never crashes on junk', () => {
    expect(byName.nested).toBeUndefined();
    expect(byName.list).toBeUndefined();
    expect(schemaToFields(null)).toEqual([]);
    expect(schemaToFields({ properties: { x: null as never } })).toEqual([]);
  });
  it('applies defaults and enforces required and bounds', () => {
    const v = defaultValues(fields);
    expect(v.strength).toBe(0.5);
    expect(v.upscale).toBe(true);
    expect(v.mode).toBe('a');
    expect(buildParams(fields, v).errors).toEqual({});
    expect(buildParams(fields, { ...v, mode: undefined }).errors.mode).toMatch(/required/);
    expect(buildParams(fields, { ...v, strength: 2 }).errors.strength).toMatch(/at most/);
    expect(buildParams(fields, { ...v, steps: 2.5 }).errors.steps).toMatch(/whole/);
    expect(buildParams(fields, { ...v, steps: 3 }).params.steps).toBe(3);
  });
});

const model = (over: Partial<LabModel> = {}): LabModel => ({
  key: 'm', name: 'M', area: 'image', licence: 'noncommercial', licenceUrl: 'u', sourceUrl: 's', family: 'f',
  instance: 'g6e.xlarge', fitsHome: false, runsAt: 'burst', estSeconds: 60, estCostUsd: 2, available: true,
  paramsSchema: {}, inputs: [], outputs: [], ...over,
});
const spend = (d: number, m: number): LabSpend => ({
  day: { spentUsd: d, capUsd: 10 }, month: { spentUsd: m, capUsd: 100 }, sessions: [],
});

describe('runBlock', () => {
  it('allows a run under both caps and exactly at the cap', () => {
    expect(runBlock(model(), spend(1, 1))).toBeNull();
    expect(runBlock(model(), spend(8, 1))).toBeNull();
  });
  it('blocks past the day cap, then the month cap', () => {
    expect(runBlock(model(), spend(8.5, 1))?.reason).toBe('day_cap');
    expect(runBlock(model(), spend(1, 99))?.reason).toBe('month_cap');
  });
  it('never blocks a free home run on cost', () => {
    expect(runBlock(model({ runsAt: 'home', estCostUsd: 0 }), spend(10, 100))).toBeNull();
  });
  it('blocks an unavailable model with its reason', () => {
    expect(runBlock(model({ available: false, unavailableReason: 'burst off' }), spend(0, 0))).toEqual({
      reason: 'unavailable', message: 'burst off',
    });
  });
  it('labels estimates', () => {
    expect(estimateLabel(model({ runsAt: 'home', estCostUsd: 0 }))).toBe('$0.00, runs at home');
    expect(estimateLabel(model())).toBe('~$2.00 on g6e.xlarge');
  });
});

describe('lab cookie helper', () => {
  const doc = () => ({ cookie: '', location: { protocol: 'https:' } });
  it('sets the token cookie with the documented attributes for a granted operator', async () => {
    const d = doc();
    expect(await syncLabCookie(true, async () => 'tok', d)).toBe('set');
    expect(d.cookie).toBe(`${LAB_COOKIE_NAME}=tok; Path=/; Max-Age=3300; SameSite=Strict; Secure`);
  });
  it('omits Secure on http localhost', async () => {
    const d = { cookie: '', location: { protocol: 'http:' } };
    await syncLabCookie(true, async () => 'tok', d);
    expect(d.cookie).not.toContain('Secure');
    expect(buildLabCookie('x', false)).not.toContain('Secure');
  });
  it('clears (and never sets) when not granted', async () => {
    const d = doc();
    let asked = false;
    expect(await syncLabCookie(false, async () => ((asked = true), 'tok'), d)).toBe('cleared');
    expect(asked).toBe(false);
    expect(d.cookie).toBe(buildClearedLabCookie(true));
    expect(d.cookie).toContain('Max-Age=0');
  });
  it('clears when no token is available or the lookup throws, and survives blocked cookies', async () => {
    const d = doc();
    expect(await syncLabCookie(true, async () => null, d)).toBe('cleared');
    expect(await syncLabCookie(true, async () => { throw new Error('x'); }, d)).toBe('cleared');
    const blocked = { get cookie(): string { return ''; }, set cookie(_v: string) { throw new Error('blocked'); } };
    await expect(syncLabCookie(true, async () => 'tok', blocked)).resolves.toBeDefined();
  });
});

describe('Lab exclusions', () => {
  it('is not in the sitemap and is disallowed in robots', () => {
    expect(JSON.stringify(sitemap())).not.toMatch(/\/lab/);
    const rules = robots().rules;
    const all = Array.isArray(rules) ? rules : [rules];
    expect(all.some((r) => [r.disallow].flat().includes('/lab'))).toBe(true);
  });
  it('is not in llms.txt', () => {
    expect(llmsIndexMarkdown() + llmsFullMarkdown()).not.toMatch(/\/lab\b/);
  });
});
