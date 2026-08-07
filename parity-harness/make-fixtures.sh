#!/usr/bin/env bash
# make-fixtures.sh — generates the parity-harness media fixtures with ffmpeg.
#
# WORKSTATION-ONLY (like the whole harness): run this once on the Ubuntu
# workstation before `npm run parity`. Fixtures are deterministic synthetic
# sources (testsrc2 / testsrc / color / sine), so no media binaries live in git
# — the only committed fixture is fixtures/fixture.cube (text).
#
# Determinism note: a fixture regenerated with a different ffmpeg build may
# encode slightly differently, but BOTH pipelines decode the same file, so the
# comparison stays apples-to-apples. Regenerating fixtures is always safe.
set -euo pipefail

cd "$(dirname "$0")/fixtures"

command -v ffmpeg >/dev/null || { echo "ffmpeg is required on PATH" >&2; exit 1; }
[ -f fixture.cube ] || { echo "fixtures/fixture.cube missing — it is committed; check your checkout" >&2; exit 1; }

# 640x360@30, 4 s, near-lossless High-profile 4:2:0 (Chromium cannot decode the
# Hi444PP profile that -qp 0 lossless would select, hence -crf 1), tagged bt709
# so the browser and ffmpeg agree on the YUV↔RGB matrix.
VID_ARGS=(-pix_fmt yuv420p -c:v libx264 -preset veryfast -crf 1
  -colorspace bt709 -color_primaries bt709 -color_trc bt709 -movflags +write_colr+faststart)

# Main content clip.
ffmpeg -y -hide_banner -loglevel error \
  -f lavfi -i "testsrc2=s=640x360:r=30:d=4" "${VID_ARGS[@]}" srcA.mp4

# Second, visually distinct clip (dissolve/blend partner).
ffmpeg -y -hide_banner -loglevel error \
  -f lavfi -i "testsrc=s=640x360:r=30:d=4" "${VID_ARGS[@]}" srcB.mp4

# Green-screen fixture: pure #00FF00 backdrop with a centered testsrc2 window.
ffmpeg -y -hide_banner -loglevel error \
  -f lavfi -i "color=c=0x00FF00:s=640x360:r=30:d=4" \
  -f lavfi -i "testsrc2=s=320x180:r=30:d=4" \
  -filter_complex "[0][1]overlay=x=160:y=90" "${VID_ARGS[@]}" green.mp4

# Audio fixtures for the ducking scene (codec quality is irrelevant — audio
# parity is audible-equivalence only; these just exercise the export graph).
ffmpeg -y -hide_banner -loglevel error \
  -f lavfi -i "sine=frequency=220:sample_rate=48000:duration=4" -c:a aac -b:a 128k bed.m4a
ffmpeg -y -hide_banner -loglevel error \
  -f lavfi -i "sine=frequency=880:sample_rate=48000:duration=4" -c:a aac -b:a 128k voice.m4a

echo "fixtures ready: $(ls -m *.mp4 *.m4a)"
