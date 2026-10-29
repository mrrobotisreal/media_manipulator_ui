/**
 * MM90: the nav shows the everyday allowance and, beside it, the AI allowance. They are two
 * separate daily counters, so they are two meters; an AI job moves only the AI meter.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';

import { createI18nInstance } from '@/i18n';

const h = vi.hoisted(() => ({ auth: null as unknown, track: vi.fn() }));

vi.mock('@/lib/auth/AuthProvider', () => ({ useAuth: () => h.auth }));
vi.mock('@/lib/analytics', () => ({
  analytics: { track: h.track },
  EVENTS: { QUOTA_WARNING_SHOWN: 'quota_warning_shown' },
}));
vi.mock('@/lib/billing/useUpgradeAction', () => ({ useUpgradeAction: () => ({ run: vi.fn() }) }));
vi.mock('next/dynamic', () => ({ default: () => () => null }));
vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }), usePathname: () => '/tools' }));

import { QuotaMeter } from './quota-meter';
import { AccountMenu } from './account-menu';

const ALLOWANCES: Record<string, { ops: number; ai_ops: number }> = {
  anonymous: { ops: 5, ai_ops: 3 },
  free: { ops: 30, ai_ops: 10 },
  premium: { ops: 300, ai_ops: 100 },
  pro: { ops: 700, ai_ops: 200 },
  operator: { ops: -1, ai_ops: -1 },
};

function auth(tier: string, over: Record<string, unknown> = {}) {
  const a = ALLOWANCES[tier];
  return {
    loading: false,
    user: tier === 'anonymous' ? null : { uid: 'u1' },
    tier,
    usage: { ops: 0, ai_ops: 0 },
    resetsAt: null,
    allowanceOf: (m: 'ops' | 'ai_ops') => a[m] ?? 0,
    ...over,
  };
}

function renderEn(ui: React.ReactElement) {
  return render(<I18nextProvider i18n={createI18nInstance('en-US')}>{ui}</I18nextProvider>);
}

const meter = (metric: 'ops' | 'ai_ops') => document.querySelector(`[data-quota-meter="${metric}"]`) as HTMLElement | null;

/** The box classes that must not change between states (no layout shift). */
function box(el: HTMLElement): string[] {
  return el.className.split(/\s+/).filter((c) => /^(h-9|w-\[\d+px\]|shrink-0|px-2|py-1)$/.test(c)).sort();
}

beforeEach(() => {
  try {
    window.sessionStorage.clear();
  } catch {
    // ignore
  }
});
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe('nav meters (MM90)', () => {
  it.each([
    ['anonymous', '0 / 5', 'AI 0 / 3'],
    ['free', '0 / 30', 'AI 0 / 10'],
    ['premium', '0 / 300', 'AI 0 / 100'],
    ['pro', '0 / 700', 'AI 0 / 200'],
  ])('%s: the nav shows the everyday meter and the AI meter', (tier, everyday, ai) => {
    h.auth = auth(tier);
    renderEn(<AccountMenu />);
    expect(meter('ops')!.textContent).toBe(everyday);
    expect(meter('ai_ops')!.textContent).toBe(ai);
  });

  it('an AI job moves only the AI meter; the everyday meter keeps its own count', () => {
    h.auth = auth('premium', { usage: { ops: 12, ai_ops: 100 } });
    renderEn(<AccountMenu />);
    expect(meter('ops')!.textContent).toBe('12 / 300');
    expect(meter('ai_ops')!.textContent).toBe('AI 100 / 100');
    // The AI wall is coral; the everyday meter is nowhere near its own.
    expect(meter('ai_ops')!.className).toContain('border-primary/40');
    expect(meter('ops')!.className).not.toContain('border-primary/40');
  });

  it('the AI meter is hidden when the AI allowance is unlimited (operator)', () => {
    h.auth = auth('operator');
    renderEn(<AccountMenu />);
    expect(meter('ops')!.textContent).toBe('∞');
    expect(meter('ai_ops')).toBeNull();
  });

  it('the AI meter sits in the row from md and is kept out of the narrow row', () => {
    h.auth = auth('free');
    renderEn(<AccountMenu />);
    expect(meter('ai_ops')!.className).toMatch(/(?:^|\s)hidden(?:\s|$)/);
    expect(meter('ai_ops')!.className).toMatch(/(?:^|\s)md:flex(?:\s|$)/);
    expect(meter('ops')!.className).not.toMatch(/(?:^|\s)hidden(?:\s|$)/);
  });

  it.each(['ops', 'ai_ops'] as const)('%s: the box is the same in every state (loading, signed out, signed in, at limit)', (metric) => {
    const states = [
      auth('anonymous', { loading: true, user: null }),
      auth('anonymous'),
      auth('free'),
      auth('free', { usage: { ops: 30, ai_ops: 10 } }),
    ];
    const boxes = states.map((state) => {
      h.auth = state;
      renderEn(<QuotaMeter metric={metric} />);
      const b = box(meter(metric)!);
      cleanup();
      return b;
    });
    for (const b of boxes) expect(b).toEqual(boxes[0]);
    expect(boxes[0]).toContain('h-9');
    expect(boxes[0]).toContain(metric === 'ai_ops' ? 'w-[100px]' : 'w-[68px]');
  });

  it('the AI box fits its widest readout ("AI 200 / 200" in 11px JetBrains Mono, 0.6em advance)', () => {
    const chars = 'AI 200 / 200'.length;
    const text = Math.ceil(chars * 0.6 * 11);
    // px-2 both sides (16) + the 1px border both sides (2).
    expect(text + 16 + 2).toBeLessThanOrEqual(100);
  });

  it('the accessible name contains the visible readout (WCAG 2.5.3), signed out and signed in', () => {
    for (const state of [auth('anonymous', { usage: { ops: 1, ai_ops: 2 } }), auth('premium', { usage: { ops: 1, ai_ops: 2 } })]) {
      h.auth = state;
      renderEn(<AccountMenu />);
      for (const metric of ['ops', 'ai_ops'] as const) {
        const el = meter(metric)!;
        const visible = el.textContent!;
        expect(el.getAttribute('aria-label')).toContain(visible);
      }
      const ai = screen.getByRole(state.user ? 'link' : 'button', { name: /^AI 2 \/ \d+ daily AI jobs used\./ });
      expect(ai).toBeTruthy();
      cleanup();
    }
  });

  it('warns once per session per allowance, keyed by metric', () => {
    h.auth = auth('free', { usage: { ops: 1, ai_ops: 9 } });
    renderEn(<AccountMenu />);
    expect(h.track).toHaveBeenCalledTimes(1);
    expect(h.track).toHaveBeenCalledWith('quota_warning_shown', { limit: 10, remaining: 1, scope: 'ai_ops' });
    cleanup();
    renderEn(<AccountMenu />);
    expect(h.track).toHaveBeenCalledTimes(1);
    h.auth = auth('free', { usage: { ops: 29, ai_ops: 9 } });
    cleanup();
    renderEn(<AccountMenu />);
    expect(h.track).toHaveBeenCalledTimes(2);
    expect(h.track).toHaveBeenLastCalledWith('quota_warning_shown', { limit: 30, remaining: 1, scope: 'ops' });
  });

  it('renders nothing outside the provider', () => {
    h.auth = null;
    const { container } = renderEn(<QuotaMeter metric="ai_ops" />);
    expect(container.firstChild).toBeNull();
  });
});
