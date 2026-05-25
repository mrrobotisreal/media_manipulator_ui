import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import AdBanner from '@/components/ad-banner';
import EmbeddedToolPanel from '@/components/embedded-tool-panel';
import RelatedLinks from '@/components/related-links';
import { AD_SLOTS } from '@/lib/adSlots';

/**
 * Long-form tutorial covering what AI frame interpolation is, how it differs
 * from basic FPS conversion, when to use it, and how to use the Media
 * Manipulator tool. Reuses the existing tutorial layout shell (header/sidebar
 * ads + content card + sidebar/footer ads) so it matches the existing
 * tutorial-page convention and AdSense pattern exactly.
 *
 * Ad slots reuse the tutorial_video_* IDs intentionally — this page lives in
 * the video tutorial section and we don't have dedicated AdSense slots for it
 * yet. The structure is in place to switch them out later.
 */
const AIFrameInterpolationTutorial: React.FC = () => {
  return (
    <>
      <div className="max-w-7xl mx-auto px-4 pt-4">
        <AdBanner
          adSlot={AD_SLOTS.tutorial_video_header}
          adFormat="leaderboard"
          adPosition="tutorial_ai_frame_interpolation_header"
          utmMedium="tutorial_ai_frame_interpolation_header_leaderboard"
        />
      </div>
      <div className="max-w-[1600px] mx-auto my-2 flex flex-col lg:flex-row gap-6 px-4">
        <aside className="hidden lg:block w-[300px] shrink-0">
          <AdBanner
            adSlot={AD_SLOTS.tutorial_video_sidebar_left}
            adFormat="halfpage"
            adPosition="tutorial_ai_frame_interpolation_sidebar_left"
            sticky
            utmMedium="tutorial_ai_frame_interpolation_sidebar_left_halfpage"
          />
        </aside>
        <div className="flex-1 min-w-0">
          <Card className="sci-fi-frame">
            <CardContent className="p-12 prose prose-invert max-w-none text-muted-foreground">
              <p className="text-sm uppercase tracking-wide text-green-600 font-medium">
                Video Tutorial
              </p>
              <h1 className="text-4xl font-bold mb-3 text-card-foreground">
                What Is AI Frame Interpolation?
              </h1>
              <p className="text-lg mb-8">
                AI frame interpolation generates new in-between video frames so motion plays back more smoothly. This tutorial explains how it works, when to use it, what its limits are, and how to run it on Media Manipulator.
              </p>

              <h2 className="text-2xl font-semibold mb-3 text-card-foreground">
                1. What is frame interpolation?
              </h2>
              <p className="mb-4">
                Frame interpolation increases the frame rate of a video by inserting new images between the original frames. A 30fps clip has 30 frames per second; doubling its frame rate means producing 30 new frames per second to sit between the existing ones. There are several approaches:
              </p>
              <ul className="list-disc pl-6 space-y-1 mb-4">
                <li><strong>Frame duplication</strong> — copy the previous frame so motion looks the same but the playback rate matches the target.</li>
                <li><strong>Frame blending</strong> — fade between two adjacent frames to soften the boundary. Cheap but mushy.</li>
                <li><strong>Motion interpolation</strong> — estimate motion vectors and warp frames forward (e.g. FFmpeg’s minterpolate).</li>
                <li><strong>AI interpolation</strong> — a neural network (e.g. RIFE) predicts the in-between frame from the two real frames around it. Usually the cleanest result for non-rigid motion.</li>
              </ul>
              <p className="mb-4">
                Media Manipulator’s AI Frame Interpolation tool uses RIFE via rife-ncnn-vulkan on our own GPU server.
              </p>

              <EmbeddedToolPanel
                defaultMediaKind="video"
                defaultTask="ai_frame_interpolation"
                defaultOutputFormat="mp4"
                title="Try AI frame interpolation without leaving this page"
                description="Pick a video file, scroll to the AI Video Tools panel, and choose AI Frame Interpolation. The defaults output a smoother MP4 at 60fps."
              />

              <h2 className="text-2xl font-semibold mb-3 text-card-foreground">
                2. Why people use frame interpolation
              </h2>
              <ul className="list-disc pl-6 space-y-1 mb-4">
                <li>Smoother motion on modern displays and social platforms.</li>
                <li>Lifting 24/30fps footage to 60fps.</li>
                <li>Lifting 60fps footage to 120fps for high-refresh playback or editing.</li>
                <li>Cleaner motion previews for trailers, gameplay, sports, screencasts, and vlogs.</li>
                <li>Restoring older, low-FPS clips so they feel less stuttery.</li>
                <li>Producing smoother short cuts for sharing on social.</li>
              </ul>

              <h2 className="text-2xl font-semibold mb-3 text-card-foreground">
                3. How AI frame interpolation works (high level)
              </h2>
              <p className="mb-4">
                Given two adjacent frames, the model estimates how every pixel moves between them — a process related to optical flow. It then uses that motion to construct one or more new frames placed at fractional time positions between the two originals. The neural network learns common motion patterns from training data, so it tends to handle smooth, natural motion well.
              </p>
              <p className="mb-4">
                Hard cases — fast motion, occlusion (one object passing in front of another), thin structures like hair and wheels, and scene cuts — are inherently harder because the model has less reliable evidence about what should happen in between. Those regions are where artifacts tend to appear.
              </p>

              <h2 className="text-2xl font-semibold mb-3 text-card-foreground">
                4. AI interpolation vs basic FPS conversion
              </h2>
              <p className="mb-4">
                Basic FPS conversion (whether through FFmpeg’s <code>fps</code> filter or a hardware-accelerated equivalent) usually just duplicates, drops, or blends frames to hit a target frame rate. The total number of frames per second matches the target, but new motion information is not added — the eye still sees only the original capture intervals.
              </p>
              <p className="mb-4">
                AI interpolation creates net-new frames whose contents are estimated rather than copied. The trade-off:
              </p>
              <ul className="list-disc pl-6 space-y-1 mb-4">
                <li>AI usually looks much smoother than duplication or blending.</li>
                <li>AI can warp or hallucinate details on hard regions.</li>
                <li>Basic FPS conversion is faster but rarely feels truly smoother.</li>
              </ul>

              <div className="my-12 not-prose flex justify-center">
                <AdBanner
                  adSlot={AD_SLOTS.tutorial_video_incontent}
                  adFormat="rectangle"
                  adPosition="tutorial_ai_frame_interpolation_incontent"
                  utmMedium="tutorial_ai_frame_interpolation_incontent_rectangle"
                />
              </div>

              <h2 className="text-2xl font-semibold mb-3 text-card-foreground">
                5. When to pick 48, 60, or 120 FPS
              </h2>
              <ul className="list-disc pl-6 space-y-1 mb-4">
                <li><strong>48 FPS</strong> — a subtle 2× lift on 24fps cinematic footage. Less aggressive than 60fps and keeps a bit of the original cadence.</li>
                <li><strong>60 FPS</strong> — common smooth playback rate for the modern web. A good first target for 24/30fps source.</li>
                <li><strong>120 FPS</strong> — high-refresh displays, gameplay/sports content, or downstream slow-motion editing. Heavier processing cost and a larger file.</li>
              </ul>

              <h2 className="text-2xl font-semibold mb-3 text-card-foreground">
                6. Quality and max-height tradeoffs
              </h2>
              <ul className="list-disc pl-6 space-y-1 mb-4">
                <li><strong>Lower max processing height</strong> → faster turnaround and lower GPU memory pressure. Great for quick tests.</li>
                <li><strong>Higher max processing height</strong> → more detail preserved, but slower and heavier.</li>
                <li><strong>Low quality preset</strong> → faster encode, larger CRF, smaller file.</li>
                <li><strong>High quality preset</strong> → slower encode, lower CRF, sharper output.</li>
              </ul>
              <p className="mb-4">
                For a first run, try 720p max height with the medium quality preset.
              </p>

              <h2 className="text-2xl font-semibold mb-3 text-card-foreground">
                7. Best practices
              </h2>
              <ul className="list-disc pl-6 space-y-1 mb-4">
                <li>Test on a short clip first — interpolation cost scales with duration and resolution.</li>
                <li>Avoid heavy scene-cut content. Cuts often produce a brief warp at the boundary.</li>
                <li>Preview the result before publishing — interpolation can look subtly different from a real high-FPS capture.</li>
                <li>Pick clear, steady source footage when possible.</li>
                <li>Keep the original — interpolation is irreversible re-encoding.</li>
                <li>Try 60fps before 120fps unless you specifically need 120fps.</li>
              </ul>

              <h2 className="text-2xl font-semibold mb-3 text-card-foreground">
                8. Limitations and artifacts
              </h2>
              <ul className="list-disc pl-6 space-y-1 mb-4">
                <li>Warping around hands, hair, wheels, and other fast-moving thin structures.</li>
                <li>Ghosting around occlusions where one object passes in front of another.</li>
                <li>Brief glitches at scene cuts.</li>
                <li>Motion blur mismatch — synthesized frames don’t share the source camera’s shutter behavior.</li>
                <li>Existing compression artifacts (banding, blocking) can become more visible at higher frame rates.</li>
                <li>Long videos take a lot of GPU time; we cap duration to keep the free tool stable.</li>
                <li>AI interpolation does not recover real-world motion that was never captured — it estimates a plausible in-between frame.</li>
              </ul>

              <h2 className="text-2xl font-semibold mb-3 text-card-foreground">
                9. How to use the Media Manipulator AI Frame Interpolation Tool
              </h2>
              <ol className="list-decimal pl-6 space-y-1 mb-4">
                <li>Open the <Link to="/tools/ai-frame-interpolation" className="text-blue-600 hover:underline">AI Frame Interpolation tool</Link>.</li>
                <li>Upload a video.</li>
                <li>Scroll to the <strong>AI Video Tools</strong> panel and pick <em>AI Frame Interpolation</em>.</li>
                <li>Choose a target FPS — 48, 60, or 120.</li>
                <li>Pick a quality preset and a max processing height (start at 720p / medium).</li>
                <li>Leave <em>Preserve audio</em> on unless you want a silent output.</li>
                <li>Submit the conversion and wait for the job to finish.</li>
                <li>Download the resulting MP4 and preview it.</li>
              </ol>

              <h2 className="text-2xl font-semibold mb-3 text-card-foreground">
                FAQ
              </h2>
              <ul className="list-disc pl-6 space-y-3 mb-4">
                <li>
                  <strong>Does frame interpolation improve video quality?</strong>
                  <br />
                  It improves motion smoothness, not resolution or sharpness.
                </li>
                <li>
                  <strong>Is AI frame interpolation the same as increasing FPS?</strong>
                  <br />
                  Both target a higher frame rate, but AI interpolation synthesizes new frames instead of duplicating or blending.
                </li>
                <li>
                  <strong>Can I convert 30fps to 60fps?</strong>
                  <br />
                  Yes — it’s the most common target.
                </li>
                <li>
                  <strong>Can I convert 60fps to 120fps?</strong>
                  <br />
                  Yes, but the processing cost roughly doubles versus 60fps.
                </li>
                <li>
                  <strong>Why can frame interpolation create artifacts?</strong>
                  <br />
                  Motion estimation has to guess on hard regions (occlusions, fast motion, scene cuts).
                </li>
                <li>
                  <strong>What output format does the tool create?</strong>
                  <br />
                  MP4 (H.264 + AAC) in v1.
                </li>
                <li>
                  <strong>Is 60fps always better than 30fps?</strong>
                  <br />
                  Not for cinematic looks — pick what suits the content.
                </li>
                <li>
                  <strong>Is AI frame interpolation better than FFmpeg FPS conversion?</strong>
                  <br />
                  For most clips, yes — but minterpolate is faster and still useful as a quick fallback.
                </li>
                <li>
                  <strong>Why do scene cuts sometimes look strange after interpolation?</strong>
                  <br />
                  The model assumes adjacent frames belong to the same motion sequence.
                </li>
              </ul>

              <div className="mt-10 flex flex-wrap gap-3">
                <Link to="/tools/ai-frame-interpolation" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Try the AI Frame Interpolation Tool
                </Link>
                <Link to="/tutorials" className="bg-card border border-border text-card-foreground px-4 py-2 rounded-lg hover:bg-muted transition-colors">
                  ← Back to Tutorials
                </Link>
                <Link to="/tutorials/video/getting-started" className="bg-card border border-border text-card-foreground px-4 py-2 rounded-lg hover:bg-muted transition-colors">
                  Video Converter Tutorial
                </Link>
              </div>

              <RelatedLinks
                title="Try related tools and guides"
                intro="Other video tools and reference pages that pair well with AI frame interpolation."
                links={[
                  {
                    label: 'AI Frame Interpolation Tool',
                    to: '/tools/ai-frame-interpolation',
                    description: 'Upload a video and run interpolation right now.',
                  },
                  {
                    label: 'Video converter',
                    to: '/tools/video-converter',
                    description: 'Convert MP4, WebM, MOV, AVI, MKV, and more.',
                  },
                  {
                    label: 'Compress video',
                    to: '/tools/compress-video',
                    description: 'Shrink a higher-FPS file before sharing.',
                  },
                  {
                    label: 'Extract frames from video',
                    to: '/tools/extract-frames-from-video',
                    description: 'Pull individual frames out as PNGs.',
                  },
                  {
                    label: 'Convert video to GIF',
                    to: '/tools/convert-video-to-animated-gif',
                    description: 'Turn a short clip into an animated GIF.',
                  },
                  // Hidden during AdSense review — re-enable when the blog returns.
                  // {
                  //   label: 'Video compression guide',
                  //   to: '/blog/video/video-compression-guide',
                  //   description: 'Codecs, bitrate, and containers explained.',
                  // },
                ]}
              />
            </CardContent>
          </Card>
        </div>
        <aside className="hidden lg:block w-[300px] shrink-0">
          <AdBanner
            adSlot={AD_SLOTS.tutorial_video_sidebar_right}
            adFormat="halfpage"
            adPosition="tutorial_ai_frame_interpolation_sidebar_right"
            sticky
            utmMedium="tutorial_ai_frame_interpolation_sidebar_right_halfpage"
          />
        </aside>
      </div>
      <div className="max-w-7xl mx-auto px-4 pb-8">
        <AdBanner
          adSlot={AD_SLOTS.tutorial_video_footer}
          adFormat="leaderboard"
          adPosition="tutorial_ai_frame_interpolation_footer"
          className="mt-8"
          utmMedium="tutorial_ai_frame_interpolation_footer_leaderboard"
        />
      </div>
    </>
  );
};

export default AIFrameInterpolationTutorial;
