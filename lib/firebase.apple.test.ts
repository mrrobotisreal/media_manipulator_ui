import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const h = vi.hoisted(() => {
  const providers: Array<{ id: string; scopes: string[]; params: Record<string, string> }> = [];
  return {
    providers,
    signInWithPopup: vi.fn(),
    updateProfile: vi.fn(async () => undefined),
    getAdditionalUserInfo: vi.fn(),
    reauthenticateWithPopup: vi.fn(async () => undefined),
    syncAccount: vi.fn(async () => ({})),
    currentUser: null as unknown,
  };
});

vi.mock('firebase/app', () => ({ getApps: () => [{}], getApp: () => ({}), initializeApp: () => ({}) }));
vi.mock('firebase/auth', () => {
  class OAuthProvider {
    rec: { id: string; scopes: string[]; params: Record<string, string> };
    constructor(id: string) {
      this.rec = { id, scopes: [], params: {} };
      h.providers.push(this.rec);
    }
    addScope(s: string) {
      this.rec.scopes.push(s);
    }
    setCustomParameters(p: Record<string, string>) {
      this.rec.params = p;
    }
  }
  return {
    getAuth: () => ({ get currentUser() { return h.currentUser; } }),
    OAuthProvider,
    signInWithPopup: h.signInWithPopup,
    updateProfile: h.updateProfile,
    getAdditionalUserInfo: h.getAdditionalUserInfo,
    reauthenticateWithPopup: h.reauthenticateWithPopup,
    GoogleAuthProvider: class {},
  };
});
vi.mock('./auth/accountApi', () => ({ syncAccount: h.syncAccount }));
vi.mock('@/i18n', () => ({ getBrowserI18n: () => ({ language: 'de-DE' }) }));

function user(displayName: string | null) {
  return { displayName, getIdToken: vi.fn(async () => 'tok') };
}

beforeEach(() => {
  vi.stubEnv('NEXT_PUBLIC_FB_API_KEY', 'k');
  vi.stubEnv('NEXT_PUBLIC_FB_AUTH_DOMAIN', 'd');
  vi.stubEnv('NEXT_PUBLIC_FB_PROJECT_ID', 'p');
  vi.stubEnv('NEXT_PUBLIC_FB_APP_ID', 'a');
});
afterEach(() => {
  vi.unstubAllEnvs();
  vi.clearAllMocks();
  h.providers.length = 0;
  h.currentUser = null;
});

describe('signInWithApple', () => {
  it('uses the apple.com provider with email+name scopes and the UI locale', async () => {
    const { signInWithApple } = await import('./firebase');
    h.signInWithPopup.mockResolvedValue({ user: user('Anna') });
    h.getAdditionalUserInfo.mockReturnValue({ isNewUser: true });
    const out = await signInWithApple();
    expect(h.providers[0]).toEqual({ id: 'apple.com', scopes: ['email', 'name'], params: { locale: 'de_DE' } });
    expect(out.isNewUser).toBe(true);
  });

  it('registers the sign-in with signupSource apple', async () => {
    const { signInWithApple } = await import('./firebase');
    h.signInWithPopup.mockResolvedValue({ user: user('Anna') });
    h.getAdditionalUserInfo.mockReturnValue({ isNewUser: false });
    await signInWithApple();
    expect(h.syncAccount).toHaveBeenCalledWith('tok', expect.objectContaining({ signupSource: 'apple', displayName: 'Anna' }));
  });

  it('stores the first-sign-in name with updateProfile when Firebase has none', async () => {
    const { signInWithApple } = await import('./firebase');
    const u = user(null);
    h.signInWithPopup.mockResolvedValue({ user: u });
    h.getAdditionalUserInfo.mockReturnValue({ isNewUser: true, profile: { name: { firstName: 'Ada', lastName: 'Lovelace' } } });
    await signInWithApple();
    expect(h.updateProfile).toHaveBeenCalledWith(u, { displayName: 'Ada Lovelace' });
    expect(h.syncAccount).toHaveBeenCalledWith('tok', expect.objectContaining({ displayName: 'Ada Lovelace' }));
  });

  it('rethrows popup errors so the modal can map the code', async () => {
    const { signInWithApple } = await import('./firebase');
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    h.signInWithPopup.mockRejectedValue(Object.assign(new Error('x'), { code: 'auth/popup-blocked' }));
    await expect(signInWithApple()).rejects.toMatchObject({ code: 'auth/popup-blocked' });
  });
});

describe('reauthenticate apple', () => {
  it('re-authenticates through an apple.com popup and returns a fresh token', async () => {
    const { reauthenticate } = await import('./firebase');
    h.currentUser = { getIdToken: vi.fn(async () => 'fresh') };
    await expect(reauthenticate({ kind: 'apple' })).resolves.toBe('fresh');
    expect(h.reauthenticateWithPopup).toHaveBeenCalled();
    expect(h.providers[0].id).toBe('apple.com');
  });
});

describe('isAppleAuthEnabled', () => {
  it('is off unless the flag is exactly "true"', async () => {
    const { isAppleAuthEnabled } = await import('./firebase');
    expect(isAppleAuthEnabled()).toBe(false);
    vi.stubEnv('NEXT_PUBLIC_AUTH_APPLE_ENABLED', 'true');
    expect(isAppleAuthEnabled()).toBe(true);
  });
});
