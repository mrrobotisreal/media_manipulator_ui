import { createInstance } from 'i18next';
import { beforeEach, describe, expect, it } from 'vitest';

import { getTranslatorMarkerRuntime } from './mode';
import { findMarkers, stripMarkers } from './markerCodec';
import { keyRegistry, markerIndex } from './keyRegistry';
import { KEY_MARKER_NAME, TRANSLATOR_SENTINEL, keyMarkerPostProcessor, markServerString } from './keyMarker';

function instance(lng: string) {
  const i18n = createInstance();
  void i18n.use(keyMarkerPostProcessor).init({
    lng,
    fallbackLng: 'en-US',
    ns: ['interface'],
    defaultNS: 'interface',
    interpolation: { escapeValue: false },
    postProcess: [KEY_MARKER_NAME],
    postProcessPassResolved: true,
    resources: {
      'en-US': {
        interface: {
          items_one: '{{count}} item',
          items_other: '{{count}} items',
          brand: 'Premium',
          outer: 'Get {{what}} now',
          nested: 'Try $t(brand)',
          onlyEn: 'English only',
          sections: [{ id: 'retention', title: 'Retention' }],
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
        },
      },
      'ja-JP': { interface: { items_other: '{{count}}個' } },
    },
  });
  return i18n;
}

const refOf = (s: string) => {
  const [m] = findMarkers(s);
  return m ? keyRegistry.resolve(m.index) : undefined;
};

describe('mmKeyMarker post-processor', () => {
  beforeEach(() => keyRegistry.clear());

  it('registers the runtime in the mode.ts slot with the sentinel', () => {
    const rt = getTranslatorMarkerRuntime();
    expect(rt?.postProcessor.name).toBe(KEY_MARKER_NAME);
    expect(rt?.sentinel).toBe(TRANSLATOR_SENTINEL);
  });

  it.each([
    [0, 'items_zero'],
    [1, 'items_one'],
    [2, 'items_two'],
    [3, 'items_few'],
    [11, 'items_many'],
    [100, 'items_other'],
  ])('ar count=%i stores the resolved key %s', (count, key) => {
    const out = instance('ar-SA').t('items', { count });
    expect(refOf(out)).toMatchObject({ ns: 'interface', key, lng: 'ar-SA', count });
  });

  it('ja stores `_other` for every count', () => {
    const t = instance('ja-JP').t;
    expect(refOf(t('items', { count: 1 }))?.key).toBe('items_other');
    expect(refOf(t('items', { count: 7 }))?.key).toBe('items_other');
  });

  it('a plural served from the English fallback is filed under the page locale’s category', () => {
    // he-IL has no `items_*` here, so English answers; count 2 is `_two` in Hebrew.
    const out = instance('he-IL').t('items', { count: 2 });
    expect(stripMarkers(out)).toBe('2 items');
    expect(refOf(out)).toMatchObject({ key: 'items_two', lng: 'he-IL' });
  });

  it('records the raw template and params for interpolated strings', () => {
    const out = instance('en-US').t('outer', { what: 'Premium' });
    expect(stripMarkers(out)).toBe('Get Premium now');
    expect(refOf(out)).toMatchObject({ template: 'Get {{what}} now', params: { what: 'Premium' } });
  });

  it('an interpolated value that is itself marked yields exactly one (outer) marker', () => {
    const i18n = instance('en-US');
    const inner = i18n.t('brand');
    const out = i18n.t('outer', { what: inner });
    expect(findMarkers(out)).toHaveLength(1);
    expect(refOf(out)?.key).toBe('outer');
    expect(stripMarkers(out)).toBe('Get Premium now');
    expect(refOf(out)?.params).toEqual({ what: 'Premium' });
  });

  it('$t() nesting yields one marker for the outer key', () => {
    const out = instance('en-US').t('nested');
    expect(findMarkers(out).map((m) => keyRegistry.resolve(m.index)?.key)).toEqual(['nested']);
  });

  it('missing keys and identifier leaves stay unmarked', () => {
    const i18n = instance('en-US');
    expect(i18n.t('does.not.exist')).toBe('does.not.exist');
    const sections = i18n.t('sections', { returnObjects: true }) as Array<{ id: string; title: string }>;
    expect(sections[0].id).toBe('retention');
    expect(refOf(sections[0].title)?.key).toBe('sections.0.title');
  });

  it('markServerString produces the same marker as the client plugin for the same key', () => {
    const client = instance('ar-SA').t('items', { count: 3 });
    const server = markServerString('3 عناصر', { ns: 'interface', key: 'items_few', lng: 'ar-SA' });
    expect(server).toBe(client);
    expect(findMarkers(server)[0].index).toBe(markerIndex({ ns: 'interface', key: 'items_few', lng: 'ar-SA' }));
  });
});
