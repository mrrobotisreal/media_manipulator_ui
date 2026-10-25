/**
 * Motion project save/load against MM43 (ticket MM44 decision 10), pure
 * TypeScript (no React), so the whole 409 flow is unit-testable.
 *
 * The state machine is Darkroom's (`lib/studio/saveState.ts`, ADR ws/0001):
 * its TRANSITIONS are reused as-is (saved → saving → saved | retrying |
 * offline | conflict | failed), not copied with Studio types, because the
 * machine itself has none: it is generic over "a save". What is Motion-specific
 * lives here:
 *
 *   - first save CREATES (`POST`, revision 1) and hands the server id back
 *     (`onCreated`: the editor replaces `/motion/local-…` with `/motion/<id>`);
 *     every later save is `PUT` with `If-Match: <revision>`;
 *   - 409 `revision_conflict` → `conflict` state with `currentRevision`;
 *     autosave is blocked until the user picks:
 *       Keep mine     → re-save at `currentRevision` from the 409 body,
 *       Reload theirs → fetch the server copy and replace the local document
 *                       (the editor offers "download my version" first);
 *   - the IndexedDB draft is NOT deleted until a save succeeds (`onSaved`
 *     then drops it), so an offline / failed / conflicted save never loses
 *     local edits;
 *   - a pending thumbnail key (from the presign + S3 PUT) rides along with the
 *     next save, per MM43 decision 7.
 *
 * The editor owns the debounce and calls `save()`; retries come back through
 * the machine's backoff timer.
 */
import {
  createSaveStateMachine,
  type SaveStateMachine,
  type SaveStateSnapshot,
} from '@/lib/studio/saveState';
import {
  VectorApiError,
  createVectorProject,
  getVectorProject,
  saveVectorProject,
  type FetchLike,
  type VectorProject,
} from '@/lib/vector/projectsApi';
import type { VectorDoc } from '@/lib/vector/vectorTypes';

export interface SaveSource {
  /** The current document + name, or null (nothing to save). */
  read: () => { doc: VectorDoc; name: string } | null;
}

export interface SaveControllerOptions {
  source: SaveSource;
  /** The caller's ID token, or null when signed out. */
  getToken: () => Promise<string | null>;
  /** Server id + revision when the project is already saved; null for local. */
  server: { id: string; revision: number } | null;
  /** First save created the project. */
  onCreated?: (project: VectorProject) => void;
  /** A save landed (drop the draft for `docSaved` if it is still current). */
  onSaved?: (project: VectorProject, docSaved: VectorDoc) => void;
  /** 409: the conflict banner opens. */
  onConflict?: (info: { currentRevision: number; updatedAt: string }) => void;
  /** 403 vector_projects_limit and other hard refusals of the FIRST save. */
  onRefused?: (error: VectorApiError) => void;
  fetchImpl?: FetchLike;
  isOnline?: () => boolean;
  baseDelayMs?: number;
}

export interface SaveController {
  machine: SaveStateMachine;
  getSnapshot: () => SaveStateSnapshot;
  subscribe: (l: () => void) => () => void;
  /** The server project, once created / loaded. */
  server: () => { id: string; revision: number } | null;
  /** Mark the document dirty (an edit happened). Does not save by itself. */
  edited: () => void;
  /** Save now (debounce elapsed / Cmd+S). Resolves true when it landed. */
  save: () => Promise<boolean>;
  /** 409 → Keep mine: re-save over the server copy at `currentRevision`. */
  keepMine: () => Promise<boolean>;
  /** 409 → Reload theirs: the server's copy (the caller replaces the doc). */
  reloadTheirs: () => Promise<VectorProject | null>;
  /** Attach a thumbnail key to the next save. */
  setPendingThumbnail: (key: string) => void;
  /** The 409 details while in conflict. */
  conflict: () => { currentRevision: number; updatedAt: string } | null;
  dispose: () => void;
}

