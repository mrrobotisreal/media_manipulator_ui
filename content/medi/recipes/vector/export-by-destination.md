---
id: "export-by-destination"
editor: "vector"
title: "Choose the export for the destination"
intents: ["how should I export this", "export for my website", "lottie or gif", "export for a react app", "export a video of my animation"]
difficulty: "basic"
ops_example: false
tools: ["motion"]
---

## When to use

The user asks which export format to use.

## What a pro does and why

Websites: animated SVG (CSS) is the lightest; use the animation-runtime export when blur, morph or motion paths are involved. Apps: Lottie for iOS/Android/Flutter players, or the React/TSX or Flutter code exports. Social or video editors: MP4 or WebM. Chat and email: GIF (largest file, limited colours). Image sequences for compositing: PNG sequence. Some formats depend on the plan; quote availability only from the live plan block.

## Ops

No op list. Answer with the recommendation and `suggest_action {kind: "export"}` so the user opens the export dialog.

## How to adjust

GIF too big: shorten the loop or lower the size. Lottie warnings: some effects (blur, masks) have limited Lottie support; prefer SVG or video.
