/**
 * Firebase ID-token verification with `jose` (MM54 decision 2; design §2.8).
 *
 * SERVER ONLY. No service account: the token's RS256 signature is checked
 * against Google's public securetoken JWKS, then the Firebase-specific claims
 * (https://firebase.google.com/docs/auth/admin/verify-id-tokens#verify_id_tokens_using_a_third-party_jwt_library):
 *   alg RS256 · iss https://securetoken.google.com/<project> · aud <project>
 *   exp in the future · iat and auth_time in the past · sub non-empty
 * plus what the allowlist needs: `email` (string) and `email_verified`.
 *
 * The remote JWKS is created once per function instance; `jose` caches the keys
 * and re-fetches only on an unknown `kid` (cooldown) or after the cache max age,
 * so handlers never fetch per request. Tests inject `createLocalJWKSet`.
 */
import { createRemoteJWKSet, jwtVerify, type JWTVerifyGetKey } from 'jose';

export const FIREBASE_JWKS_URL =
  'https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com';

/** Seconds of clock skew tolerated on exp/iat/auth_time. */
export const CLOCK_TOLERANCE_S = 30;

let remote: JWTVerifyGetKey | null = null;
function remoteJwks(): JWTVerifyGetKey {
  remote ??= createRemoteJWKSet(new URL(FIREBASE_JWKS_URL));
  return remote;
}

export interface VerifiedToken {
  uid: string;
  email: string;
  emailVerified: boolean;
}

export type VerifyResult = { ok: true; token: VerifiedToken } | { ok: false; reason: string };

export interface VerifyOptions {
  projectId: string;
  /** Test seam: a local JWKS. */
  jwks?: JWTVerifyGetKey;
  /** Test seam: seconds since epoch. */
  now?: () => number;
}

/** `Authorization: Bearer <token>` -> the token, or null. */
export function bearerToken(header: string | null): string | null {
  if (!header) return null;
  const m = /^Bearer ([A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+)$/.exec(header.trim());
  return m && m[1].length <= 8192 ? m[1] : null;
}

/**
 * Verifies a Firebase ID token. Never throws; the `reason` is a fixed code for
 * logs and tests, never echoed to clients (they get a plain 401).
 */
export async function verifyFirebaseIdToken(token: string, options: VerifyOptions): Promise<VerifyResult> {
  const { projectId } = options;
  const nowS = options.now ? options.now() : Math.floor(Date.now() / 1000);
  try {
    const { payload } = await jwtVerify(token, options.jwks ?? remoteJwks(), {
      algorithms: ['RS256'],
      issuer: `https://securetoken.google.com/${projectId}`,
      audience: projectId,
      requiredClaims: ['exp', 'iat', 'sub'],
      clockTolerance: CLOCK_TOLERANCE_S,
      currentDate: new Date(nowS * 1000),
    });
    if (typeof payload.sub !== 'string' || payload.sub.length === 0 || payload.sub.length > 128) {
      return { ok: false, reason: 'sub' };
    }
    if (typeof payload.iat !== 'number' || payload.iat > nowS + CLOCK_TOLERANCE_S) return { ok: false, reason: 'iat' };
    const authTime = payload.auth_time;
    if (typeof authTime !== 'number' || authTime > nowS + CLOCK_TOLERANCE_S) return { ok: false, reason: 'auth_time' };
    if (typeof payload.email !== 'string' || !payload.email.includes('@') || payload.email.length > 320) {
      return { ok: false, reason: 'email' };
    }
    return {
      ok: true,
      token: { uid: payload.sub, email: payload.email, emailVerified: payload.email_verified === true },
    };
  } catch (error) {
    const code = (error as { code?: unknown })?.code;
    return { ok: false, reason: typeof code === 'string' ? code : 'invalid' };
  }
}
