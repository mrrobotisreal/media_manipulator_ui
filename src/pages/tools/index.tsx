import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Image as ImageIcon, Video as VideoIcon, Music, Sparkles, Shield, ArrowRight } from 'lucide-react';
import AdBanner from '@/components/ad-banner';
import RelatedLinks from '@/components/related-links';
import { AD_SLOTS } from '@/lib/adSlots';
import { TOOL_CATEGORIES, TOOL_PAGES, type ToolPageContent } from '@/content/toolPages';

const categoryIcon = (category: ToolPageContent['category']): React.ReactNode => {
  switch (category) {
    case 'image':
      return <ImageIcon className="w-6 h-6 text-purple-600" />;
    case 'video':
      return <VideoIcon className="w-6 h-6 text-green-600" />;
    case 'audio':
      return <Music className="w-6 h-6 text-blue-600" />;
    case 'ai':
      return <Sparkles className="w-6 h-6 text-pink-600" />;
    case 'metadata':
      return <Shield className="w-6 h-6 text-orange-600" />;
  }
};

// Map each TOOL_CATEGORIES entry to its 468x60 banner slot from ADS.md.
const CATEGORY_BANNER_SLOTS: Record<ToolPageContent['category'], string> = {
  image: AD_SLOTS.tools_index_image_banner,
  video: AD_SLOTS.tools_index_video_banner,
  audio: AD_SLOTS.tools_index_audio_banner,
  ai: AD_SLOTS.tools_index_ai_banner,
  metadata: AD_SLOTS.tools_index_privacy_banner,
};

const ToolsIndexPage: React.FC = () => {
  return (
    <>
      <div className="max-w-7xl mx-auto px-4 pt-4">
        <AdBanner
          adSlot={AD_SLOTS.tools_index_header}
          adFormat="leaderboard"
          adPosition="tools_index_header"
          utmMedium="tools_index_header_leaderboard"
        />
      </div>
      <div className="max-w-[1600px] mx-auto my-2 flex flex-col lg:flex-row gap-6 px-4">
        <aside className="hidden lg:block w-[300px] shrink-0">
          <AdBanner
            adSlot={AD_SLOTS.tools_index_sidebar_left}
            adFormat="halfpage"
            adPosition="tools_index_sidebar_left"
            sticky
            utmMedium="tools_index_sidebar_left_halfpage"
          />
        </aside>
        <div className="flex-1 min-w-0">
          <Card className="sci-fi-frame">
            <CardContent className="p-6 md:p-10">
              <header className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-card-foreground leading-tight">
                  Free Online Media Tools
                </h1>
                <p className="text-lg text-muted-foreground mt-3 max-w-3xl">
                  Focused, single-purpose tools for converting, compressing, transcribing, and
                  cleaning up image, video, and audio files. No signup. Files deleted within 24 hours.
                </p>
              </header>

              <div className="grid gap-10">
                {TOOL_CATEGORIES.map((category) => {
                  const tools = TOOL_PAGES.filter((t) => t.category === category.id);
                  if (tools.length === 0) return null;
                  return (
                    <React.Fragment key={category.id}>
                      <section className="bg-card p-6 sci-fi-frame-inner">
                        <div className="flex items-start gap-4 mb-4">
                          <div className="shrink-0 mt-1">{categoryIcon(category.id)}</div>
                          <div>
                            <h2 className="text-2xl font-semibold text-card-foreground">
                              {category.label}
                            </h2>
                            <p className="text-muted-foreground mt-1">{category.description}</p>
                          </div>
                        </div>

                        <ul className="grid gap-3 md:grid-cols-2">
                          {tools.map((tool) => (
                            <li key={tool.slug}>
                              <Link
                                to={`/tools/${tool.slug}`}
                                className="group flex flex-col gap-1 rounded-lg border border-border bg-background/40 p-4 hover:bg-muted/40 transition-colors"
                              >
                                <span className="flex items-center justify-between">
                                  <span className="font-medium text-card-foreground">{tool.name}</span>
                                  <ArrowRight className="w-4 h-4 text-blue-600 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                                </span>
                                <span className="text-sm text-muted-foreground">{tool.tagline}</span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </section>

                      {/* 468x60 banner ad between category sections */}
                      <div className="flex justify-center">
                        <AdBanner
                          adSlot={CATEGORY_BANNER_SLOTS[category.id]}
                          adFormat="banner"
                          adPosition={`tools_index_${category.id}_banner`}
                          utmMedium={`tools_index_${category.id}_banner`}
                        />
                      </div>
                    </React.Fragment>
                  );
                })}
              </div>

              <div className="mt-10 bg-card p-6 sci-fi-frame-green">
                <h2 className="text-2xl font-semibold mb-3 text-card-foreground">
                  Need more than a single-purpose tool?
                </h2>
                <p className="text-muted-foreground mb-4">
                  The homepage converter bundles every option — format, AI tools, metadata, trim,
                  transcription — into one upload. Tutorials walk through every setting.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    to="/"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Open the full converter
                  </Link>
                  <Link
                    to="/tutorials"
                    className="bg-card border border-border text-card-foreground px-4 py-2 rounded-lg hover:bg-muted transition-colors"
                  >
                    Browse tutorials
                  </Link>
                  {/* Blog hidden during AdSense review — re-enable when the
                      blog section is reactivated.
                  <Link
                    to="/blog"
                    className="bg-card border border-border text-card-foreground px-4 py-2 rounded-lg hover:bg-muted transition-colors"
                  >
                    Read the blog
                  </Link>
                  */}
                </div>
              </div>

              <RelatedLinks
                title="Learn more"
                intro="Guides and reference pages that pair with these tools."
                links={[
                  // Blog guides hidden during AdSense review — re-enable when
                  // the blog returns.
                  // {
                  //   label: 'Video compression guide',
                  //   to: '/blog/video/video-compression-guide',
                  //   description: 'Codecs, bitrate, and container formats explained.',
                  // },
                  // {
                  //   label: 'Image optimization guide',
                  //   to: '/blog/image/image-optimization-guide',
                  //   description: 'JPG vs PNG vs WebP vs AVIF.',
                  // },
                  // {
                  //   label: 'Audio quality guide',
                  //   to: '/blog/audio/audio-quality-guide',
                  //   description: 'Bitrate, sample rate, and codec deep dive.',
                  // },
                  {
                    label: 'How Media Manipulator works',
                    to: '/how-it-works',
                    description: 'See how files are processed and temporarily stored.',
                  },
                ]}
              />
            </CardContent>
          </Card>
        </div>
        <aside className="hidden lg:block w-[300px] shrink-0">
          <AdBanner
            adSlot={AD_SLOTS.tools_index_sidebar_right}
            adFormat="halfpage"
            adPosition="tools_index_sidebar_right"
            sticky
            utmMedium="tools_index_sidebar_right_halfpage"
          />
        </aside>
      </div>
      <div className="max-w-7xl mx-auto px-4 pb-8">
        <AdBanner
          adSlot={AD_SLOTS.tools_index_footer}
          adFormat="leaderboard"
          adPosition="tools_index_footer"
          className="mt-8"
          utmMedium="tools_index_footer_leaderboard"
        />
      </div>
    </>
  );
};

export default ToolsIndexPage;
