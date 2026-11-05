/**
 * MM110: Motion's Templates catalog (design MEDI_ASSISTANT.md §8.5, ticket decision 2).
 *
 * Six ready-made animations as PURE document operations `(doc, opts) → doc`: lower-third,
 * logo reveal, title pop, bullet reveal, counter and badge bounce. They are what Medi's
 * `template` op runs, and the editor's Templates menu runs the same functions, so a user who
 * never opens Medi gets them too.
 *
 * Rules (so every result passes `docIntegrityIssues` and the Go sanitizer unchanged):
 *   - only existing layer types (group, rect, text, path, ellipse), tracks from
 *     `TRACK_PROPERTY_PATTERN` and the MM45 animators (`applyDrawOn`);
 *   - fresh ids from `docIds`/`nextId` (never colliding with the user's);
 *   - every keyframe lies inside the composition: a template that needs more time than the
 *     document has extends `duration` itself (the only doc-level change it makes);
 *   - numbers through `roundNum`; colours checked with the document's colour grammar.
 *
 * Positions are fractions of the canvas viewBox so a template fits 512×512, 1920×1080 and
 * 1080×1920 alike. The result's new layers are returned in `added` (the editor selects them).
 */
import { applyDrawOn, canDrawOn } from '@/lib/vector/animators';
import { findDocLayer } from '@/lib/vector/advanced';
import { layerDocBounds } from '@/lib/vector/transformOps';
import { setDuration } from '@/lib/vector/keyframes';
import { docIds, findLayer, nextId } from '@/lib/vector/layerTree';
import { roundNum } from '@/lib/vector/num';
import { isSafeColor, parseVectorDoc, type Easing, type Keyframe, type Layer, type Track, type VectorDoc } from '@/lib/vector/vectorTypes';

export const TEMPLATE_KINDS = ['lowerThird', 'logoReveal', 'titlePop', 'bulletReveal', 'counter', 'badgeBounce'] as const;
export type TemplateKind = (typeof TEMPLATE_KINDS)[number];

export interface TemplateOptions {
  /** One line, or several (lower-third: name + role; bullets: one per line). */
  text?: string | string[];
  /** Up to four colours, template-specific roles (accent first). */
  colors?: string[];
  /** Start time (ms). */
  at?: number;
  /** How long the entrance takes (ms); each template has a sensible default. */
  duration?: number;
  /** Counter: the number to count to. */
  value?: number;
  /** Logo reveal: the layers to reveal (default: every top-level layer the template did not make). */
  layerIds?: string[];
}

export type TemplateResult = { ok: true; doc: VectorDoc; added: string[] } | { ok: false; error: string };

/** Defaults shown in the Templates menu (English placeholder text the user then edits). */
export const TEMPLATE_DEFAULTS: Record<TemplateKind, { text?: string | string[]; value?: number }> = {
  lowerThird: { text: ['Your name', 'Your title'] },
  logoReveal: {},
  titlePop: { text: 'Your title' },
  bulletReveal: { text: ['First point', 'Second point', 'Third point'] },
  counter: { value: 1000 },
  badgeBounce: { text: 'NEW' },
};

const ACCENT = '#ff5a36';
const LIGHT = '#ffffff';
const DARK = '#111111';
const FONT = 'Inter, sans-serif';
const MAX_LINES = 8;
const MAX_TEXT = 200;

type Ctx = { doc: VectorDoc; taken: Set<string>; tracks: Track[]; added: Layer[] };

const lines = (text: string | string[] | undefined, fallback: string[]): string[] => {
  const list = (Array.isArray(text) ? text : typeof text === 'string' ? text.split('\n') : fallback).map((s) => s.trim().slice(0, MAX_TEXT)).filter(Boolean);
  return (list.length ? list : fallback).slice(0, MAX_LINES);
};
const colorAt = (colors: string[] | undefined, i: number, fallback: string): string => {
  const c = colors?.[i];
  return c && isSafeColor(c) ? c.trim() : fallback;
};
const k = (t: number, value: number | string, easing: Easing = 'linear'): Keyframe => ({ t: Math.round(t), value: typeof value === 'number' ? roundNum(value) : value, easing });

