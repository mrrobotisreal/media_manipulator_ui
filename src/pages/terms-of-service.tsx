import { Card, CardContent } from '@/components/ui/card';

const TermsOfServicePage: React.FC = () => {
  return (
    <Card className="max-w-4xl mx-auto my-2">
      <CardContent className="p-6">
        <h1 className="text-4xl font-bold mb-8 text-card-foreground">Terms of Service</h1>

        <div className="prose max-w-none text-muted-foreground">
          <p className="text-lg mb-6">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-card-foreground">Acceptance of Terms</h2>
            <p className="mb-4">
              By accessing and using Media Manipulator Pro ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-card-foreground">Use License</h2>
            <p className="mb-4">
              Permission is granted to temporarily download one copy of the materials on Media Manipulator Pro for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose or for any public display</li>
              <li>Attempt to reverse engineer any software contained on the Service</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-card-foreground">File Upload Restrictions</h2>
            <p className="mb-4">
              When using our file conversion service, you agree that:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>You own or have the right to convert the files you upload</li>
              <li>Your files do not contain illegal, harmful, or copyrighted content</li>
              <li>You will not upload malicious files or attempt to harm our systems</li>
              <li>File sizes must be within our specified limits</li>
              <li>You will not use our service for automated or bulk processing without permission</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-card-foreground">Service Availability</h2>
            <p className="mb-4">
              We strive to provide reliable service but cannot guarantee:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Uninterrupted access to the Service</li>
              <li>Error-free operation</li>
              <li>Compatibility with all file types or formats</li>
              <li>Specific conversion quality or processing times</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-card-foreground">Prohibited Uses</h2>
            <p className="mb-4">
              You may not use our Service:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>For any unlawful purpose or to solicit others to unlawful acts</li>
              <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
              <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
              <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
              <li>To submit false or misleading information</li>
              <li>To upload or transmit viruses or any other type of malicious code</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-card-foreground">Disclaimer</h2>
            <p className="mb-4">
              The materials on Media Manipulator Pro are provided on an 'as is' basis. Media Manipulator Pro makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-card-foreground">Limitations</h2>
            <p className="mb-4">
              In no event shall Media Manipulator Pro or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Media Manipulator Pro, even if Media Manipulator Pro or a Media Manipulator Pro authorized representative has been notified orally or in writing of the possibility of such damage.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-card-foreground">Revisions</h2>
            <p className="mb-4">
              Media Manipulator Pro may revise these terms of service at any time without notice. By using this Service, you are agreeing to be bound by the then current version of these terms of service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-card-foreground">Contact Information</h2>
            <p>
              If you have any questions about these Terms of Service, please contact us at{' '}
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

export default TermsOfServicePage;