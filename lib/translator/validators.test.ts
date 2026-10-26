import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  extractNesting,
  extractPlaceholders,
  extractTags,
  pluralCategories,
  splitPluralKey,
  validateKeys,
  validatePluralGroup,
  validateValue,
  WARNING_CODES,
  type PluralCategory,
  type ValidationWarning,
  type ValueInput,
  type WarningCode,
} from './validators';

interface Case {
  name: string;
  input: ValueInput;
  /** Expected codes (exact set, order-insensitive). */
  codes: WarningCode[];
  tokens?: Partial<Record<WarningCode, string[]>>;
}

const U3000 = '　';

const cases: Case[] = [
  // placeholder_missing
  { name: 'placeholder_missing: de drops {{name}}', input: { key: 'hi', value: 'Hallo', english: 'Hello {{name}}', locale: 'de-DE' }, codes: ['placeholder_missing'], tokens: { placeholder_missing: ['{{name}}'] } },
  { name: 'placeholder_missing: ar drops {{count}} in the _other form (RTL)', input: { key: 'files_other', value: 'ملفات', english: '{{count}} files', locale: 'ar-SA', englishForms: { one: '1 file', other: '{{count}} files' } }, codes: ['placeholder_missing'], tokens: { placeholder_missing: ['{{count}}'] } },
  { name: 'placeholder_missing: duplicate token count is a multiset', input: { key: 'k', value: '{{a}}', english: '{{a}} {{a}}', locale: 'fr-FR' }, codes: ['placeholder_missing'] },
  { name: 'placeholder_missing: format variant {{date, datetime}} lost', input: { key: 'k', value: 'Le {{date}}', english: 'On {{date, datetime}}', locale: 'fr-FR' }, codes: ['placeholder_missing', 'placeholder_extra'] },
  { name: 'placeholder_missing: negative - ar _one may drop {{count}}', input: { key: 'files_one', value: 'ملف واحد', english: '1 file', locale: 'ar-SA', englishForms: { one: '1 file', other: '{{count}} files' } }, codes: [] },
  { name: 'placeholder_missing: negative - spacing {{ name }} equals {{name}}', input: { key: 'k', value: 'Hallo {{ name }}', english: 'Hello {{name}}', locale: 'de-DE' }, codes: [] },
  // placeholder_extra
  { name: 'placeholder_extra: es invents {{user}}', input: { key: 'k', value: 'Hola {{user}}', english: 'Hello', locale: 'es-ES' }, codes: ['placeholder_extra'], tokens: { placeholder_extra: ['{{user}}'] } },
  { name: 'placeholder_extra: duplicate of {{n}} beyond English count', input: { key: 'k', value: '{{n}} {{n}}', english: '{{n}}', locale: 'es-ES' }, codes: ['placeholder_extra'] },
  { name: 'placeholder_extra: plural form uses token absent from all English forms', input: { key: 'items_few', value: '{{count}} {{what}}', english: undefined, locale: 'ru-RU', englishForms: { one: '{{count}} item', other: '{{count}} items' } }, codes: ['placeholder_extra'], tokens: { placeholder_extra: ['{{what}}'] } },
  { name: 'placeholder_extra: negative - plural _few with {{count}} is fine', input: { key: 'items_few', value: '{{count}} предмета', english: undefined, locale: 'ru-RU', englishForms: { one: '{{count}} item', other: '{{count}} items' } }, codes: [] },
  // plural_forms are covered through validatePluralGroup below; value-level negative
  { name: 'plural_forms: negative - validateValue never emits plural_forms', input: { key: 'items_few', value: 'x', english: undefined, locale: 'ru-RU' }, codes: [] },
  // tag_unbalanced
  { name: 'tag_unbalanced: closing tag missing', input: { key: 'k', value: 'Klick <strong>hier', english: 'Click <strong>here</strong>', locale: 'de-DE' }, codes: ['tag_unbalanced'] },
  { name: 'tag_unbalanced: Trans index tag <0> renamed to <1>', input: { key: 'k', value: 'Voir <1>ici</1>', english: 'See <0>here</0>', locale: 'fr-FR' }, codes: ['tag_unbalanced'] },
  { name: 'tag_unbalanced: crossed nesting', input: { key: 'k', value: '<a>x<b>y</a></b>', english: '<a>x<b>y</b></a>', locale: 'fr-FR' }, codes: ['tag_unbalanced'] },
  { name: 'tag_unbalanced: unbalanced even with English undefined', input: { key: 'k', value: '<b>oops', english: undefined, locale: 'fr-FR' }, codes: ['tag_unbalanced'] },
  { name: 'tag_unbalanced: negative - literal unclosed <img> copied from English', input: { key: 'k', value: 'Texte <img> ici', english: 'Text <img> here', locale: 'fr-FR' }, codes: [] },
  { name: 'tag_unbalanced: negative - named tags reordered but same set', input: { key: 'k', value: '<linkHow>comment</linkHow> <strong>vite</strong>', english: '<strong>fast</strong> <linkHow>how</linkHow>', locale: 'fr-FR' }, codes: [] },
  // empty
  { name: 'empty: blank value', input: { key: 'k', value: '', english: 'Hello', locale: 'de-DE' }, codes: ['empty'] },
  { name: 'empty: whitespace-only value skips other checks', input: { key: 'k', value: '   ', english: 'Hello {{name}}', locale: 'de-DE' }, codes: ['empty'] },
  { name: 'empty: new key English lacks, blank value', input: { key: 'k_few', value: '', english: undefined, locale: 'ar-SA' }, codes: ['empty'] },
  { name: 'empty: negative - blank value where English is also blank', input: { key: 'k', value: '', english: '', locale: 'de-DE' }, codes: [] },
  // same_as_english
  { name: 'same_as_english: untranslated de string', input: { key: 'k', value: 'Download', english: 'Download', locale: 'de-DE' }, codes: ['same_as_english'] },
  { name: 'same_as_english: ja copy with a placeholder', input: { key: 'k', value: 'Save {{name}}', english: 'Save {{name}}', locale: 'ja-JP' }, codes: ['same_as_english'] },
  { name: 'same_as_english: negative - en-GB locale', input: { key: 'k', value: 'Colour', english: 'Colour', locale: 'en-GB' }, codes: [] },
  { name: 'same_as_english: negative - only placeholders/tags/digits', input: { key: 'k', value: '{{count}} <0>1</0>', english: '{{count}} <0>1</0>', locale: 'de-DE' }, codes: [] },
  { name: 'same_as_english: negative - different text', input: { key: 'k', value: 'Herunterladen', english: 'Download', locale: 'de-DE' }, codes: [] },
  // whitespace_drift
  { name: 'whitespace_drift: ja leading ideographic space U+3000 (CJK)', input: { key: 'k', value: `${U3000}ダウンロード`, english: 'Download', locale: 'ja-JP' }, codes: ['whitespace_drift'] },
  { name: 'whitespace_drift: trailing space dropped', input: { key: 'k', value: 'Hallo', english: 'Hello ', locale: 'de-DE' }, codes: ['whitespace_drift'] },
  { name: 'whitespace_drift: NBSP at start', input: { key: 'k', value: ' Bonjour', english: 'Hello', locale: 'fr-FR' }, codes: ['whitespace_drift'] },
  { name: 'whitespace_drift: negative - same padding kept', input: { key: 'k', value: ' Hallo ', english: ' Hello ', locale: 'de-DE' }, codes: [] },
  // nesting_changed
  { name: 'nesting_changed: $t() reference removed', input: { key: 'k', value: 'Willkommen', english: 'Welcome to $t(common.brand)', locale: 'de-DE' }, codes: ['nesting_changed'] },
  { name: 'nesting_changed: different nested key', input: { key: 'k', value: 'Bienvenue $t(common.other)', english: 'Welcome $t(common.brand)', locale: 'fr-FR' }, codes: ['nesting_changed'] },
  { name: 'nesting_changed: options changed', input: { key: 'k', value: 'x $t(a.b, {"n": 2})', english: 'x $t(a.b, {"n": 1})', locale: 'fr-FR' }, codes: ['nesting_changed'] },
  { name: 'nesting_changed: negative - spacing differs only', input: { key: 'k', value: 'x $t( common.brand )', english: 'x $t(common.brand)', locale: 'fr-FR' }, codes: [] },
  // RTL / CJK clean cases
  { name: 'RTL: Hebrew keeps its tokens, no warnings', input: { key: 'k', value: 'שלום {{name}}, <strong>ברוך הבא</strong>', english: 'Hello {{name}}, <strong>welcome</strong>', locale: 'he-IL' }, codes: [] },
  { name: 'RTL: Arabic with {{date, datetime}} kept, no warnings', input: { key: 'k', value: 'في {{date, datetime}}', english: 'On {{date, datetime}}', locale: 'ar-SA' }, codes: [] },
  { name: 'CJK: Japanese keeps placeholder, no warnings', input: { key: 'k', value: '{{name}}さん、ようこそ', english: 'Welcome {{name}}', locale: 'ja-JP' }, codes: [] },
];

