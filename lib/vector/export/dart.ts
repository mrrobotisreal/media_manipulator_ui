/**
 * `VectorDoc` → a Flutter/Dart widget file (Motion, ticket MM46 decision 7).
 * Pure and deterministic (no dates, no randomness). Two emitters, chosen by
 * `canExportNativeFlutter(doc)`:
 *
 *   (a) WEBVIEW player: the animated SVG of the web exporters (the CSS variant
 *       of `exportAnimatedSvgCss`, or the anime.js variant of
 *       `exportAnimatedSvgAnime` when `chooseRuntime` says so) inside a tiny
 *       HTML page, shown with `webview_flutter`. Handles every document, at
 *       the price of a WebView: heavier, and the background is opaque on most
 *       platforms. JavaScript mode is `unrestricted` for the anime variant
 *       only. Research note: this is also how SVGator's Flutter export works.
 *   (b) NATIVE: `flutter_svg` + an `AnimationController`, ONLY when the
 *       document animates transform / opacity / colour (fill, stroke) /
 *       stroke width. The frame-0 markup (`svgTree(sampleDoc(doc, 0))`) is cut
 *       into constant string parts with value slots between them; each frame
 *       the widget fills the slots from a channel table and hands the string
 *       to `SvgPicture.string`. The table holds the exact pieces of
 *       `trackPieces` (linear / hold / cubic-bezier, easeBoth already split),
 *       and the Dart helpers follow the anime.js player's semantics
 *       (`PLAYER_SOURCE`): numbers lerp, colours lerp in premultiplied sRGB,
 *       the transform attribute is written exactly like `transformToAttr`
 *       (identity pieces left out, 3-decimal numbers). Time is quantised to the
 *       document fps so the number of distinct markup strings (and the
 *       flutter_svg cache entries) stays bounded.
 *
 * Why the native variant refuses what it refuses (`NativeFlutterReason`):
 * flutter_svg renders a static picture, so everything that is not "set an
 * attribute to a number / colour / transform" needs the web renderer.
 * Decision on paints: a fill / stroke key that is not a plain colour (`none`,
 * `url(#gradient)`) is allowed; between such keys, and between a colour and
 * such a key, the value HOLDS (the sampler's rule, and the player's), so the
 * `paint` reason of the first draft does not exist.
 *
 * Strings from the document (layer names in `data-name`, text content, the
 * project name) reach Dart source only through `dartString` (single-quoted
 * literal, `\`, `'`, `$`, control characters and line separators escaped) or
 * `toDartIdentifier` / `dartFileName` (ASCII, validated). Never a raw or
 * triple-quoted string, never a comment. The header uses `//` comments, so the
 * licence text can never close a block comment (Dart block comments nest).
 *
 * pub.dev facts recorded on 2026-10-26: `webview_flutter` BSD-3-Clause,
 * "Copyright 2013 The Flutter Authors", publisher flutter.dev (latest 4.14.1);
 * `flutter_svg` MIT, "Copyright (c) 2018 Dan Field", publisher flutter.dev
 * (latest 2.3.0).
 */
import { advancedKind, layerScope } from '@/lib/vector/advanced';
import { MOTION_BRAND } from '@/lib/vector/brand';
import { parseColor, formatColor } from '@/lib/vector/color';
import { escapeAttr, escapeText, svgTree, type SvgElementNode, type SvgNode } from '@/lib/vector/exportSvg';
import { resolveTransform } from '@/lib/vector/geometry';
import { isTransformProperty, transformField, type AnimatableLayer } from '@/lib/vector/properties';
import { previewTracks, sampleDoc } from '@/lib/vector/sampleTrack';
import { docLoops, forEachLayer, type Layer, type Track, type VectorDoc } from '@/lib/vector/vectorTypes';
import { ANIME_LICENSE, ANIME_VERSION } from './animeRuntime.generated';
import { exportAnimatedSvgAnime, type AnimeExportOptions } from './anime';
import { chooseRuntime, type AnimeReason } from './chooseRuntime';
import { exportAnimatedSvgCss, trackPieces } from './css';

// ---------------------------------------------------------------------------
// Dart literals, identifiers, file names
// ---------------------------------------------------------------------------

/**
 * A single-quoted Dart string literal that evaluates back to exactly `s`.
 * Escapes `\`, `'`, `$` (interpolation), `\n` `\r` `\t`, every other control
 * character, U+007F, U+2028 and U+2029 as `\u{…}`. A lone surrogate (not
 * representable in UTF-8 source) becomes U+FFFD.
 */
export function dartString(s: string): string {
  let out = "'";
  for (const ch of s) {
    const cp = ch.codePointAt(0)!;
    if (ch === '\\') out += '\\\\';
    else if (ch === "'") out += "\\'";
    else if (ch === '$') out += '\\$';
    else if (ch === '\n') out += '\\n';
    else if (ch === '\r') out += '\\r';
    else if (ch === '\t') out += '\\t';
    else if (cp < 0x20 || cp === 0x7f || cp === 0x2028 || cp === 0x2029) out += `\\u{${cp.toString(16).toUpperCase()}}`;
    else if (cp >= 0xd800 && cp <= 0xdfff) out += '\\u{FFFD}';
    else out += ch;
  }
  return `${out}'`;
}

