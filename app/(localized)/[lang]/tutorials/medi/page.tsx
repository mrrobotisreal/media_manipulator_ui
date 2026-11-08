import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/metadata';
import { JsonLd } from '@/components/seo/json-ld';
import MediTutorial from '@/views/tutorials/medi';
import { resolveLangParam } from '@/lib/i18n/routeLocale';
import { loadPublicTiers } from '@/lib/auth/loadTiers';

// The plan table is read from GET /api/tiers (revalidated like /pricing and /tools/medi); no limit is written in the copy.
export const revalidate = 300;

const PATH = '/tutorials/medi';

type PageParams = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { lang } = await params;
  return buildMetadata(PATH, resolveLangParam(lang));
}

export default async function Page({ params }: PageParams) {
  const { lang } = await params;
  const locale = resolveLangParam(lang);
  const tiers = await loadPublicTiers(revalidate);
  return (
    <>
      <JsonLd path={PATH} />
      <MediTutorial locale={locale} tiers={tiers} />
    </>
  );
}
