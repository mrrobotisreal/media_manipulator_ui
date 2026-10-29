import { describe, expect, it } from 'vitest';

import { readQuotaHeaders } from './accountApi';
import { observedFor, observedMetricOf, withObservation } from './observedQuota';

const res = (headers: Record<string, string>) => new Response('{}', { status: 200, headers });

describe('per-allowance quota headers (MM90)', () => {
  it('reads X-MM-Quota-Metric', () => {
    expect(readQuotaHeaders(res({ 'X-MM-Quota-Limit': '3', 'X-MM-Quota-Remaining': '2', 'X-MM-Tier': 'anonymous', 'X-MM-Quota-Metric': 'ai_ops' }))).toEqual({
      tier: 'anonymous',
      metric: 'ai_ops',
      limit: 3,
      remaining: 2,
    });
  });

  it('an API without the metric header means the everyday allowance, as before', () => {
    expect(observedMetricOf({ limit: 5 })).toBe('ops');
    expect(observedMetricOf({ metric: 'vector_export', limit: 2 })).toBeNull();
  });

  it('an AI response never moves the everyday allowance, and an everyday one never moves the AI allowance', () => {
    let o = withObservation({}, { tier: 'premium', metric: 'ops', limit: 300, remaining: 288 });
    o = withObservation(o, { tier: 'premium', metric: 'ai_ops', limit: 100, remaining: 0 });
    expect(observedFor(o, 'ops', 'premium')).toEqual({ tier: 'premium', limit: 300, remaining: 288 });
    expect(observedFor(o, 'ai_ops', 'premium')).toEqual({ tier: 'premium', limit: 100, remaining: 0 });
    o = withObservation(o, { tier: 'premium', metric: 'ops', limit: 300, remaining: 287 });
    expect(observedFor(o, 'ai_ops', 'premium')!.remaining).toBe(0);
  });

  it('an observation for another tier is ignored', () => {
    const o = withObservation({}, { tier: 'anonymous', metric: 'ai_ops', limit: 3, remaining: 1 });
    expect(observedFor(o, 'ai_ops', 'free')).toBeNull();
  });

  it('a header set with no counts (uncounted tier) changes nothing', () => {
    const o = withObservation({}, { tier: 'operator', metric: 'ai_ops', resetsAt: 'x' });
    expect(o).toEqual({});
  });
});
