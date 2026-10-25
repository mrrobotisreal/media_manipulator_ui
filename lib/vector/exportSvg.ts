/**
 * `VectorDoc` → static SVG (Motion, code name `vector`; design §3.3 rung 1).
 *
 * Free and UNCOUNTED (§3.4): no API call, no tier check. Deterministic: the
 * same document always yields the same bytes (attribute order is the
 * `svgMap.ts` table order, numbers go through `formatNumber`, 2-space
 * indentation), and `parseSvg(serializeSvg(doc))` re-serialises to the same
 * text (golden idempotence test). Animated exporters are MM44+.
 *
 * Layout: `<svg>` → optional background rect → optional `<defs>` → layers.
 * `animations` are ignored here (static export).
 */
import { matrixToAttr, transformToAttr } from '@/lib/vector/geometry';
import { formatNumber } from '@/lib/vector/num';
import { BACKGROUND_ATTR, STYLE_FIELDS, SVG_NS, TEXT_FIELDS } from '@/lib/vector/svgMap';
import {
  DEFAULT_BACKGROUND,
  VECTOR_ID_PATTERN,
  type Gradient,
  type Layer,
  type VectorClipPath,
  type VectorDoc,
  type VectorFilter,
  type VectorMask,
  type VectorSymbol,
} from '@/lib/vector/vectorTypes';

type Attr = [name: string, value: string | number | undefined | null];

