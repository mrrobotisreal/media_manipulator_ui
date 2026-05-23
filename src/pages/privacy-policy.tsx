import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <Card className="max-w-7xl mx-auto my-2 sci-fi-frame">
      <CardContent className="p-12">
        <h1 className="text-4xl font-bold mb-8 text-card-foreground">Privacy Policy</h1>

        <div className="prose max-w-none text-muted-foreground">
          <p className="mb-2">Effective Date: 2026-05-14</p>
          <p className="mb-6">Last Updated: 2026-05-14</p>

          <p className="mb-4">
            Media Manipulator is owned and operated by CreaTV Ltd. (“CreaTV,” “Media Manipulator,” “we,” “us,” or “our”). Media Manipulator provides browser-based and server-assisted tools for editing, converting, compressing, analyzing, transcribing, summarizing, and otherwise processing image, video, and audio files.
          </p>

          <blockquote className="border-l-4 border-muted-foreground/30 pl-4 italic mb-4">
            Where Media Manipulator uses AI-assisted features, those AI systems run locally on our own servers or infrastructure that we control and are not outsourced to third-party AI providers.
          </blockquote>

          <p className="mb-4">
            This Privacy Policy explains how we collect, use, store, protect, and delete information when you use our website, tools, and related services.
          </p>

          <p className="mb-6">
            By using Media Manipulator, you agree to the practices described in this Privacy Policy.
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-card-foreground">1. Information We Collect</h2>
            <p className="mb-4">We collect information in several ways depending on how you use the website.</p>

            <h3 className="text-xl font-semibold mb-3 text-card-foreground">1.1 Files You Upload</h3>
            <p className="mb-4">
              When you upload an image, video, audio file, or other supported media file to Media Manipulator, we may temporarily process that file to provide the requested tool functionality, such as:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>converting a file to another format;</li>
              <li>cropping, trimming, resizing, compressing, filtering, or editing media;</li>
              <li>extracting or displaying metadata;</li>
              <li>removing metadata;</li>
              <li>generating transcripts, captions, summaries, descriptions, or other AI-assisted outputs;</li>
              <li>creating downloadable processed files;</li>
              <li>maintaining temporary session conversion history so you can download recent conversions during your session.</li>
            </ul>
            <p className="mb-4">
              Uploaded files and generated outputs are stored temporarily for a maximum of 24 hours, unless deleted sooner. After that period, they are deleted from our active systems.
            </p>

            <h3 className="text-xl font-semibold mb-3 text-card-foreground">1.2 File and Conversion Metadata</h3>
            <p className="mb-4">We may collect technical information about uploaded files and conversion jobs, including:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>file name;</li>
              <li>file type or MIME type;</li>
              <li>file size;</li>
              <li>file duration, dimensions, bitrate, codec, or other technical properties;</li>
              <li>conversion settings selected by the user;</li>
              <li>generated output format;</li>
              <li>job status, processing errors, and timestamps;</li>
              <li>temporary file identifiers or session identifiers.</li>
            </ul>
            <p className="mb-4">
              We use this information to operate the service, troubleshoot failed conversions, maintain temporary session history, improve performance, detect abuse, and protect the website.
            </p>

            <h3 className="text-xl font-semibold mb-3 text-card-foreground">1.3 Content Scanning and Safety Review</h3>
            <p className="mb-4">
              All uploads may be subject to automated scanning and classification for security, abuse prevention, brand safety, advertiser protection, and detection or blocking of suspected illegal or prohibited content.
            </p>
            <p className="mb-4">These scans may be used to identify or help prevent content involving, for example:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>suspected child sexual abuse material or exploitation;</li>
              <li>malware, malicious files, or harmful code;</li>
              <li>content that appears to violate applicable law;</li>
              <li>content that violates our Terms of Service or Acceptable Use rules;</li>
              <li>adult, sexually explicit, graphic, violent, or otherwise advertiser-sensitive content.</li>
            </ul>
            <p className="mb-4">
              If content is determined or suspected to be illegal, prohibited, abusive, or unsafe, we may block processing, delete the file, prevent display of previews, restrict access to generated outputs, preserve limited records where legally required, or report the content to appropriate authorities if required by law.
            </p>
            <p className="mb-4">
              If content is lawful but classified as adult, graphic, violent, or otherwise advertiser-sensitive, we may prevent that content from being displayed or previewed on the website in order to protect users, our brand, and advertisers. In some cases, where lawful and technically available, the user may still be able to download the processed file.
            </p>
            <p className="mb-4">
              Users are solely responsible for the files they upload and for ensuring they have all rights, permissions, and legal authority necessary to process those files using Media Manipulator.
            </p>

            <h3 className="text-xl font-semibold mb-3 text-card-foreground">1.4 Usage Data</h3>
            <p className="mb-4">When you visit or use Media Manipulator, we may automatically collect usage and device information, such as:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>pages visited;</li>
              <li>tools used;</li>
              <li>buttons clicked;</li>
              <li>approximate location based on IP address;</li>
              <li>browser type and version;</li>
              <li>operating system;</li>
              <li>device type;</li>
              <li>referral source;</li>
              <li>timestamps;</li>
              <li>diagnostic logs;</li>
              <li>error logs;</li>
              <li>performance data;</li>
              <li>analytics events.</li>
            </ul>
            <p className="mb-4">
              We use this information to understand how users use the website, improve features, diagnose issues, prevent abuse, and measure website performance.
            </p>

            <h3 className="text-xl font-semibold mb-3 text-card-foreground">1.5 Cookies and Similar Technologies</h3>
            <p className="mb-4">
              We and our service providers may use cookies, local storage, pixels, tags, and similar technologies to:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>operate the website;</li>
              <li>remember user preferences;</li>
              <li>maintain session functionality;</li>
              <li>analyze traffic and usage;</li>
              <li>detect abuse or security risks;</li>
              <li>serve and measure advertisements.</li>
            </ul>
            <p className="mb-4">
              You can control cookies through your browser settings. Some features may not work properly if cookies or local storage are disabled.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-card-foreground">2. How We Use Information</h2>
            <p className="mb-4">We use the information we collect to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>provide media conversion, editing, transcription, metadata, AI analysis, and related tools;</li>
              <li>temporarily store conversion history for up to 24 hours;</li>
              <li>allow users to download recent converted files during a session;</li>
              <li>scan uploads for suspected illegal, prohibited, abusive, or advertiser-sensitive content;</li>
              <li>protect users, advertisers, our website, and our brand;</li>
              <li>prevent fraud, abuse, spam, malware, and security incidents;</li>
              <li>debug errors and improve service reliability;</li>
              <li>analyze traffic and usage trends;</li>
              <li>improve our website, tools, user experience, and performance;</li>
              <li>comply with legal obligations;</li>
              <li>enforce our Terms of Service and Acceptable Use rules.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-card-foreground">3. File Storage and Deletion</h2>
            <p className="mb-4">
              Uploaded files and generated outputs are stored temporarily for a maximum of 24 hours to support session conversion history and allow users to download recent conversions.
            </p>
            <p className="mb-4">
              After the temporary retention period expires, uploaded files and generated outputs are deleted from active storage.
            </p>
            <p className="mb-4">
              We may retain limited technical logs, security records, abuse-prevention records, analytics records, or legal compliance records for longer where reasonably necessary to operate the service, protect against abuse, enforce our policies, comply with law, resolve disputes, or maintain security. These records are not intended to preserve full uploaded media files after the 24-hour temporary storage period.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-card-foreground">4. AI Processing</h2>
            <p className="mb-4">
              Some Media Manipulator features may use automated systems or AI-assisted tools to process uploaded media, metadata, audio, video, text, transcripts, captions, descriptions, summaries, or other content.
            </p>
            <p className="mb-4">AI-assisted features may be used to:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>transcribe audio or video;</li>
              <li>generate captions;</li>
              <li>summarize content;</li>
              <li>describe images, videos, or audio;</li>
              <li>classify content for safety or brand-suitability;</li>
              <li>detect suspected illegal, prohibited, abusive, adult, violent, graphic, or otherwise advertiser-sensitive content;</li>
              <li>help prevent misuse of the service.</li>
            </ul>
            <p className="mb-4">
              All AI processing used by Media Manipulator is performed locally on our own servers or infrastructure that we control. We do not outsource uploaded files, generated outputs, transcripts, summaries, descriptions, or content-safety scans to third-party AI providers for processing.
            </p>
            <p className="mb-4">
              This means that when AI features are used, your uploaded files and generated outputs remain within Media Manipulator’s processing environment and are handled according to the storage, retention, deletion, and security practices described in this Privacy Policy.
            </p>
            <p className="mb-4">
              Uploaded files and generated outputs are stored temporarily for a maximum of 24 hours to support session conversion history and allow users to download recent conversions. After that period, they are deleted from our active systems unless earlier deletion occurs or limited retention is legally required for security, abuse prevention, legal compliance, or enforcement purposes.
            </p>
            <p className="mb-4">
              AI-generated outputs may be imperfect, incomplete, or inaccurate. Users are responsible for reviewing any AI-generated output before relying on it.
            </p>
            <p className="mb-4">
              We do not use uploaded files to publicly identify users. We do not claim ownership of uploaded files. We do not sell uploaded files or generated outputs. We do not provide uploaded files or generated outputs to third-party AI providers for model training or AI processing.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-card-foreground">5. Advertising</h2>
            <p className="mb-4">
              Media Manipulator may display advertisements, including advertisements served by Google AdSense or other advertising partners.
            </p>
            <p className="mb-4">
              Third-party vendors, including Google, may use cookies to serve ads based on a user’s prior visits to Media Manipulator or other websites. Google’s use of advertising cookies enables it and its partners to serve ads to users based on their visit to Media Manipulator and/or other sites on the Internet.
            </p>
            <p className="mb-4">
              Users may opt out of personalized advertising by visiting Google’s Ads Settings. Users may also opt out of some third-party vendors’ use of cookies for personalized advertising by visiting industry opt-out pages where available.
            </p>
            <p className="mb-4">
              Advertising partners may collect or receive information from our website and other websites and use that information to provide measurement services and targeted ads.
            </p>
            <p className="mb-4">
              We do not control third-party advertising cookies or tracking technologies. Their use is governed by the privacy policies of the third parties that provide them.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-card-foreground">6. Analytics</h2>
            <p className="mb-4">
              We may use analytics services to understand how visitors use Media Manipulator, measure traffic, improve features, and diagnose performance issues.
            </p>
            <p className="mb-4">
              Analytics data may include pages visited, tools used, approximate location, browser and device information, referral sources, session activity, and other usage information.
            </p>
            <p className="mb-4">
              We use analytics to improve Media Manipulator and to understand which tools and content are most useful to visitors.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-card-foreground">7. Legal Basis for Processing</h2>
            <p className="mb-4">
              Depending on where you are located, we may process personal information based on one or more legal bases, including:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>providing the service requested by the user;</li>
              <li>our legitimate interests in operating, securing, improving, and monetizing the website;</li>
              <li>compliance with legal obligations;</li>
              <li>user consent where required, including for certain cookies, analytics, personalized advertising, or AI-related processing.</li>
            </ul>
            <p className="mb-4">
              Where required by law, we will request consent before using certain cookies or personalized advertising technologies.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-card-foreground">8. Sharing Information</h2>
            <p className="mb-4">We may share information with:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>hosting and cloud infrastructure providers;</li>
              <li>file storage and processing providers;</li>
              <li>analytics providers;</li>
              <li>advertising partners;</li>
              <li>security, abuse-detection, and content-safety providers;</li>
              <li>AI processing is performed locally on our own servers or infrastructure that we control, and we do not share uploaded files, generated outputs, transcripts, summaries, descriptions, or content-safety scans with third-party AI providers for AI processing;</li>
              <li>payment processors, if paid accounts are introduced;</li>
              <li>law enforcement, regulators, or authorities when required by law or when necessary to report suspected illegal content;</li>
              <li>professional advisors, such as attorneys, accountants, or security consultants;</li>
              <li>business successors in the event of a merger, acquisition, financing, reorganization, or sale of assets.</li>
            </ul>
            <p className="mb-4">We do not sell uploaded files.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-card-foreground">9. User Responsibilities</h2>
            <p className="mb-4">
              Users are responsible for the content they upload, process, convert, edit, transcribe, summarize, or download through Media Manipulator.
            </p>
            <p className="mb-4">Users must not upload content that:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>they do not own or have permission to process;</li>
              <li>infringes copyrights, trademarks, privacy rights, publicity rights, or other legal rights;</li>
              <li>contains child sexual abuse material or exploitation;</li>
              <li>contains malware, viruses, or harmful code;</li>
              <li>is illegal to possess, process, upload, distribute, or transmit;</li>
              <li>violates our Terms of Service or Acceptable Use rules.</li>
            </ul>
            <p className="mb-4">Use of Media Manipulator does not transfer ownership of uploaded content to us.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-card-foreground">10. Security</h2>
            <p className="mb-4">
              We use reasonable technical and organizational measures designed to protect uploaded files, generated outputs, logs, and other information from unauthorized access, misuse, loss, or disclosure.
            </p>
            <p className="mb-4">
              However, no online service, storage system, or transmission method is completely secure. Users should avoid uploading highly sensitive, confidential, or legally restricted content unless they understand and accept the risks.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-card-foreground">11. Children’s Privacy</h2>
            <p className="mb-4">
              Media Manipulator is not intended for children under the age of 13, or the minimum age required by applicable law in the user’s jurisdiction.
            </p>
            <p className="mb-4">
              We do not knowingly collect personal information from children. If we learn that we have collected personal information from a child without appropriate consent, we will take steps to delete it.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-card-foreground">12. International Users</h2>
            <p className="mb-4">
              Media Manipulator may be operated from the United States or other locations. If you access the website from outside the United States, your information may be processed in countries that may have different data protection laws than your country of residence.
            </p>
            <p className="mb-4">
              By using Media Manipulator, you understand that your information may be transferred to and processed in the United States or other jurisdictions.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-card-foreground">13. Your Choices and Rights</h2>
            <p className="mb-4">
              Depending on your location, you may have rights regarding your personal information, such as the right to:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>request access to personal information we maintain about you;</li>
              <li>request correction or deletion;</li>
              <li>object to or restrict certain processing;</li>
              <li>withdraw consent where processing is based on consent;</li>
              <li>opt out of certain advertising or analytics technologies;</li>
              <li>request a copy of your information.</li>
            </ul>
            <p className="mb-4">
              Because uploaded files and generated outputs are temporary and are deleted after a maximum of 24 hours, we may not be able to retrieve or provide access to files after deletion.
            </p>
            <p className="mb-4">To make a privacy request, contact us using the information below.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-card-foreground">14. Do Not Track</h2>
            <p className="mb-4">
              Some browsers offer “Do Not Track” signals. There is no universally accepted standard for how websites should respond to these signals. Media Manipulator does not currently respond to Do Not Track signals.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-card-foreground">15. Changes to This Privacy Policy</h2>
            <p className="mb-4">
              We may update this Privacy Policy from time to time. When we make changes, we will update the “Last Updated” date at the top of this page.
            </p>
            <p className="mb-4">
              If we make material changes, we may provide additional notice, such as by posting a notice on the website.
            </p>
            <p className="mb-4">
              Your continued use of Media Manipulator after changes are posted means you accept the updated Privacy Policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-card-foreground">16. Contact Us</h2>
            <p className="mb-4">
              If you have questions about this Privacy Policy or how Media Manipulator handles information, contact us at:
            </p>
            <p className="mb-2">Media Manipulator is a product and service operated by CreaTV Ltd.</p>
            <p className="mb-1">CreaTV Ltd.</p>
            <p className="mb-1">Operating as Media Manipulator</p>
            <p className="mb-1">Colorado, USA</p>
            <p className="mb-1">
              Email:{' '}
              <a href="mailto:privacy@media-manipulator.com" className="text-blue-600 hover:text-blue-800">
                privacy@media-manipulator.com
              </a>
            </p>
            <p className="mb-1">
              Website:{' '}
              <a href="https://www.media-manipulator.com" className="text-blue-600 hover:text-blue-800">
                https://www.media-manipulator.com
              </a>
            </p>
          </section>
        </div>
      </CardContent>
    </Card>
  );
};

export default PrivacyPolicyPage;
