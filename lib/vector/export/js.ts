/**
 * `VectorDoc` → a plain ES module (MM46 decision 6), `.js` or `.ts`.
 *
 * Framework-free: the module holds the animated SVG as a string array and
 * exports `mount(el)`, `play()`, `pause()`, `seek(ms)` over one mounted
 * instance. `mount` parses the markup with `DOMParser` and appends the
 * imported node (never `innerHTML`).
 *   - `css`:   the markup is the CSS animated SVG; transport goes through the
 *              Web Animations API (`svg.getAnimations({ subtree: true })`).
 *   - `anime`: frame-0 markup, the spec and the player; transport is the
 *              anime.js timeline. Imports `animejs`.
 * The `.ts` variant only adds type annotations. Deterministic (no date).
 */
import { serializeSvg } from '@/lib/vector/exportSvg';
import { sampleDoc } from '@/lib/vector/sampleTrack';
import type { VectorDoc } from '@/lib/vector/vectorTypes';
import { AnimeExportError, buildAnimeSpec, canExportAnime } from './anime';
import { codeFileBase, codeHeader, jsString, jsonLiteral, typedPlayerSource } from './codeEscape';
import { chooseRuntime, type AnimeReason } from './chooseRuntime';
import { PLAYER_SOURCE } from './animePlayer';
import { CssExportError, canExportCss, exportAnimatedSvgCss } from './css';

export interface JsExportOptions {
  typescript: boolean;
  /** Project name: the file name. */
  name?: string;
  forceAnime?: boolean;
}

export interface JsExportResult {
  code: string;
  fileName: string;
  runtime: 'css' | 'anime';
  reasons: AnimeReason[];
}

export function exportJsModule(doc: VectorDoc, opts: JsExportOptions): JsExportResult {
  const { runtime, reasons } = chooseRuntime(doc, { forceAnime: opts.forceAnime });
  if (runtime === 'css') {
    const check = canExportCss(doc);
    if (!check.ok) throw new CssExportError(check.issues);
  } else {
    const check = canExportAnime(doc);
    if (!check.ok) throw new AnimeExportError(check.issues);
  }
  const ts = opts.typescript;
  const t = (annotation: string) => (ts ? annotation : '');

  let svgText: string;
  if (runtime === 'css') {
    const full = exportAnimatedSvgCss(doc);
    svgText = full.slice(full.indexOf('\n') + 1); // drop the generated-by comment line
  } else {
    svgText = serializeSvg(sampleDoc(doc, 0));
  }
  const svgLines = svgText.replace(/\n$/, '').split('\n');

  const out: string[] = [codeHeader(runtime), ''];
  if (runtime === 'anime') out.push("import { createTimeline, cubicBezier, steps } from 'animejs';", '');
  out.push('const SVG = [', ...svgLines.map((l) => `  ${jsString(l)},`), "].join('\\n');", '');
  if (runtime === 'anime') out.push(`const SPEC = ${jsonLiteral(buildAnimeSpec(doc))};`, '', ts ? typedPlayerSource() : PLAYER_SOURCE, '');

  out.push(`let svg${t(': SVGSVGElement | null')} = null;`);
  if (runtime === 'anime') out.push(`let handle${t(': any')} = null;`);
  out.push('');
  out.push('/** Append the animation to el (replacing a previously mounted instance) and return the <svg>. */');
  out.push(`export function mount(el${t(': Element')})${t(': SVGSVGElement')} {`);
  out.push('  unmount();');
  out.push("  const parsed = new DOMParser().parseFromString(SVG, 'image/svg+xml');");
  out.push(`  const node = document.importNode(parsed.documentElement, true)${t(' as unknown as SVGSVGElement')};`);
  out.push('  el.appendChild(node);');
  out.push('  svg = node;');
  if (runtime === 'anime') {
    out.push(`  handle = runPlayer({ createTimeline, cubicBezier, steps }, SPEC, { getElementById: (id${t(': string')}) => node.querySelector('#' + id) });`);
  }
  out.push('  return node;', '}', '');

  out.push(`function unmount()${t(': void')} {`);
  if (runtime === 'anime') out.push('  if (handle) handle.timeline.pause();', '  handle = null;');
  out.push('  if (svg && svg.parentNode) svg.parentNode.removeChild(svg);', '  svg = null;', '}', '');

  if (runtime === 'css') {
    out.push(`function animations()${t(': Animation[]')} {`, '  return svg ? svg.getAnimations({ subtree: true }) : [];', '}', '');
    out.push(`export function play()${t(': void')} {`, '  for (const a of animations()) a.play();', '}', '');
    out.push(`export function pause()${t(': void')} {`, '  for (const a of animations()) a.pause();', '}', '');
    out.push(`export function seek(ms${t(': number')})${t(': void')} {`, '  for (const a of animations()) a.currentTime = ms;', '}', '');
  } else {
    out.push(`export function play()${t(': void')} {`, '  if (handle) handle.timeline.play();', '}', '');
    out.push(`export function pause()${t(': void')} {`, '  if (handle) handle.timeline.pause();', '}', '');
    out.push(`export function seek(ms${t(': number')})${t(': void')} {`, '  if (handle) handle.timeline.seek(ms);', '}', '');
  }
  return { code: out.join('\n').replace(/\n+$/, '\n'), fileName: `${codeFileBase(opts.name)}.${ts ? 'ts' : 'js'}`, runtime, reasons };
}
