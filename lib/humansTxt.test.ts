import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { translatedLocales } from '@/i18n/locales';

// MM68: public/humans.txt is static, so this keeps its language line in step
// with the translated locales in i18n/locales.ts.
describe('humans.txt', () => {
  it('names every translated locale, in registry order', () => {
    const text = readFileSync(join(process.cwd(), 'public/humans.txt'), 'utf8');
    const line = text.split('\n').find((l) => l.startsWith('Languages: '));
    expect(line).toBe(`Languages: ${translatedLocales.map((l) => l.englishLabel).join(', ')}`);
  });
});
