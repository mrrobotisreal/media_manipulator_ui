import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { JsonLdBlocks } from '@/components/seo/json-ld';
import { getBlogPost, blogPostMetadata, blogPostJsonLd } from '@/lib/blogPosts';
import ImageOptimizationGuide from '@/views/blog/image-optimization-guide';

const PATH = '/blog/image/image-optimization-guide';
const post = getBlogPost(PATH)!;

export const metadata: Metadata = blogPostMetadata(post);

export default function Page() {
  if (!post) notFound();
  return (
    <>
      <JsonLdBlocks blocks={blogPostJsonLd(post)} />
      <ImageOptimizationGuide />
    </>
  );
}
