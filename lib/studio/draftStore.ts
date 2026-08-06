/**
 * draftStore — the crash-recovery draft buffer (part 08, ADR ws/0001 item 2).
 *
 * Unsaved edits are throttle-written to IndexedDB so a crash, hard refresh, or
 * network gap costs seconds instead of a session. One draft per project (key =
 * project id); the editor offers recovery on reopen when the draft is newer
 * than the server copy (`lib/studio/draftRecovery.ts` owns that decision).
 *
 * Drafts are strictly best-effort: every method swallows IndexedDB
 * unavailability or failure (private-mode Safari, quota, corrupted DB) and
 * degrades to "no draft" — nothing here may ever crash the editor. No wrapper
 * dependency: the raw API surface we need is tiny.
 */

import { studioProjectSchema, type StudioProject } from '@/lib/studioTypes';

export const DRAFT_DB_NAME = 'mm-studio-drafts';
export const DRAFT_STORE_NAME = 'drafts';
const DRAFT_DB_VERSION = 1;

/** Trailing throttle for draft writes — independent of the 1.2s autosave debounce. */
export const DRAFT_WRITE_THROTTLE_MS = 3000;
export const DRAFT_PRUNE_KEEP = 10;
export const DRAFT_PRUNE_MAX_AGE_DAYS = 14;

export interface StudioDraft {
  projectId: string;
  /**
   * Server revision the drafted document was loaded/last-saved at (part 07).
   * null when the backend never echoed one (legacy last-write-wins mode).
   * Recovery compares this against the freshly loaded server revision: equal →
   * clean recovery; older → the project was saved elsewhere after the draft,
   * so the conflict-dialog path runs instead of silently applying it.
   */
  baseRevision: number | null;
  /** Client clock at write time, epoch ms. */
  savedAt: number;
  /** The full EDL document as it stood at write time. */
  document: StudioProject;
  appVersion?: string;
}

let warnedUnavailable = false;
function warnOnce(err: unknown): void {
  if (warnedUnavailable) return;
  warnedUnavailable = true;
  console.warn('[studio] draft buffer unavailable — crash recovery is disabled this session', err);
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DRAFT_DB_NAME, DRAFT_DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(DRAFT_STORE_NAME)) {
        db.createObjectStore(DRAFT_STORE_NAME, { keyPath: 'projectId' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error ?? new Error('indexedDB open failed'));
  });
}

function requestDone<T>(req: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error ?? new Error('indexedDB request failed'));
  });
}

function transactionDone(tx: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error('indexedDB transaction failed'));
    tx.onabort = () => reject(tx.error ?? new Error('indexedDB transaction aborted'));
  });
}

/**
 * Open → run one operation → wait for the transaction → close. A connection
 * per call keeps the module state-free (no cached connection to invalidate,
 * and tests can swap the global `indexedDB` between cases). Returns null on
 * any failure, including IndexedDB being absent entirely.
 */
async function withStore<T>(
  mode: IDBTransactionMode,
  fn: (store: IDBObjectStore) => Promise<T>,
): Promise<T | null> {
  if (typeof indexedDB === 'undefined') {
    warnOnce(new Error('indexedDB is not defined'));
    return null;
  }
  let db: IDBDatabase | null = null;
  try {
    db = await openDb();
    const tx = db.transaction(DRAFT_STORE_NAME, mode);
    const result = await fn(tx.objectStore(DRAFT_STORE_NAME));
    await transactionDone(tx);
    return result;
  } catch (err) {
    warnOnce(err);
    return null;
  } finally {
    db?.close();
  }
}

/** Write (or replace) the project's draft. Returns whether the write landed. */
export async function putDraft(draft: StudioDraft): Promise<boolean> {
  const ok = await withStore('readwrite', async (store) => {
    await requestDone(store.put(draft));
    return true;
  });
  return ok === true;
}

/**
 * Read the project's draft. Records that fail validation (a schema from a
 * newer/older build, or corruption) are deleted and reported as absent so a
 * bad draft can never wedge the open flow.
 */
