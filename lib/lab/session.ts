// MM138: the Lab session cookie. Firebase auth is client-only (IndexedDB), so the server-rendered
// /lab page has no session of its own. A signed-in account whose server verdict is
// `operatorEligibility === 'granted'` (and nobody else) mirrors its ID token into this short-lived
// cookie; the page forwards it to GET /api/lab/models, which is the real gate (404 for everyone
// not in LAB_EMAILS). The cookie grants nothing by itself.

export const LAB_COOKIE_NAME = 'mm_lab_t';
/** Firebase ID tokens live an hour; the cookie dies before the token does. */
export const LAB_COOKIE_MAX_AGE = 3300;
/** Refresh well inside the cookie lifetime. */
export const LAB_COOKIE_REFRESH_MS = 45 * 60 * 1000;

interface CookieDoc {
  cookie: string;
  location?: { protocol?: string };
}

function currentDoc(): CookieDoc | null {
  return typeof document === 'undefined' ? null : (document as unknown as CookieDoc);
}

export function buildLabCookie(token: string, secure: boolean): string {
  return `${LAB_COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; Max-Age=${LAB_COOKIE_MAX_AGE}; SameSite=Strict${secure ? '; Secure' : ''}`;
}

export function buildClearedLabCookie(secure: boolean): string {
  return `${LAB_COOKIE_NAME}=; Path=/; Max-Age=0; SameSite=Strict${secure ? '; Secure' : ''}`;
}

const isSecure = (doc: CookieDoc) => doc.location?.protocol === 'https:';

export function writeLabCookie(token: string, doc: CookieDoc | null = currentDoc()): void {
  if (!doc) return;
  try {
    doc.cookie = buildLabCookie(token, isSecure(doc));
  } catch {
    /* cookies blocked: the page simply 404s */
  }
}

export function clearLabCookie(doc: CookieDoc | null = currentDoc()): void {
  if (!doc) return;
  try {
    doc.cookie = buildClearedLabCookie(isSecure(doc));
  } catch {
    /* nothing to do */
  }
}

/**
 * Sets the cookie when `granted` and a token is available, otherwise clears it.
 * Returns what it did, for tests.
 */
export async function syncLabCookie(
  granted: boolean,
  getToken: () => Promise<string | null>,
  doc: CookieDoc | null = currentDoc(),
): Promise<'set' | 'cleared'> {
  if (!granted) {
    clearLabCookie(doc);
    return 'cleared';
  }
  try {
    const token = await getToken();
    if (token) {
      writeLabCookie(token, doc);
      return 'set';
    }
  } catch {
    /* fall through to clear */
  }
  clearLabCookie(doc);
  return 'cleared';
}
