'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { parseHash, serializeHash, type HashState } from '@/lib/metadata/hash';
import type { PrivacyClass } from '@/lib/metadata/types';

const read = (persist: boolean): HashState =>
  persist && typeof window !== 'undefined' ? parseHash(window.location.hash) : { open: null, filters: [] };

/**
 * Open sections and privacy filters, mirrored to `location.hash`
 * (`#meta=gps,camera&mf=location`) with `history.replaceState`. Reads on mount,
 * follows `hashchange`, and is SSR-safe (no window access during render on the
 * server). `open === null` means "use the defaults". Pass `persist=false` for a
 * second inspector on the same page (diff view) so the two do not fight over
 * the hash.
 */
export function useInspectorState(persist = true) {
  const [state, setState] = useState<HashState>(() => read(persist));
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  });

  useEffect(() => {
    if (!persist) return;
    const onHash = () => {
      const next = parseHash(window.location.hash);
      if (JSON.stringify(next) !== JSON.stringify(stateRef.current)) {
        stateRef.current = next;
        setState(next);
      }
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, [persist]);

  const commit = useCallback(
    (next: HashState) => {
      stateRef.current = next;
      setState(next);
      if (!persist || typeof window === 'undefined') return;
      const hash = serializeHash(next, window.location.hash);
      if (hash === window.location.hash) return;
      const url = `${window.location.pathname}${window.location.search}${hash}`;
      try {
        window.history.replaceState(window.history.state, '', url);
      } catch {
        // Sandboxed frames may forbid history writes; the in-memory state still works.
      }
    },
    [persist],
  );

  const setOpen = useCallback((open: string[] | null) => commit({ ...stateRef.current, open }), [commit]);
  const setFilters = useCallback(
    (filters: PrivacyClass[]) => commit({ ...stateRef.current, filters }),
    [commit],
  );

  return { open: state.open, filters: state.filters, setOpen, setFilters };
}
