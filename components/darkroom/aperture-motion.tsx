'use client';

import * as React from 'react';

import { useTheme } from '@/components/theme-provider';
import { cn } from '@/lib/utils';

import { BLADE_SEAMS, OPENING_BLADES } from './aperture-paths';

/* ============================================================================
 * CYMATIC MORPHING APERTURE
 *
 * The animated sibling of `ApertureMark`. It starts as the exact six-blade
 * aperture in coral, and every 3s morphs into a new cymatic figure — a
 * Chladni-plate resonance mandala — with a new colour, cycling through six
 * stages before returning to the aperture. Seven stages × 3s = a 21s loop.
 *
 * Every shape in the cycle, INCLUDING the aperture itself, is produced by one
 * parametric model, so every keyframe has identical structure and interpolation
 * is plain per-number lerp:
 *
 *   ring  polar curve r(θ) = 10 + amp·cos(kθ + φ), stroke 1.5   (the barrel)
 *   mid   polar harmonic curve, stroke 1.1, opacity animated    (petals)
 *   core  polar curve, filled                                   (the iris)
 *   rays  fixed pool of 24 segments, each [r1, a1°, r2, a2°]     (blades/spokes)
 *
 * That is the whole reason this approach was chosen over the obvious ones. SMIL
 * `<animate>` on `d`, CSS `d: path()` transitions, and flubber-style libraries
 * all need matching path command structures (and CSS `d` still isn't animatable
 * everywhere Safari is). Here the morph *cannot* glitch, pop, or self-intersect
 * unpredictably, because there is nothing to reconcile: 120 radii and 24
 * segments in, 120 radii and 24 segments out, at every frame.
 *
 * Hidden rays collapse to zero length (r1 === r2 && a1 === a2) parked at the
 * radius/angle they will grow from. Butt caps — the default — render nothing for
 * a zero-length segment, which is what makes the collapse invisible. Round caps
 * would leave 24 beads.
 *
 * Cost: pre-sampled Float64Array keyframes lerped into reusable scratch buffers,
 * written to four <path> elements via refs. React renders once and is never
 * involved again; nothing allocates during the 1.5s hold half of each stage,
 * because the loop returns before doing any work. ~300 points of path data per
 * painted frame, well under 0.3ms.
 * ========================================================================== */

const N = 120; // polar samples (3° steps — hexagon corners at 60° land exactly on samples)
const RAYS = 24; // fixed ray pool
const STAGE_MS = 3000; // per stage: hold, then morph
const HOLD_FRAC = 0.5; // 1.5s hold, 1.5s morph
const TAU = Math.PI * 2;

/* ---- polar shape helpers -------------------------------------------------- */

type RadiusFn = (theta: number) => number;

/**
 * Exact polar form of a flat-top hexagon with circumradius R. Sampled every 3°
 * this reproduces `OPENING_BLADES` (r = 3.9) to the last decimal: the six
 * vertices fall on samples 0, 20, 40, 60, 80, 100, and the points between them
 * are collinear along the true edge.
 */
function hexagon(R: number): RadiusFn {
  const seg = Math.PI / 3;
  return (th) => {
    const a = ((th % seg) + seg) % seg; // angle within the current edge
    return (R * Math.cos(seg / 2)) / Math.cos(a - seg / 2);
  };
}

/** terms: [harmonic number k, amplitude, phase in degrees] */
type Harmonic = readonly [number, number, number];

function harmonic(base: number, terms: readonly Harmonic[]): RadiusFn {
  return (th) => {
    let r = base;
    for (const [k, amp, ph] of terms) r += amp * Math.cos(k * th + (ph * Math.PI) / 180);
    return r;
  };
}

const circle =
  (R: number): RadiusFn =>
  () =>
    R;

function sampleRadii(fn: RadiusFn): Float64Array {
  const out = new Float64Array(N);
  for (let i = 0; i < N; i++) out[i] = fn((i / N) * TAU);
  return out;
}

/* ---- ray pool ------------------------------------------------------------- */

