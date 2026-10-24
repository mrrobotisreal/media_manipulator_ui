/**
 * Bridge between the editor's single DndContext (which owns onDragEnd) and the
 * media bin's folder chips. The bin registers a handler while mounted; the
 * editor offers it any asset drag that ends over a `folder:<name>` droppable.
 */
export const FOLDER_DROP_PREFIX = 'folder:';
export const UNFILED_DROP_ID = `${FOLDER_DROP_PREFIX}\u0000unfiled`;

type FolderDropHandler = (assetId: string, folder: string) => void;

let handler: FolderDropHandler | null = null;

export function setBinFolderDropHandler(fn: FolderDropHandler | null): void {
  handler = fn;
}

/** Returns true when the drop target was a folder chip (handled, even if no handler is mounted). */
export function dispatchFolderDrop(overId: string | null, assetId: string): boolean {
  if (!overId || !overId.startsWith(FOLDER_DROP_PREFIX)) return false;
  const name = overId === UNFILED_DROP_ID ? '' : overId.slice(FOLDER_DROP_PREFIX.length);
  handler?.(assetId, name);
  return true;
}
