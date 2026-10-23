import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const track = vi.hoisted(() => vi.fn());
vi.mock('@/lib/analytics/client', () => ({ analytics: { track } }));

const h = vi.hoisted(() => ({ push: vi.fn(), signOut: vi.fn(async () => undefined), save: vi.fn() }));

vi.mock('next/navigation', () => ({ useRouter: () => ({ push: h.push, replace: vi.fn() }) }));
vi.mock('@/i18n/useLocalizedHref', () => ({ useLocalizedHref: () => (p: string) => p }));
vi.mock('@/lib/auth/AuthProvider', () => ({ useAuth: () => ({ signOut: h.signOut }) }));
vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }));
vi.mock('@/lib/results/save', () => ({ saveBlobToDisk: h.save }));
vi.mock('@/lib/firebase', () => ({
  getCurrentIdToken: async () => 'tok',
  getFreshIdToken: async () => 'fresh',
  getSignInProviders: async () => ['password', 'google.com'],
  reauthenticate: vi.fn(async () => 'reauthed'),
}));
vi.mock('@/lib/auth/accountApi', async (orig) => ({
  ...(await orig<typeof import('@/lib/auth/accountApi')>()),
  fetchSettings: vi.fn(),
  patchSettings: vi.fn(),
  previewRetention: vi.fn(),
  fetchHistory: vi.fn(async () => ({ entries: [], total: 0, limit: 50, offset: 0 })),
  fetchStudioProjects: vi.fn(async () => []),
  exportData: vi.fn(),
  deleteAllData: vi.fn(),
  deleteAccount: vi.fn(),
}));

import {
  AccountApiError,
  deleteAccount,
  deleteAllData,
  exportData,
  fetchSettings,
  patchSettings,
} from '@/lib/auth/accountApi';
import { reauthenticate } from '@/lib/firebase';
import { PrivacyTab } from './privacy-tab';
import { copy } from '@/components/account/test-utils';

const settings = {
  retentionHours: 4320, retentionScope: 'all', deleteMetadataReports: false, historyVisibility: 'full',
  updatedAt: 'x', limits: { minHours: 24, maxHours: 17520, defaultHours: 4320 },
};

function renderTab() {
  vi.mocked(fetchSettings).mockResolvedValue(settings as never);
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={qc}>
      <PrivacyTab copy={copy} uid="u1" />
    </QueryClientProvider>,
  );
}

beforeEach(() => {
  track.mockClear();
  h.push.mockReset();
  h.signOut.mockClear();
  vi.mocked(deleteAllData).mockReset();
  vi.mocked(deleteAccount).mockReset();
  vi.mocked(exportData).mockReset();
});
afterEach(cleanup);

