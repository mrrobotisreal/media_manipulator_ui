import { describe, expect, it } from 'vitest';

import { planLines } from './plan-summary';
import type { TierLimits } from '@/lib/auth/accountApi';

const limits = (hours: number): TierLimits => ({
  opsPerDay: 5, aiOpsPerDay: 1, exportsPerDay: 1, maxFileBytes: 1024, maxVideoSeconds: 60,
  maxOutputHeight: 1080, maxLadderHeight: 1080, studioProjects: 1, priorityGpu: false,
  resultRetentionHours: hours, adsRemoved: false,
});
const t = (key: string) => key;

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
