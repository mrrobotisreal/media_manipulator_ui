/**
 * Save a blob to the user's disk through a transient anchor.
 *
 * The one definition of `saveBlobToDisk`. It used to be pasted into the home converter, the
 * embedded tool panel, the specialized shell and (inline) the caption translator and stitch
 * panels.
 */
export function saveBlobToDisk(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
