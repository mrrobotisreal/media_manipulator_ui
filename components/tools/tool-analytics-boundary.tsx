'use client';

import type { ReactNode } from 'react';

import { ToolAnalyticsProvider } from '@/lib/analytics';

/**
 * The client boundary that puts tool analytics around a /tools/* page's interactive panel.
 *
 * WHY IT EXISTS. `components/tools/tool-landing-page.tsx` is a SERVER component, so it
 * cannot render a context provider itself. Until this component, the provider lived inside
 * `EmbeddedToolPanel` — which works for the ~64 tools that use the generic converter, and
 * silently fails for the four pages that pass a custom `panel`: content-studio,
 * ai-video-restoration, ai-document-scan and ai-image-restoration. Those four emitted no
 * `tool_viewed` at all, and every other event they produced arrived with `tool_slug` NULL —
 * so four of the most expensive surfaces on the site were invisible in the per-tool funnel
 * that the whole taxonomy is built around.
 *
 * This is deliberately the thinnest possible client island: one provider, no state, no
 * effects of its own. It is rendered around `{panel ?? <EmbeddedToolPanelClient …/>}`, which
 * means the generic converter now sits inside two nested providers. That is handled, not
 * tolerated — `ToolAnalyticsProvider` suppresses its view event when a parent has already
 * announced the same slug (see its comment), and the inner provider keeps its own
 * `viewEntryPoint` because the panel is also rendered standalone in four tutorial views
 * where no boundary exists.
 */
export interface ToolAnalyticsBoundaryProps {
  /** Canonical slug from content/toolPages.ts. */
  slug: string;
  /** The tool's default media kind, when it only handles one. */
  mediaKind?: string | null;
  children: ReactNode;
}

export default function ToolAnalyticsBoundary({
  slug,
  mediaKind,
  children,
}: ToolAnalyticsBoundaryProps) {
  return (
    <ToolAnalyticsProvider slug={slug} mediaKind={mediaKind} viewEntryPoint="tool_page">
      {children}
    </ToolAnalyticsProvider>
  );
}
