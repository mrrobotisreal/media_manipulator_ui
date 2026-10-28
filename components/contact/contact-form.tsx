'use client';

import React, { useId, useState } from 'react';

import { analytics, EVENTS, getSessionId } from '@/lib/analytics';
import {
  CONTACT_MAX_MESSAGE,
  CONTACT_MAX_NAME,
  CONTACT_SUBJECTS,
  SUPPORT_EMAIL,
  charCount,
  outcomeOk,
  submitContact,
  validateContact,
  type ContactField,
  type ContactForm as ContactFormValues,
  type ContactOutcome,
  type ContactSubject,
} from '@/lib/contact';

/**
 * MM85 contact form. All copy arrives as props from the server view (the `pages`
 * shard is server-only), so this island ships no translation bundle of its own.
 * On success it shows the API's reference; on any failure it keeps the typed text
 * and shows the support address as the fallback.
 */
export interface ContactFormLabels {
  title: string;
  name: string;
  email: string;
  emailHint: string;
  subject: string;
  subjects: Record<ContactSubject, string>;
  message: string;
  /** Contains {{count}} and {{max}}. */
  messageCount: string;
  honeypot: string;
  submit: string;
  sending: string;
  sentTitle: string;
  /** Contains {{reference}}. */
  sentBody: string;
  sendAnother: string;
  invalid: Record<ContactField, string>;
  /** Contains {{email}}. */
  rateLimited: string;
  /** Contains {{email}}. */
  failed: string;
}

const EMPTY: ContactFormValues = { name: '', email: '', subject: '', message: '', website: '' };

const fill = (s: string, values: Record<string, string | number>) =>
  s.replace(/\{\{\s*(\w+)\s*\}\}/g, (m, k: string) => (k in values ? String(values[k]) : m));

const inputClass =
  'w-full min-h-[44px] rounded-md border border-input bg-input px-3 py-2 text-card-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring aria-[invalid=true]:border-destructive';

