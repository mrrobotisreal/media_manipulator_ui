import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';

const h = vi.hoisted(() => ({
  track: vi.fn(),
  auth: null as unknown,
  appleEnabled: false,
  sendPasswordReset: vi.fn(),
  pendingCredentialFromError: vi.fn(async (...args: unknown[]): Promise<unknown> => (args.length ? null : null)),
}));

vi.mock('@/i18n/useLocalization', async () => {
  const m = await import('@/lib/billing/test-utils');
  return { useLocalization: () => m.fakeLocalization() };
});
vi.mock('@/i18n/useLocalizedHref', () => ({ useLocalizedHref: () => (p: string) => p }));
vi.mock('@/lib/auth/AuthProvider', () => ({ useAuth: () => h.auth }));
vi.mock('@/lib/analytics', () => ({
  useAnalytics: () => ({ track: h.track }),
  EVENTS: {
    AUTH_PROMPT_SHOWN: 'auth_prompt_shown',
    AUTH_MODAL_OPENED: 'auth_modal_opened',
    AUTH_MODAL_CLOSED: 'auth_modal_closed',
    SIGNUP_STARTED: 'signup_started',
    SIGNUP_COMPLETED: 'signup_completed',
    SIGNIN_COMPLETED: 'signin_completed',
    AUTH_FAILED: 'auth_failed',
    FEATURE_USED: 'feature_used',
    PASSWORD_RESET_REQUESTED: 'password_reset_requested',
  },
}));
vi.mock('@/lib/firebase', () => ({
  isAppleAuthEnabled: () => h.appleEnabled,
  sendPasswordReset: (...a: unknown[]) => h.sendPasswordReset(...a),
  pendingCredentialFromError: (e: unknown) => h.pendingCredentialFromError(e),
}));
vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }));
vi.mock('@tanstack/react-query', () => ({ useQuery: () => ({ data: undefined }) }));
vi.mock('@/lib/billing/useUpgradeAction', () => ({ useUpgradeAction: () => ({ visible: false, busy: false, run: vi.fn() }) }));
vi.mock('@/lib/billing/useCurrency', () => ({ useCurrency: () => ({ currency: 'usd' }) }));
vi.mock('@/components/pricing/currency-toggle', () => ({ CurrencyToggle: () => null }));
vi.mock('@/components/account/plan-summary', () => ({ PlanSummary: () => null }));

import { AuthModal } from './auth-modal';

function makeAuth(over: Record<string, unknown> = {}) {
  return {
    prompt: { open: true, intent: 'signin' },
    closeAuth: vi.fn(),
    signIn: vi.fn(async () => ({ isNewUser: false, linked: null })),
    signUp: vi.fn(),
    signInWithGoogle: vi.fn(async () => ({ isNewUser: false, linked: null })),
    signInWithApple: vi.fn(async () => ({ isNewUser: true, linked: null })),
    tier: 'anonymous',
    ...over,
  };
}

beforeEach(() => {
  h.auth = makeAuth();
  h.appleEnabled = false;
});
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe('AuthModal Apple button', () => {
  it('is hidden when the flag is off', () => {
    render(<AuthModal />);
    expect(screen.queryByText('interface:authModal.appleSignIn')).toBeNull();
    expect(screen.getByText('interface:authModal.googleSignIn')).toBeTruthy();
  });

  it('signs in with Apple and tracks method apple (signup_completed for a new user)', async () => {
    h.appleEnabled = true;
    render(<AuthModal />);
    fireEvent.click(screen.getByText('interface:authModal.appleSignIn'));
    await waitFor(() => expect((h.auth as ReturnType<typeof makeAuth>).signInWithApple).toHaveBeenCalled());
    await waitFor(() => expect(h.track).toHaveBeenCalledWith('signup_completed', { method: 'apple' }));
    expect(h.track).toHaveBeenCalledWith('signup_started', { method: 'apple' });
  });

  it('auth_failed carries the Firebase error code, never the message', async () => {
    h.appleEnabled = true;
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    h.auth = makeAuth({
      signInWithApple: vi.fn(async () => {
        throw Object.assign(new Error('Firebase: secret@example.com blocked'), { code: 'auth/popup-blocked' });
      }),
    });
    render(<AuthModal />);
    fireEvent.click(screen.getByText('interface:authModal.appleSignIn'));
    await waitFor(() =>
      expect(h.track).toHaveBeenCalledWith('auth_failed', { method: 'apple', stage: 'popup', reason: 'auth/popup-blocked' }),
    );
  });

  it('Google failures also report the code in reason', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    h.auth = makeAuth({
      signInWithGoogle: vi.fn(async () => {
        throw Object.assign(new Error('msg with a@b.co'), { code: 'auth/popup-closed-by-user' });
      }),
    });
    render(<AuthModal />);
    fireEvent.click(screen.getByText('interface:authModal.googleSignIn'));
    await waitFor(() =>
      expect(h.track).toHaveBeenCalledWith('auth_failed', { method: 'google', stage: 'popup', reason: 'auth/popup-closed-by-user' }),
    );
  });
});

