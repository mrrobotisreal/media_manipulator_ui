import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/metadata';
import { JsonLd } from '@/components/seo/json-ld';
import AudioGettingStartedTutorial from '@/views/tutorials/audio-getting-started';
import { resolveLangParam } from '@/lib/i18n/routeLocale';

const PATH = '/tutorials/audio/getting-started';

type PageParams = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { lang } = await params;
  return buildMetadata(PATH, resolveLangParam(lang));
}

export default async function Page({ params }: PageParams) {
  const { lang } = await params;
  resolveLangParam(lang);
  return (
    <>
      <JsonLd path={PATH} />
      <AudioGettingStartedTutorial />
    </>
  );
}