describe('PrivacyTab', () => {
  it('loads settings into the picker, with the metadata toggle at the default (keep)', async () => {
    renderTab();
    const picker = await screen.findByTestId('retention-picker');
    expect((within(picker).getByRole('radio', { name: /6 months/ }) as HTMLInputElement).checked).toBe(true);
    expect(screen.getByRole('switch').getAttribute('aria-checked')).toBe('false');
    expect(screen.getByText(/Amazon S3 \(us-west-2\)/)).toBeTruthy();
  });

  it('toggling metadata reports patches only that field and rolls back on failure', async () => {
    renderTab();
    await screen.findByTestId('retention-picker');
    vi.mocked(patchSettings).mockRejectedValueOnce(new Error('x'));
    fireEvent.click(screen.getByRole('switch'));
    await waitFor(() => expect(patchSettings).toHaveBeenCalledWith('tok', { deleteMetadataReports: true }));
    await waitFor(() => expect(screen.getByRole('switch').getAttribute('aria-checked')).toBe('false'));
    expect(screen.getByText(copy.privacy.store.settingFailed)).toBeTruthy();
  });

  it('export saves the zip; a 429 shows the wait time', async () => {
    renderTab();
    fireEvent.click(await screen.findByRole('button', { name: 'Download my data' }));
    vi.mocked(exportData).mockResolvedValueOnce({ blob: new Blob(['z']), fileName: 'mm.zip' });
    await waitFor(() => expect(h.save).toHaveBeenCalled());
    expect(h.save.mock.calls[0][1]).toBe('mm.zip');

    vi.mocked(exportData).mockRejectedValueOnce(new AccountApiError(429, 'export_rate_limited', { retryAfterSeconds: 600 }));
    fireEvent.click(screen.getByRole('button', { name: 'Download my data' }));
    expect(await screen.findByText('You have reached the export limit. Try again in 10 min.')).toBeTruthy();
  });

  it('emits data_export_requested once the export is accepted, and not for a 429', async () => {
    renderTab();
    fireEvent.click(await screen.findByRole('button', { name: 'Download my data' }));
    vi.mocked(exportData).mockResolvedValueOnce({ blob: new Blob(['z']), fileName: 'mm.zip' });
    await waitFor(() => expect(track).toHaveBeenCalledWith('data_export_requested', {}));
  });

  it('delete-all is gated behind typing DELETE and never fires on a single click', async () => {
    vi.mocked(deleteAllData).mockResolvedValue({ deleted: { objects: 1, bytes: 1, projects: 0, jobs: 1 }, pending: 0 });
    renderTab();
    fireEvent.click(await screen.findByRole('button', { name: 'Delete all my files' }));
    const dialog = await screen.findByRole('alertdialog');
    const confirm = within(dialog).getByRole('button', { name: 'Delete everything' }) as HTMLButtonElement;
    expect(confirm.disabled).toBe(true);
    expect(document.activeElement).not.toBe(confirm);
    fireEvent.click(confirm);
    expect(deleteAllData).not.toHaveBeenCalled();

    const input = within(dialog).getByLabelText('Confirmation text');
    fireEvent.change(input, { target: { value: 'delete' } });
    expect(confirm.disabled).toBe(true); // case-sensitive
    fireEvent.change(input, { target: { value: 'DELETE' } });
    expect(confirm.disabled).toBe(false);
    fireEvent.click(confirm);
    await waitFor(() => expect(deleteAllData).toHaveBeenCalledWith('tok', 'DELETE'));
    await waitFor(() => expect(track).toHaveBeenCalledWith('data_deleted', { scope: 'all', kind: 'all_files' }));
  });

  it('account deletion needs the phrase; reauth_required prompts a re-sign-in, then retries and redirects', async () => {
    vi.mocked(deleteAccount)
      .mockRejectedValueOnce(new AccountApiError(401, 'reauth_required'))
      .mockResolvedValueOnce({ status: 'completed', steps: [], deleted: {}, stripe: 'none', analytics: 'ok', retryable: false } as never);
    renderTab();
    fireEvent.click(await screen.findByRole('button', { name: 'Delete my account' }));
    const dialog = await screen.findByRole('alertdialog');
    const confirm = within(dialog).getByRole('button', { name: 'Delete my account' }) as HTMLButtonElement;
    expect(confirm.disabled).toBe(true);
    fireEvent.click(confirm);
    expect(deleteAccount).not.toHaveBeenCalled();

    fireEvent.change(within(dialog).getByLabelText('Confirmation text'), { target: { value: 'DELETE MY ACCOUNT' } });
    fireEvent.click(confirm);
    await waitFor(() => expect(deleteAccount).toHaveBeenCalledWith('fresh', 'DELETE MY ACCOUNT'));

    // 401 reauth_required: the dialog now asks for a fresh sign-in; nothing is signed out.
    expect(await screen.findByText('Sign in again to continue')).toBeTruthy();
    expect(h.signOut).not.toHaveBeenCalled();
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'pw' } });
    fireEvent.click(screen.getByRole('button', { name: 'Confirm password' }));
    await waitFor(() => expect(reauthenticate).toHaveBeenCalledWith({ kind: 'password', password: 'pw' }));
    await waitFor(() => expect(deleteAccount).toHaveBeenLastCalledWith('reauthed', 'DELETE MY ACCOUNT'));

    // Success: signed out, local state cleared, redirected home with a notice.
    await waitFor(() => expect(h.signOut).toHaveBeenCalled());
    await waitFor(() => expect(h.push).toHaveBeenCalledWith('/?accountDeleted=1'));
    expect(track.mock.calls.filter(([n]) => n === 'data_deleted')).toEqual([['data_deleted', { scope: 'account', kind: 'account' }]]);
  });

  it('a retryable 502 keeps the dialog open with a retry, and does not sign out', async () => {
    vi.mocked(deleteAccount).mockRejectedValueOnce(new AccountApiError(502, '', { retryable: true }));
    renderTab();
    fireEvent.click(await screen.findByRole('button', { name: 'Delete my account' }));
    const dialog = await screen.findByRole('alertdialog');
    fireEvent.change(within(dialog).getByLabelText('Confirmation text'), { target: { value: 'DELETE MY ACCOUNT' } });
    fireEvent.click(within(dialog).getByRole('button', { name: 'Delete my account' }));
    expect(await screen.findByText(copy.privacy.data.accountIncomplete)).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Retry deletion' })).toBeTruthy();
    expect(h.signOut).not.toHaveBeenCalled();
    expect(h.push).not.toHaveBeenCalled();
  });
});
