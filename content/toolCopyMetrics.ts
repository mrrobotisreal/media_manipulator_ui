/**
 * MM84: how tool-page copy is measured. Used by content/toolCopy.test.ts (the
 * permanent duplication gate) and nothing at runtime.
 *
 * "Prose" is what ToolLandingPage renders as text for a page: tagline, intro,
 * every list section, the worked examples, "When not to use this", the privacy
 * note and the FAQ. An alias page (aliasOf) renders only its tagline and intro.
 * A sentence is "unique" to a page when no other tool page renders the same
 * sentence (case and whitespace folded).
 */
import { RETENTION_PROMISE } from '@/content/retentionPromise';
import type { ToolPageContent } from '@/content/toolPages';

export function proseBlocks(t: ToolPageContent): string[] {
  if (t.aliasOf) return [t.tagline, t.intro].filter((s) => s.trim().length > 0);
  return [
    t.tagline,
    t.intro,
    ...t.whatItDoes,
    ...t.flowSteps.flatMap((s) => [s.title, s.description ?? '']),
    ...(t.advancedDetails ?? []),
    ...t.whyItMatters,
    ...t.useCases.flatMap((u) => [u.title, u.description]),
    ...(t.workedExamples ?? []).flatMap((e) => [e.title, e.body]),
    t.whenNotToUse ?? '',
    ...t.whyMediaManipulator,
    t.privacyNote,
    ...t.faq.flatMap((f) => [f.question, f.answer]),
    ...(t.supportedFormats?.maxFileNotes ?? []),
    ...(t.supportedFormats?.processingNotes ?? []),
  ].filter((s) => s.trim().length > 0);
}

export const words = (s: string): string[] => s.split(/\s+/).filter((w) => /[A-Za-z0-9]/.test(w));

export const norm = (s: string): string =>
  s
    .toLowerCase()
    .replace(/[‘’]/g, "'")
    .replace(/[\s ]+/g, ' ')
    .replace(/[.!?:;,\s]+$/, '')
    .trim();

