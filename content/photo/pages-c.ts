import { PHOTO_BRAND } from '@/lib/photo/brand';
import { RETENTION_PROMISE } from '@/content/retentionPromise';
import type { PhotoPageBody } from './types';

const PAGES: PhotoPageBody[] = [
  // ------------------------------------------------------------------ split-toning
  {
    slug: 'split-toning',
    name: 'Split toning',
    h1: 'Split Toning Online',
    tagline: 'Push one hue into the shadows and another into the highlights, then slide the balance point between them.',
    metaTitle: 'Split Toning Online: Color Shadows and Highlights Separately',
    metaDescription:
      'Tint shadows and highlights with two different hues in the browser: hue, saturation and balance sliders, live before/after, full-resolution export.',
    ogTitle: 'Split Toning Online',
    ogDescription:
      'Give the dark half of a photo one color and the bright half another, with a balance slider that decides where the two meet. Non-destructive, exported at full size.',
    intro:
      `Split toning adds a color cast to the dark tones of a photo and a different cast to the bright tones, which is how teal-and-orange grades, warm-highlight film looks and cyanotype-style monochromes are built. ${PHOTO_BRAND} runs it as a gamma-space color stage after exposure, tone and white balance in the layer stack: each pixel's BT.709 luma decides how much of the shadow hue and how much of the highlight hue it receives, and the Balance slider moves the point where one weight fades out and the other fades in. The adjustment is one layer among up to 64, so you can lower its opacity, restrict it with a mask or switch the blend mode to color so the luminance of the picture is never touched.`,
    whatItDoes: [
      'Adds a Split toning layer with Hue (0-360) and Saturation (0-100) sliders for Shadows and a second pair for Highlights, plus a Balance slider from -100 to 100.',
      'Weights every pixel by its luma: dark pixels take the shadow color, bright pixels take the highlight color, and mid-grays near the split point stay as they were.',
      'Keeps the maximum shift modest by design, a gain of 0.25 at full saturation, so even extreme settings tint rather than repaint.',
      'Shows the result live on the preview with the before/after split and the backslash hold-to-compare, and records every slider change in the history list.',
      'Exports the toned photo from the original pixels on the server as JPG, PNG, WebP, AVIF or TIFF, named with the retouched suffix.',
    ],
    flowSteps: [
      { title: 'Drop a photo', description: 'The editor opens with the Split toning panel in front and the image decoded in the browser.' },
      { title: 'Pick the two hues', description: 'Set the Shadows hue and the Highlights hue, then raise each Saturation slider until the cast is visible.' },
      { title: 'Move the balance', description: 'Slide Balance negative to give the highlight color more of the midtones, positive to let the shadow color climb higher.' },
      { title: 'Export', description: 'Choose a format and quality; the server renders the original at full resolution and the download starts.' },
    ],
    advancedDetails: [
      'Each pixel\'s luma L is 0.2126 R + 0.7152 G + 0.0722 B on sRGB-encoded values. The split point is e = 0.5 + balance / 100 x 0.25, so Balance -100 puts the split at 0.25 and Balance +100 puts it at 0.75. The shadow weight is 1 - smoothstep(0, e, L) and the highlight weight is smoothstep(e, 1, L), where smoothstep is the usual t x t x (3 - 2t) ramp.',
      'Each hue is turned into a fully saturated color with the standard hue-to-RGB fan (hue 220 gives red 0, green 0.333, blue 1; hue 40 gives 1, 0.667, 0). The layer then adds 0.25 x (saturation / 100) x weight x (hueColor - 0.5) per channel for each end and clamps to 0..1, so a channel can move at most 0.125 (about 32 of 255) per end, and only where the weight is 1.',
      'Because the shift is hueColor minus 0.5, a tone always pulls some channels down while it pushes others up: a blue shadow tone lowers red and green slightly while it raises blue, which is why toned shadows read as colored without turning muddy or brighter.',
      'At Balance 0 a pixel at luma 0.5 has both weights at 0, so a true mid-gray is unchanged no matter how high the saturations are; the two tones meet without overlapping at the split point and overlap only through the smooth ramps on either side of it.',
      'While you tune the toning, the preview is drawn on your GPU (WebGL2) from a 1920 px copy; the exported file is rendered on our server from the original at full resolution with the same split-tone formula, and preview and export agree within a small documented tolerance: a few 8-bit levels at most for color stages, exact for grain.',
    ],
    whyItMatters: [
      'A single global tint pushes everything the same direction, while split toning keeps shadows and highlights complementary, which is what gives a graded photo depth instead of a color cast.',
      'Film prints, cross-processed slides and most cinematic looks are two-hue grades underneath, and reproducing them with two hue sliders and a balance is faster than painting masks.',
      'Running it as a layer with opacity and blend mode means a strong grade can be dialed back to taste months later without starting the edit over.',
    ],
    useCases: [
      { title: 'Teal-and-orange portraits', description: 'Shadows hue 200 at Saturation 50, Highlights hue 40 at Saturation 30, skin stays warm while the background cools.' },
      { title: 'Warm film look on a black and white photo', description: 'Add a Black & white layer first, then tone shadows toward brown and highlights toward cream for a sepia print with separated tones.' },
      { title: 'Cold night scenes', description: 'Blue shadows with Balance at +30 push the cast higher into the midtones while street lights keep a faint amber highlight tone.' },
      { title: 'Matching a photo series', description: 'Save the toning as a look and apply it to every frame of a set so the colors in a gallery or a product grid agree.' },
    ],
    whyMediaManipulator: [
      `${PHOTO_BRAND} toning is a documented formula with published constants, so the same sliders give the same pixels in the browser preview, on the export server and in the phone app.`,
      'Nothing about the photo leaves your browser while you tune the hues; only the export, a subject mask or a heal sends the file, and a guest export is an ordinary job with guest retention.',
      'The split-toning stage sits in the same stack as masks, curves and levels, so a two-hue grade can be limited to the sky or to a luminosity range instead of the whole frame.',
    ],
    privacyNote:
      `Split toning is computed in your browser on the decoded photo; the file is sent to our server only when you export, select a subject or heal, and then the original is rendered with the same shadow and highlight weights. ${RETENTION_PROMISE}. Signed in, the original with its 1920 px preview stays under your retention setting and is deleted with the project.`,
    faq: [
      { question: 'What does the Balance slider actually move?', answer: 'It moves the luma value where the shadow weight has fallen to zero and the highlight weight starts to rise. Balance 0 puts that point at a luma of 0.5; each 100 points of Balance moves it 0.25, so +40 moves it to 0.6 and -40 to 0.4.' },
      { question: 'Why does a mid-gray pixel not change at all?', answer: 'With Balance at 0 the shadow weight is 1 - smoothstep(0, 0.5, L) and the highlight weight is smoothstep(0.5, 1, L). At L = 0.5 both ramps are at their zero end, so no color is added to a pixel of exactly middle luma.' },
      { question: 'How strong can the tint get?', answer: 'The gain constant is 0.25, so at Saturation 100 the largest per-channel shift is 0.25 x 0.5 = 0.125, roughly 32 levels of 255, and only where the weight is fully 1. Stack two Split toning layers if you need more than that.' },
      { question: 'Does split toning change brightness?', answer: 'Slightly, because the per-channel shifts do not sum to zero after luma weighting. Set the layer blend mode to color if you want the original luminance kept exactly and only the chroma moved.' },
      { question: 'Can I tone only the shadows?', answer: 'Yes. Leave the Highlights saturation at 0 and only the shadow term contributes; the highlight hue value is then ignored entirely.' },
      { question: 'Does this work on a black and white photo?', answer: 'It is one of the best uses. Put a Black & white layer below the Split toning layer; the gray values provide the luma weights and the two hues supply the only color in the picture.' },
    ],
    related: [
      { label: 'Color balance', to: '/tools/color-balance-photo', description: 'Three-band RGB shifts for shadows, midtones and highlights when you want per-channel control instead of hues.' },
      { label: 'Tint a photo', to: '/tools/tint-photo', description: 'A single photo filter color at a chosen density over the whole image.' },
      { label: 'Black and white', to: '/tools/black-and-white-photo', description: 'Convert to monochrome with six channel sliders before adding tones.' },
      { label: 'Apply a LUT', to: '/tools/apply-lut-to-photo', description: 'Load a .cube grade when a look is already captured as a 3D table.' },
      { label: 'Photo curves', to: '/tools/photo-curves', description: 'Shape contrast with per-channel curves to pair with the toning.' },
      { label: `${PHOTO_BRAND} tutorial`, to: '/tutorials/aperture', description: 'The editor walkthrough: layers, masks, history and export.' },
    ],
    primaryKeyword: 'split toning online',
    secondaryKeywords: ['split tone photo', 'teal and orange photo editor', 'tint shadows and highlights', 'duotone photo online', 'color grade photo in browser'],
    supportedFormats: {
      supportedInputFormats: ['JPG', 'PNG', 'WebP', 'GIF', 'HEIC', 'HEIF', 'AVIF', 'TIFF', 'BMP'],
      supportedOutputFormats: ['JPG', 'PNG', 'WebP', 'AVIF', 'TIFF'],
      processingNotes: [
        'HEIC, HEIF, TIFF and BMP need an account so the server can make an editable preview copy; the others decode in the browser.',
        'Export is capped at 12 megapixels without an account and on the Free plan; Premium and Pro export up to 120 megapixels.',
      ],
    },
    workedExamples: [
      {
        title: 'Blue shadows, amber highlights on a 24 MP portrait',
        body:
          'A 6000 x 4000 JPEG (24 MP, 9.6 MB). Shadows: Hue 220, Saturation 40. Highlights: Hue 40, Saturation 30. Balance 0, so the split sits at luma 0.5. A shadow gray of 0.2 has a shadow weight of 0.648 and becomes red 0.1676, green 0.1892, blue 0.2324, or (43, 48, 59) in 8-bit terms instead of (51, 51, 51). A highlight gray of 0.85 has a highlight weight of 0.784 and becomes (224, 219, 209) instead of (217, 217, 217). The 0.5 gray stays (128, 128, 128). Exported as JPG at quality 92 the file is about 10.8 MB and needs a Premium or Pro plan for the full 24 MP; as a guest it is downscaled to 12 MP, roughly 5.4 MB. One everyday operation.',
      },
      {
        title: 'Teal and orange with the balance pushed up',
        body:
          'A 4000 x 3000 phone JPEG (12 MP, 4.1 MB). Shadows: Hue 200, Saturation 60. Highlights: Hue 50, Saturation 50. Balance +20 moves the split point to 0.55. A 0.2 gray now has a shadow weight of 0.6995 and becomes (38, 55, 64); a 0.5 gray picks up a shadow weight of 0.0233 and shifts by less than one level to (127, 128, 128); a 0.85 gray has a highlight weight of 0.7407 and becomes (229, 225, 205). A brown shadow pixel at (0.3, 0.25, 0.2) lands at (66, 67, 61), visibly cooler. WebP export at quality 85 is about 3.6 MB and fits under the 12 MP guest cap at full size.',
      },
    ],
    whenNotToUse:
      'Skip split toning when the photo simply has a color cast you want to remove rather than add: a white balance fix with the Temperature and Tint sliders, or the Color balance panel with preserve luminosity on, corrects a cast without inventing a second hue. If you need one specific color everywhere at a chosen strength, the Photo filter on the tint page is simpler, and if the look you want is already a .cube file, the LUT page applies it exactly instead of approximating it with two hues.',
    embed: {
      title: 'Split tone a photo',
      description: 'Drop a photo to open the editor on the Split toning panel; set two hues and a balance, then export at full size.',
    },
  },

  // ------------------------------------------------------------------ apply-lut-to-photo
  {
    slug: 'apply-lut-to-photo',
    name: 'Apply a LUT',
    h1: 'Apply a LUT (.cube) to a Photo Online',
    tagline: 'Drop a .cube 3D LUT onto a photo, set its intensity and export the graded image at full resolution.',
    metaTitle: 'Apply a LUT to a Photo Online: Load a .cube File in the Browser',
    metaDescription:
      'Load a .cube 3D LUT up to size 65 and 1 MB, see the grade on a photo instantly, blend it with an intensity slider and export at full size.',
    ogTitle: 'Apply a LUT to a Photo Online',
    ogDescription:
      'Use a .cube color lookup table on a still photo. Trilinear lookup, intensity blend, masks and layers, exported from the original pixels.',
    intro:
      `A LUT is a lookup table that maps every input color to an output color, and the .cube format is how most camera profiles, film emulations and video grades are shared. ${PHOTO_BRAND} accepts a .cube file as a LUT layer: the table is parsed in the browser, quantized to bytes, uploaded to the GPU as a 3D texture and sampled trilinearly for every pixel of the 1920 px preview, after whatever exposure, curves or color layers sit below it in the stack. An Intensity slider blends between the untouched pixel and the looked-up one. Because the LUT text is stored inside the project document, the export server reads the same table and applies the same interpolation to the original at full size, so a grade built for video footage lands on a 24 megapixel still exactly as intended.`,
    whatItDoes: [
      'Adds a LUT layer: drop a .cube file or choose one, and the panel reports the cube size once the table parses.',
      'Applies a 3D LUT of any size from 2 to 65 points per axis, up to 1 MB of text, with trilinear interpolation between the eight nearest table entries.',
      'Blends the looked-up color with the input through an Intensity slider from 0 to 1, so a heavy cinematic grade can be used at half strength.',
      'Stacks with every other adjustment: put exposure or white balance below the LUT so the table receives a normalized image, and curves or grain above it.',
      'Removes the table with one click and keeps the layer slot, and records the load and every intensity change in the undoable history.',
    ],
    flowSteps: [
      { title: 'Drop a photo', description: 'The editor opens on the LUT panel with the image decoded locally.' },
      { title: 'Load the .cube file', description: 'Drag the LUT onto the panel or choose it; the size check and the parse run in the browser.' },
      { title: 'Set the intensity', description: 'Slide Intensity down from 1 if the full table is too strong; use the before/after split to compare.' },
      { title: 'Export', description: 'Pick a format, quality and size; the server renders the original with the same table.' },
    ],
    advancedDetails: [
      'A .cube file is plain text. A LUT_3D_SIZE N line declares the grid, optional TITLE, DOMAIN_MIN, DOMAIN_MAX and LUT_3D_INPUT_RANGE lines are skipped, comment lines start with #, and then N x N x N rows of three floats follow with red varying fastest, then green, then blue. A size-33 cube therefore has 35,937 rows and a size-65 cube has 274,625.',
      'The parser accepts a header from 2 up to 65; files that declare LUT_1D_SIZE are refused because only 3D tables are supported. The text is capped at 1 MB (1,048,576 bytes), and since a size-33 table with six-decimal values is already about 970 KB, 33 is the largest common grid that fits; a size-65 file would be about 7 MB and is rejected as too big before parsing.',
      'Every table value is quantized to a byte, round(value x 255) clamped to 0..255, so the table can be uploaded as an RGB8 3D texture. A value of 0.5 becomes 128/255 = 0.50196; this is the only precision loss and it is below the 8-bit export tolerance.',
      'Lookup is trilinear: the input color is scaled to 0..N-1 per axis, the lower cell index is floor(value) capped at N-2, and the result is a lerp along red, then green, then blue between the eight surrounding entries. The output is then lerp(input, lookup, intensity), so Intensity 0.6 contributes 60 percent of the table\'s shift.',
      'The graded preview is drawn on your GPU (WebGL2) from a 1920 px copy of the photo, and the exported file is rendered on our server from the original at full resolution with the same table and the same trilinear formula; the two agree within a small documented tolerance of a few 8-bit levels at most, and grain is exact.',
    ],
    whyItMatters: [
      'LUTs are the exchange format of color grading: a look built in a video editor, a camera manufacturer\'s log-to-display conversion or a purchased film pack can be used on stills without rebuilding it slider by slider.',
      'A 3D table can express color transforms that no combination of simple sliders reproduces, such as hue-dependent saturation changes that only affect oranges.',
      'Intensity blending and masks turn a fixed table into an adjustable one, which is the difference between a filter and an edit.',
    ],
    useCases: [
      { title: 'Match stills to graded footage', description: 'Apply the same .cube used on a video project to the behind-the-scenes photos so thumbnails and stills share the grade.' },
      { title: 'Film emulation packs', description: 'Load a purchased or free emulation LUT and set Intensity to 0.6 for a subtler version than the full table.' },
      { title: 'Camera profile conversions', description: 'Use a manufacturer-provided display LUT on a flat, low-contrast export from a camera\'s neutral profile.' },
      { title: 'Consistent client sets', description: 'Save the LUT layer as a look and batch-apply it to the rest of a shoot, 3 photos at a time on Free and up to 25 on Pro.' },
    ],
    whyMediaManipulator: [
      `${PHOTO_BRAND} reuses the same .cube parser and trilinear lookup that Darkroom uses for video, so a grade matched on footage in Media Manipulator and applied here to a still produces the same colors.`,
      'The LUT is applied inside a non-destructive stack with masks, so a cinematic table can be confined to the background while a subject mask keeps skin untouched.',
      'The table text travels with the project document, which means a saved project reopens with its grade intact and the export never depends on the file still being on your disk.',
    ],
    privacyNote:
      `The .cube text is parsed in your browser and stored in the project document; the photo itself is uploaded only when you export, select a subject or heal, and the server applies the same table to the original. ${RETENTION_PROMISE}. Signed-in projects keep the original and its 1920 px preview under your retention setting until the project or account is deleted.`,
    faq: [
      { question: 'What is a .cube file?', answer: 'A text file in the Adobe Cube format: a LUT_3D_SIZE line giving the grid size N, then N cubed lines of three output values between 0 and 1, ordered with red changing fastest. Each line is the output color for one input color on the grid; colors between grid points are interpolated.' },
      { question: 'What LUT sizes and file sizes are accepted?', answer: 'A LUT_3D_SIZE from 2 to 65 and a file no larger than 1 MB. In practice the 1 MB cap means a size-33 cube (35,937 rows) is the largest common grid that loads; size 17 (about 130 KB) and size 25 load with room to spare.' },
      { question: 'Why does a 1D LUT fail to load?', answer: 'Only 3D tables are supported. A file that declares LUT_1D_SIZE is refused with the invalid-file message; convert it to a 3D cube in the tool that made it, or rebuild the per-channel transform with the Curves panel, which does the same job for 1D tables.' },
      { question: 'Does the LUT expect a log or a normal image?', answer: 'That depends on the LUT. Camera log-to-display tables expect flat log footage, and applying one to a normal JPEG crushes contrast. Look-style tables made for display images are the right kind for ordinary photos. The Intensity slider will not fix a wrong-input-space LUT.' },
      { question: 'Are the colors interpolated or snapped to the grid?', answer: 'Interpolated. Each channel of the output is a trilinear blend of the eight grid entries around the input color, so a size-17 table still produces smooth gradients rather than visible steps.' },
      { question: 'Is the LUT sent to a third party?', answer: 'No. The table is kept in the project document, parsed in the browser and read by our own export server; nothing about the file or the photo is shared with anyone else.' },
    ],
    related: [
      { label: 'Photo curves', to: '/tools/photo-curves', description: 'Per-channel curves cover what a 1D LUT would do, with up to 16 points.' },
      { label: 'Split toning', to: '/tools/split-toning', description: 'Build a two-hue grade with sliders when you do not have a table.' },
      { label: 'Change image color', to: '/tools/change-image-color', description: 'Hue, saturation and lightness per color range for targeted shifts.' },
      { label: 'Fix photo exposure', to: '/tools/fix-photo-exposure', description: 'Normalize exposure below the LUT so the table receives the brightness it expects.' },
      { label: 'Compress image', to: '/tools/compress-image', description: 'Shrink the exported file further for the web once the grade is done.' },
    ],
    primaryKeyword: 'apply LUT to photo online',
    secondaryKeywords: ['cube LUT photo', 'apply .cube file to image', '3D LUT image editor', 'LUT for photos browser', 'color grade photo with LUT'],
    supportedFormats: {
      supportedInputFormats: ['JPG', 'PNG', 'WebP', 'GIF', 'HEIC', 'HEIF', 'AVIF', 'TIFF', 'BMP', '.cube (3D LUT, size 2-65, up to 1 MB)'],
      supportedOutputFormats: ['JPG', 'PNG', 'WebP', 'AVIF', 'TIFF'],
      processingNotes: [
        'The .cube table is quantized to 8 bits per entry and sampled trilinearly; 1D LUTs and tables larger than 1 MB are refused.',
        'HEIC, HEIF, TIFF and BMP photos need an account for an editable preview; export above 12 megapixels needs Premium or Pro.',
      ],
    },
    workedExamples: [
      {
        title: 'A size-33 warm LUT at full and at 0.6 intensity',
        body:
          'A 5472 x 3648 JPEG (20 MP, 8.3 MB) and a size-33 .cube of about 970 KB whose table multiplies red by 1.08 and blue by 0.92. A mid-gray of 0.5 looks up to red 0.5412, green 0.502, blue 0.4588, or (138, 128, 117); the green channel reads 0.502 rather than 0.5 because 0.5 was stored as the byte 128. At Intensity 0.6 the same gray lands at (134, 128, 121). A skin tone of (0.75, 0.6, 0.45) becomes (207, 153, 106) at full intensity and (201, 153, 109) at 0.6. Exported as PNG the 20 MP file is about 50 MB; as WebP at quality 90 about 6 MB; both need Premium or Pro above the 12 MP cap.',
      },
      {
        title: 'A size-2 identity cube on a sky pixel',
        body:
          'The smallest valid LUT has LUT_3D_SIZE 2 and 8 rows; written as the corner colors in red-fastest order (0 0 0, 1 0 0, 0 1 0, 1 1 0, 0 0 1, 1 0 1, 0 1 1, 1 1 1) it is an identity table. A sky pixel of (0.3, 0.6, 0.9) returns exactly (0.3, 0.6, 0.9) because trilinear interpolation between the 8 corners is linear in each channel and the corner bytes 0 and 255 are exact. Swapping the second and fifth rows turns it into a red-blue channel swap. A 4000 x 3000 JPEG (12 MP) exports under the guest cap at full size, about 5.4 MB at quality 92, as one everyday operation.',
      },
    ],
    whenNotToUse:
      'Do not reach for a LUT when the problem is a per-channel brightness mapping, since the Curves panel does that with up to 16 editable points and no file to manage, or when you only want to tone shadows and highlights, which the split-toning page does with two hue sliders. A log-to-display LUT applied to an already display-referred JPEG will wreck the contrast; use the Basic panel instead. And if your table is larger than 1 MB or a 1D LUT, it must be converted elsewhere first.',
    embed: {
      title: 'Apply a .cube LUT',
      description: 'Drop a photo to open the LUT panel, then drop a .cube file onto it; set the intensity and export.',
    },
  },

  // ------------------------------------------------------------------ invert-image-colors
  {
    slug: 'invert-image-colors',
    name: 'Invert colors',
    h1: 'Invert Image Colors Online',
    tagline: 'Flip every pixel to its negative, as a non-destructive layer you can mask, blend or undo.',
    metaTitle: 'Invert Image Colors Online: Make a Negative of a Photo',
    metaDescription:
      'Invert a photo to its negative in the browser with one click. Each channel becomes 1 minus its value; mask it, stack it and export at full resolution.',
    ogTitle: 'Invert Image Colors Online',
    ogDescription:
      'Turn a photo into its negative, or a scanned negative into a positive, with an invert layer that can be masked and blended. Full-size export.',
    intro:
      `Inverting an image replaces every color with its opposite: black becomes white, a deep blue sky becomes a warm orange, and a scanned film negative becomes a viewable positive. In ${PHOTO_BRAND} this is the Invert entry of the Effects panel, an adjustment layer in the gamma-space stage of the stack that computes 1 minus each channel of the sRGB-encoded pixel. Because it is a layer rather than a destructive filter, you can mask it to a region, lower its opacity for a partial inversion (at exactly 50 percent every pixel lands on mid-gray), set its blend mode to luminosity to flip tones while keeping hues, or stack it below Levels and Curves to finish a negative conversion. The same panel holds Posterize, Threshold and Gamma, which combine naturally with an inversion.`,
    whatItDoes: [
      'Adds an Invert layer from the Effects panel that maps each channel to 1 minus its value, turning the photo into its exact negative.',
      'Accepts a mask so only a selected area, a luminosity range or a color range is inverted while the rest stays as shot.',
      'Supports opacity and the normal, luminosity and color blend modes, which gives partial, tone-only or hue-only inversions.',
      'Stacks with Levels, Curves and the other Effects entries so an inverted film scan can be color-corrected in the same project.',
      'Exports the inverted result from the original at full resolution as JPG, PNG, WebP, AVIF or TIFF with metadata kept or stripped.',
    ],
    flowSteps: [
      { title: 'Drop a photo', description: 'The editor opens on the Effects panel with the image decoded in the browser.' },
      { title: 'Add Invert', description: 'Choose Invert in the Effects panel; the preview flips to the negative immediately.' },
      { title: 'Refine', description: 'Optionally add a mask, lower the opacity, or stack Levels and Curves above to correct a film scan.' },
      { title: 'Export', description: 'Pick a format and size; the server renders the original with the same inversion.' },
    ],
    advancedDetails: [
      'The formula is out = 1 - c for each of red, green and blue, on sRGB-encoded values between 0 and 1; there is no luma term, no gamma change and nothing to clamp because the input is already in range. In 8-bit terms a value v becomes 255 - v.',
      'Inverting twice returns the original exactly in the float pipeline, since 1 - (1 - c) = c, and within rounding in the exported file: the server renders in float64 for images up to 4 megapixels and float32 above that, so a double inversion differs from the source by at most one 8-bit level after encoding.',
      'A layer opacity below 100 percent mixes the input and the negative, so 50 percent opacity maps every pixel toward 0.5 gray: a value of 0.2 becomes 0.5 and so does 0.8. Luminosity blend keeps the original hue and chroma and takes only the inverted luma; color blend does the reverse.',
      'Order matters for film scans: the orange mask of a color negative is a global cast, so an Invert layer first, then Levels with per-channel input black and white points set from the histogram, then Curves gives the standard conversion with no second pass.',
      'Your GPU (WebGL2) draws the inverted preview from a 1920 px copy of the photo; on export our server renders the original at full resolution with the same subtraction, and the two results agree within a small documented tolerance, a few 8-bit levels at most for color stages and exact for grain.',
    ],
    whyItMatters: [
      'A scanned or photographed color negative is unreadable until it is inverted; doing it as a layer leaves the cast correction and the inversion editable separately.',
      'Inverted line art, blueprints and diagrams are easier to read on dark backgrounds, and a one-click negative is the first step to a white-on-black version.',
      'Partial and masked inversions are a design tool: a solarized edge, an inverted subject on an untouched background, or a tone-only flip that keeps the colors.',
    ],
    useCases: [
      { title: 'Convert a photographed film negative', description: 'Invert the frame, then set input black and white per channel in Levels to remove the orange base, and finish with a curve.' },
      { title: 'Dark-mode versions of diagrams', description: 'Invert a white-background chart or sketch for a dark slide, then threshold it if the scan is gray rather than black.' },
      { title: 'Solarization effects', description: 'Add a luminosity mask so only the highlights flip, for a Sabattier-style look; a plain 50 percent opacity would turn the whole frame mid-gray instead.' },
      { title: 'Checking a composite for seams', description: 'A temporary inverted layer makes brightness mismatches along a pasted edge easier to see; delete it before export.' },
    ],
    whyMediaManipulator: [
      `${PHOTO_BRAND} keeps the inversion non-destructive with undo, history and the press-and-hold original view, so a negative conversion can be refined over several sessions on a saved project.`,
      'The Effects panel sits next to Levels and Curves in the same stack, which is exactly the combination a film-scan conversion needs, with no round trip through separate tools.',
      'An inverted export is rendered from the original pixels on our own server, never through a third-party service, and a guest export costs one everyday operation.',
    ],
    privacyNote:
      `The inversion is a single subtraction per channel computed in your browser; the photo is uploaded only when you export, select a subject or heal, and then our server inverts the original the same way. ${RETENTION_PROMISE}. With an account, the original, its preview and thumbnail stay under your retention setting until you delete the project.`,
    faq: [
      { question: 'Is inverting the same as making a negative?', answer: 'Yes. Each channel becomes 1 minus its value, which is what a negative is: 8-bit (51, 51, 51) becomes (204, 204, 204), and the sky color (89, 140, 217) becomes a warm (166, 115, 38).' },
      { question: 'If I invert twice do I get the original back?', answer: 'Exactly in the preview and in the float render, because 1 - (1 - c) is c. The exported file can differ by at most one 8-bit level from the source after re-encoding, and a lossy JPG export adds its own compression noise on top.' },
      { question: 'Can I invert only part of a photo?', answer: 'Add a mask to the Invert layer: a brush, a gradient, a radial, a luminosity range, a color range or a subject mask all work, and the mask can be feathered and inverted itself.' },
      { question: 'Why does my inverted negative still look orange or blue?', answer: 'Color negative film has an orange base that inverts to a blue cast. Add a Levels layer above the inversion and set the input black and white points per channel from the histogram; that neutralizes the base without affecting the inversion.' },
      { question: 'What else is in the Effects panel?', answer: 'Posterize (2 to 255 levels per channel), Threshold (black or white by luma at a chosen level) and Gamma (a power curve from 0.1 to 10). They are separate layers and can be stacked with Invert in any order.' },
      { question: 'Will inverting change transparency?', answer: 'No. The alpha channel of a PNG or WebP is untouched; only red, green and blue are flipped, so a transparent background stays transparent.' },
    ],
    related: [
      { label: 'Posterize image', to: '/tools/posterize-image', description: 'Reduce each channel to a few levels in the same Effects panel.' },
      { label: 'Photo levels', to: '/tools/photo-levels', description: 'Set per-channel black and white points after inverting a film scan.' },
      { label: 'Photo curves', to: '/tools/photo-curves', description: 'Finish a negative conversion with a contrast curve.' },
      { label: 'Black and white', to: '/tools/black-and-white-photo', description: 'Convert to monochrome before or after inverting for a gray negative.' },
      { label: 'Remove EXIF metadata', to: '/tools/remove-exif-metadata', description: 'Strip camera data from the exported file if it is going to be shared.' },
    ],
    primaryKeyword: 'invert image colors online',
    secondaryKeywords: ['invert photo colors', 'make image negative online', 'convert negative to positive', 'invert picture colors', 'negative image effect'],
    supportedFormats: {
      supportedInputFormats: ['JPG', 'PNG', 'WebP', 'GIF', 'HEIC', 'HEIF', 'AVIF', 'TIFF', 'BMP'],
      supportedOutputFormats: ['JPG', 'PNG', 'WebP', 'AVIF', 'TIFF'],
      processingNotes: [
        'Alpha is preserved; only the three color channels are inverted.',
        'TIFF scans and BMP files need an account for an editable preview copy; JPG and PNG scans decode in the browser.',
      ],
    },
    workedExamples: [
      {
        title: 'A 3000 x 2000 negative scan to positive',
        body:
          'A 3000 x 2000 TIFF scan (6 MP, about 18 MB) opened with an account. Invert turns a film-base pixel of (0.93, 0.08, 0.12) into (0.07, 0.92, 0.88), or (18, 235, 224), the blue-cyan cast every inverted color negative shows. A Levels layer above it with input black 0.06 and input white 0.86 on the master channel only stretches the contrast, a 0.3 value to 0.3 and a 0.7 value to 0.8, and leaves the cast; the cast is cleared by setting the red, green and blue input points separately from the histogram. Export as PNG is about 15 MB; as JPG at quality 92 about 2.7 MB. The whole frame is under the 12 MP cap.',
      },
      {
        title: 'Half and full inversions for a poster',
        body:
          'A 4000 x 3000 JPEG (12 MP, 4.5 MB). Invert layer at 50 percent opacity: a value of 0.2 blends with its negative 0.8 to 0.5, a value of 0.8 blends with 0.2 to 0.5, and every pixel lands on exactly mid-gray, so a half-strength inversion on its own erases the picture. At 100 percent the dark gray (51, 51, 51) becomes (204, 204, 204). Add a Threshold layer at level 0.5 above a full-strength Invert: a sky pixel with luma 0.529 before inversion has luma 0.471 after it and becomes black, while everything that was darker than 0.5 becomes white. WebP export at quality 85 is about 3.6 MB and is one everyday operation.',
      },
    ],
    whenNotToUse:
      'Inverting is the wrong tool when a photo merely looks too dark or has a color cast; fix exposure with the Basic panel and casts with white balance or color balance instead. A black and white conversion with channel sliders gives far more control over tonality than inverting a desaturated image, and for diagrams that should be white on black with crisp edges, a Threshold layer after inversion usually does more work than the inversion itself.',
    embed: {
      title: 'Invert a photo',
      description: 'Drop a photo to open the Effects panel; add Invert for an instant negative, then export.',
    },
  },

  // ------------------------------------------------------------------ posterize-image
  {
    slug: 'posterize-image',
    name: 'Posterize',
    h1: 'Posterize an Image Online',
    tagline: 'Collapse every channel to a chosen number of levels for flat, poster-style color with hard tonal steps.',
    metaTitle: 'Posterize an Image Online: 2 to 255 Levels per Channel',
    metaDescription:
      'Posterize a photo in the browser by snapping each channel to 2-255 levels. See the bands live, stack with black and white, export at full size.',
    ogTitle: 'Posterize an Image Online',
    ogDescription:
      'Reduce a photo to flat bands of color with a posterize layer. Exact level math, masks, undo, full-resolution export.',
    intro:
      `Posterizing quantizes each color channel to a small set of evenly spaced values, so smooth gradients become flat bands and a photo starts to look like a screen print. In ${PHOTO_BRAND} it is the Posterize entry of the Effects panel with a single Levels slider from 2 to 255 (default 4), applied as a gamma-space layer after the tonal and color stages of the stack. Levels is the number of distinct values each channel can take, so 2 gives pure black-or-white per channel, which is eight possible colors in total, and 4 gives 64. Because it is an adjustment layer, you can posterize a masked region only, keep the original hues with the luminosity blend mode, or put a Black & white layer below it for a classic two-tone or three-tone poster.`,
    whatItDoes: [
      'Adds a Posterize layer with one Levels slider; 2 produces 8 possible colors, 4 produces 64, 8 produces 512, each with equal spacing.',
      'Snaps each channel independently to the nearest allowed level, so a pixel\'s red, green and blue can land on different steps.',
      'Previews the banding instantly on the 1920 px proxy and on the histogram, where the spikes show exactly which levels are in use.',
      'Works with masks, opacity and blend modes, and stacks with Black & white, Threshold, Curves and the other layers.',
      'Exports the quantized image from the original resolution as PNG for exact flat colors or JPG, WebP, AVIF and TIFF.',
    ],
    flowSteps: [
      { title: 'Drop a photo', description: 'The editor opens on the Effects panel with the image decoded locally.' },
      { title: 'Add Posterize', description: 'Choose Posterize and set the Levels slider; 3 to 6 gives the strongest poster effect.' },
      { title: 'Shape the tones first', description: 'Add Black & white or Curves below the Posterize layer to decide where the band edges fall.' },
      { title: 'Export', description: 'PNG keeps the flat colors byte-exact; JPG at high quality is smaller.' },
    ],
    advancedDetails: [
      'With Levels set to the slider value, the code uses n = levels - 1 as the number of steps and computes floor(clamp(v, 0, 1) x n + 0.5) / n per channel. The allowed outputs are 0, 1/n, 2/n, ... 1, so there are exactly levels distinct values per channel including both black and white.',
      'The + 0.5 before the floor makes it a round-to-nearest: with Levels 4 (n = 3) a value of 0.45 maps to floor(1.85) / 3 = 0.3333 and 0.5 maps to floor(2.0) / 3 = 0.6667, so the boundary between the second and third band is at 0.5 in the input, with the other two at 0.1667 and 0.8333.',
      'Levels 2 is a per-channel threshold at 0.5, not a luma threshold: a pixel of (0.35, 0.55, 0.85) becomes (0, 1, 1), cyan, whereas the Threshold layer uses the BT.709 luma and would output white for the same pixel. Levels 255 is an identity on 8-bit input.',
      'Each channel is quantized on its own, so a gray gradient produces gray bands, but a colored gradient produces bands whose hue shifts at every step where only one channel crosses a boundary; add a Black & white layer below to avoid that, or use the luminosity blend mode to keep the original hues.',
      'The banded preview is drawn by your GPU (WebGL2) from a 1920 px copy; the exported file is rendered on our server from the original at full resolution using the same rounding formula, and the two agree within a small documented tolerance of at most a few 8-bit levels (grain is exact).',
    ],
    whyItMatters: [
      'Posterization is the base of screen-print, risograph and pop-art looks, and knowing the exact band boundaries lets you place them with a curve instead of guessing.',
      'Reducing an image to a handful of flat colors is also a practical step before vector tracing or stencil cutting.',
      'As a layer it is reversible and maskable, so a poster treatment can be applied to the background while a subject keeps full tone.',
    ],
    useCases: [
      { title: 'Pop-art portraits', description: 'Black & white below, Posterize at Levels 3 above, then Split toning to color the two or three resulting bands.' },
      { title: 'Stencil and screen-print prep', description: 'Levels 2 on a monochrome image gives a clean black-and-white separation with the cut at 0.5 per channel.' },
      { title: 'Retro game or pixel-art color', description: 'Levels 4 to 6 on a resized photo approximates a limited palette while keeping the hues of the original.' },
      { title: 'Highlighting tonal structure', description: 'A temporary Levels 6 layer makes the zones of a landscape obvious while you set Curves; delete it before export.' },
    ],
    whyMediaManipulator: [
      `${PHOTO_BRAND} documents the exact quantization formula, so the bands you see in the preview are the same bands the export server produces from the full-resolution original.`,
      'The posterize layer can be masked with six mask kinds, including a subject mask from our own GPU, so a poster effect can surround a person without touching their face.',
      'A PNG export keeps the flat colors exact and the project stays editable, so changing from 4 to 5 levels later is a slider move, not a redo.',
    ],
    privacyNote:
      `Posterizing is a per-channel rounding done in your browser on the decoded photo; nothing is uploaded until you export, select a subject or heal, and on export the server quantizes the original with the same step count. ${RETENTION_PROMISE}. Signed in, the original and its 1920 px preview remain under your retention setting until the project is deleted.`,
    faq: [
      { question: 'What does the Levels number mean exactly?', answer: 'It is the count of distinct values each channel can take, including 0 and 1. Levels 4 allows 0, 0.333, 0.667 and 1 per channel, so a pixel can be one of 4 x 4 x 4 = 64 colors.' },
      { question: 'Where do the band boundaries fall?', answer: 'Halfway between adjacent levels, because the rounding is floor(v x n + 0.5) / n with n = levels - 1. For Levels 4 the input cutoffs are 0.1667, 0.5 and 0.8333; for Levels 3 they are 0.25 and 0.75.' },
      { question: 'Why do colors shift at the band edges?', answer: 'Each channel rounds separately, so along a gradient the red channel may step before the green one does and the hue changes briefly. Put a Black & white layer below the Posterize layer, or set its blend mode to luminosity, to keep hues stable.' },
      { question: 'What is the difference between Posterize at 2 levels and Threshold?', answer: 'Posterize 2 cuts each channel at 0.5 and can output any of 8 colors; Threshold compares the luma to a chosen level and outputs only black or white.' },
      { question: 'Does 255 levels change anything?', answer: 'Not on an 8-bit photo: with n = 254 the allowed steps are 1/254 apart, which rounds back to the same 8-bit value within one level, so it is effectively a no-op and useful only as a starting point for the slider.' },
      { question: 'Which export format keeps the bands exact?', answer: 'PNG, since it is lossless; JPG smooths the hard band edges with compression ringing at lower quality. WebP at quality 100 or AVIF at high quality are good compromises when size matters.' },
    ],
    related: [
      { label: 'Invert image colors', to: '/tools/invert-image-colors', description: 'The other Effects entry: flip the photo to its negative.' },
      { label: 'Black and white', to: '/tools/black-and-white-photo', description: 'Convert first so posterize produces clean gray bands.' },
      { label: 'Photo curves', to: '/tools/photo-curves', description: 'Move tones across the band boundaries before quantizing.' },
      { label: 'Color pop', to: '/tools/color-pop', description: 'Keep one color and gray out the rest for another graphic look.' },
      { label: 'Image resizer', to: '/tools/image-resizer', description: 'Shrink a posterized image to a thumbnail or icon size.' },
    ],
    primaryKeyword: 'posterize image online',
    secondaryKeywords: ['posterize photo', 'posterize effect online', 'reduce colors in image', 'poster effect photo', 'flat color photo filter'],
    supportedFormats: {
      supportedInputFormats: ['JPG', 'PNG', 'WebP', 'GIF', 'HEIC', 'HEIF', 'AVIF', 'TIFF', 'BMP'],
      supportedOutputFormats: ['PNG', 'JPG', 'WebP', 'AVIF', 'TIFF'],
      processingNotes: [
        'Flat posterized colors compress very well as PNG; the 2.5 MB per megapixel estimate for photos drops toward the 1.0 MB figure for flat graphics.',
        'Guest and Free exports are capped at 12 megapixels; HEIC, TIFF and BMP need an account for an editable preview.',
      ],
    },
    workedExamples: [
      {
        title: 'Four levels on a 12 MP landscape',
        body:
          'A 4000 x 3000 JPEG (12 MP, 4.8 MB) with Posterize at Levels 4, so n = 3. A sky pixel of (0.35, 0.55, 0.85), or (89, 140, 217), becomes (0.333, 0.667, 1), or (85, 170, 255). A mid-gray of 0.5 rounds up to 0.667 because floor(1.5 + 0.5) = 2, while 0.45 rounds down to 0.333. A shadow value of 0.1 becomes 0 and a highlight of 0.9 becomes 1. The histogram shows four spikes per channel. Exported as PNG the flat image is about 12 to 15 MB rather than the 30 MB a normal photo of that size would be; as WebP at quality 100 about 2 MB. One everyday operation, under the guest cap.',
      },
      {
        title: 'Six levels on skin, then two',
        body:
          'A 3000 x 4000 portrait (12 MP, 5.1 MB). At Levels 6 (n = 5) a skin tone of (0.78, 0.6, 0.5) becomes (0.8, 0.6, 0.6), or (204, 153, 153); the blue channel climbs from 128 to 153 because 0.5 x 5 + 0.5 = 3.0 floors to 3. Changing the slider to Levels 2 (n = 1) gives (1, 1, 1), white, since every channel is at or above 0.5 and rounds up, while a shadow of (0.3, 0.25, 0.2) becomes (0, 0, 0). With a Black & white layer below at the default channel mix, the same Levels 2 cut produces a clean two-tone stencil. PNG export is about 8 MB.',
      },
    ],
    whenNotToUse:
      'Posterize is a graphic effect, not a correction: if a photo has banding you want to remove, this adds more, and the noise reduction or a gentle Curves adjustment is the right direction. For a pure black-or-white cutout by brightness use the Threshold layer, which judges luma instead of each channel. If the goal is fewer colors for a smaller file, the compress-image tool reduces size without visible steps, and a resize does more for a thumbnail than a palette cut.',
    embed: {
      title: 'Posterize a photo',
      description: 'Drop a photo to open the Effects panel; add Posterize, set the number of levels and export.',
    },
  },

  // ------------------------------------------------------------------ photo-levels
  {
    slug: 'photo-levels',
    name: 'Levels',
    h1: 'Adjust Levels of a Photo Online',
    tagline: 'Set input black, input white, midtone gamma and output range per channel against a live histogram.',
    metaTitle: 'Adjust Levels of a Photo Online: Black Point, White Point, Midtones',
    metaDescription:
      'Levels in the browser: input black and white points, midtone gamma and output limits for RGB, red, green and blue, with a live histogram.',
    ogTitle: 'Adjust Levels of a Photo Online',
    ogDescription:
      'Stretch or compress the tonal range of a photo per channel with a Levels layer and its histogram, then export from the original pixels.',
    intro:
      `Levels is the direct way to fix a flat photo: pull the input black point up to where the histogram starts, pull the input white point down to where it ends, and the picture uses the full range. ${PHOTO_BRAND} implements it as a layer in the gamma-space tonal stage with five controls for each of four channels, RGB, Red, Green and Blue: Input black, Input white, Midtones (a gamma from 0.1 to 10), Output black and Output white. The three color channels are applied first and the RGB channel last, so a per-channel cast correction and a global contrast stretch live in one layer. A histogram of the current result sits above the sliders and updates with every change, and the layer takes a mask, an opacity and a blend mode like any other.`,
    whatItDoes: [
      'Adds a Levels layer with Input black, Input white, Midtones, Output black and Output white for the RGB master and for Red, Green and Blue separately.',
      'Stretches the chosen input range to the chosen output range with a gamma on the midtones, clamping anything outside the input points to the ends.',
      'Applies the Red, Green and Blue channels first and the RGB channel afterward, so a color cast fix and a contrast fix can be set in one panel.',
      'Draws a live RGB and luma histogram so the black and white points can be set to the real ends of the data.',
      'Exports the corrected photo from the original at full resolution with the same per-channel mapping.',
    ],
    flowSteps: [
      { title: 'Drop a photo', description: 'The editor opens with the Levels panel and its histogram in front.' },
      { title: 'Set the end points', description: 'Drag Input black to where the histogram begins and Input white to where it ends on the RGB channel.' },
      { title: 'Fix a cast and the midtones', description: 'Switch to Red, Green or Blue to move one channel\'s end points, then set Midtones below 1 to darken or above 1 to lighten.' },
      { title: 'Export', description: 'Choose a format, quality and size; the server renders the original with the same levels.' },
    ],
    advancedDetails: [
      'Per channel the mapping is t = clamp((v - inBlack) / (inWhite - inBlack), 0, 1) followed by out = clamp(t ^ (1 / gamma) x (outWhite - outBlack) + outBlack, 0, 1), with the input span floored at one millionth so equal black and white points cannot divide by zero. All five values are fractions of 0..1, so an 8-bit black point of 26 is 0.102.',
      'Midtones is a gamma: values above 1 lift the middle (a 0.5 input with gamma 1.2 becomes 0.5612, about 143 of 255) and values below 1 darken it (gamma 0.85 turns 0.5 into 0.4424, about 113), while 0 and 1 stay fixed. It is the same power law as the Gamma entry in the Effects panel and the Gamma slider of the Exposure section.',
      'Order inside the layer is fixed: red, green and blue are each mapped with their own five values, then the master mapping is applied to all three results. A blue-channel Midtones of 0.85 followed by a master stretch therefore sees the already-darkened blue.',
      'Output black above 0 and Output white below 1 compress the range instead of stretching it, which is how a matte look is made: Output black 0.08 and Output white 0.97 turn pure black into 0.08 (about 20), pure white into 0.97 (about 247) and leave 0.5 at 0.525.',
      'The histogram and preview come from your GPU (WebGL2) working on a 1920 px copy of the photo; the exported file is rendered on our server from the original at full resolution with the same levels formula, and preview and export agree within a small documented tolerance, a few 8-bit levels at most, with grain exact.',
    ],
    whyItMatters: [
      'Scans, screenshots of video and photos shot in haze rarely reach true black or white; setting the end points to the histogram restores contrast without touching the colors in between.',
      'Per-channel end points are the most direct cast correction there is: a scan whose blue channel starts at 40 instead of 0 is fixed by one slider.',
      'Output limits give a controlled fade for print or for a matte style, with numbers you can repeat on the next photo.',
    ],
    useCases: [
      { title: 'Rescue a flat scan', description: 'Input black 0.1 and Input white 0.9 on RGB stretch a scan whose histogram sits between 26 and 230 to the full range.' },
      { title: 'Remove a channel cast', description: 'Open the Blue channel and raise Input black until the blue histogram starts where red and green do.' },
      { title: 'Matte film look', description: 'Output black 0.08 and Output white 0.97, optionally with a slightly lower blue Midtones for a warm shadow.' },
      { title: 'Preparing images for print', description: 'Output black 0.04 and Output white 0.96 keep tones inside the range a press can hold.' },
    ],
    whyMediaManipulator: [
      `${PHOTO_BRAND} applies levels with the same formula on the GPU preview, the export server and the phone app, and the histogram you set the points against is computed from the actual rendered result, not from the source alone.`,
      'Levels sits in a 64-layer non-destructive stack with masks, so a tonal stretch can be limited to the sky or the shadows with a luminosity range.',
      'The project saves to your account on sign-in and the export is rendered from the original file, so a scan corrected at 1920 px preview size exports at its real 5400 px width.',
    ],
    privacyNote:
      `Levels sliders are evaluated in your browser on the decoded photo and on the histogram of the result; the file is uploaded only for an export, a subject mask or a heal, and the server maps the original with the same end points and gamma. ${RETENTION_PROMISE}. Signed in, the original and its preview are kept under your retention setting until the project is deleted.`,
    faq: [
      { question: 'What is the difference between Levels and Curves?', answer: 'Levels is a straight-line stretch with one gamma bend: five numbers per channel. Curves lets you place up to 16 points for any monotone shape. Levels is faster for black and white points and casts; Curves is for contrast shaping in specific tonal zones.' },
      { question: 'Which channel is applied first?', answer: 'Red, Green and Blue first, each with its own five values, and the RGB master channel last, on the already-corrected channels.' },
      { question: 'What happens to pixels darker than the input black point?', answer: 'They clip to the output black value, because the normalized value is clamped to 0 before the gamma. The histogram shows them as a spike at the left end, so pull Input black back if that spike grows.' },
      { question: 'Is Midtones the same as the Gamma slider in Exposure?', answer: 'The math is the same power law, out = in ^ (1 / gamma), but in Levels it runs between the input stretch and the output range on each channel, and it can be set per channel, which the Exposure gamma cannot.' },
      { question: 'Can I read the slider values as 8-bit numbers?', answer: 'The sliders run from 0 to 1; multiply by 255 to get the familiar 0-255 values. Input black 0.1 is level 26 and Input white 0.9 is level 230.' },
      { question: 'Does a levels stretch add banding?', answer: 'Stretching an 8-bit source spreads its values apart, so a strong stretch on a flat JPEG can show steps in smooth gradients. Keep the stretch moderate or export as PNG so the steps are not worsened by compression.' },
    ],
    related: [
      { label: 'Photo curves', to: '/tools/photo-curves', description: 'Free-form tone shaping with up to 16 points per channel.' },
      { label: 'Adjust image contrast', to: '/tools/adjust-image-contrast', description: 'A single contrast slider when end points are already fine.' },
      { label: 'Fix photo exposure', to: '/tools/fix-photo-exposure', description: 'EV, offset and gamma in linear light for an underexposed shot.' },
      { label: 'White balance', to: '/tools/white-balance-photo', description: 'Temperature and tint for casts that come from the light rather than the scan.' },
      { label: 'Invert image colors', to: '/tools/invert-image-colors', description: 'Invert a negative first, then set per-channel levels to clear the film base.' },
      { label: `${PHOTO_BRAND} tutorial`, to: '/tutorials/aperture', description: 'Walkthrough of layers, the histogram and export.' },
    ],
    primaryKeyword: 'adjust levels of a photo online',
    secondaryKeywords: ['photo levels tool', 'levels adjustment online', 'set black point white point', 'histogram levels editor', 'fix flat photo contrast'],
    supportedFormats: {
      supportedInputFormats: ['JPG', 'PNG', 'WebP', 'GIF', 'HEIC', 'HEIF', 'AVIF', 'TIFF', 'BMP'],
      supportedOutputFormats: ['JPG', 'PNG', 'WebP', 'AVIF', 'TIFF'],
      processingNotes: [
        'The histogram is computed from the rendered preview; a strong stretch of an 8-bit source can reveal gaps in it.',
        'TIFF and BMP scans need an account for an editable preview; exports above 12 megapixels need Premium or Pro.',
      ],
    },
    workedExamples: [
      {
        title: 'Stretching a flat 19.4 MP scan',
        body:
          'A 5400 x 3600 JPEG scan (19.4 MP, 7.2 MB) whose histogram runs from about 26 to 230. On the RGB channel: Input black 0.1, Input white 0.9, Midtones 1.2, Output black 0, Output white 1. A pixel at 0.3 becomes ((0.3 - 0.1) / 0.8) ^ (1 / 1.2) = 0.315, about 80; a 0.5 pixel becomes 0.5612, about 143; a 0.7 pixel becomes 0.7868, about 201; and 0.1 and 0.9 land on 0 and 1. Everything at or below 0.1 clips to black. Exported as JPG at quality 92 the 19.4 MP file is about 8.7 MB on Premium or Pro; a guest export is downscaled to 12 MP, about 5.4 MB.',
      },
      {
        title: 'Per-channel blue fix plus a print-safe master',
        body:
          'A 4000 x 3000 JPEG (12 MP, 4.4 MB) with a blue cast in the shadows. Blue channel: Midtones 0.85, everything else default. RGB channel: Input black 0.05, Input white 0.95, Output black 0.04, Output white 0.96. A neutral 0.5 gray becomes (0.5, 0.5, 0.4412), about (128, 128, 112), because only the blue channel saw the gamma and the master stretch maps 0.5 back to 0.5. A shadow of (0.3, 0.25, 0.2) becomes (75, 62, 36). Pure black lands at 0.04 (10) and pure white at 0.96 (245), which is the output range a print can hold. PNG export is about 30 MB; JPG at quality 92 about 5.4 MB.',
      },
    ],
    whenNotToUse:
      'Levels cannot bend the tone curve in more than one place, so for an S-curve or a targeted lift of only the three-quarter tones, use the Curves panel. If the photo is underexposed rather than flat, the Exposure sliders work in linear light and scale the image the way the camera would have, which Levels in gamma space does not. For a cast that comes from the lighting, the white balance sliders fix it with two values instead of three channels, and for a one-slider fix the contrast page is faster.',
    embed: {
      title: 'Adjust photo levels',
      description: 'Drop a photo to open the Levels panel with its histogram; set black, white and midtone points, then export.',
    },
  },

  // ------------------------------------------------------------------ photo-curves
  {
    slug: 'photo-curves',
    name: 'Curves',
    h1: 'Photo Curves Tool Online',
    tagline: 'Shape tone and color with a draggable curve for RGB and each channel, through up to 16 points, with an eyedropper.',
    metaTitle: 'Photo Curves Tool Online: RGB and Per-Channel Curves in the Browser',
    metaDescription:
      'Curves in the browser: drag up to 16 points on RGB, red, green and blue curves, pick tones with an eyedropper and export at full resolution.',
    ogTitle: 'Photo Curves Tool Online',
    ogDescription:
      'A real curves panel: monotone cubic through your points, per-channel control, eyedropper, histogram and full-size export from the original.',
    intro:
      `Curves maps every input tone to an output tone along a line you draw, and it is the most flexible tonal and color tool in any editor. ${PHOTO_BRAND} gives you four curves, RGB, Red, Green and Blue, each with 2 to 16 draggable points, and a Pick a point eyedropper that adds a point at the value under the cursor in the photo. The curve through the points is a monotone cubic, so it never overshoots or reverses between points, and it is sampled into a 256-entry table that the GPU and the export server both read with linear interpolation. The three color curves are applied first and the RGB curve last, in the gamma-space tonal stage of the layer stack, under a live histogram and with the usual mask, opacity and blend mode controls on the layer.`,
    whatItDoes: [
      'Adds a Curves layer with four graphs, RGB, Red, Green and Blue; drag points on the graph, add up to 16 per curve and remove any point except the ends.',
      'Fits a monotone cubic Hermite curve through the points so an S-curve stays smooth and a steep step never produces a reversal.',
      'Samples each curve into 256 entries and applies the color curves first, then the RGB curve to the result.',
      'Picks points from the photo with an eyedropper so a specific skin tone or sky value becomes a handle on the graph.',
      'Shows the result on the live histogram and exports it from the original at full resolution.',
    ],
    flowSteps: [
      { title: 'Drop a photo', description: 'The editor opens with the Curves panel and the RGB graph in front.' },
      { title: 'Place points', description: 'Click the graph or use the eyedropper on the photo to add points, then drag them to shape the curve.' },
      { title: 'Work the channels', description: 'Switch to Red, Green or Blue to correct a cast or to add a color grade with opposing curves.' },
      { title: 'Export', description: 'Choose a format and size; the server builds the same tables and renders the original.' },
    ],
    advancedDetails: [
      'Points must have strictly increasing x from 0 to 1. The slopes at the points use the Fritsch-Carlson method: secant slopes d between neighbors, an end slope equal to the first or last secant, inner slopes equal to the average of the two secants (or 0 where the secants change sign), and any pair of slopes whose squared ratio to the secant exceeds 9 is scaled back so the segment cannot overshoot.',
      'Each curve is sampled at 256 values of x = i / 255 using the cubic Hermite basis (2t cubed - 3t squared + 1, t cubed - 2t squared + t, and their complements) and clamped to 0..1; x values before the first point take its y and x values after the last point take its y. A pixel value is then read from the table by linear interpolation between the two nearest entries, which is what the GPU\'s linear sampler does.',
      'A symmetric S-curve through (0.25, 0.2) and (0.75, 0.8) turns 0.4 into 0.3716, 0.6 into 0.6284 and leaves 0.5 at exactly 0.5; its table entries 127 and 128 are 0.4975 and 0.5025, and sampling 0.5 lands halfway between them.',
      'Order inside the layer: Red, Green and Blue curves map their own channel, then the RGB curve maps all three results. Because the fit is monotone, a steep three-point step from (0.4, 0.1) to (0.5, 0.9) peaks at exactly 1 with no ringing, where a plain cubic spline would overshoot above 1 and below 0 next to the step.',
      'The preview you drag the curve against is drawn on your GPU (WebGL2) from a 1920 px copy; the exported file is rendered on our server from the original at full resolution with the same tables and interpolation, and the two agree within a small documented tolerance of a few 8-bit levels at most (grain is exact).',
    ],
    whyItMatters: [
      'An S-curve adds contrast where it is wanted and protects the ends, which a contrast slider that pivots on mid-gray cannot do.',
      'Per-channel curves are the precise form of color grading: a lifted blue shadow and a lowered blue highlight is the classic cool-shadow warm-highlight split, drawn rather than approximated.',
      'The eyedropper ties the graph to real pixels, so you correct the tone you clicked instead of guessing where it sits on the axis.',
    ],
    useCases: [
      { title: 'Gentle S-curve for punch', description: 'Points at (0.25, 0.2) and (0.75, 0.8) on RGB: shadows down about 13 levels at 0.25, highlights up the same at 0.75, mid-gray untouched.' },
      { title: 'Matte fade', description: 'Raise the first RGB point to y = 0.08 so pure black becomes 20 of 255, and add (0.3, 0.3) to keep the midtones in place.' },
      { title: 'Cooling the shadows', description: 'On the Blue curve add (0.25, 0.3); on the Red curve add (0.25, 0.22). Shadows shift toward blue while the highlights stay neutral.' },
      { title: 'Fixing a specific tone', description: 'Use Pick a point on a face, then drag that point up or down a few percent; only tones near it move.' },
    ],
    whyMediaManipulator: [
      `${PHOTO_BRAND} uses a published monotone spline and a 256-entry table on the GPU preview, the export server and the phone app alike, so a curve you draw once renders the same everywhere Media Manipulator shows it.`,
      'Curves layers stack with masks, so an S-curve can be limited to a luminosity range or a brushed region, and a per-channel grade can be applied to the background only with a subject mask.',
      'The curve is stored as its points in the project document, which keeps a saved project editable later and keeps the export independent of the preview resolution.',
    ],
    privacyNote:
      `Curve points are turned into lookup tables in your browser and applied to the decoded photo there; the file is uploaded only when you export, select a subject or heal, and the server rebuilds the same tables for the original. ${RETENTION_PROMISE}. With an account the original and its 1920 px preview stay under your retention setting until you delete the project.`,
    faq: [
      { question: 'How many points can a curve have?', answer: 'Between 2 and 16 per curve, with the x values strictly increasing. The two end points can be moved vertically but not removed; any point in between can be dragged or deleted.' },
      { question: 'Why does the curve never overshoot between points?', answer: 'It is a Fritsch-Carlson monotone cubic: slopes at each point are limited so a segment between two points stays between their y values. A steep rise still reaches its top point exactly but cannot bulge past it the way a free cubic spline would.' },
      { question: 'Which curve is applied first, RGB or the color channels?', answer: 'Red, Green and Blue first, each on its own channel, then the RGB curve on all three outputs. So an RGB S-curve adds contrast to the already color-corrected channels.' },
      { question: 'How precise is the 256-entry table?', answer: 'Each table entry is a float sampled at i / 255, and a pixel value between two entries is linearly interpolated, so the error against the exact spline is far below one 8-bit level for any smooth curve.' },
      { question: 'What does the eyedropper do?', answer: 'Pick a point from the photo adds a point to the current curve at the x position of the value under the cursor (the luma for RGB, or that channel\'s value), with y equal to x so nothing changes until you drag it.' },
      { question: 'Can curves fix a color cast?', answer: 'Yes. Find a neutral gray with the eyedropper on each channel and drag the resulting points until the three outputs agree, or raise the input end of the deficient channel. For casts from lighting, white balance is usually faster.' },
    ],
    related: [
      { label: 'Photo levels', to: '/tools/photo-levels', description: 'Five-value end points and gamma per channel for quick stretches.' },
      { label: 'Adjust image contrast', to: '/tools/adjust-image-contrast', description: 'The one-slider version when a full curve is more than you need.' },
      { label: 'Split toning', to: '/tools/split-toning', description: 'Two hues with a balance slider as a shortcut for opposing color curves.' },
      { label: 'Apply a LUT', to: '/tools/apply-lut-to-photo', description: 'Load a 3D table when the grade is already a .cube file.' },
      { label: 'Color balance', to: '/tools/color-balance-photo', description: 'Three-band RGB shifts with preserved luminosity instead of drawn curves.' },
      { label: `${PHOTO_BRAND} tutorial`, to: '/tutorials/aperture', description: 'How the stack, masks and history fit together.' },
    ],
    primaryKeyword: 'photo curves tool online',
    secondaryKeywords: ['curves tool online', 'rgb curves photo editor', 'tone curve online', 's curve photo', 'per channel curves browser'],
    supportedFormats: {
      supportedInputFormats: ['JPG', 'PNG', 'WebP', 'GIF', 'HEIC', 'HEIF', 'AVIF', 'TIFF', 'BMP'],
      supportedOutputFormats: ['JPG', 'PNG', 'WebP', 'AVIF', 'TIFF'],
      processingNotes: [
        'Each curve becomes a 256-entry table; steep curves on 8-bit sources can expose gaps in the histogram, so export PNG when that matters.',
        'HEIC, HEIF, TIFF and BMP need an account for an editable preview; exports above 12 megapixels need Premium or Pro.',
      ],
    },
    workedExamples: [
      {
        title: 'An S-curve plus a blue-channel dip on a 24 MP landscape',
        body:
          'A 6000 x 4000 JPEG (24 MP, 10.2 MB). RGB curve points: (0, 0), (0.25, 0.2), (0.75, 0.8), (1, 1). Blue curve points: (0, 0), (0.5, 0.45), (1, 1). A sky pixel of (0.35, 0.55, 0.85), or (89, 140, 217): the blue curve first maps 0.85 to 0.8729, then the RGB S-curve maps the three channels to (0.3104, 0.5648, 0.8729), or (79, 144, 223), so the sky gains contrast and loses a little blue in its midtones. On the S-curve alone, 0.1 becomes 0.0752 (19), 0.4 becomes 0.3716 (95), 0.6 becomes 0.6284 (160) and 0.9 becomes 0.9248 (236). JPG export at quality 92 is about 10.8 MB on Premium or Pro, 12 MP and about 5.4 MB as a guest.',
      },
      {
        title: 'Lift and matte on a 12 MP portrait',
        body:
          'A 3000 x 4000 JPEG (12 MP, 4.6 MB). First layer, RGB points (0, 0), (0.5, 0.6), (1, 1): a single lifted midpoint turns 0.25 into 0.3125 (80), 0.5 into 0.6 (153), 0.75 into 0.8125 (207) and 0.9 into 0.9232 (235), a smooth brightening that leaves the ends fixed. Second layer, RGB points (0, 0.08), (0.3, 0.3), (1, 1): pure black becomes 0.08 (20), 0.1 becomes 0.1504 (38), 0.3 stays 0.3 and 0.5 dips slightly to 0.4864 (124) because the monotone fit flattens after the pinned point. Both layers are undoable separately. WebP export at quality 85 is about 3.6 MB.',
      },
    ],
    whenNotToUse:
      'Curves is overkill when all the photo needs is a black and white point, which the Levels panel sets with two sliders and a histogram, or when a single global contrast or brightness change will do, which the Basic panel handles in one move. Exposure problems belong in the Exposure sliders, since they work in linear light and curves do not. And if a grade already exists as a .cube file, the LUT page applies the exact table rather than a hand-drawn approximation of it.',
    embed: {
      title: 'Adjust photo curves',
      description: 'Drop a photo to open the Curves panel; drag points on the RGB or channel graphs, pick tones with the eyedropper and export.',
    },
  },
];

export default PAGES;