/** Keys for a property that rests at `from` until `start`, then eases to `to` by `end` (a 0 key holds before a late start). */
function entrance(start: number, end: number, from: number, to: number, easing: Easing = 'easeOut'): Keyframe[] {
  const keys: Keyframe[] = [];
  if (start > 0) keys.push(k(0, from, 'hold'));
  keys.push(k(start, from, easing), k(end, to));
  return keys;
}

function track(ctx: Ctx, layerId: string, property: string, keyframes: Keyframe[]): void {
  ctx.tracks.push({ layerId, property, keyframes });
}

function finish(ctx: Ctx, needMs: number): TemplateResult {
  let doc = ctx.doc;
  if (needMs > doc.duration) doc = setDuration(doc, Math.min(3_600_000, Math.ceil(needMs / 100) * 100));
  const others = doc.animations.filter((tr) => !ctx.tracks.some((n) => n.layerId === tr.layerId && n.property === tr.property));
  doc = { ...doc, layers: [...doc.layers, ...ctx.added], animations: [...others, ...ctx.tracks] };
  return { ok: true, doc, added: ctx.added.map((l) => l.id) };
}

const box = (doc: VectorDoc) => doc.canvas.viewBox;
const startOf = (o: TemplateOptions) => Math.max(0, Math.round(o.at ?? 0));
const spanOf = (o: TemplateOptions, dflt: number) => Math.min(60_000, Math.max(100, Math.round(o.duration ?? dflt)));
/** Rounded so the template's own text never carries float noise. */
const px = (n: number) => roundNum(n);

// ---------------------------------------------------------------------------
// templates
// ---------------------------------------------------------------------------

/** Accent bar wipes in (scaleX from its left edge), then name and role slide in 4 % of the width and fade up. */
function lowerThird(doc: VectorDoc, o: TemplateOptions): TemplateResult {
  const ctx: Ctx = { doc, taken: docIds(doc), tracks: [], added: [] };
  const vb = box(doc);
  const [name, role] = lines(o.text, TEMPLATE_DEFAULTS.lowerThird.text as string[]);
  const at = startOf(o);
  const dur = spanOf(o, 900);
  const left = vb.x + vb.width * 0.06;
  const baseY = vb.y + vb.height * 0.8;
  const size = px(Math.max(12, vb.height * 0.055));
  const barH = px(size * (role ? 2.3 : 1.4));
  const barW = px(Math.max(4, vb.width * 0.008));
  const groupId = nextId(ctx.taken, 'lower-third');
  const barId = nextId(ctx.taken, 'lower-third-bar');
  const nameId = nextId(ctx.taken, 'lower-third-name');
  const kids: Layer[] = [
    { type: 'rect', id: barId, name: 'Accent bar', x: px(left), y: px(baseY - size * 1.05), width: barW, height: barH, fill: colorAt(o.colors, 0, ACCENT), transform: { x: 0, y: 0, scaleX: 1, scaleY: 1, rotation: 0, skewX: 0, skewY: 0, anchorX: px(left), anchorY: px(baseY - size * 1.05 + barH / 2) } },
    { type: 'text', id: nameId, name: 'Name', x: px(left + barW * 3), y: px(baseY), text: name, fontFamily: FONT, fontSize: size, fontWeight: '700', fill: colorAt(o.colors, 1, LIGHT) },
  ];
  let roleId: string | null = null;
  if (role) {
    roleId = nextId(ctx.taken, 'lower-third-role');
    kids.push({ type: 'text', id: roleId, name: 'Role', x: px(left + barW * 3), y: px(baseY + size * 1.05), text: role, fontFamily: FONT, fontSize: px(size * 0.62), fill: colorAt(o.colors, 2, colorAt(o.colors, 1, LIGHT)), opacity: 0.85 });
  }
  ctx.added.push({ type: 'group', id: groupId, name: 'Lower third', children: kids });
  const barEnd = at + Math.round(dur * 0.4);
  track(ctx, barId, 'transform.scaleY', entrance(at, barEnd, 0, 1));
  const slide = px(vb.width * 0.04);
  for (const [id, delay] of [[nameId, 0.25], [roleId, 0.4]] as const) {
    if (!id) continue;
    const s = at + Math.round(dur * delay);
    track(ctx, id, 'transform.x', entrance(s, at + dur, -slide, 0));
    track(ctx, id, 'opacity', entrance(s, at + dur, 0, 1));
  }
  return finish(ctx, at + dur + 1500);
}

