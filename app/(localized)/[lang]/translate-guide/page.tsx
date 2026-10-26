import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { resolveLangParam } from '@/lib/i18n/routeLocale';
import { isTranslatorEnv, translatorLocale, TRANSLATOR_ROBOTS } from '@/lib/translator/mode';
import TranslateGuidePage from '@/views/translate-guide';

/**
 * MM56: the translator onboarding guide (design §5), TRANSLATOR DEPLOYMENTS ONLY.
 *
 * Production (role unset, inlined as '') renders the 404 boundary for every
 * locale: the guide is never in production output and never in the sitemap
 * (`app/sitemap.ts` lists fixed routes; translator sitemaps are empty anyway).
 * On a translator deployment it shows the English guide and the same text in
 * the deployment's locale (`NEXT_PUBLIC_TRANSLATOR_LOCALE`), whatever the URL
 * prefix, so `/en/translate-guide` and `/de/translate-guide` both work.
 */
type PageParams = { params: Promise<{ lang: string }> };

export async function generateMetadata(): Promise<Metadata> {
  if (!isTranslatorEnv()) return {};
  return { title: 'Translator guide | Media Manipulator', robots: TRANSLATOR_ROBOTS };
}

export default async function TranslateGuide({ params }: PageParams) {
  if (!isTranslatorEnv()) notFound();
  const { lang } = await params;
  resolveLangParam(lang);
  // A hardened but unarmed deployment (invalid locale) still gets the English guide.
  return <TranslateGuidePage locale={translatorLocale()} />;
}
