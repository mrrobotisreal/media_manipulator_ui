import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { reviewedLocales, unreviewedLocales } from '@/i18n/locales';

// MM68: public/humans.txt is static, so this keeps its language lines in step
// with i18n/locales.ts. MM86: "Languages" names the reviewed (public) locales;
// "Also available" names the translated ones still pending native review.
describe('humans.txt', () => {
  const text = readFileSync(join(process.cwd(), 'public/humans.txt'), 'utf8');
  const lineOf = (prefix: string) => text.split('\n').find((l) => l.startsWith(prefix));

  it('names every reviewed locale under Languages, in registry order', () => {
    expect(lineOf('Languages: ')).toBe(`Languages: ${reviewedLocales.map((l) => l.englishLabel).join(', ')}`);
  });

  it('names every unreviewed locale under Also available, in registry order', () => {
    expect(lineOf('Also available: ')).toBe(`Also available: ${unreviewedLocales.map((l) => l.englishLabel).join(', ')}`);
  });
});
