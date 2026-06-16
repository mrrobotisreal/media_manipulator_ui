'use client';

import { createContext, useContext, useMemo, type ReactNode } from 'react';
import {
  createMmBackend,
  getActiveStudioBackend,
  setActiveStudioBackend,
  type StudioBackend,
} from '@/lib/studio/studioBackend';

/**
 * React context for the active StudioBackend. The default (no provider, or a
 * provider with no backend) is the MM backend, so the standalone site is
 * unchanged. The CreaTV embed page wraps the editor in
 * <StudioBackendProvider backend={createCreatvBackend(...)}>.
 */
const StudioBackendContext = createContext<StudioBackend | null>(null);

export function StudioBackendProvider({
  backend,
  children,
}: {
  backend?: StudioBackend;
  children: ReactNode;
}) {
  const value = useMemo(() => backend ?? createMmBackend(), [backend]);
  // Keep the module-level ref (read by previewEngine's pure URL builders) in
  // sync. Idempotent pointer assignment — safe to run during render.
  if (getActiveStudioBackend() !== value) setActiveStudioBackend(value);
  return <StudioBackendContext.Provider value={value}>{children}</StudioBackendContext.Provider>;
}

// Created once at module load (side-effect-free — createMmBackend only builds
// lazy getters). Used when no provider is mounted (standalone MM).
const FALLBACK_BACKEND: StudioBackend = createMmBackend();
export function useStudioBackend(): StudioBackend {
  return useContext(StudioBackendContext) ?? FALLBACK_BACKEND;
}
