// MM90: quota headers observed on gated responses, kept per allowance.
//
// The everyday allowance (`ops`) and the AI allowance (`ai_ops`) are two separate daily
// counters, and one endpoint (/api/upload) can spend either. Every gated response now names
// its counter in X-MM-Quota-Metric, so an AI upload's "2 of 3 left" updates the AI meter and
// never the everyday one. An API from before MM90 sends no metric; those headers keep their
// old meaning (`ops`).

import type { QuotaHeaderState, Tier, UsageMetric } from './accountApi';

export interface ObservedAllowance {
  tier?: Tier;
  limit?: number;
  remaining?: number;
}

export type ObservedQuota = Partial<Record<UsageMetric, ObservedAllowance>>;

/** The allowance a header set describes, or null for one the meters do not track. */
export function observedMetricOf(state: QuotaHeaderState): UsageMetric | null {
  const metric = state.metric ?? 'ops';
  return metric === 'ops' || metric === 'ai_ops' || metric === 'export' ? metric : null;
}

/** Folds one observed header set into the per-allowance record. */
export function withObservation(previous: ObservedQuota, state: QuotaHeaderState | null): ObservedQuota {
  if (!state) return previous;
  const metric = observedMetricOf(state);
  if (!metric || (state.limit === undefined && state.remaining === undefined)) return previous;
  return { ...previous, [metric]: { tier: state.tier, limit: state.limit, remaining: state.remaining } };
}

/** The observed allowance for `metric`, when it describes the current tier. */
export function observedFor(observed: ObservedQuota, metric: UsageMetric, tier: Tier): ObservedAllowance | null {
  const o = observed[metric];
  return o && o.tier === tier ? o : null;
}