describe('validators: warning table', () => {
  it.each(cases)('$name', ({ input, codes, tokens }) => {
    const got = validateValue(input);
    expect(got.map((w) => w.code).sort()).toEqual([...codes].sort());
    for (const w of got) {
      expect(w.id).toBe(`${w.key}#${w.code}`);
      expect(w.message.length).toBeGreaterThan(0);
    }
    for (const [code, toks] of Object.entries(tokens ?? {})) {
      expect(got.find((w) => w.code === code)?.tokens).toEqual(toks);
    }
  });

  it('table covers every non-plural code positively at least twice and negatively once', () => {
    for (const code of WARNING_CODES.filter((c) => c !== 'plural_forms')) {
      const pos = cases.filter((c) => c.name.startsWith(`${code}:`) && !c.name.includes('negative') && c.codes.includes(code));
      const neg = cases.filter((c) => c.name.startsWith(`${code}:`) && c.name.includes('negative'));
      expect(pos.length, `${code} positives`).toBeGreaterThanOrEqual(2);
      expect(neg.length, `${code} negatives`).toBeGreaterThanOrEqual(1);
    }
  });
});

interface GroupCase {
  name: string;
  locale: string;
  forms: Partial<Record<PluralCategory, string>>;
  categories?: PluralCategory[];
  tokens: string[];
}

