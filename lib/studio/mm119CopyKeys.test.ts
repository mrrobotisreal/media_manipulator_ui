import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { STATIC_STUDIO_OUTPUTS } from './studioOutputs';

// MM119 copy in every locale: the new dialog/panel keys exist, are non-empty, keep their
// interpolation tokens, and the Darkroom page copy names WebM and Opus. Preset labels are
// checked for every preset in the table, so a new preset row cannot ship untranslated.
const ROOT = join(process.cwd(), 'i18n', 'locales');
const LOCALES = readdirSync(ROOT).filter((d) => /^[a-z]{2}-[a-z]{2}$/.test(d));
const read = (loc: string, shard: string) => JSON.parse(readFileSync(join(ROOT, loc, 'interface', `${shard}.json`), 'utf8')) as Record<string, unknown>;
const at = (o: unknown, path: string): unknown => path.split('.').reduce<unknown>((n, k) => (n && typeof n === 'object' ? (n as Record<string, unknown>)[k] : undefined), o);

const KEYS: Array<[shard: string, key: string, tokens?: string[]]> = [
  ['tools', 'contentStudio.export.captionsEmbedded'],
  ['tools', 'contentStudio.export.captionsEmbeddedHint'],
  ['tools', 'contentStudio.exports.status_queued'],
  ['tools', 'contentStudio.exports.queuedHint'],
  ['pages', 'pricing.values.studioAudio', ['{{codecs}}']],
  ['pages', 'pricing.values.studioEmbeddedCaptions'],
  ...STATIC_STUDIO_OUTPUTS.presets.map((p) => ['tools', `contentStudio.export.preset_${p.key}`] as [string, string]),
  ...[...new Set(STATIC_STUDIO_OUTPUTS.warnings.map((w) => w.warning))].map((w) => ['tools', `contentStudio.export.warning_${w}`] as [string, string]),
];

describe('MM119 copy keys x18', () => {
  it('there are 18 locales', () => expect(LOCALES).toHaveLength(18));
  for (const loc of LOCALES) {
    it(`${loc}: every MM119 key is present and keeps its tokens`, () => {
      for (const [shard, key, tokens] of KEYS) {
        const v = at(read(loc, shard), key);
        expect(typeof v === 'string' && v.trim().length > 0, `${loc} ${shard}:${key}`).toBe(true);
        for (const tok of tokens ?? []) expect(v as string, `${loc} ${key} keeps ${tok}`).toContain(tok);
      }
    });
    it(`${loc}: the Darkroom page copy names WebM and Opus`, () => {
      const pages = read(loc, 'pages');
      for (const key of ['contentStudioGuide.supportedMediaBody', 'contentStudioGuide.exportBody']) {
        const v = String(at(pages, key) ?? '');
        expect(v, `${loc} ${key}`).toMatch(/WebM/);
        expect(v, `${loc} ${key}`).toMatch(/Opus/);
      }
    });
  }
});
