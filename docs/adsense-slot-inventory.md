# AdSense Slot Inventory

This document is the **source of truth** for every AdSense identifier known to
the project. Real numeric slot IDs are preserved here so they are never lost,
even though most are intentionally **not** wired into the review-safe runtime.

> ⚠️ **Hard rule:** A `PLACEHOLDER-*` value must **never** reach a
> `data-ad-slot` attribute or any live ad request. `lib/adsenseConfig.ts`
> (`isRealAdSenseSlot`) only accepts 8–20 digit numeric strings, and
> `lib/adSlots.ts` contains no placeholders. Placeholder names are recorded in
> this doc **only** for historical reference.

## Publisher

- **AdSense publisher / client ID:** `ca-pub-3413790368941825`
- ads.txt line: `google.com, pub-3413790368941825, DIRECT, f08c47fec0942fa0`

## Generic catch-all ad units (by size/type)

Real units created as size-based fallbacks. Used to replace former
`PLACEHOLDER-*` in-content slots in `lib/adSlots.ts`.

| Type / Size                  | data-ad-slot |
| ---------------------------- | ------------ |
| Leaderboard Banner (728×90)  | `7990430994` |
| Small Banner (468×60)        | `8225245035` |
| Native MREC (336×280)        | `7160565051` |
| Halfpage Vertical (300×600)  | `5599081696` |
| Mobile MREC (300×250)        | `9595156701` |

The Native MREC (`7160565051`) is the generic **in-content** unit and is the
one used at runtime for review-allowed tools that never had a dedicated
in-content slot.

## Review-safe runtime slots (active in `lib/adSlots.ts`)

Only **in-content** slots for review-allowed tools are exposed at runtime, and
even these only render when `NEXT_PUBLIC_ADSENSE_ENABLED=true` in production on
a `/tools/<slug>` page.

| Tool slug                       | in-content slot | source            |
| ------------------------------- | --------------- | ----------------- |
| content-studio                  | `9121607896`    | real              |
| remove-exif-metadata            | `6634896969`    | real              |
| compress-video                  | `6261464667`    | real              |
| extract-audio-from-video        | `5082142140`    | real              |
| convert-video-to-animated-gif   | `6530955187`    | real              |
| transcribe-video                | `2863172919`    | real              |
| transcode-to-hls                | `2974853558`    | real              |
| compress-image                  | `7160565051`    | generic MREC      |
| image-resizer                   | `7160565051`    | generic MREC      |
| remove-background-from-image    | `7160565051`    | generic MREC      |
| image-to-pdf                    | `7160565051`    | generic MREC      |
| pdf-to-jpg                      | `7160565051`    | generic MREC      |
| video-trimmer                   | `7160565051`    | generic MREC      |

## Real page-level slots (NOT active during review)

Preserved for post-approval re-enablement of header/footer/sidebar/anchor/
post-conversion placements. These are intentionally not present in runtime
source today.

```
content_studio_header: 5299736787      content_studio_footer: 2673573443
content_studio_sidebar_right: 3240926956  content_studio_sidebar_left: 5461416092
content_studio_incontent: 9121607896   content_studio_mobile_anchor: 2007055116
home_header: 2367514744                home_footer: 6193559201
home_sidebar_right: 5171287420         home_sidebar_left: 5948649649
home_result_postconvert: 2149005439
blog_index_header: 2254314194          blog_index_footer: 6656593639
blog_index_sidebar_right: 5866256149   blog_index_sidebar_left: 3298435577
blog_video_header: 4610534703          blog_video_sidebar_right: 9873406619
blog_video_sidebar_left: 1689840430    blog_video_footer: 6347122351
blog_image_header: 7327511625          blog_image_sidebar_right: 7067657171
blog_image_sidebar_left: 2695423048    blog_image_footer: 3108230869
blog_audio_header: 8037958065          blog_audio_sidebar_right: 5411794728
blog_audio_sidebar_left: 8215720335    blog_audio_footer: 3088506411
tools_index_header: 4737007305         tools_index_footer: 9745791400
tools_index_sidebar_right: 6780716713  tools_index_sidebar_left: 5704729767
tools_index_image_banner: 5998118080   tools_index_video_banner: 9817566291
tools_index_audio_banner: 6836179738   tools_index_ai_banner: 9466212501
tools_index_privacy_banner: 3128412166
tutorials_index_header: 8027869685     tutorials_index_footer: 4369798498
tutorials_index_audio_banner: 9807855211  tutorials_index_video_banner: 5189953353
tutorials_index_image_banner: 2775543009
tutorial_audio_header: 6523216322      tutorial_audio_footer: 1189478681
tutorial_audio_sidebar_right: 7754887039  tutorial_audio_sidebar_left: 7259381799
tutorial_audio_incontent: 3815642026
tutorial_video_header: 8316782369      tutorial_video_footer: 9400661105
tutorial_video_sidebar_right: 3624070331  tutorial_video_sidebar_left: 8714413789
tutorial_video_incontent: 5491308476
tutorial_image_header: 4178226805      tutorial_image_footer: 9806335303
tutorial_image_sidebar_right: 3432498644  tutorial_image_sidebar_left: 7401332118
tutorial_image_incontent: 3685299995
about_header: 5299736787               about_footer: 2673573443
how_it_works_header: 3240926956        how_it_works_footer: 5461416092
not_found_footer: 9121607896           mobile_anchor: 2007055116
```

