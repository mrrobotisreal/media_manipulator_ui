'use client';

import { useCallback, useEffect, useRef } from 'react';
import { EVENTS, useToolAnalytics } from '@/lib/analytics';
import { metadataTagBucket } from '@/lib/analytics/buckets';
import type { MetadataSurface } from '@/lib/analytics/events';
import type { DiffEvent, InspectorEvent, MetadataDocument } from './types';

/** Documents already reported, per analytics surface: `metadata_inspected` is once per document. */
const reported = new WeakMap<MetadataDocument, Set<string>>();

const KINDS: ReadonlySet<string> = new Set(['image', 'video', 'audio', 'pdf', 'document']);

/** Enum-ify the document kind so an unexpected server string never becomes a free-form property. */
export const metadataKindOf = (doc: MetadataDocument): string => (KINDS.has(doc.file.kind) ? doc.file.kind : 'other');

export interface MetadataAnalytics {
  /** Pass to `MetadataInspector onEvent`. */
  onEvent: (event: InspectorEvent) => void;
  /** Pass to `MetadataStrip` / `MetadataDiffModal onEvent`. */
  onDiffEvent: (event: DiffEvent) => void;
}

/**
 * The single place metadata UI events become analytics. Components stay analytics-free and
 * report typed events; this maps them to `EVENTS.*` with bucketed, enum-only properties
 * (never tag names, values, file names or coordinates). `tool_slug` / `media_kind` ride
 * along from the tool context.
 *
 * When `document` is given, `metadata_inspected` fires once for it (per surface), and the
 * binary-download event can resolve its category from it.
 */
export function useMetadataAnalytics(surface: MetadataSurface, document?: MetadataDocument | null): MetadataAnalytics {
  const { track, toolSlug } = useToolAnalytics();
  const trackRef = useRef(track);
  const docRef = useRef(document);
  const searched = useRef(false);
  useEffect(() => {
    trackRef.current = track;
    docRef.current = document;
  });

  useEffect(() => {
    if (!document) return;
    let seen = reported.get(document);
    if (!seen) {
      seen = new Set();
      reported.set(document, seen);
    }
    if (seen.has(surface)) return;
    seen.add(surface);
    trackRef.current(EVENTS.METADATA_INSPECTED, {
      surface,
      kind: metadataKindOf(document),
      tag_bucket: metadataTagBucket(document.entries.length),
      has_gps: document.entries.some((e) => e.category === 'gps'),
      has_c2pa: document.entries.some((e) => e.category === 'c2pa'),
    });
  }, [document, surface]);

  const onEvent = useCallback((event: InspectorEvent) => {
    const t = trackRef.current;
    switch (event.type) {
      case 'section_toggled':
        t(EVENTS.METADATA_SECTION_TOGGLED, { category: event.category, open: event.open });
        break;
      case 'search_used':
        if (searched.current) break;
        searched.current = true;
        t(EVENTS.METADATA_SEARCH_USED, {});
        break;
      case 'privacy_filter_used':
        if (event.active) t(EVENTS.METADATA_PRIVACY_FILTER_USED, { flag: event.privacy });
        break;
      case 'binary_downloaded': {
        const entry = docRef.current?.entries.find((e) => e.id === event.entryId);
        t(EVENTS.METADATA_BINARY_DOWNLOADED, { category: entry?.category ?? 'other' });
        break;
      }
    }
  }, []);

  const slugRef = useRef(toolSlug);
  useEffect(() => {
    slugRef.current = toolSlug;
  });
  const onDiffEvent = useCallback((event: DiffEvent) => {
    const t = trackRef.current;
    if (event.type === 'diff_opened') {
      t(EVENTS.METADATA_DIFF_OPENED, {
        tool: slugRef.current ?? 'home',
        removed_bucket: metadataTagBucket(event.removed),
        added_bucket: metadataTagBucket(event.added),
        changed_bucket: metadataTagBucket(event.changed),
      });
    } else {
      t(EVENTS.METADATA_DIFF_MODE_CHANGED, { mode: event.mode });
    }
  }, []);

  return { onEvent, onDiffEvent };
}
