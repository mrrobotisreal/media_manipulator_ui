import type { Metadata } from 'next';

import { JsonLdBlocks } from '@/components/seo/json-ld';
import VoicesPage from '@/views/voices';
import { VOICES } from '@/content/voices';
import { getLocaleDef, localizeHref } from '@/i18n/locales';
import { resolveLangParam } from '@/lib/i18n/routeLocale';
import { getServerMetadataT } from '@/lib/i18n/server';
import { languageAlternates } from '@/lib/metadata';
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_ORIGIN, type JsonLd } from '@/lib/seo';
import { translatorRobots } from '@/lib/translator/mode';

// Metadata is written here, like /pricing's: lib/seo.ts's map falls back to the
// noindex 404 entry for any path it does not know. The <title> and description
// reuse the page's own localized heading and intro.
type PageParams = { params: Promise<{ lang: string }> };

const canonicalFor = (locale: string) => {
  const path = localizeHref('/voices', locale);
  return `${SITE_ORIGIN}${path}`;
};

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { lang } = await params;
  const locale = resolveLangParam(lang);
  const t = getServerMetadataT('interface', locale);
  const title = `${t('interface:voices.title')} — ${SITE_NAME}`;
  const description = t('interface:voices.intro');
  const canonical = canonicalFor(locale);
  const isTranslated = getLocaleDef(locale)?.translated ?? false;

  return {
    title,
    description,
    alternates: { canonical, languages: languageAlternates('/voices') },
    robots: translatorRobots(isTranslated ? { index: true, follow: true } : { index: false, follow: true }),
    openGraph: { title, description, url: canonical, siteName: SITE_NAME, type: 'website', images: [{ url: DEFAULT_OG_IMAGE }] },
    twitter: { card: 'summary_large_image', title, description, images: [DEFAULT_OG_IMAGE] },
  };
}

/** Ties both voices to their creator for search engines and LLMs. */
function voicesJsonLd(locale: string): JsonLd[] {
  const person = {
    '@type': 'Person',
    name: 'Mitchell Wintrow',
    url: 'https://www.winapps.io',
    sameAs: ['https://www.winapps.io/about', 'https://www.linkedin.com/in/mitchell-wintrow/', 'https://github.com/mrrobotisreal'],
  };
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Mitchell Wintrow’s ElevenLabs voices',
      url: canonicalFor(locale),
      author: person,
      hasPart: VOICES.map((voice) => ({
        '@type': 'CreativeWork',
        name: `${voice.name} (ElevenLabs voice)`,
        url: voice.elevenLabsUrl,
        creator: person,
        audio: voice.renditions.map((r) => ({
          '@type': 'AudioObject',
          contentUrl: `${SITE_ORIGIN}${r.sources[0].src}`,
          encodingFormat: 'audio/webm',
          inLanguage: r.lang,
          duration: `PT${Math.floor(r.durationSeconds / 60)}M${r.durationSeconds % 60}S`,
        })),
      })),
    },
  ];
}

export default async function Voices({ params }: PageParams) {
  const { lang } = await params;
  const locale = resolveLangParam(lang);
  return (
    <>
      <JsonLdBlocks blocks={voicesJsonLd(locale)} />
      <VoicesPage locale={locale} />
    </>
  );
}
