---
name: hyperframes-cli
description: CLI tooling and workflow for Hyperframes. Project initialization, live dev preview server, batch rendering, and FFmpeg video export commands.
---

# Hyperframes CLI Skill

Origin: `heygen-com/hyperframes`

Command-line interface operations for building and rendering Hyperframes video compositions.

---

## 1. Primary Commands
```bash
# Initialize a new video project
npx hyperframes init my-video

# Start local interactive dev server with live timeline scrubbing
npx hyperframes dev

# Render composition to MP4 video
npx hyperframes render --output dist/final-video.mp4 --fps 60 --quality high

# Render high-resolution thumbnail at frame 45
npx hyperframes thumbnail --frame 45 --output dist/thumbnail.png
```

---

## 2. Configuration (`hyperframes.config.json`)
```json
{
  "width": 1080,
  "height": 1920,
  "fps": 60,
  "durationInFrames": 300,
  "entry": "src/index.html",
  "ffmpeg": {
    "crf": 18,
    "codec": "libx264",
    "pixelFormat": "yuv420p"
  }
}
```

