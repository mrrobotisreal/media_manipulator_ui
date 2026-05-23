import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import AdBanner from '@/components/ad-banner';
import RelatedLinks from '@/components/related-links';
import { AD_SLOTS } from '@/lib/adSlots';

const articles = [
  {
    title: "The Hitchhiker's Guide to Video Compression: MP4 vs WebM vs AVI",
    excerpt: "Learn the differences between video formats and when to use each one for optimal quality and file size.",
    date: "2025-06-13",
    readTime: "8 min read",
    slug: "video/video-compression-guide"
  },
  {
    title: "Image Optimization for Web Jedis: JPG vs PNG vs WebP",
    excerpt: "Discover how to choose the right image format for your website to improve loading speeds and user experience.",
    date: "2025-06-14",
    readTime: "8 min read",
    slug: "image/image-optimization-guide"
  },
  {
    title: (
      <>
        The Sound of <span className="line-through text-gray-400">Silence</span> Quality: Bitrates, Sample Rates, and Formats
      </>
    ),
    excerpt: "Understanding audio quality settings to achieve the perfect balance between file size and sound quality.",
    date: "2025-06-14",
    readTime: "8 min read",
    slug: "audio/audio-quality-guide"
  }
];

const BlogPage: React.FC = () => {
  return (
    <>
      <div className="max-w-7xl mx-auto px-4 pt-4">
        <AdBanner
          adSlot={AD_SLOTS.blog_index_header}
          adFormat="leaderboard"
          adPosition="blog_index_header"
          utmMedium="blog_index_header_leaderboard"
        />
      </div>
      <div className="max-w-[1600px] mx-auto my-2 flex flex-col lg:flex-row gap-6 px-4">
        <aside className="hidden lg:block w-[300px] shrink-0">
          <AdBanner
            adSlot={AD_SLOTS.blog_index_sidebar_left}
            adFormat="halfpage"
            adPosition="blog_index_sidebar_left"
            sticky
            utmMedium="blog_index_sidebar_left_halfpage"
          />
        </aside>
        <div className="flex-1 min-w-0">
          <Card className="sci-fi-frame">
            <CardContent className="p-12">
              <h1 className="text-4xl font-bold mb-8 text-card-foreground">Media Conversion Blog</h1>
              <p className="text-lg text-muted-foreground mb-8">
                Expert guides, tips, and insights on media conversion, optimization, and file formats.
              </p>

              <div className="grid gap-8">
                {articles.map((article, index) => (
                  <article key={index} className="bg-card p-6 hover:shadow-lg transition-shadow sci-fi-frame-inner">
                    <h2 className="text-2xl font-semibold mb-2 text-card-foreground hover:text-green-600">
                      <Link to={`/blog/${article.slug}`}>{article.title}</Link>
                    </h2>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <span>{article.date}</span>
                      <span>•</span>
                      <span>{article.readTime}</span>
                    </div>
                    <p className="text-muted-foreground mb-4">{article.excerpt}</p>
                    <Link
                      to={`/blog/${article.slug}`}
                      className="text-green-600 hover:text-green-700 font-medium"
                    >
                      Read more →
                    </Link>
                  </article>
                ))}
              </div>

              <RelatedLinks
                title="Want to try the tools?"
                intro="The Media Manipulator tools that pair with these articles are all free."
                links={[
                  {
                    label: 'Browse all tools',
                    to: '/tools',
                    description: 'Image, video, audio, AI, and metadata tools in one place.',
                  },
                  {
                    label: 'Compress video',
                    to: '/tools/compress-video',
                    description: 'Shrink video file size without ruining quality.',
                  },
                  {
                    label: 'Remove EXIF metadata',
                    to: '/tools/remove-exif-metadata',
                    description: 'Strip GPS and device data before sharing photos.',
                  },
                  {
                    label: 'Open the homepage converter',
                    to: '/',
                    description: 'Convert, edit, compress, and transcribe images, videos, and audio.',
                  },
                  {
                    label: 'Browse the tutorials',
                    to: '/tutorials',
                    description: 'Step-by-step walkthroughs of every conversion option and AI tool.',
                  },
                  {
                    label: 'How Media Manipulator works',
                    to: '/how-it-works',
                    description: 'See how files are processed, scanned, and temporarily stored.',
                  },
                ]}
              />
            </CardContent>
          </Card>
        </div>
        <aside className="hidden lg:block w-[300px] shrink-0">
          <AdBanner
            adSlot={AD_SLOTS.blog_index_sidebar_right}
            adFormat="halfpage"
            adPosition="blog_index_sidebar_right"
            sticky
            utmMedium="blog_index_sidebar_right_halfpage"
          />
        </aside>
      </div>
      <div className="max-w-7xl mx-auto px-4 pb-8">
        <AdBanner
          adSlot={AD_SLOTS.blog_index_footer}
          adFormat="leaderboard"
          adPosition="blog_index_footer"
          className="mt-8"
          utmMedium="blog_index_footer_leaderboard"
        />
      </div>
    </>
  );
};

export default BlogPage;