export function escapeAttr(v: string): string {
  return v.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export function escapeText(v: string): string {
  return v.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/** Defensive: the model already enforces the id pattern. */
function safeId(id: string): string {
  if (VECTOR_ID_PATTERN.test(id)) return id;
  const s = id.replace(/[^\w-]/g, '_');
  return /^[A-Za-z_]/.test(s) ? s : `_${s}`;
}

function attrText(attrs: Attr[]): string {
  let out = '';
  for (const [name, value] of attrs) {
    if (value === undefined || value === null) continue;
    const text = typeof value === 'number' ? formatNumber(value) : value;
    out += ` ${name}="${escapeAttr(text)}"`;
  }
  return out;
}

class Writer {
  private lines: string[] = [];
  line(depth: number, text: string): void {
    this.lines.push(`${'  '.repeat(depth)}${text}`);
  }
  element(depth: number, tag: string, attrs: Attr[], children?: (d: number) => void, text?: string): void {
    const open = `<${tag}${attrText(attrs)}`;
    if (text !== undefined) {
      this.line(depth, `${open}>${escapeText(text)}</${tag}>`);
      return;
    }
    if (!children) {
      this.line(depth, `${open}/>`);
      return;
    }
    const before = this.lines.length;
    this.line(depth, `${open}>`);
    children(depth + 1);
    if (this.lines.length === before + 1) this.lines[before] = `${'  '.repeat(depth)}${open}/>`;
    else this.line(depth, `</${tag}>`);
  }
  toString(): string {
    return `${this.lines.join('\n')}\n`;
  }
}

/** Serialise the document to a standalone static SVG file. */
export function serializeSvg(doc: VectorDoc): string {
  const w = new Writer();
  const vb = doc.canvas.viewBox;
  const rootAttrs: Attr[] = [
    ['xmlns', SVG_NS],
    ['width', doc.canvas.width],
    ['height', doc.canvas.height],
    ['viewBox', [vb.x, vb.y, vb.width, vb.height].map(formatNumber).join(' ')],
  ];
  w.element(0, 'svg', rootAttrs, (d) => {
    const bg = doc.canvas.background;
    if (bg && bg !== DEFAULT_BACKGROUND && bg !== 'none') {
      w.element(d, 'rect', [
        [BACKGROUND_ATTR, ''],
        ['x', vb.x],
        ['y', vb.y],
        ['width', vb.width],
        ['height', vb.height],
        ['fill', bg],
      ]);
    }
    const defs = doc.defs;
    if (defs.gradients.length + defs.masks.length + defs.clipPaths.length + defs.filters.length + defs.symbols.length > 0) {
      w.element(d, 'defs', [], (dd) => {
        for (const g of defs.gradients) writeGradient(w, dd, g);
        for (const m of defs.masks) writeMask(w, dd, m);
        for (const c of defs.clipPaths) writeClipPath(w, dd, c);
        for (const f of defs.filters) writeFilter(w, dd, f);
        for (const s of defs.symbols) writeSymbol(w, dd, s);
      });
    }
    writeLayers(w, d, doc.layers);
  });
  return w.toString();
}

function writeLayers(w: Writer, depth: number, layers: Layer[]): void {
  for (const layer of layers) writeLayer(w, depth, layer);
}

function styleAttrs(layer: Exclude<Layer, { type: 'raw' }>): Attr[] {
  const out: Attr[] = [];
  const rec = layer as unknown as Record<string, unknown>;
  for (const [field, attr, kind] of STYLE_FIELDS) {
    const v = rec[field];
    if (v === undefined) continue;
    if (kind === 'ref') out.push([attr, `url(#${safeId(String(v))})`]);
    else if (kind === 'dash') {
      const arr = v as number[];
      out.push([attr, arr.length === 0 ? 'none' : arr.map(formatNumber).join(' ')]);
    } else out.push([attr, v as string | number]);
  }
  return out;
}

function tailAttrs(layer: Exclude<Layer, { type: 'raw' }>): Attr[] {
  const out = styleAttrs(layer);
  out.push(['transform', transformToAttr(layer.transform)]);
  for (const [k, v] of Object.entries(layer.attrs ?? {})) {
    if (k === 'display' && layer.hidden) continue;
    out.push([k, v]);
  }
  if (layer.hidden) out.push(['display', 'none']);
  return out;
}

function headAttrs(layer: Layer): Attr[] {
  return [
    ['id', safeId(layer.id)],
    ['data-name', layer.name],
  ];
}

function writeLayer(w: Writer, depth: number, layer: Layer): void {
  switch (layer.type) {
    case 'raw':
      if (layer.markup) w.line(depth, layer.markup);
      return;
    case 'group':
      w.element(depth, 'g', [...headAttrs(layer), ...tailAttrs(layer)], (d) => writeLayers(w, d, layer.children));
      return;
    case 'rect':
      w.element(depth, 'rect', [
        ...headAttrs(layer),
        ['x', layer.x],
        ['y', layer.y],
        ['width', layer.width],
        ['height', layer.height],
        ['rx', layer.rx],
        ['ry', layer.ry],
        ...tailAttrs(layer),
      ]);
      return;
    case 'ellipse':
      if (layer.rx === layer.ry) {
        w.element(depth, 'circle', [...headAttrs(layer), ['cx', layer.cx], ['cy', layer.cy], ['r', layer.rx], ...tailAttrs(layer)]);
      } else {
        w.element(depth, 'ellipse', [
          ...headAttrs(layer),
          ['cx', layer.cx],
          ['cy', layer.cy],
          ['rx', layer.rx],
          ['ry', layer.ry],
          ...tailAttrs(layer),
        ]);
      }
      return;
    case 'line':
      w.element(depth, 'line', [
        ...headAttrs(layer),
        ['x1', layer.x1],
        ['y1', layer.y1],
        ['x2', layer.x2],
        ['y2', layer.y2],
        ...tailAttrs(layer),
      ]);
      return;
    case 'polyline':
    case 'polygon':
      w.element(depth, layer.type, [...headAttrs(layer), ['points', layer.points.map(formatNumber).join(' ')], ...tailAttrs(layer)]);
      return;
    case 'path':
      w.element(depth, 'path', [...headAttrs(layer), ['d', layer.d], ...tailAttrs(layer)]);
      return;
    case 'text': {
      const rec = layer as unknown as Record<string, unknown>;
      const text: Attr[] = TEXT_FIELDS.map(([field, attr]) => [attr, rec[field] as string | number | undefined]);
      w.element(depth, 'text', [...headAttrs(layer), ['x', layer.x], ['y', layer.y], ...text, ...tailAttrs(layer)], undefined, layer.text);
      return;
    }
    case 'image':
      w.element(depth, 'image', [
        ...headAttrs(layer),
        ['x', layer.x],
        ['y', layer.y],
        ['width', layer.width],
        ['height', layer.height],
        ['href', layer.href],
        ['preserveAspectRatio', layer.preserveAspectRatio],
        ...tailAttrs(layer),
      ]);
      return;
    case 'use':
      w.element(depth, 'use', [
        ...headAttrs(layer),
        ['href', `#${safeId(layer.ref)}`],
        ['x', layer.x],
        ['y', layer.y],
        ['width', layer.width],
        ['height', layer.height],
        ...tailAttrs(layer),
      ]);
      return;
  }
}

function writeGradient(w: Writer, depth: number, g: Gradient): void {
  const common: Attr[] = [['id', safeId(g.id)], ['gradientUnits', g.units]];
  const geo: Attr[] =
    g.type === 'linear'
      ? [
          ['x1', g.x1],
          ['y1', g.y1],
          ['x2', g.x2],
          ['y2', g.y2],
        ]
      : [
          ['cx', g.cx],
          ['cy', g.cy],
          ['r', g.r],
          ['fx', g.fx],
          ['fy', g.fy],
          ['fr', g.fr],
        ];
  const tail: Attr[] = [
    ['spreadMethod', g.spreadMethod],
    ['gradientTransform', g.gradientTransform ? matrixToAttr(g.gradientTransform) : undefined],
  ];
  w.element(depth, g.type === 'linear' ? 'linearGradient' : 'radialGradient', [...common, ...geo, ...tail], (d) => {
    for (const s of g.stops) {
      w.element(d, 'stop', [
        ['offset', s.offset],
        ['stop-color', s.color],
        ['stop-opacity', s.opacity],
      ]);
    }
  });
}

function writeMask(w: Writer, depth: number, m: VectorMask): void {
  w.element(
    depth,
    'mask',
    [
      ['id', safeId(m.id)],
      ['maskUnits', m.units],
      ['maskContentUnits', m.contentUnits],
      ['x', m.x],
      ['y', m.y],
      ['width', m.width],
      ['height', m.height],
    ],
    (d) => writeLayers(w, d, m.layers),
  );
}

function writeClipPath(w: Writer, depth: number, c: VectorClipPath): void {
  w.element(
    depth,
    'clipPath',
    [
      ['id', safeId(c.id)],
      ['clipPathUnits', c.units],
      ['transform', c.transform ? matrixToAttr(c.transform) : undefined],
    ],
    (d) => writeLayers(w, d, c.layers),
  );
}

function writeFilter(w: Writer, depth: number, f: VectorFilter): void {
  w.element(
    depth,
    'filter',
    [
      ['id', safeId(f.id)],
      ['x', f.x],
      ['y', f.y],
      ['width', f.width],
      ['height', f.height],
    ],
    (d) => w.element(d, 'feGaussianBlur', [['stdDeviation', f.stdDeviation]]),
  );
}

function writeSymbol(w: Writer, depth: number, s: VectorSymbol): void {
  const vb = s.viewBox;
  w.element(
    depth,
    'symbol',
    [
      ['id', safeId(s.id)],
      ['viewBox', vb ? [vb.x, vb.y, vb.width, vb.height].map(formatNumber).join(' ') : undefined],
      ['preserveAspectRatio', s.preserveAspectRatio],
    ],
    (d) => writeLayers(w, d, s.layers),
  );
}

/** Suggested download name: `<name>.svg`, filesystem-safe. */
export function svgFileName(name: string | undefined): string {
  const base = (name ?? '').trim().replace(/[\\/:*?"<>|\u0000-\u001f]+/g, '-').slice(0, 80) || 'drawing';
  return `${base}.svg`;
}
