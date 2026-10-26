'use client';

import * as React from 'react';

import { EVENTS } from '@/lib/analytics/events';
import type { DrawToolId } from '@/lib/vector/tools/types';
import type { AnimatorId } from '@/lib/vector/animators';
import { addedKeyframeProperties, importProps, layerCount, savedProps, startVectorAnalytics, vectorTracker, type VectorTracker } from '@/lib/vector/analytics';
import { useVectorStore } from '@/lib/vector/vectorStore';
import type { VectorDoc } from '@/lib/vector/vectorTypes';

/**
 * The Motion editor's analytics wiring (MM49 decision 4), in one hook so the
 * editor shell only hands it the moments it knows about:
 *
 *   - `vector_editor_opened {source}` once per opened document;
 *   - `vector_project_created {source}` once, for a NEW project (opened from
 *     /motion/new), at its first content: an import into the empty canvas
 *     (`svg_import` / `lottie_import`) or the first edit (`blank`);
 *   - `vector_keyframe_added {property}` from a store subscription: an EDIT
 *     (never undo / redo / load) that grows a property's keyframe count;
 *   - `vector_tool_used`, `vector_animator_used`, `vector_import_*`,
 *     `vector_project_saved` through the callbacks it returns.
 *
 * Everything goes through the consent-gated tracker (lib/vector/analytics.ts):
 * with no stored `granted` decision, or on a translator deployment, nothing is
 * sent. The analytics client is started here, once.
 */
export function useVectorAnalytics(opts: { ready: boolean; source: 'new' | 'draft' | 'account'; track?: VectorTracker }) {
  const track = opts.track ?? vectorTracker;
  const trackRef = React.useRef(track);
  React.useEffect(() => {
    trackRef.current = track;
  }, [track]);
  const created = React.useRef(opts.source !== 'new');

  React.useEffect(() => {
    startVectorAnalytics();
  }, []);

  // Editor opened: once per ready document.
  const openedFor = React.useRef<string | null>(null);
  React.useEffect(() => {
    if (!opts.ready) return;
    const id = useVectorStore.getState().projectId;
    if (openedFor.current === id) return;
    openedFor.current = id;
    trackRef.current.track(EVENTS.VECTOR_EDITOR_OPENED, { source: opts.source });
  }, [opts.ready, opts.source]);

  // Edits: keyframes added, and the first content of a new project.
  React.useEffect(() => {
    if (!opts.ready) return;
    let prev: { doc: VectorDoc | null; past: number; future: number } = (() => {
      const s = useVectorStore.getState();
      return { doc: s.doc, past: s.past.length, future: s.future.length };
    })();
    return useVectorStore.subscribe((s) => {
      if (s.doc === prev.doc) return;
      // Classify the change by the history stacks: undo moves one entry from
      // `past` to `future`, redo the other way, load clears both. Everything
      // else (a mutate, a gesture step, the history cap) is an edit.
      const undo = s.past.length === prev.past - 1 && s.future.length === prev.future + 1;
      const redo = s.future.length === prev.future - 1;
      const load = s.past.length === 0 && s.future.length === 0 && s.gestureDepth === 0;
      if (!undo && !redo && !load) {
        for (const property of addedKeyframeProperties(prev.doc, s.doc)) trackRef.current.track(EVENTS.VECTOR_KEYFRAME_ADDED, { property });
        if (!created.current && s.doc && s.doc.layers.length > 0) {
          created.current = true;
          trackRef.current.track(EVENTS.VECTOR_PROJECT_CREATED, { source: 'blank' });
        }
      }
      prev = { doc: s.doc, past: s.past.length, future: s.future.length };
    });
  }, [opts.ready]);

  return React.useMemo(
    () => ({
      toolUsed: (tool: DrawToolId) => trackRef.current.track(EVENTS.VECTOR_TOOL_USED, { tool }),
      animatorUsed: (animator: AnimatorId) => trackRef.current.track(EVENTS.VECTOR_ANIMATOR_USED, { animator }),
      importCompleted: (format: 'svg' | 'lottie' | 'motion_json', doc: VectorDoc, warnings: number, intoEmptyCanvas: boolean) => {
        trackRef.current.track(EVENTS.VECTOR_IMPORT_COMPLETED, importProps(format, layerCount(doc), warnings));
        if (!created.current && intoEmptyCanvas && format !== 'motion_json') {
          created.current = true;
          trackRef.current.track(EVENTS.VECTOR_PROJECT_CREATED, { source: format === 'svg' ? 'svg_import' : 'lottie_import' });
        }
      },
      importFailed: (format: 'svg' | 'lottie' | 'motion_json') => trackRef.current.track(EVENTS.VECTOR_IMPORT_FAILED, importProps(format, 0, 0)),
      projectSaved: (revision: number, documentBytes: number) => trackRef.current.track(EVENTS.VECTOR_PROJECT_SAVED, savedProps(revision, documentBytes)),
      track: (...args: Parameters<VectorTracker['track']>) => trackRef.current.track(...args),
      /** A Motion document file opened into a new project is not a new creation. */
      openedDocumentFile: () => {
        created.current = true;
      },
    }),
    [],
  );
}
