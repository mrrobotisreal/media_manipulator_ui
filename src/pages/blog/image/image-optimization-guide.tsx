import React, { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import mixpanel from 'mixpanel-browser';

const ImageOptimizationGuide: React.FC = () => {
  useEffect(() => {
    mixpanel.track('Page View', {
      page_name: 'Image Optimization Guide',
      page_path: '/blog/image/image-optimization-guide',
      user_tier: 'free'
    });
  }, []);

  return (
    <Card className="max-w-4xl mx-auto my-2">
      <CardContent className="p-6 text-center">
        <div className="py-16">
          <h1 className="text-4xl font-bold mb-8 text-card-foreground">
            Image Optimization for Web: JPEG vs PNG vs WebP
          </h1>

          <div className="text-6xl mb-8">🚧</div>

          <h2 className="text-3xl font-semibold mb-6 text-card-foreground">
            Coming Soon 🛠️
          </h2>

          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            We're working hard to bring you the complete guide to image optimization!
            This comprehensive article will cover everything you need to know about
            choosing the right image format for your website to improve loading speeds
            and user experience.
          </p>

          <div className="bg-muted/50 rounded-lg p-6 mb-8 max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold mb-4 text-card-foreground">What to Expect:</h3>
            <ul className="text-muted-foreground space-y-2">
              <li>📸 JPEG vs PNG vs WebP comparison</li>
              <li>🎯 When to use each format</li>
              <li>⚡ Optimization techniques for web</li>
              <li>🔍 Quality vs file size balance</li>
              <li>🛠️ Tools and best practices</li>
            </ul>
          </div>

          <p className="text-sm text-muted-foreground">
            Expected publication: Soon™️
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ImageOptimizationGuide;