const groupCases: GroupCase[] = [
  { name: 'plural_forms: ar with only one/other is missing zero,two,few,many (RTL)', locale: 'ar-SA', forms: { one: 'ملف', other: 'ملفات' }, tokens: ['missing:zero', 'missing:two', 'missing:few', 'missing:many'] },
  { name: 'plural_forms: ja with one+other has surplus one (CJK)', locale: 'ja-JP', forms: { one: '1個', other: '{{count}}個' }, tokens: ['surplus:one'] },
  { name: 'plural_forms: ru empty string counts as missing', locale: 'ru-RU', forms: { one: 'a', few: '', many: 'c', other: 'd' }, tokens: ['missing:few'] },
  { name: 'plural_forms: categories override reports missing and surplus together', locale: 'xx', forms: { one: 'a', two: 'b' }, categories: ['one', 'other'], tokens: ['missing:other', 'surplus:two'] },
  { name: 'plural_forms: negative - ja with only _other', locale: 'ja-JP', forms: { other: '{{count}}個' }, tokens: [] },
  { name: 'plural_forms: negative - en one+other', locale: 'en-US', forms: { one: 'a', other: 'b' }, tokens: [] },
  { name: 'plural_forms: negative - he one/two/other via override', locale: 'he-IL', forms: { one: 'a', two: 'b', other: 'c' }, categories: ['one', 'two', 'other'], tokens: [] },
];

describe('validators: plural groups', () => {
  it.each(groupCases)('$name', ({ locale, forms, categories, tokens }) => {
    const got = validatePluralGroup({ base: 'files', locale, forms, categories });
    if (tokens.length === 0) {
      expect(got).toEqual([]);
    } else {
      expect(got).toHaveLength(1);
      expect(got[0].code).toBe('plural_forms');
      expect(got[0].key).toBe('files');
      expect(got[0].id).toBe('files#plural_forms');
      expect(got[0].tokens).toEqual(tokens);
    }
  });
});

describe('validators: pluralCategories', () => {
  it('ar-SA yields the six forms in canonical order', () => {
    expect(pluralCategories('ar-SA')).toEqual(['zero', 'one', 'two', 'few', 'many', 'other']);
  });
  it('ja-JP yields only other', () => {
    expect(pluralCategories('ja-JP')).toEqual(['other']);
  });
  it('ru-RU yields one, few, many, other', () => {
    expect(pluralCategories('ru-RU')).toEqual(['one', 'few', 'many', 'other']);
  });
  it('stubbed rules in odd order are returned in canonical order', () => {
    const rules = { resolvedOptions: () => ({ pluralCategories: ['other', 'one'] }) };
    expect(pluralCategories('xx', rules)).toEqual(['one', 'other']);
  });
  it('stubbed rules that throw fall back to one, other', () => {
    const rules = {
      resolvedOptions: (): { pluralCategories: string[] } => {
        throw new Error('boom');
      },
    };
    expect(pluralCategories('xx', rules)).toEqual(['one', 'other']);
  });
  it('invalid locale falls back to one, other', () => {
    expect(pluralCategories('not a locale!!')).toEqual(['one', 'other']);
  });
});

