/**
 * GLSL for the MM98 passes (design §5.2, §5.3): the geometry resample and the
 * mask passes (component fold, separable feather, finish). They MIRROR
 * `lib/photo/colorMath.ts` (`applyGeometryCPU`, `renderMaskCPU`) stage for
 * stage; the Playwright parity spec compares them to the goldens on the
 * workstation. Pass ordering is geometry → mask(s) → adjust (see
 * `photoRenderer.ts`). Image space: `vUV` (0,0) is the TOP-left of the output.
 */
export const GEO_MASK_FRAG = `#version 300 es
precision highp float;
in vec2 vUV;
out vec4 fragColor;

uniform sampler2D uSource;  // geometry pass: the source; mask passes: the geometry-corrected image
uniform sampler2D uPrev;    // mask passes: the fold so far / the blur input
uniform sampler2D uAlpha;   // brush or subject alpha raster (R8, LINEAR)
uniform vec2 uSize;         // mask-space size in pixels
uniform int uMode;          // 0 add, 1 subtract, 2 intersect
uniform int uFirst;         // 1: the fold starts at 0
uniform vec4 uM0;
uniform vec4 uM1;
uniform vec3 uLab[16];
uniform vec4 uG0; // w0, h0, wr, hr
uniform vec4 uG1; // ox, oy, wo, ho
uniform vec4 uG2; // cos, sin, flipH, flipV
uniform vec4 uG3; // a, b, c, d
uniform vec4 uG4; // e, f, g, h
uniform vec4 uG5; // hasPersp, fillMode (0 transparent, 1 edge, 2 colour), 0, 0
uniform vec3 uFillColor;
uniform vec2 uDir;      // blur direction in texels
uniform float uSigma;   // blur sigma in texels (< 1e-3 = none)
uniform float uInvert;
uniform float uOpacity;

const vec3 LUMA = vec3(0.2126, 0.7152, 0.0722);
float sstep(float e0, float e1, float x) {
  if (e1 == e0) return x < e0 ? 0.0 : 1.0;
  float t = clamp((x - e0) / (e1 - e0), 0.0, 1.0);
  return t * t * (3.0 - 2.0 * t);
}
float fold(float prev, float v) {
  if (uMode == 0) return max(prev, v);
  if (uMode == 1) return min(prev, 1.0 - v);
  return min(prev, v);
}
vec3 srgbToLinear(vec3 v) {
  return mix(pow((v + 0.055) / 1.055, vec3(2.4)), v / 12.92, lessThanEqual(v, vec3(0.04045)));
}
vec3 rgbToLab(vec3 c) {
  vec3 l = srgbToLinear(c);
  float x = (0.4124564 * l.r + 0.3575761 * l.g + 0.1804375 * l.b) / 0.95047;
  float y = 0.2126729 * l.r + 0.7151522 * l.g + 0.072175 * l.b;
  float z = (0.0193339 * l.r + 0.119192 * l.g + 0.9503041 * l.b) / 1.08883;
  vec3 t = vec3(x, y, z);
  vec3 f = mix((24389.0 / 27.0 * t + 16.0) / 116.0, pow(max(t, vec3(0.0)), vec3(1.0 / 3.0)), greaterThan(t, vec3(216.0 / 24389.0)));
  return vec3(116.0 * f.y - 16.0, 500.0 * (f.x - f.y), 200.0 * (f.y - f.z));
}

void main() {
#ifdef T_GEOMETRY
  vec2 q = vec2(uG1.x + vUV.x * uG1.z, uG1.y + vUV.y * uG1.w);
  if (uG5.x > 0.5) {
    vec2 uv = q / uG0.zw;
    float den = uG4.z * uv.x + uG4.w * uv.y + 1.0;
    q = vec2((uG3.x * uv.x + uG3.y * uv.y + uG3.z) / den, (uG3.w * uv.x + uG4.x * uv.y + uG4.y) / den) * uG0.zw;
  }
  if (uG2.z > 0.5) q.x = uG0.z - q.x;
  if (uG2.w > 0.5) q.y = uG0.w - q.y;
  vec2 d = q - uG0.zw * 0.5;
  vec2 s = uG0.xy * 0.5 + vec2(d.x * uG2.x + d.y * uG2.y, -d.x * uG2.y + d.y * uG2.x);
  bool inside = s.x >= 0.0 && s.x <= uG0.x && s.y >= 0.0 && s.y <= uG0.y;
  if (!inside && uG5.y < 0.5) { fragColor = vec4(0.0); return; }
  if (!inside && uG5.y > 1.5) { fragColor = vec4(uFillColor, 1.0); return; }
  vec2 p = s - 0.5;
  vec2 p0 = floor(p);
  vec2 t = p - p0;
  ivec2 hi = ivec2(uG0.xy) - 1;
  ivec2 a = clamp(ivec2(p0), ivec2(0), hi);
  ivec2 b = clamp(ivec2(p0) + 1, ivec2(0), hi);
  vec4 top = mix(texelFetch(uSource, ivec2(a.x, a.y), 0), texelFetch(uSource, ivec2(b.x, a.y), 0), t.x);
  vec4 bot = mix(texelFetch(uSource, ivec2(a.x, b.y), 0), texelFetch(uSource, ivec2(b.x, b.y), 0), t.x);
  fragColor = mix(top, bot, t.y);
#endif
#ifdef T_MGRADIENT
  vec2 px = vUV * uSize;
  vec2 f = uM0.xy * uSize;
  vec2 dd = uM0.zw * uSize - f;
  float len2 = dot(dd, dd);
  float v = len2 < 1e-12 ? 0.0 : sstep(-uM1.x, 1.0 + uM1.x, dot(px - f, dd) / len2);
  fragColor = vec4(fold(uFirst == 1 ? 0.0 : texture(uPrev, vUV).r, v), 0.0, 0.0, 1.0);
#endif
#ifdef T_MRADIAL
  vec2 px = vUV * uSize;
  vec2 dd = px - uM0.xy * uSize;
  float u = dd.x * uM1.x + dd.y * uM1.y;
  float w = -dd.x * uM1.y + dd.y * uM1.x;
  vec2 r = max(uM0.zw * uSize, vec2(1e-6));
  float dist = sqrt((u / r.x) * (u / r.x) + (w / r.y) * (w / r.y));
  float v = 1.0 - sstep(1.0 - uM1.z, 1.0, dist);
  fragColor = vec4(fold(uFirst == 1 ? 0.0 : texture(uPrev, vUV).r, v), 0.0, 0.0, 1.0);
#endif
#ifdef T_MLUMINOSITY
  float L = dot(texture(uSource, vUV).rgb, LUMA);
  float v = sstep(uM0.x - uM0.z, uM0.x, L) * (1.0 - sstep(uM0.y, uM0.y + uM0.z, L));
  fragColor = vec4(fold(uFirst == 1 ? 0.0 : texture(uPrev, vUV).r, v), 0.0, 0.0, 1.0);
#endif
#ifdef T_MCOLORRANGE
  vec3 lab = rgbToLab(texture(uSource, vUV).rgb);
  float R = uM0.x;
  float v = 0.0;
  for (int i = 0; i < 16; i++) {
    if (float(i) >= uM0.y) break;
    v = max(v, 1.0 - sstep(0.5 * R, R, length(lab - uLab[i])));
  }
  fragColor = vec4(fold(uFirst == 1 ? 0.0 : texture(uPrev, vUV).r, v), 0.0, 0.0, 1.0);
#endif
#ifdef T_MALPHA
  float v = texture(uAlpha, vUV).r;
  if (uM0.x > 0.5) v = 1.0 - v;
  fragColor = vec4(fold(uFirst == 1 ? 0.0 : texture(uPrev, vUV).r, v), 0.0, 0.0, 1.0);
#endif
#ifdef T_MBLUR
  float m;
  if (uSigma < 1e-3) {
    m = texture(uPrev, vUV).r;
  } else {
    int rad = int(ceil(3.0 * uSigma));
    ivec2 sz = ivec2(uSize);
    ivec2 c0 = ivec2(vUV * uSize);
    ivec2 stp = ivec2(uDir);
    float acc = 0.0;
    float wsum = 0.0;
    for (int k = -rad; k <= rad; k++) {
      float wk = exp(-float(k * k) / (2.0 * uSigma * uSigma));
      acc += wk * texelFetch(uPrev, clamp(c0 + stp * k, ivec2(0), sz - 1), 0).r;
      wsum += wk;
    }
    m = acc / wsum;
  }
  m = clamp((uInvert > 0.5 ? 1.0 - m : m) * uOpacity, 0.0, 1.0);
  fragColor = vec4(m, 0.0, 0.0, 1.0);
#endif
}`;
