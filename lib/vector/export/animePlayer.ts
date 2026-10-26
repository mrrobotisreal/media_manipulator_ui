/**
 * The player script that drives an anime.js-runtime export (ticket MM45
 * decision 9). It is inlined, as text, after the anime.js runtime in the
 * exported SVG's single `<script>`, so it must be plain ES2018 with no
 * imports. `PLAYER_SOURCE` is that text; `runPlayer` is the same function
 * for the tests, which run it against a fake DOM and a real anime.js
 * timeline (`anime.test.ts`).
 *
 * Division of labour: anime.js owns time — one paused-or-playing timeline
 * (`createTimeline`, looped when the doc loops), one tween per keyframe
 * segment on a plain progress object, with the segment's easing mapped to
 * anime's (`linear`, `cubicBezier(...)`, `steps(1)` for holds; the exporter
 * splits `easeBoth` into its two exact cubic halves like the CSS exporter).
 * The player owns VALUES: on every render it reads each segment's eased
 * progress and composes exactly what the editor preview computes:
 *
 *   - numbers lerp; colours lerp in premultiplied sRGB; normalised path data
 *     lerps number by number (morph);
 *   - a layer's transform is written as the SVG `transform` attribute, from
 *     the model fields (`translate(x+ax y+ay) rotate skewX skewY scale
 *     translate(-ax -ay)`), with the motion-path offset in front:
 *     `translate(P) rotate(θ)` (P, θ by arc length on the flattened path the
 *     exporter embeds);
 *   - opacity / fill / stroke / stroke-width / stroke-dashoffset / d are
 *     attributes on the element; stop colour / offset on `<stop>`;
 *     `stdDeviation` on the filter's `<feGaussianBlur>`.
 *
 * Writing attributes (not CSS) is what makes `d`, stop `offset` and SVG
 * filter animation work in every engine, Safari included.
 */

/** One keyframe segment of a channel: [t0, t1) from v0 to v1. */
export interface PlayerSegment {
  t0: number;
  t1: number;
  v0: number | string;
  v1: number | string;
  /** 'linear' | 'hold' | [x1, y1, x2, y2] (cubic-bezier) */
  ease: 'linear' | 'hold' | [number, number, number, number];
}

export type PlayerKind = 'number' | 'color' | 'path';

/** One animated value: its segments, how it interpolates, and where it is written. */
export interface PlayerChannel {
  /** Element id inside the SVG. */
  el: string;
  /** A descendant of `el` instead: `[tagName, index]` (gradient `stop`, filter `feGaussianBlur`). */
  sub?: [string, number];
  /** What the value is written to: an attribute, a transform field of `el`'s transform group, or its motion progress. */
  to: { attr: string } | { transform: string } | { motion: 1 };
  kind: PlayerKind;
  /** Covers [0, duration]; before the first / after the last segment the edge values hold. */
  segments: PlayerSegment[];
  min?: number;
  max?: number;
}

/** A transform group: the layer's base fields; transform channels override them. */
export interface PlayerTransform {
  el: string;
  base: [x: number, y: number, scaleX: number, scaleY: number, rotation: number, skewX: number, skewY: number, anchorX: number, anchorY: number];
  /** Index into `paths` and whether to rotate with the path, when the layer is on a motion path. */
  motion?: { path: number; autoOrient: boolean };
}

/**
 * A motion path sampled every `step` along its arc length (the last sample
 * is the end point): `pts` = flat [x, y, …], `ang` = direction of travel
 * (degrees) at each sample. Positions and angles interpolate linearly.
 */
export interface PlayerPath {
  pts: number[];
  ang: number[];
  step: number;
  length: number;
  closed: boolean;
}

export interface PlayerSpec {
  duration: number;
  loop: boolean;
  transforms: PlayerTransform[];
  paths: PlayerPath[];
  channels: PlayerChannel[];
}

