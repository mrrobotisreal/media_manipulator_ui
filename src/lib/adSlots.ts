/**
 * Central map of every AdSense slot ID used in the app, keyed by call-site
 * identifier. The actual numeric slot IDs come from the AdSense dashboard —
 * see ADS.md at the repo root for the source-of-truth list.
 *
 * Sidebar halfpage ads come in left + right variants so the content sits
 * centered between two sticky rails on wide screens.
 */

export const AD_SLOTS = {
  // ---------------------------------------------------------- Content Studio
  content_studio_header: '5299736787',
  content_studio_footer: '2673573443',
  content_studio_sidebar_right: '3240926956',
  content_studio_sidebar_left: '5461416092',
  content_studio_incontent: '9121607896',
  content_studio_mobile_anchor: '2007055116',

  // ---------------------------------------------------------- Homepage
  home_header: '2367514744',
  home_footer: '6193559201',
  home_sidebar_right: '5171287420',
  home_sidebar_left: '5948649649',
  home_result_postconvert: '2149005439',

  // ---------------------------------------------------------- Blog index
  blog_index_header: '2254314194',
  blog_index_footer: '6656593639',
  blog_index_sidebar_right: '5866256149',
  blog_index_sidebar_left: '3298435577',

  // ---------------------------------------------------------- Blog: Video Compression
  blog_video_header: '4610534703',
  blog_video_sidebar_right: '9873406619',
  blog_video_sidebar_left: '1689840430',
  blog_video_incontent_1: '4346125061',
  blog_video_incontent_2: '3033043396',
  blog_video_footer: '6347122351',

  // ---------------------------------------------------------- Blog: Image Optimization
  blog_image_header: '7327511625',
  blog_image_sidebar_right: '7067657171',
  blog_image_sidebar_left: '2695423048',
  blog_image_incontent_1: '8624281423',
  blog_image_incontent_2: '7682734842',
  blog_image_footer: '3108230869',

  // ---------------------------------------------------------- Blog: Audio Quality
  blog_audio_header: '8037958065',
  blog_audio_sidebar_right: '5411794728',
  blog_audio_sidebar_left: '8215720335',
  blog_audio_incontent_1: '5754575506',
  blog_audio_incontent_2: '1170817294',
  blog_audio_footer: '3088506411',

  // ---------------------------------------------------------- Tools index
  tools_index_header: '4737007305',
  tools_index_content_studio_banner: 'PLACEHOLDER-tools_index_content_studio_banner',
  tools_index_sidebar_right: '6780716713',
  tools_index_sidebar_left: '5704729767',
  tools_index_image_banner: '5998118080',
  tools_index_video_banner: '9817566291',
  tools_index_audio_banner: '6836179738',
  tools_index_ai_banner: '9466212501',
  tools_index_privacy_banner: '3128412166',
  tools_index_footer: '9745791400',

  // ---------------------------------------------------------- Tutorials index
  tutorials_index_header: '8027869685',
  tutorials_index_audio_banner: '9807855211',
  tutorials_index_video_banner: '5189953353',
  tutorials_index_image_banner: '2775543009',
  tutorials_index_footer: '4369798498',

  // ---------------------------------------------------------- Tutorial articles
  tutorial_audio_header: '6523216322',
  tutorial_audio_sidebar_right: '7754887039',
  tutorial_audio_sidebar_left: '7259381799',
  tutorial_audio_incontent: '3815642026',
  tutorial_audio_footer: '1189478681',

  tutorial_video_header: '8316782369',
  tutorial_video_sidebar_right: '3624070331',
  tutorial_video_sidebar_left: '8714413789',
  tutorial_video_incontent: '5491308476',
  tutorial_video_footer: '9400661105',

  tutorial_image_header: '4178226805',
  tutorial_image_sidebar_right: '3432498644',
  tutorial_image_sidebar_left: '7401332118',
  tutorial_image_incontent: '3685299995',
  tutorial_image_footer: '9806335303',

  // ---------------------------------------------------------- Static pages
  about_header: '5299736787',
  about_footer: '2673573443',
  how_it_works_header: '3240926956',
  how_it_works_footer: '5461416092',

  // ---------------------------------------------------------- 404 + mobile anchor
  not_found_footer: '9121607896',
  mobile_anchor: '2007055116',
} as const;

export type AdSlotKey = keyof typeof AD_SLOTS;