describe('validators: extractors', () => {
  it.each([
    ['{{ name }}', ['name']],
    ['{{name, datetime}} and {{name,datetime}}', ['name, datetime', 'name, datetime']],
    ['{{- html}}', ['html']],
    ['{{a}} {{b}} {{a}}', ['a', 'b', 'a']],
    ['no tokens', []],
  ])('extractPlaceholders(%j)', (text, expected) => {
    expect(extractPlaceholders(text)).toEqual(expected);
  });

  it.each([
    ['<strong>a</strong>', ['strong'], true],
    ['<0>a</0> <1/>', ['0', '1'], true],
    ['<br />', ['br'], true],
    ['<a>x', ['a'], false],
    ['x</a>', [], false],
    ['<a><b></a></b>', ['a', 'b'], false],
    ['1 < 2 and 3 > 2', [], true],
  ])('extractTags(%j)', (text, names, balanced) => {
    expect(extractTags(text)).toEqual({ names, balanced });
  });

  it.each([
    ['$t(a.b)', ['a.b']],
    ['$t( a.b ,  {"x": 1} )', ['a.b, {"x": 1}']],
    ['$t(a) and $t(b, {"c": "(d)"})', ['a', 'b, {"c": "(d)"}']],
    ['none', []],
  ])('extractNesting(%j)', (text, expected) => {
    expect(extractNesting(text)).toEqual(expected);
  });

  it.each([
    ['items_few', { base: 'items', category: 'few' }],
    ['a.b.items_other', { base: 'a.b.items', category: 'other' }],
    ['items', null],
    ['items_fewer', null],
    ['_one', null],
    ['one_items', null],
  ])('splitPluralKey(%j)', (key, expected) => {
    expect(splitPluralKey(key)).toEqual(expected);
  });
});

describe('validators: validateKeys', () => {
  const english = { 'a.files_one': '1 file', 'a.files_other': '{{count}} files', 'a.title': 'Title' };

  it('finds a group warning and a value warning, deduplicated by id', () => {
    const values = { 'a.files_one': 'ملف', 'a.files_other': 'ملفات', 'a.title': 'Title' };
    const got = validateKeys({
      locale: 'ar-SA',
      keys: ['a.files_one', 'a.files_other', 'a.files_one', 'a.title'],
      values,
      english,
    });
    const ids = got.map((w) => w.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toContain('a.files#plural_forms');
    expect(ids).toContain('a.files_other#placeholder_missing');
    expect(ids).toContain('a.title#same_as_english');
    expect(got.filter((w) => w.code === 'plural_forms')).toHaveLength(1);
    expect(ids).not.toContain('a.files_one#placeholder_missing');
  });

  it('a clean ja group yields no warnings', () => {
    const got = validateKeys({
      locale: 'ja-JP',
      keys: ['a.files_other'],
      values: { 'a.files_other': '{{count}}個のファイル' },
      english,
    });
    expect(got).toEqual([]);
  });

  it('honours the categories override', () => {
    const got: ValidationWarning[] = validateKeys({
      locale: 'xx',
      keys: ['a.files_one'],
      values: { 'a.files_one': '1 x' },
      english,
      categories: ['one', 'other'],
    });
    expect(got.map((w) => w.id)).toEqual(['a.files#plural_forms']);
  });
});

describe('validators: robustness and purity', () => {
  it.each([
    ['unterminated {{', '{{ name'],
    ['lone <', '<'],
    ['lone $t(', '$t(a'],
    ['lone >', '>'],
    ['huge repeated', '{{'.repeat(5000)],
    ['emoji and RTL marks', '‏😀 {{x}} ‎'],
  ])('validateValue does not throw: %s', (_n, value) => {
    expect(() => validateValue({ key: 'k', value, english: value, locale: 'ar-SA' })).not.toThrow();
    expect(() => validateValue({ key: 'k', value, english: undefined, locale: 'zz' })).not.toThrow();
  });

  it('validateValue tolerates a non-string value at runtime', () => {
    expect(() => validateValue({ key: 'k', value: undefined as unknown as string, english: 'x', locale: 'de' })).not.toThrow();
  });

  it('module source has no import statement (dependency-free)', () => {
    const src = readFileSync(join(__dirname, 'validators.ts'), 'utf8');
    expect(src).not.toMatch(/^\s*import[\s{*'"]/m);
    expect(src).not.toMatch(/\bimport\s*\(/);
    expect(src).not.toMatch(/\brequire\s*\(/);
  });
});
