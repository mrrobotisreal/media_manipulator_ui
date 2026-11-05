/**
 * MM110 decision 2: every template is pure, uses only existing layer types / tracks /
 * animators, passes `docIntegrityIssues` with zero issues, parses with the full schema and
 * re-serialises canonically (the form the Go sanitizer keeps byte-stable: the generated goldens
 * in `fixtures/templates/` are checked by `internal/vector` `TestTemplateGoldens` in the API).
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

import { ANIMATOR_IDS } from './animators';
import { applyTemplate, TEMPLATE_KINDS, type TemplateKind } from './templates';
import { docIntegrityIssues, forEachLayer, parseVectorDoc, serializeVectorDoc, TRACK_PROPERTY_PATTERN, type VectorDoc } from './vectorTypes';
import { FIXTURES_DIR } from './fixtures/fixtures';

const doc = (input: Record<string, unknown> = {}): VectorDoc => {
  const r = parseVectorDoc({ version: 1, ...input });
  if (!r.ok) throw new Error(r.error);
  return r.doc;
};
const withLogo = () => doc({ layers: [{ type: 'path', id: 'logo', name: 'Logo', d: 'M0 0L100 0L50 80Z', fill: 'none', stroke: '#ff5a36', strokeWidth: 4 }, { type: 'text', id: 'brand', x: 50, y: 120, text: 'ACME', fontSize: 24 }] });

const GOLDEN_DIR = join(FIXTURES_DIR, 'templates');
/** Inputs of the shared goldens (the API copies `fixtures/templates/*.json` into its testdata). */
const GOLDEN_CASES: Array<[TemplateKind, () => VectorDoc, Parameters<typeof applyTemplate>[2]]> = [
  ['lowerThird', () => doc({ canvas: { width: 1920, height: 1080 } }), { text: ['Jo Park', 'Producer'], colors: ['#ff5a36', '#ffffff'] }],
  ['logoReveal', withLogo, { duration: 1500 }],
  ['titlePop', () => doc(), { text: 'New collection', at: 200 }],
  ['bulletReveal', () => doc({ canvas: { width: 1080, height: 1920 } }), { text: ['Fast', 'Simple', 'Free'] }],
  ['counter', () => doc(), { value: 10000, text: 'users' }],
  ['badgeBounce', () => doc(), { text: 'SALE' }],
];

describe('Motion templates', () => {
  it.each(GOLDEN_CASES)('%s: integrity-clean, canonical, only known tracks', (kind, input, opts) => {
    const before = input();
    const snapshot = serializeVectorDoc(before);
    const r = applyTemplate(before, kind, opts);
    expect(r.ok, kind).toBe(true);
    if (!r.ok) return;
    expect(serializeVectorDoc(before)).toBe(snapshot); // pure
    expect(docIntegrityIssues(r.doc)).toEqual([]);
    const parsed = parseVectorDoc(r.doc);
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;
    expect(serializeVectorDoc(parsed.doc)).toBe(serializeVectorDoc(r.doc));
    for (const tr of parsed.doc.animations) {
      expect(TRACK_PROPERTY_PATTERN.test(tr.property), tr.property).toBe(true);
      expect(tr.keyframes.every((k) => k.t >= 0 && k.t <= parsed.doc.duration), `${tr.layerId}.${tr.property}`).toBe(true);
    }
    forEachLayer(parsed.doc, (l) => expect(l.type).not.toBe('raw'));
    // The template's own layers exist and the user's layers are untouched (except logoReveal's targets).
    if (kind !== 'logoReveal') {
      expect(r.added.length).toBeGreaterThan(0);
      for (const l of before.layers) expect(parsed.doc.layers).toContainEqual(l);
    }
  });

  it('every template is reachable by a menu kind and by the op enum', () => {
    expect([...TEMPLATE_KINDS].sort()).toEqual(['badgeBounce', 'bulletReveal', 'counter', 'logoReveal', 'lowerThird', 'titlePop']);
    expect(ANIMATOR_IDS).toContain('drawOn');
  });

  it('lowerThird sits in the lower 30 % and slides within the first second', () => {
    const r = applyTemplate(doc({ canvas: { width: 1920, height: 1080 } }), 'lowerThird', { text: ['Jo Park', 'Producer'] });
    if (!r.ok) throw new Error(r.error);
    const g = r.doc.layers.at(-1)!;
    expect(g.type).toBe('group');
    if (g.type !== 'group') return;
    const texts = g.children.filter((c) => c.type === 'text');
    expect(texts.map((x) => (x.type === 'text' ? x.text : ''))).toEqual(['Jo Park', 'Producer']);
    for (const x of texts) if (x.type === 'text') expect(x.y / 1080).toBeGreaterThanOrEqual(0.7);
    const slide = r.doc.animations.find((a) => a.property === 'transform.x');
    expect(slide && slide.keyframes.at(-1)!.t - slide.keyframes[0].t).toBeLessThanOrEqual(1000);
  });

  it('logoReveal draws outlines on and fades the rest; refuses an empty canvas', () => {
    const r = applyTemplate(withLogo(), 'logoReveal', {});
    if (!r.ok) throw new Error(r.error);
    expect(r.doc.animations.map((a) => `${a.layerId}.${a.property}`).sort()).toEqual(['brand.opacity', 'brand.transform.scaleX', 'brand.transform.scaleY', 'logo.strokeDashoffset']);
    expect(applyTemplate(doc(), 'logoReveal', {})).toMatchObject({ ok: false });
  });

  it('counter ends on the exact value and lengthens a short composition', () => {
    const r = applyTemplate(doc({ duration: 1000 }), 'counter', { value: 5000, duration: 1800 });
    if (!r.ok) throw new Error(r.error);
    expect(r.doc.duration).toBeGreaterThanOrEqual(1800);
    const g = r.doc.layers.at(-1)!;
    if (g.type !== 'group') throw new Error('group');
    expect(g.children.at(-1)!.type === 'text' && (g.children.at(-1) as { text: string }).text).toBe('5,000');
  });

  it('ids never collide with the user layers, even on a second run', () => {
    const a = applyTemplate(doc(), 'titlePop', {});
    if (!a.ok) throw new Error(a.error);
    const b = applyTemplate(a.doc, 'titlePop', {});
    if (!b.ok) throw new Error(b.error);
    expect(docIntegrityIssues(b.doc)).toEqual([]);
    expect(b.added[0]).not.toBe(a.added[0]);
  });

  it('unsafe colours fall back to the template defaults', () => {
    const r = applyTemplate(doc(), 'badgeBounce', { colors: ['url(https://evil)', 'red;}'] });
    if (!r.ok) throw new Error(r.error);
    expect(JSON.stringify(r.doc)).not.toMatch(/evil|;\}/);
  });

  // Shared goldens: the API's Go sanitizer must keep each byte-identical (TestTemplateGoldens).
  it('goldens in fixtures/templates are current (UPDATE_VECTOR_FIXTURES=1 regenerates)', () => {
    if (!existsSync(GOLDEN_DIR)) mkdirSync(GOLDEN_DIR, { recursive: true });
    for (const [kind, input, opts] of GOLDEN_CASES) {
      const r = applyTemplate(input(), kind, opts);
      if (!r.ok) throw new Error(r.error);
      const p = parseVectorDoc(r.doc);
      if (!p.ok) throw new Error(p.error);
      const body = serializeVectorDoc(p.doc);
      const file = join(GOLDEN_DIR, `${kind}.json`);
      if (process.env.UPDATE_VECTOR_FIXTURES) writeFileSync(file, body);
      expect(readFileSync(file, 'utf8'), kind).toBe(body);
    }
  });
});
