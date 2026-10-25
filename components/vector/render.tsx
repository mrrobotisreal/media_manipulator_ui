'use client';

import * as React from 'react';

import { matrixToAttr, transformToAttr } from '@/lib/vector/geometry';
import { STYLE_FIELDS, TEXT_FIELDS } from '@/lib/vector/svgMap';
import {
  rawMarkupIssues,
  type Gradient,
  type Layer,
  type VectorDoc,
} from '@/lib/vector/vectorTypes';

/**
 * Renders a `VectorDoc` as React SVG elements, FROM THE MODEL: imported
 * markup never reaches the DOM except a `raw` layer's markup, which the
 * importer has already sanitised and which is re-checked with
 * `rawMarkupIssues` before it is mounted (inside the editor's own `<svg>`,
 * an inert, script-free context).
 *
 * Each editable layer carries `data-layer-id` so the canvas can hit-test with
 * `elementFromPoint` / `closest()`.
 */

/** camelCase React prop names for SVG attributes the model writes. */
const REACT_PROP: Record<string, string> = {
  'fill-opacity': 'fillOpacity',
  'fill-rule': 'fillRule',
  'stroke-width': 'strokeWidth',
  'stroke-opacity': 'strokeOpacity',
  'stroke-linecap': 'strokeLinecap',
  'stroke-linejoin': 'strokeLinejoin',
  'stroke-miterlimit': 'strokeMiterlimit',
  'stroke-dasharray': 'strokeDasharray',
  'stroke-dashoffset': 'strokeDashoffset',
  'clip-rule': 'clipRule',
  'clip-path': 'clipPath',
  'font-family': 'fontFamily',
  'font-size': 'fontSize',
  'font-weight': 'fontWeight',
  'font-style': 'fontStyle',
  'text-anchor': 'textAnchor',
  'letter-spacing': 'letterSpacing',
  'stop-color': 'stopColor',
  'stop-opacity': 'stopOpacity',
};

const toReactName = (attr: string) =>
  attr.startsWith('data-') ? attr : REACT_PROP[attr] ?? attr.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());

type Props = Record<string, string | number | undefined>;

function styleProps(layer: Exclude<Layer, { type: 'raw' }>, prefix: string): Props {
  const out: Props = {};
  const rec = layer as unknown as Record<string, unknown>;
  for (const [field, attr, kind] of STYLE_FIELDS) {
    const v = rec[field];
    if (v === undefined) continue;
    const name = toReactName(attr);
    if (kind === 'ref') out[name] = `url(#${prefix}${String(v)})`;
    else if (kind === 'dash') out[name] = (v as number[]).length ? (v as number[]).join(' ') : 'none';
    else if (kind === 'paint') out[name] = prefixPaint(String(v), prefix);
    else out[name] = v as string | number;
  }
  for (const [k, v] of Object.entries(layer.attrs ?? {})) {
    if (k === 'class') continue; // classes target stylesheets we never mount
    out[toReactName(k)] = v;
  }
  const t = transformToAttr(layer.transform);
  if (t) out.transform = t;
  if (layer.hidden) out.display = 'none';
  return out;
}

