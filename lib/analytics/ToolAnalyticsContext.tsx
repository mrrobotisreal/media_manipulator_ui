'use client';

import * as React from 'react';

import { analytics } from './client';
import {
  EVENTS,
  normalizeMediaKind,
  type EventName,
  type MediaKind,
  type PropsFor,
  type TrackOptions,
} from './events';

/**
 * Tool context: how `tool_slug` gets onto every tool event without being guessed.
 *
 * WHY NOT DERIVE IT FROM THE URL. Because it breaks on exactly the two surfaces that
 * matter most:
 *
 *   1. The HOMEPAGE CONVERTER (`views/file-converter-app.tsx`) lives at `/` and is not a
 *      tool route at all, yet it is the single most-used tool on the site.
 *   2. EMBEDDED TOOL PANELS render inside an arbitrary page, and in the CreaTV iframe the
 *      URL is not even ours.
 *
 * A URL-derived slug would silently attribute the homepage's conversions to nothing, and
 * an embedded panel's to whatever page it happened to be on. `tool_slug` is the heart of
 * the tool funnel, and the funnel is the heart of the product — so the slug is passed
 * explicitly, from the same `toolPages.ts` data that renders the page.
 *
 * The homepage converter deliberately provides `slug={null}`, which means "no tool" rather
 * than "unknown tool": its media kind comes from the selected file instead.
 */

export interface ToolAnalyticsValue {
  toolSlug: string | null;
  mediaKind?: MediaKind;
  /** Track an event pre-stamped with this tool's slug and media kind. */
  track: <E extends EventName>(name: E, props?: PropsFor<E>, options?: TrackOptions) => void;
  /** Update the media kind once a file is chosen. */
  setMediaKind: (kind: string | null | undefined) => void;
}

const ToolAnalyticsContext = React.createContext<ToolAnalyticsValue | null>(null);

/** Where the visitor met this tool. Rides on `tool_viewed` as `entry_point`. */
export type ToolViewEntryPoint = 'tool_page' | 'homepage' | 'embedded';

export interface ToolAnalyticsProviderProps {
  /** Canonical slug from content/toolPages.ts, or null for the homepage converter. */
  slug: string | null;
  /** Initial media kind, when the tool only handles one. */
  mediaKind?: string | null;
  /**
   * When set, the provider emits `tool_viewed` exactly once on mount.
   *
   * WHY THE PROVIDER OWNS THIS. `tool_viewed` is the top of the tool funnel, and it
   * used to be emitted by whichever panel happened to be rendering — which meant the
   * four pages that pass a CUSTOM panel to tool-landing-page (content-studio and the
   * three AI tools) emitted it nowhere, and their whole funnel arrived with no
   * `tool_slug`. The provider is the one component that is guaranteed to exist wherever
   * a tool is instrumented at all, so it is the only place the event cannot be forgotten.
   *
   * Omit it for a provider that is only there to supply context (a nested one, or a
   * subtree whose parent already announced the view).
   */
  viewEntryPoint?: ToolViewEntryPoint;
  children: React.ReactNode;
}

export function ToolAnalyticsProvider({
  slug,
  mediaKind,
  viewEntryPoint,
  children,
}: ToolAnalyticsProviderProps) {
  // The effective kind is DERIVED, not synced.
  //
  // A tool declares a default kind via its prop; once a file is chosen the panel narrows it
  // via setMediaKind. Modelling that as `override ?? prop` rather than as state kept in step
  // with the prop by an effect avoids the prop-sync anti-pattern entirely: there is no render
  // in which the two disagree, and no cascading re-render when the prop changes.
  const [override, setOverride] = React.useState<MediaKind | undefined>(undefined);
  const kind = override ?? normalizeMediaKind(mediaKind);

  // NESTING IS EXPECTED AND MUST NOT DOUBLE-FIRE.
  //
  // On a /tools/* page the landing page wraps a boundary provider around the panel,
  // and EmbeddedToolPanel ALSO wraps itself — because it is rendered standalone in four
  // tutorial views, where nothing else would supply a slug or announce the view. So the
  // inner provider has to keep its viewEntryPoint for the standalone case while staying
  // silent when it is nested under a parent that already announced the same tool.
  //
  // Same-slug is the test rather than mere presence of a parent: a genuinely different
  // tool rendered inside another tool's subtree IS a second view and should say so.
  const parent = React.useContext(ToolAnalyticsContext);
  const alreadyAnnounced = parent !== null && parent.toolSlug === slug;

  // Keep the SDK's persistent context in step so events emitted OUTSIDE this subtree
  // during a tool visit (a web vital, a page_leave, a global error) also carry the slug.
  // Clearing on unmount is what stops the next page's events inheriting it.
  React.useEffect(() => {
    analytics.setContext({ tool_slug: slug, media_kind: kind });
    return () => {
      analytics.setContext({ tool_slug: null, media_kind: undefined });
    };
  }, [slug, kind]);

  // The view event. Declared AFTER the context effect so the slug is already on the
  // SDK's persistent context by the time it fires, and with an empty dep list so a
  // media-kind narrowing (which happens as soon as a file is chosen) cannot re-announce
  // a view that already happened.
  const announced = React.useRef(false);
  React.useEffect(() => {
    if (!viewEntryPoint || alreadyAnnounced || announced.current) return;
    announced.current = true;
    analytics.track(EVENTS.TOOL_VIEWED, { entry_point: viewEntryPoint }, { tool_slug: slug, media_kind: kind });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = React.useMemo<ToolAnalyticsValue>(
    () => ({
      toolSlug: slug,
      mediaKind: kind,
      track: (name, props, options) => {
        analytics.track(name, props, {
          tool_slug: slug,
          media_kind: kind,
          ...options,
        });
      },
      setMediaKind: (next) => setOverride(normalizeMediaKind(next)),
    }),
    [slug, kind],
  );

  return <ToolAnalyticsContext.Provider value={value}>{children}</ToolAnalyticsContext.Provider>;
}

/**
 * Read the tool context.
 *
 * Returns a WORKING fallback outside a provider rather than null or a throw. Several tool
 * components are also rendered on marketing pages and inside the chromeless `/embed`
 * tree, and a hook that threw there would turn a missing wrapper into a blank page. The
 * fallback tracks without a slug, which shows up in the data as an unattributed event —
 * visible, diagnosable, and not an outage.
 */
export function useToolAnalytics(): ToolAnalyticsValue {
  const context = React.useContext(ToolAnalyticsContext);
  const fallback = React.useMemo<ToolAnalyticsValue>(
    () => ({
      toolSlug: null,
      mediaKind: undefined,
      track: (name, props, options) => analytics.track(name, props, options),
      setMediaKind: () => undefined,
    }),
    [],
  );
  return context ?? fallback;
}

export default ToolAnalyticsProvider;
