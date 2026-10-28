import type { SummaryChapter, SummaryOnScreenText, VideoSummary } from '@/lib/summarizeTypes';

/**
 * Pure helpers for the MM74 `summary.json` result: a defensive parser and the Markdown
 * renderer behind "Copy as Markdown".
 *
 * THE MARKDOWN IS A CONTRACT (design/VIDEO_SUMMARY.md §9 item 12). `renderSummaryMarkdown`
 * mirrors the API's `services.RenderSummaryMarkdown` byte for byte, so the copied text equals
 * the server's `summary.md`. The fixture pair in `lib/results/fixtures/` is a copy of the API's
 * `internal/services/testdata/video_summary/summary.{json,md}`; summary.test.ts proves the
 * round trip. Change one side only together with the other.
 */

const str = (v: unknown): string => (typeof v === 'string' ? v : '');

/** Seconds from a number or a numeric/clock string ("1:05", "0:01:05"); NaN when unusable. */
export function toSeconds(v: unknown): number {
  if (typeof v === 'number') return Number.isFinite(v) ? v : NaN;
  if (typeof v !== 'string') return NaN;
  const s = v.trim();
  if (!s) return NaN;
  if (/^\d+(\.\d+)?$/.test(s)) return Number(s);
  const m = /^(?:(\d+):)?(\d{1,2}):(\d{2})(?:\.(\d+))?$/.exec(s);
  if (!m) return NaN;
  return (Number(m[1] ?? 0) * 60 + Number(m[2])) * 60 + Number(m[3]) + (m[4] ? Number(`0.${m[4]}`) : 0);
}

function strings(v: unknown): string[] {
  if (typeof v === 'string') return v.trim() ? [v.trim()] : [];
  if (!Array.isArray(v)) return [];
  return v.filter((x): x is string => typeof x === 'string' && x.trim() !== '').map((x) => x.trim());
}

function chapters(v: unknown): SummaryChapter[] {
  if (!Array.isArray(v)) return [];
  const out: SummaryChapter[] = [];
  for (const c of v) {
    if (!c || typeof c !== 'object') continue;
    const o = c as Record<string, unknown>;
    const start = toSeconds(o.start);
    if (!Number.isFinite(start)) continue;
    const end = toSeconds(o.end);
    out.push({
      start,
      end: Number.isFinite(end) && end >= start ? end : start,
      title: str(o.title).trim(),
      description: str(o.description).trim(),
    });
  }
  return out;
}

function onScreen(v: unknown): SummaryOnScreenText[] {
  if (!Array.isArray(v)) return [];
  const out: SummaryOnScreenText[] = [];
  for (const item of v) {
    if (typeof item === 'string') {
      if (item.trim()) out.push({ text: item, firstSeen: 0 });
      continue;
    }
    if (!item || typeof item !== 'object') continue;
    const o = item as Record<string, unknown>;
    const text = str(o.text);
    if (!text.trim()) continue;
    const t = toSeconds(o.firstSeen);
    out.push({ text, firstSeen: Number.isFinite(t) ? t : 0 });
  }
  return out;
}

/**
 * Normalises whatever the result route returned into a VideoSummary. Missing or malformed
 * fields become empty values, never a throw: the viewer renders what exists. Returns null only
 * when the input is not an object at all.
 */
export function parseSummary(raw: unknown): VideoSummary | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
  const o = raw as Record<string, unknown>;
  return {
    title: str(o.title).trim(),
    summary: str(o.summary).trim(),
    chapters: chapters(o.chapters),
    topics: strings(o.topics),
    onScreenText: onScreen(o.onScreenText),
    visual: str(o.visual).trim(),
    speech: str(o.speech).trim(),
    language: str(o.language).trim(),
    caveats: strings(o.caveats),
  };
}

/** m:ss, or h:mm:ss from one hour: the API's `services.FormatClock`. */
export function formatClock(sec: number): string {
  const s = !Number.isFinite(sec) || sec < 0 ? 0 : sec;
  const total = Math.floor(s + 1e-6);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const r = total % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  return h > 0 ? `${h}:${pad(m)}:${pad(r)}` : `${m}:${pad(r)}`;
}

/**
 * summary.md from a summary, exactly as the API writes it: `# title`, the summary paragraph,
 * `## Chapters` (`- **m:ss–m:ss · Title**: description`), `## Topics` joined with ` · `,
 * `## On-screen text` (`- m:ss: text`), `## Visual`, `## Speech`, `## Notes` (caveats); empty
 * sections omitted, one blank line between sections, one trailing newline.
 */
export function renderSummaryMarkdown(s: VideoSummary): string {
  const sections: string[] = [`# ${s.title.trim() || 'Summary'}`];
  if (s.summary.trim()) sections.push(s.summary.trim());
  if (s.chapters.length > 0) {
    const lines = s.chapters.map((ch) => {
      const head = `- **${formatClock(ch.start)}–${formatClock(ch.end)} · ${ch.title.trim()}**`;
      const d = ch.description.trim();
      return d ? `${head}: ${d}` : head;
    });
    sections.push(`## Chapters\n\n${lines.join('\n')}`);
  }
  if (s.topics.length > 0) sections.push(`## Topics\n\n${s.topics.join(' · ')}`);
  if (s.onScreenText.length > 0) {
    sections.push(`## On-screen text\n\n${s.onScreenText.map((o) => `- ${formatClock(o.firstSeen)}: ${o.text}`).join('\n')}`);
  }
  if (s.visual.trim()) sections.push(`## Visual\n\n${s.visual.trim()}`);
  if (s.speech.trim()) sections.push(`## Speech\n\n${s.speech.trim()}`);
  if (s.caveats.length > 0) sections.push(`## Notes\n\n${s.caveats.map((c) => `- ${c}`).join('\n')}`);
  return `${sections.join('\n\n')}\n`;
}

/**
 * Account History row label for a summary job (MM75 decision 5): the summary's title, else the
 * result file name, else the tool label. Pure so the rule is tested where it lives.
 */
export function summaryHistoryLabel(title: string | null | undefined, resultFileName: string | undefined, toolLabel: string): string {
  const t = (title ?? '').trim();
  if (t) return t;
  return resultFileName || toolLabel;
}
