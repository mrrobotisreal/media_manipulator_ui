// MM86: a tool page's structured data in the page's own language. Emitted only
// where the page is indexable (lib/metadata.ts#isToolPageIndexable): English
// for allowlisted tools, and a non-English locale only when it is reviewed and
// its override covers the whole body. Noindex pages advertise nothing, so a
// German page never carries an English FAQPage and an unreviewed or
// half-English page carries none at all.

import { JsonLd, JsonLdBlocks } from '@/components/seo/json-ld';
import type { ToolPageContent } from '@/content/toolPages';
import { defaultLocale } from '@/i18n/locales';
import { getServerT } from '@/lib/i18n/server';
import { isToolPageIndexable } from '@/lib/metadata';
import { localizedToolJsonLd } from '@/lib/seo';

/** `tool` is the localized entry the page renders (`getLocalizedToolBySlug`). */
export function ToolJsonLd({ tool, locale }: { tool: ToolPageContent; locale: string }) {
  if (!isToolPageIndexable(tool.slug, locale)) return null;
  if (locale === defaultLocale) return <JsonLd path={`/tools/${tool.slug}`} />;
  const t = getServerT('interface', locale);
  const blocks = localizedToolJsonLd(tool, {
    locale,
    home: t('toolLandingPage.home'),
    tools: t('toolLandingPage.tools'),
    howToName: `${t('toolLandingPage.howToUseHeading')}: ${tool.name}`,
  });
  return <JsonLdBlocks blocks={blocks} />;
}

export default ToolJsonLd;