/** Dart reserved words, built-in identifiers and contextual keywords (Dart 3). */
export const DART_RESERVED_WORDS: ReadonlySet<string> = new Set([
  'abstract', 'as', 'assert', 'async', 'await', 'base', 'break', 'case', 'catch', 'class', 'const', 'continue', 'covariant',
  'default', 'deferred', 'do', 'dynamic', 'else', 'enum', 'export', 'extends', 'extension', 'external', 'factory', 'false',
  'final', 'finally', 'for', 'function', 'get', 'hide', 'if', 'implements', 'import', 'in', 'interface', 'is', 'late',
  'library', 'mixin', 'new', 'null', 'of', 'on', 'operator', 'part', 'required', 'rethrow', 'return', 'sealed', 'set',
  'show', 'static', 'super', 'switch', 'sync', 'this', 'throw', 'true', 'try', 'type', 'typedef', 'var', 'void', 'when',
  'while', 'with', 'yield',
]);

/** Names the generated file imports or uses; a class of that name would shadow them. */
const DART_SHADOWING_NAMES: ReadonlySet<string> = new Set([
  'Animation', 'AnimationController', 'AnimatedBuilder', 'BuildContext', 'Color', 'Duration', 'Key', 'List', 'Map', 'Never',
  'Null', 'Object', 'Record', 'State', 'StatefulWidget', 'StatelessWidget', 'String', 'StringBuffer', 'SvgPicture',
  'JavaScriptMode', 'WebViewController', 'WebViewWidget', 'Widget', 'Type', 'Future', 'Function', 'Enum', 'RegExp',
  'Duration', 'Iterable', 'Set', 'double', 'int', 'num', 'bool',
]);

export function isReservedDartWord(word: string): boolean {
  return DART_RESERVED_WORDS.has(word) || DART_RESERVED_WORDS.has(word.toLowerCase());
}

/** An ASCII Dart identifier (letters and digits, starting with a letter) that is not reserved. */
export function isValidDartIdentifier(name: string): boolean {
  return /^[A-Za-z][A-Za-z0-9]*$/.test(name) && !isReservedDartWord(name);
}

/**
 * A PascalCase class name from a project name: ASCII letters and digits only,
 * words split on anything else; never reserved, never shadowing a name the
 * file uses (those get `Widget` appended), never starting with a digit or `_`.
 */
export function toDartIdentifier(name: string, fallback = 'Animation'): string {
  const words = name.split(/[^A-Za-z0-9]+/).filter((w) => w.length > 0);
  let out = words.map((w) => w[0].toUpperCase() + w.slice(1)).join('');
  if (out === '') out = fallback;
  else if (/^[0-9]/.test(out)) out = `${fallback}${out}`;
  if (!isValidDartIdentifier(out) || DART_SHADOWING_NAMES.has(out)) out = `${out}Widget`;
  return isValidDartIdentifier(out) && !DART_SHADOWING_NAMES.has(out) ? out : 'AnimationWidget';
}

/** `<snake_case>.dart`, filesystem-safe (lower-case letters, digits, `_`); `animation.dart` when nothing is left. */
export function dartFileName(name: string | undefined): string {
  let base = (name ?? '')
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 60)
    .replace(/_+$/g, '');
  if (base === '') base = 'animation';
  else if (/^[0-9]/.test(base)) base = `animation_${base}`;
  return `${base}.dart`;
}

// ---------------------------------------------------------------------------
// canExportNativeFlutter
// ---------------------------------------------------------------------------

/** Why a document needs the WebView player (i18n `vector.exportDialog.flutterReasons.<code>`), in this order. */
export const NATIVE_FLUTTER_REASONS = ['morph', 'mask', 'blur', 'motionPath', 'drawOn', 'gradient', 'symbol', 'raw'] as const;
export type NativeFlutterReason = (typeof NATIVE_FLUTTER_REASONS)[number];

/** English text of each reason (header comment; the dialog uses i18n). */
export const NATIVE_FLUTTER_REASON_TEXT: Record<NativeFlutterReason, string> = {
  morph: 'it morphs a path (d)',
  mask: 'it animates masks or clip paths',
  blur: 'it animates a blur',
  motionPath: 'it moves a layer along a motion path',
  drawOn: 'it draws strokes on (stroke-dashoffset)',
  gradient: 'it animates gradient stops',
  symbol: 'it animates layers inside symbols',
  raw: 'it contains raw SVG markup, which flutter_svg cannot be trusted with',
};

const RUNTIME_REASON_TEXT: Record<AnimeReason, string> = {
  morph: 'it morphs a path (d)',
  stopOffset: 'it animates a gradient stop offset',
  blur: 'it animates a blur',
  motionRotate: 'it rotates along a motion path around an anchor',
};

const changes = (tr: Track) => tr.keyframes.some((k) => k.value !== tr.keyframes[0].value);

export interface NativeFlutterCheck {
  ok: boolean;
  reasons: NativeFlutterReason[];
}

/**
 * Whether the native flutter_svg variant can carry the document: transform,
 * opacity, fill / stroke colour and stroke width tracks only (module comment).
 * `reasons` is empty exactly when `ok`, in `NATIVE_FLUTTER_REASONS` order.
 */