/**
 * A segment from polar(r1, slot + a1°) to polar(r2, slot + a2°), where slot i's
 * angle is i/24 · 360°. The two INDEPENDENT angle offsets let a segment sit off
 * its slot angle entirely — the aperture's blade bars need this, because each
 * bar runs along a hexagon edge line rather than out along a radius.
 */
type Ray = [r1: number, a1: number, r2: number, a2: number];

/**
 * visibleEvery: 4 → 6 rays, 2 → 12, 1 → 24, 0 → none. Hidden rays collapse to a
 * zero-length point parked at (rHide, a2) so they have a stable radius/angle to
 * grow out of and collapse back into rather than sliding in from the centre.
 */
function rayPool(
  visibleEvery: number,
  r1: number,
  a1: number,
  r2: number,
  a2: number,
  rHide: number
): Ray[] {
  const pool: Ray[] = [];
  for (let i = 0; i < RAYS; i++) {
    const on = visibleEvery > 0 && i % visibleEvery === 0;
    pool.push(on ? [r1, a1, r2, a2] : [rHide, a2, rHide, a2]);
  }
  return pool;
}

/* ---- colour: sRGB ⇄ Oklab -------------------------------------------------
 * Hue travel is interpolated in Oklab, not sRGB. Straight sRGB lerps dive
 * through grey on the way between complementary hues — chartreuse → blue would
 * spend half a second looking like a dead pixel.
 * ------------------------------------------------------------------------- */

type Rgb = [number, number, number];
type Lab = [number, number, number];

const s2l = (c: number) => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
const l2s = (c: number) => (c <= 0.0031308 ? c * 12.92 : 1.055 * Math.pow(c, 1 / 2.4) - 0.055);

function rgbToOklab([r0, g0, b0]: Rgb): Lab {
  const r = s2l(r0);
  const g = s2l(g0);
  const b = s2l(b0);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

function oklabToCss(L: number, a: number, bb: number): string {
  const l = (L + 0.3963377774 * a + 0.2158037573 * bb) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * bb) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * bb) ** 3;
  const r = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const b = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;
  return `rgb(${Math.round(clamp01(l2s(clamp01(r))) * 255)},${Math.round(
    clamp01(l2s(clamp01(g))) * 255
  )},${Math.round(clamp01(l2s(clamp01(b))) * 255)})`;
}

/** Accepts `#rgb`, `#rrggbb`, and `rgb()/rgba()` in any separator style. */
function parseColor(input: string): Rgb | null {
  const s = input.trim();
  if (s.startsWith('#')) {
    const h = s.slice(1);
    const pair = (a: string, b: string) => parseInt(a + b, 16) / 255;
    if (h.length === 3) return [pair(h[0], h[0]), pair(h[1], h[1]), pair(h[2], h[2])];
    if (h.length >= 6) return [pair(h[0], h[1]), pair(h[2], h[3]), pair(h[4], h[5])];
    return null;
  }
  const nums = s.match(/-?[\d.]+/g);
  if (!nums || nums.length < 3) return null;
  const rgb: Rgb = [Number(nums[0]) / 255, Number(nums[1]) / 255, Number(nums[2]) / 255];
  return rgb.every(Number.isFinite) ? rgb : null;
}

const hexToOklab = (hex: string): Lab => rgbToOklab(parseColor(hex) as Rgb);

/* ---- keyframe geometry ----------------------------------------------------
 * Art-directed and screenshot-validated at 240px, 36px and 28px on both
 * backgrounds. The numbers are final; changing one changes the brand.
 *
 * Max radius in play is 10.6 (stage 3's corona) plus a 0.6 stroke half-width =
 * 11.2, inside the 12 the 24×24 viewBox allows. Nothing clips on any stage.
 * ------------------------------------------------------------------------- */

interface Keyframe {
  ring: RadiusFn;
  core: RadiusFn;
  mid: { fn: RadiusFn; alpha: number };
  rays: Ray[];
  rayAlpha: number;
  /** Rays stroke width. The aperture's blade bars match the barrel at 1.5; the
   *  cymatic stages keep their finer 1.2 default. Lerped per frame. */
  rayWidth?: number;
}

