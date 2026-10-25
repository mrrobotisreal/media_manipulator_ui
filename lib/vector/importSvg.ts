/**
 * SVG → `VectorDoc` importer (Motion, code name `vector`; design §3.3 rung 1).
 *
 * Pipeline, all on a DOMParser document that never touches the live page:
 *
 *   1. guard   size cap (4 MB = VECTOR_MAX_DOC_BYTES), no `<!ENTITY`, well-formed XML, `<svg>` root
 *   2. clean   strip scripts, event handlers, external references, `javascript:`
 *              and dangerous elements (warnings list each); drop editor metadata
 *              (comments, `<metadata>`, `<title>`/`<desc>`, inkscape/sodipodi/…)
 *   3. style   inline simple `<style>` sheets and every `style=""` into attributes
 *   4. ids     sanitise ids to `[A-Za-z_][\w-]*`, de-duplicate, rewrite references
 *   5. map     elements the model covers become layers / defs; anything else
 *              becomes an opaque `raw` layer holding its serialised markup
 *   6. repair  drop references that do not resolve, then validate with Zod
 *
 * In-house svgo-style normalisation only (no `svgo` dependency). Numbers are
 * canonicalised with `roundNum`, path data with `normalizePath`, so the
 * importer and `exportSvg.ts` together are a fixed point (see the golden
 * idempotence test).
 */
import { normalizePath, PathParseError } from '@/lib/vector/pathData';
import { opsToMatrix, parseTransformList, transformFromAttr } from '@/lib/vector/geometry';
import { parseNumber, roundNum } from '@/lib/vector/num';
import { BACKGROUND_ATTR, SAFE_ATTRS, STYLE_FIELDS, SVG_NS, TEXT_FIELDS, XLINK_NS, type StyleKind } from '@/lib/vector/svgMap';
import {
  DEFAULT_BACKGROUND,
  DEFAULT_CANVAS_SIZE,
  IMAGE_HREF_PATTERN,
  VECTOR_ID_PATTERN,
  VECTOR_MAX_DEPTH,
  VECTOR_MAX_DOC_BYTES,
  VECTOR_MAX_LAYERS,
  VECTOR_MAX_RAW_BYTES,
  forEachLayer,
  isSafeColor,
  isSafePaint,
  isAllowedAttrName,
  isSafeAttrValue,
  paintRef,
  rawMarkupIssues,
  vectorDocSchema,
  type Gradient,
  type GradientStop,
  type RadialGradient,
  type Layer,
  type RawLayer,
  type VectorClipPath,
  type VectorDoc,
  type VectorFilter,
  type VectorMask,
  type VectorSymbol,
  type ViewBox,
} from '@/lib/vector/vectorTypes';

export type ImportWarningCode =
  | 'script_removed'
  | 'event_handler_removed'
  | 'external_reference_removed'
  | 'unsafe_content_removed'
  | 'unsupported_element'
  | 'style_dropped'
  | 'invalid_value'
  | 'dangling_reference';

export interface ImportWarning {
  code: ImportWarningCode;
  /** Element / attribute / id involved, for the details list. */
  detail: string;
}

export interface ImportResult {
  doc: VectorDoc;
  warnings: ImportWarning[];
}

export type ImportErrorCode = 'too_large' | 'not_svg' | 'malformed' | 'entities' | 'too_complex';

export class SvgImportError extends Error {
  constructor(
    readonly code: ImportErrorCode,
    message: string,
  ) {
    super(message);
    this.name = 'SvgImportError';
  }
}

// ---------------------------------------------------------------------------
// tables
// ---------------------------------------------------------------------------

const DENY_ELEMENTS = new Set([
  'script',
  'handler',
  'listener',
  'iframe',
  'object',
  'embed',
  'frame',
  'frameset',
  'applet',
  'base',
  'link',
  'meta',
  'form',
  'input',
  'button',
  'textarea',
  'select',
  'option',
  'audio',
  'video',
  'source',
  'track',
  'portal',
  'noscript',
  'template',
  'slot',
]);
const SCRIPTY = new Set(['script', 'handler', 'listener']);
const METADATA_ELEMENTS = new Set(['metadata', 'title', 'desc']);
const SMIL = new Set(['animate', 'set', 'animatemotion', 'animatetransform', 'animatecolor']);
const DANGEROUS_ATTRS = new Set(['srcdoc', 'formaction', 'action', 'background', 'lowsrc', 'dynsrc', 'ping']);
const HREF_ATTRS = new Set(['href', 'src']);
const SHAPES = new Set(['rect', 'circle', 'ellipse', 'line', 'polyline', 'polygon', 'path', 'text', 'image', 'use']);
const DEF_ELEMENTS = new Set(['lineargradient', 'radialgradient', 'mask', 'clippath', 'symbol', 'filter']);
/** CSS properties that map 1:1 onto SVG presentation attributes. */
const PRESENTATION_PROPS = new Set([
  ...STYLE_FIELDS.map(([, attr]) => attr),
  ...TEXT_FIELDS.map(([, attr]) => attr),
  ...SAFE_ATTRS,
  'stop-color',
  'stop-opacity',
  'flood-color',
  'flood-opacity',
  'lighting-color',
  'overflow',
  'clip',
  'cursor',
]);
PRESENTATION_PROPS.delete('class');
PRESENTATION_PROPS.delete('pathLength');
PRESENTATION_PROPS.delete('lengthAdjust');
PRESENTATION_PROPS.delete('textLength');

