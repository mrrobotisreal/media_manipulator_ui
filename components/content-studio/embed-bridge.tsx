'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  PROTOCOL_VERSION,
  isEmbedMessage,
  isOriginAllowed,
  parseAllowedOrigins,
  type CsInitMessage,
  type EmbedToHostMessage,
} from '@/lib/studio/embedProtocol';

const DEFAULT_ALLOWED = ['https://creatv.io', 'https://www.creatv.io', 'http://localhost:8080'];
const TOKEN_REQUEST_TIMEOUT_MS = 10_000;

export interface EmbedBridge {
  /** True once the host's cs:init handshake has been received. */
  ready: boolean;
  /** The init config (apiBaseUrl, scope, projectId, theme, capabilities). */
  config: CsInitMessage | null;
  /** Current Supabase access token (live ref accessor). */
  getToken: () => string | null;
  /** Ask the host for a fresh token; resolves with it (or null on timeout). */
  requestToken: () => Promise<string | null>;
  /** Send a typed message to the host (explicit targetOrigin). */
  emit: (msg: EmbedToHostMessage) => void;
}

/**
 * useEmbedBridge — the embed (MM) side of the postMessage handshake. Posts
 * cs:ready on mount (handshake is embed-initiated so it can't miss an init sent
 * before the iframe loaded), validates every inbound message's origin against
 * the allowlist, tracks the live token, and exposes emitters for the editor's
 * export/state/publish events.
 */
export function useEmbedBridge(): EmbedBridge {
  const allowlist = useMemo(
    () => parseAllowedOrigins(process.env.NEXT_PUBLIC_EMBED_ALLOWED_ORIGINS, DEFAULT_ALLOWED),
    [],
  );

  const [config, setConfig] = useState<CsInitMessage | null>(null);
  const [ready, setReady] = useState(false);

  const tokenRef = useRef<string | null>(null);
  const hostOriginRef = useRef<string | null>(null);
  const tokenWaitersRef = useRef<Array<(t: string | null) => void>>([]);

  const resolveTokenWaiters = useCallback((token: string | null) => {
    const waiters = tokenWaitersRef.current;
    tokenWaitersRef.current = [];
    waiters.forEach((w) => w(token));
  }, []);

  const emit = useCallback(
    (msg: EmbedToHostMessage) => {
      if (typeof window === 'undefined' || !window.parent) return;
      const target = hostOriginRef.current ?? allowlist[0];
      try {
        window.parent.postMessage(msg, target);
      } catch {
        /* host gone / cross-origin race — ignore */
      }
    },
    [allowlist],
  );

  const getToken = useCallback(() => tokenRef.current, []);

  const requestToken = useCallback((): Promise<string | null> => {
    emit({ type: 'cs:request-token' });
    return new Promise((resolve) => {
      const timer = setTimeout(() => {
        tokenWaitersRef.current = tokenWaitersRef.current.filter((w) => w !== onToken);
        resolve(null);
      }, TOKEN_REQUEST_TIMEOUT_MS);
      const onToken = (t: string | null) => {
        clearTimeout(timer);
        resolve(t);
      };
      tokenWaitersRef.current.push(onToken);
    });
  }, [emit]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isDev = process.env.NODE_ENV !== 'production';
    let initReceived = false;

    const onMessage = (event: MessageEvent) => {
      if (!isOriginAllowed(event.origin, allowlist)) {
        // Most common local-dev pitfall: a port/origin mismatch between the
        // CreaTV host and NEXT_PUBLIC_EMBED_ALLOWED_ORIGINS. Surface it in dev.
        if (isDev && isEmbedMessage(event.data)) {
          console.debug(
            `[content-studio embed] ignored ${(event.data as { type?: string }).type} from untrusted origin "${event.origin}". Allowed: ${allowlist.join(', ')}`,
          );
        }
        return;
      }
      const data = event.data;
      if (!isEmbedMessage(data)) return;

      switch (data.type) {
        case 'cs:init': {
          initReceived = true;
          hostOriginRef.current = event.origin.replace(/\/$/, '');
          tokenRef.current = data.token;
          if (data.theme) {
            const root = document.documentElement;
            root.classList.remove('dark', 'light');
            root.classList.add(data.theme);
          }
          setConfig(data);
          setReady(true);
          resolveTokenWaiters(data.token);
          break;
        }
        case 'cs:token': {
          tokenRef.current = data.token;
          resolveTokenWaiters(data.token);
          break;
        }
        // cs:command (host-driven save/export) is accepted but optional; the
        // editor doesn't currently expose external command hooks.
        default:
          break;
      }
    };

    window.addEventListener('message', onMessage);

    // Announce readiness so the host sends cs:init. We don't yet know the host
    // origin, so target the referrer (if allowed) or every allowed origin.
    // postMessage requires a valid scheme://host targetOrigin, so scheme-less
    // allowlist entries are expanded to both https/http (cs:ready carries no
    // secret; only the real parent acts on it).
    const referrerOrigin = (() => {
      try {
        return document.referrer ? new URL(document.referrer).origin.replace(/\/$/, '') : null;
      } catch {
        return null;
      }
    })();
    const targets = (() => {
      const out = new Set<string>();
      if (referrerOrigin && isOriginAllowed(referrerOrigin, allowlist)) out.add(referrerOrigin);
      for (const raw of allowlist) {
        const entry = raw.replace(/\/$/, '');
        if (!entry) continue;
        if (entry.includes('://')) {
          out.add(entry);
        } else {
          out.add(`https://${entry}`);
          out.add(`http://${entry}`);
        }
      }
      return Array.from(out);
    })();
    const announceReady = () => {
      targets.forEach((target) => {
        try {
          window.parent?.postMessage({ type: 'cs:ready', version: PROTOCOL_VERSION }, target);
        } catch {
          /* ignore */
        }
      });
    };

    // Retry the handshake: if the host's listener wasn't attached when we first
    // announced (or our first message raced the iframe load), keep re-announcing
    // until cs:init arrives. Without this the embed can hang on "Loading editor…".
    announceReady();
    let attempts = 0;
    const retry = window.setInterval(() => {
      attempts += 1;
      if (initReceived || attempts > 40) {
        window.clearInterval(retry);
        if (!initReceived && isDev) {
          console.warn(
            `[content-studio embed] no cs:init after ${attempts} attempts. Is the CreaTV host posting cs:init, and is its origin in NEXT_PUBLIC_EMBED_ALLOWED_ORIGINS (${allowlist.join(', ')})?`,
          );
        }
        return;
      }
      announceReady();
    }, 500);

    return () => {
      window.clearInterval(retry);
      window.removeEventListener('message', onMessage);
    };
  }, [allowlist, resolveTokenWaiters]);

  return { ready, config, getToken, requestToken, emit };
}

// --- Context so deep children (export dialog) can emit ---------------------
const EmbedBridgeContext = createContext<EmbedBridge | null>(null);

export function EmbedBridgeProvider({ bridge, children }: { bridge: EmbedBridge; children: React.ReactNode }) {
  return <EmbedBridgeContext.Provider value={bridge}>{children}</EmbedBridgeContext.Provider>;
}

/** Returns the embed bridge, or null when not running embedded (MM standalone). */
export function useEmbedBridgeOptional(): EmbedBridge | null {
  return useContext(EmbedBridgeContext);
}