const KF: Keyframe[] = [
  {
    // 0 — THE APERTURE. Matches the corrected static mark exactly: circle r=10,
    // hexagonal iris r=3.9, six overlapping-shutter blade bars.
    // [4.775, −60.18, 9.6, 34.54] is the derived edge-line bar — see
    // aperture-paths.ts for the construction; sampled every 4th slot it
    // reproduces BLADE_SEAMS to 2dp. Bars share the barrel's stroke width.
    ring: circle(10),
    core: hexagon(3.9),
    mid: { fn: circle(6.7), alpha: 0 },
    rays: rayPool(4, 4.775, -60.18, 9.6, 34.54, 9.5),
    rayAlpha: 1,
    rayWidth: 1.5,
  },
  {
    // 1 — amber bloom: 10-petal rosette over a 5-lobe core
    ring: harmonic(10, [[10, 0.3, 0]]),
    core: harmonic(2.9, [[5, 0.55, 0]]),
    mid: { fn: harmonic(6.3, [[10, 1.5, 18]]), alpha: 1 },
    rays: rayPool(0, 0, 0, 0, 0, 9.7),
    rayAlpha: 0,
  },
  {
    // 2 — gold sun-wheel: 12 spokes off a bumped hub
    ring: circle(10),
    core: harmonic(3.3, [[8, 0.45, 0]]),
    mid: { fn: harmonic(5.0, [[12, 0.35, 0]]), alpha: 0.65 },
    rays: rayPool(2, 5.3, 0, 9.5, 4, 9.5),
    rayAlpha: 1,
  },
  {
    // 3 — chartreuse resonance disc: fine 24-tick corona
    ring: harmonic(10, [[24, 0.35, 0]]),
    core: circle(2.1),
    mid: { fn: harmonic(6.1, [[24, 0.5, 7.5]]), alpha: 1 },
    rays: rayPool(1, 8.3, 0, 10.6, 0, 8.3),
    rayAlpha: 0.9,
  },
  {
    // 4 — blue ripple: 18-lobe ring, 12 tilted jets
    ring: circle(10),
    core: circle(1.5),
    mid: { fn: harmonic(4.6, [[18, 0.4, 0]]), alpha: 1 },
    rays: rayPool(2, 6.6, 0, 9.6, 10, 9.6),
    rayAlpha: 1,
  },
  {
    // 5 — indigo mandala: 8-fold star over a soft hex core
    ring: harmonic(10, [[8, 0.3, 22.5]]),
    core: harmonic(2.9, [[6, 0.6, 30]]),
    mid: { fn: harmonic(6.3, [[8, 1.25, 0]]), alpha: 1 },
    rays: rayPool(0, 0, 0, 0, 0, 9.6),
    rayAlpha: 0,
  },
  {
    // 6 — violet rosette: 12 fat petals, scalloped rim
    ring: harmonic(10, [[12, 0.5, 15]]),
    core: circle(1.7),
    mid: { fn: harmonic(6.0, [[12, 1.7, 15]]), alpha: 1 },
    rays: rayPool(0, 0, 0, 0, 0, 9.6),
    rayAlpha: 0,
  },
];

const STAGES = KF.length;
const TOTAL_MS = STAGES * STAGE_MS;

/** Pre-sampled once at module load and shared by every instance. */
const GEOM = KF.map((k) => ({
  ring: sampleRadii(k.ring),
  core: sampleRadii(k.core),
  mid: sampleRadii(k.mid.fn),
  midAlpha: k.mid.alpha,
  rays: k.rays,
  rayAlpha: k.rayAlpha,
  rayWidth: k.rayWidth ?? 1.2,
}));

/* ---- palettes -------------------------------------------------------------
 * Hue travels the wheel: coral → amber → gold → chartreuse → blue → indigo →
 * violet → back to coral. Stage 0 is not listed: it is read from the live
 * `--accent-primary` at runtime so the aperture stage is always exactly the
 * brand coral in whichever theme is active.
 *
 * The light palette is darkened because these sit on a #F7F8FA canvas — the
 * dark palette's amber and chartreuse are unreadable there.
 * ------------------------------------------------------------------------- */