/** Sentences of a block: split after . ! ? when the next sentence starts with a capital, digit or quote. */
export function sentences(block: string): string[] {
  return block
    .split(/(?<=[.!?])\s+(?=["'“(A-Z0-9])/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * Sentences every page may share by decision: the retention promise (MM26,
 * quoted verbatim wherever retention is mentioned) and the per-category
 * privacy template lines of decision 2(a). Anything else of six words or more
 * may appear on at most four pages.
 */
export function exemptSentences(templateLines: readonly string[] = []): Set<string> {
  return new Set([norm(RETENTION_PROMISE), ...templateLines.flatMap(sentences).map(norm)]);
}

export type SentenceIndex = Map<string, Set<string>>;

export function sentenceIndex(pages: readonly ToolPageContent[]): SentenceIndex {
  const idx: SentenceIndex = new Map();
  for (const t of pages) {
    for (const s of proseBlocks(t).flatMap(sentences)) {
      const k = norm(s);
      if (!k) continue;
      if (!idx.has(k)) idx.set(k, new Set());
      idx.get(k)!.add(t.slug);
    }
  }
  return idx;
}

export function pageWords(t: ToolPageContent, idx: SentenceIndex): { total: number; unique: number } {
  const blocks = proseBlocks(t);
  const total = blocks.reduce((n, b) => n + words(b).length, 0);
  let unique = 0;
  for (const s of blocks.flatMap(sentences)) {
    if ((idx.get(norm(s))?.size ?? 0) <= 1) unique += words(s).length;
  }
  return { total, unique };
}

function groupBy(entries: Array<[slug: string, text: string]>): Map<string, Set<string>> {
  const m = new Map<string, Set<string>>();
  for (const [slug, text] of entries) {
    const k = norm(text);
    if (!m.has(k)) m.set(k, new Set());
    m.get(k)!.add(slug);
  }
  return m;
}

export interface DuplicationReport {
  /** privacyNote texts rendered on more than one page. */
  sharedPrivacyNotes: Array<{ text: string; slugs: string[] }>;
  /** FAQ answers rendered on more than two pages. */
  sharedFaqAnswers: Array<{ text: string; slugs: string[] }>;
  /** Non-exempt sentences of six or more words rendered on more than four pages. */
  sharedSentences: Array<{ text: string; slugs: string[] }>;
}

/** The three site-wide duplication measures of MM84 S3, over rendered (non-alias) pages. */
export function duplication(pages: readonly ToolPageContent[], exempt: Set<string>): DuplicationReport {
  const rendered = pages.filter((t) => !t.aliasOf);
  const list = (m: Map<string, Set<string>>, min: number) =>
    [...m.entries()].filter(([, s]) => s.size > min).map(([text, s]) => ({ text, slugs: [...s].sort() }));
  const idx = sentenceIndex(pages);
  return {
    sharedPrivacyNotes: list(groupBy(rendered.map((t) => [t.slug, t.privacyNote])), 1),
    sharedFaqAnswers: list(groupBy(rendered.flatMap((t) => t.faq.map((f) => [t.slug, f.answer] as [string, string]))), 2),
    sharedSentences: [...idx.entries()]
      .filter(([k, s]) => words(k).length >= 6 && s.size > 4 && !exempt.has(k))
      .map(([text, s]) => ({ text, slugs: [...s].sort() })),
  };
}

/** Copy-bar problems of one page (decision 1); empty when the page meets the bar. */
export function copyBarProblems(
  t: ToolPageContent,
  pages: readonly ToolPageContent[],
  idx: SentenceIndex,
  copyBarSlugs: readonly string[],
): string[] {
  const out: string[] = [];
  const { total, unique } = pageWords(t, idx);
  if (total < 900) out.push(`${total} words (< 900)`);
  if (unique < 700) out.push(`${unique} unique words (< 700)`);
  if (pages.some((p) => p.slug !== t.slug && norm(p.privacyNote) === norm(t.privacyNote))) {
    out.push('privacyNote is shared with another page');
  }
  if (t.faq.length < 6 || t.faq.length > 8) out.push(`${t.faq.length} FAQ entries (want 6-8)`);
  const otherQuestions = new Set(
    pages.filter((p) => p.slug !== t.slug && !p.aliasOf).flatMap((p) => p.faq.map((f) => norm(f.question))),
  );
  const sharedQs = t.faq.filter((f) => otherQuestions.has(norm(f.question)));
  if (sharedQs.length > 1) out.push(`${sharedQs.length} FAQ questions shared with other pages (max 1): ${sharedQs.map((f) => f.question).join(' | ')}`);
  const otherAnswers = new Set(
    pages.filter((p) => p.slug !== t.slug).flatMap((p) => p.faq.map((f) => norm(f.answer))),
  );
  for (const f of t.faq) if (otherAnswers.has(norm(f.answer))) out.push(`FAQ answer shared with another page: ${f.question}`);
  if ((t.workedExamples ?? []).length !== 2) out.push(`${(t.workedExamples ?? []).length} worked examples (want 2)`);
  for (const e of t.workedExamples ?? []) {
    if (!/\d/.test(e.body)) out.push(`worked example without numbers: ${e.title}`);
  }
  if (!t.whenNotToUse || words(t.whenNotToUse).length < 25) out.push('missing or thin "When not to use this" paragraph');
  if (!t.advancedDetails || t.advancedDetails.length < 3) out.push('advancedDetails has fewer than 3 items');
  const toolLinks = t.related.filter((r) => r.to.startsWith('/tools/'));
  if (t.related.length < 4 || t.related.length > 6) out.push(`${t.related.length} related links (want 4-6)`);
  for (const r of toolLinks) {
    const slug = r.to.replace(/^\/tools\//, '');
    if (!copyBarSlugs.includes(slug)) out.push(`related link outside the copy-bar set: ${r.to}`);
  }
  if (/free, online, no signup/i.test(proseBlocks(t).join(' '))) out.push('contains "Free, online, no signup."');
  return out;
}
