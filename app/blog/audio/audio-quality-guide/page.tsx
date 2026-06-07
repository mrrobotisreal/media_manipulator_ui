import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { JsonLdBlocks } from '@/components/seo/json-ld';
import { getBlogPost, blogPostMetadata, blogPostJsonLd } from '@/lib/blogPosts';
import AudioQualityGuide from '@/views/blog/audio-quality-guide';

const PATH = '/blog/audio/audio-quality-guide';
const post = getBlogPost(PATH)!;

export const metadata: Metadata = blogPostMetadata(post);

export default function Page() {
  if (!post) notFound();
  return (
    <>
      <JsonLdBlocks blocks={blogPostJsonLd(post)} />
      <AudioQualityGuide />
    </>
  );
}