export function canExportNativeFlutter(doc: VectorDoc): NativeFlutterCheck {
  const found = new Set<NativeFlutterReason>();
  for (const tr of doc.animations) {
    if (tr.keyframes.length === 0) continue;
    switch (advancedKind(tr.property)) {
      case 'morph':
        if (changes(tr)) found.add('morph');
        break;
      case 'container':
        found.add('mask');
        break;
      case 'blur':
        if (changes(tr)) found.add('blur');
        break;
      case 'motion':
        found.add('motionPath');
        break;
      case 'dash':
        if (changes(tr)) found.add('drawOn');
        break;
      case 'stopColor':
      case 'stopOffset':
        if (changes(tr)) found.add('gradient');
        break;
      default:
        break;
    }
    const scope = layerScope(doc, tr.layerId);
    if (scope === 'mask' || scope === 'clip') found.add('mask');
    else if (scope === 'symbol') found.add('symbol');
  }
  forEachLayer(doc, (l) => {
    if (l.type === 'raw') found.add('raw');
  });
  const reasons = NATIVE_FLUTTER_REASONS.filter((r) => found.has(r));
  return { ok: reasons.length === 0, reasons };
}

// ---------------------------------------------------------------------------
// native model: markup parts + channel table
// ---------------------------------------------------------------------------

/** Transform fields in the order of the group vector (the player's `SLOTS`). */
export const TRANSFORM_FIELDS = ['x', 'y', 'scaleX', 'scaleY', 'rotation', 'skewX', 'skewY', 'anchorX', 'anchorY'] as const;

export interface NativeSegment {
  t0: number;
  t1: number;
  v0: number | string;
  v1: number | string;
  /** 'linear' | 'hold' | cubic-bezier control points. */
  ease: 'linear' | 'hold' | [number, number, number, number];
}

export interface NativeChannel {
  /** Index of the value slot between `parts[slot]` and `parts[slot + 1]`. */
  slot: number;
  /** -1: the channel's value is the slot's text; else the index in the slot's transform group (`TRANSFORM_FIELDS`). */
  field: number;
  /** Clamp range of a number channel. */
  lo: number;
  hi: number;
  segments: NativeSegment[];
  /** Where the value goes (tests / debugging). */
  layerId: string;
  property: string;
}

export interface NativeGroup {
  slot: number;
  /** The layer's frame-0 transform fields, `TRANSFORM_FIELDS` order. */
  base: number[];
  layerId: string;
}

export interface NativeModel {
  /** Constant markup between the slots; `parts.length === slots + 1`. */
  parts: string[];
  channels: NativeChannel[];
  groups: NativeGroup[];
  duration: number;
  fps: number;
  loop: boolean;
}

const r6 = (n: number) => Math.round(n * 1e6) / 1e6;

const NATIVE_ATTR: Record<string, { attr: string; lo: number; hi: number }> = {
  opacity: { attr: 'opacity', lo: 0, hi: 1 },
  fill: { attr: 'fill', lo: -Infinity, hi: Infinity },
  stroke: { attr: 'stroke', lo: -Infinity, hi: Infinity },
  strokeWidth: { attr: 'stroke-width', lo: 0, hi: Infinity },
};

function nativeSegments(track: Track, duration: number, color: boolean): NativeSegment[] {
  return trackPieces(track, duration).map((p) => {
    let ease: NativeSegment['ease'] = 'linear';
    if (p.timing.kind === 'steps') ease = 'hold';
    else if (p.timing.kind === 'cubic') ease = p.timing.curve.map(r6) as [number, number, number, number];
    const norm = (v: number | string) => {
      if (typeof v === 'number') return r6(v);
      if (!color) return v;
      const c = parseColor(v);
      return c ? formatColor(c) : v;
    };
    return { t0: r6(p.t0), t1: r6(p.t1), v0: norm(p.v0), v1: norm(p.v1), ease };
  });
}

function mapLayers(layers: Layer[], f: (l: AnimatableLayer) => AnimatableLayer): Layer[] {
  return layers.map((l) => {
    if (l.type === 'raw') return l;
    const m = f(l);
    return m.type === 'group' ? { ...m, children: mapLayers(m.children, f) } : m;
  });
}

function findElement(node: SvgNode, id: string): SvgElementNode | undefined {
  if (node.kind !== 'element') return undefined;
  if (node.attrs.some(([k, v]) => k === 'id' && v === id)) return node;
  for (const c of node.children) {
    const hit = findElement(c, id);
    if (hit) return hit;
  }
  return undefined;
}

/** The node tree as `serializeSvg` writes it (same indentation, escaping and self-closing). */
function writeTree(root: SvgElementNode): string {
  const lines: string[] = [];
  const walk = (n: SvgNode, depth: number) => {
    const pad = '  '.repeat(depth);
    if (n.kind === 'raw') {
      lines.push(`${pad}${n.markup}`);
      return;
    }
    const open = `<${n.tag}${n.attrs.map(([k, v]) => ` ${k}="${escapeAttr(v)}"`).join('')}`;
    if (n.text !== undefined) lines.push(`${pad}${open}>${escapeText(n.text)}</${n.tag}>`);
    else if (n.children.length === 0) lines.push(`${pad}${open}/>`);
    else {
      lines.push(`${pad}${open}>`);
      for (const c of n.children) walk(c, depth + 1);
      lines.push(`${pad}</${n.tag}>`);
    }
  };
  walk(root, 0);
  return `${lines.join('\n')}\n`;
}

