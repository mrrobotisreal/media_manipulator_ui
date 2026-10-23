/** Largest archive the browser will open in memory (design RESULT_VIEWERS.md section 3). */
export const ARCHIVE_MAX_BYTES = 300 * 1024 * 1024;

/** Lower cap for devices that report little memory, where a 300 MB inflate can crash the tab. */
export const ARCHIVE_MAX_BYTES_LOW_MEMORY = 150 * 1024 * 1024;

/** The cap for this device: halved when `navigator.deviceMemory` reports under 4 GB. */
export function archiveCapBytes(): number {
  const memory = typeof navigator === 'undefined' ? undefined : (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  return typeof memory === 'number' && memory < 4 ? ARCHIVE_MAX_BYTES_LOW_MEMORY : ARCHIVE_MAX_BYTES;
}

export function isOverArchiveCap(sizeBytes: number | undefined): boolean {
  return typeof sizeBytes === 'number' && sizeBytes > archiveCapBytes();
}
