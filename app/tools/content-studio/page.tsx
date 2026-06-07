import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Info } from 'lucide-react';
import { buildMetadata } from '@/lib/metadata';
import { JsonLd } from '@/components/seo/json-ld';
import ToolLandingPage from '@/components/tools/tool-landing-page';
import StudioHostClient from '@/components/content-studio/studio-host-client';
import { TOOL_PAGES } from '@/content/toolPages';

export const metadata: Metadata = buildMetadata('/tools/content-studio');

/**
 * Server-rendered quick-start guide that sits right under the title. It uses a
 * native <details> element so the full guide copy is present in the prerendered
 * HTML (crawlable in view-source) and is not lazy-loaded only after a click.
 */
function StudioGuide() {
  return (
    <details className="my-4 rounded-lg border border-blue-200 dark:border-blue-900/60 bg-blue-50/40 dark:bg-blue-950/20" open>
      <summary className="flex cursor-pointer items-center gap-2 px-4 py-3 font-semibold text-card-foreground">
        <Info className="h-4 w-4 text-blue-600" aria-hidden="true" />
        <span aria-label="Open the Content Studio guide">How Content Studio works — quick guide</span>
      </summary>
      <div className="space-y-4 px-4 pb-4 text-sm text-muted-foreground">
        <div>
          <h3 className="font-medium text-card-foreground">What Content Studio is</h3>
          <p>
            A free, browser-based multi-track video editor. You assemble a full
            edit — video, images, titles, and audio across stacked timeline
            tracks — and export a single MP4. No install and no signup.
          </p>
        </div>
        <div>
          <h3 className="font-medium text-card-foreground">When to use it</h3>
          <p>
            Reach for Content Studio when one file isn’t enough: combining
            several clips, adding titles or background music, layering overlays,
            or trimming and re-ordering footage into a finished video.
          </p>
        </div>
        <div>
          <h3 className="font-medium text-card-foreground">Supported media types</h3>
          <p>
            Video (MP4, MOV, WebM, MKV), images (JPG, PNG, WebP), and audio
            (MP3, WAV, AAC). The final export is MP4 (H.264 video, AAC audio).
          </p>
        </div>
        <div>
          <h3 className="font-medium text-card-foreground">Step by step</h3>
          <ol className="mt-1 list-decimal space-y-1 pl-5">
            <li>Create a project and choose a resolution (up to 4K) and frame rate (24/30/60 fps).</li>
            <li>Drag video, image, and audio files into the media bin.</li>
            <li>Drop clips onto the timeline tracks, then trim and split them at the playhead.</li>
            <li>Stack overlays and titles on higher tracks and add audio tracks to mix.</li>
            <li>Preview the composite, then export to MP4 and download.</li>
          </ol>
        </div>
        <div>
          <h3 className="font-medium text-card-foreground">Timeline &amp; layers</h3>
          <p>
            The timeline is frame-accurate — the playhead and clip edges snap to
            the project frame rate. Tracks composite in stacking order, so a clip
            on a higher track renders over the ones below it. That’s how titles,
            logos, and picture-in-picture overlays sit on top of your base video.
          </p>
        </div>
        <div>
          <h3 className="font-medium text-card-foreground">Export</h3>
          <p>
            Exporting renders the whole sequence — every track, trim, and overlay
            — into one downloadable MP4 encoded with H.264 video and AAC audio.
          </p>
        </div>
        <div>
          <h3 className="font-medium text-card-foreground">Limitations</h3>
          <p>
            Content Studio is actively evolving. Core editing — multi-track
            timeline, trim/split, layering, audio mixing, and MP4 export — is
            available now. Advanced effects continue to be added over time.
          </p>
        </div>
        <div>
          <h3 className="font-medium text-card-foreground">Privacy</h3>
          <p>
            Your media is processed on our own servers and automatically deleted
            within 24 hours. No account is required and files are never shared
            with third-party providers.
          </p>
        </div>
      </div>
    </details>
  );
}

export default function ContentStudioRoute() {
  const tool = TOOL_PAGES.find((t) => t.slug === 'content-studio');
  if (!tool) notFound();

  return (
    <>
      <JsonLd path="/tools/content-studio" />
      <ToolLandingPage
        tool={tool}
        panel={<StudioHostClient />}
        beforeIntroExtra={<StudioGuide />}
      />
    </>
  );
}
