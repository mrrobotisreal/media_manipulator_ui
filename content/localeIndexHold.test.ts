import { describe, expect, it } from 'vitest';
import { buildToolMetadata, isToolPageIndexable } from '@/lib/metadata';
import { fullyCoveredLocaleCodes, localeBodyCoverage } from '@/i18n/toolPageContent';
import { isLocaleIndexHeld } from '@/content/localeIndexHold';

// Mitch, 2026-11-04: keep the translated Aperture landing out of the index during the AdSense review.
describe('locale index hold (Aperture landing)', () => {
  it('the uk/ru/de bodies are complete, yet only English is indexable and advertised', () => {
    expect(isLocaleIndexHeld('aperture')).toBe(true);
    for (const code of ['uk-UA', 'ru-RU', 'de-DE']) {
      expect(localeBodyCoverage('aperture', code).complete, code).toBe(true);
      expect(isToolPageIndexable('aperture', code), code).toBe(false);
      const meta = buildToolMetadata('aperture', code);
      expect(meta.robots, code).toMatchObject({ index: false, follow: true });
      expect(meta.alternates?.languages, code).toBeUndefined();
    }
    expect(isToolPageIndexable('aperture', 'en-US')).toBe(true);
    expect(fullyCoveredLocaleCodes('aperture')).toEqual(['en-US']);
  });

  it('other reviewed pages keep the MM86 rule', () => {
    expect(isLocaleIndexHeld('compress-image')).toBe(false);
    expect(isToolPageIndexable('compress-image', 'de-DE')).toBe(true);
  });
});
