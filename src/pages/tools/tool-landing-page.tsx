import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronRight, Shield } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import EmbeddedToolPanel from '@/components/embedded-tool-panel';
import RelatedLinks from '@/components/related-links';
import ToolFlowDiagram from '@/components/tool-flow-diagram';
import AdBanner from '@/components/ad-banner';
import type { ToolPageContent } from '@/content/toolPages';
import mixpanel from 'mixpanel-browser';

interface ToolLandingPageProps {
  tool: ToolPageContent;
}

const Breadcrumbs: React.FC<{ tool: ToolPageContent }> = ({ tool }) => (
  <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground mb-4">
    <ol className="flex flex-wrap items-center gap-1">
      <li>
        <Link to="/" className="hover:text-card-foreground transition-colors">
          Home
        </Link>
      </li>
      <li aria-hidden="true">/</li>
      <li>
        <Link to="/tools" className="hover:text-card-foreground transition-colors">
          Tools
        </Link>
      </li>
      <li aria-hidden="true">/</li>
      <li aria-current="page" className="text-card-foreground">
        {tool.name}
      </li>
    </ol>
  </nav>
);

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
  useEffect(() => {
    // Send a page-name-only event. Never includes uploaded content.
    mixpanel.track('Tool Page View', {
      tool_slug: tool.slug,
      tool_category: tool.category,
      page_path: `/tools/${tool.slug}`,
      user_tier: 'free',
    });
  }, [tool.slug, tool.category]);

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 pt-4">
        <AdBanner
          adSlot="6671038874"
          adFormat="leaderboard"
          adPosition={`tool_${tool.slug}_header`}
          className="mb-4"
          isFlashMock={true}
          utmMedium={`tool_${tool.slug}_leaderboard`}
          utmCampaign="creatv_launch_promo"
          linkURL="https://www.creatv.io/auth"
        />
      </div>
      <Card className="max-w-7xl mx-auto my-2 sci-fi-frame">
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
            transcribeMode={tool.embed.transcribeMode}
            transcodeMode={tool.embed.transcodeMode}
            transcodeProtocol={tool.embed.transcodeProtocol}
            transcodeDashCodec={tool.embed.transcodeDashCodec}
            transcodeLockProtocol={tool.embed.transcodeLockProtocol}
            title={tool.embed.title}
            description={tool.embed.description}
          />

          <section className="my-8" aria-label="What this tool does">
            <h2 className="text-2xl font-semibold text-card-foreground mb-3">What this tool does</h2>
            <ul className="space-y-2 list-disc pl-6 text-card-foreground">
              {tool.whatItDoes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <ToolFlowDiagram
            title="How it works"
            steps={tool.flowSteps}
          />

          {tool.advancedDetails && tool.advancedDetails.length > 0 && (
            <details className="my-8 rounded-lg border border-border bg-card p-4">
              <summary className="cursor-pointer font-semibold text-card-foreground">
                Advanced technical details
              </summary>
              <ul className="mt-3 list-disc pl-6 space-y-2 text-sm text-muted-foreground">
                {tool.advancedDetails.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </details>
          )}

          <section className="my-8" aria-label="Why this matters">
            <h2 className="text-2xl font-semibold text-card-foreground mb-3">Why it matters</h2>
            <ul className="space-y-2 list-disc pl-6 text-card-foreground">
              {tool.whyItMatters.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="my-8" aria-label="Common use cases">
            <h2 className="text-2xl font-semibold text-card-foreground mb-3">Common use cases</h2>
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

          <section className="my-8" aria-label="Why Media Manipulator">
            <h2 className="text-2xl font-semibold text-card-foreground mb-3">
              Why Media Manipulator's version stands out
            </h2>
            <ul className="space-y-2 list-disc pl-6 text-card-foreground">
              {tool.whyMediaManipulator.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section
            className="my-8 rounded-lg border border-blue-200 dark:border-blue-900/60 bg-blue-50/50 dark:bg-blue-950/30 p-4 flex items-start gap-3"
            aria-label="Privacy"
          >
            <Shield className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <h2 className="text-base font-semibold text-card-foreground">Privacy & temporary storage</h2>
              <p className="text-sm text-muted-foreground mt-1">{tool.privacyNote}</p>
            </div>
          </section>

          <section className="my-8" aria-label="Frequently asked questions">
            <h2 className="text-2xl font-semibold text-card-foreground mb-3">FAQ</h2>
            <ul className="space-y-2 list-none">
              {tool.faq.map((item) => (
                <FaqItem key={item.question} question={item.question} answer={item.answer} />
              ))}
            </ul>
          </section>

          <RelatedLinks
            title="Related tools, tutorials & guides"
            intro="Keep going with related Media Manipulator pages."
            links={tool.related}
          />
        </CardContent>
      </Card>
      <div className="max-w-6xl mx-auto px-4 pb-8">
        <AdBanner
          adSlot="3633827902"
          adFormat="leaderboard"
          adPosition={`tool_${tool.slug}_footer`}
          className="mt-8"
          isFlashMock={true}
          utmMedium={`tool_${tool.slug}_footer_leaderboard`}
          utmCampaign="creatv_launch_promo"
          linkURL="https://www.creatv.io/auth"
        />
      </div>
    </>
  );
};

export default ToolLandingPage;
