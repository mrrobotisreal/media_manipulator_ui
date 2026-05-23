import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import AdBanner from '@/components/ad-banner';
import EmbeddedToolPanel from '@/components/embedded-tool-panel';
import RelatedLinks from '@/components/related-links';
import { AD_SLOTS } from '@/lib/adSlots';

const VideoGettingStartedTutorial: React.FC = () => {
  return (
    <>
      <div className="max-w-7xl mx-auto px-4 pt-4">
        <AdBanner
          adSlot={AD_SLOTS.tutorial_video_header}
          adFormat="leaderboard"
          adPosition="tutorial_video_header"
          utmMedium="tutorial_video_header_leaderboard"
        />
      </div>
      <div className="max-w-[1600px] mx-auto my-2 flex flex-col lg:flex-row gap-6 px-4">
      <aside className="hidden lg:block w-[300px] shrink-0">
        <AdBanner
          adSlot={AD_SLOTS.tutorial_video_sidebar_left}
          adFormat="halfpage"
          adPosition="tutorial_video_sidebar_left"
          sticky
          utmMedium="tutorial_video_sidebar_left_halfpage"
        />
      </aside>
      <div className="flex-1 min-w-0">
      <Card className="sci-fi-frame">
        <CardContent className="p-12 prose prose-invert max-w-none text-muted-foreground">
          <p className="text-sm uppercase tracking-wide text-green-600 font-medium">Video Tutorial</p>
          <h1 className="text-4xl font-bold mb-3 text-card-foreground">Getting Started: Converting Video Files</h1>
          <p className="text-lg mb-8">
            Learn how to convert and edit video files with Media Manipulator's video converter. This tutorial walks through every section of the video conversion panel — format selection, trim, transform, visual effects, temporal effects, advanced color/HDR controls, and the GPU-backed transcription option for subtitles and captions.
          </p>

          <h2 className="text-2xl font-semibold mb-3 text-card-foreground">1. Upload your video file</h2>
          <p className="mb-4">
            Drag a video file into the upload zone on the home page, or click <strong>Choose File</strong>. Common inputs include MP4, MOV, MKV, AVI, WebM, WMV, and FLV. Large videos are uploaded directly to S3 via a presigned URL for speed; smaller files upload through the standard form endpoint.
          </p>
          <p className="mb-4">
            After upload, the right panel shows a <strong>Convert / Transcribe</strong> toggle. Keep it on <em>Convert</em> for now — we'll cover Transcribe below.
          </p>

          <EmbeddedToolPanel
            defaultMediaKind="video"
            title="Try the video converter without leaving this page"
            description="Pick a video file and convert it right here. The settings below mirror the homepage converter, so you can experiment as you read."
          />

          <h2 className="text-2xl font-semibold mb-3 text-card-foreground">2. Pick the output format and quality</h2>
          <p className="mb-4">
            Use <strong>Format</strong> to choose the container/codec for the output:
          </p>
          <ul className="list-disc pl-6 space-y-1 mb-4">
            <li><strong>MP4</strong> — H.264 + AAC, the safest default for the web and most devices.</li>
            <li><strong>WebM</strong> — VP9 + Opus, optimal for the open web.</li>
            <li><strong>MOV / MKV / AVI / WMV / FLV</strong> — containers for specific workflows (Apple, archival, legacy players, etc.).</li>
            <li><strong>ProRes / DNxHD</strong> — high-bitrate professional editing codecs.</li>
            <li><strong>GIF (Animated)</strong> — silent looping image for chat threads, READMEs, and bug reports. See the dedicated section below.</li>
          </ul>
          <p className="mb-4">
            <strong>Quality</strong> chooses a CRF preset under the hood: Low ≈ CRF 30 (small file), Medium ≈ CRF 23 (balanced), High ≈ CRF 18 (visually transparent on most footage). The Quality, Height, and Speed controls are skipped for GIF output — the Animated GIF panel below takes over.
          </p>

          <h2 className="text-2xl font-semibold mb-3 text-card-foreground">2a. Converting video to an animated GIF</h2>
          <p className="mb-4">
            Pick <strong>GIF (Animated)</strong> as the format to expose the <strong>Animated GIF Settings</strong> panel. This runs a two-stage pipeline modeled on a battle-tested screencast script: FFmpeg downscales the source and samples it at a low frame rate, then <code>gifsicle</code> re-quantizes the palette and optimizes the output for size.
          </p>
          <ul className="list-disc pl-6 space-y-1 mb-4">
            <li><strong>Width (px)</strong> — output width. Height is computed automatically (and rounded to a multiple of 4) to preserve the aspect ratio. 480–900 is a good sweet spot for screencasts.</li>
            <li><strong>Frame rate (fps)</strong> — how many frames per second FFmpeg samples from the source. 12 fps reads smooth for UI screen recordings; raise to 18–24 for motion-heavy clips, or drop to 8–10 to shrink the file.</li>
            <li><strong>Colors</strong> — gifsicle palette size (2–256). 128 is a strong default; drop to 64 on flat UI footage, raise to 256 for photographic clips with smooth gradients.</li>
            <li><strong>Frame delay</strong> — gifsicle inter-frame delay in 1/100s. Lower = faster playback. 3 (≈30ms) is the snappy screencast feel; 6–10 produces a slower, more deliberate loop.</li>
            <li><strong>Optimize level</strong> — gifsicle <code>--optimize</code> level. 1 is fastest with the biggest output, 3 is slowest with the smallest output. Stick with 3 unless you're iterating on a long clip and want a quick draft.</li>
          </ul>
          <p className="mb-4">
            Trim still works for GIFs — pair a short trim with a small Width and modest Colors to keep the file well under a few megabytes. The preview modal animates the result in place once the job finishes; toggle to <em>Original</em> to compare against the source video.
          </p>

          <div className="my-12 not-prose flex justify-center">
            <AdBanner
              adSlot={AD_SLOTS.tutorial_video_incontent}
              adFormat="rectangle"
              adPosition="tutorial_video_incontent"
              utmMedium="tutorial_video_incontent_rectangle"
            />
          </div>

          <h2 className="text-2xl font-semibold mb-3 text-card-foreground">3. Resize, speed, and aspect ratio</h2>
          <p className="mb-4">
            Set <strong>Width</strong> and/or <strong>Height</strong> to resize the video. Leave one blank to scale proportionally. Toggle <strong>Preserve aspect ratio</strong> when you set both to use a non-stretching <em>force_original_aspect_ratio=decrease</em> scale.
          </p>
          <p className="mb-4">
            <strong>Speed Multiplier</strong> changes both video and audio playback tempo from 0.25x to 4x. We pair it with FFmpeg's <em>setpts</em> filter and matching <em>atempo</em> on the audio track.
          </p>

          <h2 className="text-2xl font-semibold mb-3 text-card-foreground">4. Trim</h2>
          <p className="mb-4">
            Click <strong>Trim Video</strong> to scrub the player and pick a start and end time. Only the selected segment is encoded into the output, and trim works regardless of the output codec.
          </p>

          <h2 className="text-2xl font-semibold mb-3 text-card-foreground">5. Advanced Video Effects</h2>
          <p className="mb-4">
            The <strong>Advanced Video Effects</strong> section groups every filter into collapsible panels. Expand a panel to access its controls:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>
              <strong>Visual Effects</strong> — brightness, contrast, saturation, hue, gamma, exposure, shadow/highlight recovery, Gaussian blur, motion blur, unsharp mask (sharpening), film/digital/vintage noise, and artistic effects (oil painting, watercolor, sketch, emboss, edge detection, posterize).
            </li>
            <li>
              <strong>Transform</strong> — free rotation in degrees, horizontal/vertical flip, custom crop, and padded letterboxing with a configurable color.
            </li>
            <li>
              <strong>Temporal Effects</strong> — reverse playback, ping-pong (forward then backward), frame-rate conversion with optional motion interpolation, and video stabilization with shakiness/accuracy controls.
            </li>
            <li>
              <strong>Advanced Processing</strong> — deinterlacing, HDR tone mapping (hable, reinhard, mobius), and explicit input/output colorspace conversion (Rec.709, Rec.2020, sRGB, P3).
            </li>
          </ul>

          <h2 className="text-2xl font-semibold mb-3 text-card-foreground">6. Convert and download</h2>
          <p className="mb-4">
            Click <strong>Convert File</strong>. A streaming progress bar shows real-time job status pulled from FFmpeg. When the job finishes, the result auto-previews in a modal with an <strong>Original / Final</strong> toggle so you can compare the two side by side. A <strong>Download</strong> button saves the final file.
          </p>

          <h2 className="text-2xl font-semibold mb-3 text-card-foreground">7. Transcribe a video (subtitles, captions, plain text, JSON)</h2>
          <p className="mb-4">
            Switch the panel toggle to <strong>Transcribe</strong> to run our local GPU transcription pipeline (whisper-ctranslate2). Pick an output format:
          </p>
          <ul className="list-disc pl-6 space-y-1 mb-4">
            <li><strong>VTT</strong> — time-coded captions/subtitles that drop into HTML5 video players.</li>
            <li><strong>Plain text</strong> — a continuous transcript for reading or editing.</li>
            <li><strong>Structured JSON</strong> — segmented transcript with timing data for downstream pipelines.</li>
          </ul>
          <p className="mb-4">
            Optionally type a BCP-47 language hint (e.g. <code>en</code>, <code>es</code>, <code>ja</code>). Leave it blank to auto-detect. A summary and content-safety review run automatically after the transcript is ready.
          </p>

          <h2 className="text-2xl font-semibold mb-3 text-card-foreground">Tips for great video output</h2>
          <ul className="list-disc pl-6 space-y-1 mb-4">
            <li>Use <strong>MP4 / High</strong> as a default for web delivery — it streams everywhere and looks great.</li>
            <li>Prefer <strong>WebM</strong> for open-web embeds where file size matters and you control the player.</li>
            <li>Avoid resizing upward in the standard pipeline — small inputs look better after lossless encode at original resolution.</li>
            <li>Apply <strong>stabilization</strong> before strong color grading so the warp doesn't fight the color filter.</li>
            <li>Run <strong>Transcribe</strong> alongside the conversion if you want both a converted file and subtitles — they're independent jobs.</li>
            <li>For <strong>GIF</strong> output, trim aggressively first — every extra second of footage multiplies the final size by frame rate × colors.</li>
          </ul>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link to="/" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Try the Video Converter
            </Link>
            <Link to="/tutorials" className="bg-card border border-border text-card-foreground px-4 py-2 rounded-lg hover:bg-muted transition-colors">
              ← Back to Tutorials
            </Link>
            <Link to="/how-it-works" className="bg-card border border-border text-card-foreground px-4 py-2 rounded-lg hover:bg-muted transition-colors">
              How it Works
            </Link>
          </div>

          <RelatedLinks
            title="Try related tools"
            intro="Jump straight into a focused video tool or keep exploring related guides."
            links={[
              {
                label: 'Video converter',
                to: '/tools/video-converter',
                description: 'Convert MP4, WebM, MOV, AVI, MKV, and more.',
              },
              {
                label: 'Compress video',
                to: '/tools/compress-video',
                description: 'Shrink video file size for the web without ruining quality.',
              },
              {
                label: 'Transcribe video',
                to: '/tools/transcribe-video',
                description: 'Pull spoken words out of video as searchable text or captions.',
              },
              {
                label: 'Convert video to GIF',
                to: '/tools/convert-video-to-animated-gif',
                description: 'Turn short video clips into shareable animated GIFs.',
              },
              {
                label: 'Video compression guide',
                to: '/blog/video/video-compression-guide',
                description: 'MP4 vs WebM vs AVI and how codecs and bitrate affect quality.',
              },
              {
                label: 'How Media Manipulator works',
                to: '/how-it-works',
                description: 'Learn how transcription and AI summaries run on a local GPU.',
              },
            ]}
          />
        </CardContent>
      </Card>
      </div>
      <aside className="hidden lg:block w-[300px] shrink-0">
        <AdBanner
          adSlot={AD_SLOTS.tutorial_video_sidebar_right}
          adFormat="halfpage"
          adPosition="tutorial_video_sidebar_right"
          sticky
          utmMedium="tutorial_video_sidebar_right_halfpage"
        />
      </aside>
      </div>
      <div className="max-w-7xl mx-auto px-4 pb-8">
        <AdBanner
          adSlot={AD_SLOTS.tutorial_video_footer}
          adFormat="leaderboard"
          adPosition="tutorial_video_footer"
          className="mt-8"
          utmMedium="tutorial_video_footer_leaderboard"
        />
      </div>
    </>
  );
};

export default VideoGettingStartedTutorial;
