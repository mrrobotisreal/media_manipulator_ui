/**
 * The counted Lottie import (ticket MM46 decision 3, design §3.6 / §3.4):
 *
 *   1. local checks: a file over 4 MB, or one that is plainly not a Lottie
 *      animation (no top-level `fr` / `op` / `layers`; a Motion document),
 *      is refused here, BEFORE any API call, so it never spends an allowance;
 *   2. count: `POST /api/vector/exports` with `format: "import_lottie"`; only
 *      `{ok:true}` continues (429 / 403 / 422 / 503 stop with the refusal);
 *   3. parse: `importLottie(text)` in the browser (no route), then the editor
 *      shows every warning before the document opens.
 *
 * Pure and injectable (`count`, `parse`) so the order is testable; the
 * editor supplies the real ones. Translator deployments never call this: the
 * editor hides the Lottie import there (MM52 / MM44 §8 item 8).
 */
import type { VectorExportRefusal, VectorExportRequest, VectorExportResult } from '@/lib/vector/exportsApi';

import { LOTTIE_MAX_BYTES, LottieImportError, checkLottieFile, importLottie, type LottieImport, type LottieImportErrorCode } from './lottie';

export type LottieImportOutcome =
  | { kind: 'imported'; result: LottieImport; remaining: number }
  | { kind: 'refused'; refusal: VectorExportRefusal }
  | { kind: 'error'; code: LottieImportErrorCode };

export interface LottieImportDeps {
  count: (req: VectorExportRequest) => Promise<VectorExportResult>;
  parse?: (text: string) => LottieImport;
  projectId?: string;
}

/** Steps 1–3 above. Never throws. */
export async function runLottieImport(file: { size: number; text: () => Promise<string> }, deps: LottieImportDeps): Promise<LottieImportOutcome> {
  const tooBig = checkLottieFile(file);
  if (tooBig) return { kind: 'error', code: tooBig };
  let text: string;
  try {
    text = await file.text();
  } catch {
    return { kind: 'error', code: 'not_json' };
  }
  // A file that is obviously not a Lottie animation (a Motion document, an SVG…) never spends a unit.
  if (text.length > LOTTIE_MAX_BYTES) return { kind: 'error', code: 'too_large' };
  if (!looksLikeLottie(text)) return { kind: 'error', code: 'not_lottie' };
  const counted = await deps.count({
    ...(deps.projectId ? { projectId: deps.projectId } : {}),
    format: 'import_lottie',
    durationMs: 0,
    height: 0,
    fps: 0,
  });
  if (!counted.ok) return { kind: 'refused', refusal: counted.refusal };
  // Only now: the unit is spent server-side.
  try {
    const result = (deps.parse ?? importLottie)(text);
    return { kind: 'imported', result, remaining: counted.granted.remaining };
  } catch (e) {
    return { kind: 'error', code: e instanceof LottieImportError ? e.code : 'invalid' };
  }
}

/** Whether a picked file is (meant to be) a Lottie animation rather than a Motion document. */
export function looksLikeLottie(text: string): boolean {
  // A Motion document has `"version": 1` and `"canvas"`; a Lottie file has `fr`, `ip`, `op` and `layers` at the top.
  const head = text.slice(0, 64 * 1024);
  return /"fr"\s*:/.test(head) && /"op"\s*:/.test(head) && /"layers"\s*:/.test(head) && !/"canvas"\s*:\s*\{/.test(head);
}
