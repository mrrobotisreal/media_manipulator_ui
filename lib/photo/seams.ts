/**
 * Analytics seams (ticket MM97 decision 17): the editor reports WHAT happened
 * through these hooks and nothing else; MM101 connects them to the `photo_*`
 * events. With no listener installed they are no-ops. Slider drags are
 * debounced so one drag reports once.
 */
export type AdjustmentListener = (type: string, param: string) => void;

let listener: AdjustmentListener | null = null;
const timers = new Map<string, ReturnType<typeof setTimeout>>();
export const ADJUSTMENT_DEBOUNCE_MS = 500;

/** MM101 installs its `photo_adjustment_changed` emitter here. Returns an uninstaller. */
export function setAdjustmentListener(fn: AdjustmentListener | null): () => void {
  listener = fn;
  return () => {
    if (listener === fn) listener = null;
  };
}

/** `onAdjustmentChanged(type, param)`: debounced per type+param. */
export function onAdjustmentChanged(type: string, param: string): void {
  if (!listener) return;
  const key = `${type}:${param}`;
  const prev = timers.get(key);
  if (prev) clearTimeout(prev);
  timers.set(
    key,
    setTimeout(() => {
      timers.delete(key);
      listener?.(type, param);
    }, ADJUSTMENT_DEBOUNCE_MS),
  );
}

// ---------------------------------------------------------------------------
// MM98 seams (decision 10): what happened, nothing else. MM101 wires them.
// ---------------------------------------------------------------------------
export interface Mm98Listener {
  onMaskAdded?: (kind: string) => void;
  onAiMaskRequested?: () => void;
  onAiMaskCompleted?: () => void;
  onAiMaskFailed?: (reason: string) => void;
  onHealRequested?: (strokes: number) => void;
  onHealCompleted?: () => void;
  onHealFailed?: (reason: string) => void;
  onCompareUsed?: (mode: string) => void;
}
let mm98: Mm98Listener | null = null;
/** MM101 installs its emitters here. Returns an uninstaller. */
export function setMm98Listener(l: Mm98Listener | null): () => void {
  mm98 = l;
  return () => {
    if (mm98 === l) mm98 = null;
  };
}
export const onMaskAdded = (kind: string): void => mm98?.onMaskAdded?.(kind);
export const onAiMaskRequested = (): void => mm98?.onAiMaskRequested?.();
export const onAiMaskCompleted = (): void => mm98?.onAiMaskCompleted?.();
export const onAiMaskFailed = (reason: string): void => mm98?.onAiMaskFailed?.(reason);
export const onHealRequested = (strokes: number): void => mm98?.onHealRequested?.(strokes);
export const onHealCompleted = (): void => mm98?.onHealCompleted?.();
export const onHealFailed = (reason: string): void => mm98?.onHealFailed?.(reason);
export const onCompareUsed = (mode: string): void => mm98?.onCompareUsed?.(mode);

// ---------------------------------------------------------------------------
// MM99 seams: what happened, nothing else. MM101 wires them.
// ---------------------------------------------------------------------------
export interface Mm99Listener {
  /** A preset was applied; `builtin` is false for browser-local (and later account) presets. */
  onPresetApplied?: (id: string, builtin: boolean) => void;
  onPresetSaved?: (layers: number) => void;
  onBatchStarted?: (n: number) => void;
  onShortcutsOpened?: () => void;
}
let mm99: Mm99Listener | null = null;
/** MM101 installs its emitters here. Returns an uninstaller. */
export function setMm99Listener(l: Mm99Listener | null): () => void {
  mm99 = l;
  return () => {
    if (mm99 === l) mm99 = null;
  };
}
export const onPresetApplied = (id: string, builtin: boolean): void => mm99?.onPresetApplied?.(id, builtin);
export const onPresetSaved = (layers: number): void => mm99?.onPresetSaved?.(layers);
export const onBatchStarted = (n: number): void => mm99?.onBatchStarted?.(n);
export const onShortcutsOpened = (): void => mm99?.onShortcutsOpened?.();
