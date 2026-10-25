'use client';

import * as React from 'react';

import { stepPlayback } from '@/lib/vector/playback';
import { useVectorStore } from '@/lib/vector/vectorStore';
import { docLoops } from '@/lib/vector/vectorTypes';

/**
 * Drives `time` while `playing` (ticket MM44 decision 6). The preview renders
 * the model at the playhead (`sampleDoc` in the canvas), so play and scrub
 * share ONE render path; this hook is only the clock: requestAnimationFrame,
 * wall-clock elapsed time, quantised to the doc's preview fps
 * (`lib/vector/playback.ts`). Loop / play range come from the store; with
 * loop off play stops on the range end.
 *
 * Injectable clock for tests: `now` and `raf`/`caf`.
 */
export function usePlayback(opts: {
  now?: () => number;
  raf?: (cb: () => void) => number;
  caf?: (id: number) => void;
} = {}) {
  const playing = useVectorStore((s) => s.playing);
  // The clock is fixed for the component's life (tests inject one; the editor uses the browser's).
  const [clock] = React.useState(() => ({
    n: opts.now ?? (() => performance.now()),
    r: opts.raf ?? ((cb: () => void) => requestAnimationFrame(cb)),
    c: opts.caf ?? ((id: number) => cancelAnimationFrame(id)),
  }));

  React.useEffect(() => {
    if (!playing) return;
    const { n, r, c } = clock;
    const store = useVectorStore;
    const s0 = store.getState();
    if (!s0.doc) return;
    // Starting at (or past) the end of the window restarts from its start.
    const end = s0.range?.end ?? s0.doc.duration;
    const start = s0.range?.start ?? 0;
    let origin = s0.time >= end || s0.time < start ? start : s0.time;
    let t0 = n();
    let id = 0;
    let lastRevision = s0.revision;
    const tick = () => {
      const s = store.getState();
      if (!s.playing || !s.doc) return;
      // An edit or a scrub during play restarts the clock from the playhead.
      if (s.revision !== lastRevision) {
        lastRevision = s.revision;
        origin = s.time;
        t0 = n();
      }
      const step = stepPlayback({
        originTime: origin,
        elapsed: n() - t0,
        duration: s.doc.duration,
        fps: s.doc.fps,
        range: s.range,
        loop: docLoops(s.doc),
      });
      if (step.time !== s.time) s.setTime(step.time);
      if (step.stop) {
        s.setPlaying(false);
        return;
      }
      id = r(tick);
    };
    if (origin !== s0.time) s0.setTime(origin);
    id = r(tick);
    return () => c(id);
  }, [playing, clock]);
}