export function createSaveController(opts: SaveControllerOptions): SaveController {
  let server = opts.server ? { ...opts.server } : null;
  let conflict: { currentRevision: number; updatedAt: string } | null = null;
  let pendingThumbnail: string | null = null;
  let inFlight: Promise<boolean> | null = null;
  let again = false;
  const fetchImpl = opts.fetchImpl;

  const machine = createSaveStateMachine({
    onRetry: () => void save(),
    isOnline: opts.isOnline,
    baseDelayMs: opts.baseDelayMs,
  });

  const fail = (err: unknown, first: boolean) => {
    if (err instanceof VectorApiError) {
      const c = err.conflict;
      if (c) {
        conflict = c;
        machine.dispatch({ type: 'save409' });
        opts.onConflict?.(c);
        return;
      }
      if (err.retryable) {
        machine.dispatch({ type: 'saveNetworkError' });
        return;
      }
      if (first) opts.onRefused?.(err);
      machine.dispatch({ type: 'saveHardError' });
      return;
    }
    machine.dispatch({ type: 'saveNetworkError' });
  };

  /** One PUT/POST of the current document; `revision` overrides the CAS base (Keep mine). */
  const attempt = async (revision?: number): Promise<boolean> => {
    const data = opts.source.read();
    if (!data) return false;
    const token = await opts.getToken();
    if (!token) {
      // Signed out: nothing to send; the draft keeps the work (§3.5).
      machine.dispatch({ type: 'saveHardError' });
      return false;
    }
    machine.dispatch({ type: 'saveStart' });
    const first = server === null;
    try {
      let saved: VectorProject;
      if (!server) {
        saved = await createVectorProject(token, { name: data.name, document: data.doc }, fetchImpl);
        server = { id: saved.id, revision: saved.revision };
        opts.onCreated?.(saved);
      } else {
        const thumb = pendingThumbnail;
        saved = await saveVectorProject(
          token,
          server.id,
          revision ?? server.revision,
          { name: data.name, document: data.doc, ...(thumb !== null ? { thumbnailKey: thumb } : {}) },
          fetchImpl,
        );
        if (thumb !== null && pendingThumbnail === thumb) pendingThumbnail = null;
        server = { id: saved.id || server.id, revision: saved.revision };
      }
      conflict = null;
      machine.dispatch({ type: 'saveOk' });
      opts.onSaved?.(saved, data.doc);
      return true;
    } catch (err) {
      fail(err, first);
      return false;
    }
  };

  /** Serialised: an edit during a save queues exactly one follow-up save. */
  const save = (): Promise<boolean> => {
    if (machine.getSnapshot().state === 'conflict') return Promise.resolve(false);
    if (inFlight) {
      again = true;
      return inFlight;
    }
    const run = async () => {
      let ok = await attempt();
      while (again && ok) {
        again = false;
        ok = await attempt();
      }
      again = false;
      return ok;
    };
    inFlight = run().finally(() => {
      inFlight = null;
    });
    return inFlight;
  };

  return {
    machine,
    getSnapshot: machine.getSnapshot,
    subscribe: machine.subscribe,
    server: () => (server ? { ...server } : null),
    edited: () => machine.dispatch({ type: 'edit' }),
    save,
    keepMine: async () => {
      const c = conflict;
      if (!c || !server) return false;
      // Leave the conflict state first so the machine accepts the re-save; a
      // fresh 409 re-enters it with the newer revision.
      machine.dispatch({ type: 'conflictResolved' });
      return attempt(c.currentRevision);
    },
    reloadTheirs: async () => {
      if (!server) return null;
      const token = await opts.getToken();
      if (!token) return null;
      try {
        const p = await getVectorProject(token, server.id, fetchImpl);
        server = { id: p.id || server.id, revision: p.revision };
        conflict = null;
        machine.dispatch({ type: 'conflictResolved' });
        return p;
      } catch {
        // The banner stays; the user can retry.
        return null;
      }
    },
    setPendingThumbnail: (key) => {
      pendingThumbnail = key;
    },
    conflict: () => conflict,
    dispose: () => machine.dispose(),
  };
}
