import React, { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import mixpanel from 'mixpanel-browser';

const PrivacyPolicyPage: React.FC = () => {
  useEffect(() => {
    mixpanel.track('Page View', {
      page_name: 'Privacy Policy',
      page_path: '/privacy-policy',
      user_tier: 'free'
    });
  }, []);

  return (
    <Card className="max-w-4xl mx-auto my-2">
      <CardContent className="p-6">
        <h1 className="text-4xl font-bold mb-8 text-card-foreground">Privacy Policy</h1>

        <div className="prose max-w-none text-muted-foreground">
          <p className="text-lg mb-6">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-card-foreground">Information We Collect</h2>
            <p className="mb-4">
              We collect information you provide directly to us when you use our file conversion services:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Files you upload for conversion</li>
              <li>Usage data and analytics (anonymized)</li>
              <li>Device and browser information</li>
              <li>IP address and general location data</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-card-foreground">How We Use Your Information</h2>
            <p className="mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Process your file conversions</li>
              <li>Improve our services and user experience</li>
              <li>Monitor and analyze usage patterns</li>
              <li>Ensure security and prevent abuse</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-card-foreground">File Storage and Deletion</h2>
            <p className="mb-4">
              Your privacy is our priority:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Files are automatically deleted within 1 hour of upload</li>
              <li>We do not permanently store your converted files</li>
              <li>File content is never analyzed or shared with third parties</li>
              <li>All processing happens on secure, encrypted servers</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-card-foreground">Third-Party Services</h2>
            <p className="mb-4">
              We may use third-party services for:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Analytics (Google Analytics) - anonymized data only</li>
              <li>Advertising partners - no personal data shared</li>
              <li>CDN and hosting services</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-card-foreground">Data Security</h2>
            <p className="mb-4">
              We implement appropriate security measures including:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>HTTPS encryption for all data transmission</li>
              <li>Secure server infrastructure</li>
              <li>Regular security audits and updates</li>
              <li>Limited access to user data</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-card-foreground">Your Rights</h2>
            <p className="mb-4">
              You have the right to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Know what data we collect and how it's used</li>
              <li>Request deletion of your data</li>
              <li>Opt out of analytics tracking</li>
              <li>Contact us with privacy concerns</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-card-foreground">Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at{' '}
              <a href="mailto:mitchellwintrow@gmail.com" className="text-blue-600 hover:text-blue-800">
                mitchellwintrow@gmail.com
              </a>
            </p>
          </section>
        </div>
      </CardContent>
    </Card>
  );
};

export default PrivacyPolicyPage;