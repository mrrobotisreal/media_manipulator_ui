/**
 * PhotoRenderer: the WebGL2 preview (design §3, §7). Uploads the source once
 * as a float working texture (RGBA16F/32F when `EXT_color_buffer_float` exists;
 * otherwise RGBA8 with `float === false`, which widens the parity tolerance,
 * design §3.3), runs one pass per enabled rung-1 layer through the per-type
 * programs of `shaders/adjustSource.ts` with ping-pong framebuffers, and
 * blits the last pass to the canvas on demand. Pure packing lives in
 * `uniforms.ts` (unit tested); this class needs a GPU and is exercised by the
 * workstation-only Playwright parity spec.
 */
import { featherSigma, parseLutCached, planGeometry } from '@/lib/photo/colorMath';
import type { PhotoDoc } from '@/lib/photo/photoTypes';
import { FRAG_SRC, VERT_SRC } from './shaders/adjustSource';
import { GEO_MASK_FRAG } from './shaders/maskGeoSource';
import { hasGeometry, KeyedCache, packAlphaTexture, packGeometry, packMaskComponent, planPasses, type MaskView } from './maskPlan';
import { fitTextureSize, packCurveTexture, packLayerUniforms, UNIFORM_SLOTS } from './uniforms';

export type PhotoSource = ImageBitmap | HTMLImageElement | HTMLCanvasElement | OffscreenCanvas;

interface Target {
  tex: WebGLTexture;
  fb: WebGLFramebuffer;
}

interface Prog {
  program: WebGLProgram;
  loc: Record<string, WebGLUniformLocation | null>;
}

const UNIFORMS = [
  'uSource', 'uCurves', 'uLut', 'uP', 'uN', 'uLutSize', 'uOpacity', 'uBlend', 'uFlipY', 'uMask', 'uHasMask',
  'uPrev', 'uAlpha', 'uSize', 'uMode', 'uFirst', 'uM0', 'uM1', 'uLab', 'uG0', 'uG1', 'uG2', 'uG3', 'uG4', 'uG5',
  'uFillColor', 'uDir', 'uSigma', 'uInvert',
] as const;

/** What the preview should draw besides the layer stack. */
export interface RenderOptions {
  /** Mask view of the selected layer's mask: overlay (red where 0) or the mask alone. */
  maskView?: MaskView;
  /** Layer whose mask the view shows. */
  viewLayerId?: string | null;
}

/** R8 mask texture + framebuffer. */
interface MaskTarget {
  tex: WebGLTexture;
  fb: WebGLFramebuffer;
}

export class PhotoRenderer {
  readonly gl: WebGL2RenderingContext;
  /** False when the float colour buffer is unavailable (RGBA8 fallback, extra tolerance). */
  readonly float: boolean;
  width = 0;
  height = 0;
  /** Scale of the texture relative to the original source (< 1 above 24 MP). */
  sourceScale = 1;

  private programs = new Map<string, Prog>();
  private sourceTex: WebGLTexture | null = null;
  private targets: [Target, Target] | null = null;
  private curveTex: WebGLTexture;
  private lutTex: WebGLTexture;
  private lutKey = '';
  private lutSize = 0;
  private vao: WebGLVertexArrayObject;
  private lost = false;
  private lastOut: Target | null = null;
  /** The uploaded (possibly down-scaled) source texture size. */
  private texW = 0;
  private texH = 0;
  private geoTarget: Target | null = null;
  private geoSize = '';
  private masks: KeyedCache<MaskTarget>;
  private maskTmp: [MaskTarget, MaskTarget] | null = null;
  private maskTmpSize = '';
  private alphas = new Map<string, { tex: WebGLTexture }>();
  /** Counts mask-texture computes (tests and the cache-hit check read it). */
  get maskComputes(): number {
    return this.masks.computes;
  }

