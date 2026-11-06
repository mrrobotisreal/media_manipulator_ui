/**
 * The Darkroom caption generator, TS half (MM121, ADR-0019). cues + style + canvas → the .ass text
 * libass draws: JASSUB in the editor preview, ffmpeg `subtitles=` at export. Its Go twin is
 * BuildASS in media_manipulator_api/internal/services/studio_captions_ass.go; both must
 * reproduce lib/studio/captions/goldens/*.ass byte for byte (ass.test.ts). Port changes line for
 * line and regenerate the goldens on the Go side; neither renderer may special-case an effect the
 * other lacks.
 */
import type { StudioCaptionCue, StudioCaptionStyle } from '@/lib/studioTypes';
import catalog from './captionsCatalog.json';
import { sanitizeCaptionStyle, sanitizeCaptionWords } from './sanitize';
import { captionFontByFamily, captionFontFor, captionSentenceEnd, captionUnits, captionUpper } from './units';

const D = catalog.defaults;

interface Resolved {
  family: string;
  bold: boolean;
  uppercase: boolean;
  fontSize: number;
  primary: string;
  outlineColor: string;
  primaryTag: string;
  highlightTag: string;
  highlight: string;
  outlinePx: number;
  shadowPx: number;
  boxPad: number;
  shadowColor: string;
  boxColor: string;
  bgMode: string;
  animation: string;
  wordsPerGroup: number;
  align: number;
  popScale: number;
  maxWidthPct: number;
}

/** Go's math.Round: half away from zero (JS Math.round rounds half up). */
function goRound(x: number): number {
  return x < 0 ? -Math.round(-x) : Math.sign(x) * Math.floor(Math.abs(x) + 0.5);
}
const roundCentis = (v: number) => goRound(v * 100) / 100;
const centis = (sec: number) => goRound(Math.max(sec, 0) * 100);
const clampInt = (v: number, lo: number, hi: number) => (v < lo ? lo : v > hi ? hi : v);
const intDiv = (a: number, b: number) => Math.trunc(a / b);