export async function getDraft(projectId: string): Promise<StudioDraft | null> {
  const raw = await withStore('readonly', (store) =>
    requestDone(store.get(projectId) as IDBRequest<unknown>),
  );
  if (raw === null || raw === undefined || typeof raw !== 'object') return null;
  const rec = raw as Partial<StudioDraft>;
  const doc = studioProjectSchema.safeParse(rec.document);
  if (typeof rec.savedAt !== 'number' || !doc.success) {
    void deleteDraft(projectId);
    return null;
  }
  return {
    projectId,
    baseRevision: typeof rec.baseRevision === 'number' ? rec.baseRevision : null,
    savedAt: rec.savedAt,
    document: doc.data,
    appVersion: typeof rec.appVersion === 'string' ? rec.appVersion : undefined,
  };
}

/** Remove the project's draft (after a confirmed server save, or on decline). */
export async function deleteDraft(projectId: string): Promise<boolean> {
  const ok = await withStore('readwrite', async (store) => {
    await requestDone(store.delete(projectId));
    return true;
  });
  return ok === true;
}

/**
 * Cap the buffer: keep at most `keep` drafts (newest by savedAt) and drop
 * anything older than `maxAgeDays` regardless. Returns how many were removed.
 */
export async function pruneDrafts(
  keep: number = DRAFT_PRUNE_KEEP,
  maxAgeDays: number = DRAFT_PRUNE_MAX_AGE_DAYS,
  now: number = Date.now(),
): Promise<number> {
  const removed = await withStore('readwrite', async (store) => {
    const all = (await requestDone(store.getAll() as IDBRequest<unknown[]>)) as Array<
      Partial<StudioDraft>
    >;
    const cutoff = now - maxAgeDays * 86_400_000;
    const sorted = [...all].sort(
      (a, b) => (typeof b.savedAt === 'number' ? b.savedAt : 0) - (typeof a.savedAt === 'number' ? a.savedAt : 0),
    );
    let count = 0;
    for (let i = 0; i < sorted.length; i++) {
      const d = sorted[i];
      if (typeof d.projectId !== 'string') continue;
      const tooOld = typeof d.savedAt !== 'number' || d.savedAt < cutoff;
      if (i >= keep || tooOld) {
        await requestDone(store.delete(d.projectId));
        count++;
      }
    }
    return count;
  });
  return removed ?? 0;
}

// ---------------------------------------------------------------------------
// Throttled writer
// ---------------------------------------------------------------------------

export interface DraftWriter {
  /** A document mutation happened; schedule a trailing write if none is pending. */
  notifyChange: () => void;
  /** Fire a pending write immediately (pagehide / tab hidden). No-op when clean. */
  flush: () => void;
  dispose: () => void;
}

/**
 * Trailing throttle: the first change schedules `write` after `intervalMs`;
 * further changes inside the window coalesce into that one call (which reads
 * the latest state), so continuous editing writes at most once per interval —
 * never per keystroke. `write` is responsible for reading current state and
 * for its own error handling.
 */
export function createDraftWriter(
  write: () => void,
  intervalMs: number = DRAFT_WRITE_THROTTLE_MS,
): DraftWriter {
  let timer: ReturnType<typeof setTimeout> | null = null;
  let pending = false;
  let disposed = false;

  const fire = () => {
    timer = null;
    if (disposed || !pending) return;
    pending = false;
    write();
  };

  return {
    notifyChange: () => {
      if (disposed) return;
      pending = true;
      if (timer === null) timer = setTimeout(fire, intervalMs);
    },
    flush: () => {
      if (disposed || !pending) return;
      if (timer !== null) {
        clearTimeout(timer);
        timer = null;
      }
      pending = false;
      write();
    },
    dispose: () => {
      disposed = true;
      pending = false;
      if (timer !== null) {
        clearTimeout(timer);
        timer = null;
      }
    },
  };
}
