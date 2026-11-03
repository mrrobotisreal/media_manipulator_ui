/**
 * Fragment shader for the rung-1 adjustment passes (design §3, §7). It MIRRORS
 * `lib/photo/colorMath.ts` stage for stage with the same constant names; keep
 * them in step (the Playwright parity spec `e2e/photo-parity.spec.ts` compares
 * the GPU against the goldens on the workstation).
 *
 * One program per layer type: the renderer prepends `#define T_<TYPE>` so only
 * that type's branch compiles. Parameters travel in `uP[]` (vec4 slots, layout
 * in `packLayerUniforms` in `../uniforms.ts`), curves in `uCurves`, the `.cube`
 * in `uLut`. Opacity and blend are applied after the adjustment, like
 * `applyLayer` in colorMath.ts. Alpha is never touched.
 */
export const VERT_SRC = `#version 300 es
precision highp float;
uniform float uFlipY;
out vec2 vUV;
void main() {
  // Full-screen triangle; vUV (0,0) is the TOP-left of the image.
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  vUV = p;
  vec2 clip = p * 2.0 - 1.0;
  gl_Position = vec4(clip.x, uFlipY > 0.5 ? -clip.y : clip.y, 0.0, 1.0);
}`;

export const FRAG_SRC = `#version 300 es
precision highp float;
precision highp sampler3D;
in vec2 vUV;
out vec4 fragColor;

uniform sampler2D uSource;
uniform sampler2D uCurves; // 256x1 RGBA: r, g, b, master curves
uniform sampler3D uLut;
uniform vec4 uP[40];
uniform int uN;
uniform float uLutSize;
uniform float uOpacity;
uniform int uBlend; // 0 normal, 1 luminosity, 2 color

const vec3 LUMA = vec3(0.2126, 0.7152, 0.0722);
const vec3 VIBRANCE_LUMA = vec3(0.072186, 0.715158, 0.212656);
const float HSL_NEUTRAL_SAT = 0.1;
const float COLOR_BALANCE_GAIN = 0.3;
const float SPLIT_TONE_GAIN = 0.25;
const float TINT_GAIN = 0.25;
const float MIN_LUMA = 1e-4;

float luma(vec3 c) { return dot(c, LUMA); }
vec3 clamp01(vec3 c) { return clamp(c, 0.0, 1.0); }
float sstep(float e0, float e1, float x) {
  if (e1 == e0) return x < e0 ? 0.0 : 1.0;
  float t = clamp((x - e0) / (e1 - e0), 0.0, 1.0);
  return t * t * (3.0 - 2.0 * t);
}

vec3 srgbToLinear(vec3 v) {
  return mix(pow((v + 0.055) / 1.055, vec3(2.4)), v / 12.92, lessThanEqual(v, vec3(0.04045)));
}
vec3 linearToSrgb(vec3 v) {
  return mix(1.055 * pow(max(v, vec3(0.0)), vec3(1.0 / 2.4)) - 0.055, v * 12.92, lessThanEqual(v, vec3(0.0031308)));
}

vec3 rgbToHsl(vec3 c) {
  float mx = max(c.r, max(c.g, c.b));
  float mn = min(c.r, min(c.g, c.b));
  float l = (mx + mn) * 0.5;
  float d = mx - mn;
  if (d == 0.0) return vec3(0.0, 0.0, l);
  float s = d / (1.0 - abs(2.0 * l - 1.0));
  float h;
  if (mx == c.r) h = mod((c.g - c.b) / d, 6.0);
  else if (mx == c.g) h = (c.b - c.r) / d + 2.0;
  else h = (c.r - c.g) / d + 4.0;
  h *= 60.0;
  if (h < 0.0) h += 360.0;
  return vec3(h, clamp(s, 0.0, 1.0), l);
}
vec3 hslToRgb(float h, float s, float l) {
  float hh = mod(mod(h, 360.0) + 360.0, 360.0) / 60.0;
  float c = (1.0 - abs(2.0 * l - 1.0)) * s;
  float x = c * (1.0 - abs(mod(hh, 2.0) - 1.0));
  float m = l - c * 0.5;
  vec3 rgb;
  if (hh < 1.0) rgb = vec3(c, x, 0.0);
  else if (hh < 2.0) rgb = vec3(x, c, 0.0);
  else if (hh < 3.0) rgb = vec3(0.0, c, x);
  else if (hh < 4.0) rgb = vec3(0.0, x, c);
  else if (hh < 5.0) rgb = vec3(x, 0.0, c);
  else rgb = vec3(c, 0.0, x);
  return rgb + m;
}
vec3 hueToRGB(float hueDeg) {
  float h = mod(mod(hueDeg, 360.0) + 360.0, 360.0) / 360.0;
  return clamp(vec3(abs(h * 6.0 - 3.0) - 1.0, 2.0 - abs(h * 6.0 - 2.0), 2.0 - abs(h * 6.0 - 4.0)), 0.0, 1.0);
}
float rangeWeight(float h, float center, float width, float feather) {
  float d = abs(mod(mod(h - center, 360.0) + 540.0, 360.0) - 180.0);
  float half_ = width * 0.5;
  if (d <= half_) return 1.0;
  if (feather <= 0.0 || d >= half_ + feather) return 0.0;
  return 1.0 - (d - half_) / feather;
}
float curveSample(float v, int ch) {
  float x = (clamp(v, 0.0, 1.0) * 255.0 + 0.5) / 256.0;
  vec4 t = texture(uCurves, vec2(x, 0.5));
  return ch == 0 ? t.r : ch == 1 ? t.g : ch == 2 ? t.b : t.a;
}
float levelsCh(float v, vec4 a, vec4 b) {
  float span = max(a.y - a.x, 1e-6);
  float t = clamp((v - a.x) / span, 0.0, 1.0);
  return clamp(pow(t, 1.0 / a.z) * (b.y - b.x) + b.x, 0.0, 1.0);
}
vec3 rescaleToLuma(vec3 c, float target) {
  float L = luma(c);
  if (L < MIN_LUMA) return c;
  return clamp01(c * (target / L));
}
float midtoneWeight(vec3 c) {
  float l = 0.5 * (max(c.r, max(c.g, c.b)) + min(c.r, min(c.g, c.b)));
  return clamp((l - 0.333) * 4.0 + 0.5, 0.0, 1.0) * clamp((1.0 - l - 0.333) * 4.0 + 0.5, 0.0, 1.0) * 0.7;
}

vec3 adjust(vec3 c) {
#ifdef T_EXPOSURE
  vec3 lin = clamp01(srgbToLinear(c) * exp2(uP[0].x) + uP[0].y);
  return clamp01(pow(linearToSrgb(lin), vec3(1.0 / uP[0].z)));
#endif
#ifdef T_BRIGHTNESSCONTRAST
  float k = exp2(uP[0].y / 50.0);
  return clamp01((clamp01(c + uP[0].x / 200.0) - 0.5) * k + 0.5);
#endif
#ifdef T_TONE
  float L = luma(c);
  float wSh = 1.0 - sstep(0.0, 0.6, L);
  float wHi = sstep(0.4, 1.0, L);
  float wBl = 1.0 - sstep(0.0, 0.25, L);
  float wWh = sstep(0.75, 1.0, L);
  // uP[0] = (highlights, shadows, whites, blacks)
  float dL = 0.25 * (uP[0].y / 100.0) * wSh + 0.25 * (uP[0].x / 100.0) * wHi + 0.15 * (uP[0].w / 100.0) * wBl + 0.15 * (uP[0].z / 100.0) * wWh;
  return clamp01(c * (clamp(L + dL, 0.0, 1.0) / max(L, MIN_LUMA)));
#endif
#ifdef T_LEVELS
  vec3 o;
  o.r = levelsCh(levelsCh(c.r, uP[2], uP[3]), uP[0], uP[1]);
  o.g = levelsCh(levelsCh(c.g, uP[4], uP[5]), uP[0], uP[1]);
  o.b = levelsCh(levelsCh(c.b, uP[6], uP[7]), uP[0], uP[1]);
  return o;
#endif
#ifdef T_CURVES
  return vec3(curveSample(curveSample(c.r, 0), 3), curveSample(curveSample(c.g, 1), 3), curveSample(curveSample(c.b, 2), 3));
#endif
#ifdef T_WHITEBALANCE
  vec3 lin = srgbToLinear(c);
  float t = uP[0].x / 100.0;
  float ti = uP[0].y / 100.0;
  float w = midtoneWeight(lin);
  vec3 sh = clamp01(lin + vec3(t, -ti, -t) * w);
  return clamp01(linearToSrgb(sh));
#endif
#ifdef T_VIBRANCESATURATION
  float i = uP[0].x / 100.0;
  float sat = max(c.r, max(c.g, c.b)) - min(c.r, min(c.g, c.b));
  float lv = dot(c, VIBRANCE_LUMA);
  float f = 1.0 + i * (1.0 - sign(i) * sat);
  vec3 v = clamp01(lv + (c - lv) * f);
  float le = luma(v);
  float nl = (le - 0.5) * 1.0 + 0.5;
  return clamp01(nl + (v - le) * (1.0 + uP[0].y / 100.0));
#endif
#ifdef T_HSL
  vec3 hsl = rgbToHsl(c);
  float neutral = min(1.0, hsl.y / HSL_NEUTRAL_SAT);
  float dh = uP[0].x;
  float sMul = 1.0 + uP[0].y / 100.0;
  float dl0 = uP[0].z / 100.0;
  float lPos = max(dl0, 0.0);
  float lNeg = min(dl0, 0.0);
  for (int i = 0; i < 16; i++) {
    if (i >= uN) break;
    vec4 a = uP[1 + 2 * i];
    vec4 b = uP[2 + 2 * i];
    float w = rangeWeight(hsl.x, a.x, a.y, a.z) * neutral;
    if (w == 0.0) continue;
    dh += w * a.w;
    sMul *= 1.0 + w * b.x / 100.0;
    float dlr = w * b.y / 100.0;
    if (dlr > 0.0) lPos += dlr; else lNeg += dlr;
  }
  float s2 = clamp(hsl.y * sMul, 0.0, 1.0);
  float l2 = clamp(hsl.z + lPos * (1.0 - hsl.z) + lNeg * hsl.z, 0.0, 1.0);
  return clamp01(hslToRgb(hsl.x + dh, s2, l2));
#endif
#ifdef T_COLORBALANCE
  float L = luma(c);
  float wSh = 1.0 - sstep(0.0, 0.5, L);
  float wMid = midtoneWeight(c);
  float wHi = sstep(0.5, 1.0, L);
  vec3 add = COLOR_BALANCE_GAIN * ((wSh * uP[0].rgb + wMid * uP[1].rgb + wHi * uP[2].rgb) / 100.0);
  vec3 o = clamp01(c + add);
  return uP[3].x > 0.5 ? rescaleToLuma(o, L) : o;
#endif
#ifdef T_BLACKWHITE
  float mx = max(c.r, max(c.g, c.b));
  float mn = min(c.r, min(c.g, c.b));
  float S = mx == 0.0 ? 0.0 : (mx - mn) / mx;
  float V = mx;
  float h = rgbToHsl(c).x;
  float L = luma(c);
  float mixv = 0.0;
  mixv += rangeWeight(h, 0.0, 30.0, 30.0) * (uP[0].x / 100.0);
  mixv += rangeWeight(h, 60.0, 30.0, 30.0) * (uP[0].y / 100.0);
  mixv += rangeWeight(h, 120.0, 30.0, 30.0) * (uP[0].z / 100.0);
  mixv += rangeWeight(h, 180.0, 30.0, 30.0) * (uP[0].w / 100.0);
  mixv += rangeWeight(h, 240.0, 30.0, 30.0) * (uP[1].x / 100.0);
  mixv += rangeWeight(h, 300.0, 30.0, 30.0) * (uP[1].y / 100.0);
  float gray = clamp((1.0 - S) * L + S * mixv * V, 0.0, 1.0);
  if (uP[1].z < 0.5) return vec3(gray);
  float a = (uP[2].x / 100.0) * TINT_GAIN;
  return clamp01(vec3(gray) + a * (hueToRGB(uP[1].w) - 0.5));
#endif
#ifdef T_CHANNELMIXER
  vec3 r = clamp01(vec3((uP[0].x * c.r + uP[0].y * c.g + uP[0].z * c.b + uP[0].w) / 100.0));
  if (uP[3].x > 0.5) return vec3(r.x);
  float g = clamp((uP[1].x * c.r + uP[1].y * c.g + uP[1].z * c.b + uP[1].w) / 100.0, 0.0, 1.0);
  float b = clamp((uP[2].x * c.r + uP[2].y * c.g + uP[2].z * c.b + uP[2].w) / 100.0, 0.0, 1.0);
  return vec3(r.x, g, b);
#endif
#ifdef T_PHOTOFILTER
  vec3 o = mix(c, c * uP[0].rgb, uP[0].w);
  return uP[1].x > 0.5 ? rescaleToLuma(o, luma(c)) : o;
#endif
#ifdef T_SPLITTONE
  float L = luma(c);
  float e = 0.5 + (uP[1].x / 100.0) * 0.25;
  float wSh = 1.0 - sstep(0.0, e, L);
  float wHi = sstep(e, 1.0, L);
  vec3 a = SPLIT_TONE_GAIN * (uP[0].y / 100.0) * wSh * (hueToRGB(uP[0].x) - 0.5);
  vec3 b = SPLIT_TONE_GAIN * (uP[0].w / 100.0) * wHi * (hueToRGB(uP[0].z) - 0.5);
  return clamp01(c + a + b);
#endif
#ifdef T_LUT
  if (uLutSize < 2.0) return c;
  vec3 coord = (clamp01(c) * (uLutSize - 1.0) + 0.5) / uLutSize;
  return mix(c, texture(uLut, coord).rgb, uP[0].x);
#endif
#ifdef T_INVERT
  return 1.0 - c;
#endif
#ifdef T_POSTERIZE
  float n = uP[0].x - 1.0;
  return floor(clamp01(c) * n + 0.5) / n;
#endif
#ifdef T_THRESHOLD
  return vec3(luma(c) >= uP[0].x ? 1.0 : 0.0);
#endif
#ifdef T_GAMMA
  return clamp01(pow(clamp01(c), vec3(1.0 / uP[0].x)));
#endif
#ifdef T_REDEYE
  return vec3(min(c.r, (c.g + c.b) * 0.5), c.g, c.b);
#endif
#ifdef T_COPY
  return c;
#endif
}

void main() {
  vec4 src = texture(uSource, vUV);
  vec3 c = src.rgb;
  vec3 a = adjust(c);
#ifndef T_COPY
  if (uBlend == 1) {
    a = clamp01(c + (luma(a) - luma(c)));
  } else if (uBlend == 2) {
    a = clamp01(a + (luma(c) - luma(a)));
  }
  a = mix(c, a, clamp(uOpacity, 0.0, 1.0));
#endif
  fragColor = vec4(a, src.a);
}`;
