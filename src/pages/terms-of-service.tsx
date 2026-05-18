import React, { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import mixpanel from 'mixpanel-browser';

const TermsOfServicePage: React.FC = () => {
  useEffect(() => {
    mixpanel.track('Page View', {
      page_name: 'Terms of Service',
      page_path: '/terms-of-service',
      user_tier: 'free'
    });
  }, []);

  return (
    <Card className="max-w-7xl mx-auto my-2 sci-fi-frame">
      <CardContent className="p-12">
        <h1 className="text-4xl font-bold mb-8 text-card-foreground">
          Terms of Service and Acceptable Use Policy
        </h1>

        <div className="prose max-w-none text-muted-foreground">
          <p className="mb-2">Effective Date: 2026-05-14</p>
          <p className="mb-6">Last Updated: 2026-05-14</p>

          <p className="mb-4">
            Media Manipulator is owned and operated by CreaTV Ltd. (“CreaTV,” “Media Manipulator,” “we,” “us,” or “our”).
          </p>

          <p className="mb-4">
            These Terms of Service and Acceptable Use Policy (“Terms”) govern your access to and use of Media Manipulator, including our website, browser-based tools, server-assisted processing tools, media conversion tools, image tools, video tools, audio tools, metadata tools, AI-assisted features, downloadable outputs, and related services.
          </p>

          <p className="mb-6">
            By accessing or using Media Manipulator, you agree to these Terms. If you do not agree to these Terms, do not use Media Manipulator.
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-card-foreground">1. The Service</h2>
            <p className="mb-4">
              Media Manipulator provides tools for editing, converting, compressing, cropping, trimming, filtering, analyzing, transcribing, summarizing, describing, and otherwise processing image, video, audio, and related media files.
            </p>
            <p className="mb-4">Features may include, but are not limited to:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>image conversion, cropping, resizing, compression, and filtering;</li>
              <li>video trimming, cutting, splicing, conversion, compression, and formatting;</li>
              <li>audio cleanup, conversion, compression, and processing;</li>
              <li>metadata and EXIF inspection;</li>
              <li>metadata and EXIF removal;</li>
              <li>AI-assisted transcription, caption generation, summaries, and descriptions;</li>
              <li>content-safety classification and abuse-prevention scanning;</li>
              <li>temporary conversion history and downloadable processed outputs.</li>
            </ul>
            <p className="mb-4">
              Some features may be browser-based, while others may require temporary upload and processing on our servers.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-card-foreground">2. Ownership and Operator</h2>
            <p className="mb-2">Media Manipulator is a product and service operated by CreaTV Ltd.</p>
            <p className="mb-1">CreaTV Ltd.</p>
            <p className="mb-1">Operating as Media Manipulator</p>
            <p className="mb-1">Colorado, USA</p>
            <p className="mb-1">
              Email:{' '}
              <a href="mailto:support@media-manipulator.com" className="text-blue-600 hover:text-blue-800">
                support@media-manipulator.com
              </a>
            </p>
            <p className="mb-1">
              Website:{' '}
              <a href="https://www.media-manipulator.com" className="text-blue-600 hover:text-blue-800">
                https://www.media-manipulator.com
              </a>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-card-foreground">3. Eligibility</h2>
            <p className="mb-4">
              You may use Media Manipulator only if you are legally able to enter into a binding agreement and only in compliance with these Terms and all applicable laws.
            </p>
            <p className="mb-4">
              Media Manipulator is not intended for children under the age of 13, or the minimum age required by applicable law in your jurisdiction. By using the service, you represent that you are old enough to use Media Manipulator under applicable law.
            </p>
            <p className="mb-4">
              If you use Media Manipulator on behalf of a company, organization, or other entity, you represent that you have authority to bind that entity to these Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-card-foreground">4. Your Responsibility for Uploaded Content</h2>
            <p className="mb-4">
              You are solely responsible for all files, media, metadata, text, prompts, instructions, inputs, outputs, and other content that you upload, submit, process, convert, edit, transcribe, summarize, generate, download, or otherwise use through Media Manipulator (“User Content”).
            </p>
            <p className="mb-4">You represent and warrant that:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>you own your User Content or have all rights, licenses, permissions, and authority necessary to upload, process, convert, edit, analyze, transcribe, summarize, download, and otherwise use it through Media Manipulator;</li>
              <li>your use of Media Manipulator will not violate any copyright, trademark, privacy right, publicity right, contractual right, or other legal right of any person or entity;</li>
              <li>your User Content and use of Media Manipulator will comply with these Terms and all applicable laws;</li>
              <li>you will not use Media Manipulator to create, process, store, transform, conceal, distribute, or facilitate illegal, abusive, infringing, harmful, or prohibited content.</li>
            </ul>
            <p className="mb-4">
              We do not claim ownership of your uploaded files or generated outputs. However, you grant us a limited, temporary, non-exclusive license to host, process, analyze, scan, transform, convert, store, display, and make your User Content available as necessary to provide Media Manipulator, protect the service, enforce these Terms, comply with law, and operate related security and abuse-prevention systems.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-card-foreground">5. Temporary Storage and Deletion</h2>
            <p className="mb-4">
              Uploaded files and generated outputs may be stored temporarily for a maximum of 24 hours to support session conversion history and allow you to download recent conversions during your session.
            </p>
            <p className="mb-4">
              After the temporary retention period expires, uploaded files and generated outputs are deleted from our active systems, unless earlier deletion occurs or limited retention is legally required or reasonably necessary for security, abuse prevention, legal compliance, dispute resolution, or enforcement of these Terms.
            </p>
            <p className="mb-4">
              We may retain limited technical logs, security records, abuse-prevention records, analytics records, or legal compliance records for longer than 24 hours where reasonably necessary. These records are not intended to preserve full uploaded media files after the temporary retention period.
            </p>
            <p className="mb-4">
              You are responsible for downloading and backing up any processed files you wish to keep. Media Manipulator is not a permanent storage, backup, archive, or hosting service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-card-foreground">6. Local AI Processing</h2>
            <p className="mb-4">
              Media Manipulator may use AI-assisted systems to provide features such as transcription, caption generation, summaries, descriptions, metadata analysis, media classification, and content-safety scanning.
            </p>
            <p className="mb-4">
              All AI processing used by Media Manipulator is performed locally on our own servers or infrastructure that we control. We do not outsource uploaded files, generated outputs, transcripts, summaries, descriptions, or content-safety scans to third-party AI providers for AI processing.
            </p>
            <p className="mb-4">AI-assisted features may be used to:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>transcribe audio or video;</li>
              <li>generate captions;</li>
              <li>summarize content;</li>
              <li>describe images, videos, or audio;</li>
              <li>classify content for safety or brand suitability;</li>
              <li>detect suspected illegal, prohibited, abusive, adult, violent, graphic, or otherwise advertiser-sensitive content;</li>
              <li>help prevent misuse of the service.</li>
            </ul>
            <p className="mb-4">
              AI-generated outputs may be inaccurate, incomplete, misleading, or otherwise imperfect. You are responsible for reviewing any AI-generated output before relying on it.
            </p>
            <p className="mb-4">
              You must not use AI-assisted features to create, alter, enhance, conceal, distribute, or facilitate illegal, abusive, infringing, deceptive, sexually exploitative, violent, hateful, or otherwise prohibited content.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-card-foreground">7. Content Scanning and Safety Enforcement</h2>
            <p className="mb-4">
              All uploads may be subject to automated scanning, classification, and review for security, abuse prevention, legal compliance, brand safety, advertiser protection, and detection or blocking of suspected illegal or prohibited content.
            </p>
            <p className="mb-4">These scans may be used to identify or help prevent content involving, for example:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>suspected child sexual abuse material, child exploitation, or sexualization of minors;</li>
              <li>malware, malicious files, viruses, or harmful code;</li>
              <li>illegal content or activity;</li>
              <li>non-consensual intimate imagery;</li>
              <li>threats, harassment, abuse, or violent intimidation;</li>
              <li>terrorist or extremist content;</li>
              <li>hateful or discriminatory content;</li>
              <li>graphic violence, gore, or shocking content;</li>
              <li>adult, sexually explicit, or pornographic content;</li>
              <li>content that appears to violate intellectual property rights;</li>
              <li>content that violates these Terms or our Acceptable Use Policy.</li>
            </ul>
            <p className="mb-4">
              If content is determined or suspected to be illegal, prohibited, abusive, unsafe, or in violation of these Terms, we may take any action we consider appropriate, including:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>blocking upload, processing, conversion, preview, display, or download;</li>
              <li>deleting the uploaded file or generated output;</li>
              <li>disabling access to the service;</li>
              <li>preserving limited records where legally required or reasonably necessary;</li>
              <li>reporting suspected illegal content to appropriate authorities where required or permitted by law;</li>
              <li>cooperating with legal process, law enforcement, regulators, or safety organizations where appropriate.</li>
            </ul>
            <p className="mb-4">
              If content is lawful but classified as adult, graphic, violent, shocking, or otherwise advertiser-sensitive, we may prevent that content from being displayed or previewed on the website in order to protect users, our brand, and advertisers. In some cases, where lawful and technically available, you may still be able to download the processed file.
            </p>
            <p className="mb-4">
              We are not obligated to monitor all content, but we reserve the right to do so.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-card-foreground">8. Acceptable Use Policy</h2>
            <p className="mb-4">
              You agree not to use Media Manipulator for any unlawful, harmful, abusive, deceptive, infringing, exploitative, or prohibited purpose.
            </p>

            <h3 className="text-xl font-semibold mb-3 text-card-foreground">8.1 Illegal Content and Activity</h3>
            <p className="mb-4">
              You must not upload, process, convert, edit, generate, download, or otherwise use Media Manipulator in connection with content or activity that is illegal under applicable law.
            </p>
            <p className="mb-4">This includes, but is not limited to:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>child sexual abuse material, child exploitation, or sexualization of minors;</li>
              <li>non-consensual intimate imagery;</li>
              <li>human trafficking, sexual exploitation, or coercive sexual content;</li>
              <li>credible threats of violence;</li>
              <li>instructions or facilitation for violent wrongdoing;</li>
              <li>terrorist, extremist, or organized criminal activity;</li>
              <li>illegal weapons activity;</li>
              <li>illegal drug trafficking;</li>
              <li>fraud, scams, phishing, or impersonation;</li>
              <li>malware, viruses, credential theft, or harmful code;</li>
              <li>attempts to conceal, launder, transform, or distribute illegal material.</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 text-card-foreground">8.2 Child Safety</h3>
            <p className="mb-4">
              You must not upload, process, convert, edit, generate, download, or otherwise use Media Manipulator in connection with any content that exploits, abuses, sexualizes, endangers, or harms minors.
            </p>
            <p className="mb-4">
              We have zero tolerance for child sexual abuse material or child exploitation. Suspected violations may be reported to appropriate authorities where required or permitted by law.
            </p>

            <h3 className="text-xl font-semibold mb-3 text-card-foreground">8.3 Adult and Sexually Explicit Content</h3>
            <p className="mb-4">
              You must not use Media Manipulator to create, alter, enhance, process, distribute, or facilitate sexually explicit, pornographic, exploitative, or non-consensual sexual content in violation of applicable law or these Terms.
            </p>
            <p className="mb-4">You must not use Media Manipulator to create or facilitate:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>non-consensual intimate imagery;</li>
              <li>sexual deepfakes;</li>
              <li>synthetic sexual content involving real people without consent;</li>
              <li>sexualized content involving minors;</li>
              <li>content promoting sexual exploitation or coercion;</li>
              <li>tools, edits, or transformations intended to undress, sexualize, or exploit a person.</li>
            </ul>
            <p className="mb-4">
              Media Manipulator is not an adult-content service and may block, suppress previews of, delete, or restrict content classified as adult, sexually explicit, or advertiser-sensitive.
            </p>

            <h3 className="text-xl font-semibold mb-3 text-card-foreground">8.4 Violence, Gore, and Graphic Content</h3>
            <p className="mb-4">
              You must not use Media Manipulator to create, process, enhance, distribute, or facilitate content that promotes, glorifies, instructs, or encourages violence, self-harm, torture, abuse, or graphic injury.
            </p>
            <p className="mb-4">
              We may restrict, suppress previews of, block, or delete graphic, violent, shocking, or gore-related content, even if the underlying content may be lawful, in order to protect users, our brand, and advertisers.
            </p>

            <h3 className="text-xl font-semibold mb-3 text-card-foreground">8.5 Hate, Harassment, and Abuse</h3>
            <p className="mb-4">
              You must not use Media Manipulator to create, process, distribute, or facilitate content that promotes hatred, harassment, abuse, discrimination, dehumanization, or violence against individuals or groups based on protected characteristics or other sensitive attributes.
            </p>
            <p className="mb-4">
              You must not use Media Manipulator to threaten, stalk, harass, intimidate, dox, impersonate, or abuse another person.
            </p>

            <h3 className="text-xl font-semibold mb-3 text-card-foreground">8.6 Copyright, Trademark, and Intellectual Property</h3>
            <p className="mb-4">
              You must not upload, process, convert, edit, transcribe, summarize, distribute, or download content unless you own the content or have the necessary rights and permissions.
            </p>
            <p className="mb-4">You must not use Media Manipulator to:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>infringe copyrights, trademarks, trade secrets, privacy rights, publicity rights, or other legal rights;</li>
              <li>bypass digital rights management, copy protection, access controls, or paywalls;</li>
              <li>rip, download, transform, or redistribute movies, TV shows, music, software, courses, livestreams, or other protected works without permission;</li>
              <li>remove, obscure, or alter watermarks, copyright notices, attribution, or rights-management information for infringing purposes;</li>
              <li>facilitate piracy or unauthorized distribution of protected works.</li>
            </ul>
            <p className="mb-4">
              Media Manipulator is intended for processing files you own, files you created, files you are authorized to edit, or files that are lawfully available for your intended use.
            </p>

            <h3 className="text-xl font-semibold mb-3 text-card-foreground">8.7 Privacy and Personal Data</h3>
            <p className="mb-4">
              You must not use Media Manipulator to violate another person’s privacy or data protection rights.
            </p>
            <p className="mb-4">
              You must not upload or process highly sensitive personal data, confidential information, private images, private videos, biometric identifiers, government identification documents, medical records, financial records, or other sensitive information unless you have the legal right and authority to do so.
            </p>
            <p className="mb-4">
              You must not use Media Manipulator to expose, extract, publish, exploit, or misuse private information about another person.
            </p>

            <h3 className="text-xl font-semibold mb-3 text-card-foreground">8.8 Security and Abuse</h3>
            <p className="mb-4">
              You must not interfere with, disrupt, attack, overload, scrape, reverse engineer, bypass, or misuse Media Manipulator or its infrastructure.
            </p>
            <p className="mb-4">You must not:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>attempt unauthorized access to our systems;</li>
              <li>probe, scan, or test vulnerabilities without written permission;</li>
              <li>bypass rate limits, authentication, usage limits, paywalls, or technical restrictions;</li>
              <li>automate abusive traffic;</li>
              <li>use bots, scrapers, or automated tools in a way that harms the service;</li>
              <li>upload malware, viruses, malicious scripts, or harmful payloads;</li>
              <li>interfere with other users’ access to the service;</li>
              <li>abuse temporary file storage or conversion history;</li>
              <li>use the service as a file-hosting, file-sharing, CDN, malware analysis, or permanent storage system.</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 text-card-foreground">8.9 Advertising and Invalid Traffic</h3>
            <p className="mb-4">
              Media Manipulator may display advertisements. You must not interact with ads in a fraudulent, artificial, deceptive, or abusive way.
            </p>
            <p className="mb-4">You must not:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>click advertisements for the purpose of generating revenue for us;</li>
              <li>encourage others to click advertisements;</li>
              <li>use bots, scripts, automated tools, click farms, paid traffic schemes, or deceptive methods to generate ad impressions or ad clicks;</li>
              <li>attempt to manipulate advertising systems, measurement, attribution, or reporting;</li>
              <li>interfere with ad display, ad measurement, or advertiser safety systems.</li>
            </ul>
            <p className="mb-4">
              If you believe an ad is misleading, harmful, or inappropriate, you should report it through the available ad controls or contact us.
            </p>

            <h3 className="text-xl font-semibold mb-3 text-card-foreground">8.10 No Deceptive Download or Conversion Behavior</h3>
            <p className="mb-4">
              You must not use Media Manipulator to create or facilitate deceptive download buttons, fake update prompts, fake virus warnings, misleading conversion flows, fake system dialogs, or content designed to trick users into clicking ads, downloading unwanted software, or visiting unwanted websites.
            </p>
            <p className="mb-4">
              Media Manipulator’s real download buttons, conversion buttons, and user interface controls are intended to be clearly distinguishable from advertisements.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-card-foreground">9. Account Registration and Future Paid Features</h2>
            <p className="mb-4">
              Media Manipulator may currently be available without an account for some features. In the future, we may offer accounts, paid subscriptions, premium features, higher usage limits, unlimited access, ad-free experiences, or other paid services.
            </p>
            <p className="mb-4">
              If accounts or paid services are introduced, additional terms may apply, including payment terms, cancellation terms, refund terms, account security requirements, and subscription terms.
            </p>
            <p className="mb-4">
              You are responsible for maintaining the confidentiality of your account credentials and for all activity under your account.
            </p>
            <p className="mb-4">
              We reserve the right to suspend, restrict, or terminate accounts that violate these Terms, create legal risk, cause service abuse, or harm users, advertisers, our brand, or our infrastructure.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-card-foreground">10. Service Availability and Changes</h2>
            <p className="mb-4">
              Media Manipulator is provided as a dynamic online service. We may modify, suspend, discontinue, limit, or change any feature, tool, format, storage period, usage limit, AI feature, processing capability, pricing model, or availability at any time.
            </p>
            <p className="mb-4">
              We may impose usage limits, file size limits, file type restrictions, conversion limits, rate limits, account limits, or geographic restrictions.
            </p>
            <p className="mb-4">
              We do not guarantee that Media Manipulator will always be available, uninterrupted, secure, error-free, or compatible with every file, format, codec, browser, device, or operating system.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-card-foreground">11. File Processing Limitations</h2>
            <p className="mb-4">
              Media processing can fail for many reasons, including unsupported formats, corrupted files, incompatible codecs, excessive file size, browser limitations, server limitations, timeout errors, network errors, or safety restrictions.
            </p>
            <p className="mb-4">We do not guarantee that:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>every file can be processed;</li>
              <li>every conversion will be successful;</li>
              <li>output quality will meet your expectations;</li>
              <li>metadata will always be completely removed;</li>
              <li>AI transcripts, summaries, descriptions, or classifications will be accurate;</li>
              <li>generated files will be suitable for any particular purpose;</li>
              <li>temporary conversion history will always be available.</li>
            </ul>
            <p className="mb-4">
              You should review all outputs before using, publishing, distributing, or relying on them.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-card-foreground">12. Intellectual Property Rights</h2>
            <p className="mb-4">
              Media Manipulator, including its website, design, software, code, interface, branding, logos, text, graphics, features, workflows, and related materials, is owned by CreaTV Ltd. or its licensors and is protected by applicable intellectual property laws.
            </p>
            <p className="mb-4">
              These Terms do not grant you ownership of Media Manipulator or any CreaTV Ltd. intellectual property.
            </p>
            <p className="mb-4">
              You may not copy, modify, distribute, sell, lease, reverse engineer, or create derivative works from Media Manipulator except as permitted by law or with our written permission.
            </p>
            <p className="mb-4">
              You retain ownership of your own uploaded files and generated outputs, subject to the rights and licenses granted in these Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-card-foreground">13. Feedback</h2>
            <p className="mb-4">
              If you provide comments, suggestions, ideas, bug reports, feature requests, or other feedback, you grant us a non-exclusive, worldwide, royalty-free, perpetual, irrevocable right to use that feedback without restriction or compensation to you.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-card-foreground">14. Copyright Complaints</h2>
            <p className="mb-4">
              If you believe content processed, displayed, linked, or made available through Media Manipulator infringes your copyright or other intellectual property rights, you may contact us at:
            </p>
            <p className="mb-4">
              Email:{' '}
              <a href="mailto:legal@media-manipulator.com" className="text-blue-600 hover:text-blue-800">
                legal@media-manipulator.com
              </a>
            </p>
            <p className="mb-4">Your notice should include:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>your name and contact information;</li>
              <li>identification of the copyrighted work or protected material;</li>
              <li>identification of the allegedly infringing material;</li>
              <li>a statement that you have a good-faith belief that the use is not authorized;</li>
              <li>a statement that the information in your notice is accurate;</li>
              <li>your physical or electronic signature.</li>
            </ul>
            <p className="mb-4">
              We may remove or restrict access to allegedly infringing material and may terminate or restrict users who repeatedly violate intellectual property rights.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-card-foreground">15. Third-Party Services and Advertising</h2>
            <p className="mb-4">
              Media Manipulator may include links to third-party websites, advertisements, analytics providers, hosting providers, payment processors, or other third-party services.
            </p>
            <p className="mb-4">
              We are not responsible for third-party websites, services, advertisements, products, policies, or practices.
            </p>
            <p className="mb-4">
              Your interactions with third parties are solely between you and the third party. Third-party services may have their own terms and privacy policies.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-card-foreground">16. Privacy</h2>
            <p className="mb-4">
              Your use of Media Manipulator is also governed by our{' '}
              <a href="/privacy-policy" className="text-blue-600 hover:text-blue-800">
                Privacy Policy
              </a>
              .
            </p>
            <p className="mb-4">
              The Privacy Policy explains how we collect, use, store, scan, process, protect, and delete information, including uploaded files, generated outputs, analytics data, advertising data, AI-assisted processing data, and temporary conversion history.
            </p>
            <p className="mb-4">
              By using Media Manipulator, you acknowledge that you have read and understood our Privacy Policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-card-foreground">17. Termination and Suspension</h2>
            <p className="mb-4">
              We may suspend, restrict, or terminate your access to Media Manipulator at any time if we believe that:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>you violated these Terms;</li>
              <li>your content or activity is illegal, abusive, unsafe, infringing, or prohibited;</li>
              <li>your use creates risk for users, advertisers, our brand, our service, or our infrastructure;</li>
              <li>we are required or permitted to do so by law;</li>
              <li>continued access may expose us or others to legal, security, operational, or reputational harm.</li>
            </ul>
            <p className="mb-4">
              We may also delete uploaded files, generated outputs, temporary conversion history, logs, or account data as permitted by these Terms and our Privacy Policy.
            </p>
            <p className="mb-4">You may stop using Media Manipulator at any time.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-card-foreground">18. Disclaimers</h2>
            <p className="mb-4">
              Media Manipulator is provided on an “as is” and “as available” basis.
            </p>
            <p className="mb-4">
              To the maximum extent permitted by law, we disclaim all warranties, express or implied, including warranties of merchantability, fitness for a particular purpose, title, non-infringement, availability, security, accuracy, reliability, and error-free operation.
            </p>
            <p className="mb-4">We do not warrant that:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>the service will be uninterrupted, secure, or error-free;</li>
              <li>files will always be processed successfully;</li>
              <li>outputs will be accurate, complete, or suitable for your needs;</li>
              <li>metadata removal will always remove every possible metadata field;</li>
              <li>AI-generated content will be accurate, safe, complete, or appropriate;</li>
              <li>content-safety scans will detect every violation;</li>
              <li>temporary files or conversion history will always be available;</li>
              <li>the service will meet your expectations.</li>
            </ul>
            <p className="mb-4">You use Media Manipulator at your own risk.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-card-foreground">19. Limitation of Liability</h2>
            <p className="mb-4">
              To the maximum extent permitted by law, CreaTV Ltd., Media Manipulator, and their owners, officers, employees, contractors, affiliates, agents, licensors, and service providers will not be liable for any indirect, incidental, consequential, special, exemplary, punitive, or lost-profit damages arising out of or related to your use of Media Manipulator.
            </p>
            <p className="mb-4">This includes damages related to:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>failed conversions;</li>
              <li>lost files;</li>
              <li>deleted files;</li>
              <li>unavailable downloads;</li>
              <li>inaccurate outputs;</li>
              <li>metadata not being fully removed;</li>
              <li>AI inaccuracies;</li>
              <li>content blocking or preview suppression;</li>
              <li>account suspension or termination;</li>
              <li>service downtime;</li>
              <li>security incidents;</li>
              <li>third-party advertisements or services;</li>
              <li>legal consequences from your uploaded content or use of the service.</li>
            </ul>
            <p className="mb-4">
              To the maximum extent permitted by law, our total liability for any claim arising out of or related to Media Manipulator will not exceed the greater of:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>the amount you paid to us for Media Manipulator in the 3 months before the claim arose; or</li>
              <li>$100.</li>
            </ul>
            <p className="mb-4">
              Some jurisdictions do not allow certain limitations of liability, so some of these limitations may not apply to you.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-card-foreground">20. Indemnification</h2>
            <p className="mb-4">
              You agree to defend, indemnify, and hold harmless CreaTV Ltd., Media Manipulator, and their owners, officers, employees, contractors, affiliates, agents, licensors, and service providers from and against any claims, damages, losses, liabilities, costs, and expenses, including reasonable attorneys’ fees, arising out of or related to:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>your use of Media Manipulator;</li>
              <li>your User Content;</li>
              <li>your uploaded files or generated outputs;</li>
              <li>your violation of these Terms;</li>
              <li>your violation of applicable law;</li>
              <li>your infringement or alleged infringement of intellectual property, privacy, publicity, or other rights;</li>
              <li>your misuse of AI-assisted features;</li>
              <li>your misuse of advertising systems;</li>
              <li>your illegal, abusive, unsafe, or prohibited activity.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-card-foreground">21. Governing Law</h2>
            <p className="mb-4">
              These Terms are governed by the laws of the State of Colorado, United States, without regard to conflict-of-law principles.
            </p>
            <p className="mb-4">
              Subject to any rights you may have under applicable consumer protection laws, you agree that any dispute arising out of or related to these Terms or Media Manipulator will be brought in the state or federal courts located in Colorado.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-card-foreground">22. Changes to These Terms</h2>
            <p className="mb-4">We may update these Terms from time to time.</p>
            <p className="mb-4">
              When we make changes, we will update the “Last Updated” date at the top of this page. If we make material changes, we may provide additional notice, such as by posting a notice on the website.
            </p>
            <p className="mb-4">
              Your continued use of Media Manipulator after updated Terms are posted means you accept the updated Terms.
            </p>
            <p className="mb-4">
              If you do not agree to the updated Terms, you must stop using Media Manipulator.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-card-foreground">23. Contact</h2>
            <p className="mb-4">If you have questions about these Terms, contact us at:</p>
            <p className="mb-2">Media Manipulator is a product and service operated by CreaTV Ltd.</p>
            <p className="mb-1">CreaTV Ltd.</p>
            <p className="mb-1">Operating as Media Manipulator</p>
            <p className="mb-1">Colorado, USA</p>
            <p className="mb-1">
              Email:{' '}
              <a href="mailto:support@media-manipulator.com" className="text-blue-600 hover:text-blue-800">
                support@media-manipulator.com
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

export default TermsOfServicePage;
