## When to use
Send visitors here when they want an MPEG-DASH streaming bundle: a manifest.mpd with per-rendition init and media segments, encoded in AV1 or VP9, to serve from a CDN or origin. Phrasings like "make a DASH manifest", "AV1 streaming files" or "mpd for my player" fit.

## When not to use
For Apple-style HLS playlists with .ts segments, use Transcode Video to HLS (transcode-to-hls). For a single smaller video file rather than a streaming package, use Compress Video (compress-video).

## Related
- transcode-to-hls: HLS package with m3u8 playlists
- compress-video: one smaller file instead of a bundle
- video-converter: change to a single container or codec
- video-trimmer: cut the source before packaging
