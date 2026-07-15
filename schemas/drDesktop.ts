import { z } from 'zod';

// Zod contract for the DR Portal desktop app download endpoint
// (GET /api/dr/desktop/download-url). Mirrors the Go handler's camelCase JSON
// in internal/handlers/dr_desktop.go; the response is parsed against this so a
// malformed response fails fast rather than triggering a broken download.

export const DrDesktopPlatformSchema = z.enum(['mac-arm64', 'mac-intel', 'windows']);
export type DrDesktopPlatform = z.infer<typeof DrDesktopPlatformSchema>;

export const DrDesktopDownloadUrlResponseSchema = z.object({
  url: z.string(),
  fileName: z.string(),
  platform: DrDesktopPlatformSchema,
});
export type DrDesktopDownloadUrlResponse = z.infer<typeof DrDesktopDownloadUrlResponseSchema>;
