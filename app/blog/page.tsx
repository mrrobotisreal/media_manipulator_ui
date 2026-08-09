import type { Metadata } from 'next';
import { JsonLdBlocks } from '@/components/seo/json-ld';
import { blogIndexMetadata, blogIndexJsonLd } from '@/lib/blogPosts';
import BlogPage from '@/views/blog-index';
import { getRequestLocale } from '@/lib/i18n/requestLocale';

export const metadata: Metadata = blogIndexMetadata();

export default async function Blog() {
  const locale = await getRequestLocale();
  return (
    <>
      <JsonLdBlocks blocks={blogIndexJsonLd()} />
      <BlogPage locale={locale} />
    </>
  );
}