/** The native model of a document (assumes `canExportNativeFlutter(doc).ok`; other tracks are ignored). */
export function buildNativeModel(doc: VectorDoc): NativeModel {
  const duration = doc.duration;
  const frame0 = sampleDoc(doc, 0);

  // Channels: the last track per (layer, property) wins (the sampler applies tracks in order).
  const winners = new Map<string, Track>();
  if (duration > 0) {
    for (const tr of previewTracks(doc)) {
      const attr = isTransformProperty(tr.property) || tr.property in NATIVE_ATTR;
      if (!attr || layerScope(doc, tr.layerId) !== 'tree' || !changes(tr)) continue;
      winners.set(`${tr.layerId}\u0000${tr.property}`, tr);
    }
  }
  const tracks = [...winners.values()].filter((tr) => {
    const layer = findLayerIn(frame0, tr.layerId);
    return layer !== undefined && layer.type !== 'raw';
  });

  // Markup with a placeholder per slot. The transform attribute is forced present (x shifted by 1) so the
  // slot lands exactly where `serializeSvg` writes it.
  const tfIds = new Set(tracks.filter((t) => isTransformProperty(t.property)).map((t) => t.layerId));
  const shifted: VectorDoc = {
    ...frame0,
    layers: mapLayers(frame0.layers, (l) => {
      if (!tfIds.has(l.id)) return l;
      const t = resolveTransform(l.transform);
      return { ...l, transform: { ...t, x: t.x + 1 } };
    }),
  };
  const plain = writeTree(svgTree(frame0));
  let mark = 0xe000;
  while (plain.includes(String.fromCharCode(mark)) && mark < 0xf8ff) mark++;
  const M = String.fromCharCode(mark);
  const tree = svgTree(shifted);

  interface Target {
    key: string;
    id: number;
  }
  const targets: Target[] = [];
  const place = (layerId: string, attr: string, key: string): void => {
    const el = findElement(tree, layerId);
    if (!el) return;
    const sentinel = `${M}${targets.length}${M}`;
    targets.push({ key, id: targets.length });
    const existing = el.attrs.find(([k]) => k === attr);
    if (existing) existing[1] = sentinel;
    else el.attrs.push([attr, sentinel]);
  };
  for (const id of tfIds) place(id, 'transform', `tf\u0000${id}`);
  for (const tr of tracks) {
    const spec = NATIVE_ATTR[tr.property];
    if (spec) place(tr.layerId, spec.attr, `attr\u0000${tr.layerId}\u0000${tr.property}`);
  }
  // A transform slot carries the whole attribute (` transform="…"`, empty for identity), like `transformToAttr`.
  const text = writeTree(tree).replace(new RegExp(` transform="(${M}\\d+${M})"`, 'g'), '$1');
  const parts: string[] = [];
  const slotOf = new Map<string, number>();
  const re = new RegExp(`${M}(\\d+)${M}`, 'g');
  let last = 0;
  for (let m = re.exec(text); m; m = re.exec(text)) {
    parts.push(text.slice(last, m.index));
    slotOf.set(targets[Number(m[1])].key, parts.length - 1);
    last = m.index + m[0].length;
  }
  parts.push(text.slice(last));

  const groups: NativeGroup[] = [];
  const channels: NativeChannel[] = [];
  for (const id of tfIds) {
    const slot = slotOf.get(`tf\u0000${id}`);
    const layer = findLayerIn(frame0, id) as AnimatableLayer | undefined;
    if (slot === undefined || !layer) continue;
    const t = resolveTransform(layer.transform);
    groups.push({ slot, layerId: id, base: TRANSFORM_FIELDS.map((f) => r6(t[f])) });
  }
  for (const tr of tracks) {
    if (isTransformProperty(tr.property)) {
      const slot = slotOf.get(`tf\u0000${tr.layerId}`);
      if (slot === undefined) continue;
      const field = TRANSFORM_FIELDS.indexOf(transformField(tr.property) as (typeof TRANSFORM_FIELDS)[number]);
      channels.push({ slot, field, lo: -Infinity, hi: Infinity, segments: nativeSegments(tr, duration, false), layerId: tr.layerId, property: tr.property });
    } else {
      const spec = NATIVE_ATTR[tr.property];
      const slot = slotOf.get(`attr\u0000${tr.layerId}\u0000${tr.property}`);
      if (!spec || slot === undefined) continue;
      const color = tr.property === 'fill' || tr.property === 'stroke';
      channels.push({ slot, field: -1, lo: spec.lo, hi: spec.hi, segments: nativeSegments(tr, duration, color), layerId: tr.layerId, property: tr.property });
    }
  }
  groups.sort((a, b) => a.slot - b.slot);
  return { parts, channels, groups, duration, fps: doc.fps, loop: docLoops(doc) };
}

function findLayerIn(doc: VectorDoc, id: string): Layer | undefined {
  let hit: Layer | undefined;
  forEachLayer({ layers: doc.layers, defs: { ...doc.defs, masks: [], clipPaths: [], symbols: [] } }, (l) => {
    if (!hit && l.id === id) hit = l;
  });
  return hit;
}

// ---------------------------------------------------------------------------
// header comment
// ---------------------------------------------------------------------------

