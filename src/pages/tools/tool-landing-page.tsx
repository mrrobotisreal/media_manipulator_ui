import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronRight, Shield } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import EmbeddedToolPanel from '@/components/embedded-tool-panel';
import RelatedLinks from '@/components/related-links';
import ToolFlowDiagram from '@/components/tool-flow-diagram';
import AdBanner from '@/components/ad-banner';
import { getToolAdSlots } from '@/lib/adSlots';
import type { ToolPageContent } from '@/content/toolPages';
import mixpanel from 'mixpanel-browser';
import { hasAnalyticsConsent } from '@/lib/consent';
import { useLocalization } from '@/i18n/useLocalization';

interface ToolLandingPageProps {
  tool: ToolPageContent;
}

const Breadcrumbs: React.FC<{ tool: ToolPageContent }> = ({ tool }) => {
  const { t } = useLocalization('interface');
  return (
    <nav aria-label={t('toolLanding.breadcrumbAria')} className="text-sm text-muted-foreground mb-4">
      <ol className="flex flex-wrap items-center gap-1">
        <li>
          <Link to="/" className="hover:text-card-foreground transition-colors">
            {t('topNav.home')}
          </Link>
        </li>
        <li aria-hidden="true">/</li>
        <li>
          <Link to="/tools" className="hover:text-card-foreground transition-colors">
            {t('toolLanding.breadcrumbs.tools')}
          </Link>
        </li>
        <li aria-hidden="true">/</li>
        <li aria-current="page" className="text-card-foreground">
          {tool.name}
        </li>
      </ol>
    </nav>
  );
};

const FaqItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
  const [open, setOpen] = useState(false);
  return (
    <li className="border border-border rounded-lg overflow-hidden bg-card">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-muted/40 transition-colors"
        aria-expanded={open}
      >
        <span className="font-medium text-card-foreground">{question}</span>
        {open ? (
          <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
        ) : (
          <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
        )}
      </button>
      {open && (
        <div className="px-4 pb-4 text-sm text-muted-foreground">
          <p>{answer}</p>
        </div>
      )}
    </li>
  );
};

