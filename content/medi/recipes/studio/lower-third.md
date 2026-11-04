---
id: "lower-third"
editor: "studio"
title: "Lower-third name title"
intents: ["add a lower third", "name and title on screen", "show who is speaking", "add a name caption", "interview name tag"]
difficulty: "basic"
ops_example: true
tools: ["content-studio"]
---

## When to use

Introducing a speaker, place or topic.

## What a pro does and why

A designed lower-third sits in the bottom 30 % of the frame, left-aligned inside the safe margin, with a bold name line and a smaller role line on a subtle bar, slides in over about 0.4 s, stays 4 to 6 s and fades out. Keep to two lines and one accent colour.

## Ops

```json
{
  "summary": "Lower-third: name and role",
  "ops": [
    {"op": "add_title", "template": "lowerThird", "lines": ["Alex Morgan", "Producer"], "start": 2, "duration": 5, "style": {"fontFamily": "Montserrat", "fillColor": "#FFFFFF", "backgroundColor": "#111111", "backgroundOpacity": 0.6}, "animateIn": "slideLeft", "animateOut": "fade"}
  ]
}
```

## How to adjust

More branded: an accent `backgroundColor`. Calmer: `animateIn` "fade". Too small: `fontSizePx` 56 in style. Lower: the template already keeps a safe margin; say so if the user asks to go to the very edge.
