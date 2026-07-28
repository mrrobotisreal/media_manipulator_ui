import Link from 'next/link';

import { Panel } from '@/components/darkroom/panel';
import { REVIEW_INDEXED_TOOL_SLUGS } from '@/content/reviewAllowlist';
import { TOOL_PAGES, type ToolPageContent } from '@/content/toolPages';

/**
 * Server-rendered body copy for `/`.
 *
 * The home page is a client island (the converter), so before this the route
 * emitted essentially no crawlable prose — just JSON-LD wrapped around a
 * `'use client'` component. AdSense review weighs content depth and this is the
 * landing page, so a short, genuinely useful block sits below the tool.
 *
 * Deliberately kept small: three steps that answer "what happens to my file",
 * and an internal-link grid to the review-allowed tools. Every tool name and
 * tagline is existing copy read from `content/toolPages.ts` — nothing here
 * invents claims, and `toolPages.ts` is only read, never modified.
 */

const STEPS: { title: string; body: string }[] = [
  {
    title: 'Choose a file',
    body: 'Drop in an image, video, or audio file, or pick one from your device. Nothing is uploaded until you start the conversion.',
  },
  {
    title: 'Set your options',
    body: 'Choose an output format and adjust quality, dimensions, or trim points. Sensible defaults are preselected for every tool.',
  },
  {
    title: 'Download the result',
    body: 'Conversion runs on our own servers rather than in your browser, so large files work. Results are designed to be deleted automatically within 24 hours.',
  },
];

// Content Studio is featured separately on /tools, so it is excluded here.
const POPULAR: ToolPageContent[] = REVIEW_INDEXED_TOOL_SLUGS.filter(
  (slug) => slug !== 'content-studio'
)
  .map((slug) => TOOL_PAGES.find((tool) => tool.slug === slug))
  .filter((tool): tool is ToolPageContent => Boolean(tool));

export function HomeContent() {
  return (
    <div className="mx-auto grid max-w-[1600px] gap-6 px-4 pb-12 lg:grid-cols-2">
      <Panel
        level="1"
        as="section"
        eyebrow="How it works"
        title="Three steps, no account"
        titleAs="h2"
      >
        <ol className="space-y-5">
          {STEPS.map((step, i) => (
            <li key={step.title} className="flex gap-4">
              {/* Coral monospace step marker, connected by a hairline. */}
              <span
                aria-hidden="true"
                className="relative flex shrink-0 flex-col items-center"
              >
                <span className="num grid size-7 place-items-center rounded-full border border-primary/40 bg-primary/10 text-xs text-primary">
                  {i + 1}
                </span>
                {i < STEPS.length - 1 && (
                  <span className="mt-1 w-px flex-1 bg-edge" />
                )}
              </span>
              <span className="min-w-0 pb-1">
                <span className="block font-medium text-foreground">
                  {step.title}
                </span>
                <span className="mt-1 block text-sm text-muted-foreground">
                  {step.body}
                </span>
              </span>
            </li>
          ))}
        </ol>
        <p className="mt-6 text-sm text-muted-foreground">
          More detail in{' '}
          <Link
            href="/how-it-works"
            className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary"
          >
            how it works
          </Link>
          , or browse{' '}
          <Link
            href="/tools"
            className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary"
          >
            all tools
          </Link>
          .
        </p>
      </Panel>

      <Panel
        level="1"
        as="section"
        eyebrow="Popular conversions"
        title="Jump straight to a tool"
        titleAs="h2"
      >
        <ul className="grid gap-2 sm:grid-cols-2">
          {POPULAR.map((tool) => (
            <li key={tool.slug}>
              <Link
                href={`/tools/${tool.slug}`}
                className="block rounded-md border border-edge bg-surface-2/40 p-3 transition-colors duration-[var(--dur-base)] ease-[var(--ease-instrument)] hover:border-edge-strong hover:bg-surface-2"
              >
                <span className="block truncate text-sm font-medium text-foreground">
                  {tool.name}
                </span>
                <span className="mt-0.5 block text-xs text-muted-foreground">
                  {tool.tagline}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}

export default HomeContent;
