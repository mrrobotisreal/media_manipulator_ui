import { describe, expect, it } from 'vitest';

import { planLadderRows, planLines } from './plan-summary';
import { tiersFixture } from '@/lib/billing/test-utils';
import type { TierLimits } from '@/lib/auth/accountApi';

const limits = (hours: number): TierLimits => ({
  opsPerDay: 5, aiOpsPerDay: 1, exportsPerDay: 1, maxFileBytes: 1024, maxVideoSeconds: 60,
  maxOutputHeight: 1080, maxLadderHeight: 1080, studioProjects: 1, priorityGpu: false,
  resultRetentionHours: hours, adsRemoved: false,
});
const t = (key: string, opts?: Record<string, unknown>) =>
  opts && Object.keys(opts).length ? `${key}|${Object.values(opts).join(',')}` : key;

describe('planLines retention wording (MM26)', () => {
  it('guests get the fixed 24 hour line', () => {
    const lines = planLines(limits(24), t, 'anonymous');
    expect(lines).toContain('interface:authModal.plans.retentionGuest');
    expect(lines).not.toContain('interface:authModal.plans.retention');
  });
  it.each(['free', 'premium'])('%s gets the You-choose line and never the server default', (tier) => {
    const lines = planLines(limits(4320), t, tier);
    expect(lines).toContain('interface:authModal.plans.retention');
    expect(lines.join('|')).not.toMatch(/4320|duration/);
  });
});

describe('planLadderRows: four rows, numbers from /api/tiers (MM40 decision 6)', () => {
  const tiers = tiersFixture();

  it('renders Anonymous, Free, Premium and Pro in ladder order', () => {
    expect(planLadderRows(tiers, 'free', t).map((r) => r.tier)).toEqual(['anonymous', 'free', 'premium', 'pro']);
  });

  it('every number is the served one (fixture prices 9 and 17, ops 300 and 700)', () => {
    const rows = Object.fromEntries(planLadderRows(tiers, 'free', t).map((r) => [r.tier, r]));
    expect(rows.premium.price).toBe('$9interface:billing.perMonth');
    expect(rows.pro.price).toBe('$17interface:billing.perMonth');
    expect(rows.free.price).toBe('interface:planSummary.free');
    expect(rows.premium.ops).toBe('interface:planSummary.ops|300');
    expect(rows.pro.ops).toBe('interface:planSummary.ops|700');
    expect(rows.pro.aiOps).toBe('interface:planSummary.aiOps|120');
    expect(rows.anonymous.fileSize).toBe('interface:planSummary.fileSize|200 MB');
  });

  it.each(['anonymous', 'free', 'premium', 'pro'] as const)('highlights only the current plan (%s)', (tier) => {
    const rows = planLadderRows(tiers, tier, t);
    expect(rows.filter((r) => r.current).map((r) => r.tier)).toEqual([tier]);
  });

  it('operator matches no row; a missing Pro row is skipped, not invented', () => {
    expect(planLadderRows(tiers, 'operator', t).some((r) => r.current)).toBe(false);
    expect(planLadderRows(tiersFixture({ withPro: false }), 'free', t).map((r) => r.tier)).toEqual(['anonymous', 'free', 'premium']);
  });
});

describe('planLadderRows currency (MM69)', () => {
  it('formats the served numerals in the visitor currency and locale', async () => {
    const { planLadderRows } = await import('./plan-summary');
    const { tiersFixture } = await import('@/lib/billing/test-utils');
    const t = (key: string) => key;
    const rows = Object.fromEntries(planLadderRows(tiersFixture() as never, 'free', t, 'eur', 'de-DE').map((r) => [r.tier, r]));
    const eur = (n: number) => new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);
    expect(rows.premium.price).toBe(`${eur(9)}interface:billing.perMonth`);
    expect(rows.pro.price).toBe(`${eur(17)}interface:billing.perMonth`);
  });
});
