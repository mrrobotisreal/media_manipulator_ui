/**
 * MM86 per-locale checker for the 24 copy-bar tool bodies (the MM68-style
 * checks for a locale's `i18n/locales/<dir>/toolPages.ts`).
 * Run from the repo root:  npx tsx scripts/check-tool-bodies.ts <locale-code> [--words] [--all]
 * Used by MM86 (uk, ru, de) and by the per-locale follow-ups `MM86-<prefix>`.
 * MM93: `--all` checks every non-alias tool page (98), not only the 24 copy-bar
 * slugs; a locale is done for MM93 when it ends `98/98 … 0 problem(s)`.
 * Reports, per slug: coverage (localeBodyCoverage), then for every translated
 * string vs its English source: digit runs (multiset), brand names
 * (Media Manipulator, Darkroom, Motion), {{placeholders}}, <tags>/<placeholders>,
 * backticked code, related `to` order, strings left identical to English, and
 * (de) common English words. Exit 1 when anything fails.
 */
import { TOOL_PAGES } from '@/content/toolPages';
import { REVIEW_CATALOG_SLUGS } from '@/content/reviewAllowlist';
import { localeBodyCoverage, getLocalizedToolBySlug } from '@/i18n/toolPageContent';
/* eslint-disable @typescript-eslint/no-explicit-any -- a dev script walking untyped override objects */
import { toolPageOverrideModules } from '@/i18n/generated/toolPages.generated';

const locale = process.argv[2];
const showWords = process.argv.includes('--words');
const checkAll = process.argv.includes('--all');
const SLUGS: readonly string[] = checkAll ? TOOL_PAGES.filter((t) => !t.aliasOf).map((t) => t.slug) : REVIEW_CATALOG_SLUGS;
if (!locale) throw new Error('usage: check-locale.ts <locale>');
const mods = toolPageOverrideModules as Record<string, { pages: Record<string, any> }>;
const problems: string[] = [];
const fail = (slug: string, path: string, msg: string) => problems.push(`${slug} ${path}: ${msg}`);

/**
 * Digit runs, as a sorted multiset. Hebrew writes "2 years" with the dual noun
 * ("שנתיים"), so the 2 is spelled, not dropped: count the dual as a 2 (MM93).
 */
// A one-letter prefix (ל/ב/מ/ו/ה/כ/ש) may be attached: לשנתיים, בשעתיים.
const HE_DUAL = /(?<![\u0590-\u05ff]{2})(שנתיים|יומיים|שעתיים|חודשיים)(?![\u0590-\u05ff])/g;
const digits = (s: string) => (s.match(/\d+/g) ?? []).sort().join(' ');
/** Compare digit multisets; a Hebrew dual noun stands in for a "2" or a spelled "two" in the English. */
const digitsMatch = (en: string, tr: string) => {
  if (digits(en) === digits(tr)) return true;
  const duals = (tr.match(HE_DUAL) ?? []).length;
  if (!duals) return false;
  const enTwos = (en.match(/\b(2|two)\b/gi) ?? []).length;
  if (enTwos < duals) return false;
  // Drop one "2" from the English per dual, then the explicit digits must agree.
  const enDigits = (en.match(/\d+/g) ?? []).slice();
  let toDrop = Math.min(duals, enDigits.filter((d) => d === '2').length);
  const kept = enDigits.filter((d) => (d === '2' && toDrop > 0 ? (toDrop--, false) : true));
  return kept.sort().join(' ') === digits(tr);
};
/** A verbatim command line ("pdftoppm -r <dpi> …") has nothing to translate. */
const isCommandLine = (s: string) => /^[a-z][\w.-]*(\s+(-{1,2}[\w-]+|<[^>\s]+>|\[[^\]]*\]|[\w./<>=:|-]+))+$/.test(s.trim());
const count = (s: string, re: RegExp) => (s.match(re) ?? []).length;
const BRANDS = ['Media Manipulator', 'Darkroom', 'Motion'];
const tokens = (s: string, re: RegExp) => (s.match(re) ?? []).sort().join(' | ');
const EN_WORDS = /\b(the|and|with|your|you|this|that|which|from|when|into|is|are)\b/g;

/**
 * MM93: a string with nothing to translate (a format list "JPG, PNG, WebP",
 * "HTML5 <video>", "90°, 180°, 270°") may stay identical to English.
 */
const UNTRANSLATABLE_WORDS = new Set(['WebP', 'WebM', 'Opus', 'Lottie', 'Darkroom', 'Motion', 'Media', 'Manipulator', 'ffmpeg', 'ffprobe', 'exiftool']);
const untranslatable = (s: string) =>
  s
    .split(/[\s,;/]+/)
    .filter(Boolean)
    .every((w) => {
      const t = w.replace(/^[(\[]+|[.)\]:]+$/g, '');
      return t === '' || /^<\/?\w+>$/.test(t) || /^[A-Z0-9°+.\-×x]+$/.test(t) || UNTRANSLATABLE_WORDS.has(t);
    }) ||
  // A single capitalised word that is the same in the target language ("Transcription", "Audio", "Standard").
  /^[A-Z][a-z]+$/.test(s.trim());
/**
 * "Motion" is the brand only as a proper noun: not "slow motion", and not the
 * sentence-initial common noun ("Motion smoothness…", "Motion estimation…").
 */
