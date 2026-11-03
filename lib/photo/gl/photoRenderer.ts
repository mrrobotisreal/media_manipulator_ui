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
import { parseLutCached } from '@/lib/photo/colorMath';
import type { PhotoDoc } from '@/lib/photo/photoTypes';
import { FRAG_SRC, VERT_SRC } from './shaders/adjustSource';
import { fitTextureSize, packCurveTexture, packLayerUniforms, planGpuLayers, UNIFORM_SLOTS } from './uniforms';

export type PhotoSource = ImageBitmap | HTMLImageElement | HTMLCanvasElement | OffscreenCanvas;

interface Target {
  tex: WebGLTexture;
  fb: WebGLFramebuffer;
}

interface Prog {
  program: WebGLProgram;
  loc: Record<string, WebGLUniformLocation | null>;
}

const UNIFORMS = ['uSource', 'uCurves', 'uLut', 'uP', 'uN', 'uLutSize', 'uOpacity', 'uBlend', 'uFlipY'] as const;

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

  constructor(readonly canvas: HTMLCanvasElement | OffscreenCanvas) {
    const gl = canvas.getContext('webgl2', { alpha: true, antialias: false, premultipliedAlpha: false, preserveDrawingBuffer: true }) as WebGL2RenderingContext | null;
    if (!gl) throw new Error('WebGL2 unavailable');
    this.gl = gl;
    this.float = !!gl.getExtension('EXT_color_buffer_float');
    gl.getExtension('OES_texture_float_linear');
    this.vao = gl.createVertexArray() as WebGLVertexArrayObject;
    this.curveTex = this.makeTexture(256, 1, gl.RGBA16F, gl.RGBA, gl.FLOAT, null, gl.LINEAR);
    this.lutTex = gl.createTexture() as WebGLTexture;
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
    this.width = fit.width;
    this.height = fit.height;
    this.canvas.width = fit.width;
    this.canvas.height = fit.height;
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
    if (this.targets) this.targets.forEach((t) => (gl.deleteTexture(t.tex), gl.deleteFramebuffer(t.fb)));
    this.targets = [this.makeTarget(fit.width, fit.height), this.makeTarget(fit.width, fit.height)];
  }

  private program(define: string): Prog {
    const hit = this.programs.get(define);
    if (hit) return hit;
    const gl = this.gl;
    const compile = (type: number, src: string) => {
      const s = gl.createShader(type) as WebGLShader;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(`photo shader ${define}: ${gl.getShaderInfoLog(s)}`);
      return s;
    };
    const frag = FRAG_SRC.replace('#version 300 es\n', `#version 300 es\n#define ${define}\n`);
    const program = gl.createProgram() as WebGLProgram;
    gl.attachShader(program, compile(gl.VERTEX_SHADER, VERT_SRC));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, frag));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(`photo program ${define}: ${gl.getProgramInfoLog(program)}`);
    const loc: Prog['loc'] = {};
    for (const u of UNIFORMS) loc[u] = gl.getUniformLocation(program, u);
    const p = { program, loc };
    this.programs.set(define, p);
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

  private pass(prog: Prog, input: WebGLTexture, out: Target | null, setup: () => void): void {
    const gl = this.gl;
    gl.bindFramebuffer(gl.FRAMEBUFFER, out ? out.fb : null);
    gl.viewport(0, 0, this.width, this.height);
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
    gl.uniform1f(prog.loc.uFlipY, out ? 0 : 1);
    setup();
    gl.bindVertexArray(this.vao);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  /** Render the document's layer stack to the canvas. Geometry/masks arrive with MM98. */
  render(doc: Pick<PhotoDoc, 'layers'>): void {
    const gl = this.gl;
    if (!this.sourceTex || !this.targets || this.contextLost) return;
    const layers = planGpuLayers(doc.layers);
    let input = this.sourceTex;
    let which = 0;
    gl.disable(gl.BLEND);
    for (const layer of layers) {
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
      });
      this.lastOut = out;
      input = out.tex;
      which = 1 - which;
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
