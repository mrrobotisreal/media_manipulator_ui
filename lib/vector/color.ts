/**
 * Colour parsing and interpolation for Motion colour tracks (`fill`,
 * `stroke`; ticket MM44 decision 3).
 *
 * Interpolation is in sRGB with premultiplied alpha. That is how every major
 * browser interpolates legacy-syntax colours (hex, `rgb()`, `hsl()`, named) in
 * CSS `@keyframes` (CSS Color 4 §12), so the editor preview and the CSS
 * animated-SVG export agree.
 *
 * Paints that are not plain colours (`none`, `currentColor`, `url(#…)`,
 * `color-mix()`…) are not interpolable: a segment touching one behaves like a
 * hold (the value jumps at the next keyframe), and the CSS exporter emits
 * `steps(1,end)` for it, so preview and export still agree.
 */

export interface Rgba {
  /** 0..255, unrounded. */
  r: number;
  g: number;
  b: number;
  /** 0..1. */
  a: number;
}

// CSS named colours (CSS Color 4 §6.1), name → rrggbb.
const NAMED_SRC =
  'aliceblue:f0f8ff antiquewhite:faebd7 aqua:00ffff aquamarine:7fffd4 azure:f0ffff beige:f5f5dc bisque:ffe4c4 black:000000 ' +
  'blanchedalmond:ffebcd blue:0000ff blueviolet:8a2be2 brown:a52a2a burlywood:deb887 cadetblue:5f9ea0 chartreuse:7fff00 ' +
  'chocolate:d2691e coral:ff7f50 cornflowerblue:6495ed cornsilk:fff8dc crimson:dc143c cyan:00ffff darkblue:00008b ' +
  'darkcyan:008b8b darkgoldenrod:b8860b darkgray:a9a9a9 darkgreen:006400 darkgrey:a9a9a9 darkkhaki:bdb76b darkmagenta:8b008b ' +
  'darkolivegreen:556b2f darkorange:ff8c00 darkorchid:9932cc darkred:8b0000 darksalmon:e9967a darkseagreen:8fbc8f ' +
  'darkslateblue:483d8b darkslategray:2f4f4f darkslategrey:2f4f4f darkturquoise:00ced1 darkviolet:9400d3 deeppink:ff1493 ' +
  'deepskyblue:00bfff dimgray:696969 dimgrey:696969 dodgerblue:1e90ff firebrick:b22222 floralwhite:fffaf0 forestgreen:228b22 ' +
  'fuchsia:ff00ff gainsboro:dcdcdc ghostwhite:f8f8ff gold:ffd700 goldenrod:daa520 gray:808080 green:008000 greenyellow:adff2f ' +
  'grey:808080 honeydew:f0fff0 hotpink:ff69b4 indianred:cd5c5c indigo:4b0082 ivory:fffff0 khaki:f0e68c lavender:e6e6fa ' +
  'lavenderblush:fff0f5 lawngreen:7cfc00 lemonchiffon:fffacd lightblue:add8e6 lightcoral:f08080 lightcyan:e0ffff ' +
  'lightgoldenrodyellow:fafad2 lightgray:d3d3d3 lightgreen:90ee90 lightgrey:d3d3d3 lightpink:ffb6c1 lightsalmon:ffa07a ' +
  'lightseagreen:20b2aa lightskyblue:87cefa lightslategray:778899 lightslategrey:778899 lightsteelblue:b0c4de lightyellow:ffffe0 ' +
  'lime:00ff00 limegreen:32cd32 linen:faf0e6 magenta:ff00ff maroon:800000 mediumaquamarine:66cdaa mediumblue:0000cd ' +
  'mediumorchid:ba55d3 mediumpurple:9370db mediumseagreen:3cb371 mediumslateblue:7b68ee mediumspringgreen:00fa9a ' +
  'mediumturquoise:48d1cc mediumvioletred:c71585 midnightblue:191970 mintcream:f5fffa mistyrose:ffe4e1 moccasin:ffe4b5 ' +
  'navajowhite:ffdead navy:000080 oldlace:fdf5e6 olive:808000 olivedrab:6b8e23 orange:ffa500 orangered:ff4500 orchid:da70d6 ' +
  'palegoldenrod:eee8aa palegreen:98fb98 paleturquoise:afeeee palevioletred:db7093 papayawhip:ffefd5 peachpuff:ffdab9 ' +
  'peru:cd853f pink:ffc0cb plum:dda0dd powderblue:b0e0e6 purple:800080 rebeccapurple:663399 red:ff0000 rosybrown:bc8f8f ' +
  'royalblue:4169e1 saddlebrown:8b4513 salmon:fa8072 sandybrown:f4a460 seagreen:2e8b57 seashell:fff5ee sienna:a0522d ' +
  'silver:c0c0c0 skyblue:87ceeb slateblue:6a5acd slategray:708090 slategrey:708090 snow:fffafa springgreen:00ff7f ' +
  'steelblue:4682b4 tan:d2b48c teal:008080 thistle:d8bfd8 tomato:ff6347 turquoise:40e0d0 violet:ee82ee wheat:f5deb3 ' +
  'white:ffffff whitesmoke:f5f5f5 yellow:ffff00 yellowgreen:9acd32';

