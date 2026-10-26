/**
 * MM46 acceptance 4: the counted Lottie import with a mocked API.
 *   429 / 403 / 422 / 503 → the parser is never invoked;
 *   {ok:true}             → parsed, warnings returned for the editor to show;
 *   over 4 MB / not Lottie → refused BEFORE the API call (no allowance spent).
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it, vi } from 'vitest';

import type { VectorExportResult } from '@/lib/vector/exportsApi';

import { LOTTIE_MAX_BYTES, importLottie } from './lottie';
import { looksLikeLottie, runLottieImport } from './lottieImportFlow';

const lottie = readFileSync(join(__dirname, '..', 'fixtures', 'lottie', 'basic-shapes.json'), 'utf8');
const file = (text: string, size = text.length) => ({ size, text: async () => text });
const granted: VectorExportResult = { ok: true, granted: { ok: true, format: 'import_lottie', tier: 'free', limit: 5, remaining: 4, resetsAt: '' } };
const refused = (kind: 'limit' | 'locked' | 'cap' | 'unavailable'): VectorExportResult => {
  switch (kind) {
    case 'limit':
      return { ok: false, refusal: { kind, tier: 'free', limit: 5, used: 5, resetsAt: '', upgradePath: 'premium' } };
    case 'locked':
      return { ok: false, refusal: { kind, format: 'import_lottie', tier: 'anonymous', upgradePath: 'signup' } };
    case 'cap':
      return { ok: false, refusal: { kind, cap: 'duration', max: 10000, tier: 'anonymous' } };
    default:
      return { ok: false, refusal: { kind: 'unavailable', status: 503 } };
  }
};

describe('counted Lottie import', () => {
  it('{ok:true}: counts import_lottie FIRST, then parses', async () => {
    const order: string[] = [];
    const count = vi.fn(async () => (order.push('count'), granted));
    const parse = vi.fn((t: string) => (order.push('parse'), importLottie(t)));
    const out = await runLottieImport(file(lottie), { count, parse, projectId: 'p1' });
    expect(out.kind).toBe('imported');
    expect(order).toEqual(['count', 'parse']);
    expect(count).toHaveBeenCalledWith({ projectId: 'p1', format: 'import_lottie', durationMs: 0, height: 0, fps: 0 });
    if (out.kind === 'imported') {
      expect(out.remaining).toBe(4);
      expect(out.result.doc.layers.length).toBe(4);
    }
  });

  it.each(['limit', 'locked', 'cap', 'unavailable'] as const)('%s: the parser is not invoked', async (kind) => {
    const parse = vi.fn(importLottie);
    const out = await runLottieImport(file(lottie), { count: async () => refused(kind), parse });
    const expected = refused(kind);
    expect(out).toEqual({ kind: 'refused', refusal: expected.ok ? null : expected.refusal });
    expect(parse).not.toHaveBeenCalled();
  });

  it('an over-4 MB file is rejected before the API call (no allowance spent)', async () => {
    const count = vi.fn(async () => granted);
    const text = vi.fn(async () => lottie);
    const out = await runLottieImport({ size: LOTTIE_MAX_BYTES + 1, text }, { count });
    expect(out).toEqual({ kind: 'error', code: 'too_large' });
    expect(count).not.toHaveBeenCalled();
    expect(text).not.toHaveBeenCalled();
  });

  it('a file that is not a Lottie animation is rejected before the API call', async () => {
    const count = vi.fn(async () => granted);
    const motionDoc = JSON.stringify({ version: 1, canvas: { width: 1, height: 1 }, layers: [] });
    expect(await runLottieImport(file(motionDoc), { count })).toEqual({ kind: 'error', code: 'not_lottie' });
    expect(await runLottieImport(file('<svg/>'), { count })).toEqual({ kind: 'error', code: 'not_lottie' });
    expect(count).not.toHaveBeenCalled();
  });

  it('a counted file that then fails to parse reports the parser error (the unit is spent, nothing opens)', async () => {
    const bad = '{"fr":30,"ip":0,"op":"x","layers":[]}';
    const out = await runLottieImport(file(bad), { count: async () => granted });
    expect(out).toEqual({ kind: 'error', code: 'not_lottie' });
  });

  it('looksLikeLottie: Lottie yes, Motion documents and SVG no', () => {
    expect(looksLikeLottie(lottie)).toBe(true);
    expect(looksLikeLottie('{"version":1,"canvas":{"width":1},"layers":[],"fr":1,"op":1}')).toBe(false);
    expect(looksLikeLottie('<svg/>')).toBe(false);
  });
});
