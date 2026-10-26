/**
 * Locally generated RS256 keys and Firebase-shaped ID tokens for MM54 tests
 * (`createLocalJWKSet`, no network). Throwaway keys, generated per test run.
 */
import { createLocalJWKSet, exportJWK, generateKeyPair, SignJWT, type JWTVerifyGetKey } from 'jose';

export const PROJECT = 'mm-test-project';
export const NOW_S = 1_790_000_000; // fixed clock (2026-09-21)

export interface TestKeys {
  jwks: JWTVerifyGetKey;
  sign(claims?: Record<string, unknown>, header?: { alg?: string; kid?: string }): Promise<string>;
  signWithOtherKey(claims?: Record<string, unknown>): Promise<string>;
  /** An HS256 token (wrong algorithm family). */
  signHs256(claims?: Record<string, unknown>): Promise<string>;
  /** A PS256 token signed by a key the JWKS also lists (wrong alg, valid signature). */
  signPs256(claims?: Record<string, unknown>): Promise<string>;
}

export function claims(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    iss: `https://securetoken.google.com/${PROJECT}`,
    aud: PROJECT,
    sub: 'uid0123456789abcdefXYZ',
    auth_time: NOW_S - 600,
    iat: NOW_S - 60,
    exp: NOW_S + 3000,
    email: 'translator@example.com',
    email_verified: true,
    ...overrides,
  };
}

export async function createTestKeys(): Promise<TestKeys> {
  const { publicKey, privateKey } = await generateKeyPair('RS256', { extractable: true });
  const other = await generateKeyPair('RS256', { extractable: true });
  const ps = await generateKeyPair('PS256', { extractable: true });
  const pub = { ...(await exportJWK(publicKey)), kid: 'k1', alg: 'RS256', use: 'sig' };
  const psPub = { ...(await exportJWK(ps.publicKey)), kid: 'k3', use: 'sig' };
  const jwks = createLocalJWKSet({ keys: [pub, psPub] });
  const build = (c: Record<string, unknown>) => new SignJWT(c);
  return {
    jwks,
    sign: (c = claims(), header = {}) =>
      build(c).setProtectedHeader({ alg: header.alg ?? 'RS256', kid: header.kid ?? 'k1', typ: 'JWT' }).sign(privateKey),
    signWithOtherKey: (c = claims()) => build(c).setProtectedHeader({ alg: 'RS256', kid: 'k1' }).sign(other.privateKey),
    signHs256: (c = claims()) => build(c).setProtectedHeader({ alg: 'HS256', kid: 'k1' }).sign(new TextEncoder().encode('x'.repeat(32))),
    signPs256: (c = claims()) => build(c).setProtectedHeader({ alg: 'PS256', kid: 'k3' }).sign(ps.privateKey),
  };
}
