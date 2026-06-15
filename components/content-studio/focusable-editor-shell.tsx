'use client';

import React from 'react';
import { createPortal } from 'react-dom';

interface FocusableEditorShellProps {
  focused: boolean;
  /** Set to the overlay host so the Fullscreen API can target it. */
  containerRef: React.RefObject<HTMLDivElement | null>;
  children: React.ReactNode;
}

/**
 * FocusableEditorShell relocates the live editor between its normal in-page
 * position and a full-viewport overlay **without ever unmounting it**.
 *
 * The trick is a single, stable host `<div>` held in a ref (an imperatively
 * managed DOM node): we always render the editor into it via `createPortal`,
 * and only *move the host node itself* in the DOM — between an in-page slot
 * (normal document flow) and `document.body` (a fixed, opaque overlay). Because
 * the portal container never changes identity, React never reconciles the
 * editor away, and because moving a DOM node preserves its subtree, the decoder
 * pool, the WebGL context, playback state, autosave timers and Zustand
 * subscriptions all survive the switch untouched (no `closeProject`, no
 * refetch).
 *
 * A naïve conditional portal — `focused ? <Editor/> : createPortal(<Editor/>)`
 * — would change the returned node type (fragment ↔ portal) and remount the
 * editor, destroying that state. The host is created lazily but synchronously
 * during the first render so `createPortal` targets it immediately, never
 * rendering the editor inline-then-portaled (which would also remount it).
 *
 * Portaling the host to `document.body` (rather than toggling classes in place)
 * is also what lets `position: fixed` escape any transformed / filtered
 * ancestor that would otherwise become its containing block, and what lets the
 * opaque overlay paint over the top-nav and footer.
 */
const FocusableEditorShell: React.FC<FocusableEditorShellProps> = ({ focused, containerRef, children }) => {
  const hostRef = React.useRef<HTMLDivElement | null>(null);
  if (hostRef.current === null && typeof document !== 'undefined') {
    hostRef.current = document.createElement('div');
  }
  const slotRef = React.useRef<HTMLDivElement>(null);

  // Expose the host as the fullscreen target for useFocusMode.
  React.useEffect(() => {
    containerRef.current = hostRef.current;
    return () => {
      if (containerRef.current === hostRef.current) containerRef.current = null;
    };
  }, [containerRef]);

  // Position the host: inside the in-page slot (normal flow) when not focused,
  // appended to <body> as a fixed overlay when focused. useLayoutEffect so the
  // move lands before paint (no flash). Moving the node does not remount the
  // portal's React content.
  React.useLayoutEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    if (focused) {
      host.className = 'cs-focus-overlay';
      document.body.appendChild(host);
    } else {
      host.className = 'contents';
      slotRef.current?.appendChild(host);
    }
  }, [focused]);

  // Detach the host from wherever it lives when the shell unmounts (leaving the
  // editor entirely). The editor's own effects still run their cleanup first.
  React.useEffect(() => {
    const host = hostRef.current;
    return () => {
      if (host?.parentNode) host.parentNode.removeChild(host);
    };
  }, []);

  const host = hostRef.current;
  return (
    <>
      {/* Normal-flow anchor for the host while not focused. `display: contents`
          so it adds no box of its own — the editor lays out exactly as before. */}
      <div ref={slotRef} className="contents" />
      {host ? createPortal(children, host) : children}
    </>
  );
};

export default FocusableEditorShell;
