import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

const h = vi.hoisted(() => ({ auth: null as unknown }));
vi.mock('@/lib/auth/AuthProvider', () => ({ useAuth: () => h.auth }));

import { VerifyNotice, type VerifyNoticeLabels } from './verify-notice';

const labels: VerifyNoticeLabels = {
  title: 'Verify',
  body: 'Body',
  send: 'Send it',
  sent: 'Sent!',
  sendFailed: 'Failed',
  check: 'Checked',
  stillUnverified: 'Still not',
};

afterEach(() => cleanup());

describe('VerifyNotice (shared by /account and the translator gate)', () => {
  it('send calls sendVerificationEmail and reports success', async () => {
    const sendVerificationEmail = vi.fn(async () => {});
    h.auth = { sendVerificationEmail, refreshIdentity: vi.fn() };
    render(<VerifyNotice labels={labels} />);
    fireEvent.click(screen.getByRole('button', { name: 'Send it' }));
    expect(await screen.findByText('Sent!')).toBeTruthy();
    expect(sendVerificationEmail).toHaveBeenCalledTimes(1);
  });

  it('a failed send shows the failure copy', async () => {
    h.auth = { sendVerificationEmail: vi.fn(async () => Promise.reject(new Error('rate'))), refreshIdentity: vi.fn() };
    render(<VerifyNotice labels={labels} />);
    fireEvent.click(screen.getByRole('button', { name: 'Send it' }));
    expect(await screen.findByText('Failed')).toBeTruthy();
  });

  it('re-check: verified calls onVerified; unverified shows the still-unverified copy', async () => {
    const onVerified = vi.fn();
    h.auth = { sendVerificationEmail: vi.fn(), refreshIdentity: vi.fn(async () => true) };
    render(<VerifyNotice labels={labels} onVerified={onVerified} />);
    fireEvent.click(screen.getByRole('button', { name: 'Checked' }));
    await waitFor(() => expect(onVerified).toHaveBeenCalledTimes(1));
    cleanup();
    h.auth = { sendVerificationEmail: vi.fn(), refreshIdentity: vi.fn(async () => false) };
    render(<VerifyNotice labels={labels} onVerified={onVerified} />);
    fireEvent.click(screen.getByRole('button', { name: 'Checked' }));
    expect(await screen.findByText('Still not')).toBeTruthy();
    expect(onVerified).toHaveBeenCalledTimes(1);
  });

  it('renders nothing outside the AuthProvider', () => {
    h.auth = null;
    const { container } = render(<VerifyNotice labels={labels} />);
    expect(container.innerHTML).toBe('');
  });
});
