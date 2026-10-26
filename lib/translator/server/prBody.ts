/**
 * Pull request title, body, branch name and commit message for a translator
 * submit (MM54 decisions 6k, 7, 13; design §2.14).
 *
 * Everything the translator typed is escaped as markdown TEXT: HTML-significant
 * characters become entities, markdown punctuation is backslash-escaped, and
 * `@`, `#<digit>`, `://` and `www.` get a WORD JOINER (U+2060), so a description
 * can never @-mention anyone, reference issues or become a link. Table cells also escape `|` and turn
 * newlines into `<br>`. The body never contains an email, a token or env values:
 * the submitter is the first 8 chars of the Firebase uid (proposed in the
 * ticket, adopted).
 */
import type { SubmitConflict, SubmitWarning } from '../submitContract';

export const PR_ASSIGNEE = 'mrrobotisreal';
export const LABEL_TRANSLATION = { name: 'translation', color: '0e8a16', description: 'Translator workbench submission' };
export const localeLabel = (prefix: string) => ({
  name: `locale:${prefix}`,
  color: '1d76db',
  description: `Translation for the ${prefix} locale`,
});

/** GitHub's PR body limit is 65,536 chars; stay well under it. */
export const BODY_BUDGET = 60_000;
export const TABLE_ROW_CAP = 200;
export const CELL_CHARS = 120;
export const TITLE_HEAD_CHARS = 60;

const WJ = '⁠';
const CONTROL = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g;

