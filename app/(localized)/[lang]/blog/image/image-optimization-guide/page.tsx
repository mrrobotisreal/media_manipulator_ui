import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { JsonLdBlocks } from '@/components/seo/json-ld';
import { getBlogPost, blogPostMetadata, blogPostJsonLd } from '@/lib/blogPosts';
import ImageOptimizationGuide from '@/views/blog/image-optimization-guide';
import { resolveLangParam } from '@/lib/i18n/routeLocale';

const PATH = '/blog/image/image-optimization-guide';
const post = getBlogPost(PATH)!;

type PageParams = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { lang } = await params;
  return blogPostMetadata(post, resolveLangParam(lang));
}

export default async function Page({ params }: PageParams) {
  const { lang } = await params;
  resolveLangParam(lang);
  if (!post) notFound();
  return (
    <>
      <JsonLdBlocks blocks={blogPostJsonLd(post)} />
      <ImageOptimizationGuide />
    </>
  );
}
