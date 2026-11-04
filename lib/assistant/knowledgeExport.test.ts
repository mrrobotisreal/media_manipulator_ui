import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

import { PRIMARY_TOOL_PAGES } from '@/content/toolPages';
import { TOOL_ALIAS_OF } from '@/content/toolAliases';
import { locales } from '@/i18n/locales';
import { LAYER_PARAMS, type LayerType } from '@/lib/photo/photoTypes';
import { BUILTIN_PRESETS } from '@/lib/photo/presets';
import { panelForLayer } from '@/components/photo/layers-panel';
import { ANIMATOR_IDS } from '@/lib/vector/animators';
import { LUMETRI_PARAMS } from '@/lib/studio/effectRegistry';
import {
  GENERATED_LINE,
  MAX_CORPUS_BYTES,
  MAX_DOC_BYTES,
  MEDI_KNOWLEDGE_DIR,
  PHOTO_LAYER_PANEL,
  TRACK_PROPERTY_PATTERN,
  VECTOR_TRACK_PROPERTIES,
  buildMediKnowledge,
  routeEntrySchema,
  statesTierNumber,
  stripTierNumbers,
} from './knowledgeExport';

// One build for the whole file (the builder walks every registry; ~1 s).
const files = buildMediKnowledge();
const docs = Object.entries(files).filter(([p]) => p.endsWith('.md') && p !== 'README.md');

