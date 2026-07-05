// Transient hand-off for media uploads. A ProseMirror node's attrs must be
// JSON-serializable, so the File being uploaded can't live in attrs. Instead the
// slash-menu insertion stashes the File here under a fresh key, sets that key as
// the node's `pendingKey` attr, and the media node view claims it on mount. The
// map is process-local and never serialized.

import type { DrAssetKind } from '@/schemas/drDocs';

export interface StashedUpload {
  file: File;
  kind: DrAssetKind;
  contentType: string;
}

const pending = new Map<string, StashedUpload>();

/** Stash a File for upload; returns the key to set as the node's pendingKey. */
export function stashUpload(upload: StashedUpload): string {
  const key = crypto.randomUUID();
  pending.set(key, upload);
  return key;
}

/** Claim (and remove) a stashed upload. Returns undefined if already claimed. */
export function takeUpload(key: string): StashedUpload | undefined {
  const value = pending.get(key);
  pending.delete(key);
  return value;
}
