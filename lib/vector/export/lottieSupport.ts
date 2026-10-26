/**
 * What Lottie can and cannot carry between Motion documents and Lottie JSON
 * (ticket MM46 decisions 1–4). THE single source for the unsupported list:
 * the writer (`./lottie.ts`) and the reader (`../import/lottie.ts`) emit
 * warnings with these feature codes, the export dialog renders the list
 * (`vector.lottie.unsupported.<feature>`), and the design doc (§8 MM46)
 * copies it.
 *
 * Rule: nothing is dropped silently. Every feature here produces a warning
 * entry `{layerId, feature, reason}` when it is met, and the tests assert one
 * fixture per feature (`lottie.test.ts`, `../import/lottie.test.ts`).
 *
 * Fidelity target (§7, proposed in the ticket, confirmed in the MM46 log):
 * the LottieFiles "Basic" feature set — shape layers, groups, rectangles,
 * ellipses, paths, fills, strokes, gradients, trim paths, transforms,
 * opacity, masks in add / subtract mode, embedded images and keyframes with
 * bezier easing and holds. Everything else warns.
 */

/** The Lottie specification revision both directions target (the spec is a living document; research §2). */
export const LOTTIE_SPEC = {
  /** Lottie Animation Community format specification, tagged release. */
  revision: '1.0.1',
  /** `ver` field: MMmmpp (spec "Composition › Animation"). */
  ver: 10001,
  url: 'https://lottie.github.io/lottie-spec/1.0.1/',
  /** GitHub release date of the tag. */
  released: '2025-06-26',
} as const;

/**
 * `v`: the Bodymovin version string that players (lottie-web, the LottieFiles
 * viewer, the Flutter `lottie` package) read to decide which legacy fixes to
 * apply. 5.12.0 is newer than every fix, so players use the data as written.
 */
export const LOTTIE_BODYMOVIN_VERSION = '5.12.0';

/** Motion features the WRITER cannot express in Lottie. */
export const LOTTIE_EXPORT_UNSUPPORTED = [
  /** Luminance / gradient / grey masks, masks on nested layers, animated mask or clip content. Basic add (white or clip) and subtract (black) shapes on a top-level layer are supported. */
  'maskAdvanced',
  /** SVG filters (blur): Lottie 1.0.1 has no effects. */
  'filter',
  /** Text: needs font outlines, which the browser does not expose; the layer is omitted. */
  'text',
  /** Image layers whose pixels are not embedded (asset references), or images inside a group. */
  'image',
  /** `use` of a symbol with its own viewBox or size, or of opaque markup. */
  'useComplex',
  /** Opaque (raw) SVG markup the editor keeps but does not model. */
  'raw',
  /** CSS-only presentation: blend modes, vector effects, markers, visibility. */
  'cssOnly',
  /** Animated gradient stops on a stroke gradient. */
  'strokeGradientAnimation',
  /** Gradients Lottie cannot draw exactly: spread reflect / repeat, focal radius, radial gradients stretched into ellipses. */
  'gradientShape',
  /** Paints that are not plain colours or gradients (`currentColor`, colour functions, animated gradient references). */
  'paint',
  /** Skew on both axes at once (Lottie has one skew with an axis). */
  'skew',
  /** Shape keys that change their number of subpaths. */
  'morph',
  /** "Play once": Lottie files carry no loop flag (the player decides, and most loop). */
  'playOnce',
] as const;

/** Lottie features the READER cannot map to a Motion document. */
export const LOTTIE_IMPORT_UNSUPPORTED = [
  /** After Effects expressions: the keyframed values are used, the script is ignored. */
  'expression',
  /** Layer effects (blur, drop shadow, tint…). */
  'effect',
  /** Text layers with glyph or font data: kept as an empty, labelled placeholder group. */
  'textLayer',
  /** Precomposition time remapping. */
  'timeRemap',
  /** 3D layers, cameras and 3D rotation. */
  'threeD',
  /** Blend modes other than normal. */
  'blendMode',
  /** Track mattes (alpha / luma). */
  'matte',
  /** Masks other than add / subtract (intersect, inverted, animated, partial opacity, expansion). */
  'maskMode',
  /** Shape modifiers other than trim paths (repeater, round corners, merge, offset, pucker, twist, zig zag). */
  'modifier',
  /** Images that are not embedded in the JSON. */
  'imageExternal',
  /** Curved motion paths (position keyframe tangents): the layer moves in straight lines. */
  'spatialTangents',
  /** Layer in / out points when the layer's opacity is animated as well. */
  'layerTiming',
  /** Layer types Motion does not draw (audio, camera, data, unknown). */
  'unknownLayer',
  /** Shape items the reader does not know. */
  'unknownShape',
  /** Auto-orient along the motion path. */
  'autoOrient',
  /** Skew along an axis other than 0° or 90°. */
  'skewAxis',
  /** Polystar roundness and animated polystars (the star is drawn as a plain outline). */
  'polystar',
  /** Trim paths that do more than draw on or erase one path. */
  'trimComplex',
  /** Animated gradient start / end points, animated stroke gradients. */
  'gradientAnimation',
  /** Several fills or strokes on the same shape: the nearest one is used. */
  'multipleStyles',
  /** Animated fill or stroke opacity that cannot fold into the colour (gradients, keys out of step). */
  'styleOpacity',
  /** Shape keys whose vertex counts differ: matched up by Motion's morph normaliser, so in-betweens differ from other players. */
  'morphCounts',
] as const;

export type LottieExportFeature = (typeof LOTTIE_EXPORT_UNSUPPORTED)[number];
export type LottieImportFeature = (typeof LOTTIE_IMPORT_UNSUPPORTED)[number];
export type LottieFeature = LottieExportFeature | LottieImportFeature;

/** Every unsupported feature, export side first (dialog and docs order). */
export const LOTTIE_UNSUPPORTED: readonly LottieFeature[] = [...LOTTIE_EXPORT_UNSUPPORTED, ...LOTTIE_IMPORT_UNSUPPORTED];

/**
 * One thing that did not carry over. `layerId` is the Motion layer it concerns
 * (writer: the source layer; reader: the layer or placeholder created for it,
 * or '' for document-level items such as a camera). `reason` is a short
 * technical English detail for logs and support; the UI shows the localised
 * feature text (`vector.lottie.unsupported.<feature>`) and the layer name.
 */
export interface LottieWarning {
  layerId: string;
  feature: LottieFeature;
  reason: string;
}

/** i18n key of a feature's user-facing description. */
export const lottieFeatureKey = (feature: LottieFeature) => `vector.lottie.unsupported.${feature}`;
