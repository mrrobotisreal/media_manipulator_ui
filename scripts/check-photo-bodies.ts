/**
 * MM100: checks the Aperture page bodies in content/photo/pages-*.ts against the
 * MM84 copy bar and the duplication limits, together with every existing tool page.
 * Run: npx tsx scripts/check-photo-bodies.ts [file ...]   (default: all pages-*.ts)
 */
import { readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { TOOL_PAGES, type ToolPageContent } from '@/content/toolPages';
import { REVIEW_CATALOG_SLUGS } from '@/content/reviewAllowlist';
import { PRIVACY_TEMPLATES } from '@/content/toolPrivacy';
import { copyBarProblems, duplication, exemptSentences, pageWords, sentenceIndex } from '@/content/toolCopyMetrics';

async function main() {
  const dir = join(process.cwd(), 'content', 'photo');
  const files = process.argv.slice(2).length ? process.argv.slice(2) : readdirSync(dir).filter((f) => /^pages-.*\.ts$/.test(f)).map((f) => join(dir, f));
  const bodies: ToolPageContent[] = [];
  for (const f of files) {
    const mod = (await import(resolve(process.cwd(), f))) as { default?: unknown; PAGES?: unknown };
    const list = (mod.default ?? mod.PAGES) as ToolPageContent[];
    for (const b of list) bodies.push({ ...b, category: 'photo' } as ToolPageContent);
  }
  const existing = TOOL_PAGES.filter((t) => !bodies.some((b) => b.slug === t.slug));
  const all = [...existing, ...bodies];
  const slugs = [...REVIEW_CATALOG_SLUGS, ...bodies.map((b) => b.slug)];
  const idx = sentenceIndex(all);
  let bad = 0;
  for (const b of bodies) {
    const { total, unique } = pageWords(b, idx);
    const problems = copyBarProblems(b, all, idx, slugs);
    console.log(`${b.slug.padEnd(28)} words ${String(total).padStart(5)} unique ${String(unique).padStart(5)} faq ${b.faq.length} related ${b.related.length}${problems.length ? '\n   - ' + problems.join('\n   - ') : ''}`);
    bad += problems.length;
  }
  const d = duplication(all, exemptSentences(Object.values(PRIVACY_TEMPLATES)));
  const mine = (slugList: string[]) => slugList.some((s) => bodies.some((b) => b.slug === s));
  for (const x of d.sharedSentences.filter((x) => mine(x.slugs))) { console.log('SHARED SENTENCE', x.slugs.join(','), '::', x.text); bad++; }
  for (const x of d.sharedFaqAnswers.filter((x) => mine(x.slugs))) { console.log('SHARED FAQ ANSWER', x.slugs.join(','), '::', x.text.slice(0, 80)); bad++; }
  for (const x of d.sharedPrivacyNotes.filter((x) => mine(x.slugs))) { console.log('SHARED PRIVACY', x.slugs.join(',')); bad++; }
  console.log(bad ? `${bad} problem(s)` : `OK: ${bodies.length} page(s)`);
  process.exit(bad ? 1 : 0);
}
void main();
