import type { ReactNode } from 'react';
import Link from 'next/link';
import { Shield } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import EmbeddedToolPanelClient from '@/components/tools/embedded-tool-panel-client';
import AdBanner from '@/components/ad-banner';
import { getReviewToolInContentAdSlot } from '@/lib/adSlots';
import { isReviewSafeInternalHref } from '@/content/reviewAllowlist';
import type { ToolPageContent } from '@/content/toolPages';

/**
 * Server-rendered tool landing page. All marketing/SEO copy (intro, formats,
 * how-to, FAQ, related links, etc.) is rendered on the server so it appears in
 * view-source. The only interactive island is the embedded converter panel,
 * which is client-only. A single guarded in-content ad sits after substantial
 * body copy — never near the tool/action buttons, and disabled by default.
 */
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
    <div className="max-w-[2160px] mx-auto my-2 px-4">
      <Card className="sci-fi-frame">
        <CardContent className="p-8 md:p-12">
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
            <section className="my-8" aria-label="Supported formats">
              <h2 className="text-2xl font-semibold text-card-foreground mb-3">Supported formats</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {sf.supportedInputFormats?.length ? (
                  <div className="rounded-lg border border-border bg-background/40 p-4">
                    <h3 className="font-medium text-card-foreground mb-2">Input formats</h3>
                    <ul className="flex flex-wrap gap-2">
                      {sf.supportedInputFormats.map((fmt) => (
                        <li
                          key={fmt}
                          className="text-xs px-2 py-1 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-900/60"
                        >
                          {fmt.toUpperCase()}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                {sf.supportedOutputFormats?.length ? (
                  <div className="rounded-lg border border-border bg-background/40 p-4">
                    <h3 className="font-medium text-card-foreground mb-2">Output formats</h3>
                    <ul className="flex flex-wrap gap-2">
                      {sf.supportedOutputFormats.map((fmt) => (
                        <li
                          key={fmt}
                          className="text-xs px-2 py-1 rounded bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-300 border border-green-200/60 dark:border-green-900/60"
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
            <section className="my-8" aria-label="How to use">
              <h2 className="text-2xl font-semibold text-card-foreground mb-3">How to use it</h2>
              <ol className="space-y-3">
                {tool.flowSteps.map((step, idx) => (
                  <li key={step.title || idx} className="flex gap-3">
                    <span className="shrink-0 w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-300 font-semibold flex items-center justify-center text-sm">
                      {idx + 1}
                    </span>
                    <div>
                      <p className="font-medium text-card-foreground">{step.title}</p>
                      {step.description ? (
                        <p className="text-sm text-muted-foreground">{step.description}</p>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {/* What this tool does */}
          <section className="my-8" aria-label="What this tool does">
            <h2 className="text-2xl font-semibold text-card-foreground mb-3">What this tool does</h2>
            <ul className="space-y-2 list-disc pl-6 text-card-foreground">
              {tool.whatItDoes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          {/* Why it matters */}
          <section className="my-8" aria-label="Why it matters">
            <h2 className="text-2xl font-semibold text-card-foreground mb-3">Why it matters</h2>
            <ul className="space-y-2 list-disc pl-6 text-card-foreground">
              {tool.whyItMatters.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          {/* Common use cases */}
          <section className="my-8" aria-label="Common use cases">
            <h2 className="text-2xl font-semibold text-card-foreground mb-3">Common use cases</h2>
            <div className="grid gap-3 md:grid-cols-2">
              {tool.useCases.map((useCase) => (
                <div key={useCase.title} className="rounded-lg border border-border bg-background/40 p-4">
                  <h3 className="font-medium text-card-foreground">{useCase.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{useCase.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Single guarded in-content ad — after substantial body copy, far
              from the tool panel/action buttons. Disabled by default via env. */}
          {inContentSlot ? (
            <div className="my-12 flex justify-center">
              <AdBanner
                adSlot={inContentSlot}
                placement="incontent"
                adPosition={`tool_${tool.slug}_incontent`}
              />
            </div>
          ) : null}

          {/* Advanced details */}
          {tool.advancedDetails && tool.advancedDetails.length > 0 && (
            <details className="my-8 rounded-lg border border-border bg-card p-4">
              <summary className="cursor-pointer font-semibold text-card-foreground">
                Advanced details
              </summary>
              <ul className="mt-3 list-disc pl-6 space-y-2 text-sm text-muted-foreground">
                {tool.advancedDetails.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </details>
          )}

          {/* Why Media Manipulator */}
          <section className="my-8" aria-label="Why Media Manipulator">
            <h2 className="text-2xl font-semibold text-card-foreground mb-3">Why Media Manipulator</h2>
            <ul className="space-y-2 list-disc pl-6 text-card-foreground">
              {tool.whyMediaManipulator.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          {/* Privacy note */}
          <section
            className="my-8 rounded-lg border border-blue-200 dark:border-blue-900/60 bg-blue-50/50 dark:bg-blue-950/30 p-4 flex items-start gap-3"
            aria-label="Privacy & file handling"
          >
            <Shield className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <h2 className="text-base font-semibold text-card-foreground">Privacy &amp; file handling</h2>
              <p className="text-sm text-muted-foreground mt-1">{tool.privacyNote}</p>
            </div>
          </section>

          {/* FAQ — <details> keeps every Q/A in the server HTML (crawlable) */}
          {tool.faq.length > 0 && (
            <section className="my-8" aria-label="Frequently asked questions">
              <h2 className="text-2xl font-semibold text-card-foreground mb-3">
                Frequently asked questions
              </h2>
              <ul className="space-y-2 list-none">
                {tool.faq.map((item) => (
                  <li
                    key={item.question}
                    className="border border-border rounded-lg overflow-hidden bg-card"
                  >
                    <details>
                      <summary className="cursor-pointer px-4 py-3 font-medium text-card-foreground hover:bg-muted/40 transition-colors">
                        {item.question}
                      </summary>
                      <div className="px-4 pb-4 text-sm text-muted-foreground">
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
            <section className="my-8" aria-label="Related tools">
              <h2 className="text-2xl font-semibold text-card-foreground mb-3">Related tools</h2>
              <div className="grid gap-3 md:grid-cols-2">
                {relatedLinks.map((link) => (
                  <Link
                    key={link.to}
                    href={link.to}
                    className="block rounded-lg border border-border bg-background/40 p-4 hover:bg-muted/40 transition-colors"
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
        </CardContent>
      </Card>
    </div>
  );
}
