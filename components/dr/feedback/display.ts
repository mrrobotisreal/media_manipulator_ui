// Display helpers shared across the feedback UI. Names are derived client-side
// from the email local-part (e.g. "mitch@…" → "mitch") — the portal stores no
// display names (§3.2).

import type { DrMessageContent } from '@/schemas/drFeedback';

export function displayNameFromEmail(email: string): string {
  const local = (email.split('@')[0] ?? '').trim();
  return local || email;
}

export function avatarInitial(email: string): string {
  const name = displayNameFromEmail(email);
  return (name.trim()[0] ?? '?').toUpperCase();
}

// Human-readable byte size (e.g. "3.2 MB", "812 KB"). Mirrors the doc renderer's
// formatBytes so file cards look identical across the portal.
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb < 10 ? kb.toFixed(1) : Math.round(kb)} KB`;
  const mb = kb / 1024;
  return `${mb < 10 ? mb.toFixed(1) : Math.round(mb)} MB`;
}

// Flatten a message's content to a single-line plain-text preview (for thread
// cards). Whitespace is collapsed; formatting is dropped.
export function messagePlainText(content: DrMessageContent): string {
  const parts: string[] = [];
  for (const b of content.blocks) {
    if (b.type === 'paragraph') parts.push(b.spans.map((s) => s.text).join(''));
    else if (b.type === 'blockquote') parts.push(b.lines.map((l) => l.map((s) => s.text).join('')).join(' '));
    else if (b.type === 'list') parts.push(b.items.map((l) => l.map((s) => s.text).join('')).join(' '));
    else if (b.type === 'code') parts.push(b.code);
  }
  return parts.join(' ').replace(/\s+/g, ' ').trim();
}
