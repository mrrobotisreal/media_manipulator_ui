import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import AdBanner from '@/components/ad-banner';
import EmbeddedToolPanel from '@/components/embedded-tool-panel';
import RelatedLinks from '@/components/related-links';
import mixpanel from 'mixpanel-browser';

const AudioGettingStartedTutorial: React.FC = () => {
  useEffect(() => {
    mixpanel.track('Page View', {
      page_name: 'Tutorial - Audio Getting Started',
      page_path: '/tutorials/audio/getting-started',
      user_tier: 'free',
    });
  }, []);

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 pt-4">
        <AdBanner
          adSlot="6671038874"
          adFormat="leaderboard"
          adPosition="tutorial_audio_header"
          className="mb-4"
          isFlashMock={true}
          utmMedium="tutorials_audio_leaderboard"
          utmCampaign="creatv_launch_promo"
          linkURL="https://www.creatv.io/auth"
        />
      </div>
      <Card className="max-w-7xl mx-auto my-2 sci-fi-frame">
        <CardContent className="p-12 prose prose-invert max-w-none text-muted-foreground">
          <p className="text-sm uppercase tracking-wide text-green-600 font-medium">Audio Tutorial</p>
          <h1 className="text-4xl font-bold mb-3 text-card-foreground">Getting Started: Converting Audio Files</h1>
          <p className="text-lg mb-8">
            Learn how to convert, clean, and remix audio files with Media Manipulator's audio converter. This tutorial walks through every section of the audio conversion panel — format selection, processing effects, restoration, and the new AI audio tools (Clean Voice, Remove Background Noise, Isolate Vocals, Remove Vocals).
          </p>

          <h2 className="text-2xl font-semibold mb-3 text-card-foreground">1. Upload your audio file</h2>
          <p className="mb-4">
            From the home page, drag and drop an audio file into the upload zone, or click <strong>Choose File</strong>. Supported inputs include MP3, WAV, FLAC, AAC, M4A, OGG, Opus, and most common podcast and music formats. Files are deleted automatically within 24 hours.
          </p>
          <p className="mb-4">
            Once the file is selected, the right-hand panel switches to <strong>Conversion Options</strong>. For video and audio files you'll also see a <strong>Convert / Transcribe</strong> toggle — leave it on <em>Convert</em> for this tutorial.
          </p>

          <EmbeddedToolPanel
            defaultMediaKind="audio"
            title="Try the audio converter without leaving this page"
            description="Pick an audio file and convert it right here. The settings below mirror the homepage converter, so you can follow the rest of the tutorial as you experiment."
          />

          <h2 className="text-2xl font-semibold mb-3 text-card-foreground">2. Pick the output format</h2>
          <p className="mb-4">
            The <strong>Format</strong> dropdown sets the container and codec for your output file. The audio converter supports:
          </p>
          <ul className="list-disc pl-6 space-y-1 mb-4">
            <li><strong>MP3</strong> — universal compatibility, lossy, small file sizes.</li>
            <li><strong>WAV</strong> — uncompressed PCM, ideal for masters, editing, or archiving.</li>
            <li><strong>AAC</strong> — efficient lossy codec used by Apple devices and streaming.</li>
            <li><strong>OGG</strong> — open-source Vorbis container.</li>
            <li><strong>FLAC / ALAC</strong> — lossless compression for archival quality at smaller size than WAV.</li>
            <li><strong>Opus</strong> — modern lossy codec great for voice and low bitrates.</li>
            <li><strong>AC3 / DTS</strong> — surround-capable formats often used for video soundtracks.</li>
          </ul>
          <p className="mb-4">
            Need help choosing? Our <Link to="/blog/audio/audio-quality-guide" className="text-blue-600 hover:text-blue-800">audio quality guide</Link> covers when to use each codec.
          </p>

          <h2 className="text-2xl font-semibold mb-3 text-card-foreground">3. Set bitrate, sample rate, and channels</h2>
          <p className="mb-4">
            <strong>Bitrate</strong> controls quality vs. file size for lossy formats. 128 kbps is "good enough" for podcasts; 192–256 kbps is a strong default for music; 320 kbps is the maximum MP3 quality. Lossless formats (WAV, FLAC, ALAC) ignore this setting.
          </p>
          <p className="mb-4">
            <strong>Sample rate</strong> sets how many audio samples per second the file contains. Standard music is 44.1 kHz; pro audio and video typically use 48 kHz. Higher rates (96 kHz, 192 kHz) only matter for professional production.
          </p>
          <p className="mb-4">
            <strong>Channels</strong> can be mono, stereo, 5.1, or 7.1. Choose mono for voice memos or single-mic recordings to halve the file size; stereo is the default for music; 5.1/7.1 are for surround soundtracks.
          </p>

          <h2 className="text-2xl font-semibold mb-3 text-card-foreground">4. Adjust speed, volume, and trim</h2>
          <p className="mb-4">
            <strong>Speed Multiplier</strong> changes playback tempo from 0.25x to 4x without altering pitch — useful for sped-up podcasts or slowed-down practice tracks. <strong>Volume Multiplier</strong> applies a simple gain factor between 0.1x and 2x.
          </p>
          <p className="mb-4">
            Click <strong>Trim Audio</strong> to scrub through the waveform and pick a start and end time. Only the selected segment is encoded into the output file.
          </p>

          <h2 className="text-2xl font-semibold mb-3 text-card-foreground">5. AI Audio Tools (recommended)</h2>
          <p className="mb-4">
            The <strong>AI Audio Tools</strong> panel is the fastest path to a great-sounding result for voice and music. Each operation runs on our local GPU server (no data leaves our infrastructure):
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>
              <strong>Clean Voice</strong> — denoises with DeepFilterNet and then runs a broadcast-style polish chain (high-pass, low-pass, loudness normalization, brick-wall limiter). Best for podcast/voiceover takes recorded in noisy rooms.
            </li>
            <li>
              <strong>Remove Background Noise</strong> — DeepFilterNet denoise without the polish chain. Use this when you want to preserve the natural EQ and dynamics of the recording.
            </li>
            <li>
              <strong>Isolate Vocals</strong> — runs Demucs htdemucs and outputs the vocal stem only. Output defaults to WAV so you don't lose detail.
            </li>
            <li>
              <strong>Remove Vocals / Karaoke</strong> — same Demucs job, but exports the instrumental stem. Great for karaoke tracks or sample workflows.
            </li>
          </ul>
          <p className="mb-4">
            When you pick any AI operation, the standard FFmpeg chain (bitrate, EQ, reverb, etc.) is skipped for that job so the AI tool has a clean input/output path. AI jobs may take longer than basic conversion because they run on the GPU.
          </p>

          <h2 className="text-2xl font-semibold mb-3 text-card-foreground">6. Advanced Audio Effects</h2>
          <p className="mb-4">
            Expand <strong>Advanced Audio Effects</strong> to access four collapsible groups when you want manual control instead of an AI operation:
          </p>
          <ul className="list-disc pl-6 space-y-1 mb-4">
            <li><strong>Basic Audio Processing</strong> — normalize, amplify (dB), fade in/out, EQ presets (bass boost, treble boost, vocal, classical, rock, jazz), pan, balance, stereo width, mono conversion, channel swap.</li>
            <li><strong>Time-Based Effects</strong> — reverb (room, hall, plate, spring), delay (echo, multi-tap, ping-pong), modulation (chorus, flanger, phaser, tremolo, vibrato).</li>
            <li><strong>Restoration &amp; Cleanup</strong> — spectral/adaptive/gate noise reduction, 50/60 Hz de-hum, declipper, silence detection and removal.</li>
            <li><strong>Advanced Audio</strong> — pitch shifting (semitones, formant-preserving), time stretching (factor + pitch/time/formant algorithm), spatial audio (binaural, surround, 3D).</li>
          </ul>

          <h2 className="text-2xl font-semibold mb-3 text-card-foreground">7. Convert and download</h2>
          <p className="mb-4">
            Click <strong>Convert File</strong>. A real-time progress bar appears as the server processes the job. When it finishes, the result auto-previews and a <strong>Download</strong> button appears. The file is also added to your in-session <em>Conversion History</em> so you can revisit or download it later without re-running the job.
          </p>

          <h2 className="text-2xl font-semibold mb-3 text-card-foreground">Tips for great audio output</h2>
          <ul className="list-disc pl-6 space-y-1 mb-4">
            <li>For voice recordings, try <strong>Clean Voice</strong> first — it solves most "muddy podcast" problems in one click.</li>
            <li>If you only want to remove a constant hum or air-conditioner background, use <strong>Remove Background Noise</strong> to keep the original tone.</li>
            <li>For stems, keep the default <strong>WAV</strong> output — converting Demucs output to a lossy format defeats the purpose of separation.</li>
            <li>Big bitrate jumps don't help small files much; pair 320 kbps with 48 kHz only for high-quality music exports.</li>
          </ul>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link to="/" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Try the Audio Converter
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
            intro="Jump straight into the audio tool you need, or keep learning with related guides."
            links={[
              {
                label: 'Audio converter',
                to: '/tools/audio-converter',
                description: 'Convert WAV, MP3, FLAC, M4A, OGG, and more.',
              },
              {
                label: 'Convert WAV to MP3',
                to: '/tools/convert-wav-to-mp3',
                description: 'Shrink large WAV recordings into widely playable MP3s.',
              },
              {
                label: 'Isolate vocals from a song',
                to: '/tools/isolate-vocals-from-song',
                description: 'Extract vocals from music for remixes or analysis.',
              },
              {
                label: 'Audio quality guide',
                to: '/blog/audio/audio-quality-guide',
                description: 'How bitrate, sample rate, and codec choice affect quality.',
              },
              {
                label: 'Video converter tutorial',
                to: '/tutorials/video/getting-started',
                description: 'Convert, compress, trim, and transcribe video files.',
              },
              {
                label: 'How Media Manipulator works',
                to: '/how-it-works',
                description: 'See how AI audio jobs run on a local GPU server.',
              },
            ]}
          />
        </CardContent>
      </Card>
      <div className="max-w-6xl mx-auto px-4 pb-8">
        <AdBanner
          adSlot="3633827902"
          adFormat="leaderboard"
          adPosition="tutorial_audio_footer"
          className="mt-8"
          isFlashMock={true}
          utmMedium="tutorials_audio_footer_leaderboard"
          utmCampaign="creatv_launch_promo"
          linkURL="https://www.creatv.io/auth"
        />
      </div>
    </>
  );
};

export default AudioGettingStartedTutorial;
