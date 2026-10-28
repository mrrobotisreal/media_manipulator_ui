import React from 'react';

/**
 * MM87: legal copy carries absolute URLs inside translated strings (Google's opt-out and
 * "partner sites" pages, ads.txt), so they stay byte-identical across the 18 locales.
 * This renders each `https://…` run as a real link. A URL is ASCII only, so text in
 * scripts without spaces (日本語, 中文) that follows it stays outside; trailing ASCII
 * sentence punctuation (".", ",", ";", ":", "!", "?") is left outside the link too.
 */
const URL_RE = /https:\/\/[A-Za-z0-9\-._~/?#@!$&*+,;=%:]+/g;
const TRAILING = /[.,;:!?]+$/;

export const LEGAL_LINK_CLASS =
  'text-primary underline decoration-primary/40 underline-offset-2 hover:text-[var(--accent-primary-hover)] hover:decoration-primary';

export function linkifyLegal(text: string): React.ReactNode {
  if (!text.includes('https://')) return text;
  const out: React.ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(URL_RE)) {
    const raw = m[0];
    const url = raw.replace(TRAILING, '');
    const start = m.index ?? 0;
    if (start > last) out.push(text.slice(last, start));
    out.push(
      <a key={start} href={url} target="_blank" rel="noopener noreferrer" className={LEGAL_LINK_CLASS}>
        {url}
      </a>,
    );
    last = start + url.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}