const PUB_FLUTTER_SVG = [
  '  flutter_svg: ^2.0.0',
  '    MIT licence, Copyright (c) 2018 Dan Field (publisher: flutter.dev)',
];
const PUB_WEBVIEW = [
  '  webview_flutter: ^4.0.0',
  '    BSD-3-Clause licence, Copyright 2013 The Flutter Authors (publisher: flutter.dev)',
];

const comment = (lines: string[]) => lines.map((l) => (l === '' ? '//' : `// ${l}`)).join('\n');
const sentence = (reasons: string[]) => (reasons.length <= 1 ? reasons.join('') : `${reasons.slice(0, -1).join(', ')} and ${reasons[reasons.length - 1]}`);

function nativeHeader(): string {
  return comment([
    `Generated by Media Manipulator ${MOTION_BRAND}`,
    '',
    'Emitter: native (flutter_svg + AnimationController).',
    'Why: this animation only moves, fades and recolours shapes (transform, opacity, fill, stroke, stroke width).',
    'The widget redraws the SVG every frame (quantised to the document frame rate), so keep it for light scenes.',
    '',
    'Add to pubspec.yaml, under dependencies:',
    ...PUB_FLUTTER_SVG,
  ]);
}

function webviewHeader(runtime: 'css' | 'anime', why: string[], forced: boolean, runtimeWhy: string[]): string {
  const lines = [
    `Generated by Media Manipulator ${MOTION_BRAND}`,
    '',
    'Emitter: WebView player (webview_flutter).',
    forced
      ? 'Why: the WebView player was chosen explicitly.'
      : `Why: the native Flutter variant cannot carry this animation because ${sentence(why)}.`,
    'Caveats: a WebView embeds a browser view, which is heavier than the native variant, and its background is',
    'opaque on most platforms (a transparent request is best effort). The animation itself is the exported SVG.',
  ];
  if (runtime === 'css') {
    lines.push('Runtime: CSS animations inside the page. JavaScript is disabled in the WebView.');
  } else {
    lines.push(
      `Runtime: anime.js v${ANIME_VERSION}, embedded in the page${runtimeWhy.length ? ` because ${sentence(runtimeWhy)}` : ''}.`,
      'Its script needs JavaScript mode: this file sets JavaScriptMode.unrestricted for that reason.',
    );
  }
  lines.push('', 'Add to pubspec.yaml, under dependencies:', ...PUB_WEBVIEW);
  if (runtime === 'anime') {
    lines.push(
      '',
      `anime.js v${ANIME_VERSION} (https://animejs.com), embedded below unmodified except for tree-shaking and minification.`,
      '',
      ...ANIME_LICENSE.split('\n'),
    );
  }
  return comment(lines);
}

// ---------------------------------------------------------------------------
// Dart text
// ---------------------------------------------------------------------------

/** A Dart double literal. */
function dnum(n: number): string {
  if (n === Infinity) return 'double.infinity';
  if (n === -Infinity) return 'double.negativeInfinity';
  const s = String(r6(n));
  return /^-?\d+$/.test(s) ? `${s}.0` : s;
}

function stringList(name: string, lines: string[]): string[] {
  return [`const List<String> ${name} = [`, ...lines.map((l) => `  ${dartString(l)},`), '];'];
}

function dartValue(v: number | string): string {
  return typeof v === 'number' ? dnum(v) : dartString(v);
}

function dartEase(e: NativeSegment['ease']): string {
  if (e === 'linear') return '';
  if (e === 'hold') return ', []';
  return `, [${e.map(dnum).join(', ')}]`;
}