function parseHexRGB(hex: string): [number, number, number] {
  const h = hex.trim().replace(/^#/, '');
  if (h.length !== 6 || !/^[0-9a-fA-F]{6}$/.test(h)) return [255, 255, 255];
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}
const hex2 = (n: number) => n.toString(16).toUpperCase().padStart(2, '0');

/** &HAABBGGRR (AA 00 opaque .. FF transparent). Mirrors hexToASSColor. */
export function hexToASSColor(hex: string, opacity: number): string {
  const [r, g, b] = parseHexRGB(hex);
  const a = goRound((1 - Math.min(1, Math.max(0, opacity))) * 255);
  return `&H${hex2(a)}${hex2(b)}${hex2(g)}${hex2(r)}`;
}
const colorTag = (hex: string) => {
  const [r, g, b] = parseHexRGB(hex);
  return `&H${hex2(b)}${hex2(g)}${hex2(r)}&`;
};

/** At most two decimals, no trailing zeros (Go strconv 'f', -1 of a centi-rounded value). */
function assNum(v: number): string {
  return String(roundCentis(v));
}

function assCentis(cs: number): string {
  const c = Math.max(0, cs);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${intDiv(c, 360000)}:${pad(intDiv(c, 6000) % 60)}:${pad(intDiv(c, 100) % 60)}.${pad(c % 100)}`;
}

function assEscape(s: string): string {
  return s.replaceAll('{', '(').replaceAll('}', ')').replaceAll('\r\n', '\\N').replaceAll('\n', '\\N').replaceAll('\r', '\\N');
}

function assSep(sep: string): string {
  if (sep === '') return '';
  if (/[\n\r]/.test(sep)) return '\\N';
  return ' ';
}

function resolve(st0: StudioCaptionStyle | null, height: number): Resolved {
  const st: StudioCaptionStyle = st0 ?? {
    fontSizePct: 4.5, color: '#FFFFFF', backgroundColor: '#000000', backgroundOpacity: 0.55, position: 'bottom', maxWidthPct: 90,
  };
  const family = st.fontFamily || D.fontFamily;
  let bold = typeof st.bold === 'boolean' ? st.bold : D.bold;
  const f = captionFontByFamily(family);
  if (f && !f.bold) bold = false;
  const scale = height / 1080;
  let fontSize = goRound((height * st.fontSizePct) / 100);
  if (fontSize < 8) fontSize = 8;
  const outline = st.outlineWidth ?? D.outlineWidth;
  const shadow = st.shadow ?? D.shadow;
  const strength = st.animationStrength ?? D.animationStrength;
  const highlight = st.highlightColor || D.highlightColor;
  const boxColor = hexToASSColor(st.backgroundColor, st.backgroundOpacity);
  return {
    family,
    bold,
    uppercase: st.uppercase === true,
    fontSize,
    primary: hexToASSColor(st.color, 1),
    outlineColor: hexToASSColor(st.outlineColor || D.outlineColor, 1),
    primaryTag: colorTag(st.color),
    highlightTag: colorTag(highlight),
    highlight,
    outlinePx: roundCentis(outline * scale),
    shadowPx: roundCentis(shadow * 8 * scale),
    boxPad: roundCentis(fontSize * 0.2),
    shadowColor: boxColor,
    boxColor,
    bgMode: st.backgroundMode || D.backgroundMode,
    animation: st.animation || D.animation,
    wordsPerGroup: st.wordsPerGroup ?? 0,
    align: st.position === 'top' ? 8 : st.position === 'middle' ? 5 : 2,
    popScale: 100 + goRound(40 * strength),
    maxWidthPct: st.maxWidthPct,
  };
}

interface TimedUnit {
  sep: string;
  text: string;
  start: number;
  end: number;
  emphasis: boolean;
}

function cueTimedUnits(c: StudioCaptionCue, uppercase: boolean): { units: TimedUnit[]; hasWords: boolean } {
  const units = captionUnits(c.text);
  const cs = centis(c.startSeconds);
  let ce = centis(c.endSeconds);
  if (ce < cs) ce = cs;
  const n = units.length;
  const words = c.words ?? [];
  const hasWords = words.length === n && n > 0;
  let prev = cs;
  const out = units.map((u, i): TimedUnit => {
    const t: TimedUnit = { sep: u.sep, text: uppercase ? captionUpper(u.text) : u.text, start: 0, end: 0, emphasis: false };
    if (hasWords) {
      const w = words[i];
      t.start = clampInt(centis(w.startSeconds), prev, ce);
      t.end = clampInt(centis(w.endSeconds), t.start, ce);
      t.emphasis = w.emphasis === true;
      prev = t.start;
    } else {
      t.start = cs + intDiv((ce - cs) * i, n);
      t.end = cs + intDiv((ce - cs) * (i + 1), n);
    }
    return t;
  });
  return { units: out, hasWords };
}

function captionGroups(units: TimedUnit[], perGroup: number, hasWords: boolean): [number, number][] {
  if (perGroup <= 0) return [[0, units.length]];
  const out: [number, number][] = [];
  let from = 0;
  for (let i = 0; i < units.length; i++) {
    if (i > from) {
      const brk = i - from >= perGroup || captionSentenceEnd(units[i - 1].text) || (hasWords && units[i].start - units[i - 1].end >= 15);
      if (brk) {
        out.push([from, i]);
        from = i;
      }
    }
  }
  out.push([from, units.length]);
  return out;
}

const popTags = (r: Resolved) => `\\t(0,80,\\fscx${r.popScale}\\fscy${r.popScale})\\t(80,180,\\fscx100\\fscy100)`;
const openTags = (prefix: string) => (prefix === '' ? '' : `{${prefix}}`);

function textLine(gu: TimedUnit[], active: number, r: Resolved, prefix: string): string {
  let b = openTags(prefix);
  const wordBox = r.bgMode === 'word_box';
  gu.forEach((u, i) => {
    if (i > 0) b += assSep(u.sep);
    const isActive = i === active;
    const color = !wordBox && (isActive || u.emphasis);
    const pop = isActive && r.animation === 'pop';
    if (!color && !pop) {
      b += assEscape(u.text);
      return;
    }
    b += '{';
    if (color) b += `\\1c${r.highlightTag}`;
    if (pop) b += popTags(r);
    b += `}${assEscape(u.text)}{`;
    if (color) b += `\\1c${r.primaryTag}`;
    if (pop) b += '\\fscx100\\fscy100';
    b += '}';
  });
  return b;
}

function boxLine(gu: TimedUnit[], active: number, r: Resolved, prefix: string): string {
  let b = `{${prefix}\\3a&HFF&}`;
  gu.forEach((u, i) => {
    if (i > 0) b += assSep(u.sep);
    const isActive = i === active && r.animation !== 'none';
    const pop = i === active && r.animation === 'pop';
    if (!isActive && !u.emphasis) {
      b += assEscape(u.text);
      return;
    }
    b += '{\\3a&H00&';
    if (pop) b += popTags(r);
    b += `}${assEscape(u.text)}{\\3a&HFF&`;
    if (pop) b += '\\fscx100\\fscy100';
    b += '}';
  });
  return b;
}

function karaokeLine(gu: TimedUnit[], gs: number, r: Resolved, prefix: string): string {
  let b = `{${prefix}\\1c${r.highlightTag}\\2c${r.primaryTag}`;
  const lead = gu[0].start - gs;
  if (lead > 0) b += `\\k${lead}`;
  b += '}';
  gu.forEach((u, i) => {
    if (i > 0) b += `{\\k${Math.max(0, u.start - gu[i - 1].end)}}${assSep(u.sep)}`;
    if (u.emphasis) {
      b += `{\\kf${u.end - u.start}\\2c${r.highlightTag}}${assEscape(u.text)}{\\2c${r.primaryTag}}`;
      return;
    }
    b += `{\\kf${u.end - u.start}}${assEscape(u.text)}`;
  });
  return b;
}

function writeCueEvents(lines: string[], c: StudioCaptionCue, r: Resolved): void {
  const { units, hasWords } = cueTimedUnits(c, r.uppercase);
  if (units.length === 0) return;
  const cs = centis(c.startSeconds);
  const ce = centis(c.endSeconds);
  if (ce <= cs) return;
  let prefix = '';
  const fam = captionFontFor(r.family, c.text);
  if (fam !== r.family) {
    prefix = `\\fn${fam}`;
    const f = captionFontByFamily(fam);
    if (f && !f.bold && r.bold) prefix += '\\b0';
  }
  const groups = captionGroups(units, r.wordsPerGroup, hasWords);
  const wordBox = r.bgMode === 'word_box';
  groups.forEach((g, gi) => {
    let gs = cs;
    let ge = ce;
    if (gi > 0) gs = units[g[0]].start;
    if (gi < groups.length - 1) ge = units[groups[gi + 1][0]].start;
    if (ge <= gs) return;
    const gu = units.slice(g[0], g[1]);
    const perWord = r.animation === 'highlight' || r.animation === 'pop' || (wordBox && r.animation === 'karaoke_fill');
    let spans: { s: number; e: number; active: number }[] = [{ s: gs, e: ge, active: -1 }];
    if (perWord) {
      spans = [];
      if (gu[0].start > gs) spans.push({ s: gs, e: gu[0].start, active: -1 });
      for (let i = 0; i < gu.length; i++) {
        const s = i === 0 ? Math.max(gs, gu[0].start) : gu[i].start;
        const e = i + 1 < gu.length ? gu[i + 1].start : ge;
        if (e > s) spans.push({ s, e, active: i });
      }
    }
    if (wordBox) {
      for (const sp of spans) {
        let boxed = false;
        gu.forEach((u, i) => {
          boxed = boxed || u.emphasis || (i === sp.active && r.animation !== 'none');
        });
        if (!boxed) continue;
        lines.push(`Dialogue: 0,${assCentis(sp.s)},${assCentis(sp.e)},WordBox,,0,0,0,,${boxLine(gu, sp.active, r, prefix)}`);
      }
    }
    if (r.animation === 'karaoke_fill') {
      lines.push(`Dialogue: 1,${assCentis(gs)},${assCentis(ge)},Default,,0,0,0,,${karaokeLine(gu, gs, r, prefix)}`);
      return;
    }
    for (const sp of spans) {
      lines.push(`Dialogue: 1,${assCentis(sp.s)},${assCentis(sp.e)},Default,,0,0,0,,${textLine(gu, sp.active, r, prefix)}`);
    }
  });
}

/**
 * buildASS mirrors services.BuildASS byte for byte. `cues` are sanitized the way the API stores
 * them (word lists validated); the style is sanitized here, as BuildASS does.
 */
export function buildASS(cues: readonly StudioCaptionCue[], style: StudioCaptionStyle | null | undefined, width: number, height: number): string {
  const W = width > 0 ? width : 1920;
  const H = height > 0 ? height : 1080;
  const r = resolve(sanitizeCaptionStyle(style ?? null), H);
  const marginH = goRound((W * (100 - r.maxWidthPct)) / 200);
  const marginV = goRound(H * 0.05);
  const bold = r.bold ? -1 : 0;
  const box = r.bgMode === 'box';
  const borderStyle = box ? 4 : 1;
  const shadow = box ? r.boxPad : r.shadowPx;
  const back = box ? r.boxColor : r.shadowColor;
  const lines = [
    '[Script Info]',
    '; Media Manipulator Darkroom captions (generator v1)',
    'ScriptType: v4.00+',
    `PlayResX: ${W}`,
    `PlayResY: ${H}`,
    'WrapStyle: 0',
    'ScaledBorderAndShadow: yes',
    'YCbCr Matrix: None',
    '',
    '[V4+ Styles]',
    'Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding',
    `Style: Default,${r.family},${r.fontSize},${r.primary},${r.primary},${r.outlineColor},${back},${bold},0,0,0,100,100,0,0,${borderStyle},${assNum(r.outlinePx)},${assNum(shadow)},${r.align},${marginH},${marginH},${marginV},-1`,
  ];
  if (r.bgMode === 'word_box') {
    lines.push(`Style: WordBox,${r.family},${r.fontSize},&HFF000000,&HFF000000,${hexToASSColor(r.highlight, 1)},&HFF000000,${bold},0,0,0,100,100,0,0,3,${assNum(r.boxPad)},0,${r.align},${marginH},${marginH},${marginV},-1`);
  }
  lines.push('', '[Events]', 'Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text');
  for (const c of cues) writeCueEvents(lines, c, r);
  return lines.join('\n') + '\n';
}

/** Sanitizes cue word lists the way the API stores them, then builds (for the preview). */
export function buildPreviewASS(cues: readonly StudioCaptionCue[], style: StudioCaptionStyle | null | undefined, width: number, height: number): string {
  return buildASS(cues.map((c) => {
    const words = sanitizeCaptionWords(c);
    return words === c.words ? c : { ...c, words };
  }), style, width, height);
}

/** Every family a generated .ass can name (the style's + per-cue script fallbacks). */
export function assFontFamilies(cues: readonly StudioCaptionCue[], style: StudioCaptionStyle | null | undefined): string[] {
  const st = sanitizeCaptionStyle(style ?? null);
  const family = st?.fontFamily || D.fontFamily;
  const out = new Set([family]);
  for (const c of cues) out.add(captionFontFor(family, c.text));
  return [...out];
}
