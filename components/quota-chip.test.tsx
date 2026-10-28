import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const h = vi.hoisted(() => ({ auth: null as unknown, track: vi.fn() }));

vi.mock('@/i18n/useLocalization', async () => {
  const m = await import('@/lib/billing/test-utils');
  return { useLocalization: () => m.fakeLocalization() };
});
vi.mock('@/i18n/useLocalizedHref', () => ({ useLocalizedHref: () => (p: string) => p }));
vi.mock('@/lib/auth/AuthProvider', () => ({ useAuth: () => h.auth }));
vi.mock('@/lib/analytics', () => ({
  analytics: { track: h.track },
  EVENTS: { UPGRADE_CTA_CLICKED: 'upgrade_cta_clicked' },
}));

import { QuotaChip, quotaChipTone, quotaMetricForTask } from './quota-chip';

function auth(over: Record<string, unknown> = {}) {
  const limits: Record<string, number> = { ops: 10, ai_ops: 5, export: 4 };
  return {
    loading: false,
    tier: 'free',
    resetsAt: null,
    usage: { ops: 2, ai_ops: 2, export: 0 },
    allowanceOf: (m: string) => limits[m] ?? 0,
    ...over,
  };
}

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe('quotaMetricForTask / quotaChipTone', () => {
  it('picks the metric from the task', () => {
    expect(quotaMetricForTask('compress_video')).toBe('ops');
    expect(quotaMetricForTask(undefined)).toBe('ops');
    expect(quotaMetricForTask('ai_video_restoration')).toBe('ai_ops');
    expect(quotaMetricForTask('image_restoration')).toBe('ai_ops');
    expect(quotaMetricForTask('document_scan')).toBe('ai_ops');
    expect(quotaMetricForTask('summarize_video')).toBe('ai_ops');
    expect(quotaMetricForTask('summarize_audio')).toBe('ai_ops');
    expect(quotaMetricForTask('studio_export')).toBe('export');
  });

  it('shifts tone at 20 percent remaining and at zero', () => {
    expect(quotaChipTone(3, 10)).toBe('calm');
    expect(quotaChipTone(2, 10)).toBe('low');
    expect(quotaChipTone(1, 10)).toBe('low');
    expect(quotaChipTone(0, 10)).toBe('empty');
  });
});

describe('QuotaChip', () => {
  it('renders nothing outside the auth provider', () => {
    h.auth = null;
    const { container } = render(<QuotaChip />);
    expect(container.firstChild).toBeNull();
  });

  it.each(['pro', 'operator'])('is hidden for %s', (tier) => {
    h.auth = auth({ tier });
    const { container } = render(<QuotaChip />);
    expect(container.firstChild).toBeNull();
  });

  it.each(['ops', 'ai_ops', 'export'] as const)('premium (MM40): shows the %s count, pointing at Pro (a limit Pro raises)', (metric) => {
    h.auth = auth({ tier: 'premium' });
    render(<QuotaChip metric={metric} />);
    const chip = screen.getByTestId('quota-chip');
    expect(chip.getAttribute('title')).toBe('interface:quotaChip.titlePro');
    expect(chip.getAttribute('href')).toBe('/pricing');
  });

  it('is hidden for an unlimited allowance', () => {
    h.auth = auth({ allowanceOf: () => -1 });
    const { container } = render(<QuotaChip />);
    expect(container.firstChild).toBeNull();
  });

  it('shows a skeleton while loading', () => {
    h.auth = auth({ loading: true });
    render(<QuotaChip />);
    expect(screen.getByTestId('quota-chip-skeleton')).toBeTruthy();
    expect(screen.queryByTestId('quota-chip')).toBeNull();
  });

  it('names the conversion metric by default and the AI metric for an AI task', () => {
    h.auth = auth();
    const { rerender } = render(<QuotaChip task="compress_video" />);
    expect(screen.getByTestId('quota-chip').textContent).toBe(
      'interface:quotaChip.ops.remaining|remaining=8,limit=10',
    );
    rerender(<QuotaChip task="ai_video_restoration" />);
    expect(screen.getByTestId('quota-chip').textContent).toBe(
      'interface:quotaChip.ai_ops.remaining|remaining=3,limit=5',
    );
  });

  it('uses the low tone at <= 20 percent and the empty copy at zero', () => {
    h.auth = auth({ usage: { ops: 8 } });
    const { rerender } = render(<QuotaChip />);
    expect(screen.getByTestId('quota-chip').getAttribute('data-tone')).toBe('low');
    h.auth = auth({ usage: { ops: 10 } });
    rerender(<QuotaChip />);
    expect(screen.getByTestId('quota-chip').getAttribute('data-tone')).toBe('empty');
    expect(screen.getByTestId('quota-chip').textContent).toBe('interface:quotaChip.ops.empty|limit=10');
  });

  it('links to /pricing and tracks upgrade_cta_clicked with the quota_chip placement', () => {
    h.auth = auth();
    render(<QuotaChip task="image_restoration" />);
    const link = screen.getByTestId('quota-chip');
    expect(link.getAttribute('href')).toBe('/pricing');
    fireEvent.click(link);
    expect(h.track).toHaveBeenCalledWith('upgrade_cta_clicked', {
      placement: 'quota_chip',
      cta_id: 'ai_ops',
      from_tier: 'free',
    });
  });

  it('keeps its space but hides while busy', () => {
    h.auth = auth();
    render(<QuotaChip busy />);
    expect(screen.getByTestId('quota-chip-box').className).toContain('invisible');
  });
});

describe('no hard-coded limits (MM33 acceptance 3)', () => {
  it.each(['quota-chip.tsx', 'account/upgrade-interstitial.tsx', 'account/yearly-nudge.tsx', 'results/queue-line.tsx'])(
    '%s has no numeric limit literals',
    (file) => {
      let src = '';
      try {
        src = readFileSync(join(__dirname, file), 'utf8');
      } catch {
        return; // not created yet / not applicable
      }
      const code = src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
      // Allowed: 0/1/12 arithmetic, tailwind classes, ratios. Forbidden: plan-sized numbers.
      expect(code).not.toMatch(/\b(200|500|1024|1440|2160|1080)\b|\b\d+\s*(MB|GB)\b/);
    },
  );
});
