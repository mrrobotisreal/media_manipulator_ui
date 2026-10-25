/**
 * Safe preview of a `raw` layer's markup inside the editor.
 *
 * Raw markup is NEVER handed to `innerHTML`: that would run it through the
 * HTML fragment parser, which disagrees with the XML parser the importer
 * sanitised with (CDATA, foreign-content breakouts, entity decoding). Instead
 * the markup is parsed as XML and rebuilt node by node with
 * `createElementNS` / `setAttribute` / `createTextNode`, keeping only an
 * allowlist of SVG elements and attributes. No HTML is ever created:
 * `foreignObject` content is not previewed (it still round-trips in the
 * model and the export).
 *
 * Ids inside the markup are prefixed like the rest of the canvas render
 * (`idPrefix`), and `url(#…)` / `href="#…"` references are rewritten to match.
 */
import { SVG_NS } from '@/lib/vector/svgMap';
import { rawMarkupIssues } from '@/lib/vector/vectorTypes';

const ELEMENTS = new Set([
  'g', 'path', 'rect', 'circle', 'ellipse', 'line', 'polyline', 'polygon', 'text', 'tspan', 'textPath',
  'image', 'use', 'defs', 'symbol', 'linearGradient', 'radialGradient', 'stop', 'pattern', 'mask',
  'clipPath', 'marker', 'filter', 'switch', 'svg', 'title', 'desc', 'mpath',
  'animate', 'animateTransform', 'animateMotion',
  'feBlend', 'feColorMatrix', 'feComponentTransfer', 'feComposite', 'feConvolveMatrix', 'feDiffuseLighting',
  'feDisplacementMap', 'feDistantLight', 'feDropShadow', 'feFlood', 'feFuncA', 'feFuncB', 'feFuncG', 'feFuncR',
  'feGaussianBlur', 'feMerge', 'feMergeNode', 'feMorphology', 'feOffset', 'fePointLight', 'feSpecularLighting',
  'feSpotLight', 'feTile', 'feTurbulence',
]);
/** Previewed as a plain group (their behaviour is dropped, children kept). */
const AS_GROUP = new Set(['a']);
const TEXT_PARENTS = new Set(['text', 'tspan', 'textPath', 'title', 'desc']);

const UNSAFE_VALUE = /javascript:|vbscript:|data:text\/html|expression\(|@import|image-set\(|\\|url\(\s*['"]?(?!#)/i;
const HREF_OK = /^(#[A-Za-z_][\w-]*|data:image\/(png|jpeg|gif|webp|avif);base64,[A-Za-z0-9+/=\s]*)$/;

function safeAttr(el: string, name: string, value: string): boolean {
  const n = name.toLowerCase();
  if (n.startsWith('on') || n === 'style' && UNSAFE_VALUE.test(value)) return false;
  if (n === 'srcdoc' || n === 'formaction' || n === 'srcset' || n.startsWith('xmlns')) return false;
  if (n === 'href' || n === 'xlink:href' || n === 'src') return HREF_OK.test(value.trim()) && !(el === 'use' && value.trim().startsWith('data:'));
  if (n === 'attributename' && /^\s*(xlink:)?href\s*$/i.test(value)) return false;
  return !UNSAFE_VALUE.test(value);
}

function rewrite(value: string, prefix: string): string {
  if (!prefix) return value;
  return value.replace(/url\(\s*(['"]?)#([A-Za-z_][\w-]*)\1\s*\)/g, (_m, _q, id: string) => `url(#${prefix}${id})`);
}

/**
 * Build safe SVG DOM nodes for a raw layer, or [] when the markup fails the
 * shared `rawMarkupIssues` rules or does not parse.
 */
export function buildRawNodes(markup: string, prefix: string, doc: Document = document): Node[] {
  if (!markup || rawMarkupIssues(markup).length > 0) return [];
  const parsed = new DOMParser().parseFromString(`<svg xmlns="${SVG_NS}">${markup}</svg>`, 'image/svg+xml');
  if (parsed.getElementsByTagName('parsererror').length > 0) return [];
  const out: Node[] = [];
  const copy = (src: Element): Element | null => {
    if (src.namespaceURI !== SVG_NS) return null;
    const name = src.localName;
    if (!ELEMENTS.has(name) && !AS_GROUP.has(name)) return null;
    if ((name === 'animate' || name === 'set') && /^\s*(xlink:)?href\s*$/i.test(src.getAttribute('attributeName') ?? '')) return null;
    const el = doc.createElementNS(SVG_NS, AS_GROUP.has(name) ? 'g' : name);
    for (const attr of Array.from(src.attributes)) {
      if (AS_GROUP.has(name) && /href$/i.test(attr.name)) continue;
      if (!safeAttr(name, attr.name, attr.value)) continue;
      let value = rewrite(attr.value, prefix);
      if (attr.name === 'id') value = `${prefix}${attr.value}`;
      if (/(^|:)href$/i.test(attr.name) && value.startsWith('#')) value = `#${prefix}${value.slice(1)}`;
      if (attr.name === 'xlink:href') el.setAttribute('href', value);
      else el.setAttribute(attr.name, value);
    }
    for (const child of Array.from(src.childNodes)) {
      if (child.nodeType === 1) {
        const c = copy(child as Element);
        if (c) el.appendChild(c);
      } else if (child.nodeType === 3 && TEXT_PARENTS.has(name)) {
        el.appendChild(doc.createTextNode(child.nodeValue ?? ''));
      }
      // CDATA (4), comments, processing instructions: never copied.
    }
    return el;
  };
  for (const node of Array.from(parsed.documentElement.childNodes)) {
    if (node.nodeType !== 1) continue;
    const c = copy(node as Element);
    if (c) out.push(c);
  }
  return out;
}
