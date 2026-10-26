/**
 * `VectorDoc` → a React/TSX component (MM46 decision 5).
 *
 * The component is the animated SVG as JSX plus its runtime:
 *   - `css`:   the keyframes in a `<style>` child (the same CSS the animated
 *              SVG export writes); nothing but `react` is imported.
 *   - `anime`: frame-0 markup, the spec, and the typed anime.js player driven
 *              by a `useEffect` on a ref-scoped root (several instances on
 *              one page stay independent); imports `animejs`.
 *
 * Safety: markup comes from `svgTree` (the serializer's own tree), every
 * attribute value and text child is emitted as `{<jsString>}` — never raw
 * JSX text or attribute strings — and raw (opaque markup) layers are skipped
 * with a warning instead of `dangerouslySetInnerHTML`. Deterministic: no date,
 * no randomness.
 */
import { svgTree, type SvgElementNode, type SvgNode } from '@/lib/vector/exportSvg';
import { sampleDoc } from '@/lib/vector/sampleTrack';
import { forEachLayer, type VectorDoc } from '@/lib/vector/vectorTypes';
import { AnimeExportError, buildAnimeSpec, canExportAnime } from './anime';
import { codeFileBase, codeHeader, jsString, jsonLiteral, toPascalIdentifier, typedPlayerSource, type CodeExportWarning } from './codeEscape';
import { chooseRuntime, type AnimeReason } from './chooseRuntime';
import { CssExportError, buildCssAnimations, canExportCss, cssText, withoutMotionTracks } from './css';

export type { CodeExportWarning };

export interface ReactExportOptions {
  /** Project name: the component and file name. */
  name?: string;
  forceAnime?: boolean;
}

export interface ReactExportResult {
  code: string;
  fileName: string;
  runtime: 'css' | 'anime';
  reasons: AnimeReason[];
  warnings: CodeExportWarning[];
}

const TAG = /^[a-zA-Z][a-zA-Z0-9]*$/;
const ATTR = /^[a-zA-Z][a-zA-Z0-9:-]*$/;

/** SVG attribute name → React prop name. */
export function reactAttrName(name: string): string {
  if (!ATTR.test(name)) throw new Error(`unsafe attribute name: ${name}`);
  if (name === 'class') return 'className';
  if (name.startsWith('data-') || name.startsWith('aria-') || name === 'xmlns') return name;
  if (name === 'xlink:href') return 'xlinkHref';
  if (name === 'xml:space') return 'xmlSpace';
  return name.replace(/-([a-zA-Z0-9])/g, (_m, c: string) => c.toUpperCase());
}

function jsx(node: SvgNode, depth: number, out: string[], extra: string[] = [], firstChild?: string): void {
  if (node.kind === 'raw') return; // reported by the caller; never emitted
  const pad = '  '.repeat(depth);
  if (!TAG.test(node.tag)) throw new Error(`unsafe tag name: ${node.tag}`);
  const attrs = node.attrs.map(([n, v]) => `${reactAttrName(n)}={${jsString(v)}}`).concat(extra);
  const open = `<${node.tag}${attrs.map((a) => ` ${a}`).join('')}`;
  const children = node.children.filter((c) => c.kind === 'element');
  if (node.text !== undefined) {
    out.push(`${pad}${open}>{${jsString(node.text)}}</${node.tag}>`);
    return;
  }
  if (children.length === 0 && firstChild === undefined) {
    out.push(`${pad}${open} />`);
    return;
  }
  out.push(`${pad}${open}>`);
  if (firstChild !== undefined) out.push(`${pad}  ${firstChild}`);
  for (const c of children) jsx(c, depth + 1, out);
  out.push(`${pad}</${node.tag}>`);
}

/** The error the exporters share with the animated SVG ones. */
function assertExportable(doc: VectorDoc, runtime: 'css' | 'anime'): void {
  if (runtime === 'css') {
    const check = canExportCss(doc);
    if (!check.ok) throw new CssExportError(check.issues);
  } else {
    const check = canExportAnime(doc);
    if (!check.ok) throw new AnimeExportError(check.issues);
  }
}

/** One warning per raw layer (its opaque markup is not emitted). */
export function rawLayerWarnings(doc: VectorDoc, target: string): CodeExportWarning[] {
  const out: CodeExportWarning[] = [];
  forEachLayer(doc, (l) => {
    if (l.type === 'raw' && l.markup) out.push({ layerId: l.id, feature: 'raw', reason: `Raw SVG markup is not included in the ${target} export.` });
  });
  return out;
}

export function exportReactComponent(doc: VectorDoc, opts: ReactExportOptions = {}): ReactExportResult {
  const { runtime, reasons } = chooseRuntime(doc, { forceAnime: opts.forceAnime });
  assertExportable(doc, runtime);
  const component = toPascalIdentifier(opts.name ?? '', 'Animation');
  const warnings = rawLayerWarnings(doc, 'React');

  const frame0 = runtime === 'css' ? sampleDoc(withoutMotionTracks(doc), 0) : sampleDoc(doc, 0);
  const root: SvgElementNode = svgTree(frame0);

  const head: string[] = [codeHeader(runtime), ''];
  const body: string[] = [];
  const hooks: string[] = [];
  let firstChild: string | undefined;

  if (runtime === 'css') {
    head.push("import type { SVGProps } from 'react';", '');
    const animations = buildCssAnimations(doc);
    if (animations.length > 0) {
      const css = cssText(doc, animations).split('\n');
      body.push('const styles = [', ...css.map((l) => `  ${jsString(l)},`), "].join('\\n');", '');
      firstChild = '<style>{styles}</style>';
    }
  } else {
    head.push("import { createTimeline, cubicBezier, steps } from 'animejs';", "import { useEffect, useRef, type SVGProps } from 'react';", '');
    body.push(`const SPEC = ${jsonLiteral(buildAnimeSpec(doc))};`, '', typedPlayerSource(), '');
    hooks.push(
      '  const ref = useRef<SVGSVGElement>(null);',
      '  useEffect(() => {',
      '    const svg = ref.current;',
      '    if (!svg) return;',
      '    const handle = runPlayer({ createTimeline, cubicBezier, steps }, SPEC, { getElementById: (id: string) => svg.querySelector(\'#\' + id) });',
      '    return () => {',
      '      handle.timeline.pause();',
      '    };',
      '  }, []);',
      '',
    );
  }

  const markup: string[] = [];
  jsx(root, 2, markup, runtime === 'anime' ? ['ref={ref}', '{...props}'] : ['{...props}'], firstChild);

  const lines = [...head, ...body, `export default function ${component}(props: SVGProps<SVGSVGElement>) {`, ...hooks, '  return (', ...markup, '  );', '}', ''];
  return { code: lines.join('\n'), fileName: `${codeFileBase(opts.name)}.tsx`, runtime, reasons, warnings };
}
