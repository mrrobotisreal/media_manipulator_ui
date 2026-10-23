import { describe, expect, it } from 'vitest';
import raw from './catalog.json';
import { buildCatalogIndex, categoryMeta, getCatalog, lookupTag, catalogSchema } from './catalog';
import { CATEGORY_ORDER } from './types';

describe('committed catalog.json', () => {
  it('passes the Zod schema', () => {
    const parsed = catalogSchema.safeParse(raw);
    expect(parsed.success).toBe(true);
  });

  it('declares every UI category, in design order', () => {
    expect(raw.categories.map((c) => c.id)).toEqual([...CATEGORY_ORDER]);
  });

  it('every row category is a known category', () => {
    const ids = new Set(raw.categories.map((c) => c.id));
    expect(raw.tags.filter((t) => !ids.has(t.category))).toEqual([]);
  });

  it('every privacy value is empty or a known class', () => {
    const ok = new Set(['', 'location', 'identity', 'device', 'history']);
    expect(raw.tags.filter((t) => !ok.has(t.privacy))).toEqual([]);
  });
});

describe('lazy loader', () => {
  it('resolves one shared index', async () => {
    const [a, b] = await Promise.all([getCatalog(), getCatalog()]);
    expect(a).toBe(b);
    expect(a.catalog.tags.length).toBeGreaterThan(1000);
  });
});

describe('lookupTag', () => {
  const index = buildCatalogIndex(raw);

  it('prefers the exact group:tag row', () => {
    const row = lookupTag(index, 'XMP-exif', 'DateTimeOriginal', 'xmp');
    expect(row?.group).toBe('XMP-exif');
    expect(row?.category).toBe('xmp');
  });

  it('falls back to tag-only and uses the category to disambiguate', () => {
    expect(lookupTag(index, 'ExifIFD', 'DateTimeOriginal', 'camera')?.category).toBe('camera');
    expect(lookupTag(index, 'ExifIFD', 'DateTimeOriginal', 'datetime')?.category).toBe('datetime');
  });

  it('is case-insensitive on group and tag', () => {
    expect(lookupTag(index, 'gps', 'gpslatitude', 'gps')?.privacy).toBe('location');
  });

  it('matches wildcard rows such as OffsetTime*', () => {
    expect(lookupTag(index, 'ExifIFD', 'OffsetTimeOriginal')).toBeDefined();
  });

  it('matches a group-scoped catch-all only inside its group', () => {
    expect(lookupTag(index, 'XMP-xmpDM', 'ZzzNotListed')?.group).toBe('XMP-xmpDM');
    expect(lookupTag(index, 'Nikon', 'ZzzNotListed')).toBeUndefined();
  });

  it('returns undefined for unknown tags', () => {
    expect(lookupTag(index, 'Nikon', 'ZzzNotARealTag')).toBeUndefined();
  });
});

describe('categoryMeta', () => {
  it('returns the category record or undefined', () => {
    const index = buildCatalogIndex(raw);
    expect(categoryMeta(index, 'gps')?.id).toBe('gps');
    expect(categoryMeta(index, 'nope')).toBeUndefined();
  });
});
