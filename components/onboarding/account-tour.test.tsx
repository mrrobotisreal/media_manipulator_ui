import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';

const h = vi.hoisted(() => ({
  push: vi.fn(),
  track: vi.fn(),
  auth: null as unknown,
  pathname: '/tools',
  busy: false,
}));

vi.mock('@/i18n/useLocalization', async () => {
  const m = await import('@/lib/billing/test-utils');
  return { useLocalization: () => m.fakeLocalization() };
});
vi.mock('@/i18n/useLocalizedHref', () => ({
  useLocalizedHref: () => (href: string) => `/ru${href}`,
}));
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: h.push }),
  usePathname: () => h.pathname,
}));
vi.mock('next/dynamic', async () => {
  const React = await import('react');
  return {
    default: (loader: () => Promise<{ default: React.ComponentType<never> }>) => {
      const Lazy = React.lazy(loader);
      return (props: object) => React.createElement(React.Suspense, { fallback: null }, React.createElement(Lazy, props as never));
    },
  };
});
vi.mock('@/lib/auth/AuthProvider', () => ({ useAuth: () => h.auth }));
vi.mock('@/lib/analytics/client', () => ({ analytics: { track: h.track } }));
vi.mock('@/lib/analytics/jobTimings', () => ({ hasActiveJobs: () => h.busy }));

import { AccountTour } from './account-tour';
import { AccountTourHost } from './account-tour-host';
import { onboardingKey, requestTourReplay, resetOnboardingForTests } from '@/lib/onboarding/state';
import { RETENTION_BANNER_KEY } from '@/lib/account/retention';

const fresh = () => new Date(Date.now() - 60_000).toUTCString();
const signedIn = (extra: object = {}) => ({
  user: { uid: 'u1', metadata: { creationTime: fresh() } },
  prompt: { open: false },
  ...extra,
});
const events = () => h.track.mock.calls.map(([name, props]) => [name, props]);
const btn = (key: string) => screen.getByRole('button', { name: `interface:accountTour.${key}` });

beforeEach(() => {
  h.auth = signedIn();
  h.pathname = '/tools';
  h.busy = false;
});
afterEach(() => {
  cleanup();
  window.localStorage.clear();
  resetOnboardingForTests();
  vi.clearAllMocks();
});

