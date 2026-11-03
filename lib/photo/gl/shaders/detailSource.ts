/**
 * Fragment shader for the rung-4 detail passes (design §5.4, MM99). Mirrors
 * `lib/photo/colorMath.ts` "Detail" section; constants keep their names.
 * One program per `#define D_*`; multi-pass ops chain several defines (the
 * renderer's `runDetail` sequences them):
 *
 * - sharpen / clarity / texture: `D_LUMA_H` (horizontal Gaussian of luma into
 *   .r) then `D_UNSHARP_V` (vertical Gaussian, unsharp, blend tail).
 * - blur: `D_BLUR_H`, `D_BLUR_V`.
 * - noiseReduction: `D_NR_LAB` (Lab), `D_NR_BIL` (9x9 bilateral on L + chroma
 *   horizontal blur), `D_NR_FIN` (chroma vertical blur, Lab -> RGB, tail).
 * - dehaze: `D_DARK_H`, `D_DARK_V` (15x15 min of min(rgb)), `D_DARK_SAMPLE`
 *   (a small RGBA8 grid the CPU reads for the 99.5th percentile), `D_DEHAZE`.
 * - vignette: `D_VIGNETTE`; grain: `D_GRAIN` (PCG, bit-identical to pcgHash).
 *
 * The final pass of each op reads the ORIGINAL input in `uSource` and applies
 * the blend mode / opacity / mask like `mixLayer`. Pixel (x, y) = floor(vUV * uSize).
 */