describe('AuthModal forgot password', () => {
  it('shows the neutral confirmation and tracks password_reset_requested once', async () => {
    h.sendPasswordReset.mockResolvedValue(undefined);
    render(<AuthModal />);
    fireEvent.click(screen.getByText('interface:authModal.forgotPassword'));
    const input = screen.getByLabelText('interface:authModal.fields.email') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'a@b.co' } });
    fireEvent.click(screen.getByText('interface:authModal.reset.submit'));
    await waitFor(() => expect(screen.getByText('interface:authModal.reset.sent')).toBeTruthy());
    expect(h.sendPasswordReset).toHaveBeenCalledWith('a@b.co');
    const resets = h.track.mock.calls.filter((c) => c[0] === 'password_reset_requested');
    expect(resets).toEqual([['password_reset_requested', { surface: 'web' }]]);
  });

  it('prefills the reset field from the sign-in email and goes back', async () => {
    render(<AuthModal />);
    fireEvent.change(screen.getAllByLabelText('interface:authModal.fields.email')[0], { target: { value: 'pre@fill.co' } });
    fireEvent.click(screen.getByText('interface:authModal.forgotPassword'));
    expect((screen.getByLabelText('interface:authModal.fields.email') as HTMLInputElement).value).toBe('pre@fill.co');
    fireEvent.click(screen.getByText('interface:authModal.reset.back'));
    expect(screen.getByText('interface:authModal.googleSignIn')).toBeTruthy();
  });

  it('maps too-many-requests to an inline error and does not track', async () => {
    h.sendPasswordReset.mockRejectedValue(Object.assign(new Error('x'), { code: 'auth/too-many-requests' }));
    render(<AuthModal />);
    fireEvent.click(screen.getByText('interface:authModal.forgotPassword'));
    fireEvent.change(screen.getByLabelText('interface:authModal.fields.email'), { target: { value: 'a@b.co' } });
    fireEvent.click(screen.getByText('interface:authModal.reset.submit'));
    await waitFor(() => expect(screen.getByText('error:auth.tooManyRequests')).toBeTruthy());
    expect(h.track.mock.calls.some((c) => c[0] === 'password_reset_requested')).toBe(false);
  });
});

describe('AuthModal account linking', () => {
  it('keeps the pending credential after account-exists and links it on the next sign-in', async () => {
    const pending = { providerId: 'google.com' };
    h.pendingCredentialFromError.mockResolvedValue(pending);
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const signInWithGoogle = vi
      .fn()
      .mockRejectedValueOnce(Object.assign(new Error('x'), { code: 'auth/account-exists-with-different-credential' }));
    const signIn = vi.fn(async () => ({ isNewUser: false, linked: true }));
    h.auth = makeAuth({ signInWithGoogle, signIn });
    render(<AuthModal />);
    fireEvent.click(screen.getByText('interface:authModal.googleSignIn'));
    await waitFor(() => expect(screen.getByText('interface:authModal.link.notice')).toBeTruthy());

    fireEvent.change(screen.getAllByLabelText('interface:authModal.fields.email')[0], { target: { value: 'a@b.co' } });
    fireEvent.change(screen.getAllByLabelText('interface:authModal.fields.password')[0], { target: { value: 'pw123456' } });
    fireEvent.click(screen.getByText('interface:authModal.actions.signIn'));
    await waitFor(() => expect(signIn).toHaveBeenCalledWith('a@b.co', 'pw123456', pending));
    await waitFor(() => expect(screen.queryByText('interface:authModal.link.notice')).toBeNull());
  });
});