function nativeCode(doc: VectorDoc, cls: string): string {
  const m = buildNativeModel(doc);
  const animated = m.channels.length > 0;
  const duration = Math.max(1, m.duration);
  const hasGroup = m.groups.length > 0;
  const hasAttr = m.channels.some((c) => c.field < 0);
  const hasColor = m.channels.some((c) => typeof c.segments[0]?.v0 === 'string');
  const hasCubic = m.channels.some((c) => c.segments.some((s) => Array.isArray(s.ease)));
  const L: string[] = [nativeHeader(), '', '// ignore_for_file: unused_element', '', "import 'package:flutter/widgets.dart';", "import 'package:flutter_svg/flutter_svg.dart';", ''];

  if (!animated) {
    // Nothing moves: the frame-0 markup as a still picture.
    const svg = m.parts.join('');
    const lines = svg.replace(/\n$/, '').split('\n');
    L.push(...stringList('_svg', lines), '');
    L.push(
      `/// The animation (it has no animated tracks, so this is a still picture).`,
      `class ${cls} extends StatelessWidget {`,
      `  const ${cls}({super.key, this.width, this.height});`,
      '',
      '  final double? width;',
      '  final double? height;',
      '',
      '  @override',
      '  Widget build(BuildContext context) {',
      "    return SvgPicture.string(_svg.join('\\n'), width: width, height: height);",
      '  }',
      '}',
    );
    return `${L.join('\n')}\n`;
  }

  // markup parts
  L.push('/// Markup between the value slots; frame N fills slot i between _parts[i] and _parts[i + 1].');
  L.push('const List<String> _parts = [', ...m.parts.map((p) => `  ${dartString(p)},`), '];', '');
  L.push(`const double _duration = ${dnum(duration)};`, `const double _stepMs = ${dnum(1000 / m.fps)};`, '');
  if (hasGroup) {
    L.push('/// Transform groups by slot: x, y, scaleX, scaleY, rotation, skewX, skewY, anchorX, anchorY.');
    L.push('const Map<int, List<double>> _groups = {');
    for (const g of m.groups) L.push(`  ${g.slot}: [${g.base.map(dnum).join(', ')}],`);
    L.push('};', '');
  }
  L.push(
    '/// One keyframe piece. ease: null = linear, [] = hold, [x1, y1, x2, y2] = cubic-bezier.',
    'class _Seg {',
    '  const _Seg(this.t0, this.t1, this.v0, this.v1, [this.ease]);',
    '  final double t0;',
    '  final double t1;',
    '  final Object v0;',
    '  final Object v1;',
    '  final List<double>? ease;',
    '}',
    '',
    '/// An animated value: slot, field in the slot\'s transform group (-1: the slot itself), clamp range.',
    'class _Chan {',
    '  const _Chan(this.slot, this.field, this.segs, {this.lo = double.negativeInfinity, this.hi = double.infinity});',
    '  final int slot;',
    '  final int field;',
    '  final List<_Seg> segs;',
    '  final double lo;',
    '  final double hi;',
    '}',
    '',
    'const List<_Chan> _channels = [',
  );
  for (const c of m.channels) {
    const range = [c.lo === -Infinity ? '' : `lo: ${dnum(c.lo)}`, c.hi === Infinity ? '' : `hi: ${dnum(c.hi)}`].filter(Boolean);
    L.push(`  _Chan(${c.slot}, ${c.field}, [`);
    for (const s of c.segments) L.push(`    _Seg(${dnum(s.t0)}, ${dnum(s.t1)}, ${dartValue(s.v0)}, ${dartValue(s.v1)}${dartEase(s.ease)}),`);
    L.push(`  ]${range.length ? `, ${range.join(', ')}` : ''}),`);
  }
  L.push('];', '');

  // helpers
  L.push(
    'double _cl(double v, double lo, double hi) => v < lo ? lo : (v > hi ? hi : v);',
    '',
    '/// Rounds to 3 decimals (half up) and drops trailing zeros, like the SVG text the editor exports.',
    'String _f(double n) {',
    '  final i = (n * 1000 + 0.5).floor();',
    '  final a = i.abs();',
    "  final frac = (a % 1000).toString().padLeft(3, '0').replaceFirst(RegExp(r'0+$'), '');",
    "  return '${i < 0 ? '-' : ''}${a ~/ 1000}${frac.isEmpty ? '' : '.$frac'}';",
    '}',
    '',
  );
  if (hasCubic) {
    L.push(
      '/// Eased progress of cubic-bezier c at linear progress x (bisection on x, then y).',
      'double _cubic(List<double> c, double x) {',
      '  if (x <= 0) return 0;',
      '  if (x >= 1) return 1;',
      '  double at(double a, double b, double s) {',
      '    final k = 3 * a;',
      '    final j = 3 * (b - a) - k;',
      '    return ((1 - k - j) * s + j) * s * s + k * s;',
      '  }',
      '',
      '  var lo = 0.0;',
      '  var hi = 1.0;',
      '  for (var i = 0; i < 48; i++) {',
      '    final s = (lo + hi) / 2;',
      '    if (at(c[0], c[2], s) < x) {',
      '      lo = s;',
      '    } else {',
      '      hi = s;',
      '    }',
      '  }',
      '  return at(c[1], c[3], (lo + hi) / 2);',
      '}',
      '',
    );
  }
  if (hasColor) {
    L.push(
      '/// #rrggbb or rgba(r, g, b, a) as [r, g, b, a]; null for anything else (none, url(#id)).',
      'List<double>? _rgba(String s) {',
      "  final h = RegExp(r'^#([0-9a-f]{6})$', caseSensitive: false).firstMatch(s);",
      '  if (h != null) {',
      '    final n = int.parse(h[1]!, radix: 16);',
      '    return [((n >> 16) & 255).toDouble(), ((n >> 8) & 255).toDouble(), (n & 255).toDouble(), 1.0];',
      '  }',
      "  final m = RegExp(r'^rgba\\((\\d+), (\\d+), (\\d+), ([\\d.]+)\\)$').firstMatch(s);",
      '  return m == null ? null : [for (var i = 1; i <= 4; i++) double.parse(m[i]!)];',
      '}',
      '',
      '/// Premultiplied sRGB lerp; colours that cannot interpolate hold.',
      'String _color(String a, String b, double p) {',
      '  final x = _rgba(a);',
      '  final y = _rgba(b);',
      '  if (x == null || y == null) return p < 1 ? a : b;',
      '  final al = _cl(x[3] + (y[3] - x[3]) * p, 0, 1);',
      "  if (al == 0) return 'rgba(0, 0, 0, 0)';",
      '  double ch(int i) => _cl((x[i] * x[3] + (y[i] * y[3] - x[i] * x[3]) * p) / al, 0, 255);',
      '  if (al >= 1) {',
      "    String hex(double v) => v.round().toRadixString(16).padLeft(2, '0');",
      "    return '#${hex(ch(0))}${hex(ch(1))}${hex(ch(2))}';",
      '  }',
      "  return 'rgba(${ch(0).round()}, ${ch(1).round()}, ${ch(2).round()}, ${_f(al)})';",
      '}',
      '',
    );
  }
  if (hasGroup) {
    L.push(
      '/// The transform attribute (empty for identity), written like the editor\'s SVG export.',
      'String _tf(List<double> b) {',
      '  final p = <String>[];',
      '  if (b[4] == 0 && b[5] == 0 && b[6] == 0 && b[2] == 1 && b[3] == 1) {',
      "    if (_f(b[0]) != '0' || _f(b[1]) != '0') {",
      "      p.add('translate(${_f(b[0])} ${_f(b[1])})');",
      '    }',
      '  } else {',
      "    if (_f(b[0] + b[7]) != '0' || _f(b[1] + b[8]) != '0') {",
      "      p.add('translate(${_f(b[0] + b[7])} ${_f(b[1] + b[8])})');",
      '    }',
      "    if (_f(b[4]) != '0') p.add('rotate(${_f(b[4])})');",
      "    if (_f(b[5]) != '0') p.add('skewX(${_f(b[5])})');",
      "    if (_f(b[6]) != '0') p.add('skewY(${_f(b[6])})');",
      "    if (_f(b[2]) != '1' || _f(b[3]) != '1') {",
      "      p.add('scale(${_f(b[2])} ${_f(b[3])})');",
      '    }',
      "    if (_f(b[7]) != '0' || _f(b[8]) != '0') {",
      "      p.add('translate(${_f(-b[7])} ${_f(-b[8])})');",
      '    }',
      '  }',
      "  return p.isEmpty ? '' : ' transform=\"${p.join(' ')}\"';",
      '}',
      '',
    );
  }
  const ret = hasColor ? 'Object' : 'double';
  L.push(`${ret} _value(_Chan c, double t) {`, '  final s = c.segs;', '  var k = 0;', '  while (k < s.length - 1 && t >= s[k].t1) {', '    k++;', '  }', '  final g = s[k];');
  L.push('  if (t < g.t0) return g.v0' + (hasColor ? ';' : ' as double;'), '  if (t >= g.t1) return g.v1' + (hasColor ? ';' : ' as double;'));
  const eased = hasCubic ? 'e == null ? u : (e.isEmpty ? 0.0 : _cubic(e, u))' : 'e == null ? u : 0.0';
  L.push('  final e = g.ease;', '  final u = (t - g.t0) / (g.t1 - g.t0);', `  final p = ${eased};`);
  if (hasColor) {
    L.push(
      '  final a = g.v0;',
      '  final b = g.v1;',
      '  if (a is double && b is double) {',
      '    return _cl(a + (b - a) * p, c.lo, c.hi);',
      '  }',
      '  return _color(a as String, b as String, p);',
    );
  } else {
    L.push('  final a = g.v0 as double;', '  final b = g.v1 as double;', '  return _cl(a + (b - a) * p, c.lo, c.hi);');
  }
  L.push('}', '');

  L.push('/// The SVG markup at time ms.', 'String _svgAt(double ms) {', '  final t = _cl(ms, 0, _duration);', "  final v = List<String>.filled(_parts.length - 1, '');");
  if (hasGroup) L.push('  final g = {for (final e in _groups.entries) e.key: List<double>.of(e.value)};');
  L.push('  for (final c in _channels) {', '    final x = _value(c, t);');
  const attrLine = hasColor ? '      v[c.slot] = x is double ? _f(x) : x as String;' : '      v[c.slot] = _f(x);';
  if (hasAttr && hasGroup) {
    L.push('    if (c.field < 0) {', attrLine, '    } else {', hasColor ? '      g[c.slot]![c.field] = x as double;' : '      g[c.slot]![c.field] = x;', '    }');
  } else if (hasAttr) {
    L.push(attrLine.replace(/^ {2}/, ''));
  } else {
    L.push(hasColor ? '    g[c.slot]![c.field] = x as double;' : '    g[c.slot]![c.field] = x;');
  }
  L.push('  }');
  if (hasGroup) L.push('  g.forEach((slot, b) => v[slot] = _tf(b));');
  L.push(
    '  final out = StringBuffer(_parts[0]);',
    '  for (var i = 0; i < v.length; i++) {',
    '    out',
    '      ..write(v[i])',
    '      ..write(_parts[i + 1]);',
    '  }',
    '  return out.toString();',
    '}',
    '',
  );

  const play = m.loop ? '_controller.repeat()' : '_controller.isCompleted ? _controller.forward(from: 0) : _controller.forward()';
  L.push(
    `/// The animation. Give it a size, or let its parent constrain it. Keep a GlobalKey<${cls}State> to call play(), pause() and seek(ms).`,
    `class ${cls} extends StatefulWidget {`,
    `  const ${cls}({super.key, this.width, this.height});`,
    '',
    '  final double? width;',
    '  final double? height;',
    '',
    '  @override',
    `  State<${cls}> createState() => ${cls}State();`,
    '}',
    '',
    `class ${cls}State extends State<${cls}> with SingleTickerProviderStateMixin {`,
    '  late final AnimationController _controller = AnimationController(',
    '    vsync: this,',
    `    duration: const Duration(milliseconds: ${duration}),`,
    '  );',
    '',
    '  @override',
    '  void initState() {',
    '    super.initState();',
    `    ${m.loop ? '_controller.repeat();' : '_controller.forward();'}`,
    '  }',
    '',
    '  @override',
    '  void dispose() {',
    '    _controller.dispose();',
    '    super.dispose();',
    '  }',
    '',
    `  void play() => ${play};`,
    '',
    '  void pause() => _controller.stop();',
    '',
    '  void seek(num ms) => _controller.value = ms / _duration;',
    '',
    '  @override',
    '  Widget build(BuildContext context) {',
    '    return AnimatedBuilder(',
    '      animation: _controller,',
    '      builder: (context, _) {',
    '        final ms = _controller.value >= 1',
    '            ? _duration',
    '            : (_controller.value * _duration / _stepMs).floor() * _stepMs;',
    '        return SvgPicture.string(_svgAt(ms), width: widget.width, height: widget.height);',
    '      },',
    '    );',
    '  }',
    '}',
  );
  return `${L.join('\n')}\n`;
}

