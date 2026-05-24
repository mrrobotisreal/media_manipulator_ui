import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import AdBanner from '@/components/ad-banner';
import { Music, Image as ImageIcon, Video as VideoIcon } from 'lucide-react';
import { AD_SLOTS } from '@/lib/adSlots';

interface Tutorial {
  title: string;
  excerpt: string;
  readTime: string;
  slug: string;
}

interface Category {
  id: 'audio' | 'video' | 'image';
  title: string;
  description: string;
  icon: React.ReactNode;
  tutorials: Tutorial[];
  bannerSlot: string;
}

const categories: Category[] = [
  {
    id: 'audio',
    title: 'How to use the Audio Converter',
    description:
      'Convert audio files between MP3, WAV, FLAC, OGG, and more. Apply EQ, reverb, denoise, vocal isolation, and other audio AI tools.',
    icon: <Music className="w-7 h-7 text-blue-600" />,
    bannerSlot: AD_SLOTS.tutorials_index_audio_banner,
    tutorials: [
      {
        title: 'Getting Started: Converting Audio Files',
        excerpt:
          "A complete walkthrough of the audio converter — file format selection, bitrate, sample rate, channel layout, trimming, EQ presets, restoration effects, and the Clean Voice / Isolate Vocals / Remove Vocals / Remove Background Noise AI tools.",
        readTime: '10 min read',
        slug: 'audio/getting-started',
      },
    ],
  },
  {
    id: 'video',
    title: 'How to use the Video Converter',
    description:
      'Convert and edit video files between MP4, WebM, MOV, MKV, ProRes, and more. Trim, resize, apply filters and transforms, and transcribe with subtitles.',
    icon: <VideoIcon className="w-7 h-7 text-green-600" />,
    bannerSlot: AD_SLOTS.tutorials_index_video_banner,
    tutorials: [
      {
        title: 'Getting Started: Converting Video Files',
        excerpt:
          'Step-by-step guide to the video converter — output format, codecs, quality presets, dimensions, trim, color correction, motion blur, artistic filters, stabilization, frame-rate conversion, and video transcription with VTT/TXT/JSON output.',
        readTime: '12 min read',
        slug: 'video/getting-started',
      },
      {
        title: 'What Is AI Frame Interpolation? How Video FPS Smoothing Works',
        excerpt:
          'How AI frame interpolation generates new in-between frames for smoother motion, when to pick 48/60/120fps, common artifacts, and how to run the AI Frame Interpolation tool.',
        readTime: '9 min read',
        slug: 'ai-frame-interpolation',
      },
    ],
  },
  {
    id: 'image',
    title: 'How to use the Image Converter',
    description:
      'Convert images between JPG, PNG, WebP, and GIF. Resize, crop, apply filters, add text overlays, manage metadata, and run AI tools like Face Blur, Remove Background, AI Upscale, and Redact Text.',
    icon: <ImageIcon className="w-7 h-7 text-purple-600" />,
    bannerSlot: AD_SLOTS.tutorials_index_image_banner,
    tutorials: [
      {
        title: 'Getting Started: Converting Image Files',
        excerpt:
          'Complete tutorial on the image converter — picking a format, quality, dimensions, cropping, filters, tint, text overlays, EXIF / IPTC / GPS metadata, and the Face Privacy, Remove Background, AI Upscale, and Redact Text AI tools.',
        readTime: '10 min read',
        slug: 'image/getting-started',
      },
    ],
  },
];

const TutorialsPage: React.FC = () => {
  return (
    <>
      <div className="max-w-7xl mx-auto px-4 pt-4">
        <AdBanner
          adSlot={AD_SLOTS.tutorials_index_header}
          adFormat="leaderboard"
          adPosition="tutorials_index_header"
          utmMedium="tutorials_index_header_leaderboard"
        />
      </div>
      <Card className="max-w-7xl mx-auto my-2 sci-fi-frame">
        <CardContent className="p-12">
          <h1 className="text-4xl font-bold mb-4 text-card-foreground">Media Manipulator Tutorials</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Step-by-step guides for every Media Manipulator tool. Whether you're converting a single MP3, batch-resizing PNGs, redacting faces from a photo, or pulling vocals out of a music track, the tutorials below walk you through every option in the right-hand conversion panel.
          </p>

          <div className="grid gap-10">
            {categories.map((category) => (
              <React.Fragment key={category.id}>
                <section className="bg-card p-6 sci-fi-frame-inner">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="shrink-0 mt-1">{category.icon}</div>
                    <div>
                      <h2 className="text-2xl font-semibold text-card-foreground">{category.title}</h2>
                      <p className="text-muted-foreground mt-1">{category.description}</p>
                    </div>
                  </div>

                  <div className="grid gap-4 mt-4">
                    {category.tutorials.map((tutorial) => (
                      <article
                        key={tutorial.slug}
                        className="bg-card p-5 hover:shadow-lg transition-shadow sci-fi-frame-inner-inner"
                      >
                        <h3 className="text-xl font-semibold mb-2 text-card-foreground hover:text-green-600">
                          <Link to={`/tutorials/${tutorial.slug}`}>{tutorial.title}</Link>
                        </h3>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
                          <span>{tutorial.readTime}</span>
                        </div>
                        <p className="text-muted-foreground mb-4">{tutorial.excerpt}</p>
                        <Link
                          to={`/tutorials/${tutorial.slug}`}
                          className="text-green-600 hover:text-green-700 font-medium"
                        >
                          Read tutorial →
                        </Link>
                      </article>
                    ))}
                  </div>
                </section>

                {/* 468x60 banner ad between topic sections */}
                <div className="flex justify-center">
                  <AdBanner
                    adSlot={category.bannerSlot}
                    adFormat="banner"
                    adPosition={`tutorials_index_${category.id}_banner`}
                    utmMedium={`tutorials_index_${category.id}_banner`}
                  />
                </div>
              </React.Fragment>
            ))}
          </div>

          <div className="mt-10 bg-card p-6 sci-fi-frame-green">
            <h2 className="text-2xl font-semibold mb-3 text-card-foreground">New to Media Manipulator?</h2>
            <p className="text-muted-foreground mb-4">
              Start with our high-level overview to see everything the platform can do, then jump into a tutorial that matches the kind of file you're working with.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/how-it-works"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                How it Works
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
          </div>
        </CardContent>
      </Card>
      <div className="max-w-7xl mx-auto px-4 pb-8">
        <AdBanner
          adSlot={AD_SLOTS.tutorials_index_footer}
          adFormat="leaderboard"
          adPosition="tutorials_index_footer"
          className="mt-8"
          utmMedium="tutorials_index_footer_leaderboard"
        />
      </div>
    </>
  );
};

export default TutorialsPage;
