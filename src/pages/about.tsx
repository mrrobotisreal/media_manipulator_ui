import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import AdBanner from '@/components/ad-banner';
import RelatedLinks from '@/components/related-links';
import { AD_SLOTS } from '@/lib/adSlots';

const AboutPage: React.FC = () => {
  // useEffect(() => {
  //   const ring = document.getElementById('progressRing');
  //   ring?.setAttribute('stroke-dashoffset', '17');
  // }, []);

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 pt-4">
        <AdBanner
          adSlot={AD_SLOTS.about_header}
          adFormat="leaderboard"
          adPosition="about_header"
          utmMedium="about_header_leaderboard"
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
                If you want to compress an MP4 for the web,
                {/* Blog hidden during AdSense review — restore the inline link
                    when the blog returns:
                <Link to="/blog/video/video-compression-guide" className="text-blue-600 hover:text-blue-800">compress an MP4 for the web</Link>
                */}
                then trim it, generate VTT captions, and finally strip EXIF metadata from the
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
                    <li><strong>Remove unwanted objects</strong> with LaMa inpainting — draw a box, the model reconstructs the background</li>
                  </ul>
                </div>
                <div className="bg-card p-6 sci-fi-frame-inner">
                  <h3 className="font-semibold mb-3 text-green-600">Free Video Converter &amp; Editor</h3>
                  <ul className="space-y-1 text-sm">
                    <li>Convert MP4, WebM, MOV, MKV, AVI, WMV, FLV, ProRes</li>
                    <li><strong>Convert video to animated GIF</strong> with tunable width, fps, palette, and frame delay</li>
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
                    Under the hood we run FFmpeg, ImageMagick, and gifsicle for standard
                    pipelines and purpose-built models (Real-ESRGAN, BiRefNet, Demucs,
                    DeepFilterNet, whisper-ctranslate2, exiftool, rembg, simple-lama-inpainting)
                    for everything else. Bitrate, codec, quality, channel layout, color space,
                    GIF palette size and frame delay — every setting that matters to power
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
                    <li>Remove an unwanted object (person, sign, watermark) from a photo with LaMa inpainting</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-card-foreground">Video &amp; audio tasks</h3>
                  <ul className="space-y-1 text-sm">
                    <li>Convert MP4 to WebM, MOV to MP4, MKV to MP4, AVI to MP4</li>
                    <li>Convert MP4 / MOV / WebM to an optimized animated GIF for chats and docs</li>
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
                {/* Blog hidden during AdSense review — restore when the blog returns.
                ·{' '}
                <Link to="/blog" className="text-blue-600 hover:text-blue-800">Blog</Link>{' '}
                */}
                ·{' '}
                <Link to="/privacy-policy" className="text-blue-600 hover:text-blue-800">Privacy</Link>{' '}
                ·{' '}
                <Link to="/terms-of-service" className="text-blue-600 hover:text-blue-800">Terms</Link>
              </p>
            </section>

            {/* <section className="mb-10 w-full h-full p-12 bg-black flex items-center justify-center">
              <span className="loader">
              </span>
            </section>

            <section className="mb-10 w-full h-full p-12 bg-black flex items-center justify-center">
              <div className="ai-matrix-loader">
                <div className="digit">0</div>
                <div className="digit">1</div>
                <div className="digit">0</div>
                <div className="digit">1</div>
                <div className="digit">1</div>
                <div className="digit">0</div>
                <div className="digit">0</div>
                <div className="digit">1</div>
                <div className="glow"></div>
              </div>
            </section>

            <section className="mb-10 w-full h-full p-12 bg-black flex items-center justify-center">
              <div className="cube-loader">
                <div className="cube-top"></div>
                <div className="cube-wrapper">
                  <span style={{'--i': 0}} className="cube-span"></span>
                  <span style={{'--i': 1}} className="cube-span"></span>
                  <span style={{'--i': 2}} className="cube-span"></span>
                  <span style={{'--i': 3}} className="cube-span"></span>
                </div>
              </div>
            </section>

            <section className="mb-10 w-full h-full p-12 bg-black flex items-center justify-center">
              <div className="blob-loader">
                <svg width="100" height="100" viewBox="0 0 100 100">
                  <defs>
                    <mask id="clipping">
                      <polygon points="0,0 100,0 100,100 0,100" fill="black"></polygon>
                      <polygon points="25,25 75,25 50,75" fill="white"></polygon>
                      <polygon points="50,25 75,75 25,75" fill="white"></polygon>
                      <polygon points="35,35 65,35 50,65" fill="white"></polygon>
                      <polygon points="35,35 65,35 50,65" fill="white"></polygon>
                      <polygon points="35,35 65,35 50,65" fill="white"></polygon>
                      <polygon points="35,35 65,35 50,65" fill="white"></polygon>
                    </mask>
                  </defs>
                </svg>
                <div className="box"></div>
              </div>

            </section>

            <section className="mb-10 w-full h-full p-12 bg-black flex items-center justify-center">
              <div>
                <div data-glitch="Manipulating..." className="glitch">Manipulating...</div>
              </div>
            </section>

            <section className="mb-10 w-full h-full p-12 bg-black flex items-center justify-center">
              <div>
                <div data-glitch-two="Manipulating..." className="glitch2">Manipulating...</div>
              </div>
            </section>

            <section className="mb-10 w-full h-full p-12 bg-black flex items-center justify-center">
              <div className="svg-frame">
                <svg style={{'--i': 0, '--j': 0}}>
                  <g id="out1">
                    <path d="M72 172C72 116.772 116.772 72 172 72C227.228 72 272 116.772 272 172C272 227.228 227.228 272 172 272C116.772 272 72 227.228 72 172ZM197.322 172C197.322 158.015 185.985 146.678 172 146.678C158.015 146.678 146.678 158.015 146.678 172C146.678 185.985 158.015 197.322 172 197.322C185.985 197.322 197.322 185.985 197.322 172Z"></path>
                    <path mask="url(#path-1-inside-1_111_3212)" stroke-miterlimit="16" stroke-width="2" stroke="#00FFFF" d="M72 172C72 116.772 116.772 72 172 72C227.228 72 272 116.772 272 172C272 227.228 227.228 272 172 272C116.772 272 72 227.228 72 172ZM197.322 172C197.322 158.015 185.985 146.678 172 146.678C158.015 146.678 146.678 158.015 146.678 172C146.678 185.985 158.015 197.322 172 197.322C185.985 197.322 197.322 185.985 197.322 172Z"></path>
                  </g>
                </svg>

                <svg style={{'--i': 1, '--j': 1}}>
                  <g id="out2">
                    <mask fill="white" id="path-2-inside-2_111_3212">
                      <path d="M102.892 127.966C93.3733 142.905 88.9517 160.527 90.2897 178.19L94.3752 177.88C93.1041 161.1 97.3046 144.36 106.347 130.168L102.892 127.966Z"></path>
                      <path d="M93.3401 194.968C98.3049 211.971 108.646 226.908 122.814 237.541L125.273 234.264C111.814 224.163 101.99 209.973 97.2731 193.819L93.3401 194.968Z"></path>
                      <path d="M152.707 92.3592C140.33 95.3575 128.822 101.199 119.097 109.421L121.742 112.55C130.981 104.739 141.914 99.1897 153.672 96.3413L152.707 92.3592Z"></path>
                      <path d="M253.294 161.699C255.099 175.937 253.132 190.4 247.59 203.639L243.811 202.057C249.075 189.48 250.944 175.74 249.23 162.214L253.294 161.699Z"></path>
                      <path d="M172 90.0557C184.677 90.0557 197.18 92.9967 208.528 98.6474C219.875 104.298 229.757 112.505 237.396 122.621L234.126 125.09C226.869 115.479 217.481 107.683 206.701 102.315C195.921 96.9469 184.043 94.1529 172 94.1529V90.0557Z"></path>
                      <path d="M244.195 133.235C246.991 138.442 249.216 143.937 250.83 149.623L246.888 150.742C245.355 145.34 243.242 140.12 240.586 135.174L244.195 133.235Z"></path>
                      <path d="M234.238 225.304C223.932 237.338 210.358 246.126 195.159 250.604C179.961 255.082 163.79 255.058 148.606 250.534L149.775 246.607C164.201 250.905 179.563 250.928 194.001 246.674C208.44 242.42 221.335 234.071 231.126 222.639L234.238 225.304Z"></path>
                    </mask>
                    <path mask="url(#path-2-inside-2_111_3212)" fill="#00FFFF" d="M102.892 127.966L105.579 123.75L101.362 121.063L98.6752 125.28L102.892 127.966ZM90.2897 178.19L85.304 178.567L85.6817 183.553L90.6674 183.175L90.2897 178.19ZM94.3752 177.88L94.7529 182.866L99.7386 182.488L99.3609 177.503L94.3752 177.88ZM106.347 130.168L110.564 132.855L113.251 128.638L109.034 125.951L106.347 130.168ZM93.3401 194.968L91.9387 190.168L87.1391 191.569L88.5405 196.369L93.3401 194.968ZM122.814 237.541L119.813 241.54L123.812 244.541L126.813 240.542L122.814 237.541ZM125.273 234.264L129.272 237.265L132.273 233.266L128.274 230.265L125.273 234.264ZM97.2731 193.819L102.073 192.418L100.671 187.618L95.8717 189.02L97.2731 193.819ZM152.707 92.3592L157.567 91.182L156.389 86.3226L151.53 87.4998L152.707 92.3592ZM119.097 109.421L115.869 105.603L112.05 108.831L115.278 112.649L119.097 109.421ZM121.742 112.55L117.924 115.778L121.152 119.596L124.97 116.368L121.742 112.55ZM153.672 96.3413L154.849 101.201L159.708 100.023L158.531 95.1641L153.672 96.3413ZM253.294 161.699L258.255 161.07L257.626 156.11L252.666 156.738L253.294 161.699ZM247.59 203.639L245.66 208.251L250.272 210.182L252.203 205.569L247.59 203.639ZM243.811 202.057L239.198 200.126L237.268 204.739L241.88 206.669L243.811 202.057ZM249.23 162.214L248.601 157.253L243.641 157.882L244.269 162.842L249.23 162.214ZM172 90.0557V85.0557H167V90.0557H172ZM208.528 98.6474L206.299 103.123L206.299 103.123L208.528 98.6474ZM237.396 122.621L240.409 126.611L244.399 123.598L241.386 119.608L237.396 122.621ZM234.126 125.09L230.136 128.103L233.149 132.093L237.139 129.08L234.126 125.09ZM206.701 102.315L204.473 106.791L204.473 106.791L206.701 102.315ZM172 94.1529H167V99.1529H172V94.1529ZM244.195 133.235L248.601 130.87L246.235 126.465L241.83 128.83L244.195 133.235ZM250.83 149.623L252.195 154.433L257.005 153.067L255.64 148.257L250.83 149.623ZM246.888 150.742L242.078 152.107L243.444 156.917L248.254 155.552L246.888 150.742ZM240.586 135.174L238.22 130.768L233.815 133.134L236.181 137.539L240.586 135.174ZM234.238 225.304L238.036 228.556L241.288 224.759L237.491 221.506L234.238 225.304ZM195.159 250.604L196.572 255.4L196.572 255.4L195.159 250.604ZM148.606 250.534L143.814 249.107L142.386 253.899L147.178 255.326L148.606 250.534ZM149.775 246.607L151.203 241.816L146.411 240.388L144.983 245.18L149.775 246.607ZM194.001 246.674L195.415 251.47L195.415 251.47L194.001 246.674ZM231.126 222.639L234.379 218.841L230.581 215.589L227.329 219.386L231.126 222.639ZM98.6752 125.28C88.5757 141.13 83.8844 159.826 85.304 178.567L95.2754 177.812C94.0191 161.227 98.1709 144.681 107.109 130.653L98.6752 125.28ZM90.6674 183.175L94.7529 182.866L93.9976 172.895L89.912 173.204L90.6674 183.175ZM99.3609 177.503C98.1715 161.8 102.102 146.135 110.564 132.855L102.131 127.481C92.5071 142.585 88.0368 160.4 89.3895 178.258L99.3609 177.503ZM109.034 125.951L105.579 123.75L100.205 132.183L103.661 134.385L109.034 125.951ZM88.5405 196.369C93.8083 214.41 104.78 230.259 119.813 241.54L125.815 233.542C112.512 223.558 102.802 209.532 98.1397 193.566L88.5405 196.369ZM126.813 240.542L129.272 237.265L121.274 231.263L118.815 234.54L126.813 240.542ZM128.274 230.265C115.679 220.813 106.486 207.534 102.073 192.418L92.4735 195.221C97.493 212.412 107.948 227.513 122.272 238.263L128.274 230.265ZM95.8717 189.02L91.9387 190.168L94.7415 199.767L98.6745 198.619L95.8717 189.02ZM151.53 87.4998C138.398 90.681 126.188 96.8793 115.869 105.603L122.325 113.239C131.457 105.519 142.262 100.034 153.884 97.2187L151.53 87.4998ZM115.278 112.649L117.924 115.778L125.56 109.322L122.915 106.193L115.278 112.649ZM124.97 116.368C133.616 109.059 143.846 103.866 154.849 101.201L152.495 91.4818C139.981 94.5132 128.347 100.419 118.514 108.732L124.97 116.368ZM158.531 95.1641L157.567 91.182L147.848 93.5364L148.812 97.5185L158.531 95.1641ZM248.334 162.327C250.028 175.697 248.181 189.277 242.978 201.708L252.203 205.569C258.082 191.522 260.169 176.177 258.255 161.07L248.334 162.327ZM249.521 199.027L245.741 197.445L241.88 206.669L245.66 208.251L249.521 199.027ZM248.423 203.987C254.025 190.602 256.014 175.98 254.19 161.585L244.269 162.842C245.873 175.5 244.125 188.357 239.198 200.126L248.423 203.987ZM249.858 167.174L253.923 166.659L252.666 156.738L248.601 157.253L249.858 167.174ZM172 95.0557C183.903 95.0557 195.644 97.8172 206.299 103.123L210.757 94.1717C198.717 88.1761 185.45 85.0557 172 85.0557V95.0557ZM206.299 103.123C216.954 108.429 226.233 116.135 233.406 125.634L241.386 119.608C233.281 108.874 222.796 100.167 210.757 94.1717L206.299 103.123ZM234.383 118.631L231.113 121.1L237.139 129.08L240.409 126.611L234.383 118.631ZM238.116 122.077C230.393 111.849 220.403 103.552 208.93 97.8393L204.473 106.791C214.56 111.814 223.345 119.11 230.136 128.103L238.116 122.077ZM208.93 97.8393C197.458 92.1263 184.816 89.1529 172 89.1529V99.1529C183.269 99.1529 194.385 101.767 204.473 106.791L208.93 97.8393ZM177 94.1529V90.0557H167V94.1529H177ZM239.79 135.601C242.416 140.49 244.504 145.649 246.02 150.988L255.64 148.257C253.927 142.225 251.567 136.395 248.601 130.87L239.79 135.601ZM249.464 144.813L245.523 145.932L248.254 155.552L252.195 154.433L249.464 144.813ZM251.698 149.376C250.067 143.628 247.818 138.073 244.991 132.808L236.181 137.539C238.666 142.168 240.644 147.052 242.078 152.107L251.698 149.376ZM242.951 139.579L246.561 137.64L241.83 128.83L238.22 130.768L242.951 139.579ZM230.441 222.051C220.763 233.351 208.017 241.603 193.746 245.808L196.572 255.4C212.698 250.649 227.101 241.325 238.036 228.556L230.441 222.051ZM193.746 245.808C179.475 250.012 164.291 249.99 150.033 245.742L147.178 255.326C163.289 260.125 180.447 260.151 196.572 255.4L193.746 245.808ZM153.397 251.962L154.567 248.035L144.983 245.18L143.814 249.107L153.397 251.962ZM148.348 251.399C163.7 255.973 180.049 255.997 195.415 251.47L192.588 241.877C179.077 245.858 164.702 245.837 151.203 241.816L148.348 251.399ZM195.415 251.47C210.78 246.942 224.504 238.058 234.924 225.891L227.329 219.386C218.167 230.084 206.099 237.897 192.588 241.877L195.415 251.47ZM227.874 226.436L230.986 229.101L237.491 221.506L234.379 218.841L227.874 226.436Z"></path>
                  </g>
                </svg>

                <svg style={{'--i': 0, '--j': 2}}>
                  <g id="inner3">
                    <path d="M195.136 135.689C188.115 131.215 179.948 128.873 171.624 128.946C163.299 129.019 155.174 131.503 148.232 136.099L148.42 136.382C155.307 131.823 163.368 129.358 171.627 129.286C179.886 129.213 187.988 131.537 194.954 135.975L195.136 135.689Z"></path>
                    <path d="M195.136 208.311C188.115 212.784 179.948 215.127 171.624 215.054C163.299 214.981 155.174 212.496 148.232 207.901L148.42 207.618C155.307 212.177 163.368 214.642 171.627 214.714C179.886 214.786 187.988 212.463 194.954 208.025L195.136 208.311Z"></path>
                    <path mask="url(#path-5-inside-3_111_3212)" fill="#00FFFF" d="M195.136 135.689L195.474 135.904L195.689 135.566L195.351 135.352L195.136 135.689ZM171.624 128.946L171.627 129.346L171.624 128.946ZM148.232 136.099L148.011 135.765L147.678 135.986L147.899 136.32L148.232 136.099ZM148.42 136.382L148.086 136.603L148.307 136.936L148.641 136.716L148.42 136.382ZM171.627 129.286L171.63 129.686L171.627 129.286ZM194.954 135.975L194.739 136.313L195.076 136.528L195.291 136.19L194.954 135.975ZM195.136 208.311L195.351 208.648L195.689 208.433L195.474 208.096L195.136 208.311ZM171.624 215.054L171.627 214.654L171.624 215.054ZM148.232 207.901L147.899 207.68L147.678 208.014L148.011 208.234L148.232 207.901ZM148.42 207.618L148.641 207.284L148.307 207.063L148.086 207.397L148.42 207.618ZM171.627 214.714L171.63 214.314L171.627 214.714ZM194.954 208.025L195.291 207.81L195.076 207.472L194.739 207.687L194.954 208.025ZM195.351 135.352C188.265 130.836 180.022 128.473 171.62 128.546L171.627 129.346C179.874 129.274 187.966 131.594 194.921 136.026L195.351 135.352ZM171.62 128.546C163.218 128.619 155.018 131.127 148.011 135.765L148.453 136.432C155.33 131.88 163.38 129.418 171.627 129.346L171.62 128.546ZM147.899 136.32L148.086 136.603L148.753 136.161L148.566 135.878L147.899 136.32ZM148.641 136.716C155.463 132.199 163.448 129.757 171.63 129.686L171.623 128.886C163.287 128.958 155.15 131.447 148.199 136.049L148.641 136.716ZM171.63 129.686C179.812 129.614 187.839 131.916 194.739 136.313L195.169 135.638C188.138 131.158 179.959 128.813 171.623 128.886L171.63 129.686ZM195.291 136.19L195.474 135.904L194.799 135.474L194.617 135.76L195.291 136.19ZM194.921 207.974C187.966 212.406 179.874 214.726 171.627 214.654L171.62 215.454C180.022 215.527 188.265 213.163 195.351 208.648L194.921 207.974ZM171.627 214.654C163.38 214.582 155.33 212.12 148.453 207.567L148.011 208.234C155.018 212.873 163.218 215.38 171.62 215.454L171.627 214.654ZM148.566 208.122L148.753 207.838L148.086 207.397L147.899 207.68L148.566 208.122ZM148.199 207.951C155.15 212.553 163.287 215.041 171.623 215.114L171.63 214.314C163.448 214.243 155.463 211.801 148.641 207.284L148.199 207.951ZM171.623 215.114C179.959 215.187 188.138 212.842 195.169 208.362L194.739 207.687C187.839 212.084 179.812 214.386 171.63 214.314L171.623 215.114ZM194.617 208.239L194.799 208.526L195.474 208.096L195.291 207.81L194.617 208.239Z"></path>
                  </g>
                  <path stroke="#00FFFF" d="M240.944 172C240.944 187.951 235.414 203.408 225.295 215.738C215.176 228.068 201.095 236.508 185.45 239.62C169.806 242.732 153.567 240.323 139.5 232.804C125.433 225.285 114.408 213.12 108.304 198.384C102.2 183.648 101.394 167.25 106.024 151.987C110.654 136.723 120.434 123.537 133.696 114.675C146.959 105.813 162.884 101.824 178.758 103.388C194.632 104.951 209.472 111.97 220.751 123.249" id="out3"></path>
                </svg>

                <svg style={{'--i': 1, '--j': 3}}>
                  <g id="inner1">
                    <path fill="#00FFFF" d="M145.949 124.51L148.554 129.259C156.575 124.859 165.672 122.804 174.806 123.331C183.94 123.858 192.741 126.944 200.203 132.236C207.665 137.529 213.488 144.815 217.004 153.261C220.521 161.707 221.59 170.972 220.09 179.997L224.108 180.665L224.102 180.699L229.537 181.607C230.521 175.715 230.594 169.708 229.753 163.795L225.628 164.381C224.987 159.867 223.775 155.429 222.005 151.179C218.097 141.795 211.628 133.699 203.337 127.818C195.045 121.937 185.266 118.508 175.118 117.923C165.302 117.357 155.525 119.474 146.83 124.037C146.535 124.192 146.241 124.349 145.949 124.51ZM224.638 164.522C224.009 160.091 222.819 155.735 221.082 151.563C217.246 142.352 210.897 134.406 202.758 128.634C194.62 122.862 185.021 119.496 175.06 118.922C165.432 118.367 155.841 120.441 147.311 124.914L148.954 127.91C156.922 123.745 165.876 121.814 174.864 122.333C184.185 122.87 193.166 126.019 200.782 131.421C208.397 136.822 214.339 144.257 217.928 152.877C221.388 161.188 222.526 170.276 221.23 179.173L224.262 179.677C224.998 174.671 225.35 169.535 224.638 164.522Z" clip-rule="evenodd" fill-rule="evenodd"></path>
                    <path fill="#00FFFF" d="M139.91 220.713C134.922 217.428 130.469 213.395 126.705 208.758L130.983 205.286L130.985 205.288L134.148 202.721C141.342 211.584 151.417 217.642 162.619 219.839C173.821 222.036 185.438 220.232 195.446 214.742L198.051 219.491C197.759 219.651 197.465 219.809 197.17 219.963C186.252 225.693 173.696 227.531 161.577 225.154C154.613 223.789 148.041 221.08 142.202 217.234L139.91 220.713ZM142.752 216.399C148.483 220.174 154.934 222.833 161.769 224.173C173.658 226.504 185.977 224.704 196.689 219.087L195.046 216.09C185.035 221.323 173.531 222.998 162.427 220.82C151.323 218.643 141.303 212.747 134.01 204.122L131.182 206.5C134.451 210.376 138.515 213.607 142.752 216.399Z" clip-rule="evenodd" fill-rule="evenodd"></path>
                  </g>
                </svg>

                <svg style={{'--i': 2, '--j': 4}}>
                  <path fill="#00FFFF" d="M180.956 186.056C183.849 184.212 186.103 181.521 187.41 178.349C188.717 175.177 189.013 171.679 188.258 168.332C187.503 164.986 185.734 161.954 183.192 159.65C180.649 157.346 177.458 155.883 174.054 155.46C170.649 155.038 167.197 155.676 164.169 157.288C161.14 158.9 158.683 161.407 157.133 164.468C155.582 167.528 155.014 170.992 155.505 174.388C155.997 177.783 157.524 180.944 159.879 183.439L161.129 182.259C159.018 180.021 157.648 177.186 157.207 174.141C156.766 171.096 157.276 167.989 158.667 165.245C160.057 162.5 162.261 160.252 164.977 158.806C167.693 157.36 170.788 156.788 173.842 157.167C176.895 157.546 179.757 158.858 182.037 160.924C184.317 162.99 185.904 165.709 186.581 168.711C187.258 171.712 186.992 174.849 185.82 177.694C184.648 180.539 182.627 182.952 180.032 184.606L180.956 186.056Z" id="center1"></path>
                  <path fill="#00FFFF" d="M172 166.445C175.068 166.445 177.556 168.932 177.556 172C177.556 175.068 175.068 177.556 172 177.556C168.932 177.556 166.444 175.068 166.444 172C166.444 168.932 168.932 166.445 172 166.445ZM172 177.021C174.773 177.021 177.021 174.773 177.021 172C177.021 169.227 174.773 166.979 172 166.979C169.227 166.979 166.979 169.227 166.979 172C166.979 174.773 169.227 177.021 172 177.021Z" id="center"></path>
                </svg>

              </div>
            </section>

            <section className="mb-10 w-full h-full p-12 bg-black flex items-center justify-center">
              <svg
                id="svg-global"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 94 136"
                height="136"
                width="94"
              >
                <path
                  stroke="#4B22B5"
                  d="M87.3629 108.433L49.1073 85.3765C47.846 84.6163 45.8009 84.6163 44.5395 85.3765L6.28392 108.433C5.02255 109.194 5.02255 110.426 6.28392 111.187L44.5395 134.243C45.8009 135.004 47.846 135.004 49.1073 134.243L87.3629 111.187C88.6243 110.426 88.6243 109.194 87.3629 108.433Z"
                  id="line-v1"
                ></path>
                <path
                  stroke="#5728CC"
                  d="M91.0928 95.699L49.2899 70.5042C47.9116 69.6734 45.6769 69.6734 44.2986 70.5042L2.49568 95.699C1.11735 96.5298 1.11735 97.8767 2.49568 98.7074L44.2986 123.902C45.6769 124.733 47.9116 124.733 49.2899 123.902L91.0928 98.7074C92.4712 97.8767 92.4712 96.5298 91.0928 95.699Z"
                  id="line-v2"
                ></path>
                <g id="node-server">
                  <path
                    fill="url(#paint0_linear_204_217)"
                    d="M2.48637 72.0059L43.8699 96.9428C45.742 98.0709 48.281 97.8084 50.9284 96.2133L91.4607 71.7833C92.1444 71.2621 92.4197 70.9139 92.5421 70.1257V86.1368C92.5421 86.9686 92.0025 87.9681 91.3123 88.3825C84.502 92.4724 51.6503 112.204 50.0363 113.215C48.2352 114.343 45.3534 114.343 43.5523 113.215C41.9261 112.197 8.55699 91.8662 2.08967 87.926C1.39197 87.5011 1.00946 86.5986 1.00946 85.4058V70.1257C1.11219 70.9289 1.49685 71.3298 2.48637 72.0059Z"
                  ></path>
                  <path
                    stroke="url(#paint2_linear_204_217)"
                    fill="url(#paint1_linear_204_217)"
                    d="M91.0928 68.7324L49.2899 43.5375C47.9116 42.7068 45.6769 42.7068 44.2986 43.5375L2.49568 68.7324C1.11735 69.5631 1.11735 70.91 2.49568 71.7407L44.2986 96.9356C45.6769 97.7663 47.9116 97.7663 49.2899 96.9356L91.0928 71.7407C92.4712 70.91 92.4712 69.5631 91.0928 68.7324Z"
                  ></path>
                  <mask
                    height="41"
                    width="67"
                    y="50"
                    x="13"
                    maskUnits="userSpaceOnUse"
                    style={{maskType: 'luminance'}}
                    id="mask0_204_217"
                  >
                    <path
                      fill="white"
                      d="M78.3486 68.7324L49.0242 51.0584C47.6459 50.2276 45.4111 50.2276 44.0328 51.0584L14.7084 68.7324C13.3301 69.5631 13.3301 70.91 14.7084 71.7407L44.0328 89.4148C45.4111 90.2455 47.6459 90.2455 49.0242 89.4148L78.3486 71.7407C79.7269 70.91 79.727 69.5631 78.3486 68.7324Z"
                    ></path>
                  </mask>
                  <g mask="url(#mask0_204_217)">
                    <path
                      fill="#332C94"
                      d="M78.3486 68.7324L49.0242 51.0584C47.6459 50.2276 45.4111 50.2276 44.0328 51.0584L14.7084 68.7324C13.3301 69.5631 13.3301 70.91 14.7084 71.7407L44.0328 89.4148C45.4111 90.2455 47.6459 90.2455 49.0242 89.4148L78.3486 71.7407C79.7269 70.91 79.727 69.5631 78.3486 68.7324Z"
                    ></path>
                    <mask
                      height="29"
                      width="48"
                      y="56"
                      x="23"
                      maskUnits="userSpaceOnUse"
                      style={{maskType: 'luminance'}}
                      id="mask1_204_217"
                    >
                      <path
                        fill="white"
                        d="M68.9898 68.7324L49.0242 56.699C47.6459 55.8683 45.4111 55.8683 44.0328 56.699L24.0673 68.7324C22.6889 69.5631 22.6889 70.91 24.0673 71.7407L44.0328 83.7741C45.4111 84.6048 47.6459 84.6048 49.0242 83.7741L68.9898 71.7407C70.3681 70.91 70.3681 69.5631 68.9898 68.7324Z"
                      ></path>
                    </mask>
                    <g mask="url(#mask1_204_217)">
                      <path
                        fill="#5E5E5E"
                        d="M68.9898 68.7324L49.0242 56.699C47.6459 55.8683 45.4111 55.8683 44.0328 56.699L24.0673 68.7324C22.6889 69.5631 22.6889 70.91 24.0673 71.7407L44.0328 83.7741C45.4111 84.6048 47.6459 84.6048 49.0242 83.7741L68.9898 71.7407C70.3681 70.91 70.3681 69.5631 68.9898 68.7324Z"
                      ></path>
                      <path
                        fill="#71B1C6"
                        d="M70.1311 69.3884L48.42 56.303C47.3863 55.6799 45.7103 55.6799 44.6765 56.303L22.5275 69.6523C21.4938 70.2754 21.4938 71.2855 22.5275 71.9086L44.2386 84.994C45.2723 85.617 46.9484 85.617 47.9821 84.994L70.1311 71.6446C71.1648 71.0216 71.1648 70.0114 70.1311 69.3884Z"
                      ></path>
                      <path
                        fill="#80C0D4"
                        d="M70.131 70.8923L48.4199 57.8069C47.3862 57.1839 45.7101 57.1839 44.6764 57.8069L22.5274 71.1562C21.4937 71.7793 21.4937 72.7894 22.5274 73.4125L44.2385 86.4979C45.2722 87.1209 46.9482 87.1209 47.982 86.4979L70.131 73.1486C71.1647 72.5255 71.1647 71.5153 70.131 70.8923Z"
                      ></path>
                      <path
                        fill="#89D3EB"
                        d="M69.751 72.1675L48.4199 59.3111C47.3862 58.6881 45.7101 58.6881 44.6764 59.3111L23.2004 72.2548C22.1667 72.8779 22.1667 73.888 23.2004 74.5111L44.5315 87.3674C45.5653 87.9905 47.2413 87.9905 48.2751 87.3674L69.751 74.4238C70.7847 73.8007 70.7847 72.7905 69.751 72.1675Z"
                      ></path>
                      <path
                        fill="#97E6FF"
                        d="M68.5091 72.9231L48.4199 60.8153C47.3862 60.1922 45.7101 60.1922 44.6764 60.8153L24.8146 72.7861C23.7808 73.4091 23.7808 74.4193 24.8146 75.0424L44.9038 87.1502C45.9375 87.7733 47.6135 87.7733 48.6473 87.1502L68.5091 75.1794C69.5428 74.5563 69.5428 73.5462 68.5091 72.9231Z"
                      ></path>
                      <path
                        fill="#97E6FF"
                        d="M66.6747 73.3219L48.4199 62.3197C47.3862 61.6966 45.7101 61.6966 44.6764 62.3197L26.4412 73.3101C25.4075 73.9332 25.4075 74.9433 26.4412 75.5664L44.696 86.5686C45.7297 87.1917 47.4058 87.1917 48.4395 86.5686L66.6747 75.5782C67.7084 74.9551 67.7084 73.945 66.6747 73.3219Z"
                      ></path>
                    </g>
                    <path
                      stroke-width="0.5"
                      stroke="#F4F4F4"
                      d="M68.9898 68.7324L49.0242 56.699C47.6459 55.8683 45.4111 55.8683 44.0328 56.699L24.0673 68.7324C22.6889 69.5631 22.6889 70.91 24.0673 71.7407L44.0328 83.7741C45.4111 84.6048 47.6459 84.6048 49.0242 83.7741L68.9898 71.7407C70.3681 70.91 70.3681 69.5631 68.9898 68.7324Z"
                    ></path>
                  </g>
                </g>
                <g id="particles">
                  <path
                    fill="url(#paint3_linear_204_217)"
                    d="M43.5482 32.558C44.5429 32.558 45.3493 31.7162 45.3493 30.6778C45.3493 29.6394 44.5429 28.7976 43.5482 28.7976C42.5535 28.7976 41.7471 29.6394 41.7471 30.6778C41.7471 31.7162 42.5535 32.558 43.5482 32.558Z"
                    className="particle p1"
                  ></path>
                  <path
                    fill="url(#paint4_linear_204_217)"
                    d="M50.0323 48.3519C51.027 48.3519 51.8334 47.5101 51.8334 46.4717C51.8334 45.4333 51.027 44.5915 50.0323 44.5915C49.0375 44.5915 48.2311 45.4333 48.2311 46.4717C48.2311 47.5101 49.0375 48.3519 50.0323 48.3519Z"
                    className="particle p2"
                  ></path>
                  <path
                    fill="url(#paint5_linear_204_217)"
                    d="M40.3062 62.6416C41.102 62.6416 41.7471 61.9681 41.7471 61.1374C41.7471 60.3067 41.102 59.6332 40.3062 59.6332C39.5104 59.6332 38.8653 60.3067 38.8653 61.1374C38.8653 61.9681 39.5104 62.6416 40.3062 62.6416Z"
                    className="particle p3"
                  ></path>
                  <path
                    fill="url(#paint6_linear_204_217)"
                    d="M50.7527 73.9229C52.1453 73.9229 53.2743 72.7444 53.2743 71.2906C53.2743 69.8368 52.1453 68.6583 50.7527 68.6583C49.3601 68.6583 48.2311 69.8368 48.2311 71.2906C48.2311 72.7444 49.3601 73.9229 50.7527 73.9229Z"
                    className="particle p4"
                  ></path>
                  <path
                    fill="url(#paint7_linear_204_217)"
                    d="M48.5913 76.9312C49.1882 76.9312 49.672 76.4262 49.672 75.8031C49.672 75.1801 49.1882 74.675 48.5913 74.675C47.9945 74.675 47.5107 75.1801 47.5107 75.8031C47.5107 76.4262 47.9945 76.9312 48.5913 76.9312Z"
                    className="particle p5"
                  ></path>
                  <path
                    fill="url(#paint8_linear_204_217)"
                    d="M52.9153 67.1541C53.115 67.1541 53.2768 66.9858 53.2768 66.7781C53.2768 66.5704 53.115 66.402 52.9153 66.402C52.7156 66.402 52.5538 66.5704 52.5538 66.7781C52.5538 66.9858 52.7156 67.1541 52.9153 67.1541Z"
                    className="particle p6"
                  ></path>
                  <path
                    fill="url(#paint9_linear_204_217)"
                    d="M52.1936 43.8394C52.7904 43.8394 53.2743 43.3344 53.2743 42.7113C53.2743 42.0883 52.7904 41.5832 52.1936 41.5832C51.5967 41.5832 51.1129 42.0883 51.1129 42.7113C51.1129 43.3344 51.5967 43.8394 52.1936 43.8394Z"
                    className="particle p7"
                  ></path>
                  <path
                    fill="url(#paint10_linear_204_217)"
                    d="M57.2367 29.5497C57.8335 29.5497 58.3173 29.0446 58.3173 28.4216C58.3173 27.7985 57.8335 27.2935 57.2367 27.2935C56.6398 27.2935 56.156 27.7985 56.156 28.4216C56.156 29.0446 56.6398 29.5497 57.2367 29.5497Z"
                    className="particle p8"
                  ></path>
                  <path
                    fill="url(#paint11_linear_204_217)"
                    d="M43.9084 34.8144C44.3063 34.8144 44.6289 34.4777 44.6289 34.0623C44.6289 33.647 44.3063 33.3102 43.9084 33.3102C43.5105 33.3102 43.188 33.647 43.188 34.0623C43.188 34.4777 43.5105 34.8144 43.9084 34.8144Z"
                    className="particle p9"
                  ></path>
                </g>
                <g id="reflectores">
                  <path
                    fill-opacity="0.2"
                    fill="url(#paint12_linear_204_217)"
                    d="M49.2037 57.0009L68.7638 68.7786C69.6763 69.3089 69.7967 69.9684 69.794 70.1625V13.7383C69.7649 13.5587 69.6807 13.4657 69.4338 13.3096L48.4832 0.601307C46.9202 -0.192595 46.0788 -0.208238 44.6446 0.601307L23.6855 13.2118C23.1956 13.5876 23.1966 13.7637 23.1956 14.4904L23.246 70.1625C23.2948 69.4916 23.7327 69.0697 25.1768 68.2447L43.9084 57.0008C44.8268 56.4344 45.3776 56.2639 46.43 56.2487C47.5299 56.2257 48.1356 56.4222 49.2037 57.0009Z"
                  ></path>
                  <path
                    fill-opacity="0.2"
                    fill="url(#paint13_linear_204_217)"
                    d="M48.8867 27.6696C49.9674 26.9175 68.6774 14.9197 68.6774 14.9197C69.3063 14.5327 69.7089 14.375 69.7796 13.756V70.1979C69.7775 70.8816 69.505 71.208 68.7422 71.7322L48.9299 83.6603C48.2003 84.1258 47.6732 84.2687 46.5103 84.2995C45.3295 84.2679 44.8074 84.1213 44.0907 83.6603L24.4348 71.8149C23.5828 71.3313 23.2369 71.0094 23.2316 70.1979L23.1884 13.9816C23.1798 14.8398 23.4982 15.3037 24.7518 16.0874C24.7518 16.0874 42.7629 26.9175 44.2038 27.6696C45.6447 28.4217 46.0049 28.4217 46.5452 28.4217C47.0856 28.4217 47.806 28.4217 48.8867 27.6696Z"
                  ></path>
                </g>
                <g id="panel-rigth">
                  <mask fill="white" id="path-26-inside-1_204_217">
                    <path
                      d="M72 91.8323C72 90.5121 72.9268 88.9068 74.0702 88.2467L87.9298 80.2448C89.0731 79.5847 90 80.1198 90 81.44V81.44C90 82.7602 89.0732 84.3656 87.9298 85.0257L74.0702 93.0275C72.9268 93.6876 72 93.1525 72 91.8323V91.8323Z"
                    ></path>
                  </mask>
                  <path
                    fill="#91DDFB"
                    d="M72 91.8323C72 90.5121 72.9268 88.9068 74.0702 88.2467L87.9298 80.2448C89.0731 79.5847 90 80.1198 90 81.44V81.44C90 82.7602 89.0732 84.3656 87.9298 85.0257L74.0702 93.0275C72.9268 93.6876 72 93.1525 72 91.8323V91.8323Z"
                  ></path>
                  <path
                    mask="url(#path-26-inside-1_204_217)"
                    fill="#489CB7"
                    d="M72 89.4419L90 79.0496L72 89.4419ZM90.6928 81.44C90.6928 82.9811 89.6109 84.8551 88.2762 85.6257L74.763 93.4275C73.237 94.3085 72 93.5943 72 91.8323V91.8323C72 92.7107 72.9268 92.8876 74.0702 92.2275L87.9298 84.2257C88.6905 83.7865 89.3072 82.7184 89.3072 81.84L90.6928 81.44ZM72 94.2227V89.4419V94.2227ZM88.2762 80.0448C89.6109 79.2742 90.6928 79.8989 90.6928 81.44V81.44C90.6928 82.9811 89.6109 84.8551 88.2762 85.6257L87.9298 84.2257C88.6905 83.7865 89.3072 82.7184 89.3072 81.84V81.84C89.3072 80.5198 88.6905 79.8056 87.9298 80.2448L88.2762 80.0448Z"
                  ></path>
                  <mask fill="white" id="path-28-inside-2_204_217">
                    <path
                      d="M67 94.6603C67 93.3848 67.8954 91.8339 69 91.1962V91.1962C70.1046 90.5584 71 91.0754 71 92.3509V92.5129C71 93.7884 70.1046 95.3393 69 95.977V95.977C67.8954 96.6147 67 96.0978 67 94.8223V94.6603Z"
                    ></path>
                  </mask>
                  <path
                    fill="#91DDFB"
                    d="M67 94.6603C67 93.3848 67.8954 91.8339 69 91.1962V91.1962C70.1046 90.5584 71 91.0754 71 92.3509V92.5129C71 93.7884 70.1046 95.3393 69 95.977V95.977C67.8954 96.6147 67 96.0978 67 94.8223V94.6603Z"
                  ></path>
                  <path
                    mask="url(#path-28-inside-2_204_217)"
                    fill="#489CB7"
                    d="M67 92.3509L71 90.0415L67 92.3509ZM71.6928 92.5129C71.6928 94.0093 70.6423 95.8288 69.3464 96.577L69.3464 96.577C68.0505 97.3252 67 96.7187 67 95.2223V94.8223C67 95.6559 67.8954 95.8147 69 95.177L69 95.177C69.7219 94.7602 70.3072 93.7465 70.3072 92.9129L71.6928 92.5129ZM67 97.1317V92.3509V97.1317ZM69.2762 91.0367C70.6109 90.2661 71.6928 90.8908 71.6928 92.4319V92.5129C71.6928 94.0093 70.6423 95.8288 69.3464 96.577L69 95.177C69.7219 94.7602 70.3072 93.7465 70.3072 92.9129V92.7509C70.3072 91.4754 69.7219 90.7794 69 91.1962L69.2762 91.0367Z"
                  ></path>
                </g>
                <defs>
                  <linearGradient
                    gradientUnits="userSpaceOnUse"
                    y2="92.0933"
                    x2="92.5421"
                    y1="92.0933"
                    x1="1.00946"
                    id="paint0_linear_204_217"
                  >
                    <stop stop-color="#5727CC"></stop>
                    <stop stop-color="#4354BF" offset="1"></stop>
                  </linearGradient>
                  <linearGradient
                    gradientUnits="userSpaceOnUse"
                    y2="91.1638"
                    x2="6.72169"
                    y1="70"
                    x1="92.5"
                    id="paint1_linear_204_217"
                  >
                    <stop stop-color="#4559C4"></stop>
                    <stop stop-color="#332C94" offset="0.29"></stop>
                    <stop stop-color="#5727CB" offset="1"></stop>
                  </linearGradient>
                  <linearGradient
                    gradientUnits="userSpaceOnUse"
                    y2="85.0762"
                    x2="3.55544"
                    y1="70"
                    x1="92.5"
                    id="paint2_linear_204_217"
                  >
                    <stop stop-color="#91DDFB"></stop>
                    <stop stop-color="#8841D5" offset="1"></stop>
                  </linearGradient>
                  <linearGradient
                    gradientUnits="userSpaceOnUse"
                    y2="32.558"
                    x2="43.5482"
                    y1="28.7976"
                    x1="43.5482"
                    id="paint3_linear_204_217"
                  >
                    <stop stop-color="#5927CE"></stop>
                    <stop stop-color="#91DDFB" offset="1"></stop>
                  </linearGradient>
                  <linearGradient
                    gradientUnits="userSpaceOnUse"
                    y2="48.3519"
                    x2="50.0323"
                    y1="44.5915"
                    x1="50.0323"
                    id="paint4_linear_204_217"
                  >
                    <stop stop-color="#5927CE"></stop>
                    <stop stop-color="#91DDFB" offset="1"></stop>
                  </linearGradient>
                  <linearGradient
                    gradientUnits="userSpaceOnUse"
                    y2="62.6416"
                    x2="40.3062"
                    y1="59.6332"
                    x1="40.3062"
                    id="paint5_linear_204_217"
                  >
                    <stop stop-color="#5927CE"></stop>
                    <stop stop-color="#91DDFB" offset="1"></stop>
                  </linearGradient>
                  <linearGradient
                    gradientUnits="userSpaceOnUse"
                    y2="73.9229"
                    x2="50.7527"
                    y1="68.6583"
                    x1="50.7527"
                    id="paint6_linear_204_217"
                  >
                    <stop stop-color="#5927CE"></stop>
                    <stop stop-color="#91DDFB" offset="1"></stop>
                  </linearGradient>
                  <linearGradient
                    gradientUnits="userSpaceOnUse"
                    y2="76.9312"
                    x2="48.5913"
                    y1="74.675"
                    x1="48.5913"
                    id="paint7_linear_204_217"
                  >
                    <stop stop-color="#5927CE"></stop>
                    <stop stop-color="#91DDFB" offset="1"></stop>
                  </linearGradient>
                  <linearGradient
                    gradientUnits="userSpaceOnUse"
                    y2="67.1541"
                    x2="52.9153"
                    y1="66.402"
                    x1="52.9153"
                    id="paint8_linear_204_217"
                  >
                    <stop stop-color="#5927CE"></stop>
                    <stop stop-color="#91DDFB" offset="1"></stop>
                  </linearGradient>
                  <linearGradient
                    gradientUnits="userSpaceOnUse"
                    y2="43.8394"
                    x2="52.1936"
                    y1="41.5832"
                    x1="52.1936"
                    id="paint9_linear_204_217"
                  >
                    <stop stop-color="#5927CE"></stop>
                    <stop stop-color="#91DDFB" offset="1"></stop>
                  </linearGradient>
                  <linearGradient
                    gradientUnits="userSpaceOnUse"
                    y2="29.5497"
                    x2="57.2367"
                    y1="27.2935"
                    x1="57.2367"
                    id="paint10_linear_204_217"
                  >
                    <stop stop-color="#5927CE"></stop>
                    <stop stop-color="#91DDFB" offset="1"></stop>
                  </linearGradient>
                  <linearGradient
                    gradientUnits="userSpaceOnUse"
                    y2="34.8144"
                    x2="43.9084"
                    y1="33.3102"
                    x1="43.9084"
                    id="paint11_linear_204_217"
                  >
                    <stop stop-color="#5927CE"></stop>
                    <stop stop-color="#91DDFB" offset="1"></stop>
                  </linearGradient>
                  <linearGradient
                    gradientUnits="userSpaceOnUse"
                    y2="16.0743"
                    x2="62.9858"
                    y1="88.5145"
                    x1="67.8638"
                    id="paint12_linear_204_217"
                  >
                    <stop stop-color="#97E6FF"></stop>
                    <stop stop-opacity="0" stop-color="white" offset="1"></stop>
                  </linearGradient>
                  <linearGradient
                    gradientUnits="userSpaceOnUse"
                    y2="39.4139"
                    x2="31.4515"
                    y1="88.0938"
                    x1="36.2597"
                    id="paint13_linear_204_217"
                  >
                    <stop stop-color="#97E6FF"></stop>
                    <stop stop-opacity="0" stop-color="white" offset="1"></stop>
                  </linearGradient>
                </defs>
              </svg>

            </section>

            <section className="mb-10 w-full h-full p-12 bg-black flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" height="200" width="200">
                <g style={{order: -1}}>
                  <polygon
                    transform="rotate(45 100 100)"
                    stroke-width="1"
                    stroke="#d3a410"
                    fill="none"
                    points="70,70 148,50 130,130 50,150"
                    id="bouncer"
                  ></polygon>
                  <polygon
                    transform="rotate(45 100 100)"
                    stroke-width="1"
                    stroke="#d3a410"
                    fill="none"
                    points="70,70 148,50 130,130 50,150"
                    id="bouncer2"
                  ></polygon>
                  <polygon
                    transform="rotate(45 100 100)"
                    stroke-width="2"
                    stroke=""
                    fill="#414750"
                    points="70,70 150,50 130,130 50,150"
                  ></polygon>
                  <polygon
                    stroke-width="2"
                    stroke=""
                    fill="url(#gradiente)"
                    points="100,70 150,100 100,130 50,100"
                  ></polygon>
                  <defs>
                    <linearGradient y2="100%" x2="10%" y1="0%" x1="0%" id="gradiente">
                      <stop style={{stopColor: '#1e2026', stopOpacity: 1}} offset="20%"></stop>
                      <stop style={{stopColor: '#414750', stopOpacity: 1}} offset="60%"></stop>
                    </linearGradient>
                  </defs>
                  <polygon
                    transform="translate(20, 31)"
                    stroke-width="2"
                    stroke=""
                    fill="#b7870f"
                    points="80,50 80,75 80,99 40,75"
                  ></polygon>
                  <polygon
                    transform="translate(20, 31)"
                    stroke-width="2"
                    stroke=""
                    fill="url(#gradiente2)"
                    points="40,-40 80,-40 80,99 40,75"
                  ></polygon>
                  <defs>
                    <linearGradient y2="100%" x2="0%" y1="-17%" x1="10%" id="gradiente2">
                      <stop style={{stopColor: '#d3a51000', stopOpacity: 1}} offset="20%"></stop>
                      <stop
                        style={{stopColor: '#d3a51054', stopOpacity: 1}}
                        offset="100%"
                        id="animatedStop"
                      ></stop>
                    </linearGradient>
                  </defs>
                  <polygon
                    transform="rotate(180 100 100) translate(20, 20)"
                    stroke-width="2"
                    stroke=""
                    fill="#d3a410"
                    points="80,50 80,75 80,99 40,75"
                  ></polygon>
                  <polygon
                    transform="rotate(0 100 100) translate(60, 20)"
                    stroke-width="2"
                    stroke=""
                    fill="url(#gradiente3)"
                    points="40,-40 80,-40 80,85 40,110.2"
                  ></polygon>
                  <defs>
                    <linearGradient y2="100%" x2="10%" y1="0%" x1="0%" id="gradiente3">
                      <stop style={{stopColor: '#d3a51000', stopOpacity: 1}} offset="20%"></stop>
                      <stop
                        style={{stopColor: '#d3a51054', stopOpacity: 1}}
                        offset="100%"
                        id="animatedStop"
                      ></stop>
                    </linearGradient>
                  </defs>
                  <polygon
                    transform="rotate(45 100 100) translate(80, 95)"
                    stroke-width="2"
                    stroke=""
                    fill="#ffe4a1"
                    points="5,0 5,5 0,5 0,0"
                    id="particles"
                  ></polygon>
                  <polygon
                    transform="rotate(45 100 100) translate(80, 55)"
                    stroke-width="2"
                    stroke=""
                    fill="#ccb069"
                    points="6,0 6,6 0,6 0,0"
                    id="particles"
                  ></polygon>
                  <polygon
                    transform="rotate(45 100 100) translate(70, 80)"
                    stroke-width="2"
                    stroke=""
                    fill="#fff"
                    points="2,0 2,2 0,2 0,0"
                    id="particles"
                  ></polygon>
                  <polygon
                    stroke-width="2"
                    stroke=""
                    fill="#292d34"
                    points="29.5,99.8 100,142 100,172 29.5,130"
                  ></polygon>
                  <polygon
                    transform="translate(50, 92)"
                    stroke-width="2"
                    stroke=""
                    fill="#1f2127"
                    points="50,50 120.5,8 120.5,35 50,80"
                  ></polygon>
                </g>
              </svg>

            </section>

            <section className="mb-10 w-full h-full p-12 bg-black flex items-center justify-center">
              <div className="ui-abstergo">
                <div className="abstergo-loader">
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
                <div className="ui-text">
                  Manipulating
                  <div className="ui-dot"></div>
                  <div className="ui-dot"></div>
                  <div className="ui-dot"></div>
                </div>
              </div>
            </section>

            <section className="mb-10 w-full h-full p-12 bg-black flex items-center justify-center">
              <div className="wave-loader">
                <div className="l"></div>
                <div className="l"></div>
                <div className="l"></div>
                <div className="l"></div>
                <div className="l"></div>
                <div className="l"></div>
                <div className="l"></div>
                <div className="l"></div>
                <div className="l"></div>
              </div>
            </section>

            <section className="mb-10 w-full h-full p-12 bg-black flex items-center justify-center">
              <svg viewBox="0 0 240 240" height="240" width="240" className="dots-loader">
                <circle stroke-linecap="round" stroke-dashoffset="-330" stroke-dasharray="0 660" stroke-width="20" stroke="#000" fill="none" r="105" cy="120" cx="120" className="dots-loader-ring dots-loader-ring-a"></circle>
                <circle stroke-linecap="round" stroke-dashoffset="-110" stroke-dasharray="0 220" stroke-width="20" stroke="#000" fill="none" r="35" cy="120" cx="120" className="dots-loader-ring dots-loader-ring-b"></circle>
                <circle stroke-linecap="round" stroke-dasharray="0 440" stroke-width="20" stroke="#000" fill="none" r="70" cy="120" cx="85" className="dots-loader-ring dots-loader-ring-c"></circle>
                <circle stroke-linecap="round" stroke-dasharray="0 440" stroke-width="20" stroke="#000" fill="none" r="70" cy="120" cx="155" className="dots-loader-ring dots-loader-ring-d"></circle>
              </svg>
            </section> */}

            {/* <section className="mb-10 w-full h-full p-12 bg-black flex items-center justify-center">
              <div className="blob-sphere-loader">
                <div className="blob-sphere-loader-inner">
                  <div className="blob-sphere b1"></div>
                  <div className="blob-sphere b2"></div>
                  <div className="blob-sphere b3"></div>
                  <div className="blob-sphere b4"></div>
                  <div className="blob-sphere b5"></div>
                </div>
              </div>
            </section> */}

            {/* <section className="mb-10 w-full h-full p-12 bg-black flex items-center justify-center">
              <div className="wobbling-element" style={{ position: 'relative', margin: '10px' }}>

                <div id="percentageCounter">0%</div>

                <svg width="300" height="300" viewBox="-100 -100 200 200">
                  <mask id="progress-mask">
                    <rect width="300" height="300" />
                    <circle id="progressRing" r="96" fill="none" stroke="#fff" strokeWidth="7" strokeDasharray="100 100" strokeDashoffset="100" pathLength="100" />
                  </mask>
                  <circle className="outer_circle" cx="0" cy="0" r="99" pathLength="64" />
                  <circle className="outer_circle_bars_l" cx="0" cy="0" r="96" pathLength="64" />
                  <circle className="outer_circle_bars_r" cx="0" cy="0" r="96" pathLength="64" />

                  <circle className="inner_progress_circle" mask="url(#progress-mask)" cx="0" cy="0" r="96" pathLength="64" transform="rotate(-90 0 0)" />

                  <circle className="inner_half_circle" cx="0" cy="0" r="80" pathLength="50" />

                  <circle className="center_outer_circle" cx="0" cy="0" r="73" pathLength="50" />

                  <circle className="center_inner_circle_second" cx="0" cy="0" r="67" pathLength="100" />

                  <circle className="center_inner_circle_3" cx="0" cy="0" r="65" pathLength="100" />

                  <circle className="center_inner_circle_3_dashed_verticle" cx="0" cy="0" r="61" pathLength="64" />

                  <circle className="center_inner_circle_3_dashed" cx="0" cy="0" r="61" pathLength="100" />

                  <circle className="center_inner_circle_2" cx="0" cy="0" r="58" pathLength="100" />

                  <circle className="center_inner_circle_1" cx="0" cy="0" r="55" pathLength="100" />

                  <circle className="center_inner_circle_0" cx="0" cy="0" r="35" pathLength="40" />

                  <rect className="small_rectangles" x="-1.5" y="-68" width="4" height="4" rx="1" />
                  <rect className="small_rectangles" x="-2.5" y="64" width="4" height="4" rx="1" />
                  <rect className="small_rectangles" x="-68" y="-2.5" width="4" height="4" rx="1" />
                  <rect className="small_rectangles" x="64" y="-1.5" width="4" height="4" rx="1" />
                  <rect className="small_rectangles" x="-48" y="-49" width="4" height="4" rx="1" />
                  <rect className="small_rectangles" x="45" y="-48" width="4" height="4" rx="1" />
                  <rect className="small_rectangles" x="45" y="46" width="4" height="4" rx="1" />
                  <rect className="small_rectangles" x="-49" y="44" width="4" height="4" rx="1" />

                </svg>

              </div>
            </section> */}

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
                // Hidden during AdSense review — re-enable when the blog returns.
                // {
                //   label: 'Read the media blog',
                //   to: '/blog',
                //   description: 'Video compression, image optimization, audio quality, and metadata guides.',
                // },
              ]}
            />
          </div>
        </CardContent>
      </Card>
      <div className="max-w-7xl mx-auto px-4 pb-8">
        <AdBanner
          adSlot={AD_SLOTS.about_footer}
          adFormat="leaderboard"
          adPosition="about_footer"
          className="mt-8"
          utmMedium="about_footer_leaderboard"
        />
      </div>
    </>
  );
};

export default AboutPage;
