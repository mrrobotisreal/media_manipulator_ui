/**
 * MM54 decision 2 / §4: Firebase ID-token verification with `jose` against a
 * LOCAL JWKS (generated keys, no network): valid, expired, wrong issuer, wrong
 * audience, wrong alg, bad signature, Firebase claim checks.
 */
// @vitest-environment node
import { beforeAll, describe, expect, it } from 'vitest';

import { claims, createTestKeys, NOW_S, PROJECT, type TestKeys } from './testing/tokens';
import { bearerToken, verifyFirebaseIdToken } from './verifyIdToken';

let keys: TestKeys;
beforeAll(async () => {
  keys = await createTestKeys();
});

const verify = (token: string) => verifyFirebaseIdToken(token, { projectId: PROJECT, jwks: keys.jwks, now: () => NOW_S });

describe('verifyFirebaseIdToken (jose, local JWKS)', () => {
  it('valid: returns uid, email and email_verified', async () => {
    expect(await verify(await keys.sign())).toEqual({
      ok: true,
      token: { uid: 'uid0123456789abcdefXYZ', email: 'translator@example.com', emailVerified: true },
    });
  });

  it('valid but unverified email: verifies, with emailVerified false (the handler maps it to "unverified")', async () => {
    const r = await verify(await keys.sign(claims({ email_verified: false })));
    expect(r).toMatchObject({ ok: true, token: { emailVerified: false } });
    const missing = claims();
    delete missing.email_verified;
    expect(await verify(await keys.sign(missing))).toMatchObject({ ok: true, token: { emailVerified: false } });
  });

  it('expired: rejected', async () => {
    expect(await verify(await keys.sign(claims({ exp: NOW_S - 120 })))).toEqual({ ok: false, reason: 'ERR_JWT_EXPIRED' });
  });

  it('wrong issuer: rejected', async () => {
    const r = await verify(await keys.sign(claims({ iss: 'https://securetoken.google.com/other-project' })));
    expect(r).toEqual({ ok: false, reason: 'ERR_JWT_CLAIM_VALIDATION_FAILED' });
    expect((await verify(await keys.sign(claims({ iss: 'https://accounts.google.com' })))).ok).toBe(false);
  });

  it('wrong audience: rejected', async () => {
    expect(await verify(await keys.sign(claims({ aud: 'other-project' })))).toEqual({ ok: false, reason: 'ERR_JWT_CLAIM_VALIDATION_FAILED' });
  });

  it('wrong alg: HS256 and PS256 tokens are rejected even when a JWKS key matches the kid', async () => {
    expect((await verify(await keys.signHs256())).ok).toBe(false);
    expect((await verify(await keys.signPs256())).ok).toBe(false);
  });

  it('bad signature (another key, same kid) and tampered payload: rejected', async () => {
    expect(await verify(await keys.signWithOtherKey())).toEqual({ ok: false, reason: 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED' });
    const [h, , s] = (await keys.sign()).split('.');
    const forged = Buffer.from(JSON.stringify(claims({ email: 'attacker@example.com' }))).toString('base64url');
    expect((await verify(`${h}.${forged}.${s}`)).ok).toBe(false);
  });

  it('unknown kid: rejected', async () => {
    expect((await verify(await keys.sign(claims(), { kid: 'nope' }))).ok).toBe(false);
  });

  it('Firebase checks: empty sub, auth_time in the future, missing auth_time, iat in the future, missing email', async () => {
    expect((await verify(await keys.sign(claims({ sub: '' })))).ok).toBe(false);
    expect(await verify(await keys.sign(claims({ auth_time: NOW_S + 3600 })))).toEqual({ ok: false, reason: 'auth_time' });
    const noAuth = claims();
    delete noAuth.auth_time;
    expect(await verify(await keys.sign(noAuth))).toEqual({ ok: false, reason: 'auth_time' });
    expect((await verify(await keys.sign(claims({ iat: NOW_S + 3600 })))).ok).toBe(false);
    const noEmail = claims();
    delete noEmail.email;
    expect(await verify(await keys.sign(noEmail))).toEqual({ ok: false, reason: 'email' });
  });

  it('garbage tokens never throw', async () => {
    for (const t of ['', 'a.b.c', 'not-a-jwt', `${'x'.repeat(50)}.${'y'.repeat(50)}.${'z'.repeat(50)}`]) {
      expect((await verify(t)).ok).toBe(false);
    }
  });
});

describe('bearerToken', () => {
  it('accepts only "Bearer <jwt>"', () => {
    expect(bearerToken('Bearer aaa.bbb.ccc')).toBe('aaa.bbb.ccc');
    expect(bearerToken(null)).toBeNull();
    expect(bearerToken('Basic abc')).toBeNull();
    expect(bearerToken('Bearer ')).toBeNull();
    expect(bearerToken('Bearer a.b')).toBeNull();
    expect(bearerToken('Bearer a.b.c d')).toBeNull();
    expect(bearerToken(`Bearer ${'a'.repeat(9000)}.b.c`)).toBeNull();
  });
});