let named: Map<string, string> | null = null;
function namedColor(name: string): string | undefined {
  if (!named) named = new Map(NAMED_SRC.split(' ').map((e) => e.split(':') as [string, string]));
  return named.get(name);
}

const clamp = (v: number, lo: number, hi: number) => (v < lo ? lo : v > hi ? hi : v);

function fromHex(hex: string): Rgba | null {
  const h = hex.length <= 4 ? [...hex].map((c) => c + c).join('') : hex;
  if (h.length !== 6 && h.length !== 8) return null;
  const n = (i: number) => parseInt(h.slice(i, i + 2), 16);
  return { r: n(0), g: n(2), b: n(4), a: h.length === 8 ? n(6) / 255 : 1 };
}

/** A CSS number or percentage (`pct` = the value of 100%). NaN when invalid. */
function channel(token: string, pct: number): number {
  const m = /^([+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?)(%?)$/i.exec(token);
  if (!m) return Number.NaN;
  const v = Number(m[1]);
  return m[2] ? (v / 100) * pct : v;
}

function hue(token: string): number {
  const m = /^([+-]?(?:\d+\.?\d*|\.\d+))(deg|turn|rad|grad)?$/i.exec(token);
  if (!m) return Number.NaN;
  const v = Number(m[1]);
  switch ((m[2] ?? 'deg').toLowerCase()) {
    case 'turn':
      return v * 360;
    case 'rad':
      return (v * 180) / Math.PI;
    case 'grad':
      return v * 0.9;
    default:
      return v;
  }
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  const hh = (((h % 360) + 360) % 360) / 360;
  const f = (n: number) => {
    const k = (n + hh * 12) % 12;
    const a = s * Math.min(l, 1 - l);
    return (l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1))) * 255;
  };
  return [f(0), f(8), f(4)];
}

/** Split `rgb(…)` / `hsl(…)` arguments (comma or space syntax, optional `/ alpha`). */
function args(inner: string): string[] | null {
  const parts = inner.includes(',') ? inner.split(',').map((p) => p.trim()) : inner.replace('/', ' / ').trim().split(/\s+/);
  if (parts.includes('/')) {
    const i = parts.indexOf('/');
    if (i !== 3 || parts.length !== 5) return null;
    parts.splice(i, 1);
  }
  return parts.length === 3 || parts.length === 4 ? parts : null;
}

/** Parse a plain CSS colour. Null for `none`, `currentColor`, `url()`, functions we do not model, or junk. */
export function parseColor(value: string | number | undefined): Rgba | null {
  if (typeof value !== 'string') return null;
  const s = value.trim().toLowerCase();
  if (s === 'transparent') return { r: 0, g: 0, b: 0, a: 0 };
  if (s.startsWith('#')) return /^#[0-9a-f]+$/.test(s) ? fromHex(s.slice(1)) : null;
  const fn = /^(rgba?|hsla?)\((.*)\)$/.exec(s);
  if (fn) {
    const a = args(fn[2]);
    if (!a) return null;
    const alpha = a.length === 4 ? channel(a[3], 1) : 1;
    let rgb: [number, number, number];
    if (fn[1].startsWith('rgb')) rgb = [channel(a[0], 255), channel(a[1], 255), channel(a[2], 255)];
    else rgb = hslToRgb(hue(a[0]), channel(a[1], 1), channel(a[2], 1));
    if (![...rgb, alpha].every(Number.isFinite)) return null;
    return { r: clamp(rgb[0], 0, 255), g: clamp(rgb[1], 0, 255), b: clamp(rgb[2], 0, 255), a: clamp(alpha, 0, 1) };
  }
  const hex = /^[a-z]+$/.test(s) ? namedColor(s) : undefined;
  return hex ? fromHex(hex) : null;
}

/** Premultiplied sRGB lerp, `f` unclamped (cubic-bezier overshoot extrapolates, then clamps). */
export function lerpColor(a: Rgba, b: Rgba, f: number): Rgba {
  const alpha = clamp(a.a + (b.a - a.a) * f, 0, 1);
  if (alpha === 0) return { r: 0, g: 0, b: 0, a: 0 };
  const ch = (x: number, y: number) => clamp((x * a.a + (y * b.a - x * a.a) * f) / alpha, 0, 255);
  return { r: ch(a.r, b.r), g: ch(a.g, b.g), b: ch(a.b, b.b), a: alpha };
}

const hex2 = (v: number) => Math.round(v).toString(16).padStart(2, '0');

/** `#rrggbb` when opaque, else `rgba(r, g, b, a)` (channels rounded, alpha to 3 places). */
export function formatColor(c: Rgba): string {
  if (c.a >= 1) return `#${hex2(c.r)}${hex2(c.g)}${hex2(c.b)}`;
  const a = Math.round(c.a * 1000) / 1000;
  return `rgba(${Math.round(c.r)}, ${Math.round(c.g)}, ${Math.round(c.b)}, ${a})`;
}