export const DETAIL_FRAG = `#version 300 es
precision highp float;
precision highp int;
in vec2 vUV;
out vec4 fragColor;

uniform sampler2D uSource;
uniform sampler2D uPrev;
uniform sampler2D uMask;
uniform int uHasMask;
uniform vec2 uSize;
uniform vec4 uP[4];
uniform vec2 uDir;
uniform float uSigma;
uniform float uA;
uniform uvec4 uU;
uniform float uOpacity;
uniform int uBlend;

const vec3 LUMA = vec3(0.2126, 0.7152, 0.0722);
const int BILATERAL_RADIUS = 4;
const int DEHAZE_WINDOW_RADIUS = 7;
const float DEHAZE_OMEGA = 0.95;
const float DEHAZE_MIN_T = 0.1;
const float DEHAZE_HAZE_GAIN = 0.5;
const float GRAIN_GAIN = 0.2;
const uint GRAIN_Y_OFFSET = 0x9E3779B9u;
const uint GRAIN_SALT = 0x85EBCA6Bu;
const float GRAIN_ROUGHNESS_MIX = 0.5;
const int MAX_TAPS = 400;

ivec2 px() { return ivec2(floor(vUV * uSize)); }
ivec2 clampQ(ivec2 q) { return clamp(q, ivec2(0), ivec2(uSize) - 1); }
vec4 src(ivec2 q) { return texelFetch(uSource, clampQ(q), 0); }
vec4 prv(ivec2 q) { return texelFetch(uPrev, clampQ(q), 0); }
float luma(vec3 c) { return dot(c, LUMA); }
vec3 clamp01(vec3 c) { return clamp(c, 0.0, 1.0); }
float sstep(float e0, float e1, float x) {
  if (e1 == e0) return x < e0 ? 0.0 : 1.0;
  float t = clamp((x - e0) / (e1 - e0), 0.0, 1.0);
  return t * t * (3.0 - 2.0 * t);
}
vec3 srgbToLinear(vec3 v) {
  return mix(pow((max(v, 0.0) + 0.055) / 1.055, vec3(2.4)), v / 12.92, lessThanEqual(v, vec3(0.04045)));
}
vec3 linearToSrgb(vec3 v) {
  return mix(1.055 * pow(max(v, 0.0), vec3(1.0 / 2.4)) - 0.055, v * 12.92, lessThanEqual(v, vec3(0.0031308)));
}
float labF(float t) { return t > 216.0 / 24389.0 ? pow(t, 1.0 / 3.0) : (24389.0 / 27.0 * t + 16.0) / 116.0; }
vec3 rgbToLab(vec3 c) {
  vec3 l = srgbToLinear(c);
  float x = (0.4124564 * l.r + 0.3575761 * l.g + 0.1804375 * l.b) / 0.95047;
  float y = 0.2126729 * l.r + 0.7151522 * l.g + 0.072175 * l.b;
  float z = (0.0193339 * l.r + 0.119192 * l.g + 0.9503041 * l.b) / 1.08883;
  float fx = labF(x), fy = labF(y), fz = labF(z);
  return vec3(116.0 * fy - 16.0, 500.0 * (fx - fy), 200.0 * (fy - fz));
}
float labFinv(float f) { return f > 6.0 / 29.0 ? f * f * f : (116.0 * f - 16.0) * 27.0 / 24389.0; }
vec3 labToRgb(vec3 lab) {
  float fy = (lab.x + 16.0) / 116.0;
  float fx = fy + lab.y / 500.0;
  float fz = fy - lab.z / 200.0;
  float x = labFinv(fx) * 0.95047;
  float y = labFinv(fy);
  float z = labFinv(fz) * 1.08883;
  vec3 lin = vec3(3.2404542 * x - 1.5371385 * y - 0.4985314 * z, -0.969266 * x + 1.8760108 * y + 0.041556 * z, 0.0556434 * x - 0.2040259 * y + 1.0572252 * z);
  return clamp01(linearToSrgb(clamp01(lin)));
}

// Blend (normal / luminosity / color), opacity and the layer mask, like mixLayer.
vec4 tail(vec3 c, vec3 a, float alpha) {
  if (uBlend == 1) a = clamp01(c + (luma(a) - luma(c)));
  else if (uBlend == 2) a = clamp01(a + (luma(c) - luma(a)));
  float mv = uHasMask == 1 ? texture(uMask, vUV).r : 1.0;
  return vec4(mix(c, a, clamp(uOpacity * mv, 0.0, 1.0)), alpha);
}

uint pcg(uint v) {
  uint s = v * 747796405u + 2891336453u;
  uint w = ((s >> ((s >> 28u) + 4u)) ^ s) * 277803737u;
  return (w >> 22u) ^ w;
}
uint grainHash(uint x, uint y, uint seed) { return pcg(pcg(x ^ seed) ^ (y + GRAIN_Y_OFFSET)); }

void main() {
  ivec2 p = px();
  vec4 s0 = src(p);
  vec3 c = s0.rgb;
#if defined(D_LUMA_H) || defined(D_BLUR_H) || defined(D_BLUR_V) || defined(D_UNSHARP_V)
  // Separable Gaussian along uDir (sigma uSigma), taps normalised on the fly, edges replicated.
  int r = min(int(ceil(3.0 * uSigma)), MAX_TAPS);
  float wsum = 0.0;
  vec4 acc = vec4(0.0);
  for (int k = -MAX_TAPS; k <= MAX_TAPS; k++) {
    if (k < -r || k > r) continue;
    float wk = exp(-float(k * k) / (2.0 * uSigma * uSigma));
    ivec2 q = p + ivec2(uDir) * k;
  #if defined(D_LUMA_H)
    acc += wk * vec4(luma(src(q).rgb), 0.0, 0.0, 0.0);
  #elif defined(D_BLUR_H)
    acc += wk * src(q);
  #else
    acc += wk * prv(q);
  #endif
    wsum += wk;
  }
  acc /= wsum;
#endif
#ifdef D_LUMA_H
  fragColor = vec4(acc.r, 0.0, 0.0, 1.0);
  return;
#endif
#ifdef D_UNSHARP_V
  // uP[0] = (gain, midWeight 0/1, threshold, 0)
  float L = luma(c);
  float d = L - acc.r;
  if (uP[0].z > 0.0 && !(abs(d) > uP[0].z)) d = 0.0;
  float wt = uP[0].y > 0.5 ? 1.0 - abs(2.0 * L - 1.0) : 1.0;
  vec3 a = clamp01(c + uP[0].x * d * wt);
  fragColor = tail(c, a, s0.a);
  return;
#endif
#ifdef D_BLUR_H
  fragColor = vec4(acc.rgb, 1.0);
  return;
#endif
#ifdef D_BLUR_V
  fragColor = tail(c, clamp01(acc.rgb), s0.a);
  return;
#endif
#ifdef D_NR_LAB
  vec3 lab = rgbToLab(c);
  fragColor = vec4(lab.x / 100.0, lab.y / 256.0 + 0.5, lab.z / 256.0 + 0.5, 1.0);
  return;
#endif
#ifdef D_NR_BIL
  // uSource = Lab texture (L/100, a/256+0.5, b/256+0.5). uP[0] = (sigmaS, sigmaR, chromaSigma, doLuma)
  float Lc = s0.r;
  float lOut = Lc;
  if (uP[0].w > 0.5) {
    float inv2r = 1.0 / (2.0 * uP[0].y * uP[0].y);
    float inv2s = 1.0 / (2.0 * uP[0].x * uP[0].x);
    float lacc = 0.0, lw = 0.0;
    for (int dy = -BILATERAL_RADIUS; dy <= BILATERAL_RADIUS; dy++) {
      for (int dx = -BILATERAL_RADIUS; dx <= BILATERAL_RADIUS; dx++) {
        float q = src(p + ivec2(dx, dy)).r;
        float wt = exp(-float(dx * dx + dy * dy) * inv2s) * exp(-(q - Lc) * (q - Lc) * inv2r);
        lacc += wt * q;
        lw += wt;
      }
    }
    lOut = lacc / lw;
  }
  vec2 ab = (s0.gb - 0.5) * 256.0;
  if (uP[0].z >= 1e-3) {
    int rr = min(int(ceil(3.0 * uP[0].z)), MAX_TAPS);
    float wsum = 0.0;
    vec2 cacc = vec2(0.0);
    for (int k = -MAX_TAPS; k <= MAX_TAPS; k++) {
      if (k < -rr || k > rr) continue;
      float wk = exp(-float(k * k) / (2.0 * uP[0].z * uP[0].z));
      cacc += wk * (src(p + ivec2(k, 0)).gb - 0.5) * 256.0;
      wsum += wk;
    }
    ab = cacc / wsum;
  }
  fragColor = vec4(lOut, ab / 256.0 + 0.5, 1.0);
  return;
#endif
#ifdef D_NR_FIN
  // uSource = original, uPrev = D_NR_BIL result; uP[0].z = chroma sigma
  vec4 m = prv(p);
  vec2 ab2 = (m.gb - 0.5) * 256.0;
  if (uP[0].z >= 1e-3) {
    int rr = min(int(ceil(3.0 * uP[0].z)), MAX_TAPS);
    float wsum = 0.0;
    vec2 cacc = vec2(0.0);
    for (int k = -MAX_TAPS; k <= MAX_TAPS; k++) {
      if (k < -rr || k > rr) continue;
      float wk = exp(-float(k * k) / (2.0 * uP[0].z * uP[0].z));
      cacc += wk * (prv(p + ivec2(0, k)).gb - 0.5) * 256.0;
      wsum += wk;
    }
    ab2 = cacc / wsum;
  }
  fragColor = tail(c, labToRgb(vec3(m.r * 100.0, ab2)), s0.a);
  return;
#endif
#ifdef D_DARK_H
  float mn = 1.0;
  for (int k = -DEHAZE_WINDOW_RADIUS; k <= DEHAZE_WINDOW_RADIUS; k++) {
    ivec2 q = p + ivec2(k, 0);
    if (q.x < 0 || q.x >= int(uSize.x)) continue;
    vec3 t = src(q).rgb;
    mn = min(mn, min(t.r, min(t.g, t.b)));
  }
  fragColor = vec4(mn, 0.0, 0.0, 1.0);
  return;
#endif
#ifdef D_DARK_V
  float mv2 = 1.0;
  for (int k = -DEHAZE_WINDOW_RADIUS; k <= DEHAZE_WINDOW_RADIUS; k++) {
    ivec2 q = p + ivec2(0, k);
    if (q.y < 0 || q.y >= int(uSize.y)) continue;
    mv2 = min(mv2, src(q).r);
  }
  fragColor = vec4(mv2, 0.0, 0.0, 1.0);
  return;
#endif
#ifdef D_DARK_SAMPLE
  // uSize is the SAMPLE grid; uP[0].xy = the dark texture size. One sample per grid cell centre.
  vec2 uv = (vec2(p) + 0.5) / uSize;
  float dk = texelFetch(uSource, clamp(ivec2(uv * uP[0].xy), ivec2(0), ivec2(uP[0].xy) - 1), 0).r;
  fragColor = vec4(dk, 0.0, 0.0, 1.0);
  return;
#endif
#ifdef D_DEHAZE
  // uSource = original, uPrev = dark channel; uA = atmospheric light; uP[0].x = amount (-1..1)
  float dark = prv(p).r;
  float amt = uP[0].x;
  vec3 a2;
  if (amt > 0.0) {
    float t = max(1.0 - DEHAZE_OMEGA * (dark / uA), DEHAZE_MIN_T);
    a2 = c + (clamp01((c - uA) / t + uA) - c) * amt;
  } else if (amt < 0.0) {
    float k = -amt * DEHAZE_HAZE_GAIN;
    a2 = clamp01(c * (1.0 - k) + uA * k);
  } else {
    a2 = c;
  }
  fragColor = tail(c, a2, s0.a);
  return;
#endif
#ifdef D_VIGNETTE
  // uP[0] = (amount, midpoint, roundness, feather), uP[1].x = highlights (all /100)
  vec2 n = (vec2(p) + 0.5) / uSize * 2.0 - 1.0;
  float rect = max(abs(n.x), abs(n.y));
  float circ = length(n * uSize * 0.5) / length(uSize * 0.5);
  float rd = (uP[0].z * 100.0 + 100.0) / 200.0;
  float dist = rect * (1.0 - rd) + circ * rd;
  float v = sstep(uP[0].y, uP[0].y + uP[0].w, dist);
  float amount = uP[0].x;
  float prot = amount < 0.0 ? 1.0 - uP[1].x * luma(c) : 1.0;
  vec3 a3 = clamp01(c * (1.0 + amount * v * prot));
  fragColor = tail(c, a3, s0.a);
  return;
#endif
#ifdef D_GRAIN
  // uP[0] = (amount/100, size, roughness/100, 0); uU = (seed, 0, 0, 0)
  uint sz = uint(max(1.0, floor(uP[0].y)));
  uint ux = uint(p.x), uy = uint(p.y);
  float n1 = float(grainHash(ux / sz, uy / sz, uU.x)) / 4294967296.0;
  float q = uP[0].z * GRAIN_ROUGHNESS_MIX;
  float nn = n1;
  if (q > 0.0) {
    float n2 = float(grainHash(ux, uy, uU.x ^ GRAIN_SALT)) / 4294967296.0;
    nn = n1 * (1.0 - q) + n2 * q;
  }
  vec3 a4 = clamp01(c + uP[0].x * GRAIN_GAIN * (nn - 0.5));
  fragColor = tail(c, a4, s0.a);
  return;
#endif
  fragColor = s0;
}`;
