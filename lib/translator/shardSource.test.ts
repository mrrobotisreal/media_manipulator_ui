import { describe, expect, it } from 'vitest';

import { buildKeyTable } from './keyTable';
import { flattenStrings, loadTranslatorShards, shardFilePath } from './shardSource';
import { pluralCategories } from './validators';

describe('translator shard source (lazy, full locale)', () => {
  it('loads every editable shard of ar-SA and English, with repo file paths', async () => {
    const shards = await loadTranslatorShards('ar-SA');
    expect(shards.map((s) => s.shard)).toContain('interface/pages');
    expect(shards.map((s) => s.shard)).toContain('interface/articles');
    expect(shards.map((s) => s.shard)).not.toContain('interface/metadata');
    const pages = shards.find((s) => s.shard === 'interface/pages')!;
    expect(pages.file).toBe('i18n/locales/ar-sa/interface/pages.json');
    expect(pages.englishFile).toBe('i18n/locales/en-us/interface/pages.json');
    expect(Object.keys(pages.values).length).toBeGreaterThan(1000);
  });

  it('the real ar-SA table has thousands of keys and six-form plural groups', async () => {
    const table = buildKeyTable('ar-SA', await loadTranslatorShards('ar-SA'));
    expect(table.size).toBeGreaterThan(4500);
    const group = [...table.groups.values()][0];
    expect(group.forms.map((f) => f.plural!.category)).toEqual(pluralCategories('ar-SA'));
  });

  it('flattens arrays and skips non-string leaves', () => {
    expect(flattenStrings({ a: { b: 'x', c: [{ d: 'y' }, 'z'], e: true } })).toEqual({ 'a.b': 'x', 'a.c.0.d': 'y', 'a.c.1': 'z' });
    expect(shardFilePath('zh-TW', 'error/_core')).toBe('i18n/locales/zh-tw/error/_core.json');
  });
});
