'use client';

import { useCallback, useSyncExternalStore } from 'react';

/**
 * Subscribe to a CSS media query from React.
 *
 * Returns `false` during server render, so only use this where a CSS-only
 * breakpoint genuinely cannot express the layout — i.e. when the two
 * breakpoints need *different component trees*, not different styling. Content
 * Studio's editor is the case: below `lg` the three panels become tab panels,
 * above it they are grid cells, and rendering both would mount two preview
 * surfaces (two canvases, two audio graphs).
 *
 * `useSyncExternalStore` keeps the value consistent across concurrent renders
 * and avoids the effect-then-repaint flash of a `useState` + `useEffect` hook.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      if (typeof window === 'undefined' || !window.matchMedia) return () => {};
      const list = window.matchMedia(query);
      list.addEventListener('change', onChange);
      return () => list.removeEventListener('change', onChange);
    },
    [query],
  );

  const getSnapshot = useCallback(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia(query).matches;
  }, [query]);

  // Server snapshot: no viewport to measure, so report the smaller layout.
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}

export default useMediaQuery;