## Real per-tool slots (header/sidebar/in-content/footer) — NOT active

These tools had fully-provisioned real units in the original Vite app. Only the
in-content slot of review-allowed tools is active today; the rest are preserved
here for later.

```
convert-webp-to-jpg:   header 8227180238  sr 6265334092  sl 5541455531  incontent 3224237781  footer 1911156115
image-converter:       header 6453036356  sr 9598074442  sl 1382341373  incontent 8284992777  footer 2513791346
compress-video:        header 6971911109  sr 8887628006  sl 9069259701  incontent 6261464667  footer 2326089088
transcode-to-hls:      header 9404530532  sr 9406502758  sl 5559287316  incontent 2974853558  footer 6778367197
transcode-to-dash:     header 5465285526  sr 5371432124  sl 4798842202  incontent 4096363537  footer 9212958840
convert-video-to-animated-gif: header 9157118526  sr 8839903841  sl 2933123975  incontent 6530955187  footer 5217873513
video-converter:       header 5273713833  sr 2647550493  sl 9306960634  incontent 2745268785  footer 1278628505
extract-audio-from-video: header 6022168818  sr 6780339419  sl 5349883844  incontent 5082142140  footer 3769060475
extract-video-only-from-video: header 1528012737  sr 9119105442  sl 9472961683  incontent 5830597129  footer 6588767722
extract-frames-from-video: header 3962604382  sr 9023359379  sl 7993878966  incontent 7325162103  footer 5179860435
stitch-audio-to-video: header 5639025439  sr 4038169153  sl 1077116822  incontent 4834730133  footer 3246316291
convert-wav-to-mp3:    header 2457951028  sr 1933234621  sl 2907553333  incontent 9620152953  footer 4325943762
isolate-vocals-from-song: header 8735962067  sr 1699780421  sl 2549980599  incontent 6109798726  footer 8640215994
audio-converter:       header 3387889318  sr 8582403451  sl 5397985302  incontent 9761725978  footer 7269321785
audio-waveform-generator: header 6760535411  sr 9759753757  sl 7592903805  incontent 8446672084  footer 5822480968
transcribe-video:      header 2170553718  sr 9857472045  sl 3511708479  incontent 2863172919  footer 3190475979
srt-generator:         header 7923927909  sr 5297764566  sl 6251524678  incontent 2671601221  footer 8251230961
caption-translator:    header 4643158449  sr 1508208736  sl 6554777002  incontent 3330076774  footer 9703913435
ai-frame-interpolation: header 6304329719  sr 8645449800  sl 7332368138  incontent 1048133602  footer 3666935380
remove-exif-metadata:  header 4311985957  sr 1685822610  sl 5373934576  incontent 6634896969  footer 7379105216
```

(`sr` = sidebar_right, `sl` = sidebar_left)

## Deprecated placeholders — do not render

Before this cleanup, `lib/adSlots.ts` contained **221** `PLACEHOLDER-*` strings.
They followed the naming pattern:

```
PLACEHOLDER-<tool-slug>-<placement>
e.g. PLACEHOLDER-convert-png-to-jpg-header
     PLACEHOLDER-image-to-pdf-incontent
```

They covered these (then-unprovisioned) tool slugs across header/sidebar_right/
sidebar_left/incontent/footer placements:

> convert-png-to-jpg, convert-jpg-to-png, convert-webp-to-png, convert-png-to-webp,
> convert-jpg-to-webp, jpg-converter, png-converter, image-resizer, compress-image,
> remove-background-from-image, image-to-pdf, convert-jpg-to-pdf, convert-png-to-pdf,
> pdf-to-jpg, pdf-to-png, pdf-converter, convert-heic-to-jpg, convert-avif-to-jpg,
> convert-avif-to-png, convert-svg-to-png, convert-png-to-svg, png-to-ico, svg-converter,
> mp4-converter, convert-mov-to-mp4, convert-webm-to-mp4, convert-avi-to-mp4,
> convert-mkv-to-mp4, convert-mp4-to-webm, mp4-to-mp3, video-to-mp3, mp4-to-gif,
> video-to-gif, gif-converter, video-compressor, compress-mp4, video-trimmer, mp4-trimmer,
> video-cutter, cut-video-online, crop-video, resize-video, rotate-video, remove-audio-from-video,
> plus `tools_index_content_studio_banner`.

**Policy:** Placeholder strings are removed from all runtime source. When a real
unit is provisioned for one of these tools, add the numeric slot here and to
`lib/adSlots.ts`. Never substitute a placeholder string into `data-ad-slot`.

> The complete original mapping also lives, unchanged, in the reference Vite
> repo at `media_manipulator_ui/src/lib/adSlots.ts`.
