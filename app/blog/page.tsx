import type { Metadata } from 'next';
import { JsonLdBlocks } from '@/components/seo/json-ld';
import { blogIndexMetadata, blogIndexJsonLd } from '@/lib/blogPosts';
import BlogPage from '@/views/blog-index';

export const metadata: Metadata = blogIndexMetadata();

export default function Blog() {
  return (
    <>
      <JsonLdBlocks blocks={blogIndexJsonLd()} />
      <BlogPage />
    </>
  );
}