function webviewCode(page: string[], cls: string, js: boolean, background: string): string {
  return [
    '',
    "import 'package:flutter/widgets.dart';",
    "import 'package:webview_flutter/webview_flutter.dart';",
    '',
    '/// The HTML page, one line per entry.',
    ...stringList('_page', page),
    '',
    `/// The animation, shown in a WebView. Give it a size, or let its parent constrain it.`,
    `class ${cls} extends StatefulWidget {`,
    `  const ${cls}({super.key});`,
    '',
    '  @override',
    `  State<${cls}> createState() => _${cls}State();`,
    '}',
    '',
    `class _${cls}State extends State<${cls}> {`,
    '  late final WebViewController _controller = WebViewController()',
    `    ..setJavaScriptMode(JavaScriptMode.${js ? 'unrestricted' : 'disabled'})`,
    `    ..setBackgroundColor(const Color(${background}))`,
    "    ..loadHtmlString(_page.join('\\n'));",
    '',
    '  @override',
    '  Widget build(BuildContext context) {',
    '    return WebViewWidget(controller: _controller);',
    '  }',
    '}',
    '',
  ].join('\n');
}

function webviewBackground(doc: VectorDoc): string {
  const c = parseColor(doc.canvas.background);
  if (!c || c.a < 1) return '0x00000000';
  const h = (v: number) => Math.round(v).toString(16).padStart(2, '0').toUpperCase();
  return `0xFF${h(c.r)}${h(c.g)}${h(c.b)}`;
}

