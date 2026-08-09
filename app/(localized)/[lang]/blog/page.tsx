import type { Metadata } from 'next';
import { JsonLdBlocks } from '@/components/seo/json-ld';
import { blogIndexMetadata, blogIndexJsonLd } from '@/lib/blogPosts';
import BlogPage from '@/views/blog-index';
import { resolveLangParam } from '@/lib/i18n/routeLocale';

type PageParams = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { lang } = await params;
  return blogIndexMetadata(resolveLangParam(lang));
}

export default async function Blog({ params }: PageParams) {
  const { lang } = await params;
  const locale = resolveLangParam(lang);
  return (
    <>
      <JsonLdBlocks blocks={blogIndexJsonLd()} />
      <BlogPage locale={locale} />
    </>
  );
}
