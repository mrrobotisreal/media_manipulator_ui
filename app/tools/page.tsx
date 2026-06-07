import type { Metadata } from 'next';
import Link from 'next/link';
import { Clapperboard, Shield, Sparkles, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { buildMetadata } from '@/lib/metadata';
import { JsonLd } from '@/components/seo/json-ld';
import { TOOL_PAGES, type ToolPageContent } from '@/content/toolPages';
import { REVIEW_INDEXED_TOOL_SLUGS } from '@/content/reviewAllowlist';

export const metadata: Metadata = buildMetadata('/tools');

const CATEGORY_LABELS: Record<ToolPageContent['category'], string> = {
  image: 'Image tools',
  video: 'Video tools',
  audio: 'Audio tools',
  ai: 'AI tools',
  metadata: 'Privacy & metadata tools',
  contentStudio: 'Content Studio',
};

const CATEGORY_ORDER: ToolPageContent['category'][] = [
  'image',
  'video',
  'audio',
  'ai',
  'metadata',
];

// Only the review-allowed tools are surfaced here.
const allowedTools = REVIEW_INDEXED_TOOL_SLUGS.map((slug) =>
  TOOL_PAGES.find((t) => t.slug === slug),
).filter((t): t is ToolPageContent => Boolean(t));

const contentStudio = allowedTools.find((t) => t.slug === 'content-studio');

function toolsByCategory(category: ToolPageContent['category']) {
  return allowedTools.filter(
    (t) => t.category === category && t.slug !== 'content-studio',
  );
}

export default function ToolsIndexPage() {
  return (
    <>
      <JsonLd path="/tools" />
      <div className="max-w-6xl mx-auto my-2 px-4">
        <Card className="sci-fi-frame">
          <CardContent className="p-8 md:p-12">
            <header className="mb-6">
              <h1 className="text-3xl md:text-4xl font-bold text-card-foreground">
                Free Online Media Tools
              </h1>
              <p className="text-lg text-muted-foreground mt-3 max-w-3xl">
                Media Manipulator is a free suite of browser-based tools for
                converting, compressing, editing, transcribing, and cleaning up
                image, video, and audio files. No signup, no watermarks, and your
                files are processed on our own servers and are designed to be
                deleted automatically within 24 hours.
              </p>
            </header>

            {/* Featured: Content Studio */}
            {contentStudio && (
              <Link
                href="/tools/content-studio"
                className="group mb-8 block sci-fi-frame-green bg-card p-5"
                aria-label={contentStudio.name}
              >
                <div className="flex items-center gap-4">
                  <div className="shrink-0 rounded-lg bg-green-600/10 p-3">
                    <Clapperboard className="w-7 h-7 text-green-500" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="text-lg font-semibold text-card-foreground">
                        {contentStudio.name}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-md bg-green-600 px-2 py-0.5 text-xs font-medium text-white">
                        <Sparkles className="w-3 h-3" />
                        Multi-track editor
                      </span>
                    </span>
                    <p className="mt-1 text-sm text-muted-foreground">{contentStudio.tagline}</p>
                  </div>
                  <span className="hidden shrink-0 items-center gap-1 text-sm font-medium text-green-500 group-hover:translate-x-0.5 transition-transform sm:inline-flex">
                    Open <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            )}

            {/* Categorised tool grid */}
            {CATEGORY_ORDER.map((category) => {
              const tools = toolsByCategory(category);
              if (tools.length === 0) return null;
              return (
                <section key={category} className="my-8" aria-label={CATEGORY_LABELS[category]}>
                  <h2 className="text-2xl font-semibold text-card-foreground mb-3">
                    {CATEGORY_LABELS[category]}
                  </h2>
                  <div className="grid gap-3 md:grid-cols-2">
                    {tools.map((tool) => (
                      <Link
                        key={tool.slug}
                        href={`/tools/${tool.slug}`}
                        className="block rounded-lg border border-border bg-background/40 p-4 hover:bg-muted/40 transition-colors"
                      >
                        <span className="font-medium text-card-foreground">{tool.name}</span>
                        <span className="mt-1 block text-sm text-muted-foreground">
                          {tool.tagline}
                        </span>
                      </Link>
                    ))}
                  </div>
                </section>
              );
            })}

            {/* Privacy / file-handling */}
            <section
              className="my-8 flex items-start gap-3 rounded-lg border border-blue-200 dark:border-blue-900/60 bg-blue-50/50 dark:bg-blue-950/30 p-4"
              aria-label="Privacy & file handling"
            >
              <Shield className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
              <div>
                <h2 className="text-base font-semibold text-card-foreground">
                  Your files stay private
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Uploads are processed on our own infrastructure and are designed
                  to be deleted automatically within 24 hours. AI features run on a
                  GPU server we operate — your files are not shared with third-party
                  AI providers, and no account is required.
                </p>
              </div>
            </section>

            {/* Learn more */}
            <section className="my-8" aria-label="Learn more">
              <h2 className="text-2xl font-semibold text-card-foreground mb-3">New here?</h2>
              <p className="text-sm text-muted-foreground mb-3">
                Step-by-step tutorials walk you through the image, video, and audio
                tools and the Content Studio editor.
              </p>
              <div className="flex flex-wrap gap-2 text-sm">
                <Link href="/tutorials" className="rounded-lg bg-blue-600 px-3 py-2 text-white transition-colors hover:bg-blue-700">
                  Browse all tutorials
                </Link>
                <Link href="/tutorials/content-studio" className="rounded-lg border border-border bg-card px-3 py-2 text-card-foreground transition-colors hover:bg-muted">
                  Content Studio tutorial
                </Link>
                <Link href="/how-it-works" className="rounded-lg border border-border bg-card px-3 py-2 text-card-foreground transition-colors hover:bg-muted">
                  How it works
                </Link>
              </div>
            </section>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