export default function ContactForm({ labels }: { labels: ContactFormLabels }) {
  const id = useId();
  const [form, setForm] = useState<ContactFormValues>(EMPTY);
  const [busy, setBusy] = useState(false);
  const [invalid, setInvalid] = useState<ContactField | null>(null);
  const [outcome, setOutcome] = useState<ContactOutcome | null>(null);

  const set = <K extends keyof ContactFormValues>(key: K) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm((f) => ({ ...f, [key]: e.target.value }));
      if (invalid === key) setInvalid(null);
    };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    const bad = form.website ? null : validateContact(form);
    if (bad) {
      setInvalid(bad);
      setOutcome(null);
      return;
    }
    setBusy(true);
    setOutcome(null);
    let sessionId: string | undefined;
    try {
      sessionId = getSessionId();
    } catch {
      sessionId = undefined;
    }
    const result = await submitContact(form, { sessionId });
    setBusy(false);
    if (result.kind === 'invalid') setInvalid(result.field);
    setOutcome(result);
    // Never the name, address or message: the subject and whether it went through.
    if (form.subject && !form.website) {
      analytics.track(EVENTS.CONTACT_SUBMITTED, { subject: form.subject, ok: outcomeOk(result) }, { feature: 'contact' });
    }
    if (result.kind === 'sent') setForm(EMPTY);
  };

  if (outcome?.kind === 'sent') {
    return (
      <div role="status" data-testid="contact-sent" className="rounded-lg border border-edge bg-surface-2/40 p-5">
        <h3 className="text-lg font-semibold text-card-foreground">{labels.sentTitle}</h3>
        <p className="mt-2 text-muted-foreground">
          {fill(labels.sentBody, { reference: outcome.reference })}
        </p>
        <button
          type="button"
          onClick={() => setOutcome(null)}
          className="mt-4 min-h-[44px] rounded-md border border-edge px-4 py-2 text-sm font-medium text-card-foreground hover:bg-surface-2"
        >
          {labels.sendAnother}
        </button>
      </div>
    );
  }

  const fallback =
    outcome && outcome.kind !== 'invalid'
      ? fill(outcome.kind === 'rate_limited' ? labels.rateLimited : labels.failed, { email: SUPPORT_EMAIL })
      : null;
  const fid = (k: string) => `${id}-${k}`;
  const errorFor = (k: ContactField) =>
    invalid === k ? (
      <p id={fid(`${k}-error`)} className="mt-1 text-sm text-destructive">
        {labels.invalid[k]}
      </p>
    ) : null;
  const described = (k: ContactField, extra?: string) =>
    [invalid === k ? fid(`${k}-error`) : '', extra ?? ''].filter(Boolean).join(' ') || undefined;

  return (
    <form onSubmit={onSubmit} noValidate data-testid="contact-form" className="space-y-4" aria-busy={busy}>
      <div>
        <label htmlFor={fid('name')} className="mb-1 block text-sm font-medium text-card-foreground">
          {labels.name}
        </label>
        <input
          id={fid('name')}
          name="name"
          autoComplete="name"
          maxLength={CONTACT_MAX_NAME}
          value={form.name}
          onChange={set('name')}
          aria-invalid={invalid === 'name'}
          aria-describedby={described('name')}
          className={inputClass}
          required
        />
        {errorFor('name')}
      </div>
      <div>
        <label htmlFor={fid('email')} className="mb-1 block text-sm font-medium text-card-foreground">
          {labels.email}
        </label>
        <input
          id={fid('email')}
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          dir="ltr"
          value={form.email}
          onChange={set('email')}
          aria-invalid={invalid === 'email'}
          aria-describedby={described('email', fid('email-hint'))}
          className={inputClass}
          required
        />
        <p id={fid('email-hint')} className="mt-1 text-xs text-muted-foreground">
          {labels.emailHint}
        </p>
        {errorFor('email')}
      </div>
      <div>
        <label htmlFor={fid('subject')} className="mb-1 block text-sm font-medium text-card-foreground">
          {labels.subject}
        </label>
        <select
          id={fid('subject')}
          name="subject"
          value={form.subject}
          onChange={set('subject')}
          aria-invalid={invalid === 'subject'}
          aria-describedby={described('subject')}
          className={inputClass}
          required
        >
          <option value="" disabled>
            {labels.subject}
          </option>
          {CONTACT_SUBJECTS.map((s) => (
            <option key={s} value={s}>
              {labels.subjects[s]}
            </option>
          ))}
        </select>
        {errorFor('subject')}
      </div>
      <div>
        <label htmlFor={fid('message')} className="mb-1 block text-sm font-medium text-card-foreground">
          {labels.message}
        </label>
        <textarea
          id={fid('message')}
          name="message"
          rows={7}
          maxLength={CONTACT_MAX_MESSAGE}
          value={form.message}
          onChange={set('message')}
          aria-invalid={invalid === 'message'}
          aria-describedby={described('message', fid('message-count'))}
          className={`${inputClass} min-h-[160px]`}
          required
        />
        <p id={fid('message-count')} className="num mt-1 text-xs text-muted-foreground">
          {fill(labels.messageCount, { count: charCount(form.message), max: CONTACT_MAX_MESSAGE })}
        </p>
        {errorFor('message')}
      </div>
      {/* Honeypot: off-screen, out of the tab order and hidden from assistive tech. */}
      <div aria-hidden="true" className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden">
        <label htmlFor={fid('website')}>{labels.honeypot}</label>
        <input id={fid('website')} name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={set('website')} />
      </div>
      {fallback ? (
        <p role="alert" data-testid="contact-fallback" className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-card-foreground">
          {fallback}{' '}
          <a href={`mailto:${SUPPORT_EMAIL}`} className="text-primary underline underline-offset-2">
            {SUPPORT_EMAIL}
          </a>
        </p>
      ) : null}
      <button
        type="submit"
        disabled={busy}
        className="min-h-[44px] rounded-md bg-primary px-6 py-2 font-medium text-primary-foreground transition-colors hover:bg-[var(--accent-primary-hover)] disabled:opacity-60"
      >
        {busy ? labels.sending : labels.submit}
      </button>
    </form>
  );
}
