import React, { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import mixpanel from 'mixpanel-browser';

const articles = [
  {
    title: "The Hitchhiker's Guide to Video Compression: MP4 vs WebM vs AVI",
    excerpt: "Learn the differences between video formats and when to use each one for optimal quality and file size.",
    date: "2025-06-13",
    readTime: "8 min read",
    slug: "video/video-compression-guide"
  },
  {
    title: "Image Optimization for Web: JPEG vs PNG vs WebP",
    excerpt: "Discover how to choose the right image format for your website to improve loading speeds and user experience.",
    date: "2025-06-15",
    readTime: "6 min read",
    slug: "image/image-optimization-guide"
  },
  {
    title: "Audio Quality Explained: Bitrates, Sample Rates, and Formats",
    excerpt: "Understanding audio quality settings to achieve the perfect balance between file size and sound quality.",
    date: "2025-06-16",
    readTime: "10 min read",
    slug: "audio/audio-quality-guide"
  }
];

const BlogPage: React.FC = () => {
  useEffect(() => {
    mixpanel.track('Page View', {
      page_name: 'Blog',
      page_path: '/blog',
      user_tier: 'free'
    });
  }, []);

  return (
    <Card className="max-w-4xl mx-auto my-2">
      <CardContent className="p-6">
        <h1 className="text-4xl font-bold mb-8 text-card-foreground">Media Conversion Blog</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Expert guides, tips, and insights on media conversion, optimization, and file formats.
        </p>

        <div className="grid gap-8">
          {articles.map((article, index) => (
            <article key={index} className="bg-card rounded-lg border p-6 hover:shadow-lg transition-shadow">
              <h2 className="text-2xl font-semibold mb-2 text-card-foreground hover:text-blue-600">
                <a href={`/blog/${article.slug}`}>{article.title}</a>
              </h2>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                <span>{article.date}</span>
                <span>•</span>
                <span>{article.readTime}</span>
              </div>
              <p className="text-muted-foreground mb-4">{article.excerpt}</p>
              <a
                href={`/blog/${article.slug}`}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Read more →
              </a>
            </article>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default BlogPage;
