import { describe, expect, it } from 'vitest';

import { buildKeyTable, groupLabel } from './keyTable';
import { shard } from './testing/fixtures';
import { pluralCategories } from './validators';

const english = {
  'files.summary_one': '{{count}} file',
  'files.summary_other': '{{count}} files',
  'files.title': 'Files',
};

const formsOf = (locale: string, categories?: Parameters<typeof buildKeyTable>[2]) => {
  const table = buildKeyTable(locale, [shard(locale, 'interface/components', english)], categories);
  const group = [...table.groups.values()][0];
  return { table, group, cats: group.forms.map((f) => f.plural!.category) };
};

describe('plural groups (criterion 5)', () => {
  it('ar shows six form fields (_zero _one _two _few _many _other) from Intl.PluralRules', () => {
    const { group, cats } = formsOf('ar-SA');
    expect(cats).toEqual(['zero', 'one', 'two', 'few', 'many', 'other']);
    expect(group.required).toEqual(pluralCategories('ar-SA'));
    // zero/two/few/many do not exist in the byte-copied shard: new keys to fill.
    expect(group.forms.filter((f) => f.isNew).map((f) => f.plural!.category)).toEqual(['zero', 'two', 'few', 'many']);
    expect(group.forms.every((f) => f.plural!.required)).toBe(true);
  });

  it('ja shows one required form (_other); the copied English _one is shown but flagged surplus', () => {
    const { group, cats } = formsOf('ja-JP');
    expect(group.required).toEqual(['other']);
    expect(cats).toEqual(['one', 'other']);
    expect(group.forms.find((f) => f.plural!.category === 'one')!.plural!.required).toBe(false);
    expect(group.forms.filter((f) => f.plural!.required).map((f) => f.plural!.category)).toEqual(['other']);
  });

  it('ru/uk need _one _few _many _other; he follows the runtime', () => {
    expect(formsOf('ru-RU').group.required).toEqual(['one', 'few', 'many', 'other']);
    expect(formsOf('uk-UA').group.required).toEqual(['one', 'few', 'many', 'other']);
    expect(formsOf('he-IL').group.required).toEqual(pluralCategories('he-IL'));
  });

  it('forms come from the categories passed in (stubbed Intl.PluralRules categories)', () => {
    const stub = { resolvedOptions: () => ({ pluralCategories: ['other', 'two'] }) };
    const { group, cats } = formsOf('xx-XX', pluralCategories('xx-XX', stub));
    expect(group.required).toEqual(['two', 'other']);
    expect(cats).toEqual(['one', 'two', 'other']);
  });

  it('the group header carries the English pair; non-plural keys stay single entries in English order', () => {
    const { table, group } = formsOf('ar-SA');
    expect(group.englishForms).toEqual({ one: '{{count}} file', other: '{{count}} files' });
    expect(table.entries.map((e) => e.key)).toEqual([
      'files.summary_zero',
      'files.summary_one',
      'files.summary_two',
      'files.summary_few',
      'files.summary_many',
      'files.summary_other',
      'files.title',
    ]);
    expect(table.byRef('interface', 'files.title')!.plural).toBeNull();
  });
});

describe('key table', () => {
  it('labels groups namespace › shard and detects <Trans> templates', () => {
    expect(groupLabel('interface/components')).toBe('interface › components');
    const t = buildKeyTable('de-DE', [shard('de-DE', 'interface/pages', { a: 'built by <strong>CreaTV</strong>', b: 'plain a < b' })]);
    expect(t.byRef('interface', 'a')!.trans).toBe(true);
    expect(t.byRef('interface', 'b')!.trans).toBe(false);
    expect(t.byRef('interface', 'a')!.file).toBe('i18n/locales/de-de/interface/pages.json');
  });
});
