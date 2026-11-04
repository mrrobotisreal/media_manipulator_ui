---
id: "lut-intensity-video"
editor: "studio"
title: "Use a LUT without overdoing it"
intents: ["my lut is too strong", "apply a lut", "use a .cube file", "blend the lut", "lut looks harsh"]
difficulty: "basic"
ops_example: false
tools: ["adjust-video-color", "apply-lut-to-photo"]
---

## When to use

The user has a .cube LUT or wants one.

## What a pro does and why

Creative LUTs are often built for log footage; on normal phone video they crush blacks and oversaturate. Mix them at 40 to 70 % with the LUT effect intensity and correct exposure before the LUT, not after.

## Ops

The LUT itself must be uploaded to the media bin by the user (Medi cannot create one). Once a LUT effect exists, a keyframe op can lower it: `set_keyframes` on property `<lutEffectId>.intensity` (the LUT effect id from the digest), or ask the user to set the intensity slider to about 0.6.

## How to adjust

Still harsh: 0.4. Skin wrong: grade exposure and temperature first, then re-apply the LUT.
