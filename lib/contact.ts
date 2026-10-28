// MM85: the contact form's client half. The API contract is media_manipulator_api
// internal/handlers/contact.go (POST /api/contact):
//   {name, email, subject, message, website?} -> 202 {reference}
//   400 {error:"invalid_contact", field}, 503 {error:"contact_unavailable"},
//   502 {error:"contact_send_failed"}, 429 from the `contact` limiter bucket.
// Pure helpers live here so they are unit-testable; the component only renders.

import { getBaseURL } from '@/lib/utils';

export const SUPPORT_EMAIL = 'support@media-manipulator.com';
export const PRIVACY_EMAIL = 'privacy@media-manipulator.com';

/** The API's closed subject vocabulary, in the order the select shows it. */
export const CONTACT_SUBJECTS = ['bug', 'billing', 'privacy', 'press', 'other'] as const;
export type ContactSubject = (typeof CONTACT_SUBJECTS)[number];

export const CONTACT_MAX_NAME = 100;
export const CONTACT_MAX_MESSAGE = 2000;

export interface ContactForm {
  name: string;
  email: string;
  subject: ContactSubject | '';
  message: string;
  /** Honeypot. Humans never see it; a filled value means a bot. */
  website: string;
}

export type ContactField = 'name' | 'email' | 'subject' | 'message';

/** Characters as the API counts them (runes, not UTF-16 units). */
export const charCount = (s: string): number => [...s].length;

/** Same rule as the API's validContactEmail: a bare address with a dotted domain. */
export function isValidContactEmail(raw: string): boolean {
  const s = raw.trim();
  if (!s || s.length > 254 || /[\s<>]/.test(s)) return false;
  const at = s.lastIndexOf('@');
  if (at <= 0) return false;
  const domain = s.slice(at + 1);
  return domain.includes('.') && !domain.startsWith('.') && !domain.endsWith('.') && !domain.includes('@');
}

/** The first invalid field, mirroring the API's order, or null when the form can be sent. */
export function validateContact(form: ContactForm): ContactField | null {
  const name = form.name.trim();
  if (!name || charCount(name) > CONTACT_MAX_NAME || /[\r\n]/.test(name)) return 'name';
  if (!isValidContactEmail(form.email)) return 'email';
  if (!CONTACT_SUBJECTS.includes(form.subject as ContactSubject)) return 'subject';
  const message = form.message.trim();
  if (!message || charCount(message) > CONTACT_MAX_MESSAGE) return 'message';
  return null;
}

export type ContactOutcome =
  | { kind: 'sent'; reference: string }
  | { kind: 'invalid'; field: ContactField }
  /** Email is switched off on the API (503 contact_unavailable): show the mailto fallback. */
  | { kind: 'unavailable' }
  | { kind: 'rate_limited' }
  | { kind: 'failed' };

const FIELDS: readonly string[] = ['name', 'email', 'subject', 'message'];

/** Map an API response (status + parsed body) onto what the form shows. */
export function contactOutcome(status: number, body: unknown): ContactOutcome {
  const b = (body && typeof body === 'object' ? body : {}) as Record<string, unknown>;
  if (status === 202 && typeof b.reference === 'string' && b.reference) {
    return { kind: 'sent', reference: b.reference };
  }
  if (status === 400 && typeof b.field === 'string' && FIELDS.includes(b.field)) {
    return { kind: 'invalid', field: b.field as ContactField };
  }
  if (status === 503 && b.error === 'contact_unavailable') return { kind: 'unavailable' };
  if (status === 429) return { kind: 'rate_limited' };
  return { kind: 'failed' };
}

/** The analytics `ok` flag: true only for a real send (the honeypot never reaches here). */
export const outcomeOk = (o: ContactOutcome): boolean => o.kind === 'sent';

/**
 * POST the form. Never throws: a network error is `failed`. The session header
 * feeds the API's per-session `contact` bucket.
 */
export async function submitContact(
  form: ContactForm,
  opts: { fetchImpl?: typeof fetch; sessionId?: string } = {},
): Promise<ContactOutcome> {
  const doFetch = opts.fetchImpl ?? fetch;
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (opts.sessionId) headers['X-MM-Session-ID'] = opts.sessionId;
  try {
    const res = await doFetch(`${getBaseURL()}/contact`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        name: form.name.trim(),
        email: form.email.trim(),
        subject: form.subject,
        message: form.message.trim(),
        website: form.website,
      }),
    });
    let body: unknown = null;
    try {
      body = await res.json();
    } catch {
      body = null;
    }
    return contactOutcome(res.status, body);
  } catch {
    return { kind: 'failed' };
  }
}
