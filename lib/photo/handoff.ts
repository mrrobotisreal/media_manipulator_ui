/**
 * Tool page -> editor hand-off (MM100 decision 2). An Aperture tool page's drop zone
 * cannot pass a File through a URL, and the editor is a different document (the
 * chromeless /photo route), so the chosen photo waits in a tiny IndexedDB store
 * (`mm-photo-handoff`, one record) and the editor takes it exactly once on
 * `/photo/new?handoff=1`, with the panel (and look) to open in the query.
 *
 * Best-effort like the draft store: every access is wrapped; a failure sends the
 * visitor to the editor's own drop zone with nothing lost.
 */
import { isPhotoPanelId, type PhotoPanelId } from '@/lib/photo/panelIds';

export const HANDOFF_DB = 'mm-photo-handoff';
const STORE = 'handoff';
const KEY = 'pending';
/** A hand-off older than this is ignored (a stale record from an abandoned page). */
export const HANDOFF_MAX_AGE_MS = 10 * 60 * 1000;

export interface Handoff {
  file: File;
  panel: PhotoPanelId | null;
  preset: string | null;
}

interface Stored {
  key: string;
  /** The photo bytes (an ArrayBuffer survives every browser's structured clone, a Blob does not in some). */
  bytes: ArrayBuffer;
  name: string;
  type: string;
  panel: string | null;
  preset: string | null;
  at: number;
}

function open(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(HANDOFF_DB, 1);
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains(STORE)) req.result.createObjectStore(STORE, { keyPath: 'key' });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error ?? new Error('indexedDB open failed'));
  });
}

async function run<T>(mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest<T>): Promise<T | null> {
  try {
    if (typeof indexedDB === 'undefined') return null;
    const db = await open();
    try {
      return await new Promise<T>((resolve, reject) => {
        const tx = db.transaction(STORE, mode);
        const req = fn(tx.objectStore(STORE));
        tx.oncomplete = () => resolve(req.result);
        tx.onerror = () => reject(tx.error);
        tx.onabort = () => reject(tx.error);
      });
    } finally {
      db.close();
    }
  } catch {
    return null;
  }
}

function readBytes(file: Blob): Promise<ArrayBuffer> {
  if (typeof file.arrayBuffer === 'function') return file.arrayBuffer();
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as ArrayBuffer);
    r.onerror = () => reject(r.error);
    r.readAsArrayBuffer(file);
  });
}

/** Query string the tool page navigates to. */
export function handoffHref(panel: PhotoPanelId | null, preset: string | null): string {
  const q = new URLSearchParams({ handoff: '1' });
  if (panel) q.set('panel', panel);
  if (preset) q.set('preset', preset);
  return `/photo/new?${q.toString()}`;
}

/** Store the chosen photo; false when storage is unavailable (the caller falls back to a bare editor link). */
export async function putHandoff(file: File, panel: PhotoPanelId | null, preset: string | null, now = Date.now()): Promise<boolean> {
  let bytes: ArrayBuffer;
  try {
    bytes = await readBytes(file);
  } catch {
    return false;
  }
  const rec: Stored = { key: KEY, bytes, name: file.name, type: file.type, panel, preset, at: now };
  const r = await run('readwrite', (s) => s.put(rec));
  return r !== null;
}

/** Read and delete the pending hand-off (once). */
export async function takeHandoff(now = Date.now()): Promise<Handoff | null> {
  const rec = await run<Stored | undefined>('readonly', (s) => s.get(KEY) as IDBRequest<Stored | undefined>);
  if (!rec) return null;
  await run('readwrite', (s) => s.delete(KEY));
  if (Object.prototype.toString.call(rec.bytes) !== '[object ArrayBuffer]' || now - rec.at > HANDOFF_MAX_AGE_MS) return null;
  return {
    file: new File([rec.bytes], rec.name || 'photo', { type: rec.type }),
    panel: isPhotoPanelId(rec.panel) ? rec.panel : null,
    preset: typeof rec.preset === 'string' && /^[A-Za-z0-9_-]{1,40}$/.test(rec.preset) ? rec.preset : null,
  };
}