const ToolLandingPage: React.FC<ToolLandingPageProps> = ({ tool }) => {
  const { t } = useLocalization('interface');
  useEffect(() => {
    // Per-tool view event — distinct from the generic Page View fired by
    // RouteAnalytics, so it stays. Never includes uploaded content.
    //
    // Mixpanel is initialized lazily after the first idle callback (see
    // main.tsx). If this effect fires before init — direct navigation to a
    // tool page is the easy way to hit that window — `mixpanel.track` reads
    // an undefined config and throws "Cannot read properties of undefined
    // (reading 'before_track')", crashing the page. Gate on consent + wrap
    // in try/catch so analytics can never take the UI down.
    if (!hasAnalyticsConsent()) return;
    try {
      mixpanel.track('Tool Page View', {
        tool_slug: tool.slug,
        tool_category: tool.category,
        page_path: `/tools/${tool.slug}`,
        user_tier: 'free',
      });
    } catch {
      // Never block the UI on analytics failures.
    }
  }, [tool.slug, tool.category]);

  const slots = getToolAdSlots(tool.slug);

  return (
    <>
      {slots && (
        <div className="max-w-7xl mx-auto px-4 pt-4">
          <AdBanner
            adSlot={slots.header}
            adFormat="leaderboard"
            adPosition={`tool_${tool.slug}_header`}
            utmMedium={`tool_${tool.slug}_header_leaderboard`}
          />
        </div>
      )}
      <div className="max-w-[1600px] mx-auto my-2 flex flex-col lg:flex-row gap-6 px-4">
        {slots && (
          <aside className="hidden lg:block w-[300px] shrink-0">
            <AdBanner
              adSlot={slots.sidebar_left}
              adFormat="halfpage"
              adPosition={`tool_${tool.slug}_sidebar_left`}
              sticky
              utmMedium={`tool_${tool.slug}_sidebar_left_halfpage`}
            />
          </aside>
        )}
        <div className="flex-1 min-w-0">
          <Card className="sci-fi-frame">
            <CardContent className="p-10 md:p-12">
              <Breadcrumbs tool={tool} />

              <header className="mb-6">
                <h1 className="text-3xl md:text-4xl font-bold text-card-foreground leading-tight">
                  {tool.h1}
                </h1>
                <p className="text-lg text-muted-foreground mt-3 max-w-3xl">{tool.tagline}</p>
              </header>

              <p className="text-base text-card-foreground mb-2">{tool.intro}</p>

              <EmbeddedToolPanel
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

              {tool.supportedFormats && (
                tool.supportedFormats.supportedInputFormats?.length ||
                tool.supportedFormats.supportedOutputFormats?.length ||
                tool.supportedFormats.maxFileNotes?.length ||
                tool.supportedFormats.processingNotes?.length
              ) ? (
                <section className="my-8" aria-label={t('toolLanding.supportedFormatsTitle')}>
                  <h2 className="text-2xl font-semibold text-card-foreground mb-3">{t('toolLanding.supportedFormatsTitle')}</h2>
                  <div className="grid gap-4 md:grid-cols-2">
                    {tool.supportedFormats.supportedInputFormats?.length ? (
                      <div className="rounded-lg border border-border bg-background/40 p-4">
                        <h3 className="font-medium text-card-foreground mb-2">{t('toolLanding.inputFormats')}</h3>
                        <ul className="flex flex-wrap gap-2">
                          {tool.supportedFormats.supportedInputFormats.map((fmt) => (
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
                    {tool.supportedFormats.supportedOutputFormats?.length ? (
                      <div className="rounded-lg border border-border bg-background/40 p-4">
                        <h3 className="font-medium text-card-foreground mb-2">{t('toolLanding.outputFormats')}</h3>
                        <ul className="flex flex-wrap gap-2">
                          {tool.supportedFormats.supportedOutputFormats.map((fmt) => (
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
                  {(tool.supportedFormats.maxFileNotes?.length || tool.supportedFormats.processingNotes?.length) && (
                    <ul className="mt-4 space-y-1 text-sm text-muted-foreground list-disc pl-6">
                      {tool.supportedFormats.maxFileNotes?.map((note) => (
                        <li key={`max-${note}`}>{note}</li>
                      ))}
                      {tool.supportedFormats.processingNotes?.map((note) => (
                        <li key={`proc-${note}`}>{note}</li>
                      ))}
                    </ul>
                  )}
                </section>
              ) : null}

              <section className="my-8" aria-label={t('toolLanding.whatItDoesTitle')}>
                <h2 className="text-2xl font-semibold text-card-foreground mb-3">{t('toolLanding.whatItDoesTitle')}</h2>
                <ul className="space-y-2 list-disc pl-6 text-card-foreground">
                  {tool.whatItDoes.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>

              <ToolFlowDiagram
                title={t('toolFlowDiagram.defaultTitle')}
                steps={tool.flowSteps}
              />

              {slots && (
                <div className="my-12 flex justify-center">
                  <AdBanner
                    adSlot={slots.incontent}
                    adFormat="rectangle"
                    adPosition={`tool_${tool.slug}_incontent`}
                    utmMedium={`tool_${tool.slug}_incontent_rectangle`}
                  />
                </div>
              )}

              {tool.advancedDetails && tool.advancedDetails.length > 0 && (
                <details className="my-8 rounded-lg border border-border bg-card p-4">
                  <summary className="cursor-pointer font-semibold text-card-foreground">
                    {t('toolLanding.advancedDetailsTitle')}
                  </summary>
                  <ul className="mt-3 list-disc pl-6 space-y-2 text-sm text-muted-foreground">
                    {tool.advancedDetails.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </details>
              )}

              <section className="my-8" aria-label={t('toolLanding.whyItMattersTitle')}>
                <h2 className="text-2xl font-semibold text-card-foreground mb-3">{t('toolLanding.whyItMattersTitle')}</h2>
                <ul className="space-y-2 list-disc pl-6 text-card-foreground">
                  {tool.whyItMatters.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>

              <section className="my-8" aria-label={t('toolLanding.useCasesTitle')}>
                <h2 className="text-2xl font-semibold text-card-foreground mb-3">{t('toolLanding.useCasesTitle')}</h2>
                <div className="grid gap-3 md:grid-cols-2">
                  {tool.useCases.map((useCase) => (
                    <div
                      key={useCase.title}
                      className="rounded-lg border border-border bg-background/40 p-4"
                    >
                      <h3 className="font-medium text-card-foreground">{useCase.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{useCase.description}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="my-8" aria-label={t('toolLanding.whyMediaManipulatorTitle')}>
                <h2 className="text-2xl font-semibold text-card-foreground mb-3">
                  {t('toolLanding.whyMediaManipulatorTitle')}
                </h2>
                <ul className="space-y-2 list-disc pl-6 text-card-foreground">
                  {tool.whyMediaManipulator.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>

              <section
                className="my-8 rounded-lg border border-blue-200 dark:border-blue-900/60 bg-blue-50/50 dark:bg-blue-950/30 p-4 flex items-start gap-3"
                aria-label={t('toolLanding.privacyTitle')}
              >
                <Shield className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <h2 className="text-base font-semibold text-card-foreground">{t('toolLanding.privacyTitle')}</h2>
                  <p className="text-sm text-muted-foreground mt-1">{tool.privacyNote}</p>
                </div>
              </section>

              <section className="my-8" aria-label={t('toolLanding.faqTitle')}>
                <h2 className="text-2xl font-semibold text-card-foreground mb-3">{t('toolLanding.faqShortTitle')}</h2>
                <ul className="space-y-2 list-none">
                  {tool.faq.map((item) => (
                    <FaqItem key={item.question} question={item.question} answer={item.answer} />
                  ))}
                </ul>
              </section>

              <RelatedLinks
                title={t('toolLanding.relatedTitle')}
                intro={t('toolLanding.relatedIntro')}
                links={tool.related}
              />
            </CardContent>
          </Card>
        </div>
        {slots && (
          <aside className="hidden lg:block w-[300px] shrink-0">
            <AdBanner
              adSlot={slots.sidebar_right}
              adFormat="halfpage"
              adPosition={`tool_${tool.slug}_sidebar_right`}
              sticky
              utmMedium={`tool_${tool.slug}_sidebar_right_halfpage`}
            />
          </aside>
        )}
      </div>
      {slots && (
        <div className="max-w-7xl mx-auto px-4 pb-8">
          <AdBanner
            adSlot={slots.footer}
            adFormat="leaderboard"
            adPosition={`tool_${tool.slug}_footer`}
            className="mt-8"
            utmMedium={`tool_${tool.slug}_footer_leaderboard`}
          />
        </div>
      )}
    </>
  );
};

export default ToolLandingPage;
