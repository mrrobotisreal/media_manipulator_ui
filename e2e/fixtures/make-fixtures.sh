#!/usr/bin/env bash
# make-fixtures.sh - generates the E2E media fixtures with ffmpeg.
#
# WORKSTATION-ONLY (like the whole e2e suite). Deterministic synthetic sources, so
# no media binaries live in git (e2e/fixtures/.gitignore). Tiny on purpose: the
# suite exercises the editor and the server pipeline, not encode throughput.
set -euo pipefail

cd "$(dirname "$0")"
command -v ffmpeg >/dev/null || { echo "ffmpeg is required on PATH" >&2; exit 1; }

# 320x180@30, 3 s, H.264 + AAC (two different test patterns so a split/transition is visible).
ffmpeg -y -hide_banner -loglevel error \
  -f lavfi -i "testsrc2=s=320x180:r=30:d=3" -f lavfi -i "sine=frequency=440:d=3" \
  -c:v libx264 -preset veryfast -crf 28 -pix_fmt yuv420p -c:a aac -shortest -movflags +faststart clipA.mp4
ffmpeg -y -hide_banner -loglevel error \
  -f lavfi -i "testsrc=s=320x180:r=30:d=3" -f lavfi -i "sine=frequency=660:d=3" \
  -c:v libx264 -preset veryfast -crf 28 -pix_fmt yuv420p -c:a aac -shortest -movflags +faststart clipB.mp4

# 2 s mono WAV for the audio-import path.
ffmpeg -y -hide_banner -loglevel error -f lavfi -i "sine=frequency=330:d=2" -ac 1 tone.wav

echo "fixtures written to $(pwd): clipA.mp4 clipB.mp4 tone.wav"
