import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { JsonLdBlocks } from '@/components/seo/json-ld';
import { getBlogPost, blogPostMetadata, blogPostJsonLd } from '@/lib/blogPosts';
import VideoCompressionGuide from '@/views/blog/video-compression-guide';
import { resolveLangParam } from '@/lib/i18n/routeLocale';

const PATH = '/blog/video/video-compression-guide';
const post = getBlogPost(PATH)!;

type PageParams = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { lang } = await params;
  return blogPostMetadata(post, resolveLangParam(lang));
}

export default async function Page({ params }: PageParams) {
  const { lang } = await params;
  const locale = resolveLangParam(lang);
  if (!post) notFound();
  return (
    <>
      <JsonLdBlocks blocks={blogPostJsonLd(post)} />
      <VideoCompressionGuide locale={locale} />
    </>
  );
}
