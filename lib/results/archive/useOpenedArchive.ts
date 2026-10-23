'use client';

import { useEffect, useState } from 'react';
import type { OpenedArchive } from './types';

export type OpenedArchiveState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'ready'; archive: OpenedArchive }
  | { status: 'error'; code: 'too-large' | 'not-archive' | 'corrupt' };

/**
 * Opens an archive blob. The archive module (and so `fflate`) is imported dynamically here,
 * on the first archive a visitor actually opens; nothing else statically reaches it.
 */
export function useOpenedArchive(blob: Blob | null, nameHint: string): OpenedArchiveState {
  const [state, setState] = useState<{ blob: Blob | null; value: OpenedArchiveState }>({ blob: null, value: { status: 'idle' } });
  useEffect(() => {
    if (!blob) return;
    let cancelled = false;
    void (async () => {
      try {
        const { openArchive } = await import('./index');
        const archive = await openArchive(blob, nameHint);
        if (!cancelled) setState({ blob, value: { status: 'ready', archive } });
      } catch (error) {
        const code = (error as { code?: string })?.code;
        if (!cancelled) {
          setState({ blob, value: { status: 'error', code: code === 'too-large' || code === 'not-archive' ? code : 'corrupt' } });
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [blob, nameHint]);
  if (!blob) return { status: 'idle' };
  return state.blob === blob ? state.value : { status: 'loading' };
}