/** Paths and outline shapes draw on (MM45 Draw on); everything else fades and scales up from its centre. */
function logoReveal(doc: VectorDoc, o: TemplateOptions): TemplateResult {
  const at = startOf(o);
  const dur = spanOf(o, 1500);
  const targets = (o.layerIds?.length ? o.layerIds : doc.layers.filter((l) => l.type !== 'raw').map((l) => l.id)).filter((id) => {
    const l = findLayer(doc.layers, id);
    return !!l && l.type !== 'raw' && !l.locked;
  });
  if (targets.length === 0) return { ok: false, error: 'logo reveal needs a logo: import an SVG or draw a shape first' };
  let out = dur + at > doc.duration ? setDuration(doc, Math.ceil((at + dur + 500) / 100) * 100) : doc;
  const ctx: Ctx = { doc: out, taken: docIds(out), tracks: [], added: [] };
  for (const id of targets) {
    if (canDrawOn(out, id)) {
      out = applyDrawOn(out, id, { start: at, end: at + dur, easing: 'easeBoth' });
      continue;
    }
    const b = layerDocBounds(out, id);
    const layer = findDocLayer(out, id);
    if (!layer || layer.type === 'raw') continue;
    // Pivot at the centre so the scale grows from the middle (the anchor is in local units).
    if (b) {
      const tf = layer.transform ?? { x: 0, y: 0, scaleX: 1, scaleY: 1, rotation: 0, skewX: 0, skewY: 0, anchorX: 0, anchorY: 0 };
      if (tf.anchorX === 0 && tf.anchorY === 0 && tf.rotation === 0 && tf.scaleX === 1 && tf.scaleY === 1 && tf.skewX === 0 && tf.skewY === 0) {
        const cx = px(b.x + b.width / 2 - tf.x);
        const cy = px(b.y + b.height / 2 - tf.y);
        out = { ...out, layers: out.layers.map((l) => (l.id === id && l.type !== 'raw' ? ({ ...l, transform: { ...tf, anchorX: cx, anchorY: cy } } as Layer) : l)) };
      }
    }
    ctx.tracks.push({ layerId: id, property: 'opacity', keyframes: entrance(at, at + Math.round(dur * 0.6), 0, 1) });
    for (const p of ['transform.scaleX', 'transform.scaleY']) ctx.tracks.push({ layerId: id, property: p, keyframes: entrance(at, at + dur, 0.8, 1, 'easeOut') });
  }
  ctx.doc = out;
  return finish(ctx, 0);
}

/** One big centred line: pops from 0 to 110 % and settles at 100 %, fading in over the first fifth. */
function titlePop(doc: VectorDoc, o: TemplateOptions): TemplateResult {
  const ctx: Ctx = { doc, taken: docIds(doc), tracks: [], added: [] };
  const vb = box(doc);
  const [text] = lines(o.text, [TEMPLATE_DEFAULTS.titlePop.text as string]);
  const at = startOf(o);
  const dur = spanOf(o, 500);
  const cx = px(vb.x + vb.width / 2);
  const size = px(Math.max(14, Math.min(vb.height * 0.14, (vb.width * 0.9) / Math.max(4, text.length * 0.6))));
  const cy = px(vb.y + vb.height / 2 + size * 0.35);
  const id = nextId(ctx.taken, 'title');
  ctx.added.push({
    type: 'text', id, name: 'Title', x: cx, y: cy, text, fontFamily: FONT, fontSize: size, fontWeight: '800', textAnchor: 'middle', fill: colorAt(o.colors, 0, LIGHT),
    transform: { x: 0, y: 0, scaleX: 1, scaleY: 1, rotation: 0, skewX: 0, skewY: 0, anchorX: cx, anchorY: px(cy - size * 0.35) },
  });
  const peak = at + Math.round(dur * 0.65);
  for (const p of ['transform.scaleX', 'transform.scaleY']) {
    const keys: Keyframe[] = [];
    if (at > 0) keys.push(k(0, 0, 'hold'));
    keys.push(k(at, 0, 'easeOut'), k(peak, 1.1, 'easeBoth'), k(at + dur, 1));
    track(ctx, id, p, keys);
  }
  track(ctx, id, 'opacity', entrance(at, at + Math.max(1, Math.round(dur * 0.2)), 0, 1, 'linear'));
  return finish(ctx, at + dur + 1500);
}