/** The anime.js API the player needs (the bundled runtime's exports). */
export interface AnimeApi {
  createTimeline: (params: Record<string, unknown>) => {
    add: (target: object, params: Record<string, unknown>, position: number) => unknown;
  };
  cubicBezier: (a: number, b: number, c: number, d: number) => (t: number) => number;
  steps: (n: number, fromStart?: boolean) => (t: number) => number;
}

/** Minimal DOM surface the player touches. */
export interface PlayerRoot {
  getElementById(id: string): PlayerElement | null;
}
export interface PlayerElement {
  setAttribute(name: string, value: string): void;
  getElementsByTagName(name: string): ArrayLike<PlayerElement>;
}

/**
 * The player, as the exact text the exporter inlines (plain ES2018, no
 * imports). Tests evaluate this same string (`loadPlayer` in the tests) so
 * what is tested is what ships. `runPlayer(A, spec, root)`: A = the anime.js
 * runtime global, spec = `PlayerSpec`, root = the SVG's document.
 */
export const PLAYER_SOURCE = `function runPlayer(A, spec, root) {
  var R = Math.PI / 180;
  var fmt = function (n) { var r = Math.round(n * 1000) / 1000; return String(r === 0 ? 0 : r); };
  var hex = function (c) {
    var m = /^#([0-9a-f]{6})$/i.exec(c);
    return m ? [parseInt(m[1].slice(0, 2), 16), parseInt(m[1].slice(2, 4), 16), parseInt(m[1].slice(4, 6), 16), 1] : null;
  };
  var rgba = function (c) {
    var m = /^rgba\\((\\d+), (\\d+), (\\d+), ([\\d.]+)\\)$/.exec(c);
    return m ? [+m[1], +m[2], +m[3], +m[4]] : hex(c);
  };
  var color = function (a, b, p) {
    var ca = rgba(a), cb = rgba(b);
    if (!ca || !cb) return p < 1 ? a : b;
    var al = Math.min(1, Math.max(0, ca[3] + (cb[3] - ca[3]) * p));
    if (al === 0) return 'rgba(0, 0, 0, 0)';
    var ch = function (i) { return Math.min(255, Math.max(0, (ca[i] * ca[3] + (cb[i] * cb[3] - ca[i] * ca[3]) * p) / al)); };
    if (al >= 1) {
      var h = function (v) { var s = Math.round(v).toString(16); return s.length < 2 ? '0' + s : s; };
      return '#' + h(ch(0)) + h(ch(1)) + h(ch(2));
    }
    return 'rgba(' + Math.round(ch(0)) + ', ' + Math.round(ch(1)) + ', ' + Math.round(ch(2)) + ', ' + Math.round(al * 1000) / 1000 + ')';
  };
  var NUM = /[+-]?(?:\\d+\\.?\\d*|\\.\\d+)(?:[eE][+-]?\\d+)?/g;
  var path = function (a, b, p) {
    if (p === 0) return a;
    if (p === 1) return b;
    var nb = b.match(NUM) || [], i = 0;
    return a.replace(NUM, function (x) { var y = +nb[i++]; return fmt(+x + (y - +x) * p); });
  };
  var at = function (pp, f) {
    var L = pp.length, d = f * L;
    if (pp.closed && L > 0) d = ((d % L) + L) % L; else d = Math.min(Math.max(0, d), L);
    var n = pp.ang.length - 1, i = Math.min(n, Math.floor(d / pp.step)), j = Math.min(n, i + 1);
    var span = (j === n ? L : j * pp.step) - i * pp.step, u = span > 0 ? (d - i * pp.step) / span : 0;
    var da = pp.ang[j] - pp.ang[i];
    da = da - 360 * Math.round(da / 360);
    return [pp.pts[i * 2] + (pp.pts[j * 2] - pp.pts[i * 2]) * u, pp.pts[i * 2 + 1] + (pp.pts[j * 2 + 1] - pp.pts[i * 2 + 1]) * u, pp.ang[i] + da * u];
  };
  var ease = function (e) {
    if (e === 'hold') return A.steps(1);
    if (e === 'linear') return 'linear';
    return A.cubicBezier(e[0], e[1], e[2], e[3]);
  };
  var state = spec.channels.map(function (ch) { return ch.segments.map(function () { return { p: 0 }; }); });
  var value = function (ch, i, t) {
    var segs = ch.segments, k = 0;
    while (k < segs.length - 1 && t >= segs[k].t1) k++;
    var s = segs[k];
    if (t < s.t0) return s.v0;
    if (t >= s.t1) return s.v1;
    var p = state[i][k].p, v;
    if (ch.kind === 'number') {
      v = s.v0 + (s.v1 - s.v0) * p;
      if (ch.min !== undefined) v = Math.max(ch.min, v);
      if (ch.max !== undefined) v = Math.min(ch.max, v);
    } else if (ch.kind === 'color') v = color(s.v0, s.v1, p);
    else v = path(s.v0, s.v1, p);
    return v;
  };
  var els = {};
  var el = function (id, sub) {
    var key = sub ? id + ' ' + sub[0] + ' ' + sub[1] : id;
    if (!(key in els)) {
      var node = root.getElementById(id);
      els[key] = node && sub ? node.getElementsByTagName(sub[0])[sub[1]] || null : node;
    }
    return els[key];
  };
  var tfIndex = {};
  spec.transforms.forEach(function (tf, i) { tfIndex[tf.el] = i; });
  var SLOTS = ['x', 'y', 'scaleX', 'scaleY', 'rotation', 'skewX', 'skewY', 'anchorX', 'anchorY'];
  var render = function (time) {
    var t = Math.min(Math.max(0, time), spec.duration);
    var tf = spec.transforms.map(function (x) { return x.base.slice(); });
    var motion = [];
    spec.channels.forEach(function (ch, i) {
      var v = value(ch, i, t), to = ch.to;
      if (to.transform !== undefined) tf[tfIndex[ch.el]][SLOTS.indexOf(to.transform)] = v;
      else if (to.motion !== undefined) motion[tfIndex[ch.el]] = v;
      else { var node = el(ch.el, ch.sub); if (node) node.setAttribute(to.attr, typeof v === 'number' ? fmt(v) : v); }
    });
    spec.transforms.forEach(function (x, i) {
      var b = tf[i], parts = [];
      if (x.motion && motion[i] !== undefined) {
        var q = at(spec.paths[x.motion.path], motion[i]);
        parts.push('translate(' + fmt(q[0]) + ' ' + fmt(q[1]) + ')');
        if (x.motion.autoOrient) parts.push('rotate(' + fmt(q[2]) + ')');
      }
      parts.push('translate(' + fmt(b[0] + b[7]) + ' ' + fmt(b[1] + b[8]) + ')', 'rotate(' + fmt(b[4]) + ')', 'skewX(' + fmt(b[5]) + ')', 'skewY(' + fmt(b[6]) + ')', 'scale(' + fmt(b[2]) + ' ' + fmt(b[3]) + ')', 'translate(' + fmt(-b[7]) + ' ' + fmt(-b[8]) + ')');
      var node = el(x.el);
      if (node) node.setAttribute('transform', parts.join(' '));
    });
  };
  var tl = A.createTimeline({
    autoplay: true,
    loop: spec.loop,
    defaults: { ease: 'linear' },
    onRender: function (self) { render(self.iterationCurrentTime); }
  });
  tl.add({ p: 0 }, { p: 1, duration: Math.max(1, spec.duration), ease: 'linear' }, 0);
  spec.channels.forEach(function (ch, i) {
    ch.segments.forEach(function (s, k) {
      if (s.t1 > s.t0) tl.add(state[i][k], { p: [0, 1], duration: s.t1 - s.t0, ease: ease(s.ease) }, s.t0);
    });
  });
  render(0);
  return { timeline: tl, render: render };
}`;
