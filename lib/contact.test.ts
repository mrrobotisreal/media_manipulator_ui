import { describe, expect, it, vi } from 'vitest';

import {
  CONTACT_SUBJECTS,
  contactOutcome,
  isValidContactEmail,
  outcomeOk,
  submitContact,
  validateContact,
  type ContactForm,
} from './contact';

const good: ContactForm = { name: 'Ada', email: 'ada@example.com', subject: 'bug', message: 'It broke.', website: '' };

describe('MM85 contact form helpers', () => {
  it('mirrors the API subject vocabulary', () => {
    expect([...CONTACT_SUBJECTS]).toEqual(['bug', 'billing', 'privacy', 'press', 'other']);
  });

  it('validates in the API order', () => {
    expect(validateContact(good)).toBeNull();
    expect(validateContact({ ...good, name: '  ' })).toBe('name');
    expect(validateContact({ ...good, name: 'x'.repeat(101) })).toBe('name');
    expect(validateContact({ ...good, email: 'nope' })).toBe('email');
    expect(validateContact({ ...good, subject: '' })).toBe('subject');
    expect(validateContact({ ...good, message: '' })).toBe('message');
    // Counted in characters like the API (runes), not UTF-16 units.
    expect(validateContact({ ...good, message: '😀'.repeat(2000) })).toBeNull();
    expect(validateContact({ ...good, message: 'é'.repeat(2001) })).toBe('message');
  });

  it('accepts bare addresses with a dotted domain only', () => {
    expect(isValidContactEmail('a@b.co')).toBe(true);
    expect(isValidContactEmail(' a@b.co ')).toBe(true);
    for (const bad of ['', 'a@b', '@b.co', 'a@.co', 'a@b.', 'Ada <a@b.co>', 'a b@c.co']) {
      expect(isValidContactEmail(bad), bad).toBe(false);
    }
  });

  it('maps every API answer onto an outcome', () => {
    expect(contactOutcome(202, { reference: 'ABCDEFGHJKMN' })).toEqual({ kind: 'sent', reference: 'ABCDEFGHJKMN' });
    expect(contactOutcome(400, { error: 'invalid_contact', field: 'email' })).toEqual({ kind: 'invalid', field: 'email' });
    expect(contactOutcome(400, { error: 'invalid_contact', field: 'body' })).toEqual({ kind: 'failed' });
    expect(contactOutcome(503, { error: 'contact_unavailable' })).toEqual({ kind: 'unavailable' });
    expect(contactOutcome(429, { error: 'Too many requests.' })).toEqual({ kind: 'rate_limited' });
    expect(contactOutcome(502, { error: 'contact_send_failed' })).toEqual({ kind: 'failed' });
    expect(contactOutcome(202, null)).toEqual({ kind: 'failed' });
    expect(outcomeOk({ kind: 'sent', reference: 'x' })).toBe(true);
    expect(outcomeOk({ kind: 'unavailable' })).toBe(false);
  });

  it('posts the trimmed form with the session header and never throws', async () => {
    const fetchImpl = vi.fn(async () => new Response(JSON.stringify({ reference: 'R1' }), { status: 202 }));
    const out = await submitContact({ ...good, name: ' Ada ' }, { fetchImpl: fetchImpl as unknown as typeof fetch, sessionId: 's1' });
    expect(out).toEqual({ kind: 'sent', reference: 'R1' });
    const [url, init] = fetchImpl.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toMatch(/\/contact$/);
    expect((init.headers as Record<string, string>)['X-MM-Session-ID']).toBe('s1');
    expect(JSON.parse(init.body as string)).toEqual({ name: 'Ada', email: 'ada@example.com', subject: 'bug', message: 'It broke.', website: '' });
    const boom = vi.fn(async () => {
      throw new TypeError('network');
    });
    expect(await submitContact(good, { fetchImpl: boom as unknown as typeof fetch })).toEqual({ kind: 'failed' });
  });
});
