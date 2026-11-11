import type { LabModel, LabSpend } from './types';

export interface RunBlock {
  reason: 'unavailable' | 'day_cap' | 'month_cap';
  message: string;
}

const usd = (n: number) => `$${n.toFixed(2)}`;

/** Human estimate line: "$0.00, runs at home" or "~$X.XX on <instance>". */
export function estimateLabel(model: Pick<LabModel, 'runsAt' | 'estCostUsd' | 'instance'>): string {
  return model.runsAt === 'home' || model.estCostUsd <= 0
    ? '$0.00, runs at home'
    : `~${usd(model.estCostUsd)} on ${model.instance}`;
}

/**
 * Client-side pre-check before Run. The API enforces the real caps (409 lab_cap); this only
 * blocks early with a clear message. Returns null when the run may go ahead.
 */
export function runBlock(model: LabModel, spend: LabSpend | null | undefined): RunBlock | null {
  if (!model.available) {
    return {
      reason: 'unavailable',
      message: model.unavailableReason?.trim() || 'This model is unavailable right now.',
    };
  }
  if (!spend || model.estCostUsd <= 0) return null;
  const { day, month } = spend;
  if (day.spentUsd + model.estCostUsd > day.capUsd) {
    return {
      reason: 'day_cap',
      message: `Blocked: ~${usd(model.estCostUsd)} would take today's Lab spend (${usd(day.spentUsd)}) past its ${usd(day.capUsd)} cap.`,
    };
  }
  if (month.spentUsd + model.estCostUsd > month.capUsd) {
    return {
      reason: 'month_cap',
      message: `Blocked: ~${usd(model.estCostUsd)} would take this month's Lab spend (${usd(month.spentUsd)}) past its ${usd(month.capUsd)} cap.`,
    };
  }
  return null;
}