interface ToolAdSlotSet {
  header: string;
  sidebar_right: string;
  sidebar_left: string;
  incontent: string;
  footer: string;
}

/**
 * Per-tool slot IDs, keyed by the slug under /tools/:slug. Every tool that has
 * a dedicated `/tools/<slug>` page should have an entry here so the landing
 * page can read its own slot IDs without baking placeholders into the shared
 * component.
 */
export const TOOL_AD_SLOTS: Record<string, ToolAdSlotSet> = {
  // Image
  'convert-webp-to-jpg': {
    header: '8227180238',
    sidebar_right: '6265334092',
    sidebar_left: '5541455531',
    incontent: '3224237781',
    footer: '1911156115',
  },
  'image-converter': {
    header: '6453036356',
    sidebar_right: '9598074442',
    sidebar_left: '1382341373',
    incontent: '8284992777',
    footer: '2513791346',
  },

  // Video
  'compress-video': {
    header: '6971911109',
    sidebar_right: '8887628006',
    sidebar_left: '9069259701',
    incontent: '6261464667',
    footer: '2326089088',
  },
  'transcode-to-hls': {
    header: '9404530532',
    sidebar_right: '9406502758',
    sidebar_left: '5559287316',
    incontent: '2974853558',
    footer: '6778367197',
  },
  'transcode-to-dash': {
    header: '5465285526',
    sidebar_right: '5371432124',
    sidebar_left: '4798842202',
    incontent: '4096363537',
    footer: '9212958840',
  },
  'convert-video-to-animated-gif': {
    header: '9157118526',
    sidebar_right: '8839903841',
    sidebar_left: '2933123975',
    incontent: '6530955187',
    footer: '5217873513',
  },
  'video-converter': {
    header: '5273713833',
    sidebar_right: '2647550493',
    sidebar_left: '9306960634',
    incontent: '2745268785',
    footer: '1278628505',
  },
  'extract-audio-from-video': {
    header: '6022168818',
    sidebar_right: '6780339419',
    sidebar_left: '5349883844',
    incontent: '5082142140',
    footer: '3769060475',
  },
  // ADS.md "Remove Audio from Video" maps to the existing slug
  // `extract-video-only-from-video` (display name "Remove Audio from Video").
  'extract-video-only-from-video': {
    header: '1528012737',
    sidebar_right: '9119105442',
    sidebar_left: '9472961683',
    incontent: '5830597129',
    footer: '6588767722',
  },
  'extract-frames-from-video': {
    header: '3962604382',
    sidebar_right: '9023359379',
    sidebar_left: '7993878966',
    incontent: '7325162103',
    footer: '5179860435',
  },
  // ADS.md "Add Audio to Video" maps to slug `stitch-audio-to-video`.
  'stitch-audio-to-video': {
    header: '5639025439',
    sidebar_right: '4038169153',
    sidebar_left: '1077116822',
    incontent: '4834730133',
    footer: '3246316291',
  },

  // Audio
  'convert-wav-to-mp3': {
    header: '2457951028',
    sidebar_right: '1933234621',
    sidebar_left: '2907553333',
    incontent: '9620152953',
    footer: '4325943762',
  },
  'isolate-vocals-from-song': {
    header: '8735962067',
    sidebar_right: '1699780421',
    sidebar_left: '2549980599',
    incontent: '6109798726',
    footer: '8640215994',
  },
  'audio-converter': {
    header: '3387889318',
    sidebar_right: '8582403451',
    sidebar_left: '5397985302',
    incontent: '9761725978',
    footer: '7269321785',
  },
  'audio-waveform-generator': {
    header: '6760535411',
    sidebar_right: '9759753757',
    sidebar_left: '7592903805',
    incontent: '8446672084',
    footer: '5822480968',
  },

  // AI
  'transcribe-video': {
    header: '2170553718',
    sidebar_right: '9857472045',
    sidebar_left: '3511708479',
    incontent: '2863172919',
    footer: '3190475979',
  },
  'srt-generator': {
    header: '7923927909',
    sidebar_right: '5297764566',
    sidebar_left: '6251524678',
    incontent: '2671601221',
    footer: '8251230961',
  },
  'caption-translator': {
    header: '4643158449',
    sidebar_right: '1508208736',
    sidebar_left: '6554777002',
    incontent: '3330076774',
    footer: '9703913435',
  },
  // ai-frame-interpolation slots — placeholders until provisioned in AdSense.
  // The AdBanner component already gates renders behind the configured slot
  // ID, so the page lays out with reserved heights but does not call AdSense
  // with invalid IDs at runtime.
  'ai-frame-interpolation': {
    header: '6304329719',
    sidebar_right: '8645449800',
    sidebar_left: '7332368138',
    incontent: '1048133602',
    footer: '3666935380',
  },

  // Privacy / metadata
  'remove-exif-metadata': {
    header: '4311985957',
    sidebar_right: '1685822610',
    sidebar_left: '5373934576',
    incontent: '6634896969',
    footer: '7379105216',
  },

  // ---------------------------------------------------------- Image SEO batch 1
  // PLACEHOLDER slot IDs — these tool pages were added before their AdSense
  // units were provisioned in the dashboard. An unprovisioned slot simply goes
  // "unfilled" and the CreaTV in-house creative (the existing fallback in
  // AdBanner) renders in its place, so layout/heights are reserved correctly
  // and no invalid live ad request is served. Replace each value with the real
  // numeric slot ID from ADS.md once the units are created.
  'convert-png-to-jpg': {
    header: 'PLACEHOLDER-convert-png-to-jpg-header',
    sidebar_right: 'PLACEHOLDER-convert-png-to-jpg-sidebar-right',
    sidebar_left: 'PLACEHOLDER-convert-png-to-jpg-sidebar-left',
    incontent: 'PLACEHOLDER-convert-png-to-jpg-incontent',
    footer: 'PLACEHOLDER-convert-png-to-jpg-footer',
  },
  'convert-jpg-to-png': {
    header: 'PLACEHOLDER-convert-jpg-to-png-header',
    sidebar_right: 'PLACEHOLDER-convert-jpg-to-png-sidebar-right',
    sidebar_left: 'PLACEHOLDER-convert-jpg-to-png-sidebar-left',
    incontent: 'PLACEHOLDER-convert-jpg-to-png-incontent',
    footer: 'PLACEHOLDER-convert-jpg-to-png-footer',
  },
  'convert-webp-to-png': {
    header: 'PLACEHOLDER-convert-webp-to-png-header',
    sidebar_right: 'PLACEHOLDER-convert-webp-to-png-sidebar-right',
    sidebar_left: 'PLACEHOLDER-convert-webp-to-png-sidebar-left',
    incontent: 'PLACEHOLDER-convert-webp-to-png-incontent',
    footer: 'PLACEHOLDER-convert-webp-to-png-footer',
  },
  'convert-png-to-webp': {
    header: 'PLACEHOLDER-convert-png-to-webp-header',
    sidebar_right: 'PLACEHOLDER-convert-png-to-webp-sidebar-right',
    sidebar_left: 'PLACEHOLDER-convert-png-to-webp-sidebar-left',
    incontent: 'PLACEHOLDER-convert-png-to-webp-incontent',
    footer: 'PLACEHOLDER-convert-png-to-webp-footer',
  },
  'convert-jpg-to-webp': {
    header: 'PLACEHOLDER-convert-jpg-to-webp-header',
    sidebar_right: 'PLACEHOLDER-convert-jpg-to-webp-sidebar-right',
    sidebar_left: 'PLACEHOLDER-convert-jpg-to-webp-sidebar-left',
    incontent: 'PLACEHOLDER-convert-jpg-to-webp-incontent',
    footer: 'PLACEHOLDER-convert-jpg-to-webp-footer',
  },
  'jpg-converter': {
    header: 'PLACEHOLDER-jpg-converter-header',
    sidebar_right: 'PLACEHOLDER-jpg-converter-sidebar-right',
    sidebar_left: 'PLACEHOLDER-jpg-converter-sidebar-left',
    incontent: 'PLACEHOLDER-jpg-converter-incontent',
    footer: 'PLACEHOLDER-jpg-converter-footer',
  },
  'png-converter': {
    header: 'PLACEHOLDER-png-converter-header',
    sidebar_right: 'PLACEHOLDER-png-converter-sidebar-right',
    sidebar_left: 'PLACEHOLDER-png-converter-sidebar-left',
    incontent: 'PLACEHOLDER-png-converter-incontent',
    footer: 'PLACEHOLDER-png-converter-footer',
  },
  'image-resizer': {
    header: 'PLACEHOLDER-image-resizer-header',
    sidebar_right: 'PLACEHOLDER-image-resizer-sidebar-right',
    sidebar_left: 'PLACEHOLDER-image-resizer-sidebar-left',
    incontent: 'PLACEHOLDER-image-resizer-incontent',
    footer: 'PLACEHOLDER-image-resizer-footer',
  },
  'compress-image': {
    header: 'PLACEHOLDER-compress-image-header',
    sidebar_right: 'PLACEHOLDER-compress-image-sidebar-right',
    sidebar_left: 'PLACEHOLDER-compress-image-sidebar-left',
    incontent: 'PLACEHOLDER-compress-image-incontent',
    footer: 'PLACEHOLDER-compress-image-footer',
  },
  'remove-background-from-image': {
    header: 'PLACEHOLDER-remove-background-from-image-header',
    sidebar_right: 'PLACEHOLDER-remove-background-from-image-sidebar-right',
    sidebar_left: 'PLACEHOLDER-remove-background-from-image-sidebar-left',
    incontent: 'PLACEHOLDER-remove-background-from-image-incontent',
    footer: 'PLACEHOLDER-remove-background-from-image-footer',
  },

  // ---------------------------------------------------------- PDF SEO batch 2
  // PLACEHOLDER slot IDs — same pattern as the image batch above. Unprovisioned
  // slots fall back to the CreaTV in-house creative, so layout heights are
  // reserved and no invalid live ad request is served. Replace with real
  // numeric slot IDs from ADS.md once the AdSense units are created.
  'image-to-pdf': {
    header: 'PLACEHOLDER-image-to-pdf-header',
    sidebar_right: 'PLACEHOLDER-image-to-pdf-sidebar-right',
    sidebar_left: 'PLACEHOLDER-image-to-pdf-sidebar-left',
    incontent: 'PLACEHOLDER-image-to-pdf-incontent',
    footer: 'PLACEHOLDER-image-to-pdf-footer',
  },
  'convert-jpg-to-pdf': {
    header: 'PLACEHOLDER-convert-jpg-to-pdf-header',
    sidebar_right: 'PLACEHOLDER-convert-jpg-to-pdf-sidebar-right',
    sidebar_left: 'PLACEHOLDER-convert-jpg-to-pdf-sidebar-left',
    incontent: 'PLACEHOLDER-convert-jpg-to-pdf-incontent',
    footer: 'PLACEHOLDER-convert-jpg-to-pdf-footer',
  },
  'convert-png-to-pdf': {
    header: 'PLACEHOLDER-convert-png-to-pdf-header',
    sidebar_right: 'PLACEHOLDER-convert-png-to-pdf-sidebar-right',
    sidebar_left: 'PLACEHOLDER-convert-png-to-pdf-sidebar-left',
    incontent: 'PLACEHOLDER-convert-png-to-pdf-incontent',
    footer: 'PLACEHOLDER-convert-png-to-pdf-footer',
  },
  'pdf-to-jpg': {
    header: 'PLACEHOLDER-pdf-to-jpg-header',
    sidebar_right: 'PLACEHOLDER-pdf-to-jpg-sidebar-right',
    sidebar_left: 'PLACEHOLDER-pdf-to-jpg-sidebar-left',
    incontent: 'PLACEHOLDER-pdf-to-jpg-incontent',
    footer: 'PLACEHOLDER-pdf-to-jpg-footer',
  },
  'pdf-to-png': {
    header: 'PLACEHOLDER-pdf-to-png-header',
    sidebar_right: 'PLACEHOLDER-pdf-to-png-sidebar-right',
    sidebar_left: 'PLACEHOLDER-pdf-to-png-sidebar-left',
    incontent: 'PLACEHOLDER-pdf-to-png-incontent',
    footer: 'PLACEHOLDER-pdf-to-png-footer',
  },
  'pdf-converter': {
    header: 'PLACEHOLDER-pdf-converter-header',
    sidebar_right: 'PLACEHOLDER-pdf-converter-sidebar-right',
    sidebar_left: 'PLACEHOLDER-pdf-converter-sidebar-left',
    incontent: 'PLACEHOLDER-pdf-converter-incontent',
    footer: 'PLACEHOLDER-pdf-converter-footer',
  },

  // ---------------------------------------------------------- Modern/vector/favicon SEO batch 3
  // PLACEHOLDER slot IDs — same pattern as earlier batches. Unprovisioned slots
  // fall back to the CreaTV in-house creative. Replace with real numeric slot
  // IDs from ADS.md once the AdSense units are created.
  'convert-heic-to-jpg': {
    header: 'PLACEHOLDER-convert-heic-to-jpg-header',
    sidebar_right: 'PLACEHOLDER-convert-heic-to-jpg-sidebar-right',
    sidebar_left: 'PLACEHOLDER-convert-heic-to-jpg-sidebar-left',
    incontent: 'PLACEHOLDER-convert-heic-to-jpg-incontent',
    footer: 'PLACEHOLDER-convert-heic-to-jpg-footer',
  },
  'convert-avif-to-jpg': {
    header: 'PLACEHOLDER-convert-avif-to-jpg-header',
    sidebar_right: 'PLACEHOLDER-convert-avif-to-jpg-sidebar-right',
    sidebar_left: 'PLACEHOLDER-convert-avif-to-jpg-sidebar-left',
    incontent: 'PLACEHOLDER-convert-avif-to-jpg-incontent',
    footer: 'PLACEHOLDER-convert-avif-to-jpg-footer',
  },
  'convert-avif-to-png': {
    header: 'PLACEHOLDER-convert-avif-to-png-header',
    sidebar_right: 'PLACEHOLDER-convert-avif-to-png-sidebar-right',
    sidebar_left: 'PLACEHOLDER-convert-avif-to-png-sidebar-left',
    incontent: 'PLACEHOLDER-convert-avif-to-png-incontent',
    footer: 'PLACEHOLDER-convert-avif-to-png-footer',
  },
  'convert-svg-to-png': {
    header: 'PLACEHOLDER-convert-svg-to-png-header',
    sidebar_right: 'PLACEHOLDER-convert-svg-to-png-sidebar-right',
    sidebar_left: 'PLACEHOLDER-convert-svg-to-png-sidebar-left',
    incontent: 'PLACEHOLDER-convert-svg-to-png-incontent',
    footer: 'PLACEHOLDER-convert-svg-to-png-footer',
  },
  'convert-png-to-svg': {
    header: 'PLACEHOLDER-convert-png-to-svg-header',
    sidebar_right: 'PLACEHOLDER-convert-png-to-svg-sidebar-right',
    sidebar_left: 'PLACEHOLDER-convert-png-to-svg-sidebar-left',
    incontent: 'PLACEHOLDER-convert-png-to-svg-incontent',
    footer: 'PLACEHOLDER-convert-png-to-svg-footer',
  },
  'png-to-ico': {
    header: 'PLACEHOLDER-png-to-ico-header',
    sidebar_right: 'PLACEHOLDER-png-to-ico-sidebar-right',
    sidebar_left: 'PLACEHOLDER-png-to-ico-sidebar-left',
    incontent: 'PLACEHOLDER-png-to-ico-incontent',
    footer: 'PLACEHOLDER-png-to-ico-footer',
  },
  'svg-converter': {
    header: 'PLACEHOLDER-svg-converter-header',
    sidebar_right: 'PLACEHOLDER-svg-converter-sidebar-right',
    sidebar_left: 'PLACEHOLDER-svg-converter-sidebar-left',
    incontent: 'PLACEHOLDER-svg-converter-incontent',
    footer: 'PLACEHOLDER-svg-converter-footer',
  },

  // ---------------------------------------------------------- Video SEO batch 1
  // PLACEHOLDER slot IDs — same pattern as earlier batches. Unprovisioned slots
  // fall back to the CreaTV in-house creative, so layout heights are reserved
  // and no invalid live ad request is served. Replace with real numeric slot
  // IDs from ADS.md once the AdSense units are created.
  'mp4-converter': {
    header: 'PLACEHOLDER-mp4-converter-header',
    sidebar_right: 'PLACEHOLDER-mp4-converter-sidebar-right',
    sidebar_left: 'PLACEHOLDER-mp4-converter-sidebar-left',
    incontent: 'PLACEHOLDER-mp4-converter-incontent',
    footer: 'PLACEHOLDER-mp4-converter-footer',
  },
  'convert-mov-to-mp4': {
    header: 'PLACEHOLDER-convert-mov-to-mp4-header',
    sidebar_right: 'PLACEHOLDER-convert-mov-to-mp4-sidebar-right',
    sidebar_left: 'PLACEHOLDER-convert-mov-to-mp4-sidebar-left',
    incontent: 'PLACEHOLDER-convert-mov-to-mp4-incontent',
    footer: 'PLACEHOLDER-convert-mov-to-mp4-footer',
  },
  'convert-webm-to-mp4': {
    header: 'PLACEHOLDER-convert-webm-to-mp4-header',
    sidebar_right: 'PLACEHOLDER-convert-webm-to-mp4-sidebar-right',
    sidebar_left: 'PLACEHOLDER-convert-webm-to-mp4-sidebar-left',
    incontent: 'PLACEHOLDER-convert-webm-to-mp4-incontent',
    footer: 'PLACEHOLDER-convert-webm-to-mp4-footer',
  },
  'convert-avi-to-mp4': {
    header: 'PLACEHOLDER-convert-avi-to-mp4-header',
    sidebar_right: 'PLACEHOLDER-convert-avi-to-mp4-sidebar-right',
    sidebar_left: 'PLACEHOLDER-convert-avi-to-mp4-sidebar-left',
    incontent: 'PLACEHOLDER-convert-avi-to-mp4-incontent',
    footer: 'PLACEHOLDER-convert-avi-to-mp4-footer',
  },
  'convert-mkv-to-mp4': {
    header: 'PLACEHOLDER-convert-mkv-to-mp4-header',
    sidebar_right: 'PLACEHOLDER-convert-mkv-to-mp4-sidebar-right',
    sidebar_left: 'PLACEHOLDER-convert-mkv-to-mp4-sidebar-left',
    incontent: 'PLACEHOLDER-convert-mkv-to-mp4-incontent',
    footer: 'PLACEHOLDER-convert-mkv-to-mp4-footer',
  },
  'convert-mp4-to-webm': {
    header: 'PLACEHOLDER-convert-mp4-to-webm-header',
    sidebar_right: 'PLACEHOLDER-convert-mp4-to-webm-sidebar-right',
    sidebar_left: 'PLACEHOLDER-convert-mp4-to-webm-sidebar-left',
    incontent: 'PLACEHOLDER-convert-mp4-to-webm-incontent',
    footer: 'PLACEHOLDER-convert-mp4-to-webm-footer',
  },
  'mp4-to-mp3': {
    header: 'PLACEHOLDER-mp4-to-mp3-header',
    sidebar_right: 'PLACEHOLDER-mp4-to-mp3-sidebar-right',
    sidebar_left: 'PLACEHOLDER-mp4-to-mp3-sidebar-left',
    incontent: 'PLACEHOLDER-mp4-to-mp3-incontent',
    footer: 'PLACEHOLDER-mp4-to-mp3-footer',
  },
  'video-to-mp3': {
    header: 'PLACEHOLDER-video-to-mp3-header',
    sidebar_right: 'PLACEHOLDER-video-to-mp3-sidebar-right',
    sidebar_left: 'PLACEHOLDER-video-to-mp3-sidebar-left',
    incontent: 'PLACEHOLDER-video-to-mp3-incontent',
    footer: 'PLACEHOLDER-video-to-mp3-footer',
  },
  'mp4-to-gif': {
    header: 'PLACEHOLDER-mp4-to-gif-header',
    sidebar_right: 'PLACEHOLDER-mp4-to-gif-sidebar-right',
    sidebar_left: 'PLACEHOLDER-mp4-to-gif-sidebar-left',
    incontent: 'PLACEHOLDER-mp4-to-gif-incontent',
    footer: 'PLACEHOLDER-mp4-to-gif-footer',
  },
  'video-to-gif': {
    header: 'PLACEHOLDER-video-to-gif-header',
    sidebar_right: 'PLACEHOLDER-video-to-gif-sidebar-right',
    sidebar_left: 'PLACEHOLDER-video-to-gif-sidebar-left',
    incontent: 'PLACEHOLDER-video-to-gif-incontent',
    footer: 'PLACEHOLDER-video-to-gif-footer',
  },
  'gif-converter': {
    header: 'PLACEHOLDER-gif-converter-header',
    sidebar_right: 'PLACEHOLDER-gif-converter-sidebar-right',
    sidebar_left: 'PLACEHOLDER-gif-converter-sidebar-left',
    incontent: 'PLACEHOLDER-gif-converter-incontent',
    footer: 'PLACEHOLDER-gif-converter-footer',
  },

  // ---------------------------------------------------------- Video SEO batch 2
  // PLACEHOLDER slot IDs — same pattern as earlier batches. Unprovisioned slots
  // fall back to the CreaTV in-house creative. Replace with real numeric slot
  // IDs from ADS.md once the AdSense units are created.
  'video-compressor': {
    header: 'PLACEHOLDER-video-compressor-header',
    sidebar_right: 'PLACEHOLDER-video-compressor-sidebar-right',
    sidebar_left: 'PLACEHOLDER-video-compressor-sidebar-left',
    incontent: 'PLACEHOLDER-video-compressor-incontent',
    footer: 'PLACEHOLDER-video-compressor-footer',
  },
  'compress-mp4': {
    header: 'PLACEHOLDER-compress-mp4-header',
    sidebar_right: 'PLACEHOLDER-compress-mp4-sidebar-right',
    sidebar_left: 'PLACEHOLDER-compress-mp4-sidebar-left',
    incontent: 'PLACEHOLDER-compress-mp4-incontent',
    footer: 'PLACEHOLDER-compress-mp4-footer',
  },
  'video-trimmer': {
    header: 'PLACEHOLDER-video-trimmer-header',
    sidebar_right: 'PLACEHOLDER-video-trimmer-sidebar-right',
    sidebar_left: 'PLACEHOLDER-video-trimmer-sidebar-left',
    incontent: 'PLACEHOLDER-video-trimmer-incontent',
    footer: 'PLACEHOLDER-video-trimmer-footer',
  },
  'mp4-trimmer': {
    header: 'PLACEHOLDER-mp4-trimmer-header',
    sidebar_right: 'PLACEHOLDER-mp4-trimmer-sidebar-right',
    sidebar_left: 'PLACEHOLDER-mp4-trimmer-sidebar-left',
    incontent: 'PLACEHOLDER-mp4-trimmer-incontent',
    footer: 'PLACEHOLDER-mp4-trimmer-footer',
  },
  'video-cutter': {
    header: 'PLACEHOLDER-video-cutter-header',
    sidebar_right: 'PLACEHOLDER-video-cutter-sidebar-right',
    sidebar_left: 'PLACEHOLDER-video-cutter-sidebar-left',
    incontent: 'PLACEHOLDER-video-cutter-incontent',
    footer: 'PLACEHOLDER-video-cutter-footer',
  },
  'cut-video-online': {
    header: 'PLACEHOLDER-cut-video-online-header',
    sidebar_right: 'PLACEHOLDER-cut-video-online-sidebar-right',
    sidebar_left: 'PLACEHOLDER-cut-video-online-sidebar-left',
    incontent: 'PLACEHOLDER-cut-video-online-incontent',
    footer: 'PLACEHOLDER-cut-video-online-footer',
  },
  'crop-video': {
    header: 'PLACEHOLDER-crop-video-header',
    sidebar_right: 'PLACEHOLDER-crop-video-sidebar-right',
    sidebar_left: 'PLACEHOLDER-crop-video-sidebar-left',
    incontent: 'PLACEHOLDER-crop-video-incontent',
    footer: 'PLACEHOLDER-crop-video-footer',
  },
  'resize-video': {
    header: 'PLACEHOLDER-resize-video-header',
    sidebar_right: 'PLACEHOLDER-resize-video-sidebar-right',
    sidebar_left: 'PLACEHOLDER-resize-video-sidebar-left',
    incontent: 'PLACEHOLDER-resize-video-incontent',
    footer: 'PLACEHOLDER-resize-video-footer',
  },
  'rotate-video': {
    header: 'PLACEHOLDER-rotate-video-header',
    sidebar_right: 'PLACEHOLDER-rotate-video-sidebar-right',
    sidebar_left: 'PLACEHOLDER-rotate-video-sidebar-left',
    incontent: 'PLACEHOLDER-rotate-video-incontent',
    footer: 'PLACEHOLDER-rotate-video-footer',
  },
  'remove-audio-from-video': {
    header: 'PLACEHOLDER-remove-audio-from-video-header',
    sidebar_right: 'PLACEHOLDER-remove-audio-from-video-sidebar-right',
    sidebar_left: 'PLACEHOLDER-remove-audio-from-video-sidebar-left',
    incontent: 'PLACEHOLDER-remove-audio-from-video-incontent',
    footer: 'PLACEHOLDER-remove-audio-from-video-footer',
  },
};

/** Get the slot set for a tool slug, or undefined if none configured. */
export const getToolAdSlots = (slug: string): ToolAdSlotSet | undefined =>
  TOOL_AD_SLOTS[slug];
