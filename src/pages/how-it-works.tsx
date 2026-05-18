import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import AdBanner from '@/components/ad-banner';
import mixpanel from 'mixpanel-browser';

const HowItWorksPage: React.FC = () => {
  useEffect(() => {
    mixpanel.track('Page View', {
      page_name: 'How It Works',
      page_path: '/how-it-works',
      user_tier: 'free'
    });
    document.title = 'How Media Manipulator Works — Convert, Edit, Transcribe, and AI-Process Audio, Video, and Images';
  }, []);

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 pt-4">
        <AdBanner
          adSlot="6671038874"
          adFormat="leaderboard"
          adPosition="how_it_works_header"
          className="mb-4"
          isFlashMock={true}
          utmMedium="how_it_works_leaderboard"
          utmCampaign="creatv_launch_promo"
          linkURL="https://www.creatv.io/auth"
        />
      </div>
      <Card className="max-w-7xl mx-auto my-2 sci-fi-frame">
        <CardContent className="p-12">
          <h1 className="text-4xl font-bold mb-4 text-card-foreground">
            How Media Manipulator Works
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Media Manipulator is a browser-based studio for converting, editing, transcribing, and AI-processing audio, video, and image files. Every job runs on our own GPU-backed servers — no third-party AI providers, no permanent storage, just fast file processing with optional local AI tools.
          </p>

          <div className="grid gap-8">
            <section className="bg-card p-6 sci-fi-frame-inner">
              <h2 className="text-2xl font-semibold mb-4 text-card-foreground">The Conversion Process</h2>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-blue-600">1</span>
                  </div>
                  <h3 className="font-semibold mb-2 text-card-foreground">Upload</h3>
                  <p className="text-muted-foreground">
                    Drag a file into the upload zone or click to browse. We support common image, video, and audio formats up to your plan's size limit.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-green-600">2</span>
                  </div>
                  <h3 className="font-semibold mb-2 text-card-foreground">Configure</h3>
                  <p className="text-muted-foreground">
                    Pick the output format, quality, dimensions, filters, metadata behavior, or an AI operation such as face blur, background removal, or vocal isolation.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-purple-600">3</span>
                  </div>
                  <h3 className="font-semibold mb-2 text-card-foreground">Convert</h3>
                  <p className="text-muted-foreground">
                    Our servers process the file with FFmpeg, ImageMagick, or local AI tooling on a dedicated GPU. Job progress streams back to your browser in real time.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-orange-600">4</span>
                  </div>
                  <h3 className="font-semibold mb-2 text-card-foreground">Download</h3>
                  <p className="text-muted-foreground">
                    Preview the result, then download it. Files are kept on our servers for at most 24 hours and then deleted automatically.
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-card p-6 sci-fi-frame-inner">
              <h2 className="text-2xl font-semibold mb-4 text-card-foreground">What you can do with Media Manipulator</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-semibold mb-2 text-card-foreground">Image Tools</h3>
                  <ul className="text-muted-foreground space-y-1">
                    <li>• Convert between JPG, PNG, WebP, and GIF</li>
                    <li>• Resize, crop, and rotate</li>
                    <li>• Apply filters (grayscale, sepia, blur, sharpen, vintage, sketch, and more)</li>
                    <li>• Add custom text overlays with positioning and stroke</li>
                    <li>• Inspect, keep, strip, or rewrite EXIF / IPTC / XMP metadata</li>
                    <li>• Remove or replace GPS location and capture-direction fields</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-card-foreground">Video Tools</h3>
                  <ul className="text-muted-foreground space-y-1">
                    <li>• Convert to MP4, WebM, AVI, MOV, MKV, ProRes, and more</li>
                    <li>• Trim, resize, and adjust playback speed</li>
                    <li>• Color correction: brightness, contrast, saturation, hue, gamma</li>
                    <li>• Motion blur, unsharp mask, noise, artistic filters</li>
                    <li>• Rotation, flips, padding, and stabilization</li>
                    <li>• Frame rate conversion and HDR/colorspace controls</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-card-foreground">Audio Tools</h3>
                  <ul className="text-muted-foreground space-y-1">
                    <li>• Convert between MP3, WAV, AAC, OGG, FLAC, ALAC, Opus, AC3</li>
                    <li>• Trim, fade in/out, normalize, and amplify</li>
                    <li>• EQ presets, stereo width, pan, balance, mono conversion</li>
                    <li>• Reverb, delay, chorus, flanger, tremolo, vibrato</li>
                    <li>• Noise reduction, de-hum, declip, silence removal</li>
                    <li>• Pitch shifting, time stretching, spatial audio</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="bg-card p-6 sci-fi-frame-inner">
              <h2 className="text-2xl font-semibold mb-4 text-card-foreground">AI-Assisted Tools (Local, GPU-Accelerated)</h2>
              <p className="text-muted-foreground mb-4">
                Media Manipulator runs every AI operation locally on our own GPU server. Your files are never sent to a third-party AI provider. Each conversion job runs one AI operation; standard editing options are skipped for that job so the AI tool can focus on a clean output.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2 text-card-foreground">AI Image Tools</h3>
                  <ul className="text-muted-foreground space-y-1">
                    <li>• <strong>Face Blur / Pixelate / Black Box</strong> — automatic face detection with three privacy styles.</li>
                    <li>• <strong>Remove Background</strong> — outputs a transparent PNG using BiRefNet, ISNet, or U2Net models.</li>
                    <li>• <strong>AI Upscale</strong> — Real-ESRGAN 2x or 4x using photo or anime-tuned models.</li>
                    <li>• <strong>Redact Text / PII</strong> — OCR-based redaction with blackbox, blur, or pixelate styles.</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-card-foreground">AI Audio Tools</h3>
                  <ul className="text-muted-foreground space-y-1">
                    <li>• <strong>Clean Voice</strong> — DeepFilterNet denoise + presence/loudness/limiter polish for spoken voice.</li>
                    <li>• <strong>Remove Background Noise</strong> — DeepFilterNet denoise without the broadcast polish chain.</li>
                    <li>• <strong>Isolate Vocals</strong> — Demucs htdemucs vocal stem, exported as a lossless WAV by default.</li>
                    <li>• <strong>Remove Vocals / Karaoke</strong> — Demucs instrumental stem, also lossless WAV by default.</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="bg-card p-6 sci-fi-frame-inner">
              <h2 className="text-2xl font-semibold mb-4 text-card-foreground">Transcription</h2>
              <p className="text-muted-foreground mb-4">
                Upload a video or audio file and switch the right-hand panel to <em>Transcribe</em>. Our GPU server runs whisper-ctranslate2 to produce a transcript in your chosen format:
              </p>
              <ul className="text-muted-foreground space-y-1">
                <li>• <strong>VTT</strong> — time-coded captions for video players and accessibility tools.</li>
                <li>• <strong>Plain text</strong> — continuous transcript suitable for reading or further editing.</li>
                <li>• <strong>Structured JSON</strong> — segmented transcript with timing data for downstream pipelines.</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                A summary and content-safety review run automatically once the transcript is ready, so you can scan long recordings quickly.
              </p>
            </section>

            <section className="bg-card p-6 sci-fi-frame-inner">
              <h2 className="text-2xl font-semibold mb-4 text-card-foreground">Privacy & Performance</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2 text-card-foreground">Security & Privacy</h3>
                  <ul className="text-muted-foreground space-y-1">
                    <li>• All uploads use HTTPS encryption</li>
                    <li>• Files are automatically deleted within 24 hours</li>
                    <li>• AI processing runs on our own servers — no third-party AI provider sees your media</li>
                    <li>• Automatic content-safety scanning for abusive or illegal material</li>
                    <li>• See our{' '}
                      <Link to="/privacy-policy" className="text-blue-600 hover:text-blue-800">Privacy Policy</Link>
                      {' '}for full details
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-card-foreground">Quality & Performance</h3>
                  <ul className="text-muted-foreground space-y-1">
                    <li>• FFmpeg and ImageMagick power the standard pipelines</li>
                    <li>• AI jobs run on a dedicated NVIDIA GPU</li>
                    <li>• Real-time progress streamed back to your browser</li>
                    <li>• Session conversion history so you can revisit recent results</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="bg-card p-6 sci-fi-frame-green">
              <h2 className="text-2xl font-semibold mb-4 text-card-foreground">Where to next?</h2>
              <p className="text-muted-foreground mb-4">
                Ready to try a specific tool? Step-by-step walkthroughs for each conversion type live in our tutorials.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/tutorials"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Browse Tutorials
                </Link>
                <Link
                  to="/blog"
                  className="bg-card border border-border text-card-foreground px-4 py-2 rounded-lg hover:bg-muted transition-colors"
                >
                  Read the Blog
                </Link>
                <Link
                  to="/"
                  className="bg-card border border-border text-card-foreground px-4 py-2 rounded-lg hover:bg-muted transition-colors"
                >
                  Start Converting
                </Link>
              </div>
            </section>
          </div>
        </CardContent>
      </Card>
      <div className="max-w-6xl mx-auto px-4 pb-8">
        <AdBanner
          adSlot="3633827902"
          adFormat="leaderboard"
          adPosition="how_it_works_footer"
          className="mt-8"
          isFlashMock={true}
          utmMedium="how_it_works_footer_leaderboard"
          utmCampaign="creatv_launch_promo"
          linkURL="https://www.creatv.io/auth"
        />
      </div>
    </>
  );
};

export default HowItWorksPage;
