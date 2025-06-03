import React from 'react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-card rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-card-foreground">Privacy Policy</h1>
      <div className="space-y-6 text-card-foreground">

        <section>
          <h2 className="text-2xl font-semibold mb-3">1. Information We Collect</h2>
          <div className="space-y-3">
            <h3 className="text-lg font-medium">1.1 Analytics Data</h3>
            <p className="text-muted-foreground">
              We use Firebase Analytics and Google Analytics to collect information about how you use our service:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Pages visited and time spent on each page</li>
              <li>File types uploaded and converted</li>
              <li>Device information (browser type, operating system)</li>
              <li>General location information (country/region)</li>
              <li>User interactions with features</li>
            </ul>

            <h3 className="text-lg font-medium mt-4">1.2 File Data</h3>
            <p className="text-muted-foreground">
              Files you upload are processed temporarily and automatically deleted after conversion. We do not store your personal files permanently.
            </p>

            <h3 className="text-lg font-medium mt-4">1.3 Cookies and Similar Technologies</h3>
            <p className="text-muted-foreground">
              We use cookies and similar technologies for:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Analytics and performance monitoring</li>
              <li>Advertising personalization (Google AdSense)</li>
              <li>Remembering your preferences</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">2. How We Use Your Information</h2>
          <ul className="list-disc list-inside text-muted-foreground space-y-2">
            <li>To provide and improve our file conversion services</li>
            <li>To analyze usage patterns and optimize user experience</li>
            <li>To display relevant advertisements through Google AdSense</li>
            <li>To monitor and analyze app performance</li>
            <li>To comply with legal obligations</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">3. Third-Party Services</h2>
          <div className="space-y-3">
            <h3 className="text-lg font-medium">3.1 Google Services</h3>
            <p className="text-muted-foreground">
              We use the following Google services:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li><strong>Firebase Analytics:</strong> For app analytics and user behavior tracking</li>
              <li><strong>Google Analytics:</strong> For web analytics and user insights</li>
              <li><strong>Google AdSense:</strong> For displaying advertisements</li>
            </ul>
            <p className="text-muted-foreground mt-2">
              These services have their own privacy policies. Please review:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li><a href="https://policies.google.com/privacy" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Google Privacy Policy</a></li>
              <li><a href="https://firebase.google.com/policies/analytics" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Firebase Privacy Policy</a></li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">4. Advertising</h2>
          <p className="text-muted-foreground">
            We display advertisements through Google AdSense. Google may use cookies to display ads based on your visits to this site and other sites. You can opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Google's Ad Settings</a>.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">5. Data Retention</h2>
          <ul className="list-disc list-inside text-muted-foreground space-y-2">
            <li><strong>Uploaded Files:</strong> Deleted immediately after processing (typically within 1 hour)</li>
            <li><strong>Analytics Data:</strong> Retained for up to 26 months as per Google Analytics default settings</li>
            <li><strong>Cookies:</strong> Expire according to their individual settings (typically 30 days to 2 years)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">6. Your Rights</h2>
          <p className="text-muted-foreground mb-3">
            Depending on your location, you may have the following rights:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-2">
            <li>Right to access your personal data</li>
            <li>Right to rectify inaccurate data</li>
            <li>Right to erasure ("right to be forgotten")</li>
            <li>Right to restrict processing</li>
            <li>Right to data portability</li>
            <li>Right to object to processing</li>
            <li>Right to withdraw consent</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">7. Cookies Management</h2>
          <p className="text-muted-foreground mb-3">
            You can control cookies through your browser settings:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-2">
            <li>Block all cookies</li>
            <li>Allow only first-party cookies</li>
            <li>Delete cookies after each session</li>
            <li>Get notified before cookies are set</li>
          </ul>
          <p className="text-muted-foreground mt-3">
            Note: Blocking cookies may affect the functionality of our service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">8. Data Security</h2>
          <p className="text-muted-foreground">
            We implement appropriate technical and organizational measures to protect your data:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-2">
            <li>HTTPS encryption for all data transmission</li>
            <li>Secure file processing and automatic deletion</li>
            <li>Regular security assessments</li>
            <li>Limited access to personal data</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">9. International Data Transfers</h2>
          <p className="text-muted-foreground">
            Your data may be processed in countries outside your home country, including the United States where Google's servers are located. We ensure adequate protection through appropriate safeguards.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">10. Children's Privacy</h2>
          <p className="text-muted-foreground">
            Our service is not intended for children under 13. We do not knowingly collect personal information from children under 13. If you believe we have collected such information, please contact us immediately.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">11. Changes to This Policy</h2>
          <p className="text-muted-foreground">
            We may update this privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page and updating the "Last Updated" date.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">12. Contact Us</h2>
          <p className="text-muted-foreground">
            If you have any questions about this privacy policy or our data practices, please contact us at:
          </p>
          <div className="mt-3 p-4 bg-muted rounded-lg">
            <p className="text-muted-foreground">
              <strong>Email:</strong> privacy@yourdomain.com<br />
              <strong>Address:</strong> [Your Business Address]
            </p>
          </div>
        </section>

        <section className="border-t pt-6">
          <p className="text-sm text-muted-foreground">
            <strong>Last Updated:</strong> {new Date().toLocaleDateString()}
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;