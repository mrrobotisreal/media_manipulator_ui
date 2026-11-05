/**
 * MM114: the change card's per-op lines. Each op becomes one line (its templated description, the
 * op's own `reason`, and the raw op so "Show me" knows what to reveal). Ops with no description
 * (nothing visible changed) are skipped, never shown as blanks.
 */
import type { CopilotChangeLine } from './types';

export function perOpLines<O extends { op: string; reason?: string }>(ops: O[], describeOne: (op: O) => string[]): CopilotChangeLine[] {
  const out: CopilotChangeLine[] = [];
  for (const op of ops) {
    const text = describeOne(op).join('; ');
    if (!text) continue;
    out.push({ text, op: op.op, raw: op, ...(op.reason ? { reason: op.reason } : {}) });
  }
  return out;
}
