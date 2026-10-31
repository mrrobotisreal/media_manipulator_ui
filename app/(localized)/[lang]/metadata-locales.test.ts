import { describe, expect, it } from 'vitest';

import { generateMetadata as accountMetadata } from './account/page';
import { generateMetadata as pricingMetadata } from './pricing/page';
import { generateMetadata as toolsMetadata } from './tools/page';
import { generateMetadata as voicesMetadata } from './voices/page';
import { locales } from '@/i18n/locales';

const params = (lang: string) => ({ params: Promise.resolve({ lang }) });

/**
 * MM92: a translator found English in every non-English locale. The <title>
 * of /account was a literal, and /pricing and /tools fell back to the English
 * pair for the 11 locales without a hand-written SEO override. Each page now
 * reuses its own localized heading, so no locale's browser tab reads English.
 */
describe('MM92: localized <title> and description on the four reported pages', () => {
  const english = {
    account: 'Your account',
    pricing: 'Pricing',
    tools: 'Free Online Media Tools',
    voices: 'My voices on ElevenLabs',
  };

  it.each(locales.filter((l) => l.code !== 'en-US').map((l) => [l.prefix, l.code]))(
    '%s (%s) has no English title on account, pricing, tools or voices',
    async (prefix) => {
      const [account, pricing, tools, voices] = await Promise.all([
        accountMetadata(params(prefix)),
        pricingMetadata(params(prefix)),
        toolsMetadata(params(prefix)),
        voicesMetadata(params(prefix)),
      ]);
      expect(String(account.title)).not.toContain(english.account);
      expect(String(pricing.title)).not.toContain(english.pricing);
      expect(String(tools.title)).not.toContain(english.tools);
      expect(String(voices.title)).not.toContain(english.voices);
      for (const m of [account, pricing, tools, voices]) {
        expect(String(m.title)).toContain('Media Manipulator');
        expect(String(m.description ?? '')).not.toBe('');
      }
    },
  );

  it('English keeps its hand-written titles', async () => {
    expect(String((await pricingMetadata(params('en'))).title)).toBe('Pricing — Media Manipulator');
    expect(String((await toolsMetadata(params('en'))).title)).toBe('Free Online Media Tools | Media Manipulator');
    expect(String((await accountMetadata(params('en'))).title)).toBe('Your account — Media Manipulator');
  });

  it('a locale with a hand-written SEO override still gets it (de /tools)', async () => {
    expect(String((await toolsMetadata(params('de'))).title)).toBe('Kostenlose Online-Medientools | Media Manipulator');
  });
});
