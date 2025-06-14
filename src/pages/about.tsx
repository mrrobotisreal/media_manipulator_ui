import React, { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
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
    <Card className="max-w-4xl mx-auto my-2">
      <CardContent className="p-6">
        <h1 className="text-4xl font-bold mb-8 text-card-foreground">About Media Manipulator Pro</h1>

        <div className="prose max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Media Manipulator Pro was created to solve the everyday problem of file format compatibility.
            Whether you're a content creator, web developer, or just someone who needs to convert files
            quickly and reliably, our platform provides professional-grade conversion tools that are
            both powerful and easy to use.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Why Choose Us?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-card border rounded-lg p-6">
              <h3 className="font-semibold mb-2">Lightning Fast Processing</h3>
              <p className="text-muted-foreground">Our optimized conversion engines process your files quickly without compromising quality.</p>
            </div>
            <div className="bg-card border rounded-lg p-6">
              <h3 className="font-semibold mb-2">Privacy First</h3>
              <p className="text-muted-foreground">Your files are automatically deleted after conversion. We never store or share your content.</p>
            </div>
            <div className="bg-card border rounded-lg p-6">
              <h3 className="font-semibold mb-2">Professional Quality</h3>
              <p className="text-muted-foreground">Advanced algorithms ensure your converted files maintain optimal quality and compression.</p>
            </div>
            <div className="bg-card border rounded-lg p-6">
              <h3 className="font-semibold mb-2">No Software Required</h3>
              <p className="text-muted-foreground">Everything runs in your browser. No downloads, installations, or software updates needed.</p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Supported Formats</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold mb-2 text-blue-600">Images</h3>
              <ul className="text-muted-foreground space-y-1">
                <li>JPEG/JPG</li>
                <li>PNG</li>
                <li>WebP</li>
                <li>GIF</li>
                <li>BMP</li>
                <li>TIFF</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-green-600">Videos</h3>
              <ul className="text-muted-foreground space-y-1">
                <li>MP4</li>
                <li>WebM</li>
                <li>AVI</li>
                <li>MOV</li>
                <li>WMV</li>
                <li>FLV</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-purple-600">Audio</h3>
              <ul className="text-muted-foreground space-y-1">
                <li>MP3</li>
                <li>WAV</li>
                <li>AAC</li>
                <li>OGG</li>
                <li>FLAC</li>
                <li>M4A</li>
              </ul>
            </div>
          </div>
        </section>
        </div>
      </CardContent>
    </Card>
  );
};

export default AboutPage;