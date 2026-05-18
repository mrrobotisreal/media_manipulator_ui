import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import AdBanner from '@/components/ad-banner';
import RelatedLinks from '@/components/related-links';
import mixpanel from 'mixpanel-browser';

const AboutPage: React.FC = () => {
  useEffect(() => {
    mixpanel.track('Page View', {
      page_name: 'About',
      page_path: '/about',
      user_tier: 'free'
    });
  }, []);

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 pt-4">
        <AdBanner
          adSlot="6671038874"
          adFormat="leaderboard"
          adPosition="about_header"
          className="mb-4"
          isFlashMock={true}
          utmMedium="about_leaderboard_banner"
          utmCampaign="creatv_launch_promo"
          linkURL="https://www.creatv.io/auth"
        />
      </div>
      <Card className="max-w-7xl mx-auto my-2 sci-fi-frame">
        <CardContent className="p-12">
          <h1 className="text-4xl font-bold mb-4 text-card-foreground">
            About Media Manipulator — A Free Online Media Converter, Editor &amp; AI Toolkit
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Media Manipulator is a free online media converter, editor, transcriber, and metadata
            inspector for images, videos, and audio files. It is built and operated by{' '}
            <strong>CreaTV Ltd.</strong> and runs entirely on infrastructure we own — including a
            dedicated GPU server for AI features — so your files never leave systems we control.
          </p>

          <div className="prose max-w-none text-muted-foreground">

            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 text-card-foreground">Our Mission</h2>
              <p className="mb-4">
                We started Media Manipulator because most "free media converter" sites are slow,
                upsell aggressively, paywall basic features behind sign-ups, send your files to
                third-party AI providers, or quietly retain uploads indefinitely. We wanted a free
                file converter online that you can trust: open in a browser, drop in a file,
                pick a setting, get a usable result. No account required, no software to install,
                no permanent storage of your media.
              </p>
              <p className="mb-4">
                We treat conversion, editing, compression, transcription, summarization, and
                metadata management as one connected workflow rather than ten separate websites.
                If you want to{' '}
                <Link to="/blog/video/video-compression-guide" className="text-blue-600 hover:text-blue-800">compress an MP4 for the web</Link>
                , then trim it, generate VTT captions, and finally strip EXIF metadata from the
                thumbnail you'll publish alongside it — that's three different sites for most
                people and a single tab for Media Manipulator users.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 text-card-foreground">
                What Media Manipulator Does
              </h2>
              <p className="mb-4">
                Media Manipulator covers the full range of "I need to do something with this file"
                tasks across three media types. Everything runs on our servers — there is no
                desktop app to download, no Chrome extension to install, and no plug-in to update.
                Open the site, drop in a file, pick a tool, and download the result.
              </p>

              <div className="grid md:grid-cols-3 gap-6 mt-6">
                <div className="bg-card p-6 sci-fi-frame-inner">
                  <h3 className="font-semibold mb-3 text-blue-600">Free Image Converter &amp; Editor</h3>
                  <ul className="space-y-1 text-sm">
                    <li>Convert JPG, PNG, WebP, GIF, BMP, and TIFF</li>
                    <li>Compress images for the web (JPG, WebP quality presets)</li>
                    <li>Resize, crop, and rotate online</li>
                    <li>Apply filters: grayscale, sepia, blur, sharpen, vintage, sketch</li>
                    <li>Add watermark / text overlay with stroke and gravity</li>
                    <li>Inspect, keep, strip, or rewrite EXIF / IPTC / XMP metadata</li>
                    <li>
                      <strong>Remove GPS metadata from photos</strong> before sharing online
                    </li>
                    <li>AI face blur, background removal, upscaling, and OCR text redaction</li>
                  </ul>
                </div>
                <div className="bg-card p-6 sci-fi-frame-inner">
                  <h3 className="font-semibold mb-3 text-green-600">Free Video Converter &amp; Editor</h3>
                  <ul className="space-y-1 text-sm">
                    <li>Convert MP4, WebM, MOV, MKV, AVI, WMV, FLV, ProRes</li>
                    <li>Compress video online without ruining quality</li>
                    <li>Trim and cut video clips</li>
                    <li>Resize, change frame rate, and adjust playback speed</li>
                    <li>Color correction, stabilization, and artistic filters</li>
                    <li>HDR tone mapping and colorspace conversion</li>
                    <li>
                      <strong>Transcribe video to text</strong> with VTT, plain text, or JSON output
                    </li>
                    <li>Auto-generate summaries from long videos</li>
                  </ul>
                </div>
                <div className="bg-card p-6 sci-fi-frame-inner">
                  <h3 className="font-semibold mb-3 text-purple-600">Free Audio Converter &amp; Cleanup</h3>
                  <ul className="space-y-1 text-sm">
                    <li>Convert MP3, WAV, AAC, OGG, FLAC, ALAC, M4A, Opus, AC3</li>
                    <li>Convert WAV to MP3, FLAC to MP3, OGG to MP3, and more</li>
                    <li>Trim, normalize, amplify, and EQ audio</li>
                    <li>Reverb, delay, chorus, flanger, pitch shift, time stretch</li>
                    <li><strong>Audio cleanup online</strong> — remove background noise from voice recordings</li>
                    <li>AI voice cleanup for podcasts and voiceovers</li>
                    <li>Isolate vocals or remove vocals (karaoke maker)</li>
                    <li>Transcribe audio to text and summarize transcripts</li>
                  </ul>
                </div>
              </div>

              <p className="mt-6">
                Step-by-step walkthroughs for every tool live in our{' '}
                <Link to="/tutorials" className="text-blue-600 hover:text-blue-800">tutorials</Link>{' '}
                section. If you'd rather read the technical breakdown first, see{' '}
                <Link to="/how-it-works" className="text-blue-600 hover:text-blue-800">how Media Manipulator works</Link>.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 text-card-foreground">Why Choose Media Manipulator</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-card p-6 sci-fi-frame-inner">
                  <h3 className="font-semibold mb-2 text-card-foreground">No Sign-Up, No Paywall</h3>
                  <p>
                    Every feature on the site — image conversion, video compression, audio cleanup,
                    transcription, AI tools — is free and usable without an account. We never
                    require you to log in, hand over an email, or pay before downloading a converted
                    file.
                  </p>
                </div>
                <div className="bg-card p-6 sci-fi-frame-inner">
                  <h3 className="font-semibold mb-2 text-card-foreground">Privacy-Focused (24-Hour Auto Delete)</h3>
                  <p>
                    Uploaded files and generated outputs are stored only as long as your session
                    needs them, with a hard maximum of <strong>24 hours</strong>, after which they
                    are deleted from our active storage. We do not keep your media files past that
                    window and we don't sell or share uploads with anyone. See our{' '}
                    <Link to="/privacy-policy" className="text-blue-600 hover:text-blue-800">privacy policy</Link>{' '}
                    for full details.
                  </p>
                </div>
                <div className="bg-card p-6 sci-fi-frame-inner">
                  <h3 className="font-semibold mb-2 text-card-foreground">Local AI on Our Own GPU</h3>
                  <p>
                    AI features — face blur, background removal, AI upscale, OCR-based PII
                    redaction, voice cleanup, vocal isolation, transcription, and AI summaries —
                    run on a dedicated NVIDIA GPU server that <strong>CreaTV Ltd.</strong> owns and
                    operates. We do not send your files to OpenAI, Anthropic, Google, AWS Bedrock,
                    or any other third-party AI provider.
                  </p>
                </div>
                <div className="bg-card p-6 sci-fi-frame-inner">
                  <h3 className="font-semibold mb-2 text-card-foreground">Real Tools, Not Toy Converters</h3>
                  <p>
                    Under the hood we run FFmpeg and ImageMagick for standard pipelines and
                    purpose-built models (Real-ESRGAN, BiRefNet, Demucs, DeepFilterNet,
                    whisper-ctranslate2, exiftool, rembg) for everything else. Bitrate, codec,
                    quality, channel layout, color space — every setting that matters to power
                    users is exposed in the UI.
                  </p>
                </div>
                <div className="bg-card p-6 sci-fi-frame-inner">
                  <h3 className="font-semibold mb-2 text-card-foreground">Built for the Web</h3>
                  <p>
                    Nothing to download, nothing to install, nothing to update. Media Manipulator
                    runs in any modern browser on desktop, laptop, tablet, or phone, and large
                    video uploads use direct-to-S3 presigned URLs so the upload step doesn't choke
                    on slower connections.
                  </p>
                </div>
                <div className="bg-card p-6 sci-fi-frame-inner">
                  <h3 className="font-semibold mb-2 text-card-foreground">Open, Honest, Free</h3>
                  <p>
                    The site is supported by unobtrusive advertising and CreaTV's own product
                    promotions — never by selling your data or your files. If something on the site
                    is misleading, broken, or feels slimy, we want to hear about it at{' '}
                    <a href="mailto:support@media-manipulator.com" className="text-blue-600 hover:text-blue-800">
                      support@media-manipulator.com
                    </a>.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 text-card-foreground">
                Common Tasks Media Manipulator Handles
              </h2>
              <p className="mb-4">
                If you've Googled any of the following and ended up here, you're in the right
                place. Open the{' '}
                <Link to="/" className="text-blue-600 hover:text-blue-800">converter homepage</Link>,
                upload a file, and the right-hand panel switches to whichever toolset matches.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2 text-card-foreground">Image tasks</h3>
                  <ul className="space-y-1 text-sm">
                    <li>Convert HEIC to JPG / iPhone photos to JPG</li>
                    <li>Convert PNG to WebP for faster web pages</li>
                    <li>Convert WebP to JPG for legacy compatibility</li>
                    <li>Compress JPG / compress PNG / compress WebP</li>
                    <li>Resize an image for a profile picture or thumbnail</li>
                    <li>Crop an image to a specific aspect ratio</li>
                    <li>Add a watermark or copyright text overlay</li>
                    <li>Remove EXIF metadata from photos before sharing</li>
                    <li>Strip GPS coordinates from a photo</li>
                    <li>Blur faces in event photos automatically</li>
                    <li>Remove the background of a product photo</li>
                    <li>Upscale a low-resolution image with AI</li>
                    <li>Redact PII (emails, phone numbers, SSNs) from screenshots</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-card-foreground">Video &amp; audio tasks</h3>
                  <ul className="space-y-1 text-sm">
                    <li>Convert MP4 to WebM, MOV to MP4, MKV to MP4, AVI to MP4</li>
                    <li>Compress a video file for email or messaging size limits</li>
                    <li>Trim or cut a video clip without re-encoding the rest</li>
                    <li>Change a video's frame rate or resolution</li>
                    <li>Stabilize shaky footage</li>
                    <li>Generate captions / subtitles (VTT) from a video</li>
                    <li>Transcribe a video to plain text or structured JSON</li>
                    <li>Summarize a long video or audio recording</li>
                    <li>Convert WAV to MP3, FLAC to MP3, OGG to MP3, M4A to MP3</li>
                    <li>Clean up podcast audio / remove background noise</li>
                    <li>Isolate vocals from a song</li>
                    <li>Remove vocals from a song (karaoke maker)</li>
                    <li>Pitch shift or time stretch an audio clip</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 text-card-foreground">Who Builds Media Manipulator</h2>
              <p className="mb-4">
                Media Manipulator is built and operated by <strong>CreaTV Ltd.</strong>, a small
                independent media-tech company based in Colorado, USA. CreaTV's broader product
                line is focused on tools that help creators bring ideas to life — Media Manipulator
                is the free, no-account utility that anchors that ecosystem.
              </p>
              <p className="mb-4">
                We're a small team, which is exactly why we built Media Manipulator the way we did:
                we don't want to babysit a fleet of third-party AI integrations, we don't want to
                store your files indefinitely, and we don't want to operate ten separate
                single-purpose converter sites. One studio, one place files live for at most 24
                hours, one GPU server doing the heavy lifting.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 text-card-foreground">
                Supported File Formats (Quick Reference)
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-card p-6 sci-fi-frame-inner">
                  <h3 className="font-semibold mb-2 text-blue-600">Images</h3>
                  <ul className="space-y-1 text-sm">
                    <li>JPEG / JPG</li>
                    <li>PNG</li>
                    <li>WebP (lossy and lossless)</li>
                    <li>GIF (incl. animation passthrough)</li>
                    <li>BMP</li>
                    <li>TIFF</li>
                    <li>HEIC / HEIF (input)</li>
                  </ul>
                </div>
                <div className="bg-card p-6 sci-fi-frame-inner">
                  <h3 className="font-semibold mb-2 text-green-600">Videos</h3>
                  <ul className="space-y-1 text-sm">
                    <li>MP4 (H.264 / H.265)</li>
                    <li>WebM (VP9 + Opus)</li>
                    <li>MOV</li>
                    <li>MKV</li>
                    <li>AVI</li>
                    <li>WMV, FLV</li>
                    <li>ProRes, DNxHD</li>
                  </ul>
                </div>
                <div className="bg-card p-6 sci-fi-frame-inner">
                  <h3 className="font-semibold mb-2 text-purple-600">Audio</h3>
                  <ul className="space-y-1 text-sm">
                    <li>MP3</li>
                    <li>WAV (PCM)</li>
                    <li>AAC, M4A</li>
                    <li>OGG (Vorbis)</li>
                    <li>FLAC, ALAC</li>
                    <li>Opus</li>
                    <li>AC3, DTS</li>
                  </ul>
                </div>
              </div>
              <p className="mt-4 text-sm">
                Need a format we don't list? Drop us a line — most additions are a small FFmpeg or
                ImageMagick configuration change away.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 text-card-foreground">Contact &amp; Support</h2>
              <p className="mb-2">
                <strong>Media Manipulator</strong> is a product of <strong>CreaTV Ltd.</strong>
              </p>
              <p className="mb-1">CreaTV Ltd. — Colorado, USA</p>
              <p className="mb-1">
                General support:{' '}
                <a href="mailto:support@media-manipulator.com" className="text-blue-600 hover:text-blue-800">
                  support@media-manipulator.com
                </a>
              </p>
              <p className="mb-1">
                Privacy requests:{' '}
                <a href="mailto:privacy@media-manipulator.com" className="text-blue-600 hover:text-blue-800">
                  privacy@media-manipulator.com
                </a>
              </p>
              <p className="mb-4">
                Helpful starting points:{' '}
                <Link to="/how-it-works" className="text-blue-600 hover:text-blue-800">How it works</Link>{' '}
                ·{' '}
                <Link to="/tutorials" className="text-blue-600 hover:text-blue-800">Tutorials</Link>{' '}
                ·{' '}
                <Link to="/blog" className="text-blue-600 hover:text-blue-800">Blog</Link>{' '}
                ·{' '}
                <Link to="/privacy-policy" className="text-blue-600 hover:text-blue-800">Privacy</Link>{' '}
                ·{' '}
                <Link to="/terms-of-service" className="text-blue-600 hover:text-blue-800">Terms</Link>
              </p>
            </section>

            <RelatedLinks
              title="Start somewhere"
              intro="Three good ways to dive into the toolkit."
              links={[
                {
                  label: 'Open the free media converter',
                  to: '/',
                  description: 'Convert, compress, transcribe, and edit images, videos, and audio in one place.',
                },
                {
                  label: 'Browse step-by-step tutorials',
                  to: '/tutorials',
                  description: 'Walkthroughs for the image, video, and audio converters and their AI tools.',
                },
                {
                  label: 'See how it works under the hood',
                  to: '/how-it-works',
                  description: 'FFmpeg, ImageMagick, GPU-backed AI, 24-hour auto-delete, and content-safety scanning.',
                },
                {
                  label: 'Read the media blog',
                  to: '/blog',
                  description: 'Video compression, image optimization, audio quality, and metadata guides.',
                },
              ]}
            />
          </div>
        </CardContent>
      </Card>
      <div className="max-w-6xl mx-auto px-4 pb-8">
        <AdBanner
          adSlot="3633827902"
          adFormat="leaderboard"
          adPosition="about_footer"
          className="mt-8"
          isFlashMock={true}
          utmMedium="about_footer_leaderboard"
          utmCampaign="creatv_launch_promo"
          linkURL="https://www.creatv.io/auth"
        />
      </div>
    </>
  );
};

export default AboutPage;
