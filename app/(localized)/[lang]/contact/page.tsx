import type { Metadata } from 'next';

import { JsonLd } from '@/components/seo/json-ld';
import { buildMetadata } from '@/lib/metadata';
import { getServerMetadataT } from '@/lib/i18n/server';
import { resolveLangParam } from '@/lib/i18n/routeLocale';
import ContactPage from '@/views/contact';

// MM85: indexable contact page, in the sitemap with every locale's alternate.
// Canonical/robots/hreflang come from buildMetadata ('/contact' is in lib/seo.ts
// with its ContactPage JSON-LD); the title and description are localized here.
type PageParams = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { lang } = await params;
  const locale = resolveLangParam(lang);
  const base = buildMetadata('/contact', locale);
  const t = getServerMetadataT('interface', locale);
  const title = t('contact.metaTitle');
  const description = t('contact.metaDesc');
  return {
    ...base,
    title,
    description,
    openGraph: { ...base.openGraph, title, description },
    twitter: { ...base.twitter, title, description },
  };
}

export default async function Contact({ params }: PageParams) {
  const { lang } = await params;
  const locale = resolveLangParam(lang);
  return (
    <>
      <JsonLd path="/contact" />
      <ContactPage locale={locale} />
    </>
  );
}
