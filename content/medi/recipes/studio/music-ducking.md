---
id: "music-ducking"
editor: "studio"
title: "Duck music under speech"
intents: ["music is too loud when they talk", "lower the music under voice", "duck the music", "background music balance", "voice over music mix"]
difficulty: "intermediate"
ops_example: true
tools: ["adjust-audio-volume"]
---

## When to use

Music and speech play together.

## What a pro does and why

Professional mixes keep music 15 to 20 dB under speech while someone talks and bring it back in the gaps. Darkroom's auto-ducking pulls non-voice tracks down while the voice track plays: about 9 to 12 dB, fast attack, slower release so it does not pump.

## Ops

```json
{
  "summary": "Duck music under voice",
  "ops": [
    {"op": "set_ducking", "enabled": true, "voiceTrack": "A1", "amountDb": 12, "attackMs": 120, "releaseMs": 500}
  ]
}
```

## How to adjust

Music still competes: amountDb 15. Pumping: releaseMs 800. Music too quiet between lines: amountDb 8. Overall music level: `set_volume` on its track, -6 dB.
