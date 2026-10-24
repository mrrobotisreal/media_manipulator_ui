import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';

const h = vi.hoisted(() => ({ auth: null as unknown, tiers: undefined as unknown, track: vi.fn() }));

vi.mock('@/i18n/useLocalization', async () => {
  const m = await import('@/lib/billing/test-utils');
  return { useLocalization: () => m.fakeLocalization() };
});
vi.mock('@/i18n/useLocalizedHref', () => ({ useLocalizedHref: () => (p: string) => p }));
vi.mock('@/lib/auth/AuthProvider', () => ({ useAuth: () => h.auth }));
vi.mock('@/lib/billing/useUpgradeAction', () => ({ useTiers: () => h.tiers }));
vi.mock('@/lib/analytics', () => ({ analytics: { track: h.track }, EVENTS: { UPGRADE_CTA_CLICKED: 'upgrade_cta_clicked' } }));

import { QueueLine, shouldShowQueueLine } from './queue-line';

const withPriority = { tiers: [{ tier: 'premium', limits: { priorityGpu: true } }] };
const noPriority = { tiers: [{ tier: 'premium', limits: { priorityGpu: false } }] };

function setup(over: { tier?: string; tiers?: unknown } = {}) {
  h.auth = { tier: over.tier ?? 'free', loading: false };
  h.tiers = 'tiers' in over ? over.tiers : withPriority;
}
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe('shouldShowQueueLine', () => {
  const ok = { waitMs: 48_000, tierIsTop: false, premiumHasPriority: true };
  it('needs a reported wait of at least 30 s', () => {
    expect(shouldShowQueueLine(ok)).toBe(true);
    expect(shouldShowQueueLine({ ...ok, waitMs: 29_999 })).toBe(false);
    expect(shouldShowQueueLine({ ...ok, waitMs: undefined })).toBe(false);
  });
  it('is off for top tiers and when priority is not deployed', () => {
    expect(shouldShowQueueLine({ ...ok, tierIsTop: true })).toBe(false);
    expect(shouldShowQueueLine({ ...ok, premiumHasPriority: false })).toBe(false);
  });
});

describe('QueueLine', () => {
  it('renders the wait and links to pricing for a free user when priority exists', () => {
    setup();
    render(<QueueLine waitMs={48_000} />);
    expect(screen.getByTestId('queue-line').textContent).toContain('queueLine.text|time=48 s');
    fireEvent.click(screen.getByRole('link'));
    expect(h.track).toHaveBeenCalledWith('upgrade_cta_clicked', { placement: 'queue_line', from_tier: 'free' });
  });
  it('renders nothing without the wait field (the API does not report it today)', () => {
    setup();
    const { container } = render(<QueueLine />);
    expect(container.firstChild).toBeNull();
  });
  it('renders nothing when the served table has no priority field or it is false', () => {
    setup({ tiers: noPriority });
    expect(render(<QueueLine waitMs={60_000} />).container.firstChild).toBeNull();
    cleanup();
    setup({ tiers: undefined });
    expect(render(<QueueLine waitMs={60_000} />).container.firstChild).toBeNull();
  });
  it('renders nothing for premium', () => {
    setup({ tier: 'premium' });
    expect(render(<QueueLine waitMs={60_000} />).container.firstChild).toBeNull();
  });
});
