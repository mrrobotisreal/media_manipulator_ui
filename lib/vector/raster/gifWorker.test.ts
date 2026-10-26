// @vitest-environment node
/**
 * The checked-in GIF worker bundle is exactly what `scripts/gen-gif-worker.mjs`
 * builds from `gif.worker.ts` (an encoder change without
 * `node scripts/gen-gif-worker.mjs` fails here), and the bundle really runs
 * the protocol: it is evaluated against a fake worker scope and must answer
 * like the in-process session. (Node environment: esbuild refuses jsdom.)
 */
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

import { OUT_FILE, render } from '../../../scripts/gen-gif-worker.mjs';

import { GIF_WORKER_SOURCE } from './gifWorker.generated';
import type { GifReply, GifRequest } from './gifSession';

describe('gifWorker.generated.ts', () => {
  it('is what the generator produces (run node scripts/gen-gif-worker.mjs)', async () => {
    expect(await render()).toBe(readFileSync(OUT_FILE, 'utf8'));
  });

  it('is a self-contained classic script (no import/export) that encodes a GIF', () => {
    expect(GIF_WORKER_SOURCE).not.toMatch(/(^|[;\s])(import|export)\s/);
    const replies: GifReply[] = [];
    const scope: { onmessage: ((e: { data: GifRequest }) => void) | null; postMessage: (m: GifReply) => void } = { onmessage: null, postMessage: (m) => replies.push(m) };
    new Function('self', GIF_WORKER_SOURCE)(scope);
    const rgba = new Uint8ClampedArray(4 * 4 * 4).fill(200);
    scope.onmessage!({ data: { type: 'sample', rgba } });
    scope.onmessage!({ data: { type: 'start', width: 4, height: 4, transparent: false, loop: 0, dither: false } });
    scope.onmessage!({ data: { type: 'frame', rgba, delayCs: 4 } });
    scope.onmessage!({ data: { type: 'finish' } });
    const done = replies.at(-1)!;
    expect(done.type).toBe('done');
    if (done.type !== 'done') return;
    expect(String.fromCharCode(...done.parts[0].subarray(0, 6))).toBe('GIF89a');
    expect(done.frames).toBe(1);
  });
});
