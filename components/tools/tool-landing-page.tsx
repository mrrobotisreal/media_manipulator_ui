import type { ReactNode } from 'react';
import Link from 'next/link';
import { ChevronDown, Shield } from 'lucide-react';
import EmbeddedToolPanelClient from '@/components/tools/embedded-tool-panel-client';
import AdBanner from '@/components/ad-banner';
import { getReviewToolInContentAdSlot } from '@/lib/adSlots';
import { isReviewSafeInternalHref } from '@/content/reviewAllowlist';
import type { ToolPageContent } from '@/content/toolPages';
import { Panel } from '@/components/darkroom/panel';

/**
 * Server-rendered tool landing page. All marketing/SEO copy (intro, formats,
 * how-to, FAQ, related links, etc.) is rendered on the server so it appears in
 * view-source. The only interactive island is the embedded converter panel,
 * which is client-only. A single guarded in-content ad sits after substantial
 * body copy — never near the tool/action buttons, and disabled by default.
 */
/**
 * One heading treatment for all nine content sections: `h2` plus a hairline
 * rule. Section rhythm is `mt-12`, so the rule does the separating rather than
 * a stack of tracked uppercase eyebrows — nine identical eyebrows read as
 * grammar rather than as a system.
 */
function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-4 border-b border-edge pb-2 text-xl font-semibold tracking-tight text-card-foreground">
      {children}
    </h2>
  );
}

