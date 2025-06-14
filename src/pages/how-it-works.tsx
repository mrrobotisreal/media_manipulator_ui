import React, { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import mixpanel from 'mixpanel-browser';

const HowItWorksPage: React.FC = () => {
  useEffect(() => {
    mixpanel.track('Page View', {
      page_name: 'How It Works',
      page_path: '/how-it-works',
      user_tier: 'free'
    });
  }, []);

  return (
    <Card className="max-w-4xl mx-auto my-2">
      <CardContent className="p-6">
        <h1 className="text-4xl font-bold mb-8 text-card-foreground">How Media Conversion Works</h1>

        <div className="grid gap-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">The Conversion Process</h2>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">1</span>
                </div>
                <h3 className="font-semibold mb-2">Upload</h3>
                <p className="text-muted-foreground">Drag and drop your file or click to browse</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-600">2</span>
                </div>
                <h3 className="font-semibold mb-2">Configure</h3>
                <p className="text-muted-foreground">Choose output format and quality settings</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-purple-600">3</span>
                </div>
                <h3 className="font-semibold mb-2">Convert</h3>
                <p className="text-muted-foreground">Our servers process your file securely</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-orange-600">4</span>
                </div>
                <h3 className="font-semibold mb-2">Download</h3>
                <p className="text-muted-foreground">Get your converted file instantly</p>
              </div>
            </div>
          </section>

          <section className="bg-card border rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Technical Details</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Security & Privacy</h3>
                <ul className="text-muted-foreground space-y-1">
                  <li>• All uploads use HTTPS encryption</li>
                  <li>• Files are automatically deleted after 1 hour</li>
                  <li>• No file content is stored or analyzed</li>
                  <li>• Processing happens on secure servers</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Quality & Performance</h3>
                <ul className="text-muted-foreground space-y-1">
                  <li>• Advanced encoding algorithms</li>
                  <li>• Optimized for speed and quality</li>
                  <li>• Support for high-resolution content</li>
                  <li>• Batch processing capabilities</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </CardContent>
    </Card>
  );
};

export default HowItWorksPage;