/** Markdown-safe inline text (no structure can escape it). */
export function mdText(input: string): string {
  return input
    .replace(CONTROL, '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/([\\`*_{}[\]()#+!|~=-])/g, '\\$1')
    .replace(/@/g, `@${WJ}`)
    .replace(/#(?=\d)/g, `#${WJ}`)
    // No autolinks either (GFM links bare `https://…` and `www.…`).
    .replace(/:\/\//g, `:/${WJ}/`)
    .replace(/\bwww\./gi, (m) => `${m.slice(0, 3)}${WJ}.`);
}

function truncate(s: string, n: number): string {
  const chars = [...s];
  return chars.length > n ? `${chars.slice(0, n).join('')}…` : s;
}

/** A table cell: escaped, single line, truncated. */
export function mdCell(input: string, max = CELL_CHARS): string {
  const one = truncate(input, max).replace(/\r\n?/g, '\n');
  return one
    .split('\n')
    .map((line) => mdText(line))
    .join('<br>');
}

/** The description verbatim, as an escaped blockquote (line breaks kept). */
export function mdQuote(input: string): string {
  return input
    .replace(/\r\n?/g, '\n')
    .split('\n')
    .map((line) => (line.trim() ? `> ${mdText(line)}` : '>'))
    .join('  \n');
}

export function descriptionHead(description: string): string {
  const first = description.replace(CONTROL, '').split(/\r?\n/).find((l) => l.trim()) ?? '';
  const collapsed = first.replace(/\s+/g, ' ').trim();
  const chars = [...collapsed];
  return chars.length > TITLE_HEAD_CHARS ? `${chars.slice(0, TITLE_HEAD_CHARS - 1).join('').trimEnd()}…` : collapsed;
}

export function prTitle(prefix: string, description: string): string {
  return `i18n(${prefix}): ${descriptionHead(description)}`;
}

/** kebab-case of the first 6 words, ASCII-folded, <= 40 chars; 'update' when nothing survives. */
export function slugify(description: string): string {
  const words = description
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 6)
    .join(' ');
  const slug = words
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40)
    .replace(/-+$/g, '');
  return slug || 'update';
}

export const BRANCH_RE = /^i18n\/[a-z-]+\/[0-9]{8}-[0-9]{4}-[a-z0-9-]*$/;

/** `i18n/<prefix>/<yyyymmdd-hhmm>-<slug>[-n]` (UTC). Throws if it does not match BRANCH_RE. */
export function branchName(prefix: string, description: string, now: Date, attempt = 1): string {
  const p = (n: number) => String(n).padStart(2, '0');
  const stamp = `${now.getUTCFullYear()}${p(now.getUTCMonth() + 1)}${p(now.getUTCDate())}-${p(now.getUTCHours())}${p(now.getUTCMinutes())}`;
  const name = `i18n/${prefix}/${stamp}-${slugify(description)}${attempt > 1 ? `-${attempt}` : ''}`;
  if (!BRANCH_RE.test(name)) throw new Error('computed branch name is invalid');
  return name;
}

/** First 8 chars of the uid, alphanumerics only (attribution without personal data). */
export function shortUid(uid: string): string {
  return uid.replace(/[^A-Za-z0-9]/g, '').slice(0, 8) || 'unknown';
}

export interface PrChangeRow {
  file: string;
  key: string;
  old: string;
  value: string;
  isNew: boolean;
  seenOn: string[];
}

export interface PrBodyInput {
  prefix: string;
  description: string;
  rows: PrChangeRow[];
  /** `https://<prefix>.translate.media-manipulator.com` */
  origin: string;
  conflicts: SubmitConflict[];
  warnings: SubmitWarning[];
  uid: string;
}

export function prBody(input: PrBodyInput): string {
  const parts: string[] = [];
  parts.push(mdQuote(input.description));

  // ### Changes
  const head = '### Changes\n\n| File | Key | Old | New |\n| --- | --- | --- | --- |';
  const lines: string[] = [];
  let budget = BODY_BUDGET - 4000; // leave room for the other sections
  let shown = 0;
  for (const r of input.rows) {
    if (shown >= TABLE_ROW_CAP) break;
    const file = r.file.replace(/^i18n\/locales\/[^/]+\//, '');
    const line = `| ${mdCell(file)} | ${mdCell(r.key)} | ${r.isNew ? '_(new key)_' : mdCell(r.old)} | ${mdCell(r.value)} |`;
    if (budget - line.length < 0) break;
    budget -= line.length + 1;
    lines.push(line);
    shown++;
  }
  const more = input.rows.length - shown;
  parts.push(`${head}\n${lines.join('\n')}${more > 0 ? `\n\n…and ${more} more (the full list is in the diff).` : ''}`);

  // ### Pages
  const pageLines: string[] = [];
  let pageBudget = 3000;
  for (const r of input.rows) {
    if (!r.seenOn.length) continue;
    const line = `- ${mdText(r.key)}: ${r.seenOn.map((p) => `<${input.origin}${p}>`).join(', ')}`;
    if (pageBudget - line.length < 0) {
      pageLines.push('- …');
      break;
    }
    pageBudget -= line.length;
    pageLines.push(line);
  }
  parts.push(`### Pages\n\n${pageLines.length ? pageLines.join('\n') : '_No page recorded for these keys._'}`);

  if (input.conflicts.length) {
    const rows = input.conflicts
      .slice(0, 100)
      .map((c) => `| ${mdCell(c.key)} | ${mdCell(c.base)} | ${c.theirs === null ? '_(removed)_' : mdCell(c.theirs)} | ${mdCell(c.mine)} |`);
    parts.push(
      `### Upstream conflicts resolved\n\nThese keys changed on the base branch after the translator started; the translator chose to keep their version.\n\n| Key | Base | Main | Kept (translator) |\n| --- | --- | --- | --- |\n${rows.join('\n')}`,
    );
  }

  if (input.warnings.length) {
    const ws = input.warnings.slice(0, 200).map((w) => `- ${mdText(w.code)}: ${mdText(w.key)}`);
    if (input.warnings.length > 200) ws.push(`- …and ${input.warnings.length - 200} more`);
    parts.push(`### Validator warnings acknowledged\n\n${ws.join('\n')}`);
  }

  parts.push(
    `---\nSubmitted by translator ${shortUid(input.uid)} (Firebase uid prefix) via the Media Manipulator translator workbench (${mdText(input.prefix)}).`,
  );
  const body = parts.join('\n\n');
  return body.length > 65_000 ? `${body.slice(0, 64_000)}\n\n…(truncated)` : body;
}

export function commitMessage(prefix: string, description: string, changed: number, files: number, uid: string): string {
  return `${prTitle(prefix, description)}\n\n${changed} key${changed === 1 ? '' : 's'} in ${files} file${files === 1 ? '' : 's'}, submitted via the translator workbench.\nTranslator: ${shortUid(uid)}`;
}
