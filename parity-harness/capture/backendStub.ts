/**
 * Bundle-time stub for '@/lib/studio/studioBackend'. The capture page imports
 * `resolveActiveClips`/`transitionRamp` from previewEngine, whose *module*
 * pulls the backend (for URL helpers the harness never calls); aliasing the
 * backend to this stub (see the esbuild plugin in ../run.ts) keeps the auth /
 * analytics / fetch stack out of the capture bundle entirely.
 */
export function getActiveStudioBackend(): never {
  throw new Error('parity-harness capture has no StudioBackend — fixture media is served statically');
}
