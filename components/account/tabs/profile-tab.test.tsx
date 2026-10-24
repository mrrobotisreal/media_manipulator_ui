import { afterEach, describe, expect, it, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';

const h = vi.hoisted(() => ({ auth: null as unknown }));
vi.mock('@/lib/auth/AuthProvider', () => ({ useAuth: () => h.auth }));
vi.mock('@/i18n/useLocalization', async () => {
  const m = await import('@/lib/billing/test-utils');
  return { useLocalization: () => m.fakeLocalization() };
});
vi.mock('@/lib/firebase', () => ({ getCurrentIdToken: async () => 'tok' }));
vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }));
vi.mock('@/lib/auth/accountApi', async (orig) => ({ ...(await orig<typeof import('@/lib/auth/accountApi')>()), revokeSessions: vi.fn(async () => ({ revokedAt: 'x' })), fetchSettings: vi.fn(), patchSettings: vi.fn() }));

import { fetchSettings, patchSettings, revokeSessions } from '@/lib/auth/accountApi';
import { ProfileTab } from './profile-tab';
import { copy } from '@/components/account/test-utils';

const prefs = {
  retentionHours: 4320, retentionScope: 'all', deleteMetadataReports: false, historyVisibility: 'full',
  emailAiJobFinished: false, emailExpiryDigest: true, updatedAt: 'x',
  limits: { minHours: 24, maxHours: 17520, defaultHours: 4320 },
};
function renderTab() {
  vi.mocked(fetchSettings).mockResolvedValue(prefs as never);
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={qc}>
      <ProfileTab copy={copy} />
    </QueryClientProvider>,
  );
}

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
    renderTab();
    fireEvent.click(screen.getByRole('button', { name: 'interface:accountTour.replay' }));
    window.removeEventListener('mm:onboarding-replay', seen);
    expect(seen).toHaveBeenCalledTimes(1);
  });

  it('shows name, email and the verification flow for an unverified user', async () => {
    const a = auth(false);
    h.auth = a;
    renderTab();
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
    renderTab();
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
    renderTab();
    fireEvent.click(screen.getByRole('button', { name: 'Sign out' }));
    expect(a.signOut).toHaveBeenCalled();
    expect(revokeSessions).not.toHaveBeenCalled();
  });

  it('email toggles load defaults, patch only the email field, and roll back on error', async () => {
    h.auth = auth(true);
    renderTab();
    const ai = await screen.findByRole('switch', { name: copy.profile.emailAiJob });
    const expiry = screen.getByRole('switch', { name: copy.profile.emailExpiry });
    await waitFor(() => expect(ai.getAttribute('aria-checked')).toBe('false'));
    expect(expiry.getAttribute('aria-checked')).toBe('true');
    expect(screen.getByText(copy.profile.emailAlways)).toBeTruthy();

    vi.mocked(patchSettings).mockResolvedValueOnce({ ...prefs, emailAiJobFinished: true } as never);
    fireEvent.click(ai);
    await waitFor(() => expect(patchSettings).toHaveBeenCalledWith('tok', { emailAiJobFinished: true }));
    await waitFor(() => expect(ai.getAttribute('aria-checked')).toBe('true'));

    vi.mocked(patchSettings).mockRejectedValueOnce(new Error('boom'));
    fireEvent.click(expiry);
    await waitFor(() => expect(patchSettings).toHaveBeenCalledWith('tok', { emailExpiryDigest: false }));
    await waitFor(() => expect(expiry.getAttribute('aria-checked')).toBe('true'));
  });
});
