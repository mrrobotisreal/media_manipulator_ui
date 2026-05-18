import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import AdBanner from '@/components/ad-banner';
import EmbeddedToolPanel from '@/components/embedded-tool-panel';
import RelatedLinks from '@/components/related-links';
import mixpanel from 'mixpanel-browser';

const ImageGettingStartedTutorial: React.FC = () => {
  useEffect(() => {
    mixpanel.track('Page View', {
      page_name: 'Tutorial - Image Getting Started',
      page_path: '/tutorials/image/getting-started',
      user_tier: 'free',
    });
  }, []);

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 pt-4">
        <AdBanner
          adSlot="6671038874"
          adFormat="leaderboard"
          adPosition="tutorial_image_header"
          className="mb-4"
          isFlashMock={true}
          utmMedium="tutorials_image_leaderboard"
          utmCampaign="creatv_launch_promo"
          linkURL="https://www.creatv.io/auth"
        />
      </div>
      <Card className="max-w-7xl mx-auto my-2 sci-fi-frame">
        <CardContent className="p-12 prose prose-invert max-w-none text-muted-foreground">
          <p className="text-sm uppercase tracking-wide text-green-600 font-medium">Image Tutorial</p>
          <h1 className="text-4xl font-bold mb-3 text-card-foreground">Getting Started: Converting Image Files</h1>
          <p className="text-lg mb-8">
            Learn how to convert, edit, and AI-process images with Media Manipulator's image converter. This tutorial walks through every section of the image conversion panel — format selection, cropping, filters, text overlays, metadata management, and the AI image tools (Face Privacy, Remove Background, AI Upscale, Redact Text, and Remove Object).
          </p>

          <h2 className="text-2xl font-semibold mb-3 text-card-foreground">1. Upload your image</h2>
          <p className="mb-4">
            Drag an image file into the upload zone, or click <strong>Choose File</strong>. The image converter accepts JPG, PNG, WebP, GIF, and many other formats. Files are deleted within 24 hours.
          </p>

          <EmbeddedToolPanel
            defaultMediaKind="image"
            title="Try the image converter without leaving this page"
            description="Pick an image and convert it right here. The settings mirror the homepage converter, so you can follow the rest of the tutorial as you experiment."
          />

          <h2 className="text-2xl font-semibold mb-3 text-card-foreground">2. Pick the output format and quality</h2>
          <ul className="list-disc pl-6 space-y-1 mb-4">
            <li><strong>JPG</strong> — best for photos. Lossy compression with a quality slider.</li>
            <li><strong>PNG</strong> — lossless, supports transparency. Best for screenshots, logos, and graphics.</li>
            <li><strong>WebP</strong> — modern format with both lossy and lossless modes; smaller than JPG at similar quality.</li>
            <li><strong>GIF</strong> — palette-based, supports basic animation, useful for legacy use cases.</li>
          </ul>
          <p className="mb-4">
            <strong>Quality (%)</strong> applies to JPG and WebP. 85 is a great default; lower for thumbnails, higher for hero images. Need help picking? See our <Link to="/blog/image/image-optimization-guide" className="text-blue-600 hover:text-blue-800">image optimization guide</Link>.
          </p>

          <h2 className="text-2xl font-semibold mb-3 text-card-foreground">3. Resize, crop, filter, tint</h2>
          <p className="mb-4">
            Use <strong>Width</strong> and <strong>Height</strong> to resize. Leave either blank to scale proportionally. ImageMagick auto-orients the input first so EXIF-oriented JPEGs don't ship rotated to PNG/WebP.
          </p>
          <p className="mb-4">
            Click <strong>Crop Image</strong> for a visual crop selector. The <strong>Filter</strong> dropdown applies a built-in effect: grayscale, sepia, blur, sharpen, swirl, barrel distortion, oil painting, vintage, emboss, charcoal, sketch, or a fixed rotation (45° / 90° / 180° / 270°). <strong>Tint Color</strong> lays a 30% colored tint over the image (skip by leaving black/#000000).
          </p>

          <h2 className="text-2xl font-semibold mb-3 text-card-foreground">4. Text overlay</h2>
          <p className="mb-4">
            Add a watermark or caption directly to the image. Type your text into <strong>Overlay Text</strong>, then choose:
          </p>
          <ul className="list-disc pl-6 space-y-1 mb-4">
            <li><strong>Text Size</strong> — 8–512 px.</li>
            <li><strong>Position</strong> — gravity-based anchor (corners, edges, center).</li>
            <li><strong>Text Color / Stroke Color</strong> — hex colors via the color pickers.</li>
            <li><strong>Stroke Width</strong> — 0 to disable the outline.</li>
            <li><strong>X Offset / Y Offset</strong> — pixel-level nudge from the gravity anchor.</li>
          </ul>

          <h2 className="text-2xl font-semibold mb-3 text-card-foreground">5. Metadata</h2>
          <p className="mb-4">
            Choose how Media Manipulator handles EXIF, IPTC, XMP, and GPS metadata:
          </p>
          <ul className="list-disc pl-6 space-y-1 mb-4">
            <li><strong>Keep all metadata</strong> — preserved from the original via exiftool.</li>
            <li><strong>Strip all metadata</strong> — removes camera, GPS, software, and timestamps. Recommended before sharing photos online.</li>
            <li>
              <strong>Custom metadata</strong> — strip first, then rewrite the fields you supply. Includes:
              <ul className="list-disc pl-6 mt-1 space-y-1">
                <li>Title, Artist/Author, Description, Copyright, User Comment, Keywords.</li>
                <li>GPS removal/replacement (with optional precision rounding) and direction/timestamp/altitude/destination toggles.</li>
                <li>EXIF/TIFF fields, GPS fields, and advanced IPTC/XMP/MakerNotes tags via an allowlist.</li>
              </ul>
            </li>
          </ul>

          <h2 className="text-2xl font-semibold mb-3 text-card-foreground">6. AI Image Tools (recommended)</h2>
          <p className="mb-4">
            The <strong>AI Image Tools</strong> panel runs one local GPU operation per conversion job. When you pick an operation, the standard ImageMagick pipeline (filters, tint, overlay, etc.) is skipped for that job so the AI tool has a clean input/output path.
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>
              <strong>Face Blur / Pixelate / Black Box</strong> — detects every face in the photo and obscures it with your chosen style. Great for sharing event photos without leaking attendee identities.
            </li>
            <li>
              <strong>Remove Background</strong> — runs rembg with BiRefNet (general or portrait), ISNet, or U2Net. Output is forced to PNG so transparency is preserved. BiRefNet General is the recommended default for most photos.
            </li>
            <li>
              <strong>AI Upscale</strong> — Real-ESRGAN ncnn Vulkan upscaler. Pick <em>4x</em> (safest) or <em>2x</em> (faster), and pick a model: <code>realesrgan-x4plus</code> for general photos, <code>realesrgan-x4plus-anime</code> for animation/illustration, or <code>realesr-animevideov3</code> for anime video frames. PNG output by default.
            </li>
            <li>
              <strong>Redact Text / PII</strong> — OCR-based redaction. Choose <em>PII only</em> (emails, phone numbers, SSNs, addresses, etc.) or <em>All Text</em>, then pick a redaction style (Black Box, Blur, or Pixelate). Best-effort — review the output before sharing.
            </li>
            <li>
              <strong>Remove Object (LaMa Inpainting)</strong> — click and drag on the image preview to draw a rectangle over whatever you want to erase: a passerby in the background, a sign, a watermark, a pole. Drag the rectangle body to move it, drag the corner/edge handles to resize, and add as many rectangles as you need with another click-drag on empty space. When you submit, the server rasterizes a mask from your rectangles and runs <code>simple-lama-inpainting</code> on a dedicated GPU to reconstruct the area behind them. The output keeps your chosen format (JPG, PNG, WebP, GIF). Tips:
              <ul className="list-disc pl-6 mt-1 space-y-1">
                <li>Draw the rectangle snugly around the object — large rectangles ask LaMa to hallucinate more background, which can look worse.</li>
                <li>Several small rectangles usually beat one huge one, especially for thin objects.</li>
                <li>LaMa works best when the surrounding pixels give the model enough context (sky, grass, plain walls, even-toned surfaces).</li>
              </ul>
            </li>
          </ul>

          <h2 className="text-2xl font-semibold mb-3 text-card-foreground">7. Convert and download</h2>
          <p className="mb-4">
            Click <strong>Convert File</strong>. A progress bar shows real-time job status. Once finished, the result auto-previews with an <strong>Original / Final</strong> toggle so you can compare. Use <strong>Download</strong> to save it, or revisit it later from the in-session <em>Conversion History</em> list.
          </p>

          <h2 className="text-2xl font-semibold mb-3 text-card-foreground">Tips for great image output</h2>
          <ul className="list-disc pl-6 space-y-1 mb-4">
            <li>For social uploads, use <strong>WebP</strong> at 80–85% quality for great-looking small files.</li>
            <li>Pair <strong>Strip metadata</strong> with sharing photos online to avoid leaking GPS or device info.</li>
            <li><strong>Remove Background</strong> outputs are always PNG — pair them with a colored background in your designer of choice or stack them in a slide deck.</li>
            <li>For AI Upscale, prefer <strong>4x</strong> with <code>realesrgan-x4plus</code> on photos; 2x is a power-user option that can occasionally show framing artifacts on small inputs.</li>
            <li>Run <strong>Redact Text</strong> before posting a screenshot of an email, ticket, or invoice.</li>
            <li>Use <strong>Remove Object</strong> for one-off cleanup like a tourist in a vacation photo or a stray sign over a landscape — but expect to iterate on the rectangle size to find the cleanest result.</li>
          </ul>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link to="/" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Try the Image Converter
            </Link>
            <Link to="/tutorials" className="bg-card border border-border text-card-foreground px-4 py-2 rounded-lg hover:bg-muted transition-colors">
              ← Back to Tutorials
            </Link>
            <Link to="/how-it-works" className="bg-card border border-border text-card-foreground px-4 py-2 rounded-lg hover:bg-muted transition-colors">
              How it Works
            </Link>
          </div>

          <RelatedLinks
            intro="Keep learning — guides and sibling tutorials that pair with the image converter."
            links={[
              {
                label: 'Image optimization guide',
                to: '/blog/image/image-optimization-guide',
                description: 'JPG vs PNG vs WebP and how to shrink images for the web.',
              },
              {
                label: 'Video converter tutorial',
                to: '/tutorials/video/getting-started',
                description: 'Convert, trim, and apply visual effects to video files.',
              },
              {
                label: 'Audio converter tutorial',
                to: '/tutorials/audio/getting-started',
                description: 'Clean up voiceover or background audio for media projects.',
              },
              {
                label: 'How Media Manipulator works',
                to: '/how-it-works',
                description: 'See how AI image tools run on a local GPU server.',
              },
            ]}
          />
        </CardContent>
      </Card>
      <div className="max-w-6xl mx-auto px-4 pb-8">
        <AdBanner
          adSlot="3633827902"
          adFormat="leaderboard"
          adPosition="tutorial_image_footer"
          className="mt-8"
          isFlashMock={true}
          utmMedium="tutorials_image_footer_leaderboard"
          utmCampaign="creatv_launch_promo"
          linkURL="https://www.creatv.io/auth"
        />
      </div>
    </>
  );
};

export default ImageGettingStartedTutorial;
