/**
 * MM52 S1 spike: what i18next 26.x passes to a post-processor. The findings
 * (recorded in docs/design/TRANSLATOR_WORKBENCH.md §7 MM52) are asserted here so
 * an i18next upgrade that changes them fails loudly instead of mis-keying markers.
 */
import { createInstance } from 'i18next';
import { describe, expect, it } from 'vitest';

type Call = { value: string; key: unknown; options: Record<string, unknown> };

function spy(passResolved: boolean) {
  const calls: Call[] = [];
  const i18n = createInstance();
  void i18n
    .use({
      type: 'postProcessor',
      name: 'spy',
      process(value: string, key: unknown, options: Record<string, unknown>) {
        calls.push({ value, key, options });
        return value;
      },
    })
    .init({
      lng: 'ar-SA',
      fallbackLng: 'en-US',
      ns: ['interface'],
      defaultNS: 'interface',
      interpolation: { escapeValue: false },
      postProcess: ['spy'],
      postProcessPassResolved: passResolved,
      resources: {
        'en-US': {
          interface: {
            items_one: '{{count}} item',
            items_other: '{{count}} items',
            only: 'English only',
            outer: 'Get $t(brand) now',
            brand: 'Premium',
            list: ['first', 'second'],
          },
        },
        'ar-SA': {
          interface: {
            items_zero: 'لا عناصر',
            items_one: 'عنصر واحد',
            items_two: 'عنصران',
            items_few: '{{count}} عناصر',
            items_many: '{{count}} عنصرًا',
            items_other: '{{count}} عنصر',
            greet: 'مرحبا {{name}}',
          },
        },
        'ja-JP': { interface: { items_other: '{{count}}個' } },
      },
    });
  return { i18n, calls };
}

describe('i18next 26.x post-processor arguments (spike)', () => {
  it('passes the requested BASE key as an array, not the resolved plural key', () => {
    const { i18n, calls } = spy(false);
    i18n.t('items', { count: 3 });
    expect(calls[0].key).toEqual(['items']);
    expect(calls[0].options.i18nResolved).toBeUndefined();
  });

  it('with postProcessPassResolved, i18nResolved.exactUsedKey is the resolved key for all six Arabic forms', () => {
    const { i18n, calls } = spy(true);
    const expected: Array<[number, string]> = [
      [0, 'items_zero'],
      [1, 'items_one'],
      [2, 'items_two'],
      [3, 'items_few'],
      [11, 'items_many'],
      [100, 'items_other'],
    ];
    for (const [count] of expected) i18n.t('items', { count });
    const resolved = calls.map((c) => (c.options.i18nResolved as { exactUsedKey: string }).exactUsedKey);
    expect(resolved).toEqual(expected.map(([, k]) => k));
    const first = calls[0].options.i18nResolved as Record<string, unknown>;
    expect(first.usedNS).toBe('interface');
    expect(first.usedLng).toBe('ar-SA');
    expect(first.usedKey).toBe('items');
  });

  it('Japanese has `_other` only', () => {
    const { i18n, calls } = spy(true);
    i18n.t('items', { count: 1, lng: 'ja-JP' });
    i18n.t('items', { count: 5, lng: 'ja-JP' });
    expect(calls.map((c) => (c.options.i18nResolved as { exactUsedKey: string }).exactUsedKey)).toEqual([
      'items_other',
      'items_other',
    ]);
  });

  it('value is post-interpolation; i18nResolved.res is the raw template', () => {
    const { i18n, calls } = spy(true);
    i18n.t('greet', { name: 'ليلى' });
    expect(calls[0].value).toBe('مرحبا ليلى');
    expect((calls[0].options.i18nResolved as { res: string }).res).toBe('مرحبا {{name}}');
    expect(calls[0].options.name).toBe('ليلى');
  });

  it('a key served from the fallback language reports usedLng = the fallback', () => {
    const { i18n, calls } = spy(true);
    i18n.t('only');
    expect((calls[0].options.i18nResolved as { usedLng: string }).usedLng).toBe('en-US');
  });

  it('$t() nesting: the inner string is NOT post-processed (applyPostProcessor: false), the outer is, once', () => {
    const { i18n, calls } = spy(true);
    expect(i18n.t('outer', { lng: 'en-US' })).toBe('Get Premium now');
    expect(calls).toHaveLength(1);
    expect((calls[0].options.i18nResolved as { exactUsedKey: string }).exactUsedKey).toBe('outer');
  });

  it('returnObjects: each leaf is processed with its full dotted path', () => {
    const { i18n, calls } = spy(true);
    i18n.t('list', { lng: 'en-US', returnObjects: true });
    expect(calls.map((c) => (c.options.i18nResolved as { exactUsedKey: string }).exactUsedKey)).toEqual([
      'list.0',
      'list.1',
    ]);
  });

  it('a missing key still reaches the post-processor, with i18nResolved.res undefined', () => {
    const { i18n, calls } = spy(true);
    expect(i18n.t('nope.missing')).toBe('nope.missing');
    expect((calls[0].options.i18nResolved as { res: unknown }).res).toBeUndefined();
  });
});
