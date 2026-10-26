/**
 * Module worker for GIF encoding (ticket MM47 decision 2: "encoder runs in a
 * Worker"). Quantisation, indexing and LZW all happen here; the main thread
 * only rasterises and posts RGBA frames (transferred, not copied).
 */
import { createGifSession, type GifRequest } from './gifSession';

const handle = createGifSession();
const scope = self as unknown as { onmessage: ((e: MessageEvent<GifRequest>) => void) | null; postMessage(msg: unknown, transfer?: Transferable[]): void };

scope.onmessage = (e) => {
  const reply = handle(e.data);
  if (!reply) return;
  if (reply.type === 'done') scope.postMessage(reply, reply.parts.map((p) => p.buffer as ArrayBuffer));
  else scope.postMessage(reply);
};