describe('AccountTour', () => {
  it('walks the three cards and fires step events in order with the right props', () => {
    const onClose = vi.fn();
    render(<AccountTour uid="u1" onClose={onClose} />);
    expect(screen.getAllByText('interface:accountTour.keepResults.title').length).toBeGreaterThan(0);
    fireEvent.click(btn('next'));
    fireEvent.click(btn('next'));
    expect(screen.getAllByText('interface:accountTour.retention.title').length).toBeGreaterThan(0);
    fireEvent.click(btn('setRetention'));

    expect(events()).toEqual([
      ['onboarding_step_viewed', { step: 1, step_id: 'keep_results' }],
      ['onboarding_step_completed', { step: 1, action: 'next' }],
      ['onboarding_step_viewed', { step: 2, step_id: 'darkroom_projects' }],
      ['onboarding_step_completed', { step: 2, action: 'next' }],
      ['onboarding_step_viewed', { step: 3, step_id: 'retention' }],
      ['onboarding_step_completed', { step: 3, action: 'cta' }],
    ]);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('the CTA goes to the privacy tab URL, marks the tour done and retires the overview banner', () => {
    render(<AccountTour uid="u1" onClose={vi.fn()} />);
    fireEvent.click(btn('next'));
    fireEvent.click(btn('next'));
    fireEvent.click(btn('setRetention'));
    expect(h.push).toHaveBeenCalledWith('/ru/account?tab=privacy');
    expect(window.localStorage.getItem(onboardingKey('u1'))).not.toBeNull();
    expect(window.localStorage.getItem(RETENTION_BANNER_KEY)).toBe('1');
  });

  it('Skip persists completion and leaves the overview banner alone', () => {
    const onClose = vi.fn();
    render(<AccountTour uid="u1" onClose={onClose} />);
    fireEvent.click(btn('skip'));
    expect(events().at(-1)).toEqual(['onboarding_step_completed', { step: 1, action: 'skip' }]);
    expect(window.localStorage.getItem(onboardingKey('u1'))).not.toBeNull();
    expect(window.localStorage.getItem(RETENTION_BANNER_KEY)).toBeNull();
    expect(h.push).not.toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });

  it('Esc is a dismiss and persists completion', () => {
    const onClose = vi.fn();
    render(<AccountTour uid="u1" onClose={onClose} />);
    fireEvent.click(btn('next'));
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
    expect(events().at(-1)).toEqual(['onboarding_step_completed', { step: 2, action: 'dismiss' }]);
    expect(window.localStorage.getItem(onboardingKey('u1'))).not.toBeNull();
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('Back returns to the previous card and Not now on the last card closes without navigating', () => {
    render(<AccountTour uid="u1" onClose={vi.fn()} />);
    expect(screen.queryByRole('button', { name: 'interface:accountTour.back' })).toBeNull();
    fireEvent.click(btn('next'));
    fireEvent.click(btn('back'));
    expect(screen.getAllByText('interface:accountTour.keepResults.title').length).toBeGreaterThan(0);
    fireEvent.click(btn('next'));
    fireEvent.click(btn('next'));
    fireEvent.click(btn('notNow'));
    expect(h.push).not.toHaveBeenCalled();
    expect(events().at(-1)).toEqual(['onboarding_step_completed', { step: 3, action: 'skip' }]);
  });

  it('labels the dialog and announces the step', () => {
    render(<AccountTour uid="u1" onClose={vi.fn()} />);
    const dialog = screen.getByRole('dialog');
    expect(dialog.getAttribute('aria-labelledby')).toBeTruthy();
    expect(screen.getByRole('status').textContent).toContain('interface:accountTour.keepResults.title');
  });
});

describe('AccountTourHost', () => {
  it('opens once for a new signed-in account, then never again', async () => {
    const { unmount } = render(<AccountTourHost />);
    expect(await screen.findByTestId('account-tour')).toBeTruthy();
    fireEvent.click(btn('skip'));
    expect(screen.queryByTestId('account-tour')).toBeNull();
    unmount();
    render(<AccountTourHost />);
    await act(async () => {});
    expect(screen.queryByTestId('account-tour')).toBeNull();
  });

  it('does not render for guests, on /account, or over a running job', async () => {
    h.auth = { user: null, prompt: { open: false } };
    const guest = render(<AccountTourHost />);
    await act(async () => {});
    expect(screen.queryByTestId('account-tour')).toBeNull();
    guest.unmount();

    h.auth = signedIn();
    h.pathname = '/ru/account';
    const onAccount = render(<AccountTourHost />);
    await act(async () => {});
    expect(screen.queryByTestId('account-tour')).toBeNull();
    onAccount.unmount();

    h.pathname = '/tools';
    h.busy = true;
    render(<AccountTourHost />);
    await act(async () => {});
    expect(screen.queryByTestId('account-tour')).toBeNull();
  });

  it('replay opens it even after completion and for older accounts, without a signup event', async () => {
    h.auth = signedIn({ user: { uid: 'u1', metadata: { creationTime: 'Mon, 01 Jan 2024 00:00:00 GMT' } } });
    window.localStorage.setItem(onboardingKey('u1'), '2026-10-01T00:00:00.000Z');
    render(<AccountTourHost />);
    await act(async () => {});
    expect(screen.queryByTestId('account-tour')).toBeNull();
    act(() => requestTourReplay());
    expect(await screen.findByTestId('account-tour')).toBeTruthy();
    expect(events().every(([name]) => String(name).startsWith('onboarding_'))).toBe(true);
  });
});