function prefixPaint(paint: string, prefix: string): string {
  return prefix ? paint.replace(/url\(\s*#/g, `url(#${prefix}`) : paint;
}

export interface RenderOptions {
  /** Prefix for every defs id, so two renders of one doc on a page never collide. */
  idPrefix?: string;
  /** Mark editable layers for hit-testing. */
  interactive?: boolean;
}

export function LayerNodes({ layers, opts }: { layers: Layer[]; opts: RenderOptions }) {
  return (
    <>
      {layers.map((l) => (
        <LayerNode key={l.id} layer={l} opts={opts} />
      ))}
    </>
  );
}

const LayerNode = React.memo(function LayerNode({ layer, opts }: { layer: Layer; opts: RenderOptions }) {
  const prefix = opts.idPrefix ?? '';
  if (layer.type === 'raw') {
    if (!layer.markup || rawMarkupIssues(layer.markup).length > 0) return null;
    // Sanitised on import, re-checked above; rendered inside our own <svg>.
    return <g data-raw-layer={layer.id} dangerouslySetInnerHTML={{ __html: layer.markup }} />;
  }
  const common: Props = { ...styleProps(layer, prefix), id: `${prefix}${layer.id}` };
  if (opts.interactive) common['data-layer-id'] = layer.id;
  switch (layer.type) {
    case 'group':
      return (
        <g {...common}>
          <LayerNodes layers={layer.children} opts={opts} />
        </g>
      );
    case 'rect':
      return <rect {...common} x={layer.x} y={layer.y} width={layer.width} height={layer.height} rx={layer.rx} ry={layer.ry} />;
    case 'ellipse':
      return <ellipse {...common} cx={layer.cx} cy={layer.cy} rx={layer.rx} ry={layer.ry} />;
    case 'line':
      return <line {...common} x1={layer.x1} y1={layer.y1} x2={layer.x2} y2={layer.y2} />;
    case 'polyline':
      return <polyline {...common} points={layer.points.join(' ')} />;
    case 'polygon':
      return <polygon {...common} points={layer.points.join(' ')} />;
    case 'path':
      return <path {...common} d={layer.d} />;
    case 'text': {
      const rec = layer as unknown as Record<string, unknown>;
      const text: Props = {};
      for (const [field, attr] of TEXT_FIELDS) if (rec[field] !== undefined) text[toReactName(attr)] = rec[field] as string | number;
      return (
        <text {...common} {...text} x={layer.x} y={layer.y}>
          {layer.text}
        </text>
      );
    }
    case 'image':
      return (
        <image
          {...common}
          x={layer.x}
          y={layer.y}
          width={layer.width}
          height={layer.height}
          href={layer.href.startsWith('data:') ? layer.href : undefined}
          preserveAspectRatio={layer.preserveAspectRatio}
        />
      );
    case 'use':
      return <use {...common} href={`#${prefix}${layer.ref}`} x={layer.x} y={layer.y} width={layer.width} height={layer.height} />;
  }
});

function GradientNode({ g, prefix }: { g: Gradient; prefix: string }) {
  const stops = g.stops.map((s, i) => <stop key={i} offset={s.offset} stopColor={s.color} stopOpacity={s.opacity} />);
  const common = {
    id: `${prefix}${g.id}`,
    gradientUnits: g.units,
    spreadMethod: g.spreadMethod,
    gradientTransform: g.gradientTransform ? matrixToAttr(g.gradientTransform) : undefined,
  };
  return g.type === 'linear' ? (
    <linearGradient {...common} x1={g.x1} y1={g.y1} x2={g.x2} y2={g.y2}>
      {stops}
    </linearGradient>
  ) : (
    <radialGradient {...common} cx={g.cx} cy={g.cy} r={g.r} fx={g.fx} fy={g.fy} fr={g.fr}>
      {stops}
    </radialGradient>
  );
}

/** `<defs>` for a document. Mask/clip/symbol contents render non-interactively. */
export function DefsNodes({ doc, opts }: { doc: VectorDoc; opts: RenderOptions }) {
  const prefix = opts.idPrefix ?? '';
  const inner: RenderOptions = { idPrefix: prefix, interactive: false };
  const d = doc.defs;
  return (
    <defs>
      {d.gradients.map((g) => (
        <GradientNode key={g.id} g={g} prefix={prefix} />
      ))}
      {d.masks.map((m) => (
        <mask key={m.id} id={`${prefix}${m.id}`} maskUnits={m.units} maskContentUnits={m.contentUnits} x={m.x} y={m.y} width={m.width} height={m.height}>
          <LayerNodes layers={m.layers} opts={inner} />
        </mask>
      ))}
      {d.clipPaths.map((c) => (
        <clipPath key={c.id} id={`${prefix}${c.id}`} clipPathUnits={c.units} transform={c.transform ? matrixToAttr(c.transform) : undefined}>
          <LayerNodes layers={c.layers} opts={inner} />
        </clipPath>
      ))}
      {d.filters.map((f) => (
        <filter key={f.id} id={`${prefix}${f.id}`} x={f.x} y={f.y} width={f.width} height={f.height}>
          <feGaussianBlur stdDeviation={f.stdDeviation} />
        </filter>
      ))}
      {d.symbols.map((s) => (
        <symbol
          key={s.id}
          id={`${prefix}${s.id}`}
          viewBox={s.viewBox ? `${s.viewBox.x} ${s.viewBox.y} ${s.viewBox.width} ${s.viewBox.height}` : undefined}
          preserveAspectRatio={s.preserveAspectRatio}
        >
          <LayerNodes layers={s.layers} opts={inner} />
        </symbol>
      ))}
    </defs>
  );
}
