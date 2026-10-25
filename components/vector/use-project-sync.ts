'use client';

import * as React from 'react';

import { getCurrentIdToken } from '@/lib/firebase';
import type { SaveStateSnapshot } from '@/lib/studio/saveState';
import { isIrreversibleActionHidden } from '@/lib/translator/mode';
import { deleteVectorDraft } from '@/lib/vector/draftStore';
import type { VectorApiError, VectorProject } from '@/lib/vector/projectsApi';
import { createSaveController, type SaveController } from '@/lib/vector/saveController';
import { renderThumbnailPng, uploadThumbnail } from '@/lib/vector/thumbnail';
import { useVectorStore } from '@/lib/vector/vectorStore';

/** Autosave debounce for account projects (the draft buffer keeps its own 2 s). */
export const VECTOR_AUTOSAVE_MS = 2500;
/** Re-render the thumbnail at most this often (proposed). */
export const VECTOR_THUMBNAIL_EVERY_MS = 60_000;

export type SyncStatus = SaveStateSnapshot['state'] | 'local';

export interface ProjectSync {
  /** `local` = browser-only (not saved to the account yet, or signed out). */
  status: SyncStatus;
  server: { id: string; revision: number } | null;
  conflict: { currentRevision: number; updatedAt: string } | null;
  /** The first save to the account was refused (e.g. 403 vector_projects_limit). */
  refused: VectorApiError | null;
  clearRefused: () => void;
  /** Save now: creates the account project on first use (needs sign-in). */
  saveNow: () => Promise<boolean>;
  keepMine: () => Promise<boolean>;
  reloadTheirs: () => Promise<boolean>;
  /** Server save is unavailable on translator deployments (MM52). */
  available: boolean;
}

/**
 * Wires `createSaveController` (lib/vector/saveController.ts) to the editor
 * (ticket MM44 decision 10):
 *
 *   - browser-only projects stay local until the user picks "Save to
 *     account" (proposed: a first save is explicit so it never spends a
 *     saved-project slot silently); the server id then replaces the URL;
 *   - account projects autosave 2.5 s after the last edit;
 *   - the IndexedDB draft is deleted only after a save landed AND the
 *     document has not changed since (otherwise it holds newer work);
 *   - a thumbnail (320 px PNG at the playhead) is uploaded after a save at
 *     most once a minute, and its key goes out with an immediate follow-up save.
 *
 * Off on translator deployments (MM52: server writes are hidden there).
 */
export function useProjectSync(opts: {
  ready: boolean;
  signedIn: boolean | null;
  /** Set when the editor opened an account project. */
  initialServer: { id: string; revision: number } | null;
}): ProjectSync {
  const available = !isIrreversibleActionHidden();
  const [snap, setSnap] = React.useState<SaveStateSnapshot>({ state: 'saved', attempt: 0, nextRetryDelayMs: null });
  const [server, setServer] = React.useState(opts.initialServer);
  const [conflict, setConflict] = React.useState<ProjectSync['conflict']>(null);
  const [refused, setRefused] = React.useState<VectorApiError | null>(null);
  const ctrl = React.useRef<SaveController | null>(null);
  const lastThumb = React.useRef(0);
  const lastThumbDoc = React.useRef<object | null>(null);
  const localIdRef = React.useRef<string | null>(null);

  React.useEffect(() => {
    if (!opts.ready || !available) return;
    localIdRef.current = useVectorStore.getState().projectId;
    const c = createSaveController({
      source: {
        read: () => {
          const s = useVectorStore.getState();
          return s.doc ? { doc: s.doc, name: s.name } : null;
        },
      },
      getToken: getCurrentIdToken,
      server: opts.initialServer,
      onCreated: (p) => {
        const s = useVectorStore.getState();
        s.setProjectId(p.id);
        try {
          window.history.replaceState(null, '', `/motion/${p.id}`);
        } catch {
          // ignore
        }
        // The browser-only draft moves to the server id with the next draft write.
        const local = localIdRef.current;
        if (local && local !== p.id) void deleteVectorDraft(local);
      },
      onSaved: (p, docSaved) => {
        setServer({ id: p.id, revision: p.revision });
        setConflict(null);
        const s = useVectorStore.getState();
        if (s.doc === docSaved) void deleteVectorDraft(p.id);
        void maybeThumbnail(p);
      },
      onConflict: (info) => setConflict(info),
      onRefused: (err) => setRefused(err),
    });
    ctrl.current = c;
    // `initialServer` arrives with the opened project (after the first render).
    setServer(c.server());
    setSnap(c.getSnapshot());
    const unsub = c.subscribe(() => setSnap(c.getSnapshot()));

    const maybeThumbnail = async (p: VectorProject) => {
      const s = useVectorStore.getState();
      if (!s.doc || s.doc === lastThumbDoc.current || Date.now() - lastThumb.current < VECTOR_THUMBNAIL_EVERY_MS) return;
      lastThumb.current = Date.now();
      lastThumbDoc.current = s.doc;
      const png = await renderThumbnailPng(s.doc, s.time);
      const token = png ? await getCurrentIdToken() : null;
      if (!png || !token) return;
      const key = await uploadThumbnail(token, p.id, png);
      if (!key || ctrl.current !== c) return;
      c.setPendingThumbnail(key);
      void c.save();
    };

    // Autosave account projects after edits.
    let timer: ReturnType<typeof setTimeout> | null = null;
    let last = useVectorStore.getState().revision;
    const unsubStore = useVectorStore.subscribe((s) => {
      if (s.revision === last) return;
      last = s.revision;
      if (!c.server()) return;
      c.edited();
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => void c.save(), VECTOR_AUTOSAVE_MS);
    });
    const onOnline = () => c.machine.dispatch({ type: 'online' });
    const onOffline = () => c.machine.dispatch({ type: 'offline' });
    const onHide = () => {
      if (timer && c.server()) {
        clearTimeout(timer);
        timer = null;
        void c.save();
      }
    };
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    window.addEventListener('pagehide', onHide);
    return () => {
      if (timer) clearTimeout(timer);
      unsub();
      unsubStore();
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
      window.removeEventListener('pagehide', onHide);
      c.dispose();
      if (ctrl.current === c) ctrl.current = null;
    };
    // The controller lives for the opened project; `initialServer` is read once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opts.ready, available]);

  const saveNow = React.useCallback(async () => {
    const c = ctrl.current;
    if (!c) return false;
    setRefused(null);
    return c.save();
  }, []);

  const keepMine = React.useCallback(async () => (ctrl.current ? ctrl.current.keepMine() : false), []);

  const reloadTheirs = React.useCallback(async () => {
    const c = ctrl.current;
    if (!c) return false;
    const p = await c.reloadTheirs();
    if (!p) return false;
    useVectorStore.getState().load(p.id, p.document, p.name);
    setServer({ id: p.id, revision: p.revision });
    setConflict(null);
    // Local edits were discarded on purpose (after the download offer).
    void deleteVectorDraft(p.id);
    return true;
  }, []);

  const status: SyncStatus = !server && snap.state !== 'saving' ? 'local' : snap.state;
  return {
    status,
    server,
    conflict,
    refused,
    clearRefused: () => setRefused(null),
    saveNow,
    keepMine,
    reloadTheirs,
    available,
  };
}
