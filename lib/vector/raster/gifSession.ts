/**
 * The GIF encoding session behind a message protocol, so the same code runs
 * in the Worker (`gif.worker.ts`) and in-process (tests, and browsers without
 * module workers). Pure: no DOM.
 *
 * Protocol (main → session):
 *   sample  {rgba}                                   palette statistics (a few frames)
 *   start   {width,height,transparent,loop,dither}   build the global palette, write the header
 *   frame   {rgba, delayCs}                          index + LZW one frame
 *   finish                                           trailer; reply carries the file parts
 * Replies: {type:'ok', frames, bytes} after start/frame, {type:'done', parts, frames, bytes}
 * after finish, {type:'error', message} on failure.
 */
import { createGifWriter, createPaletteBuilder, indexFrame, type GifWriter } from './gifEncoder';

export type GifRequest =
  | { type: 'sample'; rgba: Uint8ClampedArray }
  | { type: 'start'; width: number; height: number; transparent: boolean; loop: number | null; dither: boolean }
  | { type: 'frame'; rgba: Uint8ClampedArray; delayCs: number }
  | { type: 'finish' };

export type GifReply =
  | { type: 'ok'; frames: number; bytes: number }
  | { type: 'done'; parts: Uint8Array[]; frames: number; bytes: number }
  | { type: 'error'; message: string };

export function createGifSession(): (req: GifRequest) => GifReply | null {
  const builder = createPaletteBuilder();
  let writer: GifWriter | null = null;
  let cfg: { width: number; height: number; dither: boolean } | null = null;
  let palette: ReturnType<typeof builder.build> | null = null;
  return (req) => {
    try {
      switch (req.type) {
        case 'sample':
          builder.addSample(req.rgba);
          return null;
        case 'start':
          palette = builder.build({ transparent: req.transparent });
          cfg = { width: req.width, height: req.height, dither: req.dither };
          writer = createGifWriter({ width: req.width, height: req.height, palette, loop: req.loop });
          return { type: 'ok', frames: 0, bytes: writer.byteLength };
        case 'frame': {
          if (!writer || !cfg || !palette) throw new Error('GIF session not started');
          writer.writeFrame(indexFrame(req.rgba, cfg.width, cfg.height, palette, { dither: cfg.dither }), { delayCs: req.delayCs });
          return { type: 'ok', frames: writer.frames, bytes: writer.byteLength };
        }
        case 'finish': {
          if (!writer) throw new Error('GIF session not started');
          const parts = writer.finish();
          return { type: 'done', parts, frames: writer.frames, bytes: writer.byteLength };
        }
      }
    } catch (e) {
      return { type: 'error', message: e instanceof Error ? e.message : String(e) };
    }
  };
}