  constructor(readonly canvas: HTMLCanvasElement | OffscreenCanvas) {
    const gl = canvas.getContext('webgl2', { alpha: true, antialias: false, premultipliedAlpha: false, preserveDrawingBuffer: true }) as WebGL2RenderingContext | null;
    if (!gl) throw new Error('WebGL2 unavailable');
    this.gl = gl;
    this.float = !!gl.getExtension('EXT_color_buffer_float');
    gl.getExtension('OES_texture_float_linear');
    this.vao = gl.createVertexArray() as WebGLVertexArrayObject;
    this.curveTex = this.makeTexture(256, 1, gl.RGBA16F, gl.RGBA, gl.FLOAT, null, gl.LINEAR);
    this.lutTex = gl.createTexture() as WebGLTexture;
    this.masks = new KeyedCache<MaskTarget>(12, (m) => this.freeMask(m));
    canvas.addEventListener?.('webglcontextlost', (e) => {
      e.preventDefault();
      this.lost = true;
    });
  }

  get contextLost(): boolean {
    return this.lost || this.gl.isContextLost();
  }

  private makeTexture(w: number, h: number, internal: number, format: number, type: number, data: ArrayBufferView | null, filter: number): WebGLTexture {
    const gl = this.gl;
    const tex = gl.createTexture() as WebGLTexture;
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, internal, w, h, 0, format, type, data);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return tex;
  }

  private makeTarget(w: number, h: number): Target {
    const gl = this.gl;
    const tex = this.float
      ? this.makeTexture(w, h, gl.RGBA16F, gl.RGBA, gl.HALF_FLOAT, null, gl.NEAREST)
      : this.makeTexture(w, h, gl.RGBA8, gl.RGBA, gl.UNSIGNED_BYTE, null, gl.NEAREST);
    const fb = gl.createFramebuffer() as WebGLFramebuffer;
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    return { tex, fb };
  }

  /** Upload the source (once per photo). Sources above 24 MP are drawn down first. */
  setSource(src: PhotoSource, srcWidth: number, srcHeight: number): void {
    const gl = this.gl;
    const fit = fitTextureSize(srcWidth, srcHeight);
    this.sourceScale = fit.scale;
    this.texW = fit.width;
    this.texH = fit.height;
    this.width = fit.width;
    this.height = fit.height;
    this.canvas.width = fit.width;
    this.canvas.height = fit.height;
    this.masks.clear();
    if (this.sourceTex) gl.deleteTexture(this.sourceTex);
    let upload: PhotoSource = src;
    if (fit.scale < 1) {
      const c = typeof OffscreenCanvas !== 'undefined' ? new OffscreenCanvas(fit.width, fit.height) : Object.assign(document.createElement('canvas'), { width: fit.width, height: fit.height });
      (c.getContext('2d') as CanvasRenderingContext2D).drawImage(src as CanvasImageSource, 0, 0, fit.width, fit.height);
      upload = c;
    }
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, gl.NONE);
    const tex = gl.createTexture() as WebGLTexture;
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, gl.RGBA, gl.UNSIGNED_BYTE, upload as TexImageSource);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    this.sourceTex = tex;
    this.resizeTargets(fit.width, fit.height);
  }

  /** (Re)allocate the ping-pong targets for an output size (geometry may change it). */
  private resizeTargets(w: number, h: number): void {
    const gl = this.gl;
    if (this.targets && this.width === w && this.height === h && this.canvas.width === w) return;
    this.targets?.forEach((t) => (gl.deleteTexture(t.tex), gl.deleteFramebuffer(t.fb)));
    this.width = w;
    this.height = h;
    this.canvas.width = w;
    this.canvas.height = h;
    this.targets = [this.makeTarget(w, h), this.makeTarget(w, h)];
  }

  private freeMask(m: MaskTarget): void {
    this.gl.deleteTexture(m.tex);
    this.gl.deleteFramebuffer(m.fb);
  }

  private makeMaskTarget(w: number, h: number): MaskTarget {
    const gl = this.gl;
    const tex = this.makeTexture(w, h, gl.R8, gl.RED, gl.UNSIGNED_BYTE, null, gl.NEAREST);
    const fb = gl.createFramebuffer() as WebGLFramebuffer;
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    return { tex, fb };
  }

  /**
   * Upload (or replace) a brush/subject alpha raster under `id` (the brush PNG
   * data URI or the subject `maskRef`). Packed as an R8 texture; masks are
   * recomputed on the next render.
   */
  setAlpha(id: string, img: { width: number; height: number; rgba: ArrayLike<number> } | { width: number; height: number; alpha: ArrayLike<number> }): void {
    const gl = this.gl;
    const packed = packAlphaTexture(img as never);
    const old = this.alphas.get(id);
    if (old) gl.deleteTexture(old.tex);
    const tex = gl.createTexture() as WebGLTexture;
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.R8, packed.width, packed.height, 0, gl.RED, gl.UNSIGNED_BYTE, packed.data);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 4);
    for (const [k, v] of [[gl.TEXTURE_MIN_FILTER, gl.LINEAR], [gl.TEXTURE_MAG_FILTER, gl.LINEAR], [gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE], [gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE]] as const) gl.texParameteri(gl.TEXTURE_2D, k, v);
    this.alphas.set(id, { tex });
    this.masks.clear();
  }
  hasAlpha(id: string): boolean {
    return this.alphas.has(id);
  }

  private program(define: string, fragSrc: string = FRAG_SRC): Prog {
    const cacheKey = fragSrc === FRAG_SRC ? define : `geo:${define}`;
    const hit = this.programs.get(cacheKey);
    if (hit) return hit;
    const gl = this.gl;
    const compile = (type: number, src: string) => {
      const s = gl.createShader(type) as WebGLShader;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(`photo shader ${define}: ${gl.getShaderInfoLog(s)}`);
      return s;
    };
    const frag = fragSrc.replace('#version 300 es\n', `#version 300 es\n#define ${define}\n`);
    const program = gl.createProgram() as WebGLProgram;
    gl.attachShader(program, compile(gl.VERTEX_SHADER, VERT_SRC));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, frag));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(`photo program ${define}: ${gl.getProgramInfoLog(program)}`);
    const loc: Prog['loc'] = {};
    for (const u of UNIFORMS) loc[u] = gl.getUniformLocation(program, u);
    const p = { program, loc };
    this.programs.set(cacheKey, p);
    return p;
  }

  private setLut(cube: string): number {
    const gl = this.gl;
    if (cube === this.lutKey) return this.lutSize;
    const parsed = parseLutCached(cube);
    this.lutKey = cube;
    this.lutSize = parsed ? parsed.size : 0;
    if (parsed) {
      gl.bindTexture(gl.TEXTURE_3D, this.lutTex);
      gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
      gl.texImage3D(gl.TEXTURE_3D, 0, gl.RGB8, parsed.size, parsed.size, parsed.size, 0, gl.RGB, gl.UNSIGNED_BYTE, parsed.data);
      for (const [k, v] of [[gl.TEXTURE_MIN_FILTER, gl.LINEAR], [gl.TEXTURE_MAG_FILTER, gl.LINEAR], [gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE], [gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE], [gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE]] as const) {
        gl.texParameteri(gl.TEXTURE_3D, k, v);
      }
      gl.pixelStorei(gl.UNPACK_ALIGNMENT, 4);
    }
    return this.lutSize;
  }

  private pass(prog: Prog, input: WebGLTexture, out: { fb: WebGLFramebuffer } | null, setup: () => void, opts: { mask?: WebGLTexture | null; prev?: WebGLTexture | null; alpha?: WebGLTexture | null; w?: number; h?: number } = {}): void {
    const gl = this.gl;
    gl.bindFramebuffer(gl.FRAMEBUFFER, out ? out.fb : null);
    gl.viewport(0, 0, opts.w ?? this.width, opts.h ?? this.height);
    gl.useProgram(prog.program);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, input);
    gl.uniform1i(prog.loc.uSource, 0);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this.curveTex);
    gl.uniform1i(prog.loc.uCurves, 1);
    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_3D, this.lutTex);
    gl.uniform1i(prog.loc.uLut, 2);
    gl.activeTexture(gl.TEXTURE3);
    gl.bindTexture(gl.TEXTURE_2D, opts.mask ?? this.curveTex);
    gl.uniform1i(prog.loc.uMask, 3);
    gl.uniform1i(prog.loc.uHasMask, opts.mask ? 1 : 0);
    gl.activeTexture(gl.TEXTURE4);
    gl.bindTexture(gl.TEXTURE_2D, opts.prev ?? this.curveTex);
    gl.uniform1i(prog.loc.uPrev, 4);
    gl.activeTexture(gl.TEXTURE5);
    gl.bindTexture(gl.TEXTURE_2D, opts.alpha ?? this.curveTex);
    gl.uniform1i(prog.loc.uAlpha, 5);
    gl.uniform1f(prog.loc.uFlipY, out ? 0 : 1);
    setup();
    gl.bindVertexArray(this.vao);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  private v4(prog: Prog, name: 'uM0' | 'uM1' | 'uG0' | 'uG1' | 'uG2' | 'uG3' | 'uG4' | 'uG5', v: ArrayLike<number>): void {
    this.gl.uniform4f(prog.loc[name], v[0], v[1], v[2], v[3]);
  }

  /** The geometry resample into `geoTarget` (output-sized). Returns its texture. */
  private runGeometry(geometry: PhotoDoc['geometry']): { tex: WebGLTexture; w: number; h: number } {
    const gl = this.gl;
    const plan = planGeometry(geometry, this.texW, this.texH);
    const packed = packGeometry(plan);
    const { width: w, height: h } = packed.size;
    const key = `${w}x${h}`;
    if (!this.geoTarget || this.geoSize !== key) {
      if (this.geoTarget) (gl.deleteTexture(this.geoTarget.tex), gl.deleteFramebuffer(this.geoTarget.fb));
      this.geoTarget = this.makeTarget(w, h);
      this.geoSize = key;
    }
    const prog = this.program('T_GEOMETRY', GEO_MASK_FRAG);
    this.pass(prog, this.sourceTex as WebGLTexture, this.geoTarget, () => {
      this.v4(prog, 'uG0', packed.g0);
      this.v4(prog, 'uG1', packed.g1);
      this.v4(prog, 'uG2', packed.g2);
      this.v4(prog, 'uG3', packed.g3);
      this.v4(prog, 'uG4', packed.g4);
      this.v4(prog, 'uG5', packed.g5);
      gl.uniform3f(prog.loc.uFillColor, packed.fillColor[0], packed.fillColor[1], packed.fillColor[2]);
    }, { w, h });
    return { tex: this.geoTarget.tex, w, h };
  }

  /** Fold + feather + finish one mask into a cached R8 texture (mask space = the output size). */
  private computeMask(mask: import('@/lib/photo/photoTypes').Mask, image: WebGLTexture): MaskTarget {
    const gl = this.gl;
    const w = this.width;
    const h = this.height;
    const tk = `${w}x${h}`;
    if (!this.maskTmp || this.maskTmpSize !== tk) {
      if (this.maskTmp) this.maskTmp.forEach((m) => this.freeMask(m));
      this.maskTmp = [this.makeMaskTarget(w, h), this.makeMaskTarget(w, h)];
      this.maskTmpSize = tk;
    }
    const tmp = this.maskTmp;
    let which = 0;
    let prev: WebGLTexture | null = null;
    mask.components.forEach((c) => {
      const packed = packMaskComponent(c);
      const alphaTex = packed.alpha ? this.alphas.get(packed.alpha.kind === 'brush' ? packed.alpha.png : packed.alpha.maskRef)?.tex ?? null : null;
      if (packed.alpha && !alphaTex) return; // pixels not available: the component is skipped (as the CPU reference)
      const prog = this.program(packed.define, GEO_MASK_FRAG);
      const out = tmp[which];
      this.pass(prog, image, out, () => {
        gl.uniform2f(prog.loc.uSize, w, h);
        gl.uniform1i(prog.loc.uMode, packed.mode);
        gl.uniform1i(prog.loc.uFirst, prev === null ? 1 : 0);
        this.v4(prog, 'uM0', packed.m0);
        this.v4(prog, 'uM1', packed.m1);
        if (packed.define === 'T_MCOLORRANGE') gl.uniform3fv(prog.loc.uLab, packed.lab);
      }, { prev, alpha: alphaTex });
      prev = out.tex;
      which = 1 - which;
    });
    if (prev === null) {
      // No drawable component: fold of nothing is 0.
      gl.bindFramebuffer(gl.FRAMEBUFFER, tmp[which].fb);
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      prev = tmp[which].tex;
      which = 1 - which;
    }
    const sigma = featherSigma(mask.feather, w, h);
    const blur = this.program('T_MBLUR', GEO_MASK_FRAG);
    // Horizontal into the idle tmp target (no invert/opacity yet), vertical into the cached result.
    const hOut = tmp[which];
    this.pass(blur, image, hOut, () => {
      gl.uniform2f(blur.loc.uSize, w, h);
      gl.uniform2f(blur.loc.uDir, 1, 0);
      gl.uniform1f(blur.loc.uSigma, sigma);
      gl.uniform1f(blur.loc.uInvert, 0);
      gl.uniform1f(blur.loc.uOpacity, 1);
    }, { prev });
    const result = this.makeMaskTarget(w, h);
    this.pass(blur, image, result, () => {
      gl.uniform2f(blur.loc.uSize, w, h);
      gl.uniform2f(blur.loc.uDir, 0, 1);
      gl.uniform1f(blur.loc.uSigma, sigma);
      gl.uniform1f(blur.loc.uInvert, mask.invert ? 1 : 0);
      gl.uniform1f(blur.loc.uOpacity, mask.opacity);
    }, { prev: hOut.tex });
    return result;
  }

  /**
   * Render the document to the canvas: geometry (when set) → masks (cached by
   * their own hash + geometry + source) → the adjustment passes, each scaled by
   * its layer's mask → optional mask view.
   */
  render(doc: Pick<PhotoDoc, 'layers' | 'geometry' | 'masks'>, options: RenderOptions = {}): void {
    const gl = this.gl;
    if (!this.sourceTex || !this.targets || this.contextLost) return;
    const passes = planPasses(doc);
    gl.disable(gl.BLEND);
    let input: WebGLTexture = this.sourceTex;
    if (doc.geometry && hasGeometry(doc.geometry)) {
      const g = this.runGeometry(doc.geometry);
      this.resizeTargets(g.w, g.h);
      input = g.tex;
    } else {
      this.resizeTargets(this.texW, this.texH);
    }
    const image = input;
    const maskTex = new Map<string, WebGLTexture>();
    let which = 0;
    for (const p of passes) {
      if (p.kind === 'mask') {
        const target = this.masks.get(p.key, () => this.computeMask(p.mask, image));
        maskTex.set(p.key, target.tex);
        continue;
      }
      if (p.kind !== 'adjust') continue;
      const layer = p.layer;
      const packed = packLayerUniforms(layer);
      const prog = this.program(packed.define);
      let lutSize = 0;
      if (layer.type === 'curves') {
        gl.bindTexture(gl.TEXTURE_2D, this.curveTex);
        gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, 256, 1, gl.RGBA, gl.FLOAT, packCurveTexture(layer.params));
      } else if (layer.type === 'lut') {
        lutSize = this.setLut(layer.params.cube);
      }
      const out = this.targets[which];
      this.pass(prog, input, out, () => {
        gl.uniform4fv(prog.loc.uP, packed.slots.subarray(0, UNIFORM_SLOTS * 4));
        gl.uniform1i(prog.loc.uN, packed.n);
        gl.uniform1f(prog.loc.uLutSize, lutSize);
        gl.uniform1f(prog.loc.uOpacity, packed.opacity);
        gl.uniform1i(prog.loc.uBlend, packed.blend);
      }, { mask: p.maskKey ? maskTex.get(p.maskKey) ?? null : null });
      this.lastOut = out;
      input = out.tex;
      which = 1 - which;
    }
    // Mask view of the selected layer.
    if (options.maskView && options.maskView !== 'off' && options.viewLayerId) {
      const layer = doc.layers.find((l) => l.id === options.viewLayerId);
      const hit = layer ? passes.find((p): p is Extract<typeof p, { kind: 'adjust' }> => p.kind === 'adjust' && p.layer === layer) : undefined;
      const tex = hit?.maskKey ? maskTex.get(hit.maskKey) : undefined;
      if (tex) {
        const mv = this.program(options.maskView === 'overlay' ? 'T_MASKOVERLAY' : 'T_MASKALPHA');
        const out = this.targets[which];
        this.pass(mv, input, out, () => {
          gl.uniform1f(mv.loc.uOpacity, 1);
          gl.uniform1i(mv.loc.uBlend, 0);
        }, { mask: tex });
        input = out.tex;
        which = 1 - which;
      }
    }
    // Final blit to the canvas (flip Y: texture row 0 is the image top).
    const copy = this.program('T_COPY');
    this.pass(copy, input, null, () => {
      gl.uniform1f(copy.loc.uOpacity, 1);
      gl.uniform1i(copy.loc.uBlend, 0);
    });
  }

  /** RGBA8 pixels of a rect of the canvas, top-left origin (eyedropper, histogram, parity spec). */
  readPixels(x = 0, y = 0, w = this.width, h = this.height): Uint8Array {
    const gl = this.gl;
    const out = new Uint8Array(w * h * 4);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.readPixels(x, this.height - y - h, w, h, gl.RGBA, gl.UNSIGNED_BYTE, out);
    // GL rows are bottom-up: flip to top-down.
    const row = w * 4;
    const tmp = new Uint8Array(row);
    for (let i = 0; i < h >> 1; i += 1) {
      const a = i * row;
      const b = (h - 1 - i) * row;
      tmp.set(out.subarray(a, a + row));
      out.copyWithin(a, b, b + row);
      out.set(tmp, b);
    }
    return out;
  }

  async toBlob(type = 'image/jpeg', quality = 0.85): Promise<Blob | null> {
    const c = this.canvas;
    if ('toBlob' in c) return new Promise((res) => (c as HTMLCanvasElement).toBlob(res, type, quality));
    return (c as OffscreenCanvas).convertToBlob({ type, quality });
  }

  dispose(): void {
    const gl = this.gl;
    for (const p of this.programs.values()) gl.deleteProgram(p.program);
    this.programs.clear();
    if (this.sourceTex) gl.deleteTexture(this.sourceTex);
    this.targets?.forEach((t) => (gl.deleteTexture(t.tex), gl.deleteFramebuffer(t.fb)));
    if (this.geoTarget) (gl.deleteTexture(this.geoTarget.tex), gl.deleteFramebuffer(this.geoTarget.fb));
    this.masks.clear();
    this.maskTmp?.forEach((m) => this.freeMask(m));
    this.alphas.forEach((a) => gl.deleteTexture(a.tex));
    this.alphas.clear();
    gl.deleteTexture(this.curveTex);
    gl.deleteTexture(this.lutTex);
    this.sourceTex = null;
    this.targets = null;
  }
}

/** True when this browser can create a WebGL2 context. */
export function webgl2Available(): boolean {
  if (typeof document === 'undefined') return false;
  try {
    return !!document.createElement('canvas').getContext('webgl2');
  } catch {
    return false;
  }
}