/** A bullet dot + line per item, each sliding in from the left and fading up, staggered. */
function bulletReveal(doc: VectorDoc, o: TemplateOptions): TemplateResult {
  const ctx: Ctx = { doc, taken: docIds(doc), tracks: [], added: [] };
  const vb = box(doc);
  const items = lines(o.text, TEMPLATE_DEFAULTS.bulletReveal.text as string[]);
  const at = startOf(o);
  const each = spanOf(o, 450);
  const stagger = Math.round(each * 0.75);
  const size = px(Math.max(12, Math.min(vb.height * 0.06, (vb.height * 0.6) / (items.length * 1.6))));
  const left = vb.x + vb.width * 0.12;
  const top = vb.y + vb.height / 2 - ((items.length - 1) * size * 1.6) / 2;
  const groupId = nextId(ctx.taken, 'bullets');
  const kids: Layer[] = [];
  const slide = px(vb.width * 0.03);
  items.forEach((text, i) => {
    const y = px(top + i * size * 1.6);
    const rowId = nextId(ctx.taken, 'bullet');
    const dotId = nextId(ctx.taken, 'bullet-dot');
    const textId = nextId(ctx.taken, 'bullet-text');
    kids.push({
      type: 'group', id: rowId, name: `Bullet ${i + 1}`, opacity: 1, children: [
        { type: 'ellipse', id: dotId, cx: px(left), cy: px(y - size * 0.32), rx: px(size * 0.18), ry: px(size * 0.18), fill: colorAt(o.colors, 0, ACCENT) },
        { type: 'text', id: textId, x: px(left + size * 0.7), y, text, fontFamily: FONT, fontSize: size, fill: colorAt(o.colors, 1, LIGHT) },
      ],
    });
    const s = at + i * stagger;
    track(ctx, rowId, 'transform.x', entrance(s, s + each, -slide, 0));
    track(ctx, rowId, 'opacity', entrance(s, s + each, 0, 1));
  });
  ctx.added.push({ type: 'group', id: groupId, name: 'Bullets', children: kids });
  return finish(ctx, at + (items.length - 1) * stagger + each + 1500);
}

/**
 * A number counting up. SVG has no animatable text content, so the count is a stack of text
 * layers (≤ 21 steps along an ease-out curve) where each one shows by an opacity hold track:
 * exact in every exporter (CSS, anime, Lottie, raster), no runtime code.
 */
function counter(doc: VectorDoc, o: TemplateOptions): TemplateResult {
  const ctx: Ctx = { doc, taken: docIds(doc), tracks: [], added: [] };
  const vb = box(doc);
  const target = Math.round(Math.max(-1e9, Math.min(1e9, Number.isFinite(o.value) ? (o.value as number) : (TEMPLATE_DEFAULTS.counter.value as number))));
  const [label] = typeof o.text === 'string' || Array.isArray(o.text) ? lines(o.text, ['']) : [''];
  const at = startOf(o);
  const dur = spanOf(o, 1800);
  const steps = Math.min(20, Math.max(1, Math.abs(target)));
  const fmt = (n: number) => n.toLocaleString('en-US');
  const cx = px(vb.x + vb.width / 2);
  const size = px(Math.max(14, Math.min(vb.height * 0.16, (vb.width * 0.8) / Math.max(3, fmt(target).length * 0.62))));
  const cy = px(vb.y + vb.height / 2 + size * 0.35);
  const groupId = nextId(ctx.taken, 'counter');
  const kids: Layer[] = [];
  for (let i = 0; i <= steps; i += 1) {
    // Ease-out: the numbers race first, then settle on the target.
    const f = 1 - (1 - i / steps) ** 3;
    const n = i === steps ? target : Math.round(target * f);
    const id = nextId(ctx.taken, 'counter-step');
    kids.push({ type: 'text', id, x: cx, y: cy, text: fmt(n), fontFamily: FONT, fontSize: size, fontWeight: '800', textAnchor: 'middle', fill: colorAt(o.colors, 0, LIGHT), opacity: i === 0 ? 1 : 0 });
    const tOn = at + Math.round((dur * i) / steps);
    const tOff = at + Math.round((dur * (i + 1)) / steps);
    const keys: Keyframe[] = [];
    if (i === 0) {
      keys.push(k(0, 1, 'hold'), k(tOff, 0, 'hold'));
    } else if (i === steps) {
      keys.push(k(0, 0, 'hold'), k(tOn, 1, 'hold'));
    } else {
      keys.push(k(0, 0, 'hold'), k(tOn, 1, 'hold'), k(tOff, 0, 'hold'));
    }
    track(ctx, id, 'opacity', keys);
  }
  if (label) {
    const id = nextId(ctx.taken, 'counter-label');
    kids.push({ type: 'text', id, x: cx, y: px(cy + size * 0.7), text: label, fontFamily: FONT, fontSize: px(size * 0.32), textAnchor: 'middle', fill: colorAt(o.colors, 1, colorAt(o.colors, 0, LIGHT)), opacity: 0.8 });
  }
  ctx.added.push({ type: 'group', id: groupId, name: 'Counter', children: kids });
  return finish(ctx, at + dur + 1500);
}