const brandCount = (s: string, b: string) =>
  b === 'Motion'
    ? (s.match(/(?<!\b[Ss]low[- ])\bMotion\b(?! (?:smoothness|estimation|blur|vectors?|path|compensation|graphics|analysis|detection|tracking|data|interpolation)\b)/g) ?? []).length
    : (s.match(new RegExp(b, 'g')) ?? []).length;

function walk(slug: string, path: string, en: unknown, tr: unknown) {
  if (typeof en === 'string') {
    if (typeof tr !== 'string') return fail(slug, path, 'missing string');
    if (path.endsWith('.to')) {
      if (tr !== en) fail(slug, path, `related "to" changed: ${tr} (English ${en})`);
      return;
    }
    if (en.trim().length > 12 && tr === en && !untranslatable(en) && !isCommandLine(en)) fail(slug, path, 'identical to English');
    if (!digitsMatch(en, tr)) fail(slug, path, `digits differ: en [${digits(en)}] vs [${digits(tr)}]`);
    for (const b of BRANDS) {
      if (brandCount(en, b) > 0 && brandCount(tr, b) === 0) fail(slug, path, `brand "${b}" missing`);
    }
    if (tokens(en, /\{\{\w+\}\}/g) !== tokens(tr, /\{\{\w+\}\}/g)) fail(slug, path, 'placeholder {{…}} drift');
    if (tokens(en, /<\/?[A-Za-z][\w-]*>/g) !== tokens(tr, /<\/?[A-Za-z][\w-]*>/g)) fail(slug, path, `<…> token drift: en [${tokens(en, /<\/?[A-Za-z][\w-]*>/g)}] vs [${tokens(tr, /<\/?[A-Za-z][\w-]*>/g)}]`);
    if (/[а-яА-ЯіїєґІЇЄҐ]/.test(tr) === false && (locale === 'ru-RU' || locale === 'uk-UA') && en.split(/\s+/).length > 4 && !untranslatable(en)) fail(slug, path, 'no Cyrillic at all');
    if (locale === 'ru-RU' && /ё/.test(tr)) fail(slug, path, 'contains ё (house style: е)');
    if (locale === 'uk-UA' && /[ыэъё]/.test(tr)) fail(slug, path, 'Russian letter in Ukrainian');
    const latinWords = count(tr.replace(/`[^`]*`/g, ''), EN_WORDS);
    if (latinWords >= 3) fail(slug, path, `${latinWords} English function words (left in English?)`);
    return;
  }
  if (Array.isArray(en)) {
    if (!Array.isArray(tr)) return fail(slug, path, 'missing array');
    if (tr.length !== en.length) return fail(slug, path, `array length ${tr.length}, English ${en.length}`);
    en.forEach((v, i) => walk(slug, `${path}[${i}]`, v, tr[i]));
    return;
  }
  if (en && typeof en === 'object') {
    for (const [k, v] of Object.entries(en)) walk(slug, path ? `${path}.${k}` : k, v, (tr as any)?.[k]);
  }
}

let totalWords = 0;
const words = (v: unknown): number =>
  typeof v === 'string' ? v.split(/\s+/).filter(Boolean).length : Array.isArray(v) ? v.reduce((n, x) => n + words(x), 0) : v && typeof v === 'object' ? Object.entries(v).filter(([k]) => k !== 'to').reduce((n, [, x]) => n + words(x), 0) : 0;

let complete = 0;
for (const slug of SLUGS) {
  const enTool: any = TOOL_PAGES.find((t) => t.slug === slug)!;
  const o = mods[locale]?.pages?.[slug] ?? {};
  const cov = localeBodyCoverage(slug, locale);
  if (cov.complete) complete += 1;
  else fail(slug, '', `coverage incomplete, missing: ${cov.missing.join(', ')}`);
  for (const f of cov.required) {
    if (!(f in o)) continue;
    if (f === 'embed') walk(slug, 'embed', { title: enTool.embed.title, description: enTool.embed.description }, o.embed);
    else if (f === 'supportedFormats') {
      const sf: any = {};
      if (enTool.supportedFormats.maxFileNotes?.length) sf.maxFileNotes = enTool.supportedFormats.maxFileNotes;
      if (enTool.supportedFormats.processingNotes?.length) sf.processingNotes = enTool.supportedFormats.processingNotes;
      walk(slug, 'supportedFormats', sf, o.supportedFormats);
    } else if (f === 'name' && ['content-studio', 'motion'].includes(slug)) {
      // brand names stay as they are
    } else walk(slug, f, enTool[f], o[f]);
  }
  const loc = getLocalizedToolBySlug(slug, locale)!;
  const maxTitle = slug === 'motion' ? 75 : Math.max(75, enTool.metaTitle.length + 8);
  if (loc.metaTitle.length > maxTitle) fail(slug, 'metaTitle', `${loc.metaTitle.length} chars (max ${maxTitle})`);
  if (slug === 'motion' && loc.name !== 'Motion') fail(slug, 'name', 'must stay "Motion"');
  if (slug === 'content-studio' && loc.name !== 'Darkroom') fail(slug, 'name', 'must stay "Darkroom"');
  const w = words(o);
  totalWords += w;
  if (showWords) console.log(`${slug.padEnd(32)} ${w} words`);
}
console.log(`${locale}: ${complete}/${SLUGS.length} slugs fully covered; ${totalWords} words in the ${SLUGS.length} entries; ${problems.length} problem(s)`);
for (const p of problems.slice(0, 200)) console.log('  - ' + p);
if (problems.length > 200) console.log(`  … ${problems.length - 200} more`);
process.exit(problems.length ? 1 : 0);