describe('export:medi corpus shape (decision 1, 2)', () => {
  it('has one doc per primary tool page, every public page and every editor', () => {
    const tools = docs.filter(([p]) => p.startsWith('tools/'));
    expect(tools.map(([p]) => p.slice(6, -3)).sort()).toEqual(PRIMARY_TOOL_PAGES.map((t) => t.slug).sort());
    for (const required of ['pages/home.md', 'pages/pricing.md', 'pages/account.md', 'pages/tools.md', 'pages/privacy-policy.md', 'pages/tutorials/aperture.md']) {
      expect(files[required], required).toBeDefined();
    }
    for (const editor of ['studio', 'vector', 'photo']) {
      expect(docs.filter(([p]) => p.startsWith(`editors/${editor}/`)).length, editor).toBeGreaterThanOrEqual(4);
    }
    // MM106: every recipe under content/medi/recipes is exported under recipes/.
    for (const editor of ['photo', 'studio', 'vector', 'workflow']) {
      expect(docs.filter(([p]) => p.startsWith(`recipes/${editor}/`)).length, editor).toBeGreaterThanOrEqual(10);
    }
  });

  it('never exports the private or operator surfaces', () => {
    const paths = Object.keys(files).join('\n');
    expect(paths).not.toMatch(/(^|\/)(dr|embed|translator|translate-guide|r)\//m);
    const routes = JSON.parse(files['routes.json']) as Array<{ route: string }>;
    for (const r of routes) expect(r.route).not.toMatch(/^\/(dr|embed|translator|translate-guide|r\/|api)/);
  });

  it('every doc starts with the generated line and has the five sections in order', () => {
    for (const [p, body] of docs) {
      expect(body.startsWith(GENERATED_LINE), p).toBe(true);
      expect(body, p).toMatch(/^# .+$/m);
      expect(body, p).toMatch(/- Kind: `(tool|page|editor|recipe)`/);
      const order = ['## Summary', '## Details', '## Search keywords', '## Links'].map((h) => body.indexOf(`\n${h}\n`));
      expect(order.every((i) => i > 0), `${p} sections`).toBe(true);
      expect([...order].sort((a, b) => a - b), `${p} order`).toEqual(order);
    }
  });

  it('tool docs carry route, slug, aliases as keywords and the Opens facts', () => {
    const doc = files['tools/compress-video.md'];
    expect(doc).toContain('- Route: `/tools/compress-video`');
    expect(doc).toContain('- Slug: `compress-video`');
    expect(doc).toContain('`compress-mp4`');
    expect(doc).toContain('## Opens');
    for (const alias of Object.keys(TOOL_ALIAS_OF)) expect(files[`tools/${alias}.md`], alias).toBeUndefined();
    expect(files['tools/color-pop.md']).toContain('color-pop-red');
  });

  it('routes.json is the closed, sorted list of targets with presets on Aperture tools', () => {
    const routes = JSON.parse(files['routes.json']) as Array<{ route: string; kind: string; slug?: string; presets?: string[] }>;
    for (const r of routes) expect(routeEntrySchema.safeParse(r).success, r.route).toBe(true);
    expect(routes.map((r) => r.route)).toEqual([...routes.map((r) => r.route)].sort((a, b) => a.localeCompare(b)));
    expect(new Set(routes.map((r) => r.route)).size).toBe(routes.length);
    const slugs = routes.filter((r) => r.kind === 'tool').map((r) => r.slug);
    expect(slugs.sort()).toEqual(PRIMARY_TOOL_PAGES.map((t) => t.slug).sort());
    const aperture = routes.find((r) => r.kind === 'tool' && r.slug === 'aperture');
    expect(aperture?.presets).toEqual(BUILTIN_PRESETS.map((p) => p.id));
    expect(routes.find((r) => r.route === '/pricing')?.kind).toBe('page');
    expect(routes.find((r) => r.route === '/photo/new')?.kind).toBe('editor');
  });

  it('names/<locale>.json exists for every locale with locale-prefixed paths', () => {
    for (const l of locales) {
      const names = JSON.parse(files[`names/${l.code}.json`]) as Record<string, { name: string; path: string }>;
      expect(names['tools/compress-video'].path, l.code).toBe(l.code === 'en-US' ? '/tools/compress-video' : `/${l.prefix}/tools/compress-video`);
      expect(names['tools/compress-video'].name.length, l.code).toBeGreaterThan(0);
    }
    const ru = JSON.parse(files['names/ru-RU.json']) as Record<string, { name: string }>;
    expect(ru['tools/compress-video'].name).toBe('Сжатие видео');
    expect(ru['pages/pricing'].name).toBe('Тарифы');
  });

  it('index.json lists every doc with title, kind, keywords and a token estimate', () => {
    const index = JSON.parse(files['index.json']) as Record<string, { title: string; kind: string; keywords: string[]; tokens: number }>;
    expect(Object.keys(index).sort()).toEqual(docs.map(([p]) => p.replace(/\.md$/, '')).sort());
    expect(index['tools/compress-video'].kind).toBe('tool');
    expect(index['tools/compress-video'].keywords).toContain('compress video online');
    expect(index['editors/photo/color'].tokens).toBeGreaterThan(100);
  });
});

describe('editor capability docs come from the registries', () => {
  it('Aperture: every layer type and every one of its params is listed', () => {
    const photo = docs.filter(([p]) => p.startsWith('editors/photo/')).map(([, b]) => b).join('\n');
    for (const type of Object.keys(LAYER_PARAMS) as LayerType[]) {
      expect(photo, type).toContain(`Layer type \`${type}\``);
      const shape = (LAYER_PARAMS[type] as unknown as { shape: Record<string, unknown> }).shape;
      for (const key of Object.keys(shape)) expect(photo, `${type}.${key}`).toContain(`\`${key}\``);
    }
    for (const p of BUILTIN_PRESETS) expect(files['editors/photo/presets.md'], p.id).toContain(`\`${p.id}\``);
    expect(files['editors/photo/light.md']).toContain('- `ev` (Exposure (EV)): -5 to 5, default 0');
  });

  it('Aperture: the layer → panel table matches the editor', () => {
    for (const type of Object.keys(LAYER_PARAMS) as LayerType[]) expect(PHOTO_LAYER_PANEL[type], type).toBe(panelForLayer(type));
  });

  it('Darkroom: Lumetri params with exact ranges, all transitions', () => {
    for (const p of LUMETRI_PARAMS) expect(files['editors/studio/effects.md']).toContain(`\`${p.key}\``);
    expect(files['editors/studio/effects.md']).toContain('- `exposure` (Exposure): -3 to 3, default 0, step 0.05, unit st');
    expect(files['editors/studio/transitions.md']).toContain('`crossDissolve`');
    expect(files['editors/studio/transitions.md']).toContain('`slideDown`');
    expect(files['editors/studio/titles.md']).toContain('lower-third');
  });

  it('Motion: every animator and every animatable property', () => {
    for (const id of ANIMATOR_IDS) expect(files['editors/vector/animators.md']).toContain(`\`${id}\``);
    for (const p of VECTOR_TRACK_PROPERTIES) {
      expect(files['editors/vector/timeline.md']).toContain(`\`${p}\``);
      expect(TRACK_PROPERTY_PATTERN.test(p.replace('[i]', '[0]')), p).toBe(true);
    }
  });
});

describe('no tier numbers in the corpus (decision 3)', () => {
  it('flags limit and price sentences, keeps format facts', () => {
    expect(statesTierNumber('Premium is $8 a month.')).toBe(true);
    expect(statesTierNumber('A free account raises that to 30 a day and 1 GB.')).toBe(true);
    expect(statesTierNumber('Each transcription is one AI job: by default 3 per day as a guest.')).toBe(true);
    expect(statesTierNumber('A guest may select 360p to 720p.')).toBe(true);
    expect(statesTierNumber('Smallest file is CRF 31, Balanced is CRF 26.')).toBe(false);
    expect(statesTierNumber('Outputs MP4 at 1080p or 720p while keeping the aspect ratio.')).toBe(false);
    expect(stripTierNumbers('A: Yes. Guests get 5 a day. Results stay 24 hours.')).toBe(
      'A: Yes. Daily limits and file caps depend on the plan; quote them only from the live plan block. Results stay 24 hours.',
    );
  });

  it('no exported doc states a price or a daily limit', () => {
    for (const [p, body] of docs) {
      expect(body, `${p} has a price`).not.toMatch(/[$€£]\s?\d/);
      expect(body, `${p} has a per-day number`).not.toMatch(/\b\d[\d,.]*\s*(?:\/\s?day|per day|a day)\b/i);
      for (const sentence of body.split(/(?<=[.!?])\s+|\n/)) expect(statesTierNumber(sentence), `${p}: ${sentence}`).toBe(false);
    }
  });
});

describe('size budget (decision 4)', () => {
  it('whole corpus ≤ 1.5 MB, every doc ≤ 24 KB', () => {
    const total = Object.values(files).reduce((n, b) => n + Buffer.byteLength(b), 0);
    expect(total).toBeLessThanOrEqual(MAX_CORPUS_BYTES);
    for (const [p, body] of docs) expect(Buffer.byteLength(body), p).toBeLessThanOrEqual(MAX_DOC_BYTES);
  });

  it('is deterministic (two builds are byte-identical)', () => {
    expect(buildMediKnowledge()).toEqual(files);
  });
});

// Freshness (decision 4): the committed API copy equals a fresh build. Point
// MEDI_KNOWLEDGE_DIR_OVERRIDE elsewhere to check another checkout; skipped with
// a clear message when the sibling repo is absent (a lone UI clone).
const apiDir = resolve(process.cwd(), process.env.MEDI_KNOWLEDGE_DIR_OVERRIDE ?? MEDI_KNOWLEDGE_DIR);
const haveApi = existsSync(join(apiDir, '..', 'retrieve.go'));

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

describe.skipIf(!haveApi)(`freshness against ${MEDI_KNOWLEDGE_DIR}`, () => {
  it('the API copy matches a fresh export (run `npm run export:medi` if this fails)', () => {
    const onDisk = Object.fromEntries(walk(apiDir).map((p) => [relative(apiDir, p), readFileSync(p, 'utf8')]));
    expect(Object.keys(onDisk).sort()).toEqual(Object.keys(files).sort());
    for (const [p, body] of Object.entries(files)) expect(onDisk[p] === body, `${p} is stale`).toBe(true);
  });
});

if (!haveApi) {
  describe('freshness', () => {
    it.skip(`skipped: ${apiDir} not found (sibling media_manipulator_api checkout absent)`, () => undefined);
  });
}
