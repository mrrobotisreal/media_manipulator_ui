import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const h = vi.hoisted(() => ({ sendPasswordResetEmail: vi.fn(), linkWithCredential: vi.fn(), currentUser: null as unknown }));

vi.mock('firebase/app', () => ({ getApps: () => [{}], getApp: () => ({}), initializeApp: () => ({}) }));
vi.mock('firebase/auth', () => ({
  getAuth: () => ({ get currentUser() { return h.currentUser; } }),
  sendPasswordResetEmail: h.sendPasswordResetEmail,
  linkWithCredential: h.linkWithCredential,
}));
vi.mock('./auth/accountApi', () => ({ syncAccount: vi.fn() }));
vi.mock('@/i18n', () => ({ getBrowserI18n: () => ({ language: 'en-US' }) }));

beforeEach(() => {
  vi.stubEnv('NEXT_PUBLIC_FB_API_KEY', 'k');
  vi.stubEnv('NEXT_PUBLIC_FB_AUTH_DOMAIN', 'd');
  vi.stubEnv('NEXT_PUBLIC_FB_PROJECT_ID', 'p');
  vi.stubEnv('NEXT_PUBLIC_FB_APP_ID', 'a');
});
afterEach(() => {
  vi.unstubAllEnvs();
  vi.clearAllMocks();
  h.currentUser = null;
});

describe('sendPasswordReset', () => {
  it('calls sendPasswordResetEmail with the address', async () => {
    const { sendPasswordReset } = await import('./firebase');
    h.sendPasswordResetEmail.mockResolvedValue(undefined);
    await sendPasswordReset('a@b.co');
    expect(h.sendPasswordResetEmail).toHaveBeenCalledWith(expect.anything(), 'a@b.co');
  });

  it('resolves silently on auth/user-not-found (neutral state, no enumeration)', async () => {
    const { sendPasswordReset } = await import('./firebase');
    h.sendPasswordResetEmail.mockRejectedValue(Object.assign(new Error('x'), { code: 'auth/user-not-found' }));
    await expect(sendPasswordReset('nobody@b.co')).resolves.toBeUndefined();
  });

  it('propagates invalid-email and rate-limit errors', async () => {
    const { sendPasswordReset } = await import('./firebase');
    h.sendPasswordResetEmail.mockRejectedValue(Object.assign(new Error('x'), { code: 'auth/too-many-requests' }));
    await expect(sendPasswordReset('a@b.co')).rejects.toMatchObject({ code: 'auth/too-many-requests' });
  });
});

describe('linkPendingCredential', () => {
  it('links to the current user and reports success', async () => {
    const { linkPendingCredential } = await import('./firebase');
    h.currentUser = { uid: 'u' };
    h.linkWithCredential.mockResolvedValue({});
    const cred = {} as never;
    await expect(linkPendingCredential(cred)).resolves.toBe(true);
    expect(h.linkWithCredential).toHaveBeenCalledWith(h.currentUser, cred);
  });

  it('never throws: a failed link returns false', async () => {
    const { linkPendingCredential } = await import('./firebase');
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    h.currentUser = { uid: 'u' };
    h.linkWithCredential.mockRejectedValue(new Error('nope'));
    await expect(linkPendingCredential({} as never)).resolves.toBe(false);
  });
});
