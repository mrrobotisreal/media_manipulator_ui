import { describe, expect, it } from 'vitest';

import { TUTORIAL_DATES } from '@/content/pageDates';
import { TUTORIAL_GOALS, TUTORIAL_INDEX, tutorialBrandValues } from '@/content/tutorialIndex';
import { MEDI_BRAND } from '@/lib/assistant/brand';
import { PHOTO_BRAND } from '@/lib/photo/brand';
import pages from '@/i18n/locales/en-us/interface/pages.json';

describe('tutorials index registry', () => {
  it('lists every dated tutorial exactly once, and only dated tutorials', () => {
    const indexed = TUTORIAL_INDEX.map((e) => e.path).sort();
    expect(indexed).toEqual(Object.keys(TUTORIAL_DATES).sort());
  });

  it('puts every tutorial in a known goal group with a unique key', () => {
    for (const e of TUTORIAL_INDEX) expect(TUTORIAL_GOALS).toContain(e.goal);
    const keys = TUTORIAL_INDEX.map((e) => e.key);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('gives every tutorial whose copy says {{brand}} a brand of its own', () => {
    // The copy never spells a brand, and each tutorial is about a different product. A brand-templated
    // tutorial with no `brand` here would render "{{brand}}" (or someone else's name) on the index.
    const copy = (pages as unknown as { tutorials: { tutorials: Record<string, { title?: string; excerpt?: string }> } }).tutorials.tutorials;
    for (const e of TUTORIAL_INDEX) {
      const text = `${copy[e.key]?.title ?? ''} ${copy[e.key]?.excerpt ?? ''}`;
      expect(text.trim(), `${e.key} has copy`).not.toBe('');
      if (text.includes('{{brand}}')) expect(e.brand, `${e.key} needs a brand`).toBeTruthy();
    }
    expect(tutorialBrandValues('medi')).toEqual({ brand: MEDI_BRAND });
    expect(tutorialBrandValues('aperture')).toEqual({ brand: PHOTO_BRAND });
    expect(tutorialBrandValues('videoGettingStarted')).toEqual({});
  });
});
