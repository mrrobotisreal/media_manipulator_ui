'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { drGet } from '@/lib/dr/apiClient';
import { DrDesktopDownloadUrlResponseSchema, type DrDesktopPlatform } from '@/schemas/drDesktop';

// Portal-home section offering the Double Raven Portal desktop app installers.
// Each button fetches a short-TTL presigned URL from the always-authed API and
// immediately starts the download — the installers are private builds, so
// there is no public link to render.
//
// The platform logos are the owner-supplied official Brandfetch SVGs dropped
// into public/ at exactly these paths. Until they land, the <img> simply
// renders broken — acceptable; do not substitute placeholders.
const PLATFORMS: ReadonlyArray<{
  platform: DrDesktopPlatform;
  label: string;
  logo: string;
}> = [
  { platform: 'mac-arm64', label: 'Mac (Apple Silicon)', logo: '/dr-apple-logo.svg' },
  { platform: 'mac-intel', label: 'Mac (Intel)', logo: '/dr-apple-logo.svg' },
  { platform: 'windows', label: 'Windows', logo: '/dr-windows-logo.svg' },
];

export default function DrDesktopDownloads() {
  // Which platform's URL is being fetched (per-button spinner), not one
  // global flag — but any in-flight fetch blocks the others so a double-click
  // can't double-fire.
  const [pending, setPending] = useState<DrDesktopPlatform | null>(null);

  const startDownload = async (platform: DrDesktopPlatform) => {
    if (pending) return;
    setPending(platform);
    try {
      const res = DrDesktopDownloadUrlResponseSchema.parse(
        await drGet(`/dr/desktop/download-url?platform=${platform}`),
      );
      // A temporary anchor (not window.location.href) keeps SPA state and
      // avoids a navigation flash; the presigned URL's Content-Disposition
      // header does the real filename work.
      const a = document.createElement('a');
      a.href = res.url;
      a.download = res.fileName;
      a.click();
    } catch {
      toast.error("Couldn't start the download — try again.");
    } finally {
      setPending(null);
    }
  };

  return (
    <section className="mt-10">
      <h2 className="font-semibold">Double Raven Portal desktop app</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Install the desktop app version of Double Raven Portal by selecting one of the links below
        depending on which OS platform you wish to install it on: Mac (Apple Silicon), Mac (Intel),
        and Windows.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        {PLATFORMS.map(({ platform, label, logo }) => (
          <Button
            key={platform}
            variant="outline"
            disabled={pending !== null}
            onClick={() => void startDownload(platform)}
          >
            {pending === platform ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              <img src={logo} alt="" aria-hidden="true" className="size-5" />
            )}
            {label}
          </Button>
        ))}
      </div>
    </section>
  );
}