const PALETTE_DARK = ['#F59E0B', '#E8A020', '#B9CC2E', '#38BDF8', '#7C6FF0', '#A855F7'];
const PALETTE_LIGHT = ['#B45309', '#A16207', '#7C8A12', '#0369A1', '#4F46E5', '#7E22CE'];

/** Flat [L,a,b, L,a,b, …] for stages 1…6, pre-converted at module load. */
function packLabs(hexes: string[]): Float64Array {
  const out = new Float64Array(hexes.length * 3);
  hexes.forEach((hex, i) => out.set(hexToOklab(hex), i * 3));
  return out;
}
const LABS_DARK = packLabs(PALETTE_DARK);
const LABS_LIGHT = packLabs(PALETTE_LIGHT);

/** Used only if `--accent-primary` can't be read (it always can, in practice). */
const CORAL_FALLBACK = { dark: '#FF6B4A', light: '#CE3D1C' } as const;

/* ---- path building -------------------------------------------------------- */

const COS = new Float64Array(N);
const SIN = new Float64Array(N);
for (let i = 0; i < N; i++) {
  COS[i] = Math.cos((i / N) * TAU);
  SIN[i] = Math.sin((i / N) * TAU);
}

function polarPath(radii: Float64Array): string {
  let d = '';
  for (let i = 0; i < N; i++) {
    d +=
      (i ? 'L' : 'M') +
      (12 + radii[i] * COS[i]).toFixed(2) +
      ' ' +
      (12 + radii[i] * SIN[i]).toFixed(2);
  }
  return d + 'Z';
}

function raysPath(pool: Ray[]): string {
  let d = '';
  for (let i = 0; i < RAYS; i++) {
    const [r1, a1o, r2, a2o] = pool[i];
    // collapsed to a point → contributes nothing (butt caps)
    if (Math.abs(r2 - r1) < 0.05 && Math.abs(a2o - a1o) < 0.05) continue;
    const slot = (i / RAYS) * TAU;
    const a1 = slot + (a1o * Math.PI) / 180;
    const a2 = slot + (a2o * Math.PI) / 180;
    d +=
      'M' +
      (12 + r1 * Math.cos(a1)).toFixed(2) +
      ' ' +
      (12 + r1 * Math.sin(a1)).toFixed(2) +
      'L' +
      (12 + r2 * Math.cos(a2)).toFixed(2) +
      ' ' +
      (12 + r2 * Math.sin(a2)).toFixed(2);
  }
  return d;
}

/* ---- interpolation -------------------------------------------------------- */

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smootherstep = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);

interface Scratch {
  ring: Float64Array;
  core: Float64Array;
  mid: Float64Array;
  rays: Ray[];
  /** Stage 0's colour is per-theme and read at runtime, so labs are per-instance. */
  labs: Float64Array;
}

function makeScratch(): Scratch {
  const rays: Ray[] = [];
  for (let i = 0; i < RAYS; i++) rays.push([0, 0, 0, 0]);
  return {
    ring: new Float64Array(N),
    core: new Float64Array(N),
    mid: new Float64Array(N),
    rays,
    labs: new Float64Array(STAGES * 3),
  };
}

/* ---- component ------------------------------------------------------------ */

