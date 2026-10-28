/**
 * MM88 acceptance 3: no physical-direction utility remains in the shared chrome, so the
 * nav, footer, language menu, consent surfaces and account menu mirror correctly in Arabic
 * and Hebrew. Logical utilities (`start-*`/`end-*`, `ms-*`/`me-*`, `ps-*`/`pe-*`,
 * `border-s`/`border-e`, `text-start`/`text-end`) are the replacement. `space-x-*` is
 * already logical in Tailwind 4 but is replaced by `gap-*` here as well.
 *
 * `ltr:`/`rtl:`-prefixed physical utilities are allowed: they are the explicit, direction-
 * aware form (the active-link underline's transform origin uses them).
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const ROOT = join(__dirname, '..');
const CHROME = [
  'components/top-nav.tsx',
  'components/footer.tsx',
  'components/language-selector.tsx',
  'components/consent/consent-banner.tsx',
  'components/consent/consent-gate.tsx',
  'components/consent/consent-preferences.tsx',
  'components/account/account-menu.tsx',
  'components/account/account-dropdown.tsx',
  'components/account/account-sheet-links.tsx',
  'components/account/quota-meter.tsx',
  'components/skip-link.tsx',
];

// A physical utility as a whole class token, optionally behind non-direction variants
// (`hover:`, `sm:`, `after:` …). `ltr:` / `rtl:` variants are the sanctioned escape.
const PHYSICAL =
  /(?<![\w:-])((?:(?!ltr:|rtl:)[\w[\]&=>-]+:)*)(-?(?:right|left)-[\w./[\]-]+|text-(?:left|right)|-?m[lr]-[\w./[\]-]+|p[lr]-[\w./[\]-]+|border-[lr](?:-[\w./[\]-]+)?|rounded-[lr](?:-[\w./[\]-]+)?|space-x-[\w./[\]-]+)(?![\w-])/g;

function physicalClasses(file: string): string[] {
  const src = readFileSync(join(ROOT, file), 'utf8');
  // Class strings only: string literals and template literals. Comments may mention the
  // old classes by name.
  const strings = src.match(/"[^"\n]*"|'[^'\n]*'|`[^`]*`/g) ?? [];
  return strings.flatMap((s) => [...s.matchAll(PHYSICAL)].map((m) => m[0]));
}

describe('MM88: shared chrome uses logical direction utilities', () => {
  it.each(CHROME)('%s has no physical-direction class', (file) => {
    expect(physicalClasses(file)).toEqual([]);
  });

  it('the matcher catches each physical form and ignores logical and ltr:/rtl: ones', () => {
    const probe = (cls: string) => [...`"${cls}"`.matchAll(PHYSICAL)].map((m) => m[0]);
    expect(probe('absolute right-0 text-left ml-2 pr-3 border-l-2 hover:border-l-primary space-x-2 after:origin-left')).toEqual([
      'right-0',
      'text-left',
      'ml-2',
      'pr-3',
      'border-l-2',
      'hover:border-l-primary',
      'space-x-2',
    ]);
    expect(probe('end-0 text-start ms-2 pe-3 border-s-2 gap-2 ltr:after:origin-left rtl:after:origin-right')).toEqual([]);
  });
});