/** A round badge with a short word: drops in, overshoots, bounces twice and settles (scale + y). */
function badgeBounce(doc: VectorDoc, o: TemplateOptions): TemplateResult {
  const ctx: Ctx = { doc, taken: docIds(doc), tracks: [], added: [] };
  const vb = box(doc);
  const [word] = lines(o.text, [TEMPLATE_DEFAULTS.badgeBounce.text as string]);
  const at = startOf(o);
  const dur = spanOf(o, 900);
  const r = px(Math.min(vb.width, vb.height) * 0.11);
  const cx = px(vb.x + vb.width * 0.82);
  const cy = px(vb.y + vb.height * 0.2);
  const groupId = nextId(ctx.taken, 'badge');
  const circleId = nextId(ctx.taken, 'badge-circle');
  const textId = nextId(ctx.taken, 'badge-text');
  const size = px(Math.max(8, (r * 1.4) / Math.max(2, word.length * 0.62)));
  ctx.added.push({
    type: 'group', id: groupId, name: 'Badge',
    transform: { x: 0, y: 0, scaleX: 1, scaleY: 1, rotation: 0, skewX: 0, skewY: 0, anchorX: cx, anchorY: cy },
    children: [
      { type: 'ellipse', id: circleId, cx, cy, rx: r, ry: r, fill: colorAt(o.colors, 0, '#ffcc00') },
      { type: 'text', id: textId, x: cx, y: px(cy + size * 0.35), text: word, fontFamily: FONT, fontSize: size, fontWeight: '800', textAnchor: 'middle', fill: colorAt(o.colors, 1, DARK) },
    ],
  });
  const t = (f: number) => at + Math.round(dur * f);
  const scale: Array<[number, number, Easing]> = [[0, 0, 'easeOut'], [0.4, 1.15, 'easeBoth'], [0.6, 0.92, 'easeBoth'], [0.8, 1.04, 'easeBoth'], [1, 1, 'linear']];
  for (const p of ['transform.scaleX', 'transform.scaleY']) {
    const keys: Keyframe[] = at > 0 ? [k(0, 0, 'hold')] : [];
    for (const [f, v, e] of scale) keys.push(k(t(f), v, e));
    track(ctx, groupId, p, keys);
  }
  const drop = px(r * 0.6);
  track(ctx, groupId, 'transform.y', [...(at > 0 ? [k(0, -drop, 'hold')] : []), k(t(0), -drop, 'easeIn'), k(t(0.4), 0, 'easeOut'), k(t(0.6), -drop * 0.25, 'easeIn'), k(t(0.8), 0, 'linear')]);
  return finish(ctx, at + dur + 1500);
}

const BUILDERS: Record<TemplateKind, (doc: VectorDoc, o: TemplateOptions) => TemplateResult> = { lowerThird, logoReveal, titlePop, bulletReveal, counter, badgeBounce };

/**
 * Run one template. Never throws; a template that does not apply says why. The result is the
 * parsed, canonical document (schema key order), so it is byte-stable through the Go sanitizer.
 */
export function applyTemplate(doc: VectorDoc, kind: TemplateKind, opts: TemplateOptions = {}): TemplateResult {
  const build = BUILDERS[kind];
  if (!build) return { ok: false, error: `unknown template ${JSON.stringify(kind)}` };
  const r = build(doc, opts);
  if (!r.ok) return r;
  const parsed = parseVectorDoc(r.doc);
  return parsed.ok ? { ...r, doc: parsed.doc } : { ok: false, error: `template produced an invalid document: ${parsed.error}` };
}
