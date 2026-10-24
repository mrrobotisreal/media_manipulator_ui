import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';

const h = vi.hoisted(() => ({ auth: null as unknown }));
vi.mock('@/lib/auth/AuthProvider', () => ({ useAuth: () => h.auth }));
vi.mock('@/i18n/useLocalization', async () => {
  const m = await import('@/lib/billing/test-utils');
  return { useLocalization: () => m.fakeLocalization() };
});
vi.mock('@/lib/firebase', () => ({ getCurrentIdToken: async () => 'tok' }));
vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }));
vi.mock('@/lib/auth/accountApi', async (orig) => ({ ...(await orig<typeof import('@/lib/auth/accountApi')>()), revokeSessions: vi.fn(async () => ({ revokedAt: 'x' })) }));

import { revokeSessions } from '@/lib/auth/accountApi';
import { ProfileTab } from './profile-tab';
import { copy } from '@/components/account/test-utils';

const auth = (verified: boolean) => ({
  user: { uid: 'u', email: 'a@b.c', displayName: 'Alex', emailVerified: verified },
  emailVerified: verified,
  signOut: vi.fn(async () => undefined),
  sendVerificationEmail: vi.fn(async () => undefined),
  refreshIdentity: vi.fn(async () => false),
});

afterEach(() => {
  cleanup();
  vi.mocked(revokeSessions).mockClear();
});

describe('ProfileTab', () => {
  it('Replay tour asks the tour host to open', () => {
    h.auth = auth(true);
    const seen = vi.fn();
    window.addEventListener('mm:onboarding-replay', seen);
    render(<ProfileTab copy={copy} />);
    fireEvent.click(screen.getByRole('button', { name: 'interface:accountTour.replay' }));
    window.removeEventListener('mm:onboarding-replay', seen);
    expect(seen).toHaveBeenCalledTimes(1);
  });

  it('shows name, email and the verification flow for an unverified user', async () => {
    const a = auth(false);
    h.auth = a;
    render(<ProfileTab copy={copy} />);
    expect(screen.getByText('Alex')).toBeTruthy();
    expect(screen.getByText('Not verified')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Send verification email' }));
    await waitFor(() => expect(a.sendVerificationEmail).toHaveBeenCalled());
    fireEvent.click(screen.getByRole('button', { name: 'I’ve verified' }));
    expect(await screen.findByText(copy.profile.stillUnverified)).toBeTruthy();
  });

  it('sign out everywhere confirms, revokes, then signs out locally', async () => {
    const a = auth(true);
    h.auth = a;
    render(<ProfileTab copy={copy} />);
    expect(screen.queryByRole('button', { name: 'Send verification email' })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Sign out everywhere' }));
    expect(revokeSessions).not.toHaveBeenCalled();
    fireEvent.click(within(await screen.findByRole('alertdialog')).getByRole('button', { name: 'Sign out everywhere' }));
    await waitFor(() => expect(revokeSessions).toHaveBeenCalledWith('tok'));
    await waitFor(() => expect(a.signOut).toHaveBeenCalled());
  });

  it('plain sign out signs out without revoking', () => {
    const a = auth(true);
    h.auth = a;
    render(<ProfileTab copy={copy} />);
    fireEvent.click(screen.getByRole('button', { name: 'Sign out' }));
    expect(a.signOut).toHaveBeenCalled();
    expect(revokeSessions).not.toHaveBeenCalled();
  });
});
