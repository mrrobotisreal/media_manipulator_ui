import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Image as ImageIcon, Video as VideoIcon, Music, Sparkles, Shield, ArrowRight, Clapperboard } from 'lucide-react';
import AdBanner from '@/components/ad-banner';
import RelatedLinks from '@/components/related-links';
import { AD_SLOTS } from '@/lib/adSlots';
import { type ToolPageContent } from '@/content/toolPages';
import { useLocalization } from '@/i18n/useLocalization';
import { useToolPages } from '@/i18n/useToolPages';
import { cn } from '@/lib/utils';

// Featured tools rendered in a prominent band above the category grid. Driven
// by this array so additional spotlights can be added later — each entry's
// copy (name/tagline/badge) is resolved from the `toolsIndex.featured.<key>`
// i18n block at render time.
const FEATURED_TOOLS: { key: string; to: string; icon: React.ReactNode }[] = [
  {
    key: 'contentStudio',
    to: '/tools/content-studio',
    icon: <Clapperboard className="w-7 h-7 text-green-500" />,
  },
];

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
  contentStudio: AD_SLOTS.tools_index_content_studio_banner,
  image: AD_SLOTS.tools_index_image_banner,
  video: AD_SLOTS.tools_index_video_banner,
  audio: AD_SLOTS.tools_index_audio_banner,
  ai: AD_SLOTS.tools_index_ai_banner,
  metadata: AD_SLOTS.tools_index_privacy_banner,
};

const ToolsIndexPage: React.FC = () => {
  const { t } = useLocalization('interface');
  const { toolPages, toolCategories } = useToolPages();
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
                  {t('toolsIndex.title')}
                </h1>
                <p className="text-lg text-muted-foreground mt-3 max-w-3xl">
                  {t('toolsIndex.subtitle')}
                </p>
              </header>

              {/* Featured tools — spotlighted above the category grid. */}
              <section className="mb-10">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-green-500" />
                  <h2 className="text-2xl font-semibold text-card-foreground">
                    {t('toolsIndex.featured.title')}
                  </h2>
                </div>
                <div
                  className={cn(
                    'grid gap-4',
                    FEATURED_TOOLS.length > 1 && 'md:grid-cols-2',
                  )}
                >
                  {FEATURED_TOOLS.map((tool) => (
                    <Link
                      key={tool.key}
                      to={tool.to}
                      className="group block bg-card p-6 sci-fi-frame-green transition-transform hover:-translate-y-0.5"
                    >
                      <div className="flex items-start gap-4">
                        <div className="shrink-0 mt-1">{tool.icon}</div>
                        <div className="min-w-0">
                          <span className="flex items-center gap-2 flex-wrap">
                            <span className="text-xl font-semibold text-card-foreground">
                              {t(`toolsIndex.featured.${tool.key}.name`)}
                            </span>
                            <Badge className="bg-green-600 text-white hover:bg-green-600">
                              {t(`toolsIndex.featured.${tool.key}.badge`)}
                            </Badge>
                          </span>
                          <p className="text-muted-foreground mt-1">
                            {t(`toolsIndex.featured.${tool.key}.tagline`)}
                          </p>
                          <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-green-500 group-hover:translate-x-0.5 transition-transform">
                            {t('toolsIndex.featured.cta')}
                            <ArrowRight className="w-4 h-4" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>

              <div className="grid gap-10">
                {toolCategories.map((category) => {
                  const tools = toolPages.filter((t) => t.category === category.id);
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
                  {t('toolsIndex.needMore.title')}
                </h2>
                <p className="text-muted-foreground mb-4">
                  {t('toolsIndex.needMore.body')}
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    to="/"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {t('toolsIndex.needMore.ctaConverter')}
                  </Link>
                  <Link
                    to="/tutorials"
                    className="bg-card border border-border text-card-foreground px-4 py-2 rounded-lg hover:bg-muted transition-colors"
                  >
                    {t('toolsIndex.needMore.ctaTutorials')}
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
                title={t('toolsIndex.learnMore.title')}
                intro={t('toolsIndex.learnMore.intro')}
                links={[
                  {
                    label: t('toolsIndex.learnMore.howItWorks.label'),
                    to: '/how-it-works',
                    description: t('toolsIndex.learnMore.howItWorks.description'),
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
