'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';
import Editor from './editor';
import { useEmbedBridge, EmbedBridgeProvider, useEmbedBridgeOptional } from './embed-bridge';
import { StudioBackendProvider } from '@/lib/studio/studioBackendProvider';
import { createCreatvBackend } from '@/lib/studio/studioBackend';
import { useStudioStore } from '@/lib/studioStore';

/**
 * ContentStudioEmbedHost — boots the editor in embed/CreaTV mode. It waits for
 * the host's cs:init handshake, builds a CreaTV-pointed StudioBackend from the
 * received config (token forwarded via postMessage, never the URL), and opens
 * the draft's project straight into <Editor/>. Until the handshake completes it
 * shows a guarded loading state.
 */
const ContentStudioEmbedHost: React.FC = () => {
  const bridge = useEmbedBridge();
  const config = bridge.config;

  const backend = React.useMemo(() => {
    if (!config) return null;
    return createCreatvBackend({
      apiBaseUrl: config.apiBaseUrl,
      scope: config.scope,
      getToken: bridge.getToken,
      requestToken: bridge.requestToken,
      capabilities: config.capabilities,
    });
  }, [config, bridge.getToken, bridge.requestToken]);

  const projectId = config?.projectId ?? (config ? String(config.scope.draftId) : null);

  if (!bridge.ready || !backend || !projectId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground">
        <Loader2 className="w-5 h-5 animate-spin mr-2" />
        Loading editor…
      </div>
    );
  }

  return (
    <StudioBackendProvider backend={backend}>
      <EmbedBridgeProvider bridge={bridge}>
        <div className="min-h-screen bg-background p-4">
          <EmbedStateReporter />
          <Editor projectId={projectId} onClose={() => bridge.emit({ type: 'cs:command', action: 'close' })} />
        </div>
      </EmbedBridgeProvider>
    </StudioBackendProvider>
  );
};

/**
 * Mirrors the editor's save state out to the host (cs:state) so Darkroom can
 * show "saving/saved/dirty" chrome outside the iframe if it wants. Cheap — a
 * single store selector.
 */
const EmbedStateReporter: React.FC = () => {
  const bridge = useEmbedBridgeOptional();
  const dirty = useStudioStore((s) => s.dirty);
  const projectId = useStudioStore((s) => s.project?.id ?? null);

  React.useEffect(() => {
    bridge?.emit({
      type: 'cs:state',
      status: !projectId ? 'idle' : dirty ? 'dirty' : 'saved',
      projectId: projectId ?? undefined,
    });
    // bridge.emit is stable; re-emit only on state change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dirty, projectId]);

  return null;
};

export default ContentStudioEmbedHost;
