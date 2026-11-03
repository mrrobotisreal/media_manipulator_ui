import { PHOTO_BRAND } from '@/lib/photo/brand';
import { RETENTION_PROMISE } from '@/content/retentionPromise';
import type { PhotoPageBody } from './types';

const PAGES: PhotoPageBody[] = [
  // ------------------------------------------------------------------ reduce-image-noise
  {
    slug: 'reduce-image-noise',
    name: 'Reduce image noise',
    h1: 'Reduce Noise in a Photo Online',
    tagline: 'Separate luminance and color noise reduction with a live preview, then export at full resolution.',
    metaTitle: 'Reduce Noise in a Photo Online: Luminance and Color Denoise',
    metaDescription:
      'Denoise a grainy high-ISO photo in the browser: a bilateral filter on luminance and a Gaussian on color, judged at 100% zoom, exported at full resolution.',
    ogTitle: 'Reduce Noise in a Photo Online',
    ogDescription:
      'Two sliders, Luminance and Color, remove the speckle from high-ISO shots without turning them to plastic. Live preview, full-resolution export, no third-party AI.',
    intro: `Noise reduction in ${PHOTO_BRAND} is a Detail layer with two sliders, Luminance and Color, each 0 to 100. Both run in the Lab color space: luminance noise is smoothed with an edge-aware bilateral filter on the L channel, while color blotches are smoothed with a plain Gaussian blur on the a and b channels, which is why you can be far more aggressive on Color than on Luminance before anything looks soft. The layer sits in the same non-destructive stack as every other adjustment, so you can mask it to the shadows with a luminosity range, lower its opacity, or drop it later. The preview updates as you drag; the exported file is rendered from the original pixels with the same arithmetic. Use the Judge at 100% button before you decide, because noise is invisible at fit-to-screen zoom.`,
    whatItDoes: [
      'Smooths luminance noise with a 9 by 9 bilateral filter on the Lab lightness channel, so edges above the range threshold are preserved while flat areas average out.',
      'Smooths color noise with a separable Gaussian on the Lab a and b channels, removing the purple and green speckle that high ISO leaves in shadows.',
      'Keeps the two kinds of noise independent: Color at 60 with Luminance at 0 cleans chroma blotches and leaves every bit of grain-like texture intact.',
      'Lives on an adjustment layer with opacity, blend mode and an optional mask, so you can denoise only the sky or only the shadows.',
      'Renders the export from the original file on our server with the same formulas, at full resolution rather than from the screen preview.',
    ],
    flowSteps: [
      { title: 'Drop in the photo', description: 'JPG, PNG, WebP, GIF, HEIC, HEIF, AVIF, TIFF or BMP. The Detail panel opens in front with Noise reduction visible.' },
      { title: 'Zoom to 100%', description: 'Press Judge at 100% so each image pixel is one screen pixel. At fit-to-window the noise is averaged away and every setting looks fine.' },
      { title: 'Set Color, then Luminance', description: 'Raise Color until the colored speckle disappears, usually 40 to 70. Then raise Luminance only as far as the grain bothers you; 20 to 40 keeps texture.' },
      { title: 'Export', description: 'Pick JPG, PNG, WebP, AVIF or TIFF and a quality. The server denoises the original and encodes the file; the original is never modified.' },
    ],
    advancedDetails: [
      'Luminance: the image is converted to CIE Lab (D65) and L is scaled to 0..1. A bilateral filter with a fixed 9 by 9 window (radius 4 pixels, edge pixels replicated) is applied with spatial sigma 2 + 6 l and range sigma max(0.2 l, 0.001), where l is the Luminance slider divided by 100. At Luminance 50 that is a spatial sigma of 5 px and a range sigma of 0.1, which is 10 Lab lightness units; at 100 the spatial sigma is 8 px and the range sigma 0.2.',
      'Color: the Lab a and b channels are blurred with a separable Gaussian whose sigma is 6 c pixels, c being the Color slider divided by 100, so Color 50 is a 3 px sigma and Color 100 a 6 px sigma. Taps run from minus ceil(3 sigma) to plus ceil(3 sigma), normalized in float64, with edge pixels replicated.',
      'The filtered L, a and b are converted back to sRGB with the standard inverse matrix and the result is clamped to 0..1. Because the window and sigmas are in pixels, the same slider value smooths a larger share of a 1920 px preview than of a 6000 px original; judge the result at 100% zoom and expect the export to look slightly less smoothed than the fit-to-screen preview.',
      'A Luminance of 0 skips the bilateral pass entirely and a Color of 0 skips the Gaussian, so a layer with both at 0 is a true identity, not a very weak blur.',
      `The preview is drawn on your GPU in WebGL2 from a 1920 px copy of the photo, the exported file is rendered on our server from the original at full resolution with the same formulas, and the two agree within a documented tolerance: noise reduction carries the loosest tolerance in the ${PHOTO_BRAND} parity policy, a mean error of at most 3 8-bit levels and a maximum of 12, while color adjustments are held to a mean of 1 and grain is bit-exact.`,
    ],
    whyItMatters: [
      'High-ISO noise is mostly chroma speckle, and chroma can be blurred hard without visible softening, so treating the two channels separately gets a cleaner result than one combined slider.',
      'A bilateral filter keeps edges where the lightness difference exceeds the range sigma, which is what stops a denoised face from turning into a waxy smear.',
      'Because the layer is non-destructive you can compare 100% crops with the backslash key held and back off before anything is baked into the file.',
    ],
    useCases: [
      { title: 'Concert and night shots at ISO 6400', description: 'Color 60 removes the magenta and green blotches in the blacks; Luminance 30 calms the grain without erasing stage haze.' },
      { title: 'Shadow recovery after a big Exposure push', description: 'Lifting shadows by 2 EV amplifies noise that was hiding. Add noise reduction above the exposure layer and mask it to a luminosity range of the darks.' },
      { title: 'Old scanned prints', description: 'Scanner noise is fine and mostly luminance. Luminance 40 with a radius-free Color pass of 20 is usually enough; keep Texture at 0 afterwards.' },
      { title: 'Product photos on a dark backdrop', description: 'Denoise only the backdrop with a color range mask on the background, so the product edges keep every pixel of detail.' },
    ],
    whyMediaManipulator: [
      'Both passes are documented formulas with real constants, not a black box, so the result is predictable from one photo to the next.',
      'Noise reduction runs on your GPU for the preview and on our own servers for the export; no third-party AI service ever sees the photo.',
      'The denoise layer stacks with masks, sharpening and grain in one project, so you do not round-trip through three different single-purpose tools.',
    ],
    privacyNote: `Noise reduction is a pure pixel filter and needs no AI service: signed out, the photo stays in your browser until you export it, and that export is kept like any guest job. Signed in, the original with its 1920 px preview stays under your retention setting and is deleted with the project. ${RETENTION_PROMISE}. Nothing is sent to a third party.`,
    faq: [
      { question: 'Why does the photo look clean in the preview but still a little noisy after export?', answer: 'The filter window is measured in pixels. On the 1920 px preview a 9 by 9 window covers a bigger fraction of the frame than it does on the full-size original, so the export smooths relatively less. Judge at 100% zoom, which shows the real pixel scale.' },
      { question: 'What is the difference between the Luminance and Color sliders?', answer: 'Luminance runs a bilateral filter on the Lab lightness channel and preserves edges; Color runs a Gaussian on the Lab a and b channels and only affects hue and saturation speckle. Color can usually go much higher than Luminance.' },
      { question: 'Is this AI denoising?', answer: 'No. It is a deterministic bilateral and Gaussian filter pair that costs nothing per use and runs in the preview instantly. The only AI operations in the editor are Select subject and Heal.' },
      { question: 'Can I denoise only the shadows?', answer: 'Yes. Give the noise reduction layer a Luminosity range mask, set From brightness 0 and To brightness around 0.35 with a feather, and the midtones and highlights keep their full detail.' },
      { question: 'Does noise reduction change the colors?', answer: 'The Lab round trip is exact to well under one 8-bit level on flat areas. Strong Color values can desaturate tiny colored details such as distant fairy lights, because they are averaged with their surroundings.' },
      { question: 'Should I sharpen before or after denoising?', answer: 'Put the sharpen layer above the noise reduction layer so the unsharp mask sees the smoothed image; sharpening first would amplify the grain the denoise then has to remove.' },
    ],
    related: [
      { label: 'Sharpen a photo', to: '/tools/sharpen-photo-online', description: 'Bring back crispness after denoising with amount, radius and threshold on the luma channel.' },
      { label: 'Fix photo exposure', to: '/tools/fix-photo-exposure', description: 'Lifting shadows reveals the noise this page removes; the two layers stack.' },
      { label: 'Add or remove a vignette', to: '/tools/add-vignette', description: 'Darken the noisy corners of a night shot instead of smoothing them.' },
      { label: 'Select by color', to: '/tools/select-by-color', description: 'Mask the denoise layer to a background color so the subject stays sharp.' },
      { label: 'Compress an image', to: '/tools/compress-image', description: 'Noise costs bytes; a denoised JPG compresses noticeably smaller.' },
      { label: 'The editor guide', to: '/tutorials/aperture', description: 'How layers, masks and the history panel fit together.' },
    ],
    primaryKeyword: 'reduce noise in photo online',
    secondaryKeywords: ['denoise image online', 'remove grain from photo', 'high ISO noise reduction', 'reduce color noise', 'photo noise reduction tool', 'luminance noise reduction'],
    supportedFormats: {
      supportedInputFormats: ['JPG', 'PNG', 'WebP', 'GIF', 'HEIC', 'HEIF', 'AVIF', 'TIFF', 'BMP'],
      supportedOutputFormats: ['JPG', 'PNG', 'WebP', 'AVIF', 'TIFF'],
      processingNotes: [
        'HEIC, HEIF, TIFF and BMP need an account so the server can make a decodable preview copy; the other formats open directly in the browser.',
        'Exports are capped at 12 megapixels without an account; Premium and Pro export up to 120 megapixels.',
      ],
    },
    workedExamples: [
      {
        title: 'ISO 6400 concert JPG, 6000 x 4000, 24 MP, 11.4 MB',
        body: 'Color 50, Luminance 50. On a flat gray patch with noise of about 6 levels standard deviation in both lightness and chroma, the Luminance pass (spatial sigma 5 px, range sigma 10 L units) brings the lightness deviation to about 0.7 levels and the Color pass (sigma 3 px) brings the chroma deviation to about 0.4 levels. Exported as JPG quality 92 at the 12 MP guest cap the file is about 5.4 MB; signed in on Premium at the full 24 MP it is about 10.8 MB. One everyday operation.',
      },
      {
        title: 'Shadow-lifted 4032 x 3024 phone photo, 12.2 MP, 4.6 MB',
        body: 'Exposure +1.5 EV, then noise reduction with Luminance 30 and Color 60 masked to a luminosity range of 0 to 0.3. At Luminance 30 the bilateral uses a spatial sigma of 3.8 px and a range sigma of 0.06 (6 L units); the same noisy patch drops from about 6 levels of lightness deviation to about 1.1 while a 20-level edge stays untouched because it exceeds the range sigma by more than 3 times. Color 60 is a 3.6 px Gaussian on a and b. WebP export at quality 85 is about 3.7 MB.',
      },
    ],
    whenNotToUse: `Do not use noise reduction on a photo that is actually sharp but was saved at a very low JPG quality: blocky 8 by 8 compression artifacts are not noise and the bilateral filter preserves their edges rather than removing them. Re-encode from the original if you have it. If the problem is motion blur or missed focus, no amount of smoothing helps either; try the Sharpen page for small softness. For a deliberately grainy film look you want to add grain, not remove it, and the Grain sliders in the same Detail panel do that with a bit-exact export.`,
    embed: { title: 'Reduce noise in a photo', description: 'Drop a photo to open it with the Detail panel in front; set Color and Luminance while zoomed to 100%.' },
  },

  // ------------------------------------------------------------------ add-vignette
  {
    slug: 'add-vignette',
    name: 'Add a vignette',
    h1: 'Add or Remove a Vignette Online',
    tagline: 'Darken or lighten the edges of a photo with midpoint, roundness, feather and highlight protection.',
    metaTitle: 'Add or Remove a Vignette Online: Midpoint, Roundness, Feather',
    metaDescription:
      'Add a dark or light vignette to a photo in the browser, or cancel lens vignetting with a positive amount. Five sliders, a live preview and a full-resolution export.',
    ogTitle: 'Add or Remove a Vignette Online',
    ogDescription:
      'Negative amount darkens the corners, positive lightens them to remove lens fall-off. Shape it with midpoint, roundness and feather, protect the highlights, export at full size.',
    intro: `The Vignette section of the ${PHOTO_BRAND} Detail panel multiplies each pixel by a factor that depends on how far it sits from the center of the frame. Amount runs from -100 to 100: negative values darken the edges for the classic drawing-the-eye-inward look, positive values brighten them, which is how you cancel the natural fall-off of a wide-open lens. Midpoint sets where the effect begins, Feather how gradually it ramps, Roundness whether the shape follows the rectangular frame or a circle, and Highlights protects bright pixels from being darkened. It is a detail layer like any other, so it can be masked, faded with opacity and undone. The preview on your GPU and the server export use the same distance metric and the same smoothstep ramp.`,
    whatItDoes: [
      'Darkens the edges with a negative Amount or lightens them with a positive one, multiplying each pixel by 1 + amount/100 times the frame distance factor.',
      'Starts the effect at the Midpoint and ramps it over the Feather width with a smoothstep, so there is never a visible ring.',
      'Shapes the fall-off with Roundness: -100 follows the rectangle of the frame, 0 is halfway, 100 is a true ellipse inscribed in the frame.',
      'Protects bright pixels when darkening: with Highlights at 50, a pixel at luma 0.9 is darkened only 55 percent as much as a black one.',
      'Exports from the original at full resolution with the normalized frame coordinates, so the vignette lands in the same place on the 24 MP file as on the preview.',
    ],
    flowSteps: [
      { title: 'Open the photo', description: 'Drop a JPG, PNG, WebP, HEIC or other photo; the Detail panel opens with the Vignette sliders visible.' },
      { title: 'Choose a direction', description: 'Drag Amount to about -30 for a subtle darkening or to +20 to +40 to lift corners that a lens has darkened.' },
      { title: 'Shape it', description: 'Lower Midpoint to pull the effect inward, raise Feather to soften the transition, and set Roundness to 100 for a circular shape on a wide frame.' },
      { title: 'Protect and export', description: 'Raise Highlights so bright skies keep their brightness, check with the backslash key, then export JPG, PNG, WebP, AVIF or TIFF.' },
    ],
    advancedDetails: [
      'Each pixel gets normalized coordinates nx and ny from -1 to 1 across the frame (pixel centers at +0.5). Two distances are computed: the rectangle metric max(|nx|, |ny|), and the circle metric, the Euclidean distance from the center in pixels divided by the half diagonal. They are blended with weight (roundness + 100)/200 on the circle, so Roundness -100 is pure rectangle, 0 is a 50/50 mix and 100 is pure circle. Every metric is 0 at the center and exactly 1 at the four corners.',
      'The factor v is smoothstep(midpoint/100, midpoint/100 + feather/100, d): 0 until the distance reaches the midpoint, 1 once it reaches midpoint plus feather, with the cubic 3t squared minus 2t cubed ease between. At the defaults Midpoint 50 and Feather 50, a pixel halfway to a corner has v = 0, a pixel three quarters of the way has v = 0.5, and a pixel at d = 0.9 has v = 0.896.',
      'The pixel is multiplied by k = 1 + amount/100 times v times prot, where prot = 1 - highlights/100 times the BT.709 luma of the pixel when Amount is negative and 1 when it is positive, then clamped to 0..1. Lightening therefore clips: with Amount +30 at a corner, a pixel at 0.8 (204) becomes 1.0 (255).',
      'On a 6000 x 4000 frame with Roundness 0 the middle of the long edge is at d = 0.916 and the middle of the short edge at d = 0.777; with Roundness 100 those become 0.832 and 0.555, so a circular vignette leaves the top and bottom edges noticeably lighter than the sides on a 3:2 frame.',
      `The ${PHOTO_BRAND} preview is drawn on your GPU (WebGL2) from a 1920 px copy, the export is rendered on our server from the original at full resolution with the same formulas, and the two agree within a small documented tolerance; for the vignette that is a mean error of at most one 8-bit level, since the distance is computed in normalized frame units and does not depend on the pixel count.`,
    ],
    whyItMatters: [
      'A vignette that starts at the right midpoint reads as light, not as an effect; one that starts too close to the center looks like a tunnel.',
      'Lens fall-off on fast primes can be a full stop in the corners, and a positive Amount with a wide Feather removes it without touching the center.',
      'Highlight protection keeps a darkening vignette from muddying a bright sky or a white dress in the corners.',
    ],
    useCases: [
      { title: 'Portraits against a busy background', description: 'Amount -35, Midpoint 40, Feather 60, Roundness 60 pulls attention to the face without an obvious dark ring.' },
      { title: 'Correcting a wide-open 35mm lens', description: 'Amount +25, Midpoint 30, Feather 70, Roundness 100 lifts the corners roughly a third of a stop and evens the sky.' },
      { title: 'Product shots on white', description: 'A slight negative vignette with Highlights 80 keeps the white backdrop white while subtly grounding the object.' },
      { title: 'Square social crops', description: 'Set the crop first in Geometry; the vignette is computed on the cropped frame, so the corners stay in the corners.' },
    ],
    whyMediaManipulator: [
      'The shape, ramp and protection are all documented with their exact constants, so a setting you like can be saved as a look and will land identically on the next photo.',
      'Because the vignette is a layer, it can be blended in Luminosity mode to avoid any color shift in the darkened edges.',
      'Export is rendered from the original at up to 120 MP on Pro with the same normalized coordinates, not stretched from the screen preview.',
    ],
    privacyNote: `A vignette is computed from frame coordinates and pixel values alone, with no AI step. Without an account the photo and its edge darkening never leave your browser until you export, and the export is then a normal guest job. With an account the original and its 1920 px preview stay on our server under your retention setting. ${RETENTION_PROMISE}. No third party is involved.`,
    faq: [
      { question: 'How do I remove the vignette a lens left in my photo?', answer: 'Use a positive Amount. Lens fall-off is roughly circular and reaches the corners, so Roundness 100, Midpoint 20 to 35 and Feather 60 to 80 with Amount +15 to +40 usually cancels it. Watch bright corners, since lightening clips at 255.' },
      { question: 'Why does the vignette look round on the preview but reach the sides first on export?', answer: 'It does not; the distance is normalized to the frame on both. What changes the shape is Roundness: at -100 it follows the rectangle and the side edges darken first, at 100 it is an inscribed ellipse.' },
      { question: 'What does Highlights do exactly?', answer: 'When Amount is negative, the darkening of each pixel is scaled by 1 - highlights/100 times its luma. At Highlights 100 a pure white pixel is not darkened at all and a mid-gray is darkened half as much. It has no effect when Amount is positive.' },
      { question: 'Does the vignette follow the crop?', answer: 'Yes. Geometry, including crop and straighten, is applied before any layer, so the center and corners are those of the cropped frame, not of the original file.' },
      { question: 'Can I make the vignette off-center?', answer: 'Not with the vignette sliders, which are always centered. For an off-center darkening, add a Local adjustment with a Radial mask, invert it and lower Exposure; the radial mask has a draggable center, size and rotation.' },
      { question: 'Will a dark vignette shift colors in the corners?', answer: 'The multiplication scales R, G and B equally, so hue is unchanged, though a dark corner can look slightly more saturated. Set the layer blend to Luminosity if you want the chroma left exactly as it was.' },
    ],
    related: [
      { label: 'Fix photo exposure', to: '/tools/fix-photo-exposure', description: 'Balance the overall brightness before deciding how dark the edges should go.' },
      { label: 'Straighten a photo', to: '/tools/straighten-photo', description: 'Straighten and crop first; the vignette is computed on the final frame.' },
      { label: 'Split toning', to: '/tools/split-toning', description: 'A warm highlight and cool shadow tone pairs well with a soft edge darkening.' },
      { label: 'Black and white', to: '/tools/black-and-white-photo', description: 'Classic monochrome prints almost always carried an edge burn like this one.' },
      { label: 'Resize an image', to: '/tools/image-resizer', description: 'Resize after export when you need a specific pixel size for a site.' },
    ],
    primaryKeyword: 'add vignette online',
    secondaryKeywords: ['remove vignette from photo', 'vignette effect online', 'darken photo edges', 'fix lens vignetting', 'photo vignette tool', 'lighten corners of photo'],
    supportedFormats: {
      supportedInputFormats: ['JPG', 'PNG', 'WebP', 'GIF', 'HEIC', 'HEIF', 'AVIF', 'TIFF', 'BMP'],
      supportedOutputFormats: ['JPG', 'PNG', 'WebP', 'AVIF', 'TIFF'],
      processingNotes: [
        'The vignette is computed in normalized frame coordinates, so it is identical at any export size from 12 to 120 megapixels.',
        'PNG exports keep transparency; a transparent corner left by a rotation is multiplied like any other pixel but stays transparent.',
      ],
    },
    workedExamples: [
      {
        title: 'Darkening a 6000 x 4000 portrait, 24 MP JPG, 9.8 MB',
        body: 'Amount -40, Midpoint 50, Feather 50, Roundness 0, Highlights 0. At the corner (d = 1, v = 1) the factor is 1 - 0.40 = 0.60, so a mid-gray of 128 becomes 77. At the middle of the long edge, d = 0.916 and v = 0.925, a 128 becomes about 81. Three quarters of the way out, v = 0.5, 128 becomes 102; inside d = 0.5 nothing changes. Exported as JPG quality 92 at the 12 MP guest cap: about 5.4 MB, one everyday operation.',
      },
      {
        title: 'Lifting lens fall-off on a 4000 x 6000 landscape, 24 MP, Premium account',
        body: 'Amount +30, Midpoint 30, Feather 70, Roundness 100. At the corners v = 1 and the factor is 1.30, so a corner sky at 160 becomes 208 and anything above 196 clips to 255. Halfway to a corner d = 0.5, v = smoothstep(0.3, 1.0, 0.5) = 0.198, and a 160 becomes about 170. With a 24 MP WebP export at quality 90 the file is about 7.2 MB.',
      },
    ],
    whenNotToUse: `Skip the vignette when the subject is at the edge of the frame, since any centered darkening will dim it; use a Local adjustment with a radial mask placed over the subject instead. Do not use a positive Amount to brighten a whole underexposed photo: it only lifts the corners and clips bright pixels at 255, while the Exposure slider raises everything evenly. For a solid border or a frame around the picture, a vignette is the wrong tool altogether because its ramp is always soft; crop to the aspect you want and add the border in a layout program.`,
    embed: { title: 'Add or remove a vignette', description: 'Drop a photo to open the Detail panel; drag Amount negative to darken the edges or positive to lift them.' },
  },

  // ------------------------------------------------------------------ sharpen-photo-online
  {
    slug: 'sharpen-photo-online',
    name: 'Sharpen a photo',
    h1: 'Sharpen a Photo Online',
    tagline: 'Unsharp mask with amount, radius and threshold on luma, plus Clarity and Texture, judged at 100%.',
    metaTitle: 'Sharpen a Photo Online with Amount, Radius and Threshold',
    metaDescription:
      'Sharpen a photo in the browser with a real unsharp mask: amount 0-500, radius 0.1-50 px, threshold 0-255, plus Clarity and Texture. Live preview, full-resolution export.',
    ogTitle: 'Sharpen a Photo Online',
    ogDescription:
      'Amount, radius and threshold like a desktop editor, a Judge at 100% button, and Clarity and Texture for midtone and fine detail. Rendered at full resolution on export.',
    intro: `The Sharpen section of the ${PHOTO_BRAND} Detail panel is a classic unsharp mask computed on luma only: the lightness of each pixel is compared with a Gaussian-blurred copy, and the difference, scaled by Amount, is added back to all three channels. Radius sets the blur sigma in pixels, which decides whether you are crisping fine texture or boosting broad edges, and Threshold ignores differences smaller than a number of 8-bit levels so flat skin and sky are not roughened. Two companion sliders use the same engine at fixed radii: Clarity at 2 percent of the long side, weighted toward midtones, and Texture at 0.3 percent for fine detail. Everything previews live on your GPU and exports from the original at full resolution.`,
    whatItDoes: [
      'Applies an unsharp mask on luma: the difference between the pixel lightness and a Gaussian blur of radius pixels is multiplied by Amount/100 and added to R, G and B.',
      'Lets you keep flat areas untouched with Threshold: a difference of 8 levels or less is ignored at Threshold 8, so noise in sky stays unsharpened.',
      'Adds Clarity, a midtone-weighted sharpen at a large radius (2 percent of the long side) for punch, and Texture, a fine-radius sharpen (0.3 percent, at least 1.5 px) for surface detail; both run -100 to 100, so negative values soften.',
      'Includes a Judge at 100% button that sets the canvas to one image pixel per screen pixel, the only zoom at which sharpening can be judged.',
      'Exports from the original on our server with the same Gaussian taps and gain, so a radius of 1 px means 1 px of the full-size file.',
    ],
    flowSteps: [
      { title: 'Drop the photo', description: 'The Detail panel opens in front. Press Judge at 100% straight away.' },
      { title: 'Pick a radius', description: 'Use 0.6 to 1.0 px for fine detail on a 24 MP file, 1.5 to 2.5 for a soft lens or a small web export. Larger radii create visible halos.' },
      { title: 'Raise Amount, set Threshold', description: 'Amount 80 to 150 is typical. Raise Threshold to 4 to 10 if skin or sky starts to look gritty.' },
      { title: 'Export', description: 'Choose the format and size. The server sharpens the original at full resolution; downsizing afterward will soften it a little, so sharpen slightly more for small outputs.' },
    ],
    advancedDetails: [
      'Luma L is BT.709: 0.2126 R + 0.7152 G + 0.0722 B of the sRGB-encoded values. The blur is a separable Gaussian with sigma equal to Radius, taps from minus ceil(3 sigma) to plus ceil(3 sigma), normalized in float64, edge pixels replicated. The difference d = L - blur(L) is zeroed where |d| is not greater than Threshold/255, then shift = Amount/100 times d is added to each of R, G and B and the result is clamped to 0..1.',
      'On a step edge from 0.3 (77) to 0.7 (179), Amount 100 at Radius 1 turns the two pixels nearest the edge into 46 and 209 and the next pair into 71 and 184. Radius 2 at the same amount gives 36 and 219 with a halo three pixels wide (66, 54, 36 on the dark side). Amount 150 at Radius 1 gives 31 and 224.',
      'Clarity is the same unsharp mask with sigma 0.02 times the long side (120 px on a 6000 px file), gain Amount/100 times 0.6, and a midtone weight W = 1 - |2L - 1| that is 1 at mid-gray and 0 at black and white. Texture uses sigma max(1.5, 0.003 times the long side), 18 px on a 6000 px file, gain Amount/100 times 0.5, no weight, no threshold.',
      'Because Clarity and Texture radii are a fraction of the long side they scale with the image, so the 1920 px preview and the full-size export match; the Sharpen radius is in absolute pixels and the preview shows it at the proxy scale, which is why the Judge at 100% button exists.',
      `${PHOTO_BRAND} draws the preview on your GPU (WebGL2) from a 1920 px copy, renders the export on our server from the original at full resolution with the same formulas, and holds the two within a small documented tolerance: for sharpening and the other convolution operations a mean error of at most 1.5 8-bit levels and a maximum of 8, with color operations at a mean of 1 and grain exact.`,
    ],
    whyItMatters: [
      'One-knob sharpening cannot separate fine detail from edge contrast; radius and threshold are what keep hair crisp while skin stays smooth.',
      'Sharpening on luma only avoids the colored fringes that an RGB unsharp mask produces along high-contrast edges.',
      'Judging at 100% prevents the most common mistake, over-sharpening a fit-to-screen preview that was already being downsampled by the browser.',
    ],
    useCases: [
      { title: 'Output sharpening for the web', description: 'Export at 2048 px wide, then Amount 120, Radius 0.7, Threshold 2 to counter the softening of the downscale.' },
      { title: 'A slightly soft lens or missed focus', description: 'Radius 1.8, Amount 90 recovers apparent edge contrast on a 24 MP file; beyond Radius 2.5 the halos give it away.' },
      { title: 'Portraits', description: 'Threshold 10 with Amount 100 and Radius 1 sharpens eyes, lashes and hair while a 10-level ripple in skin tone is left alone.' },
      { title: 'Architecture and landscapes', description: 'Clarity 25 for midtone punch plus Texture 30 for stone and foliage, then a light Sharpen at Radius 0.8.' },
    ],
    whyMediaManipulator: [
      `${PHOTO_BRAND} gives you the three real unsharp-mask controls and documents their formula, rather than a single strength slider with hidden settings.`,
      'The sharpen layer stacks above noise reduction, under a mask if you like, with the result previewed instantly on your own GPU.',
      'Exports are rendered at full resolution up to 120 MP on Pro, so the radius you tuned at 100% is the radius in the delivered file.',
    ],
    privacyNote: `Sharpening is a local convolution and never calls an AI service. Without an account your photo and its sharpen settings stay in this browser until you export, when the file is uploaded for that one render as a guest job. With an account the original, its 1920 px preview and thumbnail stay on our server under your retention setting and go when the project goes. ${RETENTION_PROMISE}. Nothing is shared with any third party.`,
    faq: [
      { question: 'What radius should I use to sharpen a 24 MP photo?', answer: 'For fine detail viewed at full size, 0.6 to 1.0 px. For an image that will be downsized to a few thousand pixels, sharpen for the output instead: export at that size and use 0.5 to 0.8 px with a higher amount.' },
      { question: 'What does Threshold do in sharpening?', answer: 'It zeroes the luma difference wherever |L - blur(L)| is not greater than threshold/255. At Threshold 8 a 2-level ripple in a sky stays 130/126 instead of becoming 131/124, while a 100-level edge is sharpened in full.' },
      { question: 'How is this different from the Sharpen image tool on Media Manipulator?', answer: 'That page is a one-shot ImageMagick filter with a fixed strength. This one is a layer with Amount, Radius and Threshold, a live preview at 100%, Clarity and Texture beside it, and masks so you can sharpen only the eyes.' },
      { question: 'Why does sharpening add colored edges in some editors but not here?', answer: 'An RGB unsharp mask boosts each channel separately, which exaggerates chromatic aberration. Here the difference is computed on BT.709 luma and the same shift is added to R, G and B, so hue along the edge is preserved.' },
      { question: 'Clarity or Sharpen: which one?', answer: 'Sharpen works at a radius of a few pixels and affects edges; Clarity works at 2 percent of the long side, weighted to midtones, and raises local contrast across whole shapes. Most photos take a little of both, with Texture for fine surfaces.' },
      { question: 'Does sharpening make the file bigger?', answer: 'Yes, a little. Sharpened edges have more high-frequency content for the JPG encoder to keep; expect roughly 5 to 10 percent more bytes at the same quality.' },
    ],
    related: [
      { label: 'Compress an image', to: '/tools/compress-image', description: 'Sharpened edges cost bytes; re-check the file size after export.' },
      { label: 'Reduce image noise', to: '/tools/reduce-image-noise', description: 'Denoise first, then sharpen above it so the grain is not amplified.' },
      { label: 'Adjust image contrast', to: '/tools/adjust-image-contrast', description: 'Global contrast and Clarity solve different problems; compare them side by side.' },
      { label: 'Resize an image', to: '/tools/image-resizer', description: 'Downsizing softens; sharpen slightly more when the target is small.' },
      { label: 'Remove blemishes', to: '/tools/remove-blemishes', description: 'Heal spots before sharpening so they are not emphasized.' },
      { label: 'The editor guide', to: '/tutorials/aperture', description: 'Panels, layers, masks and keyboard shortcuts in one place.' },
    ],
    primaryKeyword: 'sharpen photo online',
    secondaryKeywords: ['unsharp mask online', 'sharpen blurry photo', 'sharpen image radius threshold', 'clarity and texture photo', 'make photo sharper online', 'photo sharpening tool'],
    supportedFormats: {
      supportedInputFormats: ['JPG', 'PNG', 'WebP', 'GIF', 'HEIC', 'HEIF', 'AVIF', 'TIFF', 'BMP'],
      supportedOutputFormats: ['JPG', 'PNG', 'WebP', 'AVIF', 'TIFF'],
      processingNotes: [
        'Radius is in pixels of the exported file; when you cap the export at 12 MP the server downsizes the result after sharpening.',
        'TIFF export is about 3 MB per megapixel and keeps every sharpened level without JPG ringing.',
      ],
    },
    workedExamples: [
      {
        title: 'Output sharpening a 6000 x 4000 landscape, 24 MP, 10.8 MB JPG',
        body: 'Sharpen Amount 100, Radius 1, Threshold 0, exported at 24 MP on a Premium account. Along a 77/179 edge the two nearest pixels become 46 and 209, the next pair 71 and 184, and pixels three away change by less than one level. Adding Clarity 25 applies a 120 px sigma unsharp mask with gain 0.15 weighted to midtones; a mid-gray pixel 0.1 above its wide surround moves up by 0.015, about 4 levels. JPG quality 92 comes out around 11.3 MB, 5 percent more than the unsharpened file.',
      },
      {
        title: 'Portrait from a 4032 x 3024 phone, 12.2 MP, 3.9 MB HEIC, signed in',
        body: 'Amount 120, Radius 0.8, Threshold 8. A 2-level ripple in the cheek (130, 126, 130, 126) is below the threshold and stays exactly as it was; at Threshold 0 the same pixels would become about 131 and 124. An eyelash edge of 89 against 149 has its two nearest pixels pushed to 71 and 167, 18 levels each way. One everyday operation for the WebP export at quality 90, about 3.1 MB.',
      },
    ],
    whenNotToUse: `Do not sharpen a photo that is already noisy or heavily JPG-compressed without a threshold, because the unsharp mask amplifies grain and block edges before it reaches real detail; denoise first or raise Threshold. Real motion blur or badly missed focus cannot be undone by any unsharp mask, which only increases contrast at edges that already exist; a radius above 3 px just paints halos. If you only need a quick uniform crispen on a small image, the one-shot Sharpen image tool on Media Manipulator is faster and needs no editor session.`,
    embed: { title: 'Sharpen a photo', description: 'Drop a photo to open the Detail panel; press Judge at 100% and set Amount, Radius and Threshold.' },
  },

  // ------------------------------------------------------------------ straighten-photo
  {
    slug: 'straighten-photo',
    name: 'Straighten a photo',
    h1: 'Straighten a Crooked Photo Online',
    tagline: 'Fix a tilted horizon by angle or by drawing a line, then auto-crop to the largest rectangle.',
    metaTitle: 'Straighten a Crooked Photo Online: Fix a Tilted Horizon',
    metaDescription:
      'Level a tilted horizon in the browser: type an angle or draw a line along the horizon, auto-crop to the largest inner rectangle, and export at full resolution.',
    ogTitle: 'Straighten a Crooked Photo Online',
    ogDescription:
      'Draw a line along the horizon and the rotation is set for you. Auto-crop keeps the largest rectangle, or fill the corners with transparency, the edge or a color.',
    intro: `Straighten lives in the Geometry panel of ${PHOTO_BRAND} and is applied to the source pixels before any adjustment layer. You can type an angle in degrees, or press Draw a line and drag along something that should be level or upright; the editor computes the tilt of your line, folds it into the range -45 to 45 degrees, and sets the rotation to cancel it. Rotation is one inverse-mapped bilinear resample, so pixels are sampled exactly once. By default the frame auto-crops to the largest rectangle of the original aspect that contains only real pixels; turn that off and the corners are filled with transparency, the stretched edge, or a color you choose. The crop, flips and perspective share the same single resample.`,
    whatItDoes: [
      'Rotates by any angle from -360 to 360 degrees with a single bilinear resample of the original pixels; 90 and 180 degree steps are exact copies.',
      'Sets the angle from a line you draw: the tilt of the line is wrapped into (-45, 45] degrees and subtracted, so a line along a horizon or a door frame both work.',
      'Auto-crops to the largest centered rectangle of the original aspect whose entire perimeter lands inside the rotated source, found by a 30-step binary search.',
      'Fills empty corners with transparency, the clamped edge pixel, or a solid color when you prefer to keep the whole rotated frame.',
      'Keeps masks aligned: every mask is stored in the straightened, cropped space, and the export renders the same geometry on the original.',
    ],
    flowSteps: [
      { title: 'Drop the photo', description: 'The Geometry panel opens in front with the Straighten section and the Draw a line button.' },
      { title: 'Draw along the horizon', description: 'Click Draw a line, drag from one end of the horizon to the other; a drag shorter than 8 px is ignored. The angle field updates.' },
      { title: 'Check the crop', description: 'Auto-crop to the largest rectangle is on by default. Turn it off and pick a fill if you want the corners kept.' },
      { title: 'Export', description: 'The server rotates and crops the original at full resolution and encodes JPG, PNG, WebP, AVIF or TIFF.' },
    ],
    advancedDetails: [
      'The rotated canvas grows to the bounding box of the rotated source: width |w cos| + |h sin|, height |w sin| + |h cos|, rounded. A 6000 x 4000 photo rotated 2.5 degrees has a 6169 x 4258 canvas. Each output pixel center is mapped back through the crop, the perspective homography, the flips and the inverse rotation to a continuous source coordinate and sampled bilinearly from its four neighbors; coordinates outside the source take the fill.',
      'Auto-crop searches for the largest scale s of a centered rectangle of the requested aspect such that all 100 sample points along its perimeter (25 per side) map inside the source, by binary search on s for 30 iterations. For 2.5 degrees on 6000 x 4000 that gives a crop of 88.44 percent of the canvas in each direction, 5456 x 3766 pixels, 20.55 MP, keeping 85.6 percent of the original pixels. At 1.2 degrees it keeps 92.5 percent, at 5 degrees about 79 percent.',
      'Draw a line: the angle of the line in screen coordinates (y down) is atan2(dy, dx) in degrees, reduced by multiples of 90 into (-45, 45], and its negative is added to the current rotation, rounded to 0.01 degree. A line from (200, 1080) to (1800, 1020) on a 1920 px preview is a 2.15 degree tilt and sets the rotation to +2.15.',
      'Fill: Transparent writes RGBA 0 outside the source (PNG and WebP keep it; JPG shows it as black), Stretch the edge clamps the sample to the nearest edge texel, and Color writes an opaque #rrggbb. Bilinear interpolation is also applied to the alpha channel, so a transparent fill has a one-pixel soft border.',
      `${PHOTO_BRAND} previews on your GPU (WebGL2) from a 1920 px copy, renders the export on our server from the original at full resolution with the same formulas, and the two agree within a small documented tolerance: for geometry that is a maximum of 2 8-bit levels over the interior with a 2 px border excluded, since the bilinear sample positions differ slightly at the two scales; color operations are held to a mean of 1 level and grain is exact.`,
    ],
    whyItMatters: [
      'A horizon tilted by even one degree is visible on a sea or lake shot and is the first thing a viewer notices.',
      'Drawing the line is faster and more accurate than nudging a slider, because the editor measures the tilt rather than you estimating it.',
      'Knowing how many pixels the crop costs lets you decide between a tight auto-crop and a filled corner before export.',
    ],
    useCases: [
      { title: 'Seascapes and sunsets', description: 'Draw along the water line. A 1.5 degree correction on a 24 MP frame keeps 92.6 percent of the pixels.' },
      { title: 'Buildings and doorways', description: 'Draw along a vertical edge instead; the angle wraps into the same -45 to 45 range so uprights work as well as horizons.' },
      { title: 'Scanned documents and prints', description: 'Draw along the paper edge, use Stretch the edge as the fill, and export PNG so nothing is re-compressed.' },
      { title: 'Phone photos taken in a hurry', description: 'A 2 degree fix on a 4032 x 3024 shot costs about 9 percent of the pixels and still leaves 11 MP.' },
    ],
    whyMediaManipulator: [
      'Straighten, crop, flip and perspective are folded into one resample, so a straightened photo is not softened twice.',
      'The crop fraction is computed from the geometry, not guessed, and the export size is shown before you commit an everyday operation.',
      'Masks and heals move with the geometry, so you can straighten after retouching without redoing the mask work.',
    ],
    privacyNote: `Straightening is pure geometry on your own pixels; no model, no third-party service. Signed out, the rotated preview is computed in your browser and nothing is uploaded until you export, which is a normal guest job. Signed in, the original and its 1920 px preview stay on our server under your retention setting and are removed with the project. ${RETENTION_PROMISE}.`,
    faq: [
      { question: 'How much of the photo do I lose when straightening?', answer: 'It depends on the angle and the aspect. On a 3:2 frame, 1 degree keeps about 95 percent of the pixels, 2.5 degrees about 86 percent and 5 degrees about 79 percent, with the auto-crop holding the original aspect ratio.' },
      { question: 'Can I keep the corners instead of cropping?', answer: 'Yes. Switch off Auto-crop to the largest rectangle and choose a fill: Transparent for PNG or WebP output, Stretch the edge to smear the border pixels outward, or Color for a solid fill.' },
      { question: 'Does rotating by a small angle blur the photo?', answer: 'A single bilinear resample softens very slightly, about what a half-pixel shift does. The editor never resamples twice for straighten plus crop, and 90 and 180 degree turns are exact.' },
      { question: 'Which way is positive rotation?', answer: 'Positive angles rotate clockwise on screen. Drawing a line that slopes down to the right produces a positive correction that lifts the right side.' },
      { question: 'Can I straighten a vertical line instead of the horizon?', answer: 'Yes. Any line within 45 degrees of vertical is treated as something that should be upright, so a lamp post or door edge sets the same rotation a horizon would.' },
      { question: 'What happens to a mask I painted before straightening?', answer: 'Masks live in the corrected frame. Changing the crop re-maps every mask coordinate and re-samples brush strokes into the new space in the same edit, so the adjustment stays on the same picture content.' },
    ],
    related: [
      { label: 'Fix perspective', to: '/tools/fix-perspective-photo', description: 'Converging verticals need the four-corner tool, not a rotation.' },
      { label: 'Add a vignette', to: '/tools/add-vignette', description: 'A vignette is computed on the straightened, cropped frame.' },
      { label: 'Resize an image', to: '/tools/image-resizer', description: 'Bring the cropped result to an exact pixel size afterwards.' },
      { label: 'Remove EXIF metadata', to: '/tools/remove-exif-metadata', description: 'Strip the orientation tag and location data from the exported file.' },
      { label: 'The editor guide', to: '/tutorials/aperture', description: 'Where Geometry sits in the pipeline and how masks follow it.' },
    ],
    primaryKeyword: 'straighten photo online',
    secondaryKeywords: ['fix tilted horizon', 'straighten crooked picture', 'rotate photo by degrees', 'level horizon online', 'auto crop after rotate', 'straighten image tool'],
    supportedFormats: {
      supportedInputFormats: ['JPG', 'PNG', 'WebP', 'GIF', 'HEIC', 'HEIF', 'AVIF', 'TIFF', 'BMP'],
      supportedOutputFormats: ['JPG', 'PNG', 'WebP', 'AVIF', 'TIFF'],
      processingNotes: [
        'A transparent corner fill survives only in PNG, WebP, AVIF and TIFF; JPG has no alpha and shows the fill as black.',
        'The export dialog shows the post-crop size; the 12 MP guest cap applies to that size, not to the original.',
      ],
    },
    workedExamples: [
      {
        title: 'A 6000 x 4000 seascape tilted 2.5 degrees, 24 MP, 10.8 MB JPG',
        body: 'Drawing a line along the horizon sets the rotation to 2.5 degrees. The rotated canvas is 6169 x 4258; auto-crop keeps a centered rectangle of 88.44 percent of each side, 5456 x 3766 pixels, 20.55 MP, which is 85.6 percent of the original pixels. Exported as JPG quality 92 at the full size on a Premium account the file is about 9.2 MB; at the 12 MP guest cap it is downsized and comes to about 5.4 MB. One everyday operation.',
      },
      {
        title: 'A 4032 x 3024 phone shot leaning 1.8 degrees, 12.2 MP, 4.4 MB',
        body: 'Angle typed as 1.8. Canvas 4125 x 3149; auto-crop keeps 92.28 percent of each side, 3807 x 2906 pixels, 11.06 MP, or 90.7 percent of the original. With auto-crop switched off and Fill set to Transparent, the export is the full 4125 x 3149 canvas with four small transparent corner triangles, each about 130 px tall at the widest point, and must go out as PNG (around 28 MB) or WebP (about 3.9 MB at quality 90) to keep them.',
      },
    ],
    whenNotToUse: `Do not use straighten when the lines in the photo converge rather than tilt: a building that leans back because the camera pointed upward needs the four-corner perspective tool, and rotating it only trades one tilted wall for another. For a plain 90 degree turn use the Rotate 90 degrees buttons, which copy pixels exactly with no resample. If you only need the EXIF orientation flag applied so the file displays the right way up, a resize or metadata tool handles that without opening an editor project.`,
    embed: { title: 'Straighten a crooked photo', description: 'Drop a photo to open the Geometry panel; type an angle or draw a line along the horizon.' },
  },

  // ------------------------------------------------------------------ fix-perspective-photo
  {
    slug: 'fix-perspective-photo',
    name: 'Fix perspective',
    h1: 'Fix Perspective in a Photo Online',
    tagline: 'Drag four corners to correct keystone and converging verticals, then auto-crop the result.',
    metaTitle: 'Fix Perspective in a Photo Online: Keystone Correction',
    metaDescription:
      'Correct converging verticals and keystone distortion in the browser by dragging four corners. A projective map, bilinear resampling, auto-crop and full-resolution export.',
    ogTitle: 'Fix Perspective in a Photo Online',
    ogDescription:
      'Straighten leaning buildings and skewed documents with a four-corner perspective tool, one bilinear resample, and an automatic crop to the largest clean rectangle.',
    intro: `Perspective correction in the ${PHOTO_BRAND} Geometry panel is a four-corner projective transform. Press Drag the corners and pull each corner of the frame outward or inward; the editor builds the homography that maps the unit square onto your quadrilateral (Heckbert's construction) and inverse-maps every output pixel through it, sampling the source bilinearly. Because it is a true projective map rather than a stretch, the converging verticals of a building shot from the street become parallel while straight lines stay straight. Perspective, rotation, flips and crop are all applied in one resample before any adjustment layer. With Auto-crop to the largest rectangle on, the frame is trimmed to the biggest clean rectangle of the original aspect; off, the stretched corners are filled with transparency, the edge or a color.`,
    whatItDoes: [
      'Maps the frame through a projective transform defined by four corner offsets, each clamped to half the frame so a corner can never cross the middle.',
      'Corrects keystone in either axis: pull the top corners outward to fix verticals that converge upward, or the side corners to square a document photographed at an angle.',
      'Resamples once, bilinearly, from the original pixels for crop, perspective, flip and rotate together, so the corrected image is not softened by repeated passes.',
      'Auto-crops to the largest centered rectangle whose whole perimeter samples real pixels, or keeps the full canvas with your chosen fill.',
      'Exports the corrected original at full resolution on our server with the same homography coefficients the preview used.',
    ],
    flowSteps: [
      { title: 'Drop the photo', description: 'The Geometry panel opens with the Perspective section; press Drag the corners.' },
      { title: 'Pull the corners', description: 'For a building that leans back, drag the top-left corner left and the top-right corner right until the verticals read as parallel. Drag a few percent at a time.' },
      { title: 'Decide the crop', description: 'Auto-crop trims to the largest rectangle. Switch it off and choose Transparent, Stretch the edge or Color to keep the whole canvas.' },
      { title: 'Export', description: 'JPG, PNG, WebP, AVIF or TIFF, rendered from the original. Reset perspective at any time to return to zero offsets.' },
    ],
    advancedDetails: [
      'Each corner stores an offset (x, y) in units of the post-rotation canvas size, so tl = (-0.06, 0) means the top-left corner is moved outward by 6 percent of the width. The four target points, tl, tr = (1 + x, y), br = (1 + x, 1 + y) and bl = (x, 1 + y), define a quadrilateral, and the unit square is mapped onto it with the eight-coefficient homography x = (a u + b v + c) / (g u + h v + 1), y = (d u + e v + f) / (g u + h v + 1), computed with Heckbert\'s closed form; a parallelogram (zero projective terms) reduces to the affine case.',
      'For a 4000 x 6000 portrait with tl.x = -0.06 and tr.x = +0.06, the coefficients are a = 1.12, b = 0.06, c = -0.06, e = 1.12 and h = 0.12 with the rest 0: the top row of the output samples a source row 12 percent wider than itself, so verticals that converged by 12 percent of the frame width become parallel.',
      'Every output pixel center is sent through the homography, then the flips and the inverse rotation, to a continuous source coordinate and bilinearly interpolated from its four neighbors; samples outside the source take the fill, and the alpha channel is interpolated the same way so a transparent fill has a soft one-pixel border.',
      'Auto-crop runs a 30-step binary search for the largest centered rectangle of the canvas aspect whose 100 perimeter samples all land inside the source. For the 6 percent correction above it keeps 89.83 percent of each side, 3593 x 5390 pixels, 80.7 percent of the 24 MP original; a 10 percent correction keeps 71.6 percent. Pulling the corners inward instead needs no crop at all because every output pixel maps inside the source.',
      `The ${PHOTO_BRAND} preview is drawn on your GPU (WebGL2) from a 1920 px copy, the export is rendered on our server from the original at full resolution with the same formulas, and the two agree within a small documented tolerance; for geometry that is a maximum of 2 8-bit levels in the interior with a 2 px border excluded, while color operations are held to a mean of 1 level and grain is exact.`,
    ],
    whyItMatters: [
      'Converging verticals make a building look like it is falling over backward; a projective correction is the only transform that fixes them while keeping lines straight.',
      'A document or whiteboard photographed from the side becomes a readable rectangle once the four corners are mapped back to square.',
      'Seeing the crop cost up front lets you shoot or crop with enough margin rather than discovering a cut-off roofline after export.',
    ],
    useCases: [
      { title: 'Architecture shot from the street', description: 'Pull the top corners outward 4 to 8 percent until the window columns are parallel; expect to keep 80 to 90 percent of the pixels.' },
      { title: 'Whiteboards and posters', description: 'Drag each corner of the frame onto the corner of the board; turn auto-crop off and crop manually to the board afterward.' },
      { title: 'Interiors with a wide lens', description: 'Small corrections of 2 to 3 percent on the top corners square up door frames without the stretched look of a large fix.' },
      { title: 'Product packshots', description: 'Square up a box photographed slightly from above so its front face is a true rectangle before cutting out the background.' },
    ],
    whyMediaManipulator: [
      'The map is a documented projective homography, so the result is exact geometry rather than a warp approximated with a mesh.',
      'Perspective shares one bilinear resample with straighten, flip and crop, which matters when a photo needs both a tilt fix and a keystone fix.',
      'The corrected original is exported at full resolution, up to 120 MP on Pro, with the preview held within a documented tolerance.',
    ],
    privacyNote: `A perspective fix is arithmetic on coordinates and uses no AI model and no outside service. Without an account the corrected preview exists only in your browser until you export, and that upload is kept like any guest job. With an account the original, its 1920 px preview and thumbnail remain on our server under your retention setting and are deleted with the project. ${RETENTION_PROMISE}.`,
    faq: [
      { question: 'How far can I drag a corner?', answer: 'Each corner offset is clamped to plus or minus half the canvas size in each axis, so a corner can approach the middle of the frame but never cross it. Corrections beyond about 15 percent usually look stretched anyway.' },
      { question: 'Why does the auto-crop remove so much when I fix a tall building?', answer: 'Pulling the top corners outward means the top of the output has to sample a wider strip of the source than exists, so the sides must be trimmed until the whole perimeter is real pixels. A 6 percent pull on a 3:2 portrait keeps about 81 percent of the pixels.' },
      { question: 'Can I combine perspective with straightening?', answer: 'Yes. Rotation is applied first, then the perspective offsets are interpreted on the rotated canvas, and both go through one bilinear resample, so draw the horizon line first and then square the verticals.' },
      { question: 'Is this the same as lens distortion correction?', answer: 'No. Barrel and pincushion distortion bend straight lines and need a radial model. The perspective tool only handles converging lines; a bent line stays bent after it.' },
      { question: 'What does Reset perspective do?', answer: 'It sets all four corner offsets back to zero and removes the homography, leaving any rotation, flip and crop you set in place. The button is disabled while the offsets are already zero.' },
      { question: 'Will the corrected photo be blurry?', answer: 'Stretched regions are interpolated and lose a little sharpness, roughly in proportion to the stretch; a 6 percent correction is barely detectable at 100 percent zoom. A light Sharpen layer above it restores the edge contrast.' },
    ],
    related: [
      { label: 'Straighten a photo', to: '/tools/straighten-photo', description: 'A tilted horizon is a rotation, not a perspective problem.' },
      { label: 'Sharpen a photo', to: '/tools/sharpen-photo-online', description: 'Restore edge contrast in the stretched parts of the corrected frame.' },
      { label: 'Remove the background', to: '/tools/remove-background-from-image', description: 'Square up a product shot, then cut it out.' },
      { label: 'Compress an image', to: '/tools/compress-image', description: 'Shrink the exported file for a listing or a slide.' },
      { label: 'The editor guide', to: '/tutorials/aperture', description: 'How geometry, masks and layers are ordered in the pipeline.' },
    ],
    primaryKeyword: 'fix perspective photo online',
    secondaryKeywords: ['keystone correction online', 'fix converging verticals', 'straighten building photo', 'perspective correction tool', 'four corner perspective', 'square up a document photo'],
    supportedFormats: {
      supportedInputFormats: ['JPG', 'PNG', 'WebP', 'GIF', 'HEIC', 'HEIF', 'AVIF', 'TIFF', 'BMP'],
      supportedOutputFormats: ['JPG', 'PNG', 'WebP', 'AVIF', 'TIFF'],
      processingNotes: [
        'Transparent corner fill needs PNG, WebP, AVIF or TIFF; a JPG export shows the fill as black.',
        'The output size after auto-crop is what the 12 MP guest cap and the 24, 64 and 120 MP plan caps are measured against.',
      ],
    },
    workedExamples: [
      {
        title: 'A leaning office tower, 4000 x 6000 portrait, 24 MP, 12.1 MB JPG',
        body: 'Top-left corner dragged to x = -0.06, top-right to x = +0.06, bottom corners untouched. The homography is a = 1.12, b = 0.06, c = -0.06, e = 1.12, h = 0.12. Auto-crop keeps 89.83 percent of each side: 3593 x 5390 pixels, 19.4 MP, 80.7 percent of the original. On a Premium account the JPG quality 92 export is about 8.7 MB; a guest export is downsized to 12 MP, about 5.4 MB. One everyday operation.',
      },
      {
        title: 'A whiteboard photographed from the left, 4032 x 3024 phone JPG, 12.2 MP',
        body: 'Top-left x = -0.05, top-right x = +0.05, bottom-left y = +0.02, bottom-right y = -0.02 to square the board. The coefficients come out to a = 1.10, b = 0.073, c = -0.05, e = 1.146, h = 0.146. Auto-crop keeps 90.95 percent per side, 3667 x 2750 pixels, 10.1 MP, 82.7 percent of the frame. Exported as PNG for crisp marker text at about 2.5 MB per megapixel, roughly 25 MB; as WebP quality 90 about 3.1 MB.',
      },
    ],
    whenNotToUse: `Do not reach for the perspective tool when a line is curved rather than converging: barrel distortion from a wide lens needs a radial correction that this editor does not offer, and a projective map will leave the curve in place. A simple tilt is a rotation and belongs to Straighten, which costs fewer pixels. Very large corrections, above roughly 15 percent of the frame, stretch the far edge so much that detail turns soft and the crop removes a third of the picture; reshoot from farther back with a longer focal length when you can.`,
    embed: { title: 'Fix perspective in a photo', description: 'Drop a photo to open the Geometry panel; press Drag the corners and square up the lines.' },
  },

  // ------------------------------------------------------------------ remove-blemishes
  {
    slug: 'remove-blemishes',
    name: 'Remove blemishes',
    h1: 'Remove Blemishes and Spots from a Photo Online',
    tagline: 'Paint over spots, press Heal, and let an inpainting model on our GPU fill them from the surrounding skin.',
    metaTitle: 'Remove Blemishes and Spots from a Photo Online: Heal Tool',
    metaDescription:
      'Paint over pimples, dust spots and stray marks, press Heal and an inpainting model on our own GPU fills them in. One AI operation per press, refunded if it fails, full-resolution export.',
    ogTitle: 'Remove Blemishes from a Photo Online',
    ogDescription:
      'Mark the spots with a brush, press Heal once, and LaMa inpainting on our GPU fills each spot from its surroundings. Non-destructive, with the original file left untouched.',
    intro: `The Heal panel in ${PHOTO_BRAND} is the one tool on this page that uses a model: you paint over each spot with the Spot brush, press Heal, and the painted mask plus the current image are sent to our own GPU server where LaMa inpainting reconstructs the covered pixels from what surrounds them. One press, with any number of spots marked, is one AI operation; it is refunded if the job fails, and in a saved project an identical repeat of the same mask on the same base is served from cache for free. The healed image becomes the new base that every later adjustment layer, mask and export starts from, while your original file is never modified. Skin, sensor dust, a stray hair on a backdrop and small signs all heal the same way.`,
    whatItDoes: [
      'Paints a spot mask with a hardness-80 brush at any size; dots and short strokes both work, and Clear spots empties the mask before you press Heal.',
      'Sends the mask with the current image to our GPU, where the LaMa inpainting model fills each masked region from the surrounding texture, in one job for all spots marked.',
      'Charges one AI operation per Heal press regardless of how many spots were marked, refunds it when the job fails, and returns a cached result at no charge for an identical repeat in a saved project.',
      'Makes the healed result the new base for the stack, so sharpening, color and masks applied later see clean skin, and the history panel can step back to before the heal.',
      'Leaves the original file untouched: the export renders the healed base at full resolution and writes a new file named with the (retouched) suffix.',
    ],
    flowSteps: [
      { title: 'Drop the photo', description: 'The Heal panel opens with the Spot brush active. Zoom in so each blemish is a few dozen screen pixels wide.' },
      { title: 'Mark the spots', description: 'Click or drag over each blemish with a brush slightly larger than the spot. The panel counts Spots marked as you go.' },
      { title: 'Press Heal', description: 'The mask is uploaded with the image and the job runs on our GPU; it can take up to a minute. Heals applied counts up when it returns.' },
      { title: 'Continue editing and export', description: 'Add more passes if needed, then adjust tone, sharpen and export. Undo or the history panel reverts a heal.' },
    ],
    advancedDetails: [
      'The brush paints a raster in the geometry-corrected space you see and maps every stroke back through the crop, perspective, flips and rotation to source pixel coordinates, so the mask matches the base pixels even on a straightened, cropped photo. Each stroke is stamped with hardness 80 and flow 100; the uploaded mask is white where the alpha exceeds 0.05 and black elsewhere, at the size of the current base.',
      'A Heal press is one job: in a saved project it is POST /api/photo/projects/:id/heal with the mask and the current base hash; signed out it is the stateless /api/photo/heal route with the photo and mask uploaded for that job only. The server runs the LaMa model on the current base and stores the result as a new base whose name is the SHA-256 of the previous base hash and the mask digest, so the same mask on the same base is recognized and returned from cache without another AI operation.',
      'The document records each heal as an entry with the mask reference and the new base reference; every renderer, the WebGL preview, the server export and the batch apply, starts from the latest base rather than the original. Removing the entry in history restores the previous base.',
      'Red-eye is a separate panel: click an eye, a small circular mask is placed (default radius 2 percent of the long side) and inside it the red channel is replaced by min(r, (g + b)/2), so a pupil at (200, 40, 40) becomes (40, 40, 40). It is ordinary per-pixel color math with no AI operation.',
      `Everything other than the heal itself follows the ${PHOTO_BRAND} parity policy: the preview is drawn on your GPU (WebGL2) from a 1920 px copy, the exported file is rendered on our server from the original, here the healed base, at full resolution with the same formulas, and the two agree within a small documented tolerance of a few 8-bit levels at most, exact for grain. The healed pixels themselves are produced once, on the server, and the preview shows a proxy of that same result.`,
    ],
    whyItMatters: [
      'Inpainting fills a spot with plausible texture from its neighborhood, which looks natural on skin and fabric where a blur or a clone stamp leaves a soft patch.',
      'Marking many spots and pressing once keeps the cost to a single AI operation and a single wait.',
      'Because the heal becomes a base rather than a destructive edit, a wrong press is one undo away and the original file stays intact.',
    ],
    useCases: [
      { title: 'Portrait skin cleanup', description: 'Mark pimples, small scars and stray hairs with a brush about 1.5 times the spot, press Heal once for the whole face.' },
      { title: 'Sensor dust on skies', description: 'Zoom to 100 percent, dot every dust shadow, heal once, and the smooth sky gradient is rebuilt without banding.' },
      { title: 'Product photos', description: 'Remove lint and fingerprints on a backdrop before cutting out the subject, so the edge is clean.' },
      { title: 'Scanned prints', description: 'Paint over scratches and spots from the scan glass; thin lines heal well when the brush covers them with a small margin.' },
    ],
    whyMediaManipulator: [
      `${PHOTO_BRAND} runs the inpainting model on hardware we operate, so your photo is never handed to an outside AI provider.`,
      'A failed heal is refunded and a repeated identical heal is free, so experimenting with the mask does not burn operations.',
      'The healed base feeds the same non-destructive stack as every other adjustment, with history, masks and full-resolution export.',
    ],
    privacyNote: `Heal is the one step on this page that leaves the browser before export: when you press Heal, the current image and the painted mask are uploaded and the LaMa model runs on our own GPU. Signed out, that upload exists only for that job and is kept like any guest job; the project itself stays in this browser. Signed in, the healed base is stored with the project under your retention setting and deleted with it. ${RETENTION_PROMISE}. No third-party AI service is involved.`,
    faq: [
      { question: 'Is each spot a separate AI operation?', answer: 'No. One press of Heal is one AI operation however many spots you painted, which is why the panel counts spots and lets you mark everything first.' },
      { question: 'What happens if healing fails?', answer: 'Nothing changes in the photo, the panel says the heal did not finish, and the AI operation is refunded. You can press Heal again with the same mask.' },
      { question: 'Can I heal a blemish on a photo I have straightened or cropped?', answer: 'Yes. Strokes are painted on the corrected view and mapped back through the geometry to source coordinates, so the mask lands on the right pixels of the base.' },
      { question: 'Does healing change the original file?', answer: 'Never. The result is stored as a new base inside the project and the export writes a separate file with the (retouched) suffix. Removing the heal in history returns to the previous base.' },
      { question: 'How big should the brush be?', answer: 'Slightly larger than the spot, with a margin of a few pixels, so the model does not sample the edge of the blemish itself. Oversized masks on textured areas take longer to look natural.' },
      { question: 'Is red-eye removal part of Heal?', answer: 'It is its own panel and needs no AI. Clicking an eye places a small circular mask and sets red to the smaller of itself and the average of green and blue inside it.' },
    ],
    related: [
      { label: 'Sharpen a photo', to: '/tools/sharpen-photo-online', description: 'Sharpen after healing so the spots are not emphasized first.' },
      { label: 'Reduce image noise', to: '/tools/reduce-image-noise', description: 'Smooth grain on skin after the spots are gone.' },
      { label: 'Select by color', to: '/tools/select-by-color', description: 'Even out skin tone on a color range selection once the blemishes are healed.' },
      { label: 'Remove the background', to: '/tools/remove-background-from-image', description: 'Cut out the subject after the backdrop is cleaned.' },
      { label: 'Remove EXIF metadata', to: '/tools/remove-exif-metadata', description: 'Strip location data before sharing the retouched portrait.' },
      { label: 'The editor guide', to: '/tutorials/aperture', description: 'Heal, history and bases explained alongside the rest of the editor.' },
    ],
    primaryKeyword: 'remove blemishes from photo online',
    secondaryKeywords: ['remove spots from photo', 'spot healing online', 'remove pimples from photo', 'remove dust spots from photo', 'photo retouching tool', 'red eye removal online'],
    supportedFormats: {
      supportedInputFormats: ['JPG', 'PNG', 'WebP', 'GIF', 'HEIC', 'HEIF', 'AVIF', 'TIFF', 'BMP'],
      supportedOutputFormats: ['JPG', 'PNG', 'WebP', 'AVIF', 'TIFF'],
      processingNotes: [
        'The heal mask must match the size of the current base; the editor builds it at that size automatically.',
        'Each Heal press is one AI operation; exports are everyday operations. Daily allowances are on the pricing page.',
      ],
    },
    workedExamples: [
      {
        title: 'Headshot, 6000 x 4000, 24 MP, 10.8 MB JPG, signed out',
        body: '7 blemishes marked with a 40 px brush and 2 stray hairs with 12 px strokes, then one Heal press: 1 AI operation, the photo and mask uploaded for that job only, back in under a minute. The healed base replaces the original for the rest of the session. Exported as JPG quality 92 at the 12 MP guest cap, about 5.4 MB, 1 everyday operation. Pressing Heal again without changing the mask runs the job again as a guest; in a saved project the same press would be a free cache hit.',
      },
      {
        title: 'Sky with sensor dust, 4032 x 3024, 12.2 MP, Premium account',
        body: 'Pass 1: 11 dust shadows dotted at 100 percent zoom, Heal pressed, 1 AI operation. Pass 2: 3 more found after lowering Exposure by 0.5 EV, Heal pressed again, a second AI operation on the new base. Undoing pass 2 and pressing Heal with the identical 3-spot mask is served from cache at no charge. Export at the full 12.2 MP as WebP quality 90, about 3.7 MB, 1 everyday operation.',
      },
    ],
    whenNotToUse: `Heal is for spots and small marks, not for removing a whole person or a large object: a mask covering a big area gives the model too little context and the fill turns blurry or repetitive, and the dedicated Remove object tool on Media Manipulator is built for that job. Do not use it to smooth skin texture overall; use noise reduction or a negative Texture value, which are free and reversible. Large skin areas with strong pattern, such as freckles, heal unevenly, so mark only the blemish and keep a small margin.`,
    embed: { title: 'Remove blemishes and spots', description: 'Drop a photo to open the Heal panel; paint over each spot, then press Heal once.' },
  },

  // ------------------------------------------------------------------ select-by-color
  {
    slug: 'select-by-color',
    name: 'Select by color',
    h1: 'Select by Color in a Photo Online',
    tagline: 'Pick a color with the eyedropper, widen the range with fuzziness, and adjust only that selection.',
    metaTitle: 'Select by Color in a Photo Online: Color Range Mask',
    metaDescription:
      'Build a color range mask in the browser: eyedropper, shift-click to add up to 8 colors, fuzziness measured in Lab color distance, feather and invert, then adjust only the selection.',
    ogTitle: 'Select by Color in a Photo Online',
    ogDescription:
      'A color range mask like a desktop Color Range command: eyedropper, up to 8 sampled colors, Lab-distance fuzziness, feather, invert and an overlay view. Then adjust only what you selected.',
    intro: `Color range is one of the six mask kinds in the ${PHOTO_BRAND} Masks panel, and it is the way to select by color: give any adjustment layer a mask, add a Color range component, click a color in the photo with the eyedropper, and every pixel whose color is close to it is selected. Closeness is measured as the CIE Lab distance between the pixel and the sampled color, and Fuzziness sets how far that distance may reach. Shift-click adds more sample colors, up to 8, and the selection takes the strongest match. Feather softens the edge, Invert flips it, Mask strength scales it, and the Mask view shows it as a red overlay or on its own. The mask is computed from the source photo and previewed instantly; the export renders the same mask on the original.`,
    whatItDoes: [
      'Samples a color from the photo with an eyedropper and selects pixels by their Lab color distance to it, which tracks how different the colors look rather than how different the RGB numbers are.',
      'Adds up to 8 target colors with shift-click and takes the maximum weight over all of them, so a sky with two blues or a jacket with highlights and shadows selects as one.',
      'Scales the selection radius with Fuzziness from 0 to 100, a Lab distance of 0 to 60, with a smooth roll-off over the outer half of the radius.',
      'Combines with other mask components by Add, Subtract or Intersect, then applies Mask feather, Invert and Mask strength to the folded result.',
      'Drives any adjustment: a Local adjustment for exposure, tone and saturation, an HSL layer for hue shifts, Levels, Curves or a black and white conversion limited to the selection.',
    ],
    flowSteps: [
      { title: 'Drop the photo and pick an adjustment', description: 'The Masks panel opens. Add a Local adjustment or select an existing layer and add a mask to it.' },
      { title: 'Add a Color range and click', description: 'Choose Color range, press Pick a color and click the color you want. Shift-click to add up to 8 colors.' },
      { title: 'Tune fuzziness and view the mask', description: 'Turn Mask view to Overlay and raise Fuzziness until the whole region is red; add a Subtract component if it spills.' },
      { title: 'Adjust and export', description: 'Set the layer sliders; only the selection changes. Export JPG, PNG, WebP, AVIF or TIFF, rendered from the original.' },
    ],
    advancedDetails: [
      'Each target color and each source pixel are converted from sRGB to CIE Lab (D65, standard matrix, with the 216/24389 linear segment). The distance is Delta E 76, the Euclidean distance over L, a and b. With Fuzziness f the radius is R = f/100 times 60 Lab units, and the weight is 1 - smoothstep(0.5 R, R, Delta E): full selection within half the radius, a cubic fade to zero at the radius. Over several targets the pixel takes the maximum weight; with no target the component is 0.',
      'A sky sampled at sRGB (92, 150, 214), Lab (60.7, -0.2, -38.4), at Fuzziness 20 (R = 12) selects a lighter patch of the same sky at (110, 165, 222), Delta E 7.1, with weight 0.91, and rejects a deeper blue at (60, 120, 200), Delta E 15.6, entirely. At Fuzziness 40 (R = 24) the deeper blue is included with weight 0.78 while a cloud at (235, 238, 240), Delta E 49.8, and a leaf green, Delta E 83.8, remain at 0 even at Fuzziness 60.',
      'Components fold left to right: Add is max(m, value), Subtract is min(m, 1 - value), Intersect is min(m, value). The folded mask is then blurred with a Gaussian whose sigma is feather/100 times 0.05 times the long side, 30 px at Mask feather 10 on a 6000 px photo, then inverted if Invert is on and multiplied by Mask strength, clamped to 0..1. The layer output is lerp(input, adjusted, mask).',
      'The color range reads the geometry-corrected source photo, not the output of earlier layers, so a selection does not change when you edit layers below it, and the same sampled colors select the same pixels in the preview and in the server render.',
      `The ${PHOTO_BRAND} preview is drawn on your GPU (WebGL2) from a 1920 px copy, the exported file is rendered on our server from the original at full resolution with the same formulas, and the two agree within a small documented tolerance: color operations such as the adjustment under this mask are held to a mean error of at most one 8-bit level, a 99th percentile of 2 and a maximum of 4, and grain is bit-exact.`,
    ],
    whyItMatters: [
      'Selecting by perceptual color distance picks up the whole of a sky or a garment including its lighter and darker parts, where an RGB tolerance would stop at the first shading change.',
      'Working as a mask rather than a one-time selection means the selection can be refined after the adjustment is applied, and reused by other layers.',
      'The overlay view makes spill obvious before you commit, so you are not guessing from the result.',
    ],
    useCases: [
      { title: 'Deepen a sky without touching the clouds', description: 'Sample the blue, Fuzziness 35, then a Local adjustment with Exposure -0.4 and Saturation +15; the clouds at Delta E near 50 stay out.' },
      { title: 'Change the color of a product', description: 'Sample the shirt, shift-click its shadow and highlight, then an HSL layer with Hue shifted; the background is untouched.' },
      { title: 'Even out skin tone', description: 'Sample a mid-skin value with Fuzziness 25, Mask feather 6, then lower Saturation slightly and lift Shadows on the selection.' },
      { title: 'Gray everything except one color', description: 'Select the color, Invert the mask, and add a Black and white layer with that mask so only the selected color stays.' },
    ],
    whyMediaManipulator: [
      'The mask is a documented Lab distance with a stated radius and roll-off, so the same fuzziness means the same selection on the next photo.',
      'A color range mask is free to compute and previews in real time on your GPU; only the subject mask uses an AI operation.',
      'Masks can be shared between layers and combined with gradients, brushes and luminosity ranges in one stack, then exported at full resolution.',
    ],
    privacyNote: `A color range mask is computed from your own pixels in Lab space and needs no server call. Signed out, the photo, the sampled colors and every mask stay in this browser until you export, which uploads the file for that one render as a guest job. Signed in, the original and its 1920 px preview and thumbnail are stored with the project under your retention setting and are deleted with it. ${RETENTION_PROMISE}. Nothing goes to a third party.`,
    faq: [
      { question: 'How is fuzziness measured?', answer: 'As a CIE Lab Delta E 76 distance. Fuzziness 100 is a radius of 60 Lab units; a pixel inside half the radius is fully selected and the selection fades to nothing at the full radius with a smoothstep.' },
      { question: 'How many colors can I sample for one selection?', answer: 'Up to 8 per Color range component, added with shift-click. Each pixel takes the strongest match among them, and you can add a second component if you need more.' },
      { question: 'Can I remove part of the selection?', answer: 'Yes. Add another component in Subtract mode, for example a brush over the spill or a second color range sampled on the unwanted color, and it is removed with min(m, 1 - value).' },
      { question: 'Why does the selection include shadows of a different brightness?', answer: 'Lab distance counts lightness as well as hue, so a shadow of the same hue 20 L units darker is about Delta E 20 away. Lower the fuzziness, or intersect with a Luminosity range to restrict the brightness.' },
      { question: 'Can I see the mask on its own?', answer: 'Set Mask view to Mask only for a gray scale view, or to Overlay to see it as red over the photo. The M key cycles the views while a mask is selected.' },
      { question: 'Does the selection change when I edit other layers?', answer: 'No. Color range reads the source photo after geometry, never the output of layers below, so adjusting exposure underneath does not shift the mask.' },
    ],
    related: [
      { label: 'Change image color', to: '/tools/change-image-color', description: 'Hue, saturation and lightness per color range, with or without a mask.' },
      { label: 'Color pop', to: '/tools/color-pop', description: 'Keep one color and gray the rest with a built-in look.' },
      { label: 'Image saturation', to: '/tools/image-saturation', description: 'Vibrance and saturation, which you can limit to the selection.' },
      { label: 'Remove the background', to: '/tools/remove-background-from-image', description: 'For cutting out a subject, the AI subject mask beats color selection.' },
      { label: 'Remove blemishes', to: '/tools/remove-blemishes', description: 'Heal spots before evening out a skin-tone selection.' },
      { label: 'The editor guide', to: '/tutorials/aperture', description: 'All six mask kinds and how they combine.' },
    ],
    primaryKeyword: 'select by color online',
    secondaryKeywords: ['color range selection online', 'select color in photo', 'change one color in photo', 'color range mask', 'select sky by color', 'fuzziness color selection'],
    supportedFormats: {
      supportedInputFormats: ['JPG', 'PNG', 'WebP', 'GIF', 'HEIC', 'HEIF', 'AVIF', 'TIFF', 'BMP'],
      supportedOutputFormats: ['JPG', 'PNG', 'WebP', 'AVIF', 'TIFF'],
      processingNotes: [
        'The mask is parametric (sampled colors, fuzziness, feather) and is re-rendered on the original at export, so it costs nothing in project size.',
        'Heavily compressed JPGs have blocky chroma that can give a ragged selection edge; a little Mask feather hides it.',
      ],
    },
    workedExamples: [
      {
        title: 'Deepening a sky, 6000 x 4000 landscape, 24 MP, 10.4 MB JPG',
        body: 'Sampled sky (92, 150, 214), Fuzziness 40, R = 24 Lab units. A lighter patch at Delta E 7.1 gets weight 1.0, a deeper blue at Delta E 15.6 gets 0.78, the clouds at Delta E 49.8 get 0. Mask feather 5 is a 15 px Gaussian on the 6000 px side. A Local adjustment with Exposure -0.5 EV darkens the fully selected sky from (92, 150, 214) to (78, 128, 183), and the 0.78-weighted deeper blue gets 78 percent of that change. JPG quality 92 export at 12 MP as a guest is about 5.4 MB.',
      },
      {
        title: 'Recoloring a jacket, 4000 x 6000 portrait, 24 MP, Pro account',
        body: 'Three samples by shift-click: the lit red (190, 40, 50), the shadow (120, 20, 30) and the highlight (230, 110, 115), Fuzziness 30, R = 18. The mask takes the maximum weight over the three so the whole jacket reads 1.0, while skin at (214, 170, 140) is Delta E 37 from the nearest sample and stays 0. The lips at (200, 90, 100) are only Delta E 9.6 from the highlight sample and would be caught, so a Subtract brush component over the mouth removes them. An HSL layer with the mask then shifts reds by +150 degrees of hue, turning the jacket teal. Exported at the full 24 MP as PNG, about 60 MB, or as AVIF at about 4.8 MB.',
      },
    ],
    whenNotToUse: `A color range selection is the wrong tool when the subject shares its colors with the background, such as a person in a green shirt on grass; use Select subject, the AI mask, or a brush instead. It also struggles on gray scale or very desaturated photos, where every pixel sits within a few Lab units of every other and fuzziness cannot separate them; a Luminosity range mask does better there. If you want to shift one hue everywhere in the photo, the HSL ranges on the Change image color page already do that without any mask.`,
    embed: { title: 'Select by color', description: 'Drop a photo to open the Masks panel; add a Color range, click a color, then adjust only the selection.' },
  },
];

export default PAGES;