export function AnimatedApertureMark({ className }: { className?: string }) {
  const { resolvedTheme } = useTheme();

  const svgRef = React.useRef<SVGSVGElement | null>(null);
  const barrelRef = React.useRef<SVGCircleElement | null>(null);
  const ringRef = React.useRef<SVGPathElement | null>(null);
  const midRef = React.useRef<SVGPathElement | null>(null);
  const coreRef = React.useRef<SVGPathElement | null>(null);
  const raysRef = React.useRef<SVGPathElement | null>(null);

  const themeRef = React.useRef(resolvedTheme);
  const colorsDirtyRef = React.useRef(true);

  // A theme flip only raises a flag. The colour read has to happen inside the
  // rAF tick, not here: this is a child effect, so it runs BEFORE ThemeProvider's
  // parent effect has swapped the `.light`/`.dark` class onto <html>, and reading
  // the custom property now would get the outgoing theme's coral.
  React.useEffect(() => {
    themeRef.current = resolvedTheme;
    colorsDirtyRef.current = true;
  }, [resolvedTheme]);

  React.useEffect(() => {
    const svg = svgRef.current;
    const barrel = barrelRef.current;
    const ringEl = ringRef.current;
    const midEl = midRef.current;
    const coreEl = coreRef.current;
    const raysEl = raysRef.current;
    if (!svg || !barrel || !ringEl || !midEl || !coreEl || !raysEl) return;

    const scratch = makeScratch();
    const { labs } = scratch;

    let raf = 0;
    let t0 = 0;
    let lastHeldIdx = -1;
    let running = false;
    let visible = false;
    let allowed = false; // false while prefers-reduced-motion is set

    /**
     * Stage 0's coral comes from the live `--accent-primary`, read off the svg
     * as an inherited custom property. Reading `.color` instead would be wrong
     * once the engine has written an inline colour — it would echo the animation
     * back at itself.
     */
    const buildLabs = () => {
      const theme = themeRef.current;
      const raw = getComputedStyle(svg).getPropertyValue('--accent-primary');
      const rgb = parseColor(raw) ?? parseColor(CORAL_FALLBACK[theme]);
      labs.set(rgbToOklab(rgb as Rgb), 0);
      labs.set(theme === 'light' ? LABS_LIGHT : LABS_DARK, 3);
    };

    const paintStage = (idx: number, t: number) => {
      const a = GEOM[idx];
      const b = GEOM[(idx + 1) % STAGES];
      const { ring, core, mid, rays } = scratch;

      for (let i = 0; i < N; i++) {
        ring[i] = lerp(a.ring[i], b.ring[i], t);
        core[i] = lerp(a.core[i], b.core[i], t);
        mid[i] = lerp(a.mid[i], b.mid[i], t);
      }
      for (let i = 0; i < RAYS; i++) {
        const ar = a.rays[i];
        const br = b.rays[i];
        const sr = rays[i];
        sr[0] = lerp(ar[0], br[0], t);
        sr[1] = lerp(ar[1], br[1], t);
        sr[2] = lerp(ar[2], br[2], t);
        sr[3] = lerp(ar[3], br[3], t);
      }

      const j = idx * 3;
      const k = ((idx + 1) % STAGES) * 3;

      ringEl.setAttribute('d', polarPath(ring));
      midEl.setAttribute('d', polarPath(mid));
      midEl.setAttribute('opacity', lerp(a.midAlpha, b.midAlpha, t).toFixed(3));
      coreEl.setAttribute('d', polarPath(core));
      raysEl.setAttribute('d', raysPath(rays));
      raysEl.setAttribute('opacity', lerp(a.rayAlpha, b.rayAlpha, t).toFixed(3));
      // Blade bars share the barrel's 1.5; cymatic rays ease to their finer 1.2.
      raysEl.setAttribute('stroke-width', lerp(a.rayWidth, b.rayWidth, t).toFixed(3));
      svg.style.color = oklabToCss(
        lerp(labs[j], labs[k], t),
        lerp(labs[j + 1], labs[k + 1], t),
        lerp(labs[j + 2], labs[k + 2], t)
      );
    };

    /** Back to the literal static mark — the state the DOM was born in. */
    const resetStatic = () => {
      barrel.style.removeProperty('display');
      ringEl.removeAttribute('d');
      midEl.removeAttribute('d');
      midEl.setAttribute('opacity', '0');
      coreEl.setAttribute('d', OPENING_BLADES);
      raysEl.setAttribute('d', BLADE_SEAMS);
      raysEl.setAttribute('opacity', '1');
      raysEl.setAttribute('stroke-width', '1.5');
      svg.style.removeProperty('color'); // fall back to `text-primary`
    };

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);

      if (colorsDirtyRef.current) {
        buildLabs();
        colorsDirtyRef.current = false;
        lastHeldIdx = -1; // force a repaint in the new theme's colours
      }

      // rAF hands a callback the timestamp of the frame it belongs to, and that
      // can PREDATE the performance.now() captured in start() — start() runs from
      // the IntersectionObserver callback, which is delivered during a frame's
      // rendering steps, i.e. after that frame's timestamp was taken. The first
      // tick therefore saw a negative delta, and JS's `%` is signed, so `cycle`
      // went negative, `idx` came out -1, and GEOM[-1] is undefined. Clamping the
      // elapsed time is enough: a tick that arrives "before" t0 is just t = 0,
      // the aperture, which is where the cycle starts anyway.
      const elapsed = now - t0;
      const cycle = elapsed > 0 ? elapsed % TOTAL_MS : 0;
      const idx = Math.floor(cycle / STAGE_MS);
      const u = (cycle % STAGE_MS) / STAGE_MS;
      const holding = u < HOLD_FRAC;

      // Nothing changes during the 1.5s hold, so do nothing at all: no lerp, no
      // string building, no DOM writes, no allocation.
      if (holding && lastHeldIdx === idx) return;

      paintStage(idx, holding ? 0 : smootherstep((u - HOLD_FRAC) / (1 - HOLD_FRAC)));
      lastHeldIdx = holding ? idx : -1;
    };

    const start = () => {
      if (running || !allowed || !visible) return;
      running = true;
      buildLabs();
      colorsDirtyRef.current = false;
      t0 = performance.now();
      lastHeldIdx = 0;
      // Paint stage 0 before hiding the barrel, so the handover from <circle> to
      // the 120-gon ring happens within one frame and is invisible either way
      // (the polygon deviates from the true circle by 0.003 of a viewBox unit).
      paintStage(0, 0);
      barrel.style.display = 'none';
      raf = requestAnimationFrame(tick);
    };

    const stop = () => {
      if (!running) return;
      running = false;
      cancelAnimationFrame(raf);
      raf = 0;
      // Rest in brand state rather than wherever the morph happened to be.
      resetStatic();
    };

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onMotionPref = () => {
      allowed = !mq.matches;
      if (allowed) start();
      else stop();
    };
    allowed = !mq.matches;
    mq.addEventListener('change', onMotionPref);

    // The footer mark shouldn't burn frames while the visitor is at the top of
    // the page. Tab-hidden pausing comes free with rAF.
    const io = new IntersectionObserver((entries) => {
      visible = entries[entries.length - 1].isIntersecting;
      if (visible) start();
      else stop();
    });
    io.observe(svg);

    return () => {
      // stop() rather than a bare cancelAnimationFrame: on a real unmount the
      // nodes are detached and the reset is a no-op, but React's development
      // double-invoke remounts these same nodes, and a discarded engine must not
      // leave the barrel hidden behind a ring path nobody is driving any more.
      stop();
      io.disconnect();
      mq.removeEventListener('change', onMotionPref);
    };
  }, []);

  /* The initial tree IS `ApertureMark`'s tree — same barrel circle, same
     OPENING_BLADES iris, same BLADE_SEAMS — plus three inert paths the engine
     picks up after mount. Server HTML and first client paint are therefore
     byte-identical to the static mark: no hydration mismatch, no flash, no CLS.

     The barrel stays a <circle> (rather than shipping a pre-sampled ring path)
     so first paint is the real static mark down to the anti-aliasing. The engine
     hides it and drives the ring <path> instead, since only a path has a `d`. */
  return (
    <svg
      ref={svgRef}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      className={cn('shrink-0 text-primary', className)}
    >
      {/* Barrel — hidden by the engine, restored when it stops */}
      <circle
        ref={barrelRef}
        cx="12"
        cy="12"
        r="10"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      {/* ring → mid → core → rays, back to front */}
      <path ref={ringRef} fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path ref={midRef} fill="none" stroke="currentColor" strokeWidth="1.1" opacity="0" />
      <path ref={coreRef} d={OPENING_BLADES} fill="currentColor" />
      <path ref={raysRef} d={BLADE_SEAMS} fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export default AnimatedApertureMark;
