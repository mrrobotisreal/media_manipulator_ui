import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import AdBanner from '@/components/ad-banner';
import mixpanel from 'mixpanel-browser';

const VideoGettingStartedTutorial: React.FC = () => {
  useEffect(() => {
    mixpanel.track('Page View', {
      page_name: 'Tutorial - Video Getting Started',
      page_path: '/tutorials/video/getting-started',
      user_tier: 'free',
    });
    document.title = 'Getting Started: Converting Video Files — Media Manipulator Tutorial';
  }, []);

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 pt-4">
        <AdBanner
          adSlot="6671038874"
          adFormat="leaderboard"
          adPosition="tutorial_video_header"
          className="mb-4"
          isFlashMock={true}
          utmMedium="tutorials_video_leaderboard"
          utmCampaign="creatv_launch_promo"
          linkURL="https://www.creatv.io/auth"
        />
      </div>
      <Card className="max-w-7xl mx-auto my-2 sci-fi-frame">
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

          <h2 className="text-2xl font-semibold mb-3 text-card-foreground">2. Pick the output format and quality</h2>
          <p className="mb-4">
            Use <strong>Format</strong> to choose the container/codec for the output:
          </p>
          <ul className="list-disc pl-6 space-y-1 mb-4">
            <li><strong>MP4</strong> — H.264 + AAC, the safest default for the web and most devices.</li>
            <li><strong>WebM</strong> — VP9 + Opus, optimal for the open web.</li>
            <li><strong>MOV / MKV / AVI / WMV / FLV</strong> — containers for specific workflows (Apple, archival, legacy players, etc.).</li>
            <li><strong>ProRes / DNxHD</strong> — high-bitrate professional editing codecs.</li>
          </ul>
          <p className="mb-4">
            <strong>Quality</strong> chooses a CRF preset under the hood: Low ≈ CRF 30 (small file), Medium ≈ CRF 23 (balanced), High ≈ CRF 18 (visually transparent on most footage).
          </p>

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
        </CardContent>
      </Card>
      <div className="max-w-6xl mx-auto px-4 pb-8">
        <AdBanner
          adSlot="3633827902"
          adFormat="leaderboard"
          adPosition="tutorial_video_footer"
          className="mt-8"
          isFlashMock={true}
          utmMedium="tutorials_video_footer_leaderboard"
          utmCampaign="creatv_launch_promo"
          linkURL="https://www.creatv.io/auth"
        />
      </div>
    </>
  );
};

export default VideoGettingStartedTutorial;
