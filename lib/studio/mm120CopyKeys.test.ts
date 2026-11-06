import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

// MM120 copy in every locale: the new dialog keys exist, are non-empty and keep their
// tokens; the Darkroom page copy names the Pro formats (AV1, ProRes, FLAC). Preset and
// warning labels for every table row are checked by mm119CopyKeys.test.ts.
const ROOT = join(process.cwd(), 'i18n', 'locales');
const LOCALES = readdirSync(ROOT).filter((d) => /^[a-z]{2}-[a-z]{2}$/.test(d));
const read = (loc: string, shard: string) => JSON.parse(readFileSync(join(ROOT, loc, 'interface', `${shard}.json`), 'utf8')) as Record<string, unknown>;
const at = (o: unknown, path: string): unknown => path.split('.').reduce<unknown>((n, k) => (n && typeof n === 'object' ? (n as Record<string, unknown>)[k] : undefined), o);

const KEYS: Array<[shard: string, key: string, tokens?: string[]]> = [
  ['tools', 'contentStudio.export.notWith', ['{{codec}}']],
  ['tools', 'contentStudio.export.proresNote'],
  ['tools', 'contentStudio.export.sizeEstimate', ['{{size}}']],
  ['tools', 'contentStudio.export.sizeLarge'],
  ['pages', 'pricing.values.studioLossless', ['{{codecs}}']],
];

describe('MM120 copy keys x18', () => {
  it('there are 18 locales', () => expect(LOCALES).toHaveLength(18));
  const en = read('en-us', 'tools');
  for (const loc of LOCALES) {
    it(`${loc}: every MM120 key is present and keeps its tokens`, () => {
      for (const [shard, key, tokens] of KEYS) {
        const v = at(read(loc, shard), key);
        expect(typeof v === 'string' && v.trim().length > 0, `${loc} ${shard}:${key}`).toBe(true);
        for (const tok of tokens ?? []) expect(v as string, `${loc} ${key} keeps ${tok}`).toContain(tok);
      }
    });
    it(`${loc}: the Darkroom page copy names AV1, ProRes and FLAC`, () => {
      const pages = read(loc, 'pages');
      for (const key of ['contentStudioGuide.supportedMediaBody', 'contentStudioGuide.exportBody']) {
        const v = String(at(pages, key) ?? '');
        for (const name of ['AV1', 'ProRes', 'FLAC']) expect(v, `${loc} ${key}`).toContain(name);
      }
    });
    if (loc !== 'en-us') {
      it(`${loc}: the MM120 dialog copy is translated (not the English string)`, () => {
        const tools = read(loc, 'tools');
        for (const key of ['contentStudio.export.proresNote', 'contentStudio.export.sizeLarge', 'contentStudio.export.warning_av1_playback', 'contentStudio.export.preset_mov_prores']) {
          expect(at(tools, key), `${loc} ${key}`).not.toBe(at(en, key));
        }
      });
    }
  }
});
