import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

import { locales } from '@/i18n/locales';
import { BLOG_POSTS, blogPostJsonLd } from '@/lib/blogPosts';
import { PLAN_PRICES } from '@/lib/billing/planPrices';
import { getAllRouteSeo, pricingProductLd, ROUTE_SEO_MAP, type JsonLd } from '@/lib/seo';
import { TUTORIAL_DATES } from '@/content/pageDates';

const all = (): JsonLd[] => getAllRouteSeo().flatMap((r) => r.jsonLd);
const offersOf = (b: JsonLd) => (b as { offers?: unknown }).offers;

describe('MM85 honest structured data (acceptance 3)', () => {
  it('Organization has a customer-support contactPoint in all 18 languages and a founder', () => {
    const org = ROUTE_SEO_MAP['/about'].jsonLd.find((b) => b['@type'] === 'Organization') as Record<string, unknown>;
    const cp = (org.contactPoint as Array<Record<string, unknown>>)[0];
    expect(cp.contactType).toBe('customer support');
    expect(cp.email).toBe('support@media-manipulator.com');
    expect(cp.availableLanguage).toEqual(locales.map((l) => l.code));
    expect(cp.availableLanguage as string[]).toHaveLength(18);
    expect(org.founder).toMatchObject({ '@type': 'Person', name: 'Mitchell Wintrow' });
  });

  it('no single free Offer remains: every app-level offers is the AggregateOffer', () => {
    const source = readFileSync(join(__dirname, 'seo.ts'), 'utf8');
    expect(source).not.toMatch(/'@type': 'Offer',\s*price: '0'/);
    const withOffers = all().filter((b) => offersOf(b) && b['@type'] !== 'Product');
    expect(withOffers.length).toBeGreaterThan(6);
    for (const b of withOffers) {
      expect(offersOf(b)).toEqual({
        '@type': 'AggregateOffer',
        lowPrice: '0',
        highPrice: String(PLAN_PRICES.pro.monthly),
        priceCurrency: 'USD',
        offerCount: 4,
      });
    }
  });

  it('blog and tutorial articles name a Person author and the Organization publisher', () => {
    for (const post of BLOG_POSTS) {
      const article = blogPostJsonLd(post)[0] as Record<string, unknown>;
      expect(article.author).toEqual({ '@type': 'Person', name: 'Mitchell Wintrow', url: 'https://www.media-manipulator.com/about' });
      expect(article.publisher).toMatchObject({ '@type': 'Organization', name: 'CreaTV Ltd.' });
    }
    for (const [path, dates] of Object.entries(TUTORIAL_DATES)) {
      const ld = ROUTE_SEO_MAP[path].jsonLd.find((b) => b['@type'] === 'TechArticle') as Record<string, unknown>;
      expect(ld, path).toBeTruthy();
      expect((ld.author as Record<string, unknown>)['@type']).toBe('Person');
      expect(ld.datePublished).toBe(dates.datePublished);
      expect(ld.dateModified).toBe(dates.dateModified);
    }
  });

  it('blog posts carry distinct-or-justified real dates, never the old shared 2026-05-15', () => {
    for (const p of BLOG_POSTS) {
      expect(p.dateModified).not.toBe('2026-05-15');
      expect(p.dateModified >= p.datePublished).toBe(true);
    }
  });

  it('/contact has ContactPage JSON-LD; /pricing has a Product with four Offers from the served prices', () => {
    expect(ROUTE_SEO_MAP['/contact'].jsonLd.some((b) => b['@type'] === 'ContactPage')).toBe(true);
    const product = pricingProductLd({ premium: { monthly: 8, yearly: 80 }, pro: { monthly: 15, yearly: 150 } }) as {
      offers: Array<{ name: string; price: string; priceSpecification?: Array<{ price: string; billingDuration: string }> }>;
    };
    expect(product.offers.map((o) => [o.name, o.price])).toEqual([
      ['No account', '0'],
      ['Free account', '0'],
      ['Premium', '8'],
      ['Pro', '15'],
    ]);
    expect(product.offers[2].priceSpecification?.map((s) => [s.price, s.billingDuration])).toEqual([
      ['8', 'P1M'],
      ['80', 'P1Y'],
    ]);
    // A served change wins over the build-time mirror.
    const served = pricingProductLd({ premium: { monthly: 9, yearly: 90 }, pro: {} }) as typeof product;
    expect(served.offers[2].price).toBe('9');
    expect(served.offers[3].price).toBe(String(PLAN_PRICES.pro.monthly));
  });

  it('PLAN_PRICES matches the price sentence in the English Terms', () => {
    const terms = readFileSync(join(__dirname, '..', 'i18n', 'locales', 'en-us', 'interface', 'pages.json'), 'utf8');
    const { premium, pro } = PLAN_PRICES;
    expect(terms).toContain(`Premium is $${premium.monthly} or €${premium.monthly} per month, or $${premium.yearly} or €${premium.yearly} per year`);
    expect(terms).toContain(`Pro is $${pro.monthly} or €${pro.monthly} per month, or $${pro.yearly} or €${pro.yearly} per year`);
  });
});
