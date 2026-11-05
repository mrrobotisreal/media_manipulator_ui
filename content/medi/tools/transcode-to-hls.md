## When to use
Send visitors here when they want a video packaged for HLS adaptive streaming: a master.m3u8 playlist plus per-quality .ts segments to host on a web server or CDN. Phrasings like "make an m3u8", "HLS ladder for my site" or "adaptive bitrate streaming files" fit.

## When not to use
For one smaller file to send or embed, use Compress Video (compress-video). For an open-standard DASH package with AV1 or VP9, use Transcode Video to DASH (transcode-to-dash). It produces a finished on-demand package, not a live stream.

## Related
- transcode-to-dash: MPEG-DASH package with AV1 or VP9
- compress-video: single smaller file instead of segments
- video-trimmer: cut the source before packaging
- ai-video-restoration: clean up low-quality source first