const IMAGE_DATA_HREF = /^data:image\/(png|jpeg|gif|webp|avif);base64,/i;
const UNSAFE_VALUE = /javascript:|vbscript:|livescript:|data:text\/html|expression\(|@import|-moz-binding|behavior\s*:|image-set\(|\\/i;
const EXTERNAL_URL = /url\(\s*(?!["']?#)/i;

const stripWs = (s: string) => s.replace(/[\s\u0000-\u001f]+/g, '');

// ---------------------------------------------------------------------------
// entry point
// ---------------------------------------------------------------------------

/** Parse SVG text into a `VectorDoc`. Throws `SvgImportError` when the input cannot be imported at all. */
export function parseSvg(text: string): ImportResult {
  if (new TextEncoder().encode(text).length > VECTOR_MAX_DOC_BYTES) {
    throw new SvgImportError('too_large', 'SVG is larger than 4 MB');
  }
  if (/<!ENTITY/i.test(text)) throw new SvgImportError('entities', 'SVG declares XML entities');
  const parsed = new DOMParser().parseFromString(text, 'image/svg+xml');
  if (parsed.getElementsByTagName('parsererror').length > 0) {
    throw new SvgImportError('malformed', 'SVG is not well-formed XML');
  }
  const root = parsed.documentElement;
  if (!root || root.localName !== 'svg' || root.namespaceURI !== SVG_NS) {
    throw new SvgImportError('not_svg', 'Root element is not <svg>');
  }

  const warnings: ImportWarning[] = [];
  const warn = (code: ImportWarningCode, detail: string) => {
    if (!warnings.some((w) => w.code === code && w.detail === detail)) warnings.push({ code, detail });
  };

  clean(root, warn);
  inlineStyles(root, warn);
  const takenIds = renameIds(root);

  const canvas = readCanvas(root);
  const ctx = new Converter(canvas.viewBox, takenIds, warn);
  const layers = ctx.convertRoot(root);
  const doc: VectorDoc = {
    version: 1,
    canvas: { ...canvas, background: ctx.background ?? DEFAULT_BACKGROUND },
    duration: 3000,
    fps: 24,
    layers,
    defs: ctx.defs,
    animations: [],
  };
  repair(doc, warn);

  let count = 0;
  let depth = 0;
  forEachLayer(doc, (_, d) => {
    count += 1;
    depth = Math.max(depth, d);
  });
  if (count > VECTOR_MAX_LAYERS || depth > VECTOR_MAX_DEPTH) {
    throw new SvgImportError('too_complex', 'SVG has too many layers or nests too deeply');
  }
  const result = vectorDocSchema.safeParse(doc);
  if (!result.success) {
    throw new SvgImportError('malformed', `SVG did not map to a valid document: ${result.error.issues[0]?.message}`);
  }
  return { doc: result.data, warnings };
}

// ---------------------------------------------------------------------------
// 2. clean
// ---------------------------------------------------------------------------

type Warn = (code: ImportWarningCode, detail: string) => void;

function elementChildren(el: Element): Element[] {
  return Array.from(el.children);
}

function clean(root: Element, warn: Warn): void {
  // Comments and processing instructions are editor noise; CDATA sections
  // are dropped because the HTML parser reads them differently (a parser
  // differential is how payloads hide).
  const removeNodes: Node[] = [];
  const walker = root.ownerDocument.createTreeWalker(root, 0x80 | 0x40 | 0x08); // COMMENT | PROCESSING_INSTRUCTION | CDATA_SECTION
  for (let n = walker.nextNode(); n; n = walker.nextNode()) removeNodes.push(n);
  for (const n of removeNodes) n.parentNode?.removeChild(n);

  const visit = (el: Element, inForeign: boolean) => {
    const name = el.localName.toLowerCase();
    if (el !== root && el.prefix && el.prefix !== 'svg') {
      el.remove(); // inkscape:*, sodipodi:*, sketch:*, … editor metadata
      return;
    }
    if (name === 'foreignobject') {
      // The only way into HTML parsing inside SVG; never kept (XSS surface).
      warn('unsafe_content_removed', `<${el.localName}>`);
      el.remove();
      return;
    }
    if (DENY_ELEMENTS.has(name)) {
      warn(SCRIPTY.has(name) ? 'script_removed' : 'unsafe_content_removed', `<${el.localName}>`);
      el.remove();
      return;
    }
    if (!inForeign && METADATA_ELEMENTS.has(name)) {
      el.remove();
      return;
    }
    if (SMIL.has(name)) {
      const target = (el.getAttribute('attributeName') ?? '').trim().toLowerCase();
      if (target === 'href' || target === 'xlink:href' || target.startsWith('on')) {
        warn('unsafe_content_removed', `<${el.localName} attributeName="${target}">`);
        el.remove();
        return;
      }
    }
    if (name === 'style') {
      const css = el.textContent ?? '';
      if (UNSAFE_VALUE.test(stripWs(css)) || EXTERNAL_URL.test(css)) {
        warn('unsafe_content_removed', '<style>');
        el.remove();
        return;
      }
    }
    cleanAttributes(el, name, warn);
    const foreign = inForeign || name === 'foreignobject';
    for (const child of elementChildren(el)) visit(child, foreign);
  };
  visit(root, false);
}

function cleanAttributes(el: Element, name: string, warn: Warn): void {
  // inkscape:label is the layer name; keep it before the namespace sweep.
  const label = el.getAttributeNS('http://www.inkscape.org/namespaces/inkscape', 'label');
  if (label && !el.hasAttribute('data-name')) el.setAttribute('data-name', label);

  for (const attr of Array.from(el.attributes)) {
    const local = attr.localName.toLowerCase();
    const qn = attr.name;
    const remove = () => el.removeAttributeNode(attr);
    // Namespace declarations are the serializer's business; leave them.
    if (attr.prefix === 'xmlns' || qn === 'xmlns') continue;
    if (attr.prefix && attr.prefix !== 'xlink' && attr.prefix !== 'xml') {
      remove();
      continue;
    }
    if (local.startsWith('on')) {
      warn('event_handler_removed', `${qn} on <${el.localName}>`);
      remove();
      continue;
    }
    if (DANGEROUS_ATTRS.has(local)) {
      warn('unsafe_content_removed', `${qn} on <${el.localName}>`);
      remove();
      continue;
    }
    const value = attr.value;
    if (local === 'style') {
      // Filter per declaration so one bad property does not cost the rest.
      const kept = parseDeclarations(value).filter(([prop, v]) => {
        const bad = UNSAFE_VALUE.test(stripWs(v)) || EXTERNAL_URL.test(v) || UNSAFE_VALUE.test(`${prop}:`);
        if (bad) warn('external_reference_removed', `style ${prop} on <${el.localName}>`);
        return !bad;
      });
      if (kept.length === 0) remove();
      else attr.value = kept.map(([p, v]) => `${p}:${v}`).join(';');
      continue;
    }
    if (UNSAFE_VALUE.test(stripWs(value))) {
      warn('unsafe_content_removed', `${qn} on <${el.localName}>`);
      remove();
      continue;
    }
    if (HREF_ATTRS.has(local)) {
      const v = value.trim();
      const ok = v.startsWith('#') || (name === 'image' && IMAGE_DATA_HREF.test(v));
      if (!ok) {
        warn('external_reference_removed', `${qn} on <${el.localName}>`);
        remove();
      }
      continue;
    }
    if (EXTERNAL_URL.test(value)) {
      warn('external_reference_removed', `${qn} on <${el.localName}>`);
      remove();
    }
  }
}

// ---------------------------------------------------------------------------
// 3. styles
// ---------------------------------------------------------------------------

type Decl = [prop: string, value: string];

function parseDeclarations(css: string): Decl[] {
  const out: Decl[] = [];
  for (const part of css.replace(/\/\*[\s\S]*?\*\//g, '').split(';')) {
    const i = part.indexOf(':');
    if (i <= 0) continue;
    const prop = part.slice(0, i).trim().toLowerCase();
    const value = part.slice(i + 1).replace(/!important/i, '').trim();
    if (prop && value) out.push([prop, value]);
  }
  return out;
}

const SIMPLE_SELECTOR = /^([a-zA-Z][\w-]*)?((?:\.[A-Za-z_][\w-]*)*)(#[A-Za-z_][\w-]*)?$/;

interface Rule {
  selector: string;
  specificity: number;
  order: number;
  decls: Decl[];
}

/** Parse a sheet of simple rules; null when anything is beyond `tag.class#id` lists. */
function parseSheet(css: string): Rule[] | null {
  const src = css.replace(/\/\*[\s\S]*?\*\//g, '');
  if (src.includes('@')) return null;
  const rules: Rule[] = [];
  const re = /([^{}]+)\{([^{}]*)\}/g;
  let consumed = 0;
  let m: RegExpExecArray | null;
  let order = 0;
  while ((m = re.exec(src))) {
    if (src.slice(consumed, m.index).trim() !== '') return null;
    consumed = re.lastIndex;
    const decls = parseDeclarations(m[2]);
    for (const raw of m[1].split(',')) {
      const selector = raw.trim();
      const parts = SIMPLE_SELECTOR.exec(selector);
      if (!selector || !parts) return null;
      const classes = parts[2] ? parts[2].split('.').length - 1 : 0;
      const specificity = (parts[3] ? 10000 : 0) + classes * 100 + (parts[1] ? 1 : 0);
      rules.push({ selector, specificity, order: order++, decls });
    }
  }
  if (src.slice(consumed).trim() !== '') return null;
  return rules;
}

function inlineStyles(root: Element, warn: Warn): void {
  // Stylesheets first: only when EVERY sheet is made of simple rules; otherwise
  // the sheets stay (as raw layers) and keep styling by class.
  const sheets = Array.from(root.getElementsByTagNameNS(SVG_NS, 'style'));
  const parsedSheets = sheets.map((s) => parseSheet(s.textContent ?? ''));
  const sheetDecls = new Map<Element, Decl[]>();
  if (sheets.length > 0 && parsedSheets.every((r) => r !== null)) {
    const rules = (parsedSheets as Rule[][]).flat().sort((a, b) => a.specificity - b.specificity || a.order - b.order);
    for (const rule of rules) {
      for (const el of Array.from(root.querySelectorAll(rule.selector))) {
        if (el.namespaceURI !== SVG_NS) continue;
        sheetDecls.set(el, [...(sheetDecls.get(el) ?? []), ...rule.decls]);
      }
    }
    for (const s of sheets) s.remove();
  } else if (sheets.length > 0) {
    // A sheet we cannot inline would be global CSS in the editor page: drop it.
    for (const s of sheets) s.remove();
    warn('style_dropped', '<style>');
  }

  const dropped = new Set<string>();
  const visit = (el: Element, inForeign: boolean) => {
    const styleAttr = el.getAttribute('style');
    if (inForeign) {
      // HTML inside foreignObject keeps its CSS (sanitised in clean()).
    } else {
      const decls = [...(sheetDecls.get(el) ?? []), ...(styleAttr ? parseDeclarations(styleAttr) : [])];
      if (styleAttr !== null) el.removeAttribute('style');
      for (const [prop, value] of decls) {
        if (!PRESENTATION_PROPS.has(prop) || UNSAFE_VALUE.test(stripWs(value)) || EXTERNAL_URL.test(value)) {
          dropped.add(prop);
          continue;
        }
        el.setAttribute(prop, value);
      }
    }
    const foreign = inForeign || el.localName.toLowerCase() === 'foreignobject';
    for (const child of elementChildren(el)) visit(child, foreign);
  };
  visit(root, false);
  for (const prop of dropped) warn('style_dropped', prop);
}

// ---------------------------------------------------------------------------
// 4. ids
// ---------------------------------------------------------------------------

export function sanitizeId(raw: string): string {
  let id = raw.trim().replace(/[^\w-]/g, '_');
  if (!/^[A-Za-z_]/.test(id)) id = `_${id}`;
  return id.slice(0, 120);
}

const URL_REF = /url\(\s*(["']?)#([^)"'\s]+)\1\s*\)/g;

/** Make every id valid and unique, rewrite references; returns the taken set. */
function renameIds(root: Element): Set<string> {
  const map = new Map<string, string>();
  const taken = new Set<string>();
  const all = [root, ...Array.from(root.getElementsByTagName('*'))];
  for (const el of all) {
    const old = el.getAttribute('id');
    if (old === null) continue;
    if (el === root) {
      el.removeAttribute('id');
      continue;
    }
    let id = sanitizeId(old);
    if (taken.has(id)) {
      let n = 2;
      while (taken.has(`${id}-${n}`)) n++;
      id = `${id}-${n}`;
    }
    taken.add(id);
    if (!map.has(old)) map.set(old, id);
    if (id !== old) el.setAttribute('id', id);
  }
  const rewriteUrls = (value: string) =>
    value.replace(URL_REF, (_m, _q, ref: string) => `url(#${map.get(ref) ?? ref})`);
  for (const el of all) {
    for (const attr of Array.from(el.attributes)) {
      if (attr.localName === 'href') {
        const v = attr.value.trim();
        if (v.startsWith('#')) {
          const next = `#${map.get(v.slice(1)) ?? v.slice(1)}`;
          if (next !== attr.value) attr.value = next;
        }
      } else if (attr.value.includes('url(')) {
        const next = rewriteUrls(attr.value);
        if (next !== attr.value) attr.value = next;
      }
    }
    if (el.localName === 'style' && el.textContent?.includes('url(')) {
      el.textContent = rewriteUrls(el.textContent);
    }
  }
  return taken;
}

// ---------------------------------------------------------------------------
// canvas
// ---------------------------------------------------------------------------

const UNIT_PX: Record<string, number> = { '': 1, px: 1, pt: 96 / 72, pc: 16, mm: 96 / 25.4, cm: 96 / 2.54, in: 96, em: 16, ex: 8 };

function parseLengthRaw(value: string | null): { n: number; percent: boolean } | null {
  if (value === null) return null;
  const m = /^\s*([+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?)\s*(px|pt|pc|mm|cm|in|em|ex|%)?\s*$/.exec(value);
  if (!m) return null;
  const n = Number(m[1]);
  if (!Number.isFinite(n)) return null;
  if (m[2] === '%') return { n, percent: true };
  return { n: n * UNIT_PX[m[2] ?? ''], percent: false };
}

function readCanvas(root: Element): { width: number; height: number; viewBox: ViewBox } {
  let vb: ViewBox | null = null;
  const vbAttr = root.getAttribute('viewBox');
  if (vbAttr) {
    const parts = vbAttr.trim().split(/[\s,]+/).map(Number);
    if (parts.length === 4 && parts.every(Number.isFinite) && parts[2] > 0 && parts[3] > 0) {
      vb = { x: roundNum(parts[0]), y: roundNum(parts[1]), width: roundNum(parts[2]), height: roundNum(parts[3]) };
    }
  }
  const w = parseLengthRaw(root.getAttribute('width'));
  const h = parseLengthRaw(root.getAttribute('height'));
  const width = w && !w.percent && w.n > 0 ? roundNum(w.n) : vb?.width ?? DEFAULT_CANVAS_SIZE;
  const height = h && !h.percent && h.n > 0 ? roundNum(h.n) : vb?.height ?? DEFAULT_CANVAS_SIZE;
  return { width, height, viewBox: vb ?? { x: 0, y: 0, width, height } };
}

// ---------------------------------------------------------------------------
// 5. conversion
// ---------------------------------------------------------------------------

type Mutable<T> = { -readonly [K in keyof T]: T[K] };
type AnyLayer = Mutable<Record<string, unknown>> & { type: string; id: string };

class Converter {
  defs: VectorDoc['defs'] = { gradients: [], masks: [], clipPaths: [], filters: [], symbols: [] };
  background: string | undefined;
  private counters = new Map<string, number>();

  constructor(
    private vb: ViewBox,
    private taken: Set<string>,
    private warn: Warn,
  ) {}

  newId(prefix: string): string {
    let n = this.counters.get(prefix) ?? 0;
    let id: string;
    do {
      n += 1;
      id = `${prefix}-${n}`;
    } while (this.taken.has(id));
    this.counters.set(prefix, n);
    this.taken.add(id);
    return id;
  }

  convertRoot(root: Element): Layer[] {
    const kids = elementChildren(root);
    const first = kids[0];
    if (first && first.localName === 'rect' && first.hasAttribute(BACKGROUND_ATTR)) {
      const fill = first.getAttribute('fill')?.trim();
      this.background = fill && isSafeColor(fill) ? fill : undefined;
      first.remove();
    }
    const layers = this.convertChildren(root, 1);
    // Inherited presentation attributes on <svg> itself (`fill="none"` on
    // icon sets) would be lost: keep them on a wrapping group.
    const rootStyle = this.readStyle(root);
    const rootAttrs = this.readAttrs(root, new Set(['width', 'height', 'viewBox', 'x', 'y', 'version', 'preserveAspectRatio', 'baseProfile', 'id']));
    if (Object.keys(rootStyle).length > 0 || rootAttrs) {
      const group: AnyLayer = { type: 'group', id: this.newId('svg-root'), name: 'SVG', ...rootStyle, children: layers };
      if (rootAttrs) group.attrs = rootAttrs;
      return [group as unknown as Layer];
    }
    return layers;
  }

  convertChildren(parent: Element, depth: number): Layer[] {
    const out: Layer[] = [];
    for (const el of elementChildren(parent)) {
      const name = el.localName.toLowerCase();
      if (el.namespaceURI !== SVG_NS) {
        out.push(this.raw(el));
        continue;
      }
      if (name === 'defs') {
        out.push(...this.convertDefs(el, depth));
        continue;
      }
      if (DEF_ELEMENTS.has(name)) {
        if (!this.convertDef(el, depth)) out.push(this.raw(el));
        continue;
      }
      const layer = this.convertLayer(el, depth);
      if (layer) out.push(layer);
    }
    return out;
  }

  private convertDefs(defs: Element, depth: number): Layer[] {
    const out: Layer[] = [];
    for (const el of elementChildren(defs)) {
      if (el.namespaceURI === SVG_NS && DEF_ELEMENTS.has(el.localName.toLowerCase()) && this.convertDef(el, depth)) continue;
      if (el.namespaceURI === SVG_NS && el.localName === 'defs') {
        out.push(...this.convertDefs(el, depth));
        continue;
      }
      // Anything else declared in <defs> (patterns, markers, shapes for <use>,
      // sheets) renders only when referenced, so it keeps working as raw.
      out.push(this.raw(el));
    }
    return out;
  }

  /** Convert a hoistable definition into `defs`; false = keep it as raw. */
  private convertDef(el: Element, depth: number): boolean {
    const id = el.getAttribute('id');
    if (!id) return false;
    switch (el.localName.toLowerCase()) {
      case 'lineargradient':
      case 'radialgradient': {
        const g = this.gradient(el, id);
        if (g) this.defs.gradients.push(g);
        return g !== null;
      }
      case 'mask': {
        const m = this.mask(el, id, depth);
        if (m) this.defs.masks.push(m);
        return m !== null;
      }
      case 'clippath': {
        const c = this.clipPath(el, id, depth);
        if (c) this.defs.clipPaths.push(c);
        return c !== null;
      }
      case 'filter': {
        const f = this.blurFilter(el, id);
        if (f) this.defs.filters.push(f);
        return f !== null;
      }
      case 'symbol': {
        const s = this.symbol(el, id, depth);
        if (s) this.defs.symbols.push(s);
        return s !== null;
      }
    }
    return false;
  }

  raw(el: Element): RawLayer {
    const markup = new XMLSerializer()
      .serializeToString(el)
      .replace(/^(<[\w:-]+)\s+xmlns="http:\/\/www\.w3\.org\/2000\/svg"/, '$1');
    const ids = [el, ...Array.from(el.getElementsByTagName('*'))]
      .map((e) => e.getAttribute('id'))
      .filter((v): v is string => v !== null && VECTOR_ID_PATTERN.test(v));
    const problems = rawMarkupIssues(markup);
    this.warn('unsupported_element', `<${el.localName}>`);
    if (problems.length > 0 || markup.length > VECTOR_MAX_RAW_BYTES) {
      this.warn('unsafe_content_removed', `<${el.localName}>`);
      return { type: 'raw', id: this.newId('raw'), markup: '' };
    }
    const layer: RawLayer = { type: 'raw', id: this.newId('raw'), markup };
    if (ids.length > 0) layer.ids = ids;
    return layer;
  }

  // ---- layers ----

  convertLayer(el: Element, depth: number): Layer | null {
    const name = el.localName.toLowerCase();
    if (name === 'g') {
      const layer: AnyLayer = { type: 'group', ...this.head(el, 'group') };
      const children = this.convertChildren(el, depth + 1);
      Object.assign(layer, this.tail(el, false), { children });
      return layer as unknown as Layer;
    }
    if (!SHAPES.has(name)) return this.raw(el);
    // Modelled shapes carry no child elements (SMIL, tspans, … make them raw).
    if (elementChildren(el).length > 0) return this.raw(el);
    const geo = this.geometry(el, name);
    if (geo === 'raw') return this.raw(el);
    if (geo === null) return null;
    const type = geo.type as string;
    const ordered: AnyLayer = { type, ...this.head(el, type) };
    for (const [k, v] of Object.entries(geo)) if (k !== 'type') ordered[k] = v;
    if (type === 'text') Object.assign(ordered, this.textFields(el));
    Object.assign(ordered, this.tail(el, type === 'text'));
    return ordered as unknown as Layer;
  }

  private head(el: Element, type: string): { id: string; name?: string; hidden?: boolean } {
    const existing = el.getAttribute('id');
    let id = existing;
    if (!id) {
      id = this.newId(type);
      el.setAttribute('id', id); // stable across repeated head() calls
    }
    const out: { id: string; name?: string; hidden?: boolean } = { id };
    const dn = el.getAttribute('data-name');
    if (dn !== null && dn.trim()) out.name = dn.trim().slice(0, 200);
    if (el.getAttribute('display')?.trim() === 'none') out.hidden = true;
    return out;
  }

  private tail(el: Element, isText: boolean): Record<string, unknown> {
    const out: Record<string, unknown> = { ...this.readStyle(el) };
    const transform = transformFromAttr(el.getAttribute('transform'));
    if (el.hasAttribute('transform') && !parseTransformList(el.getAttribute('transform') ?? '')) {
      this.warn('invalid_value', `transform on <${el.localName}>`);
    }
    if (transform) out.transform = transform;
    const attrs = this.readAttrs(el, GEOMETRY_ATTRS[el.localName.toLowerCase()] ?? new Set(), isText);
    if (attrs) out.attrs = attrs;
    return out;
  }

  /** Style fields; values that do not fit the model fall back to `attrs`. */
  readStyle(el: Element): Record<string, unknown> {
    const out: Record<string, unknown> = {};
    for (const [field, attr, kind] of STYLE_FIELDS) {
      const raw = el.getAttribute(attr);
      if (raw === null) continue;
      const v = parseStyleValue(raw, kind as StyleKind);
      if (v === undefined) {
        if (kind !== 'ref' && !SAFE_ATTRS.has(attr)) this.warn('invalid_value', `${attr}="${raw}"`);
        continue;
      }
      out[field] = v;
    }
    return out;
  }

  private textFields(el: Element): Record<string, unknown> {
    const out: Record<string, unknown> = {};
    for (const [field, attr, kind] of TEXT_FIELDS) {
      const raw = el.getAttribute(attr);
      if (raw === null) continue;
      let v: unknown;
      if (kind === 'string') v = raw.trim() || undefined;
      else if (kind === 'positive') {
        const l = parseLengthRaw(raw);
        v = l && !l.percent && l.n > 0 ? roundNum(l.n) : undefined;
      } else if (kind === 'number') {
        const l = parseLengthRaw(raw);
        v = l && !l.percent ? roundNum(l.n) : undefined;
      } else v = (kind.enum as readonly string[]).includes(raw.trim()) ? raw.trim() : undefined;
      if (v !== undefined) out[field] = v;
    }
    return out;
  }

  /** Unmodelled safe attributes; `skip` lists attributes the caller consumed. */
  readAttrs(el: Element, skip: Set<string>, isText = false): Record<string, string> | undefined {
    const out: Record<string, string> = {};
    const modelled = new Set<string>(STYLE_FIELDS.map(([, a]) => a));
    if (isText) for (const [, a] of TEXT_FIELDS) modelled.add(a);
    for (const attr of Array.from(el.attributes)) {
      const name = attr.name;
      if (skip.has(name) || name === 'id' || name === 'transform' || name === 'data-name' || name === BACKGROUND_ATTR) continue;
      if (name === 'display' && attr.value.trim() === 'none') continue;
      if (modelled.has(name)) {
        // Unparseable modelled value (e.g. `stroke-width="1em"`): keep verbatim
        // when it is a safe presentation attribute so rendering is unchanged.
        const field = STYLE_FIELDS.find(([, a]) => a === name);
        const tf = TEXT_FIELDS.find(([, a]) => a === name);
        const parsed = field
          ? parseStyleValue(attr.value, field[2] as StyleKind)
          : tf
            ? attr.value
            : undefined;
        if (parsed !== undefined || !SAFE_ATTRS.has(name)) continue;
      }
      if (!isAllowedAttrName(name) || !isSafeAttrValue(attr.value)) continue;
      out[name] = attr.value;
    }
    return Object.keys(out).length > 0 ? out : undefined;
  }

  private len(el: Element, attr: string, axis: 'x' | 'y' | 'r', fallback = 0): number {
    const l = parseLengthRaw(el.getAttribute(attr));
    if (!l) return fallback;
    if (!l.percent) return roundNum(l.n);
    const base = axis === 'x' ? this.vb.width : axis === 'y' ? this.vb.height : Math.sqrt((this.vb.width ** 2 + this.vb.height ** 2) / 2);
    return roundNum((l.n / 100) * base);
  }

  private geometry(el: Element, name: string): Record<string, unknown> | 'raw' | null {
    const L = (a: string, axis: 'x' | 'y' | 'r', f = 0) => this.len(el, a, axis, f);
    const pos = (n: number) => Math.max(0, n);
    switch (name) {
      case 'rect': {
        const out: Record<string, unknown> = { type: 'rect', x: L('x', 'x'), y: L('y', 'y'), width: pos(L('width', 'x')), height: pos(L('height', 'y')) };
        const rxA = el.hasAttribute('rx') ? pos(L('rx', 'x')) : undefined;
        const ryA = el.hasAttribute('ry') ? pos(L('ry', 'y')) : undefined;
        const rx = rxA ?? ryA;
        const ry = rxA !== undefined && ryA !== undefined && ryA !== rxA ? ryA : undefined;
        if (rx !== undefined && rx !== 0) out.rx = rx;
        if (ry !== undefined) {
          if (out.rx === undefined) out.rx = 0;
          out.ry = ry;
        }
        return out;
      }
      case 'circle': {
        const r = pos(L('r', 'r'));
        return { type: 'ellipse', cx: L('cx', 'x'), cy: L('cy', 'y'), rx: r, ry: r };
      }
      case 'ellipse':
        return { type: 'ellipse', cx: L('cx', 'x'), cy: L('cy', 'y'), rx: pos(L('rx', 'x')), ry: pos(L('ry', 'y')) };
      case 'line':
        return { type: 'line', x1: L('x1', 'x'), y1: L('y1', 'y'), x2: L('x2', 'x'), y2: L('y2', 'y') };
      case 'polyline':
      case 'polygon': {
        const nums = (el.getAttribute('points') ?? '').trim().split(/[\s,]+/).filter(Boolean).map(parseNumber);
        const valid: number[] = [];
        for (const n of nums) {
          if (!Number.isFinite(n)) break;
          valid.push(roundNum(n));
        }
        if (valid.length % 2 === 1) valid.pop();
        return { type: name, points: valid };
      }
      case 'path': {
        try {
          return { type: 'path', d: normalizePath(el.getAttribute('d') ?? '') };
        } catch (e) {
          if (e instanceof PathParseError) return 'raw';
          throw e;
        }
      }
      case 'text': {
        // Single-line text only: per-glyph positioning lists and dx/dy stay raw.
        const xs = (el.getAttribute('x') ?? '').trim().split(/[\s,]+/).filter(Boolean);
        const ys = (el.getAttribute('y') ?? '').trim().split(/[\s,]+/).filter(Boolean);
        if (xs.length > 1 || ys.length > 1 || el.hasAttribute('dx') || el.hasAttribute('dy') || el.hasAttribute('rotate')) return 'raw';
        if (el.getAttributeNS('http://www.w3.org/XML/1998/namespace', 'space') === 'preserve') return 'raw';
        const text = (el.textContent ?? '').replace(/\s+/g, ' ').trim();
        return { type: 'text', x: L('x', 'x'), y: L('y', 'y'), text };
      }
      case 'image': {
        const href = (el.getAttribute('href') ?? el.getAttributeNS(XLINK_NS, 'href') ?? '').trim();
        if (!IMAGE_HREF_PATTERN.test(href)) {
          this.warn('external_reference_removed', '<image>');
          return null;
        }
        const out: Record<string, unknown> = { type: 'image', x: L('x', 'x'), y: L('y', 'y'), width: pos(L('width', 'x')), height: pos(L('height', 'y')), href };
        const par = el.getAttribute('preserveAspectRatio')?.trim();
        if (par) out.preserveAspectRatio = par;
        return out;
      }
      case 'use': {
        const href = (el.getAttribute('href') ?? el.getAttributeNS(XLINK_NS, 'href') ?? '').trim();
        if (!href.startsWith('#') || !VECTOR_ID_PATTERN.test(href.slice(1))) {
          this.warn('external_reference_removed', '<use>');
          return null;
        }
        const out: Record<string, unknown> = { type: 'use', ref: href.slice(1) };
        if (el.hasAttribute('x')) out.x = L('x', 'x');
        if (el.hasAttribute('y')) out.y = L('y', 'y');
        if (el.hasAttribute('width')) out.width = pos(L('width', 'x'));
        if (el.hasAttribute('height')) out.height = pos(L('height', 'y'));
        return out;
      }
    }
    return 'raw';
  }

  // ---- defs ----

  private frac(el: Element, attr: string, bbox: boolean, axis: 'x' | 'y' | 'r', fallback: number): number {
    const l = parseLengthRaw(el.getAttribute(attr));
    if (!l) return fallback;
    if (l.percent) {
      if (bbox) return roundNum(l.n / 100);
      const base = axis === 'x' ? this.vb.width : axis === 'y' ? this.vb.height : Math.sqrt((this.vb.width ** 2 + this.vb.height ** 2) / 2);
      return roundNum((l.n / 100) * base);
    }
    return roundNum(l.n);
  }

  private gradient(el: Element, id: string): Gradient | null {
    const resolved = resolveGradientHref(el);
    const get = (a: string) => resolved.attr(a);
    const units = get('gradientUnits') === 'userSpaceOnUse' ? ('userSpaceOnUse' as const) : undefined;
    const bbox = units === undefined;
    const proxy = { getAttribute: get } as unknown as Element;
    const stops: GradientStop[] = [];
    let last = 0;
    for (const s of resolved.stops) {
      if (s.localName !== 'stop' || elementChildren(s).length > 0) return null;
      const off = parseLengthRaw(s.getAttribute('offset'));
      let offset = off ? (off.percent ? off.n / 100 : off.n) : 0;
      offset = roundNum(Math.min(1, Math.max(last, offset)));
      last = offset;
      const rawColor = s.getAttribute('stop-color')?.trim() || 'black';
      const stop: GradientStop = { offset, color: isSafeColor(rawColor) ? rawColor : 'black' };
      const op = parseStyleValue(s.getAttribute('stop-opacity') ?? '', 'unit');
      if (typeof op === 'number' && op !== 1) stop.opacity = op;
      stops.push(stop);
    }
    for (const child of elementChildren(el)) if (child.localName !== 'stop') return null;
    let gradientTransform: Gradient['gradientTransform'];
    const gt = get('gradientTransform');
    if (gt) {
      const ops = parseTransformList(gt);
      if (!ops) return null;
      gradientTransform = opsToMatrix(ops).map(roundNum) as unknown as Gradient['gradientTransform'];
    }
    const spread = get('spreadMethod');
    const spreadMethod = spread === 'reflect' || spread === 'repeat' ? (spread as 'reflect' | 'repeat') : undefined;
    const common = { id, ...(units ? { units } : {}) };
    const tail = { stops, ...(spreadMethod ? { spreadMethod } : {}), ...(gradientTransform ? { gradientTransform } : {}) };
    if (el.localName.toLowerCase() === 'lineargradient') {
      return {
        type: 'linear',
        ...common,
        x1: this.frac(proxy, 'x1', bbox, 'x', 0),
        y1: this.frac(proxy, 'y1', bbox, 'y', 0),
        x2: this.frac(proxy, 'x2', bbox, 'x', bbox ? 1 : this.vb.width),
        y2: this.frac(proxy, 'y2', bbox, 'y', 0),
        ...tail,
      };
    }
    const half = (axis: 'x' | 'y' | 'r') => (bbox ? 0.5 : axis === 'x' ? this.vb.width / 2 : axis === 'y' ? this.vb.height / 2 : Math.sqrt((this.vb.width ** 2 + this.vb.height ** 2) / 2) / 2);
    const out: RadialGradient = {
      type: 'radial',
      ...common,
      cx: this.frac(proxy, 'cx', bbox, 'x', half('x')),
      cy: this.frac(proxy, 'cy', bbox, 'y', half('y')),
      r: Math.max(0, this.frac(proxy, 'r', bbox, 'r', half('r'))),
      ...tail,
    };
    if (get('fx') !== null) out.fx = this.frac(proxy, 'fx', bbox, 'x', out.cx);
    if (get('fy') !== null) out.fy = this.frac(proxy, 'fy', bbox, 'y', out.cy);
    if (get('fr') !== null) out.fr = Math.max(0, this.frac(proxy, 'fr', bbox, 'r', 0));
    // Re-order to schema order: stops/spread/transform after the geometry.
    const { stops: st, spreadMethod: sm, gradientTransform: gtm, ...geo } = out;
    return { ...geo, stops: st, ...(sm ? { spreadMethod: sm } : {}), ...(gtm ? { gradientTransform: gtm } : {}) } as Gradient;
  }

  private mask(el: Element, id: string, depth: number): VectorMask | null {
    const units = el.getAttribute('maskUnits') === 'userSpaceOnUse' ? ('userSpaceOnUse' as const) : undefined;
    const contentUnits = el.getAttribute('maskContentUnits') === 'objectBoundingBox' ? ('objectBoundingBox' as const) : undefined;
    const bbox = units === undefined;
    const out: VectorMask = { id, layers: [] };
    if (units) out.units = units;
    if (contentUnits) out.contentUnits = contentUnits;
    for (const [a, axis] of [['x', 'x'], ['y', 'y'], ['width', 'x'], ['height', 'y']] as const) {
      if (el.hasAttribute(a)) out[a] = this.frac(el, a, bbox, axis, 0);
    }
    out.layers = this.convertChildren(el, depth + 1);
    const { layers, ...rest } = out;
    return { ...rest, layers };
  }

  private clipPath(el: Element, id: string, depth: number): VectorClipPath | null {
    if (elementChildren(el).some((c) => c.localName === 'g')) return null;
    const out: VectorClipPath = { id, layers: [] };
    if (el.getAttribute('clipPathUnits') === 'objectBoundingBox') out.units = 'objectBoundingBox';
    const t = el.getAttribute('transform');
    if (t) {
      const ops = parseTransformList(t);
      if (!ops) return null;
      out.transform = opsToMatrix(ops).map(roundNum) as unknown as VectorClipPath['transform'];
    }
    const layers = this.convertChildren(el, depth + 1);
    const { layers: _l, ...rest } = out;
    void _l;
    return { ...rest, layers };
  }

  /** Exactly one `<feGaussianBlur stdDeviation="n">` on SourceGraphic; anything else stays raw. */
  private blurFilter(el: Element, id: string): VectorFilter | null {
    const kids = elementChildren(el);
    if (kids.length !== 1 || kids[0].localName !== 'feGaussianBlur') return null;
    const blur = kids[0];
    if (elementChildren(blur).length > 0) return null;
    for (const a of Array.from(blur.attributes)) {
      if (!['stdDeviation', 'in', 'result', 'edgeMode'].includes(a.name)) return null;
    }
    const inAttr = blur.getAttribute('in');
    if (inAttr && inAttr !== 'SourceGraphic') return null;
    const edge = blur.getAttribute('edgeMode');
    if (edge && edge !== 'none' && edge !== 'duplicate') return null;
    const sd = parseNumber(blur.getAttribute('stdDeviation'));
    if (!Number.isFinite(sd) || sd < 0) return null;
    for (const a of Array.from(el.attributes)) {
      if (!['id', 'x', 'y', 'width', 'height'].includes(a.name)) return null;
    }
    const region = (a: string) => {
      const v = el.getAttribute(a)?.trim();
      return v && /^-?(\d+\.?\d*|\.\d+)%?$/.test(v) ? v : undefined;
    };
    const out: VectorFilter = { type: 'blur', id, stdDeviation: roundNum(sd) };
    for (const a of ['x', 'y', 'width', 'height'] as const) {
      const v = region(a);
      if (v !== undefined) out[a] = v;
    }
    return out;
  }

  private symbol(el: Element, id: string, depth: number): VectorSymbol | null {
    const out: VectorSymbol = { id, layers: [] };
    const vbAttr = el.getAttribute('viewBox');
    if (vbAttr) {
      const p = vbAttr.trim().split(/[\s,]+/).map(Number);
      if (p.length !== 4 || !p.every(Number.isFinite) || p[2] <= 0 || p[3] <= 0) return null;
      out.viewBox = { x: roundNum(p[0]), y: roundNum(p[1]), width: roundNum(p[2]), height: roundNum(p[3]) };
    }
    const par = el.getAttribute('preserveAspectRatio')?.trim();
    if (par) out.preserveAspectRatio = par;
    const layers = this.convertChildren(el, depth + 1);
    const { layers: _l, ...rest } = out;
    void _l;
    return { ...rest, layers };
  }
}

/** Attributes the geometry of each element consumes (never copied into attrs). */
const GEOMETRY_ATTRS: Record<string, Set<string>> = {
  g: new Set(),
  rect: new Set(['x', 'y', 'width', 'height', 'rx', 'ry']),
  circle: new Set(['cx', 'cy', 'r']),
  ellipse: new Set(['cx', 'cy', 'rx', 'ry']),
  line: new Set(['x1', 'y1', 'x2', 'y2']),
  polyline: new Set(['points']),
  polygon: new Set(['points']),
  path: new Set(['d']),
  text: new Set(['x', 'y']),
  image: new Set(['x', 'y', 'width', 'height', 'href', 'preserveAspectRatio']),
  use: new Set(['x', 'y', 'width', 'height', 'href']),
};

/** Follow `href="#other"` gradient templates (Inkscape style) for attributes and stops. */
function resolveGradientHref(el: Element): { attr: (name: string) => string | null; stops: Element[] } {
  const chain: Element[] = [];
  let cur: Element | null = el;
  while (cur && !chain.includes(cur) && chain.length < 16) {
    chain.push(cur);
    const href: string | null = cur.getAttribute('href') ?? cur.getAttributeNS(XLINK_NS, 'href');
    cur = href && href.startsWith('#') ? cur.ownerDocument.getElementById(href.slice(1)) : null;
    if (cur && !/gradient$/i.test(cur.localName)) cur = null;
  }
  const attr = (name: string) => {
    for (const e of chain) {
      const v = e.getAttribute(name);
      if (v !== null) return v.trim();
    }
    return null;
  };
  const withStops = chain.find((e) => elementChildren(e).length > 0);
  return { attr, stops: withStops ? elementChildren(withStops) : [] };
}

function parseStyleValue(raw: string, kind: StyleKind): unknown {
  const v = raw.trim();
  if (!v) return undefined;
  if (kind === 'paint') {
    const p = v.replace(/\s+/g, ' ');
    return isSafePaint(p) ? p : undefined;
  }
  if (kind === 'ref') {
    if (v === 'none') return undefined;
    const ref = paintRef(v);
    return ref && VECTOR_ID_PATTERN.test(ref) ? ref : undefined;
  }
  if (kind === 'unit') {
    const l = parseLengthRaw(v);
    if (!l) return undefined;
    return roundNum(Math.min(1, Math.max(0, l.percent ? l.n / 100 : l.n)));
  }
  if (kind === 'number' || kind === 'positive') {
    const l = parseLengthRaw(v);
    if (!l || l.percent) return undefined;
    if (kind === 'positive' && l.n < 0) return undefined;
    return roundNum(l.n);
  }
  if (kind === 'dash') {
    if (v === 'none') return [];
    const parts = v.split(/[\s,]+/).map((p) => parseLengthRaw(p));
    if (parts.some((p) => !p || p.percent || p.n < 0)) return undefined;
    return parts.map((p) => roundNum(p!.n));
  }
  return kind.enum.includes(v) ? v : undefined;
}

// ---------------------------------------------------------------------------
// 6. repair
// ---------------------------------------------------------------------------

function repair(doc: VectorDoc, warn: Warn): void {
  for (let pass = 0; pass < 4; pass++) {
    const rawIds = new Set<string>();
    const layerIds = new Set<string>();
    forEachLayer(doc, (l) => {
      layerIds.add(l.id);
      if (l.type === 'raw') for (const id of l.ids ?? []) rawIds.add(id);
    });
    const has = (bucket: Array<{ id: string }>, id: string) => bucket.some((x) => x.id === id) || rawIds.has(id);
    let changed = false;

    const fix = (layers: Layer[]): Layer[] => {
      const out: Layer[] = [];
      for (const layer of layers) {
        if (layer.type === 'raw') {
          if (layer.markup !== '') out.push(layer);
          continue;
        }
        const l = layer as AnyLayer;
        for (const key of ['fill', 'stroke'] as const) {
          const paint = l[key] as string | undefined;
          if (paint && /url\(/i.test(paint)) {
            const ref = paintRef(paint);
            if (!ref || !has(doc.defs.gradients, ref)) {
              warn('dangling_reference', `${key} → ${ref ?? paint}`);
              const fallback = paint.replace(/^url\([^)]*\)\s*/, '').trim();
              l[key] = fallback || 'none';
              changed = true;
            }
          }
        }
        const refs = [
          ['mask', doc.defs.masks],
          ['clipPath', doc.defs.clipPaths],
          ['filter', doc.defs.filters],
        ] as const;
        for (const [key, bucket] of refs) {
          const ref = l[key] as string | undefined;
          if (ref && !has(bucket, ref)) {
            warn('dangling_reference', `${key} → ${ref}`);
            delete l[key];
            changed = true;
          }
        }
        if (layer.type === 'use') {
          const ok = doc.defs.symbols.some((s) => s.id === layer.ref) || layerIds.has(layer.ref) || rawIds.has(layer.ref);
          if (!ok || layer.ref === layer.id) {
            warn('dangling_reference', `use → ${layer.ref}`);
            changed = true;
            continue;
          }
        }
        if (layer.type === 'group') (l as unknown as { children: Layer[] }).children = fix(layer.children);
        out.push(layer);
      }
      return out;
    };
    doc.layers = fix(doc.layers);
    for (const m of doc.defs.masks) m.layers = fix(m.layers);
    for (const c of doc.defs.clipPaths) c.layers = fix(c.layers);
    for (const s of doc.defs.symbols) s.layers = fix(s.layers);
    if (!changed) break;
  }
  // `use` cycles: drop every use that participates in one.
  const problems = vectorDocSchema.safeParse(doc);
  if (!problems.success && problems.error.issues.some((i) => /use element references itself/.test(i.message))) {
    const dropUses = (layers: Layer[]): Layer[] =>
      layers
        .filter((l) => {
          if (l.type !== 'use') return true;
          warn('dangling_reference', `use → ${l.ref} (cycle)`);
          return false;
        })
        .map((l) => (l.type === 'group' ? { ...l, children: dropUses(l.children) } : l));
    doc.defs.symbols = doc.defs.symbols.map((s) => ({ ...s, layers: dropUses(s.layers) }));
    doc.layers = dropUses(doc.layers);
  }
}
