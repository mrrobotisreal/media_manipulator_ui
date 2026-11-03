/**
 * The Heal press (MM98 decision 5, D2/D5): upload the stroke mask, track the
 * `photo_heal` job, and return the doc entry plus the new base. Network calls
 * are injected so the flow is unit-testable with a fake fetch.
 */
import { fetchHealResult, outcomeFromPayload, startHeal, waitForHeal, type HealOutcome } from '@/lib/photo/aiApi';

export interface HealDeps {
  startHeal: typeof startHeal;
  waitForHeal: typeof waitForHeal;
  fetchHealResult: typeof fetchHealResult;
}
export const REAL_HEAL_DEPS: HealDeps = { startHeal, waitForHeal, fetchHealResult };

export interface HealRequest {
  /** Server project id, or null for the stateless (guest) route. */
  projectId: string | null;
  mask: Blob;
  /** Current server base hash (project form); `''`/undefined = the original. */
  baseHash?: string;
  /** Guest form: the current local base (or the original). */
  file?: Blob;
  fileName?: string;
  onProgress?: (p: number) => void;
  /** Guest: how to name the healed base. */
  newLocalId?: () => string;
  signal?: AbortSignal;
}

export async function runHeal(req: HealRequest, deps: HealDeps = REAL_HEAL_DEPS): Promise<HealOutcome> {
  const jobId = await deps.startHeal({ projectId: req.projectId, mask: req.mask, baseHash: req.baseHash, file: req.file, fileName: req.fileName });
  if (req.projectId) {
    const payload = await deps.waitForHeal(jobId, { onProgress: req.onProgress, signal: req.signal });
    return outcomeFromPayload(payload);
  }
  await deps.waitForHeal(jobId, { onProgress: req.onProgress, signal: req.signal });
  const blob = await deps.fetchHealResult(jobId);
  const id = (req.newLocalId ?? (() => Math.random().toString(36).slice(2, 14)))();
  return { baseRef: `local:${id}`, blob };
}
