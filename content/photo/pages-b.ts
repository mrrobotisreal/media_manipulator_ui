import { PHOTO_BRAND } from '@/lib/photo/brand';
import { RETENTION_PROMISE } from '@/content/retentionPromise';
import type { PhotoPageBody } from './types';

/**
 * MM100 batch b: the colour pages of the Aperture tool set (hue, object colour,
 * colour pop, black and white, tint, colour balance). Every number in the worked
 * examples was computed with lib/photo/colorMath.ts (applyHsl, applyBlackWhite,
 * applyPhotoFilter, applyColorBalance, colorRangeValue, buildCurveLut).
 */
const PAGES: PhotoPageBody[] = [
  // ------------------------------------------------------------------ adjust-image-hue
  {
    slug: 'adjust-image-hue',
    name: 'Adjust image hue',
    h1: 'Adjust Image Hue Online',
    tagline:
      'Rotate every color in a photo by up to 180 degrees, or move only the reds, greens or blues, with a live preview and a full-resolution export.',
    metaTitle: 'Adjust Image Hue Online: Shift All Colors or One Range | Media Manipulator',
    metaDescription:
      'Shift the hue of a whole photo by -180 to 180 degrees, or move just the reds, yellows, greens, cyans, blues or magentas. Live GPU preview, full-resolution export.',
    ogTitle: 'Adjust Image Hue Online | Media Manipulator',
    ogDescription:
      'Rotate all hues at once or nudge one color range by a few degrees. Width and feather control how far each range reaches; grays are left alone.',
    intro: `Hue is the angle of a color on the wheel, and this page opens ${PHOTO_BRAND}, the Media Manipulator photo editor, with the Color (HSL) panel in front so you can turn that angle. The adjustment is one layer in the stack: every pixel is converted from sRGB to HSL, its hue is rotated by the All colors slider plus whatever the six range sliders add for that particular hue, and the result is converted back and clamped. Nothing is baked in. You can drag Hue to +30 to push teal water toward blue, see the change on the GPU preview at once, then export a file rendered from the original pixels on our server. A master shift of 180 degrees swaps every color for its complement; a range shift of 20 degrees moves one family and leaves the rest where it was.`,
    whatItDoes: [
      'The All colors Hue slider runs from -180 to 180 degrees and rotates every pixel by the same angle, so +120 turns red into green, -120 turns red into blue, and either 180 or -180 lands on the opposite side of the wheel.',
      'Six named ranges, Reds at 0 degrees, Yellows at 60, Greens at 120, Cyans at 180, Blues at 240 and Magentas at 300, each carry their own Hue, Saturation and Lightness sliders plus a Width and a Feather that decide how far the range reaches.',
      'The eyedropper adds a custom range centered on any color you click in the photo, up to 32 ranges in one layer, which is the way to target a specific orange or purple that falls between two named ranges.',
      'Range edits fade out on gray: a pixel with HSL saturation under 10 percent gets a proportionally smaller shift, so concrete, white walls and shadows do not take on a color cast when you move the Reds.',
      'The layer is non-destructive, with opacity, a blend mode, an optional mask and unlimited undo; you can stack a second Color (HSL) layer for a second family of colors and export when the preview looks right.',
    ],
    flowSteps: [
      { title: 'Open the photo', description: 'Drop a JPG, PNG, WebP, GIF, HEIC, AVIF or TIFF into the box above. The editor opens full screen with Color (HSL) selected.' },
      { title: 'Choose master or range', description: 'Drag the All colors Hue slider for a global rotation, or pick Reds, Yellows, Greens, Cyans, Blues or Magentas and move only that range.' },
      { title: 'Tune width and feather', description: 'Widen a range to catch neighbouring hues or narrow it to isolate one, and set the feather so the edge of the shift is invisible.' },
      { title: 'Export', description: 'Pick JPG, PNG, WebP, AVIF or TIFF and a quality; the server re-renders the original at full size with the same hue math and names the file (retouched).' },
    ],
    advancedDetails: [
      'For each pixel the hue h, saturation s and lightness l are taken in HSL. The output hue is h plus the master Hue plus the sum over ranges of weight times that range Hue; saturation is s multiplied by 1 + master Saturation/100 and by the product of 1 + weight times range Saturation/100; positive Lightness values move l toward 1 by amount times (1 - l) and negative ones move it toward 0 by amount times l. The result goes back to RGB and is clamped to 0..1.',
      'A range weight is 1 when the circular distance between the pixel hue and the range center is at most Width/2, falls in a straight line to 0 across the Feather, and is 0 beyond Width/2 + Feather. With the defaults of Width 30 and Feather 30, a range is solid 15 degrees either side of its center and ramps out to 45: hue 20 gets a Reds weight of 0.833, hue 30 gets 0.5 from Reds and 0.5 from Yellows, and hue 45 belongs entirely to Yellows. Width accepts 10 to 120, Feather 0 to 90.',
      'Every range weight is multiplied by min(1, s / 0.1), the neutral fade. A pixel at HSL saturation 0.04 receives only 40 percent of a range shift; a pixel at 0.1 or above receives all of it. The master Hue is not faded, but a true gray has zero saturation and comes back as the same gray whatever angle you add, and a near-gray at 4 percent saturation changes only by a few levels.',
      'Hue is circular, so Reds at center 0 cover both sides of the seam: a pixel at hue 350 is 10 degrees from the Reds center and gets the full Reds weight, and a shift that pushes a hue past 360 wraps around to the start of the wheel.',
      'The preview is drawn on your graphics card in WebGL2 from a 1920 px proxy of the photo; the file you download is rendered by our server from the original pixels with the same HSL formulas. The two agree within the documented tolerance for color operations, a mean error of at most 1 and a maximum of 4 levels out of 255.',
    ],
    whyItMatters: [
      'Hue is the one axis of color that brightness and contrast tools cannot touch: a green that should be yellow stays green no matter how you expose it, and only a hue rotation will fix it.',
      'Camera and phone pipelines often render foliage too blue-green and sunsets too magenta; a 10 to 20 degree shift on a single range corrects that without changing anything else in the frame.',
      'Product and brand work regularly needs the same object in another color, and a per-range hue shift with a feather is the fastest route that keeps the shading and highlights intact.',
    ],
    useCases: [
      { title: 'Correct water and sky', description: 'Tropical water that came out teal moves toward blue with a Cyans Hue of +20 to +30 while the sand, which has almost no cyan in it, stays put.' },
      { title: 'Warm or cool foliage', description: 'A negative Greens Hue pushes leaves toward yellow for an autumn feel; a positive one pushes them toward cyan for a cooler, wetter look.' },
      { title: 'Recolor a product', description: 'Pick the product color with the eyedropper, set the custom range Hue to the angle you need, and leave Width and Feather small so nothing else moves.' },
      { title: 'Creative color swaps', description: 'A master shift of 180 degrees gives a complement-swapped frame in one move; smaller master shifts give the cross-processed look of shifted film.' },
    ],
    whyMediaManipulator: [
      `${PHOTO_BRAND} shows the rotation on your GPU as you drag, and the exported file is computed from your original pixels with the same per-range weights, so the hue you saw is the hue you get.`,
      'Width and Feather per range, a neutral fade for grays and eyedropper ranges are the controls a desktop editor gives you, here in a browser tab with no install.',
      'Every adjustment, every mask kind except subject selection, every look and every undo is free; only the final export counts as one everyday operation, and the pricing page lists the daily allowance.',
    ],
    privacyNote: `Without an account the photo you drop here is decoded in your browser and a hue shift never leaves it; the project lives in this browser's IndexedDB until you export, and that export is a normal guest upload rendered on our own server. Signed in, the original, its 1920 px preview and a thumbnail are stored with the project under your retention setting and are deleted with the project or the account. ${RETENTION_PROMISE}. No third party ever receives the file.`,
    faq: [
      { question: 'What is the difference between the All colors Hue and a range Hue?', answer: 'All colors adds the same angle to every pixel regardless of its color. A range Hue adds its angle only to pixels whose hue falls inside that range, scaled by the range weight and faded out on near-gray pixels, so it moves one family of colors and leaves the others untouched.' },
      { question: 'Why does a small hue change look so large on some colors?', answer: 'Hue is an angle, and the perceived step per degree is not uniform around the wheel. Between yellow and green a few degrees is obvious; between blue and violet the same step is subtle. Watch the preview and use the histogram rather than aiming for a particular number.' },
      { question: 'Will shifting the Reds affect skin?', answer: 'Yes, usually. Skin tones sit around hue 15 to 30, inside the Reds range and partly inside Yellows, so a Reds Hue change moves skin too. Add a Color range or Brush mask to the layer to keep faces out of it, or narrow the Reds Width so the range stops before the orange skin hues.' },
      { question: 'Why did my gray background not change when I rotated the Reds?', answer: 'Range shifts are multiplied by min(1, saturation / 0.1). A gray background has saturation near zero, so its weight collapses to zero and it keeps its tone. That is deliberate: hue edits on neutrals would add color casts you never asked for.' },
      { question: 'Can I rotate the hue of a color that sits between two named ranges?', answer: 'Click it with the eyedropper to create a custom range centered on its exact hue, then give that range its own Hue, Width and Feather. Up to 32 ranges fit in one Color (HSL) layer.' },
      { question: 'Does a hue shift change the brightness of the photo?', answer: 'Not in the HSL model the editor uses: lightness is held constant while the angle turns. Perceived brightness still differs between hues, so a yellow rotated to blue will look darker even though its HSL lightness is identical. The live histogram shows the luma change if you want to compensate with the Lightness slider.' },
    ],
    related: [
      { label: 'Change the color of an object', to: '/tools/change-image-color', description: 'Combine a hue rotation with a Color range mask so only one object changes.' },
      { label: 'Image saturation', to: '/tools/image-saturation', description: 'Vibrance and Saturation for the whole photo, the other two axes of the same Color (HSL) panel.' },
      { label: 'Color pop', to: '/tools/color-pop', description: 'Keep one color and desaturate everything else with a built-in look.' },
      { label: 'White balance a photo', to: '/tools/white-balance-photo', description: 'If the whole frame is off toward blue or orange, temperature and tint are the right fix, not hue.' },
      { label: 'Split toning', to: '/tools/split-toning', description: 'Add a hue to shadows and another to highlights instead of rotating existing colors.' },
      { label: 'Photo editor tutorial', to: '/tutorials/aperture', description: 'Layers, masks, looks and export, in the order a first edit meets them.' },
    ],
    primaryKeyword: 'adjust image hue',
    secondaryKeywords: ['hue shift online', 'change hue of photo', 'rotate colors in image', 'HSL hue slider', 'shift color hue online', 'hue adjustment tool'],
    supportedFormats: {
      supportedInputFormats: ['JPG', 'PNG', 'WebP', 'GIF', 'HEIC', 'HEIF', 'AVIF', 'TIFF', 'BMP'],
      supportedOutputFormats: ['JPG', 'PNG', 'WebP', 'AVIF', 'TIFF'],
      processingNotes: [
        'Hue rotation is a per-pixel operation in gamma-space HSL; the export of a 24 megapixel original takes a few seconds on the server and is paced by encoding, not by the math.',
        'HEIC, TIFF and BMP originals need an account because the server prepares the preview copy the browser cannot decode.',
      ],
    },
    workedExamples: [
      {
        title: 'Teal water to blue: All colors Hue +30 on a 12 MP JPEG',
        body: 'A 4000 x 3000 photo (12 megapixels, 4.8 MB) of a lagoon that rendered too green. A water pixel of (26, 153, 166) has hue 185.5 degrees, saturation 0.73 and lightness 0.375. With the All colors Hue at +30 and every range at 0, the hue becomes 215.5 while saturation and lightness stay fixed, and the pixel exports as (25, 83, 166), a clear blue. The sand, at saturation around 0.2, also rotates 30 degrees because the master slider is not faded on low saturation, which is why a Cyans range shift of +30 (weight 1 at hue 185.5, weight 0 on the sand at hue 35) is the better move for this photo. Exported as JPG at quality 92 the file is about 5.4 MB at the 0.45 MB per megapixel estimate in the dialog, and the export is one everyday operation.',
      },
      {
        title: 'Autumn foliage: Greens Hue -30 on a 24 MP RAW-derived JPEG',
        body: 'A 6000 x 4000 export from a camera (24 megapixels, 11 MB). A leaf pixel of (77, 140, 46) has hue 100.5 degrees. With default Width 30 and Feather 30 it lies 19.5 degrees from the Greens center, so its Greens weight is 1 - (19.5 - 15) / 30 = 0.85, and 40.5 degrees from the Yellows center, a Yellows weight of 0.15. Setting Greens Hue to -30 rotates the leaf by 0.85 x -30 = -25.5 degrees to hue 75 and it exports as (117, 140, 46), an olive yellow; setting Yellows Hue to -30 instead moves it only 0.15 x -30 = -4.5 degrees, to (84, 140, 46), barely different. A greenish gray rock of (125, 133, 122), hue 105 at saturation 0.04, has its Greens weight scaled by 0.4 and shifts just 12 degrees, to (127, 133, 122), a change of 2 levels. Exporting the full 24 megapixels needs Premium or Pro; at quality 92 the JPG is about 10.8 MB.',
      },
    ],
    whenNotToUse: `A hue slider is the wrong tool when the whole photo is tinted by the light it was shot in: that is a white balance problem, and the temperature and tint sliders on our white balance page correct it in linear light without pushing hues past each other. It is also the wrong tool for changing one object while a same-colored object elsewhere must stay: hue ranges select by color, not by position, so add a Brush or Radial mask or use the object color page. Pure desaturation belongs to the saturation page, and converting to monochrome belongs to the black and white page, where the six channel sliders decide the gray of each hue.`,
    embed: {
      title: 'Adjust the hue of an image',
      description: `Drop a photo to open ${PHOTO_BRAND} on the Color (HSL) panel: rotate all colors or one range by -180 to 180 degrees and export at full resolution.`,
    },
  },

  // ------------------------------------------------------------------ change-image-color
  {
    slug: 'change-image-color',
    name: 'Change object color',
    h1: 'Change the Color of an Object in a Photo',
    tagline:
      'Pick the color with an eyedropper, set how far the selection reaches, rotate the hue, and export: a red car becomes green with its shading and reflections intact.',
    metaTitle: 'Change the Color of an Object in a Photo Online | Media Manipulator',
    metaDescription:
      'Select an object by its color with a Color range mask, rotate its hue with the Color (HSL) sliders and export at full resolution. Shading and highlights stay.',
    ogTitle: 'Change Object Color in a Photo | Media Manipulator',
    ogDescription:
      'Eyedropper, fuzziness, hue rotation. Recolor a car, a shirt or a wall in the browser and download a full-size file rendered on our server.',
    intro: `This page opens ${PHOTO_BRAND}, the Media Manipulator photo editor, on the Color (HSL) panel with a Color range mask one click away, which is the pair of tools that recolors an object. The mask does the selecting: you click the object with the eyedropper, and every pixel is scored by how far its color is from the one you picked, measured in CIE Lab, with a Fuzziness slider setting the reach. The Color (HSL) layer does the changing: a hue rotation inside that mask turns the object a different color while its lightness and saturation, and therefore its shading, reflections and texture, stay as they were. The two are separate layers in the stack, so you can refine the selection after choosing the color and undo either one.`,
    whatItDoes: [
      'A Color range mask component selects pixels by their distance from a target color you pick in the photo; shift-click adds up to 8 targets so a car with two shades of red is one selection.',
      'Fuzziness from 0 to 100 sets the radius of the selection in Lab units, up to 60 at full fuzziness, with a soft edge in the outer half of that radius so the boundary of the object does not cut.',
      'A hue rotation on the Color (HSL) layer, master or per range, moves the selected pixels around the color wheel while HSL saturation and lightness are left exactly as they were.',
      'Mask components combine: intersect the color selection with a Radial, Linear gradient or Brush component to limit it to one object when the same color appears elsewhere in the frame; Invert flips it; Mask feather softens it.',
      'The mask can be viewed as an overlay or on its own, the layer keeps its own opacity and blend mode, and the export renders the original at full resolution with the same mask math.',
    ],
    flowSteps: [
      { title: 'Drop the photo', description: 'Any JPG, PNG, WebP, GIF, HEIC, AVIF or TIFF. The editor opens with Color (HSL) in front and an empty mask ready on that layer.' },
      { title: 'Pick the color', description: 'In the Masks panel add a Color range component, click the object with the eyedropper, and raise Fuzziness until the whole object is covered in the mask overlay.' },
      { title: 'Rotate the hue', description: 'Move the All colors Hue slider until the object is the color you want; only the masked pixels change.' },
      { title: 'Refine and export', description: 'Add a Brush or Radial component with Intersect if the color appears elsewhere, feather the mask, then export JPG, PNG, WebP, AVIF or TIFF.' },
    ],
    advancedDetails: [
      'The Color range mask converts both the pixel and each target to CIE Lab (D65, from linear sRGB) and takes the Euclidean distance dE between them, the 1976 delta E. The radius is R = Fuzziness / 100 x 60, and the mask value is 1 - smoothstep(0.5 R, R, dE): fully selected up to half the radius, a smooth falloff to zero at the full radius, and the largest value over all targets wins. A Fuzziness of 40 gives R = 24, so a pixel at dE 12 or less is fully selected and one at dE 24 or more is not selected at all.',
      'Components fold left to right: Add takes the maximum, Subtract takes min(m, 1 - component), Intersect takes the minimum. The folded mask is then blurred by a Gaussian with sigma = Mask feather / 100 x 0.05 x the long side of the photo, optionally inverted, and multiplied by Mask strength. The layer output per pixel is lerp(input, adjusted, m).',
      'The color change itself is the Color (HSL) formula: hue h + master Hue + the weighted range Hues, saturation and lightness untouched when their sliders are at 0, converted back to RGB. Because the mask is applied after the adjustment, a pixel at mask value 0.9 gets 90 percent of the way from its original to its recolored value, which is what makes edges blend.',
      'Lab distance includes lightness, so a deep shadow on a red object can be further from the picked red than a brick wall is. Pick two or three targets across the shading of the object with shift-click rather than raising Fuzziness until the wall comes along.',
      'What you see is a WebGL2 render on your GPU of a 1920 px copy; what you download is rendered on our server from the full-size original with identical Lab, smoothstep and HSL code, and matches within the documented tolerance, a mean of 1 and a maximum of 4 levels in 8 bits for color operations.',
    ],
    whyItMatters: [
      'Selecting by color keeps every pixel of shading, specular highlight and texture, which a flat paint-over throws away; the object still looks lit by the same light after the change.',
      'A Lab distance tracks how different two colors look to a person better than an RGB distance does, so the selection edge lands where you would draw it.',
      'Because the selection and the color are separate layers, changing your mind about the color later is one slider, not a new selection.',
    ],
    useCases: [
      { title: 'Product color variants', description: 'Shoot one colorway, pick it, and produce the rest by rotating the hue; the stitching and shadows are the same in every variant.' },
      { title: 'Car and bike listings', description: 'Show the vehicle in the color a buyer asks about; two targets, one on the bright panel and one in the shadow, cover the whole body.' },
      { title: 'Clothing in portraits', description: 'Change a shirt from yellow to blue; intersect the color selection with a Brush component so a yellow sign in the background is left alone.' },
      { title: 'Walls and rooms', description: 'Try paint colors on a photo of the room; the color selection catches the wall and leaves the white trim because the trim is too far in Lab.' },
    ],
    whyMediaManipulator: [
      `The Color range mask in ${PHOTO_BRAND} is a real Lab-distance selection with fuzziness, multiple targets and feather, and it costs nothing: only the export, one everyday operation, is counted.`,
      'Masks stack with Add, Subtract and Intersect against gradients, radials, brushes and luminosity ranges, so the color selection can be pinned to one object without painting it all.',
      'The preview runs on your own GPU; the final file is rendered on our server from the original pixels and matches the preview, so a 24 megapixel listing photo comes back at 24 megapixels.',
    ],
    privacyNote: `The Color range selection and the hue rotation both run in your browser; the pixels of the photo are not uploaded for them. Signed out, the project stays in this browser's IndexedDB and leaves it only when you export, select a subject or heal, as a normal guest job. Signed in, the original, a 1920 px preview and a thumbnail are kept with the project under your retention setting and are deleted with the project or the account. ${RETENTION_PROMISE}. Nothing is shared with a third party.`,
    faq: [
      { question: 'How do I change the color of just one object when the same color appears twice?', answer: 'Add a second mask component, a Radial or a Brush, drawn over the object you want, and set it to Intersect. The mask is then the minimum of the color selection and the shape, so the other object, which lies outside the shape, is left at zero.' },
      { question: 'What does the Fuzziness slider actually control?', answer: 'The Lab radius of the selection: Fuzziness divided by 100 times 60. Pixels closer than half that radius to a picked color are fully selected, pixels beyond it are not selected, and between the two the value falls along a smoothstep curve.' },
      { question: 'Can I turn a red object white or black?', answer: 'A hue rotation cannot, because white and black have no hue. Keep the same mask, set the Saturation slider to -100 on the Color (HSL) layer, and then use Lightness or a masked Curves layer to push the gray toward white or black.' },
      { question: 'Why are the darkest parts of the object not selected?', answer: 'Lab distance includes lightness, so the shadow side of a red car can be further from the color you clicked than a different object is. Shift-click a second target in the shadow instead of raising Fuzziness for everything.' },
      { question: 'Does recoloring an object cost an AI operation?', answer: 'No. The Color range mask and the hue rotation are ordinary adjustments computed from the pixels. Only Select subject and Heal use the AI models; a color selection is free, and the export counts as one everyday operation.' },
      { question: 'Will the new color have the same shading as the old one?', answer: 'Yes. The rotation changes only the hue angle; the HSL saturation and lightness of every pixel are preserved, so highlights, reflections and shadows keep their shape. Perceived brightness does shift between hues, which the live histogram will show.' },
    ],
    related: [
      { label: 'Adjust image hue', to: '/tools/adjust-image-hue', description: 'The same hue sliders applied to the whole photo or one named range, without a mask.' },
      { label: 'Select by color', to: '/tools/select-by-color', description: 'The Color range mask on its own, for any adjustment you want to limit to one color.' },
      { label: 'Color pop', to: '/tools/color-pop', description: 'Keep the object color and turn the rest of the frame gray.' },
      { label: 'Remove the background', to: '/tools/remove-background-from-image', description: 'When the goal is to isolate the object entirely rather than recolor it.' },
      { label: 'Image saturation', to: '/tools/image-saturation', description: 'Make the new color stronger or softer across the whole image.' },
    ],
    primaryKeyword: 'change the color of an object in a photo',
    secondaryKeywords: ['change image color online', 'recolor object in photo', 'replace color in image', 'color range selection', 'change shirt color photo', 'change car color in picture'],
    supportedFormats: {
      supportedInputFormats: ['JPG', 'PNG', 'WebP', 'GIF', 'HEIC', 'HEIF', 'AVIF', 'TIFF', 'BMP'],
      supportedOutputFormats: ['JPG', 'PNG', 'WebP', 'AVIF', 'TIFF'],
      processingNotes: [
        'The Lab conversion and the mask blur run on every pixel of the original at export; a 20 megapixel file is rendered in a few seconds on the server.',
        'Transparent PNG originals keep their alpha: the mask and the color change never touch the alpha channel.',
      ],
    },
    workedExamples: [
      {
        title: 'Red car to green: Fuzziness 60 and All colors Hue +120 on a 20 MP JPEG',
        body: 'A 5472 x 3648 listing photo (20 megapixels, 9 MB). Clicking the door picks (204, 26, 31), Lab (43.8, 64.9, 45.5). A shadowed panel of (153, 20, 26) is dE 20.6 from it and a sunlit highlight of (242, 89, 84) is dE 19.6. At Fuzziness 40 the radius is 24 and those two score only 0.199 and 0.303, which leaves a patchy car; at Fuzziness 60 the radius is 36 and they score 0.945 and 0.977. A brick wall behind the car at (166, 77, 56) is dE 33.8 and scores 0.043, asphalt at (89, 89, 92) is dE 79.9 and scores 0. With All colors Hue at +120 the shadow pixel is recolored to (26, 153, 20) and blended at 0.945 to (33, 146, 21); the highlight becomes (84, 242, 89), blended at 0.977 to (88, 239, 89). Export as JPG at quality 92 is about 9 MB at the 0.45 MB per megapixel estimate and needs Premium or Pro for the full 20 megapixels; the free cap is 12.',
      },
      {
        title: 'Yellow jacket to blue: a Yellows range shift versus a mask on a 12 MP phone photo',
        body: 'A 4032 x 3024 HEIC from a phone (12.2 megapixels). The jacket pixel (242, 204, 38) has hue 48.75, saturation 0.89, lightness 0.55. Two routes give the same jacket. Route one: Yellows Hue +190 with no mask; at 11.25 degrees from the Yellows center the weight is 1, the hue becomes 238.75 and the pixel exports as (38, 43, 242), but a yellow road sign in the background goes blue as well. Route two: a Color range component picked on the jacket at Fuzziness 50 (radius 30), intersected with a Brush component painted over the jacket, and All colors Hue +190; the sign scores 0 because the brush excludes it, and the jacket pixel exports as the same (38, 43, 242). The export at quality 92 is about 5.5 MB; the HEIC original itself needs an account so the server can decode it for the preview.',
      },
    ],
    whenNotToUse: `A color selection cannot separate two objects of the same color in the same light; that is a job for a Brush or Radial mask, or for Select subject when the object is the main subject of the frame. It cannot create a color that is not a hue, so white, black and metallic finishes need a saturation and lightness change rather than a rotation, and it cannot change the pattern or material of a surface. When the whole photo has a cast rather than one object, use the white balance or color balance pages instead, and when you want the object cut out on a transparent background use the background remover.`,
    embed: {
      title: 'Change the color of an object',
      description: `Drop a photo to open ${PHOTO_BRAND}: pick the object color with the eyedropper, set the fuzziness, rotate the hue and export at full size.`,
    },
  },

  // ------------------------------------------------------------------ color-pop
  {
    slug: 'color-pop',
    name: 'Color pop',
    h1: 'Make a Photo Black and White Except One Color',
    tagline:
      'Keep the reds, or the blues, or any one of six color families, and turn everything else gray with a single built-in look you can tune afterwards.',
    metaTitle: 'Make a Photo Black and White Except One Color | Media Manipulator',
    metaDescription:
      'Selective color in the browser: keep red, yellow, green, cyan, blue or magenta and desaturate the rest. Six built-in looks, per-range control, full-resolution export.',
    ogTitle: 'Black and White Except One Color | Media Manipulator',
    ogDescription:
      'The Color pop looks desaturate five of six hue ranges and give the kept one a small boost. Tune the width of the kept range, add a mask, export.',
    intro: `This page opens ${PHOTO_BRAND}, the Media Manipulator photo editor, with the Color (HSL) panel in front and the look called Color pop: red already applied. A look adds its adjustments to the stack as a group, and this one is a single Color (HSL) layer whose six ranges are set so that Reds get Saturation +10 and Yellows, Greens, Cyans, Blues and Magentas each get Saturation -100. The effect is the classic selective color photo: one hue family survives, everything else collapses to gray. Five sibling looks keep yellow, green, cyan, blue or magenta instead, and the Gray except this chips in the panel do the same thing for any range in one click, including a custom range you picked with the eyedropper.`,
    whatItDoes: [
      'Applies Color pop: red on open, one Color (HSL) layer with Reds Saturation +10 and the other five ranges at Saturation -100, and lists Color pop: yellow, green, cyan, blue and magenta in the Looks panel for the other families.',
      'The Gray except this chip next to any range, including a custom eyedropper range, sets every other range to -100 saturation in one click, so a particular orange or purple can be the kept color.',
      'Each kept range has Width (10 to 120 degrees) and Feather (0 to 90) sliders that decide how much of the neighbouring hues survive, which is how you keep orange with the reds or exclude it.',
      'The neutral fade leaves grays alone, the kept range can be nudged with its own Hue and Lightness sliders, and the whole look can be masked, lowered in opacity or removed with one undo.',
      'The export renders the original at full resolution with the same six-range formula and names the file (retouched).',
    ],
    flowSteps: [
      { title: 'Drop the photo', description: 'The editor opens full screen on the Color (HSL) panel with Color pop: red applied as a group of one layer.' },
      { title: 'Choose the color to keep', description: 'Switch to Color pop: blue, green, yellow, cyan or magenta in Looks, or press Gray except this on any range, including one you picked from the photo.' },
      { title: 'Widen or narrow the kept range', description: 'Raise Width to include neighbouring hues, lower it to isolate one; use the mask overlay or the histogram to check what survived.' },
      { title: 'Export', description: 'JPG, PNG, WebP, AVIF or TIFF at the quality you choose, rendered by the server from the original pixels.' },
    ],
    advancedDetails: [
      'Saturation per pixel is s multiplied by the product over ranges of 1 + weight x Saturation/100. Inside a range at -100 the factor is 1 - weight, so a pixel fully inside Blues gets factor 0 and becomes gray; inside the kept Reds range at +10 the factor is 1.1, a ten percent lift. Hue and lightness are never changed by the look.',
      'Range weights come from the circular distance to the range center with the default Width 30 and Feather 30: full at 15 degrees or less, zero at 45 or more, linear between. A pixel exactly between two ranges, such as orange at hue 30, carries weight 0.5 in both, so with Reds kept it multiplies saturation by 1.05 x 0.5 = 0.525.',
      'Between two desaturated ranges the product of the two factors matters: at hue 210, halfway between Cyans and Blues, each weight is 0.5 and the saturation factor is 0.5 x 0.5 = 0.25, not 0, so a sky there keeps a quarter of its color. Raising Width on both ranges to 60 makes their cores meet at 210 and the factor falls to 0.',
      'Every range weight is scaled by min(1, s / 0.1), so a pixel with HSL saturation below 0.1 gets a proportionally smaller lift in the kept range; it is already nearly gray and the -100 ranges have little to remove.',
      'The look is stored as an ordinary layer group in the project: Looks are additive, Undo removes the whole group, and your own variants can be saved as a preset in this browser or exported as JSON.',
      'Your screen shows a WebGL2 render from a 1920 px copy; the exported file is produced on our server from the original with the same range math, within the documented tolerance for color operations of a mean error of at most 1 and a maximum of 4 levels in 8 bits.',
    ],
    whyItMatters: [
      'Selective color draws the eye to one element, a red umbrella in a gray street or a blue door in a stone wall, and does it with the original shading intact rather than a painted mask.',
      'Doing it by hue range instead of by hand means every red object in the frame is caught, including reflections and small details a brush would miss.',
      'Because the kept range is a parameter, the same look is reusable on a whole series through Apply to more photos on a signed-in plan.',
    ],
    useCases: [
      { title: 'Street photography accents', description: 'Keep the reds for a coat, a bus or a sign in a monochrome street scene; the Reds range catches them all at once.' },
      { title: 'Product on gray', description: 'Keep the brand color of a product and let the set, the hands and the props go gray around it.' },
      { title: 'Wedding and event details', description: 'Keep the flowers or the dress color against a gray room; a mask on the look restricts it to the table if the carpet shares the hue.' },
      { title: 'Doors, boats and cars', description: 'Color pop: blue or Color pop: yellow for a single painted object; widen the kept range if the paint drifts toward cyan or orange in the shade.' },
    ],
    whyMediaManipulator: [
      `${PHOTO_BRAND} ships six Color pop looks and a Gray except this chip for any custom range, so the color you keep is not limited to the six names.`,
      'The kept range has Width and Feather, a mask can confine the effect to one object, and the look is a layer you can lower to 60 percent for a partial effect instead of all or nothing.',
      'Applying a look, adjusting it and undoing it are free; the export of the finished frame is one everyday operation, with the daily count on the pricing page.',
    ],
    privacyNote: `Applying Color pop: red and changing which range survives happen entirely in your browser; the photo is not sent anywhere for the look. Signed out, the project is held in this browser's IndexedDB and is uploaded only when you export, select a subject or heal, as a normal guest job. Signed in, the original with its 1920 px preview and thumbnail stays on our server under your retention setting until the project or the account is deleted. ${RETENTION_PROMISE}. No third party sees your photos.`,
    faq: [
      { question: 'Which colors can I keep?', answer: 'Any of the six named ranges through the Color pop looks, Reds, Yellows, Greens, Cyans, Blues and Magentas, and any other hue by clicking it in the photo with the eyedropper and pressing Gray except this on the new custom range.' },
      { question: 'Why is my sky still slightly blue after Color pop: red?', answer: 'A sky at hue 210 sits halfway between Cyans and Blues, so each range gives it weight 0.5 and the two -100 factors multiply to 0.25, leaving a quarter of the saturation. Raise Width on both ranges to 60 so their cores overlap at 210 and the factor drops to zero.' },
      { question: 'Why do faces keep some color with the reds kept?', answer: 'Skin sits around hue 20, inside the Reds range, so the look keeps it by design. A pixel at (217, 158, 128) loses only about 12 percent of its saturation. Narrow the Reds Width, or add a Brush mask with Subtract over the face, if you want skin gray.' },
      { question: 'Can I keep two colors at once?', answer: 'Yes. The look is a normal Color (HSL) layer, so after it is applied set a second range, for example Yellows, back from -100 to 0, or press Gray except this on a custom range and then restore any named range you also want.' },
      { question: 'Is the effect reversible after I export?', answer: 'The export is a new file named with (retouched) and your original is never modified. Inside the project the look is a layer group: Undo removes it, and the layer can be hidden or deleted at any time.' },
      { question: 'What does the +10 on the kept range do?', answer: 'It multiplies the saturation of pixels fully inside the kept range by 1.1 so the surviving color reads a little stronger against the gray around it. Set it back to 0 if you want the kept color exactly as shot.' },
    ],
    related: [
      { label: 'Black and white photo', to: '/tools/black-and-white-photo', description: 'The full monochrome conversion with six channel sliders, when nothing should stay colored.' },
      { label: 'Image saturation', to: '/tools/image-saturation', description: 'Vibrance and saturation for every color, without the per-range selection.' },
      { label: 'Change the color of an object', to: '/tools/change-image-color', description: 'Recolor the object you kept instead of keeping it as shot.' },
      { label: 'Select by color', to: '/tools/select-by-color', description: 'A Color range mask for any other adjustment you want limited to one hue.' },
      { label: 'Add a vignette', to: '/tools/add-vignette', description: 'Darken the corners so the kept color draws the eye even more.' },
    ],
    primaryKeyword: 'make a photo black and white except one color',
    secondaryKeywords: ['color pop effect', 'selective color online', 'color splash photo', 'keep one color black and white', 'black and white with red', 'selective color editor'],
    supportedFormats: {
      supportedInputFormats: ['JPG', 'PNG', 'WebP', 'GIF', 'HEIC', 'HEIF', 'AVIF', 'TIFF', 'BMP'],
      supportedOutputFormats: ['JPG', 'PNG', 'WebP', 'AVIF', 'TIFF'],
      processingNotes: [
        'The look is one layer of per-pixel HSL math; export time is set by the encoder and the pixel count, a few seconds for a 12 megapixel JPG.',
        'A look applied through the page is a layer group you can rename, mask or delete like any other layer.',
      ],
    },
    workedExamples: [
      {
        title: 'Red umbrella in a gray street: Color pop: red on a 12 MP phone JPEG',
        body: 'A 4032 x 3024 JPEG (12.2 megapixels, 3.9 MB). The umbrella pixel (204, 51, 51) has hue 0 and HSL saturation 0.6; fully inside Reds its saturation becomes 0.6 x 1.1 = 0.66 and it exports as (212, 43, 43). A blue coat at (51, 77, 204), hue 230, is fully inside Blues: 0.6 x 0 = 0 and it exports as (128, 128, 128), the same lightness 0.5 as before. The sky at (140, 191, 242), hue 210, gets weight 0.5 from Cyans and 0.5 from Blues, so its saturation 0.8 becomes 0.8 x 0.5 x 0.5 = 0.2 and it exports as (179, 191, 204), a faint blue; raising both Widths to 60 takes it to full gray. An orange shop front at (230, 128, 26), hue 30, keeps 0.8 x 1.05 x 0.5 = 0.42 and exports as (181, 128, 74). The JPG export at quality 92 is about 5.5 MB and is one everyday operation.',
      },
      {
        title: 'Blue door in a stone wall: Color pop: blue on a 24 MP camera JPEG',
        body: 'A 6000 x 4000 file (24 megapixels, 12 MB). Switching to Color pop: blue sets Blues Saturation +10 and the other five ranges to -100. The door at (51, 77, 204) becomes (43, 71, 212); a red bicycle at (204, 51, 51) collapses to (128, 128, 128); the sky at (140, 191, 242) keeps 0.8 x 0.5 x 1.05 = 0.42 of its saturation through the shared Cyans edge and exports as (164, 191, 218). The stone wall at (133, 128, 122) has saturation 0.04, below the 0.1 neutral threshold, so every range weight is scaled by 0.4 and the wall moves by at most a level or two either way. Exporting all 24 megapixels needs Premium or Pro; without an account the dialog caps at 12, and a 24 megapixel JPG at quality 92 is about 10.8 MB.',
      },
    ],
    whenNotToUse: `Selective color keeps a hue wherever it occurs, so when two objects share a color and only one should stay colored you need a Brush or Radial mask on the look, or Select subject, rather than a wider or narrower range. It is not the way to get a clean monochrome, because a kept range at +10 and five ranges at -100 still leave quarter-strength color at the seams; use the black and white page for that. If what you want is a stronger or softer version of every color, the saturation page does it in one slider, and if the goal is to change the kept color rather than keep it, go to the object color page.`,
    embed: {
      title: 'Keep one color, gray out the rest',
      description: `Drop a photo to open ${PHOTO_BRAND} with the Color pop: red look applied; switch the kept color in Looks or with Gray except this.`,
    },
  },

  // ------------------------------------------------------------------ black-and-white-photo
  {
    slug: 'black-and-white-photo',
    name: 'Black & white photo',
    h1: 'Convert a Photo to Black and White Online',
    tagline:
      'A channel-weighted monochrome conversion with six color sliders, a gentle film curve and fine grain, applied on open and adjustable before you export.',
    metaTitle: 'Convert a Photo to Black and White Online | Media Manipulator',
    metaDescription:
      'Black and white with per-color control: six channel sliders decide how red, yellow, green, cyan, blue and magenta turn to gray. Film look applied, full-size export.',
    ogTitle: 'Black and White Photo Converter | Media Manipulator',
    ogDescription:
      'Six channel sliders, an optional tint, a film curve and grain. Live preview on your GPU, export rendered from the original on our server.',
    intro: `This page opens ${PHOTO_BRAND}, the Media Manipulator photo editor, on the Black & white panel with the look called Black & white film already applied as a group of three layers: a Black & white layer at its default channel weights, a Curves layer with a gentle S through (0.25, 0.22) and (0.75, 0.78), and a Grain layer at amount 20. The Black & white layer is a channel mixer by hue rather than a plain desaturation: each pixel's gray is a blend between its luma and a weighted value where the weight comes from the six sliders, Reds 40, Yellows 60, Greens 40, Cyans 60, Blues 20 and Magentas 80 by default. Drag Blues down and a sky darkens; drag Reds up and lips and brick lighten. The curve and grain are separate layers you can tune or delete.`,
    whatItDoes: [
      'Converts every pixel to gray with six channel sliders from -200 to 300 that set how bright each hue family becomes, the same control a darkroom filter gave on film and a desktop editor gives in its black and white panel.',
      'Applies Black & white film on open: default channel weights, a Curves layer with points (0, 0), (0.25, 0.22), (0.75, 0.78), (1, 1) that lowers shadows and lifts highlights slightly, and a Grain layer at amount 20, size 1, roughness 50.',
      'Offers High-contrast black & white in the Looks panel as an alternative: Reds 40, Yellows 40, Blues -40 with Contrast +40 and Clarity 25 for a harder look with a dark sky.',
      'Adds an optional Tint with a hue and a strength so the gray can lean sepia, selenium blue or any other single color without a second layer.',
      'Keeps the conversion as a layer: mask it to leave one area in color, lower its opacity for a partial desaturation, reorder it under a Curves layer, and export at full resolution.',
    ],
    flowSteps: [
      { title: 'Drop the photo', description: 'JPG, PNG, WebP, GIF, HEIC, AVIF or TIFF. The editor opens on Black & white with the film look already in the stack.' },
      { title: 'Set the channel sliders', description: 'Lower Blues to darken a sky, raise Reds or Yellows to brighten skin, raise Greens for lighter foliage; the histogram follows every move.' },
      { title: 'Adjust curve and grain', description: 'Edit the Curves layer the look added, change the Grain amount or size in the Detail panel, or delete either layer from the group.' },
      { title: 'Export', description: 'JPG, PNG, WebP, AVIF or TIFF at the quality you choose; the grain is reproduced exactly on the server from the same seed.' },
    ],
    advancedDetails: [
      'For each pixel the editor takes the HSV saturation S and value V, the BT.709 luma L = 0.2126 R + 0.7152 G + 0.0722 B, and the hue h. The gray is (1 - S) x L + S x (sum over the six ranges of w_i(h) x k_i / 100) x V, where k_i are the channel sliders and w_i are the standard hue range weights, 1 within 15 degrees of the range center and falling linearly to 0 at 45 degrees with the default Width 30 and Feather 30. A gray pixel has S = 0 and keeps its luma exactly; a fully saturated pure red has S = 1 and becomes Reds/100 x V, so 0.4 at the default, which is level 102.',
      'The sliders can exceed the natural range: a channel at 300 makes a saturated hue three times its value before clamping, and a negative channel pulls it below zero and clamps to black, which is how High-contrast black & white turns a deep blue sky to pure black.',
      'The optional tint adds Tint strength / 100 x 0.25 x (hueToRGB(Tint hue) - 0.5) to each channel of the gray, where hueToRGB gives the fully saturated color of that hue. A warm tint at hue 40 and strength 30 on a mid gray of 128 produces (137, 131, 118).',
      'The Curves layer from the look is a Fritsch-Carlson monotone cubic through its four points sampled into a 256-entry lookup table, so 0.25 maps to 0.22, 0.75 to 0.78 and 0.5 to 0.5 exactly. The Grain layer adds amount / 100 x 0.2 x (noise - 0.5) per pixel, at most 0.02 or about 5 levels at amount 20, with the noise taken from a hash of the pixel position and the seed.',
      'The preview on your screen is a WebGL2 render of a 1920 px copy on your own GPU; the download is rendered by our server from the full-resolution original with the same channel, curve and grain code. Color stages agree within a mean of 1 and a maximum of 4 levels; the grain hash is shared, so the grain matches exactly.',
    ],
    whyItMatters: [
      'A plain desaturation maps red and green of equal luma to the same gray, so a red flower vanishes into its leaves; channel weights are what separate them.',
      'Skies, skin and foliage each have a hue family of their own, so three sliders are enough to set the tonal relationships of most photographs.',
      'Grain and a soft curve are what make a digital conversion read as a print rather than a gray JPEG, and here they are two layers you can switch off.',
    ],
    useCases: [
      { title: 'Portraits', description: 'Raise Reds and Yellows a little for luminous skin, lower Blues so the background recedes, keep the grain for texture.' },
      { title: 'Landscapes with sky', description: 'Blues at -40 and Cyans at 20 give the dark sky of a red filter on film; Greens up lightens grass and trees against it.' },
      { title: 'Architecture and street', description: 'High-contrast black & white with Clarity 25 pulls out edges in stone, concrete and glass.' },
      { title: 'Archive and documents', description: 'Default weights with the curve removed give a neutral conversion for scans and reproductions.' },
    ],
    whyMediaManipulator: [
      `${PHOTO_BRAND} converts with six hue channels, a tint and sliders that reach from -200 to 300, so the conversion is a decision about each color rather than a single desaturate button.`,
      'The film look is a group of three ordinary layers: the curve and the grain stay editable, and Undo removes all three together.',
      'Every slider, the looks and the undo history are free, and the full-size export is one everyday operation; the grain is reproduced exactly on the server from the same seed.',
    ],
    privacyNote: `Converting to black and white, changing the channel sliders and adding grain are computed in your browser from the photo you dropped; nothing is uploaded for them. Signed out, the project lives in this browser's IndexedDB until you export, which is a normal guest job. Signed in, the original, its 1920 px preview and thumbnail are kept with the project under your retention setting and go when the project or the account is deleted. ${RETENTION_PROMISE}. Our servers do the render; no third party is involved.`,
    faq: [
      { question: 'Why not just set saturation to -100?', answer: 'Saturation -100 maps every pixel to its luma, so colors of equal luma merge. The Black & white layer lets you decide that blue goes darker than red or that yellow goes lighter than green, which separates a sky from a cloud and a lip from a cheek.' },
      { question: 'What do the default numbers 40, 60, 40, 60, 20, 80 mean?', answer: 'They are the percentages of a saturated color value that each hue family keeps: a pure red becomes 40 percent of its value, a pure yellow 60, a pure blue 20. They match the defaults most desktop editors ship, so a conversion made elsewhere with the same numbers looks the same here.' },
      { question: 'Can I keep one part of the photo in color?', answer: 'Give the Black & white layer a mask: a Brush component painted over the area to stay colored with Invert on, or a Color range component set to Subtract. The curve and grain layers in the look apply either way unless you mask them too.' },
      { question: 'Does the grain look the same in the exported file as on screen?', answer: 'Yes, exactly. The grain is a hash of the pixel position and the seed, with no random numbers, and the server uses the same hash on the original pixels. Because the preview is a 1920 px copy, the grain on screen is scaled, but the exported grain is per original pixel.' },
      { question: 'Can I export a true grayscale file?', answer: 'The export writes three equal channels in an RGB file in the format you pick. A JPG or WebP of a black and white image compresses well because the chroma is empty, so the file is smaller than the color original at the same quality.' },
      { question: 'How do I get a sepia print instead of neutral gray?', answer: 'Turn on Tint in the Black & white panel and set Tint hue to about 35 to 40 with a strength of 20 to 30. The gray is pushed toward the hue by strength / 100 x 0.25 of the way between the hue color and mid gray, so it stays subtle.' },
    ],
    related: [
      { label: 'Color pop', to: '/tools/color-pop', description: 'Monochrome everywhere except one hue family.' },
      { label: 'Tint a photo', to: '/tools/tint-photo', description: 'A Photo filter layer for a stronger sepia or any color wash over the gray.' },
      { label: 'Photo curves', to: '/tools/photo-curves', description: 'Shape the tones of the conversion with up to 16 points per channel.' },
      { label: 'Add a vignette', to: '/tools/add-vignette', description: 'A darkened edge is the usual companion of a black and white print.' },
      { label: 'Split toning', to: '/tools/split-toning', description: 'Two tints, one for shadows and one for highlights, over the gray.' },
      { label: 'Sharpen a photo', to: '/tools/sharpen-photo-online', description: 'Unsharp masking with threshold, applied on luma, for crisper monochrome detail.' },
    ],
    primaryKeyword: 'convert photo to black and white online',
    secondaryKeywords: ['black and white photo converter', 'grayscale image online', 'black and white filter', 'monochrome photo editor', 'black and white with grain', 'color to black and white'],
    supportedFormats: {
      supportedInputFormats: ['JPG', 'PNG', 'WebP', 'GIF', 'HEIC', 'HEIF', 'AVIF', 'TIFF', 'BMP'],
      supportedOutputFormats: ['JPG', 'PNG', 'WebP', 'AVIF', 'TIFF'],
      processingNotes: [
        'The conversion, curve and grain are per-pixel stages; the exported grain is generated from the same seed on the server and matches the reference bit for bit.',
        'Black and white JPG and WebP exports are usually a third smaller than the color original at the same quality because the chroma planes carry nothing.',
      ],
    },
    workedExamples: [
      {
        title: 'A portrait with a blue sky: Black & white film on a 24 MP JPEG',
        body: 'A 6000 x 4000 JPEG (24 megapixels, 11 MB) with the default channel weights. A skin pixel (217, 158, 128) has HSV saturation 0.412, value 0.85 and luma 0.660; its hue of 20.6 degrees gives Reds a weight of 0.814 and Yellows 0.186, so the weighted term is 0.814 x 0.4 + 0.186 x 0.6 = 0.437 and the gray is 0.588 x 0.660 + 0.412 x 0.437 x 0.85 = 0.541, level 138. The sky pixel (140, 191, 242), hue 210, saturation 0.421, value 0.95, luma 0.722, gets 0.5 from Cyans at 0.6 and 0.5 from Blues at 0.2, so the gray is 0.579 x 0.722 + 0.421 x 0.4 x 0.95 = 0.578, level 147. The curve then maps 0.541 to 0.549 (140) and 0.578 to 0.592 (151), and the grain adds up to 5 levels either way. A gray card at 128 stays at 128 through both. Exporting all 24 megapixels needs Premium or Pro; the JPG at quality 92 is about 10.8 MB.',
      },
      {
        title: 'Darkening the sky: Blues -40 and High-contrast black & white on a 12 MP photo',
        body: 'A 4000 x 3000 JPEG (12 megapixels, 5 MB). Switching to High-contrast black & white sets Reds 40, Yellows 40, Blues -40, and keeps Greens 40, Cyans 60, Magentas 80. The same sky pixel (140, 191, 242) now gets a weighted term of 0.5 x 0.6 + 0.5 x -0.4 = 0.1, so the gray is 0.579 x 0.722 + 0.421 x 0.1 x 0.95 = 0.458, level 117 instead of 147. A deep blue jacket at (51, 77, 204), hue 230, has saturation 0.75 and value 0.8: 0.25 x 0.315 + 0.75 x -0.4 x 0.8 = -0.161, which clamps to 0, pure black. A red door at (204, 51, 51) is unchanged by the switch at 0.25 x 0.328 + 0.75 x 0.4 x 0.8 = 0.322, level 82, because Reds is still 40. The look then adds Contrast +40 and Clarity 25 as two more layers. The 12 megapixel export fits the free cap and is about 5.4 MB as JPG at quality 92.',
      },
    ],
    whenNotToUse: `A black and white conversion throws away hue, so when the aim is to keep one color and gray the rest, the color pop page keeps the hue information and only desaturates the other ranges. If the photo is already monochrome and merely flat, the curves, levels or contrast pages change its tones without a conversion layer in the way. A faded color image that needs its color back is a saturation or vibrance job. And a sepia or cyanotype wash is a Photo filter or split toning layer on top of this conversion rather than a replacement for it.`,
    embed: {
      title: 'Convert a photo to black and white',
      description: `Drop a photo to open ${PHOTO_BRAND} with the Black & white film look applied; adjust the six channel sliders, the curve and the grain, then export.`,
    },
  },

  // ------------------------------------------------------------------ tint-photo
  {
    slug: 'tint-photo',
    name: 'Tint a photo',
    h1: 'Tint a Photo Online',
    tagline:
      'Lay a color over a photo like a filter on a lens: pick warming, cooling, sepia or any custom color, set the density, and keep the brightness where it was.',
    metaTitle: 'Tint a Photo Online: Warming, Sepia or Any Color | Media Manipulator',
    metaDescription:
      'Add a color tint to a photo with a Photo filter layer: warming, cooling, sepia, red, green, blue or a custom hex color, density 0 to 100, preserve luminosity. Full-size export.',
    ogTitle: 'Tint a Photo Online | Media Manipulator',
    ogDescription:
      'A Photo filter layer multiplies the image by a color and blends by density, with an option that keeps the luminance unchanged. Preview on your GPU, export from the original.',
    intro: `This page opens ${PHOTO_BRAND}, the Media Manipulator photo editor, with the Photo filter panel in front and the Warming filter loaded at Density 25 with Preserve luminosity on. A photo filter here does what a glass filter does on a lens: each pixel is multiplied by the filter color, and the Density slider decides how far from the original toward that filtered value the pixel moves. With Preserve luminosity the result is then scaled back so its BT.709 luma equals the original, which gives a tint without a darkening. Six filter chips, Warming, Cooling, Sepia, Red, Green and Blue, set the color, and Custom color takes any hex value. For a sepia print, stack it on a Black & white layer.`,
    whatItDoes: [
      'Loads a Photo filter layer with the Warming color #ec8a00 at Density 25 on open, and gives you Cooling #0a5dc8, Sepia #ac7a33, Red #e81c1c, Green #1fb52f, Blue #1c3ee8 and a Custom color picker.',
      'Density runs from 0 to 100: at 0 the layer does nothing, at 100 every pixel is fully multiplied by the filter color, and between the two it is a straight blend.',
      'Preserve luminosity, on by default, rescales each tinted pixel so its luma matches the untinted pixel, which keeps the exposure of the photo and turns the filter into a pure color shift.',
      'Works as a layer like everything else: mask it to tint only the sky, lower its opacity, set the blend mode to Color so it never touches luminance at all, and undo at any time.',
      'Exports the tinted photo at full resolution from the original pixels as JPG, PNG, WebP, AVIF or TIFF.',
    ],
    flowSteps: [
      { title: 'Drop the photo', description: 'The editor opens on the Photo filter panel with Warming at 25 percent density already applied as a layer.' },
      { title: 'Pick the color', description: 'Choose Warming, Cooling, Sepia, Red, Green or Blue, or enter a custom hex color for a brand tint.' },
      { title: 'Set the density', description: 'Drag Density until the tint is as strong as you want, and switch Preserve luminosity off only if you want the filter to darken as a real glass filter would.' },
      { title: 'Export', description: 'Choose the format and quality; the server renders the tint on the original and names the file (retouched).' },
    ],
    advancedDetails: [
      'The formula per channel is lerp(c, c x f, Density / 100), where c is the pixel in sRGB 0..1 and f is the filter color in the same scale; Warming #ec8a00 is f = (0.9255, 0.5412, 0). Because the filter multiplies, it can only lower a channel, and a channel whose filter value is 0, blue under Warming, is scaled by exactly 1 - Density / 100.',
      'With Preserve luminosity the editor computes the BT.709 luma of the original, L = 0.2126 R + 0.7152 G + 0.0722 B, and of the tinted pixel, and multiplies the tinted pixel by their ratio, then clamps to 0..1. A mid gray of 0.5 under Warming at Density 25 becomes (0.4907, 0.4427, 0.375) before the rescale, which has luma 0.448; the ratio 1.116 lifts it to (0.5477, 0.4941, 0.4185), levels (140, 126, 107).',
      'Clamping limits preservation near white: a pure white under Warming at 25 percent would need red above 1 to keep its luma, so it clamps and exports as (255, 252, 213), slightly darker than the source. Highlights therefore lose a little brightness at high densities even with the option on.',
      'A filter at 100 percent density with Preserve luminosity is a pure chromatic shift toward the filter color, not a flat fill: the pixel keeps its original luma, so a sepia at 100 on a mid gray gives (172, 122, 51), still a mid-tone.',
      'The preview you adjust is drawn by WebGL2 on your GPU from a 1920 px copy of the photo; the download is rendered on our server from the original with the same multiply, blend and luma rescale, within the documented tolerance for color stages of a mean error of at most 1 and a maximum of 4 levels out of 255.',
    ],
    whyItMatters: [
      'A multiplied tint behaves like light passing through colored glass, so highlights and shadows take the color in proportion to their brightness instead of being painted over.',
      'Preserve luminosity separates the question of color from the question of exposure, so you can warm a frame without having to brighten it afterwards.',
      'A single tint layer unifies a set of photos shot under different light, which is the usual way to make a gallery or a feed read as one series.',
    ],
    useCases: [
      { title: 'Warm a cold frame', description: 'Overcast and shade push photos blue; Warming at 20 to 35 percent brings back the color of sun without changing exposure.' },
      { title: 'Sepia prints', description: 'A Black & white layer followed by Sepia at 50 to 70 percent with Preserve luminosity on gives the classic brown print.' },
      { title: 'Brand color wash', description: 'Enter the brand hex as the custom color and keep Density low so product shots across a page share one cast.' },
      { title: 'Cool a night scene', description: 'Cooling at 30 to 40 percent pushes a street at night toward blue while the sodium lamps keep their relative warmth.' },
    ],
    whyMediaManipulator: [
      `${PHOTO_BRAND} applies the tint as a layer with density, luminosity preservation, a mask and a blend mode, which is more than a one-shot sepia button and still runs in a browser tab.`,
      'The Custom color field accepts any hex value, so a tint can match a brand or a reference image rather than one of six fixed looks.',
      'Tinting, masking and undoing cost nothing; the full-size export is one everyday operation, and the daily allowance is listed on the pricing page.',
    ],
    privacyNote: `A photo filter is computed in your browser on the photo you dropped and the tint never goes to a server until you export. Signed out, the project stays in this browser's IndexedDB; the export is a normal guest job rendered on our own server. Signed in, the original, its 1920 px preview and thumbnail are kept with the project under your retention setting and are removed with the project or the account. ${RETENTION_PROMISE}. No third party receives the file.`,
    faq: [
      { question: 'What is the difference between a tint and a white balance change?', answer: 'White balance works in linear light and shifts the midtones along the blue-yellow and green-magenta axes to correct the light the photo was shot in. A photo filter multiplies by any color in gamma space with a density, which is a creative wash rather than a correction. Use white balance to fix a cast and a filter to add one.' },
      { question: 'Why does the photo get darker when I turn off Preserve luminosity?', answer: 'The filter multiplies each channel by the filter color, and every filter value is at most 1, so without the rescale the tinted pixel can only be as bright or darker. Warming has a blue value of 0, so at full density the blue channel is removed entirely.' },
      { question: 'How do I make a sepia photo?', answer: 'Add a Black & white layer first, then a Photo filter with the Sepia chip at a density of 50 to 70 percent and Preserve luminosity on. A mid gray of 128 at 50 percent becomes (142, 126, 102); at 100 percent it becomes (172, 122, 51).' },
      { question: 'Can I tint only the sky or only the shadows?', answer: 'Yes. Give the Photo filter layer a mask: a Linear gradient from the top for a sky, or a Luminosity range from 0 to about 0.3 for the shadows. The tint is then blended by the mask value per pixel.' },
      { question: 'What hex color should I use for a vintage look?', answer: 'The Sepia chip is #ac7a33. Warmer and lighter, #d9a66b at 30 to 40 percent reads as a faded print; a cold vintage is Cooling #0a5dc8 at 15 percent over a Fade look from the Looks panel.' },
      { question: 'Does the tint change a transparent PNG?', answer: 'Only the color channels. Alpha is never touched by any adjustment, so a product cutout keeps its transparent background and the tint shows only on the visible pixels.' },
    ],
    related: [
      { label: 'Black and white photo', to: '/tools/black-and-white-photo', description: 'The conversion to put under a sepia filter.' },
      { label: 'Split toning', to: '/tools/split-toning', description: 'Two hues at once, one for the shadows and one for the highlights.' },
      { label: 'White balance a photo', to: '/tools/white-balance-photo', description: 'Correct a cast in linear light rather than add one.' },
      { label: 'Color balance a photo', to: '/tools/color-balance-photo', description: 'Push red, green and blue separately in shadows, midtones and highlights.' },
      { label: 'Apply a LUT', to: '/tools/apply-lut-to-photo', description: 'Load a .cube file for a complete color grade in one layer.' },
    ],
    primaryKeyword: 'tint a photo',
    secondaryKeywords: ['add color tint to photo', 'sepia photo online', 'photo filter online', 'warming filter photo', 'color overlay photo', 'tint image online'],
    supportedFormats: {
      supportedInputFormats: ['JPG', 'PNG', 'WebP', 'GIF', 'HEIC', 'HEIF', 'AVIF', 'TIFF', 'BMP'],
      supportedOutputFormats: ['JPG', 'PNG', 'WebP', 'AVIF', 'TIFF'],
      processingNotes: [
        'A photo filter is three multiplies and a blend per pixel; a 45 megapixel export is rendered in a few seconds and the time goes to encoding.',
        'TIFF output keeps 8 bits per channel; the tint is applied before encoding, so the TIFF is the rendered result, not the original plus a layer.',
      ],
    },
    workedExamples: [
      {
        title: 'Warming a shaded portrait: Warming at Density 25 on a 12 MP HEIC',
        body: 'A 4032 x 3024 HEIC from a phone (12.2 megapixels), which needs an account so the server can decode it for the preview. With Warming #ec8a00, Density 25 and Preserve luminosity on, a mid gray of (128, 128, 128) exports as (140, 126, 107): the blue channel falls to 0.5 x 0.75 = 0.375 before the rescale, the luma ratio 1.116 lifts the others, and the result keeps luma 0.5. A skin pixel (217, 158, 128) becomes (235, 155, 106); a patch of sky (140, 191, 242) becomes (155, 191, 205). With Preserve luminosity off the same three pixels export as (125, 113, 96), (213, 140, 96) and (138, 169, 182), each darker. Exported as JPG at quality 92 the file is about 5.5 MB and is one everyday operation.',
      },
      {
        title: 'A sepia print: Black & white then Sepia at Density 50 on a 45 MP scan',
        body: 'An 8256 x 5504 TIFF scan (45 megapixels, 136 MB), which needs an account to open and a Premium or Pro plan to export above 12 megapixels. A Black & white layer with default weights sits under a Photo filter set to Sepia #ac7a33, Density 50, Preserve luminosity on. A mid gray of 128 becomes (142, 126, 102): before the rescale it was (0.4186, 0.3696, 0.3), luma 0.375, and the ratio 1.333 brings it back to luma 0.5. A white of 255 at Density 60 exports as (255, 250, 189), clamped on red. Without Preserve luminosity the mid gray would be (107, 94, 77), a visibly darker print. Exported at 64 megapixels max size the file is the full 45 megapixels; as JPG at quality 92 it is about 20 MB, and as WebP about 13.6 MB at the 0.3 MB per megapixel estimate.',
      },
    ],
    whenNotToUse: `A photo filter adds a cast; it is not the tool for removing one, because multiplying by a color cannot restore a channel that the light took away, and the white balance page does that in linear light with a temperature and tint pair. When you want the shadows one color and the highlights another, split toning has a slider for each end plus a balance between them. For a complete grade from a reference file, a .cube LUT in the LUT panel reproduces it in one layer. A tint on a photo that is also underexposed should wait until exposure is fixed, since the luma rescale preserves whatever brightness is there.`,
    embed: {
      title: 'Tint a photo',
      description: `Drop a photo to open ${PHOTO_BRAND} on the Photo filter panel with Warming at 25 percent; pick another color or a custom hex, set the density and export.`,
    },
  },

  // ------------------------------------------------------------------ color-balance-photo
  {
    slug: 'color-balance-photo',
    name: 'Color balance',
    h1: 'Color Balance a Photo Online',
    tagline:
      'Push red, green and blue separately in the shadows, midtones and highlights to remove a color cast or build a look, with luminosity preserved.',
    metaTitle: 'Color Balance a Photo Online: Fix a Color Cast | Media Manipulator',
    metaDescription:
      'Nine sliders, red, green and blue for shadows, midtones and highlights, with preserve luminosity. Fix a blue or orange cast or grade a photo, then export at full size.',
    ogTitle: 'Color Balance a Photo Online | Media Manipulator',
    ogDescription:
      'Shadows, midtones and highlights each get red, green and blue sliders. Weighted by luma, luminosity preserved, previewed on your GPU, exported from the original.',
    intro: `This page opens ${PHOTO_BRAND}, the Media Manipulator photo editor, with the Color balance panel in front. Color balance is a gamma-space adjustment layer with three groups of three sliders, Red, Green and Blue for Shadows, Midtones and Highlights, each from -100 to 100. For every pixel the editor works out how much it belongs to each tonal band from its luma, adds the three weighted shifts to each channel at a gain of 0.3, and, with Preserve luminosity on, rescales the pixel so its luma is what it was. That lets you pull blue out of the shadows of a photo shot in shade, or push warmth into the highlights of a sunset, without touching exposure. It is the right tool when a cast is uneven across the tonal range, where a single white balance correction cannot reach.`,
    whatItDoes: [
      'Nine sliders, Red, Green and Blue for each of Shadows, Midtones and Highlights, from -100 to 100, plus a Preserve luminosity switch that is on by default.',
      'Shadow and highlight weights come from the BT.709 luma, midtone weight from the HSL lightness, so each pixel takes a blend of the three groups rather than a hard split at a threshold.',
      'A shift of 100 on a channel at full weight moves it by 0.3, or 77 levels of 255, so the sliders are fine enough to correct a cast of a few levels and strong enough for a teal and orange grade.',
      'Preserve luminosity rescales every pixel back to its original luma after the shift, which keeps the histogram in place while the color moves; switch it off and the sliders also brighten or darken.',
      'The layer accepts a mask, opacity and blend mode like any other, and the export renders the original at full resolution with the same weights.',
    ],
    flowSteps: [
      { title: 'Drop the photo', description: 'JPG, PNG, WebP, GIF, HEIC, AVIF or TIFF. The editor opens on the Color balance panel with all nine sliders at 0.' },
      { title: 'Find the cast', description: 'Hold backslash to compare with the original and read the RGB histogram: a blue cast shows as a blue channel sitting to the right of red and green.' },
      { title: 'Shift the bands', description: 'Pull Blue down in the band where the cast lives, usually Shadows for shade and Midtones for mixed light, and add a little Red if the frame needs warmth.' },
      { title: 'Export', description: 'Choose the format and quality; the server renders the correction on the original and names the file (retouched).' },
    ],
    advancedDetails: [
      'The shadow weight is 1 - smoothstep(0, 0.5, L) and the highlight weight is smoothstep(0.5, 1, L), where L is the BT.709 luma 0.2126 R + 0.7152 G + 0.0722 B. A pixel at luma 0.122 has shadow weight 0.851 and no highlight weight; one at luma 0.897 has highlight weight 0.889 and no shadow weight; at luma 0.5 both are 0.',
      'The midtone weight is the Darkroom color balance weight: with l the HSL lightness (max + min) / 2, it is clamp((l - 0.333) x 4 + 0.5) x clamp((1 - l - 0.333) x 4 + 0.5) x 0.7, which peaks at 0.7 for l = 0.5 and reaches 0 below l about 0.21 and above l about 0.79. The three weights are not forced to sum to one; a mid gray gets 0.7 from Midtones and nothing from the other two.',
      'Each channel shift is 0.3 x (shadow weight x Shadows slider + midtone weight x Midtones slider + highlight weight x Highlights slider) / 100, added to the channel and clamped to 0..1. Midtones Red +20 on a mid gray of 0.5 is 0.3 x 0.7 x 0.2 = 0.042, which takes red to 0.542, level 138.',
      'With Preserve luminosity the shifted pixel is multiplied by original luma over shifted luma and clamped. The same Midtones Red +20 on mid gray then exports as (136, 125, 125): red is lifted and green and blue are lowered so the luma stays at exactly 0.5.',
      'Color balance and White balance are different operations: White balance shifts the midtones in linear light along fixed temperature and tint axes, while this layer works on gamma-encoded values with nine free sliders. Stack them when a scene has mixed light.',
      'The on-screen preview is rendered by WebGL2 on your GPU from a 1920 px copy; the exported file is rendered on our server from the original with the same weights, gain and luma rescale, and the two agree within the documented tolerance of a mean error of at most 1 and a maximum of 4 levels in 8 bits.',
    ],
    whyItMatters: [
      'Casts are rarely uniform: shade is blue in the shadows while the sunlit highlights are neutral, and only a per-band correction can fix one without harming the other.',
      'Luminosity preservation means a color fix does not become an exposure problem, so you can grade after the tones are set and the histogram does not move.',
      'Opposite shifts in shadows and highlights are the basis of most film and cinema looks, and nine sliders express them directly.',
    ],
    useCases: [
      { title: 'Fix a blue shade cast', description: 'Blue -15 in Shadows, Blue -20 and Red +5 in Midtones, Blue -10 in Highlights neutralises a portrait taken in open shade.' },
      { title: 'Remove a tungsten orange', description: 'Red -15 and Blue +10 in Midtones with a smaller version in Shadows brings an indoor scene back to neutral.' },
      { title: 'Teal and orange grade', description: 'Red -10 and Blue +15 in Shadows, Red +15, Green +5 and Blue -10 in Highlights, Midtones at 0, gives the cinema separation of skin from background.' },
      { title: 'Match two photos', description: 'Read the histograms of both and shift the bands of one until its channel peaks line up with the other.' },
    ],
    whyMediaManipulator: [
      `${PHOTO_BRAND} gives you nine luma-weighted sliders with luminosity preservation and a live RGB histogram, the same control a desktop editor offers, as one layer in a browser.`,
      'Color balance stacks under or over White balance, Curves and Levels, so a mixed-light scene can take a linear-light correction and a gamma-space grade in the same project.',
      'Adjusting and previewing cost nothing; the full-resolution export is one everyday operation, with the daily allowance on the pricing page.',
    ],
    privacyNote: `Color balance is computed in your browser from the photo you dropped; the correction itself never leaves your machine. Signed out, the project is held in this browser's IndexedDB and is uploaded only when you export, as a normal guest job rendered on our own server. Signed in, the original, a 1920 px preview and a thumbnail stay with the project under your retention setting and are deleted with the project or the account. ${RETENTION_PROMISE}. We do not hand files to any third party.`,
    faq: [
      { question: 'Should I use color balance or white balance to fix a cast?', answer: 'Start with White balance when the whole frame is off in one direction, because it corrects in linear light with two sliders. Use Color balance when the cast differs between shadows and highlights, or when white balance has fixed the midtones and the shadows are still blue.' },
      { question: 'What exactly counts as a shadow, a midtone and a highlight here?', answer: 'Shadows weight falls from 1 at black to 0 at luma 0.5 along a smoothstep; highlights rise from 0 at 0.5 to 1 at white; midtones peak at 0.7 at lightness 0.5 and reach 0 near 0.21 and 0.79. Every pixel is a blend, so there is no hard boundary between the bands.' },
      { question: 'How big a change does a slider value of 20 make?', answer: 'At full weight for its band, 20 shifts the channel by 0.3 x 0.2 = 0.06, about 15 levels. In the Midtones, where the peak weight is 0.7, the same 20 gives 0.042, about 11 levels, before the luminosity rescale redistributes it across the three channels.' },
      { question: 'Why does lowering Blue also raise Red and Green a little?', answer: 'That is Preserve luminosity at work. Lowering blue drops the luma, so the pixel is scaled back up until the luma matches the original, and all three channels share that scale. Turn the option off to see the raw shift.' },
      { question: 'Can I restrict the correction to one part of the frame?', answer: 'Give the layer a mask: a Linear gradient for a sky, a Luminosity range to narrow the band further, or a Brush. The mask value blends between the original and the corrected pixel.' },
      { question: 'Is this the same as the Color balance in Darkroom?', answer: 'The midtone weight function is shared with Darkroom, our video editor, so a midtone shift matches between a still and a frame of video. The photo layer adds the shadow and highlight bands and the luminosity option.' },
    ],
    related: [
      { label: 'White balance a photo', to: '/tools/white-balance-photo', description: 'Temperature and tint in linear light for a uniform cast.' },
      { label: 'Split toning', to: '/tools/split-toning', description: 'A hue and saturation for shadows and highlights instead of nine channel sliders.' },
      { label: 'Photo curves', to: '/tools/photo-curves', description: 'Per-channel curves when the cast varies in a way three bands cannot follow.' },
      { label: 'Photo levels', to: '/tools/photo-levels', description: 'Set the black and white point per channel before balancing the midtones.' },
      { label: 'Tint a photo', to: '/tools/tint-photo', description: 'Add a single color wash by density rather than balance three channels.' },
      { label: 'Photo editor tutorial', to: '/tutorials/aperture', description: 'How layers, masks and looks fit together in the editor.' },
    ],
    primaryKeyword: 'color balance photo online',
    secondaryKeywords: ['fix color cast', 'remove blue tint from photo', 'color correction online', 'shadows midtones highlights color', 'remove orange tint photo', 'photo color balance tool'],
    supportedFormats: {
      supportedInputFormats: ['JPG', 'PNG', 'WebP', 'GIF', 'HEIC', 'HEIF', 'AVIF', 'TIFF', 'BMP'],
      supportedOutputFormats: ['JPG', 'PNG', 'WebP', 'AVIF', 'TIFF'],
      processingNotes: [
        'Color balance is a per-pixel stage with three weights and one rescale; export time is set by the encoder, a few seconds for a 24 megapixel JPG.',
        'The export can strip or keep metadata; the original camera white balance tag is unchanged either way because the pixels, not the tags, are corrected.',
      ],
    },
    workedExamples: [
      {
        title: 'A portrait in open shade: pulling blue out of three bands on a 24 MP JPEG',
        body: 'A 6000 x 4000 JPEG (24 megapixels, 11 MB) shot in the shade of a building. Settings: Shadows Blue -15, Midtones Red +5 and Blue -20, Highlights Blue -10, Preserve luminosity on. A gray card in the frame reads (115, 122, 143), luma 0.479, with shadow weight 0.005, midtone weight 0.7 and highlight weight 0: red gains 0.3 x 0.7 x 0.05 = 0.0105, blue loses 0.3 x (0.005 x 0.15 + 0.7 x 0.20) = 0.0422, and after the luma rescale the card exports as (118, 123, 132), nearly neutral. A white shirt at (219, 230, 247), luma 0.897, is in the highlight band at weight 0.889, so blue drops by 0.3 x 0.889 x 0.1 = 0.0267 and it exports as (220, 230, 241). A dark jacket at (26, 31, 51), luma 0.122, takes the shadow slider at weight 0.851, blue drops by 0.0383 and it exports as (26, 31, 42). The 24 megapixel export needs Premium or Pro; at JPG quality 92 it is about 10.8 MB.',
      },
      {
        title: 'Midtones Red +20 on a gray card, with and without Preserve luminosity, 6 MP',
        body: 'A 3000 x 2000 JPEG (6 megapixels, 2.4 MB) with a mid gray of (128, 128, 128), which has luma 0.5 and HSL lightness 0.5, so its midtone weight is the peak value 0.7 and its shadow and highlight weights are 0. Midtones Red +20 adds 0.3 x 0.7 x 0.2 = 0.042 to red. With Preserve luminosity off the card exports as (138, 128, 128), luma 0.509, a touch brighter. With it on, the pixel is scaled by 0.5 / 0.509 = 0.982 and exports as (136, 125, 125), luma exactly 0.5. The same +20 placed in Shadows or Highlights does nothing to this pixel because both of those weights are 0 at luma 0.5. The 6 megapixel export fits the free cap; as JPG at quality 92 it is about 2.7 MB, as WebP about 1.8 MB.',
      },
    ],
    whenNotToUse: `When the whole photo is uniformly too blue or too orange, the white balance page corrects it in linear light with two sliders and is the faster, more accurate fix; reach for color balance only when the cast differs between the shadows and the highlights. If the aim is a creative color in the shadows and another in the highlights, split toning has a hue and saturation for each end plus a balance, which is simpler than nine sliders. A cast that changes with position rather than brightness, such as a lamp on one side of the room, needs a masked layer or a gradient mask on this one. And a channel that is clipped at 0 or 255 cannot be recovered by balancing.`,
    embed: {
      title: 'Color balance a photo',
      description: `Drop a photo to open ${PHOTO_BRAND} on the Color balance panel: nine sliders for red, green and blue in shadows, midtones and highlights, with luminosity preserved.`,
    },
  },
];

export default PAGES;
