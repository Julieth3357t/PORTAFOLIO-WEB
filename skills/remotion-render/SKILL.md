---
name: remotion-render
description: CLI video rendering, Lambda cloud rendering, encoding presets (H.264, ProRes, WebM), and performance concurrency optimization in Remotion.
---

# Remotion Rendering & Export Skill

Origin: `remotion-dev/skills`

Render Remotion compositions locally via CLI or at scale using AWS Lambda and serverless workers.

---

## 1. CLI Render Commands

```bash
# Render high-quality MP4 video
npx remotion render src/index.ts PortfolioPromo out/promo.mp4 \
  --codec=h264 \
  --crf=18 \
  --concurrency=8

# Render transparent WebM video (for web overlays)
npx remotion render src/index.ts OverlayAnimation out/overlay.webm \
  --codec=vp8 \
  --image-format=png

# Render high-resolution still image at frame 60
npx remotion still src/index.ts PortfolioPromo out/thumbnail.jpeg --frame=60
```

---

## 2. Dynamic Props via CLI
Pass runtime parameters dynamically during render:
```bash
npx remotion render src/index.ts PortfolioPromo out/promo.mp4 \
  --props='{"title": "Custom Project Title"}'
```

