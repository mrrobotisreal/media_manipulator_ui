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

# Reversed copy of srcA (part 17): stands in for the server's reversed preview
# proxy in the capture leg of the speed_reverse scenario.
ffmpeg -y -hide_banner -loglevel error \
  -i srcA.mp4 -vf reverse "${VID_ARGS[@]}" srcA_rev.mp4

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

# Still-image fixtures (MM15). Both are 8-bit sRGB only (16-bit PNG / CMYK JPEG
# decode differently across ffmpeg versions and are out of scope).
# still.png: 640x360 RGBA — blue field whose alpha ramps 0 -> 255 left to right,
# with centred text, so the alpha-over-video scenario shows the backdrop through
# the left half. drawtext uses fontconfig's default face (any face is fine: both
# pipelines decode the same PNG).
ffmpeg -y -hide_banner -loglevel error \
  -f lavfi -i "color=c=0x3060C0:s=640x360,format=rgba,geq=r='r(X,Y)':g='g(X,Y)':b='b(X,Y)':a='255*X/W',drawtext=text='DARKROOM':fontsize=72:fontcolor=white:x=(w-tw)/2:y=(h-th)/2" \
  -frames:v 1 -pix_fmt rgba still.png

# photo.jpg: frame 0 of srcA.mp4 with the bt709 -> sRGB conversion BAKED IN
# (scale in_color_matrix=bt709 -> rgb24), then JPEG-encoded. The browser decodes
# JPEGs as sRGB and ffmpeg as full-range JFIF, so no matrix guess remains.
ffmpeg -y -hide_banner -loglevel error \
  -i srcA.mp4 -frames:v 1 -vf "scale=in_color_matrix=bt709:out_range=full,format=rgb24" -q:v 2 photo.jpg

echo "fixtures ready: $(ls -m *.mp4 *.m4a *.png *.jpg)"