export default function ToolLandingPage({
  tool,
  panel,
  beforeIntroExtra,
}: {
  tool: ToolPageContent;
  /** Optional custom interactive panel (e.g. the Content Studio editor). When
   *  omitted, the generic embedded converter panel is rendered. */
  panel?: ReactNode;
  /** Optional extra node rendered right after the intro (e.g. a help toggle). */
  beforeIntroExtra?: ReactNode;
}) {
  const inContentSlot = getReviewToolInContentAdSlot(tool.slug);
  // During review, only surface related links that point to review-safe pages
  // (core/blog/tutorials + allowlisted tools) so review pages never link into
  // the noindex / non-allowlisted tool inventory.
  const relatedLinks = tool.related.filter((link) =>
    isReviewSafeInternalHref(link.to),
  );
  const sf = tool.supportedFormats;
  const hasFormats =
    !!sf &&
    !!(
      sf.supportedInputFormats?.length ||
      sf.supportedOutputFormats?.length ||
      sf.maxFileNotes?.length ||
      sf.processingNotes?.length
    );

  return (
    <div className="max-w-[1400px] mx-auto my-2 px-4">
      <Panel level="1">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground mb-4">
            <ol className="flex flex-wrap items-center gap-1">
              <li>
                <Link href="/" className="hover:text-card-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/tools" className="hover:text-card-foreground transition-colors">
                  Tools
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-card-foreground">
                {tool.name}
              </li>
            </ol>
          </nav>

          {/* H1 + tagline + intro */}
          <header className="mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-card-foreground leading-tight">
              {tool.h1}
            </h1>
            <p className="text-lg text-muted-foreground mt-3 max-w-3xl">{tool.tagline}</p>
          </header>
          <p className="text-base text-card-foreground mb-2">{tool.intro}</p>

          {beforeIntroExtra}

          {/* Interactive tool panel (client island, ssr:false). A custom panel
              (e.g. the Content Studio editor) overrides the generic converter. */}
          {panel ?? (
          <EmbeddedToolPanelClient
            defaultMediaKind={tool.embed.defaultMediaKind}
            defaultTask={tool.embed.defaultTask}
            defaultOutputFormat={tool.embed.defaultOutputFormat}
            lockedInputFormat={tool.embed.lockedInputFormat}
            lockedOutputFormat={tool.embed.lockedOutputFormat}
            allowedInputFormats={tool.embed.allowedInputFormats}
            acceptOverride={tool.embed.acceptOverride}
            defaultAIImageOperation={tool.embed.defaultAIImageOperation}
            lockedAIImageOperation={tool.embed.lockedAIImageOperation}
            defaultQuality={tool.embed.defaultQuality}
            defaultWidth={tool.embed.defaultWidth}
            defaultHeight={tool.embed.defaultHeight}
            emphasizeResize={tool.embed.emphasizeResize}
            defaultVideoOutputFormat={tool.embed.defaultVideoOutputFormat}
            lockedVideoOutputFormat={tool.embed.lockedVideoOutputFormat}
            defaultVideoQuality={tool.embed.defaultVideoQuality}
            defaultVideoWidth={tool.embed.defaultVideoWidth}
            defaultVideoHeight={tool.embed.defaultVideoHeight}
            defaultVideoSpeed={tool.embed.defaultVideoSpeed}
            defaultExtractAudioFormat={tool.embed.defaultExtractAudioFormat}
            lockedExtractAudioFormat={tool.embed.lockedExtractAudioFormat}
            defaultVideoCompressionPreset={tool.embed.defaultVideoCompressionPreset}
            defaultVideoCodec={tool.embed.defaultVideoCodec}
            defaultTransform={tool.embed.defaultTransform}
            pdfDefaultOutputFormat={tool.embed.pdfDefaultOutputFormat}
            pdfLockOutputFormat={tool.embed.pdfLockOutputFormat}
            pdfDefaultPageSelection={tool.embed.pdfDefaultPageSelection}
            pdfDefaultDpi={tool.embed.pdfDefaultDpi}
            transcribeMode={tool.embed.transcribeMode}
            transcodeMode={tool.embed.transcodeMode}
            transcodeProtocol={tool.embed.transcodeProtocol}
            transcodeDashCodec={tool.embed.transcodeDashCodec}
            transcodeLockProtocol={tool.embed.transcodeLockProtocol}
            title={tool.embed.title}
            description={tool.embed.description}
          />
          )}

          {/* Supported formats */}
          {hasFormats && sf ? (
            <section className="mt-12" aria-label="Supported formats">
              <SectionHeading>Supported formats</SectionHeading>
              <div className="grid gap-4 md:grid-cols-2">
                {sf.supportedInputFormats?.length ? (
                  <div className="rounded-md border border-edge bg-surface-2/40 p-4">
                    <h3 className="font-medium text-card-foreground mb-2">Input formats</h3>
                    <ul className="flex flex-wrap gap-2">
                      {sf.supportedInputFormats.map((fmt) => (
                        <li
                          key={fmt}
                          className="num rounded border border-edge bg-surface-2 px-2 py-1 text-xs text-foreground"
                        >
                          {fmt.toUpperCase()}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                {sf.supportedOutputFormats?.length ? (
                  <div className="rounded-md border border-edge bg-surface-2/40 p-4">
                    <h3 className="font-medium text-card-foreground mb-2">Output formats</h3>
                    <ul className="flex flex-wrap gap-2">
                      {sf.supportedOutputFormats.map((fmt) => (
                        <li
                          key={fmt}
                          className="num rounded border border-edge bg-surface-2 px-2 py-1 text-xs text-foreground"
                        >
                          {fmt.toUpperCase()}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
              {(sf.maxFileNotes?.length || sf.processingNotes?.length) && (
                <ul className="mt-4 space-y-1 text-sm text-muted-foreground list-disc pl-6">
                  {sf.maxFileNotes?.map((note) => <li key={`max-${note}`}>{note}</li>)}
                  {sf.processingNotes?.map((note) => <li key={`proc-${note}`}>{note}</li>)}
                </ul>
              )}
            </section>
          ) : null}

          {/* How to use */}
          {tool.flowSteps.length > 0 && (
            <section className="mt-12" aria-label="How to use">
              <SectionHeading>How to use it</SectionHeading>
              <ol className="space-y-5">
                {tool.flowSteps.map((step, idx) => (
                  <li key={step.title || idx} className="flex gap-4">
                    <span
                      aria-hidden="true"
                      className="relative flex shrink-0 flex-col items-center"
                    >
                      <span className="num grid size-7 place-items-center rounded-full border border-primary/40 bg-primary/10 text-xs text-primary">
                        {idx + 1}
                      </span>
                      {idx < tool.flowSteps.length - 1 && (
                        <span className="mt-1 w-px flex-1 bg-edge" />
                      )}
                    </span>
                    <div className="min-w-0 pb-1">
                      <p className="font-medium text-card-foreground">{step.title}</p>
                      {step.description ? (
                        <p className="mt-1 text-sm text-muted-foreground">{step.description}</p>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {/* What this tool does */}
          <section className="mt-12" aria-label="What this tool does">
            <SectionHeading>What this tool does</SectionHeading>
            <ul className="space-y-2 list-disc pl-6 text-card-foreground">
              {tool.whatItDoes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          {/* Why it matters */}
          <section className="mt-12" aria-label="Why it matters">
            <SectionHeading>Why it matters</SectionHeading>
            <ul className="space-y-2 list-disc pl-6 text-card-foreground">
              {tool.whyItMatters.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          {/* Common use cases */}
          <section className="mt-12" aria-label="Common use cases">
            <SectionHeading>Common use cases</SectionHeading>
            <div className="grid gap-3 md:grid-cols-2">
              {tool.useCases.map((useCase) => (
                <div key={useCase.title} className="rounded-md border border-edge bg-surface-2/40 p-4">
                  <h3 className="font-medium text-card-foreground">{useCase.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{useCase.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Single guarded in-content ad — after substantial body copy, far
              from the tool panel/action buttons. Disabled by default via env. */}
          {inContentSlot ? (
            <div className="my-12 flex justify-center min-h-[280px] md:min-h-[300px]">
              <AdBanner
                adSlot={inContentSlot}
                placement="incontent"
                adPosition={`tool_${tool.slug}_incontent`}
              />
            </div>
          ) : null}

          {/* Advanced details */}
          {tool.advancedDetails && tool.advancedDetails.length > 0 && (
            <details className="group mt-12 rounded-md border border-edge bg-surface-2/40 p-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-semibold text-card-foreground [&::-webkit-details-marker]:hidden">
                <span>Advanced details</span>
                <ChevronDown
                  aria-hidden="true"
                  className="size-4 shrink-0 text-muted-foreground transition-transform duration-[var(--dur-base)] ease-[var(--ease-instrument)] group-open:rotate-180"
                />
              </summary>
              <ul className="mt-3 list-disc pl-6 space-y-2 text-sm text-muted-foreground">
                {tool.advancedDetails.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </details>
          )}

          {/* Why Media Manipulator */}
          <section className="mt-12" aria-label="Why Media Manipulator">
            <SectionHeading>Why Media Manipulator</SectionHeading>
            <ul className="space-y-2 list-disc pl-6 text-card-foreground">
              {tool.whyMediaManipulator.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          {/* Privacy note */}
          <section
            className="mt-12 flex items-start gap-3 rounded-lg border border-edge border-l-2 border-l-data bg-data/8 p-4"
            aria-label="Privacy & file handling"
          >
            <Shield className="mt-0.5 h-5 w-5 shrink-0 text-data" />
            <div>
              <h2 className="text-base font-semibold text-card-foreground">Privacy &amp; file handling</h2>
              <p className="text-sm text-muted-foreground mt-1">{tool.privacyNote}</p>
            </div>
          </section>

          {/* FAQ — <details> keeps every Q/A in the server HTML (crawlable) */}
          {tool.faq.length > 0 && (
            <section className="mt-12" aria-label="Frequently asked questions">
              <SectionHeading>Frequently asked questions</SectionHeading>
              <ul className="space-y-2 list-none">
                {tool.faq.map((item) => (
                  <li
                    key={item.question}
                    className="overflow-hidden rounded-md border border-edge bg-surface-2/40"
                  >
                    <details className="group">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 font-medium text-card-foreground transition-colors duration-[var(--dur-base)] ease-[var(--ease-instrument)] hover:bg-surface-2 [&::-webkit-details-marker]:hidden">
                        <span className="min-w-0">{item.question}</span>
                        <ChevronDown
                          aria-hidden="true"
                          className="size-4 shrink-0 text-muted-foreground transition-transform duration-[var(--dur-base)] ease-[var(--ease-instrument)] group-open:rotate-180"
                        />
                      </summary>
                      <div className="border-t border-edge px-4 py-3 text-sm text-muted-foreground">
                        <p>{item.answer}</p>
                      </div>
                    </details>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Related links (filtered to review-safe destinations) */}
          {relatedLinks.length > 0 && (
            <section className="mt-12" aria-label="Related tools">
              <SectionHeading>Related tools</SectionHeading>
              <div className="grid gap-3 md:grid-cols-2">
                {relatedLinks.map((link) => (
                  <Link
                    key={link.to}
                    href={link.to}
                    className="block rounded-md border border-edge bg-surface-2/40 p-4 transition-colors duration-[var(--dur-base)] ease-[var(--ease-instrument)] hover:border-edge-strong hover:bg-surface-2"
                  >
                    <span className="font-medium text-card-foreground">{link.label}</span>
                    {link.description ? (
                      <span className="block text-sm text-muted-foreground mt-1">
                        {link.description}
                      </span>
                    ) : null}
                  </Link>
                ))}
              </div>
            </section>
          )}
        
      </Panel>
    </div>
  );
}
