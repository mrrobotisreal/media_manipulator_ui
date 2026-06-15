'use client';

import React from 'react';

/**
 * Public surface of the focus/fullscreen controller. Consumed by `StudioHost`
 * (to drive the portal/overlay) and by `Editor` (for the toolbar buttons + the
 * responsive layout flag).
 */
export interface FocusModeApi {
  /** In-page focus overlay is active (drives the portal). */
  focused: boolean;
  /** The overlay is currently the real browser-fullscreen element. */
  isBrowserFullscreen: boolean;
  /** The Fullscreen API is usable in this environment (SSR-safe). */
  fullscreenSupported: boolean;
  enterFocus: () => void;
  exitFocus: () => void;
  toggleFocus: () => void;
  enterBrowserFullscreen: () => void;
  exitBrowserFullscreen: () => void;
  /** Attached to the overlay host so the Fullscreen API targets exactly it. */
  containerRef: React.RefObject<HTMLDivElement | null>;
}

// Vendor-prefixed fullscreen members for older Safari (iPad/desktop ≤16).
interface FullscreenDocument extends Document {
  webkitFullscreenEnabled?: boolean;
  webkitFullscreenElement?: Element | null;
  webkitExitFullscreen?: () => Promise<void> | void;
}
interface FullscreenElement extends HTMLElement {
  webkitRequestFullscreen?: () => Promise<void> | void;
}

/**
 * useFocusMode — a small, dependency-free controller for Content Studio's
 * "Focused" mode (an in-page, full-viewport overlay) and an optional true
 * browser fullscreen layered on top of it.
 *
 * The two levels compose: Focused mode is pure CSS/DOM and always works;
 * browser fullscreen is a progressive enhancement that gracefully degrades to
 * Focused mode where the Fullscreen API is unavailable (iframes without
 * `allow="fullscreen"`, iOS Safari, …). Leaving browser fullscreen keeps the
 * user in Focused mode rather than dropping them back onto the marketing page.
 */
export function useFocusMode(): FocusModeApi {
  const [focused, setFocused] = React.useState(false);
  const [isBrowserFullscreen, setIsBrowserFullscreen] = React.useState(false);
  const [fullscreenSupported, setFullscreenSupported] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  // Capability probe runs on mount so the server render (where `document` is
  // absent) always starts from `false` and stays hydration-safe.
  React.useEffect(() => {
    const d = document as FullscreenDocument;
    setFullscreenSupported(!!(d.fullscreenEnabled || d.webkitFullscreenEnabled));
  }, []);

  const enterFocus = React.useCallback(() => setFocused(true), []);
  const exitFocus = React.useCallback(() => setFocused(false), []);
  const toggleFocus = React.useCallback(() => setFocused((f) => !f), []);

  // requestFullscreen on the overlay host, with the webkit fallback. Swallows
  // rejections (e.g. permission denied) so we silently stay in Focused mode.
  const requestFs = React.useCallback(() => {
    const el = containerRef.current as FullscreenElement | null;
    if (!el) return;
    const fn = el.requestFullscreen ?? el.webkitRequestFullscreen;
    if (!fn) return;
    try {
      const r = fn.call(el);
      if (r && typeof (r as Promise<void>).catch === 'function') {
        (r as Promise<void>).catch(() => {});
      }
    } catch {
      /* degrade to Focused mode */
    }
  }, []);

  const enterBrowserFullscreen = React.useCallback(() => {
    // Must run inside the click gesture. If the overlay already exists, request
    // synchronously to preserve the gesture; otherwise show the overlay first
    // and request on the next frame once the host is mounted.
    if (focused && containerRef.current) {
      requestFs();
    } else {
      setFocused(true);
      requestAnimationFrame(() => requestFs());
    }
  }, [focused, requestFs]);

  const exitBrowserFullscreen = React.useCallback(() => {
    const d = document as FullscreenDocument;
    const fn = d.exitFullscreen ?? d.webkitExitFullscreen;
    if (!fn) return;
    try {
      const r = fn.call(d);
      if (r && typeof (r as Promise<void>).catch === 'function') {
        (r as Promise<void>).catch(() => {});
      }
    } catch {
      /* ignore */
    }
  }, []);

  // Mirror the real fullscreen state (the user can leave via OS / ESC). Leaving
  // browser fullscreen intentionally does NOT drop Focused mode.
  React.useEffect(() => {
    const onChange = () => {
      const d = document as FullscreenDocument;
      const el = d.fullscreenElement ?? d.webkitFullscreenElement ?? null;
      setIsBrowserFullscreen(!!el);
    };
    document.addEventListener('fullscreenchange', onChange);
    document.addEventListener('webkitfullscreenchange', onChange);
    return () => {
      document.removeEventListener('fullscreenchange', onChange);
      document.removeEventListener('webkitfullscreenchange', onChange);
    };
  }, []);

  // ESC exits Focused mode — but only when NOT in browser fullscreen (there the
  // browser already consumes ESC to leave fullscreen; the fullscreenchange
  // listener above handles that level, so we must not double-handle). Guards
  // mirror editor.tsx's keyboard-shortcut effect: ignore while typing in a
  // field or while a [role="dialog"] (the export dialog) is open.
  React.useEffect(() => {
    if (!focused) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape' || isBrowserFullscreen) return;
      const el = document.activeElement as HTMLElement | null;
      if (el) {
        const tag = el.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || el.isContentEditable) return;
        if (el.closest('[role="dialog"]')) return;
      }
      // Let an open dialog handle ESC itself (close) before we exit focus.
      if (document.querySelector('[role="dialog"][data-state="open"]')) return;
      e.preventDefault();
      setFocused(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [focused, isBrowserFullscreen]);

  // Scroll-lock the page behind the overlay and tag <body> while focused so the
  // global chrome can be belt-and-suspenders hidden (see globals.css). The
  // previous overflow value is restored on exit/unmount.
  React.useEffect(() => {
    if (!focused) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.body.classList.add('cs-focused');
    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.classList.remove('cs-focused');
    };
  }, [focused]);

  return React.useMemo(
    () => ({
      focused,
      isBrowserFullscreen,
      fullscreenSupported,
      enterFocus,
      exitFocus,
      toggleFocus,
      enterBrowserFullscreen,
      exitBrowserFullscreen,
      containerRef,
    }),
    [
      focused,
      isBrowserFullscreen,
      fullscreenSupported,
      enterFocus,
      exitFocus,
      toggleFocus,
      enterBrowserFullscreen,
      exitBrowserFullscreen,
    ],
  );
}
