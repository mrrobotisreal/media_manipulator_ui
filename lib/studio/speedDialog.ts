/**
 * Tiny external store for the "Speed/Duration…" dialog (part 17): the clip
 * context menu lives deep in the memoized timeline, the dialog is mounted once
 * by the editor. Holds only the target clip id.
 */
let openFor: string | null = null;
const listeners = new Set<() => void>();

export const speedDialog = {
  open(clipId: string): void {
    openFor = clipId;
    listeners.forEach((l) => l());
  },
  close(): void {
    if (openFor === null) return;
    openFor = null;
    listeners.forEach((l) => l());
  },
  getSnapshot: (): string | null => openFor,
  subscribe(l: () => void): () => void {
    listeners.add(l);
    return () => listeners.delete(l);
  },
};
