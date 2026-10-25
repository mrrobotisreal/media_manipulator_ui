/**
 * Pure recovery decision for Motion drafts (mirrors Darkroom's
 * `lib/studio/draftRecovery.ts`, which also supplies `deepEqual` and the
 * relative-time label). In MM42 every project is local, so the only
 * question is whether the draft holds anything beyond the document the
 * editor would otherwise open with.
 */
import { deepEqual } from '@/lib/studio/draftRecovery';
import type { VectorDraft } from '@/lib/vector/draftStore';
import type { VectorDoc } from '@/lib/vector/vectorTypes';

export { formatRelativeTime } from '@/lib/studio/draftRecovery';

export type VectorDraftDecision = 'none' | 'recover' | 'discard';

/**
 * - no draft → none
 * - draft identical to the document we would open → discard (nothing to recover)
 * - draft older than the server copy (MM44 passes `serverUpdatedAt`) → discard
 * - otherwise → recover (prompt)
 */
export function evaluateVectorDraft(
  draft: VectorDraft | null,
  base: VectorDoc | null,
  serverUpdatedAt?: number,
): VectorDraftDecision {
  if (!draft) return 'none';
  if (serverUpdatedAt !== undefined && draft.savedAt <= serverUpdatedAt) return 'discard';
  if (base && deepEqual(draft.document, base)) return 'discard';
  return 'recover';
}

export interface VectorDraftSummary {
  layers: number;
  /** Count of every nested layer too. */
  totalLayers: number;
}

export function summarizeVectorDraft(doc: VectorDoc): VectorDraftSummary {
  let total = 0;
  const walk = (ls: VectorDoc['layers']) => {
    for (const l of ls) {
      total++;
      if (l.type === 'group') walk(l.children);
    }
  };
  walk(doc.layers);
  return { layers: doc.layers.length, totalLayers: total };
}
