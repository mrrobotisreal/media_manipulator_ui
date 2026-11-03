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
