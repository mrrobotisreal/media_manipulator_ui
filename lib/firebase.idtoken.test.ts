import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// 2026-11-06 incident: on a fresh load Firebase restores the user asynchronously.
// getCurrentIdToken must wait for that, or signed-in requests go out anonymous
// (Darkroom showed no projects; owned exports 404'd).
const h = vi.hoisted(() => ({ currentUser: null as unknown, ready: vi.fn() }));

vi.mock('firebase/app', () => ({ getApps: () => [{}], getApp: () => ({}), initializeApp: () => ({}) }));
vi.mock('firebase/auth', () => ({
  getAuth: () => ({
    get currentUser() {
      return h.currentUser;
    },
    authStateReady: h.ready,
  }),
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

describe('getCurrentIdToken', () => {
  it('waits for the persisted user to be restored before reading currentUser', async () => {
    const { getCurrentIdToken } = await import('./firebase');
    // The user only appears once authStateReady resolves (as on a fresh page load).
    h.ready.mockImplementation(async () => {
      h.currentUser = { getIdToken: async () => 'restored-token' };
    });
    await expect(getCurrentIdToken()).resolves.toBe('restored-token');
    expect(h.ready).toHaveBeenCalledTimes(1);
  });

  it('returns null when nobody is signed in after the restore', async () => {
    const { getCurrentIdToken } = await import('./firebase');
    h.ready.mockResolvedValue(undefined);
    await expect(getCurrentIdToken()).resolves.toBeNull();
  });
});