// ---------------------------------------------------------------------------
// exportFlutter
// ---------------------------------------------------------------------------

export interface FlutterExportOptions {
  /** Project name: the class and file name. */
  name?: string;
  /** Ask for the anime.js runtime in the WebView variant (CSS cannot be forced when it cannot express the document). */
  forceAnime?: boolean;
  /** 'webview' forces the WebView player even when the native variant could carry the document. */
  variant?: 'auto' | 'webview';
  /** Goldens: the anime.js runtime replaced by its placeholder. */
  placeholderRuntime?: AnimeExportOptions['placeholderRuntime'];
}

export interface FlutterExportResult {
  code: string;
  fileName: string;
  emitter: 'native' | 'webview';
  /** Why the native variant was not used (empty when it was, or when the WebView was asked for). */
  reasons: NativeFlutterReason[];
  /** The WebView page's runtime; null for the native variant. */
  runtime: 'css' | 'anime' | null;
  /** Why the anime.js runtime is needed (WebView variant only). */
  runtimeReasons: AnimeReason[];
}

/**
 * `exportFlutter(doc, opts)`: the native variant when `variant` is `'auto'`
 * and `canExportNativeFlutter(doc).ok`, else the WebView player. Throws
 * `CssExportError` / `AnimeExportError` when the chosen web exporter cannot
 * write the document.
 */
export function exportFlutter(doc: VectorDoc, opts: FlutterExportOptions = {}): FlutterExportResult {
  const cls = toDartIdentifier(opts.name ?? '', 'Animation');
  const fileName = dartFileName(opts.name);
  const check = canExportNativeFlutter(doc);
  if ((opts.variant ?? 'auto') === 'auto' && check.ok) {
    return { code: `${nativeCode(doc, cls)}`, fileName, emitter: 'native', reasons: [], runtime: null, runtimeReasons: [] };
  }
  const { runtime, reasons: runtimeReasons } = chooseRuntime(doc, { forceAnime: opts.forceAnime });
  const full = runtime === 'css' ? exportAnimatedSvgCss(doc) : exportAnimatedSvgAnime(doc, { placeholderRuntime: opts.placeholderRuntime });
  const svg = full.slice(full.indexOf('<svg')).replace(/\n$/, '');
  const page = [
    '<!doctype html>',
    '<html>',
    '<head>',
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    '<style>html, body { margin: 0; height: 100%; background: transparent; } svg { display: block; width: 100%; height: 100%; }</style>',
    '</head>',
    '<body>',
    ...svg.split('\n'),
    '</body>',
    '</html>',
  ];
  const forced = check.ok;
  const header = webviewHeader(
    runtime,
    check.reasons.map((r) => NATIVE_FLUTTER_REASON_TEXT[r]),
    forced,
    runtimeReasons.map((r) => RUNTIME_REASON_TEXT[r]),
  );
  const code = `${header}\n${webviewCode(page, cls, runtime === 'anime', webviewBackground(doc))}`;
  return { code, fileName, emitter: 'webview', reasons: check.reasons, runtime, runtimeReasons };
}

